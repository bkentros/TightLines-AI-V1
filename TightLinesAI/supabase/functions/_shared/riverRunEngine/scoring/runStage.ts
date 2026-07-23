import type { PrimitiveDisplay, RiverRunProfile, RunStage } from "../types.ts";
import {
  compareLocalDates,
  type DateWindow,
  resolveActiveRunWindow,
} from "../metrics/dateWindow.ts";

export type RunStageResult = PrimitiveDisplay & {
  stage: RunStage;
  window: DateWindow;
};

export function resolveRunStage(
  run: Pick<RiverRunProfile, "runWindow">,
  localDate: string,
): RunStageResult {
  const window = resolveActiveRunWindow(run, localDate);
  const stage = stageForDate(localDate, window);

  return {
    stage,
    window,
    label: stageLabel(stage),
    ...stageCopy(stage),
    reasonCodes: [stageReasonCode(stage)],
  };
}

export function stageForDate(localDate: string, window: DateWindow): RunStage {
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
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  switch (stage) {
    case "pre_run":
      return {
        headline: "The configured run window has not opened yet.",
        detail:
          "This is a calendar-stage read only; current river inputs do not change the stage.",
        tip:
          "Compare this calendar-stage read with the other primitives separately.",
      };
    case "beginning":
      return {
        headline: "The calendar is at the beginning of the configured window.",
        detail:
          "This stage marks the early portion of the researched run calendar.",
        tip:
          "Compare this calendar-stage read with the other primitives separately.",
      };
    case "building":
      return {
        headline: "The calendar is in the building portion of the run window.",
        detail:
          "This stage sits between the beginning window and the configured peak window.",
        tip:
          "Compare this calendar-stage read with the other primitives separately.",
      };
    case "peak":
      return {
        headline: "The calendar is inside the configured peak window.",
        detail: "This describes timing within the researched run calendar.",
        tip:
          "Compare this calendar-stage read with the other primitives separately.",
      };
    case "tapering":
      return {
        headline: "The calendar is past the configured peak window.",
        detail:
          "This stage describes the tapering portion of the researched run calendar.",
        tip:
          "Compare this calendar-stage read with the other primitives separately.",
      };
    case "ending":
      return {
        headline: "The calendar is near the end of the configured window.",
        detail:
          "This stage describes the late portion of the researched run calendar.",
        tip:
          "Compare this calendar-stage read with the other primitives separately.",
      };
    case "post_run":
      return {
        headline: "The configured run window has passed.",
        detail:
          "This stage describes calendar timing after the researched run window.",
        tip:
          "Compare this calendar-stage read with the other primitives separately.",
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
