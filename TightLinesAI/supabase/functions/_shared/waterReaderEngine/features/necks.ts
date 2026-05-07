import type { PointM, PolygonM, RingM, WaterReaderPreprocessResult } from '../contracts.ts';
import { bboxM, distanceM } from '../metrics.ts';
import { clamp } from '../shoreline.ts';
import type { WaterReaderNeckCandidate, WaterReaderPointCandidate, WaterReaderSaddleCandidate } from './types.ts';
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

type WaterMask = {
  mask: Uint8Array;
  nx: number;
  ny: number;
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  cellSizeM: number;
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
  const centerlineIndex = new RasterCellSpatialIndex(centerline, Math.max(raster.cellSizeM * 2, searchDistanceM * 0.25));
  const raw = centerline
    .filter((cell) => isLocalWidthMinimum(cell, centerlineIndex, searchDistanceM * 0.35, cell.axis ?? principal))
    .sort((a, b) => a.widthM - b.widthM);

  const selected: WidthFeatureCandidate[] = [];
  for (const cell of raw) {
    if (selected.some((candidate) => distanceM(candidate.center, cell.center) < metrics.longestDimensionM * 0.08)) continue;
    const axis = cell.axis ?? principal;
    const expansion = expansionRatios(cell, centerlineIndex, axis, searchDistanceM);
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

export function detectPointSeededNeckCandidates(
  preprocess: WaterReaderPreprocessResult,
  points: WaterReaderPointCandidate[],
): WaterReaderNeckCandidate[] {
  const polygon = preprocess.primaryPolygon;
  const metrics = preprocess.metrics;
  if (!polygon || !metrics || polygon.exterior.length < 4) return [];
  const waterToleranceM = clamp(metrics.longestDimensionM * 0.0015, 5, 30);
  const maxSearchM = clamp(metrics.longestDimensionM * 0.09, 120, 700);
  const candidates: WaterReaderNeckCandidate[] = [];

  for (const point of points) {
    if (point.featureClass && point.featureClass !== 'main_lake_point') continue;
    const orientationLength = Math.hypot(point.orientationVector.x, point.orientationVector.y);
    if (orientationLength < 0.2) continue;
    const concaveHits = numericMetric(point.metrics.concaveScaleHits);
    const baseToTipM = distanceM(point.baseMidpoint, point.tip);
    if (
      point.confidence < 0.8 ||
      concaveHits < 4 ||
      baseToTipM < metrics.longestDimensionM * 0.025 ||
      point.protrusionLengthM < metrics.longestDimensionM * 0.03
    ) continue;

    const ray = pointSeededOppositeShoreRay({
      tip: point.tip,
      direction: { x: point.orientationVector.x / orientationLength, y: point.orientationVector.y / orientationLength },
      polygon,
      maxSearchM,
      waterToleranceM,
    });
    if (!ray) continue;
    const endpointA = nearestPointOnRing(point.tip, polygon.exterior);
    const endpointB = nearestPointOnRing(ray.point, polygon.exterior);
    const widthM = distanceM(endpointA, endpointB);
    const widthToAverage = metrics.averageLakeWidthM > 0 ? widthM / metrics.averageLakeWidthM : Infinity;
    if (
      widthM < 40 ||
      widthM > metrics.longestDimensionM * 0.055 ||
      widthToAverage > 0.14 ||
      point.protrusionLengthM / Math.max(widthM, 1) < 0.75 ||
      !segmentSamplesInsideWater(endpointA, endpointB, polygon, 10, waterToleranceM)
    ) continue;

    const expansionRatio = clamp(point.protrusionLengthM / Math.max(widthM, 1) * 2.35, 2.2, 6.5);
    const confidence = clamp(0.72 + point.confidence * 0.18 + clamp((0.14 - widthToAverage) / 0.14, 0, 1) * 0.1, 0, 0.94);
    candidates.push({
      featureClass: 'neck',
      endpointA,
      endpointB,
      center: midpoint(endpointA, endpointB),
      widthM,
      leftExpansionRatio: expansionRatio,
      rightExpansionRatio: expansionRatio,
      confidence,
      score: confidence * expansionRatio / Math.max(widthToAverage, 0.05),
      qaFlags: [...point.qaFlags, 'point_seeded_neck_rescue', 'opposite_shoreline_ray_confirmed'],
      metrics: {
        seededFromPoint: true,
        sourcePointConfidence: point.confidence,
        sourcePointProtrusionLengthM: point.protrusionLengthM,
        sourcePointBaseToTipM: baseToTipM,
        widthM,
        widthToAverage,
        leftExpansionRatio: expansionRatio,
        rightExpansionRatio: expansionRatio,
        oppositeShoreRayDistanceM: ray.distanceM,
      },
    });
  }

  return dedupeWidthFeatures(candidates);
}

function numericMetric(value: number | string | boolean | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function pointSeededOppositeShoreRay(params: {
  tip: PointM;
  direction: PointM;
  polygon: PolygonM;
  maxSearchM: number;
  waterToleranceM: number;
}): { point: PointM; distanceM: number } | null {
  const waterProbe = {
    x: params.tip.x + params.direction.x * Math.max(6, params.waterToleranceM),
    y: params.tip.y + params.direction.y * Math.max(6, params.waterToleranceM),
  };
  if (!pointInWaterOrBoundary(waterProbe, params.polygon, params.waterToleranceM)) return null;
  const hit = rayRingIntersection(params.tip, params.direction, params.polygon.exterior);
  if (!hit) return null;
  const rayDistanceM = distanceM(params.tip, hit);
  if (rayDistanceM < Math.max(40, params.waterToleranceM * 2) || rayDistanceM > params.maxSearchM) return null;
  return { point: hit, distanceM: rayDistanceM };
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
  const waterMask = buildWaterMask({ polygon, bounds, nx, ny, cellSizeM });
  const distanceCells = chamferDistanceToLand(waterMask.mask, nx, ny);
  const waterCells: RasterCell[] = [];
  for (let index = 0; index < waterMask.mask.length; index++) {
    if (waterMask.mask[index] !== 1) continue;
    const ix = index % nx;
    const iy = Math.floor(index / nx);
    const center = {
      x: bounds.minX + (ix + 0.5) * cellSizeM,
      y: bounds.minY + (iy + 0.5) * cellSizeM,
    };
    const distanceToShoreM = Math.max(cellSizeM * 0.5, distanceCells[index]! * cellSizeM);
    waterCells.push({ ix, iy, center, distanceToShoreM, widthM: distanceToShoreM * 2 });
  }
  return { waterCells, cellSizeM };
}

function buildWaterMask(params: {
  polygon: PolygonM;
  bounds: WaterMask['bounds'];
  nx: number;
  ny: number;
  cellSizeM: number;
}): WaterMask {
  const { polygon, bounds, nx, ny, cellSizeM } = params;
  const mask = new Uint8Array(nx * ny);
  for (let iy = 0; iy < ny; iy++) {
    const y = bounds.minY + (iy + 0.5) * cellSizeM;
    for (const [startX, endX] of scanlineIntervals(polygon.exterior, y)) {
      fillMaskInterval(mask, bounds, nx, iy, cellSizeM, startX, endX, 1);
    }
    for (const hole of polygon.holes) {
      for (const [startX, endX] of scanlineIntervals(hole, y)) {
        fillMaskInterval(mask, bounds, nx, iy, cellSizeM, startX, endX, 0);
      }
    }
  }
  return { mask, nx, ny, bounds, cellSizeM };
}

function scanlineIntervals(ring: RingM, y: number): Array<[number, number]> {
  const xs: number[] = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    if ((a.y > y) === (b.y > y)) continue;
    const x = ((b.x - a.x) * (y - a.y)) / (b.y - a.y || 1e-12) + a.x;
    if (Number.isFinite(x)) xs.push(x);
  }
  xs.sort((a, b) => a - b);
  const intervals: Array<[number, number]> = [];
  for (let i = 0; i + 1 < xs.length; i += 2) {
    const start = xs[i]!;
    const end = xs[i + 1]!;
    if (end > start) intervals.push([start, end]);
  }
  return intervals;
}

function fillMaskInterval(
  mask: Uint8Array,
  bounds: WaterMask['bounds'],
  nx: number,
  iy: number,
  cellSizeM: number,
  startX: number,
  endX: number,
  value: 0 | 1,
) {
  const startIx = Math.max(0, Math.ceil((startX - bounds.minX) / cellSizeM - 0.5));
  const endIx = Math.min(nx - 1, Math.floor((endX - bounds.minX) / cellSizeM - 0.5));
  for (let ix = startIx; ix <= endIx; ix++) mask[iy * nx + ix] = value;
}

function chamferDistanceToLand(mask: Uint8Array, nx: number, ny: number): Float64Array {
  const distances = new Float64Array(mask.length);
  const diagonal = Math.SQRT2;
  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      const index = iy * nx + ix;
      distances[index] = mask[index] === 1 && ix > 0 && iy > 0 && ix < nx - 1 && iy < ny - 1 ? Infinity : 0;
    }
  }
  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      const index = iy * nx + ix;
      if (distances[index] === 0) continue;
      relaxDistance(distances, nx, ny, ix, iy, -1, 0, 1);
      relaxDistance(distances, nx, ny, ix, iy, 0, -1, 1);
      relaxDistance(distances, nx, ny, ix, iy, -1, -1, diagonal);
      relaxDistance(distances, nx, ny, ix, iy, 1, -1, diagonal);
    }
  }
  for (let iy = ny - 1; iy >= 0; iy--) {
    for (let ix = nx - 1; ix >= 0; ix--) {
      const index = iy * nx + ix;
      if (distances[index] === 0) continue;
      relaxDistance(distances, nx, ny, ix, iy, 1, 0, 1);
      relaxDistance(distances, nx, ny, ix, iy, 0, 1, 1);
      relaxDistance(distances, nx, ny, ix, iy, 1, 1, diagonal);
      relaxDistance(distances, nx, ny, ix, iy, -1, 1, diagonal);
    }
  }
  return distances;
}

