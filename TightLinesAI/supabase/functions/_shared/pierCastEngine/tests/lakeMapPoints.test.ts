import { assertEquals, assertMatch } from "jsr:@std/assert";
import { PIER_CAST_CITY_PROFILES } from "../config/cities.ts";
import { PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES } from "../config/chicagoAlpenaShadow.ts";
import { PIER_CAST_FIVE_CITY_PROFILES } from "../config/fiveCityShadow.ts";
import { PIER_CAST_LAKE_HURON_CITY_PROFILES } from "../config/lakeHuronShadow.ts";
import { PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES } from "../config/pentwaterCasevilleShadow.ts";
import { PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES } from "../config/stJosephHarrisvilleShadow.ts";
import { PIER_CAST_WISCONSIN_CITY_PROFILES } from "../config/wisconsinShadow.ts";
import {
  fetchConfiguredPierCastTemperatureBatch,
  fetchPierCastLakeMapBatch,
} from "../providers/lakeMapPoints.ts";
import type { PierCastLmhofsBatch } from "../providers/lmhofs.ts";

const cycle = "2026-10-14T12:00:00Z";
const run = "20261014T12Z-10141700";
const allProfiles = [
  ...PIER_CAST_CITY_PROFILES,
  ...PIER_CAST_WISCONSIN_CITY_PROFILES,
  ...PIER_CAST_LAKE_HURON_CITY_PROFILES,
  ...PIER_CAST_FIVE_CITY_PROFILES,
  ...PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
  ...PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
  ...PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
];

function pointFile() {
  const points = allProfiles.map((profile) => {
    const location = profile.waterTemperatureSource!.configuredLocation!;
    return {
      cityId: profile.cityId,
      gridRow: location.gridRow,
      gridColumn: location.gridColumn,
      latitude: location.latitude,
      longitude: location.longitude,
      depthIndex: location.depthIndex,
      samples: Array.from({ length: 121 }, (_, forecastHour) => ({
        forecastHour,
        validAt: new Date(Date.parse(cycle) + forecastHour * 3_600_000)
          .toISOString().replace(".000Z", "Z"),
        temperatureC: 10 + forecastHour / 100,
      })),
    };
  });
  // The producer always includes the full 32-city roster; consumers select a cohort.
  return {
    formatVersion: 1,
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    units: "C",
    run,
    cycle,
    generatedAt: "2026-10-14T16:00:00.000Z",
    source: "nodd",
    sourceDistribution: "NOAA_NODD_AWS",
    sampleMethod: "nodd_interpolated_to_exact_lmhofs_regular_grid_cell",
    cityCount: 32,
    forecastHours: 121,
    points,
  };
}

Deno.test("lake-map point feed preserves exact cells and a complete cohort", async () => {
  const requests: string[] = [];
  const batch = await fetchPierCastLakeMapBatch({
    mapPassSecret: "test-secret-at-least-sixteen-characters",
    cityProfiles: PIER_CAST_CITY_PROFILES,
    now: () => new Date("2026-10-14T16:00:00Z"),
    fetchImpl: async (input) => {
      const url = String(input);
      requests.push(url);
      if (url.includes("/runs/piercast/latest.json")) {
        return Response.json({
          formatVersion: 1,
          run,
          cycle,
          source: "nodd",
          base: `runs/${run}/`,
          object: "piercast-points.json",
        });
      }
      return Response.json(pointFile());
    },
  });
  assertEquals(batch.status, "available");
  if (batch.status === "unavailable") {
    throw new Error("expected available batch");
  }
  assertEquals(batch.cities.length, 5);
  assertEquals(batch.cities.every((city) => city.samples.length === 121), true);
  const expected = PIER_CAST_CITY_PROFILES[0].waterTemperatureSource!
    .configuredLocation!;
  assertEquals(batch.cities[0].samples[0].gridRow, expected.gridRow);
  assertEquals(batch.cities[0].samples[0].gridColumn, expected.gridColumn);
  assertEquals(batch.cities[0].samples[120].temperatureC, 11.2);
  assertEquals(batch.diagnostics[0].code, "lake_map_surface");
  assertEquals(requests.length, 2);
  assertMatch(requests[0], /\?v=[0-9a-f]{8,}&t=v1\./);
  assertMatch(
    requests[1],
    new RegExp(`/runs/${run}/piercast-points\\.json\\?t=v1\\.`),
  );
});

Deno.test("lake-map mapping failure falls back to the whole direct THREDDS cohort", async () => {
  const direct: PierCastLmhofsBatch = {
    status: "available",
    issuedAt: cycle,
    fetchedAt: "2026-10-14T16:00:00.000Z",
    cycleAgeHours: 4,
    fullHorizonRequested: true,
    requestedForecastHours: Array.from({ length: 121 }, (_, hour) => hour),
    cities: [],
    diagnostics: [],
  };
  let fallbackCalls = 0;
  const batch = await fetchConfiguredPierCastTemperatureBatch({
    mode: "lake_map",
    mapPassSecret: "test-secret-at-least-sixteen-characters",
    cityProfiles: PIER_CAST_CITY_PROFILES,
    now: () => new Date("2026-10-14T16:00:00Z"),
    fetchImpl: async (input) => {
      if (String(input).includes("/runs/piercast/latest.json")) {
        return Response.json({
          run,
          cycle,
          source: "nodd",
          base: `runs/${run}/`,
          object: "piercast-points.json",
        });
      }
      const file = pointFile();
      file.points[0].gridRow += 1;
      return Response.json(file);
    },
    fetchLmhofs: async () => {
      fallbackCalls += 1;
      return direct;
    },
  });
  assertEquals(fallbackCalls, 1);
  assertEquals(batch.status, "available");
  assertEquals(batch.diagnostics[0].code, "source_failover");
  assertMatch(batch.diagnostics[0].message, /mapping_invalid/);
});

Deno.test("default-off mode stays on the existing direct THREDDS path", async () => {
  let fallbackCalls = 0;
  const direct: PierCastLmhofsBatch = {
    status: "unavailable",
    issuedAt: null,
    fetchedAt: "2026-10-14T16:00:00.000Z",
    cycleAgeHours: null,
    fullHorizonRequested: true,
    requestedForecastHours: [0],
    cities: [],
    diagnostics: [],
  };
  const batch = await fetchConfiguredPierCastTemperatureBatch({
    cityProfiles: PIER_CAST_CITY_PROFILES,
    fetchLmhofs: async () => {
      fallbackCalls += 1;
      return direct;
    },
  });
  assertEquals(batch, direct);
  assertEquals(fallbackCalls, 1);
});
