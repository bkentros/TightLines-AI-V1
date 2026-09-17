import assert from "node:assert/strict";
import test from "node:test";
import type {
  PierCastReviewDateOutlookRead,
  PierCastV3ReviewOutlookResponse,
} from "../lib/pierCastContracts";
import {
  presentPierCastDate,
  PRIMARY_PIER_CAST_SPECIES,
} from "../lib/pierCastSpeciesPresentation";
import { projectPierCastStandings } from "../lib/pierCastStandings";

test("city and standings headlines use primary species, including lake trout", () => {
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
    speciesId: "bluegill" | "coho_salmon" | "yellow_perch" | "lake_trout",
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
      overall: available(9),
      drivingSpeciesId: "bluegill",
    },
    species: [
      species("bluegill", 9),
      species("yellow_perch", 8),
      species("coho_salmon", 6),
      species("lake_trout", 7),
    ],
  } as unknown as PierCastReviewDateOutlookRead;

  const displayed = presentPierCastDate(date);
  assert.deepEqual(displayed.species.map((row) => row.speciesId), [
    "yellow_perch",
    "coho_salmon",
    "lake_trout",
  ]);
  assert.equal(displayed.headline.drivingSpeciesId, "lake_trout");
  assert.equal(displayed.headline.overall.score, 7);
  assert.equal(date.headline.drivingSpeciesId, "bluegill");
  assert.equal(PRIMARY_PIER_CAST_SPECIES.has("lake_trout"), true);

  const withoutLakeTrout = presentPierCastDate({
    ...date,
    species: date.species.filter((row) => row.speciesId !== "lake_trout"),
  });
  assert.equal(withoutLakeTrout.headline.drivingSpeciesId, "coho_salmon");
  assert.equal(withoutLakeTrout.headline.overall.score, 6);

  const standings = projectPierCastStandings({
    mode: "v3_shadow_review",
    generatedAt: "2026-08-15T12:00:00.000Z",
    cities: [{ cityId: "grand_haven_mi", dates: [date] }],
  } as unknown as PierCastV3ReviewOutlookResponse);
  assert.equal(
    standings.cities[0]?.dates[0]?.headline.drivingSpeciesId,
    "lake_trout",
  );
  assert.equal(standings.cities[0]?.dates[0]?.headline.overall.score, 7);
});
