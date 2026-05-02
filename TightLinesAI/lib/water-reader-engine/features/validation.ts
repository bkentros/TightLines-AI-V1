import type { PointM, PolygonM, RingM } from '../contracts';
import { bboxM, distanceM } from '../metrics';

export function pointInWaterOrBoundary(point: PointM, polygon: PolygonM, toleranceM = 1e-6): boolean {
  if (distanceToPolygonBoundary(point, polygon) <= toleranceM) return true;
  if (!pointInRing(point, polygon.exterior)) return false;
  return !polygon.holes.some((hole) => pointInRing(point, hole) && distanceToRing(point, hole) > toleranceM);
}

export function pointInRing(point: PointM, ring: RingM): boolean {
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
  let best = ring[0] ?? point;
  let bestDistance = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const candidate = nearestPointOnSegment(point, ring[i]!, ring[(i + 1) % ring.length]!);
    const d = distanceM(point, candidate);
    if (d < bestDistance) {
      bestDistance = d;
      best = candidate;
    }
  }
  return best;
}

export function distanceToRing(point: PointM, ring: RingM): number {
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    best = Math.min(best, pointToSegmentDistance(point, ring[i]!, ring[(i + 1) % ring.length]!));
  }
  return best === Infinity ? 0 : best;
}

export function distanceToPolygonBoundary(point: PointM, polygon: PolygonM): number {
  let best = distanceToRing(point, polygon.exterior);
  for (const hole of polygon.holes) best = Math.min(best, distanceToRing(point, hole));
  return best;
}

export function nearestPointOnSegment(p: PointM, a: PointM, b: PointM): PointM {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return a;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return { x: a.x + dx * t, y: a.y + dy * t };
}

export function pointToSegmentDistance(p: PointM, a: PointM, b: PointM): number {
  return distanceM(p, nearestPointOnSegment(p, a, b));
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
