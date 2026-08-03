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
  type ConditionsSuggestEvidenceByDate,
  type ConditionsSuggestResult,
  scoreConditionsSuggest,
} from "../scoring/conditionsSuggest.ts";
import type { RiverRunConditionsSuggestBaseline } from "../storage/types.ts";

export type RiverRunDailySnapshot = {
  riverId: string;
  runId: string;
  localDate: string;
  timezone: string;
  runStage: RunStageResult;
  conditionsSuggest: ConditionsSuggestResult;
  fishInRiver: FishInRiverResult;
  evidenceSummaries: Array<{
    sourceDate: string;
    refreshSlot?: string;
    gaugeValue?: number | null;
    waterTempF?: number | null;
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
    | "runId"
    | "displayName"
    | "species"
    | "runWindow"
    | "historicalPresence"
    | "conditionsSuggest"
    | "push"
  >;
  localDate: string;
  conditionsEvidenceByDate: ConditionsSuggestEvidenceByDate;
  conditionsBaselines?: RiverRunConditionsSuggestBaseline[] | null;
  engineVersion: string;
  configVersion: string;
}): RiverRunDailySnapshot {
  const runStage = resolveRunStage(input.run, input.localDate);
  const fishInRiver = scoreFishInRiver(input.run, input.localDate);
  const conditionsSuggest = scoreConditionsSuggest({
    localDate: input.localDate,
    run: input.run,
    evidenceByDate: input.conditionsEvidenceByDate,
    baselines: input.conditionsBaselines,
  });
  const evidenceSummaries = conditionsSuggest.sourceDates.map((sourceDate) => {
    const refreshSlot = conditionsSuggest.sourceRefreshSlots[sourceDate];
    const refresh = refreshSlot
      ? input.conditionsEvidenceByDate[sourceDate]?.[refreshSlot]
      : undefined;
    return {
      sourceDate,
      refreshSlot,
      gaugeValue: refresh?.gaugeValue,
      waterTempF: refresh?.waterTempF,
    };
  });
  const reasonCodes = dedupeReasonCodes([
    ...runStage.reasonCodes,
    ...conditionsSuggest.reasonCodes,
    ...fishInRiver.reasonCodes,
  ]);

  return {
    riverId: input.river.riverId,
    runId: input.run.runId,
    localDate: input.localDate,
    timezone: input.river.timezone,
    runStage,
    conditionsSuggest,
    fishInRiver,
    evidenceSummaries,
    sourceDates: conditionsSuggest.sourceDates,
    sourceRefreshSlots: conditionsSuggest.sourceRefreshSlots,
    reasonCodes,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  };
}

function dedupeReasonCodes(codes: RiverRunReasonCode[]): RiverRunReasonCode[] {
  return [...new Set(codes)];
}
