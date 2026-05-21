#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Shadow-only Today's Bite optimism calibration audit.
 *
 * This file does not modify production scoring, normalizers, recommender
 * behavior, app UI, region maps, temp tables, or contracts. Candidate scores
 * are local audit math layered over production report/analysis outputs.
 */

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
import type {
  ScoreBand,
  TimingStrength,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/report.ts";
import type { TemperatureNormalized } from "../../supabase/functions/_shared/howFishingEngine/contracts/variableState.ts";
import { analyzeSharedConditions } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";
import { bandFromScore } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";

const OUTPUT_JSONL =
  "scripts/audit/todays-bite-score-optimism-shadow-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-score-optimism-shadow-audit.md";

const CONTEXTS = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
] as const satisfies readonly EngineContext[];

const WATER_CLARITIES = ["clear", "stained"] as const;
const SPREAD_SCORE_BUCKETS = [
  "10-34",
  "35-44",
  "45-49",
  "50-54",
  "55-59",
  "60-64",
  "65-69",
  "70-74",
  "75-79",
  "80-84",
  "85-89",
  "90-94",
  "95-99",
] as const;
const VARIANTS = [
  "curve_clean_floor_v3",
  "curve_timing_balanced_v3",
  "curve_timing_selective_prime_v3",
  "curve_timing_selective_prime_v31",
  "curve_timing_selective_prime_v32",
  "curve_timing_selective_prime_v33_tail_only",
  "curve_timing_selective_prime_v33_tail_plus",
  "curve_timing_selective_prime_v34_continuous_tail",
  "curve_timing_selective_prime_v34_continuous_tail_plus",
  "curve_timing_selective_prime_v35_productionizable_tail_plus",
  "curve_timing_selective_prime_v36_minor_negative_tail_plus",
  "curve_timing_selective_prime_v36_minor_negative_floor",
  "curve_timing_selective_prime_v37_region_balanced_light",
  "curve_timing_selective_prime_v37_region_balanced_moderate",
  "curve_timing_selective_prime_v37_region_balanced_prime_gate",
  "curve_timing_selective_prime_v38_supported_fair_floor_light",
  "curve_timing_selective_prime_v38_supported_fair_floor_moderate",
  "curve_timing_selective_prime_v38_supported_fair_floor_strong",
  "curve_timing_selective_prime_v38_supported_fair_floor_with_prime_tidy",
  "v39_weight_rebalance_low_region_light",
  "v39_temp_borderline_softening_light",
  "v39_weight_plus_temp_light",
  "v39_alaska_high_side_check",
  "v40_temp_table_underparity_light",
  "v40_temp_table_underparity_moderate",
  "v40_support_cap_trusted_temp",
  "v40_temp_plus_support_cap",
  "v40_alaska_temp_trim_light",
  "v41_temp_mean_centering_light",
  "v41_temp_mean_centering_moderate",
  "v41_temp_table_knot_repair",
  "v41_temp_plus_trusted_support",
  "v41_prime_gate_clean",
  "v41_alaska_high_side_diagnostic",
  "v42_redflag_good_cap_light",
  "v42_redflag_good_cap_moderate",
  "v42_mainland_balanced",
  "v42_florida_clean_prime_tail_diagnostic",
  "v43_v41_replay",
  "v43_runtime_prime_gate_clean",
  "v43_runtime_good_cap_light",
  "v43_runtime_good_cap_balanced",
  "v43_florida_prime_debug",
  "productionized_v44_severe_thermal_good_cap",
  "v45_spread_curve_light",
  "v45_spread_curve_moderate",
  "v45_support_confidence_spread",
  "v45_prime_gate_supported_widen",
  "v45_aggressive_prime_8_diagnostic",
  "v46_low_prime_bridge_light",
  "v46_low_prime_bridge_moderate",
  "v46_middle_spread_no_floor_light",
  "v46_middle_spread_no_floor_moderate",
  "v46_combined_light",
  "v46_aggressive_prime_6_8_diagnostic",
] as const;
const BANDS = ["Tough", "Poor", "Fair", "Good", "Prime"] as const;

type WaterClarity = typeof WATER_CLARITIES[number];
type SpreadScoreBucket = typeof SPREAD_SCORE_BUCKETS[number];
type VariantId = typeof VARIANTS[number];
type ActivityTier = "suppressed" | "neutral" | "active";
type RegionMeta = { lat: number; lon: number; state: string; tz: string };
type RegionCalibration = { fairGoodLift: number; primeLift: number };
type RegionFloorCalibration = {
  minScore: number;
  floor: number;
  cap: number;
  primeTidy: boolean;
};

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

const V37_REGION_CALIBRATION_LIGHT: Partial<
  Record<RegionKey, RegionCalibration>
> = {
  florida: { fairGoodLift: 6, primeLift: 2 },
  northeast: { fairGoodLift: 5, primeLift: 2 },
  mountain_west: { fairGoodLift: 5, primeLift: 2 },
  pacific_northwest: { fairGoodLift: 3, primeLift: 1 },
  northern_california: { fairGoodLift: 6, primeLift: 2 },
  appalachian: { fairGoodLift: 5, primeLift: 2 },
  inland_northwest: { fairGoodLift: 4, primeLift: 2 },
  hawaii: { fairGoodLift: 4, primeLift: 2 },
};

const V37_REGION_CALIBRATION_MODERATE: Partial<
  Record<RegionKey, RegionCalibration>
> = {
  florida: { fairGoodLift: 10, primeLift: 4 },
  northeast: { fairGoodLift: 8, primeLift: 3 },
  mountain_west: { fairGoodLift: 8, primeLift: 3 },
  pacific_northwest: { fairGoodLift: 5, primeLift: 2 },
  northern_california: { fairGoodLift: 10, primeLift: 3 },
  appalachian: { fairGoodLift: 8, primeLift: 3 },
  inland_northwest: { fairGoodLift: 7, primeLift: 3 },
  hawaii: { fairGoodLift: 6, primeLift: 3 },
};

const V37_REGION_CALIBRATION_PRIME_GATE: Partial<
  Record<RegionKey, RegionCalibration>
> = {
  florida: { fairGoodLift: 12, primeLift: 7 },
  northeast: { fairGoodLift: 9, primeLift: 5 },
  mountain_west: { fairGoodLift: 9, primeLift: 5 },
  pacific_northwest: { fairGoodLift: 6, primeLift: 4 },
  northern_california: { fairGoodLift: 12, primeLift: 5 },
  appalachian: { fairGoodLift: 9, primeLift: 5 },
  inland_northwest: { fairGoodLift: 8, primeLift: 5 },
  hawaii: { fairGoodLift: 7, primeLift: 5 },
};

const STRUCTURALLY_PESSIMISTIC_REGIONS = new Set<RegionKey>([
  "florida",
  "northern_california",
  "mountain_west",
  "northeast",
  "appalachian",
  "inland_northwest",
  "hawaii",
  "pacific_northwest",
]);

const V39_LOW_SIDE_REGIONS = new Set<RegionKey>([
  "florida",
  "northern_california",
  "mountain_west",
]);

const V39_BALANCED_PEER_REGIONS = new Set<RegionKey>([
  "gulf_coast",
  "southeast_atlantic",
  "south_central",
  "pacific_northwest",
]);

const V39_HIGH_SIDE_REGIONS = new Set<RegionKey>(["alaska"]);

const V40_UNDERPARITY_REGIONS = new Set<RegionKey>([
  "northeast",
  "florida",
  "mountain_west",
  "pacific_northwest",
  "northern_california",
  "appalachian",
  "inland_northwest",
  "hawaii",
]);

const CORE_MAINLAND_REGIONS = CANONICAL_REGION_KEYS.filter((region) =>
  region !== "alaska" && region !== "hawaii"
) as RegionKey[];

const SOUTHEAST_PRIME_DIAGNOSTIC_REGIONS = new Set<RegionKey>([
  "florida",
  "gulf_coast",
  "southeast_atlantic",
]);

const V38_FLOORS: Record<
  Extract<
    VariantId,
    | "curve_timing_selective_prime_v38_supported_fair_floor_light"
    | "curve_timing_selective_prime_v38_supported_fair_floor_moderate"
    | "curve_timing_selective_prime_v38_supported_fair_floor_strong"
    | "curve_timing_selective_prime_v38_supported_fair_floor_with_prime_tidy"
  >,
  RegionFloorCalibration
