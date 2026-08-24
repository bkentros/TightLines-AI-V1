import { assert, assertEquals } from "jsr:@std/assert";
import {
  buildMeasuredTemperatureSeasonalContext,
  buildUsgsSeasonalContext,
  seasonalWindowMonthDays,
  withSeasonalComparison,
} from "../index.ts";

Deno.test("seasonal window always includes the selected date plus or minus three days", () => {
  assertEquals(seasonalWindowMonthDays("2026-08-24"), [
    "08-21",
    "08-22",
    "08-23",
    "08-24",
    "08-25",
    "08-26",
    "08-27",
  ]);
  assertEquals(seasonalWindowMonthDays("2026-01-01"), [
    "12-29",
    "12-30",
    "12-31",
    "01-01",
    "01-02",
    "01-03",
    "01-04",
  ]);
});

Deno.test("USGS seasonal context weights approved day-of-year means across all seven days", () => {
  const monthDays = seasonalWindowMonthDays("2026-08-24");
  const context = buildUsgsSeasonalContext({
    metric: "flow_cfs",
    monthDays,
    payloads: [statisticsPayload(monthDays, 1000, 29)],
  });
  assert(context);
  assertEquals(context.availableWindowDays, 7);
  assertEquals(context.historicalYears, 29);
  assertEquals(context.average, 1030);
  assertEquals(context.p25, 930);
  assertEquals(context.p75, 1130);
  assertEquals(context.recordKind, "long_term");
});

Deno.test("USGS seasonal context skips missing dates but requires at least three window days", () => {
  const monthDays = seasonalWindowMonthDays("2026-08-24");
  assert(
    buildUsgsSeasonalContext({
      metric: "flow_cfs",
      monthDays,
      payloads: [statisticsPayload(monthDays.slice(0, 3), 1000, 29)],
    }),
  );
  assertEquals(
    buildUsgsSeasonalContext({
      metric: "flow_cfs",
      monthDays,
      payloads: [statisticsPayload(monthDays.slice(0, 2), 1000, 29)],
    }),
    null,
  );
});

Deno.test("USGS water-temperature statistics are converted from Celsius to Fahrenheit", () => {
  const monthDays = seasonalWindowMonthDays("2026-08-24");
  const context = buildUsgsSeasonalContext({
    metric: "water_temp_f",
    monthDays,
    payloads: [temperatureStatisticsPayload(monthDays)],
  });
  assert(context);
  assertEquals(context.average, 68);
  assertEquals(context.p25, 59);
  assertEquals(context.median, 68);
  assertEquals(context.p75, 77);
});

Deno.test("measured temperature history uses daily values and marks five years as recent", () => {
  const dailyValues = [2021, 2022, 2023, 2024, 2025].flatMap((year) =>
    seasonalWindowMonthDays("2026-08-24").map((monthDay, index) => ({
      localDate: `${year}-${monthDay}`,
      value: 58 + index,
    }))
  );
  const context = buildMeasuredTemperatureSeasonalContext({
    dailyValues,
    localDate: "2026-08-24",
  });
  assert(context);
  assertEquals(context.historicalYears, 5);
  assertEquals(context.sampleCount, 35);
  assertEquals(context.recordKind, "recent");
  assertEquals(
    withSeasonalComparison(context, "water_temp_f", 70).comparisonLabel,
    "Much warmer than the recent average",
  );
});

function statisticsPayload(
  monthDays: string[],
  startingAverage: number,
  sampleCount: number,
) {
  return {
    features: [{
      properties: {
        data: [{
          parameter_code: "00060",
          parent_statistic_id: "00003",
          values: monthDays.flatMap((monthDay, index) => [
            {
              time_of_year: monthDay,
              value: String(startingAverage + index * 10),
              sample_count: sampleCount,
              approval_status: "approved",
              computation: "arithmetic_mean",
            },
            {
              time_of_year: monthDay,
              values: [
                startingAverage - 200 + index * 10,
                startingAverage - 150 + index * 10,
                startingAverage - 100 + index * 10,
                startingAverage + index * 10,
                startingAverage + 100 + index * 10,
                startingAverage + 150 + index * 10,
                startingAverage + 200 + index * 10,
              ].map(String),
              percentiles: ["5", "10", "25", "50", "75", "90", "95"],
              sample_count: sampleCount,
              approval_status: "approved",
              computation: "percentile",
            },
          ]),
        }],
      },
    }],
  };
}

function temperatureStatisticsPayload(monthDays: string[]) {
  return {
    features: [{
      properties: {
        data: [{
          parameter_code: "00010",
          parent_statistic_id: "00003",
          values: monthDays.flatMap((monthDay) => [
            {
              time_of_year: monthDay,
              value: "20",
              sample_count: 19,
              approval_status: "approved",
              computation: "arithmetic_mean",
            },
            {
              time_of_year: monthDay,
              values: ["5", "10", "15", "20", "25", "30", "35"],
              percentiles: ["5", "10", "25", "50", "75", "90", "95"],
              sample_count: 19,
              approval_status: "approved",
              computation: "percentile",
            },
          ]),
        }],
      },
    }],
  };
}
