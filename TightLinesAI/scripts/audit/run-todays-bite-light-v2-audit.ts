#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 6A Light/Cloud V2 shadow audit.
 *
 * Audit-only. Production normalizers, scoreDay, report copy, app behavior, and
 * recommender production logic/candidate pools/scoring/gates/selection are not
 * modified by this script.
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
import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import {
  type LightV2Profile,
  normalizeLightV2,
} from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizeLightV2.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type {
  RecommenderRequest,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";
import type { DailyScenario } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-light-v2-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-light-v2-audit.md";

const CONTEXTS: readonly EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];
const WATER_CLARITIES: readonly WaterClarity[] = ["clear", "stained"];
const CANDIDATES: readonly LightV2Profile[] = [
  "production_control",
  "score_only_soft_overcast",
  "score_only_cold_clear_neutral",
  "score_only_heavy_overcast_cap",
  "score_only_combined",
  "label_or_mode_cleanup_diagnostic",
];
const FLAG_KEYS = [
  "bright_clear_penalty_during_cold_or_cool_water_questionable",
  "overcast_too_strong_as_daymaker",
  "heavy_overcast_windy_not_suppressed_enough",
  "clear_calm_surface_or_clear_subtle_questionable",
  "surface_gate_changes_from_light_wind",
  "missing_wind_or_cloud_overconfident",
  "verbal_driver_mismatch",
] as const;
type FlagKey = typeof FLAG_KEYS[number];

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
  | "clear_calm"
  | "clear_windy"
  | "mixed_light_breezy"
  | "overcast_calm"
  | "overcast_breezy"
  | "heavy_overcast_windy"
  | "low_light_calm"
  | "low_light_windy"
  | "severe_wind"
  | "missing_cloud"
  | "missing_wind"
  | "cold_clear_calm"
  | "cool_clear_breezy"
  | "neutral_clear_calm"
  | "warm_clear_calm"
  | "hot_clear_calm"
  | "coastal_clear"
  | "flats_clear_glare"
  | "coastal_overcast"
  | "flats_heavy_overcast_windy";
type TempStyle = "seasonal" | "cold" | "cool" | "neutral" | "warm" | "hot";
type Archetype = {
  id: ArchetypeId;
  cloud: number | null;
  wind: number | null;
  tempStyle: TempStyle;
};

const ARCHETYPES: readonly Archetype[] = [
  { id: "clear_calm", cloud: 5, wind: 2, tempStyle: "seasonal" },
  { id: "clear_windy", cloud: 5, wind: 20, tempStyle: "seasonal" },
  { id: "mixed_light_breezy", cloud: 50, wind: 10, tempStyle: "seasonal" },
  { id: "overcast_calm", cloud: 80, wind: 2, tempStyle: "seasonal" },
  { id: "overcast_breezy", cloud: 80, wind: 10, tempStyle: "seasonal" },
  { id: "heavy_overcast_windy", cloud: 95, wind: 22, tempStyle: "seasonal" },
  { id: "low_light_calm", cloud: 74, wind: 2, tempStyle: "seasonal" },
  { id: "low_light_windy", cloud: 74, wind: 22, tempStyle: "seasonal" },
  { id: "severe_wind", cloud: 50, wind: 36, tempStyle: "seasonal" },
  { id: "missing_cloud", cloud: null, wind: 8, tempStyle: "seasonal" },
  { id: "missing_wind", cloud: 50, wind: null, tempStyle: "seasonal" },
  { id: "cold_clear_calm", cloud: 5, wind: 2, tempStyle: "cold" },
  { id: "cool_clear_breezy", cloud: 5, wind: 10, tempStyle: "cool" },
  { id: "neutral_clear_calm", cloud: 5, wind: 2, tempStyle: "neutral" },
  { id: "warm_clear_calm", cloud: 5, wind: 2, tempStyle: "warm" },
  { id: "hot_clear_calm", cloud: 5, wind: 2, tempStyle: "hot" },
  { id: "coastal_clear", cloud: 5, wind: 8, tempStyle: "seasonal" },
  { id: "flats_clear_glare", cloud: 5, wind: 8, tempStyle: "seasonal" },
  { id: "coastal_overcast", cloud: 82, wind: 8, tempStyle: "seasonal" },
  {
    id: "flats_heavy_overcast_windy",
    cloud: 95,
    wind: 22,
    tempStyle: "seasonal",
  },
];

