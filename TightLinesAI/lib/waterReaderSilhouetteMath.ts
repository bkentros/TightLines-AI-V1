/**
 * Shared WGS84 → SVG silhouette transform for Water Reader lake vector UI.
 * Must stay aligned with `LakePolygonSilhouette` framing.
 */
import type { WaterbodyPolygonGeoJson } from './waterReaderContracts';

export const LAKE_SILHOUETTE = {
  CANVAS_H: 352,
  PAD: 11,
  STROKE_INSET: 3,
} as const;

function isNestedNumberArray(x: unknown, depth: number): boolean {
  if (depth === 0) return typeof x === 'number' && Number.isFinite(x);
  return Array.isArray(x) && x.length > 0 && isNestedNumberArray(x[0], depth - 1);
}

export function ringsFromGeoJson(g: WaterbodyPolygonGeoJson): number[][][] {
  const { type, coordinates: coords } = g;
  const rings: number[][][] = [];
  if (type === 'Polygon' && Array.isArray(coords)) {
    for (const ring of coords) {
      if (Array.isArray(ring) && ring.length >= 3 && isNestedNumberArray(ring, 2)) {
        rings.push(ring as number[][]);
      }
    }
  } else if (type === 'MultiPolygon' && Array.isArray(coords)) {
    for (const polygon of coords) {
      if (!Array.isArray(polygon)) continue;
      for (const ring of polygon) {
        if (Array.isArray(ring) && ring.length >= 3 && isNestedNumberArray(ring, 2)) {
          rings.push(ring as number[][]);
        }
      }
    }
  }
  return rings;
}

