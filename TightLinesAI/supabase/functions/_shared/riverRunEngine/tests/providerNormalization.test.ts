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
  resolveTemperatureTrendSignal,
  type RiverRunGaugeBaseline,
} from "../index.ts";

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
    source: "usgs_instantaneous_values",
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
      source: "usgs_instantaneous_values",
    },
    {
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-20T13:30:00.000Z",
      flow_cfs: 450,
      source: "usgs_instantaneous_values",
    },
    {
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-21T14:00:00.000Z",
      flow_cfs: 600,
      source: "usgs_instantaneous_values",
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
      source: "usgs_instantaneous_values",
    }],
    siteId: "04122500",
    primaryMetric: "flow_cfs",
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    maxAgeHours: 6,
  });

  assertEquals(read.flowTrend.rawSignal, "unknown");
  assert(read.flowTrend.reasonCodes.includes("flow_trend_unknown"));
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
    datedOvernightLows: [],
  });
  const missing = normalizeWeatherSnapshot({
    snapshot: {
      weather_available: true,
      fetched_at: "2026-09-21T19:00:00.000Z",
    },
    refreshAtUtc: "2026-09-21T20:00:00.000Z",
    localDate: "2026-09-21",
    datedOvernightLows: [],
  });

  assertEquals(dry.rainSignal.rawSignal, "dry");
  assertEquals(missing.rainSignal.rawSignal, "missing_rain_data");
  assertEquals(
    resolveRainSignal({ rain48hIn: null, rain72hIn: null }).rawSignal,
    "missing_rain_data",
  );
});

Deno.test("Air proxy trend uses overnight lows and fewer than 2 lows returns neutral_missing", () => {
  const cooling = normalizeWeatherSnapshot({
    snapshot: {
      weather_available: true,
      fetched_at: "2026-09-21T19:00:00.000Z",
    },
    refreshAtUtc: "2026-09-21T20:00:00.000Z",
    localDate: "2026-09-21",
    datedOvernightLows: [
      { localDate: "2026-09-18", lowF: 65 },
      { localDate: "2026-09-19", lowF: 62 },
      { localDate: "2026-09-20", lowF: 58 },
      { localDate: "2026-09-21", lowF: 56 },
    ],
  });
  const missing = normalizeWeatherSnapshot({
    snapshot: {
      weather_available: true,
      fetched_at: "2026-09-21T19:00:00.000Z",
    },
    refreshAtUtc: "2026-09-21T20:00:00.000Z",
    localDate: "2026-09-21",
    datedOvernightLows: [{ localDate: "2026-09-21", lowF: 56 }],
  });

  assertEquals(cooling.temperatureTrend.rawSignal, "strong_cooling");
  assert(
    cooling.temperatureTrend.reasonCodes.includes("temperature_air_proxy"),
  );
  assertEquals(
    resolveTemperatureTrendSignal({
      sourceType: "air_temp_proxy",
      delta72hF: -9,
      hasEnoughValues: true,
    }).rawSignal,
    "strong_cooling",
  );
  assertEquals(missing.temperatureTrend.rawSignal, "neutral_missing");
  assert(
    missing.temperatureTrend.reasonCodes.includes(
      "temperature_neutral_missing",
    ),
  );
});

Deno.test("Admin fishabilityBands override maps values to bands", () => {
  const bands = {
    metric: "flow_cfs" as const,
    tooLow: { max: 250 },
    lowFishable: { min: 250, max: 400 },
    ideal: { min: 500, max: 850 },
    highFishable: { min: 850, max: 1200 },
    blownOut: { min: 1400 },
  };

  assertEquals(resolveAdminOverrideBand(200, bands), "very_low");
  assertEquals(resolveAdminOverrideBand(300, bands), "low");
  assertEquals(resolveAdminOverrideBand(450, bands), "normal_fishable");
  assertEquals(resolveAdminOverrideBand(700, bands), "ideal");
  assertEquals(resolveAdminOverrideBand(1000, bands), "high_fishable");
  assertEquals(resolveAdminOverrideBand(1300, bands), "very_high");
  assertEquals(resolveAdminOverrideBand(1500, bands), "blown_out");
});

Deno.test("Percentile default baseline maps values to major bands", () => {
  const baseline: RiverRunGaugeBaseline = {
    riverId: "pere_marquette",
    metric: "flow_cfs",
    dayOfYear: 264,
    baselineVersion: "v1",
    percentiles: { p10: 100, p25: 250, p40: 400, p65: 650, p85: 850, p90: 900 },
    bandData: {},
    sampleCount: 40,
    distinctYears: 3,
    windowDays: 14,
  };

  assertEquals(
    resolveFlowBand({ metric: "flow_cfs", value: 90, baseline })?.band,
    "very_low",
  );
  assertEquals(
    resolveFlowBand({ metric: "flow_cfs", value: 150, baseline })?.band,
    "low",
  );
  assertEquals(
    resolveFlowBand({ metric: "flow_cfs", value: 300, baseline })?.band,
    "normal_fishable",
  );
  assertEquals(
    resolveFlowBand({ metric: "flow_cfs", value: 500, baseline })?.band,
    "ideal",
  );
  assertEquals(
    resolveFlowBand({ metric: "flow_cfs", value: 700, baseline })?.band,
    "high_fishable",
  );
  assertEquals(
    resolveFlowBand({ metric: "flow_cfs", value: 875, baseline })?.band,
    "very_high",
  );
  assertEquals(
    resolveFlowBand({ metric: "flow_cfs", value: 950, baseline })?.band,
    "blown_out",
  );
});

