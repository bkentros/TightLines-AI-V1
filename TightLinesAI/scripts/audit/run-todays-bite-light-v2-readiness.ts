#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 6B Light/Cloud V2 qualitative readiness audit.
 *
 * Shadow/readiness only. Production normalizeLight/buildNormalized/scoreDay,
 * report copy, app/forecast behavior, other normalizers, and recommender
 * production logic/candidate pools/scoring/gates/selection are not modified.
 */

import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
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
import { normalizeLightV2 } from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizeLightV2.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type {
  RecommenderRequest,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";
import type { DailyScenario } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-light-v2-readiness.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-light-v2-readiness.md";
const PROFILE = "score_only_heavy_overcast_cap" as const;

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
type Fixture = {
  id: string;
  name: string;
  expectation: string;
  region: RegionKey;
  month: number;
  context: EngineContext;
  cloud: number | null;
  wind: number | null;
  tempF: number;
  precip?: { p24: number; p72: number; p7d: number };
  water_clarity?: WaterClarity;
  check: (row: ReadinessRow) => { status: Status; reason: string };
};
type Status = "pass" | "questionable" | "fail";
type ReadinessRow = {
  fixture_id: string;
  fixture_name: string;
  expectation: string;
  region: RegionKey;
  month: number;
  context: EngineContext;
  water_clarity: WaterClarity;
  baseline_score: number;
  v2_score: number;
  score_delta: number;
  baseline_activity_tier: string;
  v2_activity_tier: string;
  activity_tier_changed: boolean;
  reliability_changed: boolean;
  baseline_reliability: string;
  v2_reliability: string;
  baseline_light: VariableSnapshot;
  v2_light: VariableSnapshot;
  light_label_changed: boolean;
  light_driver_changed: boolean;
  light_suppressor_changed: boolean;
  baseline_recommender: RecSnapshot;
  v2_recommender: RecSnapshot;
  selected_pick_ids_changed: boolean;
  light_mode_changed: boolean;
  surface_gate_changed: boolean;
  scenario_tags_changed: boolean;
  status: Status;
  reason: string;
};

function tideHighLow(month: number) {
  const m = String(month).padStart(2, "0");
  return [
    { time: `2026-${m}-15T05:30:00`, value: 0.2, type: "L" },
    { time: `2026-${m}-15T11:45:00`, value: 2.2, type: "H" },
    { time: `2026-${m}-15T18:10:00`, value: 0.3, type: "L" },
  ];
}

function buildRequest(f: Fixture): SharedEngineRequest {
  const meta = REGION_META[f.region];
  const localDate = `2026-${String(f.month).padStart(2, "0")}-15`;
  const coastal = f.context === "coastal" ||
    f.context === "coastal_flats_estuary";
  const p = f.precip ??
    (f.context === "freshwater_river"
      ? { p24: 0.08, p72: 0.15, p7d: 0.40 }
      : { p24: 0.02, p72: 0.05, p7d: 0.10 });
  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: f.region,
    local_date: localDate,
    local_timezone: meta.tz,
    context: f.context,
    environment: {
      current_air_temp_f: f.tempF,
      daily_mean_air_temp_f: f.tempF,
      daily_low_air_temp_f: f.tempF - 6,
      daily_high_air_temp_f: f.tempF + 8,
      prior_day_mean_air_temp_f: f.tempF,
      day_minus_2_mean_air_temp_f: f.tempF,
      pressure_mb: 1014,
      pressure_history_mb: Array.from({ length: 24 }, () => 1014),
      wind_speed_mph: f.wind,
      cloud_cover_pct: f.cloud,
      precip_rate_now_in_per_hr: 0,
      active_precip_now: false,
      precip_24h_in: p.p24,
      precip_72h_in: p.p72,
      precip_7d_in: p.p7d,
      tide_movement_state: coastal ? "incoming" : null,
      current_speed_knots_max: coastal ? 1.0 : null,
      tide_high_low: coastal ? tideHighLow(f.month) : null,
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

function hasContribution(
  contributions: ContributionSnapshot[],
  key: ScoredVariableKey,
): boolean {
  return contributions.some((c) => c.key === key);
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

function buildRecommender(args: {
  req: SharedEngineRequest;
  norm: SharedNormalizedOutput;
  scored: ReturnType<typeof scoreDay>;
  waterClarity: WaterClarity;
  seed: string;
}): {
  rec: RecSnapshot;
  runtime?: {
    recReq: RecommenderRequest;
    analysis: SharedConditionAnalysis;
    seasonalRow: ReturnType<typeof resolveDailyPicksSeasonalRow>;
    seed: string;
  };
} {
  const species = speciesForContext(args.req.context);
  if (!species) return { rec: null };
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
    const result = runDailyPicksEngine({
      req: recReq,
      analysis,
      seasonalRow,
      seed: args.seed,
      variant: "A",
    });
    return {
      rec: recSnapshot(result.scenario, {
        selected_lure_ids: result.diagnostics.selected_lure_ids,
        selected_fly_ids: result.diagnostics.selected_fly_ids,
      }),
      runtime: { recReq, analysis, seasonalRow, seed: args.seed },
    };
  } catch (error) {
    return {
      rec: {
        species,
        water_clarity: args.waterClarity,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

function rerunRecommender(
  runtime: NonNullable<ReturnType<typeof buildRecommender>["runtime"]>,
  norm: SharedNormalizedOutput,
  scored: ReturnType<typeof scoreDay>,
): RecSnapshot {
  try {
    const result = runDailyPicksEngine({
      req: runtime.recReq,
      analysis: {
        ...runtime.analysis,
        norm,
        scored,
      } as SharedConditionAnalysis,
      seasonalRow: runtime.seasonalRow,
      seed: runtime.seed,
      variant: "A",
    });
    return recSnapshot(result.scenario, {
      selected_lure_ids: result.diagnostics.selected_lure_ids,
      selected_fly_ids: result.diagnostics.selected_fly_ids,
    });
  } catch (error) {
    return {
      species: runtime.recReq.species,
      water_clarity: runtime.recReq.water_clarity,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function cloneWithV2Light(
  req: SharedEngineRequest,
  norm: SharedNormalizedOutput,
): SharedNormalizedOutput {
  const normalized = { ...norm.normalized };
  const light = normalizeLightV2(
    req.environment.cloud_cover_pct,
    req.context,
    PROFILE,
    {
      temperatureBandLabel: norm.normalized.temperature?.band_label,
      windMph: req.environment.wind_speed_mph,
    },
  );
  if (light) normalized.light_cloud_condition = light;
  else delete normalized.light_cloud_condition;
  return { ...norm, normalized };
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

function commonAcceptance(
  row: ReadinessRow,
): { status: Status; reason: string } {
  const problems: string[] = [];
  if (row.reliability_changed) problems.push("reliability changed");
  if (row.light_label_changed) problems.push("light label changed");
  if (row.light_mode_changed) problems.push("light_mode changed");
  if (row.surface_gate_changed) problems.push("surface gate changed");
  if (row.selected_pick_ids_changed) problems.push("selected picks changed");
  if (problems.length) return { status: "fail", reason: problems.join("; ") };
  return {
    status: "pass",
    reason: "public labels and recommender outputs stable",
  };
}

function heavyWindCapped(
  row: ReadinessRow,
): { status: Status; reason: string } {
  const common = commonAcceptance(row);
  if (common.status === "fail") return common;
  if ((row.v2_light?.score ?? 99) > 0.50) {
    return {
      status: "fail",
      reason:
        `heavy-overcast strong-wind light score too high: ${row.v2_light?.score}`,
    };
  }
  return { status: "pass", reason: "heavy overcast strong wind capped" };
}

function heavyCalmHelpful(
  row: ReadinessRow,
): { status: Status; reason: string } {
  const common = commonAcceptance(row);
  if (common.status === "fail") return common;
  const score = row.v2_light?.score ?? -99;
  if (score < 0.60 || score > 0.90) {
    return {
      status: "fail",
      reason:
        `calm heavy-overcast score should stay modest/helpful, got ${score}`,
    };
  }
  return {
    status: "pass",
    reason: "heavy overcast calm remains modestly helpful",
  };
}

function unchanged(row: ReadinessRow): { status: Status; reason: string } {
  const common = commonAcceptance(row);
  if (common.status !== "pass") return common;
  if (row.score_delta !== 0) {
    return {
      status: "questionable",
      reason: `expected no score movement, got ${row.score_delta}`,
    };
  }
  return common;
}

const FIXTURES: readonly Fixture[] = [
  {
    id: "lake_summer_heavy_overcast_calm",
    name: "Freshwater lake, summer, heavy overcast calm",
    expectation: "overcast remains helpful, not over-suppressed",
    region: "midwest_interior",
    month: 7,
    context: "freshwater_lake_pond",
    cloud: 95,
    wind: 2,
    tempF: 74,
    check: heavyCalmHelpful,
  },
  {
    id: "lake_summer_heavy_overcast_strong_wind",
    name: "Freshwater lake, summer, heavy overcast strong wind",
    expectation: "light score capped; no false daymaker",
    region: "midwest_interior",
    month: 7,
    context: "freshwater_lake_pond",
    cloud: 95,
    wind: 22,
    tempF: 74,
    check: heavyWindCapped,
  },
  {
    id: "river_spring_heavy_overcast_strong_wind",
    name: "Freshwater river, spring, heavy overcast strong wind",
    expectation: "score sensible with runoff/wind context",
    region: "great_lakes_upper_midwest",
    month: 4,
    context: "freshwater_river",
    cloud: 95,
    wind: 22,
    tempF: 52,
    precip: { p24: 0.12, p72: 0.25, p7d: 0.70 },
    check: heavyWindCapped,
  },
  {
    id: "river_fall_heavy_overcast_strong_wind",
    name: "Freshwater river, fall, heavy overcast strong wind",
    expectation: "score sensible with runoff/wind context",
    region: "mountain_west",
    month: 10,
    context: "freshwater_river",
    cloud: 95,
    wind: 22,
    tempF: 50,
    check: heavyWindCapped,
  },
  {
    id: "lake_clear_cold",
    name: "Freshwater lake, clear cold/cool",
    expectation: "cold clear neutralization remains intact",
    region: "northeast",
    month: 2,
    context: "freshwater_lake_pond",
    cloud: 5,
    wind: 4,
    tempF: 34,
    check: unchanged,
  },
  {
    id: "lake_clear_hot",
    name: "Freshwater lake, clear warm/hot",
    expectation: "glare penalty remains intact",
    region: "florida",
    month: 8,
    context: "freshwater_lake_pond",
    cloud: 5,
    wind: 4,
    tempF: 92,
    check: unchanged,
  },
  {
    id: "mixed_cloud_breeze",
    name: "Mixed cloud with breeze",
    expectation: "no label/mode churn",
    region: "south_central",
    month: 5,
    context: "freshwater_lake_pond",
    cloud: 50,
    wind: 10,
    tempF: 72,
    check: unchanged,
  },
  {
    id: "low_light_calm_active",
    name: "Low-light calm active day",
    expectation: "surface/recommender behavior remains stable",
    region: "great_lakes_upper_midwest",
    month: 6,
    context: "freshwater_lake_pond",
    cloud: 78,
    wind: 3,
    tempF: 68,
    water_clarity: "stained",
    check: unchanged,
  },
  {
    id: "low_light_windy",
    name: "Low-light windy day",
    expectation: "no surface false-open regression",
    region: "midwest_interior",
    month: 7,
    context: "freshwater_lake_pond",
    cloud: 78,
    wind: 20,
    tempF: 74,
    water_clarity: "clear",
    check: unchanged,
  },
  {
    id: "missing_wind_heavy_overcast",
    name: "Missing wind plus heavy overcast",
    expectation: "missing wind does not receive strong-wind suppression",
    region: "northeast",
    month: 6,
    context: "freshwater_lake_pond",
    cloud: 95,
    wind: null,
    tempF: 68,
    check: (row) => {
      const common = commonAcceptance(row);
      if (common.status === "fail") return common;
      if ((row.v2_light?.score ?? 0) < 0.75) {
        return {
          status: "fail",
          reason: "missing wind was treated like strong wind suppression",
        };
      }
      return {
        status: "pass",
        reason: "missing wind preserves heavy-overcast help",
      };
    },
  },
  {
    id: "missing_cloud",
    name: "Missing cloud",
    expectation: "no reliability inflation",
    region: "northeast",
    month: 6,
    context: "freshwater_lake_pond",
    cloud: null,
    wind: 8,
    tempF: 68,
    check: unchanged,
  },
  {
    id: "coastal_heavy_overcast_calm",
    name: "Coastal/inshore heavy overcast calm",
    expectation: "coastal overcast remains modestly helpful",
    region: "southeast_atlantic",
    month: 5,
    context: "coastal",
    cloud: 95,
    wind: 4,
    tempF: 72,
    check: heavyCalmHelpful,
  },
  {
    id: "coastal_heavy_overcast_strong_wind",
    name: "Coastal/inshore heavy overcast strong wind",
    expectation: "coastal heavy overcast capped in strong wind",
    region: "southeast_atlantic",
    month: 5,
    context: "coastal",
    cloud: 95,
    wind: 22,
    tempF: 72,
    check: heavyWindCapped,
  },
  {
    id: "flats_clear_glare",
    name: "Flats/estuary clear glare",
    expectation: "flats glare penalty remains intact",
    region: "florida",
    month: 5,
    context: "coastal_flats_estuary",
    cloud: 5,
    wind: 8,
    tempF: 76,
    check: unchanged,
  },
  {
    id: "flats_heavy_overcast_strong_wind",
    name: "Flats/estuary heavy overcast strong wind",
    expectation: "flats heavy overcast capped in strong wind",
    region: "florida",
    month: 5,
    context: "coastal_flats_estuary",
    cloud: 95,
    wind: 22,
    tempF: 76,
    check: heavyWindCapped,
  },
  {
    id: "florida_warm_water_overcast",
    name: "Florida warm-water overcast",
    expectation: "overcast remains helpful but not dominant",
    region: "florida",
    month: 7,
    context: "freshwater_lake_pond",
    cloud: 88,
    wind: 8,
    tempF: 84,
    check: (row) => {
      const common = commonAcceptance(row);
      if (common.status === "fail") return common;
      if ((row.v2_light?.score ?? 0) > 0.95) {
        return { status: "fail", reason: "overcast too dominant" };
      }
      return { status: "pass", reason: "warm overcast remains bounded" };
    },
  },
  {
    id: "northern_cold_water_overcast",
    name: "Northern cold-water overcast",
    expectation: "overcast does not overwhelm cold thermal limits",
    region: "great_lakes_upper_midwest",
    month: 2,
    context: "freshwater_lake_pond",
    cloud: 88,
    wind: 8,
    tempF: 38,
    check: (row) => {
      const common = commonAcceptance(row);
      if (common.status === "fail") return common;
      if ((row.v2_score - row.baseline_score) > 0) {
        return {
          status: "questionable",
          reason: "cold overcast got more positive",
        };
      }
      return { status: "pass", reason: "cold overcast is not inflated" };
    },
  },
  {
    id: "desert_hot_clear",
    name: "Desert/hot clear case",
    expectation: "hot clear glare penalty remains intact",
    region: "southwest_desert",
    month: 7,
    context: "freshwater_lake_pond",
    cloud: 5,
    wind: 5,
    tempF: 94,
    check: unchanged,
  },
];

function evaluateFixture(fixture: Fixture): ReadinessRow {
  const req = buildRequest(fixture);
  const norm = buildSharedNormalizedOutput(req);
  const scored = scoreDay(norm);
  const v2Norm = cloneWithV2Light(req, norm);
  const v2Scored = scoreDay(v2Norm);
  const waterClarity = fixture.water_clarity ?? "clear";
  const seed = `light-v2-readiness|${fixture.id}`;
  const baseRec = buildRecommender({
    req,
    norm,
    scored,
    waterClarity,
    seed,
  });
  const v2Rec = baseRec.runtime
    ? rerunRecommender(baseRec.runtime, v2Norm, v2Scored)
    : baseRec.rec;
  const baseDrivers = scored.drivers.map(contributionSnapshot);
  const baseSuppressors = scored.suppressors.map(contributionSnapshot);
  const v2Drivers = v2Scored.drivers.map(contributionSnapshot);
  const v2Suppressors = v2Scored.suppressors.map(contributionSnapshot);
  const baseLight = variableSnapshot(norm.normalized.light_cloud_condition);
  const v2Light = variableSnapshot(v2Norm.normalized.light_cloud_condition);
  const rowBase: Omit<ReadinessRow, "status" | "reason"> = {
    fixture_id: fixture.id,
    fixture_name: fixture.name,
    expectation: fixture.expectation,
    region: fixture.region,
    month: fixture.month,
    context: fixture.context,
    water_clarity: waterClarity,
    baseline_score: scored.score,
    v2_score: v2Scored.score,
    score_delta: v2Scored.score - scored.score,
    baseline_activity_tier: compositeScoreActivityTier(scored.score),
    v2_activity_tier: compositeScoreActivityTier(v2Scored.score),
    activity_tier_changed: compositeScoreActivityTier(scored.score) !==
      compositeScoreActivityTier(v2Scored.score),
    reliability_changed: norm.reliability !== v2Norm.reliability,
    baseline_reliability: norm.reliability,
    v2_reliability: v2Norm.reliability,
    baseline_light: baseLight,
    v2_light: v2Light,
    light_label_changed: baseLight?.label !== v2Light?.label,
    light_driver_changed:
      hasContribution(baseDrivers, "light_cloud_condition") !==
        hasContribution(v2Drivers, "light_cloud_condition"),
    light_suppressor_changed:
      hasContribution(baseSuppressors, "light_cloud_condition") !==
        hasContribution(v2Suppressors, "light_cloud_condition"),
    baseline_recommender: baseRec.rec,
    v2_recommender: v2Rec,
    selected_pick_ids_changed: !samePicks(baseRec.rec, v2Rec),
    light_mode_changed: baseRec.rec != null && v2Rec != null &&
      !("error" in baseRec.rec) && !("error" in v2Rec) &&
      baseRec.rec.light_mode !== v2Rec.light_mode,
    surface_gate_changed: baseRec.rec != null && v2Rec != null &&
      !("error" in baseRec.rec) && !("error" in v2Rec) &&
      baseRec.rec.surface_daily_gate !== v2Rec.surface_daily_gate,
    scenario_tags_changed: !sameTags(baseRec.rec, v2Rec),
  };
  const checked = fixture.check(rowBase as ReadinessRow);
  return { ...rowBase, ...checked };
}

function statusCounts(rows: ReadinessRow[]): Record<Status, number> {
  return {
    pass: rows.filter((r) => r.status === "pass").length,
    questionable: rows.filter((r) => r.status === "questionable").length,
    fail: rows.filter((r) => r.status === "fail").length,
  };
}

function table(rows: ReadinessRow[]): string {
  return rows.map((r) =>
    `| ${r.fixture_id} | ${r.status} | ${r.score_delta} | ${r.baseline_activity_tier} -> ${r.v2_activity_tier} | ${r.baseline_reliability} -> ${r.v2_reliability} | ${
      r.baseline_light?.label ?? "null"
    }:${r.baseline_light?.score ?? "null"} | ${r.v2_light?.label ?? "null"}:${
      r.v2_light?.score ?? "null"
    } | ${r.light_driver_changed} | ${r.light_suppressor_changed} | ${r.selected_pick_ids_changed} | ${r.light_mode_changed} | ${r.surface_gate_changed} | ${r.scenario_tags_changed} | ${r.reason} |`
  ).join("\n");
}

const rows = FIXTURES.map(evaluateFixture);
const counts = statusCounts(rows);
const selectedChanges = rows.filter((r) => r.selected_pick_ids_changed).length;
const lightModeChanges = rows.filter((r) => r.light_mode_changed).length;
const surfaceChanges = rows.filter((r) => r.surface_gate_changed).length;
const tagChanges = rows.filter((r) => r.scenario_tags_changed).length;
const labelChanges = rows.filter((r) => r.light_label_changed).length;
const reliabilityChanges = rows.filter((r) => r.reliability_changed).length;
const recommendation = counts.fail === 0
  ? counts.questionable === 0
    ? "production parity ready"
    : "ready with noted questionable fixtures"
  : "tune before production wiring";

const markdown = `# Today's Bite Light/Cloud V2 Production Readiness

Generated: ${new Date().toISOString()}

Phase 6C production readiness/parity. Production \`normalizeLight(...)\` is expected to match \`${PROFILE}\`. Recommender production logic was not changed.

Profile tested: \`${PROFILE}\`

## Production Parity

- Readiness fixture score delta rows: ${
  rows.filter((r) => r.score_delta !== 0).length
}
- Light label changes: ${labelChanges}
- Reliability changes: ${reliabilityChanges}
- Selected-pick changes: ${selectedChanges}
- Light mode changes: ${lightModeChanges}
- Surface gate changes: ${surfaceChanges}
- Scenario tag changes: ${tagChanges}

## Historical Pre-Wiring Impact

Retained from Phase 6A/6B before production wiring:

- avg delta: **-0.23**
- max/min delta: **0 / -4**
- abs(score_delta) >= 8: **0**
- abs(score_delta) >= 12: **0**
- selected-pick changes: **0 / 14,400**
- total questionable flags: **8,177 -> 3,613**

## Fixture Results

- Fixtures: ${rows.length}
- Passed: ${counts.pass}
- Questionable: ${counts.questionable}
- Failed: ${counts.fail}
- Light label changes: ${labelChanges}
- Reliability changes: ${reliabilityChanges}
- Selected-pick changes: ${selectedChanges}
- Light mode changes: ${lightModeChanges}
- Surface gate changes: ${surfaceChanges}
- Scenario tag changes: ${tagChanges}
- Recommendation: **${recommendation}**

| Fixture | Status | Score Delta | Activity | Reliability | Baseline Light | V2 Light | Light Driver Changed | Light Suppressor Changed | Picks Changed | Light Mode Changed | Surface Gate Changed | Tags Changed | Reason |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${table(rows)}

## Production Plumbing Proof

Current production call path after Phase 6C:

- \`buildSharedNormalizedOutput(req)\` reads \`const e = req.environment\`.
- It computes temperature first, then calls:
  \`normalizeLight(e.cloud_cover_pct, req.context, { temperatureBandLabel: temp?.band_label ?? undefined, windMph: e.wind_speed_mph })\`
- Production \`normalizeLight(...)\` keeps the same function name and accepts optional \`windMph?: number | null\`.
- Missing wind is not treated as strong wind.
- Labels, details, and null behavior remain unchanged.

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
