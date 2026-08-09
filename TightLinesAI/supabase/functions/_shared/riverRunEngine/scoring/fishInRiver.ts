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
  resolveRunOpportunityCopyContext,
  type RunOpportunityCopyContext,
  type RunOpportunityStrength,
} from "../copy/opportunity.ts";
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
  historicalRunStrength: RunOpportunityStrength;
  curveFraction: number;
  curveDirection: FishInRiverCurveDirection;
  winterHoldingContext: boolean;
  handoffScore?: number;
};

export function scoreFishInRiver(
  run: Pick<
    RiverRunProfile,
    | "runWindow"
    | "historicalPresence"
    | "species"
    | "runType"
    | "handoff"
    | "runStageCopyStrategy"
  >,
  localDate: string,
): FishInRiverResult {
  const window = resolveActiveRunWindow(run, localDate);
  const stage = stageForDate(localDate, window);
  const opportunity = resolveRunOpportunityCopyContext(
    run.historicalPresence,
  );
  const riverCeiling = run.historicalPresence.maximum * 10;
  const winterHoldingContext = run.runType === "fall_entry" && !!run.handoff &&
    stage === "post_run" && compareLocalDates(localDate, window.endDate) > 0;
  if (winterHoldingContext) {
    const handoffScore = Math.round(
      riverCeiling * run.handoff!.retainedPresenceFraction,
    );
    const betsieHandoff = run.runStageCopyStrategy === "betsie_homestead";
    const stJosephHandoff = run.runStageCopyStrategy === "st_joseph_corridor";
    return {
      score: handoffScore,
      stage,
      maximum: 100,
      riverCeiling,
      historicalRunStrength: opportunity.strength,
      curveFraction: run.handoff!.retainedPresenceFraction,
      curveDirection: "outside",
      winterHoldingContext: true,
      handoffScore,
      label: "Winter holding",
      headline: betsieHandoff
        ? "Steelhead remain strongly present as the Betsie shifts into winter holding."
        : stJosephHandoff
        ? "Steelhead remain strongly present through the St. Joseph corridor as fall entry shifts into winter holding."
        : "Steelhead remain strongly present as the fishery shifts into winter holding.",
      detail: betsieHandoff
        ? `Fall entry finished at ${handoffScore}/100. That retained-presence reference is not a live activity score; the Betsie has no accepted water-temperature or flow sensor for judging today's feeding activity.`
        : stJosephHandoff
        ? `Fall entry finished at ${handoffScore}/100. That retained-presence reference applies across the accessible season, not equally to every reach; current Niles Activity is a response read for Niles only.`
        : `Fall entry finished at ${handoffScore}/100. That retained-presence reference stays visible, but it is not a winter activity score; winter opportunity depends on water temperature, feeding activity, and presentation.`,
      tip: betsieHandoff
        ? `Treat ${handoffScore}/100 as retained seasonal presence—not proof that fish are active today. Verify conditions directly and use controlled presentations in deep holding water outside the signed Homestead closure.`
        : stJosephHandoff
        ? `Treat ${handoffScore}/100 as retained seasonal presence—not proof of activity in every section. Start in deep, speed-controlled legal holding water near Niles, South Bend, or Mishawaka and verify that reach directly.`
        : `Open the Winter Holding read for current activity, likely holding water, and presentation guidance. Treat ${handoffScore}/100 as retained seasonal presence—not proof that fish are active today.`,
      reasonCodes: [
        stageReasonCode(stage),
        "historical_presence_curve",
        "fish_presence_winter_handoff",
      ],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  const curveFraction = historicalPresenceFraction({
    localDate,
    startDate: window.startDate,
    lateEndDate: window.lateEndDate,
    historicalPresence: run.historicalPresence,
  });
  const roundedScore = Math.round(curveFraction * riverCeiling);
  const score = curveFraction > 0
    ? clamp(Math.max(1, roundedScore), 0, riverCeiling)
    : 0;
  const offseason = compareLocalDates(localDate, window.preRunStartDate) < 0 ||
    compareLocalDates(localDate, window.postRunLateCopyEndDate) > 0;
  const label = fishInRiverLabel(score, curveFraction, stage, offseason);
  const curveDirection = resolveCurveDirection({
    run,
    localDate,
    startDate: window.startDate,
    lateEndDate: window.lateEndDate,
    curveFraction,
  });

  const copy = fishInRiverCopy({
    label,
    score,
    stage,
    direction: curveDirection,
    fractionOfRiverMaximum: curveFraction,
    species: anglerSpeciesName(run.species),
    opportunity,
    fallEntry: run.runType === "fall_entry",
  });
  const scopedCopy = run.runStageCopyStrategy === "st_joseph_corridor" &&
      label !== "Offseason"
    ? {
      ...copy,
      detail:
        `${copy.detail} This seasonal presence applies to the accessible St. Joseph corridor as a whole; it does not claim equal fish numbers at the harbor, Niles, South Bend, Mishawaka, or Twin Branch.`,
      tip:
        `${copy.tip} Use Migration Stage to choose the specific St. Joseph section, then verify that water directly.`,
    }
    : copy;
  return {
    score,
    stage,
    maximum: 100,
    riverCeiling,
    historicalRunStrength: opportunity.strength,
    curveFraction,
    curveDirection,
    winterHoldingContext: false,
    label,
    ...scopedCopy,
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
  offseason: boolean,
): string {
  if (offseason) return "Offseason";
  if (score === 0) {
    return stage === "pre_run" ? "Not expected yet" : "Migration complete";
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
  opportunity: RunOpportunityCopyContext;
  fallEntry: boolean;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const {
    label,
    score,
    stage,
    direction,
    fractionOfRiverMaximum,
    species,
    opportunity,
    fallEntry,
  } = input;
  if (label === "Offseason") {
    return {
      headline: `${species} are outside their river migration season.`,
      detail:
        `A dependable seasonal presence of ${species} is not expected in the river right now.`,
      tip:
        "Do not build a river trip around this species right now. Target a species with an active seasonal window and return as the next migration approaches.",
    };
  }
  if (score === 0 && stage === "pre_run") {
    return {
      headline: opportunity.strength === "strong"
        ? `${species} are not expected in meaningful numbers yet.`
        : opportunity.strength === "moderate"
        ? `A dependable presence of ${species} is not expected in the river yet.`
        : `Even a limited dependable presence of ${species} is not expected in the river yet.`,
      detail:
        `Most ${species} are not expected to have entered the river in dependable numbers. Any fish already present would be early exceptions.`,
      tip:
        "Treat this as no dependable in-river opportunity yet. Keep expectations at zero, and do not interpret an isolated early fish as evidence of dependable river presence.",
    };
  }
  if (score === 0) {
    const dependableOpportunity = opportunity.strength === "strong" &&
        opportunity.distributionScope === "broad"
      ? "a consistent river-wide opportunity"
      : opportunity.strength === "limited"
      ? "even a limited dependable opportunity"
      : "a consistent opportunity through the river's dependable sections";
    return {
      headline:
        "The season no longer supports a dependable in-river migration.",
      detail:
        `A few ${species} may remain, but their presence is likely isolated rather than part of ${dependableOpportunity}.`,
      tip:
        "Do not build a trip around scattered late fish. Shift to another seasonal species, and leave any actively spawning fish undisturbed.",
    };
  }

  if (fallEntry && (direction === "falling" || stage === "ending")) {
    return {
      headline: fractionOfRiverMaximum >= 0.9
        ? `${species} remain near their strongest fall presence as winter holding approaches.`
        : `${species} presence remains high as the fall fishery shifts toward winter holding.`,
      detail:
        "The slight decline reflects fewer fresh arrivals—not fish simply leaving the river. This is a seasonal opportunity estimate, not a live fish count.",
      tip:
        "Treat the retained presence as strong, but expect the fishery to be shifting away from fresh fall entry. Verify current river conditions before choosing a presentation.",
    };
  }

  return {
    headline: presenceHeadline(
      label,
      direction,
      fractionOfRiverMaximum,
      species,
      opportunity,
    ),
    detail: presenceDetail(
      label,
      direction,
      fractionOfRiverMaximum,
      opportunity,
    ),
    tip: presenceTip(
      label,
      direction,
      fractionOfRiverMaximum,
      opportunity,
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

function presenceHeadline(
  label: string,
  direction: FishInRiverCurveDirection,
  fractionOfRiverMaximum: number,
  species: string,
  opportunity: RunOpportunityCopyContext,
): string {
  if (
    opportunity.strength !== "strong" ||
    opportunity.distributionScope !== "broad"
  ) {
    return scaledPresenceHeadline(
      label,
      direction,
      fractionOfRiverMaximum,
      species,
      opportunity,
    );
  }
  if (direction === "rising") {
    if (label === "Low presence") {
      return `A small number of ${species} may be in the river, and seasonal presence is still building.`;
    }
    if (label === "Limited presence") {
      return `Some ${species} are likely in the river, but seasonal presence is still developing.`;
    }
    if (label === "Moderate presence") {
      return `A meaningful number of ${species} are likely in the river, with seasonal presence still building.`;
    }
    return `${species} are likely spread through more of the river as seasonal presence builds toward its strongest point.`;
  }
  if (direction === "falling") {
    if (label === "Peak presence") {
      return `Seasonal timing still supports ${species} being near their strongest in-river presence, even if the migration may be just beyond its usual peak.`;
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
  opportunity: RunOpportunityCopyContext,
): string {
  if (
    opportunity.strength !== "strong" ||
    opportunity.distributionScope !== "broad"
  ) {
    return scaledPresenceDetail(
      label,
      direction,
      fractionOfRiverMaximum,
      opportunity,
    );
  }
  const level = label.toLowerCase();
  if (direction === "rising") {
    if (fractionOfRiverMaximum >= 0.8) {
      return "The migration is approaching its strongest seasonal point, and fish are likely distributed through more of the river. This is a seasonal estimate, not a live fish count.";
    }
    if (label === "High presence") {
      return "Seasonal presence is usually elevated relative to the rest of the season, with more fish expected to enter and spread through the river. This is a seasonal estimate, not a live fish count.";
    }
    return `This part of the season usually brings ${level}, with more fish expected to enter and spread through the river. This is a seasonal estimate, not a live fish count.`;
  }
  if (direction === "falling") {
    if (label === "Peak presence") {
      return "This point in the season may sit just beyond the usual peak while the seasonal pattern still supports strong in-river presence. This is a seasonal estimate, not a live fish count.";
    }
    if (label === "High presence" && fractionOfRiverMaximum >= 0.8) {
      return "Seasonal presence remains elevated relative to the rest of the season, but fresh arrivals may be less consistent than around the usual peak. This is a seasonal estimate, not a live fish count.";
    }
    if (label === "High presence") {
      return "Seasonal presence is usually elevated relative to the rest of the season, while fresh arrivals often become less consistent later in the season. This is a seasonal estimate, not a live fish count.";
    }
    if (label === "Limited presence") {
      return "This part of the season usually supports limited presence concentrated in dependable holes and slower holding water. This is a seasonal estimate, not a live fish count.";
    }
    return `This part of the season usually supports ${level}, while fresh arrivals often become less consistent later in the season. This is a seasonal estimate, not a live fish count.`;
  }
  return `This is the part of the season when in-river presence is usually strongest. The read describes the river as a whole; it does not place fish in a specific pool or confirm a live count.`;
}

function presenceTip(
  label: string,
  direction: FishInRiverCurveDirection,
  fractionOfRiverMaximum: number,
  opportunity: RunOpportunityCopyContext,
): string {
  if (direction === "rising") {
    if (label === "Low presence") {
      return "Treat this as an early, low-odds river opportunity. Expect scattered results, and use direct fish activity before committing the full day.";
    }
    if (label === "Limited presence") {
      return "Plan for an emerging but uneven river opportunity. Cover water efficiently, and do not assume every promising stop holds fish.";
    }
    if (label === "Moderate presence") {
      if (opportunity.strength === "limited") {
        return "Plan for an improving but still limited river opportunity. Stay mobile, and require direct fish activity before slowing down.";
      }
      return "Plan for a credible river opportunity that is still improving. Stay mobile until direct fish activity gives you a reason to slow down.";
    }
    return `${
      risingHighContext(opportunity)
    } Give each stop a complete pass, but do not mistake this seasonal estimate for a live fish count.`;
  }
  if (direction === "falling") {
    if (label === "Peak presence" || label === "High presence") {
      if (opportunity.strength === "limited") {
        return "Treat this as near the high point of a limited seasonal opportunity. Focus on the most dependable water, and require direct fish activity before committing more time.";
      }
      const remainingContext = fractionOfRiverMaximum >= 0.8
        ? "Seasonal presence is still near its high point"
        : "A meaningful seasonal presence may remain";
      return `Plan around fish already likely to be in the river. ${remainingContext}, but remember that this seasonal estimate cannot tell whether a fresh wave is entering today.`;
    }
    if (label === "Moderate presence") {
      if (opportunity.strength === "limited") {
        return "Plan for a thinning, limited river opportunity. Expect substantial searching, and require direct fish activity before committing more time.";
      }
      return "Plan for a worthwhile but less consistent river opportunity. Expect more searching than near the seasonal high, and let direct fish activity determine how long you stay.";
    }
    if (label === "Limited presence") {
      return "Treat this as a lower-odds late-season opportunity. Keep the trip flexible, and require direct fish activity before committing more time.";
    }
    return "Treat any remaining fish as a bonus rather than a dependable trip plan. Keep expectations narrow and be ready to shift to another seasonal species.";
  }
  return peakPresenceTip(opportunity);
}

function risingHighContext(
  opportunity: RunOpportunityCopyContext,
): string {
  switch (opportunity.strength) {
    case "strong":
      return "Treat this as one of the stronger parts of a strong river season.";
    case "moderate":
      return "Treat this as one of the stronger parts of this river's moderate seasonal opportunity.";
    case "limited":
      return "Treat this as one of the better parts of the season, while remembering that this river's overall opportunity remains limited.";
  }
}

function peakPresenceTip(
  opportunity: RunOpportunityCopyContext,
): string {
  switch (opportunity.strength) {
    case "strong":
      return "Plan for the strongest seasonal presence this river usually offers, while remembering that this estimate cannot confirm fish at a specific spot or describe today's river conditions.";
    case "moderate":
      return "Plan for a dependable but potentially uneven river opportunity near its seasonal high point. Confirm fish activity before committing the full day.";
    case "limited":
      return "Treat this as the best part of this river's limited seasonal opportunity, not a high-abundance fishery. Require direct fish activity before committing more time.";
  }
}

function scaledPresenceHeadline(
  label: string,
  direction: FishInRiverCurveDirection,
  fractionOfRiverMaximum: number,
  species: string,
  opportunity: RunOpportunityCopyContext,
): string {
  const limited = opportunity.strength === "limited";
  const strong = opportunity.strength === "strong";
  if (direction === "rising") {
    if (label === "Low presence") {
      return limited
        ? `A few ${species} may be in the river, and this limited seasonal presence is still building.`
        : `A small number of ${species} may be in the river, and seasonal presence is still building.`;
    }
    if (label === "Limited presence") {
      return limited
        ? `A small number of ${species} are likely in the river, with this limited seasonal presence still developing.`
        : `Some ${species} are likely in the river, but seasonal presence is still developing.`;
    }
    if (label === "Moderate presence") {
      return limited
        ? `A smaller number of ${species} are likely in the river, with this limited seasonal presence still building toward its high point.`
        : strong
        ? `A meaningful number of ${species} are likely in the river, with seasonal presence still building.`
        : `A meaningful seasonal presence of ${species} is likely in the river and still building.`;
    }
    return limited
      ? `${species} are likely filling more of the river's dependable holding water as seasonal presence builds toward its strongest point.`
      : strong
      ? `${species} are likely spread through more dependable water as seasonal presence builds toward its strongest point.`
      : `${species} are likely present through more dependable river sections as seasonal presence builds toward its strongest point.`;
  }
  if (direction === "falling") {
    if (label === "Peak presence") {
      return `Seasonal timing still supports ${species} being near their strongest in-river presence, even if the migration may be just beyond its usual peak.`;
    }
    if (label === "High presence") {
      if (fractionOfRiverMaximum >= 0.8) {
        return limited
          ? `Seasonal timing still supports this limited ${species} presence holding near its seasonal high point in dependable water, even as the usual peak window may be easing.`
          : strong
          ? `Seasonal timing still supports strong ${species} presence through the river's dependable water, even as the usual peak window may be easing.`
          : `Seasonal timing still supports meaningful ${species} presence through dependable river sections, even as the usual peak window may be easing.`;
      }
      return limited
        ? `Seasonal timing still supports a smaller number of ${species} in the river's dependable holding water, although fresh arrivals may be less consistent than near peak.`
        : strong
        ? `Seasonal timing still supports ${species} being well established through the river's dependable water, although fresh arrivals may be less consistent than near peak.`
        : `Seasonal timing still supports ${species} through dependable river sections, although fresh arrivals may be less consistent than near peak.`;
    }
    if (label === "Moderate presence") {
      return limited
        ? `Seasonal timing still supports a smaller number of ${species}, especially in the river's most dependable holding water.`
        : `Seasonal timing still supports meaningful ${species} presence, especially in established holding water.`;
    }
    if (label === "Limited presence") {
      return limited
        ? `Seasonal timing still supports a few ${species} in the river's most dependable holding water, but this limited opportunity is thinning.`
        : `Seasonal timing still supports some ${species} in established holding water, but they are less likely to occupy every dependable section.`;
    }
    return limited
      ? `A few ${species} may still be in the river, with this limited seasonal presence increasingly scattered.`
      : `Some ${species} may still be in the river, with seasonal presence more likely to be scattered.`;
  }
  return limited
    ? `${species} are likely near their highest seasonal presence in the river, although the overall opportunity remains limited.`
    : `${species} are likely near their highest seasonal presence in the river.`;
}

function scaledPresenceDetail(
  label: string,
  direction: FishInRiverCurveDirection,
  fractionOfRiverMaximum: number,
  opportunity: RunOpportunityCopyContext,
): string {
  const level = label.toLowerCase();
  const limited = opportunity.strength === "limited";
  const strong = opportunity.strength === "strong";
  const distribution = opportunity.distributionScope === "broad"
    ? "through a broad part of the accessible river"
    : opportunity.distributionScope === "sectional"
    ? "through several dependable river sections"
    : "within a smaller set of dependable holding areas";
  if (direction === "rising") {
    if (fractionOfRiverMaximum >= 0.8) {
      return limited
        ? `The migration is approaching its strongest seasonal point, but its limited opportunity is most likely ${distribution}. This is a seasonal estimate, not a live fish count.`
        : `The migration is approaching its strongest seasonal point, and fish are likely distributed ${distribution}. This is a seasonal estimate, not a live fish count.`;
    }
    const entry = limited
      ? "a smaller number of fish expected to enter and occupy its most dependable water"
      : `more fish expected to enter and become established ${distribution}`;
    if (label === "High presence") {
      return `Seasonal presence is usually elevated relative to the rest of the season, with ${entry}. This is a seasonal estimate, not a live fish count.`;
    }
    return `This part of the season usually brings ${level}, with ${entry}. This is a seasonal estimate, not a live fish count.`;
  }
  if (direction === "falling") {
    if (label === "Peak presence") {
      const scale = limited
        ? "the limited seasonal opportunity remains near its high point"
        : strong
        ? `the seasonal pattern still supports strong in-river presence ${distribution}`
        : `the seasonal pattern still supports fish ${distribution}`;
      return `This point in the season may sit just beyond the usual peak while ${scale}. This is a seasonal estimate, not a live fish count.`;
    }
    if (label === "High presence" && fractionOfRiverMaximum >= 0.8) {
      const absoluteContext = limited
        ? "The overall seasonal opportunity remains limited"
        : `Fish are still likely established ${distribution}`;
      return `Seasonal presence remains elevated relative to the rest of the season. ${absoluteContext}, but fresh arrivals may be less consistent than around the usual peak. This is a seasonal estimate, not a live fish count.`;
    }
    if (label === "High presence") {
      const absoluteContext = limited
        ? "The overall seasonal opportunity remains limited"
        : `Fish are still likely established ${distribution}`;
      return `Seasonal presence is usually elevated relative to the rest of the season. ${absoluteContext}, while fresh arrivals often become less consistent later in the season. This is a seasonal estimate, not a live fish count.`;
    }
    if (label === "Limited presence") {
      return `This part of the season usually supports limited presence concentrated in the river's most dependable holes and slower holding water. This is a seasonal estimate, not a live fish count.`;
    }
    const scale = limited
      ? "within this river's limited seasonal opportunity"
      : distribution;
    return `This part of the season usually supports ${level} ${scale}, while fresh arrivals often become less consistent later in the season. This is a seasonal estimate, not a live fish count.`;
  }
  const scale = limited
    ? "Even at that high point, the overall seasonal opportunity remains limited."
    : `Fish are most likely distributed ${distribution}.`;
  return `This is the part of the season when in-river presence is usually strongest. ${scale} The read does not place fish in a specific pool or confirm a live count.`;
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
