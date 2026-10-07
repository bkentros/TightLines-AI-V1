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
from collections import defaultdict
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
LEADS = (0, 24, 72, 120)
CYCLES = (0, 12)
MAX_OFFSET_MINUTES = 30
USER_AGENT = "FinFindr-scorecard-backfill/1.0 (+https://finfindr.app)"
NDBC_STATIONS = """45001 45002 45003 45004 45005 45006 45007 45008 45012 45013 45014 45022 45023
45024 45025 45026 45027 45028 45029 45161 45162 45163 45164 45165 45167 45168 45170 45174 45175
45176 45186 45187 45198 45199 45200 45210 45211 45212 45213 45214 45215 45216""".split()


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
                 depth_m=None, parameter=None, quality="unknown", wind=None):
    return {
        "identity": identity, "id": identity, "externalId": identity.split(":")[-1],
        "name": name, "source": source, "body": body, "type": kind,
        "lat": float(lat), "lon": float(lon), "observed": observed,
        "waterTime": iso(observed), "waterF": float(water_f), "waterDepthM": depth_m,
        "waterSurface": depth_m is not None and depth_m <= 1.5,
        "waterQuality": quality, "parameterId": parameter,
        "depthKey": f"{depth_m:.2f}m" if depth_m is not None else "unknown",
        "firstCollected": observed, "qualityFlags": [], **(wind or {}),
    }


def collect_ndbc(cache, start, end, datasets):
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
        url = f"https://www.ndbc.noaa.gov/data/realtime2/{station}.txt"
        body = cache.get(f"ndbc-{station}.txt", url)
        if not body:
            continue
        lines = body.decode("utf-8", "replace").splitlines()
        if len(lines) < 3:
            continue
        headers = lines[0].lstrip("#").split()
        index = {name: headers.index(name) for name in headers}
        for line in lines[2:]:
            values = line.split()
            try:
                observed = datetime(*(int(values[index[key]]) for key in ("YY", "MM", "DD", "hh", "mm")), tzinfo=UTC)
                water_c = float(values[index["WTMP"]])
            except (KeyError, ValueError, IndexError):
                continue
            if not start <= observed <= end or not -2 <= water_c <= 40:
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
            rows.append(_observation(
                f"external:{station}", meta["name"], "NOAA NDBC", meta["body"], meta["type"],
                meta["lat"], meta["lon"], observed, water_c * 9 / 5 + 32,
                quality="provider_qc", wind=wind,
            ))
    return rows


def collect_coops(cache, start, end, stations):
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
                    water_c = float(item["v"])
                    flags = [value for value in str(item.get("f", "")).split(",") if value]
                except (KeyError, ValueError):
                    continue
                if not start <= observed <= end or not -2 <= water_c <= 40:
                    continue
                quality = "provider_qc" if flags and all(flag == "0" for flag in flags) else "unknown"
                rows.append(_observation(
                    f"coops:{station['id']}", station["name"], "NOAA CO-OPS", station["body"], "fixed",
                    station["lat"], station["lon"], observed, water_c * 9 / 5 + 32, quality=quality,
                ))
        cursor = stop + timedelta(seconds=1)
    return rows


