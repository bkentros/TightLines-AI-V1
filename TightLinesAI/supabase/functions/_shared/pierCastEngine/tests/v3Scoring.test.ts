import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import {
  analyzePierCastV3SeasonalContinuity,
  archivePierCastV3ShadowForecast,
  buildPierCastV3ReviewOutlook,
  buildPierCastV3ShadowForecastPayload,
  calculatePierCastV3Opportunity,
  combinePierCastV3LmhofsBatches,
  evaluatePierCastV3ModePotentials,
  getPierCastSpeciesProfile,
  getPierCastV3PairCalibration,
  getPierCastV3RegulationNotices,
  getPierCastV3SpeciesIdsForCity,
  getPierCastV3TemperatureCurve,
  PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_FIVE_CITY_PROFILES,
  PIER_CAST_LAKE_HURON_CITY_PROFILES,
  PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
  PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
  PIER_CAST_V3_CITY_IDS,
  PIER_CAST_V3_FORECAST_COUNT,
  PIER_CAST_V3_FORMULA_VERSION,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  PIER_CAST_V3_PAIR_COUNT,
  PIER_CAST_V3_PUBLIC_ENABLED,
  PIER_CAST_V3_RATING_ENABLED,
  PIER_CAST_V3_SPECIES_IDS,
  PIER_CAST_WISCONSIN_CITY_PROFILES,
  type PierCastCityProfile,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
  pierCastV3RegulationClosureApplies,
  readLatestCoherentPierCastV3SourceCohorts,
  validatePierCastV3OpportunityMode,
} from "../index.ts";
import { projectPublicV3Outlook } from "../../../pier-cast/publicV3.ts";
import {
  cityReportOnly,
  leaderboardOnly,
} from "../../../pier-cast/reportAccess.ts";

const ISSUED_AT = "2026-09-14T12:00:00.000Z";
type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

Deno.test("v3 generated config is the complete core and secondary handoff", () => {
  assertEquals(PIER_CAST_V3_RATING_ENABLED, false);
  assertEquals(PIER_CAST_V3_PUBLIC_ENABLED, false);
  assertEquals(PIER_CAST_V3_PAIR_CALIBRATIONS.length, 254);
  assertEquals(PIER_CAST_V3_PAIR_COUNT, 254);
  assertEquals(
    PIER_CAST_V3_PAIR_CALIBRATIONS.reduce(
      (sum, pair) => sum + pair.modes.length,
      0,
    ),
    451,
  );
  assertEquals(
    new Set(PIER_CAST_V3_PAIR_CALIBRATIONS.map((pair) => pair.pairKey)).size,
    254,
  );
  assertEquals(PIER_CAST_V3_SPECIES_IDS.length, 18);
  assertEquals(PIER_CAST_V3_PAIR_CALIBRATIONS.some((pair) => String(pair.speciesId) === "bluegill"), false);
  for (const pair of PIER_CAST_V3_PAIR_CALIBRATIONS) {
    assertEquals(
      getPierCastV3PairCalibration(pair.cityId, pair.speciesId)?.pairKey,
      pair.pairKey,
    );
    assertEquals(pair.ratingEnabled, false);
    assertEquals(pair.publicEnabled, false);
    assertEquals(pair.promotionEligible, false);
    for (const mode of pair.modes) {
      assertEquals(validatePierCastV3OpportunityMode(mode), []);
    }
  }
});

Deno.test("v3 private review exposes the exact 254-pair city roster", () => {
  const expected: Record<string, number> = {
    ludington_mi: 10,
    grand_haven_mi: 14,
    manistee_mi: 12,
    frankfort_elberta_mi: 7,
    sheboygan_wi: 4,
    port_washington_wi: 4,
    milwaukee_wi: 4,
    racine_wi: 5,
    kenosha_wi: 5,
    harbor_beach_mi: 7,
    oscoda_mi: 10,
    port_sanilac_mi: 11,
    two_rivers_wi: 4,
    kewaunee_wi: 5,
    algoma_wi: 4,
    manitowoc_wi: 6,
    waukegan_il: 5,
    chicago_il: 9,
    michigan_city_in: 7,
    muskegon_mi: 13,
    whitehall_mi: 12,
    alpena_mi: 11,
    st_joseph_mi: 7,
    south_haven_mi: 13,
    holland_mi: 10,
    lexington_mi: 14,
    harrisville_mi: 5,
    pentwater_mi: 8,
    rogers_city_mi: 7,
    tawas_city_mi: 9,
    charlevoix_mi: 7,
    caseville_mi: 5,
  };
  for (const cityId of PIER_CAST_V3_CITY_IDS) {
    assertEquals(
      getPierCastV3SpeciesIdsForCity(cityId).length,
      expected[cityId],
    );
  }
  for (
    const speciesId of [
      "burbot",
      "white_perch",
      "white_bass",
    ] as const
  ) {
    const profile = getPierCastSpeciesProfile(speciesId);
    const curve = getPierCastV3TemperatureCurve(speciesId);
    assert(profile);
    assert(curve);
    assertEquals(profile.seasonalTemperatureCurves?.[0].curveId, curve.curveId);
    assertEquals(profile.ratingEnabled, false);
  }
});