type VariableSnapshot =
  | { label: string; score: number; detail: string | null }
  | null;
type ContributionSnapshot = {
  key: ScoredVariableKey;
  label: string;
  score: number;
  weight: number;
  weighted_contribution: number;
};
type RecSnapshot =
  | {
    species: string;
    water_clarity: WaterClarity;
    activity_level: string;
    thermal_mode: string;
    light_mode: string;
    wind_mode: string;
    surface_daily_gate: string;
    scenario_tags: readonly string[];
    selected_lure_ids: readonly string[];
    selected_fly_ids: readonly string[];
  }
  | { species: SpeciesGroup; water_clarity: WaterClarity; error: string }
  | null;
type BaselineRow = {
  key: string;
  region: RegionKey;
  month: number;
  context: EngineContext;
  archetype: Archetype;
  water_clarity: WaterClarity;
  req: SharedEngineRequest;
  norm: SharedNormalizedOutput;
  scored: ReturnType<typeof scoreDay>;
  activity_tier: string;
  light: VariableSnapshot;
  drivers: ContributionSnapshot[];
  suppressors: ContributionSnapshot[];
  flags: FlagKey[];
  recommender: RecSnapshot;
  recommenderRuntime?: {
    recReq: RecommenderRequest;
    analysis: SharedConditionAnalysis;
    seasonalRow: ReturnType<typeof resolveDailyPicksSeasonalRow>;
    seed: string;
  };
};
type AuditRow = {
  candidate_id: LightV2Profile;
  region: RegionKey;
  month: number;
  context: EngineContext;
  archetype: ArchetypeId;
  water_clarity: WaterClarity;
  baseline_score: number;
  v2_score: number;
  score_delta: number;
  baseline_activity_tier: string;
  v2_activity_tier: string;
  reliability_changed: boolean;
  baseline_light: VariableSnapshot;
  v2_light: VariableSnapshot;
  light_label_changed: boolean;
  light_score_sign_changed: boolean;
  light_driver_changed: boolean;
  light_suppressor_changed: boolean;
  baseline_flags: FlagKey[];
  v2_flags: FlagKey[];
  baseline_recommender: RecSnapshot;
  v2_recommender: RecSnapshot;
  selected_pick_ids_changed: boolean;
  thermal_mode_changed: boolean;
  light_mode_changed: boolean;
  surface_gate_changed: boolean;
  scenario_tags_changed: boolean;
};

function seasonallyReasonableMean(region: RegionKey, month: number): number {
  const northern = new Set<RegionKey>([
    "northeast",
    "great_lakes_upper_midwest",
    "midwest_interior",
    "pacific_northwest",
    "mountain_alpine",
    "inland_northwest",
    "alaska",
  ]);
  const hot = new Set<RegionKey>([
    "florida",
    "gulf_coast",
    "south_central",
    "southwest_desert",
    "southwest_high_desert",
    "southern_california",
    "hawaii",
  ]);
  if (month <= 2 || month === 12) {
    return northern.has(region) ? 42 : hot.has(region) ? 66 : 50;
  }
  if (month >= 6 && month <= 8) {
    return northern.has(region) ? 66 : hot.has(region) ? 78 : 72;
  }
  return northern.has(region) ? 56 : hot.has(region) ? 72 : 64;
}

function meanForArchetype(
  region: RegionKey,
  month: number,
  style: TempStyle,
): number {
  if (style === "cold") return 34;
  if (style === "cool") return 48;
  if (style === "neutral") return 62;
  if (style === "warm") return 76;
  if (style === "hot") return 92;
  return seasonallyReasonableMean(region, month);
}

function tideHighLow(month: number) {
  const m = String(month).padStart(2, "0");
  return [
    { time: `2026-${m}-15T05:30:00`, value: 0.2, type: "L" },
    { time: `2026-${m}-15T11:45:00`, value: 2.2, type: "H" },
    { time: `2026-${m}-15T18:10:00`, value: 0.3, type: "L" },
  ];
}

