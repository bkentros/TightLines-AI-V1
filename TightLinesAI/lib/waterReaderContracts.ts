/**
 * Water Reader V1 polygon/search contracts.
 * Keep aligned with `supabase/functions/_shared/waterReader/contracts.ts` for shared search fields.
 */

export const WATERBODY_SEARCH_FEATURE = "waterbody_search_v1" as const;

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
}

export interface WaterbodySearchResponse {
  feature: typeof WATERBODY_SEARCH_FEATURE;
  query: string;
  state?: string | null;
  results: WaterbodySearchResult[];
}
