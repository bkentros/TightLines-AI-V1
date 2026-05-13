#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 8A tide/current current-state audit.
 *
 * Audit-only. Production tide/current normalization, scoreDay, report copy,
 * app/forecast behavior, condition normalizers, and recommender production
 * logic/candidate pools/scoring/gates/selection are not modified.
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
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-tide-current-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-tide-current-audit.md";

const CONTEXTS = [
  "coastal",
  "coastal_flats_estuary",
] as const satisfies readonly EngineContext[];
const WATER_CLARITIES = ["clear", "stained"] as const;

const FLAG_KEYS = [
  "missing_tide_reliability_too_high",
  "stage_unknown_scored_positive",
  "slack_stage_overpenalized_in_flats",
  "slack_stage_not_penalized_in_inshore",
  "soft_current_not_helpful_enough",
  "optimal_current_not_helpful_enough",
  "strong_current_too_positive_for_flats",
  "strong_current_too_negative_for_inshore",
  "too_hard_current_not_penalized",
  "high_low_exchange_not_reflected",
  "weak_exchange_overrewarded",
  "conflicting_stage_current_not_handled",
  "tide_driver_with_near_zero_score",
  "tide_suppressor_with_near_zero_score",
  "tide_timing_window_missing_when_tide_data_present",
  "tide_timing_window_present_when_tide_missing",
] as const;
type FlagKey = typeof FLAG_KEYS[number];
type CoastalContext = typeof CONTEXTS[number];
type WaterClarity = typeof WATER_CLARITIES[number];

type TideEvent = { time: string; value: number; type?: string };
type TideInputs = {
  current_speed_knots_max: number | null;
  tide_movement_state: string | null;
  tide_high_low: TideEvent[] | null;
  tide_height_hourly_ft: number[] | null;
};
type TideArchetypeId =
  | "measured_slack"
  | "measured_soft_moving"
  | "measured_optimal_moving"
  | "measured_strong_moving"
  | "measured_too_hard"
  | "stage_incoming_only"
  | "stage_outgoing_only"
  | "stage_slack_only"
  | "stage_unknown"
  | "large_high_low_exchange"
  | "weak_high_low_exchange"
  | "many_same_day_exchanges"
  | "missing_tide"
  | "conflicting_stage_and_current"
  | "flats_soft_current"
  | "flats_too_much_current"
  | "inshore_stronger_current_ok"
  | "tide_times_without_current";

type TideArchetype = {
  id: TideArchetypeId;
  inputs: (month: number) => TideInputs;
};

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
type TimingSnapshot = {
  daypart_preset: string | null;
  timing_strength: string | null;
  highlighted_periods: [boolean, boolean, boolean, boolean] | null;
  anchor_driver: string | null;
  primary_driver: string | null;
  primary_qualified: boolean | null;
  fallback_used: boolean | null;
  tide_window_present: boolean;
};
type RecommenderApplicability = {
  status: "not_applicable";
  reason: string;
};

type AuditRow = {
  region: RegionKey;
  month: number;
  context: CoastalContext;
  archetype: TideArchetypeId;
  water_clarity: WaterClarity;
  tide_inputs: TideInputs;
  tide_current_movement: VariableSnapshot;
  score: number;
  band: string;
  activity_tier: string;
  reliability: string;
  available_variables: string[];
  missing_variables: string[];
  data_gaps: unknown[];
  tide_is_driver: boolean;
  tide_is_suppressor: boolean;
  tide_contribution: ContributionSnapshot | null;
  timing: TimingSnapshot;
  questionable_flags: FlagKey[];
  recommender: RecommenderApplicability;
};

function tideEvents(
  month: number,
  values: Array<{ hour: string; value: number; type?: string }>,
): TideEvent[] {
  const m = String(month).padStart(2, "0");
  return values.map((event) => ({
    time: `2026-${m}-15T${event.hour}:00`,
    value: event.value,
    ...(event.type ? { type: event.type } : {}),
  }));
}

function noMeasured(inputs: Partial<TideInputs> = {}): TideInputs {
  return {
    current_speed_knots_max: null,
    tide_movement_state: null,
    tide_high_low: null,
    tide_height_hourly_ft: null,
    ...inputs,
  };
}

