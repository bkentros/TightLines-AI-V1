import { createClient } from '@supabase/supabase-js';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import {
  buildWaterReaderDisplayModel,
  buildWaterReaderLegend,
  buildWaterReaderProductionSvg,
  detectWaterReaderFeatures,
  placeWaterReaderZones,
  preprocessWaterReaderGeometry,
  waterReaderLegendForbiddenPhraseHits,
  type WaterReaderDisplayModel,
  type WaterReaderLegendEntry,
  type WaterReaderProductionSvgResult,
  type WaterReaderSeason,
  type PointM,
  type RingM,
  type WaterReaderDetectedFeature,
  type WaterReaderPlacedZone,
  type WaterReaderPreprocessResult,
  type WaterReaderZonePlacementResult,
} from '../lib/water-reader-engine';
import type {
  WaterbodyPolygonGeoJson,
  WaterbodyPolygonResponse,
  WaterbodySearchResponse,
  WaterbodySearchResult,
} from '../lib/waterReaderContracts';

const OUT_DIR = 'tmp/water-reader-engine-zone-review';
const SEARCH_LIMIT = 48;
const APP_RENDERER_MAP_WIDTH = 420;
const SVG_W = 960;
const HEADER_H = 88;
const PAD = 34;
const SEASON_REVIEWS: Array<{ season: WaterReaderSeason; date: Date }> = [
  { season: 'spring', date: new Date(Date.UTC(2026, 4, 1)) },
  { season: 'summer', date: new Date(Date.UTC(2026, 6, 15)) },
  { season: 'fall', date: new Date(Date.UTC(2026, 9, 1)) },
  { season: 'winter', date: new Date(Date.UTC(2026, 0, 15)) },
];

type MatrixCase = {
  label: string;
  searchQuery: string;
  state?: string;
  lakeId?: string;
  find: (rows: WaterbodySearchResult[]) => WaterbodySearchResult | undefined;
};

const CASES: MatrixCase[] = [
  {
    label: 'Van Norman Lake, MI',
    searchQuery: 'Van Norman Lake',
    find: (rows) =>
      rows.find((r) => /van norman/i.test(r.name) && (r.county ?? '').toLowerCase().includes('oakland')) ??
      rows.find((r) => /van norman/i.test(r.name)),
  },
  {
    label: 'Pontiac Lake, MI',
    searchQuery: 'Pontiac Lake',
    state: 'MI',
    lakeId: '814e800f-ccc3-4312-8e0f-d33d09a9240f',
    find: (rows) =>
      rows.find((r) => r.lakeId === '814e800f-ccc3-4312-8e0f-d33d09a9240f') ??
      rows.find((r) => /pontiac/i.test(r.name) && (r.county ?? '').toLowerCase().includes('oakland')) ??
      rows.find((r) => /pontiac/i.test(r.name)),
  },
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
    label: 'Brookville Lake, IN',
    searchQuery: 'Brookville Lake',
    state: 'IN',
    find: (rows) =>
      rows.find((r) => /brookville/i.test(r.name) && (r.state ?? '').toUpperCase() === 'IN') ??
      rows.find((r) => /brookville/i.test(r.name)),
  },
  {
    label: 'Lake Winnebago, WI',
    searchQuery: 'Lake Winnebago',
    state: 'WI',
    find: (rows) =>
      rows.find((r) => /winnebago/i.test(r.name) && (r.state ?? '').toUpperCase() === 'WI') ??
      rows.find((r) => /winnebago/i.test(r.name)),
  },
  {
    label: 'Lake Tahoe, CA',
    searchQuery: 'Lake Tahoe',
    state: 'CA',
    find: (rows) =>
      rows.find((r) => /tahoe/i.test(r.name) && (r.state ?? '').toUpperCase() === 'CA') ??
      rows.find((r) => /tahoe/i.test(r.name)),
  },
  {
    label: 'Lake Palestine, TX',
    searchQuery: 'Lake Palestine',
    state: 'TX',
    lakeId: 'b46694af-0c72-4c97-b600-866c8effd1ee',
    find: (rows) =>
      rows.find((r) => r.lakeId === 'b46694af-0c72-4c97-b600-866c8effd1ee') ??
      rows.find((r) => /palestine/i.test(r.name) && (r.state ?? '').toUpperCase() === 'TX') ??
      rows.find((r) => /palestine/i.test(r.name)),
  },
  {
    label: 'Lake Wylie, NC',
    searchQuery: 'Lake Wylie',
    state: 'NC',
    lakeId: '2f10ec7b-b310-441c-a2a8-df722cb17fa1',
    find: (rows) =>
      rows.find((r) => r.lakeId === '2f10ec7b-b310-441c-a2a8-df722cb17fa1') ??
      rows.find((r) => /wylie/i.test(r.name) && (r.state ?? '').toUpperCase() === 'NC') ??
      rows.find((r) => /wylie/i.test(r.name)),
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
  season: string;
  seasonGroup: string;
  detectedFeatureCount: number;
  selectedFeatureCount: number;
  suppressedFeatureCount: number;
  detectedUnrepresentableFeatureCount: number;
  zoneCount: number;
  featureEnvelopeZoneCount: number;
  nonEnvelopeLegacyZoneCount: number;
  selectedFeatureWithoutEnvelopeZoneCount: number;
  featureEnvelopeSuppressionDiagnostics: Record<string, number>;
  featureEnvelopeUnrepresentableDiagnostics: Record<string, number>;
  featureEnvelopeUnrepresentableByFeatureClassReason: Record<string, number>;
  wholeFeatureOutsideWaterCenterAcceptedCount: number;
  wholeFeatureOutsideWaterCenterAcceptedByFeatureClass: Record<string, number>;
  wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM: number | null;
  wholeFeatureOutsideWaterCenterMaxLocalityRadiusM: number | null;
  wholeFeatureOutsideWaterCenterMaxAnchorDistanceM: number | null;
  universalCount: number;
  zoneCounts: Record<string, number>;
  suppressedCandidateFeatures: number;
  suppressionDiagnostics: Record<string, number>;
  rejectedZoneDiagnostics: Record<string, number>;
  droppedZoneDiagnostics: Record<string, number>;
  zoneDiagnostics: WaterReaderZonePlacementResult['diagnostics'];
  confluenceGroupCount: number;
  confluenceGroups: WaterReaderZonePlacementResult['diagnostics']['confluenceGroups'];
  displayedEntryCount: number;
  displayedStandaloneCount: number;
  displayedConfluenceCount: number;
  retainedNotDisplayedCount: number;
  displayLegendEntryCount: number;
  displayCap: number;
  displayCapExceeded: boolean;
  displayCapPressure: boolean;
  diversityPressure: boolean;
  repeatedLegendTitleMaxCount: number;
  repeatedLegendTitleMaxTitle: string;
  featureClassDisplayCounts: Record<string, number>;
  placementKindDisplayCounts: Record<string, number>;
  retainedFeatureClassCounts: Record<string, number>;
  retainedPlacementKindCounts: Record<string, number>;
  placementSemanticIds: string[];
  anchorSemanticIds: string[];
  fallbackAnchorSemanticIds: string[];
  semanticAnchorMismatchCount: number;
  labelSemanticRiskCount: number;
  splitSourceFeatureCount: number;
  multiZoneStandaloneEntryViolationCount: number;
  legendEntryCount: number;
  legendConfluenceCount: number;
  legendTransitionWarningCount: number;
  legendForbiddenHits: string[];
  recoveredFallbackCount: number;
  productionSvgFile: string;
  rendererWarningCount: number;
  rendererWarnings: string[];
  renderedNumberCount: number;
  calloutLabelCount: number;
  renderedUnifiedConfluenceCount: number;
  stackedConfluenceMemberRenderCount: number;
  retainedRenderedCount: number;
  appWidthProductionSvgFile: string;
  appWidthRendererWarningCount: number;
  appWidthRendererWarnings: string[];
  appWidthRenderedNumberCount: number;
  appWidthCalloutLabelCount: number;
  appWidthRenderedUnifiedConfluenceCount: number;
  appWidthStackedConfluenceMemberRenderCount: number;
  appWidthRetainedRenderedCount: number;
  appWidthSvgViewBox: string;
  pointZoneNearLargeLakeMinimumCount: number;
  constrictionMinorAxisWidthCappedCount: number;
  constrictionZoneLargeForConnectorReviewCount: number;
  qaFlags: string[];
  svgFile: string;
  jsonFile: string;
};

type CliOptions = {
  lakeFilter?: string;
  seasonFilter?: WaterReaderSeason;
  writeSvg: boolean;
  timings: boolean;
  cliSmoke: boolean;
};

