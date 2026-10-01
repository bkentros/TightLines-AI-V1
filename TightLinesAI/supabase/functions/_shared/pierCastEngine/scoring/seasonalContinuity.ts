import type { PierCastV3PairCalibration } from "../config/v3Calibration.ts";
import {
  evaluatePierCastV3ModePotentials,
  pierCastV3RegulationClosureApplies,
} from "./modesV3.ts";

/**
 * Reviewed upper bound for open-season movement in the date-only 1–10 prior.
 * Regulation closures are gated separately and therefore excluded.
 */
export const PIER_CAST_V3_MAX_OPEN_DAILY_SEASONAL_CHANGE = 0.45;

export type PierCastV3SeasonalContinuityIssue = {
  code:
    | "mode_evaluation_failed"
    | "open_daily_change_exceeds_limit"
    | "unexplained_displayed_reversal";
  pairKey: string;
  localDate: string;
  detail: string;
};

export type PierCastV3SeasonalContinuityReport = {
  pairKey: string;
  evaluatedYear: number;
  openDailyComparisonCount: number;
  maximumOpenDailyChange: number;
  documentedDisplayedReversalCount: number;
  modeHandoffReversalCount: number;
  knotReversalCount: number;
  issues: PierCastV3SeasonalContinuityIssue[];
};

type DailyPotential = {
  localDate: string;
  potential: number;
  displayPotential: number;
  modeCalibrationId: string;
  closed: boolean;
};

/**
 * Audit one recurring curve, including both year seams. A displayed one-day
 * turn is accepted only when a named mode handoff or an explicit knot explains
 * it; every other reversal is a configuration error.
 */
export function analyzePierCastV3SeasonalContinuity(input: {
  pair: PierCastV3PairCalibration;
  year?: number;
}): PierCastV3SeasonalContinuityReport {
  const year = input.year ?? 2027;
  const dates = datesFromPreviousDecember31ThroughNextJanuary1(year);
  const issues: PierCastV3SeasonalContinuityIssue[] = [];
  const evaluated: DailyPotential[] = [];

  for (const localDate of dates) {
    const modes = evaluatePierCastV3ModePotentials({
      localDate,
      modes: input.pair.modes,
    });
    const active = [...modes].sort((left, right) =>
      right.seasonalPotential - left.seasonalPotential ||
      left.modeCalibrationId.localeCompare(right.modeCalibrationId)
    )[0];
    if (!active || modes.length !== input.pair.modes.length) {
      issues.push({
        code: "mode_evaluation_failed",
        pairKey: input.pair.pairKey,
        localDate,
        detail: "Every configured mode must evaluate for every recurring date.",
      });
      continue;
    }
    evaluated.push({
      localDate,
      potential: active.seasonalPotential,
      displayPotential: Number(active.seasonalPotential.toFixed(1)),
      modeCalibrationId: active.modeCalibrationId,
      closed: pierCastV3RegulationClosureApplies({
        localDate,
        pair: input.pair,
      }),
    });
  }

  let openDailyComparisonCount = 0;
  let maximumOpenDailyChange = 0;
  let documentedDisplayedReversalCount = 0;
  let modeHandoffReversalCount = 0;
  let knotReversalCount = 0;

  for (let index = 1; index < evaluated.length; index += 1) {
    const previous = evaluated[index - 1];
    const current = evaluated[index];
    if (previous.closed || current.closed) continue;
    openDailyComparisonCount += 1;
    const change = Math.abs(current.potential - previous.potential);
    maximumOpenDailyChange = Math.max(maximumOpenDailyChange, change);
    if (change > PIER_CAST_V3_MAX_OPEN_DAILY_SEASONAL_CHANGE + 1e-10) {
      issues.push({
        code: "open_daily_change_exceeds_limit",
        pairKey: input.pair.pairKey,
        localDate: current.localDate,
        detail: `${previous.localDate} to ${current.localDate} changes by ${
          change.toFixed(3)
        }, above ${PIER_CAST_V3_MAX_OPEN_DAILY_SEASONAL_CHANGE.toFixed(2)}.`,
      });
    }
  }

  for (let index = 1; index < evaluated.length - 1; index += 1) {
    const previous = evaluated[index - 1];
    const current = evaluated[index];
    const next = evaluated[index + 1];
    if (previous.closed || current.closed || next.closed) continue;
    const valley = previous.displayPotential > current.displayPotential &&
      next.displayPotential > current.displayPotential;
    const peak = previous.displayPotential < current.displayPotential &&
      next.displayPotential < current.displayPotential;
    if (!valley && !peak) continue;

    const modeHandoff =
      previous.modeCalibrationId !== current.modeCalibrationId ||
      current.modeCalibrationId !== next.modeCalibrationId;
    const monthDay = current.localDate.slice(5);
    const activeMode = input.pair.modes.find((mode) =>
      mode.modeCalibrationId === current.modeCalibrationId
    );
    const configuredKnot = activeMode?.availabilityKnots.some((knot) =>
      knot.monthDay === monthDay
    ) ?? false;
    if (modeHandoff || configuredKnot) {
      documentedDisplayedReversalCount += 1;
      if (modeHandoff) modeHandoffReversalCount += 1;
      else knotReversalCount += 1;
      continue;
    }
    issues.push({
      code: "unexplained_displayed_reversal",
      pairKey: input.pair.pairKey,
      localDate: current.localDate,
      detail: `${previous.displayPotential.toFixed(1)} → ${
        current.displayPotential.toFixed(1)
      } → ${next.displayPotential.toFixed(1)} has no mode handoff or knot.`,
    });
  }

  return {
    pairKey: input.pair.pairKey,
    evaluatedYear: year,
    openDailyComparisonCount,
    maximumOpenDailyChange,
    documentedDisplayedReversalCount,
    modeHandoffReversalCount,
    knotReversalCount,
    issues,
  };
}

function datesFromPreviousDecember31ThroughNextJanuary1(
  year: number,
): string[] {
  const start = Date.UTC(year, 0, 0);
  const end = Date.UTC(year + 1, 0, 1);
  const dates: string[] = [];
  for (let time = start; time <= end; time += 24 * 60 * 60 * 1000) {
    dates.push(new Date(time).toISOString().slice(0, 10));
  }
  return dates;
}
