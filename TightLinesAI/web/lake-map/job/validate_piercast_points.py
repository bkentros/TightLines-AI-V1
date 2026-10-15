#!/usr/bin/env python3
"""Validate the proposed lake-map PierCast feed against committed v63 samples.

This is an operator tool, not part of the scheduled job. It rebuilds the
LMHOFS portion of a historical surface cycle from either NOAA distribution,
uses the same extraction path as the scheduled job, and compares those values
with an NDJSON export of the v63 temperature-sample tables.
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))

from lakemap import ofs, piercast  # noqa: E402
from lakemap.config import EXTEND_CELLS, GEO_PATH, HOURS, OFS_MODELS, TEMP  # noqa: E402
from lakemap.regrid import Regridder, target_mask, water_mask  # noqa: E402


def parse_cycle(value: str) -> datetime:
    cycle = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if cycle.tzinfo is None:
        cycle = cycle.replace(tzinfo=timezone.utc)
    cycle = cycle.astimezone(timezone.utc)
    if cycle.minute or cycle.second or cycle.microsecond or cycle.hour not in {0, 6, 12, 18}:
        raise argparse.ArgumentTypeError("cycle must be an exact 00/06/12/18Z NOAA cycle")
    return cycle


def load_reference(path: Path):
    rows = []
    with path.open() as stream:
        for line_number, line in enumerate(stream, 1):
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError as error:
                raise ValueError(f"invalid reference NDJSON at line {line_number}") from error
    return rows


def generate(cycle: datetime, distribution: str):
    config = piercast.load_points()
    model = next(model for model in OFS_MODELS if model["id"] == "LMHOFS")
    lake = ofs.LakeModel(model, cycle, distribution=distribution, request_retries=1)
    expected_distribution = {
        "thredds": ofs.THREDDS_DISTRIBUTION,
        "nodd": ofs.NODD_DISTRIBUTION,
    }[distribution]
    if lake.distribution != expected_distribution:
        raise RuntimeError(f"validation selected {lake.distribution}, expected {expected_distribution}")

    source = {"model": model, "lm": lake, "hours": {}}
    if distribution == "nodd":
        water = water_mask(TEMP, GEO_PATH)
        targets = target_mask(water, EXTEND_CELLS)
        source["rg"] = Regridder(
            lake.lon,
            lake.lat,
            TEMP,
            targets,
            radius=0.3,
            max_edge=4 * max(lake.spacing, 0.005),
        )
    for hour in range(HOURS):
        source["hours"][hour] = lake.surface_temp_c(hour, request_retries=1)
        print(f"{cycle:%Y%m%dT%HZ} {distribution} f{hour:03d}/f120", flush=True)

    feed = piercast.versioned_payload(
        piercast.extract_point_feed([source], cycle, config),
        f"validation-{distribution}-{cycle:%Y%m%dT%HZ}",
        datetime.now(timezone.utc),
    )
    piercast.validate_payload(feed)
    return feed


def compare(feed, reference_rows):
    reference = {
        (row["city_id"], int(row["forecast_hour"])): row
        for row in reference_rows
        if row["issued_at"] == feed["cycle"]
    }
    if len(reference) != 32 * HOURS:
        raise RuntimeError(f"{feed['cycle']} reference has {len(reference)} rows, expected {32 * HOURS}")
    by_city = defaultdict(list)
    mapping_differences = []
    for point in feed["points"]:
        first = reference[(point["cityId"], 0)]
        if (first["grid_row"], first["grid_column"]) != (point["gridRow"], point["gridColumn"]):
            mapping_differences.append({
                "cityId": point["cityId"],
                "v63": [first["grid_row"], first["grid_column"]],
                "pointFeed": [point["gridRow"], point["gridColumn"]],
            })
        for sample in point["samples"]:
            old = float(reference[(point["cityId"], sample["forecastHour"])]["temperature_c"])
            by_city[point["cityId"]].append(abs(sample["temperatureC"] - old) * 9 / 5)
    per_city = [{
        "cityId": city_id,
        "meanAbsDifferenceF": round(float(np.mean(values)), 6),
        "maxAbsDifferenceF": round(float(np.max(values)), 6),
    } for city_id, values in sorted(by_city.items())]
    all_values = [value for values in by_city.values() for value in values]
    return {
        "cycle": feed["cycle"],
        "sampleCount": len(all_values),
        "meanAbsDifferenceF": round(float(np.mean(all_values)), 6),
        "maxAbsDifferenceF": round(float(np.max(all_values)), 6),
        "mappingDifferences": mapping_differences,
        "cities": per_city,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cycle", action="append", required=True, type=parse_cycle)
    parser.add_argument("--distribution", required=True, choices=("thredds", "nodd"))
    parser.add_argument("--reference", required=True, type=Path)
    parser.add_argument("--out-dir", required=True, type=Path)
    args = parser.parse_args()
    args.out_dir.mkdir(parents=True, exist_ok=True)
    reference = load_reference(args.reference)
    summaries = []
    for cycle in args.cycle:
        feed = generate(cycle, args.distribution)
        stem = cycle.strftime("%Y%m%dT%HZ")
        (args.out_dir / f"{stem}-{args.distribution}-point-feed.json").write_text(
            json.dumps(feed, indent=2) + "\n"
        )
        summaries.append(compare(feed, reference))
    (args.out_dir / f"{args.distribution}-temperature-comparison.json").write_text(
        json.dumps(summaries, indent=2) + "\n"
    )


if __name__ == "__main__":
    main()
