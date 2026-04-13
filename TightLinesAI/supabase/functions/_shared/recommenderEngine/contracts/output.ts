import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { BehaviorOutput, PresentationOutput } from "./behavior.ts";
import type { LureFamilyId, FlyFamilyId } from "./families.ts";
import type { SpeciesGroup } from "./species.ts";
import type { WaterClarity } from "./input.ts";
import type {
  DailyPostureBandV3,
  ResolvedWaterColumnV3,
  SeasonalLocationV3,
  SeasonalWaterColumnV3,
} from "../v3/contracts.ts";

export const RECOMMENDER_FEATURE = "recommender_v3" as const;

// ─── Ranked Family ────────────────────────────────────────────────────────────

export type RankedFamily = {
  family_id: LureFamilyId | FlyFamilyId;
  display_name: string;
  how_to_fish: string;
  /** Ranks 2–3 only: how this pick differs from #1. */
  rank_context?: string;
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
  daily_posture_band: DailyPostureBandV3;
  typical_seasonal_water_column: SeasonalWaterColumnV3;
  likely_water_column_today: ResolvedWaterColumnV3;
  typical_seasonal_location: SeasonalLocationV3;
  /** Single condition-driven color direction for the session. */
  color_of_day: string;
  /** Phase 6 target field: top-level guide summary for the overall pattern. */
  primary_pattern_summary?: string;
};
