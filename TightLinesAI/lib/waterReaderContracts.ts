/**
 * Water Reader V1 polygon/search contracts.
 * Keep aligned with `supabase/functions/_shared/waterReader/contracts.ts` for shared search fields.
 */

export const WATERBODY_SEARCH_FEATURE = "waterbody_search_v1" as const;
export const WATERBODY_POLYGON_FEATURE = "waterbody_polygon_v1" as const;
export const WATER_READER_READ_FEATURE = "water_reader_read_v1" as const;

export type WaterbodyType = "lake" | "pond" | "reservoir";
export type WaterReaderDataTier = "polygon_only";
export type WaterbodyAvailabilityLabel = "polygon_available" | "limited" | "blocked";
export type WaterbodySourceStatus = "ready" | "partial" | "limited" | "blocked";
export type WaterReaderConfidence = "medium" | "low";

export interface WaterbodyPreviewBbox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

export type WaterReaderPolygonSupportStatus =
  | "supported"
  | "limited"
  | "needs_review"
  | "not_supported";

export type WaterReaderEngineSupportStatus = WaterReaderPolygonSupportStatus;

export interface WaterbodySearchResult {
  lakeId: string;
  name: string;
  state: string;
  county?: string | null;
  waterbodyType: WaterbodyType;
  surfaceAreaAcres?: number | null;
  centroid: {
    lat: number;
    lon: number;
  };
  /** Preview framing only. Final analysis/overlays must use true stored waterbody polygon geometry. */
  previewBbox?: WaterbodyPreviewBbox | null;
  dataTier: WaterReaderDataTier | string;
  depthAvailable?: boolean;
  depthUsabilityStatus?: "usable" | "needs_review" | "unavailable";
  availability: WaterbodyAvailabilityLabel | string;
  sourceStatus: WaterbodySourceStatus;
  bestAvailableMode?: string | null;
  confidence: WaterReaderConfidence | string;
  /** Polygon V1: derived from `waterbody_index.geometry` only (not aerial/depth). */
  waterReaderSupportStatus: WaterReaderPolygonSupportStatus;
  waterReaderSupportReason: string;
  hasPolygonGeometry: boolean;
  polygonAreaAcres?: number | null;
  polygonQaFlags: string[];
  sameNameStateCandidateCount?: number;
  isAmbiguousNameInState?: boolean;
}

export interface WaterbodySearchResponse {
  feature: typeof WATERBODY_SEARCH_FEATURE;
  query: string;
  state?: string | null;
  results: WaterbodySearchResult[];
}

export interface WaterbodyPolygonGeoJson {
  type: "Polygon" | "MultiPolygon";
  coordinates: unknown;
}

export type WaterReaderGeometryFeatureClass =
  | 'shoreline_point'
  | 'shoreline_bend'
  | 'long_bank'
  | 'pocket_edge'
  | 'neckdown';

/**
 * Shoreline-local frame for map patches (internal geometry only; never show lon/lat in UI).
 */
export interface WaterReaderDisplayPatch {
  shoreLon: number;
  shoreLat: number;
  /** Unit along-shore step in deg-equivalent (paired with patchAlongDeg). */
  alongDLon: number;
  alongDLat: number;
  /** Unit toward interior in deg-equivalent (paired with patchInwardDeg). */
  inwardDLon: number;
  inwardDLat: number;
  patchAlongDeg: number;
  patchInwardDeg: number;
}

/** Opposing shoreline endpoints for a neck pinch (geometry-only; not shown as GPS in UI). */
export interface WaterReaderNeckCorridor {
  shoreALon: number;
  shoreALat: number;
  shoreBLon: number;
  shoreBLat: number;
}

export interface WaterReaderNeckMetrics {
  relDiag: number;
  lobeContrast: number;
  pinchToMedian: number;
}

/**
 * Local shoreline ribbon window on the primary open exterior ring (detector-local indices).
 * Layout prefers ringCenter + halfSpan so the sampled arc is unambiguous around the cue.
 */
export interface WaterReaderShoreRibbonArc {
  /** Full-ring vertex index at the cue (center of the ribbon window). */
  ringCenter: number;
  /** Half-span in full-ring steps; sampled arc has 2*halfSpan+1 vertices along forward wrap. */
  halfSpan: number;
  /** Inclusive endpoints (center ± halfSpan, mod ring length); redundant with center/halfSpan. */
  ringFrom: number;
  ringTo: number;
}

/**
 * Prototype shoreline-shape cue from polygon geometry only (V1). Not fishing advice.
 */
export interface WaterReaderGeometryCandidate {
  candidateId: number;
  rank: number;
  featureClass: WaterReaderGeometryFeatureClass;
  featureLabel: string;
  anchorLon: number;
  anchorLat: number;
  displayPatch: WaterReaderDisplayPatch;
  zoneFillRgba: string;
  zoneStrokeRgba: string;
  /** Short arc on the primary exterior ring for shoreline-following ribbons (non-neck). */
  shoreRibbonArc?: WaterReaderShoreRibbonArc;
  /** When featureClass is neckdown: pinch line on the primary ring for corridor rendering. */
  neckCorridor?: WaterReaderNeckCorridor;
  /** Detector neck quality metrics (layout gating). */
  neckMetrics?: WaterReaderNeckMetrics;
  /** 0–1 within hydrography bbox (display aid; not a GPS claim). */
  normX: number;
  normY: number;
  /** Short geometry-only reason this cue was flagged. */
  identifiedBecause: string;
  /** Short generic on-water approach (not a spot or depth claim). */
  howToFishIt: string;
  /** Dev/QA summaries only — omit from UI; no coordinates. */
  diagnosticSummary?: string;
  qaFlags: string[];
}

