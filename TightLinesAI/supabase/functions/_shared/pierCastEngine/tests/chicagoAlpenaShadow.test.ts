import { assert, assertEquals, assertRejects } from "jsr:@std/assert";
import {
  archivePierCastChicagoAlpenaLmhofsBatch,
  buildPierCastCatalog,
  getPierCastV3PairCalibration,
  ingestPierCastChicagoAlpenaShadowCycle,
  PIER_CAST_CHICAGO_ALPENA_CITY_IDS,
  PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
} from "../index.ts";

const admittedCounts = {
  chicago_il: 9,
  michigan_city_in: 8,
  muskegon_mi: 14,
  whitehall_mi: 13,
  alpena_mi: 11,
} as const;
type PresentBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

Deno.test("Chicago-Alpena profiles are complete, private, and mapped to audited wet cells", () => {
  assertEquals(PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES.length, 5);
  assertEquals(new Set(PIER_CAST_CHICAGO_ALPENA_CITY_IDS).size, 5);
  for (const city of PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES) {
    assertEquals(city.publicEnabled, false);
    assertEquals(city.tentative, true);
    assertEquals(city.species.length, 19);
    assert(city.structures.length > 0);
    const location = city.waterTemperatureSource?.configuredLocation;
    assert(location);
    assert(location.modelBathymetryM > 2);
    assertEquals(location.gridCellStatus, "candidate");
    assertEquals(
      city.species.filter((row) => row.inheritance === "candidate").length,
      admittedCounts[city.cityId as keyof typeof admittedCounts],
    );
    assertEquals(
      city.timezone,
      city.cityId === "chicago_il" || city.cityId === "michigan_city_in"
        ? "America/Chicago"
        : "America/Detroit",
    );
    for (const row of city.species) {
      assertEquals(row.ratingEnabled, false);
      assertEquals(row.seasonalOpportunityCurve, null);
      assertEquals(
        !!getPierCastV3PairCalibration(city.cityId, row.speciesId),
        row.inheritance === "candidate" && row.speciesId !== "bluegill",
      );
    }
  }
});

Deno.test("all five cities are public in v3 and remain absent from legacy v2", () => {
  const review = buildPierCastCatalog("review");
  const publicV2 = buildPierCastCatalog("public");
  const publicV3 = buildPierCastCatalog("public", "v3");
  assertEquals(review.cities.length, 32);
  assertEquals(publicV2.cities.length, 12);
  assertEquals(publicV3.cities.length, 32);
  for (const cityId of PIER_CAST_CHICAGO_ALPENA_CITY_IDS) {
    assert(review.cities.some((city) => city.cityId === cityId));
    assert(!publicV2.cities.some((city) => city.cityId === cityId));
    assert(
      publicV3.cities.some((city) =>
        city.cityId === cityId && city.releaseStatus === "public_research"
      ),
    );
  }
});

Deno.test("Chicago-Alpena archive freezes five complete 121-hour timelines", async () => {
  const batch = completeBatch();
  let rpcName = "";
  let archivedSamples = 0;
  const result = await archivePierCastChicagoAlpenaLmhofsBatch(
    {
      rpc: (name, args) => {
        rpcName = name;
        archivedSamples = Array.isArray(args?.p_samples)
          ? args.p_samples.length
          : 0;
        return Promise.resolve({ data: { status: "committed" }, error: null });
      },
    },
    batch,
    "test-engine",
  );
  assertEquals(rpcName, "commit_pier_cast_chicago_alpena_lmhofs_cycle");
  assertEquals(archivedSamples, 605);
  assertEquals(result, {
    issuedAt: "2026-09-19T12:00:00.000Z",
    cityCount: 5,
    sampleCount: 605,
  });

  const altered = structuredClone(batch);
  if (altered.status !== "available") throw new Error("fixture invalid");
  altered.cities[4].samples[0].gridRow += 1;
  await assertRejects(
    () =>
      archivePierCastChicagoAlpenaLmhofsBatch(
        { rpc: () => Promise.resolve({ data: null, error: null }) },
        altered,
        "test-engine",
      ),
    Error,
    "samples are inconsistent",
  );
});

Deno.test("Chicago-Alpena ingestion falls back only to a complete fresh cohort", async () => {
  const cached = completeBatch();
  const result = await ingestPierCastChicagoAlpenaShadowCycle({
    database: { rpc: () => Promise.resolve({ data: null, error: null }) },
    engineVersion: "test-engine",
    now: new Date("2026-09-19T12:15:00.000Z"),
    operations: {
      fetchLive: () =>
        Promise.resolve({
          ...cached,
          status: "partial",
        }),
      readFreshArchive: () => Promise.resolve(cached),
    },
  });
  assertEquals(result.status, "cached_fallback");
  assertEquals(result.batch?.cities.length, 5);
  assertEquals(
    result.batch?.cities.flatMap((city) => city.samples).length,
    605,
  );
});

function completeBatch(): PresentBatch & { status: "available" } {
  const issuedAt = "2026-09-19T12:00:00.000Z";
  const hours = Array.from({ length: 121 }, (_, hour) => hour);
  return {
    status: "available",
    issuedAt,
    fetchedAt: "2026-09-19T12:05:00.000Z",
    cycleAgeHours: 0.25,
    fullHorizonRequested: true,
    requestedForecastHours: hours,
    diagnostics: [],
    cities: PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES.map((city) => {
      const source = city.waterTemperatureSource!;
      const location = source.configuredLocation!;
      const samples: PierCastLmhofsSample[] = hours.map((forecastHour) => ({
        cityId: city.cityId,
        sourceId: source.sourceId,
        productId: "NOAA_NOS_LMHOFS_REGULARGRID",
        issuedAt,
        forecastHour,
        validAt: new Date(Date.parse(issuedAt) + forecastHour * 3_600_000)
          .toISOString(),
        temperatureC: 14,
        rawUnit: "C",
        verticalSelection: "surface",
        depthIndex: 0,
        gridRow: location.gridRow,
        gridColumn: location.gridColumn,
        latitude: location.latitude,
        longitude: location.longitude,
        sourceUrl: `https://example.test/${city.cityId}/${forecastHour}`,
      }));
      return {
        status: "available" as const,
        cityId: city.cityId,
        sourceId: source.sourceId,
        issuedAt,
        requestedForecastHours: hours,
        coverageStart: samples[0].validAt,
        coverageEnd: samples[120].validAt,
        samples,
        reasonCodes: [] as const,
      };
    }),
  };
}
