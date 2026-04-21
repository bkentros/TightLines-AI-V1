import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { SpeciesGroup } from "./species.ts";
import type { WaterClarity } from "./input.ts";
import type {
  DailyPostureBandV3,
  DailySurfaceWindowV3,
  ForageBucketV3,
  OpportunityMixModeV3,
  TacticalColumnV3,
  TacticalPaceV3,
  TacticalPresenceV3,
} from "../v3/contracts.ts";

/** Active production feature id (deterministic rebuild engine). */
export const RECOMMENDER_FEATURE = "recommender_rebuild" as const;

/** Legacy id still accepted for cache validation; v3-only scripts may surface this id. */
export type RecommenderFeatureId =
  | typeof RECOMMENDER_FEATURE
  | "recommender_v3";

export type RankedRecommendation = {
  id: string;
  display_name: string;
  family_group: string;
  color_style: string;
  why_chosen: string;
  how_to_fish: string;
  primary_column: TacticalColumnV3;
  pace: TacticalPaceV3;
  presence: TacticalPresenceV3;
  is_surface: boolean;
};

export type RecommenderSessionSummary = {
  monthly_forage: {
    primary: ForageBucketV3;
    secondary?: ForageBucketV3;
  };
  /** Rebuild: single session color theme from `resolveColorDecisionV3` (same basis as per-card `color_style`). Omitted by legacy v3 surface. */
  session_color_theme_label?: string;
  monthly_baseline: {
    allowed_columns: TacticalColumnV3[];
    allowed_paces: TacticalPaceV3[];
    allowed_presence: TacticalPresenceV3[];
    surface_seasonally_possible: boolean;
  };
  daily_tactical_preference: {
    posture_band: DailyPostureBandV3;
    preferred_column: TacticalColumnV3;
    secondary_column?: TacticalColumnV3;
    preferred_pace: TacticalPaceV3;
    secondary_pace?: TacticalPaceV3;
    preferred_presence: TacticalPresenceV3;
    secondary_presence?: TacticalPresenceV3;
    surface_allowed_today: boolean;
    surface_window: DailySurfaceWindowV3;
    opportunity_mix: OpportunityMixModeV3;
  };
};

export type RecommenderResponse = {
  feature: RecommenderFeatureId;
  species: SpeciesGroup;
  context: EngineContext;
  water_clarity: WaterClarity;
  generated_at: string;
  cache_expires_at: string;
  summary: RecommenderSessionSummary;
  lure_recommendations: RankedRecommendation[];
  fly_recommendations: RankedRecommendation[];
};
