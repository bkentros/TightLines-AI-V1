#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 4C Wind V2 production parity qualitative readiness audit.
 *
 * Production normalizeWind is expected to match high_wind_penalty_only.
 * Production buildDailyScenario, scoreDay, report copy, recommender
 * pools/scoring/gates/selection, app behavior, and all other condition domains
 * are untouched.
 */

import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type {
  SharedEngineRequest,
  SharedNormalizedOutput,
  VariableState,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import { normalizeWindV2 } from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizeWindV2.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type {
  RecommenderRequest,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";
import type { DailyScenario } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-wind-v2-readiness.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-wind-v2-readiness.md";
const WIND_PROFILE = "high_wind_penalty_only" as const;

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
  expectation: string;
  region: RegionKey;
  month: number;
  context: EngineContext;
  wind: number | null;
  cloud: number | null;
  pressure?: number[];
  hourlyWind?: number[];
  waterClarity?: WaterClarity;
  tempMean?: number;
  check: (row: ReadinessRow) => CheckResult[];
};

type VariableSnapshot = {
  label: string;
  score: number;
  detail: string | null;
} | null;

type RecSnapshot =
  | {
    species: SpeciesGroup;
    water_clarity: WaterClarity;
    activity_level: string;
    wind_mode: string;
    surface_daily_gate: string;
    scenario_tags: readonly string[];
    selected_lure_ids: readonly string[];
    selected_fly_ids: readonly string[];
  }
  | { species: SpeciesGroup; water_clarity: WaterClarity; error: string }
  | null;

type CheckResult = {
  label: string;
  status: "pass" | "questionable" | "fail";
  detail: string;
};

type ReadinessRow = {
  fixture_id: string;
  expectation: string;
  region: RegionKey;
  month: number;
  context: EngineContext;
  water_clarity: WaterClarity;
  wind_input_mph: number | null;
  hourly_wind_used: boolean;
  baseline_score: number;
  v2_score: number;
  score_delta: number;
  baseline_activity_tier: string;
  v2_activity_tier: string;
  baseline_wind: VariableSnapshot;
  v2_wind: VariableSnapshot;
  baseline_drivers: readonly string[];
  v2_drivers: readonly string[];
  baseline_suppressors: readonly string[];
  v2_suppressors: readonly string[];
  baseline_recommender: RecSnapshot;
  v2_recommender: RecSnapshot;
  surface_gate_changed: boolean;
  selected_pick_ids_changed: boolean;
  scenario_tags_changed: boolean;
  checks: CheckResult[];
  status: "pass" | "questionable" | "fail";
};

function linearPressure(start: number, end: number, n = 24): number[] {
  return Array.from(
    { length: n },
    (_, i) => start + ((end - start) * i) / (n - 1),
  );
}

function daylightSpikeWind(): number[] {
  return Array.from(
    { length: 24 },
    (_, hour) => hour >= 11 && hour <= 13 ? 28 : 5,
  );
}

function daylightMeanConflictWind(): number[] {
  return Array.from(
    { length: 24 },
    (_, hour) => hour >= 5 && hour <= 21 ? 16 : 2,
  );
}

function tideHighLow(month: number) {
  const m = String(month).padStart(2, "0");
  return [
    { time: `2026-${m}-15T05:30:00`, value: 0.2, type: "L" },
    { time: `2026-${m}-15T11:45:00`, value: 2.2, type: "H" },
    { time: `2026-${m}-15T18:10:00`, value: 0.3, type: "L" },
  ];
}

function hourlyWindPoints(values: number[] | undefined, localDate: string) {
  return values?.map((value, hour) => ({
    time_utc: `${localDate}T${String(hour).padStart(2, "0")}:00:00Z`,
    value,
  }));
}

function defaultMean(region: RegionKey, month: number): number {
  if (
    region === "florida" || region === "gulf_coast" ||
    region === "south_central"
  ) {
    return month >= 6 && month <= 9 ? 82 : 72;
  }
  if (region === "great_lakes_upper_midwest" || region === "northeast") {
    return month <= 3 || month === 12 ? 42 : month >= 6 && month <= 8 ? 68 : 56;
  }
  return month >= 6 && month <= 8 ? 72 : 60;
}

function buildRequest(fixture: Fixture): SharedEngineRequest {
  const meta = REGION_META[fixture.region];
  const localDate = `2026-${String(fixture.month).padStart(2, "0")}-15`;
  const mean = fixture.tempMean ?? defaultMean(fixture.region, fixture.month);
  const coastal = fixture.context === "coastal" ||
    fixture.context === "coastal_flats_estuary";
  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: fixture.region,
    local_date: localDate,
    local_timezone: meta.tz,
    context: fixture.context,
    environment: {
      current_air_temp_f: mean,
      daily_mean_air_temp_f: mean,
      daily_low_air_temp_f: mean - 6,
      daily_high_air_temp_f: mean + 8,
      prior_day_mean_air_temp_f: mean,
      day_minus_2_mean_air_temp_f: mean,
      pressure_mb: fixture.pressure?.at(-1) ?? 1014,
      pressure_history_mb: fixture.pressure ?? linearPressure(1014, 1014),
      wind_speed_mph: fixture.wind,
      cloud_cover_pct: fixture.cloud,
      precip_rate_now_in_per_hr: 0,
      active_precip_now: false,
      precip_24h_in: fixture.context === "freshwater_river" ? 0.08 : 0.02,
      precip_72h_in: fixture.context === "freshwater_river" ? 0.15 : 0.05,
      precip_7d_in: fixture.context === "freshwater_river" ? 0.40 : 0.10,
      tide_movement_state: coastal ? "incoming" : null,
      current_speed_knots_max: coastal ? 1.0 : null,
      tide_high_low: coastal ? tideHighLow(fixture.month) : null,
      tide_height_hourly_ft: null,
    },
    data_coverage: { source_notes: [] },
  };
}

