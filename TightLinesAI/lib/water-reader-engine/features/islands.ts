import type { PointM, PolygonM, RingM } from '../contracts';
import { distanceM, longestStraightLineDimensionM, polygonAreaM, ringSignedAreaM } from '../metrics';
import { clamp } from '../shoreline';
import type { WaterReaderIslandFeature } from './types';
import { pointInRing, ringCentroid } from './validation';

export function detectIslandFeatures(primaryPolygon: PolygonM): WaterReaderIslandFeature[] {
  const lakeAreaSqM = polygonAreaM(primaryPolygon);
  const longestDimensionM = longestStraightLineDimensionM(primaryPolygon.exterior);
  const minIslandAreaSqM = Math.max(5000, lakeAreaSqM * 0.00008);
  const minMainlandDistanceM = clamp(longestDimensionM * 0.003, 35, 80);
  const features: WaterReaderIslandFeature[] = [];
  for (const ring of primaryPolygon.holes) {
    const areaSqM = Math.abs(ringSignedAreaM(ring));
    const { a, b } = longestEndpointPair(ring);
    const nearestMainlandDistanceM = nearestRingDistance(ring, primaryPolygon.exterior);
    const centroid = ringCentroid(ring);
    if (
      areaSqM < minIslandAreaSqM ||
      nearestMainlandDistanceM < minMainlandDistanceM ||
      !pointInRing(centroid, primaryPolygon.exterior)
    ) {
      continue;
    }
    features.push({
      featureId: 'island-0',
      featureClass: 'island',
      ring,
      areaSqM,
      endpointA: a,
      endpointB: b,
      nearestMainlandDistanceM,
      score: areaSqM,
      qaFlags: ['interior_ring_island'],
      metrics: {
        areaSqM,
        endpointDistanceM: distanceM(a, b),
        nearestMainlandDistanceM,
        minIslandAreaSqM,
        minMainlandDistanceM,
      },
    });
  }
  return features.sort((a, b) => b.areaSqM - a.areaSqM).map((feature, index) => ({ ...feature, featureId: `island-${index + 1}` }));
}

function longestEndpointPair(ring: RingM): { a: PointM; b: PointM } {
  if (ring.length === 0) return { a: { x: 0, y: 0 }, b: { x: 0, y: 0 } };
  let bestA = ring[0]!;
  let bestB = ring[0]!;
  let bestD = -1;
  for (let i = 0; i < ring.length; i++) {
    for (let j = i + 1; j < ring.length; j++) {
      const d = distanceM(ring[i]!, ring[j]!);
      if (d > bestD) {
        bestD = d;
        bestA = ring[i]!;
        bestB = ring[j]!;
      }
    }
  }
  return { a: bestA, b: bestB };
}

function nearestRingDistance(a: RingM, b: RingM): number {
  let best = Infinity;
  for (const point of a) {
    for (let i = 0; i < b.length; i++) {
      best = Math.min(best, pointToSegmentDistance(point, b[i]!, b[(i + 1) % b.length]!));
    }
  }
  return best === Infinity ? 0 : best;
}

function pointToSegmentDistance(p: PointM, a: PointM, b: PointM): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return distanceM(p, a);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return distanceM(p, { x: a.x + dx * t, y: a.y + dy * t });
}
