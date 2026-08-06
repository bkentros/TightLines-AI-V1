import type { RiverMetric, RiverRunProfile } from "../types.ts";
import type {
  ConditionsSuggestHistoricalSample,
  RiverRunConditionsSuggestBaseline,
} from "../storage/types.ts";
import type { ConditionsSuggestCheckpointId } from "../metrics/conditionsCheckpoints.ts";
import {
  inversePercentileRank,
  percentileRank,
  resolveConditionsCandidateLabel,
  resolveConditionsCheckpointTimingLabel,
  summarizeConditionsPeriod,
} from "../scoring/conditionsSuggest.ts";
import { canonicalBaselineDay } from "./baselineCalendar.ts";
import { addDays, compareLocalDates } from "../metrics/dateWindow.ts";
import type { NormalizedBaselineObservation } from "./baselineGeneration.ts";

export type NormalizedTemperatureBaselineObservation = {
  sourceId: string;
  localDate: string;
  waterTempF: number | null;
};

export type ConditionsSuggestBaselineCheckpointDefinition = {
  checkpointId: ConditionsSuggestCheckpointId;
  observationStartMonthDay: string;
  checkpointMonthDay: string;
};

export type ConditionsSuggestHistoricalReplaySummary = {
  sampleCount: number;
  distinctYears: number;
  candidateCounts: Record<"Ahead" | "Typical" | "Delayed", number>;
  finalLabelCounts: Record<"Ahead" | "Typical" | "Delayed", number>;
  reversalTemperedCount: number;
  mixedSignalCount: number;
  candidateAgreementViolationCount: number;
};

