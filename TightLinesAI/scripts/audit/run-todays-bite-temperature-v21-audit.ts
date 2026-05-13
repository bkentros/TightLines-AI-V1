#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 5C Temperature V2.1-lite production parity audit.
 *
 * Production normalizeTemperature is now wired to the no-interpolation
 * behavior_complete_lite profile. This script verifies production parity against
 * the experiment default while retaining the historical pre-wiring impact.
 */

import {
  CANONICAL_REGION_KEYS,
  type RegionKey,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type {
  SharedConditionAnalysis,
  SharedEngineRequest,
  SharedNormalizedOutput,
  TemperatureNormalized,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import {
  DEFAULT_TEMPERATURE_V21_CONSTANTS,
  normalizeTemperatureV21,
  type TemperatureV21Constants,
  type TemperatureV21Diagnostics,
} from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizeTemperatureV21.ts";
import { normalizeTemperature } from "../../supabase/functions/_shared/howFishingEngine/normalize/normalizeTemperature.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type { RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-temperature-v21-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-temperature-v21-audit.md";

const CONTEXTS: readonly EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];
const DAYS = [1, 8, 15, 23, "last"] as const;

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
    lat: 40,
    lon: -86.2,
    state: "IN",
    tz: "America/Indiana/Indianapolis",
  },
  south_central: { lat: 30.3, lon: -97.7, state: "TX", tz: "America/Chicago" },
  mountain_west: { lat: 40.7, lon: -111.9, state: "UT", tz: "America/Denver" },
  southwest_desert: {
    lat: 33.4,
    lon: -112,
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
    lat: 34,
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
    lon: -123,
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

type Archetype = {
  id: string;
  temp: number;
  prior: number | null;
  minus2: number | null;
};

const ARCHETYPES: readonly Archetype[] = [
  { id: "stable_favorable", temp: 68, prior: 68, minus2: 68 },
  { id: "stable_neutral", temp: 57, prior: 57, minus2: 57 },
  { id: "stable_bad_hot", temp: 92, prior: 92, minus2: 92 },
  { id: "stable_bad_cold", temp: 28, prior: 28, minus2: 28 },
  { id: "missing_history", temp: 68, prior: null, minus2: null },
  { id: "warming_toward_good", temp: 66, prior: 55, minus2: 49 },
  { id: "shock_into_bad_heat", temp: 92, prior: 78, minus2: 74 },
  { id: "shock_into_bad_cold", temp: 30, prior: 44, minus2: 50 },
  { id: "cooling_relief", temp: 78, prior: 90, minus2: 94 },
];

type SourceVariant = "air" | "water";
type CandidateId =
  | "production_control"
  | "broad_interpolation_diagnostic"
  | "boundary_interpolation_diagnostic"
  | "conservative_shock_only"
  | "behavior_complete_lite";

type Candidate = {
  id: CandidateId;
  label: string;
  eligible: boolean;
  constants: TemperatureV21Constants | null;
};

const FINALIST_BASE = {
  bandWeight: 0.90,
  stableFavorableBonus: 0.05,
  stableBadComponent: 0,
  improvedShockFloor: -0.90,
  shockImprovementThreshold: 1.50,
  maxTrendComponent: 0.70,
  interpolationMode: "none" as const,
  edgeBlendDays: 0,
  shockMode: "direction_aware" as const,
};

const CANDIDATES: readonly Candidate[] = [
  {
    id: "production_control",
    label: "Production Temperature V2",
    eligible: false,
    constants: null,
  },
  {
    id: "conservative_shock_only",
    label: "Conservative shock-only V2.1-lite",
    eligible: true,
    constants: { ...FINALIST_BASE, stabilityMode: "production" },
  },
  {
    id: "behavior_complete_lite",
    label: "Production parity: behavior-complete V2.1-lite experiment default",
    eligible: true,
    constants: DEFAULT_TEMPERATURE_V21_CONSTANTS,
  },
  {
    id: "broad_interpolation_diagnostic",
    label: "Parked broad interpolation diagnostic",
    eligible: false,
    constants: {
      ...FINALIST_BASE,
      interpolationMode: "broad_month",
      shockImprovementThreshold: 0.75,
      improvedShockFloor: -0.50,
      stabilityMode: "favorability_aware",
    },
  },
  {
    id: "boundary_interpolation_diagnostic",
    label: "Parked boundary interpolation diagnostic",
    eligible: false,
    constants: {
      ...FINALIST_BASE,
      interpolationMode: "boundary_only",
      edgeBlendDays: 3,
      shockMode: "production",
      stabilityMode: "production",
      shockImprovementThreshold: 99,
      improvedShockFloor: -1.05,
    },
  },
];

type BaselineRow = {
  key: string;
  region: RegionKey;
  month: number;
  day: number;
  targetDate: string;
  context: EngineContext;
  sourceVariant: SourceVariant;
  archetype: Archetype;
  req: SharedEngineRequest;
  norm: SharedNormalizedOutput;
  scored: ReturnType<typeof scoreDay>;
};

type RecSnapshot =
  | {
    activity_level: string;
    thermal_mode: string;
    light_mode: string;
    wind_mode: string;
    water_movement_mode: string;
    surface_daily_gate: string;
    scenario_tags: readonly string[];
    selected_lure_ids: readonly string[];
    selected_fly_ids: readonly string[];
  }
  | { error: string }
  | null;

type CandidateEval = {
  candidate: Candidate;
  tempMismatches: number;
  scoreDeltaRows: number;
  avg: number;
  max: number;
  min: number;
  abs8: number;
  abs12: number;
  tierChanges: number;
  reliabilityChanges: number;
  signChanges: number;
  recValid: number;
  recErrors: number;
  recPickChanges: number;
  recThermalChanges: number;
  recSurfaceChanges: number;
  recTagChanges: number;
  shockRows: number;
  softenedShockRows: number;
  softenedTowardBetterRows: number;
  stableFavorableBonusRows: number;
  stableNeutralNoBonusRows: number;
  stableBadNoBonusRows: number;
  missingHistoryNoBonusRows: number;
};

type AuditRow = {
  candidate_id: CandidateId;
  region_key: RegionKey;
  month: number;
  day: number;
  target_date: string;
  context: EngineContext;
  source_variant: SourceVariant;
  archetype_id: string;
  baseline_score: number;
  v21_score: number;
  score_delta: number;
  baseline_temperature: TemperatureNormalized | null;
  v21_temperature: TemperatureNormalized | null;
  v21_diagnostics: TemperatureV21Diagnostics | null;
  recommender: {
    baseline: RecSnapshot;
    v21: RecSnapshot;
    selected_pick_ids_changed: boolean;
    thermal_mode_changed: boolean;
    surface_gate_changed: boolean;
    scenario_tags_changed: boolean;
  } | null;
};

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function localDate(month: number, day: number): string {
  return `2026-${String(month).padStart(2, "0")}-${
    String(day).padStart(2, "0")
  }`;
}

function coastal(context: EngineContext): boolean {
  return context === "coastal" || context === "coastal_flats_estuary";
}

function tideHighLow(date: string) {
  return [
    { time: `${date}T05:30:00`, value: 0.2, type: "L" },
    { time: `${date}T11:45:00`, value: 2.2, type: "H" },
    { time: `${date}T18:10:00`, value: 0.3, type: "L" },
  ];
}

function adjustedTemp(base: number, region: RegionKey, month: number): number {
  if (base >= 90 || base <= 32) return base;
  if (
    region === "florida" || region === "gulf_coast" ||
    region === "south_central"
  ) {
    return base + (month >= 6 && month <= 9 ? 8 : 2);
  }
  if (region === "alaska" || region === "mountain_alpine") return base - 8;
  if (month <= 2 || month === 12) return base - 12;
  return base;
}

function waterTempFromAir(temp: number): number {
  return Math.max(42, Math.min(88, temp - 8));
}

function buildRequest(args: {
  region: RegionKey;
  month: number;
  day: number;
  context: EngineContext;
  sourceVariant: SourceVariant;
  archetype: Archetype;
}): SharedEngineRequest {
  const meta = REGION_META[args.region];
  const date = localDate(args.month, args.day);
  const temp = adjustedTemp(args.archetype.temp, args.region, args.month);
  const prior = args.archetype.prior == null
    ? null
    : adjustedTemp(args.archetype.prior, args.region, args.month);
  const minus2 = args.archetype.minus2 == null
    ? null
    : adjustedTemp(args.archetype.minus2, args.region, args.month);
  const useWater = coastal(args.context) && args.sourceVariant === "water";
  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: args.region,
    local_date: date,
    local_timezone: meta.tz,
    context: args.context,
    environment: {
      current_air_temp_f: temp,
      daily_mean_air_temp_f: temp,
      daily_low_air_temp_f: temp - 6,
      daily_high_air_temp_f: temp + 8,
      prior_day_mean_air_temp_f: prior,
      day_minus_2_mean_air_temp_f: minus2,
      measured_water_temp_f: useWater ? waterTempFromAir(temp) : null,
      measured_water_temp_24h_ago_f: useWater && prior != null
        ? waterTempFromAir(prior)
        : null,
      measured_water_temp_72h_ago_f: useWater && minus2 != null
        ? waterTempFromAir(minus2)
        : null,
      measured_water_temp_source: useWater ? "audit_fixture" : null,
      pressure_mb: 1014,
      pressure_history_mb: Array.from({ length: 24 }, () => 1014),
      wind_speed_mph: 8,
      cloud_cover_pct: 55,
      precip_rate_now_in_per_hr: 0,
      active_precip_now: false,
      precip_24h_in: args.context === "freshwater_river" ? 0.08 : 0.02,
      precip_72h_in: args.context === "freshwater_river" ? 0.15 : 0.05,
      precip_7d_in: args.context === "freshwater_river" ? 0.4 : 0.1,
      tide_movement_state: coastal(args.context) ? "incoming" : null,
      current_speed_knots_max: coastal(args.context) ? 1 : null,
      tide_high_low: coastal(args.context) ? tideHighLow(date) : null,
      tide_height_hourly_ft: null,
    },
    data_coverage: { source_notes: [] },
  };
}

