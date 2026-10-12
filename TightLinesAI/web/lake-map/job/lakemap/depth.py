"""Pure helpers for interpolating NOAA 3-D temperature profiles by depth."""
from __future__ import annotations

import numpy as np
from scipy import ndimage

from .config import TEMP_DEPTHS_AVAILABLE_FT, TEMP_DEPTHS_FT

FT_TO_M = 0.3048
NEAR_BOTTOM_M = 2.0
VALID_C = (-5.0, 40.0)


def feet_to_m(ft):
    return np.asarray(ft, np.float64) * FT_TO_M


def clean_temperatures(values) -> np.ndarray:
    t = np.array(values, dtype=np.float32, copy=True)
    bad = ~np.isfinite(t) | (t < VALID_C[0]) | (t > VALID_C[1])
    t[bad] = np.nan
    return t


def level_slab(levels_m, depths_m) -> tuple[int, int]:
    levels = np.asarray(levels_m, np.float64)
    if levels.ndim != 1 or levels.size < 2 or np.any(np.diff(levels) <= 0):
        raise ValueError("depth levels must be strictly increasing")
    d = np.asarray(depths_m, np.float64)
    if d.size == 0:
        raise ValueError("no target depths")
    if d.min() < levels[0] or d.max() > levels[-1]:
        raise ValueError(
            f"target depths {d.min():.2f}–{d.max():.2f} m are outside the model "
            f"levels {levels[0]:.0f}–{levels[-1]:.0f} m"
        )
    k0 = int(np.searchsorted(levels, d.min(), side="right") - 1)
    k1 = int(np.searchsorted(levels, d.max(), side="left"))
    return max(0, k0), min(levels.size - 1, max(k1, k0 + 1))


def interpolate_to_depths(
    temps_c, levels_m, bottom_m, depths_m, near_bottom_m=NEAR_BOTTOM_M
) -> np.ndarray:
    t = clean_temperatures(temps_c)
    levels = np.asarray(levels_m, np.float64)
    if t.ndim == 1:
        t = t[:, None]
    if t.shape[0] != levels.size:
        raise ValueError(f"{t.shape[0]} temperature levels for {levels.size} depth levels")
    level_slab(levels, depths_m)
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
        if f == 1.0:
            v = np.where(vb, b, v)
        elif f == 0.0:
            v = np.where(va, a, v)
        near = va & ~vb & ((z - za) <= near_bottom_m)
        v = np.where(np.isfinite(v), v, np.where(near, a, np.nan))
        v[np.isfinite(bottom) & (bottom < z)] = np.nan
        out[n] = v
    return out


def interpolate_sigma_to_depths(
    temps_c, sigma_layers, bottom_m, zeta_m, depths_m, sigma_interfaces=None
) -> np.ndarray:
    """Interpolate terrain-following native profiles to fixed depths.

    NOAA's native GLOFS files define each layer by a negative ``siglay``
    fraction (near zero at the surface, near -1 at the bottom).  The physical
    depth below the instantaneous surface is therefore ``-siglay * (h+zeta)``.
    Internal targets are linearly interpolated between layer centres.  A target
    between a boundary layer's centre and its ``siglev`` interface takes that
    layer's cell value: it remains inside the modelled finite-volume cell and
    is not extrapolated beyond the surface or lakebed.
    """
    t = clean_temperatures(temps_c)
    if t.ndim == 1:
        t = t[:, None]
    sigma = np.asarray(sigma_layers, np.float64)
    if sigma.ndim == 1:
        sigma = np.broadcast_to(sigma[:, None], t.shape)
    if sigma.shape != t.shape:
        raise ValueError(f"sigma shape {sigma.shape} does not match temperature shape {t.shape}")
    if t.shape[0] < 2:
        raise ValueError("at least two sigma layers are required")
    bottom = np.broadcast_to(np.asarray(bottom_m, np.float64), (t.shape[1],))
    zeta = np.broadcast_to(np.asarray(zeta_m, np.float64), (t.shape[1],))
    total_depth = bottom + zeta
    actual = -sigma * total_depth[None, :]
    interfaces = None
    if sigma_interfaces is not None:
        interface_sigma = np.asarray(sigma_interfaces, np.float64)
        if interface_sigma.ndim == 1:
            interface_sigma = np.broadcast_to(interface_sigma[:, None], (t.shape[0] + 1, t.shape[1]))
        if interface_sigma.shape != (t.shape[0] + 1, t.shape[1]):
            raise ValueError(
                f"sigma interface shape {interface_sigma.shape} does not match "
                f"temperature shape {t.shape}"
            )
        interfaces = -interface_sigma * total_depth[None, :]
    valid_geometry = (
        np.isfinite(actual).all(axis=0)
        & np.isfinite(total_depth)
        & (total_depth > 0)
        & np.all(np.diff(actual, axis=0) > 0, axis=0)
    )
    if interfaces is not None:
        valid_geometry &= np.isfinite(interfaces).all(axis=0) & np.all(np.diff(interfaces, axis=0) > 0, axis=0)
    targets = np.atleast_1d(np.asarray(depths_m, np.float64))
    if targets.size == 0 or not np.all(np.isfinite(targets)) or np.any(targets <= 0):
        raise ValueError("target depths must be finite and positive")
    out = np.full((targets.size, t.shape[1]), np.nan, np.float32)
    columns = np.arange(t.shape[1])
    for n, target in enumerate(targets):
        # First layer centre at or below the requested depth. Internal targets
        # require two neighbours; boundary targets are handled only inside the
        # finite-volume cell limits below.
        high = np.sum(actual < target, axis=0)
        bracketed = valid_geometry & (high > 0) & (high < t.shape[0]) & (total_depth >= target)
        clipped_high = np.clip(high, 1, t.shape[0] - 1)
        low = clipped_high - 1
        za = actual[low, columns]
        zb = actual[clipped_high, columns]
        a = t[low, columns]
        b = t[clipped_high, columns]
        finite = bracketed & np.isfinite(a) & np.isfinite(b) & (zb > za)
        fraction = np.divide(
            target - za,
            zb - za,
            out=np.zeros_like(za, dtype=np.float64),
            where=finite,
        )
        values = a + (b - a) * fraction.astype(np.float32)
        out[n, finite] = values[finite]
        if interfaces is not None:
            top = valid_geometry & (high == 0) & (target >= interfaces[0]) & (target <= interfaces[1])
            bottom_cell = (
                valid_geometry & (high == t.shape[0]) &
                (target >= interfaces[-2]) & (target <= interfaces[-1]) &
                (total_depth >= target)
            )
            top &= np.isfinite(t[0])
            bottom_cell &= np.isfinite(t[-1])
            out[n, top] = t[0, top]
            out[n, bottom_cell] = t[-1, bottom_cell]
    return out


def profile_at(profile_c, levels_m, bottom_m, depth_m, near_bottom_m=NEAR_BOTTOM_M) -> float:
    v = interpolate_to_depths(
        np.asarray(profile_c)[:, None], levels_m, bottom_m, [depth_m], near_bottom_m
    )
    return float(v[0, 0])


def extend_onto_land(values, water, max_cells) -> np.ndarray:
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
    b = np.asarray(bottom_m, np.float64)
    return np.isfinite(b) & (b >= depth_m)
