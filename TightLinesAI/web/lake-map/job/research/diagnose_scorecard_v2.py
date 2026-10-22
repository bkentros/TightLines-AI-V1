#!/usr/bin/env python3
"""Read-only aggregate diagnosis over deterministic v2 scorecard markers."""
from __future__ import annotations

import argparse
import csv
import io
import json
import sys
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import date, timedelta
from pathlib import Path

import pyarrow as pa
import pyarrow.parquet as pq
from botocore.exceptions import ClientError

JOB_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(JOB_DIR))

import scorecard_store  # noqa: E402
from lakemap import store  # noqa: E402

MODEL_DISTANCE = {
    "lake-michigan": "lmhofs_wet_cell_distance_km",
    "lake-huron": "lmhofs_wet_cell_distance_km",
    "lake-erie": "leofs_wet_cell_distance_km",
    "lake-ontario": "loofs_wet_cell_distance_km",
    "lake-superior": "lsofs_wet_cell_distance_km",
}


def expected_dates(chunks_path):
    dates = []
    for item in json.loads(chunks_path.read_text()):
        cursor = date.fromisoformat(item["start"])
        end = date.fromisoformat(item["end"])
        while cursor <= end:
            dates.append(cursor.isoformat())
            cursor += timedelta(days=1)
    return sorted(set(dates))


def marker_for(s3, day):
    key = scorecard_store.done_marker_key("backfill", day, "public-scorecard-backfill-v2")
    try:
        s3.head_object(Bucket=store.bucket(), Key=key)
        return day, key
    except ClientError as error:
        if error.response.get("ResponseMetadata", {}).get("HTTPStatusCode") == 404:
            return None
        raise


def read_day(s3, item):
    day, marker_key = item
    marker = json.loads(s3.get_object(Bucket=store.bucket(), Key=marker_key)["Body"].read())
    body = s3.get_object(Bucket=store.bucket(), Key=marker["fragmentKey"])["Body"].read()
    return day, pq.read_table(pa.BufferReader(body)).to_pylist()


def metadata_map(path):
    result = {}
    with path.open(newline="") as stream:
        for row in csv.DictReader(stream):
            identifiers = [row["station_id"], *(row.get("alternate_station_ids") or "").split(";")]
            for identifier in identifiers:
                if identifier:
                    result[identifier] = row
    return result


def distance_for(row, metadata):
    item = metadata.get(row["station_id"])
    if not item:
        return None
    column = MODEL_DISTANCE.get(row.get("waterbody"))
    if not column or not item.get(column):
        return None
    try:
        return float(item[column])
    except ValueError:
        return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--chunks", type=Path, default=JOB_DIR / "backfill_chunks.json")
    parser.add_argument("--stations", type=Path, default=Path(__file__).with_name("stations_v1.csv"))
    parser.add_argument("--output", type=Path,
                        default=Path("/tmp/finfindr-hybrid-phase1/scorecard-v2-diagnosis.json"))
    args = parser.parse_args()
    if store.bucket() == "piercast-lake-map":
        raise SystemExit("refusing production map bucket")
    s3 = store.client()
    expected = expected_dates(args.chunks)
    with ThreadPoolExecutor(max_workers=24) as executor:
        markers = [item for item in executor.map(lambda day: marker_for(s3, day), expected) if item]
    with ThreadPoolExecutor(max_workers=12) as executor:
        days = list(executor.map(lambda item: read_day(s3, item), markers))
    metadata = metadata_map(args.stations)
    pending = Counter()
    pending_depths = defaultdict(Counter)
    uncovered = Counter()
    recoverable = Counter()
    pending_location = Counter()
    pending_below_bottom = 0
    uncovered_causes = Counter()
    rows_total = 0
    uncovered_total = 0
    per_day = {}
    for day, rows in days:
        rows_total += len(rows)
        per_day[day] = rows
        for row in rows:
            if row.get("pair_status") == "pending_3d":
                pending[row["station_id"]] += 1
                pending_depths[row["station_id"]][row.get("sensor_depth_m")] += 1
                pending_location["withLocation" if row.get("model_distance_km") is not None else "noLocation"] += 1
                item = metadata.get(row["station_id"], {})
                try:
                    pending_below_bottom += float(row["sensor_depth_m"]) > float(item["water_depth_m"])
                except (KeyError, TypeError, ValueError):
                    pass
            elif row.get("pair_status") == "uncovered":
                uncovered[row["station_id"]] += 1
                uncovered_total += 1
                distance = distance_for(row, metadata)
                if row.get("waterbody") not in MODEL_DISTANCE:
                    uncovered_causes["noModelForWaterbody"] += 1
                elif {"invalid_position", "missing_position"}.intersection(row.get("quality_flags") or []):
                    uncovered_causes["invalidPosition"] += 1
                elif distance is None:
                    uncovered_causes["noMetadataDistance"] += 1
                elif distance > 6:
                    uncovered_causes["beyondSixKm"] += 1
                else:
                    uncovered_causes["modelValuesUnavailable"] += 1
                if distance is not None:
                    for threshold in (1, 2, 5):
                        if distance <= threshold:
                            recoverable[threshold] += 1
    top_uncovered = []
    for station_id, count in uncovered.most_common(15):
        item = metadata.get(station_id, {})
        exemplar = next((row for rows in per_day.values() for row in rows
                         if row.get("station_id") == station_id), {})
        top_uncovered.append({
            "stationId": station_id, "rows": count,
            "class": exemplar.get("station_class") or item.get("station_class"),
            "wetCellKm": distance_for(exemplar, metadata) if exemplar else None,
        })
    top_pending = []
    for station_id, count in pending.most_common(30):
        depths = [depth for depth in pending_depths[station_id] if depth is not None]
        top_pending.append({"stationId": station_id, "rows": count,
                            "depthsM": sorted(round(float(depth), 3) for depth in depths)})
    lead_day = "2023-05-01" if "2023-05-01" in per_day else min(per_day, default=None)
    lead_buckets = Counter()
    if lead_day:
        for row in per_day[lead_day]:
            lead = float(row["lead_hours"])
            if lead < 6:
                lead_buckets["0-6"] += 1
            elif lead < 12:
                lead_buckets["6-12"] += 1
            elif lead < 24:
                lead_buckets["12-24"] += 1
            elif lead < 48:
                lead_buckets["24-48"] += 1
            else:
                lead_buckets["48+"] += 1
    report = {
        "expectedDays": len(expected), "storedDays": len(markers), "rows": rows_total,
        "pendingRows": sum(pending.values()), "pendingStations": len(pending),
        "pendingTop": top_pending, "pendingLocation": dict(pending_location),
        "pendingBelowBottom": pending_below_bottom, "uncoveredRows": uncovered_total,
        "uncoveredCauses": dict(uncovered_causes),
        "uncoveredTop": top_uncovered,
        "recoverable": {str(key): recoverable[key] for key in (1, 2, 5)},
        "leadDay": lead_day,
        "leadBuckets": {key: lead_buckets[key] for key in ("0-6", "6-12", "12-24", "24-48", "48+")},
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n")
    print(json.dumps(report, sort_keys=True))


if __name__ == "__main__":
    main()
