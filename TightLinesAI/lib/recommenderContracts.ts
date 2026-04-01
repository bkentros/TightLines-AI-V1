/**
 * Recommender frontend contracts — mirror of backend output types.
 * These are copy-typed here so the frontend has no dependency on the
 * Deno/edge-function module system.
 */

export const RECOMMENDER_FEATURE = "recommender_v1" as const;

export type SpeciesGroup =
  | "largemouth_bass"
  | "smallmouth_bass"
  | "pike_musky"
  | "river_trout"
  | "walleye"
  | "redfish"
  | "snook"
  | "seatrout"
  | "striped_bass"
  | "tarpon";

export const SPECIES_GROUPS: SpeciesGroup[] = [
  "largemouth_bass",
  "smallmouth_bass",
  "pike_musky",
  "river_trout",
  "walleye",
  "redfish",
  "snook",
  "seatrout",
  "striped_bass",
  "tarpon",
];

export const SPECIES_DISPLAY: Record<SpeciesGroup, string> = {
  largemouth_bass:  "Largemouth Bass",
  smallmouth_bass:  "Smallmouth Bass",
  pike_musky:       "Pike / Musky",
  river_trout:      "River Trout",
  walleye:          "Walleye",
  redfish:          "Redfish",
  snook:            "Snook",
  seatrout:         "Seatrout",
  striped_bass:     "Striped Bass",
  tarpon:           "Tarpon",
};

/** Short label shown in inline chips */
export const SPECIES_SHORT: Record<SpeciesGroup, string> = {
  largemouth_bass:  "LMB",
  smallmouth_bass:  "SMB",
  pike_musky:       "Pike/Musky",
  river_trout:      "Trout",
  walleye:          "Walleye",
  redfish:          "Redfish",
  snook:            "Snook",
  seatrout:         "Seatrout",
  striped_bass:     "Stripers",
  tarpon:           "Tarpon",
};

export type WaterClarity = "clear" | "stained" | "dirty";

export const WATER_CLARITY_LABELS: Record<WaterClarity, string> = {
  clear:   "Clear",
  stained: "Stained",
  dirty:   "Murky",
};

export type EngineContext =
  | "freshwater_lake_pond"
  | "freshwater_river"
  | "coastal"
  | "coastal_flats_estuary";

// ─── Species water type gate (for UI pre-filtering) ──────────────────────────

export type SpeciesWaterType = "freshwater" | "saltwater" | "both";

export const SPECIES_WATER_TYPE: Record<SpeciesGroup, SpeciesWaterType> = {
  largemouth_bass:  "freshwater",
  smallmouth_bass:  "freshwater",
  pike_musky:       "freshwater",
  river_trout:      "freshwater",
  walleye:          "freshwater",
  redfish:          "saltwater",
  snook:            "saltwater",
  seatrout:         "saltwater",
  striped_bass:     "both",
  tarpon:           "saltwater",
};

// ─── Output types ─────────────────────────────────────────────────────────────

export type ActivityLevel = "inactive" | "low" | "neutral" | "active" | "aggressive";
export type ColorFamily =
  | "natural_match"
  | "shad_silver"
  | "chartreuse_white"
  | "gold_amber"
  | "dark_silhouette"
  | "craw_pattern"
  | "shrimp_tan"
  | "crab_olive"
  | "flash_heavy";

export type BehaviorOutput = {
  activity: ActivityLevel;
  depth_lane: string;
  forage_mode: string;
  secondary_forage?: string;
  topwater_viable: boolean;
  speed_preference: string;
  habitat_tags: string[];
  behavior_summary: [string, string, string];
  tidal_note?: string;
  seasonal_flag?: string;
};

export type PresentationOutput = {
  depth_target: string;
  speed: string;
  motion: string;
  trigger_type: string;
  noise: string;
  flash: string;
  profile: string;
  color_family: ColorFamily;
  topwater_viable: boolean;
  current_technique?: string;
};

export type RankedFamily = {
  family_id: string;
  display_name: string;
  examples: string[];
  score: number;
  why_picked: string;
  how_to_fish: string;
  best_when: string;
  color_guide: string;
};

export type RecommenderConfidenceTier = "high" | "medium" | "low";

export type RecommenderConfidence = {
  tier: RecommenderConfidenceTier;
  reasons: string[];
};

export type RecommenderResponse = {
  feature: typeof RECOMMENDER_FEATURE;
  species: SpeciesGroup;
  context: EngineContext;
  water_clarity: WaterClarity;
  generated_at: string;
  cache_expires_at: string;
  behavior: BehaviorOutput;
  presentation: PresentationOutput;
  lure_rankings: RankedFamily[];
  fly_rankings: RankedFamily[];
  timing: {
    highlighted_periods: [boolean, boolean, boolean, boolean];
    timing_strength: string;
  };
  confidence: RecommenderConfidence;
};

// ─── Request shape (what the frontend sends) ──────────────────────────────────

export type RecommenderCallParams = {
  latitude: number;
  longitude: number;
  state_code: string;
  species: SpeciesGroup;
  context: EngineContext;
  water_clarity: WaterClarity;
  env_data: Record<string, unknown>;
};
