import { assert, assertEquals } from "jsr:@std/assert";
import {
  type NormalizedWaterTemperatureObservation,
  parseMonitorMyWatershedTemperature,
  parseUsgsWaterTemperature,
  PERE_MARQUETTE_RIVER_PROFILE,
  resolveWaterTemperatureRead,
  type WaterTemperatureSourceConfig,
} from "../index.ts";

const [maple, bowman, m37] =
  PERE_MARQUETTE_RIVER_PROFILE.waterTemperatureSources;

function observations(
  source: WaterTemperatureSourceConfig,
  latestF: number,
): NormalizedWaterTemperatureObservation[] {
  return [
    ["2026-09-17T19:30:00.000Z", latestF + 5],
    ["2026-09-19T19:30:00.000Z", latestF + 2],
    ["2026-09-20T17:30:00.000Z", latestF + 0.4],
    ["2026-09-20T18:30:00.000Z", latestF],
    ["2026-09-20T19:30:00.000Z", latestF - 0.2],
  ].map(([observedAt, waterTempF]) => ({
    sourceId: source.sourceId,
    provider: source.provider,
    siteId: source.siteId,
    seriesId: source.seriesId,
    observedAt: String(observedAt),
    waterTempF: Number(waterTempF),
    source: "monitor_my_watershed_csv",
  }));
}

Deno.test("Monitor My Watershed parser verifies audited site, medium, units, bounds, and rate", () => {
  const csv = [
    "# SiteCode: Maple Leaf",
    "# SampleMedium: Liquid aqueous",
    "# VariableUnitsName: Degree Fahrenheit",
    "DateTimeUTC,UTCOffset,DateTimeLocalized,Meter_Hydros21_Temp",
    "2026-09-20 18:00:00,-5,2026-09-20 13:00:00,60.0",
    "2026-09-20 18:15:00,-5,2026-09-20 13:15:00,80.0",
    "2026-09-20 18:30:00,-5,2026-09-20 13:30:00,60.5",
    "2026-09-20 18:45:00,-5,2026-09-20 13:45:00,100.0",
  ].join("\n");
  const parsed = parseMonitorMyWatershedTemperature({ csv, source: maple });

  assertEquals(parsed.observations.map((item) => item.waterTempF), [60, 60.5]);
  assertEquals(parsed.rejectedObservationCount, 2);

  const wrongSite = parseMonitorMyWatershedTemperature({
    csv: csv.replace("# SiteCode: Maple Leaf", "# SiteCode: Wrong Site"),
    source: maple,
  });
  assertEquals(wrongSite.observations, []);
  assertEquals(wrongSite.rejectedObservationCount, 1);
});

Deno.test("USGS water-temperature parser enforces site/parameter/unit and converts Celsius", () => {
  const source: WaterTemperatureSourceConfig = {
    ...maple,
    sourceId: "test_usgs_temperature",
    provider: "USGS",
    siteId: "04122500",
  };
  const parsed = parseUsgsWaterTemperature({
    source,
    payload: {
      features: [
        {
          properties: {
            monitoring_location_id: "USGS-04122500",
            parameter_code: "00010",
            time: "2026-09-20T19:30:00Z",
            value: 15,
            unit_of_measure: "degC",
          },
        },
        {
          properties: {
            monitoring_location_id: "USGS-OTHER",
            parameter_code: "00010",
            time: "2026-09-20T19:30:00Z",
            value: 55,
            unit_of_measure: "degF",
          },
        },
      ],
    },
  });
  assertEquals(parsed.observations.length, 1);
  assertEquals(parsed.observations[0].waterTempF, 59);
  assertEquals(parsed.rejectedObservationCount, 1);
});

Deno.test("fresh primary measured temperature wins and uses a three-hour median", () => {
  const read = resolveWaterTemperatureRead({
    sources: [maple, bowman, m37],
    sourcePriority: [maple.sourceId, bowman.sourceId, m37.sourceId],
    observationsBySource: {
      [maple.sourceId]: observations(maple, 60),
      [bowman.sourceId]: observations(bowman, 60.5),
      [m37.sourceId]: observations(m37, 61),
    },
    refreshAtUtc: "2026-09-20T20:00:00.000Z",
  });
  assertEquals(read.sourceId, maple.sourceId);
  assertEquals(read.smoothedWaterTempF, 60);
  assertEquals(read.isUpstreamFallback, false);
  assert(read.reasonCodes.includes("temperature_primary_source"));
});

Deno.test("missing primary selects an explicitly labeled upstream fallback", () => {
  const read = resolveWaterTemperatureRead({
    sources: [maple, bowman, m37],
    sourcePriority: [maple.sourceId, bowman.sourceId, m37.sourceId],
    observationsBySource: {
      [maple.sourceId]: [],
      [bowman.sourceId]: observations(bowman, 60),
      [m37.sourceId]: observations(m37, 61),
    },
    refreshAtUtc: "2026-09-20T20:00:00.000Z",
  });
  assertEquals(read.sourceId, bowman.sourceId);
  assertEquals(read.isUpstreamFallback, true);
  assert(read.reasonCodes.includes("temperature_upstream_fallback"));
});

Deno.test("two agreeing peers prevent an outlying primary from being selected", () => {
  const read = resolveWaterTemperatureRead({
    sources: [maple, bowman, m37],
    sourcePriority: [maple.sourceId, bowman.sourceId, m37.sourceId],
    observationsBySource: {
      [maple.sourceId]: observations(maple, 70),
      [bowman.sourceId]: observations(bowman, 60),
      [m37.sourceId]: observations(m37, 61),
    },
    refreshAtUtc: "2026-09-20T20:00:00.000Z",
  });
  assert(read.sourceId !== maple.sourceId);
  assertEquals(read.isUpstreamFallback, true);
});

Deno.test("stale temperature is labeled and missing sources fail to unavailable", () => {
  const stale = resolveWaterTemperatureRead({
    sources: [maple],
    sourcePriority: [maple.sourceId],
    observationsBySource: {
      [maple.sourceId]: observations(maple, 60),
    },
    refreshAtUtc: "2026-09-21T05:00:00.000Z",
  });
  assertEquals(stale.freshness, "stale");
  assert(stale.reasonCodes.includes("temperature_source_stale"));

  const missing = resolveWaterTemperatureRead({
    sources: [maple],
    sourcePriority: [maple.sourceId],
    observationsBySource: {},
    refreshAtUtc: "2026-09-20T20:00:00.000Z",
  });
  assertEquals(missing.sourceType, "unavailable");
  assertEquals(missing.current, null);
});

Deno.test("future-dated temperature values are excluded instead of hiding an earlier valid read", () => {
  const values = observations(maple, 60);
  values.push({
    ...values[values.length - 1],
    observedAt: "2026-09-21T01:00:00.000Z",
    waterTempF: 55,
  });
  const read = resolveWaterTemperatureRead({
    sources: [maple],
    sourcePriority: [maple.sourceId],
    observationsBySource: { [maple.sourceId]: values },
    refreshAtUtc: "2026-09-20T20:00:00.000Z",
  });
  assertEquals(read.current?.observedAt, "2026-09-20T19:30:00.000Z");
  assertEquals(read.freshness, "fresh");
});
