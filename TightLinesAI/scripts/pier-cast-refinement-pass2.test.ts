import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { buildPierCastCatalog } from "../supabase/functions/_shared/pierCastEngine/config/catalog.ts";

const ui = read("components/pier-cast/PierCastConditionsUI.tsx");
const screen = read("app/pier-cast-review.tsx");
const contract = read("lib/pierCastConditionsV4.ts");
const edge = read("supabase/functions/pier-cast/index.ts");
const handler = read("supabase/functions/pier-cast/handler.ts");
const decision = read("docs/PierCast_Refinement_Pass2_Leaderboard_and_Reports.md");

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

test("leaderboard stays opt-in and species-specific with the documented ranking hierarchy", () => {
  assert.match(ui, /What are you targeting\?/);
  assert.match(ui, /There is no universal best pier/);
  assert.match(ui, /typical seasonal outlook, then exact temperature match/);
  assert.match(ui, /SPECIES-SPECIFIC RANKING/);
  assert.match(decision, /seasonal band first/i);
  assert.match(decision, /temperature fit.*within/i);
  assert.doesNotMatch(ui, /\/10|combined score/i);
});

test("temperature fit is compact and visually secondary on leaderboard rows", () => {
  assert.match(ui, /function TemperatureFitIndicator/);
  assert.match(ui, />TEMP FIT</);
  assert.match(ui, /temperatureFitSwatch/);
  assert.match(ui, /standingPills}><ConditionPill band=\{seasonalBand\} kind="seasonal"/);
  assert.match(ui, /TemperatureFitIndicator[\s\S]*temperatureC/);
  assert.match(ui, /MODELED/);
});

test("city finder works without a leaderboard selection and offers only supported targets", () => {
  assert.match(ui, /SELECT YOUR PIERCAST/);
  assert.match(ui, /Search directly—no leaderboard selection required/);
  assert.match(ui, /TextInput/);
  assert.match(ui, /Search city or state/);
  assert.match(ui, /citySupportedSpeciesIds/);
  assert.match(ui, /CHOOSE A TARGET FOR/);
  assert.match(ui, /onOpenCityForSpecies\(pendingCity\.cityId, option\.speciesId\)/);
  assert.doesNotMatch(ui, /disabled=\{!targetAvailable\}/);
  assert.match(ui, /No matching cities/);
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
  assert.match(screen, /await loadCityReport\(cityId, speciesId\)/);
});

test("city reports keep typical timing separate from modeled surface compatibility", () => {
  assert.match(ui, /TYPICAL TARGET TIMING/);
  assert.match(ui, /MODELED SURFACE TEMP FIT/);
  assert.match(ui, /Surface compatibility, not fish presence/);
  assert.match(ui, /sets the leaderboard group/);
  assert.match(ui, /orders cities within the same seasonal group/);
  assert.match(ui, /does not claim fish are present or at the surface/);
  assert.match(ui, /Local fishery context[\s\S]*never boosts a city’s ranking/);
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
