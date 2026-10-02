#!/usr/bin/env python3
"""Copy the current immutable production surface run into isolated staging.

Production is read only through its authenticated gatekeeper. Every S3 write
uses a credential scoped to ``piercast-lake-map-staging`` and ``latest.json``
is written last.
"""
from __future__ import annotations

import argparse
import base64
import gzip
import hashlib
import hmac
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import secrets
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build import ENV_KEYS, Log, load_env_file  # noqa: E402
from lakemap import store  # noqa: E402

STAGING_BUCKET = "piercast-lake-map-staging"
SOURCE_BASE = "https://map.finfindr.app"


def read_value(path: Path, name: str):
    for line in path.read_text(errors="replace").splitlines():
        match = re.match(rf"^\s*(?:export\s+)?{re.escape(name)}\s*[=:]\s*['\"]?([^'\"\s]+)", line)
        if match:
            return match.group(1)
    return None


def make_pass(secret):
    b64u = lambda raw: base64.urlsafe_b64encode(raw).decode().rstrip("=")
    payload = f"v1.{int(time.time() + 2 * 3600)}.{b64u(secrets.token_bytes(12))}"
    signature = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).digest()
    return f"{payload}.{b64u(signature)}"


def fetch_source(key, secret):
    url = f"{SOURCE_BASE}/{urllib.parse.quote(key, safe='/')}?t={urllib.parse.quote(secret, safe='')}"
    request = urllib.request.Request(url, headers={"User-Agent": "PierCast-Staging-Copy/1.0 (+https://finfindr.app)"})
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            body = response.read()
            encoding = response.headers.get("Content-Encoding")
    except Exception as err:
        status = getattr(err, "code", None)
        detail = f"HTTP {status}" if status else type(err).__name__
        raise RuntimeError(f"production read failed for {key} ({detail})") from None
    if encoding == "gzip" or body[:2] == b"\x1f\x8b":
        body = gzip.decompress(body)
    return body


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--env-file", required=True)
    args = parser.parse_args(argv)
    log = Log()
    load_env_file(Path(args.env_file), log)
    if not all(os.environ.get(key) for key in ENV_KEYS[:3]):
        log("R2 credentials are missing — refusing to copy.")
        return 2
    s3 = store.client()
    if store.bucket() != STAGING_BUCKET:
        raise RuntimeError(f"R2_BUCKET must be exactly {STAGING_BUCKET}")
    # Bucket-item credentials intentionally cannot call HeadBucket (an admin
    # operation); a one-key listing verifies the scoped object permission.
    s3.list_objects_v2(Bucket=STAGING_BUCKET, MaxKeys=1)
    signing_secret = read_value(Path(args.env_file), "PIER_CAST_MAP_PASS_SECRET")
    if not signing_secret:
        raise RuntimeError("production read-only map pass secret is missing")
    pass_secret = make_pass(signing_secret)
    latest_body = fetch_source("latest.json", pass_secret)
    latest = json.loads(latest_body)
    run = latest.get("run") if isinstance(latest, dict) else None
    base = latest.get("base") if isinstance(latest, dict) else None
    if not isinstance(run, str) or not re.fullmatch(r"[A-Za-z0-9._-]+", run) or base != f"runs/{run}/":
        raise RuntimeError("production latest.json has an unsafe run/base")
    manifest_body = fetch_source(base + "manifest.json", pass_secret)
    manifest = json.loads(manifest_body)
    keys = {base + "manifest.json", base + "series.json"}
    for frame in manifest.get("frames", []):
        for kind in ("temp", "wind", "waves"):
            value = frame.get(kind)
            if isinstance(value, str) and re.fullmatch(r"[\w./-]+", value) and ".." not in value:
                keys.add(base + value)
    for field in ("depth", "events", "verification"):
        value = manifest.get(field)
        if isinstance(value, str) and re.fullmatch(r"[\w./-]+", value) and ".." not in value:
            keys.add(base + value)
    if len(keys) < 360:
        raise RuntimeError("production surface manifest did not enumerate a complete run")
    for key in keys:
        body = manifest_body if key == base + "manifest.json" else fetch_source(key, pass_secret)
        store.put(s3, key, body, store.IMMUTABLE)
    store.put(s3, "static/geo-v1.json", fetch_source("static/geo-v1.json", pass_secret), store.IMMUTABLE)
    store.put(s3, "latest.json", latest_body, store.SHORT)
    log(f"Copied surface run {run}: {len(keys)} immutable objects plus geo and latest into staging")
    log("Production bucket was read only")
    return 0


if __name__ == "__main__":
    sys.exit(main())
