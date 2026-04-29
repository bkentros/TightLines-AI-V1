#!/usr/bin/env python3
"""
Offline dev-only Water Reader geometry audit (vector-only, no imagery, no DB writes).
See README.md for scope and limitations.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

import psycopg
from jinja2 import Environment, BaseLoader
from pyproj import CRS, Transformer
from shapely import make_valid, from_geojson
from shapely.geometry import (
    GeometryCollection,
    LineString,
    MultiLineString,
    MultiPolygon,
    Point,
    Polygon,
    mapping,
)
from shapely.geometry.base import BaseGeometry
from shapely.ops import transform, unary_union


DEFAULT_DENSIFY_STEP_M = 22.0
DEFAULT_STRIDE_M = 56.0
DEFAULT_ARC_LENGTHS_M = [240.0, 400.0, 600.0, 900.0, 1200.0, 1500.0]
MIN_SCORE_ARC_LENGTH_M = 80.0
MAX_ARC_FRACTION_OF_PERIMETER = 0.20
DEFAULT_RIBBON_WIDTH_M = 48.0
MIN_RIBBON_AREA_M2 = 4200.0
RIBBON_SHAPE_METHOD = "offset_strip_flat_ends"
WATER_SIDE_PROBE_M = 5.0
MIN_WATER_SIDE_PROBE_SUCCESS_RATE = 0.62
MAX_SMOOTH_DRIFT_M = 18.0
NMS_MIDPOINT_SEPARATION_M = 230.0
RIBBON_SURFACE_GAP_M = 118.0
RIBBON_OVERLAP_BUFFER_M = 8.0
PAIRWISE_GAP_TIGHT_M = 96.0
FOCUS_SAMPLE_STEP_M = 15.0
FOCUS_MIN_DEPTH_M = 32.0
FOCUS_ABS_MAX_DEPTH_M = 120.0
FOCUS_BUILD_METHOD = "sampled_normal_focus_area_v1"
FOCUS_DISPLAY_SIMPLIFY_TOLERANCE_M = 8.0
FOCUS_DISPLAY_MAX_DRIFT_M = 16.0
# Display-only widening: keep raw focus polygons conservative, but the visual
# review hero (`focus_area_polygon_display`) is expanded a bounded amount into
# open water, then clipped by a slightly inset basin so its outline never sits
# exactly on the shoreline or interior-ring (island) edge.
FOCUS_DISPLAY_TARGET_EFFECTIVE_WIDTH_M = 42.0
FOCUS_DISPLAY_MAX_EXPAND_M = 22.0
FOCUS_DISPLAY_BASIN_INSET_M = 2.5
FOCUS_DISPLAY_ISLAND_KEEPOUT_M = 4.0
LONG_SIMPLE_FOCUS_ABS_MAX_DEPTH_M = 480.0
LONG_SIMPLE_MIN_CORRIDOR_LENGTH_M = 1500.0
LONG_SIMPLE_TARGET_CORRIDOR_LENGTH_M = 2400.0
LONG_SIMPLE_MAX_CORRIDOR_LENGTH_M = 3200.0
LONG_SIMPLE_DISPLAY_TARGET_EFFECTIVE_WIDTH_M = 360.0
LONG_SIMPLE_DISPLAY_MAX_EXPAND_M = 240.0
LONG_SIMPLE_MAX_CANDIDATES = 4
LONG_SIMPLE_MIN_CANDIDATES = 3
# NMS / visible candidate: require a filled water lobe, not a shoreline trace.
FOCUS_SELECTION_MAX_FRAGMENTS = 1
FOCUS_SELECTION_MIN_EFFECTIVE_WIDTH_M = 14.5
FOCUS_SELECTION_MIN_DEPTH_NOMINAL_M = 26.0
FOCUS_SELECTION_MIN_DEPTH_MAX_M = 14.0
FOCUS_SELECTION_MIN_AREA_FLOOR_M2 = 6200.0
FOCUS_SELECTION_MIN_AREA_COEF = 0.27
FOCUS_SELECTION_TRACE_AREA_RATIO = 0.22
FOCUS_SELECTION_TRACE_HAUSDORFF_FACTOR = 0.86


def parse_arc_lengths_csv(s: str) -> list[float]:
    parts = [p.strip() for p in s.split(",") if p.strip()]
    if not parts:
        return list(DEFAULT_ARC_LENGTHS_M)
    out: list[float] = []
    for p in parts:
        v = float(p)
        if v <= 0:
            raise ValueError(f"arc length must be positive, got {v}")
        out.append(v)
    return sorted(set(out))


SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_SEED = SCRIPT_DIR / "lake_set_seed.json"


def env_db_url() -> str | None:
    return os.environ.get("DATABASE_URL") or os.environ.get("V1_DATABASE_URL")


def load_seed(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def utm_crs_from_wgs84_point(lon: float, lat: float) -> CRS:
    zone = int((lon + 180) / 6) + 1
    south = lat < 0
    return CRS.from_dict({"proj": "utm", "zone": zone, "ellps": "WGS84", "south": south})


def to_metric(geom_4326: BaseGeometry, lon: float, lat: float) -> tuple[BaseGeometry, Transformer]:
    dst = utm_crs_from_wgs84_point(lon, lat)
    fwd = Transformer.from_crs(CRS.from_epsg(4326), dst, always_xy=True)
    rev = Transformer.from_crs(dst, CRS.from_epsg(4326), always_xy=True)

    def f_fwd(x: float, y: float) -> tuple[float, float]:
        return fwd.transform(x, y)

    return transform(f_fwd, geom_4326), rev


def collect_polygons(g: BaseGeometry) -> list[Polygon]:
    if isinstance(g, Polygon):
        return [g]
    if isinstance(g, MultiPolygon):
        return list(g.geoms)
    if isinstance(g, GeometryCollection):
        out: list[Polygon] = []
        for sub in g.geoms:
            out.extend(collect_polygons(sub))
        return out
    return []


def polygon_area_m2(poly: Polygon, lon: float, lat: float) -> float:
    m, _ = to_metric(poly, lon, lat)
    return float(m.area)


def basin_shape_mode_metrics(basin_metric: Polygon) -> dict[str, Any]:
    area = max(float(basin_metric.area), 1.0)
    perimeter = max(float(basin_metric.exterior.length), 1.0)
    compactness = (4.0 * math.pi * area) / (perimeter * perimeter)
    shoreline_development = perimeter / max(2.0 * math.sqrt(math.pi * area), 1.0)
    elongation = 1.0
    rect_fill_ratio = None
    major_axis_m = None
    minor_axis_m = None
    try:
        rect = basin_metric.minimum_rotated_rectangle
        rc = list(rect.exterior.coords)
        edges: list[float] = []
        for i in range(len(rc) - 1):
            edges.append(math.hypot(rc[i + 1][0] - rc[i][0], rc[i + 1][1] - rc[i][1]))
        edges = sorted([e for e in edges if e > 1.0], reverse=True)
        if len(edges) >= 2:
            major_axis_m = edges[0]
            minor_axis_m = edges[-1]
            elongation = edges[0] / max(edges[-1], 1.0)
            rect_fill_ratio = area / max(float(rect.area), 1.0)
    except Exception:
        pass

    if elongation >= 5.0 and (rect_fill_ratio is None or rect_fill_ratio >= 0.22):
        mode = "long_simple_basin"
    elif elongation >= 3.5 and shoreline_development <= 2.6 and compactness <= 0.22:
        mode = "long_simple_basin"
    elif elongation >= 3.0 or shoreline_development <= 2.2:
        mode = "mixed"
    else:
        mode = "complex_shoreline"

    return {
        "lakeShapeMode": mode,
        "basinElongation": round(float(elongation), 3),
        "basinCompactness": round(float(compactness), 4),
        "basinShorelineDevelopment": round(float(shoreline_development), 3),
        "basinRectFillRatio": round(float(rect_fill_ratio), 4) if rect_fill_ratio is not None else None,
        "basinMajorAxisM": round(float(major_axis_m), 2) if major_axis_m is not None else None,
        "basinMinorAxisM": round(float(minor_axis_m), 2) if minor_axis_m is not None else None,
    }


def isolate_basin(
    geom_4326: BaseGeometry,
    centroid_4326: Point,
    lon: float,
    lat: float,
    *,
    sliver_ratio: float = 0.002,
    min_sliver_m2: float = 2000.0,
) -> tuple[Polygon | None, dict[str, Any]]:
    """
    Returns (primary_polygon_wgs84, metadata with qa_flags partial list).
    """
    qa: dict[str, Any] = {"qa_flags": []}
    valid = make_valid(geom_4326)
    polys = collect_polygons(valid)
    if not polys:
        qa["qa_flags"].append("no_polygon_geometry")
        return None, qa

    areas = [(p, polygon_area_m2(p, lon, lat)) for p in polys]
    max_a = max(a for _, a in areas)
    thresh = max(min_sliver_m2, sliver_ratio * max_a)
    kept = [(p, a) for p, a in areas if a >= thresh]
    removed = len(polys) - len(kept)
    if removed > 0:
        qa["qa_flags"].append("sliver_components_removed")
    if not kept:
        qa["qa_flags"].append("all_components_sliver_filtered")
        return None, qa

    if len(kept) > 1:
        areas_sorted = sorted((a for _, a in kept), reverse=True)
        if len(areas_sorted) >= 2 and areas_sorted[1] > 0.4 * areas_sorted[0]:
            qa["qa_flags"].append("multipart_or_adjacent_water_suspicion")
        qa["qa_flags"].append("ambiguous_multipart")

    point_in = [(p, a) for p, a in kept if p.covers(centroid_4326)]

    chosen: Polygon | None = None
    component_rank = "centroid_contained"
    if point_in:
        chosen = max(point_in, key=lambda x: x[1])[0]
    else:
        qa["qa_flags"].append("centroid_not_in_primary_component")
        # Nearest representative-point distance, tie-break by area
        def score(p: Polygon, a: float) -> tuple[float, float]:
            d = p.exterior.distance(centroid_4326)
            return (d, -a)

        chosen = min(kept, key=lambda pa: score(pa[0], pa[1]))[0]
        component_rank = "largest_or_nearest_fallback"

    qa["component_rank"] = component_rank
    qa["basin_isolation"] = (
        "single_dominant"
        if len(kept) == 1
        else ("multipart_centroid_match" if "centroid_not_in_primary_component" not in qa["qa_flags"] else "multipart_fallback")
    )
    return chosen, qa


def densify_linestring(line: LineString, step_m: float) -> LineString:
    if line.length <= 0:
        return line
    dists = []
    d = 0.0
    while d < line.length:
        dists.append(d)
        d += step_m
    if not dists or dists[-1] < line.length - 1e-6:
        dists.append(line.length)
    pts = [line.interpolate(t) for t in dists]
    coords = [(p.x, p.y) for p in pts]
    return LineString(coords)


def smooth_coords(coords: list[tuple[float, float]], window: int) -> list[tuple[float, float]]:
    if window < 3 or len(coords) < window:
        return coords
    w = window // 2
    out: list[tuple[float, float]] = []
    n = len(coords)
    for i in range(n):
        j0 = max(0, i - w)
        j1 = min(n, i + w + 1)
        xs = [coords[j][0] for j in range(j0, j1)]
        ys = [coords[j][1] for j in range(j0, j1)]
        out.append((sum(xs) / len(xs), sum(ys) / len(ys)))
    return out


def bearing(a: tuple[float, float], b: tuple[float, float], c: tuple[float, float]) -> float:
    ax, ay = a
    bx, by = b
    cx, cy = c
    a1 = math.degrees(math.atan2(by - ay, bx - ax))
    a2 = math.degrees(math.atan2(cy - by, cx - bx))
    d = a2 - a1
    while d > 180:
        d -= 360
    while d < -180:
        d += 360
    return d


def arc_metrics(coords: list[tuple[float, float]]) -> tuple[float, float, float]:
    """Returns (cumulative_abs_bearing_deg, path_length, straight_dist)."""
    if len(coords) < 3:
        return 0.0, 0.0, 0.0
    turn = 0.0
    seg_len = 0.0
    for i in range(1, len(coords) - 1):
        turn += abs(bearing(coords[i - 1], coords[i], coords[i + 1]))
    for i in range(len(coords) - 1):
        dx = coords[i + 1][0] - coords[i][0]
        dy = coords[i + 1][1] - coords[i][1]
        seg_len += math.hypot(dx, dy)
    sx, sy = coords[0]
    ex, ey = coords[-1]
    straight = math.hypot(ex - sx, ey - sy)
    return turn, seg_len, straight


def line_length_m(coords: list[tuple[float, float]]) -> float:
    length = 0.0
    for i in range(len(coords) - 1):
        dx = coords[i + 1][0] - coords[i][0]
        dy = coords[i + 1][1] - coords[i][1]
        length += math.hypot(dx, dy)
    return length


def max_pairwise_drift_m(
    a: list[tuple[float, float]],
    b: list[tuple[float, float]],
) -> float:
    n = min(len(a), len(b))
    if n == 0:
        return 0.0
    return max(math.hypot(a[i][0] - b[i][0], a[i][1] - b[i][1]) for i in range(n))


def score_arc(
    turn_abs_deg: float,
    length_m: float,
    straight_m: float,
    accepted_midpoints: list[tuple[float, float]],
    arc_coords: list[tuple[float, float]],
) -> float:
    if length_m < 80 or straight_m < 1e-3:
        return -1.0
    sinuosity = length_m / straight_m
    sinuosity_term = min(max(sinuosity - 1.0, 0.0), 2.0) / 2.0
    turn_density = turn_abs_deg / length_m
    turn_term = min(turn_density / 2.5, 1.0)
    len_ideal = 520.0
    len_sigma = 380.0
    len_term = math.exp(-((length_m - len_ideal) ** 2) / (2 * len_sigma**2))
    mx = sum(c[0] for c in arc_coords) / len(arc_coords)
    my = sum(c[1] for c in arc_coords) / len(arc_coords)
    sep_pen = 0.0
    min_sep = 90.0
    for ax, ay in accepted_midpoints:
        if math.hypot(mx - ax, my - ay) < min_sep:
            sep_pen += 0.25
    base = 0.30 * sinuosity_term + 0.36 * turn_term + 0.34 * len_term
    return max(0.0, base - sep_pen)


def net_signed_bend_deg(coords: list[tuple[float, float]]) -> float:
    """Sum of signed vertex bends along the arc (CCW lake ring: positive → more left / bay; negative → right / protrusion)."""
    if len(coords) < 3:
        return 0.0
    t = 0.0
    for i in range(1, len(coords) - 1):
        t += bearing(coords[i - 1], coords[i], coords[i + 1])
    return t


def classify_arc_geometry(
    coords: list[tuple[float, float]],
    meta: dict[str, Any],
    basin_metric: Polygon,
) -> tuple[str, dict[str, float], list[str]]:
    flags: list[str] = []
    net = net_signed_bend_deg(coords)
    sinu = float(meta.get("sinuosity", 1.0))
    turn_abs = float(meta.get("turn_abs_deg", 0.0))
    path_m = float(meta.get("arc_length_m", 0.0))
    probe = water_side_probe(basin_metric, coords)
    asym = 0.0
    v = int(probe.get("valid") or 0)
    if v > 0:
        asym = abs(int(probe.get("left_hits", 0)) - int(probe.get("right_hits", 0))) / v
    extra: dict[str, float] = {
        "arcNetSignedBendDeg": round(net, 3),
        "probeAsymmetry": round(asym, 4),
    }
    if len(coords) < 6 or path_m < 110.0:
        flags.append("feature_class_uncertain_short_arc")
        return "mixed_complexity", extra, flags
    if abs(net) < 16.0 and sinu < 1.09:
        flags.append("feature_class_uncertain")
        return "mixed_complexity", extra, flags
    # CCW exterior: positive net → left-turn-heavy → indent / bay; negative → protrusion.
    if net >= 24.0 and sinu >= 1.1:
        return "concave_pocket_cove", extra, flags
    if net <= -24.0:
        return "convex_point_protrusion", extra, flags
    turn_rate = turn_abs / max(path_m, 1.0)
    if sinu >= 1.14 or turn_rate >= 0.33:
        return "shoreline_bend", extra, flags
    return "mixed_complexity", extra, flags


def diversify_adjust_score(base: float, meta: dict[str, Any], feature_class: str) -> float:
    s = float(base)
    sinu = float(meta.get("sinuosity", 1.0))
    length_m = float(meta.get("arc_length_m", 0.0))
    if feature_class == "convex_point_protrusion":
        s += 0.075
    elif feature_class == "shoreline_bend":
        s += 0.045
    if length_m >= 520.0:
        s += 0.035
    if feature_class == "concave_pocket_cove" and sinu > 1.72:
        s *= 0.9
    return min(1.35, max(0.0, s))


PickDict = dict[str, Any]
ScoredArc = tuple[float, LineString, list[tuple[float, float]], dict[str, float]]


def select_candidates_ribbon_aware(
    scored: list[ScoredArc],
    basin_m: Polygon,
    *,
    ribbon_width_m: float,
    min_ribbon_area_m2: float,
    min_midpoint_separation_m: float,
    min_ribbon_surface_gap_m: float,
    ribbon_overlap_buffer_m: float,
    max_out: int,
    min_out: int,
    score_floor_frac: float,
    focus_scale_mode: str = "local_lobe",
) -> tuple[list[PickDict], dict[str, int]]:
    stats = {
        "ribbon_overlap_touch_rejected": 0,
        "ribbon_midpoint_rejected": 0,
        "ribbon_min_area_rejected": 0,
        "ribbon_build_failed_selection": 0,
        "focus_quality_rejected": 0,
    }
    scored_sorted = sorted(scored, key=lambda x: x[0], reverse=True)
    if not scored_sorted:
        return [], stats
    best_score = scored_sorted[0][0]
    floor = best_score * score_floor_frac
    picks: list[PickDict] = []

    for item in scored_sorted:
        s, line_m, coords, meta = item
        if s < floor and len(picks) >= min_out:
            break
        mx = sum(c[0] for c in coords) / len(coords)
        my = sum(c[1] for c in coords) / len(coords)
        too_close_mid = False
        for p in picks:
            ox, oy = p["mid"]
            if math.hypot(mx - ox, my - oy) < min_midpoint_separation_m:
                stats["ribbon_midpoint_rejected"] += 1
                too_close_mid = True
                break
        if too_close_mid:
            continue

        ribbon_m, ribbon_meta, rflags = build_water_side_ribbon(
            basin_m, line_m, coords, ribbon_width_m=ribbon_width_m
        )
        if ribbon_m is None:
            stats["ribbon_build_failed_selection"] += 1
            continue
        r_area = float(ribbon_meta.get("ribbonAreaM2") or 0.0)
        if r_area < min_ribbon_area_m2:
            stats["ribbon_min_area_rejected"] += 1
            continue

        blocked = False
        for p in picks:
            prev_r: BaseGeometry = p["ribbon_m"]
            dist_g = float(ribbon_m.distance(prev_r))
            if dist_g < min_ribbon_surface_gap_m:
                stats["ribbon_overlap_touch_rejected"] += 1
                blocked = True
                break
            try:
                if ribbon_m.buffer(ribbon_overlap_buffer_m).intersects(prev_r):
                    stats["ribbon_overlap_touch_rejected"] += 1
                    blocked = True
                    break
            except Exception:
                pass
        if blocked:
            continue

        basin_area_m2 = float(basin_m.area)
        probe_focus = water_side_probe(basin_m, coords)
        focus_m, focus_meta, focus_flags = build_sampled_normal_focus_polygon(
            basin_m,
            line_m,
            coords,
            feature_class=str(meta.get("featureClass", "mixed_complexity")),
            basin_area_m2=basin_area_m2,
            arc_meta=dict(meta),
            probe=probe_focus,
            focus_scale_mode=focus_scale_mode,
        )
        ok_focus, _ = validate_focus_polygon_for_selection(
            focus_m, focus_meta, float(line_m.length)
        )
        if not ok_focus:
            stats["focus_quality_rejected"] += 1
            continue

        picks.append(
            {
                "item": item,
                "ribbon_m": ribbon_m,
                "ribbon_meta": ribbon_meta,
                "ribbon_flags": rflags,
                "mid": (mx, my),
                "focus_m": focus_m,
                "focus_meta": focus_meta,
                "focus_flags": focus_flags,
            }
        )
        if len(picks) >= max_out:
            break

    return picks, stats


def _pick_passes_separation(
    ribbon_m: BaseGeometry,
    mid: tuple[float, float],
    picks: list[PickDict],
    *,
    self_idx: int,
    min_midpoint_separation_m: float,
    min_ribbon_surface_gap_m: float,
    ribbon_overlap_buffer_m: float,
) -> bool:
    mx, my = mid
    for j, p2 in enumerate(picks):
        if j == self_idx:
            continue
        ox, oy = p2["mid"]
        if math.hypot(mx - ox, my - oy) < min_midpoint_separation_m:
            return False
        dist_g = float(ribbon_m.distance(p2["ribbon_m"]))
        if dist_g < min_ribbon_surface_gap_m:
            return False
        try:
            if ribbon_m.buffer(ribbon_overlap_buffer_m).intersects(p2["ribbon_m"]):
                return False
        except Exception:
            pass
    return True


def diversity_swap_protrusion(
    picks: list[PickDict],
    pool: list[ScoredArc],
    basin_m: Polygon,
    *,
    ribbon_width_m: float,
    min_ribbon_area_m2: float,
    min_midpoint_separation_m: float,
    min_ribbon_surface_gap_m: float,
    ribbon_overlap_buffer_m: float,
    focus_scale_mode: str = "local_lobe",
) -> tuple[list[PickDict], bool]:
    if not picks:
        return picks, False
    classes = [str(p["item"][3].get("featureClass", "")) for p in picks]
    if any(c == "convex_point_protrusion" for c in classes):
        return picks, False
    worst_i = min(range(len(picks)), key=lambda i: float(picks[i]["item"][0]))
    worst_s = float(picks[worst_i]["item"][0])
    protrusions = [
        it
        for it in pool
        if str(it[3].get("featureClass")) == "convex_point_protrusion" and float(it[0]) >= worst_s * 0.82
    ]
    protrusions.sort(key=lambda x: float(x[0]), reverse=True)
    for it in protrusions:
        s, line_m, coords, meta = it
        ribbon_m, ribbon_meta, rflags = build_water_side_ribbon(
            basin_m, line_m, coords, ribbon_width_m=ribbon_width_m
        )
        if ribbon_m is None:
            continue
        if float(ribbon_meta.get("ribbonAreaM2") or 0.0) < min_ribbon_area_m2:
            continue
        basin_area_m2 = float(basin_m.area)
        probe_try = water_side_probe(basin_m, coords)
        focus_m_try, focus_meta_try, focus_flags_try = build_sampled_normal_focus_polygon(
            basin_m,
            line_m,
            coords,
            feature_class=str(meta.get("featureClass", "mixed_complexity")),
            basin_area_m2=basin_area_m2,
            arc_meta=dict(meta),
            probe=probe_try,
            focus_scale_mode=focus_scale_mode,
        )
        if not validate_focus_polygon_for_selection(focus_m_try, focus_meta_try, float(line_m.length))[0]:
            continue
        mx = sum(c[0] for c in coords) / len(coords)
        my = sum(c[1] for c in coords) / len(coords)
        trial = list(picks)
        trial[worst_i] = {
            "item": it,
            "ribbon_m": ribbon_m,
            "ribbon_meta": ribbon_meta,
            "ribbon_flags": rflags,
            "mid": (mx, my),
            "focus_m": focus_m_try,
            "focus_meta": focus_meta_try,
            "focus_flags": focus_flags_try,
        }
        ok = True
        for k in range(len(trial)):
            if not _pick_passes_separation(
                trial[k]["ribbon_m"],
                trial[k]["mid"],
                trial,
                self_idx=k,
                min_midpoint_separation_m=min_midpoint_separation_m,
                min_ribbon_surface_gap_m=min_ribbon_surface_gap_m,
                ribbon_overlap_buffer_m=ribbon_overlap_buffer_m,
            ):
                ok = False
                break
        if ok:
            return trial, True
    return picks, False


def pairwise_ribbon_gap_stats(ribbon_geoms: list[BaseGeometry]) -> tuple[float | None, float | None]:
    if len(ribbon_geoms) < 2:
        return None, None
    ds: list[float] = []
    for i in range(len(ribbon_geoms)):
        for j in range(i + 1, len(ribbon_geoms)):
            ds.append(float(ribbon_geoms[i].distance(ribbon_geoms[j])))
    if not ds:
        return None, None
    return min(ds), sum(ds) / len(ds)


def nearest_neighbor_ribbon_m(ribbon_geoms: list[BaseGeometry], idx: int) -> float | None:
    if len(ribbon_geoms) < 2:
        return None
    dbest = 1e18
    for j in range(len(ribbon_geoms)):
        if j == idx:
            continue
        d = float(ribbon_geoms[idx].distance(ribbon_geoms[j]))
        if d < dbest:
            dbest = d
    return dbest if dbest < 1e17 else None


def water_side_probe(
    basin_metric: Polygon,
    coords: list[tuple[float, float]],
    *,
    probe_m: float = WATER_SIDE_PROBE_M,
) -> dict[str, Any]:
    left_hits = 0
    right_hits = 0
    valid = 0
    for i in range(len(coords) - 1):
        x0, y0 = coords[i]
        x1, y1 = coords[i + 1]
        dx = x1 - x0
        dy = y1 - y0
        seg_len = math.hypot(dx, dy)
        if seg_len <= 1e-6:
            continue
        valid += 1
        mx = (x0 + x1) / 2
        my = (y0 + y1) / 2
        nx = -dy / seg_len
        ny = dx / seg_len
        if basin_metric.covers(Point(mx + nx * probe_m, my + ny * probe_m)):
            left_hits += 1
        if basin_metric.covers(Point(mx - nx * probe_m, my - ny * probe_m)):
            right_hits += 1

    if valid == 0:
        return {"side": None, "success_rate": 0.0, "left_hits": 0, "right_hits": 0, "valid": 0}

    best = max(left_hits, right_hits)
    side = "left" if left_hits > right_hits else ("right" if right_hits > left_hits else None)
    return {
        "side": side,
        "success_rate": best / valid,
        "left_hits": left_hits,
        "right_hits": right_hits,
        "valid": valid,
    }


def interior_ring_distance_m(basin_metric: Polygon, line_m: LineString) -> float | None:
    rings = list(basin_metric.interiors)
    if not rings:
        return None
    return min(line_m.distance(LineString(ring.coords)) for ring in rings)


def _seg_left_normal(
    coords: list[tuple[float, float]], i: int
) -> tuple[float, float] | None:
    """Unit normal to the left of segment coords[i] → coords[i + 1]."""
    x0, y0 = coords[i]
    x1, y1 = coords[i + 1]
    dx, dy = x1 - x0, y1 - y0
    sl = math.hypot(dx, dy)
    if sl < 1e-9:
        return None
    return (-dy / sl, dx / sl)


def _vertex_miter_normal(coords: list[tuple[float, float]], i: int) -> tuple[float, float] | None:
    if i == 0:
        return _seg_left_normal(coords, 0)
    if i == len(coords) - 1:
        return _seg_left_normal(coords, len(coords) - 2)
    a = _seg_left_normal(coords, i - 1)
    b = _seg_left_normal(coords, i)
    if a is None:
        return b
    if b is None:
        return a
    sx, sy = a[0] + b[0], a[1] + b[1]
    sl = math.hypot(sx, sy)
    if sl < 1e-9:
        return a
    return (sx / sl, sy / sl)


def _dedupe_consecutive_coords(coords: list[tuple[float, float]]) -> list[tuple[float, float]]:
    if not coords:
        return []
    out = [coords[0]]
    for x, y in coords[1:]:
        px, py = out[-1]
        if math.hypot(x - px, y - py) > 1e-5:
            out.append((x, y))
    return out


def build_shoreline_offset_strip(
    coords: list[tuple[float, float]],
    *,
    side: str,
    width_m: float,
) -> Polygon | None:
    """
    Shoreline-following quadrilateral strip: densified arc + parallel offset chain,
    closed with straight segments at ends (no round buffer caps).
    """
    coords = _dedupe_consecutive_coords(coords)
    if len(coords) < 2:
        return None
    sign = 1.0 if side == "left" else -1.0
    offset_pts: list[tuple[float, float]] = []
    for i in range(len(coords)):
        n = _vertex_miter_normal(coords, i)
        if n is None:
            continue
        nx, ny = n
        px, py = coords[i]
        offset_pts.append((px + sign * width_m * nx, py + sign * width_m * ny))
    if len(offset_pts) != len(coords):
        return None
    ring = list(coords) + list(reversed(offset_pts))
    if len(ring) < 4:
        return None
    try:
        poly = Polygon(ring)
    except Exception:
        return None
    if not poly.is_valid:
        poly = make_valid(poly)
    polys = collect_polygons(poly)
    if not polys:
        return None
    polys.sort(key=lambda p: p.area, reverse=True)
    return polys[0]


def ribbon_island_overlap_m2(basin_metric: Polygon, ribbon: BaseGeometry) -> float:
    holes: list[Polygon] = []
    for ring in basin_metric.interiors:
        holes.append(Polygon(ring))
    if not holes:
        return 0.0
    u = unary_union(holes)
    return float(ribbon.intersection(u).area)


def build_water_side_ribbon(
    basin_metric: Polygon,
    line_m: LineString,
    coords: list[tuple[float, float]],
    *,
    ribbon_width_m: float = DEFAULT_RIBBON_WIDTH_M,
) -> tuple[BaseGeometry | None, dict[str, Any], list[str]]:
    flags: list[str] = []
    probe = water_side_probe(basin_metric, coords)
    side = probe["side"]
    success_rate = float(probe["success_rate"])

    if side is None or success_rate < MIN_WATER_SIDE_PROBE_SUCCESS_RATE:
        flags.append("water_side_ambiguous" if side is not None else "water_side_probe_failed")
        return None, {
            "ribbonWidthM": ribbon_width_m,
            "ribbonAreaM2": 0.0,
            "ribbonShapeMethod": RIBBON_SHAPE_METHOD,
            "ribbonCoverageRatio": 0.0,
            "ribbonMaxOutsideBasinM2": 0.0,
            "ribbonPostClipOutsideBasinM2": 0.0,
            "ribbonIslandOverlapM2": 0.0,
            "waterSideMethod": "segment_midpoint_probe_5m",
            "waterSideProbeSuccessRate": round(success_rate, 4),
            "clipStatus": "not_built_water_side_ambiguous",
        }, flags

    ring_dist = interior_ring_distance_m(basin_metric, line_m)
    eff_width = float(ribbon_width_m)
    perimeter = float(basin_metric.exterior.length)
    eff_width = min(eff_width, perimeter * 0.014)
    if ring_dist is not None:
        eff_width = min(eff_width, max(16.0, float(ring_dist) * 0.52))
    eff_width = max(8.0, eff_width)

    raw_strip = build_shoreline_offset_strip(coords, side=side, width_m=eff_width)
    if raw_strip is None or raw_strip.is_empty:
        flags.append("ribbon_strip_build_failed")
        return None, {
            "ribbonWidthM": round(eff_width, 3),
            "ribbonAreaM2": 0.0,
            "ribbonShapeMethod": RIBBON_SHAPE_METHOD,
            "ribbonCoverageRatio": 0.0,
            "ribbonMaxOutsideBasinM2": 0.0,
            "ribbonPostClipOutsideBasinM2": 0.0,
            "ribbonIslandOverlapM2": 0.0,
            "waterSideMethod": "segment_midpoint_probe_5m",
            "waterSideProbeSuccessRate": round(success_rate, 4),
            "clipStatus": "strip_unusable",
        }, flags

    try:
        max_outside = float(max(0.0, raw_strip.difference(basin_metric).area))
    except Exception:
        max_outside = 0.0
    island_pre = ribbon_island_overlap_m2(basin_metric, raw_strip)
    if island_pre > 2.0:
        flags.append("ribbon_strip_intersects_interior_ring")

    clipped = make_valid(raw_strip.intersection(basin_metric).buffer(-0.05))

    if clipped.is_empty:
        flags.append("ribbon_empty_after_clip")
        return None, {
            "ribbonWidthM": round(eff_width, 3),
            "ribbonAreaM2": 0.0,
            "ribbonShapeMethod": RIBBON_SHAPE_METHOD,
            "ribbonCoverageRatio": 0.0,
            "ribbonMaxOutsideBasinM2": round(max_outside, 3),
            "ribbonPostClipOutsideBasinM2": 0.0,
            "ribbonIslandOverlapM2": round(island_pre, 3),
            "waterSideMethod": "segment_midpoint_probe_5m",
            "waterSideProbeSuccessRate": round(success_rate, 4),
            "clipStatus": "empty_after_clip",
        }, flags

    polygons = collect_polygons(clipped)
    if not polygons:
        flags.append("ribbon_empty_after_clip")
        return None, {
            "ribbonWidthM": round(eff_width, 3),
            "ribbonAreaM2": 0.0,
            "ribbonShapeMethod": RIBBON_SHAPE_METHOD,
            "ribbonCoverageRatio": 0.0,
            "ribbonMaxOutsideBasinM2": round(max_outside, 3),
            "ribbonPostClipOutsideBasinM2": 0.0,
            "ribbonIslandOverlapM2": round(island_pre, 3),
            "waterSideMethod": "segment_midpoint_probe_5m",
            "waterSideProbeSuccessRate": round(success_rate, 4),
            "clipStatus": "empty_after_clip",
        }, flags

    ribbon_geom: BaseGeometry = polygons[0] if len(polygons) == 1 else MultiPolygon(polygons)
    ribbon_area = float(ribbon_geom.area)
    arc_len = float(line_m.length)
    expected_area = max(arc_len * eff_width * 0.82, 1.0)
    clip_status = "clipped_to_basin"
    raw_strip_area = float(raw_strip.area)

    post_outside = 0.0
    try:
        post_outside = float(max(0.0, ribbon_geom.difference(basin_metric).area))
    except Exception:
        post_outside = 0.0
    if post_outside > 2.0:
        flags.append("ribbon_leaks_outside_basin")

    island_post = ribbon_island_overlap_m2(basin_metric, ribbon_geom)
    if island_post > 1.5:
        flags.append("ribbon_intersects_interior_ring")

    cov_ratio = round(ribbon_area / arc_len, 4) if arc_len > 1e-6 else 0.0

    if len(polygons) > 1:
        flags.append("ribbon_fragmented_after_clip")
    if ribbon_area < expected_area * 0.10 or ribbon_area < 25.0:
        flags.append("ribbon_empty_after_clip")
    if ribbon_area > expected_area * 1.5:
        flags.append("ribbon_area_too_large")
    if abs(ribbon_area - raw_strip_area) > expected_area * 0.18 and raw_strip_area > 0:
        flags.append("basin_clip_changed_geometry")

    if ring_dist is not None and ring_dist <= eff_width * 1.5:
        flags.append("arc_near_interior_ring")

    return ribbon_geom, {
        "ribbonWidthM": round(eff_width, 3),
        "ribbonAreaM2": round(ribbon_area, 2),
        "ribbonShapeMethod": RIBBON_SHAPE_METHOD,
        "ribbonCoverageRatio": cov_ratio,
        "ribbonMaxOutsideBasinM2": round(max_outside, 3),
        "ribbonPostClipOutsideBasinM2": round(post_outside, 4),
        "ribbonIslandOverlapM2": round(island_post, 3),
        "waterSideMethod": "segment_midpoint_probe_5m",
        "waterSideProbeSuccessRate": round(success_rate, 4),
        "clipStatus": clip_status,
    }, flags


def shape_family_from_feature_class(fc: str) -> str:
    m = {
        "convex_point_protrusion": "protrusion_like",
        "concave_pocket_cove": "pocket_like",
        "shoreline_bend": "mixed_bend",
        "mixed_complexity": "ambiguous",
        "broad_shoreline_focus": "shoreline_corridor",
    }
    return m.get(fc, "ambiguous")


def _derive_focus_depth_base_m(
    arc_len_m: float,
    basin_area_m2: float,
    *,
    focus_scale_mode: str = "local_lobe",
) -> tuple[float, float, float]:
    if focus_scale_mode in {"shoreline_corridor", "broad_starting_area"}:
        d = min(
            LONG_SIMPLE_FOCUS_ABS_MAX_DEPTH_M,
            max(220.0, 0.28 * arc_len_m, 0.052 * math.sqrt(max(basin_area_m2, 1.0))),
        )
        d = max(120.0, min(LONG_SIMPLE_FOCUS_ABS_MAX_DEPTH_M, d))
        return d, 120.0, LONG_SIMPLE_FOCUS_ABS_MAX_DEPTH_M
    d = min(
        105.0,
        max(35.0, 0.26 * arc_len_m, 0.022 * math.sqrt(max(basin_area_m2, 1.0))),
    )
    d = max(FOCUS_MIN_DEPTH_M, min(FOCUS_ABS_MAX_DEPTH_M, d))
    return d, FOCUS_MIN_DEPTH_M, FOCUS_ABS_MAX_DEPTH_M


def _ray_inside_length_m(
    basin_m: Polygon,
    px: float,
    py: float,
    ux: float,
    uy: float,
    max_l: float = 120_000.0,
) -> float:
    ln = LineString([(px, py), (px + ux * max_l, py + uy * max_l)])
    g = ln.intersection(basin_m)
    if g.is_empty:
        return 0.0
    if isinstance(g, LineString):
        x0, y0 = g.coords[0][:2]
        if math.hypot(x0 - px, y0 - py) < 2.5:
            return float(g.length)
        x1, y1 = g.coords[-1][:2]
        if math.hypot(x1 - px, y1 - py) < 2.5:
            return float(g.length)
        return float(g.length)
    if isinstance(g, MultiLineString):
        best = 0.0
        for seg in g.geoms:
            if isinstance(seg, LineString) and len(seg.coords) >= 2:
                x0, y0 = seg.coords[0][:2]
                if math.hypot(x0 - px, y0 - py) < 2.5:
                    best = max(best, float(seg.length))
        return best
    if isinstance(g, GeometryCollection):
        best = 0.0
        for sub in g.geoms:
            if isinstance(sub, LineString) and len(sub.coords) >= 2:
                x0, y0 = sub.coords[0][:2]
                if math.hypot(x0 - px, y0 - py) < 2.5:
                    best = max(best, float(sub.length))
        return best
    return 0.0


def _unit_tangent_at(line_m: LineString, dist_along: float) -> tuple[float, float] | None:
    L = float(line_m.length)
    if L < 1e-6:
        return None
    d = max(0.0, min(L, dist_along))
    d2 = max(0.0, min(L, dist_along + min(3.0, L * 0.02)))
    p = line_m.interpolate(d)
    p2 = line_m.interpolate(max(d2, d + 0.5))
    dx, dy = p2.x - p.x, p2.y - p.y
    sl = math.hypot(dx, dy)
    if sl < 1e-9:
        return None
    return (dx / sl, dy / sl)


def _smooth_open_chain(pts: list[tuple[float, float]], passes: int = 1) -> list[tuple[float, float]]:
    if len(pts) < 3 or passes <= 0:
        return pts
    out = list(pts)
    for _ in range(passes):
        sm: list[tuple[float, float]] = [out[0]]
        for i in range(1, len(out) - 1):
            sx = (out[i - 1][0] + out[i][0] + out[i + 1][0]) / 3.0
            sy = (out[i - 1][1] + out[i][1] + out[i + 1][1]) / 3.0
            sm.append((sx, sy))
        sm.append(out[-1])
        out = sm
    return out


def _empty_focus_meta(
    *,
    shape_family: str,
    probe: dict[str, Any],
    clip_status: str = "not_built",
    focus_scale_mode: str = "local_lobe",
) -> dict[str, Any]:
    sr = float(probe.get("success_rate", 0.0))
    return {
        "shapeFamily": shape_family,
        "focus_scale_mode": focus_scale_mode,
        "focusAreaM2": None,
        "focusDepthM": None,
        "focusDepthMinM": None,
        "focusDepthMaxM": None,
        "openWaterClearanceM": None,
        "oppositeShoreCapM": None,
        "coveMouthWidthM": None,
        "pointProminenceM": None,
        "clipStatus": clip_status,
        "clipAreaRatio": None,
        "fragmentCount": None,
        "interiorRingDistanceM": None,
        "maxDistanceFromArcM": None,
        "waterSideMethod": "segment_midpoint_probe_5m",
        "waterSideProbeSuccessRate": round(sr, 4),
        "focusBuildMethod": FOCUS_BUILD_METHOD,
    }


def build_sampled_normal_focus_polygon(
    basin_metric: Polygon,
    line_m: LineString,
    coords: list[tuple[float, float]],
    *,
    feature_class: str,
    basin_area_m2: float,
    arc_meta: dict[str, Any],
    probe: dict[str, Any],
    focus_scale_mode: str = "local_lobe",
) -> tuple[BaseGeometry | None, dict[str, Any], list[str]]:
    flags: list[str] = []
    if focus_scale_mode in {"shoreline_corridor", "broad_starting_area"}:
        feature_class = "broad_shoreline_focus"
    shape_family = shape_family_from_feature_class(str(feature_class))
    side = probe.get("side")
    success_rate = float(probe.get("success_rate") or 0.0)
    arc_len = float(line_m.length)
    ring_dist = interior_ring_distance_m(basin_metric, line_m)

    base_meta = {
        **_empty_focus_meta(
            shape_family=shape_family,
            probe=probe,
            clip_status="not_built",
            focus_scale_mode=focus_scale_mode,
        ),
        "interiorRingDistanceM": round(float(ring_dist), 2) if ring_dist is not None else None,
    }

    if side is None or success_rate < MIN_WATER_SIDE_PROBE_SUCCESS_RATE:
        flags.append("water_side_ambiguous" if side is not None else "water_side_probe_failed")
        flags.append("shape_family_ambiguous")
        base_meta["clipStatus"] = "not_built_water_side_ambiguous"
        return None, base_meta, flags

    if shape_family == "ambiguous" and success_rate < 0.72:
        flags.append("shape_family_ambiguous")
        base_meta["clipStatus"] = "not_built_ambiguous_shape"
        return None, base_meta, flags

    depth_base, dmin_nom, dmax_nom = _derive_focus_depth_base_m(
        arc_len,
        basin_area_m2,
        focus_scale_mode=focus_scale_mode,
    )
    chord_m = math.hypot(coords[-1][0] - coords[0][0], coords[-1][1] - coords[0][1])

    net_b = float(arc_meta.get("arcNetSignedBendDeg", 0.0) or 0.0)
    point_prom = min(
        arc_len * 0.14,
        max(18.0, abs(net_b) * arc_len / 420.0),
    )

    mid_d = arc_len / 2.0
    pm = line_m.interpolate(mid_d)
    tan_mid = _unit_tangent_at(line_m, mid_d)
    if tan_mid is None:
        flags.append("cove_mouth_uncertain")
        base_meta["clipStatus"] = "not_built_no_tangent"
        return None, base_meta, flags
    tx, ty = tan_mid
    lx, ly = -ty, tx
    sign = 1.0 if side == "left" else -1.0
    wx, wy = sign * lx, sign * ly

    open_clear = _ray_inside_length_m(basin_metric, pm.x, pm.y, wx, wy)
    nearest_opposite_est = 2.0 * open_clear
    opposite_cap = (0.58 if focus_scale_mode in {"shoreline_corridor", "broad_starting_area"} else 0.45) * max(
        nearest_opposite_est, 1.0
    )

    corridor_mode = focus_scale_mode in {"shoreline_corridor", "broad_starting_area"}
    abs_depth_cap = LONG_SIMPLE_FOCUS_ABS_MAX_DEPTH_M if corridor_mode else FOCUS_ABS_MAX_DEPTH_M
    depth_limit = min(depth_base, opposite_cap, abs_depth_cap)
    capped_note = depth_limit < depth_base - 0.5
    if depth_limit < FOCUS_MIN_DEPTH_M + 4.0:
        flags.append("open_water_clearance_low")
    if opposite_cap < arc_len * 0.08:
        flags.append("opposite_shore_too_close")

    if corridor_mode:
        depth_limit = min(depth_limit, max(160.0, 0.72 * open_clear if open_clear > 0 else depth_limit))
    elif shape_family == "pocket_like":
        mouth_cap = 0.65 * max(chord_m, 8.0)
        depth_limit = min(depth_limit, mouth_cap)
        if chord_m < arc_len * 0.22:
            flags.append("cove_mouth_uncertain")
    elif shape_family == "protrusion_like":
        depth_limit = min(depth_limit, 1.2 * max(point_prom, 20.0))
        if point_prom < 22.0:
            flags.append("point_prominence_weak")
    elif shape_family == "mixed_bend":
        depth_limit *= 0.93
    else:
        depth_limit *= 0.78

    if ring_dist is not None:
        ring_factor = 0.58 if corridor_mode else 0.48
        depth_limit = min(depth_limit, max(FOCUS_MIN_DEPTH_M, float(ring_dist) * ring_factor))

    depth_floor = 140.0 if corridor_mode else 18.0
    depth_limit = max(depth_floor, min(abs_depth_cap, depth_limit))
    if capped_note or depth_limit <= depth_base - 1.0:
        flags.append("focus_depth_capped")

    samples: list[tuple[float, float, float]] = []
    d = 0.0
    L = float(line_m.length)
    while d <= L + 1e-6:
        samples.append(d)
        d += FOCUS_SAMPLE_STEP_M
    if len(samples) < 2 or (L > 0 and abs(samples[-1] - L) > 0.4):
        if not samples or abs(samples[-1] - L) > 0.05:
            samples.append(L)

    shore_pts: list[tuple[float, float]] = []
    inward_uvs: list[tuple[float, float]] = []
    for di in samples:
        di = max(0.0, min(L, di))
        p = line_m.interpolate(di)
        shore_pts.append((float(p.x), float(p.y)))
        ut = _unit_tangent_at(line_m, di)
        if ut is None:
            ut = tan_mid
        uu, uv = ut
        lx2, ly2 = -uv, uu
        inward_uvs.append((sign * lx2, sign * ly2))

    n = len(shore_pts)
    water_pts: list[tuple[float, float]] = []
    depth_used_min = 1e18
    depth_used_max = 0.0
    crosses_bad = False

    for i in range(n):
        t = i / max(1, n - 1)
        if corridor_mode:
            taper = 0.88 + 0.12 * math.sin(math.pi * t)
        elif shape_family == "protrusion_like":
            taper = 0.5 + 0.5 * math.sin(math.pi * t)
        else:
            taper = 1.0
        di = depth_limit * taper
        if shape_family == "pocket_like":
            di = min(di, 0.65 * max(chord_m, 8.0))
        iu, iv = inward_uvs[i]
        sx, sy = shore_pts[i]
        hi = di
        wpx, wpy = sx + iu * hi, sy + iv * hi
        step = hi
        for _ in range(12):
            if step < 2.0:
                break
            tp = (sx + iu * step, sy + iv * step)
            if basin_metric.covers(Point(tp)):
                seg = LineString([(sx, sy), tp])
                if seg.length < 1e-6:
                    break
                land = seg.difference(basin_metric)
                try:
                    bad_len = float(land.length) if land and not land.is_empty else 0.0
                except Exception:
                    bad_len = 0.0
                if bad_len > 0.35:
                    crosses_bad = True
                    step *= 0.72
                    continue
                wpx, wpy = tp
                break
            step *= 0.72
            wpx, wpy = sx + iu * step, sy + iv * step
        depth_used = math.hypot(wpx - sx, wpy - sy)
        depth_used_min = min(depth_used_min, depth_used)
        depth_used_max = max(depth_used_max, depth_used)
        water_pts.append((wpx, wpy))

    if crosses_bad:
        flags.append("focus_area_crosses_land_probe")

    water_pts = _smooth_open_chain(water_pts, passes=1)
    ring_coords = shore_pts + list(reversed(water_pts))
    if len(ring_coords) < 4:
        flags.append("focus_area_empty_after_clip")
        base_meta["clipStatus"] = "strip_unusable"
        return None, base_meta, flags

    try:
        raw_poly = Polygon(ring_coords)
    except Exception:
        flags.append("focus_area_empty_after_clip")
        base_meta["clipStatus"] = "invalid_ring"
        return None, base_meta, flags

    if not raw_poly.is_valid:
        raw_poly = make_valid(raw_poly)
    polys0 = collect_polygons(raw_poly)
    if not polys0:
        flags.append("focus_area_empty_after_clip")
        base_meta["clipStatus"] = "invalid_polygon"
        return None, base_meta, flags
    polys0.sort(key=lambda p: p.area, reverse=True)
    raw_clean = polys0[0]
    raw_area = float(raw_clean.area)

    clipped = make_valid(raw_clean.intersection(basin_metric).buffer(-0.08))
    if clipped.is_empty:
        flags.append("focus_area_empty_after_clip")
        base_meta["clipStatus"] = "empty_after_clip"
        return None, base_meta, flags

    polys = collect_polygons(clipped)
    if not polys:
        flags.append("focus_area_empty_after_clip")
        base_meta["clipStatus"] = "empty_after_clip"
        return None, base_meta, flags

    fragment_count = len(polys)
    if fragment_count > 1:
        flags.append("focus_area_fragmented_after_clip")

    focus_geom: BaseGeometry = polys[0] if len(polys) == 1 else MultiPolygon(polys)
    clipped_area = float(focus_geom.area)
    clip_ratio = round(clipped_area / max(raw_area, 1.0), 4) if raw_area > 1 else None

    if clip_ratio is not None and clip_ratio < 0.38:
        flags.append("focus_area_clip_changed_geometry")
    if abs(clipped_area - raw_area) > max(raw_area * 0.22, 800.0) and raw_area > 200:
        flags.append("focus_area_clip_changed_geometry")

    island_x = ribbon_island_overlap_m2(basin_metric, focus_geom)
    if island_x > 2.0:
        flags.append("focus_area_intersects_island_land")
    post_out = 0.0
    try:
        post_out = float(max(0.0, focus_geom.difference(basin_metric).area))
    except Exception:
        post_out = 0.0
    if post_out > 2.0:
        flags.append("focus_area_intersects_island_land")

    if not basin_metric.covers(focus_geom):
        flags.append("focus_area_clip_changed_geometry")

    try:
        max_d_arc = float(focus_geom.hausdorff_distance(line_m))
    except Exception:
        try:
            max_d_arc = max(float(p.hausdorff_distance(line_m)) for p in collect_polygons(focus_geom))
        except Exception:
            max_d_arc = None

    if clipped_area < 2500.0:
        flags.append("focus_area_too_tiny")
    effective_width_m = clipped_area / max(arc_len, 1.0)
    if effective_width_m < FOCUS_SELECTION_MIN_EFFECTIVE_WIDTH_M:
        flags.append("focus_area_too_narrow")
    if clipped_area > arc_len * depth_limit * 1.45:
        flags.append("focus_area_too_broad")
        flags.append("overclaim_precision_risk")

    if ring_dist is not None and ring_dist <= depth_limit * 1.35:
        flags.append("focus_area_near_interior_ring")

    clip_status = "clipped_to_basin"
    meta_out = {
        "shapeFamily": shape_family,
        "focus_scale_mode": focus_scale_mode,
        "corridorMode": corridor_mode,
        "corridorLengthM": round(arc_len, 2) if corridor_mode else None,
        "corridorDepthM": round(depth_limit, 2) if corridor_mode else None,
        "focusAreaM2": round(clipped_area, 2),
        "effectiveFocusWidthM": round(effective_width_m, 2),
        "focusDepthM": round(depth_limit, 2),
        "focusDepthMinM": round(depth_used_min, 2) if math.isfinite(depth_used_min) else None,
        "focusDepthMaxM": round(depth_used_max, 2) if depth_used_max > 0 else None,
        "openWaterClearanceM": round(open_clear, 2),
        "oppositeShoreCapM": round(opposite_cap, 2),
        "coveMouthWidthM": round(chord_m, 2),
        "pointProminenceM": round(point_prom, 2),
        "clipStatus": clip_status,
        "clipAreaRatio": clip_ratio,
        "fragmentCount": fragment_count,
        "interiorRingDistanceM": round(float(ring_dist), 2) if ring_dist is not None else None,
        "maxDistanceFromArcM": round(max_d_arc, 2) if max_d_arc is not None else None,
        "waterSideMethod": "segment_midpoint_probe_5m",
        "waterSideProbeSuccessRate": round(success_rate, 4),
        "focusBuildMethod": FOCUS_BUILD_METHOD,
    }
    return focus_geom, meta_out, flags


def validate_focus_polygon_for_selection(
    focus_geom: BaseGeometry | None,
    meta: dict[str, Any],
    arc_len_m: float,
) -> tuple[bool, list[str]]:
    """
    Reject trace-like / skinny focus polygons before NMS accepts a candidate.
    Returns (accepted, qa_flags) — flags are non-empty iff rejected.
    """
    reject: list[str] = []
    if focus_geom is None or focus_geom.is_empty:
        return False, ["focus_polygon_not_emitted"]

    fragments = int(meta.get("fragmentCount") or 0)
    if fragments > FOCUS_SELECTION_MAX_FRAGMENTS:
        reject.append("focus_area_fragment_count_too_high")

    area = float(meta.get("focusAreaM2") or 0.0)
    depth_nom = float(meta.get("focusDepthM") or 0.0)
    depth_max = float(meta.get("focusDepthMaxM") or 0.0)
    arc_len_m = max(float(arc_len_m), 1.0)
    eff_w = area / arc_len_m

    if depth_nom < FOCUS_SELECTION_MIN_DEPTH_NOMINAL_M:
        reject.append("focus_area_depth_too_low")
    if depth_max < FOCUS_SELECTION_MIN_DEPTH_MAX_M:
        reject.append("focus_area_depth_too_low")
    if eff_w < FOCUS_SELECTION_MIN_EFFECTIVE_WIDTH_M:
        reject.append("focus_area_effective_width_too_low")

    denom = arc_len_m * max(depth_nom, 1.0)
    area_ratio = area / max(denom, 1.0)
    strip_min = max(FOCUS_SELECTION_MIN_AREA_FLOOR_M2, FOCUS_SELECTION_MIN_AREA_COEF * denom)
    if area < strip_min:
        reject.append("focus_area_trace_like")
    if area_ratio < FOCUS_SELECTION_TRACE_AREA_RATIO:
        reject.append("focus_area_trace_like")

    max_d = meta.get("maxDistanceFromArcM")
    if max_d is not None and depth_max >= FOCUS_SELECTION_MIN_DEPTH_MAX_M:
        if float(max_d) < FOCUS_SELECTION_TRACE_HAUSDORFF_FACTOR * depth_max:
            reject.append("focus_area_trace_like")

    out: list[str] = []
    seen: set[str] = set()
    for f in reject:
        if f not in seen:
            seen.add(f)
            out.append(f)
    return len(out) == 0, out


def _safe_basin_for_display(
    basin_metric: Polygon,
    *,
    inset_m: float,
    island_keepout_m: float,
) -> BaseGeometry:
    """
    Returns a basin geometry that is shrunk away from the shoreline by ``inset_m``
    and away from interior rings (islands) by ``island_keepout_m``.

    Used as the clip target for the display-only focus polygon so that its outline
    never visually touches land. The original ``basin_metric`` is still used for
    the raw focus polygon and ribbon QA so containment checks remain strict.
    """
    safe = basin_metric
    if inset_m > 0.05:
        try:
            buffered = basin_metric.buffer(-inset_m, join_style=2)
            if buffered is not None and not buffered.is_empty and buffered.is_valid:
                safe = buffered
        except Exception:
            safe = basin_metric

    interiors = [Polygon(ring) for ring in basin_metric.interiors]
    extra_island_pad = max(0.0, island_keepout_m - inset_m)
    if interiors and extra_island_pad > 0.05:
        try:
            island_buf = unary_union(interiors).buffer(extra_island_pad, join_style=2)
            shrunk = safe.difference(island_buf)
            if shrunk is not None and not shrunk.is_empty and shrunk.is_valid:
                safe = shrunk
        except Exception:
            pass
    return safe


def build_display_focus_geometry(
    focus_geom: BaseGeometry | None,
    basin_metric: Polygon,
    *,
    arc_len_m: float = 0.0,
    interior_ring_distance_m: float | None = None,
    display_scale_mode: str = "local_lobe",
    target_effective_width_m: float = FOCUS_DISPLAY_TARGET_EFFECTIVE_WIDTH_M,
    max_expand_m: float = FOCUS_DISPLAY_MAX_EXPAND_M,
    basin_inset_m: float = FOCUS_DISPLAY_BASIN_INSET_M,
    island_keepout_m: float = FOCUS_DISPLAY_ISLAND_KEEPOUT_M,
    tolerance_m: float = FOCUS_DISPLAY_SIMPLIFY_TOLERANCE_M,
) -> tuple[BaseGeometry | None, dict[str, Any], list[str]]:
    flags: list[str] = []
    meta: dict[str, Any] = {
        "displayGeometryRole": "focus_area_polygon_display",
        "displayScaleMode": display_scale_mode,
        "displaySimplified": False,
        "displaySimplifyToleranceM": round(tolerance_m, 2),
        "displayAreaM2": None,
        "effectiveDisplayWidthM": None,
        "displayExpandM": 0.0,
        "displayBasinInsetM": round(basin_inset_m, 2),
        "displayIslandKeepoutM": round(island_keepout_m, 2),
        "displayTargetEffectiveWidthM": round(target_effective_width_m, 2),
        "displayMaxExpandM": round(max_expand_m, 2),
        "displayClipStatus": "not_built",
        "displayFragmentCount": None,
        "displayKeptFragments": None,
        "displayDriftM": None,
    }
    if focus_geom is None or focus_geom.is_empty:
        flags.append("focus_display_not_emitted")
        return None, meta, flags

    raw_area = float(focus_geom.area)

    # How far we *can* push the display outward into water without crowding
    # islands. We always defer to the safe-basin clip below as the strict
    # containment guarantee — this cap just keeps the buffer from doing
    # unnecessary expensive work that would be clipped away anyway.
    expand_m = 0.0
    if arc_len_m > 1.0 and target_effective_width_m > 0.0:
        eff_w_now = raw_area / arc_len_m
        if eff_w_now < target_effective_width_m:
            expand_m = max(0.0, min(max_expand_m, target_effective_width_m - eff_w_now))
    if interior_ring_distance_m is not None:
        ring_safe = max(0.0, float(interior_ring_distance_m) - max(island_keepout_m, basin_inset_m + 2.0))
        expand_m = min(expand_m, ring_safe)

    expanded: BaseGeometry = focus_geom
    if expand_m > 0.5:
        try:
            buf = focus_geom.buffer(expand_m, join_style=1, resolution=8)
            if buf is not None and not buf.is_empty and buf.is_valid:
                expanded = buf
            else:
                expand_m = 0.0
        except Exception:
            expand_m = 0.0
            expanded = focus_geom

    safe_basin = _safe_basin_for_display(
        basin_metric,
        inset_m=basin_inset_m,
        island_keepout_m=island_keepout_m,
    )

    display = expanded.simplify(tolerance_m, preserve_topology=True)
    display = make_valid(display.intersection(safe_basin).buffer(-0.04))
    polys = collect_polygons(display)
    if not polys:
        flags.append("focus_display_not_emitted")
        meta["displayClipStatus"] = "empty_after_clip"
        return None, meta, flags

    polys.sort(key=lambda p: p.area, reverse=True)
    raw_fragment_count = len(polys)
    # Keep the dominant lobe plus any substantial satellite lobes (>=40% of the
    # largest). This preserves geometrically real splits caused by islands while
    # dropping tiny slivers that would just look like noise. The raw focus
    # polygon (`focus_area_polygon`) still reports every fragment for QA.
    largest_area = float(polys[0].area)
    keep_threshold = max(largest_area * 0.4, 800.0)
    kept_polys = [polys[0]] + [p for p in polys[1:] if float(p.area) >= keep_threshold]
    if len(kept_polys) == 1:
        display_geom: BaseGeometry = kept_polys[0]
    else:
        display_geom = MultiPolygon(kept_polys)
    kept_fragment_count = len(kept_polys)
    display_area = float(display_geom.area)
    try:
        drift_m = float(display_geom.hausdorff_distance(focus_geom))
    except Exception:
        drift_m = None

    # Strict containment guard against the *true* basin (not the inset clone).
    try:
        post_outside = float(max(0.0, display_geom.difference(basin_metric).area))
    except Exception:
        post_outside = 0.0
    if post_outside > 1.0:
        flags.append("focus_area_display_outside_basin")
    if not basin_metric.covers(display_geom.buffer(-0.05)):
        flags.append("focus_area_display_outside_basin")
    interior_overlap_m2 = ribbon_island_overlap_m2(basin_metric, display_geom)
    if interior_overlap_m2 > 1.0:
        flags.append("focus_area_display_overlaps_island_land")

    if raw_fragment_count > 1:
        flags.append("focus_display_fragmented_after_clip")
    drift_budget = FOCUS_DISPLAY_MAX_DRIFT_M + max(0.0, expand_m)
    if drift_m is not None and drift_m > drift_budget:
        flags.append("focus_area_display_drift_exceeds_threshold")
    expected_growth = max(0.0, expand_m) * max(arc_len_m, 0.0)
    growth_budget = max(raw_area * 0.32, expected_growth + raw_area * 0.18)
    if raw_area > 1.0 and abs(display_area - raw_area) > growth_budget:
        flags.append("focus_area_display_area_changed")

    eff_disp_width = (
        round(display_area / arc_len_m, 2) if arc_len_m > 1.0 else None
    )

    meta.update(
        {
            "displaySimplified": True,
            "displayAreaM2": round(display_area, 2),
            "effectiveDisplayWidthM": eff_disp_width,
            "displayCorridorLengthM": round(arc_len_m, 2) if display_scale_mode == "shoreline_corridor" else None,
            "displayCorridorDepthM": eff_disp_width if display_scale_mode == "shoreline_corridor" else None,
            "displayExpandM": round(expand_m, 2),
            "displayClipStatus": "clipped_to_basin",
            "displayFragmentCount": raw_fragment_count,
            "displayKeptFragments": kept_fragment_count,
            "displayDriftM": round(drift_m, 2) if drift_m is not None else None,
            "displayPostClipOutsideBasinM2": round(post_outside, 3),
            "displayIslandOverlapM2": round(interior_overlap_m2, 3),
        }
    )
    return display_geom, meta, flags


def extract_arcs(
    basin_metric: Polygon,
    *,
    densify_step_m: float,
    smooth_window: int,
    arc_lengths_m: list[float],
    stride_m: float,
    max_arc_fraction_of_perimeter: float = MAX_ARC_FRACTION_OF_PERIMETER,
) -> tuple[list[tuple[float, LineString, list[tuple[float, float]], dict[str, float]]], list[str]]:
    qa: list[str] = []
    ring = basin_metric.exterior
    raw_coords = list(ring.coords)
    if len(raw_coords) >= 2 and raw_coords[0] == raw_coords[-1]:
        raw_coords = raw_coords[:-1]
    if len(raw_coords) < 4:
        qa.append("shoreline_too_coarse")
        return [], qa
    open_line = LineString(raw_coords + [raw_coords[0]])
    dense = densify_linestring(open_line, densify_step_m)
    dc = list(dense.coords)
    if len(dc) >= 2 and dc[0] == dc[-1]:
        dc = dc[:-1]
    if len(dc) < 6:
        qa.append("densify_failed_short_line")
        return [], qa
    smooth = smooth_coords(dc, smooth_window)
    n = len(smooth)
    perimeter = float(basin_metric.length)
    perim_cap = max(MIN_SCORE_ARC_LENGTH_M + 1.0, perimeter * max_arc_fraction_of_perimeter)

    capped_targets: list[float] = []
    seen_t: set[float] = set()
    for L in sorted(arc_lengths_m):
        Lc = min(L, perim_cap)
        if Lc < MIN_SCORE_ARC_LENGTH_M:
            continue
        key = round(Lc, 2)
        if key not in seen_t:
            seen_t.add(key)
            capped_targets.append(Lc)

    if not capped_targets:
        qa.append("arc_targets_too_short_for_perimeter")
        return [], qa

    chain_smooth = smooth + smooth
    chain_raw = dc + dc
    chain_len = len(chain_smooth)
    stride_i = max(1, int(stride_m / max(densify_step_m, 1.0)))

    candidates_raw: list[tuple[float, LineString, list[tuple[float, float]], dict[str, float]]] = []

    def arc_from_index_to_length(
        i0: int, target_m: float
    ) -> tuple[list[tuple[float, float]], list[tuple[float, float]]] | None:
        acc_smooth: list[tuple[float, float]] = [chain_smooth[i0]]
        acc_raw: list[tuple[float, float]] = [chain_raw[i0]]
        seg_len = 0.0
        j = i0 + 1
        while j < chain_len and j <= i0 + n and seg_len < target_m:
            dx = chain_raw[j][0] - chain_raw[j - 1][0]
            dy = chain_raw[j][1] - chain_raw[j - 1][1]
            seg_len += math.hypot(dx, dy)
            acc_smooth.append(chain_smooth[j])
            acc_raw.append(chain_raw[j])
            j += 1
        if seg_len < MIN_SCORE_ARC_LENGTH_M or len(acc_raw) < 3:
            return None
        return acc_smooth, acc_raw

    i = 0
    while i < n:
        for Lc in capped_targets:
            arc_pair = arc_from_index_to_length(i, Lc)
            if arc_pair is None:
                continue
            acc_smooth, acc_raw = arc_pair
            turn, path_m, straight_m = arc_metrics(acc_smooth)
            meta = {
                "turn_abs_deg": turn,
                "arc_length_m": line_length_m(acc_raw),
                "straight_m": straight_m,
                "sinuosity": path_m / straight_m if straight_m > 1e-6 else 1.0,
                "smooth_drift_m": max_pairwise_drift_m(acc_smooth, acc_raw),
            }
            s = score_arc(
                turn,
                path_m,
                straight_m,
                [],
                acc_smooth,
            )
            if s > 0:
                line = LineString(acc_raw)
                candidates_raw.append((s, line, list(acc_raw), meta))
        i += stride_i

    return candidates_raw, qa


def fetch_lakes(
    conn: psycopg.Connection,
    *,
    seed: dict[str, Any],
    limit: int,
    search_name: str | None,
    state: str | None,
) -> list[dict[str, Any]]:
    filters = seed.get("filters") or {}
    ids = seed.get("ids") or []
    types = filters.get("waterbody_types")
    state_f = state or filters.get("state_code")
    name_sub = search_name if search_name is not None else filters.get("name_contains")

    conditions: list[str] = []
    args: list[Any] = []

    if ids:
        uuids = [uuid.UUID(str(i)) for i in ids]
        conditions.append("id = ANY(%s::uuid[])")
        args.append(uuids)

    if state_f:
        conditions.append("state_code = %s")
        args.append(state_f.upper())

    if name_sub:
        conditions.append("canonical_name ilike %s")
        args.append(f"%{name_sub}%")

    if types:
        conditions.append("waterbody_type = ANY(%s::text[])")
        args.append(types)

    where_sql = " and ".join(conditions) if conditions else "true"
    sql = f"""
    select
      id,
      canonical_name,
      state_code,
      county_name,
      waterbody_type,
      surface_area_acres,
      ST_AsGeoJSON(centroid)::text as centroid_geojson,
      ST_AsGeoJSON(geometry)::text as geometry_geojson
    from public.waterbody_index
    where {where_sql}
    order by surface_area_acres desc nulls last, canonical_name asc
    limit %s
    """
    args.append(int(limit))
    with conn.cursor() as cur:
        cur.execute(sql, args)
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
    return rows


def row_to_shapely(row: dict[str, Any]) -> tuple[Point, BaseGeometry]:
    cj = json.loads(row["centroid_geojson"])
    gj = json.loads(row["geometry_geojson"])
    centroid = from_geojson(json.dumps(cj))
    geom = from_geojson(json.dumps(gj))
    if not isinstance(centroid, Point):
        centroid = Point(centroid)  # type: ignore
    return centroid, geom


def process_lake(
    row: dict[str, Any],
    *,
    debug_full_polygon: bool,
    densify_step_m: float,
    stride_m: float,
    arc_lengths_m: list[float],
    ribbon_width_m: float,
) -> dict[str, Any]:
    t0 = time.perf_counter()

    def elapsed_sec() -> float:
        return round(time.perf_counter() - t0, 3)

    lake_id = str(row["id"])
    centroid, raw_geom = row_to_shapely(row)
    lon, lat = centroid.x, centroid.y

    out: dict[str, Any] = {
        "lakeId": lake_id,
        "lakeName": row["canonical_name"],
        "state": row["state_code"],
        "county": row["county_name"] or "",
        "qa_flags": [],
        "candidates": [],
        "candidate_features": [],
        "basin_geojson_4326": None,
        "debug": {},
    }

    if not raw_geom.is_valid:
        out["qa_flags"].append("geometry_repair_applied")

    primary, meta = isolate_basin(raw_geom, centroid, lon, lat)
    out["qa_flags"].extend(meta.get("qa_flags", []))
    out["basin_isolation_meta"] = {k: v for k, v in meta.items() if k != "qa_flags"}
    meta_iso = out["basin_isolation_meta"]

    if primary is None:
        out["qa_flags"].append("no_credible_arcs")
        out["qa_flags"] = list(dict.fromkeys(out["qa_flags"]))
        out["checklist"] = {
            "basin_isolation": "fail",
            "shoreline_arcs": "fail",
            "needs_brandon_review": True,
        }
        out["audit_metrics"] = {
            "centroid_lon": round(lon, 6),
            "centroid_lat": round(lat, 6),
            "basin_area_m2": None,
            "shoreline_length_m": None,
            "raw_arc_candidates_count": 0,
            "candidate_score_min": None,
            "candidate_score_max": None,
            "candidate_score_mean": None,
            "elapsed_sec": elapsed_sec(),
        }
        if debug_full_polygon:
            out["debug"]["fullGeometry4326"] = mapping(raw_geom)
        return out

    basin_4326 = primary
    out["basin_geojson_4326"] = mapping(basin_4326)

    basin_m, rev = to_metric(basin_4326, lon, lat)
    out["audit_metrics"] = {
        "centroid_lon": round(lon, 6),
        "centroid_lat": round(lat, 6),
        "basin_area_m2": round(float(basin_m.area), 2),
        "shoreline_length_m": round(float(basin_m.exterior.length), 2),
        "raw_arc_candidates_count": 0,
        "candidate_score_min": None,
        "candidate_score_max": None,
        "candidate_score_mean": None,
        "elapsed_sec": 0.0,
    }
    if basin_m.area < 5_000:
        out["qa_flags"].append("very_small_lake")

    shape_metrics = basin_shape_mode_metrics(basin_m)
    lake_shape_mode = str(shape_metrics["lakeShapeMode"])
    focus_scale_mode = "shoreline_corridor" if lake_shape_mode == "long_simple_basin" else "local_lobe"
    out["audit_metrics"].update(shape_metrics)
    out["audit_metrics"]["focus_scale_mode"] = focus_scale_mode

    scored, arc_qa = extract_arcs(
        basin_m,
        densify_step_m=densify_step_m,
        smooth_window=5,
        arc_lengths_m=(
            sorted(set(arc_lengths_m + [1500.0, 2200.0, 2800.0, 3200.0]))
            if lake_shape_mode == "long_simple_basin"
            else arc_lengths_m
        ),
        stride_m=stride_m,
        max_arc_fraction_of_perimeter=0.36 if lake_shape_mode == "long_simple_basin" else MAX_ARC_FRACTION_OF_PERIMETER,
    )
    out["qa_flags"].extend(arc_qa)

    uncertain_class = 0
    rescored: list[ScoredArc] = []
    for s, line, coords, meta in scored:
        s2 = score_arc(
            meta["turn_abs_deg"],
            meta["arc_length_m"],
            meta["straight_m"],
            [],
            coords,
        )
        fc, f_extra, f_qa = classify_arc_geometry(coords, meta, basin_m)
        if f_qa:
            uncertain_class += 1
        if lake_shape_mode == "long_simple_basin":
            fc = "broad_shoreline_focus"
            f_extra["lakeShapeModeOverride"] = 1.0
        meta_enriched: dict[str, Any] = {**meta, **f_extra, "featureClass": fc}
        s3 = diversify_adjust_score(s2, meta_enriched, fc)
        if lake_shape_mode == "long_simple_basin":
            arc_len_m = float(meta_enriched.get("arc_length_m", 0.0) or 0.0)
            s3 += min(0.34, max(0.0, (arc_len_m - 550.0) / 2600.0))
        rescored.append((s3, line, coords, meta_enriched))

    out["audit_metrics"]["arcsWithUncertainFeatureClass"] = uncertain_class
    if uncertain_class > len(scored) * 0.45 and len(scored) > 50:
        out["qa_flags"].append("feature_class_uncertain_prevalent")

    out["audit_metrics"]["raw_arc_candidates_count"] = len(rescored)

    st_sel: dict[str, int] = {
        "ribbon_overlap_touch_rejected": 0,
        "ribbon_midpoint_rejected": 0,
        "ribbon_min_area_rejected": 0,
        "ribbon_build_failed_selection": 0,
        "focus_quality_rejected": 0,
    }
    major_axis_m = float(shape_metrics.get("basinMajorAxisM") or 0.0)
    selection_pool = rescored
    if lake_shape_mode == "long_simple_basin":
        max_visible_candidates = LONG_SIMPLE_MAX_CANDIDATES
        min_visible_candidates = LONG_SIMPLE_MIN_CANDIDATES
        primary_mid_sep_m = max(NMS_MIDPOINT_SEPARATION_M * 1.45, major_axis_m * 0.105)
        primary_gap_m = max(RIBBON_SURFACE_GAP_M * 1.25, major_axis_m * 0.035)
        score_floor = 0.28
        corridor_target_len_m = min(
            LONG_SIMPLE_MAX_CORRIDOR_LENGTH_M,
            max(LONG_SIMPLE_TARGET_CORRIDOR_LENGTH_M, major_axis_m * 0.06),
        )
        corridor_min_len_m = min(
            corridor_target_len_m,
            max(LONG_SIMPLE_MIN_CORRIDOR_LENGTH_M, major_axis_m * 0.045),
        )
        preferred_pool = [
            it for it in rescored if float(it[3].get("arc_length_m", 0.0) or 0.0) >= corridor_min_len_m
        ]
        if len(preferred_pool) >= min_visible_candidates:
            selection_pool = preferred_pool
        out["audit_metrics"]["corridorTargetLengthM"] = round(corridor_target_len_m, 2)
        out["audit_metrics"]["corridorMinLengthM"] = round(corridor_min_len_m, 2)
        out["audit_metrics"]["corridorEligibleCandidateCount"] = len(preferred_pool)
    else:
        max_visible_candidates = 6
        min_visible_candidates = 3
        primary_mid_sep_m = NMS_MIDPOINT_SEPARATION_M
        primary_gap_m = RIBBON_SURFACE_GAP_M
        score_floor = 0.34

    picks, st1 = select_candidates_ribbon_aware(
        selection_pool,
        basin_m,
        ribbon_width_m=ribbon_width_m,
        min_ribbon_area_m2=MIN_RIBBON_AREA_M2,
        min_midpoint_separation_m=primary_mid_sep_m,
        min_ribbon_surface_gap_m=primary_gap_m,
        ribbon_overlap_buffer_m=RIBBON_OVERLAP_BUFFER_M,
        max_out=max_visible_candidates,
        min_out=min_visible_candidates,
        score_floor_frac=score_floor,
        focus_scale_mode=focus_scale_mode,
    )
    for k, v in st1.items():
        st_sel[k] = st_sel.get(k, 0) + int(v)

    if len(picks) < 3 and len(rescored) > 0:
        picks_loose, st2 = select_candidates_ribbon_aware(
            selection_pool,
            basin_m,
            ribbon_width_m=ribbon_width_m,
            min_ribbon_area_m2=MIN_RIBBON_AREA_M2 * 0.88,
            min_midpoint_separation_m=primary_mid_sep_m * 0.72,
            min_ribbon_surface_gap_m=primary_gap_m * 0.68,
            ribbon_overlap_buffer_m=RIBBON_OVERLAP_BUFFER_M,
            max_out=max_visible_candidates,
            min_out=1,
            score_floor_frac=0.2,
            focus_scale_mode=focus_scale_mode,
        )
        for k, v in st2.items():
            st_sel[k] = st_sel.get(k, 0) + int(v)
        if len(picks_loose) > len(picks):
            picks = picks_loose

    if lake_shape_mode == "long_simple_basin":
        did_swap = False
    else:
        picks, did_swap = diversity_swap_protrusion(
            picks,
            rescored,
            basin_m,
            ribbon_width_m=ribbon_width_m,
            min_ribbon_area_m2=MIN_RIBBON_AREA_M2 * 0.92,
            min_midpoint_separation_m=NMS_MIDPOINT_SEPARATION_M * 0.92,
            min_ribbon_surface_gap_m=RIBBON_SURFACE_GAP_M * 0.88,
            ribbon_overlap_buffer_m=RIBBON_OVERLAP_BUFFER_M,
            focus_scale_mode=focus_scale_mode,
        )
    if did_swap:
        out["qa_flags"].append("diversity_protrusion_swap_applied")

    picks.sort(key=lambda p: float(p["item"][0]), reverse=True)
    picked_ribbons = [p["ribbon_m"] for p in picks]
    gap_min, gap_mean = pairwise_ribbon_gap_stats(picked_ribbons)
    if gap_min is not None and gap_min < PAIRWISE_GAP_TIGHT_M:
        out["qa_flags"].append("selected_candidates_tightly_spaced")

    class_counts: dict[str, int] = {}
    for p in picks:
        fc = str(p["item"][3].get("featureClass", "mixed_complexity"))
        class_counts[fc] = class_counts.get(fc, 0) + 1

    out["audit_metrics"]["minRibbonAreaM2"] = MIN_RIBBON_AREA_M2
    out["audit_metrics"]["ribbonOverlapRejectedCount"] = int(st_sel.get("ribbon_overlap_touch_rejected", 0))
    out["audit_metrics"]["ribbonMidpointRejectedCount"] = int(st_sel.get("ribbon_midpoint_rejected", 0))
    out["audit_metrics"]["ribbonMinAreaRejectedCount"] = int(st_sel.get("ribbon_min_area_rejected", 0))
    out["audit_metrics"]["focusSelectionRejectedCount"] = int(st_sel.get("focus_quality_rejected", 0))
    out["audit_metrics"]["selectedFeatureClassCounts"] = class_counts
    out["audit_metrics"]["selectedRibbonPairwiseGapMinM"] = round(gap_min, 2) if gap_min is not None else None
    out["audit_metrics"]["selectedRibbonPairwiseGapMeanM"] = round(gap_mean, 2) if gap_mean is not None else None

    if not picks:
        out["qa_flags"].append("no_credible_arcs")

    def rev_line(ls: LineString) -> LineString:
        def tr(x: float, y: float) -> tuple[float, float]:
            return rev.transform(x, y)

        return transform(tr, ls)

    for rank, pick in enumerate(picks, start=1):
        score, line_m, coords, meta = pick["item"]
        ribbon_m = pick["ribbon_m"]
        ribbon_meta = dict(pick["ribbon_meta"])
        ribbon_flags = list(pick.get("ribbon_flags") or [])
        candidate_id = f"{lake_id}:candidate:{rank}"
        candidate_flags = list(out["qa_flags"])
        if float(meta.get("smooth_drift_m", 0.0)) > MAX_SMOOTH_DRIFT_M:
            candidate_flags.append("smooth_drift_exceeds_threshold")
            out["qa_flags"].append("smooth_drift_exceeds_threshold")
        candidate_flags.extend(ribbon_flags)
        candidate_flags = list(dict.fromkeys(candidate_flags))

        mx = sum(c[0] for c in coords) / len(coords)
        my = sum(c[1] for c in coords) / len(coords)
        anchor_pt = Point(rev.transform(mx, my))
        nn_m = nearest_neighbor_ribbon_m(picked_ribbons, rank - 1)

        def rev_geom(g: BaseGeometry) -> BaseGeometry:
            def tr(x: float, y: float) -> tuple[float, float]:
                return rev.transform(x, y)

            return transform(tr, g)

        props_shared: dict[str, Any] = {
            "candidateId": candidate_id,
            "lakeId": lake_id,
            "lakeName": row["canonical_name"],
            "state": row["state_code"],
            "county": row["county_name"] or "",
            "featureType": "shoreline_arc_complexity",
            "rank": rank,
            "score": round(float(score), 6),
            "confidence": "dev_only_low",
            "source": "vector_shoreline_only",
            "arcLengthM": round(float(meta["arc_length_m"]), 2),
            "sinuosity": round(float(meta["sinuosity"]), 4),
            "turnAbsDeg": round(float(meta["turn_abs_deg"]), 3),
            "smoothDriftM": round(float(meta.get("smooth_drift_m", 0.0)), 3),
            "componentRank": str(meta_iso.get("component_rank", "")),
            "basinIsolation": str(meta_iso.get("basin_isolation", "")),
            "manualReviewRequired": True,
            "featureClass": str(meta.get("featureClass", "mixed_complexity")),
            "featureLabel": feature_class_info(meta.get("featureClass", "mixed_complexity"))["label"],
            "featureColorHex": feature_class_info(meta.get("featureClass", "mixed_complexity"))["color"],
            "lakeShapeMode": lake_shape_mode,
            "focus_scale_mode": focus_scale_mode,
            "arcNetSignedBendDeg": meta.get("arcNetSignedBendDeg"),
            "probeAsymmetry": meta.get("probeAsymmetry"),
            "nearestSelectedRibbonDistanceM": round(float(nn_m), 2) if nn_m is not None else None,
        }

        focus_m = pick.get("focus_m")
        focus_meta = dict(pick.get("focus_meta") or {})
        focus_flags: list[str] = list(pick.get("focus_flags") or [])
        if focus_m is None:
            probe_focus = water_side_probe(basin_m, coords)
            focus_m, focus_meta, focus_flags = build_sampled_normal_focus_polygon(
                basin_m,
                line_m,
                coords,
                feature_class=str(meta.get("featureClass", "mixed_complexity")),
                basin_area_m2=float(basin_m.area),
                arc_meta=dict(meta),
                probe=probe_focus,
                focus_scale_mode=focus_scale_mode,
            )
        candidate_flags.extend(focus_flags)

        candidate_flags.append("manual_review_required")
        ok_vis, sel_val_flags = validate_focus_polygon_for_selection(
            focus_m, focus_meta, float(line_m.length)
        )
        if focus_m is None or not ok_vis:
            candidate_flags.append("focus_polygon_not_emitted")
            candidate_flags.extend(sel_val_flags)
        display_focus_m, display_meta, display_flags = build_display_focus_geometry(
            focus_m if ok_vis else None,
            basin_m,
            arc_len_m=float(line_m.length),
            interior_ring_distance_m=focus_meta.get("interiorRingDistanceM"),
            display_scale_mode=focus_scale_mode,
            target_effective_width_m=(
                LONG_SIMPLE_DISPLAY_TARGET_EFFECTIVE_WIDTH_M
                if focus_scale_mode in {"shoreline_corridor", "broad_starting_area"}
                else FOCUS_DISPLAY_TARGET_EFFECTIVE_WIDTH_M
            ),
            max_expand_m=(
                LONG_SIMPLE_DISPLAY_MAX_EXPAND_M
                if focus_scale_mode in {"shoreline_corridor", "broad_starting_area"}
                else FOCUS_DISPLAY_MAX_EXPAND_M
            ),
        )
        candidate_flags.extend(display_flags)
        candidate_flags = list(dict.fromkeys(candidate_flags))
        props_shared["qaFlags"] = candidate_flags

        props_with_ribbon = {**props_shared, **ribbon_meta}

        focus_for_summary: dict[str, Any] = {}
        for fk, fv in focus_meta.items():
            focus_for_summary["focusClipStatus" if fk == "clipStatus" else fk] = fv
        focus_for_summary.update(display_meta)

        summary_props = {**props_with_ribbon, **focus_for_summary, "anchor": mapping(anchor_pt)}
        out["candidates"].append(summary_props)

        line_wgs = rev_line(line_m)
        out["candidate_features"].append(
            {
                "type": "Feature",
                "geometry": mapping(line_wgs),
                "properties": {**props_with_ribbon, "geometryRole": "shoreline_arc"},
            }
        )

        focus_wgs_geom = None
        if focus_m is not None and ok_vis:
            focus_wgs = make_valid(rev_geom(focus_m).intersection(basin_4326))
            focus_polys = collect_polygons(focus_wgs)
            if focus_polys:
                focus_wgs_geom = focus_polys[0] if len(focus_polys) == 1 else MultiPolygon(focus_polys)

        if focus_wgs_geom is not None:
            props_focus = {**props_with_ribbon, **focus_meta, **display_meta}
            out["candidate_features"].append(
                {
                    "type": "Feature",
                    "geometry": mapping(focus_wgs_geom),
                    "properties": {**props_focus, "geometryRole": "focus_area_polygon", "displayGeometryRole": "focus_area_polygon_raw"},
                }
            )

        display_focus_wgs_geom = None
        if display_focus_m is not None:
            display_focus_wgs = make_valid(rev_geom(display_focus_m).intersection(basin_4326))
            display_focus_polys = collect_polygons(display_focus_wgs)
            if display_focus_polys:
                display_focus_wgs_geom = (
                    display_focus_polys[0] if len(display_focus_polys) == 1 else MultiPolygon(display_focus_polys)
                )

        if display_focus_wgs_geom is not None:
            props_focus_display = {**props_with_ribbon, **focus_meta, **display_meta}
            out["candidate_features"].append(
                {
                    "type": "Feature",
                    "geometry": mapping(display_focus_wgs_geom),
                    "properties": {**props_focus_display, "geometryRole": "focus_area_polygon_display"},
                }
            )

        ribbon_wgs_geom = None
        if ribbon_m is not None:
            # Final WGS84 clip keeps serialized GeoJSON inside the same basin geometry
            # used by review/QA, avoiding tiny transform precision overhangs.
            ribbon_wgs = make_valid(rev_geom(ribbon_m).intersection(basin_4326))
            ribbon_wgs_polys = collect_polygons(ribbon_wgs)
            if ribbon_wgs_polys:
                ribbon_wgs_geom = ribbon_wgs_polys[0] if len(ribbon_wgs_polys) == 1 else MultiPolygon(ribbon_wgs_polys)

        if ribbon_m is not None and ribbon_wgs_geom is not None:
            out["candidate_features"].append(
                {
                    "type": "Feature",
                    "geometry": mapping(ribbon_wgs_geom),
                    "properties": {**props_with_ribbon, "geometryRole": "water_side_ribbon"},
                }
            )
        out["candidate_features"].append(
            {
                "type": "Feature",
                "geometry": mapping(anchor_pt),
                "properties": {**props_with_ribbon, "geometryRole": "anchor_point"},
            }
        )

        out["qa_flags"].extend(ribbon_flags)
        out["qa_flags"].extend(focus_flags)
        out["qa_flags"].extend(display_flags)
        out["qa_flags"].append("manual_review_required")

    uniq_flags = list(dict.fromkeys(out["qa_flags"]))

    if picks:
        scores = [float(p["item"][0]) for p in picks]
        out["audit_metrics"]["candidate_score_min"] = round(min(scores), 6)
        out["audit_metrics"]["candidate_score_max"] = round(max(scores), 6)
        out["audit_metrics"]["candidate_score_mean"] = round(sum(scores) / len(scores), 6)

    if debug_full_polygon:
        out["debug"]["fullGeometry4326"] = mapping(raw_geom)

    basin_ok = primary is not None
    arcs_ok = len(picks) > 0
    out["qa_flags"] = uniq_flags
    # Phase 1 is visual QA only: every lake requires Brandon/manual sign-off.
    out["checklist"] = {
        "basin_isolation": "pass" if basin_ok else "fail",
        "shoreline_arcs": "pass" if arcs_ok else ("needs-review" if basin_ok else "fail"),
        "needs_brandon_review": True,
    }
    out["audit_metrics"]["elapsed_sec"] = elapsed_sec()

    return out


def bounds_from_geojson_polygon(gj: dict[str, Any]) -> tuple[float, float, float, float]:
    coords: list[tuple[float, float]] = []

    def ring_to_pts(r):
        for x, y in r:
            coords.append((float(x), float(y)))

    geom = gj.get("geometry") or gj
    t = geom.get("type")
    c = geom.get("coordinates")
    if t == "Polygon" and c:
        ring_to_pts(c[0])
    elif t == "MultiPolygon" and c:
        for poly in c:
            if poly:
                ring_to_pts(poly[0])
    if not coords:
        return (-1, -1, 1, 1)
    xs = [p[0] for p in coords]
    ys = [p[1] for p in coords]
    return (min(xs), min(ys), max(xs), max(ys))


def make_projector(
    minx: float, miny: float, maxx: float, maxy: float, size: float = 420.0, pad: float = 18.0
) -> tuple[float, Callable[[float, float], tuple[float, float]]]:
    span = max(maxx - minx, maxy - miny, 1e-9)
    scale = (size - 2 * pad) / span

    def pj(lon: float, lat: float) -> tuple[float, float]:
        x = pad + (lon - minx) * scale
        y = pad + (maxy - lat) * scale
        return (x, y)

    return scale, pj


def linestring_to_svg_d(coords: list, pj: Callable[[float, float], tuple[float, float]]) -> str:
    parts: list[str] = []
    for i, xy in enumerate(coords):
        x, y = pj(float(xy[0]), float(xy[1]))
        parts.append(f"{'M' if i == 0 else 'L'} {x:.2f} {y:.2f}")
    return " ".join(parts)


def polygon_rings_to_svg_d(rings: list, pj: Callable[[float, float], tuple[float, float]]) -> str:
    return " ".join(linestring_to_svg_d(ring, pj) + " Z" for ring in rings if ring)


def polygon_geometry_to_svg_paths(geom: dict[str, Any], pj: Callable[[float, float], tuple[float, float]]) -> list[str]:
    gtype = geom.get("type")
    coords = geom.get("coordinates") or []
    if gtype == "Polygon":
        return [polygon_rings_to_svg_d(coords, pj)]
    if gtype == "MultiPolygon":
        return [polygon_rings_to_svg_d(poly, pj) for poly in coords if poly]
    return []


ARC_RANK_STROKES = [
    "#b91c1c",
    "#c2410c",
    "#ca8a04",
    "#16a34a",
    "#0891b2",
    "#4f46e5",
    "#7c3aed",
    "#db2777",
]

# Feature-class palette: tasteful, geometry-only color coding for review HTML.
# Used by `build_lake_svg` so each focus polygon, leader line, and rank label
# inherits a color from its `featureClass` (not its NMS rank). Keeps language
# strictly geometric — no fish / depth / access claims.
FEATURE_CLASS_INFO: dict[str, dict[str, str]] = {
    "convex_point_protrusion": {
        "color": "#dc2626",
        "label": "Point / protrusion",
        "description": "Convex shoreline protrusion (point-like geometry).",
    },
    "concave_pocket_cove": {
        "color": "#0e7490",
        "label": "Cove / pocket",
        "description": "Concave shoreline pocket (cove-like geometry).",
    },
    "shoreline_bend": {
        "color": "#7c3aed",
        "label": "Shoreline bend",
        "description": "Sinuous shoreline bend or curve.",
    },
    "broad_shoreline_focus": {
        "color": "#16a34a",
        "label": "Broad shoreline corridor",
        "description": "Long, broad-scale shoreline corridor (large focus geometry).",
    },
    "mixed_complexity": {
        "color": "#b45309",
        "label": "Mixed shoreline feature",
        "description": "Mixed or ambiguous shoreline geometry.",
    },
}
DEFAULT_FEATURE_INFO: dict[str, str] = {
    "color": "#64748b",
    "label": "Other shoreline feature",
    "description": "Unclassified shoreline geometry.",
}


def feature_class_info(fc: Any) -> dict[str, str]:
    return FEATURE_CLASS_INFO.get(str(fc or ""), DEFAULT_FEATURE_INFO)


# Label offsets in SVG px (rank 1..8) to reduce overlap with neighbors
ANCHOR_LABEL_OFFSETS = [
    (42, -30),
    (-46, -30),
    (42, 34),
    (-46, 34),
    (0, -48),
    (0, 52),
    (54, 6),
    (-58, 6),
]


def build_lake_svg(processed: dict[str, Any]) -> dict[str, Any]:
    """Returns paths for SVG: filled basin, clipped ribbons, arcs, and offset rank labels."""
    basin = processed.get("basin_geojson_4326")
    view_size = 480.0
    if not basin:
        return {
            "basin_exterior_d": "",
            "basin_hole_ds": [],
            "shoreline_d": "",
            "shoreline_hole_ds": [],
            "arcs": [],
            "ribbons": [],
            "focuses": [],
            "anchors": [],
            "leaders": [],
            "view_size": int(view_size),
            "color_legend": [],
            "feature_legend": [],
        }

    def expand_bounds_from_geom_dict(g: dict[str, Any]) -> None:
        nonlocal minx, miny, maxx, maxy
        c = g.get("coordinates")
        t = g.get("type")
        if t == "LineString" and c:
            for xy in c:
                minx = min(minx, float(xy[0]))
                maxx = max(maxx, float(xy[0]))
                miny = min(miny, float(xy[1]))
                maxy = max(maxy, float(xy[1]))
        elif t == "Polygon" and c:
            for ring in c:
                for xy in ring:
                    minx = min(minx, float(xy[0]))
                    maxx = max(maxx, float(xy[0]))
                    miny = min(miny, float(xy[1]))
                    maxy = max(maxy, float(xy[1]))
        elif t == "MultiPolygon" and c:
            for poly in c:
                for ring in poly:
                    for xy in ring:
                        minx = min(minx, float(xy[0]))
                        maxx = max(maxx, float(xy[0]))
                        miny = min(miny, float(xy[1]))
                        maxy = max(maxy, float(xy[1]))

    bdict = {"type": "Feature", "geometry": basin}
    minx, miny, maxx, maxy = bounds_from_geojson_polygon(bdict)
    for cand in processed.get("candidate_features", []):
        expand_bounds_from_geom_dict(cand.get("geometry") or {})

    _, pj = make_projector(minx, miny, maxx, maxy, size=view_size, pad=20.0)
    bc = basin["coordinates"]
    ext = bc[0]
    basin_exterior_d = linestring_to_svg_d(ext, pj) + " Z"
    basin_hole_ds: list[str] = []
    if len(bc) > 1:
        for hole in bc[1:]:
            basin_hole_ds.append(linestring_to_svg_d(hole, pj) + " Z")
    shoreline_d = linestring_to_svg_d(ext, pj)
    shoreline_hole_ds: list[str] = [linestring_to_svg_d(h, pj) for h in bc[1:]] if len(bc) > 1 else []

    # Visible zone color is rank-based so same-class candidates remain distinct.
    # Feature class is still shown separately in the legend/table.
    rank_to_fc: dict[int, str] = {}
    for cand in processed.get("candidates", []):
        try:
            r = int(cand.get("rank") or 0)
        except (TypeError, ValueError):
            r = 0
        rank_to_fc[r] = str(cand.get("featureClass") or "")

    def color_for_rank(r: int) -> str:
        return ARC_RANK_STROKES[(max(1, r) - 1) % len(ARC_RANK_STROKES)]

    arcs_out: list[dict[str, Any]] = []
    ribbons_out: list[dict[str, Any]] = []
    focuses_out: list[dict[str, Any]] = []
    display_focus_ids = {
        str((cand.get("properties") or {}).get("candidateId"))
        for cand in processed.get("candidate_features", [])
        if (cand.get("properties") or {}).get("geometryRole") == "focus_area_polygon_display"
    }
    for cand in processed.get("candidate_features", []):
        props = cand.get("properties") or {}
        role = props.get("geometryRole")
        try:
            rank = int(props.get("rank", len(arcs_out) + 1))
        except (TypeError, ValueError):
            rank = len(arcs_out) + 1
        fc = str(props.get("featureClass") or rank_to_fc.get(rank) or "")
        info = feature_class_info(fc)
        stroke = color_for_rank(rank)
        g = cand.get("geometry") or {}
        if role == "shoreline_arc" and g.get("type") == "LineString":
            arcs_out.append(
                {
                    "d": linestring_to_svg_d(g["coordinates"], pj),
                    "rank": rank,
                    "stroke": stroke,
                    "featureClass": fc,
                    "featureLabel": info["label"],
                }
            )
        elif role == "water_side_ribbon":
            for d in polygon_geometry_to_svg_paths(g, pj):
                ribbons_out.append(
                    {
                        "d": d,
                        "rank": rank,
                        "fill": stroke,
                        "featureClass": fc,
                        "featureLabel": info["label"],
                    }
                )
        elif role == "focus_area_polygon_display" or (
            role == "focus_area_polygon" and str(props.get("candidateId")) not in display_focus_ids
        ):
            for d in polygon_geometry_to_svg_paths(g, pj):
                focuses_out.append(
                    {
                        "d": d,
                        "rank": rank,
                        "stroke": stroke,
                        "fill": stroke,
                        "featureClass": fc,
                        "featureLabel": info["label"],
                    }
                )

    anchors_out: list[dict[str, Any]] = []
    leaders_out: list[dict[str, Any]] = []
    for cand in processed.get("candidates", []):
        ag = cand.get("anchor") or {}
        try:
            rank = int(cand.get("rank", len(anchors_out) + 1))
        except (TypeError, ValueError):
            rank = len(anchors_out) + 1
        fc = str(cand.get("featureClass") or "")
        info = feature_class_info(fc)
        rkstroke = color_for_rank(rank)
        if ag.get("type") == "Point":
            lon, lat = ag["coordinates"]
            ax, ay = pj(float(lon), float(lat))
            off_i = (rank - 1) % len(ANCHOR_LABEL_OFFSETS)
            ox, oy = ANCHOR_LABEL_OFFSETS[off_i]
            tx, ty = ax + ox, ay + oy
            anchors_out.append(
                {
                    "x": ax,
                    "y": ay,
                    "rank": rank,
                    "tx": tx,
                    "ty": ty,
                    "stroke": rkstroke,
                    "featureClass": fc,
                    "featureLabel": info["label"],
                }
            )
            leaders_out.append(
                {
                    "x1": ax,
                    "y1": ay,
                    "x2": tx,
                    "y2": ty,
                    "stroke": rkstroke,
                    "rank": rank,
                    "featureClass": fc,
                    "featureLabel": info["label"],
                }
            )

    # Feature-class legend: one swatch per distinct class actually present in
    # the selected candidate set. Each entry lists the ranks it covers so a
    # reviewer can map a rank label on the map to a class & color.
    fc_groups: dict[str, dict[str, Any]] = {}
    for cand in processed.get("candidates", []):
        fc = str(cand.get("featureClass") or "")
        info = feature_class_info(fc)
        try:
            rank = int(cand.get("rank") or 0)
        except (TypeError, ValueError):
            rank = 0
        key = fc or "__unknown__"
        if key not in fc_groups:
            fc_groups[key] = {
                "key": key,
                "label": info["label"],
                "description": info["description"],
                "color": info["color"],
                "ranks": [],
            }
        fc_groups[key]["ranks"].append(rank)
    feature_legend = list(fc_groups.values())
    feature_legend.sort(key=lambda g: min(g["ranks"]) if g["ranks"] else 0)
    for g in feature_legend:
        g["ranks"] = sorted(set(g["ranks"]))
    color_legend = [
        {"rank": int(c.get("rank")), "color": color_for_rank(int(c.get("rank")))}
        for c in processed.get("candidates", [])
        if c.get("rank") is not None
    ]

    return {
        "basin_exterior_d": basin_exterior_d,
        "basin_hole_ds": basin_hole_ds,
        "shoreline_d": shoreline_d,
        "shoreline_hole_ds": shoreline_hole_ds,
        "arcs": arcs_out,
        "ribbons": ribbons_out,
        "focuses": focuses_out,
        "anchors": anchors_out,
        "leaders": leaders_out,
        "view_size": int(view_size),
        "color_legend": color_legend,
        "feature_legend": feature_legend,
    }


REVIEW_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Water Reader geometry audit — {{ run_id }}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 24px; background: #f6f7f9; color: #1a1a1a; }
    h1 { font-size: 1.25rem; }
    h3 { font-size: 0.95rem; margin: 1rem 0 0.5rem; }
    .card { background: #fff; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .card h2 { margin: 0 0 8px; font-size: 1.05rem; }
    .meta { color: #444; font-size: 0.9rem; margin-bottom: 8px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px 16px;
              font-size: 0.88rem; margin: 12px 0; }
    .stats div { border-bottom: 1px solid #eee; padding: 4px 0; }
    .stats strong { color: #333; }
    svg.audit-map {
      border: 1px solid #e2e8f0; border-radius: 12px;
      background: linear-gradient(180deg, #f7fafd 0%, #eef3f8 100%);
      display: block; margin: 14px 0;
      box-shadow: inset 0 0 0 1px rgba(15,23,42,.04), 0 1px 2px rgba(15,23,42,.04);
    }
    .basin-exterior { fill: #eaf3fa; stroke: none; }
    .basin-hole { fill: #e7e9ee; stroke: #94a3b8; stroke-width: 0.35; opacity: 0.85; }
    .shoreline { fill: none; stroke: #475569; stroke-width: 0.7; opacity: 0.55; stroke-linejoin: round; stroke-linecap: round; }
    .shoreline.island-ring { stroke: #64748b; stroke-width: 0.55; opacity: 0.7; }
    .focus-poly {
      fill-opacity: 0.32; stroke-width: 1.0; stroke-opacity: 0.95;
      fill-rule: evenodd; stroke-linejoin: round; stroke-linecap: round;
      paint-order: stroke fill;
      filter: drop-shadow(0 0.6px 0.6px rgba(15,23,42,0.10));
    }
    .ribbon-qa { fill-opacity: 0.05; stroke-width: 0.55; stroke-dasharray: 3 4; fill-rule: evenodd; opacity: 0.55; stroke-linejoin: round; }
    .arc-line { fill: none; stroke-width: 0.85; stroke-linecap: round; stroke-linejoin: round; opacity: 0.4; }
    .leader-line { fill: none; stroke-width: 0.55; opacity: 0.42; stroke-linecap: round; }
    .anchor-rank {
      font-size: 9px; font-weight: 600; fill: #1f2937;
      paint-order: stroke fill; stroke: #fff; stroke-width: 2.0px;
      letter-spacing: 0.02em;
    }
    .layer-toggles { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; font-size: 0.78rem; margin: 8px 0 4px; color: #334155; }
    .layer-toggles label { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; }
    .legend { font-size: 0.78rem; color: #334155; margin: 6px 0 14px; display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; }
    .leg-item { display: inline-flex; align-items: center; gap: 6px; }
    .swatch { width: 14px; height: 14px; border-radius: 3px; border: 1px solid rgba(15,23,42,.16); display: inline-block; vertical-align: middle; box-sizing: border-box; }
    .swatch.focus-key {
      background: linear-gradient(135deg, rgba(79,70,229,0.32), rgba(22,163,74,0.32));
      border-color: #475569;
    }
    .swatch.basin-key { background: #eaf3fa; border-color: #94a3b8; }
    .swatch.hole-key { background: #e7e9ee; border-color: #94a3b8; }
    .swatch.anchor-key {
      width: 18px; height: 0; border: none;
      border-top: 1px solid #475569; opacity: 0.6;
      border-radius: 0; margin-left: 2px;
    }
    .legend-section { display: flex; flex-direction: column; gap: 6px; margin: 6px 0 14px; font-size: 0.78rem; color: #334155; }
    .legend-row { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; }
    .legend-row .legend-title { font-weight: 600; color: #1f2937; margin-right: 4px; }
    .legend-row.feature-classes { gap: 6px 12px; }
    .leg-class {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 3px 8px; background: #ffffff;
      border: 1px solid #e2e8f0; border-radius: 999px;
      box-shadow: 0 1px 2px rgba(15,23,42,0.04);
    }
    .leg-class .swatch.class-swatch {
      width: 10px; height: 10px; border-radius: 50%;
      border: 1px solid rgba(15,23,42,0.18);
    }
    .leg-class .leg-class-text { display: inline-flex; gap: 5px; align-items: center; }
    .leg-class .leg-class-text strong { color: #0f172a; font-weight: 600; }
    .leg-class .leg-ranks { color: #64748b; font-variant-numeric: tabular-nums; }
    table.cand { width: 100%; border-collapse: collapse; font-size: 0.74rem; margin: 8px 0 12px; }
    table.cand th, table.cand td { border: 1px solid #e5e7eb; padding: 5px 6px; text-align: left; vertical-align: top; }
    table.cand th { background: #f3f4f6; font-weight: 600; }
    table.cand td.num { text-align: right; font-variant-numeric: tabular-nums; }
    ul.checklist { list-style: none; padding: 0; margin: 8px 0 0; }
    ul.checklist li { padding: 4px 0; border-bottom: 1px solid #eee; font-size: 0.9rem; }
    .pass { color: #15803d; }
    .fail { color: #b91c1c; }
    .needs-review { color: #a16207; }
    .flags { font-family: ui-monospace, monospace; font-size: 0.82rem; background: #f3f4f6;
             padding: 10px; border-radius: 6px; white-space: pre-wrap; margin: 6px 0; }
    .rubric { border: 1px solid #d1d5db; border-radius: 8px; padding: 12px 14px; margin: 12px 0; background: #fafafa; }
    .rubric ul { margin: 0; padding-left: 1.1rem; }
    .rubric li { margin: 8px 0; font-size: 0.88rem; line-height: 1.45; }
    .note { font-size: 0.82rem; color: #555; margin-top: 12px; }
  </style>
</head>
<body>
  <h1>Water Reader — Phase 1 geometry audit (dev-only)</h1>
  <p class="meta">Run <code>{{ run_id }}</code> — vector-only, no imagery. Each candidate renders as a <strong>geometry-derived focus polygon</strong> (display-only widened/inset version of the sampled-normal lobe, clipped to the basin and held off shoreline / interior rings). Zone colors distinguish selected areas by rank; feature class remains separate descriptive metadata in the legend/table. Shoreline arcs and water-side ribbons are <em>QA layers, hidden by default</em>. All output is dev-only / manual-review-required and does not imply productive water, depth, access, species, or fish location.</p>
  {% for lake in lakes %}
  <section class="card lake-card" id="lake-{{ lake.lakeId }}">
    <h2>{{ lake.lakeName }}</h2>
    <div class="meta">
      {{ lake.county }}{% if lake.county and lake.state %}, {% endif %}{{ lake.state }}
      {% if lake.surface_area_acres is not none %} · Source row area: <strong>{{ lake.surface_area_acres | round(1) }} acres</strong>{% endif %}
    </div>
    <div class="meta">Lake ID: <code>{{ lake.lakeId }}</code></div>

    <div class="stats">
      <div><strong>Basin area (m²)</strong><br/>{% if lake.audit_metrics.basin_area_m2 is not none %}{{ lake.audit_metrics.basin_area_m2 }}{% else %}—{% endif %}</div>
      <div><strong>Shoreline length (m)</strong><br/>{% if lake.audit_metrics.shoreline_length_m is not none %}{{ lake.audit_metrics.shoreline_length_m }}{% else %}—{% endif %}</div>
      <div><strong>Raw arc candidates</strong><br/>{{ lake.audit_metrics.raw_arc_candidates_count | default('—') }}</div>
      <div><strong>Per-lake elapsed (s)</strong><br/>{{ lake.audit_metrics.elapsed_sec | default('—') }}</div>
      <div><strong>NMS picks</strong><br/>{{ lake.candidates|length }}</div>
      <div><strong>Lake shape mode</strong><br/>{{ lake.audit_metrics.lakeShapeMode | default('—') }}</div>
      <div><strong>Focus scale mode</strong><br/>{{ lake.audit_metrics.focus_scale_mode | default('—') }}</div>
      <div><strong>Min ribbon area (m²)</strong><br/>{{ lake.audit_metrics.minRibbonAreaM2 | default('—') }}</div>
      <div><strong>Ribbon overlap rejects</strong><br/>{{ lake.audit_metrics.ribbonOverlapRejectedCount | default('—') }}</div>
      <div><strong>Gap min / mean (m)</strong><br/>{% if lake.audit_metrics.selectedRibbonPairwiseGapMinM is not none %}{{ lake.audit_metrics.selectedRibbonPairwiseGapMinM }} / {{ lake.audit_metrics.selectedRibbonPairwiseGapMeanM }}{% else %}—{% endif %}</div>
      <div><strong>Selected feature classes</strong><br/>{% if lake.audit_metrics.selectedFeatureClassCounts %}{% for k, v in lake.audit_metrics.selectedFeatureClassCounts|dictsort %}{{ k }}:{{ v }}{% if not loop.last %}; {% endif %}{% endfor %}{% else %}—{% endif %}</div>
    </div>

    {% if lake.svg.basin_exterior_d %}
    <div class="layer-toggles">
      <span style="color:#475569;margin-right:4px;font-weight:600;">Layers:</span>
      <label><input type="checkbox" checked data-svg-layer="focus"/> Focus polygons</label>
      <label><input type="checkbox" checked data-svg-layer="basin"/> Basin</label>
      <label><input type="checkbox" checked data-svg-layer="holes"/> Islands / holes</label>
      <label><input type="checkbox" checked data-svg-layer="anchors"/> Labels / leaders</label>
      <label><input type="checkbox" checked data-svg-layer="shoreline"/> Shoreline (subtle)</label>
      <label><input type="checkbox" data-svg-layer="arcs"/> Shoreline arcs (QA)</label>
      <label><input type="checkbox" data-svg-layer="ribbon"/> Water-side ribbons (QA)</label>
    </div>
    <div class="legend-section">
      <div class="legend-row">
        <span class="legend-title">Map key</span>
        <span class="leg-item"><span class="swatch focus-key"></span> Focus polygon (display geometry, dev-only)</span>
        <span class="leg-item"><span class="swatch basin-key"></span> Basin (water area)</span>
        <span class="leg-item"><span class="swatch hole-key"></span> Island / interior hole</span>
        <span class="leg-item"><span class="swatch anchor-key"></span> Rank label + leader line</span>
      </div>
      {% if lake.svg.color_legend %}
      <div class="legend-row">
        <span class="legend-title">Selected area colors</span>
        {% for L in lake.svg.color_legend %}
        <span class="leg-item"><span class="swatch" style="background:{{ L.color }};opacity:0.72;"></span> rank {{ L.rank }}</span>
        {% endfor %}
      </div>
      {% endif %}
      {% if lake.svg.feature_legend %}
      <div class="legend-row feature-classes">
        <span class="legend-title">Feature type labels (geometry only)</span>
        {% for L in lake.svg.feature_legend %}
        <span class="leg-class" title="{{ L.description }}">
          <span class="leg-class-text">
            <strong>{{ L.label }}</strong>
            {% if L.ranks %}<span class="leg-ranks">rank{% if L.ranks|length > 1 %}s{% endif %} {{ L.ranks | join(', ') }}</span>{% endif %}
          </span>
        </span>
        {% endfor %}
      </div>
      {% endif %}
    </div>
    <svg class="audit-map" width="{{ lake.svg.view_size }}" height="{{ lake.svg.view_size }}" viewBox="0 0 {{ lake.svg.view_size }} {{ lake.svg.view_size }}">
      <g data-svg-layer="basin">
        <path class="basin-exterior" d="{{ lake.svg.basin_exterior_d | safe }}"/>
      </g>
      <g data-svg-layer="holes">
        {% for hd in lake.svg.basin_hole_ds %}
        <path class="basin-hole" d="{{ hd | safe }}"/>
        {% endfor %}
      </g>
      <g data-svg-layer="ribbon" style="display:none;">
        {% for ribbon in lake.svg.ribbons %}
        <path class="ribbon-qa" fill="{{ ribbon.fill }}" stroke="{{ ribbon.fill }}" d="{{ ribbon.d | safe }}"/>
        {% endfor %}
      </g>
      <g data-svg-layer="focus">
        {% for f in lake.svg.focuses %}
        <path class="focus-poly" fill="{{ f.fill }}" stroke="{{ f.stroke }}" d="{{ f.d | safe }}"/>
        {% endfor %}
      </g>
      <g data-svg-layer="shoreline">
        <path class="shoreline" d="{{ lake.svg.shoreline_d | safe }}"/>
        {% for ird in lake.svg.shoreline_hole_ds %}
        <path class="shoreline island-ring" d="{{ ird | safe }}"/>
        {% endfor %}
      </g>
      <g data-svg-layer="arcs" style="display:none;">
        {% for arc in lake.svg.arcs %}
        <path class="arc-line" stroke="{{ arc.stroke }}" d="{{ arc.d | safe }}"/>
        {% endfor %}
      </g>
      <g data-svg-layer="anchors">
        {% for ln in lake.svg.leaders %}
        <line class="leader-line" x1="{{ ln.x1 | round(2) }}" y1="{{ ln.y1 | round(2) }}" x2="{{ ln.x2 | round(2) }}" y2="{{ ln.y2 | round(2) }}" stroke="{{ ln.stroke }}"/>
        {% endfor %}
        {% for a in lake.svg.anchors %}
        <text x="{{ a.tx | round(2) }}" y="{{ a.ty | round(2) }}" class="anchor-rank" text-anchor="middle" dominant-baseline="middle">{{ a.rank }}</text>
        {% endfor %}
      </g>
    </svg>
    {% else %}
    <p class="meta">(No basin outline — isolation or geometry failed.)</p>
    {% endif %}

    <h3>Candidate metrics (NMS-selected)</h3>
    {% if lake.candidates %}
    <table class="cand">
      <thead><tr>
        <th>rank</th><th>feature</th><th class="num">score</th><th>featureClass</th><th>shapeFamily</th><th>focus_scale_mode</th>
        <th class="num">arcLengthM</th>
        <th class="num">focusAreaM2</th><th class="num">effectiveWidthM</th><th class="num">displayAreaM2</th><th class="num">effectiveDisplayWidthM</th><th>displayScale</th><th class="num">displayCorridorLengthM</th><th class="num">displayCorridorDepthM</th><th class="num">corridorLengthM</th><th class="num">corridorDepthM</th><th class="num">displayExpandM</th><th class="num">focusDepthMinM</th><th class="num">focusDepthMaxM</th><th class="num">focusDepthM</th>
        <th class="num">openWaterClearanceM</th><th class="num">oppositeShoreCapM</th><th class="num">coveMouthWidthM</th><th class="num">pointProminenceM</th>
        <th class="num">ribbonAreaM2</th><th class="num">ribbonWidthM</th><th>ribbonShape</th>
        <th class="num">covRatio</th><th class="num">nearestRibbonM</th><th class="num">maxOutsideM2</th><th class="num">islandOverlapM2</th>
        <th class="num">sinuosity</th><th class="num">turnAbsDeg</th><th class="num">probe%</th>
        <th>ribbon clip</th><th>focusClip</th><th>displayClip</th><th class="num">clipRatio</th><th class="num">fragments</th><th class="num">displayFragments</th><th class="num">maxDistArcM</th><th class="num">ringDistM</th><th>focusBuild</th>
        <th>qaFlags</th>
      </tr></thead>
      <tbody>
      {% for c in lake.candidates %}
      <tr>
        <td>{{ c.rank }}</td>
        <td><span style="display:inline-flex;align-items:center;gap:5px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:{{ c.featureColorHex | default('#64748b') }};border:1px solid rgba(15,23,42,0.18);"></span>{{ c.featureLabel | default('—') }}</span></td>
        <td class="num">{{ c.score }}</td>
        <td>{{ c.featureClass }}</td>
        <td>{{ c.shapeFamily | default('—') }}</td>
        <td>{{ c.focus_scale_mode | default('—') }}</td>
        <td class="num">{{ c.arcLengthM }}</td>
        <td class="num">{{ c.focusAreaM2 | default('—') }}</td>
        <td class="num">{{ c.effectiveFocusWidthM | default('—') }}</td>
        <td class="num">{{ c.displayAreaM2 | default('—') }}</td>
        <td class="num">{{ c.effectiveDisplayWidthM | default('—') }}</td>
        <td>{{ c.displayScaleMode | default('—') }}</td>
        <td class="num">{{ c.displayCorridorLengthM | default('—') }}</td>
        <td class="num">{{ c.displayCorridorDepthM | default('—') }}</td>
        <td class="num">{{ c.corridorLengthM | default('—') }}</td>
        <td class="num">{{ c.corridorDepthM | default('—') }}</td>
        <td class="num">{{ c.displayExpandM | default('—') }}</td>
        <td class="num">{{ c.focusDepthMinM | default('—') }}</td>
        <td class="num">{{ c.focusDepthMaxM | default('—') }}</td>
        <td class="num">{{ c.focusDepthM | default('—') }}</td>
        <td class="num">{{ c.openWaterClearanceM | default('—') }}</td>
        <td class="num">{{ c.oppositeShoreCapM | default('—') }}</td>
        <td class="num">{{ c.coveMouthWidthM | default('—') }}</td>
        <td class="num">{{ c.pointProminenceM | default('—') }}</td>
        <td class="num">{{ c.ribbonAreaM2 }}</td>
        <td class="num">{{ c.ribbonWidthM }}</td>
        <td>{{ c.ribbonShapeMethod }}</td>
        <td class="num">{{ c.ribbonCoverageRatio }}</td>
        <td class="num">{{ c.nearestSelectedRibbonDistanceM | default('—') }}</td>
        <td class="num">{{ c.ribbonMaxOutsideBasinM2 }}</td>
        <td class="num">{{ c.ribbonIslandOverlapM2 }}</td>
        <td class="num">{{ c.sinuosity }}</td>
        <td class="num">{{ c.turnAbsDeg }}</td>
        <td class="num">{{ c.waterSideProbeSuccessRate }}</td>
        <td>{{ c.clipStatus }}</td>
        <td>{{ c.focusClipStatus | default('—') }}</td>
        <td>{{ c.displayClipStatus | default('—') }}</td>
        <td class="num">{{ c.clipAreaRatio | default('—') }}</td>
        <td class="num">{{ c.fragmentCount | default('—') }}</td>
        <td class="num">{{ c.displayFragmentCount | default('—') }}</td>
        <td class="num">{{ c.maxDistanceFromArcM | default('—') }}</td>
        <td class="num">{{ c.interiorRingDistanceM | default('—') }}</td>
        <td>{{ c.focusBuildMethod | default('—') }}</td>
        <td>{{ c.qaFlags | join(', ') if c.qaFlags else '—' }}</td>
      </tr>
      {% endfor %}
      </tbody>
    </table>
    {% else %}
    <p class="meta">(No candidates for this lake.)</p>
    {% endif %}

    <h3>Engine checklist (automated)</h3>
    <ul class="checklist">
      <li><span class="{{ lake.checklist_css.basin }}">{{ lake.checklist_text.basin }}</span> — Basin isolation</li>
      <li><span class="{{ lake.checklist_css.arcs }}">{{ lake.checklist_text.arcs }}</span> — Shoreline arc candidates emitted</li>
      <li><span class="{{ lake.checklist_css.manual }}">{{ lake.checklist_text.manual }}</span> — Manual review required (every lake)</li>
    </ul>

    <div><strong>QA flags (engine)</strong></div>
    <div class="flags">{% if lake.qa_flags %}{{ lake.qa_flags | join(', ') }}{% else %}(none){% endif %}</div>

    <div class="rubric">
      <strong>Brandon visual review rubric</strong> (optional print; not saved)
      <ul>
        <li>Basin outline matches intended lake (water vs islands / holes): &nbsp; ☐ pass &nbsp; ☐ fail &nbsp; ☐ unsure</li>
        <li>Focus polygons read as elegant custom lobes — translucent fill with a clean darker outline, not a thick shoreline trace: &nbsp; ☐ pass &nbsp; ☐ fail &nbsp; ☐ unsure</li>
        <li>Focus polygons stay clearly inside the filled basin (no land coverage, no island/interior overlap): &nbsp; ☐ pass &nbsp; ☐ fail &nbsp; ☐ unsure</li>
        <li>Color legend matches the on-map focus polygons (point / cove / bend / broad corridor / mixed): &nbsp; ☐ pass &nbsp; ☐ fail &nbsp; ☐ unsure</li>
        <li>Candidate spread along the shore is useful for review: &nbsp; ☐ pass &nbsp; ☐ fail &nbsp; ☐ unsure</li>
        <li><strong>Overall lake verdict:</strong> &nbsp; ☐ pass &nbsp; ☐ fail &nbsp; ☐ needs tuning</li>
      </ul>
    </div>

    <p class="note">Dev-only geometric focus preview for QA. Not fishing advice. No productive-water, depth, access, species, or high-confidence claims.</p>
  </section>
  {% endfor %}
<script>
(function () {
  document.querySelectorAll('.lake-card').forEach(function (card) {
    card.querySelectorAll('.layer-toggles input[type="checkbox"]').forEach(function (cb) {
      var initLayer = cb.getAttribute('data-svg-layer');
      card.querySelectorAll('svg [data-svg-layer="' + initLayer + '"]').forEach(function (el) {
        el.style.display = cb.checked ? '' : 'none';
      });
      cb.addEventListener('change', function () {
        var layer = cb.getAttribute('data-svg-layer');
        var show = cb.checked;
        card.querySelectorAll('svg [data-svg-layer="' + layer + '"]').forEach(function (el) {
          el.style.display = show ? '' : 'none';
        });
      });
    });
  });
})();
</script>
</body>
</html>
"""


