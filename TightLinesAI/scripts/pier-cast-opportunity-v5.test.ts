import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPierCastConditionsV4Outlook,
  projectPierCastConditionsCityReportV4,
  projectPierCastConditionsMapV4,
  projectPierCastConditionsLeaderboardV4,
} from "../supabase/functions/_shared/pierCastEngine/pipeline/conditionsV4";
import {
  clearUnverifiedPierCastTargetSummariesV5,
  evaluatePierCastOpportunityV5,
  PIER_CAST_OPPORTUNITY_V5_CANDIDATE_VERSION,
  projectPierCastCityReportLabelsV5,
  projectPierCastCityReportV5,
  projectPierCastLeaderboardV5,
  projectPierCastTargetSpeciesSummariesV5,
} from "../lib/pierCastOpportunityV5";
import { PIER_CAST_V3_PAIR_CALIBRATIONS } from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration";

const GENERATED_AT = "2026-09-29T20:00:00.000Z";
const CITY_IDS = [
  "ludington_mi",
  "grand_haven_mi",
  "manistee_mi",
  "frankfort_elberta_mi",
] as const;

function outlook() {
  return buildPierCastConditionsV4Outlook({
    generatedAt: GENERATED_AT,
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: "2026-09-29T17:00:00.000Z",
      fetchedAt: GENERATED_AT,
      cycleAgeHours: 3,
    },
    cities: CITY_IDS.map((cityId, cityIndex) => ({
      cityId,
      temperatureTimeline: Array.from({ length: 121 }, (_, hour) => ({
        validAt: new Date(Date.parse(GENERATED_AT) + hour * 3_600_000)
          .toISOString(),
        temperatureC: 11 + cityIndex * 0.6 + Math.sin(hour / 12),
      })),
      dates: [{ localDate: "2026-09-29" }],
    })),
  } as never);
}

test("all 254 admitted pairs resolve monthly through one opportunity evaluator", () => {
  assert.equal(PIER_CAST_V3_PAIR_CALIBRATIONS.length, 254);
  for (const pair of PIER_CAST_V3_PAIR_CALIBRATIONS) {
    for (let month = 1; month <= 12; month += 1) {
      const key = `${pair.pairKey}/2027-${String(month).padStart(2, "0")}`;
      const results = [0, 0.5, 1].map((thermalValue) =>
        evaluatePierCastOpportunityV5({
          cityId: pair.cityId,
          speciesId: pair.speciesId,
          localDate: `2027-${String(month).padStart(2, "0")}-15`,
          thermalValue,
        })
      );
      assert.ok(results.every(Boolean), key);
      const [low, middle, high] = results as Array<
        NonNullable<(typeof results)[number]>
      >;
      assert.ok(low.availability >= 0 && low.availability <= 1, key);
      if (low.closed) {
        assert.ok(results.every((result) => result?.score === null), key);
      } else {
        assert.ok(low.score !== null && middle.score !== null && high.score !== null, key);
        assert.ok(low.score! >= 1 && high.score! <= 10, key);
        assert.ok(low.score! <= middle.score! && middle.score! <= high.score!, key);
      }
    }
  }
});

test("St. Joseph Chinook adds a modest fall peak without raising its annual ceiling", () => {
  const september16 = evaluatePierCastOpportunityV5({
    cityId: "st_joseph_mi",
    speciesId: "chinook_salmon",
    localDate: "2026-09-16",
    thermalValue: 1,
  });
  assert.ok(september16);
  assert.equal(september16.modeId, "fall_harbor_staging");
  assert.equal(september16.availability, 1);
  assert.equal(september16.score, 5.8);
  assert.equal(september16.band, "fair");
  assert.equal(september16.timing, "peak");

  const september30 = evaluatePierCastOpportunityV5({
    cityId: "st_joseph_mi",
    speciesId: "chinook_salmon",
    localDate: "2026-09-30",
    thermalValue: 1,
  });
  assert.ok(september30);
  assert.equal(september30.modeId, "fall_harbor_staging");
  assert.equal(september30.availability, 0.7);
  assert.ok(Math.abs(september30.score! - 4.36) < 1e-10);
  assert.equal(september30.band, "fair");
  assert.equal(september30.timing, "past");

  const november1 = evaluatePierCastOpportunityV5({
    cityId: "st_joseph_mi",
    speciesId: "chinook_salmon",
    localDate: "2026-11-01",
    thermalValue: 1,
  });
  assert.ok(november1);
  assert.equal(november1.availability, 0);
  assert.equal(november1.score, 1);
  assert.equal(november1.band, "usually_off");
  assert.equal(november1.timing, "off");

  let annualMaximum = 0;
  for (let day = 0; day < 365; day += 1) {
    const localDate = new Date(Date.UTC(2026, 0, day + 1))
      .toISOString().slice(0, 10);
    const scores = [0, 0.5, 1].map((thermalValue) =>
      evaluatePierCastOpportunityV5({
        cityId: "st_joseph_mi",
        speciesId: "chinook_salmon",
        localDate,
        thermalValue,
      })!.score!
    );
    assert.ok(scores[0]! >= 1, localDate);
    assert.ok(scores[0]! <= scores[1]!, localDate);
    assert.ok(scores[1]! <= scores[2]!, localDate);
    assert.ok(scores[2]! <= 6.8, localDate);
    annualMaximum = Math.max(annualMaximum, scores[2]!);
  }
  assert.equal(annualMaximum, 6.8);
});

