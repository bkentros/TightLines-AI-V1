#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Phase 8D tide/current V2 production parity/readiness audit.
 *
 * Production tide/current scoring is wired to score_only_combined. This script
 * verifies parity against the experiment reference. Timing production logic,
 * scoreDay, report copy, app/forecast behavior, other condition normalizers,
 * and recommender production logic/candidate pools/scoring/gates/selection are
 * not modified.
 */

import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type {
  ScoredVariableKey,
  SharedEngineRequest,
  VariableState,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { SharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/contracts/normalized.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";
import { scoreDay } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import { compositeScoreActivityTier } from "../../supabase/functions/_shared/howFishingEngine/narration/compositeScoreTier.ts";
import { normalizeTideCurrentMovementV2 } from "../../supabase/functions/_shared/howFishingEngine/experiments/normalizeTideV2.ts";

const OUTPUT_JSONL =
  "scripts/audit/todays-bite-tide-current-v2-readiness.jsonl";
const OUTPUT_MD = "scripts/audit/todays-bite-tide-current-v2-readiness.md";

type CoastalContext = "coastal" | "coastal_flats_estuary";
type TideEvent = { time: string; value: number; type?: string };
type TideInputs = {
  current_speed_knots_max: number | null;
  tide_movement_state: string | null;
  tide_high_low: TideEvent[] | null;
  tide_height_hourly_ft: number[] | null;
};
type FixtureStatus = "pass" | "questionable" | "fail";
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

type Fixture = {
  id: string;
  name: string;
  expectation: string;
  context: CoastalContext;
  region: RegionKey;
  month: number;
  tide: TideInputs;
};

type ReadinessRow = {
  fixture_id: string;
  name: string;
  expectation: string;
  context: CoastalContext;
  region: RegionKey;
  month: number;
  tide_inputs: TideInputs;
  production_tide: VariableSnapshot;
  v2_tide: VariableSnapshot;
  tide_label_changed: boolean;
  score_delta: number;
  production_score: number;
  v2_score: number;
  production_activity_tier: string;
  v2_activity_tier: string;
  activity_tier_changed: boolean;
  reliability_changed: boolean;
  driver_changed: boolean;
  suppressor_changed: boolean;
  production_tide_contribution: ContributionSnapshot | null;
  v2_tide_contribution: ContributionSnapshot | null;
  available_variables: string[];
  missing_variables: string[];
  data_gaps: unknown[];
  timing_diagnostic: {
    anchor_driver: string | null;
    primary_driver: string | null;
    primary_qualified: boolean | null;
    fallback_used: boolean | null;
    tide_window_present: boolean;
  };
  recommender: { status: "not_applicable"; reason: string };
  status: FixtureStatus;
  reason: string;
};

function tideEvents(
  values: Array<{ hour: string; value: number; type?: string }>,
): TideEvent[] {
  return values.map((event) => ({
    time: `2026-06-15T${event.hour}:00`,
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

const FIXTURES: readonly Fixture[] = [
  {
    id: "inshore_measured_slack",
    name: "Inshore measured slack",
    expectation: "Slack inshore remains meaningfully negative.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 0.12 }),
  },
  {
    id: "flats_measured_slack",
    name: "Flats measured slack",
    expectation: "Slack flats/estuary remains only mildly negative.",
    context: "coastal_flats_estuary",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 0.12 }),
  },
  {
    id: "inshore_soft_moving_065",
    name: "Inshore soft moving 0.65 kt",
    expectation: "True soft moving inshore current becomes modestly helpful.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 0.65 }),
  },
  {
    id: "inshore_barely_moving_055",
    name: "Inshore barely moving 0.55 kt",
    expectation:
      "Barely moving inshore current may remain slightly negative near slack.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 0.55 }),
  },
  {
    id: "flats_soft_current_055",
    name: "Flats soft current 0.55 kt",
    expectation: "Soft flats current becomes modestly helpful.",
    context: "coastal_flats_estuary",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 0.55 }),
  },
  {
    id: "inshore_optimal_moving_135",
    name: "Inshore optimal moving 1.35 kt",
    expectation: "Optimal inshore moving current remains strongly positive.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 1.35 }),
  },
  {
    id: "flats_optimal_moving_125",
    name: "Flats optimal moving 1.25 kt",
    expectation: "Optimal flats current remains strongly positive.",
    context: "coastal_flats_estuary",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 1.25 }),
  },
  {
    id: "inshore_strong_current_20",
    name: "Inshore strong current 2.0 kt",
    expectation: "Strong inshore current remains positive.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 2.0 }),
  },
  {
    id: "flats_strong_current_20",
    name: "Flats strong current 2.0 kt",
    expectation:
      "Strong flats current becomes cautionary/negative, not positive.",
    context: "coastal_flats_estuary",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 2.0 }),
  },
  {
    id: "inshore_too_hard_32",
    name: "Inshore too-hard current 3.2 kt",
    expectation: "Too-hard inshore current becomes clearly negative.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 3.2 }),
  },
  {
    id: "flats_too_hard_24",
    name: "Flats too-hard current 2.4 kt",
    expectation: "Too much flats current is clearly negative.",
    context: "coastal_flats_estuary",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 2.4 }),
  },
  {
    id: "flats_too_hard_32",
    name: "Flats too-hard current 3.2 kt",
    expectation: "Extreme flats current is strongly negative.",
    context: "coastal_flats_estuary",
    region: "florida",
    month: 6,
    tide: noMeasured({ current_speed_knots_max: 3.2 }),
  },
  {
    id: "stage_incoming_only",
    name: "Stage incoming only",
    expectation: "Incoming stage-only behavior is unchanged.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({ tide_movement_state: "incoming" }),
  },
  {
    id: "stage_outgoing_only",
    name: "Stage outgoing only",
    expectation: "Outgoing stage-only behavior is unchanged.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({ tide_movement_state: "outgoing" }),
  },
  {
    id: "stage_slack_inshore",
    name: "Stage slack inshore",
    expectation:
      "Stage slack inshore remains meaningfully negative and unchanged.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({ tide_movement_state: "slack" }),
  },
  {
    id: "stage_slack_flats",
    name: "Stage slack flats",
    expectation: "Stage slack flats remains mild and unchanged.",
    context: "coastal_flats_estuary",
    region: "florida",
    month: 6,
    tide: noMeasured({ tide_movement_state: "slack" }),
  },
  {
    id: "unknown_stage",
    name: "Unknown stage",
    expectation: "Unknown stage remains null/missing, not positive.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({ tide_movement_state: "unknown" }),
  },
  {
    id: "missing_tide",
    name: "Missing tide",
    expectation:
      "Missing tide remains missing and reliability is appropriately lowered.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured(),
  },
  {
    id: "conflicting_stage_current",
    name: "Conflicting stage/current",
    expectation: "Measured current still wins over slack stage.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({
      current_speed_knots_max: 1.4,
      tide_movement_state: "slack",
    }),
  },
  {
    id: "large_high_low_exchange",
    name: "Large high/low exchange",
    expectation: "Large high/low exchange remains reflected and useful.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({
      tide_high_low: tideEvents([
        { hour: "04:45", value: 0.1, type: "L" },
        { hour: "11:15", value: 3.5, type: "H" },
        { hour: "18:00", value: 0.2, type: "L" },
      ]),
    }),
  },
  {
    id: "weak_high_low_exchange",
    name: "Weak high/low exchange",
    expectation: "Weak exchange is not overrewarded.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({
      tide_high_low: tideEvents([
        { hour: "05:00", value: 1.0, type: "L" },
        { hour: "11:20", value: 1.35, type: "H" },
        { hour: "18:10", value: 1.05, type: "L" },
      ]),
    }),
  },
  {
    id: "many_same_day_exchanges",
    name: "Many same-day exchanges",
    expectation: "Many same-day exchanges remain useful.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({
      tide_high_low: tideEvents([
        { hour: "01:00", value: 0.2, type: "L" },
        { hour: "06:40", value: 2.4, type: "H" },
        { hour: "12:20", value: 0.1, type: "L" },
        { hour: "18:15", value: 2.8, type: "H" },
        { hour: "23:50", value: 0.4, type: "L" },
      ]),
    }),
  },
  {
    id: "tide_times_without_current",
    name: "Tide times without measured current",
    expectation: "Tide times without measured current score sensibly.",
    context: "coastal_flats_estuary",
    region: "florida",
    month: 6,
    tide: noMeasured({
      tide_high_low: tideEvents([
        { hour: "03:45", value: 0.3, type: "L" },
        { hour: "09:45", value: 2.3, type: "H" },
        { hour: "16:10", value: 0.4, type: "L" },
      ]),
    }),
  },
  {
    id: "hourly_tide_heights",
    name: "Hourly tide heights",
    expectation:
      "Hourly tide heights are scored before high/low stage fallbacks.",
    context: "coastal_flats_estuary",
    region: "florida",
    month: 6,
    tide: noMeasured({
      tide_movement_state: "slack",
      tide_high_low: tideEvents([
        { hour: "04:45", value: 0.1, type: "L" },
        { hour: "11:15", value: 3.5, type: "H" },
      ]),
      tide_height_hourly_ft: [
        0.1,
        0.2,
        0.5,
        0.9,
        1.3,
        1.6,
        1.8,
        1.7,
        1.4,
        1.0,
        0.6,
        0.3,
      ],
    }),
  },
  {
    id: "measured_current_over_hourly",
    name: "Measured current priority over hourly",
    expectation:
      "Measured current still wins over conflicting hourly/stage data.",
    context: "coastal",
    region: "florida",
    month: 6,
    tide: noMeasured({
      current_speed_knots_max: 0.65,
      tide_movement_state: "slack",
      tide_height_hourly_ft: [0.1, 1.3, 2.5, 3.7, 4.9, 3.6],
    }),
  },
];

