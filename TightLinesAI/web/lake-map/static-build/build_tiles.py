#!/usr/bin/env python3
"""Builds the Live Lake Map's static layers (Phase 4).

  lakes-v2.pmtiles  vector tiles, zoom 4–13:
      land      everything that is not Great Lakes water (from the OpenStreetMap lake
                outlines: every harbor, channel, breakwall and island)
      coast     the Great Lakes shoreline as lines (no seams at tile edges)
      contours  NOAA depth contours in feet: 10 ft steps near shore, wider offshore
  depth-v1.pmtiles  raster DEM tiles (Terrarium PNG), zoom 4–10, water only:
      used for the depth colors, relief shading and the depth readout

  python static-build/build_tiles.py --sources static-build/sources --out static-build/dist
"""
from __future__ import annotations

import argparse
import gzip
import io
import json
import math
import tarfile
import tempfile
import time
from pathlib import Path

import numpy as np
import shapely
from PIL import Image, ImageDraw
from shapely.geometry import box

DOMAIN = {"west": -92.4, "east": -75.8, "south": 41.2, "north": 49.2}
MARGIN = 0.25
LAND_MINZ, LAND_MAXZ = 4, 13
DEM_MINZ, DEM_MAXZ = 4, 10
EXTENT = 4096
BUFFER = 64          # tile buffer in tile units, so lines and fills meet cleanly across tiles
R = 6378137.0
WORLD = 2 * math.pi * R
FT = 3.28084

# contour levels (feet) and the first zoom each appears at
def contour_minzoom(ft: int) -> int | None:
    if ft in (100, 300, 600, 900, 1200):
        return 6
    if ft % 100 == 0:
        return 7
    if ft % 50 == 0:
        return 8
    if ft <= 200 and ft % 25 == 0:
        return 9
    if ft <= 100 and ft % 20 == 0:
        return 9
    if ft <= 100 and ft % 10 == 0:
        return 10
    return None


CONTOUR_FT = [f for f in list(range(10, 101, 10)) + [125, 150, 175, 200] + list(range(250, 501, 50)) + list(range(600, 1401, 100))
              if contour_minzoom(f) is not None]


class Log:
    def __init__(self):
        self.t0 = time.time()

    def __call__(self, msg):
        print(f"[{time.time() - self.t0:7.1f}s] {msg}", flush=True)


log = Log()


# ── projection helpers ─────────────────────────────────────────────
def merc(lon, lat):
    lon = np.asarray(lon, dtype=np.float64)
    lat = np.clip(np.asarray(lat, dtype=np.float64), -85.05, 85.05)
    return lon * math.pi / 180 * R, np.log(np.tan(math.pi / 4 + np.radians(lat) / 2)) * R


def to_merc(geom):
    return shapely.transform(geom, lambda c: np.column_stack(merc(c[:, 0], c[:, 1])))


def tile_bounds(z, x, y):
    size = WORLD / 2 ** z
    minx = -WORLD / 2 + x * size
    maxy = WORLD / 2 - y * size
    return minx, maxy - size, minx + size, maxy


