#!/usr/bin/env python3
"""Score as-issued lake-map forecasts against later observed temperatures.

The gatekeeper archives one shared observation snapshot every 15 minutes. Each
forecast run freezes the model's 121-hour series at eligible reviewed GLOS and
NOAA CO-OPS sites with nearby model water.
This job joins those immutable artifacts for one UTC day and publishes daily
and cumulative validation summaries. It never edits a forecast or approves a
bias correction.
"""
from __future__ import annotations

import argparse
import gzip
import json
import math
import os
import re
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

from lakemap import store

CORE_LEADS = (0, 24, 48, 72, 96, 120)
HORIZONS = (("nowcast", 0, 6), ("day1", 7, 30), ("day2", 31, 54),
            ("day3", 55, 78), ("day4", 79, 102), ("day5", 103, 120))
HIST_STEP_C = 0.1
HIST_MAX_C = 20.0
HIST_BINS = int(HIST_MAX_C / HIST_STEP_C) + 2  # final bin is overflow
ENV_KEYS = ("R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET")


def parse_time(value):
    if not isinstance(value, str):
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed.astimezone(timezone.utc)
    except ValueError:
        return None


def normalized_id(value):
    return re.sub(r"[^A-Z0-9]", "", str(value or "").upper())


def distance_km(a, b):
    mean_lat = math.radians((a["lat"] + b["lat"]) / 2)
    return math.hypot((a["lat"] - b["lat"]) * 111.195,
                      (a["lon"] - b["lon"]) * 111.195 * math.cos(mean_lat))


def observation_id(station):
    if isinstance(station.get("waterIdentity"), str) and station["waterIdentity"]:
        return station["waterIdentity"]
    if station.get("glosDatasetId") is not None:
        return f"glos:{int(station['glosDatasetId'])}"
    if station.get("coopsStationId"):
        return f"coops:{station['coopsStationId']}"
    return f"external:{normalized_id(station.get('externalId') or station.get('id'))}"


def unique_observations(snapshots):
    """Deduplicate unchanged readings seen in several 15-minute snapshots."""
    unique = {}
    for snapshot in snapshots:
        for station in snapshot.get("stations", []):
            readings = [{**station}]
            for profile in station.get("profile", []):
                if not isinstance(profile, dict):
                    continue
                readings.append({
                    **station, "waterF": profile.get("waterF"), "waterTime": profile.get("time"),
                    "waterDepthM": profile.get("depthM"), "waterSurface": profile.get("surface"),
                    "waterQuality": profile.get("quality"), "waterIdentity": profile.get("identity"),
                    "source": profile.get("source") or station.get("source"), "profile": [],
                })
            for reading in readings:
                observed = parse_time(reading.get("waterTime") or reading.get("time"))
                water_f = reading.get("waterF")
                if observed is None or not isinstance(water_f, (int, float)) or not math.isfinite(water_f):
                    continue
                identity = observation_id(reading)
                key = (identity, observed.isoformat(), round(float(water_f), 3), reading.get("waterDepthM"))
                unique[key] = {**reading, "identity": identity, "observed": observed, "waterF": float(water_f)}
    return sorted(unique.values(), key=lambda item: (item["observed"], item["identity"]))


def find_site(station, sites):
    exact = sites.get(station.get("identity"))
    if not exact and station.get("glosDatasetId") is not None:
        exact = sites.get(f"glos:{station['glosDatasetId']}")
    if not exact and station.get("coopsStationId"):
        exact = sites.get(f"coops:{station['coopsStationId']}")
    if exact:
        return exact
    external = normalized_id(station.get("externalId") or station.get("id"))
    candidates = [site for site in sites.values() if external and normalized_id(site.get("externalId")) == external]
    if not candidates:
        return None
    nearest = min(candidates, key=lambda site: distance_km(station, site))
    return nearest if distance_km(station, nearest) <= 1.0 else None


def is_strict(station):
    depth = station.get("waterDepthM")
    shallow = station.get("waterSurface") is True or (
        isinstance(depth, (int, float)) and math.isfinite(depth) and depth <= 3
    )
    return station.get("waterQuality") == "good" and shallow


