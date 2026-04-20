import type { EngineContext } from "../../../howFishingEngine/contracts/context.ts";
import type { RecommenderV4Species } from "../contracts.ts";

export const RECOMMENDER_V4_DIAG_PREFIX = "[recommender_v4_diag]";

export type RecommenderV4DiagEvent =
  | "headline_fallback"
  | "pool_undersized"
  | "pace_relaxed"
  | "column_relaxed"
  | "family_redundancy_relaxed"
  | "wind_missing"
  | "surface_cap_fired";

export type RecommenderV4DiagPayload = {
  event: RecommenderV4DiagEvent;
  variant: string | null;
  species: RecommenderV4Species;
  region_key: string;
  month: number;
  water_type: EngineContext;
  context?: Record<string, unknown>;
};

export type RecommenderV4DiagWriter = (payload: RecommenderV4DiagPayload) => void;

export function formatRecommenderV4DiagLine(payload: RecommenderV4DiagPayload): string {
  return `${RECOMMENDER_V4_DIAG_PREFIX} ${JSON.stringify(payload)}`;
}

export function createConsoleDiagWriter(): RecommenderV4DiagWriter {
  return (payload) => {
    console.warn(formatRecommenderV4DiagLine(payload));
  };
}

export function createCollectingDiagWriter(
  out: RecommenderV4DiagPayload[],
): RecommenderV4DiagWriter {
  return (payload) => {
    out.push(payload);
  };
}

export function createNoopDiagWriter(): RecommenderV4DiagWriter {
  return () => {};
}