test("Batch 2 corrects Charlevoix Chinook timing without changing its annual ceiling", () => {
  const may10 = evaluatePierCastOpportunityV5({
    cityId: "charlevoix_mi",
    speciesId: "chinook_salmon",
    localDate: "2026-05-10",
    thermalValue: 1,
  });
  assert.ok(may10);
  assert.equal(may10.availability, 0);
  assert.equal(may10.band, "usually_off");
  assert.equal(may10.timing, "off");

  const july15 = evaluatePierCastOpportunityV5({
    cityId: "charlevoix_mi",
    speciesId: "chinook_salmon",
    localDate: "2026-07-15",
    thermalValue: 1,
  });
  assert.ok(july15);
  assert.equal(july15.modeId, "summer_channel");
  assert.equal(july15.availability, 1);
  assert.equal(july15.score, 4.84);
  assert.equal(july15.band, "fair");
  assert.equal(july15.timing, "peak");

  const september10 = evaluatePierCastOpportunityV5({
    cityId: "charlevoix_mi",
    speciesId: "chinook_salmon",
    localDate: "2026-09-10",
    thermalValue: 1,
  });
  assert.ok(september10);
  assert.equal(september10.modeId, "fall_harbor_staging");
  assert.equal(september10.score, 7.2);
  assert.equal(september10.timing, "peak");
});

test("Batch 2 moves Rogers City Chinook peak into September", () => {
  const september10 = evaluatePierCastOpportunityV5({
    cityId: "rogers_city_mi",
    speciesId: "chinook_salmon",
    localDate: "2026-09-10",
    thermalValue: 1,
  });
  assert.ok(september10);
  assert.equal(september10.modeId, "fall_harbor_staging");
  assert.equal(september10.availability, 1);
  assert.equal(september10.score, 6);
  assert.equal(september10.band, "fair");
  assert.equal(september10.timing, "peak");

  const october5 = evaluatePierCastOpportunityV5({
    cityId: "rogers_city_mi",
    speciesId: "chinook_salmon",
    localDate: "2026-10-05",
    thermalValue: 1,
  });
  assert.ok(october5);
  assert.equal(october5.availability, 0.4);
  assert.equal(october5.score, 3);
  assert.equal(october5.band, "poor");
  assert.equal(october5.timing, "past");
});

test("Batch 2 centers Rogers City Atlantic salmon on May and removes the winter seam", () => {
  const january15 = evaluatePierCastOpportunityV5({
    cityId: "rogers_city_mi",
    speciesId: "atlantic_salmon",
    localDate: "2026-01-15",
    thermalValue: 1,
  });
  assert.ok(january15);
  assert.equal(january15.availability, 0);
  assert.equal(january15.band, "usually_off");
  assert.equal(january15.timing, "off");

  const may15 = evaluatePierCastOpportunityV5({
    cityId: "rogers_city_mi",
    speciesId: "atlantic_salmon",
    localDate: "2026-05-15",
    thermalValue: 1,
  });
  assert.ok(may15);
  assert.equal(may15.modeId, "spring_early_summer_harbor");
  assert.equal(may15.availability, 1);
  assert.equal(may15.score, 6.8);
  assert.equal(may15.band, "good");
  assert.equal(may15.timing, "peak");

  const october20 = evaluatePierCastOpportunityV5({
    cityId: "rogers_city_mi",
    speciesId: "atlantic_salmon",
    localDate: "2026-10-20",
    thermalValue: 1,
  });
  assert.ok(october20);
  assert.equal(october20.modeId, "fall_breakwall");
  assert.equal(october20.availability, 1);
  assert.equal(october20.score, 5.99);
  assert.equal(october20.band, "fair");
  assert.equal(october20.timing, "peak");

  const december15 = evaluatePierCastOpportunityV5({
    cityId: "rogers_city_mi",
    speciesId: "atlantic_salmon",
    localDate: "2026-12-15",
    thermalValue: 1,
  });
  assert.ok(december15);
  assert.equal(december15.availability, 0);
  assert.equal(december15.band, "usually_off");
  assert.equal(december15.timing, "off");
});

