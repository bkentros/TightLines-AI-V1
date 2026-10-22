#!/usr/bin/env python3
"""Three-station Open-Meteo history test plus public buoy-weather checks."""
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
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pyarrow as pa
import pyarrow.parquet as pq

JOB_DIR = Path(__file__).resolve().parents[1]
LAKE_MAP_DIR = JOB_DIR.parent
sys.path.insert(0, str(JOB_DIR))

import scorecard_public_backfill as backfill  # noqa: E402
from lakemap import store  # noqa: E402

UTC = timezone.utc
USER_AGENT = "FinFindr-scorecard-weather-research/1.0 (+https://finfindr.app)"
START = "2024-05-01"
END = "2024-12-15"
VARIABLES = (
    "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m",
    "temperature_2m", "cloud_cover", "shortwave_radiation",
)
TEST_IDS = ("45029", "45006", "9063063")
R2_PREFIX = "private/scorecard/v1/weather/v1/openmeteo"


def fetch(url, timeout=120):
    request = urllib.request.Request(url, headers={"user-agent": USER_AGENT, "accept": "application/json"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def fetch_json(url):
    return json.loads(fetch(url))


def valid_number(value, low=None, high=None):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return False
    return math.isfinite(number) and (low is None or number >= low) and (high is None or number <= high)


def station_coordinates():
    datasets, _, coops = backfill.load_catalogs(LAKE_MAP_DIR)
    by_external = {str(item.get("externalId") or "").upper(): item for item in datasets.values()}
    coops_by_id = {str(item["id"]): item for item in coops}
    result = {}
    for station_id in TEST_IDS:
        item = by_external.get(station_id) or coops_by_id.get(station_id)
        if not item:
            raise RuntimeError(f"test station absent from catalog: {station_id}")
        result[station_id] = (float(item["lat"]), float(item["lon"]))
    return result


def ndbc_text(station_id, cache_dir):
    path = cache_dir / f"ndbc-{station_id}-2024.txt.gz"
    if not path.exists():
        try:
            body = fetch(f"https://www.ndbc.noaa.gov/data/historical/stdmet/{station_id}h2024.txt.gz")
        except urllib.error.HTTPError as error:
            if error.code == 404:
                return None
            raise
        if body[:2] != b"\x1f\x8b":
            return None
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(body)
    try:
        return gzip.decompress(path.read_bytes()).decode("utf-8", "replace")
    except OSError:
        return None


def parse_ndbc_weather(text):
    if not text:
        return []
    lines = text.splitlines()
    if len(lines) < 3:
        return []
    names = lines[0].lstrip("#").split()
    index = {name: offset for offset, name in enumerate(names)}
    required = ("YY", "MM", "DD", "hh", "mm")
    if not all(name in index for name in required):
        return []
    rows = []
    for line in lines[2:]:
        values = line.split()
        try:
            observed = datetime(*(int(values[index[name]]) for name in required), tzinfo=UTC)
        except (ValueError, IndexError):
            continue
        if not datetime(2024, 5, 1, tzinfo=UTC) <= observed < datetime(2024, 12, 16, tzinfo=UTC):
            continue
        def number(name, low, high):
            try:
                value = float(values[index[name]])
            except (KeyError, ValueError, IndexError):
                return None
            return value if math.isfinite(value) and low <= value <= high else None
        speed = number("WSPD", 0, 112)
        direction = number("WDIR", 0, 360)
        gust = number("GST", 0, 150)
        air = number("ATMP", -60, 60)
        water = number("WTMP", -2, 40)
        rows.append({
            "time": observed, "speed_mph": speed * 2.23694 if speed is not None else None,
            "direction": direction, "gust_mph": gust * 2.23694 if gust is not None else None,
            "air_f": air * 9 / 5 + 32 if air is not None else None, "water_c": water,
        })
    return rows


def weather_capability_coverage(cache_dir):
    datasets, parameters, coops = backfill.load_catalogs(LAKE_MAP_DIR)
    active = fetch_json("https://seagull-api.glos.org/api/v2/obs-latest")
    features = fetch_json("https://seagull-api.glos.org/api/v1/obs-datasets.geojson")
    public_meta = {str(item.get("properties", {}).get("obs_dataset_id")): item.get("properties", {})
                   for item in features.get("features", [])}
    glos_ids = [str(item.get("obs_dataset_id")) for item in active
                if str(item.get("obs_dataset_id")) in datasets]
    glos = []
    for dataset_id in glos_ids:
        standards = {str(item.get("standard_name") or "").lower()
                     for item in public_meta.get(dataset_id, {}).get("parameters", [])}
        glos.append((
            "wind_speed" in standards and "wind_from_direction" in standards,
            "wind_speed_of_gust" in standards,
            "air_temperature" in standards,
        ))

    by_external = {str(item.get("externalId") or "").upper(): item for item in datasets.values()}
    ndbc_ids = [station for station in backfill.NDBC_STATIONS
                if station in by_external and by_external[station].get("body") in backfill.MODELS]
    ndbc = []
    ndbc_rows = {}
    for station_id in ndbc_ids:
        rows = parse_ndbc_weather(ndbc_text(station_id, cache_dir))
        ndbc_rows[station_id] = rows
        ndbc.append((
            any(row["speed_mph"] is not None and row["direction"] is not None for row in rows),
            any(row["gust_mph"] is not None for row in rows),
            any(row["air_f"] is not None for row in rows),
        ))

    coops_caps = []
    for station in coops:
        payload = fetch_json(
            f"https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/{station['id']}.json?expand=sensors"
        )
        sensors = payload.get("stations", [{}])[0].get("sensors", {}).get("sensors", [])
        names = {str(sensor.get("name") or "").lower() for sensor in sensors
                 if sensor.get("status") in (1, "1", None)}
        coops_caps.append((any("wind" in name for name in names),
                           any("wind" in name for name in names),
                           any("air temperature" in name for name in names)))

    def summarize(values):
        count = len(values)
        return {
            "stations": count,
            "windPct": round(100 * sum(value[0] for value in values) / count, 1),
            "gustPct": round(100 * sum(value[1] for value in values) / count, 1),
            "airPct": round(100 * sum(value[2] for value in values) / count, 1),
        }
    return {"ndbc": summarize(ndbc), "glos": summarize(glos),
            "coops": summarize(coops_caps)}, ndbc_rows


def open_meteo(station_id, lat, lon, api_key):
    query = urllib.parse.urlencode({
        "latitude": lat, "longitude": lon, "start_date": START, "end_date": END,
        "hourly": ",".join(VARIABLES), "timezone": "UTC", "wind_speed_unit": "mph",
        "temperature_unit": "fahrenheit", "models": "best_match", "apikey": api_key,
    })
    # Do not retain or log the keyed URL.
    payload = fetch_json(f"https://customer-archive-api.open-meteo.com/v1/archive?{query}")
    hourly = payload.get("hourly", {})
    times = hourly.get("time", [])
    if not times or any(len(hourly.get(name, [])) != len(times) for name in VARIABLES):
        raise RuntimeError(f"Open-Meteo returned incomplete arrays for {station_id}")
    rows = []
    for index, time_text in enumerate(times):
        rows.append({
            "station_id": station_id,
            "time": time_text + "Z" if not time_text.endswith("Z") else time_text,
            **{name: hourly[name][index] for name in VARIABLES},
        })
    return rows


def write_weather(rows, station_id, output_dir, upload):
    path = output_dir / f"station={station_id}" / "year=2024.parquet"
    path.parent.mkdir(parents=True, exist_ok=True)
    pq.write_table(pa.Table.from_pylist(rows), path, compression="zstd", version="2.6")
    key = f"{R2_PREFIX}/station={station_id}/year=2024.parquet"
    if upload:
        if store.bucket() == "piercast-lake-map":
            raise RuntimeError("refusing production map bucket")
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        s3 = store.client()
        s3.upload_file(str(path), store.bucket(), key, ExtraArgs={
            "ContentType": "application/vnd.apache.parquet", "CacheControl": "private, no-store",
            "Metadata": {"sha256": digest, "rows": str(len(rows))},
        })
        head = s3.head_object(Bucket=store.bucket(), Key=key)
        if head.get("Metadata", {}).get("sha256") != digest:
            raise RuntimeError(f"weather upload verification failed for {station_id}")
    return path, key


def compare_wind(open_rows, buoy_rows):
    valid = [row for row in buoy_rows if row["speed_mph"] is not None and row["direction"] is not None]
    times = [row["time"].timestamp() for row in valid]
    speed_pairs = []
    direction_errors = []
    for row in open_rows:
        timestamp = datetime.fromisoformat(row["time"].replace("Z", "+00:00")).timestamp()
        index = bisect.bisect_left(times, timestamp)
        choices = valid[max(0, index - 1):index + 1]
        if not choices:
            continue
        measured = min(choices, key=lambda item: abs(item["time"].timestamp() - timestamp))
        if abs(measured["time"].timestamp() - timestamp) > 1800:
            continue
        model_speed = row.get("wind_speed_10m")
        model_direction = row.get("wind_direction_10m")
        if model_speed is None or model_direction is None:
            continue
        speed_pairs.append((measured["speed_mph"], float(model_speed)))
        difference = abs(measured["direction"] - float(model_direction)) % 360
        direction_errors.append(min(difference, 360 - difference))
    if len(speed_pairs) < 2:
        return {"matches": len(speed_pairs), "speedR": None, "speedMaeMph": None, "directionMae": None}
    observed = np.array([pair[0] for pair in speed_pairs])
    modeled = np.array([pair[1] for pair in speed_pairs])
    return {
        "matches": len(speed_pairs),
        "speedR": round(float(np.corrcoef(observed, modeled)[0, 1]), 4),
        "speedMaeMph": round(float(np.mean(np.abs(observed - modeled))), 3),
        "directionMae": round(float(np.mean(direction_errors)), 2),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache", type=Path, default=Path("/tmp/finfindr-hybrid-phase1/weather"))
    parser.add_argument("--upload", action="store_true")
    args = parser.parse_args()
    api_key = os.environ.get("OPEN_METEO_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("OPEN_METEO_API_KEY is not set")
    coverage, ndbc_rows = weather_capability_coverage(args.cache / "ndbc")
    coordinates = station_coordinates()
    station_results = {}
    open_rows = {}
    for station_id in TEST_IDS:
        try:
            rows = open_meteo(station_id, *coordinates[station_id], api_key)
        except urllib.error.HTTPError as error:
            summary = {
                "keyFoundLocally": True, "coverage": coverage, "stations": {}, "rows": 0,
                "httpRequests": 1, "weightedCalls": 0, "windComparisons": {},
                "uploaded": False, "apiError": f"HTTP {error.code}",
            }
            args.cache.mkdir(parents=True, exist_ok=True)
            (args.cache / "summary.json").write_text(
                json.dumps(summary, indent=2, sort_keys=True) + "\n"
            )
            print(json.dumps(summary, sort_keys=True))
            return
        open_rows[station_id] = rows
        _, key = write_weather(rows, station_id, args.cache / "openmeteo", args.upload)
        expected = 229 * 24
        missing_times = max(0, expected - len(rows))
        nulls = {name: sum(row.get(name) is None for row in rows) for name in VARIABLES}
        station_results[station_id] = {
            "rows": len(rows), "missingHours": missing_times, "nulls": nulls,
            "r2Key": key if args.upload else None,
        }
    comparisons = {
        station_id: compare_wind(open_rows[station_id], ndbc_rows.get(station_id, []))
        for station_id in ("45029", "45006")
    }
    # Open-Meteo bills ranges beyond 14 days fractionally; six variables are below
    # the ten-variable multiplier.  Keep HTTP requests and weighted calls explicit.
    weighted_calls = len(TEST_IDS) * (229 / 14)
    summary = {
        "keyFoundLocally": True, "coverage": coverage, "stations": station_results,
        "rows": sum(result["rows"] for result in station_results.values()),
        "httpRequests": len(TEST_IDS), "weightedCalls": round(weighted_calls, 2),
        "windComparisons": comparisons, "uploaded": bool(args.upload),
    }
    args.cache.mkdir(parents=True, exist_ok=True)
    (args.cache / "summary.json").write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n")
    print(json.dumps(summary, sort_keys=True))


if __name__ == "__main__":
    main()
