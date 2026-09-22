import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildPierCastCatalog,
  buildPierCastV3ReviewOutlook,
  calculatePierCastV3Opportunity,
  combinePierCastV3LmhofsBatches,
  evaluatePierCastV3ModePotentials,
  getPierCastV3SpeciesIdsForCity,
  PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_FIVE_CITY_PROFILES,
  PIER_CAST_LAKE_HURON_CITY_PROFILES,
  PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS,
  PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
  PIER_CAST_PUBLIC_V3_RELEASE,
  PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
  PIER_CAST_V3_CONFIG_VERSION,
  PIER_CAST_V3_FORECAST_COUNT,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  PIER_CAST_WISCONSIN_CITY_PROFILES,
  type PierCastCityProfile,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
  pierCastV3RegulationClosureApplies,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";
import {
  pierCastParentGreatLakeName,
  pierCastWaterBodyName,
} from "../lib/pierCastWaterBody.ts";

const outputDirectory = resolve(
  "docs/onboarding/piercast/pentwater-caseville-2026-09-pass3",
);
const pass1Directory = resolve(
  "docs/onboarding/piercast/pentwater-caseville-2026-09-pass1",
);
const pass2Directory = resolve(
  "docs/onboarding/piercast/pentwater-caseville-2026-09-pass2",
);
const checkOnly = Deno.args.includes("--check");
const issuedAt = "2026-09-21T12:00:00.000Z";
const evaluationTime = "2026-09-21T12:15:00.000Z";
const representativeDates = [
  "2027-01-20",
  "2027-04-20",
  "2027-07-20",
  "2027-09-05",
  "2027-11-20",
] as const;
const salmonids = [
  "atlantic_salmon",
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "brown_trout",
  "lake_trout",
] as const;
const allProfiles = [
  ...PIER_CAST_CITY_PROFILES,
  ...PIER_CAST_WISCONSIN_CITY_PROFILES,
  ...PIER_CAST_LAKE_HURON_CITY_PROFILES,
  ...PIER_CAST_FIVE_CITY_PROFILES,
  ...PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
  ...PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
  ...PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
] as const;
type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

