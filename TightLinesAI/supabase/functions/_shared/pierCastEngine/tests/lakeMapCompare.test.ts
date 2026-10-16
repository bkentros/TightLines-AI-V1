import { assertEquals, assertThrows } from "jsr:@std/assert";
import {
  combinePierCastV3LmhofsBatches,
  comparePierCastLakeMapBatches,
  PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_FIVE_CITY_PROFILES,
  PIER_CAST_LAKE_HURON_CITY_PROFILES,
  PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
  PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
  PIER_CAST_WISCONSIN_CITY_PROFILES,
  type PierCastCityProfile,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
} from "../index.ts";

const ISSUED_AT = "2026-10-16T12:00:00.000Z";
type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

Deno.test("lake-map comparison covers all 32 city timelines without writes", () => {
  const archived = combinedBatch();
  const lakeMap = structuredClone(archived);
  for (const city of lakeMap.cities) {
    for (const sample of city.samples) sample.temperatureC += 0.01;
  }
  lakeMap.issuedAt = "2026-10-16T12:00:00Z";

  const result = comparePierCastLakeMapBatches({
    archived,
    lakeMap,
    evaluationTime: "2026-10-16T18:00:00.000Z",
    cohorts: cohortChecks(),
    durationMs: 900,
  });

  assertEquals(result.mode, "read_only");
  assertEquals(result.temperature.sampleCount, 3872);
  assertEquals(result.temperature.cities.length, 32);
  assertEquals(
    result.temperature.cities.every((city) => city.sampleCount === 121),
    true,
  );
  assertEquals(
    Math.abs(result.temperature.meanAbsDifferenceF - 0.018) < 1e-9,
    true,
  );
  assertEquals(
    Math.abs(result.temperature.maxAbsDifferenceF - 0.018) < 1e-9,
    true,
  );
  assertEquals(result.ratings.forecastCount, 1270);
  assertEquals(result.ratings.bandChanges, 0);
});

Deno.test("lake-map comparison rejects a different model cycle", () => {
  assertThrows(
    () =>
      comparePierCastLakeMapBatches({
        archived: combinedBatch(),
        lakeMap: combinedBatch("2026-10-16T18:00:00.000Z"),
        evaluationTime: "2026-10-16T18:00:00.000Z",
        cohorts: cohortChecks("2026-10-16T18:00:00.000Z"),
        durationMs: 1,
      }),
    Error,
    "does not match committed cycle",
  );
});

function cohortChecks(issuedAt = "2026-10-16T12:00:00Z") {
  return [
    ["primary", 5],
    ["wisconsin", 4],
    ["lake_huron", 3],
    ["five_city", 5],
    ["chicago_alpena", 5],
    ["st_joseph_harrisville", 5],
    ["pentwater_caseville", 5],
  ].map(([cohort, cityCount]) => ({
    cohort: cohort as
      | "primary"
      | "wisconsin"
      | "lake_huron"
      | "five_city"
      | "chicago_alpena"
      | "st_joseph_harrisville"
      | "pentwater_caseville",
    source: "lake_map" as const,
    issuedAt,
    cityCount: cityCount as number,
    sampleCount: (cityCount as number) * 121,
    durationMs: 100,
  }));
}

function combinedBatch(issuedAt = ISSUED_AT): AvailableBatch {
  return combinePierCastV3LmhofsBatches(
    batch(PIER_CAST_CITY_PROFILES, issuedAt),
    batch(PIER_CAST_WISCONSIN_CITY_PROFILES, issuedAt),
    batch(PIER_CAST_LAKE_HURON_CITY_PROFILES, issuedAt),
    batch(PIER_CAST_FIVE_CITY_PROFILES, issuedAt),
    batch(PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES, issuedAt),
    batch(PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES, issuedAt),
    batch(PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES, issuedAt),
  );
}

function batch(
  profiles: readonly PierCastCityProfile[],
  issuedAt: string,
): AvailableBatch {
  const hours = Array.from({ length: 121 }, (_, hour) => hour);
  const cities = profiles.map((profile, cityIndex) => {
    const source = profile.waterTemperatureSource!;
    const location = source.configuredLocation!;
    const samples: PierCastLmhofsSample[] = hours.map((forecastHour) => ({
      cityId: profile.cityId,
      sourceId: source.sourceId,
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt,
      forecastHour,
      validAt: new Date(Date.parse(issuedAt) + forecastHour * 3_600_000)
        .toISOString(),
      temperatureC: 12 + cityIndex * 0.2 + forecastHour / 500,
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
      issuedAt,
      requestedForecastHours: hours,
      coverageStart: samples[0].validAt,
      coverageEnd: samples[120].validAt,
      samples,
      reasonCodes: [] as const,
    };
  });
  return {
    status: "available",
    issuedAt,
    fetchedAt: new Date(Date.parse(issuedAt) + 5 * 60_000).toISOString(),
    cycleAgeHours: 0.25,
    fullHorizonRequested: true,
    requestedForecastHours: hours,
    cities,
    diagnostics: [],
  };
}
