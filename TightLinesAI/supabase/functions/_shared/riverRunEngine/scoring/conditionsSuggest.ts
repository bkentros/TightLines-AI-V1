import type {
  GaugeFreshness,
  PrimitiveDisplay,
  RiverMetric,
  RiverRunProfile,
  RiverRunReasonCode,
} from "../types.ts";
import type { RiverRunConditionsSuggestBaseline } from "../storage/types.ts";
import { addDays, compareLocalDates } from "../metrics/dateWindow.ts";
import {
  type ConditionsSuggestCheckpoint,
  type ConditionsSuggestCheckpointId,
  resolveConditionsSuggestCheckpointState,
} from "../metrics/conditionsCheckpoints.ts";
import type { RefreshSlot } from "../snapshot/refreshSlots.ts";

export type ConditionsTimingLabel =
  | "Ahead"
  | "Typical"
  | "Delayed"
  | "Insufficient evidence";

export type ConditionsSuggestLabel =
  | ConditionsTimingLabel
  | "Evaluating"
  | "Timing complete";

export type ConditionsSuggestEvidence = {
  gaugeFreshness: GaugeFreshness;
  gaugeValue?: number | null;
  gaugeMetric?: RiverMetric;
  gaugeSiteId?: string;
  waterTemperatureFreshness: GaugeFreshness;
  waterTempF?: number | null;
  waterTemperatureSourceId?: string;
  reasonCodes?: RiverRunReasonCode[];
};

export type ConditionsSuggestEvidenceByDate = Record<
  string,
  Partial<Record<RefreshSlot, ConditionsSuggestEvidence>>
>;

export type ConditionsPeriodSummary = {
  usableDays: number;
  transitionCount: number;
  gaugeAbsoluteRise: number;
  gaugeRelativeRisePct: number;
  meanWaterTempF: number;
  waterCoolingF: number;
};

export type ConditionsSuggestResult = PrimitiveDisplay & {
  label: ConditionsSuggestLabel;
  timingLabel: ConditionsTimingLabel | null;
  candidateLabel: ConditionsTimingLabel | null;
  checkpointId?: ConditionsSuggestCheckpointId;
  checkpointDate?: string;
  cutoffDate?: string;
  observationStartDate?: string;
  nextCheckpointDate?: string;
  completedCheckpointCount: number;
  currentIndex: number | null;
  currentPercentile: number | null;
  gaugeResponsePercentile: number | null;
  waterTemperaturePercentile: number | null;
  usableDays: number;
  expectedDays: number;
  coveragePercent: number;
  historicalYears: number;
  baselineVersion?: string;
  gaugeSiteId?: string;
  temperatureSourceId?: string;
  sourceDates: string[];
  sourceRefreshSlots: Partial<Record<string, RefreshSlot>>;
};

type CheckpointScore = ConditionsSuggestResult & {
  label: ConditionsTimingLabel;
  timingLabel: ConditionsTimingLabel;
  candidateLabel: ConditionsTimingLabel;
};

const SLOT_PREFERENCE: readonly RefreshSlot[] = ["16:00", "08:00", "00:00"];
const GAUGE_WEIGHT = 0.6;
const WATER_TEMPERATURE_WEIGHT = 0.4;