> = {
  curve_timing_selective_prime_v38_supported_fair_floor_light: {
    minScore: 57,
    floor: 65,
    cap: 67,
    primeTidy: false,
  },
  curve_timing_selective_prime_v38_supported_fair_floor_moderate: {
    minScore: 54,
    floor: 67,
    cap: 68,
    primeTidy: false,
  },
  curve_timing_selective_prime_v38_supported_fair_floor_strong: {
    minScore: 52,
    floor: 68,
    cap: 70,
    primeTidy: false,
  },
  curve_timing_selective_prime_v38_supported_fair_floor_with_prime_tidy: {
    minScore: 54,
    floor: 67,
    cap: 68,
    primeTidy: true,
  },
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

type VariableSnapshot = {
  label: string;
  score: number;
  detail: string | null;
} | null;

type TemperatureSnapshot = {
  measurement_source: string;
  measurement_value_f: number | null;
  band_label: string;
  band_score: number;
  trend_label: string;
  trend_adjustment: number;
  shock_label: string;
  shock_adjustment: number;
  final_score: number;
} | null;

type ContributionSnapshot = {
  key: ScoredVariableKey;
  label: string;
  score: number;
  weight: number;
  weighted_contribution: number;
};

type NormalizedSnapshot = {
  temperature: TemperatureSnapshot;
  pressure_regime: VariableSnapshot;
  wind_condition: VariableSnapshot;
  light_cloud_condition: VariableSnapshot;
  precipitation_disruption: VariableSnapshot;
  runoff_flow_disruption: VariableSnapshot;
  tide_current_movement: VariableSnapshot;
};

type ConditionSupportDiagnostics = {
  positive_driver_mass: number;
  negative_suppressor_mass: number;
  strongest_driver_contribution: number;
  strongest_suppressor_contribution: number;
  surfaced_driver_count: number;
  surfaced_suppressor_count: number;
  has_real_driver: boolean;
  thin_support: boolean;
};

type CandidateResult = {
  score: number;
  band: ScoreBand;
  score_delta: number;
  activity_tier: ActivityTier;
  report_copy_needs_regeneration: boolean;
  guardrail_violations: string[];
  structural?: {
    adjusted_raw_sum: number;
    adjusted_pre_cap_score: number;
    adjusted_weighted_contributions: ContributionSnapshot[];
    adjusted_drivers: ContributionSnapshot[];
    adjusted_suppressors: ContributionSnapshot[];
    adjusted_support: ConditionSupportDiagnostics;
    adjusted_clean_support: boolean;
    adjusted_strong_support: boolean;
    adjusted_trusted_support: boolean;
    direct_score_delta_used: boolean;
    productionizable_change_types: string[];
  };
};

type AuditRow = {
  region: RegionKey;
  month: number;
  context: EngineContext;
  archetype: ArchetypeId;
  water_clarity: WaterClarity;
  runtime_environment: {
    current_speed_knots_max: number | null;
  };
  production: {
    score: number;
    band: ScoreBand;
    reliability: string;
    activity_tier: ActivityTier;
    timing_strength: TimingStrength | null;
    drivers: ContributionSnapshot[];
    suppressors: ContributionSnapshot[];
    weighted_contributions: ContributionSnapshot[];
    normalized_variable_scores: NormalizedSnapshot;
    missing_variables: string[];
    data_gaps: unknown[];
    report_surface: {
      summary_line: string;
      actionable_tip: string;
      timing_insight: string | null;
      solunar_note: string | null;
      driver_labels: string[];
      suppressor_labels: string[];
    };
  };
  productionized_actual: {
    score: number;
    band: ScoreBand;
    activity_tier: ActivityTier;
    driver_variables: ScoredVariableKey[];
    suppressor_variables: ScoredVariableKey[];
    driver_labels: string[];
    suppressor_labels: string[];
  };
  condition_support: ConditionSupportDiagnostics;
  clean_support: boolean;
  strong_support: boolean;
  trusted_suppressor_support: boolean;
  hard_cap_row: boolean;
  hard_cap_reasons: string[];
  shutdown_row: boolean;
  shutdown_reasons: string[];
  severe_thermal_row: boolean;
  severe_thermal_reasons: string[];
  severe_movement_runoff_precip_row: boolean;
  severe_movement_runoff_precip_reasons: string[];
  major_suppressor_row: boolean;
  moderate_suppressor_row: boolean;
  active_heavy_rain: boolean;
  recent_wet_rain: boolean;
  candidates: Record<VariantId, CandidateResult>;
};

type Metrics = {
  bandDistribution: Record<ScoreBand, number>;
  bandDistributionByContext: Record<EngineContext, Record<ScoreBand, number>>;
  scoreTailHistogram: Record<string, number>;
  primeScoreHistogram: Record<string, number>;
  maxScore: number;
  primeCountByArchetype: Record<string, number>;
  goodPrimeCountByArchetype: Record<string, number>;
  avgScoreDelta: number;
  crossings: Record<string, number>;
  downwardCrossings: Record<string, number>;
  primeCountByContext: Record<EngineContext, number>;
  guardrailViolations: Record<string, number>;
  activityTierChanges: Record<string, number>;
  copyRegenerationRows: number;
  redFlagUpgradeRows: number;
  redFlagUpgradesByArchetypeContext: Record<string, number>;
  reportExplainabilityFailures: number;
  primeCautionCount: number;
  supportTaxonomyCounts: Record<string, number>;
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

function contributionSnapshot(c: {
  key: ScoredVariableKey;
  label: string;
  score: number;
  weight: number;
  weightedContribution: number;
}): ContributionSnapshot {
  return {
    key: c.key,
    label: c.label,
    score: c.score,
    weight: c.weight,
    weighted_contribution: c.weightedContribution,
  };
}

function activityTier(score: number): ActivityTier {
  if (score <= 35) return "suppressed";
  if (score >= 70) return "active";
  return "neutral";
}

function normalizedScore(row: {
  production: { normalized_variable_scores: NormalizedSnapshot };
}, key: keyof NormalizedSnapshot): number | null {
  const value = row.production.normalized_variable_scores[key];
  if (value == null) return null;
  return "final_score" in value ? value.final_score : value.score;
}

function allNormalizedScores(row: {
  production: { normalized_variable_scores: NormalizedSnapshot };
}): number[] {
  return Object.keys(row.production.normalized_variable_scores).flatMap(
    (key) => {
      const score = normalizedScore(row, key as keyof NormalizedSnapshot);
      return score == null ? [] : [score];
    },
  );
}

function conditionSupport(
  drivers: ContributionSnapshot[],
  suppressors: ContributionSnapshot[],
  contributions: ContributionSnapshot[],
): ConditionSupportDiagnostics {
  const positive = contributions.filter((c) => c.weighted_contribution > 0);
  const negative = contributions.filter((c) => c.weighted_contribution < 0);
  const positiveDriverMass = positive.reduce(
    (sum, c) => sum + c.weighted_contribution,
    0,
  );
  const negativeSuppressorMass = negative.reduce(
    (sum, c) => sum + Math.abs(c.weighted_contribution),
    0,
  );
  const strongestDriverContribution = Math.max(
    0,
    ...positive.map((c) => c.weighted_contribution),
  );
  const strongestSuppressorContribution = Math.min(
    0,
    ...negative.map((c) => c.weighted_contribution),
  );
  const surfacedDriverCount = drivers.length;
  const surfacedSuppressorCount = suppressors.length;
  return {
    positive_driver_mass: positiveDriverMass,
    negative_suppressor_mass: negativeSuppressorMass,
    strongest_driver_contribution: strongestDriverContribution,
    strongest_suppressor_contribution: strongestSuppressorContribution,
    surfaced_driver_count: surfacedDriverCount,
    surfaced_suppressor_count: surfacedSuppressorCount,
    has_real_driver: surfacedDriverCount > 0 ||
      strongestDriverContribution >= 10,
    thin_support: positiveDriverMass < 12 && surfacedDriverCount === 0,
  };
}

function normalizedVariableReasons(
  row: {
    production: { normalized_variable_scores: NormalizedSnapshot };
  },
  checks: readonly (readonly [keyof NormalizedSnapshot, number])[],
): string[] {
  const reasons: string[] = [];
  for (const [key, threshold] of checks) {
    const score = normalizedScore(row, key);
    if (score != null && score <= threshold) {
      reasons.push(`${key}_lte_${threshold}`);
    }
  }
  return reasons;
}

function severeThermalReasons(row: {
  production: { normalized_variable_scores: NormalizedSnapshot };
}): string[] {
  return normalizedVariableReasons(row, [["temperature", -1.75]] as const);
}

function severeMovementRunoffPrecipReasons(row: {
  production: { normalized_variable_scores: NormalizedSnapshot };
}): string[] {
  return normalizedVariableReasons(
    row,
    [
      ["precipitation_disruption", -1.5],
      ["runoff_flow_disruption", -1.5],
      ["wind_condition", -1.5],
      ["tide_current_movement", -1.5],
    ] as const,
  );
}

function shutdownReasons(row: Omit<AuditRow, "candidates">): string[] {
  return [
    ...(row.active_heavy_rain ? ["active_heavy_rain"] : []),
    ...row.severe_movement_runoff_precip_reasons,
  ];
}

function hardCapReasons(row: Omit<AuditRow, "candidates">): string[] {
  const reasons: string[] = [];
  if (
    row.production.missing_variables.length || row.production.data_gaps.length
  ) {
    reasons.push("missing_or_partial");
  }
  if (row.production.reliability === "low") reasons.push("low_reliability");
  if (row.active_heavy_rain) reasons.push("active_heavy_rain");
  if (row.recent_wet_rain) reasons.push("wet_recent_rain");
  if (row.major_suppressor_row) reasons.push("major_suppressor");
  reasons.push(...row.severe_movement_runoff_precip_reasons);
  reasons.push(...row.severe_thermal_reasons);
  return reasons;
}

function cleanSupport(row: Omit<AuditRow, "candidates">): boolean {
  return row.production.reliability === "high" &&
    row.production.missing_variables.length === 0 &&
    row.production.data_gaps.length === 0 &&
    !row.shutdown_row &&
    !row.recent_wet_rain &&
    !row.moderate_suppressor_row &&
    row.condition_support.surfaced_driver_count >= 1 &&
    row.condition_support.positive_driver_mass >= 18;
}

function strongSupport(row: Omit<AuditRow, "candidates">): boolean {
  const support = row.condition_support;
  return row.production.reliability === "high" &&
    row.production.missing_variables.length === 0 &&
    row.production.data_gaps.length === 0 &&
    !row.shutdown_row &&
    !row.recent_wet_rain &&
    support.surfaced_driver_count >= 1 &&
    support.positive_driver_mass >= 24 &&
    support.positive_driver_mass >= support.negative_suppressor_mass + 10;
}

function trustedSuppressorSupport(row: Omit<AuditRow, "candidates">): boolean {
  const support = row.condition_support;
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  return (row.moderate_suppressor_row || row.major_suppressor_row) &&
    row.production.reliability === "high" &&
    row.production.missing_variables.length === 0 &&
    row.production.data_gaps.length === 0 &&
    !row.shutdown_row &&
    !row.recent_wet_rain &&
    row.production.score >= 58 &&
    support.surfaced_driver_count >= 2 &&
    support.strongest_driver_contribution >= 12 &&
    dominance >= 12 &&
    !row.severe_movement_runoff_precip_row &&
    (!row.severe_thermal_row || dominance >= 18);
}

function v38TrustedModerateSupport(
  row: Omit<AuditRow, "candidates">,
): boolean {
  const support = row.condition_support;
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  return (row.moderate_suppressor_row || row.major_suppressor_row) &&
    row.production.reliability === "high" &&
    row.production.missing_variables.length === 0 &&
    row.production.data_gaps.length === 0 &&
    !row.shutdown_row &&
    !row.active_heavy_rain &&
    !row.recent_wet_rain &&
    !row.severe_movement_runoff_precip_row &&
    row.production.score >= 52 &&
    support.surfaced_driver_count >= 1 &&
    support.strongest_driver_contribution >= 10 &&
    dominance >= (row.major_suppressor_row ? 12 : 8) &&
    (!row.severe_thermal_row || dominance >= 16);
}

function curveLiftV3(score: number): number {
  if (score < 35) return 2;
  if (score < 50) return 5;
  if (score < 65) return 6;
  if (score < 80) return 3;
  return 1;
}

function timingLiftV3(timingStrength: TimingStrength | null): number {
  const strength = timingStrength ?? "fair_default";
  return { fair_default: 0, good: 1, strong: 2, very_strong: 3 }[strength];
}

function guardrailViolations(args: {
  row: Omit<AuditRow, "candidates">;
  score: number;
  variant?: VariantId;
}): string[] {
  const row = args.row;
  const score = args.score;
  const trustedSuppressor = row.trusted_suppressor_support ||
    (args.variant && isV38Variant(args.variant) &&
      v38TrustedModerateSupport(row));
  const violations: string[] = [];
  if (
    (row.production.missing_variables.length ||
      row.production.data_gaps.length) &&
    score >= 80
  ) {
    violations.push("missing_partial_gte_80");
  }
  if (row.production.reliability === "low" && score >= 80) {
    violations.push("low_reliability_gte_80");
  }
  if (row.active_heavy_rain && score > 55) {
    violations.push("active_heavy_rain_gt_55");
  }
  if (
    row.recent_wet_rain &&
    (row.production.band === "Poor" || row.production.band === "Fair") &&
    score > 64
  ) {
    violations.push("wet_recent_poor_fair_gt_64");
  }
  if (row.shutdown_row && !row.active_heavy_rain && score > 40) {
    violations.push("shutdown_non_rain_gt_40");
  }
  if (row.major_suppressor_row && score > 69) {
    if (
      row.production.band !== "Good" && row.production.band !== "Prime" ||
      score > row.production.score
    ) {
      violations.push("major_suppressor_gt_69");
    }
  }
  if (
    row.moderate_suppressor_row &&
    !trustedSuppressor &&
    (row.production.band === "Poor" || row.production.band === "Fair") &&
    score > 64
  ) {
    violations.push("untrusted_suppressor_upgrade_gt_64");
  }
  if (row.severe_movement_runoff_precip_row && score > 69) {
    violations.push("severe_movement_runoff_precip_gt_69");
  }
  return violations;
}

function applyCaps(
  row: Omit<AuditRow, "candidates">,
  score: number,
  variant?: VariantId,
): number {
  let capped = score;
  const trustedSuppressor = row.trusted_suppressor_support ||
    (variant && isV38Variant(variant) && v38TrustedModerateSupport(row));
  if (
    row.production.missing_variables.length || row.production.data_gaps.length
  ) {
    capped = Math.min(capped, 64);
  }
  if (row.production.reliability !== "high") capped = Math.min(capped, 72);
  if (row.active_heavy_rain) capped = Math.min(capped, 55);
  if (row.recent_wet_rain) {
    if (row.production.band === "Good" || row.production.band === "Prime") {
      capped = Math.min(capped, row.production.score);
    } else {
      capped = Math.min(capped, 64);
    }
  }
  if (row.shutdown_row && !row.active_heavy_rain) capped = Math.min(capped, 40);
  if (row.major_suppressor_row || row.moderate_suppressor_row) {
    if (!trustedSuppressor) {
      if (row.production.band === "Poor" || row.production.band === "Fair") {
        capped = Math.min(capped, 64);
      }
    } else if (
      row.production.band !== "Good" && row.production.band !== "Prime"
    ) {
      capped = Math.min(capped, 69);
    }
  }
  return capped;
}

function primeEligible(
  row: Omit<AuditRow, "candidates">,
  preCapScore: number,
): boolean {
  const support = row.condition_support;
  return row.production.reliability === "high" &&
    row.production.missing_variables.length === 0 &&
    row.production.data_gaps.length === 0 &&
    !row.shutdown_row &&
    !row.recent_wet_rain &&
    !row.moderate_suppressor_row &&
    !row.major_suppressor_row &&
    allNormalizedScores(row).every((score) => score > -0.25) &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= 35 &&
    support.strongest_driver_contribution >= 12 &&
    (row.production.score >= 70 || preCapScore >= 80);
}

function productionizablePrimeDisqualified(
  row: Omit<AuditRow, "candidates">,
): boolean {
  return productionizablePrimeDisqualificationReasons(row).length > 0;
}

function productionizablePrimeDisqualificationReasons(
  row: Omit<AuditRow, "candidates">,
): string[] {
  const support = row.condition_support;
  const extremeCurrent =
    row.runtime_environment.current_speed_knots_max != null &&
    row.runtime_environment.current_speed_knots_max > 1.8;
  const reasons: string[] = [];
  if (row.production.reliability !== "high") {
    reasons.push("non_high_reliability");
  }
  if (row.production.missing_variables.length > 0) {
    reasons.push("missing_variables");
  }
  if (row.production.data_gaps.length > 0) reasons.push("data_gaps");
  if (row.active_heavy_rain) reasons.push("active_heavy_rain");
  if (row.recent_wet_rain) reasons.push("recent_wet_rain_or_runoff");
  if (row.shutdown_row) reasons.push("shutdown_row");
  if (row.severe_movement_runoff_precip_row) {
    reasons.push("severe_movement_runoff_precip");
  }
  if (row.moderate_suppressor_row) reasons.push("moderate_suppressor");
  if (row.major_suppressor_row) reasons.push("major_suppressor");
  if (extremeCurrent) reasons.push("extreme_current_speed");
  if (support.surfaced_driver_count < 2) reasons.push("surfaced_drivers_lt_2");
  if (support.positive_driver_mass < 35) reasons.push("positive_mass_lt_35");
  if (support.strongest_driver_contribution < 12) {
    reasons.push("strongest_driver_lt_12");
  }
  if (support.negative_suppressor_mass > 4) reasons.push("negative_mass_gt_4");
  const lowest = normalizedCleanliness(row);
  if (lowest <= -0.25) {
    reasons.push(`normalized_lte_-0.25:${lowest.toFixed(2)}`);
  }
  return reasons;
}

function productionizablePrimeEligible(
  row: Omit<AuditRow, "candidates">,
  preCapScore: number,
): boolean {
  return !productionizablePrimeDisqualified(row) &&
    (row.production.score >= 70 || preCapScore >= 80);
}

function relaxedMinorNegativePrimeEligible(
  row: Omit<AuditRow, "candidates">,
  preCapScore: number,
): boolean {
  const support = row.condition_support;
  const normalized = allNormalizedScores(row);
  const minorNegativeCount =
    normalized.filter((score) => score > -0.45 && score <= -0.25).length;
  const hardNegative = normalized.some((score) => score <= -0.45);
  const runtimeReasons = productionizablePrimeDisqualificationReasons(row)
    .filter((reason) => !reason.startsWith("normalized_lte_-0.25"));
  return runtimeReasons.length === 0 &&
    !hardNegative &&
    minorNegativeCount <= 1 &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= 65 &&
    support.negative_suppressor_mass <= 4.25 &&
    support.strongest_driver_contribution >= 18 &&
    (row.production.score >= 70 || preCapScore >= 80);
}

function v36PrimeEligible(
  row: Omit<AuditRow, "candidates">,
  preCapScore: number,
): boolean {
  return productionizablePrimeEligible(row, preCapScore) ||
    relaxedMinorNegativePrimeEligible(row, preCapScore);
}

function wouldUpgradeToGoodOrPrime(
  productionBand: ScoreBand,
  score: number,
): boolean {
  return (productionBand === "Poor" || productionBand === "Fair") &&
    score >= 65;
}

function finalSupportGateAllowsGood(
  row: Omit<AuditRow, "candidates">,
): boolean {
  return row.clean_support ||
    row.strong_support ||
    row.trusted_suppressor_support;
}

function primeBumpEligibleV32(
  row: Omit<AuditRow, "candidates">,
  score: number,
): boolean {
  const support = row.condition_support;
  return primeEligible(row, score) &&
    !RED_FLAG_ARCHETYPES.has(row.archetype) &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= 45 &&
    support.negative_suppressor_mass <= 4;
}

function primeBumpEligibleV33TailPlus(
  row: Omit<AuditRow, "candidates">,
  score: number,
): boolean {
  const support = row.condition_support;
  return score >= 77 &&
    primeEligible(row, score + 3) &&
    !RED_FLAG_ARCHETYPES.has(row.archetype) &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= 58 &&
    support.negative_suppressor_mass <= 3 &&
    support.strongest_driver_contribution >= 14;
}

function primeBumpEligibleV34TailPlus(
  row: Omit<AuditRow, "candidates">,
  score: number,
): boolean {
  const support = row.condition_support;
  return score >= 77 &&
    primeEligible(row, score + 3) &&
    !RED_FLAG_ARCHETYPES.has(row.archetype) &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= 68 &&
    support.negative_suppressor_mass <= 2 &&
    support.strongest_driver_contribution >= 16;
}

function primeBumpEligibleV35Base(
  row: Omit<AuditRow, "candidates">,
  score: number,
): boolean {
  const support = row.condition_support;
  return productionizablePrimeEligible(row, score) &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= 45 &&
    support.negative_suppressor_mass <= 4;
}

function primeBumpEligibleV35TailPlus(
  row: Omit<AuditRow, "candidates">,
  score: number,
): boolean {
  const support = row.condition_support;
  return score >= 77 &&
    productionizablePrimeEligible(row, score + 3) &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= 68 &&
    support.negative_suppressor_mass <= 2 &&
    support.strongest_driver_contribution >= 16;
}

function primeBumpEligibleV36TailPlus(
  row: Omit<AuditRow, "candidates">,
  score: number,
): boolean {
  const support = row.condition_support;
  return score >= 77 &&
    v36PrimeEligible(row, score + 3) &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= 68 &&
    support.negative_suppressor_mass <= 2 &&
    support.strongest_driver_contribution >= 16;
}

function eliteTailScore(
  row: Omit<AuditRow, "candidates">,
  score: number,
): number {
  if (
    score < 80 ||
    !primeEligible(row, score) ||
    RED_FLAG_ARCHETYPES.has(row.archetype) ||
    row.condition_support.surfaced_driver_count < 2 ||
    row.condition_support.negative_suppressor_mass > 4
  ) {
    return score;
  }
  const support = row.condition_support;
  let lift = 0;
  if (support.positive_driver_mass >= 45) lift += 1;
  if (support.positive_driver_mass >= 60) lift += 1;
  if (support.positive_driver_mass >= 75) lift += 2;
  if (support.positive_driver_mass >= 85) lift += 3;
  if (support.strongest_driver_contribution >= 24) lift += 1;
  if (support.negative_suppressor_mass <= 1) lift += 1;
  if (support.negative_suppressor_mass <= 0.1) lift += 1;
  const timingLift = {
    fair_default: 0,
    good: 0,
    strong: 1,
    very_strong: 2,
  }[row.production.timing_strength ?? "fair_default"];
  lift += timingLift;
  return Math.min(99, Math.max(score, score + lift));
}

function normalizedCleanliness(
  row: Omit<AuditRow, "candidates">,
): number {
  return Math.min(...allNormalizedScores(row));
}

function continuousTailScore(
  row: Omit<AuditRow, "candidates">,
  score: number,
): number {
  const support = row.condition_support;
  if (
    score < 80 ||
    !primeEligible(row, score) ||
    RED_FLAG_ARCHETYPES.has(row.archetype) ||
    support.surfaced_driver_count < 2 ||
    support.negative_suppressor_mass > 4
  ) {
    return score;
  }

  const clean = normalizedCleanliness(row);
  if (
    support.positive_driver_mass >= 85 &&
    support.strongest_driver_contribution >= 35 &&
    support.negative_suppressor_mass <= 2 &&
    clean > -0.25 &&
    row.production.timing_strength === "very_strong"
  ) {
    return 99;
  }
  if (
    support.positive_driver_mass >= 88 &&
    support.strongest_driver_contribution >= 50 &&
    support.negative_suppressor_mass <= 0.1 &&
    clean > -0.25
  ) {
    return Math.max(score, 95);
  }

  let lift = 0;
  if (support.positive_driver_mass >= 60) lift += 1;
  if (support.positive_driver_mass >= 75) lift += 2;
  if (support.positive_driver_mass >= 84) lift += 2;
  if (support.strongest_driver_contribution >= 30) lift += 1;
  if (support.negative_suppressor_mass <= 1) lift += 1;
  if (support.negative_suppressor_mass <= 0.25) lift += 1;
  if (clean >= 0.4) lift += 1;
  if (row.production.timing_strength === "strong") lift += 1;
  if (row.production.timing_strength === "very_strong") lift += 2;

  return Math.min(98, Math.max(score, score + lift));
}

function productionizableContinuousTailScore(
  row: Omit<AuditRow, "candidates">,
  score: number,
): number {
  const support = row.condition_support;
  if (
    score < 80 ||
    !productionizablePrimeEligible(row, score) ||
    support.surfaced_driver_count < 2 ||
    support.negative_suppressor_mass > 4
  ) {
    return score;
  }

  const clean = normalizedCleanliness(row);
  if (
    support.positive_driver_mass >= 85 &&
    support.strongest_driver_contribution >= 35 &&
    support.negative_suppressor_mass <= 2 &&
    clean > -0.25 &&
    row.production.timing_strength === "very_strong"
  ) {
    return 99;
  }
  if (
    support.positive_driver_mass >= 88 &&
    support.strongest_driver_contribution >= 50 &&
    support.negative_suppressor_mass <= 0.1 &&
    clean > -0.25
  ) {
    return Math.max(score, 95);
  }

  let lift = 0;
  if (support.positive_driver_mass >= 60) lift += 1;
  if (support.positive_driver_mass >= 75) lift += 2;
  if (support.positive_driver_mass >= 84) lift += 2;
  if (support.strongest_driver_contribution >= 30) lift += 1;
  if (support.negative_suppressor_mass <= 1) lift += 1;
  if (support.negative_suppressor_mass <= 0.25) lift += 1;
  if (clean >= 0.4) lift += 1;
  if (row.production.timing_strength === "strong") lift += 1;
  if (row.production.timing_strength === "very_strong") lift += 2;

  return Math.min(98, Math.max(score, score + lift));
}

function v43RuntimePrimeDisqualificationReasons(
  row: Omit<AuditRow, "candidates">,
  preCapScore: number,
): string[] {
  const reasons = productionizablePrimeDisqualificationReasons(row);
  const support = row.condition_support;
  const tempContribution =
    contributionByKey(row, "temperature_condition")?.weighted_contribution ?? 0;
  if (
    row.context === "freshwater_lake_pond" &&
    row.production.score <= 73 &&
    tempContribution >= 50 &&
    support.positive_driver_mass < 73
  ) {
    reasons.push("freshwater_temp_dominated_prime_needs_more_corrob");
  }
  const relaxedMinorNegative = relaxedMinorNegativePrimeEligible(
    row,
    preCapScore,
  );
  if (!relaxedMinorNegative) return reasons;
  return reasons.filter((reason) => !reason.startsWith("normalized_lte_-0.25"));
}

function v43RuntimePrimeEligible(
  row: Omit<AuditRow, "candidates">,
  preCapScore: number,
): boolean {
  return v43RuntimePrimeDisqualificationReasons(row, preCapScore).length === 0;
}

function v43RuntimeContinuousTailScore(
  row: Omit<AuditRow, "candidates">,
  score: number,
): number {
  const support = row.condition_support;
  if (
    score < 80 ||
    !v43RuntimePrimeEligible(row, score) ||
    support.surfaced_driver_count < 2 ||
    support.negative_suppressor_mass > 4.25
  ) {
    return score;
  }

  const clean = normalizedCleanliness(row);
  if (
    support.positive_driver_mass >= 85 &&
    support.strongest_driver_contribution >= 35 &&
    support.negative_suppressor_mass <= 2 &&
    clean > -0.45 &&
    row.production.timing_strength === "very_strong"
  ) {
    return 99;
  }
  if (
    support.positive_driver_mass >= 88 &&
    support.strongest_driver_contribution >= 50 &&
    support.negative_suppressor_mass <= 0.1 &&
    clean > -0.45
  ) {
    return Math.max(score, 95);
  }

  let lift = 0;
  if (support.positive_driver_mass >= 60) lift += 1;
  if (support.positive_driver_mass >= 75) lift += 2;
  if (support.positive_driver_mass >= 84) lift += 2;
  if (support.strongest_driver_contribution >= 30) lift += 1;
  if (support.negative_suppressor_mass <= 1) lift += 1;
  if (support.negative_suppressor_mass <= 0.25) lift += 1;
  if (clean >= 0.4) lift += 1;
  if (row.production.timing_strength === "strong") lift += 1;
  if (row.production.timing_strength === "very_strong") lift += 2;

  return Math.min(98, Math.max(score, score + lift));
}

function v36ContinuousTailScore(
  row: Omit<AuditRow, "candidates">,
  score: number,
): number {
  const support = row.condition_support;
  if (
    score < 80 ||
    !v36PrimeEligible(row, score) ||
    support.surfaced_driver_count < 2 ||
    support.negative_suppressor_mass > 4.25
  ) return score;

  const clean = normalizedCleanliness(row);
  if (
    support.positive_driver_mass >= 85 &&
    support.strongest_driver_contribution >= 35 &&
    support.negative_suppressor_mass <= 2 &&
    clean > -0.45 &&
    row.production.timing_strength === "very_strong"
  ) {
    return 99;
  }
  if (
    support.positive_driver_mass >= 88 &&
    support.strongest_driver_contribution >= 50 &&
    support.negative_suppressor_mass <= 0.1 &&
    clean > -0.45
  ) {
    return Math.max(score, 95);
  }

  let lift = 0;
  if (support.positive_driver_mass >= 60) lift += 1;
  if (support.positive_driver_mass >= 75) lift += 2;
  if (support.positive_driver_mass >= 84) lift += 2;
  if (support.strongest_driver_contribution >= 30) lift += 1;
  if (support.negative_suppressor_mass <= 1) lift += 1;
  if (support.negative_suppressor_mass <= 0.25) lift += 1;
  if (clean >= 0.4) lift += 1;
  if (row.production.timing_strength === "strong") lift += 1;
  if (row.production.timing_strength === "very_strong") lift += 2;

  return Math.min(98, Math.max(score, score + lift));
}

function v37CalibrationFor(
  variant: VariantId,
  region: RegionKey,
): RegionCalibration | null {
  if (variant === "curve_timing_selective_prime_v37_region_balanced_light") {
    return V37_REGION_CALIBRATION_LIGHT[region] ?? null;
  }
  if (variant === "curve_timing_selective_prime_v37_region_balanced_moderate") {
    return V37_REGION_CALIBRATION_MODERATE[region] ?? null;
  }
  if (
    variant === "curve_timing_selective_prime_v37_region_balanced_prime_gate"
  ) {
    return V37_REGION_CALIBRATION_PRIME_GATE[region] ?? null;
  }
  return null;
}

function regionalLiftAllowed(row: Omit<AuditRow, "candidates">): boolean {
  const support = row.condition_support;
  return row.production.reliability === "high" &&
    row.production.missing_variables.length === 0 &&
    row.production.data_gaps.length === 0 &&
    !row.shutdown_row &&
    !row.active_heavy_rain &&
    !row.recent_wet_rain &&
    !row.severe_movement_runoff_precip_row &&
    (!(row.moderate_suppressor_row || row.major_suppressor_row) ||
      row.trusted_suppressor_support) &&
    support.positive_driver_mass >= support.negative_suppressor_mass + 12 &&
    support.has_real_driver;
}

function applyV37RegionalLift(
  row: Omit<AuditRow, "candidates">,
  variant: VariantId,
  score: number,
): number {
  const calibration = v37CalibrationFor(variant, row.region);
  if (!calibration || !regionalLiftAllowed(row)) return score;
  const support = row.condition_support;
  let lifted = score;
  if (
    row.production.band !== "Tough" &&
    score >= 52 &&
    score < 65 &&
    support.surfaced_driver_count >= 1 &&
    (row.clean_support || row.strong_support || row.trusted_suppressor_support)
  ) {
    lifted += calibration.fairGoodLift;
  }
  if (
    score >= 76 &&
    score < 80 &&
    support.surfaced_driver_count >= 2 &&
    v36PrimeEligible(row, Math.max(80, lifted + calibration.primeLift))
  ) {
    lifted += calibration.primeLift;
  }
  if (
    variant === "curve_timing_selective_prime_v37_region_balanced_prime_gate" &&
    score === 79 &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= 65 &&
    support.negative_suppressor_mass <= 4.25 &&
    support.strongest_driver_contribution >= 18 &&
    v36PrimeEligible(row, 80)
  ) {
    lifted = Math.max(lifted, 80);
  }
  return lifted;
}

function isV38Variant(
  variant: VariantId,
): variant is keyof typeof V38_FLOORS {
  return variant in V38_FLOORS;
}

function v38SupportedFairFloorRejectionReasons(
  row: Omit<AuditRow, "candidates">,
  score: number,
  minScore = 56,
): string[] {
  const support = row.condition_support;
  const reasons: string[] = [];
  if (!STRUCTURALLY_PESSIMISTIC_REGIONS.has(row.region)) {
    reasons.push("region_not_targeted");
  }
  if (row.production.band !== "Fair") reasons.push("production_not_fair");
  if (row.production.reliability !== "high") reasons.push("low_reliability");
  if (row.production.missing_variables.length) {
    reasons.push("missing_variables");
  }
  if (row.production.data_gaps.length) reasons.push("data_gaps");
  if (row.shutdown_row) reasons.push("shutdown");
  if (row.active_heavy_rain) reasons.push("active_heavy_rain");
  if (row.recent_wet_rain) reasons.push("recent_wet_rain");
  if (row.severe_movement_runoff_precip_row) {
    reasons.push("severe_movement_runoff_precip");
  }
  if (
    (row.moderate_suppressor_row || row.major_suppressor_row) &&
    !row.trusted_suppressor_support &&
    !v38TrustedModerateSupport(row)
  ) {
    reasons.push("untrusted_suppressor");
  }
  if (support.surfaced_driver_count < 1) reasons.push("no_surfaced_driver");
  if (support.positive_driver_mass < support.negative_suppressor_mass + 10) {
    reasons.push("weak_positive_dominance");
  }
  if (!finalSupportGateAllowsGood(row) && !v38TrustedModerateSupport(row)) {
    reasons.push("support_gate_failed");
  }
  if (score < minScore) reasons.push("score_below_floor_window");
  if (score >= 65) reasons.push("already_good_or_better");
  return reasons;
}

function v38SupportedFairFloorEligible(
  row: Omit<AuditRow, "candidates">,
  score: number,
  calibration: RegionFloorCalibration,
): boolean {
  return v38SupportedFairFloorRejectionReasons(row, score, calibration.minScore)
        .length === 0 &&
    score >= calibration.minScore;
}

function applyV38SupportedFairFloor(
  row: Omit<AuditRow, "candidates">,
  variant: VariantId,
  score: number,
): number {
  if (!isV38Variant(variant)) return score;
  const calibration = V38_FLOORS[variant];
  let lifted = score;
  if (v38SupportedFairFloorEligible(row, score, calibration)) {
    lifted = Math.min(
      calibration.cap,
      Math.max(lifted, calibration.floor),
    );
  }
  if (
    calibration.primeTidy &&
    lifted >= 78 &&
    lifted < 80 &&
    row.condition_support.surfaced_driver_count >= 2 &&
    row.condition_support.positive_driver_mass >= 60 &&
    row.condition_support.negative_suppressor_mass <= 4.25 &&
    row.condition_support.strongest_driver_contribution >= 18 &&
    v36PrimeEligible(row, 80)
  ) {
    lifted = 80;
  }
  return lifted;
}

function isV39Variant(variant: VariantId): boolean {
  return variant === "v39_weight_rebalance_low_region_light" ||
    variant === "v39_temp_borderline_softening_light" ||
    variant === "v39_weight_plus_temp_light" ||
    variant === "v39_alaska_high_side_check";
}

function contributionByKey(
  row: Omit<AuditRow, "candidates">,
  key: ScoredVariableKey,
): ContributionSnapshot | null {
  return row.production.weighted_contributions.find((c) => c.key === key) ??
    null;
}

function noStructuralHardBlock(row: Omit<AuditRow, "candidates">): boolean {
  return row.production.reliability === "high" &&
    row.production.missing_variables.length === 0 &&
    row.production.data_gaps.length === 0 &&
    !row.shutdown_row &&
    !row.active_heavy_rain &&
    !row.recent_wet_rain &&
    !row.severe_movement_runoff_precip_row;
}

function borderlineTemperaturePenalty(
  row: Omit<AuditRow, "candidates">,
): boolean {
  const temp = row.production.normalized_variable_scores.temperature;
  if (!temp || row.severe_thermal_row) return false;
  return temp.final_score >= -1.05 && temp.final_score <= -0.25;
}

function v39WeightRebalanceDelta(row: Omit<AuditRow, "candidates">): number {
  if (!V39_LOW_SIDE_REGIONS.has(row.region) || !noStructuralHardBlock(row)) {
    return 0;
  }
  let delta = 0;
  const temp = contributionByKey(row, "temperature_condition");
  const wind = contributionByKey(row, "wind_condition");
  const light = contributionByKey(row, "light_cloud_condition");
  const tide = contributionByKey(row, "tide_current_movement");
  const runoff = contributionByKey(row, "runoff_flow_disruption");

  if (
    temp && temp.weighted_contribution < 0 && borderlineTemperaturePenalty(row)
  ) {
    delta += Math.min(3.2, Math.abs(temp.weighted_contribution) * 0.12);
  }
  for (const c of [wind, light, tide]) {
    if (c && c.weighted_contribution > 0) {
      delta += Math.min(1.1, c.weighted_contribution * 0.05);
    }
  }
  if (tide && tide.weighted_contribution < 0) {
    delta += Math.min(1.4, Math.abs(tide.weighted_contribution) * 0.08);
  }
  if (runoff && runoff.weighted_contribution < 0 && !row.recent_wet_rain) {
    delta += Math.min(0.8, Math.abs(runoff.weighted_contribution) * 0.05);
  }
  return Math.min(5, delta);
}

function v39TempSofteningDelta(row: Omit<AuditRow, "candidates">): number {
  if (
    !V39_LOW_SIDE_REGIONS.has(row.region) ||
    !noStructuralHardBlock(row) ||
    !borderlineTemperaturePenalty(row)
  ) {
    return 0;
  }
  const temp = contributionByKey(row, "temperature_condition");
  if (!temp || temp.weighted_contribution >= 0) return 0;
  const normalized = row.production.normalized_variable_scores.temperature;
  const lightBoost = normalized && normalized.final_score >= -0.65 ? 1.1 : 1;
  return Math.min(
    5.5,
    Math.abs(temp.weighted_contribution) * 0.18 * lightBoost,
  );
}

function v39AlaskaHighSideDelta(row: Omit<AuditRow, "candidates">): number {
  if (row.region !== "alaska" || !noStructuralHardBlock(row)) return 0;
  const temp = contributionByKey(row, "temperature_condition");
  if (!temp || temp.weighted_contribution <= 18) return 0;
  return -Math.min(3.5, (temp.weighted_contribution - 18) * 0.12);
}

function v39StructuralDelta(
  row: Omit<AuditRow, "candidates">,
  variant: VariantId,
): number {
  if (variant === "v39_weight_rebalance_low_region_light") {
    return v39WeightRebalanceDelta(row);
  }
  if (variant === "v39_temp_borderline_softening_light") {
    return v39TempSofteningDelta(row);
  }
  if (variant === "v39_weight_plus_temp_light") {
    return Math.min(
      7,
      v39WeightRebalanceDelta(row) + v39TempSofteningDelta(row),
    );
  }
  if (variant === "v39_alaska_high_side_check") {
    return v39AlaskaHighSideDelta(row);
  }
  return 0;
}

function isV40Variant(variant: VariantId): boolean {
  return variant === "v40_temp_table_underparity_light" ||
    variant === "v40_temp_table_underparity_moderate" ||
    variant === "v40_support_cap_trusted_temp" ||
    variant === "v40_temp_plus_support_cap" ||
    variant === "v40_alaska_temp_trim_light" ||
    isV41Variant(variant) ||
    isV42Variant(variant) ||
    isV43Variant(variant) ||
    isV44Variant(variant) ||
    isV45Variant(variant) ||
    isV46Variant(variant);
}

function isV41Variant(variant: VariantId): boolean {
  return variant === "v41_temp_mean_centering_light" ||
    variant === "v41_temp_mean_centering_moderate" ||
    variant === "v41_temp_table_knot_repair" ||
    variant === "v41_temp_plus_trusted_support" ||
    variant === "v41_prime_gate_clean" ||
    variant === "v41_alaska_high_side_diagnostic" ||
    isV42Variant(variant) ||
    isV43Variant(variant) ||
    isV45Variant(variant) ||
    isV46Variant(variant);
}

function isV42Variant(variant: VariantId): boolean {
  return variant === "v42_redflag_good_cap_light" ||
    variant === "v42_redflag_good_cap_moderate" ||
    variant === "v42_mainland_balanced" ||
    variant === "v42_florida_clean_prime_tail_diagnostic";
}

function isV43Variant(variant: VariantId): boolean {
  return variant === "v43_v41_replay" ||
    variant === "v43_runtime_prime_gate_clean" ||
    variant === "v43_runtime_good_cap_light" ||
    variant === "v43_runtime_good_cap_balanced" ||
    variant === "v43_florida_prime_debug";
}

function isV43RuntimeScoringVariant(variant: VariantId): boolean {
  return variant === "v43_runtime_prime_gate_clean" ||
    variant === "v43_runtime_good_cap_light" ||
    variant === "v43_runtime_good_cap_balanced" ||
    variant === "v43_florida_prime_debug" ||
    isV44Variant(variant) ||
    isV45Variant(variant) ||
    isV46Variant(variant);
}

function isV44Variant(variant: VariantId): boolean {
  return variant === "productionized_v44_severe_thermal_good_cap";
}

function isV45Variant(variant: VariantId): boolean {
  return variant === "v45_spread_curve_light" ||
    variant === "v45_spread_curve_moderate" ||
    variant === "v45_support_confidence_spread" ||
    variant === "v45_prime_gate_supported_widen" ||
    variant === "v45_aggressive_prime_8_diagnostic";
}

function isV45ProductionizableVariant(variant: VariantId): boolean {
  return variant === "v45_spread_curve_light" ||
    variant === "v45_spread_curve_moderate" ||
    variant === "v45_support_confidence_spread" ||
    variant === "v45_prime_gate_supported_widen";
}

function isV46Variant(variant: VariantId): boolean {
  return variant === "v46_low_prime_bridge_light" ||
    variant === "v46_low_prime_bridge_moderate" ||
    variant === "v46_middle_spread_no_floor_light" ||
    variant === "v46_middle_spread_no_floor_moderate" ||
    variant === "v46_combined_light" ||
    variant === "v46_aggressive_prime_6_8_diagnostic";
}

function isV46ProductionizableVariant(variant: VariantId): boolean {
  return variant === "v46_low_prime_bridge_light" ||
    variant === "v46_low_prime_bridge_moderate" ||
    variant === "v46_middle_spread_no_floor_light" ||
    variant === "v46_middle_spread_no_floor_moderate" ||
    variant === "v46_combined_light";
}

function scoreFromRawSum(rawSum: number): number {
  const score = Math.round(rawSum >= 0 ? 50 + rawSum / 3.2 : 50 + rawSum / 4);
  return Math.max(10, Math.min(100, score));
}

function surfacedFromContributions(
  contributions: ContributionSnapshot[],
  positive: boolean,
): ContributionSnapshot[] {
  const filtered = contributions.filter((c) =>
    positive
      ? c.weighted_contribution >= 6 && c.score >= 0.01
      : c.weighted_contribution <= -6 && c.score <= -0.01
  );
  return filtered
    .sort((a, b) =>
      positive
        ? b.weighted_contribution - a.weighted_contribution
        : a.weighted_contribution - b.weighted_contribution
    )
    .slice(0, 2);
}

function v40TempAdjustment(
  row: Omit<AuditRow, "candidates">,
  variant: VariantId,
): number {
  const temp = row.production.normalized_variable_scores.temperature;
  if (!temp) return 0;
  const underparity = V40_UNDERPARITY_REGIONS.has(row.region);
  const shockLike = Math.abs(temp.shock_adjustment ?? 0) >= 0.35 ||
    (temp.shock_label ?? "").toLowerCase().includes("shock");
  const blocked = row.severe_thermal_row ||
    shockLike ||
    row.active_heavy_rain ||
    row.recent_wet_rain ||
    row.shutdown_row ||
    row.production.missing_variables.length > 0 ||
    row.production.data_gaps.length > 0 ||
    row.severe_movement_runoff_precip_row;
  if (blocked) return 0;

  if (variant === "v40_alaska_temp_trim_light") {
    if (row.region !== "alaska" || temp.final_score <= 0.75) return 0;
    return -Math.min(0.22, (temp.final_score - 0.75) * 0.18);
  }
  if (variant === "v41_alaska_high_side_diagnostic") {
    if (row.region !== "alaska" || temp.final_score <= 0.65) return 0;
    return -Math.min(0.35, (temp.final_score - 0.65) * 0.22);
  }

  if (isV41Variant(variant)) {
    if (!V40_UNDERPARITY_REGIONS.has(row.region)) return 0;
    const noShock = Math.abs(temp.shock_adjustment ?? 0) < 0.2;
    const seasonalNormal = temp.final_score >= -1.55 &&
      temp.final_score <= 0.2;
    const stableThermal = noShock && seasonalNormal;
    if (!stableThermal) return 0;
    const target = variant === "v41_temp_mean_centering_light"
      ? 0.05
      : variant === "v41_temp_mean_centering_moderate"
      ? 0.25
      : variant === "v42_florida_clean_prime_tail_diagnostic" &&
          SOUTHEAST_PRIME_DIAGNOSTIC_REGIONS.has(row.region)
      ? 0.6
      : 0.45;
    const cap = variant === "v41_temp_mean_centering_light"
      ? 0.75
      : variant === "v41_temp_mean_centering_moderate"
      ? 1.05
      : 1.35;
    return Math.max(0, Math.min(cap, target - temp.final_score));
  }

  if (!underparity || temp.final_score < -1.05 || temp.final_score > -0.15) {
    return 0;
  }
  const seasonal = temp.final_score >= -0.6 ? 1 : 0.72;
  if (variant === "v40_temp_table_underparity_light") {
    return Math.min(0.28, Math.abs(temp.final_score) * 0.34 * seasonal);
  }
  if (
    variant === "v40_temp_table_underparity_moderate" ||
    variant === "v40_temp_plus_support_cap"
  ) {
    return Math.min(0.46, Math.abs(temp.final_score) * 0.52 * seasonal);
  }
  return 0;
}

function v40WeightFor(
  row: Omit<AuditRow, "candidates">,
  c: ContributionSnapshot,
  variant: VariantId,
): number {
  let weight = c.weight;
  if (
    (variant === "v40_temp_plus_support_cap" ||
      variant === "v41_temp_plus_trusted_support" ||
      variant === "v41_prime_gate_clean" ||
      isV42Variant(variant) ||
      isV43Variant(variant) ||
      isV44Variant(variant) ||
      isV45Variant(variant) ||
      isV46Variant(variant)) &&
    V40_UNDERPARITY_REGIONS.has(row.region) &&
    noStructuralHardBlock(row)
  ) {
    if (c.key === "temperature_condition" && c.score < 0) weight *= 0.88;
    if (
      (c.key === "wind_condition" || c.key === "light_cloud_condition" ||
        c.key === "tide_current_movement") &&
      c.score > 0
    ) {
      weight *= 1.05;
    }
  }
  return weight;
}

function adjustedNormalizedSnapshot(
  row: Omit<AuditRow, "candidates">,
  tempDelta: number,
): NormalizedSnapshot {
  const temp = row.production.normalized_variable_scores.temperature;
  return {
    ...row.production.normalized_variable_scores,
    temperature: temp
      ? {
        ...temp,
        final_score: Math.max(-2, Math.min(2, temp.final_score + tempDelta)),
      }
      : temp,
  };
}

function v40StructuralBase(
  row: Omit<AuditRow, "candidates">,
  variant: VariantId,
): {
  adjustedRow: Omit<AuditRow, "candidates">;
  rawSum: number;
  preCapScore: number;
  contributions: ContributionSnapshot[];
  drivers: ContributionSnapshot[];
  suppressors: ContributionSnapshot[];
  support: ConditionSupportDiagnostics;
  changeTypes: string[];
} {
  const tempDelta = v40TempAdjustment(row, variant);
  const normalized = adjustedNormalizedSnapshot(row, tempDelta);
  const contributions = row.production.weighted_contributions.map((c) => {
    const adjustedScore = c.key === "temperature_condition"
      ? (normalized.temperature?.final_score ?? c.score)
      : c.score;
    const adjustedWeight = v40WeightFor(row, c, variant);
    return {
      ...c,
      score: adjustedScore,
      weight: adjustedWeight,
      weighted_contribution: adjustedScore * adjustedWeight,
    };
  });
  const rawSum = contributions.reduce(
    (sum, c) => sum + c.weighted_contribution,
    0,
  );
  const preCapScore = scoreFromRawSum(rawSum);
  const drivers = surfacedFromContributions(contributions, true);
  const suppressors = surfacedFromContributions(contributions, false);
  const support = conditionSupport(drivers, suppressors, contributions);
  const thermalReasons = severeThermalReasons({
    production: { normalized_variable_scores: normalized },
  });
  const movementReasons = severeMovementRunoffPrecipReasons({
    production: { normalized_variable_scores: normalized },
  });
  const base: Omit<AuditRow, "candidates"> = {
    ...row,
    production: {
      ...row.production,
      score: preCapScore,
      band: bandFromScore(preCapScore),
      drivers,
      suppressors,
      weighted_contributions: contributions,
      normalized_variable_scores: normalized,
    },
    condition_support: support,
    clean_support: false,
    strong_support: false,
    trusted_suppressor_support: false,
    severe_thermal_row: thermalReasons.length > 0,
    severe_thermal_reasons: thermalReasons,
    severe_movement_runoff_precip_row: movementReasons.length > 0,
    severe_movement_runoff_precip_reasons: movementReasons,
    shutdown_row: row.active_heavy_rain || movementReasons.length > 0,
    shutdown_reasons: [],
    major_suppressor_row: support.strongest_suppressor_contribution <= -10,
    moderate_suppressor_row: support.strongest_suppressor_contribution <= -6,
  };
  const withShutdown = { ...base, shutdown_reasons: shutdownReasons(base) };
  const withSupport: Omit<AuditRow, "candidates"> = {
    ...withShutdown,
    clean_support: cleanSupport(withShutdown),
    strong_support: strongSupport(withShutdown),
    trusted_suppressor_support: trustedSuppressorSupport(withShutdown),
  };
  const adjustedRow = {
    ...withSupport,
    hard_cap_reasons: hardCapReasons(withSupport),
  };
  adjustedRow.hard_cap_row = adjustedRow.hard_cap_reasons.length > 0;
  const changeTypes = [
    ...(tempDelta !== 0 ? ["temp table"] : []),
    ...(
      variant === "v40_temp_plus_support_cap" ||
        variant === "v41_temp_plus_trusted_support" ||
        variant === "v41_prime_gate_clean" ||
        isV42Variant(variant) ||
        isV43Variant(variant) ||
        isV44Variant(variant) ||
        isV45Variant(variant) ||
        isV46Variant(variant)
        ? ["weights"]
        : []
    ),
    ...(
      variant === "v40_support_cap_trusted_temp" ||
        variant === "v40_temp_plus_support_cap" ||
        variant === "v41_temp_plus_trusted_support" ||
        variant === "v41_prime_gate_clean" ||
        isV42Variant(variant) ||
        isV43Variant(variant) ||
        isV44Variant(variant) ||
        isV45Variant(variant) ||
        isV46Variant(variant)
        ? ["cap policy", "support policy"]
        : []
    ),
    ...(isV45Variant(variant) || isV46Variant(variant)
      ? ["score curve policy", "Prime gate policy"]
      : []),
  ];
  return {
    adjustedRow,
    rawSum,
    preCapScore,
    contributions,
    drivers,
    suppressors,
    support,
    changeTypes,
  };
}

function v40TrustedTempSupport(row: Omit<AuditRow, "candidates">): boolean {
  const support = row.condition_support;
  const temp = contributionByKey(row, "temperature_condition");
  if (!temp || temp.weighted_contribution > -5) return false;
  return row.production.reliability === "high" &&
    row.production.missing_variables.length === 0 &&
    row.production.data_gaps.length === 0 &&
    !row.shutdown_row &&
    !row.active_heavy_rain &&
    !row.recent_wet_rain &&
    !row.severe_movement_runoff_precip_row &&
    !row.major_suppressor_row &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= support.negative_suppressor_mass + 18 &&
    support.positive_driver_mass >= 42 &&
    support.strongest_driver_contribution >= 14;
}

function applyV40Caps(
  adjustedRow: Omit<AuditRow, "candidates">,
  originalRow: Omit<AuditRow, "candidates">,
  score: number,
  variant: VariantId,
): number {
  let capped = score;
  const trustedTemp = (
    variant === "v40_support_cap_trusted_temp" ||
    variant === "v40_temp_plus_support_cap" ||
    variant === "v41_temp_plus_trusted_support" ||
    variant === "v41_prime_gate_clean" ||
    isV42Variant(variant) ||
    isV43Variant(variant) ||
    isV44Variant(variant) ||
    isV45Variant(variant) ||
    isV46Variant(variant)
  ) && v40TrustedTempSupport(adjustedRow);
  if (
    originalRow.production.missing_variables.length ||
    originalRow.production.data_gaps.length
  ) capped = Math.min(capped, 64);
  if (originalRow.production.reliability !== "high") {
    capped = Math.min(capped, 72);
  }
  if (originalRow.active_heavy_rain) capped = Math.min(capped, 55);
  if (originalRow.recent_wet_rain) {
    capped = originalRow.production.band === "Good" ||
        originalRow.production.band === "Prime"
      ? Math.min(capped, originalRow.production.score)
      : Math.min(capped, 64);
  }
  if (adjustedRow.shutdown_row && !originalRow.active_heavy_rain) {
    capped = Math.min(capped, 40);
  }
  if (adjustedRow.major_suppressor_row) capped = Math.min(capped, 69);
  if (
    adjustedRow.moderate_suppressor_row &&
    !adjustedRow.trusted_suppressor_support &&
    !trustedTemp
  ) {
    capped = Math.min(capped, 64);
  }
  if (trustedTemp && originalRow.production.band !== "Good") {
    capped = Math.min(capped, 69);
  }
  if (adjustedRow.severe_movement_runoff_precip_row) {
    capped = Math.min(capped, 69);
  }
  return capped;
}

function v42RedFlagGoodAllowed(
  row: Omit<AuditRow, "candidates">,
  adjustedRow: Omit<AuditRow, "candidates">,
  variant: VariantId,
): boolean {
  const support = adjustedRow.condition_support;
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  const base = support.surfaced_driver_count >= 2 &&
    adjustedRow.clean_support &&
    (adjustedRow.trusted_suppressor_support ||
      support.strongest_suppressor_contribution > -6) &&
    !adjustedRow.shutdown_row &&
    !row.recent_wet_rain &&
    !adjustedRow.severe_movement_runoff_precip_row;
  if (!base) return false;
  if (
    variant === "v42_redflag_good_cap_moderate" ||
    variant === "v42_mainland_balanced"
  ) {
    return dominance >= 18 &&
      support.positive_driver_mass >= 42 &&
      support.strongest_driver_contribution >= 14;
  }
  return dominance >= 10;
}

function v42FloridaPrimeDiagnosticEligible(
  row: Omit<AuditRow, "candidates">,
  adjustedRow: Omit<AuditRow, "candidates">,
  score: number,
): boolean {
  const support = adjustedRow.condition_support;
  const temp = contributionByKey(adjustedRow, "temperature_condition");
  return row.region === "florida" &&
    !RED_FLAG_ARCHETYPES.has(row.archetype) &&
    support.surfaced_driver_count >= 2 &&
    adjustedRow.clean_support &&
    !adjustedRow.major_suppressor_row &&
    (temp?.weighted_contribution ?? -999) >= -1.5 &&
    !adjustedRow.shutdown_row &&
    !row.active_heavy_rain &&
    !row.recent_wet_rain &&
    !adjustedRow.severe_movement_runoff_precip_row &&
    productionizablePrimeEligible(adjustedRow, Math.max(score, 80));
}

function v43RuntimeGoodCapBlocked(
  row: Omit<AuditRow, "candidates">,
  adjustedRow: Omit<AuditRow, "candidates">,
  variant: VariantId,
): boolean {
  if (
    variant !== "v43_runtime_good_cap_light" &&
    variant !== "v43_runtime_good_cap_balanced"
  ) {
    return false;
  }
  if (row.production.band !== "Poor" && row.production.band !== "Fair") {
    return false;
  }
  const support = adjustedRow.condition_support;
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  const untrustedSuppressor = (adjustedRow.moderate_suppressor_row ||
    adjustedRow.major_suppressor_row) &&
    !adjustedRow.trusted_suppressor_support &&
    !v40TrustedTempSupport(adjustedRow);
  const runtimeRisk = row.active_heavy_rain ||
    row.recent_wet_rain ||
    adjustedRow.severe_movement_runoff_precip_row ||
    adjustedRow.severe_thermal_row ||
    row.production.missing_variables.length > 0 ||
    row.production.data_gaps.length > 0;
  if (runtimeRisk || untrustedSuppressor) return true;
  if (variant === "v43_runtime_good_cap_balanced") {
    return support.surfaced_driver_count < 2 ||
      dominance < 14 ||
      support.strongest_driver_contribution < 14 ||
      (!adjustedRow.clean_support && !adjustedRow.trusted_suppressor_support);
  }
  return support.surfaced_driver_count < 2 ||
    dominance < 10 ||
    support.strongest_driver_contribution < 12;
}

function v44SevereThermalGoodCapBlocked(
  row: Omit<AuditRow, "candidates">,
  adjustedRow: Omit<AuditRow, "candidates">,
  score: number,
): boolean {
  if (row.production.band !== "Poor" && row.production.band !== "Fair") {
    return false;
  }
  if (score < 65 || !adjustedRow.severe_thermal_row) return false;
  const temp = contributionByKey(adjustedRow, "temperature_condition");
  const strongThermalSuppressor = (temp?.weighted_contribution ?? 0) <= -18 ||
    (adjustedRow.production.normalized_variable_scores.temperature
        ?.final_score ?? 0) <= -1.75;
  if (!strongThermalSuppressor) return false;

  const support = adjustedRow.condition_support;
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  const extraordinarilyCleanSupport = row.production.reliability === "high" &&
    row.production.missing_variables.length === 0 &&
    row.production.data_gaps.length === 0 &&
    !row.active_heavy_rain &&
    !row.recent_wet_rain &&
    !adjustedRow.shutdown_row &&
    !adjustedRow.severe_movement_runoff_precip_row &&
    !adjustedRow.moderate_suppressor_row &&
    !adjustedRow.major_suppressor_row &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= 70 &&
    dominance >= 40 &&
    support.strongest_driver_contribution >= 24 &&
    support.negative_suppressor_mass <= 4;
  return !extraordinarilyCleanSupport;
}

function v45HardSpreadBlock(row: Omit<AuditRow, "candidates">): boolean {
  return row.shutdown_row ||
    row.active_heavy_rain ||
    row.recent_wet_rain ||
    row.severe_movement_runoff_precip_row ||
    row.production.missing_variables.length > 0 ||
    row.production.data_gaps.length > 0 ||
    row.production.reliability !== "high";
}

function v45StrongDriverSupport(row: Omit<AuditRow, "candidates">): boolean {
  const support = row.condition_support;
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  return support.surfaced_driver_count >= 2 &&
    dominance >= 14 &&
    support.strongest_driver_contribution >= 14 &&
    (row.clean_support || row.strong_support || row.trusted_suppressor_support);
}

function v45StrongSuppressorSupport(
  row: Omit<AuditRow, "candidates">,
): boolean {
  const support = row.condition_support;
  return support.surfaced_suppressor_count >= 1 &&
    support.negative_suppressor_mass >= 10 &&
    !row.trusted_suppressor_support &&
    support.positive_driver_mass < support.negative_suppressor_mass + 10;
}

function v45ScoreSpread(
  adjustedRow: Omit<AuditRow, "candidates">,
  score: number,
  rawSum: number,
  variant: VariantId,
): number {
  if (!isV45Variant(variant) || v45HardSpreadBlock(adjustedRow)) return score;
  const support = adjustedRow.condition_support;
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  const strongDrivers = v45StrongDriverSupport(adjustedRow);
  const strongSuppressors = v45StrongSuppressorSupport(adjustedRow);
  const mixedLowSupport = !strongDrivers && !strongSuppressors;
  if (
    adjustedRow.severe_thermal_row &&
    (score >= 60 || adjustedRow.production.band === "Fair")
  ) {
    return score;
  }

  const strength = variant === "v45_spread_curve_light"
    ? 0.09
    : variant === "v45_spread_curve_moderate"
    ? 0.15
    : variant === "v45_support_confidence_spread"
    ? 0.18
    : variant === "v45_prime_gate_supported_widen"
    ? 0.13
    : 0.24;
  const maxLift = variant === "v45_spread_curve_light"
    ? 3
    : variant === "v45_spread_curve_moderate"
    ? 5
    : variant === "v45_support_confidence_spread"
    ? 6
    : variant === "v45_prime_gate_supported_widen"
    ? 5
    : 9;
  let spread = 0;
  if (score >= 50 && strongDrivers) {
    spread = Math.min(maxLift, Math.round(Math.max(0, rawSum) * strength));
    if (dominance >= 28) spread += variant === "v45_spread_curve_light" ? 0 : 1;
    if (support.positive_driver_mass >= 70) {
      spread += variant === "v45_aggressive_prime_8_diagnostic" ? 3 : 1;
    }
  } else if (
    score >= 50 &&
    score <= 58 &&
    strongSuppressors &&
    variant !== "v45_spread_curve_light"
  ) {
    spread = -Math.min(
      variant === "v45_aggressive_prime_8_diagnostic" ? 5 : 3,
      Math.round(Math.abs(Math.min(0, rawSum)) * 0.12) + 1,
    );
  }

  if (mixedLowSupport && variant === "v45_support_confidence_spread") {
    spread = 0;
  }
  if (adjustedRow.moderate_suppressor_row || adjustedRow.major_suppressor_row) {
    spread = Math.min(spread, adjustedRow.trusted_suppressor_support ? 1 : 0);
  }
  return Math.max(36, Math.min(99, score + spread));
}

function v45SupportedPrimeWiden(
  adjustedRow: Omit<AuditRow, "candidates">,
  score: number,
  variant: VariantId,
): number {
  if (
    variant !== "v45_prime_gate_supported_widen" &&
    variant !== "v45_aggressive_prime_8_diagnostic"
  ) {
    return score;
  }
  if (score < 75 || score >= 80 || v45HardSpreadBlock(adjustedRow)) {
    return score;
  }
  const support = adjustedRow.condition_support;
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  if (
    adjustedRow.severe_thermal_row ||
    adjustedRow.moderate_suppressor_row ||
    adjustedRow.major_suppressor_row ||
    support.surfaced_driver_count < 2 ||
    support.positive_driver_mass < 62 ||
    support.negative_suppressor_mass > 4 ||
    support.strongest_driver_contribution < 16 ||
    dominance < 28
  ) return score;
  const targetLift = variant === "v45_aggressive_prime_8_diagnostic" ? 6 : 3;
  const widened = score + targetLift;
  return v43RuntimePrimeEligible(adjustedRow, widened)
    ? Math.min(99, widened)
    : score;
}

function v45PrimeCrossAllowed(
  adjustedRow: Omit<AuditRow, "candidates">,
  variant: VariantId,
): boolean {
  const support = adjustedRow.condition_support;
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  const clean = normalizedCleanliness(adjustedRow);
  const positiveMass = variant === "v45_aggressive_prime_8_diagnostic"
    ? 74
    : 82;
  const dominanceMin = variant === "v45_aggressive_prime_8_diagnostic"
    ? 36
    : 44;
  const strongestMin = variant === "v45_aggressive_prime_8_diagnostic"
    ? 22
    : 26;
  return v43RuntimePrimeEligible(adjustedRow, 80) &&
    !adjustedRow.severe_thermal_row &&
    !adjustedRow.moderate_suppressor_row &&
    !adjustedRow.major_suppressor_row &&
    support.surfaced_driver_count >= 2 &&
    support.positive_driver_mass >= positiveMass &&
    support.negative_suppressor_mass <= 2 &&
    support.strongest_driver_contribution >= strongestMin &&
    dominance >= dominanceMin &&
    clean > -0.1;
}

function v46PrimeEligibleExceptScore(
  adjustedRow: Omit<AuditRow, "candidates">,
  score: number,
): boolean {
  return score < 80 &&
    v43RuntimePrimeDisqualificationReasons(adjustedRow, score).length === 0;
}

function v46LowPrimeBridge(
  adjustedRow: Omit<AuditRow, "candidates">,
  score: number,
  variant: VariantId,
): number {
  if (
    variant !== "v46_low_prime_bridge_light" &&
    variant !== "v46_low_prime_bridge_moderate" &&
    variant !== "v46_combined_light" &&
    variant !== "v46_aggressive_prime_6_8_diagnostic"
  ) {
    return score;
  }
  if (v45HardSpreadBlock(adjustedRow) || adjustedRow.severe_thermal_row) {
    return score;
  }
  const minScore = variant === "v46_low_prime_bridge_light"
    ? 78
    : variant === "v46_aggressive_prime_6_8_diagnostic"
    ? 74
    : 75;
  if (score < minScore || score >= 80) return score;
  if (!v46PrimeEligibleExceptScore(adjustedRow, score)) return score;
  const support = adjustedRow.condition_support;
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  const positiveMass = variant === "v46_low_prime_bridge_light"
    ? 64
    : variant === "v46_aggressive_prime_6_8_diagnostic"
    ? 58
    : 60;
  const dominanceMin = variant === "v46_low_prime_bridge_light"
    ? 24
    : variant === "v46_aggressive_prime_6_8_diagnostic"
    ? 18
    : 22;
  const strongestMin = variant === "v46_low_prime_bridge_light"
    ? 16
    : variant === "v46_aggressive_prime_6_8_diagnostic"
    ? 14
    : 16;
  if (
    support.surfaced_driver_count < 2 ||
    !adjustedRow.clean_support ||
    support.positive_driver_mass < positiveMass ||
    support.negative_suppressor_mass >
      (variant === "v46_aggressive_prime_6_8_diagnostic" ? 3.5 : 2.5) ||
    support.strongest_driver_contribution < strongestMin ||
    (support.positive_driver_mass < 68 &&
      support.strongest_driver_contribution >
        support.positive_driver_mass * 0.72) ||
    dominance < dominanceMin ||
    normalizedCleanliness(adjustedRow) <= -0.25
  ) {
    return score;
  }
  return score + (80 - score);
}

function v46MiddleSpread(
  adjustedRow: Omit<AuditRow, "candidates">,
  score: number,
  variant: VariantId,
): number {
  if (
    variant !== "v46_middle_spread_no_floor_light" &&
    variant !== "v46_middle_spread_no_floor_moderate" &&
    variant !== "v46_combined_light" &&
    variant !== "v46_aggressive_prime_6_8_diagnostic"
  ) {
    return score;
  }
  if (v45HardSpreadBlock(adjustedRow) || adjustedRow.severe_thermal_row) {
    return score;
  }
  const support = adjustedRow.condition_support;
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  const moderate = variant === "v46_middle_spread_no_floor_moderate" ||
    variant === "v46_aggressive_prime_6_8_diagnostic";
  const combined = variant === "v46_combined_light";
  let spread = 0;
  if (
    score >= 59 &&
    score < 65 &&
    v45StrongDriverSupport(adjustedRow) &&
    dominance >= (moderate ? 18 : 14)
  ) {
    spread += moderate ? 4 : combined ? 3 : 2;
    if (support.positive_driver_mass >= 58) spread += moderate ? 2 : 1;
  }
  if (
    score >= 50 &&
    score <= 58 &&
    v45StrongSuppressorSupport(adjustedRow)
  ) {
    spread -= moderate ? 3 : 2;
    if (support.negative_suppressor_mass >= 20) spread -= moderate ? 2 : 1;
  }
  if (adjustedRow.moderate_suppressor_row || adjustedRow.major_suppressor_row) {
    spread = Math.min(spread, adjustedRow.trusted_suppressor_support ? 1 : 0);
  }
  return score + spread;
}

function v40CandidateScore(
  row: Omit<AuditRow, "candidates">,
  variant: VariantId,
): CandidateResult {
  const structural = v40StructuralBase(row, variant);
  const adjustedRow = structural.adjustedRow;
  let score = structural.preCapScore;
  if (!adjustedRow.shutdown_row) {
    score += curveLiftV3(score);
    if (adjustedRow.condition_support.has_real_driver) {
      let lift = timingLiftV3(row.production.timing_strength);
      if (
        adjustedRow.moderate_suppressor_row || adjustedRow.major_suppressor_row
      ) {
        lift = adjustedRow.trusted_suppressor_support ||
            v40TrustedTempSupport(adjustedRow)
          ? Math.min(lift, 1)
          : 0;
      }
      score += lift;
    }
    if (
      score >= 65 &&
      row.production.band !== "Good" &&
      !adjustedRow.clean_support &&
      !adjustedRow.strong_support &&
      !adjustedRow.trusted_suppressor_support &&
      !v40TrustedTempSupport(adjustedRow)
    ) {
      score = Math.min(score, 64);
    }
    if (primeBumpEligibleV35Base(adjustedRow, score)) score += 3;
    if (score < 80 && primeBumpEligibleV35TailPlus(adjustedRow, score)) {
      score += 3;
    }
    if (
      isV43RuntimeScoringVariant(variant)
        ? !v43RuntimePrimeEligible(adjustedRow, score)
        : !productionizablePrimeEligible(adjustedRow, score)
    ) {
      score = Math.min(score, 79);
    }
    if (isV45Variant(variant)) {
      const beforeV45 = score;
      score = v45ScoreSpread(adjustedRow, score, structural.rawSum, variant);
      score = v45SupportedPrimeWiden(adjustedRow, score, variant);
      if (
        beforeV45 < 80 &&
        score >= 80 &&
        !v45PrimeCrossAllowed(adjustedRow, variant)
      ) {
        score = 79;
      }
    }
    if (
      isV43RuntimeScoringVariant(variant)
        ? !v43RuntimePrimeEligible(adjustedRow, score)
        : !productionizablePrimeEligible(adjustedRow, score)
    ) {
      score = Math.min(score, 79);
    }
    if (isV46Variant(variant)) {
      const beforeV46 = score;
      score = v46MiddleSpread(adjustedRow, score, variant);
      score = v46LowPrimeBridge(adjustedRow, score, variant);
      if (
        beforeV46 < 80 &&
        score >= 80 &&
        !v46PrimeEligibleExceptScore(adjustedRow, beforeV46)
      ) {
        score = 79;
      }
      if (!v43RuntimePrimeEligible(adjustedRow, score)) {
        score = Math.min(score, 79);
      }
    }
    if (
      (variant === "v41_prime_gate_clean" ||
        variant === "v43_v41_replay" ||
        isV42Variant(variant)) &&
      (RED_FLAG_ARCHETYPES.has(row.archetype) ||
        adjustedRow.condition_support.surfaced_driver_count < 2)
    ) {
      score = Math.min(score, 79);
    }
    if (
      variant === "v42_florida_clean_prime_tail_diagnostic" &&
      score >= 78 &&
      score < 80 &&
      v42FloridaPrimeDiagnosticEligible(row, adjustedRow, score)
    ) {
      score = 80;
    }
    score = isV43RuntimeScoringVariant(variant)
      ? v43RuntimeContinuousTailScore(adjustedRow, score)
      : productionizableContinuousTailScore(adjustedRow, score);
    if (
      isV43RuntimeScoringVariant(variant)
        ? !v43RuntimePrimeEligible(adjustedRow, score)
        : !productionizablePrimeEligible(adjustedRow, score)
    ) {
      score = Math.min(score, 79);
    }
    if (
      (variant === "v41_prime_gate_clean" ||
        variant === "v43_v41_replay" ||
        isV42Variant(variant)) &&
      (RED_FLAG_ARCHETYPES.has(row.archetype) ||
        adjustedRow.condition_support.surfaced_driver_count < 2)
    ) {
      score = Math.min(score, 79);
    }
    if (
      isV42Variant(variant) &&
      RED_FLAG_ARCHETYPES.has(row.archetype) &&
      score >= 65 &&
      !v42RedFlagGoodAllowed(row, adjustedRow, variant)
    ) {
      score = 64;
    }
    if (
      score >= 65 &&
      v43RuntimeGoodCapBlocked(row, adjustedRow, variant)
    ) {
      score = 64;
    }
    if (
      variant === "productionized_v44_severe_thermal_good_cap" &&
      v44SevereThermalGoodCapBlocked(row, adjustedRow, score)
    ) {
      score = 64;
    }
  }
  score = Math.round(
    Math.max(10, Math.min(100, applyV40Caps(adjustedRow, row, score, variant))),
  );
  if (!adjustedRow.shutdown_row && score < row.production.score) {
    score = row.production.score;
  }
  const band = bandFromScore(score);
  const guardrailRow: Omit<AuditRow, "candidates"> = {
    ...adjustedRow,
    production: {
      ...adjustedRow.production,
      score: row.production.score,
      band: row.production.band,
      activity_tier: row.production.activity_tier,
    },
  };
  return {
    score,
    band,
    score_delta: score - row.production.score,
    activity_tier: activityTier(score),
    report_copy_needs_regeneration: band !== row.production.band,
    guardrail_violations: guardrailViolations({
      row: guardrailRow,
      score,
      variant,
    }),
    structural: {
      adjusted_raw_sum: Number(structural.rawSum.toFixed(3)),
      adjusted_pre_cap_score: structural.preCapScore,
      adjusted_weighted_contributions: structural.contributions,
      adjusted_drivers: structural.drivers,
      adjusted_suppressors: structural.suppressors,
      adjusted_support: structural.support,
      adjusted_clean_support: adjustedRow.clean_support,
      adjusted_strong_support: adjustedRow.strong_support,
      adjusted_trusted_support: adjustedRow.trusted_suppressor_support ||
        v40TrustedTempSupport(adjustedRow),
      direct_score_delta_used: false,
      productionizable_change_types: structural.changeTypes.length
        ? structural.changeTypes
        : ["diagnostic structural scoring"],
    },
  };
}

function candidateScore(
  row: Omit<AuditRow, "candidates">,
  variant: VariantId,
): CandidateResult {
  if (isV40Variant(variant)) return v40CandidateScore(row, variant);
  const productionScore = row.production.score;
  const noLift = row.shutdown_row;
  const structuralDelta = v39StructuralDelta(row, variant);
  let score = Math.round(productionScore + structuralDelta);
  if (!noLift) {
    const curveLift = curveLiftV3(score);
    score += curveLift;

    if (
      productionScore < 65 &&
      score >= 65 &&
      !row.clean_support &&
      !row.trusted_suppressor_support
    ) score = 64;

    if (
      variant !== "curve_clean_floor_v3" &&
      row.condition_support.has_real_driver
    ) {
      let lift = timingLiftV3(row.production.timing_strength);
      if (row.moderate_suppressor_row || row.major_suppressor_row) {
        lift = row.trusted_suppressor_support ? Math.min(lift, 1) : 0;
      }
      const withTiming = score + lift;
      if (
        lift > 0 &&
        wouldUpgradeToGoodOrPrime(row.production.band, withTiming) &&
        (row.moderate_suppressor_row || row.major_suppressor_row) &&
        !row.trusted_suppressor_support
      ) {
        score = Math.min(score, 64);
      } else {
        score = withTiming;
      }
    }

    if (
      row.severe_thermal_row &&
      wouldUpgradeToGoodOrPrime(row.production.band, score) &&
      !row.clean_support &&
      !row.trusted_suppressor_support
    ) {
      score = Math.min(score, 64);
    }

    if (
      variant === "curve_timing_selective_prime_v3" &&
      primeEligible(row, score)
    ) {
      score += 3;
    }
    if (
      (variant === "curve_timing_selective_prime_v32" ||
        variant === "curve_timing_selective_prime_v33_tail_only" ||
        variant === "curve_timing_selective_prime_v33_tail_plus" ||
        variant === "curve_timing_selective_prime_v34_continuous_tail" ||
        variant === "curve_timing_selective_prime_v34_continuous_tail_plus") &&
      primeBumpEligibleV32(row, score)
    ) {
      score += 3;
    }
    if (
      variant ===
        "curve_timing_selective_prime_v35_productionizable_tail_plus" &&
      primeBumpEligibleV35Base(row, score)
    ) {
      score += 3;
    }
    if (
      (variant ===
          "curve_timing_selective_prime_v36_minor_negative_tail_plus" ||
        variant === "curve_timing_selective_prime_v36_minor_negative_floor" ||
        variant === "curve_timing_selective_prime_v37_region_balanced_light" ||
        variant ===
          "curve_timing_selective_prime_v37_region_balanced_moderate" ||
        variant ===
          "curve_timing_selective_prime_v37_region_balanced_prime_gate" ||
        isV39Variant(variant) ||
        isV38Variant(variant)) &&
      primeBumpEligibleV35Base(row, score)
    ) {
      score += 3;
    }
    if (
      variant === "curve_timing_selective_prime_v33_tail_plus" &&
      score < 80 &&
      primeBumpEligibleV33TailPlus(row, score)
    ) {
      score += 3;
    }
    if (
      variant === "curve_timing_selective_prime_v34_continuous_tail_plus" &&
      score < 80 &&
      primeBumpEligibleV34TailPlus(row, score)
    ) {
      score += 3;
    }
    if (
      variant ===
        "curve_timing_selective_prime_v35_productionizable_tail_plus" &&
      score < 80 &&
      primeBumpEligibleV35TailPlus(row, score)
    ) {
      score += 3;
    }
    if (
      (variant ===
          "curve_timing_selective_prime_v36_minor_negative_tail_plus" ||
        variant === "curve_timing_selective_prime_v36_minor_negative_floor" ||
        variant === "curve_timing_selective_prime_v37_region_balanced_light" ||
        variant ===
          "curve_timing_selective_prime_v37_region_balanced_moderate" ||
        variant ===
          "curve_timing_selective_prime_v37_region_balanced_prime_gate" ||
        isV39Variant(variant) ||
        isV38Variant(variant)) &&
      score < 80 &&
      primeBumpEligibleV36TailPlus(row, score)
    ) {
      score += 3;
    }
    if (
      variant === "curve_timing_selective_prime_v36_minor_negative_floor" &&
      score === 79 &&
      v36PrimeEligible(row, 80) &&
      row.condition_support.positive_driver_mass >= 75 &&
      row.condition_support.negative_suppressor_mass <= 4.25 &&
      row.condition_support.strongest_driver_contribution >= 18
    ) {
      score = 80;
    }
    score = applyV37RegionalLift(row, variant, score);
    score = applyV38SupportedFairFloor(row, variant, score);

    const preCapScore = score;
    const canReachPrime = variant ===
        "curve_timing_selective_prime_v35_productionizable_tail_plus"
      ? productionizablePrimeEligible(row, preCapScore)
      : variant ===
            "curve_timing_selective_prime_v36_minor_negative_tail_plus" ||
          variant === "curve_timing_selective_prime_v36_minor_negative_floor" ||
          variant ===
            "curve_timing_selective_prime_v37_region_balanced_light" ||
          variant ===
            "curve_timing_selective_prime_v37_region_balanced_moderate" ||
          variant ===
            "curve_timing_selective_prime_v37_region_balanced_prime_gate" ||
          isV39Variant(variant) ||
          isV38Variant(variant)
      ? v36PrimeEligible(row, preCapScore)
      : primeEligible(row, preCapScore);
    const variantAllowsPrime = variant === "curve_timing_selective_prime_v3" ||
      variant === "curve_timing_selective_prime_v31" ||
      variant === "curve_timing_selective_prime_v32" ||
      variant === "curve_timing_selective_prime_v33_tail_only" ||
      variant === "curve_timing_selective_prime_v33_tail_plus" ||
      variant === "curve_timing_selective_prime_v34_continuous_tail" ||
      variant === "curve_timing_selective_prime_v34_continuous_tail_plus" ||
      variant ===
        "curve_timing_selective_prime_v35_productionizable_tail_plus" ||
      variant === "curve_timing_selective_prime_v36_minor_negative_tail_plus" ||
      variant === "curve_timing_selective_prime_v36_minor_negative_floor" ||
      variant === "curve_timing_selective_prime_v37_region_balanced_light" ||
      variant === "curve_timing_selective_prime_v37_region_balanced_moderate" ||
      variant ===
        "curve_timing_selective_prime_v37_region_balanced_prime_gate" ||
      isV39Variant(variant) ||
      isV38Variant(variant);
    if (!variantAllowsPrime || !canReachPrime) score = Math.min(score, 79);

    if (
      (variant === "curve_timing_selective_prime_v31" ||
        variant === "curve_timing_selective_prime_v32" ||
        variant === "curve_timing_selective_prime_v33_tail_only" ||
        variant === "curve_timing_selective_prime_v33_tail_plus" ||
        variant === "curve_timing_selective_prime_v34_continuous_tail" ||
        variant === "curve_timing_selective_prime_v34_continuous_tail_plus" ||
        variant ===
          "curve_timing_selective_prime_v35_productionizable_tail_plus" ||
        variant ===
          "curve_timing_selective_prime_v36_minor_negative_tail_plus" ||
        variant === "curve_timing_selective_prime_v36_minor_negative_floor" ||
        variant === "curve_timing_selective_prime_v37_region_balanced_light" ||
        variant ===
          "curve_timing_selective_prime_v37_region_balanced_moderate" ||
        variant ===
          "curve_timing_selective_prime_v37_region_balanced_prime_gate" ||
        isV39Variant(variant) ||
        isV38Variant(variant)) &&
      wouldUpgradeToGoodOrPrime(row.production.band, score) &&
      ((!finalSupportGateAllowsGood(row) &&
        !(isV38Variant(variant) && v38TrustedModerateSupport(row))) ||
        row.condition_support.surfaced_driver_count === 0)
    ) {
      score = Math.min(score, 64);
    }
    if (
      variant === "curve_timing_selective_prime_v33_tail_only" ||
      variant === "curve_timing_selective_prime_v33_tail_plus"
    ) {
      score = eliteTailScore(row, score);
    }
    if (
      variant === "curve_timing_selective_prime_v34_continuous_tail" ||
      variant === "curve_timing_selective_prime_v34_continuous_tail_plus"
    ) {
      score = continuousTailScore(row, score);
    }
    if (
      variant === "curve_timing_selective_prime_v35_productionizable_tail_plus"
    ) {
      score = productionizableContinuousTailScore(row, score);
    }
    if (
      variant === "curve_timing_selective_prime_v36_minor_negative_tail_plus" ||
      variant === "curve_timing_selective_prime_v36_minor_negative_floor" ||
      variant === "curve_timing_selective_prime_v37_region_balanced_light" ||
      variant === "curve_timing_selective_prime_v37_region_balanced_moderate" ||
      variant ===
        "curve_timing_selective_prime_v37_region_balanced_prime_gate" ||
      isV39Variant(variant) ||
      isV38Variant(variant)
    ) {
      score = v36ContinuousTailScore(row, score);
    }
  }
  score = Math.round(
    Math.max(10, Math.min(100, applyCaps(row, score, variant))),
  );
  if (
    (row.major_suppressor_row || row.moderate_suppressor_row) &&
    (row.production.band === "Good" || row.production.band === "Prime")
  ) {
    score = Math.min(score, productionScore);
  }
  if (!row.shutdown_row && score < productionScore) score = productionScore;
  const band = bandFromScore(score);
  return {
    score,
    band,
    score_delta: score - productionScore,
    activity_tier: activityTier(score),
    report_copy_needs_regeneration: band !== row.production.band,
    guardrail_violations: guardrailViolations({ row, score, variant }),
  };
}

function buildAuditRowFromRequest(
  req: SharedEngineRequest,
  archetype: ArchetypeId,
  waterClarity: WaterClarity,
): AuditRow {
  const analysis = analyzeSharedConditions(req, { scoreMode: "legacy" });
  const report = runHowFishingReport(req);
  const drivers = analysis.scored.drivers.map(contributionSnapshot);
  const suppressors = analysis.scored.suppressors.map(contributionSnapshot);
  const weightedContributions = analysis.scored.contributions.map(
    contributionSnapshot,
  );
  const normalizedVariableScores: NormalizedSnapshot = {
    temperature: temperatureSnapshot(analysis.norm.normalized.temperature),
    pressure_regime: variableSnapshot(analysis.norm.normalized.pressure_regime),
    wind_condition: variableSnapshot(analysis.norm.normalized.wind_condition),
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
  };
  const support = conditionSupport(drivers, suppressors, weightedContributions);
  const thermalReasons = severeThermalReasons({
    production: { normalized_variable_scores: normalizedVariableScores },
  });
  const movementRunoffPrecipReasons = severeMovementRunoffPrecipReasons({
    production: { normalized_variable_scores: normalizedVariableScores },
  });
  const activeHeavyRain = Boolean(
    req.environment.active_precip_now &&
      (req.environment.precip_rate_now_in_per_hr ?? 0) >= 0.05,
  );
  const recentWetRain = (req.environment.precip_72h_in ?? 0) >= 1.0 ||
    (req.environment.precip_7d_in ?? 0) >= 2.0 ||
    (analysis.norm.normalized.runoff_flow_disruption?.score ?? 0) <= -1;
  const base: Omit<AuditRow, "candidates"> = {
    region: req.region_key,
    month: Number.parseInt(req.local_date.slice(5, 7), 10),
    context: req.context,
    archetype,
    water_clarity: waterClarity,
    runtime_environment: {
      current_speed_knots_max: req.environment.current_speed_knots_max ?? null,
    },
    production: {
      score: analysis.scored.score,
      band: analysis.scored.band,
      reliability: analysis.norm.reliability,
      activity_tier: activityTier(analysis.scored.score),
      timing_strength: analysis.timing.timing_strength ?? null,
      drivers,
      suppressors,
      weighted_contributions: weightedContributions,
      normalized_variable_scores: normalizedVariableScores,
      missing_variables: analysis.norm.missing_variables,
      data_gaps: analysis.norm.data_gaps,
      report_surface: {
        summary_line: report.summary_line,
        actionable_tip: report.actionable_tip,
        timing_insight: report.timing_insight ?? null,
        solunar_note: report.solunar_note ?? null,
        driver_labels: report.drivers.map((driver) => driver.label),
        suppressor_labels: report.suppressors.map((suppressor) =>
          suppressor.label
        ),
      },
    },
    productionized_actual: {
      score: report.score,
      band: report.band,
      activity_tier: activityTier(report.score),
      driver_variables: report.drivers.map((driver) => driver.variable),
      suppressor_variables: report.suppressors.map((suppressor) =>
        suppressor.variable
      ),
      driver_labels: report.drivers.map((driver) => driver.label),
      suppressor_labels: report.suppressors.map((suppressor) =>
        suppressor.label
      ),
    },
    condition_support: support,
    clean_support: false,
    strong_support: false,
    trusted_suppressor_support: false,
    hard_cap_row: false,
    hard_cap_reasons: [],
    shutdown_row: activeHeavyRain || movementRunoffPrecipReasons.length > 0,
    shutdown_reasons: [],
    severe_thermal_row: thermalReasons.length > 0,
    severe_thermal_reasons: thermalReasons,
    severe_movement_runoff_precip_row: movementRunoffPrecipReasons.length > 0,
    severe_movement_runoff_precip_reasons: movementRunoffPrecipReasons,
    major_suppressor_row: support.strongest_suppressor_contribution <= -10,
    moderate_suppressor_row: support.strongest_suppressor_contribution <= -6,
    active_heavy_rain: activeHeavyRain,
    recent_wet_rain: recentWetRain,
  };
  const withShutdown: Omit<AuditRow, "candidates"> = {
    ...base,
    shutdown_reasons: shutdownReasons(base),
  };
  const withSupport: Omit<AuditRow, "candidates"> = {
    ...withShutdown,
    clean_support: cleanSupport(withShutdown),
    strong_support: strongSupport(withShutdown),
    trusted_suppressor_support: trustedSuppressorSupport(withShutdown),
  };
  const hardReasons = hardCapReasons(withSupport);
  const withFlags: Omit<AuditRow, "candidates"> = {
    ...withSupport,
    hard_cap_row: hardReasons.length > 0,
    hard_cap_reasons: hardReasons,
  };
  return {
    ...withFlags,
    candidates: Object.fromEntries(
      VARIANTS.map((variant) => [variant, candidateScore(withFlags, variant)]),
    ) as Record<VariantId, CandidateResult>,
  };
}

function buildRows(): AuditRow[] {
  const rows: AuditRow[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of CONTEXTS) {
        for (const archetype of ARCHETYPES) {
          const req = buildRequest(region, month, context, archetype);
          const analysis = analyzeSharedConditions(req, {
            scoreMode: "legacy",
          });
          const report = runHowFishingReport(req);
          for (const waterClarity of WATER_CLARITIES) {
            const drivers = analysis.scored.drivers.map(contributionSnapshot);
            const suppressors = analysis.scored.suppressors.map(
              contributionSnapshot,
            );
            const weightedContributions = analysis.scored.contributions.map(
              contributionSnapshot,
            );
            const normalizedVariableScores: NormalizedSnapshot = {
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
            };
            const support = conditionSupport(
              drivers,
              suppressors,
              weightedContributions,
            );
            const thermalReasons = severeThermalReasons({
              production: {
                normalized_variable_scores: normalizedVariableScores,
              },
            });
            const movementRunoffPrecipReasons =
              severeMovementRunoffPrecipReasons({
                production: {
                  normalized_variable_scores: normalizedVariableScores,
                },
              });
            const activeHeavyRain = Boolean(
              req.environment.active_precip_now &&
                (req.environment.precip_rate_now_in_per_hr ?? 0) >= 0.05,
            );
            const recentWetRain = (req.environment.precip_72h_in ?? 0) >= 1.0 ||
              (req.environment.precip_7d_in ?? 0) >= 2.0 ||
              (analysis.norm.normalized.runoff_flow_disruption?.score ?? 0) <=
                -1;
            const base: Omit<AuditRow, "candidates"> = {
              region,
              month,
              context,
              archetype: archetype.id,
              water_clarity: waterClarity,
              runtime_environment: {
                current_speed_knots_max:
                  req.environment.current_speed_knots_max ?? null,
              },
              production: {
                score: analysis.scored.score,
                band: analysis.scored.band,
                reliability: analysis.norm.reliability,
                activity_tier: activityTier(analysis.scored.score),
                timing_strength: analysis.timing.timing_strength ?? null,
                drivers,
                suppressors,
                weighted_contributions: weightedContributions,
                normalized_variable_scores: normalizedVariableScores,
                missing_variables: analysis.norm.missing_variables,
                data_gaps: analysis.norm.data_gaps,
                report_surface: {
                  summary_line: report.summary_line,
                  actionable_tip: report.actionable_tip,
                  timing_insight: report.timing_insight ?? null,
                  solunar_note: report.solunar_note ?? null,
                  driver_labels: report.drivers.map((driver) => driver.label),
                  suppressor_labels: report.suppressors.map((suppressor) =>
                    suppressor.label
                  ),
                },
              },
              productionized_actual: {
                score: report.score,
                band: report.band,
                activity_tier: activityTier(report.score),
                driver_variables: report.drivers.map((driver) =>
                  driver.variable
                ),
                suppressor_variables: report.suppressors.map((suppressor) =>
                  suppressor.variable
                ),
                driver_labels: report.drivers.map((driver) => driver.label),
                suppressor_labels: report.suppressors.map((suppressor) =>
                  suppressor.label
                ),
              },
              condition_support: support,
              clean_support: false,
              strong_support: false,
              trusted_suppressor_support: false,
              hard_cap_row: false,
              hard_cap_reasons: [],
              shutdown_row: activeHeavyRain ||
                movementRunoffPrecipReasons.length > 0,
              shutdown_reasons: [],
              severe_thermal_row: thermalReasons.length > 0,
              severe_thermal_reasons: thermalReasons,
              severe_movement_runoff_precip_row:
                movementRunoffPrecipReasons.length > 0,
              severe_movement_runoff_precip_reasons:
                movementRunoffPrecipReasons,
              major_suppressor_row:
                support.strongest_suppressor_contribution <= -10,
              moderate_suppressor_row:
                support.strongest_suppressor_contribution <= -6,
              active_heavy_rain: activeHeavyRain,
              recent_wet_rain: recentWetRain,
            };
            const withShutdown: Omit<AuditRow, "candidates"> = {
              ...base,
              shutdown_reasons: shutdownReasons(base),
            };
            const withSupport: Omit<AuditRow, "candidates"> = {
              ...withShutdown,
              clean_support: cleanSupport(withShutdown),
              strong_support: strongSupport(withShutdown),
              trusted_suppressor_support: trustedSuppressorSupport(
                withShutdown,
              ),
            };
            const hardReasons = hardCapReasons(withSupport);
            const withFlags: Omit<AuditRow, "candidates"> = {
              ...withSupport,
              hard_cap_row: hardReasons.length > 0,
              hard_cap_reasons: hardReasons,
            };
            rows.push({
              ...withFlags,
              candidates: Object.fromEntries(
                VARIANTS.map((variant) => [
                  variant,
                  candidateScore(withFlags, variant),
                ]),
              ) as Record<VariantId, CandidateResult>,
            });
          }
        }
      }
    }
  }
  return rows;
}

