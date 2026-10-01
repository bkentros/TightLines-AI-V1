#!/usr/bin/env python3
"""Prospectively score immutable lake-map forecasts against later observations.

The gatekeeper archives one shared observation snapshot every 15 minutes. Each
forecast run freezes the model's 121-hour series at reviewed observation sites
and pier sites. This job creates versioned match-level evidence, daily and
monthly scorecards, a cumulative report, a no-lookahead persistence baseline,
and a contextual comparison with the GLOS Seagull model summary captured when
the run was published.

Nothing in this module changes a displayed forecast, approves a correction, or
claims that unlike spatial supports are scientifically interchangeable.
"""
from __future__ import annotations

import argparse
import bisect
import gzip
import hashlib
import json
import math
import os
import re
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

from lakemap import store

METHODOLOGY_VERSION = "piercast-live-map-validation-v2"
CORE_LEADS = (0, 24, 48, 72, 96, 120)
MODEL_HORIZONS = (("nowcast", 0, 6), ("day1", 7, 30), ("day2", 31, 54),
                  ("day3", 55, 78), ("day4", 79, 102), ("day5", 103, 120))
PRODUCT_HORIZONS = (("0-6h", 0, 6), ("6-24h", 6, 24), ("24-48h", 24, 48),
                    ("48-72h", 48, 72), ("72-96h", 72, 96), ("96-120h", 96, 120))
HIST_STEP_C = 0.1
HIST_MAX_C = 20.0
HIST_BINS = int(HIST_MAX_C / HIST_STEP_C) + 2
EXPECTED_DAILY_SNAPSHOTS = 96
MIN_DAILY_SNAPSHOTS = 48
MATCH_TOLERANCE_HOURS = 0.5
PERSISTENCE_MAX_AGE_HOURS = 3
HEAD_TO_HEAD_MAX_DISTANCE_KM = 10
TIE_TOLERANCE_C = 0.05
ENV_KEYS = ("R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET")


def parse_time(value):
    if not isinstance(value, str):
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)
    except ValueError:
        return None


def iso(value):
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


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


def depth_key(station):
    depth = station.get("waterDepthM")
    if isinstance(depth, (int, float)) and math.isfinite(depth):
        return f"{round(float(depth), 2):.2f}m"
    return "declared-surface" if station.get("waterSurface") is True else "unknown"


def depth_band(station):
    depth = station.get("waterDepthM")
    if station.get("waterSurface") is True:
        return "declared-surface"
    if not isinstance(depth, (int, float)) or not math.isfinite(depth):
        return "unknown"
    if depth <= 1:
        return "0-1m"
    if depth <= 3:
        return "1-3m"
    if depth <= 10:
        return "3-10m"
    return "over-10m"


def thermal_regime(water_f):
    value_c = (water_f - 32) * 5 / 9
    if value_c <= 10:
        return "cold-10C-or-less"
    if value_c < 18:
        return "transition-10-to-18C"
    return "warm-18C-or-more"


def season_for(day):
    month = int(day[5:7])
    if month in (12, 1, 2):
        return "winter"
    if month in (3, 4, 5):
        return "spring"
    if month in (6, 7, 8):
        return "summer"
    return "fall"


def unique_observations(snapshots):
    """Deduplicate an unchanged sensor reading repeated across snapshots."""
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
                    "parameterId": profile.get("parameterId"),
                    "source": profile.get("source") or station.get("source"), "profile": [],
                })
            for reading in readings:
                observed = parse_time(reading.get("waterTime") or reading.get("time"))
                water_f = reading.get("waterF")
                if observed is None or not isinstance(water_f, (int, float)) or not math.isfinite(water_f):
                    continue
                identity = observation_id(reading)
                key = (identity, reading.get("parameterId"), observed.isoformat(), round(float(water_f), 3), depth_key(reading),
                       str(reading.get("source") or "unknown"))
                unique[key] = {**reading, "identity": identity, "observed": observed,
                               "waterF": float(water_f), "depthKey": depth_key(reading)}
    return sorted(unique.values(), key=lambda item: (item["observed"], item["identity"], item["depthKey"]))


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
        isinstance(depth, (int, float)) and math.isfinite(depth) and 0 <= depth <= 3
    )
    return station.get("waterQuality") == "good" and shallow


def _pair_candidate(observation, forecast, cycle, issued_at, site, hour):
    model_f = site["hours"][hour]
    if not isinstance(model_f, (int, float)) or not math.isfinite(model_f):
        return None
    valid = cycle + timedelta(hours=hour)
    product_eligible = issued_at is not None and valid >= issued_at
    source = str(observation.get("source") or "unknown")
    observed_f = observation["waterF"]
    return {
        "run": forecast.get("run"), "cycle": iso(cycle), "issuedAt": iso(issued_at) if issued_at else None,
        "validTime": iso(valid), "leadHour": hour, "modelLeadHour": hour,
        "userLeadHours": round((valid - issued_at).total_seconds() / 3600, 3) if product_eligible else None,
        "productEligible": product_eligible,
        "station": observation["identity"], "stationName": observation.get("name"),
        "body": observation.get("body") or site.get("body") or "unknown",
        "source": source, "quality": observation.get("waterQuality") or "unknown",
        "parameterId": observation.get("parameterId"),
        "depthM": observation.get("waterDepthM"), "depthKey": observation["depthKey"],
        "depthBand": depth_band(observation), "surface": observation.get("waterSurface") is True,
        "observed": iso(observation["observed"]), "observedF": round(observed_f, 3),
        "forecastF": round(float(model_f), 3),
        "errorC": (float(model_f) - observed_f) * 5 / 9,
        "strict": is_strict(observation), "regime": thermal_regime(observed_f),
        "modelDistanceKm": site.get("modelDistanceKm"),
    }