export function scoreConditionsSuggest(input: {
  localDate: string;
  run: Pick<
    RiverRunProfile,
    | "displayName"
    | "runWindow"
    | "conditionsSuggest"
    | "push"
  >;
  evidenceByDate: ConditionsSuggestEvidenceByDate;
  baselines?: RiverRunConditionsSuggestBaseline[] | null;
}): ConditionsSuggestResult {
  const checkpointState = resolveConditionsSuggestCheckpointState(
    input.run,
    input.localDate,
  );
  if (!checkpointState.activeCheckpoint) {
    return awaitingResult({
      observationStarted: checkpointState.observationStarted,
      observationStartDate: checkpointState.window.stagingStartDate,
      nextCheckpointDate: checkpointState.nextCheckpoint?.checkpointDate,
      hydraulicLabel: input.run.push.hydraulic.sourceLabel,
    });
  }

  const baselines = input.baselines ?? [];
  let previousConfidentLabel:
    | Exclude<
      ConditionsTimingLabel,
      "Insufficient evidence"
    >
    | null = null;
  let activeResult: CheckpointScore | null = null;
  for (const checkpoint of checkpointState.activeCheckpoints) {
    const baseline = baselines.find((row) =>
      row.checkpointId === checkpoint.checkpointId
    ) ?? null;
    const scored = scoreCheckpoint({
      run: input.run,
      checkpoint,
      baseline,
      evidenceByDate: input.evidenceByDate,
      previousConfidentLabel,
      completedCheckpointCount:
        checkpointState.activeCheckpoints.indexOf(checkpoint) + 1,
      nextCheckpointDate: checkpointState.nextCheckpoint?.checkpointDate,
    });
    activeResult = scored;
    if (scored.timingLabel !== "Insufficient evidence") {
      previousConfidentLabel = scored.timingLabel;
    }
  }

  if (!activeResult) {
    return awaitingResult({
      observationStarted: checkpointState.observationStarted,
      observationStartDate: checkpointState.window.stagingStartDate,
      nextCheckpointDate: checkpointState.nextCheckpoint?.checkpointDate,
      hydraulicLabel: input.run.push.hydraulic.sourceLabel,
    });
  }
  if (!checkpointState.complete) return activeResult;
  return completeResult({
    run: input.run,
    checkpointResult: activeResult,
    mainRunWindowPassed:
      compareLocalDates(input.localDate, checkpointState.window.endDate) > 0,
  });
}

