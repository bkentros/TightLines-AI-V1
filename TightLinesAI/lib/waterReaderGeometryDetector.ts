/**
 * Prototype polygon-only shoreline cue detector (V1). Pure client, hydrography GeoJSON in → candidates out.
 * Not fishing advice; geometry-derived labels only.
 */
import type {
  WaterbodyPolygonGeoJson,
  WaterReaderGeometryCandidate,
  WaterReaderGeometryFeatureClass,
  WaterReaderDisplayPatch,
} from './waterReaderContracts';
import { zoneColorsForRank } from './waterReaderZonePalette';
import {
  bboxFromRings,
  primaryPolygonExteriorAndHoles,
  pointInPrimaryWater,
  ringsFromGeoJson,
} from './waterReaderSilhouetteMath';

/** Layout greedily picks up to 5 non-overlapping zones from this reservoir (typical target 4). */
const MAX_POOL_CANDIDATES = 18;
/** Prefer keeping the post-separation reservoir near this size when geometry allows (floor trim may relax). */
const TARGET_POOL_AFTER_TRIM = 14;
const MIN_CANDIDATES_TARGET = 3;
const MAX_SAMPLE = 360;
/** Ring arc sectors for geographic diversity (merge per-sector best cues into pool). */
const RING_SECTOR_COUNT = 16;
const MIN_SEP_FRAC = 0.055;
const PEAK_ANGLE_POINT = 0.43;
const PEAK_ANGLE_BEND = 0.3;
const POCKET_EDGE_TURN = -0.74;
const BEND_CONCAVE_TURN = -0.46;
const LONG_BANK_MAX_TURN = 0.12;
const LONG_BANK_MIN_LEN = 10;
const NUDGE_T = 0.14;

/** First-pass neckdown: hide shoreline picks near this subsample arc from neck cue. */
const NECK_SHORE_EXCLUSION_FRAC = 0.052;

const CLASS_BUDGET: Partial<Record<WaterReaderGeometryFeatureClass, number>> = {
  shoreline_point: 6,
  shoreline_bend: 5,
  pocket_edge: 4,
  long_bank: 2,
  neckdown: 1,
};

type NeckdownMetrics = {
  relDiag: number;
  relMinSide: number;
  lobeContrast: number;
  pinchToMedian: number;
};