def pairs_for(observations, forecasts):
    """Yield one nearest observation for each run, sensor/depth, and model hour."""
    chosen = {}
    for forecast in forecasts:
        cycle = parse_time(forecast.get("cycle"))
        issued_at = parse_time(forecast.get("issuedAt"))
        sites = forecast.get("sites")
        if cycle is None or not isinstance(sites, dict):
            continue
        for observation in observations:
            elapsed = (observation["observed"] - cycle).total_seconds() / 3600
            hour = round(elapsed)
            if hour < 0 or hour > 120 or abs(elapsed - hour) > MATCH_TOLERANCE_HOURS:
                continue
            site = find_site(observation, sites)
            values = site.get("hours") if site else None
            if not isinstance(values, list) or len(values) != 121:
                continue
            pair = _pair_candidate(observation, forecast, cycle, issued_at, site, hour)
            if pair is None:
                continue
            key = (forecast.get("run"), observation["identity"], observation["depthKey"],
                   str(observation.get("source") or "unknown"), hour)
            offset = abs(elapsed - hour)
            prior = chosen.get(key)
            if prior is None or offset < prior[0]:
                chosen[key] = (offset, pair)
    for _, pair in sorted(chosen.values(), key=lambda item: (
            item[1].get("cycle") or "", item[1]["station"], item[1]["depthKey"], item[1]["leadHour"])):
        yield pair


def _observation_series(observations):
    series = {}
    for observation in observations:
        key = (observation["identity"], observation["depthKey"], str(observation.get("source") or "unknown"))
        series.setdefault(key, []).append(observation)
    for values in series.values():
        values.sort(key=lambda item: item["observed"])
    return {key: ([item["observed"] for item in values], values) for key, values in series.items()}


def attach_persistence(pairs, observations):
    """Attach the newest same-sensor value known by issue time, never looking ahead."""
    series = _observation_series(observations)
    for pair in pairs:
        issued_at = parse_time(pair.get("issuedAt"))
        if issued_at is None or not pair.get("productEligible"):
            continue
        key = (pair["station"], pair["depthKey"], pair["source"])
        times, candidates = series.get(key, ([], []))
        index = bisect.bisect_right(times, issued_at) - 1
        if index < 0:
            continue
        baseline = candidates[index]
        age_h = (issued_at - baseline["observed"]).total_seconds() / 3600
        if age_h < 0 or age_h > PERSISTENCE_MAX_AGE_HOURS:
            continue
        pair["persistenceF"] = round(baseline["waterF"], 3)
        pair["persistenceObservedAt"] = iso(baseline["observed"])
        pair["persistenceAgeHours"] = round(age_h, 3)
        pair["persistenceErrorC"] = (baseline["waterF"] - pair["observedF"]) * 5 / 9


def _nearest_pier(observation, pier_sites):
    candidates = [site for site in pier_sites.values()
                  if isinstance(site, dict) and all(isinstance(site.get(key), (int, float)) for key in ("lat", "lon"))]
    if not candidates:
        return None
    nearest = min(candidates, key=lambda site: distance_km(observation, site))
    return nearest if distance_km(observation, nearest) <= HEAD_TO_HEAD_MAX_DISTANCE_KM else None


