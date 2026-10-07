#!/usr/bin/env python3
"""One-off, resumable public-archive backfill for the private scorecard.

The command runs on an owner's workstation. It never reads R2, never writes a
map object, and has no scheduled/Actions entry. NOAA model files are read with
anonymous S3 byte ranges; observations come from public NDBC, GLOS ERDDAP and
CO-OPS endpoints. ``--sync`` is required before the existing private ingest
function is called.
"""
from __future__ import annotations

import argparse
import bisect
import csv
import gzip
import hashlib
import io
import json
import math
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import numpy as np
from scipy.spatial import cKDTree

import scorecard
import scorecard_pairing
import scorecard_schema
import verify
from lakemap.depth import profile_at

UTC = timezone.utc
MODELS = {
    "lake-michigan": "lmhofs", "lake-huron": "lmhofs",
    "lake-erie": "leofs", "lake-ontario": "loofs", "lake-superior": "lsofs",
}
CURRENT_MODEL_START = datetime(2024, 9, 16, 15, tzinfo=UTC)
NCEI_ROOTS = {
    "lmhofs": "model-lmhofs-files", "leofs": "model-leofs",
    "loofs": "model-loofs-files", "lsofs": "model-lsofs-files",
}
MODEL_LEVELS = {"lmhofs": 20, "leofs": 20, "loofs": 21, "lsofs": 21}
LEADS = (0, 24, 72, 120)
CYCLES = (0, 12)
MAX_OFFSET_MINUTES = 30
MAX_QUARANTINE_FRACTION = 0.02
USER_AGENT = "FinFindr-scorecard-backfill/1.0 (+https://finfindr.app)"
NDBC_STATIONS = """45001 45002 45003 45004 45005 45006 45007 45008 45012 45013 45014 45022 45023
45024 45025 45026 45027 45028 45029 45161 45162 45163 45164 45165 45167 45168 45170 45174 45175
45176 45186 45187 45198 45199 45200 45210 45211 45212 45213 45214 45215 45216""".split()


class SourceQuarantine:
    """Count malformed public records without retaining payloads or identifiers."""

    def __init__(self):
        self.overall = Counter()
        self.by_day = defaultdict(Counter)

    def add(self, reason, observed=None):
        self.overall[reason] += 1
        if isinstance(observed, datetime):
            self.by_day[observed.date().isoformat()][reason] += 1

    def day(self, value):
        return dict(sorted(self.by_day.get(value, {}).items()))


def iso(value):
    return value.astimezone(UTC).isoformat().replace("+00:00", "Z")


def parse_time(value):
    return datetime.fromisoformat(str(value).replace("Z", "+00:00")).astimezone(UTC)


def read_env(path):
    values = {}
    if not path:
        return values
    for raw in Path(path).read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip("'\"")
    return values


def _json_export(text, name, next_name=None):
    end = rf";\s*export const {next_name}" if next_name else r";?\s*$"
    match = re.search(rf"export const {name}=(\{{.*?\}}){end}", text, re.S)
    if not match:
        raise ValueError(f"catalog missing {name}")
    return json.loads(match.group(1))


def load_catalogs(root):
    gate = root / "gate"
    glos_text = (gate / "glos-catalog.js").read_text()
    datasets = _json_export(glos_text, "GLOS_DATASETS", "GLOS_TEMP_PARAMETERS")
    params = _json_export(glos_text, "GLOS_TEMP_PARAMETERS")
    coops_text = (gate / "coops-catalog.js").read_text()
    match = re.search(r"COOPS_STATIONS\s*=\s*(\[.*\]);", coops_text, re.S)
    if not match:
        raise ValueError("catalog missing COOPS_STATIONS")
    return datasets, params, json.loads(match.group(1))


class PublicCache:
    def __init__(self, root):
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

    def get(self, name, url, timeout=90, quiet=False):
        path = self.root / name
        if path.exists() and path.stat().st_size:
            return path.read_bytes()
        request = urllib.request.Request(url, headers={"user-agent": USER_AGENT})
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                body = response.read()
        except Exception as error:
            category = scorecard._failure_category(error=error)
            if not quiet:
                print(f"Backfill source unavailable category={category} source={name}")
            return None
        path.write_bytes(body)
        return body