function median(nums: number[]): number {
  if (nums.length === 0) return NaN;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

type RawCand = {
  idx: number;
  turn: number;
  lon: number;
  lat: number;
  cls: WaterReaderGeometryFeatureClass;
  score: number;
  neckRingI?: number;
  neckRingJ?: number;
  neckMetrics?: NeckdownMetrics;
};

function openRing(ring: number[][]): number[][] {
  const r = ring.filter(
    (p) => Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number',
  ) as number[][];
  if (r.length < 3) return r;
  const a = r[0];
  const b = r[r.length - 1];
  if (a && b && a[0] === b[0] && a[1] === b[1]) return r.slice(0, -1);
  return r;
}

function ringCentroidLonLat(ring: number[][]): [number, number] {
  const r = openRing(ring);
  if (r.length < 3) return r[0] ? [r[0][0], r[0][1]] : [0, 0];
  let sx = 0;
  let sy = 0;
  for (const p of r) {
    sx += p[0];
    sy += p[1];
  }
  return [sx / r.length, sy / r.length];
}

function nudgeInside(
  lon: number,
  lat: number,
  exterior: number[][],
  holes: number[][][],
  cLon: number,
  cLat: number,
): { lon: number; lat: number; qaFlags: string[] } {
  const flags: string[] = [];
  if (pointInPrimaryWater(lon, lat, exterior, holes)) return { lon, lat, qaFlags: flags };
  let lon2 = lon * (1 - NUDGE_T) + cLon * NUDGE_T;
  let lat2 = lat * (1 - NUDGE_T) + cLat * NUDGE_T;
  flags.push('nudged_toward_centroid');
  if (!pointInPrimaryWater(lon2, lat2, exterior, holes)) {
    lon2 = cLon * 0.97 + lon * 0.03;
    lat2 = cLat * 0.97 + lat * 0.03;
    flags.push('fallback_near_centroid');
  }
  return { lon: lon2, lat: lat2, qaFlags: flags };
}

function patchDegSizes(
  cls: WaterReaderGeometryFeatureClass,
  lonSpan: number,
  latSpan: number,
): { along: number; inward: number } {
  const major = Math.max(lonSpan, latSpan, 1e-9);
  const u = major * 0.025;
  switch (cls) {
    case 'shoreline_point':
      return { along: u * 0.72, inward: u * 0.52 };
    case 'shoreline_bend':
      return { along: u * 1.02, inward: u * 0.5 };
    case 'long_bank':
      return { along: u * 1.52, inward: u * 0.34 };
    case 'pocket_edge':
      return { along: u * 0.86, inward: u * 0.58 };
    case 'neckdown':
      return { along: u * 0.88, inward: u * 0.34 };
    default:
      return { along: u * 0.75, inward: u * 0.34 };
  }
}

/**
 * Keep numeric caps aligned with `waterReaderLakeZoneLayout` ribbon arc limits
 * (RIBBON_ARC_ABS_MAX_VERTS, RIBBON_ARC_MAX_VERTEX_FRAC).
 */
const RIBBON_ARC_LAYOUT_ABS_CAP = 22;
const RIBBON_ARC_LAYOUT_VERTEX_FRAC = 0.054;

function layoutRibbonArcVertexCap(nRing: number): number {
  return Math.min(
    RIBBON_ARC_LAYOUT_ABS_CAP,
    Math.max(6, Math.ceil(nRing * RIBBON_ARC_LAYOUT_VERTEX_FRAC)),
  );
}

/** Max half-span (full-ring steps) so 2*halfSpan+1 stays within layout arc vertex cap. */
function maxRibbonHalfSpanForLayout(nRing: number): number {
  const cap = layoutRibbonArcVertexCap(nRing);
  return Math.max(1, Math.floor((cap - 1) / 2));
}

/**
 * Full-ring half-span (vertices each side of center) for ribbon sampling.
 * Class-tuned; capped to layout arc budget; slightly shortened on subsampled rings (jagged polygons).
 */
function ribbonHalfSpan(
  cls: WaterReaderGeometryFeatureClass,
  nRing: number,
  subsampleSize: number,
): number {
  const maxH = maxRibbonHalfSpanForLayout(nRing);
  const strideApprox = nRing / Math.max(1, subsampleSize);
  const densitySkew = strideApprox > 1.2 ? Math.min(1, 0.88 / Math.sqrt(strideApprox)) : 1;

  const frac =
    cls === 'long_bank'
      ? 0.021
      : cls === 'shoreline_bend'
        ? 0.013
        : cls === 'pocket_edge'
          ? 0.008
          : cls === 'shoreline_point'
            ? 0.0065
            : 0.0065;

  const minH =
    cls === 'long_bank' ? 5 : cls === 'shoreline_bend' ? 4 : cls === 'pocket_edge' ? 3 : 3;

  const raw = Math.floor(nRing * frac * densitySkew);
  return Math.min(maxH, Math.max(minH, raw));
}

function shorelineRibbonDiagnostic(
  cls: WaterReaderGeometryFeatureClass,
  score: number,
  halfSpan: number,
): string {
  const arcVerts = 2 * halfSpan + 1;
  return `${cls} s=${score.toFixed(2)} arc=${arcVerts} h=${halfSpan}`;
}

function shorePatchFrame(
  r: number[][],
  idxs: number[],
  subsampleI: number,
  lat0: number,
  cLon: number,
  cLat: number,
): Omit<WaterReaderDisplayPatch, 'patchAlongDeg' | 'patchInwardDeg'> {
  const ri = idxs[subsampleI]!;
  const shore = r[ri]!;
  const nm = r[(ri - 1 + r.length) % r.length]!;
  const np = r[(ri + 1) % r.length]!;
  const cosLat0 = Math.cos((lat0 * Math.PI) / 180);
  const sx = shore[0]! * cosLat0;
  const sy = shore[1]!;
  const tx = np[0]! * cosLat0 - nm[0]! * cosLat0;
  const ty = np[1]! - nm[1]!;
  let tlen = Math.hypot(tx, ty) || 1e-12;
  let ux = tx / tlen;
  let uy = ty / tlen;
  const cx = cLon * cosLat0;
  const cy = cLat;
  let nx = cx - sx;
  let ny = cy - sy;
  let nlen = Math.hypot(nx, ny) || 1e-12;
  nx /= nlen;
  ny /= nlen;
  let pxh = -uy;
  let pyh = ux;
  if (pxh * nx + pyh * ny < 0) {
    pxh = uy;
    pyh = -ux;
  }
  const alongDLon = ux / cosLat0;
  const alongDLat = uy;
  const alen = Math.hypot(alongDLon * cosLat0, alongDLat) || 1e-12;
  const inwardDLon = pxh / cosLat0;
  const inwardDLat = pyh;
  const ilen = Math.hypot(inwardDLon * cosLat0, inwardDLat) || 1e-12;

  return {
    shoreLon: shore[0]!,
    shoreLat: shore[1]!,
    alongDLon: alongDLon / alen,
    alongDLat: alongDLat / alen,
    inwardDLon: inwardDLon / ilen,
    inwardDLat: inwardDLat / ilen,
  };
}

function buildNeckdownDisplayPatch(
  r: number[][],
  i: number,
  j: number,
  lat0: number,
  cLon: number,
  cLat: number,
  lonSpan: number,
  latSpan: number,
): WaterReaderDisplayPatch {
  const cosL = Math.cos((lat0 * Math.PI) / 180);
  const pi = r[i]!;
  const pj = r[j]!;
  let bx = (pj[0]! - pi[0]!) * cosL;
  let by = pj[1]! - pi[1]!;
  const blen = Math.hypot(bx, by) || 1e-9;
  bx /= blen;
  by /= blen;
  const alongDLon = bx / cosL;
  const alongDLat = by;
  const mx = ((pi[0]! + pj[0]!) / 2) * cosL;
  const my = (pi[1]! + pj[1]!) / 2;
  let nx = cLon * cosL - mx;
  let ny = cLat - my;
  const nlen = Math.hypot(nx, ny) || 1e-9;
  nx /= nlen;
  ny /= nlen;
  let ix = -by;
  let iy = bx;
  if (ix * nx + iy * ny < 0) {
    ix = by;
    iy = -bx;
  }
  const inwardDLon = ix / cosL;
  const inwardDLat = iy;
  const ilen2 = Math.hypot(inwardDLon * cosL, inwardDLat) || 1e-12;
  const alen2 = Math.hypot(alongDLon * cosL, alongDLat) || 1e-12;
  const sizes = patchDegSizes('neckdown', lonSpan, latSpan);
  return {
    shoreLon: (pi[0]! + pj[0]!) / 2,
    shoreLat: (pi[1]! + pj[1]!) / 2,
    alongDLon: alongDLon / alen2,
    alongDLat: alongDLat / alen2,
    inwardDLon: inwardDLon / ilen2,
    inwardDLat: inwardDLat / ilen2,
    patchAlongDeg: sizes.along,
    patchInwardDeg: sizes.inward,
  };
}

function findNeckdownPair(
  r: number[][],
  lat0: number,
  bbox: { minLon: number; maxLon: number; minLat: number; maxLat: number },
): { i: number; j: number; metrics: NeckdownMetrics } | null {
  const n = r.length;
  if (n < 40) return null;
  const cosL = Math.cos((lat0 * Math.PI) / 180);
  const dXY = (a: number[], b: number[]) =>
    Math.hypot((a[0]! - b[0]!) * cosL, a[1]! - b[1]!);
  const lonSpan = (bbox.maxLon - bbox.minLon) * cosL;
  const latSpan = bbox.maxLat - bbox.minLat;
  const minSide = Math.min(lonSpan, latSpan) || 1e-9;
  const diag = Math.hypot(lonSpan, latSpan) || 1e-9;
  const W = Math.max(5, Math.floor(n / 11));
  const phaseFracs = [0.46, 0.48, 0.5, 0.52, 0.54];
  let bestI = 0;
  let bestJ = Math.floor(n / 2);
  let best = Infinity;
  for (const pf of phaseFracs) {
    const halfPhase = Math.max(8, Math.floor(n * pf));
    for (let i = 0; i < n; i++) {
      for (let w = -W; w <= W; w++) {
        const j = (i + halfPhase + w + n * 20) % n;
        const d = dXY(r[i]!, r[j]!);
        if (d < best) {
          best = d;
          bestI = i;
          bestJ = j;
        }
      }
    }
  }
  const relDiag = best / diag;
  if (relDiag > 0.22) return null;
  if (best < diag * 0.00085) return null;

  const halfOpp = Math.floor(n * 0.5);
  const stride = Math.max(1, Math.floor(n / 56));
  const samples: number[] = [];
  for (let i = 0; i < n; i += stride) {
    let local = Infinity;
    for (let w = -W; w <= W; w++) {
      const j = (i + halfOpp + w + n * 20) % n;
      const d = dXY(r[i]!, r[j]!);
      if (d < local) local = d;
    }
    samples.push(local);
  }
  const medS = median(samples);
  const maxS = samples.length > 0 ? Math.max(...samples) : NaN;
  if (!Number.isFinite(medS) || medS < 1e-12 || !Number.isFinite(maxS)) return null;

  const lobeContrast = maxS / best;
  const pinchToMedian = best / medS;
  const relMinSide = best / minSide;

  /** Long skinny footprints: far opposing samples inflate maxS; require a truly tight pinch vs diagonal. */
  const maxSpan = Math.max(lonSpan, latSpan);
  const minSpanE = Math.min(lonSpan, latSpan) || 1e-9;
  const slenderness = maxSpan / minSpanE;
  if (slenderness > 4.12 && relDiag > 0.044) return null;

  /** Long skinny lakes: opposing span stays ~uniform; twin basins: pinch much narrower than typical span and lobes. */
  if (lobeContrast < 1.52) return null;
  if (pinchToMedian > 0.62) return null;
  if (best >= minSide * 0.74) return null;

  return {
    i: bestI,
    j: bestJ,
    metrics: { relDiag, relMinSide, lobeContrast, pinchToMedian },
  };
}

function nearestSubsampleIndex(idxs: number[], ringI: number, nRing: number): number {
  let bestK = 0;
  let bestD = Infinity;
  for (let k = 0; k < idxs.length; k++) {
    const ri = idxs[k]!;
    const d = Math.min(Math.abs(ri - ringI), nRing - Math.abs(ri - ringI));
    if (d < bestD) {
      bestD = d;
      bestK = k;
    }
  }
  return bestK;
}

function arcSubsampleSep(a: number, b: number, nSub: number): number {
  return Math.min(Math.abs(a - b), nSub - Math.abs(a - b));
}

function toXY(lon: number, lat: number, lat0: number): [number, number] {
  return [lon * Math.cos((lat0 * Math.PI) / 180), lat];
}

function subsampleIndices(n: number, maxPts: number): number[] {
  if (n <= maxPts) return Array.from({ length: n }, (_, i) => i);
  const idx: number[] = [];
  for (let k = 0; k < maxPts; k++) {
    idx.push(Math.min(n - 1, Math.floor((k * n) / maxPts)));
  }
  return idx;
}

function signedTurn(p0: [number, number], p1: [number, number], p2: [number, number]): number {
  const v1x = p1[0] - p0[0];
  const v1y = p1[1] - p0[1];
  const v2x = p2[0] - p1[0];
  const v2y = p2[1] - p1[1];
  const c1 = Math.hypot(v1x, v1y);
  const c2 = Math.hypot(v2x, v2y);
  if (c1 < 1e-12 || c2 < 1e-12) return 0;
  let cos = (v1x * v2x + v1y * v2y) / (c1 * c2);
  cos = Math.max(-1, Math.min(1, cos));
  const cross = v1x * v2y - v1y * v2x;
  const sin = Math.sign(cross) * Math.sqrt(Math.max(0, 1 - cos * cos));
  return Math.atan2(sin, cos);
}

function labelFor(cls: WaterReaderGeometryFeatureClass): string {
  switch (cls) {
    case 'shoreline_point':
      return 'Shoreline point';
    case 'shoreline_bend':
      return 'Shoreline bend';
    case 'long_bank':
      return 'Long bank';
    case 'pocket_edge':
      return 'Pocket edge';
    case 'neckdown':
      return 'Neckdown';
    default:
      return 'Shoreline area';
  }
}

function copyZoneExplanation(cls: WaterReaderGeometryFeatureClass): {
  identifiedBecause: string;
  howToFishIt: string;
} {
  switch (cls) {
    case 'shoreline_point':
      return {
        identifiedBecause: 'The outline juts outward here compared with straighter bank nearby.',
        howToFishIt:
          'Work both sides of the turn; compare angles from outside versus inside — use the shape as a study cue.',
      };
    case 'shoreline_bend':
      return {
        identifiedBecause: 'Noticeable direction change along this bank on the shape.',
        howToFishIt:
          'Move through the bend and compare angles along the curve rather than treating it as one exact point.',
      };
    case 'long_bank':
      return {
        identifiedBecause: 'Longer straight shoreline segment on the polygon.',
        howToFishIt:
          'Use the straight bank as a study cue; work along the stretch and watch for small kinks either way.',
      };
    case 'pocket_edge':
      return {
        identifiedBecause: 'Tight inside corner on the outline (possible pocket lip).',
        howToFishIt:
          'Cover the pocket opening in stages; move through the area and work back out along the wider mouth.',
      };
    case 'neckdown':
      return {
        identifiedBecause:
          'Narrow pinch on the outline with wider shore traced away from it (shape-only).',
        howToFishIt:
          'Work both sides of the pinch and compare how each basin opens — use the outline as a study cue, and move through the area rather than anchoring on one place.',
      };
    default:
      return {
        identifiedBecause: 'Local change in the hydrography outline here.',
        howToFishIt: 'Compare this stretch with the next bank segments as you move along.',
      };
  }
}

function diagnosticLine(c: RawCand): string {
  if (c.cls === 'neckdown' && c.neckMetrics) {
    const m = c.neckMetrics;
    return `neckdown relDiag=${m.relDiag.toFixed(2)} lobeC=${m.lobeContrast.toFixed(1)} pinchMed=${m.pinchToMedian.toFixed(2)}`;
  }
  return `${c.cls} s=${c.score.toFixed(2)}`;
}

function rawCandKey(x: RawCand): string {
  return `${x.idx}:${x.cls}`;
}

/** Best-scoring candidate per (arc sector × class) on the subsampled ring. */
function sectorStratifiedRawCandidates(rawSorted: RawCand[], nSub: number, numSectors: number): RawCand[] {
  if (nSub < 1 || numSectors < 2) return [];
  const best = new Map<string, RawCand>();
  for (const c of rawSorted) {
    const sec = Math.min(numSectors - 1, Math.floor((c.idx * numSectors) / nSub));
    const key = `${sec}:${c.cls}`;
    const prev = best.get(key);
    if (!prev || c.score > prev.score) best.set(key, c);
  }
  return [...best.values()];
}

function mergeUniqueRawCands(primary: RawCand[], extras: RawCand[]): RawCand[] {
  const keys = new Set(primary.map(rawCandKey));
  const out = [...primary];
  for (const c of extras) {
    const k = rawCandKey(c);
    if (keys.has(k)) continue;
    keys.add(k);
    out.push(c);
  }
  return out;
}

function chosenAllSeparated(chosen: RawCand[], minSep: number, nSub: number): boolean {
  for (let i = 0; i < chosen.length; i++) {
    for (let j = i + 1; j < chosen.length; j++) {
      if (arcSubsampleSep(chosen[i]!.idx, chosen[j]!.idx, nSub) < minSep) return false;
    }
  }
  return true;
}

/**
 * When the pool is shoreline_point-heavy, swap one weak point for a bend/long_bank
 * from the merged set if separation still holds (sparse lakes, no global score floor change).
 */
function maybeSwapPointForShapeDiversity(
  chosen: RawCand[],
  merged: RawCand[],
  nSub: number,
  minSep: number,
): void {
  const pts = chosen.filter((c) => c.cls === 'shoreline_point');
  if (pts.length < 2) return;
  if (
    chosen.some((c) => c.cls === 'shoreline_bend' || c.cls === 'long_bank' || c.cls === 'pocket_edge')
  )
    return;

  const keys = new Set(chosen.map(rawCandKey));
  const alts = merged
    .filter((c) => (c.cls === 'shoreline_bend' || c.cls === 'long_bank') && !keys.has(rawCandKey(c)))
    .sort((a, b) => b.score - a.score);

  for (const alt of alts) {
    if (alt.score < 0.252) continue;
    const sortedPts = [...pts].sort((a, b) => a.score - b.score);
    for (const weakest of sortedPts) {
      if (alt.score < weakest.score * 0.84) continue;
      const idxRm = chosen.findIndex((x) => x === weakest);
      if (idxRm < 0) continue;
      const trial = chosen.filter((_, i) => i !== idxRm);
      trial.push(alt);
      if (!chosenAllSeparated(trial, minSep, nSub)) continue;
      chosen.splice(0, chosen.length, ...trial);
      return;
    }
  }
}

function maybeSwapWeakPointForPocket(
  chosen: RawCand[],
  merged: RawCand[],
  nSub: number,
  minSep: number,
): void {
  if (chosen.some((c) => c.cls === 'pocket_edge')) return;
  const pts = chosen.filter((c) => c.cls === 'shoreline_point');
  if (pts.length === 0) return;
  const keys = new Set(chosen.map(rawCandKey));
  const pockets = merged
    .filter((c) => c.cls === 'pocket_edge' && !keys.has(rawCandKey(c)))
    .sort((a, b) => b.score - a.score);
  const pocket = pockets[0];
  if (!pocket || pocket.score < 0.58) return;
  const weakest = [...pts].sort((a, b) => a.score - b.score)[0]!;
  if (pocket.score < weakest.score * 0.76) return;
  const idxRm = chosen.findIndex((x) => x === weakest);
  if (idxRm < 0) return;
  const trial = chosen.filter((_, i) => i !== idxRm);
  trial.push(pocket);
  if (!chosenAllSeparated(trial, minSep, nSub)) return;
  chosen.splice(0, chosen.length, ...trial);
}

function diversityPref(cls: WaterReaderGeometryFeatureClass): number {
  switch (cls) {
    case 'pocket_edge':
      return 4;
    case 'shoreline_bend':
      return 3;
    case 'long_bank':
      return 2;
    case 'shoreline_point':
      return 1;
    default:
      return 0;
  }
}

function diversityPick(merged: RawCand[], sep: number, nSub: number): RawCand[] {
  merged.sort((a, b) => {
    const ds = b.score - a.score;
    if (Math.abs(ds) > 0.032) return ds;
    return diversityPref(b.cls) - diversityPref(a.cls);
  });
  const chosen: RawCand[] = [];
  const classCount: Partial<Record<WaterReaderGeometryFeatureClass, number>> = {};
  const candKey = (x: RawCand) => `${x.idx}:${x.cls}`;

  const tryAdd = (c: RawCand, minSep: number): boolean => {
    const cap = CLASS_BUDGET[c.cls] ?? 1;
    if ((classCount[c.cls] ?? 0) >= cap) return false;
    for (const ch of chosen) {
      if (arcSubsampleSep(c.idx, ch.idx, nSub) < minSep) return false;
    }
    chosen.push(c);
    classCount[c.cls] = (classCount[c.cls] ?? 0) + 1;
    return true;
  };

  for (const c of merged) {
    if (chosen.length >= MAX_POOL_CANDIDATES) break;
    tryAdd(c, sep);
  }

  const looseSep = Math.max(2, Math.floor(sep * 0.55));
  if (chosen.length < MAX_POOL_CANDIDATES) {
    const seen = new Set(chosen.map(candKey));
    for (const c of merged) {
      if (chosen.length >= MAX_POOL_CANDIDATES) break;
      const k = candKey(c);
      if (seen.has(k)) continue;
      if (tryAdd(c, looseSep)) seen.add(k);
    }
  }

  maybeSwapPointForShapeDiversity(chosen, merged, nSub, looseSep);

  maybeSwapWeakPointForPocket(chosen, merged, nSub, looseSep);

  chosen.sort((a, b) => {
    const aLb = a.cls === 'long_bank';
    const bLb = b.cls === 'long_bank';
    if (aLb !== bLb) return aLb ? 1 : -1;
    return b.score - a.score;
  });
  let out = chosen.slice(0, MAX_POOL_CANDIDATES);
  const bestScore = out.length ? Math.max(...out.map((x) => x.score)) : 0;
  const strictFloor = Math.max(0.21, bestScore * 0.32);
  const relaxedFloor = Math.max(0.12, bestScore * 0.2);
  let trimmed = out.filter((c) => c.score >= strictFloor);
  if (trimmed.length < TARGET_POOL_AFTER_TRIM) {
    trimmed = out.filter((c) => c.score >= relaxedFloor);
  }
  out = trimmed;
  if (out.length === 0) return chosen.slice(0, Math.min(3, chosen.length));
  return out.slice(0, MAX_POOL_CANDIDATES);
}

/**
 * Returns ranked candidate pool (~14–18) for layout; visible zones capped separately (≤5).
 */
export function detectWaterReaderGeometryCandidates(
  geojson: WaterbodyPolygonGeoJson | null | undefined,
): WaterReaderGeometryCandidate[] {
  if (!geojson) return [];
  const primary = primaryPolygonExteriorAndHoles(geojson);
  if (!primary) return [];
  const { exterior, holes } = primary;
  if (!exterior || exterior.length < 6) return [];

  const r = openRing(exterior);
  const nRing = r.length;
  const lat0 = r.reduce((s, p) => s + p[1], 0) / r.length;
  const [cLon, cLat] = ringCentroidLonLat(exterior);

  const idxs = subsampleIndices(r.length, MAX_SAMPLE);
  const pts: [number, number][] = idxs.map((i) => toXY(r[i]![0], r[i]![1], lat0));
  const n = pts.length;
  if (n < 5) return [];

  const turns: number[] = [];
  for (let i = 0; i < n; i++) {
    const im = (i - 1 + n) % n;
    const ip = (i + 1) % n;
    turns.push(signedTurn(pts[im]!, pts[i]!, pts[ip]!));
  }

  const smoothed = turns.map((_, i) => {
    const a = turns[(i - 1 + n) % n]!;
    const b = turns[i]!;
    const c = turns[(i + 1) % n]!;
    return (a + b + c) / 3;
  });

  const raw: RawCand[] = [];
  const neigh = Math.max(2, Math.floor(n * 0.02));

  for (let i = 0; i < n; i++) {
    let isMax = true;
    let isMin = true;
    for (let k = -neigh; k <= neigh; k++) {
      if (k === 0) continue;
      const j = (i + k + n) % n;
      if (smoothed[j]! > smoothed[i]!) isMax = false;
      if (smoothed[j]! < smoothed[i]!) isMin = false;
    }
    const t = smoothed[i]!;
    const lon = r[idxs[i]!]![0]!;
    const lat = r[idxs[i]!]![1]!;
    if (isMax && t > PEAK_ANGLE_POINT) {
      raw.push({ idx: i, turn: t, lon, lat, cls: 'shoreline_point', score: Math.abs(t) });
    } else if (isMax && t > PEAK_ANGLE_BEND) {
      raw.push({ idx: i, turn: t, lon, lat, cls: 'shoreline_bend', score: Math.abs(t) * 0.94 });
    } else if (isMin && t < POCKET_EDGE_TURN) {
      const pocketBoost = t < -1.02 ? 1.07 : t < -0.92 ? 1.04 : 1;
      raw.push({
        idx: i,
        turn: t,
        lon,
        lat,
        cls: 'pocket_edge',
        score: Math.abs(t) * 0.96 * pocketBoost,
      });
    } else if (isMin && t < BEND_CONCAVE_TURN) {
      raw.push({ idx: i, turn: t, lon, lat, cls: 'shoreline_bend', score: Math.abs(t) * 0.76 });
    }
  }

  raw.sort((a, b) => b.score - a.score);

  const sep = Math.max(3, Math.floor(n * MIN_SEP_FRAC));
  const picked: RawCand[] = [];
  let pocketPicked = 0;
  outer:
  for (const c of raw) {
    if (c.cls === 'pocket_edge') {
      if (pocketPicked >= 4) continue;
    }
    for (const p of picked) {
      const d = Math.min(Math.abs(c.idx - p.idx), n - Math.abs(c.idx - p.idx));
      if (d < sep) continue outer;
    }
    picked.push(c);
    if (c.cls === 'pocket_edge') pocketPicked++;
    if (picked.length >= 42) break;
  }

  if (picked.length < MIN_CANDIDATES_TARGET) {
    let bestStart = 0;
    let bestLen = 0;
    let curStart = 0;
    let curLen = 0;
    for (let i = 0; i < n * 2; i++) {
      const j = i % n;
      const st = Math.abs(smoothed[j]!);
      if (st < LONG_BANK_MAX_TURN) {
        if (curLen === 0) curStart = j;
        curLen++;
      } else {
        if (curLen > bestLen) {
          bestLen = curLen;
          bestStart = curStart;
        }
        curLen = 0;
      }
    }
    if (curLen > bestLen) {
      bestLen = curLen;
      bestStart = curStart;
    }
    if (bestLen >= LONG_BANK_MIN_LEN) {
      const mid = (bestStart + Math.floor(bestLen / 2)) % n;
      const lon = r[idxs[mid]!]![0]!;
      const lat = r[idxs[mid]!]![1]!;
      let midOk = true;
      for (const p of picked) {
        const d = Math.min(Math.abs(mid - p.idx), n - Math.abs(mid - p.idx));
        if (d < sep) {
          midOk = false;
          break;
        }
      }
      if (midOk) {
        picked.push({
          idx: mid,
          turn: 0,
          lon,
          lat,
          cls: 'long_bank',
          score: 0.25,
        });
      }
    }
  }

  const bbox = bboxFromRings(ringsFromGeoJson(geojson));
  if (!bbox) return [];
  const lonSpan = Math.max(bbox.maxLon - bbox.minLon, 1e-9);
  const latSpan = Math.max(bbox.maxLat - bbox.minLat, 1e-9);

  const sectorLayer = sectorStratifiedRawCandidates(raw, n, RING_SECTOR_COUNT);
  const mergedBeforeNeck = mergeUniqueRawCands(picked, sectorLayer);

  const neckPair = findNeckdownPair(r, lat0, bbox);
  let merged: RawCand[] = mergedBeforeNeck;
  if (neckPair) {
    const ni = neckPair.i;
    const nj = neckPair.j;
    const midLon = (r[ni]![0]! + r[nj]![0]!) / 2;
    const midLat = (r[ni]![1]! + r[nj]![1]!) / 2;
    const neckIdx = nearestSubsampleIndex(idxs, ni, nRing);
    const excl = Math.max(4, Math.floor(n * NECK_SHORE_EXCLUSION_FRAC));
    merged = merged.filter((c) => arcSubsampleSep(c.idx, neckIdx, n) >= excl);
    merged.unshift({
      idx: neckIdx,
      turn: 0,
      lon: midLon,
      lat: midLat,
      cls: 'neckdown',
      score: 0.93,
      neckRingI: ni,
      neckRingJ: nj,
      neckMetrics: neckPair.metrics,
    });
  }

  const top = diversityPick(merged, sep, n);
  const neckHead = top.filter((c) => c.cls === 'neckdown');
  const rest = top.filter((c) => c.cls !== 'neckdown');
  rest.sort((a, b) => {
    const ds = b.score - a.score;
    if (Math.abs(ds) > 0.078) return ds;
    const pref = (x: RawCand) =>
      x.cls === 'pocket_edge' ? 4 : x.cls === 'shoreline_bend' ? 3 : x.cls === 'long_bank' ? 2 : 1;
    return pref(b) - pref(a);
  });
  const topOrdered = [...neckHead, ...rest];

  const out: WaterReaderGeometryCandidate[] = [];
  for (const c of topOrdered) {
    const { identifiedBecause, howToFishIt } = copyZoneExplanation(c.cls);
    const nudged = nudgeInside(c.lon, c.lat, exterior, holes, cLon, cLat);
    if (!pointInPrimaryWater(nudged.lon, nudged.lat, exterior, holes)) {
      continue;
    }
    let displayPatch: WaterReaderDisplayPatch;
    if (c.cls === 'neckdown' && c.neckRingI != null && c.neckRingJ != null) {
      displayPatch = buildNeckdownDisplayPatch(r, c.neckRingI, c.neckRingJ, lat0, cLon, cLat, lonSpan, latSpan);
    } else {
      const sizes = patchDegSizes(c.cls, lonSpan, latSpan);
      const frame = shorePatchFrame(r, idxs, c.idx, lat0, cLon, cLat);
      displayPatch = {
        ...frame,
        patchAlongDeg: sizes.along,
        patchInwardDeg: sizes.inward,
      };
    }
    const qaFlags: string[] = ['prototype_geometry_only', 'hydrography_polygon', ...nudged.qaFlags];
    if (c.cls === 'neckdown') qaFlags.push('neckdown_geometry_heuristic');
    if (idxs.length < r.length) qaFlags.push('subsampled_shoreline');
    if (holes.length > 0) qaFlags.push('interior_rings_excluded_from_water');
    const featLabel = labelFor(c.cls);
    const normX = (nudged.lon - bbox.minLon) / lonSpan;
    const normY = (nudged.lat - bbox.minLat) / latSpan;

    const rank = out.length + 1;
    const { zoneFillRgba, zoneStrokeRgba } = zoneColorsForRank(rank);
    const neckCorridor =
      c.cls === 'neckdown' && c.neckRingI != null && c.neckRingJ != null
        ? {
            shoreALon: r[c.neckRingI]![0]!,
            shoreALat: r[c.neckRingI]![1]!,
            shoreBLon: r[c.neckRingJ]![0]!,
            shoreBLat: r[c.neckRingJ]![1]!,
          }
        : undefined;
    const neckMetricsOut =
      c.cls === 'neckdown' && c.neckMetrics
        ? {
            relDiag: c.neckMetrics.relDiag,
            lobeContrast: c.neckMetrics.lobeContrast,
            pinchToMedian: c.neckMetrics.pinchToMedian,
          }
        : undefined;
    const shoreRibbonArc =
      c.cls !== 'neckdown'
        ? (() => {
            const ringCenter = idxs[c.idx]!;
            const halfSpan = ribbonHalfSpan(c.cls, nRing, n);
            const ringFrom = (ringCenter - halfSpan + nRing) % nRing;
            const ringTo = (ringCenter + halfSpan + nRing) % nRing;
            return { ringCenter, halfSpan, ringFrom, ringTo };
          })()
        : undefined;
    const diagnosticSummary =
      c.cls === 'neckdown'
        ? diagnosticLine(c)
        : shoreRibbonArc
          ? shorelineRibbonDiagnostic(c.cls, c.score, shoreRibbonArc.halfSpan)
          : diagnosticLine(c);
    out.push({
      candidateId: rank,
      rank,
      featureClass: c.cls,
      featureLabel: featLabel,
      anchorLon: nudged.lon,
      anchorLat: nudged.lat,
      displayPatch,
      zoneFillRgba,
      zoneStrokeRgba,
      neckCorridor,
      neckMetrics: neckMetricsOut,
      shoreRibbonArc,
      normX,
      normY,
      identifiedBecause,
      howToFishIt,
      diagnosticSummary,
      qaFlags,
    });
    if (out.length >= MAX_POOL_CANDIDATES) break;
  }

  return out;
}
