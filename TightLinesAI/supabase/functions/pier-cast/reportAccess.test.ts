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
      temperatureEvents: { events: [{ secret: "thermal event" }] },
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
  assertEquals(report.cities[0].temperatureEvents?.events.length, 1);
});
Deno.test("four lifetime city/day reports, refreshing conditions, upgrade, user isolation, no failed claim", async () => {
  const claims = new Map<string, string[]>();
  let now = new Date("2026-09-13T15:00:00Z");
  let outlook: PierCastReviewOutlookResponse | null = fixture();
  let commits = 0;
  const read = createPierReportAccess({
    readOutlook: async () => outlook,
    readClaimKeys: async (user) => claims.get(user) ?? [],
    cityTimezone: (city) =>
      ["ludington_mi", "grand_haven_mi"].includes(city)
        ? "America/Detroit"
        : null,
    now: () => now,
    claim: async (user, key, report) => {
      commits++;
      claims.set(user, [...new Set([...(claims.get(user) ?? []), key])]);
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
  await read("a", true, "grand_haven_mi");
  await read("b", true, "grand_haven_mi");
  await read("a", false, "grand_haven_mi");
  assertEquals(commits, 4);
  now = new Date("2026-09-14T15:00:00Z");
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
  assertEquals(commits, 4);
});

Deno.test("fifth distinct city/date is blocked; one of four saved reports can refresh", async () => {
  const claims = new Map<string, string[]>([["a", [
    "ludington_mi:2026-09-10", "ludington_mi:2026-09-11",
    "ludington_mi:2026-09-12", "ludington_mi:2026-09-13",
  ]]]);
  let commits = 0;
  const read = createPierReportAccess({
    readOutlook: async () => fixture(),
    readClaimKeys: async user => claims.get(user) ?? [],
    cityTimezone: () => "America/Detroit",
    now: () => new Date("2026-09-13T15:00:00Z"),
    claim: async (_user, _key, report) => { commits++; return report; },
  });
  await read("a", true, "ludington_mi");
  await assertRejects(() => read("a", true, "grand_haven_mi"), PierCastAccessError, "Upgrade");
  assertEquals(commits, 1);
});

Deno.test("public research authorization is exact-roster and does not claim scientific validation", async () => {
  const { isPierCastResearchRoster, isPierCastResearchCity, publicResearchSpecies, PIER_CAST_RESEARCH_DISCLOSURE } = await import("../_shared/pierCastEngine/config/publicRelease.ts");
  const { PIER_CAST_CITY_PROFILES } = await import("../_shared/pierCastEngine/config/cities.ts");
  const { buildPierCastCatalog } = await import("../_shared/pierCastEngine/config/catalog.ts");
  assertEquals(PIER_CAST_CITY_PROFILES.every(c => !c.publicEnabled), true);
  assertEquals(isPierCastResearchCity("unapproved_city"), false);
  assertEquals(isPierCastResearchRoster("ludington_mi", publicResearchSpecies("ludington_mi")), true);
  assertEquals(isPierCastResearchRoster("ludington_mi", [...publicResearchSpecies("ludington_mi"), "walleye"]), false);
  assertEquals(isPierCastResearchRoster("manistee_mi", publicResearchSpecies("ludington_mi")), false);
  const catalog = buildPierCastCatalog("public");
  assertEquals(catalog.disclosure, PIER_CAST_RESEARCH_DISCLOSURE);
  assertEquals(catalog.cities.map(c => c.species.length), [6,6,8,4,4,0,0,0,0,0,0,0]);
  assertEquals(catalog.cities.filter(c => c.releaseStatus === "public_research").length, 5);
  assertEquals(catalog.cities.filter(c => c.releaseStatus === "research_only").length, 7);
  assertEquals(catalog.cities.every(c => c.waterTemperatureSource?.calibrationStatus === "provisional"), true);
});

Deno.test("research launch preserves known earlier daily snapshots without accepting arbitrary partial rosters", async () => {
  const { isPierCastResearchRoster, publicResearchSpecies } = await import("../_shared/pierCastEngine/config/publicRelease.ts");
  const core = ["chinook_salmon", "coho_salmon", "steelhead", "brown_trout"];
  assertEquals(isPierCastResearchRoster("ludington_mi", core), false);
  assertEquals(isPierCastResearchRoster("ludington_mi", core, "piercast-five-city-four-species-v1"), true);
  assertEquals(isPierCastResearchRoster("ludington_mi", core, "unknown"), false);
  assertEquals(isPierCastResearchRoster("ludington_mi", ["walleye", ...core], "piercast-five-city-four-species-v1"), false);
  assertEquals(isPierCastResearchRoster("manistee_mi", publicResearchSpecies("manistee_mi").filter(id => id !== "smallmouth_bass"), "piercast-private-roster-v2-2026-09-12"), true);
});
