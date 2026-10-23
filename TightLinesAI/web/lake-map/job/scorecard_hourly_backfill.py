#!/usr/bin/env python3
"""Build private hourly observation means paired to OFS nowcasts."""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import math
import os
import re
import statistics
import subprocess
import time
import urllib.error
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import h5py
import numpy as np
import pyarrow as pa
import pyarrow.parquet as pq
from scipy.io import netcdf_file

import scorecard_addon_backfill as addon
import scorecard_fields_backfill as fields
import scorecard_public_backfill as public
import scorecard_pairing
import scorecard_store
from lakemap import store

UTC = timezone.utc
STREAM = "backfill_hourly"
METHODOLOGY = "public-scorecard-hourly-v1"
USER_AGENT = "FinFindr-scorecard-hourly/1.0 (+https://finfindr.app)"


def revision():
    value = os.environ.get("GITHUB_SHA", "").strip().lower()
    if len(value) == 40:
        return value
    return subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=Path(__file__).resolve().parents[4], text=True,
    ).strip().lower()


def station_classes():
    path = Path(__file__).parent / "research/stations_v1.csv"
    output = {}
    with path.open(newline="") as stream:
        for row in csv.DictReader(stream):
            for identity in (row["station_id"], *(row.get("alternate_station_ids") or "").split(";")):
                if identity:
                    output[identity] = row["station_class"]
    return output


def hour_mean_rows(rows, day, classes=None):
    lower = datetime.combine(day, datetime.min.time(), UTC)
    upper = lower + timedelta(days=1)
    groups = defaultdict(list)
    seen = set()
    for row in rows:
        classification = (classes or {}).get(row["identity"], scorecard_pairing.station_class(row))
        depth, assumed = scorecard_pairing.sensor_depth(row, classification)
        if depth > scorecard_pairing.SURFACE_MAX_DEPTH_M:
            continue
        observed = row["observed"]
        identity = (row["identity"], row.get("parameterId"), observed, row.get("waterF"))
        if identity in seen:
            continue
        seen.add(identity)
        valid = (observed + timedelta(minutes=30)).replace(minute=0, second=0, microsecond=0)
        value = row.get("waterF")
        if lower <= valid < upper and isinstance(value, (int, float)) and math.isfinite(value):
            groups[(row["identity"], valid)].append((row, classification, depth, assumed))
    output = []
    for (_, valid), members in sorted(groups.items()):
        representative, classification, depth, assumed = members[0]
        flags = sorted({flag for row, *_ in members for flag in row.get("qualityFlags", [])})
        physical = representative.get("physicalIdentity")
        sensor_key = (f"{physical}|depth:{representative.get('depthKey', 'unknown')}" if physical
                      else f"{representative['identity']}|depth:{representative.get('depthKey', 'unknown')}|{representative['source']}")
        wind_rows = [row for row, *_ in members if isinstance(row.get("windMph"), (int, float))]
        representative = {
            "station_id": representative["identity"], "sensor_key": sensor_key,
            "station_name": representative.get("name"), "station_class": classification,
            "raw_station_type": representative.get("type"), "source": "backfill",
            "observation_source": representative.get("source"),
            "waterbody": representative.get("body") or "unknown",
            "station_lat": representative.get("lat"), "station_lon": representative.get("lon"),
            "sensor_depth_m": depth, "model_depth_m": 0.0, "depth_method": "surface_layer",
            "depth_assumed": assumed, "parameter_id": representative.get("parameterId"),
            "first_collected_at": public.iso(representative["firstCollected"]),
            "source_quality": representative.get("waterQuality") or "unknown",
            "quality_flags": flags,
            "strict_quality": (all(row.get("waterQuality") in {"good", "provider_qc"} for row, *_ in members)
                               and not {"station_suspect_day", "invalid_position", "invalid_position_station_day"}.intersection(flags)),
            "wind_speed_mph": (sum(row["windMph"] for row in wind_rows) / len(wind_rows)) if wind_rows else None,
            "wind_from_degrees": wind_rows[0].get("windFrom") if wind_rows else None,
            "wind_observed_at": public.iso(valid) if wind_rows else None,
            "wind_offset_minutes": 0.0 if wind_rows else None,
        }
        representative["observation_time"] = public.iso(valid)
        representative["observed_temperature_f"] = sum(
            float(row["waterF"]) for row, *_ in members) / len(members)
        representative["obs_count_in_hour"] = len(members)
        output.append(representative)
    return output