Deno.test("research seasonal corrections preserve fall pier opportunity without a blanket uplift", () => {
  const ideal = (cityId: string, speciesId: string, localDate: string) => {
    const pair = PIER_CAST_V3_PAIR_CALIBRATIONS.find((candidate) =>
      candidate.cityId === cityId && candidate.speciesId === speciesId
    );
    assert(pair);
    const modes = evaluatePierCastV3ModePotentials({
      localDate,
      modes: pair.modes,
    });
    const result = calculatePierCastV3Opportunity({
      modes,
      temperatureSuitability: 1,
      allowDisabledConfiguration: true,
    });
    assertEquals(result.status, "available");
    assert(result.score !== null);
    return result.score;
  };

  assert(ideal("milwaukee_wi", "coho_salmon", "2027-09-16") >= 6.8);
  assert(ideal("milwaukee_wi", "chinook_salmon", "2027-09-16") > 6);
  assert(ideal("port_washington_wi", "chinook_salmon", "2027-09-16") > 6);
  assert(ideal("grand_haven_mi", "steelhead", "2027-05-15") > 4.5);
  assert(ideal("frankfort_elberta_mi", "chinook_salmon", "2027-07-15") > 7);
  assert(ideal("frankfort_elberta_mi", "coho_salmon", "2027-08-25") > 6);
  for (
    const cityId of [
      "ludington_mi",
      "grand_haven_mi",
      "manistee_mi",
      "frankfort_elberta_mi",
    ]
  ) {
    const october = ideal(cityId, "lake_trout", "2027-10-25");
    const january = ideal(cityId, "lake_trout", "2027-01-20");
    assert(october > january);
    assert(october <= 4);
  }
  assertEquals(ideal("grand_haven_mi", "smallmouth_bass", "2027-06-25"), 7);
  assert(ideal("grand_haven_mi", "freshwater_drum", "2027-09-16") > 6);
  assert(ideal("grand_haven_mi", "yellow_perch", "2027-09-16") > 6);
  assert(ideal("grand_haven_mi", "channel_catfish", "2027-09-16") > 6);
  assert(ideal("grand_haven_mi", "largemouth_bass", "2027-08-15") > 6);
  assert(ideal("manistee_mi", "yellow_perch", "2027-04-15") > 6);
  assert(ideal("manistee_mi", "yellow_perch", "2027-06-15") > 6);
  assertEquals(ideal("milwaukee_wi", "coho_salmon", "2027-01-15"), 1);
});

Deno.test("Grand Haven November method restriction is visible without closing the fishery", () => {
  const november = getPierCastV3RegulationNotices({
    cityId: "grand_haven_mi",
    speciesId: "lake_whitefish",
    localDate: "2027-11-15",
  });
  assertEquals(november.length, 1);
  assertEquals(november[0].reasonCode, "special_tackle_restriction");
  assertEquals(
    getPierCastV3RegulationNotices({
      cityId: "grand_haven_mi",
      speciesId: "lake_whitefish",
      localDate: "2027-12-01",
    }),
    [],
  );
  assertEquals(
    pierCastV3RegulationClosureApplies({
      localDate: "2027-11-15",
      pair: getPierCastV3PairCalibration(
        "grand_haven_mi",
        "lake_whitefish",
      )!,
    }),
    false,
  );
});

Deno.test("v3 is bounded, monotonic, non-stacking, and reaches a researched 10", () => {
  let evaluated = 0;
  for (const pair of PIER_CAST_V3_PAIR_CALIBRATIONS) {
    for (let day = 0; day < 365; day += 1) {
      const localDate = new Date(Date.UTC(2027, 0, 1 + day)).toISOString()
        .slice(0, 10);
      const modes = evaluatePierCastV3ModePotentials({
        localDate,
        modes: pair.modes,
      });
      assertEquals(modes.length, pair.modes.length);
      let previous = 0;
      for (const temperatureSuitability of [0, 0.25, 0.5, 0.75, 1]) {
        const result = calculatePierCastV3Opportunity({
          modes,
          temperatureSuitability,
          allowDisabledConfiguration: true,
        });
        assertEquals(result.status, "available");
        if (result.status !== "available") continue;
        assert(result.score >= 1 && result.score <= 10);
        assert(result.score >= previous);
        assert(result.score <= result.activeMode.seasonalPotential + 1e-10);
        assert(
          result.activeMode.seasonalPotential <=
            result.activeMode.fisheryStrength + 1e-10,
        );
        const summedPotential = modes.reduce(
          (sum, mode) => sum + mode.seasonalPotential,
          0,
        );
        assert(result.score <= summedPotential);
        previous = result.score;
        evaluated += 1;
      }
    }
  }
  assertEquals(evaluated, 254 * 365 * 5);

  const reference = getPierCastV3PairCalibration("manistee_mi", "steelhead")!;
  const modes = evaluatePierCastV3ModePotentials({
    localDate: "2027-10-28",
    modes: reference.modes,
  });
  const ideal = calculatePierCastV3Opportunity({
    modes,
    temperatureSuitability: 1,
    allowDisabledConfiguration: true,
  });
  assertEquals(ideal.status, "available");
  if (ideal.status === "available") assertEquals(ideal.score, 10);
  assertEquals(
    calculatePierCastV3Opportunity({
      modes: [{
        ...modes[0],
        fisheryStrength: 10.1,
        seasonalPotential: 10.1,
      }],
      temperatureSuitability: 1,
      allowDisabledConfiguration: true,
    }).status,
    "unavailable",
  );
  assertEquals(
    calculatePierCastV3Opportunity({
      modes,
      temperatureSuitability: 1,
      allowDisabledConfiguration: false,
    }).status,
    "unavailable",
  );
});

