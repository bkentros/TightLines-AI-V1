#!/usr/bin/env python3
"""Build private hourly station-measured weather for scorecard research."""
from __future__ import annotations

import argparse
import csv
import gzip
import hashlib
import io
import json
import math
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import pyarrow as pa
import pyarrow.parquet as pq
from botocore.exceptions import ClientError

from lakemap import store

UTC = timezone.utc
PREFIX = "private/scorecard/v1/weather/v1"
USER_AGENT = "FinFindr-scorecard-station-weather/1.0 (+https://finfindr.app)"
METHODOLOGY = "scorecard-station-weather-v1"
NETWORK_PRIORITY = {"ndbc": 0, "coops": 1, "glos": 2}
WEATHER_NAMES = {"wind_speed", "wind_from_direction", "wind_speed_of_gust", "air_temperature"}


def iso(value: datetime) -> str:
    return value.astimezone(UTC).isoformat().replace("+00:00", "Z")


def fetch(url: str, cache: Path, name: str, timeout=120):
    path = cache / name
    if path.exists() and path.stat().st_size:
        return path.read_bytes()
    request = urllib.request.Request(url, headers={"user-agent": USER_AGENT})
    last = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                body = response.read()
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(body)
            return body
        except urllib.error.HTTPError as error:
            if error.code in (400, 404):
                return None
            last = error
        except Exception as error:  # network failures are summarized, never logged verbatim
            last = error
        if attempt < 2:
            import time
            time.sleep(attempt + 1)
    raise RuntimeError(f"source fetch failed category={type(last).__name__}")


def station_index(path: Path):
    aliases, stations = {}, {}
    for row in csv.DictReader(path.open(newline="")):
        canonical = row["station_id"]
        stations[canonical] = row
        for value in (canonical, *(row.get("alternate_station_ids") or "").split(";")):
            if value:
                aliases[value.lower()] = canonical
    return aliases, stations


def number(value, low, high):
    try:
        result = float(value)
    except (TypeError, ValueError):
        return None
    return result if math.isfinite(result) and low <= result <= high else None


def ndbc_rows(start, end, aliases, cache):
    output, errors = [], 0
    ids = sorted({key.removeprefix("external:").upper() for key in aliases
                  if re.fullmatch(r"(?:external:)?[A-Za-z0-9]{5}", key, re.I)})
    for station_id in ids:
        canonical = aliases.get(f"external:{station_id}".lower()) or aliases.get(station_id.lower())
        for year in range(start.year, end.year + 1):
            url = f"https://www.ndbc.noaa.gov/data/historical/stdmet/{station_id}h{year}.txt.gz"
            try:
                body = fetch(url, cache, f"ndbc/{station_id}h{year}.txt.gz")
            except RuntimeError:
                errors += 1; continue
            if not body or body[:2] != b"\x1f\x8b":
                continue
            try:
                lines = gzip.decompress(body).decode("utf-8", "replace").splitlines()
            except OSError:
                errors += 1; continue
            if len(lines) < 3:
                continue
            columns = {name: index for index, name in enumerate(lines[0].lstrip("#").split())}
            if not all(name in columns for name in ("YY", "MM", "DD", "hh", "mm")):
                errors += 1; continue
            for line in lines[2:]:
                values = line.split()
                try:
                    observed = datetime(*(int(values[columns[key]]) for key in ("YY", "MM", "DD", "hh", "mm")), tzinfo=UTC)
                except (ValueError, IndexError, KeyError):
                    continue
                if not start <= observed <= end:
                    continue
                def field(key, low, high):
                    return number(values[columns[key]], low, high) if key in columns and columns[key] < len(values) else None
                speed, gust, air = field("WSPD", 0, 112), field("GST", 0, 150), field("ATMP", -60, 60)
                output.append({"station_id": canonical, "network": "ndbc", "time": observed,
                               "speed": speed * 2.236936 if speed is not None else None,
                               "direction": field("WDIR", 0, 360),
                               "gust": gust * 2.236936 if gust is not None else None,
                               "air": air * 1.8 + 32 if air is not None else None})
    return output, errors


