/**
 * Canonical Water Reader backbone contracts mirror.
 * Keep aligned with `supabase/functions/_shared/waterReader/contracts.ts`.
 */

export const WATERBODY_SEARCH_FEATURE = "waterbody_search_v1" as const;

export type WaterbodyType = "lake" | "pond" | "reservoir";
export type WaterReaderSourceMode = "best_available" | "aerial" | "depth";
export type ResolvedWaterReaderSourceMode = "aerial" | "depth";
export type WaterReaderDataTier =
  | "full_depth_aerial"
  | "depth_only"
  | "aerial_only"
  | "chart_aligned_depth"
  | "polygon_only";
export type SourceReviewStatus = "unreviewed" | "allowed" | "restricted" | "blocked";
export type SourceFetchValidationStatus =
  | "unvalidated"
  | "reachable"
  | "unreachable"
  | "unsupported"
  | "blocked";
export type SourceLakeMatchStatus = "unknown" | "matched" | "ambiguous" | "mismatched";
export type SourceUsabilityStatus = "unknown" | "usable" | "needs_review" | "not_usable";
export type WaterbodyAvailabilityLabel =
  | "aerial_available"
  | "depth_available"
  | "both_available"
  | "limited"
  | "blocked";
export type WaterbodySourceStatus = "ready" | "partial" | "limited" | "blocked";
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
  dataTier: WaterReaderDataTier;
  aerialAvailable: boolean;
  depthAvailable: boolean;
  depthUsabilityStatus: "usable" | "needs_review" | "unavailable";
  availability: WaterbodyAvailabilityLabel;
  sourceStatus: WaterbodySourceStatus;
  bestAvailableMode: ResolvedWaterReaderSourceMode | null;
  confidence: WaterReaderConfidence;
}

export interface WaterbodySearchResponse {
  feature: typeof WATERBODY_SEARCH_FEATURE;
  query: string;
  state?: string | null;
  results: WaterbodySearchResult[];
}