def render_review_html(run_id: str, lake_payloads: list[dict[str, Any]]) -> str:
    env = Environment(loader=BaseLoader(), autoescape=True)
    tpl = env.from_string(REVIEW_TEMPLATE)

    def checklist_css_class(status: str) -> str:
        if status == "pass":
            return "pass"
        if status == "fail":
            return "fail"
        return "needs-review"

    out_lakes = []
    for p in lake_payloads:
        chk = p.get("checklist") or {}
        basin_s = str(chk.get("basin_isolation", "needs-review"))
        arcs_s = str(chk.get("shoreline_arcs", "needs-review"))
        manual_s = "needs-review"
        out_lakes.append(
            {
                "lakeId": p["lakeId"],
                "lakeName": p["lakeName"],
                "state": p["state"],
                "county": p.get("county") or "",
                "surface_area_acres": p.get("surface_area_acres"),
                "audit_metrics": p.get("audit_metrics") or {},
                "candidates": p.get("candidates", []),
                "qa_flags": p.get("qa_flags", []),
                "svg": build_lake_svg(p),
                "checklist_text": {"basin": basin_s, "arcs": arcs_s, "manual": manual_s},
                "checklist_css": {
                    "basin": checklist_css_class(basin_s),
                    "arcs": checklist_css_class(arcs_s),
                    "manual": "needs-review",
                },
            }
        )

    return tpl.render(run_id=run_id, lakes=out_lakes)