function scoreCheckpoint(input: {
  run: Pick<
    RiverRunProfile,
    "conditionsSuggest" | "push"
  >;
  checkpoint: ConditionsSuggestCheckpoint;
  baseline: RiverRunConditionsSuggestBaseline | null;
  evidenceByDate: ConditionsSuggestEvidenceByDate;
  previousConfidentLabel:
    | Exclude<
      ConditionsTimingLabel,
      "Insufficient evidence"
    >
    | null;
  completedCheckpointCount: number;
  nextCheckpointDate?: string;
}): CheckpointScore {
  const sourceDates = datesBetween(
    input.checkpoint.observationStartDate,
    input.checkpoint.cutoffDate,
  );
  const sourceRefreshSlots: Partial<Record<string, RefreshSlot>> = {};
  const selected = sourceDates.map((sourceDate) => {
    const resolved = selectEvidence(
      input.evidenceByDate[sourceDate],
      input.baseline,
    );
    if (resolved.slot) sourceRefreshSlots[sourceDate] = resolved.slot;
    return { sourceDate, ...resolved };
  });
  const usable = selected.flatMap((item) =>
    item.evidence && evidenceIsUsable(item.evidence, input.baseline)
      ? [{ sourceDate: item.sourceDate, evidence: item.evidence }]
      : []
  );
  const evidenceReasonCodes = usable.flatMap((item) =>
    item.evidence.reasonCodes ?? []
  );
  const evidenceGate = resolveEvidenceGate({
    run: input.run,
    checkpoint: input.checkpoint,
    baseline: input.baseline,
    selected,
    usableDays: usable.length,
    expectedDays: sourceDates.length,
  });

  if (evidenceGate) {
    return insufficientResult({
      checkpoint: input.checkpoint,
      nextCheckpointDate: input.nextCheckpointDate,
      completedCheckpointCount: input.completedCheckpointCount,
      sourceDates,
      sourceRefreshSlots,
      usableDays: usable.length,
      expectedDays: sourceDates.length,
      historicalYears: input.baseline?.distinctYears ?? 0,
      baseline: input.baseline,
      reasonCodes: [
        ...evidenceReasonCodes,
        evidenceGate,
        "conditions_insufficient",
      ],
    });
  }

  const summary = summarizeConditionsPeriod(
    usable.map((item) => ({
      localDate: item.sourceDate,
      gaugeValue: item.evidence.gaugeValue!,
      waterTempF: item.evidence.waterTempF!,
    })),
  );
  if (!summary || summary.transitionCount < 4) {
    return insufficientResult({
      checkpoint: input.checkpoint,
      nextCheckpointDate: input.nextCheckpointDate,
      completedCheckpointCount: input.completedCheckpointCount,
      sourceDates,
      sourceRefreshSlots,
      usableDays: summary?.usableDays ?? usable.length,
      expectedDays: sourceDates.length,
      historicalYears: input.baseline!.distinctYears,
      baseline: input.baseline,
      reasonCodes: [
        ...evidenceReasonCodes,
        "conditions_limited_source_days",
        "conditions_insufficient",
      ],
    });
  }

  const gaugeResponsePercentile = Math.min(
    percentileRank(
      summary.gaugeAbsoluteRise,
      input.baseline!.componentSamples.gaugeAbsoluteRise,
    ),
    percentileRank(
      summary.gaugeRelativeRisePct,
      input.baseline!.componentSamples.gaugeRelativeRisePct,
    ),
  );
  const coolnessPercentile = Math.min(
    inversePercentileRank(
      summary.meanWaterTempF,
      input.baseline!.componentSamples.meanWaterTempF,
    ),
    input.run.conditionsSuggest.coolEnoughPercentileCap,
  );
  const coolingPercentile = percentileRank(
    summary.waterCoolingF,
    input.baseline!.componentSamples.waterCoolingF,
  );
  let waterTemperaturePercentile = round1(
    (coolnessPercentile + coolingPercentile) / 2,
  );
  if (
    summary.meanWaterTempF > input.run.push.temperature.tooWarmF
  ) {
    waterTemperaturePercentile = Math.min(
      waterTemperaturePercentile,
      49,
    );
  }
  const currentIndex = round1(
    gaugeResponsePercentile * GAUGE_WEIGHT +
      waterTemperaturePercentile * WATER_TEMPERATURE_WEIGHT,
  );
  const currentPercentile = percentileRank(
    currentIndex,
    input.baseline!.historicalSamples.map((sample) => sample.evidenceIndex),
  );
  const signalsStronglyMixed = (gaugeResponsePercentile >=
      input.run.conditionsSuggest.aheadPercentile &&
    waterTemperaturePercentile <=
      input.run.conditionsSuggest.delayedPercentile) ||
    (gaugeResponsePercentile <=
        input.run.conditionsSuggest.delayedPercentile &&
      waterTemperaturePercentile >=
        input.run.conditionsSuggest.aheadPercentile);
  const candidateLabel = resolveConditionsCandidateLabel({
    currentPercentile,
    gaugeResponsePercentile,
    waterTemperaturePercentile,
    signalsStronglyMixed,
    delayedPercentile: input.run.conditionsSuggest.delayedPercentile,
    aheadPercentile: input.run.conditionsSuggest.aheadPercentile,
  });
  const timingResolution = resolveConditionsCheckpointTimingLabel(
    input.previousConfidentLabel,
    candidateLabel,
  );
  const oppositeCheckpointTempered = timingResolution.reversalTempered;
  const timingLabel = timingResolution.label;
  const reasonCodes = new Set<RiverRunReasonCode>([
    ...evidenceReasonCodes,
    checkpointReasonCode(input.checkpoint.checkpointId),
    conditionsReasonCode(timingLabel),
  ]);
  if (signalsStronglyMixed) reasonCodes.add("conditions_signals_mixed");
  if (oppositeCheckpointTempered) {
    reasonCodes.add("conditions_checkpoint_reversal_tempered");
  }

  return {
    label: timingLabel,
    timingLabel,
    candidateLabel,
    checkpointId: input.checkpoint.checkpointId,
    checkpointDate: input.checkpoint.checkpointDate,
    cutoffDate: input.checkpoint.cutoffDate,
    observationStartDate: input.checkpoint.observationStartDate,
    nextCheckpointDate: input.nextCheckpointDate,
    completedCheckpointCount: input.completedCheckpointCount,
    currentIndex,
    currentPercentile,
    gaugeResponsePercentile,
    waterTemperaturePercentile,
    usableDays: summary.usableDays,
    expectedDays: sourceDates.length,
    coveragePercent: round3(summary.usableDays / sourceDates.length),
    historicalYears: input.baseline!.distinctYears,
    baselineVersion: input.baseline!.baselineVersion,
    gaugeSiteId: input.baseline!.gaugeSiteId,
    temperatureSourceId: input.baseline!.temperatureSourceId,
    sourceDates,
    sourceRefreshSlots,
    ...conditionsCopy({
      label: timingLabel,
      checkpoint: input.checkpoint,
      signalsStronglyMixed,
      oppositeCheckpointTempered,
      hydraulicLabel: input.run.push.hydraulic.sourceLabel,
    }),
    reasonCodes: [...reasonCodes],
  };
}

