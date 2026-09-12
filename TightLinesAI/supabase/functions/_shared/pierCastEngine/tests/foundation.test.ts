import {
  assert,
  assertAlmostEquals,
  assertEquals,
  assertMatch,
} from "jsr:@std/assert";
import {
  aggregateCompleteDailyScore,
  buildPierCastCatalog,
  buildPierCastFiveDateWindows,
  calculatePierCastInstantOpportunity,
  combinePierCastOpportunity,
  evaluatePierCastSeasonalOpportunity,
  evaluateTemperatureSuitability,
  getPierCastCityProfile,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_CORE_SPECIES_IDS,
  PIER_CAST_FROZEN_CITY_IDS,
  PIER_CAST_FROZEN_COVERED_STRUCTURE_IDS,
  PIER_CAST_FROZEN_SPECIES_IDS,
  PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS,
  PIER_CAST_MONTHS,
  PIER_CAST_OPEN_WATER_NOTICE,
  PIER_CAST_RATING_DISCLOSURE,
  PIER_CAST_SPECIES_PROFILES,
  type PierCastMonth,
  pierCastOpenWaterNoticeApplies,
  type PierCastSeasonalOpportunityCurve,
  type PierCastSpeciesDailyCandidate,
  type PierCastTemperatureCurve,
  selectPierCastDailyHeadline,
  toFinFindrOpportunityRating,
  validatePierCastFoundation,
} from "../index.ts";

const provisionalCurve: PierCastTemperatureCurve = {
  curveId: "test_provisional_only",
  calibrationStatus: "provisional",
  acceptedDomainC: [5, 15],
  knots: [
    { temperatureC: 5, suitability: 0.2 },
    { temperatureC: 10, suitability: 0.8 },
    { temperatureC: 15, suitability: 0.4 },
  ],
};

const provisionalSeasonalCurve: PierCastSeasonalOpportunityCurve = {
  curveId: "test_seasonal_provisional_only",
  calibrationStatus: "provisional",
  knots: [
    { monthDay: "01-01", rating: 2 },
    { monthDay: "08-01", rating: 5 },
    { monthDay: "08-15", rating: 7 },
    { monthDay: "08-29", rating: 9 },
    { monthDay: "10-01", rating: 4 },
    { monthDay: "12-31", rating: 2 },
  ],
};

function evaluate(
  overrides: Partial<Parameters<typeof evaluateTemperatureSuitability>[0]> = {},
) {
  return evaluateTemperatureSuitability({
    ratingEnabled: true,
    mode: "review",
    monthEvidenceState: "sourced_biology",
    inputStatus: "valid",
    waterTemperatureC: 12.5,
    curve: provisionalCurve,
    ...overrides,
  });
}

Deno.test("PierCast foundation validates with every real rating disabled", () => {
  assertEquals(validatePierCastFoundation(), []);
  assertEquals(PIER_CAST_SPECIES_PROFILES.length, 13);
  assertEquals(PIER_CAST_CITY_PROFILES.length, 5);
  assert(PIER_CAST_SPECIES_PROFILES.every((profile) => !profile.ratingEnabled));
  const coreSpecies = new Set<string>(PIER_CAST_CORE_SPECIES_IDS);
  assert(
    PIER_CAST_SPECIES_PROFILES.every((profile) =>
      coreSpecies.has(profile.speciesId)
        ? profile.calibrationStatus === "provisional" &&
          profile.seasonalTemperatureCurves?.length === 1
        : profile.calibrationStatus === "not_calibrated" &&
          profile.seasonalTemperatureCurves === null
    ),
  );
  assert(PIER_CAST_CITY_PROFILES.every((city) => !city.publicEnabled));
  assert(
    PIER_CAST_CITY_PROFILES.every((city) =>
      city.waterTemperatureSource?.calibrationStatus === "provisional" &&
      city.waterTemperatureSource.configuredLocation?.gridCellStatus ===
        "candidate" &&
      city.waterTemperatureSource.fallbackPolicy === "unavailable"
    ),
  );
  assert(
    PIER_CAST_CITY_PROFILES.every((city) =>
      city.species.every((profile) =>
        !profile.ratingEnabled &&
        (coreSpecies.has(profile.speciesId)
          ? profile.seasonalOpportunityCurve?.calibrationStatus ===
            "provisional"
          : profile.seasonalOpportunityCurve === null)
      )
    ),
  );
});

