"""Cloudflare R2 (S3-compatible) upload for finished runs.

Layout in the bucket:
  latest.json                    → which run the app should load (short cache)
  runs/<runId>/manifest.json …   → one complete run (immutable, long cache)
  static/geo-v1.json             → shoreline, land and borders (long cache)
Only the newest KEEP_RUNS runs are kept.
"""
from __future__ import annotations

import gzip
import json
import mimetypes
import os
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

KEEP_RUNS = 2
IMMUTABLE = "public, max-age=31536000, immutable"
SHORT = "public, max-age=120"


def endpoint() -> str:
    raw = os.environ["R2_ACCOUNT_ID"].strip().strip('"\'')
    if raw.startswith("http"):
        return raw.rstrip("/")
    acct = raw.split(".")[0]
    return f"https://{acct}.r2.cloudflarestorage.com"


def client():
    import boto3
    from botocore.config import Config

    return boto3.client(
        "s3",
        endpoint_url=endpoint(),
        aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
        region_name="auto",
        config=Config(retries={"max_attempts": 5, "mode": "standard"}, max_pool_connections=32),
    )


def bucket() -> str:
    return os.environ.get("R2_BUCKET", "piercast-lake-map")


def put(s3, key: str, body: bytes, cache: str):
    kind = mimetypes.guess_type(key)[0] or "application/octet-stream"
    extra = {}
    if key.endswith(".json"):
        body = gzip.compress(body, 9)
        extra["ContentEncoding"] = "gzip"
        kind = "application/json"
    s3.put_object(Bucket=bucket(), Key=key, Body=body, ContentType=kind, CacheControl=cache, **extra)


def read_latest(s3):
    try:
        obj = s3.get_object(Bucket=bucket(), Key="latest.json")
        body = obj["Body"].read()
        if obj.get("ContentEncoding") == "gzip" or body[:2] == b"\x1f\x8b":
            body = gzip.decompress(body)
        return json.loads(body)
    except Exception:
        return None


def ensure_static(s3, geo_path: Path, geo_key: str):
    try:
        s3.head_object(Bucket=bucket(), Key=geo_key)
    except Exception:
        put(s3, geo_key, geo_path.read_bytes(), IMMUTABLE)


def upload_run(s3, run_dir: Path, run_id: str, latest: dict):
    files = [p for p in run_dir.rglob("*") if p.is_file()]

    def one(p):
        put(s3, f"runs/{run_id}/{p.relative_to(run_dir).as_posix()}", p.read_bytes(), IMMUTABLE)
    with ThreadPoolExecutor(16) as pool:
        list(pool.map(one, files))
    # switch the app over only after every file of the run is in place
    put(s3, "latest.json", json.dumps(latest).encode(), SHORT)
    prune(s3, keep={run_id})


def prune(s3, keep: set):
    runs = set()
    for page in s3.get_paginator("list_objects_v2").paginate(Bucket=bucket(), Prefix="runs/", Delimiter="/"):
        for p in page.get("CommonPrefixes", []):
            runs.add(p["Prefix"].split("/")[1])
    old = sorted(runs - keep)[: max(0, len(runs) - KEEP_RUNS)]
    for run in old:
        keys = []
        for page in s3.get_paginator("list_objects_v2").paginate(Bucket=bucket(), Prefix=f"runs/{run}/"):
            keys += [{"Key": o["Key"]} for o in page.get("Contents", [])]
        for i in range(0, len(keys), 1000):
            s3.delete_objects(Bucket=bucket(), Delete={"Objects": keys[i:i + 1000], "Quiet": True})
    return old
