/**
 * Water Reader detector QA matrix (local/dev). Loads `.env` from cwd when vars unset.
 * Run: `npm run qa:water-reader-detector` or `--audit-neckdowns` / `--export-zone-svg` (`--export-neckdown-svg` aliases zone export).
 * Layout warnings may include zone_bank_side_fallback_used; layoutDiagnosticsSummary.bankSideFallbackUsed counts fallbacks.
 */
import { createClient } from '@supabase/supabase-js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import type {
  WaterbodyPolygonGeoJson,
  WaterbodyPolygonResponse,
  WaterbodyPreviewBbox,
  WaterbodySearchResponse,
  WaterbodySearchResult,
  WaterReaderGeometryCandidate,
  WaterReaderGeometryFeatureClass,
} from '../lib/waterReaderContracts';
import { detectWaterReaderGeometryCandidates } from '../lib/waterReaderGeometryDetector';
import {
  computeRenderedLakePatches,
  type LakeRenderedPatch,
  type LakeZoneLayoutDiagnosticsSummary,
} from '../lib/waterReaderLakeZoneLayout';
import {
  computeSilhouetteTransform,
  LAKE_SILHOUETTE,
  primaryPolygonExteriorAndHoles,
  projectLonLatToSilhouetteSvg,
  ringToSubpath,
  ringsFromGeoJson,
  type SilhouetteTransform,
} from '../lib/waterReaderSilhouetteMath';

const PHONE_W = 390;
const SEARCH_LIMIT = 48;
const AUDIT_NECKDOWNS = process.argv.includes('--audit-neckdowns');
const EXPORT_ZONE_SVG =
  process.argv.includes('--export-zone-svg') || process.argv.includes('--export-neckdown-svg');
const NECKDOWN_SVG_OUT_DIR = 'tmp/water-reader-neckdown-audit';
const NECKDOWN_SVG_HEADER_H = 54;

/** Lakes with complex outlines: used only for conservative low-visible warning heuristics (acres estimate). */
const NON_SIMPLE_MIN_ACRES = 800;

function loadDotEnvIfPresent() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq <= 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined || process.env[k] === '') process.env[k] = v;
  }
}

type NeckExpectation = 'true' | 'false' | 'observe';

type MatrixCase = {
  label: string;
  searchQuery: string;
  expectation: NeckExpectation;
  find: (rows: WaterbodySearchResult[]) => WaterbodySearchResult | undefined;
};

const CASES: MatrixCase[] = [
  {
    label: 'Torch Lake, MI',
    searchQuery: 'Torch Lake',
    expectation: 'false',
    find: (rows) =>
      rows.find((r) => (r.county ?? '').toLowerCase().includes('antrim') && /torch/i.test(r.name)) ??
      rows.find((r) => /torch/i.test(r.name)),
  },
  {
    label: 'Glen Lake, Leelanau County, MI',
    searchQuery: 'Glen Lake',
    expectation: 'true',
    find: (rows) =>
      rows.find((r) => (r.county ?? '').toLowerCase().includes('leelanau') && /glen/i.test(r.name)),
  },
  {
    label: 'Houghton Lake, MI',
    searchQuery: 'Houghton Lake',
    expectation: 'false',
    find: (rows) => rows.find((r) => /houghton/i.test(r.name)),
  },
  {
    label: 'Higgins Lake, MI',
    searchQuery: 'Higgins Lake',
    expectation: 'observe',
    find: (rows) => rows.find((r) => /higgins/i.test(r.name)),
  },
  {
    label: 'Crystal Lake, Benzie County, MI',
    searchQuery: 'Crystal Lake',
    expectation: 'observe',
    find: (rows) =>
      rows.find(
        (r) => (r.county ?? '').toLowerCase().includes('benzie') && /crystal/i.test(r.name),
      ),
  },
  {
    label: 'Elk Lake, MI',
    searchQuery: 'Elk Lake',
    expectation: 'observe',
    find: (rows) =>
      rows.find((r) => (r.county ?? '').toLowerCase().includes('antrim') && /elk/i.test(r.name)) ??
      rows.find((r) => /^elk lake$/i.test((r.name ?? '').trim())),
  },
  {
    label: 'Burt Lake, MI',
    searchQuery: 'Burt Lake',
    expectation: 'observe',
    find: (rows) => rows.find((r) => /burt/i.test(r.name)),
  },
  {
    label: 'Mullett Lake, MI',
    searchQuery: 'Mullett Lake',
    expectation: 'observe',
    find: (rows) => rows.find((r) => /mullett/i.test(r.name)),
  },
  {
    label: 'Lake Charlevoix, MI',
    searchQuery: 'Lake Charlevoix',
    expectation: 'observe',
    find: (rows) =>
      rows.find(
        (r) =>
          /charlevoix/i.test(r.name) &&
          ((r.county ?? '').toLowerCase().includes('charlevoix') ||
            (r.county ?? '').toLowerCase().includes('emmet')),
      ) ?? rows.find((r) => /charlevoix/i.test(r.name)),
  },
];

