"""NOAA Great Lakes wave model (GLWU): significant wave height, hourly, from the
NOMADS GRIB filter (only the variable we need is downloaded)."""
from __future__ import annotations

import os
import tempfile
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import numpy as np

from . import net
from .config import GLWU_CYCLES, GLWU_FILTER

M_TO_FT = 3.28084


def filter_url(cycle: datetime) -> str:
    q = {"dir": f"/glwu.{cycle:%Y%m%d}", "file": f"glwu.grlc_2p5km.t{cycle:%H}z.grib2",
         "var_HTSGW": "on", "lev_surface": "on"}
    return f"{GLWU_FILTER}?{urlencode(q)}"


def cycle_candidates(now: datetime, lookback_hours=36):
    t = now.replace(minute=0, second=0, microsecond=0)
    out = []
    for k in range(lookback_hours + 1):
        c = t - timedelta(hours=k)
        if c.hour in GLWU_CYCLES:
            out.append(c)
    return out


def fetch_latest(now: datetime):
    """(cycle, grib bytes) for the newest published GLWU run, or (None, None)."""
    for cycle in cycle_candidates(now):
        try:
            data = net.fetch(filter_url(cycle), timeout=300, retries=2)
        except Exception:
            continue
        if data[:4] == b"GRIB" and len(data) > 10_000:
            return cycle, data
    return None, None


def decode(data: bytes):
    """Returns (lat, lon, {validTime: heights in ft}) for the water points."""
    import eccodes  # ECMWF's GRIB library (binary wheels for macOS and Linux)

    fd, path = tempfile.mkstemp(suffix=".grib2")
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(data)
        lat = lon = flat = None
        hours = {}
        with open(path, "rb") as f:
            while True:
                gid = eccodes.codes_grib_new_from_file(f)
                if gid is None:
                    break
                try:
                    # HTSGW = discipline 10 (oceanographic), category 0 (waves), number 3
                    key = tuple(eccodes.codes_get(gid, k) for k in ("discipline", "parameterCategory", "parameterNumber"))
                    if key != (10, 0, 3):
                        continue
                    vals = eccodes.codes_get_values(gid).astype(np.float32)
                    if eccodes.codes_get(gid, "bitmapPresent"):
                        vals[vals == np.float32(eccodes.codes_get(gid, "missingValue"))] = np.nan
                    if lat is None:
                        la = eccodes.codes_get_array(gid, "latitudes")
                        lo = eccodes.codes_get_array(gid, "longitudes")
                        lo = np.where(lo > 180, lo - 360, lo)
                        flat = np.flatnonzero(np.isfinite(vals))
                        lat, lon = la[flat], lo[flat]
                    d, t = eccodes.codes_get(gid, "validityDate"), eccodes.codes_get(gid, "validityTime")
                    valid = datetime.strptime(f"{int(d):08d}{int(t):04d}", "%Y%m%d%H%M").replace(tzinfo=timezone.utc)
                    v = vals[flat]
                    v[(v < 0) | (v > 20)] = np.nan
                    hours[valid] = v * M_TO_FT
                finally:
                    eccodes.codes_release(gid)
        return lat, lon, hours
    finally:
        os.unlink(path)
