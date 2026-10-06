#!/usr/bin/env python3
"""Build the private NOAA/observation scorecard without touching map outputs.

This runs after the existing daily validator in a separate continue-on-error
workflow step. It reuses immutable R2 observations and saved run grids, writes
its own immutable private evidence object, then best-effort projects rows into
Supabase. The exact-value kill switch exits before any R2 or network work.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

from lakemap import store

import scorecard
import scorecard_pairing
import scorecard_schema
import verify

PROGRESS_PREFIX = "validation/scorecard/replay-progress/v1"


def _json_bytes(value):
    return json.dumps(value, separators=(",", ":"), sort_keys=True).encode()


def _record_set_digest(records):
    stable = [{key: value for key, value in record.items()
               if key not in ("evidence_key", "evidence_sha256")} for record in records]
    return hashlib.sha256(_json_bytes(stable)).hexdigest()


def _resume_batch(s3, key, record_set_sha256, candidate_count):
    state = store.read_json(s3, key)
    if not isinstance(state, dict):
        return 0
    if (state.get("recordSetSha256") != record_set_sha256 or
            state.get("candidateCount") != candidate_count):
        return 0
    next_batch = state.get("nextBatch")
    batch_count = (candidate_count + scorecard.MAX_BATCH - 1) // scorecard.MAX_BATCH
    return next_batch if isinstance(next_batch, int) and 0 <= next_batch <= batch_count else 0


def _progress_writer(s3, key, target, record_set_sha256, candidate_count):
    allowed = {"committed", "confirmed", "degraded"}

    def write(state):
        status = state.get("status")
        if status not in allowed:
            return
        payload = {
            "formatVersion": 1,
            "date": target.isoformat(),
            "recordSetSha256": record_set_sha256,
            "candidateCount": candidate_count,
            "status": status,
            "nextBatch": state.get("nextBatch"),
            "confirmedRecords": state.get("confirmedRecords"),
            "updatedAt": verify.iso(datetime.now(timezone.utc)),
        }
        if status == "degraded":
            payload["batchIndex"] = state.get("batchIndex")
            payload["failureCategory"] = state.get("failureCategory")
            payload["attempts"] = state.get("attempts")
        store.put(s3, key, _json_bytes(payload), store.SHORT)

    return write


def collect(s3, target):
    snapshot_keys = list(verify.list_keys(s3, verify._daily_prefix(target)))
    snapshots = verify.load_many(s3, snapshot_keys)
    if not snapshots:
        try:
            snapshots = [verify.object_json(s3, "observations/latest.json")]
        except Exception:
            snapshots = []
    observations = verify.collapse_observation_revisions(verify.unique_observations(snapshots))
    truth = [item for item in observations if item["observed"].date() == target]

    try:
        index = verify.object_json(s3, "validation/forecast-index.json")
    except Exception:
        latest = verify.object_json(s3, "latest.json")
        run = latest.get("run")
        cycle = latest.get("cycle")
        index = {"runs": [{"base": f"runs/{run}/", "cycle": cycle}]} if run and cycle else {"runs": []}
    day_start = datetime.combine(target, datetime.min.time(), timezone.utc)
    day_end = day_start + timedelta(days=1)
    verification_keys = []
    for item in index.get("runs", []):
        cycle = verify.parse_time(item.get("cycle"))
        if cycle and cycle < day_end and cycle + timedelta(hours=120, minutes=30) >= day_start:
            verification_keys.append(f"{item['base']}verification.json")
    verification_keys = sorted(set(verification_keys))
    forecasts = verify.load_many(s3, verification_keys)
    for forecast, key in zip(forecasts, verification_keys):
        forecast["_base"] = key[:-len("verification.json")]

    sampler = verify.R2FrameSampler(s3)
    pairs = list(scorecard_pairing.pairs_for(truth, forecasts, frame_sampler=sampler))
    paired_observations = {(pair["station"], pair.get("parameterId"), pair["depthKey"], pair["observed"],
                            pair.get("observationSource") or pair.get("source") or "unknown")
                           for pair in pairs}
    exact = sum(pair.get("sampleMethod") == "frozen_verification_site" for pair in pairs)
    fallback = sum(pair.get("sampleMethod") == "saved_surface_grid" for pair in pairs)
    pending = sum(pair.get("pairStatus") == "pending_3d" for pair in pairs)
    uncovered = sum(pair.get("pairStatus") == "uncovered" for pair in pairs)
    return {
        "formatVersion": 1,
        "methodologyVersion": verify.METHODOLOGY_VERSION,
        "purpose": "private-noaa-observation-scorecard",
        "correctionApproved": False,
        "date": target.isoformat(),
        "generatedAt": verify.iso(datetime.now(timezone.utc)),
        "inputs": {
            "observationSnapshotCount": len(snapshot_keys),
            "forecastRunCount": len(forecasts),
        },
        "coverage": {
            "uniqueObservations": len(truth),
            "pairedObservations": len(paired_observations),
            "unpairedObservations": max(0, len(truth) - len(paired_observations)),
            "pairCount": len(pairs),
            "pairedCount": sum(pair.get("pairStatus") == "paired" for pair in pairs),
            "pending3dCount": pending,
            "uncoveredCount": uncovered,
            "frozenVerificationPairs": exact,
            "savedSurfaceGridPairs": fallback,
            "stations": len({pair["station"] for pair in pairs}),
            "leadHours": sorted({pair["leadHour"] for pair in pairs}),
        },
        "primaryPairs": pairs,
        "warning": "Private research evidence only; never a runtime map or forecast correction input.",
    }


def preflight_range(s3, start, end, summary_stream=None):
    """Validate an inclusive UTC-date range without writing any artifact."""
    if end < start or (end - start).days > 30:
        raise ValueError("preflight date range must be ordered and no longer than 31 days")
    rows = []
    total_records = 0
    total_invalid = 0
    violations = {}
    target = start
    while target <= end:
        evidence = collect(s3, target)
        digest = hashlib.sha256(_json_bytes(evidence)).hexdigest()
        records = scorecard.records_from_evidence(evidence, "preflight", digest)
        validation = scorecard_schema.validate_records(records)
        coverage = evidence["coverage"]
        row = {
            "date": target.isoformat(),
            "records": len(records),
            "stations": coverage["stations"],
            "paired": coverage["pairedCount"],
            "pending_3d": coverage["pending3dCount"],
            "uncovered": coverage["uncoveredCount"],
            "invalid_rows": validation["invalidRows"],
            "violations": validation["violations"],
        }
        rows.append(row)
        total_records += row["records"]
        total_invalid += row["invalid_rows"]
        for code, count in row["violations"].items():
            violations[code] = violations.get(code, 0) + count
        print("Scorecard preflight " + json.dumps(row, sort_keys=True, separators=(",", ":")))
        target += timedelta(days=1)

    aggregate = {
        "dates": len(rows), "records": total_records, "invalid_rows": total_invalid,
        "violations": dict(sorted(violations.items())),
    }
    print("Scorecard preflight total " + json.dumps(aggregate, sort_keys=True, separators=(",", ":")))
    if summary_stream is not None:
        summary_stream.write("## Private scorecard schema preflight\n\n")
        summary_stream.write("| UTC date | Rows | Stations | Paired | Pending 3D | Uncovered | Invalid |\n")
        summary_stream.write("|---|---:|---:|---:|---:|---:|---:|\n")
        for row in rows:
            summary_stream.write(
                f"| {row['date']} | {row['records']} | {row['stations']} | {row['paired']} | "
                f"{row['pending_3d']} | {row['uncovered']} | {row['invalid_rows']} |\n"
            )
        summary_stream.write(
            f"\n**Total:** {total_records} rows; {total_invalid} invalid rows.\n\n"
            f"**Violation summary:** `{json.dumps(aggregate['violations'], sort_keys=True)}`\n"
        )
    return aggregate


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", help="UTC date to score (default: yesterday)")
    parser.add_argument("--upload", action="store_true", help="write immutable private R2 evidence")
    parser.add_argument("--sync", action="store_true", help="best-effort private Supabase projection")
    parser.add_argument("--out", type=Path, help="write local evidence for a dry run")
    parser.add_argument("--env-file")
    parser.add_argument("--preflight-start", help="inclusive UTC date for read-only range preflight")
    parser.add_argument("--preflight-end", help="inclusive UTC date for read-only range preflight")
    parser.add_argument("--expected-records", type=int,
                        help="require this exact candidate and committed row count")
    args = parser.parse_args(argv)
    verify.load_env_file(args.env_file)

    if bool(args.preflight_start) != bool(args.preflight_end):
        parser.error("--preflight-start and --preflight-end must be supplied together")
    if args.preflight_start and (args.upload or args.sync or args.out):
        parser.error("range preflight cannot upload, sync, or write an output file")

    enabled = os.environ.get("LAKE_MAP_SCORECARD_ENABLED", "").strip().lower() == "true"
    if (args.upload or args.sync) and not enabled:
        print("Scorecard job: disabled by kill switch (0 records)")
        return 0
    if not all(os.environ.get(key) for key in verify.ENV_KEYS[:3]):
        raise SystemExit("R2 credentials are required (values are never printed)")

    target = date.fromisoformat(args.date) if args.date else (datetime.now(timezone.utc) - timedelta(days=1)).date()
    s3 = store.client()
    if args.preflight_start:
        try:
            start = date.fromisoformat(args.preflight_start)
            end = date.fromisoformat(args.preflight_end)
            summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
            if summary_path:
                with open(summary_path, "a", encoding="utf-8") as summary:
                    result = preflight_range(s3, start, end, summary)
            else:
                result = preflight_range(s3, start, end)
        except ValueError as error:
            print(f"Scorecard preflight rejected: {error}", file=sys.stderr)
            return 2
        return 2 if result["invalid_rows"] else 0
    evidence = collect(s3, target)
    body = _json_bytes(evidence)
    digest = hashlib.sha256(body).hexdigest()
    records = scorecard.records_from_evidence(evidence, "preflight", digest)
    preflight = scorecard_schema.validate_records(records)
    if preflight["invalidRows"]:
        print(f"Scorecard job {target}: invalid, 0 records; {preflight['invalidRows']} invalid rows, "
              f"constraints={json.dumps(preflight['violations'], sort_keys=True)}")
        return 2
    if args.expected_records is not None and len(records) != args.expected_records:
        print(f"Scorecard job {target}: count_mismatch, expected={args.expected_records}, "
              f"candidate={len(records)}, 0 records written")
        return 2
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    key = f"validation/scorecard/evidence/v1/{target:%Y/%m/%d}/{stamp}-{digest[:12]}.json"
    if args.out:
        args.out.write_bytes(body + b"\n")
    if args.upload:
        store.put(s3, key, body, store.IMMUTABLE)
    if not args.sync:
        result = {"status": "dry_run", "recordCount": len(records), "invalidRows": 0}
    else:
        progress_key = f"{PROGRESS_PREFIX}/{target.isoformat()}.json"
        record_set_sha256 = _record_set_digest(records)
        resume_batch = _resume_batch(s3, progress_key, record_set_sha256, len(records))
        progress = _progress_writer(s3, progress_key, target, record_set_sha256, len(records))
        result = scorecard.sync_evidence(
            evidence, key, digest, resume_batch=resume_batch, progress_callback=progress,
        )
    coverage = evidence["coverage"]
    retry_note = f", retries={result.get('retryCount', 0)}, resumed_batch={result.get('resumedBatch', 0)}"
    failure_note = ""
    if result.get("failureCategory"):
        failure_note = (f", failure_category={result['failureCategory']}, "
                        f"batch_index={result.get('batchIndex')}")
    if (args.expected_records is not None and
            (result.get("status") != "committed" or result.get("recordCount") != args.expected_records)):
        result["status"] = "count_mismatch"
    print(f"Scorecard job {target}: {result['status']}, {result.get('recordCount', 0)} records; "
          f"{coverage['stations']} stations, {coverage['frozenVerificationPairs']} frozen-site pairs, "
          f"{coverage['savedSurfaceGridPairs']} saved-grid fallback pairs, "
          f"{preflight['invalidRows']} constraint violations{retry_note}{failure_note}")
    return 2 if args.sync and result["status"] not in ("committed", "disabled") else 0


if __name__ == "__main__":
    raise SystemExit(main())
