import type { PierCastArchiveClient } from "../archive/lmhofsArchive.ts";
import { readLatestCoherentPierCastV3SourceCohorts } from "../archive/v3SourceCohorts.ts";
import { PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES } from "../config/chicagoAlpenaShadow.ts";
import { PIER_CAST_CITY_PROFILES } from "../config/cities.ts";
import { PIER_CAST_FIVE_CITY_PROFILES } from "../config/fiveCityShadow.ts";
import { PIER_CAST_LAKE_HURON_CITY_PROFILES } from "../config/lakeHuronShadow.ts";
import { PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES } from "../config/pentwaterCasevilleShadow.ts";
import { PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES } from "../config/stJosephHarrisvilleShadow.ts";
import { PIER_CAST_WISCONSIN_CITY_PROFILES } from "../config/wisconsinShadow.ts";
import { fetchPierCastLakeMapBatch } from "../providers/lakeMapPoints.ts";
import type { PierCastCityProfile } from "../types.ts";
import { combinePierCastV3LmhofsBatches } from "./v3ReviewOutlook.ts";
import {
  comparePierCastLakeMapBatches,
  type PierCastLakeMapCohortCheck,
  type PierCastLakeMapComparison,
} from "../validation/lakeMapCompare.ts";

export async function runPierCastLakeMapComparison(input: {
  database: PierCastArchiveClient;
  mapPassSecret: string;
  now?: Date;
}): Promise<PierCastLakeMapComparison> {
  const startedAt = Date.now();
  const now = input.now ?? new Date();
  const fetchCohort = async (
    cohort: PierCastLakeMapCohortCheck["cohort"],
    profiles: readonly PierCastCityProfile[],
  ) => {
    const cohortStartedAt = Date.now();
    const batch = await fetchPierCastLakeMapBatch({
      mapPassSecret: input.mapPassSecret,
      cityProfiles: profiles,
      now: () => now,
    });
    if (
      batch.diagnostics.length !== 1 ||
      batch.diagnostics[0].code !== "lake_map_surface"
    ) {
      throw new Error(`${cohort} did not read the lake-map feed.`);
    }
    return {
      batch,
      check: {
        cohort,
        source: "lake_map" as const,
        issuedAt: batch.issuedAt,
        cityCount: batch.cities.length,
        sampleCount: batch.cities.reduce(
          (sum, city) => sum + city.samples.length,
          0,
        ),
        durationMs: Date.now() - cohortStartedAt,
      },
    };
  };

  const [
    archived,
    primary,
    wisconsin,
    lakeHuron,
    fiveCity,
    chicagoAlpena,
    stJosephHarrisville,
    pentwaterCaseville,
  ] = await Promise.all([
    readLatestCoherentPierCastV3SourceCohorts({
      database: input.database,
      now,
    }),
    fetchCohort("primary", PIER_CAST_CITY_PROFILES),
    fetchCohort("wisconsin", PIER_CAST_WISCONSIN_CITY_PROFILES),
    fetchCohort("lake_huron", PIER_CAST_LAKE_HURON_CITY_PROFILES),
    fetchCohort("five_city", PIER_CAST_FIVE_CITY_PROFILES),
    fetchCohort("chicago_alpena", PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES),
    fetchCohort(
      "st_joseph_harrisville",
      PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
    ),
    fetchCohort(
      "pentwater_caseville",
      PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
    ),
  ]);
  if (!archived) throw new Error("Committed source cohorts are unavailable.");

  return comparePierCastLakeMapBatches({
    archived: combinePierCastV3LmhofsBatches(
      archived.primary,
      archived.expansion,
      archived.lakeHuron,
      archived.fiveCity,
      archived.chicagoAlpena,
      archived.stJosephHarrisville,
      archived.pentwaterCaseville,
    ),
    lakeMap: combinePierCastV3LmhofsBatches(
      primary.batch,
      wisconsin.batch,
      lakeHuron.batch,
      fiveCity.batch,
      chicagoAlpena.batch,
      stJosephHarrisville.batch,
      pentwaterCaseville.batch,
    ),
    evaluationTime: now.toISOString(),
    cohorts: [
      primary.check,
      wisconsin.check,
      lakeHuron.check,
      fiveCity.check,
      chicagoAlpena.check,
      stJosephHarrisville.check,
      pentwaterCaseville.check,
    ],
    durationMs: Date.now() - startedAt,
  });
}