export function summarizeConditionsPeriod(
  values: Array<{
    localDate: string;
    gaugeValue: number;
    waterTempF: number;
  }>,
): ConditionsPeriodSummary | null {
  const usable = values
    .filter((item) =>
      isFiniteNumber(item.gaugeValue) && item.gaugeValue > 0 &&
      isFiniteNumber(item.waterTempF)
    )
    .toSorted((a, b) => a.localDate.localeCompare(b.localDate));
  if (usable.length === 0) return null;

  let gaugeAbsoluteRise = 0;
  let gaugeRelativeRisePct = 0;
  let transitionCount = 0;
  for (let index = 1; index < usable.length; index += 1) {
    if (addDays(usable[index - 1].localDate, 1) !== usable[index].localDate) {
      continue;
    }
    const delta = usable[index].gaugeValue - usable[index - 1].gaugeValue;
    if (delta > 0) {
      gaugeAbsoluteRise += delta;
      gaugeRelativeRisePct += delta / usable[index - 1].gaugeValue * 100;
    }
    transitionCount++;
  }
  return {
    usableDays: usable.length,
    transitionCount,
    gaugeAbsoluteRise: round3(gaugeAbsoluteRise),
    gaugeRelativeRisePct: round3(gaugeRelativeRisePct),
    meanWaterTempF: round3(
      usable.reduce((sum, item) => sum + item.waterTempF, 0) / usable.length,
    ),
    waterCoolingF: round3(
      usable[0].waterTempF - usable[usable.length - 1].waterTempF,
    ),
  };
}

/** @deprecated Use summarizeConditionsPeriod for cumulative checkpoints. */
export const summarizeConditionsWeek = summarizeConditionsPeriod;

export function percentileRank(value: number, samples: number[]): number {
  const usable = samples.filter(isFiniteNumber).toSorted((a, b) => a - b);
  if (usable.length === 0 || !isFiniteNumber(value)) return 0;
  const below = usable.filter((sample) => sample < value).length;
  const equal = usable.filter((sample) => sample === value).length;
  return round1((below + equal * 0.5) / usable.length * 100);
}

export function inversePercentileRank(
  value: number,
  samples: number[],
): number {
  return round1(100 - percentileRank(value, samples));
}

export function resolveConditionsCandidateLabel(input: {
  currentPercentile: number;
  gaugeResponsePercentile: number;
  waterTemperaturePercentile: number;
  signalsStronglyMixed: boolean;
  delayedPercentile: number;
  aheadPercentile: number;
}): Exclude<ConditionsTimingLabel, "Insufficient evidence"> {
  if (input.signalsStronglyMixed) return "Typical";
  if (
    input.currentPercentile >= input.aheadPercentile &&
    input.gaugeResponsePercentile >= 50 &&
    input.waterTemperaturePercentile >= 50
  ) {
    return "Ahead";
  }
  if (
    input.currentPercentile <= input.delayedPercentile &&
    input.gaugeResponsePercentile <= 50 &&
    input.waterTemperaturePercentile <= 50
  ) {
    return "Delayed";
  }
  return "Typical";
}

function resolveEvidenceGate(input: {
  run: Pick<RiverRunProfile, "conditionsSuggest">;
  checkpoint: ConditionsSuggestCheckpoint;
  baseline: RiverRunConditionsSuggestBaseline | null;
  selected: Array<{
    sourceDate: string;
    evidence?: ConditionsSuggestEvidence;
  }>;
  usableDays: number;
  expectedDays: number;
}): RiverRunReasonCode | null {
  if (!input.baseline) return "conditions_baseline_missing";
  if (
    input.baseline.baselineVersion !==
      input.run.conditionsSuggest.baselineVersion
  ) {
    return "conditions_baseline_version_mismatch";
  }
  if (input.baseline.checkpointId !== input.checkpoint.checkpointId) {
    return "conditions_baseline_window_mismatch";
  }
  if (
    input.baseline.expectedDays !== input.expectedDays ||
    input.baseline.observationStartDayOfYear <= 0
  ) {
    return "conditions_baseline_window_mismatch";
  }
  if (
    input.baseline.distinctYears <
      input.run.conditionsSuggest.minimumUsableYears
  ) {
    return "conditions_baseline_insufficient_years";
  }
  const cutoffEvidence = input.selected.at(-1)?.evidence;
  if (
    !cutoffEvidence ||
    cutoffEvidence.gaugeFreshness !== "fresh" ||
    !isFiniteNumber(cutoffEvidence.gaugeValue)
  ) {
    return "conditions_missing_checkpoint_gauge";
  }
  if (
    cutoffEvidence.waterTemperatureFreshness !== "fresh" ||
    !isFiniteNumber(cutoffEvidence.waterTempF)
  ) {
    return "conditions_missing_checkpoint_temperature";
  }
  if (
    cutoffEvidence.gaugeMetric !== input.baseline.gaugeMetric ||
    cutoffEvidence.gaugeSiteId !== input.baseline.gaugeSiteId ||
    cutoffEvidence.waterTemperatureSourceId !==
      input.baseline.temperatureSourceId
  ) {
    return "conditions_source_mismatch";
  }
  if (input.usableDays < input.baseline.minimumUsableDays) {
    return "conditions_limited_source_days";
  }
  return null;
}

