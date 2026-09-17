import { assertEquals } from "jsr:@std/assert";
import { leaderboardOnly } from "./reportAccess.ts";

Deno.test("public standings rank by primary species and never expose secondary scores", () => {
  const candidate = (
    speciesId: "yellow_perch" | "coho_salmon",
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
          species: [candidate("yellow_perch", 9), candidate("coho_salmon", 6)],
        }],
      },
      {
        cityId: "grand_haven_mi",
        dates: [{
          localDate: "2026-09-16",
          species: [candidate("coho_salmon", 7)],
        }],
      },
    ],
  } as unknown as Parameters<typeof leaderboardOnly>[0];

  const leaderboard = leaderboardOnly(outlook);
  assertEquals(leaderboard.cities.map((city) => city.cityId), [
    "grand_haven_mi",
    "ludington_mi",
  ]);
  assertEquals(
    leaderboard.cities[1].dates[0].headline.drivingSpeciesId,
    "coho_salmon",
  );
  assertEquals(leaderboard.cities[1].dates[0].headline.overall.score, 6);
  assertEquals("species" in leaderboard.cities[1].dates[0], false);
});
