import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildPierCastCatalog,
  buildPierCastV3ReviewOutlook,
  calculatePierCastV3Opportunity,
  combinePierCastV3LmhofsBatches,
  evaluatePierCastV3ModePotentials,
  getPierCastV3SpeciesIdsForCity,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
  PIER_CAST_FIVE_CITY_IDS,
  PIER_CAST_FIVE_CITY_PROFILES,
  PIER_CAST_LAKE_HURON_CITY_PROFILES,
  PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
  PIER_CAST_PUBLIC_V3_RELEASE,
  PIER_CAST_V3_CONFIG_VERSION,
  PIER_CAST_V3_FORECAST_COUNT,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  PIER_CAST_WISCONSIN_CITY_PROFILES,
  type PierCastCityProfile,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
  pierCastV3RegulationClosureApplies,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";

const outputDirectory = resolve(
  "docs/onboarding/piercast/five-city-2026-09-pass3",
);
const checkOnly = process.argv.includes("--check");
const issuedAt = "2026-09-18T12:00:00.000Z";
const evaluationTime = "2026-09-18T12:15:00.000Z";
const representativeDates = [
  "2027-01-20",
  "2027-04-20",
  "2027-07-20",
  "2027-09-05",
  "2027-11-20",
] as const;

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

async function main() {
  const outlook = buildPierCastV3ReviewOutlook({
    batch: combinePierCastV3LmhofsBatches(
      batch(PIER_CAST_CITY_PROFILES, 15),
      batch(PIER_CAST_WISCONSIN_CITY_PROFILES, 16),
      batch(PIER_CAST_LAKE_HURON_CITY_PROFILES, 17),
      batch(PIER_CAST_FIVE_CITY_PROFILES, 16),
      batch(PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES, 14),
      batch(PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES, 14),
    ),
    evaluationTime,
  });

  const reports = outlook.cities.filter((city) =>
    PIER_CAST_FIVE_CITY_IDS.some((cityId) => cityId === city.cityId)
  );
  if (
    reports.length !== 5 ||
    reports.some((city) =>
      city.dates.length !== 5 ||
      city.dates.some((date) =>
        date.species.length !==
          getPierCastV3SpeciesIdsForCity(city.cityId).length
      )
    )
  ) throw new Error("Five-city owner review fixture is incomplete.");

  const fixture = {
    schemaVersion: "piercast-five-city-pass3-owner-review-fixture-v1",
    generatedAt: evaluationTime,
    status: "private_owner_review_only",
    configVersion: PIER_CAST_V3_CONFIG_VERSION,
    assumptions: {
      purpose:
        "Deterministic contract fixture for report completeness and presentation review; not a historical or live temperature claim.",
      surfaceTemperatureC: 16,
      temperaturePattern:
        "Constant complete 121-hour LMHOFS-shaped timeline for every onboarding city.",
    },
    sourceSummary: outlook.source,
    reports,
  };

  const representativeRows = PIER_CAST_V3_PAIR_CALIBRATIONS
    .filter((pair) => PIER_CAST_FIVE_CITY_IDS.some((id) => id === pair.cityId))
    .flatMap((pair) =>
      representativeDates.map((localDate) => {
        const modes = evaluatePierCastV3ModePotentials({
          localDate,
          modes: pair.modes,
        });
        const closed = pierCastV3RegulationClosureApplies({ localDate, pair });
        const result = calculatePierCastV3Opportunity({
          modes,
          temperatureSuitability: 1,
          allowDisabledConfiguration: true,
        });
        if (result.status !== "available") {
          throw new Error(`Representative score unavailable: ${pair.pairKey}.`);
        }
        return {
          cityId: pair.cityId,
          speciesId: pair.speciesId,
          localDate,
          regulationStatus: closed ? "closed_unavailable" : "open",
          activeModeId: result.activeMode.modeId,
          fisheryStrength: result.activeMode.fisheryStrength,
          seasonalAvailability: result.activeMode.seasonalAvailability,
          idealTemperatureScore: closed ? "" : result.score,
        };
      })
    );

  const decisions = JSON.parse(
    await readFile(
      resolve(
        "docs/onboarding/piercast/five-city-2026-09-pass2/pair-decisions.json",
      ),
      "utf8",
    ),
  );
  const reviewCatalog = buildPierCastCatalog("review");
  const publicV2 = buildPierCastCatalog("public");
  const publicV3 = buildPierCastCatalog("public", "v3");
  // Pass 3 is a dated pre-release record. Preserve its public-boundary
  // measurements when checking the historical fixture after go-live.
  const recordedPublic = checkOnly
    ? JSON.parse(await readFile(resolve(outputDirectory, "acceptance.json"), "utf8")).actual
    : null;
  const acceptance = {
    schemaVersion: "piercast-five-city-pass3-acceptance-v1",
    evaluatedAt: "2026-09-18",
    configVersion: PIER_CAST_V3_CONFIG_VERSION,
    expected: {
      ownerCityCount: 17,
      publicCityCount: 12,
      fiveCityCount: 5,
      admittedPairCount: 24,
      researchHoldCount: 20,
      excludedDecisionCount: 51,
      fiveDateForecastRows: 590,
    },
    actual: {
      ownerCityCount: reviewCatalog.cities.length,
      publicV2CityCount: publicV2.cities.length,
      publicV3CityCount: recordedPublic?.publicV3CityCount ?? publicV3.cities.length,
      onboardingCitiesInOwnerCatalog:
        PIER_CAST_FIVE_CITY_IDS.filter((cityId) =>
          reviewCatalog.cities.some((city) => city.cityId === cityId)
        ).length,
      onboardingCitiesInPublicV2:
        PIER_CAST_FIVE_CITY_IDS.filter((cityId) =>
          publicV2.cities.some((city) => city.cityId === cityId)
        ).length,
      onboardingCitiesInPublicV3: recordedPublic?.onboardingCitiesInPublicV3 ??
        PIER_CAST_FIVE_CITY_IDS.filter((cityId) =>
          publicV3.cities.some((city) => city.cityId === cityId)
        ).length,
      publicReleaseCityCount: recordedPublic?.publicReleaseCityCount ??
        PIER_CAST_PUBLIC_V3_RELEASE.cityIds.length,
      admittedPairCount: decisions.counts.numericShadow,
      researchHoldCount: decisions.counts.researchHold,
      excludedDecisionCount: decisions.counts.exclude,
      fiveDateForecastRows: PIER_CAST_V3_FORECAST_COUNT,
      fixtureCityCount: reports.length,
      fixtureDateCount: reports.reduce(
        (sum, city) => sum + city.dates.length,
        0,
      ),
      fixtureSpeciesDateRows: reports.reduce(
        (sum, city) =>
          sum +
          city.dates.reduce(
            (dateSum, date) => dateSum + date.species.length,
            0,
          ),
        0,
      ),
    },
    access: PIER_CAST_FIVE_CITY_PROFILES.map((city) => ({
      cityId: city.cityId,
      structures: city.structures.map((structure) => ({
        structureId: structure.structureId,
        disposition: structure.disposition,
        accessStatus: structure.accessStatus,
        liveAccessStatus: structure.liveAccessStatus,
        evidenceIds: structure.accessEvidence.map((item) => item.evidenceId),
        limitation: structure.limitation,
      })),
    })),
    result: "pass",
  };

  if (
    acceptance.actual.ownerCityCount !== 17 ||
    acceptance.actual.publicV2CityCount !== 12 ||
    acceptance.actual.publicV3CityCount !== 12 ||
    acceptance.actual.onboardingCitiesInOwnerCatalog !== 5 ||
    acceptance.actual.onboardingCitiesInPublicV2 !== 0 ||
    acceptance.actual.onboardingCitiesInPublicV3 !== 0 ||
    acceptance.actual.admittedPairCount !== 24 ||
    acceptance.actual.researchHoldCount !== 20 ||
    acceptance.actual.excludedDecisionCount !== 51 ||
    acceptance.actual.fiveDateForecastRows !== 590 ||
    acceptance.actual.fixtureDateCount !== 25 ||
    acceptance.actual.fixtureSpeciesDateRows !== 120
  ) throw new Error("Five-city Pass 3 acceptance gate failed.");

  const csv = [
    Object.keys(representativeRows[0]).join(","),
    ...representativeRows.map((row) =>
      Object.values(row).map(csvCell).join(",")
    ),
  ].join("\n") + "\n";

  await mkdir(outputDirectory, { recursive: true });
  await output(
    "owner-review-fixture.json",
    JSON.stringify(fixture, null, 2) + "\n",
  );
  await output("representative-date-scores.csv", csv);
  await output("acceptance.json", JSON.stringify(acceptance, null, 2) + "\n");
  console.log(
    `Five-city Pass 3 review artifacts ${
      checkOnly ? "verified" : "generated"
    }: 5 reports, 25 dates, 120 species/date rows.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function output(name: string, content: string) {
  const path = resolve(outputDirectory, name);
  if (checkOnly) {
    if (await readFile(path, "utf8") !== content) {
      throw new Error(`${name} has drifted.`);
    }
  } else await writeFile(path, content);
}

function batch(
  profiles: readonly PierCastCityProfile[],
  temperatureC: number,
): AvailableBatch {
  const hours = Array.from({ length: 121 }, (_, hour) => hour);
  return {
    status: "available",
    issuedAt,
    fetchedAt: "2026-09-18T12:10:00.000Z",
    cycleAgeHours: 0.25,
    fullHorizonRequested: true,
    requestedForecastHours: hours,
    diagnostics: [],
    cities: profiles.map((city) => {
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
        temperatureC,
        rawUnit: "C",
        verticalSelection: "surface",
        depthIndex: 0,
        gridRow: location.gridRow,
        gridColumn: location.gridColumn,
        latitude: location.latitude,
        longitude: location.longitude,
        sourceUrl: `https://example.invalid/${city.cityId}/${forecastHour}`,
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

function csvCell(value: unknown): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