function isPolygonUsable(status: string): boolean {
  return status === 'supported' || status === 'limited';
}

function isNonSimpleHeuristic(poly: WaterbodyPolygonResponse): boolean {
  const acres = poly.areaAcres ?? 0;
  if (acres >= NON_SIMPLE_MIN_ACRES) return true;
  if (poly.componentCount > 1) return true;
  if (poly.interiorRingCount > 0) return true;
  return false;
}

type VisibleTargetStatus = 'under_target' | 'ok' | 'simple_low';

function poolClassCounts(candidates: { featureClass: string }[]): Record<string, number> {
  const o: Record<string, number> = {};
  for (const c of candidates) {
    const k = c.featureClass;
    o[k] = (o[k] ?? 0) + 1;
  }
  return o;
}

/** Pool vs visible expectation for diagnostics only (no GPS). */
function visibleTargetStatus(
  visibleZoneCount: number,
  candidatePoolCount: number,
  poly: WaterbodyPolygonResponse,
): VisibleTargetStatus {
  const complex = isNonSimpleHeuristic(poly);
  const usable = isPolygonUsable(poly.waterReaderSupportStatus);

  if (visibleZoneCount >= 4) return 'ok';

  const thinPool = candidatePoolCount <= 7;
  if (!usable || !complex || thinPool) {
    if (visibleZoneCount <= 1) return 'simple_low';
    return 'ok';
  }

  if (candidatePoolCount >= 12 && visibleZoneCount < 4) return 'under_target';
  if (visibleZoneCount >= 3) return 'ok';
  return visibleZoneCount <= 1 ? 'simple_low' : 'under_target';
}

function buildWarnings(params: {
  expectation: NeckExpectation;
  neckdownVisible: boolean;
  visibleZoneCount: number;
  candidatePoolCount: number;
  suppressedCount: number;
  poly: WaterbodyPolygonResponse;
}): string[] {
  const w: string[] = [];
  const {
    expectation,
    neckdownVisible,
    visibleZoneCount,
    candidatePoolCount,
    suppressedCount,
    poly,
  } = params;

  if (visibleZoneCount > 5) w.push('visible_zone_count_gt_5');
  if (
    visibleZoneCount === 0 &&
    poly.geojson &&
    isPolygonUsable(poly.waterReaderSupportStatus)
  ) {
    w.push('zero_visible_zones_on_supported_polygon');
  }
  if (
    visibleZoneCount < 2 &&
    isPolygonUsable(poly.waterReaderSupportStatus) &&
    isNonSimpleHeuristic(poly)
  ) {
    w.push('visible_zones_lt_2_on_non_simple_polygon');
  }
  if (expectation === 'false' && neckdownVisible) w.push('neckdown_false_positive_visible');
  if (expectation === 'true' && !neckdownVisible) w.push('neckdown_false_negative_visible');
  if (suppressedCount >= 4) {
    w.push('high_suppression_count');
  }

  return w;
}