const ARCHETYPES: readonly TideArchetype[] = [
  {
    id: "measured_slack",
    inputs: () => noMeasured({ current_speed_knots_max: 0.12 }),
  },
  {
    id: "measured_soft_moving",
    inputs: () => noMeasured({ current_speed_knots_max: 0.65 }),
  },
  {
    id: "measured_optimal_moving",
    inputs: () => noMeasured({ current_speed_knots_max: 1.35 }),
  },
  {
    id: "measured_strong_moving",
    inputs: () => noMeasured({ current_speed_knots_max: 2.0 }),
  },
  {
    id: "measured_too_hard",
    inputs: () => noMeasured({ current_speed_knots_max: 3.2 }),
  },
  {
    id: "stage_incoming_only",
    inputs: () => noMeasured({ tide_movement_state: "incoming" }),
  },
  {
    id: "stage_outgoing_only",
    inputs: () => noMeasured({ tide_movement_state: "outgoing" }),
  },
  {
    id: "stage_slack_only",
    inputs: () => noMeasured({ tide_movement_state: "slack" }),
  },
  {
    id: "stage_unknown",
    inputs: () => noMeasured({ tide_movement_state: "unknown" }),
  },
  {
    id: "large_high_low_exchange",
    inputs: (month) =>
      noMeasured({
        tide_high_low: tideEvents(month, [
          { hour: "04:45", value: 0.1, type: "L" },
          { hour: "11:15", value: 3.5, type: "H" },
          { hour: "18:00", value: 0.2, type: "L" },
        ]),
      }),
  },
  {
    id: "weak_high_low_exchange",
    inputs: (month) =>
      noMeasured({
        tide_high_low: tideEvents(month, [
          { hour: "05:00", value: 1.0, type: "L" },
          { hour: "11:20", value: 1.35, type: "H" },
          { hour: "18:10", value: 1.05, type: "L" },
        ]),
      }),
  },
  {
    id: "many_same_day_exchanges",
    inputs: (month) =>
      noMeasured({
        tide_high_low: tideEvents(month, [
          { hour: "01:00", value: 0.2, type: "L" },
          { hour: "06:40", value: 2.4, type: "H" },
          { hour: "12:20", value: 0.1, type: "L" },
          { hour: "18:15", value: 2.8, type: "H" },
          { hour: "23:50", value: 0.4, type: "L" },
        ]),
      }),
  },
  { id: "missing_tide", inputs: () => noMeasured() },
  {
    id: "conflicting_stage_and_current",
    inputs: () =>
      noMeasured({
        current_speed_knots_max: 1.4,
        tide_movement_state: "slack",
      }),
  },
  {
    id: "flats_soft_current",
    inputs: () => noMeasured({ current_speed_knots_max: 0.55 }),
  },
  {
    id: "flats_too_much_current",
    inputs: () => noMeasured({ current_speed_knots_max: 2.4 }),
  },
  {
    id: "inshore_stronger_current_ok",
    inputs: () => noMeasured({ current_speed_knots_max: 2.2 }),
  },
  {
    id: "tide_times_without_current",
    inputs: (month) =>
      noMeasured({
        tide_high_low: tideEvents(month, [
          { hour: "03:45", value: 0.3, type: "L" },
          { hour: "09:45", value: 2.3, type: "H" },
          { hour: "16:10", value: 0.4, type: "L" },
        ]),
      }),
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

function buildRequest(
  region: RegionKey,
  month: number,
  context: CoastalContext,
  archetype: TideArchetype,
): SharedEngineRequest {
  const meta = REGION_META[region];
  const localDate = `2026-${String(month).padStart(2, "0")}-15`;
  const mean = seasonallyReasonableMean(region, month);
  const tideInputs = archetype.inputs(month);
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
      daily_low_air_temp_f: mean - 5,
      daily_high_air_temp_f: mean + 7,
      prior_day_mean_air_temp_f: mean,
      day_minus_2_mean_air_temp_f: mean,
      pressure_mb: 1014,
      pressure_history_mb: Array.from(
        { length: 24 },
        (_, index) => 1014 + index * 0.005,
      ),
      wind_speed_mph: 8,
      cloud_cover_pct: 55,
      precip_rate_now_in_per_hr: 0,
      active_precip_now: false,
      precip_24h_in: 0.02,
      precip_72h_in: 0.05,
      precip_7d_in: 0.10,
      tide_movement_state: tideInputs.tide_movement_state,
      current_speed_knots_max: tideInputs.current_speed_knots_max,
      tide_high_low: tideInputs.tide_high_low,
      tide_height_hourly_ft: tideInputs.tide_height_hourly_ft,
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

function hasTideInput(inputs: TideInputs): boolean {
  return inputs.current_speed_knots_max != null ||
    inputs.tide_movement_state != null ||
    (inputs.tide_high_low?.length ?? 0) > 0 ||
    (inputs.tide_height_hourly_ft?.length ?? 0) > 0;
}

function hasTideClockData(inputs: TideInputs): boolean {
  return (inputs.tide_high_low?.length ?? 0) >= 2 ||
    (inputs.tide_height_hourly_ft?.length ?? 0) >= 4;
}

function hasTideTiming(
  report: ReturnType<typeof runHowFishingReport>,
): boolean {
  return report.timing_debug?.anchor_driver === "tide_exchange_window" ||
    (report.timing_debug?.primary_driver === "tide_exchange_window" &&
      report.timing_debug?.primary_qualified === true &&
      report.timing_debug?.fallback_used !== true);
}

function timingSnapshot(
  report: ReturnType<typeof runHowFishingReport>,
): TimingSnapshot {
  return {
    daypart_preset: report.daypart_preset ?? null,
    timing_strength: report.timing_strength ?? null,
    highlighted_periods: report.highlighted_periods ?? null,
    anchor_driver: report.timing_debug?.anchor_driver ?? null,
    primary_driver: report.timing_debug?.primary_driver ?? null,
    primary_qualified: report.timing_debug?.primary_qualified ?? null,
    fallback_used: report.timing_debug?.fallback_used ?? null,
    tide_window_present: hasTideTiming(report),
  };
}

function addFlag(flags: Set<FlagKey>, flag: FlagKey, when: boolean): void {
  if (when) flags.add(flag);
}

function isFlats(context: CoastalContext): boolean {
  return context === "coastal_flats_estuary";
}

function questionableFlags(args: {
  archetype: TideArchetypeId;
  context: CoastalContext;
  tide: VariableSnapshot;
  inputs: TideInputs;
  reliability: string;
  missing: string[];
  tideIsDriver: boolean;
  tideIsSuppressor: boolean;
  report: ReturnType<typeof runHowFishingReport>;
}): FlagKey[] {
  const flags = new Set<FlagKey>();
  const score = args.tide?.score ?? null;
  const absScore = Math.abs(score ?? 0);
  const tidePresent = args.tide != null;
  const tideDataPresent = hasTideInput(args.inputs);
  const tideClockDataPresent = hasTideClockData(args.inputs);
  const tideTiming = hasTideTiming(args.report);
  const current = args.inputs.current_speed_knots_max;

  addFlag(
    flags,
    "missing_tide_reliability_too_high",
    args.missing.includes("tide_current_movement") &&
      args.reliability === "high",
  );
  addFlag(
    flags,
    "stage_unknown_scored_positive",
    args.archetype === "stage_unknown" && (score ?? 0) > 0,
  );
  addFlag(
    flags,
    "slack_stage_overpenalized_in_flats",
    isFlats(args.context) && args.archetype === "stage_slack_only" &&
      (score ?? 0) < -0.35,
  );
  addFlag(
    flags,
    "slack_stage_not_penalized_in_inshore",
    !isFlats(args.context) && args.archetype === "stage_slack_only" &&
      (score ?? 0) > -0.5,
  );
  addFlag(
    flags,
    "soft_current_not_helpful_enough",
    (args.archetype === "measured_soft_moving" ||
      args.archetype === "flats_soft_current") &&
      (score ?? 0) < 0.2,
  );
  addFlag(
    flags,
    "optimal_current_not_helpful_enough",
    args.archetype === "measured_optimal_moving" && (score ?? 0) < 0.8,
  );
  addFlag(
    flags,
    "strong_current_too_positive_for_flats",
    isFlats(args.context) &&
      (args.archetype === "measured_strong_moving" ||
        args.archetype === "flats_too_much_current" ||
        args.archetype === "inshore_stronger_current_ok") &&
      (score ?? 0) > 0.8,
  );
  addFlag(
    flags,
    "strong_current_too_negative_for_inshore",
    !isFlats(args.context) &&
      (args.archetype === "measured_strong_moving" ||
        args.archetype === "inshore_stronger_current_ok") &&
      (score ?? 0) < 0.5,
  );
  addFlag(
    flags,
    "too_hard_current_not_penalized",
    (args.archetype === "measured_too_hard" ||
      (args.archetype === "flats_too_much_current" && isFlats(args.context)) ||
      (current != null && current >= (isFlats(args.context) ? 2.0 : 2.8))) &&
      (score ?? 0) > -0.3,
  );
  addFlag(
    flags,
    "high_low_exchange_not_reflected",
    (args.archetype === "large_high_low_exchange" ||
      args.archetype === "many_same_day_exchanges" ||
      args.archetype === "tide_times_without_current") &&
      (!tidePresent || (score ?? 0) < 0.7),
  );
  addFlag(
    flags,
    "weak_exchange_overrewarded",
    args.archetype === "weak_high_low_exchange" && (score ?? 0) > 0.6,
  );
  addFlag(
    flags,
    "conflicting_stage_current_not_handled",
    args.archetype === "conflicting_stage_and_current" &&
      args.tide?.label === "slack",
  );
  addFlag(
    flags,
    "tide_driver_with_near_zero_score",
    args.tideIsDriver && absScore < 0.15,
  );
  addFlag(
    flags,
    "tide_suppressor_with_near_zero_score",
    args.tideIsSuppressor && absScore < 0.15,
  );
  addFlag(
    flags,
    "tide_timing_window_missing_when_tide_data_present",
    tideClockDataPresent && tidePresent && (score ?? 0) >= 0.7 &&
      !tideTiming,
  );
  addFlag(
    flags,
    "tide_timing_window_present_when_tide_missing",
    !tideDataPresent && tideTiming,
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
          const report = runHowFishingReport(req);
          const tide = variableSnapshot(norm.normalized.tide_current_movement);
          const drivers = scored.drivers.map(contributionSnapshot);
          const suppressors = scored.suppressors.map(contributionSnapshot);
          const tideContribution = [...drivers, ...suppressors].find((c) =>
            c.key === "tide_current_movement"
          ) ?? null;
          const tideIsDriver = drivers.some((c) =>
            c.key === "tide_current_movement"
          );
          const tideIsSuppressor = suppressors.some((c) =>
            c.key === "tide_current_movement"
          );
          const tideInputs = archetype.inputs(month);
          for (const waterClarity of WATER_CLARITIES) {
            rows.push({
              region,
              month,
              context,
              archetype: archetype.id,
              water_clarity: waterClarity,
              tide_inputs: tideInputs,
              tide_current_movement: tide,
              score: scored.score,
              band: scored.band,
              activity_tier: compositeScoreActivityTier(scored.score),
              reliability: norm.reliability,
              available_variables: norm.available_variables,
              missing_variables: norm.missing_variables,
              data_gaps: norm.data_gaps,
              tide_is_driver: tideIsDriver,
              tide_is_suppressor: tideIsSuppressor,
              tide_contribution: tideContribution,
              timing: timingSnapshot(report),
              questionable_flags: questionableFlags({
                archetype: archetype.id,
                context,
                tide,
                inputs: tideInputs,
                reliability: norm.reliability,
                missing: norm.missing_variables,
                tideIsDriver,
                tideIsSuppressor,
                report,
              }),
              recommender: {
                status: "not_applicable",
                reason:
                  "Phase 8A scope is coastal/flats only; current daily-picks audit harness is not invoked for these contexts.",
              },
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

function scoreByArchetype(rows: AuditRow[]): string {
  const byKey = new Map<string, number[]>();
  for (const row of rows) {
    const key = row.archetype;
    const scores = byKey.get(key) ?? [];
    scores.push(row.score);
    byKey.set(key, scores);
  }
  return [...byKey.entries()].map(([key, scores]) => {
    const avg = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    return `| ${key} | ${avg.toFixed(1)} | ${min} | ${max} |`;
  }).join("\n");
}

function contextPolicySummary(rows: AuditRow[]): string {
  const archetypes = [
    "measured_slack",
    "measured_soft_moving",
    "measured_optimal_moving",
    "measured_strong_moving",
    "measured_too_hard",
    "stage_slack_only",
    "stage_incoming_only",
    "large_high_low_exchange",
  ] as const satisfies readonly TideArchetypeId[];
  const uniqueRows = rows.filter((row) =>
    row.region === "florida" && row.month === 6 &&
    row.water_clarity === "clear" &&
    (archetypes as readonly TideArchetypeId[]).includes(row.archetype)
  );
  return uniqueRows.map((row) =>
    `| ${row.context} | ${row.archetype} | ${
      row.tide_current_movement?.label ?? "null"
    } | ${row.tide_current_movement?.score ?? "null"} |`
  ).join("\n");
}

function samples(rows: AuditRow[], limit: number): string {
  return rows.slice(0, limit).map((row) =>
    `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${
      row.tide_current_movement?.label ?? "null"
    } | ${
      row.tide_current_movement?.score ?? "null"
    } | ${row.score} | ${row.reliability} | ${
      row.timing.anchor_driver ?? "null"
    } | ${row.questionable_flags.join(", ")} |`
  ).join("\n");
}

const rows = buildRows();
const flags = flagCounts(rows);
const totalFlags = Object.values(flags).reduce((sum, n) => sum + n, 0);
const questionable = rows.filter((row) => row.questionable_flags.length > 0);
const driverRows = rows.filter((row) => row.tide_is_driver).length;
const suppressorRows = rows.filter((row) => row.tide_is_suppressor).length;
const timingTideRows =
  rows.filter((row) => row.timing.tide_window_present).length;
const recommendation = flags.too_hard_current_not_penalized > 0 ||
    flags.strong_current_too_positive_for_flats > 0 ||
    flags.strong_current_too_negative_for_inshore > 0 ||
    flags.high_low_exchange_not_reflected > 0 ||
    flags.tide_timing_window_missing_when_tide_data_present > 0
  ? "proceed to Tide/Current V2 shadow tuning"
  : "leave tide/current production logic unchanged; optionally add focused tests/docs around existing behavior";

const markdown = `# Today's Bite Tide/Current Current-State Audit

Generated: ${new Date().toISOString()}

Phase 8A audit-only. Production tide/current normalization, scoreDay, report copy, app/forecast behavior, other condition normalizers, and recommender production logic were not changed.

## Totals

- Rows: ${rows.length}
- Regions: ${CANONICAL_REGION_KEYS.length}
- Months: 12
- Contexts: ${CONTEXTS.length} (${CONTEXTS.join(", ")})
- Water clarity variants: ${WATER_CLARITIES.length} (${
  WATER_CLARITIES.join(", ")
})
- Tide/current archetypes: ${ARCHETYPES.length}
- Tide driver rows: ${driverRows}
- Tide suppressor rows: ${suppressorRows}
- Timing rows with qualified tide exchange timing: ${timingTideRows}
- Recommender rows: not_applicable (${rows.length}); Phase 8A covers coastal/flats only and does not invoke the freshwater daily-picks harness.
- Total questionable flags: ${totalFlags}

## Tide Label Distribution

${
  mapLines(
    countBy(rows, (row) => row.tide_current_movement?.label ?? "missing"),
  )
}

## Reliability Distribution

${mapLines(countBy(rows, (row) => row.reliability))}

## Timing Anchor Distribution

${mapLines(countBy(rows, (row) => row.timing.anchor_driver ?? "missing"))}

## Questionable Flags

| Flag | Count |
| --- | ---: |
${flagTable(flags)}

## Score Distribution By Archetype

| Archetype | Avg score | Min | Max |
| --- | ---: | ---: | ---: |
${scoreByArchetype(rows)}

## Flats/Estuary Vs Inshore Snapshot

Single-region/month snapshot (Florida, June, clear water) to show the active policy differences:

| Context | Archetype | Tide label | Tide score |
| --- | --- | --- | ---: |
${contextPolicySummary(rows)}

## Recommender Applicability / Coupling

Daily-picks coupling is explicitly recorded as \`not_applicable\` for every row. The current Phase 8A matrix only covers \`coastal\` and \`coastal_flats_estuary\`, while the existing audit harnesses used for daily-picks protection are freshwater lake/pond and river rows. No recommender candidate pools, scenario tags, gates, scoring, catalog data, or pick selection were invoked or changed.

## Representative Questionable Samples

| Region | Month | Context | Archetype | Clarity | Tide Label | Tide Score | Score | Reliability | Timing Anchor | Flags |
| --- | ---: | --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
${samples(questionable, 40)}

## Behavior Summary

- Measured current speed is the dominant source when present; stage conflicts are ignored in favor of measured current.
- Inshore is much less tolerant of slack water than flats/estuary, while flats softens slack and peaks earlier as current strengthens.
- High/low event data is reflected through either a 3-hour movement proxy or adjacent exchange range when measured current is absent.
- Stage-only incoming/outgoing data creates modest positive movement; unknown stage returns missing/null.
- Missing tide data downgrades coastal reliability through the shared normalization path.
- Tide timing uses \`tide_exchange_window\` only when that timing driver qualifies; missing/weak tide data falls back to neutral, light, or heat timing rather than claiming a tide window.

## Recommendation

**${recommendation}**

Primary reasons to consider V2 shadow tuning are any high-current penalty/tolerance flags, high/low exchange reflection flags, and timing-window mismatch flags surfaced above. This artifact does not make production changes.

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