def head_to_head_pairs(observations, forecasts):
    """Pair FinFindr and captured Seagull values to the exact same observation."""
    chosen = {}
    for forecast in forecasts:
        cycle = parse_time(forecast.get("cycle"))
        issued_at = parse_time(forecast.get("issuedAt"))
        piers = forecast.get("pierSites")
        benchmark = forecast.get("benchmarks", {}).get("seagullModelSummaryV1", {})
        captured_at = parse_time(benchmark.get("capturedAt"))
        benchmark_sites = benchmark.get("sites")
        if cycle is None or issued_at is None or captured_at is None or not isinstance(piers, dict) or not isinstance(benchmark_sites, dict):
            continue
        pier_ids = {id(site): key for key, site in piers.items()}
        for observation in observations:
            pier = _nearest_pier(observation, piers)
            if pier is None:
                continue
            pier_id = pier_ids.get(id(pier))
            sea_site = benchmark_sites.get(pier_id, {})
            sea_hours = sea_site.get("hours")
            fin_hours = pier.get("hours")
            if not isinstance(sea_hours, list) or not isinstance(fin_hours, list) or len(fin_hours) != 121:
                continue
            best = None
            for sea_hour in sea_hours:
                valid = parse_time(sea_hour.get("validTime")) if isinstance(sea_hour, dict) else None
                mean_c = sea_hour.get("meanC") if isinstance(sea_hour, dict) else None
                if valid is None or not isinstance(mean_c, (int, float)) or not math.isfinite(mean_c):
                    continue
                offset = abs((observation["observed"] - valid).total_seconds()) / 3600
                if offset <= MATCH_TOLERANCE_HOURS and (best is None or offset < best[0]):
                    best = (offset, valid, float(mean_c), sea_hour)
            if best is None:
                continue
            offset, valid, sea_c, sea_hour = best
            if valid < issued_at or valid < captured_at:
                continue
            model_hour = round((valid - cycle).total_seconds() / 3600)
            if model_hour < 0 or model_hour >= len(fin_hours):
                continue
            fin_f = fin_hours[model_hour]
            if not isinstance(fin_f, (int, float)) or not math.isfinite(fin_f):
                continue
            observed_c = (observation["waterF"] - 32) * 5 / 9
            pair = {
                "run": forecast.get("run"), "cycle": iso(cycle), "issuedAt": iso(issued_at),
                "capturedAt": iso(captured_at), "validTime": iso(valid), "modelLeadHour": model_hour,
                "userLeadHours": round((valid - max(issued_at, captured_at)).total_seconds() / 3600, 3),
                "pier": pier_id, "pierName": pier.get("name"), "station": observation["identity"],
                "body": observation.get("body") or "unknown", "source": observation.get("source") or "unknown",
                "quality": observation.get("waterQuality") or "unknown", "parameterId": observation.get("parameterId"),
                "depthM": observation.get("waterDepthM"), "depthKey": observation["depthKey"],
                "observed": iso(observation["observed"]), "observedF": round(observation["waterF"], 3),
                "finfindrF": round(float(fin_f), 3), "seagullMeanC": round(sea_c, 4),
                "seagullMinC": sea_hour.get("minC"), "seagullMaxC": sea_hour.get("maxC"),
                "finfindrErrorC": (float(fin_f) - observation["waterF"]) * 5 / 9,
                "seagullErrorC": sea_c - observed_c,
                "distanceToPierKm": round(distance_km(observation, pier), 3),
                "comparisonClass": benchmark.get("comparisonClass", "context-only-spatial-support-differs"),
                "strict": is_strict(observation),
            }
            key = (forecast.get("run"), pier_id, observation["identity"], observation["depthKey"], iso(valid))
            prior = chosen.get(key)
            if prior is None or offset < prior[0]:
                chosen[key] = (offset, pair)
    return [item[1] for item in sorted(chosen.values(), key=lambda item: (
        item[1]["cycle"], item[1]["pier"], item[1]["station"], item[1]["validTime"]))]


def accumulator():
    return {"count": 0, "sumErrorC": 0.0, "sumAbsErrorC": 0.0, "sumSquaredErrorC": 0.0,
            "maxAbsErrorC": 0.0, "within1C": 0, "within2C": 0, "within3C": 0,
            "absHistogram": [0] * HIST_BINS, "stations": [], "dates": [], "runs": []}


def add(acc, pair, error_key="errorC"):
    error = pair[error_key]
    absolute = abs(error)
    acc["count"] += 1
    acc["sumErrorC"] += error
    acc["sumAbsErrorC"] += absolute
    acc["sumSquaredErrorC"] += error * error
    acc["maxAbsErrorC"] = max(acc["maxAbsErrorC"], absolute)
    acc["within1C"] += absolute <= 1
    acc["within2C"] += absolute <= 2
    acc["within3C"] += absolute <= 3
    acc["absHistogram"][min(int(absolute / HIST_STEP_C), HIST_BINS - 1)] += 1
    acc["stations"].append(pair.get("station") or pair.get("pier") or "unknown")
    acc["dates"].append(pair["observed"][:10])
    if pair.get("run"):
        acc["runs"].append(pair["run"])


def merge_accumulators(items):
    out = accumulator()
    for item in items:
        if not isinstance(item, dict) or len(item.get("absHistogram", [])) != HIST_BINS:
            continue
        for key in ("count", "sumErrorC", "sumAbsErrorC", "sumSquaredErrorC", "within1C", "within2C", "within3C"):
            out[key] += item.get(key, 0)
        out["maxAbsErrorC"] = max(out["maxAbsErrorC"], item.get("maxAbsErrorC", 0))
        out["absHistogram"] = [a + b for a, b in zip(out["absHistogram"], item["absHistogram"])]
        out["stations"].extend(item.get("stations", []))
        out["dates"].extend(item.get("dates", []))
        out["runs"].extend(item.get("runs", []))
    for key in ("stations", "dates", "runs"):
        out[key] = sorted(set(out[key]))
    for key in ("sumErrorC", "sumAbsErrorC", "sumSquaredErrorC", "maxAbsErrorC"):
        out[key] = round(out[key], 8)
    return out


def _percentile(acc, fraction):
    count = acc["count"]
    if not count:
        return None
    target = math.ceil(count * fraction)
    seen = 0
    for index, value in enumerate(acc["absHistogram"]):
        seen += value
        if seen >= target:
            return round((index + 1) * HIST_STEP_C if index < HIST_BINS - 1 else HIST_MAX_C + HIST_STEP_C, 1)
    return None


def metrics(acc):
    count = acc["count"]
    if not count:
        return {"matches": 0, "stations": 0, "days": 0, "runs": 0}
    dates = set(acc["dates"])
    return {
        "matches": count, "stations": len(set(acc["stations"])), "days": len(dates),
        "months": len({value[:7] for value in dates}), "runs": len(set(acc["runs"])),
        "biasC": round(acc["sumErrorC"] / count, 3),
        "maeC": round(acc["sumAbsErrorC"] / count, 3),
        "rmseC": round(math.sqrt(acc["sumSquaredErrorC"] / count), 3),
        "medianAbsErrorC": _percentile(acc, 0.5), "p90AbsErrorC": _percentile(acc, 0.9),
        "maxAbsErrorC": round(acc["maxAbsErrorC"], 3),
        "within1CPct": round(acc["within1C"] / count * 100, 1),
        "within2CPct": round(acc["within2C"] / count * 100, 1),
        "within3CPct": round(acc["within3C"] / count * 100, 1),
    }


