import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import type {
  PierCastReviewDateOutlookRead,
  PierCastV3ReviewOutlookResponse,
} from "../lib/pierCastContracts";
import {
  formatPierCastModeId,
  formatPierCastSeasonalPotential,
  isPrimaryPierCastSpecies,
  pierCastSeasonalTrend,
  pierCastSpeciesShortLabel,
  presentPierCastDate,
  PRIMARY_PIER_CAST_SPECIES,
  sortPierCastSpeciesByOpportunity,
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

test("warm-water species never drive a city or leaderboard headline", () => {
  const available = (score: number) => ({
    status: "available" as const,
    score,
    displayScore: score,
    displayText: `${score}/10` as `${number}/10`,
    label: "Fair" as const,
    ratingName: "FinFindr Opportunity Rating" as const,
    rubricVersion: "test",
  });
  const species = (
    speciesId: "bluegill" | "walleye" | "smallmouth_bass" | "steelhead",
    score: number,
  ) => ({
    speciesId,
    biological: available(score),
    coverage: { status: "complete" as const },
    targetingEligibility: "eligible" as const,
    promotion: { status: "blocked" as const, reasonCodes: [] },
  });
  const date = {
    localDate: "2026-09-21",
    headline: {
      overall: available(9),
      drivingSpeciesId: "bluegill",
    },
    species: [
      species("bluegill", 9),
      species("smallmouth_bass", 4.4),
      species("walleye", 4.3),
      species("steelhead", 3.2),
    ],
  } as unknown as PierCastReviewDateOutlookRead;

  const tawas = presentPierCastDate(date);
  assert.equal(tawas.headline.drivingSpeciesId, "steelhead");
  assert.equal(tawas.headline.overall.displayScore, 3.2);
  assert.equal(tawas.species.some((row) => row.speciesId === "bluegill"), false);

  const caseville = presentPierCastDate({
    ...date,
    species: date.species.filter((row) => row.speciesId !== "steelhead"),
  });
  assert.equal(caseville.headline.drivingSpeciesId, null);
  assert.equal(caseville.headline.overall.status, "unavailable");

  assert.equal(isPrimaryPierCastSpecies("walleye"), false);
  assert.equal(isPrimaryPierCastSpecies("smallmouth_bass"), false);
  assert.equal(isPrimaryPierCastSpecies("freshwater_drum"), true);
});

test("species cards use raw opportunity score instead of rounded display ties", () => {
  const row = (
    speciesId: "chinook_salmon" | "coho_salmon",
    score: number,
  ) => ({
    speciesId,
    biological: {
      status: "available" as const,
      score,
      displayScore: 6.9,
      displayText: "6.9/10" as const,
      label: "Good" as const,
      ratingName: "FinFindr Opportunity Rating" as const,
      rubricVersion: "test",
    },
  });
  const sorted = sortPierCastSpeciesByOpportunity(
    [
      row("chinook_salmon", 6.94),
      row("coho_salmon", 6.96),
    ] as unknown as PierCastReviewDateOutlookRead["species"],
  );
  assert.deepEqual(sorted.map((species) => species.speciesId), [
    "coho_salmon",
    "chinook_salmon",
  ]);
});

test("season presentation identifies trend, mode handoff, and estimated precision", () => {
  const date = (
    localDate: string,
    seasonalPotential: number,
    modeId: string,
  ) =>
    ({
      localDate,
      species: [{
        speciesId: "coho_salmon",
        seasonalRating: seasonalPotential,
        activeMode: {
          modeCalibrationId: `${modeId}-test`,
          modeId,
          fisheryStrength: 8.2,
          seasonalAvailability: 0.8,
          seasonalPotential,
          thermalCurveId: "coho-test",
        },
      }],
    }) as unknown as PierCastReviewDateOutlookRead;
  const dates = [
    date("2027-08-19", 3.0, "summer_coldwater_access"),
    date("2027-08-20", 2.8, "fall_harbor_staging"),
    date("2027-08-21", 2.9, "fall_harbor_staging"),
  ];

  assert.deepEqual(
    pierCastSeasonalTrend({
      dates,
      selectedIndex: 1,
      speciesId: "coho_salmon",
    }),
    { direction: "turning_up", label: "TURNING UP", modeShift: true },
  );
  assert.equal(formatPierCastSeasonalPotential(7.066), "~7.1");
  assert.equal(formatPierCastSeasonalPotential(null), "—");
  assert.equal(formatPierCastSeasonalPotential(Number.NaN), "—");
  assert.equal(
    formatPierCastModeId("fall_harbor_staging"),
    "FALL HARBOR STAGING",
  );
  assert.equal(pierCastSpeciesShortLabel("chinook_salmon"), "CHINOOK");
});

test("PierCast UI exposes top-target handoffs and estimated seasonal context", () => {
  const source = readFileSync(
    new URL("../app/pier-cast-review.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /`TOP \$\{topSpeciesLabel\}`/);
  assert.match(source, /top target \$\{SPECIES_LABELS\[topSpeciesId\]\}/);
  assert.match(source, /sortPierCastSpeciesByOpportunity\(date\.species\)/);
  assert.match(source, />SEASON POTENTIAL</);
  assert.match(source, /formatPierCastSeasonalPotential\(seasonalPotential\)/);
  assert.match(source, /seasonalTrend\.modeShift \? "MODE SHIFT"/);
});