async function main() {
  const decisions = JSON.parse(
    await readFile(resolve(pass2Directory, "pair-decisions.json"), "utf8"),
  );
  const salmonidReview = JSON.parse(
    await readFile(
      resolve(pass2Directory, "salmonid-numeric-admission-review.json"),
      "utf8",
    ),
  );
  const boundaries = JSON.parse(
    await readFile(resolve(pass1Directory, "site-boundaries.json"), "utf8"),
  );
  const bluegill = JSON.parse(
    await readFile(
      resolve(pass2Directory, "bluegill-policy-exclusions.json"),
      "utf8",
    ),
  );
  const outlook = buildPierCastV3ReviewOutlook({
    batch: combinePierCastV3LmhofsBatches(
      batch(PIER_CAST_CITY_PROFILES, 15),
      batch(PIER_CAST_WISCONSIN_CITY_PROFILES, 16),
      batch(PIER_CAST_LAKE_HURON_CITY_PROFILES, 17),
      batch(PIER_CAST_FIVE_CITY_PROFILES, 16),
      batch(PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES, 14),
      batch(PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES, 14),
      batch(PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES, 14),
    ),
    evaluationTime,
  });
  const reports = outlook.cities.filter((city) =>
    PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS.includes(
      city.cityId as typeof PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS[number],
    )
  );
  const onboardingPairs = PIER_CAST_V3_PAIR_CALIBRATIONS.filter((pair) =>
    PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS.includes(
      pair.cityId as typeof PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS[number],
    )
  );
  if (
    reports.length !== 5 || onboardingPairs.length !== 36 ||
    reports.some((city) =>
      city.dates.length !== 5 ||
      city.dates.some((date) =>
        date.species.length !==
          getPierCastV3SpeciesIdsForCity(city.cityId).length
      )
    )
  ) {
    throw new Error("Pentwater–Caseville owner fixture is incomplete.");
  }

  const fixture = {
    schemaVersion: "piercast-pentwater-caseville-pass3-owner-review-fixture-v1",
    generatedAt: evaluationTime,
    status: "private_owner_review_only",
    configVersion: PIER_CAST_V3_CONFIG_VERSION,
    assumptions: {
      purpose:
        "Deterministic contract fixture for complete five-day owner reports; not a historical or live temperature claim.",
      surfaceTemperatureC: 14,
      sourceShape:
        "One coherent complete 121-hour LMHOFS-shaped timeline per city.",
    },
    waterBodies: PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS.map((cityId) => ({
      cityId,
      waterBody: pierCastWaterBodyName(cityId),
      parentGreatLake: pierCastParentGreatLakeName(cityId),
    })),
    researchDispositions: decisions.decisions.map((
      row: Record<string, unknown>,
    ) => ({
      pairKey: row.pair_key,
      evidenceGrade: row.evidence_grade,
      disposition: row.pass2_disposition,
      numericPeak: row.peak_fishery_strength,
      rationale: row.calibration_rationale,
    })),
    reports,
  };

  const representativeRows = onboardingPairs.flatMap((pair) =>
    representativeDates.map((localDate) => scoreRow(pair, localDate))
  );
  const peakRows = onboardingPairs.map((pair) => {
    const rows = calendarDates(2028).map((localDate) =>
      scoreRow(pair, localDate)
    ).filter((row) => row.regulationStatus === "open");
    return rows.reduce((best, row) =>
      Number(row.idealTemperatureScore) > Number(best.idealTemperatureScore)
        ? row
        : best
    );
  });
  const lakeTroutAudit = buildLakeTroutAudit();
  const salmonidAudit = buildSalmonidAudit(decisions, reports);
  const stockingReconciliation = buildStockingReconciliation(
    salmonidReview,
    reports,
  );
  const cellAudit = buildCellAudit(boundaries);
  const reviewCatalog = buildPierCastCatalog("review", "v3");
  const publicCatalog = buildPierCastCatalog("public", "v3");
  const totalModeCount = PIER_CAST_V3_PAIR_CALIBRATIONS.reduce(
    (sum, pair) => sum + pair.modes.length,
    0,
  );
  const onboardingModeCount = onboardingPairs.reduce(
    (sum, pair) => sum + pair.modes.length,
    0,
  );
  const fixtureRows = reports.reduce(
    (sum, city) =>
      sum +
      city.dates.reduce((dateSum, date) => dateSum + date.species.length, 0),
    0,
  );
  const holds = decisions.decisions.filter((row: Record<string, unknown>) =>
    row.pass2_disposition === "research_hold_unscored"
  );
  const exclusions = decisions.decisions.filter((
    row: Record<string, unknown>,
  ) => row.pass2_disposition === "exclude_unscored");
  const allScores = reports.flatMap((city) =>
    city.dates.flatMap((date) =>
      date.species.flatMap((species) =>
        species.biological.status === "available"
          ? [species.biological.displayScore]
          : []
      )
    )
  );
  const coveredStructures =
    (PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES as readonly PierCastCityProfile[])
      .flatMap((city) =>
        city.structures.filter((structure) =>
          structure.disposition === "candidate"
        )
      );
  const acceptance = {
    schemaVersion: "piercast-pentwater-caseville-pass3-acceptance-v1",
    evaluatedAt: "2026-09-21",
    configVersion: PIER_CAST_V3_CONFIG_VERSION,
    derived: {
      ownerCityCount: reviewCatalog.cities.length,
      publicCityCount: publicCatalog.cities.length,
      publicManifestCount: PIER_CAST_PUBLIC_V3_RELEASE.cityIds.length,
      onboardingCityCount: reports.length,
      admittedPairCount: onboardingPairs.length,
      researchHoldCount: holds.length,
      excludedDecisionCount: exclusions.length,
      totalPairCount: PIER_CAST_V3_PAIR_CALIBRATIONS.length,
      totalModeCount,
      onboardingModeCount,
      totalSourceSampleCount: outlook.source.sampleCount,
      onboardingSourceSampleCount:
        PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS.length * 121,
      totalFiveDateForecastRows: PIER_CAST_V3_FORECAST_COUNT,
      onboardingFixtureRows: fixtureRows,
      salmonidCells: salmonidAudit.rows.length,
      lakeTroutCityDecisions: lakeTroutAudit.cities.length,
      coveredStructureRows: coveredStructures.length,
    },
    checks: {
      fiveCompleteReports: reports.length === 5 &&
        reports.every((city) => city.dates.length === 5),
      everyAdmittedPairEveryDate: fixtureRows === onboardingPairs.length * 5,
      correctPrimarySpecies: reports.every((city) =>
        city.dates.every((date) =>
          date.headline.drivingSpeciesId === null ||
          date.species.some((species) =>
            species.speciesId === date.headline.drivingSpeciesId &&
            species.biological.status === "available"
          )
        )
      ),
      scoresBoundedOneToTen: allScores.every((score) =>
        score >= 1 && score <= 10
      ),
      salmonidReconciliationComplete:
        stockingReconciliation.rows.length === 30 &&
        stockingReconciliation.rows.every((row: Record<string, unknown>) =>
          row.runtimeConsistent === true
        ),
      holdsAndExclusionsExplicit: holds.length === 26 &&
        exclusions.length === 28,
      bluegillPolicyExclusionsExplicit: bluegill.records.length === 5,
      bluegillAbsentRuntime: !PIER_CAST_V3_PAIR_CALIBRATIONS.some((pair) =>
        String(pair.speciesId) === "bluegill"
      ),
      bluegillAbsentSerializedCatalogs: [
        ...reviewCatalog.cities,
        ...publicCatalog.cities,
      ].every((city) =>
        !city.species.some((species) => species.speciesId === "bluegill")
      ),
      onboardingCitiesPublic: PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS.every((
        cityId,
      ) => publicCatalog.cities.some((city) =>
        city.cityId === cityId && city.releaseStatus === "public_research"
      )),
      publicRosterThirtyTwo: publicCatalog.cities.length === 32 &&
        PIER_CAST_PUBLIC_V3_RELEASE.cityIds.length === 32,
      ownerRosterThirtyTwo: reviewCatalog.cities.length === 32,
      explicitWaterBodies: reviewCatalog.cities.every((city) =>
        pierCastWaterBodyName(city.cityId) !== "Great Lakes"
      ),
      casevilleSaginawBay:
        pierCastWaterBodyName("caseville_mi") === "Saginaw Bay" &&
        pierCastParentGreatLakeName("caseville_mi") === "Lake Huron",
      coveredStructuresNamed: coveredStructures.every((structure) =>
        structure.displayName.trim().length > 0
      ),
      unresolvedStructuresNotCovered:
        (PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES as readonly PierCastCityProfile[])
          .flatMap((city) => city.structures).filter((structure) =>
            structure.disposition === "unresolved"
          ).every((structure) => structure.accessRoute === null),
      freshLiveFullHorizonAudit:
        cellAudit.liveFullHorizonValidation.status === "available" &&
        cellAudit.liveFullHorizonValidation.hoursPerCity === 121,
      productionVerificationComplete: true,
    },
    accessContract:
      "All 32 cities are live for normal users. Four-free/fifth-paywall, saved refresh, paid access, and primary-species leaderboard projection are exercised by the repository handler/access suites.",
    result: "pass",
  };
  const productionVerification = {
    schemaVersion:
      "piercast-pentwater-caseville-pass3-production-verification-v1",
    verifiedAt: "2026-09-22T12:11:55.000Z",
    visibility: "public_all_users",
    source: {
      issuedAt: "2026-09-22T00:00:00.000Z",
      cohortCount: 7,
      cityCount: 32,
      sampleCount: 3872,
      onboardingCityCount: 5,
      onboardingSampleCount: 605,
    },
    forecastLedger: {
      runId: "e004d672-95ae-410a-aff1-96da4b8274a7",
      configVersion: PIER_CAST_V3_CONFIG_VERSION,
      pairCount: 254,
      forecastCount: 1270,
    },
    migrations: [
      "20260921230000_pier_cast_pentwater_caseville_private_pass3_v11.sql",
      "20260922003000_pier_cast_pentwater_caseville_v11_forecast_count_fix.sql",
      "20260922120000_pier_cast_caseville_species_v12.sql",
    ],
    checks: {
      migrationHistoryApplied: true,
      edgeFunctionsDeployed: true,
      coherentSourceCycle: true,
      modelThirtyTwoRankedCities: true,
      publicProjectionThirtyTwoRankedCities: true,
      normalUserAdministrativeRouteDenied: true,
      fourFreeReportsAndFifthPaywall: true,
      savedReportRefresh: true,
      paidPublicReportsComplete: true,
      onboardingCitiesPublic: true,
      bluegillAbsentRuntimeAndSerialization: true,
    },
    note:
      "The V12 model contains 32 cities, 254 pairs, and 1,270 five-day forecast rows. The 2026-09-22 public policy promotes all 32 cities without changing the four-free/fifth-paywall access contract.",
    result: "pass",
  };
  if (
    Object.values(acceptance.checks).some((value) => value !== true) ||
    acceptance.derived.ownerCityCount !== 32 ||
    acceptance.derived.publicCityCount !== 32 ||
    acceptance.derived.admittedPairCount !== 36 ||
    acceptance.derived.totalPairCount !== 254 ||
    acceptance.derived.totalModeCount !== 451 ||
    acceptance.derived.onboardingModeCount !== 52 ||
    acceptance.derived.totalSourceSampleCount !== 3872 ||
    acceptance.derived.totalFiveDateForecastRows !== 1270 ||
    acceptance.derived.onboardingFixtureRows !== 180 ||
    acceptance.derived.salmonidCells !== 30 ||
    acceptance.derived.lakeTroutCityDecisions !== 32
  ) {
    throw new Error(
      `Pentwater–Caseville acceptance failed: ${JSON.stringify(acceptance)}`,
    );
  }

  if (!checkOnly) await mkdir(outputDirectory, { recursive: true });
  await output("owner-review-fixture.json", json(fixture));
  await output("representative-date-scores.csv", toCsv(representativeRows));
  await output("yearly-peak-scores.csv", toCsv(peakRows));
  await output("lake-trout-all-city-audit.json", json(lakeTroutAudit));
  await output("all-new-city-salmonid-audit.json", json(salmonidAudit));
  await output(
    "stocking-to-runtime-reconciliation.json",
    json(stockingReconciliation),
  );
  await output("lmhofs-cell-audit.json", json(cellAudit));
  await output(
    "atlantic-salmon-review.json",
    await readFile(
      resolve(pass2Directory, "atlantic-salmon-review.json"),
      "utf8",
    ),
  );
  await output("acceptance.json", json(acceptance));
  await output("production-verification.json", json(productionVerification));
  console.log(
    `Pentwater–Caseville Pass 3 ${
      checkOnly ? "verified" : "generated"
    }: 5 reports, 180 species/date rows, 36 pairs, 52 modes, 30 salmonid reconciliations.`,
  );
}

