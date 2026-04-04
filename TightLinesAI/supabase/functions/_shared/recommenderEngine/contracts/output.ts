import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { TimingStrength } from "../../howFishingEngine/contracts/tipsDaypart.ts";
import type { BehaviorOutput, PresentationOutput } from "./behavior.ts";
import type { LureFamilyId, FlyFamilyId } from "./families.ts";
import type { SpeciesGroup } from "./species.ts";
import type { WaterClarity } from "./input.ts";

export const RECOMMENDER_FEATURE = "recommender_v3" as const;

// ─── Ranked Family ────────────────────────────────────────────────────────────

export type RankedFamilyScoreBreakdown = {
  code: string;
  direction: "bonus" | "penalty";
  weight: number;
  detail: string;
};

export type RankedFamily = {
  family_id: LureFamilyId | FlyFamilyId;
  display_name: string;
  examples: string[];
  score: number;
  score_reasons: string[];
  score_breakdown?: RankedFamilyScoreBreakdown[];
  why_picked: string;
  /** Phase 6 target field: first lane or structure to start on. */
  where_to_start?: string;
  how_to_fish: string;
  best_when: string;
  color_guide: string;
  /** Phase 6 target field: deterministic backup adjustment if fish do not commit. */
  what_to_adjust_if_ignored?: string;
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
