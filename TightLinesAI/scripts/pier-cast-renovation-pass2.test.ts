import assert from "node:assert/strict";
import test from "node:test";
import {
  PIER_CAST_CONDITIONS_FORMULA_VERSION,
  PIER_CAST_CONDITIONS_SCHEMA_VERSION,
  PIER_CAST_RANKING_VERSION,
} from "../lib/pierCastConditionsV4.ts";
import {
  getPierCastV4CityDefinition,
  getPierCastV4RegionalSeasonalProfile,
  getPierCastV4ThermalProfile,
  PIER_CAST_V4_CITY_DEFINITIONS,
  PIER_CAST_V4_MAX_LATITUDE_SHIFT_DAYS,
  PIER_CAST_V4_MAX_TIMING_DAYS_PER_DEGREE,
  PIER_CAST_V4_REGIONAL_SEASONAL_PROFILES,
  PIER_CAST_V4_THERMAL_PROFILES,
  validatePierCastV4RegionalProfile,
} from "../supabase/functions/_shared/pierCastEngine/config/conditionsV4.ts";
import {
  PIER_CAST_V3_CITY_IDS,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  PIER_CAST_V3_SPECIES_IDS,
} from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";
import {
  evaluatePierCastSeasonalOutlookV4,
  evaluatePierCastThermalMatchV4,
  validatePierCastV4ThermalProfile,
} from "../supabase/functions/_shared/pierCastEngine/scoring/conditionsV4.ts";
import {
  buildPierCastConditionsShadowComparisonV4,
  buildPierCastConditionsV4Outlook,
  type PierCastConditionsV4SourceOutlook,
  projectPierCastConditionsCityReportV4,
  projectPierCastConditionsLeaderboardV4,
} from "../supabase/functions/_shared/pierCastEngine/pipeline/conditionsV4.ts";
import type {
  PierCastCityId,
  PierCastSpeciesId,
} from "../supabase/functions/_shared/pierCastEngine/types.ts";
import type { PierCastV3ReviewOutlookResponse } from "../supabase/functions/_shared/pierCastEngine/pipeline/v3ReviewOutlook.ts";
import {
  readPierCastSavedReportV4,
} from "../supabase/functions/pier-cast/reportAccess.ts";

test("regional inventory covers every current city/species pair without a city profile lookup", () => {
  assert.equal(PIER_CAST_V4_CITY_DEFINITIONS.length, 32);
  assert.equal(
    new Set(PIER_CAST_V4_CITY_DEFINITIONS.map((city) => city.cityId)).size,
    32,
  );
  assert.deepEqual(
    PIER_CAST_V4_CITY_DEFINITIONS.map((city) => city.cityId).sort(),
    [...PIER_CAST_V3_CITY_IDS].sort(),
  );
  assert.equal(PIER_CAST_V4_THERMAL_PROFILES.length, 18);
  assert.deepEqual(
    PIER_CAST_V4_THERMAL_PROFILES.map((profile) => profile.speciesId).sort(),
    [...PIER_CAST_V3_SPECIES_IDS].sort(),
  );
  assert.ok(PIER_CAST_V4_REGIONAL_SEASONAL_PROFILES.length < 254);
  for (const pair of PIER_CAST_V3_PAIR_CALIBRATIONS) {
    const city = getPierCastV4CityDefinition(pair.cityId);
    assert.ok(city, pair.cityId);
    assert.ok(
      getPierCastV4RegionalSeasonalProfile({
        speciesId: pair.speciesId,
        lakeId: city.lakeId,
        basinId: city.basinId,
      }),
      pair.pairKey,
    );
    assert.ok(getPierCastV4ThermalProfile(pair.speciesId), pair.speciesId);
  }
});

test("all regional and thermal profiles are versioned, bounded, and valid", () => {
  for (const profile of PIER_CAST_V4_REGIONAL_SEASONAL_PROFILES) {
    assert.deepEqual(validatePierCastV4RegionalProfile(profile), []);
    assert.equal(
      profile.schemaVersion,
      "piercast-regional-seasonal-profile-v1",
    );
    assert.ok(
      Math.abs(profile.latitudeAdjustment.timingShiftDaysPerDegree) <=
        PIER_CAST_V4_MAX_TIMING_DAYS_PER_DEGREE,
    );
    assert.equal(
      profile.latitudeAdjustment.maximumAbsoluteShiftDays,
      PIER_CAST_V4_MAX_LATITUDE_SHIFT_DAYS,
    );
    assert.ok(profile.evidenceIds.length > 0);
    assert.match(profile.derivation.sourceCalibrationSha256, /^[a-f0-9]{64}$/);
    assert.deepEqual(profile.derivation.excludedInputs, ["fisheryStrength"]);
    assert.ok(profile.profileId.includes(
      profile.derivation.sourceCalibrationSha256.slice(0, 12),
    ));
  }
  for (const profile of PIER_CAST_V4_THERMAL_PROFILES) {
    assert.deepEqual(validatePierCastV4ThermalProfile(profile), []);
    assert.equal(profile.schemaVersion, "piercast-thermal-profile-v1");
    assert.ok(profile.optimumRangeC[0] <= profile.optimumRangeC[1]);
  }
});