Deno.test("PierCast v1 is frozen to five cities, four species, and seven covered structures", () => {
  assertEquals(
    PIER_CAST_CITY_PROFILES.map((city) => city.cityId),
    [...PIER_CAST_FROZEN_CITY_IDS],
  );
  assertEquals(PIER_CAST_CORE_SPECIES_IDS, PIER_CAST_FROZEN_SPECIES_IDS);
  assertEquals(
    PIER_CAST_CITY_PROFILES.flatMap((city) =>
      city.structures.filter((structure) =>
        structure.disposition === "candidate"
      )
        .map((structure) => structure.structureId)
    ),
    [...PIER_CAST_FROZEN_COVERED_STRUCTURE_IDS],
  );
  for (const city of PIER_CAST_CITY_PROFILES) {
    for (const speciesId of PIER_CAST_FROZEN_SPECIES_IDS) {
      const profile = city.species.find((candidate) =>
        candidate.speciesId === speciesId
      );
      assert(profile, `${city.cityId}:${speciesId} missing`);
      assertEquals(profile.inheritance, "candidate");
      assert(profile.seasonalOpportunityCurve);
    }
    for (
      const structure of city.structures.filter((candidate) =>
        candidate.disposition === "candidate"
      )
    ) {
      assertEquals(structure.accessStatus, "open_by_published_rules");
      assertEquals(structure.liveAccessStatus, "not_live_checked");
      assert(structure.accessRoute);
      assert(structure.accessEvidence.length > 0);
    }
  }
});

Deno.test("LMHOFS candidates freeze five unique surface grid cells", () => {
  const expected: Record<
    keyof typeof PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS,
    readonly [number, number, number, number]
  > = {
    ludington_mi: [235, 159, 43.95, -86.47],
    grand_haven_mi: [146, 180, 43.06, -86.26],
    manistee_mi: [265, 171, 44.25, -86.35],
    frankfort_elberta_mi: [303, 180, 44.63, -86.26],
    sheboygan_wi: [215, 37, 43.75, -87.69],
  };
  const cells = Object.entries(PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS);

  assertEquals(cells.length, 5);
  assertEquals(
    new Set(
      cells.map(([, location]) => `${location.gridRow}:${location.gridColumn}`),
    ).size,
    5,
  );
  for (const [cityId, location] of cells) {
    assertEquals(
      [
        location.gridRow,
        location.gridColumn,
        location.latitude,
        location.longitude,
      ],
      expected[cityId as keyof typeof expected],
    );
    assertEquals(location.depthIndex, 0);
    assertEquals(location.gridCellStatus, "candidate");
    assert(location.modelBathymetryM > 0);
    assert(location.referencePoint.distanceM <= 1500);
  }
});

Deno.test("LMHOFS candidate configuration matches the research artifact", async () => {
  const artifactUrl = new URL(
    "../../../../../docs/PierCast_LMHOFS_Sampling_Points.json",
    import.meta.url,
  );
  const artifact = JSON.parse(await Deno.readTextFile(artifactUrl)) as {
    status: string;
    operationalProbe: {
      forecastHoursChecked: number[];
    };
    cities: Array<{
      cityId: keyof typeof PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS;
      gridRow: number;
      gridColumn: number;
      latitude: number;
      longitude: number;
      wetMask: number;
      modelBathymetryM: number;
      probeTemperatureC: number[];
    }>;
  };

  assertEquals(artifact.status, "candidate_not_approved");
  assertEquals(artifact.operationalProbe.forecastHoursChecked, [
    1,
    24,
    72,
    120,
  ]);
  assertEquals(artifact.cities.length, 5);
  for (const city of artifact.cities) {
    const configured = PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS[city.cityId];
    assertEquals(city.wetMask, 1);
    assertEquals(
      [
        city.gridRow,
        city.gridColumn,
        city.latitude,
        city.longitude,
        city.modelBathymetryM,
      ],
      [
        configured.gridRow,
        configured.gridColumn,
        configured.latitude,
        configured.longitude,
        configured.modelBathymetryM,
      ],
    );
    assertEquals(city.probeTemperatureC.length, 4);
    assert(city.probeTemperatureC.every(Number.isFinite));
  }
});

