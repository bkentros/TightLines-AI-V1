import { assert, assertEquals, assertRejects } from "jsr:@std/assert";
import {
  archivePierCastStJosephHarrisvilleLmhofsBatch,
  buildPierCastCatalog,
  getPierCastV3PairCalibration,
  ingestPierCastStJosephHarrisvilleShadowCycle,
  PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_IDS,
  PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
} from "../index.ts";

const admittedCounts = {
  st_joseph_mi: 7,
  south_haven_mi: 13,
  holland_mi: 10,
  lexington_mi: 14,
  harrisville_mi: 5,
} as const;
type PresentBatch = Extract<PierCastLmhofsBatch, { status: "available" | "partial" }>;

Deno.test("St. Joseph-Harrisville profiles are complete, private, bluegill-free, and mapped to wet cells", () => {
  assertEquals(PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES.length, 5);
  assertEquals(new Set(PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_IDS).size, 5);
  for (const city of PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES) {
    assertEquals(city.publicEnabled, false);
    assertEquals(city.tentative, true);
    assertEquals(city.timezone, "America/Detroit");
    assertEquals(city.species.length, 19);
    assert(city.structures.length > 0);
    const location = city.waterTemperatureSource?.configuredLocation;
    assert(location);
    assert(location.modelBathymetryM > 2);
    assertEquals(location.gridCellStatus, "candidate");
    assertEquals(city.species.filter((row) => row.inheritance === "candidate").length, admittedCounts[city.cityId]);
    for (const row of city.species) {
      assertEquals(row.ratingEnabled, false);
      assertEquals(row.seasonalOpportunityCurve, null);
      assertEquals(!!getPierCastV3PairCalibration(city.cityId, row.speciesId), row.inheritance === "candidate");
    }
    const bluegill = city.species.find((row) => row.speciesId === "bluegill");
    assert(bluegill);
    assertEquals(bluegill.inheritance, "unresolved");
    assertEquals(getPierCastV3PairCalibration(city.cityId, "bluegill"), null);
    assert(bluegill.limitation.toLowerCase().includes("product-policy exclusion"));
  }
});

Deno.test("new cities are public in v3 and remain absent from legacy v2", () => {
  const review = buildPierCastCatalog("review");
  const publicV2 = buildPierCastCatalog("public");
  const publicV3 = buildPierCastCatalog("public", "v3");
  assertEquals(review.cities.length, 27);
  assertEquals(publicV2.cities.length, 12);
  assertEquals(publicV3.cities.length, 27);
  for (const cityId of PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_IDS) {
    assert(review.cities.some((city) => city.cityId === cityId));
    assert(!publicV2.cities.some((city) => city.cityId === cityId));
    assert(
      publicV3.cities.some((city) =>
        city.cityId === cityId && city.releaseStatus === "public_research"
      ),
    );
  }
});

Deno.test("Lexington closure and Harrisville unverified access remain explicit", () => {
  const lexington = PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES.find((city) => city.cityId === "lexington_mi")!;
  const harrisville = PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES.find((city) => city.cityId === "harrisville_mi")!;
  assert(lexington.structures.some((structure) => structure.accessStatus === "reported_closed" && structure.limitation.toLowerCase().includes("closed")));
  assert(harrisville.structures.some((structure) =>
    (structure.accessStatus === "not_live_verified" || structure.accessStatus === "route_unverified") &&
    structure.limitation.length > 30
  ));
});

Deno.test("St. Joseph-Harrisville archive freezes five complete 121-hour timelines", async () => {
  const batch = completeBatch();
  let rpcName = "";
  let archivedSamples = 0;
  const result = await archivePierCastStJosephHarrisvilleLmhofsBatch({
    rpc: (name, args) => {
      rpcName = name;
      archivedSamples = Array.isArray(args?.p_samples) ? args.p_samples.length : 0;
      return Promise.resolve({ data: { status: "committed" }, error: null });
    },
  }, batch, "test-engine");
  assertEquals(rpcName, "commit_pier_cast_st_joseph_harrisville_lmhofs_cycle");
  assertEquals(archivedSamples, 605);
  assertEquals(result, { issuedAt: "2026-09-19T12:00:00.000Z", cityCount: 5, sampleCount: 605 });

  const altered = structuredClone(batch);
  altered.cities[4].samples[0].gridColumn += 1;
  await assertRejects(
    () => archivePierCastStJosephHarrisvilleLmhofsBatch({ rpc: () => Promise.resolve({ data: null, error: null }) }, altered, "test-engine"),
    Error,
    "samples are inconsistent",
  );
});

Deno.test("St. Joseph-Harrisville ingestion falls back only to a complete fresh cohort", async () => {
  const cached = completeBatch();
  const result = await ingestPierCastStJosephHarrisvilleShadowCycle({
    database: { rpc: () => Promise.resolve({ data: null, error: null }) },
    engineVersion: "test-engine",
    now: new Date("2026-09-19T12:15:00.000Z"),
    operations: {
      fetchLive: () => Promise.resolve({ ...cached, status: "partial" }),
      readFreshArchive: () => Promise.resolve(cached),
    },
  });
  assertEquals(result.status, "cached_fallback");
  assertEquals(result.batch?.cities.length, 5);
  assertEquals(result.batch?.cities.flatMap((city) => city.samples).length, 605);
});

function completeBatch(): PresentBatch & { status: "available" } {
  const issuedAt = "2026-09-19T12:00:00.000Z";
  const hours = Array.from({ length: 121 }, (_, hour) => hour);
  return {
    status: "available", issuedAt, fetchedAt: "2026-09-19T12:05:00.000Z", cycleAgeHours: 0.25,
    fullHorizonRequested: true, requestedForecastHours: hours, diagnostics: [],
    cities: PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES.map((city) => {
      const source = city.waterTemperatureSource!;
      const location = source.configuredLocation!;
      const samples: PierCastLmhofsSample[] = hours.map((forecastHour) => ({
        cityId: city.cityId, sourceId: source.sourceId, productId: "NOAA_NOS_LMHOFS_REGULARGRID",
        issuedAt, forecastHour, validAt: new Date(Date.parse(issuedAt) + forecastHour * 3_600_000).toISOString(),
        temperatureC: 14, rawUnit: "C", verticalSelection: "surface", depthIndex: 0,
        gridRow: location.gridRow, gridColumn: location.gridColumn, latitude: location.latitude,
        longitude: location.longitude, sourceUrl: `https://example.test/${city.cityId}/${forecastHour}`,
      }));
      return { status: "available" as const, cityId: city.cityId, sourceId: source.sourceId, issuedAt,
        requestedForecastHours: hours, coverageStart: samples[0].validAt, coverageEnd: samples[120].validAt,
        samples, reasonCodes: [] as const };
    }),
  };
}
