import type { PrimitiveDisplay, RiverRunProfile, RunStage } from "../types.ts";
import { RIVER_RUN_COPY_VERSION } from "../copy/version.ts";
import { anglerSpeciesName } from "../copy/species.ts";
import {
  compareLocalDates,
  type DateWindow,
  resolveActiveRunWindow,
} from "../metrics/dateWindow.ts";

export type RunStageResult = PrimitiveDisplay & {
  stage: RunStage;
  stagingContext: boolean;
  window: DateWindow;
};

export function resolveRunStage(
  run: Pick<RiverRunProfile, "runWindow" | "species">,
  localDate: string,
): RunStageResult {
  const window = resolveActiveRunWindow(run, localDate);
  const stage = stageForDate(localDate, window);
  const stagingContext = stage === "pre_run" &&
    compareLocalDates(localDate, window.stagingStartDate) >= 0;
  const establishedBuildingContext = stage === "building" &&
    compareLocalDates(localDate, window.buildingEstablishedStartDate) >= 0;
  const latePostRunContext = stage === "post_run" &&
    compareLocalDates(localDate, window.endDate) > 0 &&
    compareLocalDates(localDate, window.postRunLateCopyEndDate) <= 0;

  return {
    stage,
    stagingContext,
    window,
    label: stageLabel(stage),
    ...stageCopy(
      stage,
      stagingContext,
      establishedBuildingContext,
      latePostRunContext,
      anglerSpeciesName(run.species),
    ),
    reasonCodes: [
      stageReasonCode(stage),
      ...(stagingContext ? ["stage_pre_run_staging" as const] : []),
    ],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
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

function stageLabel(stage: RunStage): string {
  switch (stage) {
    case "pre_run":
      return "Pre-run";
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
      return "Post-run";
  }
}

function stageCopy(
  stage: RunStage,
  stagingContext: boolean,
  establishedBuildingContext: boolean,
  latePostRunContext: boolean,
  species: string,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  switch (stage) {
    case "pre_run":
      if (stagingContext) {
        return {
          headline:
            `${species} may be gathering near the river mouth, and a few early fish could be in the river.`,
          detail:
            `Most ${species} are still expected near the lake, harbor, or river mouth. The earliest arrivals can occasionally slip into the lower river, but dependable river numbers have not developed yet.`,
          tip:
            "Fish the harbor and river mouth first, then make one deliberate check of the first deep lower-river travel lane. Skip a middle- or upper-river trip until the run becomes dependable.",
        };
      }
      return {
        headline: `${species} have not started their river run yet.`,
        detail:
          `Most ${species} are still expected to be in the lake, so meaningful numbers in the river are unlikely right now.`,
        tip:
          "Keep the trip in the lake, harbor, and river-mouth zone. Do not spend the day searching inland river water for a run that has not started.",
      };
    case "beginning":
      return {
        headline: `The first ${species} are beginning their river run.`,
        detail:
          `Fresh ${species} may be entering the river, but numbers can still be scattered and inconsistent this early.`,
        tip:
          "Begin in the lower river. Fish the first deep bends and short resting pockets off the main travel lane, then move upstream only after the lower section has been covered.",
      };
    case "building":
      if (establishedBuildingContext) {
        return {
          headline:
            `The ${species} run is building across much more of the river.`,
          detail:
            `Earlier waves have had time to travel well upstream while later ${species} may continue to enter. Fish can now be spread from lower travel lanes into upper holding water wherever passage is open.`,
          tip:
            "Begin in established middle-river holding water, then work upstream through deep holes, outside bends, and current breaks. If Push is Possible or stronger, finish with a deliberate lower-river travel-lane check.",
        };
      }
      return {
        headline: `The ${species} run is gaining momentum.`,
        detail:
          `More ${species} are typically entering and beginning to spread upstream, although arrivals can still come in uneven waves.`,
        tip:
          "Start where lower-river travel water enters the first dependable holding holes. Cover those holes from head to tail, then continue into the middle river instead of waiting in one lower-river spot.",
      };
    case "peak":
      return {
        headline:
          `This is typically the strongest and most dependable river opportunity of the ${species} season.`,
        detail:
          `Multiple waves have had time to spread, so ${species} are likely distributed throughout the accessible river—from lower travel water through upstream holding and spawning reaches, except above dams or other barriers.`,
        tip:
          "Choose an accessible river section and fish every substantial hole from its head through the inside seam and tail. Move section by section through deep bends and resting pockets, and leave fish on shallow spawning gravel alone.",
      };
    case "tapering":
      return {
        headline:
          `This can remain a productive part of the ${species} run, even as fresh arrivals typically become less consistent.`,
        detail:
          `Good numbers of ${species} may still be spread through the river. At this point in the seasonal pattern, the balance often shifts from new arrivals toward fish already holding or spawning.`,
        tip:
          "Begin with established middle- and upper-river holding water, especially deep holes and slower edges. If Push is Possible or stronger, finish with lower travel lanes for a fresh late wave.",
      };
    case "ending":
      return {
        headline:
          `${species} can still provide a worthwhile late-run river opportunity.`,
        detail:
          "Fish can still be present, but many have been in the system for a while and fresh arrivals tend to be less dependable.",
        tip:
          "Skip fast travel lanes. Work the deepest established holes and slow current edges, and leave actively spawning fish and shallow gravel alone.",
      };
    case "post_run":
      if (!latePostRunContext) {
        return {
          headline: `${species} are outside their river-run season.`,
          detail:
            `A dependable seasonal presence of ${species} is not expected in the river right now.`,
          tip:
            "Do not build a river trip around this run. Target a species with an active seasonal window and return to this read as the next migration approaches.",
        };
      }
      return {
        headline: `The main ${species} river run is over.`,
        detail:
          "A few fish may remain, but the season no longer supports a dependable river-wide opportunity.",
        tip:
          "Do not chase scattered holdovers from access to access. Shift to another seasonal species and leave any actively spawning fish undisturbed.",
      };
  }
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
