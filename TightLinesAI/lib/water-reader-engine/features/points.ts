import type { PointM, RingM, WaterReaderEngineInput, WaterReaderPreprocessResult } from '../contracts';
import { distanceM } from '../metrics';
import { clamp } from '../shoreline';
import type { WaterReaderPointCandidate } from './types';
import { nearestPointOnRing, pointInWaterOrBoundary } from './validation';

const POINT_TURN_THRESHOLD_RAD = Math.PI / 3;
const MIN_CONFIDENCE = 0.6;

export function detectPointCandidates(
  preprocess: WaterReaderPreprocessResult,
  input: WaterReaderEngineInput,
): WaterReaderPointCandidate[] {
  const ring = preprocess.smoothedExterior;
  const metrics = preprocess.metrics;
  const polygon = preprocess.primaryPolygon;
  if (!ring || ring.length < 6 || !metrics || !polygon) return [];
  const longest = metrics.longestDimensionM;
  const waterToleranceM = clamp(longest * 0.0015, 5, 30);
  const shorelineSnapToleranceM = clamp(longest * 0.006, 12, 70);
  const scales = [0.012, 0.025, 0.05, 0.08].map((fraction) => longest * fraction);
  const protrusionThreshold = adaptivePointProtrusionThresholdM(input.acreage ?? metrics.areaSqM / 4046.8564224, longest);
  const raw: WaterReaderPointCandidate[] = [];

  for (let i = 0; i < ring.length; i++) {
    const scaleTurns = scales.map((scaleM) => {
      const leftIndex = indexAtArcDistance(ring, i, -scaleM);
      const rightIndex = indexAtArcDistance(ring, i, scaleM);
      return {
        leftIndex,
        rightIndex,
        angle: signedTurnAngle(ring[leftIndex]!, ring[i]!, ring[rightIndex]!),
      };
    });
    const concaveHits = scaleTurns.filter((turn) => turn.angle <= -POINT_TURN_THRESHOLD_RAD);
    const strongestConcave = Math.min(...scaleTurns.map((turn) => turn.angle));
    const hasStrongSingleScale = strongestConcave <= -1.35;
    if (concaveHits.length < 2 && !hasStrongSingleScale) continue;

    const medium = scaleTurns[2]!;
    const rawTip = ring[i]!;
    const rawLeftSlope = ring[medium.leftIndex]!;
    const rawRightSlope = ring[medium.rightIndex]!;
    const rawBaseMidpoint = waterSideBaseMidpoint(midpoint(rawLeftSlope, rawRightSlope), rawTip, polygon, waterToleranceM);
    if (!rawBaseMidpoint) continue;
    const tip = nearestPointOnRing(rawTip, polygon.exterior);
    const leftSlope = nearestPointOnRing(rawLeftSlope, polygon.exterior);
    const rightSlope = nearestPointOnRing(rawRightSlope, polygon.exterior);
    if (
      distanceM(tip, rawTip) > shorelineSnapToleranceM ||
      distanceM(leftSlope, rawLeftSlope) > shorelineSnapToleranceM ||
      distanceM(rightSlope, rawRightSlope) > shorelineSnapToleranceM
    ) {
      continue;
    }
    const baseMidpoint = waterSideBaseMidpoint(midpoint(leftSlope, rightSlope), tip, polygon, waterToleranceM) ?? rawBaseMidpoint;
    const protrusionLengthM = pointLineDistance(tip, leftSlope, rightSlope);
    const effectiveThreshold = hasStrongSingleScale ? protrusionThreshold * 0.68 : protrusionThreshold;
    if (protrusionLengthM < effectiveThreshold) continue;
    if (!isLocalStrongestConcavity(ring, i, scaleTurns[2]!.angle)) continue;

    const baseToTip = { x: tip.x - baseMidpoint.x, y: tip.y - baseMidpoint.y };
    const orientationVector = normalize(baseToTip);
    const turnAngleRad = Math.abs(scaleTurns.reduce((sum, turn) => sum + turn.angle, 0) / scaleTurns.length);
    const sideSymmetry = sideSlopeSymmetry(tip, leftSlope, rightSlope);
    if (sideSymmetry < 0.42) continue;
    const protrusionScore = clamp(protrusionLengthM / (protrusionThreshold * 1.75), 0, 1);
    const confidence = clamp(0.34 * clamp(concaveHits.length / 3, hasStrongSingleScale ? 0.72 : 0, 1) + 0.33 * protrusionScore + 0.33 * sideSymmetry, 0, 1);
    if (confidence < MIN_CONFIDENCE) continue;

    raw.push({
      tip,
      leftSlope,
      rightSlope,
      baseMidpoint,
      orientationVector,
      protrusionLengthM,
      turnAngleRad,
      confidence,
      score: confidence * protrusionLengthM,
      qaFlags: ['preliminary_curvature_point', 'water_polygon_concave_turn'],
      metrics: {
        protrusionLengthM,
        protrusionThresholdM: protrusionThreshold,
        effectiveProtrusionThresholdM: effectiveThreshold,
        turnAngleRad,
        confidence,
        concaveScaleHits: concaveHits.length,
        sideSymmetry,
        signedTurnSupplementalRad: scaleTurns[0]!.angle,
        signedTurnSmallRad: scaleTurns[1]!.angle,
        signedTurnMediumRad: scaleTurns[2]!.angle,
        signedTurnLargeRad: scaleTurns[3]!.angle,
        turnDirection: 'concave_water_polygon',
      },
    });
  }

  return dedupeNearbyPointCandidates(raw, longest * 0.035);
}

