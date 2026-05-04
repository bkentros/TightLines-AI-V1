/**
 * Shoreline-biased zone patches for the lake silhouette (shared layout + card filtering).
 */
import type {
  WaterReaderGeometryCandidate,
  WaterReaderGeometryFeatureClass,
  WaterReaderNeckMetrics,
  WaterbodyPolygonGeoJson,
} from './waterReaderContracts';
import {
  bboxFromRings,
  pointInPrimaryWater,
  primaryPolygonExteriorAndHoles,
  projectLonLatToSilhouetteSvg,
  ringsFromGeoJson,
} from './waterReaderSilhouetteMath';
import type { SilhouetteTransform } from './waterReaderSilhouetteMath';

export const LAKE_ZONE_MIN_R_BASE = 7;
export const LAKE_ZONE_CAP_FRAC = 0.22;

const MAX_VISIBLE_ZONES = 5;

const PATCH_OVERLAP_DROP_MIN_FRAC = 0.31;
const PATCH_OVERLAP_NECK_MIXED_MIN_FRAC = 0.58;
const PATCH_OVERLAP_POINT_PAIR_MIN_FRAC = 0.5;

const CLUSTER_CENTER_FRAC = 0.11;

const NECK_THROAT_MAX_FRAC = 0.42;
const NECK_MAX_REL_DIAG = 0.11;
const NECK_MAX_PINCH_TO_MED = 0.46;

const RIBBON_MIN_AREA_FRAC = 0.000015;
const RIBBON_MIN_AREA_ABS = 16;

/** Shortest shoreline arc must not exceed this fraction of ring vertices (inclusive). */
const RIBBON_ARC_MAX_VERTEX_FRAC = 0.054;
const RIBBON_ARC_ABS_MAX_VERTS = 22;

/** Reject ribbons whose AABB or area dominates the lake silhouette. */
const RIBBON_AABB_MAX_SIDE_FRAC = 0.38;
const RIBBON_AREA_MAX_FOOTPRINT_FRAC = 0.16;

/** Reject ribbon if visual centroid drifts from the shore strip after deep retry. */
const RIBBON_ATTACH_CENTROID_TO_OUTER_FRAC = 0.44;

const INWARD_FIT_STEPS = [1, 0.82, 0.64, 0.48, 0.34, 0.22] as const;

function ribbonDepthMultipliers(cls: WaterReaderGeometryFeatureClass, minLakeDim: number): number[] {
  const extra =
    minLakeDim >= 240
      ? cls === 'pocket_edge'
        ? [3.02]
        : cls === 'shoreline_point'
          ? [2.88]
          : []
      : [];
  switch (cls) {
    case 'shoreline_point':
      return [1, 1.48, 1.95, 2.42, ...extra];
    case 'pocket_edge':
      return [1, 1.52, 2.08, 2.58, ...extra];
    case 'shoreline_bend':
      return [1, 1.52, 2.15, 2.82];
    case 'long_bank':
      return [1, 1.36, 1.68];
    default:
      return [1, 1.5, 2.05];
  }
}

/** Centroid must stay within the ribbon strip (rejects inward blobs after depth retry). */
function ribbonPassesShoreAttachment(
  outer: { x: number; y: number }[],
  inner: { x: number; y: number }[],
  cx: number,
  cy: number,
  dim: number,
  minLakeDim: number,
): boolean {
  if (outer.length === 0 || inner.length !== outer.length || dim < 1e-6) return false;
  const frac = Math.min(0.56, RIBBON_ATTACH_CENTROID_TO_OUTER_FRAC + minLakeDim / 4200);
  let minCentToOuter = Infinity;
  for (const o of outer) {
    minCentToOuter = Math.min(minCentToOuter, Math.hypot(cx - o.x, cy - o.y));
  }
  return minCentToOuter <= dim * frac;
}

export type PatchAabb = { minX: number; maxX: number; minY: number; maxY: number };

export type LakeRenderedPatch = {
  candidateId: number;
  rank: number;
  featureClass: WaterReaderGeometryFeatureClass;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotationDeg: number;
  fill: string;
  stroke: string;
  aabb: PatchAabb;
  /** Closed zone path in silhouette SVG space (shore ribbon or neck corridor). */
  zonePathD?: string;
};

/** Aggregate counts for QA (coordinate-free). Suppression counts are per layout attempt for non-neck zones. */
export type LakeZoneLayoutDiagnosticsSummary = {
  noShorelineContact: number;
  openWaterZone: number;
  bridgeSuppressed: number;
  bankSideCap: number;
  bankSideFallbackUsed: number;
  recentredToShoreline: number;
  inwardDepthCapped: number;
  weakShorelineContactSuppressed: number;
};

type LayoutDiagCounters = LakeZoneLayoutDiagnosticsSummary;

export type LakeZoneLayoutResult = {
  patches: LakeRenderedPatch[];
  warnings: string[];
  layoutDiagnostics?: LakeZoneLayoutDiagnosticsSummary;
};

function openRingExterior(ring: number[][]): number[][] {
  const r = ring.filter(
    (p) => Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number',
  ) as number[][];
  if (r.length < 3) return r;
  const a = r[0];
  const b = r[r.length - 1];
  if (a && b && a[0] === b[0] && a[1] === b[1]) return r.slice(0, -1);
  return r;
}

function lakeMinDimSvg(geojson: WaterbodyPolygonGeoJson, t: SilhouetteTransform): number {
  const b = bboxFromRings(ringsFromGeoJson(geojson));
  if (!b) return 1;
  const lat0 = (b.minLat + b.maxLat) / 2;
  const cosL = Math.cos((lat0 * Math.PI) / 180);
  const w = (b.maxLon - b.minLon) * cosL * t.scale;
  const h = (b.maxLat - b.minLat) * t.scale;
  return Math.max(Math.min(w, h), 1);
}

function lakeSlendernessRatio(geojson: WaterbodyPolygonGeoJson): number {
  const b = bboxFromRings(ringsFromGeoJson(geojson));
  if (!b) return 1;
  const lat0 = (b.minLat + b.maxLat) / 2;
  const cosL = Math.cos((lat0 * Math.PI) / 180) || 1;
  const w = Math.max((b.maxLon - b.minLon) * cosL, 1e-9);
  const h = Math.max(b.maxLat - b.minLat, 1e-9);
  return Math.max(w, h) / Math.min(w, h);
}

function ringCentroidLonLat(ring: number[][]): { lon: number; lat: number } {
  const r = openRingExterior(ring);
  if (r.length === 0) return { lon: 0, lat: 0 };
  let sx = 0;
  let sy = 0;
  for (const p of r) {
    sx += p[0]!;
    sy += p[1]!;
  }
  return { lon: sx / r.length, lat: sy / r.length };
}

function rectArea(r: PatchAabb): number {
  return Math.max(0, r.maxX - r.minX) * Math.max(0, r.maxY - r.minY);
}

function rectIntersectionArea(a: PatchAabb, b: PatchAabb): number {
  const ix = Math.max(0, Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX));
  const iy = Math.max(0, Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY));
  return ix * iy;
}

export function patchPairOverlapMinFrac(a: LakeRenderedPatch, b: LakeRenderedPatch): number {
  const inter = rectIntersectionArea(a.aabb, b.aabb);
  const den = Math.min(rectArea(a.aabb), rectArea(b.aabb));
  return den > 1e-6 ? inter / den : 0;
}

function overlapDropThreshold(a: LakeRenderedPatch, b: LakeRenderedPatch): number {
  const mixedNeck =
    (a.featureClass === 'neckdown' && b.featureClass !== 'neckdown') ||
    (b.featureClass === 'neckdown' && a.featureClass !== 'neckdown');
  if (mixedNeck) return PATCH_OVERLAP_NECK_MIXED_MIN_FRAC;
  if (a.featureClass === 'shoreline_point' && b.featureClass === 'shoreline_point') {
    return PATCH_OVERLAP_POINT_PAIR_MIN_FRAC;
  }
  if (a.featureClass === 'pocket_edge' && b.featureClass === 'pocket_edge') {
    return 0.52;
  }
  const mixedPocketPoint =
    (a.featureClass === 'pocket_edge' && b.featureClass === 'shoreline_point') ||
    (b.featureClass === 'pocket_edge' && a.featureClass === 'shoreline_point');
  if (mixedPocketPoint) return 0.62;
  return PATCH_OVERLAP_DROP_MIN_FRAC;
}

function expandAabb(a: PatchAabb, x: number, y: number): void {
  a.minX = Math.min(a.minX, x);
  a.maxX = Math.max(a.maxX, x);
  a.minY = Math.min(a.minY, y);
  a.maxY = Math.max(a.maxY, y);
}

function aabbFromNeckLine(x1: number, y1: number, x2: number, y2: number, sw: number): PatchAabb {
  const pad = sw / 2 + 1;
  return {
    minX: Math.min(x1, x2) - pad,
    maxX: Math.max(x1, x2) + pad,
    minY: Math.min(y1, y2) - pad,
    maxY: Math.max(y1, y2) + pad,
  };
}

/**
 * Walk the shorter direction around the open ring between `from` and `to` (inclusive).
 * Avoids wrapping the long way when ringFrom/ringTo straddle index 0.
 */
