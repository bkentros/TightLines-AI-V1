#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 3C parity audit for production Rain / Precip V2 and River Hydrology V2.
 *
 * Production normalizers should now match the experiment modules exactly. This
 * script replaces only precipitation_disruption/runoff_flow_disruption in
 * memory with the experiment modules and verifies parity.
 */

import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import {
  CANONICAL_REGION_KEYS,
  type RegionKey,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type {
  ScoredVariableKey,
  SharedEngineRequest,
  SharedNormalizedOutput,
  VariableState,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import {
  isCoastalFamilyContext,
  SCORED_VARIABLE_KEYS_BY_CONTEXT,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import type { ReliabilityTierNormalized } from "../../supabase/functions/_shared/howFishingEngine/contracts/normalized.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { normalizePrecipitationDisruptionV2 } from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizePrecipV2.ts";
import {
  DEFAULT_RUNOFF_V2_CALIBRATION,
  normalizeRunoffV2,
  type RunoffV2Calibration,
} from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizeRunoffV2.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import type { ActiveVariableScore } from "../../supabase/functions/_shared/howFishingEngine/score/types.ts";
import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type { RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-rain-runoff-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-rain-runoff-audit.md";
const EPSILON = 1e-6;

const PERFECT_CLEAR_MAX_CANDIDATES = [0.25, 0.35, 0.45, 0.55] as const;
const STABLE_MAX_CANDIDATES = [0.15, 0.25, 0.35] as const;

const CONTEXTS: readonly EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];

type RegionMeta = { lat: number; lon: number; state: string; tz: string };
const REGION_META: Record<RegionKey, RegionMeta> = {
  northeast: { lat: 42.3, lon: -71.1, state: "MA", tz: "America/New_York" },
  southeast_atlantic: {
    lat: 32.8,
    lon: -79.9,
    state: "SC",
    tz: "America/New_York",
  },
  florida: { lat: 27.9, lon: -82.5, state: "FL", tz: "America/New_York" },
  gulf_coast: { lat: 29.9, lon: -90.1, state: "LA", tz: "America/Chicago" },
  great_lakes_upper_midwest: {
    lat: 44.3,
    lon: -84.7,
    state: "MI",
    tz: "America/Detroit",
  },
  midwest_interior: {
    lat: 40.0,
    lon: -86.2,
    state: "IN",
    tz: "America/Indiana/Indianapolis",
  },
  south_central: { lat: 30.3, lon: -97.7, state: "TX", tz: "America/Chicago" },
  mountain_west: { lat: 40.7, lon: -111.9, state: "UT", tz: "America/Denver" },
  southwest_desert: {
    lat: 33.4,
    lon: -112.0,
    state: "AZ",
    tz: "America/Phoenix",
  },
  southwest_high_desert: {
    lat: 35.1,
    lon: -106.7,
    state: "NM",
    tz: "America/Denver",
  },
  pacific_northwest: {
    lat: 47.6,
    lon: -122.3,
    state: "WA",
    tz: "America/Los_Angeles",
  },
  southern_california: {
    lat: 34.0,
    lon: -118.2,
    state: "CA",
    tz: "America/Los_Angeles",
  },
  mountain_alpine: {
    lat: 39.6,
    lon: -105.9,
    state: "CO",
    tz: "America/Denver",
  },
  northern_california: {
    lat: 38.3,
    lon: -123.0,
    state: "CA",
    tz: "America/Los_Angeles",
  },
  appalachian: { lat: 38.4, lon: -81.6, state: "WV", tz: "America/New_York" },
  inland_northwest: {
    lat: 47.7,
    lon: -117.4,
    state: "WA",
    tz: "America/Los_Angeles",
  },
  alaska: { lat: 61.2, lon: -149.9, state: "AK", tz: "America/Anchorage" },
  hawaii: { lat: 21.3, lon: -157.8, state: "HI", tz: "Pacific/Honolulu" },
};

type RainArchetypeId =
  | "dry_clear"
  | "trace_mist_dry"
  | "light_active_rain"
  | "moderate_active_rain"
  | "heavy_active_rain"
  | "recent_rain_clearing"
  | "wet_baseline_no_active"
  | "saturated_baseline"
  | "flashy_24h_event"
  | "long_wet_week_low_24h"
  | "missing_24h"
  | "missing_72h"
  | "missing_7d";

type RainArchetype = {
  id: RainArchetypeId;
  rate: number | null;
  active: boolean;
  p24: number | null;
  p72: number | null;
  p7d: number | null;
};

const ARCHETYPES: readonly RainArchetype[] = [
  { id: "dry_clear", rate: 0, active: false, p24: 0, p72: 0, p7d: 0 },
  {
    id: "trace_mist_dry",
    rate: 0.005,
    active: false,
    p24: 0.04,
    p72: 0.12,
    p7d: 0.30,
  },
  {
    id: "light_active_rain",
    rate: 0.02,
    active: true,
    p24: 0.08,
    p72: 0.15,
    p7d: 0.40,
  },
  {
    id: "moderate_active_rain",
    rate: 0.06,
    active: true,
    p24: 0.35,
    p72: 0.70,
    p7d: 1.20,
  },
  {
    id: "heavy_active_rain",
    rate: 0.15,
    active: true,
    p24: 1.00,
    p72: 2.00,
    p7d: 4.00,
  },
  {
    id: "recent_rain_clearing",
    rate: 0,
    active: false,
    p24: 0.05,
    p72: 0.60,
    p7d: 1.00,
  },
  {
    id: "wet_baseline_no_active",
    rate: 0,
    active: false,
    p24: 0.05,
    p72: 1.20,
    p7d: 3.00,
  },
  {
    id: "saturated_baseline",
    rate: 0,
    active: false,
    p24: 0.20,
    p72: 2.20,
    p7d: 6.00,
  },
  {
    id: "flashy_24h_event",
    rate: 0,
    active: false,
    p24: 0.70,
    p72: 0.90,
    p7d: 1.20,
  },
  {
    id: "long_wet_week_low_24h",
    rate: 0,
    active: false,
    p24: 0,
    p72: 0.30,
    p7d: 4.00,
  },
  {
    id: "missing_24h",
    rate: null,
    active: false,
    p24: null,
    p72: 0.50,
    p7d: 1.00,
  },
  {
    id: "missing_72h",
    rate: null,
    active: false,
    p24: 0.10,
    p72: null,
    p7d: 1.00,
  },
  {
    id: "missing_7d",
    rate: null,
    active: false,
    p24: 0.10,
    p72: 0.50,
    p7d: null,
  },
];

type VariableSnapshot =
  | { label: string; score: number; detail: string | null }
  | null;
type ContributionSnapshot = {
  score: number;
  label: string;
  weight: number;
  weighted_contribution: number;
} | null;
type RecommenderSide = {
  activity_level: string;
  water_movement_mode: string;
  surface_daily_gate: string;
  scenario_tags: readonly string[];
  selected_lure_ids: readonly string[];
  selected_fly_ids: readonly string[];
};
type RecommenderComparison =
  | {
    species: SpeciesGroup;
    baseline: RecommenderSide;
    v2: RecommenderSide;
    activity_changed: boolean;
    water_movement_changed: boolean;
    surface_gate_changed: boolean;
    tags_changed: boolean;
    selected_pick_ids_changed: boolean;
  }
  | { species: SpeciesGroup; error: string }
  | null;

type VariableAvailability = {
  available_variables: string[];
  missing_variables: string[];
  data_gaps: SharedNormalizedOutput["data_gaps"];
  reliability: ReliabilityTierNormalized;
};

type SweepSummary = {
  calibration: RunoffV2Calibration;
  rows: number;
  avg_delta: number;
  max_delta: number;
  min_delta: number;
  abs_delta_gte_8: number;
  abs_delta_gte_12: number;
  activity_tier_changes: number;
  reliability_changes: number;
  availability_mismatch_count: number;
  recommender_valid: number;
  recommender_selected_pick_changes: number;
  recommender_selected_pick_change_percent: number;
  recommender_water_movement_changes: number;
  light_active_rain_active_disruption_v2: number;
  wet_baseline_not_penalized_enough_v2: number;
  missing_river_hydrology_v2: number;
  spring_snowmelt_risk_not_reflected_v2: number;
};

type AuditRow = {
  region: RegionKey;
  month: number;
  context: EngineContext;
  archetype_id: RainArchetypeId;
  precip_inputs: {
    precip_rate_now_in_per_hr: number | null;
    active_precip_now: boolean;
    precip_24h_in: number | null;
    precip_72h_in: number | null;
    precip_7d_in: number | null;
  };
  baseline_score: number;
  v2_score: number;
  score_delta: number;
  baseline_activity_tier: string;
  v2_activity_tier: string;
  activity_tier_changed: boolean;
  baseline_reliability: string;
  v2_reliability: string;
  reliability_changed: boolean;
  baseline_precipitation: VariableSnapshot;
  v2_precipitation: VariableSnapshot;
  baseline_runoff: VariableSnapshot;
  v2_runoff: VariableSnapshot;
  baseline_contributions: {
    precipitation_disruption: ContributionSnapshot;
    runoff_flow_disruption: ContributionSnapshot;
  };
  v2_contributions: {
    precipitation_disruption: ContributionSnapshot;
    runoff_flow_disruption: ContributionSnapshot;
  };
  baseline_available_variables: string[];
  baseline_missing_variables: string[];
  baseline_data_gaps: SharedNormalizedOutput["data_gaps"];
  v2_available_variables: string[];
  v2_missing_variables: string[];
  v2_data_gaps: SharedNormalizedOutput["data_gaps"];
  v2_availability_mismatch: boolean;
  baseline_questionable_flags: string[];
  v2_questionable_flags: string[];
  recommender: RecommenderComparison;
};

function pressureHistory(): number[] {
  return Array.from({ length: 48 }, () => 1014);
}

function tideHighLow(month: number) {
  const m = String(month).padStart(2, "0");
  return [
    { time: `2026-${m}-15T05:30:00`, value: 0.2, type: "L" },
    { time: `2026-${m}-15T11:45:00`, value: 2.5, type: "H" },
    { time: `2026-${m}-15T18:10:00`, value: 0.3, type: "L" },
  ];
}

function buildRequest(
  region: RegionKey,
  month: number,
  context: EngineContext,
  archetype: RainArchetype,
): SharedEngineRequest {
  const meta = REGION_META[region];
  const localDate = `2026-${String(month).padStart(2, "0")}-15`;
  const coastal = context === "coastal" || context === "coastal_flats_estuary";
  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: region,
    local_date: localDate,
    local_timezone: meta.tz,
    context,
    environment: {
      current_air_temp_f: 68,
      daily_mean_air_temp_f: 68,
      daily_low_air_temp_f: 60,
      daily_high_air_temp_f: 76,
      prior_day_mean_air_temp_f: 68,
      day_minus_2_mean_air_temp_f: 68,
      pressure_mb: 1014,
      pressure_history_mb: pressureHistory(),
      wind_speed_mph: 8,
      cloud_cover_pct: archetype.active ? 88 : 55,
      precip_rate_now_in_per_hr: archetype.rate,
      active_precip_now: archetype.active,
      precip_24h_in: archetype.p24,
      precip_72h_in: archetype.p72,
      precip_7d_in: archetype.p7d,
      tide_movement_state: coastal ? "incoming" : null,
      current_speed_knots_max: coastal ? 1.1 : null,
      tide_high_low: coastal ? tideHighLow(month) : null,
      tide_height_hourly_ft: null,
    },
    data_coverage: { source_notes: [] },
  };
}

function variableSnapshot(state: VariableState | undefined): VariableSnapshot {
  if (!state) return null;
  return {
    label: state.label,
    score: state.score,
    detail: state.detail ?? null,
  };
}

function contributionSnapshot(
  contributions: ActiveVariableScore[],
  key: ScoredVariableKey,
): ContributionSnapshot {
  const contribution = contributions.find((c) => c.key === key);
  if (!contribution) return null;
  return {
    score: contribution.score,
    label: contribution.label,
    weight: contribution.weight,
    weighted_contribution: contribution.weightedContribution,
  };
}

const NORMALIZED_KEY_BY_SCORED_KEY: Record<
  ScoredVariableKey,
  keyof SharedNormalizedOutput["normalized"]
> = {
  temperature_condition: "temperature",
  pressure_regime: "pressure_regime",
  wind_condition: "wind_condition",
  light_cloud_condition: "light_cloud_condition",
  precipitation_disruption: "precipitation_disruption",
  runoff_flow_disruption: "runoff_flow_disruption",
  tide_current_movement: "tide_current_movement",
};

function buildDataGapsForAudit(
  context: EngineContext,
  missing: string[],
  runoffGapReason: "absent" | "incomplete_precip_windows",
): SharedNormalizedOutput["data_gaps"] {
  const expected = SCORED_VARIABLE_KEYS_BY_CONTEXT[context];
  return expected.filter((key) => missing.includes(key)).map((key) => ({
    variable_key: key as ScoredVariableKey,
    reason: key === "runoff_flow_disruption" &&
        runoffGapReason === "incomplete_precip_windows"
      ? "incomplete_precip_windows"
      : "absent",
  }));
}

function downgradeOnce(
  tier: ReliabilityTierNormalized,
): ReliabilityTierNormalized {
  return tier === "high" ? "medium" : "low";
}

function minTier(
  a: ReliabilityTierNormalized,
  b: ReliabilityTierNormalized,
): ReliabilityTierNormalized {
  const order = { low: 0, medium: 1, high: 2 };
  return order[a] <= order[b] ? a : b;
}

function computeAuditReliability(
  context: EngineContext,
  available: string[],
  missing: string[],
  normalized: SharedNormalizedOutput["normalized"],
): ReliabilityTierNormalized {
  const n = available.length;
  if (n < 3) return "low";

  let tier: ReliabilityTierNormalized = n <= 4 ? "medium" : "high";
  const core = [...SCORED_VARIABLE_KEYS_BY_CONTEXT[context]];
  const missingCore = core.filter((key) => missing.includes(key));
  if (missingCore.length >= 2) tier = minTier(tier, "medium");
  if (missingCore.length >= 3) tier = "low";

  if (
    isCoastalFamilyContext(context) && missing.includes("tide_current_movement")
  ) {
    tier = minTier(tier, "medium");
  }
  if (
    isCoastalFamilyContext(context) &&
    normalized.temperature?.measurement_source === "air_daily_mean"
  ) {
    tier = downgradeOnce(tier);
  }
  return tier;
}

function variableAvailabilityFromNormalized(
  req: SharedEngineRequest,
  normalized: SharedNormalizedOutput["normalized"],
): VariableAvailability {
  const expected = SCORED_VARIABLE_KEYS_BY_CONTEXT[req.context];
  const available: string[] = [];
  const missing: string[] = [];
  for (const key of expected) {
    const normalizedKey =
      NORMALIZED_KEY_BY_SCORED_KEY[key as ScoredVariableKey];
    if (normalized[normalizedKey]) available.push(key);
    else missing.push(key);
  }

  const e = req.environment;
  const riverPrecipPartial = req.context === "freshwater_river" &&
    (e.precip_24h_in != null || e.precip_72h_in != null ||
      e.precip_7d_in != null) &&
    (e.precip_24h_in == null || e.precip_72h_in == null ||
      e.precip_7d_in == null);
  const runoffGapReason: "absent" | "incomplete_precip_windows" =
    req.context === "freshwater_river" &&
      missing.includes("runoff_flow_disruption") && riverPrecipPartial
      ? "incomplete_precip_windows"
      : "absent";

  return {
    available_variables: available,
    missing_variables: missing,
    data_gaps: buildDataGapsForAudit(req.context, missing, runoffGapReason),
    reliability: computeAuditReliability(
      req.context,
      available,
      missing,
      normalized,
    ),
  };
}

function hasAvailabilityMismatch(
  req: SharedEngineRequest,
  norm: SharedNormalizedOutput,
): boolean {
  const availability = variableAvailabilityFromNormalized(req, norm.normalized);
  return JSON.stringify(availability.available_variables) !==
      JSON.stringify(norm.available_variables) ||
    JSON.stringify(availability.missing_variables) !==
      JSON.stringify(norm.missing_variables) ||
    JSON.stringify(availability.data_gaps) !== JSON.stringify(norm.data_gaps) ||
    availability.reliability !== norm.reliability;
}

function cloneWithRainRunoffV2(
  req: SharedEngineRequest,
  norm: SharedNormalizedOutput,
  calibration: RunoffV2Calibration,
): SharedNormalizedOutput {
  const e = req.environment;
  const month = Number.parseInt(req.local_date.slice(5, 7), 10);
  const normalized = { ...norm.normalized };
  if (req.context === "freshwater_lake_pond") {
    const precip = normalizePrecipitationDisruptionV2(
      "freshwater_lake_pond",
      e.precip_rate_now_in_per_hr,
      e.precip_24h_in,
      e.precip_72h_in,
      e.active_precip_now,
      e.precip_7d_in,
    );
    if (precip) normalized.precipitation_disruption = precip;
    else delete normalized.precipitation_disruption;
  } else if (
    req.context === "coastal" || req.context === "coastal_flats_estuary"
  ) {
    const precip = normalizePrecipitationDisruptionV2(
      req.context,
      e.precip_rate_now_in_per_hr,
      e.precip_24h_in,
      e.precip_72h_in,
      e.active_precip_now,
      e.precip_7d_in,
    );
    if (precip) normalized.precipitation_disruption = precip;
    else delete normalized.precipitation_disruption;
  } else if (req.context === "freshwater_river") {
    const runoff = normalizeRunoffV2(
      req.region_key,
      month,
      e.precip_24h_in,
      e.precip_72h_in,
      e.precip_7d_in,
      calibration,
    );
    if (runoff) normalized.runoff_flow_disruption = runoff;
    else delete normalized.runoff_flow_disruption;
  }
  const availability = variableAvailabilityFromNormalized(req, normalized);
  return { ...norm, normalized, ...availability };
}

function speciesForContext(context: EngineContext): SpeciesGroup | null {
  if (context === "freshwater_lake_pond") return "largemouth_bass";
  if (context === "freshwater_river") return "trout";
  return null;
}

function recommenderCompare(args: {
  req: SharedEngineRequest;
  baselineNorm: SharedNormalizedOutput;
  baselineScored: ReturnType<typeof scoreDay>;
  v2Norm: SharedNormalizedOutput;
  v2Scored: ReturnType<typeof scoreDay>;
}): RecommenderComparison {
  const species = speciesForContext(args.req.context);
  if (!species) return null;
  try {
    const month = Number.parseInt(args.req.local_date.slice(5, 7), 10);
    const recReq: RecommenderRequest = {
      location: {
        latitude: args.req.latitude,
        longitude: args.req.longitude,
        state_code: args.req.state_code ?? "XX",
        region_key: args.req.region_key,
        local_date: args.req.local_date,
        local_timezone: args.req.local_timezone,
        month,
      },
      species,
      context: args.req.context,
      water_clarity: "stained",
      recommendation_goal: "all_purpose",
      env_data: {
        ...args.req.environment,
        weather: { wind_speed_unit: "mph" },
      },
    };
    const baselineAnalysis = analyzeRecommenderConditions(recReq);
    const row = resolveDailyPicksSeasonalRow({
      species,
      region_key: args.req.region_key,
      month,
      water_type: args.req.context,
    });
    const seed =
      `rain-runoff|${args.req.region_key}|${args.req.local_date}|${args.req.context}`;
    const run = (
      norm: SharedNormalizedOutput,
      scored: ReturnType<typeof scoreDay>,
    ) =>
      runDailyPicksEngine({
        req: recReq,
        analysis: {
          ...baselineAnalysis,
          norm,
          scored,
        } as SharedConditionAnalysis,
        seasonalRow: row,
        seed,
        variant: "A",
      });
    const baseline = run(args.baselineNorm, args.baselineScored);
    const v2 = run(args.v2Norm, args.v2Scored);
    const snap = (result: typeof baseline): RecommenderSide => ({
      activity_level: result.scenario.activity_level,
      water_movement_mode: result.scenario.water_movement_mode,
      surface_daily_gate: result.scenario.surface_daily_gate,
      scenario_tags: result.scenario.scenario_tags,
      selected_lure_ids: result.diagnostics.selected_lure_ids,
      selected_fly_ids: result.diagnostics.selected_fly_ids,
    });
    const b = snap(baseline);
    const v = snap(v2);
    const bPicks = [...b.selected_lure_ids, ...b.selected_fly_ids];
    const vPicks = [...v.selected_lure_ids, ...v.selected_fly_ids];
    return {
      species,
      baseline: b,
      v2: v,
      activity_changed: b.activity_level !== v.activity_level,
      water_movement_changed: b.water_movement_mode !== v.water_movement_mode,
      surface_gate_changed: b.surface_daily_gate !== v.surface_daily_gate,
      tags_changed:
        JSON.stringify(b.scenario_tags) !== JSON.stringify(v.scenario_tags),
      selected_pick_ids_changed:
        JSON.stringify(bPicks) !== JSON.stringify(vPicks),
    };
  } catch (error) {
    return {
      species,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const HIGH_SENSITIVITY_REGIONS = new Set<RegionKey>([
  "northeast",
  "great_lakes_upper_midwest",
  "midwest_interior",
  "southwest_desert",
  "southwest_high_desert",
  "pacific_northwest",
  "southern_california",
  "mountain_alpine",
  "northern_california",
  "appalachian",
  "alaska",
]);
const SNOWMELT_RISK_REGIONS = new Set<RegionKey>([
  "mountain_alpine",
  "alaska",
  "mountain_west",
  "pacific_northwest",
  "inland_northwest",
  "northern_california",
  "great_lakes_upper_midwest",
]);
const WET_ARCHETYPES = new Set<RainArchetypeId>([
  "moderate_active_rain",
  "heavy_active_rain",
  "recent_rain_clearing",
  "wet_baseline_no_active",
  "saturated_baseline",
  "long_wet_week_low_24h",
]);

function questionableFlags(row: {
  region: RegionKey;
  month: number;
  context: EngineContext;
  archetype: RainArchetype;
  norm: SharedNormalizedOutput;
  precip: VariableSnapshot;
  runoff: VariableSnapshot;
  precipContribution: ContributionSnapshot;
  runoffContribution: ContributionSnapshot;
  recommender: RecommenderSide | null;
  scoreDelta?: number;
}): string[] {
  const flags: string[] = [];
  const { archetype, precip, runoff } = row;
  if (
    archetype.id === "light_active_rain" &&
    precip?.label === "active_disruption"
  ) {
    flags.push("light_active_rain_active_disruption");
  }
  if (
    row.context === "freshwater_river" &&
    row.norm.data_gaps.some((gap) =>
      gap.variable_key === "runoff_flow_disruption" &&
      gap.reason === "incomplete_precip_windows"
    )
  ) {
    flags.push("river_runoff_omitted_incomplete_precip_windows");
  }
  if (
    (precip?.label === "extended_dry" || precip?.label === "dry_stable") &&
    (precip.score >= 0.25 ||
      (row.precipContribution?.weighted_contribution ?? 0) >= 6)
  ) {
    flags.push("dry_precip_state_possible_daymaker");
  }
  if (
    runoff?.label === "perfect_clear" &&
    (runoff.score >= 0.85 || (row.scoreDelta ?? 0) >= 8)
  ) {
    flags.push("perfect_clear_runoff_possible_daymaker");
  }
  if (
    (archetype.id === "wet_baseline_no_active" ||
      archetype.id === "saturated_baseline" ||
      archetype.id === "long_wet_week_low_24h") &&
    ((precip != null && precip.score > -0.4) ||
      (runoff != null && runoff.score > -0.4))
  ) {
    flags.push("wet_baseline_not_penalized_enough");
  }
  if (
    archetype.id === "flashy_24h_event" &&
    HIGH_SENSITIVITY_REGIONS.has(row.region) &&
    ((precip != null && precip.score > -0.5) ||
      (runoff != null && runoff.score > -0.5))
  ) {
    flags.push("flashy_24h_high_sensitivity_not_disruptive_enough");
  }
  if (
    row.context === "freshwater_river" &&
    row.month >= 4 && row.month <= 6 &&
    SNOWMELT_RISK_REGIONS.has(row.region) &&
    WET_ARCHETYPES.has(archetype.id) &&
    (runoff == null || runoff.score > -0.5)
  ) {
    flags.push("spring_snowmelt_or_warm_rain_risk_not_reflected");
  }
  if (
    row.recommender != null &&
    (row.recommender.water_movement_mode === "elevated_or_dirty" ||
      row.recommender.water_movement_mode === "blown_out")
  ) {
    flags.push("recommender_water_movement_coupling");
  }
  return flags;
}

function buildRows(
  calibration: RunoffV2Calibration = DEFAULT_RUNOFF_V2_CALIBRATION,
): AuditRow[] {
  const rows: AuditRow[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of CONTEXTS) {
        for (const archetype of ARCHETYPES) {
          const req = buildRequest(region, month, context, archetype);
          const baselineNorm = buildSharedNormalizedOutput(req);
          const baselineScored = scoreDay(baselineNorm);
          const v2Norm = cloneWithRainRunoffV2(req, baselineNorm, calibration);
          const v2Scored = scoreDay(v2Norm);
          const scoreDelta = v2Scored.score - baselineScored.score;
          const recommender = recommenderCompare({
            req,
            baselineNorm,
            baselineScored,
            v2Norm,
            v2Scored,
          });
          const baselineRec = recommender && !("error" in recommender)
            ? recommender.baseline
            : null;
          const v2Rec = recommender && !("error" in recommender)
            ? recommender.v2
            : null;
          const baselinePrecip = variableSnapshot(
            baselineNorm.normalized.precipitation_disruption,
          );
          const v2Precip = variableSnapshot(
            v2Norm.normalized.precipitation_disruption,
          );
          const baselineRunoff = variableSnapshot(
            baselineNorm.normalized.runoff_flow_disruption,
          );
          const v2Runoff = variableSnapshot(
            v2Norm.normalized.runoff_flow_disruption,
          );
          const baselinePrecipContribution = contributionSnapshot(
            baselineScored.contributions,
            "precipitation_disruption",
          );
          const v2PrecipContribution = contributionSnapshot(
            v2Scored.contributions,
            "precipitation_disruption",
          );
          const baselineRunoffContribution = contributionSnapshot(
            baselineScored.contributions,
            "runoff_flow_disruption",
          );
          const v2RunoffContribution = contributionSnapshot(
            v2Scored.contributions,
            "runoff_flow_disruption",
          );
          rows.push({
            region,
            month,
            context,
            archetype_id: archetype.id,
            precip_inputs: {
              precip_rate_now_in_per_hr: archetype.rate,
              active_precip_now: archetype.active,
              precip_24h_in: archetype.p24,
              precip_72h_in: archetype.p72,
              precip_7d_in: archetype.p7d,
            },
            baseline_score: baselineScored.score,
            v2_score: v2Scored.score,
            score_delta: scoreDelta,
            baseline_activity_tier: compositeScoreActivityTier(
              baselineScored.score,
            ),
            v2_activity_tier: compositeScoreActivityTier(v2Scored.score),
            activity_tier_changed:
              compositeScoreActivityTier(baselineScored.score) !==
                compositeScoreActivityTier(v2Scored.score),
            baseline_reliability: baselineNorm.reliability,
            v2_reliability: v2Norm.reliability,
            reliability_changed:
              baselineNorm.reliability !== v2Norm.reliability,
            baseline_precipitation: baselinePrecip,
            v2_precipitation: v2Precip,
            baseline_runoff: baselineRunoff,
            v2_runoff: v2Runoff,
            baseline_contributions: {
              precipitation_disruption: baselinePrecipContribution,
              runoff_flow_disruption: baselineRunoffContribution,
            },
            v2_contributions: {
              precipitation_disruption: v2PrecipContribution,
              runoff_flow_disruption: v2RunoffContribution,
            },
            baseline_available_variables: baselineNorm.available_variables,
            baseline_missing_variables: baselineNorm.missing_variables,
            baseline_data_gaps: baselineNorm.data_gaps,
            v2_available_variables: v2Norm.available_variables,
            v2_missing_variables: v2Norm.missing_variables,
            v2_data_gaps: v2Norm.data_gaps,
            v2_availability_mismatch: hasAvailabilityMismatch(req, v2Norm),
            baseline_questionable_flags: questionableFlags({
              region,
              month,
              context,
              archetype,
              norm: baselineNorm,
              precip: baselinePrecip,
              runoff: baselineRunoff,
              precipContribution: baselinePrecipContribution,
              runoffContribution: baselineRunoffContribution,
              recommender: baselineRec,
            }),
            v2_questionable_flags: questionableFlags({
              region,
              month,
              context,
              archetype,
              norm: v2Norm,
              precip: v2Precip,
              runoff: v2Runoff,
              precipContribution: v2PrecipContribution,
              runoffContribution: v2RunoffContribution,
              recommender: v2Rec,
              scoreDelta,
            }),
            recommender,
          });
        }
      }
    }
  }
  return rows;
}

function flagCounts(
  rows: AuditRow[],
  field: "baseline_questionable_flags" | "v2_questionable_flags",
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const flag of row[field]) {
      counts.set(flag, (counts.get(flag) ?? 0) + 1);
    }
  }
  return counts;
}

function flagComparisonLines(
  baseline: Map<string, number>,
  v2: Map<string, number>,
): string {
  const keys = [...new Set([...baseline.keys(), ...v2.keys()])].sort();
  return keys.map((key) => {
    const b = baseline.get(key) ?? 0;
    const n = v2.get(key) ?? 0;
    const reduction = b > 0 ? `${(((b - n) / b) * 100).toFixed(1)}%` : "n/a";
    return `| ${key} | ${b} | ${n} | ${reduction} |`;
  }).join("\n") || "| None | 0 | 0 | n/a |";
}

function labelCounts(
  rows: AuditRow[],
  side: "baseline" | "v2",
  field: "precipitation" | "runoff",
): string {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const snap = side === "baseline"
      ? field === "precipitation"
        ? row.baseline_precipitation
        : row.baseline_runoff
      : field === "precipitation"
      ? row.v2_precipitation
      : row.v2_runoff;
    const label = snap?.label ?? "omitted";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) =>
    b[1] - a[1] || a[0].localeCompare(b[0])
  ).map(([label, count]) => `| ${label} | ${count} |`).join("\n");
}