test("every configured city/species evaluates on every day plus leap day", () => {
  let evaluations = 0;
  for (const pair of PIER_CAST_V3_PAIR_CALIBRATIONS) {
    const city = getPierCastV4CityDefinition(pair.cityId)!;
    const profile = getPierCastV4RegionalSeasonalProfile({
      speciesId: pair.speciesId,
      lakeId: city.lakeId,
      basinId: city.basinId,
    });
    for (let day = 0; day < 365; day += 1) {
      const localDate = new Date(Date.UTC(2027, 0, day + 1)).toISOString()
        .slice(0, 10);
      const result = evaluatePierCastSeasonalOutlookV4({
        profile,
        localDate,
        latitude: city.latitude,
      });
      assert.equal(result.status, "available", `${pair.pairKey}/${localDate}`);
      if (result.status === "available") {
        assert.ok(result.value >= 0 && result.value <= 1);
      }
      evaluations += 1;
    }
    assert.equal(
      evaluatePierCastSeasonalOutlookV4({
        profile,
        localDate: "2028-02-29",
        latitude: city.latitude,
      }).status,
      "available",
    );
  }
  assert.equal(evaluations, 254 * 365);
});

test("seasonal interpolation is continuous across month and year boundaries", () => {
  for (const profile of PIER_CAST_V4_REGIONAL_SEASONAL_PROFILES) {
    const values = [
      "2027-12-30",
      "2027-12-31",
      "2028-01-01",
      "2028-01-02",
      "2028-02-28",
      "2028-02-29",
      "2028-03-01",
    ].map((localDate) =>
      evaluatePierCastSeasonalOutlookV4({
        profile,
        localDate,
        latitude: profile.referenceLatitude,
      })
    ).map((read) => {
      assert.equal(read.status, "available");
      return read.status === "available" ? read.value : 0;
    });
    for (let index = 1; index < values.length; index += 1) {
      if (index === 4) continue;
      assert.ok(
        Math.abs(values[index]! - values[index - 1]!) <= 0.15,
        profile.profileId,
      );
    }
  }
});

test("thermal match is independent and missing or stale input never becomes Poor", () => {
  for (const profile of PIER_CAST_V4_THERMAL_PROFILES) {
    const [minimum, maximum] = profile.acceptedDomainC;
    const temperatures = [
      minimum,
      ...profile.knots.flatMap((knot, index) => {
        const next = profile.knots[index + 1];
        return next
          ? [knot.temperatureC, (knot.temperatureC + next.temperatureC) / 2]
          : [knot.temperatureC];
      }),
      maximum,
    ];
    for (const temperatureC of temperatures) {
      const result = evaluatePierCastThermalMatchV4({
        profile,
        temperatureC,
        validAt: "2026-09-27T12:00:00Z",
        inputStatus: "valid",
      });
      assert.equal(result.status, "available", profile.speciesId);
    }
    const optimum = evaluatePierCastThermalMatchV4({
      profile,
      temperatureC: profile.optimumRangeC[0],
      validAt: "2026-09-27T12:00:00Z",
      inputStatus: "valid",
    });
    assert.equal(optimum.status, "available");
    if (optimum.status === "available") {
      assert.equal(optimum.value, 1);
      assert.equal(optimum.distanceFromOptimumC, 0);
    }
  }
  for (const inputStatus of ["missing", "stale", "partial_horizon"] as const) {
    const result = evaluatePierCastThermalMatchV4({
      profile: getPierCastV4ThermalProfile("chinook_salmon"),
      temperatureC: inputStatus === "missing" ? null : 12,
      validAt: "2026-09-27T12:00:00Z",
      inputStatus,
    });
    assert.equal(result.status, "unavailable");
    assert.equal(result.band, null);
  }
  const chinook = getPierCastV4ThermalProfile("chinook_salmon")!;
  const outsideDomain = evaluatePierCastThermalMatchV4({
    profile: chinook,
    temperatureC: chinook.acceptedDomainC[1] + 0.01,
    validAt: "2026-09-27T12:00:00Z",
    inputStatus: "valid",
  });
  assert.equal(outsideDomain.status, "unavailable");
  assert.deepEqual(outsideDomain.reasonCodes, ["temperature_out_of_domain"]);
  assert.equal(outsideDomain.band, null);
});

