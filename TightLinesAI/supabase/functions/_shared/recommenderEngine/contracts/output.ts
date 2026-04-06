import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { TimingStrength } from "../../howFishingEngine/contracts/tipsDaypart.ts";
import type { BehaviorOutput, PresentationOutput } from "./behavior.ts";
import type { LureFamilyId, FlyFamilyId } from "./families.ts";
import type { SpeciesGroup } from "./species.ts";
import type { WaterClarity } from "./input.ts";

export const RECOMMENDER_FEATURE = "recommender_v3" as const;

// ─── Ranked Family ────────────────────────────────────────────────────────────

export type RankedFamily = {
  family_id: LureFamilyId | FlyFamilyId;
  display_name: string;
  /** First lane or structure to start on. */
  where_to_start?: string;
  how_to_fish: string;
  color_guide: string;
  /** Ranks 2–3 only: how this pick differs from #1. */
  rank_context?: string;
};

// ─── Confidence ───────────────────────────────────────────────────────────────

export type RecommenderConfidenceTier = "high" | "medium" | "low";

export type RecommenderConfidence = {
  tier: RecommenderConfidenceTier;
  reasons: string[];
};

// ─── Response ─────────────────────────────────────────────────────────────────

export type RecommenderResponse = {
  feature: typeof RECOMMENDER_FEATURE;
  species: SpeciesGroup;
  context: EngineContext;
  water_clarity: WaterClarity;
  generated_at: string;
  cache_expires_at: string;
  behavior: BehaviorOutput;
  presentation: PresentationOutput;
  lure_rankings: RankedFamily[];  // top 3
  fly_rankings: RankedFamily[];   // top 3
  timing: {
    highlighted_periods: [boolean, boolean, boolean, boolean];
    timing_strength: TimingStrength;
  };
  confidence: RecommenderConfidence;
  /** Phase 6 target field: top-level guide summary for the overall pattern. */
  primary_pattern_summary?: string;
};
