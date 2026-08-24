import { assert, assertEquals } from "jsr:@std/assert";
import {
  BETSIE_RIVER_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  buildRiverLiveConditions,
  type NormalizedGaugeObservation,
  type NormalizedWaterTemperatureObservation,
  type RiverLiveSeasonalContext,
  type SupabaseLikeClient,
} from "../index.ts";

const seasonalContext: RiverLiveSeasonalContext = {
  average: 1000,
  p10: 800,
  p25: 900,
  median: 1000,
  p75: 1100,
  p90: 1200,
  historicalYears: 29,
  sampleCount: 203,
  availableWindowDays: 7,
  windowRadiusDays: 3,
  windowStartMonthDay: "08-21",
  windowEndMonthDay: "08-27",
  recordKind: "long_term",
  baselineVersion: "test-baseline",
  source: "usgs_statistics",
};

Deno.test("river live conditions expose all accepted metrics, averages, and bounded 24-hour trends", async () => {
  const conditions = await buildRiverLiveConditions({
    client: {} as SupabaseLikeClient,
    river: BIG_MANISTEE_RIVER_PROFILE,
    localDate: "2026-08-24",
    refreshSlot: "08:00",
    refreshAtUtc: "2026-08-24T12:00:00Z",
    fetchFn: () => {
      throw new Error("provider should not be called");
    },
    gaugeObservations: gaugeObservations(),
    waterTemperatureObservationsBySource: {
      big_manistee_wellston_temperature: temperatureObservations(),
    },
    seasonalContextsByMetric: {
      flow_cfs: seasonalContext,
      gage_height_ft: null,
      water_temp_f: {
        ...seasonalContext,
        average: 58,
        p10: 50,
        p25: 54,
        median: 58,
        p75: 62,
        p90: 65,
      },
    },
  });

  assertEquals(conditions.status, "available");
  assertEquals(conditions.metrics.length, 3);
  const flow = conditions.metrics.find((metric) =>
    metric.metric === "flow_cfs"
  );
  const height = conditions.metrics.find((metric) =>
    metric.metric === "gage_height_ft"
  );
  const temperature = conditions.metrics.find((metric) =>
    metric.metric === "water_temp_f"
  );
  assert(flow && height && temperature);
  assertEquals(flow.value, 1250);
  assertEquals(flow.trend24h.delta, 250);
  assertEquals(flow.trend24h.percentDelta, 25);
  assertEquals(flow.seasonalContext?.comparisonLabel, "Much above normal");
  assertEquals(height.value, 5.2);
  assertEquals(height.trend24h.delta, .2);
  assertEquals(height.seasonalContext, undefined);
  assertEquals(temperature.value, 64);
  assertEquals(temperature.trend24h.delta, 5);
  assertEquals(temperature.trend24h.direction, "warming");
  assertEquals(
    temperature.seasonalContext?.comparisonLabel,
    "Warmer than average",
  );
  assertEquals(temperature.stationName.includes("Wellston"), true);
});

Deno.test("river live conditions suppress readings older than 24 hours", async () => {
  const conditions = await buildRiverLiveConditions({
    client: {} as SupabaseLikeClient,
    river: BIG_MANISTEE_RIVER_PROFILE,
    localDate: "2026-08-27",
    refreshSlot: "08:00",
    refreshAtUtc: "2026-08-27T12:00:00Z",
    fetchFn: () => {
      throw new Error("provider should not be called");
    },
    gaugeObservations: gaugeObservations(),
    waterTemperatureObservationsBySource: {
      big_manistee_wellston_temperature: temperatureObservations(),
    },
    seasonalContextsByMetric: {
      flow_cfs: seasonalContext,
      gage_height_ft: null,
      water_temp_f: seasonalContext,
    },
  });
  assertEquals(conditions.status, "unavailable");
  assert(conditions.metrics.every((metric) => metric.value == null));
  assert(
    conditions.metrics.every((metric) => metric.freshness === "older_than_24h"),
  );
});

Deno.test("a river without accepted sensors returns an honest empty state", async () => {
  const conditions = await buildRiverLiveConditions({
    client: {} as SupabaseLikeClient,
    river: BETSIE_RIVER_PROFILE,
    localDate: "2026-08-24",
    refreshSlot: "08:00",
    refreshAtUtc: "2026-08-24T12:00:00Z",
    fetchFn: () => {
      throw new Error("provider should not be called");
    },
  });
  assertEquals(conditions.status, "unavailable");
  assertEquals(conditions.metrics, []);
  assert(conditions.limitation.includes("No sufficiently accurate"));
});

function gaugeObservations(): NormalizedGaugeObservation[] {
  return [
    {
      provider: "USGS",
      siteId: "04125550",
      observedAt: "2026-08-23T11:00:00Z",
      flow_cfs: 1000,
      gage_height_ft: 5,
      approvalStatus: "Provisional",
      source: "usgs_continuous_values",
    },
    {
      provider: "USGS",
      siteId: "04125550",
      observedAt: "2026-08-24T11:00:00Z",
      flow_cfs: 1250,
      gage_height_ft: 5.2,
      approvalStatus: "Provisional",
      source: "usgs_continuous_values",
    },
  ];
}

function temperatureObservations(): NormalizedWaterTemperatureObservation[] {
  return [
    temperatureObservation("2026-08-21T11:00:00Z", 55),
    temperatureObservation("2026-08-23T09:00:00Z", 58),
    temperatureObservation("2026-08-23T11:00:00Z", 60),
    temperatureObservation("2026-08-24T11:00:00Z", 64),
  ];
}

function temperatureObservation(
  observedAt: string,
  waterTempF: number,
): NormalizedWaterTemperatureObservation {
  return {
    sourceId: "big_manistee_wellston_temperature",
    provider: "USGS",
    siteId: "04125550",
    observedAt,
    waterTempF,
    approvalStatus: "Provisional",
    source: "usgs_continuous_values",
  };
}
