import type {
  GaugeFreshness,
  PrimitiveDisplay,
  RiverRunReasonCode,
  RunStage,
} from "../types.ts";
import {
  addDays,
  compareLocalDates,
  type DateWindow,
} from "../metrics/dateWindow.ts";
import type { RefreshSlot } from "../snapshot/refreshSlots.ts";

export type ScheduleLabel = "Ahead" | "On schedule" | "Behind" | "Uncertain";
export type ProgressionLevel =
  | "strongly_favorable_week"
  | "favorable_week"
  | "neutral_mixed_week"
  | "unfavorable_week"
  | "strongly_unfavorable_week";

export type ScheduleSourceRefresh = {
  favorabilityIndex: number;
  gaugeFreshness: GaugeFreshness;
  missingNonGaugeInputCount?: number;
  reasonCodes?: RiverRunReasonCode[];
};

export type ScheduleRefreshesByDate = Record<
  string,
  Partial<Record<RefreshSlot, ScheduleSourceRefresh>>
>;

export type PreviousScheduleState = {
  label: ScheduleLabel;
  progressionIndex: number;
  consecutiveCandidateCount?: number;
};

export type ScheduleResult = PrimitiveDisplay & {
  label: ScheduleLabel;
  progressionIndex: number | null;
  progressionLevel: ProgressionLevel | "unusable";
  usableDays: number;
  sourceDates: string[];
  sourceRefreshSlots: Partial<Record<string, RefreshSlot>>;
  selectedReasonCodes: RiverRunReasonCode[];
  candidateLabel: ScheduleLabel;
};

const SLOT_PREFERENCE: readonly RefreshSlot[] = ["16:00", "08:00", "00:00"];
const WEIGHTS = [0.5, 0.65, 0.8, 1, 1.2, 1.35, 1.5] as const;

export function scoreSchedule(input: {
  localDate: string;
  stage: RunStage;
  window: DateWindow;
  refreshesByDate: ScheduleRefreshesByDate;
  previousSchedule?: PreviousScheduleState;
}): ScheduleResult {
  const sourceDates = Array.from(
    { length: 7 },
    (_, index) => addDays(input.localDate, index - 7),
  );
  const selected = sourceDates.map((sourceDate, index) => {
    const refresh = selectSourceRefresh(input.refreshesByDate[sourceDate]);
    return { sourceDate, index, ...refresh };
  });
  const usable = selected.filter((item) => item.refresh);
  const sourceRefreshSlots: Partial<Record<string, RefreshSlot>> = {};
  const selectedReasonCodes = new Set<RiverRunReasonCode>();
  for (const item of usable) {
    if (item.slot) sourceRefreshSlots[item.sourceDate] = item.slot;
    for (const code of item.refresh?.reasonCodes ?? []) {
      selectedReasonCodes.add(code);
    }
  }

  const progressionIndex = usable.length === 0
    ? null
    : weightedAverage(usable.map((item) => ({
      value: item.refresh!.favorabilityIndex,
      weight: WEIGHTS[item.index],
    })));
  const progressionLevel = progressionIndex === null
    ? "unusable"
    : resolveProgressionLevel(progressionIndex);
  const candidateLabel = resolveCandidateLabel(
    input.stage,
    input.window,
    input.localDate,
    progressionLevel,
  );
  const yesterday = selected[6];
  const overrideReason = resolveOverrideReason(usable.length, yesterday);
  const overriddenCandidate = overrideReason ? "Uncertain" : candidateLabel;
  if (overrideReason) selectedReasonCodes.add(overrideReason);
  const label = smoothScheduleLabel(
    overriddenCandidate,
    progressionIndex,
    input.stage,
    input.previousSchedule,
  );
  selectedReasonCodes.add(scheduleReasonCode(label));

  return {
    label,
    progressionIndex,
    progressionLevel,
    usableDays: usable.length,
    sourceDates,
    sourceRefreshSlots,
    selectedReasonCodes: [...selectedReasonCodes],
    candidateLabel: overriddenCandidate,
    ...scheduleCopy(label),
    reasonCodes: [...selectedReasonCodes],
  };
}

function selectSourceRefresh(
  refreshes?: Partial<Record<RefreshSlot, ScheduleSourceRefresh>>,
): { slot?: RefreshSlot; refresh?: ScheduleSourceRefresh } {
  if (!refreshes) return {};
  for (const slot of SLOT_PREFERENCE) {
    if (refreshes[slot]) return { slot, refresh: refreshes[slot] };
  }
  return {};
}

function weightedAverage(
  values: Array<{ value: number; weight: number }>,
): number {
  const totalWeight = values.reduce((sum, item) => sum + item.weight, 0);
  return values.reduce((sum, item) => sum + item.value * item.weight, 0) /
    totalWeight;
}

