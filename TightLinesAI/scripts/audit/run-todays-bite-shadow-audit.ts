#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * FinFindr Today's Bite + daily-picks shadow audit.
 *
 * Read-only harness for scoring-renovation work. It snapshots current deterministic
 * How's Fishing output plus the daily-picks-facing scenario/pick surface so later
 * Phase 2 candidates can be compared against a stable baseline.
 *
 * Run:
 *   deno run --allow-read --allow-write scripts/audit/run-todays-bite-shadow-audit.ts
 */

import { CANONICAL_REGIONS } from "../../supabase/functions/_shared/howFishingEngine/config/regions.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/input.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type { RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-shadow-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-shadow-audit.md";

const CONTEXTS: readonly EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];

const REGION_META: Record<
  RegionKey,
  { lat: number; lon: number; state: string; tz: string }
> = {
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
  south_central: {
    lat: 30.3,
    lon: -97.7,
    state: "TX",
    tz: "America/Chicago",
  },
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
  | "cold_front_shock"
  | "warming_trend"
  | "heat_limited"
  | "active_rain"
  | "recent_rain_runoff"
  | "bright_calm"
  | "overcast_breezy"
  | "windy";

type Archetype = {
  id: ArchetypeId;
  tempF: number;
  priorTempF: number;
  dayMinus2TempF: number;
  pressureNowMb: number;
  pressureAgoMb: number;
  windMph: number;
  cloudPct: number;
  precip24In: number;
  precip72In: number;
  precip7dIn: number;
  activePrecipNow: boolean;
  precipRateInPerHr: number | null;
};

const ARCHETYPES: readonly Archetype[] = [
  {
    id: "stable_good",
    tempF: 68,
    priorTempF: 68,
    dayMinus2TempF: 68,
    pressureNowMb: 1015,
    pressureAgoMb: 1015,
    windMph: 8,
    cloudPct: 55,
    precip24In: 0,
    precip72In: 0,
    precip7dIn: 0,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "cold_front_shock",
    tempF: 45,
    priorTempF: 58,
    dayMinus2TempF: 64,
    pressureNowMb: 1022,
    pressureAgoMb: 1008,
    windMph: 16,
    cloudPct: 20,
    precip24In: 0.05,
    precip72In: 0.1,
    precip7dIn: 0.2,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "warming_trend",
    tempF: 60,
    priorTempF: 54,
    dayMinus2TempF: 49,
    pressureNowMb: 1013,
    pressureAgoMb: 1012,
    windMph: 8,
    cloudPct: 50,
    precip24In: 0,
    precip72In: 0,
    precip7dIn: 0.1,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "heat_limited",
    tempF: 92,
    priorTempF: 90,
    dayMinus2TempF: 88,
    pressureNowMb: 1016,
    pressureAgoMb: 1016,
    windMph: 4,
    cloudPct: 10,
    precip24In: 0,
    precip72In: 0,
    precip7dIn: 0,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "active_rain",
    tempF: 70,
    priorTempF: 70,
    dayMinus2TempF: 70,
    pressureNowMb: 1008,
    pressureAgoMb: 1018,
    windMph: 12,
    cloudPct: 95,
    precip24In: 0.8,
    precip72In: 1.1,
    precip7dIn: 1.6,
    activePrecipNow: true,
    precipRateInPerHr: 0.12,
  },
  {
    id: "recent_rain_runoff",
    tempF: 68,
    priorTempF: 67,
    dayMinus2TempF: 66,
    pressureNowMb: 1012,
    pressureAgoMb: 1013,
    windMph: 8,
    cloudPct: 65,
    precip24In: 0.2,
    precip72In: 1.6,
    precip7dIn: 3.2,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "bright_calm",
    tempF: 72,
    priorTempF: 72,
    dayMinus2TempF: 72,
    pressureNowMb: 1014,
    pressureAgoMb: 1014,
    windMph: 3,
    cloudPct: 5,
    precip24In: 0,
    precip72In: 0,
    precip7dIn: 0,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "overcast_breezy",
    tempF: 68,
    priorTempF: 68,
    dayMinus2TempF: 68,
    pressureNowMb: 1012,
    pressureAgoMb: 1014,
    windMph: 11,
    cloudPct: 90,
    precip24In: 0,
    precip72In: 0.1,
    precip7dIn: 0.2,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
  {
    id: "windy",
    tempF: 68,
    priorTempF: 68,
    dayMinus2TempF: 68,
    pressureNowMb: 1012,
    pressureAgoMb: 1011,
    windMph: 24,
    cloudPct: 45,
    precip24In: 0,
    precip72In: 0,
    precip7dIn: 0,
    activePrecipNow: false,
    precipRateInPerHr: null,
  },
];

function pressureHistory(current: number, ago: number): number[] {
  const values: number[] = [];
  for (let i = 0; i < 48; i++) {
    values.push(ago + ((current - ago) * i) / 47);
  }
  return values;
}

function tideHighLow(month: number, strong: boolean) {
  const m = String(month).padStart(2, "0");
  return strong
    ? [
      { time: `2026-${m}-15T06:00:00`, value: 0.2, type: "L" },
      { time: `2026-${m}-15T12:00:00`, value: 2.4, type: "H" },
      { time: `2026-${m}-15T18:00:00`, value: 0.4, type: "L" },
    ]
    : [
      { time: `2026-${m}-15T06:00:00`, value: 1.2, type: "L" },
      { time: `2026-${m}-15T12:00:00`, value: 1.6, type: "H" },
      { time: `2026-${m}-15T18:00:00`, value: 1.3, type: "L" },
    ];
}

function tideStage(archetype: ArchetypeId): string {
  if (archetype === "bright_calm") return "approaching slack";
  if (archetype === "windy") return "outgoing";
  return "incoming";
}

function buildRequest(
  regionKey: RegionKey,
  month: number,
  context: EngineContext,
  archetype: Archetype,
): SharedEngineRequest {
  const meta = REGION_META[regionKey];
  const localDate = `2026-${String(month).padStart(2, "0")}-15`;
  const coastal = context === "coastal" ||
    context === "coastal_flats_estuary";
  const strongTide = archetype.id !== "bright_calm";

  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: regionKey,
    local_date: localDate,
    local_timezone: meta.tz,
    context,
    environment: {
      current_air_temp_f: archetype.tempF,
      daily_mean_air_temp_f: archetype.tempF,
      daily_low_air_temp_f: archetype.tempF - 8,
      daily_high_air_temp_f: archetype.tempF + 8,
      prior_day_mean_air_temp_f: archetype.priorTempF,
      day_minus_2_mean_air_temp_f: archetype.dayMinus2TempF,
      pressure_mb: archetype.pressureNowMb,
      pressure_history_mb: pressureHistory(
        archetype.pressureNowMb,
        archetype.pressureAgoMb,
      ),
      wind_speed_mph: archetype.windMph,
      cloud_cover_pct: archetype.cloudPct,
      precip_24h_in: archetype.precip24In,
      precip_72h_in: archetype.precip72In,
      precip_7d_in: archetype.precip7dIn,
      active_precip_now: archetype.activePrecipNow,
      precip_rate_now_in_per_hr: archetype.precipRateInPerHr,
      tide_movement_state: coastal ? tideStage(archetype.id) : null,
      current_speed_knots_max: coastal
        ? archetype.id === "bright_calm"
          ? 0.2
          : archetype.id === "windy"
          ? 2.1
          : 1.1
        : null,
      tide_high_low: coastal ? tideHighLow(month, strongTide) : null,
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

function recommenderSnapshot(req: SharedEngineRequest) {
  const species = speciesForContext(req.context);
  if (!species) return null;

  try {
    const recReq: RecommenderRequest = {
      location: {
        latitude: req.latitude,
        longitude: req.longitude,
        state_code: req.state_code ?? "XX",
        region_key: req.region_key,
        local_date: req.local_date,
        local_timezone: req.local_timezone,
        month: Number.parseInt(req.local_date.slice(5, 7), 10),
      },
      species,
      context: req.context,
      water_clarity: "stained",
      recommendation_goal: "all_purpose",
      env_data: {
        ...req.environment,
        weather: { wind_speed_unit: "mph" },
      },
    };
    const analysis = analyzeRecommenderConditions(recReq);
    const row = resolveDailyPicksSeasonalRow({
      species,
      region_key: req.region_key,
      month: recReq.location.month,
      water_type: req.context,
    });
    const result = runDailyPicksEngine({
      req: recReq,
      analysis,
      seasonalRow: row,
      seed: `today-shadow|${req.region_key}|${req.local_date}|${req.context}`,
      variant: "A",
    });

    return {
      species,
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
    return {
      species,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function variableSnapshot(
  normalized: ReturnType<typeof buildSharedNormalizedOutput>["normalized"],
  key:
    | "pressure_regime"
    | "light_cloud_condition"
    | "wind_condition"
    | "precipitation_disruption"
    | "runoff_flow_disruption"
    | "tide_current_movement",
) {
  const variable = normalized[key];
  if (!variable) return null;
  return { label: variable.label, detail: variable.detail ?? null };
}

const rows: unknown[] = [];
const scoreByContext = new Map<EngineContext, number[]>();
const scoresByArchetype = new Map<ArchetypeId, number[]>();
let recommenderRows = 0;
let recommenderErrors = 0;

for (const regionKey of CANONICAL_REGIONS) {
  for (let month = 1; month <= 12; month++) {
    for (const context of CONTEXTS) {
      for (const archetype of ARCHETYPES) {
        const req = buildRequest(regionKey, month, context, archetype);
        const report = runHowFishingReport(req);
        const norm = buildSharedNormalizedOutput(req);
        const temp = norm.normalized.temperature ?? null;
        const recommender = recommenderSnapshot(req);

        if (recommender != null) {
          recommenderRows++;
          if ("error" in recommender) recommenderErrors++;
        }

        const row = {
          region_key: regionKey,
          month,
          context,
          scenario_id: archetype.id,
          score: report.score,
          activity_tier: compositeScoreActivityTier(report.score),
          reliability: norm.reliability,
          temperature: temp
            ? {
              measurement_source: temp.measurement_source,
              band_label: temp.band_label,
              trend_label: temp.trend_label,
              shock_label: temp.shock_label,
              final_score: temp.final_score,
            }
            : null,
          pressure: variableSnapshot(norm.normalized, "pressure_regime"),
          light: variableSnapshot(norm.normalized, "light_cloud_condition"),
          wind: variableSnapshot(norm.normalized, "wind_condition"),
          precip: variableSnapshot(
            norm.normalized,
            "precipitation_disruption",
          ),
          runoff: variableSnapshot(norm.normalized, "runoff_flow_disruption"),
          tide: variableSnapshot(norm.normalized, "tide_current_movement"),
          recommender,
        };
        rows.push(row);

        const contextScores = scoreByContext.get(context) ?? [];
        contextScores.push(report.score);
        scoreByContext.set(context, contextScores);

        const archetypeScores = scoresByArchetype.get(archetype.id) ?? [];
        archetypeScores.push(report.score);
        scoresByArchetype.set(archetype.id, archetypeScores);
      }
    }
  }
}

function avg(values: readonly number[]): string {
  return (values.reduce((sum, value) => sum + value, 0) / values.length)
    .toFixed(1);
}

function scoreSummary(values: readonly number[]): string {
  return `${avg(values)} / ${Math.min(...values)} / ${Math.max(...values)}`;
}

const jsonl = rows.map((row) => JSON.stringify(row)).join("\n") + "\n";

const contextLines = CONTEXTS.map((context) => {
  const scores = scoreByContext.get(context) ?? [];
  return `| ${context} | ${scores.length} | ${scoreSummary(scores)} |`;
}).join("\n");

const archetypeLines = ARCHETYPES.map((archetype) => {
  const scores = scoresByArchetype.get(archetype.id) ?? [];
  return `| ${archetype.id} | ${scores.length} | ${scoreSummary(scores)} |`;
}).join("\n");

const markdown = `# Today's Bite Shadow Audit

Generated: ${new Date().toISOString()}

Read-only baseline for Phase 2 scoring renovation. This script does not mutate production logic or recommender selection code.

## Scope

| Metric | Value |
| --- | ---: |
| Regions | ${CANONICAL_REGIONS.length} |
| Months | 12 |
| Contexts | ${CONTEXTS.length} |
| Archetypes | ${ARCHETYPES.length} |
| Total rows | ${rows.length} |
| Recommender rows attempted | ${recommenderRows} |
| Recommender rows with errors | ${recommenderErrors} |

## Context Score Summary

Average / min / max score.

| Context | Rows | Avg / Min / Max |
| --- | ---: | --- |
${contextLines}

## Archetype Score Summary

Average / min / max score.

| Archetype | Rows | Avg / Min / Max |
| --- | ---: | --- |
${archetypeLines}

## Artifacts

- JSONL: \`${OUTPUT_JSONL}\`
- Markdown: \`${OUTPUT_MD}\`
`;

await Deno.writeTextFile(OUTPUT_JSONL, jsonl);
await Deno.writeTextFile(OUTPUT_MD, markdown);

console.log(markdown);
console.log(`Wrote ${OUTPUT_JSONL}`);
console.log(`Wrote ${OUTPUT_MD}`);
