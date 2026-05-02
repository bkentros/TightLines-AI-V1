import type { PointM, RingM, WaterReaderEngineInput, WaterReaderPreprocessResult } from '../contracts';
import { distanceM, ringSignedAreaM } from '../metrics';
import { clamp } from '../shoreline';
import type { WaterReaderCoveCandidate } from './types';
import {
  nearestPointOnRing,
  pointInWaterOrBoundary,
  polygonInteriorWaterFraction,
  segmentSamplesInsideWater,
  validateCoveWaterInterior,
} from './validation';

const MAX_MOUTH_WIDTH_FRAC = 0.22;
const MIN_PATH_RATIO = 1.35;
const MIN_SHALLOW_DEPTH_RATIO = 0.55;
const MIN_COVE_AREA_FRAC = 0.0015;
const MAX_LOCAL_SHORELINE_FRAC = 0.18;
const ABSOLUTE_MAX_SHORELINE_FRAC = 0.22;

const COVE_SUPPRESSION_REASONS = [
  'suppressed_cove_too_large',
  'suppressed_cove_too_much_shoreline',
  'suppressed_cove_not_local_recess',
  'suppressed_cove_overlap_larger_candidate',
  'suppressed_cove_broad_lobe',
  'suppressed_cove_outside_water',
] as const;

export type WaterReaderCoveSuppressionReason = (typeof COVE_SUPPRESSION_REASONS)[number];
export type WaterReaderCoveSuppressionSummary = Record<WaterReaderCoveSuppressionReason, number>;

let lastCoveSuppressionSummary = emptyCoveSuppressionSummary();

export function getLastCoveSuppressionSummary(): WaterReaderCoveSuppressionSummary {
  return { ...lastCoveSuppressionSummary };
}

