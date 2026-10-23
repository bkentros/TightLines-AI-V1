#!/usr/bin/env python3
"""Read-only probes for historical GLOFS field nodes and forecast leads."""
from __future__ import annotations

import argparse
import csv
import io
import json
import math
import re
import sys
import time
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import h5py
from scipy.io import netcdf_file

JOB_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(JOB_DIR))

ROOTS = {"lmhofs": "model-lmhofs-files", "leofs": "model-leofs",
         "loofs": "model-loofs-files", "lsofs": "model-lsofs-files"}
BODY_MODEL = {"lake-michigan": "lmhofs", "lake-huron": "lmhofs", "lake-erie": "leofs",
              "lake-ontario": "loofs", "lake-superior": "lsofs"}
TARGETS = {"glos:22", "glos:17", "glos:21", "glos:98", "glos:46"}
UA = "FinFindr-model-archive-prototype/1.0 (+https://finfindr.app)"


def get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"user-agent": UA})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read()


def name(model: str, day: str, product: str) -> str:
    stamp = day.replace("-", "")
    modern = datetime.fromisoformat(day).replace(tzinfo=timezone.utc) >= datetime(2024, 9, 16, 15, tzinfo=timezone.utc)
    if modern:
        return f"{model}.t00z.{stamp}.{product}.nc"
    return f"nos.{model}.{product}.{stamp}.t00z.nc"


def base(model: str, day: str) -> str:
    return f"https://www.ncei.noaa.gov/thredds/dodsC/{ROOTS[model]}/{day[:4]}/{day[5:7]}"


def scalar_ascii(model: str, day: str, product: str, constraint: str):
    url = f"{base(model, day)}/{name(model, day, product)}.ascii?{constraint}"
    started = time.monotonic()
    body = get(url)
    values = re.findall(rb"\]\s*,\s*(-?[0-9]+(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?)", body)
    if not values:
        raise RuntimeError(f"no value for {model} {day} {constraint}")
    return float(values[-1]), len(body), time.monotonic() - started


def stations(path: Path):
    out = []
    for row in csv.DictReader(path.open()):
        identities = {row["station_id"], *(row.get("alternate_station_ids") or "").split(";")}
        match = identities & TARGETS
        if match:
            out.append({"id": min(match), "lat": float(row["lat"]), "lon": float(row["lon"]),
                        "body": row["waterbody"], "name": row["station_name"]})
    return sorted(out, key=lambda item: item["id"])


def nearest(grid_path: Path, lat: float, lon: float):
    grid = np.load(grid_path)
    glat, glon, bottom = (np.asarray(grid[key]) for key in ("lat", "lon", "bottom"))
    valid = np.flatnonzero(np.isfinite(glat) & np.isfinite(glon) & np.isfinite(bottom) & (bottom > 0))
    d2 = (glat[valid] - lat) ** 2 + ((glon[valid] - lon) * math.cos(math.radians(lat))) ** 2
    return int(valid[int(np.argmin(d2))])


def station_file(model: str, day: str):
    url = f"{base(model, day).replace('/dodsC/', '/fileServer/')}/{name(model, day, 'stations.forecast')}"
    body = get(url)
    dataset = (netcdf_file(io.BytesIO(body), "r", mmap=False)
               if body.startswith(b"CDF") else h5py.File(io.BytesIO(body), "r"))
    try:
        variables = dataset.variables if hasattr(dataset, "variables") else dataset
        return {
            key: np.array(variables[key][:], copy=True)
            for key in ("lat", "lon", "temp", "time", "siglay")
        }, len(body)
    finally:
        dataset.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--stations", type=Path, default=Path(__file__).with_name("stations_v1.csv"))
    parser.add_argument("--grid-dir", type=Path, default=Path("/tmp/finfindr-hybrid-phase1/model"))
    parser.add_argument("--output", type=Path, default=Path("/tmp/finfindr-hybrid-phase1/model-archive-prototype.json"))
    args = parser.parse_args()
    rows = []
    station_cache = {}
    for day in ("2024-07-15", "2025-08-10"):
        for target in stations(args.stations):
            model = BODY_MODEL[target["body"]]
            cache_key = (model, day)
            if cache_key not in station_cache:
                station_cache[cache_key] = station_file(model, day)
            data, station_bytes = station_cache[cache_key]
            station_lon = np.where(data["lon"] > 180, data["lon"] - 360, data["lon"])
            distance = ((data["lat"] - target["lat"]) ** 2 +
                        ((station_lon - target["lon"]) * math.cos(math.radians(target["lat"]))) ** 2)
            station_index = int(np.nanargmin(distance))
            # NOAA's station product sites are FVCOM nodes, not arbitrary
            # points inside elements.  Validate the field sampler at that exact
            # site so horizontal method, cycle/lead, and vertical layer are
            # independently comparable.
            station_lat = float(data["lat"][station_index])
            station_site_lon = float(station_lon[station_index])
            node = nearest(args.grid_dir / f"grid-{model}.npz", station_lat, station_site_lon)
            constraint = f"temp[0:1:0][0:1:0][{node}:1:{node}]"
            previous, _, _ = scalar_ascii(model, day, "fields.n000", constraint)
            field, byte_count, seconds = scalar_ascii(model, day, "fields.n006", constraint)
            station_value = float(data["temp"][0, 0, station_index])
            rows.append({**target, "date": day, "model": model, "node": node,
                         "stationIndex": station_index,
                         "stationLat": station_lat, "stationLon": station_site_lon,
                         "cycleLeadMatched": True,
                         "horizontalMethod": "station_file_node",
                         "surfaceLayerMatched": bool(np.all(data["siglay"][0] > data["siglay"][-1])),
                         "previousN000AbsDiffF": abs(previous - station_value) * 1.8,
                         "fieldC": field, "nearestStationFileC": station_value,
                         "absDiffF": abs(field - station_value) * 1.8,
                         "seconds": seconds, "hyperslabBytes": byte_count,
                         "stationForecastHours": round((len(data["time"]) - 1) / 10, 1),
                         "stationFileBytes": station_bytes})
    by_station = defaultdict(list)
    for row in rows:
        by_station[row["id"]].append(row["absDiffF"])
    per_station = {
        station_id: {"meanAbsDiffF": float(np.mean(values)), "maxAbsDiffF": float(np.max(values))}
        for station_id, values in sorted(by_station.items())
    }
    report = {"rows": rows, "recovered": len(rows), "perStation": per_station,
              "previousMeanAbsDiffF": float(np.mean([row["previousN000AbsDiffF"] for row in rows])),
              "previousMaxAbsDiffF": float(np.max([row["previousN000AbsDiffF"] for row in rows])),
              "meanAbsDiffF": float(np.mean([row["absDiffF"] for row in rows])),
              "maxAbsDiffF": float(np.max([row["absDiffF"] for row in rows])),
              "surfaceLayerMatched": all(row["surfaceLayerMatched"] for row in rows),
              "meanSeconds": float(np.mean([row["seconds"] for row in rows])),
              "meanHyperslabKB": float(np.mean([row["hyperslabBytes"] for row in rows])) / 1024}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n")
    print(json.dumps({key: value for key, value in report.items() if key != "rows"}, sort_keys=True))


if __name__ == "__main__":
    main()
