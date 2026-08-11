import type {
  GaugeFreshness,
  PrimitiveDisplay,
  PushRules,
  RiverMetric,
  RiverRunProfile,
  RiverRunReasonCode,
} from "../types.ts";
import { RIVER_RUN_COPY_VERSION } from "../copy/version.ts";
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
  | "Not monitoring yet"
  | "Evaluating"
  | "Timing complete"
  | "Unavailable";

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
  previousCheckpointId?: ConditionsSuggestCheckpointId;
  previousCheckpointDate?: string;
  previousTimingLabel?: ConditionsTimingLabel | null;
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

const DEFAULT_GAUGE_WEIGHT = 0.6;
const DEFAULT_WATER_TEMPERATURE_WEIGHT = 0.4;

export function scoreConditionsSuggest(input: {
  localDate: string;
  run:
    & Pick<
      RiverRunProfile,
      | "runWindow"
      | "conditionsSuggest"
      | "push"
      | "handoff"
      | "runType"
      | "runStageCopyStrategy"
    >
    & {
      conditionsSuggest: NonNullable<RiverRunProfile["conditionsSuggest"]>;
      push: PushRules;
    };
  evidenceByDate: ConditionsSuggestEvidenceByDate;
  baselines?: RiverRunConditionsSuggestBaseline[] | null;
}): ConditionsSuggestResult {
  const checkpointState = resolveConditionsSuggestCheckpointState(
    input.run,
    input.localDate,
  );
  const pereMarquette = input.run.runStageCopyStrategy === "pere_marquette";
  const bigManistee = input.run.runStageCopyStrategy ===
    "big_manistee_tailwater";
  const muskegon = input.run.runStageCopyStrategy ===
    "muskegon_croton_tailwater";
  const stJoseph = input.run.runStageCopyStrategy === "st_joseph_corridor";
  const pmFallEntryComplete = pereMarquette &&
    input.run.runType === "fall_entry" &&
    compareLocalDates(input.localDate, checkpointState.window.endDate) > 0;
  const bigManisteeFallEntryComplete = bigManistee &&
    input.run.runType === "fall_entry" &&
    compareLocalDates(input.localDate, checkpointState.window.endDate) > 0;
  const muskegonFallEntryComplete = muskegon &&
    input.run.runType === "fall_entry" &&
    compareLocalDates(input.localDate, checkpointState.window.endDate) > 0;
  const stJosephFallEntryComplete = stJoseph &&
    input.run.runType === "fall_entry" &&
    compareLocalDates(input.localDate, checkpointState.window.endDate) > 0;
  const monitoringInactive = compareLocalDates(
        input.localDate,
        checkpointState.window.stagingStartDate,
      ) < 0 ||
    compareLocalDates(
            input.localDate,
            checkpointState.window.postRunLateCopyEndDate,
          ) > 0 &&
      !pmFallEntryComplete && !bigManisteeFallEntryComplete &&
      !muskegonFallEntryComplete && !stJosephFallEntryComplete;
  if (monitoringInactive) {
    return inactiveResult({
      observationStartDate: checkpointState.window.stagingStartDate,
      nextCheckpointDate: checkpointState.nextCheckpoint?.checkpointDate,
      stJoseph: input.run.runStageCopyStrategy === "st_joseph_corridor",
      pereMarquette,
      bigManistee,
      muskegon,
    });
  }
  if (!checkpointState.activeCheckpoint) {
    return awaitingResult({
      observationStarted: checkpointState.observationStarted,
      observationStartDate: checkpointState.window.stagingStartDate,
      nextCheckpointDate: checkpointState.nextCheckpoint?.checkpointDate,
      stJoseph: input.run.runStageCopyStrategy === "st_joseph_corridor",
      pereMarquette,
      bigManistee,
      muskegon,
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
    const previousCheckpointResult = activeResult;
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
    if (
      previousCheckpointResult?.checkpointId &&
      previousCheckpointResult.checkpointDate
    ) {
      scored.previousCheckpointId = previousCheckpointResult.checkpointId;
      scored.previousCheckpointDate = previousCheckpointResult.checkpointDate;
      scored.previousTimingLabel = previousCheckpointResult.timingLabel;
    }
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
      stJoseph: input.run.runStageCopyStrategy === "st_joseph_corridor",
      pereMarquette,
      bigManistee,
      muskegon,
    });
  }
  if (!checkpointState.complete) return activeResult;
  return completeResult({
    checkpointResult: activeResult,
    mainRunWindowPassed:
      compareLocalDates(input.localDate, checkpointState.window.endDate) > 0,
    winterHoldingHandoff: !!input.run.handoff &&
      !pereMarquette &&
      compareLocalDates(input.localDate, checkpointState.window.endDate) > 0,
    pmFallEntryComplete,
    bigManisteeFallEntryComplete,
    muskegonFallEntryComplete,
    stJosephFallEntryComplete,
  });
}

