import { strict as assert } from "node:assert";
import type {
  PierCastConditionsMapResponseV4,
  PierCastLeaderboardResponseV4,
} from "../../../../../lib/pierCastConditionsV4.ts";
import {
  pierCastLakeTroutV5NeedsMap,
  projectPierCastLakeTroutCityReportV5,
  projectPierCastLakeTroutStandingsV5,
} from "../../../../../lib/pierCastLakeTroutV5.ts";
import { PIER_CAST_LAKE_TROUT_V5_CANDIDATES } from "../config/lakeTroutV5.candidate.ts";

function board(generatedAt: string): PierCastLeaderboardResponseV4 {
  return {
    schemaVersion: "piercast-conditions-v4",
    formulaVersion: "seasonal-outlook-plus-thermal-match-v1",
    rankingVersion: "species-seasonal-band-then-thermal-v1",
    generatedAt,
    selectedSpeciesId: "lake_trout",
    selectionRequired: false,
    targetSpecies: [{
      speciesId: "lake_trout",
      displayName: "Lake Trout",
      placement: "all_species",
      bestSeasonalBand: null,
      availableCityCount: 0,
    }],
    cities: [],
    disclosure: "test",
  };
}

function map(generatedAt: string): PierCastConditionsMapResponseV4 {
  return {
    schemaVersion: "piercast-conditions-v4",
    formulaVersion: "seasonal-outlook-plus-thermal-match-v1",
    generatedAt,
    selectedSpeciesId: "lake_trout",
    selectionRequiredForMatch: false,
    targetSpecies: board(generatedAt).targetSpecies,
    cities: PIER_CAST_LAKE_TROUT_V5_CANDIDATES.map((candidate) => ({
      cityId: candidate.cityId,
      displayName: candidate.cityName,
      stateCode: candidate.cityId.endsWith("_wi")
        ? "WI"
        : candidate.cityId.endsWith("_il")
        ? "IL"
        : candidate.cityId.endsWith("_in")
        ? "IN"
        : "MI",
      lakeId: candidate.cityId.includes("harbor_beach") ||
          candidate.cityId.includes("caseville") ||
          candidate.cityId.includes("sanilac") ||
          candidate.cityId.includes("lexington") ||
          candidate.cityId.includes("tawas") ||
          candidate.cityId.includes("oscoda") ||
          candidate.cityId.includes("harrisville") ||
          candidate.cityId.includes("alpena") ||
          candidate.cityId.includes("rogers_city")
        ? "huron"
        : "michigan",
      basinId: "test",
      timezone: candidate.cityId.endsWith("_wi") || candidate.cityId.endsWith("_il")
        ? "America/Chicago"
        : "America/Detroit",
      latitude: 44,
      longitude: -86,
      temperatureTimeline: [{
        validAt: generatedAt,
        temperatureC: 10,
        sourceKind: "model",
      }],
      selectedSpecies: null,
    })),
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: generatedAt,
      fetchedAt: generatedAt,
      cycleAgeHours: 0,
    },
    disclosure: "test",
  };
}

Deno.test("app projection ranks absolute lake-trout opportunity across every city", () => {
  const generatedAt = "2026-11-15T17:00:00.000Z";
  const input = board(generatedAt);
  assert.equal(pierCastLakeTroutV5NeedsMap(input), true);
  const result = projectPierCastLakeTroutStandingsV5({
    leaderboard: input,
    map: map(generatedAt),
  });
  assert.equal(result.cities.length, 32);
  assert.equal(
    result.cities.filter((city) => city.rankingDisposition === "ranked").length,
    21,
  );
  assert.equal(result.cities[0]?.cityId, "harbor_beach_mi");
  assert.equal(result.cities[0]?.seasonalOutlook.band, "good");
  assert.equal(result.targetSpecies[0]?.availableCityCount, 21);
  assert.equal(result.targetSpecies[0]?.bestSeasonalBand, "good");
  assert.equal(JSON.stringify(result).includes("fisheryStrength"), false);
  assert.equal(JSON.stringify(result).includes('"score"'), false);
});

