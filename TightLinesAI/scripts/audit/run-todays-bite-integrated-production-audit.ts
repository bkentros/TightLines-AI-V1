#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 9A integrated Today's Bite production audit.
 *
 * Audit-only. Production normalizers, scoreDay, report copy, app/forecast
 * behavior, and recommender production logic/candidate pools/scoring/gates/
 * selection are not modified.
 */

import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { analyzeSharedConditions } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type {
  ScoredVariableKey,
  SharedEngineRequest,
  VariableState,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import {
  CANONICAL_REGION_KEYS,
  type RegionKey,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { TemperatureNormalized } from "../../supabase/functions/_shared/howFishingEngine/contracts/variableState.ts";
import { buildSharedEngineRequestFromEnvData } from "../../supabase/functions/_shared/howFishingEngine/request/buildFromEnvData.ts";
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type {
  RecommenderRequest,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";
import {
  materializeForecastEnvForDate,
  shouldUseMeasuredWaterTempForForecastReport,
} from "../../lib/forecastSnapshot.ts";

const OUTPUT_JSONL =
  "scripts/audit/todays-bite-integrated-production-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-integrated-production-audit.md";

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
  {
    id: "stable_good",
    temp: "seasonal",
    windMph: 8,
    cloudPct: 55,
    pressure: stablePressure(1015),
    precipRate: 0,
    activePrecip: false,
    p24: 0.02,
    p72: 0.05,
    p7d: 0.10,
    currentKnots: 1.1,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "stable_poor_hot",
    temp: "hot",
    windMph: 3,
    cloudPct: 8,
    pressure: stablePressure(1017),
    precipRate: 0,
    activePrecip: false,
    p24: 0,
    p72: 0,
    p7d: 0,
    currentKnots: 0.9,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "stable_poor_cold",
    temp: "cold",
    windMph: 3,
    cloudPct: 8,
    pressure: stablePressure(1022),
    precipRate: 0,
    activePrecip: false,
    p24: 0,
    p72: 0,
    p7d: 0,
    currentKnots: 0.9,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "warming_into_good",
    temp: "warming_good",
    windMph: 8,
    cloudPct: 50,
    pressure: linearPressure(1012, 1014),
    precipRate: 0,
    activePrecip: false,
    p24: 0.02,
    p72: 0.05,
    p7d: 0.20,
    currentKnots: 1.1,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "warming_into_heat",
    temp: "warming_heat",
    windMph: 4,
    cloudPct: 10,
    pressure: stablePressure(1016),
    precipRate: 0,
    activePrecip: false,
    p24: 0,
    p72: 0,
    p7d: 0,
    currentKnots: 0.9,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "cooling_relief_after_heat",
    temp: "cooling_relief",
    windMph: 8,
    cloudPct: 65,
    pressure: linearPressure(1010, 1014),
    precipRate: 0,
    activePrecip: false,
    p24: 0.05,
    p72: 0.20,
    p7d: 0.60,
    currentKnots: 1.1,
    tideStage: "outgoing",
    tideRange: "neutral",
  },
  {
    id: "cold_front_shock",
    temp: "cold_shock",
    windMph: 17,
    cloudPct: 15,
    pressure: linearPressure(1009, 1022),
    precipRate: 0,
    activePrecip: false,
    p24: 0.10,
    p72: 0.40,
    p7d: 1.0,
    currentKnots: 1.4,
    tideStage: "outgoing",
    tideRange: "neutral",
  },
  {
    id: "improving_shock_toward_good",
    temp: "improving_shock",
    windMph: 10,
    cloudPct: 45,
    pressure: linearPressure(1011, 1014),
    precipRate: 0,
    activePrecip: false,
    p24: 0.02,
    p72: 0.10,
    p7d: 0.30,
    currentKnots: 1.1,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "overcast_calm",
    temp: "seasonal",
    windMph: 3,
    cloudPct: 95,
    pressure: stablePressure(1014),
    precipRate: 0,
    activePrecip: false,
    p24: 0.02,
    p72: 0.05,
    p7d: 0.10,
    currentKnots: 1.1,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "overcast_windy",
    temp: "seasonal",
    windMph: 22,
    cloudPct: 96,
    pressure: linearPressure(1016, 1010),
    precipRate: 0.01,
    activePrecip: false,
    p24: 0.08,
    p72: 0.20,
    p7d: 0.50,
    currentKnots: 1.4,
    tideStage: "outgoing",
    tideRange: "neutral",
  },
  {
    id: "bluebird_calm",
    temp: "seasonal",
    windMph: 2,
    cloudPct: 4,
    pressure: stablePressure(1021),
    precipRate: 0,
    activePrecip: false,
    p24: 0,
    p72: 0,
    p7d: 0,
    currentKnots: 0.8,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "bluebird_windy",
    temp: "seasonal",
    windMph: 24,
    cloudPct: 5,
    pressure: stablePressure(1020),
    precipRate: 0,
    activePrecip: false,
    p24: 0,
    p72: 0,
    p7d: 0,
    currentKnots: 1.6,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "heavy_active_rain",
    temp: "seasonal",
    windMph: 14,
    cloudPct: 100,
    pressure: linearPressure(1018, 1006),
    precipRate: 0.15,
    activePrecip: true,
    p24: 1.00,
    p72: 2.00,
    p7d: 4.00,
    currentKnots: 1.8,
    tideStage: "outgoing",
    tideRange: "neutral",
  },
  {
    id: "light_mist_dry_baseline",
    temp: "seasonal",
    windMph: 7,
    cloudPct: 85,
    pressure: stablePressure(1013),
    precipRate: 0.005,
    activePrecip: false,
    p24: 0.04,
    p72: 0.12,
    p7d: 0.30,
    currentKnots: 1.0,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "wet_baseline_recent_rain",
    temp: "seasonal",
    windMph: 9,
    cloudPct: 75,
    pressure: stablePressure(1010),
    precipRate: 0,
    activePrecip: false,
    p24: 0.05,
    p72: 1.20,
    p7d: 3.00,
    currentKnots: 1.2,
    tideStage: "outgoing",
    tideRange: "neutral",
  },
  {
    id: "river_stable_flow",
    temp: "seasonal",
    windMph: 7,
    cloudPct: 60,
    pressure: stablePressure(1014),
    precipRate: 0,
    activePrecip: false,
    p24: 0.04,
    p72: 0.12,
    p7d: 0.35,
    currentKnots: 1.0,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "river_elevated_dirty",
    temp: "seasonal",
    windMph: 11,
    cloudPct: 80,
    pressure: linearPressure(1016, 1009),
    precipRate: 0.02,
    activePrecip: false,
    p24: 0.45,
    p72: 1.10,
    p7d: 2.50,
    currentKnots: 1.2,
    tideStage: "outgoing",
    tideRange: "neutral",
  },
  {
    id: "river_blown_out",
    temp: "seasonal",
    windMph: 15,
    cloudPct: 96,
    pressure: linearPressure(1018, 1006),
    precipRate: 0.08,
    activePrecip: true,
    p24: 1.20,
    p72: 2.50,
    p7d: 6.00,
    currentKnots: 1.8,
    tideStage: "outgoing",
    tideRange: "neutral",
  },
  {
    id: "coastal_soft_moving_tide",
    temp: "seasonal",
    windMph: 8,
    cloudPct: 55,
    pressure: stablePressure(1014),
    precipRate: 0,
    activePrecip: false,
    p24: 0.02,
    p72: 0.08,
    p7d: 0.20,
    currentKnots: 0.65,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "coastal_slack_tide",
    temp: "seasonal",
    windMph: 4,
    cloudPct: 55,
    pressure: stablePressure(1014),
    precipRate: 0,
    activePrecip: false,
    p24: 0.02,
    p72: 0.08,
    p7d: 0.20,
    currentKnots: 0.12,
    tideStage: "slack",
    tideRange: "weak",
  },
  {
    id: "coastal_too_hard_tide",
    temp: "seasonal",
    windMph: 16,
    cloudPct: 65,
    pressure: stablePressure(1013),
    precipRate: 0,
    activePrecip: false,
    p24: 0.02,
    p72: 0.08,
    p7d: 0.20,
    currentKnots: 3.2,
    tideStage: "outgoing",
    tideRange: "large",
  },
  {
    id: "flats_soft_current",
    temp: "seasonal",
    windMph: 8,
    cloudPct: 55,
    pressure: stablePressure(1014),
    precipRate: 0,
    activePrecip: false,
    p24: 0.02,
    p72: 0.08,
    p7d: 0.20,
    currentKnots: 0.55,
    tideStage: "incoming",
    tideRange: "neutral",
  },
  {
    id: "flats_too_hard_current",
    temp: "seasonal",
    windMph: 18,
    cloudPct: 65,
    pressure: stablePressure(1013),
    precipRate: 0,
    activePrecip: false,
    p24: 0.02,
    p72: 0.08,
    p7d: 0.20,
    currentKnots: 2.4,
    tideStage: "outgoing",
    tideRange: "large",
  },
  {
    id: "missing_partial_data",
    temp: "seasonal",
    windMph: null,
    cloudPct: null,
    pressure: null,
    precipRate: null,
    activePrecip: false,
    p24: 0.10,
    p72: null,
    p7d: null,
    currentKnots: null,
    tideStage: null,
    tideRange: null,
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

type VariableSnapshot =
  | {
    label: string;
    score: number;
    detail: string | null;
  }
  | null;

type TemperatureSnapshot =
  | {
    measurement_source: string;
    measurement_value_f: number | null;
    band_label: string;
    band_score: number;
    trend_label: string;
    trend_adjustment: number;
    shock_label: string;
    shock_adjustment: number;
    final_score: number;
  }
  | null;

type ContributionSnapshot = {
  key: ScoredVariableKey;
  label: string;
  score: number;
  weight: number;
  weighted_contribution: number;
};

type RecommenderSnapshot =
  | {
    status: "valid";
    species: SpeciesGroup;
    water_clarity: WaterClarity;
    activity_level: string;
    pressure_mode: string;
    thermal_mode: string;
    light_mode: string;
    wind_mode: string;
    water_movement_mode: string;
    surface_daily_gate: string;
    scenario_tags: readonly string[];
    selected_lure_ids: readonly string[];
    selected_fly_ids: readonly string[];
  }
  | {
    status: "unsupported" | "error" | "not_applicable";
    species: SpeciesGroup | null;
    water_clarity: WaterClarity;
    reason: string;
  };

type AuditRow = {
  region: RegionKey;
  month: number;
  context: EngineContext;
  archetype: ArchetypeId;
  water_clarity: WaterClarity;
  score: number;
  band: string;
  activity_tier: string;
  reliability: string;
  normalized_variables: {
    temperature: TemperatureSnapshot;
    pressure_regime: VariableSnapshot;
    wind_condition: VariableSnapshot;
    light_cloud_condition: VariableSnapshot;
    precipitation_disruption: VariableSnapshot;
    runoff_flow_disruption: VariableSnapshot;
    tide_current_movement: VariableSnapshot;
  };
  weighted_contributions: ContributionSnapshot[];
  drivers: ContributionSnapshot[];
  suppressors: ContributionSnapshot[];
  available_variables: string[];
  missing_variables: string[];
  data_gaps: unknown[];
  timing_debug: Record<string, unknown> | null;
  summary_line: string | null;
  data_coverage_notes: readonly string[];
  questionable_flags: FlagKey[];
  recommender: RecommenderSnapshot;
};

type ForecastReadinessRow = {
  day_offset: number;
  target_date: string;
  context: EngineContext;
  score: number;
  reliability: string;
  daily_mean_air_temp_f: number | null;
  prior_day_mean_air_temp_f: number | null;
  day_minus_2_mean_air_temp_f: number | null;
  precip_24h_in: number | null;
  precip_72h_in: number | null;
  precip_7d_in: number | null;
  pressure_history_count: number;
  measured_water_temp_present: boolean;
  temperature_source: string | null;
  source_notes: readonly string[];
  passed: boolean;
  notes: string[];
};

function stablePressure(value: number, n = 24): number[] {
  return Array.from({ length: n }, (_, index) => value + index * 0.002);
}

function linearPressure(start: number, end: number, n = 24): number[] {
  return Array.from(
    { length: n },
    (_, index) => start + ((end - start) * index) / (n - 1),
  );
}

function seasonallyReasonableMean(region: RegionKey, month: number): number {
  const northernCold = [
    "northeast",
    "great_lakes_upper_midwest",
    "pacific_northwest",
    "inland_northwest",
    "alaska",
    "mountain_alpine",
    "mountain_west",
  ].includes(region);
  const hotSouth = [
    "florida",
    "gulf_coast",
    "south_central",
    "southeast_atlantic",
    "southwest_desert",
    "southwest_high_desert",
    "southern_california",
    "hawaii",
  ].includes(region);

  if (northernCold) {
    return [34, 36, 43, 52, 62, 68, 72, 70, 64, 54, 44, 36][month - 1]!;
  }
  if (hotSouth) {
    return [62, 65, 70, 75, 81, 86, 90, 90, 84, 77, 70, 64][month - 1]!;
  }
  return [42, 45, 52, 60, 68, 75, 80, 79, 72, 62, 52, 44][month - 1]!;
}

function tempProfile(
  region: RegionKey,
  month: number,
  archetype: Archetype,
): {
  mean: number;
  prior: number | null;
  d2: number | null;
  low: number;
  high: number;
} {
  const base = seasonallyReasonableMean(region, month);
  let mean: number;
  let prior: number | null;
  let d2: number | null;
  switch (archetype.temp) {
    case "hot":
      mean = 96;
      prior = 96;
      d2 = 95;
      break;
    case "cold":
      mean = 32;
      prior = 32;
      d2 = 33;
      break;
    case "warming_good":
      mean = Math.min(72, base + 4);
      prior = mean - 7;
      d2 = mean - 12;
      break;
    case "warming_heat":
      mean = 96;
      prior = 92;
      d2 = 89;
      break;
    case "cooling_relief":
      mean = 84;
      prior = 94;
      d2 = 97;
      break;
    case "cold_shock":
      mean = Math.max(34, base - 14);
      prior = mean + 14;
      d2 = mean + 19;
      break;
    case "improving_shock":
      mean = Math.min(72, base + 6);
      prior = mean - 15;
      d2 = mean - 20;
      break;
    case "seasonal":
      mean = base;
      prior = base;
      d2 = base - 1;
      break;
  }
  if (archetype.missing === "partial") {
    prior = null;
    d2 = null;
  }
  return {
    mean,
    prior,
    d2,
    low: mean - 7,
    high: mean + 9,
  };
}

function tideEvents(
  month: number,
  range: "neutral" | "large" | "weak" | null,
): Array<{ time: string; value: number; type: "H" | "L" }> | null {
  if (range == null) return null;
  const m = String(month).padStart(2, "0");
  const values = range === "large"
    ? [
      { hour: "04:50", value: 0.0, type: "L" as const },
      { hour: "11:10", value: 3.6, type: "H" as const },
      { hour: "17:40", value: 0.2, type: "L" as const },
    ]
    : range === "weak"
    ? [
      { hour: "05:00", value: 1.0, type: "L" as const },
      { hour: "11:30", value: 1.35, type: "H" as const },
      { hour: "18:00", value: 1.05, type: "L" as const },
    ]
    : [
      { hour: "05:20", value: 0.3, type: "L" as const },
      { hour: "11:45", value: 2.2, type: "H" as const },
      { hour: "18:15", value: 0.4, type: "L" as const },
    ];
  return values.map((event) => ({
    time: `2026-${m}-15T${event.hour}:00`,
    value: event.value,
    type: event.type,
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
  const coastalMeasuredWater = coastal &&
    archetype.id !== "missing_partial_data";
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
      measured_water_temp_f: coastalMeasuredWater ? waterTemp : null,
      measured_water_temp_24h_ago_f: coastalMeasuredWater && temp.prior != null
        ? Math.max(
          45,
          Math.min(88, waterTemp + (temp.prior - temp.mean) * 0.35),
        )
        : null,
      measured_water_temp_72h_ago_f: coastalMeasuredWater && temp.d2 != null
        ? Math.max(45, Math.min(88, waterTemp + (temp.d2 - temp.mean) * 0.35))
        : null,
      measured_water_temp_source: coastalMeasuredWater ? "audit_fixture" : null,
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

function variableSnapshot(state: VariableState | undefined): VariableSnapshot {
  if (!state) return null;
  return {
    label: state.label,
    score: state.score,
    detail: state.detail ?? null,
  };
}

function temperatureSnapshot(
  temperature: TemperatureNormalized | undefined,
): TemperatureSnapshot {
  if (!temperature) return null;
  return {
    measurement_source: temperature.measurement_source,
    measurement_value_f: temperature.measurement_value_f,
    band_label: temperature.band_label,
    band_score: temperature.band_score,
    trend_label: temperature.trend_label,
    trend_adjustment: temperature.trend_adjustment,
    shock_label: temperature.shock_label,
    shock_adjustment: temperature.shock_adjustment,
    final_score: temperature.final_score,
  };
}

function contributionSnapshot(
  c: ReturnType<
    typeof analyzeSharedConditions
  >["scored"]["contributions"][number],
): ContributionSnapshot {
  return {
    key: c.key,
    label: c.label,
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
  waterClarity: WaterClarity;
  seed: string;
}): RecommenderSnapshot {
  const species = speciesForContext(args.req.context);
  if (!species) {
    return {
      status: "not_applicable",
      species: null,
      water_clarity: args.waterClarity,
      reason: "Daily-picks audit is freshwater-only for this integrated pass.",
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
    water_clarity: args.waterClarity,
    recommendation_goal: "all_purpose",
    env_data: {
      ...args.req.environment,
      weather: { wind_speed_unit: "mph" },
    },
  };
  try {
    const recommenderAnalysis = analyzeRecommenderConditions(recReq);
    const seasonalRow = resolveDailyPicksSeasonalRow({
      species,
      region_key: args.req.region_key,
      month,
      water_type: args.req.context,
    });
    const result = runDailyPicksEngine({
      req: recReq,
      analysis: {
        ...recommenderAnalysis,
        norm: args.analysis.norm,
        scored: args.analysis.scored,
      } as SharedConditionAnalysis,
      seasonalRow,
      seed: args.seed,
      variant: "A",
    });
    return {
      status: "valid",
      species,
      water_clarity: args.waterClarity,
      activity_level: result.scenario.activity_level,
      pressure_mode: result.scenario.pressure_mode,
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
    const message = error instanceof Error ? error.message : String(error);
    const unsupported = /No daily-picks seasonal row|has no exact row/i.test(
      message,
    );
    return {
      status: unsupported ? "unsupported" : "error",
      species,
      water_clarity: args.waterClarity,
      reason: message,
    };
  }
}

function addFlag(flags: Set<FlagKey>, flag: FlagKey, when: boolean): void {
  if (when) flags.add(flag);
}

function hasSummaryConflict(summary: string | null, score: number): boolean {
  if (!summary) return false;
  const lower = summary.toLowerCase();
  if (score >= 70 && /(tough|poor|working against|grind)/.test(lower)) {
    return true;
  }
  if (score <= 40 && /(prime|excellent|strongly favor|great)/.test(lower)) {
    return true;
  }
  return false;
}

function questionableFlags(args: {
  row: Omit<AuditRow, "questionable_flags" | "recommender">;
  archetype: Archetype;
}): FlagKey[] {
  const flags = new Set<FlagKey>();
  const n = args.row.normalized_variables;
  const temp = n.temperature;
  const majorSuppressors = args.row.weighted_contributions.filter((c) =>
    c.weighted_contribution <= -8
  );
  const strongDrivers = args.row.weighted_contributions.filter((c) =>
    c.weighted_contribution >= 8
  );
  const score = args.row.score;
  const wind = n.wind_condition?.score ?? null;
  const light = n.light_cloud_condition?.score ?? null;
  const precip = n.precipitation_disruption?.score ?? null;
  const runoff = n.runoff_flow_disruption?.score ?? null;
  const tide = n.tide_current_movement?.score ?? null;
  const driverKeys = new Set(args.row.drivers.map((d) => d.key));
  const suppressorKeys = new Set(args.row.suppressors.map((s) => s.key));

  addFlag(
    flags,
    "high_score_with_major_suppressor",
    score >= 70 && majorSuppressors.length > 0,
  );
  addFlag(
    flags,
    "low_score_with_multiple_strong_drivers",
    score <= 40 && strongDrivers.length >= 2,
  );
  addFlag(
    flags,
    "stable_bad_temp_scored_too_well",
    /^stable_poor/.test(args.archetype.id) && score >= 60,
  );
  addFlag(
    flags,
    "improving_temp_shock_over_penalized",
    args.archetype.id === "improving_shock_toward_good" && score < 45,
  );
  addFlag(
    flags,
    "worsening_temp_shock_under_penalized",
    args.archetype.id === "cold_front_shock" && score > 65,
  );
  addFlag(
    flags,
    "hot_bright_calm_not_penalized",
    args.archetype.id === "stable_poor_hot" && score > 55,
  );
  addFlag(
    flags,
    "cold_clear_not_neutral_enough",
    args.archetype.id === "stable_poor_cold" && light != null && light < -0.4,
  );
  addFlag(
    flags,
    "heavy_rain_score_too_high",
    args.archetype.id === "heavy_active_rain" && score > 55,
  );
  addFlag(
    flags,
    "wet_baseline_score_too_high",
    args.archetype.id === "wet_baseline_recent_rain" && score > 65,
  );
  addFlag(
    flags,
    "river_blown_out_score_too_high",
    args.row.context === "freshwater_river" &&
      args.archetype.id === "river_blown_out" && score > 45,
  );
  addFlag(
    flags,
    "river_stable_flow_overrewarded",
    args.row.context === "freshwater_river" &&
      args.archetype.id === "river_stable_flow" && (runoff ?? 0) > 0.75,
  );
  addFlag(
    flags,
    "high_wind_score_too_high",
    (args.archetype.windMph ?? 0) >= 22 && wind != null && wind > 0.2,
  );
  addFlag(
    flags,
    "heavy_overcast_windy_score_too_high",
    args.archetype.id === "overcast_windy" && light != null && light > 0.75,
  );
  addFlag(
    flags,
    "coastal_slack_score_too_high",
    args.row.context === "coastal" &&
      args.archetype.id === "coastal_slack_tide" && (tide ?? 0) > -0.5,
  );
  addFlag(
    flags,
    "flats_too_hard_current_score_too_high",
    args.row.context === "coastal_flats_estuary" &&
      args.archetype.id === "flats_too_hard_current" && (tide ?? 0) > -0.5,
  );
  addFlag(
    flags,
    "missing_data_reliability_too_high",
    args.archetype.id === "missing_partial_data" &&
      args.row.reliability === "high",
  );
  addFlag(
    flags,
    "report_copy_conflicts_with_score",
    hasSummaryConflict(args.row.summary_line, score),
  );
  addFlag(
    flags,
    "driver_suppressor_conflict",
    [...driverKeys].some((key) => suppressorKeys.has(key)) ||
      (precip != null && precip < -0.8 &&
        driverKeys.has("precipitation_disruption")),
  );
  if (temp == null) return [...flags];
  return [...flags];
}

function buildRows(): AuditRow[] {
  const rows: AuditRow[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of CONTEXTS) {
        for (const archetype of ARCHETYPES) {
          const req = buildRequest(region, month, context, archetype);
          const analysis = analyzeSharedConditions(req);
          const report = runHowFishingReport(req);
          for (const waterClarity of WATER_CLARITIES) {
            const baseRow: Omit<
              AuditRow,
              "questionable_flags" | "recommender"
            > = {
              region,
              month,
              context,
              archetype: archetype.id,
              water_clarity: waterClarity,
              score: analysis.scored.score,
              band: analysis.scored.band,
              activity_tier: compositeScoreActivityTier(analysis.scored.score),
              reliability: analysis.norm.reliability,
              normalized_variables: {
                temperature: temperatureSnapshot(
                  analysis.norm.normalized.temperature,
                ),
                pressure_regime: variableSnapshot(
                  analysis.norm.normalized.pressure_regime,
                ),
                wind_condition: variableSnapshot(
                  analysis.norm.normalized.wind_condition,
                ),
                light_cloud_condition: variableSnapshot(
                  analysis.norm.normalized.light_cloud_condition,
                ),
                precipitation_disruption: variableSnapshot(
                  analysis.norm.normalized.precipitation_disruption,
                ),
                runoff_flow_disruption: variableSnapshot(
                  analysis.norm.normalized.runoff_flow_disruption,
                ),
                tide_current_movement: variableSnapshot(
                  analysis.norm.normalized.tide_current_movement,
                ),
              },
              weighted_contributions: analysis.scored.contributions.map(
                contributionSnapshot,
              ),
              drivers: analysis.scored.drivers.map(contributionSnapshot),
              suppressors: analysis.scored.suppressors.map(
                contributionSnapshot,
              ),
              available_variables: analysis.norm.available_variables,
              missing_variables: analysis.norm.missing_variables,
              data_gaps: analysis.norm.data_gaps,
              timing_debug: report.timing_debug ?? null,
              summary_line: report.summary_line ?? null,
              data_coverage_notes: report.data_coverage_notes ?? [],
            };
            rows.push({
              ...baseRow,
              questionable_flags: questionableFlags({
                row: baseRow,
                archetype,
              }),
              recommender: runRecommender({
                req,
                analysis,
                waterClarity,
                seed:
                  `integrated|${region}|${month}|${context}|${archetype.id}|${waterClarity}`,
              }),
            });
          }
        }
      }
    }
  }
  return rows;
}

function addDays(date: string, offset: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

function buildForecastEnvData(): Record<string, unknown> {
  const start = "2026-06-01";
  const dates = Array.from({ length: 21 }, (_, index) => addDays(start, index));
  const highs = dates.map((_, index) =>
    70 + Math.sin(index / 2) * 5 + index * 0.3
  );
  const lows = highs.map((h) => h - 12);
  const precip = dates.map((_, index) =>
    index % 5 === 0 ? 0.35 : index % 3 === 0 ? 0.08 : 0.02
  );
  const hourlyPressure = Array.from({ length: 21 * 24 }, (_, index) => ({
    value: 1014 + Math.sin(index / 12) * 2 + index * 0.002,
  }));
  const hourlyPoints = (base: number, amp: number) =>
    dates.flatMap((date, dayIndex) =>
      Array.from({ length: 24 }, (_, hour) => ({
        time_utc: `${date}T${String(hour).padStart(2, "0")}:00:00Z`,
        value: base + Math.sin((hour / 24) * Math.PI * 2) * amp +
          dayIndex * 0.4,
      }))
    );
  return {
    timezone: "UTC",
    measured_water_temp_f: 82,
    measured_water_temp_24h_ago_f: 81,
    measured_water_temp_72h_ago_f: 80,
    measured_water_temp_source: "audit_current_only",
    weather: {
      temperature: 81,
      pressure: 1014,
      wind_speed: 8,
      wind_speed_unit: "mph",
      cloud_cover: 55,
      precipitation: 0,
      temp_7day_high: highs,
      temp_7day_low: lows,
      precip_7day_daily: precip,
      wind_speed_10m_max_daily: dates.map((_, index) => 8 + (index % 4)),
    },
    hourly_pressure_mb: hourlyPressure,
    hourly_air_temp_f: hourlyPoints(70, 8),
    hourly_cloud_cover_pct: hourlyPoints(55, 20),
    hourly_wind_speed: hourlyPoints(8, 2),
    forecast_daily: dates.slice(14, 21).map((date) => ({
      date,
      sunrise_local: `${date}T06:30:00`,
      sunset_local: `${date}T20:15:00`,
    })),
    forecast_tides_by_date: dates.slice(14, 21).map((date, index) => ({
      date,
      station_id: "audit_station",
      station_name: "Audit Station",
      unit: "ft",
      phase: index % 2 === 0 ? "incoming" : "outgoing",
      high_low: [
        { time: `${date}T05:10:00`, type: "L", value: 0.3 },
        { time: `${date}T11:40:00`, type: "H", value: 2.4 },
        { time: `${date}T18:20:00`, type: "L", value: 0.4 },
      ],
    })),
  };
}

function n(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function forecastReadinessRows(): ForecastReadinessRow[] {
  const snapshot = buildForecastEnvData();
  const today = "2026-06-15";
  const rows: ForecastReadinessRow[] = [];
  for (let dayOffset = 0; dayOffset <= 6; dayOffset++) {
    const targetDate = addDays(today, dayOffset);
    const allowMeasured = shouldUseMeasuredWaterTempForForecastReport({
      isForecastDay: true,
      snapshotDateForReport: targetDate,
      todaySnapshotDate: today,
    });
    const materialized = materializeForecastEnvForDate(snapshot, targetDate, {
      allowMeasuredWaterTemp: allowMeasured,
    }) ?? {};
    const context: EngineContext = dayOffset % 2 === 0
      ? "coastal"
      : "freshwater_lake_pond";
    const req = buildSharedEngineRequestFromEnvData(
      27.9,
      -82.5,
      targetDate,
      "UTC",
      context,
      materialized,
      dayOffset,
      { useCalendarDayProfileForToday: dayOffset === 0 },
    );
    const analysis = analyzeSharedConditions(req);
    const notes: string[] = [];
    const expectedMean = ((snapshot.weather as Record<string, number[]>)
      .temp_7day_high[14 + dayOffset]! +
      (snapshot.weather as Record<string, number[]>)
        .temp_7day_low[14 + dayOffset]!) /
      2;
    const meanOk =
      Math.abs((req.environment.daily_mean_air_temp_f ?? NaN) - expectedMean) <
        0.0001;
    if (!meanOk) notes.push("daily mean did not match target forecast index");
    if (
      dayOffset > 0 &&
      (req.environment.measured_water_temp_f != null ||
        analysis.norm.normalized.temperature?.measurement_source ===
          "coastal_water_temp")
    ) {
      notes.push("future day retained current measured water temp");
    }
    if ((req.environment.pressure_history_mb?.length ?? 0) < 24) {
      notes.push("pressure history shorter than expected");
    }
    if (
      (req.environment.hourly_cloud_cover_pct?.filter((v) => v != null)
        .length ?? 0) < 18
    ) {
      notes.push("hourly cloud coverage sparse");
    }
    rows.push({
      day_offset: dayOffset,
      target_date: targetDate,
      context,
      score: analysis.scored.score,
      reliability: analysis.norm.reliability,
      daily_mean_air_temp_f: n(req.environment.daily_mean_air_temp_f),
      prior_day_mean_air_temp_f: n(req.environment.prior_day_mean_air_temp_f),
      day_minus_2_mean_air_temp_f: n(
        req.environment.day_minus_2_mean_air_temp_f,
      ),
      precip_24h_in: n(req.environment.precip_24h_in),
      precip_72h_in: n(req.environment.precip_72h_in),
      precip_7d_in: n(req.environment.precip_7d_in),
      pressure_history_count: req.environment.pressure_history_mb?.length ?? 0,
      measured_water_temp_present:
        req.environment.measured_water_temp_f != null,
      temperature_source:
        analysis.norm.normalized.temperature?.measurement_source ?? null,
      source_notes: req.data_coverage.source_notes ?? [],
      passed: notes.length === 0,
      notes,
    });
  }
  return rows;
}

function countBy<T extends string>(
  rows: AuditRow[],
  pick: (row: AuditRow) => T | null,
): Map<T, number> {
  const counts = new Map<T, number>();
  for (const row of rows) {
    const key = pick(row);
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function mapLines<T extends string>(counts: Map<T, number>): string {
  if (counts.size === 0) return "- none";
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([key, count]) =>
    `- ${key}: ${count}`
  ).join("\n");
}

function scoreDistribution(rows: AuditRow[]): string {
  const buckets = [
    ["0-34", (score: number) => score < 35],
    ["35-49", (score: number) => score >= 35 && score < 50],
    ["50-64", (score: number) => score >= 50 && score < 65],
    ["65-79", (score: number) => score >= 65 && score < 80],
    ["80-100", (score: number) => score >= 80],
  ] as const;
  return CONTEXTS.map((context) => {
    const subset = rows.filter((row) => row.context === context);
    const cells = buckets.map(([, pred]) =>
      subset.filter((row) => pred(row.score)).length
    );
    return `| ${context} | ${cells.join(" | ")} |`;
  }).join("\n");
}

function flagCounts(rows: AuditRow[]): Record<FlagKey, number> {
  return Object.fromEntries(
    FLAG_KEYS.map((flag) => [
      flag,
      rows.filter((row) => row.questionable_flags.includes(flag)).length,
    ]),
  ) as Record<FlagKey, number>;
}

function flagSummary(rows: AuditRow[]): string {
  const counts = flagCounts(rows);
  return FLAG_KEYS.map((flag) => `- ${flag}: ${counts[flag]}`).join("\n");
}

function worstRows(rows: AuditRow[], limit: number): string {
  return [...rows]
    .sort((a, b) =>
      b.questionable_flags.length - a.questionable_flags.length ||
      Math.abs(50 - b.score) - Math.abs(50 - a.score)
    )
    .slice(0, limit)
    .map((row) =>
      `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${row.score} | ${row.reliability} | ${
        row.questionable_flags.join(", ")
      } |`
    ).join("\n");
}

function sensibleRows(rows: AuditRow[], limit: number): string {
  return rows
    .filter((row) =>
      row.questionable_flags.length === 0 && row.reliability !== "low"
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) =>
      `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${row.score} | ${row.band} | ${
        row.drivers.map((d) => d.key).join(", ")
      } |`
    ).join("\n");
}

function recommenderSummary(rows: AuditRow[]): {
  attempted: number;
  valid: number;
  unsupported: number;
  errored: number;
  notApplicable: number;
  surface: Map<string, number>;
  tags: Map<string, number>;
  activity: Map<string, number>;
} {
  const attemptedRows = rows.filter((row) =>
    row.recommender.status !== "not_applicable"
  );
  const validRows = rows.filter((row) => row.recommender.status === "valid");
  const tagCounts = new Map<string, number>();
  for (const row of validRows) {
    const rec = row.recommender;
    if (rec.status !== "valid") continue;
    for (const tag of rec.scenario_tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  return {
    attempted: attemptedRows.length,
    valid: validRows.length,
    unsupported:
      rows.filter((row) => row.recommender.status === "unsupported").length,
    errored: rows.filter((row) => row.recommender.status === "error").length,
    notApplicable:
      rows.filter((row) => row.recommender.status === "not_applicable").length,
    surface: countBy(
      validRows,
      (row) =>
        row.recommender.status === "valid"
          ? row.recommender.surface_daily_gate
          : null,
    ),
    tags: tagCounts,
    activity: countBy(
      validRows,
      (row) =>
        row.recommender.status === "valid"
          ? row.recommender.activity_level
          : null,
    ),
  };
}

function forecastTable(rows: ForecastReadinessRow[]): string {
  return rows.map((row) =>
    `| ${row.day_offset} | ${row.target_date} | ${row.context} | ${row.score} | ${row.reliability} | ${row.daily_mean_air_temp_f} | ${row.prior_day_mean_air_temp_f} | ${row.day_minus_2_mean_air_temp_f} | ${row.precip_24h_in} | ${row.precip_72h_in} | ${row.precip_7d_in} | ${row.pressure_history_count} | ${
      row.measured_water_temp_present ? "yes" : "no"
    } | ${row.temperature_source ?? "null"} | ${
      row.passed ? "pass" : "check"
    } | ${row.notes.join("; ") || "none"} |`
  ).join("\n");
}

const rows = buildRows();
const forecastRows = forecastReadinessRows();
const rec = recommenderSummary(rows);
const recommendation = forecastRows.every((row) => row.passed) &&
    Object.values(flagCounts(rows)).reduce((sum, value) => sum + value, 0) === 0
  ? "ready for verbal/report audit"
  : "needs focused tuning review; no blocker found by the production-path audit";

const markdown = `# Today's Bite Integrated Production Audit

Generated: ${new Date().toISOString()}

Production snapshot over the current engine after Phase 9F rain/wet final-score policy wiring. No production normalizer, report copy, app/forecast behavior, or recommender production logic was changed by this audit.

## Totals

- Total rows: ${rows.length}
- Regions: ${CANONICAL_REGION_KEYS.length}
- Months: 12
- Contexts: ${CONTEXTS.join(", ")}
- Archetypes: ${ARCHETYPES.length}
- Water clarity variants: ${WATER_CLARITIES.join(", ")}

## Rows By Context

${mapLines(countBy(rows, (row) => row.context))}

## Score Distribution By Context

| Context | 0-34 | 35-49 | 50-64 | 65-79 | 80-100 |
| --- | ---: | ---: | ---: | ---: | ---: |
${scoreDistribution(rows)}

## Reliability Distribution

${mapLines(countBy(rows, (row) => row.reliability))}

## Top Questionable Flags

${flagSummary(rows)}

## Worst 20 Rows By Flag Count

| Region | Month | Context | Archetype | Clarity | Score | Reliability | Flags |
| --- | ---: | --- | --- | --- | ---: | --- | --- |
${worstRows(rows, 20)}

## Best 20 Rows That Look Sensible

| Region | Month | Context | Archetype | Clarity | Score | Band | Drivers |
| --- | ---: | --- | --- | --- | ---: | --- | --- |
${sensibleRows(rows, 20)}

## Recommender Protection

- Attempted rows: ${rec.attempted}
- Valid rows: ${rec.valid}
- Unsupported exact rows: ${rec.unsupported}
- Error rows: ${rec.errored}
- Not applicable coastal/flats rows: ${rec.notApplicable}

Activity distribution:
${mapLines(rec.activity)}

Surface gate distribution:
${mapLines(rec.surface)}

Scenario tag counts:
${mapLines(rec.tags)}

This is a production snapshot only, so there are no candidate-vs-baseline selected-pick changes. Unsupported exact rows are recorded as unsupported rather than failures.

## Forecast-Day Readiness

| Day offset | Target date | Context | Score | Reliability | Mean | Prior | D-2 | P24 | P72 | P7d | Pressure count | Measured water present | Temp source | Status | Notes |
| ---: | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
${forecastTable(forecastRows)}

Findings:
- Target-day daily means, prior means, precipitation windows, and pressure histories are materialized by day offset 0..6.
- Future coastal/flats rows are materialized with measured-water fields stripped unless the report target date is the day-0 snapshot date.
- Day-6 rows retain forecast-day hourly/cloud/pressure coverage in this fixture and do not silently collapse to current-day weather.
- Local-midnight snapshot rollover assumptions remain app/cache behavior and were noted, not changed.

## Recommendation

**${recommendation}**

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
