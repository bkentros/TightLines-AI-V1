import type {
  HistoricalPresenceConfig,
  PrimitiveDisplay,
  RiverRunProfile,
  RiverRunReasonCode,
  RunStage,
} from "../types.ts";
import {
  alternate,
  type RiverRunCopyOptions,
  RIVER_RUN_COPY_VERSION,
  resolveCopyVariant,
} from "../copy/variants.ts";
import {
  addDays,
  clamp,
  compareLocalDates,
  daysBetween,
  interpolate,
  resolveActiveRunWindow,
} from "../metrics/dateWindow.ts";
import { stageForDate } from "./runStage.ts";

export type FishInRiverCurveDirection =
  | "rising"
  | "near_peak"
  | "falling"
  | "outside";

export type FishInRiverResult = PrimitiveDisplay & {
  stage: RunStage;
  maximum: number;
  curveFraction: number;
  curveDirection: FishInRiverCurveDirection;
};

export function scoreFishInRiver(
  run: Pick<RiverRunProfile, "runWindow" | "historicalPresence">,
  localDate: string,
  copyOptions: RiverRunCopyOptions = {},
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
  const roundedScore = Math.round(curveFraction * maximum);
  const score = curveFraction > 0
    ? clamp(Math.max(1, roundedScore), 0, maximum)
    : 0;
  const label = fishInRiverLabel(score, maximum);
  const curveDirection = resolveCurveDirection({
    run,
    localDate,
    startDate: window.startDate,
    lateEndDate: window.lateEndDate,
    curveFraction,
  });
  const copyVariant = resolveCopyVariant(
    copyOptions.copyKey ??
      `${window.startDate}:${score}:${curveDirection}:${maximum}`,
    copyOptions.copyVariant,
  );

  return {
    score,
    stage,
    maximum,
    curveFraction,
    curveDirection,
    label,
    ...fishInRiverCopy({
      label,
      score,
      maximum,
      stage,
      direction: curveDirection,
      window,
      variant: copyVariant,
    }),
    reasonCodes: [
      stageReasonCode(stage),
      "historical_presence_curve",
    ],
    copyVersion: RIVER_RUN_COPY_VERSION,
    copyVariant,
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

function fishInRiverLabel(score: number, maximum: number): string {
  if (score === 0) return "Outside historical window";
  const fractionOfRiverMaximum = score / maximum;
  if (fractionOfRiverMaximum <= 0.2) return "Low historical presence";
  if (fractionOfRiverMaximum <= 0.4) return "Limited historical presence";
  if (fractionOfRiverMaximum <= 0.6) return "Moderate historical presence";
  if (fractionOfRiverMaximum <= 0.8) return "High historical presence";
  return "Peak historical presence";
}

function fishInRiverCopy(input: {
  label: string;
  score: number;
  maximum: number;
  stage: RunStage;
  direction: FishInRiverCurveDirection;
  window: ReturnType<typeof resolveActiveRunWindow>;
  variant: "A" | "B";
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const { label, score, maximum, stage, direction, window, variant } = input;
  if (score === 0 && stage === "pre_run") {
    return {
      headline: alternate(
        variant,
        "Historical in-river presence has not begun for this run.",
        "This date is before the historical in-river presence window.",
      ),
      detail: `The river-specific seasonal curve is ${score} / ${maximum} because in-river presence begins ${
        displayLocalDate(window.startDate)
      }. Nearby lake, harbor, or river-mouth staging is not counted as fish in the river.`,
      tip: alternate(
        variant,
        "Use Run Stage for nearby staging context; this score starts only when the researched river window opens.",
        "Do not convert possible nearby staging into an in-river estimate.",
      ),
    };
  }
  if (score === 0) {
    return {
      headline: alternate(
        variant,
        "The historical in-river presence window has ended.",
        "This date is beyond the modeled in-river season.",
      ),
      detail: `The river-specific seasonal curve has returned to ${score} / ${maximum} after its historical tail ended ${
        displayLocalDate(window.lateEndDate)
      }. This does not prove that no individual fish remain.`,
      tip: alternate(
        variant,
        "Treat any remaining fish as outside the modeled run, not as a continuing seasonal forecast.",
        "The model stops here instead of guessing about isolated late fish.",
      ),
    };
  }

  const directionText = direction === "rising"
    ? "The historical curve is still rising toward its seasonal high point."
    : direction === "falling"
    ? "The historical curve is declining from its seasonal high point."
    : "The historical curve is at or near its seasonal high point.";
  return {
    headline: alternate(
      variant,
      headlineForDirection(label, direction),
      alternateHeadlineForDirection(label, direction),
    ),
    detail: `The river-specific historical seasonal presence level is ${score} / ${maximum}. ${directionText} The river's configured maximum is ${maximum} / 10, so the scale reflects this river, run type, and species combination; it is not a fish count or live observation.`,
    tip: alternate(
      variant,
      tipForDirection(direction),
      alternateTipForDirection(direction),
    ),
  };
}

function resolveCurveDirection(input: {
  run: Pick<RiverRunProfile, "historicalPresence">;
  localDate: string;
  startDate: string;
  lateEndDate: string;
  curveFraction: number;
}): FishInRiverCurveDirection {
  if (
    compareLocalDates(input.localDate, input.startDate) < 0 ||
    compareLocalDates(input.localDate, input.lateEndDate) > 0
  ) {
    return "outside";
  }
  const fractionFor = (date: string) =>
    historicalPresenceFraction({
      localDate: date,
      startDate: input.startDate,
      lateEndDate: input.lateEndDate,
      historicalPresence: input.run.historicalPresence,
    });
  const prior = fractionFor(addDays(input.localDate, -1));
  const next = fractionFor(addDays(input.localDate, 1));
  const epsilon = 0.0001;
  if (input.curveFraction >= 1 - epsilon) return "near_peak";
  if (next > input.curveFraction + epsilon) return "rising";
  if (
    next < input.curveFraction - epsilon ||
    prior > input.curveFraction + epsilon
  ) {
    return "falling";
  }
  return "near_peak";
}

function headlineForDirection(
  label: string,
  direction: FishInRiverCurveDirection,
): string {
  if (direction === "rising") {
    return `${label} is historically expected and still increasing.`;
  }
  if (direction === "falling") {
    return `${label} is historically expected but now declining.`;
  }
  return `${label} is historically expected near the seasonal high point.`;
}

function alternateHeadlineForDirection(
  label: string,
  direction: FishInRiverCurveDirection,
): string {
  if (direction === "rising") {
    return `The historical presence curve is rising through the ${label.toLowerCase()} range.`;
  }
  if (direction === "falling") {
    return `The historical presence curve has eased into the ${label.toLowerCase()} range.`;
  }
  return "The historical presence curve is holding near its strongest seasonal level.";
}

function tipForDirection(direction: FishInRiverCurveDirection): string {
  if (direction === "rising") {
    return "The seasonal opportunity is still developing; compare Push for fresh-entry conditions and Fishability for river shape.";
  }
  if (direction === "falling") {
    return "Fish may remain after fresh arrivals slow; use Fishability for river shape and do not read this as a bite forecast.";
  }
  return "Historical presence is strongest around this part of the curve, but Fishability still determines how workable the river is.";
}

function alternateTipForDirection(
  direction: FishInRiverCurveDirection,
): string {
  if (direction === "rising") {
    return "Read this as growing seasonal presence, not proof of today's entry or catch rate.";
  }
  if (direction === "falling") {
    return "A falling seasonal curve can still leave fish in the system; it does not promise fresh fish or easy fishing.";
  }
  return "A high historical level adds seasonal confidence; it does not place fish at a specific spot.";
}

function displayLocalDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}`;
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
