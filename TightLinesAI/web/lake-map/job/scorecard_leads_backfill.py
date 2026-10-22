#!/usr/bin/env python3
"""Build private forecast-lookback scorecard pairs from stored v2 observations."""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import math
import os
import subprocess
import time
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import h5py
import numpy as np
import pyarrow as pa
import pyarrow.parquet as pq
from scipy.io import netcdf_file

import scorecard_schema
import scorecard_store
from lakemap import store

UTC = timezone.utc
STREAM = "backfill_leads"
METHODOLOGY = "public-scorecard-leads-v1"
TARGET_LEADS = (6, 12, 24, 48, 72, 96, 120)
MODELS = {
    "lake-michigan": "lmhofs", "lake-huron": "lmhofs", "lake-erie": "leofs",
    "lake-ontario": "loofs", "lake-superior": "lsofs",
}
ROOTS = {
    "lmhofs": "model-lmhofs-files", "leofs": "model-leofs",
    "loofs": "model-loofs-files", "lsofs": "model-lsofs-files",
}
CURRENT_MODEL_START = datetime(2024, 9, 16, 15, tzinfo=UTC)
USER_AGENT = "FinFindr-scorecard-leads/1.0 (+https://finfindr.app)"


def iso(value: datetime) -> str:
    return value.astimezone(UTC).isoformat().replace("+00:00", "Z")


def parse_time(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(UTC)


def revision() -> str:
    candidate = os.environ.get("GITHUB_SHA", "").strip().lower()
    if len(candidate) == 40:
        return candidate
    return subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=Path(__file__).resolve().parents[4], text=True,
    ).strip().lower()


def station_name(model: str, cycle: datetime) -> str:
    if cycle >= CURRENT_MODEL_START:
        return f"{model}.t{cycle:%H}z.{cycle:%Y%m%d}.stations.forecast.nc"
    return f"nos.{model}.stations.forecast.{cycle:%Y%m%d}.t{cycle:%H}z.nc"


class FileCache:
    def __init__(self, root: Path):
        self.root = root
        self.transferred = 0

    def station_file(self, model: str, cycle: datetime) -> bytes:
        name = station_name(model, cycle)
        path = self.root / model / f"{cycle:%Y/%m}" / name
        if path.exists() and path.stat().st_size:
            return path.read_bytes()
        url = f"https://www.ncei.noaa.gov/thredds/fileServer/{ROOTS[model]}/{cycle:%Y/%m}/{name}"
        request = urllib.request.Request(url, headers={"user-agent": USER_AGENT})
        last = None
        for attempt in range(3):
            try:
                with urllib.request.urlopen(request, timeout=180) as response:
                    body = response.read()
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(body)
                self.transferred += len(body)
                return body
            except Exception as error:  # logs report a count, never URL/source contents
                last = error
                if isinstance(error, urllib.error.HTTPError) and 400 <= error.code < 500:
                    break
                if attempt < 2:
                    time.sleep(attempt + 1)
        raise RuntimeError(f"forecast file unavailable category={type(last).__name__}")


def open_dataset(body: bytes):
    if body.startswith(b"CDF"):
        return netcdf_file(io.BytesIO(body), "r", mmap=False)
    return h5py.File(io.BytesIO(body), "r")


def variables(dataset):
    return dataset.variables if hasattr(dataset, "variables") else dataset


def source_rows(s3, bucket: str, day_text: str) -> list[dict]:
    key = scorecard_store.done_marker_key("backfill", day_text, "public-scorecard-backfill-v2")
    marker = json.loads(s3.get_object(Bucket=bucket, Key=key)["Body"].read())
    body = s3.get_object(Bucket=bucket, Key=marker["fragmentKey"])["Body"].read()
    rows = pq.read_table(pa.BufferReader(body)).to_pylist()
    unique = {}
    for row in rows:
        if row.get("pair_status") != "paired" or row.get("sample_method") != "station_file":
            continue
        if row.get("model_lat") is None or row.get("model_lon") is None:
            continue
        unique[(row["sensor_key"], row["observation_time"])] = row
    return [unique[key] for key in sorted(unique)]


def target_cycle(observed: datetime, target: int) -> datetime | None:
    wanted = observed - timedelta(hours=target)
    rounded = datetime.fromtimestamp(round(wanted.timestamp() / 21600) * 21600, UTC)
    lead = (observed - rounded).total_seconds() / 3600
    day = observed.date()
    if not datetime.combine(day - timedelta(days=5), datetime.min.time(), UTC) <= rounded:
        return None
    if rounded >= datetime.combine(day + timedelta(days=1), datetime.min.time(), UTC):
        return None
    return rounded if 0 <= lead <= 120 and abs(lead - target) <= 3 else None


def model_value(data: dict, row: dict, cycle: datetime):
    observed = parse_time(row["observation_time"])
    lead = (observed - cycle).total_seconds() / 3600
    lower, upper = math.floor(lead), math.ceil(lead)
    if lower < 0:
        return None
    lat = np.asarray(data["lat"], dtype=float).reshape(-1)
    lon = np.asarray(data["lon"], dtype=float).reshape(-1)
    target_lat, target_lon = float(row["model_lat"]), float(row["model_lon"])
    lon = np.where(lon > 180, lon - 360, lon)
    distance = (lat - target_lat) ** 2 + ((lon - target_lon) * math.cos(math.radians(target_lat))) ** 2
    station = int(np.nanargmin(distance))
    temperature = np.asarray(data["temp"])
    lower_index, upper_index = lower * 10, upper * 10
    if upper_index >= temperature.shape[0]:
        return None
    first = float(temperature[lower_index, 0, station])
    second = float(temperature[upper_index, 0, station])
    value_c = first + (second - first) * (lead - lower if upper != lower else 0)
    if not math.isfinite(value_c) or not -2 <= value_c <= 40:
        return None
    return value_c * 1.8 + 32, lead, observed, 0.0, float(lat[station]), float(lon[station])


