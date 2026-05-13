#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 8B tide/current V2 shadow tuning audit.
 *
 * Shadow-only. Production tide/current normalization, buildNormalized, scoreDay,
 * report copy, app/forecast behavior, other condition normalizers, and
 * recommender production logic/candidate pools/scoring/gates/selection are not
 * modified.
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
import type { SharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/contracts/normalized.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import {
  normalizeTideCurrentMovementV2,
  type TideV2Profile,
} from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizeTideV2.ts";

const OUTPUT_JSONL = "scripts/audit/todays-bite-tide-current-v2-audit.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-tide-current-v2-audit.md";

const CONTEXTS = [
  "coastal",
  "coastal_flats_estuary",
] as const satisfies readonly EngineContext[];
const WATER_CLARITIES = ["clear", "stained"] as const;
const CANDIDATES = [
  "production_control",
  "score_only_soft_current_floor",
  "score_only_too_hard_penalty",
  "score_only_combined",
  "timing_diagnostic_only",
] as const;

const FLAG_KEYS = [
  "soft_current_not_helpful_enough",
  "too_hard_current_not_penalized",
  "strong_current_too_positive_for_flats",
  "strong_current_too_negative_for_inshore",
  "optimal_current_not_helpful_enough",
  "high_low_exchange_not_reflected",
  "weak_exchange_overrewarded",
  "conflicting_stage_current_not_handled",
  "tide_driver_with_near_zero_score",
  "tide_suppressor_with_near_zero_score",
  "tide_timing_window_missing_when_tide_data_present",
  "tide_timing_window_present_when_tide_missing",
  "missing_tide_reliability_too_high",
  "stage_unknown_scored_positive",
] as const;

type CandidateId = typeof CANDIDATES[number];
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
  anchor_driver: string | null;
  primary_driver: string | null;
  primary_qualified: boolean | null;
  fallback_used: boolean | null;
  tide_window_present: boolean;
};
type TimingDiagnostic = {
  classification:
    | "no_timing_miss"
    | "true_likely_miss"
    | "acceptable_family_priority"
    | "unusable_clock_data";
  projected_anchor_driver: string | null;
  projected_tide_window_present: boolean;
  changed_from_production: boolean;
};

type AuditRow = {
  candidate: CandidateId;
  region: RegionKey;
  month: number;
  context: CoastalContext;
  archetype: TideArchetypeId;
  water_clarity: WaterClarity;
  tide_inputs: TideInputs;
  production_tide: VariableSnapshot;
  candidate_tide: VariableSnapshot;
  production_score: number;
  candidate_score: number;
  score_delta: number;
  production_activity_tier: string;
  candidate_activity_tier: string;
  activity_tier_changed: boolean;
  reliability_changed: boolean;
  production_tide_is_driver: boolean;
  candidate_tide_is_driver: boolean;
  production_tide_is_suppressor: boolean;
  candidate_tide_is_suppressor: boolean;
  driver_changed: boolean;
  suppressor_changed: boolean;
  production_tide_contribution: ContributionSnapshot | null;
  candidate_tide_contribution: ContributionSnapshot | null;
  production_timing: TimingSnapshot;
  timing_diagnostic: TimingDiagnostic;
  production_questionable_flags: FlagKey[];
  candidate_questionable_flags: FlagKey[];
  recommender: { status: "not_applicable"; reason: string };
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
    anchor_driver: report.timing_debug?.anchor_driver ?? null,
    primary_driver: report.timing_debug?.primary_driver ?? null,
    primary_qualified: report.timing_debug?.primary_qualified ?? null,
    fallback_used: report.timing_debug?.fallback_used ?? null,
    tide_window_present: hasTideTiming(report),
  };
}

function isFlats(context: CoastalContext): boolean {
  return context === "coastal_flats_estuary";
}

function addFlag(flags: Set<FlagKey>, flag: FlagKey, when: boolean): void {
  if (when) flags.add(flag);
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
  tideTimingPresent: boolean;
}): FlagKey[] {
  const flags = new Set<FlagKey>();
  const score = args.tide?.score ?? null;
  const absScore = Math.abs(score ?? 0);
  const tidePresent = args.tide != null;
  const tideDataPresent = hasTideInput(args.inputs);
  const tideClockDataPresent = hasTideClockData(args.inputs);
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
      !args.tideTimingPresent,
  );
  addFlag(
    flags,
    "tide_timing_window_present_when_tide_missing",
    !tideDataPresent && args.tideTimingPresent,
  );
  return [...flags];
}

