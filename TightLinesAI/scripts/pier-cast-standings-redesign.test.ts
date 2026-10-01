/**
 * PierCast Standings redesign (2026-09-29): every word on the leaderboard is
 * derived from v4 server fields. See lib/pierCastStandingsPresentation.ts.
 */
import assert from "node:assert/strict";
import test from "node:test";

import * as P from "../lib/pierCastStandingsPresentation";

function thermal(tempC: number, lo: number, hi: number, band: string, value = 0.9) {
  const dist = tempC < lo ? lo - tempC : tempC > hi ? tempC - hi : 0;
  return { status: "available", value, band, temperatureC: tempC, optimumRangeC: [lo, hi], distanceFromOptimumC: dist, curveId: "c", validAt: "2026-09-29T12:00:00Z", sourceKind: "model", reasonCodes: [] } as any;
}
function row(o: any) {
  return {
    speciesId: o.speciesId ?? "chinook_salmon", cityId: o.cityId, displayName: o.cityId, lakeId: o.lakeId ?? "michigan", stateCode: "MI", timezone: "America/Detroit", rank: o.rank ?? null,
    seasonalOutlook: o.band ? { status: "available", value: 0.8, band: o.band, stage: o.stage ?? "active", trend: o.trend ?? "steady", profileId: "p", basis: "regional", localDate: "2026-09-29", reasonCodes: [] }
      : { status: "unavailable", value: null, band: null, stage: null, trend: null, profileId: null, basis: null, localDate: "2026-09-29", reasonCodes: o.seasonCodes ?? [] },
    thermalMatch: o.thermal ?? { status: "unavailable", value: null, band: null, temperatureC: null, optimumRangeC: null, distanceFromOptimumC: null, curveId: null, validAt: null, sourceKind: "model", reasonCodes: o.thermalCodes ?? [] },
    targetingEligibility: o.elig ?? "eligible", rankingDisposition: o.disp ?? "ranked", localFisheryContext: null, reasonCodes: o.codes ?? [],
  } as any;
}
function board(speciesId: any, rows: any[]) {
  return { schemaVersion: "piercast-conditions-v4", formulaVersion: "x", rankingVersion: "y", generatedAt: "2026-09-29T14:00:00Z", selectedSpeciesId: speciesId, selectionRequired: false, targetSpecies: [], cities: rows, disclosure: "" } as any;
}

