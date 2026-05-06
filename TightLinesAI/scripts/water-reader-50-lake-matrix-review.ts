import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, relative, resolve } from 'path';
import {
  buildWaterReaderDisplayModel,
  buildWaterReaderLegend,
  buildWaterReaderProductionSvg,
  detectWaterReaderFeatures,
  placeWaterReaderZones,
  preprocessWaterReaderGeometry,
  waterReaderLegendForbiddenPhraseHits,
  type PointM,
  type RingM,
  type WaterReaderDetectedFeature,
  type WaterReaderDisplayModel,
  type WaterReaderLegendEntry,
  type WaterReaderPlacedZone,
  type WaterReaderPreprocessResult,
  type WaterReaderProductionSvgResult,
  type WaterReaderSeason,
  type WaterReaderZonePlacementResult,
} from '../lib/water-reader-engine';
import type {
  WaterbodyPolygonGeoJson,
  WaterbodyType,
  WaterReaderPolygonSupportStatus,
} from '../lib/waterReaderContracts';

const FULL_MATRIX_OUT_DIR = 'tmp/water-reader-50-lake-tuning/chunk-7k-full-matrix';
const BATCH_1_OUT_DIR = 'tmp/water-reader-50-lake-tuning/chunk-7l-batch-1-scorecard';
const REVIEW_READY_FULL_OUT_DIR = 'tmp/water-reader-50-lake-tuning/chunk-7m-review-ready-full-matrix';
let OUT_DIR = FULL_MATRIX_OUT_DIR;
let RUN_LABEL = 'Water Reader Chunk 7K 50-Lake Matrix';
const PRODUCTION_DIR = 'production-svg';
const APP_420_DIR = 'app-420-svg';
const DEBUG_DIR = 'debug-svg';
const ROW_JSON_DIR = 'row-json';
const FULL_RENDERER_MAP_WIDTH = 960;
const APP_RENDERER_MAP_WIDTH = 420;
const APP_VIEWBOX_HEIGHT_OUTLIER = 1400;
const SLOW_ROW_REVIEW_MS = 60_000;
const SVG_W = 960;
const HEADER_H = 92;
const PAD = 34;

const SEASONS = ['spring', 'summer', 'fall', 'winter'] as const satisfies readonly WaterReaderSeason[];
const BATCH_1_MANIFEST_INDEXES = [1, 2, 3, 4, 5, 8, 22, 34, 36, 42] as const;
const FEATURE_CLASSES = [
  'main_lake_point',
  'secondary_point',
  'cove',
  'neck',
  'saddle',
  'island',
  'dam',
  'universal',
] as const;

type RunBatch = 'full' | 'batch-1' | 'review-ready-full';
type ReviewPriority = 'critical' | 'high' | 'medium' | 'low';

type SeasonGroupLabel =
  | 'Deep South'
  | 'South'
  | 'Baseline'
  | 'North'
  | 'Mild Coastal / Desert';

type ManifestLake = {
  index: number;
  lake: string;
  state: string;
  county: string;
  seasonGroup: SeasonGroupLabel;
  lakeId: string;
  support: WaterReaderPolygonSupportStatus;
  primaryReason: string;
};

type PolygonRpcRow = {
  lake_id: string;
  name: string;
  state: string;
  county: string | null;
  waterbody_type: WaterbodyType | string;
  centroid_lat: number;
  centroid_lon: number;
  bbox_min_lon: number | null;
  bbox_min_lat: number | null;
  bbox_max_lon: number | null;
  bbox_max_lat: number | null;
  area_sq_m: number | null;
  area_acres: number | null;
  perimeter_m: number | null;
  geojson: unknown | null;
  geometry_is_valid: boolean;
  geometry_validity_detail: string | null;
  component_count: number;
  interior_ring_count: number;
  water_reader_support_status: WaterReaderPolygonSupportStatus;
  water_reader_support_reason: string;
  polygon_qa_flags: string[] | null;
};

type TimingPhase =
  | 'fetchMs'
  | 'preprocessMs'
  | 'featuresMs'
  | 'zonesMs'
  | 'legendMs'
  | 'displayMs'
  | 'renderMs'
  | 'writeMs';

type RowTimings = Record<TimingPhase, number> & {
  totalMs: number;
  slowestPhase: string;
  slowestPhaseMs: number;
};

type RowSignals = {
  fallbackNoMap: boolean;
  zeroDisplayedZones: boolean;
  selectedFeatureSuppression: boolean;
  semanticAnchorMismatch: boolean;
  labelSemanticRisk: boolean;
  fullSizeRendererWarnings: boolean;
  appWidthRendererWarnings: boolean;
  appWidthViewBoxHeightOutlier: boolean;
  retainedDisplayCapPressure: boolean;
  repeatedLegendTitlePressure: boolean;
  fullLegendTitleWrap: boolean;
  appLegendTitleWrap: boolean;
  fullLegendOverlapRisk: boolean;
  appLegendOverlapRisk: boolean;
  pointDominance: boolean;
  majorAxisRankingFallback: boolean;
  visualReviewNeeded: boolean;
};

type LegendLayoutEntryDiagnostic = {
  displayNumber: string;
  titleLineCount: number;
  bodyLineCount: number;
  warningLineCount: number;
  titleWrapped: boolean;
  overlapRisk: boolean;
  titleLastY: number | null;
  bodyFirstY: number | null;
  bodyLastY: number | null;
  warningFirstY: number | null;
};

type LegendLayoutSvgDiagnostics = {
  titleWrapCount: number;
  overlapRiskCount: number;
  entries: LegendLayoutEntryDiagnostic[];
};

type RowLegendLayoutDiagnostics = {
  rowId: string;
  lake: string;
  state: string;
  county: string;
  season: WaterReaderSeason;
  fullTitleWrapCount: number;
  appTitleWrapCount: number;
  fullOverlapRiskCount: number;
  appOverlapRiskCount: number;
  productionSvgFile: string;
  app420SvgFile: string;
  fullEntries: LegendLayoutEntryDiagnostic[];
  appEntries: LegendLayoutEntryDiagnostic[];
};

type PointDominanceDiagnostics = {
  score: number;
  reasons: string[];
};

type RowSummary = {
  rowId: string;
  manifestIndex: number;
  lake: string;
  state: string;
  county: string;
  season: WaterReaderSeason;
  reviewDate: string;
  seasonGroup: string;
  lakeId: string;
  manifestSupport: string;
  sourceSupportStatus: string;
  engineSupportStatus: string;
  supportStatus: string;
  fallbackNoMap: boolean;
  fallbackMessage: string;
  detectedFeatureCount: number;
  selectedFeatureCount: number;
  suppressedFeatureCount: number;
  detectedUnrepresentableFeatureCount: number;
  featureEnvelopeZoneCount: number;
  nonEnvelopeLegacyZoneCount: number;
  selectedFeatureWithoutEnvelopeZoneCount: number;
  featureEnvelopeSuppressionDiagnostics: Record<string, number>;
  featureEnvelopeSuppressionByFeatureClassReason: Record<string, number>;
  featureEnvelopeUnrepresentableDiagnostics: Record<string, number>;
  featureEnvelopeUnrepresentableByFeatureClassReason: Record<string, number>;
  wholeFeatureOutsideWaterCenterAcceptedCount: number;
  wholeFeatureOutsideWaterCenterAcceptedByFeatureClass: Record<string, number>;
  wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM: number | null;
  wholeFeatureOutsideWaterCenterMaxLocalityRadiusM: number | null;
  wholeFeatureOutsideWaterCenterMaxAnchorDistanceM: number | null;
  displayedEntryCount: number;
  retainedEntryCount: number;
  displayCap: number;
  displayCapPressure: boolean;
  repeatedLegendTitleMaxCount: number;
  repeatedLegendTitleMaxTitle: string;
  fullSizeRendererWarningCount: number;
  fullSizeRendererWarningCodes: string[];
  appWidthRendererWarningCount: number;
  appWidthRendererWarningCodes: string[];
  appWidthSvgViewBox: string;
  appWidthSvgHeight: number;
  fullTitleWrapCount: number;
  appTitleWrapCount: number;
  fullOverlapRiskCount: number;
  appOverlapRiskCount: number;
  qaFlags: string[];
  majorQaFlags: string[];
  selectedFeatureSuppressionCount: number;
  semanticAnchorMismatchCount: number;
  labelSemanticRiskCount: number;
  legendForbiddenHits: string[];
  pointDominanceScore: number;
  pointDominanceReasons: string[];
  reviewPriority: ReviewPriority;
  reviewPriorityReasons: string[];
  confluenceGroupCount: number;
  confluenceMemberZoneCount: number;
  renderedUnifiedConfluenceCount: number;
  stackedConfluenceMemberRenderCount: number;
  appWidthRenderedUnifiedConfluenceCount: number;
  appWidthStackedConfluenceMemberRenderCount: number;
  displayedFeatureClassCounts: Record<string, number>;
  retainedFeatureClassCounts: Record<string, number>;
  detectedFeatureClassCounts: Record<string, number>;
  retainedPlacementKindCounts: Record<string, number>;
  displayedPlacementKindCounts: Record<string, number>;
  displayedCount: number;
  retainedCount: number;
  majorAxisRankingFallbackCount: number;
  timing: RowTimings;
  productionSvgFile: string;
  app420SvgFile: string;
  debugSvgFile: string;
  jsonFile: string;
  signals: RowSignals;
};

type FeatureEnvelopeSeasonSignature = {
  rowId: string;
  lakeKey: string;
  lake: string;
  state: string;
  season: WaterReaderSeason;
  sourceFeatureId: string;
  placementKind: string;
  anchorXM: number;
  anchorYM: number;
  centerXM: number;
  centerYM: number;
  majorAxisM: number;
  minorAxisM: number;
  rotationRad: number;
  featureEnvelopeModelVersion: string;
};

type SvgTransform = {
  width: number;
  height: number;
  minX: number;
  maxY: number;
  scale: number;
  originX: number;
  originY: number;
};

const MANIFEST: ManifestLake[] = [
  { index: 1, lake: 'Van Norman Lake', state: 'MI', county: 'Oakland', seasonGroup: 'North', lakeId: '3113638f-9be6-4303-9011-62a9892a1ab9', support: 'supported', primaryReason: 'Required founder lake; small/simple polygon restraint' },
  { index: 2, lake: 'Pontiac Lake', state: 'MI', county: 'Oakland', seasonGroup: 'North', lakeId: '814e800f-ccc3-4312-8e0f-d33d09a9240f', support: 'supported', primaryReason: 'Required founder lake; medium everyday read' },
  { index: 3, lake: 'Mullett Lake', state: 'MI', county: 'Cheboygan', seasonGroup: 'North', lakeId: '98b38689-ec59-44d1-8ecf-c02e821e354a', support: 'supported', primaryReason: 'Large point-heavy cap/diversity pressure' },
  { index: 4, lake: 'Lake Charlevoix', state: 'MI', county: 'Charlevoix', seasonGroup: 'North', lakeId: 'e14bbfe9-1dce-43af-b43a-e502055e351f', support: 'supported', primaryReason: 'Complex large lake; cap/app-width pressure' },
  { index: 5, lake: 'Higgins Lake', state: 'MI', county: 'Roscommon', seasonGroup: 'North', lakeId: 'c0ccf70b-955f-4b11-84f7-804efce3708f', support: 'supported', primaryReason: 'Island and micro-endpoint semantics' },
  { index: 6, lake: 'Lake Minnetonka', state: 'MN', county: 'Hennepin', seasonGroup: 'North', lakeId: 'fb322d45-0a28-4216-b30d-61b71f391d6a', support: 'supported', primaryReason: 'Complex multi-basin natural lake' },
  { index: 7, lake: 'Mille Lacs Lake', state: 'MN', county: 'Mille Lacs', seasonGroup: 'North', lakeId: '8a300b88-6ba2-45a0-bdd1-a52cec3b7ac3', support: 'supported', primaryReason: 'Very large natural lake sizing/cap stress' },
  { index: 8, lake: 'Lake Winnebago', state: 'WI', county: 'Winnebago', seasonGroup: 'North', lakeId: '212e9b8c-809b-480b-999c-81419a09a3b4', support: 'supported', primaryReason: 'Very large simple-to-irregular natural lake' },
  { index: 9, lake: 'Lake George', state: 'NY', county: 'Warren', seasonGroup: 'North', lakeId: 'df211683-17a2-47b1-ad85-b32a5fc325ec', support: 'supported', primaryReason: 'Long/narrow large natural lake' },
  { index: 10, lake: 'Sebago Lake', state: 'ME', county: 'Cumberland', seasonGroup: 'North', lakeId: '288edecb-7f7e-4195-8777-cf9aa74d6cdc', support: 'supported', primaryReason: 'Large northeastern natural lake' },
  { index: 11, lake: 'Lake Tohopekaliga', state: 'FL', county: 'Osceola', seasonGroup: 'Deep South', lakeId: '641f0cdc-7fca-4790-a01f-8aeae8254986', support: 'supported', primaryReason: 'Florida cove/basin structure' },
  { index: 12, lake: 'Lake Kissimmee', state: 'FL', county: 'Osceola', seasonGroup: 'Deep South', lakeId: 'd3413ada-143d-4b61-aab8-9fc30505b3a6', support: 'supported', primaryReason: 'Large irregular shallow lake' },
  { index: 13, lake: 'Lake Istokpoga', state: 'FL', county: 'Highlands', seasonGroup: 'Deep South', lakeId: '72af3bff-c12c-48cd-996b-76288fe53080', support: 'supported', primaryReason: 'Large shallow natural lake' },
  { index: 14, lake: 'Lake Talquin', state: 'FL', county: 'Gadsden', seasonGroup: 'Deep South', lakeId: 'a77ae418-4b9d-4f7c-b74d-a601dc1e539b', support: 'supported', primaryReason: 'Reservoir/cove complexity' },
  { index: 15, lake: 'Lake Rousseau', state: 'FL', county: 'Levy', seasonGroup: 'Deep South', lakeId: '4e823a32-d278-4bc2-a3db-70b6d53458b6', support: 'supported', primaryReason: 'Complex reservoir/irregular shoreline' },
  { index: 16, lake: 'Lake Maurepas', state: 'LA', county: 'Livingston', seasonGroup: 'Deep South', lakeId: 'c68fdf5e-8fb2-4466-a998-5b134b59c105', support: 'supported', primaryReason: 'Large simpler shallow lake' },
  { index: 17, lake: 'Lake Verret', state: 'LA', county: 'Assumption', seasonGroup: 'Deep South', lakeId: '4fb36a84-d2cc-4261-b140-495478519c06', support: 'supported', primaryReason: 'Shallow irregular Louisiana lake' },
  { index: 18, lake: 'Lac des Allemands', state: 'LA', county: 'St. John the Baptist', seasonGroup: 'Deep South', lakeId: '9169063d-a7f0-4043-8c03-5383007987b1', support: 'supported', primaryReason: 'Shallow irregular Louisiana lake' },
  { index: 19, lake: 'Caddo Lake', state: 'LA', county: 'Caddo', seasonGroup: 'Deep South', lakeId: 'd574e525-7d25-412c-95c3-21b000c0560c', support: 'supported', primaryReason: 'Complex cypress/irregular shoreline' },
  { index: 20, lake: 'Lake Tawakoni', state: 'TX', county: 'Hunt', seasonGroup: 'South', lakeId: 'b4487974-cd9c-4b07-bc7e-e7248a095b27', support: 'supported', primaryReason: 'Large Texas reservoir' },
  { index: 21, lake: 'Cedar Creek Reservoir', state: 'TX', county: 'Henderson', seasonGroup: 'South', lakeId: '9e9dda53-375b-46d9-8f62-91b8a6322ce1', support: 'supported', primaryReason: 'Large cove-arm reservoir' },
  { index: 22, lake: 'Lake Palestine', state: 'TX', county: 'Henderson', seasonGroup: 'South', lakeId: 'b46694af-0c72-4c97-b600-866c8effd1ee', support: 'supported', primaryReason: 'Large cove-arm reservoir' },
  { index: 23, lake: 'Broken Bow Lake', state: 'OK', county: 'McCurtain', seasonGroup: 'South', lakeId: '2d8a59eb-04c0-4c50-84ea-273b6149ebfa', support: 'supported', primaryReason: 'Complex reservoir arms' },
  { index: 24, lake: 'Lake Greeson', state: 'AR', county: 'Pike', seasonGroup: 'South', lakeId: 'c047d979-33e2-4286-b0bc-3a00c5700815', support: 'supported', primaryReason: 'Arm-heavy reservoir' },
  { index: 25, lake: 'De Gray Lake', state: 'AR', county: 'Clark', seasonGroup: 'South', lakeId: '41ff665e-bea3-4bf6-9f4c-fbe808ae8a54', support: 'supported', primaryReason: 'Reservoir with islands/arms' },
  { index: 26, lake: 'Pickwick Lake', state: 'AL', county: 'Lauderdale', seasonGroup: 'South', lakeId: '72602285-5d76-43ac-a5f4-63d3988f3a15', support: 'supported', primaryReason: 'River-reservoir geometry' },
  { index: 27, lake: 'Hartwell Lake', state: 'GA', county: 'Hart', seasonGroup: 'South', lakeId: 'a2cf89f8-8a22-4aee-87b6-0ae2e8bd76c0', support: 'supported', primaryReason: 'Large cove-arm reservoir' },
  { index: 28, lake: 'Elephant Butte Reservoir', state: 'NM', county: 'Sierra', seasonGroup: 'South', lakeId: '04f4caa6-fbed-4954-849c-1e8763f97a2b', support: 'supported', primaryReason: 'Desert reservoir shape' },
  { index: 29, lake: 'Taylorsville Lake', state: 'KY', county: 'Spencer', seasonGroup: 'Baseline', lakeId: '95b2233b-c337-4b08-8c1c-7e0230662654', support: 'supported', primaryReason: 'Medium reservoir, branch/cove geometry' },
  { index: 30, lake: 'Grayson Lake', state: 'KY', county: 'Elliott', seasonGroup: 'Baseline', lakeId: 'd71eddd0-0dee-4a94-951c-c400ea6e3f2b', support: 'supported', primaryReason: 'Narrow reservoir arms' },
  { index: 31, lake: 'Stockton Lake', state: 'MO', county: 'Dade', seasonGroup: 'Baseline', lakeId: '6690c6ea-6e66-4717-abca-f59b4f4c2c54', support: 'supported', primaryReason: 'Large Ozark reservoir' },
  { index: 32, lake: 'Raystown Lake', state: 'PA', county: 'Huntingdon', seasonGroup: 'Baseline', lakeId: 'ba0ebd07-8df8-40bb-ba18-4f49be601db9', support: 'supported', primaryReason: 'Long/narrow reservoir' },
  { index: 33, lake: 'Lake Wallenpaupack', state: 'PA', county: 'Pike', seasonGroup: 'Baseline', lakeId: '8eee3aed-9855-4e6f-a8f5-959e07fd71e0', support: 'supported', primaryReason: 'Medium complex lake' },
  { index: 34, lake: 'Brookville Lake', state: 'IN', county: 'Union', seasonGroup: 'Baseline', lakeId: '283aed24-af65-47fd-9c71-d554d1b0713d', support: 'supported', primaryReason: 'Medium reservoir' },
  { index: 35, lake: 'Monroe Lake', state: 'IN', county: 'Monroe', seasonGroup: 'Baseline', lakeId: '530eb67b-7a34-41a9-8b86-156eacdc5e9e', support: 'supported', primaryReason: 'Large Midwestern reservoir' },
  { index: 36, lake: 'Lake Wylie', state: 'NC', county: 'Mecklenburg', seasonGroup: 'Baseline', lakeId: '2f10ec7b-b310-441c-a2a8-df722cb17fa1', support: 'supported', primaryReason: 'Cove-arm reservoir' },
  { index: 37, lake: 'Fontana Lake', state: 'NC', county: 'Swain', seasonGroup: 'Baseline', lakeId: '7ceadc56-f586-4b2d-a062-c20677f91d19', support: 'supported', primaryReason: 'Mountain reservoir with arms' },
  { index: 38, lake: 'Lake Pleasant', state: 'AZ', county: 'Yavapai', seasonGroup: 'Mild Coastal / Desert', lakeId: '8d383bc7-cdcf-4602-ab19-b38ee1c2cc1e', support: 'supported', primaryReason: 'Desert reservoir' },
  { index: 39, lake: 'Theodore Roosevelt Lake', state: 'AZ', county: 'Gila', seasonGroup: 'Mild Coastal / Desert', lakeId: '15476c36-34af-4b9e-aeed-6a5521c95b74', support: 'supported', primaryReason: 'Large Arizona reservoir' },
  { index: 40, lake: 'Pyramid Lake', state: 'NV', county: 'Washoe', seasonGroup: 'Mild Coastal / Desert', lakeId: 'e75f1261-cc2f-4cf9-8376-fd19770d260d', support: 'supported', primaryReason: 'Very large simple natural lake' },
  { index: 41, lake: 'Clear Lake', state: 'CA', county: 'Lake', seasonGroup: 'Mild Coastal / Desert', lakeId: '5c16315d-6a46-4381-9440-8c9f896ffdf2', support: 'supported', primaryReason: 'Large natural lake' },
  { index: 42, lake: 'Lake Tahoe', state: 'CA', county: 'Placer', seasonGroup: 'Mild Coastal / Desert', lakeId: '4da222d6-e151-4c48-aafa-0c10ca01147d', support: 'supported', primaryReason: 'Very large deep natural lake; sizing stress' },
  { index: 43, lake: 'Lake Chelan', state: 'WA', county: 'Chelan', seasonGroup: 'Mild Coastal / Desert', lakeId: 'f648f3c1-8793-4dd3-ac7e-beba7bd4993d', support: 'supported', primaryReason: 'Long/narrow large lake' },
  { index: 44, lake: 'Lake Billy Chinook', state: 'OR', county: 'Jefferson', seasonGroup: 'Mild Coastal / Desert', lakeId: '075855f7-1f48-4832-946a-c5e5fdecdcc2', support: 'supported', primaryReason: 'Canyon reservoir geometry' },
  { index: 45, lake: 'Lake Washington', state: 'WA', county: 'King', seasonGroup: 'Mild Coastal / Desert', lakeId: '4e674246-f812-4342-a8ea-b3d8772f05be', support: 'supported', primaryReason: 'Large urban natural lake' },
  { index: 46, lake: 'Lake Apopka', state: 'FL', county: 'Orange', seasonGroup: 'Deep South', lakeId: '1b3d4c1f-2781-4651-be56-7766a359c8f5', support: 'supported', primaryReason: 'Extreme large shallow-lake stress case' },
  { index: 47, lake: 'Lake Conroe', state: 'TX', county: 'Montgomery', seasonGroup: 'South', lakeId: '0487f426-5d98-4701-8366-ef495b54d666', support: 'supported', primaryReason: 'Large Texas reservoir replacement' },
  { index: 48, lake: 'Mark Twain Lake', state: 'MO', county: 'Monroe', seasonGroup: 'Baseline', lakeId: '078a0ed5-37ee-4a4e-acde-3120dd3a6530', support: 'supported', primaryReason: 'Complex large reservoir' },
  { index: 49, lake: 'Lake Berryessa', state: 'CA', county: 'Napa', seasonGroup: 'Mild Coastal / Desert', lakeId: '6e926925-4349-4fcd-ad83-764fd75722eb', support: 'supported', primaryReason: 'Desert reservoir; CA index row' },
  { index: 50, lake: 'Don Pedro Reservoir', state: 'CA', county: 'Tuolumne', seasonGroup: 'Mild Coastal / Desert', lakeId: '50a50308-8a30-46bf-b48a-1cf694b574e8', support: 'supported', primaryReason: 'Complex large reservoir' },
];