test("first visit has no universal ranking and selected leaderboards contain one species", () => {
  const outlook = buildPierCastConditionsV4Outlook(sourceOutlook(
    [
      "frankfort_elberta_mi",
      "grand_haven_mi",
      "south_haven_mi",
    ],
    "2026-09-20",
    12,
  ));
  const firstVisit = projectPierCastConditionsLeaderboardV4(outlook, null);
  assert.equal(firstVisit.selectionRequired, true);
  assert.deepEqual(firstVisit.cities, []);
  assert.ok(firstVisit.targetSpecies.length > 0);
  assert.ok(
    firstVisit.targetSpecies.some((species) =>
      species.placement === "commonly_targeted_now"
    ),
  );

  const chinook = projectPierCastConditionsLeaderboardV4(
    outlook,
    "chinook_salmon",
  );
  assert.equal(chinook.selectionRequired, false);
  assert.ok(chinook.cities.length === 3);
  assert.ok(
    chinook.cities.every((city) =>
      city.speciesId === "chinook_salmon" && city.rank !== null &&
      city.localFisheryContext?.affectsRanking === false
    ),
  );
  assert.equal(chinook.cities[0]?.cityId, "grand_haven_mi");
});

test("Frankfort's northern fall window fades before the southern regional window", () => {
  const frankfort = seasonal(
    "frankfort_elberta_mi",
    "chinook_salmon",
    "2026-09-20",
  );
  const grandHaven = seasonal("grand_haven_mi", "chinook_salmon", "2026-09-20");
  assert.equal(frankfort.status, "available");
  assert.equal(grandHaven.status, "available");
  if (frankfort.status === "available" && grandHaven.status === "available") {
    assert.equal(frankfort.band, "good");
    assert.equal(grandHaven.band, "excellent");
    assert.ok(frankfort.value < grandHaven.value);
    assert.equal(frankfort.stage, "fading");
  }
});

test("regulatory closures block ranking without rewriting seasonal or thermal conditions", () => {
  const outlook = buildPierCastConditionsV4Outlook(sourceOutlook(
    ["frankfort_elberta_mi"],
    "2026-10-10",
    10,
  ));
  const lakeTrout = outlook.cities[0]!.species.find((species) =>
    species.speciesId === "lake_trout"
  )!;
  assert.equal(lakeTrout.targetingEligibility, "restricted");
  assert.equal(lakeTrout.rankingDisposition, "blocked");
  assert.equal(lakeTrout.seasonalOutlook.status, "available");
  assert.equal(lakeTrout.thermalMatch.status, "available");
  assert.ok(lakeTrout.reasonCodes.includes("targeting_restricted"));
});

test("city-local dates control seasonal evaluation across timezone boundaries", () => {
  const generatedAt = "2026-09-28T04:30:00.000Z";
  const outlook = buildPierCastConditionsV4Outlook(sourceOutlook(
    ["ludington_mi", "chicago_il"],
    null,
    12,
    generatedAt,
  ));
  const ludington = outlook.cities.find((city) =>
    city.cityId === "ludington_mi"
  )!;
  const chicago = outlook.cities.find((city) => city.cityId === "chicago_il")!;
  assert.equal(ludington.species[0]!.seasonalOutlook.localDate, "2026-09-28");
  assert.equal(chicago.species[0]!.seasonalOutlook.localDate, "2026-09-27");
});

test("city reports preserve all species and shadow comparison keeps old and new separate", () => {
  const source = sourceOutlook(
    ["frankfort_elberta_mi", "grand_haven_mi"],
    "2026-09-20",
    12,
  );
  const outlook = buildPierCastConditionsV4Outlook(source);
  const report = projectPierCastConditionsCityReportV4(
    outlook,
    "grand_haven_mi",
    "chinook_salmon",
  );
  assert.equal(report.schemaVersion, PIER_CAST_CONDITIONS_SCHEMA_VERSION);
  assert.equal(report.formulaVersion, PIER_CAST_CONDITIONS_FORMULA_VERSION);
  assert.equal(report.selectedSpeciesId, "chinook_salmon");
  assert.equal(report.species[0]!.speciesId, "chinook_salmon");
  assert.equal(report.species.length, 14);
  assert.equal(report.temperatureTimeline.length, 2);

  const legacy = legacyWithScores(source);
  const shadow = buildPierCastConditionsShadowComparisonV4(legacy, outlook);
  assert.equal(shadow.comparedPairCount, 21);
  assert.ok(shadow.comparablePairCount > 0);
  assert.ok(
    shadow.species.every((species) =>
      species.pairs.every((pair) =>
        "legacyScore" in pair &&
        "seasonalValue" in pair && "thermalValue" in pair
      )
    ),
  );
});

