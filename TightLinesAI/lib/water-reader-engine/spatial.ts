import type { PointM, RingM } from './contracts';

type Segment = {
  a: PointM;
  b: PointM;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export function squaredDistanceM(a: PointM, b: PointM): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function distancePointToSegmentM(point: PointM, a: PointM, b: PointM): number {
  return Math.sqrt(squaredDistancePointToSegmentM(point, a, b));
}

export function squaredDistancePointToSegmentM(point: PointM, a: PointM, b: PointM): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return squaredDistanceM(point, a);
  const t = clamp01(((point.x - a.x) * dx + (point.y - a.y) * dy) / len2);
  const x = a.x + dx * t;
  const y = a.y + dy * t;
  const px = point.x - x;
  const py = point.y - y;
  return px * px + py * py;
}

export function nearestPointOnSegmentM(point: PointM, a: PointM, b: PointM): PointM {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return a;
  const t = clamp01(((point.x - a.x) * dx + (point.y - a.y) * dy) / len2);
  return { x: a.x + dx * t, y: a.y + dy * t };
}

export function longestDistanceByHullM(ring: RingM): number {
  const pair = farthestPairIndicesByHull(ring);
  if (!pair) return 0;
  return Math.sqrt(pair.distanceSq);
}

export function farthestPairIndicesByHull(ring: RingM): { aIndex: number; bIndex: number; distanceSq: number } | null {
  const indexed = uniqueIndexedPoints(ring);
  if (indexed.length === 0) return null;
  if (indexed.length === 1) return { aIndex: indexed[0]!.index, bIndex: indexed[0]!.index, distanceSq: 0 };
  const hull = convexHullIndexed(indexed);
  if (hull.length === 1) return { aIndex: hull[0]!.index, bIndex: hull[0]!.index, distanceSq: 0 };
  if (hull.length === 2) {
    return {
      aIndex: hull[0]!.index,
      bIndex: hull[1]!.index,
      distanceSq: squaredDistanceM(hull[0]!.point, hull[1]!.point),
    };
  }
  return rotatingCalipersDiameter(hull);
}

export class RingSpatialIndex {
  private readonly ring: RingM;
  private readonly segments: Segment[];
  private readonly bins: Segment[][];
  private readonly grid = new Map<string, Segment[]>();
  private readonly minX: number;
  private readonly minY: number;
  private readonly maxX: number;
  private readonly maxY: number;
  private readonly binSizeY: number;
  private readonly gridCellSize: number;

  constructor(ring: RingM) {
    this.ring = openRing(ring);
    const bounds = ringBounds(this.ring);
    this.minX = bounds.minX;
    this.minY = bounds.minY;
    this.maxX = bounds.maxX;
    this.maxY = bounds.maxY;
    this.segments = buildSegments(this.ring);
    const binCount = Math.max(8, Math.min(512, Math.ceil(Math.sqrt(Math.max(1, this.segments.length)) * 2)));
    this.binSizeY = Math.max(1, (this.maxY - this.minY) / binCount);
    this.bins = Array.from({ length: binCount }, () => []);
    for (const segment of this.segments) {
      const minBin = this.yBin(segment.minY);
      const maxBin = this.yBin(segment.maxY);
      for (let bin = minBin; bin <= maxBin; bin++) this.bins[bin]!.push(segment);
    }
    const diagonal = Math.hypot(this.maxX - this.minX, this.maxY - this.minY);
    this.gridCellSize = Math.max(8, diagonal / Math.max(16, Math.sqrt(Math.max(1, this.segments.length))));
    for (const segment of this.segments) {
      const minIx = this.gridX(segment.minX);
      const maxIx = this.gridX(segment.maxX);
      const minIy = this.gridY(segment.minY);
      const maxIy = this.gridY(segment.maxY);
      for (let ix = minIx; ix <= maxIx; ix++) {
        for (let iy = minIy; iy <= maxIy; iy++) {
          const key = `${ix}:${iy}`;
          const bucket = this.grid.get(key);
          if (bucket) bucket.push(segment);
          else this.grid.set(key, [segment]);
        }
      }
    }
  }