test("Batch 2 preserves the approved annual fishery-strength ceilings", () => {
  const pairs = [
    ["charlevoix_mi", "chinook_salmon", 7.2],
    ["rogers_city_mi", "chinook_salmon", 6],
    ["rogers_city_mi", "atlantic_salmon", 6.8],
  ] as const;

  for (const [cityId, speciesId, expectedMaximum] of pairs) {
    let annualMaximum = 0;
    for (let day = 0; day < 365; day += 1) {
      const localDate = new Date(Date.UTC(2026, 0, day + 1))
        .toISOString().slice(0, 10);
      const scores = [0, 0.5, 1].map((thermalValue) =>
        evaluatePierCastOpportunityV5({
          cityId,
          speciesId,
          localDate,
          thermalValue,
        })!.score!
      );
      assert.ok(scores[0] >= 1, `${cityId}/${speciesId}/${localDate}`);
      assert.ok(scores[0] <= scores[1], `${cityId}/${speciesId}/${localDate}`);
      assert.ok(scores[1] <= scores[2], `${cityId}/${speciesId}/${localDate}`);
      assert.ok(
        scores[2] <= expectedMaximum,
        `${cityId}/${speciesId}/${localDate}`,
      );
      annualMaximum = Math.max(annualMaximum, scores[2]);
    }
    assert.equal(annualMaximum, expectedMaximum, `${cityId}/${speciesId}`);
  }
});

test("Batch 2 does not turn limited Lexington access into a score gate", () => {
  for (const speciesId of ["atlantic_salmon", "lake_trout"] as const) {
    const evaluation = evaluatePierCastOpportunityV5({
      cityId: "lexington_mi",
      speciesId,
      localDate: "2026-10-09",
      thermalValue: 1,
    });
    assert.ok(evaluation, speciesId);
    assert.equal(evaluation.closed, false, speciesId);
    assert.notEqual(evaluation.score, null, speciesId);
  }
});

test("St. Joseph fall correction reaches leaderboard and city report through one projection", () => {
  const generatedAt = "2026-09-16T16:00:00.000Z";
  const source = buildPierCastConditionsV4Outlook({
    generatedAt,
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: "2026-09-16T13:00:00.000Z",
      fetchedAt: generatedAt,
      cycleAgeHours: 3,
    },
    cities: [{
      cityId: "st_joseph_mi",
      temperatureTimeline: Array.from({ length: 121 }, (_, hour) => ({
        validAt: new Date(Date.parse(generatedAt) + hour * 3_600_000)
          .toISOString(),
        temperatureC: 13,
      })),
      dates: [{ localDate: "2026-09-16" }],
    }],
  } as never);
  const leaderboard = projectPierCastLeaderboardV5(
    projectPierCastConditionsLeaderboardV4(source, "chinook_salmon"),
  );
  const leaderboardRow = leaderboard.cities.find((city) =>
    city.cityId === "st_joseph_mi"
  );
  assert.ok(leaderboardRow);
  assert.equal(leaderboardRow.rank, 1);
  assert.equal(leaderboardRow.seasonalOutlook.band, "fair");
  assert.equal(leaderboardRow.seasonalOutlook.stage, "active");
  assert.ok(leaderboardRow.seasonalOutlook.reasonCodes.includes(
    "pier_cast_v5_mode:fall_harbor_staging",
  ));

  const report = projectPierCastCityReportV5({
    report: projectPierCastConditionsCityReportV4(
      source,
      "st_joseph_mi",
      "chinook_salmon",
    ),
    selectedLeaderboard: leaderboard,
  });
  const reportRow = report.species.find((species) =>
    species.speciesId === "chinook_salmon"
  );
  assert.ok(reportRow);
  assert.equal(reportRow.seasonalOutlook.band, "fair");
  assert.equal(reportRow.seasonalOutlook.stage, "active");
  assert.equal(report.speciesStandings?.[0]?.rank, 1);
});