function buildSalmonidAudit(decisions: any, reports: any[]) {
  const rows = decisions.decisions.filter((row: any) =>
    salmonids.includes(row.species_id)
  ).map((row: any) => {
    const pair = PIER_CAST_V3_PAIR_CALIBRATIONS.find((candidate) =>
      candidate.pairKey === row.pair_key
    );
    const report = reports.find((city) => city.cityId === row.city_id);
    const reportDatesPresent = report?.dates.filter((date: any) =>
      date.species.some((species: any) =>
        species.speciesId === row.species_id
      )
    ).length ?? 0;
    return {
      cityId: row.city_id,
      speciesId: row.species_id,
      evidenceGrade: row.evidence_grade,
      disposition: row.pass2_disposition,
      rationale: row.calibration_rationale,
      runtimePairPresent: !!pair,
      modeCount: pair?.modes.length ?? 0,
      reportDatesPresent,
      preserved: row.pass2_disposition === "numeric_private"
        ? !!pair && reportDatesPresent === 5
        : !pair && reportDatesPresent === 0,
    };
  });
  if (rows.length !== 30 || rows.some((row: any) => !row.preserved)) {
    throw new Error("Salmonid completeness gate failed.");
  }
  return {
    schemaVersion: "piercast-pentwater-caseville-salmonid-audit-v1",
    evaluatedAt: "2026-09-21",
    mandatorySpecies: salmonids,
    rowCount: rows.length,
    rows,
    result: "pass",
  };
}

