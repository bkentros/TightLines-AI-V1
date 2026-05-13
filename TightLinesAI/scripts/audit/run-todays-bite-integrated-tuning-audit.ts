#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 9B integrated Today's Bite tuning audit.
 *
 * Shadow-only. This script clones production normalized output in memory,
 * applies candidate score adjustments, and compares the result to current
 * production. No production normalizers, scoreDay, report copy, app/forecast
 * behavior, or recommender production logic are modified.
 */

import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { analyzeSharedConditions } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type {
  ScoredVariableKey,
  SharedEngineRequest,
  SharedNormalizedOutput,
  VariableState,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import {
  CANONICAL_REGION_KEYS,
  type RegionKey,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { TemperatureNormalized } from "../../supabase/functions/_shared/howFishingEngine/contracts/variableState.ts";
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type {
  RecommenderRequest,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-integrated-tuning-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-integrated-tuning-audit.md";

const CONTEXTS = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
] as const satisfies readonly EngineContext[];
const WATER_CLARITIES = [
  "clear",
  "stained",
] as const satisfies readonly WaterClarity[];
const CANDIDATES = [
  "production_control",
  "precip_heavy_cap",
  "wet_baseline_stronger",
  "hot_bright_calm_compound",
  "improving_shock_soften",
  "combined_light",
  "combined_stronger",
] as const;

type CandidateId = typeof CANDIDATES[number];
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

type ArchetypeId =
  | "stable_good"
  | "stable_poor_hot"
  | "stable_poor_cold"
  | "warming_into_good"
  | "warming_into_heat"
  | "cooling_relief_after_heat"
  | "cold_front_shock"
  | "improving_shock_toward_good"
  | "overcast_calm"
  | "overcast_windy"
  | "bluebird_calm"
  | "bluebird_windy"
  | "heavy_active_rain"
  | "light_mist_dry_baseline"
  | "wet_baseline_recent_rain"
  | "river_stable_flow"
  | "river_elevated_dirty"
  | "river_blown_out"
  | "coastal_soft_moving_tide"
  | "coastal_slack_tide"
  | "coastal_too_hard_tide"
  | "flats_soft_current"
  | "flats_too_hard_current"
  | "missing_partial_data";

type Archetype = {
  id: ArchetypeId;
  temp:
    | "seasonal"
    | "hot"
    | "cold"
    | "warming_good"
    | "warming_heat"
    | "cooling_relief"
    | "cold_shock"
    | "improving_shock";
  windMph: number | null;
  cloudPct: number | null;
  pressure: number[] | null;
  precipRate: number | null;
  activePrecip: boolean;
  p24: number | null;
  p72: number | null;
  p7d: number | null;
  currentKnots: number | null;
  tideStage: string | null;
  tideRange: "neutral" | "large" | "weak" | null;
  missing?: "partial";
};

const ARCHETYPES: readonly Archetype[] = [
  a(
    "stable_good",
    "seasonal",
    8,
    55,
    stablePressure(1015),
    0,
    false,
    0.02,
    0.05,
    0.10,
    1.1,
    "incoming",
    "neutral",
  ),
  a(
    "stable_poor_hot",
    "hot",
    3,
    8,
    stablePressure(1017),
    0,
    false,
    0,
    0,
    0,
    0.9,
    "incoming",
    "neutral",
  ),
  a(
    "stable_poor_cold",
    "cold",
    3,
    8,
    stablePressure(1022),
    0,
    false,
    0,
    0,
    0,
    0.9,
    "incoming",
    "neutral",
  ),
  a(
    "warming_into_good",
    "warming_good",
    8,
    50,
    linearPressure(1012, 1014),
    0,
    false,
    0.02,
    0.05,
    0.20,
    1.1,
    "incoming",
    "neutral",
  ),
  a(
    "warming_into_heat",
    "warming_heat",
    4,
    10,
    stablePressure(1016),
    0,
    false,
    0,
    0,
    0,
    0.9,
    "incoming",
    "neutral",
  ),
  a(
    "cooling_relief_after_heat",
    "cooling_relief",
    8,
    65,
    linearPressure(1010, 1014),
    0,
    false,
    0.05,
    0.20,
    0.60,
    1.1,
    "outgoing",
    "neutral",
  ),
  a(
    "cold_front_shock",
    "cold_shock",
    17,
    15,
    linearPressure(1009, 1022),
    0,
    false,
    0.10,
    0.40,
    1.0,
    1.4,
    "outgoing",
    "neutral",
  ),
  a(
    "improving_shock_toward_good",
    "improving_shock",
    10,
    45,
    linearPressure(1011, 1014),
    0,
    false,
    0.02,
    0.10,
    0.30,
    1.1,
    "incoming",
    "neutral",
  ),
  a(
    "overcast_calm",
    "seasonal",
    3,
    95,
    stablePressure(1014),
    0,
    false,
    0.02,
    0.05,
    0.10,
    1.1,
    "incoming",
    "neutral",
  ),
  a(
    "overcast_windy",
    "seasonal",
    22,
    96,
    linearPressure(1016, 1010),
    0.01,
    false,
    0.08,
    0.20,
    0.50,
    1.4,
    "outgoing",
    "neutral",
  ),
  a(
    "bluebird_calm",
    "seasonal",
    2,
    4,
    stablePressure(1021),
    0,
    false,
    0,
    0,
    0,
    0.8,
    "incoming",
    "neutral",
  ),
  a(
    "bluebird_windy",
    "seasonal",
    24,
    5,
    stablePressure(1020),
    0,
    false,
    0,
    0,
    0,
    1.6,
    "incoming",
    "neutral",
  ),
  a(
    "heavy_active_rain",
    "seasonal",
    14,
    100,
    linearPressure(1018, 1006),
    0.15,
    true,
    1.00,
    2.00,
    4.00,
    1.8,
    "outgoing",
    "neutral",
  ),
  a(
    "light_mist_dry_baseline",
    "seasonal",
    7,
    85,
    stablePressure(1013),
    0.005,
    false,
    0.04,
    0.12,
    0.30,
    1.0,
    "incoming",
    "neutral",
  ),
  a(
    "wet_baseline_recent_rain",
    "seasonal",
    9,
    75,
    stablePressure(1010),
    0,
    false,
    0.05,
    1.20,
    3.00,
    1.2,
    "outgoing",
    "neutral",
  ),
  a(
    "river_stable_flow",
    "seasonal",
    7,
    60,
    stablePressure(1014),
    0,
    false,
    0.04,
    0.12,
    0.35,
    1.0,
    "incoming",
    "neutral",
  ),
  a(
    "river_elevated_dirty",
    "seasonal",
    11,
    80,
    linearPressure(1016, 1009),
    0.02,
    false,
    0.45,
    1.10,
    2.50,
    1.2,
    "outgoing",
    "neutral",
  ),
  a(
    "river_blown_out",
    "seasonal",
    15,
    96,
    linearPressure(1018, 1006),
    0.08,
    true,
    1.20,
    2.50,
    6.00,
    1.8,
    "outgoing",
    "neutral",
  ),
  a(
    "coastal_soft_moving_tide",
    "seasonal",
    8,
    55,
    stablePressure(1014),
    0,
    false,
    0.02,
    0.08,
    0.20,
    0.65,
    "incoming",
    "neutral",
  ),
  a(
    "coastal_slack_tide",
    "seasonal",
    4,
    55,
    stablePressure(1014),
    0,
    false,
    0.02,
    0.08,
    0.20,
    0.12,
    "slack",
    "weak",
  ),
  a(
    "coastal_too_hard_tide",
    "seasonal",
    16,
    65,
    stablePressure(1013),
    0,
    false,
    0.02,
    0.08,
    0.20,
    3.2,
    "outgoing",
    "large",
  ),
  a(
    "flats_soft_current",
    "seasonal",
    8,
    55,
    stablePressure(1014),
    0,
    false,
    0.02,
    0.08,
    0.20,
    0.55,
    "incoming",
    "neutral",
  ),
  a(
    "flats_too_hard_current",
    "seasonal",
    18,
    65,
    stablePressure(1013),
    0,
    false,
    0.02,
    0.08,
    0.20,
    2.4,
    "outgoing",
    "large",
  ),
  {
    ...a(
      "missing_partial_data",
      "seasonal",
      null,
      null,
      null,
      null,
      false,
      0.10,
      null,
      null,
      null,
      null,
      null,
    ),
    missing: "partial",
  },
];

const FLAG_KEYS = [
  "high_score_with_major_suppressor",
  "low_score_with_multiple_strong_drivers",
  "stable_bad_temp_scored_too_well",
  "improving_temp_shock_over_penalized",
  "worsening_temp_shock_under_penalized",
  "hot_bright_calm_not_penalized",
  "cold_clear_not_neutral_enough",
  "heavy_rain_score_too_high",
  "wet_baseline_score_too_high",
  "river_blown_out_score_too_high",
  "river_stable_flow_overrewarded",
  "high_wind_score_too_high",
  "heavy_overcast_windy_score_too_high",
  "coastal_slack_score_too_high",
  "flats_too_hard_current_score_too_high",
  "missing_data_reliability_too_high",
  "report_copy_conflicts_with_score",
  "driver_suppressor_conflict",
] as const;
type FlagKey = typeof FLAG_KEYS[number];

type RecSnap =
  | {
    status: "valid";
    species: SpeciesGroup;
    activity_level: string;
    thermal_mode: string;
    wind_mode: string;
    light_mode: string;
    water_movement_mode: string;
    surface_daily_gate: string;
    scenario_tags: readonly string[];
    selected_lure_ids: readonly string[];
    selected_fly_ids: readonly string[];
  }
  | {
    status: "unsupported" | "error" | "not_applicable";
    species: SpeciesGroup | null;
    reason: string;
  };

type Row = {
  candidate: CandidateId;
  region: RegionKey;
  month: number;
  context: EngineContext;
  archetype: ArchetypeId;
  clarity: WaterClarity;
  production_score: number;
  candidate_score: number;
  score_delta: number;
  production_activity_tier: string;
  candidate_activity_tier: string;
  activity_tier_changed: boolean;
  reliability_changed: boolean;
  driver_changed: boolean;
  suppressor_changed: boolean;
  production_flags: FlagKey[];
  candidate_flags: FlagKey[];
  production_recommender: RecSnap;
  candidate_recommender: RecSnap;
  selected_pick_ids_changed: boolean;
  thermal_mode_changed: boolean;
  surface_gate_changed: boolean;
  scenario_tags_changed: boolean;
};

function a(
  id: ArchetypeId,
  temp: Archetype["temp"],
  windMph: number | null,
  cloudPct: number | null,
  pressure: number[] | null,
  precipRate: number | null,
  activePrecip: boolean,
  p24: number | null,
  p72: number | null,
  p7d: number | null,
  currentKnots: number | null,
  tideStage: string | null,
  tideRange: Archetype["tideRange"],
): Archetype {
  return {
    id,
    temp,
    windMph,
    cloudPct,
    pressure,
    precipRate,
    activePrecip,
    p24,
    p72,
    p7d,
    currentKnots,
    tideStage,
    tideRange,
  };
}

function stablePressure(value: number, n = 24): number[] {
  return Array.from({ length: n }, (_, index) => value + index * 0.002);
}

function linearPressure(start: number, end: number, n = 24): number[] {
  return Array.from(
    { length: n },
    (_, index) => start + ((end - start) * index) / (n - 1),
  );
}

function meanFor(region: RegionKey, month: number): number {
  const north = [
    "northeast",
    "great_lakes_upper_midwest",
    "pacific_northwest",
    "inland_northwest",
    "alaska",
    "mountain_alpine",
    "mountain_west",
  ].includes(region);
  const hot = [
    "florida",
    "gulf_coast",
    "south_central",
    "southeast_atlantic",
    "southwest_desert",
    "southwest_high_desert",
    "southern_california",
    "hawaii",
  ].includes(region);
  if (north) {
    return [34, 36, 43, 52, 62, 68, 72, 70, 64, 54, 44, 36][month - 1]!;
  }
  if (hot) return [62, 65, 70, 75, 81, 86, 90, 90, 84, 77, 70, 64][month - 1]!;
  return [42, 45, 52, 60, 68, 75, 80, 79, 72, 62, 52, 44][month - 1]!;
}

function tempProfile(region: RegionKey, month: number, archetype: Archetype) {
  const base = meanFor(region, month);
  let mean = base;
  let prior: number | null = base;
  let d2: number | null = base - 1;
  if (archetype.temp === "hot") [mean, prior, d2] = [96, 96, 95];
  if (archetype.temp === "cold") [mean, prior, d2] = [32, 32, 33];
  if (archetype.temp === "warming_good") {
    mean = Math.min(72, base + 4);
    prior = mean - 7;
    d2 = mean - 12;
  }
  if (archetype.temp === "warming_heat") [mean, prior, d2] = [96, 92, 89];
  if (archetype.temp === "cooling_relief") [mean, prior, d2] = [84, 94, 97];
  if (archetype.temp === "cold_shock") {
    mean = Math.max(34, base - 14);
    prior = mean + 14;
    d2 = mean + 19;
  }
  if (archetype.temp === "improving_shock") {
    mean = Math.min(72, base + 6);
    prior = mean - 15;
    d2 = mean - 20;
  }
  if (archetype.missing === "partial") [prior, d2] = [null, null];
  return { mean, prior, d2, low: mean - 7, high: mean + 9 };
}

function tideEvents(month: number, range: Archetype["tideRange"]) {
  if (range == null) return null;
  const m = String(month).padStart(2, "0");
  const values = range === "large"
    ? [["04:50", 0.0, "L"], ["11:10", 3.6, "H"], ["17:40", 0.2, "L"]]
    : range === "weak"
    ? [["05:00", 1.0, "L"], ["11:30", 1.35, "H"], ["18:00", 1.05, "L"]]
    : [["05:20", 0.3, "L"], ["11:45", 2.2, "H"], ["18:15", 0.4, "L"]];
  return values.map(([hour, value, type]) => ({
    time: `2026-${m}-15T${hour}:00`,
    value: Number(value),
    type: String(type),
  }));
}

function buildRequest(
  region: RegionKey,
  month: number,
  context: EngineContext,
  archetype: Archetype,
): SharedEngineRequest {
  const meta = REGION_META[region];
  const temp = tempProfile(region, month, archetype);
  const localDate = `2026-${String(month).padStart(2, "0")}-15`;
  const coastal = context === "coastal" || context === "coastal_flats_estuary";
  const coastalWater = coastal && archetype.id !== "missing_partial_data";
  const waterTemp = Math.max(45, Math.min(88, temp.mean - 5));
  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: region,
    local_date: localDate,
    local_timezone: meta.tz,
    context,
    environment: {
      current_air_temp_f: temp.mean,
      daily_mean_air_temp_f: temp.mean,
      daily_low_air_temp_f: temp.low,
      daily_high_air_temp_f: temp.high,
      prior_day_mean_air_temp_f: temp.prior,
      day_minus_2_mean_air_temp_f: temp.d2,
      measured_water_temp_f: coastalWater ? waterTemp : null,
      measured_water_temp_24h_ago_f: coastalWater && temp.prior != null
        ? Math.max(
          45,
          Math.min(88, waterTemp + (temp.prior - temp.mean) * 0.35),
        )
        : null,
      measured_water_temp_72h_ago_f: coastalWater && temp.d2 != null
        ? Math.max(45, Math.min(88, waterTemp + (temp.d2 - temp.mean) * 0.35))
        : null,
      measured_water_temp_source: coastalWater ? "audit_fixture" : null,
      pressure_mb: archetype.pressure?.at(-1) ?? null,
      pressure_history_mb: archetype.pressure,
      wind_speed_mph: archetype.windMph,
      cloud_cover_pct: archetype.cloudPct,
      precip_rate_now_in_per_hr: archetype.precipRate,
      active_precip_now: archetype.activePrecip,
      precip_24h_in: archetype.p24,
      precip_72h_in: archetype.p72,
      precip_7d_in: archetype.p7d,
      tide_movement_state: coastal ? archetype.tideStage : null,
      current_speed_knots_max: coastal ? archetype.currentKnots : null,
      tide_high_low: coastal ? tideEvents(month, archetype.tideRange) : null,
      tide_height_hourly_ft: null,
    },
    data_coverage: { source_notes: [] },
  };
}

function cloneNorm(norm: SharedNormalizedOutput): SharedNormalizedOutput {
  return {
    ...norm,
    normalized: {
      ...norm.normalized,
      temperature: norm.normalized.temperature
        ? { ...norm.normalized.temperature }
        : undefined,
      pressure_regime: cloneState(norm.normalized.pressure_regime),
      wind_condition: cloneState(norm.normalized.wind_condition),
      light_cloud_condition: cloneState(norm.normalized.light_cloud_condition),
      precipitation_disruption: cloneState(
        norm.normalized.precipitation_disruption,
      ),
      runoff_flow_disruption: cloneState(
        norm.normalized.runoff_flow_disruption,
      ),
      tide_current_movement: cloneState(norm.normalized.tide_current_movement),
    },
  };
}

function cloneState<T extends VariableState | undefined>(state: T): T {
  return state ? ({ ...state } as T) : state;
}

function clampEngine(value: number): number {
  return Math.max(-2, Math.min(2, value));
}

function applyCandidate(
  norm: SharedNormalizedOutput,
  archetype: Archetype,
  candidate: CandidateId,
): SharedNormalizedOutput {
  const out = cloneNorm(norm);
  if (candidate === "production_control") return out;
  const heavy = candidate === "precip_heavy_cap"
    ? 0.55
    : candidate === "combined_light"
    ? 0.35
    : candidate === "combined_stronger"
    ? 0.8
    : 0;
  const wet = candidate === "wet_baseline_stronger"
    ? 0.55
    : candidate === "combined_light"
    ? 0.35
    : candidate === "combined_stronger"
    ? 0.75
    : 0;
  const hot = candidate === "hot_bright_calm_compound"
    ? 0.45
    : candidate === "combined_light"
    ? 0.25
    : candidate === "combined_stronger"
    ? 0.6
    : 0;
  const shock = candidate === "improving_shock_soften"
    ? 0.35
    : candidate === "combined_light"
    ? 0.2
    : candidate === "combined_stronger"
    ? 0.45
    : 0;

  const precip = out.normalized.precipitation_disruption;
  if (precip && archetype.id === "heavy_active_rain" && heavy > 0) {
    precip.score = clampEngine(precip.score - heavy);
  }
  if (precip && archetype.id === "wet_baseline_recent_rain" && wet > 0) {
    precip.score = clampEngine(precip.score - wet);
  }
  const temp = out.normalized.temperature;
  const light = out.normalized.light_cloud_condition;
  const wind = out.normalized.wind_condition;
  if (
    temp && hot > 0 &&
    (temp.band_label === "warm" || temp.band_label === "very_warm") &&
    (light?.label === "glare" || light?.label === "bright") &&
    (wind?.label === "calm" || wind?.label === "light")
  ) {
    temp.final_score = clampEngine(temp.final_score - hot);
  }
  if (
    temp && shock > 0 && temp.shock_label !== "none" &&
    archetype.id === "improving_shock_toward_good"
  ) {
    temp.final_score = Math.min(0.25, clampEngine(temp.final_score + shock));
  }
  return out;
}

function contributionSnapshot(
  c: ReturnType<typeof scoreDay>["contributions"][number],
) {
  return {
    key: c.key,
    score: c.score,
    weight: c.weight,
    weighted_contribution: c.weightedContribution,
  };
}

function speciesForContext(context: EngineContext): SpeciesGroup | null {
  if (context === "freshwater_lake_pond") return "largemouth_bass";
  if (context === "freshwater_river") return "trout";
  return null;
}

function runRecommender(args: {
  req: SharedEngineRequest;
  analysis: SharedConditionAnalysis;
  norm: SharedNormalizedOutput;
  scored: ReturnType<typeof scoreDay>;
  clarity: WaterClarity;
  seed: string;
}): RecSnap {
  const species = speciesForContext(args.req.context);
  if (!species) {
    return {
      status: "not_applicable",
      species: null,
      reason: "coastal/flats not in daily-picks audit",
    };
  }
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
    water_clarity: args.clarity,
    recommendation_goal: "all_purpose",
    env_data: { ...args.req.environment, weather: { wind_speed_unit: "mph" } },
  };
  try {
    const base = analyzeRecommenderConditions(recReq);
    const seasonalRow = resolveDailyPicksSeasonalRow({
      species,
      region_key: args.req.region_key,
      month,
      water_type: args.req.context,
    });
    const result = runDailyPicksEngine({
      req: recReq,
      analysis: {
        ...base,
        norm: args.norm,
        scored: args.scored,
      } as SharedConditionAnalysis,
      seasonalRow,
      seed: args.seed,
      variant: "A",
    });
    return {
      status: "valid",
      species,
      activity_level: result.scenario.activity_level,
      thermal_mode: result.scenario.thermal_mode,
      wind_mode: result.scenario.wind_mode,
      light_mode: result.scenario.light_mode,
      water_movement_mode: result.scenario.water_movement_mode,
      surface_daily_gate: result.scenario.surface_daily_gate,
      scenario_tags: result.scenario.scenario_tags,
      selected_lure_ids: result.diagnostics.selected_lure_ids,
      selected_fly_ids: result.diagnostics.selected_fly_ids,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return {
      status: /No daily-picks seasonal row|has no exact row/i.test(reason)
        ? "unsupported"
        : "error",
      species,
      reason,
    };
  }
}

function hasSummaryConflict(summary: string | null, score: number): boolean {
  if (!summary) return false;
  const text = summary.toLowerCase();
  return (score >= 70 && /(tough|poor|working against|grind)/.test(text)) ||
    (score <= 40 && /(prime|excellent|strongly favor|great)/.test(text));
}

function flagSet(args: {
  context: EngineContext;
  archetype: Archetype;
  score: number;
  reliability: string;
  norm: SharedNormalizedOutput;
  contributions: ReturnType<typeof contributionSnapshot>[];
  drivers: readonly { key: ScoredVariableKey }[];
  suppressors: readonly { key: ScoredVariableKey }[];
  summary: string | null;
}): FlagKey[] {
  const flags = new Set<FlagKey>();
  const n = args.norm.normalized;
  const majorSuppressors = args.contributions.filter((c) =>
    c.weighted_contribution <= -8
  );
  const strongDrivers = args.contributions.filter((c) =>
    c.weighted_contribution >= 8
  );
  const light = n.light_cloud_condition?.score ?? null;
  const wind = n.wind_condition?.score ?? null;
  const runoff = n.runoff_flow_disruption?.score ?? null;
  const tide = n.tide_current_movement?.score ?? null;
  const driverKeys = new Set(args.drivers.map((d) => d.key));
  const suppressorKeys = new Set(args.suppressors.map((s) => s.key));
  add(
    flags,
    "high_score_with_major_suppressor",
    args.score >= 70 && majorSuppressors.length > 0,
  );
  add(
    flags,
    "low_score_with_multiple_strong_drivers",
    args.score <= 40 && strongDrivers.length >= 2,
  );
  add(
    flags,
    "stable_bad_temp_scored_too_well",
    /^stable_poor/.test(args.archetype.id) && args.score >= 60,
  );
  add(
    flags,
    "improving_temp_shock_over_penalized",
    args.archetype.id === "improving_shock_toward_good" && args.score < 45,
  );
  add(
    flags,
    "worsening_temp_shock_under_penalized",
    args.archetype.id === "cold_front_shock" && args.score > 65,
  );
  add(
    flags,
    "hot_bright_calm_not_penalized",
    args.archetype.id === "stable_poor_hot" && args.score > 55,
  );
  add(
    flags,
    "cold_clear_not_neutral_enough",
    args.archetype.id === "stable_poor_cold" && light != null && light < -0.4,
  );
  add(
    flags,
    "heavy_rain_score_too_high",
    args.archetype.id === "heavy_active_rain" && args.score > 55,
  );
  add(
    flags,
    "wet_baseline_score_too_high",
    args.archetype.id === "wet_baseline_recent_rain" && args.score > 65,
  );
  add(
    flags,
    "river_blown_out_score_too_high",
    args.context === "freshwater_river" &&
      args.archetype.id === "river_blown_out" && args.score > 45,
  );
  add(
    flags,
    "river_stable_flow_overrewarded",
    args.context === "freshwater_river" &&
      args.archetype.id === "river_stable_flow" && (runoff ?? 0) > 0.75,
  );
  add(
    flags,
    "high_wind_score_too_high",
    (args.archetype.windMph ?? 0) >= 22 && wind != null && wind > 0.2,
  );
  add(
    flags,
    "heavy_overcast_windy_score_too_high",
    args.archetype.id === "overcast_windy" && light != null && light > 0.75,
  );
  add(
    flags,
    "coastal_slack_score_too_high",
    args.context === "coastal" && args.archetype.id === "coastal_slack_tide" &&
      (tide ?? 0) > -0.5,
  );
  add(
    flags,
    "flats_too_hard_current_score_too_high",
    args.context === "coastal_flats_estuary" &&
      args.archetype.id === "flats_too_hard_current" && (tide ?? 0) > -0.5,
  );
  add(
    flags,
    "missing_data_reliability_too_high",
    args.archetype.id === "missing_partial_data" && args.reliability === "high",
  );
  add(
    flags,
    "report_copy_conflicts_with_score",
    hasSummaryConflict(args.summary, args.score),
  );
  add(
    flags,
    "driver_suppressor_conflict",
    [...driverKeys].some((key) => suppressorKeys.has(key)),
  );
  return [...flags];
}

function add(flags: Set<FlagKey>, key: FlagKey, when: boolean): void {
  if (when) flags.add(key);
}

function idsChanged(a: RecSnap, b: RecSnap): boolean {
  if (a.status !== "valid" || b.status !== "valid") return false;
  return JSON.stringify([...a.selected_lure_ids, ...a.selected_fly_ids]) !==
    JSON.stringify([...b.selected_lure_ids, ...b.selected_fly_ids]);
}

function tagsChanged(a: RecSnap, b: RecSnap): boolean {
  if (a.status !== "valid" || b.status !== "valid") return false;
  return JSON.stringify([...a.scenario_tags].sort()) !==
    JSON.stringify([...b.scenario_tags].sort());
}

function buildRows(): Row[] {
  const rows: Row[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of CONTEXTS) {
        for (const archetype of ARCHETYPES) {
          const req = buildRequest(region, month, context, archetype);
          const production = analyzeSharedConditions(req);
          const report = runHowFishingReport(req);
          const productionContrib = production.scored.contributions.map(
            contributionSnapshot,
          );
          const productionFlags = flagSet({
            context,
            archetype,
            score: production.scored.score,
            reliability: production.norm.reliability,
            norm: production.norm,
            contributions: productionContrib,
            drivers: production.scored.drivers,
            suppressors: production.scored.suppressors,
            summary: report.summary_line,
          });
          for (const clarity of WATER_CLARITIES) {
            const prodRec = runRecommender({
              req,
              analysis: production,
              norm: production.norm,
              scored: production.scored,
              clarity,
              seed:
                `integrated-tuning|production|${region}|${month}|${context}|${archetype.id}|${clarity}`,
            });
            for (const candidate of CANDIDATES) {
              const candidateNorm = applyCandidate(
                production.norm,
                archetype,
                candidate,
              );
              const candidateScored = scoreDay(candidateNorm);
              const candidateContrib = candidateScored.contributions.map(
                contributionSnapshot,
              );
              const candidateFlags = flagSet({
                context,
                archetype,
                score: candidateScored.score,
                reliability: candidateNorm.reliability,
                norm: candidateNorm,
                contributions: candidateContrib,
                drivers: candidateScored.drivers,
                suppressors: candidateScored.suppressors,
                summary: report.summary_line,
              });
              const candidateRec = runRecommender({
                req,
                analysis: production,
                norm: candidateNorm,
                scored: candidateScored,
                clarity,
                seed:
                  `integrated-tuning|production|${region}|${month}|${context}|${archetype.id}|${clarity}`,
              });
              rows.push({
                candidate,
                region,
                month,
                context,
                archetype: archetype.id,
                clarity,
                production_score: production.scored.score,
                candidate_score: candidateScored.score,
                score_delta: candidateScored.score - production.scored.score,
                production_activity_tier: compositeScoreActivityTier(
                  production.scored.score,
                ),
                candidate_activity_tier: compositeScoreActivityTier(
                  candidateScored.score,
                ),
                activity_tier_changed:
                  compositeScoreActivityTier(production.scored.score) !==
                    compositeScoreActivityTier(candidateScored.score),
                reliability_changed:
                  production.norm.reliability !== candidateNorm.reliability,
                driver_changed:
                  JSON.stringify(production.scored.drivers.map((d) =>
                    d.key
                  )) !== JSON.stringify(candidateScored.drivers.map((d) =>
                    d.key
                  )),
                suppressor_changed:
                  JSON.stringify(production.scored.suppressors.map((s) =>
                    s.key
                  )) !== JSON.stringify(candidateScored.suppressors.map((s) =>
                    s.key
                  )),
                production_flags: productionFlags,
                candidate_flags: candidateFlags,
                production_recommender: prodRec,
                candidate_recommender: candidateRec,
                selected_pick_ids_changed: idsChanged(prodRec, candidateRec),
                thermal_mode_changed: prodRec.status === "valid" &&
                  candidateRec.status === "valid" &&
                  prodRec.thermal_mode !== candidateRec.thermal_mode,
                surface_gate_changed: prodRec.status === "valid" &&
                  candidateRec.status === "valid" &&
                  prodRec.surface_daily_gate !==
                    candidateRec.surface_daily_gate,
                scenario_tags_changed: tagsChanged(prodRec, candidateRec),
              });
            }
          }
        }
      }
    }
  }
  return rows;
}