function buildRows(): BaselineRow[] {
  const rows: BaselineRow[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      const last = daysInMonth(2026, month);
      for (const dayChoice of DAYS) {
        const day = dayChoice === "last" ? last : Math.min(dayChoice, last);
        for (const context of CONTEXTS) {
          const sourceVariants: SourceVariant[] = coastal(context)
            ? ["air", "water"]
            : ["air"];
          for (const sourceVariant of sourceVariants) {
            for (const archetype of ARCHETYPES) {
              const req = buildRequest({
                region,
                month,
                day,
                context,
                sourceVariant,
                archetype,
              });
              const norm = buildSharedNormalizedOutput(req);
              const scored = scoreDay(norm);
              rows.push({
                key:
                  `${region}|${month}|${day}|${context}|${sourceVariant}|${archetype.id}`,
                region,
                month,
                day,
                targetDate: req.local_date,
                context,
                sourceVariant,
                archetype,
                req,
                norm,
                scored,
              });
            }
          }
        }
      }
    }
  }
  return rows;
}

function cloneWithTemperature(
  norm: SharedNormalizedOutput,
  temperature: TemperatureNormalized | null,
): SharedNormalizedOutput {
  const normalized = { ...norm.normalized };
  if (temperature) normalized.temperature = temperature;
  else delete normalized.temperature;
  return { ...norm, normalized };
}