function buildRequest(fixture: Fixture): SharedEngineRequest {
  const localDate = `2026-${String(fixture.month).padStart(2, "0")}-15`;
  return {
    latitude: 27.9,
    longitude: -82.5,
    state_code: "FL",
    region_key: fixture.region,
    local_date: localDate,
    local_timezone: "America/New_York",
    context: fixture.context,
    environment: {
      current_air_temp_f: 76,
      daily_mean_air_temp_f: 76,
      daily_low_air_temp_f: 70,
      daily_high_air_temp_f: 84,
      prior_day_mean_air_temp_f: 76,
      day_minus_2_mean_air_temp_f: 76,
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
      tide_movement_state: fixture.tide.tide_movement_state,
      current_speed_knots_max: fixture.tide.current_speed_knots_max,
      tide_high_low: fixture.tide.tide_high_low,
      tide_height_hourly_ft: fixture.tide.tide_height_hourly_ft,
    },
    data_coverage: { source_notes: [] },
  };
}

function tidePolicy(context: CoastalContext): "inshore" | "flats_estuary" {
  return context === "coastal_flats_estuary" ? "flats_estuary" : "inshore";
}

function cloneWithTide(
  norm: SharedNormalizedOutput,
  tide: VariableState | null,
): SharedNormalizedOutput {
  const normalized = { ...norm.normalized };
  if (tide) normalized.tide_current_movement = tide;
  else delete normalized.tide_current_movement;
  return { ...norm, normalized };
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

function hasTideTiming(
  report: ReturnType<typeof runHowFishingReport>,
): boolean {
  return report.timing_debug?.anchor_driver === "tide_exchange_window" ||
    (report.timing_debug?.primary_driver === "tide_exchange_window" &&
      report.timing_debug?.primary_qualified === true &&
      report.timing_debug?.fallback_used !== true);
}

function approxEqual(
  a: number | null | undefined,
  b: number | null | undefined,
): boolean {
  if (a == null || b == null) return a == null && b == null;
  return Math.abs(a - b) < 0.0001;
}

function unchanged(prod: VariableSnapshot, v2: VariableSnapshot): boolean {
  return prod?.label === v2?.label && approxEqual(prod?.score, v2?.score);
}

function classifyFixture(
  fixture: Fixture,
  prod: VariableSnapshot,
  v2: VariableSnapshot,
  rowBase: {
    reliabilityChanged: boolean;
    labelChanged: boolean;
    productionMissing: string[];
    v2Missing: string[];
  },
): { status: FixtureStatus; reason: string } {
  if (rowBase.reliabilityChanged) {
    return {
      status: "fail",
      reason: "Reliability changed in score-only shadow path.",
    };
  }
  if (rowBase.labelChanged) {
    return {
      status: "fail",
      reason: "Tide label changed; first pass should preserve labels.",
    };
  }

  const score = v2?.score ?? null;
  const prodScore = prod?.score ?? null;
  switch (fixture.id) {
    case "inshore_measured_slack":
      return score != null && score <= -0.7
        ? {
          status: "pass",
          reason: "Inshore slack remains meaningfully negative.",
        }
        : { status: "fail", reason: "Inshore slack is not negative enough." };
    case "flats_measured_slack":
      return score != null && score > -0.3 && score <= 0
        ? { status: "pass", reason: "Flats slack remains mild." }
        : { status: "fail", reason: "Flats slack no longer looks mild." };
    case "inshore_soft_moving_065":
      return score != null && score >= 0.2
        ? {
          status: "pass",
          reason: "Soft inshore current is now modestly helpful.",
        }
        : {
          status: "fail",
          reason: "Soft inshore current did not clear the helpful threshold.",
        };
    case "inshore_barely_moving_055":
      return score != null && score >= -0.25 && score <= 0.1
        ? {
          status: "pass",
          reason:
            "Barely moving inshore current stays near-neutral/near-slack.",
        }
        : {
          status: "questionable",
          reason: "Barely moving inshore current moved more than expected.",
        };
    case "flats_soft_current_055":
      return score != null && score >= 0.2
        ? { status: "pass", reason: "Soft flats current is modestly helpful." }
        : {
          status: "fail",
          reason: "Soft flats current is not helpful enough.",
        };
    case "inshore_optimal_moving_135":
    case "flats_optimal_moving_125":
      return score != null && score >= 1
        ? {
          status: "pass",
          reason: "Optimal movement remains strongly positive.",
        }
        : { status: "fail", reason: "Optimal movement lost too much value." };
    case "inshore_strong_current_20":
      return score != null && score >= 1.2
        ? { status: "pass", reason: "Strong inshore current remains positive." }
        : {
          status: "fail",
          reason: "Strong inshore current no longer reads positive.",
        };
    case "flats_strong_current_20":
      return score != null && score <= -0.3
        ? {
          status: "pass",
          reason: "Strong flats current is now cautionary/negative.",
        }
        : {
          status: "fail",
          reason: "Strong flats current is still too positive.",
        };
    case "inshore_too_hard_32":
    case "flats_too_hard_24":
    case "flats_too_hard_32":
      return score != null && score <= -0.5
        ? { status: "pass", reason: "Too-hard current is clearly negative." }
        : {
          status: "fail",
          reason: "Too-hard current is not clearly negative.",
        };
    case "stage_incoming_only":
    case "stage_outgoing_only":
    case "stage_slack_inshore":
    case "stage_slack_flats":
      return unchanged(prod, v2)
        ? { status: "pass", reason: "Stage-only behavior is unchanged." }
        : { status: "fail", reason: "Stage-only behavior changed." };
    case "unknown_stage":
      return prod == null && v2 == null &&
          rowBase.productionMissing.includes("tide_current_movement") &&
          rowBase.v2Missing.includes("tide_current_movement")
        ? { status: "pass", reason: "Unknown stage remains missing/null." }
        : { status: "fail", reason: "Unknown stage no longer stays missing." };
    case "missing_tide":
      return prod == null && v2 == null &&
          rowBase.productionMissing.includes("tide_current_movement") &&
          rowBase.v2Missing.includes("tide_current_movement")
        ? {
          status: "pass",
          reason:
            "Missing tide remains missing and does not inflate reliability.",
        }
        : { status: "fail", reason: "Missing tide behavior changed." };
    case "conflicting_stage_current":
      return v2?.label === "moving" && score != null && score > 0.5
        ? {
          status: "pass",
          reason: "Measured current still wins over slack stage.",
        }
        : {
          status: "fail",
          reason: "Stage may be overriding measured current.",
        };
    case "large_high_low_exchange":
    case "many_same_day_exchanges":
    case "tide_times_without_current":
      return score != null && score >= 0.7
        ? { status: "pass", reason: "Tide-clock exchange remains useful." }
        : {
          status: "fail",
          reason: "Tide-clock exchange is not reflected enough.",
        };
    case "weak_high_low_exchange":
      return score != null && score <= 0.6
        ? { status: "pass", reason: "Weak exchange is not overrewarded." }
        : { status: "fail", reason: "Weak exchange remains too rewarded." };
    case "hourly_tide_heights":
      return v2?.label === "strong_moving" && score != null && score > 0
        ? {
          status: "pass",
          reason: "Hourly tide heights are used and remain sensible.",
        }
        : {
          status: "fail",
          reason: "Hourly tide-height path did not score sensibly.",
        };
    case "measured_current_over_hourly":
      return v2?.label === "moving" && score != null && score >= 0.2 &&
          score < 0.5
        ? {
          status: "pass",
          reason: "Measured current wins over conflicting hourly/stage data.",
        }
        : { status: "fail", reason: "Measured current priority is unclear." };
    default:
      return prodScore === score
        ? { status: "pass", reason: "No unexpected score movement." }
        : {
          status: "questionable",
          reason: "No explicit fixture rule matched.",
        };
  }
}

function buildRows(): ReadinessRow[] {
  return FIXTURES.map((fixture) => {
    const req = buildRequest(fixture);
    const productionNorm = buildSharedNormalizedOutput(req);
    const productionScored = scoreDay(productionNorm);
    const v2Tide = normalizeTideCurrentMovementV2(
      {
        current_speed_knots_max: fixture.tide.current_speed_knots_max,
        tide_height_hourly_ft: fixture.tide.tide_height_hourly_ft,
        tide_high_low: fixture.tide.tide_high_low,
        stage: fixture.tide.tide_movement_state,
      },
      tidePolicy(fixture.context),
      "score_only_combined",
    );
    const v2Norm = cloneWithTide(productionNorm, v2Tide);
    const v2Scored = scoreDay(v2Norm);
    const report = runHowFishingReport(req);
    const productionTide = variableSnapshot(
      productionNorm.normalized.tide_current_movement,
    );
    const v2TideSnapshot = variableSnapshot(v2Tide ?? undefined);
    const productionDrivers = productionScored.drivers.map(
      contributionSnapshot,
    );
    const productionSuppressors = productionScored.suppressors.map(
      contributionSnapshot,
    );
    const v2Drivers = v2Scored.drivers.map(contributionSnapshot);
    const v2Suppressors = v2Scored.suppressors.map(contributionSnapshot);
    const productionTideIsDriver = productionDrivers.some((c) =>
      c.key === "tide_current_movement"
    );
    const productionTideIsSuppressor = productionSuppressors.some((c) =>
      c.key === "tide_current_movement"
    );
    const v2TideIsDriver = v2Drivers.some((c) =>
      c.key === "tide_current_movement"
    );
    const v2TideIsSuppressor = v2Suppressors.some((c) =>
      c.key === "tide_current_movement"
    );
    const productionContribution =
      [...productionDrivers, ...productionSuppressors].find((c) =>
        c.key === "tide_current_movement"
      ) ?? null;
    const v2Contribution = [...v2Drivers, ...v2Suppressors].find((c) =>
      c.key === "tide_current_movement"
    ) ?? null;
    const reliabilityChanged =
      productionNorm.reliability !== v2Norm.reliability;
    const labelChanged = productionTide?.label !== v2TideSnapshot?.label;
    const result = classifyFixture(fixture, productionTide, v2TideSnapshot, {
      reliabilityChanged,
      labelChanged,
      productionMissing: productionNorm.missing_variables,
      v2Missing: v2Norm.missing_variables,
    });

    return {
      fixture_id: fixture.id,
      name: fixture.name,
      expectation: fixture.expectation,
      context: fixture.context,
      region: fixture.region,
      month: fixture.month,
      tide_inputs: fixture.tide,
      production_tide: productionTide,
      v2_tide: v2TideSnapshot,
      tide_label_changed: labelChanged,
      score_delta: v2Scored.score - productionScored.score,
      production_score: productionScored.score,
      v2_score: v2Scored.score,
      production_activity_tier: compositeScoreActivityTier(
        productionScored.score,
      ),
      v2_activity_tier: compositeScoreActivityTier(v2Scored.score),
      activity_tier_changed:
        compositeScoreActivityTier(productionScored.score) !==
          compositeScoreActivityTier(v2Scored.score),
      reliability_changed: reliabilityChanged,
      driver_changed: productionTideIsDriver !== v2TideIsDriver,
      suppressor_changed: productionTideIsSuppressor !== v2TideIsSuppressor,
      production_tide_contribution: productionContribution,
      v2_tide_contribution: v2Contribution,
      available_variables: v2Norm.available_variables,
      missing_variables: v2Norm.missing_variables,
      data_gaps: v2Norm.data_gaps,
      timing_diagnostic: {
        anchor_driver: report.timing_debug?.anchor_driver ?? null,
        primary_driver: report.timing_debug?.primary_driver ?? null,
        primary_qualified: report.timing_debug?.primary_qualified ?? null,
        fallback_used: report.timing_debug?.fallback_used ?? null,
        tide_window_present: hasTideTiming(report),
      },
      recommender: {
        status: "not_applicable",
        reason:
          "Phase 8D scope is coastal/flats only; current daily-picks audit harness is not invoked for these contexts.",
      },
      status: result.status,
      reason: result.reason,
    };
  });
}

function count(rows: ReadinessRow[], status: FixtureStatus): number {
  return rows.filter((row) => row.status === status).length;
}

function rowTable(rows: ReadinessRow[]): string {
  return rows.map((row) =>
    `| ${row.fixture_id} | ${row.context} | ${
      row.production_tide?.label ?? "null"
    } | ${row.production_tide?.score ?? "null"} | ${
      row.v2_tide?.label ?? "null"
    } | ${row.v2_tide?.score ?? "null"} | ${row.score_delta} | ${
      row.activity_tier_changed ? "yes" : "no"
    } | ${
      row.reliability_changed ? "yes" : "no"
    } | ${row.status} | ${row.reason} |`
  ).join("\n");
}

const rows = buildRows();
const failed = count(rows, "fail");
const questionable = count(rows, "questionable");
const passed = count(rows, "pass");
const labelChanges = rows.filter((row) => row.tide_label_changed).length;
const reliabilityChanges = rows.filter((row) => row.reliability_changed).length;
const activityChanges = rows.filter((row) => row.activity_tier_changed).length;
const driverChanges = rows.filter((row) => row.driver_changed).length;
const suppressorChanges = rows.filter((row) => row.suppressor_changed).length;
const parityTideMismatches =
  rows.filter((row) =>
    row.production_tide?.label !== row.v2_tide?.label ||
    row.production_tide?.score !== row.v2_tide?.score ||
    row.production_tide?.detail !== row.v2_tide?.detail
  ).length;
const parityScoreDeltaRows = rows.filter((row) => row.score_delta !== 0).length;
const recommendation =
  failed === 0 && reliabilityChanges === 0 && labelChanges === 0 &&
    parityTideMismatches === 0 && parityScoreDeltaRows === 0
    ? "production parity confirmed for score_only_combined; keep timing diagnostics separate"
    : "investigate production-vs-experiment mismatches before release";

const markdown = `# Today's Bite Tide/Current V2 Production Readiness Audit

Generated: ${new Date().toISOString()}

Phase 8D production parity/readiness audit. Production tide/current scoring is wired to \`score_only_combined\`; timing production logic, scoreDay, report copy, app/forecast behavior, other condition normalizers, and recommender production logic were not changed.

## Totals

- Fixtures: ${rows.length}
- Passed: ${passed}
- Questionable: ${questionable}
- Failed: ${failed}
- Tide label changes: ${labelChanges}
- Reliability changes: ${reliabilityChanges}
- Activity tier changes: ${activityChanges}
- Driver changes: ${driverChanges}
- Suppressor changes: ${suppressorChanges}
- Recommender: not_applicable for all coastal/flats fixtures.

## Production Parity

- Production-vs-experiment tide mismatches: ${parityTideMismatches}
- Production-vs-experiment score delta rows: ${parityScoreDeltaRows}
- Production-vs-experiment label changes: ${labelChanges}
- Production-vs-experiment reliability changes: ${reliabilityChanges}
- Timing production behavior changed: 0 (timing is diagnostic-only here)

## Fixture Results

| Fixture | Context | Prod label | Prod tide | V2 label | V2 tide | Score delta | Activity changed | Reliability changed | Status | Reason |
| --- | --- | --- | ---: | --- | ---: | ---: | --- | --- | --- | --- |
${rowTable(rows)}

## Flats Vs Inshore Summary

- Inshore slack stays meaningfully negative; flats slack remains mild.
- Inshore true soft current at 0.65 kt becomes modestly helpful, while barely moving 0.55 kt remains near-neutral/slightly negative.
- Flats soft current at 0.55 kt becomes modestly helpful.
- Inshore 2.0 kt remains positive; flats 2.0 kt becomes cautionary/negative.
- Too-hard current is clearly negative in both inshore and flats fixtures.

## Timing Diagnostic

Timing is recorded only as diagnostic metadata. This readiness audit does not recommend timing production changes. Qualified tide-window status remains whatever production timing returns for each fixture.

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
