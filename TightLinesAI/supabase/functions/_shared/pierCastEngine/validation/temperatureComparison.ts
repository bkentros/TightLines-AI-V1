import type { PierCastLmhofsSample } from "../providers/lmhofs.ts";

export type PierCastGlosObservation =
  | {
    status: "available";
    datasetId: string;
    observedAt: string;
    temperatureC: number;
    originalValue: number;
    originalUnit: "K" | "C";
    aggregateQualityFlag: 1;
  }
  | {
    status: "unavailable";
    datasetId: string;
    observedAt: string | null;
    temperatureC: null;
    reason:
      | "invalid_time"
      | "missing_value"
      | "quality_not_passed"
      | "temperature_out_of_range";
  };

export type PierCastTemperatureComparison = {
  modelSample: PierCastLmhofsSample;
  observation: Extract<PierCastGlosObservation, { status: "available" }>;
  offsetMinutes: number;
  errorC: number;
  absoluteErrorC: number;
};

export type PierCastTemperatureComparisonMetrics = {
  matchedCount: number;
  meanBiasC: number | null;
  meanAbsoluteErrorC: number | null;
  rootMeanSquareErrorC: number | null;
  maximumAbsoluteErrorC: number | null;
  meanObservationOffsetMinutes: number | null;
};

export function normalizePierCastGlosObservation(input: {
  datasetId: string;
  observedAt: string;
  value: number;
  unit: "K" | "C";
  aggregateQualityFlag: number | null;
}): PierCastGlosObservation {
  const observedDate = new Date(input.observedAt);
  if (!Number.isFinite(observedDate.getTime())) {
    return {
      status: "unavailable",
      datasetId: input.datasetId,
      observedAt: null,
      temperatureC: null,
      reason: "invalid_time",
    };
  }
  const observedAt = observedDate.toISOString();
  if (!Number.isFinite(input.value) || input.value <= -900) {
    return {
      status: "unavailable",
      datasetId: input.datasetId,
      observedAt,
      temperatureC: null,
      reason: "missing_value",
    };
  }
  if (input.aggregateQualityFlag !== 1) {
    return {
      status: "unavailable",
      datasetId: input.datasetId,
      observedAt,
      temperatureC: null,
      reason: "quality_not_passed",
    };
  }

  const temperatureC = input.unit === "K" ? input.value - 273.15 : input.value;
  if (
    !Number.isFinite(temperatureC) || temperatureC < -2 || temperatureC > 40
  ) {
    return {
      status: "unavailable",
      datasetId: input.datasetId,
      observedAt,
      temperatureC: null,
      reason: "temperature_out_of_range",
    };
  }
  return {
    status: "available",
    datasetId: input.datasetId,
    observedAt,
    temperatureC,
    originalValue: input.value,
    originalUnit: input.unit,
    aggregateQualityFlag: 1,
  };
}

export function pairPierCastTemperatureObservations(
  modelSamples: readonly PierCastLmhofsSample[],
  observations: readonly PierCastGlosObservation[],
  toleranceMinutes = 30,
): PierCastTemperatureComparison[] {
  if (!Number.isFinite(toleranceMinutes) || toleranceMinutes < 0) {
    throw new Error("Observation matching tolerance must be nonnegative.");
  }
  const candidates = observations
    .filter((observation): observation is Extract<
      PierCastGlosObservation,
      { status: "available" }
    > => observation.status === "available")
    .map((observation, index) => ({ observation, index }));
  const usedObservationIndices = new Set<number>();
  const comparisons: PierCastTemperatureComparison[] = [];

  for (
    const modelSample of [...modelSamples].sort((a, b) =>
      Date.parse(a.validAt) - Date.parse(b.validAt)
    )
  ) {
    const modelTime = Date.parse(modelSample.validAt);
    let best: (typeof candidates)[number] | null = null;
    let bestOffsetMs = Number.POSITIVE_INFINITY;
    for (const candidate of candidates) {
      if (usedObservationIndices.has(candidate.index)) continue;
      const offsetMs = Math.abs(
        Date.parse(candidate.observation.observedAt) - modelTime,
      );
      if (offsetMs < bestOffsetMs) {
        best = candidate;
        bestOffsetMs = offsetMs;
      }
    }
    if (!best || bestOffsetMs > toleranceMinutes * 60 * 1000) continue;

    usedObservationIndices.add(best.index);
    const errorC = modelSample.temperatureC - best.observation.temperatureC;
    comparisons.push({
      modelSample,
      observation: best.observation,
      offsetMinutes: bestOffsetMs / (60 * 1000),
      errorC,
      absoluteErrorC: Math.abs(errorC),
    });
  }
  return comparisons;
}

export function calculatePierCastTemperatureComparisonMetrics(
  comparisons: readonly PierCastTemperatureComparison[],
): PierCastTemperatureComparisonMetrics {
  if (comparisons.length === 0) {
    return {
      matchedCount: 0,
      meanBiasC: null,
      meanAbsoluteErrorC: null,
      rootMeanSquareErrorC: null,
      maximumAbsoluteErrorC: null,
      meanObservationOffsetMinutes: null,
    };
  }
  const count = comparisons.length;
  return {
    matchedCount: count,
    meanBiasC: roundMetric(
      comparisons.reduce((sum, comparison) => sum + comparison.errorC, 0) /
        count,
    ),
    meanAbsoluteErrorC: roundMetric(
      comparisons.reduce(
        (sum, comparison) => sum + comparison.absoluteErrorC,
        0,
      ) / count,
    ),
    rootMeanSquareErrorC: roundMetric(
      Math.sqrt(
        comparisons.reduce(
          (sum, comparison) => sum + comparison.errorC ** 2,
          0,
        ) / count,
      ),
    ),
    maximumAbsoluteErrorC: roundMetric(
      Math.max(...comparisons.map((comparison) => comparison.absoluteErrorC)),
    ),
    meanObservationOffsetMinutes: roundMetric(
      comparisons.reduce(
        (sum, comparison) => sum + comparison.offsetMinutes,
        0,
      ) / count,
    ),
  };
}

function roundMetric(value: number): number {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}
