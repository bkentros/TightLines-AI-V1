import type { PointM, RingM, WaterReaderLakeMetrics } from '../contracts';
import { distanceM } from '../metrics';
import type {
  WaterReaderCoveCandidate,
  WaterReaderCoveFeature,
  WaterReaderDamCandidate,
  WaterReaderDamFeature,
  WaterReaderDetectedFeature,
  WaterReaderIslandFeature,
  WaterReaderNeckCandidate,
  WaterReaderNeckFeature,
  WaterReaderPointCandidate,
  WaterReaderPointFeature,
  WaterReaderSaddleCandidate,
  WaterReaderSaddleFeature,
} from './types';

type FeaturePruningSummary = {
  class_cap: number;
  cluster: number;
  total_cap: number;
  orphan_secondary_point: number;
};

let lastFeaturePruningSummary: FeaturePruningSummary = emptyFeaturePruningSummary();

export function getLastFeaturePruningSummary(): FeaturePruningSummary {
  return { ...lastFeaturePruningSummary };
}

export function resolveWaterReaderFeatureConflicts(params: {
  coves: WaterReaderCoveCandidate[];
  points: WaterReaderPointCandidate[];
  islands: WaterReaderIslandFeature[];
  necks: WaterReaderNeckCandidate[];
  saddles: WaterReaderSaddleCandidate[];
  dams: WaterReaderDamCandidate[];
  metrics: WaterReaderLakeMetrics;
}): WaterReaderDetectedFeature[] {
  const spacing = params.metrics.longestDimensionM * 0.05;
  const buffer = params.metrics.longestDimensionM * 0.04;
  const damCandidates = applySameTypeSpacing(params.dams, (d) => midpoint(d.cornerA, d.cornerB), spacing);
  const neckCandidates = applySameTypeSpacing(params.necks, (n) => n.center, spacing);
  const saddleCandidates = applySameTypeSpacing(params.saddles, (s) => s.center, spacing)
    .filter((saddle) => !neckCandidates.some((neck) => widthFeaturesOverlap(neck, saddle, spacing)));

  const dams = damCandidates.map((dam, index): WaterReaderDamFeature => ({
    ...dam,
    featureId: `dam-${index + 1}`,
  }));
  const necks = neckCandidates
    .filter((neck) => !dams.some((dam) => damOverlapsFeature(dam, neck.center, buffer)))
    .map((neck, index): WaterReaderNeckFeature => ({
      ...neck,
      featureId: `neck-${index + 1}`,
    }));
  const saddles = saddleCandidates
    .filter((saddle) => !dams.some((dam) => damOverlapsFeature(dam, saddle.center, buffer)))
    .map((saddle, index): WaterReaderSaddleFeature => ({
      ...saddle,
      featureId: `saddle-${index + 1}`,
    }));

  const constrictionEndpoints = [...necks, ...saddles].flatMap((feature) => [feature.endpointA, feature.endpointB]);
  const coveCandidates = applySameTypeSpacing(params.coves, (c) => c.back, spacing)
    .filter((cove) => !constrictionEndpoints.some((endpoint) => distanceM(endpoint, cove.mouthLeft) < buffer || distanceM(endpoint, cove.mouthRight) < buffer));
  const coves = coveCandidates.map((cove, index): WaterReaderCoveFeature => ({
    ...cove,
    featureId: `cove-${index + 1}`,
  }));

  const pointCandidates = applySameTypeSpacing(params.points, (p) => p.tip, spacing)
    .filter((point) => !dams.some((dam) => damOverlapsFeature(dam, point.tip, buffer)))
    .filter((point) => !constrictionEndpoints.some((endpoint) => distanceM(endpoint, point.tip) < buffer && point.confidence < 0.9));

  const points = pointCandidates
    .map((point, index): WaterReaderPointFeature | null => {
      const parent = coves.find((cove) => pointInPolygon(point.baseMidpoint, cove.coveBoundary));
      const nearCoveMouth = coves.some(
        (cove) => distanceM(point.tip, cove.mouthLeft) < buffer || distanceM(point.tip, cove.mouthRight) < buffer,
      );
      if (!parent && nearCoveMouth && point.confidence < 0.82) return null;
      const featureClass = parent ? 'secondary_point' : 'main_lake_point';
      return {
        ...point,
        featureId: `${featureClass}-${index + 1}`,
        featureClass,
        parentCoveId: parent?.featureId,
        qaFlags: parent ? [...point.qaFlags, 'classified_inside_retained_cove'] : point.qaFlags,
        metrics: parent ? { ...point.metrics, parentCoveId: parent.featureId } : point.metrics,
      };
    })
    .filter((point): point is WaterReaderPointFeature => point != null);

  const prelim = [...dams, ...necks, ...saddles, ...coves, ...points, ...params.islands].sort(featureSort);
  const { features, pruning } = pruneRetainedFeatures(prelim, params.metrics.longestDimensionM);
  lastFeaturePruningSummary = pruning;
  return features;
}