function shortRingArc(ring: number[][], from: number, to: number): number[][] {
  const n = ring.length;
  if (n < 2) return [];
  const dFwd = (to - from + n) % n;
  const dBwd = (from - to + n) % n;
  const vFwd = dFwd === 0 ? 1 : dFwd + 1;
  const vBwd = dBwd === 0 ? 1 : dBwd + 1;
  const forward = vFwd <= vBwd;
  const pts: number[][] = [];
  if (forward) {
    let i = from;
    for (;;) {
      pts.push(ring[i]!);
      if (i === to) break;
      i = (i + 1) % n;
      if (pts.length > n + 1) break;
    }
  } else {
    let i = from;
    for (;;) {
      pts.push(ring[i]!);
      if (i === to) break;
      i = (i - 1 + n) % n;
      if (pts.length > n + 1) break;
    }
  }
  return pts;
}

/**
 * Forward window on the ring covering center±halfSpan (inclusive vertex count 2*h+1).
 * Unambiguous around wrap; never takes the complement arc that omits the cue.
 */
function localWindowArcFromCenter(
  ring: number[][],
  center: number,
  halfSpan: number,
): number[][] {
  const n = ring.length;
  if (n < 2) return [];
  const hMax = Math.max(0, Math.floor((n - 1) / 2));
  const h = Math.max(0, Math.min(halfSpan, hMax));
  const c = ((center % n) + n) % n;
  if (h === 0) return [ring[c]!];
  const start = (c - h + n) % n;
  const count = Math.min(n, 2 * h + 1);
  const pts: number[][] = [];
  for (let k = 0; k < count; k++) {
    pts.push(ring[(start + k) % n]!);
  }
  return pts;
}

function inwardDepthScale(cls: WaterReaderGeometryFeatureClass): number {
  switch (cls) {
    case 'shoreline_point':
      return 0.52;
    case 'shoreline_bend':
      return 0.58;
    case 'pocket_edge':
      return 0.44;
    case 'long_bank':
      return 0.62;
    default:
      return 0.5;
  }
}

function polygonAreaSvg(xy: { x: number; y: number }[]): number {
  if (xy.length < 3) return 0;
  let s = 0;
  for (let i = 0; i < xy.length; i++) {
    const j = (i + 1) % xy.length;
    s += xy[i]!.x * xy[j]!.y - xy[j]!.x * xy[i]!.y;
  }
  return Math.abs(s) / 2;
}

function pathDFromPolygon(xy: { x: number; y: number }[]): string {
  if (xy.length < 3) return '';
  let d = `M ${xy[0]!.x.toFixed(2)} ${xy[0]!.y.toFixed(2)}`;
  for (let i = 1; i < xy.length; i++) d += ` L ${xy[i]!.x.toFixed(2)} ${xy[i]!.y.toFixed(2)}`;
  d += ' Z';
  return d;
}

function perVertexInwardVector(params: {
  ring: number[][];
  ringIndex: number;
  fallbackLon: number;
  fallbackLat: number;
  centerLon: number;
  centerLat: number;
  lat0: number;
}): { lon: number; lat: number } {
  const { ring, ringIndex, fallbackLon, fallbackLat, centerLon, centerLat, lat0 } = params;
  const cosL = Math.cos((lat0 * Math.PI) / 180) || 1;
  const n = ring.length;
  const prev = ring[(ringIndex - 1 + n) % n];
  const cur = ring[ringIndex];
  const next = ring[(ringIndex + 1) % n];
  if (!prev || !cur || !next) return { lon: fallbackLon, lat: fallbackLat };

  let tx = (next[0]! - prev[0]!) * cosL;
  let ty = next[1]! - prev[1]!;
  const tLen = Math.hypot(tx, ty) || 1e-12;
  tx /= tLen;
  ty /= tLen;

  let cx = (centerLon - cur[0]!) * cosL;
  let cy = centerLat - cur[1]!;
  const cLen = Math.hypot(cx, cy) || 1e-12;
  cx /= cLen;
  cy /= cLen;

  let ix = -ty;
  let iy = tx;
  if (ix * cx + iy * cy < 0) {
    ix = ty;
    iy = -tx;
  }

  const outLon = ix / cosL;
  const outLat = iy;
  const len = Math.hypot(outLon * cosL, outLat) || 1e-12;
  return { lon: outLon / len, lat: outLat / len };
}

function nearestRingIndex(ring: number[][], lon: number, lat: number, lat0: number): number {
  const cosL = Math.cos((lat0 * Math.PI) / 180) || 1;
  let bestI = 0;
  let bestD = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i]!;
    const d = Math.hypot((p[0]! - lon) * cosL, p[1]! - lat);
    if (d < bestD) {
      bestD = d;
      bestI = i;
    }
  }
  return bestI;
}