export function detectCoveCandidates(
  preprocess: WaterReaderPreprocessResult,
  input: WaterReaderEngineInput,
): WaterReaderCoveCandidate[] {
  const suppressions = emptyCoveSuppressionSummary();
  const suppress = (reason: WaterReaderCoveSuppressionReason) => {
    suppressions[reason] += 1;
  };
  lastCoveSuppressionSummary = suppressions;

  const ring = preprocess.smoothedExterior;
  const metrics = preprocess.metrics;
  const polygon = preprocess.primaryPolygon;
  if (!ring || ring.length < 7 || !metrics || !polygon) return [];
  const longest = metrics.longestDimensionM;
  const waterToleranceM = clamp(longest * 0.0015, 5, 30);
  const shorelineSnapToleranceM = clamp(longest * 0.006, 12, 70);
  const minMouthWidth = adaptiveCoveOpeningThresholdM(input.acreage ?? metrics.areaSqM / 4046.8564224, longest);
  const maxMouthWidth = longest * MAX_MOUTH_WIDTH_FRAC;
  const acres = input.acreage ?? metrics.areaSqM / 4046.8564224;
  const areaCap = coveAreaCapFraction(acres);
  const scanRing = subsampledRing(ring, 180);
  const candidates: WaterReaderCoveCandidate[] = [];

  for (let i = 0; i < scanRing.indices.length; i++) {
    for (let j = i + 2; j < scanRing.indices.length; j++) {
      const aIndex = scanRing.indices[i]!;
      const bIndex = scanRing.indices[j]!;
      const mouthLeft = ring[aIndex]!;
      const mouthRight = ring[bIndex]!;
      const mouthWidthM = distanceM(mouthLeft, mouthRight);
      if (mouthWidthM < minMouthWidth || mouthWidthM > maxMouthWidth) continue;
      const path = shorterRingPath(ring, aIndex, bIndex);
      if (path.length < 3) continue;
      const shorePathLengthM = pathLength(path);
      const pathRatio = shorePathLengthM / mouthWidthM;
      const shorePathFraction = metrics.perimeterM > 0 ? shorePathLengthM / metrics.perimeterM : 1;
      const maxLocalPathM = Math.max(MAX_LOCAL_SHORELINE_FRAC * metrics.perimeterM, 2.8 * mouthWidthM);
      if (shorePathLengthM > maxLocalPathM || shorePathFraction > ABSOLUTE_MAX_SHORELINE_FRAC) {
        suppress('suppressed_cove_too_much_shoreline');
        continue;
      }
      if (pathRatio < MIN_PATH_RATIO) continue;
      if (pathRatio > 4.4 && shorePathFraction > 0.09) {
        suppress('suppressed_cove_not_local_recess');
        continue;
      }
      if (significantTurnCount(path) < (path.length < 5 ? 1 : 2)) {
        suppress('suppressed_cove_not_local_recess');
        continue;
      }

      const depth = maxDepthFromChord(path, mouthLeft, mouthRight);
      const coveDepthM = depth.depthM;
      const depthRatio = coveDepthM / mouthWidthM;
      if (depthRatio < MIN_SHALLOW_DEPTH_RATIO) continue;
      const side = chordSide(path, mouthLeft, mouthRight);
      if (!side.meaningfulRecess) {
        suppress('suppressed_cove_not_local_recess');
        continue;
      }
      if (depth.index <= 0 || depth.index >= path.length - 1) {
        suppress('suppressed_cove_not_local_recess');
        continue;
      }
      const coveBoundary = [...path, mouthLeft];
      const coveAreaSqM = Math.abs(ringSignedAreaM(coveBoundary));
      if (coveAreaSqM < metrics.areaSqM * MIN_COVE_AREA_FRAC) continue;
      const coveAreaFraction = metrics.areaSqM > 0 ? coveAreaSqM / metrics.areaSqM : 1;
      if (coveAreaFraction > areaCap) {
        suppress('suppressed_cove_too_large');
        continue;
      }
      if (mouthWidthM > longest * 0.18 && (pathRatio < 2.15 || coveAreaFraction > 0.06)) {
        suppress('suppressed_cove_broad_lobe');
        continue;
      }
      if (mouthWidthM > longest * 0.12 && pathRatio < 2 && coveAreaFraction > 0.04) {
        suppress('suppressed_cove_broad_lobe');
        continue;
      }
      if (!backClearlyRecessed(depth, path, mouthLeft, mouthRight, mouthWidthM)) {
        suppress('suppressed_cove_not_local_recess');
        continue;
      }

      const snappedPath = path.map((point) => nearestPointOnRing(point, polygon.exterior));
      if (snappedPath.some((point, index) => distanceM(point, path[index]!) > shorelineSnapToleranceM)) {
        suppress('suppressed_cove_outside_water');
        continue;
      }
      const snappedMouthLeft = snappedPath[0]!;
      const snappedMouthRight = snappedPath[snappedPath.length - 1]!;
      const snappedBack = snappedPath[depth.index] ?? nearestPointOnRing(depth.back, polygon.exterior);
      const snappedBoundary = [...snappedPath, snappedMouthLeft];
      const chordMidpoint = {
        x: (snappedMouthLeft.x + snappedMouthRight.x) / 2,
        y: (snappedMouthLeft.y + snappedMouthRight.y) / 2,
      };
      const interiorValidation = validateCoveWaterInterior({
        mouthLeft: snappedMouthLeft,
        mouthRight: snappedMouthRight,
        back: snappedBack,
        waterPolygon: polygon,
        toleranceM: waterToleranceM,
      });
      if (
        !pointInWaterOrBoundary(chordMidpoint, polygon, waterToleranceM) ||
        !segmentSamplesInsideWater(snappedMouthLeft, snappedMouthRight, polygon, 6, waterToleranceM) ||
        !interiorValidation.valid ||
        polygonInteriorWaterFraction(snappedBoundary, polygon, waterToleranceM) < 0.9
      ) {
        suppress('suppressed_cove_outside_water');
        continue;
      }

      const back = snappedBack;
      const leftIrregularity = irregularity(path.slice(0, Math.max(2, depth.index + 1)));
      const rightIrregularity = irregularity(path.slice(Math.max(0, depth.index)));
      const irregularityScore = Math.max(leftIrregularity, rightIrregularity, 0.2);
      const localness = clamp(1 - coveAreaFraction / areaCap, 0.15, 1) * clamp(1 - shorePathFraction / ABSOLUTE_MAX_SHORELINE_FRAC, 0.15, 1);
      const score = coveDepthM * depthRatio * irregularityScore * localness;
      candidates.push({
        featureClass: 'cove',
        mouthLeft: snappedMouthLeft,
        mouthRight: snappedMouthRight,
        mouthWidthM,
        back,
        shorePath: snappedPath,
        coveBoundary: snappedBoundary,
        shorePathLengthM,
        pathRatio,
        coveDepthM,
        depthRatio,
        coveAreaSqM,
        leftIrregularity,
        rightIrregularity,
        covePolygon: snappedBoundary,
        score,
        qaFlags: ['preliminary_hybrid_chord_scan_cove', side.sideFlag],
        metrics: {
          mouthWidthM,
          shorePathLengthM,
          pathRatio,
          coveDepthM,
          depthRatio,
          coveAreaSqM,
          coveAreaFraction,
          shorePathFraction,
          leftIrregularity,
          rightIrregularity,
          recessSignedDepthMean: side.meanSignedDepth,
          recessSignedDepthMax: side.maxSignedDepth,
          coveFanInsideFraction: interiorValidation.fanInsideFraction,
          coveFanSamples: interiorValidation.fanSamples,
          coveAxisSamples: interiorValidation.axisSamples,
        },
      });
    }
  }

  const deduped = dedupeCoves(candidates, longest * 0.1, suppress).slice(0, 18);
  lastCoveSuppressionSummary = { ...suppressions };
  return deduped;
}