function emptyBandCounts(): Record<ScoreBand, number> {
  return Object.fromEntries(BANDS.map((band) => [band, 0])) as Record<
    ScoreBand,
    number
  >;
}

function emptyContextBandCounts(): Record<
  EngineContext,
  Record<ScoreBand, number>
> {
  return Object.fromEntries(
    CONTEXTS.map((context) => [context, emptyBandCounts()]),
  ) as Record<EngineContext, Record<ScoreBand, number>>;
}

function emptyContextCounts(): Record<EngineContext, number> {
  return Object.fromEntries(CONTEXTS.map((context) => [context, 0])) as Record<
    EngineContext,
    number
  >;
}

function emptyArchetypeCounts(): Record<string, number> {
  return Object.fromEntries(
    ARCHETYPES.map((archetype) => [archetype.id, 0]),
  );
}

function emptyScoreTailHistogram(): Record<string, number> {
  return {
    "80-84": 0,
    "85-89": 0,
    "90-94": 0,
    "95-99": 0,
  };
}

function scoreTailBucket(score: number): string | null {
  if (score >= 80 && score <= 84) return "80-84";
  if (score >= 85 && score <= 89) return "85-89";
  if (score >= 90 && score <= 94) return "90-94";
  if (score >= 95 && score <= 99) return "95-99";
  return null;
}

