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

// ─── State × species × context gating (frontend mirror of backend map) ────────
//
// Maps each US state to the species available there and which contexts
// each species is valid in. Used to filter species and context chips on the
// setup form so users never see an option that will be rejected by the engine.
//
// Mirrors supabase/functions/_shared/recommenderEngine/config/stateSpeciesGating.ts
// Keep in sync when the backend map changes.

const L  = ["freshwater_lake_pond"] as EngineContext[];
const R  = ["freshwater_river"] as EngineContext[];
const LR = ["freshwater_lake_pond", "freshwater_river"] as EngineContext[];
const C  = ["coastal", "coastal_flats_estuary"] as EngineContext[];
const CO = ["coastal"] as EngineContext[];
const LCO = ["freshwater_lake_pond", "coastal"] as EngineContext[];
const RCO = ["freshwater_river", "coastal"] as EngineContext[];

export type StateSpeciesContexts = Partial<Record<SpeciesGroup, EngineContext[]>>;

export const STATE_SPECIES_CONTEXTS: Record<string, StateSpeciesContexts> = {
  AL: { largemouth_bass: LR, smallmouth_bass: R, walleye: L, striped_bass: L, redfish: C, seatrout: C },
  AK: { river_trout: R, pike_musky: L },
  AZ: { largemouth_bass: L, smallmouth_bass: LR, striped_bass: L, walleye: L },
  AR: { largemouth_bass: LR, smallmouth_bass: R, walleye: LR, striped_bass: L },
  CA: { largemouth_bass: L, smallmouth_bass: LR, river_trout: R, striped_bass: RCO, walleye: L },
  CO: { largemouth_bass: L, smallmouth_bass: LR, river_trout: R, walleye: L, pike_musky: LR },
  CT: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: L, striped_bass: CO },
  DE: { largemouth_bass: LR, smallmouth_bass: R, striped_bass: CO, seatrout: CO },
  FL: { largemouth_bass: LR, striped_bass: L, redfish: C, snook: C, seatrout: C, tarpon: C },
  GA: { largemouth_bass: LR, smallmouth_bass: R, striped_bass: L, walleye: L, redfish: C, seatrout: C, tarpon: CO },
  HI: { largemouth_bass: L },
  ID: { largemouth_bass: L, smallmouth_bass: LR, river_trout: R, walleye: L, pike_musky: L },
  IL: { largemouth_bass: LR, smallmouth_bass: R, walleye: LR, pike_musky: LR, striped_bass: L },
  IN: { largemouth_bass: LR, smallmouth_bass: LR, walleye: LR, pike_musky: LR },
  IA: { largemouth_bass: LR, smallmouth_bass: R, walleye: LR, pike_musky: LR },
  KS: { largemouth_bass: L, smallmouth_bass: R, walleye: L, striped_bass: L },
  KY: { largemouth_bass: LR, smallmouth_bass: LR, walleye: L, striped_bass: L, pike_musky: L },
  LA: { largemouth_bass: LR, striped_bass: L, redfish: C, seatrout: C, snook: C, tarpon: CO },
  ME: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: L, pike_musky: L, striped_bass: CO },
  MD: { largemouth_bass: LR, smallmouth_bass: LR, walleye: L, striped_bass: RCO, seatrout: CO, redfish: CO },
  MA: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: L, pike_musky: L, striped_bass: CO },
  MI: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: LR, pike_musky: LR },
  MN: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: LR, pike_musky: LR },
  MS: { largemouth_bass: LR, striped_bass: L, redfish: C, seatrout: C },
  MO: { largemouth_bass: LR, smallmouth_bass: R, walleye: LR, pike_musky: L, striped_bass: L },
  MT: { largemouth_bass: L, smallmouth_bass: LR, river_trout: R, walleye: L, pike_musky: LR },
  NE: { largemouth_bass: L, smallmouth_bass: R, walleye: LR, pike_musky: L, striped_bass: L },
  NV: { largemouth_bass: L, smallmouth_bass: LR, walleye: L, striped_bass: L },
  NH: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: L, pike_musky: L, striped_bass: CO },
  NJ: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: L, pike_musky: L, striped_bass: CO, seatrout: CO },
  NM: { largemouth_bass: L, smallmouth_bass: LR, river_trout: R, walleye: L },
  NY: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: LR, pike_musky: LR, striped_bass: CO },
  NC: { largemouth_bass: LR, smallmouth_bass: R, river_trout: R, walleye: L, striped_bass: LCO, redfish: C, seatrout: C, tarpon: CO },
  ND: { largemouth_bass: L, smallmouth_bass: R, walleye: LR, pike_musky: LR },
  OH: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: LR, pike_musky: LR, striped_bass: L },
  OK: { largemouth_bass: LR, smallmouth_bass: R, walleye: L, striped_bass: L },
  OR: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: L, striped_bass: RCO },
  PA: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: LR, pike_musky: LR, striped_bass: CO },
  RI: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, striped_bass: CO },
  SC: { largemouth_bass: LR, smallmouth_bass: R, walleye: L, striped_bass: LCO, redfish: C, seatrout: C, tarpon: CO },
  SD: { largemouth_bass: L, smallmouth_bass: R, walleye: LR, pike_musky: LR },
  TN: { largemouth_bass: LR, smallmouth_bass: LR, walleye: L, striped_bass: L, river_trout: R },
  TX: { largemouth_bass: LR, smallmouth_bass: R, walleye: L, striped_bass: L, redfish: C, seatrout: C, snook: C, tarpon: CO },
  UT: { largemouth_bass: L, smallmouth_bass: LR, river_trout: R, walleye: L, striped_bass: L },
  VT: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: L, pike_musky: L },
  VA: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: L, striped_bass: LCO, redfish: CO, seatrout: CO },
  WA: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: L, striped_bass: CO },
  WV: { largemouth_bass: LR, smallmouth_bass: R, river_trout: R, walleye: LR, pike_musky: L },
  WI: { largemouth_bass: LR, smallmouth_bass: LR, river_trout: R, walleye: LR, pike_musky: LR },
  WY: { largemouth_bass: L, smallmouth_bass: LR, river_trout: R, walleye: L, pike_musky: L },
};

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
