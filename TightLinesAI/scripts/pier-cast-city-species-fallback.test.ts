import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { pierCastReportSpeciesOrBest } from "../lib/pierCastCityReportPresentation";

const species = (speciesId: string) => ({ speciesId }) as any;

test("an unavailable city target falls back to the city's current best species", () => {
  const report = {
    selectedSpeciesId: "chinook_salmon",
    species: [species("chinook_salmon"), species("coho_salmon"), species("steelhead")],
    dailyOutlook: [{ best: { speciesId: "coho_salmon" } }],
  } as any;

  assert.equal(
    pierCastReportSpeciesOrBest(report, "atlantic_salmon"),
    "coho_salmon",
  );
  assert.equal(pierCastReportSpeciesOrBest(report, "steelhead"), "steelhead");
});

test("fallback remains compatible with older reports without daily outlook", () => {
  assert.equal(pierCastReportSpeciesOrBest({
    selectedSpeciesId: "brown_trout",
    species: [species("brown_trout"), species("steelhead")],
  }, "lake_trout"), "brown_trout");
});

test("the 1.16 route bypasses the missing leaderboard row and explains the substitution", () => {
  const screen = readFileSync("app/pier-cast-review.tsx", "utf8");
  const report = readFileSync("components/pier-cast/PierCastConditionsUI.tsx", "utf8");

  assert.match(screen, /finderReportSpecies\(city, target\)/);
  assert.match(screen, /loadCityReport\(cityId, reportSpeciesId, silent, target\)/);
  assert.match(screen, /pierCastReportSpeciesOrBest/);
  assert.match(report, /isn&apos;t forecast here — showing/);
  assert.match(report, /accessibilityState=\{\{ selected \}\}/);
});