class NowcastCache:
    def __init__(self, root):
        self.root = root
        self.root.mkdir(parents=True, exist_ok=True)
        self.field = fields.ArchivedFieldSampler(root / "fields")
        self.files = {}
        self.station_data = {}
        self.missing_station_files = set()
        self.errors = 0

    @staticmethod
    def names(model, cycle):
        legacy = f"nos.{model}.stations.nowcast.{cycle:%Y%m%d}.t{cycle:%H}z.nc"
        current = f"{model}.t{cycle:%H}z.{cycle:%Y%m%d}.stations.nowcast.nc"
        return legacy if cycle < public.CURRENT_MODEL_START else current, current

    @staticmethod
    def nodd_url(model, cycle, name):
        directory = cycle.strftime("%Y/%m/%d") if cycle.year >= 2025 else cycle.strftime("%Y%m")
        return f"https://noaa-nos-ofs-pds.s3.amazonaws.com/{model}/netcdf/{directory}/{name}"

    def station_file(self, model, cycle):
        request_key = (model, cycle)
        if request_key in self.missing_station_files:
            raise RuntimeError("nowcast file unavailable category=cached")
        if request_key in self.files:
            return self.files[request_key]
        ncei_name, nodd_name = self.names(model, cycle)
        path = self.root / "stations" / model / f"{cycle:%Y%m}" / nodd_name
        source_path = path.with_suffix(path.suffix + ".source")
        if path.exists() and path.stat().st_size:
            answer = (path.read_bytes(), source_path.read_text().strip() if source_path.exists() else "ncei")
            self.files[request_key] = answer
            return answer
        ncei = (f"https://www.ncei.noaa.gov/thredds/fileServer/{public.NCEI_ROOTS[model]}/"
                f"{cycle:%Y/%m}/{ncei_name}")
        last = None
        for url, source in ((ncei, "ncei"), (self.nodd_url(model, cycle, nodd_name), "nodd")):
            for attempt in range(3):
                try:
                    request = urllib.request.Request(url, headers={"user-agent": USER_AGENT})
                    with urllib.request.urlopen(request, timeout=180) as response:
                        body = response.read()
                    if not body.startswith((b"CDF", b"\x89HDF")):
                        raise ValueError("not NetCDF")
                    path.parent.mkdir(parents=True, exist_ok=True)
                    path.write_bytes(body)
                    source_path.write_text(source + "\n")
                    answer = (body, source)
                    self.files[request_key] = answer
                    return answer
                except Exception as error:
                    last = error
                    if isinstance(error, urllib.error.HTTPError) and 400 <= error.code < 500:
                        break
                    if attempt < 2:
                        time.sleep(attempt + 1)
        self.missing_station_files.add(request_key)
        raise RuntimeError(f"nowcast file unavailable category={type(last).__name__}")

    @staticmethod
    def _dataset(body):
        return netcdf_file(io.BytesIO(body), "r", mmap=False) if body.startswith(b"CDF") else h5py.File(io.BytesIO(body), "r")

    @staticmethod
    def _time_datetimes(variable):
        raw_units = getattr(variable, "units", None)
        if raw_units is None and hasattr(variable, "attrs"):
            raw_units = variable.attrs.get("units")
        units = raw_units.decode() if isinstance(raw_units, bytes) else str(raw_units)
        match = re.match(r"(seconds|minutes|hours|days) since (.+)", units)
        if not match:
            raise ValueError("unsupported time units")
        base_text = match.group(2).replace("UTC", "").strip().replace(" ", "T")
        base = datetime.fromisoformat(base_text).replace(tzinfo=UTC)
        scale = {"seconds": 1, "minutes": 60, "hours": 3600, "days": 86400}[match.group(1)]
        return [base + timedelta(seconds=float(value) * scale) for value in np.asarray(variable[:]).reshape(-1)]

    def station_value(self, row, valid):
        model = public.MODELS.get(row.get("waterbody"))
        if not model:
            return None
        cycle = valid + timedelta(hours=(6 - valid.hour % 6) % 6)
        cycle = cycle.replace(minute=0, second=0, microsecond=0)
        cache_key = (model, cycle)
        if cache_key not in self.station_data:
            try:
                body, source = self.station_file(model, cycle)
            except RuntimeError:
                return None
            dataset = self._dataset(body)
            try:
                variables = dataset.variables
                self.station_data[cache_key] = {
                    "source": source, "times": self._time_datetimes(variables["time"]),
                    "lat": np.asarray(variables["lat"][:], dtype=float).reshape(-1),
                    "lon": np.asarray(variables["lon"][:], dtype=float).reshape(-1),
                    "temp": np.asarray(variables["temp"][:], dtype=float),
                }
            finally:
                dataset.close()
        data = self.station_data[cache_key]
        times, source = data["times"], data["source"]
        try:
            time_index = min(range(len(times)), key=lambda index: abs((times[index] - valid).total_seconds()))
            if abs((times[time_index] - valid).total_seconds()) > 301:
                return None
            lat = data["lat"]
            lon = data["lon"]
            lon = np.where(lon > 180, lon - 360, lon)
            target_lat, target_lon = float(row["station_lat"]), float(row["station_lon"])
            distance2 = (lat - target_lat) ** 2 + ((lon - target_lon) * math.cos(math.radians(target_lat))) ** 2
            station = int(np.nanargmin(distance2))
            distance = public.verify.distance_km(
                {"lat": target_lat, "lon": target_lon}, {"lat": float(lat[station]), "lon": float(lon[station])})
            if distance > public.verify.MAX_MODEL_CELL_DISTANCE_KM:
                return None
            value_c = float(data["temp"][time_index, 0, station])
            if not math.isfinite(value_c) or not -2 <= value_c <= 40:
                return None
            nowcast_hour = 6 - int((cycle - valid).total_seconds() / 3600)
            return value_c, cycle, source, float(lat[station]), float(lon[station]), distance, nowcast_hour
        except (ValueError, IndexError, KeyError):
            return None

    def field_value(self, row, valid):
        model = public.MODELS.get(row.get("waterbody"))
        if not model:
            return None
        _, cycle, slot = fields.nowcast_request(public.iso(valid))
        location = self.field.locate(model, cycle, float(row["station_lat"]), float(row["station_lon"]))
        if location is None:
            return None
        node, model_lat, model_lon, distance = location
        value_c, source = self.field.value_with_source((model, cycle, slot, node))
        if value_c is None:
            return None
        return value_c, cycle, source, model_lat, model_lon, distance, slot


