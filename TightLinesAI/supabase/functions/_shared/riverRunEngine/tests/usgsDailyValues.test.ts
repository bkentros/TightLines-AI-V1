import { assertEquals } from "jsr:@std/assert";
import {
  fetchUsgsDailyFlowBaselineObservations,
  parseUsgsDailyFlowValues,
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
    "https://waterservices.usgs.gov/nwis/dv/",
  );
  assertEquals(parsed.searchParams.get("format"), "json");
  assertEquals(parsed.searchParams.get("sites"), "04122500");
  assertEquals(parsed.searchParams.get("parameterCd"), "00060");
  assertEquals(parsed.searchParams.get("startDT"), "2020-01-01");
  assertEquals(parsed.searchParams.get("endDT"), "2025-12-31");
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
