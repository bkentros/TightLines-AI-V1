"""PierCast production health check (run by .github/workflows/piercast-health.yml).

Fails (exit 1) when any user-facing data is stale or down, so GitHub emails the
repo owner. Checks:
  - PierCast catalog and two standings answer 200 in under five seconds
  - an authenticated profile, Today's Bite, and one PierCast report work
  - gated Live Lake Map latest.json is reachable
  - standings use a NOAA cycle issued within 13 hours
  - the Live Lake Map's published run (R2 latest.json) is recent
  - the live buoy/sensor archive (R2 observations/latest.json) is updating
Never prints keys. Read-only.
"""
from __future__ import annotations

import base64
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
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

SUPABASE_URL = "https://hsesngprhpgajyfbrwbf.supabase.co"
PIERCAST_FRESH_HOURS = 13       # the public freshness standard (pier-cast/index.ts)
MAP_RUN_MAX_HOURS = 13          # NOAA cycles every 6 h; one missed cycle plus publishing time
OBSERVATIONS_MAX_MINUTES = 45   # the gatekeeper collects every 15 minutes
HTTP_TIMEOUT_SECONDS = 20
PIERCAST_MAX_SECONDS = 5
MAP_URL = "https://map.finfindr.app"


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


def timed_request(url: str, headers: dict[str, str], method: str = "GET",
                  payload: dict | None = None) -> tuple[int | None, str, float]:
    body = None if payload is None else json.dumps(payload).encode()
    if body is not None:
        headers = {**headers, "Content-Type": "application/json"}
    req = urllib.request.Request(url, headers=headers, method=method, data=body)
    started = time.monotonic()
    try:
        with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT_SECONDS) as res:
            return res.status, res.read().decode("utf-8", "replace"), time.monotonic() - started
    except urllib.error.HTTPError as err:
        return err.code, "", time.monotonic() - started
    except Exception:
        return None, "", time.monotonic() - started


def api_headers(anon_key: str, user_token: str | None = None) -> dict[str, str]:
    headers = {"apikey": anon_key, "Authorization": f"Bearer {anon_key}", "Accept": "application/json"}
    if user_token:
        headers["x-user-token"] = user_token
    return headers


def make_map_pass(secret: str) -> str:
    account = base64.urlsafe_b64encode(secrets.token_bytes(12)).decode().rstrip("=")
    payload = f"v1.{int(time.time()) + 600}.{account}"
    signature = base64.urlsafe_b64encode(
        hmac.new(secret.encode(), payload.encode(), hashlib.sha256).digest()
    ).decode().rstrip("=")
    return f"{payload}.{signature}"


def evaluate_synthetics(results: dict[str, tuple[int | None, str, float]]) -> list[str]:
    problems: list[str] = []
    for name in ("PierCast catalog", "PierCast Chinook leaderboard", "PierCast Coho leaderboard"):
        status, _body, seconds = results[name]
        if status != 200:
            problems.append(f"{name} returned HTTP {status}.")
        elif seconds >= PIERCAST_MAX_SECONDS:
            problems.append(f"{name} took {seconds:.2f} s (limit {PIERCAST_MAX_SECONDS} s).")
    status, body, _seconds = results["Live Lake Map latest.json"]
    if status != 200:
        problems.append(f"Live Lake Map latest.json returned HTTP {status} through the gatekeeper.")
    else:
        try:
            latest = json.loads(body)
        except json.JSONDecodeError:
            latest = None
        if not isinstance(latest, dict) or not latest.get("run"):
            problems.append("Live Lake Map latest.json returned invalid JSON through the gatekeeper.")
    return problems


