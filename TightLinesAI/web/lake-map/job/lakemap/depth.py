"""Water temperature below the surface ("Temp at depth").

NOAA's Great Lakes regular-grid files already carry temperature on fixed
z-levels (`Depth`, metres, positive down: 0, 1, 2, 4, 6, 8, 10, 12, 15, 20,
25, 30, 35, 40, 45, 50, 60 … m) and fill every level that lies below the lake
bottom with -99999. This module turns those levels into temperatures at the
fixed depths the map offers, per model water point:

  - linear in depth between the two levels around the target;
  - a target that lies inside the water column but just above a filled level
    (the bottom is between the two levels) takes the upper level's value, but
    only when it is within NEAR_BOTTOM_M of it;
  - a target deeper than the model bottom (`h`) is no data, so shallow water is
    never coloured with a temperature the model does not have.

Pure numpy, no network: the data job and the validation backfill share it.
"""
from __future__ import annotations

import numpy as np
from scipy import ndimage

FT_TO_M = 0.3048
# Depths offered by the map, in feet (metric labels are derived on the page).
TEMP_DEPTHS_FT = (10, 20, 30, 40, 50, 75, 100, 150)
# How far below the last valid level a target may sit and still take its value.
NEAR_BOTTOM_M = 2.0
# Plausible water temperature (°C); anything else is treated as missing.
VALID_C = (-5.0, 40.0)


def feet_to_m(ft):
    return np.asarray(ft, np.float64) * FT_TO_M


def clean_temperatures(values) -> np.ndarray:
    """float32 copy with fill values and implausible numbers set to NaN."""
    t = np.array(values, dtype=np.float32, copy=True)
    bad = ~np.isfinite(t) | (t < VALID_C[0]) | (t > VALID_C[1])
    t[bad] = np.nan
    return t


def level_slab(levels_m, depths_m) -> tuple[int, int]:
    """Smallest contiguous index range [k0, k1] of `levels_m` that brackets
    every target depth (inclusive), for one OPeNDAP hyperslab request."""
    levels = np.asarray(levels_m, np.float64)
    if levels.ndim != 1 or levels.size < 2 or np.any(np.diff(levels) <= 0):
        raise ValueError("depth levels must be strictly increasing")
    d = np.asarray(depths_m, np.float64)
    if d.size == 0:
        raise ValueError("no target depths")
    if d.min() < levels[0] or d.max() > levels[-1]:
        raise ValueError(f"target depths {d.min():.2f}–{d.max():.2f} m are outside the model levels "
                         f"{levels[0]:.0f}–{levels[-1]:.0f} m")
    k0 = int(np.searchsorted(levels, d.min(), side="right") - 1)
    k1 = int(np.searchsorted(levels, d.max(), side="left"))
    return max(0, k0), min(levels.size - 1, max(k1, k0 + 1))


def interpolate_to_depths(temps_c, levels_m, bottom_m, depths_m, near_bottom_m=NEAR_BOTTOM_M) -> np.ndarray:
    """Temperatures (°C) at `depths_m` for every point.

    temps_c:  (n_levels, n_points) values on `levels_m` (fill / NaN allowed)
    levels_m: (n_levels,) strictly increasing depths of those levels
    bottom_m: (n_points,) model water depth `h`; NaN = unknown (then only the
              filled levels decide)
    depths_m: target depths (m), each inside the level range
    returns   (n_targets, n_points) float32, NaN where there is no value
    """
    t = clean_temperatures(temps_c)
    levels = np.asarray(levels_m, np.float64)
    if t.ndim == 1:
        t = t[:, None]
    if t.shape[0] != levels.size:
        raise ValueError(f"{t.shape[0]} temperature levels for {levels.size} depth levels")
    level_slab(levels, depths_m)  # validates levels and range
    bottom = np.broadcast_to(np.asarray(bottom_m, np.float64), (t.shape[1],))
    targets = np.atleast_1d(np.asarray(depths_m, np.float64))
    out = np.full((targets.size, t.shape[1]), np.nan, np.float32)
    for n, z in enumerate(targets):
        k = int(np.clip(np.searchsorted(levels, z, side="right") - 1, 0, levels.size - 2))
        za, zb = levels[k], levels[k + 1]
        a, b = t[k], t[k + 1]
        f = np.float32((z - za) / (zb - za))
        va, vb = np.isfinite(a), np.isfinite(b)
        v = np.where(va & vb, a + (b - a) * f, np.nan).astype(np.float32)
        if f == 1.0:  # exactly on the lower level
            v = np.where(vb, b, v)
        elif f == 0.0:  # exactly on the upper level
            v = np.where(va, a, v)
        near = va & ~vb & ((z - za) <= near_bottom_m)
        v = np.where(np.isfinite(v), v, np.where(near, a, np.nan))
        too_deep = np.isfinite(bottom) & (bottom < z)
        v[too_deep] = np.nan
        out[n] = v
    return out


def profile_at(profile_c, levels_m, bottom_m, depth_m, near_bottom_m=NEAR_BOTTOM_M) -> float:
    """One point, one depth (validation helper). NaN when there is no value."""
    v = interpolate_to_depths(np.asarray(profile_c)[:, None], levels_m, bottom_m, [depth_m], near_bottom_m)
    return float(v[0, 0])


def extend_onto_land(values, water, max_cells) -> np.ndarray:
    """Carry depth values up to `max_cells` outward onto LAND only.

    The surface field is extended over the shoreline so the land layer never
    shows a seam. Below the surface, lake cells without a value are water that
    is shallower than the chosen depth and must stay empty, so only cells
    outside the lake mask are filled.
    """
    vals = np.asarray(values, np.float32)
    water = np.asarray(water, bool)
    finite = np.isfinite(vals)
    if not finite.any():
        return vals.copy()
    dist, (iy, ix) = ndimage.distance_transform_edt(~finite, return_indices=True)
    out = vals.copy()
    take = ~water & ~finite & (dist <= max_cells)
    out[take] = vals[iy[take], ix[take]]
    return out


def expected_cells(bottom_m, depth_m) -> np.ndarray:
    """Points deep enough to have a value at `depth_m` (for coverage checks)."""
    b = np.asarray(bottom_m, np.float64)
    return np.isfinite(b) & (b >= depth_m)