function v21ForRow(row: BaselineRow, candidate: Candidate) {
  if (!candidate.constants) {
    return {
      temperature: row.norm.normalized.temperature ?? null,
      diagnostics: null,
    };
  }
  const env = row.req.environment;
  return normalizeTemperatureV21(
    row.context,
    row.region,
    row.month,
    env.daily_mean_air_temp_f,
    env.prior_day_mean_air_temp_f,
    env.day_minus_2_mean_air_temp_f,
    {
      measuredWaterTempF: env.measured_water_temp_f,
      measuredWaterTemp24hAgoF: env.measured_water_temp_24h_ago_f,
      measuredWaterTemp72hAgoF: env.measured_water_temp_72h_ago_f,
      targetDate: row.targetDate,
      constants: candidate.constants,
    },
  );
}

function productionTemperatureForRow(
  row: BaselineRow,
): TemperatureNormalized | null {
  const env = row.req.environment;
  return normalizeTemperature(
    row.context,
    row.region,
    row.month,
    env.daily_mean_air_temp_f,
    env.prior_day_mean_air_temp_f,
    env.day_minus_2_mean_air_temp_f,
    {
      measuredWaterTempF: env.measured_water_temp_f,
      measuredWaterTemp24hAgoF: env.measured_water_temp_24h_ago_f,
      measuredWaterTemp72hAgoF: env.measured_water_temp_72h_ago_f,
    },
  );
}