Deno.test("every retained species has twelve explicit month contexts", () => {
  for (const profile of PIER_CAST_SPECIES_PROFILES) {
    assertEquals(Object.keys(profile.monthContexts), [...PIER_CAST_MONTHS]);
  }
  const contexts = PIER_CAST_SPECIES_PROFILES.flatMap((profile) =>
    Object.values(profile.monthContexts)
  );
  assertEquals(contexts.length, 156);
  assertEquals(
    contexts.filter((context) => context.evidenceState === "sourced_biology")
      .length,
    74,
  );
  assertEquals(
    contexts.filter((context) =>
      context.evidenceState === "proposed_regional_transfer"
    ).length,
    70,
  );
  assertEquals(
    contexts.filter((context) =>
      context.evidenceState === "absent_biology_evidence"
    ).length,
    12,
  );
});

Deno.test("engine species-month contexts match the reviewed research matrix", async () => {
  const matrixUrl = new URL(
    "../../../../../docs/PierCast_Species_Month_Biology_Matrix.csv",
    import.meta.url,
  );
  const lines = (await Deno.readTextFile(matrixUrl)).trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  const rows = lines.slice(1).map((line) =>
    Object.fromEntries(
      line.split(",").map((value, index) => [headers[index], value]),
    )
  );

  assertEquals(rows.length, 156);
  const seenKeys = new Set<string>();
  for (const row of rows) {
    const key = `${row.species_id}:${row.month}`;
    assert(!seenKeys.has(key), `Duplicate research matrix row: ${key}`);
    seenKeys.add(key);

    const profile = PIER_CAST_SPECIES_PROFILES.find((candidate) =>
      candidate.speciesId === row.species_id
    );
    assert(profile, `Unknown species in research matrix: ${row.species_id}`);
    assert(
      PIER_CAST_MONTHS.includes(row.month as PierCastMonth),
      `Unknown month in research matrix: ${row.month}`,
    );
    const context = profile.monthContexts[row.month as PierCastMonth];
    assertEquals(context.code, row.shared_biological_context, `${key} context`);
    assertEquals(
      context.evidenceState,
      row.month_evidence_state,
      `${key} evidence state`,
    );
    assertEquals(
      profile.evidenceIds.join(";"),
      row.evidence_ids,
      `${key} evidence IDs`,
    );
    assertEquals(
      row.production_ready,
      "false",
      `${key} must remain fail-closed`,
    );
  }
});

Deno.test("every configured evidence ID exists in the non-production research ledger", async () => {
  const ledgerUrl = new URL(
    "../../../../../docs/PierCast_Thermal_Evidence.json",
    import.meta.url,
  );
  const ledger = JSON.parse(await Deno.readTextFile(ledgerUrl)) as {
    records: Array<{ evidenceId: string; productionReady: boolean }>;
  };
  const evidenceIds = ledger.records.map((record) => record.evidenceId);
  assertEquals(evidenceIds.length, 32);
  assertEquals(new Set(evidenceIds).size, evidenceIds.length);
  assert(ledger.records.every((record) => record.productionReady === false));

  const evidenceIdSet = new Set(evidenceIds);
  for (const profile of PIER_CAST_SPECIES_PROFILES) {
    for (const evidenceId of profile.evidenceIds) {
      assert(
        evidenceIdSet.has(evidenceId),
        `${profile.speciesId} references missing evidence ${evidenceId}`,
      );
    }
  }
});

Deno.test("known construction and identity limitations stay encoded", () => {
  const grandHaven = getPierCastCityProfile("grand_haven_mi")!;
  const northPier = grandHaven.structures.find((structure) =>
    structure.structureId === "grand_haven_north_pier"
  )!;
  assertEquals(northPier.disposition, "excluded");
  assertEquals(northPier.accessStatus, "reported_closed");

  const manistee = getPierCastCityProfile("manistee_mi")!;
  const southBreakwater = manistee.structures.find((structure) =>
    structure.structureId === "manistee_south_breakwater"
  )!;
  assertEquals(southBreakwater.disposition, "excluded");
  assertEquals(southBreakwater.accessStatus, "reported_closed");

  const ludington = getPierCastCityProfile("ludington_mi")!;
  const stub = ludington.structures.find((structure) =>
    structure.structureId === "ludington_stub_pier"
  )!;
  assertEquals(stub.disposition, "unresolved");
});