function pickChangeRows(rows: AuditRow[]): AuditRow[] {
  return rows.filter((row) =>
    row.recommender != null && !("error" in row.recommender) &&
    row.recommender.selected_pick_ids_changed
  );
}

function recommenderMetrics(rows: AuditRow[]) {
  const valid = rows.filter((row) =>
    row.recommender != null && !("error" in row.recommender)
  );
  const errors = rows.filter((row) =>
    row.recommender != null && "error" in row.recommender
  );
  const count = (
    fn: (
      r: NonNullable<Exclude<RecommenderComparison, { error: string }>>,
    ) => boolean,
  ) =>
    valid.filter((row) =>
      row.recommender != null && !("error" in row.recommender) &&
      fn(row.recommender)
    ).length;
  return {
    valid: valid.length,
    errors: errors.length,
    activity: count((r) => r.activity_changed),
    waterMovement: count((r) => r.water_movement_changed),
    surface: count((r) => r.surface_gate_changed),
    tags: count((r) => r.tags_changed),
    picks: count((r) => r.selected_pick_ids_changed),
  };
}

function variableMismatchCount(
  rows: AuditRow[],
  field: "precipitation" | "runoff",
): number {
  return rows.filter((row) => {
    const a = field === "precipitation"
      ? row.baseline_precipitation
      : row.baseline_runoff;
    const b = field === "precipitation" ? row.v2_precipitation : row.v2_runoff;
    if (a == null || b == null) return a !== b;
    return a.label !== b.label || Math.abs(a.score - b.score) > EPSILON;
  }).length;
}

