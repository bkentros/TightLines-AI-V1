import type {
  HistoricalPresenceConfig,
  PrimitiveDisplay,
  RiverRunProfile,
  RiverRunReasonCode,
  RunStage,
} from "../types.ts";
import { RIVER_RUN_COPY_VERSION } from "../copy/version.ts";
import { anglerSpeciesName } from "../copy/species.ts";
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
  maximum: 100;
  riverCeiling: number;
  curveFraction: number;
  curveDirection: FishInRiverCurveDirection;
};

export function scoreFishInRiver(
  run: Pick<
    RiverRunProfile,
    "runWindow" | "historicalPresence" | "species"
  >,
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
  const riverCeiling = run.historicalPresence.maximum * 10;
  const roundedScore = Math.round(curveFraction * riverCeiling);
  const score = curveFraction > 0
    ? clamp(Math.max(1, roundedScore), 0, riverCeiling)
    : 0;
  const label = fishInRiverLabel(score, curveFraction, stage);
  const curveDirection = resolveCurveDirection({
    run,
    localDate,
    startDate: window.startDate,
    lateEndDate: window.lateEndDate,
    curveFraction,
  });

  return {
    score,
    stage,
    maximum: 100,
    riverCeiling,
    curveFraction,
    curveDirection,
    label,
    ...fishInRiverCopy({
      label,
      score,
      stage,
      direction: curveDirection,
      fractionOfRiverMaximum: curveFraction,
      species: anglerSpeciesName(run.species),
    }),
    reasonCodes: [
      stageReasonCode(stage),
      "historical_presence_curve",
    ],
    copyVersion: RIVER_RUN_COPY_VERSION,
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

function fishInRiverLabel(
  score: number,
  fractionOfRiverMaximum: number,
  stage: RunStage,
): string {
  if (score === 0) {
    return stage === "pre_run" ? "Not expected yet" : "Run complete";
  }
  if (fractionOfRiverMaximum <= 0.2) return "Low presence";
  if (fractionOfRiverMaximum <= 0.4) return "Limited presence";
  if (fractionOfRiverMaximum <= 0.6) return "Moderate presence";
  if (fractionOfRiverMaximum < 0.9) return "High presence";
  return "Peak presence";
}

function fishInRiverCopy(input: {
  label: string;
  score: number;
  stage: RunStage;
  direction: FishInRiverCurveDirection;
  fractionOfRiverMaximum: number;
  species: string;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const {
    label,
    score,
    stage,
    direction,
    fractionOfRiverMaximum,
    species,
  } = input;
  if (score === 0 && stage === "pre_run") {
    return {
      headline:
        `Meaningful numbers of ${species} are not expected in the river yet.`,
      detail:
        `Most ${species} are likely still in the lake or gathering near the harbor and river mouth. Any fish farther upstream would be early exceptions.`,
      tip:
        "Keep the trip at the harbor, river mouth, and first lake-to-river transition water. Do not spend the day searching inland river sections before dependable presence begins.",
    };
  }
  if (score === 0) {
    return {
      headline: "The season no longer supports a dependable in-river run.",
      detail:
        `A few ${species} may remain, but their presence is likely isolated rather than part of a consistent river-wide opportunity.`,
      tip:
        "Do not build a trip around scattered late fish. Shift to another seasonal species, and leave any actively spawning fish undisturbed.",
    };
  }

  return {
    headline: presenceHeadline(
      label,
      direction,
      fractionOfRiverMaximum,
      species,
    ),
    detail: presenceDetail(label, direction, fractionOfRiverMaximum),
    tip: presenceTip(label, direction, fractionOfRiverMaximum),
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

function presenceHeadline(
  label: string,
  direction: FishInRiverCurveDirection,
  fractionOfRiverMaximum: number,
  species: string,
): string {
  if (direction === "rising") {
    if (label === "Low presence") {
      return `A small number of ${species} may be in the river, and the run is still building.`;
    }
    if (label === "Limited presence") {
      return `Some ${species} are likely in the river, but the run is still developing.`;
    }
    if (label === "Moderate presence") {
      return `A meaningful number of ${species} are likely in the river, with the run still building.`;
    }
    return `${species} are likely spread through more of the river as the run builds toward its strongest point.`;
  }
  if (direction === "falling") {
    if (label === "Peak presence") {
      return `Seasonal timing still supports ${species} being near their strongest in-river presence, even if the run may be just beyond its usual peak.`;
    }
    if (label === "High presence") {
      if (fractionOfRiverMaximum >= 0.8) {
        return `Seasonal timing still supports strong ${species} presence across much of the river, even as the usual peak window may be easing.`;
      }
      return `Seasonal timing still supports ${species} being well distributed, although fresh arrivals may be less consistent than near peak.`;
    }
    if (label === "Moderate presence") {
      return `Seasonal timing still supports meaningful ${species} presence, especially in established holding water.`;
    }
    if (label === "Limited presence") {
      return `Seasonal timing still supports some ${species} in established holding water, but they are less likely to be spread throughout the river.`;
    }
    return `Some ${species} may still be in the river, with seasonal presence more likely to be scattered.`;
  }
  return `${species} are likely near their highest seasonal presence in the river.`;
}

function presenceDetail(
  label: string,
  direction: FishInRiverCurveDirection,
  fractionOfRiverMaximum: number,
): string {
  const level = label.toLowerCase();
  if (direction === "rising") {
    if (fractionOfRiverMaximum >= 0.8) {
      return "The run is approaching its strongest seasonal point, and fish are likely distributed through more of the river. This is a seasonal estimate, not a live fish count.";
    }
    return `This part of the season usually brings ${level}, with more fish expected to enter and spread through the river. This is a seasonal estimate, not a live fish count.`;
  }
  if (direction === "falling") {
    if (label === "Peak presence") {
      return "This point in the season may sit just beyond the usual peak while the seasonal pattern still supports strong in-river presence. This is a seasonal estimate, not a live fish count.";
    }
    if (label === "High presence" && fractionOfRiverMaximum >= 0.8) {
      return "This part of the season can still support strong in-river presence, but fresh arrivals may be less consistent than around the usual peak. This is a seasonal estimate, not a live fish count.";
    }
    if (label === "Limited presence") {
      return "This part of the season usually supports limited presence concentrated in dependable holes and slower holding water. This is a seasonal estimate, not a live fish count.";
    }
    return `This part of the season usually supports ${level}, while fresh arrivals often become less consistent later in the run. This is a seasonal estimate, not a live fish count.`;
  }
  return `This is the part of the season when in-river presence is usually strongest. The read describes the river as a whole; it does not place fish in a specific pool or confirm a live count.`;
}

function presenceTip(
  label: string,
  direction: FishInRiverCurveDirection,
  fractionOfRiverMaximum: number,
): string {
  if (direction === "rising") {
    if (label === "Low presence") {
      return "Stay in the lower river. Fish the first travel lane entering a deep bend or resting pocket, and do not skip upstream in search of numbers that have not developed yet.";
    }
    if (label === "Limited presence") {
      return "Begin on lower-river travel lanes and the first dependable holding holes. Move into the middle river only after those entry routes have been covered.";
    }
    if (label === "Moderate presence") {
      return "Start in middle-river holding water and keep moving between established holes. If Push is Possible or stronger, make lower travel lanes the next stop.";
    }
    return "Fish established holding water throughout the accessible river. Begin with substantial deep holes, and reserve lower travel lanes for a supportive Push read.";
  }
  if (direction === "falling") {
    if (label === "High presence" && fractionOfRiverMaximum >= 0.8) {
      return "Work established middle- and upper-river holes thoroughly, beginning with the deepest bends and resting water. Add lower travel lanes only when Push is Possible or stronger.";
    }
    if (label === "Peak presence" || label === "High presence") {
      return "Begin in established middle- and upper-river holding water and fish each hole thoroughly. If Push is Possible or stronger, finish with lower travel lanes for a late fresh wave.";
    }
    if (label === "Moderate presence") {
      return "Concentrate on the deepest established holes and slower current edges. Make fast travel water a brief final check rather than the center of the trip.";
    }
    if (label === "Limited presence") {
      return "Cover a short list of the best established holes from head to tail, then move on. Check lower travel lanes only when Push is Possible or stronger.";
    }
    return "Fish only the most durable deep holding water and slow edges. Treat broad river coverage and fast travel lanes as secondary unless Push supports fresh movement.";
  }
  return "Start with substantial deep holding water across the accessible river and fish each hole from head to tail. If Push is Possible or stronger, finish on lower travel lanes, and leave spawning fish undisturbed.";
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
