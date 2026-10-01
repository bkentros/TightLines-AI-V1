"""NOAA Great Lakes lake models (LSOFS, LMHOFS, LEOFS, LOOFS): surface water
temperature for each forecast hour, plus the model depth, from the
regular-grid files on NOAA's THREDDS server."""
from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone

import numpy as np

from . import net
from .config import OFS_CYCLES, OFS_MODELS, THREDDS
from .dap import parse_dods

FILL = -99990.0


def dataset_url(model, cycle: datetime, hour: int) -> str:
    d = cycle.strftime("%Y%m%d")
    return (f"{THREDDS}/{model['id']}/MODELS/{cycle:%Y/%m/%d}/"
            f"{model['prefix']}.t{cycle:%H}z.{d}.regulargrid.f{hour:03d}.nc")


def cycle_candidates(now: datetime, lookback_hours=30):
    t = now.replace(minute=0, second=0, microsecond=0, tzinfo=timezone.utc)
    t = t.replace(hour=max(c for c in OFS_CYCLES if c <= t.hour))
    out = []
    while (now - t) <= timedelta(hours=lookback_hours):
        out.append(t)
        t -= timedelta(hours=6)
    return out


def discover(model, now: datetime, lookback_hours=30):
    """Newest cycle whose last forecast hour (f120) is published."""
    for cycle in cycle_candidates(now, lookback_hours):
        try:
            net.fetch(dataset_url(model, cycle, 120) + ".dds", timeout=30, retries=2)
            return cycle
        except Exception:
            continue
    return None


class LakeModel:
    """One model cycle: static grid (lat/lon, water mask, depth) + hourly surface temps."""

    def __init__(self, model, cycle: datetime):
        self.model = model
        self.cycle = cycle
        raw = parse_dods(net.fetch(dataset_url(model, cycle, 0) + ".dods?Latitude,Longitude,mask,h", timeout=120))
        lat, lon = raw["Latitude"].astype(np.float64), raw["Longitude"].astype(np.float64)
        lon = np.where(lon > 180, lon - 360, lon)
        self.shape = lat.shape
        mask = raw["mask"] > 0.5
        h = raw["h"].astype(np.float64)
        ok = mask & np.isfinite(lat) & np.isfinite(lon) & (np.abs(lat) <= 90)
        self.flat = np.flatnonzero(ok)
        self.lat, self.lon = lat.ravel()[self.flat], lon.ravel()[self.flat]
        depth = h.ravel()[self.flat]
        self.depth_m = np.where(depth > FILL, depth, np.nan)
        # typical point spacing, for the long-triangle test
        self.spacing = float(np.nanmedian(np.abs(np.diff(lat, axis=0)))) if lat.shape[0] > 1 else 0.01

    def surface_temp_c(self, hour: int) -> np.ndarray:
        ny, nx = self.shape
        # brackets must be percent-encoded or NOAA's server answers HTTP 400
        q = ".dods?temp" + f"[0:1:0][0:1:0][0:1:{ny - 1}][0:1:{nx - 1}]".replace("[", "%5B").replace("]", "%5D")
        raw = parse_dods(net.fetch(dataset_url(self.model, self.cycle, hour) + q, timeout=180))
        t = raw["temp"].reshape(-1)[self.flat].astype(np.float32)
        t[(t < -5) | (t > 40)] = np.nan
        return t


def fetch_all_hours(lm: LakeModel, hours, workers=6):
    """{hour: temps °C at the model's water points} (missing hours are left out)."""
    def one(h):
        try:
            return h, lm.surface_temp_c(h)
        except Exception as err:  # keep going; the hour becomes a gap
            print(f"  {lm.model['id']} f{h:03d} failed: {err}")
            return h, None
    with ThreadPoolExecutor(workers) as pool:
        return {h: v for h, v in pool.map(one, hours) if v is not None}


def cycle_id(cycle: datetime) -> str:
    return cycle.strftime("%Y-%m-%dT%H:00:00Z")
