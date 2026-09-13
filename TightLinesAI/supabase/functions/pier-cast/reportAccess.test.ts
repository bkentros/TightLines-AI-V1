import { assertEquals, assertRejects } from "jsr:@std/assert";
import {
  cityReportOnly,
  createPierReportAccess,
  leaderboardOnly,
  PierCastAccessError,
} from "./reportAccess.ts";
import type { PierCastReviewOutlookResponse } from "../_shared/pierCastEngine/index.ts";

function fixture() {
  const date = {
    localDate: "2026-09-13",
    timezone: "America/Detroit",
    scope: "remaining_day",
    requestedInterval: { start: "a", end: "b" },
    openWaterNoticeApplies: false,
    headline: { overall: { status: "available", score: 7, displayScore: 7 } },
    species: [{ secret: "full species report" }],
    waterTemperature: { points: [{ secret: "temperature" }] },
  };
  return {
    mode: "review",
    previewOnly: true,
    generatedAt: "2026-09-13T15:00:00Z",
    ratingName: "FinFindr Opportunity Rating",
    ratingDisplayFormat: "X.X/10",
    disclosure: "test",
    formulaVersion: "seasonal-opportunity-bounded-temperature-v2",
    source: {},
    dailyScoreSnapshot: {
      cities: [{ cityId: "ludington_mi", date }, {
        cityId: "grand_haven_mi",
        date,
      }],
    },
    cities: ["ludington_mi", "grand_haven_mi"].map((cityId) => ({
      cityId,
      displayName: cityId,
      timezone: "America/Detroit",
      representationDecision: "blocked_insufficient_evidence",
      dates: [date],
      temperatureTimeline: [{ secret: "timeline" }],
      additionalSpeciesResearch: [{ secret: "research" }],
    })),
  } as unknown as PierCastReviewOutlookResponse;
}
Deno.test("leaderboard and city projections cannot leak another city's report", () => {
  const outlook = fixture();
  const leaderboard = leaderboardOnly(outlook);
  assertEquals(leaderboard.cities.length, 2);
  assertEquals(JSON.stringify(leaderboard).includes("secret"), false);
  assertEquals("cities" in (leaderboard.dailyScoreSnapshot ?? {}), false);
  const report = cityReportOnly(outlook, "ludington_mi");
  assertEquals(report.cities.length, 1);
  assertEquals(report.dailyScoreSnapshot?.cities.map((c) => c.cityId), [
    "ludington_mi",
  ]);
  assertEquals(report.cities[0].additionalSpeciesResearch, undefined);
});
Deno.test("one lifetime city/day, refreshing conditions, upgrade, user isolation, no failed claim", async () => {
  const claims = new Map<string, { report_key: string }>();
  let now = new Date("2026-09-13T15:00:00Z");
  let outlook: PierCastReviewOutlookResponse | null = fixture();
  let commits = 0;
  const read = createPierReportAccess({
    readOutlook: async () => outlook,
    readPrior: async (user) => claims.get(user) ?? null,
    cityTimezone: (city) =>
      ["ludington_mi", "grand_haven_mi"].includes(city)
        ? "America/Detroit"
        : null,
    now: () => now,
    claim: async (user, key, report) => {
      commits++;
      claims.set(user, { report_key: key });
      return report;
    },
  });
  await read("a", true, "ludington_mi");
  outlook!.generatedAt = "2026-09-13T16:00:00Z";
  assertEquals(
    (await read("a", true, "ludington_mi") as PierCastReviewOutlookResponse)
      .generatedAt,
    outlook!.generatedAt,
  );
  await assertRejects(
    () => read("a", true, "grand_haven_mi"),
    PierCastAccessError,
    "Upgrade",
  );
  await read("b", true, "grand_haven_mi");
  await read("a", false, "grand_haven_mi");
  assertEquals(commits, 3);
  now = new Date("2026-09-14T15:00:00Z");
  await assertRejects(
    () => read("a", true, "ludington_mi"),
    PierCastAccessError,
    "Upgrade",
  );
  await assertRejects(
    () => read("c", true, "ludington_mi"),
    PierCastAccessError,
    "not ready",
  );
  outlook = null;
  await assertRejects(
    () => read("c", true, "ludington_mi"),
    PierCastAccessError,
    "not ready",
  );
  assertEquals(claims.has("c"), false);
  assertEquals(commits, 3);
});