function selectEvidence(
  refreshes:
    | Partial<Record<RefreshSlot, ConditionsSuggestEvidence>>
    | undefined,
  baseline: RiverRunConditionsSuggestBaseline | null,
): { slot?: RefreshSlot; evidence?: ConditionsSuggestEvidence } {
  if (!refreshes) return {};
  const usable = SLOT_PREFERENCE.flatMap((slot) => {
    const evidence = refreshes[slot];
    return evidence && evidenceIsUsable(evidence, baseline)
      ? [{ slot, evidence }]
      : [];
  });
  if (usable.length > 0) {
    const latest = usable[0];
    return {
      slot: latest.slot,
      evidence: {
        ...latest.evidence,
        gaugeValue: mean(
          usable.map((item) => item.evidence.gaugeValue!),
        ),
        waterTempF: median(
          usable.map((item) => item.evidence.waterTempF!),
        ),
        reasonCodes: [
          ...new Set(
            usable.flatMap((item) => item.evidence.reasonCodes ?? []),
          ),
        ],
      },
    };
  }
  for (const slot of SLOT_PREFERENCE) {
    if (refreshes[slot]) return { slot, evidence: refreshes[slot] };
  }
  return {};
}

function evidenceIsUsable(
  evidence: ConditionsSuggestEvidence,
  baseline: RiverRunConditionsSuggestBaseline | null,
): boolean {
  return Boolean(
    baseline &&
      evidence.gaugeFreshness === "fresh" &&
      evidence.waterTemperatureFreshness === "fresh" &&
      isFiniteNumber(evidence.gaugeValue) &&
      evidence.gaugeValue > 0 &&
      isFiniteNumber(evidence.waterTempF) &&
      evidence.gaugeMetric === baseline.gaugeMetric &&
      evidence.gaugeSiteId === baseline.gaugeSiteId &&
      evidence.waterTemperatureSourceId === baseline.temperatureSourceId,
  );
}

export function resolveConditionsCheckpointTimingLabel(
  previous: Exclude<ConditionsTimingLabel, "Insufficient evidence"> | null,
  candidate: Exclude<ConditionsTimingLabel, "Insufficient evidence">,
): {
  label: Exclude<ConditionsTimingLabel, "Insufficient evidence">;
  reversalTempered: boolean;
} {
  const reversalTempered = (previous === "Ahead" && candidate === "Delayed") ||
    (previous === "Delayed" && candidate === "Ahead");
  return {
    label: reversalTempered ? "Typical" : candidate,
    reversalTempered,
  };
}

function checkpointReasonCode(
  checkpointId: ConditionsSuggestCheckpointId,
): RiverRunReasonCode {
  switch (checkpointId) {
    case "river_start":
      return "conditions_checkpoint_river_start";
    case "building_start":
      return "conditions_checkpoint_building_start";
    case "peak_start":
      return "conditions_checkpoint_peak_start";
    case "peak_complete":
      return "conditions_checkpoint_peak_complete";
  }
}

function conditionsReasonCode(
  label: ConditionsTimingLabel,
): RiverRunReasonCode {
  switch (label) {
    case "Ahead":
      return "conditions_ahead";
    case "Typical":
      return "conditions_typical";
    case "Delayed":
      return "conditions_delayed";
    case "Insufficient evidence":
      return "conditions_insufficient";
  }
}