Deno.test("Condition input assembler preserves reason codes and missingNonGaugeInputCount", () => {
  const gauge = normalizeGaugeRead({
    observations: [{
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-21T14:00:00.000Z",
      flow_cfs: 600,
      source: "usgs_instantaneous_values",
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
    datedOvernightLows: [{ localDate: "2026-09-21", lowF: 56 }],
  });
  const inputs = assembleConditionInputs({
    river: PERE_MARQUETTE_RIVER_PROFILE,
    run: PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    localDate: "2026-09-21",
    gauge,
    weather,
    baselineRows: [{
      riverId: "pere_marquette",
      metric: "flow_cfs",
      dayOfYear: 264,
      baselineVersion: "v1",
      percentiles: {
        p10: 100,
        p25: 250,
        p40: 400,
        p65: 650,
        p85: 850,
        p90: 900,
      },
      bandData: {},
      sampleCount: 40,
      distinctYears: 3,
      windowDays: 14,
    }],
  });

  assert(inputs.rainReasonCodes.includes("rain_missing"));
  assert(inputs.flowReasonCodes.includes("flow_trend_unknown"));
  assert(inputs.temperatureReasonCodes.includes("temperature_neutral_missing"));
  assertEquals(inputs.missingNonGaugeInputCount, 2);
  assertEquals(inputs.flowBand, "ideal");
});

Deno.test("Condition input assembler selects matching local-date baseline row", () => {
  const gauge = normalizeGaugeRead({
    observations: [{
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-21T14:00:00.000Z",
      flow_cfs: 600,
      source: "usgs_instantaneous_values",
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
    datedOvernightLows: [],
  });
  const baseline = (dayOfYear: number, p65: number) => ({
    riverId: "pere_marquette",
    metric: "flow_cfs" as const,
    dayOfYear,
    baselineVersion: "v1",
    percentiles: { p10: 100, p25: 250, p40: 400, p65, p85: 850, p90: 900 },
    bandData: {},
    sampleCount: 40,
    distinctYears: 3,
    windowDays: 14,
  });
  const inputs = assembleConditionInputs({
    river: PERE_MARQUETTE_RIVER_PROFILE,
    run: PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    localDate: "2026-09-21",
    gauge,
    weather,
    baselineRows: [
      baseline(263, 700),
      baseline(264, 550),
      baseline(265, 700),
    ],
  });

  assertEquals(inputs.flowBand, "high_fishable");
});

Deno.test("Condition input assembler ignores same-metric same-day baseline from another river", () => {
  const gauge = normalizeGaugeRead({
    observations: [{
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-21T14:00:00.000Z",
      flow_cfs: 600,
      source: "usgs_instantaneous_values",
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
    datedOvernightLows: [],
  });
  const inputs = assembleConditionInputs({
    river: PERE_MARQUETTE_RIVER_PROFILE,
    run: PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    localDate: "2026-09-21",
    gauge,
    weather,
    baselineRows: [{
      riverId: "other_river",
      metric: "flow_cfs",
      dayOfYear: 264,
      baselineVersion: "v1",
      percentiles: {
        p10: 100,
        p25: 250,
        p40: 400,
        p65: 650,
        p85: 850,
        p90: 900,
      },
      bandData: {},
      sampleCount: 40,
      distinctYears: 3,
      windowDays: 14,
    }],
  });

  assertEquals(inputs.flowBand, undefined);
  assertEquals(inputs.sourceMetrics.gauge?.band, undefined);
});

Deno.test("Condition input assembler does not use another day baseline when matching day is missing", () => {
  const gauge = normalizeGaugeRead({
    observations: [{
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-21T14:00:00.000Z",
      flow_cfs: 600,
      source: "usgs_instantaneous_values",
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
    datedOvernightLows: [],
  });
  const inputs = assembleConditionInputs({
    river: PERE_MARQUETTE_RIVER_PROFILE,
    run: PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    localDate: "2026-09-21",
    gauge,
    weather,
    baselineRows: [{
      riverId: "pere_marquette",
      metric: "flow_cfs",
      dayOfYear: 263,
      baselineVersion: "v1",
      percentiles: {
        p10: 100,
        p25: 250,
        p40: 400,
        p65: 650,
        p85: 850,
        p90: 900,
      },
      bandData: {},
      sampleCount: 40,
      distinctYears: 3,
      windowDays: 14,
    }],
  });

  assertEquals(inputs.flowBand, undefined);
  assertEquals(inputs.sourceMetrics.gauge?.band, undefined);
});

Deno.test("Condition input assembler preserves unresolved flow band in source metrics", () => {
  const gauge = normalizeGaugeRead({
    observations: [{
      provider: "USGS",
      siteId: "04122500",
      observedAt: "2026-09-21T14:00:00.000Z",
      source: "usgs_instantaneous_values",
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
    datedOvernightLows: [],
  });
  const inputs = assembleConditionInputs({
    river: PERE_MARQUETTE_RIVER_PROFILE,
    run: PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    refreshAtUtc: "2026-09-21T15:00:00.000Z",
    localDate: "2026-09-21",
    gauge,
    weather,
    baselineRows: [],
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
    datedOvernightLows: [
      { localDate: "2026-09-20", lowF: 60 },
      { localDate: "2026-09-21", lowF: 56 },
    ],
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
    datedOvernightLows: [
      { localDate: "2026-09-20", lowF: 60 },
      { localDate: "2026-09-21", lowF: 56 },
    ],
  });

  assertEquals(withForecast.forecastDaily?.length, 1);
  assertEquals(withForecast.rainSignal, base.rainSignal);
  assertEquals(withForecast.temperatureTrend, base.temperatureTrend);
});