type TimingTotals = {
  fetchMs: number;
  preprocessMs: number;
  featureMs: number;
  zoneMs: number;
  writeMs: number;
  totalMs: number;
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

function parseCliOptions(argv = process.argv.slice(2)): CliOptions {
  const options: CliOptions = {
    writeSvg: true,
    timings: false,
    cliSmoke: process.env.WATER_READER_ZONE_REVIEW_CLI_SMOKE === '1',
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--lake') {
      options.lakeFilter = argv[++i]?.trim();
    } else if (arg === '--season') {
      const season = argv[++i]?.trim() as WaterReaderSeason | undefined;
      if (!season || !['spring', 'summer', 'fall', 'winter'].includes(season)) {
        throw new Error(`Invalid --season value: ${season ?? ''}`);
      }
      options.seasonFilter = season;
    } else if (arg === '--no-svg') {
      options.writeSvg = false;
    } else if (arg === '--timings') {
      options.timings = true;
    } else if (arg === '--cli-smoke') {
      options.cliSmoke = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function filteredCases(options: CliOptions): MatrixCase[] {
  if (!options.lakeFilter) return CASES;
  const needle = options.lakeFilter.toLowerCase();
  const rows = CASES.filter((item) => item.label.toLowerCase().includes(needle) || slugFilePart(item.label).includes(needle));
  if (rows.length === 0) throw new Error(`No review lake matches --lake ${options.lakeFilter}`);
  return rows;
}

function filteredSeasons(options: CliOptions): Array<{ season: WaterReaderSeason; date: Date }> {
  return options.seasonFilter ? SEASON_REVIEWS.filter((item) => item.season === options.seasonFilter) : SEASON_REVIEWS;
}

function createTimingTotals(): TimingTotals {
  return { fetchMs: 0, preprocessMs: 0, featureMs: 0, zoneMs: 0, writeMs: 0, totalMs: 0 };
}

function addTiming<T>(totals: TimingTotals, key: keyof Omit<TimingTotals, 'totalMs'>, fn: () => T): T {
  const start = Date.now();
  try {
    return fn();
  } finally {
    totals[key] += Date.now() - start;
  }
}

async function addAsyncTiming<T>(totals: TimingTotals, key: keyof Omit<TimingTotals, 'totalMs'>, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    return await fn();
  } finally {
    totals[key] += Date.now() - start;
  }
}

function timingLine(totals: TimingTotals): string {
  return `timings fetch=${totals.fetchMs}ms preprocess=${totals.preprocessMs}ms features=${totals.featureMs}ms zones=${totals.zoneMs}ms write=${totals.writeMs}ms total=${totals.totalMs}ms`;
}

function zoneCounterLine(rows: SummaryRow[]): string {
  const totals = rows.reduce(
    (acc, row) => {
      const diag = row.zoneDiagnostics;
      acc.draftCount += typeof diag.draftCount === 'number' ? diag.draftCount : 0;
      acc.materializedCandidateCount += typeof diag.materializedCandidateCount === 'number' ? diag.materializedCandidateCount : 0;
      acc.validCandidateCount += typeof diag.validCandidateCount === 'number' ? diag.validCandidateCount : 0;
      acc.unitCombinationAttemptCount += typeof diag.unitCombinationAttemptCount === 'number' ? diag.unitCombinationAttemptCount : 0;
      for (const unit of diag.unitDiagnostics ?? []) {
        if (unit.elapsedMs > acc.slowestUnitMs) {
          acc.slowestUnitMs = unit.elapsedMs;
          acc.slowestUnit = `${unit.featureId}:${unit.featureClass}:${unit.elapsedMs}ms`;
        }
      }
      return acc;
    },
    { draftCount: 0, materializedCandidateCount: 0, validCandidateCount: 0, unitCombinationAttemptCount: 0, slowestUnitMs: 0, slowestUnit: '' },
  );
  return `zone-counters drafts=${totals.draftCount} materialized=${totals.materializedCandidateCount} valid=${totals.validCandidateCount} combinations=${totals.unitCombinationAttemptCount} slowestUnit=${totals.slowestUnit || 'none'}`;
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
  const s = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function summaryCsv(rows: SummaryRow[]): string {
  const classes = ['main_lake_point', 'secondary_point', 'cove', 'neck', 'saddle', 'island', 'dam', 'universal'];
  const header = [
    'lake_label',
    'matched_name',
    'lake_id',
    'support_status',
    'season',
    'season_group',
    'detected_feature_count',
    'selected_feature_count',
    'suppressed_feature_count',
    'detected_unrepresentable_feature_count',
    'zone_count',
    'feature_envelope_zone_count',
    'non_envelope_legacy_zone_count',
    'selected_feature_without_envelope_zone_count',
    'feature_envelope_suppression_diagnostics',
    'feature_envelope_unrepresentable_diagnostics',
    'feature_envelope_unrepresentable_by_feature_class_reason',
    'whole_feature_outside_water_center_accepted_count',
    'whole_feature_outside_water_center_accepted_by_feature_class',
    'whole_feature_outside_water_center_max_visible_water_distance_m',
    'whole_feature_outside_water_center_max_locality_radius_m',
    'whole_feature_outside_water_center_max_anchor_distance_m',
    'universal_count',
    ...classes.map((cls) => `zones_${cls}`),
    'suppressed_candidate_features',
    'suppression_diagnostics',
    'rejected_zone_diagnostics',
    'dropped_zone_diagnostics',
    'confluence_group_count',
    'confluence_groups',
    'displayed_entry_count',
    'displayed_standalone_count',
    'displayed_confluence_count',
    'retained_not_displayed_count',
    'display_legend_entry_count',
    'display_cap',
    'display_cap_exceeded',
    'display_cap_pressure',
    'diversity_pressure',
    'repeated_legend_title_max_count',
    'repeated_legend_title_max_title',
    'feature_class_display_counts',
    'placement_kind_display_counts',
    'retained_feature_class_counts',
    'retained_placement_kind_counts',
    'placement_semantic_ids',
    'anchor_semantic_ids',
    'fallback_anchor_semantic_ids',
    'semantic_anchor_mismatch_count',
    'label_semantic_risk_count',
    'split_source_feature_count',
    'multi_zone_standalone_entry_violation_count',
    'legend_entry_count',
    'legend_confluence_count',
    'legend_transition_warning_count',
    'legend_forbidden_hits',
    'recovered_fallback_count',
    'production_svg_file',
    'renderer_warning_count',
    'renderer_warnings',
    'rendered_number_count',
    'callout_label_count',
    'rendered_unified_confluence_count',
    'stacked_confluence_member_render_count',
    'retained_rendered_count',
    'app_width_production_svg_file',
    'app_width_renderer_warning_count',
    'app_width_renderer_warnings',
    'app_width_rendered_number_count',
    'app_width_callout_label_count',
    'app_width_rendered_unified_confluence_count',
    'app_width_stacked_confluence_member_render_count',
    'app_width_retained_rendered_count',
    'app_width_svg_view_box',
    'point_zone_near_large_lake_minimum_count',
    'constriction_minor_axis_width_capped_count',
    'constriction_zone_large_for_connector_review_count',
    'qa_flags',
    'svg_file',
    'json_file',
  ];
  const lines = rows.map((row) =>
    [
      row.lakeLabel,
      row.matchedName,
      row.lakeId,
      row.supportStatus,
      row.season,
      row.seasonGroup,
      row.detectedFeatureCount,
      row.selectedFeatureCount,
      row.suppressedFeatureCount,
      row.detectedUnrepresentableFeatureCount,
      row.zoneCount,
      row.featureEnvelopeZoneCount,
      row.nonEnvelopeLegacyZoneCount,
      row.selectedFeatureWithoutEnvelopeZoneCount,
      row.featureEnvelopeSuppressionDiagnostics,
      row.featureEnvelopeUnrepresentableDiagnostics,
      row.featureEnvelopeUnrepresentableByFeatureClassReason,
      row.wholeFeatureOutsideWaterCenterAcceptedCount,
      row.wholeFeatureOutsideWaterCenterAcceptedByFeatureClass,
      row.wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM,
      row.wholeFeatureOutsideWaterCenterMaxLocalityRadiusM,
      row.wholeFeatureOutsideWaterCenterMaxAnchorDistanceM,
      row.universalCount,
      ...classes.map((cls) => row.zoneCounts[cls] ?? 0),
      row.suppressedCandidateFeatures,
      row.suppressionDiagnostics,
      row.rejectedZoneDiagnostics,
      row.droppedZoneDiagnostics,
      row.confluenceGroupCount,
      row.confluenceGroups,
      row.displayedEntryCount,
      row.displayedStandaloneCount,
      row.displayedConfluenceCount,
      row.retainedNotDisplayedCount,
      row.displayLegendEntryCount,
      row.displayCap,
      row.displayCapExceeded,
      row.displayCapPressure,
      row.diversityPressure,
      row.repeatedLegendTitleMaxCount,
      row.repeatedLegendTitleMaxTitle,
      row.featureClassDisplayCounts,
      row.placementKindDisplayCounts,
      row.retainedFeatureClassCounts,
      row.retainedPlacementKindCounts,
      row.placementSemanticIds.join('|'),
      row.anchorSemanticIds.join('|'),
      row.fallbackAnchorSemanticIds.join('|'),
      row.semanticAnchorMismatchCount,
      row.labelSemanticRiskCount,
      row.splitSourceFeatureCount,
      row.multiZoneStandaloneEntryViolationCount,
      row.legendEntryCount,
      row.legendConfluenceCount,
      row.legendTransitionWarningCount,
      row.legendForbiddenHits.join('|'),
      row.recoveredFallbackCount,
      row.productionSvgFile,
      row.rendererWarningCount,
      row.rendererWarnings.join('|'),
      row.renderedNumberCount,
      row.calloutLabelCount,
      row.renderedUnifiedConfluenceCount,
      row.stackedConfluenceMemberRenderCount,
      row.retainedRenderedCount,
      row.appWidthProductionSvgFile,
      row.appWidthRendererWarningCount,
      row.appWidthRendererWarnings.join('|'),
      row.appWidthRenderedNumberCount,
      row.appWidthCalloutLabelCount,
      row.appWidthRenderedUnifiedConfluenceCount,
      row.appWidthStackedConfluenceMemberRenderCount,
      row.appWidthRetainedRenderedCount,
      row.appWidthSvgViewBox,
      row.pointZoneNearLargeLakeMinimumCount,
      row.constrictionMinorAxisWidthCappedCount,
      row.constrictionZoneLargeForConnectorReviewCount,
      row.qaFlags.join('|'),
      row.svgFile,
      row.jsonFile,
    ]
      .map(csvCell)
      .join(','),
  );
  return `${header.join(',')}\n${lines.join('\n')}\n`;
}

function zoneCounts(zones: WaterReaderPlacedZone[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const zone of zones) counts[zone.featureClass] = (counts[zone.featureClass] ?? 0) + 1;
  return counts;
}

function recoveredFallbackCount(zones: WaterReaderPlacedZone[]): number {
  return zones.filter((zone) => zone.diagnostics.fallbackPlacementUsed === true).length;
}

function zoneQaFlagCount(zones: WaterReaderPlacedZone[], flag: string): number {
  return zones.filter((zone) => zone.qaFlags.includes(flag)).length;
}

function coverageCounts(zoneResult: WaterReaderZonePlacementResult): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const coverage of zoneResult.diagnostics.featureCoverage) {
    if (coverage.producedVisibleZones) continue;
    counts[coverage.reason] = (counts[coverage.reason] ?? 0) + 1;
  }
  return counts;
}

function legendForbiddenHits(legend: WaterReaderLegendEntry[]): string[] {
  return [...new Set(legend.flatMap((entry) =>
    waterReaderLegendForbiddenPhraseHits([entry.title, entry.body, entry.transitionWarning ?? ''].join(' ')),
  ))].sort((a, b) => a.localeCompare(b));
}

function maxRepeatedLegendTitle(legend: WaterReaderLegendEntry[]): { title: string; count: number } {
  const counts: Record<string, number> = {};
  for (const entry of legend) counts[entry.title] = (counts[entry.title] ?? 0) + 1;
  return Object.entries(counts).reduce(
    (best, [title, count]) => count > best.count || (count === best.count && title.localeCompare(best.title) < 0)
      ? { title, count }
      : best,
    { title: '', count: 0 },
  );
}

function entryValueCounts(
  entries: Array<{ featureClasses: string[]; placementKinds: string[] }>,
  key: 'featureClasses' | 'placementKinds',
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    for (const value of entry[key]) counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
}

function semanticIdsForDisplayedZones(displayModel: ReturnType<typeof buildWaterReaderDisplayModel>, key: 'placementSemanticId' | 'anchorSemanticId'): string[] {
  return [...new Set(displayModel.displayedEntries.flatMap((entry) =>
    entry.zones.map((zone) => zone[key]).filter((value): value is string => Boolean(value)),
  ))].sort((a, b) => a.localeCompare(b));
}

function fallbackAnchorSemanticIds(displayModel: ReturnType<typeof buildWaterReaderDisplayModel>): string[] {
  return [...new Set(displayModel.displayedEntries.flatMap((entry) =>
    entry.zones
      .filter((zone) => zone.diagnostics.fallbackPlacementUsed === true)
      .map((zone) => zone.anchorSemanticId)
      .filter((value): value is string => Boolean(value)),
  ))].sort((a, b) => a.localeCompare(b));
}

function semanticAnchorMismatchCount(displayModel: ReturnType<typeof buildWaterReaderDisplayModel>): number {
  return displayModel.displayedEntries.flatMap((entry) => entry.zones).filter((zone) => (
    zone.diagnostics.fallbackPlacementUsed === true &&
    Boolean(zone.placementSemanticId) &&
    Boolean(zone.anchorSemanticId) &&
    zone.placementSemanticId !== zone.anchorSemanticId
  )).length;
}

function labelSemanticRiskCount(displayModel: ReturnType<typeof buildWaterReaderDisplayModel>): number {
  return displayModel.displayedEntries.flatMap((entry) => entry.zones.map((zone) => ({ zone, title: entry.legend?.title ?? '' }))).filter(({ zone, title }) => {
    const anchor = zone.anchorSemanticId ?? '';
    if (zone.placementKind === 'cove_back' && anchor !== 'cove_back_primary' && title.includes('Back Shoreline')) return true;
    if (zone.placementKind === 'cove_irregular_side' && anchor.startsWith('cove_mouth_') && title.includes('Irregular Side')) return true;
    if (zone.placementKind === 'main_point_open_water' && anchor !== 'main_point_open_water_area' && title.includes('Open-Water Side')) return true;
    if (zone.placementKind === 'island_mainland' && anchor !== 'island_mainland_primary' && title.includes('Mainland-Facing Edge')) return true;
    if (zone.placementKind === 'island_open_water' && anchor !== 'island_open_water_area' && title.includes('Open-Water Edge')) return true;
    if (
      zone.placementKind === 'island_endpoint' &&
      anchor !== 'island_endpoint_a' &&
      anchor !== 'island_endpoint_b' &&
      anchor !== 'shoreline_frame_recovery' &&
      title.includes('Island End')
    ) return true;
    if (
      (zone.placementKind === 'secondary_point_back' || zone.placementKind === 'secondary_point_mouth') &&
      !anchor.endsWith('_true') &&
      (title.includes('Back-Facing Side') || title.includes('Mouth-Facing Side'))
    ) return true;
    return false;
  }).length;
}

function diversityPressure(
  displayModel: ReturnType<typeof buildWaterReaderDisplayModel>,
  repeatedLegend: { title: string; count: number },
  featureClassDisplayCounts: Record<string, number>,
  placementKindDisplayCounts: Record<string, number>,
): boolean {
  const displayedCount = displayModel.displayedEntries.length;
  return (
    repeatedLegend.count >= 4 ||
    Math.max(0, ...Object.values(featureClassDisplayCounts)) >= Math.max(4, displayedCount - 1) ||
    Math.max(0, ...Object.values(placementKindDisplayCounts)) >= Math.max(4, displayedCount - 1)
  );
}

function legendCopySummary(rows: SummaryRow[]) {
  return {
    legendEntryCount: rows.reduce((sum, row) => sum + row.legendEntryCount, 0),
    legendConfluenceCount: rows.reduce((sum, row) => sum + row.legendConfluenceCount, 0),
    legendTransitionWarningCount: rows.reduce((sum, row) => sum + row.legendTransitionWarningCount, 0),
    rowsWithForbiddenHits: rows
      .filter((row) => row.legendForbiddenHits.length > 0)
      .map((row) => ({
        lakeLabel: row.lakeLabel,
        season: row.season,
        jsonFile: row.jsonFile,
        hits: row.legendForbiddenHits,
      })),
  };
}

function displayModelSummary(rows: SummaryRow[]) {
  return {
    displayedEntryCount: rows.reduce((sum, row) => sum + row.displayedEntryCount, 0),
    displayedStandaloneCount: rows.reduce((sum, row) => sum + row.displayedStandaloneCount, 0),
    displayedConfluenceCount: rows.reduce((sum, row) => sum + row.displayedConfluenceCount, 0),
    retainedNotDisplayedCount: rows.reduce((sum, row) => sum + row.retainedNotDisplayedCount, 0),
    displayLegendEntryCount: rows.reduce((sum, row) => sum + row.displayLegendEntryCount, 0),
    splitSourceFeatureCount: rows.reduce((sum, row) => sum + row.splitSourceFeatureCount, 0),
    multiZoneStandaloneEntryViolationCount: rows.reduce((sum, row) => sum + row.multiZoneStandaloneEntryViolationCount, 0),
    capExceededRows: rows
      .filter((row) => row.displayCapExceeded)
      .map((row) => ({
        lakeLabel: row.lakeLabel,
        season: row.season,
        displayCap: row.displayCap,
        displayedEntryCount: row.displayedEntryCount,
        retainedNotDisplayedCount: row.retainedNotDisplayedCount,
        splitSourceFeatureCount: row.splitSourceFeatureCount,
        multiZoneStandaloneEntryViolationCount: row.multiZoneStandaloneEntryViolationCount,
        jsonFile: row.jsonFile,
      })),
  };
}

function rendererSummary(rows: SummaryRow[]) {
  return {
    rendererWarningCount: rows.reduce((sum, row) => sum + row.rendererWarningCount, 0),
    renderedNumberCount: rows.reduce((sum, row) => sum + row.renderedNumberCount, 0),
    retainedRenderedCount: rows.reduce((sum, row) => sum + row.retainedRenderedCount, 0),
    appWidthRendererWarningCount: rows.reduce((sum, row) => sum + row.appWidthRendererWarningCount, 0),
    appWidthRenderedNumberCount: rows.reduce((sum, row) => sum + row.appWidthRenderedNumberCount, 0),
    appWidthRetainedRenderedCount: rows.reduce((sum, row) => sum + row.appWidthRetainedRenderedCount, 0),
    rowsWithWarnings: rows
      .filter((row) => row.rendererWarningCount > 0)
      .map((row) => ({
        lakeLabel: row.lakeLabel,
        season: row.season,
        productionSvgFile: row.productionSvgFile,
        warnings: row.rendererWarnings,
      })),
    appWidthRowsWithWarnings: rows
      .filter((row) => row.appWidthRendererWarningCount > 0)
      .map((row) => ({
        lakeLabel: row.lakeLabel,
        season: row.season,
        productionSvgFile: row.appWidthProductionSvgFile,
        warnings: row.appWidthRendererWarnings,
        viewBox: row.appWidthSvgViewBox,
      })),
  };
}

function bboxForPreprocess(preprocess: WaterReaderPreprocessResult, zones: WaterReaderPlacedZone[] = []) {
  const bbox = preprocess.metrics?.bboxM;
  if (!bbox) return null;
  const extents = { ...bbox };
  for (const zone of zones) {
    for (const point of [...zone.unclippedRing, ...zone.visibleWaterRing]) {
      extents.minX = Math.min(extents.minX, point.x);
      extents.maxX = Math.max(extents.maxX, point.x);
      extents.minY = Math.min(extents.minY, point.y);
      extents.maxY = Math.max(extents.maxY, point.y);
    }
  }
  const rawW = Math.max(1, extents.maxX - extents.minX);
  const rawH = Math.max(1, extents.maxY - extents.minY);
  const padM = Math.max(rawW, rawH) * 0.06;
  const minX = extents.minX - padM;
  const maxX = extents.maxX + padM;
  const minY = extents.minY - padM;
  const maxY = extents.maxY + padM;
  const w = Math.max(1, maxX - minX);
  const h = Math.max(1, maxY - minY);
  const innerW = SVG_W - PAD * 2;
  const innerH = Math.max(360, Math.min(820, (innerW * h) / w));
  const scale = Math.min(innerW / w, innerH / h);
  return {
    width: SVG_W,
    height: Math.ceil(innerH + HEADER_H + PAD * 2),
    minX,
    maxY,
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

function circle(point: PointM, t: SvgTransform, r: number, fill: string, stroke = '#ffffff', opacity = 1): string {
  const p = pt(point, t);
  return `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${r}" fill="${fill}" fill-opacity="${opacity}" stroke="${stroke}" stroke-width="1" />`;
}

function line(a: PointM, b: PointM, t: SvgTransform, stroke: string, width: number, dash = '', opacity = 1): string {
  const pa = pt(a, t);
  const pb = pt(b, t);
  const dashAttr = dash ? ` stroke-dasharray="${dash}"` : '';
  return `<line x1="${pa.x.toFixed(2)}" y1="${pa.y.toFixed(2)}" x2="${pb.x.toFixed(2)}" y2="${pb.y.toFixed(2)}" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${width}"${dashAttr} />`;
}

function label(text: string, point: PointM, t: SvgTransform, dx = 8, dy = -8, size = 10): string {
  const p = pt(point, t);
  return `<text x="${(p.x + dx).toFixed(1)}" y="${(p.y + dy).toFixed(1)}" font-size="${size}" font-family="system-ui,Segoe UI,sans-serif" font-weight="700" fill="#111827">${escapeXmlText(text)}</text>`;
}

function zoneColor(featureClass: string): string {
  switch (featureClass) {
    case 'neck':
      return '#f97316';
    case 'saddle':
      return '#14b8a6';
    case 'main_lake_point':
      return '#2563eb';
    case 'secondary_point':
      return '#60a5fa';
    case 'cove':
      return '#16a34a';
    case 'island':
      return '#9333ea';
    case 'dam':
      return '#dc2626';
    default:
      return '#ca8a04';
  }
}

function featureAnchorLayer(features: WaterReaderDetectedFeature[], t: SvgTransform): string {
  let out = '';
  for (const feature of features) {
    switch (feature.featureClass) {
      case 'main_lake_point':
      case 'secondary_point':
        out += circle(feature.tip, t, 2.6, '#1d4ed8', '#ffffff', 0.45);
        out += line(feature.leftSlope, feature.rightSlope, t, '#1d4ed8', 0.9, '3 3', 0.25);
        break;
      case 'cove':
        out += line(feature.mouthLeft, feature.mouthRight, t, '#15803d', 0.9, '4 3', 0.35);
        out += circle(feature.back, t, 2.8, '#15803d', '#ffffff', 0.4);
        break;
      case 'neck':
      case 'saddle':
        out += line(feature.endpointA, feature.endpointB, t, '#0f172a', 1.1, '4 4', 0.35);
        out += circle(feature.endpointA, t, 2.8, '#0f172a', '#ffffff', 0.4);
        out += circle(feature.endpointB, t, 2.8, '#0f172a', '#ffffff', 0.4);
        break;
      case 'island':
        out += circle(feature.endpointA, t, 2.6, '#7e22ce', '#ffffff', 0.45);
        out += circle(feature.endpointB, t, 2.6, '#7e22ce', '#ffffff', 0.45);
        break;
      case 'dam':
        out += line(feature.cornerA, feature.cornerB, t, '#b91c1c', 1.1, '', 0.35);
        break;
      default:
        break;
    }
  }
  return out;
}

function zoneLayer(zones: WaterReaderPlacedZone[], t: SvgTransform): string {
  let out = '';
  zones.forEach((zone, index) => {
    const color = zoneColor(zone.featureClass);
    out += `<path d="${pathD(zone.unclippedRing, t, true)}" fill="${color}" fill-opacity="0.07" stroke="${color}" stroke-opacity="0.22" stroke-width="1" stroke-dasharray="4 4" />`;
    for (const segment of visibleSegments(zone)) {
      if (segment.length >= 2) {
        out += `<path d="${pathD(segment, t, false)}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />`;
      }
    }
    out += circle(zone.anchor, t, 3.5, color, '#ffffff', 0.9);
    out += circle(zone.ovalCenter, t, 2.4, '#111827', '#ffffff', 0.9);
    out += label(`${index + 1}`, zone.ovalCenter, t, -4, 4, 12);
    out += label(`${zone.visibleWaterFraction.toFixed(2)} ${zone.placementKind}`, zone.ovalCenter, t, 12, 14, 9);
  });
  return out;
}

function confluenceLayer(zones: WaterReaderPlacedZone[], t: SvgTransform): string {
  const groups = new Map<string, WaterReaderPlacedZone[]>();
  for (const zone of zones) {
    const groupId = zone.diagnostics.structureConfluenceGroupId;
    if (typeof groupId !== 'string' || !groupId) continue;
    const existing = groups.get(groupId) ?? [];
    existing.push(zone);
    groups.set(groupId, existing);
  }
  let out = '';
  for (const [groupId, members] of groups) {
    if (members.length < 2) continue;
    const center = {
      x: members.reduce((sum, zone) => sum + zone.ovalCenter.x, 0) / members.length,
      y: members.reduce((sum, zone) => sum + zone.ovalCenter.y, 0) / members.length,
    };
    const strength = members.some((zone) => zone.diagnostics.structureConfluenceStrength === 'strong') ? 'strong' : 'light';
    const maxRadius = Math.max(...members.map((zone) => Math.max(zone.majorAxisM, zone.minorAxisM))) * 0.62;
    const p = pt(center, t);
    out += `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${Math.max(16, maxRadius * t.scale).toFixed(2)}" fill="none" stroke="#7c3aed" stroke-opacity="${strength === 'strong' ? '0.55' : '0.35'}" stroke-width="1.6" stroke-dasharray="5 4" />`;
    out += label(`confluence ${groupId.replace('confluence-', '')}`, center, t, 10, -12, 9);
  }
  return out;
}

function visibleSegments(zone: WaterReaderPlacedZone): RingM[] {
  if (zone.visibleWaterRing.length < 2) return [];
  const maxGap = Math.max(zone.majorAxisM, zone.minorAxisM) * 0.22;
  const segments: RingM[] = [];
  let current: RingM = [];
  for (const point of zone.visibleWaterRing) {
    const prev = current[current.length - 1];
    if (prev && Math.hypot(point.x - prev.x, point.y - prev.y) > maxGap) {
      if (current.length >= 2) segments.push(current);
      current = [];
    }
    current.push(point);
  }
  if (current.length >= 2) segments.push(current);
  return segments;
}

function buildSvg(params: {
  label: string;
  poly: WaterbodyPolygonResponse;
  preprocess: WaterReaderPreprocessResult;
  features: WaterReaderDetectedFeature[];
  zoneResult: WaterReaderZonePlacementResult;
}): string {
  const t = bboxForPreprocess(params.preprocess, params.zoneResult.zones);
  if (!t) throw new Error(`Cannot render SVG for ${params.label}: missing projected bbox`);
  const lakeD = lakePathD(params.preprocess, t);
  const zoneCountLine = `candidates:${params.zoneResult.diagnostics.detectedFeatureCount} selected-features:${params.zoneResult.diagnostics.selectedFeatureCount} suppressed:${params.zoneResult.diagnostics.suppressedFeatureCount} zones:${params.zoneResult.zones.length} season:${params.zoneResult.season}/${params.zoneResult.seasonGroup ?? 'unknown'}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${t.width}" height="${t.height}" viewBox="0 0 ${t.width} ${t.height}">
  <rect width="100%" height="100%" fill="#f8fafc"/>
  <text x="18" y="24" font-size="17" font-family="system-ui,Segoe UI,sans-serif" font-weight="800" fill="#0f172a">${escapeXmlText(params.poly.name ?? params.label)}</text>
  <text x="18" y="46" font-size="12" font-family="system-ui,Segoe UI,sans-serif" fill="#334155">${escapeXmlText(`${params.label} | ${params.preprocess.supportStatus} | ${zoneCountLine}`)}</text>
  <text x="18" y="66" font-size="11" font-family="system-ui,Segoe UI,sans-serif" fill="#64748b">${escapeXmlText('Final zone ovals shown as sampled visible-water arcs; faint anchors are detected candidate cues, not necessarily selected features.')}</text>
  <path d="${lakeD}" fill="#c5ddf0" fill-rule="evenodd" stroke="#2a5f87" stroke-width="1.3"/>
  ${featureAnchorLayer(params.features, t)}
  ${zoneLayer(params.zoneResult.zones, t)}
  ${confluenceLayer(params.zoneResult.zones, t)}
</svg>
`;
}

function zoneDebug(zone: WaterReaderPlacedZone, longestDimensionM?: number) {
  const confluenceGroupId = typeof zone.diagnostics.structureConfluenceGroupId === 'string'
    ? zone.diagnostics.structureConfluenceGroupId
    : null;
  return {
    zoneId: zone.zoneId,
    sourceFeatureId: zone.sourceFeatureId,
    featureClass: zone.featureClass,
    placementKind: zone.placementKind,
    placementSemanticId: zone.placementSemanticId ?? null,
    anchorSemanticId: zone.anchorSemanticId ?? null,
    confluenceGroupId,
    confluenceStrength: zone.diagnostics.structureConfluenceStrength ?? null,
    confluenceMemberCount: zone.diagnostics.structureConfluenceMemberCount ?? null,
    visibleWaterFraction: zone.visibleWaterFraction,
    outsideOvalBoundaryFraction: zone.diagnostics.outsideOvalBoundaryFraction ?? null,
    majorAxisM: zone.majorAxisM,
    majorAxisPctOfLakeLongestDimension: longestDimensionM && longestDimensionM > 0
      ? (zone.majorAxisM / longestDimensionM) * 100
      : null,
    minorAxisM: zone.minorAxisM,
    qaFlags: zone.qaFlags,
    featureEnvelope: featureEnvelopeDebug(zone),
    diagnostics: zone.diagnostics,
    anchor: zone.anchor,
    ovalCenter: zone.ovalCenter,
    rotationRad: zone.rotationRad,
    visibleWaterRing: zone.visibleWaterRing,
    unclippedRing: zone.unclippedRing,
  };
}

function featureEnvelopeDebug(zone: WaterReaderPlacedZone) {
  const diagnostics = zone.diagnostics;
  if (diagnostics.featureEnvelopeModelVersion !== 'feature-envelope-v1') return null;
  return {
    modelVersion: diagnostics.featureEnvelopeModelVersion,
    sourceFeatureId: diagnostics.featureEnvelopeSourceFeatureId ?? zone.sourceFeatureId,
    geometryKind: diagnostics.featureEnvelopeGeometryKind ?? null,
    includes: Array.isArray(diagnostics.featureEnvelopeIncludes) ? diagnostics.featureEnvelopeIncludes : [],
    seasonInvariant: diagnostics.featureEnvelopeSeasonInvariant === true,
    suppressionReason: diagnostics.featureEnvelopeSuppressionReason ?? null,
    seasonalEmphasisOnly: diagnostics.seasonalEmphasisOnly === true,
    renderShape: diagnostics.featureEnvelopeRenderShape ?? null,
    renderLobeCount: diagnostics.featureEnvelopeRenderLobeCount ?? null,
    islandStructureAreaCentered: diagnostics.islandStructureAreaCentered ?? null,
    islandCentroid: typeof diagnostics.islandCentroidX === 'number' && typeof diagnostics.islandCentroidY === 'number'
      ? { x: diagnostics.islandCentroidX, y: diagnostics.islandCentroidY }
      : null,
    islandBufferRadiusM: diagnostics.islandBufferRadiusM ?? null,
    islandLandHoleClippingBehavior: diagnostics.islandLandHoleClippingBehavior ?? null,
    constrictionRepresentation: diagnostics.constrictionRepresentation ?? null,
    constrictionPairedShoulderCoverage: diagnostics.constrictionPairedShoulderCoverage ?? null,
  };
}

function featureEnvelopeSummary(zones: WaterReaderPlacedZone[]) {
  const envelopeZones = zones.filter((zone) => zone.diagnostics.featureEnvelopeModelVersion === 'feature-envelope-v1');
  const outsideWaterAccepted = wholeFeatureOutsideWaterCenterAcceptedSummary(envelopeZones);
  return {
    zoneCount: envelopeZones.length,
    nonEnvelopeLegacyZoneCount: zones.length - envelopeZones.length,
    placementKinds: [...new Set(envelopeZones.map((zone) => zone.placementKind))].sort((a, b) => a.localeCompare(b)),
    geometryKinds: [...new Set(envelopeZones
      .map((zone) => zone.diagnostics.featureEnvelopeGeometryKind)
      .filter((value): value is string => typeof value === 'string'))].sort((a, b) => a.localeCompare(b)),
    sourceFeatureIds: [...new Set(envelopeZones
      .map((zone) => zone.diagnostics.featureEnvelopeSourceFeatureId ?? zone.sourceFeatureId)
      .filter((value): value is string => typeof value === 'string'))].sort((a, b) => a.localeCompare(b)),
    wholeFeatureOutsideWaterCenterAcceptedCount: outsideWaterAccepted.count,
    wholeFeatureOutsideWaterCenterAcceptedByFeatureClass: outsideWaterAccepted.byFeatureClass,
    wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM: outsideWaterAccepted.maxVisibleWaterDistanceM,
    wholeFeatureOutsideWaterCenterMaxLocalityRadiusM: outsideWaterAccepted.maxLocalityRadiusM,
    wholeFeatureOutsideWaterCenterMaxAnchorDistanceM: outsideWaterAccepted.maxAnchorDistanceM,
  };
}

function wholeFeatureOutsideWaterCenterAcceptedSummary(zones: WaterReaderPlacedZone[]) {
  const byFeatureClass: Record<string, number> = {};
  let maxVisibleWaterDistanceM: number | null = null;
  let maxLocalityRadiusM: number | null = null;
  let maxAnchorDistanceM: number | null = null;
  for (const zone of zones) {
    if (zone.diagnostics.wholeFeatureOutsideWaterCenterAccepted !== true) continue;
    byFeatureClass[zone.featureClass] = (byFeatureClass[zone.featureClass] ?? 0) + 1;
    maxVisibleWaterDistanceM = maxNullable(maxVisibleWaterDistanceM, numericDiagnostic(zone.diagnostics.featureFrameMaxVisibleWaterDistanceM));
    maxLocalityRadiusM = maxNullable(maxLocalityRadiusM, numericDiagnostic(zone.diagnostics.featureFrameLocalityRadiusM));
    maxAnchorDistanceM = maxNullable(maxAnchorDistanceM, numericDiagnostic(zone.diagnostics.featureFrameMaxAnchorDistanceM));
  }
  return {
    count: Object.values(byFeatureClass).reduce((sum, count) => sum + count, 0),
    byFeatureClass,
    maxVisibleWaterDistanceM,
    maxLocalityRadiusM,
    maxAnchorDistanceM,
  };
}

function numericDiagnostic(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function maxNullable(a: number | null, b: number | null): number | null {
  if (a === null) return b;
  if (b === null) return a;
  return Math.max(a, b);
}

function featureEnvelopeAudit(zoneResult: WaterReaderZonePlacementResult) {
  const envelopeZones = zoneResult.zones.filter((zone) => zone.diagnostics.featureEnvelopeModelVersion === 'feature-envelope-v1');
  const outsideWaterAccepted = wholeFeatureOutsideWaterCenterAcceptedSummary(envelopeZones);
  const envelopeSourceFeatureIds = new Set(envelopeZones.map((zone) => zone.diagnostics.featureEnvelopeSourceFeatureId ?? zone.sourceFeatureId));
  const selectedFeatureWithoutEnvelopeZoneIds = zoneResult.diagnostics.selectedFeatureIds
    .filter((featureId) => !envelopeSourceFeatureIds.has(featureId))
    .sort((a, b) => a.localeCompare(b));
  const envelopeUnitIds = new Set(zoneResult.diagnostics.unitDiagnostics
    .filter((unit) => unit.placementKinds.some((kind) => kind.endsWith('_structure_area')))
    .map((unit) => unit.featureId));
  const suppressionDiagnostics: Record<string, number> = {};
  const unrepresentableDiagnostics: Record<string, number> = {};
  const unrepresentableByFeatureClassReason: Record<string, number> = {};
  for (const coverage of zoneResult.diagnostics.featureCoverage) {
    if (coverage.producedVisibleZones || !envelopeUnitIds.has(coverage.featureId)) continue;
    if (coverage.reason === 'feature_frame_unrepresentable') {
      const reason = coverage.unrepresentableReason ?? 'unknown_feature_frame_unrepresentable';
      unrepresentableDiagnostics[reason] = (unrepresentableDiagnostics[reason] ?? 0) + 1;
      const classReason = `${coverage.featureClass}:${reason}`;
      unrepresentableByFeatureClassReason[classReason] = (unrepresentableByFeatureClassReason[classReason] ?? 0) + 1;
    } else {
      suppressionDiagnostics[coverage.reason] = (suppressionDiagnostics[coverage.reason] ?? 0) + 1;
    }
  }
  return {
    featureEnvelopeZoneCount: envelopeZones.length,
    nonEnvelopeLegacyZoneCount: zoneResult.zones.length - envelopeZones.length,
    selectedFeatureWithoutEnvelopeZoneCount: selectedFeatureWithoutEnvelopeZoneIds.length,
    selectedFeatureWithoutEnvelopeZoneIds,
    featureEnvelopeSuppressionDiagnostics: suppressionDiagnostics,
    featureEnvelopeUnrepresentableDiagnostics: unrepresentableDiagnostics,
    featureEnvelopeUnrepresentableByFeatureClassReason: unrepresentableByFeatureClassReason,
    wholeFeatureOutsideWaterCenterAcceptedCount: outsideWaterAccepted.count,
    wholeFeatureOutsideWaterCenterAcceptedByFeatureClass: outsideWaterAccepted.byFeatureClass,
    wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM: outsideWaterAccepted.maxVisibleWaterDistanceM,
    wholeFeatureOutsideWaterCenterMaxLocalityRadiusM: outsideWaterAccepted.maxLocalityRadiusM,
    wholeFeatureOutsideWaterCenterMaxAnchorDistanceM: outsideWaterAccepted.maxAnchorDistanceM,
  };
}

function debugJson(params: {
  matrixCase: MatrixCase;
  row: WaterbodySearchResult;
  poly: WaterbodyPolygonResponse;
  preprocess: WaterReaderPreprocessResult;
  features: WaterReaderDetectedFeature[];
  zoneResult: WaterReaderZonePlacementResult;
  legend: WaterReaderLegendEntry[];
  displayModel: WaterReaderDisplayModel;
  productionSvgResult: WaterReaderProductionSvgResult | null;
  appWidthProductionSvgResult: WaterReaderProductionSvgResult | null;
  legendForbiddenHits: string[];
}) {
  return {
    lakeLabel: params.matrixCase.label,
    matchedName: params.poly.name,
    lakeId: params.row.lakeId,
    supportStatus: params.preprocess.supportStatus,
    supportReason: params.preprocess.supportReason,
    metrics: params.preprocess.metrics,
    qaFlags: [...params.preprocess.qaFlags, ...params.zoneResult.qaFlags],
    season: params.zoneResult.season,
    seasonGroup: params.zoneResult.seasonGroup,
    detectedFeatureCount: params.zoneResult.diagnostics.detectedFeatureCount,
    selectedFeatureCount: params.zoneResult.diagnostics.selectedFeatureCount,
    suppressedFeatureCount: params.zoneResult.diagnostics.suppressedFeatureCount,
    zoneCount: params.zoneResult.zones.length,
    zonePlacementDiagnostics: params.zoneResult.diagnostics,
    featureCoverage: params.zoneResult.diagnostics.featureCoverage,
    selectedFeatureIds: params.zoneResult.diagnostics.selectedFeatureIds,
    suppressedCandidateFeatures: params.zoneResult.diagnostics.featureCoverage.filter((coverage) => !coverage.producedVisibleZones),
    candidateFeatures: params.features,
    zones: params.zoneResult.zones.map((zone) => zoneDebug(zone, params.preprocess.metrics?.longestDimensionM)),
    featureEnvelopeSummary: {
      ...featureEnvelopeSummary(params.zoneResult.zones),
      ...featureEnvelopeAudit(params.zoneResult),
    },
    legend: params.legend,
    displayModel: params.displayModel,
    displayEntries: params.displayModel.displayedEntries,
    displayLegendEntries: params.displayModel.displayLegendEntries,
    retainedEntries: params.displayModel.retainedEntries,
    displaySelectionUnits: params.displayModel.displaySelectionUnits,
    displaySummary: params.displayModel.summary,
    splitSourceFeatureIds: params.displayModel.splitSourceFeatureIds,
    productionRenderer: params.productionSvgResult ? {
      warnings: params.productionSvgResult.warnings,
      summary: params.productionSvgResult.summary,
    } : null,
    appWidthProductionRenderer: params.appWidthProductionSvgResult ? {
      warnings: params.appWidthProductionSvgResult.warnings,
      summary: params.appWidthProductionSvgResult.summary,
    } : null,
    legendSummary: {
      entryCount: params.legend.length,
      confluenceCount: params.legend.filter((entry) => entry.isConfluence).length,
      transitionWarningCount: params.legend.filter((entry) => entry.transitionWarning).length,
      forbiddenHits: params.legendForbiddenHits,
    },
  };
}

async function main() {
  const options = parseCliOptions();
  const cases = filteredCases(options);
  const seasonReviews = filteredSeasons(options);
  if (options.cliSmoke) {
    if (options.timings) {
      console.log(timingLine(createTimingTotals()));
      console.log('zone-counters drafts=0 materialized=0 valid=0 combinations=0 slowestUnit=none');
    }
    console.log(JSON.stringify({
      ok: true,
      lakeCount: cases.length,
      seasons: seasonReviews.map((item) => item.season),
      writeSvg: options.writeSvg,
      timings: options.timings,
    }));
    return;
  }
  const timings = createTimingTotals();
  const totalStart = Date.now();
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

  const outputDir = options.lakeFilter || options.seasonFilter ? `${OUT_DIR}/filtered` : OUT_DIR;
  const absOut = resolve(process.cwd(), outputDir);
  if (!options.lakeFilter && !options.seasonFilter) {
    rmSync(absOut, { recursive: true, force: true });
  }
  mkdirSync(absOut, { recursive: true });
  const rows: SummaryRow[] = [];

  for (const matrixCase of cases) {
    const search = await addAsyncTiming(timings, 'fetchMs', () => edge<WaterbodySearchResponse>('waterbody-search', {
      query: matrixCase.searchQuery,
      state: matrixCase.state ?? 'MI',
      limit: SEARCH_LIMIT,
    }));
    const row = matrixCase.find(search.results);
    if (!row) throw new Error(`No search match for ${matrixCase.label}`);
    const poly = await addAsyncTiming(timings, 'fetchMs', () => edge<WaterbodyPolygonResponse>('waterbody-polygon', { lakeId: row.lakeId }));
    if (!poly.geojson) throw new Error(`No polygon GeoJSON for ${matrixCase.label}`);

    const acreage = poly.areaAcres ?? row.polygonAreaAcres ?? row.surfaceAreaAcres ?? null;
    const baseInput = {
      lakeId: row.lakeId,
      name: poly.name,
      state: poly.state,
      acreage,
      geojson: poly.geojson as WaterbodyPolygonGeoJson,
    };
    for (const seasonReview of seasonReviews) {
      const input = { ...baseInput, currentDate: seasonReview.date };
      const preprocess = addTiming(timings, 'preprocessMs', () => preprocessWaterReaderGeometry(input));
      const features = addTiming(timings, 'featureMs', () => detectWaterReaderFeatures(preprocess, input));
      const zoneResult = addTiming(timings, 'zoneMs', () => placeWaterReaderZones(preprocess, features, input, { allowUniversalFallback: false }));
      const legend = buildWaterReaderLegend(zoneResult, { state: input.state, currentDate: input.currentDate });
      const displayModel = buildWaterReaderDisplayModel(zoneResult, legend, {
        acreage,
        longestDimensionM: preprocess.metrics?.longestDimensionM,
      });
      const productionSvgResult = options.writeSvg
        ? buildWaterReaderProductionSvg(displayModel, {
          lakePolygon: preprocess.primaryPolygon,
          title: poly.name ?? matrixCase.label,
          subtitle: `${zoneResult.season} | ${matrixCase.label}`,
        })
        : null;
      const appWidthProductionSvgResult = options.writeSvg
        ? buildWaterReaderProductionSvg(displayModel, {
          lakePolygon: preprocess.primaryPolygon,
          title: poly.name ?? matrixCase.label,
          subtitle: `${zoneResult.season} | ${matrixCase.label}`,
          mapWidth: APP_RENDERER_MAP_WIDTH,
        })
        : null;
      const forbiddenHits = legendForbiddenHits(legend);
      const repeatedLegend = maxRepeatedLegendTitle(displayModel.displayLegendEntries);
      const featureClassDisplayCounts = entryValueCounts(displayModel.displayedEntries, 'featureClasses');
      const placementKindDisplayCounts = entryValueCounts(displayModel.displayedEntries, 'placementKinds');
      const retainedFeatureClassCounts = entryValueCounts(displayModel.retainedEntries, 'featureClasses');
      const retainedPlacementKindCounts = entryValueCounts(displayModel.retainedEntries, 'placementKinds');
      const placementSemanticIds = semanticIdsForDisplayedZones(displayModel, 'placementSemanticId');
      const anchorSemanticIds = semanticIdsForDisplayedZones(displayModel, 'anchorSemanticId');
      const fallbackAnchorIds = fallbackAnchorSemanticIds(displayModel);
      const semanticAnchorMismatch = semanticAnchorMismatchCount(displayModel);
      const labelSemanticRisk = labelSemanticRiskCount(displayModel);
      const displayCapPressure = displayModel.retainedEntries.some((entry) => !entry.rankingDiagnostics.includes('retained_constriction_line_readability'));
      const diversityPressureFlag = diversityPressure(
        displayModel,
        repeatedLegend,
        featureClassDisplayCounts,
        placementKindDisplayCounts,
      );

      const slug = slugFilePart(matrixCase.label);
      const seasonDir = join(absOut, seasonReview.season);
      mkdirSync(seasonDir, { recursive: true });
      const svgFile = `${slug}-zones.svg`;
      const productionSvgFile = `${slug}-water-reader-production.svg`;
      const appWidthProductionSvgFile = `${slug}-water-reader-production-app.svg`;
      const jsonFile = `${slug}-zones-debug.json`;
      const svgPath = options.writeSvg ? `${outputDir}/${seasonReview.season}/${svgFile}` : '';
      const productionSvgPath = options.writeSvg ? `${outputDir}/${seasonReview.season}/${productionSvgFile}` : '';
      const appWidthProductionSvgPath = options.writeSvg ? `${outputDir}/${seasonReview.season}/${appWidthProductionSvgFile}` : '';
      const counts = zoneCounts(zoneResult.zones);
      const coverage = coverageCounts(zoneResult);
      const envelopeAudit = featureEnvelopeAudit(zoneResult);
      const suppressedCandidateFeatures = zoneResult.diagnostics.suppressedFeatureCount;
      const summary: SummaryRow = {
        lakeLabel: matrixCase.label,
        matchedName: poly.name,
        lakeId: row.lakeId,
        supportStatus: preprocess.supportStatus,
        season: zoneResult.season,
        seasonGroup: zoneResult.seasonGroup ?? '',
        detectedFeatureCount: zoneResult.diagnostics.detectedFeatureCount,
        selectedFeatureCount: zoneResult.diagnostics.selectedFeatureCount,
        suppressedFeatureCount: zoneResult.diagnostics.suppressedFeatureCount,
        detectedUnrepresentableFeatureCount: zoneResult.diagnostics.detectedUnrepresentableFeatureCount,
        zoneCount: zoneResult.zones.length,
        featureEnvelopeZoneCount: envelopeAudit.featureEnvelopeZoneCount,
        nonEnvelopeLegacyZoneCount: envelopeAudit.nonEnvelopeLegacyZoneCount,
        selectedFeatureWithoutEnvelopeZoneCount: envelopeAudit.selectedFeatureWithoutEnvelopeZoneCount,
        featureEnvelopeSuppressionDiagnostics: envelopeAudit.featureEnvelopeSuppressionDiagnostics,
        featureEnvelopeUnrepresentableDiagnostics: envelopeAudit.featureEnvelopeUnrepresentableDiagnostics,
        featureEnvelopeUnrepresentableByFeatureClassReason: envelopeAudit.featureEnvelopeUnrepresentableByFeatureClassReason,
        wholeFeatureOutsideWaterCenterAcceptedCount: envelopeAudit.wholeFeatureOutsideWaterCenterAcceptedCount,
        wholeFeatureOutsideWaterCenterAcceptedByFeatureClass: envelopeAudit.wholeFeatureOutsideWaterCenterAcceptedByFeatureClass,
        wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM: envelopeAudit.wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM,
        wholeFeatureOutsideWaterCenterMaxLocalityRadiusM: envelopeAudit.wholeFeatureOutsideWaterCenterMaxLocalityRadiusM,
        wholeFeatureOutsideWaterCenterMaxAnchorDistanceM: envelopeAudit.wholeFeatureOutsideWaterCenterMaxAnchorDistanceM,
        universalCount: counts.universal ?? 0,
        zoneCounts: counts,
        suppressedCandidateFeatures,
        suppressionDiagnostics: coverage,
        rejectedZoneDiagnostics: zoneResult.diagnostics.rejectedByReason,
        droppedZoneDiagnostics: zoneResult.diagnostics.droppedByReason,
        zoneDiagnostics: zoneResult.diagnostics,
        confluenceGroupCount: zoneResult.diagnostics.confluenceGroupCount,
        confluenceGroups: zoneResult.diagnostics.confluenceGroups,
        displayedEntryCount: displayModel.summary.displayedEntryCount,
        displayedStandaloneCount: displayModel.summary.displayedStandaloneCount,
        displayedConfluenceCount: displayModel.summary.displayedConfluenceCount,
        retainedNotDisplayedCount: displayModel.summary.retainedNotDisplayedCount,
        displayLegendEntryCount: displayModel.summary.displayLegendEntryCount,
        displayCap: displayModel.displayCap,
        displayCapExceeded: displayModel.capExceeded,
        displayCapPressure,
        diversityPressure: diversityPressureFlag,
        repeatedLegendTitleMaxCount: repeatedLegend.count,
        repeatedLegendTitleMaxTitle: repeatedLegend.title,
        featureClassDisplayCounts,
        placementKindDisplayCounts,
        retainedFeatureClassCounts,
        retainedPlacementKindCounts,
        placementSemanticIds,
        anchorSemanticIds,
        fallbackAnchorSemanticIds: fallbackAnchorIds,
        semanticAnchorMismatchCount: semanticAnchorMismatch,
        labelSemanticRiskCount: labelSemanticRisk,
        splitSourceFeatureCount: displayModel.summary.splitSourceFeatureCount,
        multiZoneStandaloneEntryViolationCount: displayModel.summary.multiZoneStandaloneEntryViolationCount,
        legendEntryCount: legend.length,
        legendConfluenceCount: legend.filter((entry) => entry.isConfluence).length,
        legendTransitionWarningCount: legend.filter((entry) => entry.transitionWarning).length,
        legendForbiddenHits: forbiddenHits,
        recoveredFallbackCount: recoveredFallbackCount(zoneResult.zones),
        productionSvgFile: productionSvgPath,
        rendererWarningCount: productionSvgResult?.summary.warningCount ?? 0,
        rendererWarnings: productionSvgResult?.warnings.map((warning) => warning.code) ?? [],
        renderedNumberCount: productionSvgResult?.summary.renderedNumberCount ?? 0,
        calloutLabelCount: productionSvgResult?.summary.calloutLabelCount ?? 0,
        renderedUnifiedConfluenceCount: productionSvgResult?.summary.renderedUnifiedConfluenceCount ?? 0,
        stackedConfluenceMemberRenderCount: productionSvgResult?.summary.stackedConfluenceMemberRenderCount ?? 0,
        retainedRenderedCount: productionSvgResult?.summary.retainedRenderedCount ?? 0,
        appWidthProductionSvgFile: appWidthProductionSvgPath,
        appWidthRendererWarningCount: appWidthProductionSvgResult?.summary.warningCount ?? 0,
        appWidthRendererWarnings: appWidthProductionSvgResult?.warnings.map((warning) => warning.code) ?? [],
        appWidthRenderedNumberCount: appWidthProductionSvgResult?.summary.renderedNumberCount ?? 0,
        appWidthCalloutLabelCount: appWidthProductionSvgResult?.summary.calloutLabelCount ?? 0,
        appWidthRenderedUnifiedConfluenceCount: appWidthProductionSvgResult?.summary.renderedUnifiedConfluenceCount ?? 0,
        appWidthStackedConfluenceMemberRenderCount: appWidthProductionSvgResult?.summary.stackedConfluenceMemberRenderCount ?? 0,
        appWidthRetainedRenderedCount: appWidthProductionSvgResult?.summary.retainedRenderedCount ?? 0,
        appWidthSvgViewBox: appWidthProductionSvgResult?.summary.viewBox ?? '',
        pointZoneNearLargeLakeMinimumCount: zoneQaFlagCount(zoneResult.zones, 'point_zone_near_large_lake_minimum'),
        constrictionMinorAxisWidthCappedCount: zoneQaFlagCount(zoneResult.zones, 'constriction_minor_axis_width_capped'),
        constrictionZoneLargeForConnectorReviewCount: zoneQaFlagCount(zoneResult.zones, 'constriction_zone_large_for_connector_review'),
        qaFlags: [...preprocess.qaFlags, ...zoneResult.qaFlags],
        svgFile: svgPath,
        jsonFile: `${outputDir}/${seasonReview.season}/${jsonFile}`,
      };

      addTiming(timings, 'writeMs', () => {
        if (options.writeSvg) {
          writeFileSync(join(seasonDir, svgFile), buildSvg({ label: matrixCase.label, poly, preprocess, features, zoneResult }), 'utf8');
          if (productionSvgResult) writeFileSync(join(seasonDir, productionSvgFile), productionSvgResult.svg, 'utf8');
          if (appWidthProductionSvgResult) writeFileSync(join(seasonDir, appWidthProductionSvgFile), appWidthProductionSvgResult.svg, 'utf8');
        }
        writeFileSync(
          join(seasonDir, jsonFile),
          `${JSON.stringify(debugJson({ matrixCase, row, poly, preprocess, features, zoneResult, legend, displayModel, productionSvgResult, appWidthProductionSvgResult, legendForbiddenHits: forbiddenHits }), null, 2)}\n`,
          'utf8',
        );
      });
      rows.push(summary);
      console.log(JSON.stringify({
        lake: matrixCase.label,
        season: seasonReview.season,
        detectedFeatures: zoneResult.diagnostics.detectedFeatureCount,
        selectedFeatures: zoneResult.diagnostics.selectedFeatureCount,
        suppressedFeatures: zoneResult.diagnostics.suppressedFeatureCount,
        detectedUnrepresentableFeatures: zoneResult.diagnostics.detectedUnrepresentableFeatureCount,
        wholeFeatureOutsideWaterCenterAccepted: envelopeAudit.wholeFeatureOutsideWaterCenterAcceptedCount,
        wholeFeatureOutsideWaterCenterAcceptedByFeatureClass: envelopeAudit.wholeFeatureOutsideWaterCenterAcceptedByFeatureClass,
        wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM: envelopeAudit.wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM,
        wholeFeatureOutsideWaterCenterMaxLocalityRadiusM: envelopeAudit.wholeFeatureOutsideWaterCenterMaxLocalityRadiusM,
        zones: zoneResult.zones.length,
        featureEnvelopeZones: envelopeAudit.featureEnvelopeZoneCount,
        nonEnvelopeLegacyZones: envelopeAudit.nonEnvelopeLegacyZoneCount,
        selectedFeaturesWithoutEnvelopeZones: envelopeAudit.selectedFeatureWithoutEnvelopeZoneCount,
        displayedEntries: displayModel.summary.displayedEntryCount,
        displayLegendEntries: displayModel.summary.displayLegendEntryCount,
        retainedNotDisplayed: displayModel.summary.retainedNotDisplayedCount,
        displayCap: displayModel.displayCap,
        displayCapExceeded: displayModel.capExceeded,
        displayCapPressure,
        diversityPressure: diversityPressureFlag,
        repeatedLegendTitleMaxCount: repeatedLegend.count,
        repeatedLegendTitleMaxTitle: repeatedLegend.title,
        featureClassDisplayCounts,
        placementKindDisplayCounts,
        retainedFeatureClassCounts,
        retainedPlacementKindCounts,
        placementSemanticIds,
        anchorSemanticIds,
        fallbackAnchorSemanticIds: fallbackAnchorIds,
        semanticAnchorMismatchCount: semanticAnchorMismatch,
        labelSemanticRiskCount: labelSemanticRisk,
        splitSourceFeatures: displayModel.summary.splitSourceFeatureCount,
        multiZoneStandaloneEntryViolations: displayModel.summary.multiZoneStandaloneEntryViolationCount,
        productionSvgFile: options.writeSvg ? `${seasonReview.season}/${productionSvgFile}` : null,
        rendererWarnings: productionSvgResult?.summary.warningCount ?? 0,
        renderedUnifiedConfluences: productionSvgResult?.summary.renderedUnifiedConfluenceCount ?? 0,
        stackedConfluenceMemberRenders: productionSvgResult?.summary.stackedConfluenceMemberRenderCount ?? 0,
        renderedNumbers: productionSvgResult?.summary.renderedNumberCount ?? 0,
        calloutLabels: productionSvgResult?.summary.calloutLabelCount ?? 0,
        appWidthProductionSvgFile: options.writeSvg ? `${seasonReview.season}/${appWidthProductionSvgFile}` : null,
        appWidthRendererWarnings: appWidthProductionSvgResult?.summary.warningCount ?? 0,
        appWidthRendererWarningCodes: appWidthProductionSvgResult?.warnings.map((warning) => warning.code) ?? [],
        appWidthRenderedNumbers: appWidthProductionSvgResult?.summary.renderedNumberCount ?? 0,
        appWidthCalloutLabels: appWidthProductionSvgResult?.summary.calloutLabelCount ?? 0,
        appWidthSvgViewBox: appWidthProductionSvgResult?.summary.viewBox ?? null,
        legendEntries: legend.length,
        legendConfluenceEntries: summary.legendConfluenceCount,
        legendTransitionWarnings: summary.legendTransitionWarningCount,
        legendForbiddenHits: forbiddenHits,
        suppressedCandidateFeatures,
        files: { svgFile: options.writeSvg ? `${seasonReview.season}/${svgFile}` : null, jsonFile: `${seasonReview.season}/${jsonFile}` },
      }));
    }
  }

  const expectedRows = cases.length * seasonReviews.length;
  if (rows.length !== expectedRows) throw new Error(`Expected ${expectedRows} review rows, produced ${rows.length}`);
  const combined = 'zone-review-summary.csv';
  writeFileSync(join(absOut, combined), summaryCsv(rows), 'utf8');
  writeFileSync(
    join(absOut, 'zone-review-manifest.json'),
    `${JSON.stringify({
      outputDir,
      allowUniversalFallback: false,
      filters: {
        lake: options.lakeFilter ?? null,
        season: options.seasonFilter ?? null,
        writeSvg: options.writeSvg,
      },
      seasonReviews: seasonReviews.map((item) => ({ season: item.season, reviewDate: item.date.toISOString() })),
      displayModelSummary: displayModelSummary(rows),
      rendererSummary: rendererSummary(rows),
      legendCopySummary: legendCopySummary(rows),
      lakes: rows,
    }, null, 2)}\n`,
    'utf8',
  );
  const copySummary = legendCopySummary(rows);
  if (copySummary.rowsWithForbiddenHits.length > 0) {
    throw new Error(`Forbidden legend copy detected: ${JSON.stringify(copySummary.rowsWithForbiddenHits)}`);
  }
  timings.totalMs = Date.now() - totalStart;
  if (options.timings) {
    console.log(timingLine(timings));
    console.log(zoneCounterLine(rows));
  }
  console.log(JSON.stringify({ ok: true, outputDir, rowCount: rows.length, summary: `${outputDir}/${combined}` }));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