def _observation(identity, name, source, body, kind, lat, lon, observed, water_f,
                 depth_m=None, parameter=None, quality="unknown", wind=None,
                 quality_flags=None):
    def coordinate(value, low, high):
        try:
            number = float(value)
        except (TypeError, ValueError):
            return None
        return number if math.isfinite(number) and low <= number <= high else None

    latitude = coordinate(lat, -90, 90)
    longitude = coordinate(lon, -180, 180)
    flags = list(quality_flags or [])
    if (latitude is None or longitude is None) and not flags:
        flags.append("invalid_position")
    return {
        "identity": identity, "id": identity, "externalId": identity.split(":")[-1],
        "name": name, "source": source, "body": body, "type": kind,
        # Preserve an unusable source position as null. Never substitute catalog
        # coordinates or another station's position: it is evidence we could not
        # spatially pair, not permission to fabricate a location.
        "lat": latitude, "lon": longitude, "observed": observed,
        "waterTime": iso(observed), "waterF": float(water_f), "waterDepthM": depth_m,
        "waterSurface": depth_m is not None and depth_m <= 1.5,
        "waterQuality": quality, "parameterId": parameter,
        "depthKey": f"{depth_m:.2f}m" if depth_m is not None else "unknown",
        "firstCollected": observed, "qualityFlags": flags, **(wind or {}),
    }


def _ndbc_sources(station, start, end, today=None):
    today = today or datetime.now(UTC).date()
    current_month = today.replace(day=1)
    sources = []
    for year in range(start.year, end.year + 1):
        if year < today.year:
            sources.append((
                f"ndbc-{station}-{year}-annual.txt.gz",
                f"https://www.ndbc.noaa.gov/data/historical/stdmet/{station}h{year}.txt.gz",
            ))
            continue
        if year > today.year:
            continue
        month_cursor = date(year, start.month if start.year == year else 1, 1)
        final_month = date(year, end.month, 1)
        while month_cursor <= final_month and month_cursor <= current_month:
            if month_cursor == current_month:
                sources.append((
                    f"ndbc-{station}-{year}-realtime.txt",
                    f"https://www.ndbc.noaa.gov/data/realtime2/{station}.txt",
                ))
            else:
                month_name = month_cursor.strftime("%b")
                sources.append((
                    f"ndbc-{station}-{year}-{month_cursor.month:02d}-direct.txt.gz",
                    f"https://www.ndbc.noaa.gov/data/stdmet/{month_name}/"
                    f"{station}{month_cursor.month}{year}.txt.gz",
                ))
            month_cursor = (month_cursor.replace(day=28) + timedelta(days=4)).replace(day=1)
    return sources


def collect_ndbc(cache, start, end, datasets, quarantine=None):
    quarantine = quarantine or SourceQuarantine()
    metadata_body = cache.get(
        "ndbc-stationmetadata.xml",
        "https://www.ndbc.noaa.gov/metadata/stationmetadata.xml",
    )
    position_history = defaultdict(list)
    if metadata_body:
        try:
            root = ET.fromstring(metadata_body)
            for station_node in root.findall("station"):
                station_id = str(station_node.get("id") or "").upper()
                for history in station_node.findall("history"):
                    try:
                        start_at = date.fromisoformat(history.get("start"))
                        stop_at = date.fromisoformat(history.get("stop")) if history.get("stop") else None
                        latitude = float(history.get("lat"))
                        longitude = float(history.get("lng"))
                    except (TypeError, ValueError):
                        continue
                    if math.isfinite(latitude) and math.isfinite(longitude):
                        position_history[station_id].append((start_at, stop_at, latitude, longitude))
        except ET.ParseError:
            pass

    def position(station_id, observed):
        for start_at, stop_at, latitude, longitude in position_history.get(station_id, []):
            if start_at <= observed.date() and (stop_at is None or observed.date() < stop_at):
                return latitude, longitude
        return None, None
    by_external = {}
    for item in datasets.values():
        external = str(item.get("externalId") or "").upper()
        if external:
            by_external.setdefault(external, item)
    rows = []
    for station in NDBC_STATIONS:
        meta = by_external.get(station)
        if not meta or meta.get("body") not in MODELS:
            continue
        sources = _ndbc_sources(station, start, end)
        for cache_name, url in sources:
            body = cache.get(cache_name, url, quiet=True)
            if not body:
                continue
            if cache_name.endswith(".txt.gz") and body[:2] != b"\x1f\x8b":
                # Some legacy NDBC form URLs return an HTML selection page with
                # HTTP 200. It is not source data and must not enter quarantine.
                continue
            try:
                text = gzip.decompress(body).decode("utf-8", "replace") if body[:2] == b"\x1f\x8b" else body.decode("utf-8", "replace")
            except (OSError, UnicodeError):
                continue
            lines = text.splitlines()
            if len(lines) < 3:
                continue
            headers = lines[0].lstrip("#").split()
            index = {name: headers.index(name) for name in headers}
            for line in lines[2:]:
                values = line.split()
                try:
                    observed = datetime(*(int(values[index[key]]) for key in ("YY", "MM", "DD", "hh", "mm")), tzinfo=UTC)
                except (KeyError, ValueError, IndexError):
                    quarantine.add("invalid_timestamp")
                    continue
                try:
                    raw_water = values[index["WTMP"]].strip()
                except (KeyError, ValueError, IndexError):
                    continue
                if raw_water.upper() in {"", "MM", "NAN", "999", "999.0"}:
                    continue
                try:
                    water_c = float(raw_water)
                except ValueError:
                    quarantine.add("impossible_temperature", observed)
                    continue
                if not start <= observed <= end:
                    continue
                if not math.isfinite(water_c) or not -2 <= water_c <= 40:
                    quarantine.add("impossible_temperature", observed)
                    continue
                wind = {}
                try:
                    speed = float(values[index["WSPD"]])
                    direction = float(values[index["WDIR"]])
                    if 0 <= speed <= 112 and 0 <= direction <= 360:
                        wind = {"windMph": speed * 2.23694, "windFrom": direction,
                                "windObserved": observed, "windOffsetHours": 0.0}
                except (KeyError, ValueError, IndexError):
                    pass
                latitude, longitude = position(station, observed)
                rows.append(_observation(
                    f"external:{station}", meta["name"], "NOAA NDBC", meta["body"], meta["type"],
                    latitude, longitude, observed, water_c * 9 / 5 + 32,
                    quality="provider_qc", wind=wind,
                    quality_flags=["missing_position"] if latitude is None or longitude is None else None,
                ))
    return rows