function summarizeRows(
  rows: AuditRow[],
  calibration: RunoffV2Calibration,
): SweepSummary {
  const rec = recommenderMetrics(rows);
  const v2Flags = flagCounts(rows, "v2_questionable_flags");
  return {
    calibration,
    rows: rows.length,
    avg_delta: rows.reduce((sum, row) => sum + row.score_delta, 0) /
      rows.length,
    max_delta: Math.max(...rows.map((row) => row.score_delta)),
    min_delta: Math.min(...rows.map((row) => row.score_delta)),
    abs_delta_gte_8: rows.filter((row) => Math.abs(row.score_delta) >= 8)
      .length,
    abs_delta_gte_12: rows.filter((row) => Math.abs(row.score_delta) >= 12)
      .length,
    activity_tier_changes: rows.filter((row) => row.activity_tier_changed)
      .length,
    reliability_changes: rows.filter((row) => row.reliability_changed).length,
    availability_mismatch_count:
      rows.filter((row) => row.v2_availability_mismatch).length,
    recommender_valid: rec.valid,
    recommender_selected_pick_changes: rec.picks,
    recommender_selected_pick_change_percent: rec.valid > 0
      ? rec.picks / rec.valid
      : 0,
    recommender_water_movement_changes: rec.waterMovement,
    light_active_rain_active_disruption_v2:
      v2Flags.get("light_active_rain_active_disruption") ?? 0,
    wet_baseline_not_penalized_enough_v2:
      v2Flags.get("wet_baseline_not_penalized_enough") ?? 0,
    missing_river_hydrology_v2:
      v2Flags.get("river_runoff_omitted_incomplete_precip_windows") ?? 0,
    spring_snowmelt_risk_not_reflected_v2:
      v2Flags.get("spring_snowmelt_or_warm_rain_risk_not_reflected") ?? 0,
  };
}

