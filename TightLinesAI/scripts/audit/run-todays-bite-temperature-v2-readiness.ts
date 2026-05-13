#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Qualitative readiness audit for experimental Temperature V2.
 *
 * Shadow-only: production scoring is untouched. Each fixture builds the current
 * normalized output, replaces only normalized.temperature in memory, and checks
 * whether the V2 temperature behavior matches a named qualitative expectation.
 */

import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type {
  SharedEngineRequest,
  SharedNormalizedOutput,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import {
  DEFAULT_TEMPERATURE_V2_CONSTANTS,
  normalizeTemperatureV2,
  type TemperatureV2Diagnostics,
} from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizeTemperatureV2.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type { RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-temperature-v2-readiness.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-temperature-v2-readiness.md";

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
  south_central: {
    lat: 30.3,
    lon: -97.7,
    state: "TX",
    tz: "America/Chicago",
  },
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
  qualitativeExpectation: string;
  regionKey: RegionKey;
  month: number;
  context: EngineContext;
  dailyMeanF: number;
  priorMeanF?: number | null;
  dayMinus2MeanF?: number | null;
  pressureNowMb?: number;
  pressureAgoMb?: number;
  windMph?: number;
  cloudPct?: number;
  precip24In?: number;
  precip72In?: number;
  precip7dIn?: number;
  activePrecipNow?: boolean;
  precipRateInPerHr?: number | null;
  tideMovementState?: string | null;
  currentSpeedKnotsMax?: number | null;
  tideStrong?: boolean;
  measuredWaterTempF?: number | null;
  measuredWaterTemp24hAgoF?: number | null;
  measuredWaterTemp72hAgoF?: number | null;
  checks: readonly ReadinessCheck[];
};

type ReadinessCheck = {
  label: string;
  pass: (row: ReadinessRow) => boolean;
};

type RecommenderComparison =
  | {
    species: SpeciesGroup;
    baseline: RecommenderSnapshot;
    v2: RecommenderSnapshot;
    pick_ids_changed: boolean;
  }
  | { species: SpeciesGroup; error: string }
  | null;

type RecommenderSnapshot = {
  activity_level: string;
  thermal_mode: string;
  light_mode: string;
  wind_mode: string;
  water_movement_mode: string;
  surface_daily_gate: string;
  scenario_tags: readonly string[];
  selected_lure_ids: readonly string[];
  selected_fly_ids: readonly string[];
};

type TempSnapshot = {
  measurement_source: string;
  measurement_value_f: number;
  band_label: string;
  band_score: number;
  trend_label: string;
  trend_adjustment: number;
  shock_label: string;
  shock_adjustment: number;
  final_score: number;
} | null;

type ReadinessRow = {
  fixture_id: string;
  name: string;
  qualitative_expectation: string;
  region_key: RegionKey;
  month: number;
  context: EngineContext;
  baseline_score: number;
  v2_score: number;
  score_delta: number;
  baseline_activity_tier: string;
  v2_activity_tier: string;
  baseline_temperature: TempSnapshot;
  v2_temperature: TempSnapshot;
  v2_diagnostics: TemperatureV2Diagnostics | null;
  checks: Array<{ label: string; passed: boolean }>;
  passed: boolean;
  questionable: boolean;
  recommender: RecommenderComparison;
};

function pressureHistory(current: number, ago: number): number[] {
  return Array.from({ length: 48 }, (_, i) => ago + ((current - ago) * i) / 47);
}

function tideHighLow(month: number, strong: boolean) {
  const m = String(month).padStart(2, "0");
  return strong
    ? [
      { time: `2026-${m}-15T05:30:00`, value: 0.2, type: "L" },
      { time: `2026-${m}-15T11:45:00`, value: 2.5, type: "H" },
      { time: `2026-${m}-15T18:10:00`, value: 0.3, type: "L" },
    ]
    : [
      { time: `2026-${m}-15T06:00:00`, value: 1.2, type: "L" },
      { time: `2026-${m}-15T12:00:00`, value: 1.6, type: "H" },
      { time: `2026-${m}-15T18:00:00`, value: 1.3, type: "L" },
    ];
}

function buildRequest(fixture: Fixture): SharedEngineRequest {
  const meta = REGION_META[fixture.regionKey];
  const localDate = `2026-${String(fixture.month).padStart(2, "0")}-15`;
  const coastal = fixture.context === "coastal" ||
    fixture.context === "coastal_flats_estuary";
  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: fixture.regionKey,
    local_date: localDate,
    local_timezone: meta.tz,
    context: fixture.context,
    environment: {
      current_air_temp_f: fixture.dailyMeanF,
      daily_mean_air_temp_f: fixture.dailyMeanF,
      daily_low_air_temp_f: fixture.dailyMeanF - 8,
      daily_high_air_temp_f: fixture.dailyMeanF + 8,
      prior_day_mean_air_temp_f: fixture.priorMeanF ?? null,
      day_minus_2_mean_air_temp_f: fixture.dayMinus2MeanF ?? null,
      pressure_mb: fixture.pressureNowMb ?? 1014,
      pressure_history_mb: pressureHistory(
        fixture.pressureNowMb ?? 1014,
        fixture.pressureAgoMb ?? 1014,
      ),
      wind_speed_mph: fixture.windMph ?? 8,
      cloud_cover_pct: fixture.cloudPct ?? 55,
      precip_24h_in: fixture.precip24In ?? 0,
      precip_72h_in: fixture.precip72In ?? 0,
      precip_7d_in: fixture.precip7dIn ?? 0,
      active_precip_now: fixture.activePrecipNow ?? false,
      precip_rate_now_in_per_hr: fixture.precipRateInPerHr ?? null,
      tide_movement_state: coastal
        ? fixture.tideMovementState ?? "incoming"
        : null,
      current_speed_knots_max: coastal
        ? fixture.currentSpeedKnotsMax ?? 1.1
        : null,
      tide_high_low: coastal
        ? tideHighLow(fixture.month, fixture.tideStrong ?? true)
        : null,
      tide_height_hourly_ft: null,
      ...(fixture.measuredWaterTempF != null
        ? {
          measured_water_temp_f: fixture.measuredWaterTempF,
          measured_water_temp_24h_ago_f: fixture.measuredWaterTemp24hAgoF ??
            null,
          measured_water_temp_72h_ago_f: fixture.measuredWaterTemp72hAgoF ??
            null,
          measured_water_temp_source: "readiness_synthetic_noaa",
        }
        : {}),
    },
    data_coverage: { source_notes: [] },
  };
}

