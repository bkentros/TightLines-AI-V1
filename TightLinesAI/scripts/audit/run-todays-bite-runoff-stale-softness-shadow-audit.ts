#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Shadow-only audit for receding/stale river runoff softness.
 *
 * Production normalizers, scoreDay, report copy, recommender logic, cache, and
 * deployment behavior are not modified. This script clones production-normalized
 * freshwater_river rows in memory and applies a narrow runoff score candidate
 * when 7-day rain alone is holding runoff slightly/elevated after recent rain
 * windows have settled.
 */

import { analyzeSharedConditions } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
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
import { isCoastalFamilyContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import {
  scoreDay,
  type ScoreDayResult,
} from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { scoreDayOptionsFromRequest } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { normalizeRunoff } from "../../supabase/functions/_shared/howFishingEngine/normalize/normalizeRunoff.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import {
  buildReportSummaryLine,
  type ReportSummaryInput,
} from "../../supabase/functions/_shared/howFishingEngine/summary/summaryLine.ts";
import { buildFactorSurfaceLabel } from "../../supabase/functions/_shared/howFishingEngine/summary/factorSurfaceLabels.ts";
import { buildConditionContextExtensions } from "../../supabase/functions/_shared/howFishingEngine/narration/buildConditionContextExtensions.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type {
  RecommenderRequest,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";

const OUTPUT_JSONL =
  "scripts/audit/todays-bite-runoff-stale-softness-shadow-audit.jsonl";
const OUTPUT_MD =
  "scripts/audit/todays-bite-runoff-stale-softness-shadow-audit.md";
const VARIANTS = ["productionized_v3_hybrid_surgical"] as const;
type VariantName = typeof VARIANTS[number];

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
  | "river_high_p7d_low_recent"
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
    id: "river_high_p7d_low_recent",
    temp: "seasonal",
    windMph: 7,
    cloudPct: 62,
    pressure: stablePressure(1014),
    precipRate: 0,
    activePrecip: false,
    p24: 0.03,
    p72: 0.16,
    p7d: 1.55,
    currentKnots: 1.0,
    tideStage: "incoming",
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

type Sens = "low" | "medium" | "high";
const REGION_SENS: Record<RegionKey, Sens> = {
  florida: "low",
  southeast_atlantic: "medium",
  gulf_coast: "medium",
  south_central: "medium",
  mountain_west: "medium",
  northeast: "high",
  great_lakes_upper_midwest: "high",
  midwest_interior: "high",
  southwest_desert: "high",
  southwest_high_desert: "high",
  pacific_northwest: "high",
  southern_california: "high",
  mountain_alpine: "high",
  northern_california: "high",
  appalachian: "high",
  inland_northwest: "medium",
  alaska: "high",
  hawaii: "medium",
};
const SNOWMELT_RISK_REGIONS = new Set<RegionKey>([
  "mountain_alpine",
  "alaska",
  "mountain_west",
  "pacific_northwest",
  "inland_northwest",
  "northern_california",
  "great_lakes_upper_midwest",
]);
const FLASHY_REGIONS = new Set<RegionKey>([
  "southwest_desert",
  "southwest_high_desert",
  "southern_california",
]);

type ContributionSnapshot = {
  key: ScoredVariableKey;
  label: string;
  score: number;
  weight: number;
  weighted_contribution: number;
};
type RecSide = {
  status: "valid";
  activity_level: string;
  water_movement_mode: string;
  surface_daily_gate: string;
  scenario_tags: readonly string[];
  selected_lure_ids: readonly string[];
  selected_fly_ids: readonly string[];
} | { status: "not_applicable" | "unsupported" | "error"; reason: string };
type CandidateRunoffResult = {
  norm: SharedNormalizedOutput;
  applied: boolean;
  staleSettlingPolicy: boolean;
};
type AuditRow = {
  variant: VariantName;
  region: RegionKey;
  month: number;
  context: EngineContext;
  archetype: ArchetypeId;
  water_clarity: WaterClarity;
  baseline_score: number;
  candidate_score: number;
  score_delta: number;
  baseline_band: string;
  candidate_band: string;
  baseline_activity: string;
  candidate_activity: string;
  baseline_runoff: VariableState | null;
  candidate_runoff: VariableState | null;
  candidate_applied: boolean;
  stale_settling_policy: boolean;
  high_p7d_low_recent: boolean;
  active_heavy_rain: boolean;
  high_recent_rain: boolean;
  baseline_blown_out: boolean;
  upgraded_unsafe: boolean;
  copy_flags: string[];
  baseline_recommender: RecSide;
  candidate_recommender: RecSide;
  recommender_activity_changed: boolean;
  recommender_bad_direction: boolean;
};

