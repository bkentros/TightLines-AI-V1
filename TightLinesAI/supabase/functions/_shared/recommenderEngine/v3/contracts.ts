import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../howFishingEngine/contracts/region.ts";
import type { WaterClarity } from "../contracts/input.ts";

/**
 * Freshwater-only V3 contracts.
 *
 * Monthly biology defines the valid world. Daily conditions then shift the
 * preferred tactical lane inside that world without guessing outside it.
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

export const TACTICAL_COLUMNS_V3 = [
  "bottom",
  "mid",
  "upper",
  "surface",
] as const;

export type TacticalColumnV3 = (typeof TACTICAL_COLUMNS_V3)[number];

export const TACTICAL_PACES_V3 = [
  "slow",
  "medium",
  "fast",
] as const;

export type TacticalPaceV3 = (typeof TACTICAL_PACES_V3)[number];

export const TACTICAL_PRESENCE_V3 = [
  "subtle",
  "moderate",
  "bold",
] as const;

export type TacticalPresenceV3 = (typeof TACTICAL_PRESENCE_V3)[number];

export const LEGACY_ARCHETYPE_WATER_COLUMNS_V3 = [
  "top",
  "shallow",
  "mid",
  "bottom",
] as const;

export type LegacyArchetypeWaterColumnV3 =
  (typeof LEGACY_ARCHETYPE_WATER_COLUMNS_V3)[number];

export const MOODS_V3 = [
  "negative",
  "neutral",
  "active",
] as const;

export type MoodV3 = (typeof MOODS_V3)[number];

export const PRESENTATION_STYLES_V3 = [
  "subtle",
  "balanced",
  "bold",
] as const;

export type PresentationStyleV3 = (typeof PRESENTATION_STYLES_V3)[number];

export const SEASONAL_WATER_COLUMNS_V3 = [
  "top",
  "high",
  "mid",
  "mid_low",
  "low",
] as const;

export type SeasonalWaterColumnV3 =
  (typeof SEASONAL_WATER_COLUMNS_V3)[number];

export const SEASONAL_LOCATIONS_V3 = [
  "shallow",
  "shallow_mid",
  "mid",
  "mid_deep",
  "deep",
] as const;

export type SeasonalLocationV3 = (typeof SEASONAL_LOCATIONS_V3)[number];

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

export const DAILY_REACTION_WINDOWS_V3 = [
  "off",
  "watch",
  "on",
] as const;

export type DailyReactionWindowV3 =
  (typeof DAILY_REACTION_WINDOWS_V3)[number];

export const OPPORTUNITY_MIX_MODES_V3 = [
  "conservative",
  "balanced",
  "aggressive",
] as const;

export type OpportunityMixModeV3 =
  (typeof OPPORTUNITY_MIX_MODES_V3)[number];

export const FORAGE_BUCKETS_V3 = [
  "baitfish",
  "crawfish",
  "bluegill_perch",
  "leech_worm",
  "insect_misc",
  "surface_prey",
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

export type RecommenderV3MonthlyBaselineProfile = {
  allowed_columns: readonly TacticalColumnV3[];
  column_preference_order: readonly TacticalColumnV3[];
  allowed_paces: readonly TacticalPaceV3[];
  pace_preference_order: readonly TacticalPaceV3[];
  allowed_presence: readonly TacticalPresenceV3[];
  presence_preference_order: readonly TacticalPresenceV3[];
  surface_seasonally_possible: boolean;
  primary_forage: ForageBucketV3;
  secondary_forage?: ForageBucketV3;
  typical_seasonal_water_column: SeasonalWaterColumnV3;
  typical_seasonal_location: SeasonalLocationV3;
};

export type RecommenderV3DailyPayload = {
  normalized_states: {
    temperature_metabolic_context: "cold_limited" | "heat_limited" | "neutral";
    temperature_trend: string;
    temperature_shock: string;
    pressure_regime: string | null;
    wind_condition: string | null;
    light_cloud_condition: string | null;
    precipitation_disruption: string | null;
    runoff_flow_disruption: string | null;
  };
  posture_band: DailyPostureBandV3;
  reaction_window: DailyReactionWindowV3;
  surface_window: DailySurfaceWindowV3;
  opportunity_mix: OpportunityMixModeV3;
  column_shift: -1 | 0 | 1;
  pace_shift: -1 | 0 | 1;
  presence_shift: -1 | 0 | 1;
  surface_allowed_today: boolean;
  suppress_fast_presentations: boolean;
  high_visibility_needed: boolean;
  variables_considered: readonly string[];
  variables_triggered: readonly string[];
  notes: string[];
};

export type RecommenderV3DailyTacticalPreference = {
  preferred_column: TacticalColumnV3;
  secondary_column?: TacticalColumnV3;
  column_preference_order: readonly TacticalColumnV3[];
  preferred_pace: TacticalPaceV3;
  secondary_pace?: TacticalPaceV3;
  pace_preference_order: readonly TacticalPaceV3[];
  preferred_presence: TacticalPresenceV3;
  secondary_presence?: TacticalPresenceV3;
  presence_preference_order: readonly TacticalPresenceV3[];
  surface_allowed_today: boolean;
  surface_window: DailySurfaceWindowV3;
  reaction_window: DailyReactionWindowV3;
  opportunity_mix: OpportunityMixModeV3;
  notes: readonly string[];
};

export type RecommenderV3ArchetypeProfile = {
  id: RecommenderV3ArchetypeId;
  display_name: string;
  gear_mode: "lure" | "fly";
  species_allowed: readonly RecommenderV3Species[];
  water_types_allowed: readonly RecommenderV3Context[];
  family_group: string;
  primary_column: TacticalColumnV3;
  secondary_column?: TacticalColumnV3;
  pace: TacticalPaceV3;
  secondary_pace?: TacticalPaceV3;
  presence: TacticalPresenceV3;
  secondary_presence?: TacticalPresenceV3;
  is_surface: boolean;
  current_friendly?: boolean;
  forage_tags: readonly ForageBucketV3[];
  why_hooks: readonly string[];
  how_to_fish_variants: readonly [string, string, string];
  how_to_fish_template: string;
  clarity_strengths?: readonly WaterClarity[];
  tactical_lane: TacticalLaneV3;
};

export type RecommenderV3SeasonalRow = {
  species: RecommenderV3Species;
  region_key: RegionKey;
  month: number;
  context: RecommenderV3Context;
  monthly_baseline: RecommenderV3MonthlyBaselineProfile;
  primary_lure_ids?: readonly LureArchetypeIdV3[];
  primary_fly_ids?: readonly FlyArchetypeIdV3[];
  eligible_lure_ids: readonly LureArchetypeIdV3[];
  eligible_fly_ids: readonly FlyArchetypeIdV3[];
};

export type RecommenderV3ResolvedProfile = {
  monthly_baseline: RecommenderV3MonthlyBaselineProfile;
  daily_preference: RecommenderV3DailyTacticalPreference;
};

export type RecommenderV3ScoreBreakdown = {
  code: string;
  value: number;
  detail: string;
};

export type RecommenderV3SelectionRole =
  | "best_match"
  | "strong_alternate"
  | "change_up";

export type RecommenderV3RankedArchetype = {
  id: RecommenderV3ArchetypeId;
  display_name: string;
  gear_mode: "lure" | "fly";
  family_group: string;
  primary_column: TacticalColumnV3;
  pace: TacticalPaceV3;
  presence: TacticalPresenceV3;
  is_surface: boolean;
  tactical_lane: TacticalLaneV3;
  score: number;
  selection_role: RecommenderV3SelectionRole;
  tactical_fit: number;
  practicality_fit: number;
  forage_fit: number;
  clarity_fit: number;
  opportunity_mix_fit: number;
  color_theme: ResolvedColorThemeV3;
  color_recommendations: [string, string, string];
  why_chosen: string;
  how_to_fish: string;
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
