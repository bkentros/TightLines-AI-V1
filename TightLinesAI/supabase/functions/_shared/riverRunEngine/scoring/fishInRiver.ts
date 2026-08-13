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
  /** Public approximate value; score remains the exact engine value. */
  displayScore?: number;
  scoreIsApproximate?: boolean;
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
    run.runStageCopyStrategy !== "pere_marquette" &&
    run.runStageCopyStrategy !== "big_manistee_tailwater" &&
    run.runStageCopyStrategy !== "muskegon_croton_tailwater" &&
    run.runStageCopyStrategy !== "st_joseph_corridor" &&
    stage === "post_run" && compareLocalDates(localDate, window.endDate) > 0;
  if (
    (run.runStageCopyStrategy === "pere_marquette" ||
      run.runStageCopyStrategy === "betsie_homestead" ||
      run.runStageCopyStrategy === "big_manistee_tailwater" ||
      run.runStageCopyStrategy === "muskegon_croton_tailwater" ||
      run.runStageCopyStrategy === "st_joseph_corridor") &&
    run.runType === "fall_entry" && stage === "post_run"
  ) {
    const betsie = run.runStageCopyStrategy === "betsie_homestead";
    const bigManistee = run.runStageCopyStrategy === "big_manistee_tailwater";
    const muskegon = run.runStageCopyStrategy ===
      "muskegon_croton_tailwater";
    const stJoseph = run.runStageCopyStrategy === "st_joseph_corridor";
    return {
      score: null,
      displayScore: undefined,
      scoreIsApproximate: false,
      stage,
      maximum: 100,
      riverCeiling,
      historicalRunStrength: opportunity.strength,
      curveFraction: 0,
      curveDirection: "outside",
      winterHoldingContext: false,
      label: "Fall entry complete",
      headline: betsie
        ? "Betsie Steelhead fall entry is complete."
        : bigManistee
        ? "Big Manistee Steelhead fall entry is complete."
        : muskegon
        ? "Muskegon Steelhead fall entry is complete."
        : stJoseph
        ? "St. Joseph Steelhead fall entry is complete."
        : "PM Steelhead fall entry is complete.",
      detail:
        "Steelhead may remain in the river. This fall-entry model no longer estimates their current seasonal presence.",
      tip: `Check back ${
        seasonalReturnPhrase(window.stagingStartDate.slice(5))
      } when ${
        betsie
          ? "Betsie"
          : bigManistee
          ? "Big Manistee"
          : muskegon
          ? "Muskegon"
          : stJoseph
          ? "St. Joseph"
          : "PM"
      } fall movement tracking resumes.`,
      reasonCodes: [
        stageReasonCode(stage),
        "historical_presence_curve",
      ],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  const latePostRunContext = stage === "post_run" &&
    compareLocalDates(localDate, window.endDate) > 0 &&
    compareLocalDates(localDate, window.postRunLateCopyEndDate) <= 0;
  if (
    (run.runStageCopyStrategy === "betsie_homestead" ||
      run.runStageCopyStrategy === "big_manistee_tailwater" ||
      run.runStageCopyStrategy === "muskegon_croton_tailwater" ||
      run.runStageCopyStrategy === "st_joseph_corridor") &&
    run.runType === "fall_spawn" && stage === "post_run" &&
    !latePostRunContext
  ) {
    const species = anglerSpeciesName(run.species);
    const bigManistee = run.runStageCopyStrategy === "big_manistee_tailwater";
    const muskegon = run.runStageCopyStrategy ===
      "muskegon_croton_tailwater";
    const stJoseph = run.runStageCopyStrategy === "st_joseph_corridor";
    return {
      score: null,
      displayScore: undefined,
      scoreIsApproximate: false,
      stage,
      maximum: 100,
      riverCeiling,
      historicalRunStrength: opportunity.strength,
      curveFraction: 0,
      curveDirection: "outside",
      winterHoldingContext: false,
      label: "Fall run complete",
      headline: `The ${
        bigManistee
          ? "Big Manistee"
          : muskegon
          ? "Muskegon"
          : stJoseph
          ? "St. Joseph"
          : "Betsie"
      } ${species} fall run is complete.`,
      detail: `${species} staging typically begins ${
        seasonalReturnPhrase(window.stagingStartDate.slice(5))
      }. This seasonal estimate is inactive until then.`,
      tip: `Check back ${
        seasonalReturnPhrase(window.stagingStartDate.slice(5))
      } when ${
        bigManistee
          ? "Big Manistee"
          : muskegon
          ? "Muskegon"
          : stJoseph
          ? "St. Joseph"
          : "Betsie"
      } fall-run tracking resumes.`,
      reasonCodes: [stageReasonCode(stage), "historical_presence_curve"],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
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
        ? `Fall entry finished at ${handoffScore}/100. That retained-presence reference is not a live activity score; the Betsie has no water-temperature or flow sensor reliable enough to judge today's feeding activity.`
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
  // A date before the selected cycle's watch window is pre-run. Keep the
  // zero-presence state, but use "not expected yet" copy rather than claiming
  // that the upcoming annual run is already complete.
  const offseason = stage === "post_run" &&
    compareLocalDates(localDate, window.postRunLateCopyEndDate) > 0;
  const baseLabel = fishInRiverLabel(score, curveFraction, stage, offseason);
  const terminalCopyStrategy = run.runStageCopyStrategy === "pere_marquette" ||
    run.runStageCopyStrategy === "betsie_homestead" ||
    run.runStageCopyStrategy === "big_manistee_tailwater" ||
    run.runStageCopyStrategy === "muskegon_croton_tailwater" ||
    run.runStageCopyStrategy === "st_joseph_corridor";
  const label = terminalCopyStrategy &&
      baseLabel === "Offseason"
    ? "Fall run complete"
    : baseLabel;
  const displayScore = terminalCopyStrategy
    ? statePreservingDisplayScore(score, riverCeiling, label, stage, offseason)
    : undefined;
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
    pereMarquette: run.runStageCopyStrategy === "pere_marquette",
    betsie: run.runStageCopyStrategy === "betsie_homestead",
    bigManistee: run.runStageCopyStrategy === "big_manistee_tailwater",
    muskegon: run.runStageCopyStrategy === "muskegon_croton_tailwater",
    stJoseph: run.runStageCopyStrategy === "st_joseph_corridor",
    stagingStart: window.stagingStartDate.slice(5),
  });
  return {
    score,
    displayScore,
    scoreIsApproximate: displayScore != null && score > 0 &&
      score < riverCeiling,
    stage,
    maximum: 100,
    riverCeiling,
    historicalRunStrength: opportunity.strength,
    curveFraction,
    curveDirection,
    winterHoldingContext: false,
    label,
    ...copy,
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
  pereMarquette: boolean;
  betsie: boolean;
  bigManistee: boolean;
  muskegon: boolean;
  stJoseph: boolean;
  stagingStart: string;
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
  if (input.pereMarquette) {
    return pereMarquetteFishInRiverCopy(input);
  }
  if (input.betsie) return betsieFishInRiverCopy(input);
  if (input.bigManistee) return bigManisteeFishInRiverCopy(input);
  if (input.muskegon) return muskegonFishInRiverCopy(input);
  if (input.stJoseph) return stJosephFishInRiverCopy(input);
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

function stJosephFishInRiverCopy(input: {
  label: string;
  score: number;
  stage: RunStage;
  direction: FishInRiverCurveDirection;
  species: string;
  opportunity: RunOpportunityCopyContext;
  fallEntry: boolean;
  stagingStart: string;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (input.label === "Offseason" || input.label === "Fall run complete") {
    return {
      headline: `The St. Joseph ${input.species} fall run is complete.`,
      detail: `${input.species} staging typically begins ${
        seasonalReturnPhrase(input.stagingStart)
      }. This seasonal estimate is inactive until then.`,
      tip: `Check back ${
        seasonalReturnPhrase(input.stagingStart)
      } when St. Joseph fall-run tracking resumes.`,
    };
  }
  if (input.score === 0 && input.stage === "pre_run") {
    return {
      headline:
        `Dependable ${input.species} presence is not expected in the St. Joseph yet.`,
      detail:
        "The seasonal estimate remains at zero. Any river fish would be an early exception.",
      tip: "Use Migration Stage for harbor and river-entry context.",
    };
  }
  if (input.score === 0) {
    return {
      headline:
        `The St. Joseph ${input.species} migration no longer has dependable seasonal presence.`,
      detail:
        "The seasonal estimate has reached zero. Isolated late fish are not a dependable migration opportunity.",
      tip: "Do not build a three-section search around isolated late fish.",
    };
  }
  const level = input.label.replace(/ presence$/i, "").toLowerCase();
  const direction = input.direction === "rising"
    ? "building"
    : input.direction === "falling"
    ? "declining"
    : "holding steady";
  return {
    headline: input.label === "Peak presence"
      ? `Seasonal ${input.species} presence is near its expected St. Joseph peak.`
      : `Seasonal ${input.species} presence is ${level} and ${direction}.`,
    detail:
      `This is a whole-corridor seasonal estimate relative to the St. Joseph ${input.species} ceiling, not a fish count or equal distribution.`,
    tip:
      "Use Migration Stage to choose a section, then verify that water directly.",
  };
}

function bigManisteeFishInRiverCopy(input: {
  label: string;
  score: number;
  stage: RunStage;
  direction: FishInRiverCurveDirection;
  species: string;
  opportunity: RunOpportunityCopyContext;
  stagingStart: string;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (input.label === "Offseason" || input.label === "Fall run complete") {
    return {
      headline: `The Big Manistee ${input.species} fall run is complete.`,
      detail: `${input.species} staging typically begins ${
        seasonalReturnPhrase(input.stagingStart)
      }. This seasonal estimate is inactive until then.`,
      tip: `Check back ${
        seasonalReturnPhrase(input.stagingStart)
      } when Big Manistee fall-run tracking resumes.`,
    };
  }
  if (input.score === 0 && input.stage === "pre_run") {
    return {
      headline:
        `Dependable ${input.species} presence is not expected in the Big Manistee yet.`,
      detail:
        "The seasonal estimate remains at zero. Any river fish would be an early exception.",
      tip:
        "Use Migration Stage for Manistee Lake, harbor, and river-entrance context.",
    };
  }
  if (input.score === 0) {
    return {
      headline:
        `The Big Manistee ${input.species} migration no longer has dependable seasonal presence.`,
      detail:
        "The seasonal estimate has reached zero. Isolated late fish are not a dependable migration opportunity.",
      tip: "Do not build a three-section search around isolated late fish.",
    };
  }
  const level = input.label.replace(/ presence$/i, "").toLowerCase();
  const direction = input.direction === "rising"
    ? "building"
    : input.direction === "falling"
    ? "declining"
    : "holding steady";
  return {
    headline: input.label === "Peak presence"
      ? `Seasonal ${input.species} presence is near its expected Big Manistee peak.`
      : `Seasonal ${input.species} presence is ${level} and ${direction}.`,
    detail:
      `This is a whole-corridor seasonal estimate relative to the Big Manistee ${input.species} ceiling, not a fish count or equal distribution.`,
    tip:
      "Use Migration Stage to choose a section, then verify that water directly.",
  };
}

function muskegonFishInRiverCopy(input: {
  label: string;
  score: number;
  stage: RunStage;
  direction: FishInRiverCurveDirection;
  species: string;
  opportunity: RunOpportunityCopyContext;
  stagingStart: string;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (input.label === "Offseason" || input.label === "Fall run complete") {
    return {
      headline: `The Muskegon ${input.species} fall run is complete.`,
      detail: `${input.species} staging typically begins ${
        seasonalReturnPhrase(input.stagingStart)
      }. This seasonal estimate is inactive until then.`,
      tip: `Check back ${
        seasonalReturnPhrase(input.stagingStart)
      } when Muskegon fall-run tracking resumes.`,
    };
  }
  if (input.score === 0 && input.stage === "pre_run") {
    return {
      headline:
        `Dependable ${input.species} presence is not expected in the Muskegon River yet.`,
      detail:
        "The seasonal estimate remains at zero. Any river fish would be an early exception.",
      tip:
        "Use Migration Stage for Muskegon Lake, channel, and river-entrance context.",
    };
  }
  if (input.score === 0) {
    return {
      headline:
        `The Muskegon ${input.species} migration no longer has dependable seasonal presence.`,
      detail:
        "The seasonal estimate has reached zero. Isolated late fish are not a dependable migration opportunity.",
      tip: "Do not build a three-section search around isolated late fish.",
    };
  }
  const level = input.label.replace(/ presence$/i, "").toLowerCase();
  const direction = input.direction === "rising"
    ? "building"
    : input.direction === "falling"
    ? "declining"
    : "holding steady";
  return {
    headline: input.label === "Peak presence"
      ? `Seasonal ${input.species} presence is near its expected Muskegon peak.`
      : `Seasonal ${input.species} presence is ${level} and ${direction}.`,
    detail:
      `This is a whole-corridor seasonal estimate relative to the Muskegon ${input.species} ceiling, not a fish count or equal distribution.`,
    tip:
      "Use Migration Stage to choose a section, then verify that water directly.",
  };
}

function betsieFishInRiverCopy(input: {
  label: string;
  score: number;
  stage: RunStage;
  direction: FishInRiverCurveDirection;
  species: string;
  opportunity: RunOpportunityCopyContext;
  stagingStart: string;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (input.label === "Offseason" || input.label === "Fall run complete") {
    return {
      headline: `The Betsie ${input.species} fall run is complete.`,
      detail: `${input.species} staging typically begins ${
        seasonalReturnPhrase(input.stagingStart)
      }. This seasonal estimate is inactive until then.`,
      tip: `Check back ${
        seasonalReturnPhrase(input.stagingStart)
      } when Betsie fall-run tracking resumes.`,
    };
  }
  if (input.score === 0 && input.stage === "pre_run") {
    return {
      headline:
        `Dependable ${input.species} presence is not expected in the Betsie yet.`,
      detail:
        "The seasonal estimate remains at zero. Any river fish would be an early exception.",
      tip: "Use Migration Stage for lake and harbor staging context.",
    };
  }
  if (input.score === 0) {
    return {
      headline:
        `The Betsie ${input.species} migration no longer has dependable seasonal presence.`,
      detail:
        "The seasonal estimate has reached zero. Isolated late fish are not a dependable migration opportunity.",
      tip:
        "Do not build a two-reach search around isolated late fish. Leave spawning fish undisturbed.",
    };
  }
  const level = input.label.replace(/ presence$/i, "").toLowerCase();
  const headline = input.label === "Peak presence"
    ? input.direction === "falling"
      ? `Seasonal ${input.species} presence remains near its peak but is declining.`
      : `Seasonal ${input.species} presence is at its expected peak.`
    : `Seasonal ${input.species} presence is ${level} and ${
      input.direction === "rising"
        ? "building"
        : input.direction === "falling"
        ? "declining"
        : "holding steady"
    }.`;
  const strength = input.opportunity.strength === "limited"
    ? "limited"
    : input.opportunity.strength === "moderate"
    ? "moderate"
    : "strong";
  const scope = input.opportunity.distributionScope === "sectional"
    ? "dependable presence can differ between the two reaches"
    : input.opportunity.distributionScope === "concentrated"
    ? "dependable presence concentrates in select water"
    : "fish can use both reaches";
  return {
    headline,
    detail: `Expected Betsie run strength is ${strength}. ${
      scope[0].toUpperCase()
    }${scope.slice(1)}.`,
    tip:
      "Use Migration Stage to choose between the Betsie Lake–US-31 and US-31–Homestead reaches.",
  };
}

function pereMarquetteFishInRiverCopy(input: {
  label: string;
  score: number;
  stage: RunStage;
  direction: FishInRiverCurveDirection;
  fractionOfRiverMaximum: number;
  species: string;
  opportunity: RunOpportunityCopyContext;
  fallEntry: boolean;
  stagingStart: string;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (input.label === "Offseason" || input.label === "Fall run complete") {
    return {
      headline: `The PM ${input.species} fall run is complete.`,
      detail: `${input.species} staging typically begins ${
        seasonalReturnPhrase(input.stagingStart)
      }. This seasonal estimate is inactive until then.`,
      tip: `Check back ${
        seasonalReturnPhrase(input.stagingStart)
      } when the PM fall-run model resumes.`,
    };
  }
  if (input.score === 0 && input.stage === "pre_run") {
    return {
      headline:
        `Dependable ${input.species} presence is not expected in the PM river yet.`,
      detail:
        "The seasonal estimate remains at zero. Any fish already in the river would be an early exception.",
      tip:
        "Use Migration Stage for nearby staging context. Do not treat one early fish as a dependable river opportunity.",
    };
  }
  if (input.score === 0) {
    return {
      headline:
        `The PM ${input.species} migration no longer has dependable seasonal presence.`,
      detail:
        "The seasonal estimate has reached zero. Isolated late fish are not a dependable migration opportunity.",
      tip:
        "Do not build a broad river search around isolated late fish. Leave actively spawning fish undisturbed.",
    };
  }
  const direction = input.direction === "rising"
    ? "building"
    : input.direction === "falling"
    ? "declining"
    : "near its seasonal high";
  const levelContext = input.direction === "rising"
    ? "increasing as the fall migration builds"
    : input.direction === "falling"
    ? "declining as the fall migration advances"
    : "near its expected seasonal high";
  const strength = input.opportunity.strength === "limited"
    ? "Limited"
    : input.opportunity.strength === "moderate"
    ? "Moderate"
    : "Strong";
  const scope = input.opportunity.distributionScope === "concentrated"
    ? "the opportunity concentrates in dependable holding water"
    : input.opportunity.distributionScope === "sectional"
    ? "the opportunity centers on dependable river sections"
    : "the opportunity can extend across broadly accessible water";
  const strengthAndScope =
    `For the PM, expected run strength is ${strength}, and ${scope}.`;
  const relativeLevel = input.label === "High presence"
    ? "high for this fall migration"
    : input.label === "Peak presence"
    ? "at its expected seasonal peak"
    : `at ${input.label.toLowerCase()}`;
  return {
    headline:
      `${input.species} seasonal presence is ${input.label.toLowerCase()} and ${direction}.`,
    detail:
      `Calendar timing places ${input.species} presence ${relativeLevel}, ${levelContext}. ${strengthAndScope} This is not a live fish count or today’s conditions.`,
    tip:
      "Use Migration Stage to choose a section. Use Push and Activity for current movement support and responsiveness.",
  };
}

function statePreservingDisplayScore(
  score: number,
  riverCeiling: number,
  label: string,
  stage: RunStage,
  offseason: boolean,
): number {
  if (score === 0 || score === riverCeiling) return score;
  const candidates = Array.from(
    { length: Math.floor(riverCeiling / 5) + 1 },
    (_, index) => index * 5,
  );
  if (!candidates.includes(riverCeiling)) candidates.push(riverCeiling);
  const matching = candidates.filter((candidate) =>
    fishInRiverLabel(
      candidate,
      riverCeiling > 0 ? candidate / riverCeiling : 0,
      stage,
      offseason,
    ) === label
  );
  return (matching.length ? matching : candidates).toSorted((a, b) =>
    Math.abs(a - score) - Math.abs(b - score) || a - b
  )[0];
}

function seasonalReturnPhrase(monthDay: string): string {
  const month = Number(monthDay.slice(0, 2));
  const day = Number(monthDay.slice(3, 5));
  const period = day <= 10 ? "in early" : day <= 20 ? "in mid" : "in late";
  const monthName = [
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
  ][month - 1];
  return `${period} ${monthName}`;
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