def pair_hours(rows, sampler):
    sampled_rows = []
    unresolved = []
    for row in rows:
        valid = public.parse_time(row["observation_time"])
        sampled = sampler.station_value(row, valid)
        if sampled is None:
            unresolved.append((row, valid))
        else:
            sampled_rows.append((row, valid, sampled, "station_file"))
    # Initialize each model grid serially, then parallelize independent point
    # reads. This keeps geometry caches deterministic and avoids hundreds of
    # serial one-value OPeNDAP requests per day.
    initialized = set()
    for row, valid in unresolved:
        model = public.MODELS.get(row.get("waterbody"))
        if model and model not in initialized:
            _, cycle, _ = fields.nowcast_request(public.iso(valid))
            sampler.field.locate(model, cycle, float(row["station_lat"]), float(row["station_lon"]))
            initialized.add(model)
    with ThreadPoolExecutor(max_workers=8) as executor:
        field_samples = list(executor.map(lambda item: sampler.field_value(*item), unresolved))
    for (row, valid), sampled in zip(unresolved, field_samples):
        if sampled is not None:
            sampled_rows.append((row, valid, sampled, "field_node"))
    output = []
    for row, valid, sampled, method in sampled_rows:
        value_c, archive_cycle, source, model_lat, model_lon, distance, nowcast_hour = sampled
        result = dict(row)
        result.update({
            "model_cycle": public.iso(valid), "model_issued_at": public.iso(archive_cycle),
            "nowcast_hour": nowcast_hour,
            "valid_time": public.iso(valid), "lead_hours": 0.0,
            "lower_model_hour": 0, "upper_model_hour": 0,
            "time_interpolation_fraction": 0.0, "observation_offset_minutes": 0.0,
            "run_id": f"hourly-nowcast/{public.MODELS[row['waterbody']]}/{archive_cycle:%Y%m%d%H}/n{nowcast_hour:03d}",
            "model_version": (f"{public.MODELS[row['waterbody']].upper()}:"
                              f"{public.CURRENT_MODEL_VERSION if archive_cycle >= public.CURRENT_MODEL_START else public.LEGACY_MODEL_VERSION}"),
            "model_temperature_f": value_c * 1.8 + 32, "model_depth_m": 0.0,
            "depth_method": "surface_layer", "model_lat": model_lat, "model_lon": model_lon,
            "model_distance_km": distance, "pair_status": "paired", "sample_method": method,
            "methodology_version": METHODOLOGY, "model_source": source,
        })
        output.append(result)
    return output


