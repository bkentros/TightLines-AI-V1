/**
 * Recommender frontend contracts — mirror of backend output types.
 * These are copy-typed here so the frontend has no dependency on the
 * Deno/edge-function module system.
 *
 * Backend entry: `supabase/functions/recommender/index.ts` — daily-picks 2x2.
 * Maintenance map: `docs/recommender-daily-picks-maintenance.md`.
 */

import { STATE_SPECIES_CONTEXTS as GENERATED_STATE_SPECIES_CONTEXTS } from './generated/recommenderStateSpecies';

export const DAILY_PICKS_RESPONSE_FEATURE = "recommender_daily_picks_2x2_future" as const;
export const DAILY_PICKS_RESPONSE_VERSION = "daily_picks_2x2_response_v1" as const;
export const DAILY_PICKS_SESSION_ENGINE_VERSION = "recommender_daily_picks_2x2_sessionv1_goalv1" as const;

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
export type RecommendationGoal = "all_purpose" | "big_fish";

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

export const DAILY_PICKS_UI_SPECIES: SpeciesGroup[] = [
  "largemouth_bass",
  "smallmouth_bass",
  "pike_musky",
  "river_trout",
];

export const DAILY_PICKS_UI_CONTEXTS: EngineContext[] = [
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
  return getSpeciesForState(state_code).filter((species) => DAILY_PICKS_UI_SPECIES.includes(species));
}

export function getRecommenderContextsForStateSpecies(
  state_code: string,
  species: SpeciesGroup,
): EngineContext[] {
  return getContextsForStateSpecies(state_code, species)
    .filter((context) => DAILY_PICKS_UI_CONTEXTS.includes(context));
}

export function getRecommenderContextsForState(state_code: string): EngineContext[] {
  return getContextsForState(state_code).filter((context) => DAILY_PICKS_UI_CONTEXTS.includes(context));
}

export function isDailyPicksUiSpecies(species: string): species is SpeciesGroup {
  return DAILY_PICKS_UI_SPECIES.includes(species as SpeciesGroup);
}

export function isDailyPicksUiContext(context: string): context is EngineContext {
  return DAILY_PICKS_UI_CONTEXTS.includes(context as EngineContext);
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

export type DailyPicksSpecies =
  | "largemouth_bass"
  | "smallmouth_bass"
  | "northern_pike"
  | "trout";

export type DailyPicksActivityLevel =
  | "suppressed"
  | "neutral"
  | "active"
  | "high_opportunity";

export type DailyPicksSurfaceGate = "closed" | "caution" | "open";
export type DailyPicksConfidence = "low" | "medium" | "high";

export type DailyPicksConditionTag =
  | "calm_surface"
  | "low_light_surface"
  | "wind_reaction"
  | "dirty_vibration"
  | "clear_subtle"
  | "cold_slow"
  | "warming_search"
  | "heat_finesse"
  | "runoff_streamer"
  | "current_swing"
  | "cover_ambush"
  | "open_water_search";

export type DailyPickSlot =
  | "lure_of_the_day"
  | "honorable_lure"
  | "fly_of_the_day"
  | "honorable_fly";

export type DailyPicksVariant = "A" | "B";

export type DailyPicksResponsePick = {
  slot: DailyPickSlot;
  id: string;
  display_name: string;
  gear_mode: "lure" | "fly";
  family_group: string;
  presentation_group: string;
  column: TacticalColumn;
  primary_pace: TacticalPace;
  secondary_pace?: TacticalPace;
  is_surface: boolean;
  score: number;
  score_reasons: string[];
  why_chosen: string;
  how_to_fish: string;
};

export type DailyPicksScenarioSummary = {
  activity_level: DailyPicksActivityLevel;
  surface_daily_gate: DailyPicksSurfaceGate;
  surface_daily_reason_codes: string[];
  scenario_tags: DailyPicksConditionTag[];
  missing_inputs: string[];
  confidence: DailyPicksConfidence;
};

export type DailyPicksFamilyDiversitySideDiagnostics = {
  top_family_group: string;
  honorable_family_group: string;
  different_family_selected: boolean;
  different_family_available_in_band: boolean;
};

export type DailyPicksFamilyDiversityDiagnostics = {
  lures: DailyPicksFamilyDiversitySideDiagnostics;
  flies: DailyPicksFamilyDiversitySideDiagnostics;
};

export type DailyPicksDiagnostics = {
  row_authored_lure_count: number;
  row_authored_fly_count: number;
  hard_gated_lure_candidate_count: number;
  hard_gated_fly_candidate_count: number;
  selected_lure_ids: string[];
  selected_fly_ids: string[];
  variant: DailyPicksVariant;
  avoid_lure_ids_applied: string[];
  avoid_fly_ids_applied: string[];
  scenario_tags: DailyPicksConditionTag[];
  surface_daily_gate: DailyPicksSurfaceGate;
  confidence: DailyPicksConfidence;
  missing_inputs: string[];
  family_diversity: DailyPicksFamilyDiversityDiagnostics;
};

export type DailyPicksRecommendationSession = {
  local_date: string;
  variant: DailyPicksVariant;
  available_variants: DailyPicksVariant[];
  can_refresh: boolean;
  refreshes_remaining: 0 | 1;
  locked_until: string;
};

export type DailyPicksResponse = {
  feature: typeof DAILY_PICKS_RESPONSE_FEATURE;
  engine_version: typeof DAILY_PICKS_RESPONSE_VERSION;
  species: DailyPicksSpecies;
  context: EngineContext;
  water_type: EngineContext;
  water_clarity: WaterClarity;
  recommendation_goal: RecommendationGoal;
  local_date: string;
  region_key: string;
  month: number;
  scenario_summary: DailyPicksScenarioSummary;
  diagnostics: DailyPicksDiagnostics;
  picks: Record<DailyPickSlot, DailyPicksResponsePick>;
  generated_at: string;
  cache_expires_at: string;
  recommendation_session: DailyPicksRecommendationSession;
};

export type RecommenderResponse = DailyPicksResponse;

export function isDailyPicksResponse(
  result: RecommenderResponse | unknown,
): result is DailyPicksResponse {
  if (!result || typeof result !== "object") return false;
  const maybe = result as Partial<DailyPicksResponse>;
  return (
    maybe.feature === DAILY_PICKS_RESPONSE_FEATURE &&
    maybe.engine_version === DAILY_PICKS_RESPONSE_VERSION &&
    maybe.picks != null &&
    typeof maybe.picks.lure_of_the_day?.id === "string" &&
    typeof maybe.picks.honorable_lure?.id === "string" &&
    typeof maybe.picks.fly_of_the_day?.id === "string" &&
    typeof maybe.picks.honorable_fly?.id === "string"
  );
}

// ─── Request shape (what the frontend sends) ──────────────────────────────────

export type RecommenderCallParams = {
  latitude: number;
  longitude: number;
  state_code: string;
  species: SpeciesGroup;
  context: EngineContext;
  water_clarity: WaterClarity;
  recommendation_goal?: RecommendationGoal;
  env_data: Record<string, unknown>;
  target_date?: string;
};