function rankSweepCandidate(a: SweepSummary, b: SweepSummary): number {
  const aMeetsPick = a.recommender_selected_pick_change_percent <= 0.035;
  const bMeetsPick = b.recommender_selected_pick_change_percent <= 0.035;
  if (aMeetsPick !== bMeetsPick) return aMeetsPick ? -1 : 1;

  const aHardGuard = a.abs_delta_gte_12 === 0;
  const bHardGuard = b.abs_delta_gte_12 === 0;
  if (aHardGuard !== bHardGuard) return aHardGuard ? -1 : 1;

  if (a.abs_delta_gte_8 !== b.abs_delta_gte_8) {
    return a.abs_delta_gte_8 - b.abs_delta_gte_8;
  }
  if (
    a.recommender_selected_pick_changes !==
      b.recommender_selected_pick_changes
  ) {
    return a.recommender_selected_pick_changes -
      b.recommender_selected_pick_changes;
  }
  if (
    a.recommender_water_movement_changes !==
      b.recommender_water_movement_changes
  ) {
    return a.recommender_water_movement_changes -
      b.recommender_water_movement_changes;
  }
  if (
    a.spring_snowmelt_risk_not_reflected_v2 !==
      b.spring_snowmelt_risk_not_reflected_v2
  ) {
    return a.spring_snowmelt_risk_not_reflected_v2 -
      b.spring_snowmelt_risk_not_reflected_v2;
  }
  return a.calibration.perfectClearMax - b.calibration.perfectClearMax ||
    a.calibration.stableMax - b.calibration.stableMax;
}