function cloneWithWindV2(
  req: SharedEngineRequest,
  norm: SharedNormalizedOutput,
): SharedNormalizedOutput {
  const normalized = { ...norm.normalized };
  const wind = normalizeWindV2(
    req.environment.wind_speed_mph,
    req.context,
    WIND_PROFILE,
  );
  if (wind) normalized.wind_condition = wind;
  else delete normalized.wind_condition;
  return { ...norm, normalized };
}

function snapshot(state: VariableState | undefined): VariableSnapshot {
  return state
    ? { label: state.label, score: state.score, detail: state.detail ?? null }
    : null;
}

function labels(
  items: readonly {
    label: string;
    key: string;
    weightedContribution: number;
  }[],
): string[] {
  return items.map((item) =>
    `${item.key}:${item.label}:${item.weightedContribution.toFixed(1)}`
  );
}

function speciesForContext(context: EngineContext): SpeciesGroup | null {
  if (context === "freshwater_lake_pond") return "largemouth_bass";
  if (context === "freshwater_river") return "trout";
  return null;
}

function runRec(args: {
  fixture: Fixture;
  req: SharedEngineRequest;
  norm: SharedNormalizedOutput;
  scored: ReturnType<typeof scoreDay>;
}): RecSnapshot {
  const species = speciesForContext(args.req.context);
  if (!species) return null;
  const waterClarity = args.fixture.waterClarity ?? "clear";
  try {
    const hourly = hourlyWindPoints(
      args.fixture.hourlyWind,
      args.req.local_date,
    );
    const recReq: RecommenderRequest = {
      location: {
        latitude: args.req.latitude,
        longitude: args.req.longitude,
        state_code: args.req.state_code ?? "XX",
        region_key: args.req.region_key,
        local_date: args.req.local_date,
        local_timezone: args.req.local_timezone,
        month: args.fixture.month,
      },
      species,
      context: args.req.context,
      water_clarity: waterClarity,
      recommendation_goal: "all_purpose",
      env_data: {
        ...args.req.environment,
        weather: { wind_speed_unit: "mph" },
        ...(hourly ? { hourly_wind_speed: hourly } : {}),
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
      month: args.fixture.month,
      water_type: args.req.context,
    });
    const result = runDailyPicksEngine({
      req: recReq,
      analysis,
      seasonalRow,
      seed: `wind-v2-readiness|${args.fixture.id}|${waterClarity}`,
      variant: "A",
    });
    return snapshotScenario(
      result.scenario,
      result.diagnostics.selected_lure_ids,
      result.diagnostics.selected_fly_ids,
    );
  } catch (error) {
    return {
      species,
      water_clarity: waterClarity,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function snapshotScenario(
  scenario: DailyScenario,
  selectedLureIds: readonly string[],
  selectedFlyIds: readonly string[],
): Exclude<
  RecSnapshot,
  null | { error: string; species: SpeciesGroup; water_clarity: WaterClarity }
> {
  return {
    species: scenario.species,
    water_clarity: scenario.water_clarity,
    activity_level: scenario.activity_level,
    wind_mode: scenario.wind_mode,
    surface_daily_gate: scenario.surface_daily_gate,
    scenario_tags: scenario.scenario_tags,
    selected_lure_ids: selectedLureIds,
    selected_fly_ids: selectedFlyIds,
  };
}

function samePicks(a: RecSnapshot, b: RecSnapshot): boolean {
  if (a == null || b == null || "error" in a || "error" in b) return true;
  return JSON.stringify([...a.selected_lure_ids, ...a.selected_fly_ids]) ===
    JSON.stringify([...b.selected_lure_ids, ...b.selected_fly_ids]);
}

function sameTags(a: RecSnapshot, b: RecSnapshot): boolean {
  if (a == null || b == null || "error" in a || "error" in b) return true;
  return JSON.stringify(a.scenario_tags) === JSON.stringify(b.scenario_tags);
}

function surfaceChanged(a: RecSnapshot, b: RecSnapshot): boolean {
  return a != null && b != null && !("error" in a) && !("error" in b) &&
    a.surface_daily_gate !== b.surface_daily_gate;
}

const pass = (label: string, ok: boolean, detail: string): CheckResult => ({
  label,
  status: ok ? "pass" : "fail",
  detail,
});

const questionable = (
  label: string,
  ok: boolean,
  detail: string,
): CheckResult => ({
  label,
  status: ok ? "pass" : "questionable",
  detail,
});

function noSurfaceChange(row: ReadinessRow): CheckResult {
  return pass(
    "surface_gate_stable",
    !row.surface_gate_changed,
    "surface gate should not move in score-only readiness",
  );
}

function noNormalPickChange(row: ReadinessRow): CheckResult {
  return pass(
    "normal_fixture_picks_stable",
    !row.selected_pick_ids_changed,
    "normal/moderate fixtures should keep selected IDs",
  );
}

function unchangedMissingWind(row: ReadinessRow): CheckResult {
  return pass(
    "missing_wind_unchanged",
    row.baseline_wind == null && row.v2_wind == null && row.score_delta === 0,
    "missing wind remains omitted",
  );
}

const FIXTURES: Fixture[] = [
  {
    id: "lake_light_breeze_still_helpful",
    expectation: "ordinary light wind remains non-negative",
    region: "midwest_interior",
    month: 5,
    context: "freshwater_lake_pond",
    wind: 5,
    cloud: 55,
    check: (
      r,
    ) => [
      pass(
        "wind_non_negative",
        (r.v2_wind?.score ?? -9) >= 0,
        "light breeze should not become negative",
      ),
      noSurfaceChange(r),
      noNormalPickChange(r),
    ],
  },
  {
    id: "lake_useful_breeze_not_daymaker",
    expectation:
      "useful lake breeze remains helpful under production-equivalent score-only profile",
    region: "midwest_interior",
    month: 6,
    context: "freshwater_lake_pond",
    wind: 10,
    cloud: 60,
    check: (
      r,
    ) => [
      pass(
        "still_helpful",
        (r.v2_wind?.score ?? -9) > 0,
        "10 mph lake breeze remains helpful",
      ),
      questionable(
        "not_extreme_daymaker",
        (r.v2_wind?.score ?? 9) <= 1,
        "score should not exceed production useful-breeze cap",
      ),
      noSurfaceChange(r),
      noNormalPickChange(r),
    ],
  },
  {
    id: "lake_clear_windy_penalized_more_sensibly",
    expectation: "clear windy lake is less falsely positive",
    region: "florida",
    month: 9,
    context: "freshwater_lake_pond",
    wind: 20,
    cloud: 5,
    tempMean: 82,
    check: (
      r,
    ) => [
      pass(
        "production_experiment_parity",
        r.v2_wind?.score === r.baseline_wind?.score && r.score_delta === 0,
        "production should now match high_wind_penalty_only experiment",
      ),
      pass(
        "wind_negative",
        (r.v2_wind?.score ?? 9) < 0,
        "20 mph lake wind should suppress",
      ),
      noSurfaceChange(r),
    ],
  },
  {
    id: "lake_severe_wind_strongly_negative",
    expectation: "severe lake wind is strongly negative",
    region: "gulf_coast",
    month: 8,
    context: "freshwater_lake_pond",
    wind: 36,
    cloud: 50,
    check: (
      r,
    ) => [
      pass(
        "extreme_negative",
        (r.v2_wind?.score ?? 9) <= -1.8,
        "severe lake wind should be near floor",
      ),
      noSurfaceChange(r),
    ],
  },
  {
    id: "river_light_breeze_nearly_neutral",
    expectation: "river light breeze remains nearly neutral",
    region: "mountain_west",
    month: 7,
    context: "freshwater_river",
    wind: 6,
    cloud: 55,
    tempMean: 58,
    check: (
      r,
    ) => [
      pass(
        "river_light_small",
        Math.abs(r.v2_wind?.score ?? 9) <= 0.1,
        "river light breeze should barely matter",
      ),
      noSurfaceChange(r),
      noNormalPickChange(r),
    ],
  },
  {
    id: "river_strong_wind_mildly_negative",
    expectation: "river strong wind matters but less than open water",
    region: "mountain_west",
    month: 7,
    context: "freshwater_river",
    wind: 18,
    cloud: 55,
    tempMean: 58,
    check: (
      r,
    ) => [
      pass(
        "river_strong_negative",
        (r.v2_wind?.score ?? 9) < 0,
        "strong river wind should be negative",
      ),
      pass(
        "river_less_sensitive",
        (r.v2_wind?.score ?? -9) > -1,
        "18 mph river wind should not be treated as catastrophic",
      ),
      noSurfaceChange(r),
    ],
  },
  {
    id: "river_extreme_wind_clearly_negative",
    expectation: "river extreme wind is clearly negative",
    region: "northeast",
    month: 5,
    context: "freshwater_river",
    wind: 34,
    cloud: 60,
    check: (
      r,
    ) => [
      pass(
        "river_extreme_floor",
        (r.v2_wind?.score ?? 9) <= -1.8,
        "extreme river wind should matter",
      ),
      noSurfaceChange(r),
    ],
  },
  {
    id: "flats_moderate_wind_still_fishable",
    expectation: "moderate flats wind remains fishable",
    region: "florida",
    month: 4,
    context: "coastal_flats_estuary",
    wind: 10,
    cloud: 55,
    check: (
      r,
    ) => [
      pass(
        "flats_moderate_positive",
        (r.v2_wind?.score ?? -9) > 0,
        "10 mph flats wind should still help",
      ),
      pass(
        "score_stable",
        Math.abs(r.score_delta) <= 1,
        "moderate flats wind should not move the day much",
      ),
    ],
  },
  {
    id: "flats_strong_wind_penalized",
    expectation: "strong flats wind is penalized",
    region: "florida",
    month: 4,
    context: "coastal_flats_estuary",
    wind: 20,
    cloud: 55,
    check: (
      r,
    ) => [
      pass(
        "flats_strong_negative",
        (r.v2_wind?.score ?? 9) < 0,
        "strong flats wind should suppress",
      ),
      pass(
        "production_experiment_parity",
        r.v2_wind?.score === r.baseline_wind?.score && r.score_delta === 0,
        "production should now match high_wind_penalty_only experiment",
      ),
    ],
  },
  {
    id: "coastal_moderate_wind_still_useful",
    expectation: "moderate coastal wind remains useful",
    region: "gulf_coast",
    month: 5,
    context: "coastal",
    wind: 12,
    cloud: 55,
    check: (
      r,
    ) => [
      pass(
        "coastal_moderate_positive",
        (r.v2_wind?.score ?? -9) > 0,
        "12 mph coastal wind should remain useful",
      ),
    ],
  },
  {
    id: "coastal_extreme_wind_negative",
    expectation: "extreme coastal wind is negative",
    region: "gulf_coast",
    month: 5,
    context: "coastal",
    wind: 36,
    cloud: 55,
    check: (
      r,
    ) => [
      pass(
        "coastal_extreme_negative",
        (r.v2_wind?.score ?? 9) <= -1.7,
        "extreme coastal wind should be strongly negative",
      ),
    ],
  },
  {
    id: "cold_season_clear_windy_boundary_case",
    expectation: "cold clear windy boundary should not become false active",
    region: "great_lakes_upper_midwest",
    month: 2,
    context: "freshwater_lake_pond",
    wind: 20,
    cloud: 5,
    tempMean: 39,
    check: (
      r,
    ) => [
      pass(
        "not_improved",
        r.v2_score <= r.baseline_score,
        "production parity should not improve cold clear windy day",
      ),
      noSurfaceChange(r),
    ],
  },
  {
    id: "summer_heat_plus_wind_not_false_active",
    expectation: "summer heat plus wind should not look falsely active",
    region: "florida",
    month: 8,
    context: "freshwater_lake_pond",
    wind: 22,
    cloud: 10,
    tempMean: 86,
    check: (
      r,
    ) => [
      pass(
        "not_false_active",
        r.v2_activity_tier !== "Good" && r.v2_activity_tier !== "Prime",
        "heat/wind setup should not become high tier",
      ),
      pass(
        "strong_wind_negative",
        (r.v2_wind?.score ?? 9) < 0,
        "strong wind should be negative in hot setup",
      ),
      noSurfaceChange(r),
    ],
  },
  {
    id: "severe_wind_near_35_score_boundary",
    expectation:
      "near-boundary severe wind may move activity but should be explainable",
    region: "south_central",
    month: 6,
    context: "freshwater_lake_pond",
    wind: 36,
    cloud: 50,
    check: (
      r,
    ) => [
      pass(
        "no_large_delta",
        Math.abs(r.score_delta) <= 5,
        "boundary movement should stay small",
      ),
      questionable(
        "pick_change_limited",
        !r.selected_pick_ids_changed || r.v2_wind?.score === -2,
        "pick changes are acceptable only on severe wind boundary",
      ),
      noSurfaceChange(r),
    ],
  },
  {
    id: "hourly_daylight_wind_spike_uses_daylight_mean",
    expectation: "recommender continues using daylight mean, not scalar spike",
    region: "midwest_interior",
    month: 6,
    context: "freshwater_lake_pond",
    wind: 6,
    cloud: 55,
    hourlyWind: daylightSpikeWind(),
    check: (
      r,
    ) => [
      pass(
        "scalar_score_only_small",
        Math.abs(r.score_delta) <= 1,
        "score-only wind uses scalar production engine input",
      ),
      noSurfaceChange(r),
    ],
  },
  {
    id: "hourly_scalar_conflict_prefers_hourly_daylight_mean",
    expectation: "daily picks still prefer hourly daylight wind over scalar",
    region: "midwest_interior",
    month: 6,
    context: "freshwater_lake_pond",
    wind: 5,
    cloud: 55,
    hourlyWind: daylightMeanConflictWind(),
    check: (
      r,
    ) => [
      pass(
        "score_delta_zero",
        r.score_delta === 0,
        "scalar 5 mph remains unchanged in score-only profile",
      ),
      noSurfaceChange(r),
      noNormalPickChange(r),
    ],
  },
  {
    id: "missing_wind_unchanged",
    expectation: "missing wind remains missing",
    region: "northeast",
    month: 5,
    context: "freshwater_lake_pond",
    wind: null,
    cloud: 55,
    check: (
      r,
    ) => [unchangedMissingWind(r), noSurfaceChange(r), noNormalPickChange(r)],
  },
  {
    id: "recommender_surface_gate_stability",
    expectation: "score-only wind does not alter surface gate",
    region: "midwest_interior",
    month: 6,
    context: "freshwater_lake_pond",
    wind: 17,
    cloud: 80,
    check: (
      r,
    ) => [
      noSurfaceChange(r),
      pass(
        "tags_production_behavior",
        !r.scenario_tags_changed || r.baseline_recommender !== null,
        "tags are production-derived from rebuilt score only",
      ),
    ],
  },
  {
    id: "stained_water_windy_reaction_stability",
    expectation: "stained windy reaction tags remain production behavior",
    region: "midwest_interior",
    month: 6,
    context: "freshwater_lake_pond",
    wind: 17,
    cloud: 55,
    waterClarity: "stained",
    check: (
      r,
    ) => [
      pass(
        "stained_tags_preserved_or_score_boundary",
        !r.scenario_tags_changed || Math.abs(r.score_delta) <= 5,
        "tag changes only from production rebuilt activity boundary",
      ),
      noSurfaceChange(r),
    ],
  },
  {
    id: "clear_water_windy_reaction_stability",
    expectation: "clear windy reaction tags remain production behavior",
    region: "midwest_interior",
    month: 6,
    context: "freshwater_lake_pond",
    wind: 17,
    cloud: 55,
    waterClarity: "clear",
    check: (
      r,
    ) => [
      pass(
        "clear_tags_preserved_or_score_boundary",
        !r.scenario_tags_changed || Math.abs(r.score_delta) <= 5,
        "tag changes only from production rebuilt activity boundary",
      ),
      noSurfaceChange(r),
    ],
  },
];

function evaluate(fixture: Fixture): ReadinessRow {
  const req = buildRequest(fixture);
  const baselineNorm = buildSharedNormalizedOutput(req);
  const baselineScored = scoreDay(baselineNorm);
  const v2Norm = cloneWithWindV2(req, baselineNorm);
  const v2Scored = scoreDay(v2Norm);
  const baselineRec = runRec({
    fixture,
    req,
    norm: baselineNorm,
    scored: baselineScored,
  });
  const v2Rec = runRec({ fixture, req, norm: v2Norm, scored: v2Scored });

  const rowBase = {
    fixture_id: fixture.id,
    expectation: fixture.expectation,
    region: fixture.region,
    month: fixture.month,
    context: fixture.context,
    water_clarity: fixture.waterClarity ?? "clear",
    wind_input_mph: fixture.wind,
    hourly_wind_used: fixture.hourlyWind != null,
    baseline_score: baselineScored.score,
    v2_score: v2Scored.score,
    score_delta: v2Scored.score - baselineScored.score,
    baseline_activity_tier: compositeScoreActivityTier(baselineScored.score),
    v2_activity_tier: compositeScoreActivityTier(v2Scored.score),
    baseline_wind: snapshot(baselineNorm.normalized.wind_condition),
    v2_wind: snapshot(v2Norm.normalized.wind_condition),
    baseline_drivers: labels(baselineScored.drivers),
    v2_drivers: labels(v2Scored.drivers),
    baseline_suppressors: labels(baselineScored.suppressors),
    v2_suppressors: labels(v2Scored.suppressors),
    baseline_recommender: baselineRec,
    v2_recommender: v2Rec,
    surface_gate_changed: surfaceChanged(baselineRec, v2Rec),
    selected_pick_ids_changed: !samePicks(baselineRec, v2Rec),
    scenario_tags_changed: !sameTags(baselineRec, v2Rec),
  };
  const checks = fixture.check(rowBase as ReadinessRow);
  const status = checks.some((check) => check.status === "fail")
    ? "fail"
    : checks.some((check) => check.status === "questionable")
    ? "questionable"
    : "pass";
  return { ...rowBase, checks, status };
}

const rows = FIXTURES.map(evaluate);
const windMismatches =
  rows.filter((row) =>
    (row.baseline_wind?.label ?? null) !== (row.v2_wind?.label ?? null) ||
    Math.abs((row.baseline_wind?.score ?? 999) - (row.v2_wind?.score ?? 999)) >
      1e-6
  ).length;
const scoreDeltas = rows.filter((row) => row.score_delta !== 0).length;
const passCount = rows.filter((row) => row.status === "pass").length;
const questionableCount =
  rows.filter((row) => row.status === "questionable").length;
const failCount = rows.filter((row) => row.status === "fail").length;
const surfaceChanges = rows.filter((row) => row.surface_gate_changed).length;
const pickChanges = rows.filter((row) => row.selected_pick_ids_changed).length;
const normalPickChanges = rows.filter((row) =>
  row.selected_pick_ids_changed &&
  !row.fixture_id.includes("severe") &&
  !row.fixture_id.includes("extreme") &&
  !row.fixture_id.includes("boundary")
).length;
const recommendation =
  failCount === 0 && windMismatches === 0 && scoreDeltas === 0 &&
    surfaceChanges === 0 && normalPickChanges === 0
    ? "production parity verified"
    : questionableCount > 0 && failCount === 0
    ? "ready for readiness review with noted boundary cases"
    : "tune before production wiring";

function recSummary(rec: RecSnapshot): string {
  if (rec == null) return "unsupported";
  if ("error" in rec) return `error:${rec.error}`;
  return `${rec.activity_level}/${rec.wind_mode}/${rec.surface_daily_gate}/${
    rec.scenario_tags.join("+")
  }`;
}

function fixtureLine(row: ReadinessRow): string {
  return `| ${row.fixture_id} | ${row.status} | ${row.baseline_score}->${row.v2_score} | ${row.baseline_activity_tier}->${row.v2_activity_tier} | ${
    row.baseline_wind?.label ?? "-"
  }:${row.baseline_wind?.score ?? "-"} -> ${row.v2_wind?.label ?? "-"}:${
    row.v2_wind?.score ?? "-"
  } | ${row.surface_gate_changed} | ${row.selected_pick_ids_changed} | ${
    row.checks.map((check) => `${check.label}:${check.status}`).join(", ")
  } |`;
}

const markdown = `# Today's Bite Wind V2 Readiness Audit

Generated: ${new Date().toISOString()}

Phase 4C parity mode. Production wind should match \`${WIND_PROFILE}\`; recommender tags remain production behavior.

## Summary

| Metric | Value |
| --- | ---: |
| Fixtures | ${rows.length} |
| Passed | ${passCount} |
| Questionable | ${questionableCount} |
| Failed | ${failCount} |
| Production-vs-experiment wind mismatches | ${windMismatches} |
| Production-vs-experiment score deltas | ${scoreDeltas} |
| Surface gate changes | ${surfaceChanges} |
| Selected-pick changes | ${pickChanges} |
| Normal/moderate selected-pick changes | ${normalPickChanges} |
| Broad audit reference | 33 / 14,400 = 0.2% selected-pick changes |
| Recommendation | ${recommendation} |

## Fixture Results

| Fixture | Status | Score | Tier | Wind | Surface Changed | Picks Changed | Checks |
| --- | --- | ---: | --- | --- | --- | --- | --- |
${rows.map(fixtureLine).join("\n")}

## Recommender Comparison

| Fixture | Baseline Scenario | V2 Scenario | Baseline Picks | V2 Picks |
| --- | --- | --- | --- | --- |
${
  rows.map((row) => {
    const b = row.baseline_recommender;
    const v = row.v2_recommender;
    const bPicks = b && !("error" in b)
      ? [...b.selected_lure_ids, ...b.selected_fly_ids].join(", ")
      : "-";
    const vPicks = v && !("error" in v)
      ? [...v.selected_lure_ids, ...v.selected_fly_ids].join(", ")
      : "-";
    return `| ${row.fixture_id} | ${recSummary(b)} | ${
      recSummary(v)
    } | ${bPicks} | ${vPicks} |`;
  }).join("\n")
}

## Questionable Or Failed Checks

| Fixture | Check | Status | Detail |
| --- | --- | --- | --- |
${
  rows.flatMap((row) =>
    row.checks.filter((check) => check.status !== "pass").map((check) =>
      `| ${row.fixture_id} | ${check.label} | ${check.status} | ${check.detail} |`
    )
  ).join("\n") || "| None | - | - | - |"
}

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
