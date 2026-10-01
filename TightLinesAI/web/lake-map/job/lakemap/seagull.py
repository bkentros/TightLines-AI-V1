"""Snapshot GLOS Seagull's documented model-summary forecast for comparison.

This is deliberately a validation-only adapter.  The endpoint returns a
summary over the NWS marine forecast zone selected for a point, while
PierCast samples a model cell near a pier.  The two spatial supports are not
interchangeable, so callers must retain the ``comparisonClass`` warning and
must not use these values to alter the production forecast.
"""
from __future__ import annotations

import json
import math
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from urllib.parse import urlencode

from . import net

MODEL_SUMMARY_URL = "https://seagull-api.glos.org/api/v1/model-data-latest-summaries"
MAX_WORKERS = 4
EXPECTED_MAX_HOURS = 121


def _iso(value: datetime) -> str:
    return value.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _parse_timestamp(value):
    if not isinstance(value, str):
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)
    except ValueError:
        return None


def parse_summary(payload):
    """Return the bounded temperature series from one official API response."""
    timestamps = payload.get("timestamps") if isinstance(payload, dict) else None
    temperatures = payload.get("water_temperature") if isinstance(payload, dict) else None
    if not isinstance(timestamps, list) or not isinstance(temperatures, list):
        raise ValueError("missing timestamps or water_temperature")
    if not timestamps or len(timestamps) != len(temperatures) or len(timestamps) > EXPECTED_MAX_HOURS:
        raise ValueError("unsafe Seagull model-summary series length")

    rows = []
    last = None
    for timestamp, temperature in zip(timestamps, temperatures):
        valid = _parse_timestamp(timestamp)
        if valid is None or (last is not None and valid <= last):
            raise ValueError("invalid or unordered Seagull timestamps")
        if not isinstance(temperature, dict):
            raise ValueError("invalid Seagull temperature summary")
        values = [temperature.get(key) for key in ("min", "mean", "max")]
        if not all(isinstance(value, (int, float)) and math.isfinite(value) for value in values):
            raise ValueError("non-finite Seagull temperature summary")
        minimum, mean, maximum = map(float, values)
        # The documented endpoint currently returns degrees Celsius.  Keep a
        # deliberately broad physical envelope and reject a unit/schema shift.
        if not (-2 <= minimum <= mean <= maximum <= 40):
            raise ValueError("Seagull water temperature is outside the Celsius contract")
        rows.append({"validTime": _iso(valid), "minC": round(minimum, 4),
                     "meanC": round(mean, 4), "maxC": round(maximum, 4)})
        last = valid

    models = payload.get("nearby_models")
    if not isinstance(models, list) or not all(isinstance(value, str) for value in models):
        models = []
    return {"models": sorted(set(models)), "hours": rows}


def fetch_site(site):
    geometry = json.dumps({"type": "Point", "coordinates": [site["lon"], site["lat"]]}, separators=(",", ":"))
    url = f"{MODEL_SUMMARY_URL}?{urlencode({'geo': geometry})}"
    payload = json.loads(net.fetch(url, timeout=20, retries=2))
    return parse_summary(payload)


def capture(piers, captured_at, log, workers=MAX_WORKERS):
    """Capture independent as-served Seagull summaries; individual failures are nonfatal."""
    requested_at = captured_at
    sites, failures = {}, []
    with ThreadPoolExecutor(max_workers=max(1, min(workers, MAX_WORKERS))) as pool:
        futures = {pool.submit(fetch_site, pier): pier for pier in piers}
        for future in as_completed(futures):
            pier = futures[future]
            try:
                result = future.result()
                sites[pier["id"]] = {
                    "name": pier.get("name"), "state": pier.get("state"),
                    "lat": pier["lat"], "lon": pier["lon"], **result,
                }
            except Exception as err:  # benchmark loss must never block the live map
                failures.append(pier["id"])
                log(f"Seagull benchmark {pier['id']} unavailable ({net.redact(err)})")
    log(f"Seagull benchmark: captured {len(sites)}/{len(piers)} pier-zone summaries")
    return {
        "formatVersion": 1,
        "source": "GLOS Seagull documented model-data-latest-summaries API",
        "sourceUrl": MODEL_SUMMARY_URL,
        "requestedAt": _iso(requested_at),
        # Availability starts only after every response has completed. Using
        # request start here would give the benchmark artificial hindsight.
        "capturedAt": _iso(datetime.now(timezone.utc)),
        "unit": "C",
        "value": "mean",
        "spatialSupport": "NWS marine forecast-zone summary selected by pier point",
        "comparisonClass": "context-only-spatial-support-differs",
        "correctionApproved": False,
        "sitesRequested": len(piers),
        "sitesCaptured": len(sites),
        "failedSiteIds": sorted(failures),
        "sites": dict(sorted(sites.items())),
    }