def collect_glos(cache, start, end, datasets, parameters):
    latest = cache.get("glos-obs-latest.json", "https://seagull-api.glos.org/api/v2/obs-latest")
    if not latest:
        return []
    active = json.loads(latest)
    rows = []
    for dataset_row in active:
        dataset_id = str(dataset_row.get("obs_dataset_id"))
        meta = datasets.get(dataset_id)
        if not meta:
            continue
        ids = sorted({str(group.get("parameter_id")) for group in dataset_row.get("parameters", [])})
        for parameter_id in ids:
            parameter = parameters.get(parameter_id)
            if not parameter:
                continue
            variable = parameter.get("name")
            if not variable or not re.fullmatch(r"[A-Za-z0-9_]+", variable):
                continue
            select = urllib.parse.quote(f"time,longitude,latitude,{variable}", safe=",")
            constraints = (f"&time%3E={urllib.parse.quote(iso(start))}"
                           f"&time%3C={urllib.parse.quote(iso(end))}&orderBy(%22time%22)")
            url = f"https://seagull-erddap.glos.org/erddap/tabledap/obs_{dataset_id}.csv?{select}{constraints}"
            body = cache.get(f"glos-{dataset_id}-{parameter_id}.csv", url, timeout=180, quiet=True)
            if not body:
                continue
            parsed = list(csv.reader(io.StringIO(body.decode("utf-8", "replace"))))
            if len(parsed) < 3:
                continue
            header, units = parsed[0], parsed[1]
            columns = {name: index for index, name in enumerate(header)}
            if not all(name in columns for name in ("time", variable)):
                continue
            unit = units[columns[variable]].lower()
            for values in parsed[2:]:
                try:
                    observed = parse_time(values[columns["time"]])
                    raw = float(values[columns[variable]])
                    lat = float(values[columns["latitude"]]) if "latitude" in columns else float(meta["lat"])
                    lon = float(values[columns["longitude"]]) if "longitude" in columns else float(meta["lon"])
                except (ValueError, IndexError):
                    continue
                water_c = raw - 273.15 if unit in ("k", "kelvin") or raw > 100 else raw
                if not start <= observed <= end or not -2 <= water_c <= 40:
                    continue
                depth = parameter.get("depthM")
                depth = float(depth) if isinstance(depth, (int, float)) and depth >= 0 else None
                rows.append(_observation(
                    f"glos:{dataset_id}", meta["name"], "GLOS Seagull", meta["body"], meta["type"],
                    lat, lon, observed, water_c * 9 / 5 + 32, depth, parameter_id, "unknown",
                ))
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

    @staticmethod
    def key(model, cycle, hour):
        return (f"{model}/netcdf/{cycle:%Y/%m/%d}/"
                f"{model}.t{cycle:%H}z.{cycle:%Y%m%d}.fields.f{hour:03d}.nc")

    def _open(self, key):
        path = f"noaa-nos-ofs-pds/{key}"
        if not self.fs.exists(path):
            return None, None
        stream = self.fs.open(path, "rb", block_size=1024 * 1024, cache_type="readahead")
        return stream, self.h5py.File(stream, "r")

    def grid(self, model, sample_cycle):
        if model in self.grids:
            return self.grids[model]
        path = self.cache_root / f"grid-{model}.npz"
        if path.exists():
            data = np.load(path)
            lat, lon, bottom, sigma = (data[name] for name in ("lat", "lon", "bottom", "sigma"))
        else:
            stream, dataset = self._open(self.key(model, sample_cycle, 0))
            if dataset is None:
                return None
            try:
                lat = np.asarray(dataset["lat"], dtype=np.float64)
                lon = np.asarray(dataset["lon"], dtype=np.float64)
                lon = np.where(lon > 180, lon - 360, lon)
                bottom = np.asarray(dataset["h"], dtype=np.float64)
                sigma = np.asarray(dataset["siglay"], dtype=np.float64)
            finally:
                dataset.close(); stream.close()
            np.savez_compressed(path, lat=lat, lon=lon, bottom=bottom, sigma=sigma)
        valid = np.isfinite(lat) & np.isfinite(lon) & np.isfinite(bottom) & (bottom > 0)
        indices = np.flatnonzero(valid)
        coords = np.column_stack((lat[indices], lon[indices] * np.cos(np.radians(lat[indices]))))
        grid = {"lat": lat, "lon": lon, "bottom": bottom, "sigma": sigma,
                "indices": indices, "tree": cKDTree(coords)}
        self.grids[model] = grid
        return grid

    def locate(self, model, cycle, observation):
        grid = self.grid(model, cycle)
        if grid is None:
            return None
        query = (observation["lat"], observation["lon"] * math.cos(math.radians(observation["lat"])))
        _, tree_index = grid["tree"].query(query)
        node = int(grid["indices"][int(tree_index)])
        model_point = {"lat": float(grid["lat"][node]), "lon": float(grid["lon"][node])}
        distance = verify.distance_km(observation, model_point)
        if distance > verify.MAX_MODEL_CELL_DISTANCE_KM:
            return None
        return {"node": node, "modelLat": model_point["lat"], "modelLon": model_point["lon"],
                "modelDistanceKm": distance, "bottomM": float(grid["bottom"][node]),
                "levelsM": -grid["sigma"][:, node] * float(grid["bottom"][node])}

    def profiles(self, model, cycle, hour, nodes):
        if not nodes:
            return {}
        stream, dataset = self._open(self.key(model, cycle, hour))
        if dataset is None:
            return {}
        ordered = sorted(set(nodes))
        try:
            values = np.asarray(dataset["temp"][0, :, ordered], dtype=np.float64)
        except Exception:
            return {}
        finally:
            dataset.close(); stream.close()
        if values.shape == (len(ordered), 20):
            values = values.T
        return {node: values[:, index] for index, node in enumerate(ordered)}


def build_pairs(day, observations, sampler):
    pairs = []
    for cycle_hour in CYCLES:
        cycle = datetime.combine(day, datetime.min.time(), UTC).replace(hour=cycle_hour)
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
                    location = sampler.locate(model, cycle, observation) if model else None
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
                    if model_f is not None:
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
                        "modelVersion": f"{model.upper() if model else 'GLOFS-uncovered'}:COMF-3.6:2024-09-09",
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
    if "ndbc" in sources:
        observations += collect_ndbc(cache, start, end, datasets)
    if "glos" in sources:
        observations += collect_glos(cache, start, end, datasets, parameters)
    if "coops" in sources:
        observations += collect_coops(cache, start, end, coops)
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
            print(f"Backfill day={day_text} status=invalid count={validation['invalidRows']}")
            return 2
        for record in records:
            totals[record["pair_status"]] += 1
        if args.sync:
            result = scorecard.sync_evidence(evidence, f"public-backfill/v1/{day_text}.json", digest,
                                             environment=environment)
            if result.get("status") != "committed" or result.get("recordCount") != len(records):
                print(f"Backfill day={day_text} status=degraded category={result.get('failureCategory','network')}")
                return 3
            checkpoint.setdefault("completed", []).append(day_text)
            checkpoint["completed"] = sorted(set(checkpoint["completed"]))
            checkpoint_path.write_text(json.dumps(checkpoint, indent=2) + "\n")
        print(f"Backfill day={day_text} status={'committed' if args.sync else 'dry_run'} records={len(records)}")
    print(json.dumps({"status": "complete", "days": len(checkpoint.get("completed", [])) if args.sync else 0,
                      "counts": dict(sorted(totals.items()))}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