def pairs_for(observations, forecasts):
    """Yield one independent observation/run pair at its exact forecast hour."""
    for forecast in forecasts:
        cycle = parse_time(forecast.get("cycle"))
        sites = forecast.get("sites")
        if cycle is None or not isinstance(sites, dict):
            continue
        for observation in observations:
            elapsed = (observation["observed"] - cycle).total_seconds() / 3600
            hour = round(elapsed)
            if hour < 0 or hour > 120 or abs(elapsed - hour) > 0.5:
                continue
            site = find_site(observation, sites)
            values = site.get("hours") if site else None
            if not isinstance(values, list) or len(values) != 121:
                continue
            model_f = values[hour]
            if not isinstance(model_f, (int, float)) or not math.isfinite(model_f):
                continue
            error_c = (float(model_f) - observation["waterF"]) * 5 / 9
            yield {
                "run": forecast.get("run"), "cycle": forecast.get("cycle"), "leadHour": hour,
                "station": observation["identity"], "body": observation.get("body") or site.get("body") or "unknown",
                "observed": observation["observed"].isoformat().replace("+00:00", "Z"),
                "errorC": error_c, "strict": is_strict(observation),
            }


def accumulator():
    return {"count": 0, "sumErrorC": 0.0, "sumAbsErrorC": 0.0, "sumSquaredErrorC": 0.0,
            "maxAbsErrorC": 0.0, "absHistogram": [0] * HIST_BINS, "stations": [], "dates": []}


def add(acc, pair):
    error = pair["errorC"]
    absolute = abs(error)
    acc["count"] += 1
    acc["sumErrorC"] += error
    acc["sumAbsErrorC"] += absolute
    acc["sumSquaredErrorC"] += error * error
    acc["maxAbsErrorC"] = max(acc["maxAbsErrorC"], absolute)
    acc["absHistogram"][min(int(absolute / HIST_STEP_C), HIST_BINS - 1)] += 1
    acc["stations"].append(pair["station"])
    acc["dates"].append(pair["observed"][:10])


def merge_accumulators(items):
    out = accumulator()
    for item in items:
        if not isinstance(item, dict) or len(item.get("absHistogram", [])) != HIST_BINS:
            continue
        for key in ("count", "sumErrorC", "sumAbsErrorC", "sumSquaredErrorC"):
            out[key] += item.get(key, 0)
        out["maxAbsErrorC"] = max(out["maxAbsErrorC"], item.get("maxAbsErrorC", 0))
        out["absHistogram"] = [a + b for a, b in zip(out["absHistogram"], item["absHistogram"])]
        out["stations"].extend(item.get("stations", []))
        out["dates"].extend(item.get("dates", []))
    out["stations"] = sorted(set(out["stations"]))
    out["dates"] = sorted(set(out["dates"]))
    for key in ("sumErrorC", "sumAbsErrorC", "sumSquaredErrorC", "maxAbsErrorC"):
        out[key] = round(out[key], 8)
    return out


def metrics(acc):
    count = acc["count"]
    if not count:
        return {"matches": 0, "stations": 0, "days": 0}
    target = math.ceil(count * 0.9)
    seen, p90 = 0, HIST_MAX_C + HIST_STEP_C
    for index, value in enumerate(acc["absHistogram"]):
        seen += value
        if seen >= target:
            # Report the conservative upper edge of the populated bin; never
            # make a tail error look smaller because of histogram rounding.
            p90 = (index + 1) * HIST_STEP_C if index < HIST_BINS - 1 else HIST_MAX_C + HIST_STEP_C
            break
    return {
        "matches": count, "stations": len(set(acc["stations"])), "days": len(set(acc["dates"])),
        "biasC": round(acc["sumErrorC"] / count, 3),
        "maeC": round(acc["sumAbsErrorC"] / count, 3),
        "rmseC": round(math.sqrt(acc["sumSquaredErrorC"] / count), 3),
        "p90AbsErrorC": round(p90, 1), "maxAbsErrorC": round(acc["maxAbsErrorC"], 3),
    }


