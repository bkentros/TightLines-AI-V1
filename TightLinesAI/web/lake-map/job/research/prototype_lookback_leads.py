#!/usr/bin/env python3
"""Read-only observation-day lookback prototype for 24..120 hour leads."""
from __future__ import annotations

import argparse
import io
import json
import math
import sys
import time
import urllib.request
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path

import h5py
import numpy as np
import pyarrow as pa
import pyarrow.parquet as pq
from scipy.io import netcdf_file

JOB_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(JOB_DIR))
import scorecard_store  # noqa: E402
from lakemap import store  # noqa: E402

UTC = timezone.utc
ROOTS = {"lmhofs": "model-lmhofs-files", "leofs": "model-leofs",
         "loofs": "model-loofs-files", "lsofs": "model-lsofs-files"}
MODELS = {"lake-michigan": "lmhofs", "lake-huron": "lmhofs", "lake-erie": "leofs",
          "lake-ontario": "loofs", "lake-superior": "lsofs"}
TARGETS = (24, 48, 72, 96, 120)


def station_name(model, cycle):
    if cycle >= datetime(2024, 9, 16, 15, tzinfo=UTC):
        return f"{model}.t{cycle:%H}z.{cycle:%Y%m%d}.stations.forecast.nc"
    return f"nos.{model}.stations.forecast.{cycle:%Y%m%d}.t{cycle:%H}z.nc"


def load(url):
    request = urllib.request.Request(url, headers={"user-agent": "FinFindr-lookback-prototype/1.0"})
    with urllib.request.urlopen(request, timeout=120) as response:
        return response.read()


def dataset(body):
    return (netcdf_file(io.BytesIO(body), "r", mmap=False) if body.startswith(b"CDF")
            else h5py.File(io.BytesIO(body), "r"))


def parse(text):
    return datetime.fromisoformat(text.replace("Z", "+00:00"))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--day", default="2024-07-15")
    parser.add_argument("--output", type=Path, default=Path("/tmp/finfindr-hybrid-phase1/lookback-leads.json"))
    args = parser.parse_args()
    if store.bucket() == "piercast-lake-map":
        raise SystemExit("refusing production map bucket")
    s3 = store.client()
    marker_key = scorecard_store.done_marker_key("backfill", args.day, "public-scorecard-backfill-v2")
    marker = json.loads(s3.get_object(Bucket=store.bucket(), Key=marker_key)["Body"].read())
    body = s3.get_object(Bucket=store.bucket(), Key=marker["fragmentKey"])["Body"].read()
    rows = pq.read_table(pa.BufferReader(body)).to_pylist()
    unique = {}
    for row in rows:
        if row.get("sample_method") != "station_file" or row.get("pair_status") != "paired":
            continue
        key = (row["sensor_key"], row["observation_time"])
        unique[key] = row
    requests = []
    for row in unique.values():
        observed = parse(row["observation_time"])
        model = MODELS[row["waterbody"]]
        for target in TARGETS:
            wanted = observed - timedelta(hours=target)
            cycle_hour = int(round(wanted.hour / 6) * 6) % 24
            cycle_day = wanted.date() + (timedelta(days=1) if wanted.hour >= 21 and cycle_hour == 0 else timedelta())
            cycle = datetime.combine(cycle_day, datetime.min.time(), UTC).replace(hour=cycle_hour)
            lead = (observed - cycle).total_seconds() / 3600
            if abs(lead - target) <= 3 and 0 <= lead <= 120:
                requests.append((row, model, target, cycle, int(round(lead * 10))))
    files = {}
    transferred = 0
    started = time.monotonic()
    for _, model, _, cycle, _ in requests:
        key = (model, cycle)
        if key in files:
            continue
        name = station_name(model, cycle)
        url = f"https://www.ncei.noaa.gov/thredds/fileServer/{ROOTS[model]}/{cycle:%Y/%m}/{name}"
        try:
            payload = load(url)
            files[key] = payload; transferred += len(payload)
        except Exception:
            files[key] = None
    counts, sampled = Counter(), 0
    opened = {}
    try:
        for row, model, target, cycle, time_index in requests:
            payload = files[(model, cycle)]
            if not payload:
                continue
            key = (model, cycle)
            if key not in opened:
                opened[key] = dataset(payload)
            ds = opened[key]; variables = ds.variables if hasattr(ds, "variables") else ds
            lat = np.asarray(variables["lat"][:]); lon = np.asarray(variables["lon"][:])
            d2 = (lat - row["model_lat"]) ** 2 + ((lon - row["model_lon"]) * math.cos(math.radians(row["model_lat"]))) ** 2
            station = int(np.nanargmin(d2))
            value = float(variables["temp"][time_index, 0, station])
            if math.isfinite(value) and -2 <= value <= 40:
                counts[target] += 1; sampled += 1
    finally:
        for ds in opened.values(): ds.close()
    elapsed = time.monotonic() - started
    report = {"day": args.day, "observations": len(unique), "counts": {str(x): counts[x] for x in TARGETS},
              "sampled": sampled, "seconds": elapsed, "megabytes": transferred / 1048576,
              "files": len(files), "missingFiles": sum(value is None for value in files.values()),
              "estimated840Hours": elapsed * 840 / 3600}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n")
    print(json.dumps(report, sort_keys=True))


if __name__ == "__main__":
    main()
