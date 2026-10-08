#!/usr/bin/env python3
"""Create one R2 S3 credential scoped only to the lake-map staging bucket.

Uses the owner's existing Cloudflare global API-key login, writes the derived
S3 values only to the git-ignored TightLinesAI/.env, and never prints secrets.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ACCOUNT_ID = "fe7a8d144a9b29b73dd513830858774c"
BUCKET = "piercast-lake-map-staging"
HERE = Path(__file__).resolve().parent
APP_ENV = HERE.parents[2] / ".env"
GATE_ENV = HERE / ".env"
API = "https://api.cloudflare.com/client/v4"


def read_value(path: Path, name: str):
    for line in path.read_text(errors="replace").splitlines():
        match = re.match(rf"^\s*(?:export\s+)?{re.escape(name)}\s*[=:]\s*['\"]?([^'\"\s]+)", line)
        if match:
            return match.group(1)
    return None


def request(path, email, api_key, method="GET", payload=None):
    body = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(API + path, data=body, method=method, headers={
        "Content-Type": "application/json",
        "X-Auth-Email": email,
        "X-Auth-Key": api_key,
    })
    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            result = json.loads(response.read())
    except urllib.error.HTTPError as err:
        raise RuntimeError(f"Cloudflare API returned HTTP {err.code} for {path.split('?')[0]}") from None
    if not result.get("success"):
        codes = [item.get("code") for item in result.get("errors", [])]
        raise RuntimeError(f"Cloudflare API rejected the request (codes {codes})")
    return result.get("result")


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--inspect", action="store_true")
    parser.add_argument("--cleanup", action="store_true", help="remove superseded staging account tokens")
    parser.add_argument("--replace", action="store_true")
    args = parser.parse_args(argv)
    existing = {name: read_value(APP_ENV, name) for name in
                ("R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET")}
    email = read_value(GATE_ENV, "CLOUDFLARE_EMAIL")
    api_key = read_value(APP_ENV, "CLOUDFLARE_API_KEY")
    if not email or not api_key:
        raise RuntimeError("Cloudflare global-key login is incomplete")
    if args.inspect or args.cleanup:
        if not existing["R2_ACCESS_KEY_ID"]:
            raise RuntimeError("no local staging token id exists")
        tokens = request(f"/accounts/{ACCOUNT_ID}/tokens", email, api_key)
        token = next((item for item in tokens if item.get("id") == existing["R2_ACCESS_KEY_ID"]), None)
        if token is None:
            raise RuntimeError("local staging token is not present in the Cloudflare account token list")
        if args.cleanup:
            obsolete = [item for item in tokens if item.get("name") == "PierCast lake map staging R2"
                        and item.get("id") != existing["R2_ACCESS_KEY_ID"]]
            for item in obsolete:
                request(f"/accounts/{ACCOUNT_ID}/tokens/{item['id']}", email, api_key, method="DELETE")
            print(f"Removed {len(obsolete)} superseded staging account token(s); current credential kept.")
            return 0
        summary = {"name": token.get("name"), "status": token.get("status"),
                   "policies": token.get("policies")}
        print(json.dumps(summary, indent=2))
        return 0
    if all(existing.values()) and not args.replace:
        if existing["R2_ACCOUNT_ID"] != ACCOUNT_ID or existing["R2_BUCKET"] != BUCKET:
            raise RuntimeError("existing R2 credentials are not the expected staging credentials")
        print("Staging-scoped R2 credentials already exist locally; nothing changed.")
        return 0
    query = urllib.parse.urlencode({
        "name": "Workers R2 Storage Bucket Item Write",
        "scope": "com.cloudflare.edge.r2.bucket",
    })
    groups = request(f"/accounts/{ACCOUNT_ID}/tokens/permission_groups?{query}", email, api_key)
    matches = [group for group in groups if group.get("name") == "Workers R2 Storage Bucket Item Write"
               and group.get("is_selectable", True)]
    if len(matches) != 1:
        raise RuntimeError("could not uniquely resolve the bucket-item write permission")
    resource = f"com.cloudflare.edge.r2.bucket.{ACCOUNT_ID}_default_{BUCKET}"
    token = request(f"/accounts/{ACCOUNT_ID}/tokens", email, api_key, method="POST", payload={
        "name": "PierCast lake map staging R2",
        "policies": [{
            "effect": "allow",
            "resources": {resource: "*"},
            "permission_groups": [{"id": matches[0]["id"]}],
        }],
    })
    token_id, token_value = token.get("id"), token.get("value")
    if not token_id or not token_value:
        raise RuntimeError("Cloudflare created a token without S3 credential material")
    secret_access_key = hashlib.sha256(token_value.encode()).hexdigest()
    import boto3
    probe = boto3.client("s3", endpoint_url=f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com",
                         aws_access_key_id=token_id, aws_secret_access_key=secret_access_key,
                         region_name="auto")
    last = None
    for _ in range(6):
        try:
            probe.list_objects_v2(Bucket=BUCKET, MaxKeys=1)
            last = None
            break
        except Exception as err:
            last = err
            time.sleep(5)
    if last is not None:
        raise RuntimeError(f"new staging credential did not become usable ({type(last).__name__})")
    replacements = {"R2_ACCOUNT_ID": ACCOUNT_ID, "R2_ACCESS_KEY_ID": token_id,
                    "R2_SECRET_ACCESS_KEY": secret_access_key, "R2_BUCKET": BUCKET}
    kept = [line for line in APP_ENV.read_text().splitlines()
            if not any(re.match(rf"^\s*(?:export\s+)?{name}\s*[=:]", line) for name in replacements)]
    APP_ENV.write_text("\n".join(kept).rstrip() + "\n\n" +
                       "\n".join(f"{name}={value}" for name, value in replacements.items()) + "\n")
    print("Created staging-bucket-only R2 Object Read & Write credentials in the ignored local .env.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as err:
        sys.exit(str(err))
