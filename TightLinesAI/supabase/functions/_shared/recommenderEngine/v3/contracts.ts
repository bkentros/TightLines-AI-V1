import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../howFishingEngine/contracts/region.ts";
import type { WaterClarity } from "../contracts/input.ts";

/**
 * Freshwater-only V3 contracts.
 *
 * The rebuilt recommender is intentionally compact and deterministic:
 * seasonal rows define what is biologically sensible, then a small daily payload
 * reshuffles that pool using posture, presentation presence, and explicit
 * guardrails.
 */

export const RECOMMENDER_V3_SPECIES = [
  "largemouth_bass",
  "smallmouth_bass",
  "northern_pike",
  "trout",
] as const;

export type RecommenderV3Species = (typeof RECOMMENDER_V3_SPECIES)[number];

export const RECOMMENDER_V3_CONTEXTS = [
  "freshwater_lake_pond",
  "freshwater_river",
] as const satisfies readonly EngineContext[];

export type RecommenderV3Context = (typeof RECOMMENDER_V3_CONTEXTS)[number];

/** Existing archetype catalogs still profile water-column fit in 4 broad lanes. */
export const ARCHETYPE_WATER_COLUMNS_V3 = [
  "top",
  "shallow",
  "mid",
  "bottom",
] as const;

export type ArchetypeWaterColumnV3 =
  (typeof ARCHETYPE_WATER_COLUMNS_V3)[number];

/** Seasonal baseline anchors use the explicit 5-state model from the new spec. */
export const SEASONAL_WATER_COLUMNS_V3 = [
  "top",
  "high",
  "mid",
  "mid_low",
  "low",
] as const;

export type SeasonalWaterColumnV3 =
  (typeof SEASONAL_WATER_COLUMNS_V3)[number];

/** Today's likely bite lane resolves on a 7-step deterministic scale. */
export const RESOLVED_WATER_COLUMNS_V3 = [
  "top",
  "high_top",
  "high",
  "mid_high",
  "mid",
  "mid_low",
  "low",
] as const;

export type ResolvedWaterColumnV3 =
  (typeof RESOLVED_WATER_COLUMNS_V3)[number];

/** Archetype catalogs already encode fit using these broad posture buckets. */
export const MOODS_V3 = [
  "negative",
  "neutral",
  "active",
] as const;

export type MoodV3 = (typeof MOODS_V3)[number];

/** Presence values match the subtle/balanced/bold model locked in the plan. */
export const PRESENTATION_STYLES_V3 = [
  "subtle",
  "balanced",
  "bold",
] as const;

export type PresentationStyleV3 = (typeof PRESENTATION_STYLES_V3)[number];

export const DAILY_POSTURE_BANDS_V3 = [
  "suppressed",
  "slightly_suppressed",
  "neutral",
  "slightly_aggressive",
  "aggressive",
] as const;

export type DailyPostureBandV3 =
  (typeof DAILY_POSTURE_BANDS_V3)[number];

export const DAILY_SURFACE_WINDOWS_V3 = [
  "closed",
  "clean",
  "rippled",
] as const;

export type DailySurfaceWindowV3 =
  (typeof DAILY_SURFACE_WINDOWS_V3)[number];

export const SEASONAL_LOCATIONS_V3 = [
  "shallow",
  "shallow_mid",
  "mid",
  "mid_deep",
  "deep",
] as const;

export type SeasonalLocationV3 = (typeof SEASONAL_LOCATIONS_V3)[number];

export const FORAGE_BUCKETS_V3 = [
  "baitfish",
  "crawfish",
  "bluegill_perch",
  "leech_worm",
  "insect_misc",
] as const;

export type ForageBucketV3 = (typeof FORAGE_BUCKETS_V3)[number];

export const V3_SCORED_VARIABLE_KEYS_BY_CONTEXT: Record<
  RecommenderV3Context,
  readonly string[]
> = {
  freshwater_lake_pond: [
    "temperature_metabolic_context",
    "temperature_trend",
    "temperature_shock",
    "pressure_regime",
    "wind_condition",
    "light_cloud_condition",
    "precipitation_disruption",
  ],
  freshwater_river: [
    "temperature_metabolic_context",
    "temperature_trend",
    "temperature_shock",
    "pressure_regime",
    "wind_condition",
    "light_cloud_condition",
    "runoff_flow_disruption",
  ],
};

