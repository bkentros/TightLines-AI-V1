import { RIVER_RUN_COPY_VERSION } from "../copy/version.ts";
import type {
  PrimitiveUnavailableReason,
  RunStageCopyStrategy,
} from "../types.ts";
import type { ConditionsSuggestResult } from "./conditionsSuggest.ts";
import type { FishabilityScoreResult } from "./fishability.ts";
import type { PushScoreResult } from "./push.ts";

export function unavailableMigrationTiming(
  _reason: PrimitiveUnavailableReason,
  copyStrategy?: RunStageCopyStrategy,
): ConditionsSuggestResult {
  const betsie = copyStrategy === "betsie_homestead";
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
    headline: betsie
      ? "Migration Timing is not available for the Betsie."
      : "Migration Timing is not available for this river.",
    detail: betsie
      ? "The Betsie does not have a long-term flow and measured water-temperature record reliable enough for an early, typical, or delayed comparison."
      : "There is no sufficiently accurate and consistent long-term gauge and measured water-temperature record for this river corridor, so an early, typical, or delayed comparison would not be reliable.",
    tip: betsie
      ? "Use Migration Stage and Fish In River. This card cannot shift the plan between the Betsie Lake–US-31 and US-31–Homestead reaches."
      : "Use Run Stage and Fish In River for seasonal context. Do not move upstream or stay lower based on timing from another river.",
    reasonCodes: ["primitive_migration_timing_unavailable_for_river"],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

export function unavailablePush(
  _reason: PrimitiveUnavailableReason,
  copyStrategy?: RunStageCopyStrategy,
): PushScoreResult {
  const betsie = copyStrategy === "betsie_homestead";
  return {
    score: null,
    label: "Unavailable",
    headline: betsie
      ? "Push is not available for the Betsie."
      : "Push is not available for this river.",
    detail: betsie
      ? "The Betsie lacks representative live flow and measured water temperature for a current movement read."
      : "There is no sufficiently accurate and consistent live gauge or measured water-temperature sensor for this river corridor, so current flow and temperature cannot support a reliable movement read.",
    tip: betsie
      ? "Use Migration Stage and Fish In River. Air temperature and another river's movement cannot replace Betsie measurements."
      : "Use Run Stage and Fish In River for seasonal context. FinFindr will not substitute air temperature or another river's movement pattern.",
    reasonCodes: ["primitive_push_unavailable_for_river"],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

export function unavailableFishability(
  _reason: PrimitiveUnavailableReason,
  copyStrategy?: RunStageCopyStrategy,
): FishabilityScoreResult {
  const betsie = copyStrategy === "betsie_homestead";
  return {
    score: null,
    label: "Unavailable",
    headline: betsie
      ? "Fishability is not available for the Betsie."
      : "Fishability is not available for this river.",
    detail: betsie
      ? "The Betsie lacks a continuous live flow gauge representing the two River Run reaches."
      : "There is no sufficiently accurate and consistent live flow gauge representing this fishing corridor, so FinFindr cannot reliably describe its current fishing shape.",
    tip: betsie
      ? "Verify current conditions directly or use trusted local guidance. Do not borrow flow ranges from another river."
      : "Verify conditions directly at a legal access and use trusted local guidance. Do not borrow flow ranges from another river.",
    reasonCodes: ["primitive_fishability_unavailable_for_river"],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}