def glos_rows(start, end, aliases, cache):
    output, errors = [], 0
    try:
        latest = json.loads(fetch("https://seagull-api.glos.org/api/v2/obs-latest", cache, "glos/latest.json"))
        params = json.loads(fetch("https://seagull-api.glos.org/api/v1/parameters", cache, "glos/parameters.json"))
    except (RuntimeError, ValueError, TypeError):
        return output, 1
    registry = {str(item.get("parameter_id")): item for item in params
                if item.get("standard_name") in WEATHER_NAMES and item.get("parameter_name")}
    tasks = []
    for item in latest:
        dataset_id = str(item.get("obs_dataset_id"))
        canonical = aliases.get(f"glos:{dataset_id}")
        if not canonical:
            continue
        selected = {}
        for group in item.get("parameters", []):
            meta = registry.get(str(group.get("parameter_id")))
            if meta:
                selected.setdefault(meta["standard_name"], meta["parameter_name"])
        if selected:
            tasks.append((dataset_id, canonical, selected))

    def one(task):
        dataset_id, canonical, selected = task
        rows, failures = [], 0
        for standard, variable in selected.items():
            if not re.fullmatch(r"[A-Za-z0-9_]+", variable):
                continue
            select = urllib.parse.quote(f"time,{variable}", safe=",")
            constraints = (f"&time%3E={urllib.parse.quote(iso(start))}"
                           f"&time%3C={urllib.parse.quote(iso(end))}&orderBy(%22time%22)")
            url = f"https://seagull-erddap.glos.org/erddap/tabledap/obs_{dataset_id}.csv?{select}{constraints}"
            try:
                body = fetch(url, cache, f"glos/{dataset_id}-{standard}-{start:%Y%m%d}-{end:%Y%m%d}.csv", 180)
            except RuntimeError:
                failures += 1; continue
            if not body:
                continue
            parsed = list(csv.reader(io.StringIO(body.decode("utf-8", "replace"))))
            if len(parsed) < 3:
                continue
            header, units = parsed[0], parsed[1]
            columns = {name: index for index, name in enumerate(header)}
            for values in parsed[2:]:
                try:
                    observed = datetime.fromisoformat(values[columns["time"]].replace("Z", "+00:00"))
                    value = float(values[columns[variable]])
                except (KeyError, IndexError, ValueError):
                    continue
                unit = units[columns[variable]].lower()
                if standard in ("wind_speed", "wind_speed_of_gust") and ("m s-1" in unit or "m/s" in unit):
                    value *= 2.236936
                if standard == "air_temperature":
                    value = (value - 273.15) * 1.8 + 32 if unit in ("k", "kelvin") or value > 100 else value * 1.8 + 32
                rows.append({"station_id": canonical, "network": "glos", "time": observed,
                             {"wind_speed": "speed", "wind_from_direction": "direction",
                              "wind_speed_of_gust": "gust", "air_temperature": "air"}[standard]: value})
        return rows, failures

    with ThreadPoolExecutor(max_workers=4) as executor:
        for rows, failures in executor.map(one, tasks):
            output.extend(rows); errors += failures
    return output, errors


def coops_rows(start, end, aliases, cache):
    output, errors = [], 0
    ids = sorted(key.removeprefix("coops:") for key in aliases if key.startswith("coops:"))
    cursor = start
    while cursor <= end:
        stop = min(end, cursor + timedelta(days=30) - timedelta(seconds=1))
        for station_id in ids:
            canonical = aliases[f"coops:{station_id}"]
            for product in ("wind", "air_temperature"):
                query = urllib.parse.urlencode({"begin_date": cursor.strftime("%Y%m%d %H:%M"),
                    "end_date": stop.strftime("%Y%m%d %H:%M"), "station": station_id,
                    "product": product, "time_zone": "gmt", "units": "english", "interval": "h",
                    "format": "json", "application": "FinFindr"})
                try:
                    body = fetch(f"https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?{query}", cache,
                                 f"coops/{station_id}-{product}-{cursor:%Y%m%d}-{stop:%Y%m%d}.json")
                    payload = json.loads(body) if body else {}
                except (RuntimeError, ValueError):
                    errors += 1; continue
                for item in payload.get("data", []):
                    try:
                        observed = datetime.fromisoformat(item["t"].replace(" ", "T") + "+00:00")
                    except (KeyError, ValueError):
                        continue
                    row = {"station_id": canonical, "network": "coops", "time": observed}
                    if product == "wind":
                        row.update(speed=number(item.get("s"), 0, 200), direction=number(item.get("d"), 0, 360),
                                   gust=number(item.get("g"), 0, 250))
                    else:
                        row["air"] = number(item.get("v"), -100, 150)
                    output.append(row)
        cursor = stop + timedelta(seconds=1)
    return output, errors