function conditionsCopy(input: {
  label: Exclude<ConditionsTimingLabel, "Insufficient evidence">;
  checkpoint: ConditionsSuggestCheckpoint;
  signalsStronglyMixed: boolean;
  oppositeCheckpointTempered: boolean;
  hydraulicLabel: string;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const period = checkpointPeriodName(input.checkpoint);
  if (input.oppositeCheckpointTempered) {
    return {
      headline:
        "Conditions suggest timing near the historical pattern overall.",
      detail:
        `The cumulative ${period} evidence pointed opposite the prior checkpoint, so Conditions Suggest conservatively resolves the progression as Typical instead of reversing directly.`,
      tip:
        "Use Push for current movement conditions; this checkpoint remains a cumulative timing comparison.",
    };
  }
  if (input.signalsStronglyMixed) {
    return {
      headline:
        "Conditions suggest timing near the historical pattern overall.",
      detail:
        `Cumulative ${input.hydraulicLabel} river response and measured-water temperature pointed in different directions through the ${period}, so the checkpoint stays Typical.`,
      tip:
        "Use Push for current movement conditions; one signal cannot overpower the other here.",
    };
  }
  switch (input.label) {
    case "Ahead":
      return {
        headline: "Cumulative conditions suggest earlier timing than typical.",
        detail:
          `${input.hydraulicLabel} river response and measured-water temperature from staging through the ${period} both rank on the earlier side of the historical pattern.`,
        tip:
          "This is a cumulative timing inference, not confirmation that fish entered the river.",
      };
    case "Typical":
      return {
        headline:
          "Cumulative conditions suggest timing near the historical pattern.",
        detail:
          `The combined river-response and measured-water pattern from staging through the ${period} remains near its historical range.`,
        tip: "Use Push separately for the newest movement-trigger conditions.",
      };
    case "Delayed":
      return {
        headline: "Cumulative conditions suggest later timing than typical.",
        detail:
          `${input.hydraulicLabel} river response and measured-water temperature from staging through the ${period} both rank on the later side of the historical pattern.`,
        tip:
          "A fresh Push can improve current conditions without rewriting this locked cumulative checkpoint.",
      };
  }
}

function checkpointPeriodName(
  checkpoint: ConditionsSuggestCheckpoint,
): string {
  switch (checkpoint.checkpointId) {
    case "river_start":
      return "pre-run checkpoint";
    case "building_start":
      return "beginning-stage checkpoint";
    case "peak_start":
      return "building-stage checkpoint";
    case "peak_complete":
      return "peak-window checkpoint";
  }
}

function awaitingResult(input: {
  observationStarted: boolean;
  observationStartDate: string;
  nextCheckpointDate?: string;
  hydraulicLabel: string;
}): ConditionsSuggestResult {
  return {
    label: "Evaluating",
    timingLabel: null,
    candidateLabel: null,
    observationStartDate: input.observationStartDate,
    nextCheckpointDate: input.nextCheckpointDate,
    completedCheckpointCount: 0,
    currentIndex: null,
    currentPercentile: null,
    gaugeResponsePercentile: null,
    waterTemperaturePercentile: null,
    usableDays: 0,
    expectedDays: 0,
    coveragePercent: 0,
    historicalYears: 0,
    sourceDates: [],
    sourceRefreshSlots: {},
    headline: input.observationStarted
      ? "Conditions Suggest is building its first cumulative checkpoint."
      : "Conditions Suggest has not started collecting this run's evidence.",
    detail: input.observationStarted
      ? `Measured water temperature and ${input.hydraulicLabel} river response are accumulating from the configured staging start.`
      : `Cumulative evidence begins on the configured staging date, ${input.observationStartDate}.`,
    tip: input.nextCheckpointDate
      ? `The next locked timing checkpoint is ${input.nextCheckpointDate}.`
      : "Check the configured run calendar for the first timing checkpoint.",
    reasonCodes: ["conditions_checkpoint_evaluating"],
  };
}

function completeResult(input: {
  run: Pick<RiverRunProfile, "displayName">;
  checkpointResult: CheckpointScore;
  mainRunWindowPassed: boolean;
}): ConditionsSuggestResult {
  const timingLabel = input.checkpointResult.timingLabel;
  const finalDetail = timingLabel === "Insufficient evidence"
    ? "The final cumulative peak-window checkpoint did not have enough matching gauge, measured-water, and historical evidence for a timing classification."
    : `The final cumulative peak-window checkpoint was ${timingLabel}. That result is locked and will not reverse after peak.`;
  return {
    ...input.checkpointResult,
    label: "Timing complete",
    headline: input.mainRunWindowPassed
      ? `The configured ${input.run.displayName} run window has passed.`
      : `The configured ${input.run.displayName} run is now well underway by calendar timing.`,
    detail: finalDetail,
    tip: input.mainRunWindowPassed
      ? "Conditions Suggest and Push tracking are complete for this run; Fish In River remains historical seasonal-presence context only."
      : "Conditions Suggest is complete for this run; use Push for fresh movement conditions and Fish In River for expected seasonal presence.",
    reasonCodes: [
      ...new Set([
        ...input.checkpointResult.reasonCodes,
        "conditions_timing_complete" as const,
      ]),
    ],
  };
}

function insufficientResult(input: {
  checkpoint: ConditionsSuggestCheckpoint;
  nextCheckpointDate?: string;
  completedCheckpointCount: number;
  sourceDates: string[];
  sourceRefreshSlots: Partial<Record<string, RefreshSlot>>;
  usableDays: number;
  expectedDays: number;
  historicalYears: number;
  baseline?: RiverRunConditionsSuggestBaseline | null;
  reasonCodes: RiverRunReasonCode[];
}): CheckpointScore {
  const insufficientReason = input.reasonCodes.find((reasonCode) =>
    reasonCode.startsWith("conditions_") &&
    reasonCode !== "conditions_insufficient"
  );
  return {
    label: "Insufficient evidence",
    timingLabel: "Insufficient evidence",
    candidateLabel: "Insufficient evidence",
    checkpointId: input.checkpoint.checkpointId,
    checkpointDate: input.checkpoint.checkpointDate,
    cutoffDate: input.checkpoint.cutoffDate,
    observationStartDate: input.checkpoint.observationStartDate,
    nextCheckpointDate: input.nextCheckpointDate,
    completedCheckpointCount: input.completedCheckpointCount,
    currentIndex: null,
    currentPercentile: null,
    gaugeResponsePercentile: null,
    waterTemperaturePercentile: null,
    usableDays: input.usableDays,
    expectedDays: input.expectedDays,
    coveragePercent: input.expectedDays > 0
      ? round3(input.usableDays / input.expectedDays)
      : 0,
    historicalYears: input.historicalYears,
    baselineVersion: input.baseline?.baselineVersion,
    gaugeSiteId: input.baseline?.gaugeSiteId,
    temperatureSourceId: input.baseline?.temperatureSourceId,
    sourceDates: input.sourceDates,
    sourceRefreshSlots: input.sourceRefreshSlots,
    ...insufficientCopy(insufficientReason),
    reasonCodes: [
      ...new Set([
        ...input.reasonCodes,
        checkpointReasonCode(input.checkpoint.checkpointId),
      ]),
    ],
  };
}

function insufficientCopy(
  reason?: RiverRunReasonCode,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const base = {
    headline: "Conditions Suggest has insufficient checkpoint evidence.",
    tip:
      "This checkpoint remains unclassified; the next checkpoint may classify if cumulative coverage is sufficient.",
  };
  switch (reason) {
    case "conditions_baseline_missing":
    case "conditions_baseline_insufficient_years":
      return {
        ...base,
        detail:
          "At least five matching historical years are not available for this cumulative run checkpoint.",
      };
    case "conditions_baseline_version_mismatch":
    case "conditions_baseline_window_mismatch":
      return {
        ...base,
        detail:
          "The saved historical checkpoint does not match the active cumulative Conditions Suggest configuration.",
      };
    case "conditions_missing_checkpoint_gauge":
      return {
        ...base,
        detail:
          "The checkpoint cutoff date does not have a current reading from the primary gauge used by this comparison.",
      };
    case "conditions_missing_checkpoint_temperature":
      return {
        ...base,
        detail:
          "The checkpoint cutoff date does not have a current reading from the measured-water source used by this comparison.",
      };
    case "conditions_source_mismatch":
      return {
        ...base,
        detail:
          "The current gauge or measured-water source does not match the source used to build this checkpoint.",
      };
    case "conditions_limited_source_days":
      return {
        ...base,
        detail:
          "The cumulative checkpoint has fewer matching gauge-and-temperature dates than its configured coverage requirement.",
      };
    default:
      return {
        ...base,
        detail:
          "This cumulative checkpoint needs matching primary-gauge, measured-water, and five-year historical evidence.",
      };
  }
}

function datesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  for (
    let date = startDate;
    compareLocalDates(date, endDate) <= 0;
    date = addDays(date, 1)
  ) {
    dates.push(date);
  }
  return dates;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function mean(values: number[]): number {
  return round3(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

function median(values: number[]): number {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return round3(
    sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle],
  );
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