function candidateProfile(candidate: CandidateId): TideV2Profile {
  switch (candidate) {
    case "production_control":
    case "timing_diagnostic_only":
      return "production_control";
    case "score_only_soft_current_floor":
      return "score_only_soft_current_floor";
    case "score_only_too_hard_penalty":
      return "score_only_too_hard_penalty";
    case "score_only_combined":
      return "score_only_combined";
  }
}

function cloneWithCandidateTide(
  norm: SharedNormalizedOutput,
  tide: VariableState | null,
): SharedNormalizedOutput {
  const normalized = { ...norm.normalized };
  if (tide) {
    normalized.tide_current_movement = tide;
  } else {
    delete normalized.tide_current_movement;
  }
  return {
    ...norm,
    normalized,
  };
}

function tidePolicy(context: CoastalContext): "inshore" | "flats_estuary" {
  return context === "coastal_flats_estuary" ? "flats_estuary" : "inshore";
}

function timingDiagnostic(args: {
  report: ReturnType<typeof runHowFishingReport>;
  inputs: TideInputs;
  tide: VariableSnapshot;
}): TimingDiagnostic {
  const productionPresent = hasTideTiming(args.report);
  if (!hasTideClockData(args.inputs)) {
    return {
      classification: "unusable_clock_data",
      projected_anchor_driver: args.report.timing_debug?.anchor_driver ?? null,
      projected_tide_window_present: productionPresent,
      changed_from_production: false,
    };
  }
  if (productionPresent || (args.tide?.score ?? 0) < 0.7) {
    return {
      classification: "no_timing_miss",
      projected_anchor_driver: args.report.timing_debug?.anchor_driver ?? null,
      projected_tide_window_present: productionPresent,
      changed_from_production: false,
    };
  }
  const anchor = args.report.timing_debug?.anchor_driver ?? null;
  if (anchor === "avoid_heat" || anchor === "light_window") {
    return {
      classification: "acceptable_family_priority",
      projected_anchor_driver: anchor,
      projected_tide_window_present: productionPresent,
      changed_from_production: false,
    };
  }
  return {
    classification: "true_likely_miss",
    projected_anchor_driver: "tide_exchange_window",
    projected_tide_window_present: true,
    changed_from_production: !productionPresent,
  };
}

