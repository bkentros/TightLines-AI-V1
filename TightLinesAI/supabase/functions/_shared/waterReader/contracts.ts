/**
 * Canonical Water Reader backbone contracts for the current identity/search
 * and availability phase. Keep the app mirror in `lib/waterReaderContracts.ts`
 * aligned with this file.
 */

export const WATERBODY_SEARCH_FEATURE = "waterbody_search_v1" as const;
export const WATERBODY_POLYGON_FEATURE = "waterbody_polygon_v1" as const;
export const WATERBODY_AERIAL_TILE_PLAN_FEATURE = "waterbody_aerial_tile_plan_v1" as const;
/** Transient RPC-backed geometry candidate hints (`plan_waterbody_aerial_geometry_candidates`) — no polygons in payload. */
export const WATERBODY_AERIAL_GEOMETRY_CANDIDATES_FEATURE =
  "waterbody_aerial_geometry_candidates_v1" as const;
export const WATERBODY_SOURCE_VALIDATION_FEATURE = "waterbody_source_validation_v1" as const;

/** POST body scope for `waterbody-source-validation` (internal key). Defaults to lake link validation when omitted. */
export const WATERBODY_SOURCE_VALIDATION_BODY_SCOPES = [
  "lake_links",
  "aerial_provider_policy",
] as const;
export type WaterbodySourceValidationBodyScope =
  (typeof WATERBODY_SOURCE_VALIDATION_BODY_SCOPES)[number];

export const WATERBODY_TYPES = ["lake", "pond", "reservoir"] as const;
export type WaterbodyType = (typeof WATERBODY_TYPES)[number];

export const WATER_READER_SOURCE_MODES = ["best_available", "aerial", "depth"] as const;
export type WaterReaderSourceMode = (typeof WATER_READER_SOURCE_MODES)[number];

export type ResolvedWaterReaderSourceMode = Exclude<WaterReaderSourceMode, "best_available">;

export const WATER_READER_DATA_TIERS = [
  "full_depth_aerial",
  "depth_only",
  "aerial_only",
  "chart_aligned_depth",
  "polygon_only",
] as const;
export type WaterReaderDataTier = (typeof WATER_READER_DATA_TIERS)[number];

export const SOURCE_REVIEW_STATUSES = [
  "unreviewed",
  "allowed",
  "restricted",
  "blocked",
] as const;
export type SourceReviewStatus = (typeof SOURCE_REVIEW_STATUSES)[number];

export const SOURCE_FETCH_VALIDATION_STATUSES = [
  "unvalidated",
  "reachable",
  "unreachable",
  "unsupported",
  "blocked",
] as const;
export type SourceFetchValidationStatus = (typeof SOURCE_FETCH_VALIDATION_STATUSES)[number];

export const SOURCE_LAKE_MATCH_STATUSES = [
  "unknown",
  "matched",
  "ambiguous",
  "mismatched",
] as const;
export type SourceLakeMatchStatus = (typeof SOURCE_LAKE_MATCH_STATUSES)[number];

export const SOURCE_USABILITY_STATUSES = [
  "unknown",
  "usable",
  "needs_review",
  "not_usable",
] as const;
export type SourceUsabilityStatus = (typeof SOURCE_USABILITY_STATUSES)[number];

export const WATERBODY_AVAILABILITY_LABELS = [
  "aerial_available",
  "depth_available",
  "both_available",
  "limited",
  "blocked",
] as const;
export type WaterbodyAvailabilityLabel = (typeof WATERBODY_AVAILABILITY_LABELS)[number];

export const WATERBODY_SOURCE_STATUS_VALUES = ["ready", "partial", "limited", "blocked"] as const;
export type WaterbodySourceStatus = (typeof WATERBODY_SOURCE_STATUS_VALUES)[number];

