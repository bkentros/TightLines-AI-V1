"""Wind from Open-Meteo on the map's 0.25° grid, hourly, as u/v in mph."""
from __future__ import annotations

import json
import math
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from urllib.parse import urlencode

import numpy as np

from . import net
from .config import (OPEN_METEO_BATCH, OPEN_METEO_BUDGET_DAYS, OPEN_METEO_CUSTOMER,
                     OPEN_METEO_FREE, OPEN_METEO_MAX_RUNS_PER_DAY,
                     OPEN_METEO_MONTHLY_CALL_BUDGET, WIND_LAKES as WIND)
from .regrid import grid_coords


def points():
    lon, lat = grid_coords(WIND)
    return lat.ravel(), lon.ravel()


def request_url(lats, lons, start: datetime, hours: int, api_key: str | None) -> str:
    q = {
        "latitude": ",".join(f"{v:.2f}" for v in lats),
        "longitude": ",".join(f"{v:.2f}" for v in lons),
        "hourly": "wind_speed_10m,wind_direction_10m",
        "wind_speed_unit": "mph",
        "timezone": "GMT",
        "models": "best_match",
        "start_hour": start.strftime("%Y-%m-%dT%H:%M"),
        "end_hour": (start + timedelta(hours=hours - 1)).strftime("%Y-%m-%dT%H:%M"),
    }
    if api_key:
        q["apikey"] = api_key
    return f"{OPEN_METEO_CUSTOMER if api_key else OPEN_METEO_FREE}?{urlencode(q)}"


def fetch(start: datetime, hours: int, api_key: str | None, workers=None):
    """u, v arrays shaped (hours, height, width) in mph toward east / north, and the call count."""
    projected = projected_monthly_calls()
    if projected > OPEN_METEO_MONTHLY_CALL_BUDGET:
        raise RuntimeError(
            f"Open-Meteo projection {projected:,} exceeds the configured "
            f"{OPEN_METEO_MONTHLY_CALL_BUDGET:,}-call monthly budget"
        )
    lats, lons = points()
    n = len(lats)
    u = np.full((hours, n), np.nan, np.float32)
    v = np.full((hours, n), np.nan, np.float32)
    batches = [range(i, min(n, i + OPEN_METEO_BATCH)) for i in range(0, n, OPEN_METEO_BATCH)]

    def one(b):
        raw = json.loads(net.fetch(request_url(lats[b.start:b.stop], lons[b.start:b.stop], start, hours, api_key), timeout=90, retries=6))
        locs = raw if isinstance(raw, list) else [raw]
        if len(locs) != len(b):
            raise ValueError("Open-Meteo returned a different number of locations")
        for k, loc in zip(b, locs):
            hr = loc.get("hourly", {})
            sp = np.array(hr.get("wind_speed_10m", []), dtype=np.float64)
            dr = np.array(hr.get("wind_direction_10m", []), dtype=np.float64)
            m = min(hours, len(sp), len(dr))
            rad = np.radians(dr[:m])
            # direction is where the wind comes FROM; u/v point where it blows TO
            u[:m, k] = -sp[:m] * np.sin(rad)
            v[:m, k] = -sp[:m] * np.cos(rad)

    # the free endpoint allows only a few requests at once; the paid one takes more
    with ThreadPoolExecutor(workers or (4 if api_key else 1)) as pool:
        list(pool.map(one, batches))
    shape = (hours, WIND.height, WIND.width)
    return u.reshape(shape), v.reshape(shape), n


def calls_per_run() -> int:
    """Open-Meteo counts each location as one call (2 variables, 5 days)."""
    return WIND.width * WIND.height


def projected_monthly_calls() -> int:
    """Worst normal schedule: four complete NOAA model cycles for 31 days."""
    return calls_per_run() * OPEN_METEO_MAX_RUNS_PER_DAY * OPEN_METEO_BUDGET_DAYS
