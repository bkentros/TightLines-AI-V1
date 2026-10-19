import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { buildPierCastCatalog } from "../supabase/functions/_shared/pierCastEngine/config/catalog.ts";

const ui = read("components/pier-cast/PierCastConditionsUI.tsx");
const landing = read("components/pier-cast/PierCastLanding.tsx");
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

test("1.18 retires the leaderboard: the landing never ranks cities", () => {
  // Pass-2 ranking history stays documented; the app no longer shows it.
  assert.match(unifiedDecision, /all 18 configured[\s\S]*254 admitted/i);
  assert.match(decision, /seasonal band first/i); // preserved v4 history
  assert.doesNotMatch(landing, /TODAY'S LEADER|CHASING THE LEADER|medalFor|medalBronze|\bRANK\b|#\{rank\}/);
  assert.doesNotMatch(landing + ui, /\/10|combined score/i);
});

test("temperature fit stays compact on city reports and saved piers", () => {
  assert.match(ui, /function WaterFitBar/);
  assert.match(ui, />WATER TODAY</);
  assert.match(ui, /Best range \{card\.bestRangeLine\}/);
  assert.match(reportRules, /export function pierCastWaterFit/);
  assert.match(reportRules, /thermal\.optimumRangeC/);
  assert.match(ui, /MODELED/);
  assert.match(landing, /<PierCastWaterGauge fit=\{fit\} \/>/);
  assert.match(landing, /pierCastWaterFitLabelV18\(thermal\)/);
});

test("city finder opens only supported targets", () => {
  assert.match(landing, /FIND YOUR PIERCAST/);
  assert.match(landing, /TextInput/);
  assert.match(landing, /City or state/);
  assert.match(landing, /No pier cities match/);
  assert.match(standingsRules, /supported\.includes\(currentSpeciesId\)/);
  assert.match(screen, /finderReportSpecies\(city, targetRef\.current\)/);
});

test("city reports are guarded against stale async responses", () => {
  assert.match(screen, /const cityReportRequest = useRef\(0\)/);
  assert.match(screen, /cityReportRequest\.current !== reportRequestId/);
  assert.match(screen, /accountId\.current !== userId/);
  assert.match(screen, /writePierCastTargetPreference\(routeSpeciesId\)/);
});

test("city reports are city-first and separate today, season, and water", () => {
  assert.match(ui, /Today's rating and water fit for every species/);
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