Deno.test("November is peak, legal closures block ranking, and holds stay unscored", () => {
  const generatedAt = "2026-11-15T17:00:00.000Z";
  const result = projectPierCastLakeTroutStandingsV5({
    leaderboard: board(generatedAt),
    map: map(generatedAt),
  });
  const harbor = result.cities.find((city) => city.cityId === "harbor_beach_mi");
  const frankfort = result.cities.find((city) => city.cityId === "frankfort_elberta_mi");
  const kenosha = result.cities.find((city) => city.cityId === "kenosha_wi");
  assert.deepEqual(harbor?.seasonalOutlook.reasonCodes, [
    "lake_trout_v5_timing:peak",
  ]);
  assert.equal(frankfort?.targetingEligibility, "restricted");
  assert.equal(frankfort?.rankingDisposition, "blocked");
  assert.equal(frankfort?.seasonalOutlook.band, "usually_off");
  assert.equal(kenosha?.rankingDisposition, "unranked");
  assert.deepEqual(kenosha?.reasonCodes, ["lake_trout_research_hold"]);
});

Deno.test("December and open-water winter remain active rather than zeroed", () => {
  for (const generatedAt of [
    "2026-12-15T17:00:00.000Z",
    "2027-01-15T17:00:00.000Z",
    "2027-02-15T17:00:00.000Z",
  ]) {
    const result = projectPierCastLakeTroutStandingsV5({
      leaderboard: board(generatedAt),
      map: map(generatedAt),
    });
    for (const cityId of ["caseville_mi", "harbor_beach_mi", "holland_mi"]) {
      const row = result.cities.find((city) => city.cityId === cityId);
      assert.equal(row?.rankingDisposition, "ranked", `${cityId} ${generatedAt}`);
      assert.notEqual(row?.seasonalOutlook.band, "usually_off", `${cityId} ${generatedAt}`);
    }
  }
});

Deno.test("all twelve monthly snapshots retain complete, contiguous city guidance", () => {
  for (let month = 1; month <= 12; month += 1) {
    const generatedAt = `2027-${String(month).padStart(2, "0")}-15T17:00:00.000Z`;
    const result = projectPierCastLakeTroutStandingsV5({
      leaderboard: board(generatedAt),
      map: map(generatedAt),
    });
    const ranked = result.cities.filter((city) =>
      city.rankingDisposition === "ranked"
    );
    assert.equal(result.cities.length, 32, generatedAt);
    assert.equal(ranked.length, month >= 10 ? 21 : 26, generatedAt);
    assert.deepEqual(
      ranked.map((city) => city.rank),
      ranked.map((_, index) => index + 1),
      generatedAt,
    );
    assert.ok(
      ranked.every((city) => city.seasonalOutlook.status === "available"),
      generatedAt,
    );
  }
});

Deno.test("city report inherits the same lake-trout label and standing", () => {
  const generatedAt = "2026-11-15T17:00:00.000Z";
  const leaderboard = projectPierCastLakeTroutStandingsV5({
    leaderboard: board(generatedAt),
    map: map(generatedAt),
  });
  const harbor = leaderboard.cities.find((city) =>
    city.cityId === "harbor_beach_mi"
  )!;
  const report = projectPierCastLakeTroutCityReportV5({
    leaderboard,
    report: {
      schemaVersion: "piercast-conditions-v4",
      formulaVersion: "seasonal-outlook-plus-thermal-match-v1",
      generatedAt,
      cityId: "harbor_beach_mi",
      displayName: "Harbor Beach",
      stateCode: "MI",
      lakeId: "huron",
      basinId: "lake_huron_west",
      timezone: "America/Detroit",
      selectedSpeciesId: "lake_trout",
      species: [{
        speciesId: "lake_trout",
        seasonalOutlook: {
          status: "unavailable",
          value: null,
          band: null,
          stage: null,
          trend: null,
          profileId: null,
          basis: null,
          localDate: "2026-11-15",
          reasonCodes: ["seasonal_profile_missing"],
        },
        thermalMatch: harbor.thermalMatch,
        targetingEligibility: "unknown",
        rankingDisposition: "unranked",
        localFisheryContext: null,
        reasonCodes: [],
      }],
      currentTemperature: null,
      temperatureTimeline: [],
      speciesStandings: [],
      source: {
        status: "fresh_archived_complete_cycle",
        productId: "NOAA_NOS_LMHOFS_REGULARGRID",
        issuedAt: generatedAt,
        fetchedAt: generatedAt,
        cycleAgeHours: 0,
      },
      disclosure: "test",
    },
  });
  const lakeTrout = report.species.find((species) =>
    species.speciesId === "lake_trout"
  )!;
  assert.deepEqual(lakeTrout.seasonalOutlook, harbor.seasonalOutlook);
  assert.equal(report.speciesStandings?.[0]?.rank, harbor.rank);
  assert.equal(
    report.speciesStandings?.[0]?.rankedCityCount,
    leaderboard.cities.filter((city) => city.rankingDisposition === "ranked")
      .length,
  );
});
