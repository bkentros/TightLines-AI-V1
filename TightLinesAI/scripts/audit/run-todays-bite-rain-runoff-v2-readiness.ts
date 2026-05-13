#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 3C qualitative readiness + production parity audit for Rain / Runoff V2.
 *
 * Production normalizers should now match the experiment modules exactly.
 * scoreDay, report copy, and recommender selection logic are untouched; this
 * script swaps experiment rain/runoff in memory to verify parity.
 */

import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import {
  isCoastalFamilyContext,
  SCORED_VARIABLE_KEYS_BY_CONTEXT,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import type {
  ScoredVariableKey,
  SharedEngineRequest,
  SharedNormalizedOutput,
  VariableState,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import type { ReliabilityTierNormalized } from "../../supabase/functions/_shared/howFishingEngine/contracts/normalized.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { normalizePrecipitationDisruptionV2 } from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizePrecipV2.ts";
import { normalizeRunoffV2 } from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizeRunoffV2.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import type { ActiveVariableScore } from "../../supabase/functions/_shared/howFishingEngine/score/types.ts";
import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type { RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-rain-runoff-v2-readiness.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-rain-runoff-v2-readiness.md";
const EPSILON = 1e-6;

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

type Fixture = {
  id: string;
  name: string;
  expectation: string;
  region: RegionKey;
  month: number;
  context: EngineContext;
  precip: {
    rate: number | null;
    active: boolean;
    p24: number | null;
    p72: number | null;
    p7d: number | null;
  };
  checks: string[];
};

const FIXTURES: Fixture[] = [
  {
    id: "lake_light_active_rain",
    name: "Lake light active rain",
    expectation: "V2 should be mild, not active_disruption.",
    region: "midwest_interior",
    month: 5,
    context: "freshwater_lake_pond",
    precip: { rate: 0.02, active: true, p24: 0.08, p72: 0.15, p7d: 0.40 },
    checks: ["v2_precip_not_active_disruption", "v2_precip_mild"],
  },
  {
    id: "lake_heavy_active_rain",
    name: "Lake heavy active rain",
    expectation: "V2 should remain strongly negative.",
    region: "midwest_interior",
    month: 5,
    context: "freshwater_lake_pond",
    precip: { rate: 0.15, active: true, p24: 1.0, p72: 2.0, p7d: 4.0 },
    checks: ["v2_precip_active_disruption", "v2_precip_strong_negative"],
  },
  {
    id: "lake_long_wet_week_low_24h",
    name: "Lake long wet week with low 24h",
    expectation: "V2 should not call this dry_stable positive.",
    region: "midwest_interior",
    month: 5,
    context: "freshwater_lake_pond",
    precip: { rate: 0, active: false, p24: 0, p72: 0.30, p7d: 4.0 },
    checks: ["v2_precip_not_dry_positive", "v2_precip_negative_or_neutral"],
  },
  {
    id: "coastal_light_rain",
    name: "Coastal light rain",
    expectation: "V2 should be mild and lower weight than tide/wind.",
    region: "gulf_coast",
    month: 4,
    context: "coastal",
    precip: { rate: 0.02, active: true, p24: 0.08, p72: 0.15, p7d: 0.40 },
    checks: [
      "v2_precip_not_active_disruption",
      "precip_weight_below_tide_or_wind",
    ],
  },
  {
    id: "flats_wet_baseline",
    name: "Flats wet baseline",
    expectation: "V2 should be more sensitive than broad coastal.",
    region: "florida",
    month: 6,
    context: "coastal_flats_estuary",
    precip: { rate: 0, active: false, p24: 0.05, p72: 1.20, p7d: 3.0 },
    checks: ["v2_precip_negative_or_neutral", "flats_wet_sensitive"],
  },
  {
    id: "river_missing_7d",
    name: "River missing 7d",
    expectation: "V2 runoff must remain omitted/null.",
    region: "northeast",
    month: 5,
    context: "freshwater_river",
    precip: { rate: null, active: false, p24: 0.10, p72: 0.50, p7d: null },
    checks: ["v2_runoff_omitted"],
  },
  {
    id: "river_dry_clear_stable",
    name: "River dry clear/stable",
    expectation: "V2 should help modestly, not dominate the day.",
    region: "northeast",
    month: 5,
    context: "freshwater_river",
    precip: { rate: 0, active: false, p24: 0, p72: 0, p7d: 0 },
    checks: ["v2_runoff_positive_modest", "score_delta_not_dominant"],
  },
  {
    id: "river_light_active_stable_windows",
    name: "River light active rain with stable windows",
    expectation:
      "V2 should avoid false disruption and keep stable water movement.",
    region: "northeast",
    month: 5,
    context: "freshwater_river",
    precip: { rate: 0.02, active: true, p24: 0.08, p72: 0.15, p7d: 0.40 },
    checks: ["v2_runoff_not_blown_out", "v2_water_movement_stable"],
  },
  {
    id: "river_saturated_baseline",
    name: "River saturated baseline",
    expectation: "V2 should be blown_out or strongly negative.",
    region: "northeast",
    month: 5,
    context: "freshwater_river",
    precip: { rate: 0, active: false, p24: 0.20, p72: 2.20, p7d: 6.0 },
    checks: ["v2_runoff_blown_or_strong_negative"],
  },
  {
    id: "river_flashy_24h_southwest",
    name: "River flashy 24h in southwest desert",
    expectation: "V2 should be elevated/blown_out or clearly negative.",
    region: "southwest_desert",
    month: 8,
    context: "freshwater_river",
    precip: { rate: 0, active: false, p24: 0.70, p72: 0.90, p7d: 1.20 },
    checks: ["v2_runoff_elevated_or_negative"],
  },
  {
    id: "pnw_spring_wet_trend",
    name: "PNW spring wet trend",
    expectation: "V2 should reflect snowmelt/warm-rain risk.",
    region: "pacific_northwest",
    month: 5,
    context: "freshwater_river",
    precip: { rate: 0.06, active: true, p24: 0.35, p72: 0.70, p7d: 1.20 },
    checks: ["v2_runoff_snowmelt_risk"],
  },
  {
    id: "florida_river_moderate_rain",
    name: "Florida river moderate rain",
    expectation:
      "V2 should be more tolerant than northern high-sensitivity rivers.",
    region: "florida",
    month: 7,
    context: "freshwater_river",
    precip: { rate: 0.06, active: true, p24: 0.35, p72: 0.70, p7d: 1.20 },
    checks: ["v2_runoff_not_blown_out", "florida_tolerant"],
  },
  {
    id: "inland_northwest_recent_rain_edge",
    name: "Inland Northwest recent rain clearing edge",
    expectation: "Inspect remaining spring-risk edge case from broad audit.",
    region: "inland_northwest",
    month: 5,
    context: "freshwater_river",
    precip: { rate: 0, active: false, p24: 0.05, p72: 0.60, p7d: 1.0 },
    checks: ["edge_case_documented_negative"],
  },
  {
    id: "coastal_missing_p24_no_rate",
    name: "Coastal missing p24 without active/rate",
    expectation: "V2 should not invent dry positives from missing windows.",
    region: "gulf_coast",
    month: 5,
    context: "coastal",
    precip: { rate: null, active: false, p24: null, p72: 0.50, p7d: 1.0 },
    checks: ["v2_precip_omitted"],
  },
  {
    id: "flats_missing_p72_no_rate",
    name: "Flats missing p72 without active/rate",
    expectation: "V2 should not invent dry positives from missing windows.",
    region: "florida",
    month: 5,
    context: "coastal_flats_estuary",
    precip: { rate: null, active: false, p24: 0.10, p72: null, p7d: 1.0 },
    checks: ["v2_precip_omitted"],
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
    explanation: string;
  }
  | { species: SpeciesGroup; error: string }
  | null;

type CheckResult = { id: string; passed: boolean; detail: string };
type ReadinessRow = {
  fixture_id: string;
  name: string;
  qualitative_expectation: string;
  region: RegionKey;
  month: number;
  context: EngineContext;
  precip_inputs: Fixture["precip"];
  baseline_score: number;
  v2_score: number;
  score_delta: number;
  baseline_activity: string;
  v2_activity: string;
  baseline_reliability: string;
  v2_reliability: string;
  baseline_precipitation: VariableSnapshot;
  v2_precipitation: VariableSnapshot;
  baseline_runoff: VariableSnapshot;
  v2_runoff: VariableSnapshot;
  baseline_questionable_flags: string[];
  v2_questionable_flags: string[];
  checks: CheckResult[];
  status: "pass" | "questionable" | "fail";
  status_reason: string;
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

function buildRequest(fixture: Fixture): SharedEngineRequest {
  const meta = REGION_META[fixture.region];
  const localDate = `2026-${String(fixture.month).padStart(2, "0")}-15`;
  const coastal = isCoastalFamilyContext(fixture.context);
  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: fixture.region,
    local_date: localDate,
    local_timezone: meta.tz,
    context: fixture.context,
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
      cloud_cover_pct: fixture.precip.active ? 88 : 55,
      precip_rate_now_in_per_hr: fixture.precip.rate,
      active_precip_now: fixture.precip.active,
      precip_24h_in: fixture.precip.p24,
      precip_72h_in: fixture.precip.p72,
      precip_7d_in: fixture.precip.p7d,
      tide_movement_state: coastal ? "incoming" : null,
      current_speed_knots_max: coastal ? 1.1 : null,
      tide_high_low: coastal ? tideHighLow(fixture.month) : null,
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
  return SCORED_VARIABLE_KEYS_BY_CONTEXT[context]
    .filter((key) => missing.includes(key))
    .map((key) => ({
      variable_key: key as ScoredVariableKey,
      reason: key === "runoff_flow_disruption" &&
          runoffGapReason === "incomplete_precip_windows"
        ? "incomplete_precip_windows"
        : "absent",
    }));
}

function downgradeOnce(tier: ReliabilityTierNormalized) {
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
  if (available.length < 3) return "low";
  let tier: ReliabilityTierNormalized = available.length <= 4
    ? "medium"
    : "high";
  const missingCore = SCORED_VARIABLE_KEYS_BY_CONTEXT[context].filter((key) =>
    missing.includes(key)
  );
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

function rebuildAvailability(
  req: SharedEngineRequest,
  normalized: SharedNormalizedOutput["normalized"],
) {
  const available: string[] = [];
  const missing: string[] = [];
  for (const key of SCORED_VARIABLE_KEYS_BY_CONTEXT[req.context]) {
    if (normalized[NORMALIZED_KEY_BY_SCORED_KEY[key]]) available.push(key);
    else missing.push(key);
  }
  const e = req.environment;
  const riverPrecipPartial = req.context === "freshwater_river" &&
    (e.precip_24h_in != null || e.precip_72h_in != null ||
      e.precip_7d_in != null) &&
    (e.precip_24h_in == null || e.precip_72h_in == null ||
      e.precip_7d_in == null);
  const runoffGapReason = req.context === "freshwater_river" &&
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

function cloneWithRainRunoffV2(
  req: SharedEngineRequest,
  norm: SharedNormalizedOutput,
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
  } else if (isCoastalFamilyContext(req.context)) {
    const precip = normalizePrecipitationDisruptionV2(
      req.context as "coastal" | "coastal_flats_estuary",
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
    );
    if (runoff) normalized.runoff_flow_disruption = runoff;
    else delete normalized.runoff_flow_disruption;
  }
  return { ...norm, normalized, ...rebuildAvailability(req, normalized) };
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
      `rain-runoff-readiness|${args.req.region_key}|${args.req.local_date}|${args.req.context}`;
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
    const selectedPickIdsChanged = JSON.stringify(bPicks) !==
      JSON.stringify(vPicks);
    const causes = [
      b.activity_level !== v.activity_level ? "activity" : null,
      b.water_movement_mode !== v.water_movement_mode ? "water_movement" : null,
      b.surface_daily_gate !== v.surface_daily_gate ? "surface_gate" : null,
      JSON.stringify(b.scenario_tags) !== JSON.stringify(v.scenario_tags)
        ? "tags"
        : null,
    ].filter(Boolean).join(", ");
    return {
      species,
      baseline: b,
      v2: v,
      activity_changed: b.activity_level !== v.activity_level,
      water_movement_changed: b.water_movement_mode !== v.water_movement_mode,
      surface_gate_changed: b.surface_daily_gate !== v.surface_daily_gate,
      tags_changed:
        JSON.stringify(b.scenario_tags) !== JSON.stringify(v.scenario_tags),
      selected_pick_ids_changed: selectedPickIdsChanged,
      explanation: selectedPickIdsChanged
        ? causes || "pick order changed without scenario-field change"
        : "no selected-pick change",
    };
  } catch (error) {
    return {
      species,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function questionableFlags(args: {
  context: EngineContext;
  precip: VariableSnapshot;
  runoff: VariableSnapshot;
  scoreDelta: number;
  dataGaps: SharedNormalizedOutput["data_gaps"];
}): string[] {
  const flags: string[] = [];
  if (args.precip?.label === "active_disruption" && args.precip.score > -0.8) {
    flags.push("weak_active_disruption");
  }
  if (
    (args.precip?.label === "extended_dry" ||
      args.precip?.label === "dry_stable") &&
    args.precip.score > 0.25
  ) {
    flags.push("dry_precip_state_possible_daymaker");
  }
  if (
    args.runoff?.label === "perfect_clear" &&
    (args.runoff.score >= 0.85 || args.scoreDelta >= 8)
  ) {
    flags.push("perfect_clear_runoff_possible_daymaker");
  }
  if (
    args.context === "freshwater_river" &&
    args.dataGaps.some((gap) =>
      gap.variable_key === "runoff_flow_disruption" &&
      gap.reason === "incomplete_precip_windows"
    )
  ) {
    flags.push("river_runoff_omitted_incomplete_precip_windows");
  }
  return flags;
}

function pass(
  id: string,
  passed: boolean,
  detail: string,
): CheckResult {
  return { id, passed, detail };
}

function checkFixture(args: {
  fixture: Fixture;
  baselineNorm: SharedNormalizedOutput;
  v2Norm: SharedNormalizedOutput;
  baselineScored: ReturnType<typeof scoreDay>;
  v2Scored: ReturnType<typeof scoreDay>;
  baselinePrecip: VariableSnapshot;
  v2Precip: VariableSnapshot;
  baselineRunoff: VariableSnapshot;
  v2Runoff: VariableSnapshot;
  v2Rec: RecommenderSide | null;
}): CheckResult[] {
  const checks: CheckResult[] = [];
  const v2PrecipScore = args.v2Precip?.score ?? 0;
  const v2RunoffScore = args.v2Runoff?.score ?? 0;
  for (const id of args.fixture.checks) {
    switch (id) {
      case "v2_precip_not_active_disruption":
        checks.push(pass(
          id,
          args.v2Precip?.label !== "active_disruption",
          `V2 precip label is ${args.v2Precip?.label ?? "omitted"}`,
        ));
        break;
      case "v2_precip_mild":
        checks.push(pass(
          id,
          Math.abs(v2PrecipScore) <= 0.25,
          `V2 precip score is ${v2PrecipScore}`,
        ));
        break;
      case "v2_precip_active_disruption":
        checks.push(pass(
          id,
          args.v2Precip?.label === "active_disruption",
          `V2 precip label is ${args.v2Precip?.label ?? "omitted"}`,
        ));
        break;
      case "v2_precip_strong_negative":
        checks.push(
          pass(id, v2PrecipScore <= -1, `V2 precip score is ${v2PrecipScore}`),
        );
        break;
      case "v2_precip_not_dry_positive":
        checks.push(pass(
          id,
          args.v2Precip == null ||
            !["dry_stable", "extended_dry"].includes(args.v2Precip.label) ||
            args.v2Precip.score <= 0,
          `V2 precip is ${args.v2Precip?.label ?? "omitted"}:${v2PrecipScore}`,
        ));
        break;
      case "v2_precip_negative_or_neutral":
        checks.push(
          pass(id, v2PrecipScore <= 0, `V2 precip score is ${v2PrecipScore}`),
        );
        break;
      case "precip_weight_below_tide_or_wind": {
        const precip = contributionSnapshot(
          args.v2Scored.contributions,
          "precipitation_disruption",
        )?.weighted_contribution ?? 0;
        const wind = Math.abs(
          contributionSnapshot(
            args.v2Scored.contributions,
            "wind_condition",
          )?.weighted_contribution ?? 0,
        );
        const tide = Math.abs(
          contributionSnapshot(
            args.v2Scored.contributions,
            "tide_current_movement",
          )?.weighted_contribution ?? 0,
        );
        checks.push(pass(
          id,
          Math.abs(precip) <= Math.max(wind, tide),
          `weighted precip ${precip.toFixed(2)}, wind ${
            wind.toFixed(2)
          }, tide ${tide.toFixed(2)}`,
        ));
        break;
      }
      case "flats_wet_sensitive":
        checks.push(pass(
          id,
          v2PrecipScore <= -0.25,
          `V2 flats wet-baseline score is ${v2PrecipScore}`,
        ));
        break;
      case "v2_runoff_omitted":
        checks.push(
          pass(
            id,
            args.v2Runoff == null,
            `V2 runoff is ${args.v2Runoff?.label ?? "omitted"}`,
          ),
        );
        break;
      case "v2_runoff_positive_modest":
        checks.push(pass(
          id,
          v2RunoffScore > 0 && v2RunoffScore <= 0.55,
          `V2 runoff score is ${v2RunoffScore}`,
        ));
        break;
      case "score_delta_not_dominant":
        checks.push(pass(
          id,
          Math.abs(args.v2Scored.score - args.baselineScored.score) < 8,
          `score delta is ${args.v2Scored.score - args.baselineScored.score}`,
        ));
        break;
      case "v2_runoff_not_blown_out":
        checks.push(pass(
          id,
          args.v2Runoff?.label !== "blown_out",
          `V2 runoff label is ${args.v2Runoff?.label ?? "omitted"}`,
        ));
        break;
      case "v2_water_movement_stable":
        checks.push(pass(
          id,
          args.v2Rec?.water_movement_mode === "stable" ||
            args.v2Rec?.water_movement_mode === "not_applicable",
          `V2 water movement is ${args.v2Rec?.water_movement_mode ?? "n/a"}`,
        ));
        break;
      case "v2_runoff_blown_or_strong_negative":
        checks.push(pass(
          id,
          args.v2Runoff?.label === "blown_out" || v2RunoffScore <= -1,
          `V2 runoff is ${args.v2Runoff?.label ?? "omitted"}:${v2RunoffScore}`,
        ));
        break;
      case "v2_runoff_elevated_or_negative":
        checks.push(pass(
          id,
          ["elevated", "blown_out"].includes(args.v2Runoff?.label ?? "") ||
            v2RunoffScore <= -0.5,
          `V2 runoff is ${args.v2Runoff?.label ?? "omitted"}:${v2RunoffScore}`,
        ));
        break;
      case "v2_runoff_snowmelt_risk":
        checks.push(pass(
          id,
          ["slightly_elevated", "elevated", "blown_out"].includes(
            args.v2Runoff?.label ?? "",
          ) && v2RunoffScore <= -0.5,
          `V2 runoff is ${args.v2Runoff?.label ?? "omitted"}:${v2RunoffScore}`,
        ));
        break;
      case "florida_tolerant":
        checks.push(pass(
          id,
          args.v2Runoff?.label !== "blown_out" && v2RunoffScore > -1,
          `V2 Florida runoff is ${
            args.v2Runoff?.label ?? "omitted"
          }:${v2RunoffScore}`,
        ));
        break;
      case "edge_case_documented_negative":
        checks.push(pass(
          id,
          args.v2Runoff != null && v2RunoffScore < 0,
          `V2 edge-case runoff is ${
            args.v2Runoff?.label ?? "omitted"
          }:${v2RunoffScore}`,
        ));
        break;
      case "v2_precip_omitted":
        checks.push(
          pass(
            id,
            args.v2Precip == null,
            `V2 precip is ${args.v2Precip?.label ?? "omitted"}`,
          ),
        );
        break;
      default:
        checks.push(pass(id, false, "Unknown check"));
    }
  }
  return checks;
}

function buildRows(): ReadinessRow[] {
  return FIXTURES.map((fixture) => {
    const req = buildRequest(fixture);
    const baselineNorm = buildSharedNormalizedOutput(req);
    const baselineScored = scoreDay(baselineNorm);
    const v2Norm = cloneWithRainRunoffV2(req, baselineNorm);
    const v2Scored = scoreDay(v2Norm);
    const recommender = recommenderCompare({
      req,
      baselineNorm,
      baselineScored,
      v2Norm,
      v2Scored,
    });
    const baselinePrecip = variableSnapshot(
      baselineNorm.normalized.precipitation_disruption,
    );
    const v2Precip = variableSnapshot(
      v2Norm.normalized.precipitation_disruption,
    );
    const baselineRunoff = variableSnapshot(
      baselineNorm.normalized.runoff_flow_disruption,
    );
    const v2Runoff = variableSnapshot(v2Norm.normalized.runoff_flow_disruption);
    const rec = recommender && !("error" in recommender) ? recommender : null;
    const checks = checkFixture({
      fixture,
      baselineNorm,
      v2Norm,
      baselineScored,
      v2Scored,
      baselinePrecip,
      v2Precip,
      baselineRunoff,
      v2Runoff,
      v2Rec: rec?.v2 ?? null,
    });
    const failed = checks.filter((check) => !check.passed);
    const selectedPickChanged = rec?.selected_pick_ids_changed ?? false;
    const status: ReadinessRow["status"] = failed.length === 0
      ? "pass"
      : selectedPickChanged &&
          failed.every((check) => check.id === "score_delta_not_dominant")
      ? "questionable"
      : "fail";
    const statusReason = failed.length === 0
      ? "All qualitative checks passed."
      : failed.map((check) => `${check.id}: ${check.detail}`).join("; ");
    const scoreDelta = v2Scored.score - baselineScored.score;
    return {
      fixture_id: fixture.id,
      name: fixture.name,
      qualitative_expectation: fixture.expectation,
      region: fixture.region,
      month: fixture.month,
      context: fixture.context,
      precip_inputs: fixture.precip,
      baseline_score: baselineScored.score,
      v2_score: v2Scored.score,
      score_delta: scoreDelta,
      baseline_activity: compositeScoreActivityTier(baselineScored.score),
      v2_activity: compositeScoreActivityTier(v2Scored.score),
      baseline_reliability: baselineNorm.reliability,
      v2_reliability: v2Norm.reliability,
      baseline_precipitation: baselinePrecip,
      v2_precipitation: v2Precip,
      baseline_runoff: baselineRunoff,
      v2_runoff: v2Runoff,
      baseline_questionable_flags: questionableFlags({
        context: fixture.context,
        precip: baselinePrecip,
        runoff: baselineRunoff,
        scoreDelta,
        dataGaps: baselineNorm.data_gaps,
      }),
      v2_questionable_flags: questionableFlags({
        context: fixture.context,
        precip: v2Precip,
        runoff: v2Runoff,
        scoreDelta,
        dataGaps: v2Norm.data_gaps,
      }),
      checks,
      status,
      status_reason: statusReason,
      recommender,
    };
  });
}

function statusLine(row: ReadinessRow): string {
  const checks = row.checks.map((check) =>
    `${check.passed ? "pass" : "fail"}:${check.id}`
  ).join("<br>");
  return `| ${row.fixture_id} | ${row.status} | ${row.region} | ${row.month} | ${row.context} | ${row.baseline_score} -> ${row.v2_score} | ${
    row.baseline_precipitation?.label ?? "-"
  }:${row.baseline_precipitation?.score ?? "-"} -> ${
    row.v2_precipitation?.label ?? "-"
  }:${row.v2_precipitation?.score ?? "-"} | ${
    row.baseline_runoff?.label ?? "-"
  }:${row.baseline_runoff?.score ?? "-"} -> ${row.v2_runoff?.label ?? "-"}:${
    row.v2_runoff?.score ?? "-"
  } | ${checks} | ${row.status_reason} |`;
}

function recommenderLine(row: ReadinessRow): string {
  const rec = row.recommender;
  if (rec == null) {
    return `| ${row.fixture_id} | unsupported | - | - | - | - | - | - |`;
  }
  if ("error" in rec) {
    return `| ${row.fixture_id} | ${rec.species} | error: ${rec.error} | - | - | - | - | - |`;
  }
  const bPicks = [
    ...rec.baseline.selected_lure_ids,
    ...rec.baseline.selected_fly_ids,
  ].join(", ");
  const vPicks = [...rec.v2.selected_lure_ids, ...rec.v2.selected_fly_ids].join(
    ", ",
  );
  return `| ${row.fixture_id} | ${rec.species} | ${rec.baseline.activity_level} -> ${rec.v2.activity_level} | ${rec.baseline.water_movement_mode} -> ${rec.v2.water_movement_mode} | ${rec.baseline.surface_daily_gate} -> ${rec.v2.surface_daily_gate} | ${
    rec.baseline.scenario_tags.join(", ")
  } -> ${
    rec.v2.scenario_tags.join(", ")
  } | ${rec.selected_pick_ids_changed} | ${rec.explanation} | ${bPicks} -> ${vPicks} |`;
}

const rows = buildRows();
const passCount = rows.filter((row) => row.status === "pass").length;
const questionableCount = rows.filter((row) => row.status === "questionable")
  .length;
const failCount = rows.filter((row) => row.status === "fail").length;
const precipMismatchCount = rows.filter((row) => {
  const a = row.baseline_precipitation;
  const b = row.v2_precipitation;
  if (a == null || b == null) return a !== b;
  return a.label !== b.label || Math.abs(a.score - b.score) > EPSILON;
}).length;
const runoffMismatchCount = rows.filter((row) => {
  const a = row.baseline_runoff;
  const b = row.v2_runoff;
  if (a == null || b == null) return a !== b;
  return a.label !== b.label || Math.abs(a.score - b.score) > EPSILON;
}).length;
const scoreDeltaMismatchCount =
  rows.filter((row) => Math.abs(row.score_delta) > EPSILON).length;
const recChanged =
  rows.filter((row) =>
    row.recommender != null && !("error" in row.recommender) &&
    row.recommender.selected_pick_ids_changed
  ).length;
const parityFailed = precipMismatchCount > 0 || runoffMismatchCount > 0 ||
  scoreDeltaMismatchCount > 0 || recChanged > 0;
const recommendation = parityFailed || failCount > 0
  ? "blocked"
  : questionableCount > 0
  ? "tune before production wiring"
  : "ready for production wiring";

const markdown =
  `# Today's Bite Rain / Runoff V2 Production Readiness / Parity Audit

Generated: ${new Date().toISOString()}

Phase 3C production parity check. Production rain/runoff V2 should match the experiment modules exactly. scoreDay, report copy, and recommender selection logic are untouched.

## Summary

| Metric | Value |
| --- | ---: |
| Fixtures | ${rows.length} |
| Passed | ${passCount} |
| Questionable | ${questionableCount} |
| Failed | ${failCount} |
| Production vs experiment precipitation mismatches | ${precipMismatchCount} |
| Production vs experiment runoff mismatches | ${runoffMismatchCount} |
| Production vs experiment score deltas != 0 | ${scoreDeltaMismatchCount} |
| Recommender selected-pick changes | ${recChanged} |
| Recommendation | ${recommendation} |

## Fixture Results

| Fixture | Status | Region | Month | Context | Score | Precip | Runoff | Checks | Notes |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- |
${rows.map(statusLine).join("\n")}

## Recommender-Facing Fixture Changes

| Fixture | Species | Activity | Water Movement | Surface Gate | Tags | Picks Changed | Explanation | Picks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows.map(recommenderLine).join("\n")}

## Questionable Or Failed Fixtures

${
    rows.filter((row) => row.status !== "pass").map((row) =>
      `- ${row.fixture_id}: ${row.status_reason}`
    ).join("\n") || "None."
  }

## Recommendation

${recommendation}

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