def tile_range(z, west, south, east, north):
    n = 2 ** z
    def tx(lon): return int(math.floor((lon + 180) / 360 * n))
    def ty(lat):
        r = math.radians(lat)
        return int(math.floor((1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n))
    return tx(west), ty(north), tx(east), ty(south)


def zxy_to_tileid(z, x, y):
    from pmtiles.tile import zxy_to_tileid as f
    return f(z, x, y)


# ── sources ─────────────────────────────────────────────────────────
def _rings_to_area(lines):
    """Joins way pieces end to end and fills the closed rings."""
    merged = shapely.line_merge(shapely.union_all(lines))
    parts = list(shapely.get_parts(merged))
    return shapely.union_all(list(shapely.get_parts(shapely.polygonize(parts))))


def load_lakes_osm_xml(sources: Path):
    """Great Lakes water from OSM API relation downloads (sources/osm-*.xml.gz);
    returns (land, coast) in Web Mercator, or None if no files."""
    import xml.etree.ElementTree as ET
    files = sorted(sources.glob("osm-*.xml.gz"))
    if not files:
        return None
    waters = []
    for f in files:
        nodes, ways, rel = {}, {}, None
        for _, el in ET.iterparse(gzip.open(f)):
            if el.tag == "node":
                nodes[el.get("id")] = (float(el.get("lon")), float(el.get("lat")))
            elif el.tag == "way":
                ways[el.get("id")] = [nd.get("ref") for nd in el.findall("nd")]
            elif el.tag == "relation":
                rel = [(m.get("ref"), m.get("role")) for m in el.findall("member") if m.get("type") == "way"]
                el.clear()
        outer, inner = [], []
        for ref, role in rel or []:
            pts = [nodes[n] for n in ways.get(ref, []) if n in nodes]
            if len(pts) >= 2:
                (inner if role == "inner" else outer).append(shapely.LineString(pts))
        water = _rings_to_area(outer)
        if inner:
            water = shapely.difference(water, _rings_to_area(inner))
        water = shapely.make_valid(water)
        log(f"{f.name}: {len(outer)} shore pieces, {len(inner)} islands, "
            f"{shapely.get_num_coordinates(water):,} points, area {shapely.area(water):.2f} sq°")
        if not water.is_empty:
            waters.append(water)
    water = shapely.union_all(waters)
    area = box(DOMAIN["west"] - MARGIN, DOMAIN["south"] - MARGIN, DOMAIN["east"] + MARGIN, DOMAIN["north"] + MARGIN)
    water = shapely.intersection(water, area)
    land = shapely.make_valid(shapely.difference(area, water))
    coast = shapely.intersection(shapely.boundary(water), area.buffer(-1e-7))
    return to_merc(land), to_merc(coast)


def load_lakes_osm(sources: Path):
    """Great Lakes water from the OpenStreetMap lake relations (Overpass `out geom`);
    returns (land, coast) in Web Mercator. Land = map area minus the lakes."""
    raw = json.loads(gzip.open(sources / "greatlakes-osm.json.gz", "rb").read())
    waters, names = [], []
    for el in raw.get("elements", []):
        if el.get("type") != "relation":
            continue
        outer, inner = [], []
        for m in el.get("members", []):
            g = m.get("geometry")
            if m.get("type") != "way" or not g or len(g) < 2:
                continue
            line = shapely.LineString([(p["lon"], p["lat"]) for p in g])
            (inner if m.get("role") == "inner" else outer).append(line)
        if not outer:
            continue
        water = _rings_to_area(outer)
        if inner:
            water = shapely.difference(water, _rings_to_area(inner))
        if water.is_empty:
            log(f"  {el.get('tags', {}).get('name')}: outline did not close, skipped")
            continue
        waters.append(shapely.make_valid(water))
        names.append(f"{el.get('tags', {}).get('name')} ({len(outer)} outer, {len(inner)} islands)")
    log("lakes: " + "; ".join(names))
    water = shapely.union_all(waters)
    area = box(DOMAIN["west"] - MARGIN, DOMAIN["south"] - MARGIN, DOMAIN["east"] + MARGIN, DOMAIN["north"] + MARGIN)
    water = shapely.intersection(water, area)
    land = shapely.make_valid(shapely.difference(area, water))
    coast = shapely.intersection(shapely.boundary(water), area.buffer(-1e-7))
    log(f"land ready: {shapely.get_num_coordinates(land):,} shoreline points")
    return to_merc(land), to_merc(coast)


def load_ofm_water(sources: Path, land):
    """Rivers and harbor lakes along the shore: OpenStreetMap water from the
    OpenFreeMap z12 tiles (sources/ofm-shore-z12.tar.gz) that lies on our land.
    Returns a Web Mercator MultiPolygon (or None)."""
    import mapbox_vector_tile
    tgz = sources / "ofm-shore-z12.tar.gz"
    if not tgz.exists():
        return None
    # worked tile by tile (clipping the huge land polygon per tile is fast; one
    # global intersection is not), then stitched back with a coverage union
    land_parts = list(shapely.get_parts(land))
    tree = shapely.STRtree(land_parts)
    pieces = []
    with tarfile.open(tgz) as t:
        for m in t.getmembers():
            z, x, y = (int(v) for v in m.name.split(".")[0].split("-"))
            raw = t.extractfile(m).read()
            if raw[:2] == b"\x1f\x8b":
                raw = gzip.decompress(raw)
            layer = mapbox_vector_tile.decode(raw, default_options={"y_coord_down": True}).get("water")
            if not layer:
                continue
            ext = layer.get("extent", 4096)
            minx, miny, maxx, maxy = tile_bounds(z, x, y)
            sx, sy = (maxx - minx) / ext, (maxy - miny) / ext
            polys = []
            for f in layer["features"]:
                if f["properties"].get("brunnel") == "tunnel":
                    continue
                g = shapely.geometry.shape(f["geometry"])
                g = shapely.transform(g, lambda c: np.column_stack([minx + c[:, 0] * sx, maxy - c[:, 1] * sy]))
                polys.append(shapely.make_valid(g))
            if not polys:
                continue
            pad = 40
            box = (minx - pad, miny - pad, maxx + pad, maxy + pad)
            near = tree.query(shapely.box(*box))
            if not len(near):
                continue
            land_t = shapely.union_all([shapely.clip_by_rect(land_parts[i], *box) for i in near])
            w = shapely.intersection(shapely.union_all(polys), land_t)
            if w.is_empty:
                continue
            # drop slivers where two OSM shorelines differ by a few metres
            w = shapely.buffer(shapely.buffer(w, -8, quad_segs=2), 8, quad_segs=2)
            w = shapely.make_valid(shapely.clip_by_rect(w, minx, miny, maxx, maxy))
            pieces.extend(q for q in shapely.get_parts(w) if q.geom_type == "Polygon" and q.area > 400)
    if not pieces:
        return None
    try:
        inland = shapely.coverage_union_all(pieces)
    except Exception:
        inland = shapely.union_all(pieces)
    inland = shapely.make_valid(inland)
    inland = shapely.MultiPolygon([q for p in shapely.get_parts(inland) for q in shapely.get_parts(p) if q.geom_type == "Polygon"])
    log(f"inland water (rivers, harbor lakes): {len(list(shapely.get_parts(inland))):,} pieces, "
        f"{shapely.get_num_coordinates(inland):,} points")
    return inland


def load_lakes_dem(dems):
    """Backup shoreline: the 0 m line of the NOAA grids (about 90 m detail),
    keeping only the big connected lake water (not inland depressions)."""
    from scipy.ndimage import gaussian_filter, label
    from skimage.measure import find_contours
    waters = []
    for d in dems:
        z = np.nan_to_num(d["z"], nan=5.0)
        lab, n = label(z < 0)
        sizes = np.bincount(lab.ravel())
        sizes[0] = 0
        keep = np.isin(lab, np.flatnonzero(sizes > 20000))
        zz = gaussian_filter(np.where(keep, np.minimum(z, -0.5), np.maximum(z, 0.5)), 0.7)
        rings = []
        # pad with land so every outline closes, even where a lake runs off the grid edge
        for c in find_contours(np.pad(zz, 1, constant_values=5.0), 0.0):
            if len(c) >= 4:
                c = c - 1
                rings.append(np.column_stack([d["lon0"] + c[:, 1] * d["dlon"], d["lat0"] + c[:, 0] * d["dlat"]]))
        faces = shapely.get_parts(shapely.polygonize([shapely.LineString(r) for r in rings]))
        h, w = zz.shape
        def is_water(poly):
            pt = poly.representative_point()
            col = int(np.clip(round((pt.x - d["lon0"]) / d["dlon"]), 0, w - 1))
            row = int(np.clip(round((pt.y - d["lat0"]) / d["dlat"]), 0, h - 1))
            return zz[row, col] < 0
        wf = [f for f in faces if is_water(f)]
        waters.append(shapely.union_all(wf))
        log(f"backup shoreline {d['name']}: {len(wf)} water faces")
    water = shapely.union_all(waters)
    area = box(DOMAIN["west"] - MARGIN, DOMAIN["south"] - MARGIN, DOMAIN["east"] + MARGIN, DOMAIN["north"] + MARGIN)
    water = shapely.intersection(water, area)
    land = shapely.make_valid(shapely.difference(area, water))
    coast = shapely.intersection(shapely.boundary(water), area.buffer(-1e-7))
    return to_merc(land), to_merc(coast)


def load_land_geojson(path: Path):
    """Fallback for tests: the prototype's geo.json land polygon."""
    g = json.loads(path.read_text())
    polys = [shapely.geometry.shape(f["geometry"]) for f in g["land"]["features"]]
    return dissolve(polys)


def dissolve(polys):
    area = box(DOMAIN["west"] - MARGIN, DOMAIN["south"] - MARGIN, DOMAIN["east"] + MARGIN, DOMAIN["north"] + MARGIN)
    polys = [shapely.make_valid(p) for p in polys]
    polys = [shapely.clip_by_rect(p, *area.bounds) for p in polys]
    polys = [p for p in polys if not p.is_empty]
    try:
        land = shapely.coverage_union_all(polys)
    except Exception:
        land = shapely.union_all(polys)
    land = shapely.make_valid(land)
    # shoreline = land edge, minus the artificial edges of the map-area box
    inner = area.buffer(-1e-7)
    coast = shapely.intersection(shapely.boundary(land), inner)
    log("land dissolved")
    return to_merc(land), to_merc(coast)


def load_dems(sources: Path):
    """NOAA NCEI lake grids → list of (elevation m (negative = depth), lon0, lat0, dlon, dlat)."""
    import rasterio
    out = []
    for tgz in sorted(sources.glob("*_lld.geotiff.tar.gz")):
        tmp = Path(tempfile.mkdtemp())
        with tarfile.open(tgz) as t:
            t.extractall(tmp, filter="data")
        tif = next(tmp.rglob("*.tif*"))
        with rasterio.open(tif) as ds:
            a = ds.read(1).astype(np.float32)
            nod = ds.nodata
            if nod is not None:
                a[a == nod] = np.nan
            a[(a < -1000) | (a > 1000)] = np.nan
            tr = ds.transform
            out.append({"name": tgz.name.split("_")[0], "z": a, "lon0": tr.c + tr.a / 2, "lat0": tr.f + tr.e / 2,
                        "dlon": tr.a, "dlat": tr.e, "shape": a.shape})
            log(f"depth grid {out[-1]['name']}: {a.shape[1]}×{a.shape[0]}, {abs(tr.a) * 3600:.1f}″, "
                f"deepest {np.nanmin(a):.0f} m")
    return out


def sample_dems(dems, lon, lat):
    """Bilinear sample of the first grid that has data at each point (NaN elsewhere)."""
    from scipy.ndimage import map_coordinates
    out = np.full(lon.shape, np.nan, np.float32)
    for d in dems:
        col = (lon - d["lon0"]) / d["dlon"]
        row = (lat - d["lat0"]) / d["dlat"]
        h, w = d["shape"]
        inside = (col >= 0) & (row >= 0) & (col <= w - 1) & (row <= h - 1) & np.isnan(out)
        if not inside.any():
            continue
        v = map_coordinates(np.nan_to_num(d["z"], nan=9999), [row[inside], col[inside]], order=1, mode="nearest")
        v[v > 500] = np.nan  # touched a no-data cell
        out[inside] = v
    return out


def build_contours(dems):
    """{ft: MultiLineString in Web Mercator}, from lightly smoothed grids."""
    from scipy.ndimage import gaussian_filter
    from skimage.measure import find_contours
    lines = {ft: [] for ft in CONTOUR_FT}
    for d in dems:
        from scipy.ndimage import label
        z = d["z"].copy()
        # only the big connected lake water (no inland depressions or quarries)
        lab, _ = label(np.isfinite(z) & (z < 0))
        sizes = np.bincount(lab.ravel()); sizes[0] = 0
        land = ~np.isin(lab, np.flatnonzero(sizes > 20000))
        # carry the nearest lake depth under the grid's (blocky, 90 m) land cells instead
        # of forcing them dry: otherwise every shallow line piles up along the grid's
        # staircase shore. The map draws the real shoreline on top and trims the lines.
        from scipy.ndimage import distance_transform_edt
        dist, (iy, ix) = distance_transform_edt(land, return_indices=True)
        z = np.where(land, z[iy, ix], z)
        z[land & (dist > 12)] = 5.0   # far inland stays dry (no lines across land)
        z = gaussian_filter(z, 1.2)
        for ft in CONTOUR_FT:
            level = -ft / FT
            if np.nanmin(z) > level:
                continue
            for c in find_contours(z, level):
                if len(c) < 4:
                    continue
                lon = d["lon0"] + c[:, 1] * d["dlon"]
                lat = d["lat0"] + c[:, 0] * d["dlat"]
                lines[ft].append(np.column_stack(merc(lon, lat)))
        log(f"contours {d['name']}: done")
    return {ft: shapely.MultiLineString(v) for ft, v in lines.items() if v}


# ── vector tiles ────────────────────────────────────────────────────
def encode_tile(layers, bounds):
    import mapbox_vector_tile
    minx, miny, maxx, maxy = bounds
    sx, sy = EXTENT / (maxx - minx), EXTENT / (maxy - miny)

    def local(g):
        return shapely.transform(g, lambda c: np.column_stack([(c[:, 0] - minx) * sx, (maxy - c[:, 1]) * sy]))

    out = []
    for name, feats in layers:
        fs = []
        for g, p in feats:
            if g is None or g.is_empty:
                continue
            # snap to the tile grid ourselves (valid at integer precision), then one feature per part,
            # so a single island that collapses can never drop the whole layer
            g = shapely.set_precision(local(g), 1.0)
            for part in shapely.get_parts(g):
                if part.is_empty or (part.geom_type == "Polygon" and part.area < 2):
                    continue
                if part.geom_type in ("Polygon", "LineString", "Point") or part.geom_type.startswith("Multi"):
                    fs.append({"geometry": part, "properties": p})
        if fs:
            out.append({"name": name, "features": fs})
    if not out:
        return None
    raw = mapbox_vector_tile.encode(out, default_options={"extents": EXTENT, "y_coord_down": True,
                                                          "on_invalid_geometry": mapbox_vector_tile.encoder.on_invalid_geometry_make_valid})
    return gzip.compress(raw, 6)


def build_vector_tiles(land, coast, contours, inland=None):
    tiles = {}
    full_cache = {}
    cells = 0

    def full_tile(z):
        # one shared "all land" tile (identical bytes at every zoom → stored once)
        if "t" not in full_cache:
            b = (0.0, 0.0, 1.0, 1.0)
            full_cache["t"] = encode_tile([("land", [(box(-BUFFER / EXTENT, -BUFFER / EXTENT, 1 + BUFFER / EXTENT, 1 + BUFFER / EXTENT), {})])], b)
        return full_cache["t"]

    def fill_full(z, x, y):
        for zz in range(z, LAND_MAXZ + 1):
            k = 2 ** (zz - z)
            for xx in range(x * k, x * k + k):
                for yy in range(y * k, y * k + k):
                    tiles[zxy_to_tileid(zz, xx, yy)] = full_tile(zz)

    def recurse(z, x, y, g_land, g_coast, g_cont, g_in):
        nonlocal cells
        b = tile_bounds(z, x, y)
        pad = (b[2] - b[0]) * BUFFER / EXTENT
        bb = (b[0] - pad, b[1] - pad, b[2] + pad, b[3] + pad)
        L = shapely.clip_by_rect(g_land, *bb) if g_land is not None else None
        C = shapely.clip_by_rect(g_coast, *bb) if g_coast is not None else None
        K = {ft: shapely.clip_by_rect(g, *bb) for ft, g in g_cont.items()}
        K = {ft: g for ft, g in K.items() if not g.is_empty}
        I = shapely.clip_by_rect(g_in, *bb) if g_in is not None else None
        I = None if I is None or I.is_empty else I
        L = None if L is None or L.is_empty else L
        C = None if C is None or C.is_empty else C
        if L is None and C is None and not K:
            return
        cells += 1
        tile_area = (bb[2] - bb[0]) * (bb[3] - bb[1])
        if L is not None and C is None and not K and I is None and L.area >= tile_area * 0.99999:
            fill_full(z, x, y)
            return
        if z >= LAND_MINZ:
            tol = (b[2] - b[0]) / EXTENT * (0.6 if z >= 12 else 1.0)
            layers = [
                ("land", [(shapely.simplify(L, tol), {})] if L is not None else []),
                ("coast", [(shapely.simplify(C, tol), {})] if C is not None else []),
                ("inland", [(shapely.simplify(I, tol), {})] if I is not None and z >= 7 else []),
                ("contours", [(shapely.simplify(g, tol * 1.5), {"ft": ft, "major": int(ft % 50 == 0)})
                              for ft, g in K.items() if contour_minzoom(ft) <= z]),
            ]
            data = encode_tile(layers, b)
            if data:
                tiles[zxy_to_tileid(z, x, y)] = data
        if z < LAND_MAXZ:
            for dx in (0, 1):
                for dy in (0, 1):
                    recurse(z + 1, 2 * x + dx, 2 * y + dy, L, C, K, I)

    z0 = 3
    x0, y0, x1, y1 = tile_range(z0, DOMAIN["west"], DOMAIN["south"], DOMAIN["east"], DOMAIN["north"])
    for x in range(x0, x1 + 1):
        for y in range(y0, y1 + 1):
            recurse(z0, x, y, land, coast, contours, inland)
            log(f"vector tiles: z3 {x},{y} done ({len(tiles):,} tiles so far)")
    return tiles


# ── depth (DEM) tiles ──────────────────────────────────────────────
def terrarium(elev):
    v = np.clip(elev + 32768.0, 0, 65535.99)
    r = np.floor(v / 256)
    g = np.floor(v - r * 256)
    b = np.floor((v - r * 256 - g) * 256)
    return np.dstack([r, g, b]).astype(np.uint8)


def build_dem_tiles(dems, land):
    from scipy.ndimage import distance_transform_edt
    tiles = {}
    for z in range(DEM_MINZ, DEM_MAXZ + 1):
        x0, y0, x1, y1 = tile_range(z, DOMAIN["west"], DOMAIN["south"], DOMAIN["east"], DOMAIN["north"])
        n = 0
        for x in range(x0, x1 + 1):
            for y in range(y0, y1 + 1):
                b = tile_bounds(z, x, y)
                L = shapely.clip_by_rect(land, *b)
                # pixel centres
                px = (np.arange(256) + 0.5) / 256
                mx = b[0] + px * (b[2] - b[0])
                my = b[3] - px * (b[3] - b[1])
                MX, MY = np.meshgrid(mx, my)
                lon = MX / R * 180 / math.pi
                lat = np.degrees(2 * np.arctan(np.exp(MY / R)) - math.pi / 2)
                # water = not land (rasterised from the same OSM land as the vector tiles)
                img = Image.new("L", (256, 256), 0)
                if not L.is_empty:
                    d = ImageDraw.Draw(img)
                    sx = 256 / (b[2] - b[0])
                    for poly in getattr(L, "geoms", [L]):
                        if poly.geom_type != "Polygon":
                            continue
                        d.polygon([((cx - b[0]) * sx, (b[3] - cy) * sx) for cx, cy in poly.exterior.coords], fill=255)
                        for hole in poly.interiors:
                            d.polygon([((cx - b[0]) * sx, (b[3] - cy) * sx) for cx, cy in hole.coords], fill=0)
                water = np.asarray(img) < 128
                if not water.any():
                    continue
                elev = sample_dems(dems, lon, lat)
                good = water & np.isfinite(elev) & (elev < 0)
                if not good.any():
                    continue
                if (water & ~good).any():
                    _, (iy, ix) = distance_transform_edt(~good, return_indices=True)
                    elev = np.where(good, elev, elev[iy, ix])
                # land pixels next to the water carry the nearest water depth: this raster is
                # only ~150 m per pixel at z10, so a hard edge here would leave uncolored gaps
                # along the real shoreline when zoomed in. The map draws the exact land on top.
                wet = water & np.isfinite(elev)
                if wet.any() and (~wet).any():
                    dist, (iy, ix) = distance_transform_edt(~wet, return_indices=True)
                    near = np.minimum(elev[iy, ix], -0.3)
                    elev = np.where(water, np.minimum(elev, -0.3), np.where(dist <= 6, near, 2.0))
                else:
                    elev = np.where(water, np.minimum(elev, -0.3), 2.0)
                buf = io.BytesIO()
                Image.fromarray(terrarium(elev), "RGB").save(buf, "PNG", optimize=True)
                tiles[zxy_to_tileid(z, x, y)] = buf.getvalue()
                n += 1
        log(f"depth tiles z{z}: {n}")
    return tiles


def write_pmtiles(path: Path, tiles: dict, tile_type, compression, minz, maxz, meta):
    from pmtiles.tile import Compression, TileType  # noqa: F401
    from pmtiles.writer import Writer
    with open(path, "wb") as f:
        w = Writer(f)
        for tid in sorted(tiles):
            w.write_tile(tid, tiles[tid])
        w.finalize({
            "tile_type": tile_type, "tile_compression": compression,
            "min_zoom": minz, "max_zoom": maxz,
            "min_lon_e7": int(DOMAIN["west"] * 1e7), "min_lat_e7": int(DOMAIN["south"] * 1e7),
            "max_lon_e7": int(DOMAIN["east"] * 1e7), "max_lat_e7": int(DOMAIN["north"] * 1e7),
            "center_zoom": 6, "center_lon_e7": int(-84.5 * 1e7), "center_lat_e7": int(45.0 * 1e7),
        }, meta)
    log(f"{path.name}: {len(tiles):,} tiles, {path.stat().st_size / 1e6:.1f} MB")


def main(argv=None):
    global LAND_MAXZ
    from pmtiles.tile import Compression, TileType
    ap = argparse.ArgumentParser()
    ap.add_argument("--sources", default="static-build/sources")
    ap.add_argument("--out", default="static-build/dist")
    ap.add_argument("--land-geojson", help="test only: use a geo.json land polygon instead of OSM")
    ap.add_argument("--maxzoom", type=int, default=13)
    args = ap.parse_args(argv)
    LAND_MAXZ = args.maxzoom
    src, out = Path(args.sources), Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    dems = load_dems(src)
    if args.land_geojson:
        land, coast = load_land_geojson(Path(args.land_geojson))
    elif list(src.glob("osm-*.xml.gz")):
        land, coast = load_lakes_osm_xml(src)
    elif (src / "greatlakes-osm.json.gz").exists():
        land, coast = load_lakes_osm(src)
    else:
        log("OpenStreetMap lake outlines not found — using the NOAA grid shoreline")
        land, coast = load_lakes_dem(dems)
    contours = build_contours(dems) if dems else {}
    inland = load_ofm_water(src, land)
    vt = build_vector_tiles(land, coast, contours, inland)
    attribution = ("© OpenStreetMap contributors (land) · NOAA NCEI Great Lakes Bathymetry (depth)")
    write_pmtiles(out / "lakes-v2.pmtiles", vt, TileType.MVT, Compression.GZIP, LAND_MINZ, LAND_MAXZ, {
        "name": "PierCast lakes", "attribution": attribution,
        "vector_layers": [{"id": "land", "fields": {}}, {"id": "coast", "fields": {}}, {"id": "inland", "fields": {}},
                          {"id": "contours", "fields": {"ft": "Number", "major": "Number"}}]})
    if dems:
        dt = build_dem_tiles(dems, land)
        write_pmtiles(out / "depth-v1.pmtiles", dt, TileType.PNG, Compression.NONE, DEM_MINZ, DEM_MAXZ, {
            "name": "PierCast depth", "attribution": "NOAA NCEI Great Lakes Bathymetry", "encoding": "terrarium"})
    log("done")


if __name__ == "__main__":
    main()
