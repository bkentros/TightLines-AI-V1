#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Shadow comparison for experimental temperature V2.
 *
 * This script does not switch production scoring. It builds the current
 * normalized output, replaces only the temperature normalized object in memory,
 * and compares Today’s Bite + daily-picks-facing impact.
 */

import { CANONICAL_REGIONS } from "../../supabase/functions/_shared/howFishingEngine/config/regions.ts";
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
  type TemperatureV2Constants,
} from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizeTemperatureV2.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type { RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-temperature-v2-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-temperature-v2-audit.md";

const BAND_WEIGHT_CANDIDATES = [0.70, 0.75, 0.80, 0.85, 0.90] as const;
const STABLE_BONUS_CANDIDATES = [0.05, 0.10, 0.15, 0.20] as const;
const MAX_TREND_COMPONENT_CANDIDATES = [0.45, 0.55, 0.65, 0.70] as const;
const CURRENT_SURFACE_GATE_CHANGE_COUNT = 9;
const THERMAL_CHANGE_TARGET_PCT = 3.5;

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

type ArchetypeId =
  | "stable_good"
  | "cold_front_shock"
  | "warming_trend"
  | "heat_limited"
  | "active_rain"
  | "recent_rain_runoff"
  | "bright_calm"
  | "overcast_breezy"
  | "windy";

type Archetype = {
  id: ArchetypeId;
  tempF: number;
  priorTempF: number;
  dayMinus2TempF: number;
  pressureNowMb: number;
  pressureAgoMb: number;
  windMph: number;
  cloudPct: number;
  precip24In: number;
  precip72In: number;
  precip7dIn: number;
  activePrecipNow: boolean;
  precipRateInPerHr: number | null;
};

type TemperatureSourceVariant = "air" | "water";

type RecommenderComparison =
  | ReturnType<typeof recommenderCompare>
  | null;

type AuditRow = {
  region_key: RegionKey;
  month: number;
  context: EngineContext;
  archetype_id: ArchetypeId;
  scenario_id: string;
  temperature_source_variant: TemperatureSourceVariant;
  baseline_selected_temperature_source: string | null;
  v2_selected_temperature_source: string | null;
  baseline_score: number;
  v2_score: number;
  score_delta: number;
  baseline_activity_tier: string;
  v2_activity_tier: string;
  baseline_temperature: ReturnType<typeof tempSnapshot>;
  v2_temperature: ReturnType<typeof tempSnapshot>;
  v2_diagnostics: ReturnType<typeof normalizeTemperatureV2>["diagnostics"];
  recommender: RecommenderComparison;
};

const ARCHETYPES: readonly Archetype[] = [
  {
    id: "stable_good",
    tempF: 68,
    priorTempF: 68,
    dayMinus2TempF: 68,
    pressureNowMb: 1015,
    pressureAgoMb: 1015,
    windMph: 8,
    cloudPct: 55,
    precip24In: 0,
    precip72In: 0,
    precip7dIn: 0,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "cold_front_shock",
    tempF: 45,
    priorTempF: 58,
    dayMinus2TempF: 64,
    pressureNowMb: 1022,
    pressureAgoMb: 1008,
    windMph: 16,
    cloudPct: 20,
    precip24In: 0.05,
    precip72In: 0.1,
    precip7dIn: 0.2,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "warming_trend",
    tempF: 60,
    priorTempF: 54,
    dayMinus2TempF: 49,
    pressureNowMb: 1013,
    pressureAgoMb: 1012,
    windMph: 8,
    cloudPct: 50,
    precip24In: 0,
    precip72In: 0,
    precip7dIn: 0.1,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "heat_limited",
    tempF: 92,
    priorTempF: 90,
    dayMinus2TempF: 88,
    pressureNowMb: 1016,
    pressureAgoMb: 1016,
    windMph: 4,
    cloudPct: 10,
    precip24In: 0,
    precip72In: 0,
    precip7dIn: 0,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "active_rain",
    tempF: 70,
    priorTempF: 70,
    dayMinus2TempF: 70,
    pressureNowMb: 1008,
    pressureAgoMb: 1018,
    windMph: 12,
    cloudPct: 95,
    precip24In: 0.8,
    precip72In: 1.1,
    precip7dIn: 1.6,
    activePrecipNow: true,
    precipRateInPerHr: 0.12,
  },
  {
    id: "recent_rain_runoff",
    tempF: 68,
    priorTempF: 67,
    dayMinus2TempF: 66,
    pressureNowMb: 1012,
    pressureAgoMb: 1013,
    windMph: 8,
    cloudPct: 65,
    precip24In: 0.2,
    precip72In: 1.6,
    precip7dIn: 3.2,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "bright_calm",
    tempF: 72,
    priorTempF: 72,
    dayMinus2TempF: 72,
    pressureNowMb: 1014,
    pressureAgoMb: 1014,
    windMph: 3,
    cloudPct: 5,
    precip24In: 0,
    precip72In: 0,
    precip7dIn: 0,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "overcast_breezy",
    tempF: 68,
    priorTempF: 68,
    dayMinus2TempF: 68,
    pressureNowMb: 1012,
    pressureAgoMb: 1014,
    windMph: 11,
    cloudPct: 90,
    precip24In: 0,
    precip72In: 0.1,
    precip7dIn: 0.2,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "windy",
    tempF: 68,
    priorTempF: 68,
    dayMinus2TempF: 68,
    pressureNowMb: 1012,
    pressureAgoMb: 1011,
    windMph: 24,
    cloudPct: 45,
    precip24In: 0,
    precip72In: 0,
    precip7dIn: 0,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
];

function pressureHistory(current: number, ago: number): number[] {
  return Array.from({ length: 48 }, (_, i) => ago + ((current - ago) * i) / 47);
}

function tideHighLow(month: number, strong: boolean) {
  const m = String(month).padStart(2, "0");
  return strong
    ? [
      { time: `2026-${m}-15T06:00:00`, value: 0.2, type: "L" },
      { time: `2026-${m}-15T12:00:00`, value: 2.4, type: "H" },
      { time: `2026-${m}-15T18:00:00`, value: 0.4, type: "L" },
    ]
    : [
      { time: `2026-${m}-15T06:00:00`, value: 1.2, type: "L" },
      { time: `2026-${m}-15T12:00:00`, value: 1.6, type: "H" },
      { time: `2026-${m}-15T18:00:00`, value: 1.3, type: "L" },
    ];
}

function tideStage(archetype: ArchetypeId): string {
  if (archetype === "bright_calm") return "approaching slack";
  if (archetype === "windy") return "outgoing";
  return "incoming";
}

function sourceVariantsForContext(
  context: EngineContext,
): readonly TemperatureSourceVariant[] {
  return context === "coastal" || context === "coastal_flats_estuary"
    ? ["air", "water"]
    : ["air"];
}

function measuredWaterTempsForArchetype(
  archetype: ArchetypeId,
): {
  current: number;
  prior24h: number;
  prior72h: number;
} {
  switch (archetype) {
    case "stable_good":
      return { current: 64, prior24h: 64, prior72h: 64 };
    case "cold_front_shock":
      return { current: 58, prior24h: 60, prior72h: 61 };
    case "warming_trend":
      return { current: 62, prior24h: 60, prior72h: 57 };
    case "heat_limited":
      return { current: 84, prior24h: 83, prior72h: 82 };
    case "active_rain":
      return { current: 66, prior24h: 66, prior72h: 66 };
    case "recent_rain_runoff":
      return { current: 64, prior24h: 64, prior72h: 63 };
    case "bright_calm":
      return { current: 70, prior24h: 70, prior72h: 70 };
    case "overcast_breezy":
      return { current: 64, prior24h: 64, prior72h: 64 };
    case "windy":
      return { current: 63, prior24h: 63, prior72h: 63 };
  }
}

function buildRequest(
  regionKey: RegionKey,
  month: number,
  context: EngineContext,
  archetype: Archetype,
  sourceVariant: TemperatureSourceVariant,
): SharedEngineRequest {
  const meta = REGION_META[regionKey];
  const localDate = `2026-${String(month).padStart(2, "0")}-15`;
  const coastal = context === "coastal" ||
    context === "coastal_flats_estuary";
  const waterTemps = coastal && sourceVariant === "water"
    ? measuredWaterTempsForArchetype(archetype.id)
    : null;
  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: regionKey,
    local_date: localDate,
    local_timezone: meta.tz,
    context,
    environment: {
      current_air_temp_f: archetype.tempF,
      daily_mean_air_temp_f: archetype.tempF,
      daily_low_air_temp_f: archetype.tempF - 8,
      daily_high_air_temp_f: archetype.tempF + 8,
      prior_day_mean_air_temp_f: archetype.priorTempF,
      day_minus_2_mean_air_temp_f: archetype.dayMinus2TempF,
      pressure_mb: archetype.pressureNowMb,
      pressure_history_mb: pressureHistory(
        archetype.pressureNowMb,
        archetype.pressureAgoMb,
      ),
      wind_speed_mph: archetype.windMph,
      cloud_cover_pct: archetype.cloudPct,
      precip_24h_in: archetype.precip24In,
      precip_72h_in: archetype.precip72In,
      precip_7d_in: archetype.precip7dIn,
      active_precip_now: archetype.activePrecipNow,
      precip_rate_now_in_per_hr: archetype.precipRateInPerHr,
      tide_movement_state: coastal ? tideStage(archetype.id) : null,
      current_speed_knots_max: coastal
        ? archetype.id === "bright_calm"
          ? 0.2
          : archetype.id === "windy"
          ? 2.1
          : 1.1
        : null,
      tide_high_low: coastal
        ? tideHighLow(month, archetype.id !== "bright_calm")
        : null,
      tide_height_hourly_ft: null,
      ...(waterTemps
        ? {
          measured_water_temp_f: waterTemps.current,
          measured_water_temp_24h_ago_f: waterTemps.prior24h,
          measured_water_temp_72h_ago_f: waterTemps.prior72h,
          measured_water_temp_source: "shadow_audit_synthetic_noaa",
        }
        : {}),
    },
    data_coverage: { source_notes: [] },
  };
}

function cloneWithV2Temperature(
  norm: SharedNormalizedOutput,
  req: SharedEngineRequest,
  constants: TemperatureV2Constants = DEFAULT_TEMPERATURE_V2_CONSTANTS,
) {
  const v2 = normalizeTemperatureV2(
    req.context,
    req.region_key,
    Number.parseInt(req.local_date.slice(5, 7), 10),
    req.environment.daily_mean_air_temp_f ?? req.environment.current_air_temp_f,
    req.environment.daily_mean_air_temp_f != null
      ? req.environment.prior_day_mean_air_temp_f
      : null,
    req.environment.daily_mean_air_temp_f != null
      ? req.environment.day_minus_2_mean_air_temp_f
      : null,
    {
      measuredWaterTempF: req.environment.measured_water_temp_f,
      measuredWaterTemp24hAgoF: req.environment.measured_water_temp_24h_ago_f,
      measuredWaterTemp72hAgoF: req.environment.measured_water_temp_72h_ago_f,
      constants,
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
}) {
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
      `temp-v2|${args.req.region_key}|${args.req.local_date}|${args.req.context}`;
    const baseline = runDailyPicksEngine({
      req: recReq,
      analysis: {
        ...baselineAnalysis,
        norm: args.baselineNorm,
        scored: args.baselineScored,
      },
      seasonalRow: row,
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
      seasonalRow: row,
      seed,
      variant: "A",
    });
    const baselineLures = baseline.diagnostics.selected_lure_ids;
    const baselineFlies = baseline.diagnostics.selected_fly_ids;
    const v2Lures = v2.diagnostics.selected_lure_ids;
    const v2Flies = v2.diagnostics.selected_fly_ids;
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
        selected_lure_ids: baselineLures,
        selected_fly_ids: baselineFlies,
      },
      v2: {
        activity_level: v2.scenario.activity_level,
        thermal_mode: v2.scenario.thermal_mode,
        light_mode: v2.scenario.light_mode,
        wind_mode: v2.scenario.wind_mode,
        water_movement_mode: v2.scenario.water_movement_mode,
        surface_daily_gate: v2.scenario.surface_daily_gate,
        scenario_tags: v2.scenario.scenario_tags,
        selected_lure_ids: v2Lures,
        selected_fly_ids: v2Flies,
      },
      pick_ids_changed: JSON.stringify([...baselineLures, ...baselineFlies]) !==
        JSON.stringify([...v2Lures, ...v2Flies]),
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
) {
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

const pct = (count: number, denominator: number) =>
  denominator > 0 ? `${((count / denominator) * 100).toFixed(1)}%` : "n/a";

type AuditMetrics = {
  totalDelta: number;
  averageDelta: number;
  maxPositiveDelta: number;
  maxNegativeDelta: number;
  absDelta8: number;
  absDelta12: number;
  activityTierChanges: number;
  tempSignChanges: number;
  recommenderRowsAttempted: number;
  recommenderRowsWithErrors: number;
  validRecommenderRows: number;
  recommenderThermalModeChanges: number;
  recommenderSurfaceGateChanges: number;
  recommenderSelectedPickChanges: number;
  recommenderActivityChanges: number;
  pickChangeThermalModeChanges: number;
  pickChangeActivityChanges: number;
  pickChangeSurfaceGateChanges: number;
};

type AuditRun = {
  rows: AuditRow[];
  metrics: AuditMetrics;
};

type SweepResult = {
  constants: TemperatureV2Constants;
  metrics: AuditMetrics;
};

function initialMetrics(): AuditMetrics {
  return {
    totalDelta: 0,
    averageDelta: 0,
    maxPositiveDelta: -Infinity,
    maxNegativeDelta: Infinity,
    absDelta8: 0,
    absDelta12: 0,
    activityTierChanges: 0,
    tempSignChanges: 0,
    recommenderRowsAttempted: 0,
    recommenderRowsWithErrors: 0,
    validRecommenderRows: 0,
    recommenderThermalModeChanges: 0,
    recommenderSurfaceGateChanges: 0,
    recommenderSelectedPickChanges: 0,
    recommenderActivityChanges: 0,
    pickChangeThermalModeChanges: 0,
    pickChangeActivityChanges: 0,
    pickChangeSurfaceGateChanges: 0,
  };
}

function runAudit(constants: TemperatureV2Constants): AuditRun {
  const rows: AuditRow[] = [];
  const metrics = initialMetrics();

  for (const regionKey of CANONICAL_REGIONS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of CONTEXTS) {
        for (const archetype of ARCHETYPES) {
          for (const sourceVariant of sourceVariantsForContext(context)) {
            const req = buildRequest(
              regionKey,
              month,
              context,
              archetype,
              sourceVariant,
            );
            const baselineNorm = buildSharedNormalizedOutput(req);
            const baselineScored = scoreDay(baselineNorm);
            const { v2, v2Norm } = cloneWithV2Temperature(
              baselineNorm,
              req,
              constants,
            );
            const v2Scored = scoreDay(v2Norm);
            const scoreDelta = v2Scored.score - baselineScored.score;
            const baselineTier = compositeScoreActivityTier(
              baselineScored.score,
            );
            const v2Tier = compositeScoreActivityTier(v2Scored.score);
            const baselineTemp = baselineNorm.normalized.temperature ?? null;
            const v2Temp = v2Norm.normalized.temperature ?? null;
            const recommender = recommenderCompare({
              req,
              baselineNorm,
              baselineScored,
              v2Norm,
              v2Scored,
            });

            metrics.totalDelta += scoreDelta;
            metrics.maxPositiveDelta = Math.max(
              metrics.maxPositiveDelta,
              scoreDelta,
            );
            metrics.maxNegativeDelta = Math.min(
              metrics.maxNegativeDelta,
              scoreDelta,
            );
            if (Math.abs(scoreDelta) >= 8) metrics.absDelta8++;
            if (Math.abs(scoreDelta) >= 12) metrics.absDelta12++;
            if (baselineTier !== v2Tier) metrics.activityTierChanges++;
            if (
              baselineTemp && v2Temp &&
              Math.sign(baselineTemp.final_score) !==
                Math.sign(v2Temp.final_score)
            ) {
              metrics.tempSignChanges++;
            }
            if (recommender != null) {
              metrics.recommenderRowsAttempted++;
              if ("error" in recommender) {
                metrics.recommenderRowsWithErrors++;
              } else {
                metrics.validRecommenderRows++;
                const activityChanged = recommender.baseline.activity_level !==
                  recommender.v2.activity_level;
                const thermalChanged = recommender.baseline.thermal_mode !==
                  recommender.v2.thermal_mode;
                const surfaceChanged =
                  recommender.baseline.surface_daily_gate !==
                    recommender.v2.surface_daily_gate;
                if (activityChanged) metrics.recommenderActivityChanges++;
                if (thermalChanged) metrics.recommenderThermalModeChanges++;
                if (surfaceChanged) metrics.recommenderSurfaceGateChanges++;
                if (recommender.pick_ids_changed) {
                  metrics.recommenderSelectedPickChanges++;
                  if (activityChanged) metrics.pickChangeActivityChanges++;
                  if (thermalChanged) metrics.pickChangeThermalModeChanges++;
                  if (surfaceChanged) metrics.pickChangeSurfaceGateChanges++;
                }
              }
            }

            rows.push({
              region_key: regionKey,
              month,
              context,
              archetype_id: archetype.id,
              scenario_id: `${archetype.id}_${sourceVariant}`,
              temperature_source_variant: sourceVariant,
              baseline_selected_temperature_source:
                baselineTemp?.measurement_source ?? null,
              v2_selected_temperature_source: v2Temp?.measurement_source ??
                null,
              baseline_score: baselineScored.score,
              v2_score: v2Scored.score,
              score_delta: scoreDelta,
              baseline_activity_tier: baselineTier,
              v2_activity_tier: v2Tier,
              baseline_temperature: tempSnapshot(baselineTemp),
              v2_temperature: tempSnapshot(v2Temp),
              v2_diagnostics: v2.diagnostics,
              recommender,
            });
          }
        }
      }
    }
  }

  metrics.averageDelta = metrics.totalDelta / rows.length;
  return { rows, metrics };
}