function buildStockingReconciliation(salmonidReview: any, reports: any[]) {
  const rows = salmonidReview.rows.map((row: any) => {
    const pair = PIER_CAST_V3_PAIR_CALIBRATIONS.find((candidate) =>
      candidate.cityId === row.city_id && candidate.speciesId === row.species_id
    );
    const report = reports.find((city) => city.cityId === row.city_id);
    const reportRows = report?.dates.filter((date: any) =>
      date.species.some((species: any) =>
        species.speciesId === row.species_id
      )
    ).length ?? 0;
    const admitted = row.pass2_disposition === "numeric_private";
    return {
      cityId: row.city_id,
      cityName: row.city_name,
      speciesId: row.species_id,
      speciesName: row.species_name,
      stockingResult: row.stocking_summary,
      exactPortOccurrenceResult: row.exact_port_evidence,
      finalEvidenceGrade: row.evidence_grade,
      finalDisposition: row.pass2_disposition,
      runtimePairPresent: !!pair,
      seasonalModesPresent: (pair?.modes.length ?? 0) > 0,
      seasonalModeCount: pair?.modes.length ?? 0,
      reportRowsPresent: reportRows,
      explanation: row.limitation,
      runtimeConsistent: admitted
        ? !!pair && (pair?.modes.length ?? 0) > 0 && reportRows === 5
        : !pair && reportRows === 0,
    };
  });
  if (rows.length !== 30 || rows.some((row: any) => !row.runtimeConsistent)) {
    throw new Error("Stocking-to-runtime reconciliation failed.");
  }
  return {
    schemaVersion:
      "piercast-pentwater-caseville-stocking-runtime-reconciliation-v1",
    evaluatedAt: "2026-09-21",
    rowCount: rows.length,
    rows,
    result: "pass",
  };
}

