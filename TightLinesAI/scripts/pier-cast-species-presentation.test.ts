import assert from "node:assert/strict";
import test from "node:test";
import type {
  PierCastReviewDateOutlookRead,
  PierCastV3ReviewOutlookResponse,
} from "../lib/pierCastContracts";
import {
  presentPierCastDate,
  presentPierCastStandingsDate,
} from "../lib/pierCastSpeciesPresentation";
import { projectPierCastStandings } from "../lib/pierCastStandings";

test("hidden bluegill cannot lead or appear in a displayed forecast", () => {
  const available = (score: number) => ({
    status: "available" as const,
    score,
    displayScore: score,
    displayText: `${score}/10` as `${number}/10`,
    label: "Good" as const,
    ratingName: "FinFindr Opportunity Rating" as const,
    rubricVersion: "test",
  });
  const species = (
    speciesId: "bluegill" | "coho_salmon" | "yellow_perch",
    score: number,
  ) => ({
    speciesId,
    biological: available(score),
    coverage: { status: "complete" as const },
    targetingEligibility: "eligible" as const,
    promotion: { status: "blocked" as const, reasonCodes: [] },
  });
  const date = {
    localDate: "2026-08-15",
    headline: {
      overall: available(8),
      drivingSpeciesId: "bluegill",
    },
    species: [
      species("bluegill", 8),
      species("yellow_perch", 7),
      species("coho_salmon", 6),
    ],
  } as unknown as PierCastReviewDateOutlookRead;

  const displayed = presentPierCastDate(date);
  assert.deepEqual(displayed.species.map((row) => row.speciesId), [
    "yellow_perch",
    "coho_salmon",
  ]);
  assert.equal(displayed.headline.drivingSpeciesId, "yellow_perch");
  assert.equal(displayed.headline.overall.score, 7);
  assert.equal(date.headline.drivingSpeciesId, "bluegill");

  const standingsDate = presentPierCastStandingsDate(date);
  assert.equal(standingsDate.headline.drivingSpeciesId, "coho_salmon");
  assert.equal(standingsDate.headline.overall.score, 6);

  const standings = projectPierCastStandings({
    mode: "v3_shadow_review",
    generatedAt: "2026-08-15T12:00:00.000Z",
    cities: [{ cityId: "grand_haven_mi", dates: [date] }],
  } as unknown as PierCastV3ReviewOutlookResponse);
  assert.equal(
    standings.cities[0]?.dates[0]?.headline.drivingSpeciesId,
    "coho_salmon",
  );
  assert.equal(standings.cities[0]?.dates[0]?.headline.overall.score, 6);
});
