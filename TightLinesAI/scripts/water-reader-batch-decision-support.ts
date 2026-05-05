import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, relative, resolve } from 'path';
import {
  buildWaterReaderDisplayModel,
  type PolygonM,
  type WaterReaderDisplayModel,
  type WaterReaderLegendEntry,
  type WaterReaderZonePlacementResult,
} from '../lib/water-reader-engine';

const SOURCE_ROOT = 'tmp/water-reader-50-lake-tuning/chunk-7m-review-ready-full-matrix';
const OUT_ROOT_7N = 'tmp/water-reader-50-lake-tuning/chunk-7n-batch-1-spring-decision-support';
const OUT_ROOT_7O = 'tmp/water-reader-50-lake-tuning/chunk-7o-display-policy-tuning';
const OUT_ROOT_7OR = 'tmp/water-reader-50-lake-tuning/chunk-7o-r-corrective-display-policy';
let OUT_ROOT = OUT_ROOT_7N;
const APP_WIDTH = 420;
const DEFAULT_RENDER_PADDING = 28;

type EntryState = 'displayed' | 'retained';

type Footprint = {
  width: number;
  height: number;
  area: number;
  minDimension: number;
  maxDimension: number;
  bbox: { minX: number; minY: number; maxX: number; maxY: number } | null;
  source: string;
  tiny_min_dimension_lt_6: boolean;
  tiny_max_dimension_lt_12: boolean;
  tiny_area_lt_100: boolean;
  tiny_any: boolean;
};

type EntryDiagnostic = {
  rowId: string;
  lake: string;
  entryState: EntryState;
  displayNumber: number | null;
  entryId: string;
  legendTitle: string;
  featureClasses: string[];
  placementKinds: string[];
  sourceFeatureIds: string[];
  zoneIds: string[];
  majorAxisM: number;
  majorAxisPctOfLakeLongestDimension: number | null;
  anchorSemanticIds: string[];
  placementSemanticIds: string[];
  rankingPriority: number | null;
  rankingScore: number | null;
  confluenceStrengthRank: number | null;
  rankingDiagnostics: string[];
  retainedReason: string;
  footprint: Footprint;
  appearsVisuallyLargerThanTinyDisplayed: boolean;
  structurallyMoreUsefulThanTinyDisplayed: boolean;
};

type SemanticAudit = {
  rowId: string;
  lake: string;
  displayNumber: number | null;
  entryId: string;
  legendTitle: string;
  featureClasses: string[];
  placementKinds: string[];
  anchorSemanticIds: string[];
  placementSemanticIds: string[];
  flags: string[];
  notes: string[];
};

type RowDiagnostic = {
  rowId: string;
  lake: string;
  state: string;
  county: string;
  season: string;
  reviewDate: string;
  founderConcernSummary: string[];
  sourceLinks: Record<string, string>;
  rowSummary: Record<string, unknown>;
  displayedEntries: EntryDiagnostic[];
  retainedEntries: EntryDiagnostic[];
  semanticAudit: SemanticAudit[];
  rankingEvidence: Record<string, unknown>;
  rowQuestions: Record<string, unknown>;
  detectedFeatureClassCounts: Record<string, number>;
  rawCandidateSummary: Record<string, unknown>;
};

const BATCH_ROWS = [
  {
    rowId: '01-van-norman-lake-mi-spring',
    concerns: ['Founder-known reference lake'],
  },
  {
    rowId: '02-pontiac-lake-mi-spring',
    concerns: ['Founder-known reference lake', 'Founder liked zone 3', 'Founder flagged tiny displayed zones'],
  },
  {
    rowId: '03-mullett-lake-mi-spring',
    concerns: ['Founder flagged point dominance', 'Founder questioned cove label'],
  },
  {
    rowId: '04-lake-charlevoix-mi-spring',
    concerns: ['Founder flagged border/readability issue', 'Founder questioned cove label'],
  },
  {
    rowId: '05-higgins-lake-mi-spring',
    concerns: ['Founder questioned missed island', 'Founder flagged tiny displayed zones'],
  },
  {
    rowId: '08-lake-winnebago-wi-spring',
    concerns: ['Founder suspected missing structure'],
  },
  {
    rowId: '22-lake-palestine-tx-spring',
    concerns: ['Founder flagged tiny displayed zones'],
  },
  {
    rowId: '34-brookville-lake-in-spring',
    concerns: ['Founder suspected missed neck', 'Founder flagged tiny displayed zones'],
  },
  {
    rowId: '36-lake-wylie-nc-spring',
    concerns: ['Founder flagged tiny displayed zones', 'Founder questioned structural usefulness'],
  },
  {
    rowId: '42-lake-tahoe-ca-spring',
    concerns: ['Control row for comparison'],
  },
] as const;

const CANARY_ROWS = [
  '03-mullett-lake-mi-summer',
  '04-lake-charlevoix-mi-summer',
  '05-higgins-lake-mi-fall',
  '22-lake-palestine-tx-summer',
  '34-brookville-lake-in-spring',
  '36-lake-wylie-nc-spring',
  '42-lake-tahoe-ca-spring',
] as const;

type BatchMode = 'batch-1-spring' | 'batch-1-spring-7o' | 'batch-1-spring-7o-r';

function parseCliOptions(argv = process.argv.slice(2)): { batch: BatchMode } {
  let batch = 'batch-1-spring';
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg.startsWith('--batch=')) {
      batch = arg.slice('--batch='.length);
    } else if (arg === '--batch') {
      const value = argv[i + 1];
      if (!value) throw new Error('Missing value after --batch.');
      batch = value;
      i++;
    } else {
      throw new Error(`Unknown argument "${arg}".`);
    }
  }
  if (batch !== 'batch-1-spring' && batch !== 'batch-1-spring-7o' && batch !== 'batch-1-spring-7o-r') {
    throw new Error(`Unsupported batch "${batch}".`);
  }
  return { batch };
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8'));
}

function readText(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

function writeText(path: string, value: string) {
  writeFileSync(resolve(process.cwd(), path), value, 'utf8');
}

function round(value: number, digits = 2): number {
  return Number.isFinite(value) ? Number(value.toFixed(digits)) : 0;
}

function csvCell(value: unknown): string {
  const s = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function stripSvgForInline(svg: string): string {
  return svg.replace(/<\?xml[^>]*>\s*/i, '').replace(/^\s+/, '');
}

function numbersFromPath(d: string): number[] {
  return (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number).filter(Number.isFinite);
}

function pointsFromPath(d: string): Array<{ x: number; y: number }> {
  const nums = numbersFromPath(d);
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    points.push({ x: nums[i]!, y: nums[i + 1]! });
  }
  return points;
}

function bboxForPoints(points: Array<{ x: number; y: number }>): Footprint['bbox'] {
  if (points.length === 0) return null;
  return points.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxX: Math.max(acc.maxX, point.x),
      maxY: Math.max(acc.maxY, point.y),
    }),
    { minX: points[0]!.x, minY: points[0]!.y, maxX: points[0]!.x, maxY: points[0]!.y },
  );
}

function footprintFromBbox(bbox: Footprint['bbox'], source: string): Footprint {
  const width = bbox ? Math.max(0, bbox.maxX - bbox.minX) : 0;
  const height = bbox ? Math.max(0, bbox.maxY - bbox.minY) : 0;
  const area = width * height;
  const minDimension = Math.min(width, height);
  const maxDimension = Math.max(width, height);
  return {
    width: round(width),
    height: round(height),
    area: round(area),
    minDimension: round(minDimension),
    maxDimension: round(maxDimension),
    bbox: bbox ? {
      minX: round(bbox.minX),
      minY: round(bbox.minY),
      maxX: round(bbox.maxX),
      maxY: round(bbox.maxY),
    } : null,
    source,
    tiny_min_dimension_lt_6: minDimension < 6,
    tiny_max_dimension_lt_12: maxDimension < 12,
    tiny_area_lt_100: area < 100,
    tiny_any: minDimension < 6 || maxDimension < 12 || area < 100,
  };
}

function parseSvgEntryPathPoints(svg: string): Map<string, Array<{ x: number; y: number }>> {
  const byEntry = new Map<string, Array<{ x: number; y: number }>>();
  const standalone = /<path\b[^>]*class="[^"]*\bwater-reader-entry\b[^"]*"[^>]*data-entry-id="([^"]+)"[^>]*d="([^"]+)"/g;
  for (const match of svg.matchAll(standalone)) {
    const entryId = match[1]!;
    const points = pointsFromPath(match[2]!);
    byEntry.set(entryId, [...(byEntry.get(entryId) ?? []), ...points]);
  }
  const confluence = /<g\b[^>]*class="[^"]*\bwater-reader-entry\b[^"]*\bwater-reader-confluence\b[^"]*"[^>]*data-entry-id="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g;
  for (const match of svg.matchAll(confluence)) {
    const entryId = match[1]!;
    const inner = match[2]!;
    const points: Array<{ x: number; y: number }> = [];
    for (const pathMatch of inner.matchAll(/<path\b[^>]*d="([^"]+)"/g)) {
      points.push(...pointsFromPath(pathMatch[1]!));
    }
    byEntry.set(entryId, [...(byEntry.get(entryId) ?? []), ...points]);
  }
  return byEntry;
}

function inferSvgTransform(displayedEntries: any[], svgPointsByEntry: Map<string, Array<{ x: number; y: number }>>) {
  for (const entry of displayedEntries) {
    const svgPoints = svgPointsByEntry.get(entry.entryId);
    const zone = entry.zones?.[0];
    if (!svgPoints || svgPoints.length < 2 || !zone) continue;
    const candidates = [zone.unclippedRing, zone.visibleWaterRing].filter((ring) => Array.isArray(ring) && ring.length >= 2);
    for (const ring of candidates) {
      for (let offset = 0; offset <= Math.max(0, svgPoints.length - ring.length); offset++) {
        for (let i = 1; i < ring.length; i++) {
          const w0 = ring[0]!;
          const w1 = ring[i]!;
          const s0 = svgPoints[offset]!;
          const s1 = svgPoints[offset + i]!;
          const worldDistance = Math.hypot(w1.x - w0.x, w1.y - w0.y);
          const svgDistance = Math.hypot(s1.x - s0.x, s1.y - s0.y);
          if (worldDistance <= 0 || svgDistance <= 0) continue;
          const scale = svgDistance / worldDistance;
          const minX = w0.x - (s0.x - DEFAULT_RENDER_PADDING) / scale;
          const maxY = w0.y + (s0.y - DEFAULT_RENDER_PADDING) / scale;
          return { scale, minX, maxY, padding: DEFAULT_RENDER_PADDING };
        }
      }
    }
  }
  return null;
}

function transformPoints(points: Array<{ x: number; y: number }>, transform: { scale: number; minX: number; maxY: number; padding: number }) {
  return points.map((point) => ({
    x: transform.padding + (point.x - transform.minX) * transform.scale,
    y: transform.padding + (transform.maxY - point.y) * transform.scale,
  }));
}

function inverseTransformPoint(point: { x: number; y: number }, transform: { scale: number; minX: number; maxY: number; padding: number }) {
  return {
    x: transform.minX + (point.x - transform.padding) / transform.scale,
    y: transform.maxY - (point.y - transform.padding) / transform.scale,
  };
}

function pathForRing(points: Array<{ x: number; y: number }>, transform: { scale: number; minX: number; maxY: number; padding: number }): string {
  if (points.length === 0) return '';
  const transformed = transformPoints(points, transform);
  const first = transformed[0]!;
  const parts = [`M ${round(first.x)} ${round(first.y)}`];
  for (let i = 1; i < transformed.length; i++) {
    const point = transformed[i]!;
    parts.push(`L ${round(point.x)} ${round(point.y)}`);
  }
  parts.push('Z');
  return parts.join(' ');
}

