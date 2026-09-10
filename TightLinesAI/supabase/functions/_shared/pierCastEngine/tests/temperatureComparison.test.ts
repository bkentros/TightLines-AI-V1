import { assertAlmostEquals, assertEquals } from "jsr:@std/assert";
import {
  calculatePierCastTemperatureComparisonMetrics,
  normalizePierCastGlosObservation,
  pairPierCastTemperatureObservations,
  type PierCastLmhofsSample,
} from "../index.ts";

function modelSample(
  validAt: string,
  temperatureC: number,
): PierCastLmhofsSample {
  return {
    cityId: "grand_haven_mi",
    sourceId: "grand_haven_test",
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    issuedAt: "2026-09-09T18:00:00.000Z",
    forecastHour: 1,
    validAt,
    temperatureC,
    rawUnit: "C",
    verticalSelection: "surface",
    depthIndex: 0,
    gridRow: 146,
    gridColumn: 180,
    latitude: 43.06,
    longitude: -86.26,
    sourceUrl: "https://example.test/lmhofs",
  };
}

Deno.test("GLOS normalization converts Kelvin only after a passing QA flag", () => {
  const valid = normalizePierCastGlosObservation({
    datasetId: "obs_671",
    observedAt: "2026-09-08T23:56:00Z",
    value: 295.1,
    unit: "K",
    aggregateQualityFlag: 1,
  });
  assertEquals(valid.status, "available");
  if (valid.status === "available") {
    assertAlmostEquals(valid.temperatureC, 21.95, 1e-9);
  }

  assertEquals(
    normalizePierCastGlosObservation({
      datasetId: "obs_637",
      observedAt: "2025-09-22T14:00:00Z",
      value: Number.NaN,
      unit: "K",
      aggregateQualityFlag: 9,
    }).status,
    "unavailable",
  );
  assertEquals(
    normalizePierCastGlosObservation({
      datasetId: "obs_709",
      observedAt: "2026-09-08T23:55:00Z",
      value: 293.59,
      unit: "K",
      aggregateQualityFlag: 2,
    }),
    {
      status: "unavailable",
      datasetId: "obs_709",
      observedAt: "2026-09-08T23:55:00.000Z",
      temperatureC: null,
      reason: "quality_not_passed",
    },
  );
});

Deno.test("comparison pairs nearest passing observations once and reports error", () => {
  const models = [
    modelSample("2026-09-09T18:00:00Z", 20),
    modelSample("2026-09-09T19:00:00Z", 21),
    modelSample("2026-09-09T20:00:00Z", 22),
  ];
  const observations = [
    normalizePierCastGlosObservation({
      datasetId: "obs_671",
      observedAt: "2026-09-09T18:05:00Z",
      value: 292.15,
      unit: "K",
      aggregateQualityFlag: 1,
    }),
    normalizePierCastGlosObservation({
      datasetId: "obs_671",
      observedAt: "2026-09-09T18:55:00Z",
      value: 295.15,
      unit: "K",
      aggregateQualityFlag: 1,
    }),
    normalizePierCastGlosObservation({
      datasetId: "obs_671",
      observedAt: "2026-09-09T21:00:00Z",
      value: 295.15,
      unit: "K",
      aggregateQualityFlag: 1,
    }),
  ];
  const comparisons = pairPierCastTemperatureObservations(
    models,
    observations,
    30,
  );

  assertEquals(comparisons.length, 2);
  assertAlmostEquals(comparisons[0].errorC, 1, 1e-9);
  assertAlmostEquals(comparisons[1].errorC, -1, 1e-9);
  assertEquals(calculatePierCastTemperatureComparisonMetrics(comparisons), {
    matchedCount: 2,
    meanBiasC: 0,
    meanAbsoluteErrorC: 1,
    rootMeanSquareErrorC: 1,
    maximumAbsoluteErrorC: 1,
    meanObservationOffsetMinutes: 5,
  });
});

Deno.test("comparison metrics fail closed to null without matches", () => {
  assertEquals(calculatePierCastTemperatureComparisonMetrics([]), {
    matchedCount: 0,
    meanBiasC: null,
    meanAbsoluteErrorC: null,
    rootMeanSquareErrorC: null,
    maximumAbsoluteErrorC: null,
    meanObservationOffsetMinutes: null,
  });
});
