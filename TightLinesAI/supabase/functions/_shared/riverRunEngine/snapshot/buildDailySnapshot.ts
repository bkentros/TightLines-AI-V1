import type {
  RiverProfile,
  RiverRunProfile,
  RiverRunReasonCode,
} from "../types.ts";
import {
  type FishInRiverResult,
  scoreFishInRiver,
} from "../scoring/fishInRiver.ts";
import { resolveRunStage, type RunStageResult } from "../scoring/runStage.ts";
import {
  type PreviousScheduleState,
  type ScheduleRefreshesByDate,
  type ScheduleResult,
  scoreSchedule,
} from "../scoring/schedule.ts";

export type RiverRunDailySnapshot = {
  riverId: string;
  runId: string;
  localDate: string;
  timezone: string;
  runStage: RunStageResult;
  schedule: ScheduleResult;
  fishInRiver: FishInRiverResult;
  favorabilitySummaries: Array<{
    sourceDate: string;
    refreshSlot?: string;
    favorabilityIndex?: number;
  }>;
  sourceDates: string[];
  sourceRefreshSlots: Partial<Record<string, string>>;
  reasonCodes: RiverRunReasonCode[];
  engineVersion: string;
  configVersion: string;
};

export function buildDailySnapshot(input: {
  river: Pick<RiverProfile, "riverId" | "timezone">;
  run: Pick<
    RiverRunProfile,
    "runId" | "runWindow" | "runStrength"
  >;
  localDate: string;
  scheduleRefreshesByDate: ScheduleRefreshesByDate;
  previousSchedule?: PreviousScheduleState;
  engineVersion: string;
  configVersion: string;
}): RiverRunDailySnapshot {
  const runStage = resolveRunStage(input.run, input.localDate);
  const fishInRiver = scoreFishInRiver(input.run, input.localDate);
  const schedule = scoreSchedule({
    localDate: input.localDate,
    stage: runStage.stage,
    window: runStage.window,
    refreshesByDate: input.scheduleRefreshesByDate,
    previousSchedule: input.previousSchedule,
  });
  const favorabilitySummaries = schedule.sourceDates.map((sourceDate) => {
    const refreshSlot = schedule.sourceRefreshSlots[sourceDate];
    const refresh = refreshSlot
      ? input.scheduleRefreshesByDate[sourceDate]?.[refreshSlot]
      : undefined;
    return {
      sourceDate,
      refreshSlot,
      favorabilityIndex: refresh?.favorabilityIndex,
    };
  });
  const reasonCodes = dedupeReasonCodes([
    ...runStage.reasonCodes,
    ...schedule.reasonCodes,
    ...fishInRiver.reasonCodes,
  ]);

  return {
    riverId: input.river.riverId,
    runId: input.run.runId,
    localDate: input.localDate,
    timezone: input.river.timezone,
    runStage,
    schedule,
    fishInRiver,
    favorabilitySummaries,
    sourceDates: schedule.sourceDates,
    sourceRefreshSlots: schedule.sourceRefreshSlots,
    reasonCodes,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  };
}

function dedupeReasonCodes(codes: RiverRunReasonCode[]): RiverRunReasonCode[] {
  return [...new Set(codes)];
}
