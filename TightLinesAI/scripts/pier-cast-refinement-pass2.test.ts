import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { buildPierCastCatalog } from "../supabase/functions/_shared/pierCastEngine/config/catalog.ts";

const ui = read("components/pier-cast/PierCastConditionsUI.tsx");
const standings = read("components/pier-cast/PierCastStandings.tsx");
const standingsRules = read("lib/pierCastStandingsPresentation.ts");
const reportRules = read("lib/pierCastCityReportPresentation.ts");
const screen = read("app/pier-cast-review.tsx");
const contract = read("lib/pierCastConditionsV4.ts");
const edge = read("supabase/functions/pier-cast/index.ts");
const handler = read("supabase/functions/pier-cast/handler.ts");
const decision = read("docs/PierCast_Refinement_Pass2_Leaderboard_and_Reports.md");
const unifiedDecision = read("docs/onboarding/piercast/opportunity-v5-1.17/README.md");

test("conditions catalog v2 exposes only the discovery roster needed by city-first navigation", () => {
  assert.match(contract, /piercast-conditions-catalog-v2/);
  assert.match(contract, /supportedSpeciesIds: PierCastSpeciesId\[\]/);
  assert.match(edge, /supportedSpeciesIds: species\.map\(\(\{ speciesId \}\) => speciesId\)/);
  assert.doesNotMatch(edge.slice(edge.indexOf("readConditionsCatalog"), edge.indexOf("readLeaderboard")), /seasonalOpportunityCurve|ratingEnabled|score/);

  const catalog = buildPierCastCatalog("public", "v3");
  assert.ok(catalog.cities.length > 0);
  for (const city of catalog.cities) {
    assert.ok(city.species.length > 0, `${city.cityId} needs at least one supported target`);
    assert.equal(new Set(city.species.map((row) => row.speciesId)).size, city.species.length);
  }
});

test("leaderboard is species-specific with the documented ranking hierarchy", () => {
  assert.match(standings, /WHAT ARE YOU TARGETING\?/);
  assert.match(standings, /Each species gets its own ranking/);
  assert.match(standings, /Today’s opportunity drives the order/);
  assert.match(standings, /The exact score breaks label ties/);
  assert.match(standings, /Ordered by overall opportunity/);
  assert.match(unifiedDecision, /all 18 configured[\s\S]*254 admitted/i);
  assert.match(unifiedDecision, /Exact[\s\S]*opportunity orders rows/i);
  assert.match(decision, /seasonal band first/i); // preserved v4 history
  assert.doesNotMatch(standings + ui, /\/10|combined score/i);
});

test("temperature fit is compact and visually secondary on leaderboard rows", () => {
  // City-report species cards show water fit against the ideal range.
  assert.match(ui, /function WaterFitBar/);
  assert.match(ui, />WATER TODAY</);
  assert.match(ui, /Ideal \{card\.idealLine\}/);
  assert.match(reportRules, /export function pierCastWaterFit/);
  assert.match(reportRules, /thermal\.optimumRangeC/);
  assert.match(ui, /MODELED/);
  // Standings rows lead with the seasonal rating chip; water temp is a
  // secondary line derived from the thermal match.
  assert.match(standings, /<PierCastStatStrip band=\{band\} season=\{timingLabel\} compact \/>/);
  assert.match(standings, /standingsWaterLine\(row\.thermalMatch\)/);
  assert.match(standingsRules, /Water \$\{temperatureF\}°F · \$\{phrase\}/);
});

test("city finder works without a leaderboard selection and opens only supported targets", () => {
  assert.match(standings, /Find your PierCast/);
  assert.match(standings, /TextInput/);
  assert.match(standings, /Search a city/);
  assert.match(standings, /No pier cities match/);
  assert.match(standingsRules, /supported\.includes\(currentSpeciesId\)/);
  assert.match(screen, /finderReportSpecies\(city, selectedSpeciesRef\.current\)/);
  assert.match(screen, /openCityForSpecies\(cityId, speciesId\)/);
  assert.doesNotMatch(standings, /disabled=\{!targetAvailable\}/);
});

test("city-first target changes are persisted and guarded against stale async responses", () => {
  assert.match(screen, /const openCityForSpecies = useCallback/);
  assert.match(screen, /city\.supportedSpeciesIds\.includes\(speciesId\)/);
  assert.match(screen, /const requestId = \+\+selectionRequest\.current/);
  assert.match(screen, /selectionRequest\.current !== requestId/);
  assert.match(screen, /selectedSpeciesRef\.current !== speciesId/);
  assert.match(screen, /const cityReportRequest = useRef\(0\)/);
  assert.match(screen, /cityReportRequest\.current !== reportRequestId/);
  assert.match(screen, /writePierCastTargetPreference\(speciesId\)/);
  assert.match(screen, /router\.setParams\(\{ speciesId \}\)/);
  assert.match(screen, /void loadCityReport\(cityId, speciesId\)/);
});

test("city reports are city-first and separate today, season, and water", () => {
  assert.match(ui, /Tap a species to see where it ranks/);
  assert.match(ui, /<PierCastStatStrip/);
  assert.match(ui, />WATER TODAY</);
  assert.match(ui, /Best bet each day/);
  assert.match(ui, /TOP PICK TODAY/);
  assert.doesNotMatch(ui, /YOUR TARGET|CHANGE TARGET/);
  assert.match(reportRules, /comparePierCastSpeciesConditionsV4/);
  assert.match(contract, /export function comparePierCastSpeciesConditionsV4/);
  assert.match(ui, /report\.disclosure/);
});

test("refinement preserves the visual system and legacy API isolation", () => {
  assert.match(ui, /paper\.dashboardInk/);
  assert.match(ui, /paperFonts\.display/);
  assert.match(ui, /CornerMarkSet/);
  assert.match(ui, /TopographicLines/);
  assert.match(ui, /paperShadows\.hard/);
  assert.match(handler, /score-v3-compatibility/);
  assert.match(edge, /pier_cast_legacy_api_used/);
  assert.doesNotMatch(handler, /supportedSpeciesIds/);
  assert.match(decision, /No live deployment/i);
});

function read(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}