/** Long-axis / short-axis ratio from preview bbox (no vertex coordinates emitted). */
function bboxSlendernessRatio(bbox: WaterbodyPreviewBbox | null): number | null {
  if (!bbox) return null;
  const lat0 = (bbox.minLat + bbox.maxLat) / 2;
  const cosL = Math.cos((lat0 * Math.PI) / 180);
  const w = Math.max((bbox.maxLon - bbox.minLon) * cosL, 1e-9);
  const h = Math.max(bbox.maxLat - bbox.minLat, 1e-9);
  return Math.max(w, h) / Math.min(w, h);
}

function parseNeckDiag(summary: string | undefined | null): {
  relDiag: number;
  lobeC: number;
  pinchMed: number;
} | null {
  if (!summary?.startsWith('neckdown')) return null;
  const m = summary.match(/relDiag=([\d.]+)\s+lobeC=([\d.]+)\s+pinchMed=([\d.]+)/);
  if (!m) return null;
  return {
    relDiag: Number.parseFloat(m[1]!),
    lobeC: Number.parseFloat(m[2]!),
    pinchMed: Number.parseFloat(m[3]!),
  };
}

type AuditClass =
  | 'strict_expected_pass'
  | 'observe_needs_human_review'
  | 'observe_likely_plausible'
  | 'observe_suspicious';

function neckdownAuditClassification(
  expectation: NeckExpectation,
  expectationStat: 'pass' | 'fail' | 'observe' | 'skipped',
  neckdownVisible: boolean,
  metrics: { relDiag: number; lobeC: number; pinchMed: number } | null,
  slenderness: number | null,
): AuditClass | null {
  if (!neckdownVisible) return null;
  if (expectationStat === 'pass' && expectation !== 'observe') return 'strict_expected_pass';

  if (expectation !== 'observe') return null;

  if (!metrics) return 'observe_needs_human_review';

  const { relDiag, lobeC, pinchMed } = metrics;
  const slender = slenderness ?? 1;

  const suspicious =
    relDiag >= 0.16 ||
    (lobeC < 2.0 && relDiag >= 0.11) ||
    pinchMed >= 0.58 ||
    (slender >= 4.5 && relDiag >= 0.1) ||
    (slender >= 5.0 && relDiag >= 0.06);

  const plausible =
    relDiag <= 0.11 &&
    lobeC >= 2.8 &&
    pinchMed <= 0.52 &&
    !(slender >= 5.0 && relDiag >= 0.05);

  if (suspicious) return 'observe_suspicious';
  if (plausible) return 'observe_likely_plausible';
  return 'observe_needs_human_review';
}

function escapeXmlText(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugFilePart(label: string): string {
  const t = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);
  return t || 'lake';
}

function lakeOutlinePathD(geojson: WaterbodyPolygonGeoJson, t: SilhouetteTransform): string {
  const rings = ringsFromGeoJson(geojson);
  let d = '';
  for (const ring of rings) {
    const sub = ringToSubpath(ring, t.minLon, t.maxLat, t.scale, t.originX, t.originY);
    if (sub) d += sub;
  }
  return d;
}

function openExteriorVertices(geojson: WaterbodyPolygonGeoJson): number[][] | null {
  const pr = primaryPolygonExteriorAndHoles(geojson);
  const ext = pr?.exterior as number[][] | undefined;
  if (!ext || ext.length < 3) return null;
  const r = ext.filter(
    (p) => Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number',
  ) as number[][];
  if (r.length < 3) return null;
  const a = r[0];
  const b = r[r.length - 1];
  if (a && b && a[0] === b[0] && a[1] === b[1]) return r.slice(0, -1);
  return r;
}