def summarize(pairs, target_date):
    groups = {"strict": accumulator(), "context": accumulator()}
    horizons = {evidence: {name: accumulator() for name, _, _ in HORIZONS} for evidence in groups}
    leads = {evidence: {str(lead): accumulator() for lead in CORE_LEADS} for evidence in groups}
    lakes = {}
    for pair in pairs:
        evidence = "strict" if pair["strict"] else "context"
        add(groups[evidence], pair)
        for name, start, end in HORIZONS:
            if start <= pair["leadHour"] <= end:
                add(horizons[evidence][name], pair)
                break
        if pair["leadHour"] in CORE_LEADS:
            add(leads[evidence][str(pair["leadHour"])], pair)
        if evidence == "strict":
            lakes.setdefault(pair["body"], accumulator())
            add(lakes[pair["body"]], pair)
    clean = lambda value: merge_accumulators([value])
    accumulators = {
        "overall": {key: clean(value) for key, value in groups.items()},
        "byHorizon": {key: {name: clean(value) for name, value in entries.items()} for key, entries in horizons.items()},
        "byLead": {key: {lead: clean(value) for lead, value in entries.items()} for key, entries in leads.items()},
        "strictByLake": {key: clean(value) for key, value in lakes.items()},
    }
    public_metrics = {
        "overall": {key: metrics(value) for key, value in accumulators["overall"].items()},
        "byHorizon": {key: {name: metrics(value) for name, value in entries.items()} for key, entries in accumulators["byHorizon"].items()},
        "byLead": {key: {lead: metrics(value) for lead, value in entries.items()} for key, entries in accumulators["byLead"].items()},
        "strictByLake": {key: metrics(value) for key, value in accumulators["strictByLake"].items()},
    }
    return {"date": target_date.isoformat(), "accumulators": accumulators, "metrics": public_metrics}


def cumulative_report(daily_reports, generated_at):
    paths = [
        ("overall", "strict"), ("overall", "context"),
        *[("byHorizon", evidence, name) for evidence in ("strict", "context") for name, _, _ in HORIZONS],
        *[("byLead", evidence, str(lead)) for evidence in ("strict", "context") for lead in CORE_LEADS],
    ]
    lake_names = sorted({name for report in daily_reports for name in report.get("accumulators", {}).get("strictByLake", {})})
    paths.extend(("strictByLake", name) for name in lake_names)
    merged, public = {}, {}
    for path in paths:
        values = []
        for report in daily_reports:
            value = report.get("accumulators", {})
            for part in path:
                value = value.get(part, {}) if isinstance(value, dict) else {}
            values.append(value)
        target = merged
        visible = public
        for part in path[:-1]:
            target = target.setdefault(part, {})
            visible = visible.setdefault(part, {})
        target[path[-1]] = merge_accumulators(values)
        visible[path[-1]] = metrics(target[path[-1]])
    dates = sorted(report.get("date") for report in daily_reports if report.get("date"))
    strict = public.get("overall", {}).get("strict", {})
    strict_leads = public.get("byLead", {}).get("strict", {})
    strict_dates = merged.get("overall", {}).get("strict", {}).get("dates", [])
    months = len({value[:7] for value in strict_dates})
    operational_years = len({value[:4] for value in strict_dates})
    coverage_ready = (strict.get("days", 0) >= 60 and months >= 3 and operational_years >= 2 and
                      all(strict_leads.get(str(lead), {}).get("matches", 0) >= 30 for lead in CORE_LEADS))
    return {
        "formatVersion": 1, "purpose": "validation-only", "correctionApproved": False,
        "status": "coverage-thresholds-met-review-required" if coverage_ready else "collecting",
        "generatedAt": generated_at, "period": {"start": dates[0] if dates else None, "end": dates[-1] if dates else None},
        "coverage": {"strictDays": strict.get("days", 0), "strictMonths": months,
                     "operationalYears": operational_years, "automaticThresholdsMet": coverage_ready},
        "protocol": {"strictEvidence": "QARTOD good and explicit surface or sensor depth <= 3 m",
                     "biasDefinition": "model minus observed",
                     "minimumDays": 60, "minimumMonths": 3, "minimumMatchesPerLead": 30,
                     "minimumOperationalSeasons": 2, "holdoutRequiredBeforeCorrection": True,
                     "temperatureLimitsC": {"absoluteBias": 1, "rmse": 3, "p90AbsoluteError": 3}},
        "metrics": public, "accumulators": merged,
        "warning": "Research evidence only. Metrics do not authorize automatic correction or prove pier-water equivalence.",
    }


