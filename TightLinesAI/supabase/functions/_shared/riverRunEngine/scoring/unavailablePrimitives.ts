import { RIVER_RUN_COPY_VERSION } from "../copy/version.ts";
import type { PrimitiveUnavailableReason } from "../types.ts";
import type { ConditionsSuggestResult } from "./conditionsSuggest.ts";
import type { FishabilityScoreResult } from "./fishability.ts";
import type { PushScoreResult } from "./push.ts";

export function unavailableMigrationTiming(
  _reason: PrimitiveUnavailableReason,
): ConditionsSuggestResult {
  return {
    score: null,
    label: "Unavailable",
    timingLabel: null,
    candidateLabel: null,
    completedCheckpointCount: 0,
    currentIndex: null,
    currentPercentile: null,
    gaugeResponsePercentile: null,
    waterTemperaturePercentile: null,
    usableDays: 0,
    expectedDays: 0,
    coveragePercent: 0,
    historicalYears: 0,
    sourceDates: [],
    sourceRefreshSlots: {},
    headline: "Migration Timing is not available for this river.",
    detail:
      "There is no sufficiently accurate and consistent long-term gauge and measured water-temperature record for this river corridor, so an early, typical, or delayed comparison would not be reliable.",
    tip:
      "Use Run Stage and Fish In River for seasonal context. Do not move upstream or stay lower based on timing from another river.",
    reasonCodes: ["primitive_migration_timing_unavailable_for_river"],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

export function unavailablePush(
  _reason: PrimitiveUnavailableReason,
): PushScoreResult {
  return {
    score: null,
    label: "Unavailable",
    headline: "Push is not available for this river.",
    detail:
      "There is no sufficiently accurate and consistent live gauge or measured water-temperature sensor for this river corridor, so current flow and temperature cannot support a reliable movement read.",
    tip:
      "Use Run Stage and Fish In River for seasonal context. FinFindr will not substitute air temperature or another river's movement pattern.",
    reasonCodes: ["primitive_push_unavailable_for_river"],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

export function unavailableFishability(
  _reason: PrimitiveUnavailableReason,
): FishabilityScoreResult {
  return {
    score: null,
    label: "Unavailable",
    headline: "Fishability is not available for this river.",
    detail:
      "There is no sufficiently accurate and consistent live flow gauge representing this fishing corridor, so FinFindr cannot reliably describe its current fishing shape.",
    tip:
      "Verify conditions directly at a legal access and use trusted local guidance. Do not borrow flow ranges from another river.",
    reasonCodes: ["primitive_fishability_unavailable_for_river"],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}
