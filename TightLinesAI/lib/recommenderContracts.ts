/**
 * Recommender frontend contracts — mirror of backend output types.
 * These are copy-typed here so the frontend has no dependency on the
 * Deno/edge-function module system.
 */

import { STATE_SPECIES_CONTEXTS as GENERATED_STATE_SPECIES_CONTEXTS } from './generated/recommenderStateSpecies';

export const RECOMMENDER_FEATURE = "recommender_v3" as const;

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
  pike_musky:       "Northern Pike",
  river_trout:      "Trout",
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
  pike_musky:       "Pike",
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

// ─── State × species × context gating (frontend mirror of backend map) ────────
//
// Maps each US state to the species available there and which contexts
// each species is valid in. Used to filter species and context chips on the
// setup form so users never see an option that will be rejected by the engine.
//
// Mirrors supabase/functions/_shared/recommenderEngine/config/stateSpeciesGating.ts
// Keep in sync when the backend map changes.

export type StateSpeciesContexts = Partial<Record<SpeciesGroup, EngineContext[]>>;

export const RECOMMENDER_V3_UI_SPECIES: SpeciesGroup[] = [
  "largemouth_bass",
  "smallmouth_bass",
  "pike_musky",
  "river_trout",
];

export const RECOMMENDER_V3_UI_CONTEXTS: EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
];

export const STATE_SPECIES_CONTEXTS: Record<string, StateSpeciesContexts> =
  GENERATED_STATE_SPECIES_CONTEXTS as unknown as Record<string, StateSpeciesContexts>;

/**
 * Returns the species available in a given state, across any valid context.
 * Preserves the canonical SPECIES_GROUPS ordering.
 */
export function getSpeciesForState(state_code: string): SpeciesGroup[] {
  const map = STATE_SPECIES_CONTEXTS[state_code.toUpperCase()];
  if (!map) return [...SPECIES_GROUPS]; // unknown state — show all
  return SPECIES_GROUPS.filter((sp) => sp in map);
}

/**
 * Returns the valid contexts for a given state + species combo.
 * Falls back to all engine contexts if state or species is unknown.
 */
export function getContextsForStateSpecies(
  state_code: string,
  species: SpeciesGroup,
): EngineContext[] {
  const map = STATE_SPECIES_CONTEXTS[state_code.toUpperCase()];
  if (!map) return ["freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary"];
  return map[species] ?? [];
}

/**
 * Returns all contexts available in a state for any species.
 * Used to filter context chips before a species is selected.
 */
export function getContextsForState(state_code: string): EngineContext[] {
  const map = STATE_SPECIES_CONTEXTS[state_code.toUpperCase()];
  if (!map) return ["freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary"];
  const all = new Set<EngineContext>();
  for (const ctxs of Object.values(map)) {
    for (const c of ctxs) all.add(c);
  }
  // Return in canonical order
  return (["freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary"] as EngineContext[])
    .filter((c) => all.has(c));
}

export function getRecommenderSpeciesForState(state_code: string): SpeciesGroup[] {
  return getSpeciesForState(state_code).filter((species) => RECOMMENDER_V3_UI_SPECIES.includes(species));
}

export function getRecommenderContextsForStateSpecies(
  state_code: string,
  species: SpeciesGroup,
): EngineContext[] {
  return getContextsForStateSpecies(state_code, species)
    .filter((context) => RECOMMENDER_V3_UI_CONTEXTS.includes(context));
}

export function getRecommenderContextsForState(state_code: string): EngineContext[] {
  return getContextsForState(state_code).filter((context) => RECOMMENDER_V3_UI_CONTEXTS.includes(context));
}

export function isRecommenderV3UiSpecies(species: string): species is SpeciesGroup {
  return RECOMMENDER_V3_UI_SPECIES.includes(species as SpeciesGroup);
}

export function isRecommenderV3UiContext(context: string): context is EngineContext {
  return RECOMMENDER_V3_UI_CONTEXTS.includes(context as EngineContext);
}

// ─── Output types ─────────────────────────────────────────────────────────────

export type ActivityLevel = "inactive" | "low" | "neutral" | "active" | "aggressive";
export type AggressionLevel = "passive" | "neutral" | "reactive" | "aggressive";
export type StrikeZone = "narrow" | "moderate" | "wide";
export type ChaseRadius = "short" | "moderate" | "long";
export type DepthLane = "surface" | "upper" | "mid" | "near_bottom" | "bottom";
export type SpeedPreference = "dead_slow" | "slow" | "moderate" | "fast" | "vary";
export type NoiseLevel = "silent" | "subtle" | "moderate" | "loud";
export type FlashLevel = "none" | "subtle" | "moderate" | "heavy";
export type ProfileSize = "slim" | "medium" | "bulky";
export type TriggerType = "finesse" | "reaction" | "natural_match" | "aggressive";
export type MotionType =
  | "steady"
  | "hop"
  | "twitch_pause"
  | "rip"
  | "sweep"
  | "walk"
  | "pop"
  | "drag"
  | "swing";
export type CurrentTechnique =
  | "uptide_cast"
  | "cross_current"
  | "downstream_drift"
  | "static";
export type ForageMode =
  | "baitfish"
  | "shrimp"
  | "crab"
  | "crawfish"
  | "leech"
  | "surface_prey"
  | "mixed";
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

export type BehaviorSummaryRow = {
  label: string;
  detail: string;
};

export type BehaviorOutput = {
  activity: ActivityLevel;
  aggression: AggressionLevel;
  strike_zone: StrikeZone;
  chase_radius: ChaseRadius;
  depth_lane: DepthLane;
  forage_mode: ForageMode;
  secondary_forage?: ForageMode;
  topwater_viable: boolean;
  speed_preference: SpeedPreference;
  noise_preference: NoiseLevel;
  flash_preference: FlashLevel;
  habitat_tags: string[];
  behavior_summary: [BehaviorSummaryRow, BehaviorSummaryRow, BehaviorSummaryRow];
  tidal_note?: string;
  seasonal_flag?: string;
};

export type PresentationOutput = {
  depth_target: DepthLane;
  speed: SpeedPreference;
  motion: MotionType;
  trigger_type: TriggerType;
  noise: NoiseLevel;
  flash: FlashLevel;
  profile: ProfileSize;
  color_family: ColorFamily;
  topwater_viable: boolean;
  current_technique?: CurrentTechnique;
};

export type RankedFamily = {
  family_id: string;
  display_name: string;
  how_to_fish: string;
  color_guide: string;
  rank_context?: string;
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
  /** Phase 6 target field: top-level guide summary for the overall pattern. */
  primary_pattern_summary?: string;
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