test("saved report migration adapts only complete legacy source data", () => {
  const source = sourceOutlook(["grand_haven_mi"], "2026-09-20", 12);
  const adapted = readPierCastSavedReportV4(source, "chinook_salmon");
  assert.equal(adapted.status, "available");
  if (adapted.status === "available") {
    assert.equal(adapted.envelope.migration.source, "adapted_legacy");
    assert.equal(adapted.envelope.reportKey, "grand_haven_mi:2026-09-20");
  }
  const noCurrentFrame = structuredClone(source);
  noCurrentFrame.cities[0]!.temperatureTimeline = [{
    validAt: "2026-09-21T03:00:00Z",
    temperatureC: 12,
  }];
  assert.equal(
    readPierCastSavedReportV4(noCurrentFrame, "chinook_salmon").status,
    "archived_legacy",
  );
  const archived = readPierCastSavedReportV4(
    { formulaVersion: "legacy", cities: [{ cityId: "grand_haven_mi" }] },
    "chinook_salmon",
  );
  assert.equal(archived.status, "archived_legacy");
  if (archived.status === "archived_legacy") {
    assert.equal(archived.refreshAvailable, true);
    assert.match(archived.reason, /without inventing|enough source data/i);
  }
});

test("v4 versions are additive and frozen for client rollout", () => {
  const outlook = buildPierCastConditionsV4Outlook(sourceOutlook(
    ["grand_haven_mi"],
    "2026-09-20",
    12,
  ));
  const leaderboard = projectPierCastConditionsLeaderboardV4(
    outlook,
    "chinook_salmon",
  );
  assert.equal(leaderboard.schemaVersion, "piercast-conditions-v4");
  assert.equal(
    leaderboard.formulaVersion,
    "seasonal-outlook-plus-thermal-match-v1",
  );
  assert.equal(leaderboard.rankingVersion, PIER_CAST_RANKING_VERSION);
});

function seasonal(
  cityId: PierCastCityId,
  speciesId: PierCastSpeciesId,
  localDate: string,
) {
  const city = getPierCastV4CityDefinition(cityId)!;
  return evaluatePierCastSeasonalOutlookV4({
    profile: getPierCastV4RegionalSeasonalProfile({
      speciesId,
      lakeId: city.lakeId,
      basinId: city.basinId,
    }),
    localDate,
    latitude: city.latitude,
  });
}

function sourceOutlook(
  cityIds: PierCastCityId[],
  localDate: string | null,
  temperatureC: number,
  generatedAt = localDate
    ? `${localDate}T12:15:00.000Z`
    : "2026-09-28T04:30:00.000Z",
): PierCastConditionsV4SourceOutlook {
  return {
    generatedAt,
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: new Date(Date.parse(generatedAt) - 15 * 60_000).toISOString(),
      fetchedAt: generatedAt,
      cycleAgeHours: 0.25,
      cityCount: cityIds.length,
      sampleCount: cityIds.length * 2,
    },
    cities: cityIds.map((cityId, cityIndex) => ({
      cityId,
      dates: localDate ? [{ localDate }] : [],
      temperatureTimeline: [0, 1].map((hour) => ({
        validAt: new Date(Date.parse(generatedAt) + hour * 3_600_000)
          .toISOString(),
        temperatureC: temperatureC + cityIndex * 0.1,
      })),
    })),
  };
}

function legacyWithScores(
  source: PierCastConditionsV4SourceOutlook,
): PierCastV3ReviewOutlookResponse {
  return {
    ...source,
    cities: source.cities.map((city, cityIndex) => ({
      ...city,
      dates: city.dates.map((date) => ({
        ...date,
        species: PIER_CAST_V3_PAIR_CALIBRATIONS.filter((pair) =>
          pair.cityId === city.cityId
        ).map((pair, speciesIndex) => ({
          speciesId: pair.speciesId,
          biological: {
            status: "available",
            score: 5 + cityIndex + speciesIndex / 100,
          },
        })),
      })),
    })),
  } as unknown as PierCastV3ReviewOutlookResponse;
}
