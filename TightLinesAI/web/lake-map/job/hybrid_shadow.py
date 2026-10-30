#!/usr/bin/env python3
"""Private, fail-closed hybrid shadow runner.

This module reads the live archive and current published NOAA run, but every
write is constrained to ``shadow/v1/`` in a separate private bucket. Nothing
produced here is consumed by the lake-map gatekeeper or PierCast.
"""
from __future__ import annotations

import argparse
import gzip
import hashlib
import io
import json
import math
import os
import statistics
import sys
import time
from collections import defaultdict, deque
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import pyarrow as pa
import pyarrow.parquet as pq
from botocore.config import Config
from scipy.ndimage import distance_transform_edt

from lakemap.encode import decode_scalar

import verify


LIVE_BUCKET = "piercast-lake-map"
SHADOW_PREFIX = "shadow/v1/"
METADATA_KEY = "private/scorecard/v1/metadata/v1/stations.parquet"
PARAMS_KEY = f"{SHADOW_PREFIX}params/runtime-v1.json"
CANDIDATES = ("point", "map-a5", "map-a6", "map-a7")
VERSION_IDS = {
    "point": "gauge-anchored-point-v5-shadow1",
    "map-a5": "gauge-anchored-v5-a5-shadow1",
    "map-a6": "gauge-anchored-v6-a6-shadow1",
    "map-a7": "gauge-anchored-v7-a7-shadow1",
}
SEASONS = {5: "may-jun", 6: "may-jun", 7: "jul-aug", 8: "jul-aug",
           9: "sep-oct", 10: "sep-oct", 11: "nov-dec", 12: "nov-dec"}
BAD_FLAGS = {
    "range", "provider_qc", "stuck", "air_tracking", "spike",
    "station_suspect_day", "invalid_position", "invalid_position_station_day",
    "removed", "unknown_depth_multi_sensor",
}


