import type { RiverRunProfile } from "../types.ts";
import {
  addDays,
  compareLocalDates,
  type DateWindow,
  resolveActiveRunWindow,
} from "./dateWindow.ts";

export type ConditionsSuggestCheckpointId =
  | "river_start"
  | "building_start"
  | "building_established"
  | "peak_start"
  | "peak_complete";

export type ConditionsSuggestCheckpoint = {
  checkpointId: ConditionsSuggestCheckpointId;
  checkpointDate: string;
  cutoffDate: string;
  observationStartDate: string;
  completedStage: "pre_run" | "beginning" | "building" | "peak";
  final: boolean;
};

export type ConditionsSuggestCheckpointState = {
  window: DateWindow;
  observationStarted: boolean;
  activeCheckpoints: ConditionsSuggestCheckpoint[];
  activeCheckpoint?: ConditionsSuggestCheckpoint;
  nextCheckpoint?: ConditionsSuggestCheckpoint;
  complete: boolean;
};

export function resolveConditionsSuggestCheckpoints(
  run: Pick<RiverRunProfile, "runWindow" | "conditionsSuggest"> & {
    conditionsSuggest: NonNullable<RiverRunProfile["conditionsSuggest"]>;
  },
  localDate: string,
): ConditionsSuggestCheckpoint[] {
  const window = resolveActiveRunWindow(run, localDate);
  const observationStartDate = window.stagingStartDate;
  const finalCheckpointCutoff = addDays(
    window.peakDate,
    run.conditionsSuggest.finalCheckpointDaysAfterPeak,
  );
  return [
    {
      checkpointId: "river_start",
      checkpointDate: window.startDate,
      cutoffDate: addDays(window.startDate, -1),
      observationStartDate,
      completedStage: "pre_run",
      final: false,
    },
    {
      checkpointId: "building_start",
      checkpointDate: addDays(window.beginningEndDate, 1),
      cutoffDate: window.beginningEndDate,
      observationStartDate,
      completedStage: "beginning",
      final: false,
    },
    {
      checkpointId: "building_established",
      checkpointDate: window.buildingEstablishedStartDate,
      cutoffDate: addDays(window.buildingEstablishedStartDate, -1),
      observationStartDate,
      completedStage: "building",
      final: false,
    },
    {
      checkpointId: "peak_start",
      checkpointDate: window.peakStartDate,
      cutoffDate: addDays(window.peakStartDate, -1),
      observationStartDate,
      completedStage: "building",
      final: false,
    },
    {
      checkpointId: "peak_complete",
      checkpointDate: addDays(finalCheckpointCutoff, 1),
      cutoffDate: finalCheckpointCutoff,
      observationStartDate,
      completedStage: "peak",
      final: true,
    },
  ];
}

export function resolveConditionsSuggestCheckpointState(
  run: Pick<RiverRunProfile, "runWindow" | "conditionsSuggest"> & {
    conditionsSuggest: NonNullable<RiverRunProfile["conditionsSuggest"]>;
  },
  localDate: string,
): ConditionsSuggestCheckpointState {
  const window = resolveActiveRunWindow(run, localDate);
  const checkpoints = resolveConditionsSuggestCheckpoints(run, localDate);
  const activeCheckpoints = checkpoints.filter((checkpoint) =>
    compareLocalDates(checkpoint.checkpointDate, localDate) <= 0
  );
  const activeCheckpoint = activeCheckpoints.at(-1);
  return {
    window,
    observationStarted:
      compareLocalDates(localDate, window.stagingStartDate) >= 0,
    activeCheckpoints,
    activeCheckpoint,
    nextCheckpoint: checkpoints.find((checkpoint) =>
      compareLocalDates(checkpoint.checkpointDate, localDate) > 0
    ),
    complete: activeCheckpoint?.final === true,
  };
}
