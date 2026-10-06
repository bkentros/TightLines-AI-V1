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
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

from lakemap import store

import scorecard
import scorecard_pairing
import scorecard_schema
import verify


def _json_bytes(value):
    return json.dumps(value, separators=(",", ":"), sort_keys=True).encode()


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


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", help="UTC date to score (default: yesterday)")
    parser.add_argument("--upload", action="store_true", help="write immutable private R2 evidence")
    parser.add_argument("--sync", action="store_true", help="best-effort private Supabase projection")
    parser.add_argument("--out", type=Path, help="write local evidence for a dry run")
    parser.add_argument("--env-file")
    args = parser.parse_args(argv)
    verify.load_env_file(args.env_file)

    enabled = os.environ.get("LAKE_MAP_SCORECARD_ENABLED", "").strip().lower() == "true"
    if (args.upload or args.sync) and not enabled:
        print("Scorecard job: disabled by kill switch (0 records)")
        return 0
    if not all(os.environ.get(key) for key in verify.ENV_KEYS[:3]):
        raise SystemExit("R2 credentials are required (values are never printed)")

    target = date.fromisoformat(args.date) if args.date else (datetime.now(timezone.utc) - timedelta(days=1)).date()
    s3 = store.client()
    evidence = collect(s3, target)
    body = _json_bytes(evidence)
    digest = hashlib.sha256(body).hexdigest()
    records = scorecard.records_from_evidence(evidence, "preflight", digest)
    preflight = scorecard_schema.validate_records(records)
    if preflight["invalidRows"]:
        print(f"Scorecard job {target}: invalid, 0 records; {preflight['invalidRows']} invalid rows, "
              f"constraints={json.dumps(preflight['violations'], sort_keys=True)}")
        return 2
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    key = f"validation/scorecard/evidence/v1/{target:%Y/%m/%d}/{stamp}-{digest[:12]}.json"
    if args.out:
        args.out.write_bytes(body + b"\n")
    if args.upload:
        store.put(s3, key, body, store.IMMUTABLE)
    result = ({"status": "dry_run", "recordCount": len(records), "invalidRows": 0}
              if not args.sync else scorecard.sync_evidence(evidence, key, digest))
    coverage = evidence["coverage"]
    print(f"Scorecard job {target}: {result['status']}, {result.get('recordCount', 0)} records; "
          f"{coverage['stations']} stations, {coverage['frozenVerificationPairs']} frozen-site pairs, "
          f"{coverage['savedSurfaceGridPairs']} saved-grid fallback pairs, "
          f"{preflight['invalidRows']} constraint violations")
    return 2 if args.sync and result["status"] not in ("committed", "disabled") else 0


if __name__ == "__main__":
    raise SystemExit(main())
