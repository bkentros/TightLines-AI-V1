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
    /August 30, 2026/,
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
  "A listed access name does not guarantee legal parking",
  "Gauge, weather, and forecast data may also be delayed, provisional, modeled, corrected, incomplete, or unavailable",
]) {
  assert.ok(appLegal.includes(phrase), `In-app Terms missing: ${phrase}`);
  assert.ok(terms.includes(phrase), `Web Terms missing: ${phrase}`);
}

for (const phrase of [
  "safe-wading or boating instructions",
  "A Fishing Shape description addresses expected presentation workability only",
  "A Spot Finder listing or recommended river section does not confirm legal parking",
  "Dams, weirs, fish ladders, spillways, refuges",
  "Migration Stage, Activity Outlook, Seasonal Presence, Gauge Read, Fish Counts, and a Spot Finder recommendation",
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

for (const source of [appLegal, safety]) {
  assert.doesNotMatch(
    source,
    /Fishability score or description/,
    "Current Safety text must use Fishing Shape terminology",
  );
}

console.log(
  "Legal QA passed: the August 30 in-app and website disclosures cover River Migration, Spot Finder, access, sources, privacy, and current Fishing Shape terminology.",
);