Deno.test("v3 enforces the Wisconsin yellow-perch closure as unavailable", () => {
  for (const cityId of ["racine_wi", "kenosha_wi", "waukegan_il"] as const) {
    const pair = getPierCastV3PairCalibration(cityId, "yellow_perch")!;
    assertEquals(
      pierCastV3RegulationClosureApplies({
        localDate: "2027-05-01",
        pair,
      }),
      true,
    );
    assertEquals(
      pierCastV3RegulationClosureApplies({
        localDate: "2027-06-15",
        pair,
      }),
      true,
    );
    assertEquals(
      pierCastV3RegulationClosureApplies({
        localDate: "2027-06-16",
        pair,
      }),
      false,
    );
  }
});

Deno.test("v3 enforces Michigan lake-trout seasons without suppressing open winter fisheries", () => {
  for (
    const cityId of ["frankfort_elberta_mi", "oscoda_mi"] as const
  ) {
    const pair = getPierCastV3PairCalibration(cityId, "lake_trout")!;
    assertEquals(
      pierCastV3RegulationClosureApplies({ localDate: "2027-09-30", pair }),
      false,
    );
    assertEquals(
      pierCastV3RegulationClosureApplies({ localDate: "2027-10-01", pair }),
      true,
    );
    assertEquals(
      pierCastV3RegulationClosureApplies({ localDate: "2027-12-31", pair }),
      true,
    );
    assertEquals(
      pierCastV3RegulationClosureApplies({ localDate: "2028-01-01", pair }),
      false,
    );
  }
  for (
    const cityId of [
      "ludington_mi",
      "grand_haven_mi",
      "manistee_mi",
      "harbor_beach_mi",
      "port_sanilac_mi",
      "chicago_il",
      "kewaunee_wi",
    ] as const
  ) {
    const pair = getPierCastV3PairCalibration(cityId, "lake_trout")!;
    assertEquals(
      pierCastV3RegulationClosureApplies({ localDate: "2027-11-15", pair }),
      false,
    );
  }
});

Deno.test("v3 outlook never publishes a biological score inside the perch closure", () => {
  const closedIssue = "2027-05-01T12:00:00.000Z";
  const closed = buildPierCastV3ReviewOutlook({
    batch: combinePierCastV3LmhofsBatches(
      batch(PIER_CAST_CITY_PROFILES, closedIssue),
      batch(PIER_CAST_WISCONSIN_CITY_PROFILES, closedIssue),
      batch(PIER_CAST_LAKE_HURON_CITY_PROFILES, closedIssue),
      batch(PIER_CAST_FIVE_CITY_PROFILES, closedIssue),
      batch(PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES, closedIssue),
      batch(PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES, closedIssue),
      batch(PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES, closedIssue),
    ),
    evaluationTime: "2027-05-01T12:15:00.000Z",
  });
  for (const cityId of ["racine_wi", "kenosha_wi", "waukegan_il"] as const) {
    const city = closed.cities.find((candidate) =>
      candidate.cityId === cityId
    )!;
    const perch = city.dates[0].species.find((candidate) =>
      candidate.speciesId === "yellow_perch"
    )!;
    assertEquals(perch.biological.status, "unavailable");
    assert(
      perch.timeWindows.every((slot) =>
        slot.biological.status === "unavailable"
      ),
    );
    assert(perch.reasonCodes.includes("species_regulation_closed"));
  }

  const openIssue = "2027-06-16T12:00:00.000Z";
  const open = buildPierCastV3ReviewOutlook({
    batch: combinePierCastV3LmhofsBatches(
      batch(PIER_CAST_CITY_PROFILES, openIssue),
      batch(PIER_CAST_WISCONSIN_CITY_PROFILES, openIssue),
      batch(PIER_CAST_LAKE_HURON_CITY_PROFILES, openIssue),
      batch(PIER_CAST_FIVE_CITY_PROFILES, openIssue),
      batch(PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES, openIssue),
      batch(PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES, openIssue),
      batch(PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES, openIssue),
    ),
    evaluationTime: "2027-06-16T12:15:00.000Z",
  });
  for (const cityId of ["racine_wi", "kenosha_wi", "waukegan_il"] as const) {
    const city = open.cities.find((candidate) => candidate.cityId === cityId)!;
    const perch = city.dates[0].species.find((candidate) =>
      candidate.speciesId === "yellow_perch"
    )!;
    assertEquals(perch.biological.status, "available");
  }
});