type VariantStats = {
  variant: VariantName;
  rows: AuditRow[];
  riverRows: AuditRow[];
  appliedRows: AuditRow[];
  highP7dRows: AuditRow[];
  unsafeRows: AuditRow[];
  copyFailures: AuditRow[];
  recTierChanges: AuditRow[];
  badRec: AuditRow[];
  negativeDeltas: AuditRow[];
  nonRiverChanged: AuditRow[];
  riverGoodPrimeBaseline: number;
  riverGoodPrimeCandidate: number;
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

function baseThresholds(sens: Sens) {
  switch (sens) {
    case "low":
      return { stable: [0.35, 0.85, 1.8], elevated: [1.1, 2.6, 4.8] };
    case "medium":
      return { stable: [0.22, 0.55, 1.25], elevated: [0.90, 2.0, 3.9] };
    case "high":
      return { stable: [0.15, 0.40, 1.0], elevated: [0.65, 1.5, 3.1] };
  }
}

function scaledThresholds(region: RegionKey, month: number) {
  const thresholds = baseThresholds(REGION_SENS[region] ?? "medium");
  let scale = 1;
  if (month >= 4 && month <= 6 && SNOWMELT_RISK_REGIONS.has(region)) {
    scale *= 0.60;
  }
  if (FLASHY_REGIONS.has(region)) scale *= 0.82;
  return {
    stable: thresholds.stable.map((x) => x * scale),
    elevated: thresholds.elevated.map((x) => x * scale),
  };
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function applyCandidateRunoffSoftness(
  req: SharedEngineRequest,
  norm: SharedNormalizedOutput,
  variant: string,
): CandidateRunoffResult {
  if (req.context !== "freshwater_river") {
    return { norm, applied: false, staleSettlingPolicy: false };
  }
  const runoff = norm.normalized.runoff_flow_disruption;
  if (!runoff || !["slightly_elevated", "elevated"].includes(runoff.label)) {
    return { norm, applied: false, staleSettlingPolicy: false };
  }
  const e = req.environment;
  const p24 = e.precip_24h_in;
  const p72 = e.precip_72h_in;
  const p7d = e.precip_7d_in;
  if (p24 == null || p72 == null || p7d == null) {
    return { norm, applied: false, staleSettlingPolicy: false };
  }
  if (e.active_precip_now && (e.precip_rate_now_in_per_hr ?? 0) >= 0.05) {
    return { norm, applied: false, staleSettlingPolicy: false };
  }
  const month = Number.parseInt(req.local_date.slice(5, 7), 10) || 1;
  const t = scaledThresholds(req.region_key, month);
  const recentU = Math.max(p24 / t.stable[0]!, p72 / t.stable[1]!);
  const p7dOnlyDriver = p24 < t.stable[0]! && p72 < t.stable[1]! &&
    p7d >= t.stable[2]!;
  const notNearBlownOut = p7d < t.elevated[2]!;
  if (!p7dOnlyDriver || !notNearBlownOut || recentU > 0.9) {
    return { norm, applied: false, staleSettlingPolicy: false };
  }
  const p7dMeaningfullyStale = p7d >= Math.max(t.stable[2]! * 1.12, 1.25);
  const elevated = runoff.label === "elevated";
  const slight = runoff.label === "slightly_elevated";
  const elevatedStaleEligible = p7dMeaningfullyStale &&
    !FLASHY_REGIONS.has(req.region_key) &&
    (!SNOWMELT_RISK_REGIONS.has(req.region_key) || month === 4 || month === 5);
  if (
    variant === "v3_slight_plus_narrow_elevated" &&
    elevated &&
    !elevatedStaleEligible
  ) {
    return { norm, applied: false, staleSettlingPolicy: false };
  }
  if (
    (variant === "v3_stale_settling_flag" ||
      variant === "v3_hybrid_surgical") &&
    ((slight && !p7dMeaningfullyStale) ||
      (elevated && !elevatedStaleEligible))
  ) {
    return { norm, applied: false, staleSettlingPolicy: false };
  }
  if (variant === "v3_stale_settling_flag" && !elevated) {
    return { norm, applied: false, staleSettlingPolicy: false };
  }
  const recentSettledStrength = Math.max(0, Math.min(1, 1 - recentU / 0.9));
  const multiplierBase = slight ? 0.76 : 0.82;
  const multiplier = multiplierBase - 0.08 * recentSettledStrength;
  const staleSettlingPolicy = (variant === "v3_stale_settling_flag" ||
    variant === "v3_hybrid_surgical") && elevated;
  const softened = variant === "v3_stale_settling_flag"
    ? Math.min(-0.35, Math.max(-0.95, runoff.score))
    : Math.min(0, runoff.score * multiplier);
  const next = clone(norm);
  next.normalized.runoff_flow_disruption = {
    ...runoff,
    score: softened,
    detail: staleSettlingPolicy
      ? [runoff.detail, "stale_settling_p7d_only"].filter(Boolean).join("; ")
      : runoff.detail,
  };
  return { norm: next, applied: true, staleSettlingPolicy };
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

function tempProfile(region: RegionKey, month: number, archetype: Archetype) {
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
  return { mean, prior, d2, low: mean - 7, high: mean + 9 };
}

function tideEvents(month: number, range: "neutral" | "large" | "weak" | null) {
  if (range == null) return null;
  const m = String(month).padStart(2, "0");
  const values = range === "large"
    ? [{ hour: "04:50", value: 0.0, type: "L" as const }, {
      hour: "11:10",
      value: 3.6,
      type: "H" as const,
    }, { hour: "17:40", value: 0.2, type: "L" as const }]
    : range === "weak"
    ? [{ hour: "05:00", value: 1.0, type: "L" as const }, {
      hour: "11:30",
      value: 1.35,
      type: "H" as const,
    }, { hour: "18:00", value: 1.05, type: "L" as const }]
    : [{ hour: "05:20", value: 0.3, type: "L" as const }, {
      hour: "11:45",
      value: 2.2,
      type: "H" as const,
    }, { hour: "18:15", value: 0.4, type: "L" as const }];
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
  const coastal = isCoastalFamilyContext(context);
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

function contributionSnapshot(
  c: ScoreDayResult["contributions"][number],
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
  if (context === "freshwater_river") return "river_trout";
  return null;
}

function runRecommender(
  req: SharedEngineRequest,
  analysis: SharedConditionAnalysis,
  waterClarity: WaterClarity,
  seed: string,
): RecSide {
  const species = speciesForContext(req.context);
  if (!species) {
    return { status: "not_applicable", reason: "coastal/flats skipped" };
  }
  const month = Number.parseInt(req.local_date.slice(5, 7), 10);
  const recReq: RecommenderRequest = {
    location: {
      latitude: req.latitude,
      longitude: req.longitude,
      state_code: req.state_code ?? "XX",
      region_key: req.region_key,
      local_date: req.local_date,
      local_timezone: req.local_timezone,
      month,
    },
    species,
    context: req.context,
    water_clarity: waterClarity,
    recommendation_goal: "all_purpose",
    env_data: { ...req.environment, weather: { wind_speed_unit: "mph" } },
  };
  try {
    const recAnalysis = analyzeRecommenderConditions(recReq);
    const seasonalRow = resolveDailyPicksSeasonalRow({
      species,
      region_key: req.region_key,
      month,
      water_type: req.context,
    });
    const result = runDailyPicksEngine({
      req: recReq,
      analysis: {
        ...recAnalysis,
        norm: analysis.norm,
        scored: analysis.scored,
      } as SharedConditionAnalysis,
      seasonalRow,
      seed,
      variant: "A",
    });
    return {
      status: "valid",
      activity_level: result.scenario.activity_level,
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
      reason,
    };
  }
}

function candidateAnalysis(
  req: SharedEngineRequest,
  baseline: SharedConditionAnalysis,
  variant: string,
): {
  analysis: SharedConditionAnalysis;
  applied: boolean;
  staleSettlingPolicy: boolean;
} {
  const rawNorm = buildSharedNormalizedOutput(req);
  const candidate = applyCandidateRunoffSoftness(req, rawNorm, variant);
  if (!candidate.applied) {
    return { analysis: baseline, applied: false, staleSettlingPolicy: false };
  }
  const scoreOptions = scoreDayOptionsFromRequest(
    req,
    baseline.timing.timing_strength,
  );
  if (candidate.staleSettlingPolicy) {
    scoreOptions.precip7dIn = 0;
  }
  const scored = scoreDay(
    candidate.norm,
    scoreOptions,
  );
  return {
    applied: candidate.applied,
    staleSettlingPolicy: candidate.staleSettlingPolicy,
    analysis: {
      ...baseline,
      norm: scored.normalized,
      scored,
    },
  };
}

function productionizedAnalysis(
  req: SharedEngineRequest,
): {
  analysis: SharedConditionAnalysis;
  applied: boolean;
  staleSettlingPolicy: boolean;
} {
  const analysis = analyzeSharedConditions(req);
  const staleSettlingPolicy = /\bstale_settling_p7d_only\b/.test(
    analysis.norm.normalized.runoff_flow_disruption?.detail ?? "",
  );
  return { analysis, applied: staleSettlingPolicy, staleSettlingPolicy };
}

function preStaleBaselineAnalysis(
  req: SharedEngineRequest,
): SharedConditionAnalysis {
  const production = analyzeSharedConditions(req);
  if (req.context !== "freshwater_river") return production;

  const norm = buildSharedNormalizedOutput(req);
  const month = Number.parseInt(req.local_date.slice(5, 7), 10) || 1;
  const oldRunoff = normalizeRunoff(
    req.region_key,
    req.environment.precip_24h_in,
    req.environment.precip_72h_in,
    req.environment.precip_7d_in,
    month,
    { activeHeavyRain: true },
  );
  if (oldRunoff) {
    norm.normalized.runoff_flow_disruption = oldRunoff;
  } else {
    delete norm.normalized.runoff_flow_disruption;
  }
  const scored = scoreDay(
    norm,
    scoreDayOptionsFromRequest(req, production.timing.timing_strength),
  );
  return {
    ...production,
    norm: scored.normalized,
    scored,
  };
}

function bandUpgrade(from: string, to: string): boolean {
  const order = { Tough: 0, Poor: 1, Fair: 2, Good: 3, Prime: 4 } as Record<
    string,
    number
  >;
  return (order[to] ?? 0) > (order[from] ?? 0);
}

function badRecDirection(base: RecSide, cand: RecSide): boolean {
  if (base.status !== "valid" || cand.status !== "valid") return false;
  const order = { suppressed: 0, neutral: 1, active: 2 } as Record<
    string,
    number
  >;
  return (base.activity_level === "active" &&
    cand.activity_level === "neutral") ||
    (base.activity_level === "neutral" &&
      cand.activity_level === "suppressed") ||
    ((order[cand.activity_level] ?? 0) < (order[base.activity_level] ?? 0));
}

function toSummaryFactor(
  c: ScoreDayResult["contributions"][number],
  candidate: SharedConditionAnalysis,
  req: SharedEngineRequest,
): ReportSummaryInput["drivers"][number] {
  const ext = buildConditionContextExtensions(
    candidate.norm,
    candidate.scored.contributions,
    req.environment,
    req.context,
  );
  const normVar = ext.normalized_variable_scores.find((v) =>
    v.variable_key === c.key
  );
  return {
    variable: c.key,
    weightedContribution: c.weightedContribution,
    normalizedScore: c.score,
    engineLabel: normVar?.engine_label,
    temperatureBreakdown: normVar?.temperature_breakdown ?? null,
  };
}

function candidateCopySurface(
  req: SharedEngineRequest,
  candidate: SharedConditionAnalysis,
) {
  const seed = [
    req.context,
    req.region_key,
    req.local_date,
    `${req.latitude.toFixed(4)},${req.longitude.toFixed(4)}`,
    candidate.scored.band,
    String(candidate.scored.score),
    candidate.scored.drivers[0]?.key ?? "none",
    candidate.scored.suppressors[0]?.key ?? "none",
  ].join("|");
  return {
    summary_line: buildReportSummaryLine({
      band: candidate.scored.band,
      score: candidate.scored.score,
      context: req.context,
      reliability: candidate.norm.reliability,
      limitedData: candidate.norm.reliability !== "high" ||
        candidate.norm.missing_variables.length > 0 ||
        candidate.norm.data_gaps.length > 0,
      drivers: candidate.scored.drivers.map((c) =>
        toSummaryFactor(c, candidate, req)
      ),
      suppressors: candidate.scored.suppressors.map((c) =>
        toSummaryFactor(c, candidate, req)
      ),
      seed,
    }),
    drivers: candidate.scored.drivers.map((c) => ({
      variable: c.key,
      label: buildFactorSurfaceLabel(
        c.key,
        req.context,
        candidate.norm.normalized,
        "positive",
        `${seed}|driver|${c.key}`,
      ),
    })),
    suppressors: candidate.scored.suppressors.map((c) => ({
      variable: c.key,
      label: buildFactorSurfaceLabel(
        c.key,
        req.context,
        candidate.norm.normalized,
        "negative",
        `${seed}|suppressor|${c.key}`,
      ),
    })),
  };
}

function copyFlags(
  req: SharedEngineRequest,
  candidate: SharedConditionAnalysis,
): string[] {
  const flags: string[] = [];
  const report = candidateCopySurface(req, candidate);
  const summary = report.summary_line?.toLowerCase() ?? "";
  if (
    candidate.scored.score >= 70 &&
    /(tough|poor|grind|working against)/.test(summary)
  ) {
    flags.push("summary_negative_with_candidate_good");
  }
  if (
    candidate.scored.score <= 40 &&
    /(prime|excellent|great|strongly favor)/.test(summary)
  ) {
    flags.push("summary_positive_with_candidate_poor");
  }
  const reportSuppressors = new Set(
    report.suppressors.map((s) => s.variable as ScoredVariableKey),
  );
  const candidateSuppressors = new Set(
    candidate.scored.suppressors.map((s) => s.key),
  );
  const reportDrivers = new Set(
    report.drivers.map((d) => d.variable as ScoredVariableKey),
  );
  const candidateDrivers = new Set(candidate.scored.drivers.map((d) => d.key));
  for (const key of reportSuppressors) {
    if (!candidateSuppressors.has(key)) flags.push(`stale_suppressor:${key}`);
  }
  for (const key of candidateSuppressors) {
    if (!reportSuppressors.has(key)) flags.push(`missing_suppressor:${key}`);
  }
  for (const key of reportDrivers) {
    if (!candidateDrivers.has(key)) flags.push(`stale_driver:${key}`);
  }
  for (const key of candidateDrivers) {
    if (!reportDrivers.has(key)) flags.push(`missing_driver:${key}`);
  }
  return flags;
}

function buildRows(variant: VariantName): AuditRow[] {
  const rows: AuditRow[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of CONTEXTS) {
        for (const archetype of ARCHETYPES) {
          const req = buildRequest(region, month, context, archetype);
          const baseline = preStaleBaselineAnalysis(req);
          const candidate = productionizedAnalysis(req);
          for (const waterClarity of WATER_CLARITIES) {
            const seed =
              `runoff-stale-softness|${variant}|${region}|${month}|${context}|${archetype.id}|${waterClarity}`;
            const baseRec = runRecommender(req, baseline, waterClarity, seed);
            const candRec = runRecommender(
              req,
              candidate.analysis,
              waterClarity,
              seed,
            );
            const p24 = req.environment.precip_24h_in ?? 0;
            const p72 = req.environment.precip_72h_in ?? 0;
            const p7d = req.environment.precip_7d_in ?? 0;
            const baselineRunoff =
              baseline.norm.normalized.runoff_flow_disruption ?? null;
            const candidateRunoff =
              candidate.analysis.norm.normalized.runoff_flow_disruption ?? null;
            const activeHeavyRain = Boolean(
              req.environment.active_precip_now &&
                (req.environment.precip_rate_now_in_per_hr ?? 0) >= 0.05,
            );
            const highRecentRain = p24 >= 0.35 || p72 >= 1.0;
            const highP7dLowRecent = context === "freshwater_river" &&
              p7d >= 1.25 && p24 <= 0.10 && p72 <= 0.35;
            rows.push({
              variant,
              region,
              month,
              context,
              archetype: archetype.id,
              water_clarity: waterClarity,
              baseline_score: baseline.scored.score,
              candidate_score: candidate.analysis.scored.score,
              score_delta: candidate.analysis.scored.score -
                baseline.scored.score,
              baseline_band: baseline.scored.band,
              candidate_band: candidate.analysis.scored.band,
              baseline_activity: compositeScoreActivityTier(
                baseline.scored.score,
              ),
              candidate_activity: compositeScoreActivityTier(
                candidate.analysis.scored.score,
              ),
              baseline_runoff: baselineRunoff,
              candidate_runoff: candidateRunoff,
              candidate_applied: candidate.applied,
              stale_settling_policy: candidate.staleSettlingPolicy,
              high_p7d_low_recent: highP7dLowRecent,
              active_heavy_rain: activeHeavyRain,
              high_recent_rain: highRecentRain,
              baseline_blown_out: baselineRunoff?.label === "blown_out",
              upgraded_unsafe: bandUpgrade(
                baseline.scored.band,
                candidate.analysis.scored.band,
              ) &&
                (activeHeavyRain || highRecentRain ||
                  baselineRunoff?.label === "blown_out"),
              copy_flags: copyFlags(req, candidate.analysis),
              baseline_recommender: baseRec,
              candidate_recommender: candRec,
              recommender_activity_changed: baseRec.status === "valid" &&
                candRec.status === "valid" &&
                baseRec.activity_level !== candRec.activity_level,
              recommender_bad_direction: badRecDirection(baseRec, candRec),
            });
          }
        }
      }
    }
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

function dist(
  rows: AuditRow[],
  key: "baseline_score" | "candidate_score",
): string {
  const buckets = [
    ["0-34", (score: number) => score < 35],
    ["35-49", (score: number) => score >= 35 && score < 50],
    ["50-64", (score: number) => score >= 50 && score < 65],
    ["65-79", (score: number) => score >= 65 && score < 80],
    ["80-100", (score: number) => score >= 80],
  ] as const;
  return buckets.map(([label, pred]) =>
    `${label}:${rows.filter((row) => pred(row[key])).length}`
  ).join(", ");
}

function bandMove(rows: AuditRow[], from: string, to: string): number {
  return rows.filter((row) =>
    row.baseline_band === from && row.candidate_band === to
  ).length;
}

function mapLines<T extends string>(counts: Map<T, number>): string {
  if (counts.size === 0) return "- none";
  return [...counts.entries()].sort((a, b) =>
    String(a[0]).localeCompare(String(b[0]))
  ).map(([key, count]) => `- ${key}: ${count}`).join("\n");
}

function statsForVariant(variant: VariantName): VariantStats {
  const rows = buildRows(variant);
  const riverRows = rows.filter((row) => row.context === "freshwater_river");
  const appliedRows = rows.filter((row) => row.candidate_applied);
  return {
    variant,
    rows,
    riverRows,
    appliedRows,
    highP7dRows: riverRows.filter((row) => row.high_p7d_low_recent),
    unsafeRows: rows.filter((row) => row.upgraded_unsafe),
    copyFailures: rows.filter((row) => row.copy_flags.length > 0),
    recTierChanges: rows.filter((row) => row.recommender_activity_changed),
    badRec: rows.filter((row) => row.recommender_bad_direction),
    negativeDeltas: appliedRows.filter((row) => row.score_delta < 0),
    nonRiverChanged: rows.filter((row) =>
      row.context !== "freshwater_river" && row.score_delta !== 0
    ),
    riverGoodPrimeBaseline:
      riverRows.filter((row) =>
        row.baseline_band === "Good" || row.baseline_band === "Prime"
      ).length,
    riverGoodPrimeCandidate:
      riverRows.filter((row) =>
        row.candidate_band === "Good" || row.candidate_band === "Prime"
      ).length,
  };
}

const variantStats = VARIANTS.map(statsForVariant);
const acceptable = variantStats.filter((s) =>
  s.unsafeRows.length === 0 &&
  s.badRec.length === 0 &&
  s.negativeDeltas.length === 0 &&
  s.nonRiverChanged.length === 0 &&
  s.copyFailures.length === 0
);
const best = acceptable[0] ?? variantStats[0]!;
const rows = best.rows;
const riverRows = best.riverRows;
const highP7dRows = best.highP7dRows;
const appliedRows = best.appliedRows;
const unsafeRows = best.unsafeRows;
const copyFailures = best.copyFailures;
const recTierChanges = best.recTierChanges;
const badRec = best.badRec;
const negativeDeltas = best.negativeDeltas;
const riverGoodPrimeBaseline = best.riverGoodPrimeBaseline;
const riverGoodPrimeCandidate = best.riverGoodPrimeCandidate;
const recommendation = acceptable.includes(best)
  ? "productionized V3 passes audit guardrails"
  : "none acceptable; keep shadow-only and iterate";

function variantComparisonTable(stats: VariantStats[]): string {
  return stats.map((s) =>
    `| ${s.variant} | ${s.appliedRows.length} | ${
      s.riverGoodPrimeCandidate - s.riverGoodPrimeBaseline
    } | ${s.negativeDeltas.length} | ${s.unsafeRows.length} | ${s.nonRiverChanged.length} | ${s.copyFailures.length} | ${s.badRec.length} |`
  ).join("\n");
}

function madisonRows(stats: VariantStats): string {
  return stats.rows
    .filter((row) =>
      row.region === "great_lakes_upper_midwest" &&
      row.context === "freshwater_river" &&
      row.archetype === "river_high_p7d_low_recent" &&
      [4, 5, 6].includes(row.month)
    )
    .map((row) =>
      `| ${row.month} | ${row.water_clarity} | ${row.baseline_score} | ${row.candidate_score} | ${row.baseline_band}->${row.candidate_band} | ${row.baseline_runoff?.label}:${
        row.baseline_runoff?.score.toFixed(3)
      } -> ${row.candidate_runoff?.score.toFixed(3)} | ${
        row.candidate_applied ? "yes" : "no"
      } |`
    ).join("\n");
}

const markdown = `# Today's Bite Runoff Stale Softness Shadow Audit

Generated: ${new Date().toISOString()}

Best candidate: ${best.variant}

Rows: ${rows.length}

Variant comparison:
| Variant | Applied | River Good+Prime delta | Negative deltas | Unsafe upgrades | Non-river changes | Copy flags | Bad rec dirs |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${variantComparisonTable(variantStats)}

Global distribution:
- baseline: ${dist(rows, "baseline_score")}
- candidate: ${dist(rows, "candidate_score")}

Freshwater river distribution:
- baseline: ${dist(riverRows, "baseline_score")}
- candidate: ${dist(riverRows, "candidate_score")}

River band moves:
- Poor->Fair: ${bandMove(riverRows, "Poor", "Fair")}
- Fair->Good: ${bandMove(riverRows, "Fair", "Good")}
- Good->Prime: ${bandMove(riverRows, "Good", "Prime")}

River Good+Prime delta: ${
  riverGoodPrimeCandidate - riverGoodPrimeBaseline
} (${riverGoodPrimeBaseline} -> ${riverGoodPrimeCandidate})

Negative score deltas on candidate-applied rows: ${negativeDeltas.length}

High p7d + low recent rain:
- rows: ${highP7dRows.length}
- candidate applied: ${
  highP7dRows.filter((row) => row.candidate_applied).length
}
- avg score delta: ${avg(highP7dRows.map((row) => row.score_delta)).toFixed(2)}
- max score delta: ${Math.max(0, ...highP7dRows.map((row) => row.score_delta))}

Madison / Great Lakes spring rows:
| Month | Clarity | Baseline | Candidate | Band | Runoff | Applied |
| ---: | --- | ---: | ---: | --- | --- | --- |
${madisonRows(best)}

Unsafe upgrades:
- active/heavy rain, high recent rain, or blown_out upgraded: ${unsafeRows.length}
- active/heavy rain upgraded: ${
  rows.filter((row) =>
    row.active_heavy_rain && bandUpgrade(row.baseline_band, row.candidate_band)
  ).length
}
- high 24h/72h rain upgraded: ${
  rows.filter((row) =>
    row.high_recent_rain && bandUpgrade(row.baseline_band, row.candidate_band)
  ).length
}
- blown_out upgraded: ${
  rows.filter((row) =>
    row.baseline_blown_out && bandUpgrade(row.baseline_band, row.candidate_band)
  ).length
}

Guardrails/copy failures:
- candidate-applied rows: ${appliedRows.length}
- candidate-wired copy/stale factor flags: ${copyFailures.length}
- non-river changed rows: ${
  rows.filter((row) =>
    row.context !== "freshwater_river" && row.score_delta !== 0
  ).length
}

Per-region river applied rows:
${
  mapLines(countBy(
    appliedRows.filter((row) => row.context === "freshwater_river"),
    (row) => row.region,
  ))
}

Per-month river applied rows:
${
  mapLines(countBy(
    appliedRows.filter((row) => row.context === "freshwater_river"),
    (row) => String(row.month),
  ))
}

Recommender tier changes:
- activity tier changes: ${recTierChanges.length}
- bad directions: ${badRec.length}
- active->neutral: ${
  recTierChanges.filter((row) =>
    row.baseline_recommender.status === "valid" &&
    row.candidate_recommender.status === "valid" &&
    row.baseline_recommender.activity_level === "active" &&
    row.candidate_recommender.activity_level === "neutral"
  ).length
}
- neutral->suppressed: ${
  recTierChanges.filter((row) =>
    row.baseline_recommender.status === "valid" &&
    row.candidate_recommender.status === "valid" &&
    row.baseline_recommender.activity_level === "neutral" &&
    row.candidate_recommender.activity_level === "suppressed"
  ).length
}

Recommendation: ${recommendation}
`;

const artifactRows = variantStats.flatMap((s) => s.rows);
await Deno.writeTextFile(
  OUTPUT_JSONL,
  artifactRows.map((row) =>
    JSON.stringify({
      ...row,
      baseline_contributions: undefined,
      candidate_contributions: undefined,
    })
  ).join("\n") + "\n",
);
await Deno.writeTextFile(OUTPUT_MD, markdown);
console.log(markdown);
console.log(`Wrote ${OUTPUT_JSONL}`);
console.log(`Wrote ${OUTPUT_MD}`);

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