function inactiveResult(input: {
  observationStartDate: string;
  nextCheckpointDate?: string;
  stJoseph: boolean;
  pereMarquette: boolean;
  bigManistee: boolean;
  muskegon: boolean;
}): ConditionsSuggestResult {
  return {
    label: "Not monitoring yet",
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
    headline: input.pereMarquette
      ? "PM Migration Timing is not monitoring yet."
      : input.bigManistee
      ? "Big Manistee Migration Timing is not monitoring yet."
      : input.muskegon
      ? "Muskegon Migration Timing is not monitoring yet."
      : "Migration Timing is not active right now.",
    detail: input.pereMarquette
      ? `Season-to-date Scottville flow and M-37 temperature monitoring resumes ${
        seasonalReturnPhrase(input.observationStartDate.slice(5))
      }.`
      : input.bigManistee
      ? `Season-to-date Wellston flow and temperature monitoring resumes ${
        seasonalReturnPhrase(input.observationStartDate.slice(5))
      }.`
      : input.muskegon
      ? `Season-to-date Croton flow and measured-temperature monitoring resumes ${
        seasonalReturnPhrase(input.observationStartDate.slice(5))
      }.`
      : "Timing monitoring begins before the expected river entry, but that seasonal observation window is not active yet.",
    tip: input.stJoseph
      ? "Check Migration Stage for the active St. Joseph species and section. Return to this read when Niles monitoring begins; do not use offseason water changes to justify a corridor trip."
      : input.pereMarquette
      ? `Check back ${
        seasonalReturnPhrase(input.observationStartDate.slice(5))
      } when PM timing monitoring resumes.`
      : input.bigManistee
      ? `Check back ${
        seasonalReturnPhrase(input.observationStartDate.slice(5))
      } when Big Manistee timing monitoring resumes.`
      : input.muskegon
      ? `Check back ${
        seasonalReturnPhrase(input.observationStartDate.slice(5))
      } when Muskegon timing monitoring resumes.`
      : "Check Migration Stage for the current seasonal position and return to Migration Timing when early monitoring begins.",
    reasonCodes: ["conditions_monitoring_inactive"],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function scoreCheckpoint(input: {
  run:
    & Pick<
      RiverRunProfile,
      "conditionsSuggest" | "push" | "runStageCopyStrategy"
    >
    & {
      conditionsSuggest: NonNullable<RiverRunProfile["conditionsSuggest"]>;
      push: PushRules;
    };
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
      pereMarquette: input.run.runStageCopyStrategy === "pere_marquette",
      bigManistee: input.run.runStageCopyStrategy ===
        "big_manistee_tailwater",
      muskegon: input.run.runStageCopyStrategy ===
        "muskegon_croton_tailwater",
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
      pereMarquette: input.run.runStageCopyStrategy === "pere_marquette",
      bigManistee: input.run.runStageCopyStrategy ===
        "big_manistee_tailwater",
      muskegon: input.run.runStageCopyStrategy ===
        "muskegon_croton_tailwater",
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
    gaugeResponsePercentile *
        (input.run.conditionsSuggest.gaugeWeight ?? DEFAULT_GAUGE_WEIGHT) +
      waterTemperaturePercentile *
        (input.run.conditionsSuggest.waterTemperatureWeight ??
          DEFAULT_WATER_TEMPERATURE_WEIGHT),
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
      signalsStronglyMixed,
      oppositeCheckpointTempered,
      stJoseph: input.run.runStageCopyStrategy === "st_joseph_corridor",
      pereMarquette: input.run.runStageCopyStrategy === "pere_marquette",
      bigManistee: input.run.runStageCopyStrategy ===
        "big_manistee_tailwater",
      muskegon: input.run.runStageCopyStrategy ===
        "muskegon_croton_tailwater",
    }),
    reasonCodes: [...reasonCodes],
    copyVersion: RIVER_RUN_COPY_VERSION,
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
  run: Pick<RiverRunProfile, "conditionsSuggest"> & {
    conditionsSuggest: NonNullable<RiverRunProfile["conditionsSuggest"]>;
  };
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
  const slots = Object.keys(refreshes).toSorted().reverse() as RefreshSlot[];
  const usable = slots.flatMap((slot) => {
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
  for (const slot of slots) {
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
    case "building_established":
      return "conditions_checkpoint_building_established";
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
  signalsStronglyMixed: boolean;
  oppositeCheckpointTempered: boolean;
  stJoseph: boolean;
  pereMarquette: boolean;
  bigManistee: boolean;
  muskegon: boolean;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (input.pereMarquette) return pereMarquetteConditionsCopy(input);
  if (input.bigManistee) return bigManisteeConditionsCopy(input);
  if (input.muskegon) return muskegonConditionsCopy(input);
  if (input.oppositeCheckpointTempered) {
    return {
      headline:
        "The migration still appears to be moving at a normal seasonal pace.",
      detail:
        "Recent river and temperature signals changed direction, but the season as a whole does not support a clear early or late call.",
      tip: input.stJoseph
        ? stJosephTimingTip("typical")
        : "Fish the normal river section for the current Migration Stage. Begin in established holding water; if Push is Possible or stronger, make lower travel lanes the next stop.",
    };
  }
  if (input.signalsStronglyMixed) {
    return {
      headline:
        "The migration still appears to be moving at a normal seasonal pace.",
      detail:
        "River levels and water temperature are pointing in different directions, so neither supports a clear early or late read.",
      tip: input.stJoseph
        ? stJosephTimingTip("typical")
        : "Keep the normal distribution plan for the current Migration Stage. Start in established holding water; if Push is Possible or stronger, make lower travel lanes the next stop.",
    };
  }
  switch (input.label) {
    case "Ahead":
      return {
        headline: "The migration appears to be developing earlier than usual.",
        detail:
          "The river has risen and cooled faster than it normally does by this point in the season.",
        tip: input.stJoseph
          ? stJosephTimingTip("ahead")
          : "Start one accessible river section farther upstream than you normally would for this date and prioritize established holding water. If Push is Possible or stronger, finish with lower travel lanes.",
      };
    case "Typical":
      return {
        headline:
          "The migration appears to be progressing at a normal seasonal pace.",
        detail:
          "River rises and cooling are close to what is usually seen by this point in the season.",
        tip: input.stJoseph
          ? stJosephTimingTip("typical")
          : "Fish the core river section identified by Migration Stage. Begin where a travel lane feeds established holding water, then adjust presentation—not seasonal location—using Fishability.",
      };
    case "Delayed":
      return {
        headline: "The migration appears to be developing later than usual.",
        detail:
          "The river has risen and cooled more slowly than it normally does by this point in the season.",
        tip: input.stJoseph
          ? stJosephTimingTip("delayed")
          : "Start in the lower river and fish the first deep holding water connected to lake-entry travel lanes. Do not assume the middle and upper river have filled in yet.",
      };
  }
}

function bigManisteeConditionsCopy(input: {
  label: Exclude<ConditionsTimingLabel, "Insufficient evidence">;
  signalsStronglyMixed: boolean;
  oppositeCheckpointTempered: boolean;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (input.oppositeCheckpointTempered) {
    return {
      headline:
        "Big Manistee migration timing remains Typical after a change in direction.",
      detail:
        "Recent Wellston flow and temperature evidence reversed. The season-long Upper-river pattern does not support changing the prior call yet.",
      tip:
        "Keep the section named by Migration Stage. Do not shift sections from this reversal alone.",
    };
  }
  if (input.signalsStronglyMixed) {
    return {
      headline:
        "Big Manistee migration timing remains Typical because the signals are mixed.",
      detail:
        "Wellston river-rise activity and measured cooling point in opposite directions. Together they do not support an early or late call.",
      tip:
        "Keep the section named by Migration Stage. Use Push only for current fresh-movement support.",
    };
  }
  const copy = ({
    Ahead: {
      headline: "Big Manistee migration is developing earlier than usual.",
      detail:
        "Season-to-date Wellston river-rise activity and measured cooling are stronger than the usual Upper-river pattern.",
      tip:
        "Start one section upstream from Migration Stage, capped at the Upper river (High Bridge–Tippy Dam).",
    },
    Typical: {
      headline:
        "Big Manistee migration is progressing at its usual seasonal pace.",
      detail:
        "Season-to-date Wellston river-rise activity and measured cooling are close to the usual Upper-river pattern.",
      tip: "Keep the Big Manistee section named by Migration Stage.",
    },
    Delayed: {
      headline: "Big Manistee migration is developing later than usual.",
      detail:
        "Season-to-date Wellston river-rise activity and measured cooling are weaker than the usual Upper-river pattern.",
      tip:
        "Start one section downstream from Migration Stage, capped at the Lower river (M-55–Bear Creek).",
    },
  } as const)[input.label];
  return copy;
}

function muskegonConditionsCopy(input: {
  label: Exclude<ConditionsTimingLabel, "Insufficient evidence">;
  signalsStronglyMixed: boolean;
  oppositeCheckpointTempered: boolean;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (input.oppositeCheckpointTempered) {
    return {
      headline:
        "Muskegon migration timing remains Typical after a change in direction.",
      detail:
        "Recent Croton flow and measured-temperature evidence reversed. The season-long pattern does not support changing the prior call yet.",
      tip:
        "Keep the section named by Migration Stage. Do not shift sections from this reversal alone.",
    };
  }
  if (input.signalsStronglyMixed) {
    return {
      headline:
        "Muskegon migration timing remains Typical because the signals are mixed.",
      detail:
        "Croton river-rise activity and measured cooling point in opposite directions. Together they do not support an early or late call.",
      tip:
        "Keep the section named by Migration Stage. Use Push only for current movement support near Croton Dam.",
    };
  }
  return ({
    Ahead: {
      headline: "Muskegon migration is developing earlier than usual.",
      detail:
        "Season-to-date Croton river-rise activity and measured cooling are stronger than the usual pattern.",
      tip:
        "Start one section upstream from Migration Stage, capped at the Upper river (Newaygo–Croton Dam).",
    },
    Typical: {
      headline: "Muskegon migration is progressing at its usual seasonal pace.",
      detail:
        "Season-to-date Croton river-rise activity and measured cooling are close to the usual pattern.",
      tip: "Keep the Muskegon section named by Migration Stage.",
    },
    Delayed: {
      headline: "Muskegon migration is developing later than usual.",
      detail:
        "Season-to-date Croton river-rise activity and measured cooling are weaker than the usual pattern.",
      tip:
        "Start one section downstream from Migration Stage, capped at the Lower river (Muskegon Lake–M-120).",
    },
  } as const)[input.label];
}

function pereMarquetteConditionsCopy(input: {
  label: Exclude<ConditionsTimingLabel, "Insufficient evidence">;
  signalsStronglyMixed: boolean;
  oppositeCheckpointTempered: boolean;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (input.oppositeCheckpointTempered) {
    return {
      headline:
        "PM migration timing remains Typical after a change in direction.",
      detail:
        "Recent Scottville flow and M-37 temperature evidence reversed. The season-long pattern does not support changing the prior timing call yet.",
      tip:
        "Keep the section named by Migration Stage. Do not shift sections from this reversal alone.",
    };
  }
  if (input.signalsStronglyMixed) {
    return {
      headline:
        "PM migration timing remains Typical because the signals are mixed.",
      detail:
        "Scottville river-rise activity and M-37 cooling point in opposite directions. Together they do not support an early or late call.",
      tip:
        "Keep the section named by Migration Stage. Use Push only for today’s fresh-movement support.",
    };
  }
  switch (input.label) {
    case "Ahead":
      return {
        headline: "The PM migration is developing earlier than usual.",
        detail:
          "Season-to-date Scottville river-rise activity and M-37 cooling are stronger than the usual PM pattern.",
        tip:
          "Start one PM section upstream from Migration Stage, capped at the Upper river (Maple Leaf–M-37).",
      };
    case "Typical":
      return {
        headline: "The PM migration is progressing at its usual seasonal pace.",
        detail:
          "Season-to-date Scottville river-rise activity and M-37 cooling are close to the usual PM pattern.",
        tip: "Keep the PM section named by Migration Stage.",
      };
    case "Delayed":
      return {
        headline: "The PM migration is developing later than usual.",
        detail:
          "Season-to-date Scottville river-rise activity and M-37 cooling are weaker than the usual PM pattern.",
        tip:
          "Start one PM section downstream from Migration Stage, capped at the Lower river (Pere Marquette Lake–Scottville).",
      };
  }
}

function awaitingResult(input: {
  observationStarted: boolean;
  observationStartDate: string;
  nextCheckpointDate?: string;
  stJoseph: boolean;
  pereMarquette: boolean;
  bigManistee: boolean;
  muskegon: boolean;
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
    headline: input.pereMarquette
      ? "PM Migration Timing is still taking shape."
      : input.bigManistee
      ? "Big Manistee Migration Timing is still taking shape."
      : input.muskegon
      ? "Muskegon Migration Timing is still taking shape."
      : input.observationStarted
      ? "Migration Timing is still taking shape."
      : "It is too early for a dependable timing read.",
    detail: input.pereMarquette
      ? "Scottville river-rise activity and M-37 cooling do not yet support an Ahead, Typical, or Delayed call."
      : input.bigManistee
      ? "Wellston flow and measured temperature do not yet support an Ahead, Typical, or Delayed call."
      : input.muskegon
      ? "Croton flow and measured temperature do not yet support an Ahead, Typical, or Delayed call."
      : input.observationStarted
      ? "The early river and temperature pattern is still developing, so an Ahead, Typical, or Delayed call would be premature."
      : "The migration has not developed enough to compare its pace with a typical season.",
    tip: input.stJoseph
      ? input.observationStarted
        ? "Keep the trip around the St. Joseph harbor, mouth, and earliest lower-Michigan holding water. Move toward Berrien Springs or Niles only when Migration Stage or direct fish activity supports it."
        : "Keep the trip in Lake Michigan, the St. Joseph harbor, and river-mouth water. Do not use an incomplete Niles timing read to justify an inland corridor trip."
      : input.pereMarquette
      ? "Keep the section named by Migration Stage. Do not shift PM sections until this read has enough evidence."
      : input.bigManistee
      ? "Keep the section named by Migration Stage until this read has enough Upper-river evidence."
      : input.muskegon
      ? "Keep the section named by Migration Stage until this read has enough Croton-area evidence."
      : input.observationStarted
      ? "Keep the trip centered on the river mouth and earliest lower-river holding water. Move inland only when Migration Stage advances or direct fish activity supports it."
      : "Keep the trip in the lake, harbor, and river-mouth zone. Do not use Migration Timing to justify an inland river trip before a dependable seasonal pattern exists.",
    reasonCodes: ["conditions_checkpoint_evaluating"],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function stJosephTimingTip(
  state: "ahead" | "typical" | "delayed",
): string {
  if (state === "ahead") {
    return "Start one approved section upriver from the Migration Stage plan. Keep the Lower river as a fresh-entry check when Push supports it.";
  }
  if (state === "delayed") {
    return "Stay in the Lower river (St. Joseph harbor–Berrien Springs). Do not assume the Middle or Upper river has filled in.";
  }
  return "Use the section named by Migration Stage. Add a Lower-river fresh-entry check only when Push supports it.";
}

function completeResult(input: {
  checkpointResult: CheckpointScore;
  mainRunWindowPassed: boolean;
  winterHoldingHandoff: boolean;
  pmFallEntryComplete: boolean;
  bigManisteeFallEntryComplete: boolean;
  muskegonFallEntryComplete: boolean;
  stJosephFallEntryComplete: boolean;
}): ConditionsSuggestResult {
  const timingLabel = input.checkpointResult.timingLabel;
  const finalDetail = input.pmFallEntryComplete
    ? timingLabel === "Insufficient evidence"
      ? "The PM fall-entry timing window closed without enough reliable evidence for an early, typical, or delayed call."
      : `Earlier in fall, PM migration timing was ${
        timingPhrase(timingLabel)
      }. The fall-entry timing window is now complete.`
    : input.bigManisteeFallEntryComplete
    ? timingLabel === "Insufficient evidence"
      ? "The Big Manistee fall-entry timing window closed without enough reliable evidence for an early, typical, or delayed call."
      : `Earlier in fall, Big Manistee migration timing was ${
        timingPhrase(timingLabel)
      }. The fall-entry timing window is now complete.`
    : input.muskegonFallEntryComplete
    ? timingLabel === "Insufficient evidence"
      ? "The Muskegon fall-entry timing window closed without enough reliable evidence for an early, typical, or delayed call."
      : `Earlier in fall, Muskegon migration timing was ${
        timingPhrase(timingLabel)
      }. The fall-entry timing window is now complete.`
    : input.stJosephFallEntryComplete
    ? timingLabel === "Insufficient evidence"
      ? "The St. Joseph fall-entry timing window closed without enough reliable evidence for an early, typical, or delayed call."
      : `Earlier in fall, St. Joseph migration timing was ${
        timingPhrase(timingLabel)
      }. The fall-entry timing window is now complete.`
    : input.winterHoldingHandoff
    ? timingLabel === "Insufficient evidence"
      ? "There was not enough reliable season-long river and temperature information to make an early, normal, or late call. Steelhead presence has now shifted into winter holding, where current activity matters more than fall timing."
      : `Earlier in the season, the migration was moving ${
        timingPhrase(timingLabel)
      }. Fall entry has now shifted into winter holding, where current activity matters more than an early-or-late call.`
    : timingLabel === "Insufficient evidence"
    ? "There was not enough reliable season-long river and temperature information to make an early, normal, or late call."
    : input.mainRunWindowPassed
    ? `Earlier in the season, the migration was moving ${
      timingPhrase(timingLabel)
    }. Now that the main migration has passed, any remaining opportunity matters more than an early-or-late call.`
    : `Earlier in the season, the migration was moving ${
      timingPhrase(timingLabel)
    }. Now that the migration is well underway, current movement and river conditions matter more than an early-or-late call.`;
  return {
    ...input.checkpointResult,
    label: "Timing complete",
    headline: input.pmFallEntryComplete
      ? "PM fall-entry Migration Timing is complete."
      : input.bigManisteeFallEntryComplete
      ? "Big Manistee fall-entry Migration Timing is complete."
      : input.muskegonFallEntryComplete
      ? "Muskegon fall-entry Migration Timing is complete."
      : input.stJosephFallEntryComplete
      ? "St. Joseph fall-entry Migration Timing is complete."
      : input.mainRunWindowPassed
      ? "This season's Migration Timing read is complete."
      : "The early-season timing read is complete.",
    detail: finalDetail,
    tip: input.pmFallEntryComplete
      ? "Do not use completed fall timing to infer current presence or activity. PM fall monitoring resumes in early September."
      : input.bigManisteeFallEntryComplete
      ? "Do not use completed fall timing to infer current presence or activity. Big Manistee fall monitoring resumes in early September."
      : input.muskegonFallEntryComplete
      ? "Do not use completed fall timing to infer current presence or activity. Muskegon fall monitoring resumes in early September."
      : input.stJosephFallEntryComplete
      ? "Do not use completed fall timing to infer current presence or activity. St. Joseph fall-entry monitoring resumes around September 10."
      : input.winterHoldingHandoff
      ? "Stop planning around whether fall entry was early or late. Use the winter fishery read to judge current activity and presentation."
      : input.mainRunWindowPassed
      ? "Stop planning around whether the migration was early or late. Fish only the remaining established holding water supported by Fish In River, and treat scattered late fish as exceptions."
      : "Stop shifting river sections based on early-or-late timing. Begin in established holding water for the current Migration Stage; if Push is Possible or stronger, make lower travel lanes the next stop.",
    reasonCodes: [
      ...new Set([
        ...input.checkpointResult.reasonCodes,
        "conditions_timing_complete" as const,
      ]),
    ],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function insufficientResult(input: {
  pereMarquette: boolean;
  bigManistee: boolean;
  muskegon: boolean;
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
    ...insufficientCopy(
      insufficientReason,
      input.pereMarquette,
      input.bigManistee,
      input.muskegon,
    ),
    reasonCodes: [
      ...new Set([
        ...input.reasonCodes,
        checkpointReasonCode(input.checkpoint.checkpointId),
      ]),
    ],
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function insufficientCopy(
  reason?: RiverRunReasonCode,
  pereMarquette = false,
  bigManistee = false,
  muskegon = false,
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const base = {
    headline: pereMarquette
      ? "There is not enough reliable PM evidence for a Migration Timing call."
      : bigManistee
      ? "There is not enough reliable Big Manistee evidence for a Migration Timing call."
      : muskegon
      ? "There is not enough reliable Muskegon evidence for a Migration Timing call."
      : "There is not enough reliable information for a Migration Timing call.",
    tip: pereMarquette
      ? "Keep the PM section named by Migration Stage. Do not shift upstream or downstream from this timing read."
      : bigManistee
      ? "Keep the section named by Migration Stage. Do not shift sections from this timing read."
      : muskegon
      ? "Keep the Muskegon section named by Migration Stage. Do not shift sections from this timing read."
      : "Do not move farther upstream or stay lower based on this timing read. Fish the section identified by Migration Stage and begin in its most established holding water; change sections only when direct fish activity or a dependable later read supports it.",
  };
  switch (reason) {
    case "conditions_baseline_missing":
    case "conditions_baseline_insufficient_years":
      return {
        ...base,
        detail:
          "There are not enough dependable past seasons to judge whether this migration is early, normal, or late.",
      };
    case "conditions_baseline_version_mismatch":
    case "conditions_baseline_window_mismatch":
      return {
        ...base,
        detail:
          "Some of the long-term comparison data does not line up cleanly with this season, so showing a timing label would be misleading.",
      };
    case "conditions_missing_checkpoint_gauge":
      return {
        ...base,
        detail:
          "A dependable river-level reading was missing when this seasonal timing read needed it.",
      };
    case "conditions_missing_checkpoint_temperature":
      return {
        ...base,
        detail:
          "A dependable water-temperature reading was missing when this seasonal timing read needed it.",
      };
    case "conditions_source_mismatch":
      return {
        ...base,
        detail:
          "The available river and temperature readings do not line up cleanly with the long-term comparison, so the result stays blank.",
      };
    case "conditions_limited_source_days":
      return {
        ...base,
        detail:
          "Too many days are missing either river level or water temperature to make a dependable seasonal comparison.",
      };
    default:
      return {
        ...base,
        detail:
          "The season-long river and temperature record is incomplete, so an early, normal, or late label would overstate what is known.",
      };
  }
}

function timingPhrase(label: ConditionsTimingLabel): string {
  switch (label) {
    case "Ahead":
      return "earlier than usual";
    case "Typical":
      return "close to its normal pace";
    case "Delayed":
      return "later than usual";
    case "Insufficient evidence":
      return "without a dependable timing call";
  }
}

function seasonalReturnPhrase(monthDay: string): string {
  const month = Number(monthDay.slice(0, 2));
  const day = Number(monthDay.slice(3, 5));
  const period = day <= 10 ? "in early" : day <= 20 ? "in mid" : "in late";
  const monthName = [
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
  ][month - 1];
  return `${period} ${monthName}`;
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