function syntheticLakePolygonFromSvg(appSvg: string, transform: ReturnType<typeof inferSvgTransform>): PolygonM | null {
  if (!transform) return null;
  const lakePath = appSvg.match(/<path\b[^>]*class="[^"]*\bwater-reader-lake\b[^"]*"[^>]*d="([^"]+)"/)?.[1] ?? '';
  const svgBounds = bboxForPoints(pointsFromPath(lakePath));
  if (!svgBounds) return null;
  const minWorld = inverseTransformPoint({ x: svgBounds.minX, y: svgBounds.maxY }, transform);
  const maxWorld = inverseTransformPoint({ x: svgBounds.maxX, y: svgBounds.minY }, transform);
  return {
    exterior: [
      { x: minWorld.x, y: minWorld.y },
      { x: maxWorld.x, y: minWorld.y },
      { x: maxWorld.x, y: maxWorld.y },
      { x: minWorld.x, y: maxWorld.y },
      { x: minWorld.x, y: minWorld.y },
    ],
    holes: [],
  };
}

function zoneResultFromRowJson(rowJson: any): WaterReaderZonePlacementResult {
  return {
    zones: rowJson.placement.zones ?? rowJson.display.model.rawZones ?? [],
    season: rowJson.row.season,
    seasonGroup: null,
    qaFlags: rowJson.placement.qaFlags ?? [],
    diagnostics: rowJson.placement.diagnostics,
  } as WaterReaderZonePlacementResult;
}

function buildTunedDisplayModel(rowJson: any, appSvg: string): { displayModel: WaterReaderDisplayModel; transform: ReturnType<typeof inferSvgTransform> } {
  const svgPointsByEntry = parseSvgEntryPathPoints(appSvg);
  const transform = inferSvgTransform(rowJson.display.displayedEntries ?? [], svgPointsByEntry);
  const lakePolygon = syntheticLakePolygonFromSvg(appSvg, transform);
  const displayModel = buildWaterReaderDisplayModel(
    zoneResultFromRowJson(rowJson),
    rowJson.legend.entries as WaterReaderLegendEntry[],
    {
      acreage: rowJson.input.acreage,
      longestDimensionM: rowJson.preprocess.metrics?.longestDimensionM,
      lakePolygon,
      appMapWidth: APP_WIDTH,
      renderPadding: DEFAULT_RENDER_PADDING,
    },
  );
  return { displayModel, transform };
}

function buildCorrectiveDisplayModel(rowJson: any): WaterReaderDisplayModel {
  return buildWaterReaderDisplayModel(
    zoneResultFromRowJson(rowJson),
    rowJson.legend.entries as WaterReaderLegendEntry[],
    {
      acreage: rowJson.input.acreage,
      longestDimensionM: rowJson.preprocess.metrics?.longestDimensionM,
      appMapWidth: APP_WIDTH,
      renderPadding: DEFAULT_RENDER_PADDING,
    },
  );
}

function entryFootprint(entry: any, svgPointsByEntry: Map<string, Array<{ x: number; y: number }>>, transform: ReturnType<typeof inferSvgTransform>, state: EntryState): Footprint {
  if (transform) {
    const points = (entry.zones ?? []).flatMap((zone: any) => (
      Array.isArray(zone.visibleWaterRing) && zone.visibleWaterRing.length >= 2
        ? zone.visibleWaterRing
        : Array.isArray(zone.unclippedRing) ? zone.unclippedRing : []
    ));
    if (points.length > 0) {
      return footprintFromBbox(bboxForPoints(transformPoints(points, transform)), state === 'displayed' ? 'app_svg_transform_visible_ring' : 'app_svg_transform_retained_visible_ring');
    }
  }
  return footprintFromBbox(bboxForPoints(svgPointsByEntry.get(entry.entryId) ?? []), state === 'displayed' ? 'app_svg_path_bbox_fallback' : 'retained_not_rendered_no_svg_bbox');
}

function renderTunedAppSvg(params: {
  row: any;
  baselineSvg: string;
  displayModel: WaterReaderDisplayModel;
  transform: ReturnType<typeof inferSvgTransform>;
}): string {
  const viewBox = params.baselineSvg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 420 760';
  const lakePath = params.baselineSvg.match(/<path\b[^>]*class="[^"]*\bwater-reader-lake\b[^"]*"[^>]*d="([^"]+)"/)?.[1] ?? '';
  const transform = params.transform;
  const zoneMarkup = params.displayModel.displayedEntries.map((entry) => {
    if (!transform) return '';
    if (entry.entryType === 'structure_confluence') {
      const members = entry.zones.map((zone) => {
        const ring = zone.visibleWaterRing.length >= 3 ? zone.visibleWaterRing : zone.unclippedRing;
        const d = pathForRing(ring, transform);
        return `<path class="water-reader-entry water-reader-confluence-member" data-entry-id="${escapeHtml(entry.entryId)}" data-display-number="${entry.displayNumber ?? ''}" d="${d}" fill="#D946EF" fill-opacity="0.24" stroke="#D946EF" stroke-opacity="0.58" stroke-width="1.1"/>`;
      }).join('');
      return `<g class="water-reader-entry water-reader-confluence" data-entry-id="${escapeHtml(entry.entryId)}" data-display-number="${entry.displayNumber ?? ''}">${members}</g>`;
    }
    const zone = entry.zones[0];
    if (!zone) return '';
    return `<path class="water-reader-entry water-reader-standalone-zone" data-entry-id="${escapeHtml(entry.entryId)}" data-zone-id="${escapeHtml(entry.zoneIds[0] ?? '')}" data-display-number="${entry.displayNumber ?? ''}" d="${pathForRing(zone.unclippedRing, transform)}" fill="${entry.colorHex}" fill-opacity="0.34" stroke="${entry.colorHex}" stroke-opacity="0.94" stroke-width="1.4"/>`;
  }).filter(Boolean).join('\n      ');
  const labels = params.displayModel.displayedEntries.map((entry) => {
    if (!transform) return '';
    const points = entry.zones.flatMap((zone) => zone.visibleWaterRing.length >= 3 ? zone.visibleWaterRing : zone.unclippedRing);
    const bbox = bboxForPoints(transformPoints(points, transform));
    if (!bbox) return '';
    const x = (bbox.minX + bbox.maxX) / 2;
    const y = (bbox.minY + bbox.maxY) / 2;
    return `<g class="water-reader-map-number" data-entry-id="${escapeHtml(entry.entryId)}" data-display-number="${entry.displayNumber ?? ''}">
        <circle cx="${round(x)}" cy="${round(y)}" r="9.5" fill="#fff" stroke="#0F172A" stroke-width="1"/>
        <text x="${round(x)}" y="${round(y + 0.2)}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10" font-weight="850" fill="#0F172A" text-anchor="middle" dominant-baseline="central">${entry.displayNumber ?? ''}</text>
      </g>`;
  }).filter(Boolean).join('\n      ');
  const legend = params.displayModel.displayLegendEntries.map((entry) =>
    `<li><b>${entry.number}. ${escapeHtml(entry.title)}</b><span>${escapeHtml(entry.featureClass ?? '')}</span></li>`,
  ).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${escapeHtml(params.row.lake)} tuned Water Reader diagnostic">
  <rect width="100%" height="100%" fill="#F7FAFC"/>
  <path class="water-reader-lake" d="${lakePath}" fill="#CFE6F7" fill-rule="evenodd" stroke="#275D7F" stroke-width="1.35"/>
  <g class="water-reader-zones">
      ${zoneMarkup}
  </g>
  <g class="water-reader-labels">
      ${labels}
  </g>
  <foreignObject x="18" y="520" width="384" height="220">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;color:#0f172a;background:rgba(255,255,255,.88);border:1px solid #dbe3ef;border-radius:6px;padding:8px;">
      <strong>Tuned display selection</strong>
      <ol style="margin:6px 0 0 18px;padding:0;">${legend}</ol>
    </div>
  </foreignObject>
