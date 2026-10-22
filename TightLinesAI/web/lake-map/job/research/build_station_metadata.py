#!/usr/bin/env python3
"""Build private hybrid-model station metadata from the scorecard catalogs.

The output contains public station metadata only.  R2 upload is opt-in and is
refused for the production map bucket.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pyarrow as pa
import pyarrow.parquet as pq

JOB_DIR = Path(__file__).resolve().parents[1]
LAKE_MAP_DIR = JOB_DIR.parent
sys.path.insert(0, str(JOB_DIR))

import scorecard_pairing  # noqa: E402
import scorecard_public_backfill as backfill  # noqa: E402
from lakemap import store  # noqa: E402

UTC = timezone.utc
USER_AGENT = "FinFindr-scorecard-metadata/1.0 (+https://finfindr.app)"
OUTPUT_CSV = Path(__file__).with_name("stations_v1.csv")
R2_KEY = "private/scorecard/v1/metadata/v1/stations.parquet"
MODEL_COLUMNS = {
    "lmhofs": "lmhofs_wet_cell_distance_km",
    "leofs": "leofs_wet_cell_distance_km",
    "loofs": "loofs_wet_cell_distance_km",
    "lsofs": "lsofs_wet_cell_distance_km",
}


def fetch_json(url: str):
    request = urllib.request.Request(url, headers={"user-agent": USER_AGENT, "accept": "application/json"})
    with urllib.request.urlopen(request, timeout=90) as response:
        return json.load(response)


def haversine_km(lat1, lon1, lat2, lon2):
    a1, a2 = math.radians(lat1), math.radians(lat2)
    dp = a2 - a1
    dl = math.radians(lon2 - lon1)
    value = math.sin(dp / 2) ** 2 + math.cos(a1) * math.cos(a2) * math.sin(dl / 2) ** 2
    return 12742.0 * math.asin(math.sqrt(min(1.0, value)))


def bearing_degrees(lat1, lon1, lat2, lon2):
    a1, a2 = math.radians(lat1), math.radians(lat2)
    dl = math.radians(lon2 - lon1)
    y = math.sin(dl) * math.cos(a2)
    x = math.cos(a1) * math.sin(a2) - math.sin(a1) * math.cos(a2) * math.cos(dl)
    return (math.degrees(math.atan2(y, x)) + 360.0) % 360.0


def destination(lat, lon, bearing, distance_km):
    radius = 6371.0
    angular = distance_km / radius
    a1 = math.radians(lat)
    l1 = math.radians(lon)
    b = math.radians(bearing)
    a2 = math.asin(math.sin(a1) * math.cos(angular) + math.cos(a1) * math.sin(angular) * math.cos(b))
    l2 = l1 + math.atan2(math.sin(b) * math.sin(angular) * math.cos(a1),
                         math.cos(angular) - math.sin(a1) * math.sin(a2))
    return math.degrees(a2), math.degrees(l2)


def point_in_ring(lon, lat, ring):
    inside = False
    previous = ring[-1]
    for current in ring:
        x1, y1 = previous
        x2, y2 = current
        crosses = (y1 > lat) != (y2 > lat)
        if crosses and lon < (x2 - x1) * (lat - y1) / (y2 - y1) + x1:
            inside = not inside
        previous = current
    return inside


def point_in_polygon(lon, lat, polygon):
    if not polygon or not point_in_ring(lon, lat, polygon[0]):
        return False
    return not any(point_in_ring(lon, lat, hole) for hole in polygon[1:])


def nearest_shore(lat, lon, lake_polygons):
    cos_lat = math.cos(math.radians(lat))
    best = None
    for polygon in lake_polygons:
        for ring in polygon:
            for index, (first, second) in enumerate(zip(ring, ring[1:] + ring[:1])):
                ax = (first[0] - lon) * 111.32 * cos_lat
                ay = (first[1] - lat) * 110.57
                bx = (second[0] - lon) * 111.32 * cos_lat
                by = (second[1] - lat) * 110.57
                dx, dy = bx - ax, by - ay
                length2 = dx * dx + dy * dy
                fraction = max(0.0, min(1.0, -(ax * dx + ay * dy) / length2)) if length2 else 0.0
                px, py = ax + fraction * dx, ay + fraction * dy
                distance = math.hypot(px, py)
                if best is None or distance < best[0]:
                    near_lat = lat + py / 110.57
                    near_lon = lon + px / (111.32 * cos_lat)
                    best = (distance, ring, index, near_lat, near_lon)
    if best is None:
        return None, None, None
    distance, ring, index, near_lat, near_lon = best

    def walk(direction):
        cursor = index if direction < 0 else index + 1
        travelled = 0.0
        point = ring[cursor % len(ring)]
        while travelled < 2.5:
            nxt = ring[(cursor + direction) % len(ring)]
            travelled += haversine_km(point[1], point[0], nxt[1], nxt[0])
            point = nxt
            cursor += direction
        return point

    before = walk(-1)
    after = walk(1)
    tangent = bearing_degrees(before[1], before[0], after[1], after[0])
    candidates = ((tangent + 90.0) % 360.0, (tangent - 90.0) % 360.0)
    normal = candidates[0]
    for candidate in candidates:
        test_lat, test_lon = destination(near_lat, near_lon, candidate, 1.0)
        if any(point_in_polygon(test_lon, test_lat, polygon) for polygon in lake_polygons):
            normal = candidate
            break
    return distance, tangent, normal


def physical_sensor_key(lat, lon, depth, assumed):
    depth_token = "unknown" if assumed else f"{depth:.2f}"
    payload = f"{lat:.5f}|{lon:.5f}|{depth_token}"
    identity = "physical:" + hashlib.sha256(payload.encode()).hexdigest()[:20]
    suffix = "unknown" if assumed else f"{depth:.2f}m"
    return f"{identity}|depth:{suffix}"


def station_group(groups, key):
    return groups.setdefault(key, {
        "station_ids": set(), "networks": set(), "names": [], "positions": [],
        "bodies": [], "types": [], "depths": [], "wind": False, "air": False,
    })


def add_position(group, priority, lat, lon):
    if isinstance(lat, (int, float)) and isinstance(lon, (int, float)):
        group["positions"].append((priority, float(lat), float(lon)))


def load_station_groups():
    datasets, parameters, coops = backfill.load_catalogs(LAKE_MAP_DIR)
    active = fetch_json("https://seagull-api.glos.org/api/v2/obs-latest")
    features = fetch_json("https://seagull-api.glos.org/api/v1/obs-datasets.geojson")
    public_meta = {
        str(feature.get("properties", {}).get("obs_dataset_id")): feature
        for feature in features.get("features", [])
    }
    groups = {}
    active_count = 0
    for item in active:
        dataset_id = str(item.get("obs_dataset_id"))
        meta = datasets.get(dataset_id)
        if not meta:
            continue
        temperature_ids = sorted({
            str(value.get("parameter_id")) for value in item.get("parameters", [])
            if str(value.get("parameter_id")) in parameters
        })
        active_count += 1
        external = str(meta.get("externalId") or "").strip().upper()
        key = f"external:{external}" if external else f"glos:{dataset_id}"
        group = station_group(groups, key)
        group["station_ids"].add(f"glos:{dataset_id}")
        group["networks"].add("GLOS Seagull")
        group["names"].append(str(meta.get("name") or f"GLOS station {dataset_id}"))
        group["bodies"].append(meta.get("body"))
        group["types"].append(meta.get("type"))
        add_position(group, 2, meta.get("lat"), meta.get("lon"))
        for parameter_id in temperature_ids:
            depth = parameters[parameter_id].get("depthM")
            if isinstance(depth, (int, float)) and depth >= 0:
                group["depths"].append((float(depth), False))
            else:
                group["depths"].append((1.0, True))
        feature = public_meta.get(dataset_id, {}).get("properties", {})
        standards = {str(value.get("standard_name") or "").lower()
                     for value in feature.get("parameters", [])}
        group["wind"] |= "wind_speed" in standards and "wind_from_direction" in standards
        group["air"] |= "air_temperature" in standards

    by_external = {}
    for meta in datasets.values():
        external = str(meta.get("externalId") or "").strip().upper()
        if external:
            by_external.setdefault(external, meta)
    ndbc_count = 0
    for station_id in backfill.NDBC_STATIONS:
        meta = by_external.get(station_id)
        if not meta or meta.get("body") not in backfill.MODELS:
            continue
        ndbc_count += 1
        group = station_group(groups, f"external:{station_id}")
        group["station_ids"].add(f"external:{station_id}")
        group["networks"].add("NOAA NDBC")
        group["names"].append(str(meta.get("name") or station_id))
        group["bodies"].append(meta.get("body"))
        group["types"].append(meta.get("type") or "buoy")
        group["depths"].append((1.0, True))
        add_position(group, 0, meta.get("lat"), meta.get("lon"))
        group["wind"] = True
        group["air"] = True

    coops_count = 0
    for station in coops:
        coops_count += 1
        station_id = str(station["id"])
        group = station_group(groups, f"external:{station_id}")
        group["station_ids"].add(f"coops:{station_id}")
        group["networks"].add("NOAA CO-OPS")
        group["names"].append(station["name"])
        group["bodies"].append(station["body"])
        group["types"].append("fixed")
        group["depths"].append((1.0, True))
        add_position(group, 1, station["lat"], station["lon"])
        try:
            payload = fetch_json(
                f"https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/{station_id}.json?expand=sensors"
            )
            sensors = payload.get("stations", [{}])[0].get("sensors", {}).get("sensors", [])
            names = {str(sensor.get("name") or "").lower() for sensor in sensors
                     if sensor.get("status") in (1, "1", None)}
            group["wind"] |= any("wind" in name for name in names)
            group["air"] |= any("air temperature" in name for name in names)
        except Exception:
            pass
    return groups, {"glos": active_count, "ndbc": ndbc_count, "coops": coops_count}


def lake_polygons():
    payload = json.loads((LAKE_MAP_DIR / "static" / "geo.json").read_text())
    return [feature["geometry"]["coordinates"] for feature in payload["lakes"]["features"]]


def nearest_model_cell(grid, lat, lon):
    query = (lat, lon * math.cos(math.radians(lat)))
    _, tree_index = grid["tree"].query(query)
    node = int(grid["indices"][int(tree_index)])
    model_lat = float(grid["lat"][node])
    model_lon = float(grid["lon"][node])
    return haversine_km(lat, lon, model_lat, model_lon), float(grid["bottom"][node])


def build_rows(cache_dir: Path):
    groups, counts = load_station_groups()
    polygons = lake_polygons()
    sampler = backfill.PublicModelSampler(cache_dir / "model")
    cycle = datetime(2024, 5, 1, tzinfo=UTC)
    grids = {model: sampler.grid(model, cycle, "native") for model in MODEL_COLUMNS}
    rows = []
    for key, group in sorted(groups.items()):
        positions = sorted(group["positions"])
        if not positions:
            continue
        _, lat, lon = positions[0]
        body = next((value for value in group["bodies"] if value), "unknown")
        raw_type = next((value for value in group["types"] if value), "unknown")
        shore_km, tangent, normal = nearest_shore(lat, lon, polygons)
        observation = {"name": group["names"][0], "body": body, "type": raw_type}
        station_class = scorecard_pairing.station_class(observation, shore_km)
        depths = sorted(set(group["depths"])) or [(1.0, True)]
        sensor_keys = sorted({physical_sensor_key(lat, lon, depth, assumed)
                              for depth, assumed in depths})
        model = backfill.MODELS.get(body)
        model_distances = {column: None for column in MODEL_COLUMNS.values()}
        water_depth = None
        if model and grids.get(model) is not None:
            distance, water_depth = nearest_model_cell(grids[model], lat, lon)
            model_distances[MODEL_COLUMNS[model]] = round(distance, 4)
        station_ids = sorted(group["station_ids"])
        canonical = next((value for value in station_ids if value.startswith("external:")), None)
        canonical = canonical or next((value for value in station_ids if value.startswith("coops:")), station_ids[0])
        row = {
            "station_id": canonical,
            "alternate_station_ids": ";".join(value for value in station_ids if value != canonical),
            "sensor_keys": ";".join(sensor_keys),
            "networks": ";".join(sorted(group["networks"])),
            "station_name": group["names"][0],
            "station_class": station_class,
            "lat": round(lat, 6), "lon": round(lon, 6), "waterbody": body,
            "sensor_depth_m": ";".join(f"{depth:.2f}" for depth, _ in depths),
            "sensor_depth_assumed": any(assumed for _, assumed in depths),
            "water_depth_m": round(water_depth, 3) if water_depth is not None else None,
            "shore_distance_km": round(shore_km, 4) if shore_km is not None else None,
            "shoreline_tangent_bearing": round(tangent, 2) if tangent is not None else None,
            "offshore_normal_bearing": round(normal, 2) if normal is not None else None,
            "measures_wind": bool(group["wind"]),
            "measures_air_temperature": bool(group["air"]),
            **model_distances,
        }
        rows.append(row)
    return rows, counts


def write_outputs(rows, csv_path: Path, parquet_path: Path):
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    parquet_path.parent.mkdir(parents=True, exist_ok=True)
    columns = list(rows[0])
    with csv_path.open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)
    table = pa.Table.from_pylist(rows)
    pq.write_table(table, parquet_path, compression="zstd", version="2.6")


def upload(parquet_path: Path):
    if store.bucket() == "piercast-lake-map":
        raise RuntimeError("refusing production map bucket")
    s3 = store.client()
    digest = hashlib.sha256(parquet_path.read_bytes()).hexdigest()
    s3.upload_file(str(parquet_path), store.bucket(), R2_KEY, ExtraArgs={
        "ContentType": "application/vnd.apache.parquet",
        "CacheControl": "private, no-store",
        "Metadata": {"sha256": digest, "rows": str(pq.read_metadata(parquet_path).num_rows)},
    })
    head = s3.head_object(Bucket=store.bucket(), Key=R2_KEY)
    if head.get("Metadata", {}).get("sha256") != digest:
        raise RuntimeError("station metadata upload verification failed")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache", type=Path, default=Path("/tmp/finfindr-hybrid-phase1"))
    parser.add_argument("--csv", type=Path, default=OUTPUT_CSV)
    parser.add_argument("--upload", action="store_true")
    args = parser.parse_args()
    rows, catalogs = build_rows(args.cache)
    parquet_path = args.cache / "stations_v1.parquet"
    write_outputs(rows, args.csv, parquet_path)
    if args.upload:
        upload(parquet_path)
    print(json.dumps({
        "catalogs": catalogs,
        "stations": len(rows),
        "shorelineOrientation": sum(row["shoreline_tangent_bearing"] is not None for row in rows),
        "waterDepth": sum(row["water_depth_m"] is not None for row in rows),
        "measureWind": sum(row["measures_wind"] for row in rows),
        "measureAir": sum(row["measures_air_temperature"] for row in rows),
        "uploaded": bool(args.upload),
        "r2Key": R2_KEY if args.upload else None,
    }, sort_keys=True))


if __name__ == "__main__":
    main()