function flagCounts(
  rows: Row[],
  field: "production_flags" | "candidate_flags",
): Record<FlagKey, number> {
  return Object.fromEntries(
    FLAG_KEYS.map((flag) => [
      flag,
      rows.filter((row) => row[field].includes(flag)).length,
    ]),
  ) as Record<FlagKey, number>;
}

function candidateSummary(rows: Row[]): string {
  return CANDIDATES.map((candidate) => {
    const subset = rows.filter((row) => row.candidate === candidate);
    const deltas = subset.map((row) => row.score_delta);
    const valid = subset.filter((row) =>
      row.production_recommender.status === "valid" &&
      row.candidate_recommender.status === "valid"
    );
    const pickChanges = valid.filter((row) =>
      row.selected_pick_ids_changed
    ).length;
    const thermal = valid.filter((row) => row.thermal_mode_changed).length;
    const surface = valid.filter((row) => row.surface_gate_changed).length;
    const flags = Object.values(flagCounts(subset, "candidate_flags")).reduce(
      (sum, value) => sum + value,
      0,
    );
    return `| ${candidate} | ${
      (deltas.reduce((s, v) => s + v, 0) / deltas.length).toFixed(2)
    } | ${Math.min(...deltas)} | ${Math.max(...deltas)} | ${
      subset.filter((r) => Math.abs(r.score_delta) >= 8).length
    } | ${subset.filter((r) => Math.abs(r.score_delta) >= 12).length} | ${
      subset.filter((r) => r.activity_tier_changed).length
    } | ${
      subset.filter((r) => r.reliability_changed).length
    } | ${flags} | ${valid.length} | ${pickChanges} (${
      pct(pickChanges, valid.length)
    }) | ${thermal} (${pct(thermal, valid.length)}) | ${surface} (${
      pct(surface, valid.length)
    }) |`;
  }).join("\n");
}

