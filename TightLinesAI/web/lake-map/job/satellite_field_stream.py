#!/usr/bin/env python3
"""Build the private, research-only GLSEA/NOAA open-water field stream.

The sampler is deliberately generic: it creates a deterministic, evenly
spread set of public open-water coordinates, reads public NOAA archives, and
writes only immutable objects below the private scorecard prefix.  It never
contacts Supabase or the lake-map production bucket.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import math
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import pyarrow as pa
import pyarrow.parquet as pq
from botocore.exceptions import ClientError
from scipy import ndimage
from scipy.spatial import cKDTree

import scorecard_public_backfill as public
from lakemap import store

UTC = timezone.utc
METHODOLOGY = "public-satellite-field-v2"
PREFIX = "private/scorecard/v1/satellite/v2"
GLSEA_URL = "https://apps.glerl.noaa.gov/erddap/griddap/GLSEA_ACSPO_GCS.csv"
LAKES = ("lake-michigan", "lake-huron", "lake-superior", "lake-erie", "lake-ontario")
USER_AGENT = "FinFindr-satellite-field/2.0 (+https://finfindr.app)"


def revision() -> str:
    return os.environ.get("GITHUB_SHA", "unknown")


def scan_ring(ring, lats, lons):
    result = np.zeros((len(lats), len(lons)), dtype=bool)
    points = np.asarray(ring, dtype=float)
    x1, y1 = points[:-1, 0], points[:-1, 1]
    x2, y2 = points[1:, 0], points[1:, 1]
    lo, hi = min(y1.min(), y2.min()), max(y1.max(), y2.max())
    for row in np.flatnonzero((lats >= lo) & (lats <= hi)):
        y = lats[row]
        crossing = (y1 > y) != (y2 > y)
        if not np.any(crossing):
            continue
        xs = x1[crossing] + (y - y1[crossing]) * (x2[crossing] - x1[crossing]) / (y2[crossing] - y1[crossing])
        xs.sort()
        if len(xs) % 2:
            xs = xs[:-1]
        for left, right in xs.reshape(-1, 2):
            result[row, np.searchsorted(lons, left):np.searchsorted(lons, right, side="right")] = True
    return result


def polygon_mask(coordinates, lats, lons):
    mask = scan_ring(coordinates[0], lats, lons)
    for hole in coordinates[1:]:
        mask &= ~scan_ring(hole, lats, lons)
    return mask


def geometry_mask(geometry, lats, lons):
    if geometry["type"] == "Polygon":
        return polygon_mask(geometry["coordinates"], lats, lons)
    mask = np.zeros((len(lats), len(lons)), dtype=bool)
    for polygon in geometry["coordinates"]:
        mask |= polygon_mask(polygon, lats, lons)
    return mask


def farthest_points(xy: np.ndarray, count: int) -> np.ndarray:
    """Deterministic maximin selection over a candidate coordinate array."""
    if len(xy) <= count:
        return np.arange(len(xy))
    center = np.mean(xy, axis=0)
    selected = [int(np.argmin(np.sum((xy - center) ** 2, axis=1)))]
    nearest = np.sum((xy - xy[selected[0]]) ** 2, axis=1)
    for _ in range(1, count):
        index = int(np.argmax(nearest))
        selected.append(index)
        nearest = np.minimum(nearest, np.sum((xy - xy[index]) ** 2, axis=1))
    return np.asarray(selected, dtype=int)


def build_points(lake: str, geo_path: Path, station_path: Path, count: int = 300) -> list[dict]:
    geo = json.loads(geo_path.read_text())
    # A two-kilometre raster is finer than GLSEA's nominal 1.8-km grid while
    # keeping deterministic point construction cheap on an Actions runner.
    lat_step = 2.0 / 111.2
    lon_step = 2.0 / (111.2 * math.cos(math.radians(45.0)))
    lats = np.arange(41.20, 49.08 + lat_step / 2, lat_step)
    lons = np.arange(-92.25, -70.40 + lon_step / 2, lon_step)
    water = np.zeros((len(lats), len(lons)), dtype=bool)
    for feature in geo["lakes"]["features"]:
        water |= geometry_mask(feature["geometry"], lats, lons)
    inland = np.zeros_like(water)
    for feature in geo["inland"]["features"]:
        inland |= geometry_mask(feature["geometry"], lats, lons)
    water &= ~inland
    rows, cols = np.nonzero(water)
    shore = ndimage.distance_transform_edt(water, sampling=(lat_step * 111.2, lon_step * 111.2 * math.cos(math.radians(45))))
    station_xy, station_lake = [], []
    with station_path.open(newline="") as stream:
        for item in csv.DictReader(stream):
            if item.get("waterbody") in LAKES and item.get("lat") and item.get("lon"):
                station_xy.append((float(item["lat"]) * 111.2, float(item["lon"]) * 111.2 * math.cos(math.radians(45))))
                station_lake.append(item["waterbody"])
    cell_xy = np.column_stack((lats[rows] * 111.2, lons[cols] * 111.2 * math.cos(math.radians(45))))
    labels = np.asarray(station_lake, dtype=object)[cKDTree(np.asarray(station_xy)).query(cell_xy)[1]]
    good = (labels == lake) & (shore[rows, cols] >= 3.0)
    rows, cols, cell_xy = rows[good], cols[good], cell_xy[good]
    selected = []
    if lake == "lake-michigan":
        green_bay = (lats[rows] >= 44.45) & (lons[cols] <= -86.70)
        gb = np.flatnonzero(green_bay)
        main = np.flatnonzero(~green_bay)
        selected.extend(gb[farthest_points(cell_xy[gb], min(50, len(gb)))].tolist())
        selected.extend(main[farthest_points(cell_xy[main], count - len(selected))].tolist())
    else:
        selected = farthest_points(cell_xy, count).tolist()
    output = []
    for number, index in enumerate(selected):
        lat, lon = float(lats[rows[index]]), float(lons[cols[index]])
        output.append({
            "point_id": f"{lake}-{number:03d}", "lake": lake, "latitude": lat, "longitude": lon,
            "shore_distance_km": float(shore[rows[index], cols[index]]),
            "green_bay": bool(lake == "lake-michigan" and lat >= 44.45 and lon <= -86.70),
            "input_parity": number % 2,
        })
    return output


def fetch(url: str, attempts: int = 4, timeout: int = 180) -> bytes:
    error = None
    for attempt in range(attempts):
        try:
            request = urllib.request.Request(url, headers={"user-agent": USER_AGENT})
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return response.read()
        except Exception as caught:  # public archives transiently return 429/5xx
            error = caught
            if isinstance(caught, urllib.error.HTTPError) and caught.code in (400, 404):
                break
            if attempt + 1 < attempts:
                time.sleep(2 ** attempt)
    raise RuntimeError(f"public archive request failed: {type(error).__name__}")


def glsea_point(point: dict, start: date, end: date) -> dict[str, tuple[float, float, float]]:
    query = (f"sst[({start.isoformat()}T12:00:00Z):1:({end.isoformat()}T12:00:00Z)]"
             f"[({point['latitude']}):1:({point['latitude']})]"
             f"[({point['longitude']}):1:({point['longitude']})]")
    url = GLSEA_URL + "?" + urllib.parse.quote(query, safe="[]():,-.")
    try:
        body = fetch(url)
    except RuntimeError:
        return {}
    output = {}
    for item in csv.DictReader(io.StringIO(body.decode("utf-8", "replace"))):
        try:
            value = float(item["sst"])
            if -2 <= value <= 40:
                output[str(item["time"])[:10]] = (value * 1.8 + 32, float(item["latitude"]), float(item["longitude"]))
        except (KeyError, TypeError, ValueError):
            continue
    return output


def ncei_surface(model: str, cycle: datetime, nodes: np.ndarray) -> tuple[dict[int, float], str | None]:
    root = public.NCEI_ROOTS[model]
    modern = f"{model}.t{cycle:%H}z.{cycle:%Y%m%d}.fields.n006.nc"
    legacy = f"nos.{model}.fields.n006.{cycle:%Y%m%d}.t{cycle:%H}z.nc"
    names = (modern, legacy) if cycle >= public.CURRENT_MODEL_START else (legacy, modern)
    first, last = int(nodes.min()), int(nodes.max())
    constraint = urllib.parse.quote(f"temp[0:1:0][0:1:0][{first}:1:{last}]", safe="[]:")
    for name in names:
        url = (f"https://www.ncei.noaa.gov/thredds/dodsC/{root}/{cycle:%Y/%m}/"
               f"{name}.ascii?{constraint}")
        try:
            text = fetch(url, attempts=3).decode("utf-8", "replace")
        except RuntimeError:
            continue
        # OPeNDAP emits one comma-separated row after a ``[time][level],``
        # prefix for a range constraint (and one row per line for scalar
        # constraints).  Strip those indexes before parsing the numeric body.
        payload = text.split("---------------------------------------------", 1)[-1]
        numeric = []
        for line in payload.splitlines():
            if line.lstrip().startswith("[") and "," in line:
                numeric.append(line.split(",", 1)[1])
        values = np.fromstring(",".join(numeric), sep=",").tolist()
        if len(values) != last - first + 1:
            continue
        array = np.asarray(values, dtype=float)
        return ({int(node): float(array[int(node) - first]) for node in nodes
                 if math.isfinite(array[int(node) - first]) and -2 <= array[int(node) - first] <= 40}, "ncei")
    return {}, None


def model_locations(points: list[dict], model: str, cache: Path, sample_cycle: datetime):
    sampler = public.PublicModelSampler(cache / "model-grid")
    grid = sampler.grid(model, sample_cycle, "native")
    if grid is None:
        raise RuntimeError(f"NOAA grid unavailable for {model}")
    locations = {}
    for point in points:
        query = (point["latitude"], point["longitude"] * math.cos(math.radians(point["latitude"])))
        _, position = grid["tree"].query(query)
        node = int(grid["indices"][int(position)])
        model_lat, model_lon = float(grid["lat"][node]), float(grid["lon"][node])
        distance = public.verify.distance_km(
            {"lat": point["latitude"], "lon": point["longitude"]},
            {"lat": model_lat, "lon": model_lon},
        )
        locations[point["point_id"]] = (node, model_lat, model_lon, distance)
    return locations, sampler


def nodd_surface(sampler, model: str, cycle: datetime, nodes: np.ndarray) -> tuple[dict[int, float], str | None]:
    directory = cycle.strftime("%Y/%m/%d") if cycle.year >= 2025 else cycle.strftime("%Y%m")
    key = (f"{model}/netcdf/{directory}/"
           f"{model}.t{cycle:%H}z.{cycle:%Y%m%d}.fields.n006.nc")
    stream, dataset = sampler._open(key)
    if dataset is None:
        return {}, None
    try:
        variable = sampler._variable(dataset, "temp")
        values = np.asarray(variable[0, 0, nodes], dtype=float)
        return ({int(node): float(value) for node, value in zip(nodes, values)
                 if math.isfinite(value) and -2 <= value <= 40}, "nodd")
    except Exception:
        return {}, None
    finally:
        dataset.close()
        stream.close()


def marker_key(lake: str, start: date, end: date) -> str:
    return f"{PREFIX}/_done/lake={lake}/{start.isoformat()}_{end.isoformat()}.json"


def marker_exists(s3, bucket: str, lake: str, start: date, end: date) -> bool:
    try:
        s3.head_object(Bucket=bucket, Key=marker_key(lake, start, end))
        return True
    except ClientError as error:
        if error.response.get("ResponseMetadata", {}).get("HTTPStatusCode") == 404:
            return False
        raise


def store_rows(rows: list[dict], lake: str, start: date, end: date, cache: Path, s3, bucket: str):
    path = cache / f"satellite-{lake}-{start}-{end}.parquet"
    pq.write_table(pa.Table.from_pylist(rows), path, compression="zstd", version="2.6")
    body = path.read_bytes()
    digest = hashlib.sha256(body).hexdigest()
    fragment = f"{PREFIX}/lake={lake}/start={start}/end={end}/{digest[:24]}.parquet"
    s3.put_object(Bucket=bucket, Key=fragment, Body=body,
                  ContentType="application/vnd.apache.parquet", CacheControl="private, no-store",
                  Metadata={"sha256": digest, "rows": str(len(rows)), "methodology": METHODOLOGY})
    head = s3.head_object(Bucket=bucket, Key=fragment)
    if head.get("Metadata", {}).get("sha256") != digest:
        raise RuntimeError("satellite fragment verification failed")
    marker = {"lake": lake, "start": start.isoformat(), "end": end.isoformat(), "rowCount": len(rows),
              "fragmentKey": fragment, "sha256": digest, "methodologyVersion": METHODOLOGY,
              "codeVersion": revision()}
    payload = json.dumps(marker, sort_keys=True, separators=(",", ":")).encode()
    key = marker_key(lake, start, end)
    s3.put_object(Bucket=bucket, Key=key, Body=payload, ContentType="application/json", CacheControl="private, no-store")
    if s3.get_object(Bucket=bucket, Key=key)["Body"].read() != payload:
        raise RuntimeError("satellite marker verification failed")
    return marker


def run(lake: str, start: date, end: date, cache: Path) -> tuple[list[dict], dict]:
    root = Path(__file__).resolve().parents[1]
    points = build_points(lake, root / "static/geo.json", Path(__file__).parent / "research/stations_v1.csv")
    model = public.MODELS[lake]
    locations, sampler = model_locations(points, model, cache, datetime(end.year, end.month, end.day, 12, tzinfo=UTC))
    # One request returns the full requested date range for one GLSEA pixel.
    # Keep the pool deliberately small to be courteous to the public ERDDAP.
    with ThreadPoolExecutor(max_workers=8) as executor:
        parts = list(executor.map(lambda point: glsea_point(point, start, end), points))
    glsea = {point["point_id"]: part for point, part in zip(points, parts)}
    rows, dates = [], []
    day = start
    noaa_days = 0
    while day <= end:
        dates.append(day.isoformat())
        cycle = datetime(day.year, day.month, day.day, 12, tzinfo=UTC)
        nodes = np.asarray(sorted({item[0] for item in locations.values()}), dtype=int)
        values, source = ncei_surface(model, cycle, nodes)
        if not values:
            values, source = nodd_surface(sampler, model, cycle, nodes)
        noaa_days += bool(values)
        for point in points:
            node, model_lat, model_lon, distance = locations[point["point_id"]]
            sat = glsea[point["point_id"]].get(day.isoformat())
            rows.append({**point, "date": day.isoformat(),
                         "glsea_temperature_f": sat[0] if sat else None,
                         "glsea_latitude": sat[1] if sat else None, "glsea_longitude": sat[2] if sat else None,
                         "noaa_temperature_f": values.get(node, math.nan) * 1.8 + 32 if node in values else None,
                         "noaa_model": model, "noaa_source": source, "noaa_cycle": cycle.isoformat().replace("+00:00", "Z"),
                         "noaa_node": node, "noaa_latitude": model_lat, "noaa_longitude": model_lon,
                         "noaa_node_distance_km": distance, "methodology_version": METHODOLOGY})
        print(json.dumps({"lake": lake, "date": day.isoformat(), "points": len(points),
                          "glsea": sum(glsea[p["point_id"]].get(day.isoformat()) is not None for p in points),
                          "noaa": sum(locations[p["point_id"]][0] in values for p in points)}), flush=True)
        day += timedelta(days=1)
    summary = {"lake": lake, "points": len(points), "greenBayPoints": sum(p["green_bay"] for p in points),
               "days": len(dates), "glseaRows": sum(r["glsea_temperature_f"] is not None for r in rows),
               "noaaRows": sum(r["noaa_temperature_f"] is not None for r in rows), "noaaDays": noaa_days}
    return rows, summary


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--lake", required=True, choices=LAKES)
    parser.add_argument("--start", type=date.fromisoformat, required=True)
    parser.add_argument("--end", type=date.fromisoformat, required=True)
    parser.add_argument("--cache", type=Path, default=Path("/tmp/finfindr-satellite-field"))
    parser.add_argument("--store", action="store_true")
    parser.add_argument("--skip-existing-r2", action="store_true")
    args = parser.parse_args(argv)
    if args.end < args.start:
        parser.error("end precedes start")
    args.cache.mkdir(parents=True, exist_ok=True)
    bucket = store.bucket()
    s3 = None
    if args.store:
        if not bucket or bucket == "piercast-lake-map":
            raise RuntimeError("refusing satellite upload outside the private scorecard bucket")
        s3 = store.client()
        if args.skip_existing_r2 and marker_exists(s3, bucket, args.lake, args.start, args.end):
            print(json.dumps({"lake": args.lake, "status": "r2_skip"}))
            return 0
    rows, summary = run(args.lake, args.start, args.end, args.cache)
    if s3:
        summary["marker"] = store_rows(rows, args.lake, args.start, args.end, args.cache, s3, bucket)
    print(json.dumps({**summary, "status": "stored" if s3 else "dry_run"}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
