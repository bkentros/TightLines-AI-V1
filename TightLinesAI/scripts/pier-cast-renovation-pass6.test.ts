import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const screen = read("app/pier-cast-review.tsx");
const conditionsUi = read("components/pier-cast/PierCastConditionsUI.tsx");
const conditionsSupport = read("components/pier-cast/PierCastConditionsSupport.tsx");
const visuals = read("components/pier-cast/PierCastVisuals.tsx");
const client = read("lib/pierCast.ts");
const handler = read("supabase/functions/pier-cast/handler.ts");
const edge = read("supabase/functions/pier-cast/index.ts");
const guide = read("app/how-it-works.tsx");
const map = read("app/pier-cast-map.tsx");
const matrix = JSON.parse(read("docs/PierCast_Renovation_Pass6_Visual_Matrix.json"));

test("shipping PierCast screen has no retired public score consumer", () => {
  const shippingUi = screen + conditionsUi + conditionsSupport + visuals;
  for (const retired of [
    "fetchPierCastLeaderboard",
    "fetchPierCastCatalog",
    "fetchPierCastTemperatureMap",
    "fetchPierCastCityReport",
    "fetchSavedPierCastReport",
    "PierCastScoreGauge",
    "PierCastMiniBar",
  ]) {
    assert.doesNotMatch(shippingUi + client, new RegExp(retired));
  }
  assert.doesNotMatch(shippingUi, /score\.toFixed|\/10|SCORE \/ 10/);
  assert.match(screen, /fetchPierCastConditionsLeaderboard/);
  assert.match(screen, /fetchPierCastConditionsCatalog/);
  assert.match(screen, /fetchPierCastConditionsCityReport/);
  assert.match(screen, /fetchSavedPierCastConditionsReport/);
});

test("older installed clients retain isolated, observable compatibility routes", () => {
  for (const route of ["leaderboard", "temperature-map", "report", "saved-report"]) {
    assert.match(handler, new RegExp(`"${route}"`));
  }
  assert.match(handler, /Deprecation": "true"/);
  assert.match(handler, /score-v3-compatibility/);
  assert.match(handler, /X-PierCast-Replacement/);
  assert.match(handler, /recordLegacyRouteUse/);
  assert.match(handler, /observability failed/);
  assert.match(edge, /pier_cast_legacy_api_used/);
  assert.match(edge, /replacement: "conditions-v4"/);
});

test("current conditions routes declare the v4 response contract", () => {
  assert.match(handler, /X-PierCast-Contract": "conditions-v4"/);
  assert.match(handler, /conditionsCatalog \|\| conditionsLeaderboard \|\| conditionsMap/);
  assert.match(handler, /observedTemperatureMap/);
  assert.match(handler, /Access-Control-Expose-Headers/);
  assert.match(handler, /conditions\/catalog/);
  assert.match(client, /piercast-conditions-catalog-v2|conditions\/catalog/);
  assert.match(edge, /disclosure: PIER_CAST_V4_DISCLOSURE/);
  assert.doesNotMatch(edge, /disclosure: catalog\.disclosure/);
});

test("release copy describes target conditions instead of a universal numeric rating", () => {
  const pierCastGuide = guide.slice(guide.indexOf('title: "Pier Cast"'), guide.indexOf('title: "Color Match"'));
  assert.match(pierCastGuide, /Choose a target species first/);
  assert.match(pierCastGuide, /seasonal outlook/);
  assert.match(pierCastGuide, /temperature match/);
  assert.match(pierCastGuide, /32 researched pier cities/);
  assert.match(pierCastGuide, /observed station readings/);
  assert.doesNotMatch(pierCastGuide, /compare live observations/);
  assert.doesNotMatch(pierCastGuide, /1\\u201310 rating|1–10 rating|score/i);
});

test("unsupported city targets route through a supported-target chooser and stale requests are rejected", () => {
  assert.match(conditionsUi, /choose a supported target/);
  assert.match(conditionsUi, /citySupportedSpeciesIds/);
  assert.match(screen, /city\.supportedSpeciesIds\.includes\(speciesId\)/);
  assert.match(conditionsUi, /RESTRICTED/);
  assert.match(screen, /leaderboard\?\.selectedSpeciesId !== target/);
  assert.match(screen, /selectedSpeciesRef\.current !== target/);
});

test("loading, stale, missing, restricted, access, and long-copy states are explicit", () => {
  assert.match(screen, /PierCastConditionsSkeleton/);
  assert.match(screen, /archived_legacy/);
  assert.match(conditionsUi, /Showing your last saved conditions report/);
  assert.match(conditionsUi, /Missing, stale, or restricted conditions/);
  assert.match(conditionsUi, /Targeting restricted/);
  assert.match(conditionsSupport, /reported closed/);
  assert.match(conditionsSupport, /pierChipBody: \{ flex: 1, minWidth: 0 \}/);
  assert.match(conditionsSupport, /headingCopy: \{ flex: 1, minWidth: 0 \}/);
});

test("rapid target changes cannot commit an older leaderboard response", () => {
  assert.match(screen, /const selectionRequest = useRef\(0\)/);
  assert.match(screen, /const requestId = \+\+selectionRequest\.current/);
  assert.match(screen, /selectionRequest\.current === requestId/);
  assert.match(screen, /selectedSpeciesRef\.current === requestedTarget/);
});

test("visual matrix covers all required devices, text sizes, report states, and map permutations", () => {
  assert.equal(matrix.schemaVersion, "piercast-renovation-pass6-visual-matrix-v1");
  assert.deepEqual(matrix.viewports.map((item: { id: string }) => item.id), ["small", "standard", "large"]);
  assert.deepEqual(matrix.textSizes, ["default", "accessibility_extra_extra_large"]);
  for (const state of [
    "loading", "complete", "saved_stale_copy", "missing_conditions",
    "targeting_restricted", "reported_closed_access", "long_city_and_pier_names",
  ]) assert.ok(matrix.reportStates.includes(state), `missing report state ${state}`);
  assert.deepEqual(matrix.mapStates.timeModes, ["now", "forecast"]);
  assert.deepEqual(matrix.mapStates.layers, ["match", "temperature", "bathymetry"]);
  assert.deepEqual(matrix.mapStates.zoomLevels, ["great_lakes_overview", "shoreline"]);
  assert.ok(matrix.approvalRules.length >= 7);
});

test("map still exposes the full resolved Now and Forecast product", () => {
  assert.match(map, /chooseTimeMode/);
  assert.match(map, /setMode\("match"\)/);
  assert.match(map, /setMode\("temperature"\)/);
  assert.match(map, /setMode\("bathymetry"\)/);
  assert.match(map, /timeMode === "now" && observationsVisible/);
  assert.match(map, /windVisible/);
});

function read(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}
