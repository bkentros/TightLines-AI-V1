import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildPierCastCatalog,
  buildPierCastV3ReviewOutlook,
  calculatePierCastV3Opportunity,
  combinePierCastV3LmhofsBatches,
  evaluatePierCastV3ModePotentials,
  getPierCastV3RegulationNotices,
  getPierCastV3SpeciesIdsForCity,
  PIER_CAST_CHICAGO_ALPENA_CITY_IDS,
  PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
  PIER_CAST_CITY_PROFILES,
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
  "docs/onboarding/piercast/chicago-alpena-2026-09-pass3",
);
const checkOnly = process.argv.includes("--check");
const issuedAt = "2026-09-19T12:00:00.000Z";
const evaluationTime = "2026-09-19T12:15:00.000Z";
const representativeDates = [
  "2027-01-20",
  "2027-04-20",
  "2027-07-20",
  "2027-09-05",
  "2027-11-20",
] as const;
const allProfiles = [
  ...PIER_CAST_CITY_PROFILES,
  ...PIER_CAST_WISCONSIN_CITY_PROFILES,
  ...PIER_CAST_LAKE_HURON_CITY_PROFILES,
  ...PIER_CAST_FIVE_CITY_PROFILES,
  ...PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
] as const;
const primarySpecies = {
  chicago_il: [
    "yellow_perch",
    "coho_salmon",
    "chinook_salmon",
    "steelhead",
    "brown_trout",
    "lake_trout",
    "smallmouth_bass",
    "freshwater_drum",
  ],
  michigan_city_in: [
    "coho_salmon",
    "chinook_salmon",
    "steelhead",
    "brown_trout",
    "yellow_perch",
    "smallmouth_bass",
  ],
  muskegon_mi: [
    "steelhead",
    "chinook_salmon",
    "coho_salmon",
    "brown_trout",
    "lake_whitefish",
    "yellow_perch",
    "walleye",
    "smallmouth_bass",
    "freshwater_drum",
    "channel_catfish",
  ],
  whitehall_mi: [
    "chinook_salmon",
    "steelhead",
    "brown_trout",
    "coho_salmon",
    "yellow_perch",
    "lake_whitefish",
    "smallmouth_bass",
    "freshwater_drum",
    "walleye",
  ],
  alpena_mi: [
    "atlantic_salmon",
    "coho_salmon",
    "steelhead",
    "lake_trout",
    "yellow_perch",
    "smallmouth_bass",
    "walleye",
    "northern_pike",
    "freshwater_drum",
  ],
} as const;

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
    PIER_CAST_CHICAGO_ALPENA_CITY_IDS.some((cityId) => cityId === city.cityId)
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
  ) throw new Error("Chicago-Alpena owner review fixture is incomplete.");

  const fixture = {
    schemaVersion: "piercast-chicago-alpena-pass3-owner-review-fixture-v1",
    generatedAt: evaluationTime,
    status: "private_owner_review_only",
    configVersion: PIER_CAST_V3_CONFIG_VERSION,
    assumptions: {
      purpose:
        "Deterministic contract fixture for report completeness and presentation review; not a historical or live temperature claim.",
      surfaceTemperatureC: 14,
      temperaturePattern:
        "Constant complete 121-hour LMHOFS-shaped timeline for every onboarding city.",
    },
    sourceSummary: outlook.source,
    reports,
  };

  const onboardingPairs = PIER_CAST_V3_PAIR_CALIBRATIONS.filter((pair) =>
    PIER_CAST_CHICAGO_ALPENA_CITY_IDS.some((id) => id === pair.cityId)
  );
  const representativeRows = onboardingPairs.flatMap((pair) =>
    representativeDates.map((localDate) => scoreRow(pair, localDate))
  );
  const peakRows = onboardingPairs.map((pair) => {
    const openRows = calendarDates(2028)
      .map((localDate) => scoreRow(pair, localDate))
      .filter((row) => row.regulationStatus === "open");
    const peak = openRows.reduce((best, row) =>
      Number(row.idealTemperatureScore) > Number(best.idealTemperatureScore)
        ? row
        : best
    );
    return {
      cityId: pair.cityId,
      speciesId: pair.speciesId,
      peakScore: peak.idealTemperatureScore,
      firstPeakDate: peak.localDate,
      activeModeId: peak.activeModeId,
      fisheryStrength: peak.fisheryStrength,
      regulationStatus: peak.regulationStatus,
    };
  });

  const decisions = JSON.parse(
    await readFile(
      resolve(
        "docs/onboarding/piercast/chicago-alpena-2026-09-pass2/pair-decisions.json",
      ),
      "utf8",
    ),
  );
  const reviewCatalog = buildPierCastCatalog("review");
  const publicV2 = buildPierCastCatalog("public");
  const publicV3 = buildPierCastCatalog("public", "v3");
  const lakeTroutAudit = buildLakeTroutAudit();
  const cellAudit = buildCellAudit();
  const acceptance = {
    schemaVersion: "piercast-chicago-alpena-pass3-acceptance-v1",
    evaluatedAt: "2026-09-19",
    configVersion: PIER_CAST_V3_CONFIG_VERSION,
    expected: {
      ownerCityCount: 22,
      publicV2CityCount: 12,
      publicV3CityCount: 22,
      publicReleaseCityCount: 22,
      onboardingCityCount: 5,
      admittedPairCount: 55,
      researchHoldCount: 23,
      excludedDecisionCount: 17,
      totalPairCount: 173,
      fiveDateForecastRows: 865,
      onboardingFixtureSpeciesDateRows: 275,
      lakeTroutCityDecisions: 22,
    },
    actual: {
      ownerCityCount: reviewCatalog.cities.length,
      publicV2CityCount: publicV2.cities.length,
      publicV3CityCount: publicV3.cities.length,
      publicReleaseCityCount: PIER_CAST_PUBLIC_V3_RELEASE.cityIds.length,
      onboardingCitiesInOwnerCatalog:
        PIER_CAST_CHICAGO_ALPENA_CITY_IDS.filter((cityId) =>
          reviewCatalog.cities.some((city) => city.cityId === cityId)
        ).length,
      onboardingCitiesInPublicV2:
        PIER_CAST_CHICAGO_ALPENA_CITY_IDS.filter((cityId) =>
          publicV2.cities.some((city) => city.cityId === cityId)
        ).length,
      onboardingCitiesInPublicV3:
        PIER_CAST_CHICAGO_ALPENA_CITY_IDS.filter((cityId) =>
          publicV3.cities.some((city) => city.cityId === cityId)
        ).length,
      admittedPairCount: decisions.dispositionCounts.numeric_private,
      researchHoldCount: decisions.dispositionCounts.research_hold_unscored,
      excludedDecisionCount: decisions.dispositionCounts.exclude_unscored,
      totalPairCount: PIER_CAST_V3_PAIR_CALIBRATIONS.length,
      fiveDateForecastRows: PIER_CAST_V3_FORECAST_COUNT,
      fixtureCityCount: reports.length,
      fixtureDateCount: reports.reduce(
        (sum, city) => sum + city.dates.length,
        0,
      ),
      fixtureSpeciesDateRows: reports.reduce(
        (sum, city) =>
          sum + city.dates.reduce(
            (dateSum, date) => dateSum + date.species.length,
            0,
          ),
        0,
      ),
      lakeTroutCityDecisions: lakeTroutAudit.cities.length,
      auditedNoaaCells: cellAudit.cells.length,
      primarySpeciesChecks: Object.entries(primarySpecies).flatMap(
        ([cityId, speciesIds]) =>
          speciesIds.map((speciesId) => ({
            cityId,
            speciesId,
            numericCalibrationPresent: PIER_CAST_V3_PAIR_CALIBRATIONS.some(
              (pair) => pair.cityId === cityId && pair.speciesId === speciesId,
            ),
            presentInFiveDayReport: reports.some((city) =>
              city.cityId === cityId && city.dates.every((date) =>
                date.species.some((species) => species.speciesId === speciesId)
              )
            ),
          })),
      ),
    },
    access: PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES.map((city) => ({
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
    acceptance.actual.ownerCityCount !== 22 ||
    acceptance.actual.publicV2CityCount !== 12 ||
    acceptance.actual.publicV3CityCount !== 22 ||
    acceptance.actual.publicReleaseCityCount !== 22 ||
    acceptance.actual.onboardingCitiesInOwnerCatalog !== 5 ||
    acceptance.actual.onboardingCitiesInPublicV2 !== 0 ||
    acceptance.actual.onboardingCitiesInPublicV3 !== 5 ||
    acceptance.actual.admittedPairCount !== 55 ||
    acceptance.actual.researchHoldCount !== 23 ||
    acceptance.actual.excludedDecisionCount !== 17 ||
    acceptance.actual.totalPairCount !== 173 ||
    acceptance.actual.fiveDateForecastRows !== 865 ||
    acceptance.actual.fixtureDateCount !== 25 ||
    acceptance.actual.fixtureSpeciesDateRows !== 275 ||
    acceptance.actual.lakeTroutCityDecisions !== 22 ||
    acceptance.actual.auditedNoaaCells !== 5 ||
    acceptance.actual.primarySpeciesChecks.some((check) =>
      !check.numericCalibrationPresent || !check.presentInFiveDayReport
    )
  ) throw new Error("Chicago-Alpena Pass 3 acceptance gate failed.");

  if (!checkOnly) await mkdir(outputDirectory, { recursive: true });
  await output(
    "owner-review-fixture.json",
    JSON.stringify(fixture, null, 2) + "\n",
  );
  await output("representative-date-scores.csv", toCsv(representativeRows));
  await output("yearly-peak-scores.csv", toCsv(peakRows));
  await output(
    "lake-trout-all-city-audit.json",
    JSON.stringify(lakeTroutAudit, null, 2) + "\n",
  );
  await output(
    "lmhofs-cell-audit.json",
    JSON.stringify(cellAudit, null, 2) + "\n",
  );
  await output("acceptance.json", JSON.stringify(acceptance, null, 2) + "\n");
  console.log(
    `Chicago-Alpena Pass 3 artifacts ${
      checkOnly ? "verified" : "generated"
    }: ` +
      "5 reports, 25 dates, 275 species/date rows, 55 peaks, and 22 lake-trout decisions.",
  );
}

function scoreRow(
  pair: (typeof PIER_CAST_V3_PAIR_CALIBRATIONS)[number],
  localDate: string,
) {
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
    throw new Error(`Score unavailable: ${pair.pairKey} on ${localDate}.`);
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
}

function buildLakeTroutAudit() {
  const seasonalDates = [
    "2027-01-15",
    "2027-02-15",
    "2027-09-15",
    "2027-10-15",
    "2027-11-15",
    "2027-12-15",
  ];
  return {
    schemaVersion: "piercast-lake-trout-all-city-audit-v1",
    evaluatedAt: "2026-09-19",
    purpose:
      "Cross-city check of every lake-trout decision, with explicit fall/winter visibility and regulation closures.",
    interpretation:
      "Scores describe covered pier/harbor opportunity under ideal temperature suitability. Holds and excludes do not assert biological absence.",
    sources: [
      {
        authority: "Michigan DNR",
        title: "2026 Michigan Fishing Regulations",
        url:
          "https://www.michigan.gov/dnr/things-to-do/fishing/fishing-regulations",
      },
      {
        authority: "Michigan eRegulations",
        title: "Lake Trout and Splake Regulations",
        url:
          "https://www.eregulations.com/michigan/fishing/lake-trout-splake-regulations",
      },
      {
        authority: "Wisconsin DNR",
        title: "Lake Michigan trout and salmon seasons",
        url: "https://dnr.wisconsin.gov/topic/Fishing/seasons/trout",
      },
      {
        authority: "Indiana DNR",
        title: "Lake Michigan Fishing",
        url:
          "https://www.in.gov/dnr/fish-and-wildlife/fishing/lake-michigan-fishing/",
      },
      {
        authority: "Illinois DNR",
        title: "Illinois Fishing Information",
        url:
          "https://dnr.illinois.gov/content/dam/soi/en/web/dnr/publications/documents/00000953.pdf",
      },
    ],
    cities: allProfiles.map((profile) => {
      const species = profile.species.find((row) =>
        row.speciesId === "lake_trout"
      )!;
      const pair = PIER_CAST_V3_PAIR_CALIBRATIONS.find((row) =>
        row.cityId === profile.cityId && row.speciesId === "lake_trout"
      );
      const decision = pair
        ? "numeric_shadow"
        : species.inheritance === "conditional"
        ? "research_hold"
        : "exclude";
      const seasonalReview = pair
        ? seasonalDates.map((localDate) => scoreRow(pair, localDate))
        : seasonalDates.map((localDate) => ({
          cityId: profile.cityId,
          speciesId: "lake_trout",
          localDate,
          regulationStatus: "not_scored",
          idealTemperatureScore: "",
        }));
      return {
        cityId: profile.cityId,
        displayName: profile.displayName,
        decision,
        inheritance: species.inheritance,
        limitation: species.limitation,
        regulationNotices: pair
          ? seasonalDates.map((localDate) => ({
            localDate,
            notices: getPierCastV3RegulationNotices({
              cityId: pair.cityId,
              speciesId: pair.speciesId,
              localDate,
            }),
          }))
          : [],
        seasonalReview,
      };
    }),
  };
}

function buildCellAudit() {
  return {
    schemaVersion: "piercast-chicago-alpena-lmhofs-cell-audit-v1",
    auditedAt: "2026-09-19",
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    sourceCycle: "2026-09-18T06:00:00.000Z",
    method:
      "Independently opened the official LMHOFS regular-grid OPeNDAP product and verified mask=1, finite bathymetry, row/column coordinates, and distance from the covered harbor reference.",
    cells: PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES.map((profile) => {
      const location = profile.waterTemperatureSource!.configuredLocation!;
      return {
        cityId: profile.cityId,
        sourceId: profile.waterTemperatureSource!.sourceId,
        gridRow: location.gridRow,
        gridColumn: location.gridColumn,
        latitude: location.latitude,
        longitude: location.longitude,
        modelBathymetryM: location.modelBathymetryM,
        mask: 1,
        depthIndex: location.depthIndex,
        verticalSelection: location.verticalSelection,
        gridCellStatus: location.gridCellStatus,
        referencePoint: location.referencePoint,
        result: "pass_candidate",
      };
    }),
    limitations: [
      "A model surface cell is general harbor context, not a pier thermometer.",
      "The model cannot resolve pier-scale mixing, river plumes, depth, waves, ice, or access.",
      "Alpena remains in its own five-city archive cohort so Lake Huron cannot inherit a Lake Michigan timeline.",
    ],
    result: "pass",
  };
}

function calendarDates(year: number): string[] {
  const dates: string[] = [];
  for (
    let time = Date.UTC(year, 0, 1);
    time < Date.UTC(year + 1, 0, 1);
    time += 86_400_000
  ) dates.push(new Date(time).toISOString().slice(0, 10));
  return dates;
}

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
    fetchedAt: "2026-09-19T12:10:00.000Z",
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

function toCsv(rows: readonly Record<string, unknown>[]): string {
  return [
    Object.keys(rows[0]).join(","),
    ...rows.map((row) => Object.values(row).map(csvCell).join(",")),
  ].join("\n") + "\n";
}

function csvCell(value: unknown): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
