#!/usr/bin/env python3
"""Write the immutable quality override for unvalidated add-on field samples."""
from __future__ import annotations

import json
import os
import subprocess
from datetime import datetime, timezone

from lakemap import store

KEY = ("private/scorecard/v1/overrides/v1/stream=backfill_addon/"
       "addon_v1-field-node-45209.json")


def revision() -> str:
    if os.environ.get("GITHUB_SHA"):
        return os.environ["GITHUB_SHA"]
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "HEAD"], text=True, stderr=subprocess.DEVNULL,
        ).strip()
    except Exception:
        return "unknown"


def manifest(code_version: str, created_at: str) -> dict:
    return {
        "formatVersion": 1,
        "stream": "backfill_addon",
        "streamVersion": "addon_v1",
        "predicate": {
            "station_id": "external:45209",
            "sample_method": "field_node",
        },
        "set": {"strict_quality": False},
        "addQualityFlags": ["sampler_unvalidated"],
        "reason": "field sampler had not passed station-file equivalence gate",
        "codeVersion": code_version,
        "createdAt": created_at,
    }


def main():
    bucket = store.bucket()
    if bucket in {"", "piercast-lake-map"}:
        raise SystemExit("refusing unset or production map bucket")
    payload = manifest(
        revision(), datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    )
    body = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode()
    s3 = store.client()
    s3.put_object(
        Bucket=bucket, Key=KEY, Body=body,
        ContentType="application/json", CacheControl="private, no-store",
    )
    readback = s3.get_object(Bucket=bucket, Key=KEY)["Body"].read()
    if readback != body:
        raise RuntimeError("override readback verification failed")
    print(json.dumps({"status": "verified", "key": KEY}, sort_keys=True))


if __name__ == "__main__":
    main()