  contains(point: PointM): boolean {
    if (this.ring.length < 3) return false;
    if (point.x < this.minX || point.x > this.maxX || point.y < this.minY || point.y > this.maxY) return false;
    let inside = false;
    for (const segment of this.bins[this.yBin(point.y)] ?? []) {
      const a = segment.a;
      const b = segment.b;
      const crosses = (a.y > point.y) !== (b.y > point.y);
      if (!crosses) continue;
      const xAtY = ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y || 1e-12) + a.x;
      if (point.x < xAtY) inside = !inside;
    }
    return inside;
  }

  distanceToBoundary(point: PointM): number {
    return Math.sqrt(this.nearestSegment(point).distanceSq);
  }

  nearestPoint(point: PointM): PointM {
    const nearest = this.nearestSegment(point);
    return nearestPointOnSegmentM(point, nearest.segment.a, nearest.segment.b);
  }

  private nearestSegment(point: PointM): { segment: Segment; distanceSq: number } {
    if (this.segments.length === 0) return { segment: zeroSegment(point), distanceSq: 0 };
    const ix = this.gridX(point.x);
    const iy = this.gridY(point.y);
    let best: Segment | null = null;
    let bestSq = Infinity;
    const seen = new Set<Segment>();
    const maxRadius = Math.max(4, Math.ceil(Math.sqrt(this.grid.size || 1)) + 2);
    for (let radius = 0; radius <= maxRadius; radius++) {
      for (let gx = ix - radius; gx <= ix + radius; gx++) {
        for (let gy = iy - radius; gy <= iy + radius; gy++) {
          if (radius > 0 && gx > ix - radius && gx < ix + radius && gy > iy - radius && gy < iy + radius) continue;
          for (const segment of this.grid.get(`${gx}:${gy}`) ?? []) {
            if (seen.has(segment)) continue;
            seen.add(segment);
            const d = squaredDistancePointToSegmentM(point, segment.a, segment.b);
            if (d < bestSq) {
              bestSq = d;
              best = segment;
            }
          }
        }
      }
      if (best && Math.sqrt(bestSq) <= radius * this.gridCellSize) {
        return { segment: best, distanceSq: bestSq };
      }
    }
    for (const segment of this.segments) {
      if (seen.has(segment)) continue;
      const d = squaredDistancePointToSegmentM(point, segment.a, segment.b);
      if (d < bestSq) {
        bestSq = d;
        best = segment;
      }
    }
    return { segment: best ?? this.segments[0]!, distanceSq: bestSq };
  }

  private yBin(y: number): number {
    if (this.bins.length <= 1) return 0;
    return Math.max(0, Math.min(this.bins.length - 1, Math.floor((y - this.minY) / this.binSizeY)));
  }

  private gridX(x: number): number {
    return Math.floor((x - this.minX) / this.gridCellSize);
  }

  private gridY(y: number): number {
    return Math.floor((y - this.minY) / this.gridCellSize);
  }
}

export class MultiRingSpatialIndex {
  private readonly rings: RingSpatialIndex[];

  constructor(rings: RingM[]) {
    this.rings = rings.map((ring) => new RingSpatialIndex(ring));
  }

  distanceToBoundary(point: PointM): number {
    let best = Infinity;
    for (const ring of this.rings) best = Math.min(best, ring.distanceToBoundary(point));
    return best === Infinity ? 0 : best;
  }
}

function uniqueIndexedPoints(ring: RingM): Array<{ point: PointM; index: number }> {
  const out: Array<{ point: PointM; index: number }> = [];
  const seen = new Set<string>();
  for (let index = 0; index < ring.length; index++) {
    const point = ring[index]!;
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
    const key = `${point.x}:${point.y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ point, index });
  }
  return out;
}

function convexHullIndexed(points: Array<{ point: PointM; index: number }>): Array<{ point: PointM; index: number }> {
  const sorted = [...points].sort(
    (a, b) => a.point.x - b.point.x || a.point.y - b.point.y || a.index - b.index,
  );
  const lower: Array<{ point: PointM; index: number }> = [];
  for (const item of sorted) {
    while (lower.length >= 2 && cross(last2(lower).point, last1(lower).point, item.point) <= 0) lower.pop();
    lower.push(item);
  }
  const upper: Array<{ point: PointM; index: number }> = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const item = sorted[i]!;
    while (upper.length >= 2 && cross(last2(upper).point, last1(upper).point, item.point) <= 0) upper.pop();
    upper.push(item);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

function rotatingCalipersDiameter(hull: Array<{ point: PointM; index: number }>): { aIndex: number; bIndex: number; distanceSq: number } {
  const n = hull.length;
  let j = 1;
  let best = {
    aIndex: hull[0]!.index,
    bIndex: hull[1]!.index,
    distanceSq: squaredDistanceM(hull[0]!.point, hull[1]!.point),
  };
  for (let i = 0; i < n; i++) {
    const nextI = (i + 1) % n;
    while (triangleArea2(hull[i]!.point, hull[nextI]!.point, hull[(j + 1) % n]!.point) > triangleArea2(hull[i]!.point, hull[nextI]!.point, hull[j]!.point)) {
      j = (j + 1) % n;
    }
    best = maxPair(best, hull[i]!, hull[j]!);
    best = maxPair(best, hull[nextI]!, hull[j]!);
  }
  return best;
}

function maxPair(
  best: { aIndex: number; bIndex: number; distanceSq: number },
  a: { point: PointM; index: number },
  b: { point: PointM; index: number },
) {
  const d = squaredDistanceM(a.point, b.point);
  if (d <= best.distanceSq) return best;
  return { aIndex: a.index, bIndex: b.index, distanceSq: d };
}

function buildSegments(ring: RingM): Segment[] {
  const out: Segment[] = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    out.push({
      a,
      b,
      minX: Math.min(a.x, b.x),
      minY: Math.min(a.y, b.y),
      maxX: Math.max(a.x, b.x),
      maxY: Math.max(a.y, b.y),
    });
  }
  return out;
}

function ringBounds(ring: RingM): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of ring) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  if (minX === Infinity) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  return { minX, minY, maxX, maxY };
}

function openRing(ring: RingM): RingM {
  if (ring.length < 2) return ring;
  const first = ring[0]!;
  const last = ring[ring.length - 1]!;
  if (first.x === last.x && first.y === last.y) return ring.slice(0, -1);
  return ring;
}

function zeroSegment(point: PointM): Segment {
  return { a: point, b: point, minX: point.x, minY: point.y, maxX: point.x, maxY: point.y };
}

function triangleArea2(a: PointM, b: PointM, c: PointM): number {
  return Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
}

function cross(a: PointM, b: PointM, c: PointM): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function last1<T>(items: T[]): T {
  return items[items.length - 1]!;
}

function last2<T>(items: T[]): T {
  return items[items.length - 2]!;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