def comparison_accumulator():
    return {"finfindr": accumulator(), "benchmark": accumulator(),
            "paired": {"count": 0, "finfindrWins": 0, "benchmarkWins": 0, "ties": 0}}


def add_comparison(acc, pair, finfindr_key, benchmark_key):
    add(acc["finfindr"], {**pair, "errorC": pair[finfindr_key]})
    add(acc["benchmark"], {**pair, "errorC": pair[benchmark_key]})
    fin_abs, benchmark_abs = abs(pair[finfindr_key]), abs(pair[benchmark_key])
    acc["paired"]["count"] += 1
    if fin_abs + TIE_TOLERANCE_C < benchmark_abs:
        acc["paired"]["finfindrWins"] += 1
    elif benchmark_abs + TIE_TOLERANCE_C < fin_abs:
        acc["paired"]["benchmarkWins"] += 1
    else:
        acc["paired"]["ties"] += 1


def merge_comparisons(items):
    out = comparison_accumulator()
    out["finfindr"] = merge_accumulators([item.get("finfindr", {}) for item in items if isinstance(item, dict)])
    out["benchmark"] = merge_accumulators([item.get("benchmark", {}) for item in items if isinstance(item, dict)])
    for item in items:
        paired = item.get("paired", {}) if isinstance(item, dict) else {}
        for key in out["paired"]:
            out["paired"][key] += paired.get(key, 0)
    return out


def comparison_metrics(acc):
    finfindr = metrics(acc["finfindr"])
    benchmark = metrics(acc["benchmark"])
    paired = dict(acc["paired"])
    count = paired["count"]
    if count:
        paired.update({
            "finfindrWinPct": round(paired["finfindrWins"] / count * 100, 1),
            "benchmarkWinPct": round(paired["benchmarkWins"] / count * 100, 1),
            "tiePct": round(paired["ties"] / count * 100, 1),
            "maeAdvantageC": round(benchmark["maeC"] - finfindr["maeC"], 3),
            "finfindrSkillVsBenchmarkPct": (
                round((1 - finfindr["maeC"] / benchmark["maeC"]) * 100, 1)
                if benchmark.get("maeC") else None),
        })
    return {"finfindr": finfindr, "benchmark": benchmark, "paired": paired}


def _is_accumulator(value):
    return isinstance(value, dict) and isinstance(value.get("absHistogram"), list)


def _is_comparison(value):
    return isinstance(value, dict) and _is_accumulator(value.get("finfindr")) and _is_accumulator(value.get("benchmark"))


def merge_tree(nodes):
    valid = [node for node in nodes if isinstance(node, dict)]
    if any(_is_comparison(node) for node in valid):
        return merge_comparisons(valid)
    if any(_is_accumulator(node) for node in valid):
        return merge_accumulators(valid)
    keys = sorted({key for node in valid for key in node})
    return {key: merge_tree([node.get(key, {}) for node in valid]) for key in keys}


def public_tree(node):
    if _is_comparison(node):
        return comparison_metrics(node)
    if _is_accumulator(node):
        return metrics(node)
    return {key: public_tree(value) for key, value in node.items()} if isinstance(node, dict) else {}


def _horizon(value, definitions):
    for name, start, end in definitions:
        # Definitions are ordered, so a shared boundary (6 h, 24 h, etc.) is
        # assigned once to the earlier bucket.
        if start <= value <= end:
            return name
    return None