export const resolveChunk2AFeatures = resolveWaterReaderFeatureConflicts;

function emptyFeaturePruningSummary(): FeaturePruningSummary {
  return {
    class_cap: 0,
    cluster: 0,
    total_cap: 0,
    orphan_secondary_point: 0,
  };
}

function pruneRetainedFeatures(
  features: WaterReaderDetectedFeature[],
  longestDimensionM: number,
): { features: WaterReaderDetectedFeature[]; pruning: FeaturePruningSummary } {
  const pruning = emptyFeaturePruningSummary();
  const classCaps: Record<string, number> = {
    dam: 2,
    neck: 2,
    saddle: 1,
    main_lake_point: 4,
    cove: 4,
    secondary_point: 2,
    island: 2,
  };
  const classCounts: Record<string, number> = {};
  const classCapped: WaterReaderDetectedFeature[] = [];
  for (const feature of [...features].sort(featureSort)) {
    const cap = classCaps[feature.featureClass] ?? Infinity;
    const count = classCounts[feature.featureClass] ?? 0;
    if (count >= cap) {
      pruning.class_cap++;
      continue;
    }
    classCounts[feature.featureClass] = count + 1;
    classCapped.push(feature);
  }

  const clusterRadiusM = longestDimensionM * 0.1;
  const clustered: WaterReaderDetectedFeature[] = [];
  for (const feature of classCapped.sort(featureSort)) {
    const anchor = featureAnchor(feature);
    const nearby = clustered.filter((existing) => distanceM(featureAnchor(existing), anchor) < clusterRadiusM);
    const hasConstriction = nearby.some(isConstriction) || isConstriction(feature);
    const nearbyNonConstrictions = nearby.filter((existing) => !isConstriction(existing)).length;
    if (nearby.length >= 2 || (hasConstriction && !isConstriction(feature) && nearbyNonConstrictions >= 1)) {
      pruning.cluster++;
      continue;
    }
    clustered.push(feature);
  }

  const totalCapped = clustered.sort(featureSort).slice(0, 8);
  pruning.total_cap += Math.max(0, clustered.length - totalCapped.length);

  const retainedCoveIds = new Set(totalCapped.filter((feature) => feature.featureClass === 'cove').map((feature) => feature.featureId));
  const dependencyFiltered = totalCapped.filter((feature) => {
    if (feature.featureClass !== 'secondary_point') return true;
    if (feature.parentCoveId && retainedCoveIds.has(feature.parentCoveId)) return true;
    pruning.orphan_secondary_point++;
    return false;
  });

  return { features: reassignFeatureIds(dependencyFiltered.sort(featureSort)), pruning };
}