function resolveProgressionLevel(index: number): ProgressionLevel {
  if (index >= 2.25) return "strongly_favorable_week";
  if (index >= 1) return "favorable_week";
  if (index >= -0.99) return "neutral_mixed_week";
  if (index >= -2.24) return "unfavorable_week";
  return "strongly_unfavorable_week";
}

function resolveCandidateLabel(
  stage: RunStage,
  window: DateWindow,
  localDate: string,
  level: ProgressionLevel | "unusable",
): ScheduleLabel {
  if (level === "unusable") return "Uncertain";
  const favorable = level === "strongly_favorable_week" ||
    level === "favorable_week";
  const neutral = level === "neutral_mixed_week";
  const unfavorable = level === "unfavorable_week" ||
    level === "strongly_unfavorable_week";

  if (stage === "pre_run") {
    const insideEarlyWindow =
      compareLocalDates(localDate, window.earlyStartDate) >= 0;
    return insideEarlyWindow && favorable ? "Ahead" : "Uncertain";
  }
  if (stage === "beginning" || stage === "building") {
    if (level === "strongly_favorable_week") return "Ahead";
    if (level === "favorable_week" || neutral) return "On schedule";
    return "Behind";
  }
  if (stage === "peak") {
    if (level === "strongly_unfavorable_week") return "Uncertain";
    if (unfavorable) return "Behind";
    return "On schedule";
  }
  if (stage === "tapering" || stage === "ending") {
    return unfavorable ? "Behind" : "On schedule";
  }
  if (stage === "post_run") {
    const insideLateWindow =
      compareLocalDates(localDate, window.lateEndDate) <= 0;
    return insideLateWindow && unfavorable ? "Behind" : "Uncertain";
  }
  return "Uncertain";
}

function resolveOverrideReason(
  usableDays: number,
  yesterday: {
    refresh?: ScheduleSourceRefresh;
  },
): RiverRunReasonCode | null {
  if (usableDays < 4) return "schedule_limited_source_days";
  if (
    yesterday.refresh?.gaugeFreshness === "missing" ||
    yesterday.refresh?.gaugeFreshness === "older_than_24h"
  ) {
    return "schedule_missing_yesterday_gauge";
  }
  if ((yesterday.refresh?.missingNonGaugeInputCount ?? 0) >= 2) {
    return "schedule_missing_required_inputs";
  }
  return null;
}

function smoothScheduleLabel(
  candidate: ScheduleLabel,
  progressionIndex: number | null,
  stage: RunStage,
  previous?: PreviousScheduleState,
): ScheduleLabel {
  if (!previous) return candidate;
  if (candidate === previous.label) return candidate;
  if (candidate === "Uncertain") return "Uncertain";
  if (
    progressionIndex !== null &&
    candidateClearsThresholdMargin(stage, candidate, progressionIndex)
  ) {
    return candidate;
  }
  if ((previous.consecutiveCandidateCount ?? 0) >= 2) return candidate;
  return previous.label;
}

function candidateClearsThresholdMargin(
  stage: RunStage,
  candidate: ScheduleLabel,
  progressionIndex: number,
): boolean {
  const margin = 0.35;
  if (candidate === "Ahead") {
    const threshold = stage === "pre_run" ? 1 : 2.25;
    return progressionIndex >= threshold + margin;
  }
  if (candidate === "On schedule") {
    return progressionIndex >= -0.99 + margin;
  }
  if (candidate === "Behind") {
    return progressionIndex <= -1 - margin;
  }
  return false;
}

function scheduleReasonCode(label: ScheduleLabel): RiverRunReasonCode {
  switch (label) {
    case "Ahead":
      return "schedule_ahead";
    case "On schedule":
      return "schedule_on_schedule";
    case "Behind":
      return "schedule_behind";
    case "Uncertain":
      return "schedule_uncertain";
  }
}

function scheduleCopy(
  label: ScheduleLabel,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  switch (label) {
    case "Ahead":
      return {
        headline: "The broader progression appears ahead of the calendar.",
        detail:
          "This compares completed recent days with the configured run stage.",
        tip:
          "Compare this broader progression read with the other primitives separately.",
      };
    case "On schedule":
      return {
        headline: "The broader progression appears aligned with the calendar.",
        detail:
          "This is a completed-day progression read against the configured run stage.",
        tip:
          "Compare this broader progression read with the other primitives separately.",
      };
    case "Behind":
      return {
        headline: "The broader progression appears behind the calendar.",
        detail:
          "This describes recent completed-day progression against the configured run stage.",
        tip:
          "Compare this broader progression read with the other primitives separately.",
      };
    case "Uncertain":
      return {
        headline: "The broader progression is uncertain from available inputs.",
        detail:
          "Schedule needs enough usable completed-day inputs to classify progression clearly.",
        tip:
          "Compare this broader progression read with the other primitives separately.",
      };
  }
}