export type WaterReaderConfidence = "high" | "medium" | "low";
export type WaterbodySourceDepthKind = "machine_readable" | "chart_image" | "none";
export type WaterbodySourceApprovalStatus = "approved" | "pending_review" | "rejected";
export type WaterbodySourcePathType =
  | "service_root"
  | "feature_query"
  | "download"
  | "document"
  | "image";
export type SourceValidationRequestMethod = "head" | "get";
export type SourceValidationScope = "source_path" | "provider_health";

export interface WaterbodyPreviewBbox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

export type AerialTilePlanLabel =
  | "shoreline_candidate"
  | "inlet_outlet_candidate"
  | "narrow_arm_candidate"
  | "open_water_context";

export interface AerialTilePlanTile {
  id: number;
  bbox: WaterbodyPreviewBbox;
  priority: number;
  label: AerialTilePlanLabel;
  waterFraction?: number;
  shorelineScore?: number;
}

export interface AerialTilePlan {
  contextBbox: WaterbodyPreviewBbox;
  tiles: AerialTilePlanTile[];
  source: "serverGeometry";
  maxCloseTiles: number;
  prototypeOnly: true;
}

export interface AerialTilePlanResponse {
  feature: typeof WATERBODY_AERIAL_TILE_PLAN_FEATURE;
  lakeId: string;
  plan: AerialTilePlan | null;
}

/** Matches `public.plan_waterbody_aerial_geometry_candidates` surface — polygon geometry never included. */
export type AerialGeometryCandidateFeatureTag =
  | "shoreline_complexity"
  | "coverage_distribution";

export type AerialGeometryCandidateSource = "geometry_candidate";

/** Narrow codes emitted by the geometry-candidates RPC for Water Reader overlays (contract-aligned). */
export type AerialGeometryCandidateReasonCode =
  | "shoreline_area_geometry_context"
  | "map_region_callout";

export interface WaterbodyAerialGeometryCandidateRow {
  lakeId: string;
  name: string;
  state: string;
  county: string | null;
  waterbodyType: WaterbodyType;
  contextBbox: WaterbodyPreviewBbox;
  candidateId: number;
  featureTag: AerialGeometryCandidateFeatureTag;
  candidateSource: AerialGeometryCandidateSource;
  reasonCode: AerialGeometryCandidateReasonCode;
  anchorLon: number;
  anchorLat: number;
  normalizedAnchorX: number;
  normalizedAnchorY: number;
  overlayX: number;
  overlayY: number;
  overlayW: number;
  overlayH: number;
  baseScore: number;
  /** QA flags/counts from SQL (`geometry_qa` jsonb); opaque metadata only. */
  geometryQa: Record<string, unknown>;
  requestedMonth: number | null;
}

export interface WaterbodyAerialGeometryCandidatesResponse {
  feature: typeof WATERBODY_AERIAL_GEOMETRY_CANDIDATES_FEATURE;
  lakeId: string;
  month: number | null;
  maxZones: number;
  candidates: WaterbodyAerialGeometryCandidateRow[];
}

export interface WaterbodyGeometryBackbone {
  type: "MultiPolygon";
  coordinates: number[][][][];
}

export interface WaterbodyIdentity {
  lakeId: string;
  canonicalName: string;
  normalizedName: string;
  state: string;
  county?: string | null;
  waterbodyType: WaterbodyType;
  region?: string | null;
  centroid: {
    lat: number;
    lon: number;
  };
  geometry?: WaterbodyGeometryBackbone | null;
  externalSource?: string | null;
  externalId?: string | null;
}

export interface WaterbodyAvailability {
  lakeId: string;
  canonicalName: string;
  state: string;
  county?: string | null;
  dataTier: WaterReaderDataTier;
  aerialAvailable: boolean;
  depthMachineReadableAvailable: boolean;
  depthChartImageAvailable: boolean;
  bothAvailable: boolean;
  availableSourceModes: ResolvedWaterReaderSourceMode[];
  bestAvailableMode: ResolvedWaterReaderSourceMode | null;
  sourceStatus: WaterbodySourceStatus;
  availability: WaterbodyAvailabilityLabel;
  confidence: WaterReaderConfidence;
  confidenceReasons: string[];
}