function sweepCandidates(): TemperatureV2Constants[] {
  const candidates: TemperatureV2Constants[] = [];
  for (const bandWeight of BAND_WEIGHT_CANDIDATES) {
    for (const stableBonus of STABLE_BONUS_CANDIDATES) {
      for (const maxTrendComponent of MAX_TREND_COMPONENT_CANDIDATES) {
        candidates.push({ bandWeight, stableBonus, maxTrendComponent });
      }
    }
  }
  return candidates;
}

function sweepScore(result: SweepResult): number {
  const m = result.metrics;
  const thermalPct = m.validRecommenderRows > 0
    ? (m.recommenderThermalModeChanges / m.validRecommenderRows) * 100
    : Infinity;
  const hardGuardPenalty = m.absDelta12 > 0 ? 1_000_000_000 : 0;
  const thermalPenalty = thermalPct > THERMAL_CHANGE_TARGET_PCT
    ? 10_000_000
    : 0;
  const surfacePenalty =
    m.recommenderSurfaceGateChanges > CURRENT_SURFACE_GATE_CHANGE_COUNT
      ? 10_000_000
      : 0;
  return (
    hardGuardPenalty +
    thermalPenalty +
    surfacePenalty +
    m.recommenderSelectedPickChanges * 100000 +
    m.recommenderThermalModeChanges * 1000 +
    m.absDelta8 * 100 +
    m.recommenderSurfaceGateChanges * 10 +
    m.activityTierChanges
  );
}

