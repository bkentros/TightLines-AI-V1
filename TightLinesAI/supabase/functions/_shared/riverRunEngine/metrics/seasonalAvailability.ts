import type { RiverRunProfile } from "../types.ts";
import { compareLocalDates } from "./dateWindow.ts";
import { resolveRunStage } from "../scoring/runStage.ts";

const MICHIGAN_WINTER_STEELHEAD_RIVERS = new Set([
  "pere_marquette",
  "big_manistee",
  "muskegon",
  "st_joseph",
  "grand",
  "betsie",
  "bear_creek_manistee",
  "rogue_mi",
  "platte",
  "white",
]);

const WISCONSIN_FALL_TO_WINTER_RUN_IDS = new Set([
  "milwaukee_fall_steelhead",
  "milwaukee_fall_brown_trout",
  "sheboygan_fall_steelhead",
  "sheboygan_fall_brown_trout",
  "root_fall_steelhead",
  "root_fall_brown_trout",
  "kewaunee_river_fall_steelhead",
  "kewaunee_river_fall_brown_trout",
  "manitowoc_fall_steelhead",
  "manitowoc_fall_brown_trout",
]);

/**
 * Winter holding profiles are intentionally absent outside their exact
 * seasonal window. Other run types retain their established availability
 * behavior until they receive an explicit seasonal-release contract.
 */
export function isRunSeasonallyActive(
  run: RiverRunProfile,
  localDate: string,
): boolean {
  const stage = resolveRunStage(run, localDate);
  if (run.season === "winter" && run.runType === "holding") {
    return stage.stage !== "pre_run" && stage.stage !== "post_run";
  }
  if (
    run.season === "fall" && run.runType === "fall_entry" &&
    run.species === "steelhead" &&
    MICHIGAN_WINTER_STEELHEAD_RIVERS.has(run.riverId)
  ) {
    return compareLocalDates(localDate, stage.window.endDate) <= 0;
  }
  if (
    run.season === "fall" && WISCONSIN_FALL_TO_WINTER_RUN_IDS.has(run.runId)
  ) {
    return compareLocalDates(localDate, stage.window.endDate) <= 0;
  }
  return true;
}