def summarize(primary_pairs, comparison_pairs=None, target_date=None):
    # Keep the original summarize(pairs, date) helper call available to local
    # analysis scripts while the persisted v2 shape remains explicit.
    if isinstance(comparison_pairs, date) and target_date is None:
        target_date, comparison_pairs = comparison_pairs, []
    comparison_pairs = comparison_pairs or []
    if target_date is None:
        raise ValueError("target_date is required")
    evidence = ("strict", "context")
    model_overall = {key: accumulator() for key in evidence}
    model_horizons = {key: {name: accumulator() for name, _, _ in MODEL_HORIZONS} for key in evidence}
    model_leads = {key: {str(lead): accumulator() for lead in CORE_LEADS} for key in evidence}
    product_overall = {key: accumulator() for key in evidence}
    product_horizons = {key: {name: accumulator() for name, _, _ in PRODUCT_HORIZONS} for key in evidence}
    lakes, sources, depths, regimes, seasons, stations = {}, {}, {}, {}, {}, {}
    persistence_overall = {key: comparison_accumulator() for key in evidence}
    persistence_horizons = {key: {name: comparison_accumulator() for name, _, _ in PRODUCT_HORIZONS} for key in evidence}

    for pair in primary_pairs:
        group = "strict" if pair["strict"] else "context"
        add(model_overall[group], pair)
        name = _horizon(pair["modelLeadHour"], MODEL_HORIZONS)
        if name:
            add(model_horizons[group][name], pair)
        if pair["modelLeadHour"] in CORE_LEADS:
            add(model_leads[group][str(pair["modelLeadHour"])], pair)
        if pair.get("productEligible"):
            add(product_overall[group], pair)
            name = _horizon(pair["userLeadHours"], PRODUCT_HORIZONS)
            if name:
                add(product_horizons[group][name], pair)
            if "persistenceErrorC" in pair:
                add_comparison(persistence_overall[group], pair, "errorC", "persistenceErrorC")
                if name:
                    add_comparison(persistence_horizons[group][name], pair, "errorC", "persistenceErrorC")
        if pair["strict"]:
            for collection, key in (
                (lakes, pair["body"]), (sources, pair["source"]), (depths, pair["depthBand"]),
                (regimes, pair["regime"]), (seasons, season_for(pair["observed"])), (stations, pair["station"]),
            ):
                collection.setdefault(key, accumulator())
                add(collection[key], pair)

    sea_overall = {key: comparison_accumulator() for key in evidence}
    sea_horizons = {key: {name: comparison_accumulator() for name, _, _ in PRODUCT_HORIZONS} for key in evidence}
    sea_piers = {}
    for pair in comparison_pairs:
        group = "strict" if pair["strict"] else "context"
        add_comparison(sea_overall[group], pair, "finfindrErrorC", "seagullErrorC")
        name = _horizon(pair["userLeadHours"], PRODUCT_HORIZONS)
        if name:
            add_comparison(sea_horizons[group][name], pair, "finfindrErrorC", "seagullErrorC")
        sea_piers.setdefault(pair["pier"], {key: comparison_accumulator() for key in evidence})
        add_comparison(sea_piers[pair["pier"]][group], pair, "finfindrErrorC", "seagullErrorC")

    tree = {
        "primary": {
            "modelCycle": {"overall": model_overall, "byHorizon": model_horizons, "byLead": model_leads},
            "product": {"overall": product_overall, "byHorizon": product_horizons},
            "strictBreakdowns": {"byLake": lakes, "bySource": sources, "byDepth": depths,
                                 "byRegime": regimes, "bySeason": seasons, "byStation": stations},
        },
        "comparisons": {
            "persistence": {"overall": persistence_overall, "byHorizon": persistence_horizons},
            "seagullContext": {"overall": sea_overall, "byHorizon": sea_horizons, "byPier": sea_piers},
        },
    }
    accumulators = merge_tree([tree])
    return {"date": target_date.isoformat(), "accumulators": accumulators, "metrics": public_tree(accumulators)}


def _normalized_accumulators(report):
    value = report.get("accumulators", {}) if isinstance(report, dict) else {}
    if "primary" in value:
        return value
    if "overall" in value:
        primary = {key: value[key] for key in ("overall", "byHorizon", "byLead") if key in value}
        breakdowns = {"byLake": value.get("strictByLake", {})}
        return {"primary": {"modelCycle": primary, "strictBreakdowns": breakdowns}}
    return {}


def _path(node, *parts):
    for part in parts:
        node = node.get(part, {}) if isinstance(node, dict) else {}
    return node


def _period_accumulators(reports):
    return merge_tree([_normalized_accumulators(report) for report in reports])


def _regression_status(daily_reports):
    ordered = sorted((report for report in daily_reports if report.get("date")), key=lambda item: item["date"])
    if not ordered:
        return {"status": "collecting", "reason": "no daily reports"}
    end = date.fromisoformat(ordered[-1]["date"])
    recent_start, prior_start = end - timedelta(days=29), end - timedelta(days=59)
    recent = [item for item in ordered if date.fromisoformat(item["date"]) >= recent_start]
    prior = [item for item in ordered if prior_start <= date.fromisoformat(item["date"]) < recent_start]
    recent_acc = _path(_period_accumulators(recent), "primary", "product", "overall", "strict")
    prior_acc = _path(_period_accumulators(prior), "primary", "product", "overall", "strict")
    recent_metrics = metrics(recent_acc) if _is_accumulator(recent_acc) else metrics(accumulator())
    prior_metrics = metrics(prior_acc) if _is_accumulator(prior_acc) else metrics(accumulator())
    if min(recent_metrics["matches"], prior_metrics["matches"]) < 100 or min(recent_metrics["days"], prior_metrics["days"]) < 10:
        return {"status": "collecting", "recent": recent_metrics, "prior": prior_metrics,
                "minimum": {"matchesPerWindow": 100, "daysPerWindow": 10}}
    increase = recent_metrics["maeC"] - prior_metrics["maeC"]
    relative = increase / prior_metrics["maeC"] if prior_metrics.get("maeC") else 0
    regressed = increase >= 0.5 and relative >= 0.2
    return {"status": "warning" if regressed else "ok", "recent": recent_metrics, "prior": prior_metrics,
            "maeIncreaseC": round(increase, 3), "relativeIncreasePct": round(relative * 100, 1),
            "threshold": "warning when MAE rises by at least 0.5 C and 20%"}


