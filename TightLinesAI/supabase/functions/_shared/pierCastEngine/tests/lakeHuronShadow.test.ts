import { assert, assertEquals, assertRejects } from "jsr:@std/assert";
import {
  archivePierCastLakeHuronLmhofsBatch,
  buildPierCastCatalog,
  getPierCastLakeHuronTemperatureCurve,
  ingestPierCastLakeHuronShadowCycle,
  PIER_CAST_LAKE_HURON_CITY_IDS,
  PIER_CAST_LAKE_HURON_CITY_PROFILES,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
  validatePierCastTemperatureCurve,
} from "../index.ts";

const ISSUED_AT = "2026-09-15T12:00:00.000Z";

function batch(): Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
> {
  const hours = Array.from({ length: 121 }, (_, hour) => hour);
  const cities = PIER_CAST_LAKE_HURON_CITY_PROFILES.map((profile, index) => {
    const source = profile.waterTemperatureSource!;
    const location = source.configuredLocation!;
    const samples: PierCastLmhofsSample[] = hours.map((forecastHour) => ({
      cityId: profile.cityId,
      sourceId: source.sourceId,
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: ISSUED_AT,
      forecastHour,
      validAt: new Date(Date.parse(ISSUED_AT) + forecastHour * 3_600_000)
        .toISOString(),
      temperatureC: 15 + index + forecastHour / 240,
      rawUnit: "C",
      verticalSelection: "surface",
      depthIndex: 0,
      gridRow: location.gridRow,
      gridColumn: location.gridColumn,
      latitude: location.latitude,
      longitude: location.longitude,
      sourceUrl: `https://example.test/${profile.cityId}/${forecastHour}`,
    }));
    return {
      status: "available" as const,
      cityId: profile.cityId,
      sourceId: source.sourceId,
      issuedAt: ISSUED_AT,
      requestedForecastHours: hours,
      coverageStart: samples[0].validAt,
      coverageEnd: samples[120].validAt,
      samples,
      reasonCodes: [] as const,
    };
  });
  return {
    status: "available",
    issuedAt: ISSUED_AT,
    fetchedAt: "2026-09-15T12:05:00.000Z",
    cycleAgeHours: .08,
    fullHorizonRequested: true,
    requestedForecastHours: hours,
    cities,
    diagnostics: [],
  };
}

Deno.test("Lake Huron profiles are private, complete, and use unique audited cells", () => {
  assertEquals(PIER_CAST_LAKE_HURON_CITY_PROFILES.length, 3);
  assertEquals(
    new Set(
      PIER_CAST_LAKE_HURON_CITY_PROFILES.map((p) =>
        `${p.waterTemperatureSource!.configuredLocation!.gridRow}:${
          p.waterTemperatureSource!.configuredLocation!.gridColumn
        }`
      ),
    ).size,
    3,
  );
  const publicIds = new Set(
    buildPierCastCatalog("public").cities.map((c) => c.cityId),
  );
  const reviewIds = new Set(
    buildPierCastCatalog("review").cities.map((c) => c.cityId),
  );
  for (const cityId of PIER_CAST_LAKE_HURON_CITY_IDS) {
    assert(!publicIds.has(cityId));
    assert(reviewIds.has(cityId));
    assertEquals(
      PIER_CAST_LAKE_HURON_CITY_PROFILES.find((p) => p.cityId === cityId)!
        .species.length,
      15,
    );
  }
  assertEquals(
    validatePierCastTemperatureCurve(
      getPierCastLakeHuronTemperatureCurve("atlantic_salmon")!,
    ),
    [],
  );
  assertEquals(
    validatePierCastTemperatureCurve(
      getPierCastLakeHuronTemperatureCurve("northern_pike")!,
    ),
    [],
  );
  assertEquals(
    PIER_CAST_V3_PAIR_CALIBRATIONS.filter((p) =>
      PIER_CAST_LAKE_HURON_CITY_IDS.includes(
        p.cityId as typeof PIER_CAST_LAKE_HURON_CITY_IDS[number],
      )
    ).length,
    14,
  );
});

Deno.test("Lake Huron archive commits exactly 363 samples and fails partial input closed", async () => {
  let rpc = "";
  const database = {
    rpc: (name: string) => {
      rpc = name;
      return Promise.resolve({ data: { status: "committed" }, error: null });
    },
  };
  const complete = batch();
  assertEquals(
    await archivePierCastLakeHuronLmhofsBatch(
      database,
      complete,
      "test-engine",
    ),
    { issuedAt: ISSUED_AT, cityCount: 3, sampleCount: 363 },
  );
  assertEquals(rpc, "commit_pier_cast_expansion_lmhofs_cycle");
  const partial = structuredClone(complete);
  partial.cities[0].samples.pop();
  await assertRejects(
    () => archivePierCastLakeHuronLmhofsBatch(database, partial, "test-engine"),
    Error,
    "three complete 121-hour",
  );
});

Deno.test("Lake Huron ingestion falls back only to a complete fresh cohort", async () => {
  const complete = batch();
  const outcome = await ingestPierCastLakeHuronShadowCycle({
    database: { rpc: () => Promise.resolve({ data: null, error: null }) },
    engineVersion: "test-engine",
    operations: {
      fetchLive: () => Promise.reject(new Error("offline")),
      readFreshArchive: () => Promise.resolve(complete),
    },
  });
  assertEquals(outcome.status, "cached_fallback");
  assertEquals(outcome.batch?.cities.length, 3);
});