function emptyCoveSuppressionSummary(): WaterReaderCoveSuppressionSummary {
  return {
    suppressed_cove_too_large: 0,
    suppressed_cove_too_much_shoreline: 0,
    suppressed_cove_not_local_recess: 0,
    suppressed_cove_overlap_larger_candidate: 0,
    suppressed_cove_broad_lobe: 0,
    suppressed_cove_outside_water: 0,
  };
}

export function adaptiveCoveOpeningThresholdM(acres: number | null | undefined, longestDimensionM: number): number {
  if (typeof acres === 'number' && Number.isFinite(acres)) {
    if (acres < 100) return longestDimensionM * 0.02;
    if (acres <= 1000) return longestDimensionM * 0.025;
  }
  return longestDimensionM * 0.03;
}

function coveAreaCapFraction(acres: number | null | undefined): number {
  if (typeof acres === 'number' && Number.isFinite(acres)) {
    if (acres < 100) return 0.18;
    if (acres <= 1000) return 0.12;
  }
  return 0.08;
}

function subsampledRing(ring: RingM, maxPoints: number): { indices: number[] } {
  if (ring.length <= maxPoints) return { indices: ring.map((_, i) => i) };
  const stride = Math.ceil(ring.length / maxPoints);
  const indices: number[] = [];
  for (let i = 0; i < ring.length; i += stride) indices.push(i);
  return { indices };
}

function shorterRingPath(ring: RingM, aIndex: number, bIndex: number): RingM {
  const forward = ringPath(ring, aIndex, bIndex, 1);
  const backward = ringPath(ring, aIndex, bIndex, -1);
  return pathLength(forward) <= pathLength(backward) ? forward : backward;
}

function ringPath(ring: RingM, from: number, to: number, direction: 1 | -1): RingM {
  const out: RingM = [];
  let i = from;
  for (;;) {
    out.push(ring[i]!);
    if (i === to) break;
    i = (i + direction + ring.length) % ring.length;
    if (out.length > ring.length + 1) break;
  }
  return out;
}

function pathLength(path: RingM): number {
  let length = 0;
  for (let i = 1; i < path.length; i++) length += distanceM(path[i - 1]!, path[i]!);
  return length;
}

function maxDepthFromChord(path: RingM, a: PointM, b: PointM): { depthM: number; back: PointM; index: number } {
  let depthM = -1;
  let back = path[0] ?? a;
  let index = 0;
  for (let i = 1; i < path.length - 1; i++) {
    const d = pointLineDistance(path[i]!, a, b);
    if (d > depthM) {
      depthM = d;
      back = path[i]!;
      index = i;
    }
  }
  return { depthM: Math.max(0, depthM), back, index };
}

function backClearlyRecessed(
  depth: { depthM: number; index: number },
  path: RingM,
  mouthLeft: PointM,
  mouthRight: PointM,
  mouthWidthM: number,
): boolean {
  if (path.length <= 3) return depth.depthM >= mouthWidthM * 0.55;
  const shoulderSpan = Math.max(1, Math.floor(path.length * 0.18));
  const leftShoulder = path.slice(1, Math.min(path.length - 1, 1 + shoulderSpan));
  const rightShoulder = path.slice(Math.max(1, path.length - 1 - shoulderSpan), path.length - 1);
  const leftMax = leftShoulder.reduce((max, point) => Math.max(max, pointLineDistance(point, mouthLeft, mouthRight)), 0);
  const rightMax = rightShoulder.reduce((max, point) => Math.max(max, pointLineDistance(point, mouthLeft, mouthRight)), 0);
  const shoulderMax = Math.max(leftMax, rightMax, mouthWidthM * 0.08);
  return depth.index >= shoulderSpan && depth.index <= path.length - 1 - shoulderSpan && depth.depthM >= shoulderMax * 1.25;
}

