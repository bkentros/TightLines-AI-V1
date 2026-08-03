import { assert, assertEquals } from "jsr:@std/assert";
import {
  assembleConditionInputs,
  computeGaugeFreshness,
  computeWeatherFreshness,
  type NormalizedGaugeObservation,
  normalizeGaugeRead,
  normalizeWeatherSnapshot,
  parseUsgsInstantaneousValues,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  resolveAdminOverrideBand,
  resolveFlowBand,
  resolveRainSignal,
} from "../index.ts";

function observation(
  observedAt: string,
  flowCfs: number,
): NormalizedGaugeObservation {
  return {
    provider: "USGS",
    siteId: "04122500",
    observedAt,
    flow_cfs: flowCfs,
    source: "usgs_continuous_values",
  };
}

function usgsPayload() {
  return {
    value: {
      timeSeries: [
        {
          variable: {
            variableCode: [{ value: "00060" }],
            variableName: "Discharge, cubic feet per second",
          },
          values: [{
            value: [
              { dateTime: "2026-09-20T10:00:00-04:00", value: "450" },
              { dateTime: "2026-09-21T10:00:00-04:00", value: "600" },
            ],
          }],
        },
        {
          variable: {
            variableCode: [{ value: "00065" }],
            variableName: "Gage height, feet",
          },
          values: [{
            value: [
              { dateTime: "2026-09-21T10:00:00-04:00", value: "4.25" },
            ],
          }],
        },
      ],
    },
  };
}

Deno.test("USGS parser maps discharge to flow_cfs and gauge height to gage_height_ft", () => {
  const observations = parseUsgsInstantaneousValues(usgsPayload(), "04122500");
  const latest = observations[observations.length - 1];

  assertEquals(latest.observedAt, "2026-09-21T14:00:00.000Z");
  assertEquals(latest.flow_cfs, 600);
  assertEquals(latest.gage_height_ft, 4.25);
});

Deno.test("Gauge freshness resolves fresh, stale, older_than_24h, and missing", () => {
  const observation: NormalizedGaugeObservation = {
    provider: "USGS",
    siteId: "04122500",
    observedAt: "2026-09-21T14:00:00.000Z",
    flow_cfs: 600,
    source: "usgs_continuous_values",
  };

  assertEquals(
    computeGaugeFreshness({
      observation,
      refreshAtUtc: "2026-09-21T18:00:00.000Z",
      maxAgeHours: 6,
    }),
    "fresh",
  );
  assertEquals(
    computeGaugeFreshness({
      observation,
      refreshAtUtc: "2026-09-22T02:00:00.000Z",
      maxAgeHours: 6,
    }),
    "stale",
  );
  assertEquals(
    computeGaugeFreshness({
      observation,
      refreshAtUtc: "2026-09-22T15:00:00.000Z",
      maxAgeHours: 6,
    }),
    "older_than_24h",
  );
  assertEquals(
    computeGaugeFreshness({
      observation: null,
      refreshAtUtc: "2026-09-22T15:00:00.000Z",
      maxAgeHours: 6,
    }),
    "missing",
  );
});

Deno.test("24h trend uses closest observation at or before 24h prior", () => {
  const observations: NormalizedGaugeObservation[] = [
    {
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-20T13:00:00.000Z",
      flow_cfs: 400,
      source: "usgs_continuous_values",
    },
    {
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-20T13:30:00.000Z",
      flow_cfs: 450,
      source: "usgs_continuous_values",
    },
    {
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-21T14:00:00.000Z",
      flow_cfs: 600,
      source: "usgs_continuous_values",
    },
  ];

  const read = normalizeGaugeRead({
    observations,
    siteId: "04122500",
    primaryMetric: "flow_cfs",
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    maxAgeHours: 6,
  });

  assertEquals(read.prior24h?.observedAt, "2026-09-20T13:30:00.000Z");
  assertEquals(read.flowTrend.rawSignal, "meaningful_rise");
});

Deno.test("missing 24h prior trend becomes unknown with reason code", () => {
  const read = normalizeGaugeRead({
    observations: [{
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-21T14:00:00.000Z",
      flow_cfs: 600,
      source: "usgs_continuous_values",
    }],
    siteId: "04122500",
    primaryMetric: "flow_cfs",
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    maxAgeHours: 6,
  });

  assertEquals(read.flowTrend.rawSignal, "unknown");
  assert(read.flowTrend.reasonCodes.includes("flow_trend_unknown"));
});