Deno.test("v3 recurring availability is continuous across the year seam", () => {
  for (const pair of PIER_CAST_V3_PAIR_CALIBRATIONS) {
    const end = evaluatePierCastV3ModePotentials({
      localDate: "2026-12-31",
      modes: pair.modes,
    });
    const start = evaluatePierCastV3ModePotentials({
      localDate: "2027-01-01",
      modes: pair.modes,
    });
    assertEquals(end.length, start.length);
    for (let index = 0; index < end.length; index += 1) {
      assert(
        Math.abs(
          end[index].seasonalAvailability - start[index].seasonalAvailability,
        ) <= 0.03,
      );
    }
  }
});

Deno.test("v3 seasonal curves enforce reviewed daily continuity and explain displayed turns", () => {
  const reports = [2027, 2028].flatMap((year) =>
    PIER_CAST_V3_PAIR_CALIBRATIONS.map((pair) =>
      analyzePierCastV3SeasonalContinuity({ pair, year })
    )
  );
  const issues = reports.flatMap((report) => report.issues);
  assertEquals(issues, []);
  assertEquals(reports.length, 508);
  assert(
    reports.every((report) => report.openDailyComparisonCount >= 250),
    "Every pair must retain a substantial open-season continuity sample after regulation closures.",
  );
  assert(reports.some((report) => report.modeHandoffReversalCount > 0));
  assert(reports.some((report) => report.knotReversalCount > 0));

  const manisteeCoho = getPierCastV3PairCalibration(
    "manistee_mi",
    "coho_salmon",
  )!;
  const displayed = [24, 25, 26, 27, 28].map((day) => {
    const modes = evaluatePierCastV3ModePotentials({
      localDate: `2027-09-${day}`,
      modes: manisteeCoho.modes,
    });
    return Number(
      Math.max(...modes.map((mode) => mode.seasonalPotential)).toFixed(1),
    );
  });
  assertEquals(displayed, [6.8, 6.9, 7.1, 7.2, 7.3]);

  const primarySpecies = new Set([
    "coho_salmon",
    "chinook_salmon",
    "atlantic_salmon",
    "steelhead",
    "brown_trout",
    "lake_trout",
    "freshwater_drum",
  ]);
  const manisteePrimaryPairs = PIER_CAST_V3_PAIR_CALIBRATIONS.filter((pair) =>
    pair.cityId === "manistee_mi" && primarySpecies.has(pair.speciesId)
  );
  const dailyLeaders = [24, 25, 26, 27, 28].map((day) =>
    manisteePrimaryPairs.map((pair) => ({
      speciesId: pair.speciesId,
      seasonalPotential: Math.max(
        ...evaluatePierCastV3ModePotentials({
          localDate: `2027-09-${day}`,
          modes: pair.modes,
        }).map((mode) => mode.seasonalPotential),
      ),
    })).sort((left, right) =>
      right.seasonalPotential - left.seasonalPotential ||
      left.speciesId.localeCompare(right.speciesId)
    )[0]
  );
  assertEquals(
    dailyLeaders.map((leader) => leader.speciesId),
    [
      "chinook_salmon",
      "chinook_salmon",
      "coho_salmon",
      "coho_salmon",
      "coho_salmon",
    ],
  );
  assertEquals(
    dailyLeaders.map((leader) => Number(leader.seasonalPotential.toFixed(1))),
    [7.1, 7.0, 7.1, 7.2, 7.3],
  );
});