def collect_coops(cache, start, end, stations, quarantine=None):
    quarantine = quarantine or SourceQuarantine()
    rows = []
    cursor = start
    while cursor <= end:
        stop = min(end, cursor + timedelta(days=30) - timedelta(seconds=1))
        for station in stations:
            query = urllib.parse.urlencode({
                "begin_date": cursor.strftime("%Y%m%d %H:%M"),
                "end_date": stop.strftime("%Y%m%d %H:%M"), "station": station["id"],
                "product": "water_temperature", "datum": "IGLD", "time_zone": "gmt",
                "units": "metric", "interval": "h", "format": "json", "application": "FinFindr",
            })
            name = f"coops-{station['id']}-{cursor:%Y%m%d}-{stop:%Y%m%d}.json"
            body = cache.get(name, f"https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?{query}")
            if not body:
                continue
            try:
                payload = json.loads(body)
            except ValueError:
                continue
            for item in payload.get("data", []):
                try:
                    observed = parse_time(item["t"].replace(" ", "T") + "Z")
                except (KeyError, ValueError):
                    quarantine.add("invalid_timestamp")
                    continue
                try:
                    raw_water = str(item["v"]).strip()
                except (KeyError, TypeError, ValueError):
                    continue
                if raw_water.upper() in {"", "NAN", "NULL"}:
                    continue
                try:
                    water_c = float(raw_water)
                except ValueError:
                    quarantine.add("impossible_temperature", observed)
                    continue
                flags = [value for value in str(item.get("f", "")).split(",") if value]
                if not start <= observed <= end:
                    continue
                if not math.isfinite(water_c) or not -2 <= water_c <= 40:
                    quarantine.add("impossible_temperature", observed)
                    continue
                quality = "provider_qc" if flags and all(flag == "0" for flag in flags) else "unknown"
                rows.append(_observation(
                    f"coops:{station['id']}", station["name"], "NOAA CO-OPS", station["body"], "fixed",
                    station["lat"], station["lon"], observed, water_c * 9 / 5 + 32, quality=quality,
                ))
        cursor = stop + timedelta(seconds=1)
    return rows