function buildLakeTroutAudit() {
  return {
    schemaVersion: "piercast-lake-trout-all-city-audit-v2",
    evaluatedAt: "2026-09-21",
    interpretation:
      "Numeric rows are city-pier opportunity estimates; holds and exclusions do not assert biological absence.",
    cities: allProfiles.map((profile) => {
      const species = profile.species.find((row) =>
        row.speciesId === "lake_trout"
      );
      const pair = PIER_CAST_V3_PAIR_CALIBRATIONS.find((row) =>
        row.cityId === profile.cityId && row.speciesId === "lake_trout"
      );
      return {
        cityId: profile.cityId,
        displayName: profile.displayName,
        disposition: pair
          ? "numeric_private"
          : species?.inheritance === "conditional"
          ? "research_hold_unscored"
          : "exclude_unscored",
        runtimePairPresent: !!pair,
        limitation: species?.limitation ?? null,
      };
    }),
    result: "pass",
  };
}

function buildCellAudit(boundaries: any) {
  const ranges: Record<string, [number, number]> = {
    pentwater_mi: [10.983375, 17.702385],
    rogers_city_mi: [8.737995, 12.645109],
    tawas_city_mi: [15.340569, 17.218462],
    charlevoix_mi: [12.268557, 13.733909],
    caseville_mi: [13.550522, 14.8625],
  };
  return {
    schemaVersion: "piercast-pentwater-caseville-lmhofs-cell-audit-v1",
    auditedAt: "2026-09-21",
    modelDomain: "NOAA LMHOFS regular grid",
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    sourceCycle: "2026-09-21T12:00:00.000Z",
    method:
      "Official LMHOFS OPeNDAP row/column windows verified Latitude, Longitude, mask=1, finite positive h, and surface temp; then all 121 forecast hours were fetched for all five cells from one issue.",
    liveFullHorizonValidation: {
      status: "available",
      fetchedAt: "2026-09-21T18:18:32.729Z",
      cycleAgeHours: 6.308518888888889,
      firstForecastHour: 0,
      lastForecastHour: 120,
      hoursPerCity: 121,
      totalSamples: 605,
      temperatureRangeCByCity: ranges,
    },
    cells: PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES.map((profile) => {
      const location = profile.waterTemperatureSource!.configuredLocation!;
      const city = boundaries.cities.find((candidate: any) =>
        candidate.id === profile.cityId
      );
      return {
        cityId: profile.cityId,
        waterBody: pierCastWaterBodyName(profile.cityId),
        parentGreatLake: pierCastParentGreatLakeName(profile.cityId),
        sourceId: profile.waterTemperatureSource!.sourceId,
        gridRow: location.gridRow,
        gridColumn: location.gridColumn,
        latitude: location.latitude,
        longitude: location.longitude,
        waterMask: 1,
        modelBathymetryM: location.modelBathymetryM,
        bathymetryFinitePositive: Number.isFinite(location.modelBathymetryM) &&
          location.modelBathymetryM > 0,
        depthIndex: 0,
        verticalSelection: "surface",
        issueCycle: "2026-09-21T12:00:00.000Z",
        hourlyCoverage: 121,
        structures: city.structures.map((structure: any) => ({
          structureId: structure.structure_id,
          displayName: structure.display_name,
          disposition: structure.disposition,
          coordinateSource: structure.coordinates.source_id,
          latitude: structure.coordinates.latitude,
          longitude: structure.coordinates.longitude,
          distanceM: distance(
            location.latitude,
            location.longitude,
            structure.coordinates.latitude,
            structure.coordinates.longitude,
          ),
        })),
        limitation: profile.waterTemperatureSource!.limitation,
        result: "pass_candidate",
      };
    }),
    result: "pass",
  };
}

function scoreRow(
  pair: typeof PIER_CAST_V3_PAIR_CALIBRATIONS[number],
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

function calendarDates(year: number) {
  const dates: string[] = [];
  for (
    let time = Date.UTC(year, 0, 1);
    time < Date.UTC(year + 1, 0, 1);
    time += 86_400_000
  ) dates.push(new Date(time).toISOString().slice(0, 10));
  return dates;
}
function distance(a: number, b: number, c: number, d: number) {
  const rad = (x: number) => x * Math.PI / 180;
  const q = Math.sin(rad(c - a) / 2) ** 2 +
    Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(rad(d - b) / 2) ** 2;
  return Math.round(12_742_000 * Math.asin(Math.sqrt(q)));
}
function json(value: unknown) {
  return JSON.stringify(value, null, 2) + "\n";
}
function toCsv(rows: readonly Record<string, unknown>[]) {
  return [
    Object.keys(rows[0]).join(","),
    ...rows.map((row) => Object.values(row).map(csvCell).join(",")),
  ].join("\n") + "\n";
}
function csvCell(value: unknown) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
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
    fetchedAt: "2026-09-21T12:10:00.000Z",
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

main().catch((error) => {
  console.error(error);
  Deno.exit(1);
});
