#!/usr/bin/env python3
"""Offline scorecard summaries and conservative candidate-correction evaluation.

This is research-only. It reads exported rows and never writes runtime config.
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import statistics
from collections import defaultdict
from datetime import datetime
from pathlib import Path

import scorecard_store

BAD_FLAGS = {"spike", "stale", "out_of_range"}
MIN_READY_SAMPLES = 90
EVENT_DELTA_C = 3.0
EVENT_WIND_MPH = 10.0
CURRENT_MODEL_SUFFIX = ":COMF-3.6:2024-09-16"


def _time(value):
    return datetime.fromisoformat(str(value).replace("Z", "+00:00"))


def depth_band(depth_m):
    depth = float(depth_m)
    if depth <= 1.5:
        return "surface"
    feet = depth / 0.3048
    for upper in (10, 20, 30, 40, 50):
        if feet <= upper:
            return f"depth_to_{upper}ft"
    return "depth_over_50ft"


def lead_band(lead):
    lead = float(lead)
    return min((0, 6, 12, 24, 48, 72, 120), key=lambda value: abs(value - lead))


def usable(row):
    flags = row.get("quality_flags") or []
    if isinstance(flags, str):
        flags = {item.strip() for item in flags.strip("{}").split(",") if item.strip()}
    return (row.get("pair_status") == "paired" and row.get("miss_c") is not None
            and not BAD_FLAGS.intersection(flags))


def current_model(row):
    return str(row.get("model_version") or "").endswith(CURRENT_MODEL_SUFFIX)


def _metrics(values):
    if not values:
        return {"sample_count": 0, "mean_miss_c": None, "typical_miss_c": None, "mae_c": None}
    return {
        "sample_count": len(values),
        "mean_miss_c": round(statistics.fmean(values), 4),
        "typical_miss_c": round(statistics.median(abs(value) for value in values), 4),
        "mae_c": round(statistics.fmean(abs(value) for value in values), 4),
    }


def condition_labels(rows):
    """Classify wind-associated rapid thermal events separately from normal rows."""
    unique = {}
    for row in rows:
        if not usable(row):
            continue
        observed = row.get("observed_temperature_f")
        if observed is None:
            continue
        key = (row.get("station_id"), row.get("sensor_key"), row.get("observation_time"))
        unique.setdefault(key, row)
    labels = {}
    by_sensor = defaultdict(list)
    for row in unique.values():
        by_sensor[(row.get("station_id"), row.get("sensor_key"))].append(row)
    for sensor_rows in by_sensor.values():
        previous = None
        for row in sorted(sensor_rows, key=lambda item: _time(item["observation_time"])):
            label = "normal"
            if previous is not None:
                elapsed = (_time(row["observation_time"]) - _time(previous["observation_time"])).total_seconds() / 3600
                wind = row.get("wind_speed_mph")
                direction = row.get("wind_from_degrees")
                if (3 <= elapsed <= 24 and wind is not None and direction is not None and
                        float(wind) >= EVENT_WIND_MPH):
                    delta_c = (float(row["observed_temperature_f"]) -
                               float(previous["observed_temperature_f"])) * 5 / 9
                    if delta_c <= -EVENT_DELTA_C:
                        label = "wind_associated_upwelling"
                    elif delta_c >= EVENT_DELTA_C:
                        label = "wind_associated_downwelling"
            labels[(row.get("station_id"), row.get("sensor_key"), row.get("observation_time"))] = label
            previous = row
    return labels


def condition_for(row, labels):
    return labels.get((row.get("station_id"), row.get("sensor_key"), row.get("observation_time")), "normal")


def summarize(rows):
    groups = defaultdict(list)
    coverage = defaultdict(int)
    labels = condition_labels(rows)
    for row in rows:
        key = (row.get("station_id"), depth_band(row.get("sensor_depth_m", 0)),
               _time(row["observation_time"]).month, lead_band(row.get("lead_hours", 0)),
               row.get("model_version"), condition_for(row, labels))
        coverage[(row.get("station_id"), row.get("pair_status"))] += 1
        if usable(row):
            groups[key].append(float(row["miss_c"]))
    result = []
    for (station, depth, month, lead, version, condition), values in sorted(groups.items()):
        result.append({"station_id": station, "depth_band": depth, "month": month,
                       "lead_hours": lead, "model_version": version,
                       "condition": condition, **_metrics(values)})
    return result, [{"station_id": key[0], "status": key[1], "count": count}
                    for key, count in sorted(coverage.items())]


def _circular_month_distance(left, right):
    distance = abs(left - right)
    return min(distance, 12 - distance)


def _same_series(row, target):
    return (row.get("station_id"), depth_band(row["sensor_depth_m"]), row.get("model_version")) == (
        target.get("station_id"), depth_band(target["sensor_depth_m"]), target.get("model_version"))


def learned_lead_fade(training, target, shrink_n=60):
    """Estimate how station/depth bias changes with lead, conservatively.

    The estimate is the signed-miss ratio at the requested lead versus lead 0.
    Sparse or inconsistent evidence is shrunk toward an exponential fallback,
    and a sign reversal fades the correction to zero rather than extrapolating
    it in the wrong direction.
    """
    target_lead = lead_band(target.get("lead_hours", 0))
    if target_lead == 0:
        return 1.0
    compatible = [row for row in training if usable(row) and _same_series(row, target)]
    base = [float(row["miss_c"]) for row in compatible if lead_band(row.get("lead_hours", 0)) == 0]
    at_lead = [float(row["miss_c"]) for row in compatible
               if lead_band(row.get("lead_hours", 0)) == target_lead]
    fallback = math.exp(-float(target_lead) / 120)
    if len(base) < 10 or len(at_lead) < 10:
        return fallback
    base_mean = statistics.fmean(base)
    lead_mean = statistics.fmean(at_lead)
    if abs(base_mean) < 0.15 or base_mean * lead_mean <= 0:
        empirical = 0.0
    else:
        empirical = min(1.25, max(0.0, lead_mean / base_mean))
    evidence = min(len(base), len(at_lead))
    reliability = evidence / (evidence + shrink_n)
    return empirical * reliability + fallback * (1 - reliability)


def candidate_bias(training, target, shrink_n=60):
    """Smooth lead-0 seasonal bias, shrunk and faded by learned lead behavior."""
    compatible = []
    target_month = _time(target["observation_time"]).month
    for row in training:
        if not usable(row):
            continue
        if not _same_series(row, target) or lead_band(row.get("lead_hours", 0)) != 0:
            continue
        distance = _circular_month_distance(_time(row["observation_time"]).month, target_month)
        if distance <= 2:
            compatible.append((float(row["miss_c"]), math.exp(-0.5 * (distance / 1.25) ** 2)))
    if not compatible:
        return 0.0
    weight = sum(item[1] for item in compatible)
    mean = sum(value * w for value, w in compatible) / weight
    spread = math.sqrt(sum(w * (value - mean) ** 2 for value, w in compatible) / weight)
    sample_shrink = len(compatible) / (len(compatible) + shrink_n)
    consistency_shrink = 1 / (1 + (spread / 1.5) ** 2)
    lead_fade = learned_lead_fade(training, target, shrink_n=shrink_n)
    return mean * sample_shrink * consistency_shrink * lead_fade


def lead_fade_summary(rows):
    """Describe the learned forecast-lead fade used by the candidate."""
    groups = defaultdict(list)
    for row in rows:
        if current_model(row) and usable(row):
            groups[(row.get("station_id"), depth_band(row["sensor_depth_m"]),
                    row.get("model_version"))].append(row)
    output = []
    for (station, depth, version), values in sorted(groups.items()):
        for lead in (6, 12, 24, 48, 72, 120):
            base_count = sum(lead_band(row.get("lead_hours", 0)) == 0 for row in values)
            lead_count = sum(lead_band(row.get("lead_hours", 0)) == lead for row in values)
            if not lead_count:
                continue
            target = {"station_id": station, "sensor_depth_m": values[0]["sensor_depth_m"],
                      "model_version": version, "lead_hours": lead}
            output.append({"station_id": station, "depth_band": depth,
                           "model_version": version, "lead_hours": lead,
                           "lead_0_samples": base_count, "lead_samples": lead_count,
                           "learned_fade": round(learned_lead_fade(values, target), 4)})
    return output


def season_id(row):
    observed = _time(row["observation_time"])
    season = ("winter" if observed.month in (12, 1, 2) else "spring" if observed.month <= 5
              else "summer" if observed.month <= 8 else "fall")
    year = observed.year - 1 if observed.month in (1, 2) else observed.year
    return f"{year}-{season}"


def leave_one_season_out(rows):
    labels = condition_labels(rows)
    eligible = [row for row in rows if current_model(row) and usable(row)
                and condition_for(row, labels) == "normal"]
    output = []
    for held in sorted({season_id(row) for row in eligible}):
        train = [row for row in eligible if season_id(row) != held]
        test = [row for row in eligible if season_id(row) == held]
        plain = [abs(float(row["miss_c"])) for row in test]
        corrected = [abs(float(row["miss_c"]) - candidate_bias(train, row)) for row in test]
        if test:
            output.append({"held_out_season": held, "sample_count": len(test),
                           "noaa_mae_c": round(statistics.fmean(plain), 4),
                           "candidate_mae_c": round(statistics.fmean(corrected), 4),
                           "mae_improvement_c": round(statistics.fmean(plain) - statistics.fmean(corrected), 4)})
    return output


def readiness(summary):
    by_station = defaultdict(list)
    for item in summary:
        if item.get("condition") != "normal" or not str(item.get("model_version") or "").endswith(
                CURRENT_MODEL_SUFFIX):
            continue
        by_station[(item["station_id"], item["depth_band"], item["model_version"])].append(item)
    ready, noaa, special = [], [], []
    for key, values in sorted(by_station.items()):
        count = sum(value["sample_count"] for value in values)
        means = [value["mean_miss_c"] for value in values if value["mean_miss_c"] is not None]
        target = {"station_id": key[0], "depth_band": key[1], "model_version": key[2], "sample_count": count}
        if key[1] != "surface" and count < MIN_READY_SAMPLES:
            noaa.append({**target, "reason": "insufficient depth evidence"})
        elif count < MIN_READY_SAMPLES or len(means) < 3:
            noaa.append({**target, "reason": "insufficient seasonal evidence"})
        elif statistics.pstdev(means) > 1.5:
            special.append({**target, "reason": "bias changes materially by month/lead"})
        else:
            ready.append(target)
    return {"ready_for_candidate": ready, "stay_noaa": noaa, "special_handling": special}


def load_rows(path):
    if path.suffix.lower() == ".parquet" or path.is_dir():
        return scorecard_store.read_rows(path)
    if path.suffix.lower() == ".json":
        value = json.loads(path.read_text())
        return value if isinstance(value, list) else value.get("rows", [])
    with path.open(newline="") as stream:
        return list(csv.DictReader(stream))


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args(argv)
    rows = load_rows(args.input)
    summary, coverage = summarize(rows)
    result = {"row_count": len(rows), "summary": summary, "coverage": coverage,
              "learned_lead_fade": lead_fade_summary(rows),
              "leave_one_season_out": leave_one_season_out(rows), "readiness": readiness(summary),
              "correction_shipped": False}
    body = json.dumps(result, indent=2, sort_keys=True)
    if args.out:
        args.out.write_text(body + "\n")
    print(body)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