export type WaterReaderPolygonSupportStatus =
  | "supported"
  | "limited"
  | "needs_review"
  | "not_supported";

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
  /** Preview framing only. Final analysis/overlays must use true waterbody geometry. */
  previewBbox?: WaterbodyPreviewBbox | null;
  dataTier: WaterReaderDataTier;
  aerialAvailable: boolean;
  depthAvailable: boolean;
  depthUsabilityStatus: "usable" | "needs_review" | "unavailable";
  availability: WaterbodyAvailabilityLabel;
  sourceStatus: WaterbodySourceStatus;
  bestAvailableMode: ResolvedWaterReaderSourceMode | null;
  confidence: WaterReaderConfidence;
  /** Polygon V1: derived from `waterbody_index.geometry` only (not aerial/depth). */
  waterReaderSupportStatus: WaterReaderPolygonSupportStatus;
  waterReaderSupportReason: string;
  hasPolygonGeometry: boolean;
  polygonAreaAcres?: number | null;
  polygonQaFlags: string[];
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

export interface ReviewedSourcePath {
  linkId: string;
  lakeId: string;
  sourceId: string;
  providerName: string;
  sourceMode: ResolvedWaterReaderSourceMode;
  depthSourceKind: WaterbodySourceDepthKind;
  sourcePath: string;
  sourcePathType: WaterbodySourcePathType;
  approvalStatus: WaterbodySourceApprovalStatus;
  reviewStatus: SourceReviewStatus;
  canFetch: boolean;
  lakeMatchStatus: SourceLakeMatchStatus;
  usabilityStatus: SourceUsabilityStatus;
  providerHealthUrl?: string | null;
}

export interface WaterbodySourceFetchValidationResult {
  linkId: string;
  lakeId: string;
  sourceMode: ResolvedWaterReaderSourceMode;
  depthSourceKind: WaterbodySourceDepthKind;
  status: SourceFetchValidationStatus;
  checkedAtISO: string;
  scope: "source_path";
  requestMethod: SourceValidationRequestMethod;
  targetUrl: string;
  httpStatus?: number | null;
  error?: string | null;
  sourcePath: string;
  providerName: string;
}

export interface SourceProviderHealthValidationResult {
  sourceId: string;
  providerName: string;
  providerHealthUrl: string;
  status: SourceFetchValidationStatus;
  checkedAtISO: string;
  scope: "provider_health";
  requestMethod: SourceValidationRequestMethod;
  httpStatus?: number | null;
  error?: string | null;
}

export interface WaterbodySourceValidationResponse {
  feature: typeof WATERBODY_SOURCE_VALIDATION_FEATURE;
  lakeId: string;
  results: WaterbodySourceFetchValidationResult[];
}

/** Response when `validationScope: "aerial_provider_policy"` (no lakeId). */
export interface AerialProviderPolicyValidationResponse {
  feature: typeof WATERBODY_SOURCE_VALIDATION_FEATURE;
  validationScope: "aerial_provider_policy";
  policyKey: string;
  policyId: string;
  result: SourceProviderHealthValidationResult;
}

export function isWaterbodyType(value: string): value is WaterbodyType {
  return (WATERBODY_TYPES as readonly string[]).includes(value);
}

export function isResolvedWaterReaderSourceMode(
  value: string,
): value is ResolvedWaterReaderSourceMode {
  return value === "aerial" || value === "depth";
}

export function isWaterbodySourceValidationBodyScope(
  value: string,
): value is WaterbodySourceValidationBodyScope {
  return (WATERBODY_SOURCE_VALIDATION_BODY_SCOPES as readonly string[]).includes(value);
}