def cumulative_report(daily_reports, generated_at, scope="all-time"):
    reports = sorted((report for report in daily_reports if report.get("date")), key=lambda item: item["date"])
    merged = _period_accumulators(reports)
    public = public_tree(merged)
    strict = _path(public, "primary", "modelCycle", "overall", "strict")
    strict_leads = _path(public, "primary", "modelCycle", "byLead", "strict")
    strict_acc = _path(merged, "primary", "modelCycle", "overall", "strict")
    strict_dates = strict_acc.get("dates", []) if _is_accumulator(strict_acc) else []
    months = len({value[:7] for value in strict_dates})
    operational_years = len({value[:4] for value in strict_dates})
    coverage_ready = (strict.get("days", 0) >= 60 and months >= 3 and operational_years >= 2 and
                      all(strict_leads.get(str(lead), {}).get("matches", 0) >= 30 for lead in CORE_LEADS))
    dates = [report["date"] for report in reports]
    revisions = sorted({report.get("producerRevision") for report in reports if report.get("producerRevision")})
    pipeline_issues, pipeline_warnings = [], []
    for report in reports:
        collection = report.get("collection", {})
        snapshots = collection.get("targetSnapshots")
        runs = collection.get("forecastRuns")
        if isinstance(snapshots, int) and snapshots < MIN_DAILY_SNAPSHOTS:
            item = {"date": report["date"], "kind": "observation-snapshots", "actual": snapshots,
                    "minimum": MIN_DAILY_SNAPSHOTS}
            if snapshots > 0 and collection.get("archiveStartDate") == report["date"]:
                item["kind"] = "collector-startup-partial-day"
                pipeline_warnings.append(item)
            else:
                pipeline_issues.append(item)
        if isinstance(runs, int) and runs == 0:
            pipeline_issues.append({"date": report["date"], "kind": "forecast-runs", "actual": 0, "minimum": 1})
        strict_pairs = collection.get("strictPrimaryPairs")
        if isinstance(strict_pairs, int) and strict_pairs == 0:
            pipeline_warnings.append({"date": report["date"], "kind": "no-strict-observation-pairs"})
        for source, counts in collection.get("sourceHealth", {}).items():
            unavailable = counts.get("unavailable", 0) if isinstance(counts, dict) else 0
            if isinstance(snapshots, int) and snapshots and unavailable / snapshots >= 0.25:
                pipeline_warnings.append({"date": report["date"], "kind": "observation-source-unavailable",
                                          "source": source, "snapshots": unavailable, "total": snapshots})
        requested_sites = collection.get("seagullSitesRequested")
        captured_sites = collection.get("seagullSitesCaptured")
        if isinstance(requested_sites, int) and requested_sites and captured_sites / requested_sites < 0.75:
            pipeline_warnings.append({"date": report["date"], "kind": "seagull-benchmark-coverage",
                                      "captured": captured_sites, "requested": requested_sites})
    latest_date = dates[-1] if dates else None
    active_issues = [item for item in pipeline_issues if item["date"] == latest_date]
    active_warnings = [item for item in pipeline_warnings if item["date"] == latest_date]
    return {
        "formatVersion": 2, "methodologyVersion": METHODOLOGY_VERSION,
        "purpose": "validation-only", "correctionApproved": False, "scope": scope,
        "status": "coverage-thresholds-met-review-required" if coverage_ready else "collecting",
        "generatedAt": generated_at, "period": {"start": dates[0] if dates else None, "end": dates[-1] if dates else None},
        "producerRevisions": revisions,
        "coverage": {"strictDays": strict.get("days", 0), "strictMonths": months,
                     "operationalYears": operational_years, "automaticThresholdsMet": coverage_ready},
        "pipelineHealth": {"status": "error" if active_issues else "warning" if active_warnings else "ok",
                           "issues": active_issues, "warnings": active_warnings,
                           "historicalIssues": pipeline_issues, "historicalWarnings": pipeline_warnings,
                           "expectedSnapshotsPerDay": EXPECTED_DAILY_SNAPSHOTS,
                           "minimumSnapshotsPerDay": MIN_DAILY_SNAPSHOTS},
        "regressionMonitor": _regression_status(reports) if scope == "all-time" else {"status": "not-applicable"},
        "protocol": {
            "strictEvidence": "QARTOD good and explicit surface or sensor depth <= 3 m",
            "modelCycleScore": "forecast lead measured from the NOAA model cycle",
            "productScore": "only valid times at or after the immutable FinFindr publication time",
            "observationMatch": "one nearest reading within 30 minutes per run, sensor/depth and forecast hour",
            "persistenceBaseline": "same sensor/depth/source, latest reading at or before issue time, no older than 3 hours",
            "seagullComparison": "context only: GLOS API marine-zone mean versus FinFindr pier point; exact same observation/time",
            "biasDefinition": "forecast minus observed", "minimumDays": 60, "minimumMonths": 3,
            "minimumMatchesPerLead": 30, "minimumOperationalSeasons": 2,
            "holdoutRequiredBeforeCorrection": True,
            "temperatureLimitsC": {"absoluteBias": 1, "rmse": 3, "p90AbsoluteError": 3},
        },
        "metrics": public, "accumulators": merged,
        "warning": "Research evidence only. Metrics do not authorize automatic correction, prove pier-water equivalence, or establish competitor superiority.",
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
    if not keys:
        return []
    with ThreadPoolExecutor(workers) as pool:
        return list(pool.map(lambda key: object_json(s3, key), keys))


def hydrate_benchmarks(s3, forecasts, workers=8):
    """Join optional post-publication benchmark objects without losing a run."""
    tasks = []
    for forecast in forecasts:
        refs = forecast.get("benchmarkRefs", {}) if isinstance(forecast, dict) else {}
        key = refs.get("seagullModelSummaryV1") if isinstance(refs, dict) else None
        if isinstance(key, str) and re.fullmatch(r"validation/benchmarks/seagull/v1/[A-Za-z0-9._-]+\.json", key):
            tasks.append((forecast, key))

    def load(task):
        forecast, key = task
        try:
            return forecast, object_json(s3, key)
        except Exception:
            return forecast, None

    with ThreadPoolExecutor(max(1, min(workers, len(tasks) or 1))) as pool:
        for forecast, benchmark in pool.map(load, tasks):
            if isinstance(benchmark, dict):
                forecast.setdefault("benchmarks", {})["seagullModelSummaryV1"] = benchmark
    return forecasts


def load_env_file(path):
    if not path:
        return
    for raw in Path(path).read_text(errors="replace").splitlines():
        match = re.match(
            r"^\s*(?:export\s+)?[\"'\u201c\u201d\u2018\u2019]?([A-Za-z_][A-Za-z0-9_]*)"
            r"[\"'\u201c\u201d\u2018\u2019]?\s*[=:]\s*(.*?)\s*$", raw,
        )
        if not match or match.group(1) not in ENV_KEYS or os.environ.get(match.group(1)):
            continue
        value = match.group(2).strip().strip("\u201c\u201d\u2018\u2019").strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        if value:
            os.environ[match.group(1)] = value


def _daily_prefix(day):
    return f"observations/v1/{day:%Y/%m/%d}/"


def _archive_start_date(s3):
    page = s3.list_objects_v2(Bucket=store.bucket(), Prefix="observations/v1/", MaxKeys=1)
    entries = page.get("Contents", [])
    if not entries:
        return None
    match = re.match(r"observations/v1/(\d{4})/(\d{2})/(\d{2})/", entries[0].get("Key", ""))
    return "-".join(match.groups()) if match else None


def _source_health(snapshots):
    names = ("ndbc", "coops", "glos")
    result = {name: {} for name in names}
    strict_counts = []
    for snapshot in snapshots:
        health = snapshot.get("health", {}) if isinstance(snapshot, dict) else {}
        for name in names:
            status = _path(health, "sources", name).get("status", "missing")
            result[name][status] = result[name].get(status, 0) + 1
        strict = _path(health, "quality").get("strictValidation")
        if isinstance(strict, int):
            strict_counts.append(strict)
    return {
        **result,
        "strictSensorsPerSnapshot": {
            "minimum": min(strict_counts) if strict_counts else None,
            "maximum": max(strict_counts) if strict_counts else None,
            "mean": round(sum(strict_counts) / len(strict_counts), 2) if strict_counts else None,
        },
    }


def _json_bytes(value):
    return json.dumps(value, separators=(",", ":"), sort_keys=True).encode()


def _write_github_summary(daily, report):
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    strict = _path(report.get("metrics", {}), "primary", "product", "overall", "strict")
    sea = _path(report.get("metrics", {}), "comparisons", "seagullContext", "overall", "strict", "paired")
    collection = daily["collection"]
    lines = [
        "## PierCast lake-map validation", "",
        f"- UTC day: `{daily['date']}`",
        f"- Observation snapshots: **{collection['targetSnapshots']} / {EXPECTED_DAILY_SNAPSHOTS} expected**",
        f"- Forecast runs evaluated: **{collection['forecastRuns']}**",
        f"- Independent primary pairs today: **{collection['primaryPairs']}**",
        f"- Cumulative strict product pairs: **{strict.get('matches', 0)}**",
        f"- Contextual Seagull paired comparisons: **{sea.get('count', 0)}**",
        f"- Pipeline health: **{report['pipelineHealth']['status']}**",
        f"- Regression monitor: **{report['regressionMonitor']['status']}**",
        "", "Seagull results remain context-only because its documented endpoint returns a marine-zone summary, not a pier-point value.",
    ]
    with open(path, "a", encoding="utf-8") as handle:
        handle.write("\n".join(lines) + "\n")


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", help="UTC date to evaluate (default: yesterday)")
    parser.add_argument("--out", help="also write the cumulative summary here")
    parser.add_argument("--evidence-out", help="also write versioned match-level evidence here")
    parser.add_argument("--upload", action="store_true")
    parser.add_argument("--fail-on-pipeline-error", action="store_true")
    parser.add_argument("--env-file")
    args = parser.parse_args(argv)
    load_env_file(args.env_file)
    now = datetime.now(timezone.utc)
    target = date.fromisoformat(args.date) if args.date else (now - timedelta(days=1)).date()
    if not all(os.environ.get(key) for key in ENV_KEYS[:3]):
        raise SystemExit("R2 credentials are required (values are never printed)")
    s3 = store.client()
    archive_start_date = _archive_start_date(s3)

    days = [target - timedelta(days=offset) for offset in range(6, -1, -1)]
    keys_by_day = {day: list(list_keys(s3, _daily_prefix(day))) for day in days}
    all_snapshot_keys = [key for day in days for key in keys_by_day[day]]
    snapshots = load_many(s3, all_snapshot_keys)
    snapshots_by_key = dict(zip(all_snapshot_keys, snapshots))
    target_snapshots = [snapshots_by_key[key] for key in keys_by_day[target]]
    observations = unique_observations(snapshots)
    truth = [item for item in observations if item["observed"].date() == target]

    index = object_json(s3, "validation/forecast-index.json")
    day_start = datetime.combine(target, datetime.min.time(), timezone.utc)
    day_end = day_start + timedelta(days=1)
    selected = []
    for item in index.get("runs", []):
        cycle = parse_time(item.get("cycle"))
        if cycle and cycle < day_end and cycle + timedelta(hours=120, minutes=30) >= day_start:
            selected.append(f"{item['base']}verification.json")
    selected = sorted(set(selected))
    forecasts = load_many(s3, selected)
    hydrate_benchmarks(s3, forecasts)
    primary_pairs = list(pairs_for(truth, forecasts))
    attach_persistence(primary_pairs, observations)
    comparison_pairs = head_to_head_pairs(truth, forecasts)
    seagull_benchmarks = [item.get("benchmarks", {}).get("seagullModelSummaryV1", {}) for item in forecasts]

    generated_at = iso(now)
    producer_revision = os.environ.get("GITHUB_SHA", "").lower()
    if not re.fullmatch(r"[0-9a-f]{40}", producer_revision):
        producer_revision = None
    summarized = summarize(primary_pairs, comparison_pairs, target)
    collection = {
        "targetSnapshots": len(keys_by_day[target]), "expectedTargetSnapshots": EXPECTED_DAILY_SNAPSHOTS,
        "archiveStartDate": archive_start_date,
        "sourceHealth": _source_health(target_snapshots),
        "historySnapshots": len(all_snapshot_keys), "uniqueHistoryObservations": len(observations),
        "uniqueTargetObservations": len(truth), "forecastRuns": len(forecasts),
        "primaryPairs": len(primary_pairs), "strictPrimaryPairs": sum(pair["strict"] for pair in primary_pairs),
        "productPairs": sum(pair["productEligible"] for pair in primary_pairs),
        "persistencePairs": sum("persistenceErrorC" in pair for pair in primary_pairs),
        "seagullContextPairs": len(comparison_pairs),
        "strictSeagullContextPairs": sum(pair["strict"] for pair in comparison_pairs),
        "seagullCaptureRuns": sum(bool(item.get("benchmarks", {}).get("seagullModelSummaryV1", {}).get("sites"))
                                   for item in forecasts),
        "seagullSitesRequested": sum(item.get("sitesRequested", 0) for item in seagull_benchmarks),
        "seagullSitesCaptured": sum(item.get("sitesCaptured", 0) for item in seagull_benchmarks),
    }
    evidence = {
        "formatVersion": 2, "methodologyVersion": METHODOLOGY_VERSION,
        "purpose": "validation-only", "correctionApproved": False,
        "generatedAt": generated_at, "date": target.isoformat(), "collection": collection,
        "primaryPairs": primary_pairs, "seagullContextPairs": comparison_pairs,
        "warning": "Immutable research evidence; never a runtime correction input.",
    }
    if producer_revision:
        evidence["producerRevision"] = producer_revision
    evidence_body = _json_bytes(evidence)
    evidence_hash = hashlib.sha256(evidence_body).hexdigest()
    stamp = now.strftime("%Y%m%dT%H%M%SZ")
    evidence_key = f"validation/evidence/v2/{target:%Y/%m/%d}/{stamp}-{evidence_hash[:12]}.json"
    daily = {
        "formatVersion": 2, "methodologyVersion": METHODOLOGY_VERSION,
        "purpose": "validation-only", "correctionApproved": False,
        "generatedAt": generated_at, "collection": collection,
        "evidence": {"key": evidence_key, "sha256": evidence_hash}, **summarized,
    }
    if producer_revision:
        daily["producerRevision"] = producer_revision

    daily_key = f"validation/daily/{target.isoformat()}.json"
    existing_keys = list(list_keys(s3, "validation/daily/"))
    previous = load_many(s3, [key for key in existing_keys if key != daily_key])
    reports = previous + [daily]
    summary = cumulative_report(reports, generated_at)
    month = target.strftime("%Y-%m")
    monthly_reports = [item for item in reports if str(item.get("date", "")).startswith(month)]
    monthly = cumulative_report(monthly_reports, generated_at, scope=f"calendar-month:{month}")

    if args.out:
        Path(args.out).write_text(json.dumps(summary, indent=2) + "\n")
    if args.evidence_out:
        Path(args.evidence_out).write_bytes(evidence_body + b"\n")
    if args.upload:
        store.put(s3, evidence_key, evidence_body, store.IMMUTABLE)
        store.put(s3, daily_key, _json_bytes(daily), store.SHORT)
        store.put(s3, f"validation/monthly/{month}/latest.json", _json_bytes(monthly), store.SHORT)
        if (target.year, target.month) != (now.year, now.month):
            final_body = _json_bytes(monthly)
            final_hash = hashlib.sha256(final_body).hexdigest()
            final_key = f"validation/monthly/{month}/final/{stamp}-{final_hash[:12]}.json"
            store.put(s3, final_key, final_body, store.IMMUTABLE)
            store.put(s3, f"validation/monthly/{month}/final-latest.json",
                      _json_bytes({"key": final_key, "sha256": final_hash, "generatedAt": generated_at}), store.SHORT)
        store.put(s3, "validation/latest.json", _json_bytes(summary), store.SHORT)
    _write_github_summary(daily, summary)
    strict = _path(summary["metrics"], "primary", "product", "overall", "strict")
    print(f"{target}: {collection['targetSnapshots']} snapshots, {len(truth)} unique observations, "
          f"{len(primary_pairs)} independent model pairs, {strict.get('matches', 0)} cumulative strict product pairs, "
          f"{len(comparison_pairs)} Seagull context pairs")
    startup_partial = (collection["targetSnapshots"] > 0 and collection["archiveStartDate"] == target.isoformat())
    daily_pipeline_error = ((collection["targetSnapshots"] < MIN_DAILY_SNAPSHOTS and not startup_partial)
                            or collection["forecastRuns"] == 0)
    if args.fail_on_pipeline_error and daily_pipeline_error:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
