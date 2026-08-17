import { assertEquals } from "jsr:@std/assert";
import {
  fetchUsgsDailyFlowBaselineObservations,
  fetchUsgsDailyWaterTemperatureObservations,
  parseUsgsDailyFlowValues,
  parseUsgsDailyWaterTemperatureValues,
} from "../index.ts";

Deno.test("USGS daily-value parser normalizes flow observations and skips invalid values", () => {
  const observations = parseUsgsDailyFlowValues(usgsDailyPayload(), {
    riverId: "pere_marquette",
  });

  assertEquals(observations, [
    {
      riverId: "pere_marquette",
      metric: "flow_cfs",
      localDate: "2024-09-19",
      value: 612,
    },
    {
      riverId: "pere_marquette",
      metric: "flow_cfs",
      localDate: "2024-09-21",
      value: 620.5,
    },
  ]);
});

Deno.test("USGS daily water-temperature parser converts daily Celsius means", async () => {
  const payload = {
    features: [{
      properties: {
        monitoring_location_id: "USGS-04125550",
        parameter_code: "00010",
        statistic_id: "00003",
        time: "2026-08-01",
        value: 20,
        unit_of_measure: "degC",
      },
    }],
  };
  assertEquals(
    parseUsgsDailyWaterTemperatureValues(payload, {
      sourceId: "big_manistee_wellston_temperature",
      siteId: "04125550",
    }),
    [{
      sourceId: "big_manistee_wellston_temperature",
      localDate: "2026-08-01",
      waterTempF: 68,
    }],
  );

  let requestedUrl = "";
  await fetchUsgsDailyWaterTemperatureObservations({
    fetchFn: async (url) => {
      requestedUrl = String(url);
      return { ok: true, json: async () => payload };
    },
    sourceId: "big_manistee_wellston_temperature",
    siteId: "04125550",
    startDate: "2026-08-01",
    endDate: "2026-08-14",
  });
  const parsed = new URL(requestedUrl);
  assertEquals(parsed.searchParams.get("parameter_code"), "00010");
  assertEquals(parsed.searchParams.get("statistic_id"), "00003");
});

Deno.test("USGS daily-value fetcher builds deterministic daily-values request", async () => {
  let requestedUrl = "";
  const observations = await fetchUsgsDailyFlowBaselineObservations({
    riverId: "pere_marquette",
    siteId: "04122500",
    startDate: "2020-01-01",
    endDate: "2025-12-31",
    fetchFn: async (url) => {
      requestedUrl = String(url);
      return { ok: true, json: async () => usgsDailyPayload() };
    },
  });
  const parsed = new URL(requestedUrl);

  assertEquals(
    parsed.origin + parsed.pathname,
    "https://api.waterdata.usgs.gov/ogcapi/v0/collections/daily/items",
  );
  assertEquals(parsed.searchParams.get("f"), "json");
  assertEquals(
    parsed.searchParams.get("monitoring_location_id"),
    "USGS-04122500",
  );
  assertEquals(parsed.searchParams.get("parameter_code"), "00060");
  assertEquals(parsed.searchParams.get("statistic_id"), "00003");
  assertEquals(
    parsed.searchParams.get("datetime"),
    "2020-01-01/2025-12-31",
  );
  assertEquals(observations.length, 2);
});

function usgsDailyPayload() {
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
              { dateTime: "2024-09-19T00:00:00.000-04:00", value: "612" },
              { dateTime: "2024-09-20T00:00:00.000-04:00", value: "" },
              { dateTime: "2024-09-21", value: "620.5" },
              { dateTime: "2024-09-22", value: "Ice" },
            ],
          }],
        },
        {
          variable: {
            variableCode: [{ value: "00065" }],
            variableName: "Gage height, feet",
          },
          values: [{
            value: [{ dateTime: "2024-09-19", value: "4.2" }],
          }],
        },
      ],
    },
  };
}