def build_day(rows: list[dict], cache: FileCache):
    requests = defaultdict(list)
    for row in rows:
        observed = parse_time(row["observation_time"])
        model = MODELS.get(row.get("waterbody"))
        if not model:
            continue
        for target in TARGET_LEADS:
            cycle = target_cycle(observed, target)
            if cycle is not None:
                requests[(model, cycle)].append((row, target))
    output, counts, errors = [], Counter(), 0
    for (model, cycle), items in sorted(requests.items()):
        try:
            body = cache.station_file(model, cycle)
            dataset = open_dataset(body)
            source = variables(dataset)
            data = {name: np.array(source[name][:], copy=True) for name in ("lat", "lon", "temp")}
        except Exception:
            errors += 1
            continue
        finally:
            if "dataset" in locals():
                dataset.close()
                del dataset
        for row, target in items:
            sampled = model_value(data, row, cycle)
            if sampled is None:
                errors += 1
                continue
            temperature_f, lead, valid, offset, model_lat, model_lon = sampled
            candidate = dict(row)
            candidate.update({
                "model_cycle": iso(cycle), "model_issued_at": iso(cycle),
                "valid_time": iso(valid), "lead_hours": lead,
                "lower_model_hour": math.floor(lead), "upper_model_hour": math.ceil(lead),
                "time_interpolation_fraction": lead - math.floor(lead),
                "observation_offset_minutes": offset,
                "run_id": f"public-leads-{model}-{cycle:%Y%m%dT%H}Z",
                "model_temperature_f": temperature_f, "model_lat": model_lat,
                "model_lon": model_lon, "pair_status": "paired", "sample_method": "station_file",
                "methodology_version": METHODOLOGY,
            })
            output.append(candidate)
            counts[target] += 1
    output.sort(key=lambda row: (row["observation_time"], row["sensor_key"], row["lead_hours"]))
    return output, counts, errors


def marker_exists(s3, bucket: str, day_text: str) -> bool:
    try:
        s3.head_object(Bucket=bucket, Key=scorecard_store.done_marker_key(STREAM, day_text, METHODOLOGY))
        return True
    except Exception as error:
        status = (getattr(error, "response", {}) or {}).get("ResponseMetadata", {}).get("HTTPStatusCode")
        if status == 404:
            return False
        raise


def daterange(start: date, end: date):
    day = start
    while day <= end:
        yield day
        day += timedelta(days=1)


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", required=True, type=date.fromisoformat)
    parser.add_argument("--end", required=True, type=date.fromisoformat)
    parser.add_argument("--cache", type=Path, default=Path(os.environ.get("SCORECARD_LEADS_CACHE", "/tmp/finfindr-leads-cache")))
    parser.add_argument("--store", action="store_true")
    parser.add_argument("--skip-existing-r2", action="store_true")
    args = parser.parse_args(argv)
    if args.end < args.start:
        parser.error("end precedes start")
    if store.bucket() in {"", "piercast-lake-map"}:
        raise SystemExit("refusing unset or production map bucket")
    s3, bucket = store.client(), store.bucket()
    cache = FileCache(args.cache / "cycles")
    code_version = revision()
    totals, total_errors, stored, skipped = Counter(), 0, 0, 0
    started = time.monotonic()
    for day in daterange(args.start, args.end):
        day_text = day.isoformat()
        if args.skip_existing_r2 and marker_exists(s3, bucket, day_text):
            skipped += 1
            print(f"Leads day={day_text} status=r2_skip")
            continue
        try:
            rows = source_rows(s3, bucket, day_text)
            records, counts, errors = build_day(rows, cache)
        except Exception as error:
            print(f"Leads day={day_text} status=error category={type(error).__name__}")
            return 2
        total_errors += errors
        if errors:
            print(f"Leads day={day_text} status=error count={errors}")
            return 3
        digest = hashlib.sha256(json.dumps(records, separators=(",", ":"), sort_keys=True).encode()).hexdigest()
        for record in records:
            record["evidence_key"] = f"public-leads/v1/{day_text}.json"
            record["evidence_sha256"] = digest
        validation = scorecard_schema.validate_records(records)
        if validation["invalidRows"]:
            print("Leads day=" + day_text + " status=invalid " + json.dumps({
                "count": validation["invalidRows"],
                "violations": validation["violations"],
            }, separators=(",", ":"), sort_keys=True))
            return 4
        if args.store:
            manifest = scorecard_store.write_fragment(
                records, STREAM, day_text, digest, s3=s3, environment=os.environ,
                methodology_version=METHODOLOGY, code_version=code_version,
            )
            scorecard_store.write_done_marker(manifest, METHODOLOGY, code_version, s3, os.environ)
        stored += 1
        totals.update(counts)
        print("Leads day=" + day_text + " status=" + ("stored" if args.store else "validated")
              + " counts=" + json.dumps({str(k): counts[k] for k in TARGET_LEADS}, sort_keys=True))
    elapsed = time.monotonic() - started
    days = max(stored, 1)
    print(json.dumps({
        "status": "complete", "start": args.start.isoformat(), "end": args.end.isoformat(),
        "days": stored, "skipped": skipped, "counts": {str(k): totals[k] for k in TARGET_LEADS},
        "secondsPerDay": elapsed / days, "megabytesPerDay": cache.transferred / 1048576 / days,
        "errors": total_errors,
    }, separators=(",", ":"), sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