function reassignFeatureIds(features: WaterReaderDetectedFeature[]): WaterReaderDetectedFeature[] {
  const counts: Record<string, number> = {};
  const coveIdMap = new Map<string, string>();
  const firstPass = features.map((feature) => {
    const next = (counts[feature.featureClass] ?? 0) + 1;
    counts[feature.featureClass] = next;
    const featureId = `${feature.featureClass}-${next}`;
    if (feature.featureClass === 'cove') coveIdMap.set(feature.featureId, featureId);
    return { ...feature, featureId } as WaterReaderDetectedFeature;
  });
  return firstPass.map((feature) => {
    if (feature.featureClass !== 'secondary_point' || !feature.parentCoveId) return feature;
    const parentCoveId = coveIdMap.get(feature.parentCoveId) ?? feature.parentCoveId;
    return {
      ...feature,
      parentCoveId,
      metrics: { ...feature.metrics, parentCoveId },
    };
  });
}

function isConstriction(feature: WaterReaderDetectedFeature): boolean {
  return feature.featureClass === 'neck' || feature.featureClass === 'saddle';
}

function featureAnchor(feature: WaterReaderDetectedFeature): PointM {
  switch (feature.featureClass) {
    case 'dam':
      return midpoint(feature.cornerA, feature.cornerB);
    case 'neck':
    case 'saddle':
      return feature.center;
    case 'main_lake_point':
    case 'secondary_point':
      return feature.tip;
    case 'cove':
      return feature.back;
    case 'island':
      return ringAnchor(feature.ring);
    default:
      return { x: 0, y: 0 };
  }
}

function ringAnchor(ring: RingM): PointM {
  if (ring.length === 0) return { x: 0, y: 0 };
  const sum = ring.reduce((acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }), { x: 0, y: 0 });
  return { x: sum.x / ring.length, y: sum.y / ring.length };
}

function applySameTypeSpacing<T extends { score: number }>(
  features: T[],
  anchor: (feature: T) => PointM,
  minDistanceM: number,
): T[] {
  const sorted = [...features].sort((a, b) => b.score - a.score);
  const kept: T[] = [];
  for (const feature of sorted) {
    if (kept.some((existing) => distanceM(anchor(existing), anchor(feature)) < minDistanceM)) continue;
    kept.push(feature);
  }
  return kept;
}

export function pointInPolygon(point: PointM, ring: RingM): boolean {
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

function widthFeaturesOverlap(
  a: WaterReaderNeckCandidate | WaterReaderSaddleCandidate,
  b: WaterReaderNeckCandidate | WaterReaderSaddleCandidate,
  bufferM: number,
): boolean {
  return (
    distanceM(a.center, b.center) < bufferM ||
    (distanceM(a.endpointA, b.endpointA) < bufferM && distanceM(a.endpointB, b.endpointB) < bufferM) ||
    (distanceM(a.endpointA, b.endpointB) < bufferM && distanceM(a.endpointB, b.endpointA) < bufferM)
  );
}

function damOverlapsFeature(dam: WaterReaderDamFeature, point: PointM, bufferM: number): boolean {
  return pointToSegmentDistance(point, dam.cornerA, dam.cornerB) < bufferM;
}

function pointToSegmentDistance(p: PointM, a: PointM, b: PointM): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return distanceM(p, a);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return distanceM(p, { x: a.x + dx * t, y: a.y + dy * t });
}

function midpoint(a: PointM, b: PointM): PointM {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function featureSort(a: WaterReaderDetectedFeature, b: WaterReaderDetectedFeature): number {
  const classRank = (feature: WaterReaderDetectedFeature) => {
    switch (feature.featureClass) {
      case 'dam':
        return 1;
      case 'neck':
        return 2;
      case 'main_lake_point':
        return 3;
      case 'saddle':
        return 4;
      case 'island':
        return 5;
      case 'cove':
        return 6;
      case 'secondary_point':
        return 7;
      default:
        return 9;
    }
  };
  return classRank(a) - classRank(b) || b.score - a.score || a.featureId.localeCompare(b.featureId);
}
