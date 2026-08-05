import type { PrimitiveDisplay, RiverRunProfile, RunStage } from "../types.ts";
import { RIVER_RUN_COPY_VERSION } from "../copy/version.ts";
import { anglerSpeciesName } from "../copy/species.ts";
import {
  resolveRunOpportunityCopyContext,
  type RunOpportunityCopyContext,
} from "../copy/opportunity.ts";
import {
  compareLocalDates,
  type DateWindow,
  resolveActiveRunWindow,
} from "../metrics/dateWindow.ts";

export type RunStageResult = PrimitiveDisplay & {
  stage: RunStage;
  stagingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
  window: DateWindow;
};

export function resolveRunStage(
  run: Pick<
    RiverRunProfile,
    "runWindow" | "historicalPresence" | "species" | "runType" | "handoff"
  >,
  localDate: string,
): RunStageResult {
  const window = resolveActiveRunWindow(run, localDate);
  const stage = stageForDate(localDate, window);
  const stagingContext = stage === "pre_run" &&
    compareLocalDates(localDate, window.stagingStartDate) >= 0;
  const establishedBuildingContext = stage === "building" &&
    compareLocalDates(localDate, window.buildingEstablishedStartDate) >= 0;
  const broadBuildingContext = establishedBuildingContext &&
    !!window.buildingBroadStartDate &&
    compareLocalDates(localDate, window.buildingBroadStartDate) >= 0;
  const latePostRunContext = stage === "post_run" &&
    compareLocalDates(localDate, window.endDate) > 0 &&
    compareLocalDates(localDate, window.postRunLateCopyEndDate) <= 0;
  const winterHoldingContext = run.runType === "fall_entry" && !!run.handoff &&
    stage === "post_run" && compareLocalDates(localDate, window.endDate) > 0;

  const opportunity = resolveRunOpportunityCopyContext(run.historicalPresence);
  if (run.runType === "fall_entry") {
    const copy = fallEntryStageCopy({
      stage,
      stagingContext,
      establishedBuildingContext,
      broadBuildingContext,
      winterHoldingContext,
      species: anglerSpeciesName(run.species),
    });
    return {
      stage,
      stagingContext,
      broadBuildingContext,
      winterHoldingContext,
      window,
      label: fallEntryStageLabel(stage, winterHoldingContext),
      ...copy,
      reasonCodes: [
        stageReasonCode(stage),
        ...(winterHoldingContext ? ["stage_winter_holding" as const] : []),
        ...(stage === "post_run" && !winterHoldingContext
          ? ["stage_offseason" as const]
          : []),
        ...(stagingContext ? ["stage_pre_run_staging" as const] : []),
      ],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  return {
    stage,
    stagingContext,
    broadBuildingContext: false,
    winterHoldingContext: false,
    window,
    label: stageLabel(stage, latePostRunContext),
    ...stageCopy(
      stage,
      stagingContext,
      establishedBuildingContext,
      latePostRunContext,
      anglerSpeciesName(run.species),
      opportunity,
    ),
    whereToStart: whereToStartCopy(
      stage,
      stagingContext,
      establishedBuildingContext,
      latePostRunContext,
      opportunity,
    ),
    reasonCodes: [
      stageReasonCode(stage),
      ...(stage === "post_run" && !latePostRunContext
        ? ["stage_offseason" as const]
        : []),
      ...(stagingContext ? ["stage_pre_run_staging" as const] : []),
    ],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function fallEntryStageLabel(
  stage: RunStage,
  winterHoldingContext: boolean,
): string {
  if (winterHoldingContext) return "Winter holding";
  switch (stage) {
    case "pre_run":
      return "Before migration";
    case "beginning":
      return "Beginning";
    case "building":
      return "Building";
    case "peak":
      return "Peak";
    case "tapering":
      return "Late fall";
    case "ending":
      return "Holding transition";
    case "post_run":
      return "Offseason";
  }
}

function fallEntryStageCopy(input: {
  stage: RunStage;
  stagingContext: boolean;
  establishedBuildingContext: boolean;
  broadBuildingContext: boolean;
  winterHoldingContext: boolean;
  species: string;
}): Pick<PrimitiveDisplay, "headline" | "whereToStart" | "detail" | "tip"> {
  if (input.winterHoldingContext) {
    return {
      headline:
        `${input.species} have transitioned from fall entry into winter holding.`,
      whereToStart:
        "Deep, slow winter holding water with nearby current and an easy feeding lane.",
      detail:
        "Fish can remain distributed through the river, but colder water shifts the question from upstream movement to daily activity and feeding position.",
      tip:
        "Open the Winter Holding read for current activity, likely holding water, and presentation guidance. A completed fall-entry read does not mean steelhead have left the river.",
    };
  }
  switch (input.stage) {
    case "pre_run":
      return input.stagingContext
        ? {
          headline:
            `${input.species} may be gathering near the river mouth, and an occasional early fish could enter the lower river.`,
          whereToStart:
            "Harbor, river mouth, and one deliberate check of the first deep lower-river travel lane.",
          detail:
            "An early fish is possible, especially as late September approaches, but dependable fall presence has not developed yet. Treat an isolated catch as an exception, not proof that the river has filled in.",
          tip:
            "Keep most effort near the lake-to-river transition and wait for Fish In River to confirm a dependable seasonal build before committing inland.",
        }
        : {
          headline: `${input.species} fall entry has not started yet.`,
          whereToStart:
            "Lake, harbor, and river mouth—not inland river sections.",
          detail:
            "A dependable fall steelhead presence is not expected in the river this early.",
          tip:
            "Do not build an inland river trip around this species yet. Return when early monitoring begins.",
        };
    case "beginning":
      return {
        headline:
          `The first ${input.species} are beginning to enter the river.`,
        whereToStart:
          "Lower river: travel lanes that feed the first deep bends, resting pockets, and current breaks.",
        detail:
          "Fresh fish may be present, but numbers are still scattered and can arrive in uneven waves before the broader fall fishery develops.",
        tip:
          "Cover lower travel water and its first dependable resting holes, then move upstream only after those entry sections have been checked.",
      };
    case "building":
      if (input.broadBuildingContext) {
        return {
          headline:
            `${input.species} are now broadly established through the accessible river.`,
          whereToStart:
            "Middle and upper river holding water, with lower travel lanes added when Push supports fresh arrivals.",
          detail:
            "By November, multiple entry periods have given steelhead time to spread through lower, middle, and upper sections wherever passage is open. The upper river is now a primary option, even though dependable concentrations can remain in lower and middle holding water.",
          tip:
            "Choose a middle- or upper-river section and cover its substantial holes, deep bends, and current breaks. Shift extra attention lower only when Push supports a fresh wave entering the river.",
        };
      }
      return input.establishedBuildingContext
        ? {
          headline:
            `${input.species} are becoming established across much more of the river.`,
          whereToStart:
            "Lower and middle holding water first, while recognizing that fish can already be present into the upper river wherever passage is open.",
          detail:
            "By this stage, earlier arrivals have had time to reach lower, middle, and upper sections while newer fish continue entering. Fish may be distributed broadly, but the most dependable concentrations are often still in lower- and middle-river holding water.",
          tip:
            "Begin in dependable lower- or middle-river holding water and work deep holes, outside bends, and current breaks. Move into upper sections when direct fish activity or local knowledge supports it, and use Push to decide whether lower travel lanes deserve extra attention.",
        }
        : {
          headline:
            `More ${input.species} are entering and spreading through the river.`,
          whereToStart:
            "Lower to middle river, where travel water feeds dependable holding holes.",
          detail:
            "Presence is building beyond isolated early fish, although arrivals and concentrations can still be uneven from section to section.",
          tip:
            "Start where lower-river travel water meets the first substantial holding holes, then work into the middle river instead of waiting in one spot.",
        };
    case "peak":
      return {
        headline:
          `This is typically the strongest and most dependable fall ${input.species} opportunity.`,
        whereToStart:
          "Throughout the accessible river, focusing on substantial holding water connected to productive current.",
        detail:
          "Multiple waves have had time to spread from lower travel lanes into established middle- and upper-river holding water. Fish can be broadly distributed wherever passage is open.",
        tip:
          "Choose an accessible section and cover each substantial hole from the head through its seams and tail. Let Push decide whether lower travel lanes deserve extra time.",
      };
    case "tapering":
      return {
        headline:
          `${input.species} presence remains high as the fall fishery begins shifting toward winter holding.`,
        whereToStart:
          "Established middle- and upper-river holes, deeper bends, and slower edges beside productive current.",
        detail:
          "Fish remain broadly available, but colder water gradually shifts the balance from active upstream movement toward established holding. Fresh arrivals can still occur without defining the whole fishery.",
        tip:
          "Start with dependable holding water. Check lower travel lanes only when Push shows a credible movement signal.",
      };
    case "ending":
      return {
        headline:
          `${input.species} remain strongly present while fall entry transitions toward winter holding.`,
        whereToStart:
          "Deep established holes and slower current edges with nearby feeding water.",
        detail:
          "The fish have not simply left the river. Colder water reduces the importance of fresh upstream movement and increases the importance of where steelhead can hold efficiently through winter.",
        tip:
          "Prioritize deep, speed-controlled holding water and use Push only as a secondary fresh-arrival check. The winter fishery read takes over after this stage.",
      };
    case "post_run":
      return {
        headline: `${input.species} are outside their fall-entry season.`,
        whereToStart:
          "No dependable fall-entry location is expected right now.",
        detail:
          "This fall model is inactive. It should not be used to infer winter or spring steelhead behavior.",
        tip:
          "Use the active seasonal steelhead experience rather than applying fall-entry guidance outside its window.",
      };
  }
}

export function stageForDate(localDate: string, window: DateWindow): RunStage {
  if (compareLocalDates(localDate, window.preRunStartDate) < 0) {
    return "post_run";
  }
  if (compareLocalDates(localDate, window.startDate) < 0) return "pre_run";
  if (compareLocalDates(localDate, window.beginningEndDate) <= 0) {
    return "beginning";
  }
  if (compareLocalDates(localDate, window.peakStartDate) < 0) {
    return "building";
  }
  if (compareLocalDates(localDate, window.peakEndDate) <= 0) return "peak";
  if (compareLocalDates(localDate, window.taperingEndDate) <= 0) {
    return "tapering";
  }
  if (compareLocalDates(localDate, window.endDate) <= 0) return "ending";
  return "post_run";
}

function stageLabel(stage: RunStage, latePostRunContext: boolean): string {
  switch (stage) {
    case "pre_run":
      return "Before migration";
    case "beginning":
      return "Beginning";
    case "building":
      return "Building";
    case "peak":
      return "Peak";
    case "tapering":
      return "Tapering";
    case "ending":
      return "Ending";
    case "post_run":
      return latePostRunContext ? "After migration" : "Offseason";
  }
}

function whereToStartCopy(
  stage: RunStage,
  stagingContext: boolean,
  establishedBuildingContext: boolean,
  latePostRunContext: boolean,
  opportunity: RunOpportunityCopyContext,
): string {
  switch (stage) {
    case "pre_run":
      return stagingContext
        ? "Harbor, river mouth, and the first deep lower-river travel lane."
        : "Lake, harbor, and river mouth—not inland river sections.";
    case "beginning":
      return "Lower river: the first deep bends and resting pockets beside the main travel lane.";
    case "building":
      if (!establishedBuildingContext) {
        return opportunity.distributionScope === "concentrated"
          ? "The first dependable lower-river holding water."
          : "Lower to middle river, where travel water feeds dependable holding holes.";
      }
      return opportunity.distributionScope === "broad"
        ? "Middle and upper holding water, with lower travel lanes for newer arrivals."
        : opportunity.distributionScope === "sectional"
        ? "Established middle-river holding sections, with lower lanes for newer arrivals."
        : "The river's most dependable established holding holes.";
    case "peak":
      if (opportunity.distributionScope === "concentrated") {
        return "The river's most dependable holding and spawning areas.";
      }
      if (opportunity.distributionScope === "sectional") {
        return "Several dependable river sections, wherever passage remains open.";
      }
      return opportunity.strength === "strong"
        ? "Throughout the accessible river, from lower travel water into upstream holding areas."
        : opportunity.strength === "moderate"
        ? "Across a broad part of the accessible river, though concentrations may be uneven."
        : "Scattered through accessible holding water; do not expect equal numbers everywhere.";
    case "tapering":
      return opportunity.distributionScope === "broad"
        ? "Established middle- and upper-river holding water; check lower lanes only for a fresh movement signal."
        : opportunity.distributionScope === "sectional"
        ? "The river's established holding sections and deepest slower edges."
        : "The most dependable deep holding holes and slower edges.";
    case "ending":
      return "Deep established holding water and slow current edges—not fast travel lanes.";
    case "post_run":
      return latePostRunContext
        ? "No dependable starting section; any remaining fish are likely isolated in deep established holding water."
        : "No dependable river location for this species right now.";
  }
}

function stageCopy(
  stage: RunStage,
  stagingContext: boolean,
  establishedBuildingContext: boolean,
  latePostRunContext: boolean,
  species: string,
  opportunity: RunOpportunityCopyContext,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  switch (stage) {
    case "pre_run":
      if (stagingContext) {
        return {
          headline:
            `${species} may be gathering near the river mouth, and a few early fish could be in the river.`,
          detail: stagingDetail(species, opportunity),
          tip:
            "Fish the harbor and river mouth first, then make one deliberate check of the first deep lower-river travel lane. Skip a middle- or upper-river trip until fish become dependable in the river.",
        };
      }
      return {
        headline: `${species} have not started entering the river yet.`,
        detail: beforeStagingDetail(species, opportunity),
        tip:
          "Keep the trip in the lake, harbor, and river-mouth zone. Do not spend the day searching inland river water before the seasonal migration begins.",
      };
    case "beginning":
      return {
        headline: `The first ${species} are beginning to enter the river.`,
        detail: beginningDetail(species, opportunity),
        tip:
          "Begin in the lower river. Fish the first deep bends and short resting pockets off the main travel lane, then move upstream only after the lower section has been covered.",
      };
    case "building":
      if (establishedBuildingContext) {
        return establishedBuildingCopy(species, opportunity);
      }
      return {
        headline: `More ${species} are beginning to move into the river.`,
        detail: earlyBuildingDetail(species, opportunity),
        tip:
          "Start where lower-river travel water enters the first dependable holding holes. Cover those holes from head to tail, then continue into the middle river instead of waiting in one lower-river spot.",
      };
    case "peak":
      return peakCopy(species, opportunity);
    case "tapering":
      return taperingCopy(species, opportunity);
    case "ending":
      return endingCopy(species, opportunity);
    case "post_run":
      if (!latePostRunContext) {
        return {
          headline: `${species} are outside their river migration season.`,
          detail:
            `A dependable seasonal presence of ${species} is not expected in the river right now.`,
          tip:
            "Do not build a river trip around this species right now. Target a species with an active seasonal window and return to this read as the next migration approaches.",
        };
      }
      return latePostRunCopy(species, opportunity);
  }
}

function stagingDetail(
  species: string,
  opportunity: RunOpportunityCopyContext,
): string {
  const ending = opportunity.strength === "strong"
    ? "dependable river numbers have not developed yet."
    : opportunity.strength === "moderate"
    ? "a dependable opportunity in the river has not developed yet."
    : "a dependable river opportunity—even a limited one—has not developed yet.";
  return `Most ${species} are still expected near the lake, harbor, or river mouth. The earliest arrivals can occasionally slip into the lower river, but ${ending}`;
}

function beforeStagingDetail(
  species: string,
  opportunity: RunOpportunityCopyContext,
): string {
  const expectation = opportunity.strength === "strong"
    ? "meaningful numbers in the river"
    : opportunity.strength === "moderate"
    ? "a dependable river presence"
    : "even a limited dependable river presence";
  return `Most ${species} are still expected to be in the lake, so ${expectation} is unlikely right now.`;
}

function beginningDetail(
  species: string,
  opportunity: RunOpportunityCopyContext,
): string {
  if (opportunity.strength === "strong") {
    return `Fresh ${species} may be entering the river, but numbers can still be scattered and inconsistent this early.`;
  }
  if (opportunity.strength === "moderate") {
    return `Fresh ${species} may be entering the river, but the developing opportunity can still be scattered and inconsistent this early.`;
  }
  return `A small number of fresh ${species} may be entering the river, but this limited opportunity can still be scattered and inconsistent this early.`;
}

function earlyBuildingDetail(
  species: string,
  opportunity: RunOpportunityCopyContext,
): string {
  const subject = opportunity.strength === "strong"
    ? `More ${species}`
    : opportunity.strength === "moderate"
    ? `Additional ${species}`
    : `A few additional ${species}`;
  const spread = opportunity.distributionScope === "broad"
    ? "spread upstream"
    : opportunity.distributionScope === "sectional"
    ? "spread into dependable river sections"
    : "settle into the river's most dependable holding water";
  return `${subject} are typically entering and beginning to ${spread}, although arrivals can still come in uneven waves.`;
}

function establishedBuildingCopy(
  species: string,
  opportunity: RunOpportunityCopyContext,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (
    opportunity.strength === "strong" &&
    opportunity.distributionScope === "broad"
  ) {
    return {
      headline: `${species} are spreading across much more of the river.`,
      detail:
        `Earlier waves have had time to travel well upstream while later ${species} may continue to enter. Fish can now be spread from lower travel lanes into upper holding water wherever passage is open.`,
      tip:
        "Begin in established middle-river holding water, then work upstream through deep holes, outside bends, and current breaks. If Push is Possible or stronger, finish with a deliberate lower-river travel-lane check.",
    };
  }
  const headline = opportunity.strength === "limited"
    ? `${species} are becoming established within the river's most dependable sections.`
    : `${species} are becoming established through more dependable river sections.`;
  const distribution = opportunity.distributionScope === "broad"
    ? "through a broad part of the accessible river"
    : opportunity.distributionScope === "sectional"
    ? "through several dependable river sections"
    : "within a smaller set of dependable holding areas";
  const amount = opportunity.strength === "strong"
    ? "Good numbers of fish"
    : opportunity.strength === "limited"
    ? "A smaller number of fish"
    : "Fish";
  return {
    headline,
    detail:
      `Earlier arrivals have had time to move upstream while later ${species} may continue to enter. ${amount} may now be distributed ${distribution}, wherever passage is open.`,
    tip: opportunity.distributionScope === "concentrated"
      ? "Begin in the river's most dependable established holding water and cover each deep hole, outside bend, and current break carefully. If Push is Possible or stronger, finish with one deliberate lower-river travel-lane check."
      : "Begin in a dependable middle-river section, then work through its deep holes, outside bends, and current breaks. If Push is Possible or stronger, finish with a deliberate lower-river travel-lane check.",
  };
}

function peakCopy(
  species: string,
  opportunity: RunOpportunityCopyContext,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (
    opportunity.strength === "strong" &&
    opportunity.distributionScope === "broad"
  ) {
    return {
      headline:
        `This is typically the strongest and most dependable river opportunity of the ${species} season.`,
      detail:
        `Multiple waves have had time to spread, so ${species} are likely distributed throughout the accessible river—from lower travel water through upstream holding and spawning reaches, except above dams or other barriers.`,
      tip:
        "Choose an accessible river section and fish every substantial hole from its head through the inside seam and tail. Move section by section through deep bends and resting pockets, and leave fish on shallow spawning gravel alone.",
    };
  }
  const headline = opportunity.strength === "limited"
    ? `This is typically the best river opportunity of the ${species} season, although the overall seasonal presence remains limited.`
    : `This is typically the strongest and most dependable river opportunity of the ${species} season.`;
  const amount = opportunity.strength === "strong"
    ? `good numbers of ${species}`
    : opportunity.strength === "limited"
    ? `a smaller number of ${species}`
    : `${species}`;
  const distribution = opportunity.distributionScope === "broad"
    ? "through a broad part of the accessible river"
    : opportunity.distributionScope === "sectional"
    ? "through several dependable river sections"
    : "within the river's most dependable holding and spawning areas";
  return {
    headline,
    detail:
      `Earlier waves have had time to move, so ${amount} may now be distributed ${distribution}, except above dams or other barriers.`,
    tip: opportunity.distributionScope === "concentrated"
      ? "Choose one of the river's most dependable holding sections and fish every substantial hole from its head through the inside seam and tail. Move carefully between deep bends and resting pockets, and leave fish on shallow spawning gravel alone."
      : "Choose a dependable river section and fish every substantial hole from its head through the inside seam and tail. Move section by section through deep bends and resting pockets, and leave fish on shallow spawning gravel alone.",
  };
}

function taperingCopy(
  species: string,
  opportunity: RunOpportunityCopyContext,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const amount = opportunity.strength === "strong"
    ? `Good numbers of ${species}`
    : opportunity.strength === "moderate"
    ? species
    : `A smaller number of ${species}`;
  const detail = opportunity.distributionScope === "broad"
    ? opportunity.strength === "strong"
      ? `${amount} may still be spread through the river.`
      : `${amount} may still be present across a broad part of the accessible river.`
    : opportunity.distributionScope === "sectional"
    ? `${amount} may still be present through the river's dependable sections.`
    : `${amount} may still be concentrated in the river's most dependable holding water.`;
  const tip = opportunity.distributionScope === "broad"
    ? "Begin with established middle- and upper-river holding water, especially deep holes and slower edges. If Push is Possible or stronger, finish with lower travel lanes for a fresh late wave."
    : opportunity.distributionScope === "sectional"
    ? "Begin in the river's established holding sections, especially deep holes and slower edges. If Push is Possible or stronger, finish with lower travel lanes for a fresh late wave."
    : "Begin in the river's most dependable deep holes and slower holding edges. If Push is Possible or stronger, finish with one lower travel-lane check for a fresh late arrival.";
  return {
    headline: opportunity.strength === "limited"
      ? `This can still offer a limited ${species} opportunity, even as fresh arrivals typically become less consistent.`
      : `This can remain a productive part of the ${species} season, even as fresh arrivals typically become less consistent.`,
    detail:
      `${detail} At this point in the seasonal pattern, the balance often shifts from new arrivals toward fish already holding or spawning.`,
    tip,
  };
}

function endingCopy(
  species: string,
  opportunity: RunOpportunityCopyContext,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const location = opportunity.distributionScope === "broad"
    ? "across a broad part of the accessible river"
    : opportunity.distributionScope === "sectional"
    ? "in dependable river sections"
    : "in the most dependable holding water";
  const headline = opportunity.strength === "strong" &&
      opportunity.distributionScope === "broad"
    ? `${species} can still provide a worthwhile late-season river opportunity.`
    : opportunity.strength === "limited"
    ? `A limited late-season ${species} opportunity may remain ${location}.`
    : `${species} can still provide a worthwhile late-season opportunity ${location}.`;
  const amount = opportunity.strength === "strong"
    ? "Fish"
    : opportunity.strength === "moderate"
    ? "Some fish"
    : "A smaller number of fish";
  return {
    headline,
    detail: opportunity.strength === "strong"
      ? `${amount} can still be present, but many have been in the system for a while and fresh arrivals tend to be less dependable.`
      : `${amount} can still be present, but those fish may have been in the system for a while and fresh arrivals tend to be less dependable.`,
    tip:
      "Skip fast travel lanes. Work the deepest established holes and slow current edges, and leave actively spawning fish and shallow gravel alone.",
  };
}

function latePostRunCopy(
  species: string,
  opportunity: RunOpportunityCopyContext,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const location = opportunity.distributionScope === "broad"
    ? "across a broad part of the river"
    : opportunity.distributionScope === "sectional"
    ? "through its core river sections"
    : "in its most dependable holding water";
  const opportunityText = opportunity.strength === "strong" &&
      opportunity.distributionScope === "broad"
    ? "a dependable river-wide opportunity"
    : opportunity.strength === "limited"
    ? `even a limited dependable opportunity ${location}`
    : `a dependable opportunity ${location}`;
  return {
    headline: `The main ${species} migration is over.`,
    detail:
      `A few fish may remain, but the season no longer supports ${opportunityText}.`,
    tip:
      "Do not chase scattered holdovers from access to access. Shift to another seasonal species and leave any actively spawning fish undisturbed.",
  };
}

function stageReasonCode(
  stage: RunStage,
): RunStageResult["reasonCodes"][number] {
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