function chordSide(
  path: RingM,
  a: PointM,
  b: PointM,
): { meaningfulRecess: boolean; sideFlag: string; meanSignedDepth: number; maxSignedDepth: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const denom = Math.hypot(dx, dy) || 1e-12;
  const interior = path.slice(1, -1);
  if (interior.length === 0) {
    return { meaningfulRecess: false, sideFlag: 'recess_side_missing', meanSignedDepth: 0, maxSignedDepth: 0 };
  }
  const signed = interior.map((point) => ((dx * (point.y - a.y) - dy * (point.x - a.x)) / denom));
  const positives = signed.filter((d) => d > 0);
  const negatives = signed.filter((d) => d < 0);
  const dominant = positives.length >= negatives.length ? positives : negatives;
  const minority = positives.length >= negatives.length ? negatives : positives;
  const sign = positives.length >= negatives.length ? 1 : -1;
  const maxSignedDepth = dominant.length > 0 ? Math.max(...dominant.map(Math.abs)) : 0;
  const meanSignedDepth = dominant.length > 0 ? dominant.reduce((sum, d) => sum + Math.abs(d), 0) / dominant.length : 0;
  const minorityRatio = interior.length > 0 ? minority.length / interior.length : 1;
  return {
    meaningfulRecess: dominant.length >= Math.max(1, Math.ceil(interior.length * 0.55)) && minorityRatio <= 0.45,
    sideFlag: sign > 0 ? 'recess_side_positive' : 'recess_side_negative',
    meanSignedDepth,
    maxSignedDepth,
  };
}

function pointLineDistance(point: PointM, a: PointM, b: PointM): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const denom = Math.hypot(dx, dy);
  if (denom === 0) return distanceM(point, a);
  return Math.abs(dy * point.x - dx * point.y + b.x * a.y - b.y * a.x) / denom;
}

function significantTurnCount(path: RingM): number {
  let count = 0;
  for (let i = 1; i < path.length - 1; i++) {
    if (Math.abs(signedTurn(path[i - 1]!, path[i]!, path[i + 1]!)) > 0.22) count++;
  }
  return count;
}

function irregularity(path: RingM): number {
  if (path.length < 4) return 0;
  const turns: number[] = [];
  for (let i = 1; i < path.length - 1; i++) turns.push(Math.abs(signedTurn(path[i - 1]!, path[i]!, path[i + 1]!)));
  const mean = turns.reduce((sum, t) => sum + t, 0) / turns.length;
  const variance = turns.reduce((sum, t) => sum + (t - mean) * (t - mean), 0) / turns.length;
  return clamp(Math.sqrt(variance) / 0.75, 0, 1);
}

function signedTurn(a: PointM, b: PointM, c: PointM): number {
  const v1 = { x: b.x - a.x, y: b.y - a.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  return Math.atan2(v1.x * v2.y - v1.y * v2.x, v1.x * v2.x + v1.y * v2.y);
}

function dedupeCoves(
  candidates: WaterReaderCoveCandidate[],
  minDistanceM: number,
  suppress: (reason: WaterReaderCoveSuppressionReason) => void,
): WaterReaderCoveCandidate[] {
  const sorted = [...candidates].sort((a, b) => b.score - a.score || a.coveAreaSqM - b.coveAreaSqM);
  const kept: WaterReaderCoveCandidate[] = [];
  for (const candidate of sorted) {
    const overlaps = kept.some((existing) => {
      const backClose = distanceM(existing.back, candidate.back) < minDistanceM;
      const mouthClose =
        distanceM(existing.mouthLeft, candidate.mouthLeft) + distanceM(existing.mouthRight, candidate.mouthRight) <
          minDistanceM * 2 ||
        distanceM(existing.mouthLeft, candidate.mouthRight) + distanceM(existing.mouthRight, candidate.mouthLeft) <
          minDistanceM * 2;
      const contained =
        pointInRing(candidate.back, existing.coveBoundary) ||
        pointInRing(existing.back, candidate.coveBoundary) ||
        bboxOverlapFraction(candidate.coveBoundary, existing.coveBoundary) > 0.55;
      return backClose || mouthClose || contained;
    });
    if (overlaps) {
      suppress('suppressed_cove_overlap_larger_candidate');
    } else {
      kept.push(candidate);
    }
  }
  return kept;
}

function pointInRing(point: PointM, ring: RingM): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i]!;
    const b = ring[j]!;
    if ((a.y > point.y) === (b.y > point.y)) continue;
    const xAtY = ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y || 1e-12) + a.x;
    if (point.x < xAtY) inside = !inside;
  }
  return inside;
}

function bboxOverlapFraction(a: RingM, b: RingM): number {
  const ab = ringBBox(a);
  const bb = ringBBox(b);
  const ix = Math.max(0, Math.min(ab.maxX, bb.maxX) - Math.max(ab.minX, bb.minX));
  const iy = Math.max(0, Math.min(ab.maxY, bb.maxY) - Math.max(ab.minY, bb.minY));
  const inter = ix * iy;
  const areaA = Math.max(1e-9, (ab.maxX - ab.minX) * (ab.maxY - ab.minY));
  const areaB = Math.max(1e-9, (bb.maxX - bb.minX) * (bb.maxY - bb.minY));
  return inter / Math.min(areaA, areaB);
}

function ringBBox(ring: RingM): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of ring) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { minX, minY, maxX, maxY };
}