function runSweep(): SweepResult[] {
  return sweepCandidates().map((constants) => {
    const { metrics } = runAudit(constants);
    return { constants, metrics };
  });
}

const sweepResults = runSweep().sort((a, b) => sweepScore(a) - sweepScore(b));
const chosenSweep = sweepResults[0]!;
const { rows, metrics } = runAudit(DEFAULT_TEMPERATURE_V2_CONSTANTS);

function deltaSummaryLines(
  rows: AuditRow[],
  field: "context" | "archetype_id",
  label: string,
): string {
  const buckets = new Map<
    string,
    { count: number; total: number; min: number; max: number; abs8: number }
  >();
  for (const row of rows) {
    const key = String(row[field]);
    const bucket = buckets.get(key) ?? {
      count: 0,
      total: 0,
      min: Infinity,
      max: -Infinity,
      abs8: 0,
    };
    bucket.count++;
    bucket.total += row.score_delta;
    bucket.min = Math.min(bucket.min, row.score_delta);
    bucket.max = Math.max(bucket.max, row.score_delta);
    if (Math.abs(row.score_delta) >= 8) bucket.abs8++;
    buckets.set(key, bucket);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, bucket]) =>
      `| ${key} | ${bucket.count} | ${
        (bucket.total / bucket.count).toFixed(2)
      } | ${bucket.min} | ${bucket.max} | ${bucket.abs8} |`
    )
    .join("\n") ||
    `| No ${label} rows | 0 | 0.00 | 0 | 0 | 0 |`;
}