function sweepCalibration(): {
  summaries: SweepSummary[];
  chosen: SweepSummary;
  rows: AuditRow[];
} {
  const summaries: SweepSummary[] = [];
  let chosenRows: AuditRow[] | null = null;
  let chosen: SweepSummary | null = null;
  for (const perfectClearMax of PERFECT_CLEAR_MAX_CANDIDATES) {
    for (const stableMax of STABLE_MAX_CANDIDATES) {
      const calibration = { perfectClearMax, stableMax };
      const rows = buildRows(calibration);
      const summary = summarizeRows(rows, calibration);
      summaries.push(summary);
      if (
        perfectClearMax === DEFAULT_RUNOFF_V2_CALIBRATION.perfectClearMax &&
        stableMax === DEFAULT_RUNOFF_V2_CALIBRATION.stableMax
      ) {
        chosen = summary;
        chosenRows = rows;
      }
    }
  }
  if (chosen == null || chosenRows == null) {
    throw new Error("No runoff V2 calibration candidates evaluated");
  }
  return {
    summaries: summaries.sort((a, b) => {
      const aDefault = a.calibration.perfectClearMax ===
          DEFAULT_RUNOFF_V2_CALIBRATION.perfectClearMax &&
        a.calibration.stableMax === DEFAULT_RUNOFF_V2_CALIBRATION.stableMax;
      const bDefault = b.calibration.perfectClearMax ===
          DEFAULT_RUNOFF_V2_CALIBRATION.perfectClearMax &&
        b.calibration.stableMax === DEFAULT_RUNOFF_V2_CALIBRATION.stableMax;
      if (aDefault !== bDefault) return aDefault ? -1 : 1;
      return rankSweepCandidate(a, b);
    }),
    chosen,
    rows: chosenRows,
  };
}