function buildRequest(
  region: RegionKey,
  month: number,
  context: EngineContext,
  archetype: Archetype,
): SharedEngineRequest {
  const meta = REGION_META[region];
  const localDate = `2026-${String(month).padStart(2, "0")}-15`;
  const coastal = context === "coastal" || context === "coastal_flats_estuary";
  const mean = meanForArchetype(region, month, archetype.tempStyle);
  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: region,
    local_date: localDate,
    local_timezone: meta.tz,
    context,
    environment: {
      current_air_temp_f: mean,
      daily_mean_air_temp_f: mean,
      daily_low_air_temp_f: mean - 6,
      daily_high_air_temp_f: mean + 8,
      prior_day_mean_air_temp_f: mean,
      day_minus_2_mean_air_temp_f: mean,
      pressure_mb: 1014,
      pressure_history_mb: Array.from({ length: 24 }, () => 1014),
      wind_speed_mph: archetype.wind,
      cloud_cover_pct: archetype.cloud,
      precip_rate_now_in_per_hr: 0,
      active_precip_now: false,
      precip_24h_in: context === "freshwater_river" ? 0.08 : 0.02,
      precip_72h_in: context === "freshwater_river" ? 0.15 : 0.05,
      precip_7d_in: context === "freshwater_river" ? 0.40 : 0.10,
      tide_movement_state: coastal ? "incoming" : null,
      current_speed_knots_max: coastal ? 1.0 : null,
      tide_high_low: coastal ? tideHighLow(month) : null,
      tide_height_hourly_ft: null,
    },
    data_coverage: { source_notes: [] },
  };
}

function speciesForContext(context: EngineContext): SpeciesGroup | null {
  if (context === "freshwater_lake_pond") return "largemouth_bass";
  if (context === "freshwater_river") return "river_trout";
  return null;
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
  c: ReturnType<typeof scoreDay>["drivers"][number],
): ContributionSnapshot {
  return {
    key: c.key,
    label: c.label,
    score: c.score,
    weight: c.weight,
    weighted_contribution: c.weightedContribution,
  };
}

function recSnapshot(
  scenario: DailyScenario,
  ids: {
    selected_lure_ids: readonly string[];
    selected_fly_ids: readonly string[];
  },
): Exclude<RecSnapshot, null | { error: string }> {
  return {
    species: scenario.species,
    water_clarity: scenario.water_clarity,
    activity_level: scenario.activity_level,
    thermal_mode: scenario.thermal_mode,
    light_mode: scenario.light_mode,
    wind_mode: scenario.wind_mode,
    surface_daily_gate: scenario.surface_daily_gate,
    scenario_tags: scenario.scenario_tags,
    selected_lure_ids: ids.selected_lure_ids,
    selected_fly_ids: ids.selected_fly_ids,
  };
}

