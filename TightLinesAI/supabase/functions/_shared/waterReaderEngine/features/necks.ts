import type { PointM, PolygonM, RingM, WaterReaderPreprocessResult } from '../contracts.ts';
import { bboxM, distanceM } from '../metrics.ts';
import { clamp } from '../shoreline.ts';
import type { WaterReaderNeckCandidate, WaterReaderSaddleCandidate } from './types.ts';
import { nearestPointOnRing, pointInWaterOrBoundary, segmentSamplesInsideWater } from './validation.ts';

type RasterCell = {
  ix: number;
  iy: number;
  center: PointM;
  distanceToShoreM: number;
  widthM: number;
  axis?: 'x' | 'y';
};

type WidthFeatureCandidate = {
  endpointA: PointM;
  endpointB: PointM;
  center: PointM;
  widthM: number;
  leftExpansionRatio: number;
  rightExpansionRatio: number;
  confidence: number;
  score: number;
  qaFlags: string[];
  metrics: Record<string, number | string | boolean | null>;
};

export function detectNeckAndSaddleCandidates(preprocess: WaterReaderPreprocessResult): {
  necks: WaterReaderNeckCandidate[];
  saddles: WaterReaderSaddleCandidate[];
} {
  const polygon = preprocess.primaryPolygon;
  const metrics = preprocess.metrics;
  if (!polygon || !metrics || polygon.exterior.length < 4) return { necks: [], saddles: [] };
  const raster = rasterizeWaterMask(polygon, metrics.longestDimensionM);
  if (raster.waterCells.length < 20) return { necks: [], saddles: [] };
  const waterToleranceM = clamp(metrics.longestDimensionM * 0.0015, 5, 30);
  const principal = principalAxis(metrics.bboxM);
  const centerline = [
    ...medialAxisLikeCells(raster.waterCells, raster.cellSizeM),
    ...transectWidthCells(raster.waterCells, raster.cellSizeM, 'x'),
    ...transectWidthCells(raster.waterCells, raster.cellSizeM, 'y'),
  ];
  if (centerline.length < 4) return { necks: [], saddles: [] };
  const searchDistanceM = clamp(metrics.longestDimensionM * 0.12, 60, 800);
  const raw = centerline
    .filter((cell) => isLocalWidthMinimum(cell, centerline, searchDistanceM * 0.35, cell.axis ?? principal))
    .sort((a, b) => a.widthM - b.widthM);

  const selected: WidthFeatureCandidate[] = [];
  for (const cell of raw) {
    if (selected.some((candidate) => distanceM(candidate.center, cell.center) < metrics.longestDimensionM * 0.08)) continue;
    const axis = cell.axis ?? principal;
    const expansion = expansionRatios(cell, centerline, axis, searchDistanceM);
    if (!Number.isFinite(expansion.left) || !Number.isFinite(expansion.right)) continue;
    if (expansion.left < 1.45 || expansion.right < 1.45) continue;
    const endpoints = opposingShoreEndpoints(cell.center, polygon);
    if (!endpoints) continue;
    const endpointA = nearestPointOnRing(endpoints.a, polygon.exterior);
    const endpointB = nearestPointOnRing(endpoints.b, polygon.exterior);
    if (
      !pointInWaterOrBoundary(cell.center, polygon, waterToleranceM) ||
      !segmentSamplesInsideWater(endpointA, endpointB, polygon, 8, waterToleranceM)
    ) {
      continue;
    }
    const endpointWidthM = distanceM(endpointA, endpointB);
    if (endpointWidthM <= raster.cellSizeM * 1.25) continue;
    const widthM = Math.max(cell.widthM, endpointWidthM);
    const widthToAverage = metrics.averageLakeWidthM > 0 ? widthM / metrics.averageLakeWidthM : Infinity;
    const confidence = clamp(
      0.45 * clamp((Math.min(expansion.left, expansion.right) - 1) / 2.2, 0, 1) +
        0.35 * clamp(1 - widthToAverage, 0, 1) +
        0.2 * clamp(cell.distanceToShoreM / Math.max(raster.cellSizeM, 1), 0, 1),
      0,
      1,
    );
    selected.push({
      endpointA,
      endpointB,
      center: cell.center,
      widthM,
      leftExpansionRatio: expansion.left,
      rightExpansionRatio: expansion.right,
      confidence,
      score: confidence * Math.min(expansion.left, expansion.right) / Math.max(widthToAverage, 0.05),
      qaFlags: ['approx_width_field', 'preliminary_raster_width_field'],
      metrics: {
        widthM,
        widthToAverage,
        leftExpansionRatio: expansion.left,
        rightExpansionRatio: expansion.right,
        cellSizeM: raster.cellSizeM,
        transectAxis: axis,
      },
    });
    if (selected.length >= 8) break;
  }

  const necks: WaterReaderNeckCandidate[] = [];
  const saddles: WaterReaderSaddleCandidate[] = [];
  for (const candidate of selected) {
    const widthToAverage = metrics.averageLakeWidthM > 0 ? candidate.widthM / metrics.averageLakeWidthM : Infinity;
    if (widthToAverage < 0.25 && candidate.leftExpansionRatio >= 2 && candidate.rightExpansionRatio >= 2) {
      necks.push({ ...candidate, featureClass: 'neck' });
    } else if (
      widthToAverage >= 0.25 &&
      widthToAverage <= 0.5 &&
      candidate.leftExpansionRatio >= 1.5 &&
      candidate.rightExpansionRatio >= 1.5
    ) {
      saddles.push({ ...candidate, featureClass: 'saddle' });
    }
  }

  return {
    necks: dedupeWidthFeatures(necks),
    saddles: dedupeWidthFeatures(saddles),
  };
}

