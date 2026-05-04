import type { PointM, PolygonM, RingM } from '../contracts';
import { distanceM, longestStraightLineDimensionM, polygonAreaM, ringSignedAreaM } from '../metrics';
import { clamp } from '../shoreline';
import { farthestPairIndicesByHull, RingSpatialIndex } from '../spatial';
import type { WaterReaderIslandFeature } from './types';
import { pointInRing, ringCentroid } from './validation';

export function detectIslandFeatures(primaryPolygon: PolygonM): WaterReaderIslandFeature[] {
  const lakeAreaSqM = polygonAreaM(primaryPolygon);
  const longestDimensionM = longestStraightLineDimensionM(primaryPolygon.exterior);
  const minIslandAreaSqM = Math.max(5000, lakeAreaSqM * 0.00008);
  const minMainlandDistanceM = clamp(longestDimensionM * 0.003, 35, 80);
  const mainlandIndex = new RingSpatialIndex(primaryPolygon.exterior);
  const features: WaterReaderIslandFeature[] = [];
  for (const ring of primaryPolygon.holes) {
    const areaSqM = Math.abs(ringSignedAreaM(ring));
    if (areaSqM < minIslandAreaSqM) continue;
    const centroid = ringCentroid(ring);
    if (!pointInRing(centroid, primaryPolygon.exterior)) continue;
    const nearestMainlandDistanceM = nearestRingDistance(ring, mainlandIndex);
    if (nearestMainlandDistanceM < minMainlandDistanceM) continue;
    const { a, b } = longestEndpointPair(ring);
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
  const pair = farthestPairIndicesByHull(ring);
  if (!pair) return { a: ring[0]!, b: ring[0]! };
  return { a: ring[pair.aIndex] ?? ring[0]!, b: ring[pair.bIndex] ?? ring[0]! };
}

function nearestRingDistance(ring: RingM, mainlandIndex: RingSpatialIndex): number {
  let best = Infinity;
  for (const point of ring) best = Math.min(best, mainlandIndex.distanceToBoundary(point));
  return best === Infinity ? 0 : best;
}
