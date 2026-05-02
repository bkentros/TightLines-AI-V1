import { createClient } from '@supabase/supabase-js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import {
  detectWaterReaderFeatures,
  featureDebugCues,
  getLastFeaturePruningSummary,
  getLastCoveSuppressionSummary,
  preprocessWaterReaderGeometry,
  type PointM,
  type RingM,
  type WaterReaderDetectedFeature,
  type WaterReaderPreprocessResult,
} from '../lib/water-reader-engine';
import type {
  WaterbodyPolygonGeoJson,
  WaterbodyPolygonResponse,
  WaterbodySearchResponse,
  WaterbodySearchResult,
} from '../lib/waterReaderContracts';

const OUT_DIR = 'tmp/water-reader-engine-feature-review';
const SEARCH_LIMIT = 48;
const SVG_W = 960;
const HEADER_H = 84;
const PAD = 34;

type MatrixCase = {
  label: string;
  searchQuery: string;
  find: (rows: WaterbodySearchResult[]) => WaterbodySearchResult | undefined;
};

const CASES: MatrixCase[] = [
  {
    label: 'Torch Lake, MI',
    searchQuery: 'Torch Lake',
    find: (rows) =>
      rows.find((r) => (r.county ?? '').toLowerCase().includes('antrim') && /torch/i.test(r.name)) ??
      rows.find((r) => /torch/i.test(r.name)),
  },
  {
    label: 'Glen Lake, Leelanau County, MI',
    searchQuery: 'Glen Lake',
    find: (rows) =>
      rows.find((r) => (r.county ?? '').toLowerCase().includes('leelanau') && /glen/i.test(r.name)),
  },
  {
    label: 'Houghton Lake, MI',
    searchQuery: 'Houghton Lake',
    find: (rows) => rows.find((r) => /houghton/i.test(r.name)),
  },
  {
    label: 'Higgins Lake, MI',
    searchQuery: 'Higgins Lake',
    find: (rows) => rows.find((r) => /higgins/i.test(r.name)),
  },
  {
    label: 'Crystal Lake, Benzie County, MI',
    searchQuery: 'Crystal Lake',
    find: (rows) =>
      rows.find((r) => (r.county ?? '').toLowerCase().includes('benzie') && /crystal/i.test(r.name)),
  },
  {
    label: 'Elk Lake, MI',
    searchQuery: 'Elk Lake',
    find: (rows) =>
      rows.find((r) => (r.county ?? '').toLowerCase().includes('antrim') && /elk/i.test(r.name)) ??
      rows.find((r) => /^elk lake$/i.test((r.name ?? '').trim())),
  },
  {
    label: 'Burt Lake, MI',
    searchQuery: 'Burt Lake',
    find: (rows) => rows.find((r) => /burt/i.test(r.name)),
  },
  {
    label: 'Mullett Lake, MI',
    searchQuery: 'Mullett Lake',
    find: (rows) => rows.find((r) => /mullett/i.test(r.name)),
  },
  {
    label: 'Lake Charlevoix, MI',
    searchQuery: 'Lake Charlevoix',
    find: (rows) =>
      rows.find(
        (r) =>
          /charlevoix/i.test(r.name) &&
          ((r.county ?? '').toLowerCase().includes('charlevoix') ||
            (r.county ?? '').toLowerCase().includes('emmet')),
      ) ?? rows.find((r) => /charlevoix/i.test(r.name)),
  },
];

type SvgTransform = {
  width: number;
  height: number;
  minX: number;
  maxY: number;
  scale: number;
  originX: number;
  originY: number;
};

type SummaryRow = {
  lakeLabel: string;
  matchedName: string;
  lakeId: string;
  supportStatus: string;
  totalFeatures: number;
  counts: Record<string, number>;
  qaFlags: string[];
  detectorFlags: string[];
  svgFile: string;
  jsonFile: string;
  csvFile: string;
};

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
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[k] === undefined || process.env[k] === '') process.env[k] = v;
  }
}