function rasterizeWaterMask(polygon: PolygonM, longestDimensionM: number): {
  waterCells: RasterCell[];
  cellSizeM: number;
} {
  const bounds = bboxM(polygon.exterior);
  let cellSizeM = clamp(longestDimensionM / 650, 2, 25);
  while (
    Math.ceil((bounds.maxX - bounds.minX) / cellSizeM) > 900 ||
    Math.ceil((bounds.maxY - bounds.minY) / cellSizeM) > 900
  ) {
    cellSizeM *= 1.2;
  }
  const nx = Math.max(1, Math.ceil((bounds.maxX - bounds.minX) / cellSizeM));
  const ny = Math.max(1, Math.ceil((bounds.maxY - bounds.minY) / cellSizeM));
  const waterCells: RasterCell[] = [];
  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      const center = {
        x: bounds.minX + (ix + 0.5) * cellSizeM,
        y: bounds.minY + (iy + 0.5) * cellSizeM,
      };
      if (!pointInWater(center, polygon)) continue;
      const distanceToShoreM = distanceToBoundary(center, polygon);
      waterCells.push({ ix, iy, center, distanceToShoreM, widthM: distanceToShoreM * 2 });
    }
  }
  return { waterCells, cellSizeM };
}

function medialAxisLikeCells(cells: RasterCell[], cellSizeM: number): RasterCell[] {
  const byKey = new Map(cells.map((cell) => [`${cell.ix}:${cell.iy}`, cell] as const));
  return cells.filter((cell) => {
    if (cell.distanceToShoreM < cellSizeM * 0.75) return false;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = byKey.get(`${cell.ix + dx}:${cell.iy + dy}`);
        if (neighbor && neighbor.distanceToShoreM > cell.distanceToShoreM + cellSizeM * 0.2) return false;
      }
    }
    return true;
  });
}

function transectWidthCells(cells: RasterCell[], cellSizeM: number, axis: 'x' | 'y'): RasterCell[] {
  const groups = new Map<number, RasterCell[]>();
  for (const cell of cells) {
    const key = axis === 'x' ? cell.ix : cell.iy;
    const group = groups.get(key);
    if (group) group.push(cell);
    else groups.set(key, [cell]);
  }
  const out: RasterCell[] = [];
  for (const [key, group] of groups) {
    const sorted = [...group].sort((a, b) => (axis === 'x' ? a.iy - b.iy : a.ix - b.ix));
    const runs: RasterCell[][] = [];
    let current: RasterCell[] = [];
    for (const cell of sorted) {
      const prev = current[current.length - 1];
      const adjacent = !prev || (axis === 'x' ? cell.iy === prev.iy + 1 : cell.ix === prev.ix + 1);
      if (!adjacent) {
        if (current.length > 0) runs.push(current);
        current = [];
      }
      current.push(cell);
    }
    if (current.length > 0) runs.push(current);
    const run = runs.sort((a, b) => b.length - a.length)[0];
    if (!run || run.length < 2) continue;
    const first = run[0]!;
    const last = run[run.length - 1]!;
    const widthM =
      axis === 'x'
        ? Math.abs(last.center.y - first.center.y) + cellSizeM
        : Math.abs(last.center.x - first.center.x) + cellSizeM;
    const center = {
      x: axis === 'x' ? first.center.x : (first.center.x + last.center.x) / 2,
      y: axis === 'x' ? (first.center.y + last.center.y) / 2 : first.center.y,
    };
    out.push({
      ix: axis === 'x' ? key : Math.round((first.ix + last.ix) / 2),
      iy: axis === 'x' ? Math.round((first.iy + last.iy) / 2) : key,
      center,
      distanceToShoreM: widthM / 2,
      widthM,
      axis,
    });
  }
  return out;
}

function principalAxis(bounds: { minX: number; minY: number; maxX: number; maxY: number }): 'x' | 'y' {
  return bounds.maxX - bounds.minX >= bounds.maxY - bounds.minY ? 'x' : 'y';
}

function isLocalWidthMinimum(cell: RasterCell, cells: RasterCell[], radiusM: number, axis: 'x' | 'y'): boolean {
  const centerProjection = axis === 'x' ? cell.center.x : cell.center.y;
  const neighbors = cells.filter((other) => {
    const p = axis === 'x' ? other.center.x : other.center.y;
    const cross = axis === 'x' ? Math.abs(other.center.y - cell.center.y) : Math.abs(other.center.x - cell.center.x);
    return Math.abs(p - centerProjection) <= radiusM && cross <= radiusM * 0.45;
  });
  if (neighbors.length < 3) return false;
  const minWidth = Math.min(...neighbors.map((other) => other.widthM));
  return cell.widthM <= minWidth * 1.08;
}