test("Standings copy, ranking and default-species rules follow the server fields", () => {
  // Water phrase: inside range, direction, band wording
  assert.equal(P.standingsWaterPhrase(thermal(12, 10, 14, "excellent")), "right in range");
  assert.equal(P.standingsWaterPhrase(thermal(15, 10, 14, "excellent")), "a touch warm");
  assert.equal(P.standingsWaterPhrase(thermal(9, 10, 14, "good")), "a touch cool");
  assert.equal(P.standingsWaterPhrase(thermal(17, 10, 14, "fair")), "running warm");
  assert.equal(P.standingsWaterPhrase(thermal(4, 10, 14, "poor")), "too cool");
  assert.equal(P.standingsWaterLine(thermal(12.8, 10, 14, "excellent")), "Water 55°F · right in range");
  assert.equal(P.standingsWaterLine(row({ cityId: "x" }).thermalMatch), null);

  // Stage label: Peak only when active + Prime
  assert.equal(P.standingsStageLabel("active", "excellent"), "Peak season");
  assert.equal(P.standingsStageLabel("active", "good"), "In season");
  assert.equal(P.standingsStageLabel("fading", "fair"), "Season fading");

  // Leader summary never duplicates trend
  assert.equal(P.standingsLeaderSummary(row({ cityId: "a", band: "excellent", stage: "active", trend: "fading", thermal: thermal(12, 10, 14, "excellent") }), "Chinook"),
    "Peak season for Chinook here, and starting to fade. Water is 54°F — right in range.");
  assert.equal(P.standingsLeaderSummary(row({ cityId: "a", band: "fair", stage: "building", trend: "building", thermal: thermal(16, 10, 14, "fair") }), "Coho"),
    "Season building for Coho here. Water is 61°F — running warm.");

  // Unranked reasons
  assert.equal(P.standingsUnrankedReason(row({ cityId: "a", elig: "restricted", disp: "blocked" })), "Closed to targeting here");
  assert.equal(P.standingsUnrankedReason(row({ cityId: "a", band: "good", disp: "unranked", thermalCodes: ["temperature_stale"] })), "Water temp updating");
  assert.equal(P.standingsUnrankedReason(row({ cityId: "a", disp: "unranked", seasonCodes: ["seasonal_profile_missing"] })), "Season data unavailable");
  assert.equal(P.standingsUnrankedReason(row({ cityId: "a", disp: "unranked" })), "Not enough data today");

  // Default species: best leader band, then thermal, then salmonid order; non-salmonids never win
  const chinook = board("chinook_salmon", [row({ cityId: "a", band: "good", thermal: thermal(12, 10, 14, "excellent", 0.99) })]);
  const coho = board("coho_salmon", [row({ cityId: "b", band: "excellent", thermal: thermal(15, 10, 14, "good", 0.7) })]);
  const steel = board("steelhead", [row({ cityId: "c", band: "excellent", thermal: thermal(12, 10, 14, "excellent", 0.95) })]);
  const perch = board("yellow_perch", [row({ cityId: "d", band: "excellent", thermal: thermal(12, 10, 14, "excellent", 1) })]);
  assert.equal(P.pickDefaultStandingsSpecies([chinook, coho, steel, perch]), "steelhead");
  assert.equal(P.pickDefaultStandingsSpecies([chinook, coho]), "coho_salmon");
  const tieA = board("brown_trout", [row({ cityId: "e", band: "excellent", thermal: thermal(12, 10, 14, "excellent", 0.95) })]);
  assert.equal(P.pickDefaultStandingsSpecies([tieA, steel]), "steelhead"); // equal → salmonid order
  assert.equal(P.pickDefaultStandingsSpecies([perch]), null);
  const unrankedOnly = board("chinook_salmon", [row({ cityId: "a", disp: "unranked" })]);
  assert.equal(P.pickDefaultStandingsSpecies([unrankedOnly]), null);

  // Fallback species
  assert.equal(P.pickFallbackStandingsSpecies([
    { speciesId: "walleye", displayName: "", placement: "all_species", bestSeasonalBand: "fair", availableCityCount: 5 },
    { speciesId: "yellow_perch", displayName: "", placement: "commonly_targeted_now", bestSeasonalBand: "good", availableCityCount: 3 },
    { speciesId: "burbot", displayName: "", placement: "all_species", bestSeasonalBand: null, availableCityCount: 0 },
  ] as any), "yellow_perch");

  // Finder species rule
  const city = (ids: string[]) => ({ cityId: "x", supportedSpeciesIds: ids } as any);
  assert.equal(P.finderReportSpecies(city(["steelhead", "walleye"]), "walleye"), "walleye");
  assert.equal(P.finderReportSpecies(city(["walleye", "steelhead", "coho_salmon"]), "chinook_salmon"), "coho_salmon");
  assert.equal(P.finderReportSpecies(city(["walleye", "yellow_perch"]), "chinook_salmon"), "walleye");
  assert.equal(P.finderReportSpecies(city([]), "chinook_salmon"), null);

  // Lake cache merge keeps identity when unchanged
  const lakes0 = {};
  const lakes1 = P.mergePierCastCityLakes(lakes0, [chinook, board("walleye", [row({ cityId: "caseville", lakeId: "huron" })])]);
  assert.deepEqual(lakes1, { a: "michigan", caseville: "huron" });
  assert.equal(P.mergePierCastCityLakes(lakes1, [chinook]), lakes1);

  // Forecast date uses the outlook's local date
  assert.equal(P.standingsForecastDate(chinook), "Tue, Sep 29");

  // Trend cue
  assert.equal(P.standingsTrendCue("steady"), null);
  assert.equal(P.standingsTrendCue("building")?.icon, "arrow-up");
  assert.equal(P.parsePierCastLakeFilter("huron"), "huron");
  assert.equal(P.parsePierCastLakeFilter("bogus"), "all");
});
