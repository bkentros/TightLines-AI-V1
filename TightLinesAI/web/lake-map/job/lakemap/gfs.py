"""Wind for the wide map area from NOAA GFS (0.25°, 10 m), via the NOMADS GRIB
filter: only UGRD/VGRD at 10 m inside the map box is downloaded, one small file
per 3-hour step. Steps are interpolated to hourly frames.

The lake area itself keeps the Open-Meteo wind (see wind.py and merge()); GFS
fills everything around it so streaks cover every spot the map can show.
"""
from __future__ import annotations

import math
import os
import tempfile
import time
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import numpy as np

from . import net
from .config import GFS_CYCLES, GFS_FILTER, WIND, WIND_LAKES, DOMAIN
from .regrid import grid_coords

MS_TO_MPH = 2.23694
STEP = 3
PAUSE = 0.6  # seconds between downloads (NOMADS asks for < 120 requests a minute)


def filter_url(cycle: datetime, fhour: int) -> str:
    b = WIND.box
    q = {"dir": f"/gfs.{cycle:%Y%m%d}/{cycle:%H}/atmos", "file": f"gfs.t{cycle:%H}z.pgrb2.0p25.f{fhour:03d}",
         "var_UGRD": "on", "var_VGRD": "on", "lev_10_m_above_ground": "on", "subregion": "",
         # GFS longitudes run 0–360
         "leftlon": (math.floor(b["west"]) - 1) % 360, "rightlon": (math.ceil(b["east"]) + 1) % 360,
         "toplat": math.ceil(b["north"]) + 1, "bottomlat": math.floor(b["south"]) - 1}
    return f"{GFS_FILTER}?{urlencode(q)}"


def cycle_candidates(t0: datetime, lookback_hours=30):
    """GFS cycles at or before t0, newest first."""
    t = t0.replace(minute=0, second=0, microsecond=0)
    return [t - timedelta(hours=k) for k in range(lookback_hours + 1) if (t - timedelta(hours=k)).hour in GFS_CYCLES]


def steps_for(offset: int, hours: int):
    first = (offset // STEP) * STEP
    last = -(-(offset + hours - 1) // STEP) * STEP
    return list(range(first, last + 1, STEP))


def decode(data: bytes):
    """(lats ascending, lons, u, v) in mph from one GRIB2 download."""
    import eccodes
    fd, path = tempfile.mkstemp(suffix=".grib2")
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(data)
        got = {}
        lats = lons = None
        with open(path, "rb") as f:
            while True:
                gid = eccodes.codes_grib_new_from_file(f)
                if gid is None:
                    break
                try:
                    key = (eccodes.codes_get(gid, "discipline"), eccodes.codes_get(gid, "parameterCategory"),
                           eccodes.codes_get(gid, "parameterNumber"))
                    comp = {(0, 2, 2): "u", (0, 2, 3): "v"}.get(key)
                    if not comp:
                        continue
                    ni, nj = eccodes.codes_get(gid, "Ni"), eccodes.codes_get(gid, "Nj")
                    vals = eccodes.codes_get_values(gid).reshape(nj, ni).astype(np.float32) * MS_TO_MPH
                    la = eccodes.codes_get_array(gid, "latitudes").reshape(nj, ni)[:, 0]
                    lo = eccodes.codes_get_array(gid, "longitudes").reshape(nj, ni)[0, :]
                    lo = np.where(lo > 180, lo - 360, lo)
                    if la[0] > la[-1]:
                        la, vals = la[::-1], vals[::-1]
                    got[comp] = vals
                    lats, lons = la, lo
                finally:
                    eccodes.codes_release(gid)
        if "u" not in got or "v" not in got:
            raise ValueError("GFS download had no 10 m wind")
        return lats, lons, got["u"], got["v"]
    finally:
        os.unlink(path)


def to_grid(lats, lons, field):
    from scipy.interpolate import RegularGridInterpolator
    lon, lat = grid_coords(WIND)
    f = RegularGridInterpolator((lats, lons), field, bounds_error=False, fill_value=None)
    return f(np.column_stack([lat.ravel(), lon.ravel()])).reshape(WIND.height, WIND.width).astype(np.float32)


def fetch(t0: datetime, hours: int, log=print, pause=None):
    """u, v shaped (hours, WIND.height, WIND.width) in mph, and an info dict.
    Uses the newest GFS cycle whose last needed step is already published."""
    for cycle in cycle_candidates(t0):
        offset = int((t0 - cycle).total_seconds() // 3600)
        steps = steps_for(offset, hours)
        try:
            last = net.fetch(filter_url(cycle, steps[-1]), timeout=120, retries=2)
        except net.HttpError:
            continue
        if last[:4] != b"GRIB":
            continue
        fields = {}
        for s in steps:
            data = last if s == steps[-1] else net.fetch(filter_url(cycle, s), timeout=120, retries=4)
            la, lo, u, v = decode(data)
            fields[s] = (to_grid(la, lo, u), to_grid(la, lo, v))
            if s != steps[-1]:
                time.sleep(PAUSE if pause is None else pause)
        U = np.empty((hours, WIND.height, WIND.width), np.float32)
        V = np.empty_like(U)
        for h in range(hours):
            fh = offset + h
            a = (fh // STEP) * STEP
            b = min(a + STEP, steps[-1])
            m = 0.0 if b == a else (fh - a) / (b - a)
            U[h] = fields[a][0] * (1 - m) + fields[b][0] * m
            V[h] = fields[a][1] * (1 - m) + fields[b][1] * m
        log(f"GFS wind: cycle {cycle:%Y-%m-%d %HZ}, {len(steps)} steps")
        return U, V, {"model": "GFS 0.25°", "cycle": cycle.strftime("%Y-%m-%dT%H:%M:%SZ"), "steps": len(steps)}
    raise RuntimeError("no GFS cycle available")


def merge(u_lake, v_lake, u_wide=None, v_wide=None, feather=2):
    """Puts the lake-area wind (Open-Meteo) into the wide grid. Near the lake-area
    edge the two blend over `feather` cells so there is no seam. Without GFS, the
    lake-area edge values are carried outward so every spot still has wind."""
    hours = u_lake.shape[0]
    r0 = round((WIND.box["north"] - DOMAIN["north"]) / WIND.res)
    c0 = round((DOMAIN["west"] - WIND.box["west"]) / WIND.res)
    h, w = WIND_LAKES.height, WIND_LAKES.width
    if u_wide is None:
        pad = ((0, 0), (r0, WIND.height - r0 - h), (c0, WIND.width - c0 - w))
        u_wide = np.pad(np.nan_to_num(u_lake), pad, mode="edge")
        v_wide = np.pad(np.nan_to_num(v_lake), pad, mode="edge")
    U, V = u_wide.copy(), v_wide.copy()
    jj, ii = np.mgrid[0:h, 0:w]
    edge = np.minimum.reduce([jj, ii, h - 1 - jj, w - 1 - ii]).astype(np.float32)
    wt = np.clip((edge + 1) / (feather + 1), 0, 1)[None]
    for out, lake in ((U, u_lake), (V, v_lake)):
        box = out[:, r0:r0 + h, c0:c0 + w]
        ok = np.isfinite(lake)
        blended = np.where(ok, lake * wt + box * (1 - wt), box)
        out[:, r0:r0 + h, c0:c0 + w] = blended
    return U[:hours], V[:hours]
