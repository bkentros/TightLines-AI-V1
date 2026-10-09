import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPierCastConditionsV4Outlook,
  projectPierCastConditionsCityReportV4,
  projectPierCastConditionsLeaderboardV4,
} from "../supabase/functions/_shared/pierCastEngine/pipeline/conditionsV4";
import {
  evaluatePierCastOpportunityV5,
  PIER_CAST_OPPORTUNITY_V5_CANDIDATE_VERSION,
  projectPierCastCityReportV5,
  projectPierCastLeaderboardV5,
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