Deno.test("v3 thirty-two-city outlook requires one coherent issue and stays blocked", () => {
  const primary = batch(PIER_CAST_CITY_PROFILES);
  const expansion = batch(PIER_CAST_WISCONSIN_CITY_PROFILES);
  const lakeHuron = batch(PIER_CAST_LAKE_HURON_CITY_PROFILES);
  const fiveCity = batch(PIER_CAST_FIVE_CITY_PROFILES);
  const chicagoAlpena = batch(PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES);
  const stJosephHarrisville = batch(PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES);
  const pentwaterCaseville = batch(PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES);
  const combined = combinePierCastV3LmhofsBatches(
    primary,
    expansion,
    lakeHuron,
    fiveCity,
    chicagoAlpena,
    stJosephHarrisville,
    pentwaterCaseville,
  );
  const outlook = buildPierCastV3ReviewOutlook({
    batch: combined,
    evaluationTime: "2026-09-14T12:15:00.000Z",
  });
  assertEquals(outlook.formulaVersion, PIER_CAST_V3_FORMULA_VERSION);
  assertEquals(outlook.mode, "v3_shadow_review");
  assertEquals(outlook.source.cityCount, 32);
  assertEquals(outlook.source.sampleCount, 3872);
  assertEquals(outlook.cities.length, 32);
  assertEquals(outlook.promotion.status, "blocked");
  assertEquals(outlook.cities.every((city) => city.dates.length === 5), true);
  const publicOutlook = projectPublicV3Outlook(outlook);
  const publicLeaderboard = leaderboardOnly(publicOutlook, { maxCities: 32 });
  const publicReport = cityReportOnly(publicOutlook, "ludington_mi");
  assertEquals(publicOutlook.mode, "public_research");
  assertEquals(publicOutlook.previewOnly, false);
  assertEquals(publicOutlook.cities.length, 32);
  assertEquals(publicLeaderboard.cities.length, 32);
  assertEquals(publicReport.cities.length, 1);
  assertEquals(publicReport.cities[0].dates.length, 5);
  assertEquals(
    outlook.cities.every((city) =>
      city.dates.every((date) =>
        date.species.length ===
          getPierCastV3SpeciesIdsForCity(city.cityId).length &&
        date.species.every((species) =>
          species.biological.status === "available" &&
          species.timeWindows.length === 4 &&
          species.timeWindows.every((slot, index) =>
            slot.slotIndex === index
          ) &&
          species.previewMode === "disabled_shadow_only" &&
          species.configurationRatingEnabled === false &&
          species.publicEnabled === false &&
          species.promotion.status === "blocked"
        )
      )
    ),
    true,
  );

  const mismatched = structuredClone(expansion);
  mismatched.issuedAt = "2026-09-14T06:00:00.000Z";
  assertThrows(
    () =>
      combinePierCastV3LmhofsBatches(
        primary,
        mismatched,
        lakeHuron,
        fiveCity,
        chicagoAlpena,
        stJosephHarrisville,
        pentwaterCaseville,
      ),
    Error,
    "same-issue",
  );
});

Deno.test("a complete 18-hour-old owner cycle still ranks thirty-two cities", () => {
  const primary = batch(PIER_CAST_CITY_PROFILES);
  const expansion = batch(PIER_CAST_WISCONSIN_CITY_PROFILES);
  const lakeHuron = batch(PIER_CAST_LAKE_HURON_CITY_PROFILES);
  const fiveCity = batch(PIER_CAST_FIVE_CITY_PROFILES);
  const chicagoAlpena = batch(PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES);
  const stJosephHarrisville = batch(PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES);
  const pentwaterCaseville = batch(PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES);
  primary.cycleAgeHours = 18;
  expansion.cycleAgeHours = 18;
  lakeHuron.cycleAgeHours = 18;
  fiveCity.cycleAgeHours = 18;
  chicagoAlpena.cycleAgeHours = 18;
  stJosephHarrisville.cycleAgeHours = 18;
  pentwaterCaseville.cycleAgeHours = 18;
  const outlook = buildPierCastV3ReviewOutlook({
    batch: combinePierCastV3LmhofsBatches(
      primary,
      expansion,
      lakeHuron,
      fiveCity,
      chicagoAlpena,
      stJosephHarrisville,
      pentwaterCaseville,
    ),
    evaluationTime: new Date(Date.parse(ISSUED_AT) + 18 * 3_600_000)
      .toISOString(),
  });
  assertEquals(outlook.source.cycleAgeHours, 18);
  assertEquals(outlook.cities.length, 32);
  assertEquals(
    outlook.cities.filter((city) =>
      city.dates[0]?.headline.overall.status === "available"
    ).length,
    32,
  );
});