export interface WaterbodyPolygonResponse {
  feature: typeof WATERBODY_POLYGON_FEATURE;
  lakeId: string;
  name: string;
  state: string;
  county?: string | null;
  waterbodyType: WaterbodyType;
  centroid: {
    lat: number;
    lon: number;
  };
  bbox: WaterbodyPreviewBbox | null;
  areaSqM?: number | null;
  areaAcres?: number | null;
  perimeterM?: number | null;
  geojson: WaterbodyPolygonGeoJson | null;
  sourceDataset?: string | null;
  sourceFeatureId?: string | null;
  sourceSummary?: Record<string, unknown> | null;
  geometryIsValid: boolean;
  geometryValidityDetail?: string | null;
  componentCount: number;
  interiorRingCount: number;
  waterReaderSupportStatus: WaterReaderPolygonSupportStatus;
  waterReaderSupportReason: string;
  polygonQaFlags: string[];
}

export type WaterReaderRenderWarningCode =
  | "missing_lake_polygon"
  | "invalid_geometry"
  | "missing_zone_path"
  | "missing_label_anchor"
  | "display_legend_count_mismatch"
  | "long_label_leader"
  | "legend_overflow_risk";

export interface WaterReaderRenderWarning {
  code: WaterReaderRenderWarningCode;
  message: string;
  entryId?: string;
  zoneId?: string;
}

export interface WaterReaderRenderSummary {
  displayedEntryCount: number;
  renderedNumberCount: number;
  calloutLabelCount: number;
  renderedStandaloneCount: number;
  renderedConfluenceCount: number;
  renderedUnifiedConfluenceCount?: number;
  stackedConfluenceMemberRenderCount?: number;
  displayLegendEntryCount: number;
  retainedRenderedCount: number;
  warningCount: number;
  maxLabelLeaderLengthPx?: number;
  longLabelLeaderCount?: number;
  mapBottomY: number;
  firstLegendRowY: number;
  mapLegendGap: number;
  width: number;
  height: number;
  viewBox: string;
}

export type WaterReaderProductionSvgFeatureClass =
  | "main_lake_point"
  | "secondary_point"
  | "cove"
  | "neck"
  | "island"
  | "saddle"
  | "dam"
  | "universal"
  | "structure_confluence";

export interface WaterReaderProductionSvgLegendEntry {
  number?: number;
  title: string;
  body: string;
  colorHex: string;
  featureClass: WaterReaderProductionSvgFeatureClass;
  placementKind?: string;
  placementKinds: string[];
  zoneId: string;
  zoneIds: string[];
  transitionWarning?: string;
  isConfluence?: boolean;
}

export interface WaterReaderProductionSvgResult {
  svg: string;
  warnings: WaterReaderRenderWarning[];
  summary: WaterReaderRenderSummary;
  legendEntries: WaterReaderProductionSvgLegendEntry[];
}

export interface WaterReaderReadRequest {
  lakeId: string;
  currentDate?: string;
}

export interface WaterReaderReadTimingDiagnostics {
  fetchMs: number;
  cacheMs?: number;
  preprocessMs: number;
  featuresMs: number;
  zonesMs: number;
  legendMs: number;
  displayMs: number;
  renderMs: number;
  totalMs: number;
}

export interface WaterReaderReadOperationalDiagnostics {
  code: string;
  message: string;
  heavyGenerationStatus?: "not_configured" | "failed" | "timeout" | "routed" | "not_heavy";
  heavyGenerationReason?: string | null;
  workerHttpStatus?: number | null;
  workerElapsedMs?: number | null;
  runtimeGeoJsonBytes?: number | null;
  originalVertexCount?: number | null;
  runtimeVertexCount?: number | null;
}

export interface WaterReaderReadResponse {
  feature: typeof WATER_READER_READ_FEATURE;
  lakeId: string;
  name: string;
  state: string;
  county?: string | null;
  waterbodyType: WaterbodyType | string;
  centroid: {
    lat: number;
    lon: number;
  };
  bbox: WaterbodyPreviewBbox | null;
  areaSqM?: number | null;
  areaAcres?: number | null;
  perimeterM?: number | null;
  geometryIsValid: boolean;
  geometryValidityDetail?: string | null;
  componentCount: number;
  interiorRingCount: number;
  waterReaderSupportStatus: WaterReaderPolygonSupportStatus;
  waterReaderSupportReason: string;
  polygonQaFlags: string[];
  originalVertexCount?: number | null;
  runtimeVertexCount?: number | null;
  runtimeComponentCount?: number | null;
  runtimeInteriorRingCount?: number | null;
  runtimeSimplified?: boolean | null;
  runtimeSimplificationTolerance?: number | null;
  engineSupportStatus: WaterReaderEngineSupportStatus;
  engineSupportReason: string;
  displayedEntryCount: number;
  retainedEntryCount: number;
  rendererWarningCount: number;
  season: string;
  seasonGroup?: string | null;
  productionSvgResult: WaterReaderProductionSvgResult | null;
  fallbackMessage: string | null;
  cacheStatus?: "hit" | "miss";
  cacheWriteStatus?: "stored" | "failed" | "skipped";
  cacheWriteError?: string | null;
  operationalDiagnostics?: WaterReaderReadOperationalDiagnostics | null;
  seasonContextKey?: string;
  mapWidth?: number;
  engineVersion?: string;
  timings?: WaterReaderReadTimingDiagnostics;
}