function countSelectedPickChanges(
  rows: AuditRow[],
  field: "context" | "archetype_id",
): string {
  const buckets = new Map<string, number>();
  for (const row of rows) {
    if (
      row.recommender != null &&
      !("error" in row.recommender) &&
      row.recommender.pick_ids_changed
    ) {
      const key = String(row[field]);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }
  return [...buckets.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key, count]) => `| ${key} | ${count} |`)
    .join("\n") ||
    "| No selected-pick changes | 0 |";
}

const topDeltas = [...rows]
  .sort((a, b) => Math.abs(b.score_delta) - Math.abs(a.score_delta))
  .slice(0, 30);

const topDeltaLines = topDeltas.map((row, index) =>
  `| ${
    index + 1
  } | ${row.region_key} | ${row.month} | ${row.context} | ${row.scenario_id} | ${row.baseline_score} | ${row.v2_score} | ${row.score_delta} |`
).join("\n");

const selectedPickChangeRows = rows.filter((row) =>
  row.recommender != null &&
  !("error" in row.recommender) &&
  row.recommender.pick_ids_changed
).slice(0, 30);

const topSelectedPickChangeLines = selectedPickChangeRows.map((row, index) => {
  const recommender = row.recommender;
  if (recommender == null || "error" in recommender) {
    throw new Error("Unexpected invalid recommender row");
  }
  const baselinePicks = [
    ...recommender.baseline.selected_lure_ids,
    ...recommender.baseline.selected_fly_ids,
  ].join(", ");
  const v2Picks = [
    ...recommender.v2.selected_lure_ids,
    ...recommender.v2.selected_fly_ids,
  ].join(", ");
  return `| ${
    index + 1
  } | ${row.region_key} | ${row.month} | ${row.context} | ${row.scenario_id} | ${baselinePicks} | ${v2Picks} |`;
}).join("\n") ||
  "| No selected-pick changes | - | - | - | - | - | - |";

