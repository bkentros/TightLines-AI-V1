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
    /August 5, 2026/,
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
  "River Migration outputs are estimates and inferences",
  "They are not direct observations, fish counts",
  "Data may also be delayed, provisional, corrected, or unavailable",
]) {
  assert.ok(appLegal.includes(phrase), `In-app Terms missing: ${phrase}`);
  assert.ok(terms.includes(phrase), `Web Terms missing: ${phrase}`);
}

for (const phrase of [
  "safe-wading or boating instructions",
  "A Fishing Shape description addresses expected presentation workability only",
]) {
  assert.ok(appLegal.includes(phrase), `In-app Safety missing: ${phrase}`);
  assert.ok(safety.includes(phrase), `Web Safety missing: ${phrase}`);
}

console.log(
  "Legal QA passed: in-app and public disclosures are synchronized, inactive attribution claims are absent, and River Migration limitations remain intact.",
);
