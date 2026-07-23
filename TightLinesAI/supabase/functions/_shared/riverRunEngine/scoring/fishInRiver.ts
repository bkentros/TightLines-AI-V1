import type {
  PrimitiveDisplay,
  RiverRunProfile,
  RiverRunReasonCode,
  RunStage,
} from "../types.ts";
import {
  clamp,
  compareLocalDates,
  type DateWindow,
  daysBetween,
  interpolate,
  resolveActiveRunWindow,
} from "../metrics/dateWindow.ts";
import { stageForDate } from "./runStage.ts";

export type FishInRiverResult = PrimitiveDisplay & {
  stage: RunStage;
  baseScore: number;
  strengthAdjustedScore: number;
};

const STRENGTH = {
  1: { multiplier: 0.55, cap: 55, code: "run_strength_weak" },
  2: { multiplier: 0.7, cap: 70, code: "run_strength_light" },
  3: { multiplier: 0.85, cap: 85, code: "run_strength_medium" },
  4: { multiplier: 0.95, cap: 95, code: "run_strength_strong" },
  5: { multiplier: 1, cap: 100, code: "run_strength_signature" },
} as const;

export function scoreFishInRiver(
  run: Pick<RiverRunProfile, "runWindow" | "runStrength">,
  localDate: string,
): FishInRiverResult {
  const window = resolveActiveRunWindow(run, localDate);
  const stage = stageForDate(localDate, window);
  const baseScore = dateBaseScore(localDate, window, stage);
  const strength = STRENGTH[run.runStrength];
  const strengthAdjusted = Math.min(
    baseScore * strength.multiplier,
    strength.cap,
  );
  const capped = applyContextCaps(strengthAdjusted, localDate, window, stage);
  const score = clamp(Math.round(capped), 0, 100);

  return {
    score,
    stage,
    baseScore,
    strengthAdjustedScore: strengthAdjusted,
    label: fishInRiverLabel(score),
    ...fishInRiverCopy(fishInRiverLabel(score)),
    reasonCodes: [stageReasonCode(stage), strength.code as RiverRunReasonCode],
  };
}

function dateBaseScore(
  localDate: string,
  window: DateWindow,
  stage: RunStage,
): number {
  if (compareLocalDates(localDate, window.earlyStartDate) < 0) return 5;
  if (compareLocalDates(localDate, window.startDate) < 0) {
    const day = daysBetween(window.earlyStartDate, localDate);
    return interpolate(day, 0, window.earlyWindowDays - 1, 15, 35);
  }
  if (stage === "beginning") {
    return interpolate(
      daysBetween(window.startDate, localDate),
      0,
      Math.max(1, daysBetween(window.startDate, window.beginningEndDate)),
      40,
      55,
    );
  }
  if (stage === "building") {
    return interpolate(
      daysBetween(window.beginningEndDate, localDate),
      0,
      Math.max(1, daysBetween(window.beginningEndDate, window.peakStartDate)),
      55,
      75,
    );
  }
  if (stage === "peak") {
    const daysFromPeak = Math.abs(daysBetween(window.peakDate, localDate));
    return interpolate(daysFromPeak, 0, window.peakWindowDays, 100, 80);
  }
  if (stage === "tapering") {
    return interpolate(
      daysBetween(window.peakEndDate, localDate),
      0,
      Math.max(1, daysBetween(window.peakEndDate, window.taperingEndDate)),
      80,
      60,
    );
  }
  if (stage === "ending") {
    return interpolate(
      daysBetween(window.taperingEndDate, localDate),
      0,
      Math.max(1, daysBetween(window.taperingEndDate, window.endDate)),
      60,
      35,
    );
  }
  if (compareLocalDates(localDate, window.lateEndDate) <= 0) {
    return interpolate(
      daysBetween(window.endDate, localDate),
      1,
      window.lateWindowDays,
      30,
      10,
    );
  }
  return 5;
}

function applyContextCaps(
  score: number,
  localDate: string,
  window: DateWindow,
  stage: RunStage,
): number {
  if (stage === "pre_run") return Math.min(score, 39);
  if (stage === "beginning") return Math.min(score, 60);
  if (stage === "post_run") {
    if (compareLocalDates(localDate, window.lateEndDate) > 0) {
      return Math.min(score, 10);
    }
    return Math.min(score, 25);
  }
  return score;
}

function fishInRiverLabel(score: number): string {
  if (score <= 19) return "Very unlikely";
  if (score <= 39) return "A few possible";
  if (score <= 59) return "Building presence";
  if (score <= 79) return "Likely present";
  return "Peak presence";
}

function fishInRiverCopy(
  label: PrimitiveDisplay["label"],
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  switch (label) {
    case "Very unlikely":
      return {
        headline: "Seasonal presence context is very low.",
        detail:
          "The configured run calendar and run strength put this date outside the main seasonal window.",
        tip:
          "Compare this seasonal-presence read with the other primitives separately.",
      };
    case "A few possible":
      return {
        headline: "Seasonal presence context is still early or late.",
        detail:
          "The configured run calendar allows limited seasonal presence context without implying current conditions.",
        tip:
          "Compare this seasonal-presence read with the other primitives separately.",
      };
    case "Building presence":
      return {
        headline: "Seasonal presence context is building.",
        detail:
          "The configured run calendar is moving through the seasonal window.",
        tip:
          "Compare this seasonal-presence read with the other primitives separately.",
      };
    case "Likely present":
      return {
        headline: "Seasonal presence context is elevated.",
        detail:
          "The configured run calendar and run strength support elevated seasonal presence context.",
        tip:
          "Compare this seasonal-presence read with the other primitives separately.",
      };
    case "Peak presence":
      return {
        headline: "Seasonal presence context is near its calendar high point.",
        detail: "The configured run calendar is near peak seasonal timing.",
        tip:
          "Compare this seasonal-presence read with the other primitives separately.",
      };
    default:
      return {
        headline: "Seasonal presence context is available.",
        detail: "Fish In River describes seasonal presence context only.",
        tip: "Use other primitives for current River Run dimensions.",
      };
  }
}

function stageReasonCode(stage: RunStage): RiverRunReasonCode {
  switch (stage) {
    case "pre_run":
      return "stage_pre_run";
    case "beginning":
      return "stage_beginning";
    case "building":
      return "stage_building";
    case "peak":
      return "stage_peak";
    case "tapering":
      return "stage_tapering";
    case "ending":
      return "stage_ending";
    case "post_run":
      return "stage_post_run";
  }
}