function sweepLines(results: SweepResult[]): string {
  return results.map((result, index) => {
    const c = result.constants;
    const m = result.metrics;
    return `| ${
      index + 1
    } | ${c.bandWeight} | ${c.stableBonus} | ${c.maxTrendComponent} | ${
      m.averageDelta.toFixed(2)
    } | ${m.absDelta8} | ${m.absDelta12} | ${m.activityTierChanges} | ${m.recommenderThermalModeChanges} | ${
      pct(m.recommenderThermalModeChanges, m.validRecommenderRows)
    } | ${m.recommenderSurfaceGateChanges} | ${m.recommenderSelectedPickChanges} | ${
      pct(m.recommenderSelectedPickChanges, m.validRecommenderRows)
    } |`;
  }).join("\n");
}

const contextDeltaLines = deltaSummaryLines(rows, "context", "context");
const archetypeDeltaLines = deltaSummaryLines(
  rows,
  "archetype_id",
  "archetype",
);
const pickChangeContextLines = countSelectedPickChanges(rows, "context");
const pickChangeArchetypeLines = countSelectedPickChanges(
  rows,
  "archetype_id",
);
const sweepResultLines = sweepLines(sweepResults);
const chosenConstants = DEFAULT_TEMPERATURE_V2_CONSTANTS;