function flagReductionTable(rows: Row[]): string {
  const prod = flagCounts(
    rows.filter((row) => row.candidate === "production_control"),
    "production_flags",
  );
  return CANDIDATES.map((candidate) => {
    const cand = flagCounts(
      rows.filter((row) => row.candidate === candidate),
      "candidate_flags",
    );
    return `| ${candidate} | ${cand.heavy_rain_score_too_high} (${
      reduction(prod.heavy_rain_score_too_high, cand.heavy_rain_score_too_high)
    }) | ${cand.wet_baseline_score_too_high} (${
      reduction(
        prod.wet_baseline_score_too_high,
        cand.wet_baseline_score_too_high,
      )
    }) | ${cand.hot_bright_calm_not_penalized} (${
      reduction(
        prod.hot_bright_calm_not_penalized,
        cand.hot_bright_calm_not_penalized,
      )
    }) | ${cand.improving_temp_shock_over_penalized} (${
      reduction(
        prod.improving_temp_shock_over_penalized,
        cand.improving_temp_shock_over_penalized,
      )
    }) | ${cand.report_copy_conflicts_with_score} (${
      reduction(
        prod.report_copy_conflicts_with_score,
        cand.report_copy_conflicts_with_score,
      )
    }) |`;
  }).join("\n");
}

