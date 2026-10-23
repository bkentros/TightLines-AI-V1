#!/usr/bin/env python3
"""Rebuild private Lakeport 45209 rows with the validated exact-time field sampler."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import pyarrow.parquet as pq
from botocore.exceptions import ClientError

import scorecard
import scorecard_addon_backfill as addon
import scorecard_fields_backfill as fields
import scorecard_public_backfill as public
import scorecard_schema
import scorecard_store
from lakemap import store

UTC = timezone.utc
STATION = "external:45209"
METHODOLOGY = "public-scorecard-addon-v2"
FRAGMENT_PREFIX = "private/scorecard/v1/samples/stream=backfill_addon/version=addon_v2"
MARKER_PREFIX = "private/scorecard/v1/samples/stream=backfill_addon/_done/addon_v2"


def revision():
    value = os.environ.get("GITHUB_SHA", "").strip().lower()
    if len(value) == 40:
        return value
    return subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=Path(__file__).resolve().parents[4], text=True,
    ).strip().lower()


def marker_key(day_text):
    return f"{MARKER_PREFIX}/date={day_text}.json"


def marker_exists(s3, bucket, day_text):
    try:
        s3.head_object(Bucket=bucket, Key=marker_key(day_text))
        return True
    except ClientError as error:
        if error.response.get("ResponseMetadata", {}).get("HTTPStatusCode") == 404:
            return False
        raise


def collect(start, end, cache):
    meta = {"45209": {**addon.ADDONS[STATION], "externalId": "45209"}}
    previous = public.NDBC_STATIONS
    try:
        public.NDBC_STATIONS = ["45209"]
        return public.dedupe_and_qc(public.collect_ndbc(
            public.PublicCache(cache / "sources"), start, end, meta,
        ))
    finally:
        public.NDBC_STATIONS = previous


def fix_pair(pair, sampler):
    if pair.get("station") != STATION:
        return None
    if pair.get("pairStatus") == "paired":
        result = dict(pair)
        if (result.get("sampleMethod") == "interpolated_3d"
                and float(result.get("sensorDepthM") or 0) <= 1.5):
            result.update(sampleMethod="field_node", depthMethod="surface_layer")
        return result
    if pair.get("pairStatus") != "uncovered":
        return None
    observed, lower, upper, fraction = fields.field_bracket(pair["observed"])
    model = public.MODELS[pair["body"]]
    location = sampler.locate(model, lower[1], pair["stationLat"], pair["stationLon"])
    if location is None:
        return None
    node, model_lat, model_lon, distance = location
    low = sampler.value((model, lower[1], lower[2], node))
    high = sampler.value((model, upper[1], upper[2], node))
    if low is None or high is None:
        return None
    value_c = low + (high - low) * fraction
    archive_cycle = max(lower[1], upper[1])
    if not -2 <= value_c <= 40:
        return None
    result = dict(pair)
    result.update({
        "cycle": public.iso(observed), "issuedAt": public.iso(archive_cycle),
        "validTime": public.iso(observed), "leadHour": 0.0,
        "lowerHour": 0, "upperHour": 0, "timeInterpolationFraction": 0.0,
        "run": (f"addon-v2/{model}/{lower[1]:%Y%m%d%H}n{lower[2]:03d}-"
                f"{upper[1]:%Y%m%d%H}n{upper[2]:03d}"),
        "forecastF": value_c * 1.8 + 32, "pairStatus": "paired",
        "sampleMethod": "field_node", "depthMethod": "surface_layer",
        "modelLat": model_lat, "modelLon": model_lon, "modelDistanceKm": distance,
        "observationOffsetMinutes": 0.0,
        "modelVersion": (public.CURRENT_MODEL_VERSION
                         if archive_cycle >= public.CURRENT_MODEL_START else public.LEGACY_MODEL_VERSION),
    })
    return result


def records_for_day(day, observations, sampler):
    pairs = public.build_pairs(day, observations, sampler.geometry)
    fixed = [result for pair in pairs if (result := fix_pair(pair, sampler)) is not None]
    unique = {}
    for pair in fixed:
        key = (pair.get("sensorIdentity") or pair["station"], pair["observed"])
        unique[key] = pair
    evidence = {"methodologyVersion": METHODOLOGY, "primaryPairs": list(unique.values())}
    digest = hashlib.sha256(json.dumps(
        evidence, separators=(",", ":"), sort_keys=True,
    ).encode()).hexdigest()
    records = scorecard.records_from_evidence(evidence, f"public-addon/v2/{day}.json", digest)
    for record in records:
        record["methodology_version"] = METHODOLOGY
    projected = [{**record, "sample_method": "saved_surface_grid"}
                 if record.get("sample_method") == "field_node" else record for record in records]
    validation = scorecard_schema.validate_records(projected)
    return records, digest, validation


def write_day(records, digest, day_text, code_version, s3, bucket, root):
    key = f"{FRAGMENT_PREFIX}/date={day_text}/{digest[:24]}.parquet"
    path = root / key
    path.parent.mkdir(parents=True, exist_ok=True)
    table = scorecard_store.records_table(records)
    pq.write_table(table, path, compression="zstd", version="2.6", write_statistics=True)
    file_digest = scorecard_store.sha256_file(path)
    s3.upload_file(str(path), bucket, key, ExtraArgs={
        "ContentType": "application/vnd.apache.parquet", "CacheControl": "private, no-store",
        "Metadata": {"sha256": file_digest, "rows": str(table.num_rows)},
    })
    head = s3.head_object(Bucket=bucket, Key=key)
    if (head.get("Metadata", {}).get("sha256") != file_digest or
            int(head.get("Metadata", {}).get("rows", "-1")) != table.num_rows):
        raise RuntimeError("R2 add-on v2 fragment verification failed")
    sidecar = key.removesuffix(".parquet") + ".manifest.json"
    manifest = {"formatVersion": 1, "stream": "backfill_addon", "streamVersion": "addon_v2",
                "date": day_text, "rowCount": table.num_rows, "digest": digest,
                "parquetSha256": file_digest, "fragmentKey": key, "manifestKey": sidecar,
                "methodologyVersion": METHODOLOGY, "codeVersion": code_version}
    body = json.dumps(manifest, separators=(",", ":"), sort_keys=True).encode()
    s3.put_object(Bucket=bucket, Key=sidecar, Body=body, ContentType="application/json",
                  CacheControl="private, no-store")
    if s3.get_object(Bucket=bucket, Key=sidecar)["Body"].read() != body:
        raise RuntimeError("R2 add-on v2 manifest verification failed")
    marker_body = json.dumps(manifest, separators=(",", ":"), sort_keys=True).encode()
    s3.put_object(Bucket=bucket, Key=marker_key(day_text), Body=marker_body,
                  ContentType="application/json", CacheControl="private, no-store")
    if s3.get_object(Bucket=bucket, Key=marker_key(day_text))["Body"].read() != marker_body:
        raise RuntimeError("R2 add-on v2 marker verification failed")


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", required=True, type=date.fromisoformat)
    parser.add_argument("--end", required=True, type=date.fromisoformat)
    parser.add_argument("--cache", type=Path, default=Path(os.environ.get(
        "SCORECARD_ADDON_V2_CACHE", "/tmp/finfindr-addon-v2-cache")))
    parser.add_argument("--store-dir", type=Path, default=Path(os.environ.get(
        "SCORECARD_STORE_DIR", "/tmp/finfindr-addon-v2-store")))
    parser.add_argument("--store", action="store_true")
    parser.add_argument("--skip-existing-r2", action="store_true")
    args = parser.parse_args(argv)
    if args.end < args.start:
        parser.error("end precedes start")
    bucket = store.bucket()
    if bucket in {"", "piercast-lake-map"}:
        raise SystemExit("refusing unset or production map bucket")
    s3 = store.client()
    start = datetime.combine(args.start, datetime.min.time(), UTC)
    end = datetime.combine(args.end + timedelta(days=1), datetime.min.time(), UTC)
    observations = collect(start, end - timedelta(microseconds=1), args.cache)
    sampler = fields.ArchivedFieldSampler(args.cache / "fields")
    code_version = revision()
    day, stored, skipped, rows_total = args.start, 0, 0, 0
    while day <= args.end:
        day_text = day.isoformat()
        if args.skip_existing_r2 and marker_exists(s3, bucket, day_text):
            skipped += 1; print(f"AddonV2 day={day_text} status=r2_skip"); day += timedelta(days=1); continue
        lower = datetime.combine(day, datetime.min.time(), UTC)
        selected = [row for row in observations if lower <= row["observed"] < lower + timedelta(days=1)]
        before = sampler.fetch_errors
        records, digest, validation = records_for_day(day, selected, sampler)
        errors = sampler.fetch_errors - before
        if errors:
            print(f"AddonV2 day={day_text} status=paused reason=source_fetch_error errors={errors}")
            return 5
        if validation["invalidRows"]:
            print(f"AddonV2 day={day_text} status=invalid count={validation['invalidRows']}")
            return 2
        if args.store:
            write_day(records, digest, day_text, code_version, s3, bucket, args.store_dir)
        stored += 1; rows_total += len(records)
        print(f"AddonV2 day={day_text} status={'stored' if args.store else 'validated'} records={len(records)} errors=0")
        day += timedelta(days=1)
    print(json.dumps({"status": "complete", "days": stored, "skipped": skipped,
                      "rows": rows_total, "errors": sampler.fetch_errors}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
