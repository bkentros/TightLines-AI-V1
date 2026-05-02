import type { PointM, PolygonM, RingM, WaterReaderLakeMetrics } from './contracts';

export function ringSignedAreaM(ring: RingM): number {
  if (ring.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    sum += a.x * b.y - b.x * a.y;
  }
  return sum / 2;
}

export function polygonAreaM(polygon: PolygonM): number {
  const exteriorArea = Math.abs(ringSignedAreaM(polygon.exterior));
  const holesArea = polygon.holes.reduce((sum, hole) => sum + Math.abs(ringSignedAreaM(hole)), 0);
  return Math.max(0, exteriorArea - holesArea);
}

export function ringLengthM(ring: RingM): number {
  if (ring.length < 2) return 0;
  let length = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    length += distanceM(a, b);
  }
  return length;
}

export function longestStraightLineDimensionM(ring: RingM): number {
  let longest = 0;
  for (let i = 0; i < ring.length; i++) {
    for (let j = i + 1; j < ring.length; j++) {
      longest = Math.max(longest, distanceM(ring[i]!, ring[j]!));
    }
  }
  return longest;
}

export function bboxM(ring: RingM): WaterReaderLakeMetrics['bboxM'] {
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
  if (minX === Infinity) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }
  return { minX, minY, maxX, maxY };
}

export function computeLakeMetrics(params: {
  polygon: PolygonM;
  componentCount: number;
}): WaterReaderLakeMetrics {
  const areaSqM = polygonAreaM(params.polygon);
  const perimeterM = ringLengthM(params.polygon.exterior);
  const longestDimensionM = longestStraightLineDimensionM(params.polygon.exterior);
  return {
    areaSqM,
    perimeterM,
    longestDimensionM,
    averageLakeWidthM: longestDimensionM > 0 ? areaSqM / longestDimensionM : 0,
    bboxM: bboxM(params.polygon.exterior),
    componentCount: params.componentCount,
    holeCount: params.polygon.holes.length,
  };
}

export function distanceM(a: PointM, b: PointM): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
