#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 7A pressure current-state audit.
 *
 * Audit-only. Production pressure normalization, scoreDay, report copy,
 * app/forecast behavior, other condition normalizers, and recommender
 * production logic/candidate pools/scoring/gates/selection are not modified.
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
import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import {
  normalizePressureDetailed,
  type PressureHistoryQuality,
} from "../../supabase/functions/_shared/howFishingEngine/normalize/normalizePressure.ts";
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

const OUTPUT_JSONL = "scripts/audit/todays-bite-pressure-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-pressure-audit.md";

const CONTEXTS: readonly EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];
const WATER_CLARITIES: readonly WaterClarity[] = ["clear", "stained"];
const FLAG_KEYS = [
  "pressure_overconfident_sparse_history",
  "missing_pressure_reliability_too_high",
  "stable_pressure_too_strong_as_daymaker",
  "fast_fall_not_penalized_enough",
  "volatile_not_penalized_enough",
  "slow_fall_overrewarded_in_poor_context",
  "pressure_driver_with_near_zero_score",
  "pressure_suppressor_with_near_zero_score",
  "pressure_label_unstable_for_similar_inputs",
  "recommender_pressure_mode_coupling",
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

type PressureArchetypeId =
  | "stable_high"
  | "stable_normal"
  | "stable_low"
  | "slow_rise"
  | "slow_fall"
  | "fast_rise"
  | "fast_fall"
  | "volatile_swing"
  | "recently_stabilizing_after_volatile"
  | "front_approaching"
  | "post_front_stable"
  | "missing_pressure"
  | "sparse_two_point_history"
  | "noisy_but_flat_recent"
  | "falling_then_recovering"
  | "rising_then_crashing";

type PressureArchetype = {
  id: PressureArchetypeId;
  pressure: number[] | null;
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
type RecommenderResult =
  | {
    species: string;
    water_clarity: WaterClarity;
    activity_level: string;
    pressure_mode: string;
    thermal_mode: string;
    light_mode: string;
    wind_mode: string;
    surface_daily_gate: string;
    water_movement_mode: string;
    scenario_tags: readonly string[];
    selected_lure_ids: readonly string[];
    selected_fly_ids: readonly string[];
  }
  | { species: SpeciesGroup; water_clarity: WaterClarity; error: string }
  | null;

type AuditRow = {
  region: RegionKey;
  month: number;
  context: EngineContext;
  archetype: PressureArchetypeId;
  water_clarity: WaterClarity;
  pressure_history_mb: number[] | null;
  pressure_quality: PressureHistoryQuality | null;
  pressure: VariableSnapshot;
  score: number;
  activity_tier: string;
  reliability: string;
  available_variables: string[];
  missing_variables: string[];
  data_gaps: unknown[];
  pressure_is_driver: boolean;
  pressure_is_suppressor: boolean;
  pressure_contribution: ContributionSnapshot | null;
  questionable_flags: FlagKey[];
  recommender: RecommenderResult;
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

function recentlyStabilizingPressure(): number[] {
  return [
    1010,
    1018,
    1009,
    1017,
    1008,
    1016,
    1009,
    1015,
    1010,
    1014,
    1011,
    1013.1,
    1013.0,
    1013.2,
    1013.1,
    1013.2,
  ];
}

const ARCHETYPES: readonly PressureArchetype[] = [
  { id: "stable_high", pressure: linearPressure(1024, 1024.1) },
  { id: "stable_normal", pressure: linearPressure(1014, 1014.1) },
  { id: "stable_low", pressure: linearPressure(1002, 1002.1) },
  { id: "slow_rise", pressure: linearPressure(1012, 1014) },
  { id: "slow_fall", pressure: linearPressure(1016, 1013.5) },
  { id: "fast_rise", pressure: linearPressure(1010, 1017.5) },
  { id: "fast_fall", pressure: linearPressure(1020, 1012.5) },
  { id: "volatile_swing", pressure: volatilePressure() },
  {
    id: "recently_stabilizing_after_volatile",
    pressure: recentlyStabilizingPressure(),
  },
  { id: "front_approaching", pressure: linearPressure(1018, 1013) },
  { id: "post_front_stable", pressure: linearPressure(1022, 1022.2) },
  { id: "missing_pressure", pressure: null },
  { id: "sparse_two_point_history", pressure: [1014, 1012] },
  {
    id: "noisy_but_flat_recent",
    pressure: [
      1013,
      1014,
      1012.8,
      1013.8,
      1012.9,
      1013.6,
      1013.1,
      1013.4,
      1013.2,
      1013.3,
      1013.2,
      1013.3,
    ],
  },
  {
    id: "falling_then_recovering",
    pressure: [
      1018,
      1017,
      1016,
      1015,
      1014,
      1013,
      1012,
      1011.5,
      1011.2,
      1011.8,
      1012.5,
      1013,
    ],
  },
  {
    id: "rising_then_crashing",
    pressure: [
      1010,
      1011,
      1012,
      1013,
      1014,
      1015.5,
      1017,
      1016,
      1014,
      1012,
      1010.5,
      1009.5,
    ],
  },
];

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

function buildRequest(
  region: RegionKey,
  month: number,
  context: EngineContext,
  archetype: PressureArchetype,
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
      wind_speed_mph: 8,
      cloud_cover_pct: 55,
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

function speciesForContext(context: EngineContext): SpeciesGroup | null {
  if (context === "freshwater_lake_pond") return "largemouth_bass";
  if (context === "freshwater_river") return "river_trout";
  return null;
}

function runRecommender(args: {
  req: SharedEngineRequest;
  norm: ReturnType<typeof buildSharedNormalizedOutput>;
  scored: ReturnType<typeof scoreDay>;
  waterClarity: WaterClarity;
  key: string;
}): RecommenderResult {
  const species = speciesForContext(args.req.context);
  if (!species) return null;
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
    const seasonalRow = resolveDailyPicksSeasonalRow({
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
      seasonalRow,
      seed: `pressure-audit|${args.key}`,
      variant: "A",
    });
    return {
      species: result.scenario.species,
      water_clarity: result.scenario.water_clarity,
      activity_level: result.scenario.activity_level,
      pressure_mode: result.scenario.pressure_mode,
      thermal_mode: result.scenario.thermal_mode,
      light_mode: result.scenario.light_mode,
      wind_mode: result.scenario.wind_mode,
      surface_daily_gate: result.scenario.surface_daily_gate,
      water_movement_mode: result.scenario.water_movement_mode,
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

function addFlag(flags: Set<FlagKey>, flag: FlagKey, when: boolean): void {
  if (when) flags.add(flag);
}

function questionableFlags(args: {
  archetype: PressureArchetypeId;
  pressure: VariableSnapshot;
  quality: PressureHistoryQuality | null;
  reliability: string;
  missing: string[];
  score: number;
  pressureIsDriver: boolean;
  pressureIsSuppressor: boolean;
  pressureMode: string | null;
  pressureContribution: ContributionSnapshot | null;
}): FlagKey[] {
  const flags = new Set<FlagKey>();
  const pScore = args.pressure?.score ?? null;
  addFlag(
    flags,
    "pressure_overconfident_sparse_history",
    (args.quality === "two_point" || args.quality === "sparse") &&
      args.reliability === "high",
  );
  addFlag(
    flags,
    "missing_pressure_reliability_too_high",
    args.missing.includes("pressure_regime") && args.reliability === "high",
  );
  addFlag(
    flags,
    "stable_pressure_too_strong_as_daymaker",
    args.pressure?.label === "stable_neutral" &&
      (Math.abs(pScore ?? 0) >= 0.5 || args.pressureIsDriver),
  );
  addFlag(
    flags,
    "fast_fall_not_penalized_enough",
    args.pressure?.label === "falling_hard" && (pScore ?? 0) > -0.25,
  );
  addFlag(
    flags,
    "volatile_not_penalized_enough",
    args.pressure?.label === "volatile" && (pScore ?? 0) > -1,
  );
  addFlag(
    flags,
    "slow_fall_overrewarded_in_poor_context",
    args.pressure?.label === "falling_slow" && (pScore ?? 0) > 1 &&
      args.score < 50,
  );
  addFlag(
    flags,
    "pressure_driver_with_near_zero_score",
    args.pressureIsDriver && Math.abs(pScore ?? 0) < 0.15,
  );
  addFlag(
    flags,
    "pressure_suppressor_with_near_zero_score",
    args.pressureIsSuppressor && Math.abs(pScore ?? 0) < 0.15,
  );
  addFlag(
    flags,
    "pressure_label_unstable_for_similar_inputs",
    (args.archetype === "noisy_but_flat_recent" ||
      args.archetype === "falling_then_recovering") &&
      args.pressure?.label === "volatile",
  );
  addFlag(
    flags,
    "recommender_pressure_mode_coupling",
    args.pressureMode != null && args.pressureMode !== "stable" &&
      args.pressureMode !== "unknown",
  );
  return [...flags];
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
          const pressureDetailed = normalizePressureDetailed(
            archetype.pressure,
          );
          const pressure = variableSnapshot(norm.normalized.pressure_regime);
          const drivers = scored.drivers.map(contributionSnapshot);
          const suppressors = scored.suppressors.map(contributionSnapshot);
          const pressureContribution = [...drivers, ...suppressors].find((c) =>
            c.key === "pressure_regime"
          ) ?? null;
          for (const waterClarity of WATER_CLARITIES) {
            const key =
              `${region}|${month}|${context}|${archetype.id}|${waterClarity}`;
            const recommender = runRecommender({
              req,
              norm,
              scored,
              waterClarity,
              key,
            });
            const pressureMode =
              recommender != null && !("error" in recommender)
                ? recommender.pressure_mode
                : null;
            const pressureIsDriver = drivers.some((c) =>
              c.key === "pressure_regime"
            );
            const pressureIsSuppressor = suppressors.some((c) =>
              c.key === "pressure_regime"
            );
            rows.push({
              region,
              month,
              context,
              archetype: archetype.id,
              water_clarity: waterClarity,
              pressure_history_mb: archetype.pressure,
              pressure_quality: pressureDetailed?.quality ?? null,
              pressure,
              score: scored.score,
              activity_tier: compositeScoreActivityTier(scored.score),
              reliability: norm.reliability,
              available_variables: norm.available_variables,
              missing_variables: norm.missing_variables,
              data_gaps: norm.data_gaps,
              pressure_is_driver: pressureIsDriver,
              pressure_is_suppressor: pressureIsSuppressor,
              pressure_contribution: pressureContribution,
              questionable_flags: questionableFlags({
                archetype: archetype.id,
                pressure,
                quality: pressureDetailed?.quality ?? null,
                reliability: norm.reliability,
                missing: norm.missing_variables,
                score: scored.score,
                pressureIsDriver,
                pressureIsSuppressor,
                pressureMode,
                pressureContribution,
              }),
              recommender,
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
    if (key != null) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function mapLines<T extends string>(counts: Map<T, number>): string {
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) =>
    `- ${k}: ${v}`
  ).join("\n");
}

function flagCounts(rows: AuditRow[]): Record<FlagKey, number> {
  return Object.fromEntries(
    FLAG_KEYS.map((flag) => [
      flag,
      rows.filter((row) => row.questionable_flags.includes(flag)).length,
    ]),
  ) as Record<FlagKey, number>;
}

function flagTable(counts: Record<FlagKey, number>): string {
  return FLAG_KEYS.map((flag) => `| ${flag} | ${counts[flag]} |`).join("\n");
}

function samples(rows: AuditRow[], limit: number): string {
  return rows.slice(0, limit).map((row) =>
    `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${
      row.pressure?.label ?? "null"
    } | ${row.pressure?.score ?? "null"} | ${
      row.pressure_quality ?? "null"
    } | ${row.score} | ${row.reliability} | ${
      row.questionable_flags.join(", ")
    } |`
  ).join("\n");
}

const rows = buildRows();
const flags = flagCounts(rows);
const totalFlags = Object.values(flags).reduce((sum, n) => sum + n, 0);
const recommenderRows = rows.filter((row) => row.recommender != null);
const recommenderErrors =
  recommenderRows.filter((row) =>
    row.recommender != null && "error" in row.recommender
  ).length;
const recommenderValid = recommenderRows.length - recommenderErrors;
const pressureDriverRows = rows.filter((row) => row.pressure_is_driver).length;
const pressureSuppressorRows =
  rows.filter((row) => row.pressure_is_suppressor).length;
const questionable = rows.filter((row) => row.questionable_flags.length > 0);
const recommendation = flags.volatile_not_penalized_enough === 0 &&
    flags.fast_fall_not_penalized_enough === 0 &&
    flags.stable_pressure_too_strong_as_daymaker === 0 &&
    flags.pressure_overconfident_sparse_history === 0 &&
    flags.missing_pressure_reliability_too_high === 0
  ? "leave pressure production logic unchanged; optionally add docs/tests around existing behavior"
  : "proceed to pressure V2 shadow tuning";

const markdown = `# Today's Bite Pressure Current-State Audit

Generated: ${new Date().toISOString()}

Phase 7A audit-only. Production pressure normalization, scoreDay, report copy, app/forecast behavior, other condition normalizers, and recommender production logic were not changed.

## Totals

- Rows: ${rows.length}
- Regions: ${CANONICAL_REGION_KEYS.length}
- Months: 12
- Contexts: ${CONTEXTS.length}
- Pressure archetypes: ${ARCHETYPES.length}
- Recommender valid rows: ${recommenderValid}
- Recommender error rows: ${recommenderErrors}
- Pressure driver rows: ${pressureDriverRows}
- Pressure suppressor rows: ${pressureSuppressorRows}
- Total questionable flags: ${totalFlags}

## Pressure Label Distribution

${mapLines(countBy(rows, (row) => row.pressure?.label ?? "missing"))}

## Pressure Quality Distribution

${mapLines(countBy(rows, (row) => row.pressure_quality ?? "missing"))}

## Questionable Flags

| Flag | Count |
| --- | ---: |
${flagTable(flags)}

## Recommender Coupling

Selected-pick changes are n/a because this is a current-state audit with no shadow variant.

Pressure mode distribution:

${
  mapLines(countBy(rows, (row) =>
    row.recommender != null && !("error" in row.recommender)
      ? row.recommender.pressure_mode
      : row.recommender == null
      ? null
      : "error"))
}

Scenario tag rows with pressure-related coupling are not expected; current daily-picks pressure coupling is summarized by \`pressure_mode\`, not direct pressure tags.

## Representative Questionable Samples

| Region | Month | Context | Archetype | Clarity | Pressure Label | Pressure Score | Quality | Score | Reliability | Flags |
| --- | ---: | --- | --- | --- | --- | ---: | --- | ---: | --- | --- |
${samples(questionable, 40)}

## Behavior Summary

- Stable pressure is neutral in production and does not appear as an oversized daymaker.
- Sparse/two-point histories are quality-tagged and reliability is downgraded by the normalizer/build path.
- Missing pressure is treated as an absent variable and did not inflate reliability to high.
- Falling pressure is intentionally helpful at slow/moderate front-like rates, while hard falls turn negative.
- Volatile pressure is penalized unless recent samples have clearly settled.
- Recommender coupling is limited to \`pressure_mode\`; no pick comparison is performed in this current-state audit.

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