</svg>
`;
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function entrySort(entry: any) {
  return entry.sort ?? {};
}

function entryAnchorIds(entry: any): string[] {
  return unique((entry.zones ?? []).map((zone: any) => zone.anchorSemanticId ?? ''));
}

function entryPlacementIds(entry: any): string[] {
  return unique((entry.zones ?? []).map((zone: any) => zone.placementSemanticId ?? ''));
}

function makeEntryDiagnostic(params: {
  row: any;
  entry: any;
  state: EntryState;
  footprint: Footprint;
  tinyDisplayedEntries: any[];
}): EntryDiagnostic {
  const sort = entrySort(params.entry);
  const tinyAreaMax = Math.max(0, ...params.tinyDisplayedEntries.map((entry) => entry.footprint.area));
  const tinyMajorMin = Math.min(...params.tinyDisplayedEntries.map((entry) => entry.majorAxisM).filter((value) => Number.isFinite(value)));
  const appearsLarger = params.state === 'retained' && params.tinyDisplayedEntries.length > 0 && (
    params.footprint.area > tinyAreaMax * 1.5 ||
    (Number.isFinite(tinyMajorMin) && params.entry.majorAxisM > tinyMajorMin * 1.25)
  );
  const usefulClasses = new Set(['cove', 'main_lake_point', 'saddle']);
  const tinyClasses = new Set(params.tinyDisplayedEntries.flatMap((entry) => entry.featureClasses));
  const structurallyMoreUseful = params.state === 'retained' &&
    params.tinyDisplayedEntries.length > 0 &&
    (params.entry.featureClasses ?? []).some((featureClass: string) => usefulClasses.has(featureClass)) &&
    [...tinyClasses].some((featureClass) => featureClass === 'neck' || featureClass === 'island');
  return {
    rowId: params.row.rowId,
    lake: params.row.lake,
    entryState: params.state,
    displayNumber: params.entry.displayNumber ?? null,
    entryId: params.entry.entryId,
    legendTitle: params.entry.legend?.title ?? '',
    featureClasses: params.entry.featureClasses ?? [],
    placementKinds: params.entry.placementKinds ?? [],
    sourceFeatureIds: params.entry.sourceFeatureIds ?? [],
    zoneIds: params.entry.zoneIds ?? [],
    majorAxisM: round(params.entry.majorAxisM ?? 0, 1),
    majorAxisPctOfLakeLongestDimension: params.entry.majorAxisPctOfLakeLongestDimension === null ? null : round(params.entry.majorAxisPctOfLakeLongestDimension ?? 0, 3),
    anchorSemanticIds: entryAnchorIds(params.entry),
    placementSemanticIds: entryPlacementIds(params.entry),
    rankingPriority: Number.isFinite(sort.priority) ? sort.priority : null,
    rankingScore: Number.isFinite(sort.score) ? round(sort.score, 2) : null,
    confluenceStrengthRank: Number.isFinite(sort.confluenceStrengthRank) ? sort.confluenceStrengthRank : null,
    rankingDiagnostics: params.entry.rankingDiagnostics ?? [],
    retainedReason: params.state === 'retained' ? `retained_not_displayed_cap;display_cap=${params.row.displayCap}` : '',
    footprint: params.footprint,
    appearsVisuallyLargerThanTinyDisplayed: appearsLarger,
    structurallyMoreUsefulThanTinyDisplayed: structurallyMoreUseful,
  };
}

function semanticAuditForEntry(row: any, entry: any, footprint: Footprint): SemanticAudit {
  const flags: string[] = [];
  const notes: string[] = [];
  const title = entry.legend?.title ?? '';
  const classes = entry.featureClasses ?? [];
  const kinds = entry.placementKinds ?? [];
  const anchors = entryAnchorIds(entry);
  const placements = entryPlacementIds(entry);
  const hasClass = (name: string) => classes.includes(name);

  const titleClassPairs: Array<[string, string]> = [
    ['Cove', 'cove'],
    ['Island', 'island'],
    ['Neck', 'neck'],
    ['Saddle', 'saddle'],
    ['Point', 'main_lake_point'],
    ['Dam', 'dam'],
  ];
  for (const [text, featureClass] of titleClassPairs) {
    if (title.includes(text) && featureClass === 'main_lake_point') {
      if (!hasClass('main_lake_point') && !hasClass('secondary_point')) flags.push('legend_feature_family_mismatch');
    } else if (title.includes(text) && !hasClass(featureClass)) {
      flags.push('legend_feature_family_mismatch');
    }
  }

  if (hasClass('cove')) {
    if (kinds.includes('cove_back') && anchors.includes('cove_back_primary')) notes.push('cove_true_back_shoreline');
    if (anchors.some((anchor) => anchor.includes('cove_back_pocket_recovery'))) {
      flags.push('cove_back_pocket_recovery_label_review');
      notes.push('cove_back_pocket_recovery');
    }
    if (anchors.some((anchor) => anchor.includes('cove_inner_shoreline'))) {
      flags.push('cove_inner_shoreline_label_review');
      notes.push('cove_inner_shoreline');
    }
    if (anchors.some((anchor) => anchor.includes('cove_mouth_shoulder_recovery'))) {
      flags.push('cove_mouth_shoulder_recovery_label_review');
      notes.push('cove_mouth_shoulder_recovery');
    }
    if (title.includes('Back Shoreline') && !anchors.includes('cove_back_primary')) flags.push('cove_back_title_not_true_back_primary');
    if (title.includes('Mouth Shoulder') && !kinds.includes('cove_mouth')) flags.push('cove_mouth_title_on_recovery_anchor');
  }

  if (hasClass('island')) {
    if (kinds.includes('island_mainland') && anchors.includes('island_mainland_primary')) notes.push('island_true_mainland_facing_edge');
    if (anchors.some((anchor) => anchor.includes('recovery'))) flags.push('island_recovery_anchor_review');
    if (footprint.tiny_any) flags.push('tiny_island_readability_review');
  }

  if (anchors.some((anchor, index) => placements[index] && anchor !== placements[index])) {
    flags.push('anchor_placement_semantic_mismatch');
  }
  if (anchors.some((anchor) => anchor.includes('recovery'))) {
    flags.push('recovery_semantics_review');
  }

  return {
    rowId: row.rowId,
    lake: row.lake,
    displayNumber: entry.displayNumber ?? null,
    entryId: entry.entryId,
    legendTitle: title,
    featureClasses: classes,
    placementKinds: kinds,
    anchorSemanticIds: anchors,
    placementSemanticIds: placements,
    flags: unique(flags),
    notes: unique(notes),
  };
}

function countValues(values: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}

function rankingEvidence(row: any, displayed: EntryDiagnostic[], retained: EntryDiagnostic[]) {
  const tinyDisplayed = displayed.filter((entry) => entry.footprint.tiny_any);
  const retainedLargerThanTiny = retained.filter((entry) => entry.appearsVisuallyLargerThanTinyDisplayed);
  const tinyBeatLarger = tinyDisplayed.some((displayedEntry) =>
    retained.some((retainedEntry) => retainedEntry.majorAxisM > displayedEntry.majorAxisM * 1.25 || retainedEntry.footprint.area > displayedEntry.footprint.area * 1.5),
  );
  const classPriorityDominates = tinyDisplayed.some((displayedEntry) =>
    retained.some((retainedEntry) =>
      retainedEntry.rankingPriority !== null &&
      displayedEntry.rankingPriority !== null &&
      displayedEntry.rankingPriority < retainedEntry.rankingPriority &&
      (retainedEntry.majorAxisM > displayedEntry.majorAxisM * 1.25 || retainedEntry.footprint.area > displayedEntry.footprint.area * 1.5),
    ),
  );
  const classCounts = countValues(displayed.flatMap((entry) => entry.featureClasses));
  const titleCounts = countValues(displayed.map((entry) => entry.legendTitle).filter(Boolean));
  const pointCount = classCounts.main_lake_point ?? 0;
  const maxTitleCount = Math.max(0, ...Object.values(titleCounts));
  const repeatedFamily = pointCount >= 4 || (displayed.length >= 5 && pointCount / displayed.length >= 0.5) || maxTitleCount >= 4;
  const displayCapPressure = retained.length > 0;
  const majorAxisFallback = (row.majorAxisRankingFallbackCount ?? 0) > 0;
  return {
    tinyDisplayedCount: tinyDisplayed.length,
    tinyDisplayedEntryIds: tinyDisplayed.map((entry) => entry.entryId),
    retainedLargerThanTinyCount: retainedLargerThanTiny.length,
    retainedLargerThanTinyEntryIds: retainedLargerThanTiny.map((entry) => entry.entryId),
    tinyDisplayedBeatsLargerRetainedAlternative: tinyBeatLarger,
    classPriorityAppearsToDominateStructuralUsefulness: classPriorityDominates,
    repeatedSameFeatureFamilyDominatesDisplay: repeatedFamily,
    displayedFeatureClassCounts: classCounts,
    displayedLegendTitleCounts: titleCounts,
    displayCapPressure,
    majorAxisFallbackRankingUsed: majorAxisFallback,
    likelyRankingDisplayPolicyIssue: tinyBeatLarger || classPriorityDominates || (displayCapPressure && tinyDisplayed.length > 0) || repeatedFamily,
  };
}

function rowQuestionAnswers(rowJson: any, rowDiag: RowDiagnostic) {
  const rowId = rowDiag.rowId;
  const displayed = rowDiag.displayedEntries;
  const retained = rowDiag.retainedEntries;
  const questions: Record<string, unknown> = {};
  const tinyDisplayed = displayed.filter((entry) => entry.footprint.tiny_any);
  const largerRetained = retained.filter((entry) => entry.appearsVisuallyLargerThanTinyDisplayed || entry.structurallyMoreUsefulThanTinyDisplayed);

  if (rowId.startsWith('01-')) {
    const detectedIslandCount = rowJson.rawCandidates.detectedFeatures.filter((feature: any) => feature.featureClass === 'island').length;
    questions.vanNormanPolygonEvidence = {
      polygonMetadataInteriorRingCount: rowJson.polygonMetadata.interiorRingCount,
      preprocessPrimaryHoleCount: rowJson.preprocess.primaryHoleCount,
      detectedIslandCount,
      baselinePolygonArtifactContainsIslandHole: rowJson.polygonMetadata.interiorRingCount > 0 || rowJson.preprocess.primaryHoleCount > 0,
    };
  }
  if (rowId.startsWith('02-')) {
    const zone2 = displayed.find((entry) => entry.displayNumber === 2);
    questions.pontiacZone2 = zone2 ? {
      footprint: zone2.footprint,
      whyDisplayed: {
        rankingPriority: zone2.rankingPriority,
        rankingScore: zone2.rankingScore,
        confluenceStrengthRank: zone2.confluenceStrengthRank,
        rankingDiagnostics: zone2.rankingDiagnostics,
        featureClasses: zone2.featureClasses,
        placementKinds: zone2.placementKinds,
      },
    } : null;
  }
  if (rowId.startsWith('03-')) {
    questions.mullettPointDominance = {
      displayedPointCount: displayed.filter((entry) => entry.featureClasses.includes('main_lake_point')).length,
      displayedCount: displayed.length,
      retainedPointAlternatives: retained.filter((entry) => entry.featureClasses.includes('main_lake_point')).map((entry) => ({ entryId: entry.entryId, majorAxisM: entry.majorAxisM, zoneIds: entry.zoneIds })),
    };
    questions.mullettCove56Semantics = displayed
      .filter((entry) => entry.displayNumber === 5 || entry.displayNumber === 6)
      .map((entry) => ({
        displayNumber: entry.displayNumber,
        title: entry.legendTitle,
        placementKinds: entry.placementKinds,
        anchorSemanticIds: entry.anchorSemanticIds,
        placementSemanticIds: entry.placementSemanticIds,
      }));
  }
  if (rowId.startsWith('04-')) {
    const zone1 = displayed.find((entry) => entry.displayNumber === 1);
    const zone7 = displayed.find((entry) => entry.displayNumber === 7);
    questions.charlevoixZone1Confluence = zone1 ? {
      footprint: zone1.footprint,
      borderPressure: footprintBorderPressure(zone1.footprint),
      ranking: {
        rankingPriority: zone1.rankingPriority,
        confluenceStrengthRank: zone1.confluenceStrengthRank,
        rankingDiagnostics: zone1.rankingDiagnostics,
      },
    } : null;
    questions.charlevoixZone7CoveMouthShoulder = zone7 ? {
      title: zone7.legendTitle,
      footprint: zone7.footprint,
      placementKinds: zone7.placementKinds,
      anchorSemanticIds: zone7.anchorSemanticIds,
      placementSemanticIds: zone7.placementSemanticIds,
      semanticFlags: rowDiag.semanticAudit.find((audit) => audit.entryId === zone7.entryId)?.flags ?? [],
    } : null;
  }
  if (rowId.startsWith('05-')) {
    questions.higginsIslandFootprints = displayed
      .filter((entry) => entry.featureClasses.includes('island'))
      .map((entry) => ({ displayNumber: entry.displayNumber, footprint: entry.footprint, tinyAny: entry.footprint.tiny_any, semanticFlags: rowDiag.semanticAudit.find((audit) => audit.entryId === entry.entryId)?.flags ?? [] }));
  }
  if (rowId.startsWith('08-')) {
    const retainedCount = retained.length;
    const suppressedCount = rowJson.row.suppressedFeatureCount ?? 0;
    questions.winnebagoStructureLimitEvidence = {
      detectedFeatureClassCounts: rowDiag.detectedFeatureClassCounts,
      rawCandidateSummary: rowDiag.rawCandidateSummary,
      likelyCategory: retainedCount > 0
        ? 'display_selection'
        : suppressedCount > 0
          ? 'placement_or_pruning'
          : Object.keys(rowDiag.detectedFeatureClassCounts).length <= 2
            ? 'detection_or_source_polygon_simplicity'
            : 'mixed_diagnostic_review',
    };
  }
  if (rowId.startsWith('22-')) {
    questions.palestineTinyAndAlternatives = { tinyDisplayed, largerRetained, rankingEvidence: rowDiag.rankingEvidence };
  }
  if (rowId.startsWith('34-')) {
    questions.brookvilleTinyAndAlternatives = {
      tinyDisplayed,
      largerRetained,
      possibleMissedNeckReviewLinks: rowDiag.sourceLinks,
    };
  }
  if (rowId.startsWith('36-')) {
    questions.wylieDisplayedUsefulness = {
      tinyDisplayed,
      structurallyUsefulDisplayedCount: displayed.filter((entry) => entry.featureClasses.some((featureClass) => ['cove', 'main_lake_point', 'neck', 'saddle'].includes(featureClass))).length,
      rankingEvidence: rowDiag.rankingEvidence,
    };
  }
  if (rowId.startsWith('42-')) {
    questions.tahoeControl = {
      pointHeavyDiagnosticsExist: (rowDiag.rankingEvidence as any).repeatedSameFeatureFamilyDominatesDisplay,
      displayedPointCount: displayed.filter((entry) => entry.featureClasses.includes('main_lake_point')).length,
      tinyDisplayedCount: tinyDisplayed.length,
      controlNote: 'Control row for comparison; diagnostics are reported without acceptance language.',
    };
  }
  return questions;
}

function footprintBorderPressure(footprint: Footprint) {
  if (!footprint.bbox) return false;
  return footprint.bbox.minX < 8 || footprint.bbox.maxX > APP_WIDTH - 8 || footprint.bbox.minY < 8;
}

function relativeLink(path: string): string {
  return relative(OUT_ROOT, path);
}

function buildRowDiagnostic(rowConfig: typeof BATCH_ROWS[number]): RowDiagnostic {
  const jsonPath = join(SOURCE_ROOT, 'row-json', `${rowConfig.rowId}.json`);
  const appSvgPath = join(SOURCE_ROOT, 'app-420-svg', `${rowConfig.rowId}-app-420.svg`);
  const productionSvgPath = join(SOURCE_ROOT, 'production-svg', `${rowConfig.rowId}-production.svg`);
  const debugSvgPath = join(SOURCE_ROOT, 'debug-svg', `${rowConfig.rowId}-debug.svg`);
  for (const path of [jsonPath, appSvgPath, productionSvgPath, debugSvgPath]) {
    if (!existsSync(resolve(process.cwd(), path))) throw new Error(`Missing baseline artifact: ${path}`);
  }

  const rowJson = readJson(jsonPath);
  const appSvg = readText(appSvgPath);
  const row = rowJson.row;
  const svgPointsByEntry = parseSvgEntryPathPoints(appSvg);
  const transform = inferSvgTransform(rowJson.display.displayedEntries, svgPointsByEntry);
  const displayedRaw = rowJson.display.displayedEntries ?? [];
  const retainedRaw = rowJson.display.retainedEntries ?? [];
  const displayedFootprints = new Map<string, Footprint>();
  for (const entry of displayedRaw) {
    displayedFootprints.set(entry.entryId, entryFootprint(entry, svgPointsByEntry, transform, 'displayed'));
  }
  const tinyRaw = displayedRaw
    .map((entry: any) => ({ entry, footprint: displayedFootprints.get(entry.entryId)! }))
    .filter(({ footprint }) => footprint.tiny_any)
    .map(({ entry, footprint }) => ({ ...entry, footprint }));
  const displayedEntries = displayedRaw.map((entry: any) => makeEntryDiagnostic({
    row,
    entry,
    state: 'displayed',
    footprint: displayedFootprints.get(entry.entryId)!,
    tinyDisplayedEntries: tinyRaw,
  }));
  const retainedEntries = retainedRaw.map((entry: any) => makeEntryDiagnostic({
    row,
    entry,
    state: 'retained',
    footprint: entryFootprint(entry, svgPointsByEntry, transform, 'retained'),
    tinyDisplayedEntries: displayedEntries.filter((displayed) => displayed.footprint.tiny_any),
  }));
  const semanticAudit = displayedRaw.map((entry: any) => semanticAuditForEntry(row, entry, displayedFootprints.get(entry.entryId)!));
  const ranking = rankingEvidence(row, displayedEntries, retainedEntries);
  const rawCandidateSummary = {
    detectedFeatureCount: rowJson.row.detectedFeatureCount,
    detectedFeatureClassCounts: rowJson.rawCandidates.detectedFeatureClassCounts,
    selectedFeatureCount: rowJson.row.selectedFeatureCount,
    suppressedFeatureCount: rowJson.row.suppressedFeatureCount,
    rejectedByReason: rowJson.placement.diagnostics.rejectedByReason,
    droppedByReason: rowJson.placement.diagnostics.droppedByReason,
    featureCoverage: rowJson.placement.diagnostics.featureCoverage,
  };
  const rowDiag: RowDiagnostic = {
    rowId: row.rowId,
    lake: row.lake,
    state: row.state,
    county: row.county,
    season: row.season,
    reviewDate: row.reviewDate,
    founderConcernSummary: [...rowConfig.concerns],
    sourceLinks: {
      app420Svg: appSvgPath,
      productionSvg: productionSvgPath,
      debugSvg: debugSvgPath,
      rowJson: jsonPath,
    },
    rowSummary: {
      supportStatus: row.supportStatus,
      displayedCount: row.displayedCount,
      retainedCount: row.retainedCount,
      displayCap: row.displayCap,
      appWidthSvgHeight: row.appWidthSvgHeight,
      rendererWarnings: {
        full: row.fullSizeRendererWarningCodes,
        app: row.appWidthRendererWarningCodes,
      },
      majorQaFlags: row.majorQaFlags,
    },
    displayedEntries,
    retainedEntries,
    semanticAudit,
    rankingEvidence: ranking,
    rowQuestions: {},
    detectedFeatureClassCounts: rowJson.rawCandidates.detectedFeatureClassCounts,
    rawCandidateSummary,
  };
  rowDiag.rowQuestions = rowQuestionAnswers(rowJson, rowDiag);
  return rowDiag;
}

function buildRowDiagnosticFromDisplayModel(params: {
  rowJson: any;
  displayModel: WaterReaderDisplayModel;
  appSvg: string;
  transform: ReturnType<typeof inferSvgTransform>;
  sourceLinks: Record<string, string>;
  concerns: readonly string[];
}): RowDiagnostic {
  const row = {
    ...params.rowJson.row,
    displayedCount: params.displayModel.displayedEntries.length,
    retainedCount: params.displayModel.retainedEntries.length,
    displayCap: params.displayModel.displayCap,
  };
  const svgPointsByEntry = parseSvgEntryPathPoints(params.appSvg);
  const displayedRaw = params.displayModel.displayedEntries ?? [];
  const retainedRaw = params.displayModel.retainedEntries ?? [];
  const displayedFootprints = new Map<string, Footprint>();
  for (const entry of displayedRaw) {
    displayedFootprints.set(entry.entryId, entryFootprint(entry, svgPointsByEntry, params.transform, 'displayed'));
  }
  const tinyRaw = displayedRaw
    .map((entry: any) => ({ entry, footprint: displayedFootprints.get(entry.entryId)! }))
    .filter(({ footprint }) => footprint.tiny_any)
    .map(({ entry, footprint }) => ({ ...entry, footprint }));
  const displayedEntries = displayedRaw.map((entry: any) => makeEntryDiagnostic({
    row,
    entry,
    state: 'displayed',
    footprint: displayedFootprints.get(entry.entryId)!,
    tinyDisplayedEntries: tinyRaw,
  }));
  const retainedEntries = retainedRaw.map((entry: any) => makeEntryDiagnostic({
    row,
    entry,
    state: 'retained',
    footprint: entryFootprint(entry, svgPointsByEntry, params.transform, 'retained'),
    tinyDisplayedEntries: displayedEntries.filter((displayed) => displayed.footprint.tiny_any),
  }));
  const semanticAudit = displayedRaw.map((entry: any) => semanticAuditForEntry(row, entry, displayedFootprints.get(entry.entryId)!));
  const ranking = rankingEvidence(row, displayedEntries, retainedEntries);
  const rowDiag: RowDiagnostic = {
    rowId: row.rowId,
    lake: row.lake,
    state: row.state,
    county: row.county,
    season: row.season,
    reviewDate: row.reviewDate,
    founderConcernSummary: [...params.concerns],
    sourceLinks: params.sourceLinks,
    rowSummary: {
      supportStatus: row.supportStatus,
      displayedCount: row.displayedCount,
      retainedCount: row.retainedCount,
      displayCap: row.displayCap,
      appWidthSvgHeight: row.appWidthSvgHeight,
      rendererWarnings: {
        full: row.fullSizeRendererWarningCodes,
        app: row.appWidthRendererWarningCodes,
      },
      majorQaFlags: row.majorQaFlags,
    },
    displayedEntries,
    retainedEntries,
    semanticAudit,
    rankingEvidence: ranking,
    rowQuestions: {},
    detectedFeatureClassCounts: params.rowJson.rawCandidates.detectedFeatureClassCounts,
    rawCandidateSummary: {
      detectedFeatureCount: params.rowJson.row.detectedFeatureCount,
      detectedFeatureClassCounts: params.rowJson.rawCandidates.detectedFeatureClassCounts,
      selectedFeatureCount: params.rowJson.row.selectedFeatureCount,
      suppressedFeatureCount: params.rowJson.row.suppressedFeatureCount,
      rejectedByReason: params.rowJson.placement.diagnostics.rejectedByReason,
      droppedByReason: params.rowJson.placement.diagnostics.droppedByReason,
      featureCoverage: params.rowJson.placement.diagnostics.featureCoverage,
    },
  };
  rowDiag.rowQuestions = rowQuestionAnswers(params.rowJson, rowDiag);
  return rowDiag;
}

type BeforeAfterRow = {
  rowId: string;
  lake: string;
  before: RowDiagnostic;
  after: RowDiagnostic;
  beforeSvgFile: string;
  afterSvgFile: string;
  deltas: Record<string, number>;
  keyOutcome: string;
};

type CorrectiveRow = {
  rowId: string;
  lake: string;
  before: RowDiagnostic;
  after: RowDiagnostic;
  beforeSvgFile: string;
  deltas: Record<string, number>;
  keyOutcome: string;
};

function buildBeforeAfterRow(rowConfig: typeof BATCH_ROWS[number]): BeforeAfterRow {
  const before = buildRowDiagnostic(rowConfig);
  const jsonPath = join(SOURCE_ROOT, 'row-json', `${rowConfig.rowId}.json`);
  const appSvgPath = join(SOURCE_ROOT, 'app-420-svg', `${rowConfig.rowId}-app-420.svg`);
  const rowJson = readJson(jsonPath);
  const baselineSvg = readText(appSvgPath);
  const tuned = buildTunedDisplayModel(rowJson, baselineSvg);
  const afterSvg = renderTunedAppSvg({
    row: rowJson.row,
    baselineSvg,
    displayModel: tuned.displayModel,
    transform: tuned.transform,
  });
  const afterSvgFile = join(OUT_ROOT, 'after-app-420-svg', `${rowConfig.rowId}-after-app-420.svg`);
  writeText(afterSvgFile, afterSvg);
  const after = buildRowDiagnosticFromDisplayModel({
    rowJson,
    displayModel: tuned.displayModel,
    appSvg: afterSvg,
    transform: tuned.transform,
    concerns: rowConfig.concerns,
    sourceLinks: {
      baselineApp420Svg: appSvgPath,
      tunedApp420Svg: afterSvgFile,
      productionSvg: join(SOURCE_ROOT, 'production-svg', `${rowConfig.rowId}-production.svg`),
      debugSvg: join(SOURCE_ROOT, 'debug-svg', `${rowConfig.rowId}-debug.svg`),
      rowJson: jsonPath,
    },
  });
  const beforeTiny = before.displayedEntries.filter((entry) => entry.footprint.tiny_any).length;
  const afterTiny = after.displayedEntries.filter((entry) => entry.footprint.tiny_any).length;
  const beforeHardTiny = before.displayedEntries.filter((entry) => entry.footprint.tiny_min_dimension_lt_6 || entry.footprint.tiny_area_lt_100).length;
  const afterHardTiny = after.displayedEntries.filter((entry) => entry.footprint.tiny_min_dimension_lt_6 || entry.footprint.tiny_area_lt_100).length;
  const deltas = {
    displayed: after.displayedEntries.length - before.displayedEntries.length,
    retained: after.retainedEntries.length - before.retainedEntries.length,
    tinyDisplayed: afterTiny - beforeTiny,
    hardTinyDisplayed: afterHardTiny - beforeHardTiny,
  };
  const keyOutcome = afterTiny < beforeTiny
    ? 'tiny_display_reduced'
    : afterTiny === beforeTiny
      ? 'tiny_display_unchanged'
      : 'tiny_display_increased_review';
  return {
    rowId: rowConfig.rowId,
    lake: before.lake,
    before,
    after,
    beforeSvgFile: appSvgPath,
    afterSvgFile,
    deltas,
    keyOutcome,
  };
}

function buildCanaryCheck(rowId: string) {
  const jsonPath = join(SOURCE_ROOT, 'row-json', `${rowId}.json`);
  const appSvgPath = join(SOURCE_ROOT, 'app-420-svg', `${rowId}-app-420.svg`);
  const rowJson = readJson(jsonPath);
  const baselineSvg = readText(appSvgPath);
  const beforePoints = parseSvgEntryPathPoints(baselineSvg);
  const beforeTransform = inferSvgTransform(rowJson.display.displayedEntries ?? [], beforePoints);
  const beforeDisplayed = (rowJson.display.displayedEntries ?? []).map((entry: any) =>
    entryFootprint(entry, beforePoints, beforeTransform, 'displayed'),
  );
  const tuned = buildTunedDisplayModel(rowJson, baselineSvg);
  const afterSvg = renderTunedAppSvg({ row: rowJson.row, baselineSvg, displayModel: tuned.displayModel, transform: tuned.transform });
  const afterPoints = parseSvgEntryPathPoints(afterSvg);
  const afterDisplayed = tuned.displayModel.displayedEntries.map((entry: any) =>
    entryFootprint(entry, afterPoints, tuned.transform, 'displayed'),
  );
  return {
    rowId,
    lake: rowJson.row.lake,
    season: rowJson.row.season,
    beforeDisplayedCount: rowJson.display.displayedEntries.length,
    afterDisplayedCount: tuned.displayModel.displayedEntries.length,
    beforeRetainedCount: rowJson.display.retainedEntries.length,
    afterRetainedCount: tuned.displayModel.retainedEntries.length,
    beforeTinyDisplayedCount: beforeDisplayed.filter((footprint) => footprint.tiny_any).length,
    afterTinyDisplayedCount: afterDisplayed.filter((footprint) => footprint.tiny_any).length,
    beforeHardTinyDisplayedCount: beforeDisplayed.filter((footprint) => footprint.tiny_min_dimension_lt_6 || footprint.tiny_area_lt_100).length,
    afterHardTinyDisplayedCount: afterDisplayed.filter((footprint) => footprint.tiny_min_dimension_lt_6 || footprint.tiny_area_lt_100).length,
    beforeDisplayedEntryIds: rowJson.display.displayedEntries.map((entry: any) => entry.entryId),
    afterDisplayedEntryIds: tuned.displayModel.displayedEntries.map((entry) => entry.entryId),
  };
}

function buildCorrectiveRow(rowConfig: typeof BATCH_ROWS[number]): CorrectiveRow {
  const before = buildRowDiagnostic(rowConfig);
  const jsonPath = join(SOURCE_ROOT, 'row-json', `${rowConfig.rowId}.json`);
  const appSvgPath = join(SOURCE_ROOT, 'app-420-svg', `${rowConfig.rowId}-app-420.svg`);
  const rowJson = readJson(jsonPath);
  const baselineSvg = readText(appSvgPath);
  const svgPointsByEntry = parseSvgEntryPathPoints(baselineSvg);
  const transform = inferSvgTransform(rowJson.display.displayedEntries ?? [], svgPointsByEntry);
  const displayModel = buildCorrectiveDisplayModel(rowJson);
  const after = buildRowDiagnosticFromDisplayModel({
    rowJson,
    displayModel,
    appSvg: baselineSvg,
    transform,
    concerns: rowConfig.concerns,
    sourceLinks: {
      baselineApp420Svg: appSvgPath,
      productionSvg: join(SOURCE_ROOT, 'production-svg', `${rowConfig.rowId}-production.svg`),
      debugSvg: join(SOURCE_ROOT, 'debug-svg', `${rowConfig.rowId}-debug.svg`),
      rowJson: jsonPath,
    },
  });
  const beforeTiny = before.displayedEntries.filter((entry) => entry.footprint.tiny_any).length;
  const afterTiny = after.displayedEntries.filter((entry) => entry.footprint.tiny_any).length;
  const beforeHardTiny = before.displayedEntries.filter((entry) => entry.footprint.tiny_min_dimension_lt_6 || entry.footprint.tiny_area_lt_100).length;
  const afterHardTiny = after.displayedEntries.filter((entry) => entry.footprint.tiny_min_dimension_lt_6 || entry.footprint.tiny_area_lt_100).length;
  const deltas = {
    displayed: after.displayedEntries.length - before.displayedEntries.length,
    retained: after.retainedEntries.length - before.retainedEntries.length,
    tinyDisplayed: afterTiny - beforeTiny,
    hardTinyDisplayed: afterHardTiny - beforeHardTiny,
  };
  const keyOutcome = afterTiny < beforeTiny
    ? 'tiny_display_reduced'
    : afterTiny === beforeTiny
      ? 'tiny_display_unchanged'
      : 'tiny_display_increased_review';
  return {
    rowId: rowConfig.rowId,
    lake: before.lake,
    before,
    after,
    beforeSvgFile: appSvgPath,
    deltas,
    keyOutcome,
  };
}

function buildCorrectiveCanaryCheck(rowId: string) {
  const jsonPath = join(SOURCE_ROOT, 'row-json', `${rowId}.json`);
  const appSvgPath = join(SOURCE_ROOT, 'app-420-svg', `${rowId}-app-420.svg`);
  const rowJson = readJson(jsonPath);
  const baselineSvg = readText(appSvgPath);
  const beforePoints = parseSvgEntryPathPoints(baselineSvg);
  const beforeTransform = inferSvgTransform(rowJson.display.displayedEntries ?? [], beforePoints);
  const beforeDisplayed = (rowJson.display.displayedEntries ?? []).map((entry: any) =>
    entryFootprint(entry, beforePoints, beforeTransform, 'displayed'),
  );
  const displayModel = buildCorrectiveDisplayModel(rowJson);
  const afterDisplayed = displayModel.displayedEntries.map((entry: any) =>
    entryFootprint(entry, beforePoints, beforeTransform, 'displayed'),
  );
  return {
    rowId,
    lake: rowJson.row.lake,
    season: rowJson.row.season,
    beforeDisplayedCount: rowJson.display.displayedEntries.length,
    afterDisplayedCount: displayModel.displayedEntries.length,
    beforeRetainedCount: rowJson.display.retainedEntries.length,
    afterRetainedCount: displayModel.retainedEntries.length,
    beforeTinyDisplayedCount: beforeDisplayed.filter((footprint) => footprint.tiny_any).length,
    afterTinyDisplayedCount: afterDisplayed.filter((footprint) => footprint.tiny_any).length,
    beforeHardTinyDisplayedCount: beforeDisplayed.filter((footprint) => footprint.tiny_min_dimension_lt_6 || footprint.tiny_area_lt_100).length,
    afterHardTinyDisplayedCount: afterDisplayed.filter((footprint) => footprint.tiny_min_dimension_lt_6 || footprint.tiny_area_lt_100).length,
    beforeDisplayedEntryIds: rowJson.display.displayedEntries.map((entry: any) => entry.entryId),
    afterDisplayedEntryIds: displayModel.displayedEntries.map((entry) => entry.entryId),
    visualProof: 'not_generated_from_cached_json',
  };
}

function diagnosticsCsv(rows: RowDiagnostic[]): string {
  const header = [
    'rowId',
    'lake',
    'entryState',
    'displayNumber',
    'legendTitle',
    'featureClasses',
    'placementKinds',
    'sourceFeatureIds',
    'zoneIds',
    'majorAxisM',
    'majorAxisPctOfLakeLongestDimension',
    'anchorSemanticIds',
    'placementSemanticIds',
    'rankingPriority',
    'rankingScore',
    'confluenceStrengthRank',
    'rankingDiagnostics',
    'footprintWidth',
    'footprintHeight',
    'footprintArea',
    'footprintMinDimension',
    'footprintMaxDimension',
    'tiny_min_dimension_lt_6',
    'tiny_max_dimension_lt_12',
    'tiny_area_lt_100',
    'tiny_any',
    'retainedReason',
    'appearsVisuallyLargerThanTinyDisplayed',
    'structurallyMoreUsefulThanTinyDisplayed',
  ];
  const lines = rows.flatMap((row) => [...row.displayedEntries, ...row.retainedEntries]).map((entry) => [
    entry.rowId,
    entry.lake,
    entry.entryState,
    entry.displayNumber ?? '',
    entry.legendTitle,
    entry.featureClasses.join('|'),
    entry.placementKinds.join('|'),
    entry.sourceFeatureIds.join('|'),
    entry.zoneIds.join('|'),
    entry.majorAxisM,
    entry.majorAxisPctOfLakeLongestDimension ?? '',
    entry.anchorSemanticIds.join('|'),
    entry.placementSemanticIds.join('|'),
    entry.rankingPriority ?? '',
    entry.rankingScore ?? '',
    entry.confluenceStrengthRank ?? '',
    entry.rankingDiagnostics.join('|'),
    entry.footprint.width,
    entry.footprint.height,
    entry.footprint.area,
    entry.footprint.minDimension,
    entry.footprint.maxDimension,
    entry.footprint.tiny_min_dimension_lt_6,
    entry.footprint.tiny_max_dimension_lt_12,
    entry.footprint.tiny_area_lt_100,
    entry.footprint.tiny_any,
    entry.retainedReason,
    entry.appearsVisuallyLargerThanTinyDisplayed,
    entry.structurallyMoreUsefulThanTinyDisplayed,
  ].map(csvCell).join(','));
  return `${header.join(',')}\n${lines.join('\n')}\n`;
}

function tinyZoneSummary(rows: RowDiagnostic[]) {
  return {
    rowsAnalyzed: rows.length,
    tinyDisplayedEntries: rows.flatMap((row) => row.displayedEntries.filter((entry) => entry.footprint.tiny_any)),
    rows: rows.map((row) => ({
      rowId: row.rowId,
      lake: row.lake,
      tinyDisplayedCount: row.displayedEntries.filter((entry) => entry.footprint.tiny_any).length,
      tinyDisplayedEntries: row.displayedEntries.filter((entry) => entry.footprint.tiny_any).map((entry) => ({
        displayNumber: entry.displayNumber,
        entryId: entry.entryId,
        legendTitle: entry.legendTitle,
        featureClasses: entry.featureClasses,
        footprint: entry.footprint,
      })),
    })),
  };
}

function rankingDecisionSummary(rows: RowDiagnostic[]) {
  return {
    rows: rows.map((row) => ({
      rowId: row.rowId,
      lake: row.lake,
      ...row.rankingEvidence,
    })),
  };
}

function semanticRecoveryAudit(rows: RowDiagnostic[]) {
  return {
    rows: rows.map((row) => ({
      rowId: row.rowId,
      lake: row.lake,
      flags: row.semanticAudit.flatMap((audit) => audit.flags),
      entries: row.semanticAudit,
    })),
  };
}

function htmlIndex(rows: RowDiagnostic[]): string {
  const cards = rows.map((row) => {
    const appSvg = stripSvgForInline(readText(row.sourceLinks.app420Svg));
    const displayedRows = row.displayedEntries.map((entry) => `<tr>
      <td>${entry.displayNumber ?? ''}</td>
      <td>${escapeHtml(entry.legendTitle)}</td>
      <td>${escapeHtml(entry.featureClasses.join('|'))}</td>
      <td>${escapeHtml(entry.placementKinds.join('|'))}</td>
      <td>${entry.footprint.width} x ${entry.footprint.height}</td>
      <td>${entry.footprint.area}</td>
      <td>${entry.footprint.tiny_any ? 'yes' : 'no'}</td>
      <td>${escapeHtml(entry.anchorSemanticIds.join('|'))}</td>
    </tr>`).join('');
    const retainedRows = row.retainedEntries.length > 0 ? row.retainedEntries.map((entry) => `<tr>
      <td>${escapeHtml(entry.legendTitle || entry.entryId)}</td>
      <td>${escapeHtml(entry.featureClasses.join('|'))}</td>
      <td>${escapeHtml(entry.placementKinds.join('|'))}</td>
      <td>${entry.majorAxisM}</td>
      <td>${entry.footprint.width} x ${entry.footprint.height}</td>
      <td>${entry.appearsVisuallyLargerThanTinyDisplayed ? 'yes' : 'no'}</td>
      <td>${entry.structurallyMoreUsefulThanTinyDisplayed ? 'yes' : 'no'}</td>
    </tr>`).join('') : '<tr><td colspan="7">None retained in baseline display model.</td></tr>';
    const auditRows = row.semanticAudit.map((audit) => `<tr>
      <td>${audit.displayNumber ?? ''}</td>
      <td>${escapeHtml(audit.legendTitle)}</td>
      <td>${escapeHtml(audit.anchorSemanticIds.join('|'))}</td>
      <td>${escapeHtml(audit.placementSemanticIds.join('|'))}</td>
      <td>${escapeHtml(audit.flags.join('|') || 'none')}</td>
      <td>${escapeHtml(audit.notes.join('|'))}</td>
    </tr>`).join('');
    const links = Object.entries(row.sourceLinks).map(([label, path]) =>
      `<a href="${escapeHtml(relativeLink(path))}">${escapeHtml(label)}</a>`,
    ).join(' ');
    return `<article class="card" id="${escapeHtml(row.rowId)}">
      <header>
        <h2>${escapeHtml(row.lake)} <span>${escapeHtml(row.state)}/${escapeHtml(row.county)} spring</span></h2>
        <p>${row.founderConcernSummary.map(escapeHtml).join('; ')}</p>
        <p class="links">${links}</p>
      </header>
      <div class="layout">
        <div class="map">${appSvg}</div>
        <div class="notes">
          <h3>Ranking Evidence</h3>
          <pre>${escapeHtml(JSON.stringify(row.rankingEvidence, null, 2))}</pre>
          <h3>Row Questions</h3>
          <pre>${escapeHtml(JSON.stringify(row.rowQuestions, null, 2))}</pre>
        </div>
      </div>
      <h3>Displayed Zones</h3>
      <table><thead><tr><th>#</th><th>Title</th><th>Class</th><th>Placement</th><th>Footprint</th><th>Area</th><th>Tiny</th><th>Anchor</th></tr></thead><tbody>${displayedRows}</tbody></table>
      <h3>Retained Alternatives</h3>
      <table><thead><tr><th>Entry</th><th>Class</th><th>Placement</th><th>Major m</th><th>Footprint</th><th>Larger than tiny</th><th>Structurally useful vs tiny</th></tr></thead><tbody>${retainedRows}</tbody></table>
      <h3>Semantic Audit</h3>
      <table><thead><tr><th>#</th><th>Title</th><th>Anchor</th><th>Placement semantic</th><th>Flags</th><th>Notes</th></tr></thead><tbody>${auditRows}</tbody></table>
    </article>`;
  }).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Water Reader Chunk 7N Batch 1 Spring Decision Support</title>
  <style>
    body { margin: 0; background: #f6f8fb; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .hero { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #dbe3ef; padding: 14px 18px; z-index: 2; }
    h1 { margin: 0; font-size: 20px; }
    h2 { margin: 0 0 5px; font-size: 17px; }
    h2 span { color: #64748b; font-size: 13px; }
    h3 { margin: 12px 0 6px; font-size: 13px; }
    p, td, th, pre { font-size: 12px; }
    a { color: #175a9c; font-weight: 700; text-decoration: none; margin-right: 10px; }
    .card { margin: 16px; padding: 14px; background: #fff; border: 1px solid #dbe3ef; border-radius: 8px; }
    .layout { display: grid; grid-template-columns: minmax(320px, 420px) minmax(260px, 1fr); gap: 14px; align-items: start; }
    .map svg { width: 100%; height: auto; border: 1px solid #e2e8f0; background: #f8fafc; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th, td { border: 1px solid #e2e8f0; padding: 5px 6px; text-align: left; vertical-align: top; }
    th { background: #eef4fb; }
    pre { white-space: pre-wrap; overflow: auto; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <section class="hero">
    <h1>Water Reader Chunk 7N Batch 1 Spring Decision Support</h1>
    <p>Diagnostic-only shelf from existing 7M artifacts. No output behavior changes.</p>
    <p><a href="batch-1-spring-zone-diagnostics.csv">CSV diagnostics</a> <a href="batch-1-spring-row-diagnostics.json">row JSON</a> <a href="batch-1-spring-master-summary.md">master summary</a></p>
  </section>
  ${cards}
</body>
</html>
`;
}

