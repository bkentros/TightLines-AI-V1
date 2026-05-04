import type { PointM, PolygonM, RingM } from '../contracts';
import { bboxM } from '../metrics';
import { MultiRingSpatialIndex, RingSpatialIndex, distancePointToSegmentM, nearestPointOnSegmentM } from '../spatial';

const ringIndexCache = new WeakMap<RingM, RingSpatialIndex>();
const polygonBoundaryIndexCache = new WeakMap<PolygonM, MultiRingSpatialIndex>();
const polygonWaterIndexCache = new WeakMap<PolygonM, PolygonWaterIndex>();

type PolygonWaterIndex = {
  exterior: RingSpatialIndex;
  holes: Array<{
    ring: RingM;
    index: RingSpatialIndex;
    bounds: { minX: number; minY: number; maxX: number; maxY: number };
  }>;
};

export function pointInWaterOrBoundary(point: PointM, polygon: PolygonM, toleranceM = 1e-6): boolean {
  const water = polygonWaterIndex(polygon);
  if (water.exterior.contains(point)) {
    for (const hole of water.holes) {
      if (!pointInBounds(point, hole.bounds)) continue;
      if (!hole.index.contains(point)) continue;
      return hole.index.distanceToBoundary(point) <= toleranceM;
    }
    return true;
  }
  return water.exterior.distanceToBoundary(point) <= toleranceM;
}

export function pointInRing(point: PointM, ring: RingM): boolean {
  return ringIndex(ring).contains(point);
}

export function segmentSamplesInsideWater(a: PointM, b: PointM, polygon: PolygonM, samples: number, toleranceM: number): boolean {
  for (let i = 0; i <= samples; i++) {
    const t = samples === 0 ? 0 : i / samples;
    if (!pointInWaterOrBoundary(lerpPoint(a, b, t), polygon, toleranceM)) return false;
  }
  return true;
}

export function polygonInteriorWaterFraction(ring: RingM, waterPolygon: PolygonM, toleranceM: number): number {
  if (ring.length < 4) return 0;
  const bbox = bboxM(ring);
  const width = bbox.maxX - bbox.minX;
  const height = bbox.maxY - bbox.minY;
  if (width <= 0 || height <= 0) {
    const centroid = ringCentroid(ring);
    return pointInWaterOrBoundary(centroid, waterPolygon, toleranceM) ? 1 : 0;
  }

  let insideCandidate = 0;
  let insideWater = 0;
  const steps = 7;
  for (let ix = 1; ix < steps; ix++) {
    for (let iy = 1; iy < steps; iy++) {
      const point = {
        x: bbox.minX + (width * ix) / steps,
        y: bbox.minY + (height * iy) / steps,
      };
      if (!pointInRing(point, ring)) continue;
      insideCandidate++;
      if (pointInWaterOrBoundary(point, waterPolygon, toleranceM)) insideWater++;
    }
  }

  if (insideCandidate === 0) {
    const centroid = ringCentroid(ring);
    return pointInWaterOrBoundary(centroid, waterPolygon, toleranceM) ? 1 : 0;
  }
  return insideWater / insideCandidate;
}

export type CoveWaterInteriorValidation = {
  valid: boolean;
  fanInsideFraction: number;
  fanSamples: number;
  axisSamples: number;
};