Deno.test("public catalog is empty while review catalog exposes research candidates", () => {
  const publicCatalog = buildPierCastCatalog("public");
  const reviewCatalog = buildPierCastCatalog("review");
  assertEquals(publicCatalog.cities, []);
  assertEquals(reviewCatalog.cities.length, 5);
  assertEquals(reviewCatalog.ratingName, "FinFindr Opportunity Rating");
  assertEquals(reviewCatalog.ratingDisplayFormat, "X.X/10");
  assertEquals(
    reviewCatalog.formula,
    "clamp(1, 10, 1 + (seasonalRating - 1) * (0.30 + 0.75 * temperatureSuitability))",
  );
  assert(
    reviewCatalog.cities.every((city) =>
      city.releaseStatus === "research_only"
    ),
  );
  assertEquals(
    reviewCatalog.cities.find((city) => city.cityId === "sheboygan_wi")
      ?.tentative,
    true,
  );
});

Deno.test("disabled real profiles cannot produce a temperature rating", () => {
  const result = evaluate({ ratingEnabled: false });
  assertEquals(result, {
    status: "unavailable",
    suitability: null,
    reasonCodes: ["rating_not_enabled"],
  });
});

Deno.test("missing, stale, partial, and unreviewed inputs are unavailable", () => {
  const cases = [
    ["missing", "temperature_missing"],
    ["stale", "temperature_stale"],
    ["partial_horizon", "temperature_partial_horizon"],
    ["unreviewed_representation", "temperature_representation_unreviewed"],
  ] as const;
  for (const [inputStatus, reason] of cases) {
    const result = evaluate({ inputStatus });
    assertEquals(result.status, "unavailable");
    assertEquals(result.reasonCodes, [reason]);
  }
});

Deno.test("unsupported month biology remains unavailable", () => {
  const result = evaluate({ monthEvidenceState: "absent_biology_evidence" });
  assertEquals(result.status, "unavailable");
  assertEquals(result.reasonCodes, ["month_biology_unsupported"]);
});

Deno.test("public mode rejects a merely provisional calibration", () => {
  const result = evaluate({ mode: "public" });
  assertEquals(result.status, "unavailable");
  assertEquals(result.reasonCodes, ["calibration_not_approved"]);
});

Deno.test("review mode interpolates inside a valid provisional curve", () => {
  const result = evaluate();
  assertEquals(result.status, "available");
  if (result.status !== "available") return;
  assertAlmostEquals(result.suitability, 0.6);
  assertEquals(result.calibrationStatus, "provisional");
});

Deno.test("out-of-domain temperatures are unavailable and never clamped", () => {
  const cold = evaluate({ waterTemperatureC: 4.9 });
  const warm = evaluate({ waterTemperatureC: 15.1 });
  assertEquals(cold.status, "unavailable");
  assertEquals(warm.status, "unavailable");
  assertEquals(cold.reasonCodes, ["temperature_out_of_domain"]);
  assertEquals(warm.reasonCodes, ["temperature_out_of_domain"]);
});

Deno.test("invalid curves fail closed", () => {
  const result = evaluate({
    curve: {
      ...provisionalCurve,
      knots: [
        { temperatureC: 5, suitability: 0.2 },
        { temperatureC: 5, suitability: 0.8 },
        { temperatureC: 15, suitability: 0.4 },
      ],
    },
  });
  assertEquals(result.status, "unavailable");
  assertEquals(result.reasonCodes, ["temperature_curve_invalid"]);
});

Deno.test("public score copy is explicitly a FinFindr opportunity rating", () => {
  const rating = toFinFindrOpportunityRating(7.6);
  assertEquals(rating.status, "available");
  if (rating.status !== "available") return;
  assertEquals(rating.displayScore, 7.6);
  assertEquals(rating.displayText, "7.6/10");
  assertEquals(rating.label, "Good");
  assertEquals(rating.ratingName, "FinFindr Opportunity Rating");
  assertMatch(
    PIER_CAST_RATING_DISCLOSURE,
    /not detected fish presence, fish counts, catch probabilities/,
  );
});

Deno.test("seasonal opportunity uses exact anchors and smooth daily interpolation", () => {
  const anchor = evaluatePierCastSeasonalOpportunity({
    ratingEnabled: true,
    mode: "review",
    localDate: "2026-08-15",
    curve: provisionalSeasonalCurve,
  });
  assertEquals(anchor.status, "available");
  if (anchor.status !== "available") return;
  assertEquals(anchor.rating, 7);

  const midpoint = evaluatePierCastSeasonalOpportunity({
    ratingEnabled: true,
    mode: "review",
    localDate: "2026-08-22",
    curve: provisionalSeasonalCurve,
  });
  assertEquals(midpoint.status, "available");
  if (midpoint.status !== "available") return;
  assertAlmostEquals(midpoint.rating, 8);
});