function masterSummary(rows: RowDiagnostic[]): string {
  const rankingRows = rows.filter((row) => (row.rankingEvidence as any).likelyRankingDisplayPolicyIssue);
  const tinyRows = rows.filter((row) => row.displayedEntries.some((entry) => entry.footprint.tiny_any));
  const semanticFlagRows = rows.filter((row) => row.semanticAudit.some((audit) => audit.flags.length > 0));
  const lines = [
    '# Chunk 7N Batch 1 Spring Decision Support',
    '',
    'Diagnostic-only summary from existing 7M artifacts. No tuning was applied.',
    '',
    '## Top Findings',
    '',
    `- Rows analyzed: ${rows.length}.`,
    `- Rows with tiny displayed entries: ${tinyRows.length}.`,
    `- Rows with likely ranking/display policy issues: ${rankingRows.length}.`,
    `- Rows with semantic/recovery audit flags: ${semanticFlagRows.length}.`,
    '',
    '## Recommended Future Tuning Levers',
    '',
    '1. Add a display-readability diagnostic gate or penalty before final cap selection for entries with very small app-width footprints.',
    '2. Replace the major-axis fallback ranking metric with feature-specific structural metrics already present in raw candidates where practical.',
    '3. Add a display-diversity pressure rule for repeated same-family entries when retained alternatives are materially larger or add feature variety.',
    '4. Review recovery label wording/selection for cove back-pocket, inner-shoreline, and mouth-shoulder cases before changing copy.',
    '5. Use debug artifacts for Winnebago and Brookville to separate detection/source-shape limits from display selection limits.',
    '',
    '## Row Pointers',
    '',
    ...rows.map((row) => `- ${row.lake}: tiny=${row.displayedEntries.filter((entry) => entry.footprint.tiny_any).length}, retained=${row.retainedEntries.length}, semanticFlags=${row.semanticAudit.flatMap((audit) => audit.flags).length}, policyIssue=${(row.rankingEvidence as any).likelyRankingDisplayPolicyIssue}.`),
    '',
  ];
  return `${lines.join('\n')}\n`;
}