def public_synthetics(
    anon_key: str, map_secret: str
) -> tuple[list[str], tuple[int | None, str, float]]:
    headers = api_headers(anon_key)
    results = {
        "PierCast catalog": timed_request(
            f"{SUPABASE_URL}/functions/v1/pier-cast/conditions/catalog", headers
        ),
        "PierCast Chinook leaderboard": timed_request(
            f"{SUPABASE_URL}/functions/v1/pier-cast/conditions/leaderboard?speciesId=chinook_salmon", headers
        ),
        "PierCast Coho leaderboard": timed_request(
            f"{SUPABASE_URL}/functions/v1/pier-cast/conditions/leaderboard?speciesId=coho_salmon", headers
        ),
    }
    map_pass = make_map_pass(map_secret)
    results["Live Lake Map latest.json"] = timed_request(
        f"{MAP_URL}/latest.json?t={urllib.parse.quote(map_pass)}", {"Accept": "application/json"}
    )
    problems = evaluate_synthetics(results)
    return problems, results["PierCast Chinook leaderboard"]


def authenticated_synthetics(anon_key: str, email: str, password: str) -> list[str]:
    problems: list[str] = []
    status, body, _seconds = timed_request(
        f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
        {"apikey": anon_key, "Accept": "application/json"},
        "POST",
        {"email": email, "password": password},
    )
    try:
        auth = json.loads(body)
    except json.JSONDecodeError:
        auth = {}
    token = auth.get("access_token") if isinstance(auth, dict) else None
    user_id = auth.get("user", {}).get("id") if isinstance(auth, dict) else None
    if status != 200 or not token or not user_id:
        return [f"Synthetic account login returned HTTP {status}."]

    profile_status, profile_body, _ = timed_request(
        f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{urllib.parse.quote(str(user_id))}&select=id,onboarding_complete,subscription_tier",
        {"apikey": anon_key, "Authorization": f"Bearer {token}", "Accept": "application/json"},
    )
    try:
        profiles = json.loads(profile_body)
    except json.JSONDecodeError:
        profiles = []
    profile_ok = (
        profile_status == 200 and isinstance(profiles, list) and len(profiles) == 1
        and profiles[0].get("onboarding_complete") is True
    )
    paid_profile = profile_ok and profiles[0].get("subscription_tier") in ("angler", "master_angler")
    if not profile_ok:
        problems.append(f"Synthetic profile read returned HTTP {profile_status} or an incomplete profile.")
    elif not paid_profile:
        problems.append("Synthetic profile must use an angler tier so report checks remain read-only.")

    bite_status, _body, _ = timed_request(
        f"{SUPABASE_URL}/functions/v1/forecast-scores",
        api_headers(anon_key, token),
        "POST",
        {"latitude": 43.9553, "longitude": -86.4526, "max_day_offset": 3,
         "include_snapshot_env": False},
    )
    if bite_status != 200:
        problems.append(f"Today's Bite synthetic returned HTTP {bite_status}.")

    if paid_profile:
        report_status, _body, _ = timed_request(
            f"{SUPABASE_URL}/functions/v1/pier-cast/conditions/report?cityId=ludington_mi&speciesId=chinook_salmon",
            api_headers(anon_key, token),
        )
        if report_status != 200:
            problems.append(f"PierCast authenticated report synthetic returned HTTP {report_status}.")
    return problems


def main() -> int:
    anon_key = os.environ.get("SUPABASE_ANON_KEY", "").strip()
    map_secret = os.environ.get("PIER_CAST_MAP_PASS_SECRET", "").strip()
    test_email = os.environ.get("HEALTH_TEST_EMAIL", "").strip()
    test_password = os.environ.get("HEALTH_TEST_PASSWORD", "").strip()
    if not all((anon_key, map_secret, test_email, test_password)):
        print("Required health-check secrets are not set.")
        return 1
    from lakemap import store
    s3 = store.client()
    now = datetime.now(timezone.utc)
    synthetic_problems, standings = public_synthetics(anon_key, map_secret)
    problems = evaluate(now, standings[0], standings[1],
                        store.read_latest(s3), store.read_json(s3, "observations/latest.json"))
    problems.extend(synthetic_problems)
    problems.extend(authenticated_synthetics(anon_key, test_email, test_password))
    if problems:
        print("PierCast health check FAILED:")
        for p in problems:
            print(" -", p)
        return 1
    print(f"PierCast health OK at {now:%Y-%m-%d %H:%MZ}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
