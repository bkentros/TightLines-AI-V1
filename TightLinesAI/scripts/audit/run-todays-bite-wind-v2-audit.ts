#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 4C Wind V2 production parity + recommender coupling audit.
 *
 * Production normalizeWind is expected to match high_wind_penalty_only.
 * Production buildDailyScenario, scoreDay, report copy, recommender
 * pools/scoring/gates/selection, app behavior, and all other condition domains
 * are untouched.
 */

import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import {
  CANONICAL_REGION_KEYS,
  type RegionKey,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type {
  SharedEngineRequest,
  SharedNormalizedOutput,
  VariableState,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import {
  normalizeWindV2,
  type WindV2Profile,
} from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizeWindV2.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type {
  RecommenderRequest,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import type {
  ConditionTag,
  SeasonalRowV4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";
import { buildCandidatePool } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/buildCandidatePool.ts";
import { scoreCandidate } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts";
import { selectDailyPicks } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts";
import type {
  DailyScenario,
  DailyWindMode,
} from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-wind-v2-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-wind-v2-audit.md";

const CONTEXTS: readonly EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];
const WATER_CLARITIES: readonly WaterClarity[] = ["clear", "stained"];
const SCORE_PROFILES: readonly WindV2Profile[] = [
  "high_wind_penalty_only",
  "mild_positive_compression",
  "mild_combined",
  "previous_combined_v2",
];
const TAG_POLICIES = [
  "preserve_production_tags",
  "remove_light_breeze_only",
  "no_open_water_below_10",
  "no_open_water_below_11",
  "severe_wind_keeps_reaction_no_open_water",
  "conservative_cleanup",
] as const;

type CandidateMode =
  | "production_control"
  | "score_only"
  | "tag_only"
  | "combined";
type TagPolicy = typeof TAG_POLICIES[number];

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
  | "stable_pressure_mixed_light_light_wind"
  | "slow_falling_pressure_overcast_breezy"
  | "fast_falling_pressure_clear_breezy"
  | "volatile_pressure_mixed_wind"
  | "rising_pressure_post_front_clear_calm"
  | "insufficient_pressure_history"
  | "clear_calm"
  | "clear_breezy"
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
  | "hourly_daylight_wind_spike"
  | "hourly_daylight_wind_mean_vs_scalar_conflict";

type Archetype = {
  id: ArchetypeId;
  pressure: number[] | null;
  cloud: number | null;
  wind: number | null;
  hourlyWind?: number[];
};

type CandidateConfig = {
  id: string;
  mode: CandidateMode;
  windProfile: WindV2Profile;
  tagPolicy: TagPolicy;
};

function linearPressure(start: number, end: number, n = 24): number[] {
  return Array.from(
    { length: n },
    (_, i) => start + ((end - start) * i) / (n - 1),
  );
}

function volatilePressure(): number[] {
  return [
    1012,
    1017,
    1009,
    1018,
    1010,
    1016,
    1008,
    1015,
    1007,
    1014,
    1006,
    1013,
    1005,
    1012,
    1008,
    1015,
    1009,
    1016,
    1010,
    1017,
    1009,
    1016,
    1008,
    1015,
  ];
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

const ARCHETYPES: readonly Archetype[] = [
  {
    id: "stable_pressure_mixed_light_light_wind",
    pressure: linearPressure(1014, 1014.2),
    cloud: 50,
    wind: 5,
  },
  {
    id: "slow_falling_pressure_overcast_breezy",
    pressure: linearPressure(1016, 1013.5),
    cloud: 82,
    wind: 10,
  },
  {
    id: "fast_falling_pressure_clear_breezy",
    pressure: linearPressure(1020, 1012.5),
    cloud: 5,
    wind: 10,
  },
  {
    id: "volatile_pressure_mixed_wind",
    pressure: volatilePressure(),
    cloud: 50,
    wind: 17,
  },
  {
    id: "rising_pressure_post_front_clear_calm",
    pressure: linearPressure(1009, 1014),
    cloud: 5,
    wind: 3,
  },
  {
    id: "insufficient_pressure_history",
    pressure: [1014, 1013],
    cloud: 50,
    wind: 8,
  },
  { id: "clear_calm", pressure: linearPressure(1014, 1014), cloud: 5, wind: 2 },
  {
    id: "clear_breezy",
    pressure: linearPressure(1014, 1014),
    cloud: 5,
    wind: 10,
  },
  {
    id: "clear_windy",
    pressure: linearPressure(1014, 1014),
    cloud: 5,
    wind: 20,
  },
  {
    id: "mixed_light_breezy",
    pressure: linearPressure(1014, 1014),
    cloud: 50,
    wind: 10,
  },
  {
    id: "overcast_calm",
    pressure: linearPressure(1014, 1014),
    cloud: 80,
    wind: 2,
  },
  {
    id: "overcast_breezy",
    pressure: linearPressure(1014, 1014),
    cloud: 80,
    wind: 10,
  },
  {
    id: "heavy_overcast_windy",
    pressure: linearPressure(1014, 1014),
    cloud: 95,
    wind: 22,
  },
  {
    id: "low_light_calm",
    pressure: linearPressure(1014, 1014),
    cloud: 74,
    wind: 2,
  },
  {
    id: "low_light_windy",
    pressure: linearPressure(1014, 1014),
    cloud: 74,
    wind: 22,
  },
  {
    id: "severe_wind",
    pressure: linearPressure(1014, 1014),
    cloud: 50,
    wind: 36,
  },
  {
    id: "missing_cloud",
    pressure: linearPressure(1014, 1014),
    cloud: null,
    wind: 8,
  },
  {
    id: "missing_wind",
    pressure: linearPressure(1014, 1014),
    cloud: 50,
    wind: null,
  },
  {
    id: "hourly_daylight_wind_spike",
    pressure: linearPressure(1014, 1014),
    cloud: 50,
    wind: 6,
    hourlyWind: daylightSpikeWind(),
  },
  {
    id: "hourly_daylight_wind_mean_vs_scalar_conflict",
    pressure: linearPressure(1014, 1014),
    cloud: 50,
    wind: 5,
    hourlyWind: daylightMeanConflictWind(),
  },
];

type VariableSnapshot =
  | { label: string; score: number; detail: string | null }
  | null;
type RecOk = {
  species: SpeciesGroup;
  water_clarity: WaterClarity;
  activity_level: string;
  wind_mode: DailyWindMode;
  light_mode: string;
  pressure_mode: string;
  surface_daily_gate: string;
  daylight_wind_mph: number | null;
  scenario_tags: readonly string[];
  selected_lure_ids: readonly string[];
  selected_fly_ids: readonly string[];
};
type RecSnapshot = RecOk | {
  species: SpeciesGroup;
  water_clarity: WaterClarity;
  error: string;
} | null;

type BaselineRow = {
  key: string;
  region: RegionKey;
  month: number;
  context: EngineContext;
  archetype: ArchetypeId;
  water_clarity: WaterClarity;
  req: SharedEngineRequest;
  archetypeDef: Archetype;
  norm: SharedNormalizedOutput;
  scored: ReturnType<typeof scoreDay>;
  wind: VariableSnapshot;
  activity_tier: string;
  recommender: RecSnapshot;
  recommenderRuntime?: {
    recReq: RecommenderRequest;
    analysis: SharedConditionAnalysis;
    seasonalRow: SeasonalRowV4;
    seed: string;
    scenario: DailyScenario;
    selected_lure_ids: readonly string[];
    selected_fly_ids: readonly string[];
  };
};

type AuditRow = {
  candidate_id: string;
  candidate_mode: CandidateMode;
  wind_profile: WindV2Profile;
  tag_policy: TagPolicy;
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
  activity_tier_changed: boolean;
  baseline_wind: VariableSnapshot;
  v2_wind: VariableSnapshot;
  wind_changed: boolean;
  baseline_recommender: RecSnapshot;
  v2_recommender: RecSnapshot;
  wind_mode_changed: boolean;
  surface_gate_changed: boolean;
  scenario_tags_changed: boolean;
  selected_pick_ids_changed: boolean;
  pick_change_causes: string[];
  tag_change_causes: string[];
  light_breeze_triggers_wind_reaction: boolean;
  improves_behavior: boolean;
  risky_behavior: boolean;
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

function buildRequest(
  region: RegionKey,
  month: number,
  context: EngineContext,
  archetype: Archetype,
): SharedEngineRequest {
  const meta = REGION_META[region];
  const localDate = `2026-${String(month).padStart(2, "0")}-15`;
  const coastal = context === "coastal" || context === "coastal_flats_estuary";
  const mean = seasonallyReasonableMean(region, month);
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
      pressure_mb: archetype.pressure?.at(-1) ?? null,
      pressure_history_mb: archetype.pressure,
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
  if (context === "freshwater_river") return "trout";
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

function snapshotFromScenario(
  scenario: DailyScenario,
  ids: {
    selected_lure_ids: readonly string[];
    selected_fly_ids: readonly string[];
  },
): RecOk {
  return {
    species: scenario.species,
    water_clarity: scenario.water_clarity,
    activity_level: scenario.activity_level,
    wind_mode: scenario.wind_mode,
    light_mode: scenario.light_mode,
    pressure_mode: scenario.pressure_mode,
    surface_daily_gate: scenario.surface_daily_gate,
    daylight_wind_mph: scenario.daylight_wind_mph,
    scenario_tags: scenario.scenario_tags,
    selected_lure_ids: ids.selected_lure_ids,
    selected_fly_ids: ids.selected_fly_ids,
  };
}

function buildRecRuntime(args: {
  req: SharedEngineRequest;
  norm: SharedNormalizedOutput;
  scored: ReturnType<typeof scoreDay>;
  archetype: Archetype;
  waterClarity: WaterClarity;
}): BaselineRow["recommenderRuntime"] | { error: RecSnapshot } | undefined {
  const species = speciesForContext(args.req.context);
  if (!species) return undefined;
  try {
    const month = Number.parseInt(args.req.local_date.slice(5, 7), 10);
    const hourly = hourlyWindPoints(
      args.archetype.hourlyWind,
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
        month,
      },
      species,
      context: args.req.context,
      water_clarity: args.waterClarity,
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
      month,
      water_type: args.req.context,
    });
    const seed =
      `wind-v2|${args.req.region_key}|${args.req.local_date}|${args.req.context}|${args.archetype.id}|${args.waterClarity}`;
    const result = runDailyPicksEngine({
      req: recReq,
      analysis,
      seasonalRow,
      seed,
      variant: "A",
    });
    return {
      recReq,
      analysis,
      seasonalRow,
      seed,
      scenario: result.scenario,
      selected_lure_ids: result.diagnostics.selected_lure_ids,
      selected_fly_ids: result.diagnostics.selected_fly_ids,
    };
  } catch (error) {
    return {
      error: {
        species,
        water_clarity: args.waterClarity,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

function baselineRecFromRuntime(
  runtime: NonNullable<BaselineRow["recommenderRuntime"]>,
): RecSnapshot {
  return snapshotFromScenario(runtime.scenario, {
    selected_lure_ids: runtime.selected_lure_ids,
    selected_fly_ids: runtime.selected_fly_ids,
  });
}

function buildBaselineRows(): BaselineRow[] {
  const rows: BaselineRow[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of CONTEXTS) {
        for (const archetype of ARCHETYPES) {
          const req = buildRequest(region, month, context, archetype);
          const norm = buildSharedNormalizedOutput(req);
          const scored = scoreDay(norm);
          for (const waterClarity of WATER_CLARITIES) {
            const runtime = buildRecRuntime({
              req,
              norm,
              scored,
              archetype,
              waterClarity,
            });
            const rec = runtime == null
              ? null
              : "error" in runtime
              ? runtime.error
              : baselineRecFromRuntime(runtime);
            rows.push({
              key:
                `${region}|${month}|${context}|${archetype.id}|${waterClarity}`,
              region,
              month,
              context,
              archetype: archetype.id,
              water_clarity: waterClarity,
              req,
              archetypeDef: archetype,
              norm,
              scored,
              wind: variableSnapshot(norm.normalized.wind_condition),
              activity_tier: compositeScoreActivityTier(scored.score),
              recommender: rec,
              recommenderRuntime: runtime && !("error" in runtime)
                ? runtime
                : undefined,
            });
          }
        }
      }
    }
  }
  return rows;
}

function candidates(): CandidateConfig[] {
  const configs: CandidateConfig[] = [{
    id: "production_control",
    mode: "production_control",
    windProfile: "production_control",
    tagPolicy: "preserve_production_tags",
  }];
  for (const windProfile of SCORE_PROFILES) {
    configs.push({
      id: `score_only|${windProfile}`,
      mode: "score_only",
      windProfile,
      tagPolicy: "preserve_production_tags",
    });
  }
  for (const tagPolicy of TAG_POLICIES) {
    if (tagPolicy === "preserve_production_tags") continue;
    configs.push({
      id: `tag_only|${tagPolicy}`,
      mode: "tag_only",
      windProfile: "production_control",
      tagPolicy,
    });
  }
  for (const windProfile of SCORE_PROFILES) {
    for (const tagPolicy of TAG_POLICIES) {
      if (tagPolicy === "preserve_production_tags") continue;
      configs.push({
        id: `combined|${windProfile}|${tagPolicy}`,
        mode: "combined",
        windProfile,
        tagPolicy,
      });
    }
  }
  return configs;
}

function cloneWithWindProfile(
  row: BaselineRow,
  profile: WindV2Profile,
): SharedNormalizedOutput {
  if (profile === "production_control") return row.norm;
  const normalized = { ...row.norm.normalized };
  const wind = normalizeWindV2(
    row.req.environment.wind_speed_mph,
    row.context,
    profile,
  );
  if (wind) normalized.wind_condition = wind;
  else delete normalized.wind_condition;
  return { ...row.norm, normalized };
}

function rerunDailyPicks(
  runtime: NonNullable<BaselineRow["recommenderRuntime"]>,
  norm: SharedNormalizedOutput,
  scored: ReturnType<typeof scoreDay>,
): { scenario: DailyScenario; rec: RecOk } {
  const analysis = {
    ...runtime.analysis,
    norm,
    scored,
  } as SharedConditionAnalysis;
  const result = runDailyPicksEngine({
    req: runtime.recReq,
    analysis,
    seasonalRow: runtime.seasonalRow,
    seed: runtime.seed,
    variant: "A",
  });
  return {
    scenario: result.scenario,
    rec: snapshotFromScenario(result.scenario, {
      selected_lure_ids: result.diagnostics.selected_lure_ids,
      selected_fly_ids: result.diagnostics.selected_fly_ids,
    }),
  };
}

function selectWithScenario(
  runtime: NonNullable<BaselineRow["recommenderRuntime"]>,
  scenario: DailyScenario,
): RecOk {
  const candidatePool = buildCandidatePool({
    row: runtime.seasonalRow,
    scenario,
  });
  const lureScores = candidatePool.lures.map((candidate) =>
    scoreCandidate({
      profile: candidate.profile,
      side: "lure",
      row: runtime.seasonalRow,
      scenario,
    })
  );
  const flyScores = candidatePool.flies.map((candidate) =>
    scoreCandidate({
      profile: candidate.profile,
      side: "fly",
      row: runtime.seasonalRow,
      scenario,
    })
  );
  const selection = selectDailyPicks({
    lureScores,
    flyScores,
    scenario,
    seed: runtime.seed,
    variant: "A",
  });
  return snapshotFromScenario(scenario, {
    selected_lure_ids: [
      selection.lure_of_the_day.profile.id,
      selection.honorable_lure.profile.id,
    ],
    selected_fly_ids: [
      selection.fly_of_the_day.profile.id,
      selection.honorable_fly.profile.id,
    ],
  });
}

type ScoreProjection = {
  norm: SharedNormalizedOutput;
  scored: ReturnType<typeof scoreDay>;
  activityTier: string;
  wind: VariableSnapshot;
  rec: RecSnapshot;
  scenario: DailyScenario | null;
};

const scoreProjectionCache = new Map<string, ScoreProjection>();
const tagSelectionCache = new Map<string, RecSnapshot>();

function scoreProjection(
  base: BaselineRow,
  profile: WindV2Profile,
): ScoreProjection {
  if (profile === "production_control") {
    return {
      norm: base.norm,
      scored: base.scored,
      activityTier: base.activity_tier,
      wind: base.wind,
      rec: base.recommender,
      scenario: base.recommenderRuntime?.scenario ?? null,
    };
  }
  const key = `${base.key}|${profile}`;
  const cached = scoreProjectionCache.get(key);
  if (cached) return cached;

  const norm = cloneWithWindProfile(base, profile);
  const scored = scoreDay(norm);
  let rec: RecSnapshot = base.recommender;
  let scenario: DailyScenario | null = base.recommenderRuntime?.scenario ??
    null;
  if (base.recommenderRuntime != null) {
    const rerun = rerunDailyPicks(base.recommenderRuntime, norm, scored);
    rec = rerun.rec;
    scenario = rerun.scenario;
  }
  const projection = {
    norm,
    scored,
    activityTier: compositeScoreActivityTier(scored.score),
    wind: variableSnapshot(norm.normalized.wind_condition),
    rec,
    scenario,
  };
  scoreProjectionCache.set(key, projection);
  return projection;
}

function selectWithTagPolicy(
  base: BaselineRow,
  profile: WindV2Profile,
  policy: TagPolicy,
  scenario: DailyScenario,
): RecSnapshot {
  if (base.recommenderRuntime == null) return base.recommender;
  if (policy === "preserve_production_tags") {
    const projection = scoreProjection(base, profile);
    return projection.rec;
  }
  const projected = applyTagPolicy(scenario, policy);
  if (JSON.stringify(projected) === JSON.stringify(scenario.scenario_tags)) {
    const projection = scoreProjection(base, profile);
    return projection.rec;
  }
  const key = `${base.key}|${profile}|${policy}|${projected.join(",")}`;
  const cached = tagSelectionCache.get(key);
  if (cached) return cached;
  const rec = selectWithScenario(base.recommenderRuntime, {
    ...scenario,
    scenario_tags: projected,
  });
  tagSelectionCache.set(key, rec);
  return rec;
}

function tagSet(tags: readonly string[]): Set<string> {
  return new Set(tags);
}

function diffTags(
  before: readonly string[],
  after: readonly string[],
): string[] {
  const b = tagSet(before);
  const a = tagSet(after);
  const changes: string[] = [];
  for (const tag of b) if (!a.has(tag)) changes.push(`${tag}_removed`);
  for (const tag of a) if (!b.has(tag)) changes.push(`${tag}_added`);
  return changes.sort();
}

function applyTagPolicy(
  scenario: DailyScenario,
  policy: TagPolicy,
): ConditionTag[] {
  if (policy === "preserve_production_tags") {
    return [...scenario.scenario_tags] as ConditionTag[];
  }
  const tags = new Set<string>(scenario.scenario_tags);
  const daylight = scenario.daylight_wind_mph;
  const wind = scenario.wind_mode;
  const labelIsLight = daylight != null && daylight < 6;
  const belowProductionReaction = daylight != null && daylight < 7.5;

  const removeWindBundle = () => {
    tags.delete("wind_reaction");
    tags.delete("open_water_search");
    tags.delete("dirty_vibration");
  };

  switch (policy) {
    case "remove_light_breeze_only":
      if (labelIsLight || belowProductionReaction) removeWindBundle();
      break;
    case "no_open_water_below_10":
      if (daylight == null || daylight < 10) tags.delete("open_water_search");
      break;
    case "no_open_water_below_11":
      if (daylight == null || daylight < 11) tags.delete("open_water_search");
      break;
    case "severe_wind_keeps_reaction_no_open_water":
      if (wind === "windy" || (daylight != null && daylight >= 24)) {
        tags.delete("open_water_search");
      }
      break;
    case "conservative_cleanup":
      if (labelIsLight || belowProductionReaction) removeWindBundle();
      if (
        daylight == null || daylight < 10 || wind === "windy" || daylight >= 24
      ) {
        tags.delete("open_water_search");
      }
      break;
    case "preserve_production_tags":
      break;
  }

  return [...tags] as ConditionTag[];
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

function recTagCount(rows: AuditRow[], tag: string, side: "baseline" | "v2") {
  return rows.filter((row) => {
    const rec = side === "baseline"
      ? row.baseline_recommender
      : row.v2_recommender;
    return rec != null && !("error" in rec) &&
      rec.scenario_tags.includes(tag as ConditionTag);
  }).length;
}

function evaluateCandidate(
  baselineRows: BaselineRow[],
  config: CandidateConfig,
): AuditRow[] {
  return baselineRows.map((base) => {
    const scoreUsesV2 = config.mode === "score_only" ||
      config.mode === "combined";
    const tagsUsePolicy = config.mode === "tag_only" ||
      config.mode === "combined";
    const profile = scoreUsesV2 ? config.windProfile : "production_control";
    const projection = scoreProjection(base, profile);
    const v2Scored = projection.scored;
    const v2ActivityTier = projection.activityTier;
    const v2Wind = projection.wind;
    let v2Rec = projection.rec;
    const scenarioForTags = projection.scenario;

    if (base.recommenderRuntime != null) {
      if (tagsUsePolicy && scenarioForTags != null) {
        v2Rec = selectWithTagPolicy(
          base,
          profile,
          config.tagPolicy,
          scenarioForTags,
        );
      }
    }

    const scoreDelta = v2Scored.score - base.scored.score;
    const selectedChanged = !samePicks(base.recommender, v2Rec);
    const causes: string[] = [];
    let tagCauses: string[] = [];
    if (
      base.recommender != null && v2Rec != null &&
      !("error" in base.recommender) && !("error" in v2Rec)
    ) {
      if (base.recommender.activity_level !== v2Rec.activity_level) {
        causes.push("activity_hows_score");
      }
      if (base.recommender.wind_mode !== v2Rec.wind_mode) {
        causes.push("wind_mode");
      }
      if (base.recommender.surface_daily_gate !== v2Rec.surface_daily_gate) {
        causes.push("surface_gate");
      }
      tagCauses = diffTags(base.recommender.scenario_tags, v2Rec.scenario_tags);
      for (const tagCause of tagCauses) causes.push(tagCause);
    }
    const lightBreezeTriggers = v2Rec != null && !("error" in v2Rec) &&
      v2Rec.wind_mode === "breezy" &&
      (v2Rec.daylight_wind_mph ?? 999) < 7.5 &&
      v2Rec.scenario_tags.includes("wind_reaction");
    const baselineHasWindReaction = base.recommender != null &&
      !("error" in base.recommender) &&
      base.recommender.scenario_tags.includes("wind_reaction");
    const v2HasWindReaction = v2Rec != null && !("error" in v2Rec) &&
      v2Rec.scenario_tags.includes("wind_reaction");
    const baselineHasOpenWater = base.recommender != null &&
      !("error" in base.recommender) &&
      base.recommender.scenario_tags.includes("open_water_search");
    const v2HasOpenWater = v2Rec != null && !("error" in v2Rec) &&
      v2Rec.scenario_tags.includes("open_water_search");

    return {
      candidate_id: config.id,
      candidate_mode: config.mode,
      wind_profile: config.windProfile,
      tag_policy: config.tagPolicy,
      region: base.region,
      month: base.month,
      context: base.context,
      archetype: base.archetype,
      water_clarity: base.water_clarity,
      baseline_score: base.scored.score,
      v2_score: v2Scored.score,
      score_delta: scoreDelta,
      baseline_activity_tier: base.activity_tier,
      v2_activity_tier: v2ActivityTier,
      activity_tier_changed: base.activity_tier !== v2ActivityTier,
      baseline_wind: base.wind,
      v2_wind: v2Wind,
      wind_changed: (base.wind?.label ?? null) !== (v2Wind?.label ?? null) ||
        Math.abs((base.wind?.score ?? 999) - (v2Wind?.score ?? 999)) > 1e-6,
      baseline_recommender: base.recommender,
      v2_recommender: v2Rec,
      wind_mode_changed: base.recommender != null && v2Rec != null &&
        !("error" in base.recommender) && !("error" in v2Rec) &&
        base.recommender.wind_mode !== v2Rec.wind_mode,
      surface_gate_changed: base.recommender != null && v2Rec != null &&
        !("error" in base.recommender) && !("error" in v2Rec) &&
        base.recommender.surface_daily_gate !== v2Rec.surface_daily_gate,
      scenario_tags_changed: !sameTags(base.recommender, v2Rec),
      selected_pick_ids_changed: selectedChanged,
      pick_change_causes: selectedChanged
        ? (causes.length ? causes : ["selection_order"])
        : [],
      tag_change_causes: tagCauses,
      light_breeze_triggers_wind_reaction: lightBreezeTriggers,
      improves_behavior: (baselineHasWindReaction && !v2HasWindReaction) ||
        (baselineHasOpenWater && !v2HasOpenWater) ||
        ((base.wind?.score ?? 0) > 0.8 && (v2Wind?.score ?? 0) <= 0.8),
      risky_behavior: Math.abs(scoreDelta) >= 8 || selectedChanged ||
        (baselineHasWindReaction && !v2HasWindReaction &&
          base.archetype.includes("windy")),
    };
  });
}

type Summary = {
  config: CandidateConfig;
  rows: number;
  avgDelta: number;
  maxDelta: number;
  minDelta: number;
  absGte8: number;
  absGte12: number;
  activityChanges: number;
  windChanges: number;
  validRec: number;
  recErrors: number;
  windModeChanges: number;
  surfaceGateChanges: number;
  tagChanges: number;
  baselineWindReaction: number;
  v2WindReaction: number;
  windReactionReduction: number;
  baselineOpenWater: number;
  v2OpenWater: number;
  openWaterReduction: number;
  lightBreezeTriggers: number;
  pickChanges: number;
  pickChangePct: number;
};

function summarize(rows: AuditRow[], config: CandidateConfig): Summary {
  const validRec =
    rows.filter((r) =>
      r.baseline_recommender != null && !("error" in r.baseline_recommender)
    ).length;
  const recErrors =
    rows.filter((r) =>
      r.baseline_recommender != null && "error" in r.baseline_recommender
    ).length;
  const baselineWindReaction = recTagCount(rows, "wind_reaction", "baseline");
  const v2WindReaction = recTagCount(rows, "wind_reaction", "v2");
  const baselineOpenWater = recTagCount(rows, "open_water_search", "baseline");
  const v2OpenWater = recTagCount(rows, "open_water_search", "v2");
  const pickChanges = rows.filter((r) => r.selected_pick_ids_changed).length;
  return {
    config,
    rows: rows.length,
    avgDelta: rows.reduce((sum, row) => sum + row.score_delta, 0) / rows.length,
    maxDelta: Math.max(...rows.map((r) => r.score_delta)),
    minDelta: Math.min(...rows.map((r) => r.score_delta)),
    absGte8: rows.filter((r) => Math.abs(r.score_delta) >= 8).length,
    absGte12: rows.filter((r) => Math.abs(r.score_delta) >= 12).length,
    activityChanges: rows.filter((r) => r.activity_tier_changed).length,
    windChanges: rows.filter((r) => r.wind_changed).length,
    validRec,
    recErrors,
    windModeChanges: rows.filter((r) => r.wind_mode_changed).length,
    surfaceGateChanges: rows.filter((r) => r.surface_gate_changed).length,
    tagChanges: rows.filter((r) => r.scenario_tags_changed).length,
    baselineWindReaction,
    v2WindReaction,
    windReactionReduction: baselineWindReaction - v2WindReaction,
    baselineOpenWater,
    v2OpenWater,
    openWaterReduction: baselineOpenWater - v2OpenWater,
    lightBreezeTriggers:
      rows.filter((r) => r.light_breeze_triggers_wind_reaction).length,
    pickChanges,
    pickChangePct: validRec > 0 ? pickChanges / validRec : 0,
  };
}

function rankSummary(a: Summary, b: Summary): number {
  if (a.pickChanges !== b.pickChanges) return a.pickChanges - b.pickChanges;
  if (a.surfaceGateChanges !== b.surfaceGateChanges) {
    return a.surfaceGateChanges - b.surfaceGateChanges;
  }
  if (a.absGte12 !== b.absGte12) return a.absGte12 - b.absGte12;
  if (a.absGte8 !== b.absGte8) return a.absGte8 - b.absGte8;
  if (a.activityChanges !== b.activityChanges) {
    return a.activityChanges - b.activityChanges;
  }
  if (a.lightBreezeTriggers !== b.lightBreezeTriggers) {
    return a.lightBreezeTriggers - b.lightBreezeTriggers;
  }
  const aCleanup = a.windReactionReduction + a.openWaterReduction;
  const bCleanup = b.windReactionReduction + b.openWaterReduction;
  if (aCleanup !== bCleanup) return bCleanup - aCleanup;
  return a.config.id.localeCompare(b.config.id);
}

function bestByMode(summaries: Summary[], mode: CandidateMode): Summary | null {
  const scoped = summaries.filter((s) => s.config.mode === mode);
  scoped.sort(rankSummary);
  return scoped[0] ?? null;
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function countValues(
  rows: AuditRow[],
  getValues: (row: AuditRow) => readonly string[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const value of getValues(row)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return counts;
}

function tableLines(counts: Map<string, number>): string {
  return [...counts.entries()].sort((a, b) =>
    b[1] - a[1] || a[0].localeCompare(b[0])
  )
    .map(([k, v]) => `| ${k} | ${v} |`).join("\n") || "| None | 0 |";
}

function dimensionTable(
  rows: AuditRow[],
  dim: "archetype" | "context" | "species" | "clarity",
): string {
  const counts = new Map<string, { total: number; changed: number }>();
  for (const row of rows) {
    const rec = row.baseline_recommender;
    const key = dim === "archetype"
      ? row.archetype
      : dim === "context"
      ? row.context
      : dim === "clarity"
      ? row.water_clarity
      : rec != null && !("error" in rec)
      ? rec.species
      : "unsupported_or_error";
    const current = counts.get(key) ?? { total: 0, changed: 0 };
    current.total += rec != null && !("error" in rec) ? 1 : 0;
    current.changed += row.selected_pick_ids_changed ? 1 : 0;
    counts.set(key, current);
  }
  return [...counts.entries()].filter(([, v]) => v.total > 0 || v.changed > 0)
    .sort((a, b) => b[1].changed - a[1].changed || a[0].localeCompare(b[0]))
    .map(([k, v]) =>
      `| ${k} | ${v.changed} | ${v.total} | ${
        v.total ? pct(v.changed / v.total) : "0.0%"
      } |`
    )
    .join("\n") || "| None | 0 | 0 | 0.0% |";
}

function sweepLine(s: Summary): string {
  return `| ${s.config.mode} | ${s.config.windProfile} | ${s.config.tagPolicy} | ${
    s.avgDelta.toFixed(2)
  } | ${s.maxDelta} | ${s.minDelta} | ${s.absGte8} | ${s.absGte12} | ${s.activityChanges} | ${s.windChanges} | ${s.validRec} | ${s.recErrors} | ${s.windModeChanges} | ${s.surfaceGateChanges} | ${s.tagChanges} | ${s.v2WindReaction} (${s.windReactionReduction}) | ${s.v2OpenWater} (${s.openWaterReduction}) | ${s.lightBreezeTriggers} | ${s.pickChanges} | ${
    pct(s.pickChangePct)
  } |`;
}

function sampleRows(
  rows: AuditRow[],
  kind: "improves" | "risky",
  limit = 30,
): string {
  return rows.filter((r) =>
    kind === "improves" ? r.improves_behavior : r.risky_behavior
  )
    .slice(0, limit)
    .map((r) => {
      const b = r.baseline_recommender;
      const v = r.v2_recommender;
      const bTags = b && !("error" in b) ? b.scenario_tags.join(", ") : "-";
      const vTags = v && !("error" in v) ? v.scenario_tags.join(", ") : "-";
      return `| ${r.region} | ${r.month} | ${r.context} | ${r.archetype} | ${r.water_clarity} | ${r.baseline_score}->${r.v2_score} | ${
        r.baseline_wind?.label ?? "-"
      }:${r.baseline_wind?.score ?? "-"} -> ${r.v2_wind?.label ?? "-"}:${
        r.v2_wind?.score ?? "-"
      } | ${bTags} -> ${vTags} | ${r.pick_change_causes.join(", ") || "-"} |`;
    }).join("\n") || "| None | - | - | - | - | - | - | - | - |";
}

function zeroDeltaConfirmation(summary: Summary | null): string {
  if (!summary) return "missing";
  const ok = summary.avgDelta === 0 && summary.maxDelta === 0 &&
    summary.minDelta === 0 &&
    summary.activityChanges === 0 && summary.windChanges === 0 &&
    summary.windModeChanges === 0 && summary.surfaceGateChanges === 0 &&
    summary.tagChanges === 0 && summary.pickChanges === 0;
  return ok ? "passed" : "failed";
}

const baselineRows = buildBaselineRows();
const allRowsByCandidate = new Map<string, AuditRow[]>();
const summaries: Summary[] = [];
for (const config of candidates()) {
  const rows = evaluateCandidate(baselineRows, config);
  allRowsByCandidate.set(config.id, rows);
  summaries.push(summarize(rows, config));
}
summaries.sort(rankSummary);

const productionControl = bestByMode(summaries, "production_control");
const bestScoreOnly = bestByMode(summaries, "score_only");
const bestTagOnly = bestByMode(summaries, "tag_only");
const bestCombined = bestByMode(summaries, "combined");
const best = bestCombined ?? bestScoreOnly ??
  summaries.find((s) => s.config.mode !== "production_control") ??
  summaries[0]!;
const bestRows = allRowsByCandidate.get(best.config.id)!;
const bestScoreRows = bestScoreOnly
  ? allRowsByCandidate.get(bestScoreOnly.config.id)!
  : [];
const bestTagRows = bestTagOnly
  ? allRowsByCandidate.get(bestTagOnly.config.id)!
  : [];
const bestCombinedRows = bestCombined
  ? allRowsByCandidate.get(bestCombined.config.id)!
  : [];
const productionParity = summaries.find((summary) =>
  summary.config.id === "score_only|high_wind_penalty_only"
);

function recommendation(): string {
  const meaningfulTagOnlyCleanup = summaries.filter((summary) =>
    summary.config.mode === "tag_only" &&
    (summary.windReactionReduction > 0 || summary.openWaterReduction > 0)
  );
  const safeMeaningfulTagOnlyCleanup = meaningfulTagOnlyCleanup.some((
    summary,
  ) =>
    summary.pickChangePct <= 0.05 && summary.absGte12 === 0 &&
    summary.surfaceGateChanges <= 5
  );
  if (
    bestCombined && bestCombined.pickChangePct <= 0.05 &&
    bestCombined.absGte12 === 0 && bestCombined.surfaceGateChanges <= 5 &&
    safeMeaningfulTagOnlyCleanup
  ) {
    return "ready for readiness fixtures";
  }
  if (bestScoreOnly && bestScoreOnly.pickChangePct <= 0.05) {
    return "wind score only is safe but tag tuning is not";
  }
  return "needs another sweep";
}

const markdown = `# Today's Bite Wind V2 Shadow Audit

Generated: ${new Date().toISOString()}

Phase 4C parity mode. Production wind normalization should match the experiment
winner; recommender production coupling remains untouched.

Phase 4C note: after production wiring, \`score_only|high_wind_penalty_only\`
is the production-vs-experiment parity check. Historical pre-wiring impact for
this candidate was 33 / 14,400 selected-pick changes (0.2%), 0 surface gate
changes, 0 rows with abs(score_delta) >= 8, and 0 rows with abs(score_delta) >= 12.

## Summary

| Metric | Value |
| --- | ---: |
| Baseline rows | ${baselineRows.length} |
| Candidates evaluated | ${summaries.length} |
| Production control zero-delta | ${zeroDeltaConfirmation(productionControl)} |
| Production-vs-experiment wind mismatches | ${
  productionParity?.windChanges ?? "n/a"
} |
| Production-vs-experiment score deltas | ${
  productionParity
    ? `${
      productionParity.avgDelta.toFixed(2)
    } avg, ${productionParity.absGte8} abs>=8, ${productionParity.absGte12} abs>=12`
    : "n/a"
} |
| Production-vs-experiment selected-pick changes | ${
  productionParity?.pickChanges ?? "n/a"
} |
| Production-vs-experiment surface gate changes | ${
  productionParity?.surfaceGateChanges ?? "n/a"
} |
| Best overall candidate | ${best.config.id} |
| Best score-only candidate | ${bestScoreOnly?.config.id ?? "none"} |
| Best tag-only candidate | ${bestTagOnly?.config.id ?? "none"} |
| Best combined candidate | ${bestCombined?.config.id ?? "none"} |
| Best avg score delta | ${best.avgDelta.toFixed(2)} |
| Best max/min score delta | ${best.maxDelta} / ${best.minDelta} |
| Best abs(score_delta) >= 8 | ${best.absGte8} |
| Best abs(score_delta) >= 12 | ${best.absGte12} |
| Best activity tier changes | ${best.activityChanges} |
| Best surface gate changes | ${best.surfaceGateChanges} |
| Best selected-pick changes | ${best.pickChanges} |
| Best selected-pick change percent | ${pct(best.pickChangePct)} |
| Recommendation | ${recommendation()} |

## Best Mode Snapshots

| Mode | Candidate | Avg Delta | abs>=8 | abs>=12 | Activity Changes | Tag Changes | Surface Changes | Pick Changes | Pick Change % | Wind Reaction V2 (Reduction) | Open Water V2 (Reduction) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${
  [productionControl, bestScoreOnly, bestTagOnly, bestCombined].filter((
    s,
  ): s is Summary => s != null).map((s) =>
    `| ${s.config.mode} | ${s.config.id} | ${
      s.avgDelta.toFixed(2)
    } | ${s.absGte8} | ${s.absGte12} | ${s.activityChanges} | ${s.tagChanges} | ${s.surfaceGateChanges} | ${s.pickChanges} | ${
      pct(s.pickChangePct)
    } | ${s.v2WindReaction} (${s.windReactionReduction}) | ${s.v2OpenWater} (${s.openWaterReduction}) |`
  ).join("\n")
}

## Corrected Sweep Table

| Candidate Mode | Wind Profile | Tag Policy | Avg Delta | Max | Min | abs>=8 | abs>=12 | Activity Changes | Wind Changes | Valid Rec | Rec Errors | Wind Mode Changes | Surface Changes | Tag Changes | Wind Reaction V2 (Reduction) | Open Water V2 (Reduction) | Light Breeze Triggers | Pick Changes | Pick Change % |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${summaries.map(sweepLine).join("\n")}

## Best Overall Pick-Change Causes

| Cause | Rows |
| --- | ---: |
${tableLines(countValues(bestRows, (row) => row.pick_change_causes))}

## Best Overall Tag-Change Causes

| Cause | Rows |
| --- | ---: |
${tableLines(countValues(bestRows, (row) => row.tag_change_causes))}

## Best Score-Only Pick-Change Causes

| Cause | Rows |
| --- | ---: |
${tableLines(countValues(bestScoreRows, (row) => row.pick_change_causes))}

## Best Tag-Only Pick-Change Causes

| Cause | Rows |
| --- | ---: |
${tableLines(countValues(bestTagRows, (row) => row.pick_change_causes))}

## Best Combined Pick-Change Causes

| Cause | Rows |
| --- | ---: |
${tableLines(countValues(bestCombinedRows, (row) => row.pick_change_causes))}

## Selected-Pick Changes By Archetype

| Archetype | Pick Changes | Valid Rows | Percent |
| --- | ---: | ---: | ---: |
${dimensionTable(bestRows, "archetype")}

## Selected-Pick Changes By Context

| Context | Pick Changes | Valid Rows | Percent |
| --- | ---: | ---: | ---: |
${dimensionTable(bestRows, "context")}

## Selected-Pick Changes By Species

| Species | Pick Changes | Valid Rows | Percent |
| --- | ---: | ---: | ---: |
${dimensionTable(bestRows, "species")}

## Selected-Pick Changes By Clarity

| Clarity | Pick Changes | Valid Rows | Percent |
| --- | ---: | ---: | ---: |
${dimensionTable(bestRows, "clarity")}

## Representative Safe Improvements

| Region | Month | Context | Archetype | Clarity | Score | Wind | Tags | Pick Causes |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- |
${sampleRows(bestRows, "improves")}

## Representative Risky Rows

| Region | Month | Context | Archetype | Clarity | Score | Wind | Tags | Pick Causes |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- |
${sampleRows(bestRows, "risky")}

## Artifacts

- JSONL: \`${OUTPUT_JSONL}\`
- Markdown: \`${OUTPUT_MD}\`
`;

await Deno.writeTextFile(
  OUTPUT_JSONL,
  bestRows.map((row) => JSON.stringify(row)).join("\n") + "\n",
);
await Deno.writeTextFile(OUTPUT_MD, markdown);

console.log(markdown);
console.log(`Wrote ${OUTPUT_JSONL}`);
console.log(`Wrote ${OUTPUT_MD}`);
