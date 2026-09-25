import type { RiverRunProfile } from "../types.ts";
import { compareLocalDates } from "./dateWindow.ts";
import { resolveRunStage } from "../scoring/runStage.ts";

const MICHIGAN_WINTER_PASS1_RIVERS = new Set([
  "pere_marquette",
  "big_manistee",
  "muskegon",
  "st_joseph",
  "grand",
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
    MICHIGAN_WINTER_PASS1_RIVERS.has(run.riverId)
  ) {
    return compareLocalDates(localDate, stage.window.endDate) <= 0;
  }
  return true;
}