Deno.test("seasonal curve remains continuous across the year boundary", () => {
  const december31 = evaluatePierCastSeasonalOpportunity({
    ratingEnabled: true,
    mode: "review",
    localDate: "2026-12-31",
    curve: provisionalSeasonalCurve,
  });
  const january1 = evaluatePierCastSeasonalOpportunity({
    ratingEnabled: true,
    mode: "review",
    localDate: "2027-01-01",
    curve: provisionalSeasonalCurve,
  });
  assertEquals(december31.status, "available");
  assertEquals(january1.status, "available");
  if (december31.status !== "available" || january1.status !== "available") {
    return;
  }
  assertEquals(december31.rating, 2);
  assertEquals(january1.rating, 2);
});

Deno.test("seasonal interpolation handles leap day deterministically", () => {
  const curve: PierCastSeasonalOpportunityCurve = {
    curveId: "test_leap_interpolation",
    calibrationStatus: "provisional",
    knots: [
      { monthDay: "02-28", rating: 2 },
      { monthDay: "03-01", rating: 4 },
    ],
  };
  const leapDay = evaluatePierCastSeasonalOpportunity({
    ratingEnabled: true,
    mode: "review",
    localDate: "2028-02-29",
    curve,
  });
  assertEquals(leapDay.status, "available");
  if (leapDay.status !== "available") return;
  assertEquals(leapDay.rating, 3);
});

Deno.test("public mode rejects a provisional seasonal curve", () => {
  const result = evaluatePierCastSeasonalOpportunity({
    ratingEnabled: true,
    mode: "public",
    localDate: "2026-08-15",
    curve: provisionalSeasonalCurve,
  });
  assertEquals(result, {
    status: "unavailable",
    rating: null,
    reasonCodes: ["seasonal_curve_not_approved"],
  });
});

Deno.test("bounded temperature formula softens penalties and limits synergy", () => {
  const perfectTemperature = calculatePierCastInstantOpportunity({
    seasonalRating: 2,
    temperatureSuitability: 1,
  });
  assertEquals(perfectTemperature.status, "available");
  if (perfectTemperature.status !== "available") return;
  assertAlmostEquals(perfectTemperature.temperatureModifier, 1.05);
  assertAlmostEquals(perfectTemperature.rating.score, 2.05);
  assertEquals(perfectTemperature.rating.displayText, "2.1/10");

  const unsuitableTemperature = calculatePierCastInstantOpportunity({
    seasonalRating: 10,
    temperatureSuitability: 0,
  });
  assertEquals(unsuitableTemperature.status, "available");
  if (unsuitableTemperature.status !== "available") return;
  assertAlmostEquals(unsuitableTemperature.temperatureModifier, 0.3);
  assertEquals(unsuitableTemperature.rating.displayText, "3.7/10");

  const limitedTemperature = calculatePierCastInstantOpportunity({
    seasonalRating: 9,
    temperatureSuitability: 0.45,
  });
  assertEquals(limitedTemperature.status, "available");
  if (limitedTemperature.status !== "available") return;
  assertAlmostEquals(limitedTemperature.temperatureModifier, 0.6375);
  assertAlmostEquals(limitedTemperature.rating.score, 6.1);
  assertEquals(limitedTemperature.rating.displayText, "6.1/10");

  const neutralTemperature = calculatePierCastInstantOpportunity({
    seasonalRating: 8,
    temperatureSuitability: (1 - 0.3) / 0.75,
  });
  assertEquals(neutralTemperature.status, "available");
  if (neutralTemperature.status !== "available") return;
  assertAlmostEquals(neutralTemperature.temperatureModifier, 1);
  assertAlmostEquals(neutralTemperature.rating.score, 8);

  const exceptional = calculatePierCastInstantOpportunity({
    seasonalRating: 10,
    temperatureSuitability: 1,
  });
  assertEquals(exceptional.status, "available");
  if (exceptional.status !== "available") return;
  assertEquals(exceptional.rating.score, 10);
  assertEquals(exceptional.rating.displayText, "10.0/10");
});

