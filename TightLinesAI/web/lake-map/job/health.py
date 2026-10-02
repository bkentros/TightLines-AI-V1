"""PierCast production health check (run by .github/workflows/piercast-health.yml).

Fails (exit 1) when any user-facing data is stale or down, so GitHub emails the
repo owner. Checks:
  - PierCast standings answer 200 and are built from a NOAA cycle issued within
    13 hours (older means the public 24-hour fallback is serving users)
  - the Live Lake Map's published run (R2 latest.json) is recent
  - the live buoy/sensor archive (R2 observations/latest.json) is updating
Never prints keys. Read-only.
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

SUPABASE_URL = "https://hsesngprhpgajyfbrwbf.supabase.co"
PIERCAST_FRESH_HOURS = 13       # the public freshness standard (pier-cast/index.ts)
MAP_RUN_MAX_HOURS = 13          # NOAA cycles every 6 h; one missed cycle plus publishing time
OBSERVATIONS_MAX_MINUTES = 45   # the gatekeeper collects every 15 minutes


def hours_since(iso: str | None, now: datetime) -> float | None:
    try:
        t = datetime.fromisoformat(str(iso).replace("Z", "+00:00"))
    except (TypeError, ValueError):
        return None
    return (now - t).total_seconds() / 3600


def evaluate(now: datetime, piercast_status: int | None, piercast_body: str,
             map_latest: dict | None, observations: dict | None) -> list[str]:
    """Problems found (empty = healthy). Pure function, unit-tested."""
    problems: list[str] = []
    if piercast_status != 200:
        problems.append(f"PierCast standings returned HTTP {piercast_status} (users see 'PierCast could not load').")
    else:
        issued = re.findall(r'"(?:sourceIssuedAt|issuedAt)"\s*:\s*"([^"]+)"', piercast_body)
        ages = [a for a in (hours_since(i, now) for i in issued) if a is not None]
        if not ages:
            problems.append("PierCast standings carry no NOAA issue time.")
        elif min(ages) > PIERCAST_FRESH_HOURS:
            problems.append(f"PierCast is serving a NOAA cycle {min(ages):.1f} h old (24 h fallback active): "
                            "an ingest cohort missed its cycle; check pier-cast-ingest responses in net._http_response.")
    if not map_latest:
        problems.append("Live Lake Map latest.json is missing or unreadable in R2.")
    else:
        age = hours_since(map_latest.get("generatedAt"), now)
        if age is None or age > MAP_RUN_MAX_HOURS:
            problems.append(f"Live Lake Map run is {'unknown' if age is None else f'{age:.1f} h'} old "
                            f"(run {map_latest.get('run')}); check the 'Lake map data' workflow.")
    if not observations:
        problems.append("Buoy observation archive (observations/latest.json) is missing in R2.")
    else:
        age = hours_since(observations.get("scheduledFor") or observations.get("generatedAt"), now)
        if age is None or age * 60 > OBSERVATIONS_MAX_MINUTES:
            problems.append(f"Buoy observations are {'of unknown age' if age is None else f'{age * 60:.0f} min old'}; "
                            "check the gatekeeper Worker's scheduled collector.")
    return problems


def fetch_piercast(anon_key: str) -> tuple[int | None, str]:
    req = urllib.request.Request(f"{SUPABASE_URL}/functions/v1/pier-cast/conditions/leaderboard",
                                 headers={"apikey": anon_key, "Authorization": f"Bearer {anon_key}",
                                          "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            return res.status, res.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as err:
        return err.code, ""
    except Exception:
        return None, ""


def main() -> int:
    anon_key = os.environ.get("SUPABASE_ANON_KEY", "").strip()
    if not anon_key:
        print("SUPABASE_ANON_KEY is not set for the health check.")
        return 1
    from lakemap import store
    s3 = store.client()
    now = datetime.now(timezone.utc)
    status, body = fetch_piercast(anon_key)
    problems = evaluate(now, status, body, store.read_latest(s3), store.read_json(s3, "observations/latest.json"))
    if problems:
        print("PierCast health check FAILED:")
        for p in problems:
            print(" -", p)
        return 1
    print(f"PierCast health OK at {now:%Y-%m-%d %H:%MZ}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