function relaxDistance(
  distances: Float64Array,
  nx: number,
  ny: number,
  ix: number,
  iy: number,
  dx: number,
  dy: number,
  weight: number,
) {
  const ox = ix + dx;
  const oy = iy + dy;
  if (ox < 0 || oy < 0 || ox >= nx || oy >= ny) return;
  const index = iy * nx + ix;
  const other = oy * nx + ox;
  const candidate = distances[other]! + weight;
  if (candidate < distances[index]!) distances[index] = candidate;
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

function isLocalWidthMinimum(cell: RasterCell, cells: RasterCellSpatialIndex, radiusM: number, axis: 'x' | 'y'): boolean {
  const centerProjection = axis === 'x' ? cell.center.x : cell.center.y;
  const neighbors = cells.query({
    minX: axis === 'x' ? centerProjection - radiusM : cell.center.x - radiusM * 0.45,
    maxX: axis === 'x' ? centerProjection + radiusM : cell.center.x + radiusM * 0.45,
    minY: axis === 'x' ? cell.center.y - radiusM * 0.45 : centerProjection - radiusM,
    maxY: axis === 'x' ? cell.center.y + radiusM * 0.45 : centerProjection + radiusM,
  }).filter((other) => {
    const p = axis === 'x' ? other.center.x : other.center.y;
    const cross = axis === 'x' ? Math.abs(other.center.y - cell.center.y) : Math.abs(other.center.x - cell.center.x);
    return Math.abs(p - centerProjection) <= radiusM && cross <= radiusM * 0.45;
  });
  if (neighbors.length < 3) return false;
  const minWidth = Math.min(...neighbors.map((other) => other.widthM));
  return cell.widthM <= minWidth * 1.08;
}

function expansionRatios(cell: RasterCell, cells: RasterCellSpatialIndex, axis: 'x' | 'y', searchDistanceM: number): {
  left: number;
  right: number;
} {
  const centerProjection = axis === 'x' ? cell.center.x : cell.center.y;
  const crossCenter = axis === 'x' ? cell.center.y : cell.center.x;
  const sideMax = (dir: -1 | 1) => {
    const minProjection = centerProjection + searchDistanceM * 0.25 * dir;
    const maxProjection = centerProjection + searchDistanceM * dir;
    const rangeMin = Math.min(minProjection, maxProjection);
    const rangeMax = Math.max(minProjection, maxProjection);
    const widths = cells
      .query({
        minX: axis === 'x' ? rangeMin : crossCenter - searchDistanceM * 0.55,
        maxX: axis === 'x' ? rangeMax : crossCenter + searchDistanceM * 0.55,
        minY: axis === 'x' ? crossCenter - searchDistanceM * 0.55 : rangeMin,
        maxY: axis === 'x' ? crossCenter + searchDistanceM * 0.55 : rangeMax,
      })
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

class RasterCellSpatialIndex {
  private readonly cellSizeM: number;
  private readonly minX: number;
  private readonly minY: number;
  private readonly buckets = new Map<string, RasterCell[]>();

  constructor(cells: RasterCell[], cellSizeM: number) {
    this.cellSizeM = Math.max(1, cellSizeM);
    let minX = Infinity;
    let minY = Infinity;
    for (const cell of cells) {
      minX = Math.min(minX, cell.center.x);
      minY = Math.min(minY, cell.center.y);
    }
    this.minX = minX === Infinity ? 0 : minX;
    this.minY = minY === Infinity ? 0 : minY;
    for (const cell of cells) {
      const key = this.keyForPoint(cell.center);
      const bucket = this.buckets.get(key);
      if (bucket) bucket.push(cell);
      else this.buckets.set(key, [cell]);
    }
  }

  query(bounds: { minX: number; minY: number; maxX: number; maxY: number }): RasterCell[] {
    const minIx = this.ix(bounds.minX);
    const maxIx = this.ix(bounds.maxX);
    const minIy = this.iy(bounds.minY);
    const maxIy = this.iy(bounds.maxY);
    const out: RasterCell[] = [];
    for (let ix = minIx; ix <= maxIx; ix++) {
      for (let iy = minIy; iy <= maxIy; iy++) {
        for (const cell of this.buckets.get(`${ix}:${iy}`) ?? []) {
          if (
            cell.center.x >= bounds.minX &&
            cell.center.x <= bounds.maxX &&
            cell.center.y >= bounds.minY &&
            cell.center.y <= bounds.maxY
          ) {
            out.push(cell);
          }
        }
      }
    }
    return out;
  }

  private keyForPoint(point: PointM): string {
    return `${this.ix(point.x)}:${this.iy(point.y)}`;
  }

  private ix(x: number): number {
    return Math.floor((x - this.minX) / this.cellSizeM);
  }

  private iy(y: number): number {
    return Math.floor((y - this.minY) / this.cellSizeM);
  }
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

function midpoint(a: PointM, b: PointM): PointM {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
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
