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
