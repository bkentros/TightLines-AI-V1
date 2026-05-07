import type { PointM, RingM, WaterReaderPreprocessResult } from '../contracts';
import { ringLengthM, ringSignedAreaM } from '../metrics';
import { clamp } from '../shoreline';
import type { WaterReaderDetectedFeature } from './types';

export type SmoothLakeEnrichmentProfile = {
  eligible: boolean;
  reason: string;
  shorelineDevelopmentIndex: number;
  convexHullAreaRatio: number;
  meaningfulTurnDensityPerKm: number;
  normalNonIslandFeatureCount: number;
};

const MAX_SPARSE_NORMAL_NON_ISLAND_FEATURES = 6;
const SMOOTH_SHORELINE_DEVELOPMENT_CEILING = 4.8;
const SMOOTH_HULL_AREA_RATIO_FLOOR = 0.28;
const SMOOTH_TURN_DENSITY_CEILING_PER_KM = 28;

export function smoothLakeEnrichmentProfile(
  preprocess: WaterReaderPreprocessResult,
  normalFeatures: WaterReaderDetectedFeature[],
): SmoothLakeEnrichmentProfile {
  const ring = preprocess.smoothedExterior ?? preprocess.simplifiedExterior ?? preprocess.resampledExterior ?? preprocess.primaryPolygon?.exterior;
  const metrics = preprocess.metrics;
  if (!ring || ring.length < 5 || !metrics || metrics.areaSqM <= 0 || metrics.perimeterM <= 0) {
    return disabledProfile('missing_geometry_or_metrics');
  }

  const shorelineDevelopmentIndex = metrics.perimeterM / Math.max(1, 2 * Math.sqrt(Math.PI * metrics.areaSqM));
  const hull = convexHull(ring);
  const hullAreaSqM = Math.abs(ringSignedAreaM(hull));
  const convexHullAreaRatio = hullAreaSqM > 0 ? clamp(metrics.areaSqM / hullAreaSqM, 0, 1) : 0;
  const meaningfulTurnDensityPerKm = meaningfulTurnCount(ring) / Math.max(0.001, ringLengthM(ring) / 1000);
  const normalNonIslandFeatureCount = normalFeatures.filter((feature) =>
    feature.featureClass !== 'island' && feature.featureClass !== 'universal'
  ).length;

  const sparseNormalOutput = normalNonIslandFeatureCount <= MAX_SPARSE_NORMAL_NON_ISLAND_FEATURES;
  const smoothEnough =
    shorelineDevelopmentIndex <= SMOOTH_SHORELINE_DEVELOPMENT_CEILING ||
    convexHullAreaRatio >= SMOOTH_HULL_AREA_RATIO_FLOOR ||
    meaningfulTurnDensityPerKm <= SMOOTH_TURN_DENSITY_CEILING_PER_KM;
  const eligible = sparseNormalOutput && smoothEnough;

  return {
    eligible,
    reason: eligible
      ? 'smooth_sparse_lake_underfilled_normal_detector'
      : sparseNormalOutput
        ? 'sparse_but_not_smooth_enough'
        : 'normal_detector_not_underfilled',
    shorelineDevelopmentIndex: round(shorelineDevelopmentIndex),
    convexHullAreaRatio: round(convexHullAreaRatio),
    meaningfulTurnDensityPerKm: round(meaningfulTurnDensityPerKm),
    normalNonIslandFeatureCount,
  };
}

export function smoothLakeEnrichmentMetrics(profile: SmoothLakeEnrichmentProfile): Record<string, number | string | boolean | null> {
  return {
    smoothLakeEnrichmentEligible: profile.eligible,
    smoothLakeEnrichmentReason: profile.reason,
    smoothLakeShorelineDevelopmentIndex: profile.shorelineDevelopmentIndex,
    smoothLakeConvexHullAreaRatio: profile.convexHullAreaRatio,
    smoothLakeMeaningfulTurnDensityPerKm: profile.meaningfulTurnDensityPerKm,
    smoothLakeNormalNonIslandFeatureCount: profile.normalNonIslandFeatureCount,
  };
}

function disabledProfile(reason: string): SmoothLakeEnrichmentProfile {
  return {
    eligible: false,
    reason,
    shorelineDevelopmentIndex: 0,
    convexHullAreaRatio: 0,
    meaningfulTurnDensityPerKm: 0,
    normalNonIslandFeatureCount: 0,
  };
}

function meaningfulTurnCount(ring: RingM): number {
  let count = 0;
  for (let i = 0; i < ring.length; i++) {
    const angle = Math.abs(signedTurn(
      ring[(i - 1 + ring.length) % ring.length]!,
      ring[i]!,
      ring[(i + 1) % ring.length]!,
    ));
    if (angle >= 0.22) count++;
  }
  return count;
}

function convexHull(points: RingM): RingM {
  const unique = uniquePoints(points);
  if (unique.length <= 2) return unique;
  const sorted = [...unique].sort((a, b) => a.x - b.x || a.y - b.y);
  const lower: PointM[] = [];
  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, point) <= 0) lower.pop();
    lower.push(point);
  }
  const upper: PointM[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const point = sorted[i]!;
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, point) <= 0) upper.pop();
    upper.push(point);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

function uniquePoints(points: RingM): RingM {
  const out: RingM = [];
  const seen = new Set<string>();
  for (const point of points) {
    const key = `${point.x.toFixed(3)}:${point.y.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(point);
  }
  return out;
}

function signedTurn(a: PointM, b: PointM, c: PointM): number {
  const v1 = { x: b.x - a.x, y: b.y - a.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  return Math.atan2(v1.x * v2.y - v1.y * v2.x, v1.x * v2.x + v1.y * v2.y);
}

function cross(a: PointM, b: PointM, c: PointM): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