def marker_exists(s3, bucket, day_text):
    try:
        s3.head_object(Bucket=bucket, Key=scorecard_store.done_marker_key(STREAM, day_text, METHODOLOGY))
        return True
    except Exception as error:
        if (getattr(error, "response", {}) or {}).get("ResponseMetadata", {}).get("HTTPStatusCode") == 404:
            return False
        raise


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", required=True, type=date.fromisoformat)
    parser.add_argument("--end", required=True, type=date.fromisoformat)
    parser.add_argument("--cache", type=Path, default=Path(os.environ.get("SCORECARD_HOURLY_CACHE", "/tmp/finfindr-hourly-cache")))
    parser.add_argument("--store", action="store_true")
    parser.add_argument("--skip-existing-r2", action="store_true")
    args = parser.parse_args(argv)
    if args.end < args.start:
        parser.error("end precedes start")
    bucket = store.bucket()
    if bucket in {"", "piercast-lake-map"}:
        raise SystemExit("refusing unset or production map bucket")
    s3, sampler, code_version = store.client(), NowcastCache(args.cache), revision()
    root = Path(__file__).resolve().parents[1]
    datasets, parameters, coops = public.load_catalogs(root)
    start = datetime.combine(args.start, datetime.min.time(), UTC)
    end = datetime.combine(args.end + timedelta(days=1), datetime.min.time(), UTC) - timedelta(microseconds=1)
    collection_start, collection_end = start - timedelta(days=1), end + timedelta(days=1)
    source_cache = public.PublicCache(args.cache / "sources")
    quarantine, accounting = public.SourceQuarantine(), public.SourceAccounting()
    observations = []
    observations += public.collect_ndbc(source_cache, collection_start, collection_end, datasets, quarantine, accounting)
    observations += public.collect_glos(source_cache, collection_start, collection_end, datasets, parameters, quarantine, accounting)
    observations += public.collect_coops(source_cache, collection_start, collection_end, coops, quarantine, accounting)
    public.apply_station_suspect_days(observations, quarantine)
    observations = public.dedupe_and_qc(observations)
    classes = station_classes()
    day, days, rows_total, started = args.start, 0, 0, time.monotonic()
    station_day_rows, stations_by_class = [], defaultdict(set)
    while day <= args.end:
        day_text = day.isoformat()
        if args.skip_existing_r2 and marker_exists(s3, bucket, day_text):
            print(f"Hourly day={day_text} status=r2_skip")
            day += timedelta(days=1)
            continue
        report = accounting.summary(day_text)
        print("Hourly source-accounting " + json.dumps({"day": day_text, **report}, sort_keys=True))
        if accounting.has_errors(day_text):
            print(f"Hourly day={day_text} status=paused reason=source_fetch_error")
            return 5
        means = hour_mean_rows(observations, day, classes)
        before = sampler.errors + sampler.field.fetch_errors
        records = pair_hours(means, sampler)
        public.apply_invalid_position_station_day(records)
        errors = sampler.errors + sampler.field.fetch_errors - before
        if errors:
            print(f"Hourly day={day_text} status=paused reason=source_fetch_error errors={errors}")
            return 5
        digest = hashlib.sha256(json.dumps(records, sort_keys=True, separators=(",", ":"), default=str).encode()).hexdigest()
        for record in records:
            record["evidence_key"] = f"public-hourly/v1/{day_text}.json"
            record["evidence_sha256"] = digest
        validation = addon.validate_research_records(records)
        if validation["invalidRows"]:
            print("Hourly day=" + day_text + " status=invalid " + json.dumps(
                {"count": validation["invalidRows"], "violations": validation["violations"]}, sort_keys=True))
            return 2
        if args.store:
            manifest = scorecard_store.write_fragment(records, STREAM, day_text, digest, s3=s3,
                environment=os.environ, methodology_version=METHODOLOGY, code_version=code_version)
            scorecard_store.write_done_marker(manifest, METHODOLOGY, code_version, s3, os.environ)
        days += 1; rows_total += len(records)
        counts = defaultdict(int)
        for record in records:
            counts[record["station_id"]] += 1
            stations_by_class[record["station_class"]].add(record["station_id"])
        station_day_rows.extend(counts.values())
        print(f"Hourly day={day_text} status={'stored' if args.store else 'validated'} observations={len(means)} rows={len(records)} errors=0")
        day += timedelta(days=1)
    elapsed = time.monotonic() - started
    print(json.dumps({"status": "complete", "days": days, "rows": rows_total,
                      "medianRowsPerStationDay": statistics.median(station_day_rows) if station_day_rows else 0,
                      "stationsByClass": {key: len(value) for key, value in sorted(stations_by_class.items())},
                      "secondsPerDay": elapsed / max(days, 1), "errors": 0}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
