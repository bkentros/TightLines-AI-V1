import { assertAlmostEquals, assertEquals } from "jsr:@std/assert";
import {
  buildPierCastGlosObservationUrl,
  fetchPierCastGlosObservations,
  parsePierCastGlosCsv,
  PIER_CAST_CITY_PROFILES,
} from "../index.ts";

const START = new Date("2026-09-08T23:00:00Z");
const END = new Date("2026-09-09T00:00:00Z");
const grandHavenConfig = PIER_CAST_CITY_PROFILES.find((city) =>
  city.cityId === "grand_haven_mi"
)!.waterTemperatureSource!.validationObservation!;

Deno.test("GLOS URL freezes configured temperature and QA variables", () => {
  const url = decodeURIComponent(
    buildPierCastGlosObservationUrl(grandHavenConfig, START, END),
  );
  assertEquals(
    url,
    'https://seagull-erddap.glos.org/erddap/tabledap/obs_671.csv?time,sea_water_temperature_1,sea_water_temperature_1_aggregate_test&time>=2026-09-08T23:00:00.000Z&time<=2026-09-09T00:00:00.000Z&orderBy("time")',
  );
});

Deno.test("GLOS CSV parser preserves rejected values and converts passing Kelvin", () => {
  const observations = parsePierCastGlosCsv(
    `time,sea_water_temperature_1,sea_water_temperature_1_aggregate_test
UTC,K,
2026-09-08T23:00:00Z,-9999.900390625,NaN
2026-09-08T23:01:00Z,295.05,4
2026-09-08T23:06:00Z,295.10,1
`,
    grandHavenConfig,
  );
  assertEquals(observations.length, 3);
  assertEquals(observations[0].status, "unavailable");
  assertEquals(observations[1].status, "unavailable");
  assertEquals(observations[2].status, "available");
  if (observations[2].status === "available") {
    assertAlmostEquals(observations[2].temperatureC, 21.95, 1e-9);
  }
});

Deno.test("GLOS fetch reports no quality-passed observations instead of using flag 2", async () => {
  const result = await fetchPierCastGlosObservations({
    cityId: "sheboygan_wi",
    start: START,
    end: END,
    fetchImpl: async () =>
      new Response(`time,Temp0,Temp0_aggregate_test
UTC,K,
2026-09-08T23:00:00Z,293.46,2
2026-09-08T23:05:00Z,293.52,2
`),
  });
  assertEquals(result.status, "unavailable");
  assertEquals(result.reasonCodes, [
    "validation_observation_no_quality_passed_values",
  ]);
  assertEquals(result.rejectedCount, 2);
});

Deno.test("cities without observation contracts fail closed", async () => {
  const result = await fetchPierCastGlosObservations({
    cityId: "manistee_mi",
    start: START,
    end: END,
    fetchImpl: async () => {
      throw new Error("must not fetch");
    },
  });
  assertEquals(result.status, "unavailable");
  assertEquals(result.datasetId, null);
  assertEquals(result.reasonCodes, ["validation_observation_not_configured"]);
});