function reduction(base: number, candidate: number): string {
  if (base === 0) return candidate === 0 ? "0%" : "regressed";
  return `${(((base - candidate) / base) * 100).toFixed(1)}%`;
}

function pct(part: number, total: number): string {
  return total ? `${((part / total) * 100).toFixed(1)}%` : "n/a";
}

function fixedIssueRegressions(rows: Row[], candidate: CandidateId): number {
  const counts = flagCounts(
    rows.filter((row) => row.candidate === candidate),
    "candidate_flags",
  );
  return counts.river_blown_out_score_too_high +
    counts.river_stable_flow_overrewarded +
    counts.high_wind_score_too_high +
    counts.heavy_overcast_windy_score_too_high +
    counts.coastal_slack_score_too_high +
    counts.flats_too_hard_current_score_too_high +
    counts.missing_data_reliability_too_high;
}

function safeCandidate(rows: Row[], candidate: CandidateId): boolean {
  if (candidate === "production_control") return false;
  const subset = rows.filter((row) => row.candidate === candidate);
  const base = flagCounts(
    rows.filter((row) => row.candidate === "production_control"),
    "production_flags",
  );
  const cand = flagCounts(subset, "candidate_flags");
  const valid = subset.filter((row) =>
    row.production_recommender.status === "valid" &&
    row.candidate_recommender.status === "valid"
  );
  return reductionNumber(
        base.heavy_rain_score_too_high,
        cand.heavy_rain_score_too_high,
      ) >= 0.60 &&
    reductionNumber(
        base.wet_baseline_score_too_high,
        cand.wet_baseline_score_too_high,
      ) >= 0.50 &&
    reductionNumber(
        base.hot_bright_calm_not_penalized,
        cand.hot_bright_calm_not_penalized,
      ) >= 0.50 &&
    reductionNumber(
        base.improving_temp_shock_over_penalized,
        cand.improving_temp_shock_over_penalized,
      ) >= 0.40 &&
    fixedIssueRegressions(rows, candidate) === 0 &&
    subset.filter((row) => Math.abs(row.score_delta) >= 12).length === 0 &&
    valid.filter((row) => row.selected_pick_ids_changed).length /
          Math.max(1, valid.length) < 0.03 &&
    valid.filter((row) => row.surface_gate_changed).length /
          Math.max(1, valid.length) < 0.01 &&
    valid.filter((row) => row.thermal_mode_changed).length /
          Math.max(1, valid.length) < 0.02;
}

