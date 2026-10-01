"""Put model values onto the map's regular lat/lon grids.

Each source (a NOAA lake model, the wave model) gives values at scattered
water points. For every output pixel that is water, or land within
EXTEND_CELLS of water, we precompute interpolation weights once:
  - inside the source's water triangles: linear (barycentric) weights, with
    long triangles (ones that would bridge a peninsula or island) rejected;
  - otherwise: the nearest source water point within `radius` degrees.
Applying the weights to a new forecast hour is then one gather per pixel.
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
from scipy.spatial import Delaunay, cKDTree

from .config import DOMAIN, EXTEND_CELLS

KX = np.cos(np.radians(45.0))  # scale longitude so distances are roughly isotropic


def grid_coords(grid):
    box = getattr(grid, "box", DOMAIN)
    lon = box["west"] + np.arange(grid.width) * grid.res
    lat = box["north"] - np.arange(grid.height) * grid.res
    return np.meshgrid(lon, lat)


def water_mask(grid, geo_path, supersample=4) -> np.ndarray:
    """Pixels whose cell touches a lake polygon (from the map's own shoreline)."""
    geo = json.loads(Path(geo_path).read_text())
    w, h, s = grid.width, grid.height, supersample
    img = Image.new("L", (w * s, h * s), 0)
    draw = ImageDraw.Draw(img)

    def px(ring):
        return [(((x - DOMAIN["west"]) / grid.res + 0.5) * s, ((DOMAIN["north"] - y) / grid.res + 0.5) * s) for x, y in ring]

    for f in geo["lakes"]["features"]:
        g = f["geometry"]
        polys = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
        for poly in polys:
            draw.polygon(px(poly[0]), fill=255)
            for hole in poly[1:]:
                draw.polygon(px(hole), fill=0)
    a = np.asarray(img).reshape(h, s, w, s)
    return (a > 0).any(axis=(1, 3))


def target_mask(water: np.ndarray, extend=EXTEND_CELLS) -> np.ndarray:
    if not water.any():
        return water.copy()
    dist = ndimage.distance_transform_edt(~water)
    return dist <= extend


class Regridder:
    def __init__(self, src_lon, src_lat, grid, targets, radius, max_edge):
        self.grid = grid
        lon, lat = grid_coords(grid)
        idx = np.flatnonzero(targets)
        tx, ty = lon.ravel()[idx] * KX, lat.ravel()[idx]
        sx, sy = np.asarray(src_lon) * KX, np.asarray(src_lat)
        pts = np.column_stack([sx, sy])
        n = len(idx)
        self.index = idx
        self.nodes = np.zeros((n, 3), np.int64)
        self.weights = np.zeros((n, 3), np.float32)
        self.ok = np.zeros(n, bool)
        self.quality = np.full(n, np.inf, np.float32)  # 0 = interpolated, else distance to nearest point
        if len(pts) >= 3:
            tri = Delaunay(pts)
            s = tri.find_simplex(np.column_stack([tx, ty]))
            inside = s >= 0
            simp = tri.simplices[s[inside]]
            # reject long triangles
            p = pts[simp]
            edge = np.max(np.stack([np.hypot(*(p[:, a] - p[:, b]).T) for a, b in ((0, 1), (1, 2), (0, 2))]), axis=0)
            good = edge <= max_edge
            T = tri.transform[s[inside]]
            r = np.column_stack([tx, ty])[inside] - T[:, 2]
            b = np.einsum("ijk,ik->ij", T[:, :2], r)
            bary = np.column_stack([b, 1 - b.sum(axis=1)])
            sel = np.flatnonzero(inside)[good]
            self.nodes[sel] = simp[good]
            self.weights[sel] = bary[good]
            self.ok[sel] = True
            self.quality[sel] = 0
        if len(pts):
            rest = np.flatnonzero(~self.ok)
            d, j = cKDTree(pts).query(np.column_stack([tx[rest], ty[rest]]), distance_upper_bound=radius)
            hit = np.isfinite(d)
            sel = rest[hit]
            self.nodes[sel] = j[hit][:, None]
            self.weights[sel] = (1, 0, 0)
            self.ok[sel] = True
            self.quality[sel] = d[hit]

    def apply(self, values: np.ndarray) -> np.ndarray:
        """Values at the source points → full output grid (NaN where not covered)."""
        out = np.full(self.grid.width * self.grid.height, np.nan, np.float32)
        v = np.asarray(values, np.float32)[self.nodes]
        val = (v * self.weights).sum(axis=1)
        val[~self.ok] = np.nan
        out[self.index] = val
        return out.reshape(self.grid.height, self.grid.width)

    def quality_grid(self) -> np.ndarray:
        q = np.full(self.grid.width * self.grid.height, np.inf, np.float32)
        q[self.index] = self.quality
        return q.reshape(self.grid.height, self.grid.width)


def combine(grids, qualities):
    """Per pixel, take the source with the best coverage (seamless where models meet)."""
    q = np.stack(qualities)
    g = np.stack(grids)
    q = np.where(np.isfinite(g), q, np.inf)
    best = np.argmin(q, axis=0)
    out = np.take_along_axis(g, best[None], axis=0)[0]
    out[~np.isfinite(np.min(q, axis=0))] = np.nan
    return out


def fill_nearest(values: np.ndarray, where: np.ndarray, max_cells: int) -> np.ndarray:
    """Fill NaNs inside `where` from the nearest finite pixel within max_cells."""
    miss = where & ~np.isfinite(values)
    if not miss.any() or not np.isfinite(values).any():
        return values
    dist, (iy, ix) = ndimage.distance_transform_edt(~np.isfinite(values), return_indices=True)
    out = values.copy()
    take = miss & (dist <= max_cells)
    out[take] = values[iy[take], ix[take]]
    return out
