#!/usr/bin/env python3
"""Private research-only backfill for explicitly reviewed add-on stations."""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import math
import os
import re
import subprocess
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import numpy as np

import scorecard
import scorecard_public_backfill as public
import scorecard_schema
import scorecard_station_weather as weather
import scorecard_store
from lakemap import store

UTC = timezone.utc
STREAM = "backfill_addon"
METHODOLOGY = "public-scorecard-addon-v1"
USER_AGENT = "FinFindr-scorecard-addon/1.0 (+https://finfindr.app)"
ADDONS = {
    "external:45209": {"name": "Lakeport Buoy, MI", "lat": 43.129, "lon": -82.391,
                       "body": "lake-huron", "type": "moored_buoy"},
    "glerl:mkgpier": {"name": "Muskegon Pier", "lat": 43.227513, "lon": -86.33945,
                      "body": "lake-michigan", "type": "fixed"},
    "glerl:m45": {"name": "Muskegon M45 Buoy", "lat": 43.23241, "lon": -86.46748,
                  "body": "lake-michigan", "type": "moored_buoy"},
    "glos:10": {"name": "White Shoal Light", "lat": 45.84181, "lon": -85.1357,
                "body": "lake-michigan", "type": "tower"},
}


def iso(value: datetime) -> str:
    return value.astimezone(UTC).isoformat().replace("+00:00", "Z")


def revision():
    value = os.environ.get("GITHUB_SHA", "").strip().lower()
    if len(value) == 40:
        return value
    return subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=Path(__file__).resolve().parents[4], text=True,
    ).strip().lower()


