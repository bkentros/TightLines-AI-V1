/**
 * Recommender frontend contracts — mirror of backend output types.
 * These are copy-typed here so the frontend has no dependency on the
 * Deno/edge-function module system.
 *
 * Backend entry: `supabase/functions/recommender/index.ts` — deterministic rebuild (`recommender_rebuild`).
 * Architecture plan: `docs/tightlines_recommender_architecture_clean.md`.
 */

import { STATE_SPECIES_CONTEXTS as GENERATED_STATE_SPECIES_CONTEXTS } from './generated/recommenderStateSpecies';

export const RECOMMENDER_FEATURE = "recommender_rebuild" as const;
export const RECOMMENDER_DAILY_SESSION_ENGINE_VERSION = "recommender_rebuild_tacv3_sessionv2" as const;

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
  if (!map) return [];
  return SPECIES_GROUPS.filter((sp) => sp in map);
}

/**
 * Returns the valid contexts for a given state + species combo.
 * Returns an empty array when the state or species is unknown.
 */
export function getContextsForStateSpecies(
  state_code: string,
  species: SpeciesGroup,
): EngineContext[] {
  const map = STATE_SPECIES_CONTEXTS[state_code.toUpperCase()];
  if (!map) return [];
  return map[species] ?? [];
}

/**
 * Returns all contexts available in a state for any species.
 * Used to filter context chips before a species is selected.
 */
export function getContextsForState(state_code: string): EngineContext[] {
  const map = STATE_SPECIES_CONTEXTS[state_code.toUpperCase()];
  if (!map) return [];
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

export type ForageMode =
  | "baitfish"
  | "crawfish"
  | "leech"
  | "leech_worm"
  | "bluegill_perch"
  | "insect_misc"
  | "surface_prey";

export type TacticalColumn = "bottom" | "mid" | "upper" | "surface";
export type TacticalPace = "slow" | "medium" | "fast";
export type TacticalPresence = "subtle" | "moderate" | "bold";

export type RankedRecommendation = {
  id: string;
  display_name: string;
  family_group: string;
  color_style: string;
  why_chosen: string;
  how_to_fish: string;
  primary_column: TacticalColumn;
  pace: TacticalPace;
  presence: TacticalPresence;
  is_surface: boolean;
  /** Rebuild: which shared daily tactical slot (0–2) this pick satisfied. */
  source_slot_index?: number;
};

export type DailyPostureBand =
  | "suppressed"
  | "slightly_suppressed"
  | "neutral"
  | "slightly_aggressive"
  | "aggressive";

export type DailySurfaceWindow = "closed" | "clean" | "rippled";
export type OpportunityMixMode = "conservative" | "balanced" | "aggressive";

export type RecommenderSessionSummary = {
  monthly_forage: {
    primary: ForageMode;
    secondary?: ForageMode;
  };
  /** Rebuild responses: Natural / Dark / Bright — aligns with card `color_style`. */
  session_color_theme_label?: string;
  monthly_baseline: {
    allowed_columns: TacticalColumn[];
    allowed_paces: TacticalPace[];
    allowed_presence: TacticalPresence[];
    surface_seasonally_possible: boolean;
  };
  daily_tactical_preference: {
    posture_band: DailyPostureBand;
    preferred_column: TacticalColumn;
    secondary_column?: TacticalColumn;
    preferred_pace: TacticalPace;
    secondary_pace?: TacticalPace;
    preferred_presence: TacticalPresence;
    secondary_presence?: TacticalPresence;
    surface_allowed_today: boolean;
    surface_window: DailySurfaceWindow;
    opportunity_mix: OpportunityMixMode;
  };
};

export type RecommenderFeatureId =
  | typeof RECOMMENDER_FEATURE
  | "recommender_v3";

export type RecommenderResponse = {
  feature: RecommenderFeatureId;
  species: SpeciesGroup;
  context: EngineContext;
  water_clarity: WaterClarity;
  generated_at: string;
  cache_expires_at: string;
  recommendation_session: {
    local_date: string;
    variant: 'A' | 'B';
    can_refresh: boolean;
    refreshes_remaining: 0 | 1;
    locked_until: string;
  };
  summary: RecommenderSessionSummary;
  lure_recommendations: RankedRecommendation[];
  fly_recommendations: RankedRecommendation[];
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
  target_date?: string;
};