function topLineCounts(rows: RowDiagnostic[]) {
  return {
    rowsAnalyzed: rows.length,
    displayedEntries: rows.reduce((sum, row) => sum + row.displayedEntries.length, 0),
    retainedEntries: rows.reduce((sum, row) => sum + row.retainedEntries.length, 0),
    tinyDisplayedEntries: rows.reduce((sum, row) => sum + row.displayedEntries.filter((entry) => entry.footprint.tiny_any).length, 0),
    rowsWithTinyDisplayedEntries: rows.filter((row) => row.displayedEntries.some((entry) => entry.footprint.tiny_any)).length,
    rowsWhereTinyDisplayedBeatLargerRetainedAlternatives: rows.filter((row) => (row.rankingEvidence as any).tinyDisplayedBeatsLargerRetainedAlternative).length,
    semanticRecoveryAuditFlags: rows.reduce((sum, row) => sum + row.semanticAudit.reduce((inner, audit) => inner + audit.flags.length, 0), 0),
    pointRepetitionPressureRows: rows.filter((row) => (row.rankingEvidence as any).repeatedSameFeatureFamilyDominatesDisplay).length,
    likelyRankingDisplayPolicyIssueRows: rows.filter((row) => (row.rankingEvidence as any).likelyRankingDisplayPolicyIssue).length,
  };
}