test("leaderboards use exact hidden opportunity and expose labels only", () => {
  const original = projectPierCastConditionsLeaderboardV4(
    outlook(),
    "chinook_salmon",
  );
  const projected = projectPierCastLeaderboardV5(original);
  const expected = projected.cities.filter((city) =>
    city.rankingDisposition === "ranked"
  ).map((city) => ({
    cityId: city.cityId,
    score: evaluatePierCastOpportunityV5({
      cityId: city.cityId,
      speciesId: "chinook_salmon",
      localDate: city.seasonalOutlook.localDate,
      thermalValue: city.thermalMatch.status === "available"
        ? city.thermalMatch.value
        : null,
    })!.score!,
  })).sort((left, right) =>
    right.score - left.score || left.cityId.localeCompare(right.cityId)
  );
  assert.deepEqual(
    projected.cities.filter((city) => city.rankingDisposition === "ranked")
      .map((city) => city.cityId),
    expected.map((row) => row.cityId),
  );
  assert.ok(projected.cities.every((city) =>
    city.seasonalOutlook.status !== "available" ||
    city.seasonalOutlook.profileId === PIER_CAST_OPPORTUNITY_V5_CANDIDATE_VERSION
  ));
  assert.equal(JSON.stringify(projected).includes('"score"'), false);
});

test("target picker Best labels are complete before a species is selected", () => {
  const source = buildPierCastConditionsV4Outlook({
    generatedAt: "2026-10-09T18:00:00.000Z",
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: "2026-10-09T15:00:00.000Z",
      fetchedAt: "2026-10-09T18:00:00.000Z",
      cycleAgeHours: 3,
    },
    cities: CITY_IDS.map((cityId) => ({
      cityId,
      temperatureTimeline: Array.from({ length: 121 }, (_, hour) => ({
        validAt: new Date(Date.parse("2026-10-09T18:00:00.000Z") + hour * 3_600_000)
          .toISOString(),
        temperatureC: 13,
      })),
      dates: [{ localDate: "2026-10-09" }],
    })),
  } as never);
  const map = projectPierCastConditionsMapV4(source, null);
  const stalePrime = (speciesId: "chinook_salmon" | "steelhead") => {
    const projected = projectPierCastLeaderboardV5(
      projectPierCastConditionsLeaderboardV4(source, speciesId),
    );
    return {
      ...projected,
      targetSpecies: projected.targetSpecies.map((option) => ({
        ...option,
        bestSeasonalBand: "excellent" as const,
      })),
    };
  };
  const fromChinook = projectPierCastTargetSpeciesSummariesV5({
    leaderboard: stalePrime("chinook_salmon"),
    map,
  });
  const fromSteelhead = projectPierCastTargetSpeciesSummariesV5({
    leaderboard: stalePrime("steelhead"),
    map,
  });
  const cohoFromChinook = fromChinook.targetSpecies.find((option) =>
    option.speciesId === "coho_salmon"
  );
  const cohoFromSteelhead = fromSteelhead.targetSpecies.find((option) =>
    option.speciesId === "coho_salmon"
  );
  assert.ok(cohoFromChinook);
  assert.ok(cohoFromSteelhead);
  assert.equal(cohoFromChinook.bestSeasonalBand, "good");
  assert.deepEqual(cohoFromSteelhead, cohoFromChinook);
});

test("target picker clears legacy Best labels when its summary map is unavailable", () => {
  const projected = projectPierCastLeaderboardV5(
    projectPierCastConditionsLeaderboardV4(outlook(), "chinook_salmon"),
  );
  const cleared = clearUnverifiedPierCastTargetSummariesV5(projected);
  for (const option of cleared.targetSpecies) {
    if (option.speciesId === "chinook_salmon") {
      assert.equal(option.bestSeasonalBand, projected.targetSpecies.find((row) =>
        row.speciesId === option.speciesId
      )?.bestSeasonalBand);
    } else {
      assert.equal(option.bestSeasonalBand, null, option.speciesId);
    }
  }
});

