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
from .depth import feet_to_m, interpolate_to_depths, level_slab
from .regrid import Regridder

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
        self._depth_levels_m = None
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

    def depth_levels_m(self) -> np.ndarray:
        """The model's fixed z-levels (metres, positive down), cached."""
        if self._depth_levels_m is None:
            raw = parse_dods(net.fetch(dataset_url(self.model, self.cycle, 0) + ".dods?Depth", timeout=120))
            levels = np.asarray(raw["Depth"], np.float64).reshape(-1)
            if levels.size < 2 or not np.all(np.isfinite(levels)) or np.any(np.diff(levels) <= 0):
                raise ValueError(f"{self.model['id']} returned invalid depth levels")
            self._depth_levels_m = levels
        return self._depth_levels_m

    def depth_temperatures_c(self, hour: int, depths_ft) -> tuple[np.ndarray, int]:
        """Interpolated temperatures at requested depths for model water points.

        Returns ``(n_depths, n_points)`` float32 and the downloaded DAP bytes.
        Only the contiguous z-level slab needed to bracket the targets is read.
        """
        levels = self.depth_levels_m()
        depths_m = feet_to_m(depths_ft)
        k0, k1 = level_slab(levels, depths_m)
        ny, nx = self.shape
        slab = f"[0:1:0][{k0}:1:{k1}][0:1:{ny - 1}][0:1:{nx - 1}]"
        q = ".dods?temp" + slab.replace("[", "%5B").replace("]", "%5D")
        payload = net.fetch(dataset_url(self.model, self.cycle, hour) + q, timeout=240)
        raw = parse_dods(payload)
        temps = raw["temp"].reshape(k1 - k0 + 1, -1)[:, self.flat]
        values = interpolate_to_depths(temps, levels[k0:k1 + 1], self.depth_m, depths_m)
        return values, len(payload)


def prepare_regridders(cycles, grid, targets, water, log):
    """Create the cached lake-model/regridder set shared by surface and depth."""
    sources = []
    for model in OFS_MODELS:
        cycle = cycles.get(model["id"])
        if cycle is None:
            continue
        lm = LakeModel(model, cycle)
        rg = Regridder(lm.lon, lm.lat, grid, targets, radius=0.3, max_edge=4 * max(lm.spacing, 0.005))
        grid_mask = np.isfinite(rg.apply(np.ones(len(lm.lat), np.float32))) & water
        sources.append({"model": model, "lm": lm, "rg": rg, "q": rg.quality_grid(),
                        "gridMask": grid_mask, "gridCoverageMin": 1.0})
        log(f"{model['id']}: cycle {cycle_id(cycle)}, {len(lm.lat):,} water points, "
            f"{int(grid_mask.sum()):,} map cells")
    return sources


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