export function adaptivePointProtrusionThresholdM(acres: number | null | undefined, longestDimensionM: number): number {
  if (typeof acres === 'number' && Number.isFinite(acres)) {
    if (acres < 100) return longestDimensionM * 0.03;
    if (acres <= 1000) return longestDimensionM * 0.04;
  }
  return longestDimensionM * 0.05;
}

function indexAtArcDistance(ring: RingM, start: number, signedDistance: number): number {
  const dir = signedDistance >= 0 ? 1 : -1;
  let remaining = Math.abs(signedDistance);
  let i = start;
  for (let guard = 0; guard < ring.length; guard++) {
    const next = (i + dir + ring.length) % ring.length;
    const segment = distanceM(ring[i]!, ring[next]!);
    if (remaining <= segment) return next;
    remaining -= segment;
    i = next;
  }
  return i;
}

function signedTurnAngle(a: PointM, b: PointM, c: PointM): number {
  const v1 = { x: b.x - a.x, y: b.y - a.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  const cross = v1.x * v2.y - v1.y * v2.x;
  const dot = v1.x * v2.x + v1.y * v2.y;
  return Math.atan2(cross, dot);
}

function isLocalStrongestConcavity(ring: RingM, index: number, angle: number): boolean {
  const radius = Math.max(2, Math.floor(ring.length * 0.012));
  for (let k = -radius; k <= radius; k++) {
    if (k === 0) continue;
    const j = (index + k + ring.length) % ring.length;
    const prev = ring[(j - 1 + ring.length) % ring.length]!;
    const next = ring[(j + 1) % ring.length]!;
    const local = signedTurnAngle(prev, ring[j]!, next);
    if (local < angle) return false;
  }
  return true;
}

function midpoint(a: PointM, b: PointM): PointM {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function waterSideBaseMidpoint(chordMidpoint: PointM, tip: PointM, polygon: NonNullable<WaterReaderPreprocessResult['primaryPolygon']>, toleranceM: number): PointM | null {
  if (pointInWaterOrBoundary(chordMidpoint, polygon, toleranceM)) return chordMidpoint;
  for (const t of [0.2, 0.35, 0.5, 0.65, 0.8, 0.92, 1]) {
    const candidate = {
      x: chordMidpoint.x + (tip.x - chordMidpoint.x) * t,
      y: chordMidpoint.y + (tip.y - chordMidpoint.y) * t,
    };
    if (pointInWaterOrBoundary(candidate, polygon, toleranceM)) return candidate;
  }
  return null;
}

function pointLineDistance(point: PointM, a: PointM, b: PointM): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const denom = Math.hypot(dx, dy);
  if (denom === 0) return distanceM(point, a);
  return Math.abs(dy * point.x - dx * point.y + b.x * a.y - b.y * a.x) / denom;
}

function normalize(v: PointM): PointM {
  const len = Math.hypot(v.x, v.y);
  return len > 0 ? { x: v.x / len, y: v.y / len } : { x: 0, y: 0 };
}

function sideSlopeSymmetry(tip: PointM, left: PointM, right: PointM): number {
  const a = distanceM(tip, left);
  const b = distanceM(tip, right);
  const maxSide = Math.max(a, b);
  if (maxSide === 0) return 0;
  return clamp(Math.min(a, b) / maxSide, 0, 1);
}

function dedupeNearbyPointCandidates(candidates: WaterReaderPointCandidate[], minDistanceM: number): WaterReaderPointCandidate[] {
  const sorted = [...candidates].sort((a, b) => b.score - a.score || b.protrusionLengthM - a.protrusionLengthM);
  const kept: WaterReaderPointCandidate[] = [];
  for (const candidate of sorted) {
    if (kept.some((existing) => distanceM(existing.tip, candidate.tip) < minDistanceM)) continue;
    kept.push(candidate);
  }
  return kept;
}
