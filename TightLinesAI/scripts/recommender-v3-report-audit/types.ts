/**
 * Types for the Recommender V3 report-audit harness.
 *
 * A scenario describes a realistic guide-level fishing situation for a given
 * species in a prime region during a commonly-fished month. Each scenario is
 * hand-curated to represent typical environmental conditions so the auditor
 * can focus on the semantic quality of the engine's output.
 *
 * Scenarios are consumed by scripts/recommender-v3-report-audit/runAudit.ts.
 */

import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type {
  SpeciesGroup,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/index.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/input.ts";

export type ReportAuditSpecies =
  | "smallmouth_bass"
  | "largemouth_bass"
  | "pike_musky"
  | "river_trout";

/**
 * One-line summary of the day a guide would narrate. Used as the scenario's
 * "intent" so the auditor knows what the harness was trying to simulate and
 * can judge the engine's output against that expectation.
 */
export type ScenarioConditionProfile =
  | "stable_high_pressure_clear"
  | "post_front_bluebird"
  | "pre_front_falling_pressure"
  | "overcast_windy_warm"
  | "stable_cold_clear"
  | "cold_snap_stained"
  | "spring_spawn_warming"
  | "summer_peak_hot"
  | "fall_feed_cooling"
  | "runoff_muddy_cold"
  | "early_season_cold_clear"
  | "ice_out_postwinter";

export type ReportAuditScenario = {
  /** Stable short id used in filenames. Format: `<species-prefix>-<NN>-<slug>`. */
  id: string;
  /** Human-readable one-line title. */
  title: string;
  /** Guide-level narrative: "why this scenario matters / what should the engine read it as". */
  intent: string;
  species: ReportAuditSpecies;
  context: EngineContext;
  water_clarity: WaterClarity;
  /** Shorthand tag describing the day's environmental character. */
  condition_profile: ScenarioConditionProfile;
  location: {
    region_key: RegionKey;
    state_code: string;
    latitude: number;
    longitude: number;
    timezone: string;
    local_date: string;
    /** Month 1-12 (must match local_date). */
    month: number;
  };
  /**
   * Hand-curated environmental inputs, shape matches SharedEngineRequest.environment.
   * Authored to represent typical conditions for this region/month/profile.
   */
  environment: SharedEngineRequest["environment"];
};

export type ReportAuditScenarioSet = {
  species: ReportAuditSpecies;
  species_display_name: string;
  primary_regions_rationale: string;
  commonly_fished_months_rationale: string;
  scenarios: ReportAuditScenario[];
};

export const SPECIES_TO_LEGACY_GROUP: Record<ReportAuditSpecies, SpeciesGroup> = {
  smallmouth_bass: "smallmouth_bass",
  largemouth_bass: "largemouth_bass",
  pike_musky: "pike_musky",
  river_trout: "river_trout",
};
