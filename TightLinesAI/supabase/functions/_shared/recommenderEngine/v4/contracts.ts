import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../howFishingEngine/contracts/region.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import type { WaterClarity } from "../contracts/input.ts";

// ── Scope (v4 freshwater recommender) ───────────────────────────────────────

export const RECOMMENDER_V4_CONTEXTS = [
  "freshwater_lake_pond",
  "freshwater_river",
] as const satisfies readonly EngineContext[];

export type RecommenderV4Context = (typeof RECOMMENDER_V4_CONTEXTS)[number];

export const RECOMMENDER_V4_SPECIES = [
  "largemouth_bass",
  "smallmouth_bass",
  "northern_pike",
  "trout",
] as const;

export type RecommenderV4Species = (typeof RECOMMENDER_V4_SPECIES)[number];

// ── §16.1 Tactical enums ────────────────────────────────────────────────────

export const TACTICAL_COLUMNS_V4 = ["bottom", "mid", "upper", "surface"] as const;
export type TacticalColumn = (typeof TACTICAL_COLUMNS_V4)[number];

export const TACTICAL_PACES_V4 = ["slow", "medium", "fast"] as const;
export type TacticalPace = (typeof TACTICAL_PACES_V4)[number];

// ── §16.2 Forage ────────────────────────────────────────────────────────────

export const FORAGE_BUCKETS_V4 = [
  "baitfish",
  "crawfish",
  "bluegill_perch",
  "leech_worm",
  "insect_misc",
  "surface_prey",
] as const;
export type ForageBucket = (typeof FORAGE_BUCKETS_V4)[number];

/** §15.1 G6 — authorable `primary_forage` / `secondary_forage` per species. */
export const FORAGE_POLICY_V4: Record<
  RecommenderV4Species,
  ReadonlySet<ForageBucket>
> = {
  largemouth_bass: new Set([
    "baitfish",
    "bluegill_perch",
    "crawfish",
    "leech_worm",
    "surface_prey",
  ]),
  smallmouth_bass: new Set([
    "baitfish",
    "crawfish",
    "leech_worm",
    "bluegill_perch",
    "insect_misc",
    "surface_prey",
  ]),
  northern_pike: new Set(["baitfish", "bluegill_perch", "surface_prey"]),
  trout: new Set(["baitfish", "crawfish", "leech_worm", "surface_prey"]),
};

// ── Appendix A — closed archetype id sets ─────────────────────────────────

export const LURE_ARCHETYPE_IDS_V4 = [
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
  "large_bucktail_spinner",
  "large_pike_topwater",
  "pike_jig_and_plastic",
] as const;

export type LureArchetypeIdV4 = (typeof LURE_ARCHETYPE_IDS_V4)[number];

export const FLY_ARCHETYPE_IDS_V4 = [
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
  "unweighted_baitfish_streamer",
  "popper_fly",
  "frog_fly",
  "mouse_fly",
] as const;

export type FlyArchetypeIdV4 = (typeof FLY_ARCHETYPE_IDS_V4)[number];

export type ArchetypeIdV4 = LureArchetypeIdV4 | FlyArchetypeIdV4;

export const SURFACE_FLY_IDS_V4 = ["popper_fly", "frog_fly", "mouse_fly"] as const;
export type SurfaceFlyIdV4 = (typeof SURFACE_FLY_IDS_V4)[number];

// ── §16.3 Archetype profile ─────────────────────────────────────────────────

export type ArchetypeProfileV4 = {
  id: ArchetypeIdV4;
  display_name: string;
  gear_mode: "lure" | "fly";
  species_allowed: readonly RecommenderV4Species[];
  water_types_allowed: readonly EngineContext[];
  family_group: string;
  column: TacticalColumn;
  primary_pace: TacticalPace;
  secondary_pace?: TacticalPace;
  forage_tags: readonly ForageBucket[];
  clarity_strengths: readonly WaterClarity[];
  is_surface: boolean;
  how_to_fish_variants: readonly [string, string, string];
};

// ── §16.4 Seasonal row ──────────────────────────────────────────────────────

export type SeasonalRowV4 = {
  species: RecommenderV4Species;
  region_key: RegionKey;
  month: number;
  water_type: EngineContext;

  state_code?: string;

  column_range: readonly TacticalColumn[];
  column_baseline: TacticalColumn;
  pace_range: readonly TacticalPace[];
  pace_baseline: TacticalPace;

  primary_forage: ForageBucket;
  secondary_forage?: ForageBucket;

  surface_seasonally_possible: boolean;

  primary_lure_ids: readonly LureArchetypeIdV4[];
  primary_fly_ids: readonly FlyArchetypeIdV4[];

  excluded_lure_ids?: readonly LureArchetypeIdV4[];
  excluded_fly_ids?: readonly FlyArchetypeIdV4[];
};

// ── §16.5 Daily payload ───────────────────────────────────────────────────────

export type DailyPayloadV4 = {
  posture: "aggressive" | "neutral" | "suppressed";
  wind_mph: number;
  water_clarity: WaterClarity;
  hows_fishing_score: number;
};

// ── §16.6 Resolved tactics ──────────────────────────────────────────────────

export type ResolvedTacticsV4 = {
  today_columns: readonly TacticalColumn[];
  column_distribution: readonly [TacticalColumn, TacticalColumn, TacticalColumn];
  pace_distribution: readonly [TacticalPace, TacticalPace, TacticalPace];
};

// ── §5.2 Output ─────────────────────────────────────────────────────────────

export type RankedRecommendationV4 = {
  id: string;
  display_name: string;
  family_group: string;
  color_style: string;
  why_chosen: string;
  how_to_fish: string;
  column: TacticalColumn;
  pace: TacticalPace;
  is_surface: boolean;
};

export type RecommenderSummaryV4 = {
  posture: "aggressive" | "neutral" | "suppressed";
  column_range: TacticalColumn[];
  column_baseline: TacticalColumn;
  pace_range: TacticalPace[];
  pace_baseline: TacticalPace;
  primary_forage: ForageBucket;
  secondary_forage?: ForageBucket;
  surface_available_today: boolean;
  today_column_distribution: TacticalColumn[];
  today_pace_distribution: TacticalPace[];
};

export type RecommenderResponseV4 = {
  feature: "recommender_v4";
  species: SpeciesGroup;
  context: EngineContext;
  water_clarity: WaterClarity;
  generated_at: string;
  cache_expires_at: string;
  summary: RecommenderSummaryV4;
  lure_recommendations: [RankedRecommendationV4, RankedRecommendationV4, RankedRecommendationV4];
  fly_recommendations: [RankedRecommendationV4, RankedRecommendationV4, RankedRecommendationV4];
};