def aggregate(rows):
    merged = defaultdict(lambda: defaultdict(list))
    networks = defaultdict(set)
    for row in rows:
        if not row.get("station_id"):
            continue
        hour = row["time"].replace(minute=0, second=0, microsecond=0)
        key = (row["station_id"], hour)
        networks[key].add(row["network"])
        for field in ("speed", "direction", "gust", "air"):
            value = row.get(field)
            if isinstance(value, (int, float)) and math.isfinite(value):
                merged[key][field].append(float(value))
    output = []
    for (station_id, hour), values in sorted(merged.items()):
        directions = values.get("direction", [])
        direction = None
        if directions:
            radians = [math.radians(value) for value in directions]
            direction = math.degrees(math.atan2(sum(math.sin(x) for x in radians),
                                                sum(math.cos(x) for x in radians))) % 360
        flags = [f"missing_{field}" for field in ("speed", "direction", "gust", "air") if not values.get(field)]
        output.append({"station_id": station_id, "observation_hour": iso(hour),
                       "observation_source": ",".join(sorted(networks[(station_id, hour)], key=NETWORK_PRIORITY.get)),
                       "wind_speed_mph": sum(values["speed"]) / len(values["speed"]) if values.get("speed") else None,
                       "wind_from_degrees": direction,
                       "wind_gust_mph": max(values["gust"]) if values.get("gust") else None,
                       "air_temperature_f": sum(values["air"]) / len(values["air"]) if values.get("air") else None,
                       "coverage_qc_flags": flags, "sample_count": max(map(len, values.values()), default=0),
                       "methodology_version": METHODOLOGY})
    return output


def write_station(rows, station_id, start, end, root, s3=None):
    table = pa.Table.from_pylist(rows)
    digest = hashlib.sha256(json.dumps(rows, separators=(",", ":"), sort_keys=True).encode()).hexdigest()
    safe = re.sub(r"[^A-Za-z0-9_.-]", "_", station_id)
    key = f"{PREFIX}/station={safe}/year={start.year}/chunk={start:%Y-%m-%d}_{end:%Y-%m-%d}-{digest[:16]}.parquet"
    path = root / key
    path.parent.mkdir(parents=True, exist_ok=True)
    pq.write_table(table, path, compression="zstd", version="2.6")
    file_digest = hashlib.sha256(path.read_bytes()).hexdigest()
    manifest = {"stationId": station_id, "start": start.date().isoformat(), "end": end.date().isoformat(),
                "rowCount": len(rows), "fragmentKey": key, "sha256": file_digest,
                "methodologyVersion": METHODOLOGY, "codeVersion": os.environ.get("GITHUB_SHA", "local")}
    manifest_key = key.removesuffix(".parquet") + ".manifest.json"
    marker_key = f"{PREFIX}/_done/station={safe}/start={start:%Y-%m-%d}_end={end:%Y-%m-%d}.json"
    if s3:
        s3.upload_file(str(path), store.bucket(), key, ExtraArgs={"ContentType": "application/vnd.apache.parquet",
                       "CacheControl": "private, no-store", "Metadata": {"sha256": file_digest, "rows": str(len(rows))}})
        manifest_body = json.dumps(manifest, separators=(",", ":"), sort_keys=True).encode()
        s3.put_object(Bucket=store.bucket(), Key=manifest_key, Body=manifest_body, ContentType="application/json")
        marker = {**manifest, "manifestKey": manifest_key}
        marker_body = json.dumps(marker, separators=(",", ":"), sort_keys=True).encode()
        s3.put_object(Bucket=store.bucket(), Key=marker_key, Body=marker_body, ContentType="application/json")
        s3.head_object(Bucket=store.bucket(), Key=marker_key)
    return key, marker_key