def collect_glos(cache, start, end, datasets, parameters, quarantine=None):
    quarantine = quarantine or SourceQuarantine()
    latest = cache.get("glos-obs-latest.json", "https://seagull-api.glos.org/api/v2/obs-latest")
    if not latest:
        return []
    active = json.loads(latest)
    tasks = []
    for dataset_row in active:
        dataset_id = str(dataset_row.get("obs_dataset_id"))
        meta = datasets.get(dataset_id)
        if not meta:
            continue
        ids = sorted({str(group.get("parameter_id")) for group in dataset_row.get("parameters", [])})
        for parameter_id in ids:
            parameter = parameters.get(parameter_id)
            if parameter:
                cursor = start
                while cursor <= end:
                    stop = min(end, cursor + timedelta(days=89, hours=23, minutes=59, seconds=59))
                    tasks.append((dataset_id, meta, parameter_id, parameter, cursor, stop))
                    cursor = stop + timedelta(seconds=1)

    def fetch(task):
        dataset_id, meta, parameter_id, parameter, slice_start, slice_end = task
        variable = parameter.get("name")
        if not variable or not re.fullmatch(r"[A-Za-z0-9_]+", variable):
            return []
        select = urllib.parse.quote(f"time,longitude,latitude,{variable}", safe=",")
        constraints = (f"&time%3E={urllib.parse.quote(iso(slice_start))}"
                       f"&time%3C={urllib.parse.quote(iso(slice_end))}&orderBy(%22time%22)")
        url = f"https://seagull-erddap.glos.org/erddap/tabledap/obs_{dataset_id}.csv?{select}{constraints}"
        range_key = f"{slice_start:%Y%m%d}-{slice_end:%Y%m%d}"
        body = cache.get(f"glos-{dataset_id}-{parameter_id}-{range_key}.csv", url,
                         timeout=180, quiet=True)
        if not body:
            return []
        parsed = list(csv.reader(io.StringIO(body.decode("utf-8", "replace"))))
        if len(parsed) < 3:
            return []
        header, units = parsed[0], parsed[1]
        columns = {name: index for index, name in enumerate(header)}
        if not all(name in columns for name in ("time", variable)):
            return []
        unit = units[columns[variable]].lower()
        output = []
        for values in parsed[2:]:
            try:
                observed = parse_time(values[columns["time"]])
            except (ValueError, IndexError):
                quarantine.add("invalid_timestamp")
                continue
            try:
                raw_text = values[columns[variable]].strip()
            except (ValueError, IndexError):
                continue
            if raw_text.upper() in {"", "NAN", "NULL"}:
                continue
            try:
                raw = float(raw_text)
            except ValueError:
                quarantine.add("impossible_temperature", observed)
                continue
            lat = values[columns["latitude"]] if "latitude" in columns and columns["latitude"] < len(values) else None
            lon = values[columns["longitude"]] if "longitude" in columns and columns["longitude"] < len(values) else None
            water_c = raw - 273.15 if unit in ("k", "kelvin") or raw > 100 else raw
            if not start <= observed <= end:
                continue
            if not math.isfinite(water_c) or not -2 <= water_c <= 40:
                quarantine.add("impossible_temperature", observed)
                continue
            depth = parameter.get("depthM")
            depth = float(depth) if isinstance(depth, (int, float)) and depth >= 0 else None
            output.append(_observation(
                f"glos:{dataset_id}", meta["name"], "GLOS Seagull", meta["body"], meta["type"],
                lat, lon, observed, water_c * 9 / 5 + 32, depth, parameter_id, "unknown",
            ))
        return output

    rows = []
    # Four workers keep the one-off polite to ERDDAP while preventing hundreds
    # of independent table slices from becoming an hours-long serial preamble.
    with ThreadPoolExecutor(max_workers=4) as executor:
        for result in executor.map(fetch, tasks):
            rows.extend(result)
    return rows


def dedupe_and_qc(rows):
    unique = {}
    for row in rows:
        key = (row["identity"], row.get("parameterId"), row["observed"], row["depthKey"], row["source"])
        unique[key] = row
    output = sorted(unique.values(), key=lambda item: (item["observed"], item["identity"], item["depthKey"]))
    verify.annotate_quality_flags(output)
    return output


def nearest_observations(rows, target):
    by_sensor = defaultdict(list)
    for row in rows:
        by_sensor[(row["identity"], row.get("parameterId"), row["depthKey"], row["source"])].append(row)
    selected = []
    for values in by_sensor.values():
        times = [item["observed"] for item in values]
        position = bisect.bisect_left(times, target)
        candidates = values[max(0, position - 1):position + 1]
        if not candidates:
            continue
        best = min(candidates, key=lambda item: abs((item["observed"] - target).total_seconds()))
        if abs((best["observed"] - target).total_seconds()) <= MAX_OFFSET_MINUTES * 60:
            selected.append(best)
    return selected