function ringBounds(ring: number[][]): { minLon: number; maxLon: number; minLat: number; maxLat: number } | null {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const pt of ring) {
    if (!Array.isArray(pt) || pt.length < 2) continue;
    const lon = pt[0];
    const lat = pt[1];
    if (typeof lon !== 'number' || typeof lat !== 'number' || !Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  if (minLon === Infinity) return null;
  return { minLon, maxLon, minLat, maxLat };
}

export function bboxFromRings(rings: number[][][]): {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
} | null {
  let b: ReturnType<typeof ringBounds> = null;
  for (const ring of rings) {
    const rb = ringBounds(ring);
    if (!rb) continue;
    if (!b) b = { ...rb };
    else {
      b.minLon = Math.min(b.minLon, rb.minLon);
      b.maxLon = Math.max(b.maxLon, rb.maxLon);
      b.minLat = Math.min(b.minLat, rb.minLat);
      b.maxLat = Math.max(b.maxLat, rb.maxLat);
    }
  }
  return b;
}

export function ringToSubpath(
  ring: number[][],
  minLon: number,
  maxLat: number,
  scale: number,
  originX: number,
  originY: number,
): string {
  const pts: [number, number][] = [];
  for (const pt of ring) {
    if (!Array.isArray(pt) || pt.length < 2) continue;
    const lon = pt[0];
    const lat = pt[1];
    if (typeof lon !== 'number' || typeof lat !== 'number' || !Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    const x = originX + (lon - minLon) * scale;
    const y = originY + (maxLat - lat) * scale;
    pts.push([x, y]);
  }
  if (pts.length < 3) return '';
  const [x0, y0] = pts[0]!;
  let d = `M ${x0} ${y0}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i]!;
    d += ` L ${x} ${y}`;
  }
  d += ' Z';
  return d;
}

export interface SilhouetteTransform {
  minLon: number;
  maxLat: number;
  scale: number;
  originX: number;
  originY: number;
  width: number;
}

export function computeSilhouetteTransform(
  geojson: WaterbodyPolygonGeoJson,
  width: number,
): SilhouetteTransform | null {
  if (width <= 0) return null;
  const { CANVAS_H, PAD, STROKE_INSET } = LAKE_SILHOUETTE;
  const rings = ringsFromGeoJson(geojson);
  if (rings.length === 0) return null;
  const bbox = bboxFromRings(rings);
  if (!bbox) return null;
  const { minLon, maxLon, minLat, maxLat } = bbox;
  const lonSpan = Math.max(maxLon - minLon, 1e-9);
  const latSpan = Math.max(maxLat - minLat, 1e-9);
  const innerW = width - 2 * PAD - 2 * STROKE_INSET;
  const innerH = CANVAS_H - 2 * PAD - 2 * STROKE_INSET;
  if (innerW <= 0 || innerH <= 0) return null;
  const scale = Math.min(innerW / lonSpan, innerH / latSpan);
  const drawW = lonSpan * scale;
  const drawH = latSpan * scale;
  const originX = PAD + STROKE_INSET + (innerW - drawW) / 2;
  const originY = PAD + STROKE_INSET + (innerH - drawH) / 2;
  return { minLon, maxLat, scale, originX, originY, width };
}

export function projectLonLatToSilhouetteSvg(
  lon: number,
  lat: number,
  t: SilhouetteTransform,
): { x: number; y: number } {
  const x = t.originX + (lon - t.minLon) * t.scale;
  const y = t.originY + (t.maxLat - lat) * t.scale;
  return { x, y };
}

function openRingLonLat(ring: number[][]): number[][] {
  const r = ring.filter(
    (p) => Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number',
  ) as number[][];
  if (r.length < 3) return r;
  const a = r[0];
  const b = r[r.length - 1];
  if (a && b && a[0] === b[0] && a[1] === b[1]) return r.slice(0, -1);
  return r;
}

function signedRingAreaLonLat(ring: number[][]): number {
  const r = openRingLonLat(ring);
  if (r.length < 3) return 0;
  let s = 0;
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length;
    s += r[i]![0] * r[j]![1] - r[j]![0] * r[i]![1];
  }
  return s / 2;
}

/** GeoJSON primary polygon: largest exterior by abs area; interior rings are holes (islands/cutouts). */
export function primaryPolygonExteriorAndHoles(g: WaterbodyPolygonGeoJson): {
  exterior: number[][];
  holes: number[][][];
} | null {
  const { type, coordinates: coords } = g;
  const validRing = (ring: unknown): ring is number[][] =>
    Array.isArray(ring) && ring.length >= 3 && isNestedNumberArray(ring, 2);

  if (type === 'Polygon' && Array.isArray(coords) && coords.length > 0) {
    const ex = coords[0];
    if (!validRing(ex)) return null;
    const holes: number[][][] = [];
    for (let i = 1; i < coords.length; i++) {
      const h = coords[i];
      if (validRing(h)) holes.push(h as number[][]);
    }
    return { exterior: ex as number[][], holes };
  }

  if (type === 'MultiPolygon' && Array.isArray(coords)) {
    let bestEx: number[][] | null = null;
    let bestHoles: number[][][] = [];
    let bestA = -1;
    for (const poly of coords) {
      if (!Array.isArray(poly) || poly.length === 0) continue;
      const ex = poly[0];
      if (!validRing(ex)) continue;
      const a = Math.abs(signedRingAreaLonLat(ex as number[][]));
      if (a > bestA) {
        bestA = a;
        bestEx = ex as number[][];
        const holes: number[][][] = [];
        for (let i = 1; i < poly.length; i++) {
          const h = poly[i];
          if (validRing(h)) holes.push(h as number[][]);
        }
        bestHoles = holes;
      }
    }
    if (!bestEx) return null;
    return { exterior: bestEx, holes: bestHoles };
  }

  return null;
}

/** True when (lon,lat) lies in the exterior ring but not inside any hole ring. */
export function pointInPrimaryWater(lon: number, lat: number, exterior: number[][], holes: number[][][]): boolean {
  if (!pointInRingBoundary(lon, lat, exterior)) return false;
  for (const h of holes) {
    if (pointInRingBoundary(lon, lat, h)) return false;
  }
  return true;
}

function pointInRingBoundary(lon: number, lat: number, ring: number[][]): boolean {
  const r = openRingLonLat(ring);
  let inside = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const xi = r[i]![0];
    const yi = r[i]![1];
    const xj = r[j]![0];
    const yj = r[j]![1];
    const denom = yj - yi;
    const intersect =
      yi !== yj &&
      ((yi > lat) !== (yj > lat)) &&
      lon < ((xj - xi) * (lat - yi)) / (denom === 0 ? 1e-12 : denom) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