Deno.test("v3 source selection bridges staggered fresh archive cycles without mixing issues", async () => {
  const primary00 = batch(
    PIER_CAST_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const primary06 = batch(
    PIER_CAST_CITY_PROFILES,
    "2026-09-15T06:00:00.000Z",
  );
  const expansion00 = batch(
    PIER_CAST_WISCONSIN_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const lakeHuron00 = batch(
    PIER_CAST_LAKE_HURON_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const fiveCity00 = batch(
    PIER_CAST_FIVE_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const chicagoAlpena00 = batch(
    PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const stJosephHarrisville00 = batch(
    PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const pentwaterCaseville00 = batch(
    PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  let primaryReads = 0;
  let expansionReads = 0;
  const cohorts = await readLatestCoherentPierCastV3SourceCohorts({
    database: { rpc: () => Promise.resolve({ data: null, error: null }) },
    now: new Date("2026-09-15T12:40:00.000Z"),
    readPrimary: (_database, at) => {
      primaryReads += 1;
      return Promise.resolve(
        at.toISOString() === "2026-09-15T00:00:00.000Z" ? primary00 : primary06,
      );
    },
    readExpansion: () => {
      expansionReads += 1;
      return Promise.resolve(expansion00);
    },
    readLakeHuron: () => Promise.resolve(lakeHuron00),
    readFiveCity: () => Promise.resolve(fiveCity00),
    readChicagoAlpena: () => Promise.resolve(chicagoAlpena00),
    readStJosephHarrisville: () => Promise.resolve(stJosephHarrisville00),
    readPentwaterCaseville: () => Promise.resolve(pentwaterCaseville00),
  });

  assert(cohorts);
  assertEquals(cohorts.issuedAt, "2026-09-15T00:00:00.000Z");
  assertEquals(cohorts.primary.issuedAt, cohorts.expansion.issuedAt);
  assertEquals(cohorts.primary.issuedAt, cohorts.lakeHuron.issuedAt);
  assertEquals(cohorts.primary.issuedAt, cohorts.fiveCity.issuedAt);
  assertEquals(cohorts.primary.issuedAt, cohorts.chicagoAlpena.issuedAt);
  assertEquals(cohorts.primary.issuedAt, cohorts.stJosephHarrisville.issuedAt);
  assertEquals(cohorts.primary.issuedAt, cohorts.pentwaterCaseville.issuedAt);
  assertEquals(cohorts.usedCommonCycleFallback, true);
  assertEquals(primaryReads, 2);
  assertEquals(expansionReads, 1);
});

Deno.test("v3 source selection fails closed when no common fresh cycle exists", async () => {
  const primary06 = batch(
    PIER_CAST_CITY_PROFILES,
    "2026-09-15T06:00:00.000Z",
  );
  const expansion00 = batch(
    PIER_CAST_WISCONSIN_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const lakeHuron00 = batch(
    PIER_CAST_LAKE_HURON_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const fiveCity00 = batch(
    PIER_CAST_FIVE_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const chicagoAlpena00 = batch(
    PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const stJosephHarrisville00 = batch(
    PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const pentwaterCaseville00 = batch(
    PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
    "2026-09-15T00:00:00.000Z",
  );
  const cohorts = await readLatestCoherentPierCastV3SourceCohorts({
    database: { rpc: () => Promise.resolve({ data: null, error: null }) },
    now: new Date("2026-09-15T12:40:00.000Z"),
    readPrimary: (_database, at) =>
      Promise.resolve(
        at.toISOString() === "2026-09-15T00:00:00.000Z" ? null : primary06,
      ),
    readExpansion: () => Promise.resolve(expansion00),
    readLakeHuron: () => Promise.resolve(lakeHuron00),
    readFiveCity: () => Promise.resolve(fiveCity00),
    readChicagoAlpena: () => Promise.resolve(chicagoAlpena00),
    readStJosephHarrisville: () => Promise.resolve(stJosephHarrisville00),
    readPentwaterCaseville: () => Promise.resolve(pentwaterCaseville00),
  });

  assertEquals(cohorts, null);
});

Deno.test("v3 archive freezes the exact 1270-row pair manifest", async () => {
  const combined = combinePierCastV3LmhofsBatches(
    batch(PIER_CAST_CITY_PROFILES),
    batch(PIER_CAST_WISCONSIN_CITY_PROFILES),
    batch(PIER_CAST_LAKE_HURON_CITY_PROFILES),
    batch(PIER_CAST_FIVE_CITY_PROFILES),
    batch(PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES),
    batch(PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES),
    batch(PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES),
  );
  const outlook = buildPierCastV3ReviewOutlook({
    batch: combined,
    evaluationTime: "2026-09-14T12:15:00.000Z",
  });
  const payload = buildPierCastV3ShadowForecastPayload({
    outlook,
    batch: combined,
    ingestionSource: "fresh_archived_complete_cycle",
    engineVersion: "v3-test-engine",
  });
  assertEquals(payload.forecasts.length, PIER_CAST_V3_FORECAST_COUNT);
  assertEquals(PIER_CAST_V3_FORECAST_COUNT, 1270);
  assertEquals(new Set(payload.forecasts.map((row) => row.cityId)).size, 32);
  assertEquals(
    payload.forecasts.every((row) =>
      row.modeCalibrationId !== null && row.seasonalPotential !== null &&
      row.fisheryStrength !== null &&
      row.seasonalPotential <= row.fisheryStrength
    ),
    true,
  );
  let called = "";
  const result = await archivePierCastV3ShadowForecast({
    database: {
      rpc: (name) => {
        called = name;
        return Promise.resolve({
          data: {
            status: "committed",
            runId: crypto.randomUUID(),
            forecastCount: PIER_CAST_V3_FORECAST_COUNT,
          },
          error: null,
        });
      },
    },
    outlook,
    batch: combined,
    ingestionSource: "fresh_archived_complete_cycle",
    engineVersion: "v3-test-engine",
  });
  assertEquals(called, "commit_pier_cast_v3_shadow_forecast");
  assertEquals(result.forecastCount, PIER_CAST_V3_FORECAST_COUNT);
});

Deno.test("v3 species-expansion migration enforces the exact manifest and preserves historical counts", async () => {
  const sql = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260915234500_expand_pier_cast_v3_species_manifest.sql",
      import.meta.url,
    ),
  );
  assert(sql.includes("jsonb_array_length(p_forecasts)<>470"));
  assert(sql.includes("count(distinct item->>'cityId')"));
  assert(sql.includes("piercast_v3_expected_pairs"));
  assert(sql.includes("p_run->>'promotionStatus'<>'blocked'"));
  assert(sql.includes("auth.role()<>'service_role'"));
  assert(sql.includes("count(distinct(city_id,species_id))<>94"));
  assert(sql.includes("forecastCount',470"));
  assert(sql.includes("forecast_count in (180,280,350,470)"));
  assert(sql.includes("piercast-v3-twelve-city-species-expansion-v4"));

  const expectedPairsFunction = sql.match(
    /create or replace function public\.piercast_v3_expected_pairs\(\)[\s\S]*?\$\$;/,
  )?.[0];
  assert(expectedPairsFunction, "Expected-pairs SQL function was not found.");
  const sqlPairs = [...expectedPairsFunction.matchAll(
    /\('([a-z_]+)','([a-z_]+)'\)/g,
  )].map((match) => `${match[1]}/${match[2]}`).filter((pair) => !pair.endsWith("/bluegill")).sort();
  const generatedPairs = PIER_CAST_V3_PAIR_CALIBRATIONS
    .filter((pair) =>
      !PIER_CAST_FIVE_CITY_PROFILES.some((city) =>
        city.cityId === pair.cityId
      ) &&
      !PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES.some((city) =>
        city.cityId === pair.cityId
      ) &&
      !PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES.some((city) =>
        city.cityId === pair.cityId
      ) &&
      !PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES.some((city) =>
        city.cityId === pair.cityId
      )
    )
    .map((pair) => pair.pairKey).sort();
  assertEquals(sqlPairs, generatedPairs);
});

Deno.test("common-species audit version archives separately from historical v5 runs", async () => {
  const sql = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260917193000_pier_cast_v3_common_species_audit_v6.sql",
      import.meta.url,
    ),
  );
  assert(sql.includes("'piercast-v3-twelve-city-species-expansion-v4'"));
  assert(sql.includes("'piercast-v3-twelve-city-seasonal-research-v5'"));
  assert(sql.includes("'piercast-v3-twelve-city-common-species-audit-v6'"));
  assert(sql.includes("'pier-cast-opportunity-modes-v3-shadow-v1.4.0'"));
  assert(sql.includes("jsonb_array_length(p_forecasts)<>470"));
  assert(sql.includes("auth.role()<>'service_role'"));
  assert(sql.includes("p_run->>'promotionStatus'<>'blocked'"));
  assert(sql.includes("piercast_v3_expected_pairs()"));
});

Deno.test("five-city Pass 3 migration enforces the 17-city private manifest", async () => {
  const sql = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260918150000_pier_cast_five_city_private_pass3_v7.sql",
      import.meta.url,
    ),
  );
  assert(sql.includes("'piercast-v3-seventeen-city-five-city-pass3-v7'"));
  assert(sql.includes("'pier-cast-opportunity-modes-v3-shadow-v1.5.0'"));
  assert(sql.includes("jsonb_array_length(p_forecasts)<>590"));
  assert(
    sql.includes(
      "count(distinct (item->>'cityId',item->>'speciesId')) from jsonb_array_elements(p_forecasts)item)<>118",
    ),
  );
  assert(sql.includes("forecast_count in (180,280,350,470,590)"));
  assert(sql.includes("piercast-five-city-shadow-v1"));
  for (
    const establishedExpansionCity of [
      "port_washington_wi",
      "milwaukee_wi",
      "racine_wi",
      "kenosha_wi",
      "harbor_beach_mi",
      "oscoda_mi",
      "port_sanilac_mi",
    ]
  ) {
    assert(
      sql.includes(`when '${establishedExpansionCity}'`),
      `Migration must preserve ${establishedExpansionCity}'s archived grid cell.`,
    );
  }
  const expectedPairsFunction = sql.match(
    /create or replace function public\.piercast_v3_expected_pairs\(\)[\s\S]*?\$\$;/,
  )?.[0];
  assert(expectedPairsFunction);
  const sqlPairs = [...expectedPairsFunction.matchAll(
    /\('([a-z_]+)','([a-z_]+)'\)/g,
  )].map((match) => `${match[1]}/${match[2]}`).filter((pair) => !pair.endsWith("/bluegill")).sort();
  assertEquals(
    sqlPairs,
    PIER_CAST_V3_PAIR_CALIBRATIONS
      .filter((pair) =>
        !PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES.some((city) =>
          city.cityId === pair.cityId
        ) &&
        !PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES.some((city) =>
          city.cityId === pair.cityId
        ) &&
        !PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES.some((city) =>
          city.cityId === pair.cityId
        )
      )
      .map((pair) => pair.pairKey).sort(),
  );
});

Deno.test("Chicago-Alpena Pass 3 migration enforces the exact 22-city private manifest", async () => {
  const sql = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260919190000_pier_cast_alpena_species_correction_v9.sql",
      import.meta.url,
    ),
  );
  assert(sql.includes("'piercast-v3-twenty-two-city-chicago-alpena-pass3-v9'"));
  assert(sql.includes("'pier-cast-opportunity-modes-v3-shadow-v1.7.0'"));
  assert(sql.includes("jsonb_array_length(p_forecasts)<>865"));
  assert(sql.includes("jsonb_array_length(p_samples)<>605"));
  assert(
    sql.includes(
      "count(distinct (item->>'cityId',item->>'speciesId')) from jsonb_array_elements(p_forecasts)item)<>173",
    ),
  );
  assert(sql.includes("forecast_count in (180,280,350,470,590,845,865)"));
  assert(sql.includes("piercast-chicago-alpena-shadow-v1"));
  for (
    const cityId of PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES.map((city) =>
      city.cityId
    )
  ) {
    assert(sql.includes(`'${cityId}'`));
  }
  const expectedPairsFunction = sql.match(
    /create or replace function public\.piercast_v3_expected_pairs\(\)[\s\S]*?\$\$;/,
  )?.[0];
  assert(expectedPairsFunction);
  const sqlPairs = [...expectedPairsFunction.matchAll(
    /\('([a-z_]+)','([a-z_]+)'\)/g,
  )].map((match) => `${match[1]}/${match[2]}`).filter((pair) => !pair.endsWith("/bluegill")).sort();
  assertEquals(
    sqlPairs,
    PIER_CAST_V3_PAIR_CALIBRATIONS.filter((pair) =>
      !PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES.some((city) =>
        city.cityId === pair.cityId
      ) &&
      !PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES.some((city) =>
        city.cityId === pair.cityId
      )
    ).map((pair) => pair.pairKey).sort(),
  );
});

Deno.test("St. Joseph-Harrisville Pass 3 migration enforces the exact 27-city private manifest", async () => {
  const sql = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260919230000_pier_cast_st_joseph_harrisville_private_pass3_v10.sql",
      import.meta.url,
    ),
  );
  assert(sql.includes("'piercast-v3-twenty-seven-city-st-joseph-harrisville-pass3-v10'"));
  assert(sql.includes("'pier-cast-opportunity-modes-v3-shadow-v1.8.0'"));
  assert(sql.includes("jsonb_array_length(p_forecasts)<>1110"));
  assert(sql.includes("jsonb_array_length(p_samples)<>605"));
  assert(sql.includes("count(distinct (item->>'cityId',item->>'speciesId')) from jsonb_array_elements(p_forecasts)item)<>222"));
  assert(sql.includes("forecast_count in (180,280,350,470,590,845,865,1110)"));
  assert(sql.includes("piercast-st-joseph-harrisville-shadow-v1"));
  for (const cityId of PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES.map((city) => city.cityId)) {
    assert(sql.includes(`'${cityId}'`));
  }
  const expectedPairsFunction = sql.match(
    /create or replace function public\.piercast_v3_expected_pairs\(\)[\s\S]*?\$\$;/,
  )?.[0];
  assert(expectedPairsFunction);
  const sqlPairs = [...expectedPairsFunction.matchAll(/\('([a-z_]+)','([a-z_]+)'\)/g)]
    .map((match) => `${match[1]}/${match[2]}`).filter((pair) => !pair.endsWith("/bluegill")).sort();
  assertEquals(sqlPairs, PIER_CAST_V3_PAIR_CALIBRATIONS.filter((pair) =>
    !PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES.some((city) => city.cityId === pair.cityId)
  ).map((pair) => pair.pairKey).sort());

  const scheduleFix = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260920220000_pier_cast_st_joseph_harrisville_schedule_fix.sql",
      import.meta.url,
    ),
  );
  assert(scheduleFix.includes("'55 0,6,12,18 * * *'"));
  assert(scheduleFix.includes("pier-cast-st-joseph-harrisville-shadow-ingestion"));
});

function batch(
  profiles: readonly PierCastCityProfile[],
  issuedAt = ISSUED_AT,
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