function emptyPrimeScoreHistogram(): Record<string, number> {
  return Object.fromEntries(
    Array.from({ length: 20 }, (_, index) => [String(index + 80), 0]),
  );
}

const RED_FLAG_ARCHETYPES = new Set<ArchetypeId>([
  "stable_poor_hot",
  "stable_poor_cold",
  "warming_into_heat",
  "cold_front_shock",
  "heavy_active_rain",
  "river_blown_out",
  "river_elevated_dirty",
  "wet_baseline_recent_rain",
  "bluebird_windy",
  "overcast_windy",
  "coastal_slack_tide",
  "coastal_too_hard_tide",
  "flats_too_hard_current",
]);

function isRedFlagUpgrade(
  row: AuditRow,
  candidate: Pick<CandidateResult, "band" | "structural">,
): boolean {
  const startsLow = row.production.band === "Poor" ||
    row.production.band === "Fair";
  const upgradesHigh = candidate.band === "Good" ||
    candidate.band === "Prime";
  const support = candidate.structural?.adjusted_support ??
    row.condition_support;
  const clean = candidate.structural?.adjusted_clean_support ??
    row.clean_support;
  const trusted = candidate.structural?.adjusted_trusted_support ??
    row.trusted_suppressor_support;
  const major = support.strongest_suppressor_contribution <= -10;
  const moderate = support.strongest_suppressor_contribution <= -6;
  return startsLow && upgradesHigh &&
    ((!clean && !trusted) ||
      support.thin_support ||
      support.surfaced_driver_count === 0 ||
      row.shutdown_row ||
      row.recent_wet_rain ||
      row.severe_movement_runoff_precip_row ||
      ((moderate || major) && !trusted) ||
      RED_FLAG_ARCHETYPES.has(row.archetype));
}

function reportExplainabilityFailure(
  row: AuditRow,
  candidate: Pick<CandidateResult, "band" | "structural">,
): boolean {
  const surfacedDriverCount =
    candidate.structural?.adjusted_support.surfaced_driver_count ??
      row.condition_support.surfaced_driver_count;
  return (row.production.band === "Poor" || row.production.band === "Fair") &&
    (candidate.band === "Good" || candidate.band === "Prime") &&
    surfacedDriverCount === 0;
}

function primeCaution(row: AuditRow, candidate: { band: ScoreBand }): boolean {
  return candidate.band === "Prime" && RED_FLAG_ARCHETYPES.has(row.archetype);
}

function bandRank(band: ScoreBand): number {
  return BANDS.indexOf(band);
}

function metrics(
  rows: AuditRow[],
  scoreFor: (row: AuditRow) => {
    score: number;
    band: ScoreBand;
    activity_tier: ActivityTier;
    score_delta: number;
    report_copy_needs_regeneration: boolean;
    guardrail_violations: string[];
  },
): Metrics {
  const bandDistribution = emptyBandCounts();
  const bandDistributionByContext = emptyContextBandCounts();
  const scoreTailHistogram = emptyScoreTailHistogram();
  const primeScoreHistogram = emptyPrimeScoreHistogram();
  const primeCountByContext = emptyContextCounts();
  const primeCountByArchetype = emptyArchetypeCounts();
  const goodPrimeCountByArchetype = emptyArchetypeCounts();
  const crossings = {
    "Poor->Fair": 0,
    "Fair->Good": 0,
    "Good->Prime": 0,
    "Tough->Poor/Fair": 0,
  };
  const downwardCrossings = {
    shutdown: 0,
    non_shutdown: 0,
  };
  const guardrailViolations: Record<string, number> = {};
  const activityTierChanges = {
    "suppressed->neutral": 0,
    "neutral->active": 0,
    "active->neutral": 0,
    "neutral->suppressed": 0,
  };
  let totalDelta = 0;
  let maxScore = 0;
  let copyRegenerationRows = 0;
  let redFlagUpgradeRows = 0;
  let reportExplainabilityFailures = 0;
  let primeCautionCount = 0;
  const supportTaxonomyCounts = {
    strong_support: 0,
    trusted_suppressor_support: 0,
    clean_support: 0,
  };
  const redFlagUpgradesByArchetypeContext: Record<string, number> = {};
  for (const row of rows) {
    const candidate = scoreFor(row);
    maxScore = Math.max(maxScore, candidate.score);
    const tailBucket = scoreTailBucket(candidate.score);
    if (tailBucket != null) scoreTailHistogram[tailBucket]++;
    if (row.strong_support) supportTaxonomyCounts.strong_support++;
    if (row.trusted_suppressor_support) {
      supportTaxonomyCounts.trusted_suppressor_support++;
    }
    if (row.clean_support) supportTaxonomyCounts.clean_support++;
    bandDistribution[candidate.band]++;
    bandDistributionByContext[row.context][candidate.band]++;
    if (candidate.band === "Prime") {
      primeCountByContext[row.context]++;
      primeCountByArchetype[row.archetype]++;
      primeScoreHistogram[String(candidate.score)] =
        (primeScoreHistogram[String(candidate.score)] ?? 0) + 1;
    }
    if (candidate.band === "Good" || candidate.band === "Prime") {
      goodPrimeCountByArchetype[row.archetype]++;
    }
    totalDelta += candidate.score_delta;
    const transition = `${row.production.band}->${candidate.band}`;
    if (transition === "Poor->Fair") crossings["Poor->Fair"]++;
    if (transition === "Fair->Good") crossings["Fair->Good"]++;
    if (transition === "Good->Prime") crossings["Good->Prime"]++;
    if (
      row.production.band === "Tough" &&
      (candidate.band === "Poor" || candidate.band === "Fair")
    ) {
      crossings["Tough->Poor/Fair"]++;
    }
    if (bandRank(candidate.band) < bandRank(row.production.band)) {
      if (row.shutdown_row) downwardCrossings.shutdown++;
      else downwardCrossings.non_shutdown++;
    }
    for (const violation of candidate.guardrail_violations) {
      guardrailViolations[violation] = (guardrailViolations[violation] ?? 0) +
        1;
    }
    const activityTransition =
      `${row.production.activity_tier}->${candidate.activity_tier}`;
    if (activityTransition in activityTierChanges) {
      activityTierChanges[
        activityTransition as keyof typeof activityTierChanges
      ]++;
    }
    if (candidate.report_copy_needs_regeneration) copyRegenerationRows++;
    if (reportExplainabilityFailure(row, candidate)) {
      reportExplainabilityFailures++;
    }
    if (primeCaution(row, candidate)) primeCautionCount++;
    if (isRedFlagUpgrade(row, candidate)) {
      redFlagUpgradeRows++;
      const key = `${row.archetype}|${row.context}`;
      redFlagUpgradesByArchetypeContext[key] =
        (redFlagUpgradesByArchetypeContext[key] ?? 0) + 1;
    }
  }
  return {
    bandDistribution,
    bandDistributionByContext,
    scoreTailHistogram,
    primeScoreHistogram,
    maxScore,
    primeCountByArchetype,
    goodPrimeCountByArchetype,
    avgScoreDelta: totalDelta / rows.length,
    crossings,
    downwardCrossings,
    primeCountByContext,
    guardrailViolations,
    activityTierChanges,
    copyRegenerationRows,
    redFlagUpgradeRows,
    redFlagUpgradesByArchetypeContext,
    reportExplainabilityFailures,
    primeCautionCount,
    supportTaxonomyCounts,
  };
}

function productionMetrics(rows: AuditRow[]): Metrics {
  return metrics(rows, (row) => ({
    score: row.production.score,
    band: row.production.band,
    activity_tier: row.production.activity_tier,
    score_delta: 0,
    report_copy_needs_regeneration: false,
    guardrail_violations: guardrailViolations({
      row,
      score: row.production.score,
    }),
  }));
}

function productionizedActualMetrics(rows: AuditRow[]): Metrics {
  return candidateMetrics(rows, SCORING_FINALIST);
}

function candidateMetrics(rows: AuditRow[], variant: VariantId): Metrics {
  return metrics(rows, (row) => row.candidates[variant]);
}

function bandTable(allMetrics: Record<string, Metrics>): string {
  return Object.entries(allMetrics).map(([name, m]) =>
    `| ${name} | ${
      BANDS.map((band) => m.bandDistribution[band]).join(" | ")
    } | ${
      m.avgScoreDelta.toFixed(2)
    } | ${m.copyRegenerationRows} | ${m.redFlagUpgradeRows} | ${m.reportExplainabilityFailures} | ${m.primeCautionCount} |`
  ).join("\n");
}

function contextBandTable(name: string, m: Metrics): string {
  return CONTEXTS.map((context) =>
    `| ${name} | ${context} | ${
      BANDS.map((band) => m.bandDistributionByContext[context][band]).join(
        " | ",
      )
    } |`
  ).join("\n");
}

function compactRecord(record: Record<string, number>): string {
  const entries = Object.entries(record);
  if (entries.length === 0) return "none";
  return entries.map(([key, value]) => `${key}: ${value}`).join(", ");
}

function crossingsTable(allMetrics: Record<string, Metrics>): string {
  return Object.entries(allMetrics).map(([name, m]) =>
    `| ${name} | ${compactRecord(m.crossings)} | ${
      compactRecord(m.primeCountByContext)
    } |`
  ).join("\n");
}

function downwardCrossingsTable(allMetrics: Record<string, Metrics>): string {
  return Object.entries(allMetrics).map(([name, m]) =>
    `| ${name} | ${compactRecord(m.downwardCrossings)} |`
  ).join("\n");
}

function guardrailTable(allMetrics: Record<string, Metrics>): string {
  return Object.entries(allMetrics).map(([name, m]) =>
    `| ${name} | ${compactRecord(m.guardrailViolations)} |`
  ).join("\n");
}

function activityTable(allMetrics: Record<string, Metrics>): string {
  return Object.entries(allMetrics).map(([name, m]) =>
    `| ${name} | ${compactRecord(m.activityTierChanges)} |`
  ).join("\n");
}

function supportTaxonomyTable(allMetrics: Record<string, Metrics>): string {
  return Object.entries(allMetrics).map(([name, m]) =>
    `| ${name} | ${compactRecord(m.supportTaxonomyCounts)} |`
  ).join("\n");
}

function topRecordEntries(record: Record<string, number>, limit = 12): string {
  const entries = Object.entries(record)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
  return entries.length === 0
    ? "none"
    : entries.map(([key, value]) => `${key}: ${value}`).join(", ");
}

function archetypeOutcomeTable(allMetrics: Record<string, Metrics>): string {
  return Object.entries(allMetrics).map(([name, m]) =>
    `| ${name} | ${topRecordEntries(m.primeCountByArchetype)} | ${
      topRecordEntries(m.goodPrimeCountByArchetype)
    } |`
  ).join("\n");
}

function redFlagByArchetypeContextTable(
  allMetrics: Record<string, Metrics>,
): string {
  return Object.entries(allMetrics).map(([name, m]) =>
    `| ${name} | ${topRecordEntries(m.redFlagUpgradesByArchetypeContext, 16)} |`
  ).join("\n");
}

function recommendation(allMetrics: Record<VariantId, Metrics>): VariantId {
  const safe = VARIANTS.filter((variant) =>
    Object.keys(allMetrics[variant].guardrailViolations).length === 0 &&
    allMetrics[variant].downwardCrossings.non_shutdown === 0
  );
  const candidates = safe.length ? safe : [...VARIANTS];
  return candidates.sort((a, b) => {
    const ma = allMetrics[a];
    const mb = allMetrics[b];
    const score = (m: Metrics) => {
      const primePenalty = m.bandDistribution.Prime < 500
        ? (500 - m.bandDistribution.Prime) * 3
        : m.bandDistribution.Prime > 1000
        ? (m.bandDistribution.Prime - 1000) * 3
        : 0;
      const activePenalty = Math.max(
        0,
        (m.activityTierChanges["neutral->active"] ?? 0) - 5500,
      );
      const redPenalty = Math.max(0, m.redFlagUpgradeRows - 1800) * 4;
      const eliteTailBonus = m.scoreTailHistogram["80-84"] * 3 +
        m.scoreTailHistogram["90-94"] * 8 +
        Math.min(m.scoreTailHistogram["95-99"], 40) * 10 +
        (m.maxScore >= 99
          ? 800
          : m.maxScore >= 95
          ? 500
          : m.maxScore >= 90
          ? 200
          : 0);
      return m.bandDistribution.Good * 2 +
        m.bandDistribution.Fair +
        m.bandDistribution.Prime * 3 -
        redPenalty -
        activePenalty -
        primePenalty -
        m.reportExplainabilityFailures * 20 -
        m.primeCautionCount * 4 +
        eliteTailBonus;
    };
    return score(mb) - score(ma) ||
      ma.redFlagUpgradeRows - mb.redFlagUpgradeRows ||
      mb.bandDistribution.Good - ma.bandDistribution.Good;
  })[0]!;
}

function sampleRows(rows: AuditRow[], variant: VariantId): string {
  return rows
    .filter((row) => row.candidates[variant].band !== row.production.band)
    .slice(0, 12)
    .map((row) =>
      `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${row.production.score}->${
        row.candidates[variant].score
      } | ${row.production.band}->${row.candidates[variant].band} | ${
        row.production.timing_strength ?? "null"
      } |`
    ).join("\n") || "| none |  |  |  |  |  |  |  |";
}

function redFlagUpgradeRows(rows: AuditRow[], variant: VariantId): string {
  const selected = rows
    .filter((row) => isRedFlagUpgrade(row, row.candidates[variant]))
    .sort((a, b) =>
      b.candidates[variant].score - b.production.score -
        (a.candidates[variant].score - a.production.score) ||
      b.condition_support.negative_suppressor_mass -
        a.condition_support.negative_suppressor_mass ||
      a.region.localeCompare(b.region)
    )
    .slice(0, 40);
  if (selected.length === 0) {
    return "| none |  |  |  |  |  |  |  |  |  |  |  |";
  }
  return selected.map((row) => {
    const candidate = row.candidates[variant];
    return `| ${variant} | ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${row.production.score}->${candidate.score} | ${row.production.band}->${candidate.band} | ${
      row.condition_support.thin_support ? "yes" : "no"
    } | ${row.condition_support.surfaced_driver_count} | ${
      row.moderate_suppressor_row ? "yes" : "no"
    } | ${row.clean_support ? "yes" : "no"} | ${
      row.trusted_suppressor_support ? "yes" : "no"
    } |`;
  }).join("\n");
}

function tailHistogramTable(allMetrics: Record<string, Metrics>): string {
  return Object.entries(allMetrics).map(([name, m]) =>
    `| ${name} | ${m.scoreTailHistogram["80-84"]} | ${
      m.scoreTailHistogram["85-89"]
    } | ${m.scoreTailHistogram["90-94"]} | ${
      m.scoreTailHistogram["95-99"]
    } | ${m.maxScore} |`
  ).join("\n");
}

function exactPrimeScoreHistogramTable(
  allMetrics: Record<string, Metrics>,
): string {
  const scores = Array.from({ length: 20 }, (_, index) => index + 80);
  return Object.entries(allMetrics).map(([name, m]) =>
    `| ${name} | ${
      scores.map((score) => `${score}:${m.primeScoreHistogram[String(score)]}`)
        .join(", ")
    } |`
  ).join("\n");
}

function bandDeltaSummary(a: Metrics, b: Metrics): string {
  return BANDS.map((band) =>
    `${band}: ${a.bandDistribution[band] - b.bandDistribution[band]}`
  )
    .join(", ");
}

function tailDeltaSummary(a: Metrics, b: Metrics): string {
  return ["80-84", "85-89", "90-94", "95-99"].map((bucket) =>
    `${bucket}: ${a.scoreTailHistogram[bucket] - b.scoreTailHistogram[bucket]}`
  ).join(", ") + `, max: ${a.maxScore - b.maxScore}`;
}

function formerRedFlagPrimeCount(rows: AuditRow[], variant: VariantId): number {
  return rows.filter((row) =>
    RED_FLAG_ARCHETYPES.has(row.archetype) &&
    row.candidates[variant].band === "Prime"
  ).length;
}

function productionizabilityCheckTable(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): string {
  const finalist = allMetrics[SCORING_FINALIST];
  return [
    `| accepted finalist | pass | ${SCORING_FINALIST} is productionized and verified by \`productionized_actual\`. |`,
    `| scoring references no archetype/water_clarity/fixture-only fields | pass | Finalist gates use normalized scores, production score/factors, timing, request/rain-derived flags, reliability, missing/data gaps, and runtime support diagnostics. |`,
    `| productionized actual vs finalist | ${
      productionizedExactMatch ? "pass" : "fail"
    } | score/band/activity/factor mismatches: ${productionizedMatch.score}/${productionizedMatch.band}/${productionizedMatch.activityTier}/${productionizedMatch.factors}. |`,
    `| finalist distribution | ${
      BANDS.map((band) => finalist.bandDistribution[band]).join("/")
    } | Current productionized surface. |`,
    `| finalist Prime by context | ${
      compactRecord(finalist.primeCountByContext)
    } | Runtime diagnostic. |`,
    `| finalist Prime by archetype | ${
      topRecordEntries(finalist.primeCountByArchetype)
    } | Fixture diagnostic only; archetype is not used for scoring. |`,
  ].join("\n");
}

