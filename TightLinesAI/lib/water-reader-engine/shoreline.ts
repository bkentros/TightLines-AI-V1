import type { PointM, RingM } from './contracts';
import { distanceM } from './metrics';

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function resampleSpacingM(longestDimensionM: number): number {
  return clamp(longestDimensionM * 0.003, 5, 60);
}

export function simplifyToleranceM(longestDimensionM: number): number {
  return clamp(longestDimensionM * 0.0015, 2, 35);
}

export function smoothingSigmaM(longestDimensionM: number): number {
  return clamp(longestDimensionM * 0.002, 6, 70);
}

export function resampleClosedRingByArcLength(ring: RingM, spacingM: number): RingM {
  const clean = openRing(ring);
  if (clean.length < 3 || spacingM <= 0) return clean;
  const perimeter = closedRingLength(clean);
  if (perimeter <= 0) return clean;
  const sampleCount = Math.max(3, Math.round(perimeter / spacingM));
  const out: RingM = [];
  for (let i = 0; i < sampleCount; i++) {
    out.push(pointAtClosedRingDistance(clean, (i * perimeter) / sampleCount));
  }
  return out;
}

export function simplifyDouglasPeucker(ring: RingM, toleranceM: number): RingM {
  const clean = openRing(ring);
  if (clean.length <= 4 || toleranceM <= 0) return clean;
  const [aIndex, bIndex] = farthestPairIndices(clean);
  if (aIndex === bIndex) return clean;
  const pathA = ringPathInclusive(clean, aIndex, bIndex);
  const pathB = ringPathInclusive(clean, bIndex, aIndex);
  const simplifiedA = simplifyOpenLine(pathA, toleranceM);
  const simplifiedB = simplifyOpenLine(pathB, toleranceM);
  const out = [...simplifiedA.slice(0, -1), ...simplifiedB.slice(0, -1)];
  return out.length >= 3 ? removeAdjacentDuplicates(out) : clean;
}

export function smoothClosedRingByArcLength(ring: RingM, sigmaM: number): RingM {
  const clean = openRing(ring);
  if (clean.length < 3 || sigmaM <= 0) return clean;
  const cumulative = cumulativeClosedDistances(clean);
  const perimeter = cumulative[cumulative.length - 1] ?? 0;
  if (perimeter <= 0) return clean;
  const radius = sigmaM * 3;
  return clean.map((point, i) => {
    const baseD = cumulative[i]!;
    let wx = 0;
    let wy = 0;
    let wt = 0;
    for (let j = 0; j < clean.length; j++) {
      const d = circularArcDistance(baseD, cumulative[j]!, perimeter);
      if (d > radius) continue;
      const w = Math.exp(-(d * d) / (2 * sigmaM * sigmaM));
      wx += clean[j]!.x * w;
      wy += clean[j]!.y * w;
      wt += w;
    }
    return wt > 0 ? { x: wx / wt, y: wy / wt } : point;
  });
}

function openRing(ring: RingM): RingM {
  if (ring.length < 2) return ring;
  const first = ring[0]!;
  const last = ring[ring.length - 1]!;
  if (first.x === last.x && first.y === last.y) return ring.slice(0, -1);
  return ring;
}

function closedRingLength(ring: RingM): number {
  let length = 0;
  for (let i = 0; i < ring.length; i++) length += distanceM(ring[i]!, ring[(i + 1) % ring.length]!);
  return length;
}

function cumulativeClosedDistances(ring: RingM): number[] {
  const cumulative = [0];
  for (let i = 1; i < ring.length; i++) {
    cumulative.push(cumulative[i - 1]! + distanceM(ring[i - 1]!, ring[i]!));
  }
  cumulative.push(cumulative[cumulative.length - 1]! + distanceM(ring[ring.length - 1]!, ring[0]!));
  return cumulative;
}

function pointAtClosedRingDistance(ring: RingM, distance: number): PointM {
  let remaining = distance;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    const segLen = distanceM(a, b);
    if (remaining <= segLen || i === ring.length - 1) {
      const t = segLen > 0 ? remaining / segLen : 0;
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
      };
    }
    remaining -= segLen;
  }
  return ring[0]!;
}

function simplifyOpenLine(points: RingM, toleranceM: number): RingM {
  if (points.length <= 2) return points;
  let maxDistance = -1;
  let splitIndex = -1;
  const first = points[0]!;
  const last = points[points.length - 1]!;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i]!, first, last);
    if (d > maxDistance) {
      maxDistance = d;
      splitIndex = i;
    }
  }
  if (maxDistance <= toleranceM || splitIndex < 0) return [first, last];
  const left = simplifyOpenLine(points.slice(0, splitIndex + 1), toleranceM);
  const right = simplifyOpenLine(points.slice(splitIndex), toleranceM);
  return [...left.slice(0, -1), ...right];
}

function farthestPairIndices(ring: RingM): [number, number] {
  let bestI = 0;
  let bestJ = 0;
  let bestD = -1;
  for (let i = 0; i < ring.length; i++) {
    for (let j = i + 1; j < ring.length; j++) {
      const d = distanceM(ring[i]!, ring[j]!);
      if (d > bestD) {
        bestD = d;
        bestI = i;
        bestJ = j;
      }
    }
  }
  return [bestI, bestJ];
}

function ringPathInclusive(ring: RingM, from: number, to: number): RingM {
  const out: RingM = [];
  let i = from;
  for (;;) {
    out.push(ring[i]!);
    if (i === to) break;
    i = (i + 1) % ring.length;
    if (out.length > ring.length + 1) break;
  }
  return out;
}

function removeAdjacentDuplicates(ring: RingM): RingM {
  const out: RingM = [];
  for (const point of ring) {
    const prev = out[out.length - 1];
    if (prev && prev.x === point.x && prev.y === point.y) continue;
    out.push(point);
  }
  if (out.length > 1) {
    const first = out[0]!;
    const last = out[out.length - 1]!;
    if (first.x === last.x && first.y === last.y) out.pop();
  }
  return out;
}

function perpendicularDistance(point: PointM, lineA: PointM, lineB: PointM): number {
  const dx = lineB.x - lineA.x;
  const dy = lineB.y - lineA.y;
  const denom = Math.hypot(dx, dy);
  if (denom === 0) return distanceM(point, lineA);
  return Math.abs(dy * point.x - dx * point.y + lineB.x * lineA.y - lineB.y * lineA.x) / denom;
}

function circularArcDistance(a: number, b: number, perimeter: number): number {
  const direct = Math.abs(a - b);
  return Math.min(direct, perimeter - direct);
}