const STABLE_DATES: Record<SeasonGroupLabel, Record<WaterReaderSeason, string>> = {
  'Deep South': { spring: '2026-02-15', summer: '2026-06-15', fall: '2026-10-31', winter: '2026-12-20' },
  South: { spring: '2026-04-01', summer: '2026-07-15', fall: '2026-10-15', winter: '2026-01-15' },
  Baseline: { spring: '2026-04-15', summer: '2026-07-15', fall: '2026-10-15', winter: '2026-01-15' },
  North: { spring: '2026-05-15', summer: '2026-08-01', fall: '2026-10-15', winter: '2026-01-15' },
  'Mild Coastal / Desert': { spring: '2026-04-01', summer: '2026-07-15', fall: '2026-10-15', winter: '2026-12-28' },
};

function loadDotEnvIfPresent() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let value = t.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function requireSupabaseEnv(): { url: string; key: string } {
  const url = (process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '').trim().replace(/\/$/, '');
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const missing = [
    url ? null : 'SUPABASE_URL or EXPO_PUBLIC_SUPABASE_URL',
    key ? null : 'SUPABASE_SERVICE_ROLE_KEY',
  ].filter(Boolean);
  if (missing.length > 0) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  return { url, key };
}

function assertManifest() {
  if (MANIFEST.length !== 50) throw new Error(`Manifest must contain exactly 50 lakes; found ${MANIFEST.length}`);
  const ids = new Set(MANIFEST.map((lake) => lake.lakeId));
  if (ids.size !== MANIFEST.length) throw new Error('Manifest contains duplicate lake IDs.');
  const excluded = new Set([
    'Lake Okeechobee',
    'Eufaula Lake',
    'Harry S Truman Reservoir',
    'Lake Havasu',
    'Shasta Lake',
  ]);
  const bad = MANIFEST.filter((lake) => excluded.has(lake.lake));
  if (bad.length > 0) throw new Error(`Excluded seed rows present in manifest: ${bad.map((lake) => lake.lake).join(', ')}`);
}

function parseBatchValue(value: string): RunBatch {
  if (value === 'batch-1' || value === 'full' || value === 'review-ready-full') return value;
  throw new Error(`Unsupported batch option "${value}". Use --batch=batch-1, --batch=review-ready-full, or omit it for the full matrix.`);
}

function parseCliOptions(argv = process.argv.slice(2)): { batch: RunBatch } {
  let batch: RunBatch = 'full';
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg.startsWith('--batch=')) {
      batch = parseBatchValue(arg.slice('--batch='.length));
    } else if (arg === '--batch') {
      const value = argv[i + 1];
      if (!value) throw new Error('Missing value after --batch.');
      batch = parseBatchValue(value);
      i++;
    } else {
      throw new Error(`Unknown argument "${arg}".`);
    }
  }
  return { batch };
}

function manifestForBatch(batch: RunBatch): ManifestLake[] {
  if (batch === 'full' || batch === 'review-ready-full') return MANIFEST;
  const wanted = new Set<number>(BATCH_1_MANIFEST_INDEXES);
  const selected = MANIFEST.filter((lake) => wanted.has(lake.index));
  const found = new Set(selected.map((lake) => lake.index));
  const missing = BATCH_1_MANIFEST_INDEXES.filter((index) => !found.has(index));
  if (missing.length > 0) throw new Error(`Batch 1 manifest indexes missing from verified manifest: ${missing.join(', ')}`);
  return selected;
}

function outputRootForBatch(batch: RunBatch): string {
  if (batch === 'batch-1') return BATCH_1_OUT_DIR;
  if (batch === 'review-ready-full') return REVIEW_READY_FULL_OUT_DIR;
  return FULL_MATRIX_OUT_DIR;
}

function labelForBatch(batch: RunBatch): string {
  if (batch === 'batch-1') return 'Water Reader Chunk 7L Batch 1 Scorecard';
  if (batch === 'review-ready-full') return 'Water Reader Chunk 7M Review-Ready Full Matrix';
  return 'Water Reader Chunk 7K 50-Lake Matrix';
}

type ReviewBatchGroup = {
  batchNumber: number;
  label: string;
  indexes: number[];
  dir: string;
};

function reviewBatchGroups(rootDir: string): ReviewBatchGroup[] {
  const batch1 = [...BATCH_1_MANIFEST_INDEXES];
  const batch1Set = new Set<number>(batch1);
  const remaining = MANIFEST
    .map((lake) => lake.index)
    .filter((index) => !batch1Set.has(index))
    .sort((a, b) => a - b);
  const groups = [
    batch1,
    ...[0, 10, 20, 30].map((start) => remaining.slice(start, start + 10)),
  ];
  if (groups.length !== 5 || groups.some((group) => group.length !== 10)) {
    throw new Error(`Review-ready batches must contain five groups of 10 manifest indexes: ${JSON.stringify(groups)}`);
  }
  const seen = new Set<number>();
  for (const group of groups) {
    for (const index of group) {
      if (seen.has(index)) throw new Error(`Duplicate review batch manifest index ${index}`);
      seen.add(index);
    }
  }
  if (seen.size !== 50) throw new Error(`Review batches must cover 50 unique manifest indexes; found ${seen.size}`);
  return groups.map((indexes, index) => ({
    batchNumber: index + 1,
    label: `Batch ${index + 1}`,
    indexes,
    dir: join(rootDir, 'batches', `batch-${index + 1}`),
  }));
}

async function fetchPolygonByLakeId(
  supabase: SupabaseClient,
  lake: ManifestLake,
): Promise<PolygonRpcRow> {
  const { data, error } = await supabase.rpc('get_waterbody_polygon_for_reader', {
    in_lake_id: lake.lakeId,
  });
  if (error) throw new Error(`get_waterbody_polygon_for_reader failed for ${lake.lake} (${lake.lakeId}): ${error.message}`);
  const rows = Array.isArray(data) ? data as PolygonRpcRow[] : data ? [data as PolygonRpcRow] : [];
  const row = rows[0];
  if (!row) throw new Error(`No polygon row found for ${lake.lake} (${lake.lakeId})`);
  return row;
}

function dateFor(lake: ManifestLake, season: WaterReaderSeason): Date {
  const ymd = STABLE_DATES[lake.seasonGroup][season];
  return new Date(`${ymd}T12:00:00.000Z`);
}

function createRowTimings(): RowTimings {
  return {
    fetchMs: 0,
    preprocessMs: 0,
    featuresMs: 0,
    zonesMs: 0,
    legendMs: 0,
    displayMs: 0,
    renderMs: 0,
    writeMs: 0,
    totalMs: 0,
    slowestPhase: '',
    slowestPhaseMs: 0,
  };
}

function timed<T>(timing: RowTimings, phase: TimingPhase, fn: () => T): T {
  const start = performance.now();
  try {
    return fn();
  } finally {
    timing[phase] += performance.now() - start;
  }
}

async function timedAsync<T>(timing: RowTimings, phase: TimingPhase, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    timing[phase] += performance.now() - start;
  }
}