class PublicModelSampler:
    def __init__(self, cache_root):
        try:
            import h5py
            import s3fs
        except ImportError as error:
            raise RuntimeError("one-off backfill requires h5py and s3fs") from error
        self.h5py, self.fs = h5py, s3fs.S3FileSystem(anon=True, client_kwargs={"region_name": "us-east-1"})
        self.cache_root = Path(cache_root)
        self.cache_root.mkdir(parents=True, exist_ok=True)
        self.grids = {}
        self.sources = {}

    @staticmethod
    def key(model, cycle, hour, product="fields"):
        directory = cycle.strftime("%Y/%m/%d") if cycle.year >= 2025 else cycle.strftime("%Y%m")
        return (f"{model}/netcdf/{directory}/"
                f"{model}.t{cycle:%H}z.{cycle:%Y%m%d}.{product}.f{hour:03d}.nc")

    def _open(self, key):
        path = f"noaa-nos-ofs-pds/{key}"
        if not self.fs.exists(path):
            return None, None
        stream = self.fs.open(path, "rb", block_size=1024 * 1024, cache_type="readahead")
        return stream, self.h5py.File(stream, "r")

    def source_kind(self, model, cycle, hour):
        cache_key = (model, cycle, hour)
        if cache_key in self.sources:
            return self.sources[cache_key]
        kind = None
        if self.fs.exists(f"noaa-nos-ofs-pds/{self.key(model, cycle, hour)}"):
            kind = "native"
        elif self.fs.exists(f"noaa-nos-ofs-pds/{self.key(model, cycle, hour, 'regulargrid')}"):
            kind = "regulargrid"
        elif hour == 0 and cycle >= CURRENT_MODEL_START:
            kind = "ncei_nowcast"
        self.sources[cache_key] = kind
        return kind

    def grid(self, model, sample_cycle, kind="native"):
        grid_key = (model, "regulargrid" if kind == "regulargrid" else "native")
        if grid_key in self.grids:
            return self.grids[grid_key]
        suffix = "-regulargrid" if kind == "regulargrid" else ""
        path = self.cache_root / f"grid-{model}{suffix}.npz"
        if path.exists():
            data = np.load(path)
            lat, lon, bottom, sigma = (data[name] for name in ("lat", "lon", "bottom", "sigma"))
        else:
            product = "regulargrid" if kind == "regulargrid" else "fields"
            stream, dataset = self._open(self.key(model, sample_cycle, 0, product))
            if dataset is None and kind != "regulargrid":
                # NCEI supplies historical node profiles but not a standalone
                # grid endpoint. Bootstrap the invariant current-version grid
                # from a recent public AWS field when the requested forecast
                # itself has expired. This affects geometry only, never values.
                today = datetime.now(UTC).replace(hour=0, minute=0, second=0, microsecond=0)
                for offset in range(0, 91):
                    candidate = today - timedelta(days=offset)
                    stream, dataset = self._open(self.key(model, candidate, 0))
                    if dataset is not None:
                        break
            if dataset is None:
                return None
            try:
                if kind == "regulargrid":
                    lat = np.asarray(dataset["Latitude"], dtype=np.float64).reshape(-1)
                    lon = np.asarray(dataset["Longitude"], dtype=np.float64).reshape(-1)
                    bottom = np.asarray(dataset["h"], dtype=np.float64).reshape(-1)
                    sigma = np.asarray(dataset["Depth"], dtype=np.float64)
                    mask = np.asarray(dataset["mask"], dtype=np.float64).reshape(-1)
                    bottom = np.where(mask > 0, bottom, np.nan)
                else:
                    lat = np.asarray(dataset["lat"], dtype=np.float64)
                    lon = np.asarray(dataset["lon"], dtype=np.float64)
                    bottom = np.asarray(dataset["h"], dtype=np.float64)
                    sigma = np.asarray(dataset["siglay"], dtype=np.float64)
                lon = np.where(lon > 180, lon - 360, lon)
            finally:
                dataset.close(); stream.close()
            np.savez_compressed(path, lat=lat, lon=lon, bottom=bottom, sigma=sigma)
        valid = np.isfinite(lat) & np.isfinite(lon) & np.isfinite(bottom) & (bottom > 0)
        indices = np.flatnonzero(valid)
        coords = np.column_stack((lat[indices], lon[indices] * np.cos(np.radians(lat[indices]))))
        grid = {"lat": lat, "lon": lon, "bottom": bottom, "sigma": sigma,
                "indices": indices, "tree": cKDTree(coords), "kind": kind}
        self.grids[grid_key] = grid
        return grid

    def locate(self, model, cycle, observation):
        latitude = observation.get("lat")
        longitude = observation.get("lon")
        if not (isinstance(latitude, (int, float)) and math.isfinite(latitude) and
                isinstance(longitude, (int, float)) and math.isfinite(longitude)):
            return None
        kind = self.source_kind(model, cycle, 0)
        if kind is None:
            return None
        grid = self.grid(model, cycle, kind)
        if grid is None:
            return None
        query = (observation["lat"], observation["lon"] * math.cos(math.radians(observation["lat"])))
        _, tree_index = grid["tree"].query(query)
        node = int(grid["indices"][int(tree_index)])
        model_point = {"lat": float(grid["lat"][node]), "lon": float(grid["lon"][node])}
        distance = verify.distance_km(observation, model_point)
        if distance > verify.MAX_MODEL_CELL_DISTANCE_KM:
            return None
        if kind == "regulargrid":
            levels = grid["sigma"]
        else:
            levels = -grid["sigma"][:, node] * float(grid["bottom"][node])
        return {"node": node, "modelLat": model_point["lat"], "modelLon": model_point["lon"],
                "modelDistanceKm": distance, "bottomM": float(grid["bottom"][node]),
                "levelsM": levels, "sourceKind": kind}

    def _ncei_profile(self, model, cycle, node):
        root = NCEI_ROOTS[model]
        name = f"{model}.t{cycle:%H}z.{cycle:%Y%m%d}.fields.n006.nc"
        constraint = urllib.parse.quote(
            f"temp[0:1:0][0:1:{MODEL_LEVELS[model] - 1}][{node}:1:{node}]", safe="[]:"
        )
        url = (f"https://www.ncei.noaa.gov/thredds/dodsC/{root}/{cycle:%Y/%m}/"
               f"{name}.ascii?{constraint}")
        request = urllib.request.Request(url, headers={"user-agent": USER_AGENT})
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                text = response.read().decode("utf-8", "replace")
        except Exception:
            return None
        values = [float(value) for value in re.findall(r"\]\s*,\s*(-?[0-9]+(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?)", text)]
        if not values:
            return None
        result = np.asarray(values, dtype=np.float64)
        result[(result < -100) | (result > 60)] = np.nan
        return result

    def profiles(self, model, cycle, hour, nodes):
        if not nodes:
            return {}
        kind = self.source_kind(model, cycle, hour)
        if kind == "ncei_nowcast":
            output = {}
            with ThreadPoolExecutor(max_workers=8) as executor:
                for node, values in zip(sorted(set(nodes)), executor.map(
                        lambda item: self._ncei_profile(model, cycle, item), sorted(set(nodes)))):
                    if values is not None:
                        output[node] = values
            return output
        if kind is None:
            return {}
        product = "regulargrid" if kind == "regulargrid" else "fields"
        stream, dataset = self._open(self.key(model, cycle, hour, product))
        if dataset is None:
            return {}
        ordered = sorted(set(nodes))
        try:
            if kind == "regulargrid":
                width = dataset["temp"].shape[3]
                values = np.column_stack([
                    np.asarray(dataset["temp"][0, :, node // width, node % width], dtype=np.float64)
                    for node in ordered
                ])
            else:
                values = np.asarray(dataset["temp"][0, :, ordered], dtype=np.float64)
        except Exception:
            return {}
        finally:
            dataset.close(); stream.close()
        values[(values < -100) | (values > 60)] = np.nan
        if values.ndim == 2 and values.shape[0] == len(ordered) and values.shape[1] <= 30:
            values = values.T
        return {node: values[:, index] for index, node in enumerate(ordered)}


def build_pairs(day, observations, sampler):
    pairs = []
    for cycle_hour in CYCLES:
        cycle = datetime.combine(day, datetime.min.time(), UTC).replace(hour=cycle_hour)
        if cycle < CURRENT_MODEL_START:
            continue
        for canonical_lead in LEADS:
            target = cycle + timedelta(hours=canonical_lead)
            selected = nearest_observations(observations, target)
            by_model = defaultdict(list)
            for observation in selected:
                model = MODELS.get(observation.get("body"))
                by_model[model].append(observation)
            for model, model_rows in by_model.items():
                locations, requests = {}, defaultdict(set)
                for observation in model_rows:
                    lead = (observation["observed"] - cycle).total_seconds() / 3600
                    if not 0 <= lead <= 120:
                        continue
                    lower, upper = math.floor(lead), math.ceil(lead)
                    invalid_position = bool({"invalid_position", "missing_position"}.intersection(
                        observation.get("qualityFlags", [])))
                    location = sampler.locate(model, cycle, observation) if model and not invalid_position else None
                    locations[id(observation)] = (location, lead, lower, upper)
                    if location:
                        requests[lower].add(location["node"]); requests[upper].add(location["node"])
                profiles = {hour: sampler.profiles(model, cycle, hour, nodes)
                            for hour, nodes in requests.items()} if model else {}
                for observation in model_rows:
                    state = locations.get(id(observation))
                    if state is None:
                        continue
                    location, lead, lower, upper = state
                    classification = scorecard_pairing.station_class(observation)
                    depth_m, assumed = scorecard_pairing.sensor_depth(observation, classification)
                    fraction = lead - lower if upper != lower else 0.0
                    first = profiles.get(lower, {}).get(location["node"]) if location else None
                    second = profiles.get(upper, {}).get(location["node"]) if location else None
                    model_f = None
                    if first is not None and second is not None:
                        try:
                            if depth_m <= scorecard_pairing.SURFACE_MAX_DEPTH_M:
                                a, b = float(first[0]), float(second[0])
                            else:
                                a = profile_at(first, location["levelsM"], location["bottomM"], depth_m)
                                b = profile_at(second, location["levelsM"], location["bottomM"], depth_m)
                            value_c = a + (b - a) * fraction
                            if math.isfinite(value_c):
                                model_f = value_c * 9 / 5 + 32
                        except (ValueError, IndexError):
                            model_f = None
                    invalid_position = bool({"invalid_position", "missing_position"}.intersection(
                        observation.get("qualityFlags", [])))
                    if invalid_position:
                        pair_status = "uncovered"
                        depth_method = "surface_layer" if depth_m <= 1.5 else "pending_3d"
                        sample_method = "uncovered"
                        model_f = None
                    elif model_f is not None:
                        pair_status, depth_method, sample_method = (
                            "paired", "surface_layer" if depth_m <= 1.5 else "interpolated_3d", "interpolated_3d")
                    elif depth_m > 1.5:
                        pair_status, depth_method, sample_method = "pending_3d", "pending_3d", "pending_3d"
                    else:
                        pair_status, depth_method, sample_method = "uncovered", "surface_layer", "uncovered"
                    wind_offset = observation.get("windOffsetHours")
                    wind_ok = isinstance(wind_offset, (int, float)) and wind_offset <= 1.5
                    pairs.append({
                        "run": f"public-{model or 'uncovered'}-{cycle:%Y%m%dT%H}Z",
                        "cycle": iso(cycle), "issuedAt": iso(cycle), "validTime": iso(observation["observed"]),
                        "leadHour": lead, "lowerHour": lower, "upperHour": upper,
                        "timeInterpolationFraction": fraction, "station": observation["identity"],
                        "stationName": observation.get("name"), "stationLat": observation["lat"],
                        "stationLon": observation["lon"], "body": observation.get("body") or "unknown",
                        "observationSource": observation["source"], "recordSource": "backfill",
                        "quality": observation.get("waterQuality") or "unknown",
                        "parameterId": observation.get("parameterId"), "depthKey": observation["depthKey"],
                        "sensorDepthM": depth_m, "modelDepthM": 0.0 if depth_m <= 1.5 else depth_m,
                        "depthAssumed": assumed, "depthMethod": depth_method,
                        "observed": iso(observation["observed"]), "observedF": observation["waterF"],
                        "observationOffsetMinutes": 0.0, "stationType": classification,
                        "rawStationType": observation.get("type"),
                        "modelVersion": f"{model.upper() if model else 'GLOFS-uncovered'}:COMF-3.6:2024-09-16",
                        "modelLat": location.get("modelLat") if location else None,
                        "modelLon": location.get("modelLon") if location else None,
                        "modelDistanceKm": location.get("modelDistanceKm") if location else None,
                        "firstCollectedAt": iso(observation["firstCollected"]),
                        "qualityFlags": observation.get("qualityFlags", []),
                        "windMph": observation.get("windMph") if wind_ok else None,
                        "windFrom": observation.get("windFrom") if wind_ok else None,
                        "windObservedAt": iso(observation["windObserved"]) if wind_ok else None,
                        "windOffsetMinutes": wind_offset * 60 if wind_ok else None,
                        "pairStatus": pair_status, "forecastF": model_f,
                        "sampleMethod": sample_method,
                        "strict": observation.get("waterQuality") in ("good", "provider_qc") and depth_m <= 3,
                    })
    return pairs


def quarantine_summary(records, dropped=None):
    """Return bounded per-reason counts; never include source-row contents."""
    reasons = defaultdict(int)
    quarantined = 0
    for record in records:
        row_reasons = sorted({flag for flag in record.get("quality_flags", [])
                              if flag in {"invalid_position", "invalid_timestamp",
                                          "impossible_temperature", "missing_position"}})
        if not row_reasons:
            continue
        quarantined += 1
        for reason in row_reasons:
            reasons[reason] += 1
    for reason, count in (dropped or {}).items():
        reasons[reason] += count
        quarantined += count
    total = len(records) + sum((dropped or {}).values())
    return {"count": quarantined, "total": total,
            "fraction": quarantined / total if total else 0.0,
            "reasons": dict(sorted(reasons.items()))}


def save_checkpoint(path, checkpoint):
    path.write_text(json.dumps(checkpoint, indent=2, sort_keys=True) + "\n")


def pause_backfill(path, checkpoint, day_text, reason, **details):
    checkpoint["paused"] = {"day": day_text, "reason": reason, **details}
    save_checkpoint(path, checkpoint)


def daterange(start, end):
    cursor = start
    while cursor <= end:
        yield cursor
        cursor += timedelta(days=1)


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", type=date.fromisoformat, required=True)
    parser.add_argument("--end", type=date.fromisoformat, required=True)
    parser.add_argument("--cache", type=Path, default=Path("/tmp/finfindr-scorecard-public-backfill"))
    parser.add_argument("--env-file", type=Path)
    parser.add_argument("--sync", action="store_true")
    parser.add_argument("--sources", default="ndbc,glos,coops")
    args = parser.parse_args(argv)
    if args.end < args.start:
        parser.error("end precedes start")
    root = Path(__file__).resolve().parents[1]
    datasets, parameters, coops = load_catalogs(root)
    start = datetime.combine(args.start, datetime.min.time(), UTC)
    end = datetime.combine(args.end + timedelta(days=1), datetime.min.time(), UTC) - timedelta(microseconds=1)
    cache = PublicCache(args.cache / "sources")
    sources = {item.strip() for item in args.sources.split(",") if item.strip()}
    observations = []
    source_quarantine = SourceQuarantine()
    if "ndbc" in sources:
        observations += collect_ndbc(cache, start, end, datasets, source_quarantine)
    if "glos" in sources:
        observations += collect_glos(cache, start, end, datasets, parameters, source_quarantine)
    if "coops" in sources:
        observations += collect_coops(cache, start, end, coops, source_quarantine)
    observations = dedupe_and_qc(observations)
    print(f"Backfill observations={len(observations)} sensors={len({(r['identity'], r['depthKey']) for r in observations})}")
    sampler = PublicModelSampler(args.cache / "models")
    checkpoint_path = args.cache / "checkpoint.json"
    checkpoint = json.loads(checkpoint_path.read_text()) if checkpoint_path.exists() else {"completed": []}
    environment = {**os.environ, **read_env(args.env_file)}
    environment["LAKE_MAP_SCORECARD_ENABLED"] = "true"
    totals = defaultdict(int)
    for day in daterange(args.start, args.end):
        day_text = day.isoformat()
        if args.sync and day_text in checkpoint.get("completed", []):
            print(f"Backfill day={day_text} status=checkpoint_skip")
            continue
        pairs = build_pairs(day, observations, sampler)
        evidence = {"methodologyVersion": "public-scorecard-backfill-v1", "primaryPairs": pairs}
        body = json.dumps(evidence, separators=(",", ":"), sort_keys=True).encode()
        digest = hashlib.sha256(body).hexdigest()
        records = scorecard.records_from_evidence(evidence, f"public-backfill/v1/{day_text}.json", digest)
        validation = scorecard_schema.validate_records(records)
        if validation["invalidRows"]:
            if args.sync:
                pause_backfill(checkpoint_path, checkpoint, day_text, "constraint_violation",
                               invalidRows=validation["invalidRows"],
                               violations=validation["violations"])
            print(f"Backfill day={day_text} status=invalid count={validation['invalidRows']}")
            return 2
        quarantine = quarantine_summary(records, source_quarantine.day(day_text))
        print("Backfill quarantine " + json.dumps({"day": day_text, **quarantine}, sort_keys=True))
        if quarantine["fraction"] > MAX_QUARANTINE_FRACTION:
            if args.sync:
                pause_backfill(checkpoint_path, checkpoint, day_text, "quarantine_threshold",
                               count=quarantine["count"], total=quarantine["total"],
                               reasons=quarantine["reasons"])
            print(f"Backfill day={day_text} status=paused reason=quarantine_threshold")
            return 4
        for record in records:
            totals[record["pair_status"]] += 1
        if args.sync:
            prior = checkpoint.get("inProgress") or {}
            resume_batch = (int(prior.get("nextBatch", 0))
                            if prior.get("day") == day_text and
                            prior.get("digest") == digest and
                            prior.get("expected") == len(records) else 0)
            checkpoint["inProgress"] = {
                "day": day_text, "digest": digest, "expected": len(records),
                "nextBatch": resume_batch,
            }
            save_checkpoint(checkpoint_path, checkpoint)

            def progress(state):
                checkpoint["inProgress"] = {
                    "day": day_text, "digest": digest, "expected": len(records),
                    "nextBatch": int(state.get("nextBatch", resume_batch)),
                }
                save_checkpoint(checkpoint_path, checkpoint)

            result = scorecard.sync_evidence(
                evidence, f"public-backfill/v1/{day_text}.json", digest,
                environment=environment, resume_batch=resume_batch,
                progress_callback=progress,
            )
            if result.get("status") != "committed" or result.get("recordCount") != len(records):
                pause_backfill(checkpoint_path, checkpoint, day_text, "batch_or_count_failure",
                               category=result.get("failureCategory", "network"),
                               confirmed=result.get("recordCount", 0), expected=len(records),
                               batchIndex=result.get("batchIndex"))
                print(f"Backfill day={day_text} status=degraded category={result.get('failureCategory','network')}")
                return 3
            checkpoint.setdefault("completed", []).append(day_text)
            checkpoint["completed"] = sorted(set(checkpoint["completed"]))
            checkpoint.pop("paused", None)
            checkpoint.pop("inProgress", None)
            save_checkpoint(checkpoint_path, checkpoint)
        print(f"Backfill day={day_text} status={'committed' if args.sync else 'dry_run'} records={len(records)}")
    print(json.dumps({"status": "complete", "days": len(checkpoint.get("completed", [])) if args.sync else 0,
                      "counts": dict(sorted(totals.items())),
                      "sourceQuarantine": dict(sorted(source_quarantine.overall.items()))}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