type BeforeAfterLike = { before: RowDiagnostic; after: RowDiagnostic };

function beforeAfterCounts(rows: BeforeAfterLike[]) {
  const countTiny = (side: 'before' | 'after') => rows.reduce((sum, row) => sum + row[side].displayedEntries.filter((entry) => entry.footprint.tiny_any).length, 0);
  const countHardTiny = (side: 'before' | 'after') => rows.reduce((sum, row) => sum + row[side].displayedEntries.filter((entry) => entry.footprint.tiny_min_dimension_lt_6 || entry.footprint.tiny_area_lt_100).length, 0);
  const rowTiny = (side: 'before' | 'after') => rows.filter((row) => row[side].displayedEntries.some((entry) => entry.footprint.tiny_any)).length;
  const tinyBeat = (side: 'before' | 'after') => rows.filter((row) => (row[side].rankingEvidence as any).tinyDisplayedBeatsLargerRetainedAlternative).length;
  const retained = (side: 'before' | 'after') => rows.reduce((sum, row) => sum + row[side].retainedEntries.length, 0);
  const repeated = (side: 'before' | 'after') => rows.filter((row) => (row[side].rankingEvidence as any).repeatedSameFeatureFamilyDominatesDisplay).length;
  return {
    rowsAnalyzed: rows.length,
    before: {
      displayedEntries: rows.reduce((sum, row) => sum + row.before.displayedEntries.length, 0),
      retainedEntries: retained('before'),
      tinyDisplayedEntries: countTiny('before'),
      hardTinyDisplayedEntries: countHardTiny('before'),
      rowsWithTinyDisplayedEntries: rowTiny('before'),
      rowsWhereTinyDisplayedBeatLargerRetainedAlternatives: tinyBeat('before'),
      appWidthWarningRows: rows.filter((row) => ((row.before.rowSummary.rendererWarnings as any)?.app ?? []).length > 0).length,
      repeatedTitlePressureRows: repeated('before'),
    },
    after: {
      displayedEntries: rows.reduce((sum, row) => sum + row.after.displayedEntries.length, 0),
      retainedEntries: retained('after'),
      tinyDisplayedEntries: countTiny('after'),
      hardTinyDisplayedEntries: countHardTiny('after'),
      rowsWithTinyDisplayedEntries: rowTiny('after'),
      rowsWhereTinyDisplayedBeatLargerRetainedAlternatives: tinyBeat('after'),
      appWidthWarningRows: rows.filter((row) => ((row.after.rowSummary.rendererWarnings as any)?.app ?? []).length > 0).length,
      repeatedTitlePressureRows: repeated('after'),
    },
  };
}

function beforeAfterCsv(rows: BeforeAfterRow[]): string {
  const header = [
    'rowId',
    'lake',
    'beforeDisplayed',
    'afterDisplayed',
    'beforeRetained',
    'afterRetained',
    'beforeTinyDisplayed',
    'afterTinyDisplayed',
    'beforeHardTinyDisplayed',
    'afterHardTinyDisplayed',
    'beforePolicyIssue',
    'afterPolicyIssue',
    'outcome',
    'beforeSvgFile',
    'afterSvgFile',
  ];
  const lines = rows.map((row) => [
    row.rowId,
    row.lake,
    row.before.displayedEntries.length,
    row.after.displayedEntries.length,
    row.before.retainedEntries.length,
    row.after.retainedEntries.length,
    row.before.displayedEntries.filter((entry) => entry.footprint.tiny_any).length,
    row.after.displayedEntries.filter((entry) => entry.footprint.tiny_any).length,
    row.before.displayedEntries.filter((entry) => entry.footprint.tiny_min_dimension_lt_6 || entry.footprint.tiny_area_lt_100).length,
    row.after.displayedEntries.filter((entry) => entry.footprint.tiny_min_dimension_lt_6 || entry.footprint.tiny_area_lt_100).length,
    (row.before.rankingEvidence as any).likelyRankingDisplayPolicyIssue,
    (row.after.rankingEvidence as any).likelyRankingDisplayPolicyIssue,
    row.keyOutcome,
    row.beforeSvgFile,
    row.afterSvgFile,
  ].map(csvCell).join(','));
  return `${header.join(',')}\n${lines.join('\n')}\n`;
}