export const RECOMMENDER_V3_GUARDRAIL_KEYS = [
  "surface_allowed_today",
  "suppress_true_topwater",
  "surface_window_today",
  "max_upward_column_shift_today",
  "max_downward_column_shift_today",
  "suppress_fast_presentations",
  "high_visibility_needed_today",
] as const;

export type RecommenderV3GuardrailKey =
  (typeof RECOMMENDER_V3_GUARDRAIL_KEYS)[number];

export type RecommenderV3DailyPayload = {
  posture_score_10: number;
  posture_band: DailyPostureBandV3;
  presentation_presence_today: PresentationStyleV3;
  /**
   * Desired directional shift in half-steps before seasonal/guardrail clamping.
   * -2 = stronger move up in the column, +2 = stronger move down.
   */
  column_shift_bias_half_steps: -2 | -1 | 0 | 1 | 2;
  max_upward_column_shift_today: 0 | 1 | 2;
  max_downward_column_shift_today: 0 | 1 | 2;
  surface_allowed_today: boolean;
  suppress_true_topwater: boolean;
  surface_window_today: DailySurfaceWindowV3;
  suppress_fast_presentations: boolean;
  high_visibility_needed_today: boolean;
  variables_considered: readonly string[];
  variables_triggered: readonly string[];
  notes: string[];
};

export const LURE_ARCHETYPE_IDS_V3 = [
  "weightless_stick_worm",
  "texas_rigged_stick_worm",
  "wacky_rigged_stick_worm",
  "carolina_rigged_stick_worm",
  "shaky_head_worm",
  "drop_shot_worm",
  "drop_shot_minnow",
  "ned_rig",
  "tube_jig",
  "texas_rigged_soft_plastic_craw",
  "football_jig",
  "compact_flipping_jig",
  "finesse_jig",
  "swim_jig",
  "hair_jig",
  "inline_spinner",
  "spinnerbait",
  "bladed_jig",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "suspending_jerkbait",
  "squarebill_crankbait",
  "flat_sided_crankbait",
  "medium_diving_crankbait",
  "deep_diving_crankbait",
  "lipless_crankbait",
  "blade_bait",
  "casting_spoon",
  "walking_topwater",
  "popping_topwater",
  "buzzbait",
  "prop_bait",
  "hollow_body_frog",
  "large_profile_pike_swimbait",
  "pike_jerkbait",
] as const;

export type LureArchetypeIdV3 = (typeof LURE_ARCHETYPE_IDS_V3)[number];

export const FLY_ARCHETYPE_IDS_V3 = [
  "clouser_minnow",
  "deceiver",
  "bucktail_baitfish_streamer",
  "slim_minnow_streamer",
  "articulated_baitfish_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "balanced_leech",
  "zonker_streamer",
  "sculpin_streamer",
  "sculpzilla",
  "muddler_sculpin",
  "crawfish_streamer",
  "conehead_streamer",
  "pike_bunny_streamer",
  "large_articulated_pike_streamer",
  "popper_fly",
  "frog_fly",
  "mouse_fly",
] as const;

export type FlyArchetypeIdV3 = (typeof FLY_ARCHETYPE_IDS_V3)[number];

export type RecommenderV3ArchetypeId = LureArchetypeIdV3 | FlyArchetypeIdV3;

export const RESOLVED_COLOR_THEMES_V3 = [
  "natural",
  "dark",
  "bright",
] as const;

export type ResolvedColorThemeV3 = (typeof RESOLVED_COLOR_THEMES_V3)[number];

export const TACTICAL_LANES_V3 = [
  "bottom_contact",
  "finesse_subtle",
  "horizontal_search",
  "reaction_mid_column",
  "surface",
  "cover_weedless",
  "pike_big_profile",
  "fly_baitfish",
  "fly_bottom",
  "fly_surface",
] as const;

export type TacticalLaneV3 = (typeof TACTICAL_LANES_V3)[number];