def iso(value):
    return value.astimezone(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def parse_time(value):
    return verify.parse_time(value)


def floor_hour(value):
    return value.astimezone(timezone.utc).replace(minute=0, second=0, microsecond=0)


def endpoint(account):
    raw = account.strip().strip("\"'")
    if raw.startswith("http"):
        return raw.rstrip("/")
    return f"https://{raw.split('.')[0]}.r2.cloudflarestorage.com"


def r2_client(prefix):
    account = os.environ[f"{prefix}R2_ACCOUNT_ID"]
    return __import__("boto3").client(
        "s3", endpoint_url=endpoint(account),
        aws_access_key_id=os.environ[f"{prefix}R2_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ[f"{prefix}R2_SECRET_ACCESS_KEY"],
        region_name="auto", config=Config(retries={"max_attempts": 5, "mode": "standard"}, max_pool_connections=32),
    )


def read_bytes(s3, bucket, key, optional=False):
    try:
        return s3.get_object(Bucket=bucket, Key=key)["Body"].read()
    except Exception as error:
        response = getattr(error, "response", {})
        code = str(response.get("Error", {}).get("Code", ""))
        status = response.get("ResponseMetadata", {}).get("HTTPStatusCode")
        if optional and (code in {"404", "NoSuchKey", "NotFound"} or status == 404):
            return None
        raise


def read_json(s3, bucket, key, optional=False):
    body = read_bytes(s3, bucket, key, optional=optional)
    if body is None:
        return None
    if body[:2] == b"\x1f\x8b":
        body = gzip.decompress(body)
    return json.loads(body)


class ShadowStore:
    def __init__(self, s3, bucket):
        if not bucket or bucket == LIVE_BUCKET:
            raise RuntimeError("shadow output bucket must be non-empty and separate from the live map bucket")
        self.s3, self.bucket = s3, bucket

    @staticmethod
    def guard(key):
        if not isinstance(key, str) or not key.startswith(SHADOW_PREFIX) or ".." in key:
            raise RuntimeError("shadow write rejected outside private shadow/v1 prefix")

    def put(self, key, body, content_type, metadata=None):
        self.guard(key)
        digest = hashlib.sha256(body).hexdigest()
        self.s3.put_object(
            Bucket=self.bucket, Key=key, Body=body, ContentType=content_type,
            CacheControl="private, no-store", Metadata={"sha256": digest, **(metadata or {})},
        )
        return digest

    def json(self, key, value):
        body = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
        return self.put(key, body, "application/json")

    def get_json(self, key, optional=False):
        self.guard(key)
        return read_json(self.s3, self.bucket, key, optional=optional)

    def get_bytes(self, key, optional=False):
        self.guard(key)
        return read_bytes(self.s3, self.bucket, key, optional=optional)


def parquet_bytes(rows):
    sink = pa.BufferOutputStream()
    pq.write_table(pa.Table.from_pylist(rows), sink, compression="zstd")
    return sink.getvalue().to_pybytes()


def parquet_rows(body):
    return pq.read_table(pa.BufferReader(body)).to_pylist()


def observation_archive_keys(s3, start, end):
    """Discover immutable snapshots using bounded one-day archive prefixes."""
    here = start.astimezone(timezone.utc).date()
    stop = end.astimezone(timezone.utc).date()
    keys = []
    while here <= stop:
        keys.extend(verify.list_keys(s3, verify._daily_prefix(here)))
        here += timedelta(days=1)
    return sorted(set(keys))


def load_optional_jsons(s3, bucket, keys, workers=24):
    with ThreadPoolExecutor(max_workers=workers) as pool:
        values = list(pool.map(lambda key: read_json(s3, bucket, key, optional=True), keys))
    return [value for value in values if isinstance(value, dict)]


def finite(value):
    return isinstance(value, (int, float)) and math.isfinite(value)


def metadata_rows(body):
    return parquet_rows(body)


def metadata_index(rows):
    aliases, canonical = {}, {}
    for row in rows:
        station = str(row["station_id"])
        clean = dict(row)
        # The catalog intentionally preserves every known depth for multi-sensor
        # stations as a semicolon-delimited value. Live readings, not this
        # descriptive field, drive causal shallowest-sensor selection below.
        for key in ("lat", "lon", "shore_distance_km", "shoreline_tangent_bearing"):
            if clean.get(key) is not None:
                clean[key] = float(clean[key])
        canonical[station] = clean
        for alias in [station, *(str(row.get("alternate_station_ids") or "").split(";"))]:
            if alias:
                aliases[alias.lower()] = station
    return canonical, aliases


def observation_alias(reading):
    return verify.observation_id(reading).lower()


def source_rank(reading):
    text = f"{reading.get('source', '')} {reading.get('identity', '')}".lower()
    if "ndbc" in text or "external:" in text:
        return 0
    if "co-ops" in text or "coops:" in text:
        return 1
    if "glos" in text:
        return 2
    return 3


def extract_hourly_rows(snapshots, metadata, aliases, issued_at):
    observations = verify.unique_observations(snapshots)
    raw = []
    for item in observations:
        observed = item["observed"]
        if observed > issued_at:
            continue
        canonical = aliases.get(observation_alias(item))
        if not canonical or canonical not in metadata:
            continue
        meta = metadata[canonical]
        lat, lon = item.get("lat"), item.get("lon")
        flags = set(item.get("qualityFlags") or [])
        if finite(lat) and finite(lon) and haversine(float(lat), float(lon), meta["lat"], meta["lon"]) > 25:
            flags.add("invalid_position")
        if not 32 <= float(item["waterF"]) <= 90:
            flags.add("range")
        if item.get("waterQuality") not in ("good", "provider_qc"):
            flags.add("provider_qc")
        flags.update(set(item.get("quality_flags") or []).intersection(
            {"station_suspect_day", "invalid_position", "invalid_position_station_day"}))
        raw.append({
            "station_id": canonical, "identity": item["identity"], "parameter_id": item.get("parameterId"),
            "time": observed, "water_f": float(item["waterF"]), "air_f": item.get("airF"),
            "depth_m": item.get("waterDepthM"), "surface": item.get("waterSurface") is True,
            "source": str(item.get("source") or "unknown"), "source_rank": source_rank(item),
            "flags": flags, "lake": meta["waterbody"], "class": meta["station_class"],
        })

    # A physically duplicated reading keeps the fixed network priority.
    dedup = {}
    for row in raw:
        key = (row["station_id"], row["time"], round(row["water_f"], 2))
        if key not in dedup or row["source_rank"] < dedup[key]["source_rank"]:
            dedup[key] = row
    raw = list(dedup.values())

    # Multi-sensor stations require known depths and keep only the shallowest <=1.5 m.
    sensors = defaultdict(dict)
    for row in raw:
        depth_signature = round(float(row["depth_m"]), 3) if finite(row.get("depth_m")) else "unknown"
        signature = str(row.get("parameter_id") or f"depth:{depth_signature}")
        sensors[row["station_id"]][signature] = row.get("depth_m")
    allowed = {}
    for station, members in sensors.items():
        known = [float(depth) for depth in members.values() if finite(depth)]
        if len(members) > 1 and len(known) != len(members):
            allowed[station] = None
        elif known:
            allowed[station] = min(known) if min(known) <= 1.5 else None
        else:
            allowed[station] = "assumed" if metadata[station]["station_class"] in {
                "harbor", "nearshore_buoy", "offshore_buoy", "connecting_water"
            } else None

    filtered = []
    for row in raw:
        choice = allowed.get(row["station_id"])
        if choice is None:
            continue
        if choice != "assumed" and (not finite(row.get("depth_m")) or abs(float(row["depth_m"]) - choice) > .01):
            continue
        filtered.append(row)

    bins = defaultdict(list)
    for row in filtered:
        hour = floor_hour(row["time"] + timedelta(minutes=30))
        bins[(row["station_id"], hour)].append(row)
    hourly = []
    for (station, hour), items in sorted(bins.items(), key=lambda item: item[0]):
        best_source = min(item["source_rank"] for item in items)
        items = [item for item in items if item["source_rank"] == best_source]
        meta = metadata[station]
        flags = set().union(*(item["flags"] for item in items))
        air = [float(item["air_f"]) for item in items if finite(item.get("air_f"))]
        hourly.append({
            "station_id": station, "time": hour, "water_f": statistics.fmean(item["water_f"] for item in items),
            "air_f": statistics.fmean(air) if air else None, "flags": flags,
            "lake": meta["waterbody"], "class": meta["station_class"],
            "lat": meta["lat"], "lon": meta["lon"], "shore_distance_km": meta.get("shore_distance_km"),
            "source": items[0]["source"], "obs_count": len(items),
            "depth_assumed": allowed.get(station) == "assumed" or bool(meta.get("sensor_depth_assumed")),
        })
    apply_causal_qc(hourly, metadata)
    return hourly


def quantization_step(values):
    ordered = sorted(set(round(float(value), 3) for value in values))
    differences = [b - a for a, b in zip(ordered, ordered[1:]) if 0 < b - a <= 1]
    return max(.001, float(np.quantile(differences, .1))) if differences else .1


def nearest_station(rows, station, limit):
    target = next(row for row in rows if row["station_id"] == station)
    candidates = []
    for row in rows:
        other = row["station_id"]
        if other == station or row["lake"] != target["lake"]:
            continue
        distance = haversine(target["lat"], target["lon"], row["lat"], row["lon"])
        if distance <= limit:
            candidates.append((distance, other))
    return min(candidates)[1] if candidates else None


def apply_causal_qc(rows, metadata):
    by_station = defaultdict(list)
    for row in rows:
        by_station[row["station_id"]].append(row)
    representatives = [values[0] for values in by_station.values()]
    series = {station: {row["time"]: row for row in values} for station, values in by_station.items()}

    # Impossible readings contaminate the same physical station on D-1/D/D+1.
    suspect = defaultdict(set)
    for station, values in by_station.items():
        for row in values:
            if "range" in row["flags"]:
                for offset in (-1, 0, 1):
                    suspect[station].add(row["time"].date() + timedelta(days=offset))
        for row in values:
            if row["time"].date() in suspect[station]:
                row["flags"].add("station_suspect_day")

    for station, values in by_station.items():
        values.sort(key=lambda row: row["time"])
        mapping = series[station]
        neighbor50 = nearest_station(representatives, station, 50)
        neighbor20 = nearest_station(representatives, station, 20)
        tolerance = max(.05, quantization_step([row["water_f"] for row in values]) / 2)
        neighbor_map = series.get(neighbor50, {})
        for right in range(len(values)):
            window = [row for row in values[max(0, right - 23):right + 1]
                      if values[right]["time"] - row["time"] <= timedelta(hours=23)]
            if len(window) >= 6 and max(row["water_f"] for row in window) - min(row["water_f"] for row in window) <= 2 * tolerance:
                neighbor_values = [neighbor_map[row["time"]]["water_f"] for row in window if row["time"] in neighbor_map]
                if len(neighbor_values) >= max(3, math.ceil(len(window) / 2)) and max(neighbor_values) - min(neighbor_values) > .5:
                    for row in window:
                        row["flags"].add("stuck")
            if values[right]["class"] in {"nearshore_buoy", "offshore_buoy"} and len(window) >= 24:
                pairs = [(row["water_f"], row["air_f"]) for row in window if finite(row.get("air_f"))]
                if len(pairs) >= 18:
                    water, air = np.array([p[0] for p in pairs]), np.array([p[1] for p in pairs])
                    if np.std(water) > 0 and np.std(air) > 0 and np.corrcoef(water, air)[0, 1] > .9 and np.mean(np.abs(water - air)) < 2 and np.ptp(water) > 4:
                        for row in window:
                            row["flags"].add("air_tracking")
        neighbor_map = series.get(neighbor20, {})
        for row in values:
            previous = mapping.get(row["time"] - timedelta(hours=1))
            if previous is None or abs(row["water_f"] - previous["water_f"]) <= 4:
                continue
            jump = row["water_f"] - previous["water_f"]
            reverted = any(
                (future := mapping.get(row["time"] + timedelta(hours=offset))) is not None
                and abs(future["water_f"] - previous["water_f"]) <= abs(jump) * .25
                for offset in (1, 2)
            )
            if not reverted:
                continue
            neighbor_now, neighbor_before = neighbor_map.get(row["time"]), neighbor_map.get(row["time"] - timedelta(hours=1))
            shared = False
            if neighbor_now and neighbor_before:
                delta = neighbor_now["water_f"] - neighbor_before["water_f"]
                shared = abs(delta) > 2 and math.copysign(1, delta) == math.copysign(1, jump)
            if not shared:
                row["flags"].add("spike")
    for row in rows:
        row["qc_pass"] = not row["flags"].intersection(BAD_FLAGS)


def haversine(lat1, lon1, lat2, lon2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 6371.0088 * 2 * math.asin(min(1, math.sqrt(a)))


def bearing(lat1, lon1, lat2, lon2):
    p1, p2, dl = math.radians(lat1), math.radians(lat2), math.radians(lon2 - lon1)
    y, x = math.sin(dl) * math.cos(p2), math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl)
    return (math.degrees(math.atan2(y, x)) + 360) % 360


def delta_angle(a, b):
    return (a - b + 180) % 360 - 180


def season(month):
    return SEASONS.get(month, "nov-dec")


def distance_band(distance):
    if distance < 10: return "0-10"
    if distance < 25: return "10-25"
    if distance < 50: return "25-50"
    if distance < 100: return "50-100"
    return "100+"


def mi_region(lat, lon):
    if lat >= 44.45 and lon <= -86.70: return "green-bay"
    if lat < 43.5: return "southern-basin"
    if lat >= 44.6: return "northern-mi"
    return "east-shore" if lon > -87 else "west-shore"


def lake_for(lat, lon):
    if lat >= 46.15 and lon < -84.0: return "lake-superior"
    if lon > -79.5 and lat >= 43.0: return "lake-ontario"
    if lon > -83.5 and lat < 43.2: return "lake-erie"
    if lon < -84.5: return "lake-michigan"
    return "lake-huron"


def find_site(station, metadata, forecast):
    sites = forecast.get("sites", {})
    aliases = [station]
    alt = str(metadata[station].get("alternate_station_ids") or "")
    aliases.extend(alias for alias in alt.split(";") if alias)
    for alias in aliases:
        if alias in sites:
            return sites[alias]
    target = metadata[station]
    close = [(haversine(target["lat"], target["lon"], float(site["lat"]), float(site["lon"])), site)
             for site in sites.values() if finite(site.get("lat")) and finite(site.get("lon"))]
    return min(close)[1] if close and min(close)[0] <= 1 else None


def load_forecasts(live_s3, index, start):
    runs = []
    for item in index.get("runs", []):
        cycle = parse_time(item.get("cycle"))
        if cycle and cycle >= start - timedelta(days=6):
            runs.append((cycle, item))
    with ThreadPoolExecutor(max_workers=20) as pool:
        loaded = list(pool.map(lambda pair: read_json(
            live_s3, LIVE_BUCKET, f"{pair[1]['base']}verification.json", optional=True,
        ), runs))
    available = [(pair, forecast) for pair, forecast in zip(runs, loaded) if isinstance(forecast, dict)]
    for (cycle, item), forecast in available:
        forecast["_cycle"] = cycle
        forecast["_base"] = item["base"]
    return sorted((forecast for _, forecast in available), key=lambda item: item["_cycle"])


def pair_history(rows, forecasts, metadata):
    by_station = defaultdict(list)
    for row in rows:
        if not row["qc_pass"]:
            continue
        candidates = []
        for forecast in forecasts:
            lead = round((row["time"] - forecast["_cycle"]).total_seconds() / 3600)
            if 0 <= lead <= 6:
                site = find_site(row["station_id"], metadata, forecast)
                if site and lead < len(site.get("hours", [])) and finite(site["hours"][lead]):
                    candidates.append((forecast["_cycle"], float(site["hours"][lead])))
        if candidates:
            cycle, model = max(candidates)
            copy = dict(row)
            copy.update({"model_f": model, "miss_f": row["water_f"] - model, "model_cycle": cycle})
            by_station[row["station_id"]].append(copy)
    return by_station


def residual_states(paired, issued_at):
    states = {}
    for station, values in paired.items():
        values.sort(key=lambda row: row["time"])
        recent = [row for row in values if issued_at - row["time"] <= timedelta(hours=3)]
        if not recent:
            continue
        miss = [row["miss_f"] for row in values]
        slow = miss[0]
        last = values[0]["time"]
        for row in values[1:]:
            dt = max(1, (row["time"] - last).total_seconds() / 3600)
            alpha = 1 - math.exp(-dt / (14 * 24))
            slow += alpha * (row["miss_f"] - slow)
            last = row["time"]
        latest = max(recent, key=lambda row: row["time"])
        window = [row["miss_f"] for row in values if latest["time"] - row["time"] <= timedelta(hours=2)]
        age = max(0, (issued_at - latest["time"]).total_seconds() / 3600)
        run_hours = 1
        for a, b in zip(reversed(values[:-1]), reversed(values[1:])):
            if b["time"] - a["time"] == timedelta(hours=1): run_hours += 1
            else: break
        states[station] = {
            "correction": float(np.median(window)), "slow": float(slow), "age": age,
            "ramp": min(1.0, run_hours / 6) * max(0.0, 1 - age / 24), "latest": latest,
        }
    return states


def tau(params, station_class, month):
    key = f"{station_class if station_class in {'harbor','nearshore_buoy','offshore_buoy'} else 'connecting_water'}|{season(month)}"
    item = params["v4"]["taus"].get(key, {"tau": 24})
    return float(item.get("tau", item))


def gate_alpha(params, lake, month, zone, nearest, lat, lon):
    band = distance_band(nearest)
    keys = []
    if lake == "lake-michigan" and mi_region(lat, lon) == "southern-basin":
        keys.append(f"southern-basin|{season(month)}|{band}")
    keys.extend((f"{lake}|{season(month)}|{zone}|{band}", f"pooled|{season(month)}|{zone}|{band}"))
    for key in keys:
        item = params["v5"]["gatesA"].get(key)
        if isinstance(item, dict):
            return item.get("alpha")
    return None


def oi_slow(target, lake, states, metadata, exclude=None):
    values, weights, distances = [], [], []
    p = target["params"]
    for station, state in states.items():
        if station == exclude or metadata[station]["waterbody"] != lake:
            continue
        source = metadata[station]
        distance = haversine(target["lat"], target["lon"], source["lat"], source["lon"])
        if distance <= 2:
            continue
        tangent = float(source.get("shoreline_tangent_bearing") or 0)
        angle = math.radians(delta_angle(bearing(source["lat"], source["lon"], target["lat"], target["lon"]), tangent))
        along, cross = abs(distance * math.cos(angle)), abs(distance * math.sin(angle))
        cls = source["station_class"]
        reliability = float(p.get({"harbor":"r_harbor","nearshore_buoy":"r_nearshore","offshore_buoy":"r_offshore"}.get(cls, "r_connecting"), 1))
        weight = math.exp(-along / float(p["slow_l"]) - cross / (float(p["slow_l"]) / 2)) * state["ramp"] / max(.05, reliability)
        if weight > 1e-7:
            values.append(state["slow"]); weights.append(weight); distances.append(distance)
    if not weights:
        return 0.0, math.inf
    median = float(np.median(values)); sigma = max(.25, 1.4826 * float(np.median(np.abs(np.array(values) - median))))
    weights = np.array(weights) * np.minimum(1.0, 3 * sigma / np.maximum(np.abs(np.array(values) - median), 1e-9))
    support = float(weights.sum()); estimate = float(np.dot(weights, values) / max(support, 1e-9))
    confidence = support / (support + 1)
    if confidence < .2: estimate *= confidence / .2
    return estimate, min(distances)


def anchor_correction(target, lake, states, metadata, params, exclude=None):
    values, weights, distances, taus = [], [], [], []
    enabled = set(params["v5"]["anchorEnabled"])
    for station, state in states.items():
        source = metadata[station]; cls = source["station_class"]
        if station == exclude or source["waterbody"] != lake or cls not in enabled:
            continue
        distance = haversine(target["lat"], target["lon"], source["lat"], source["lon"])
        radius = min(15.0, max(2.0, abs(state["correction"])))
        tangent = float(source.get("shoreline_tangent_bearing") or 0)
        angle = math.radians(delta_angle(bearing(source["lat"], source["lon"], target["lat"], target["lon"]), tangent))
        along, cross = abs(distance * math.cos(angle)), abs(distance * math.sin(angle))
        norm = math.sqrt((along / radius) ** 2 + (cross / (radius / 2)) ** 2)
        weight = max(0.0, 1 - norm) * state["ramp"]
        if weight > 1e-9:
            values.append(state["correction"]); weights.append(weight); distances.append(distance)
            taus.append(tau(params, cls, target["month"]))
    if not weights:
        return None
    return float(np.dot(weights, values) / np.sum(weights)), min(distances), float(np.mean(taus))


def zone_prior(target, params, version):
    lake, month, shore = target["lake"], target["month"], float(target.get("shore_distance_km") or 0)
    fitted = params[version]
    near_weight = 1 if shore <= 3 else 0 if shore >= 7 else (7 - shore) / 4
    open_weight = 1 - near_weight
    near_enabled = fitted["enable"].get(f"{lake}|{month}|nearshore", False)
    open_enabled = fitted["enable"].get(f"{lake}|{month}|open-water", False)
    region = mi_region(target["lat"], target["lon"]) if lake == "lake-michigan" else ("offshore" if shore >= 5 else "nearshore")
    near = float(fitted["nearPrior"].get(f"{lake}|{region}|{month}", 0)) if near_enabled else 0
    opened = float(fitted["openPrior"].get(f"{lake}|{month}", 0)) if open_enabled else 0
    return near_weight * near + open_weight * opened


def map_correction(target, variant, states, metadata, params, exclude=None):
    # Research parameters are intentionally fitted only for the five Great
    # Lakes. Keep any other live waterbody exactly on NOAA instead of either
    # failing the isolated job or extrapolating an untrained correction.
    if not target.get("params"):
        return 0.0, "outside", math.inf, None
    anchor = anchor_correction(target, target["lake"], states, metadata, params, exclude=exclude)
    if anchor is not None:
        return anchor[0], "anchor", anchor[1], anchor[2]
    slow, nearest = oi_slow(target, target["lake"], states, metadata, exclude=exclude)
    alpha = gate_alpha(params, target["lake"], target["month"], "open-water", nearest, target["lat"], target["lon"])
    if alpha is None or float(alpha) <= 0 or not math.isfinite(nearest):
        return 0.0, "outside", nearest, None
    if variant == "map-a5":
        correction = float(alpha) * slow
    else:
        prior = zone_prior(target, params, "v7" if variant == "map-a7" else "v6")
        correction = prior + float(alpha) * (slow - prior)
    return correction, "broad", nearest, None


def fade(value, lead, layer, target, params, anchor_tau=None):
    if layer == "outside" or abs(value) < 1e-12: return 0.0
    if lead == 0: return value
    if layer == "anchor": return value * math.exp(-lead / max(6, anchor_tau or 24))
    p = params["v2"]["params"][target["lake"]]
    known = {0: 1.0, 6: p["fslow_6"], 24: p["fslow_24"], 48: p["fslow_48"], 120: p["fslow_120"]}
    lower = max(key for key in known if key <= lead); upper = min(key for key in known if key >= lead)
    factor = known[lower] if lower == upper else known[lower] + (known[upper] - known[lower]) * (lead - lower) / (upper - lower)
    return value * factor


def find_current_forecast(forecasts):
    return max(forecasts, key=lambda item: item["_cycle"])


def point_rows(forecast, states, metadata, params, candidate, issued_at):
    """Build forecasts relative to the shadow issue time, not model cycle hour 0."""
    month = issued_at.month; output = []
    model_offset = max(0, math.ceil((issued_at - forecast["_cycle"]).total_seconds() / 3600))
    for station, state in states.items():
        site = find_site(station, metadata, forecast)
        if not site: continue
        target = {**metadata[station], "lake": metadata[station]["waterbody"], "month": month, "params": params["v2"]["params"].get(metadata[station]["waterbody"])}
        if candidate == "point":
            correction, layer, nearest, at_tau = state["correction"], "own-anchor", 0.0, tau(params, target["station_class"], month)
        else:
            correction, layer, nearest, at_tau = map_correction(target, candidate, states, metadata, params)
        for model_lead, noaa in enumerate(site.get("hours", [])):
            lead = model_lead - model_offset
            if lead < 0:
                continue
            if not finite(noaa): continue
            corr = fade(correction, lead, "anchor" if "anchor" in layer else layer, target, params, at_tau)
            output.append({
                "target_id": station, "target_type": "gauge", "lake": target["lake"], "station_class": target["station_class"],
                "issued_at": iso(issued_at), "model_cycle": iso(forecast["_cycle"]),
                "valid_time": iso(issued_at + timedelta(hours=lead)), "model_lead_hours": model_lead,
                "lead_hours": lead, "noaa_f": float(noaa), "candidate_f": float(noaa) + corr,
                "correction_f": corr, "layer": layer, "source_distance_km": nearest,
            })
    pier_sites = forecast.get("pierSites", {})
    for pier, gauge in params["piers"].items():
        state, site = states.get(gauge), pier_sites.get(pier)
        if not state or not site or gauge not in metadata: continue
        target_meta = metadata[gauge]
        target = {**target_meta, "lake": target_meta["waterbody"], "month": month, "params": params["v2"]["params"].get(target_meta["waterbody"])}
        if candidate == "point":
            correction, layer, nearest, at_tau = state["correction"], "pier-anchor", 0.0, tau(params, target["station_class"], month)
        else:
            pier_target = {**target, "lat": float(site.get("lat", target["lat"])), "lon": float(site.get("lon", target["lon"]))}
            correction, layer, nearest, at_tau = map_correction(pier_target, candidate, states, metadata, params)
        for model_lead, noaa in enumerate(site.get("hours", [])):
            lead = model_lead - model_offset
            if lead < 0:
                continue
            if not finite(noaa): continue
            corr = fade(correction, lead, "anchor" if "anchor" in layer else layer, target, params, at_tau)
            output.append({
                "target_id": pier, "target_type": "pier", "gauge_id": gauge, "lake": target["lake"], "station_class": target["station_class"],
                "issued_at": iso(issued_at), "model_cycle": iso(forecast["_cycle"]),
                "valid_time": iso(issued_at + timedelta(hours=lead)), "model_lead_hours": model_lead,
                "lead_hours": lead, "noaa_f": float(noaa), "candidate_f": float(noaa) + corr,
                "correction_f": corr, "layer": layer, "source_distance_km": nearest,
            })
    return output


def loo_rows(forecast, states, metadata, params, candidate, issued_at):
    output = []
    model_offset = max(0, math.ceil((issued_at - forecast["_cycle"]).total_seconds() / 3600))
    for station in states:
        site = find_site(station, metadata, forecast)
        if not site: continue
        meta = metadata[station]
        target = {**meta, "lake": meta["waterbody"], "month": issued_at.month, "params": params["v2"]["params"].get(meta["waterbody"])}
        correction, layer, nearest, anchor_tau = map_correction(target, candidate, states, metadata, params, exclude=station)
        for model_lead, noaa in enumerate(site.get("hours", [])):
            lead = model_lead - model_offset
            if lead < 0 or not finite(noaa): continue
            corr = fade(correction, lead, layer, target, params, anchor_tau)
            output.append({
                "target_id": station, "lake": target["lake"], "station_class": target["station_class"],
                "issued_at": iso(issued_at), "model_cycle": iso(forecast["_cycle"]),
                "valid_time": iso(issued_at + timedelta(hours=lead)), "lead_hours": lead, "model_lead_hours": model_lead,
                "noaa_f": float(noaa), "candidate_f": float(noaa) + corr,
                "correction_f": corr, "layer": layer, "source_distance_km": nearest,
            })
    return output


def load_current_frame(live_s3, latest, now):
    manifest = read_json(live_s3, LIVE_BUCKET, f"{latest['base']}manifest.json")
    cycle = parse_time(manifest["cycle"])
    lead = max(0, min(120, round((now - cycle).total_seconds() / 3600)))
    descriptor = manifest["grids"]["temp"]
    grid = type("Grid", (), {
        "scale": float(descriptor["scale"]), "offset": float(descriptor["offset"]),
        "nodata": int(descriptor["nodata"]), "encoding": descriptor.get("encoding", "u8"),
    })
    key = f"{latest['base']}{manifest['frames'][lead]['temp']}"
    frame = decode_scalar(read_bytes(live_s3, LIVE_BUCKET, key), grid)
    return manifest, lead, frame


def field_rows(frame, manifest, states, metadata, params, variant, now):
    descriptor = manifest["grids"]["temp"]; domain = manifest["domain"]
    res = float(descriptor["res"]); stride = max(1, math.ceil(.04 / res))
    water = np.isfinite(frame); shore_cells = distance_transform_edt(water) * res * 111.195
    output = []
    for row in range(0, frame.shape[0], stride):
        lat = float(domain["north"]) - row * res
        for col in range(0, frame.shape[1], stride):
            noaa = frame[row, col]
            if not np.isfinite(noaa): continue
            lon = float(domain["west"]) + col * res; lake = lake_for(lat, lon)
            target = {"lat": lat, "lon": lon, "lake": lake, "waterbody": lake, "month": now.month,
                      "station_class": "nearshore_buoy", "shore_distance_km": float(shore_cells[row, col]),
                      "params": params["v2"]["params"][lake]}
            correction, layer, nearest, _ = map_correction(target, variant, states, metadata, params)
            output.append({"row": row, "column": col, "lat": round(lat, 5), "lon": round(lon, 5),
                           "lake": lake, "valid_time": iso(floor_hour(now)), "noaa_f": float(noaa),
                           "candidate_f": float(noaa) + correction, "correction_f": correction,
                           "layer": layer, "source_distance_km": nearest if math.isfinite(nearest) else None})
    return output


def write_candidate(store, candidate, issued_at, points, fields=None, loo=None):
    root = f"{SHADOW_PREFIX}{candidate}/{issued_at:%Y/%m/%d}/{issued_at:%H}"
    objects = {}
    for suffix, rows in (("points.parquet", points), ("field.parquet", fields), ("loo.parquet", loo)):
        if rows is None: continue
        rows = [{**row, "candidate": candidate, "version_id": VERSION_IDS[candidate]} for row in rows]
        key = f"{root}.{suffix}"; body = parquet_bytes(rows)
        objects[suffix] = {"key": key, "rows": len(rows), "sha256": store.put(key, body, "application/vnd.apache.parquet")}
    manifest = {"formatVersion": 1, "candidate": candidate, "versionId": VERSION_IDS[candidate],
                "issuedAt": iso(issued_at), "privateResearchOnly": True, "servedByMap": False, "objects": objects}
    manifest["sha256"] = store.json(f"{root}.manifest.json", manifest)
    return manifest


def load_runtime(live_s3, private_store, now):
    params = private_store.get_json(PARAMS_KEY)
    metadata = metadata_rows(read_bytes(private_store.s3, private_store.bucket, METADATA_KEY))
    meta, aliases = metadata_index(metadata)
    snapshots = load_optional_jsons(live_s3, LIVE_BUCKET, observation_archive_keys(live_s3, now - timedelta(days=31), now))
    latest_obs = read_json(live_s3, LIVE_BUCKET, "observations/latest.json")
    if latest_obs: snapshots.append(latest_obs)
    hourly = extract_hourly_rows(snapshots, meta, aliases, now)
    index = read_json(live_s3, LIVE_BUCKET, "validation/forecast-index.json")
    forecasts = load_forecasts(live_s3, index, now - timedelta(days=31))
    paired = pair_history(hourly, forecasts, meta)
    states = residual_states(paired, now)
    return params, meta, hourly, forecasts, states


def run_hourly(args):
    started = time.monotonic(); now = floor_hour(parse_time(args.now) if args.now else datetime.now(timezone.utc))
    live_s3, private_s3 = r2_client("LIVE_"), r2_client("")
    store = ShadowStore(private_s3, os.environ["SHADOW_R2_BUCKET"])
    params, metadata, hourly, forecasts, states = load_runtime(live_s3, store, now)
    current = find_current_forecast(forecasts)
    latest = read_json(live_s3, LIVE_BUCKET, "latest.json")
    manifest, current_lead, frame = load_current_frame(live_s3, latest, now)
    summaries = []
    for candidate in CANDIDATES:
        points = point_rows(current, states, metadata, params, candidate, now)
        fields = field_rows(frame, manifest, states, metadata, params, candidate, now) if candidate != "point" else None
        loo = loo_rows(current, states, metadata, params, candidate, now) if candidate != "point" else None
        summaries.append(write_candidate(store, candidate, now, points, fields, loo))
    elapsed = time.monotonic() - started
    summary = {"issuedAt": iso(now), "gauges": len(states), "piers": sum(1 for gauge in params["piers"].values() if gauge in states),
               "gridCells": max((item["objects"].get("field.parquet", {}).get("rows", 0) for item in summaries), default=0),
               "noaaRun": latest["run"], "noaaCurrentLead": current_lead, "runtimeSeconds": round(elapsed, 2),
               "qcRules": ["range", "provider_qc", "shallowest_sensor", "station_suspect_day", "invalid_position", "stuck", "air_tracking", "spike", "freshness_removal"],
               "candidates": [item["candidate"] for item in summaries]}
    print(json.dumps(summary, sort_keys=True))
    return 0


def prediction_key(candidate, issued):
    return f"{SHADOW_PREFIX}{candidate}/{issued:%Y/%m/%d}/{issued:%H}.points.parquet"


def loo_key(candidate, issued):
    return f"{SHADOW_PREFIX}{candidate}/{issued:%Y/%m/%d}/{issued:%H}.loo.parquet"


def aggregate_scores(rows):
    groups = {"overall": rows}
    for field in ("lake", "station_class", "distance_band"):
        values = defaultdict(list)
        for row in rows: values[str(row.get(field) or "unknown")].append(row)
        groups[field] = values
    def one(part):
        if not part: return {"n": 0}
        noaa = np.array([abs(row["observed_f"] - row["noaa_f"]) for row in part])
        candidate = np.array([abs(row["observed_f"] - row["candidate_f"]) for row in part])
        return {"n": len(part), "noaaMae": round(float(noaa.mean()), 4), "candidateMae": round(float(candidate.mean()), 4),
                "worseGt1": round(float(np.mean(candidate > noaa + 1)), 5), "worseGt2": round(float(np.mean(candidate > noaa + 2)), 5),
                "betterGt1": round(float(np.mean(candidate + 1 < noaa)), 5)}
    by_lead = defaultdict(list)
    for row in rows:
        if row.get("lead_hours") is not None:
            by_lead[str(int(row["lead_hours"]))].append(row)
    return {"overall": one(rows), "byLead": {lead: one(part) for lead, part in sorted(by_lead.items(), key=lambda item: int(item[0]))},
            **{field: {name: one(part) for name, part in values.items()} for field, values in groups.items() if field != "overall"}}


def gate_blocks(rows):
    """Retain station-day error blocks, never raw readings, for bootstrap gates."""
    grouped = defaultdict(list)
    for row in rows:
        day = str(row["valid_time"])[:10]
        grouped[(row["target_id"], day, int(row["lead_hours"]))].append(row)
    output = []
    for (station, day, lead), part in grouped.items():
        noaa = [abs(row["observed_f"] - row["noaa_f"]) for row in part]
        candidate = [abs(row["observed_f"] - row["candidate_f"]) for row in part]
        first = part[0]
        output.append({
            "stationDay": f"{station}|{day}", "lead": lead, "n": len(part),
            "noaaAbsSum": round(float(sum(noaa)), 6), "candidateAbsSum": round(float(sum(candidate)), 6),
            "lake": first.get("lake", "unknown"), "stationClass": first.get("station_class", "unknown"),
            "distanceBand": first.get("distance_band", "unknown"),
        })
    return output


def score_candidate(store, candidate, observations, score_day):
    scored, loo_scored = [], []
    for lead in (0, 6, 24, 48, 120):
        for valid in sorted({row["time"] for row in observations}):
            issued = valid - timedelta(hours=lead)
            body = store.get_bytes(prediction_key(candidate, issued), optional=True)
            if body is None: continue
            predictions = {(row["target_id"], row["valid_time"]): row for row in parquet_rows(body)
                           if row["target_type"] == "gauge" and row["lead_hours"] == lead}
            for observation in observations:
                if observation["time"] != valid: continue
                prediction = predictions.get((observation["station_id"], iso(valid)))
                if prediction:
                    scored.append({**prediction, "observed_f": observation["water_f"],
                                   "distance_band": distance_band(float(prediction.get("source_distance_km") or 0))})
            if candidate != "point" and lead in {0, 24}:
                body = store.get_bytes(loo_key(candidate, issued), optional=True)
                if body is None: continue
                predictions = {(row["target_id"], row["valid_time"]): row for row in parquet_rows(body)
                               if row["lead_hours"] == lead}
                for observation in observations:
                    if observation["time"] != valid: continue
                    prediction = predictions.get((observation["station_id"], iso(valid)))
                    if prediction:
                        loo_scored.append({**prediction, "observed_f": observation["water_f"],
                                           "distance_band": distance_band(float(prediction.get("source_distance_km") or math.inf))})
    loo_inside = [row for row in loo_scored if row.get("layer") != "outside"]
    return {"candidate": aggregate_scores(scored), "loo": aggregate_scores(loo_scored),
            "looInside": aggregate_scores(loo_inside),
            "gateBlocks": {"candidate": gate_blocks(scored), "looInside": gate_blocks(loo_inside)},
            "rows": len(scored), "looRows": len(loo_scored), "looInsideRows": len(loo_inside)}


def combine_metric(days, candidate, source, lead):
    values = []
    for day in days.values():
        metric = day.get("candidates", day).get(candidate, {}).get(source, {}).get("byLead", {}).get(str(lead), {})
        if metric.get("n"):
            values.append(metric)
    count = sum(item["n"] for item in values)
    if not count: return {"n": 0}
    return {"n": count, **{
        name: sum(item[name] * item["n"] for item in values) / count
        for name in ("noaaMae", "candidateMae", "worseGt1", "worseGt2", "betterGt1")
    }}


def improvement(metric):
    return None if not metric.get("n") or not metric.get("noaaMae") else 100 * (metric["noaaMae"] - metric["candidateMae"]) / metric["noaaMae"]


def significant_harm(days, candidate, source, leads, dimensions):
    blocks = []
    for day in days.values():
        blocks.extend(day.get("candidates", day).get(candidate, {}).get("gateBlocks", {}).get(source, []))
    failures = []
    for lead in leads:
        selected = [block for block in blocks if block["lead"] == lead]
        for field in dimensions:
            names = sorted({block[field] for block in selected})
            for name in names:
                part = [block for block in selected if block[field] == name]
                if len(part) < 20: continue
                values = np.asarray([(block["candidateAbsSum"] - block["noaaAbsSum"]) / block["n"] for block in part])
                delta = float(values.mean())
                if delta <= .01: continue
                rng = np.random.default_rng(710000 + lead + sum(map(ord, field + str(name))))
                samples = np.empty(1000)
                for start in range(0, 1000, 50):
                    indexes = rng.integers(0, len(values), size=(50, len(values)))
                    samples[start:start + 50] = values[indexes].mean(axis=1)
                low, high = np.quantile(samples, [.025, .975])
                if low > 0: failures.append({"lead": lead, "field": field, "cell": name, "delta": delta, "ci95": [float(low), float(high)]})
    return failures


def launch_gates(cumulative):
    days = cumulative.get("days", {})
    output = {}
    point_days = sum(bool(day.get("candidates", day).get("point", {}).get("rows")) for day in days.values())
    p6, p24 = combine_metric(days, "point", "candidate", 6), combine_metric(days, "point", "candidate", 24)
    mature = point_days >= 21 and p24.get("n", 0) >= 500
    point_harm = significant_harm(days, "point", "candidate", (6, 24), ("lake",)) if mature else []
    point_checks = {
        "days": "PASS" if point_days >= 21 else "NOT YET",
        "n24": "PASS" if p24.get("n", 0) >= 500 else "NOT YET",
        "improvement6": "PASS" if mature and improvement(p6) is not None and improvement(p6) >= 25 else "FAIL" if mature else "NOT YET",
        "improvement24": "PASS" if mature and improvement(p24) is not None and improvement(p24) >= 25 else "FAIL" if mature else "NOT YET",
        "worse2": "PASS" if mature and p24.get("worseGt2", 1) <= .05 else "FAIL" if mature else "NOT YET",
        "lakeHarm": "PASS" if mature and not point_harm else "FAIL" if mature else "NOT YET",
    }
    output["point"] = {"days": point_days, "n24": p24.get("n", 0), "lead6": p6, "lead24": p24,
                       "significantHarm": point_harm, "items": point_checks,
                       "status": "NOT YET" if not mature else "PASS" if all(x == "PASS" for x in point_checks.values()) else "FAIL"}
    for candidate in ("map-a5", "map-a6", "map-a7"):
        qualifying = [day for day in days.values() if int(day.get("activeBuoys", 0)) >= 30]
        qualified_days = len(qualifying)
        m0, m24 = combine_metric(days, candidate, "looInside", 0), combine_metric(days, candidate, "looInside", 24)
        mature = qualified_days >= 21
        harm = significant_harm(days, candidate, "looInside", (0, 24), ("lake", "stationClass", "distanceBand")) if mature else []
        # Michigan is one of the same station-day blocks; its metric is computed from stored blocks.
        mi_blocks = [block for day in days.values() for block in day.get("candidates", day).get(candidate, {}).get("gateBlocks", {}).get("looInside", []) if block["lake"] == "lake-michigan"]
        def block_improvement(lead):
            part = [block for block in mi_blocks if block["lead"] == lead]
            noaa = sum(block["noaaAbsSum"] for block in part); hybrid = sum(block["candidateAbsSum"] for block in part)
            return None if not noaa else 100 * (noaa - hybrid) / noaa
        mi = {str(lead): block_improvement(lead) for lead in (0, 24)}
        checks = {
            "days": "PASS" if mature else "NOT YET",
            "improvement0": "PASS" if mature and improvement(m0) is not None and improvement(m0) >= 15 else "FAIL" if mature else "NOT YET",
            "improvement24": "PASS" if mature and improvement(m24) is not None and improvement(m24) >= 15 else "FAIL" if mature else "NOT YET",
            "cellHarm": "PASS" if mature and not harm else "FAIL" if mature else "NOT YET",
            "harmShares": "PASS" if mature and all(metric.get("worseGt1", 1) <= .10 and metric.get("worseGt2", 1) <= .03 for metric in (m0, m24)) else "FAIL" if mature else "NOT YET",
            "michigan": "PASS" if mature and all(mi[str(lead)] is not None and mi[str(lead)] >= 10 for lead in (0, 24)) else "FAIL" if mature else "NOT YET",
        }
        output[candidate] = {"days": qualified_days, "totalDays": len(days),
                             "activeBuoysPerDay": [int(day.get("activeBuoys", 0)) for day in days.values()],
                             "lead0": m0, "lead24": m24, "michigan": mi, "significantHarm": harm, "items": checks,
                             "status": "NOT YET" if not mature else "PASS" if all(x == "PASS" for x in checks.values()) else "FAIL"}
    return output


def markdown_scorecard(day, scorecards, cumulative):
    lines = [f"# Hybrid shadow scorecard — {day}", "", "| candidate | n | NOAA MAE | candidate MAE | worse >1°F | worse >2°F |", "|---|---:|---:|---:|---:|---:|"]
    for candidate, item in scorecards.items():
        value = item["candidate"]["overall"]
        lines.append(f"| {candidate} | {value.get('n', 0)} | {value.get('noaaMae', '—')} | {value.get('candidateMae', '—')} | {value.get('worseGt1', '—')} | {value.get('worseGt2', '—')} |")
    lines.extend(("", f"Cumulative days: {len(cumulative.get('days', {}))}. Private research output; never served by the map.", "", "## Launch gates", ""))
    for candidate, gate in cumulative.get("launchGates", {}).items():
        lines.append(f"- {candidate}: **{gate['status']}** — " + ", ".join(f"{name}={status}" for name, status in gate["items"].items()))
    return "\n".join(lines) + "\n"


def run_scorecard(args):
    now = parse_time(args.now) if args.now else datetime.now(timezone.utc)
    score_day = date.fromisoformat(args.score_date) if args.score_date else now.date()
    live_s3, private_s3 = r2_client("LIVE_"), r2_client("")
    store = ShadowStore(private_s3, os.environ["SHADOW_R2_BUCKET"])
    params, metadata, hourly, forecasts, states = load_runtime(live_s3, store, now)
    observations = [row for row in hourly if row["time"].date() == score_day and row["qc_pass"]]
    scorecards = {candidate: score_candidate(store, candidate, observations, score_day) for candidate in CANDIDATES}
    cumulative = store.get_json(f"{SHADOW_PREFIX}scorecard/cumulative.json", optional=True) or {"formatVersion": 1, "days": {}}
    cumulative["days"][score_day.isoformat()] = {"activeBuoys": len({row["station_id"] for row in observations}), "candidates": scorecards}
    cumulative["updatedAt"] = iso(now)
    cumulative["launchGates"] = launch_gates(cumulative)
    daily = {"formatVersion": 2, "date": score_day.isoformat(), "generatedAt": iso(now), "partial": score_day >= now.date(),
             "activeBuoys": len({row["station_id"] for row in observations}), "candidates": scorecards,
             "launchGates": cumulative["launchGates"]}
    root = f"{SHADOW_PREFIX}scorecard/{score_day.isoformat()}"
    store.json(f"{root}.json", daily)
    store.put(f"{root}.md", markdown_scorecard(score_day, scorecards, cumulative).encode(), "text/markdown")
    store.json(f"{SHADOW_PREFIX}scorecard/cumulative.json", cumulative)
    print(json.dumps({"date": score_day.isoformat(), "partial": daily["partial"], "rows": {k: v["rows"] for k, v in scorecards.items()}}, sort_keys=True))
    return 0


def upload_params(args):
    private_s3 = r2_client(""); store = ShadowStore(private_s3, os.environ["SHADOW_R2_BUCKET"])
    sources = {name: json.loads(Path(path).read_text()) for name, path in {
        "v2": args.v2, "v4": args.v4, "v5": args.v5, "v6": args.v6, "v7": args.v7,
    }.items()}
    certification = json.loads(Path(args.v5_certification).read_text())
    piers = {item["pier"]: item["gauge"] for item in certification["piers"]["points"] if item.get("qualifies")}
    bundle = {"formatVersion": 1, "methodology": "hybrid-shadow-v1", "versions": VERSION_IDS,
              "v2": sources["v2"], "v4": sources["v4"], "v5": sources["v5"], "v6": sources["v6"], "v7": sources["v7"],
              "piers": piers}
    for name in ("v5", "v6", "v7"):
        store.json(f"{SHADOW_PREFIX}params/{name}.json", sources[name])
    digest = store.json(PARAMS_KEY, bundle)
    print(json.dumps({"stored": True, "key": PARAMS_KEY, "sha256": digest, "committed": False}, sort_keys=True))
    return 0


def print_scorecard(args):
    private_s3 = r2_client(""); store = ShadowStore(private_s3, os.environ["SHADOW_R2_BUCKET"])
    value = store.get_json(f"{SHADOW_PREFIX}scorecard/cumulative.json")
    gates = launch_gates(value)
    print("HYBRID SHADOW launch gates")
    print(f"updated {value.get('updatedAt')} | archived days {len(value.get('days', {}))}")
    point = gates["point"]
    print(f"point: days={point['days']}/21 n24={point['n24']}/500 imp6={format_percent(improvement(point['lead6']))} imp24={format_percent(improvement(point['lead24']))} worse2={format_percent(100*point['lead24'].get('worseGt2',0) if point['lead24'].get('n') else None)} {point['status']}")
    print("  " + " ".join(f"{name}={status}" for name, status in point["items"].items()))
    for candidate in ("map-a5", "map-a6", "map-a7"):
        gate = gates[candidate]; active = gate["activeBuoysPerDay"]
        mean_active = statistics.mean(active) if active else 0
        print(f"{candidate}: days30={gate['days']}/21 buoys/day={mean_active:.1f} n0={gate['lead0'].get('n',0)} n24={gate['lead24'].get('n',0)} imp0={format_percent(improvement(gate['lead0']))} imp24={format_percent(improvement(gate['lead24']))} {gate['status']}")
        print("  " + " ".join(f"{name}={status}" for name, status in gate["items"].items()))
    return 0


def format_percent(value):
    return "n/a" if value is None else f"{value:.1f}%"


def parser():
    result = argparse.ArgumentParser()
    sub = result.add_subparsers(dest="command", required=True)
    for name in ("hourly", "scorecard"):
        item = sub.add_parser(name); item.add_argument("--now")
        if name == "scorecard": item.add_argument("--score-date")
    upload = sub.add_parser("upload-params")
    for name in ("v2", "v4", "v5", "v6", "v7"): upload.add_argument(f"--{name}", required=True)
    upload.add_argument("--v5-certification", required=True)
    sub.add_parser("print-scorecard")
    return result


def main(argv=None):
    args = parser().parse_args(argv)
    required = ("R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "SHADOW_R2_BUCKET")
    if args.command in {"hourly", "scorecard"}:
        required += ("LIVE_R2_ACCOUNT_ID", "LIVE_R2_ACCESS_KEY_ID", "LIVE_R2_SECRET_ACCESS_KEY")
    if not all(os.environ.get(key) for key in required):
        raise SystemExit("required R2 configuration is missing (values are never printed)")
    return {"hourly": run_hourly, "scorecard": run_scorecard, "upload-params": upload_params,
            "print-scorecard": print_scorecard}[args.command](args)


if __name__ == "__main__":
    raise SystemExit(main())
