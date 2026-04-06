import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../howFishingEngine/contracts/region.ts";
import type { WaterClarity } from "../contracts/input.ts";

/**
 * V3 is intentionally freshwater-only while the flagship architecture is rebuilt.
 * Region keys stay aligned with the canonical How's Fishing region system so every
 * engine in the app uses the same geography vocabulary.
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

export const WATER_COLUMNS_V3 = [
  "top",
  "shallow",
  "mid",
  "bottom",
] as const;

export type WaterColumnV3 = (typeof WATER_COLUMNS_V3)[number];

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
    "temperature_condition",
    "pressure_regime",
    "wind_condition",
    "light_cloud_condition",
    "precipitation_disruption",
  ],
  freshwater_river: [
    "temperature_condition",
    "pressure_regime",
    "wind_condition",
    "light_cloud_condition",
    "runoff_flow_disruption",
  ],
};

export type RecommenderV3DailyMoodNudge =
  | "down_1"
  | "neutral"
  | "up_1"
  | "up_2";

export type RecommenderV3DailyWaterColumnNudge =
  | "lower_1"
  | "neutral"
  | "higher_1";

export type RecommenderV3DailyPresentationNudge =
  | "subtler"
  | "neutral"
  | "bolder";

export type RecommenderV3DailyPayload = {
  mood_nudge: RecommenderV3DailyMoodNudge;
  water_column_nudge: RecommenderV3DailyWaterColumnNudge;
  presentation_nudge: RecommenderV3DailyPresentationNudge;
  variables_considered: readonly string[];
  notes: string[];
  source_score: number;
  source_band: string;
};

export const LURE_ARCHETYPE_IDS_V3 = [
  "weightless_stick_worm",
  "texas_rigged_stick_worm",
  "wacky_rigged_stick_worm",
  "carolina_rigged_stick_worm",
  "shaky_head_worm",
  "drop_shot_worm_minnow",
  "ned_rig",
  "tube_jig",
  "texas_rigged_soft_plastic_craw",
  "football_jig",
  "compact_flipping_jig",
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
  "buzzbait_prop_bait",
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
  "game_changer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "zonker_streamer",
  "sculpin_streamer",
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

export const COLOR_THEME_IDS_V3 = [
  "natural_baitfish",
  "white_shad",
  "bright_contrast",
  "dark_contrast",
  "craw_natural",
  "green_pumpkin_natural",
  "watermelon_natural",
  "perch_bluegill",
  "frog_natural",
  "mouse_natural",
  "metal_flash",
] as const;

export type ColorThemeIdV3 = (typeof COLOR_THEME_IDS_V3)[number];

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
  preferred_water_columns: readonly WaterColumnV3[];
  preferred_moods: readonly MoodV3[];
  preferred_presentation_styles: readonly PresentationStyleV3[];
  forage_matches: readonly ForageBucketV3[];
  clarity_strengths: readonly WaterClarity[];
  tactical_lane: TacticalLaneV3;
  /**
   * Each allowed theme should map to realistic shades that anglers can actually
   * find or tie for that archetype. The engine will return three shade examples
   * per recommendation so anglers can work with what they already own.
   */
  allowed_color_themes: readonly ColorThemeIdV3[];
  shade_examples_by_theme: Partial<Record<ColorThemeIdV3, readonly string[]>>;
  /** Optional per-archetype technique line when tactical_lane defaults are too generic. */
  how_to_fish_text?: string;
};

export type RecommenderV3SeasonalRow = {
  species: RecommenderV3Species;
  region_key: RegionKey;
  month: number;
  context: RecommenderV3Context;
  base_water_column: WaterColumnV3;
  base_mood: MoodV3;
  base_presentation_style: PresentationStyleV3;
  primary_forage: ForageBucketV3;
  secondary_forage?: ForageBucketV3;
  /** Ordered seasonal priorities: index 0 = top pick (+1.5 baseline), index 1 = strong secondary (+0.75).
   *  Archetypes not listed get a tier penalty (-0.8). If omitted, all viable archetypes are neutral (no bonus/penalty). */
  primary_lure_archetypes?: readonly LureArchetypeIdV3[];
  viable_lure_archetypes: readonly LureArchetypeIdV3[];
  primary_fly_archetypes?: readonly FlyArchetypeIdV3[];
  viable_fly_archetypes: readonly FlyArchetypeIdV3[];
};

export type RecommenderV3ResolvedProfile = {
  final_water_column: WaterColumnV3;
  final_mood: MoodV3;
  final_presentation_style: PresentationStyleV3;
  primary_forage: ForageBucketV3;
  secondary_forage?: ForageBucketV3;
};

export type RecommenderV3ScoreBreakdown = {
  code: string;
  value: number;
  detail: string;
};

export type RecommenderV3RankedArchetype = {
  id: RecommenderV3ArchetypeId;
  display_name: string;
  gear_mode: "lure" | "fly";
  family_key: string;
  tactical_lane: TacticalLaneV3;
  score: number;
  seasonal_baseline: number;
  daily_modifier: number;
  clarity_modifier: number;
  forage_bonus: number;
  color_theme: ColorThemeIdV3;
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

export const RECOMMENDER_V3_FOUNDATION_FEATURE = "recommender_v3_foundation" as const;

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