export type RecommenderV3ArchetypeProfile = {
  id: RecommenderV3ArchetypeId;
  display_name: string;
  gear_mode: "lure" | "fly";
  family_key: string;
  /** Optional: only use for near-duplicates that should not coexist in the top 3. */
  top3_redundancy_key?: string;
  preferred_water_columns: readonly ArchetypeWaterColumnV3[];
  preferred_moods: readonly MoodV3[];
  preferred_presentation_styles: readonly PresentationStyleV3[];
  /** Legacy metadata retained temporarily while archetype profiles are migrated. */
  preferred_pace_biases?: readonly ("slow" | "neutral" | "fast")[];
  forage_matches: readonly ForageBucketV3[];
  clarity_strengths: readonly WaterClarity[];
  tactical_lane: TacticalLaneV3;
  /** Optional per-archetype technique line when tactical_lane defaults are too generic. */
  /** Three variants; `runRecommenderV3Surface` picks one deterministically from the request seed. */
  how_to_fish_text?: readonly [string, string, string];
};

export type RecommenderV3SeasonalRow = {
  species: RecommenderV3Species;
  region_key: RegionKey;
  month: number;
  context: RecommenderV3Context;
  typical_seasonal_water_column: SeasonalWaterColumnV3;
  typical_seasonal_location: SeasonalLocationV3;
  primary_forage: ForageBucketV3;
  secondary_forage?: ForageBucketV3;
  /** Seasonal eligibility only — equal standing; daily conditions rank within this set. */
  eligible_lure_ids: readonly LureArchetypeIdV3[];
  eligible_fly_ids: readonly FlyArchetypeIdV3[];
};

export type RecommenderV3ResolvedProfile = {
  typical_seasonal_water_column: SeasonalWaterColumnV3;
  likely_water_column_today: ResolvedWaterColumnV3;
  typical_seasonal_location: SeasonalLocationV3;
  daily_posture_band: DailyPostureBandV3;
  presentation_presence_today: PresentationStyleV3;
  primary_forage: ForageBucketV3;
  secondary_forage?: ForageBucketV3;
};

export type RecommenderV3ScoreBreakdown = {
  code: string;
  value: number;
  detail: string;
  /** Used by confidence heuristics when present. */
  direction?: "bonus" | "penalty";
};

export type RecommenderV3RankedArchetype = {
  id: RecommenderV3ArchetypeId;
  display_name: string;
  gear_mode: "lure" | "fly";
  family_key: string;
  tactical_lane: TacticalLaneV3;
  score: number;
  water_column_fit: number;
  posture_fit: number;
  presentation_fit: number;
  forage_bonus: number;
  daily_condition_fit: number;
  clarity_fit: number;
  guardrail_penalty: number;
  color_theme: ResolvedColorThemeV3;
  color_recommendations: [string, string, string];
  breakdown: RecommenderV3ScoreBreakdown[];
};

export const RECOMMENDER_V3_FEATURE = "recommender_v3" as const;

export type RecommenderV3Response = {
  feature: typeof RECOMMENDER_V3_FEATURE;
  species: RecommenderV3Species;
  context: RecommenderV3Context;
  region_key: RegionKey;
  month: number;
  water_clarity: WaterClarity;
  variables_considered: readonly string[];
  daily_payload: RecommenderV3DailyPayload;
  seasonal_row: RecommenderV3SeasonalRow;
  resolved_profile: RecommenderV3ResolvedProfile;
  lure_recommendations: RecommenderV3RankedArchetype[];
  fly_recommendations: RecommenderV3RankedArchetype[];
};

export const RECOMMENDER_V3_FOUNDATION_FEATURE =
  "recommender_v3_foundation" as const;

export type RecommenderV3FoundationSnapshot = {
  feature: typeof RECOMMENDER_V3_FOUNDATION_FEATURE;
  species: RecommenderV3Species;
  context: RecommenderV3Context;
  region_key: RegionKey;
  month: number;
  water_clarity: WaterClarity;
  variables_considered: readonly string[];
  daily_payload: RecommenderV3DailyPayload;
  analysis: Pick<SharedConditionAnalysis, "timing" | "condition_context">;
};
