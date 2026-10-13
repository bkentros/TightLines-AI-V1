#!/usr/bin/env python3
"""Verify newly published mutable pointers through the production gatekeeper."""
from __future__ import annotations

import argparse
import base64
import gzip
import hashlib
import hmac
import json
import os
import re
import secrets
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

BASE_URL = "https://map.finfindr.app"
POINTER_CACHE_SECONDS = 60


def make_pass(secret: str, now: int | None = None) -> str:
    encode = lambda raw: base64.urlsafe_b64encode(raw).decode().rstrip("=")
    payload = f"v1.{(now or int(time.time())) + 600}.{encode(secrets.token_bytes(12))}"
    signature = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).digest()
    return f"{payload}.{encode(signature)}"


def pop_from_ray(value: str | None) -> str:
    match = re.search(r"-([A-Z]{3})$", value or "")
    return match.group(1) if match else "unknown"


def pointer_cache_is_safe(value: str | None) -> bool:
    policy = (value or "").lower()
    if "immutable" in policy:
        return False
    if "no-store" in policy:
        return True
    match = re.search(r"(?:^|,)\s*max-age=(\d+)\b", policy)
    return bool(match and int(match.group(1)) <= POINTER_CACHE_SECONDS and "must-revalidate" in policy)


def fetch_pointer(url: str) -> dict:
    request = urllib.request.Request(url, headers={"User-Agent": "FinFindr-Delivery-Check/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        raw = response.read()
        if response.headers.get("Content-Encoding") == "gzip" or raw[:2] == b"\x1f\x8b":
            raw = gzip.decompress(raw)
        payload = json.loads(raw)
        return {
            "status": response.status,
            "run": payload.get("run"),
            "cacheControl": response.headers.get("Cache-Control"),
            "cfCacheStatus": response.headers.get("CF-Cache-Status"),
            "age": response.headers.get("Age"),
            "pop": pop_from_ray(response.headers.get("CF-Ray")),
        }


def verify(expected_run: str, secret: str, timeout_seconds: int = 120,
           interval_seconds: int = 5, min_pops: int = 2) -> dict:
    token = make_pass(secret)
    urls = {
        "surface": f"{BASE_URL}/latest.json?t={urllib.parse.quote(token, safe='')}",
        "depth": (f"{BASE_URL}/runs/tdepth/latest.json?surface="
                  f"{urllib.parse.quote(expected_run, safe='')}&t={urllib.parse.quote(token, safe='')}"),
    }
    deadline = time.monotonic() + timeout_seconds
    valid_pops = {name: set() for name in urls}
    latest = {}
    errors = []
    while True:
        for name, url in urls.items():
            try:
                result = fetch_pointer(url)
                latest[name] = result
                valid = (result["status"] == 200 and result["run"] == expected_run
                         and pointer_cache_is_safe(result["cacheControl"]))
                if valid:
                    valid_pops[name].add(result["pop"])
                print("Delivery probe " + json.dumps({"pointer": name, **result, "valid": valid}, sort_keys=True))
            except Exception as error:
                detail = f"HTTP {error.code}" if isinstance(error, urllib.error.HTTPError) else type(error).__name__
                errors.append(f"{name}: {detail}")
                print(f"Delivery probe {name} failed: {detail}")
        all_valid = all(
            latest.get(name, {}).get("status") == 200
            and latest.get(name, {}).get("run") == expected_run
            and pointer_cache_is_safe(latest.get(name, {}).get("cacheControl"))
            for name in urls
        )
        enough_pops = all(len(pops - {"unknown"}) >= min_pops for pops in valid_pops.values())
        if all_valid and enough_pops:
            break
        if time.monotonic() >= deadline:
            if not all_valid:
                raise RuntimeError(
                    f"public pointers did not converge to {expected_run} within {timeout_seconds}s: "
                    + json.dumps(latest, sort_keys=True)
                )
            print("Delivery warning: fewer than two distinct Cloudflare POPs were reachable from this runner")
            break
        time.sleep(interval_seconds)
    summary = {
        "run": expected_run,
        "pops": {name: sorted(pops) for name, pops in valid_pops.items()},
        "latest": latest,
        "errors": errors,
    }
    print("Delivery verified " + json.dumps(summary, sort_keys=True))
    return summary


def main(argv=None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run", required=True)
    parser.add_argument("--timeout", type=int, default=120)
    args = parser.parse_args(argv)
    if not re.fullmatch(r"[A-Za-z0-9._-]+", args.run):
        raise SystemExit("invalid expected run id")
    secret = os.environ.get("PIER_CAST_MAP_PASS_SECRET")
    if not secret:
        raise SystemExit("PIER_CAST_MAP_PASS_SECRET is required")
    try:
        verify(args.run, secret, timeout_seconds=args.timeout)
    except Exception as error:
        print(f"Delivery verification failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