def object_json(s3, key):
    obj = s3.get_object(Bucket=store.bucket(), Key=key)
    body = obj["Body"].read()
    if obj.get("ContentEncoding") == "gzip" or body[:2] == b"\x1f\x8b":
        body = gzip.decompress(body)
    return json.loads(body)


def list_keys(s3, prefix):
    paginator = s3.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=store.bucket(), Prefix=prefix):
        for item in page.get("Contents", []):
            yield item["Key"]


def load_many(s3, keys, workers=16):
    with ThreadPoolExecutor(workers) as pool:
        return list(pool.map(lambda key: object_json(s3, key), keys))


def load_env_file(path):
    if not path:
        return
    for raw in Path(path).read_text(errors="replace").splitlines():
        match = re.match(r"^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$", raw)
        if not match or match.group(1) not in ENV_KEYS or os.environ.get(match.group(1)):
            continue
        value = match.group(2).strip().strip("'\"")
        if value:
            os.environ[match.group(1)] = value


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", help="UTC date to evaluate (default: yesterday)")
    parser.add_argument("--out", help="also write the cumulative summary here")
    parser.add_argument("--upload", action="store_true")
    parser.add_argument("--env-file")
    args = parser.parse_args(argv)
    load_env_file(args.env_file)
    target = date.fromisoformat(args.date) if args.date else (datetime.now(timezone.utc) - timedelta(days=1)).date()
    if not all(os.environ.get(key) for key in ENV_KEYS[:3]):
        raise SystemExit("R2 credentials are required (values are never printed)")
    s3 = store.client()
    prefix = f"observations/v1/{target:%Y/%m/%d}/"
    snapshot_keys = list(list_keys(s3, prefix))
    snapshots = load_many(s3, snapshot_keys) if snapshot_keys else []
    observations = unique_observations(snapshots)
    index = object_json(s3, "validation/forecast-index.json")
    day_start = datetime.combine(target, datetime.min.time(), timezone.utc)
    day_end = day_start + timedelta(days=1)
    selected = []
    for item in index.get("runs", []):
        cycle = parse_time(item.get("cycle"))
        if cycle and cycle < day_end and cycle + timedelta(hours=120, minutes=30) >= day_start:
            selected.append(f"{item['base']}verification.json")
    forecasts = load_many(s3, selected) if selected else []
    pairs = list(pairs_for(observations, forecasts))
    daily = {"formatVersion": 1, "purpose": "validation-only", "correctionApproved": False,
             "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
             "collection": {"snapshots": len(snapshots), "uniqueObservations": len(observations),
                            "forecastRuns": len(forecasts), "matchedPairs": len(pairs)},
             **summarize(pairs, target)}
    daily_key = f"validation/daily/{target.isoformat()}.json"
    existing_keys = list(list_keys(s3, "validation/daily/"))
    previous = load_many(s3, [key for key in existing_keys if key != daily_key])
    summary = cumulative_report(previous + [daily], daily["generatedAt"])
    if args.out:
        Path(args.out).write_text(json.dumps(summary, indent=2) + "\n")
    if args.upload:
        store.put(s3, daily_key, json.dumps(daily, separators=(",", ":")).encode(), store.IMMUTABLE)
        store.put(s3, "validation/latest.json", json.dumps(summary, separators=(",", ":")).encode(), store.SHORT)
    strict = summary["metrics"]["overall"]["strict"]
    print(f"{target}: {len(snapshots)} snapshots, {len(observations)} unique observations, "
          f"{len(pairs)} model pairs, {strict.get('matches', 0)} cumulative strict pairs")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