function finalizeTimings(timing: RowTimings, rowStart: number): RowTimings {
  timing.totalMs = performance.now() - rowStart;
  const phaseEntries = ([
    'fetchMs',
    'preprocessMs',
    'featuresMs',
    'zonesMs',
    'legendMs',
    'displayMs',
    'renderMs',
    'writeMs',
  ] as const).map((phase) => [phase, timing[phase]] as const);
  const [slowestPhase, slowestPhaseMs] = phaseEntries.reduce((best, item) => item[1] > best[1] ? item : best);
  timing.slowestPhase = slowestPhase.replace(/Ms$/, '');
  timing.slowestPhaseMs = slowestPhaseMs;
  for (const key of [...phaseEntries.map(([phase]) => phase), 'totalMs', 'slowestPhaseMs'] as const) {
    timing[key] = Math.round(timing[key] * 10) / 10;
  }
  return timing;
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

function rowIdFor(lake: ManifestLake, season: WaterReaderSeason): string {
  return `${String(lake.index).padStart(2, '0')}-${slugFilePart(`${lake.lake}-${lake.state}`)}-${season}`;
}

function escapeXmlText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeHtml(s: string): string {
  return escapeXmlText(s).replace(/'/g, '&#39;');
}

function csvCell(value: unknown): string {
  const s = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function countValues(values: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}

function featureClassCounts(features: WaterReaderDetectedFeature[]): Record<string, number> {
  return countValues(features.map((feature) => feature.featureClass));
}

function zoneCounts(zones: WaterReaderPlacedZone[]): Record<string, number> {
  return countValues(zones.map((zone) => zone.featureClass));
}

function zoneQaFlagCount(zones: WaterReaderPlacedZone[], flag: string): number {
  return zones.filter((zone) => zone.qaFlags.includes(flag)).length;
}

function recoveredFallbackCount(zones: WaterReaderPlacedZone[]): number {
  return zones.filter((zone) => zone.diagnostics.fallbackPlacementUsed === true).length;
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

function semanticIdsForDisplayedZones(
  displayModel: WaterReaderDisplayModel,
  key: 'placementSemanticId' | 'anchorSemanticId',
): string[] {
  return [...new Set(displayModel.displayedEntries.flatMap((entry) =>
    entry.zones.map((zone) => zone[key]).filter((value): value is string => Boolean(value)),
  ))].sort((a, b) => a.localeCompare(b));
}

function fallbackAnchorSemanticIds(displayModel: WaterReaderDisplayModel): string[] {
  return [...new Set(displayModel.displayedEntries.flatMap((entry) =>
    entry.zones
      .filter((zone) => zone.diagnostics.fallbackPlacementUsed === true)
      .map((zone) => zone.anchorSemanticId)
      .filter((value): value is string => Boolean(value)),
  ))].sort((a, b) => a.localeCompare(b));
}

function semanticAnchorMismatchCount(displayModel: WaterReaderDisplayModel): number {
  return displayModel.displayedEntries.flatMap((entry) => entry.zones).filter((zone) => (
    zone.diagnostics.fallbackPlacementUsed === true &&
    Boolean(zone.placementSemanticId) &&
    Boolean(zone.anchorSemanticId) &&
    zone.placementSemanticId !== zone.anchorSemanticId
  )).length;
}

function labelSemanticRiskCount(displayModel: WaterReaderDisplayModel): number {
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

function rankingFallbackCount(displayModel: WaterReaderDisplayModel): number {
  return displayModel.displaySelectionUnits.filter((unit) =>
    unit.rankingDiagnostics.includes('ranking_metric:major_axis_fallback_todo_feature_metric'),
  ).length;
}

function rendererCodes(result: WaterReaderProductionSvgResult | null): string[] {
  return result?.warnings.map((warning) => warning.code) ?? [];
}

function legendLayoutDiagnostics(svg: string): LegendLayoutSvgDiagnostics {
  const entries: LegendLayoutEntryDiagnostic[] = [];
  const entryRegex = /<g class="water-reader-display-legend-entry"[^>]*data-display-number="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g;
  for (const match of svg.matchAll(entryRegex)) {
    const displayNumber = match[1] ?? '';
    const inner = match[2] ?? '';
    const titleYs: number[] = [];
    const bodyYs: number[] = [];
    const warningYs: number[] = [];
    for (const textMatch of inner.matchAll(/<text\b([^>]*)>[\s\S]*?<\/text>/g)) {
      const attrs = textMatch[1] ?? '';
      const y = numericAttr(attrs, 'y');
      if (y === null) continue;
      if (attrs.includes('font-weight="800"')) {
        titleYs.push(y);
      } else if (attrs.includes('font-size="10.5"') && attrs.includes('fill="#475569"')) {
        bodyYs.push(y);
      } else if (attrs.includes('fill="#8A4B00"')) {
        warningYs.push(y);
      }
    }
    const titleLastY = titleYs.length > 0 ? Math.max(...titleYs) : null;
    const bodyFirstY = bodyYs.length > 0 ? Math.min(...bodyYs) : null;
    const bodyLastY = bodyYs.length > 0 ? Math.max(...bodyYs) : null;
    const warningFirstY = warningYs.length > 0 ? Math.min(...warningYs) : null;
    const titleBodyRisk = titleLastY !== null && bodyFirstY !== null && bodyFirstY < titleLastY + 14;
    const bodyWarningRisk = bodyLastY !== null && warningFirstY !== null && warningFirstY < bodyLastY + 13;
    entries.push({
      displayNumber,
      titleLineCount: titleYs.length,
      bodyLineCount: bodyYs.length,
      warningLineCount: warningYs.length,
      titleWrapped: titleYs.length > 1,
      overlapRisk: titleBodyRisk || bodyWarningRisk,
      titleLastY,
      bodyFirstY,
      bodyLastY,
      warningFirstY,
    });
  }
  return {
    titleWrapCount: entries.filter((entry) => entry.titleWrapped).length,
    overlapRiskCount: entries.filter((entry) => entry.overlapRisk).length,
    entries,
  };
}

function numericAttr(attrs: string, name: string): number | null {
  const match = attrs.match(new RegExp(`${name}="([^"]+)"`));
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function pointDominanceDiagnostics(params: {
  displayedFeatureClassCounts: Record<string, number>;
  retainedFeatureClassCounts: Record<string, number>;
  displayedEntries: Array<{ featureClasses: string[]; legend?: WaterReaderLegendEntry }>;
  displayedCount: number;
}): PointDominanceDiagnostics {
  const reasons: string[] = [];
  let score = 0;
  const pointCount = params.displayedFeatureClassCounts.main_lake_point ?? 0;
  const retainedNonPointCount = Object.entries(params.retainedFeatureClassCounts)
    .filter(([featureClass]) => featureClass !== 'main_lake_point')
    .reduce((sum, [, count]) => sum + count, 0);
  const mainPointTitleCounts = countValues(params.displayedEntries
    .filter((entry) => entry.featureClasses.includes('main_lake_point'))
    .map((entry) => entry.legend?.title ?? '')
    .filter(Boolean));
  const repeatedMainPointTitleMax = Math.max(0, ...Object.values(mainPointTitleCounts));

  if (pointCount >= 4) {
    score += 3;
    reasons.push('displayed_main_lake_point_ge_4');
  }
  if (params.displayedCount >= 5 && pointCount / params.displayedCount >= 0.5) {
    score += 2;
    reasons.push('main_lake_point_half_or_more');
  }
  if (repeatedMainPointTitleMax >= 3) {
    score += 1;
    reasons.push('repeated_main_lake_point_titles_ge_3');
  }
  if (pointCount >= 3 && retainedNonPointCount > 0) {
    score += 1;
    reasons.push('non_point_retained_while_points_displayed');
  }
  if (params.displayedCount >= 3 && pointCount === params.displayedCount) {
    score += 2;
    reasons.push('all_displayed_entries_main_lake_point');
  }
  return { score, reasons };
}

function reviewPriorityDiagnostics(params: {
  fallbackNoMap: boolean;
  displayedCount: number;
  retainedCount: number;
  fullRendererWarningCount: number;
  appRendererWarningCount: number;
  appHeightOutlier: boolean;
  fullTitleWrapCount: number;
  appTitleWrapCount: number;
  fullOverlapRiskCount: number;
  appOverlapRiskCount: number;
  repeatedLegendTitleMaxCount: number;
  displayedFeatureClassCounts: Record<string, number>;
  semanticAnchorMismatchCount: number;
  labelSemanticRiskCount: number;
  selectedFeatureSuppressionCount: number;
  majorAxisRankingFallbackCount: number;
  forbiddenCopyHits: string[];
}): { priority: ReviewPriority; reasons: string[] } {
  const critical: string[] = [];
  if (params.fallbackNoMap) critical.push('fallback_no_map');
  if (params.displayedCount === 0) critical.push('zero_displayed_zones');
  if (params.fullOverlapRiskCount > 0) critical.push('full_legend_overlap_risk');
  if (params.appOverlapRiskCount > 0) critical.push('app_legend_overlap_risk');
  if (params.labelSemanticRiskCount > 0) critical.push('label_semantic_risk');
  if (params.forbiddenCopyHits.length > 0) critical.push('forbidden_copy_hit');
  if (critical.length > 0) return { priority: 'critical', reasons: critical };

  const high: string[] = [];
  const displayedPointCount = params.displayedFeatureClassCounts.main_lake_point ?? 0;
  if (params.appHeightOutlier) high.push('app_height_outlier');
  if (params.repeatedLegendTitleMaxCount >= 4) high.push('repeated_legend_title_ge_4');
  if (displayedPointCount >= 4) high.push('displayed_main_lake_point_ge_4');
  if (params.displayedCount >= 5 && displayedPointCount / params.displayedCount >= 0.5) high.push('main_lake_point_half_or_more');
  if (params.retainedCount >= 4) high.push('retained_count_ge_4');
  if (params.semanticAnchorMismatchCount >= 2) high.push('semantic_anchor_mismatch_ge_2');
  if (params.appRendererWarningCount > 0 && params.displayedCount >= 7) high.push('app_renderer_warning_displayed_ge_7');
  if (params.selectedFeatureSuppressionCount > 0) high.push('selected_feature_suppression');
  if (high.length > 0) return { priority: 'high', reasons: high };

  const medium: string[] = [];
  const titleWrapWithoutOverlap = (
    params.fullTitleWrapCount + params.appTitleWrapCount > 0 &&
    params.fullOverlapRiskCount === 0 &&
    params.appOverlapRiskCount === 0
  );
  if (params.appRendererWarningCount > 0) medium.push('app_renderer_warning');
  if (params.fullRendererWarningCount > 0) medium.push('full_renderer_warning');
  if (titleWrapWithoutOverlap) medium.push('legend_title_wrap');
  if (params.retainedCount > 0) medium.push('retained_count_gt_0');
  if (params.semanticAnchorMismatchCount === 1) medium.push('semantic_anchor_mismatch_eq_1');
  if (params.majorAxisRankingFallbackCount > 0) medium.push('major_axis_ranking_fallback');
  if (medium.length > 0) return { priority: 'medium', reasons: medium };

  return { priority: 'low', reasons: [] };
}

function hasActionableVisualReviewReason(reasons: string[]): boolean {
  return reasons.some((reason) => reason !== 'major_axis_ranking_fallback');
}

function fallbackMessage(params: {
  polygon: PolygonRpcRow;
  preprocess: WaterReaderPreprocessResult;
  displayModel: WaterReaderDisplayModel;
}): string {
  if (!params.polygon.geojson) return 'No polygon geometry was returned for this manifest lake ID.';
  if (!params.polygon.geometry_is_valid) return params.polygon.geometry_validity_detail || 'Polygon geometry is invalid.';
  if (params.polygon.water_reader_support_status === 'not_supported') {
    return params.polygon.water_reader_support_reason || 'Source polygon is not supported.';
  }
  if (params.preprocess.supportStatus === 'not_supported') {
    return params.preprocess.supportReason || 'Engine preprocessing marked this polygon not supported.';
  }
  if (!params.preprocess.primaryPolygon || !params.preprocess.metrics) {
    return 'Projected lake-space geometry is unavailable.';
  }
  return '';
}

function appSvgHeight(result: WaterReaderProductionSvgResult | null): number {
  return result?.summary.height ?? 0;
}

function majorQaFlags(params: {
  preprocess: WaterReaderPreprocessResult;
  zoneResult: WaterReaderZonePlacementResult;
  legendForbiddenHits: string[];
  productionSvgResult: WaterReaderProductionSvgResult | null;
  appWidthProductionSvgResult: WaterReaderProductionSvgResult | null;
  displayModel: WaterReaderDisplayModel;
  appHeight: number;
  fullLegendLayout: LegendLayoutSvgDiagnostics;
  appLegendLayout: LegendLayoutSvgDiagnostics;
  pointDominance: boolean;
}): string[] {
  const flags = new Set<string>();
  for (const flag of [...params.preprocess.qaFlags, ...params.zoneResult.qaFlags]) flags.add(flag);
  if (params.legendForbiddenHits.length > 0) flags.add('legend_forbidden_copy_hit');
  if ((params.productionSvgResult?.summary.warningCount ?? 0) > 0) flags.add('full_size_renderer_warning');
  if ((params.appWidthProductionSvgResult?.summary.warningCount ?? 0) > 0) flags.add('app_width_renderer_warning');
  if (params.appHeight > APP_VIEWBOX_HEIGHT_OUTLIER) flags.add('app_width_viewbox_height_outlier');
  if (params.displayModel.retainedEntries.some((entry) => !entry.rankingDiagnostics.includes('retained_constriction_line_readability'))) {
    flags.add('retained_not_displayed_cap_pressure');
  }
  if (params.displayModel.retainedEntries.some((entry) => entry.rankingDiagnostics.includes('retained_constriction_line_readability'))) {
    flags.add('retained_not_displayed_readability');
  }
  if (rankingFallbackCount(params.displayModel) > 0) flags.add('major_axis_ranking_fallback');
  if (params.zoneResult.diagnostics.suppressedFeatureCount > 0) flags.add('selected_feature_suppression');
  if (params.fullLegendLayout.overlapRiskCount > 0) flags.add('full_legend_overlap_risk');
  if (params.appLegendLayout.overlapRiskCount > 0) flags.add('app_legend_overlap_risk');
  if (params.pointDominance) flags.add('point_dominance_display_pressure');
  return [...flags].sort((a, b) => a.localeCompare(b));
}

function bboxForPreprocess(preprocess: WaterReaderPreprocessResult, zones: WaterReaderPlacedZone[] = []): SvgTransform | null {
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

function displayNumberByZone(displayModel: WaterReaderDisplayModel): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of displayModel.displayedEntries) {
    for (const zoneId of entry.zoneIds) map.set(zoneId, entry.displayNumber ? String(entry.displayNumber) : '');
  }
  let retainedIndex = 1;
  for (const entry of displayModel.retainedEntries) {
    for (const zoneId of entry.zoneIds) map.set(zoneId, `R${retainedIndex}`);
    retainedIndex++;
  }
  return map;
}

function zoneLayer(zones: WaterReaderPlacedZone[], displayModel: WaterReaderDisplayModel, t: SvgTransform): string {
  const numbers = displayNumberByZone(displayModel);
  let out = '';
  zones.forEach((zone, index) => {
    const color = zoneColor(zone.featureClass);
    const num = numbers.get(zone.zoneId) || String(index + 1);
    out += `<path d="${pathD(zone.unclippedRing, t, true)}" fill="${color}" fill-opacity="0.07" stroke="${color}" stroke-opacity="0.22" stroke-width="1" stroke-dasharray="4 4" />`;
    for (const segment of visibleSegments(zone)) {
      if (segment.length >= 2) {
        out += `<path d="${pathD(segment, t, false)}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />`;
      }
    }
    out += circle(zone.anchor, t, 3.5, color, '#ffffff', 0.9);
    out += circle(zone.ovalCenter, t, 2.4, '#111827', '#ffffff', 0.9);
    out += label(num, zone.ovalCenter, t, -4, 4, 12);
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

function buildDebugSvg(params: {
  lake: ManifestLake;
  polygon: PolygonRpcRow;
  preprocess: WaterReaderPreprocessResult;
  features: WaterReaderDetectedFeature[];
  zoneResult: WaterReaderZonePlacementResult;
  displayModel: WaterReaderDisplayModel;
  season: WaterReaderSeason;
}): string {
  const t = bboxForPreprocess(params.preprocess, params.zoneResult.zones);
  if (!t) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_W}" height="420" viewBox="0 0 ${SVG_W} 420">
  <rect width="100%" height="100%" fill="#f8fafc"/>
  <text x="18" y="28" font-size="17" font-family="system-ui,Segoe UI,sans-serif" font-weight="800" fill="#0f172a">${escapeXmlText(params.lake.lake)} ${params.season}</text>
  <text x="18" y="54" font-size="12" font-family="system-ui,Segoe UI,sans-serif" fill="#334155">Debug SVG unavailable: projected bbox missing.</text>
</svg>
`;
  }
  const lakeD = lakePathD(params.preprocess, t);
  const lineText = `features:${params.zoneResult.diagnostics.detectedFeatureCount} selected:${params.zoneResult.diagnostics.selectedFeatureCount} suppressed:${params.zoneResult.diagnostics.suppressedFeatureCount} zones:${params.zoneResult.zones.length} displayed:${params.displayModel.displayedEntries.length} retained:${params.displayModel.retainedEntries.length}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${t.width}" height="${t.height}" viewBox="0 0 ${t.width} ${t.height}">
  <rect width="100%" height="100%" fill="#f8fafc"/>
  <text x="18" y="24" font-size="17" font-family="system-ui,Segoe UI,sans-serif" font-weight="800" fill="#0f172a">${escapeXmlText(params.polygon.name ?? params.lake.lake)}</text>
  <text x="18" y="46" font-size="12" font-family="system-ui,Segoe UI,sans-serif" fill="#334155">${escapeXmlText(`${params.lake.state}/${params.lake.county} | ${params.season} | ${params.preprocess.supportStatus} | ${lineText}`)}</text>
  <text x="18" y="68" font-size="11" font-family="system-ui,Segoe UI,sans-serif" fill="#64748b">${escapeXmlText('Debug only: faint cues show detected feature attributes; dashed ovals are unclipped; thick arcs show visible sampled zone portions; R labels are retained entries.')}</text>
  <path d="${lakeD}" fill="#c5ddf0" fill-rule="evenodd" stroke="#2a5f87" stroke-width="1.3"/>
  ${featureAnchorLayer(params.features, t)}
  ${zoneLayer(params.zoneResult.zones, params.displayModel, t)}
  ${confluenceLayer(params.zoneResult.zones, t)}
</svg>
`;
}

function zoneDebug(zone: WaterReaderPlacedZone, longestDimensionM?: number) {
  return {
    zoneId: zone.zoneId,
    sourceFeatureId: zone.sourceFeatureId,
    featureClass: zone.featureClass,
    placementKind: zone.placementKind,
    placementSemanticId: zone.placementSemanticId ?? null,
    anchorSemanticId: zone.anchorSemanticId ?? null,
    confluenceGroupId: typeof zone.diagnostics.structureConfluenceGroupId === 'string' ? zone.diagnostics.structureConfluenceGroupId : null,
    confluenceStrength: zone.diagnostics.structureConfluenceStrength ?? null,
    confluenceMemberCount: zone.diagnostics.structureConfluenceMemberCount ?? null,
    visibleWaterFraction: zone.visibleWaterFraction,
    outsideOvalBoundaryFraction: zone.diagnostics.outsideOvalBoundaryFraction ?? null,
    majorAxisM: zone.majorAxisM,
    majorAxisPctOfLakeLongestDimension: longestDimensionM && longestDimensionM > 0 ? (zone.majorAxisM / longestDimensionM) * 100 : null,
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
  };
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
  const suppressionByFeatureClassReason: Record<string, number> = {};
  const unrepresentableDiagnostics: Record<string, number> = {};
  const unrepresentableByFeatureClassReason: Record<string, number> = {};
  for (const coverage of zoneResult.diagnostics.featureCoverage) {
    if (coverage.producedVisibleZones || !envelopeUnitIds.has(coverage.featureId)) continue;
    if (coverage.reason === 'feature_frame_unrepresentable') {
      const reason = coverage.unrepresentableReason ?? 'unknown_feature_frame_unrepresentable';
      unrepresentableDiagnostics[reason] = (unrepresentableDiagnostics[reason] ?? 0) + 1;
      const key = `${coverage.featureClass}:${reason}`;
      unrepresentableByFeatureClassReason[key] = (unrepresentableByFeatureClassReason[key] ?? 0) + 1;
    } else {
      suppressionDiagnostics[coverage.reason] = (suppressionDiagnostics[coverage.reason] ?? 0) + 1;
      const key = `${coverage.featureClass}:${coverage.reason}`;
      suppressionByFeatureClassReason[key] = (suppressionByFeatureClassReason[key] ?? 0) + 1;
    }
  }
  return {
    featureEnvelopeZoneCount: envelopeZones.length,
    nonEnvelopeLegacyZoneCount: zoneResult.zones.length - envelopeZones.length,
    selectedFeatureWithoutEnvelopeZoneCount: selectedFeatureWithoutEnvelopeZoneIds.length,
    selectedFeatureWithoutEnvelopeZoneIds,
    featureEnvelopeSuppressionDiagnostics: suppressionDiagnostics,
    featureEnvelopeSuppressionByFeatureClassReason: suppressionByFeatureClassReason,
    featureEnvelopeUnrepresentableDiagnostics: unrepresentableDiagnostics,
    featureEnvelopeUnrepresentableByFeatureClassReason: unrepresentableByFeatureClassReason,
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

function featureEnvelopeSeasonSignatures(params: {
  lake: ManifestLake;
  rowId: string;
  season: WaterReaderSeason;
  zones: WaterReaderPlacedZone[];
}): FeatureEnvelopeSeasonSignature[] {
  const lakeKey = `${params.lake.lake}|${params.lake.state}`;
  return params.zones
    .filter((zone) => zone.diagnostics.featureEnvelopeModelVersion === 'feature-envelope-v1')
    .map((zone) => ({
      rowId: params.rowId,
      lakeKey,
      lake: params.lake.lake,
      state: params.lake.state,
      season: params.season,
      sourceFeatureId: String(zone.diagnostics.featureEnvelopeSourceFeatureId ?? zone.sourceFeatureId),
      placementKind: zone.placementKind,
      anchorXM: Math.round(zone.anchor.x),
      anchorYM: Math.round(zone.anchor.y),
      centerXM: Math.round(zone.ovalCenter.x),
      centerYM: Math.round(zone.ovalCenter.y),
      majorAxisM: Math.round(zone.majorAxisM),
      minorAxisM: Math.round(zone.minorAxisM),
      rotationRad: Number(zone.rotationRad.toFixed(4)),
      featureEnvelopeModelVersion: String(zone.diagnostics.featureEnvelopeModelVersion),
    }))
    .sort((a, b) =>
      a.lakeKey.localeCompare(b.lakeKey) ||
      a.sourceFeatureId.localeCompare(b.sourceFeatureId) ||
      a.season.localeCompare(b.season));
}

function buildFeatureEnvelopeSeasonAudit(signatures: FeatureEnvelopeSeasonSignature[]) {
  const groups = new Map<string, FeatureEnvelopeSeasonSignature[]>();
  for (const signature of signatures) {
    const key = `${signature.lakeKey}|${signature.sourceFeatureId}`;
    const existing = groups.get(key) ?? [];
    existing.push(signature);
    groups.set(key, existing);
  }
  const mismatches = [...groups.entries()].flatMap(([key, group]) => {
    const signaturesOnly = group.map(({ rowId, lakeKey, lake, state, season, sourceFeatureId, ...geometry }) => geometry);
    const canonical = JSON.stringify(signaturesOnly[0] ?? {});
    const mismatch = signaturesOnly.some((signature) => JSON.stringify(signature) !== canonical);
    if (!mismatch) return [];
    return [{
      key,
      lake: group[0]?.lake ?? '',
      state: group[0]?.state ?? '',
      sourceFeatureId: group[0]?.sourceFeatureId ?? '',
      seasons: group.map((item) => item.season).sort(),
      signatures: group,
    }];
  });
  return {
    signatureCount: signatures.length,
    comparedFeatureCount: groups.size,
    mismatchCount: mismatches.length,
    mismatches,
  };
}

function rowDiagnostics(params: {
  lake: ManifestLake;
  polygon: PolygonRpcRow;
  rowSummary: RowSummary;
  currentDate: Date;
  preprocess: WaterReaderPreprocessResult;
  features: WaterReaderDetectedFeature[];
  zoneResult: WaterReaderZonePlacementResult;
  legend: WaterReaderLegendEntry[];
  displayModel: WaterReaderDisplayModel;
  productionSvgResult: WaterReaderProductionSvgResult | null;
  appWidthProductionSvgResult: WaterReaderProductionSvgResult | null;
  legendForbiddenHits: string[];
  fullLegendLayout: LegendLayoutSvgDiagnostics;
  appLegendLayout: LegendLayoutSvgDiagnostics;
}) {
  return {
    manifest: params.lake,
    row: params.rowSummary,
    polygonSource: {
      path: 'supabase.rpc:get_waterbody_polygon_for_reader',
      lakeIdFetchKey: params.lake.lakeId,
      fetchedByManifestLakeId: true,
    },
    input: {
      lakeId: params.lake.lakeId,
      name: params.polygon.name,
      state: params.polygon.state,
      acreage: params.polygon.area_acres,
      currentDate: params.currentDate.toISOString(),
      allowUniversalFallback: false,
    },
    polygonMetadata: {
      lakeId: params.polygon.lake_id,
      name: params.polygon.name,
      state: params.polygon.state,
      county: params.polygon.county,
      waterbodyType: params.polygon.waterbody_type,
      centroid: { lat: params.polygon.centroid_lat, lon: params.polygon.centroid_lon },
      bbox: {
        minLon: params.polygon.bbox_min_lon,
        minLat: params.polygon.bbox_min_lat,
        maxLon: params.polygon.bbox_max_lon,
        maxLat: params.polygon.bbox_max_lat,
      },
      areaSqM: params.polygon.area_sq_m,
      areaAcres: params.polygon.area_acres,
      perimeterM: params.polygon.perimeter_m,
      geometryIsValid: params.polygon.geometry_is_valid,
      geometryValidityDetail: params.polygon.geometry_validity_detail,
      componentCount: params.polygon.component_count,
      interiorRingCount: params.polygon.interior_ring_count,
      sourceSupportStatus: params.polygon.water_reader_support_status,
      sourceSupportReason: params.polygon.water_reader_support_reason,
      polygonQaFlags: params.polygon.polygon_qa_flags ?? [],
      geojsonType: params.polygon.geojson && typeof params.polygon.geojson === 'object' && 'type' in params.polygon.geojson
        ? String((params.polygon.geojson as { type?: unknown }).type)
        : null,
    },
    preprocess: {
      supportStatus: params.preprocess.supportStatus,
      supportReason: params.preprocess.supportReason,
      qaFlags: params.preprocess.qaFlags,
      metrics: params.preprocess.metrics,
      projection: params.preprocess.projection,
      resampleSpacingM: params.preprocess.resampleSpacingM,
      simplifyToleranceM: params.preprocess.simplifyToleranceM,
      smoothingSigmaM: params.preprocess.smoothingSigmaM,
      primaryExteriorPointCount: params.preprocess.primaryPolygon?.exterior.length ?? 0,
      primaryHoleCount: params.preprocess.primaryPolygon?.holes.length ?? 0,
      resampledExteriorPointCount: params.preprocess.resampledExterior?.length ?? 0,
      simplifiedExteriorPointCount: params.preprocess.simplifiedExterior?.length ?? 0,
      smoothedExteriorPointCount: params.preprocess.smoothedExterior?.length ?? 0,
    },
    rawCandidates: {
      detectedFeatures: params.features,
      detectedFeatureClassCounts: featureClassCounts(params.features),
    },
    placement: {
      diagnostics: params.zoneResult.diagnostics,
      qaFlags: params.zoneResult.qaFlags,
      featureCoverage: params.zoneResult.diagnostics.featureCoverage,
      selectedFeatureIds: params.zoneResult.diagnostics.selectedFeatureIds,
      suppressedFeatureIds: params.zoneResult.diagnostics.suppressedFeatureIds,
      rejectedByReason: params.zoneResult.diagnostics.rejectedByReason,
      droppedByReason: params.zoneResult.diagnostics.droppedByReason,
      zones: params.zoneResult.zones.map((zone) => zoneDebug(zone, params.preprocess.metrics?.longestDimensionM)),
      featureEnvelopeSummary: {
        ...featureEnvelopeSummary(params.zoneResult.zones),
        ...featureEnvelopeAudit(params.zoneResult),
      },
    },
    legend: {
      entries: params.legend,
      forbiddenHits: params.legendForbiddenHits,
      repeatedLegendTitle: maxRepeatedLegendTitle(params.displayModel.displayLegendEntries),
    },
    display: {
      model: params.displayModel,
      displayedEntries: params.displayModel.displayedEntries,
      displayLegendEntries: params.displayModel.displayLegendEntries,
      retainedEntries: params.displayModel.retainedEntries,
      suppressedEntries: params.displayModel.suppressedEntries,
      displaySelectionUnits: params.displayModel.displaySelectionUnits,
      rankingDiagnostics: params.displayModel.displaySelectionUnits.map((unit) => ({
        unitId: unit.unitId,
        displayState: unit.displayState,
        featureClasses: unit.featureClasses,
        placementKinds: unit.placementKinds,
        majorAxisM: unit.majorAxisM,
        score: unit.score,
        rankingDiagnostics: unit.rankingDiagnostics,
      })),
    },
    renderers: {
      production: params.productionSvgResult ? {
        warnings: params.productionSvgResult.warnings,
        summary: params.productionSvgResult.summary,
        legendLayout: params.fullLegendLayout,
      } : null,
      appWidth420: params.appWidthProductionSvgResult ? {
        warnings: params.appWidthProductionSvgResult.warnings,
        summary: params.appWidthProductionSvgResult.summary,
        legendLayout: params.appLegendLayout,
      } : null,
    },
    timings: params.rowSummary.timing,
  };
}

function summaryCsv(rows: RowSummary[]): string {
  const header = [
    'row_id',
    'manifest_index',
    'lake',
    'state',
    'county',
    'lake_id',
    'season',
    'review_date',
    'season_group',
    'manifest_support',
    'source_support_status',
    'engine_support_status',
    'support_status',
    'fallback_no_map',
    'fallback_message',
    'detected_feature_count',
    'selected_feature_count',
    'suppressed_feature_count',
    'detected_unrepresentable_feature_count',
    'feature_envelope_zone_count',
    'non_envelope_legacy_zone_count',
    'selected_feature_without_envelope_zone_count',
    'feature_envelope_suppression_diagnostics',
    'feature_envelope_suppression_by_feature_class_reason',
    'feature_envelope_unrepresentable_diagnostics',
    'feature_envelope_unrepresentable_by_feature_class_reason',
    'whole_feature_outside_water_center_accepted_count',
    'whole_feature_outside_water_center_accepted_by_feature_class',
    'whole_feature_outside_water_center_max_visible_water_distance_m',
    'whole_feature_outside_water_center_max_locality_radius_m',
    'whole_feature_outside_water_center_max_anchor_distance_m',
    'displayed_count',
    'retained_count',
    'display_cap',
    'display_cap_pressure',
    'repeated_legend_title_max_count',
    'repeated_legend_title_max_title',
    'full_size_renderer_warning_count',
    'full_size_renderer_warning_codes',
    'app_width_renderer_warning_count',
    'app_width_renderer_warning_codes',
    'app_width_svg_viewbox',
    'app_width_svg_height',
    'full_title_wrap_count',
    'app_title_wrap_count',
    'full_overlap_risk_count',
    'app_overlap_risk_count',
    'qa_flags',
    'major_qa_flags',
    'selected_feature_suppression_count',
    'semantic_anchor_mismatch_count',
    'label_semantic_risk_count',
    'legend_forbidden_hits',
    'point_dominance_score',
    'point_dominance_reasons',
    'review_priority',
    'review_priority_reasons',
    'confluence_group_count',
    'confluence_member_zone_count',
    'rendered_unified_confluence_count',
    'stacked_confluence_member_render_count',
    'app_width_rendered_unified_confluence_count',
    'app_width_stacked_confluence_member_render_count',
    'displayed_feature_class_counts',
    'retained_feature_class_counts',
    'detected_feature_class_counts',
    'displayed_placement_kind_counts',
    'retained_placement_kind_counts',
    'major_axis_ranking_fallback_count',
    'fetch_ms',
    'preprocess_ms',
    'features_ms',
    'zones_ms',
    'legend_ms',
    'display_ms',
    'render_ms',
    'write_ms',
    'total_ms',
    'slowest_phase',
    'slowest_phase_ms',
    'production_svg_file',
    'app_420_svg_file',
    'debug_svg_file',
    'json_file',
  ];
  const lines = rows.map((row) => [
    row.rowId,
    row.manifestIndex,
    row.lake,
    row.state,
    row.county,
    row.lakeId,
    row.season,
    row.reviewDate,
    row.seasonGroup,
    row.manifestSupport,
    row.sourceSupportStatus,
    row.engineSupportStatus,
    row.supportStatus,
    row.fallbackNoMap,
    row.fallbackMessage,
    row.detectedFeatureCount,
    row.selectedFeatureCount,
    row.suppressedFeatureCount,
    row.detectedUnrepresentableFeatureCount,
    row.featureEnvelopeZoneCount,
    row.nonEnvelopeLegacyZoneCount,
    row.selectedFeatureWithoutEnvelopeZoneCount,
    row.featureEnvelopeSuppressionDiagnostics,
    row.featureEnvelopeSuppressionByFeatureClassReason,
    row.featureEnvelopeUnrepresentableDiagnostics,
    row.featureEnvelopeUnrepresentableByFeatureClassReason,
    row.wholeFeatureOutsideWaterCenterAcceptedCount,
    row.wholeFeatureOutsideWaterCenterAcceptedByFeatureClass,
    row.wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM,
    row.wholeFeatureOutsideWaterCenterMaxLocalityRadiusM,
    row.wholeFeatureOutsideWaterCenterMaxAnchorDistanceM,
    row.displayedCount,
    row.retainedCount,
    row.displayCap,
    row.displayCapPressure,
    row.repeatedLegendTitleMaxCount,
    row.repeatedLegendTitleMaxTitle,
    row.fullSizeRendererWarningCount,
    row.fullSizeRendererWarningCodes.join('|'),
    row.appWidthRendererWarningCount,
    row.appWidthRendererWarningCodes.join('|'),
    row.appWidthSvgViewBox,
    row.appWidthSvgHeight,
    row.fullTitleWrapCount,
    row.appTitleWrapCount,
    row.fullOverlapRiskCount,
    row.appOverlapRiskCount,
    row.qaFlags.join('|'),
    row.majorQaFlags.join('|'),
    row.selectedFeatureSuppressionCount,
    row.semanticAnchorMismatchCount,
    row.labelSemanticRiskCount,
    row.legendForbiddenHits.join('|'),
    row.pointDominanceScore,
    row.pointDominanceReasons.join('|'),
    row.reviewPriority,
    row.reviewPriorityReasons.join(';'),
    row.confluenceGroupCount,
    row.confluenceMemberZoneCount,
    row.renderedUnifiedConfluenceCount,
    row.stackedConfluenceMemberRenderCount,
    row.appWidthRenderedUnifiedConfluenceCount,
    row.appWidthStackedConfluenceMemberRenderCount,
    row.displayedFeatureClassCounts,
    row.retainedFeatureClassCounts,
    row.detectedFeatureClassCounts,
    row.displayedPlacementKindCounts,
    row.retainedPlacementKindCounts,
    row.majorAxisRankingFallbackCount,
    row.timing.fetchMs,
    row.timing.preprocessMs,
    row.timing.featuresMs,
    row.timing.zonesMs,
    row.timing.legendMs,
    row.timing.displayMs,
    row.timing.renderMs,
    row.timing.writeMs,
    row.timing.totalMs,
    row.timing.slowestPhase,
    row.timing.slowestPhaseMs,
    row.productionSvgFile,
    row.app420SvgFile,
    row.debugSvgFile,
    row.jsonFile,
  ].map(csvCell).join(','));
  return `${header.join(',')}\n${lines.join('\n')}\n`;
}

function manualReviewScorecardCsv(rows: RowSummary[]): string {
  const metadataColumns = [
    'rowId',
    'manifestIndex',
    'lake',
    'state',
    'county',
    'season',
    'reviewDate',
    'seasonGroup',
    'supportStatus',
    'displayedCount',
    'retainedCount',
    'displayCap',
    'fullRendererWarnings',
    'appRendererWarnings',
    'appSvgHeight',
    'fullTitleWrapCount',
    'appTitleWrapCount',
    'fullOverlapRiskCount',
    'appOverlapRiskCount',
    'repeatedLegendTitleMaxCount',
    'repeatedLegendTitleMaxTitle',
    'displayedFeatureClassCounts',
    'retainedFeatureClassCounts',
    'semanticAnchorMismatchCount',
    'labelSemanticRiskCount',
    'selectedFeatureSuppressionCount',
    'pointDominanceScore',
    'reviewPriority',
    'reviewPriorityReasons',
    'productionSvgFile',
    'app420SvgFile',
    'debugSvgFile',
    'jsonFile',
  ];
  const manualColumns = [
    'shorelineContact',
    'semanticHonesty',
    'seasonalPlacement',
    'zoneSizing',
    'appReadability',
    'displayDiversity',
    'recoveryLabelTrust',
    'overallTrust',
    'falsePositiveNotes',
    'falseNegativeNotes',
    'misplacedZoneNotes',
    'clutterCrowdingNotes',
    'copyLegendNotes',
    'sizingNotes',
    'appWidthNotes',
    'performanceNotes',
    'founderNotes',
    'masterNotes',
    'decision',
  ];
  const lines = rows.map((row) => [
    row.rowId,
    row.manifestIndex,
    row.lake,
    row.state,
    row.county,
    row.season,
    row.reviewDate,
    row.seasonGroup,
    row.supportStatus,
    row.displayedCount,
    row.retainedCount,
    row.displayCap,
    row.fullSizeRendererWarningCodes.join('|'),
    row.appWidthRendererWarningCodes.join('|'),
    row.appWidthSvgHeight,
    row.fullTitleWrapCount,
    row.appTitleWrapCount,
    row.fullOverlapRiskCount,
    row.appOverlapRiskCount,
    row.repeatedLegendTitleMaxCount,
    row.repeatedLegendTitleMaxTitle,
    row.displayedFeatureClassCounts,
    row.retainedFeatureClassCounts,
    row.semanticAnchorMismatchCount,
    row.labelSemanticRiskCount,
    row.selectedFeatureSuppressionCount,
    row.pointDominanceScore,
    row.reviewPriority,
    row.reviewPriorityReasons.join(';'),
    row.productionSvgFile,
    row.app420SvgFile,
    row.debugSvgFile,
    row.jsonFile,
    ...manualColumns.map(() => ''),
  ].map(csvCell).join(','));
  return `${[...metadataColumns, ...manualColumns].join(',')}\n${lines.join('\n')}\n`;
}

function aggregateSignals(rows: RowSummary[]) {
  const count = (fn: (row: RowSummary) => boolean) => rows.filter(fn).length;
  const displayedFeatureClassCounts: Record<string, number> = {};
  const retainedFeatureClassCounts: Record<string, number> = {};
  for (const row of rows) {
    for (const [key, value] of Object.entries(row.displayedFeatureClassCounts)) {
      displayedFeatureClassCounts[key] = (displayedFeatureClassCounts[key] ?? 0) + value;
    }
    for (const [key, value] of Object.entries(row.retainedFeatureClassCounts)) {
      retainedFeatureClassCounts[key] = (retainedFeatureClassCounts[key] ?? 0) + value;
    }
  }
  return {
    manifestLakes: new Set(rows.map((row) => row.manifestIndex)).size,
    seasons: SEASONS.length,
    rowsGenerated: rows.length,
    reviewPriorityCounts: {
      critical: count((row) => row.reviewPriority === 'critical'),
      high: count((row) => row.reviewPriority === 'high'),
      medium: count((row) => row.reviewPriority === 'medium'),
      low: count((row) => row.reviewPriority === 'low'),
    },
    fallbackNoMapRows: count((row) => row.signals.fallbackNoMap),
    zeroDisplayedZoneRows: count((row) => row.signals.zeroDisplayedZones),
    selectedFeatureSuppressionRows: count((row) => row.signals.selectedFeatureSuppression),
    semanticAnchorMismatchRows: count((row) => row.signals.semanticAnchorMismatch),
    labelSemanticRiskRows: count((row) => row.signals.labelSemanticRisk),
    fullSizeRendererWarningRows: count((row) => row.signals.fullSizeRendererWarnings),
    appWidthRendererWarningRows: count((row) => row.signals.appWidthRendererWarnings),
    appWidthViewBoxHeightOutlierRows: count((row) => row.signals.appWidthViewBoxHeightOutlier),
    retainedDisplayCapPressureRows: count((row) => row.signals.retainedDisplayCapPressure),
    repeatedLegendTitlePressureRows: count((row) => row.signals.repeatedLegendTitlePressure),
    fullTitleWrapRows: count((row) => row.signals.fullLegendTitleWrap),
    appTitleWrapRows: count((row) => row.signals.appLegendTitleWrap),
    fullOverlapRiskRows: count((row) => row.signals.fullLegendOverlapRisk),
    appOverlapRiskRows: count((row) => row.signals.appLegendOverlapRisk),
    pointDominanceRows: count((row) => row.signals.pointDominance),
    majorAxisRankingFallbackRows: count((row) => row.signals.majorAxisRankingFallback),
    visualReviewNeededRows: count((row) => row.signals.visualReviewNeeded),
    actionableVisualReviewRows: count((row) => row.signals.visualReviewNeeded),
    displayedFeatureClassCounts,
    retainedFeatureClassCounts,
    confluenceGroupTotal: rows.reduce((sum, row) => sum + row.confluenceGroupCount, 0),
    confluenceMemberZoneTotal: rows.reduce((sum, row) => sum + row.confluenceMemberZoneCount, 0),
    slowestRowsByTotalMs: [...rows]
      .sort((a, b) => b.timing.totalMs - a.timing.totalMs)
      .slice(0, 10)
      .map((row) => ({ rowId: row.rowId, lake: row.lake, season: row.season, totalMs: row.timing.totalMs, slowestPhase: row.timing.slowestPhase })),
    slowestRowsByPhase: Object.fromEntries(([
      'fetchMs',
      'preprocessMs',
      'featuresMs',
      'zonesMs',
      'legendMs',
      'displayMs',
      'renderMs',
      'writeMs',
    ] as const).map((phase) => [
      phase.replace(/Ms$/, ''),
      [...rows]
        .sort((a, b) => b.timing[phase] - a.timing[phase])
        .slice(0, 5)
        .map((row) => ({ rowId: row.rowId, lake: row.lake, season: row.season, ms: row.timing[phase] })),
    ])),
  };
}

function warningDetails(rows: RowSummary[]) {
  return {
    fullSizeRows: rows
      .filter((row) => row.fullSizeRendererWarningCount > 0)
      .map((row) => ({
        rowId: row.rowId,
        lake: row.lake,
        state: row.state,
        county: row.county,
        season: row.season,
        codes: row.fullSizeRendererWarningCodes,
        productionSvgFile: row.productionSvgFile,
        jsonFile: row.jsonFile,
      })),
    appWidthRows: rows
      .filter((row) => row.appWidthRendererWarningCount > 0)
      .map((row) => ({
        rowId: row.rowId,
        lake: row.lake,
        state: row.state,
        county: row.county,
        season: row.season,
        codes: row.appWidthRendererWarningCodes,
        viewBox: row.appWidthSvgViewBox,
        height: row.appWidthSvgHeight,
        app420SvgFile: row.app420SvgFile,
        jsonFile: row.jsonFile,
      })),
    appWidthViewBoxHeightOutliers: rows
      .filter((row) => row.signals.appWidthViewBoxHeightOutlier)
      .map((row) => ({
        rowId: row.rowId,
        lake: row.lake,
        season: row.season,
        height: row.appWidthSvgHeight,
        threshold: APP_VIEWBOX_HEIGHT_OUTLIER,
        app420SvgFile: row.app420SvgFile,
      })),
  };
}

function displayRankingDiagnostics(rows: RowSummary[]) {
  return {
    majorAxisFallbackRows: rows
      .filter((row) => row.majorAxisRankingFallbackCount > 0)
      .map((row) => ({
        rowId: row.rowId,
        lake: row.lake,
        state: row.state,
        county: row.county,
        season: row.season,
        majorAxisRankingFallbackCount: row.majorAxisRankingFallbackCount,
        displayedFeatureClassCounts: row.displayedFeatureClassCounts,
        retainedFeatureClassCounts: row.retainedFeatureClassCounts,
        jsonFile: row.jsonFile,
      })),
    rows: rows.map((row) => ({
      rowId: row.rowId,
      lake: row.lake,
      season: row.season,
      displayedCount: row.displayedCount,
      retainedCount: row.retainedCount,
      displayCap: row.displayCap,
      majorAxisRankingFallbackCount: row.majorAxisRankingFallbackCount,
      displayedFeatureClassCounts: row.displayedFeatureClassCounts,
      retainedFeatureClassCounts: row.retainedFeatureClassCounts,
      displayedPlacementKindCounts: row.displayedPlacementKindCounts,
      retainedPlacementKindCounts: row.retainedPlacementKindCounts,
      jsonFile: row.jsonFile,
    })),
  };
}

function retainedDiagnostics(rows: RowSummary[]) {
  return {
    retainedRows: rows
      .filter((row) => row.retainedCount > 0)
      .map((row) => ({
        rowId: row.rowId,
        lake: row.lake,
        state: row.state,
        county: row.county,
        season: row.season,
        retainedCount: row.retainedCount,
        displayedCount: row.displayedCount,
        displayCap: row.displayCap,
        retainedFeatureClassCounts: row.retainedFeatureClassCounts,
        retainedPlacementKindCounts: row.retainedPlacementKindCounts,
        repeatedLegendTitleMaxCount: row.repeatedLegendTitleMaxCount,
        jsonFile: row.jsonFile,
      })),
  };
}

function legendLayoutDiagnosticsReport(rows: RowSummary[], rowLayouts: RowLegendLayoutDiagnostics[]) {
  const byRowId = new Map(rowLayouts.map((layout) => [layout.rowId, layout]));
  return {
    summary: {
      rows: rows.length,
      fullTitleWrapRows: rows.filter((row) => row.fullTitleWrapCount > 0).length,
      appTitleWrapRows: rows.filter((row) => row.appTitleWrapCount > 0).length,
      fullOverlapRiskRows: rows.filter((row) => row.fullOverlapRiskCount > 0).length,
      appOverlapRiskRows: rows.filter((row) => row.appOverlapRiskCount > 0).length,
      fullTitleWrapEntries: rows.reduce((sum, row) => sum + row.fullTitleWrapCount, 0),
      appTitleWrapEntries: rows.reduce((sum, row) => sum + row.appTitleWrapCount, 0),
      fullOverlapRiskEntries: rows.reduce((sum, row) => sum + row.fullOverlapRiskCount, 0),
      appOverlapRiskEntries: rows.reduce((sum, row) => sum + row.appOverlapRiskCount, 0),
    },
    rows: rows.map((row) => {
      const layout = byRowId.get(row.rowId);
      return {
        rowId: row.rowId,
        lake: row.lake,
        state: row.state,
        county: row.county,
        season: row.season,
        fullTitleWrapCount: row.fullTitleWrapCount,
        appTitleWrapCount: row.appTitleWrapCount,
        fullOverlapRiskCount: row.fullOverlapRiskCount,
        appOverlapRiskCount: row.appOverlapRiskCount,
        productionSvgFile: row.productionSvgFile,
        app420SvgFile: row.app420SvgFile,
        fullEntries: layout?.fullEntries ?? [],
        appEntries: layout?.appEntries ?? [],
      };
    }),
  };
}

function performanceTimings(rows: RowSummary[]) {
  return {
    rows: rows.map((row) => ({
      rowId: row.rowId,
      lake: row.lake,
      state: row.state,
      county: row.county,
      season: row.season,
      totalMs: row.timing.totalMs,
      slowestPhase: row.timing.slowestPhase,
      slowestPhaseMs: row.timing.slowestPhaseMs,
      timings: row.timing,
      jsonFile: row.jsonFile,
    })),
    slowestRowsOverall: [...rows]
      .sort((a, b) => b.timing.totalMs - a.timing.totalMs)
      .slice(0, 20)
      .map((row) => ({ rowId: row.rowId, lake: row.lake, season: row.season, totalMs: row.timing.totalMs, slowestPhase: row.timing.slowestPhase })),
    rowsOver60s: rows
      .filter((row) => row.timing.totalMs > SLOW_ROW_REVIEW_MS)
      .map((row) => ({ rowId: row.rowId, lake: row.lake, season: row.season, totalMs: row.timing.totalMs, slowestPhase: row.timing.slowestPhase })),
    slowestRowsByPhase: aggregateSignals(rows).slowestRowsByPhase,
  };
}

function featureEnvelopeSuppressionByClassReasonReport(rows: RowSummary[]) {
  const counts: Record<string, number> = {};
  const rowsByReason: Record<string, string[]> = {};
  const unrepresentableCounts: Record<string, number> = {};
  const unrepresentableRowsByReason: Record<string, string[]> = {};
  for (const row of rows) {
    for (const [key, count] of Object.entries(row.featureEnvelopeSuppressionByFeatureClassReason)) {
      counts[key] = (counts[key] ?? 0) + count;
      if (count > 0) {
        const existing = rowsByReason[key] ?? [];
        existing.push(row.rowId);
        rowsByReason[key] = existing;
      }
    }
    for (const [key, count] of Object.entries(row.featureEnvelopeUnrepresentableByFeatureClassReason)) {
      unrepresentableCounts[key] = (unrepresentableCounts[key] ?? 0) + count;
      if (count > 0) {
        const existing = unrepresentableRowsByReason[key] ?? [];
        existing.push(row.rowId);
        unrepresentableRowsByReason[key] = existing;
      }
    }
  }
  return {
    totalSuppressedFeatureEnvelopeCount: Object.values(counts).reduce((sum, count) => sum + count, 0),
    counts,
    rowsByReason,
    totalDetectedUnrepresentableFeatureCount: Object.values(unrepresentableCounts).reduce((sum, count) => sum + count, 0),
    unrepresentableCounts,
    unrepresentableRowsByReason,
  };
}

function placementSemanticAuditSpring(rowJsonIndex: Array<{ rowId: string; jsonFile: string }>) {
  const rows = rowJsonIndex
    .filter((entry) => entry.rowId.endsWith('-spring'))
    .flatMap((entry) => {
      const path = resolve(process.cwd(), entry.jsonFile);
      if (!existsSync(path)) return [];
      const diagnostic = JSON.parse(readFileSync(path, 'utf8')) as {
        row?: { lake?: string };
        display?: { displayedEntries?: unknown[] };
      };
      const lake = diagnostic.row?.lake ?? entry.rowId;
      const labelMetrics = labelMetricsForAudit(entry.jsonFile);
      const displayedEntries = Array.isArray(diagnostic.display?.displayedEntries) ? diagnostic.display.displayedEntries as Array<Record<string, unknown>> : [];
      return displayedEntries.flatMap((displayEntry) => {
        const zones = Array.isArray(displayEntry.zones) ? displayEntry.zones as Array<Record<string, unknown>> : [];
        return zones.map((zone) => {
          const diagnostics = (zone.diagnostics && typeof zone.diagnostics === 'object' ? zone.diagnostics : {}) as Record<string, unknown>;
          const majorAxisM = numberValue(zone.majorAxisM);
          const minorAxisM = numberValue(zone.minorAxisM);
          const displayNumber = displayEntry.displayNumber ?? null;
          const labelMetric = displayNumber === null ? null : labelMetrics.get(String(displayNumber));
          return {
            lake,
            rowId: entry.rowId,
            displayNumber,
            entryType: displayEntry.entryType ?? null,
            featureClass: zone.featureClass ?? null,
            placementKind: zone.placementKind ?? null,
            legendTitle: ((displayEntry.legend as Record<string, unknown> | undefined)?.title as string | undefined) ?? null,
            intendedSeasonalSemantic: diagnostics.intendedSeasonalSemantic ?? zone.placementSemanticId ?? null,
            actualAnchorSemantic: diagnostics.actualAnchorSemantic ?? zone.anchorSemanticId ?? null,
            semanticFallbackUsed: diagnostics.semanticFallbackUsed ?? false,
            semanticFallbackReason: diagnostics.semanticFallbackReason ?? null,
            semanticConfidenceTier: diagnostics.semanticConfidenceTier ?? null,
            majorAxisM,
            minorAxisM,
            aspectRatio: majorAxisM && minorAxisM ? Number((majorAxisM / minorAxisM).toFixed(2)) : null,
            displayReadabilityTier: diagnostics.displayReadabilityTier ?? null,
            constrictionLineFallbackUsed: diagnostics.constrictionLineFallbackUsed ?? false,
            constrictionDisplayedAsLineFallback: diagnostics.constrictionDisplayedAsLineFallback ?? diagnostics.constrictionLineFallbackUsed ?? false,
            constrictionLineRetainedForReadability: diagnostics.constrictionLineRetainedForReadability ?? false,
            constrictionApproachCandidateUsed: diagnostics.constrictionApproachCandidateUsed ?? false,
            islandSizeAttemptMultiplier: diagnostics.islandSizeAttemptMultiplier ?? null,
            islandLargeRecoveryAccepted: diagnostics.islandLargeRecoveryAccepted ?? false,
            coveFallbackDistanceFromBackPct: diagnostics.coveFallbackDistanceFromBackPct ?? null,
            labelLeaderLengthPx: labelMetric?.leaderLengthPx ?? null,
            labelLongLeaderWarning: labelMetric?.longLeader ?? false,
          };
        });
      });
    });
  return {
    generatedAt: new Date().toISOString(),
    season: 'spring',
    rowCount: rows.length,
    rows,
  };
}

function labelMetricsForAudit(jsonFile: string): Map<string, { leaderLengthPx: number; longLeader: boolean }> {
  const appSvgFile = jsonFile
    .replace('/row-json/', '/app-420-svg/')
    .replace(/\.json$/, '-app-420.svg');
  const path = resolve(process.cwd(), appSvgFile);
  const metrics = new Map<string, { leaderLengthPx: number; longLeader: boolean }>();
  if (!existsSync(path)) return metrics;
  const svg = readFileSync(path, 'utf8');
  const regex = /<g class="water-reader-map-number[^"]*"[^>]*data-display-number="([^"]+)"[^>]*data-leader-length-px="([^"]+)"[^>]*data-long-leader="([^"]+)"/g;
  for (const match of svg.matchAll(regex)) {
    const displayNumber = match[1];
    if (!displayNumber) continue;
    metrics.set(displayNumber, {
      leaderLengthPx: numberValue(Number(match[2])) ?? 0,
      longLeader: match[3] === 'true',
    });
  }
  return metrics;
}

function numberValue(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(2)) : null;
}

function linkList(rows: RowSummary[], limit = 80): string {
  if (rows.length === 0) return '<p class="empty">None</p>';
  return `<ol>${rows.slice(0, limit).map((row) =>
    `<li><a href="#${escapeHtml(row.rowId)}">${escapeHtml(row.lake)} ${escapeHtml(row.season)}</a> <span>${escapeHtml(row.state)}/${escapeHtml(row.county)}</span> <code>${Math.round(row.timing.totalMs)}ms ${escapeHtml(row.timing.slowestPhase)}</code></li>`,
  ).join('')}</ol>`;
}

function htmlIndex(rows: RowSummary[], options: {
  title?: string;
  baseDir?: string;
  scorecardFile?: string | null;
  batchLinks?: Array<{ label: string; indexes: number[]; indexFile: string; scorecardFile: string }>;
} = {}) {
  const baseDir = options.baseDir ?? OUT_DIR;
  const title = options.title ?? RUN_LABEL;
  const signals = aggregateSignals(rows);
  const seasonGroups = Object.fromEntries(SEASONS.map((season) => [season, rows.filter((row) => row.season === season)]));
  const rowsNeedingReview = rows.filter((row) => row.signals.visualReviewNeeded);
  const slowest = [...rows].sort((a, b) => b.timing.totalMs - a.timing.totalMs).slice(0, 25);
  const slowestIds = new Set(slowest.map((row) => row.rowId));
  const retained = [...rows].filter((row) => row.retainedCount > 0).sort((a, b) => b.retainedCount - a.retainedCount || b.timing.totalMs - a.timing.totalMs);
  const repeated = rows.filter((row) => row.repeatedLegendTitleMaxCount >= 4);
  const majorAxis = rows.filter((row) => row.majorAxisRankingFallbackCount > 0);
  const zeroOrFallback = rows.filter((row) => row.fallbackNoMap || row.displayedCount === 0);
  const fullWarnings = rows.filter((row) => row.fullSizeRendererWarningCount > 0);
  const appWarnings = rows.filter((row) => row.appWidthRendererWarningCount > 0);
  const appHeightOutliers = rows.filter((row) => row.signals.appWidthViewBoxHeightOutlier);
  const titleWraps = rows.filter((row) => row.fullTitleWrapCount > 0 || row.appTitleWrapCount > 0);
  const overlapRisks = rows.filter((row) => row.fullOverlapRiskCount > 0 || row.appOverlapRiskCount > 0);
  const pointDominanceRows = rows.filter((row) => row.signals.pointDominance);
  const semanticMismatchRows = rows.filter((row) => row.semanticAnchorMismatchCount > 0);
  const priorityGroups: Record<ReviewPriority, RowSummary[]> = {
    critical: rows.filter((row) => row.reviewPriority === 'critical'),
    high: rows.filter((row) => row.reviewPriority === 'high'),
    medium: rows.filter((row) => row.reviewPriority === 'medium'),
    low: rows.filter((row) => row.reviewPriority === 'low'),
  };
  const lakes = [...new Set(rows.map((row) => row.lake))];
  const scorecardLink = options.scorecardFile
    ? `<div class="stat scorecard">scorecard: <a href="${escapeHtml(relative(baseDir, options.scorecardFile))}">manual-review-scorecard.csv</a></div>`
    : '';
  const batchLinks = options.batchLinks ?? [];
  const batchLinksHtml = batchLinks.length > 0
    ? `<details open><summary>Review Batches (${batchLinks.length})</summary><ol>${batchLinks.map((batch) =>
      `<li>${escapeHtml(batch.label)} <span>manifest indexes ${escapeHtml(batch.indexes.join(','))}</span> <a href="${escapeHtml(relative(baseDir, batch.indexFile))}">index</a> <a href="${escapeHtml(relative(baseDir, batch.scorecardFile))}">scorecard</a></li>`,
    ).join('')}</ol></details>`
    : '';

  const card = (row: RowSummary) => {
    const prod = relative(baseDir, row.productionSvgFile);
    const app = relative(baseDir, row.app420SvgFile);
    const debug = relative(baseDir, row.debugSvgFile);
    const json = relative(baseDir, row.jsonFile);
    return `<article id="${escapeHtml(row.rowId)}" class="row-card" data-season="${row.season}" data-lake="${escapeHtml(row.lake)}" data-priority="${row.reviewPriority}" data-review="${row.signals.visualReviewNeeded ? '1' : '0'}" data-full-warning="${row.fullSizeRendererWarningCount > 0 ? '1' : '0'}" data-app-warning="${row.appWidthRendererWarningCount > 0 ? '1' : '0'}" data-app-height="${row.signals.appWidthViewBoxHeightOutlier ? '1' : '0'}" data-title-wrap="${row.fullTitleWrapCount > 0 || row.appTitleWrapCount > 0 ? '1' : '0'}" data-overlap-risk="${row.fullOverlapRiskCount > 0 || row.appOverlapRiskCount > 0 ? '1' : '0'}" data-zero="${row.displayedCount === 0 ? '1' : '0'}" data-retained="${row.retainedCount > 0 ? '1' : '0'}" data-repeated="${row.repeatedLegendTitleMaxCount >= 4 ? '1' : '0'}" data-point-dominance="${row.signals.pointDominance ? '1' : '0'}" data-semantic-mismatch="${row.semanticAnchorMismatchCount > 0 ? '1' : '0'}" data-slowest="${slowestIds.has(row.rowId) ? '1' : '0'}" data-major-axis="${row.majorAxisRankingFallbackCount > 0 ? '1' : '0'}">
      <header>
        <h3>${escapeHtml(row.lake)} <span>${escapeHtml(row.state)}/${escapeHtml(row.county)}</span></h3>
        <p>${escapeHtml(row.season)} ${escapeHtml(row.reviewDate)} | ${escapeHtml(row.supportStatus)} | displayed ${row.displayedCount} | retained ${row.retainedCount} | total ${Math.round(row.timing.totalMs)}ms | slowest ${escapeHtml(row.timing.slowestPhase)}</p>
        <p>priority: <strong>${escapeHtml(row.reviewPriority)}</strong> | reasons: ${escapeHtml(row.reviewPriorityReasons.join(';') || 'none')} | point dominance score ${row.pointDominanceScore} ${escapeHtml(row.pointDominanceReasons.join(';') || '')}</p>
        <p>legend wraps full/app: ${row.fullTitleWrapCount}/${row.appTitleWrapCount} | overlap risks full/app: ${row.fullOverlapRiskCount}/${row.appOverlapRiskCount} | app height ${row.appWidthSvgHeight}</p>
        <p class="flags">full warnings: ${escapeHtml(row.fullSizeRendererWarningCodes.join(', ') || 'none')} | app warnings: ${escapeHtml(row.appWidthRendererWarningCodes.join(', ') || 'none')} | flags: ${escapeHtml(row.majorQaFlags.join(', ') || 'none')}</p>
        <p class="links"><a href="${escapeHtml(prod)}">production SVG</a> <a href="${escapeHtml(app)}">app 420 SVG</a> <a href="${escapeHtml(debug)}">debug SVG</a> <a href="${escapeHtml(json)}">row JSON</a></p>
      </header>
      <div class="previews">
        <figure><figcaption>Full-size production</figcaption><img loading="lazy" src="${escapeHtml(prod)}" alt="${escapeHtml(row.lake)} ${escapeHtml(row.season)} production preview"></figure>
        <figure><figcaption>App-width 420</figcaption><img loading="lazy" src="${escapeHtml(app)}" alt="${escapeHtml(row.lake)} ${escapeHtml(row.season)} app-width preview"></figure>
      </div>
    </article>`;
  };

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; background: #f6f8fb; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    header.hero { position: sticky; top: 0; z-index: 2; background: #ffffff; border-bottom: 1px solid #dbe3ef; padding: 14px 18px; }
    h1 { margin: 0 0 6px; font-size: 20px; }
    h2 { margin: 24px 18px 10px; font-size: 16px; }
    h3 { margin: 0 0 4px; font-size: 15px; }
    h3 span, p, li span { color: #475569; font-weight: 500; }
    p { margin: 4px 0; font-size: 12px; line-height: 1.45; }
    a { color: #175a9c; font-weight: 700; text-decoration: none; }
    code { background: #e9eef6; border-radius: 4px; padding: 1px 5px; }
    .stats { display: flex; flex-wrap: wrap; gap: 8px; }
    .stat { background: #eef4fb; border: 1px solid #d7e2ef; border-radius: 6px; padding: 6px 8px; font-size: 12px; }
    .filters { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
    button { border: 1px solid #c7d2e1; background: #ffffff; border-radius: 6px; padding: 5px 8px; font-weight: 700; cursor: pointer; }
    .sections { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px; margin: 14px 18px; }
    details { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 8px; padding: 10px; }
    summary { cursor: pointer; font-weight: 800; font-size: 13px; }
    ol { margin: 8px 0 0 20px; padding: 0; font-size: 12px; }
    .season-block { margin: 0 18px 28px; }
    .row-card { background: #ffffff; border: 1px solid #dbe3ef; border-radius: 8px; padding: 12px; margin-bottom: 14px; }
    .row-card header { border-bottom: 1px solid #edf2f7; padding-bottom: 8px; margin-bottom: 10px; }
    .flags { color: #334155; }
    .links a { margin-right: 10px; }
    .previews { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; align-items: start; }
    figure { margin: 0; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; }
    figcaption { font-size: 12px; font-weight: 800; padding: 7px 9px; background: #eef4fb; border-bottom: 1px solid #e2e8f0; }
    img { display: block; width: 100%; height: 520px; object-fit: contain; background: #f8fafc; }
    .empty { color: #64748b; }
    .hidden { display: none; }
    @media (max-width: 900px) { .previews { grid-template-columns: 1fr; } img { height: 420px; } }
  </style>
</head>
<body>
  <header class="hero">
    <h1>${escapeHtml(title)}</h1>
    <div class="stats">
      ${scorecardLink}
      <div class="stat">manifest lakes: ${signals.manifestLakes}</div>
      <div class="stat">rows: ${signals.rowsGenerated}</div>
      <div class="stat">priority critical/high/medium/low: ${signals.reviewPriorityCounts.critical}/${signals.reviewPriorityCounts.high}/${signals.reviewPriorityCounts.medium}/${signals.reviewPriorityCounts.low}</div>
      <div class="stat">fallback/no-map: ${signals.fallbackNoMapRows}</div>
      <div class="stat">zero displayed: ${signals.zeroDisplayedZoneRows}</div>
      <div class="stat">full warnings: ${signals.fullSizeRendererWarningRows}</div>
      <div class="stat">app warnings: ${signals.appWidthRendererWarningRows}</div>
      <div class="stat">legend overlap risks: ${signals.fullOverlapRiskRows}/${signals.appOverlapRiskRows}</div>
      <div class="stat">retained pressure: ${signals.retainedDisplayCapPressureRows}</div>
      <div class="stat">major-axis fallback: ${signals.majorAxisRankingFallbackRows}</div>
      <div class="stat">actionable review: ${signals.actionableVisualReviewRows}</div>
    </div>
    <div class="filters">
      <button data-filter="all">All</button>
      ${SEASONS.map((season) => `<button data-filter="season:${season}">${season}</button>`).join('')}
      ${(['critical', 'high', 'medium', 'low'] as const).map((priority) => `<button data-filter="priority:${priority}">${priority}</button>`).join('')}
      ${lakes.map((lake) => `<button data-filter="lake:${escapeHtml(lake)}">${escapeHtml(lake)}</button>`).join('')}
      <button data-filter="review">Needs review</button>
      <button data-filter="title-wrap">Legend wraps</button>
      <button data-filter="overlap-risk">Overlap risks</button>
      <button data-filter="app-warning">App warnings</button>
      <button data-filter="app-height">App-height outliers</button>
      <button data-filter="zero">Zero/fallback</button>
      <button data-filter="retained">Retained pressure</button>
      <button data-filter="repeated">Repeated titles</button>
      <button data-filter="point-dominance">Point dominance</button>
      <button data-filter="semantic-mismatch">Semantic mismatch</button>
      <button data-filter="slowest">Slowest rows</button>
      <button data-filter="major-axis">Major-axis fallback</button>
    </div>
  </header>
  <section class="sections">
    ${batchLinksHtml}
    <details open><summary>Critical Priority (${priorityGroups.critical.length})</summary>${linkList(priorityGroups.critical)}</details>
    <details open><summary>High Priority (${priorityGroups.high.length})</summary>${linkList(priorityGroups.high)}</details>
    <details><summary>Medium Priority (${priorityGroups.medium.length})</summary>${linkList(priorityGroups.medium)}</details>
    <details><summary>Low Priority (${priorityGroups.low.length})</summary>${linkList(priorityGroups.low)}</details>
    ${lakes.map((lake) => `<details><summary>${escapeHtml(lake)} (${rows.filter((row) => row.lake === lake).length})</summary>${linkList(rows.filter((row) => row.lake === lake))}</details>`).join('\n')}
    <details><summary>Full Renderer Warnings (${fullWarnings.length})</summary>${linkList(fullWarnings)}</details>
    <details open><summary>Legend Title Wraps (${titleWraps.length})</summary>${linkList(titleWraps)}</details>
    <details open><summary>Legend Overlap Risks (${overlapRisks.length})</summary>${linkList(overlapRisks)}</details>
    <details open><summary>App-Width Warnings (${appWarnings.length})</summary>${linkList(appWarnings)}</details>
    <details open><summary>App-Height Outliers (${appHeightOutliers.length})</summary>${linkList(appHeightOutliers)}</details>
    <details><summary>Zero-Zone/Fallback Rows (${zeroOrFallback.length})</summary>${linkList(zeroOrFallback)}</details>
    <details open><summary>High Retained/Display-Cap Pressure (${retained.length})</summary>${linkList(retained)}</details>
    <details><summary>Repeated Legend Title >= 4 (${repeated.length})</summary>${linkList(repeated)}</details>
    <details open><summary>Point-Dominance Rows (${pointDominanceRows.length})</summary>${linkList(pointDominanceRows)}</details>
    <details open><summary>Semantic-Anchor Mismatch Rows (${semanticMismatchRows.length})</summary>${linkList(semanticMismatchRows)}</details>
    <details open><summary>Slowest Rows (${slowest.length})</summary>${linkList(slowest, 25)}</details>
    <details open><summary>Rows Needing Actionable Visual Review (${rowsNeedingReview.length})</summary>${linkList(rowsNeedingReview)}</details>
    <details><summary>Major-Axis Ranking Fallback (${majorAxis.length})</summary>${linkList(majorAxis)}</details>
  </section>
  ${SEASONS.map((season) => `<section class="season-block" data-season-block="${season}">
    <h2>${season[0]!.toUpperCase()}${season.slice(1)} (${seasonGroups[season].length})</h2>
    ${seasonGroups[season].map(card).join('\n')}
  </section>`).join('\n')}
  <script>
    const buttons = document.querySelectorAll('button[data-filter]');
    const cards = document.querySelectorAll('.row-card');
    buttons.forEach((button) => button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      cards.forEach((card) => {
        let show = true;
        if (filter && filter.startsWith('season:')) show = card.getAttribute('data-season') === filter.split(':')[1];
        if (filter && filter.startsWith('priority:')) show = card.getAttribute('data-priority') === filter.slice('priority:'.length);
        if (filter && filter.startsWith('lake:')) show = card.getAttribute('data-lake') === filter.slice('lake:'.length);
        if (filter === 'review') show = card.getAttribute('data-review') === '1';
        if (filter === 'full-warning') show = card.getAttribute('data-full-warning') === '1';
        if (filter === 'title-wrap') show = card.getAttribute('data-title-wrap') === '1';
        if (filter === 'overlap-risk') show = card.getAttribute('data-overlap-risk') === '1';
        if (filter === 'app-warning') show = card.getAttribute('data-app-warning') === '1';
        if (filter === 'app-height') show = card.getAttribute('data-app-height') === '1';
        if (filter === 'zero') show = card.getAttribute('data-zero') === '1';
        if (filter === 'retained') show = card.getAttribute('data-retained') === '1';
        if (filter === 'repeated') show = card.getAttribute('data-repeated') === '1';
        if (filter === 'point-dominance') show = card.getAttribute('data-point-dominance') === '1';
        if (filter === 'semantic-mismatch') show = card.getAttribute('data-semantic-mismatch') === '1';
        if (filter === 'slowest') show = card.getAttribute('data-slowest') === '1';
        if (filter === 'major-axis') show = card.getAttribute('data-major-axis') === '1';
        if (filter === 'all') show = true;
        card.classList.toggle('hidden', !show);
      });
    }));
  </script>
</body>
</html>
`;
}

function writeArtifactSet(params: {
  dir: string;
  rows: RowSummary[];
  rowJsonIndex: Array<{ rowId: string; jsonFile: string }>;
  legendLayouts: RowLegendLayoutDiagnostics[];
  featureEnvelopeSeasonSignatures?: FeatureEnvelopeSeasonSignature[];
  batch: RunBatch | string;
  runLabel: string;
  manifest: ManifestLake[];
  includeScorecard: boolean;
  batchLinks?: Array<{ label: string; indexes: number[]; indexFile: string; scorecardFile: string }>;
  reviewBatch?: { batchNumber: number; indexes: number[] } | null;
  sourceArtifactFallback?: { sourceRoot: string; reason: string } | null;
}) {
  mkdirSync(resolve(process.cwd(), params.dir), { recursive: true });
  const signals = aggregateSignals(params.rows);
  const abs = (file: string) => resolve(process.cwd(), file);
  const rowIds = new Set(params.rows.map((row) => row.rowId));
  const rowJsonIndex = params.rowJsonIndex.filter((entry) => rowIds.has(entry.rowId));
  const legendLayouts = params.legendLayouts.filter((layout) => rowIds.has(layout.rowId));
  const featureEnvelopeSeasonSignatures = (params.featureEnvelopeSeasonSignatures ?? []).filter((signature) => rowIds.has(signature.rowId));
  const featureEnvelopeSeasonAudit = buildFeatureEnvelopeSeasonAudit(featureEnvelopeSeasonSignatures);
  const scorecardFile = params.includeScorecard ? join(params.dir, 'manual-review-scorecard.csv') : null;

  writeFileSync(abs(join(params.dir, 'matrix-summary.csv')), summaryCsv(params.rows), 'utf8');
  if (scorecardFile) {
    writeFileSync(abs(scorecardFile), manualReviewScorecardCsv(params.rows), 'utf8');
  }
  writeFileSync(abs(join(params.dir, 'raw-diagnostics.json')), `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    runLabel: params.runLabel,
    batch: params.batch,
    reviewBatch: params.reviewBatch,
    sourceArtifactFallback: params.sourceArtifactFallback ?? null,
    artifactRoot: params.dir,
    fullManifestLakeCount: MANIFEST.length,
    selectedManifestIndexes: params.manifest.map((lake) => lake.index),
    manifest: params.manifest,
    stableDates: STABLE_DATES,
    allowUniversalFallback: false,
    appWidthMapWidth: APP_RENDERER_MAP_WIDTH,
    productionMapWidth: FULL_RENDERER_MAP_WIDTH,
    appViewBoxHeightOutlierThreshold: APP_VIEWBOX_HEIGHT_OUTLIER,
    signals,
    rows: params.rows,
    featureEnvelopeSeasonInvariance: {
      signatureCount: featureEnvelopeSeasonAudit.signatureCount,
      comparedFeatureCount: featureEnvelopeSeasonAudit.comparedFeatureCount,
      mismatchCount: featureEnvelopeSeasonAudit.mismatchCount,
    },
    legendLayout: legendLayoutDiagnosticsReport(params.rows, legendLayouts).summary,
    rowDiagnosticsFiles: rowJsonIndex,
    reviewBatches: params.batchLinks?.map((batch) => ({
      label: batch.label,
      indexes: batch.indexes,
      indexFile: batch.indexFile,
      scorecardFile: batch.scorecardFile,
    })) ?? [],
  }, null, 2)}\n`, 'utf8');
  writeFileSync(abs(join(params.dir, 'renderer-warning-details.json')), `${JSON.stringify(warningDetails(params.rows), null, 2)}\n`, 'utf8');
  writeFileSync(abs(join(params.dir, 'display-ranking-diagnostics.json')), `${JSON.stringify(displayRankingDiagnostics(params.rows), null, 2)}\n`, 'utf8');
  writeFileSync(abs(join(params.dir, 'retained-not-displayed-diagnostics.json')), `${JSON.stringify(retainedDiagnostics(params.rows), null, 2)}\n`, 'utf8');
  writeFileSync(abs(join(params.dir, 'legend-layout-diagnostics.json')), `${JSON.stringify(legendLayoutDiagnosticsReport(params.rows, legendLayouts), null, 2)}\n`, 'utf8');
  writeFileSync(abs(join(params.dir, 'performance-timings.json')), `${JSON.stringify(performanceTimings(params.rows), null, 2)}\n`, 'utf8');
  writeFileSync(abs(join(params.dir, 'placement-semantic-audit-spring.json')), `${JSON.stringify(placementSemanticAuditSpring(rowJsonIndex), null, 2)}\n`, 'utf8');
  writeFileSync(abs(join(params.dir, 'feature-envelope-season-invariance.json')), `${JSON.stringify(featureEnvelopeSeasonAudit, null, 2)}\n`, 'utf8');
  writeFileSync(abs(join(params.dir, 'feature-envelope-suppression-by-class-reason.json')), `${JSON.stringify(featureEnvelopeSuppressionByClassReasonReport(params.rows), null, 2)}\n`, 'utf8');
  writeFileSync(abs(join(params.dir, 'index.html')), htmlIndex(params.rows, {
    title: params.runLabel,
    baseDir: params.dir,
    scorecardFile,
    batchLinks: params.batchLinks,
  }), 'utf8');

  return {
    signals,
    artifacts: {
      htmlIndex: join(params.dir, 'index.html'),
      csvMatrix: join(params.dir, 'matrix-summary.csv'),
      manualReviewScorecard: scorecardFile,
      rawDiagnostics: join(params.dir, 'raw-diagnostics.json'),
      rendererWarningDetails: join(params.dir, 'renderer-warning-details.json'),
      displayRankingDiagnostics: join(params.dir, 'display-ranking-diagnostics.json'),
      retainedNotDisplayedDiagnostics: join(params.dir, 'retained-not-displayed-diagnostics.json'),
      legendLayoutDiagnostics: join(params.dir, 'legend-layout-diagnostics.json'),
      performanceTimings: join(params.dir, 'performance-timings.json'),
      placementSemanticAuditSpring: join(params.dir, 'placement-semantic-audit-spring.json'),
      featureEnvelopeSeasonInvariance: join(params.dir, 'feature-envelope-season-invariance.json'),
      featureEnvelopeSuppressionByClassReason: join(params.dir, 'feature-envelope-suppression-by-class-reason.json'),
      productionSvgDir: join(params.dir, PRODUCTION_DIR),
      app420SvgDir: join(params.dir, APP_420_DIR),
      debugSvgDir: join(params.dir, DEBUG_DIR),
      rowJsonDir: join(params.dir, ROW_JSON_DIR),
    },
  };
}

function writeReviewBatchArtifactSets(params: {
  rows: RowSummary[];
  rowJsonIndex: Array<{ rowId: string; jsonFile: string }>;
  legendLayouts: RowLegendLayoutDiagnostics[];
  featureEnvelopeSeasonSignatures?: FeatureEnvelopeSeasonSignature[];
  groups: ReviewBatchGroup[];
}) {
  const outputs = [];
  for (const group of params.groups) {
    const wanted = new Set(group.indexes);
    const rows = params.rows.filter((row) => wanted.has(row.manifestIndex));
    if (rows.length !== 40) throw new Error(`${group.label} expected 40 rows, generated ${rows.length}`);
    const manifest = MANIFEST.filter((lake) => wanted.has(lake.index));
    const output = writeArtifactSet({
      dir: group.dir,
      rows,
      rowJsonIndex: params.rowJsonIndex,
      legendLayouts: params.legendLayouts,
      featureEnvelopeSeasonSignatures: params.featureEnvelopeSeasonSignatures,
      batch: `review-ready-full/${group.label.toLowerCase().replace(/\s+/g, '-')}`,
      runLabel: `Water Reader Chunk 7M ${group.label}`,
      manifest,
      includeScorecard: true,
      reviewBatch: { batchNumber: group.batchNumber, indexes: group.indexes },
    });
    outputs.push({ ...group, artifacts: output.artifacts, signals: output.signals });
  }
  return outputs;
}

function isSupabaseReadUnavailable(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('Service for this project is restricted') ||
    message.includes('exceed_db_size_quota') ||
    message.includes('exceed_storage_size_quota');
}

function retargetRowFiles(row: RowSummary, targetRoot: string): Pick<RowSummary, 'productionSvgFile' | 'app420SvgFile' | 'debugSvgFile' | 'jsonFile'> {
  return {
    productionSvgFile: join(targetRoot, PRODUCTION_DIR, `${row.rowId}-production.svg`),
    app420SvgFile: join(targetRoot, APP_420_DIR, `${row.rowId}-app-420.svg`),
    debugSvgFile: join(targetRoot, DEBUG_DIR, `${row.rowId}-debug.svg`),
    jsonFile: join(targetRoot, ROW_JSON_DIR, `${row.rowId}.json`),
  };
}

function enrichRetargetedRowFromDiagnostics(sourceRow: RowSummary, targetRoot: string, rowDiagnostic: any): RowSummary {
  const files = retargetRowFiles(sourceRow, targetRoot);
  const displayedEntries = Array.isArray(rowDiagnostic?.display?.displayedEntries)
    ? rowDiagnostic.display.displayedEntries as Array<{ featureClasses: string[]; legend?: WaterReaderLegendEntry }>
    : [];
  const legendForbidden = Array.isArray(sourceRow.legendForbiddenHits)
    ? sourceRow.legendForbiddenHits
    : Array.isArray(rowDiagnostic?.legend?.forbiddenHits)
      ? rowDiagnostic.legend.forbiddenHits as string[]
      : [];
  const pointDominance = pointDominanceDiagnostics({
    displayedFeatureClassCounts: sourceRow.displayedFeatureClassCounts ?? {},
    retainedFeatureClassCounts: sourceRow.retainedFeatureClassCounts ?? {},
    displayedEntries,
    displayedCount: sourceRow.displayedCount,
  });
  const pointDominanceFlag = pointDominance.score >= 3;
  const priority = reviewPriorityDiagnostics({
    fallbackNoMap: Boolean(sourceRow.fallbackNoMap),
    displayedCount: sourceRow.displayedCount,
    retainedCount: sourceRow.retainedCount,
    fullRendererWarningCount: sourceRow.fullSizeRendererWarningCount,
    appRendererWarningCount: sourceRow.appWidthRendererWarningCount,
    appHeightOutlier: sourceRow.appWidthSvgHeight > APP_VIEWBOX_HEIGHT_OUTLIER,
    fullTitleWrapCount: sourceRow.fullTitleWrapCount,
    appTitleWrapCount: sourceRow.appTitleWrapCount,
    fullOverlapRiskCount: sourceRow.fullOverlapRiskCount,
    appOverlapRiskCount: sourceRow.appOverlapRiskCount,
    repeatedLegendTitleMaxCount: sourceRow.repeatedLegendTitleMaxCount,
    displayedFeatureClassCounts: sourceRow.displayedFeatureClassCounts ?? {},
    semanticAnchorMismatchCount: sourceRow.semanticAnchorMismatchCount,
    labelSemanticRiskCount: sourceRow.labelSemanticRiskCount,
    selectedFeatureSuppressionCount: sourceRow.selectedFeatureSuppressionCount,
    majorAxisRankingFallbackCount: sourceRow.majorAxisRankingFallbackCount,
    forbiddenCopyHits: legendForbidden,
  });
  const signals: RowSignals = {
    ...(sourceRow.signals ?? {}),
    fallbackNoMap: Boolean(sourceRow.fallbackNoMap),
    zeroDisplayedZones: sourceRow.displayedCount === 0,
    selectedFeatureSuppression: sourceRow.selectedFeatureSuppressionCount > 0,
    semanticAnchorMismatch: sourceRow.semanticAnchorMismatchCount > 0,
    labelSemanticRisk: sourceRow.labelSemanticRiskCount > 0,
    fullSizeRendererWarnings: sourceRow.fullSizeRendererWarningCount > 0,
    appWidthRendererWarnings: sourceRow.appWidthRendererWarningCount > 0,
    appWidthViewBoxHeightOutlier: sourceRow.appWidthSvgHeight > APP_VIEWBOX_HEIGHT_OUTLIER,
    retainedDisplayCapPressure: sourceRow.retainedCount > 0,
    repeatedLegendTitlePressure: sourceRow.repeatedLegendTitleMaxCount >= 4,
    fullLegendTitleWrap: sourceRow.fullTitleWrapCount > 0,
    appLegendTitleWrap: sourceRow.appTitleWrapCount > 0,
    fullLegendOverlapRisk: sourceRow.fullOverlapRiskCount > 0,
    appLegendOverlapRisk: sourceRow.appOverlapRiskCount > 0,
    pointDominance: pointDominanceFlag,
    majorAxisRankingFallback: sourceRow.majorAxisRankingFallbackCount > 0,
    visualReviewNeeded: priority.priority !== 'low' && hasActionableVisualReviewReason(priority.reasons),
  };
  const majorFlags = new Set(sourceRow.majorQaFlags ?? []);
  if (pointDominanceFlag) majorFlags.add('point_dominance_display_pressure');
  if (legendForbidden.length > 0) majorFlags.add('legend_forbidden_copy_hit');
  return {
    ...sourceRow,
    ...files,
    legendForbiddenHits: legendForbidden,
    pointDominanceScore: pointDominance.score,
    pointDominanceReasons: pointDominance.reasons,
    reviewPriority: priority.priority,
    reviewPriorityReasons: priority.reasons,
    majorQaFlags: [...majorFlags].sort((a, b) => a.localeCompare(b)),
    signals,
  };
}

function generateReviewReadyFromExistingFullMatrix(reason: string) {
  const sourceRoot = FULL_MATRIX_OUT_DIR;
  const sourceRawPath = join(sourceRoot, 'raw-diagnostics.json');
  const sourceLegendLayoutPath = join(sourceRoot, 'legend-layout-diagnostics.json');
  if (!existsSync(sourceRawPath)) throw new Error(`Cannot use local fallback; missing ${sourceRawPath}`);
  if (!existsSync(sourceLegendLayoutPath)) throw new Error(`Cannot use local fallback; missing ${sourceLegendLayoutPath}`);

  const sourceRaw = JSON.parse(readFileSync(resolve(process.cwd(), sourceRawPath), 'utf8')) as { rows?: RowSummary[] };
  const sourceLegendLayout = JSON.parse(readFileSync(resolve(process.cwd(), sourceLegendLayoutPath), 'utf8')) as {
    summary?: { fullOverlapRiskRows?: number; appOverlapRiskRows?: number };
    rows?: RowLegendLayoutDiagnostics[];
  };
  if ((sourceRaw.rows ?? []).length !== 200) {
    throw new Error(`Cannot use local fallback; expected 200 source rows in ${sourceRawPath}, found ${(sourceRaw.rows ?? []).length}`);
  }
  if ((sourceLegendLayout.summary?.fullOverlapRiskRows ?? 0) > 0 || (sourceLegendLayout.summary?.appOverlapRiskRows ?? 0) > 0) {
    throw new Error(`Cannot use local fallback; source ${sourceLegendLayoutPath} still reports legend overlap risks.`);
  }

  const absOut = resolve(process.cwd(), OUT_DIR);
  rmSync(absOut, { recursive: true, force: true });
  mkdirSync(join(absOut, PRODUCTION_DIR), { recursive: true });
  mkdirSync(join(absOut, APP_420_DIR), { recursive: true });
  mkdirSync(join(absOut, DEBUG_DIR), { recursive: true });
  mkdirSync(join(absOut, ROW_JSON_DIR), { recursive: true });

  const rows: RowSummary[] = [];
  const rowJsonIndex: Array<{ rowId: string; jsonFile: string }> = [];
  for (const sourceRow of sourceRaw.rows ?? []) {
    const sourceJsonText = readFileSync(resolve(process.cwd(), sourceRow.jsonFile), 'utf8');
    const rowDiagnostic = JSON.parse(sourceJsonText);
    const row = enrichRetargetedRowFromDiagnostics(sourceRow, OUT_DIR, rowDiagnostic);
    writeFileSync(resolve(process.cwd(), row.productionSvgFile), readFileSync(resolve(process.cwd(), sourceRow.productionSvgFile), 'utf8'), 'utf8');
    writeFileSync(resolve(process.cwd(), row.app420SvgFile), readFileSync(resolve(process.cwd(), sourceRow.app420SvgFile), 'utf8'), 'utf8');
    writeFileSync(resolve(process.cwd(), row.debugSvgFile), readFileSync(resolve(process.cwd(), sourceRow.debugSvgFile), 'utf8'), 'utf8');
    rowDiagnostic.row = row;
    writeFileSync(resolve(process.cwd(), row.jsonFile), `${JSON.stringify(rowDiagnostic, null, 2)}\n`, 'utf8');
    rows.push(row);
    rowJsonIndex.push({ rowId: row.rowId, jsonFile: row.jsonFile });
  }

  const layouts = (sourceLegendLayout.rows ?? []).map((layout) => {
    const row = rows.find((candidate) => candidate.rowId === layout.rowId);
    if (!row) throw new Error(`Cannot retarget legend layout row ${layout.rowId}; source row is missing.`);
    const files = retargetRowFiles(row, OUT_DIR);
    return {
      ...layout,
      productionSvgFile: files.productionSvgFile,
      app420SvgFile: files.app420SvgFile,
    };
  });
  const reviewGroups = reviewBatchGroups(OUT_DIR);
  const batchLinks = reviewGroups.map((group) => ({
    label: group.label,
    indexes: group.indexes,
    indexFile: join(group.dir, 'index.html'),
    scorecardFile: join(group.dir, 'manual-review-scorecard.csv'),
  }));
  const rootOutput = writeArtifactSet({
    dir: OUT_DIR,
    rows,
    rowJsonIndex,
    legendLayouts: layouts,
    batch: 'review-ready-full',
    runLabel: RUN_LABEL,
    manifest: MANIFEST,
    includeScorecard: true,
    batchLinks,
    sourceArtifactFallback: { sourceRoot, reason },
  });
  const batchOutputs = writeReviewBatchArtifactSets({
    rows,
    rowJsonIndex,
    legendLayouts: layouts,
    groups: reviewGroups,
  });
  console.log(JSON.stringify({
    ok: true,
    batch: 'review-ready-full',
    artifactRoot: OUT_DIR,
    sourceArtifactFallback: { sourceRoot, reason },
    manifestLakes: MANIFEST.length,
    seasons: SEASONS.length,
    rowsGenerated: rows.length,
    signals: rootOutput.signals,
    artifacts: rootOutput.artifacts,
    reviewBatches: batchOutputs.map((batch) => ({
      label: batch.label,
      indexes: batch.indexes,
      artifactRoot: batch.dir,
      htmlIndex: batch.artifacts.htmlIndex,
      manualReviewScorecard: batch.artifacts.manualReviewScorecard,
      rowsGenerated: batch.signals.rowsGenerated,
      reviewPriorityCounts: batch.signals.reviewPriorityCounts,
    })),
  }, null, 2));
}

async function main() {
  const options = parseCliOptions();
  OUT_DIR = outputRootForBatch(options.batch);
  RUN_LABEL = labelForBatch(options.batch);
  const runManifest = manifestForBatch(options.batch);
  assertManifest();
  try {
    await runFromEngine(options, runManifest);
  } catch (error) {
    if (options.batch === 'review-ready-full' && isSupabaseReadUnavailable(error)) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Read-only Supabase RPC unavailable; building review-ready shelf from existing repaired full-matrix artifacts. ${message}`);
      generateReviewReadyFromExistingFullMatrix(message);
      return;
    }
    throw error;
  }
}

async function runFromEngine(options: { batch: RunBatch }, runManifest: ManifestLake[]) {
  loadDotEnvIfPresent();
  const env = requireSupabaseEnv();
  const supabase = createClient(env.url, env.key, { auth: { persistSession: false } });
  const absOut = resolve(process.cwd(), OUT_DIR);
  rmSync(absOut, { recursive: true, force: true });
  mkdirSync(join(absOut, PRODUCTION_DIR), { recursive: true });
  mkdirSync(join(absOut, APP_420_DIR), { recursive: true });
  mkdirSync(join(absOut, DEBUG_DIR), { recursive: true });
  mkdirSync(join(absOut, ROW_JSON_DIR), { recursive: true });

  const rows: RowSummary[] = [];
  const rowJsonIndex: Array<{ rowId: string; jsonFile: string }> = [];
  const legendLayouts: RowLegendLayoutDiagnostics[] = [];
  const featureEnvelopeSeasonSignatureRows: FeatureEnvelopeSeasonSignature[] = [];
  const totalExpected = runManifest.length * SEASONS.length;
  let rowCounter = 0;

  for (const lake of runManifest) {
    for (const season of SEASONS) {
      rowCounter++;
      const rowStart = performance.now();
      const timing = createRowTimings();
      const rowId = rowIdFor(lake, season);
      const reviewDate = STABLE_DATES[lake.seasonGroup][season];
      const currentDate = dateFor(lake, season);

      const polygon = await timedAsync(timing, 'fetchMs', () => fetchPolygonByLakeId(supabase, lake));
      const geojson = polygon.geojson &&
        typeof polygon.geojson === 'object' &&
        'type' in polygon.geojson &&
        'coordinates' in polygon.geojson
        ? polygon.geojson as WaterbodyPolygonGeoJson
        : null;
      const input = {
        lakeId: lake.lakeId,
        name: polygon.name,
        state: polygon.state,
        acreage: polygon.area_acres,
        geojson,
        currentDate,
      };
      const preprocess = timed(timing, 'preprocessMs', () => preprocessWaterReaderGeometry(input));
      const features = timed(timing, 'featuresMs', () => detectWaterReaderFeatures(preprocess, input));
      const zoneResult = timed(timing, 'zonesMs', () => placeWaterReaderZones(preprocess, features, input, { allowUniversalFallback: false }));
      const legend = timed(timing, 'legendMs', () => buildWaterReaderLegend(zoneResult, { state: input.state, currentDate }));
      const displayModel = timed(timing, 'displayMs', () => buildWaterReaderDisplayModel(zoneResult, legend, {
        acreage: input.acreage,
        longestDimensionM: preprocess.metrics?.longestDimensionM,
        lakePolygon: preprocess.primaryPolygon,
      }));
      const productionSvgResult = timed(timing, 'renderMs', () => buildWaterReaderProductionSvg(displayModel, {
        lakePolygon: preprocess.primaryPolygon,
        title: polygon.name ?? lake.lake,
        subtitle: `${season} | ${lake.state}/${lake.county}`,
        mapWidth: FULL_RENDERER_MAP_WIDTH,
      }));
      const appWidthProductionSvgResult = timed(timing, 'renderMs', () => buildWaterReaderProductionSvg(displayModel, {
        lakePolygon: preprocess.primaryPolygon,
        title: polygon.name ?? lake.lake,
        subtitle: `${season} | ${lake.state}/${lake.county}`,
        mapWidth: APP_RENDERER_MAP_WIDTH,
      }));
      const debugSvg = timed(timing, 'renderMs', () => buildDebugSvg({
        lake,
        polygon,
        preprocess,
        features,
        zoneResult,
        displayModel,
        season,
      }));
      const forbiddenHits = legendForbiddenHits(legend);
      const repeatedLegend = maxRepeatedLegendTitle(displayModel.displayLegendEntries);
      const displayedFeatureClassCounts = entryValueCounts(displayModel.displayedEntries, 'featureClasses');
      const retainedFeatureClassCounts = entryValueCounts(displayModel.retainedEntries, 'featureClasses');
      const displayedPlacementKindCounts = entryValueCounts(displayModel.displayedEntries, 'placementKinds');
      const retainedPlacementKindCounts = entryValueCounts(displayModel.retainedEntries, 'placementKinds');
      const semanticMismatchCount = semanticAnchorMismatchCount(displayModel);
      const labelRiskCount = labelSemanticRiskCount(displayModel);
      const appHeight = appSvgHeight(appWidthProductionSvgResult);
      const fallback = fallbackMessage({ polygon, preprocess, displayModel });
      const selectedFeatureSuppressionCount = zoneResult.diagnostics.suppressedFeatureCount;
      const envelopeAudit = featureEnvelopeAudit(zoneResult);
      const majorAxisFallbackCount = rankingFallbackCount(displayModel);
      const fullCodes = rendererCodes(productionSvgResult);
      const appCodes = rendererCodes(appWidthProductionSvgResult);
      const fullLegendLayout = legendLayoutDiagnostics(productionSvgResult.svg);
      const appLegendLayout = legendLayoutDiagnostics(appWidthProductionSvgResult.svg);
      const pointDominance = pointDominanceDiagnostics({
        displayedFeatureClassCounts,
        retainedFeatureClassCounts,
        displayedEntries: displayModel.displayedEntries,
        displayedCount: displayModel.displayedEntries.length,
      });
      const pointDominanceFlag = pointDominance.score >= 3;
      const priority = reviewPriorityDiagnostics({
        fallbackNoMap: Boolean(fallback),
        displayedCount: displayModel.displayedEntries.length,
        retainedCount: displayModel.retainedEntries.length,
        fullRendererWarningCount: productionSvgResult.summary.warningCount,
        appRendererWarningCount: appWidthProductionSvgResult.summary.warningCount,
        appHeightOutlier: appHeight > APP_VIEWBOX_HEIGHT_OUTLIER,
        fullTitleWrapCount: fullLegendLayout.titleWrapCount,
        appTitleWrapCount: appLegendLayout.titleWrapCount,
        fullOverlapRiskCount: fullLegendLayout.overlapRiskCount,
        appOverlapRiskCount: appLegendLayout.overlapRiskCount,
        repeatedLegendTitleMaxCount: repeatedLegend.count,
        displayedFeatureClassCounts,
        semanticAnchorMismatchCount: semanticMismatchCount,
        labelSemanticRiskCount: labelRiskCount,
        selectedFeatureSuppressionCount,
        majorAxisRankingFallbackCount: majorAxisFallbackCount,
        forbiddenCopyHits: forbiddenHits,
      });
      const majorFlags = majorQaFlags({
        preprocess,
        zoneResult,
        legendForbiddenHits: forbiddenHits,
        productionSvgResult,
        appWidthProductionSvgResult,
        displayModel,
        appHeight,
        fullLegendLayout,
        appLegendLayout,
        pointDominance: pointDominanceFlag,
      });
      const signals: RowSignals = {
        fallbackNoMap: Boolean(fallback),
        zeroDisplayedZones: displayModel.displayedEntries.length === 0,
        selectedFeatureSuppression: selectedFeatureSuppressionCount > 0,
        semanticAnchorMismatch: semanticMismatchCount > 0,
        labelSemanticRisk: labelRiskCount > 0,
        fullSizeRendererWarnings: fullCodes.length > 0,
        appWidthRendererWarnings: appCodes.length > 0,
        appWidthViewBoxHeightOutlier: appHeight > APP_VIEWBOX_HEIGHT_OUTLIER,
        retainedDisplayCapPressure: displayModel.retainedEntries.some((entry) => !entry.rankingDiagnostics.includes('retained_constriction_line_readability')),
        repeatedLegendTitlePressure: repeatedLegend.count >= 4,
        fullLegendTitleWrap: fullLegendLayout.titleWrapCount > 0,
        appLegendTitleWrap: appLegendLayout.titleWrapCount > 0,
        fullLegendOverlapRisk: fullLegendLayout.overlapRiskCount > 0,
        appLegendOverlapRisk: appLegendLayout.overlapRiskCount > 0,
        pointDominance: pointDominanceFlag,
        majorAxisRankingFallback: majorAxisFallbackCount > 0,
        visualReviewNeeded: false,
      };
      signals.visualReviewNeeded = priority.priority !== 'low' && hasActionableVisualReviewReason(priority.reasons);

      const qaFlags = [...new Set([...(polygon.polygon_qa_flags ?? []), ...preprocess.qaFlags, ...zoneResult.qaFlags])].sort((a, b) => a.localeCompare(b));
      const productionSvgFile = join(OUT_DIR, PRODUCTION_DIR, `${rowId}-production.svg`);
      const app420SvgFile = join(OUT_DIR, APP_420_DIR, `${rowId}-app-420.svg`);
      const debugSvgFile = join(OUT_DIR, DEBUG_DIR, `${rowId}-debug.svg`);
      const jsonFile = join(OUT_DIR, ROW_JSON_DIR, `${rowId}.json`);
      const rowSummary: RowSummary = {
        rowId,
        manifestIndex: lake.index,
        lake: lake.lake,
        state: lake.state,
        county: lake.county,
        season,
        reviewDate,
        seasonGroup: lake.seasonGroup,
        lakeId: lake.lakeId,
        manifestSupport: lake.support,
        sourceSupportStatus: polygon.water_reader_support_status,
        engineSupportStatus: preprocess.supportStatus,
        supportStatus: fallback ? 'fallback_no_map' : preprocess.supportStatus,
        fallbackNoMap: signals.fallbackNoMap,
        fallbackMessage: fallback,
        detectedFeatureCount: zoneResult.diagnostics.detectedFeatureCount,
        selectedFeatureCount: zoneResult.diagnostics.selectedFeatureCount,
        suppressedFeatureCount: zoneResult.diagnostics.suppressedFeatureCount,
        detectedUnrepresentableFeatureCount: zoneResult.diagnostics.detectedUnrepresentableFeatureCount,
        featureEnvelopeZoneCount: envelopeAudit.featureEnvelopeZoneCount,
        nonEnvelopeLegacyZoneCount: envelopeAudit.nonEnvelopeLegacyZoneCount,
        selectedFeatureWithoutEnvelopeZoneCount: envelopeAudit.selectedFeatureWithoutEnvelopeZoneCount,
        featureEnvelopeSuppressionDiagnostics: envelopeAudit.featureEnvelopeSuppressionDiagnostics,
        featureEnvelopeSuppressionByFeatureClassReason: envelopeAudit.featureEnvelopeSuppressionByFeatureClassReason,
        featureEnvelopeUnrepresentableDiagnostics: envelopeAudit.featureEnvelopeUnrepresentableDiagnostics,
        featureEnvelopeUnrepresentableByFeatureClassReason: envelopeAudit.featureEnvelopeUnrepresentableByFeatureClassReason,
        wholeFeatureOutsideWaterCenterAcceptedCount: envelopeAudit.wholeFeatureOutsideWaterCenterAcceptedCount,
        wholeFeatureOutsideWaterCenterAcceptedByFeatureClass: envelopeAudit.wholeFeatureOutsideWaterCenterAcceptedByFeatureClass,
        wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM: envelopeAudit.wholeFeatureOutsideWaterCenterMaxVisibleWaterDistanceM,
        wholeFeatureOutsideWaterCenterMaxLocalityRadiusM: envelopeAudit.wholeFeatureOutsideWaterCenterMaxLocalityRadiusM,
        wholeFeatureOutsideWaterCenterMaxAnchorDistanceM: envelopeAudit.wholeFeatureOutsideWaterCenterMaxAnchorDistanceM,
        displayedEntryCount: displayModel.summary.displayedEntryCount,
        retainedEntryCount: displayModel.summary.retainedNotDisplayedCount,
        displayCap: displayModel.displayCap,
        displayCapPressure: displayModel.retainedEntries.some((entry) => !entry.rankingDiagnostics.includes('retained_constriction_line_readability')),
        repeatedLegendTitleMaxCount: repeatedLegend.count,
        repeatedLegendTitleMaxTitle: repeatedLegend.title,
        fullSizeRendererWarningCount: productionSvgResult.summary.warningCount,
        fullSizeRendererWarningCodes: fullCodes,
        appWidthRendererWarningCount: appWidthProductionSvgResult.summary.warningCount,
        appWidthRendererWarningCodes: appCodes,
        appWidthSvgViewBox: appWidthProductionSvgResult.summary.viewBox,
        appWidthSvgHeight: appHeight,
        fullTitleWrapCount: fullLegendLayout.titleWrapCount,
        appTitleWrapCount: appLegendLayout.titleWrapCount,
        fullOverlapRiskCount: fullLegendLayout.overlapRiskCount,
        appOverlapRiskCount: appLegendLayout.overlapRiskCount,
        qaFlags,
        majorQaFlags: majorFlags,
        selectedFeatureSuppressionCount,
        semanticAnchorMismatchCount: semanticMismatchCount,
        labelSemanticRiskCount: labelRiskCount,
        legendForbiddenHits: forbiddenHits,
        pointDominanceScore: pointDominance.score,
        pointDominanceReasons: pointDominance.reasons,
        reviewPriority: priority.priority,
        reviewPriorityReasons: priority.reasons,
        confluenceGroupCount: zoneResult.diagnostics.confluenceGroupCount,
        confluenceMemberZoneCount: zoneResult.diagnostics.confluenceGroups.reduce((sum, group) => sum + group.memberZoneIds.length, 0),
        renderedUnifiedConfluenceCount: productionSvgResult.summary.renderedUnifiedConfluenceCount ?? 0,
        stackedConfluenceMemberRenderCount: productionSvgResult.summary.stackedConfluenceMemberRenderCount ?? 0,
        appWidthRenderedUnifiedConfluenceCount: appWidthProductionSvgResult.summary.renderedUnifiedConfluenceCount ?? 0,
        appWidthStackedConfluenceMemberRenderCount: appWidthProductionSvgResult.summary.stackedConfluenceMemberRenderCount ?? 0,
        displayedFeatureClassCounts,
        retainedFeatureClassCounts,
        detectedFeatureClassCounts: featureClassCounts(features),
        retainedPlacementKindCounts,
        displayedPlacementKindCounts,
        displayedCount: displayModel.displayedEntries.length,
        retainedCount: displayModel.retainedEntries.length,
        majorAxisRankingFallbackCount: majorAxisFallbackCount,
        timing,
        productionSvgFile,
        app420SvgFile,
        debugSvgFile,
        jsonFile,
        signals,
      };

      timed(timing, 'writeMs', () => {
        writeFileSync(resolve(process.cwd(), productionSvgFile), productionSvgResult.svg, 'utf8');
        writeFileSync(resolve(process.cwd(), app420SvgFile), appWidthProductionSvgResult.svg, 'utf8');
        writeFileSync(resolve(process.cwd(), debugSvgFile), debugSvg, 'utf8');
      });
      finalizeTimings(timing, rowStart);
      timed(timing, 'writeMs', () => {
        writeFileSync(
          resolve(process.cwd(), jsonFile),
          `${JSON.stringify(rowDiagnostics({
            lake,
            polygon,
            rowSummary,
            currentDate,
            preprocess,
            features,
            zoneResult,
            legend,
            displayModel,
            productionSvgResult,
            appWidthProductionSvgResult,
            legendForbiddenHits: forbiddenHits,
            fullLegendLayout,
            appLegendLayout,
          }), null, 2)}\n`,
          'utf8',
        );
      });
      finalizeTimings(timing, rowStart);
      rows.push(rowSummary);
      featureEnvelopeSeasonSignatureRows.push(...featureEnvelopeSeasonSignatures({
        lake,
        rowId,
        season,
        zones: zoneResult.zones,
      }));
      rowJsonIndex.push({ rowId, jsonFile });
      legendLayouts.push({
        rowId,
        lake: lake.lake,
        state: lake.state,
        county: lake.county,
        season,
        fullTitleWrapCount: fullLegendLayout.titleWrapCount,
        appTitleWrapCount: appLegendLayout.titleWrapCount,
        fullOverlapRiskCount: fullLegendLayout.overlapRiskCount,
        appOverlapRiskCount: appLegendLayout.overlapRiskCount,
        productionSvgFile,
        app420SvgFile,
        fullEntries: fullLegendLayout.entries,
        appEntries: appLegendLayout.entries,
      });

      if (zoneResult.diagnostics.universalFallbackAllowed || zoneResult.diagnostics.universalFallbackApplied || (zoneCounts(zoneResult.zones).universal ?? 0) > 0) {
        throw new Error(`Universal fallback appeared in ${rowId}; this pass requires allowUniversalFallback:false`);
      }
      if (rowCounter % 10 === 0 || rowCounter === totalExpected) {
        console.log(JSON.stringify({ progress: `${rowCounter}/${totalExpected}`, latest: rowId, totalMs: rowSummary.timing.totalMs }));
      }
    }
  }

  if (rows.length !== totalExpected) throw new Error(`Expected ${totalExpected} rows, generated ${rows.length}`);

  const reviewGroups = options.batch === 'review-ready-full' ? reviewBatchGroups(OUT_DIR) : [];
  const batchLinks = reviewGroups.map((group) => ({
    label: group.label,
    indexes: group.indexes,
    indexFile: join(group.dir, 'index.html'),
    scorecardFile: join(group.dir, 'manual-review-scorecard.csv'),
  }));
  const rootOutput = writeArtifactSet({
    dir: OUT_DIR,
    rows,
    rowJsonIndex,
    legendLayouts,
    featureEnvelopeSeasonSignatures: featureEnvelopeSeasonSignatureRows,
    batch: options.batch,
    runLabel: RUN_LABEL,
    manifest: runManifest,
    includeScorecard: options.batch !== 'full',
    batchLinks,
  });
  const batchOutputs = options.batch === 'review-ready-full'
    ? writeReviewBatchArtifactSets({
      rows,
      rowJsonIndex,
      legendLayouts,
      featureEnvelopeSeasonSignatures: featureEnvelopeSeasonSignatureRows,
      groups: reviewGroups,
    })
    : [];

  console.log(JSON.stringify({
    ok: true,
    batch: options.batch,
    artifactRoot: OUT_DIR,
    manifestLakes: runManifest.length,
    seasons: SEASONS.length,
    rowsGenerated: rows.length,
    signals: rootOutput.signals,
    artifacts: rootOutput.artifacts,
    reviewBatches: batchOutputs.map((batch) => ({
      label: batch.label,
      indexes: batch.indexes,
      artifactRoot: batch.dir,
      htmlIndex: batch.artifacts.htmlIndex,
      manualReviewScorecard: batch.artifacts.manualReviewScorecard,
      rowsGenerated: batch.signals.rowsGenerated,
      reviewPriorityCounts: batch.signals.reviewPriorityCounts,
    })),
  }, null, 2));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