def fetch(url: str, path: Path):
    if path.exists() and path.stat().st_size:
        return path.read_bytes()
    request = urllib.request.Request(url, headers={"user-agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=180) as response:
            body = response.read()
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return None
        raise
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(body)
    return body


def glerl_csv_rows(station: str, start: datetime, end: datetime, cache: Path):
    config = {
        "mkgpier": ("mich-mkgpier", "temp_hadcp.csv", "glerl:mkgpier", 3.0),
        "m45": ("mich-bio", "temp_ysi.csv", "glerl:m45", 0.0),
    }[station]
    directory, filename, identity, depth = config
    meta = ADDONS[identity]
    rows = []
    for year in range(start.year, end.year + 1):
        url = f"https://www.glerl.noaa.gov/res/recon/data/bystation/{directory}/{year}/csv_format/{filename}"
        body = fetch(url, cache / "glerl" / directory / str(year) / filename)
        if not body:
            continue
        parsed = list(csv.reader(io.StringIO(body.decode("utf-8", "replace"))))
        header = next((index for index, values in enumerate(parsed)
                       if values and values[0].strip() == "Time (UTC)"), None)
        if header is None:
            continue
        for values in parsed[header + 2:]:
            try:
                observed = datetime.strptime(values[0].strip(), "%Y/%m/%d %H:%M:%S").replace(tzinfo=UTC)
                temperature = float(values[1])
                qartod = int(values[2]) if len(values) > 2 and values[2].strip() else 2
            except (ValueError, IndexError):
                continue
            if not start <= observed <= end or not -2 <= temperature <= 40 or qartod == 4:
                continue
            rows.append(public._observation(
                identity, meta["name"], "NOAA GLERL", meta["body"], meta["type"],
                meta["lat"], meta["lon"], observed, temperature * 1.8 + 32,
                depth_m=depth, quality="provider_qc" if qartod == 1 else "unknown",
            ))
    return rows


class FieldFallback:
    def __init__(self, sampler: public.PublicModelSampler):
        self.sampler = sampler
        self.values = {}

    @staticmethod
    def filename(model: str, cycle: datetime, hour: int):
        product = f"fields.n{hour:03d}"
        if cycle >= public.CURRENT_MODEL_START:
            return f"{model}.t{cycle:%H}z.{cycle:%Y%m%d}.{product}.nc"
        return f"nos.{model}.{product}.{cycle:%Y%m%d}.t{cycle:%H}z.nc"

    def value(self, model: str, cycle: datetime, hour: int, node: int):
        key = (model, cycle, hour, node)
        if key in self.values:
            return self.values[key]
        root = public.NCEI_ROOTS[model]
        name = self.filename(model, cycle, hour)
        constraint = f"temp[0:1:0][0:1:0][{node}:1:{node}]"
        url = (f"https://www.ncei.noaa.gov/thredds/dodsC/{root}/{cycle:%Y/%m}/"
               f"{name}.ascii?{constraint}")
        try:
            body = urllib.request.urlopen(
                urllib.request.Request(url, headers={"user-agent": USER_AGENT}), timeout=90,
            ).read().decode("utf-8", "replace")
            found = re.findall(r"\]\s*,\s*(-?[0-9]+(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?)", body)
            result = float(found[-1]) if found else None
        except Exception:
            result = None
        self.values[key] = result
        return result

    def apply(self, pairs: list[dict]):
        changed = 0
        for pair in pairs:
            if pair.get("pairStatus") != "uncovered" or float(pair.get("sensorDepthM") or 0) > 1.5:
                continue
            lat, lon = pair.get("stationLat"), pair.get("stationLon")
            model = public.MODELS.get(pair.get("body"))
            if model is None or not all(isinstance(value, (int, float)) for value in (lat, lon)):
                continue
            cycle = public.parse_time(pair["cycle"])
            grid = self.sampler.grid(model, cycle, "native")
            if grid is None:
                continue
            query = (lat, lon * math.cos(math.radians(lat)))
            _, position = grid["tree"].query(query)
            node = int(grid["indices"][int(position)])
            model_lat, model_lon = float(grid["lat"][node]), float(grid["lon"][node])
            distance = public.verify.distance_km(
                {"lat": lat, "lon": lon}, {"lat": model_lat, "lon": model_lon})
            if distance > 6:
                continue
            lead = float(pair["leadHour"]); lower, upper = math.floor(lead), math.ceil(lead)
            first, second = self.value(model, cycle, lower, node), self.value(model, cycle, upper, node)
            if first is None or second is None:
                continue
            value_c = first + (second - first) * (lead - lower if upper != lower else 0)
            if not math.isfinite(value_c) or not -2 <= value_c <= 40:
                continue
            pair.update({"forecastF": value_c * 1.8 + 32, "pairStatus": "paired",
                         "sampleMethod": "field_node", "modelLat": model_lat,
                         "modelLon": model_lon, "modelDistanceKm": distance})
            changed += 1
        return changed


def normalize_surface_field_methods(pairs: list[dict]) -> int:
    """Name native-node surface samples explicitly for the add-on contract."""
    changed = 0
    for pair in pairs:
        if (pair.get("pairStatus") == "paired"
                and pair.get("sampleMethod") == "interpolated_3d"
                and float(pair.get("sensorDepthM") or 0) <= 1.5):
            pair["sampleMethod"] = "field_node"
            pair["depthMethod"] = "surface_layer"
            changed += 1
    return changed


def validate_research_records(records: list[dict]) -> dict:
    """Apply the production shape/range checks while admitting private field_node rows."""
    projected = [
        {**record, "sample_method": "saved_surface_grid"}
        if record.get("sample_method") == "field_node" else record
        for record in records
    ]
    return scorecard_schema.validate_records(projected)


def marker_exists(s3, bucket, day_text):
    try:
        s3.head_object(Bucket=bucket, Key=scorecard_store.done_marker_key(STREAM, day_text, METHODOLOGY))
        return True
    except Exception as error:
        status = (getattr(error, "response", {}) or {}).get("ResponseMetadata", {}).get("HTTPStatusCode")
        if status == 404:
            return False
        raise


def collect(start, end, cache):
    root = Path(__file__).resolve().parents[1]
    datasets, parameters, _ = public.load_catalogs(root)
    ndbc_meta = {"45209": {**ADDONS["external:45209"], "externalId": "45209"}}
    old = public.NDBC_STATIONS
    try:
        public.NDBC_STATIONS = ["45209"]
        rows = public.collect_ndbc(public.PublicCache(cache / "sources"), start, end, ndbc_meta)
    finally:
        public.NDBC_STATIONS = old
    if "10" in datasets:
        rows += public.collect_glos(
            public.PublicCache(cache / "sources"), start, end, {"10": datasets["10"]}, parameters)
    rows += glerl_csv_rows("mkgpier", start, end, cache)
    rows += glerl_csv_rows("m45", start, end, cache)
    return public.dedupe_and_qc(rows)


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", required=True, type=date.fromisoformat)
    parser.add_argument("--end", required=True, type=date.fromisoformat)
    parser.add_argument("--cache", type=Path, default=Path(os.environ.get("SCORECARD_ADDON_CACHE", "/tmp/finfindr-addon-cache")))
    parser.add_argument("--store-dir", type=Path, default=Path(os.environ.get("SCORECARD_STORE_DIR", "/tmp/finfindr-addon-store")))
    parser.add_argument("--stations", type=Path, default=Path(__file__).parent / "research/stations_v1.csv")
    parser.add_argument("--store", action="store_true")
    parser.add_argument("--skip-existing-r2", action="store_true")
    args = parser.parse_args(argv)
    if args.end < args.start:
        parser.error("end precedes start")
    if store.bucket() in {"", "piercast-lake-map"}:
        raise SystemExit("refusing unset or production map bucket")
    s3, bucket = store.client(), store.bucket()
    start = datetime.combine(args.start, datetime.min.time(), UTC)
    end = datetime.combine(args.end + timedelta(days=1), datetime.min.time(), UTC) - timedelta(microseconds=1)
    observations = collect(start - timedelta(days=1), end + timedelta(days=1), args.cache)
    sampler = public.PublicModelSampler(args.cache / "models")
    fallback = FieldFallback(sampler)
    code_version = revision()
    totals, methods, stored, skipped = Counter(), Counter(), 0, 0
    day = args.start
    while day <= args.end:
        day_text = day.isoformat()
        if args.skip_existing_r2 and marker_exists(s3, bucket, day_text):
            skipped += 1; print(f"Addon day={day_text} status=r2_skip"); day += timedelta(days=1); continue
        lower = datetime.combine(day, datetime.min.time(), UTC); upper = lower + timedelta(days=1)
        pairs = public.build_pairs(day, [row for row in observations if lower <= row["observed"] < upper], sampler)
        normalize_surface_field_methods(pairs)
        fallback.apply(pairs)
        pairs = [pair for pair in pairs if pair.get("pairStatus") == "paired"]
        evidence = {"methodologyVersion": METHODOLOGY, "primaryPairs": pairs}
        digest = hashlib.sha256(json.dumps(evidence, separators=(",", ":"), sort_keys=True).encode()).hexdigest()
        records = scorecard.records_from_evidence(evidence, f"public-addon/v1/{day_text}.json", digest)
        for record in records:
            record["methodology_version"] = METHODOLOGY
        validation = validate_research_records(records)
        if validation["invalidRows"]:
            print(f"Addon day={day_text} status=invalid count={validation['invalidRows']}"); return 2
        if args.store:
            manifest = scorecard_store.write_fragment(
                records, STREAM, day_text, digest, s3=s3, environment=os.environ,
                methodology_version=METHODOLOGY, code_version=code_version)
            scorecard_store.write_done_marker(manifest, METHODOLOGY, code_version, s3, os.environ)
        totals.update(record["station_id"] for record in records)
        methods.update(record["sample_method"] for record in records)
        stored += 1
        print(f"Addon day={day_text} status={'stored' if args.store else 'validated'} records={len(records)}")
        day += timedelta(days=1)

    aliases = {key: key for key in ADDONS}
    weather_rows = []
    ndbc, ndbc_errors = weather.ndbc_rows(start, end, aliases, args.cache / "weather")
    glos, glos_errors = weather.glos_rows(start, end, aliases, args.cache / "weather")
    weather_rows.extend(ndbc); weather_rows.extend(glos)
    hourly = weather.aggregate(weather_rows)
    weather_stored = 0
    if args.store:
        grouped = defaultdict(list)
        for row in hourly:
            grouped[row["station_id"]].append(row)
        for station_id, rows in grouped.items():
            weather.write_station(rows, station_id, start, end, args.store_dir, s3)
            weather_stored += 1
    print(json.dumps({"status": "complete", "days": stored, "skipped": skipped,
                      "stationRows": dict(sorted(totals.items())), "methods": dict(sorted(methods.items())),
                      "weatherRows": len(hourly), "weatherStations": weather_stored,
                      "weatherErrors": ndbc_errors + glos_errors}, separators=(",", ":"), sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