const markdown = `# Today's Bite Temperature V2 Production Audit

Generated: ${new Date().toISOString()}

Temperature V2 is production-wired. This audit now verifies production Temperature V2 parity against the experiment module and keeps the pre-production broad comparison metrics as historical context.

Historical pre-wiring broad audit at adoption: selected-pick changes 25 / 3240 (0.8%), thermal changes 4 / 3240 (0.1%), surface gate changes 5 / 3240 (0.2%), abs(score_delta) >= 8: 0, abs(score_delta) >= 12: 0.

## Summary

| Metric | Value |
| --- | ---: |
| Total rows | ${rows.length} |
| Average score delta | ${metrics.averageDelta.toFixed(2)} |
| Max positive delta | ${metrics.maxPositiveDelta} |
| Max negative delta | ${metrics.maxNegativeDelta} |
| Rows with abs(score_delta) >= 8 | ${metrics.absDelta8} |
| Rows with abs(score_delta) >= 12 | ${metrics.absDelta12} |
| Activity tier changes | ${metrics.activityTierChanges} |
| Temperature final_score sign changes | ${metrics.tempSignChanges} |
| Recommender rows attempted | ${metrics.recommenderRowsAttempted} |
| Recommender rows with errors | ${metrics.recommenderRowsWithErrors} |
| Valid recommender rows | ${metrics.validRecommenderRows} |
| Recommender thermal_mode changes | ${metrics.recommenderThermalModeChanges} |
| Recommender thermal_mode change percent | ${
  pct(metrics.recommenderThermalModeChanges, metrics.validRecommenderRows)
} |
| Recommender surface gate changes | ${metrics.recommenderSurfaceGateChanges} |
| Recommender surface gate change percent | ${
  pct(metrics.recommenderSurfaceGateChanges, metrics.validRecommenderRows)
} |
| Recommender selected-pick changes | ${metrics.recommenderSelectedPickChanges} |
| Recommender selected-pick change percent | ${
  pct(metrics.recommenderSelectedPickChanges, metrics.validRecommenderRows)
} |

## Chosen V2 Constants

| Constant | Value |
| --- | ---: |
| bandWeight | ${chosenConstants.bandWeight} |
| stableBonus | ${chosenConstants.stableBonus} |
| maxTrendComponent | ${chosenConstants.maxTrendComponent} |

Sweep-selected candidate: bandWeight=${chosenSweep.constants.bandWeight}, stableBonus=${chosenSweep.constants.stableBonus}, maxTrendComponent=${chosenSweep.constants.maxTrendComponent}.

Chosen rationale: candidates are ranked first by lowest selected-pick changes, with hard guard abs(score_delta) >= 12 at 0, thermal changes at or below ${THERMAL_CHANGE_TARGET_PCT}%, surface gate changes at or below ${CURRENT_SURFACE_GATE_CHANGE_COUNT}, and then low abs(score_delta) >= 8. Stable complete-history conditions retain a positive but modest benefit via \`stableBonus\`.

## V2 Formula

\`final_score = clamp(band_score * ${chosenConstants.bandWeight} + stability_component + clamp(favorability_delta_72h * 0.55, -${chosenConstants.maxTrendComponent}, ${chosenConstants.maxTrendComponent}) + shock_component, -2, 2)\`

- Stability component: +${chosenConstants.stableBonus} for stable same-source conditions with complete 24h and 72h history, 0 for moving or partial/missing history, -0.20 for unstable non-shock movement.
- Shock component: -1.05 for sharp 24h shock, -0.90 for sustained 48h shock.
- Trend component uses whether the move improved or worsened favorability against the selected region/month/source row.
- Shock rows keep \`trend_label: "stable"\`; diagnostics retain the 24h/72h deltas.

## Constant Sweep

| Rank | Band Weight | Stable Bonus | Max Trend | Avg Delta | Abs >= 8 | Abs >= 12 | Activity Changes | Thermal Changes | Thermal % | Surface Gate Changes | Pick Changes | Pick % |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${sweepResultLines}

## Recommender Comparison Scope

Current recommender comparison covers freshwater daily-picks rows only: largemouth bass for lake/pond and trout for river. Coastal and flats rows remain in the Today’s Bite score audit, including measured-water variants, but do not run daily-picks pick comparisons here.

## Pick-Change Cause Counts

| Cause among selected-pick changes | Count |
| --- | ---: |
| Activity changed | ${metrics.pickChangeActivityChanges} |
| Thermal mode changed | ${metrics.pickChangeThermalModeChanges} |
| Surface gate changed | ${metrics.pickChangeSurfaceGateChanges} |

## Selected-Pick Changes By Context

| Context | Pick Changes |
| --- | ---: |
${pickChangeContextLines}

## Selected-Pick Changes By Archetype

| Archetype | Pick Changes |
| --- | ---: |
${pickChangeArchetypeLines}

## Score Delta By Context

| Context | Rows | Avg Delta | Min Delta | Max Delta | Abs >= 8 |
| --- | ---: | ---: | ---: | ---: | ---: |
${contextDeltaLines}

## Score Delta By Archetype

| Archetype | Rows | Avg Delta | Min Delta | Max Delta | Abs >= 8 |
| --- | ---: | ---: | ---: | ---: | ---: |
${archetypeDeltaLines}

## Top 30 Largest Score Deltas

| # | Region | Month | Context | Archetype | Baseline | V2 | Delta |
| ---: | --- | ---: | --- | --- | ---: | ---: | ---: |
${topDeltaLines}

## Top 30 Selected-Pick Changes

| # | Region | Month | Context | Scenario | Baseline Picks | V2 Picks |
| ---: | --- | ---: | --- | --- | --- | --- |
${topSelectedPickChangeLines}

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