function pct(numerator: number, denominator: number): string {
  return denominator === 0
    ? "0.0%"
    : `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function regionFairnessTable(rows: AuditRow[], variant: VariantId): string {
  return CANONICAL_REGION_KEYS.map((region) => {
    const regionRows = rows.filter((row) => row.region === region);
    const counts = emptyBandCounts();
    let maxScore = 0;
    for (const row of regionRows) {
      const candidate = row.candidates[variant];
      counts[candidate.band]++;
      maxScore = Math.max(maxScore, candidate.score);
    }
    const goodPrime = counts.Good + counts.Prime;
    const toughPoor = counts.Tough + counts.Poor;
    return `| ${region} | ${BANDS.map((band) => counts[band]).join(" / ")} | ${
      pct(goodPrime, regionRows.length)
    } | ${pct(toughPoor, regionRows.length)} | ${
      pct(counts.Prime, regionRows.length)
    } | ${maxScore} |`;
  }).join("\n");
}

function zeroPrimeRegions(rows: AuditRow[], variant: VariantId): string {
  const regions = CANONICAL_REGION_KEYS.filter((region) =>
    rows.filter((row) => row.region === region).every((row) =>
      row.candidates[variant].band !== "Prime"
    )
  );
  return regions.length ? regions.join(", ") : "none";
}

function regionsGoodPrimeBelowToughPoor(
  rows: AuditRow[],
  variant: VariantId,
): string {
  const regions = CANONICAL_REGION_KEYS.filter((region) => {
    const regionRows = rows.filter((row) => row.region === region);
    let goodPrime = 0;
    let toughPoor = 0;
    for (const row of regionRows) {
      const band = row.candidates[variant].band;
      if (band === "Good" || band === "Prime") goodPrime++;
      if (band === "Tough" || band === "Poor") toughPoor++;
    }
    return goodPrime < toughPoor;
  });
  return regions.length ? regions.join(", ") : "none";
}

function regionPercentSpreads(
  rows: AuditRow[],
  variant: VariantId,
  regions: readonly RegionKey[] = CANONICAL_REGION_KEYS,
): {
  goodPrimeMin: number;
  goodPrimeMax: number;
  primeMin: number;
  primeMax: number;
} {
  let goodPrimeMin = Number.POSITIVE_INFINITY;
  let goodPrimeMax = 0;
  let primeMin = Number.POSITIVE_INFINITY;
  let primeMax = 0;
  for (const region of regions) {
    const regionRows = rows.filter((row) => row.region === region);
    let goodPrime = 0;
    let prime = 0;
    for (const row of regionRows) {
      const band = row.candidates[variant].band;
      if (band === "Good" || band === "Prime") goodPrime++;
      if (band === "Prime") prime++;
    }
    const goodPrimePct = (goodPrime / regionRows.length) * 100;
    const primePct = (prime / regionRows.length) * 100;
    goodPrimeMin = Math.min(goodPrimeMin, goodPrimePct);
    goodPrimeMax = Math.max(goodPrimeMax, goodPrimePct);
    primeMin = Math.min(primeMin, primePct);
    primeMax = Math.max(primeMax, primePct);
  }
  return { goodPrimeMin, goodPrimeMax, primeMin, primeMax };
}

function zeroPrimeRegionsFor(
  rows: AuditRow[],
  variant: VariantId,
  regions: readonly RegionKey[],
): string {
  const list = regions.filter((region) =>
    rows.filter((row) => row.region === region).every((row) =>
      row.candidates[variant].band !== "Prime"
    )
  );
  return list.length ? list.join(", ") : "none";
}

function regionsBelowToughPoorFor(
  rows: AuditRow[],
  variant: VariantId,
  regions: readonly RegionKey[],
): string {
  const list = regions.filter((region) => {
    const regionRows = rows.filter((row) => row.region === region);
    let goodPrime = 0;
    let toughPoor = 0;
    for (const row of regionRows) {
      const band = row.candidates[variant].band;
      if (band === "Good" || band === "Prime") goodPrime++;
      if (band === "Tough" || band === "Poor") toughPoor++;
    }
    return goodPrime < toughPoor;
  });
  return list.length ? list.join(", ") : "none";
}

function distributionForRegions(
  rows: AuditRow[],
  variant: VariantId,
  regions: readonly RegionKey[],
): string {
  const counts = emptyBandCounts();
  for (const row of rows.filter((row) => regions.includes(row.region))) {
    counts[row.candidates[variant].band]++;
  }
  return BANDS.map((band) => counts[band]).join("/");
}

function regionSpreadSummary(rows: AuditRow[], variant: VariantId): string {
  const spread = regionPercentSpreads(rows, variant);
  return `Good+Prime min/max/spread: ${spread.goodPrimeMin.toFixed(1)}% / ${
    spread.goodPrimeMax.toFixed(1)
  }% / ${
    (spread.goodPrimeMax - spread.goodPrimeMin).toFixed(1)
  } pts; Prime min/max/spread: ${spread.primeMin.toFixed(1)}% / ${
    spread.primeMax.toFixed(1)
  }% / ${(spread.primeMax - spread.primeMin).toFixed(1)} pts`;
}

function regionCountBelowToughPoor(
  rows: AuditRow[],
  variant: VariantId,
): number {
  const list = regionsGoodPrimeBelowToughPoor(rows, variant);
  return list === "none" ? 0 : list.split(", ").length;
}

function zeroPrimeRegionCount(rows: AuditRow[], variant: VariantId): number {
  const list = zeroPrimeRegions(rows, variant);
  return list === "none" ? 0 : list.split(", ").length;
}

function bestV37(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): VariantId {
  const variants = [
    "curve_timing_selective_prime_v37_region_balanced_light",
    "curve_timing_selective_prime_v37_region_balanced_moderate",
    "curve_timing_selective_prime_v37_region_balanced_prime_gate",
  ] as const;
  return variants.sort((a, b) => {
    const ma = allMetrics[a];
    const mb = allMetrics[b];
    const score = (variant: VariantId, m: Metrics) => {
      const spread = regionPercentSpreads(rows, variant);
      const violations = Object.values(m.guardrailViolations).reduce(
        (sum, value) => sum + value,
        0,
      );
      const primePct = (m.bandDistribution.Prime / rows.length) * 100;
      const primePenalty = primePct < 2.5
        ? (2.5 - primePct) * 200
        : primePct > 4
        ? (primePct - 4) * 300
        : 0;
      return -zeroPrimeRegionCount(rows, variant) * 1000 -
        regionCountBelowToughPoor(rows, variant) * 300 -
        (spread.goodPrimeMax - spread.goodPrimeMin) * 20 -
        (spread.primeMax - spread.primeMin) * 30 -
        violations * 1000 -
        m.reportExplainabilityFailures * 500 -
        m.primeCautionCount * 500 -
        primePenalty +
        m.bandDistribution.Good * 0.02 +
        m.bandDistribution.Prime * 0.08;
    };
    return score(b, mb) - score(a, ma);
  })[0];
}

function regionCalibrationTable(): string {
  const render = (
    name: string,
    map: Partial<Record<RegionKey, RegionCalibration>>,
  ) =>
    Object.entries(map).map(([region, calibration]) =>
      `| ${name} | ${region} | ${calibration.fairGoodLift} | ${calibration.primeLift} |`
    ).join("\n");
  return [
    render("light", V37_REGION_CALIBRATION_LIGHT),
    render("moderate", V37_REGION_CALIBRATION_MODERATE),
    render("prime_gate", V37_REGION_CALIBRATION_PRIME_GATE),
  ].filter(Boolean).join("\n");
}

function v37FairnessSummaryTable(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): string {
  const variants = [
    "curve_timing_selective_prime_v37_region_balanced_light",
    "curve_timing_selective_prime_v37_region_balanced_moderate",
    "curve_timing_selective_prime_v37_region_balanced_prime_gate",
  ] as const;
  return variants.map((variant) => {
    const m = allMetrics[variant];
    const spread = regionPercentSpreads(rows, variant);
    return `| ${variant} | ${
      BANDS.map((band) => m.bandDistribution[band]).join(" / ")
    } | ${Object.values(m.scoreTailHistogram).join(" / ")} / ${m.maxScore} | ${
      zeroPrimeRegions(rows, variant)
    } | ${regionsGoodPrimeBelowToughPoor(rows, variant)} | ${
      spread.goodPrimeMin.toFixed(1)
    }%-${spread.goodPrimeMax.toFixed(1)}% (${
      (spread.goodPrimeMax - spread.goodPrimeMin).toFixed(1)
    }) | ${spread.primeMin.toFixed(1)}%-${spread.primeMax.toFixed(1)}% (${
      (spread.primeMax - spread.primeMin).toFixed(1)
    }) | ${
      compactRecord(m.guardrailViolations)
    } | ${m.reportExplainabilityFailures} | ${m.primeCautionCount} | ${
      compactRecord(m.activityTierChanges)
    } |`;
  }).join("\n");
}

const V38_VARIANTS = [
  "curve_timing_selective_prime_v38_supported_fair_floor_light",
  "curve_timing_selective_prime_v38_supported_fair_floor_moderate",
  "curve_timing_selective_prime_v38_supported_fair_floor_strong",
  "curve_timing_selective_prime_v38_supported_fair_floor_with_prime_tidy",
] as const satisfies readonly VariantId[];

const V39_VARIANTS = [
  "v39_weight_rebalance_low_region_light",
  "v39_temp_borderline_softening_light",
  "v39_weight_plus_temp_light",
  "v39_alaska_high_side_check",
] as const satisfies readonly VariantId[];

const V40_VARIANTS = [
  "v40_temp_table_underparity_light",
  "v40_temp_table_underparity_moderate",
  "v40_support_cap_trusted_temp",
  "v40_temp_plus_support_cap",
  "v40_alaska_temp_trim_light",
] as const satisfies readonly VariantId[];

const V41_VARIANTS = [
  "v41_temp_mean_centering_light",
  "v41_temp_mean_centering_moderate",
  "v41_temp_table_knot_repair",
  "v41_temp_plus_trusted_support",
  "v41_prime_gate_clean",
  "v41_alaska_high_side_diagnostic",
] as const satisfies readonly VariantId[];

const V42_VARIANTS = [
  "v42_redflag_good_cap_light",
  "v42_redflag_good_cap_moderate",
  "v42_mainland_balanced",
  "v42_florida_clean_prime_tail_diagnostic",
] as const satisfies readonly VariantId[];

const V43_VARIANTS = [
  "v43_v41_replay",
  "v43_runtime_prime_gate_clean",
  "v43_runtime_good_cap_light",
  "v43_runtime_good_cap_balanced",
  "v43_florida_prime_debug",
] as const satisfies readonly VariantId[];

const V43_PRODUCTIONIZABLE_VARIANTS = [
  "v43_runtime_prime_gate_clean",
  "v43_runtime_good_cap_light",
  "v43_runtime_good_cap_balanced",
] as const satisfies readonly VariantId[];

const SCORING_FINALIST = "v46_combined_light" as const satisfies VariantId;

const CONTRIBUTION_KEYS = [
  "temperature_condition",
  "pressure_regime",
  "wind_condition",
  "light_cloud_condition",
  "precipitation_disruption",
  "runoff_flow_disruption",
  "tide_current_movement",
] as const satisfies readonly ScoredVariableKey[];

const NORMALIZED_KEY_FOR_CONTRIBUTION: Record<
  ScoredVariableKey,
  keyof NormalizedSnapshot
> = {
  temperature_condition: "temperature",
  pressure_regime: "pressure_regime",
  wind_condition: "wind_condition",
  light_cloud_condition: "light_cloud_condition",
  precipitation_disruption: "precipitation_disruption",
  runoff_flow_disruption: "runoff_flow_disruption",
  tide_current_movement: "tide_current_movement",
};

function rowsExceedingV35ByMoreThan8(
  rows: AuditRow[],
  variant: VariantId,
): number {
  return rows.filter((row) =>
    row.candidates[variant].score -
        row.candidates
          .curve_timing_selective_prime_v35_productionizable_tail_plus
          .score >
      8
  ).length;
}

function bestV38(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): VariantId {
  return [...V38_VARIANTS].sort((a, b) => {
    const score = (variant: VariantId, m: Metrics) => {
      const spread = regionPercentSpreads(rows, variant);
      const guardrails = Object.values(m.guardrailViolations).reduce(
        (sum, value) => sum + value,
        0,
      );
      const primePct = (m.bandDistribution.Prime / rows.length) * 100;
      const goodPct = (m.bandDistribution.Good / rows.length) * 100;
      const largeJumpRows = rowsExceedingV35ByMoreThan8(rows, variant);
      const primePenalty = primePct < 2.5
        ? (2.5 - primePct) * 250
        : primePct > 4
        ? (primePct - 4) * 350
        : 0;
      const goodPenalty = goodPct > 30 ? (goodPct - 30) * 200 : 0;
      return -zeroPrimeRegionCount(rows, variant) * 2000 -
        regionCountBelowToughPoor(rows, variant) * 600 -
        (spread.goodPrimeMax - spread.goodPrimeMin) * 30 -
        (spread.primeMax - spread.primeMin) * 20 -
        guardrails * 2000 -
        m.reportExplainabilityFailures * 1000 -
        m.primeCautionCount * 1000 -
        largeJumpRows * 2 -
        primePenalty -
        goodPenalty +
        m.bandDistribution.Good * 0.08 +
        m.bandDistribution.Prime * 0.03;
    };
    return score(b, allMetrics[b]) - score(a, allMetrics[a]);
  })[0];
}

function bestV39(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): VariantId {
  const v38RedFlags =
    allMetrics.curve_timing_selective_prime_v38_supported_fair_floor_light
      .redFlagUpgradeRows;
  return [...V39_VARIANTS].sort((a, b) => {
    const score = (variant: VariantId, m: Metrics) => {
      const spread = regionPercentSpreads(rows, variant);
      const guardrails = Object.values(m.guardrailViolations).reduce(
        (sum, value) => sum + value,
        0,
      );
      const lowRegionRepairScore = Array.from(V39_LOW_SIDE_REGIONS).reduce(
        (sum, region) => {
          const regionRows = rows.filter((row) => row.region === region);
          const counts = emptyBandCounts();
          for (const row of regionRows) {
            counts[row.candidates[variant].band]++;
          }
          const goodPrimePct = ((counts.Good + counts.Prime) /
            regionRows.length) * 100;
          const toughPoorPct = ((counts.Tough + counts.Poor) /
            regionRows.length) * 100;
          return sum +
            goodPrimePct * 90 -
            Math.max(0, toughPoorPct - goodPrimePct) * 160;
        },
        0,
      );
      const redPenalty = Math.max(0, m.redFlagUpgradeRows - v38RedFlags) * 4;
      return -zeroPrimeRegionCount(rows, variant) * 2000 -
        regionCountBelowToughPoor(rows, variant) * 700 -
        (spread.goodPrimeMax - spread.goodPrimeMin) * 35 -
        (spread.primeMax - spread.primeMin) * 25 -
        guardrails * 2000 -
        m.reportExplainabilityFailures * 1000 -
        m.primeCautionCount * 1000 -
        redPenalty +
        lowRegionRepairScore -
        (variant === "v39_alaska_high_side_check" ? 1200 : 0) -
        m.bandDistribution.Poor * 0.015 +
        m.bandDistribution.Good * 0.08 +
        m.bandDistribution.Prime * 0.04;
    };
    return score(b, allMetrics[b]) - score(a, allMetrics[a]);
  })[0];
}

function v40Acceptable(
  rows: AuditRow[],
  m: Metrics,
  variant: VariantId,
): boolean {
  const spread = regionPercentSpreads(rows, variant);
  return zeroPrimeRegionCount(rows, variant) === 0 &&
    regionCountBelowToughPoor(rows, variant) === 0 &&
    spread.goodPrimeMax - spread.goodPrimeMin < 31.4 &&
    spread.primeMax - spread.primeMin < 7.6 &&
    m.bandDistribution.Good > m.bandDistribution.Poor &&
    m.bandDistribution.Prime > 0 &&
    m.maxScore >= 99 &&
    Object.keys(m.guardrailViolations).length === 0 &&
    m.reportExplainabilityFailures === 0 &&
    m.primeCautionCount === 0 &&
    m.activityTierChanges["active->neutral"] === 0 &&
    m.activityTierChanges["neutral->suppressed"] === 0 &&
    m.redFlagUpgradeRows <= 3150;
}

function bestV40(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): { candidate: VariantId; acceptable: boolean } {
  const scored = [...V40_VARIANTS].map((variant) => {
    const m = allMetrics[variant];
    const spread = regionPercentSpreads(rows, variant);
    const guardrails = Object.values(m.guardrailViolations).reduce(
      (sum, value) => sum + value,
      0,
    );
    const lowRegionScore = Array.from(V40_UNDERPARITY_REGIONS).reduce(
      (sum, region) => {
        const regionRows = rows.filter((row) => row.region === region);
        const counts = emptyBandCounts();
        for (const row of regionRows) counts[row.candidates[variant].band]++;
        const goodPrimePct = ((counts.Good + counts.Prime) /
          regionRows.length) * 100;
        const toughPoorPct = ((counts.Tough + counts.Poor) /
          regionRows.length) * 100;
        return sum + goodPrimePct * 80 -
          Math.max(0, toughPoorPct - goodPrimePct) * 120;
      },
      0,
    );
    const score = lowRegionScore -
      zeroPrimeRegionCount(rows, variant) * 2500 -
      regionCountBelowToughPoor(rows, variant) * 900 -
      (spread.goodPrimeMax - spread.goodPrimeMin) * 55 -
      (spread.primeMax - spread.primeMin) * 35 -
      guardrails * 3000 -
      m.reportExplainabilityFailures * 1500 -
      m.primeCautionCount * 1500 -
      Math.max(0, m.redFlagUpgradeRows - 3150) * 5 +
      m.bandDistribution.Good * 0.04 +
      m.bandDistribution.Prime * 0.04 -
      (variant === "v40_alaska_temp_trim_light" ? 1000 : 0);
    return { variant, score, acceptable: v40Acceptable(rows, m, variant) };
  }).sort((a, b) =>
    Number(b.acceptable) - Number(a.acceptable) || b.score - a.score
  );
  return {
    candidate: scored[0].variant,
    acceptable: scored[0].acceptable,
  };
}

function v41Acceptable(
  rows: AuditRow[],
  m: Metrics,
  variant: VariantId,
): boolean {
  const spread = regionPercentSpreads(rows, variant);
  const floridaRows = rows.filter((row) => row.region === "florida");
  const floridaCounts = emptyBandCounts();
  for (const row of floridaRows) floridaCounts[row.candidates[variant].band]++;
  const floridaGoodPrimePct = ((floridaCounts.Good + floridaCounts.Prime) /
    floridaRows.length) * 100;
  return variant !== "v41_alaska_high_side_diagnostic" &&
    zeroPrimeRegionCount(rows, variant) === 0 &&
    floridaGoodPrimePct >= 20 &&
    spread.goodPrimeMax - spread.goodPrimeMin < 31.4 &&
    spread.primeMax - spread.primeMin < 7.6 &&
    m.bandDistribution.Good > m.bandDistribution.Poor &&
    m.bandDistribution.Prime > 0 &&
    m.maxScore >= 99 &&
    Object.keys(m.guardrailViolations).length === 0 &&
    m.reportExplainabilityFailures === 0 &&
    m.primeCautionCount === 0 &&
    m.activityTierChanges["active->neutral"] === 0 &&
    m.activityTierChanges["neutral->suppressed"] === 0 &&
    m.redFlagUpgradeRows < 3150;
}

function bestV41(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): { candidate: VariantId; acceptable: boolean } {
  const scored = [...V41_VARIANTS].map((variant) => {
    const m = allMetrics[variant];
    const spread = regionPercentSpreads(rows, variant);
    const guardrails = Object.values(m.guardrailViolations).reduce(
      (sum, value) => sum + value,
      0,
    );
    const lowRegionScore = Array.from(V40_UNDERPARITY_REGIONS).reduce(
      (sum, region) => {
        const regionRows = rows.filter((row) => row.region === region);
        const counts = emptyBandCounts();
        for (const row of regionRows) counts[row.candidates[variant].band]++;
        const goodPrimePct = ((counts.Good + counts.Prime) /
          regionRows.length) * 100;
        const toughPoorPct = ((counts.Tough + counts.Poor) /
          regionRows.length) * 100;
        return sum + goodPrimePct * 100 -
          Math.max(0, toughPoorPct - goodPrimePct) * 150;
      },
      0,
    );
    const score = lowRegionScore -
      zeroPrimeRegionCount(rows, variant) * 3000 -
      regionCountBelowToughPoor(rows, variant) * 1000 -
      (spread.goodPrimeMax - spread.goodPrimeMin) * 70 -
      (spread.primeMax - spread.primeMin) * 45 -
      guardrails * 4000 -
      m.reportExplainabilityFailures * 2000 -
      m.primeCautionCount * 2500 -
      Math.max(0, m.redFlagUpgradeRows - 3150) * 8 +
      m.bandDistribution.Good * 0.05 +
      m.bandDistribution.Prime * 0.04 -
      (variant === "v41_alaska_high_side_diagnostic" ? 10000 : 0);
    return { variant, score, acceptable: v41Acceptable(rows, m, variant) };
  }).sort((a, b) =>
    Number(b.acceptable) - Number(a.acceptable) || b.score - a.score
  );
  return {
    candidate: scored[0].variant,
    acceptable: scored[0].acceptable,
  };
}

function v42Acceptable(
  rows: AuditRow[],
  m: Metrics,
  variant: VariantId,
): boolean {
  const coreSpread = regionPercentSpreads(rows, variant, CORE_MAINLAND_REGIONS);
  const floridaRows = rows.filter((row) => row.region === "florida");
  const norCalRows = rows.filter((row) => row.region === "northern_california");
  const mountainRows = rows.filter((row) => row.region === "mountain_west");
  const pctFor = (regionRows: AuditRow[]) => {
    const goodPrime =
      regionRows.filter((row) =>
        row.candidates[variant].band === "Good" ||
        row.candidates[variant].band === "Prime"
      ).length;
    return (goodPrime / regionRows.length) * 100;
  };
  return zeroPrimeRegionsFor(rows, variant, CORE_MAINLAND_REGIONS) === "none" &&
    regionsBelowToughPoorFor(rows, variant, CORE_MAINLAND_REGIONS) === "none" &&
    pctFor(floridaRows) >= 25 &&
    pctFor(norCalRows) >= 25 &&
    pctFor(mountainRows) >= 24 &&
    coreSpread.goodPrimeMax - coreSpread.goodPrimeMin <= 24.8 &&
    m.bandDistribution.Good > m.bandDistribution.Poor &&
    m.bandDistribution.Prime > 0 &&
    m.maxScore >= 99 &&
    Object.keys(m.guardrailViolations).length === 0 &&
    m.reportExplainabilityFailures === 0 &&
    m.primeCautionCount === 0 &&
    m.activityTierChanges["active->neutral"] === 0 &&
    m.activityTierChanges["neutral->suppressed"] === 0 &&
    m.redFlagUpgradeRows < 2898;
}

function bestV42(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): { candidate: VariantId; acceptable: boolean } {
  const scored = [...V42_VARIANTS].map((variant) => {
    const m = allMetrics[variant];
    const coreSpread = regionPercentSpreads(
      rows,
      variant,
      CORE_MAINLAND_REGIONS,
    );
    const guardrails = Object.values(m.guardrailViolations).reduce(
      (sum, value) => sum + value,
      0,
    );
    const score = -(
          coreSpread.goodPrimeMax - coreSpread.goodPrimeMin
        ) * 65 -
      (coreSpread.primeMax - coreSpread.primeMin) * 30 -
      (zeroPrimeRegionsFor(rows, variant, CORE_MAINLAND_REGIONS) === "none"
        ? 0
        : 2500) -
      (regionsBelowToughPoorFor(rows, variant, CORE_MAINLAND_REGIONS) === "none"
        ? 0
        : 2500) -
      guardrails * 4000 -
      m.reportExplainabilityFailures * 2000 -
      m.primeCautionCount * 3000 -
      Math.max(0, m.redFlagUpgradeRows - 2600) * 8 -
      m.redFlagUpgradeRows * 0.25 +
      m.bandDistribution.Good * 0.05 +
      m.bandDistribution.Prime * 0.03;
    return { variant, score, acceptable: v42Acceptable(rows, m, variant) };
  }).sort((a, b) =>
    Number(b.acceptable) - Number(a.acceptable) || b.score - a.score
  );
  return {
    candidate: scored[0].variant,
    acceptable: scored[0].acceptable,
  };
}

function recordsEqual(
  a: Record<string, number>,
  b: Record<string, number>,
): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if ((a[key] ?? 0) !== (b[key] ?? 0)) return false;
  }
  return true;
}

function v43ReplayMismatches(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): string[] {
  const base = allMetrics.v41_prime_gate_clean;
  const replay = allMetrics.v43_v41_replay;
  const mismatches: string[] = [];
  if (!recordsEqual(base.bandDistribution, replay.bandDistribution)) {
    mismatches.push("band_distribution");
  }
  if (!recordsEqual(base.scoreTailHistogram, replay.scoreTailHistogram)) {
    mismatches.push("tail_histogram");
  }
  if (base.maxScore !== replay.maxScore) mismatches.push("max_score");
  if (!recordsEqual(base.activityTierChanges, replay.activityTierChanges)) {
    mismatches.push("recommender_changes");
  }
  if (!recordsEqual(base.guardrailViolations, replay.guardrailViolations)) {
    mismatches.push("guardrails");
  }
  if (
    base.reportExplainabilityFailures !== replay.reportExplainabilityFailures
  ) {
    mismatches.push("explainability_failures");
  }
  if (base.primeCautionCount !== replay.primeCautionCount) {
    mismatches.push("prime_cautions");
  }
  if (base.redFlagUpgradeRows !== replay.redFlagUpgradeRows) {
    mismatches.push("red_flag_count");
  }
  for (
    const region of [
      "florida",
      "northern_california",
      "mountain_west",
    ] as const
  ) {
    if (
      regionDistributionSummary(rows, "v41_prime_gate_clean", region) !==
        regionDistributionSummary(rows, "v43_v41_replay", region)
    ) {
      mismatches.push(`${region}_summary`);
    }
  }
  const rowMismatch = rows.some((row) =>
    row.candidates.v41_prime_gate_clean.score !==
      row.candidates.v43_v41_replay.score ||
    row.candidates.v41_prime_gate_clean.band !==
      row.candidates.v43_v41_replay.band ||
    row.candidates.v41_prime_gate_clean.activity_tier !==
      row.candidates.v43_v41_replay.activity_tier
  );
  if (rowMismatch) mismatches.push("row_level_score_band_or_tier");
  return mismatches;
}

function v43ProductionizableScoringCheck(variant: VariantId): string {
  if (variant === "v43_v41_replay") {
    return "diagnostic replay only; intentionally preserves v41 archetype Prime block";
  }
  if (variant === "v43_florida_prime_debug") {
    return "diagnostic only; runtime scoring gates, archetype used only in reporting";
  }
  return "pass; runtime-only support, normalized, rain/wet/shutdown, reliability, missing/data, and contribution gates";
}

function v43Acceptable(
  rows: AuditRow[],
  m: Metrics,
  variant: VariantId,
  replayMatches: boolean,
): boolean {
  if (!replayMatches || !V43_PRODUCTIONIZABLE_VARIANTS.includes(variant)) {
    return false;
  }
  const floridaRows = rows.filter((row) => row.region === "florida");
  const norCalRows = rows.filter((row) => row.region === "northern_california");
  const mountainRows = rows.filter((row) => row.region === "mountain_west");
  const appalachianRows = rows.filter((row) => row.region === "appalachian");
  const pctFor = (regionRows: AuditRow[]) => {
    const goodPrime =
      regionRows.filter((row) =>
        row.candidates[variant].band === "Good" ||
        row.candidates[variant].band === "Prime"
      ).length;
    return (goodPrime / regionRows.length) * 100;
  };
  const appalachianGoodPrime = pctFor(appalachianRows);
  const appalachianToughPoor =
    appalachianRows.filter((row) =>
      row.candidates[variant].band === "Tough" ||
      row.candidates[variant].band === "Poor"
    ).length / appalachianRows.length * 100;
  return zeroPrimeRegionsFor(rows, variant, CORE_MAINLAND_REGIONS) === "none" &&
    regionsBelowToughPoorFor(rows, variant, CORE_MAINLAND_REGIONS) === "none" &&
    pctFor(floridaRows) >= 25 &&
    pctFor(norCalRows) >= 25 &&
    pctFor(mountainRows) >= 24 &&
    appalachianGoodPrime >= appalachianToughPoor &&
    m.bandDistribution.Good > m.bandDistribution.Poor &&
    m.bandDistribution.Prime > 0 &&
    m.maxScore >= 99 &&
    Object.keys(m.guardrailViolations).length === 0 &&
    m.reportExplainabilityFailures === 0 &&
    m.primeCautionCount === 0 &&
    m.activityTierChanges["active->neutral"] === 0 &&
    m.activityTierChanges["neutral->suppressed"] === 0 &&
    m.redFlagUpgradeRows < 2898 &&
    formerRedFlagPrimeCount(rows, variant) === 0;
}

function bestV43(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
  replayMatches: boolean,
): { candidate: VariantId; acceptable: boolean } {
  const scored = [...V43_PRODUCTIONIZABLE_VARIANTS].map((variant) => {
    const m = allMetrics[variant];
    const coreSpread = regionPercentSpreads(
      rows,
      variant,
      CORE_MAINLAND_REGIONS,
    );
    const guardrails = Object.values(m.guardrailViolations).reduce(
      (sum, value) => sum + value,
      0,
    );
    const score = -(
          coreSpread.goodPrimeMax - coreSpread.goodPrimeMin
        ) * 65 -
      (coreSpread.primeMax - coreSpread.primeMin) * 30 -
      (zeroPrimeRegionsFor(rows, variant, CORE_MAINLAND_REGIONS) === "none"
        ? 0
        : 3000) -
      (regionsBelowToughPoorFor(rows, variant, CORE_MAINLAND_REGIONS) === "none"
        ? 0
        : 3000) -
      guardrails * 5000 -
      m.reportExplainabilityFailures * 2500 -
      m.primeCautionCount * 3500 -
      Math.max(0, m.redFlagUpgradeRows - 2898) * 10 -
      m.redFlagUpgradeRows * 0.35 +
      m.bandDistribution.Good * 0.05 +
      m.bandDistribution.Prime * 0.03 +
      (formerRedFlagPrimeCount(rows, variant) === 0 ? 250 : -4000);
    return {
      variant,
      score,
      acceptable: v43Acceptable(rows, m, variant, replayMatches),
    };
  }).sort((a, b) =>
    Number(b.acceptable) - Number(a.acceptable) || b.score - a.score
  );
  return {
    candidate: scored[0].variant,
    acceptable: scored[0].acceptable,
  };
}

function candidateDistributionForRows(
  selected: AuditRow[],
  variant: VariantId | "production",
): string {
  const counts = emptyBandCounts();
  for (const row of selected) {
    const band = variant === "production"
      ? row.production.band
      : row.candidates[variant].band;
    counts[band]++;
  }
  return BANDS.map((band) => counts[band]).join("/");
}

function averageScoreForRows(
  selected: AuditRow[],
  variant: VariantId | "production",
): string {
  if (!selected.length) return "0.0";
  const total = selected.reduce((sum, row) => {
    return sum +
      (variant === "production"
        ? row.production.score
        : row.candidates[variant].score);
  }, 0);
  return (total / selected.length).toFixed(1);
}

function averageContribution(
  rows: AuditRow[],
  key: ScoredVariableKey,
  field: "score" | "weight" | "weighted_contribution",
): number {
  const values = rows.flatMap((row) => {
    const c = contributionByKey(row, key);
    return c ? [c[field]] : [];
  });
  return values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;
}

function averageNormalized(
  rows: AuditRow[],
  key: ScoredVariableKey,
): number {
  const normalizedKey = NORMALIZED_KEY_FOR_CONTRIBUTION[key];
  const values = rows.flatMap((row) => {
    const score = normalizedScore(row, normalizedKey);
    return score == null ? [] : [score];
  });
  return values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;
}

function compactVariableAverages(
  rows: AuditRow[],
  field: "normalized" | "weighted" | "weight",
): string {
  return CONTRIBUTION_KEYS.map((key) => {
    const label = key.replace(/_condition|_disruption|_regime|_movement/g, "");
    const value = field === "normalized"
      ? averageNormalized(rows, key)
      : field === "weighted"
      ? averageContribution(rows, key, "weighted_contribution")
      : averageContribution(rows, key, "weight");
    return `${label}:${value.toFixed(1)}`;
  }).join("; ");
}

function topAverageContributionVariable(
  rows: AuditRow[],
  direction: "positive" | "negative",
): string {
  const sorted = [...CONTRIBUTION_KEYS].map((key) => ({
    key,
    value: averageContribution(rows, key, "weighted_contribution"),
  })).sort((a, b) =>
    direction === "positive" ? b.value - a.value : a.value - b.value
  );
  const chosen = sorted[0];
  return `${chosen.key}:${chosen.value.toFixed(1)}`;
}

function v39StructuralDiagnosticsTable(
  rows: AuditRow[],
  v35: VariantId,
  v38: VariantId,
): string {
  return CANONICAL_REGION_KEYS.flatMap((region) =>
    CONTEXTS.flatMap((context) =>
      Array.from({ length: 12 }, (_, index) => index + 1).map((month) => {
        const selected = rows.filter((row) =>
          row.region === region && row.context === context &&
          row.month === month
        );
        const v35GoodPrime = selected.filter((row) =>
          row.candidates[v35].band === "Good" ||
          row.candidates[v35].band === "Prime"
        ).length;
        const toughPoor = selected.filter((row) =>
          row.production.band === "Tough" || row.production.band === "Poor"
        ).length;
        const prime = selected.filter((row) =>
          row.candidates[v35].band === "Prime"
        )
          .length;
        const maxScore = Math.max(...selected.map((row) =>
          row.candidates[v35].score
        ));
        return `| ${region} | ${context} | ${month} | ${
          candidateDistributionForRows(selected, "production")
        } | ${candidateDistributionForRows(selected, v35)} | ${
          candidateDistributionForRows(selected, v38)
        } | ${averageScoreForRows(selected, "production")} | ${
          averageScoreForRows(selected, v35)
        } | ${averageScoreForRows(selected, v38)} | ${
          pct(v35GoodPrime, selected.length)
        } | ${pct(toughPoor, selected.length)} | ${
          pct(prime, selected.length)
        } | ${maxScore} | ${
          compactVariableAverages(selected, "normalized")
        } | ${compactVariableAverages(selected, "weighted")} | ${
          compactVariableAverages(selected, "weight")
        } | ${topAverageContributionVariable(selected, "negative")} | ${
          topAverageContributionVariable(selected, "positive")
        } |`;
      })
    )
  ).join("\n");
}

function groupRows(rows: AuditRow[], regions: Set<RegionKey>): AuditRow[] {
  return rows.filter((row) => regions.has(row.region));
}

function rootCauseSummary(rows: AuditRow[]): string {
  const low = groupRows(rows, V39_LOW_SIDE_REGIONS);
  const peers = groupRows(rows, V39_BALANCED_PEER_REGIONS);
  const high = groupRows(rows, V39_HIGH_SIDE_REGIONS);
  const keys: ScoredVariableKey[] = [
    "temperature_condition",
    "precipitation_disruption",
    "runoff_flow_disruption",
    "tide_current_movement",
    "wind_condition",
    "light_cloud_condition",
  ];
  const rowsFor = (label: string, selected: AuditRow[]) => {
    const avgSupport = selected.reduce(
      (sum, row) => sum + row.condition_support.surfaced_driver_count,
      0,
    ) / selected.length;
    const caps = selected.filter((row) => row.hard_cap_row).length;
    return `| ${label} | ${
      keys.map((key) =>
        `${key}:${averageNormalized(selected, key).toFixed(2)}/${
          averageContribution(selected, key, "weighted_contribution").toFixed(1)
        }/${averageContribution(selected, key, "weight").toFixed(1)}`
      ).join("; ")
    } | ${avgSupport.toFixed(1)} | ${pct(caps, selected.length)} | ${
      topAverageContributionVariable(selected, "negative")
    } | ${topAverageContributionVariable(selected, "positive")} |`;
  };
  return [
    rowsFor("low_side_fl_nc_mw", low),
    rowsFor("balanced_peers", peers),
    rowsFor("high_side_alaska", high),
  ].join("\n");
}

function v39ConfigDiffSummary(): string {
  return [
    "| v39_weight_rebalance_low_region_light | Reduce effective borderline-negative temperature drag in FL/NorCal/MountainWest, lightly increase positive wind/light/movement influence, cap active shift near 5 score pts; no score floors. |",
    "| v39_temp_borderline_softening_light | Soften only borderline seasonal temperature penalties in FL/NorCal/MountainWest; no severe thermal, shutdown, active rain, recent wet, or missing-data rows; no score floors. |",
    "| v39_weight_plus_temp_light | Combine the low-region light weight rebalance and borderline temperature softening, capped near 7 score pts; no score floors. |",
    "| v39_alaska_high_side_check | Diagnostic: trim only Alaska rows where positive temperature contribution appears over-weighted; no quota or direct band targeting. |",
  ].join("\n");
}

function v39SummaryTable(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): string {
  return V39_VARIANTS.map((variant) => {
    const m = allMetrics[variant];
    const spread = regionPercentSpreads(rows, variant);
    return `| ${variant} | ${
      BANDS.map((band) => m.bandDistribution[band]).join(" / ")
    } | ${Object.values(m.scoreTailHistogram).join(" / ")} / ${m.maxScore} | ${
      zeroPrimeRegions(rows, variant)
    } | ${regionsGoodPrimeBelowToughPoor(rows, variant)} | ${
      spread.goodPrimeMin.toFixed(1)
    }%-${spread.goodPrimeMax.toFixed(1)}% (${
      (spread.goodPrimeMax - spread.goodPrimeMin).toFixed(1)
    }) | ${spread.primeMin.toFixed(1)}%-${spread.primeMax.toFixed(1)}% (${
      (spread.primeMax - spread.primeMin).toFixed(1)
    }) | ${regionDistributionSummary(rows, variant, "florida")} | ${
      regionDistributionSummary(rows, variant, "northern_california")
    } | ${regionDistributionSummary(rows, variant, "mountain_west")} | ${
      compactRecord(m.guardrailViolations)
    } / ${m.reportExplainabilityFailures} / ${m.primeCautionCount} / ${m.redFlagUpgradeRows} | ${
      compactRecord(m.activityTierChanges)
    } | yes |`;
  }).join("\n");
}

function v40ConfigDiffSummary(): string {
  return [
    "| v40_temp_table_underparity_light | temp table | Recompute normalized temperature for under-parity regions only, lightly softening borderline seasonal penalties; no direct score delta. |",
    "| v40_temp_table_underparity_moderate | temp table | Same structural temp-knot idea with a stronger bounded softening; severe/shock/wet/shutdown rows blocked. |",
    "| v40_support_cap_trusted_temp | cap policy, support policy | Recompute support from adjusted contributions and allow trusted temp-suppressed rows to keep low Good; Prime remains blocked through this path. |",
    "| v40_temp_plus_support_cap | temp table, weights, cap policy, support policy | Combine moderate temp structural recalculation, small active-weight rebalancing, and trusted temperature support caps. |",
    "| v40_alaska_temp_trim_light | temp table | Diagnostic-only high-side trim where Alaska temperature contribution is structurally excessive. |",
  ].join("\n");
}

function v40SummaryTable(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): string {
  return V40_VARIANTS.map((variant) => {
    const m = allMetrics[variant];
    const spread = regionPercentSpreads(rows, variant);
    const directDelta = rows.some((row) =>
      row.candidates[variant].structural?.direct_score_delta_used
    );
    const types = Array.from(
      new Set(
        rows.flatMap((row) =>
          row.candidates[variant].structural?.productionizable_change_types ??
            []
        ),
      ),
    ).join(", ");
    return `| ${variant} | ${
      BANDS.map((band) => m.bandDistribution[band]).join(" / ")
    } | ${Object.values(m.scoreTailHistogram).join(" / ")} / ${m.maxScore} | ${
      zeroPrimeRegions(rows, variant)
    } | ${regionsGoodPrimeBelowToughPoor(rows, variant)} | ${
      spread.goodPrimeMin.toFixed(1)
    }%-${spread.goodPrimeMax.toFixed(1)}% (${
      (spread.goodPrimeMax - spread.goodPrimeMin).toFixed(1)
    }) | ${spread.primeMin.toFixed(1)}%-${spread.primeMax.toFixed(1)}% (${
      (spread.primeMax - spread.primeMin).toFixed(1)
    }) | ${regionDistributionSummary(rows, variant, "florida")} | ${
      regionDistributionSummary(rows, variant, "northern_california")
    } | ${regionDistributionSummary(rows, variant, "mountain_west")} | ${
      compactRecord(m.guardrailViolations)
    } / ${m.reportExplainabilityFailures} / ${m.primeCautionCount} / ${m.redFlagUpgradeRows} | ${
      compactRecord(m.activityTierChanges)
    } | ${directDelta ? "yes" : "no"} | ${types || "none"} |`;
  }).join("\n");
}

function v41ConfigDiffSummary(): string {
  return [
    "| v41_temp_mean_centering_light | temp table | Center stable/no-shock seasonal-normal temperatures toward neutral in under-parity regions; bad/wet/shock rows blocked. |",
    "| v41_temp_mean_centering_moderate | temp table | Stronger bounded mean-centering so seasonal-normal rows are neutral to mildly positive, not hot. |",
    "| v41_temp_table_knot_repair | temp table | Simulates cool-knot repair for under-parity region/months where stable seasonal conditions are viable. |",
    "| v41_temp_plus_trusted_support | temp table, weights, cap policy, support policy | Combines knot repair with adjusted support/cap evaluation; support policy cannot create Prime. |",
    "| v41_prime_gate_clean | temp table, weights, cap policy, support policy | Same structural scoring with Prime blocked on red-flag archetypes and adjusted surfaced-driver count < 2. |",
    "| v41_alaska_high_side_diagnostic | temp table | Separate high-side diagnostic trim; not eligible to be selected over low-region repair. |",
  ].join("\n");
}

function v41SummaryTable(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): string {
  return V41_VARIANTS.map((variant) => {
    const m = allMetrics[variant];
    const spread = regionPercentSpreads(rows, variant);
    const directDelta = rows.some((row) =>
      row.candidates[variant].structural?.direct_score_delta_used
    );
    const types = Array.from(
      new Set(
        rows.flatMap((row) =>
          row.candidates[variant].structural?.productionizable_change_types ??
            []
        ),
      ),
    ).join(", ");
    return `| ${variant} | ${
      BANDS.map((band) => m.bandDistribution[band]).join(" / ")
    } | ${Object.values(m.scoreTailHistogram).join(" / ")} / ${m.maxScore} | ${
      zeroPrimeRegions(rows, variant)
    } | ${regionsGoodPrimeBelowToughPoor(rows, variant)} | ${
      spread.goodPrimeMin.toFixed(1)
    }%-${spread.goodPrimeMax.toFixed(1)}% (${
      (spread.goodPrimeMax - spread.goodPrimeMin).toFixed(1)
    }) | ${spread.primeMin.toFixed(1)}%-${spread.primeMax.toFixed(1)}% (${
      (spread.primeMax - spread.primeMin).toFixed(1)
    }) | ${regionDistributionSummary(rows, variant, "florida")} | ${
      regionDistributionSummary(rows, variant, "northern_california")
    } | ${regionDistributionSummary(rows, variant, "mountain_west")} | ${
      compactRecord(m.guardrailViolations)
    } / ${m.reportExplainabilityFailures} / ${m.primeCautionCount} / ${m.redFlagUpgradeRows} | ${
      compactRecord(m.activityTierChanges)
    } | ${directDelta ? "yes" : "no"} | ${types || "none"} |`;
  }).join("\n");
}

function priorityRegionalMetricsTable(
  rows: AuditRow[],
  variant: VariantId,
): string {
  const groups: Array<[string, RegionKey[]]> = [
    ["all_regions", [...CANONICAL_REGION_KEYS]],
    ["core_mainland", [...CORE_MAINLAND_REGIONS]],
    ["alaska", ["alaska"]],
    ["hawaii", ["hawaii"]],
  ];
  return groups.map(([label, regions]) => {
    const spread = regionPercentSpreads(rows, variant, regions);
    return `| ${label} | ${distributionForRegions(rows, variant, regions)} | ${
      (spread.goodPrimeMax - spread.goodPrimeMin).toFixed(1)
    } | ${(spread.primeMax - spread.primeMin).toFixed(1)} | ${
      zeroPrimeRegionsFor(rows, variant, regions)
    } | ${regionsBelowToughPoorFor(rows, variant, regions)} |`;
  }).join("\n");
}

function redFlagContainmentTable(rows: AuditRow[], variant: VariantId): string {
  const selected = rows.filter((row) =>
    isRedFlagUpgrade(row, row.candidates[variant])
  );
  const countBy = (keyFor: (row: AuditRow) => string) => {
    const counts: Record<string, number> = {};
    for (const row of selected) {
      counts[keyFor(row)] = (counts[keyFor(row)] ?? 0) + 1;
    }
    return topRecordEntries(counts, 10);
  };
  const good =
    selected.filter((row) => row.candidates[variant].band === "Good").length;
  const prime =
    selected.filter((row) => row.candidates[variant].band === "Prime").length;
  return [
    `| red_flags_to_good_vs_prime | Good:${good}, Prime:${prime} |`,
    `| by_archetype | ${countBy((row) => row.archetype)} |`,
    `| by_region | ${countBy((row) => row.region)} |`,
    `| by_context | ${countBy((row) => row.context)} |`,
    `| by_transition | ${
      countBy((row) =>
        `${row.production.band}->${row.candidates[variant].band}`
      )
    } |`,
    `| by_score_bucket | ${
      countBy((row) => {
        const score = row.candidates[variant].score;
        return score >= 80 ? "80+" : score >= 70 ? "70-79" : "65-69";
      })
    } |`,
  ].join("\n");
}

function topLabels(items: ContributionSnapshot[]): string {
  return items.slice(0, 2).map((item) =>
    `${item.label} (${item.weighted_contribution.toFixed(1)})`
  ).join("; ") || "none";
}

function redFlagExampleRows(rows: AuditRow[], variant: VariantId): string {
  return rows.filter((row) => isRedFlagUpgrade(row, row.candidates[variant]))
    .sort((a, b) =>
      b.candidates[variant].score - a.candidates[variant].score ||
      a.region.localeCompare(b.region)
    )
    .slice(0, 20)
    .map((row) => {
      const candidate = row.candidates[variant];
      const support = candidate.structural?.adjusted_support ??
        row.condition_support;
      return `| ${row.region} | ${row.context} | ${row.month} | ${row.archetype} | ${row.production.score}->${candidate.score} | ${row.production.band}->${candidate.band} | ${support.surfaced_driver_count} | ${
        support.positive_driver_mass.toFixed(1)
      } | ${support.negative_suppressor_mass.toFixed(1)} | ${
        topLabels(
          candidate.structural?.adjusted_drivers ?? row.production.drivers,
        )
      } | ${
        topLabels(
          candidate.structural?.adjusted_suppressors ??
            row.production.suppressors,
        )
      } |`;
    }).join("\n") || "| none |  |  |  |  |  |  |  |  |  |  |";
}

function v42SummaryTable(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): string {
  return V42_VARIANTS.map((variant) => {
    const m = allMetrics[variant];
    const coreSpread = regionPercentSpreads(
      rows,
      variant,
      CORE_MAINLAND_REGIONS,
    );
    return `| ${variant} | ${
      BANDS.map((band) => m.bandDistribution[band]).join(" / ")
    } | ${distributionForRegions(rows, variant, CORE_MAINLAND_REGIONS)} | ${
      Object.values(m.scoreTailHistogram).join(" / ")
    } / ${m.maxScore} | ${
      zeroPrimeRegionsFor(rows, variant, CORE_MAINLAND_REGIONS)
    } | ${regionsBelowToughPoorFor(rows, variant, CORE_MAINLAND_REGIONS)} | ${
      (coreSpread.goodPrimeMax - coreSpread.goodPrimeMin).toFixed(1)
    } | ${(coreSpread.primeMax - coreSpread.primeMin).toFixed(1)} | ${
      regionDistributionSummary(rows, variant, "florida")
    } | ${regionDistributionSummary(rows, variant, "northern_california")} | ${
      regionDistributionSummary(rows, variant, "mountain_west")
    } | ${
      compactRecord(m.guardrailViolations)
    } / ${m.reportExplainabilityFailures} / ${m.primeCautionCount} / ${m.redFlagUpgradeRows} | ${
      compactRecord(m.activityTierChanges)
    } |`;
  }).join("\n");
}

function v43SummaryTable(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): string {
  return V43_VARIANTS.map((variant) => {
    const m = allMetrics[variant];
    const coreSpread = regionPercentSpreads(
      rows,
      variant,
      CORE_MAINLAND_REGIONS,
    );
    return `| ${variant} | ${
      BANDS.map((band) => m.bandDistribution[band]).join(" / ")
    } | ${distributionForRegions(rows, variant, CORE_MAINLAND_REGIONS)} | ${
      Object.values(m.scoreTailHistogram).join(" / ")
    } / ${m.maxScore} | ${
      zeroPrimeRegionsFor(rows, variant, CORE_MAINLAND_REGIONS)
    } | ${regionsBelowToughPoorFor(rows, variant, CORE_MAINLAND_REGIONS)} | ${
      (coreSpread.goodPrimeMax - coreSpread.goodPrimeMin).toFixed(1)
    } | ${(coreSpread.primeMax - coreSpread.primeMin).toFixed(1)} | ${
      regionDistributionSummary(rows, variant, "florida")
    } | ${regionDistributionSummary(rows, variant, "northern_california")} | ${
      regionDistributionSummary(rows, variant, "mountain_west")
    } | ${regionDistributionSummary(rows, variant, "appalachian")} | ${
      compactRecord(m.guardrailViolations)
    } / ${m.reportExplainabilityFailures} / ${m.primeCautionCount} / ${m.redFlagUpgradeRows} | ${
      formerRedFlagPrimeCount(rows, variant)
    } | ${compactRecord(m.activityTierChanges)} | ${
      v43ProductionizableScoringCheck(variant)
    } |`;
  }).join("\n");
}

function v43FloridaPrimeDebugTable(rows: AuditRow[]): string {
  return rows.filter((row) => row.region === "florida")
    .sort((a, b) => {
      const ap = a.candidates.v43_runtime_prime_gate_clean.structural
        ?.adjusted_pre_cap_score ?? 0;
      const bp = b.candidates.v43_runtime_prime_gate_clean.structural
        ?.adjusted_pre_cap_score ?? 0;
      return bp - ap ||
        b.candidates.v43_runtime_prime_gate_clean.score -
          a.candidates.v43_runtime_prime_gate_clean.score ||
        b.production.score - a.production.score;
    })
    .slice(0, 50)
    .map((row) => {
      const candidate = row.candidates.v43_runtime_prime_gate_clean;
      const adjustedRow = v40StructuralBase(
        row,
        "v43_runtime_prime_gate_clean",
      ).adjustedRow;
      const preCap = candidate.structural?.adjusted_pre_cap_score ?? 0;
      const v41 = row.candidates.v41_prime_gate_clean;
      const bestV42 = row.candidates.v42_redflag_good_cap_light;
      return `| ${row.month} | ${row.context} | ${row.archetype} | ${row.production.score} | ${v41.score}/${v41.band} | ${bestV42.score}/${bestV42.band} | ${preCap} | ${candidate.score}/${candidate.band} | ${
        row.production.timing_strength ?? "null"
      } | ${
        candidate.structural?.adjusted_support.positive_driver_mass.toFixed(1)
      } | ${
        candidate.structural?.adjusted_support.negative_suppressor_mass.toFixed(
          1,
        )
      } | ${
        topLabels(
          candidate.structural?.adjusted_drivers ?? row.production.drivers,
        )
      } | ${
        topLabels(
          candidate.structural?.adjusted_suppressors ??
            row.production.suppressors,
        )
      } | ${
        v43RuntimePrimeDisqualificationReasons(
          adjustedRow,
          Math.max(preCap, candidate.score),
        ).join("; ") || "none"
      } |`;
    }).join("\n");
}

function floridaPrimeStatus(rows: AuditRow[], variant: VariantId): string {
  const floridaRows = rows.filter((row) => row.region === "florida");
  const primeRows = floridaRows.filter((row) =>
    row.candidates[variant].band === "Prime"
  );
  const maxScore = Math.max(
    ...floridaRows.map((row) => row.candidates[variant].score),
  );
  if (primeRows.length > 0) {
    return `${primeRows.length} Prime / max ${maxScore}`;
  }
  const reasonCounts: Record<string, number> = {};
  for (
    const row of floridaRows.sort((a, b) =>
      b.candidates[variant].score - a.candidates[variant].score
    ).slice(0, 80)
  ) {
    const candidate = row.candidates[variant];
    const adjustedRow = isV40Variant(variant)
      ? v40StructuralBase(row, variant).adjustedRow
      : row;
    const reasons = isV43RuntimeScoringVariant(variant)
      ? v43RuntimePrimeDisqualificationReasons(adjustedRow, candidate.score)
      : productionizablePrimeDisqualificationReasons(adjustedRow);
    for (const reason of reasons.slice(0, 3)) {
      reasonCounts[reason] = (reasonCounts[reason] ?? 0) + 1;
    }
  }
  return `0 Prime / max ${maxScore}; top disqualifiers ${
    topRecordEntries(reasonCounts, 5)
  }`;
}

function seasonalMeanAlignmentSummary(
  rows: AuditRow[],
  variant: VariantId,
): string {
  return CANONICAL_REGION_KEYS.map((region) => {
    const selected = rows.filter((row) =>
      row.region === region && row.archetype === "stable_good" &&
      row.water_clarity === "clear"
    );
    const flagged = selected.filter((row) => {
      const temp = contributionByKey(row, "temperature_condition");
      return (temp?.score ?? 0) <= -0.25 ||
        (temp?.weighted_contribution ?? 0) <= -6;
    });
    const worstMonths = Array.from({ length: 12 }, (_, index) => index + 1)
      .map((month) => {
        const monthRows = flagged.filter((row) => row.month === month);
        return { month, count: monthRows.length };
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count || a.month - b.month)
      .slice(0, 4)
      .map((item) => `${item.month}:${item.count}`)
      .join(", ") || "none";
    const avgTemp = selected.reduce(
      (sum, row) =>
        sum + (contributionByKey(row, "temperature_condition")?.score ?? 0),
      0,
    ) / Math.max(1, selected.length);
    const avgContribution = selected.reduce(
      (sum, row) =>
        sum +
        (contributionByKey(row, "temperature_condition")
          ?.weighted_contribution ?? 0),
      0,
    ) / Math.max(1, selected.length);
    const candidateGoodPrime = selected.filter((row) =>
      row.candidates[variant].band === "Good" ||
      row.candidates[variant].band === "Prime"
    ).length;
    return `| ${region} | ${flagged.length}/${selected.length} | ${
      avgTemp.toFixed(2)
    } | ${avgContribution.toFixed(1)} | ${
      pct(candidateGoodPrime, selected.length)
    } | ${worstMonths} |`;
  }).join("\n");
}

function v40TemperatureAverages(rows: AuditRow[], variant: VariantId): string {
  return CANONICAL_REGION_KEYS.map((region) => {
    const selected = rows.filter((row) => row.region === region);
    const production = averageContribution(
      selected,
      "temperature_condition",
      "weighted_contribution",
    );
    const adjustedValues = selected.flatMap((row) => {
      const adjusted = row.candidates[variant].structural
        ?.adjusted_weighted_contributions.find((c) =>
          c.key === "temperature_condition"
        );
      return adjusted ? [adjusted.weighted_contribution] : [];
    });
    const adjusted = adjustedValues.length
      ? adjustedValues.reduce((sum, value) => sum + value, 0) /
        adjustedValues.length
      : production;
    return `| ${region} | ${production.toFixed(1)} | ${adjusted.toFixed(1)} | ${
      (adjusted - production).toFixed(1)
    } |`;
  }).join("\n");
}

function v40SupportCapChanges(rows: AuditRow[], variant: VariantId): string {
  const changedSupport = rows.filter((row) => {
    const s = row.candidates[variant].structural;
    return s &&
      (s.adjusted_clean_support !== row.clean_support ||
        s.adjusted_strong_support !== row.strong_support ||
        s.adjusted_trusted_support !== row.trusted_suppressor_support);
  }).length;
  const capLimited = rows.filter((row) => {
    const candidate = row.candidates[variant];
    const preCap = candidate.structural?.adjusted_pre_cap_score ?? 0;
    return preCap > candidate.score;
  }).length;
  const tempTrusted =
    rows.filter((row) =>
      row.candidates[variant].structural?.adjusted_trusted_support &&
      !row.trusted_suppressor_support
    ).length;
  return `| ${variant} | ${changedSupport} | ${tempTrusted} | ${capLimited} |`;
}

function v40RootCauseSummary(rows: AuditRow[], variant: VariantId): string {
  const failing = regionsGoodPrimeBelowToughPoor(rows, variant)
    .split(", ")
    .filter((region): region is RegionKey =>
      CANONICAL_REGION_KEYS.includes(region as RegionKey)
    );
  const selected = rows.filter((row) => failing.includes(row.region));
  const reasons = [
    `temperature contribution avg ${
      averageContribution(
        selected,
        "temperature_condition",
        "weighted_contribution",
      )
        .toFixed(1)
    }`,
    `surfaced drivers avg ${
      (selected.reduce(
        (sum, row) => sum + row.condition_support.surfaced_driver_count,
        0,
      ) / Math.max(1, selected.length)).toFixed(1)
    }`,
    `hard-cap rows ${
      pct(selected.filter((row) => row.hard_cap_row).length, selected.length)
    }`,
    `top negative ${topAverageContributionVariable(selected, "negative")}`,
    `top positive ${topAverageContributionVariable(selected, "positive")}`,
  ];
  return reasons.map((reason, index) => `| ${index + 1} | ${reason} |`).join(
    "\n",
  );
}

function regionDistributionSummary(
  rows: AuditRow[],
  variant: VariantId,
  region: RegionKey,
): string {
  const regionRows = rows.filter((row) => row.region === region);
  const counts = emptyBandCounts();
  let maxScore = 0;
  for (const row of regionRows) {
    const candidate = row.candidates[variant];
    counts[candidate.band]++;
    maxScore = Math.max(maxScore, candidate.score);
  }
  const goodPrime = counts.Good + counts.Prime;
  return `${
    BANDS.map((band) => counts[band]).join("/")
  } / max ${maxScore} / Good+Prime ${pct(goodPrime, regionRows.length)}`;
}

function v38FairnessSummaryTable(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): string {
  return V38_VARIANTS.map((variant) => {
    const m = allMetrics[variant];
    const spread = regionPercentSpreads(rows, variant);
    return `| ${variant} | ${
      BANDS.map((band) => m.bandDistribution[band]).join(" / ")
    } | ${Object.values(m.scoreTailHistogram).join(" / ")} / ${m.maxScore} | ${
      zeroPrimeRegions(rows, variant)
    } | ${regionsGoodPrimeBelowToughPoor(rows, variant)} | ${
      spread.goodPrimeMin.toFixed(1)
    }%-${spread.goodPrimeMax.toFixed(1)}% (${
      (spread.goodPrimeMax - spread.goodPrimeMin).toFixed(1)
    }) | ${spread.primeMin.toFixed(1)}%-${spread.primeMax.toFixed(1)}% (${
      (spread.primeMax - spread.primeMin).toFixed(1)
    }) | ${regionDistributionSummary(rows, variant, "florida")} | ${
      regionDistributionSummary(rows, variant, "northern_california")
    } | ${
      compactRecord(m.guardrailViolations)
    } / ${m.reportExplainabilityFailures} / ${m.primeCautionCount} | ${m.redFlagUpgradeRows} | ${
      compactRecord(m.activityTierChanges)
    } | ${rowsExceedingV35ByMoreThan8(rows, variant)} |`;
  }).join("\n");
}

function v38MovementTable(rows: AuditRow[], variant: VariantId): string {
  return [...STRUCTURALLY_PESSIMISTIC_REGIONS].map((region) => {
    const regionRows = rows.filter((row) => row.region === region);
    let fairGood = 0;
    let goodPrime = 0;
    let fairPrime = 0;
    const eligibleReasons: Record<string, number> = {};
    const rejectedReasons: Record<string, number> = {};
    for (const row of regionRows) {
      const transition = `${row.production.band}->${
        row.candidates[variant].band
      }`;
      if (transition === "Fair->Good") fairGood++;
      if (transition === "Good->Prime") goodPrime++;
      if (transition === "Fair->Prime") fairPrime++;
      const baseScore = row.candidates
        .curve_timing_selective_prime_v35_productionizable_tail_plus
        .score;
      const reasons = v38SupportedFairFloorRejectionReasons(row, baseScore);
      if (reasons.length === 0) {
        eligibleReasons[
          row.trusted_suppressor_support ? "trusted_suppressor_support" : row
              .strong_support
            ? "strong_support"
            : "clean_support"
        ] = (eligibleReasons[
          row.trusted_suppressor_support ? "trusted_suppressor_support" : row
              .strong_support
            ? "strong_support"
            : "clean_support"
        ] ?? 0) + 1;
      } else {
        for (const reason of reasons.slice(0, 3)) {
          rejectedReasons[reason] = (rejectedReasons[reason] ?? 0) + 1;
        }
      }
    }
    return `| ${region} | ${fairGood} | ${goodPrime} | ${fairPrime} | ${
      topRecordEntries(eligibleReasons, 3)
    } | ${topRecordEntries(rejectedReasons, 5)} |`;
  }).join("\n");
}

function regionTopRowsTable(
  rows: AuditRow[],
  variant: VariantId,
  region: RegionKey,
): string {
  return rows.filter((row) => row.region === region)
    .sort((a, b) =>
      b.candidates[variant].score - a.candidates[variant].score ||
      b.production.score - a.production.score ||
      a.context.localeCompare(b.context)
    )
    .slice(0, 30)
    .map((row) => {
      const candidate = row.candidates[variant];
      return `| ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${row.production.score} | ${row.candidates.curve_timing_selective_prime_v35_productionizable_tail_plus.score} | ${candidate.score} | ${
        row.production.timing_strength ?? "null"
      } | ${row.condition_support.positive_driver_mass.toFixed(1)} | ${
        row.condition_support.negative_suppressor_mass.toFixed(1)
      } | ${topContributionLabels(row.production.drivers)} | ${
        topContributionLabels(row.production.suppressors)
      } | ${
        v38SupportedFairFloorRejectionReasons(row, candidate.score).join(
          "; ",
        ) ||
        "eligible_or_not_in_floor_window"
      } |`;
    }).join("\n");
}

function v38LiftedSampleRows(rows: AuditRow[], variant: VariantId): string {
  return rows.filter((row) =>
    STRUCTURALLY_PESSIMISTIC_REGIONS.has(row.region) &&
    row.production.band === "Fair" &&
    row.candidates[variant].band === "Good" &&
    row.candidates.curve_timing_selective_prime_v35_productionizable_tail_plus
        .band !== "Good"
  )
    .sort((a, b) =>
      a.region.localeCompare(b.region) || a.month - b.month ||
      a.context.localeCompare(b.context) ||
      a.archetype.localeCompare(b.archetype)
    )
    .slice(0, 30)
    .map((row) =>
      `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${row.production.score} | ${row.candidates.curve_timing_selective_prime_v35_productionizable_tail_plus.score} | ${
        row.candidates[variant].score
      } | ${row.production.timing_strength ?? "null"} | ${
        row.condition_support.positive_driver_mass.toFixed(1)
      } | ${row.condition_support.negative_suppressor_mass.toFixed(1)} | ${
        topContributionLabels(row.production.drivers)
      } | ${topContributionLabels(row.production.suppressors)} | eligible |`
    ).join("\n");
}

function lowPrimeRegionReasonTable(
  rows: AuditRow[],
  variant: VariantId,
): string {
  return CANONICAL_REGION_KEYS.map((region) => {
    const regionRows = rows.filter((row) => row.region === region);
    const primeCount = regionRows.filter((row) =>
      row.candidates[variant].band === "Prime"
    ).length;
    const reasonCounts: Record<string, number> = {};
    for (const row of regionRows) {
      if (row.candidates[variant].band === "Prime") continue;
      for (const reason of productionizablePrimeDisqualificationReasons(row)) {
        const key = reason.replace(/:.*/, "");
        reasonCounts[key] = (reasonCounts[key] ?? 0) + 1;
      }
    }
    return `| ${region} | ${primeCount} | ${
      topRecordEntries(reasonCounts, 5)
    } |`;
  }).join("\n");
}

function floridaContextTable(rows: AuditRow[], variant: VariantId): string {
  return CONTEXTS.map((context) => {
    const selected = rows.filter((row) =>
      row.region === "florida" && row.context === context
    );
    const counts = emptyBandCounts();
    for (const row of selected) counts[row.candidates[variant].band]++;
    return `| ${context} | ${BANDS.map((band) => counts[band]).join(" / ")} |`;
  }).join("\n");
}

function floridaMonthTable(rows: AuditRow[], variant: VariantId): string {
  return Array.from({ length: 12 }, (_, index) => index + 1).map((month) => {
    const selected = rows.filter((row) =>
      row.region === "florida" && row.month === month
    );
    const counts = emptyBandCounts();
    for (const row of selected) counts[row.candidates[variant].band]++;
    return `| ${month} | ${BANDS.map((band) => counts[band]).join(" / ")} |`;
  }).join("\n");
}

function labelList(items: string[]): string {
  return items.length ? items.join("; ") : "none";
}

function topContributionLabels(items: ContributionSnapshot[]): string {
  return items.slice(0, 3).map((item) =>
    `${item.label} (${item.weighted_contribution.toFixed(1)})`
  ).join("; ") || "none";
}

function floridaTopRowsTable(rows: AuditRow[], variant: VariantId): string {
  return rows.filter((row) => row.region === "florida")
    .sort((a, b) =>
      b.candidates[variant].score - a.candidates[variant].score ||
      b.production.score - a.production.score ||
      a.context.localeCompare(b.context)
    )
    .slice(0, 30)
    .map((row) => {
      const candidate = row.candidates[variant];
      return `| ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${row.production.score} | ${candidate.score} | ${
        row.production.timing_strength ?? "null"
      } | ${row.condition_support.positive_driver_mass.toFixed(1)} | ${
        row.condition_support.negative_suppressor_mass.toFixed(1)
      } | ${topContributionLabels(row.production.drivers)} | ${
        topContributionLabels(row.production.suppressors)
      } | ${
        productionizablePrimeDisqualificationReasons(row).join("; ") || "none"
      } |`;
    }).join("\n");
}

function bestV36(allMetrics: Record<string, Metrics>): VariantId {
  const variants = [
    "curve_timing_selective_prime_v36_minor_negative_tail_plus",
    "curve_timing_selective_prime_v36_minor_negative_floor",
  ] as const;
  return variants.sort((a, b) => {
    const ma = allMetrics[a];
    const mb = allMetrics[b];
    const score = (m: Metrics) =>
      m.bandDistribution.Prime * 2 + m.bandDistribution.Good -
      m.redFlagUpgradeRows * 4 -
      m.reportExplainabilityFailures * 100 -
      m.primeCautionCount * 50 -
      Object.values(m.guardrailViolations).reduce(
          (sum, value) => sum + value,
          0,
        ) *
        100;
    return score(mb) - score(ma);
  })[0];
}

function copyAlignmentConcerns(row: AuditRow, variant: VariantId): string[] {
  const candidate = row.candidates[variant];
  const surface = row.production.report_surface;
  const concerns: string[] = [];
  const summary = surface.summary_line.toLowerCase();
  const tip = surface.actionable_tip.toLowerCase();
  const timing = (surface.timing_insight ?? "").toLowerCase();
  const favorable = /good|prime|favorable|strong|excellent|solid|great/.test(
    summary,
  );
  const aggressive = /aggressive|cover water|power|fast|reaction|moving/.test(
    tip,
  );
  if (favorable && row.condition_support.surfaced_driver_count === 0) {
    concerns.push("favorable_summary_without_drivers");
  }
  if (
    (candidate.band === "Good" || candidate.band === "Prime") &&
    row.condition_support.surfaced_driver_count === 0
  ) concerns.push("good_prime_no_surfaced_explanation");
  if (aggressive && row.condition_support.negative_suppressor_mass >= 8) {
    concerns.push("aggressive_tip_with_suppressor_mass");
  }
  if (
    row.condition_support.negative_suppressor_mass >= 8 &&
    surface.suppressor_labels.length === 0
  ) concerns.push("missing_limiting_factor");
  if (
    (candidate.band === "Tough" || candidate.band === "Poor") &&
    /very strong|strong window|best window/.test(timing)
  ) concerns.push("timing_tone_too_bullish_for_band");
  for (const item of row.production.drivers) {
    if (item.score < 0) concerns.push(`driver_negative:${item.key}`);
  }
  for (const item of row.production.suppressors) {
    if (item.score > 0) concerns.push(`suppressor_positive:${item.key}`);
  }
  return concerns;
}

function copySampleRows(rows: AuditRow[], variant: VariantId): AuditRow[] {
  const picks: AuditRow[] = [];
  const add = (predicate: (row: AuditRow) => boolean) => {
    const found = rows.find((row) => predicate(row) && !picks.includes(row));
    if (found) picks.push(found);
  };
  const sorted = [...rows].sort((a, b) =>
    a.candidates[variant].score - b.candidates[variant].score
  );
  add((row) =>
    row.candidates[variant].band === "Good" &&
    row.candidates[variant].score <= 67
  );
  add((row) =>
    row.candidates[variant].band === "Good" &&
    row.candidates[variant].score >= 75
  );
  add((row) =>
    row.candidates[variant].band === "Prime" &&
    row.candidates[variant].score <= 84
  );
  add((row) =>
    row.candidates[variant].band === "Prime" &&
    row.candidates[variant].score >= 95
  );
  add((row) =>
    row.candidates[variant].band === "Good" &&
    row.condition_support.negative_suppressor_mass >= 6
  );
  add((row) =>
    row.candidates[variant].band === "Good" &&
    row.condition_support.surfaced_driver_count === 1
  );
  add((row) =>
    (row.production.band === "Poor" || row.production.band === "Fair") &&
    row.condition_support.negative_suppressor_mass >= 6
  );
  return picks.length ? picks : sorted.slice(0, 7);
}

function reportCopyAlignmentTable(
  rows: AuditRow[],
  variants: VariantId[],
): string {
  return variants.flatMap((variant) =>
    copySampleRows(rows, variant).map((row) => {
      const candidate = row.candidates[variant];
      const surface = row.production.report_surface;
      const concerns = copyAlignmentConcerns(row, variant);
      return `| ${variant} | ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${candidate.score} | ${candidate.band} | ${surface.summary_line} | ${
        labelList(surface.driver_labels)
      } | ${
        labelList(surface.suppressor_labels)
      } | ${surface.actionable_tip} | ${surface.timing_insight ?? "none"} | ${
        surface.solunar_note ?? "none"
      } | ${concerns.join("; ") || "none"} |`;
    })
  ).join("\n");
}

function copyAlignmentFailureCount(
  rows: AuditRow[],
  variants: VariantId[],
): number {
  return variants.reduce(
    (sum, variant) =>
      sum +
      copySampleRows(rows, variant).filter((row) =>
        copyAlignmentConcerns(row, variant).length > 0
      ).length,
    0,
  );
}

type UnsafeUpgradeClassification = {
  unsafe: boolean;
  benign_supported: boolean;
  reasons: string[];
};

type CopyAlignmentAudit = {
  copy_alignment_failure_count: number;
  contradiction_count: number;
  missing_factor_count: number;
  stale_production_factor_count: number;
};

function candidateStructuralRow(
  row: AuditRow,
  variant: VariantId = SCORING_FINALIST,
): Omit<AuditRow, "candidates"> {
  return isV40Variant(variant)
    ? v40StructuralBase(row, variant).adjustedRow
    : row;
}

function candidateSupportFor(
  row: AuditRow,
  variant: VariantId = SCORING_FINALIST,
): ConditionSupportDiagnostics {
  return row.candidates[variant].structural?.adjusted_support ??
    row.condition_support;
}

function candidateDriversFor(
  row: AuditRow,
  variant: VariantId = SCORING_FINALIST,
): ContributionSnapshot[] {
  return row.candidates[variant].structural?.adjusted_drivers ??
    row.production.drivers;
}

function candidateSuppressorsFor(
  row: AuditRow,
  variant: VariantId = SCORING_FINALIST,
): ContributionSnapshot[] {
  return row.candidates[variant].structural?.adjusted_suppressors ??
    row.production.suppressors;
}

function sameContributionKeys(
  a: ContributionSnapshot[],
  b: ContributionSnapshot[],
): boolean {
  return a.map((item) => item.key).join(",") ===
    b.map((item) => item.key).join(",");
}

function unsafeUpgradeClassification(
  row: AuditRow,
  variant: VariantId = SCORING_FINALIST,
): UnsafeUpgradeClassification {
  const candidate = row.candidates[variant];
  const adjustedRow = candidateStructuralRow(row, variant);
  const support = candidateSupportFor(row, variant);
  const reasons: string[] = [];
  const upgradedToGood = (row.production.band === "Poor" ||
    row.production.band === "Fair") && candidate.band === "Good";
  const upgradedToGoodPrime = (row.production.band === "Poor" ||
    row.production.band === "Fair") &&
    (candidate.band === "Good" || candidate.band === "Prime");
  if (!upgradedToGoodPrime) {
    return { unsafe: false, benign_supported: false, reasons };
  }
  const dominance = support.positive_driver_mass -
    support.negative_suppressor_mass;
  const untrustedSuppressor = (support.strongest_suppressor_contribution <=
    -6) &&
    !(candidate.structural?.adjusted_trusted_support ??
      row.trusted_suppressor_support);
  if (
    row.production.band === "Poor" && candidate.band === "Good" &&
    support.surfaced_driver_count < 2
  ) {
    reasons.push("poor_to_good_with_lt_2_drivers");
  }
  if (upgradedToGood && dominance < 10) {
    reasons.push("good_upgrade_dominance_lt_10");
  }
  if (upgradedToGood && support.strongest_driver_contribution < 12) {
    reasons.push("strongest_driver_lt_12");
  }
  if (upgradedToGood && untrustedSuppressor) {
    reasons.push("untrusted_moderate_or_major_suppressor");
  }
  if (row.active_heavy_rain) reasons.push("active_heavy_rain");
  if (row.recent_wet_rain) reasons.push("recent_wet_rain");
  if (adjustedRow.severe_movement_runoff_precip_row) {
    reasons.push("severe_movement_runoff_precip");
  }
  if (adjustedRow.severe_thermal_row) reasons.push("severe_thermal");
  if (
    row.production.missing_variables.length || row.production.data_gaps.length
  ) {
    reasons.push("missing_or_data_gap");
  }
  if (row.production.reliability !== "high") {
    reasons.push("non_high_reliability");
  }
  if (
    candidate.score >= 75 &&
    (support.surfaced_driver_count < 2 || dominance < 14 ||
      support.strongest_driver_contribution < 14)
  ) {
    reasons.push("score_75_plus_with_weak_support");
  }
  if (candidate.band === "Prime" && RED_FLAG_ARCHETYPES.has(row.archetype)) {
    reasons.push("diagnostic_red_flag_prime");
  }
  const runtimeHardRisk = row.active_heavy_rain ||
    row.recent_wet_rain ||
    adjustedRow.severe_movement_runoff_precip_row ||
    adjustedRow.severe_thermal_row ||
    row.production.missing_variables.length > 0 ||
    row.production.data_gaps.length > 0 ||
    row.production.reliability !== "high";
  const benign_supported = upgradedToGoodPrime &&
    candidate.band !== "Prime" &&
    support.surfaced_driver_count >= 2 &&
    (candidate.structural?.adjusted_clean_support ||
      candidate.structural?.adjusted_trusted_support) &&
    dominance >= 10 &&
    !runtimeHardRisk &&
    support.strongest_suppressor_contribution > -10;
  return { unsafe: reasons.length > 0, benign_supported, reasons };
}

function unsafeUpgradeStats(rows: AuditRow[], variant: VariantId): {
  diagnosticRedFlags: number;
  unsafe: number;
  benign: number;
  blockers: string;
} {
  let diagnosticRedFlags = 0;
  let unsafe = 0;
  let benign = 0;
  for (const row of rows) {
    if (isRedFlagUpgrade(row, row.candidates[variant])) diagnosticRedFlags++;
    const classified = unsafeUpgradeClassification(row, variant);
    if (classified.unsafe) unsafe++;
    if (classified.benign_supported) benign++;
  }
  const blockers = unsafe === 0
    ? "none"
    : unsafe <= 250
    ? "reviewable, not a scoring blocker"
    : "requires product review before shipping";
  return { diagnosticRedFlags, unsafe, benign, blockers };
}

function unsafeUpgradeSourceTable(
  rows: AuditRow[],
  variant: VariantId,
): string {
  const byRegion: Record<string, number> = {};
  const byContext: Record<string, number> = {};
  const byArchetype: Record<string, number> = {};
  const byReason: Record<string, number> = {};
  for (const row of rows) {
    const classified = unsafeUpgradeClassification(row, variant);
    if (!classified.unsafe) continue;
    byRegion[row.region] = (byRegion[row.region] ?? 0) + 1;
    byContext[row.context] = (byContext[row.context] ?? 0) + 1;
    byArchetype[row.archetype] = (byArchetype[row.archetype] ?? 0) + 1;
    for (const reason of classified.reasons) {
      byReason[reason] = (byReason[reason] ?? 0) + 1;
    }
  }
  return [
    `| by_region | ${topRecordEntries(byRegion, 10)} |`,
    `| by_context | ${topRecordEntries(byContext, 10)} |`,
    `| by_archetype | ${topRecordEntries(byArchetype, 10)} |`,
    `| by_reason | ${topRecordEntries(byReason, 10)} |`,
  ].join("\n");
}

function unsafeUpgradeExamples(rows: AuditRow[], variant: VariantId): string {
  return rows
    .map((row) => ({
      row,
      classified: unsafeUpgradeClassification(row, variant),
    }))
    .filter((item) => item.classified.unsafe)
    .sort((a, b) =>
      b.row.candidates[variant].score - a.row.candidates[variant].score ||
      b.classified.reasons.length - a.classified.reasons.length ||
      a.row.region.localeCompare(b.row.region)
    )
    .slice(0, 20)
    .map(({ row, classified }) => {
      const candidate = row.candidates[variant];
      const support = candidateSupportFor(row, variant);
      return `| ${row.region} | ${row.context} | ${row.month} | ${row.archetype} | ${row.production.score}->${candidate.score} | ${row.production.band}->${candidate.band} | ${support.surfaced_driver_count} | ${
        (support.positive_driver_mass - support.negative_suppressor_mass)
          .toFixed(1)
      } | ${support.strongest_driver_contribution.toFixed(1)} | ${
        classified.reasons.join("; ")
      } | ${topLabels(candidateDriversFor(row, variant))} | ${
        topLabels(candidateSuppressorsFor(row, variant))
      } |`;
    }).join("\n") ||
    "| none |  |  |  |  |  |  |  |  |  |  |";
}

function severeThermalGoodRows(rows: AuditRow[], variant: VariantId): number {
  return rows.filter((row) => {
    const candidate = row.candidates[variant];
    const adjustedRow = candidateStructuralRow(row, variant);
    return candidate.band === "Good" && adjustedRow.severe_thermal_row;
  }).length;
}

function severeThermalUpgradeGoodRows(
  rows: AuditRow[],
  variant: VariantId,
): number {
  return rows.filter((row) => {
    const candidate = row.candidates[variant];
    const adjustedRow = candidateStructuralRow(row, variant);
    return (row.production.band === "Poor" || row.production.band === "Fair") &&
      candidate.band === "Good" &&
      adjustedRow.severe_thermal_row;
  }).length;
}

function monthContextSanityTable(
  rows: AuditRow[],
  variant: VariantId,
  regions: readonly RegionKey[],
): string {
  const lines: string[] = [];
  for (const region of regions) {
    for (const context of CONTEXTS) {
      for (let month = 1; month <= 12; month++) {
        const selected = rows.filter((row) =>
          row.region === region && row.context === context &&
          row.month === month
        );
        const counts = emptyBandCounts();
        let maxScore = 0;
        for (const row of selected) {
          const candidate = row.candidates[variant];
          counts[candidate.band]++;
          maxScore = Math.max(maxScore, candidate.score);
        }
        const goodPrime = counts.Good + counts.Prime;
        const toughPoor = counts.Tough + counts.Poor;
        if (goodPrime < toughPoor || counts.Prime === 0) {
          lines.push(
            `| ${region} | ${context} | ${month} | ${
              BANDS.map((band) => counts[band]).join("/")
            } | ${pct(goodPrime, selected.length)} | ${
              pct(toughPoor, selected.length)
            } | ${counts.Prime} | ${maxScore} | ${
              goodPrime < toughPoor ? "Good+Prime<Tough+Poor" : "zero Prime"
            } |`,
          );
        }
      }
    }
  }
  return lines.slice(0, 160).join("\n") || "| none |  |  |  |  |  |  |  |";
}

function regionMonthContextDistributionTable(
  rows: AuditRow[],
  variant: VariantId,
  regions: readonly RegionKey[],
): string {
  return regions.flatMap((region) =>
    CONTEXTS.flatMap((context) =>
      Array.from({ length: 12 }, (_, index) => index + 1).map((month) => {
        const selected = rows.filter((row) =>
          row.region === region && row.context === context &&
          row.month === month
        );
        return `| ${region} | ${context} | ${month} | ${
          candidateDistributionForRows(selected, variant)
        } |`;
      })
    )
  ).join("\n");
}

function candidateToneText(row: AuditRow): string {
  const surface = row.production.report_surface;
  return `${surface.summary_line} ${surface.actionable_tip} ${
    surface.timing_insight ?? ""
  } ${surface.solunar_note ?? ""}`.toLowerCase();
}

function copyAlignmentConcernsForFinalist(row: AuditRow): string[] {
  const variant = SCORING_FINALIST;
  const candidate = row.candidates[variant];
  const adjustedRow = candidateStructuralRow(row, variant);
  const support = candidateSupportFor(row, variant);
  const drivers = candidateDriversFor(row, variant);
  const suppressors = candidateSuppressorsFor(row, variant);
  const text = candidateToneText(row);
  const optimismText = text
    .replace(/\bless favorable\b/g, "less supportive")
    .replace(/\bnot as favorable\b/g, "less supportive");
  const surface = row.production.report_surface;
  const concerns: string[] = [];
  const optimistic =
    /\b(prime|favorable|strong|excellent|solid|great|in your corner)\b/.test(
      optimismText,
    ) ||
    /\b(is|are|clearly|really) helping\b/.test(optimismText);
  const pessimistic =
    /\b(tough|poor|grind|working against|outside the normal|not much)\b/
      .test(text);
  if (
    (candidate.band === "Good" || candidate.band === "Prime") && pessimistic
  ) {
    concerns.push("contradiction:good_prime_with_pessimistic_copy");
  }
  if ((candidate.band === "Tough" || candidate.band === "Poor") && optimistic) {
    concerns.push("contradiction:poor_tough_with_optimistic_copy");
  }
  for (const item of drivers) {
    if (item.weighted_contribution < 0 || item.score < 0) {
      concerns.push(`contradiction:adjusted_driver_negative:${item.key}`);
    }
  }
  for (const item of suppressors) {
    if (item.weighted_contribution > 0 || item.score > 0) {
      concerns.push(`contradiction:adjusted_suppressor_positive:${item.key}`);
    }
  }
  if (
    (candidate.band === "Good" || candidate.band === "Prime") &&
    support.surfaced_driver_count === 0
  ) {
    concerns.push("missing_factor:good_prime_no_adjusted_driver");
  }
  if (
    support.negative_suppressor_mass >= 8 &&
    suppressors.length > 0 &&
    surface.suppressor_labels.length === 0
  ) {
    concerns.push("missing_factor:adjusted_suppressor_not_in_report");
  }
  if (
    drivers.map((driver) => driver.key).join(",") !==
      row.productionized_actual.driver_variables.join(",") ||
    suppressors.map((suppressor) => suppressor.key).join(",") !==
      row.productionized_actual.suppressor_variables.join(",")
  ) {
    concerns.push("stale_production_factor:adjusted_factor_set_differs");
  }
  if (candidate.band !== row.productionized_actual.band) {
    concerns.push("stale_production_factor:band_copy_not_regenerated");
  }
  if (
    candidate.band === "Prime" &&
    (support.negative_suppressor_mass >= 8 ||
      adjustedRow.severe_thermal_row ||
      adjustedRow.severe_movement_runoff_precip_row ||
      row.recent_wet_rain)
  ) {
    concerns.push("contradiction:prime_with_cautionary_condition");
  }
  if (
    row.production.reliability !== "high" ||
    row.production.missing_variables.length ||
    row.production.data_gaps.length
  ) {
    if (
      optimistic &&
      !/\b(limited|partial|missing|confidence|uncertain|thinner|looser|directional|broad|local adjustment|leave room)\b/
        .test(text)
    ) {
      concerns.push("contradiction:missing_or_low_reliability_confident_copy");
    }
  }
  return [...new Set(concerns)];
}

function copyAlignmentAudit(rows: AuditRow[]): CopyAlignmentAudit {
  let copy_alignment_failure_count = 0;
  let contradiction_count = 0;
  let missing_factor_count = 0;
  let stale_production_factor_count = 0;
  for (const row of rows) {
    const concerns = copyAlignmentConcernsForFinalist(row);
    if (concerns.length > 0) copy_alignment_failure_count++;
    if (concerns.some((concern) => concern.startsWith("contradiction:"))) {
      contradiction_count++;
    }
    if (concerns.some((concern) => concern.startsWith("missing_factor:"))) {
      missing_factor_count++;
    }
    if (
      concerns.some((concern) => concern.startsWith("stale_production_factor:"))
    ) {
      stale_production_factor_count++;
    }
  }
  return {
    copy_alignment_failure_count,
    contradiction_count,
    missing_factor_count,
    stale_production_factor_count,
  };
}

function copyFailureExamples(rows: AuditRow[]): string {
  return rows
    .map((row) => ({ row, concerns: copyAlignmentConcernsForFinalist(row) }))
    .filter((item) => item.concerns.length > 0)
    .sort((a, b) =>
      b.concerns.length - a.concerns.length ||
      b.row.candidates[SCORING_FINALIST].score -
        a.row.candidates[SCORING_FINALIST].score ||
      a.row.region.localeCompare(b.row.region)
    )
    .slice(0, 20)
    .map(({ row, concerns }) => {
      const candidate = row.candidates[SCORING_FINALIST];
      return `| ${row.region} | ${row.context} | ${row.month} | ${row.archetype} | ${row.production.score}->${candidate.score} | ${row.production.band}->${candidate.band} | ${
        concerns.join("; ")
      } | ${row.production.report_surface.summary_line} | ${
        labelList(row.production.report_surface.driver_labels)
      } | ${labelList(row.production.report_surface.suppressor_labels)} | ${
        topLabels(candidateDriversFor(row))
      } | ${topLabels(candidateSuppressorsFor(row))} |`;
    }).join("\n") ||
    "| none |  |  |  |  |  |  |  |  |  |  |";
}

function productionizationReadinessMap(): string {
  return [
    "| temp table / seasonal mean alignment | `scoreDay.ts` productionized structural adjustment | Implemented in production scoring path and verified against finalist. |",
    "| weight changes | `scoreDay.ts` productionized active-weight adjustment | Implemented in production scoring path before adjusted contribution surfacing. |",
    "| support/cap policy | `scoreDay.ts` productionized support/cap policy | Implemented from adjusted drivers/suppressors/support diagnostics. |",
    "| runtime Prime gate | `scoreDay.ts` productionized Prime gate | Implemented with runtime-only support, rain/wet/shutdown, reliability, missing/data, and normalized cleanliness gates. |",
    "| report generation | `runHowFishingReport.ts`, `summary/summaryLine.ts`, `tips/buildTips.ts` | Implemented: report surface uses adjusted score/band/drivers/suppressors and conservative limited-data/low-band copy. |",
    "| recommender impact | recommender layer consuming Today’s Bite score/activity tier | Verified safe-direction movement only: `suppressed->neutral` and `neutral->active`; no bad-direction tier changes. |",
  ].join("\n");
}

function productionCallerAuditTable(): string {
  return [
    "| `runHowFishingReport` | `runHowFishingReport(req)` -> `analyzeSharedConditions(req)` -> `scoreDay(...)` | production | no `scoreMode` override; `scoreDay` default is production |",
    "| `runHowFishingScoreOnly` | `runHowFishingScoreOnly(req)` -> `analyzeSharedConditions(req)` -> `scoreDay(...)` | production | same scoring path as report surface |",
    "| `forecast-scores` | `forecast-scores/index.ts` -> `runHowFishingScoreOnly(sharedReq)` | production | forecast output uses production score-only path |",
    "| recommender shared analysis | `recommenderEngine/sharedAnalysis.ts` -> `analyzeSharedConditions(...)` | production | no legacy override in recommender path |",
    "| `how-fishing` edge function | `how-fishing/index.ts` -> `runHowFishingReport(sharedReq)` | production | edge function uses production report path |",
    '| legacy mode usage | audit frozen baseline and `scoreDayLegacy(...)` test helper | explicit legacy only | `scoreMode: "legacy"` appears only in this audit; `{ mode: "legacy" }` appears only in legacy unit helper |',
  ].join("\n");
}

function limitedDataConfidenceFailureCount(rows: AuditRow[]): number {
  return rows.filter((row) => {
    const limited = row.production.reliability !== "high" ||
      row.production.missing_variables.length > 0 ||
      row.production.data_gaps.length > 0;
    return limited &&
      copyAlignmentConcernsForFinalist(row).includes(
        "contradiction:missing_or_low_reliability_confident_copy",
      );
  }).length;
}

function assertFinalMarkdownSelfCheck(markdownText: string): void {
  const stalePatterns = [
    /Acceptance status:\s*\*\*no acceptable v43 candidate\*\*/i,
    /No acceptable v43 productionizable candidate/i,
    /v35 is the current productionization target/i,
    /Required production change/i,
    /Productionization Readiness Map/i,
  ];
  const failures = stalePatterns
    .filter((pattern) => pattern.test(markdownText))
    .map((pattern) => String(pattern));
  const productionizedContextRows = CONTEXTS.every((context) =>
    new RegExp(
      `\\| productionized_actual \\| ${context} \\|\\s*\\d+\\s*\\|\\s*\\d+\\s*\\|\\s*\\d+\\s*\\|\\s*\\d+\\s*\\|\\s*\\d+\\s*\\|`,
    ).test(markdownText)
  );
  if (!productionizedContextRows) {
    failures.push("productionized_actual context distribution missing");
  }
  if (failures.length) {
    throw new Error(`Final markdown self-check failed: ${failures.join(", ")}`);
  }
}

function topCopyConcerns(rows: AuditRow[], variants: VariantId[]): string {
  const counts: Record<string, number> = {};
  for (const variant of variants) {
    for (const row of copySampleRows(rows, variant)) {
      for (const concern of copyAlignmentConcerns(row, variant)) {
        counts[concern] = (counts[concern] ?? 0) + 1;
      }
    }
  }
  return topRecordEntries(counts, 5);
}

function topScoreRows(rows: AuditRow[], variant: VariantId): string {
  return [...rows]
    .sort((a, b) =>
      b.candidates[variant].score - a.candidates[variant].score ||
      b.condition_support.positive_driver_mass -
        a.condition_support.positive_driver_mass ||
      a.region.localeCompare(b.region)
    )
    .slice(0, 30)
    .map((row) => {
      const candidate = row.candidates[variant];
      return `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${row.production.score}->${candidate.score} | ${row.production.band}->${candidate.band} | ${
        row.production.timing_strength ?? "null"
      } | ${row.condition_support.positive_driver_mass.toFixed(1)} | ${
        row.condition_support.negative_suppressor_mass.toFixed(1)
      } | ${row.condition_support.strongest_driver_contribution.toFixed(1)} |`;
    }).join("\n");
}

function ultimateProbeRequest(
  context: EngineContext,
): { label: string; req: SharedEngineRequest; archetype: ArchetypeId } {
  const setup: Record<
    EngineContext,
    { region: RegionKey; month: number; archetype: ArchetypeId }
  > = {
    freshwater_lake_pond: {
      region: "south_central",
      month: 1,
      archetype: "light_mist_dry_baseline",
    },
    freshwater_river: {
      region: "south_central",
      month: 1,
      archetype: "overcast_calm",
    },
    coastal: {
      region: "southeast_atlantic",
      month: 1,
      archetype: "improving_shock_toward_good",
    },
    coastal_flats_estuary: {
      region: "southeast_atlantic",
      month: 2,
      archetype: "improving_shock_toward_good",
    },
  };
  const chosen = setup[context];
  const archetype = ARCHETYPES.find((entry) => entry.id === chosen.archetype);
  if (!archetype) {
    throw new Error(`Missing probe archetype ${chosen.archetype}`);
  }
  const req = buildRequest(chosen.region, chosen.month, context, archetype);
  req.data_coverage = { source_notes: [] };
  return {
    label: `${context}|custom_perfect|${chosen.region}`,
    req,
    archetype: chosen.archetype,
  };
}

function ultimateTailProbeTable(): { markdown: string; max: number } {
  const rows = CONTEXTS.map((context) => {
    const probe = ultimateProbeRequest(context);
    const row = buildAuditRowFromRequest(probe.req, probe.archetype, "clear");
    return { label: probe.label, row };
  });
  const max = Math.max(
    ...rows.flatMap(({ row }) => [
      row.candidates.curve_timing_selective_prime_v33_tail_only.score,
      row.candidates.curve_timing_selective_prime_v33_tail_plus.score,
      row.candidates.curve_timing_selective_prime_v34_continuous_tail.score,
      row.candidates.curve_timing_selective_prime_v34_continuous_tail_plus
        .score,
      row.candidates.curve_timing_selective_prime_v35_productionizable_tail_plus
        .score,
    ]),
  );
  const markdown = rows.map(({ label, row }) =>
    `| ${label} | ${row.production.score} | ${row.production.band} | ${
      row.production.timing_strength ?? "null"
    } | ${row.candidates.curve_timing_selective_prime_v32.score} | ${row.candidates.curve_timing_selective_prime_v33_tail_only.score} | ${row.candidates.curve_timing_selective_prime_v33_tail_plus.score} | ${row.candidates.curve_timing_selective_prime_v34_continuous_tail.score} | ${row.candidates.curve_timing_selective_prime_v34_continuous_tail_plus.score} | ${row.candidates.curve_timing_selective_prime_v35_productionizable_tail_plus.score} | ${
      row.condition_support.positive_driver_mass.toFixed(1)
    } | ${row.condition_support.negative_suppressor_mass.toFixed(1)} |`
  ).join("\n");
  return { markdown, max };
}

function productionizedMismatchStats(rows: AuditRow[], variant: VariantId): {
  score: number;
  band: number;
  activityTier: number;
  factors: number;
  samples: string;
} {
  let score = 0;
  let band = 0;
  let activityTier = 0;
  let factors = 0;
  const sampleRows: string[] = [];
  for (const row of rows) {
    const candidate = row.candidates[variant];
    const actual = row.productionized_actual;
    const candDrivers = (candidate.structural?.adjusted_drivers ?? [])
      .map((driver) => driver.key).join(",");
    const candSuppressors = (candidate.structural?.adjusted_suppressors ?? [])
      .map((suppressor) => suppressor.key).join(",");
    const actualDrivers = actual.driver_variables.join(",");
    const actualSuppressors = actual.suppressor_variables.join(",");
    const scoreMismatch = actual.score !== candidate.score;
    const bandMismatch = actual.band !== candidate.band;
    const tierMismatch = actual.activity_tier !== candidate.activity_tier;
    const factorMismatch = candDrivers !== actualDrivers ||
      candSuppressors !== actualSuppressors;
    if (scoreMismatch) score++;
    if (bandMismatch) band++;
    if (tierMismatch) activityTier++;
    if (factorMismatch) factors++;
    if (
      sampleRows.length < 20 &&
      (scoreMismatch || bandMismatch || tierMismatch || factorMismatch)
    ) {
      sampleRows.push(
        `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${actual.score}/${candidate.score} | ${actual.band}/${candidate.band} | ${
          actualDrivers || "none"
        } / ${candDrivers || "none"} | ${actualSuppressors || "none"} / ${
          candSuppressors || "none"
        } |`,
      );
    }
  }
  return {
    score,
    band,
    activityTier,
    factors,
    samples: sampleRows.length
      ? sampleRows.join("\n")
      : "| none | - | - | - | - | - | - | - | - |",
  };
}

function spreadScoreBucket(score: number): SpreadScoreBucket {
  if (score <= 34) return "10-34";
  if (score <= 44) return "35-44";
  if (score <= 49) return "45-49";
  if (score <= 54) return "50-54";
  if (score <= 59) return "55-59";
  if (score <= 64) return "60-64";
  if (score <= 69) return "65-69";
  if (score <= 74) return "70-74";
  if (score <= 79) return "75-79";
  if (score <= 84) return "80-84";
  if (score <= 89) return "85-89";
  if (score <= 94) return "90-94";
  return "95-99";
}

function spreadScoreBucketCounts(
  rows: AuditRow[],
  variant: VariantId,
): Record<SpreadScoreBucket, number> {
  const counts = Object.fromEntries(
    SPREAD_SCORE_BUCKETS.map((bucket) => [bucket, 0]),
  ) as Record<SpreadScoreBucket, number>;
  for (const row of rows) {
    counts[spreadScoreBucket(row.candidates[variant].score)]++;
  }
  return counts;
}

function spreadScoreBucketLine(rows: AuditRow[], variant: VariantId): string {
  const counts = spreadScoreBucketCounts(rows, variant);
  return SPREAD_SCORE_BUCKETS.map((bucket) => counts[bucket]).join(" / ");
}

function severeThermalPrimeRows(rows: AuditRow[], variant: VariantId): number {
  return rows.filter((row) =>
    row.candidates[variant].band === "Prime" &&
    candidateStructuralRow(row, variant).severe_thermal_row
  ).length;
}

function redFlagPrimeRows(rows: AuditRow[], variant: VariantId): number {
  return rows.filter((row) =>
    row.candidates[variant].band === "Prime" &&
    RED_FLAG_ARCHETYPES.has(row.archetype)
  ).length;
}

function v45SpreadCandidateTable(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): string {
  return VARIANTS.filter(isV45Variant).map((variant) => {
    const m = allMetrics[variant];
    const distribution = BANDS.map((band) =>
      `${m.bandDistribution[band]} (${
        pct(m.bandDistribution[band], rows.length)
      }%)`
    ).join(" / ");
    return `| ${variant} | ${distribution} | ${
      spreadScoreBucketLine(rows, variant)
    } | ${m.bandDistribution.Prime} | ${m.maxScore} | ${
      severeThermalGoodRows(rows, variant)
    } / ${severeThermalPrimeRows(rows, variant)} | ${
      compactRecord(m.guardrailViolations)
    } / ${m.reportExplainabilityFailures} / ${m.primeCautionCount} / ${
      redFlagPrimeRows(rows, variant)
    } | ${compactRecord(m.activityTierChanges)} | ${
      isV45ProductionizableVariant(variant)
        ? "productionizable shadow config"
        : "diagnostic-only"
    } |`;
  }).join("\n");
}

function fairSupportDiagnosisTable(
  rows: AuditRow[],
  variant: VariantId,
): string {
  const counts = {
    strong_driver_support: 0,
    strong_suppressor_support: 0,
    mixed_low_support: 0,
  };
  for (const row of rows) {
    if (row.candidates[variant].band !== "Fair") continue;
    const adjustedRow = candidateStructuralRow(row, variant);
    if (v45StrongDriverSupport(adjustedRow)) counts.strong_driver_support++;
    else if (v45StrongSuppressorSupport(adjustedRow)) {
      counts.strong_suppressor_support++;
    } else counts.mixed_low_support++;
  }
  return `strong driver support: ${counts.strong_driver_support}, strong suppressor support: ${counts.strong_suppressor_support}, mixed/low support: ${counts.mixed_low_support}`;
}

function good75PrimeGateDiagnosis(
  rows: AuditRow[],
  variant: VariantId,
): string {
  let minorOnly = 0;
  let realRisk = 0;
  let eligible = 0;
  const riskNeedles = [
    "reliability",
    "missing",
    "data_gaps",
    "rain",
    "wet",
    "shutdown",
    "severe",
    "suppressor",
    "negative_mass",
    "extreme_current",
  ];
  for (const row of rows) {
    const candidate = row.candidates[variant];
    if (candidate.band !== "Good" || candidate.score < 75) continue;
    const adjustedRow = candidateStructuralRow(row, variant);
    const reasons = v43RuntimePrimeDisqualificationReasons(
      adjustedRow,
      candidate.score,
    );
    if (reasons.length === 0) eligible++;
    else if (
      reasons.some((reason) =>
        riskNeedles.some((needle) => reason.includes(needle))
      )
    ) realRisk++;
    else minorOnly++;
  }
  return `minor gates only: ${minorOnly}, real suppressor/risk gates: ${realRisk}, runtime eligible before score gate: ${eligible}`;
}

function primeSupportSummary(rows: AuditRow[], variant: VariantId): string {
  const primeRows = rows.filter((row) =>
    row.candidates[variant].band === "Prime"
  );
  if (primeRows.length === 0) return "none";
  const sum = primeRows.reduce(
    (acc, row) => {
      const adjustedRow = candidateStructuralRow(row, variant);
      const support = candidateSupportFor(row, variant);
      acc.positive += support.positive_driver_mass;
      acc.negative += support.negative_suppressor_mass;
      acc.drivers += support.surfaced_driver_count;
      if (adjustedRow.clean_support) acc.clean++;
      if (normalizedCleanliness(adjustedRow) <= -0.25) acc.minorNegative++;
      return acc;
    },
    { positive: 0, negative: 0, drivers: 0, clean: 0, minorNegative: 0 },
  );
  return `avg positive mass ${
    (sum.positive / primeRows.length).toFixed(1)
  }, avg negative mass ${
    (sum.negative / primeRows.length).toFixed(1)
  }, avg surfaced drivers ${
    (sum.drivers / primeRows.length).toFixed(1)
  }, clean-support rows ${sum.clean}, minor-negative rows ${sum.minorNegative}`;
}

function v45RegionSummaryTable(rows: AuditRow[], variant: VariantId): string {
  return ([
    "florida",
    "northern_california",
    "mountain_west",
    "appalachian",
  ] as const).map((region) =>
    `| ${region} | ${regionDistributionSummary(rows, variant, region)} |`
  ).join("\n");
}

function v45ContextSummaryTable(rows: AuditRow[], variant: VariantId): string {
  return CONTEXTS.map((context) => {
    const selected = rows.filter((row) => row.context === context);
    return `| ${context} | ${
      candidateDistributionForRows(selected, variant)
    } |`;
  }).join("\n");
}

function bestV45(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): VariantId | null {
  const candidates = VARIANTS.filter(isV45ProductionizableVariant).filter(
    (variant) => {
      const m = allMetrics[variant];
      const fairPct = m.bandDistribution.Fair / rows.length * 100;
      const goodPct = m.bandDistribution.Good / rows.length * 100;
      const primePct = m.bandDistribution.Prime / rows.length * 100;
      return Object.keys(m.guardrailViolations).length === 0 &&
        m.reportExplainabilityFailures === 0 &&
        m.primeCautionCount === 0 &&
        redFlagPrimeRows(rows, variant) === 0 &&
        severeThermalPrimeRows(rows, variant) === 0 &&
        severeThermalGoodRows(rows, variant) <= finalistSevereThermalGoodRows &&
        m.activityTierChanges["active->neutral"] === 0 &&
        m.activityTierChanges["neutral->suppressed"] === 0 &&
        fairPct >= 34 &&
        fairPct <= 45 &&
        goodPct >= 29 &&
        goodPct <= 33 &&
        primePct >= 4 &&
        primePct <= 7;
    },
  );
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => {
    const score = (m: Metrics) => {
      const fairPct = m.bandDistribution.Fair / rows.length * 100;
      const goodPct = m.bandDistribution.Good / rows.length * 100;
      const primePct = m.bandDistribution.Prime / rows.length * 100;
      const distPenalty = Math.abs(fairPct - 37) * 10 +
        Math.abs(goodPct - 31) * 8 +
        Math.abs(primePct - 5.5) * 12;
      const tailBonus = m.scoreTailHistogram["90-94"] * 1.5 +
        m.scoreTailHistogram["95-99"] * 3 +
        (m.maxScore === 99 ? 100 : 0);
      return tailBonus - distPenalty;
    };
    return score(allMetrics[b]) - score(allMetrics[a]) || a.localeCompare(b);
  })[0];
}

type PrimeEligibilityGroup =
  | "prime_eligible_except_score_only"
  | "blocked_by_real_suppressor_risk"
  | "blocked_by_minor_technical_gates"
  | "blocked_by_missing_reliability_rain_shutdown_severe";

function v46PrimeEligibilityGroup(
  row: AuditRow,
  variant: VariantId = SCORING_FINALIST,
): PrimeEligibilityGroup | null {
  const candidate = row.candidates[variant];
  if (candidate.score < 75 || candidate.score > 79) return null;
  const adjustedRow = candidateStructuralRow(row, variant);
  const reasons = v43RuntimePrimeDisqualificationReasons(
    adjustedRow,
    candidate.score,
  );
  if (reasons.length === 0) return "prime_eligible_except_score_only";
  if (
    reasons.some((reason) =>
      reason.includes("reliability") ||
      reason.includes("missing") ||
      reason.includes("data_gaps") ||
      reason.includes("rain") ||
      reason.includes("wet") ||
      reason.includes("shutdown") ||
      reason.includes("severe")
    )
  ) {
    return "blocked_by_missing_reliability_rain_shutdown_severe";
  }
  if (
    reasons.some((reason) =>
      reason.includes("suppressor") ||
      reason.includes("negative_mass") ||
      reason.includes("extreme_current")
    )
  ) {
    return "blocked_by_real_suppressor_risk";
  }
  return "blocked_by_minor_technical_gates";
}

function v46PrimeEligibilityDiagnosisTable(
  rows: AuditRow[],
  variant: VariantId = SCORING_FINALIST,
): string {
  const groups: Record<PrimeEligibilityGroup, {
    rows: AuditRow[];
    contextCounts: Record<string, number>;
  }> = {
    prime_eligible_except_score_only: { rows: [], contextCounts: {} },
    blocked_by_real_suppressor_risk: { rows: [], contextCounts: {} },
    blocked_by_minor_technical_gates: { rows: [], contextCounts: {} },
    blocked_by_missing_reliability_rain_shutdown_severe: {
      rows: [],
      contextCounts: {},
    },
  };
  for (const row of rows) {
    const group = v46PrimeEligibilityGroup(row, variant);
    if (!group) continue;
    groups[group].rows.push(row);
    groups[group].contextCounts[row.context] =
      (groups[group].contextCounts[row.context] ?? 0) + 1;
  }
  return (Object.keys(groups) as PrimeEligibilityGroup[]).map((group) => {
    const selected = groups[group].rows;
    const totals = selected.reduce(
      (acc, row) => {
        const support = candidateSupportFor(row, variant);
        acc.positive += support.positive_driver_mass;
        acc.negative += support.negative_suppressor_mass;
        acc.drivers += support.surfaced_driver_count;
        acc.strongest += support.strongest_driver_contribution;
        return acc;
      },
      { positive: 0, negative: 0, drivers: 0, strongest: 0 },
    );
    const denom = selected.length || 1;
    return `| ${group} | ${selected.length} | ${
      (totals.positive / denom).toFixed(1)
    } | ${(totals.negative / denom).toFixed(1)} | ${
      (totals.drivers / denom).toFixed(1)
    } | ${(totals.strongest / denom).toFixed(1)} | ${
      topRecordEntries(groups[group].contextCounts, 4)
    } |`;
  }).join("\n");
}

function v45EligibleButNoPrimeExplanation(rows: AuditRow[]): string {
  let eligibleBeforeScoreGate = 0;
  let blockedByCrossGate = 0;
  for (const row of rows) {
    const candidate = row.candidates.v45_support_confidence_spread;
    if (candidate.band !== "Good" || candidate.score < 75) continue;
    const adjustedRow = candidateStructuralRow(
      row,
      "v45_support_confidence_spread",
    );
    if (
      v43RuntimePrimeDisqualificationReasons(adjustedRow, candidate.score)
        .length === 0
    ) {
      eligibleBeforeScoreGate++;
      if (!v45PrimeCrossAllowed(adjustedRow, "v45_support_confidence_spread")) {
        blockedByCrossGate++;
      }
    }
  }
  return `${eligibleBeforeScoreGate} v45 Good rows were runtime-eligible before the score gate, but ${blockedByCrossGate} failed the extra v45 cross-to-Prime gate; the remaining eligible rows were already Prime or did not receive a Prime-crossing lift. That is why v45 improved upper-score spread but created 0 new Prime rows.`;
}

function primeSupportExistingNewSummary(
  rows: AuditRow[],
  variant: VariantId,
): string {
  const summarize = (selected: AuditRow[]) => {
    if (selected.length === 0) return "none";
    const totals = selected.reduce(
      (acc, row) => {
        const support = candidateSupportFor(row, variant);
        acc.positive += support.positive_driver_mass;
        acc.negative += support.negative_suppressor_mass;
        acc.drivers += support.surfaced_driver_count;
        acc.strongest += support.strongest_driver_contribution;
        return acc;
      },
      { positive: 0, negative: 0, drivers: 0, strongest: 0 },
    );
    return `${selected.length} rows; avg positive ${
      (totals.positive / selected.length).toFixed(1)
    }, avg negative ${
      (totals.negative / selected.length).toFixed(1)
    }, avg drivers ${
      (totals.drivers / selected.length).toFixed(1)
    }, avg strongest ${(totals.strongest / selected.length).toFixed(1)}`;
  };
  const existing = rows.filter((row) =>
    row.candidates[SCORING_FINALIST].band === "Prime" &&
    row.candidates[variant].band === "Prime"
  );
  const newly = rows.filter((row) =>
    row.candidates[SCORING_FINALIST].band !== "Prime" &&
    row.candidates[variant].band === "Prime"
  );
  return `existing Prime: ${summarize(existing)}; newly created Prime: ${
    summarize(newly)
  }`;
}

function v46SpreadCandidateTable(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): string {
  return VARIANTS.filter(isV46Variant).map((variant) => {
    const m = allMetrics[variant];
    const distribution = BANDS.map((band) =>
      `${m.bandDistribution[band]} (${
        pct(m.bandDistribution[band], rows.length)
      }%)`
    ).join(" / ");
    return `| ${variant} | ${distribution} | ${
      exactPrimeScoreHistogramTable({ [variant]: m })
        .replace(`| ${variant} | `, "")
        .replace(" |", "")
    } | ${m.bandDistribution.Prime} | ${m.maxScore} | ${
      severeThermalGoodRows(rows, variant)
    } / ${severeThermalPrimeRows(rows, variant)} | ${
      compactRecord(m.guardrailViolations)
    } / ${m.reportExplainabilityFailures} / ${m.primeCautionCount} / ${
      redFlagPrimeRows(rows, variant)
    } | ${compactRecord(m.activityTierChanges)} | ${
      isV46ProductionizableVariant(variant)
        ? "productionizable shadow config"
        : "diagnostic-only"
    } |`;
  }).join("\n");
}

function bestV46(
  rows: AuditRow[],
  allMetrics: Record<string, Metrics>,
): VariantId | null {
  const candidates = VARIANTS.filter(isV46ProductionizableVariant).filter(
    (variant) => {
      const m = allMetrics[variant];
      const toughPct = m.bandDistribution.Tough / rows.length * 100;
      const poorPct = m.bandDistribution.Poor / rows.length * 100;
      const fairPct = m.bandDistribution.Fair / rows.length * 100;
      const goodPct = m.bandDistribution.Good / rows.length * 100;
      const primePct = m.bandDistribution.Prime / rows.length * 100;
      const lowPrime = m.primeScoreHistogram["80"] +
        m.primeScoreHistogram["81"] +
        m.primeScoreHistogram["82"] +
        m.primeScoreHistogram["83"] +
        m.primeScoreHistogram["84"] +
        m.primeScoreHistogram["85"] +
        m.primeScoreHistogram["86"] +
        m.primeScoreHistogram["87"] +
        m.primeScoreHistogram["88"] +
        m.primeScoreHistogram["89"];
      return Object.keys(m.guardrailViolations).length === 0 &&
        m.reportExplainabilityFailures === 0 &&
        m.primeCautionCount === 0 &&
        redFlagPrimeRows(rows, variant) === 0 &&
        severeThermalPrimeRows(rows, variant) === 0 &&
        severeThermalGoodRows(rows, variant) <=
          Math.round(finalistSevereThermalGoodRows * 1.05) &&
        m.activityTierChanges["active->neutral"] === 0 &&
        m.activityTierChanges["neutral->suppressed"] === 0 &&
        toughPct >= 4 &&
        toughPct <= 7 &&
        poorPct >= 16 &&
        poorPct <= 21 &&
        fairPct >= 35 &&
        fairPct <= 45 &&
        goodPct >= 29 &&
        goodPct <= 34 &&
        primePct >= 3.5 &&
        primePct <= 5.5 &&
        lowPrime > 0;
    },
  );
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => {
    const score = (m: Metrics) => {
      const primePct = m.bandDistribution.Prime / rows.length * 100;
      const fairPct = m.bandDistribution.Fair / rows.length * 100;
      const goodPct = m.bandDistribution.Good / rows.length * 100;
      const lowPrime = m.scoreTailHistogram["80-84"] +
        m.scoreTailHistogram["85-89"];
      return lowPrime * 2 -
        Math.abs(primePct - 4.5) * 100 -
        Math.abs(fairPct - 38.5) * 20 -
        Math.abs(goodPct - 31.5) * 20;
    };
    return score(allMetrics[b]) - score(allMetrics[a]) || a.localeCompare(b);
  })[0];
}

const rows = buildRows();
const allMetrics: Record<string, Metrics> = {
  production: productionMetrics(rows),
  productionized_actual: productionizedActualMetrics(rows),
  ...Object.fromEntries(
    VARIANTS.map((variant) => [variant, candidateMetrics(rows, variant)]),
  ),
};
const candidateOnlyMetrics = Object.fromEntries(
  VARIANTS.map((variant) => [variant, allMetrics[variant]]),
) as Record<VariantId, Metrics>;
const bestV36Candidate = bestV36(allMetrics);
const bestV37Candidate = bestV37(rows, allMetrics);
const bestV38Candidate = bestV38(rows, allMetrics);
const bestV39Candidate = bestV39(rows, allMetrics);
const bestV40Result = bestV40(rows, allMetrics);
const bestV40Candidate = bestV40Result.candidate;
const bestV41Result = bestV41(rows, allMetrics);
const bestV41Candidate = bestV41Result.candidate;
const bestV42Result = bestV42(rows, allMetrics);
const bestV42Candidate = bestV42Result.candidate;
const v43ReplayMismatchesList = v43ReplayMismatches(rows, allMetrics);
const v43ReplayMatched = v43ReplayMismatchesList.length === 0;
const bestV43Result = bestV43(rows, allMetrics, v43ReplayMatched);
const bestV43Candidate = bestV43Result.candidate;
const best = bestV43Candidate;
const ultimateProbe = ultimateTailProbeTable();
const doNotShip =
  Object.values(candidateOnlyMetrics).some((m) =>
      Object.keys(m.guardrailViolations).length > 0
    )
    ? "Do not ship any candidate with guardrail failures listed below."
    : "No shadow candidate guardrail failures in this fixture sweep.";
const finalistUnsafeStats = unsafeUpgradeStats(rows, SCORING_FINALIST);
const v44Candidate = "productionized_v44_severe_thermal_good_cap" as const;
const v44UnsafeStats = unsafeUpgradeStats(rows, v44Candidate);
const finalistSevereThermalGoodRows = severeThermalGoodRows(
  rows,
  SCORING_FINALIST,
);
const v44SevereThermalGoodRows = severeThermalGoodRows(rows, v44Candidate);
const finalistSevereThermalUpgradeGoodRows = severeThermalUpgradeGoodRows(
  rows,
  SCORING_FINALIST,
);
const v44SevereThermalUpgradeGoodRows = severeThermalUpgradeGoodRows(
  rows,
  v44Candidate,
);
const bestV45Candidate = bestV45(rows, allMetrics);
const v45DisplayCandidate = bestV45Candidate ?? "v45_support_confidence_spread";
const bestV46Candidate = bestV46(rows, allMetrics);
const v46DisplayCandidate = bestV46Candidate ?? "v46_combined_light";
const finalistCopyAudit = copyAlignmentAudit(rows);
const finalistCopySafe = finalistCopyAudit.copy_alignment_failure_count === 0;
const limitedDataConfidenceFailures = limitedDataConfidenceFailureCount(rows);
const productionizedMatch = productionizedMismatchStats(rows, SCORING_FINALIST);
const productionizedExactMatch = productionizedMatch.score === 0 &&
  productionizedMatch.band === 0 &&
  productionizedMatch.activityTier === 0 &&
  productionizedMatch.factors === 0;

const markdown = `# Today's Bite Score Optimism Shadow Audit

Generated: ${new Date().toISOString()}

Release-readiness audit over production report/analysis output. Historical candidate scores remain local audit math; \`productionized_actual\` verifies the current production engine surface against the accepted finalist.

## Coverage

- Rows: ${rows.length}
- Regions: ${CANONICAL_REGION_KEYS.length}
- Months: 12
- Contexts: ${CONTEXTS.join(", ")}
- Archetypes: ${ARCHETYPES.length}
- Water clarity variants: ${WATER_CLARITIES.join(", ")}

## Recommendation

${
  !v43ReplayMatched
    ? `V43 audit invalid: **v43_v41_replay** did not exactly match **v41_prime_gate_clean** (${
      v43ReplayMismatchesList.join(", ")
    }).`
    : productionizedExactMatch && finalistCopySafe &&
        limitedDataConfidenceFailures === 0
    ? `**${SCORING_FINALIST}** is the accepted productionized finalist. Production engine output matches the finalist exactly, copy alignment is clean, and no broad scoring tune remains pending. **${v44Candidate}** is diagnostic-only and rejected because it removes the severe-thermal Good rows but materially regresses regional repair. The remaining severe-thermal Good rows under v46 are accepted with conservative copy and post-release monitoring.`
    : `Release-readiness blocker remains: productionized exact match=${productionizedExactMatch}, copy safe=${finalistCopySafe}, limited-data confidence failures=${limitedDataConfidenceFailures}.`
}

## Do Not Ship If

${doNotShip}

## Band Distribution: Productionized Actual And Historical Shadow Candidates

\`productionized_actual\` is the accepted release surface. Other candidates in this and the following histogram tables are retained as historical shadow comparisons.

| Scenario | Tough | Poor | Fair | Good | Prime | Avg delta | Copy regen rows | Red flags | Explain failures | Prime cautions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${bandTable(allMetrics)}

## Score Tail Histogram: Productionized Actual And Historical Shadow Candidates

| Scenario | 80-84 | 85-89 | 90-94 | 95-99 | Max |
| --- | ---: | ---: | ---: | ---: | ---: |
${tailHistogramTable(allMetrics)}

## Exact Prime Score Histogram: Productionized Actual And Historical Shadow Candidates

| Scenario | Prime scores |
| --- | --- |
${exactPrimeScoreHistogramTable(allMetrics)}

## Accepted Finalist Productionizability Check

| Check | Result | Notes |
| --- | --- | --- |
${productionizabilityCheckTable(rows, allMetrics)}

## Historical Shadow Region Fairness: v35 (Superseded)

This section is retained as historical shadow context only. The accepted productionized surface is **${SCORING_FINALIST}**, reported in the V43/finalist sections below.

| Region | Tough / Poor / Fair / Good / Prime | Good+Prime % | Tough+Poor % | Prime % | Max score |
| --- | --- | ---: | ---: | ---: | ---: |
${
  regionFairnessTable(
    rows,
    "curve_timing_selective_prime_v35_productionizable_tail_plus",
  )
}

- Regions with zero Prime: ${
  zeroPrimeRegions(
    rows,
    "curve_timing_selective_prime_v35_productionizable_tail_plus",
  )
}
- Regions where Good+Prime < Tough+Poor: ${
  regionsGoodPrimeBelowToughPoor(
    rows,
    "curve_timing_selective_prime_v35_productionizable_tail_plus",
  )
}

| Region | Prime rows | Top Prime disqualification reasons on non-Prime rows |
| --- | ---: | --- |
${
  lowPrimeRegionReasonTable(
    rows,
    "curve_timing_selective_prime_v35_productionizable_tail_plus",
  )
}

## Historical Florida Diagnostics: v35 (Superseded)

This section is retained as historical shadow context only; it is not the current productionization target.

| Context | Tough / Poor / Fair / Good / Prime |
| --- | --- |
${
  floridaContextTable(
    rows,
    "curve_timing_selective_prime_v35_productionizable_tail_plus",
  )
}

| Month | Tough / Poor / Fair / Good / Prime |
| ---: | --- |
${
  floridaMonthTable(
    rows,
    "curve_timing_selective_prime_v35_productionizable_tail_plus",
  )
}

| Month | Context | Archetype | Clarity | Production | v35 | Timing | Positive mass | Negative mass | Top drivers | Top suppressors | Prime disqualification reasons |
| ---: | --- | --- | --- | ---: | ---: | --- | ---: | ---: | --- | --- | --- |
${
  floridaTopRowsTable(
    rows,
    "curve_timing_selective_prime_v35_productionizable_tail_plus",
  )
}

## V37 Regional Fairness Candidates

Best v37 candidate by regional fairness score: **${bestV37Candidate}**

| Candidate | Global Tough / Poor / Fair / Good / Prime | Tail 80-84 / 85-89 / 90-94 / 95-99 / Max | Zero-Prime regions | Good+Prime < Tough+Poor regions | Good+Prime min-max-spread | Prime min-max-spread | Guardrails | Explain failures | Prime cautions | Recommender changes |
| --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | --- |
${v37FairnessSummaryTable(rows, allMetrics)}

### V37 Region Calibration Map

| Candidate | Region | Fair/Good lift | Prime lift |
| --- | --- | ---: | ---: |
${regionCalibrationTable()}

### Best V37 Region Distribution

${regionSpreadSummary(rows, bestV37Candidate)}

| Region | Tough / Poor / Fair / Good / Prime | Good+Prime % | Tough+Poor % | Prime % | Max score |
| --- | --- | ---: | ---: | ---: | ---: |
${regionFairnessTable(rows, bestV37Candidate)}

### Best V37 Florida Diagnostics

| Context | Tough / Poor / Fair / Good / Prime |
| --- | --- |
${floridaContextTable(rows, bestV37Candidate)}

| Month | Tough / Poor / Fair / Good / Prime |
| ---: | --- |
${floridaMonthTable(rows, bestV37Candidate)}

| Month | Context | Archetype | Clarity | Production | v37 | Timing | Positive mass | Negative mass | Top drivers | Top suppressors | Prime disqualification reasons |
| ---: | --- | --- | --- | ---: | ---: | --- | ---: | ---: | --- | --- | --- |
${floridaTopRowsTable(rows, bestV37Candidate)}

## V38 Supported Fair-Floor Regional Candidates

Best v38 candidate by regional fairness score: **${bestV38Candidate}**

| Candidate | Global Tough / Poor / Fair / Good / Prime | Tail 80-84 / 85-89 / 90-94 / 95-99 / Max | Zero-Prime regions | Good+Prime < Tough+Poor regions | Good+Prime min-max-spread | Prime min-max-spread | Florida distribution | Northern California distribution | Guardrails / Explain / Prime cautions | Red flags | Recommender changes | Rows v35+>8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | ---: |
${v38FairnessSummaryTable(rows, allMetrics)}

### Best V38 Region Distribution

${regionSpreadSummary(rows, bestV38Candidate)}

| Region | Tough / Poor / Fair / Good / Prime | Good+Prime % | Tough+Poor % | Prime % | Max score |
| --- | --- | ---: | ---: | ---: | ---: |
${regionFairnessTable(rows, bestV38Candidate)}

### V38 Regional Movement

| Region | Fair->Good | Good->Prime | Fair->Prime | Top eligibility reasons | Top rejection reasons |
| --- | ---: | ---: | ---: | --- | --- |
${v38MovementTable(rows, bestV38Candidate)}

### Best V38 Florida Top Rows

| Month | Context | Archetype | Clarity | Production | v35 | v38 | Timing | Positive mass | Negative mass | Top drivers | Top suppressors | Floor rejection/eligibility |
| ---: | --- | --- | --- | ---: | ---: | ---: | --- | ---: | ---: | --- | --- | --- |
${regionTopRowsTable(rows, bestV38Candidate, "florida")}

### Best V38 Northern California Top Rows

| Month | Context | Archetype | Clarity | Production | v35 | v38 | Timing | Positive mass | Negative mass | Top drivers | Top suppressors | Floor rejection/eligibility |
| ---: | --- | --- | --- | ---: | ---: | ---: | --- | ---: | ---: | --- | --- | --- |
${regionTopRowsTable(rows, bestV38Candidate, "northern_california")}

### Best V38 Fair->Good Lifted Samples

| Region | Month | Context | Archetype | Clarity | Production | v35 | v38 | Timing | Positive mass | Negative mass | Top drivers | Top suppressors | Eligibility |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | ---: | ---: | --- | --- | --- |
${v38LiftedSampleRows(rows, bestV38Candidate)}

## V39 Structural Balance Audit

Diagnostic only, not accepted: v39 still uses \`productionScore + structuralDelta\` before candidate scoring.

Best v39 diagnostic candidate by structural fairness score: **${bestV39Candidate}**

| Candidate | Productionizable config diff summary |
| --- | --- |
${v39ConfigDiffSummary()}

| Candidate | Global Tough / Poor / Fair / Good / Prime | Tail 80-84 / 85-89 / 90-94 / 95-99 / Max | Zero-Prime regions | Good+Prime < Tough+Poor regions | Good+Prime min-max-spread | Prime min-max-spread | Florida distribution | Northern California distribution | Mountain West distribution | Guardrails / Explain / Prime cautions / Red flags | Recommender changes | Avoids final score floors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${v39SummaryTable(rows, allMetrics)}

### Best V39 Region Distribution

${regionSpreadSummary(rows, bestV39Candidate)}

| Region | Tough / Poor / Fair / Good / Prime | Good+Prime % | Tough+Poor % | Prime % | Max score |
| --- | --- | ---: | ---: | ---: | ---: |
${regionFairnessTable(rows, bestV39Candidate)}

### V39 Root Cause Summary

Values are normalized score / weighted contribution / active weight.

| Group | Variable averages | Avg surfaced drivers | Hard-cap row % | Top negative variable | Top positive variable |
| --- | --- | ---: | ---: | --- | --- |
${rootCauseSummary(rows)}

### V39 Structural Diagnostics By Region/Context/Month

| Region | Context | Month | Production dist | v35 dist | v38 dist | Avg production | Avg v35 | Avg v38 | Good+Prime % | Tough+Poor % | Prime % | Max v35 | Avg normalized scores | Avg weighted contributions | Avg active weights | Top negative variable | Top positive variable |
| --- | --- | ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |
${
  v39StructuralDiagnosticsTable(
    rows,
    "curve_timing_selective_prime_v35_productionizable_tail_plus",
    bestV38Candidate,
  )
}

## V40 True Structural Shadow Scorer

Acceptance status: **${
  bestV40Result.acceptable ? "acceptable" : "no acceptable v40 candidate"
}**
Best/diagnostic v40 candidate: **${bestV40Candidate}**

| Candidate | Productionizable change types | Structural summary |
| --- | --- | --- |
${v40ConfigDiffSummary()}

| Candidate | Global Tough / Poor / Fair / Good / Prime | Tail 80-84 / 85-89 / 90-94 / 95-99 / Max | Zero-Prime regions | Good+Prime < Tough+Poor regions | Good+Prime min-max-spread | Prime min-max-spread | Florida distribution | Northern California distribution | Mountain West distribution | Guardrails / Explain / Prime cautions / Red flags | Recommender changes | Uses direct score delta | Productionizable change types |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${v40SummaryTable(rows, allMetrics)}

### Best V40 Region Distribution

${regionSpreadSummary(rows, bestV40Candidate)}

| Region | Tough / Poor / Fair / Good / Prime | Good+Prime % | Tough+Poor % | Prime % | Max score |
| --- | --- | ---: | ---: | ---: | ---: |
${regionFairnessTable(rows, bestV40Candidate)}

### Best V40 Failing-Region Context Distribution

| Region | Context | Tough / Poor / Fair / Good / Prime |
| --- | --- | --- |
${
  Array.from(V40_UNDERPARITY_REGIONS).flatMap((region) =>
    CONTEXTS.map((context) => {
      const selected = rows.filter((row) =>
        row.region === region && row.context === context
      );
      return `| ${region} | ${context} | ${
        candidateDistributionForRows(selected, bestV40Candidate)
      } |`;
    })
  ).join("\n")
}

### Best V40 Root Causes

| Rank | Root cause |
| ---: | --- |
${v40RootCauseSummary(rows, bestV40Candidate)}

### Best V40 Temperature Contribution Shift

| Region | Production avg temp contribution | Adjusted avg temp contribution | Delta |
| --- | ---: | ---: | ---: |
${v40TemperatureAverages(rows, bestV40Candidate)}

### Best V40 Adjusted Support And Caps

| Candidate | Support state changed rows | Newly trusted temp-support rows | Rows capped below adjusted pre-cap |
| --- | ---: | ---: | ---: |
${v40SupportCapChanges(rows, bestV40Candidate)}

## Seasonal Mean Temperature Alignment Audit

Stable/no-shock \`stable_good\` clear rows are flagged when production temperature is a suppressor: temp final <= -0.25 or weighted contribution <= -6.

| Region | Flagged stable-good rows | Avg production temp final | Avg production temp contribution | Best v41 Good+Prime % on stable-good | Worst flagged months |
| --- | ---: | ---: | ---: | ---: | --- |
${seasonalMeanAlignmentSummary(rows, bestV41Candidate)}

## V41 Temperature Mean/Knot Structural Candidates

Acceptance status: **${
  bestV41Result.acceptable ? "acceptable" : "no acceptable v41 candidate"
}**
Best v41 candidate: **${bestV41Candidate}**

| Candidate | Productionizable change types | Structural summary |
| --- | --- | --- |
${v41ConfigDiffSummary()}

| Candidate | Global Tough / Poor / Fair / Good / Prime | Tail 80-84 / 85-89 / 90-94 / 95-99 / Max | Zero-Prime regions | Good+Prime < Tough+Poor regions | Good+Prime min-max-spread | Prime min-max-spread | Florida distribution | Northern California distribution | Mountain West distribution | Guardrails / Explain / Prime cautions / Red flags | Recommender changes | Uses direct score delta | Productionizable change types |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${v41SummaryTable(rows, allMetrics)}

### Best V41 Region Distribution

${regionSpreadSummary(rows, bestV41Candidate)}

| Region | Tough / Poor / Fair / Good / Prime | Good+Prime % | Tough+Poor % | Prime % | Max score |
| --- | --- | ---: | ---: | ---: | ---: |
${regionFairnessTable(rows, bestV41Candidate)}

### Best V41 Failing-Region Context Distribution

| Region | Context | Tough / Poor / Fair / Good / Prime |
| --- | --- | --- |
${
  Array.from(V40_UNDERPARITY_REGIONS).flatMap((region) =>
    CONTEXTS.map((context) => {
      const selected = rows.filter((row) =>
        row.region === region && row.context === context
      );
      return `| ${region} | ${context} | ${
        candidateDistributionForRows(selected, bestV41Candidate)
      } |`;
    })
  ).join("\n")
}

### Best V41 Root Causes

| Rank | Root cause |
| ---: | --- |
${v40RootCauseSummary(rows, bestV41Candidate)}

### Best V41 Temperature Contribution Shift

| Region | Production avg temp contribution | Adjusted avg temp contribution | Delta |
| --- | ---: | ---: | ---: |
${v40TemperatureAverages(rows, bestV41Candidate)}

### Best V41 Adjusted Support And Caps

| Candidate | Support state changed rows | Newly trusted temp-support rows | Rows capped below adjusted pre-cap |
| --- | ---: | ---: | ---: |
${v40SupportCapChanges(rows, bestV41Candidate)}

## V42 Priority-Aware Red-Flag Containment

Acceptance status: **${
  bestV42Result.acceptable ? "acceptable" : "no acceptable v42 candidate"
}**
Best v42 candidate: **${bestV42Candidate}**

| Candidate | All-region distribution | Core-mainland distribution | Tail 80-84 / 85-89 / 90-94 / 95-99 / Max | Core zero-Prime | Core Good+Prime < Tough+Poor | Core Good+Prime spread | Core Prime spread | Florida | Northern California | Mountain West | Guardrails / Explain / Prime cautions / Red flags | Recommender changes |
| --- | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
${v42SummaryTable(rows, allMetrics)}

### Priority-Aware Regional Metrics

| Region set | Tough/Poor/Fair/Good/Prime | Good+Prime spread | Prime spread | Zero-Prime regions | Good+Prime < Tough+Poor |
| --- | --- | ---: | ---: | --- | --- |
${priorityRegionalMetricsTable(rows, bestV42Candidate)}

### V41 Red-Flag Containment Diagnostics

| Slice | Top values |
| --- | --- |
${redFlagContainmentTable(rows, "v41_prime_gate_clean")}

### Best V42 Red-Flag Containment Diagnostics

| Slice | Top values |
| --- | --- |
${redFlagContainmentTable(rows, bestV42Candidate)}

### Top 20 Best V42 Red-Flag Upgrade Examples

| Region | Context | Month | Archetype | Score | Band | Adjusted drivers | Positive mass | Negative mass | Top drivers | Top suppressors |
| --- | --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- |
${redFlagExampleRows(rows, bestV42Candidate)}

## V46 Runtime-Gated Productionizability Pass

Replay invariant: **${
  v43ReplayMatched ? "pass" : `fail (${v43ReplayMismatchesList.join(", ")})`
}**
Release status: **accepted productionized finalist**
Accepted productionized candidate: **${SCORING_FINALIST}**

| Candidate | All-region distribution | Core-mainland distribution | Tail 80-84 / 85-89 / 90-94 / 95-99 / Max | Core zero-Prime | Core Good+Prime < Tough+Poor | Core Good+Prime spread | Core Prime spread | Florida | Northern California | Mountain West | Appalachian | Guardrails / Explain / Prime cautions / Red flags | Red-flag Prime | Recommender changes | Productionizability check |
| --- | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | ---: | --- | --- |
${v43SummaryTable(rows, allMetrics)}

### Productionized Engine Match Proof

Default production engine output is compared to **${SCORING_FINALIST}** computed from the frozen legacy baseline.

| Check | Mismatched rows |
| --- | ---: |
| score | ${productionizedMatch.score} |
| band | ${productionizedMatch.band} |
| activity tier | ${productionizedMatch.activityTier} |
| driver/suppressor variables | ${productionizedMatch.factors} |

Because score, band, activity tier, and factor variables match **${SCORING_FINALIST}** exactly, \`productionized_actual\` guardrails, explainability failures, red flags, support diagnostics, and Prime cautions are evaluated from the same adjusted finalist facts in the summary tables above.

| Region | Month | Context | Archetype | Clarity | Actual/Candidate score | Actual/Candidate band | Actual/Candidate drivers | Actual/Candidate suppressors |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- |
${productionizedMatch.samples}

### Final Production Caller Audit

| Path | Call chain | Scoring mode | Result |
| --- | --- | --- | --- |
${productionCallerAuditTable()}

### Finalist Priority-Aware Regional Metrics

| Region set | Tough/Poor/Fair/Good/Prime | Good+Prime spread | Prime spread | Zero-Prime regions | Good+Prime < Tough+Poor |
| --- | --- | ---: | ---: | --- | --- |
${priorityRegionalMetricsTable(rows, SCORING_FINALIST)}

### Finalist Red-Flag Diagnostics

| Slice | Top values |
| --- | --- |
${redFlagContainmentTable(rows, SCORING_FINALIST)}

### Top 20 Finalist Red-Flag Upgrade Examples

| Region | Context | Month | Archetype | Score | Band | Adjusted drivers | Positive mass | Negative mass | Top drivers | Top suppressors |
| --- | --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- |
${redFlagExampleRows(rows, SCORING_FINALIST)}

### Florida Prime Debug

Florida Prime status for accepted finalist: ${
  floridaPrimeStatus(rows, SCORING_FINALIST)
}

| Month | Context | Archetype | Production | v41 | v42 light | v43 pre-cap | v43 runtime | Timing | Positive mass | Negative mass | Top drivers | Top suppressors | Runtime Prime disqualification reasons |
| ---: | --- | --- | ---: | --- | --- | ---: | --- | --- | ---: | ---: | --- | --- | --- |
${v43FloridaPrimeDebugTable(rows)}

## Finalist Unsafe Upgrade Classification

Finalist: **${SCORING_FINALIST}**

| Metric | Count / status |
| --- | --- |
| Diagnostic red flags | ${finalistUnsafeStats.diagnosticRedFlags} |
| Runtime unsafe upgrades | ${finalistUnsafeStats.unsafe} |
| Benign supported upgrades | ${finalistUnsafeStats.benign} |
| Product blocker status | ${finalistUnsafeStats.blockers} |

| Slice | Top sources |
| --- | --- |
${unsafeUpgradeSourceTable(rows, SCORING_FINALIST)}

### Top 20 Runtime Unsafe Upgrade Examples

| Region | Context | Month | Archetype | Score | Band | Drivers | Dominance | Strongest driver | Unsafe reasons | Adjusted drivers | Adjusted suppressors |
| --- | --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- |
${unsafeUpgradeExamples(rows, SCORING_FINALIST)}

## V44 Severe-Thermal Good-Cap Diagnostic

Diagnostic only: **${v44Candidate}** keeps the productionized finalist curve and adds a narrow cap for production Poor/Fair rows that would become Good while adjusted severe thermal is true and the temperature suppressor is strong. It is not silently recommended as the finalist.

| Metric | accepted finalist | v44 diagnostic |
| --- | ---: | ---: |
| All distribution | ${
  BANDS.map((band) => allMetrics[SCORING_FINALIST].bandDistribution[band]).join(
    "/",
  )
} | ${
  BANDS.map((band) => allMetrics[v44Candidate].bandDistribution[band]).join("/")
} |
| Core distribution | ${
  distributionForRegions(rows, SCORING_FINALIST, CORE_MAINLAND_REGIONS)
} | ${distributionForRegions(rows, v44Candidate, CORE_MAINLAND_REGIONS)} |
| Florida | ${regionDistributionSummary(rows, SCORING_FINALIST, "florida")} | ${
  regionDistributionSummary(rows, v44Candidate, "florida")
} |
| Northern California | ${
  regionDistributionSummary(rows, SCORING_FINALIST, "northern_california")
} | ${regionDistributionSummary(rows, v44Candidate, "northern_california")} |
| Mountain West | ${
  regionDistributionSummary(rows, SCORING_FINALIST, "mountain_west")
} | ${regionDistributionSummary(rows, v44Candidate, "mountain_west")} |
| Appalachian | ${
  regionDistributionSummary(rows, SCORING_FINALIST, "appalachian")
} | ${regionDistributionSummary(rows, v44Candidate, "appalachian")} |
| Severe-thermal Good rows | ${finalistSevereThermalGoodRows} | ${v44SevereThermalGoodRows} |
| Severe-thermal Poor/Fair->Good rows | ${finalistSevereThermalUpgradeGoodRows} | ${v44SevereThermalUpgradeGoodRows} |
| Guardrails / Explain / Prime cautions | ${
  compactRecord(allMetrics[SCORING_FINALIST].guardrailViolations)
} / ${allMetrics[SCORING_FINALIST].reportExplainabilityFailures} / ${
  allMetrics[SCORING_FINALIST].primeCautionCount
} | ${compactRecord(allMetrics[v44Candidate].guardrailViolations)} / ${
  allMetrics[v44Candidate].reportExplainabilityFailures
} / ${allMetrics[v44Candidate].primeCautionCount} |
| Runtime unsafe upgrades | ${finalistUnsafeStats.unsafe} | ${v44UnsafeStats.unsafe} |
| Recommender changes | ${
  compactRecord(allMetrics[SCORING_FINALIST].activityTierChanges)
} | ${compactRecord(allMetrics[v44Candidate].activityTierChanges)} |

## V45 Scoring-Spread Exploration

Audit-only exploration. These variants do not change production scoring/copy and do not use region quotas, fixture archetype labels for productionizable scoring, final score floors, or direct band-count calibration. The accepted production finalist remains **${SCORING_FINALIST}** unless a future productionization pass explicitly adopts a v45 policy.

Best v45 candidate: **${bestV45Candidate ?? "none"}**${
  bestV45Candidate
    ? ""
    : " (no productionizable v45 candidate met the full target envelope and safety constraints)"
}
Display candidate for diagnostics: **${v45DisplayCandidate}**

### Finalist Score Bucket Histogram

| Candidate | 10-34 | 35-44 | 45-49 | 50-54 | 55-59 | 60-64 | 65-69 | 70-74 | 75-79 | 80-84 | 85-89 | 90-94 | 95-99 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ${SCORING_FINALIST} | ${
  spreadScoreBucketLine(rows, SCORING_FINALIST).replaceAll(" / ", " | ")
} |

### V45 Candidate Comparison

| Candidate | Distribution Tough/Poor/Fair/Good/Prime | Score buckets 10-34 / 35-44 / 45-49 / 50-54 / 55-59 / 60-64 / 65-69 / 70-74 / 75-79 / 80-84 / 85-89 / 90-94 / 95-99 | Prime | Max | Severe thermal Good/Prime | Guardrails / Explain / Prime cautions / Red-flag Prime | Recommender changes | Status |
| --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
${v45SpreadCandidateTable(rows, allMetrics)}

### V45 Support Diagnostics

| Candidate | Fair-row support split | Good 75-79 Prime-gate diagnosis | Prime support summary |
| --- | --- | --- | --- |
| ${SCORING_FINALIST} | ${
  fairSupportDiagnosisTable(rows, SCORING_FINALIST)
} | ${good75PrimeGateDiagnosis(rows, SCORING_FINALIST)} | ${
  primeSupportSummary(rows, SCORING_FINALIST)
} |
| ${v45DisplayCandidate} | ${
  fairSupportDiagnosisTable(rows, v45DisplayCandidate)
} | ${good75PrimeGateDiagnosis(rows, v45DisplayCandidate)} | ${
  primeSupportSummary(rows, v45DisplayCandidate)
} |

### V45 Focus Region Distribution

| Region | ${v45DisplayCandidate} Tough/Poor/Fair/Good/Prime |
| --- | --- |
${v45RegionSummaryTable(rows, v45DisplayCandidate)}

### V45 Context Distribution

| Context | ${v45DisplayCandidate} Tough/Poor/Fair/Good/Prime |
| --- | --- |
${v45ContextSummaryTable(rows, v45DisplayCandidate)}

## V46 Low-Prime Bridge And Middle-Spread Exploration

Historical exploration retained for traceability. **${SCORING_FINALIST}** is now the production baseline; these variants avoid region quotas, direct band-count calibration, fixture archetype labels in productionizable scoring, and final score floors/clamps beyond the existing production min/max and guardrail caps.

Best v46 candidate: **${bestV46Candidate ?? "none"}**${
  bestV46Candidate
    ? ""
    : " (no productionizable v46 candidate met the full target envelope and safety constraints)"
}
Display candidate for diagnostics: **${v46DisplayCandidate}**

### Why V45 Converted No New Prime

${v45EligibleButNoPrimeExplanation(rows)}

### Finalist Scores 75-79 Prime Eligibility Diagnosis

| Group | Rows | Avg positive mass | Avg negative mass | Avg surfaced drivers | Avg strongest driver | Contexts |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${v46PrimeEligibilityDiagnosisTable(rows, SCORING_FINALIST)}

### V46 Candidate Comparison

| Candidate | Distribution Tough/Poor/Fair/Good/Prime | Exact Prime histogram | Prime | Max | Severe thermal Good/Prime | Guardrails / Explain / Prime cautions / Red-flag Prime | Recommender changes | Status |
| --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
${v46SpreadCandidateTable(rows, allMetrics)}

### V46 Support Diagnostics

| Candidate | Prime support existing vs newly created | Fair-row support split |
| --- | --- | --- |
| ${SCORING_FINALIST} | ${
  primeSupportExistingNewSummary(rows, SCORING_FINALIST)
} | ${fairSupportDiagnosisTable(rows, SCORING_FINALIST)} |
| ${v46DisplayCandidate} | ${
  primeSupportExistingNewSummary(rows, v46DisplayCandidate)
} | ${fairSupportDiagnosisTable(rows, v46DisplayCandidate)} |

### V46 Focus Region Distribution

| Region | ${v46DisplayCandidate} Tough/Poor/Fair/Good/Prime |
| --- | --- |
${v45RegionSummaryTable(rows, v46DisplayCandidate)}

### V46 Context Distribution

| Context | ${v46DisplayCandidate} Tough/Poor/Fair/Good/Prime |
| --- | --- |
${v45ContextSummaryTable(rows, v46DisplayCandidate)}

## Finalist Regional/Month/Context Sanity

All-region distribution: ${
  BANDS.map((band) => allMetrics[SCORING_FINALIST].bandDistribution[band]).join(
    "/",
  )
}
Core-mainland distribution: ${
  distributionForRegions(rows, SCORING_FINALIST, CORE_MAINLAND_REGIONS)
}

| Mainland region | Tough / Poor / Fair / Good / Prime | Good+Prime % | Tough+Poor % | Prime % | Max score |
| --- | --- | ---: | ---: | ---: | ---: |
${
  regionFairnessTable(rows, SCORING_FINALIST)
    .split("\n")
    .filter((line) =>
      !line.startsWith("| alaska |") && !line.startsWith("| hawaii |")
    )
    .join("\n")
}

### Focus Region Month/Context Distribution

| Region | Context | Month | Tough / Poor / Fair / Good / Prime |
| --- | --- | ---: | --- |
${
  regionMonthContextDistributionTable(rows, SCORING_FINALIST, [
    "florida",
    "northern_california",
    "mountain_west",
    "appalachian",
  ])
}

### Month/Context Watchlist

| Region | Context | Month | Tough/Poor/Fair/Good/Prime | Good+Prime % | Tough+Poor % | Prime count | Max | Reason |
| --- | --- | ---: | --- | ---: | ---: | ---: | ---: | --- |
${monthContextSanityTable(rows, SCORING_FINALIST, CORE_MAINLAND_REGIONS)}

## Finalist Report Copy Alignment

The current production report surface is generated from productionized adjusted score/factors. The checks below compare that surface against **${SCORING_FINALIST}** adjusted score, band, drivers, suppressors, and support.

| Metric | Count |
| --- | ---: |
| copy_alignment_failure_count | ${finalistCopyAudit.copy_alignment_failure_count} |
| contradiction_count | ${finalistCopyAudit.contradiction_count} |
| missing_factor_count | ${finalistCopyAudit.missing_factor_count} |
| stale_production_factor_count | ${finalistCopyAudit.stale_production_factor_count} |
| limited_data_confidence_failures | ${limitedDataConfidenceFailures} |
| safe_to_productionize_as_is | ${finalistCopySafe ? "yes" : "no"} |

Limited/missing/data-gap/non-high-reliability rows now require uncertainty language in the copy audit: "limited data", "partial read", "lower confidence", "broader than usual", or equivalent conservative wording.

### Top 20 Copy Failure Examples

| Region | Context | Month | Archetype | Score | Band | Concerns | Summary | Production drivers | Production suppressors | Adjusted drivers | Adjusted suppressors |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${copyFailureExamples(rows)}

## Productionization Implementation Map

| Area | Production files/functions | Implemented production change |
| --- | --- | --- |
${productionizationReadinessMap()}

## Final Release Risk Register

| Risk | Release stance | Monitoring / follow-up |
| --- | --- | --- |
| Severe-thermal Good rows remain under v46 | Accepted residual risk; v44 cap removes them but harms regional repair too much. | Monitor severe thermal Good reports and user feedback after release. |
| Recommender neutral->active movement is sizable | Accepted; movement is safe-direction only with no active->neutral or neutral->suppressed changes. | Watch downstream recommendation volume and engagement by region/context. |
| Diagnostic red flags remain | Not a hard blocker; runtime unsafe classification and Prime cautions are separated from diagnostic archetype flags. | Track red-flag archetype-like runtime cohorts after production telemetry exists. |
| Broad scoring tune | None pending. | Future changes should be narrow, evidence-backed follow-ups rather than a release blocker. |

## Band Distribution By Context

| Scenario | Context | Tough | Poor | Fair | Good | Prime |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
${
  Object.entries(allMetrics).map(([name, m]) => contextBandTable(name, m)).join(
    "\n",
  )
}

## Crossings And Prime Context

| Scenario | Band crossings | Prime by context |
| --- | --- | --- |
${crossingsTable(allMetrics)}

## Downward Band Crossings

| Scenario | Downward crossings |
| --- | --- |
${downwardCrossingsTable(allMetrics)}

## Prime And Good+Prime By Archetype

| Scenario | Prime by archetype | Good+Prime by archetype |
| --- | --- | --- |
${archetypeOutcomeTable(allMetrics)}

## Red-Flag Upgrades By Archetype/Context

| Scenario | Top red flags |
| --- | --- |
${redFlagByArchetypeContextTable(allMetrics)}

## Guardrails

| Scenario | Violations |
| --- | --- |
${guardrailTable(allMetrics)}

## Recommender Activity-Tier Changes

Shadow tier definition: suppressed <= 35, active >= 70, otherwise neutral.

| Scenario | Changes |
| --- | --- |
${activityTable(allMetrics)}

## Support Taxonomy Counts

| Scenario | Counts |
| --- | --- |
${supportTaxonomyTable(allMetrics)}

## Top 30 Highest-Score Rows

| Region | Month | Context | Archetype | Clarity | Score | Band | Timing | Positive mass | Negative mass | Strongest driver |
| --- | ---: | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: |
${topScoreRows(rows, best)}

## Ultimate Tail Probe

Probe-only synthetic requests do not affect the main distribution.

| Probe | Production score | Production band | Timing | v32 | v33 tail only | v33 tail plus | v34 tail | v34 tail plus | v35 | Positive mass | Negative mass |
| --- | ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${ultimateProbe.markdown}

## Red-Flag Upgrade Samples

Production Poor/Fair -> candidate Good/Prime where v3 red-flag criteria apply.

| Candidate | Region | Month | Context | Archetype | Clarity | Score | Band | Thin support | Drivers | Moderate suppressor | Clean | Trusted |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |
${VARIANTS.map((variant) => redFlagUpgradeRows(rows, variant)).join("\n")}

## Sample Band-Change Rows For Best Candidate

| Region | Month | Context | Archetype | Clarity | Score | Band | Timing |
| --- | ---: | --- | --- | --- | --- | --- | --- |
${sampleRows(rows, best)}

## Artifacts

- JSONL: \`${OUTPUT_JSONL}\`
- Markdown: \`${OUTPUT_MD}\`
`;

assertFinalMarkdownSelfCheck(markdown);

const jsonlFile = await Deno.open(OUTPUT_JSONL, {
  write: true,
  create: true,
  truncate: true,
});
try {
  const encoder = new TextEncoder();
  for (const row of rows) {
    const unsafe = unsafeUpgradeClassification(row, SCORING_FINALIST);
    const copyConcerns = copyAlignmentConcernsForFinalist(row);
    await jsonlFile.write(
      encoder.encode(
        `${
          JSON.stringify({
            ...row,
            finalist_validation: {
              scoring_finalist: SCORING_FINALIST,
              unsafe_upgrade: unsafe.unsafe,
              benign_supported_upgrade: unsafe.benign_supported,
              unsafe_upgrade_reasons: unsafe.reasons,
              copy_alignment_failure: copyConcerns.length > 0,
              copy_alignment_concerns: copyConcerns,
              copy_alignment_failure_count: Number(copyConcerns.length > 0),
              contradiction_count: copyConcerns.some((concern) =>
                  concern.startsWith("contradiction:")
                )
                ? 1
                : 0,
              missing_factor_count: copyConcerns.some((concern) =>
                  concern.startsWith("missing_factor:")
                )
                ? 1
                : 0,
              stale_production_factor_count: copyConcerns.some((concern) =>
                  concern.startsWith("stale_production_factor:")
                )
                ? 1
                : 0,
              productionized_actual_score: row.productionized_actual.score,
              productionized_actual_band: row.productionized_actual.band,
              productionized_matches_finalist_score:
                row.productionized_actual.score ===
                  row.candidates[SCORING_FINALIST].score,
              productionized_matches_finalist_band:
                row.productionized_actual.band ===
                  row.candidates[SCORING_FINALIST].band,
            },
          })
        }\n`,
      ),
    );
  }
} finally {
  jsonlFile.close();
}
await Deno.writeTextFile(OUTPUT_MD, markdown);

console.log(markdown);
console.log(`Wrote ${OUTPUT_JSONL}`);
console.log(`Wrote ${OUTPUT_MD}`);