function expansionRatios(cell: RasterCell, cells: RasterCell[], axis: 'x' | 'y', searchDistanceM: number): {
  left: number;
  right: number;
} {
  const centerProjection = axis === 'x' ? cell.center.x : cell.center.y;
  const crossCenter = axis === 'x' ? cell.center.y : cell.center.x;
  const sideMax = (dir: -1 | 1) => {
    const widths = cells
      .filter((other) => {
        const projection = axis === 'x' ? other.center.x : other.center.y;
        const cross = axis === 'x' ? other.center.y : other.center.x;
        const along = (projection - centerProjection) * dir;
        return along >= searchDistanceM * 0.25 && along <= searchDistanceM && Math.abs(cross - crossCenter) <= searchDistanceM * 0.55;
      })
      .map((other) => other.widthM);
    return widths.length > 0 ? Math.max(...widths) / Math.max(cell.widthM, 1e-9) : NaN;
  };
  return { left: sideMax(-1), right: sideMax(1) };
}

function opposingShoreEndpoints(center: PointM, polygon: PolygonM): { a: PointM; b: PointM } | null {
  const nearest = nearestPointOnRing(center, polygon.exterior);
  const vx = nearest.x - center.x;
  const vy = nearest.y - center.y;
  const len = Math.hypot(vx, vy);
  if (len === 0) return null;
  const dir = { x: vx / len, y: vy / len };
  const positive = rayRingIntersection(center, dir, polygon.exterior);
  const negative = rayRingIntersection(center, { x: -dir.x, y: -dir.y }, polygon.exterior);
  if (positive && negative) return { a: positive, b: negative };
  return null;
}

function pointInWater(point: PointM, polygon: PolygonM): boolean {
  if (!pointInRing(point, polygon.exterior)) return false;
  return !polygon.holes.some((hole) => pointInRing(point, hole));
}

function pointInRing(point: PointM, ring: RingM): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i]!;
    const b = ring[j]!;
    const crosses = (a.y > point.y) !== (b.y > point.y);
    if (!crosses) continue;
    const xAtY = ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y || 1e-12) + a.x;
    if (point.x < xAtY) inside = !inside;
  }
  return inside;
}

function distanceToBoundary(point: PointM, polygon: PolygonM): number {
  let best = Infinity;
  for (const ring of [polygon.exterior, ...polygon.holes]) {
    for (let i = 0; i < ring.length; i++) {
      best = Math.min(best, pointToSegmentDistance(point, ring[i]!, ring[(i + 1) % ring.length]!));
    }
  }
  return best === Infinity ? 0 : best;
}

function pointToSegmentDistance(p: PointM, a: PointM, b: PointM): number {
  return distanceM(p, nearestPointOnSegment(p, a, b));
}

function nearestPointOnSegment(p: PointM, a: PointM, b: PointM): PointM {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return a;
  const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / len2, 0, 1);
  return { x: a.x + dx * t, y: a.y + dy * t };
}

function rayRingIntersection(origin: PointM, dir: PointM, ring: RingM): PointM | null {
  let bestT = Infinity;
  let best: PointM | null = null;
  for (let i = 0; i < ring.length; i++) {
    const hit = raySegmentIntersection(origin, dir, ring[i]!, ring[(i + 1) % ring.length]!);
    if (hit && hit.t > 0 && hit.t < bestT) {
      bestT = hit.t;
      best = hit.point;
    }
  }
  return best;
}

function raySegmentIntersection(origin: PointM, dir: PointM, a: PointM, b: PointM): { t: number; point: PointM } | null {
  const sx = b.x - a.x;
  const sy = b.y - a.y;
  const denom = cross(dir, { x: sx, y: sy });
  if (Math.abs(denom) < 1e-9) return null;
  const ao = { x: a.x - origin.x, y: a.y - origin.y };
  const t = cross(ao, { x: sx, y: sy }) / denom;
  const u = cross(ao, dir) / denom;
  if (t <= 0 || u < -1e-9 || u > 1 + 1e-9) return null;
  return { t, point: { x: origin.x + dir.x * t, y: origin.y + dir.y * t } };
}

function cross(a: PointM, b: PointM): number {
  return a.x * b.y - a.y * b.x;
}

function dedupeWidthFeatures<T extends { center: PointM; score: number; widthM: number }>(features: T[]): T[] {
  const sorted = [...features].sort((a, b) => b.score - a.score);
  const kept: T[] = [];
  for (const feature of sorted) {
    if (kept.some((existing) => distanceM(existing.center, feature.center) < Math.max(60, Math.min(existing.widthM, feature.widthM) * 2.2))) continue;
    kept.push(feature);
  }
  return kept;
}