function buildRecRuntime(args: {
  req: SharedEngineRequest;
  norm: SharedNormalizedOutput;
  scored: ReturnType<typeof scoreDay>;
  waterClarity: WaterClarity;
  key: string;
}): Pick<BaselineRow, "recommender" | "recommenderRuntime"> {
  const species = speciesForContext(args.req.context);
  if (!species) return { recommender: null };
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
      water_clarity: args.waterClarity,
      recommendation_goal: "all_purpose",
      env_data: {
        ...args.req.environment,
        weather: { wind_speed_unit: "mph" },
      },
    };
    const baseAnalysis = analyzeRecommenderConditions(recReq);
    const analysis = {
      ...baseAnalysis,
      norm: args.norm,
      scored: args.scored,
    } as SharedConditionAnalysis;
    const seasonalRow = resolveDailyPicksSeasonalRow({
      species,
      region_key: args.req.region_key,
      month,
      water_type: args.req.context,
    });
    const seed = `light-v2|${args.key}`;
    const result = runDailyPicksEngine({
      req: recReq,
      analysis,
      seasonalRow,
      seed,
      variant: "A",
    });
    return {
      recommender: recSnapshot(result.scenario, {
        selected_lure_ids: result.diagnostics.selected_lure_ids,
        selected_fly_ids: result.diagnostics.selected_fly_ids,
      }),
      recommenderRuntime: { recReq, analysis, seasonalRow, seed },
    };
  } catch (error) {
    return {
      recommender: {
        species,
        water_clarity: args.waterClarity,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

function hasContribution(
  contributions: ContributionSnapshot[],
  key: ScoredVariableKey,
): boolean {
  return contributions.some((c) => c.key === key);
}

function flagsFor(args: {
  archetype: Archetype;
  context: EngineContext;
  score: number;
  reliability: string;
  light: VariableSnapshot;
  temperatureBandLabel: string | undefined;
  drivers: ContributionSnapshot[];
  suppressors: ContributionSnapshot[];
  missing: readonly string[];
  recommender: RecSnapshot;
  surfaceChanged?: boolean;
}): FlagKey[] {
  const flags: FlagKey[] = [];
  const lightScore = args.light?.score ?? null;
  const coldCool = args.temperatureBandLabel === "very_cold" ||
    args.temperatureBandLabel === "cool";
  if (
    coldCool && args.archetype.cloud != null && args.archetype.cloud <= 25 &&
    lightScore != null && lightScore < 0
  ) flags.push("bright_clear_penalty_during_cold_or_cool_water_questionable");
  if (
    args.light?.label === "heavy_overcast" && lightScore != null &&
    lightScore >= 0.95 &&
    hasContribution(args.drivers, "light_cloud_condition")
  ) flags.push("overcast_too_strong_as_daymaker");
  if (
    args.archetype.id.includes("heavy_overcast") &&
    (args.archetype.wind ?? 0) >= 18 &&
    lightScore != null &&
    lightScore > 0.45 &&
    hasContribution(args.drivers, "light_cloud_condition")
  ) flags.push("heavy_overcast_windy_not_suppressed_enough");
  if (
    args.archetype.id === "clear_calm" && args.recommender != null &&
    !("error" in args.recommender) &&
    (args.recommender.surface_daily_gate === "open" ||
      args.recommender.scenario_tags.includes("clear_subtle"))
  ) flags.push("clear_calm_surface_or_clear_subtle_questionable");
  if (args.surfaceChanged) flags.push("surface_gate_changes_from_light_wind");
  if (
    (args.missing.includes("light_cloud_condition") ||
      args.missing.includes("wind_condition")) &&
    args.reliability === "high"
  ) flags.push("missing_wind_or_cloud_overconfident");
  if (
    hasContribution(args.drivers, "light_cloud_condition") &&
    lightScore != null && lightScore <= 0
  ) flags.push("verbal_driver_mismatch");
  if (
    hasContribution(args.suppressors, "light_cloud_condition") &&
    lightScore != null && lightScore >= 0
  ) flags.push("verbal_driver_mismatch");
  return [...new Set(flags)];
}

function buildBaselineRows(): BaselineRow[] {
  const rows: BaselineRow[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of CONTEXTS) {
        for (const archetype of ARCHETYPES) {
          for (const waterClarity of WATER_CLARITIES) {
            const key =
              `${region}|${month}|${context}|${archetype.id}|${waterClarity}`;
            const req = buildRequest(region, month, context, archetype);
            const norm = buildSharedNormalizedOutput(req);
            const scored = scoreDay(norm);
            const drivers = scored.drivers.map(contributionSnapshot);
            const suppressors = scored.suppressors.map(contributionSnapshot);
            const rec = buildRecRuntime({
              req,
              norm,
              scored,
              waterClarity,
              key,
            });
            const light = variableSnapshot(
              norm.normalized.light_cloud_condition,
            );
            rows.push({
              key,
              region,
              month,
              context,
              archetype,
              water_clarity: waterClarity,
              req,
              norm,
              scored,
              activity_tier: compositeScoreActivityTier(scored.score),
              light,
              drivers,
              suppressors,
              flags: flagsFor({
                archetype,
                context,
                score: scored.score,
                reliability: norm.reliability,
                light,
                temperatureBandLabel: norm.normalized.temperature?.band_label,
                drivers,
                suppressors,
                missing: norm.missing_variables,
                recommender: rec.recommender,
              }),
              recommender: rec.recommender,
              recommenderRuntime: rec.recommenderRuntime,
            });
          }
        }
      }
    }
  }
  return rows;
}

function cloneWithLight(
  row: BaselineRow,
  profile: LightV2Profile,
): SharedNormalizedOutput {
  if (profile === "production_control") return row.norm;
  const normalized = { ...row.norm.normalized };
  const light = normalizeLightV2(
    row.req.environment.cloud_cover_pct,
    row.context,
    profile,
    {
      temperatureBandLabel: row.norm.normalized.temperature?.band_label,
      windMph: row.req.environment.wind_speed_mph,
    },
  );
  if (light) normalized.light_cloud_condition = light;
  else delete normalized.light_cloud_condition;
  return { ...row.norm, normalized };
}

function rerunRecommender(
  row: BaselineRow,
  norm: SharedNormalizedOutput,
  scored: ReturnType<typeof scoreDay>,
): RecSnapshot {
  if (!row.recommenderRuntime) return row.recommender;
  try {
    const result = runDailyPicksEngine({
      req: row.recommenderRuntime.recReq,
      analysis: {
        ...row.recommenderRuntime.analysis,
        norm,
        scored,
      } as SharedConditionAnalysis,
      seasonalRow: row.recommenderRuntime.seasonalRow,
      seed: row.recommenderRuntime.seed,
      variant: "A",
    });
    return recSnapshot(result.scenario, {
      selected_lure_ids: result.diagnostics.selected_lure_ids,
      selected_fly_ids: result.diagnostics.selected_fly_ids,
    });
  } catch (error) {
    const species = speciesForContext(row.context);
    return species
      ? {
        species,
        water_clarity: row.water_clarity,
        error: error instanceof Error ? error.message : String(error),
      }
      : null;
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

function sign(n: number | null | undefined): number {
  if (n == null || Math.abs(n) < 1e-9) return 0;
  return n > 0 ? 1 : -1;
}

function evaluateCandidate(
  rows: BaselineRow[],
  candidate: LightV2Profile,
): AuditRow[] {
  return rows.map((row) => {
    const norm = cloneWithLight(row, candidate);
    const scored = candidate === "production_control"
      ? row.scored
      : scoreDay(norm);
    const drivers = scored.drivers.map(contributionSnapshot);
    const suppressors = scored.suppressors.map(contributionSnapshot);
    const v2Rec = candidate === "production_control"
      ? row.recommender
      : rerunRecommender(row, norm, scored);
    const surfaceChanged = row.recommender != null && v2Rec != null &&
      !("error" in row.recommender) && !("error" in v2Rec) &&
      row.recommender.surface_daily_gate !== v2Rec.surface_daily_gate;
    const light = variableSnapshot(norm.normalized.light_cloud_condition);
    const v2Flags = flagsFor({
      archetype: row.archetype,
      context: row.context,
      score: scored.score,
      reliability: norm.reliability,
      light,
      temperatureBandLabel: norm.normalized.temperature?.band_label,
      drivers,
      suppressors,
      missing: norm.missing_variables,
      recommender: v2Rec,
      surfaceChanged,
    });
    const baselineHasDriver = hasContribution(
      row.drivers,
      "light_cloud_condition",
    );
    const v2HasDriver = hasContribution(drivers, "light_cloud_condition");
    const baselineHasSuppressor = hasContribution(
      row.suppressors,
      "light_cloud_condition",
    );
    const v2HasSuppressor = hasContribution(
      suppressors,
      "light_cloud_condition",
    );
    return {
      candidate_id: candidate,
      region: row.region,
      month: row.month,
      context: row.context,
      archetype: row.archetype.id,
      water_clarity: row.water_clarity,
      baseline_score: row.scored.score,
      v2_score: scored.score,
      score_delta: scored.score - row.scored.score,
      baseline_activity_tier: row.activity_tier,
      v2_activity_tier: compositeScoreActivityTier(scored.score),
      reliability_changed: norm.reliability !== row.norm.reliability,
      baseline_light: row.light,
      v2_light: light,
      light_label_changed: row.light?.label !== light?.label,
      light_score_sign_changed: sign(row.light?.score) !== sign(light?.score),
      light_driver_changed: baselineHasDriver !== v2HasDriver,
      light_suppressor_changed: baselineHasSuppressor !== v2HasSuppressor,
      baseline_flags: row.flags,
      v2_flags: v2Flags,
      baseline_recommender: row.recommender,
      v2_recommender: v2Rec,
      selected_pick_ids_changed: !samePicks(row.recommender, v2Rec),
      thermal_mode_changed: row.recommender != null && v2Rec != null &&
        !("error" in row.recommender) && !("error" in v2Rec) &&
        row.recommender.thermal_mode !== v2Rec.thermal_mode,
      light_mode_changed: row.recommender != null && v2Rec != null &&
        !("error" in row.recommender) && !("error" in v2Rec) &&
        row.recommender.light_mode !== v2Rec.light_mode,
      surface_gate_changed: surfaceChanged,
      scenario_tags_changed: !sameTags(row.recommender, v2Rec),
    };
  });
}

type CandidateSummary = {
  candidate: LightV2Profile;
  totalRows: number;
  lightMismatches: number;
  scoreDeltaRows: number;
  avgDelta: number;
  maxDelta: number;
  minDelta: number;
  abs8: number;
  abs12: number;
  activityTierChanges: number;
  reliabilityChanges: number;
  lightLabelChanges: number;
  lightSignChanges: number;
  lightDriverChanges: number;
  lightSuppressorChanges: number;
  recValid: number;
  recErrors: number;
  selectedPickChanges: number;
  thermalModeChanges: number;
  lightModeChanges: number;
  surfaceGateChanges: number;
  tagChanges: number;
  flags: Record<FlagKey, number>;
};

function summarize(
  rows: AuditRow[],
  candidate: LightV2Profile,
): CandidateSummary {
  const deltas = rows.map((r) => r.score_delta);
  const recRows = rows.filter((r) => r.baseline_recommender != null);
  const recValid =
    recRows.filter((r) =>
      r.baseline_recommender != null && r.v2_recommender != null &&
      !("error" in r.baseline_recommender) && !("error" in r.v2_recommender)
    ).length;
  const flags = Object.fromEntries(
    FLAG_KEYS.map((
      flag,
    ) => [flag, rows.filter((r) => r.v2_flags.includes(flag)).length]),
  ) as Record<FlagKey, number>;
  return {
    candidate,
    totalRows: rows.length,
    lightMismatches:
      rows.filter((r) =>
        r.baseline_light?.label !== r.v2_light?.label ||
        r.baseline_light?.detail !== r.v2_light?.detail ||
        Math.abs(
            (r.baseline_light?.score ?? NaN) - (r.v2_light?.score ?? NaN),
          ) >
          1e-4
      ).length,
    scoreDeltaRows: rows.filter((r) => Math.abs(r.score_delta) > 1e-9).length,
    avgDelta: deltas.reduce((a, b) => a + b, 0) / rows.length,
    maxDelta: Math.max(...deltas),
    minDelta: Math.min(...deltas),
    abs8: rows.filter((r) => Math.abs(r.score_delta) >= 8).length,
    abs12: rows.filter((r) => Math.abs(r.score_delta) >= 12).length,
    activityTierChanges:
      rows.filter((r) => r.baseline_activity_tier !== r.v2_activity_tier)
        .length,
    reliabilityChanges: rows.filter((r) => r.reliability_changed).length,
    lightLabelChanges: rows.filter((r) => r.light_label_changed).length,
    lightSignChanges: rows.filter((r) => r.light_score_sign_changed).length,
    lightDriverChanges: rows.filter((r) => r.light_driver_changed).length,
    lightSuppressorChanges:
      rows.filter((r) => r.light_suppressor_changed).length,
    recValid,
    recErrors: recRows.length - recValid,
    selectedPickChanges: rows.filter((r) => r.selected_pick_ids_changed).length,
    thermalModeChanges: rows.filter((r) => r.thermal_mode_changed).length,
    lightModeChanges: rows.filter((r) => r.light_mode_changed).length,
    surfaceGateChanges: rows.filter((r) => r.surface_gate_changed).length,
    tagChanges: rows.filter((r) => r.scenario_tags_changed).length,
    flags,
  };
}

function meetsTargets(s: CandidateSummary): boolean {
  return s.abs8 === 0 && s.abs12 === 0 && s.reliabilityChanges === 0 &&
    s.recValid > 0 &&
    s.selectedPickChanges / s.recValid <= 0.02 &&
    s.lightModeChanges / s.recValid <= 0.01 &&
    s.surfaceGateChanges / s.recValid <= 0.005 &&
    s.tagChanges / s.recValid <= 0.01;
}

function chooseBest(summaries: CandidateSummary[]): CandidateSummary {
  const candidates = summaries.filter((s) =>
    s.candidate !== "production_control"
  );
  const viable = candidates.filter(meetsTargets);
  const pool = viable.length ? viable : candidates;
  return [...pool].sort((a, b) =>
    a.selectedPickChanges - b.selectedPickChanges ||
    a.surfaceGateChanges - b.surfaceGateChanges ||
    a.abs12 - b.abs12 ||
    a.abs8 - b.abs8 ||
    a.lightModeChanges - b.lightModeChanges ||
    totalFlags(a) - totalFlags(b)
  )[0]!;
}

function totalFlags(s: CandidateSummary): number {
  return FLAG_KEYS.reduce((sum, flag) => sum + s.flags[flag], 0);
}

function summaryTable(summaries: CandidateSummary[]): string {
  return summaries.map((s) =>
    `| ${s.candidate} | ${s.totalRows} | ${s.lightMismatches} | ${s.scoreDeltaRows} | ${
      s.avgDelta.toFixed(2)
    } | ${s.maxDelta} | ${s.minDelta} | ${s.abs8} | ${s.abs12} | ${s.activityTierChanges} | ${s.reliabilityChanges} | ${s.lightLabelChanges} | ${s.lightSignChanges} | ${s.lightDriverChanges} | ${s.lightSuppressorChanges} | ${s.recValid} | ${s.recErrors} | ${s.selectedPickChanges} | ${
      pct(s.selectedPickChanges, s.recValid)
    } | ${s.lightModeChanges} | ${s.surfaceGateChanges} | ${s.tagChanges} | ${
      totalFlags(s)
    } | ${meetsTargets(s) ? "yes" : "no"} |`
  ).join("\n");
}

function flagTable(before: CandidateSummary, after: CandidateSummary): string {
  return FLAG_KEYS.map((flag) =>
    `| ${flag} | ${before.flags[flag]} | ${after.flags[flag]} | ${
      before.flags[flag] - after.flags[flag]
    } |`
  ).join("\n");
}

function pct(n: number, d: number): string {
  if (!d) return "n/a";
  return `${((n / d) * 100).toFixed(2)}%`;
}

function dist(
  rows: AuditRow[],
  pick: (row: AuditRow) => string | null,
): string {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = pick(row);
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) =>
    `- ${k}: ${v}`
  ).join("\n");
}

function samples(rows: AuditRow[], limit: number): string {
  return rows.slice(0, limit).map((r) =>
    `| ${r.candidate_id} | ${r.region} | ${r.month} | ${r.context} | ${r.archetype} | ${r.water_clarity} | ${r.score_delta} | ${
      r.baseline_light?.label ?? "null"
    }:${r.baseline_light?.score ?? "null"} | ${r.v2_light?.label ?? "null"}:${
      r.v2_light?.score ?? "null"
    } | ${r.v2_flags.join(", ")} | ${r.selected_pick_ids_changed} |`
  ).join("\n");
}

const baselineRows = buildBaselineRows();
const evaluated = CANDIDATES.map((candidate) => ({
  candidate,
  rows: evaluateCandidate(baselineRows, candidate),
}));
const summaries = evaluated.map(({ candidate, rows }) =>
  summarize(rows, candidate)
);
const production = summaries.find((s) => s.candidate === "production_control")!;
const best = chooseBest(summaries);
const bestRows = evaluated.find((e) => e.candidate === best.candidate)!.rows;
const allRows = evaluated.flatMap((e) => e.rows);
const questionable = bestRows.filter((r) => r.v2_flags.length > 0).slice(0, 40);
const largestDeltas = [...bestRows].sort((a, b) =>
  Math.abs(b.score_delta) - Math.abs(a.score_delta)
).slice(0, 30);

const parity = summaries.find((s) =>
  s.candidate === "score_only_heavy_overcast_cap"
)!;

const markdown = `# Today's Bite Light/Cloud V2 Production Parity Audit

Generated: ${new Date().toISOString()}

Phase 6C production parity audit. Production light/cloud scoring is expected to match \`score_only_heavy_overcast_cap\`. Recommender production logic remains unchanged.

## Production Parity

- Production-vs-experiment light mismatches: **${parity.lightMismatches}**
- Production-vs-experiment score delta rows: **${parity.scoreDeltaRows}**
- Production-vs-experiment selected-pick changes: **${parity.selectedPickChanges}**
- Production-vs-experiment light-mode changes: **${parity.lightModeChanges}**
- Production-vs-experiment surface-gate changes: **${parity.surfaceGateChanges}**
- Production-vs-experiment scenario-tag changes: **${parity.tagChanges}**

## Historical Pre-Wiring Impact

Retained from Phase 6A/6B before production wiring:

- avg delta: **-0.23**
- max/min delta: **0 / -4**
- abs(score_delta) >= 8: **0**
- abs(score_delta) >= 12: **0**
- selected-pick changes: **0 / 14,400**
- total questionable flags: **8,177 -> 3,613**

## Current Production Findings

- Total production baseline rows: ${baselineRows.length}
- Production current-state questionable light flags: ${totalFlags(production)}
- Production bright/cold clear penalty flags: ${production.flags.bright_clear_penalty_during_cold_or_cool_water_questionable}
- Production overcast daymaker flags: ${production.flags.overcast_too_strong_as_daymaker}
- Production heavy-overcast windy flags: ${production.flags.heavy_overcast_windy_not_suppressed_enough}
- Production missing wind/cloud overconfident flags: ${production.flags.missing_wind_or_cloud_overconfident}

## Candidate Sweep

Best candidate: **${best.candidate}**

| Candidate | Rows | Light Mismatches | Score Delta Rows | Avg Delta | Max | Min | abs>=8 | abs>=12 | Activity Tier Changes | Reliability Changes | Light Label Changes | Light Sign Changes | Light Driver Changes | Light Suppressor Changes | Rec Valid | Rec Errors | Pick Changes | Pick Change % | Light Mode Changes | Surface Gate Changes | Tag Changes | Total Flags | Meets Targets |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
${summaryTable(summaries)}

## Flags: Production vs Best

| Flag | Production | ${best.candidate} | Reduction |
| --- | ---: | ---: | ---: |
${flagTable(production, best)}

## Recommender Coupling

- Valid recommender rows for best candidate: ${best.recValid}
- Recommender error rows for best candidate: ${best.recErrors}
- Selected-pick changes: ${best.selectedPickChanges} (${
  pct(best.selectedPickChanges, best.recValid)
})
- Light mode changes: ${best.lightModeChanges} (${
  pct(best.lightModeChanges, best.recValid)
})
- Surface gate changes: ${best.surfaceGateChanges} (${
  pct(best.surfaceGateChanges, best.recValid)
})
- Scenario tag changes: ${best.tagChanges} (${
  pct(best.tagChanges, best.recValid)
})

### Best Candidate Light Mode Distribution

${
  dist(bestRows, (r) =>
    r.v2_recommender != null && !("error" in r.v2_recommender)
      ? r.v2_recommender.light_mode
      : null)
}

### Best Candidate Surface Gate Distribution

${
  dist(bestRows, (r) =>
    r.v2_recommender != null && !("error" in r.v2_recommender)
      ? r.v2_recommender.surface_daily_gate
      : null)
}

## Largest Score Deltas For Best Candidate

| Candidate | Region | Month | Context | Archetype | Clarity | Delta | Baseline Light | V2 Light | V2 Flags | Picks Changed |
| --- | --- | ---: | --- | --- | --- | ---: | --- | --- | --- | --- |
${samples(largestDeltas, 30)}

## Representative Questionable Samples

| Candidate | Region | Month | Context | Archetype | Clarity | Delta | Baseline Light | V2 Light | V2 Flags | Picks Changed |
| --- | --- | ---: | --- | --- | --- | ---: | --- | --- | --- | --- |
${samples(questionable, 40)}

## Production Plumbing

Production wiring now passes \`e.wind_speed_mph\` from \`buildNormalized.ts\` into \`normalizeLight(..., { windMph })\`. The public function name remains unchanged, labels/details/null behavior are preserved, and only heavy-overcast score ranges changed.

## Recommendation

${
  parity.lightMismatches === 0 && parity.scoreDeltaRows === 0 &&
    parity.selectedPickChanges === 0 && parity.lightModeChanges === 0 &&
    parity.surfaceGateChanges === 0 && parity.tagChanges === 0
    ? `Production parity confirmed for ${parity.candidate}.`
    : `Production parity failed; inspect mismatches before release.`
}

## Artifacts

- JSONL: \`${OUTPUT_JSONL}\`
- Markdown: \`${OUTPUT_MD}\`
`;

await Deno.writeTextFile(
  OUTPUT_JSONL,
  allRows.map((row) => JSON.stringify(row)).join("\n") + "\n",
);
await Deno.writeTextFile(OUTPUT_MD, markdown);

console.log(markdown);
console.log(`Wrote ${OUTPUT_JSONL}`);
console.log(`Wrote ${OUTPUT_MD}`);
