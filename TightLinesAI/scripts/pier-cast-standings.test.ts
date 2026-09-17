import assert from "node:assert/strict";
import test from "node:test";
import type {
  PierCastReviewOutlookResponse,
  PierCastV3ReviewOutlookResponse,
} from "../lib/pierCastContracts";
import { projectPierCastStandings } from "../lib/pierCastStandings";

function ownerReviewFixture(): PierCastReviewOutlookResponse {
  const headline = {
    overall: {
      status: "available",
      score: 7,
      displayScore: 7,
      displayText: "7/10",
    },
  };
  const date = {
    localDate: "2026-09-14",
    headline,
    species: [],
  };
  const lockedCityIds = [
    "ludington_mi",
    "grand_haven_mi",
    "manistee_mi",
    "frankfort_elberta_mi",
    "sheboygan_wi",
  ];
  return {
    mode: "review",
    generatedAt: "2026-09-14T12:35:00.000Z",
    dailyScoreSnapshot: {
      status: "locked_daily_snapshot",
      lakeDate: "2026-09-14",
      setAt: "2026-09-14T00:35:00.000Z",
      publishAt: "2026-09-14T05:00:00.000Z",
      cities: lockedCityIds.map((cityId) => ({ cityId, date })),
    },
    cities: lockedCityIds.map((cityId) => ({
      cityId,
      dates: [date],
    })),
  } as unknown as PierCastReviewOutlookResponse;
}

function wisconsinExpansionFixture(): PierCastReviewOutlookResponse {
  const fixture = ownerReviewFixture();
  const expansionCityIds = [
    "port_washington_wi",
    "milwaukee_wi",
    "racine_wi",
    "kenosha_wi",
  ];
  return {
    ...fixture,
    generatedAt: "2026-09-14T17:10:23.944Z",
    dailyScoreSnapshot: undefined,
    cities: expansionCityIds.map((cityId) => ({
      ...fixture.cities[0],
      cityId,
    })),
  };
}

function v3ReviewFixture(): PierCastV3ReviewOutlookResponse {
  const fixture = ownerReviewFixture();
  const cityIds = [
    "ludington_mi",
    "grand_haven_mi",
    "manistee_mi",
    "frankfort_elberta_mi",
    "sheboygan_wi",
    "port_washington_wi",
    "milwaukee_wi",
    "racine_wi",
    "kenosha_wi",
    "harbor_beach_mi",
    "oscoda_mi",
    "port_sanilac_mi",
  ];
  return {
    mode: "v3_shadow_review",
    previewOnly: true,
    generatedAt: "2026-09-15T12:29:54.000Z",
    cities: cityIds.map((cityId, index) => ({
      ...fixture.cities[0],
      cityId,
      dates: fixture.cities[0].dates.map((date) => ({
        ...date,
        species: Array.from({ length: index % 3 + 4 }, () => ({})),
      })),
    })),
  } as unknown as PierCastV3ReviewOutlookResponse;
}

test("owner standings retain the locked snapshot and include every expansion city", () => {
  const standings = projectPierCastStandings(ownerReviewFixture(), [
    wisconsinExpansionFixture(),
  ]);

  assert.equal(standings.generatedAt, "2026-09-14T17:10:23.944Z");
  assert.deepEqual(standings.dailyScoreSnapshot, {
    status: "locked_daily_snapshot",
    lakeDate: "2026-09-14",
    setAt: "2026-09-14T00:35:00.000Z",
    publishAt: "2026-09-14T05:00:00.000Z",
  });
  assert.deepEqual(standings.cities.map((city) => city.cityId), [
    "ludington_mi",
    "grand_haven_mi",
    "manistee_mi",
    "frankfort_elberta_mi",
    "sheboygan_wi",
    "port_washington_wi",
    "milwaukee_wi",
    "racine_wi",
    "kenosha_wi",
  ]);
});

test("owner standings still include all live review cities without a snapshot", () => {
  const outlook = ownerReviewFixture();
  delete outlook.dailyScoreSnapshot;

  assert.deepEqual(
    projectPierCastStandings(outlook).cities.map((city) => city.cityId),
    outlook.cities.map((city) => city.cityId),
  );
});

test("v3 owner standings include all twelve cities with variable species rosters", () => {
  const outlook = v3ReviewFixture();
  const standings = projectPierCastStandings(outlook);

  assert.equal(standings.generatedAt, outlook.generatedAt);
  assert.equal(standings.cities.length, 12);
  assert.deepEqual(
    standings.cities.map((city) => city.cityId),
    outlook.cities.map((city) => city.cityId),
  );
  assert.equal(
    new Set(outlook.cities.map((city) => city.dates[0].species.length)).size,
    3,
  );
});

test("public standings ignore owner-only supplemental outlooks", () => {
  const publicStandings = projectPierCastStandings(ownerReviewFixture());
  const projected = projectPierCastStandings(publicStandings, [
    wisconsinExpansionFixture(),
  ]);

  assert.equal(projected, publicStandings);
  assert.equal(
    projected.cities.some((city) => city.cityId === "port_washington_wi"),
    false,
  );
});
