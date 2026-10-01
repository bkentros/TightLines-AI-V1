import { assertEquals } from "jsr:@std/assert";
import type { PierCastReviewOutlookResponse } from "../_shared/pierCastEngine/index.ts";
import { cityReportOnly, leaderboardOnly } from "./reportAccess.ts";

Deno.test("public standings rank by primary species and never expose secondary scores", () => {
  const candidate = (
    speciesId:
      | "yellow_perch"
      | "coho_salmon"
      | "atlantic_salmon"
      | "lake_trout",
    score: number,
  ) => ({
    speciesId,
    biological: {
      status: "available",
      score,
      displayScore: score,
      displayText: `${score}/10`,
      label: "Good",
      ratingName: "FinFindr Opportunity Rating",
      rubricVersion: "test",
    },
    coverage: { status: "complete" },
    targetingEligibility: "eligible",
    promotion: { status: "blocked", reasonCodes: [] },
  });
  const outlook = {
    generatedAt: "2026-09-16T12:00:00.000Z",
    cities: [
      {
        cityId: "ludington_mi",
        dates: [{
          localDate: "2026-09-16",
          headline: { overall: { status: "available" } },
          species: [candidate("yellow_perch", 9), candidate("coho_salmon", 6)],
        }],
      },
      {
        cityId: "grand_haven_mi",
        dates: [{
          localDate: "2026-09-16",
          headline: { overall: { status: "available" } },
          species: [
            candidate("yellow_perch", 9),
            candidate("coho_salmon", 7),
            candidate("lake_trout", 8),
          ],
        }],
      },
      {
        cityId: "rogers_city_mi",
        dates: [{
          localDate: "2026-09-16",
          headline: { overall: { status: "available" } },
          species: [
            candidate("yellow_perch", 9),
            candidate("atlantic_salmon", 8.5),
          ],
        }],
      },
    ],
  } as unknown as Parameters<typeof leaderboardOnly>[0];

  const leaderboard = leaderboardOnly(outlook);
  assertEquals(leaderboard.cities.map((city) => city.cityId), [
    "rogers_city_mi",
    "grand_haven_mi",
    "ludington_mi",
  ]);
  assertEquals(
    leaderboard.cities[2].dates[0].headline.drivingSpeciesId,
    "coho_salmon",
  );
  assertEquals(leaderboard.cities[2].dates[0].headline.overall.score, 6);
  assertEquals(
    leaderboard.cities[1].dates[0].headline.drivingSpeciesId,
    "lake_trout",
  );
  assertEquals(leaderboard.cities[1].dates[0].headline.overall.score, 8);
  assertEquals("species" in leaderboard.cities[1].dates[0], false);
  assertEquals(
    leaderboard.cities[0].dates[0].headline.drivingSpeciesId,
    "atlantic_salmon",
  );

  const cityOutlook = {
    ...outlook,
    dailyScoreSnapshot: {
      cities: [{ cityId: "ludington_mi", date: outlook.cities[0].dates[0] }],
    },
  } as unknown as PierCastReviewOutlookResponse;
  const cityReport = cityReportOnly(cityOutlook, "ludington_mi");
  assertEquals(
    cityReport.cities[0].dates[0].headline.drivingSpeciesId,
    "coho_salmon",
  );
  assertEquals(cityReport.cities[0].dates[0].headline.overall.score, 6);
  assertEquals(cityReport.cities[0].dates[0].species.length, 2);
  assertEquals(
    cityReport.dailyScoreSnapshot?.cities[0].date.headline.drivingSpeciesId,
    "coho_salmon",
  );
});