test("city report labels, species order and selected standing use the same model", () => {
  const source = outlook();
  const selectedLeaderboard = projectPierCastLeaderboardV5(
    projectPierCastConditionsLeaderboardV4(source, "chinook_salmon"),
  );
  const report = projectPierCastCityReportV5({
    report: projectPierCastConditionsCityReportV4(
      source,
      "ludington_mi",
      "chinook_salmon",
    ),
    selectedLeaderboard,
  });
  const rankedScores = report.species.filter((species) =>
    species.rankingDisposition === "ranked"
  ).map((species) =>
    evaluatePierCastOpportunityV5({
      cityId: report.cityId,
      speciesId: species.speciesId,
      localDate: species.seasonalOutlook.localDate,
      thermalValue: species.thermalMatch.status === "available"
        ? species.thermalMatch.value
        : null,
    })!.score!
  );
  for (let index = 1; index < rankedScores.length; index += 1) {
    assert.ok(rankedScores[index - 1]! >= rankedScores[index]!);
  }
  assert.equal(report.speciesStandings?.length, 1);
  assert.equal(report.speciesStandings?.[0]?.speciesId, "chinook_salmon");
  assert.equal(JSON.stringify(report).includes('"score"'), false);
});

test("city reports retain v5 labels when standings are unavailable", () => {
  const source = outlook();
  const raw = projectPierCastConditionsCityReportV4(
    source,
    "ludington_mi",
    "chinook_salmon",
  );
  assert.ok((raw.speciesStandings?.length ?? 0) > 0);
  const projected = projectPierCastCityReportLabelsV5(raw);
  assert.deepEqual(projected.speciesStandings, []);
  for (const species of projected.species) {
    assert.equal(
      species.seasonalOutlook.status === "available"
        ? species.seasonalOutlook.profileId
        : null,
      PIER_CAST_OPPORTUNITY_V5_CANDIDATE_VERSION,
      species.speciesId,
    );
  }
  const lakeTrout = projected.species.find((species) =>
    species.speciesId === "lake_trout"
  );
  assert.ok(lakeTrout);
  const expected = evaluatePierCastOpportunityV5({
    cityId: projected.cityId,
    speciesId: "lake_trout",
    localDate: lakeTrout.seasonalOutlook.localDate,
    thermalValue: lakeTrout.thermalMatch.status === "available"
      ? lakeTrout.thermalMatch.value
      : null,
  });
  assert.ok(expected);
  assert.equal(lakeTrout.seasonalOutlook.band, expected.band);
  assert.equal(JSON.stringify(projected).includes('"score"'), false);
});

test("lake-trout legal gates follow the v5 calibration, not stale v4 server closures", () => {
  const generatedAt = "2026-10-15T16:00:00.000Z";
  const source = buildPierCastConditionsV4Outlook({
    generatedAt,
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: "2026-10-15T13:00:00.000Z",
      fetchedAt: generatedAt,
      cycleAgeHours: 3,
    },
    cities: ["oscoda_mi", "frankfort_elberta_mi"].map((cityId) => ({
      cityId,
      temperatureTimeline: Array.from({ length: 121 }, (_, hour) => ({
        validAt: new Date(Date.parse(generatedAt) + hour * 3_600_000)
          .toISOString(),
        temperatureC: 10,
      })),
      dates: [{ localDate: "2026-10-15" }],
    })),
  } as never);
  const lakeTroutFor = (cityId: string) =>
    projectPierCastCityReportLabelsV5(
      projectPierCastConditionsCityReportV4(source, cityId, "lake_trout"),
    ).species.find((species) => species.speciesId === "lake_trout");

  // Oscoda is Lake Huron unit MH-3: lake trout are open all year.
  const oscoda = lakeTroutFor("oscoda_mi");
  assert.ok(oscoda);
  assert.equal(oscoda.targetingEligibility, "eligible");
  assert.equal(oscoda.rankingDisposition, "ranked");
  assert.equal(oscoda.reasonCodes.includes("targeting_restricted"), false);

  // Frankfort is Lake Michigan unit MM-5: possession closes Oct 1-Dec 31.
  const frankfort = lakeTroutFor("frankfort_elberta_mi");
  assert.ok(frankfort);
  assert.equal(frankfort.targetingEligibility, "restricted");
  assert.equal(frankfort.rankingDisposition, "blocked");
});
