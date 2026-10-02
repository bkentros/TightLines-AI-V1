import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("../", import.meta.url));
const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const appLegal = readFileSync(`${appRoot}lib/legalDocuments.ts`, "utf8");
const privacy = readFileSync(`${repoRoot}legal-site/privacy/index.html`, "utf8");
const terms = readFileSync(`${repoRoot}legal-site/terms/index.html`, "utf8");
const safety = readFileSync(`${repoRoot}legal-site/safety/index.html`, "utf8");

for (const [name, source] of Object.entries({ appLegal, privacy, terms, safety })) {
  assert.match(
    source,
    /October 2, 2026/,
    `${name} must carry the current legal revision date`,
  );
}

for (const provider of ["U.S. Geological Survey (USGS)", "Monitor My Watershed"]) {
  assert.ok(appLegal.includes(provider), `In-app Privacy must name ${provider}`);
  assert.ok(privacy.includes(provider), `Web Privacy must name ${provider}`);
}

for (const phrase of ["Instally", "install-attribution identifiers", "creator referral attribution"]) {
  assert.ok(!appLegal.includes(phrase), `In-app Privacy must not claim inactive collection: ${phrase}`);
  assert.ok(!privacy.includes(phrase), `Web Privacy must not claim inactive collection: ${phrase}`);
}

for (const phrase of [
  "River Migration stage, activity, presence, and section outputs are estimates and inferences",
  "They are not direct observations, biological surveys, sonar readings, catch probabilities",
  "When an official Fish Counts card is shown, its number is a direct observation only at the named facility",
  "it is not total river abundance, a live fish-location report, catch probability",
  "Activity Outlook estimates conditional fish movement or responsiveness",
  "Spot Finder identifies configured public-access names and broad, stage-based starting sections",
  "A listed access name, pier, or city does not guarantee legal parking",
  "Gauge, buoy, weather, and forecast data may also be delayed, provisional, modeled, corrected, incomplete, or unavailable",
]) {
  assert.ok(appLegal.includes(phrase), `In-app Terms missing: ${phrase}`);
  assert.ok(terms.includes(phrase), `Web Terms missing: ${phrase}`);
}

for (const phrase of [
  "safe-wading or boating instructions",
  "A Fishing Shape description addresses expected presentation workability only",
  "A Spot Finder listing, recommended river section, or PierCast city does not confirm legal parking",
  "Dams, weirs, fish ladders, spillways, refuges",
  "Migration Stage, Activity Outlook, Seasonal Presence, Gauge Read, Fish Counts, a Spot Finder recommendation, a PierCast ranking, and Live Lake Map layers",
]) {
  assert.ok(appLegal.includes(phrase), `In-app Safety missing: ${phrase}`);
  assert.ok(safety.includes(phrase), `Web Safety missing: ${phrase}`);
}

for (const phrase of [
  "River Migration selections and interactions",
  "Spot Finder access names and river sections are configured public-location content",
  "Analytics may be associated with an account or user identifier when you are signed in",
  "Once opened, those third parties process information under their own privacy policies and practices",
]) {
  assert.ok(appLegal.includes(phrase), `In-app Privacy missing: ${phrase}`);
  assert.ok(privacy.includes(phrase), `Web Privacy missing: ${phrase}`);
}

for (const phrase of [
  "PierCast rankings combine a typical seasonal outlook",
  "Model values describe broad areas and can differ substantially from conditions at a specific pier",
  "Individual waves can be much larger",
  "The map is not a warning service",
  "binding individual arbitration",
  "Arbitration Opt-Out",
  "governed by the laws of the State of Florida",
  "Apple and its subsidiaries are third-party beneficiaries",
]) {
  assert.ok(appLegal.includes(phrase), `In-app Terms missing: ${phrase}`);
  assert.ok(terms.includes(phrase), `Web Terms missing: ${phrase}`);
}

for (const phrase of [
  "Waves can wash over piers and breakwalls without warning",
  "Water temperatures in FinFindr are estimates, not a measure of whether it is safe to enter the water",
]) {
  assert.ok(appLegal.includes(phrase), `In-app Safety missing: ${phrase}`);
  assert.ok(safety.includes(phrase), `Web Safety missing: ${phrase}`);
}

for (const phrase of [
  "PierCast and Live Lake Map information",
  "Cloudflare (hosting for finfindr.app and the Live Lake Map",
  "OpenFreeMap (map tiles based on OpenStreetMap data), Google Fonts, and the National Weather Service",
]) {
  assert.ok(appLegal.includes(phrase), `In-app Privacy missing: ${phrase}`);
  assert.ok(privacy.includes(phrase), `Web Privacy missing: ${phrase}`);
}

for (const source of [appLegal, safety]) {
  assert.doesNotMatch(
    source,
    /Fishability score or description/,
    "Current Safety text must use Fishing Shape terminology",
  );
}

console.log(
  "Legal QA passed: the October 2 in-app and website disclosures cover River Migration, Spot Finder, PierCast, the Live Lake Map, piers, arbitration, sources, privacy, and current Fishing Shape terminology.",
);