Deno.test("an observation far outside the 24h tolerance is not treated as a 24h comparison", () => {
  const read = normalizeGaugeRead({
    observations: [
      observation("2026-09-18T12:00:00.000Z", 500),
      observation("2026-09-20T20:00:00.000Z", 700),
    ],
    siteId: "04122500",
    primaryMetric: "flow_cfs",
    refreshAtUtc: "2026-09-20T20:10:00.000Z",
    maxAgeHours: 6,
    comparisonToleranceHours: 3,
  });
  assertEquals(read.prior24h, null);
  assertEquals(read.flowTrend.rawSignal, "unknown");
});

Deno.test("Weather freshness resolves fresh, stale, and missing", () => {
  assertEquals(
    computeWeatherFreshness({
      observedAt: "2026-09-21T12:00:00.000Z",
      refreshAtUtc: "2026-09-21T20:00:00.000Z",
      weatherAvailable: true,
    }),
    "fresh",
  );
  assertEquals(
    computeWeatherFreshness({
      observedAt: "2026-09-21T06:00:00.000Z",
      refreshAtUtc: "2026-09-21T20:00:00.000Z",
      weatherAvailable: true,
    }),
    "stale",
  );
  assertEquals(
    computeWeatherFreshness({
      observedAt: "2026-09-20T18:00:00.000Z",
      refreshAtUtc: "2026-09-21T20:00:00.000Z",
      weatherAvailable: true,
    }),
    "missing",
  );
  assertEquals(
    computeWeatherFreshness({
      observedAt: "2026-09-21T12:00:00.000Z",
      refreshAtUtc: "2026-09-21T20:00:00.000Z",
    }),
    "fresh",
  );
  assertEquals(
    computeWeatherFreshness({
      observedAt: "2026-09-21T12:00:00.000Z",
      refreshAtUtc: "2026-09-21T20:00:00.000Z",
      weatherAvailable: false,
    }),
    "missing",
  );
});

Deno.test("Rain totals distinguish observed dry from missing rain", () => {
  const dry = normalizeWeatherSnapshot({
    snapshot: {
      weather_available: true,
      fetched_at: "2026-09-21T19:00:00.000Z",
      hourly_precipitation_in: Array.from({ length: 72 }, (_, index) => ({
        time_utc: new Date(
          Date.parse("2026-09-18T21:00:00.000Z") + index * 3600_000,
        )
          .toISOString(),
        value: 0,
      })),
    },
    refreshAtUtc: "2026-09-21T20:00:00.000Z",
    localDate: "2026-09-21",
  });
  const missing = normalizeWeatherSnapshot({
    snapshot: {
      weather_available: true,
      fetched_at: "2026-09-21T19:00:00.000Z",
    },
    refreshAtUtc: "2026-09-21T20:00:00.000Z",
    localDate: "2026-09-21",
  });

  assertEquals(dry.rainSignal.rawSignal, "dry");
  assertEquals(missing.rainSignal.rawSignal, "missing_rain_data");
  assertEquals(
    resolveRainSignal({ rain48hIn: null, rain72hIn: null }).rawSignal,
    "missing_rain_data",
  );
});

Deno.test("Admin fishabilityBands override maps values to bands", () => {
  const bands = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands;

  assertEquals(resolveAdminOverrideBand(399.9, bands), "very_low");
  assertEquals(resolveAdminOverrideBand(400, bands), "low");
  assertEquals(resolveAdminOverrideBand(400.1, bands), "low");
  assertEquals(resolveAdminOverrideBand(480, bands), "low");
  assertEquals(resolveAdminOverrideBand(499.9, bands), "low");
  assertEquals(resolveAdminOverrideBand(500, bands), "normal_fishable");
  assertEquals(resolveAdminOverrideBand(500.1, bands), "normal_fishable");
  assertEquals(resolveAdminOverrideBand(524.9, bands), "normal_fishable");
  assertEquals(resolveAdminOverrideBand(525, bands), "ideal");
  assertEquals(resolveAdminOverrideBand(525.1, bands), "ideal");
  assertEquals(resolveAdminOverrideBand(749.9, bands), "ideal");
  assertEquals(resolveAdminOverrideBand(750, bands), "ideal");
  assertEquals(resolveAdminOverrideBand(750.1, bands), "high_fishable");
  assertEquals(resolveAdminOverrideBand(999.9, bands), "high_fishable");
  assertEquals(resolveAdminOverrideBand(1_000, bands), "high_fishable");
  assertEquals(resolveAdminOverrideBand(1_000.1, bands), "very_high");
  assertEquals(resolveAdminOverrideBand(1_599.9, bands), "very_high");
  assertEquals(resolveAdminOverrideBand(1_600, bands), "blown_out");
  assertEquals(resolveAdminOverrideBand(1_600.1, bands), "blown_out");
});

