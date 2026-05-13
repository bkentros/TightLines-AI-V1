import type { PointM, PolygonM, RingM } from '../contracts.ts';
import { distanceM, longestStraightLineDimensionM, polygonAreaM, ringSignedAreaM } from '../metrics.ts';
import { clamp } from '../shoreline.ts';
import { farthestPairIndicesByHull, RingSpatialIndex } from '../spatial.ts';
import type { WaterReaderIslandFeature } from './types.ts';
import { pointInRing, ringCentroid } from './validation.ts';

export function detectIslandFeatures(primaryPolygon: PolygonM): WaterReaderIslandFeature[] {
  const lakeAreaSqM = polygonAreaM(primaryPolygon);
  const longestDimensionM = longestStraightLineDimensionM(primaryPolygon.exterior);
  const smallLakeIslandSensitivityEligible = lakeAreaSqM <= 405000 && longestDimensionM <= 1600;
  const minIslandAreaSqM = smallLakeIslandSensitivityEligible
    ? Math.max(900, lakeAreaSqM * 0.00008)
    : Math.max(5000, lakeAreaSqM * 0.00008);
  const smallIslandAreaSqM = smallLakeIslandSensitivityEligible
    ? Math.max(220, lakeAreaSqM * 0.000035)
    : Math.max(1800, lakeAreaSqM * 0.000035);
  const minMainlandDistanceM = clamp(longestDimensionM * 0.003, 35, 80);
  const smallIslandMinMainlandDistanceM = smallLakeIslandSensitivityEligible
    ? Math.max(20, Math.min(45, minMainlandDistanceM * 0.65))
    : Math.max(minMainlandDistanceM * 1.25, 45);
  const smallIslandEndpointDistanceM = smallLakeIslandSensitivityEligible ? 18 : 28;
  const mainlandIndex = new RingSpatialIndex(primaryPolygon.exterior);
  const features: WaterReaderIslandFeature[] = [];
  let tinySuppressedIslandCount = 0;
  let smallLakeRecoveredIslandCount = 0;
  const islandRejectReasonCounts: Record<string, number> = {};
  const reject = (reason: string) => {
    islandRejectReasonCounts[reason] = (islandRejectReasonCounts[reason] ?? 0) + 1;
  };
  for (const ring of primaryPolygon.holes) {
    const areaSqM = Math.abs(ringSignedAreaM(ring));
    if (areaSqM < smallIslandAreaSqM) {
      tinySuppressedIslandCount += 1;
      reject('area_below_small_island_threshold');
      continue;
    }
    const centroid = ringCentroid(ring);
    if (!pointInRing(centroid, primaryPolygon.exterior)) {
      reject('centroid_outside_primary_lake');
      continue;
    }
    const nearestMainlandDistanceM = nearestRingDistance(ring, mainlandIndex);
    const { a, b } = longestEndpointPair(ring);
    const endpointDistanceM = distanceM(a, b);
    const smallIslandSensitivityApplied = areaSqM < minIslandAreaSqM;
    const smallLakeIslandSensitivityApplied = smallLakeIslandSensitivityEligible && smallIslandSensitivityApplied;
    if (smallIslandSensitivityApplied) {
      if (nearestMainlandDistanceM < smallIslandMinMainlandDistanceM) {
        reject('nearest_mainland_distance_below_threshold');
        continue;
      }
      if (endpointDistanceM < smallIslandEndpointDistanceM) {
        reject('endpoint_span_below_threshold');
        continue;
      }
    } else if (nearestMainlandDistanceM < minMainlandDistanceM) {
      reject('mainland_distance_below_threshold');
      continue;
    }
    if (smallLakeIslandSensitivityApplied) smallLakeRecoveredIslandCount += 1;
    features.push({
      featureId: 'island-0',
      featureClass: 'island',
      ring,
      areaSqM,
      endpointA: a,
      endpointB: b,
      nearestMainlandDistanceM,
      score: areaSqM,
      qaFlags: [
        'interior_ring_island',
        ...(smallIslandSensitivityApplied ? ['small_island_sensitivity_applied'] : []),
        ...(smallLakeIslandSensitivityApplied ? ['small_lake_island_sensitivity_applied'] : []),
      ],
      metrics: {
        areaSqM,
        endpointDistanceM,
        nearestMainlandDistanceM,
        minIslandAreaSqM,
        minMainlandDistanceM,
        smallIslandAreaSqM,
        smallIslandMinMainlandDistanceM,
        smallIslandEndpointDistanceM,
        smallIslandSensitivityApplied,
        smallLakeIslandSensitivityEligible,
        smallLakeIslandSensitivityApplied,
        islandAreaThresholdUsedSqM: smallIslandSensitivityApplied ? smallIslandAreaSqM : minIslandAreaSqM,
        islandMainlandDistanceThresholdUsedM: smallIslandSensitivityApplied ? smallIslandMinMainlandDistanceM : minMainlandDistanceM,
        tinySuppressedIslandCount,
        smallLakeRecoveredIslandCount,
      },
    });
  }
  const rejectEntries = Object.entries(islandRejectReasonCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const topRejectReason = rejectEntries[0]?.[0] ?? null;
  return features.sort((a, b) => b.areaSqM - a.areaSqM).map((feature, index) => ({
    ...feature,
    featureId: `island-${index + 1}`,
    metrics: {
      ...feature.metrics,
      rank: index + 1,
      detectedIslandCount: features.length,
      tinySuppressedIslandCount,
      smallLakeRecoveredIslandCount,
      islandRejectReason: topRejectReason,
      islandRejectedHoleCount: rejectEntries.reduce((sum, [, count]) => sum + count, 0),
    },
  }));
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