function slugFilePart(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 72) || 'lake'
  );
}

function escapeXmlText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function csvCell(value: unknown): string {
  const s = Array.isArray(value) ? value.join('|') : String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function summaryCsv(rows: SummaryRow[]): string {
  const classes = ['main_lake_point', 'secondary_point', 'cove', 'neck', 'saddle', 'island', 'dam', 'universal'];
  const header = [
    'lake_label',
    'matched_name',
    'lake_id',
    'support_status',
    'total_features',
    ...classes,
    'qa_flags',
    'detector_flags',
    'svg_file',
    'json_file',
  ];
  const lines = rows.map((row) =>
    [
      row.lakeLabel,
      row.matchedName,
      row.lakeId,
      row.supportStatus,
      row.totalFeatures,
      ...classes.map((cls) => row.counts[cls] ?? 0),
      row.qaFlags.join('|'),
      row.detectorFlags.join('|'),
      row.svgFile,
      row.jsonFile,
    ]
      .map(csvCell)
      .join(','),
  );
  return `${header.join(',')}\n${lines.join('\n')}\n`;
}

function featureCounts(features: WaterReaderDetectedFeature[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const feature of features) counts[feature.featureClass] = (counts[feature.featureClass] ?? 0) + 1;
  return counts;
}

function featureFlags(features: WaterReaderDetectedFeature[]): string[] {
  return Array.from(new Set(features.flatMap((feature) => feature.qaFlags).sort()));
}

function bboxForPreprocess(preprocess: WaterReaderPreprocessResult) {
  const bbox = preprocess.metrics?.bboxM;
  if (!bbox) return null;
  const w = Math.max(1, bbox.maxX - bbox.minX);
  const h = Math.max(1, bbox.maxY - bbox.minY);
  const innerW = SVG_W - PAD * 2;
  const innerH = Math.max(360, Math.min(920, (innerW * h) / w));
  const scale = Math.min(innerW / w, innerH / h);
  return {
    width: SVG_W,
    height: Math.ceil(innerH + HEADER_H + PAD * 2),
    minX: bbox.minX,
    maxY: bbox.maxY,
    scale,
    originX: PAD,
    originY: HEADER_H + PAD,
  };
}

function pt(point: PointM, t: SvgTransform): { x: number; y: number } {
  return {
    x: t.originX + (point.x - t.minX) * t.scale,
    y: t.originY + (t.maxY - point.y) * t.scale,
  };
}

function pathD(ring: RingM, t: SvgTransform, close: boolean): string {
  if (ring.length === 0) return '';
  const p0 = pt(ring[0]!, t);
  let d = `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`;
  for (let i = 1; i < ring.length; i++) {
    const p = pt(ring[i]!, t);
    d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }
  return close ? `${d} Z` : d;
}

function lakePathD(preprocess: WaterReaderPreprocessResult, t: SvgTransform): string {
  const polygon = preprocess.primaryPolygon;
  if (!polygon) return '';
  return [polygon.exterior, ...polygon.holes].map((ring) => pathD(ring, t, true)).join(' ');
}

function circle(point: PointM, t: SvgTransform, r: number, fill: string, stroke = '#ffffff'): string {
  const p = pt(point, t);
  return `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.2" />`;
}

function line(a: PointM, b: PointM, t: SvgTransform, stroke: string, width: number, dash = ''): string {
  const pa = pt(a, t);
  const pb = pt(b, t);
  const dashAttr = dash ? ` stroke-dasharray="${dash}"` : '';
  return `<line x1="${pa.x.toFixed(2)}" y1="${pa.y.toFixed(2)}" x2="${pb.x.toFixed(2)}" y2="${pb.y.toFixed(2)}" stroke="${stroke}" stroke-width="${width}"${dashAttr} />`;
}

function label(text: string, point: PointM, t: SvgTransform, dx = 8, dy = -8): string {
  const p = pt(point, t);
  return `<text x="${(p.x + dx).toFixed(1)}" y="${(p.y + dy).toFixed(1)}" font-size="10" font-family="system-ui,Segoe UI,sans-serif" font-weight="700" fill="#111827">${escapeXmlText(text)}</text>`;
}

function featureColor(featureClass: string): string {
  switch (featureClass) {
    case 'main_lake_point':
      return '#1E5FBF';
    case 'secondary_point':
      return '#6FA8DC';
    case 'cove':
      return '#2E8B57';
    case 'neck':
      return '#E67E22';
    case 'saddle':
      return '#1ABC9C';
    case 'island':
      return '#8E44AD';
    case 'dam':
      return '#C0392B';
    default:
      return '#D4A017';
  }
}

function featureLayer(features: WaterReaderDetectedFeature[], t: SvgTransform): string {
  let out = '';
  features.forEach((feature, index) => {
    const rank = index + 1;
    const color = featureColor(feature.featureClass);
    const tag = `${rank} ${feature.featureClass} ${feature.featureId}`;
    switch (feature.featureClass) {
      case 'main_lake_point':
      case 'secondary_point':
        out += line(feature.leftSlope, feature.rightSlope, t, color, 1.4, '4 3');
        out += line(feature.tip, feature.baseMidpoint, t, color, 1.2, '2 3');
        out += circle(feature.leftSlope, t, 3, color);
        out += circle(feature.rightSlope, t, 3, color);
        out += circle(feature.baseMidpoint, t, 3.5, '#111827');
        out += circle(feature.tip, t, 5, color);
        out += label(tag, feature.tip, t);
        break;
      case 'cove':
        out += `<path d="${pathD(feature.coveBoundary, t, true)}" fill="${color}" fill-opacity="0.08" stroke="${color}" stroke-width="1.2" />`;
        out += `<path d="${pathD(feature.shorePath, t, false)}" fill="none" stroke="${color}" stroke-width="2.2" />`;
        out += line(feature.mouthLeft, feature.mouthRight, t, color, 1.6, '5 3');
        out += circle(feature.mouthLeft, t, 4, color);
        out += circle(feature.mouthRight, t, 4, color);
        out += circle(feature.back, t, 5, '#0f5132');
        out += label(tag, feature.back, t);
        break;
      case 'neck':
      case 'saddle':
        out += line(feature.endpointA, feature.endpointB, t, color, 2.1, '6 4');
        out += circle(feature.endpointA, t, 5, color);
        out += circle(feature.endpointB, t, 5, color);
        out += circle(feature.center, t, 4, '#111827');
        out += label(tag, feature.center, t);
        break;
      case 'island':
        out += `<path d="${pathD(feature.ring, t, true)}" fill="${color}" fill-opacity="0.1" stroke="${color}" stroke-width="1.8" />`;
        out += line(feature.endpointA, feature.endpointB, t, color, 1.5, '3 3');
        out += circle(feature.endpointA, t, 4.5, color);
        out += circle(feature.endpointB, t, 4.5, color);
        out += label(tag, feature.endpointA, t);
        break;
      case 'dam':
        out += line(feature.cornerA, feature.cornerB, t, color, 3);
        out += circle(feature.cornerA, t, 5, color);
        out += circle(feature.cornerB, t, 5, color);
        out += label(tag, feature.cornerA, t);
        break;
      default:
        break;
    }
  });
  return out;
}

function shorelineLayer(preprocess: WaterReaderPreprocessResult, t: SvgTransform): string {
  const resampled = preprocess.resampledExterior ?? [];
  const smoothed = preprocess.smoothedExterior ?? [];
  return [
    resampled.length >= 2
      ? `<path d="${pathD(resampled, t, true)}" fill="none" stroke="#64748b" stroke-width="0.8" stroke-opacity="0.35" stroke-dasharray="2 5" />`
      : '',
    smoothed.length >= 2
      ? `<path d="${pathD(smoothed, t, true)}" fill="none" stroke="#111827" stroke-width="1" stroke-opacity="0.45" stroke-dasharray="5 5" />`
      : '',
  ].join('');
}

function buildSvg(params: {
  label: string;
  poly: WaterbodyPolygonResponse;
  preprocess: WaterReaderPreprocessResult;
  features: WaterReaderDetectedFeature[];
}): string {
  const t = bboxForPreprocess(params.preprocess);
  if (!t) throw new Error(`Cannot render SVG for ${params.label}: missing projected bbox`);
  const lakeD = lakePathD(params.preprocess, t);
  const counts = featureCounts(params.features);
  const countLine = Object.entries(counts)
    .map(([k, v]) => `${k}:${v}`)
    .join('  ') || 'no features';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${t.width}" height="${t.height}" viewBox="0 0 ${t.width} ${t.height}">
  <rect width="100%" height="100%" fill="#f8fafc"/>
  <text x="18" y="24" font-size="17" font-family="system-ui,Segoe UI,sans-serif" font-weight="800" fill="#0f172a">${escapeXmlText(params.poly.name ?? params.label)}</text>
  <text x="18" y="46" font-size="12" font-family="system-ui,Segoe UI,sans-serif" fill="#334155">${escapeXmlText(`${params.label} | ${params.preprocess.supportStatus} | ${countLine}`)}</text>
  <text x="18" y="65" font-size="11" font-family="system-ui,Segoe UI,sans-serif" fill="#64748b">${escapeXmlText(params.preprocess.supportReason)}</text>
  <path d="${lakeD}" fill="#c5ddf0" fill-rule="evenodd" stroke="#2a5f87" stroke-width="1.3"/>
  ${shorelineLayer(params.preprocess, t)}
  ${featureLayer(params.features, t)}
</svg>
`;
}

function debugJson(params: {
  matrixCase: MatrixCase;
  row: WaterbodySearchResult;
  poly: WaterbodyPolygonResponse;
  preprocess: WaterReaderPreprocessResult;
  features: WaterReaderDetectedFeature[];
  coveSuppressions: Record<string, number>;
  featurePruning: Record<string, number>;
}) {
  return {
    lakeLabel: params.matrixCase.label,
    matchedName: params.poly.name,
    lakeId: params.row.lakeId,
    supportStatus: params.preprocess.supportStatus,
    supportReason: params.preprocess.supportReason,
    metrics: params.preprocess.metrics,
    qaFlags: params.preprocess.qaFlags,
    preprocessCounts: {
      resampledExterior: params.preprocess.resampledExterior?.length ?? 0,
      simplifiedExterior: params.preprocess.simplifiedExterior?.length ?? 0,
      smoothedExterior: params.preprocess.smoothedExterior?.length ?? 0,
    },
    features: params.features,
    detectorDiagnostics: {
      coveSuppressions: params.coveSuppressions,
      featurePruning: params.featurePruning,
    },
    debugCues: featureDebugCues(params.features),
  };
}

async function main() {
  loadDotEnvIfPresent();
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, '');
  const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const email = process.env.WATER_READER_TEST_EMAIL?.trim();
  const password = process.env.WATER_READER_TEST_PASSWORD?.trim();
  if (!url || !anon || !email || !password) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_* or WATER_READER_TEST_EMAIL / WATER_READER_TEST_PASSWORD.');
  }

  const supabase = createClient(url, anon);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session?.access_token) throw new Error(`Auth failed: ${error?.message ?? 'no session'}`);
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
    if (!res.ok) throw new Error(`${name} HTTP ${res.status}: ${text.slice(0, 300)}`);
    return JSON.parse(text) as T;
  }

  const absOut = resolve(process.cwd(), OUT_DIR);
  mkdirSync(absOut, { recursive: true });
  const rows: SummaryRow[] = [];

  for (const matrixCase of CASES) {
    const search = await edge<WaterbodySearchResponse>('waterbody-search', {
      query: matrixCase.searchQuery,
      state: 'MI',
      limit: SEARCH_LIMIT,
    });
    const row = matrixCase.find(search.results);
    if (!row) throw new Error(`No search match for ${matrixCase.label}`);
    const poly = await edge<WaterbodyPolygonResponse>('waterbody-polygon', { lakeId: row.lakeId });
    if (!poly.geojson) throw new Error(`No polygon GeoJSON for ${matrixCase.label}`);

    const preprocess = preprocessWaterReaderGeometry({
      lakeId: row.lakeId,
      name: poly.name,
      state: poly.state,
      acreage: poly.areaAcres ?? row.polygonAreaAcres ?? row.surfaceAreaAcres ?? null,
      geojson: poly.geojson as WaterbodyPolygonGeoJson,
    });
    const features = detectWaterReaderFeatures(preprocess, {
      lakeId: row.lakeId,
      name: poly.name,
      state: poly.state,
      acreage: poly.areaAcres ?? row.polygonAreaAcres ?? row.surfaceAreaAcres ?? null,
      geojson: poly.geojson as WaterbodyPolygonGeoJson,
    });
    const coveSuppressions = getLastCoveSuppressionSummary();
    const featurePruning = getLastFeaturePruningSummary();

    const slug = slugFilePart(matrixCase.label);
    const svgFile = `${slug}-features.svg`;
    const jsonFile = `${slug}-debug.json`;
    const csvFile = `${slug}-summary.csv`;
    const detectorFlags = Array.from(
      new Set([
        ...featureFlags(features),
        ...Object.entries(coveSuppressions)
          .filter(([, count]) => count > 0)
          .map(([flag]) => flag),
        ...Object.entries(featurePruning)
          .filter(([, count]) => count > 0)
          .map(([flag]) => `final_pruning_${flag}`),
      ]),
    ).sort();
    const summary: SummaryRow = {
      lakeLabel: matrixCase.label,
      matchedName: poly.name,
      lakeId: row.lakeId,
      supportStatus: preprocess.supportStatus,
      totalFeatures: features.length,
      counts: featureCounts(features),
      qaFlags: preprocess.qaFlags,
      detectorFlags,
      svgFile: `${OUT_DIR}/${svgFile}`,
      jsonFile: `${OUT_DIR}/${jsonFile}`,
      csvFile: `${OUT_DIR}/${csvFile}`,
    };

    writeFileSync(join(absOut, svgFile), buildSvg({ label: matrixCase.label, poly, preprocess, features }), 'utf8');
    writeFileSync(
      join(absOut, jsonFile),
      `${JSON.stringify(debugJson({ matrixCase, row, poly, preprocess, features, coveSuppressions, featurePruning }), null, 2)}\n`,
      'utf8',
    );
    writeFileSync(join(absOut, csvFile), summaryCsv([summary]), 'utf8');
    rows.push(summary);
    console.log(JSON.stringify({ lake: matrixCase.label, features: features.length, files: { svgFile, jsonFile, csvFile } }));
  }

  if (rows.length !== CASES.length) throw new Error(`Expected ${CASES.length} review rows, produced ${rows.length}`);
  const combined = 'feature-review-summary.csv';
  writeFileSync(join(absOut, combined), summaryCsv(rows), 'utf8');
  writeFileSync(
    join(absOut, 'feature-review-manifest.json'),
    `${JSON.stringify({ outputDir: OUT_DIR, lakes: rows }, null, 2)}\n`,
    'utf8',
  );
  console.log(JSON.stringify({ ok: true, outputDir: OUT_DIR, lakeCount: rows.length, summary: `${OUT_DIR}/${combined}` }));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