function reductionNumber(base: number, candidate: number): number {
  return base === 0 ? (candidate === 0 ? 1 : -1) : (base - candidate) / base;
}

function worstRegressions(rows: Row[], candidate: CandidateId): string {
  const subset = rows.filter((row) =>
    row.candidate === candidate &&
    (row.candidate_flags.length > row.production_flags.length ||
      row.score_delta >= 8 ||
      row.selected_pick_ids_changed)
  );
  if (subset.length === 0) return "| none | | | | | | | | | |";
  return subset.slice(0, 30).map((row) =>
    `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.clarity} | ${row.production_score} | ${row.candidate_score} | ${row.score_delta} | ${
      row.production_flags.join(", ")
    } | ${row.candidate_flags.join(", ")} |`
  ).join("\n");
}

const rows = buildRows();
const finalist =
  CANDIDATES.find((candidate) => safeCandidate(rows, candidate)) ?? null;
const recommendation = finalist
  ? `production tuning candidate ready: ${finalist}`
  : "no safe finalist; needs narrower sweep and likely copy-only audit follow-up";

const markdown = `# Today's Bite Integrated Tuning Shadow Audit

Generated: ${new Date().toISOString()}

Phase 9B shadow-only candidate sweep. Production normalizers, scoreDay, report copy, app/forecast/cache behavior, and recommender production logic were not changed.

## Candidate Sweep

| Candidate | Avg delta | Min | Max | abs>=8 | abs>=12 | Activity tier changes | Reliability changes | Total flags | Valid rec rows | Pick changes | Thermal changes | Surface changes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${candidateSummary(rows)}

## Focus Flag Reductions

| Candidate | Heavy rain too high | Wet baseline too high | Hot bright calm | Improving shock over-penalized | Copy conflict |
| --- | ---: | ---: | ---: | ---: | ---: |
${flagReductionTable(rows)}

## Fixed-Issue Regression Check

${
  CANDIDATES.map((candidate) =>
    `- ${candidate}: ${fixedIssueRegressions(rows, candidate)}`
  ).join("\n")
}

## Top Regressions For Combined Stronger

| Region | Month | Context | Archetype | Clarity | Prod | Candidate | Delta | Prod flags | Candidate flags |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- |
${worstRegressions(rows, "combined_stronger")}

## Recommended Finalist

**${finalist ?? "no safe finalist"}**

Recommendation: **${recommendation}**.

Notes:
- This audit intentionally leaves report-copy strings untouched. Remaining \`report_copy_conflicts_with_score\` rows should be reviewed in a copy-only pass because candidate score changes can reduce but not fully validate prose alignment.
- Recommender comparisons use current production daily-picks logic with candidate How's Fishing analysis injected in memory.

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
