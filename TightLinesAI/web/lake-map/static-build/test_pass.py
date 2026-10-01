#!/usr/bin/env python3
"""Prints a 24-hour browser link to the gated Live Lake Map, for testing on a
phone without the app. Needs PIER_CAST_MAP_PASS_SECRET in TightLinesAI/.env
(gate/setup.sh puts it there). The link works for anyone who has it until it
expires, so don't post it publicly.

  python3 static-build/test_pass.py
"""
import base64
import hashlib
import hmac
import os
import re
import secrets
import sys
import time
from pathlib import Path

ENV = Path(__file__).resolve().parents[3] / ".env"
BASE = os.environ.get("PIER_CAST_LIVE_MAP_URL", "https://map.finfindr.app")


def b64u(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def read_secret() -> str:
    if os.environ.get("PIER_CAST_MAP_PASS_SECRET"):
        return os.environ["PIER_CAST_MAP_PASS_SECRET"]
    if ENV.exists():
        for line in ENV.read_text(errors="replace").splitlines():
            m = re.match(r"^\s*(?:export\s+)?PIER_CAST_MAP_PASS_SECRET\s*[=:]\s*['\"]?([^'\"\s]+)", line)
            if m:
                return m.group(1)
    sys.exit("PIER_CAST_MAP_PASS_SECRET not found in .env — run web/lake-map/gate/setup.sh first.")


def make_pass(secret: str, hours: float = 24) -> str:
    payload = f"v1.{int(time.time() + hours * 3600)}.{b64u(secrets.token_bytes(12))}"
    sig = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).digest()
    return f"{payload}.{b64u(sig)}"


if __name__ == "__main__":
    print(f"{BASE}/map/index.html?t={make_pass(read_secret())}")