function pct(n: number, d: number): string {
  return d > 0 ? `${((n / d) * 100).toFixed(1)}%` : "n/a";
}

function sweepTableLines(summaries: SweepSummary[]): string {
  return summaries.map((s) =>
    `| ${s.calibration.perfectClearMax.toFixed(2)} | ${
      s.calibration.stableMax.toFixed(2)
    } | ${
      s.avg_delta.toFixed(2)
    } | ${s.max_delta} | ${s.min_delta} | ${s.abs_delta_gte_8} | ${s.abs_delta_gte_12} | ${s.activity_tier_changes} | ${s.availability_mismatch_count} | ${s.recommender_selected_pick_changes} | ${
      pct(s.recommender_selected_pick_changes, s.recommender_valid)
    } | ${s.recommender_water_movement_changes} | ${s.light_active_rain_active_disruption_v2} | ${s.wet_baseline_not_penalized_enough_v2} | ${s.missing_river_hydrology_v2} | ${s.spring_snowmelt_risk_not_reflected_v2} |`
  ).join("\n");
}

function tagCauseLines(rows: AuditRow[]): string {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const rec = row.recommender;
    if (rec == null || "error" in rec || !rec.tags_changed) continue;
    const base = new Set(rec.baseline.scenario_tags);
    const next = new Set(rec.v2.scenario_tags);
    for (const tag of new Set([...base, ...next])) {
      if (base.has(tag) !== next.has(tag)) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
  }
  return [...counts.entries()].sort((a, b) =>
    b[1] - a[1] || a[0].localeCompare(b[0])
  ).map(([tag, count]) => `| ${tag} | ${count} |`).join("\n") || "| None | 0 |";
}

