import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import {
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
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_LAKE_HURON_CITY_PROFILES,
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

const ISSUED_AT = "2026-09-14T12:00:00.000Z";
type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

Deno.test("v3 generated config is the complete core and secondary handoff", () => {
  assertEquals(PIER_CAST_V3_RATING_ENABLED, false);
  assertEquals(PIER_CAST_V3_PUBLIC_ENABLED, false);
  assertEquals(PIER_CAST_V3_PAIR_CALIBRATIONS.length, 94);
  assertEquals(PIER_CAST_V3_PAIR_COUNT, 94);
  assertEquals(
    PIER_CAST_V3_PAIR_CALIBRATIONS.reduce(
      (sum, pair) => sum + pair.modes.length,
      0,
    ),
    179,
  );
  assertEquals(
    new Set(PIER_CAST_V3_PAIR_CALIBRATIONS.map((pair) => pair.pairKey)).size,
    94,
  );
  assertEquals(PIER_CAST_V3_SPECIES_IDS.length, 19);
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

Deno.test("v3 species expansion exposes the exact 94-pair city roster", () => {
  const expected: Record<string, number> = {
    ludington_mi: 10,
    grand_haven_mi: 15,
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
      "bluegill",
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
  assertEquals(evaluated, 94 * 365 * 5);

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
      modes,
      temperatureSuitability: 1,
      allowDisabledConfiguration: false,
    }).status,
    "unavailable",
  );
});

Deno.test("v3 enforces the Wisconsin yellow-perch closure as unavailable", () => {
  for (const cityId of ["racine_wi", "kenosha_wi"] as const) {
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

Deno.test("v3 outlook never publishes a biological score inside the perch closure", () => {
  const closedIssue = "2027-05-01T12:00:00.000Z";
  const closed = buildPierCastV3ReviewOutlook({
    batch: combinePierCastV3LmhofsBatches(
      batch(PIER_CAST_CITY_PROFILES, closedIssue),
      batch(PIER_CAST_WISCONSIN_CITY_PROFILES, closedIssue),
      batch(PIER_CAST_LAKE_HURON_CITY_PROFILES, closedIssue),
    ),
    evaluationTime: "2027-05-01T12:15:00.000Z",
  });
  for (const cityId of ["racine_wi", "kenosha_wi"] as const) {
    const city = closed.cities.find((candidate) =>
      candidate.cityId === cityId
    )!;
    const perch = city.dates[0].species.find((candidate) =>
      candidate.speciesId === "yellow_perch"
    )!;
    assertEquals(perch.biological.status, "unavailable");
    assert(perch.reasonCodes.includes("species_regulation_closed"));
  }

  const openIssue = "2027-06-16T12:00:00.000Z";
  const open = buildPierCastV3ReviewOutlook({
    batch: combinePierCastV3LmhofsBatches(
      batch(PIER_CAST_CITY_PROFILES, openIssue),
      batch(PIER_CAST_WISCONSIN_CITY_PROFILES, openIssue),
      batch(PIER_CAST_LAKE_HURON_CITY_PROFILES, openIssue),
    ),
    evaluationTime: "2027-06-16T12:15:00.000Z",
  });
  for (const cityId of ["racine_wi", "kenosha_wi"] as const) {
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

Deno.test("v3 twelve-city outlook requires one coherent issue and stays blocked", () => {
  const primary = batch(PIER_CAST_CITY_PROFILES);
  const expansion = batch(PIER_CAST_WISCONSIN_CITY_PROFILES);
  const lakeHuron = batch(PIER_CAST_LAKE_HURON_CITY_PROFILES);
  const combined = combinePierCastV3LmhofsBatches(
    primary,
    expansion,
    lakeHuron,
  );
  const outlook = buildPierCastV3ReviewOutlook({
    batch: combined,
    evaluationTime: "2026-09-14T12:15:00.000Z",
  });
  assertEquals(outlook.formulaVersion, PIER_CAST_V3_FORMULA_VERSION);
  assertEquals(outlook.mode, "v3_shadow_review");
  assertEquals(outlook.source.cityCount, 12);
  assertEquals(outlook.source.sampleCount, 1452);
  assertEquals(outlook.cities.length, 12);
  assertEquals(outlook.promotion.status, "blocked");
  assertEquals(outlook.cities.every((city) => city.dates.length === 5), true);
  assertEquals(
    outlook.cities.every((city) =>
      city.dates.every((date) =>
        date.species.length ===
          getPierCastV3SpeciesIdsForCity(city.cityId).length &&
        date.species.every((species) =>
          species.biological.status === "available" &&
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
    () => combinePierCastV3LmhofsBatches(primary, mismatched, lakeHuron),
    Error,
    "same-issue",
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
  });

  assert(cohorts);
  assertEquals(cohorts.issuedAt, "2026-09-15T00:00:00.000Z");
  assertEquals(cohorts.primary.issuedAt, cohorts.expansion.issuedAt);
  assertEquals(cohorts.primary.issuedAt, cohorts.lakeHuron.issuedAt);
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
  const cohorts = await readLatestCoherentPierCastV3SourceCohorts({
    database: { rpc: () => Promise.resolve({ data: null, error: null }) },
    now: new Date("2026-09-15T12:40:00.000Z"),
    readPrimary: (_database, at) =>
      Promise.resolve(
        at.toISOString() === "2026-09-15T00:00:00.000Z" ? null : primary06,
      ),
    readExpansion: () => Promise.resolve(expansion00),
    readLakeHuron: () => Promise.resolve(lakeHuron00),
  });

  assertEquals(cohorts, null);
});

Deno.test("v3 archive freezes the exact 470-row pair manifest", async () => {
  const combined = combinePierCastV3LmhofsBatches(
    batch(PIER_CAST_CITY_PROFILES),
    batch(PIER_CAST_WISCONSIN_CITY_PROFILES),
    batch(PIER_CAST_LAKE_HURON_CITY_PROFILES),
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
  assertEquals(PIER_CAST_V3_FORECAST_COUNT, 470);
  assertEquals(new Set(payload.forecasts.map((row) => row.cityId)).size, 12);
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
  )].map((match) => `${match[1]}/${match[2]}`).sort();
  const generatedPairs = PIER_CAST_V3_PAIR_CALIBRATIONS.map((pair) =>
    pair.pairKey
  ).sort();
  assertEquals(sqlPairs, generatedPairs);
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
