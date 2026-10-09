import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  fahrenheit,
  formatConditionsFreshness,
  formatDistanceFromOptimum,
  formatOptimumRange,
  formatSeasonTrend,
  formatWaterTemperature,
} from "../lib/pierCastConditionsPresentation";
import { pickDefaultStandingsSpecies } from "../lib/pierCastStandingsPresentation";
import { parsePierCastTargetSpecies } from "../lib/pierCastTargetPreference";

const screen = read("app/pier-cast-review.tsx");
const conditionsUi = read("components/pier-cast/PierCastConditionsUI.tsx");
const standings = read("components/pier-cast/PierCastStandings.tsx");
const standingsRules = read("lib/pierCastStandingsPresentation.ts");
const reportRules = read("lib/pierCastCityReportPresentation.ts");
const targetPreference = read("lib/pierCastTargetPreference.ts");
const client = read("lib/pierCast.ts");
const map = read("legacy/pier-cast-map-v1.tsx") /* retired first map */;
const contract = read("docs/PierCast_Renovation_Pass1_Product_Contract.md");

test("first visit picks from summary metadata without a leaderboard fan-out", () => {
  assert.match(standings, /WHAT ARE YOU TARGETING\?/);
  assert.match(standings, /leaderboard\.selectionRequired/);
  assert.match(screen, /readPierCastTargetPreference/);
  assert.match(screen, /fetchPierCastConditionsLeaderboardForApp\(requestedTarget \?\? undefined\)/);
  assert.match(screen, /pickFallbackStandingsSpecies\(nextLeaderboard\.targetSpecies\)/);
  assert.doesNotMatch(screen, /Promise\.allSettled\([\s\S]*candidates\.map/);
  assert.doesNotMatch(screen, /PIER_CAST_SALMONID_ORDER\.filter/);
  assert.doesNotMatch(screen, /setSelectedSpeciesId\([^\n]*targetSpecies\[0\]/);
  const autoPick = screen.slice(screen.indexOf("if (!requestedTarget) {"), screen.indexOf("rememberLakes(seenBoards)"));
  assert.ok(autoPick.length > 0);
  assert.doesNotMatch(autoPick, /writePierCastTargetPreference/);
  assert.match(standingsRules, /isPierCastSalmonid\(speciesId\)/);

  const board = (speciesId: string, band: string, value: number) => ({
    selectedSpeciesId: speciesId,
    cities: [{
      rankingDisposition: "ranked",
      seasonalOutlook: { status: "available", band },
      thermalMatch: { status: "available", value },
    }],
  }) as never;
  assert.equal(
    pickDefaultStandingsSpecies([
      board("yellow_perch", "excellent", 1),
      board("coho_salmon", "good", 0.9),
      board("chinook_salmon", "excellent", 0.7),
      board("steelhead", "excellent", 0.8),
    ]),
    "steelhead",
  );
  assert.equal(pickDefaultStandingsSpecies([board("walleye", "excellent", 1)]), null);
});

test("target preference is validated, persisted, and route-addressable", () => {
  assert.match(targetPreference, /tightlines_pier_cast_target_species_v1/);
  assert.match(targetPreference, /PIER_CAST_SPECIES_IDS\.has/);
  assert.match(targetPreference, /AsyncStorage\.getItem/);
  assert.match(targetPreference, /AsyncStorage\.setItem/);
  assert.match(screen, /router\.setParams\(\{ speciesId \}\)/);
  assert.match(screen, /speciesId\?: string \| string\[\]/);
  assert.equal(parsePierCastTargetSpecies("bluegill"), null);
});

test("leaderboard is species-specific and never renders a combined numeric score", () => {
  assert.match(standings, /Best for \$\{speciesShort\(selectedSpeciesId\)\} today/);
  assert.match(standings, /Each species gets its own ranking/);
  assert.match(standings, /TODAY'S LEADER/);
  assert.match(standings, /rankingDisposition === "ranked"/);
  assert.doesNotMatch(standings + conditionsUi, /\/10/);
  assert.doesNotMatch(standings + conditionsUi, /score\.toFixed/);
  assert.doesNotMatch(standings + conditionsUi, /strongest main species/i);
});

test("missing and restricted inputs remain explicitly unranked", () => {
  assert.match(standings, /Missing or updating data stays unrated instead of counting as poor fishing/);
  assert.match(standings, /Not rated today/);
  assert.match(standings, /standingsUnrankedReason\(row\)/);
  assert.match(standingsRules, /Closed to targeting here/);
  assert.match(reportRules, /standingsUnrankedReason\(species\)/);
  assert.match(conditionsUi, /NOT RATED/);
});

test("city report separates today's label, season timing, and water context", () => {
  assert.match(conditionsUi, /prefix="Today"/);
  assert.match(conditionsUi, /<SeasonTimingChip/);
  assert.match(conditionsUi, /spChips: \{ alignItems: "flex-start"/);
  assert.doesNotMatch(standings, /seasonChipText\]\} numberOfLines/);
  assert.match(conditionsUi, />WATER TODAY</);
  assert.match(conditionsUi, /<WaterFitBar card=\{card\} \/>/);
  assert.match(reportRules, /standingsOutlookTimingLabel\(outlook\)/);
  assert.match(reportRules, /standingsWaterPhrase\(species\.thermalMatch\)/);
});

test("city report includes the calendar, species, pier conditions, chart, shifts, and provenance", () => {
  assert.match(conditionsUi, /FIVE-DAY OUTLOOK/);
  assert.match(conditionsUi, /Supported species at \$\{report\.displayName\}/);
  assert.match(conditionsUi, /RIGHT NOW AT THE PIER/);
  assert.match(conditionsUi, />WATER</);
  assert.match(conditionsUi, />AIR</);
  assert.match(conditionsUi, />WIND</);
  assert.match(conditionsUi, /Temperature outlook/);
  assert.match(conditionsUi, /Water temp shifts/);
  assert.match(conditionsUi, /Water temps are NOAA nearshore model estimates/);
  assert.match(conditionsUi, /NEARBY PORTS/);
  assert.match(conditionsUi, /WHERE TO FISH/);
  assert.doesNotMatch(conditionsUi, /CHANGE TARGET|OTHER SPECIES/);
});

test("authenticated v4 report and saved-report recovery are fully wired", () => {
  assert.match(client, /conditions\/report\?cityId=/);
  assert.match(client, /conditions\/saved-report/);
  assert.match(screen, /fetchPierCastConditionsCityReportForApp\(cityId, target\)/);
  assert.match(screen, /fetchSavedPierCastConditionsReport\(target\)/);
  assert.match(screen, /saved\.envelope\.report\.cityId === cityId/);
  assert.match(conditionsUi, /Showing your last saved conditions report/);
  assert.match(screen, /previous score report is archived/);
});

test("selected species follows the user between standings, report, and map", () => {
  assert.match(screen, /pathname: "\/pier-cast-map"/);
  assert.match(screen, /params: selectedSpeciesId \? \{ speciesId: selectedSpeciesId \}/);
  assert.match(map, /readPierCastTargetPreference/);
  assert.match(map, /lastAppliedRouteSpecies\.current !== routeSpeciesId/);
  assert.match(map, /conditionsRequest\.current !== requestId/);
  assert.match(map, /\.\.\.\(selectedSpeciesId \? \{ speciesId: selectedSpeciesId \} : \{\}\)/);
  assert.match(map, /pathname: "\/pier-cast-review"/);
});

test("the v4 cutover retains the frozen PierCast visual language", () => {
  assert.match(conditionsUi, /paper\.dashboardInk/);
  assert.match(conditionsUi, /paperFonts\.display/);
  assert.match(conditionsUi, /paperFonts\.metaMonoBold/);
  assert.match(conditionsUi, /CornerMarkSet/);
  assert.match(conditionsUi, /TopographicLines/);
  assert.match(conditionsUi, /paperShadows\.hard/);
  assert.match(standings, /paper\.medalGold[\s\S]*paper\.medalBronze/);
  assert.match(standings, /TopographicLines/);
  assert.match(conditionsUi, /PierCastCityTemperatureChart/);
  assert.match(contract, /alter information hierarchy, not the design language/i);
});

test("conditions presentation converts temperatures and freshness deterministically", () => {
  assert.equal(fahrenheit(0), 32);
  assert.equal(fahrenheit(10), 50);
  assert.equal(formatWaterTemperature(10), "50.0°F");
  assert.equal(formatWaterTemperature(null), "—");
  assert.equal(formatOptimumRange([10, 15]), "50–59°F");
  assert.equal(formatDistanceFromOptimum(0), "Inside optimum range");
  assert.equal(formatDistanceFromOptimum(1), "1.8°F outside optimum");
  assert.equal(formatSeasonTrend("active", "steady"), "Active · Steady");
  assert.equal(
    formatConditionsFreshness("2026-09-27T12:00:00.000Z", Date.parse("2026-09-27T12:42:00.000Z")),
    "Updated 42m ago",
  );
});

function read(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}
