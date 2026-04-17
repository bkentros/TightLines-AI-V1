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

/** Per-archetype scoring nudge for state-scoped seasonal rows (see resolveSeasonalRowV3). */
export type StateScopedDeltaV3 = {
  archetype_id: RecommenderV3ArchetypeId;
  delta: number;
  /** When set, the delta applies only if the request matches all specified fields. */
  when?: {
    clarity?: WaterClarity;
  };
};

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
  /**
   * Authored source of truth for where in the water column this archetype
   * operates, in order of how often a guide would reach for it there.
   * range[0] = primary usage, range[1] = legitimate secondary, range[2] =
   * occasional tertiary. Length 1–3, no duplicates. `surface` is only valid
   * at index 0 for true surface archetypes and must not appear elsewhere.
   */
  column_range: readonly TacticalColumnV3[];
  /** Authored source of truth for retrieve pace. Same ordering convention
   * and length/dup rules as `column_range`. */
  pace_range: readonly TacticalPaceV3[];
  /** Authored source of truth for visual/motion presence. Same ordering
   * convention and length/dup rules as `column_range`. */
  presence_range: readonly TacticalPresenceV3[];
  /** Derived from `column_range[0]`. Kept for scorer + surface readers. */
  primary_column: TacticalColumnV3;
  /** Derived from `column_range[1]` when present. */
  secondary_column?: TacticalColumnV3;
  /** Derived from `pace_range[0]`. */
  pace: TacticalPaceV3;
  /** Derived from `pace_range[1]` when present. */
  secondary_pace?: TacticalPaceV3;
  /** Derived from `presence_range[0]`. */
  presence: TacticalPresenceV3;
  /** Derived from `presence_range[1]` when present. */
  secondary_presence?: TacticalPresenceV3;
  /** Derived from `column_range[0] === "surface"`. */
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
  /** Optional US two-letter state code. When set, this row is only selected
   * when the request's state_code matches. State-scoped rows take priority
   * over region-scoped rows for the same (species, region_key, month, context). */
  state_code?: string;
  /** Optional per-archetype score deltas applied for this row (state-scoped overrides). */
  state_scoring_adjustments?: readonly StateScopedDeltaV3[];
  monthly_baseline: RecommenderV3MonthlyBaselineProfile;
  primary_lure_ids?: readonly LureArchetypeIdV3[];
  primary_fly_ids?: readonly FlyArchetypeIdV3[];
  eligible_lure_ids: readonly LureArchetypeIdV3[];
  eligible_fly_ids: readonly FlyArchetypeIdV3[];
};

export type RecommenderV3ResolvedSeasonalRow = RecommenderV3SeasonalRow & {
  source_region_key: RegionKey;
  used_region_fallback: boolean;
  /** True when resolution matched a state-scoped row (state_code was set on the winner). */
  used_state_scoped_row: boolean;
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

/** Mirrors `resolveColorDecisionV3` reason codes (Section 5B); kept here to avoid contracts↔colorDecision cycles. */
export type RecommenderV3ColorReasonCode =
  | "clear_bright_natural"
  | "clear_mixed_natural"
  | "clear_low_dark"
  | "stained_bright_dark"
  | "stained_mixed_dark"
  | "stained_low_bright"
  | "dirty_bright_dark"
  | "dirty_mixed_bright"
  | "dirty_low_bright";

export type RecommenderV3ColorDecision = {
  theme: ResolvedColorThemeV3;
  reason_code: RecommenderV3ColorReasonCode;
  short_reason: string;
};

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
  /** Post-selection diversity bonus applied in topThreeSelection. Zero for candidates that were not considered as a changeup slot. Not a per-archetype fit score. */
  diversity_bonus: number;
  color_theme: ResolvedColorThemeV3;
  color_recommendations: [string, string, string];
  color_decision: RecommenderV3ColorDecision;
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
  seasonal_source_region_key: RegionKey;
  used_region_fallback: boolean;
  used_state_scoped_row: boolean;
  month: number;
  water_clarity: WaterClarity;
  variables_considered: readonly string[];
  daily_payload: RecommenderV3DailyPayload;
  seasonal_row: RecommenderV3ResolvedSeasonalRow;
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