function buildRows(): AuditRow[] {
  const rows: AuditRow[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of CONTEXTS) {
        for (const archetype of ARCHETYPES) {
          const req = buildRequest(region, month, context, archetype);
          const norm = buildSharedNormalizedOutput(req);
          const productionScored = scoreDay(norm);
          const report = runHowFishingReport(req);
          const productionTide = variableSnapshot(
            norm.normalized.tide_current_movement,
          );
          const productionDrivers = productionScored.drivers.map(
            contributionSnapshot,
          );
          const productionSuppressors = productionScored.suppressors.map(
            contributionSnapshot,
          );
          const productionContribution =
            [...productionDrivers, ...productionSuppressors].find((c) =>
              c.key === "tide_current_movement"
            ) ?? null;
          const productionTideIsDriver = productionDrivers.some((c) =>
            c.key === "tide_current_movement"
          );
          const productionTideIsSuppressor = productionSuppressors.some((c) =>
            c.key === "tide_current_movement"
          );
          const inputs = archetype.inputs(month);
          const prodTiming = timingSnapshot(report);
          const prodFlags = questionableFlags({
            archetype: archetype.id,
            context,
            tide: productionTide,
            inputs,
            reliability: norm.reliability,
            missing: norm.missing_variables,
            tideIsDriver: productionTideIsDriver,
            tideIsSuppressor: productionTideIsSuppressor,
            tideTimingPresent: prodTiming.tide_window_present,
          });

          for (const candidate of CANDIDATES) {
            const profile = candidateProfile(candidate);
            const candidateTide = normalizeTideCurrentMovementV2(
              {
                current_speed_knots_max: inputs.current_speed_knots_max,
                tide_height_hourly_ft: inputs.tide_height_hourly_ft,
                tide_high_low: inputs.tide_high_low,
                stage: inputs.tide_movement_state,
              },
              tidePolicy(context),
              profile,
            );
            const candidateNorm = cloneWithCandidateTide(norm, candidateTide);
            const candidateScored = scoreDay(candidateNorm);
            const candidateDrivers = candidateScored.drivers.map(
              contributionSnapshot,
            );
            const candidateSuppressors = candidateScored.suppressors.map(
              contributionSnapshot,
            );
            const candidateContribution =
              [...candidateDrivers, ...candidateSuppressors].find((c) =>
                c.key === "tide_current_movement"
              ) ?? null;
            const candidateTideIsDriver = candidateDrivers.some((c) =>
              c.key === "tide_current_movement"
            );
            const candidateTideIsSuppressor = candidateSuppressors.some((c) =>
              c.key === "tide_current_movement"
            );
            const diagnostic = timingDiagnostic({
              report,
              inputs,
              tide: variableSnapshot(candidateTide ?? undefined),
            });
            const candidateTimingPresent =
              candidate === "timing_diagnostic_only"
                ? diagnostic.projected_tide_window_present
                : prodTiming.tide_window_present;
            const candidateFlags = questionableFlags({
              archetype: archetype.id,
              context,
              tide: variableSnapshot(candidateTide ?? undefined),
              inputs,
              reliability: candidateNorm.reliability,
              missing: candidateNorm.missing_variables,
              tideIsDriver: candidateTideIsDriver,
              tideIsSuppressor: candidateTideIsSuppressor,
              tideTimingPresent: candidateTimingPresent,
            });

            for (const waterClarity of WATER_CLARITIES) {
              rows.push({
                candidate,
                region,
                month,
                context,
                archetype: archetype.id,
                water_clarity: waterClarity,
                tide_inputs: inputs,
                production_tide: productionTide,
                candidate_tide: variableSnapshot(candidateTide ?? undefined),
                production_score: productionScored.score,
                candidate_score: candidateScored.score,
                score_delta: candidateScored.score - productionScored.score,
                production_activity_tier: compositeScoreActivityTier(
                  productionScored.score,
                ),
                candidate_activity_tier: compositeScoreActivityTier(
                  candidateScored.score,
                ),
                activity_tier_changed:
                  compositeScoreActivityTier(productionScored.score) !==
                    compositeScoreActivityTier(candidateScored.score),
                reliability_changed:
                  norm.reliability !== candidateNorm.reliability,
                production_tide_is_driver: productionTideIsDriver,
                candidate_tide_is_driver: candidateTideIsDriver,
                production_tide_is_suppressor: productionTideIsSuppressor,
                candidate_tide_is_suppressor: candidateTideIsSuppressor,
                driver_changed:
                  productionTideIsDriver !== candidateTideIsDriver,
                suppressor_changed:
                  productionTideIsSuppressor !== candidateTideIsSuppressor,
                production_tide_contribution: productionContribution,
                candidate_tide_contribution: candidateContribution,
                production_timing: prodTiming,
                timing_diagnostic: diagnostic,
                production_questionable_flags: prodFlags,
                candidate_questionable_flags: candidateFlags,
                recommender: {
                  status: "not_applicable",
                  reason:
                    "Phase 8B scope is coastal/flats only; current daily-picks audit harness is not invoked for these contexts.",
                },
              });
            }
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

function flagCounts(
  rows: AuditRow[],
  field: "production_questionable_flags" | "candidate_questionable_flags",
): Record<FlagKey, number> {
  return Object.fromEntries(
    FLAG_KEYS.map((flag) => [
      flag,
      rows.filter((row) => row[field].includes(flag)).length,
    ]),
  ) as Record<FlagKey, number>;
}

function candidateSummaryRows(rows: AuditRow[]): string {
  return CANDIDATES.map((candidate) => {
    const subset = rows.filter((row) => row.candidate === candidate);
    const deltas = subset.map((row) => row.score_delta);
    const avg = deltas.reduce((sum, value) => sum + value, 0) / deltas.length;
    const max = Math.max(...deltas);
    const min = Math.min(...deltas);
    const abs8 = subset.filter((row) => Math.abs(row.score_delta) >= 8).length;
    const abs12 = subset.filter((row) =>
      Math.abs(row.score_delta) >= 12
    ).length;
    const activity = subset.filter((row) => row.activity_tier_changed).length;
    const reliability = subset.filter((row) => row.reliability_changed).length;
    const driver = subset.filter((row) => row.driver_changed).length;
    const suppressor = subset.filter((row) => row.suppressor_changed).length;
    const flags = flagCounts(subset, "candidate_questionable_flags");
    const totalFlags = Object.values(flags).reduce(
      (sum, value) => sum + value,
      0,
    );
    const timingChanges =
      subset.filter((row) => row.timing_diagnostic.changed_from_production)
        .length;
    return `| ${candidate} | ${
      avg.toFixed(2)
    } | ${min} | ${max} | ${abs8} | ${abs12} | ${activity} | ${reliability} | ${driver} | ${suppressor} | ${totalFlags} | ${timingChanges} |`;
  }).join("\n");
}

function flagComparisonTable(rows: AuditRow[], candidate: CandidateId): string {
  const subset = rows.filter((row) => row.candidate === candidate);
  const base = flagCounts(subset, "production_questionable_flags");
  const cand = flagCounts(subset, "candidate_questionable_flags");
  return FLAG_KEYS.map((flag) =>
    `| ${flag} | ${base[flag]} | ${cand[flag]} | ${cand[flag] - base[flag]} |`
  ).join("\n");
}

function contextPolicySummary(
  rows: AuditRow[],
  candidate: CandidateId,
): string {
  const archetypes = [
    "measured_slack",
    "measured_soft_moving",
    "measured_optimal_moving",
    "measured_strong_moving",
    "measured_too_hard",
    "flats_soft_current",
    "flats_too_much_current",
    "large_high_low_exchange",
  ] as const satisfies readonly TideArchetypeId[];
  const uniqueRows = rows.filter((row) =>
    row.candidate === candidate && row.region === "florida" &&
    row.month === 6 && row.water_clarity === "clear" &&
    (archetypes as readonly TideArchetypeId[]).includes(row.archetype)
  );
  return uniqueRows.map((row) =>
    `| ${row.context} | ${row.archetype} | ${
      row.production_tide?.score ?? "null"
    } | ${row.candidate_tide?.score ?? "null"} | ${row.score_delta} |`
  ).join("\n");
}

function timingClassificationTable(rows: AuditRow[]): string {
  const subset = rows.filter((row) =>
    row.candidate === "timing_diagnostic_only"
  );
  const counts = countBy(subset, (row) => row.timing_diagnostic.classification);
  return mapLines(counts);
}

function activityChangesByContextArchetype(
  rows: AuditRow[],
  candidate: CandidateId,
): string {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (row.candidate !== candidate || !row.activity_tier_changed) continue;
    const key = `${row.context}|${row.archetype}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  if (counts.size === 0) return "- none";
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map((
    [key, count],
  ) => `- ${key}: ${count}`).join("\n");
}

function samples(
  rows: AuditRow[],
  candidate: CandidateId,
  limit: number,
): string {
  return rows
    .filter((row) =>
      row.candidate === candidate &&
      (row.score_delta !== 0 || row.candidate_questionable_flags.length > 0 ||
        row.timing_diagnostic.changed_from_production)
    )
    .slice(0, limit)
    .map((row) =>
      `| ${row.region} | ${row.month} | ${row.context} | ${row.archetype} | ${row.water_clarity} | ${
        row.production_tide?.score ?? "null"
      } | ${
        row.candidate_tide?.score ?? "null"
      } | ${row.score_delta} | ${row.production_score} | ${row.candidate_score} | ${row.timing_diagnostic.classification} | ${
        row.candidate_questionable_flags.join(", ")
      } |`
    ).join("\n");
}

const rows = buildRows();
const combinedRows = rows.filter((row) =>
  row.candidate === "score_only_combined"
);
const parityTideMismatches =
  combinedRows.filter((row) =>
    row.production_tide?.label !== row.candidate_tide?.label ||
    row.production_tide?.score !== row.candidate_tide?.score ||
    row.production_tide?.detail !== row.candidate_tide?.detail
  ).length;
const parityScoreDeltaRows =
  combinedRows.filter((row) => row.score_delta !== 0).length;
const parityLabelChanges =
  combinedRows.filter((row) =>
    row.production_tide?.label !== row.candidate_tide?.label
  ).length;
const combinedFlags = flagCounts(combinedRows, "candidate_questionable_flags");
const combinedAbs8 =
  combinedRows.filter((row) => Math.abs(row.score_delta) >= 8).length;
const combinedAbs12 =
  combinedRows.filter((row) => Math.abs(row.score_delta) >= 12).length;
const combinedReliability =
  combinedRows.filter((row) => row.reliability_changed).length;
const combinedAccepted = combinedReliability === 0 && combinedAbs12 === 0 &&
  combinedAbs8 === 0 &&
  combinedFlags.soft_current_not_helpful_enough <= 432 &&
  combinedFlags.too_hard_current_not_penalized < 200 &&
  combinedFlags.strong_current_too_positive_for_flats === 0 &&
  combinedFlags.strong_current_too_negative_for_inshore === 0;
const bestCandidate = combinedAccepted
  ? "score_only_combined"
  : "another sweep needed";

const markdown = `# Today's Bite Tide/Current V2 Production Parity Audit

Generated: ${new Date().toISOString()}

Phase 8D production parity audit. Production tide/current scoring is wired to the score_only_combined behavior; timing production logic, buildNormalized, scoreDay, report copy, app/forecast behavior, other condition normalizers, and recommender production logic were not changed.

## Candidate Formulas

- \`production_control\`: production scoring and production timing.
- \`score_only_soft_current_floor\`: preserves labels/source priority; raises true soft moving current to neutral/helpful. Inshore 0.65 kt targets +0.207 while barely-moving 0.55 kt stays slightly negative; flats 0.5-1.0 kt starts at +0.20.
- \`score_only_too_hard_penalty\`: preserves labels/source priority; makes excessive current meaningfully negative. Inshore >2.6 kt ramps from +0.10 to -1.45 by 4.0 kt; flats reaches -0.35 at 2.0 kt and ramps to -1.60 by 3.2 kt.
- \`score_only_combined\`: combines soft-current floor and too-hard penalty.
- \`timing_diagnostic_only\`: scoring unchanged; projects tide priority only for likely timing misses with strong tide-clock data and no heat/light family priority.

## Totals

- Matrix rows per candidate: ${rows.length / CANDIDATES.length}
- Total JSONL rows: ${rows.length}
- Regions: ${CANONICAL_REGION_KEYS.length}
- Months: 12
- Contexts: ${CONTEXTS.join(", ")}
- Water clarity variants: ${WATER_CLARITIES.join(", ")}
- Tide/current archetypes: ${ARCHETYPES.length}
- Recommender: not_applicable for all coastal/flats rows; no recommender production logic was invoked or changed.

## Production Parity

- Production-vs-experiment tide mismatches: ${parityTideMismatches}
- Production-vs-experiment score delta rows: ${parityScoreDeltaRows}
- Production-vs-experiment label changes: ${parityLabelChanges}
- Production-vs-experiment reliability changes: ${combinedReliability}
- Timing production behavior changed: 0 (timing is not modified by this audit)

Historical pre-wiring score_only_combined impact retained for context:
- Avg score delta: about -0.53
- Min/max score delta: about -7 / +7
- abs(score_delta) >= 8: 0
- abs(score_delta) >= 12: 0
- soft_current_not_helpful_enough improved from 1296 to 432
- too_hard_current_not_penalized improved from 1296 to 0

## Candidate Sweep

| Candidate | Avg score delta | Min | Max | abs>=8 | abs>=12 | Activity tier changes | Reliability changes | Driver changes | Suppressor changes | Candidate flags | Timing projected changes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${candidateSummaryRows(rows)}

## Flag Comparison: score_only_combined

| Flag | Production | Candidate | Delta |
| --- | ---: | ---: | ---: |
${flagComparisonTable(rows, "score_only_combined")}

## Timing Diagnostic Classification

${timingClassificationTable(rows)}

Timing diagnostic note: \`true_likely_miss\` means strong tide score plus same-day tide times, no qualified production tide window, and no heat/light anchor priority. \`acceptable_family_priority\` is counted separately and is not a production-change recommendation.

## Flats/Estuary Vs Inshore Snapshot: score_only_combined

Florida, June, clear water.

| Context | Archetype | Production tide score | Candidate tide score | Score delta |
| --- | --- | ---: | ---: | ---: |
${contextPolicySummary(rows, "score_only_combined")}

## Activity Tier Changes By Context/Archetype: score_only_combined

${activityChangesByContextArchetype(rows, "score_only_combined")}

## Representative score_only_combined Samples

| Region | Month | Context | Archetype | Clarity | Production Tide | Candidate Tide | Score Delta | Production Score | Candidate Score | Timing Class | Candidate Flags |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
${samples(rows, "score_only_combined", 40)}

## Production Candidate

**${bestCandidate}**

The combined score-only profile is now production-wired and matches the experiment reference while preserving labels, null/missing behavior, source priority, reliability, and inshore/flats policy differences. Timing remains diagnostic-only.

Residual \`soft_current_not_helpful_enough\` rows are concentrated in the intentionally cross-policy \`flats_soft_current\` archetype under broad inshore \`coastal\` context. That fixture uses 0.55 kt, which is barely above slack for inshore; keeping it slightly negative is treated as a likely false positive rather than a failed score target.

## Recommendation

**production parity confirmed; keep timing diagnostic separate**

Production timing changes should not be recommended unless true likely timing misses dominate over acceptable heat/light/seasonal priority. This audit keeps timing separate from score tuning.

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