export function validateCoveWaterInterior(params: {
  mouthLeft: PointM;
  mouthRight: PointM;
  back: PointM;
  waterPolygon: PolygonM;
  toleranceM: number;
}): CoveWaterInteriorValidation {
  const { mouthLeft, mouthRight, back, waterPolygon, toleranceM } = params;
  if (!segmentSamplesInsideWater(mouthLeft, mouthRight, waterPolygon, 6, toleranceM)) {
    return { valid: false, fanInsideFraction: 0, fanSamples: 0, axisSamples: 0 };
  }

  const mouthMidpoint = lerpPoint(mouthLeft, mouthRight, 0.5);
  const axisFractions = [0.18, 0.34, 0.5, 0.66, 0.82];
  for (const fraction of axisFractions) {
    if (!pointInWaterOrBoundary(lerpPoint(mouthMidpoint, back, fraction), waterPolygon, toleranceM)) {
      return { valid: false, fanInsideFraction: 0, fanSamples: 0, axisSamples: axisFractions.length };
    }
  }

  let fanSamples = 0;
  let fanInside = 0;
  const chordFractions = [0.14, 0.28, 0.42, 0.58, 0.72, 0.86];
  const depthFractions = [0.2, 0.38, 0.56, 0.74, 0.9];
  for (const chordFraction of chordFractions) {
    const chordPoint = lerpPoint(mouthLeft, mouthRight, chordFraction);
    for (const depthFraction of depthFractions) {
      fanSamples++;
      if (pointInWaterOrBoundary(lerpPoint(chordPoint, back, depthFraction), waterPolygon, toleranceM)) fanInside++;
    }
  }

  const fanInsideFraction = fanSamples > 0 ? fanInside / fanSamples : 0;
  return {
    valid: fanSamples > 0 && fanInsideFraction >= 0.9,
    fanInsideFraction,
    fanSamples,
    axisSamples: axisFractions.length,
  };
}

export function nearestPointOnRing(point: PointM, ring: RingM): PointM {
  if (ring.length === 0) return point;
  return ringIndex(ring).nearestPoint(point);
}

export function distanceToRing(point: PointM, ring: RingM): number {
  if (ring.length === 0) return 0;
  return ringIndex(ring).distanceToBoundary(point);
}

export function distanceToPolygonBoundary(point: PointM, polygon: PolygonM): number {
  return polygonBoundaryIndex(polygon).distanceToBoundary(point);
}

export function nearestPointOnSegment(p: PointM, a: PointM, b: PointM): PointM {
  return nearestPointOnSegmentM(p, a, b);
}

export function pointToSegmentDistance(p: PointM, a: PointM, b: PointM): number {
  return distancePointToSegmentM(p, a, b);
}

export function lerpPoint(a: PointM, b: PointM, t: number): PointM {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function ringCentroid(ring: RingM): PointM {
  if (ring.length === 0) return { x: 0, y: 0 };
  let x = 0;
  let y = 0;
  for (const point of ring) {
    x += point.x;
    y += point.y;
  }
  return { x: x / ring.length, y: y / ring.length };
}

function ringIndex(ring: RingM): RingSpatialIndex {
  const cached = ringIndexCache.get(ring);
  if (cached) return cached;
  const index = new RingSpatialIndex(ring);
  ringIndexCache.set(ring, index);
  return index;
}

function polygonBoundaryIndex(polygon: PolygonM): MultiRingSpatialIndex {
  const cached = polygonBoundaryIndexCache.get(polygon);
  if (cached) return cached;
  const index = new MultiRingSpatialIndex([polygon.exterior, ...polygon.holes]);
  polygonBoundaryIndexCache.set(polygon, index);
  return index;
}

function polygonWaterIndex(polygon: PolygonM): PolygonWaterIndex {
  const cached = polygonWaterIndexCache.get(polygon);
  if (cached) return cached;
  const index: PolygonWaterIndex = {
    exterior: ringIndex(polygon.exterior),
    holes: polygon.holes.map((ring) => ({
      ring,
      index: ringIndex(ring),
      bounds: expandedBounds(bboxM(ring), 1e-6),
    })),
  };
  polygonWaterIndexCache.set(polygon, index);
  return index;
}

function pointInBounds(point: PointM, bounds: { minX: number; minY: number; maxX: number; maxY: number }): boolean {
  return point.x >= bounds.minX && point.x <= bounds.maxX && point.y >= bounds.minY && point.y <= bounds.maxY;
}

function expandedBounds(
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  pad: number,
): { minX: number; minY: number; maxX: number; maxY: number } {
  return {
    minX: bounds.minX - pad,
    minY: bounds.minY - pad,
    maxX: bounds.maxX + pad,
    maxY: bounds.maxY + pad,
  };
}