function fitInwardPointToWater(params: {
  lon: number;
  lat: number;
  dLon: number;
  dLat: number;
  exterior: number[][];
  holes: number[][][];
}): { lon: number; lat: number; reduced: boolean } | null {
  const { lon, lat, dLon, dLat, exterior, holes } = params;
  for (const step of INWARD_FIT_STEPS) {
    const testLon = lon + dLon * step;
    const testLat = lat + dLat * step;
    if (pointInPrimaryWater(testLon, testLat, exterior, holes)) {
      return { lon: testLon, lat: testLat, reduced: step < 1 };
    }
  }
  return null;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function patchSizePx(
  cls: WaterReaderGeometryFeatureClass,
  minLakeDim: number,
  areaAcres?: number | null,
  slenderness = 1,
): { rx: number; ry: number; centerOffset: number; coverageMin: number } {
  const areaScale = nonNeckAreaScale(areaAcres);
  /** Slender basins: bank-side patches only; major axis must stay well under local water width (layout caps reinforce). */
  const slenderScale =
    slenderness >= 7
      ? 0.58
      : slenderness >= 6
        ? 0.64
        : slenderness >= 5.2
          ? 0.72
          : slenderness >= 4.2
            ? 0.8
            : slenderness >= 3.2
              ? 0.88
              : 1;
  const scaleReadable = (n: number, min: number) => Math.max(n * areaScale, min);
  switch (cls) {
    case 'shoreline_point': {
      const rx = clamp(minLakeDim * 0.105, 25, 46);
      const sx = scaleReadable(rx * slenderScale, 22);
      return { rx: sx, ry: sx * 0.64, centerOffset: sx * 0.4, coverageMin: 0.34 };
    }
    case 'shoreline_bend': {
      const rx = clamp(minLakeDim * 0.112, 28, 50);
      const sx = scaleReadable(rx * slenderScale, 25);
      return { rx: sx, ry: sx * 0.48, centerOffset: sx * 0.36, coverageMin: 0.34 };
    }
    case 'pocket_edge': {
      const rx = clamp(minLakeDim * 0.078, 22, 36);
      const sx = scaleReadable(rx * Math.max(slenderScale, 0.86), 20);
      return { rx: sx, ry: sx * 0.58, centerOffset: sx * 0.36, coverageMin: 0.3 };
    }
    case 'long_bank': {
      const rx = clamp(minLakeDim * 0.16, 38, 68);
      const sx = scaleReadable(rx * Math.max(slenderScale, 0.88), 32);
      return { rx: sx, ry: sx * 0.24, centerOffset: sx * 0.24, coverageMin: 0.3 };
    }
    default: {
      const rx = clamp(minLakeDim * 0.1, 24, 44);
      const sx = scaleReadable(rx * slenderScale, 22);
      return { rx: sx, ry: sx * 0.6, centerOffset: sx * 0.38, coverageMin: 0.32 };
    }
  }
}

function nonNeckAreaScale(areaAcres?: number | null): number {
  if (typeof areaAcres !== 'number' || !Number.isFinite(areaAcres)) return 1;
  if (areaAcres >= 15000) return 0.8;
  if (areaAcres >= 10000) return 0.84;
  if (areaAcres >= 5000) return 0.9;
  return 1;
}

function svgUnitVectorFromLonLat(
  dLon: number,
  dLat: number,
  transform: SilhouetteTransform,
): { x: number; y: number } {
  const x = dLon * transform.scale;
  const y = -dLat * transform.scale;
  const len = Math.hypot(x, y) || 1e-12;
  return { x: x / len, y: y / len };
}

function perpendicular(v: { x: number; y: number }): { x: number; y: number } {
  return { x: -v.y, y: v.x };
}

function lonLatFromSvgPoint(
  x: number,
  y: number,
  transform: SilhouetteTransform,
): { lon: number; lat: number } {
  return {
    lon: (x - transform.originX) / transform.scale + transform.minLon,
    lat: transform.maxLat - (y - transform.originY) / transform.scale,
  };
}

function pathDFromSmoothPatch(params: {
  cx: number;
  cy: number;
  ux: number;
  uy: number;
  vx: number;
  vy: number;
  rx: number;
  ry: number;
}): string {
  const { cx, cy, ux, uy, vx, vy, rx, ry } = params;
  const k = 0.5522847498;
  const p0 = { x: cx + ux * rx, y: cy + uy * rx };
  const p1 = { x: cx + vx * ry, y: cy + vy * ry };
  const p2 = { x: cx - ux * rx, y: cy - uy * rx };
  const p3 = { x: cx - vx * ry, y: cy - vy * ry };
  const c01a = { x: p0.x + vx * ry * k, y: p0.y + vy * ry * k };
  const c01b = { x: p1.x + ux * rx * k, y: p1.y + uy * rx * k };
  const c12a = { x: p1.x - ux * rx * k, y: p1.y - uy * rx * k };
  const c12b = { x: p2.x + vx * ry * k, y: p2.y + vy * ry * k };
  const c23a = { x: p2.x - vx * ry * k, y: p2.y - vy * ry * k };
  const c23b = { x: p3.x - ux * rx * k, y: p3.y - uy * rx * k };
  const c30a = { x: p3.x + ux * rx * k, y: p3.y + uy * rx * k };
  const c30b = { x: p0.x - vx * ry * k, y: p0.y - vy * ry * k };
  return [
    `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`,
    `C ${c01a.x.toFixed(2)} ${c01a.y.toFixed(2)} ${c01b.x.toFixed(2)} ${c01b.y.toFixed(2)} ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `C ${c12a.x.toFixed(2)} ${c12a.y.toFixed(2)} ${c12b.x.toFixed(2)} ${c12b.y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `C ${c23a.x.toFixed(2)} ${c23a.y.toFixed(2)} ${c23b.x.toFixed(2)} ${c23b.y.toFixed(2)} ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `C ${c30a.x.toFixed(2)} ${c30a.y.toFixed(2)} ${c30b.x.toFixed(2)} ${c30b.y.toFixed(2)} ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

function smoothPatchEllipsePoint(
  cx: number,
  cy: number,
  alongX: number,
  alongY: number,
  crossX: number,
  crossY: number,
  rx: number,
  ry: number,
  cosTheta: number,
  sinTheta: number,
): { x: number; y: number } {
  return {
    x: cx + alongX * rx * cosTheta + crossX * ry * sinTheta,
    y: cy + alongY * rx * cosTheta + crossY * ry * sinTheta,
  };
}

function waterCoverageForSmoothPatch(params: {
  cx: number;
  cy: number;
  ux: number;
  uy: number;
  vx: number;
  vy: number;
  rx: number;
  ry: number;
  transform: SilhouetteTransform;
  exterior: number[][];
  holes: number[][][];
}): number {
  const { cx, cy, ux, uy, vx, vy, rx, ry, transform, exterior, holes } = params;
  const samples = [-0.78, -0.39, 0, 0.39, 0.78];
  let inside = 0;
  let total = 0;
  for (const a of samples) {
    for (const b of samples) {
      if (a * a + b * b > 1) continue;
      const x = cx + ux * rx * a + vx * ry * b;
      const y = cy + uy * rx * a + vy * ry * b;
      const ll = lonLatFromSvgPoint(x, y, transform);
      total++;
      if (pointInPrimaryWater(ll.lon, ll.lat, exterior, holes)) inside++;
    }
  }
  return total > 0 ? inside / total : 0;
}

/** Fraction of ellipse (interior + boundary samples) lying in primary water before clip; indicates shore merge vs open-water oval. */
function smoothPatchWaterVisibleFracDense(params: {
  cx: number;
  cy: number;
  alongX: number;
  alongY: number;
  crossX: number;
  crossY: number;
  rx: number;
  ry: number;
  transform: SilhouetteTransform;
  exterior: number[][];
  holes: number[][][];
}): number {
  const {
    cx,
    cy,
    alongX,
    alongY,
    crossX,
    crossY,
    rx,
    ry,
    transform,
    exterior,
    holes,
  } = params;
  const grid = [-0.82, -0.58, -0.35, -0.12, 0.12, 0.35, 0.58, 0.82];
  let inW = 0;
  let tot = 0;
  for (const a of grid) {
    for (const b of grid) {
      if (a * a + b * b > 1) continue;
      tot++;
      const x = cx + alongX * rx * a + crossX * ry * b;
      const y = cy + alongY * rx * a + crossY * ry * b;
      const ll = lonLatFromSvgPoint(x, y, transform);
      if (pointInPrimaryWater(ll.lon, ll.lat, exterior, holes)) inW++;
    }
  }
  for (let i = 0; i < 72; i++) {
    tot++;
    const th = (i / 72) * Math.PI * 2;
    const ct = Math.cos(th);
    const st = Math.sin(th);
    const { x, y } = smoothPatchEllipsePoint(cx, cy, alongX, alongY, crossX, crossY, rx, ry, ct, st);
    const ll = lonLatFromSvgPoint(x, y, transform);
    if (pointInPrimaryWater(ll.lon, ll.lat, exterior, holes)) inW++;
  }
  return tot > 0 ? inW / tot : 1;
}

type ShoreMergeAnalysis = {
  footprint: { minInward: number; maxInward: number; span: number };
  waterFrac: number;
  bankLandBoundaryHits: number;
};

function analyzeSmoothPatchShoreMerge(params: {
  shoreX: number;
  shoreY: number;
  inwardX: number;
  inwardY: number;
  cx: number;
  cy: number;
  alongX: number;
  alongY: number;
  crossX: number;
  crossY: number;
  rx: number;
  ry: number;
  transform: SilhouetteTransform;
  exterior: number[][];
  holes: number[][][];
}): ShoreMergeAnalysis {
  const footprint = smoothPatchLocalWidthFootprint({
    shoreX: params.shoreX,
    shoreY: params.shoreY,
    inwardX: params.inwardX,
    inwardY: params.inwardY,
    cx: params.cx,
    cy: params.cy,
    ux: params.alongX,
    uy: params.alongY,
    vx: params.crossX,
    vy: params.crossY,
    rx: params.rx,
    ry: params.ry,
  });
  let bestTheta = 0;
  let minProj = Infinity;
  for (let i = 0; i < 72; i++) {
    const th = (i / 72) * Math.PI * 2;
    const ct = Math.cos(th);
    const st = Math.sin(th);
    const { x, y } = smoothPatchEllipsePoint(
      params.cx,
      params.cy,
      params.alongX,
      params.alongY,
      params.crossX,
      params.crossY,
      params.rx,
      params.ry,
      ct,
      st,
    );
    const proj =
      (x - params.shoreX) * params.inwardX + (y - params.shoreY) * params.inwardY;
    if (proj < minProj) {
      minProj = proj;
      bestTheta = th;
    }
  }
  let bankLandBoundaryHits = 0;
  for (const d of [-0.2, -0.12, -0.055, 0, 0.055, 0.12, 0.2]) {
    const th = bestTheta + d;
    const ct = Math.cos(th);
    const st = Math.sin(th);
    const { x, y } = smoothPatchEllipsePoint(
      params.cx,
      params.cy,
      params.alongX,
      params.alongY,
      params.crossX,
      params.crossY,
      params.rx,
      params.ry,
      ct,
      st,
    );
    const ll = lonLatFromSvgPoint(x, y, params.transform);
    if (!pointInPrimaryWater(ll.lon, ll.lat, params.exterior, params.holes)) bankLandBoundaryHits++;
  }
  const waterFrac = smoothPatchWaterVisibleFracDense(params);
  return { footprint, waterFrac, bankLandBoundaryHits };
}

function mergeMinInwardCeilingPx(cls: WaterReaderGeometryFeatureClass): number {
  return cls === 'long_bank' ? -2 : -3;
}

function smoothPatchPassesVisibleMerge(params: {
  shoreMerge: ShoreMergeAnalysis;
  cls: WaterReaderGeometryFeatureClass;
  minLakeDim: number;
  rx: number;
  ry: number;
}): boolean {
  const { shoreMerge, cls, minLakeDim, rx, ry } = params;
  const { footprint, waterFrac, bankLandBoundaryHits } = shoreMerge;
  const mergeCeil = mergeMinInwardCeilingPx(cls);
  if (footprint.minInward > mergeCeil) return false;

  const minor = Math.min(rx, ry);
  /** Narrow/smaller cues: allow a little more visible oval, but never a full open-water blob. */
  const awkward = minor <= 11.5 || (minLakeDim > 180 && minor <= 13);
  const hiFrac = awkward ? 0.78 : 0.75;
  if (waterFrac > hiFrac) return false;
  if (waterFrac < 0.34) return false;

  switch (cls) {
    case 'pocket_edge':
    case 'shoreline_point':
    case 'shoreline_bend':
      return bankLandBoundaryHits >= 3;
    default:
      return bankLandBoundaryHits >= 2;
  }
}

function estimateLocalWaterWidthPx(params: {
  shoreX: number;
  shoreY: number;
  inwardX: number;
  inwardY: number;
  transform: SilhouetteTransform;
  exterior: number[][];
  holes: number[][][];
  maxPx: number;
}): number | null {
  const { shoreX, shoreY, inwardX, inwardY, transform, exterior, holes, maxPx } = params;
  const stepPx = 2;
  let enteredWater = false;
  let lastInside = 0;
  for (let d = stepPx; d <= maxPx; d += stepPx) {
    const ll = lonLatFromSvgPoint(shoreX + inwardX * d, shoreY + inwardY * d, transform);
    if (pointInPrimaryWater(ll.lon, ll.lat, exterior, holes)) {
      enteredWater = true;
      lastInside = d;
      continue;
    }
    if (enteredWater) break;
  }
  return enteredWater ? lastInside : null;
}

function applyLocalWaterWidthCap(params: {
  shape: { rx: number; ry: number; centerOffset: number; coverageMin: number };
  cls: WaterReaderGeometryFeatureClass;
  localWaterWidthPx: number | null;
  slenderness: number;
  warnings: string[];
  diag?: LayoutDiagCounters;
}): { rx: number; ry: number; centerOffset: number; coverageMin: number } | null {
  const { shape, cls, localWaterWidthPx, slenderness, warnings, diag } = params;
  if (localWaterWidthPx == null) return shape;
  const slender = slenderness >= 3.2;
  const verySlender = slenderness >= 5.5;
  /** Tighter bank-first caps: shallow inward depth and limited along-shore span vs local width. */
  const limits =
    cls === 'long_bank'
      ? {
          rx: verySlender ? 0.44 : slender ? 0.56 : 0.72,
          ry: verySlender ? 0.12 : slender ? 0.14 : 0.16,
          offset: verySlender ? 0.14 : slender ? 0.17 : 0.2,
          minRx: verySlender ? 24 : 28,
          minRy: verySlender ? 5.5 : 6.5,
          minOffset: verySlender ? 5.5 : 6.5,
        }
      : cls === 'pocket_edge'
        ? {
            rx: verySlender ? 0.34 : slender ? 0.42 : 0.58,
            ry: verySlender ? 0.14 : slender ? 0.17 : 0.22,
            offset: verySlender ? 0.18 : slender ? 0.22 : 0.26,
            minRx: verySlender ? 17 : 19,
            minRy: verySlender ? 6.5 : 7.5,
            minOffset: verySlender ? 5.5 : 6.5,
          }
        : cls === 'shoreline_bend'
          ? {
              rx: verySlender ? 0.32 : slender ? 0.4 : 0.64,
              ry: verySlender ? 0.15 : slender ? 0.18 : 0.25,
              offset: verySlender ? 0.2 : slender ? 0.24 : 0.28,
              minRx: verySlender ? 20 : 22,
              minRy: verySlender ? 6.5 : 7.5,
              minOffset: verySlender ? 5.5 : 6.5,
            }
          : {
              rx: verySlender ? 0.3 : slender ? 0.38 : 0.66,
              ry: verySlender ? 0.145 : slender ? 0.17 : 0.26,
              offset: verySlender ? 0.2 : slender ? 0.24 : 0.28,
              minRx: verySlender ? 18 : 20,
              minRy: verySlender ? 6.5 : 7.5,
              minOffset: verySlender ? 5.5 : 6.5,
            };
  const cappedRy = Math.min(shape.ry, Math.max(limits.minRy, localWaterWidthPx * limits.ry));
  const cappedCenterOffset = Math.min(
    shape.centerOffset,
    Math.max(limits.minOffset, localWaterWidthPx * limits.offset),
  );
  const cappedRx = Math.min(shape.rx, Math.max(limits.minRx, localWaterWidthPx * limits.rx));
  const bankSideCapped =
    cappedRy < shape.ry * 0.96 ||
    cappedCenterOffset < shape.centerOffset * 0.96 ||
    cappedRx < shape.rx * 0.96;
  if (bankSideCapped) {
    warnings.push('zone_bank_side_width_cap_applied');
    if (diag) diag.bankSideCap++;
  }
  if (cappedRy < limits.minRy || cappedCenterOffset < limits.minOffset || cappedRx < limits.minRx) return null;
  return {
    ...shape,
    rx: cappedRx,
    ry: cappedRy,
    centerOffset: cappedCenterOffset,
  };
}

function smoothPatchLocalWidthFootprint(params: {
  shoreX: number;
  shoreY: number;
  inwardX: number;
  inwardY: number;
  cx: number;
  cy: number;
  ux: number;
  uy: number;
  vx: number;
  vy: number;
  rx: number;
  ry: number;
}): { minInward: number; maxInward: number; span: number } {
  const { shoreX, shoreY, inwardX, inwardY, cx, cy, ux, uy, vx, vy, rx, ry } = params;
  let minInward = Infinity;
  let maxInward = -Infinity;
  for (let i = 0; i < 16; i++) {
    const theta = (i / 16) * Math.PI * 2;
    const x = cx + ux * rx * Math.cos(theta) + vx * ry * Math.sin(theta);
    const y = cy + uy * rx * Math.cos(theta) + vy * ry * Math.sin(theta);
    const projected = (x - shoreX) * inwardX + (y - shoreY) * inwardY;
    minInward = Math.min(minInward, projected);
    maxInward = Math.max(maxInward, projected);
  }
  return { minInward, maxInward, span: maxInward - minInward };
}

/** Class caps on inward depth (maxInward) and total inward span vs local perpendicular water width. */
function classFootprintFracLimits(cls: WaterReaderGeometryFeatureClass): {
  maxDepthFrac: number;
  maxSpanFrac: number;
} {
  switch (cls) {
    case 'long_bank':
      return { maxDepthFrac: 0.2, maxSpanFrac: 0.41 };
    case 'shoreline_bend':
      return { maxDepthFrac: 0.3, maxSpanFrac: 0.53 };
    case 'shoreline_point':
      return { maxDepthFrac: 0.28, maxSpanFrac: 0.51 };
    case 'pocket_edge':
      return { maxDepthFrac: 0.36, maxSpanFrac: 0.56 };
    default:
      return { maxDepthFrac: 0.3, maxSpanFrac: 0.52 };
  }
}

/** True when footprint exceeds class depth/span fractions of local water width. */
function smoothPatchViolatesFootprintFracs(params: {
  shoreX: number;
  shoreY: number;
  inwardX: number;
  inwardY: number;
  cx: number;
  cy: number;
  ux: number;
  uy: number;
  vx: number;
  vy: number;
  rx: number;
  ry: number;
  cls: WaterReaderGeometryFeatureClass;
  localWaterWidthPx: number | null;
}): boolean {
  const { cls, localWaterWidthPx } = params;
  if (localWaterWidthPx == null || localWaterWidthPx <= 0) return false;
  const { maxDepthFrac, maxSpanFrac } = classFootprintFracLimits(cls);
  const footprint = smoothPatchLocalWidthFootprint(params);
  const W = localWaterWidthPx;
  return footprint.maxInward > W * maxDepthFrac || footprint.span > W * maxSpanFrac;
}

function smoothPatchBridgesLocalWidth(params: {
  cls: WaterReaderGeometryFeatureClass;
  shoreX: number;
  shoreY: number;
  inwardX: number;
  inwardY: number;
  cx: number;
  cy: number;
  ux: number;
  uy: number;
  vx: number;
  vy: number;
  rx: number;
  ry: number;
  localWaterWidthPx: number | null;
}): boolean {
  return smoothPatchViolatesFootprintFracs(params);
}

function ellipseAabbCorners(params: {
  cx: number;
  cy: number;
  alongX: number;
  alongY: number;
  crossX: number;
  crossY: number;
  rx: number;
  ry: number;
}): PatchAabb {
  const { cx, cy, alongX, alongY, crossX, crossY, rx, ry } = params;
  const aabb: PatchAabb = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
  };
  for (const q of [
    { x: cx + alongX * rx, y: cy + alongY * rx },
    { x: cx - alongX * rx, y: cy - alongY * rx },
    { x: cx + crossX * ry, y: cy + crossY * ry },
    { x: cx - crossX * ry, y: cy - crossY * ry },
  ]) {
    expandAabb(aabb, q.x, q.y);
  }
  return aabb;
}

function minRyRxFloorForClass(cls: WaterReaderGeometryFeatureClass): { minRy: number; minRx: number } {
  switch (cls) {
    case 'long_bank':
      return { minRy: 4.8, minRx: 15 };
    case 'pocket_edge':
      return { minRy: 6, minRx: 11 };
    case 'shoreline_bend':
      return { minRy: 6.2, minRx: 12 };
    case 'shoreline_point':
      return { minRy: 6.2, minRx: 12 };
    default:
      return { minRy: 6, minRx: 12 };
  }
}

/**
 * Nudge ellipse toward shoreline merge: ellipse crosses polygon boundary so unclipped water fraction is bounded (~37–82%).
 */
function recenterSmoothPatchToShoreline(params: {
  shoreX: number;
  shoreY: number;
  inwardX: number;
  inwardY: number;
  alongX: number;
  alongY: number;
  crossX: number;
  crossY: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  cls: WaterReaderGeometryFeatureClass;
  localWaterWidthPx: number | null;
  minLakeDim: number;
  transform: SilhouetteTransform;
  exterior: number[][];
  holes: number[][][];
  coverageMin: number;
  warnings: string[];
  diag?: LayoutDiagCounters;
}): {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  coverage: number;
  zonePathD: string;
  aabb: PatchAabb;
} | null {
  const {
    shoreX,
    shoreY,
    inwardX,
    inwardY,
    alongX,
    alongY,
    crossX,
    crossY,
    transform,
    exterior,
    holes,
    cls,
    localWaterWidthPx,
    minLakeDim,
    coverageMin,
    warnings,
    diag,
  } = params;

  let { cx, cy, rx, ry } = params;
  let { maxDepthFrac, maxSpanFrac } = classFootprintFracLimits(cls);
  maxDepthFrac *= 1.02;
  maxSpanFrac *= 1.02;
  const { minRy, minRx } = minRyRxFloorForClass(cls);
  const mergeCeil = mergeMinInwardCeilingPx(cls);
  let inwardCapped = false;
  let recentred = false;

  function mergeOk(): boolean {
    const shoreMerge = analyzeSmoothPatchShoreMerge({
      shoreX,
      shoreY,
      inwardX,
      inwardY,
      cx,
      cy,
      alongX,
      alongY,
      crossX,
      crossY,
      rx,
      ry,
      transform,
      exterior,
      holes,
    });
    return smoothPatchPassesVisibleMerge({ shoreMerge, cls, minLakeDim, rx, ry });
  }

  for (let iter = 0; iter < 34; iter++) {
    let fp = smoothPatchLocalWidthFootprint({
      shoreX,
      shoreY,
      inwardX,
      inwardY,
      cx,
      cy,
      ux: alongX,
      uy: alongY,
      vx: crossX,
      vy: crossY,
      rx,
      ry,
    });

    let coverageProbe = waterCoverageForSmoothPatch({
      cx,
      cy,
      ux: alongX,
      uy: alongY,
      vx: crossX,
      vy: crossY,
      rx,
      ry,
      transform,
      exterior,
      holes,
    });

    const widthViolates =
      localWaterWidthPx != null &&
      localWaterWidthPx > 0 &&
      (fp.maxInward > localWaterWidthPx * maxDepthFrac || fp.span > localWaterWidthPx * maxSpanFrac);
    const needsShoreBias = fp.minInward > mergeCeil || !mergeOk();

    if (!widthViolates && coverageProbe >= coverageMin && mergeOk()) break;

    if (widthViolates && ry >= minRy * 1.02) {
      ry *= 0.9;
      inwardCapped = true;
      if (ry < minRy * 1.08) rx *= 0.94;
      continue;
    }
    if (widthViolates && rx >= minRx * 1.04) {
      rx *= 0.92;
      inwardCapped = true;
      continue;
    }

    if (coverageProbe < coverageMin || needsShoreBias) {
      const gap = fp.minInward - mergeCeil;
      const shift = clamp(
        Math.max(gap > 0 ? gap + 0.95 : 0.55, coverageProbe < coverageMin ? 0.66 : 0),
        0.45,
        9,
      );
      let moved = false;
      for (const stepFrac of [1, 0.72, 0.5, 0.33, 0.18] as const) {
        const ncx = cx - inwardX * shift * stepFrac;
        const ncy = cy - inwardY * shift * stepFrac;
        const ll = lonLatFromSvgPoint(ncx, ncy, transform);
        if (!pointInPrimaryWater(ll.lon, ll.lat, exterior, holes)) continue;
        cx = ncx;
        cy = ncy;
        recentred = true;
        moved = true;
        break;
      }
      if (!moved) {
        if (ry >= minRy * 1.02) {
          ry *= 0.92;
          inwardCapped = true;
        }
        if (rx > minRx * 1.04) rx *= 0.95;
      }
      continue;
    }
    break;
  }

  let coverage = waterCoverageForSmoothPatch({
    cx,
    cy,
    ux: alongX,
    uy: alongY,
    vx: crossX,
    vy: crossY,
    rx,
    ry,
    transform,
    exterior,
    holes,
  });
  const shoreMerge = analyzeSmoothPatchShoreMerge({
    shoreX,
    shoreY,
    inwardX,
    inwardY,
    cx,
    cy,
    alongX,
    alongY,
    crossX,
    crossY,
    rx,
    ry,
    transform,
    exterior,
    holes,
  });

  if (coverage < coverageMin || !smoothPatchPassesVisibleMerge({ shoreMerge, cls, minLakeDim, rx, ry })) {
    return null;
  }

  if (inwardCapped) {
    warnings.push('zone_inward_depth_capped');
    if (diag) diag.inwardDepthCapped++;
  }
  if (recentred) {
    warnings.push('zone_recentred_to_shoreline');
    if (diag) diag.recentredToShoreline++;
  }

  return {
    cx,
    cy,
    rx,
    ry,
    coverage,
    zonePathD: pathDFromSmoothPatch({
      cx,
      cy,
      ux: alongX,
      uy: alongY,
      vx: crossX,
      vy: crossY,
      rx,
      ry,
    }),
    aabb: ellipseAabbCorners({ cx, cy, alongX, alongY, crossX, crossY, rx, ry }),
  };
}

function minDistShoreCueToEllipseBoundary(params: {
  shoreX: number;
  shoreY: number;
  cx: number;
  cy: number;
  ux: number;
  uy: number;
  vx: number;
  vy: number;
  rx: number;
  ry: number;
}): number {
  const { shoreX, shoreY, cx, cy, ux, uy, vx, vy, rx, ry } = params;
  let best = Infinity;
  for (let i = 0; i <= 72; i++) {
    const theta = (i / 72) * Math.PI * 2;
    const ex = cx + ux * rx * Math.cos(theta) + vx * ry * Math.sin(theta);
    const ey = cy + uy * rx * Math.cos(theta) + vy * ry * Math.sin(theta);
    best = Math.min(best, Math.hypot(shoreX - ex, shoreY - ey));
  }
  return best;
}

/** Non-neck only: passes when ellipse straddles shoreline (minInward past merge plane, waterFrac not “full oval”, bank land hits). */
function smoothPatchVisiblyClipsShoreline(params: {
  shoreX: number;
  shoreY: number;
  inwardX: number;
  inwardY: number;
  cx: number;
  cy: number;
  alongX: number;
  alongY: number;
  crossX: number;
  crossY: number;
  rx: number;
  ry: number;
  cls: WaterReaderGeometryFeatureClass;
  minLakeDim: number;
  transform: SilhouetteTransform;
  exterior: number[][];
  holes: number[][][];
}): boolean {
  const shoreMerge = analyzeSmoothPatchShoreMerge({
    shoreX: params.shoreX,
    shoreY: params.shoreY,
    inwardX: params.inwardX,
    inwardY: params.inwardY,
    cx: params.cx,
    cy: params.cy,
    alongX: params.alongX,
    alongY: params.alongY,
    crossX: params.crossX,
    crossY: params.crossY,
    rx: params.rx,
    ry: params.ry,
    transform: params.transform,
    exterior: params.exterior,
    holes: params.holes,
  });
  return smoothPatchPassesVisibleMerge({
    shoreMerge,
    cls: params.cls,
    minLakeDim: params.minLakeDim,
    rx: params.rx,
    ry: params.ry,
  });
}

type NonNeckAcceptFail =
  | 'no_shoreline_contact'
  | 'open_water_zone'
  | 'max_inward_span'
  | 'weak_shoreline_contact';

function validateNonNeckZoneAcceptance(params: {
  cx: number;
  cy: number;
  shoreX: number;
  shoreY: number;
  alongX: number;
  alongY: number;
  crossX: number;
  crossY: number;
  inwardX: number;
  inwardY: number;
  rx: number;
  ry: number;
  coverage: number;
  coverageMin: number;
  transform: SilhouetteTransform;
  exterior: number[][];
  holes: number[][][];
  localWaterWidthPx: number | null;
  cls: WaterReaderGeometryFeatureClass;
  lakeCentroidSvg: { x: number; y: number };
  minLakeDim: number;
}): { ok: true } | { ok: false; reason: NonNeckAcceptFail } {
  const {
    cx,
    cy,
    shoreX,
    shoreY,
    alongX,
    alongY,
    crossX,
    crossY,
    inwardX,
    inwardY,
    rx,
    ry,
    coverage,
    coverageMin,
    transform,
    exterior,
    holes,
    localWaterWidthPx,
    cls,
    lakeCentroidSvg,
    minLakeDim,
  } = params;

  const centerLl = lonLatFromSvgPoint(cx, cy, transform);
  if (!pointInPrimaryWater(centerLl.lon, centerLl.lat, exterior, holes)) {
    return { ok: false, reason: 'open_water_zone' };
  }

  if (coverage < coverageMin) {
    return { ok: false, reason: 'open_water_zone' };
  }

  const distCueToEllipse = minDistShoreCueToEllipseBoundary({
    shoreX,
    shoreY,
    cx,
    cy,
    ux: alongX,
    uy: alongY,
    vx: crossX,
    vy: crossY,
    rx,
    ry,
  });
  const contactScale =
    cls === 'pocket_edge'
      ? 0.78
      : cls === 'shoreline_bend'
        ? 0.48
        : cls === 'long_bank'
          ? 0.4
          : 0.48;
  const contactMax = Math.max(8, contactScale * Math.min(rx, ry));
  let contactSoftCap = contactMax;
  if (cls === 'pocket_edge' && coverage >= coverageMin + 0.018) {
    contactSoftCap = contactMax * 1.22;
  } else if (cls === 'shoreline_bend' && coverage >= coverageMin + 0.042) {
    contactSoftCap = contactMax * 1.08;
  }
  if (distCueToEllipse > contactSoftCap) {
    return { ok: false, reason: 'weak_shoreline_contact' };
  }

  if (
    !smoothPatchVisiblyClipsShoreline({
      shoreX,
      shoreY,
      inwardX,
      inwardY,
      cx,
      cy,
      alongX,
      alongY,
      crossX,
      crossY,
      rx,
      ry,
      cls,
      minLakeDim,
      transform,
      exterior,
      holes,
    })
  ) {
    return { ok: false, reason: 'weak_shoreline_contact' };
  }

  const drift = Math.hypot(cx - shoreX, cy - shoreY);
  const charSize = Math.max(rx, ry);
  const minor = Math.min(rx, ry);
  const inwardAlign = Math.abs((cx - shoreX) * inwardX + (cy - shoreY) * inwardY);
  const bankLike = inwardAlign >= drift * 0.76 - 0.5;
  if (!bankLike && drift > minor * 1.06) {
    return { ok: false, reason: 'weak_shoreline_contact' };
  }
  const nominalReach = minor + charSize * 0.38;
  let driftMax: number;
  if (localWaterWidthPx != null && localWaterWidthPx > 0) {
    const driftBoost = cls === 'shoreline_point' ? 1.06 : cls === 'pocket_edge' ? 0.98 : 1;
    driftMax = Math.min(
      localWaterWidthPx * 0.48 * driftBoost,
      Math.max(nominalReach * 1.45, charSize * 1.22 * driftBoost, minor * 2.12),
    );
  } else {
    driftMax = Math.max(nominalReach * 1.52, charSize * 1.28);
  }
  if (drift > driftMax) {
    return { ok: false, reason: 'open_water_zone' };
  }

  if (
    localWaterWidthPx != null &&
    localWaterWidthPx > Math.max(52, minLakeDim * 0.16)
  ) {
    const dCent = Math.hypot(cx - lakeCentroidSvg.x, cy - lakeCentroidSvg.y);
    const pullToBasin = dCent / Math.max(drift, 1e-6);
    if (
      pullToBasin < 1.05 &&
      drift > localWaterWidthPx * 0.21 &&
      drift > minor * 1.35
    ) {
      return { ok: false, reason: 'open_water_zone' };
    }
  }

  if (localWaterWidthPx != null && localWaterWidthPx > 0) {
    const footprint = smoothPatchLocalWidthFootprint({
      shoreX,
      shoreY,
      inwardX,
      inwardY,
      cx,
      cy,
      ux: alongX,
      uy: alongY,
      vx: crossX,
      vy: crossY,
      rx,
      ry,
    });
    const { maxDepthFrac: maxDepthFracLim, maxSpanFrac: maxSpanFracLim } = classFootprintFracLimits(cls);
    const maxSpanFrac = maxSpanFracLim * 0.98;
    const maxDepthFrac = maxDepthFracLim * 0.98;
    if (
      footprint.span > localWaterWidthPx * maxSpanFrac ||
      footprint.maxInward > localWaterWidthPx * maxDepthFrac
    ) {
      return { ok: false, reason: 'max_inward_span' };
    }
  }

  return { ok: true };
}

function warnForNonNeckReject(reason: NonNeckAcceptFail): string {
  switch (reason) {
    case 'no_shoreline_contact':
      return 'suppressed_no_shoreline_contact';
    case 'open_water_zone':
      return 'suppressed_open_water_zone';
    case 'max_inward_span':
      return 'suppressed_zone_bridges_local_width';
    case 'weak_shoreline_contact':
      return 'suppressed_weak_shoreline_contact';
  }
}

/** One conservative retry: tight inward offset from cue, compact ellipse; same acceptance gates as primary. */
function tryBankSideFallbackRibbon(params: {
  cls: WaterReaderGeometryFeatureClass;
  shore: { x: number; y: number };
  inward: { x: number; y: number };
  along: { x: number; y: number };
  cross: { x: number; y: number };
  transform: SilhouetteTransform;
  exterior: number[][];
  holes: number[][][];
  localWaterWidthPx: number | null;
  minLakeDim: number;
  coverageMin: number;
  lakeCentroidSvg: { x: number; y: number };
  warnings: string[];
  diag?: LayoutDiagCounters;
}): {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  aabb: PatchAabb;
  zonePathD: string;
  coverage: number;
} | null {
  const {
    cls,
    shore,
    inward,
    along,
    cross,
    transform,
    exterior,
    holes,
    localWaterWidthPx,
    minLakeDim,
    coverageMin,
    lakeCentroidSvg,
    warnings,
    diag,
  } = params;

  const wRef =
    localWaterWidthPx != null && localWaterWidthPx > 1
      ? localWaterWidthPx
      : Math.max(minLakeDim * 0.4, 52);

  const inwardFracCandidates =
    cls === 'long_bank'
      ? [0.14, 0.165, 0.195]
      : cls === 'shoreline_point'
        ? [0.15, 0.175, 0.205]
        : cls === 'pocket_edge'
          ? [0.14, 0.17, 0.2]
          : [0.155, 0.18, 0.215];

  let rx: number;
  let ry: number;
  switch (cls) {
    case 'shoreline_point':
      rx = clamp(wRef * 0.268, 14, 24);
      ry = rx * 0.66;
      break;
    case 'pocket_edge':
      rx = clamp(wRef * 0.248, 12, 21);
      ry = rx * 0.56;
      break;
    case 'shoreline_bend':
      rx = clamp(wRef * 0.298, 15, 26);
      ry = rx * 0.44;
      break;
    case 'long_bank':
      rx = clamp(wRef * 0.39, 18, 36);
      ry = clamp(wRef * 0.105, 5.5, 10.5);
      break;
    default:
      rx = clamp(wRef * 0.26, 13, 22);
      ry = rx * 0.62;
  }

  rx = Math.min(rx, wRef * 0.5);
  ry = Math.min(ry, wRef * 0.21);
  if (cls === 'pocket_edge' || cls === 'shoreline_point') {
    rx *= 0.9;
    ry *= 0.9;
  }

  for (const inwardFrac of inwardFracCandidates) {
    const inwardOff = clamp(wRef * inwardFrac, 10, Math.min(52, wRef * 0.22));
    const cx = shore.x + inward.x * inwardOff;
    const cy = shore.y + inward.y * inwardOff;
    const centerLl = lonLatFromSvgPoint(cx, cy, transform);
    if (!pointInPrimaryWater(centerLl.lon, centerLl.lat, exterior, holes)) continue;

    const shrinkSteps = [1, 0.88, 0.76, 0.67];
    for (const step of shrinkSteps) {
      let rxS = rx * step;
      let ryS = ry * step;
      if (
        smoothPatchBridgesLocalWidth({
          cls,
          shoreX: shore.x,
          shoreY: shore.y,
          inwardX: inward.x,
          inwardY: inward.y,
          cx,
          cy,
          ux: along.x,
          uy: along.y,
          vx: cross.x,
          vy: cross.y,
          rx: rxS,
          ry: ryS,
          localWaterWidthPx,
        })
      ) {
        rxS *= 0.82;
        ryS *= 0.82;
      }
      if (
        smoothPatchBridgesLocalWidth({
          cls,
          shoreX: shore.x,
          shoreY: shore.y,
          inwardX: inward.x,
          inwardY: inward.y,
          cx,
          cy,
          ux: along.x,
          uy: along.y,
          vx: cross.x,
          vy: cross.y,
          rx: rxS,
          ry: ryS,
          localWaterWidthPx,
        })
      ) {
        continue;
      }

      const polished = recenterSmoothPatchToShoreline({
        shoreX: shore.x,
        shoreY: shore.y,
        inwardX: inward.x,
        inwardY: inward.y,
        alongX: along.x,
        alongY: along.y,
        crossX: cross.x,
        crossY: cross.y,
        cx,
        cy,
        rx: rxS,
        ry: ryS,
        cls,
        localWaterWidthPx,
        minLakeDim,
        transform,
        exterior,
        holes,
        coverageMin,
        warnings,
        diag,
      });
      if (!polished) continue;

      const accept = validateNonNeckZoneAcceptance({
        cx: polished.cx,
        cy: polished.cy,
        shoreX: shore.x,
        shoreY: shore.y,
        alongX: along.x,
        alongY: along.y,
        crossX: cross.x,
        crossY: cross.y,
        inwardX: inward.x,
        inwardY: inward.y,
        rx: polished.rx,
        ry: polished.ry,
        coverage: polished.coverage,
        coverageMin,
        transform,
        exterior,
        holes,
        localWaterWidthPx,
        cls,
        lakeCentroidSvg,
        minLakeDim,
      });
      if (!accept.ok) continue;

      return {
        cx: polished.cx,
        cy: polished.cy,
        rx: polished.rx,
        ry: polished.ry,
        coverage: polished.coverage,
        aabb: polished.aabb,
        zonePathD: polished.zonePathD,
      };
    }
  }

  return null;
}

function buildShoreRibbonPatch(
  c: WaterReaderGeometryCandidate,
  ring: number[][],
  exterior: number[][],
  holes: number[][][],
  transform: SilhouetteTransform,
  minLakeDim: number,
  areaAcres: number | null | undefined,
  slenderness: number,
  centerLon: number,
  centerLat: number,
  warnings: string[],
  diag: LayoutDiagCounters | undefined,
): LakeRenderedPatch | null {
  const cls = c.featureClass;
  if (cls === 'neckdown') return null;

  const p = c.displayPatch;
  const shore = projectLonLatToSilhouetteSvg(p.shoreLon, p.shoreLat, transform);
  const along = svgUnitVectorFromLonLat(p.alongDLon, p.alongDLat, transform);
  const inward = svgUnitVectorFromLonLat(p.inwardDLon, p.inwardDLat, transform);
  const centroidSvg = projectLonLatToSilhouetteSvg(centerLon, centerLat, transform);
  const toCenterLen = Math.hypot(centroidSvg.x - shore.x, centroidSvg.y - shore.y) || 1e-12;
  const toCenter = {
    x: (centroidSvg.x - shore.x) / toCenterLen,
    y: (centroidSvg.y - shore.y) / toCenterLen,
  };
  let cross = perpendicular(along);
  if (cross.x * inward.x + cross.y * inward.y < 0) {
    cross = { x: -cross.x, y: -cross.y };
  }
  const localWaterWidthPx = estimateLocalWaterWidthPx({
    shoreX: shore.x,
    shoreY: shore.y,
    inwardX: inward.x,
    inwardY: inward.y,
    transform,
    exterior,
    holes,
    maxPx: Math.max(minLakeDim * 0.72, 80),
  });
  const shape = applyLocalWaterWidthCap({
    shape: patchSizePx(cls, minLakeDim, areaAcres, slenderness),
    cls,
    localWaterWidthPx,
    slenderness,
    warnings,
    diag,
  });
  if (!shape) {
    warnings.push('suppressed_low_water_coverage');
    return null;
  }

  let chosen: {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    aabb: PatchAabb;
    zonePathD: string;
    reduced: boolean;
    coverage: number;
  } | null = null;
  let bridgeSuppressed = false;

  const bankOffsetSteps: readonly number[] =
    cls === 'pocket_edge'
      ? [0.12, 0.18, 0.26, 0.34, 0.44, 0.56, 0.72, 0.9, 1.06]
      : [0.1, 0.14, 0.2, 0.28, 0.38, 0.52, 0.66, 0.82, 1];

  const anchorCenters: { cx: number; cy: number; reduced: boolean }[] = [];
  for (const t of bankOffsetSteps) {
    anchorCenters.push({
      cx: shore.x + inward.x * shape.centerOffset * t,
      cy: shore.y + inward.y * shape.centerOffset * t,
      reduced: t > 0.42,
    });
  }
  const anchorSvg = projectLonLatToSilhouetteSvg(c.anchorLon, c.anchorLat, transform);
  anchorCenters.push(
    { cx: anchorSvg.x, cy: anchorSvg.y, reduced: true },
    {
      cx: anchorSvg.x + inward.x * shape.centerOffset * 0.12,
      cy: anchorSvg.y + inward.y * shape.centerOffset * 0.12,
      reduced: true,
    },
  );

  const inwardToCenterDot = inward.x * toCenter.x + inward.y * toCenter.y;
  if (inwardToCenterDot >= 0.9) {
    for (const t of [0.12, 0.2, 0.26] as const) {
      anchorCenters.push({
        cx: shore.x + toCenter.x * shape.centerOffset * t,
        cy: shore.y + toCenter.y * shape.centerOffset * t,
        reduced: true,
      });
    }
  }

  for (const anchorCenter of anchorCenters) {
    const { cx, cy } = anchorCenter;
    const centerLl = lonLatFromSvgPoint(cx, cy, transform);
    if (!pointInPrimaryWater(centerLl.lon, centerLl.lat, exterior, holes)) continue;
    for (const sizeStep of [1, 0.82, 0.66]) {
        let rx = shape.rx * sizeStep;
        let ry = shape.ry * sizeStep;
        let bridgeReduced = false;
        if (
          smoothPatchBridgesLocalWidth({
            cls,
            shoreX: shore.x,
            shoreY: shore.y,
            inwardX: inward.x,
            inwardY: inward.y,
            cx,
            cy,
            ux: along.x,
            uy: along.y,
            vx: cross.x,
            vy: cross.y,
            rx,
            ry,
            localWaterWidthPx,
          })
        ) {
          const shrink = cls === 'pocket_edge' || cls === 'long_bank' ? 0.84 : 0.8;
          rx *= shrink;
          ry *= shrink;
          bridgeReduced = true;
          if (
            smoothPatchBridgesLocalWidth({
              cls,
              shoreX: shore.x,
              shoreY: shore.y,
              inwardX: inward.x,
              inwardY: inward.y,
              cx,
              cy,
              ux: along.x,
              uy: along.y,
              vx: cross.x,
              vy: cross.y,
              rx,
              ry,
              localWaterWidthPx,
            })
          ) {
            if (slenderness >= 3.2) {
              bridgeSuppressed = true;
              continue;
            }
            rx *= 0.9;
            ry *= 0.9;
          }
        }
        const coverage = waterCoverageForSmoothPatch({
          cx,
          cy,
          ux: along.x,
          uy: along.y,
          vx: cross.x,
          vy: cross.y,
          rx,
          ry,
          transform,
          exterior,
          holes,
        });
        if (coverage < shape.coverageMin) continue;

        const polished = recenterSmoothPatchToShoreline({
          shoreX: shore.x,
          shoreY: shore.y,
          inwardX: inward.x,
          inwardY: inward.y,
          alongX: along.x,
          alongY: along.y,
          crossX: cross.x,
          crossY: cross.y,
          cx,
          cy,
          rx,
          ry,
          cls,
          localWaterWidthPx,
          minLakeDim,
          transform,
          exterior,
          holes,
          coverageMin: shape.coverageMin,
          warnings,
          diag,
        });
        if (!polished) continue;

        chosen = {
          cx: polished.cx,
          cy: polished.cy,
          rx: polished.rx,
          ry: polished.ry,
          aabb: polished.aabb,
          reduced: anchorCenter.reduced || sizeStep < 1 || bridgeReduced,
          coverage: polished.coverage,
          zonePathD: polished.zonePathD,
        };
        break;
      }
    if (chosen) break;
  }

  let primaryReject: NonNeckAcceptFail | null = null;
  if (chosen) {
    const acceptPrimary = validateNonNeckZoneAcceptance({
      cx: chosen.cx,
      cy: chosen.cy,
      shoreX: shore.x,
      shoreY: shore.y,
      alongX: along.x,
      alongY: along.y,
      crossX: cross.x,
      crossY: cross.y,
      inwardX: inward.x,
      inwardY: inward.y,
      rx: chosen.rx,
      ry: chosen.ry,
      coverage: chosen.coverage,
      coverageMin: shape.coverageMin,
      transform,
      exterior,
      holes,
      localWaterWidthPx,
      cls,
      lakeCentroidSvg: centroidSvg,
      minLakeDim,
    });
    if (acceptPrimary.ok) {
      if (chosen.reduced) warnings.push('zone_depth_reduced_to_fit_water');
      return {
        candidateId: c.candidateId,
        rank: c.rank,
        featureClass: c.featureClass,
        cx: chosen.cx,
        cy: chosen.cy,
        rx: chosen.rx,
        ry: chosen.ry,
        rotationDeg: (Math.atan2(along.y, along.x) * 180) / Math.PI,
        fill: c.zoneFillRgba,
        stroke: c.zoneStrokeRgba,
        aabb: chosen.aabb,
        zonePathD: chosen.zonePathD,
      };
    }
    primaryReject = acceptPrimary.reason;
  }

  const fbChosen = tryBankSideFallbackRibbon({
    cls,
    shore,
    inward,
    along,
    cross,
    transform,
    exterior,
    holes,
    localWaterWidthPx,
    minLakeDim,
    coverageMin: shape.coverageMin,
    lakeCentroidSvg: centroidSvg,
    warnings,
    diag,
  });
  if (fbChosen) {
    warnings.push('zone_bank_side_fallback_used');
    if (diag) diag.bankSideFallbackUsed++;
    return {
      candidateId: c.candidateId,
      rank: c.rank,
      featureClass: c.featureClass,
      cx: fbChosen.cx,
      cy: fbChosen.cy,
      rx: fbChosen.rx,
      ry: fbChosen.ry,
      rotationDeg: (Math.atan2(along.y, along.x) * 180) / Math.PI,
      fill: c.zoneFillRgba,
      stroke: c.zoneStrokeRgba,
      aabb: fbChosen.aabb,
      zonePathD: fbChosen.zonePathD,
    };
  }

  if (!chosen) {
    if (bridgeSuppressed) {
      warnings.push('suppressed_zone_bridges_local_width');
      if (diag) diag.bridgeSuppressed++;
      return null;
    }
    const nearCue = lonLatFromSvgPoint(
      shore.x + inward.x * shape.centerOffset * 0.28,
      shore.y + inward.y * shape.centerOffset * 0.28,
      transform,
    );
    if (!pointInPrimaryWater(nearCue.lon, nearCue.lat, exterior, holes)) {
      warnings.push('suppressed_zone_anchor_outside_water');
    } else {
      warnings.push('suppressed_low_water_coverage');
    }
    return null;
  }

  if (primaryReject) {
    warnings.push(warnForNonNeckReject(primaryReject));
    if (diag) {
      if (primaryReject === 'no_shoreline_contact') diag.noShorelineContact++;
      else if (primaryReject === 'open_water_zone') diag.openWaterZone++;
      else if (primaryReject === 'weak_shoreline_contact') diag.weakShorelineContactSuppressed++;
      else diag.bridgeSuppressed++;
    }
  }
  return null;
}

function neckPassesDisplayGate(
  pinchDist: number,
  minLakeDim: number,
  m: WaterReaderNeckMetrics | undefined,
): boolean {
  const strongPinch =
    m != null && m.relDiag < 0.04 && m.pinchToMedian < 0.22 && m.lobeContrast >= 8;
  const throatRatio = pinchDist / minLakeDim;
  if (throatRatio > NECK_THROAT_MAX_FRAC && !strongPinch) return false;
  if (!strongPinch && pinchDist < 5.0) return false;
  if (!m) return throatRatio <= NECK_THROAT_MAX_FRAC * 0.92;
  if (m.relDiag > NECK_MAX_REL_DIAG) return false;
  if (m.pinchToMedian > NECK_MAX_PINCH_TO_MED) return false;
  return true;
}

function patchCorridorForNeck(
  c: WaterReaderGeometryCandidate,
  exterior: number[][],
  holes: number[][][],
  transform: SilhouetteTransform,
  cap: number,
  minLakeDim: number,
  warnings: string[],
): LakeRenderedPatch | null {
  const cor = c.neckCorridor;
  if (!cor) {
    warnings.push('suppressed_unclear_neckdown');
    return null;
  }
  const a = projectLonLatToSilhouetteSvg(cor.shoreALon, cor.shoreALat, transform);
  const b = projectLonLatToSilhouetteSvg(cor.shoreBLon, cor.shoreBLat, transform);
  const pinchDist = Math.hypot(b.x - a.x, b.y - a.y);
  if (!neckPassesDisplayGate(pinchDist, minLakeDim, c.neckMetrics)) {
    warnings.push('suppressed_unclear_neckdown');
    return null;
  }
  const centerLl = lonLatFromSvgPoint((a.x + b.x) / 2, (a.y + b.y) / 2, transform);
  if (!pointInPrimaryWater(centerLl.lon, centerLl.lat, exterior, holes)) {
    warnings.push('suppressed_zone_anchor_outside_water');
    return null;
  }
  const strongPinch =
    c.neckMetrics != null &&
    c.neckMetrics.relDiag < 0.04 &&
    c.neckMetrics.pinchToMedian < 0.22 &&
    c.neckMetrics.lobeContrast >= 8;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lineLen = Math.hypot(dx, dy) || 1e-9;
  const chord = { x: dx / lineLen, y: dy / lineLen };
  const passage = perpendicular(chord);
  const majorAxis = strongPinch ? passage : chord;
  const minorAxis = strongPinch ? chord : passage;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const baseMajor = strongPinch
    ? Math.min(Math.max(pinchDist * 2.35, 28), cap * 0.58)
    : Math.min(Math.max(pinchDist * 0.64, 13), cap * 0.46);
  const baseMinor = strongPinch
    ? Math.min(Math.max(pinchDist * 0.58, 8.5), cap * 0.18)
    : Math.min(Math.max(pinchDist * 0.2, 5.2), cap * 0.11);

  let chosen:
    | {
        rx: number;
        ry: number;
        zonePathD: string;
        aabb: PatchAabb;
        reduced: boolean;
      }
    | null = null;

  for (const sizeStep of [1, 0.82, 0.64, 0.48]) {
    const rx = baseMajor * sizeStep;
    const ry = baseMinor * sizeStep;
    const coverage = waterCoverageForSmoothPatch({
      cx: mx,
      cy: my,
      ux: majorAxis.x,
      uy: majorAxis.y,
      vx: minorAxis.x,
      vy: minorAxis.y,
      rx,
      ry,
      transform,
      exterior,
      holes,
    });
    if (coverage < (strongPinch ? 0.34 : 0.3)) continue;
    const aabb: PatchAabb = {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    };
    for (const q of [
      { x: mx + majorAxis.x * rx, y: my + majorAxis.y * rx },
      { x: mx - majorAxis.x * rx, y: my - majorAxis.y * rx },
      { x: mx + minorAxis.x * ry, y: my + minorAxis.y * ry },
      { x: mx - minorAxis.x * ry, y: my - minorAxis.y * ry },
    ]) {
      expandAabb(aabb, q.x, q.y);
    }
    chosen = {
      rx,
      ry,
      aabb,
      reduced: sizeStep < 1,
      zonePathD: pathDFromSmoothPatch({
        cx: mx,
        cy: my,
        ux: majorAxis.x,
        uy: majorAxis.y,
        vx: minorAxis.x,
        vy: minorAxis.y,
        rx,
        ry,
      }),
    };
    break;
  }

  if (!chosen) {
    warnings.push('suppressed_low_water_coverage');
    return null;
  }
  if (chosen.reduced) warnings.push('zone_depth_reduced_to_fit_water');

  return {
    candidateId: c.candidateId,
    rank: c.rank,
    featureClass: 'neckdown',
    cx: mx,
    cy: my,
    rx: chosen.rx,
    ry: chosen.ry,
    rotationDeg: (Math.atan2(majorAxis.y, majorAxis.x) * 180) / Math.PI,
    fill: c.zoneFillRgba,
    stroke: c.zoneStrokeRgba,
    aabb: chosen.aabb,
    zonePathD: chosen.zonePathD,
  };
}

function layoutPatchForCandidate(
  c: WaterReaderGeometryCandidate,
  ring: number[][],
  exterior: number[][],
  holes: number[][][],
  transform: SilhouetteTransform,
  cap: number,
  minLakeDim: number,
  areaAcres: number | null | undefined,
  slenderness: number,
  centerLon: number,
  centerLat: number,
  warnings: string[],
  diag: LayoutDiagCounters | undefined,
): LakeRenderedPatch | null {
  if (c.featureClass === 'neckdown') {
    return patchCorridorForNeck(c, exterior, holes, transform, cap, minLakeDim, warnings);
  }
  return buildShoreRibbonPatch(
    c,
    ring,
    exterior,
    holes,
    transform,
    minLakeDim,
    areaAcres,
    slenderness,
    centerLon,
    centerLat,
    warnings,
    diag,
  );
}

function wouldCreateNonNeckCluster(
  kept: LakeRenderedPatch[],
  patch: LakeRenderedPatch,
  minLakeDim: number,
): boolean {
  if (patch.featureClass === 'neckdown') return false;
  const clusterRadius = Math.max(minLakeDim * 0.22, 42);
  let nearbyNonNeck = 0;
  for (const k of kept) {
    if (k.featureClass === 'neckdown') continue;
    if (Math.hypot(patch.cx - k.cx, patch.cy - k.cy) <= clusterRadius) nearbyNonNeck++;
    if (nearbyNonNeck >= 2) return true;
  }
  return false;
}

function selectGreedyNonOverlapping(
  sorted: WaterReaderGeometryCandidate[],
  ring: number[][],
  exterior: number[][],
  holes: number[][][],
  transform: SilhouetteTransform,
  cap: number,
  minLakeDim: number,
  areaAcres: number | null | undefined,
  slenderness: number,
  centerLon: number,
  centerLat: number,
  warnings: string[],
  diag: LayoutDiagCounters | undefined,
): LakeRenderedPatch[] {
  const kept: LakeRenderedPatch[] = [];
  const clusterDist = Math.max(minLakeDim * CLUSTER_CENTER_FRAC, 11);

  for (const c of sorted) {
    if (kept.length >= MAX_VISIBLE_ZONES) break;
    const patch = layoutPatchForCandidate(
      c,
      ring,
      exterior,
      holes,
      transform,
      cap,
      minLakeDim,
      areaAcres,
      slenderness,
      centerLon,
      centerLat,
      warnings,
      diag,
    );
    if (!patch) continue;
    let clash = false;
    let clustered = false;
    if (wouldCreateNonNeckCluster(kept, patch, minLakeDim)) {
      warnings.push('suppressed_clustered_zone');
      continue;
    }
    for (const k of kept) {
      if (patchPairOverlapMinFrac(patch, k) >= overlapDropThreshold(patch, k)) {
        clash = true;
        break;
      }
      const pocketPair =
        patch.featureClass === 'pocket_edge' && k.featureClass === 'pocket_edge';
      const clusterDistEff = pocketPair ? clusterDist * 0.72 : clusterDist;
      const clusterOverlapNeed = pocketPair ? 0.33 : 0.2;
      if (
        patch.featureClass !== 'neckdown' &&
        k.featureClass !== 'neckdown' &&
        Math.hypot(patch.cx - k.cx, patch.cy - k.cy) < clusterDistEff &&
        patchPairOverlapMinFrac(patch, k) >= clusterOverlapNeed
      ) {
        clustered = true;
        break;
      }
    }
    if (clustered) {
      warnings.push('suppressed_clustered_zone');
      continue;
    }
    if (clash) continue;
    kept.push(patch);
  }

  kept.sort((a, b) => a.rank - b.rank);
  return kept;
}

export function computeRenderedLakePatches(
  candidates: WaterReaderGeometryCandidate[],
  transform: SilhouetteTransform | null,
  width: number,
  canvasHeight: number,
  geojson: WaterbodyPolygonGeoJson | null,
  areaAcres?: number | null,
): LakeZoneLayoutResult {
  const warnings: string[] = [];
  const layoutDiagnostics: LakeZoneLayoutDiagnosticsSummary = {
    noShorelineContact: 0,
    openWaterZone: 0,
    bridgeSuppressed: 0,
    bankSideCap: 0,
    bankSideFallbackUsed: 0,
    recentredToShoreline: 0,
    inwardDepthCapped: 0,
    weakShorelineContactSuppressed: 0,
  };
  if (!transform || candidates.length === 0 || width <= 0 || canvasHeight <= 0 || !geojson) {
    return { patches: [], warnings, layoutDiagnostics };
  }
  const primary = primaryPolygonExteriorAndHoles(geojson);
  if (!primary) return { patches: [], warnings, layoutDiagnostics };
  const ring = openRingExterior(primary.exterior);
  if (ring.length < 4) return { patches: [], warnings, layoutDiagnostics };

  const cap = Math.min(width, canvasHeight) * LAKE_ZONE_CAP_FRAC;
  const minLakeDim = lakeMinDimSvg(geojson, transform);
  const slenderness = lakeSlendernessRatio(geojson);
  const center = ringCentroidLonLat(primary.exterior);
  const sorted = [...candidates].sort((a, b) => a.rank - b.rank);
  const patches = selectGreedyNonOverlapping(
    sorted,
    ring,
    primary.exterior,
    primary.holes,
    transform,
    cap,
    minLakeDim,
    areaAcres,
    slenderness,
    center.lon,
    center.lat,
    warnings,
    layoutDiagnostics,
  );
  return { patches, warnings, layoutDiagnostics };
}