export function generateConditionsSuggestBaselineRows(input: {
  gaugeObservations: NormalizedBaselineObservation[];
  temperatureObservations: NormalizedTemperatureBaselineObservation[];
  riverId: string;
  runId: string;
  gaugeMetric: RiverMetric;
  gaugeSiteId: string;
  temperatureSourceId: string;
  baselineVersion: string;
  checkpoints: ConditionsSuggestBaselineCheckpointDefinition[];
  minimumCoveragePercent?: number;
  minimumUsableYears?: number;
  coolEnoughPercentileCap?: number;
  tooWarmF?: number;
  gaugeWeight?: number;
  waterTemperatureWeight?: number;
  sourceNotes?: string | null;
}): RiverRunConditionsSuggestBaseline[] {
  const minimumCoveragePercent = input.minimumCoveragePercent ?? 0.8;
  const minimumUsableYears = input.minimumUsableYears ?? 5;
  const coolEnoughPercentileCap = input.coolEnoughPercentileCap ?? 75;
  const gaugeWeight = input.gaugeWeight ?? 0.6;
  const waterTemperatureWeight = input.waterTemperatureWeight ?? 0.4;
  const gaugeByDate = collapseGaugeValues(input.gaugeObservations, input);
  const temperatureByDate = collapseTemperatureValues(
    input.temperatureObservations,
    input.temperatureSourceId,
  );
  const years = [
    ...new Set(
      [...temperatureByDate.keys()].map((date) => Number(date.slice(0, 4))),
    ),
  ].filter(Number.isInteger).toSorted((a, b) => a - b);
  const rows: RiverRunConditionsSuggestBaseline[] = [];

  for (const checkpoint of input.checkpoints) {
    const checkpointTemplateDate = dateForCheckpointYear(
      2001,
      checkpoint.checkpointMonthDay,
    );
    const observationStartTemplateDate = dateForObservationStart(
      2001,
      checkpoint.observationStartMonthDay,
      checkpoint.checkpointMonthDay,
    );
    const expectedDays = datesBetween(
      observationStartTemplateDate,
      addDays(checkpointTemplateDate, -1),
    ).length;
    const minimumUsableDays = Math.ceil(
      expectedDays * minimumCoveragePercent,
    );
    const rawSamples = years.flatMap((year) => {
      const checkpointDate = dateForCheckpointYear(
        year,
        checkpoint.checkpointMonthDay,
      );
      const observationStartDate = dateForObservationStart(
        year,
        checkpoint.observationStartMonthDay,
        checkpoint.checkpointMonthDay,
      );
      const values = datesBetween(
        observationStartDate,
        addDays(checkpointDate, -1),
      ).flatMap((localDate) => {
        const gaugeValue = gaugeByDate.get(localDate);
        const waterTempF = temperatureByDate.get(localDate);
        return gaugeValue != null && waterTempF != null
          ? [{ localDate, gaugeValue, waterTempF }]
          : [];
      });
      const summary = summarizeConditionsPeriod(values);
      if (
        !summary ||
        summary.usableDays < minimumUsableDays ||
        summary.transitionCount < 4
      ) {
        return [];
      }
      return [{ year, ...summary }];
    });
    if (rawSamples.length < minimumUsableYears) continue;

    const componentSamples = {
      gaugeAbsoluteRise: rawSamples.map((sample) => sample.gaugeAbsoluteRise),
      gaugeRelativeRisePct: rawSamples.map((sample) =>
        sample.gaugeRelativeRisePct
      ),
      meanWaterTempF: rawSamples.map((sample) => sample.meanWaterTempF),
      waterCoolingF: rawSamples.map((sample) => sample.waterCoolingF),
    };
    const historicalSamples: ConditionsSuggestHistoricalSample[] = rawSamples
      .map((sample) => {
        const gaugeResponsePercentile = Math.min(
          percentileRank(
            sample.gaugeAbsoluteRise,
            componentSamples.gaugeAbsoluteRise,
          ),
          percentileRank(
            sample.gaugeRelativeRisePct,
            componentSamples.gaugeRelativeRisePct,
          ),
        );
        let waterTemperaturePercentile = round1(
          (
            Math.min(
              inversePercentileRank(
                sample.meanWaterTempF,
                componentSamples.meanWaterTempF,
              ),
              coolEnoughPercentileCap,
            ) +
            percentileRank(
              sample.waterCoolingF,
              componentSamples.waterCoolingF,
            )
          ) / 2,
        );
        if (
          typeof input.tooWarmF === "number" &&
          sample.meanWaterTempF > input.tooWarmF
        ) {
          waterTemperaturePercentile = Math.min(
            waterTemperaturePercentile,
            49,
          );
        }
        return {
          year: sample.year,
          usableDays: sample.usableDays,
          gaugeAbsoluteRise: sample.gaugeAbsoluteRise,
          gaugeRelativeRisePct: sample.gaugeRelativeRisePct,
          meanWaterTempF: sample.meanWaterTempF,
          waterCoolingF: sample.waterCoolingF,
          gaugeResponsePercentile,
          waterTemperaturePercentile,
          evidenceIndex: round1(
            gaugeResponsePercentile * gaugeWeight +
              waterTemperaturePercentile * waterTemperatureWeight,
          ),
        };
      });
    const indices = historicalSamples.map((sample) => sample.evidenceIndex);
    rows.push({
      riverId: input.riverId,
      runId: input.runId,
      checkpointId: checkpoint.checkpointId,
      referenceDayOfYear: canonicalBaselineDay(checkpointTemplateDate),
      observationStartDayOfYear: canonicalBaselineDay(
        observationStartTemplateDate,
      ),
      baselineVersion: input.baselineVersion,
      gaugeMetric: input.gaugeMetric,
      gaugeSiteId: input.gaugeSiteId,
      temperatureSourceId: input.temperatureSourceId,
      componentSamples,
      historicalSamples,
      indexPercentiles: {
        p10: percentile(indices, 0.1),
        p25: percentile(indices, 0.25),
        p75: percentile(indices, 0.75),
        p90: percentile(indices, 0.9),
      },
      distinctYears: new Set(historicalSamples.map((sample) => sample.year))
        .size,
      expectedDays,
      minimumUsableDays,
      sourceNotes: input.sourceNotes ?? null,
    });
  }
  return rows.toSorted((a, b) => a.referenceDayOfYear - b.referenceDayOfYear);
}

