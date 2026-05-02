import type { PointM, RingM, WaterReaderEngineInput, WaterReaderPreprocessResult } from '../contracts';
import { distanceM, ringLengthM } from '../metrics';
import type { WaterReaderDamCandidate } from './types';

const MIN_R_SQUARED = 0.98;
const MIN_CORNER_ANGLE_RAD = (35 * Math.PI) / 180;

export function detectDamCandidates(
  preprocess: WaterReaderPreprocessResult,
  input: WaterReaderEngineInput,
): WaterReaderDamCandidate[] {
  if (!hasDamMetadataSupport(input)) return [];
  const ring = preprocess.smoothedExterior;
  const metrics = preprocess.metrics;
  if (!ring || ring.length < 8 || !metrics) return [];
  const perimeterM = ringLengthM(ring);
  const minLengthM = perimeterM * 0.03;
  const maxLengthM = perimeterM * 0.1;
  const raw: WaterReaderDamCandidate[] = [];

  for (let start = 0; start < ring.length; start++) {
    const path = growWindowByLength(ring, start, minLengthM, maxLengthM);
    if (path.length < 4) continue;
    const segmentLengthM = pathLength(path);
    if (segmentLengthM < minLengthM || segmentLengthM > maxLengthM) continue;
    const rSquared = linearRegressionRSquared(path);
    if (rSquared < MIN_R_SQUARED) continue;
    const cornerA = path[0]!;
    const cornerB = path[path.length - 1]!;
    const cornerAngles = cornerTransitionAngles(ring, start, path.length - 1);
    if (cornerAngles.a < MIN_CORNER_ANGLE_RAD || cornerAngles.b < MIN_CORNER_ANGLE_RAD) continue;
    if (!facesOpenWaterProxy(cornerA, cornerB, ring)) continue;
    const confidence = Math.min(1, 0.75 + (rSquared - MIN_R_SQUARED) * 8);
    raw.push({
      featureClass: 'dam',
      cornerA,
      cornerB,
      segmentLengthM,
      rSquared,
      confidence,
      score: confidence * segmentLengthM,
      qaFlags: ['metadata_supported_dam_scan'],
      metrics: {
        segmentLengthM,
        rSquared,
        cornerAngleARad: cornerAngles.a,
        cornerAngleBRad: cornerAngles.b,
      },
    });
  }

  return dedupeDams(raw).slice(0, 2);
}

function hasDamMetadataSupport(input: WaterReaderEngineInput): boolean {
  const extended = input as WaterReaderEngineInput & {
    waterbodyType?: string | null;
    damDetectionEnabled?: boolean;
    hasDamMetadata?: boolean;
  };
  if (extended.damDetectionEnabled || extended.hasDamMetadata) return true;
  const name = input.name?.toLowerCase() ?? '';
  return extended.waterbodyType === 'reservoir' || /\b(reservoir|dam)\b/.test(name);
}

function growWindowByLength(ring: RingM, start: number, minLengthM: number, maxLengthM: number): RingM {
  const out = [ring[start]!];
  let length = 0;
  let i = start;
  while (length < maxLengthM && out.length <= ring.length) {
    const next = (i + 1) % ring.length;
    length += distanceM(ring[i]!, ring[next]!);
    out.push(ring[next]!);
    i = next;
    if (length >= minLengthM) break;
  }
  return out;
}

function pathLength(path: RingM): number {
  let length = 0;
  for (let i = 1; i < path.length; i++) length += distanceM(path[i - 1]!, path[i]!);
  return length;
}

function linearRegressionRSquared(path: RingM): number {
  const n = path.length;
  if (n < 2) return 0;
  const meanX = path.reduce((sum, point) => sum + point.x, 0) / n;
  const meanY = path.reduce((sum, point) => sum + point.y, 0) / n;
  const sxx = path.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);
  const syy = path.reduce((sum, point) => sum + (point.y - meanY) ** 2, 0);
  const sxy = path.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
  const trace = sxx + syy;
  if (trace <= 0) return 0;
  const detTerm = Math.sqrt(Math.max(0, (sxx - syy) ** 2 + 4 * sxy * sxy));
  const major = (trace + detTerm) / 2;
  return major / trace;
}

function cornerTransitionAngles(ring: RingM, start: number, windowSteps: number): { a: number; b: number } {
  const end = (start + windowSteps) % ring.length;
  return {
    a: Math.abs(turnAngle(ring[(start - 1 + ring.length) % ring.length]!, ring[start]!, ring[(start + 1) % ring.length]!)),
    b: Math.abs(turnAngle(ring[(end - 1 + ring.length) % ring.length]!, ring[end]!, ring[(end + 1) % ring.length]!)),
  };
}

function turnAngle(a: PointM, b: PointM, c: PointM): number {
  const v1 = { x: b.x - a.x, y: b.y - a.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  return Math.atan2(v1.x * v2.y - v1.y * v2.x, v1.x * v2.x + v1.y * v2.y);
}

function facesOpenWaterProxy(a: PointM, b: PointM, ring: RingM): boolean {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const chord = { x: b.x - a.x, y: b.y - a.y };
  const normal = { x: -chord.y, y: chord.x };
  let positive = 0;
  let negative = 0;
  for (const point of ring) {
    const dot = (point.x - mid.x) * normal.x + (point.y - mid.y) * normal.y;
    if (dot > 0) positive++;
    else if (dot < 0) negative++;
  }
  return Math.max(positive, negative) >= Math.min(positive, negative) * 1.25;
}

function dedupeDams(candidates: WaterReaderDamCandidate[]): WaterReaderDamCandidate[] {
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const kept: WaterReaderDamCandidate[] = [];
  for (const candidate of sorted) {
    const overlaps = kept.some(
      (existing) =>
        distanceM(existing.cornerA, candidate.cornerA) + distanceM(existing.cornerB, candidate.cornerB) <
        Math.min(existing.segmentLengthM, candidate.segmentLengthM) * 0.7,
    );
    if (!overlaps) kept.push(candidate);
  }
  return kept;
}