function cloneWithV2Temperature(
  norm: SharedNormalizedOutput,
  req: SharedEngineRequest,
) {
  const v2 = normalizeTemperatureV2(
    req.context,
    req.region_key,
    Number.parseInt(req.local_date.slice(5, 7), 10),
    req.environment.daily_mean_air_temp_f ?? req.environment.current_air_temp_f,
    req.environment.prior_day_mean_air_temp_f,
    req.environment.day_minus_2_mean_air_temp_f,
    {
      measuredWaterTempF: req.environment.measured_water_temp_f,
      measuredWaterTemp24hAgoF: req.environment.measured_water_temp_24h_ago_f,
      measuredWaterTemp72hAgoF: req.environment.measured_water_temp_72h_ago_f,
      constants: DEFAULT_TEMPERATURE_V2_CONSTANTS,
    },
  );
  const v2Norm: SharedNormalizedOutput = {
    ...norm,
    normalized: {
      ...norm.normalized,
      ...(v2.temperature ? { temperature: v2.temperature } : {}),
    },
  };
  return { v2, v2Norm };
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
    const seasonalRow = resolveDailyPicksSeasonalRow({
      species,
      region_key: args.req.region_key,
      month,
      water_type: args.req.context,
    });
    const seed =
      `temp-v2-readiness|${args.req.region_key}|${args.req.local_date}|${args.req.context}`;
    const baseline = runDailyPicksEngine({
      req: recReq,
      analysis: {
        ...baselineAnalysis,
        norm: args.baselineNorm,
        scored: args.baselineScored,
      },
      seasonalRow,
      seed,
      variant: "A",
    });
    const v2 = runDailyPicksEngine({
      req: recReq,
      analysis: {
        ...baselineAnalysis,
        norm: args.v2Norm,
        scored: args.v2Scored,
      },
      seasonalRow,
      seed,
      variant: "A",
    });
    const baselinePicks = [
      ...baseline.diagnostics.selected_lure_ids,
      ...baseline.diagnostics.selected_fly_ids,
    ];
    const v2Picks = [
      ...v2.diagnostics.selected_lure_ids,
      ...v2.diagnostics.selected_fly_ids,
    ];
    return {
      species,
      baseline: {
        activity_level: baseline.scenario.activity_level,
        thermal_mode: baseline.scenario.thermal_mode,
        light_mode: baseline.scenario.light_mode,
        wind_mode: baseline.scenario.wind_mode,
        water_movement_mode: baseline.scenario.water_movement_mode,
        surface_daily_gate: baseline.scenario.surface_daily_gate,
        scenario_tags: baseline.scenario.scenario_tags,
        selected_lure_ids: baseline.diagnostics.selected_lure_ids,
        selected_fly_ids: baseline.diagnostics.selected_fly_ids,
      },
      v2: {
        activity_level: v2.scenario.activity_level,
        thermal_mode: v2.scenario.thermal_mode,
        light_mode: v2.scenario.light_mode,
        wind_mode: v2.scenario.wind_mode,
        water_movement_mode: v2.scenario.water_movement_mode,
        surface_daily_gate: v2.scenario.surface_daily_gate,
        scenario_tags: v2.scenario.scenario_tags,
        selected_lure_ids: v2.diagnostics.selected_lure_ids,
        selected_fly_ids: v2.diagnostics.selected_fly_ids,
      },
      pick_ids_changed:
        JSON.stringify(baselinePicks) !== JSON.stringify(v2Picks),
    };
  } catch (error) {
    return {
      species,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function tempSnapshot(
  temp: SharedNormalizedOutput["normalized"]["temperature"],
): TempSnapshot {
  if (!temp) return null;
  return {
    measurement_source: temp.measurement_source,
    measurement_value_f: temp.measurement_value_f,
    band_label: temp.band_label,
    band_score: temp.band_score,
    trend_label: temp.trend_label,
    trend_adjustment: temp.trend_adjustment,
    shock_label: temp.shock_label,
    shock_adjustment: temp.shock_adjustment,
    final_score: temp.final_score,
  };
}

const hasTemp = (row: ReadinessRow) =>
  row.baseline_temperature != null &&
  row.v2_temperature != null &&
  row.v2_diagnostics != null;

const v2FinalAtLeast = (min: number): ReadinessCheck => ({
  label: `V2 temperature final_score >= ${min}`,
  pass: (row) => hasTemp(row) && row.v2_temperature!.final_score >= min,
});

const v2FinalAtMost = (max: number): ReadinessCheck => ({
  label: `V2 temperature final_score <= ${max}`,
  pass: (row) => hasTemp(row) && row.v2_temperature!.final_score <= max,
});

const trendComponentAtLeast = (min: number): ReadinessCheck => ({
  label: `V2 trend_component >= ${min}`,
  pass: (row) => hasTemp(row) && row.v2_diagnostics!.trend_component >= min,
});

const trendComponentAtMost = (max: number): ReadinessCheck => ({
  label: `V2 trend_component <= ${max}`,
  pass: (row) => hasTemp(row) && row.v2_diagnostics!.trend_component <= max,
});

const shockIs = (label: string): ReadinessCheck => ({
  label: `V2 shock_label is ${label}`,
  pass: (row) => hasTemp(row) && row.v2_temperature!.shock_label === label,
});

const trendIs = (label: string): ReadinessCheck => ({
  label: `V2 trend_label is ${label}`,
  pass: (row) => hasTemp(row) && row.v2_temperature!.trend_label === label,
});

const sourceIs = (source: string): ReadinessCheck => ({
  label: `V2 measurement_source is ${source}`,
  pass: (row) =>
    hasTemp(row) && row.v2_temperature!.measurement_source === source &&
    row.v2_diagnostics!.selected_source === source,
});

const stabilityBasisIs = (
  basis: TemperatureV2Diagnostics["stability_basis"],
): ReadinessCheck => ({
  label: `V2 stability_basis is ${basis}`,
  pass: (row) => hasTemp(row) && row.v2_diagnostics!.stability_basis === basis,
});

const stabilityComponentIs = (value: number): ReadinessCheck => ({
  label: `V2 stability_component is ${value}`,
  pass: (row) =>
    hasTemp(row) &&
    Math.abs(row.v2_diagnostics!.stability_component - value) < 0.0001,
});

const scoreDeltaWithin = (maxAbs: number): ReadinessCheck => ({
  label: `Today bite score delta within +/-${maxAbs}`,
  pass: (row) => Math.abs(row.score_delta) <= maxAbs,
});

const fixtures: readonly Fixture[] = [
  {
    id: "northern_spring_warming_after_cold",
    name: "Northern spring warming trend after cold weather",
    qualitativeExpectation:
      "Favorable warming toward the seasonal window should not be penalized.",
    regionKey: "great_lakes_upper_midwest",
    month: 4,
    context: "freshwater_lake_pond",
    dailyMeanF: 56,
    priorMeanF: 50,
    dayMinus2MeanF: 45,
    cloudPct: 60,
    checks: [
      sourceIs("air_daily_mean"),
      trendIs("warming"),
      shockIs("none"),
      trendComponentAtLeast(0),
      scoreDeltaWithin(6),
    ],
  },
  {
    id: "northern_spring_sudden_cold_front",
    name: "Northern spring sudden cold front",
    qualitativeExpectation: "Sharp 24h thermal shock should be negative.",
    regionKey: "great_lakes_upper_midwest",
    month: 4,
    context: "freshwater_lake_pond",
    dailyMeanF: 42,
    priorMeanF: 55,
    dayMinus2MeanF: 60,
    pressureNowMb: 1024,
    pressureAgoMb: 1008,
    windMph: 17,
    cloudPct: 15,
    checks: [
      sourceIs("air_daily_mean"),
      shockIs("sharp_cooldown"),
      trendIs("stable"),
      v2FinalAtMost(-1),
      scoreDeltaWithin(6),
    ],
  },
  {
    id: "northern_winter_stable_cold",
    name: "Northern winter stable cold",
    qualitativeExpectation:
      "Complete stable history may get only a small positive nudge, not a full rescue.",
    regionKey: "northeast",
    month: 1,
    context: "freshwater_lake_pond",
    dailyMeanF: 34,
    priorMeanF: 34,
    dayMinus2MeanF: 33,
    windMph: 7,
    cloudPct: 70,
    checks: [
      stabilityBasisIs("complete_history"),
      stabilityComponentIs(DEFAULT_TEMPERATURE_V2_CONSTANTS.stableBonus),
      shockIs("none"),
      trendComponentAtMost(0.1),
      v2FinalAtMost(0.5),
    ],
  },
  {
    id: "mountain_summer_cool_stable_trout_river",
    name: "Mountain summer cool stable trout river condition",
    qualitativeExpectation:
      "Cool stable mountain trout conditions should remain thermally favorable.",
    regionKey: "mountain_alpine",
    month: 7,
    context: "freshwater_river",
    dailyMeanF: 62,
    priorMeanF: 62,
    dayMinus2MeanF: 61,
    cloudPct: 65,
    precip24In: 0.05,
    precip72In: 0.15,
    precip7dIn: 0.4,
    checks: [
      sourceIs("air_daily_mean"),
      stabilityBasisIs("complete_history"),
      v2FinalAtLeast(0.25),
      shockIs("none"),
      scoreDeltaWithin(6),
    ],
  },
  {
    id: "florida_summer_heat_limited_stable_heat",
    name: "Florida summer heat-limited stable heat",
    qualitativeExpectation:
      "Stable heat should stay heat-limited and not be rewarded by stability.",
    regionKey: "florida",
    month: 8,
    context: "freshwater_lake_pond",
    dailyMeanF: 96,
    priorMeanF: 95,
    dayMinus2MeanF: 94,
    windMph: 4,
    cloudPct: 12,
    checks: [
      sourceIs("air_daily_mean"),
      trendComponentAtMost(0),
      v2FinalAtMost(-0.5),
      shockIs("none"),
      scoreDeltaWithin(6),
    ],
  },
  {
    id: "florida_summer_cooling_relief_after_heat",
    name: "Florida/south summer cooling relief after heat",
    qualitativeExpectation:
      "Cooling out of excessive heat should be allowed to improve favorability.",
    regionKey: "florida",
    month: 8,
    context: "freshwater_lake_pond",
    dailyMeanF: 86,
    priorMeanF: 90,
    dayMinus2MeanF: 94,
    cloudPct: 75,
    windMph: 9,
    checks: [
      sourceIs("air_daily_mean"),
      trendIs("cooling"),
      shockIs("none"),
      trendComponentAtLeast(0),
      v2FinalAtLeast(0),
    ],
  },
  {
    id: "gulf_southeast_warm_stable_spring_lake",
    name: "Gulf/Southeast warm stable spring lake",
    qualitativeExpectation:
      "Warm stable spring lake conditions should remain positive without overreaction.",
    regionKey: "gulf_coast",
    month: 4,
    context: "freshwater_lake_pond",
    dailyMeanF: 74,
    priorMeanF: 74,
    dayMinus2MeanF: 73,
    windMph: 8,
    cloudPct: 55,
    checks: [
      stabilityBasisIs("complete_history"),
      stabilityComponentIs(DEFAULT_TEMPERATURE_V2_CONSTANTS.stableBonus),
      v2FinalAtLeast(0),
      scoreDeltaWithin(6),
    ],
  },
  {
    id: "desert_summer_heat_bright_calm",
    name: "Desert summer heat plus bright/calm",
    qualitativeExpectation:
      "Warming or stability deeper into heat should not be rewarded.",
    regionKey: "southwest_desert",
    month: 7,
    context: "freshwater_lake_pond",
    dailyMeanF: 108,
    priorMeanF: 106,
    dayMinus2MeanF: 104,
    windMph: 3,
    cloudPct: 4,
    checks: [
      sourceIs("air_daily_mean"),
      trendComponentAtMost(0),
      v2FinalAtMost(-0.5),
      scoreDeltaWithin(6),
    ],
  },
  {
    id: "great_lakes_fall_cooling_trend",
    name: "Great Lakes fall cooling trend",
    qualitativeExpectation:
      "Fall cooling should be judged by whether it improves seasonal favorability.",
    regionKey: "great_lakes_upper_midwest",
    month: 10,
    context: "freshwater_lake_pond",
    dailyMeanF: 56,
    priorMeanF: 61,
    dayMinus2MeanF: 66,
    cloudPct: 68,
    checks: [
      sourceIs("air_daily_mean"),
      trendIs("cooling"),
      shockIs("none"),
      trendComponentAtLeast(-0.7),
      v2FinalAtLeast(-0.5),
    ],
  },
  {
    id: "river_cold_front_shock_runoff_stable",
    name: "River cold-front shock with runoff stable",
    qualitativeExpectation:
      "River thermal shock should stay negative even when runoff proxy is stable.",
    regionKey: "appalachian",
    month: 3,
    context: "freshwater_river",
    dailyMeanF: 42,
    priorMeanF: 54,
    dayMinus2MeanF: 58,
    precip24In: 0.05,
    precip72In: 0.1,
    precip7dIn: 0.4,
    windMph: 14,
    cloudPct: 30,
    checks: [
      shockIs("sharp_cooldown"),
      trendIs("stable"),
      v2FinalAtMost(-1),
      scoreDeltaWithin(6),
    ],
  },
  {
    id: "river_warming_trend_stable_flow",
    name: "River warming trend with stable flow",
    qualitativeExpectation:
      "Warming toward a better river seasonal window should be non-negative.",
    regionKey: "midwest_interior",
    month: 4,
    context: "freshwater_river",
    dailyMeanF: 58,
    priorMeanF: 53,
    dayMinus2MeanF: 48,
    precip24In: 0.02,
    precip72In: 0.05,
    precip7dIn: 0.3,
    cloudPct: 58,
    checks: [
      trendIs("warming"),
      shockIs("none"),
      trendComponentAtLeast(0),
      v2FinalAtLeast(0),
    ],
  },
  {
    id: "coastal_measured_water_stable_optimal",
    name: "Coastal measured-water stable optimal",
    qualitativeExpectation:
      "Measured coastal water should use coastal water source and stay favorable.",
    regionKey: "pacific_northwest",
    month: 5,
    context: "coastal",
    dailyMeanF: 62,
    priorMeanF: 60,
    dayMinus2MeanF: 59,
    measuredWaterTempF: 56,
    measuredWaterTemp24hAgoF: 56,
    measuredWaterTemp72hAgoF: 56,
    checks: [
      sourceIs("coastal_water_temp"),
      stabilityBasisIs("complete_history"),
      v2FinalAtLeast(0.5),
      shockIs("none"),
    ],
  },
  {
    id: "coastal_measured_water_sharp_cooldown",
    name: "Coastal measured-water sharp cooldown",
    qualitativeExpectation:
      "Measured water sharp cooldown should be negative and same-source.",
    regionKey: "northern_california",
    month: 6,
    context: "coastal",
    dailyMeanF: 64,
    priorMeanF: 63,
    dayMinus2MeanF: 62,
    measuredWaterTempF: 50,
    measuredWaterTemp24hAgoF: 62,
    measuredWaterTemp72hAgoF: 64,
    windMph: 15,
    checks: [
      sourceIs("coastal_water_temp"),
      shockIs("sharp_cooldown"),
      trendIs("stable"),
      v2FinalAtMost(-1),
    ],
  },
  {
    id: "coastal_air_fallback_no_measured_water",
    name: "Coastal air fallback with no measured water",
    qualitativeExpectation:
      "No measured water should remain an air_daily_mean fallback.",
    regionKey: "southeast_atlantic",
    month: 5,
    context: "coastal",
    dailyMeanF: 72,
    priorMeanF: 72,
    dayMinus2MeanF: 71,
    checks: [
      sourceIs("air_daily_mean"),
      stabilityBasisIs("complete_history"),
      shockIs("none"),
      scoreDeltaWithin(6),
    ],
  },
  {
    id: "flats_estuary_warm_water_strong_tide",
    name: "Flats/estuary warm water with strong tide",
    qualitativeExpectation:
      "Warm flats water should use measured water while strong tide remains outside temperature scoring.",
    regionKey: "florida",
    month: 6,
    context: "coastal_flats_estuary",
    dailyMeanF: 84,
    priorMeanF: 84,
    dayMinus2MeanF: 83,
    measuredWaterTempF: 82,
    measuredWaterTemp24hAgoF: 81,
    measuredWaterTemp72hAgoF: 80,
    currentSpeedKnotsMax: 1.8,
    tideMovementState: "incoming",
    tideStrong: true,
    checks: [
      sourceIs("coastal_water_temp"),
      shockIs("none"),
      trendComponentAtMost(0.2),
      scoreDeltaWithin(6),
    ],
  },
  {
    id: "missing_history_no_stability_bonus",
    name: "Missing-history case where V2 must not award stability",
    qualitativeExpectation: "Missing history should get no stability bonus.",
    regionKey: "midwest_interior",
    month: 5,
    context: "freshwater_lake_pond",
    dailyMeanF: 66,
    priorMeanF: null,
    dayMinus2MeanF: null,
    checks: [
      sourceIs("air_daily_mean"),
      stabilityBasisIs("partial_or_missing_history"),
      stabilityComponentIs(0),
      shockIs("none"),
      trendComponentAtMost(0),
    ],
  },
];

function evaluateFixture(fixture: Fixture): ReadinessRow {
  const req = buildRequest(fixture);
  const baselineNorm = buildSharedNormalizedOutput(req);
  const baselineScored = scoreDay(baselineNorm);
  const { v2, v2Norm } = cloneWithV2Temperature(baselineNorm, req);
  const v2Scored = scoreDay(v2Norm);
  const rowBase = {
    fixture_id: fixture.id,
    name: fixture.name,
    qualitative_expectation: fixture.qualitativeExpectation,
    region_key: fixture.regionKey,
    month: fixture.month,
    context: fixture.context,
    baseline_score: baselineScored.score,
    v2_score: v2Scored.score,
    score_delta: v2Scored.score - baselineScored.score,
    baseline_activity_tier: compositeScoreActivityTier(baselineScored.score),
    v2_activity_tier: compositeScoreActivityTier(v2Scored.score),
    baseline_temperature: tempSnapshot(
      baselineNorm.normalized.temperature ?? null,
    ),
    v2_temperature: tempSnapshot(v2Norm.normalized.temperature ?? null),
    v2_diagnostics: v2.diagnostics,
    recommender: recommenderCompare({
      req,
      baselineNorm,
      baselineScored,
      v2Norm,
      v2Scored,
    }),
  };
  const provisional = {
    ...rowBase,
    checks: [],
    passed: false,
    questionable: false,
  } satisfies ReadinessRow;
  const checks = fixture.checks.map((check) => ({
    label: check.label,
    passed: check.pass(provisional),
  }));
  const passed = checks.every((check) => check.passed);
  return {
    ...rowBase,
    checks,
    passed,
    questionable: !passed,
  };
}

function passFail(value: boolean): string {
  return value ? "PASS" : "FAIL";
}

function picks(snapshot: RecommenderSnapshot): string {
  return [
    ...snapshot.selected_lure_ids,
    ...snapshot.selected_fly_ids,
  ].join(", ");
}

const rows = fixtures.map(evaluateFixture);
const failedRows = rows.filter((row) => !row.passed);
const recommenderRows = rows.filter((row) =>
  row.recommender != null && !("error" in row.recommender)
);
const recommenderChangeRows = recommenderRows.filter((row) =>
  row.recommender != null &&
  !("error" in row.recommender) &&
  (row.recommender.pick_ids_changed ||
    row.recommender.baseline.activity_level !==
      row.recommender.v2.activity_level ||
    row.recommender.baseline.thermal_mode !== row.recommender.v2.thermal_mode ||
    row.recommender.baseline.surface_daily_gate !==
      row.recommender.v2.surface_daily_gate)
);
const topDeltas = [...rows].sort((a, b) =>
  Math.abs(b.score_delta) - Math.abs(a.score_delta)
).slice(0, 10);

const fixtureLines = rows.map((row) => {
  const failedChecks = row.checks.filter((check) => !check.passed)
    .map((check) => check.label).join("; ") || "-";
  return `| ${
    passFail(row.passed)
  } | ${row.fixture_id} | ${row.region_key} | ${row.month} | ${row.context} | ${
    row.baseline_temperature?.final_score ?? "n/a"
  } | ${
    row.v2_temperature?.final_score ?? "n/a"
  } | ${row.score_delta} | ${failedChecks} |`;
}).join("\n");

const questionableLines =
  failedRows.map((row) =>
    `| ${row.fixture_id} | ${row.qualitative_expectation} | ${
      row.checks.filter((check) => !check.passed).map((check) => check.label)
        .join("; ")
    } |`
  ).join("\n") || "| None | - | - |";

const topDeltaLines = topDeltas.map((row) =>
  `| ${row.fixture_id} | ${row.region_key} | ${row.month} | ${row.context} | ${row.baseline_score} | ${row.v2_score} | ${row.score_delta} | ${
    row.baseline_temperature?.final_score ?? "n/a"
  } | ${row.v2_temperature?.final_score ?? "n/a"} |`
).join("\n");

const recommenderLines = recommenderRows.map((row) => {
  const rec = row.recommender;
  if (rec == null || "error" in rec) throw new Error("Invalid recommender row");
  const changed = rec.pick_ids_changed ||
    rec.baseline.activity_level !== rec.v2.activity_level ||
    rec.baseline.thermal_mode !== rec.v2.thermal_mode ||
    rec.baseline.surface_daily_gate !== rec.v2.surface_daily_gate;
  return `| ${
    changed ? "YES" : "NO"
  } | ${row.fixture_id} | ${rec.species} | ${rec.baseline.activity_level} -> ${rec.v2.activity_level} | ${rec.baseline.thermal_mode} -> ${rec.v2.thermal_mode} | ${rec.baseline.surface_daily_gate} -> ${rec.v2.surface_daily_gate} | ${
    picks(rec.baseline)
  } | ${picks(rec.v2)} |`;
}).join("\n") ||
  "| No supported freshwater fixtures | - | - | - | - | - | - | - |";

const recommendation = failedRows.length === 0
  ? "ready for production wiring"
  : "needs tuning";

const markdown = `# Today's Bite Temperature V2 Readiness Audit

Generated: ${new Date().toISOString()}

Temperature V2 is production-wired. This audit compares production temperature output against the experiment module for named qualitative fixtures and verifies the production behavior remains ready.

## Recommendation

${recommendation}

## Summary

| Metric | Value |
| --- | ---: |
| Fixture count | ${rows.length} |
| Passed fixtures | ${rows.length - failedRows.length} |
| Failed/questionable fixtures | ${failedRows.length} |
| Supported recommender fixtures | ${recommenderRows.length} |
| Recommender-facing changed fixtures | ${recommenderChangeRows.length} |

## V2 Constants

| Constant | Value |
| --- | ---: |
| bandWeight | ${DEFAULT_TEMPERATURE_V2_CONSTANTS.bandWeight} |
| stableBonus | ${DEFAULT_TEMPERATURE_V2_CONSTANTS.stableBonus} |
| maxTrendComponent | ${DEFAULT_TEMPERATURE_V2_CONSTANTS.maxTrendComponent} |

## Fixture Pass/Fail

| Result | Fixture | Region | Month | Context | Baseline Temp | V2 Temp | Score Delta | Failed Checks |
| --- | --- | --- | ---: | --- | ---: | ---: | ---: | --- |
${fixtureLines}

## Questionable Fixtures

| Fixture | Expected Direction | Failed Checks |
| --- | --- | --- |
${questionableLines}

## Top Score Deltas

| Fixture | Region | Month | Context | Baseline Score | V2 Score | Delta | Baseline Temp | V2 Temp |
| --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |
${topDeltaLines}

## Recommender-Facing Changes

Daily-picks comparison is included only where the fixture context/species is supported by the current daily-picks engine.

| Changed | Fixture | Species | Activity | Thermal Mode | Surface Gate | Baseline Picks | V2 Picks |
| --- | --- | --- | --- | --- | --- | --- | --- |
${recommenderLines}

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