function htmlIndex7o(rows: BeforeAfterRow[]): string {
  const counts = beforeAfterCounts(rows);
  const cards = rows.map((row) => {
    const beforeSvg = stripSvgForInline(readText(row.beforeSvgFile));
    const afterSvg = stripSvgForInline(readText(row.afterSvgFile));
    const displayedRows = row.after.displayedEntries.map((entry) => `<tr>
      <td>${entry.displayNumber ?? ''}</td>
      <td>${escapeHtml(entry.legendTitle)}</td>
      <td>${escapeHtml(entry.featureClasses.join('|'))}</td>
      <td>${entry.footprint.width} x ${entry.footprint.height}</td>
      <td>${entry.footprint.tiny_any ? 'yes' : 'no'}</td>
      <td>${escapeHtml(entry.rankingDiagnostics.filter((d) => d.startsWith('display_readability') || d.startsWith('display_usefulness') || d.startsWith('retained_') || d.startsWith('displayed_')).join('|'))}</td>
    </tr>`).join('');
    const retainedRows = row.after.retainedEntries.length > 0 ? row.after.retainedEntries.map((entry) => `<tr>
      <td>${escapeHtml(entry.legendTitle || entry.entryId)}</td>
      <td>${escapeHtml(entry.featureClasses.join('|'))}</td>
      <td>${entry.footprint.width} x ${entry.footprint.height}</td>
      <td>${entry.footprint.tiny_any ? 'yes' : 'no'}</td>
      <td>${escapeHtml(entry.rankingDiagnostics.filter((d) => d.startsWith('display_readability') || d.startsWith('display_usefulness') || d.startsWith('retained_')).join('|'))}</td>
    </tr>`).join('') : '<tr><td colspan="5">None retained after tuned display selection.</td></tr>';
    const links = [
      `<a href="${escapeHtml(relativeLink(row.beforeSvgFile))}">baseline app SVG</a>`,
      `<a href="${escapeHtml(relativeLink(row.afterSvgFile))}">tuned app SVG</a>`,
      `<a href="${escapeHtml(relativeLink(row.after.sourceLinks.debugSvg ?? ''))}">debug SVG</a>`,
      `<a href="${escapeHtml(relativeLink(row.after.sourceLinks.rowJson ?? ''))}">row JSON</a>`,
    ].join(' ');
    return `<article class="card" id="${escapeHtml(row.rowId)}">
      <header>
        <h2>${escapeHtml(row.lake)} <span>${escapeHtml(row.before.state)}/${escapeHtml(row.before.county)} spring</span></h2>
        <p>${row.before.founderConcernSummary.map(escapeHtml).join('; ')}</p>
        <p class="links">${links}</p>
        <p class="chips">
          <b>${escapeHtml(row.keyOutcome)}</b>
          <span>tiny ${row.before.displayedEntries.filter((entry) => entry.footprint.tiny_any).length} -> ${row.after.displayedEntries.filter((entry) => entry.footprint.tiny_any).length}</span>
          <span>retained ${row.before.retainedEntries.length} -> ${row.after.retainedEntries.length}</span>
        </p>
      </header>
      <div class="compare">
        <section><h3>Before 7M</h3><div class="map">${beforeSvg}</div></section>
        <section><h3>After 7O</h3><div class="map">${afterSvg}</div></section>
      </div>
      <h3>After Displayed Selection</h3>
      <table><thead><tr><th>#</th><th>Title</th><th>Class</th><th>Footprint</th><th>Tiny</th><th>Readability/ranking diagnostics</th></tr></thead><tbody>${displayedRows}</tbody></table>
      <h3>After Retained Diagnostics</h3>
      <table><thead><tr><th>Entry</th><th>Class</th><th>Footprint</th><th>Tiny</th><th>Reason diagnostics</th></tr></thead><tbody>${retainedRows}</tbody></table>
      <h3>Ranking Delta</h3>
      <pre>${escapeHtml(JSON.stringify({ before: row.before.rankingEvidence, after: row.after.rankingEvidence, deltas: row.deltas }, null, 2))}</pre>
    </article>`;
  }).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Water Reader Chunk 7O Display Policy Tuning</title>
  <style>
    body { margin: 0; background: #f6f8fb; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .hero { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #dbe3ef; padding: 14px 18px; z-index: 2; }
    h1 { margin: 0; font-size: 20px; }
    h2 { margin: 0 0 5px; font-size: 17px; }
    h2 span { color: #64748b; font-size: 13px; }
    h3 { margin: 12px 0 6px; font-size: 13px; }
    p, td, th, pre { font-size: 12px; }
    a { color: #175a9c; font-weight: 700; text-decoration: none; margin-right: 10px; }
    .card { margin: 16px; padding: 14px; background: #fff; border: 1px solid #dbe3ef; border-radius: 8px; }
    .compare { display: grid; grid-template-columns: minmax(320px, 1fr) minmax(320px, 1fr); gap: 14px; align-items: start; }
    .map svg { width: 100%; height: auto; border: 1px solid #e2e8f0; background: #f8fafc; }
    .chips span, .chips b { display: inline-block; margin-right: 8px; padding: 3px 7px; border: 1px solid #dbe3ef; border-radius: 999px; background: #f8fafc; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th, td { border: 1px solid #e2e8f0; padding: 5px 6px; text-align: left; vertical-align: top; }
    th { background: #eef4fb; }
    pre { white-space: pre-wrap; overflow: auto; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; }
    @media (max-width: 900px) { .compare { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <section class="hero">
    <h1>Water Reader Chunk 7O Display Policy Tuning</h1>
    <p>Before/after diagnostic shelf for Batch 1 Spring. No feature detection, placement geometry, or cap changes.</p>
    <p><a href="batch-1-spring-before-after-summary.csv">summary CSV</a> <a href="batch-1-spring-before-after-diagnostics.json">diagnostics JSON</a> <a href="master-summary.md">master summary</a></p>
    <pre>${escapeHtml(JSON.stringify(counts, null, 2))}</pre>
  </section>
  ${cards}
</body>
</html>
`;
}

function tinyZoneBeforeAfter(rows: BeforeAfterRow[]) {
  return {
    counts: beforeAfterCounts(rows),
    rows: rows.map((row) => ({
      rowId: row.rowId,
      lake: row.lake,
      before: row.before.displayedEntries.filter((entry) => entry.footprint.tiny_any),
      after: row.after.displayedEntries.filter((entry) => entry.footprint.tiny_any),
      deltaTinyDisplayed: row.deltas.tinyDisplayed,
      deltaHardTinyDisplayed: row.deltas.hardTinyDisplayed,
    })),
  };
}

function rankingBeforeAfter(rows: BeforeAfterRow[]) {
  return {
    rows: rows.map((row) => ({
      rowId: row.rowId,
      lake: row.lake,
      before: row.before.rankingEvidence,
      after: row.after.rankingEvidence,
      deltas: row.deltas,
      beforeDisplayedEntryIds: row.before.displayedEntries.map((entry) => entry.entryId),
      afterDisplayedEntryIds: row.after.displayedEntries.map((entry) => entry.entryId),
      beforeRetainedEntryIds: row.before.retainedEntries.map((entry) => entry.entryId),
      afterRetainedEntryIds: row.after.retainedEntries.map((entry) => entry.entryId),
    })),
  };
}

function masterSummary7o(rows: BeforeAfterRow[], canaries: ReturnType<typeof buildCanaryCheck>[]): string {
  const counts = beforeAfterCounts(rows);
  return [
    '# Chunk 7O Display Policy Tuning',
    '',
    'Narrow tuning pass: display selection/readability diagnostics and renderer stroke polish only.',
    '',
    '## Batch 1 Spring Counts',
    '',
    `- Tiny displayed entries: ${counts.before.tinyDisplayedEntries} -> ${counts.after.tinyDisplayedEntries}.`,
    `- Hard tiny displayed entries: ${counts.before.hardTinyDisplayedEntries} -> ${counts.after.hardTinyDisplayedEntries}.`,
    `- Rows with tiny displayed entries: ${counts.before.rowsWithTinyDisplayedEntries} -> ${counts.after.rowsWithTinyDisplayedEntries}.`,
    `- Rows where tiny displayed entries beat larger retained alternatives: ${counts.before.rowsWhereTinyDisplayedBeatLargerRetainedAlternatives} -> ${counts.after.rowsWhereTinyDisplayedBeatLargerRetainedAlternatives}.`,
    `- Retained entries: ${counts.before.retainedEntries} -> ${counts.after.retainedEntries}.`,
    '',
    '## Row Outcomes',
    '',
    ...rows.map((row) => `- ${row.lake}: ${row.keyOutcome}; displayed ${row.before.displayedEntries.length} -> ${row.after.displayedEntries.length}; retained ${row.before.retainedEntries.length} -> ${row.after.retainedEntries.length}.`),
    '',
    '## Canary Checks',
    '',
    ...canaries.map((row) => `- ${row.lake} ${row.season}: tiny displayed ${row.beforeTinyDisplayedCount} -> ${row.afterTinyDisplayedCount}; displayed ${row.beforeDisplayedCount} -> ${row.afterDisplayedCount}.`),
    '',
  ].join('\n');
}

function correctiveCsv(rows: CorrectiveRow[]): string {
  const header = [
    'rowId',
    'lake',
    'beforeDisplayed',
    'afterDisplayed',
    'beforeRetained',
    'afterRetained',
    'beforeTinyDisplayed',
    'afterTinyDisplayed',
    'beforeHardTinyDisplayed',
    'afterHardTinyDisplayed',
    'beforeDisplayedEntryIds',
    'afterDisplayedEntryIds',
    'outcome',
    'baselineSvgFile',
    'visualProof',
  ];
  const lines = rows.map((row) => [
    row.rowId,
    row.lake,
    row.before.displayedEntries.length,
    row.after.displayedEntries.length,
    row.before.retainedEntries.length,
    row.after.retainedEntries.length,
    row.before.displayedEntries.filter((entry) => entry.footprint.tiny_any).length,
    row.after.displayedEntries.filter((entry) => entry.footprint.tiny_any).length,
    row.before.displayedEntries.filter((entry) => entry.footprint.tiny_min_dimension_lt_6 || entry.footprint.tiny_area_lt_100).length,
    row.after.displayedEntries.filter((entry) => entry.footprint.tiny_min_dimension_lt_6 || entry.footprint.tiny_area_lt_100).length,
    row.before.displayedEntries.map((entry) => entry.entryId).join('|'),
    row.after.displayedEntries.map((entry) => entry.entryId).join('|'),
    row.keyOutcome,
    row.beforeSvgFile,
    'blocked_until_fresh_polygon_render',
  ].map(csvCell).join(','));
  return `${header.join(',')}\n${lines.join('\n')}\n`;
}

function htmlIndex7or(rows: CorrectiveRow[]): string {
  const counts = beforeAfterCounts(rows);
  const cards = rows.map((row) => {
    const baselineSvg = stripSvgForInline(readText(row.beforeSvgFile));
    const beforeEntries = row.before.displayedEntries.map((entry) =>
      `${entry.displayNumber}:${entry.entryId}:${entry.featureClasses.join('|')}`,
    ).join(' | ');
    const correctedRows = row.after.displayedEntries.map((entry) => `<tr>
      <td>${entry.displayNumber ?? ''}</td>
      <td>${escapeHtml(entry.entryId)}</td>
      <td>${escapeHtml(entry.legendTitle)}</td>
      <td>${escapeHtml(entry.featureClasses.join('|'))}</td>
      <td>${entry.footprint.width} x ${entry.footprint.height}</td>
      <td>${entry.footprint.tiny_any ? 'yes' : 'no'}</td>
      <td>${escapeHtml(entry.rankingDiagnostics.filter((d) => d.startsWith('display_readability') || d.startsWith('display_usefulness') || d.startsWith('retained_') || d.startsWith('displayed_')).join('|'))}</td>
    </tr>`).join('');
    const retainedRows = row.after.retainedEntries.length > 0 ? row.after.retainedEntries.map((entry) => `<tr>
      <td>${escapeHtml(entry.entryId)}</td>
      <td>${escapeHtml(entry.legendTitle || '')}</td>
      <td>${escapeHtml(entry.featureClasses.join('|'))}</td>
      <td>${entry.footprint.width} x ${entry.footprint.height}</td>
      <td>${entry.footprint.tiny_any ? 'yes' : 'no'}</td>
      <td>${escapeHtml(entry.rankingDiagnostics.filter((d) => d.startsWith('display_readability') || d.startsWith('display_usefulness') || d.startsWith('retained_')).join('|'))}</td>
    </tr>`).join('') : '<tr><td colspan="6">None retained after corrected selection.</td></tr>';
    return `<article class="card" id="${escapeHtml(row.rowId)}">
      <header>
        <h2>${escapeHtml(row.lake)} <span>${escapeHtml(row.before.state)}/${escapeHtml(row.before.county)} spring</span></h2>
        <p>${row.before.founderConcernSummary.map(escapeHtml).join('; ')}</p>
        <p><a href="${escapeHtml(relativeLink(row.beforeSvgFile))}">baseline app SVG</a> <a href="${escapeHtml(relativeLink(row.after.sourceLinks.debugSvg ?? ''))}">debug SVG</a> <a href="${escapeHtml(relativeLink(row.after.sourceLinks.rowJson ?? ''))}">row JSON</a></p>
        <p class="notice">Corrected selection diagnostics only. No synthetic after-SVG is generated or accepted here; visual proof requires the fresh polygon-backed matrix command.</p>
        <p class="chips"><b>${escapeHtml(row.keyOutcome)}</b><span>tiny ${row.before.displayedEntries.filter((entry) => entry.footprint.tiny_any).length} -> ${row.after.displayedEntries.filter((entry) => entry.footprint.tiny_any).length}</span><span>displayed ${row.before.displayedEntries.length} -> ${row.after.displayedEntries.length}</span></p>
      </header>
      <div class="layout">
        <section><h3>Baseline Visual Reference</h3><div class="map">${baselineSvg}</div></section>
        <section><h3>Selection Delta</h3><pre>${escapeHtml(JSON.stringify({ beforeDisplayed: beforeEntries, afterDisplayed: row.after.displayedEntries.map((entry) => `${entry.displayNumber}:${entry.entryId}:${entry.featureClasses.join('|')}`), deltas: row.deltas }, null, 2))}</pre></section>
      </div>
      <h3>Corrected Displayed Selection</h3>
      <table><thead><tr><th>#</th><th>Entry</th><th>Title</th><th>Class</th><th>Footprint</th><th>Tiny</th><th>Diagnostics</th></tr></thead><tbody>${correctedRows}</tbody></table>
      <h3>Corrected Retained Diagnostics</h3>
      <table><thead><tr><th>Entry</th><th>Title</th><th>Class</th><th>Footprint</th><th>Tiny</th><th>Diagnostics</th></tr></thead><tbody>${retainedRows}</tbody></table>
    </article>`;
  }).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Water Reader Chunk 7O-R Corrective Display Policy</title>
  <style>
    body { margin: 0; background: #f6f8fb; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .hero { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #dbe3ef; padding: 14px 18px; z-index: 2; }
    h1 { margin: 0; font-size: 20px; }
    h2 { margin: 0 0 5px; font-size: 17px; }
    h2 span { color: #64748b; font-size: 13px; }
    h3 { margin: 12px 0 6px; font-size: 13px; }
    p, td, th, pre { font-size: 12px; }
    a { color: #175a9c; font-weight: 700; text-decoration: none; margin-right: 10px; }
    .card { margin: 16px; padding: 14px; background: #fff; border: 1px solid #dbe3ef; border-radius: 8px; }
    .layout { display: grid; grid-template-columns: minmax(320px, 420px) minmax(320px, 1fr); gap: 14px; align-items: start; }
    .map svg { width: 100%; height: auto; border: 1px solid #e2e8f0; background: #f8fafc; }
    .notice { color: #8a4b00; font-weight: 700; }
    .chips span, .chips b { display: inline-block; margin-right: 8px; padding: 3px 7px; border: 1px solid #dbe3ef; border-radius: 999px; background: #f8fafc; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th, td { border: 1px solid #e2e8f0; padding: 5px 6px; text-align: left; vertical-align: top; }
    th { background: #eef4fb; }
    pre { white-space: pre-wrap; overflow: auto; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <section class="hero">
    <h1>Water Reader Chunk 7O-R Corrective Display Policy</h1>
    <p>Cached selection diagnostics only. No synthetic after-SVGs are generated or accepted.</p>
    <p><a href="batch-1-spring-corrective-summary.csv">summary CSV</a> <a href="batch-1-spring-corrective-diagnostics.json">diagnostics JSON</a> <a href="visual-proof-status.json">visual proof status</a></p>
    <pre>${escapeHtml(JSON.stringify(counts, null, 2))}</pre>
  </section>
  ${cards}
</body>
</html>
`;
}

function masterSummary7or(rows: CorrectiveRow[], canaries: ReturnType<typeof buildCorrectiveCanaryCheck>[]): string {
  const counts = beforeAfterCounts(rows);
  return [
    '# Chunk 7O-R Corrective Display Policy',
    '',
    'Corrective pass: structural ranking restored ahead of readability/usefulness; hard-tiny handling remains targeted and diagnostic-visible.',
    '',
    'No synthetic after-SVGs are generated or accepted in this shelf. Visual proof depends on the fresh polygon-backed matrix command.',
    '',
    `- Tiny displayed entries: ${counts.before.tinyDisplayedEntries} -> ${counts.after.tinyDisplayedEntries}.`,
    `- Hard tiny displayed entries: ${counts.before.hardTinyDisplayedEntries} -> ${counts.after.hardTinyDisplayedEntries}.`,
    `- Rows where tiny displayed entries beat larger retained alternatives: ${counts.before.rowsWhereTinyDisplayedBeatLargerRetainedAlternatives} -> ${counts.after.rowsWhereTinyDisplayedBeatLargerRetainedAlternatives}.`,
    '',
    '## Canary Checks',
    '',
    ...canaries.map((row) => `- ${row.lake} ${row.season}: tiny displayed ${row.beforeTinyDisplayedCount} -> ${row.afterTinyDisplayedCount}; displayed ${row.beforeDisplayedCount} -> ${row.afterDisplayedCount}; visual=${row.visualProof}.`),
    '',
  ].join('\n');
}

function main7or() {
  OUT_ROOT = OUT_ROOT_7OR;
  const sourceMatrix = join(SOURCE_ROOT, 'matrix-summary.csv');
  if (!existsSync(resolve(process.cwd(), sourceMatrix))) throw new Error(`Missing baseline matrix summary: ${sourceMatrix}`);
  rmSync(resolve(process.cwd(), OUT_ROOT), { recursive: true, force: true });
  mkdirSync(resolve(process.cwd(), OUT_ROOT), { recursive: true });

  const rows = BATCH_ROWS.map(buildCorrectiveRow);
  const canaries = CANARY_ROWS.map(buildCorrectiveCanaryCheck);
  const artifacts = {
    htmlIndex: join(OUT_ROOT, 'index.html'),
    summaryCsv: join(OUT_ROOT, 'batch-1-spring-corrective-summary.csv'),
    diagnosticsJson: join(OUT_ROOT, 'batch-1-spring-corrective-diagnostics.json'),
    tinyZoneSummary: join(OUT_ROOT, 'tiny-zone-corrective-summary.json'),
    rankingSummary: join(OUT_ROOT, 'ranking-corrective-summary.json'),
    visualProofStatus: join(OUT_ROOT, 'visual-proof-status.json'),
    masterSummary: join(OUT_ROOT, 'master-summary.md'),
  };
  const counts = beforeAfterCounts(rows);
  const visualProofStatus = {
    status: 'BLOCKED_PENDING_FRESH_POLYGON_RENDER',
    reason: 'This command uses cached 7M row JSON for selection diagnostics only and intentionally does not generate synthetic after-SVGs.',
    syntheticAfterSvgGenerated: false,
    requiredProofCommand: 'node --env-file=.env ./node_modules/tsx/dist/cli.mjs scripts/water-reader-50-lake-matrix-review.ts --batch=batch-1',
  };
  writeText(artifacts.htmlIndex, htmlIndex7or(rows));
  writeText(artifacts.summaryCsv, correctiveCsv(rows));
  writeText(artifacts.diagnosticsJson, `${JSON.stringify({ generatedAt: new Date().toISOString(), sourceRoot: SOURCE_ROOT, outputRoot: OUT_ROOT, counts, visualProofStatus, rows, canaries }, null, 2)}\n`);
  writeText(artifacts.tinyZoneSummary, `${JSON.stringify(tinyZoneBeforeAfter(rows as any), null, 2)}\n`);
  writeText(artifacts.rankingSummary, `${JSON.stringify(rankingBeforeAfter(rows as any), null, 2)}\n`);
  writeText(artifacts.visualProofStatus, `${JSON.stringify(visualProofStatus, null, 2)}\n`);
  writeText(artifacts.masterSummary, `${masterSummary7or(rows, canaries)}\n`);
  console.log(JSON.stringify({ ok: true, artifacts, counts, visualProofStatus, canaries }, null, 2));
}

function main7o() {
  OUT_ROOT = OUT_ROOT_7O;
  const sourceMatrix = join(SOURCE_ROOT, 'matrix-summary.csv');
  if (!existsSync(resolve(process.cwd(), sourceMatrix))) throw new Error(`Missing baseline matrix summary: ${sourceMatrix}`);
  rmSync(resolve(process.cwd(), OUT_ROOT), { recursive: true, force: true });
  mkdirSync(resolve(process.cwd(), OUT_ROOT), { recursive: true });
  mkdirSync(resolve(process.cwd(), join(OUT_ROOT, 'after-app-420-svg')), { recursive: true });

  const rows = BATCH_ROWS.map(buildBeforeAfterRow);
  const canaries = CANARY_ROWS.map(buildCanaryCheck);
  const artifacts = {
    htmlIndex: join(OUT_ROOT, 'index.html'),
    summaryCsv: join(OUT_ROOT, 'batch-1-spring-before-after-summary.csv'),
    diagnosticsJson: join(OUT_ROOT, 'batch-1-spring-before-after-diagnostics.json'),
    tinyZoneBeforeAfter: join(OUT_ROOT, 'tiny-zone-before-after.json'),
    rankingBeforeAfter: join(OUT_ROOT, 'ranking-before-after.json'),
    masterSummary: join(OUT_ROOT, 'master-summary.md'),
  };
  const counts = beforeAfterCounts(rows);
  writeText(artifacts.htmlIndex, htmlIndex7o(rows));
  writeText(artifacts.summaryCsv, beforeAfterCsv(rows));
  writeText(artifacts.diagnosticsJson, `${JSON.stringify({ generatedAt: new Date().toISOString(), sourceRoot: SOURCE_ROOT, outputRoot: OUT_ROOT, counts, rows, canaries }, null, 2)}\n`);
  writeText(artifacts.tinyZoneBeforeAfter, `${JSON.stringify(tinyZoneBeforeAfter(rows), null, 2)}\n`);
  writeText(artifacts.rankingBeforeAfter, `${JSON.stringify(rankingBeforeAfter(rows), null, 2)}\n`);
  writeText(artifacts.masterSummary, `${masterSummary7o(rows, canaries)}\n`);
  console.log(JSON.stringify({ ok: true, artifacts, counts, canaries }, null, 2));
}

function main() {
  const options = parseCliOptions();
  if (options.batch === 'batch-1-spring-7o') {
    main7o();
    return;
  }
  if (options.batch === 'batch-1-spring-7o-r') {
    main7or();
    return;
  }
  OUT_ROOT = OUT_ROOT_7N;
  const sourceMatrix = join(SOURCE_ROOT, 'matrix-summary.csv');
  if (!existsSync(resolve(process.cwd(), sourceMatrix))) throw new Error(`Missing baseline matrix summary: ${sourceMatrix}`);
  rmSync(resolve(process.cwd(), OUT_ROOT), { recursive: true, force: true });
  mkdirSync(resolve(process.cwd(), OUT_ROOT), { recursive: true });

  const rows = BATCH_ROWS.map(buildRowDiagnostic);
  const artifacts = {
    htmlIndex: join(OUT_ROOT, 'index.html'),
    csvDiagnostics: join(OUT_ROOT, 'batch-1-spring-zone-diagnostics.csv'),
    rowDiagnostics: join(OUT_ROOT, 'batch-1-spring-row-diagnostics.json'),
    masterSummary: join(OUT_ROOT, 'batch-1-spring-master-summary.md'),
    tinyZoneSummary: join(OUT_ROOT, 'tiny-zone-summary.json'),
    rankingDecisionSummary: join(OUT_ROOT, 'ranking-decision-summary.json'),
    semanticRecoveryAudit: join(OUT_ROOT, 'semantic-recovery-audit.json'),
  };

  writeText(artifacts.htmlIndex, htmlIndex(rows));
  writeText(artifacts.csvDiagnostics, diagnosticsCsv(rows));
  writeText(artifacts.rowDiagnostics, `${JSON.stringify({ generatedAt: new Date().toISOString(), sourceRoot: SOURCE_ROOT, outputRoot: OUT_ROOT, counts: topLineCounts(rows), rows }, null, 2)}\n`);
  writeText(artifacts.masterSummary, masterSummary(rows));
  writeText(artifacts.tinyZoneSummary, `${JSON.stringify(tinyZoneSummary(rows), null, 2)}\n`);
  writeText(artifacts.rankingDecisionSummary, `${JSON.stringify(rankingDecisionSummary(rows), null, 2)}\n`);
  writeText(artifacts.semanticRecoveryAudit, `${JSON.stringify(semanticRecoveryAudit(rows), null, 2)}\n`);

  console.log(JSON.stringify({ ok: true, artifacts, counts: topLineCounts(rows) }, null, 2));
}

main();