function pickChangeCauseLines(rows: AuditRow[]): string {
  const changed = pickChangeRows(rows);
  const causes = {
    activity_changed: 0,
    water_movement_changed: 0,
    surface_gate_changed: 0,
    tags_changed: 0,
  };
  for (const row of changed) {
    const rec = row.recommender;
    if (rec == null || "error" in rec) continue;
    if (rec.activity_changed) causes.activity_changed++;
    if (rec.water_movement_changed) causes.water_movement_changed++;
    if (rec.surface_gate_changed) causes.surface_gate_changed++;
    if (rec.tags_changed) causes.tags_changed++;
  }
  return Object.entries(causes).map(([cause, count]) =>
    `| ${cause} | ${count} |`
  ).join("\n");
}

function sampleLines(
  rows: AuditRow[],
  flag: string,
  side: "baseline" | "v2",
  limit = 10,
): string {
  const field = side === "baseline"
    ? "baseline_questionable_flags"
    : "v2_questionable_flags";
  return rows.filter((row) => row[field].includes(flag)).slice(0, limit).map((
    row,
  ) =>
    `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype_id} | ${
      row.baseline_precipitation?.label ?? "-"
    }:${row.baseline_precipitation?.score ?? "-"} | ${
      row.v2_precipitation?.label ?? "-"
    }:${row.v2_precipitation?.score ?? "-"} | ${
      row.baseline_runoff?.label ?? "-"
    }:${row.baseline_runoff?.score ?? "-"} | ${row.v2_runoff?.label ?? "-"}:${
      row.v2_runoff?.score ?? "-"
    } | ${row.score_delta} |`
  ).join("\n") || "| None | - | - | - | - | - | - | - | - |";
}

function selectedPickSampleLines(rows: AuditRow[], limit = 20): string {
  return pickChangeRows(rows).slice(0, limit).map((row) => {
    const rec = row.recommender;
    if (rec == null || "error" in rec) throw new Error("invalid pick row");
    const b = [
      ...rec.baseline.selected_lure_ids,
      ...rec.baseline.selected_fly_ids,
    ].join(", ");
    const v = [...rec.v2.selected_lure_ids, ...rec.v2.selected_fly_ids].join(
      ", ",
    );
    return `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype_id} | ${rec.baseline.water_movement_mode} -> ${rec.v2.water_movement_mode} | ${
      rec.baseline.scenario_tags.join(", ")
    } -> ${rec.v2.scenario_tags.join(", ")} | ${b} | ${v} |`;
  }).join("\n") || "| None | - | - | - | - | - | - | - |";
}

const sweep = sweepCalibration();
const rows = sweep.rows;
const baselineFlags = flagCounts(rows, "baseline_questionable_flags");
const v2Flags = flagCounts(rows, "v2_questionable_flags");
const recMetrics = recommenderMetrics(rows);
const activityChanges = rows.filter((row) => row.activity_tier_changed).length;
const reliabilityChanges = rows.filter((row) => row.reliability_changed).length;
const availabilityMismatchCount =
  rows.filter((row) => row.v2_availability_mismatch).length;
const avgDelta = rows.reduce((sum, row) => sum + row.score_delta, 0) /
  rows.length;
const maxDelta = Math.max(...rows.map((row) => row.score_delta));
const minDelta = Math.min(...rows.map((row) => row.score_delta));
const absDeltaGte8 = rows.filter((row) => Math.abs(row.score_delta) >= 8)
  .length;
const absDeltaGte12 = rows.filter((row) => Math.abs(row.score_delta) >= 12)
  .length;
const precipMismatchCount = variableMismatchCount(rows, "precipitation");
const runoffMismatchCount = variableMismatchCount(rows, "runoff");
const nonzeroScoreDeltaRows =
  rows.filter((row) => Math.abs(row.score_delta) > EPSILON).length;