def compare_v2(rows, start, end, s3):
    weather = {(row["station_id"], row["observation_hour"]): row for row in rows}
    speed, direction = [], []
    day = start.date()
    while day <= end.date():
        marker_key = f"private/scorecard/v1/samples/stream=backfill/_done/v2/date={day}.json"
        try:
            marker = json.loads(s3.get_object(Bucket=store.bucket(), Key=marker_key)["Body"].read())
        except ClientError as error:
            if error.response.get("ResponseMetadata", {}).get("HTTPStatusCode") == 404:
                day += timedelta(days=1); continue
            raise
        body = s3.get_object(Bucket=store.bucket(), Key=marker["fragmentKey"])["Body"].read()
        for row in pq.read_table(pa.BufferReader(body)).to_pylist():
            if row.get("wind_speed_mph") is None or row.get("wind_from_degrees") is None:
                continue
            hour = row["observation_time"][:13] + ":00:00Z"
            candidate = weather.get((row["station_id"], hour))
            if not candidate or candidate.get("wind_speed_mph") is None or candidate.get("wind_from_degrees") is None:
                continue
            speed.append(abs(row["wind_speed_mph"] - candidate["wind_speed_mph"]))
            delta = abs(row["wind_from_degrees"] - candidate["wind_from_degrees"]) % 360
            direction.append(min(delta, 360 - delta))
        day += timedelta(days=1)
    return {"matches": len(speed), "speedMaeMph": sum(speed) / len(speed) if speed else None,
            "directionMaeDegrees": sum(direction) / len(direction) if direction else None}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", required=True); parser.add_argument("--end", required=True)
    parser.add_argument("--stations", type=Path, default=Path(__file__).parent / "research/stations_v1.csv")
    parser.add_argument("--cache", type=Path, default=Path(os.environ.get("SCORECARD_WEATHER_CACHE", "/tmp/finfindr-weather-cache")))
    parser.add_argument("--store-dir", type=Path, default=Path(os.environ.get("SCORECARD_STORE_DIR", "/tmp/finfindr-weather-store")))
    parser.add_argument("--store", action="store_true"); parser.add_argument("--compare-v2", action="store_true")
    args = parser.parse_args()
    start = datetime.fromisoformat(args.start).replace(tzinfo=UTC)
    end = datetime.fromisoformat(args.end).replace(tzinfo=UTC) + timedelta(days=1) - timedelta(microseconds=1)
    aliases, _ = station_index(args.stations)
    collected, errors = [], {}
    for network, collector in (("ndbc", ndbc_rows), ("glos", glos_rows), ("coops", coops_rows)):
        rows, count = collector(start, end, aliases, args.cache)
        collected.extend(rows); errors[network] = count
    hourly = aggregate(collected)
    s3 = None
    if args.store or args.compare_v2:
        if not store.bucket() or store.bucket() == "piercast-lake-map":
            raise SystemExit("refusing unset or production map bucket")
        s3 = store.client()
    stored = 0
    if args.store:
        grouped = defaultdict(list)
        for row in hourly: grouped[row["station_id"]].append(row)
        for station_id, rows in grouped.items():
            write_station(rows, station_id, start, end, args.store_dir, s3); stored += 1
    comparison = compare_v2(hourly, start, end, s3) if args.compare_v2 else None
    report = {"status": "complete", "start": args.start, "end": args.end,
              "stationHours": len(hourly), "stations": len({row["station_id"] for row in hourly}),
              "sourceErrors": errors, "storedStations": stored, "comparison": comparison}
    print(json.dumps(report, separators=(",", ":"), sort_keys=True))


if __name__ == "__main__":
    main()