function sameNumber(
  a: number | null | undefined,
  b: number | null | undefined,
): boolean {
  if (a == null || b == null) return a == null && b == null;
  return Math.abs(a - b) <= 1e-4;
}

function sameTemperature(
  a: TemperatureNormalized | null,
  b: TemperatureNormalized | null,
): boolean {
  if (a == null || b == null) return a == null && b == null;
  return a.context_group === b.context_group &&
    a.measurement_source === b.measurement_source &&
    sameNumber(a.measurement_value_f, b.measurement_value_f) &&
    a.band_label === b.band_label &&
    sameNumber(a.band_score, b.band_score) &&
    a.trend_label === b.trend_label &&
    sameNumber(a.trend_adjustment, b.trend_adjustment) &&
    a.shock_label === b.shock_label &&
    a.shock_adjustment === b.shock_adjustment &&
    sameNumber(a.final_score, b.final_score);
}

function speciesForContext(context: EngineContext): SpeciesGroup | null {
  if (context === "freshwater_lake_pond") return "largemouth_bass";
  if (context === "freshwater_river") return "trout";
  return null;
}

function recFor(
  row: BaselineRow,
  norm: SharedNormalizedOutput,
  scored: ReturnType<typeof scoreDay>,
): RecSnapshot {
  const species = speciesForContext(row.context);
  if (!species) return null;
  try {
    const recReq: RecommenderRequest = {
      location: {
        latitude: row.req.latitude,
        longitude: row.req.longitude,
        state_code: row.req.state_code ?? "XX",
        region_key: row.region,
        local_date: row.targetDate,
        local_timezone: row.req.local_timezone,
        month: row.month,
      },
      species,
      context: row.context,
      water_clarity: "clear",
      recommendation_goal: "all_purpose",
      env_data: { ...row.req.environment, weather: { wind_speed_unit: "mph" } },
    };
    const baseAnalysis = analyzeRecommenderConditions(recReq);
    const analysis = {
      ...baseAnalysis,
      norm,
      scored,
    } as SharedConditionAnalysis;
    const seasonalRow = resolveDailyPicksSeasonalRow({
      species,
      region_key: row.region,
      month: row.month,
      water_type: row.context,
    });
    const result = runDailyPicksEngine({
      req: recReq,
      analysis,
      seasonalRow,
      seed: `temp-v21|${row.key}`,
      variant: "A",
    });
    return {
      activity_level: result.scenario.activity_level,
      thermal_mode: result.scenario.thermal_mode,
      light_mode: result.scenario.light_mode,
      wind_mode: result.scenario.wind_mode,
      water_movement_mode: result.scenario.water_movement_mode,
      surface_daily_gate: result.scenario.surface_daily_gate,
      scenario_tags: result.scenario.scenario_tags,
      selected_lure_ids: result.diagnostics.selected_lure_ids,
      selected_fly_ids: result.diagnostics.selected_fly_ids,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

function samePicks(a: RecSnapshot, b: RecSnapshot): boolean {
  if (a == null || b == null || "error" in a || "error" in b) return true;
  return JSON.stringify([...a.selected_lure_ids, ...a.selected_fly_ids]) ===
    JSON.stringify([...b.selected_lure_ids, ...b.selected_fly_ids]);
}

function sameTags(a: RecSnapshot, b: RecSnapshot): boolean {
  if (a == null || b == null || "error" in a || "error" in b) return true;
  return JSON.stringify([...a.scenario_tags].sort()) ===
    JSON.stringify([...b.scenario_tags].sort());
}

function constantsLabel(c: TemperatureV21Constants | null): string {
  if (!c) return "production";
  return `band=${c.bandWeight},stable=${c.stableFavorableBonus},bad=${c.stableBadComponent},shockFloor=${c.improvedShockFloor},shockImprove=${c.shockImprovementThreshold},trendMax=${c.maxTrendComponent},interp=${c.interpolationMode},edge=${c.edgeBlendDays},stabilityMode=${c.stabilityMode},shockMode=${c.shockMode}`;
}

function evaluateCandidate(
  candidate: Candidate,
  rows: BaselineRow[],
): { evalRow: CandidateEval; auditRows: AuditRow[] } {
  let tempMismatches = 0;
  let scoreDeltaRows = 0;
  let sum = 0;
  let max = -Infinity;
  let min = Infinity;
  let abs8 = 0;
  let abs12 = 0;
  let tierChanges = 0;
  let reliabilityChanges = 0;
  let signChanges = 0;
  let recValid = 0;
  let recErrors = 0;
  let recPickChanges = 0;
  let recThermalChanges = 0;
  let recSurfaceChanges = 0;
  let recTagChanges = 0;
  let shockRows = 0;
  let softenedShockRows = 0;
  let softenedTowardBetterRows = 0;
  let stableFavorableBonusRows = 0;
  let stableNeutralNoBonusRows = 0;
  let stableBadNoBonusRows = 0;
  let missingHistoryNoBonusRows = 0;
  const auditRows: AuditRow[] = [];

  for (const row of rows) {
    const v21 = v21ForRow(row, candidate);
    const productionTemperature = productionTemperatureForRow(row);
    if (!sameTemperature(productionTemperature, v21.temperature)) {
      tempMismatches++;
    }
    const v21Norm = cloneWithTemperature(row.norm, v21.temperature);
    const v21Scored = scoreDay(v21Norm);
    const delta = v21Scored.score - row.scored.score;
    if (Math.abs(delta) > 1e-9) scoreDeltaRows++;
    sum += delta;
    max = Math.max(max, delta);
    min = Math.min(min, delta);
    if (Math.abs(delta) >= 8) abs8++;
    if (Math.abs(delta) >= 12) abs12++;
    if (
      compositeScoreActivityTier(v21Scored.score) !==
        compositeScoreActivityTier(row.scored.score)
    ) tierChanges++;
    if (v21Norm.reliability !== row.norm.reliability) reliabilityChanges++;
    if (
      Math.sign(row.norm.normalized.temperature?.final_score ?? 0) !==
        Math.sign(v21.temperature?.final_score ?? 0)
    ) signChanges++;

    const d = v21.diagnostics;
    if (d) {
      if (v21.temperature?.shock_label !== "none") shockRows++;
      if (d.shock_reduction_applied) {
        softenedShockRows++;
        if (
          (d.favorability_delta_24h ?? -Infinity) >=
            (candidate.constants?.shockImprovementThreshold ?? Infinity) ||
          (d.favorability_delta_72h ?? -Infinity) >=
            (candidate.constants?.shockImprovementThreshold ?? Infinity)
        ) {
          softenedTowardBetterRows++;
        }
      }
      if (d.stability_class === "favorable" && d.stability_component > 0) {
        stableFavorableBonusRows++;
      }
      if (d.stability_class === "neutral" && d.stability_component === 0) {
        stableNeutralNoBonusRows++;
      }
      if (d.stability_class === "bad" && d.stability_component === 0) {
        stableBadNoBonusRows++;
      }
      if (
        d.stability_basis === "partial_or_missing_history" &&
        d.stability_component === 0
      ) missingHistoryNoBonusRows++;
    }

    let recommender: AuditRow["recommender"] = null;
    if (speciesForContext(row.context)) {
      const baseline = recFor(row, row.norm, row.scored);
      const next = recFor(row, v21Norm, v21Scored);
      if (
        baseline == null || next == null || "error" in baseline ||
        "error" in next
      ) recErrors++;
      else {
        recValid++;
        if (!samePicks(baseline, next)) recPickChanges++;
        if (baseline.thermal_mode !== next.thermal_mode) recThermalChanges++;
        if (baseline.surface_daily_gate !== next.surface_daily_gate) {
          recSurfaceChanges++;
        }
        if (!sameTags(baseline, next)) recTagChanges++;
      }
      recommender = {
        baseline,
        v21: next,
        selected_pick_ids_changed: !samePicks(baseline, next),
        thermal_mode_changed: baseline != null && next != null &&
          !("error" in baseline) && !("error" in next) &&
          baseline.thermal_mode !== next.thermal_mode,
        surface_gate_changed: baseline != null && next != null &&
          !("error" in baseline) && !("error" in next) &&
          baseline.surface_daily_gate !== next.surface_daily_gate,
        scenario_tags_changed: !sameTags(baseline, next),
      };
    }

    auditRows.push({
      candidate_id: candidate.id,
      region_key: row.region,
      month: row.month,
      day: row.day,
      target_date: row.targetDate,
      context: row.context,
      source_variant: row.sourceVariant,
      archetype_id: row.archetype.id,
      baseline_score: row.scored.score,
      v21_score: v21Scored.score,
      score_delta: delta,
      baseline_temperature: row.norm.normalized.temperature ?? null,
      v21_temperature: v21.temperature,
      v21_diagnostics: d,
      recommender,
    });
  }

  return {
    evalRow: {
      candidate,
      tempMismatches,
      scoreDeltaRows,
      avg: sum / rows.length,
      max,
      min,
      abs8,
      abs12,
      tierChanges,
      reliabilityChanges,
      signChanges,
      recValid,
      recErrors,
      recPickChanges,
      recThermalChanges,
      recSurfaceChanges,
      recTagChanges,
      shockRows,
      softenedShockRows,
      softenedTowardBetterRows,
      stableFavorableBonusRows,
      stableNeutralNoBonusRows,
      stableBadNoBonusRows,
      missingHistoryNoBonusRows,
    },
    auditRows,
  };
}

type ReadinessFixture = {
  id: string;
  region: RegionKey;
  month: number;
  day: number;
  context: EngineContext;
  sourceVariant: SourceVariant;
  archetype: Archetype;
  expectation: string;
  check: (row: AuditRow) => boolean;
};

const READINESS_FIXTURES: readonly ReadinessFixture[] = [
  {
    id: "stable_favorable_bonus",
    region: "great_lakes_upper_midwest",
    month: 5,
    day: 15,
    context: "freshwater_lake_pond",
    sourceVariant: "air",
    archetype: { id: "stable_favorable", temp: 68, prior: 68, minus2: 68 },
    expectation: "stability_component is +0.05 for behavior_complete_lite",
    check: (row) => row.v21_diagnostics?.stability_component === 0.05,
  },
  {
    id: "stable_neutral_no_bonus",
    region: "northeast",
    month: 4,
    day: 15,
    context: "freshwater_lake_pond",
    sourceVariant: "air",
    archetype: { id: "stable_neutral", temp: 55, prior: 55, minus2: 55 },
    expectation: "stable neutral gets 0 stability_component",
    check: (row) => row.v21_diagnostics?.stability_component === 0,
  },
  {
    id: "stable_bad_hot_no_bonus",
    region: "florida",
    month: 8,
    day: 15,
    context: "freshwater_lake_pond",
    sourceVariant: "air",
    archetype: { id: "stable_bad_hot", temp: 100, prior: 100, minus2: 100 },
    expectation: "stable bad hot gets 0 stability_component",
    check: (row) => row.v21_diagnostics?.stability_component === 0,
  },
  {
    id: "stable_bad_cold_no_bonus",
    region: "northeast",
    month: 1,
    day: 15,
    context: "freshwater_river",
    sourceVariant: "air",
    archetype: { id: "stable_bad_cold", temp: 28, prior: 28, minus2: 28 },
    expectation: "stable bad cold gets 0 stability_component",
    check: (row) => row.v21_diagnostics?.stability_component === 0,
  },
  {
    id: "missing_history_no_bonus",
    region: "midwest_interior",
    month: 5,
    day: 15,
    context: "freshwater_lake_pond",
    sourceVariant: "air",
    archetype: { id: "missing_history", temp: 68, prior: null, minus2: null },
    expectation: "missing history gets 0 stability_component",
    check: (row) => row.v21_diagnostics?.stability_component === 0,
  },
  {
    id: "better_shock_softened_to_floor",
    region: "northeast",
    month: 5,
    day: 15,
    context: "freshwater_lake_pond",
    sourceVariant: "air",
    archetype: { id: "warming_toward_good", temp: 70, prior: 55, minus2: 49 },
    expectation: "shock toward better temp softens to no better than -0.90",
    check: (row) =>
      row.v21_diagnostics?.shock_reduction_applied === true &&
      (row.v21_diagnostics?.shock_component ?? 0) <= -0.90,
  },
  {
    id: "worse_heat_full_shock",
    region: "florida",
    month: 6,
    day: 15,
    context: "freshwater_lake_pond",
    sourceVariant: "air",
    archetype: { id: "shock_into_bad_heat", temp: 100, prior: 80, minus2: 76 },
    expectation: "shock into worse heat keeps full penalty",
    check: (row) =>
      row.v21_diagnostics?.shock_reduction_applied === false &&
      (row.v21_diagnostics?.shock_component ?? 0) <= -1.05,
  },
  {
    id: "worse_cold_full_shock",
    region: "northeast",
    month: 2,
    day: 15,
    context: "freshwater_river",
    sourceVariant: "air",
    archetype: { id: "shock_into_bad_cold", temp: 30, prior: 62, minus2: 68 },
    expectation: "shock into worse cold keeps full penalty",
    check: (row) =>
      row.v21_diagnostics?.shock_reduction_applied === false &&
      (row.v21_diagnostics?.shock_component ?? 0) <= -1.05,
  },
  {
    id: "shock_blocks_trend",
    region: "northeast",
    month: 5,
    day: 15,
    context: "freshwater_lake_pond",
    sourceVariant: "air",
    archetype: { id: "cooling_relief", temp: 78, prior: 90, minus2: 94 },
    expectation: "shock never stacks trend bonus",
    check: (row) =>
      row.v21_temperature?.shock_label !== "none" &&
      row.v21_diagnostics?.trend_component === 0,
  },
  {
    id: "coastal_water_source",
    region: "pacific_northwest",
    month: 5,
    day: 15,
    context: "coastal",
    sourceVariant: "water",
    archetype: { id: "coastal_water", temp: 64, prior: 64, minus2: 64 },
    expectation: "coastal measured-water uses measured water source",
    check: (row) =>
      row.v21_temperature?.measurement_source === "coastal_water_temp",
  },
  {
    id: "coastal_air_source",
    region: "southeast_atlantic",
    month: 4,
    day: 15,
    context: "coastal",
    sourceVariant: "air",
    archetype: { id: "coastal_air", temp: 68, prior: 68, minus2: 68 },
    expectation: "coastal air fallback stays air source",
    check: (row) =>
      row.v21_temperature?.measurement_source === "air_daily_mean",
  },
  {
    id: "lake_picks_preserved",
    region: "midwest_interior",
    month: 6,
    day: 15,
    context: "freshwater_lake_pond",
    sourceVariant: "air",
    archetype: { id: "rec_lake", temp: 72, prior: 72, minus2: 72 },
    expectation: "lake recommender fixture preserves selected picks",
    check: (row) => row.recommender?.selected_pick_ids_changed === false,
  },
  {
    id: "river_picks_preserved",
    region: "mountain_west",
    month: 6,
    day: 15,
    context: "freshwater_river",
    sourceVariant: "air",
    archetype: { id: "rec_river", temp: 58, prior: 58, minus2: 58 },
    expectation: "river recommender fixture preserves selected picks",
    check: (row) => row.recommender?.selected_pick_ids_changed === false,
  },
];

function buildFixtureRows(
  candidate: Candidate,
): { row: AuditRow; fixture: ReadinessFixture; passed: boolean }[] {
  return READINESS_FIXTURES.map((fixture) => {
    const req = buildRequest({
      region: fixture.region,
      month: fixture.month,
      day: fixture.day,
      context: fixture.context,
      sourceVariant: fixture.sourceVariant,
      archetype: fixture.archetype,
    });
    const norm = buildSharedNormalizedOutput(req);
    const scored = scoreDay(norm);
    const baseline: BaselineRow = {
      key: `fixture|${fixture.id}`,
      region: fixture.region,
      month: fixture.month,
      day: fixture.day,
      targetDate: req.local_date,
      context: fixture.context,
      sourceVariant: fixture.sourceVariant,
      archetype: fixture.archetype,
      req,
      norm,
      scored,
    };
    const { auditRows } = evaluateCandidate(candidate, [baseline]);
    const row = auditRows[0]!;
    return { row, fixture, passed: fixture.check(row) };
  });
}

function candidateTable(evals: CandidateEval[]): string {
  return evals.map((e) =>
    `| ${e.candidate.id} | ${e.candidate.eligible ? "yes" : "no"} | ${
      constantsLabel(e.candidate.constants)
    } | ${e.tempMismatches} | ${e.scoreDeltaRows} | ${
      e.avg.toFixed(2)
    } | ${e.max} | ${e.min} | ${e.abs8} | ${e.abs12} | ${e.tierChanges} | ${e.reliabilityChanges} | ${e.signChanges} | ${e.recValid} | ${e.recPickChanges} | ${e.recThermalChanges} | ${e.recSurfaceChanges} | ${e.recTagChanges} |`
  ).join("\n");
}

function diagnosticsTable(evals: CandidateEval[]): string {
  return evals.map((e) =>
    `| ${e.candidate.id} | ${e.shockRows} | ${e.softenedShockRows} | ${e.softenedTowardBetterRows} | ${e.stableFavorableBonusRows} | ${e.stableNeutralNoBonusRows} | ${e.stableBadNoBonusRows} | ${e.missingHistoryNoBonusRows} |`
  ).join("\n");
}

function readinessTable(rows: ReturnType<typeof buildFixtureRows>): string {
  return rows.map(({ fixture, row, passed }) =>
    `| ${fixture.id} | ${fixture.expectation} | ${
      passed ? "pass" : "fail"
    } | ${row.score_delta} | ${
      row.v21_diagnostics?.stability_component ?? "null"
    } | ${row.v21_diagnostics?.shock_component ?? "null"} | ${
      row.v21_diagnostics?.trend_component ?? "null"
    } | ${row.recommender?.selected_pick_ids_changed ?? "n/a"} |`
  ).join("\n");
}

const baselineRows = buildRows();
const evaluated = CANDIDATES.map((candidate) =>
  evaluateCandidate(candidate, baselineRows)
);
const evalRows = evaluated.map((x) => x.evalRow);
const complete = evalRows.find((e) =>
  e.candidate.id === "behavior_complete_lite"
)!;
const completeReady = buildFixtureRows(complete.candidate);
const allAuditRows = evaluated.flatMap((x) => x.auditRows);

const parity = complete;
const parityReady = completeReady;
const parityReadinessPassed = parityReady.filter((x) => x.passed).length;

const markdown = `# Today's Bite Temperature V2.1-lite Production Parity

Generated: ${new Date().toISOString()}

Phase 5C production parity audit. Production \`normalizeTemperature(...)\` is wired to the no-interpolation \`behavior_complete_lite\` profile. Recommender production logic is unchanged.

## Production Parity

Production-vs-experiment profile: **behavior_complete_lite**

Experiment defaults: \`${constantsLabel(DEFAULT_TEMPERATURE_V21_CONSTANTS)}\`.

- Production-vs-experiment temp mismatches: **${parity.tempMismatches}**
- Production-vs-experiment score delta rows: **${parity.scoreDeltaRows}**
- Production-vs-experiment selected-pick changes: **${parity.recPickChanges}**
- Production-vs-experiment thermal changes: **${parity.recThermalChanges}**
- Production-vs-experiment surface changes: **${parity.recSurfaceChanges}**
- Production-vs-experiment tag changes: **${parity.recTagChanges}**

## Candidate / Diagnostic Comparison

| Candidate | Eligible | Constants | Temp Mismatches | Score Delta Rows | Avg Delta | Max | Min | abs>=8 | abs>=12 | Tier Changes | Reliability Changes | Sign Changes | Rec Valid | Pick Changes | Thermal Changes | Surface Changes | Tag Changes |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${candidateTable(evalRows)}

## Historical Pre-Wiring Finalist Impact

Retained from the Phase 5B shadow finalist lock:

- behavior_complete_lite avg score delta: **-0.02**
- max / min score delta: **+2 / -1**
- abs(score_delta) >= 8: **0**
- abs(score_delta) >= 12: **0**
- recommender selected-pick changes: **0**

## Qualitative Diagnostics

| Candidate | Shock Rows | Softened Shock Rows | Softened Toward Better Rows | Stable Favorable Bonus Rows | Stable Neutral No Bonus Rows | Stable Bad No Bonus Rows | Missing History No Bonus Rows |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${diagnosticsTable(evalRows)}

## Readiness Fixtures (behavior_complete_lite)

| Fixture | Expectation | Result | Score Delta | Stability Component | Shock Component | Trend Component | Picks Changed |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
${readinessTable(parityReady)}

Readiness passed: ${parityReadinessPassed} / ${parityReady.length}

## Interpolation Parked

Interpolation remains parked and not eligible for production wiring. Production uses the current region/month row directly; target-date/month interpolation plumbing was not added.

## Artifacts

- JSONL: \`${OUTPUT_JSONL}\`
- Markdown: \`${OUTPUT_MD}\`
`;

await Deno.writeTextFile(
  OUTPUT_JSONL,
  allAuditRows.map((row) => JSON.stringify(row)).join("\n") + "\n",
);
await Deno.writeTextFile(OUTPUT_MD, markdown);

console.log(markdown);
console.log(`Wrote ${OUTPUT_JSONL}`);
console.log(`Wrote ${OUTPUT_MD}`);
