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
import { parsePierCastTargetSpecies } from "../lib/pierCastTargetPreference";

const screen = read("app/pier-cast-review.tsx");
const conditionsUi = read("components/pier-cast/PierCastConditionsUI.tsx");
const targetPreference = read("lib/pierCastTargetPreference.ts");
const client = read("lib/pierCast.ts");
const map = read("app/pier-cast-map.tsx");
const contract = read("docs/PierCast_Renovation_Pass1_Product_Contract.md");

test("first visit requires an explicit target instead of choosing a default", () => {
  assert.match(conditionsUi, /What are you targeting\?/);
  assert.match(conditionsUi, /There is no universal best pier/);
  assert.match(conditionsUi, /leaderboard\.selectionRequired/);
  assert.match(screen, /readPierCastTargetPreference/);
  assert.match(screen, /fetchPierCastConditionsLeaderboard\(requestedTarget \?\? undefined\)/);
  assert.doesNotMatch(screen, /setSelectedSpeciesId\([^\n]*targetSpecies\[0\]/);
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
  assert.match(conditionsUi, /SPECIES-SPECIFIC RANKING/);
  assert.match(conditionsUi, /typical seasonal outlook, then exact temperature match/);
  assert.match(conditionsUi, /BEST COMPARABLE CONDITIONS/);
  assert.match(conditionsUi, /rankingDisposition === "ranked"/);
  assert.doesNotMatch(conditionsUi, /\/10/);
  assert.doesNotMatch(conditionsUi, /score\.toFixed/);
  assert.doesNotMatch(conditionsUi, /strongest main species/i);
});

test("missing and restricted inputs remain explicitly unranked", () => {
  assert.match(conditionsUi, /Missing, stale, or restricted conditions stay unavailable/);
  assert.match(conditionsUi, /this is not a poor rating/);
  assert.match(conditionsUi, /Targeting restricted/);
  assert.match(conditionsUi, /unranked due to unavailable or restricted inputs/);
});

test("city report keeps seasonal outlook and thermal match independent", () => {
  assert.match(conditionsUi, /TYPICAL TARGET TIMING/);
  assert.match(conditionsUi, /MODELED SURFACE TEMP FIT/);
  assert.match(conditionsUi, /Two truths, kept separate/);
  assert.match(conditionsUi, /one favorable input cannot hide the other/);
  assert.match(conditionsUi, /never boosts a city’s ranking/);
  assert.match(conditionsUi, /Local fishery context/);
});

test("city report includes target switching, model guidance, weather, and provenance", () => {
  assert.match(conditionsUi, /CHANGE TARGET/);
  assert.match(conditionsUi, /switching targets is immediate/);
  assert.match(conditionsUi, /Five-day temperature guidance/);
  assert.match(conditionsUi, /NEARSHORE WATER/);
  assert.match(conditionsUi, /NEARBY AIR/);
  assert.match(conditionsUi, /WIND/);
  assert.match(conditionsUi, /modeled values, not observed station readings/);
  assert.match(conditionsUi, /OTHER SPECIES/);
});

test("authenticated v4 report and saved-report recovery are fully wired", () => {
  assert.match(client, /conditions\/report\?cityId=/);
  assert.match(client, /conditions\/saved-report/);
  assert.match(screen, /fetchPierCastConditionsCityReport\(cityId, target\)/);
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
  assert.match(conditionsUi, /MEDAL_COLORS/);
  assert.match(conditionsUi, /PierCastTemperatureChart/);
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