Deno.test("combined opportunity preserves unavailable temperature reasons", () => {
  const seasonal = evaluatePierCastSeasonalOpportunity({
    ratingEnabled: true,
    mode: "review",
    localDate: "2026-08-15",
    curve: provisionalSeasonalCurve,
  });
  const result = combinePierCastOpportunity({
    seasonal,
    temperature: {
      status: "unavailable",
      suitability: null,
      reasonCodes: ["temperature_stale"],
    },
  });
  assertEquals(result.status, "unavailable");
  assertEquals(result.reasonCodes, ["temperature_stale"]);
});

Deno.test("seasonal and temperature evaluations combine into one traceable X.X/10 rating", () => {
  const seasonal = evaluatePierCastSeasonalOpportunity({
    ratingEnabled: true,
    mode: "review",
    localDate: "2026-08-22",
    curve: provisionalSeasonalCurve,
  });
  const temperature = evaluate({ waterTemperatureC: 12.5 });
  const result = combinePierCastOpportunity({ seasonal, temperature });
  assertEquals(result.status, "available");
  if (result.status !== "available") return;
  assertEquals(result.seasonalRating, 8);
  assertAlmostEquals(result.temperatureSuitability, 0.6);
  assertAlmostEquals(result.temperatureModifier, 0.75);
  assertAlmostEquals(result.rating.score, 6.25);
  assertEquals(result.rating.displayText, "6.3/10");
  assertEquals(
    result.formulaVersion,
    "seasonal-opportunity-bounded-temperature-v2",
  );
});

Deno.test("winter open-water notice is explicit and limited to valid January-March dates", () => {
  assert(pierCastOpenWaterNoticeApplies("2026-01-01"));
  assert(pierCastOpenWaterNoticeApplies("2026-03-31"));
  assert(!pierCastOpenWaterNoticeApplies("2026-04-01"));
  assert(!pierCastOpenWaterNoticeApplies("2026-02-31"));
  assertMatch(PIER_CAST_OPEN_WATER_NOTICE, /does not assess ice thickness/);
});

Deno.test("invalid numeric scores cannot escape the shared rubric", () => {
  for (const score of [Number.NaN, 0.99, 10.01]) {
    const rating = toFinFindrOpportunityRating(score);
    assertEquals(rating.status, "unavailable");
    assertEquals(rating.score, null);
  }
});

Deno.test("daily score uses duration-weighted interval integration", () => {
  const aggregate = aggregateCompleteDailyScore({
    requestedInterval: {
      start: "2026-09-09T04:00:00.000Z",
      end: "2026-09-09T08:00:00.000Z",
    },
    segments: [
      {
        start: "2026-09-09T04:00:00.000Z",
        end: "2026-09-09T05:00:00.000Z",
        scoreAtStart: 2,
        scoreAtEnd: 2,
      },
      {
        start: "2026-09-09T05:00:00.000Z",
        end: "2026-09-09T08:00:00.000Z",
        scoreAtStart: 8,
        scoreAtEnd: 8,
      },
    ],
  });
  assertEquals(aggregate.coverage.status, "complete");
  assertEquals(aggregate.biological.status, "available");
  if (aggregate.biological.status !== "available") return;
  assertEquals(aggregate.biological.score, 6.5);
  assertEquals(aggregate.biological.displayScore, 6.5);
  assertEquals(aggregate.biological.displayText, "6.5/10");
});

Deno.test("daily aggregation refuses gaps instead of averaging samples", () => {
  const aggregate = aggregateCompleteDailyScore({
    requestedInterval: {
      start: "2026-09-09T04:00:00.000Z",
      end: "2026-09-09T08:00:00.000Z",
    },
    segments: [
      {
        start: "2026-09-09T04:00:00.000Z",
        end: "2026-09-09T05:00:00.000Z",
        scoreAtStart: 9,
        scoreAtEnd: 9,
      },
      {
        start: "2026-09-09T07:00:00.000Z",
        end: "2026-09-09T08:00:00.000Z",
        scoreAtStart: 9,
        scoreAtEnd: 9,
      },
    ],
  });
  assertEquals(aggregate.biological.status, "unavailable");
  assertEquals(aggregate.coverage.status, "partial");
  assertEquals(aggregate.coverage.fraction, 0.5);
});