export function summarizeConditionsSuggestHistoricalReplay(input: {
  rows: RiverRunConditionsSuggestBaseline[];
  run: Pick<RiverRunProfile, "conditionsSuggest"> & {
    conditionsSuggest: NonNullable<RiverRunProfile["conditionsSuggest"]>;
  };
}): ConditionsSuggestHistoricalReplaySummary {
  const candidateCounts = labelCounts();
  const finalLabelCounts = labelCounts();
  const stateByYear = new Map<number, "Ahead" | "Typical" | "Delayed">();
  let sampleCount = 0;
  let reversalTemperedCount = 0;
  let mixedSignalCount = 0;
  let candidateAgreementViolationCount = 0;

  for (
    const row of input.rows.toSorted((a, b) =>
      a.referenceDayOfYear - b.referenceDayOfYear
    )
  ) {
    const indices = row.historicalSamples.map((sample) => sample.evidenceIndex);
    for (const sample of row.historicalSamples) {
      const currentPercentile = percentileRank(sample.evidenceIndex, indices);
      const signalsStronglyMixed = (sample.gaugeResponsePercentile >=
          input.run.conditionsSuggest.aheadPercentile &&
        sample.waterTemperaturePercentile <=
          input.run.conditionsSuggest.delayedPercentile) ||
        (sample.gaugeResponsePercentile <=
            input.run.conditionsSuggest.delayedPercentile &&
          sample.waterTemperaturePercentile >=
            input.run.conditionsSuggest.aheadPercentile);
      const candidateLabel = resolveConditionsCandidateLabel({
        currentPercentile,
        gaugeResponsePercentile: sample.gaugeResponsePercentile,
        waterTemperaturePercentile: sample.waterTemperaturePercentile,
        signalsStronglyMixed,
        delayedPercentile: input.run.conditionsSuggest.delayedPercentile,
        aheadPercentile: input.run.conditionsSuggest.aheadPercentile,
      });
      const resolution = resolveConditionsCheckpointTimingLabel(
        stateByYear.get(sample.year) ?? null,
        candidateLabel,
      );
      candidateCounts[candidateLabel]++;
      finalLabelCounts[resolution.label]++;
      sampleCount++;
      if (signalsStronglyMixed) mixedSignalCount++;
      if (resolution.reversalTempered) reversalTemperedCount++;
      if (
        (candidateLabel === "Ahead" &&
          (sample.gaugeResponsePercentile < 50 ||
            sample.waterTemperaturePercentile < 50)) ||
        (candidateLabel === "Delayed" &&
          (sample.gaugeResponsePercentile > 50 ||
            sample.waterTemperaturePercentile > 50))
      ) {
        candidateAgreementViolationCount++;
      }
      stateByYear.set(sample.year, resolution.label);
    }
  }

  return {
    sampleCount,
    distinctYears: stateByYear.size,
    candidateCounts,
    finalLabelCounts,
    reversalTemperedCount,
    mixedSignalCount,
    candidateAgreementViolationCount,
  };
}

function collapseGaugeValues(
  observations: NormalizedBaselineObservation[],
  input: { riverId: string; gaugeMetric: RiverMetric },
): Map<string, number> {
  const grouped = new Map<string, number[]>();
  for (const observation of observations) {
    if (
      observation.riverId !== input.riverId ||
      observation.metric !== input.gaugeMetric ||
      typeof observation.value !== "number" ||
      !Number.isFinite(observation.value) ||
      observation.value <= 0
    ) {
      continue;
    }
    grouped.set(observation.localDate, [
      ...(grouped.get(observation.localDate) ?? []),
      observation.value,
    ]);
  }
  return new Map(
    [...grouped.entries()].map(([date, values]) => [date, median(values)]),
  );
}

function collapseTemperatureValues(
  observations: NormalizedTemperatureBaselineObservation[],
  sourceId: string,
): Map<string, number> {
  const grouped = new Map<string, number[]>();
  for (const observation of observations) {
    if (
      observation.sourceId !== sourceId ||
      typeof observation.waterTempF !== "number" ||
      !Number.isFinite(observation.waterTempF)
    ) {
      continue;
    }
    grouped.set(observation.localDate, [
      ...(grouped.get(observation.localDate) ?? []),
      observation.waterTempF,
    ]);
  }
  return new Map(
    [...grouped.entries()].map(([date, values]) => [date, median(values)]),
  );
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

function dateForCheckpointYear(year: number, monthDay: string): string {
  return `${year}-${monthDay}`;
}

function dateForObservationStart(
  checkpointYear: number,
  observationStartMonthDay: string,
  checkpointMonthDay: string,
): string {
  const observationYear = observationStartMonthDay > checkpointMonthDay
    ? checkpointYear - 1
    : checkpointYear;
  return `${observationYear}-${observationStartMonthDay}`;
}

function percentile(values: number[], p: number): number {
  const sorted = values.filter(Number.isFinite).toSorted((a, b) => a - b);
  if (sorted.length === 0) return NaN;
  if (sorted.length === 1) return sorted[0];
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  const weight = index - lower;
  return round1(
    sorted[lower] + (sorted[upper] - sorted[lower]) * weight,
  );
}

function median(values: number[]): number {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function labelCounts(): Record<"Ahead" | "Typical" | "Delayed", number> {
  return {
    Ahead: 0,
    Typical: 0,
    Delayed: 0,
  };
}