const markdown = `# Today's Bite Rain / Runoff V2 Production Parity Audit

Generated: ${new Date().toISOString()}

Phase 3C production parity check. Production rain/runoff V2 should match the experiment modules exactly. scoreDay, report copy, and recommender selection logic are untouched.

## Summary

| Metric | Value |
| --- | ---: |
| Total rows | ${rows.length} |
| Production vs experiment precipitation mismatches | ${precipMismatchCount} |
| Production vs experiment runoff mismatches | ${runoffMismatchCount} |
| Production vs experiment Today’s Bite score deltas != 0 | ${nonzeroScoreDeltaRows} |
| Chosen perfectClearMax | ${
  sweep.chosen.calibration.perfectClearMax.toFixed(2)
} |
| Chosen stableMax | ${sweep.chosen.calibration.stableMax.toFixed(2)} |
| Average score delta | ${avgDelta.toFixed(2)} |
| Max score delta | ${maxDelta} |
| Min score delta | ${minDelta} |
| Rows abs(score_delta) >= 8 | ${absDeltaGte8} |
| Rows abs(score_delta) >= 12 | ${absDeltaGte12} |
| Activity tier changes | ${activityChanges} |
| Reliability changes | ${reliabilityChanges} |
| Corrected variable availability mismatch count | ${availabilityMismatchCount} |
| Recommender valid rows | ${recMetrics.valid} |
| Recommender error rows | ${recMetrics.errors} |
| Recommender activity changes | ${recMetrics.activity} |
| Recommender water_movement_mode changes | ${recMetrics.waterMovement} |
| Recommender surface gate changes | ${recMetrics.surface} |
| Recommender scenario tag changes | ${recMetrics.tags} |
| Recommender selected-pick changes | ${recMetrics.picks} |
| Recommender selected-pick change percent | ${
  pct(recMetrics.picks, recMetrics.valid)
} |

## Historical Adoption Context

These are the final pre-wiring shadow metrics retained for comparison, not the current production-vs-experiment deltas.

| Historical Metric | Value |
| --- | ---: |
| Selected-pick changes | 126 / 4680 = 2.7% |
| Average score delta | -0.76 |
| Max score delta | +5 |
| Min score delta | -11 |
| abs(score_delta) >= 8 | 147 |
| abs(score_delta) >= 12 | 0 |
| Activity tier changes | 804 |
| Water movement changes | 51 |
| Surface gate changes | 50 |
| Scenario tag changes | 73 |
| Variable availability mismatch | 0 |
| Readiness fixtures | 15 passed, 0 questionable, 0 failed, 0 selected-pick fixture changes |

## Runoff Positive-Cap Sweep

Production-vs-experiment parity uses the adopted default experiment constants first; other rows are retained as calibration context only.

| perfectClearMax | stableMax | Avg Delta | Max Delta | Min Delta | abs>=8 | abs>=12 | Activity Tier Changes | Availability Mismatches | Pick Changes | Pick Change % | Water Movement Changes | Light Active Auto-Disruption | Wet Baseline Weak | Missing River Windows | Spring Risk Weak |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${sweepTableLines(sweep.summaries)}

## Questionable Behavior Before Vs V2

| Flag | Baseline | V2 | Reduction |
| --- | ---: | ---: | ---: |
${flagComparisonLines(baselineFlags, v2Flags)}

## V2 Formula / Threshold Notes

- Active rain is severity-based: active_precip_now alone no longer creates active_disruption.
- Light active rain is light_mist/recent_rain near neutral unless rate/totals rise.
- p7d wet baseline is considered for lake/pond, coastal, and flats; flats use slightly lower wet thresholds.
- River V2 keeps missing p24/p72/p7d as null, preserving omitted hydrology.
- River perfect_clear/stable positives use the chosen shadow calibration: +${
  sweep.chosen.calibration.perfectClearMax.toFixed(2)
} max and +${sweep.chosen.calibration.stableMax.toFixed(2)} max.
- Spring/early-summer snowmelt regions use lower runoff thresholds; Southwest desert/high desert/SoCal remain flash-sensitive.

## Baseline Precipitation Labels

| Label | Rows |
| --- | ---: |
${labelCounts(rows, "baseline", "precipitation")}

## V2 Precipitation Labels

| Label | Rows |
| --- | ---: |
${labelCounts(rows, "v2", "precipitation")}

## Baseline River Hydrology Labels

| Label | Rows |
| --- | ---: |
${labelCounts(rows, "baseline", "runoff")}

## V2 River Hydrology Labels

| Label | Rows |
| --- | ---: |
${labelCounts(rows, "v2", "runoff")}

## Selected-Pick Change Causes

| Cause among selected-pick changes | Count |
| --- | ---: |
${pickChangeCauseLines(rows)}

## Scenario Tag Change Causes

| Tag | Changed Rows |
| --- | ---: |
${tagCauseLines(rows)}

## Selected-Pick Change Samples

| Region | Month | Context | Archetype | Water Movement | Tags | Baseline Picks | V2 Picks |
| --- | ---: | --- | --- | --- | --- | --- | --- |
${selectedPickSampleLines(rows)}

## V2 Remaining Light Active Rain Auto-Disruption

| Region | Month | Context | Archetype | Baseline Precip | V2 Precip | Baseline Runoff | V2 Runoff | Delta |
| --- | ---: | --- | --- | --- | --- | --- | --- | ---: |
${sampleLines(rows, "light_active_rain_active_disruption", "v2")}

## V2 Remaining Missing River Hydrology Windows

| Region | Month | Context | Archetype | Baseline Precip | V2 Precip | Baseline Runoff | V2 Runoff | Delta |
| --- | ---: | --- | --- | --- | --- | --- | --- | ---: |
${sampleLines(rows, "river_runoff_omitted_incomplete_precip_windows", "v2")}

## V2 Remaining Dry / Perfect Clear Daymaker Risk

| Region | Month | Context | Archetype | Baseline Precip | V2 Precip | Baseline Runoff | V2 Runoff | Delta |
| --- | ---: | --- | --- | --- | --- | --- | --- | ---: |
${sampleLines(rows, "perfect_clear_runoff_possible_daymaker", "v2")}

## V2 Remaining Wet Baseline Not Penalized Enough

| Region | Month | Context | Archetype | Baseline Precip | V2 Precip | Baseline Runoff | V2 Runoff | Delta |
| --- | ---: | --- | --- | --- | --- | --- | --- | ---: |
${sampleLines(rows, "wet_baseline_not_penalized_enough", "v2")}

## V2 Remaining Spring Snowmelt / Warm-Rain Risk

| Region | Month | Context | Archetype | Baseline Precip | V2 Precip | Baseline Runoff | V2 Runoff | Delta |
| --- | ---: | --- | --- | --- | --- | --- | --- | ---: |
${sampleLines(rows, "spring_snowmelt_or_warm_rain_risk_not_reflected", "v2")}

## Artifacts

- JSONL: \`${OUTPUT_JSONL}\`
- Markdown: \`${OUTPUT_MD}\`
`;

await Deno.writeTextFile(
  OUTPUT_JSONL,
  rows.map((row) => JSON.stringify(row)).join("\n") + "\n",
);
await Deno.writeTextFile(OUTPUT_MD, markdown);

console.log(markdown);
console.log(`Wrote ${OUTPUT_JSONL}`);
console.log(`Wrote ${OUTPUT_MD}`);