Deno.test("Fishability bands fail closed without matching audited absolute rules", () => {
  assertEquals(resolveFlowBand({ metric: "flow_cfs", value: 600 }), null);
  assertEquals(
    resolveFlowBand({
      metric: "gage_height_ft",
      value: 600,
      fishabilityBands:
        PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands,
    }),
    null,
  );
});

Deno.test("Condition input assembler preserves reason codes and missingNonGaugeInputCount", () => {
  const gauge = normalizeGaugeRead({
    observations: [{
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-21T14:00:00.000Z",
      flow_cfs: 600,
      source: "usgs_continuous_values",
    }],
    siteId: "04122500",
    primaryMetric: "flow_cfs",
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    maxAgeHours: 6,
  });
  const weather = normalizeWeatherSnapshot({
    snapshot: {
      weather_available: true,
      fetched_at: "2026-09-21T14:30:00.000Z",
    },
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    localDate: "2026-09-21",
  });
  const inputs = assembleConditionInputs({
    river: PERE_MARQUETTE_RIVER_PROFILE,
    run: PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    localDate: "2026-09-21",
    gauge,
    weather,
  });

  assert(inputs.rainReasonCodes.includes("rain_missing"));
  assert(inputs.flowReasonCodes.includes("flow_trend_unknown"));
  assert(inputs.temperatureReasonCodes.includes("temperature_neutral_missing"));
  assertEquals(inputs.missingNonGaugeInputCount, 2);
  assertEquals(inputs.flowBand, "ideal");
  assertEquals(inputs.sourceMetrics.weather?.provider, "OPEN_METEO");
  assertEquals(inputs.sourceMetrics.weather?.evidenceType, "modeled_grid");
  assertEquals(
    inputs.sourceMetrics.weather?.weatherPointId,
    "pm_baldwin_watershed_weather",
  );
});

Deno.test("Condition input assembler uses audited absolute bands", () => {
  const gauge = normalizeGaugeRead({
    observations: [{
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-21T14:00:00.000Z",
      flow_cfs: 600,
      source: "usgs_continuous_values",
    }],
    siteId: "04122500",
    primaryMetric: "flow_cfs",
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    maxAgeHours: 6,
  });
  const weather = normalizeWeatherSnapshot({
    snapshot: { fetched_at: "2026-09-21T14:30:00.000Z" },
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    localDate: "2026-09-21",
  });
  const inputs = assembleConditionInputs({
    river: PERE_MARQUETTE_RIVER_PROFILE,
    run: PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    localDate: "2026-09-21",
    gauge,
    weather,
  });

  assertEquals(inputs.flowBand, "ideal");
});

Deno.test("Condition input assembler preserves unresolved flow band in source metrics", () => {
  const gauge = normalizeGaugeRead({
    observations: [{
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-21T14:00:00.000Z",
      source: "usgs_continuous_values",
    }],
    siteId: "04122500",
    primaryMetric: "flow_cfs",
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    maxAgeHours: 6,
  });
  const weather = normalizeWeatherSnapshot({
    snapshot: {
      fetched_at: "2026-09-21T14:30:00.000Z",
      hourly_precipitation_in: [],
    },
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    localDate: "2026-09-21",
  });
  const inputs = assembleConditionInputs({
    river: PERE_MARQUETTE_RIVER_PROFILE,
    run: PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    localDate: "2026-09-21",
    gauge,
    weather,
  });

  assertEquals(inputs.flowBand, undefined);
  assertEquals(inputs.sourceMetrics.gauge?.band, undefined);
});

Deno.test("Forecast data does not affect scoring inputs", () => {
  const base = normalizeWeatherSnapshot({
    snapshot: {
      weather_available: true,
      fetched_at: "2026-09-21T19:00:00.000Z",
      hourly_precipitation_in: [],
    },
    refreshAtUtc: "2026-09-21T20:00:00.000Z",
    localDate: "2026-09-21",
  });
  const withForecast = normalizeWeatherSnapshot({
    snapshot: {
      weather_available: true,
      fetched_at: "2026-09-21T19:00:00.000Z",
      hourly_precipitation_in: [],
      forecast_daily: [{ date: "2026-09-22", precip_chance_pct: 100 }],
    },
    refreshAtUtc: "2026-09-21T20:00:00.000Z",
    localDate: "2026-09-21",
  });

  assertEquals(withForecast.forecastDaily?.length, 1);
  assertEquals(withForecast.rainSignal, base.rainSignal);
});
