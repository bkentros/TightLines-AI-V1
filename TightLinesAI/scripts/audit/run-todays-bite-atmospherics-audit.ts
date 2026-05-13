#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 4A current-state audit for production atmospherics.
 *
 * Audit-only. Production pressure/light/wind normalizers, scoreDay, report
 * copy, recommender logic, app behavior, and other condition domains are not
 * changed by this script.
 */

import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import {
  CANONICAL_REGION_KEYS,
  type RegionKey,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type {
  ScoredVariableKey,
  SharedEngineRequest,
  VariableState,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";
import type { ActiveVariableScore } from "../../supabase/functions/_shared/howFishingEngine/score/types.ts";
import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type {
  RecommenderRequest,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-atmospherics-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-atmospherics-audit.md";

const CONTEXTS: readonly EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];
const WATER_CLARITIES: readonly WaterClarity[] = ["clear", "stained"];
const REQUIRED_FLAGS = [
  "pressure_insufficient_history_overconfident",
  "pressure_fast_fall_not_negative_enough",
  "pressure_stable_too_positive",
  "pressure_volatile_not_negative_enough",
  "clear_calm_surface_or_clear_subtle_questionable",
  "bright_clear_penalty_during_cold_or_cool_water_questionable",
  "overcast_too_strong_as_daymaker",
  "heavy_overcast_windy_not_suppressed_enough",
  "severe_wind_not_suppressed_enough",
  "light_breeze_triggers_wind_reaction",
  "wind_reaction_tag_too_frequent",
  "open_water_search_tag_too_frequent",
  "surface_gate_changes_from_light_wind",
  "missing_wind_or_cloud_overconfident",
  "verbal_driver_mismatch",
] as const;

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
type ContributionSnapshot = {
  key: ScoredVariableKey;
  label: string;
  score: number;
  weight: number;
  weighted_contribution: number;
};
type RecommenderSide = {
  species: SpeciesGroup;
  water_clarity: WaterClarity;
  activity_level: string;
  pressure_mode: string;
  light_mode: string;
  wind_mode: string;
  surface_daily_gate: string;
  scenario_tags: readonly string[];
  selected_lure_ids: readonly string[];
  selected_fly_ids: readonly string[];
};
type RecommenderResult =
  | RecommenderSide
  | { species: SpeciesGroup; water_clarity: WaterClarity; error: string }
  | null;
type AuditRow = {
  region: RegionKey;
  month: number;
  context: EngineContext;
  archetype: ArchetypeId;
  water_clarity: WaterClarity;
  score: number;
  activity_tier: string;
  reliability: string;
  available_variables: string[];
  missing_variables: string[];
  pressure: VariableSnapshot;
  light: VariableSnapshot;
  wind: VariableSnapshot;
  drivers: ContributionSnapshot[];
  suppressors: ContributionSnapshot[];
  summary_line: string;
  actionable_tip_tag: string | null;
  daypart_preset: string | null;
  questionable_flags: string[];
  recommender: RecommenderResult;
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

function hourlyWindPoints(
  values: number[] | undefined,
  localDate: string,
): Array<{ time_utc: string; value: number }> | undefined {
  if (!values) return undefined;
  return values.map((value, hour) => ({
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

function variableSnapshot(state: VariableState | undefined): VariableSnapshot {
  if (!state) return null;
  return {
    label: state.label,
    score: state.score,
    detail: state.detail ?? null,
  };
}

function contributionSnapshot(c: ActiveVariableScore): ContributionSnapshot {
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
  norm: ReturnType<typeof buildSharedNormalizedOutput>;
  scored: ReturnType<typeof scoreDay>;
  archetype: Archetype;
  waterClarity: WaterClarity;
}): RecommenderResult {
  const species = speciesForContext(args.req.context);
  if (!species) return null;
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
    const row = resolveDailyPicksSeasonalRow({
      species,
      region_key: args.req.region_key,
      month,
      water_type: args.req.context,
    });
    const result = runDailyPicksEngine({
      req: recReq,
      analysis: {
        ...baseAnalysis,
        norm: args.norm,
        scored: args.scored,
      } as SharedConditionAnalysis,
      seasonalRow: row,
      seed:
        `atmos|${args.req.region_key}|${args.req.local_date}|${args.req.context}|${args.archetype.id}|${args.waterClarity}`,
      variant: "A",
    });
    return {
      species,
      water_clarity: args.waterClarity,
      activity_level: result.scenario.activity_level,
      pressure_mode: result.scenario.pressure_mode,
      light_mode: result.scenario.light_mode,
      wind_mode: result.scenario.wind_mode,
      surface_daily_gate: result.scenario.surface_daily_gate,
      scenario_tags: result.scenario.scenario_tags,
      selected_lure_ids: result.diagnostics.selected_lure_ids,
      selected_fly_ids: result.diagnostics.selected_fly_ids,
    };
  } catch (error) {
    return {
      species,
      water_clarity: args.waterClarity,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function hasDriverOrSuppressor(
  contributions: ContributionSnapshot[],
  key: ScoredVariableKey,
): boolean {
  return contributions.some((c) => c.key === key);
}

function questionableFlags(row: {
  archetype: ArchetypeId;
  context: EngineContext;
  month: number;
  pressure: VariableSnapshot;
  light: VariableSnapshot;
  wind: VariableSnapshot;
  score: number;
  reliability: string;
  missing: string[];
  drivers: ContributionSnapshot[];
  suppressors: ContributionSnapshot[];
  recommender: RecommenderResult;
  summaryLine: string;
}): string[] {
  const flags: string[] = [];
  if (
    row.archetype === "insufficient_pressure_history" &&
    row.pressure != null &&
    row.reliability === "high"
  ) flags.push("pressure_insufficient_history_overconfident");
  if (
    row.pressure?.label === "falling_hard" &&
    row.pressure.score > -0.5
  ) flags.push("pressure_fast_fall_not_negative_enough");
  if (
    row.pressure?.label === "stable_neutral" &&
    row.pressure.score >= 0.5
  ) flags.push("pressure_stable_too_positive");
  if (row.pressure?.label === "volatile" && row.pressure.score > -1) {
    flags.push("pressure_volatile_not_negative_enough");
  }
  if (
    row.archetype === "clear_calm" &&
    row.recommender != null &&
    !("error" in row.recommender) &&
    (row.recommender.surface_daily_gate === "open" ||
      row.recommender.scenario_tags.includes("clear_subtle"))
  ) flags.push("clear_calm_surface_or_clear_subtle_questionable");
  if (
    row.light?.label === "glare" &&
    row.light.score < 0 &&
    (row.month <= 3 || row.month >= 11)
  ) flags.push("bright_clear_penalty_during_cold_or_cool_water_questionable");
  if (
    row.light?.label === "heavy_overcast" &&
    (row.light.score >= 1.1 ||
      hasDriverOrSuppressor(row.drivers, "light_cloud_condition"))
  ) flags.push("overcast_too_strong_as_daymaker");
  if (
    row.archetype === "heavy_overcast_windy" &&
    row.score >= 55
  ) flags.push("heavy_overcast_windy_not_suppressed_enough");
  if (
    row.archetype === "severe_wind" &&
    row.score >= 45
  ) flags.push("severe_wind_not_suppressed_enough");
  if (
    row.wind?.label === "light" &&
    row.recommender != null &&
    !("error" in row.recommender) &&
    row.recommender.scenario_tags.includes("wind_reaction")
  ) flags.push("light_breeze_triggers_wind_reaction");
  if (
    row.recommender != null &&
    !("error" in row.recommender) &&
    row.recommender.scenario_tags.includes("wind_reaction")
  ) flags.push("wind_reaction_tag_too_frequent");
  if (
    row.recommender != null &&
    !("error" in row.recommender) &&
    row.recommender.scenario_tags.includes("open_water_search")
  ) flags.push("open_water_search_tag_too_frequent");
  if (
    row.recommender != null &&
    !("error" in row.recommender) &&
    (row.archetype.includes("clear") || row.archetype.includes("overcast") ||
      row.archetype.includes("low_light") || row.archetype.includes("wind")) &&
    row.recommender.surface_daily_gate !== "closed"
  ) flags.push("surface_gate_changes_from_light_wind");
  if (
    (row.missing.includes("wind_condition") ||
      row.missing.includes("light_cloud_condition")) &&
    row.reliability === "high"
  ) flags.push("missing_wind_or_cloud_overconfident");
  const topDriver = row.drivers[0];
  const topSuppressor = row.suppressors[0];
  if (
    topDriver != null &&
    ((topDriver.key === "wind_condition" && (row.wind?.score ?? 0) <= 0) ||
      (topDriver.key === "light_cloud_condition" &&
        (row.light?.score ?? 0) <= 0) ||
      (topDriver.key === "pressure_regime" && (row.pressure?.score ?? 0) <= 0))
  ) flags.push("verbal_driver_mismatch");
  if (
    topSuppressor != null &&
    ((topSuppressor.key === "wind_condition" && (row.wind?.score ?? 0) >= 0) ||
      (topSuppressor.key === "light_cloud_condition" &&
        (row.light?.score ?? 0) >= 0) ||
      (topSuppressor.key === "pressure_regime" &&
        (row.pressure?.score ?? 0) >= 0))
  ) flags.push("verbal_driver_mismatch");
  if (
    row.summaryLine.toLowerCase().includes("wind") &&
    (row.wind == null || Math.abs(row.wind.score) < 0.05)
  ) flags.push("verbal_driver_mismatch");
  return [...new Set(flags)];
}

function buildRows(): AuditRow[] {
  const rows: AuditRow[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of CONTEXTS) {
        for (const archetype of ARCHETYPES) {
          const req = buildRequest(region, month, context, archetype);
          const norm = buildSharedNormalizedOutput(req);
          const scored = scoreDay(norm);
          const report = runHowFishingReport(req);
          const pressure = variableSnapshot(norm.normalized.pressure_regime);
          const light = variableSnapshot(norm.normalized.light_cloud_condition);
          const wind = variableSnapshot(norm.normalized.wind_condition);
          const drivers = scored.drivers.map(contributionSnapshot);
          const suppressors = scored.suppressors.map(contributionSnapshot);
          for (const waterClarity of WATER_CLARITIES) {
            const recommender = runRecommender({
              req,
              norm,
              scored,
              archetype,
              waterClarity,
            });
            const flags = questionableFlags({
              archetype: archetype.id,
              context,
              month,
              pressure,
              light,
              wind,
              score: scored.score,
              reliability: norm.reliability,
              missing: norm.missing_variables,
              drivers,
              suppressors,
              recommender,
              summaryLine: report.summary_line,
            });
            rows.push({
              region,
              month,
              context,
              archetype: archetype.id,
              water_clarity: waterClarity,
              score: scored.score,
              activity_tier: compositeScoreActivityTier(scored.score),
              reliability: norm.reliability,
              available_variables: norm.available_variables,
              missing_variables: norm.missing_variables,
              pressure,
              light,
              wind,
              drivers,
              suppressors,
              summary_line: report.summary_line,
              actionable_tip_tag: report.actionable_tip_tag ?? null,
              daypart_preset: report.daypart_preset ?? null,
              questionable_flags: flags,
              recommender,
            });
          }
        }
      }
    }
  }
  return rows;
}

function countBy<T>(items: T[], key: (item: T) => string | null | undefined) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item) ?? "null";
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

function tableLines(counts: Map<string, number>): string {
  return [...counts.entries()].sort((a, b) =>
    b[1] - a[1] || a[0].localeCompare(b[0])
  )
    .map(([label, count]) => `| ${label} | ${count} |`).join("\n") ||
    "| None | 0 |";
}

function flagCounts(rows: AuditRow[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const flag of REQUIRED_FLAGS) counts.set(flag, 0);
  for (const row of rows) {
    for (const flag of row.questionable_flags) {
      counts.set(flag, (counts.get(flag) ?? 0) + 1);
    }
  }
  return counts;
}

function scoreByArchetypeLines(rows: AuditRow[]): string {
  const grouped = new Map<string, number[]>();
  for (const row of rows) {
    const arr = grouped.get(row.archetype) ?? [];
    arr.push(row.score);
    grouped.set(row.archetype, arr);
  }
  return [...grouped.entries()].map(([id, scores]) => {
    const avg = scores.reduce((sum, n) => sum + n, 0) / scores.length;
    return `| ${id} | ${avg.toFixed(1)} | ${Math.min(...scores)} | ${
      Math.max(...scores)
    } |`;
  }).join("\n");
}

function recRows(rows: AuditRow[]) {
  return rows.filter((row) => row.recommender != null);
}

function validRecRows(rows: AuditRow[]) {
  return rows.filter((row) =>
    row.recommender != null && !("error" in row.recommender)
  );
}

function selectedPickSensitivitySamples(rows: AuditRow[], limit = 20): string {
  const byKey = new Map<string, AuditRow[]>();
  for (const row of validRecRows(rows)) {
    const key = `${row.region}|${row.month}|${row.context}|${row.archetype}`;
    const arr = byKey.get(key) ?? [];
    arr.push(row);
    byKey.set(key, arr);
  }
  const lines: string[] = [];
  for (const group of byKey.values()) {
    const clear = group.find((row) => row.water_clarity === "clear");
    const stained = group.find((row) => row.water_clarity === "stained");
    if (!clear || !stained) continue;
    const c = clear.recommender;
    const s = stained.recommender;
    if (c == null || s == null || "error" in c || "error" in s) continue;
    const cp = [...c.selected_lure_ids, ...c.selected_fly_ids].join(", ");
    const sp = [...s.selected_lure_ids, ...s.selected_fly_ids].join(", ");
    if (
      cp !== sp ||
      JSON.stringify(c.scenario_tags) !== JSON.stringify(s.scenario_tags)
    ) {
      lines.push(
        `| ${clear.region} | ${clear.month} | ${clear.context} | ${clear.archetype} | ${
          c.scenario_tags.join(", ")
        } | ${s.scenario_tags.join(", ")} | ${cp} | ${sp} |`,
      );
    }
    if (lines.length >= limit) break;
  }
  return lines.join("\n") || "| None | - | - | - | - | - | - | - |";
}

function questionableSampleLines(rows: AuditRow[], limit = 40): string {
  return rows.filter((row) => row.questionable_flags.length > 0).slice(0, limit)
    .map((row) =>
      `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${row.score} | ${
        row.pressure?.label ?? "-"
      }:${row.pressure?.score ?? "-"} | ${row.light?.label ?? "-"}:${
        row.light?.score ?? "-"
      } | ${row.wind?.label ?? "-"}:${row.wind?.score ?? "-"} | ${
        row.questionable_flags.join(", ")
      } |`
    ).join("\n") || "| None | - | - | - | - | - | - | - | - | - |";
}

function recommendation(flagCountsMap: Map<string, number>): string {
  const wind = (flagCountsMap.get("wind_reaction_tag_too_frequent") ?? 0) +
    (flagCountsMap.get("severe_wind_not_suppressed_enough") ?? 0) +
    (flagCountsMap.get("light_breeze_triggers_wind_reaction") ?? 0);
  const light = (flagCountsMap.get("overcast_too_strong_as_daymaker") ?? 0) +
    (flagCountsMap.get("clear_calm_surface_or_clear_subtle_questionable") ??
      0) +
    (flagCountsMap.get(
      "bright_clear_penalty_during_cold_or_cool_water_questionable",
    ) ?? 0);
  const pressure =
    (flagCountsMap.get("pressure_fast_fall_not_negative_enough") ?? 0) +
    (flagCountsMap.get("pressure_volatile_not_negative_enough") ?? 0) +
    (flagCountsMap.get("pressure_insufficient_history_overconfident") ?? 0);
  if (wind >= light && wind >= pressure) {
    return "Tune wind/recommender wind coupling first: wind-related tags and surface gates are the largest coupling surface in this audit.";
  }
  if (light >= pressure) {
    return "Tune light/cloud next: overcast and clear/calm states are the biggest score and surface-gate ambiguity.";
  }
  return "Tune pressure next: pressure history quality and fast/volatile pressure semantics need the closest review.";
}

const rows = buildRows();
const flags = flagCounts(rows);
const rec = recRows(rows);
const validRec = validRecRows(rows);
const recErrors = rec.length - validRec.length;

const markdown = `# Today's Bite Atmospherics Current-State Audit

Generated: ${new Date().toISOString()}

Phase 4A audit-only. Production scoring, report copy, recommender logic, forecast behavior, temperature, rain/runoff, and tide logic are untouched.

## Summary

| Metric | Value |
| --- | ---: |
| Total rows | ${rows.length} |
| Regions | ${CANONICAL_REGION_KEYS.length} |
| Months | 12 |
| Contexts | ${CONTEXTS.length} |
| Archetypes | ${ARCHETYPES.length} |
| Water clarity variants | ${WATER_CLARITIES.length} |
| Rows with questionable flags | ${
  rows.filter((row) => row.questionable_flags.length > 0).length
} |
| Recommender valid rows | ${validRec.length} |
| Recommender error rows | ${recErrors} |

## Questionable Flag Counts

| Flag | Rows |
| --- | ---: |
${tableLines(flags)}

## Pressure Label Distribution

| Label | Rows |
| --- | ---: |
${tableLines(countBy(rows, (row) => row.pressure?.label ?? "omitted"))}

## Light Label Distribution

| Label | Rows |
| --- | ---: |
${tableLines(countBy(rows, (row) => row.light?.label ?? "omitted"))}

## Wind Label Distribution

| Label | Rows |
| --- | ---: |
${tableLines(countBy(rows, (row) => row.wind?.label ?? "omitted"))}

## Score Distribution By Archetype

| Archetype | Avg Score | Min | Max |
| --- | ---: | ---: | ---: |
${scoreByArchetypeLines(rows)}

## Recommender Coupling Summary

| Metric | Value |
| --- | ---: |
| Valid rows | ${validRec.length} |
| Error rows | ${recErrors} |

### Surface Gate Distribution

| Surface Gate | Rows |
| --- | ---: |
${
  tableLines(countBy(validRec, (row) =>
    !row.recommender || "error" in row.recommender
      ? null
      : row.recommender.surface_daily_gate))
}

### Wind Mode Distribution

| Wind Mode | Rows |
| --- | ---: |
${
  tableLines(countBy(validRec, (row) =>
    !row.recommender || "error" in row.recommender
      ? null
      : row.recommender.wind_mode))
}

### Light Mode Distribution

| Light Mode | Rows |
| --- | ---: |
${
  tableLines(countBy(validRec, (row) =>
    !row.recommender || "error" in row.recommender
      ? null
      : row.recommender.light_mode))
}

### Pressure Mode Distribution

| Pressure Mode | Rows |
| --- | ---: |
${
  tableLines(countBy(validRec, (row) =>
    !row.recommender || "error" in row.recommender
      ? null
      : row.recommender.pressure_mode))
}

### Scenario Tag Counts

| Tag | Rows |
| --- | ---: |
${
  tableLines((() => {
    const counts = new Map<string, number>();
    for (const row of validRec) {
      const r = row.recommender;
      if (r == null || "error" in r) continue;
      for (const tag of r.scenario_tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return counts;
  })())
}

## Selected-Pick Sensitivity Samples

| Region | Month | Context | Archetype | Clear Tags | Stained Tags | Clear Picks | Stained Picks |
| --- | ---: | --- | --- | --- | --- | --- | --- |
${selectedPickSensitivitySamples(rows)}

## Representative Questionable Samples

| Region | Month | Context | Archetype | Clarity | Score | Pressure | Light | Wind | Flags |
| --- | ---: | --- | --- | --- | ---: | --- | --- | --- | --- |
${questionableSampleLines(rows)}

## Recommendation

${recommendation(flags)}

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
