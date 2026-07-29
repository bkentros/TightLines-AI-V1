import type { PrimitiveDisplay, RiverRunProfile, RunStage } from "../types.ts";
import {
  alternate,
  type RiverRunCopyOptions,
  RIVER_RUN_COPY_VERSION,
  resolveCopyVariant,
} from "../copy/variants.ts";
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
  run: Pick<RiverRunProfile, "runWindow">,
  localDate: string,
  copyOptions: RiverRunCopyOptions = {},
): RunStageResult {
  const window = resolveActiveRunWindow(run, localDate);
  const stage = stageForDate(localDate, window);
  const stagingContext = stage === "pre_run" &&
    compareLocalDates(localDate, window.stagingStartDate) >= 0;
  const copyVariant = resolveCopyVariant(
    copyOptions.copyKey ??
      `${window.startDate}:${window.endDate}:${stage}:${
        stagingContext ? "staging" : "before-staging"
      }`,
    copyOptions.copyVariant,
  );

  return {
    stage,
    stagingContext,
    window,
    label: stageLabel(stage),
    ...stageCopy(stage, stagingContext, window, copyVariant),
    reasonCodes: [
      stageReasonCode(stage),
      ...(stagingContext ? ["stage_pre_run_staging" as const] : []),
    ],
    copyVersion: RIVER_RUN_COPY_VERSION,
    copyVariant,
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
  stagingContext: boolean,
  window: DateWindow,
  variant: "A" | "B",
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  switch (stage) {
    case "pre_run":
      if (stagingContext) {
        return {
          headline: alternate(
            variant,
            "The river run has not begun, but nearby staging is seasonally possible.",
            "This is the staging period before the river run begins.",
          ),
          detail: `The researched river-run window begins ${
            displayLocalDate(window.startDate)
          }. Mature fish may gather in nearby lake, harbor, or river-mouth water before then, but this calendar stage does not confirm fish have entered the river.`,
          tip: alternate(
            variant,
            "Treat staging water separately from the river, and use measured river conditions for any current movement signal.",
            "Nearby staging can matter now, but do not read it as proof of fish in the river.",
          ),
        };
      }
      return {
        headline: alternate(
          variant,
          "The researched river-run season is still ahead.",
          "It is too early for the configured river-run window.",
        ),
        detail: `Nearby-water staging context begins ${
          displayLocalDate(window.stagingStartDate)
        }, and the researched river-run window begins ${
          displayLocalDate(window.startDate)
        }.`,
        tip: alternate(
          variant,
          "Use this as calendar context only; current weather or water cannot move the configured season dates.",
          "Check back when the staging period opens; this card reports season timing, not current fish movement.",
        ),
      };
    case "beginning":
      return {
        headline: alternate(
          variant,
          "The researched run window is in its beginning stage.",
          "The calendar has entered the early run window.",
        ),
        detail: `Beginning runs from ${displayLocalDate(window.startDate)} through ${
          displayLocalDate(window.beginningEndDate)
        }. This is the early portion of the river-specific historical calendar, not a live count of fish.`,
        tip: alternate(
          variant,
          "Early fish are seasonally plausible; use Run Timing and Push to understand timing and current entry conditions.",
          "Expect the run to be less established than later stages, then check the other cards for measured conditions.",
        ),
      };
    case "building":
      return {
        headline: alternate(
          variant,
          "The researched run calendar is building toward peak.",
          "The run window is in its building stage.",
        ),
        detail: `This stage follows the beginning window and continues until the configured peak starts ${
          displayLocalDate(window.peakStartDate)
        }. It describes historical timing, not what entered today.`,
        tip: alternate(
          variant,
          "Historical presence commonly increases through this stage; use Push for the newest movement signal.",
          "Read this as an advancing season, then use current-condition cards to judge how the river is setting up.",
        ),
      };
    case "peak":
      return {
        headline: alternate(
          variant,
          "The calendar is inside the researched peak window.",
          "This is the river run's configured peak stage.",
        ),
        detail: `The river-specific peak window runs from ${
          displayLocalDate(window.peakStartDate)
        } through ${displayLocalDate(window.peakEndDate)}. Peak is a historical timing range; it does not mean fish numbers are highest on every day.`,
        tip: alternate(
          variant,
          "The run should be well established by calendar timing; Fishability still determines how workable the river is.",
          "Do not confuse peak timing with perfect fishing—check river shape and current conditions separately.",
        ),
      };
    case "tapering":
      return {
        headline: alternate(
          variant,
          "The calendar is past peak and in the tapering stage.",
          "The researched run window is now tapering.",
        ),
        detail: `The configured peak ended ${
          displayLocalDate(window.peakEndDate)
        }. Historical seasonal presence generally eases through ${
          displayLocalDate(window.taperingEndDate)
        }, although fish can remain in the river.`,
        tip: alternate(
          variant,
          "Expect a more mature, less uniformly fresh run; use Fish In River for the river-specific historical level.",
          "Fresh arrivals may be less consistent now, while existing fish can still provide opportunity.",
        ),
      };
    case "ending":
      return {
        headline: alternate(
          variant,
          "The researched run window is in its ending stage.",
          "The river run is late in its configured season.",
        ),
        detail: `This is the final portion of the main run window, which ends ${
          displayLocalDate(window.endDate)
        }. Historical presence is declining, but this calendar stage does not mean every fish has left.`,
        tip: alternate(
          variant,
          "Expect fewer fresh opportunities than earlier in the run and use Fish In River for remaining seasonal context.",
          "Late-run fish may remain, but the calendar no longer supports an early- or peak-run expectation.",
        ),
      };
    case "post_run":
      return {
        headline: alternate(
          variant,
          "The researched river-run window has passed.",
          "This run is now outside its configured season.",
        ),
        detail: `The main run window ended ${
          displayLocalDate(window.endDate)
        }, and its late historical-presence tail ended ${
          displayLocalDate(window.lateEndDate)
        }. This does not prove that no individual fish remain.`,
        tip: alternate(
          variant,
          "Treat any remaining fish as outside the modeled run rather than extending the seasonal forecast.",
          "River Run no longer presents this period as part of the researched seasonal opportunity.",
        ),
      };
  }
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
