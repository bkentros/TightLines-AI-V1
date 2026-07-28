import type {
  HistoricalPresenceConfig,
  PrimitiveDisplay,
  RiverRunProfile,
  RiverRunReasonCode,
  RunStage,
} from "../types.ts";
import {
  clamp,
  compareLocalDates,
  daysBetween,
  interpolate,
  resolveActiveRunWindow,
} from "../metrics/dateWindow.ts";
import { stageForDate } from "./runStage.ts";

export type FishInRiverResult = PrimitiveDisplay & {
  stage: RunStage;
  maximum: number;
  curveFraction: number;
};

export function scoreFishInRiver(
  run: Pick<RiverRunProfile, "runWindow" | "historicalPresence">,
  localDate: string,
): FishInRiverResult {
  const window = resolveActiveRunWindow(run, localDate);
  const stage = stageForDate(localDate, window);
  const curveFraction = historicalPresenceFraction({
    localDate,
    startDate: window.startDate,
    lateEndDate: window.lateEndDate,
    historicalPresence: run.historicalPresence,
  });
  const maximum = run.historicalPresence.maximum;
  const score = clamp(Math.round(curveFraction * maximum), 0, maximum);
  const label = fishInRiverLabel(score);

  return {
    score,
    stage,
    maximum,
    curveFraction,
    label,
    ...fishInRiverCopy(label, score, maximum),
    reasonCodes: [
      stageReasonCode(stage),
      "historical_presence_curve",
    ],
  };
}

export function historicalPresenceFraction(input: {
  localDate: string;
  startDate: string;
  lateEndDate: string;
  historicalPresence: HistoricalPresenceConfig;
}): number {
  if (
    compareLocalDates(input.localDate, input.startDate) < 0 ||
    compareLocalDates(input.localDate, input.lateEndDate) > 0
  ) {
    return 0;
  }

  const dayOffset = daysBetween(input.startDate, input.localDate);
  const anchors = [...input.historicalPresence.anchors].toSorted((a, b) =>
    a.dayOffsetFromStart - b.dayOffsetFromStart
  );
  if (anchors.length === 0) return 0;
  if (dayOffset <= anchors[0].dayOffsetFromStart) {
    return clamp(anchors[0].fractionOfMaximum, 0, 1);
  }

  for (let index = 1; index < anchors.length; index++) {
    const prior = anchors[index - 1];
    const next = anchors[index];
    if (dayOffset <= next.dayOffsetFromStart) {
      return clamp(
        interpolate(
          dayOffset,
          prior.dayOffsetFromStart,
          next.dayOffsetFromStart,
          prior.fractionOfMaximum,
          next.fractionOfMaximum,
        ),
        0,
        1,
      );
    }
  }

  return clamp(anchors[anchors.length - 1].fractionOfMaximum, 0, 1);
}

function fishInRiverLabel(score: number): string {
  if (score === 0) return "Outside historical window";
  if (score <= 2) return "Low historical presence";
  if (score <= 4) return "Building historical presence";
  if (score <= 6) return "Moderate historical presence";
  if (score <= 8) return "High historical presence";
  return "Peak historical presence";
}

function fishInRiverCopy(
  label: string,
  score: number,
  maximum: number,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (score === 0) {
    return {
      headline: "Historical river presence is outside the configured window.",
      detail:
        `The configured seasonal presence curve is ${score} / ${maximum} for this date; nearby staging does not count as fish in the river.`,
      tip:
        "Use Run Stage for calendar context and current-condition primitives for separate signals.",
    };
  }
  return {
    headline: `${label} is typical for this point in the configured run.`,
    detail:
      `The river-specific historical seasonal presence level is ${score} / ${maximum}; it is not a fish count or a live observation.`,
    tip:
      "Compare historical presence with Push and Fishability without treating either as proof of fish numbers.",
  };
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