/** Forward window covering center±halfSpan on closed ring vertex indices (detector / layout convention). */
function ribbonWindowVerts(ring: number[][], ringCenter: number, halfSpan: number): number[][] {
  const n = ring.length;
  if (n < 2) return [];
  const hMax = Math.max(0, Math.floor((n - 1) / 2));
  const h = Math.max(0, Math.min(halfSpan, hMax));
  const c = ((ringCenter % n) + n) % n;
  if (h === 0) return [ring[c]!];
  const start = (c - h + n) % n;
  const count = Math.min(n, 2 * h + 1);
  const pts: number[][] = [];
  for (let k = 0; k < count; k++) {
    pts.push(ring[(start + k) % n]!);
  }
  return pts;
}

function polylineLonLatSvgD(ptsLonLat: number[][], transform: SilhouetteTransform): string | null {
  if (ptsLonLat.length === 0) return null;
  const p0 = ptsLonLat[0];
  if (!p0 || p0.length < 2) return null;
  const s0 = projectLonLatToSilhouetteSvg(p0[0]!, p0[1]!, transform);
  let d = `M ${s0.x.toFixed(2)} ${s0.y.toFixed(2)}`;
  for (let i = 1; i < ptsLonLat.length; i++) {
    const p = ptsLonLat[i];
    if (!p || p.length < 2) continue;
    const s = projectLonLatToSilhouetteSvg(p[0]!, p[1]!, transform);
    d += ` L ${s.x.toFixed(2)} ${s.y.toFixed(2)}`;
  }
  return d;
}

function abbrevFeatureClass(fc: WaterReaderGeometryFeatureClass): string {
  switch (fc) {
    case 'shoreline_point':
      return 'point';
    case 'pocket_edge':
      return 'pocket';
    case 'shoreline_bend':
      return 'bend';
    case 'long_bank':
      return 'bank';
    case 'neckdown':
      return 'neck';
    default:
      return String(fc).slice(0, 6);
  }
}