Deno.test("overlapping intervals fail closed even when union coverage is complete", () => {
  const aggregate = aggregateCompleteDailyScore({
    requestedInterval: {
      start: "2026-09-09T04:00:00.000Z",
      end: "2026-09-09T08:00:00.000Z",
    },
    segments: [
      {
        start: "2026-09-09T04:00:00.000Z",
        end: "2026-09-09T07:00:00.000Z",
        scoreAtStart: 5,
        scoreAtEnd: 5,
      },
      {
        start: "2026-09-09T06:00:00.000Z",
        end: "2026-09-09T08:00:00.000Z",
        scoreAtStart: 5,
        scoreAtEnd: 5,
      },
    ],
  });
  assertEquals(aggregate.biological.status, "unavailable");
  if (aggregate.biological.status === "available") return;
  assertEquals(aggregate.biological.reasonCodes, [
    "biological_interval_invalid",
  ]);
});

function candidate(
  speciesId: "chinook_salmon" | "coho_salmon" | "steelhead",
  score: number,
  promotion: "eligible" | "limited" | "blocked" | "unknown" = "eligible",
): PierCastSpeciesDailyCandidate {
  return {
    speciesId,
    biological: toFinFindrOpportunityRating(score),
    coverage: {
      status: "complete" as const,
      coveredIntervals: [],
      fraction: 1,
      reasonCodes: [],
    },
    targetingEligibility: "eligible" as const,
    promotion: { status: promotion, reasonCodes: [] },
  };
}

Deno.test("headline is the highest eligible species with a stable tie break", () => {
  const result = selectPierCastDailyHeadline([
    candidate("steelhead", 7.2),
    candidate("coho_salmon", 8.1),
    candidate("chinook_salmon", 8.1),
  ]);
  assertEquals(result.drivingSpeciesId, "chinook_salmon");
  assertEquals(result.headlineMode, "daily_outlook");
  assertEquals(result.overall.status, "available");
});

Deno.test("blocked top biology stays the headline and is not bypassed", () => {
  const result = selectPierCastDailyHeadline([
    candidate("chinook_salmon", 9, "blocked"),
    candidate("coho_salmon", 8, "eligible"),
  ]);
  assertEquals(result.drivingSpeciesId, "chinook_salmon");
  assertEquals(result.headlineMode, "biological_only");
  assertEquals(result.promotion.status, "blocked");
});

Deno.test("partial coverage and unknown targeting cannot drive a headline", () => {
  const partial = candidate("chinook_salmon", 9);
  partial.coverage.status = "partial";
  partial.coverage.fraction = 0.5;
  const unknown = candidate("coho_salmon", 8);
  unknown.targetingEligibility = "unknown";
  const result = selectPierCastDailyHeadline([partial, unknown]);
  assertEquals(result.drivingSpeciesId, null);
  assertEquals(result.headlineMode, "unavailable");
  assertEquals(result.overall.status, "unavailable");
});

Deno.test("five-date window starts at evaluation time and ends after day four", () => {
  const windows = buildPierCastFiveDateWindows({
    evaluationTime: "2026-09-09T16:30:00.000Z",
    timezone: "America/Detroit",
  });
  assertEquals(windows.length, 5);
  assertEquals(windows[0].localDate, "2026-09-09");
  assertEquals(windows[0].scope, "remaining_day");
  assertEquals(windows[0].requestedInterval.start, "2026-09-09T16:30:00.000Z");
  assertEquals(windows[4].localDate, "2026-09-13");
  assertEquals(windows[4].requestedInterval.end, "2026-09-14T04:00:00.000Z");
});

Deno.test("spring daylight-saving date has 23 elapsed hours", () => {
  const windows = buildPierCastFiveDateWindows({
    evaluationTime: "2026-03-07T17:00:00.000Z",
    timezone: "America/Detroit",
  });
  const transitionDay = windows.find((window) =>
    window.localDate === "2026-03-08"
  )!;
  assertEquals(transitionDay.scope, "full_day");
  assertEquals(
    Date.parse(transitionDay.requestedInterval.end) -
      Date.parse(transitionDay.requestedInterval.start),
    23 * 60 * 60 * 1000,
  );
});

Deno.test("fall daylight-saving date has 25 elapsed hours", () => {
  const windows = buildPierCastFiveDateWindows({
    evaluationTime: "2026-10-31T16:00:00.000Z",
    timezone: "America/Detroit",
  });
  const transitionDay = windows.find((window) =>
    window.localDate === "2026-11-01"
  )!;
  assertEquals(transitionDay.scope, "full_day");
  assertEquals(
    Date.parse(transitionDay.requestedInterval.end) -
      Date.parse(transitionDay.requestedInterval.start),
    25 * 60 * 60 * 1000,
  );
});