def flatten_for_summary_row(row: dict[str, Any], processed: dict[str, Any]) -> dict[str, Any]:
    sa = row.get("surface_area_acres")
    if sa is not None:
        sa = float(sa)
    return {
        "id": str(row["id"]),
        "canonical_name": row["canonical_name"],
        "state_code": row["state_code"],
        "county_name": row["county_name"],
        "waterbody_type": row["waterbody_type"],
        "surface_area_acres": sa,
        "checklist": processed.get("checklist"),
        "qa_flags": processed.get("qa_flags", []),
        "candidate_count": len(processed.get("candidates", [])),
        "audit_metrics": processed.get("audit_metrics"),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Offline Water Reader shoreline geometry audit (read-only DB).")
    parser.add_argument("--seed", type=Path, default=DEFAULT_SEED, help="Path to lake_set_seed.json")
    parser.add_argument("--limit", type=int, default=25, help="Max lakes to pull from waterbody_index")
    parser.add_argument("--search-name", dest="search_name", default=None, help="Filter canonical_name ilike")
    parser.add_argument("--state", dest="state", default=None, help="Filter state_code (overrides seed)")
    parser.add_argument("--run-id", dest="run_id", default=None, help="Output subdirectory name")
    parser.add_argument(
        "--debug-full-polygon",
        action="store_true",
        help="Include full DB MultiPolygon in per-lake debug JSON (large)",
    )
    parser.add_argument(
        "--densify-step-m",
        type=float,
        default=DEFAULT_DENSIFY_STEP_M,
        help="Densify exterior ring at this spacing in meters (metric CRS)",
    )
    parser.add_argument(
        "--stride-m",
        type=float,
        default=DEFAULT_STRIDE_M,
        help="Approx. meters between arc start positions along the ring (mapped to vertex stride)",
    )
    parser.add_argument(
        "--arc-lengths-m",
        type=str,
        default="240,400,600,900,1200,1500",
        help="Comma-separated target arc lengths (meters); each capped to ~20%% of perimeter",
    )
    parser.add_argument(
        "--ribbon-width-m",
        type=float,
        default=DEFAULT_RIBBON_WIDTH_M,
        help="Nominal water-side ribbon width in meters (capped vs perimeter / interior-ring gap)",
    )
    args = parser.parse_args()

    try:
        arc_lengths = parse_arc_lengths_csv(args.arc_lengths_m)
    except ValueError as exc:
        parser.error(str(exc))
    if args.densify_step_m <= 0 or args.stride_m <= 0:
        parser.error("--densify-step-m and --stride-m must be positive")
    if args.ribbon_width_m <= 0:
        parser.error("--ribbon-width-m must be positive")

    run_id = args.run_id or datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    out_dir = SCRIPT_DIR / "outputs" / run_id
    out_dir.mkdir(parents=True, exist_ok=True)
    per_lake_dir = out_dir / "per-lake"
    per_lake_dir.mkdir(exist_ok=True)

    url = env_db_url()
    if not url:
        print("DATABASE_URL or V1_DATABASE_URL must be set.", file=sys.stderr)
        return 2

    seed = load_seed(args.seed)

    all_feats: list[dict[str, Any]] = []
    summary_lakes: list[dict[str, Any]] = []
    html_payloads: list[dict[str, Any]] = []

    run_t0 = time.perf_counter()

    with psycopg.connect(url, autocommit=True, connect_timeout=20) as conn:
        rows = fetch_lakes(
            conn,
            seed=seed,
            limit=args.limit,
            search_name=args.search_name,
            state=args.state,
        )

        for row in rows:
            proc = process_lake(
                row,
                debug_full_polygon=args.debug_full_polygon,
                densify_step_m=args.densify_step_m,
                stride_m=args.stride_m,
                arc_lengths_m=arc_lengths,
                ribbon_width_m=args.ribbon_width_m,
            )
            proc["surface_area_acres"] = row.get("surface_area_acres")
            for f in proc.get("candidate_features", []):
                all_feats.append(f)

            fc = {
                "type": "FeatureCollection",
                "features": [{"type": "Feature", "geometry": proc["basin_geojson_4326"], "properties": {"role": "selected_basin_outline", "lakeId": proc["lakeId"]}}]
                if proc.get("basin_geojson_4326")
                else [],
            }
            if proc.get("basin_geojson_4326") is None:
                fc["features"] = []
            fc["features"].extend(proc.get("candidate_features", []))
            if args.debug_full_polygon and proc.get("debug", {}).get("fullGeometry4326"):
                fc["features"].append(
                    {
                        "type": "Feature",
                        "geometry": proc["debug"]["fullGeometry4326"],
                        "properties": {"role": "debug_full_geometry_4326", "lakeId": proc["lakeId"]},
                    }
                )
            with (per_lake_dir / f"{proc['lakeId']}.geojson").open("w", encoding="utf-8") as pf:
                json.dump(fc, pf, indent=2)

            summary_lakes.append(flatten_for_summary_row(row, proc))
            html_procs = dict(proc)
            html_procs["qa_flags"] = list(dict.fromkeys(proc.get("qa_flags", [])))
            html_payloads.append(html_procs)

    candidates_path = out_dir / "candidates.geojson"
    with candidates_path.open("w", encoding="utf-8") as cf:
        json.dump({"type": "FeatureCollection", "features": all_feats}, cf, indent=2)

    summary = {
        "runId": run_id,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "lakeCount": len(summary_lakes),
        "candidateFeatureCount": len(all_feats),
        "runElapsedSec": round(time.perf_counter() - run_t0, 3),
        "constraints": {
            "imagery": False,
            "db_writes": False,
            "phase": "1_vector_audit_only",
            "confidence": "dev_only_low",
        },
        "lakes": summary_lakes,
    }
    with (out_dir / "summary.json").open("w", encoding="utf-8") as sf:
        json.dump(summary, sf, indent=2)

    html = render_review_html(run_id, html_payloads)
    with (out_dir / "review.html").open("w", encoding="utf-8") as hf:
        hf.write(html)

    print(f"Wrote {candidates_path}")
    print(f"Wrote {out_dir / 'summary.json'}")
    print(f"Wrote {out_dir / 'review.html'}")
    print(f"runElapsedSec={summary['runElapsedSec']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