function clampNum(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function buildQaShoreCueLayer(params: {
  patches: LakeRenderedPatch[];
  visibleCandidates: WaterReaderGeometryCandidate[];
  geojson: WaterbodyPolygonGeoJson;
  transform: SilhouetteTransform;
}): string {
  const { patches, visibleCandidates, geojson, transform } = params;
  const ring = openExteriorVertices(geojson);
  if (!ring) return '';

  let out = '';
  const byId = new Map(visibleCandidates.map((c) => [c.candidateId, c] as const));

  for (const p of patches) {
    const cand = byId.get(p.candidateId);
    if (!cand) continue;

    if (cand.featureClass === 'neckdown' && cand.neckCorridor) {
      const cor = cand.neckCorridor;
      const a = projectLonLatToSilhouetteSvg(cor.shoreALon, cor.shoreALat, transform);
      const b = projectLonLatToSilhouetteSvg(cor.shoreBLon, cor.shoreBLat, transform);
      out += `<circle cx="${a.x.toFixed(2)}" cy="${a.y.toFixed(2)}" r="3" fill="#991b1b" stroke="#fff" stroke-width="1" opacity="0.92" />`;
      out += `<circle cx="${b.x.toFixed(2)}" cy="${b.y.toFixed(2)}" r="3" fill="#991b1b" stroke="#fff" stroke-width="1" opacity="0.92" />`;
      out += `<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" stroke="#991b1b" stroke-opacity="0.55" stroke-width="1.1" stroke-dasharray="3 3" />`;
      const lx = Math.min(a.x, b.x) + Math.abs(a.x - b.x) * 0.42;
      const ly = Math.min(a.y, b.y) - 11;
      out += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="8" font-family="system-ui,Segoe UI,sans-serif" fill="#3b0a0a" font-weight="600">${escapeXmlText(`${p.rank} neck`)}</text>`;
      continue;
    }

    const dp = cand.displayPatch;
    const s = projectLonLatToSilhouetteSvg(dp.shoreLon, dp.shoreLat, transform);

    const arcLonLat =
      cand.shoreRibbonArc != null
        ? ribbonWindowVerts(ring, cand.shoreRibbonArc.ringCenter, cand.shoreRibbonArc.halfSpan)
        : [];

    const arcD = arcLonLat.length >= 2 ? polylineLonLatSvgD(arcLonLat, transform) : null;
    if (arcD) {
      out += `<path d="${escapeXmlText(arcD)}" fill="none" stroke="rgba(217,119,6,0.95)" stroke-width="2.2" stroke-linecap="round" />`;
    }

    const dotStroke = cand.featureClass === 'pocket_edge' ? '#0f766e' : '#b45309';
    out += `<circle cx="${s.x.toFixed(2)}" cy="${s.y.toFixed(2)}" r="3.25" fill="rgba(255,255,255,0.9)" stroke="${dotStroke}" stroke-width="1.4" opacity="1" />`;

    const label = `${p.rank} ${abbrevFeatureClass(cand.featureClass)}`;
    const tx = clampNum(s.x + 7, 4, PHONE_W - 52);
    const ty = clampNum(s.y - 8, 4, LAKE_SILHOUETTE.CANVAS_H - 10);
    out += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" font-size="8" font-family="system-ui,Segoe UI,sans-serif" fill="#1f2937" font-weight="600">${escapeXmlText(label)}</text>`;
  }

  return out;
}

function patchZoneSvg(p: LakeRenderedPatch, highlightNeck: boolean): string {
  if (p.zonePathD) {
    const sw = highlightNeck ? 1.6 : 1.05;
    const fo = highlightNeck ? 0.34 : 0.44;
    return `<path d="${p.zonePathD}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${sw}" fill-opacity="${fo}" />`;
  }
  return '';
}

function buildZoneAuditSvg(params: {
  width: number;
  canvasH: number;
  headerH: number;
  geojson: WaterbodyPolygonGeoJson;
  transform: SilhouetteTransform;
  patches: LakeRenderedPatch[];
  visibleCandidates: WaterReaderGeometryCandidate[];
  lakeTitle: string;
  subtitle: string | null;
}): string {
  const { width, canvasH, headerH, geojson, transform, patches, visibleCandidates, lakeTitle, subtitle } =
    params;
  const totalH = headerH + canvasH;
  const lakeD = lakeOutlinePathD(geojson, transform);
  const necks = patches.filter((p) => p.featureClass === 'neckdown');
  const rest = patches.filter((p) => p.featureClass !== 'neckdown');
  let zones = '';
  for (const p of rest) zones += patchZoneSvg(p, false);
  for (const p of necks) zones += patchZoneSvg(p, true);

  const qaCueLayer = EXPORT_ZONE_SVG
    ? buildQaShoreCueLayer({
        patches,
        visibleCandidates,
        geojson,
        transform,
      })
    : '';

  const mid = subtitle
    ? escapeXmlText(subtitle)
    : escapeXmlText(`${patches.length} visible zones`);
  const bot = escapeXmlText(patches.map((p) => p.featureClass).join(', ') || '—');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalH}" viewBox="0 0 ${width} ${totalH}">
  <defs>
    <clipPath id="wrQaLakeClip"><path d="${lakeD}" fill="#ffffff" fill-rule="evenodd"/></clipPath>
  </defs>
  <rect width="100%" height="100%" fill="#f6f7f8"/>
  <text x="10" y="17" font-size="14" font-family="system-ui,Segoe UI,sans-serif" font-weight="600" fill="#111">${escapeXmlText(lakeTitle)}</text>
  <text x="10" y="34" font-size="11" font-family="system-ui,Segoe UI,sans-serif" fill="#333">${mid}</text>
  <text x="10" y="49" font-size="10" font-family="system-ui,Segoe UI,sans-serif" fill="#555">${bot}</text>
  <g transform="translate(0 ${headerH})">
    <path d="${lakeD}" fill="#c5ddf0" fill-rule="evenodd" stroke="#2a5f87" stroke-width="1.25" />
    <g clip-path="url(#wrQaLakeClip)">${zones}</g>
    <g>${qaCueLayer}</g>
  </g>
</svg>
`;
}

function expectationStatus(
  expectation: NeckExpectation,
  neckdownVisible: boolean,
  skipped: boolean,
): 'pass' | 'fail' | 'observe' | 'skipped' {
  if (skipped) return 'skipped';
  if (expectation === 'observe') return 'observe';
  if (expectation === 'true') return neckdownVisible ? 'pass' : 'fail';
  return neckdownVisible ? 'fail' : 'pass';
}

async function main() {
  loadDotEnvIfPresent();
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, '');
  const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const email = process.env.WATER_READER_TEST_EMAIL?.trim();
  const password = process.env.WATER_READER_TEST_PASSWORD?.trim();
  if (!url || !anon || !email || !password) {
    console.error('Missing EXPO_PUBLIC_SUPABASE_* or WATER_READER_TEST_EMAIL / WATER_READER_TEST_PASSWORD.');
    process.exit(1);
  }

  const supabase = createClient(url, anon);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session?.access_token) {
    console.error('Auth failed:', error?.message ?? 'no session');
    process.exit(1);
  }
  const token = data.session.access_token;

  async function edge<T>(name: string, body: unknown): Promise<T> {
    const res = await fetch(`${url}/functions/v1/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        'x-user-token': token,
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`${name} HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    return JSON.parse(text) as T;
  }

  let pass = 0;
  let fail = 0;
  let observe = 0;
  let skipped = 0;
  const auditByClass: Record<AuditClass, number> = {
    strict_expected_pass: 0,
    observe_needs_human_review: 0,
    observe_likely_plausible: 0,
    observe_suspicious: 0,
  };
  const svgManifestFiles: {
    label: string;
    matchedName: string | null;
    expectationStatus: string;
    visibleZoneCount: number;
    neckdownObserved: boolean;
    file: string | null;
    warnings: string[];
    suppressedLabels: string[];
    suppressedDiagnosticSummaries: (string | null)[];
    areaAcres: number | null;
    layoutDiagnosticsSummary: LakeZoneLayoutDiagnosticsSummary | null;
  }[] = [];

  for (const matrixCase of CASES) {
    const { label, searchQuery, expectation, find } = matrixCase;
    const search = await edge<WaterbodySearchResponse>('waterbody-search', {
      query: searchQuery,
      state: 'MI',
      limit: SEARCH_LIMIT,
    });
    const row = find(search.results);
    if (!row) {
      skipped++;
      console.log(
        JSON.stringify({
          label,
          expectation,
          expectationStatus: 'skipped',
          matchedName: null,
          county: null,
          state: 'MI',
          lakeId: null,
          neckdownObserved: false,
          candidatePoolCount: 0,
          visibleZoneCount: 0,
          visibleClasses: [] as string[],
          visibleLabels: [] as string[],
          suppressedCount: 0,
          suppressedClasses: [] as string[],
          suppressedLabels: [] as string[],
          suppressedDiagnosticSummaries: [] as (string | null)[],
          visibleDiagnosticSummaries: [] as (string | null)[],
          warnings: ['search_match_not_found'],
          layoutDiagnosticsSummary: null,
          poolClassCounts: {},
          visibleTargetStatus: null,
        }),
      );
      if (EXPORT_ZONE_SVG) {
        svgManifestFiles.push({
          label,
          matchedName: null,
          expectationStatus: 'skipped',
          visibleZoneCount: 0,
          neckdownObserved: false,
          file: null,
          warnings: ['search_match_not_found'],
          suppressedLabels: [],
          suppressedDiagnosticSummaries: [],
          areaAcres: null,
          layoutDiagnosticsSummary: null,
        });
      }
      continue;
    }

    const poly = await edge<WaterbodyPolygonResponse>('waterbody-polygon', { lakeId: row.lakeId });
    const gj = poly.geojson;
    if (!gj) {
      skipped++;
      console.log(
        JSON.stringify({
          label,
          expectation,
          expectationStatus: 'skipped',
          matchedName: poly.name,
          county: poly.county ?? null,
          state: poly.state,
          lakeId: row.lakeId,
          neckdownObserved: false,
          candidatePoolCount: 0,
          visibleZoneCount: 0,
          visibleClasses: [] as string[],
          visibleLabels: [] as string[],
          suppressedCount: 0,
          suppressedClasses: [] as string[],
          suppressedLabels: [] as string[],
          suppressedDiagnosticSummaries: [] as (string | null)[],
          visibleDiagnosticSummaries: [] as (string | null)[],
          warnings: ['no_geojson'],
          layoutDiagnosticsSummary: null,
          poolClassCounts: {},
          visibleTargetStatus: null,
        }),
      );
      if (EXPORT_ZONE_SVG) {
        svgManifestFiles.push({
          label,
          matchedName: poly.name,
          expectationStatus: 'skipped',
          visibleZoneCount: 0,
          neckdownObserved: false,
          file: null,
          warnings: ['no_geojson'],
          suppressedLabels: [],
          suppressedDiagnosticSummaries: [],
          areaAcres: poly.areaAcres ?? null,
          layoutDiagnosticsSummary: null,
        });
      }
      continue;
    }

    const candidates = detectWaterReaderGeometryCandidates(gj);
    const transform = computeSilhouetteTransform(gj, PHONE_W);
    const { patches, warnings: layoutWarnings, layoutDiagnostics } = computeRenderedLakePatches(
      candidates,
      transform,
      PHONE_W,
      LAKE_SILHOUETTE.CANVAS_H,
      gj,
      poly.areaAcres,
    );

    const visibleIds = new Set(patches.map((p) => p.candidateId));
    const candById = new Map(candidates.map((c) => [c.candidateId, c] as const));
    const visibleCandidates = patches
      .map((p) => candById.get(p.candidateId))
      .filter((c): c is (typeof candidates)[number] => c != null);
    const suppressed = candidates.filter((c) => !visibleIds.has(c.candidateId));

    const neckdownVisible = visibleCandidates.some((c) => c.featureClass === 'neckdown');
    const expectationStat = expectationStatus(expectation, neckdownVisible, false);

    const neckCandVisible = neckdownVisible
      ? visibleCandidates.find((c) => c.featureClass === 'neckdown')
      : undefined;
    const neckSummary = neckCandVisible?.diagnosticSummary ?? null;
    const parsedNeckMetrics = parseNeckDiag(neckSummary);
    const bboxSlender = bboxSlendernessRatio(poly.bbox);
    const auditClassForNeck = neckdownVisible
      ? neckdownAuditClassification(
          expectation,
          expectationStat,
          neckdownVisible,
          parsedNeckMetrics,
          bboxSlender,
        )
      : null;

    const warnings = Array.from(
      new Set([
        ...buildWarnings({
          expectation,
          neckdownVisible,
          visibleZoneCount: patches.length,
          candidatePoolCount: candidates.length,
          suppressedCount: suppressed.length,
          poly,
        }),
        ...layoutWarnings,
      ]),
    );

    if (expectationStat === 'pass') pass++;
    else if (expectationStat === 'fail') fail++;
    else if (expectationStat === 'observe') observe++;

    console.log(
      JSON.stringify({
        label,
        matchedName: poly.name,
        county: poly.county ?? null,
        state: poly.state,
        lakeId: row.lakeId,
        expectation,
        neckdownObserved: neckdownVisible,
        expectationStatus: expectationStat,
        candidatePoolCount: candidates.length,
        visibleZoneCount: patches.length,
        visibleClasses: visibleCandidates.map((c) => c.featureClass),
        visibleLabels: visibleCandidates.map((c) => c.featureLabel),
        suppressedCount: suppressed.length,
        suppressedClasses: suppressed.map((c) => c.featureClass),
        suppressedLabels: suppressed.map((c) => c.featureLabel),
        suppressedDiagnosticSummaries: suppressed.map((c) => c.diagnosticSummary ?? null),
        visibleDiagnosticSummaries: visibleCandidates.map((c) => c.diagnosticSummary ?? null),
        warnings,
        layoutDiagnosticsSummary: layoutDiagnostics ?? null,
        poolClassCounts: poolClassCounts(candidates),
        visibleTargetStatus: visibleTargetStatus(patches.length, candidates.length, poly),
      }),
    );

    if (AUDIT_NECKDOWNS && neckdownVisible) {
      if (auditClassForNeck) auditByClass[auditClassForNeck]++;

      console.log(
        JSON.stringify({
          type: 'neckdown_audit',
          label,
          matchedName: poly.name,
          county: poly.county ?? null,
          lakeId: row.lakeId,
          diagnosticSummary: neckSummary,
          parsedNeckMetrics,
          bboxSlenderness: bboxSlender,
          areaAcres: poly.areaAcres ?? null,
          componentCount: poly.componentCount,
          interiorRingCount: poly.interiorRingCount,
          visibleClasses: visibleCandidates.map((c) => c.featureClass),
          visibleZoneCount: patches.length,
          suppressedCount: suppressed.length,
          suppressedLabels: suppressed.map((c) => c.featureLabel),
          suppressedDiagnosticSummaries: suppressed.map((c) => c.diagnosticSummary ?? null),
          warnings,
          expectation,
          expectationStatus: expectationStat,
          auditClassification: auditClassForNeck,
          layoutDiagnosticsSummary: layoutDiagnostics ?? null,
        }),
      );
    }

    if (EXPORT_ZONE_SVG && transform) {
      const subtitle =
        auditClassForNeck && neckSummary
          ? `${auditClassForNeck} — ${neckSummary}`
          : auditClassForNeck
            ? String(auditClassForNeck)
            : null;
      const fileName = `${slugFilePart(label)}-zones.svg`;
      const absDir = resolve(process.cwd(), NECKDOWN_SVG_OUT_DIR);
      mkdirSync(absDir, { recursive: true });
      const relFile = `${NECKDOWN_SVG_OUT_DIR}/${fileName}`;
      const svg = buildZoneAuditSvg({
        width: PHONE_W,
        canvasH: LAKE_SILHOUETTE.CANVAS_H,
        headerH: NECKDOWN_SVG_HEADER_H,
        geojson: gj,
        transform,
        patches,
        visibleCandidates,
        lakeTitle: poly.name ?? label,
        subtitle,
      });
      writeFileSync(join(absDir, fileName), svg, 'utf8');
      svgManifestFiles.push({
        label,
        matchedName: poly.name,
        expectationStatus: expectationStat,
        visibleZoneCount: patches.length,
        neckdownObserved: neckdownVisible,
        file: relFile,
        warnings,
        suppressedLabels: suppressed.map((c) => c.featureLabel),
        suppressedDiagnosticSummaries: suppressed.map((c) => c.diagnosticSummary ?? null),
        areaAcres: poly.areaAcres ?? null,
        layoutDiagnosticsSummary: layoutDiagnostics ?? null,
      });
    }
  }

  console.log(
    JSON.stringify({
      type: 'qa_matrix_summary',
      cases: CASES.length,
      pass,
      fail,
      observe,
      skipped,
      ...(AUDIT_NECKDOWNS ? { neckdownAuditByClassification: auditByClass } : {}),
    }),
  );

  if (EXPORT_ZONE_SVG) {
    console.log(
      JSON.stringify({
        type: 'zone_svg_manifest',
        outputDir: NECKDOWN_SVG_OUT_DIR,
        files: svgManifestFiles,
      }),
    );
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
