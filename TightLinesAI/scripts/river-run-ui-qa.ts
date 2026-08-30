import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  riverRunRiverChoices,
  riverRunStateChoices,
} from "../lib/riverRunCatalogSelection";
import type { RiverRunCatalogResponse } from "../lib/riverRunContracts";

const root = resolve(import.meta.dirname, "..");
const riverRunScreen = readFileSync(resolve(root, "app/river-run.tsx"), "utf8");
const catalogSelection = readFileSync(
  resolve(root, "lib/riverRunCatalogSelection.ts"),
  "utf8",
);
const speciesImages = readFileSync(
  resolve(root, "lib/riverRunSpeciesImages.ts"),
  "utf8",
);
const riverImages = readFileSync(
  resolve(root, "lib/riverRunChoiceImages.ts"),
  "utf8",
);
const riverRunVisualSources = [
  "lib/riverRunVisuals.ts",
  "components/river-run/RiverRunVisual.tsx",
].map((path) => readFileSync(resolve(root, path), "utf8")).join("\n");
const packageJson = JSON.parse(
  readFileSync(resolve(root, "package.json"), "utf8"),
) as { scripts?: Record<string, string> };

const prohibitedRuntimePatterns: Array<[RegExp, string]> = [
  [/riverRunReviewFixtures/, "generated River Run fixture imports"],
  [/EXPO_PUBLIC_RIVER_RUN_REVIEW_MODE/, "the River Run review-mode flag"],
  [/\bReviewControl\b/, "the internal review console"],
  [/\bScenario Fixtures?\b/i, "scenario-fixture UI copy"],
  [/\bOwner Review\b/i, "owner-review UI copy"],
  [/\bAudit Only\b/i, "audit-only UI copy"],
  [/\bPrimitive or Test Area\b/i, "test-area UI copy"],
  [/\bDevelopment Review\b/i, "development-review UI copy"],
  [/\bPushHistoryDropdown\b/, "the retired Push-history control"],
];

for (const [pattern, label] of prohibitedRuntimePatterns) {
  assert.doesNotMatch(
    riverRunScreen,
    pattern,
    `Release River Migration UI must not contain ${label}`,
  );
}

for (
  const [pattern, label] of [
    [/"run_timing"/, "the retired Migration Timing visual kind"],
    [/case\s+"push"/, "the retired Push visual kind"],
    [/\bTimingArt\b/, "the retired Migration Timing artwork"],
    [/\bPushArt\b/, "the retired Push artwork"],
  ] as Array<[RegExp, string]>
) {
  assert.doesNotMatch(
    riverRunVisualSources,
    pattern,
    `Release River Migration visuals must not contain ${label}`,
  );
}

assert.match(
  riverRunScreen,
  /ownerReviewMode\s*=\s*isAdminEmail\(user\?\.email\)/,
  "Draft River Migration access must be restricted to the configured admin account",
);
assert.match(
  catalogSelection,
  /lake_run_brown_trout[^\n]*Lake-run Browns/,
  "Lake-run Browns must be registered in the species picker",
);
const manisteeBrownCatalog = {
  states: [{
    state: "MI",
    displayName: "Michigan",
    rivers: [{
      riverId: "big_manistee",
      displayName: "Big Manistee River",
      runs: [{
        runId: "big_manistee_fall_brown_trout",
        displayName: "Fall Migratory Brown Trout",
        species: "lake_run_brown_trout",
        season: "fall",
        supportStatus: "beta",
      }],
    }],
  }],
} as RiverRunCatalogResponse;
const manisteeBrownChoices = riverRunRiverChoices(
  manisteeBrownCatalog,
  "MI",
  "fall",
  "lake_run_brown_trout",
);
assert.equal(manisteeBrownChoices.length, 9);
assert.equal(
  manisteeBrownChoices.find((choice) => choice.id === "big_manistee")
    ?.disabled,
  undefined,
  "Big Manistee must be selectable for Michigan Fall Migratory Brown Trout",
);
assert(
  manisteeBrownChoices.filter((choice) => choice.id !== "big_manistee")
    .every((choice) => choice.disabled),
  "Every other Michigan river must remain visible but disabled for Migratory Brown Trout",
);
assert.match(
  speciesImages,
  /lake_run_brown_trout[^\n]*migratory_brown_trout\.png/,
  "Migratory Brown Trout must use its distinct app asset",
);
for (
  const [species, scale] of [
    ["lake_run_brown_trout", "1"],
    ["chinook_salmon", "2"],
    ["coho_salmon", "2.04"],
    ["steelhead", "1.51"],
    ["atlantic_salmon", "1.5"],
  ]
) {
  assert.match(
    speciesImages,
    new RegExp(`${species}: ${scale.replace(".", "\\.")}`),
    `${species} must retain its transparent-canvas-normalized hero scale`,
  );
}
assert.match(
  riverRunScreen,
  /transform: \[\{ scale: speciesHeroScale \}\]/,
  "Every report hero must apply its transparent-canvas-normalized fish scale",
);

const stateLabelCatalog = {
  states: ["MI", "WI", "IN"].map((state) => ({
    state,
    displayName: state,
    rivers: [{
      riverId: `test_${state.toLowerCase()}`,
      displayName: "Test River",
      runs: [{
        runId: `test_${state.toLowerCase()}_fall_chinook`,
        displayName: "Fall Chinook",
        species: "chinook_salmon",
        season: "fall",
        supportStatus: "beta",
      }],
    }],
  })),
} as RiverRunCatalogResponse;
assert.deepEqual(
  riverRunStateChoices(stateLabelCatalog).map(({ id, label }) => [id, label]),
  [
    ["MI", "Michigan"],
    ["WI", "Wisconsin"],
    ["IN", "Indiana"],
    ["NY", "New York"],
    ["OH", "Ohio"],
  ],
  "State picker must use full customer-facing names even when the API returns codes as display names",
);
for (const riverId of ["milwaukee", "sheboygan", "root", "bois_brule"]) {
  assert.match(
    riverImages,
    new RegExp(`${riverId}: \\"(small|medium|large)\\"`),
    `${riverId} must be registered for river-picker artwork`,
  );
}
assert.match(
  riverRunScreen,
  /ownerReviewMode[\s\S]*?fetchRiverRunOwnerReviewCatalog\(\)[\s\S]*?: fetchRiverRunCatalog\(\)/,
  "Admins must receive the protected review catalog while customers retain the public catalog",
);
assert.match(
  riverRunScreen,
  /ownerReviewMode[\s\S]*?fetchRiverRunOwnerReviewSnapshot[\s\S]*?: fetchRiverRunSnapshot/,
  "Admins must receive protected draft snapshots while customers retain public snapshots",
);
assert.match(
  riverRunScreen,
  /const resultSnapshot = snapshot;/,
  "Rendered reports must come only from the public snapshot state",
);
assert.match(
  riverRunScreen,
  /const primitiveTabStickyIndex = 2;/,
  "The production sticky-header index must account for the Gauge Read card",
);
assert.match(
  riverRunScreen,
  /if \(!canAttemptReport\)[\s\S]*?setShowSubscribePrompt\(true\)/,
  "Public River Migration reports must retain entitlement enforcement",
);
assert.match(
  riverRunScreen,
  /Real provider readings · observation age shown\./,
  "Gauge Read must retain customer-facing live-provider provenance",
);
assert.doesNotMatch(
  riverRunScreen,
  /style=\{styles\.liveMetricFreshness\}/,
  "Gauge Read tiles must leave update details to Sources & Data Age",
);
assert.match(
  riverRunScreen,
  /SOURCES & DATA AGE[\s\S]*?liveMetricFreshnessCopy\(metric\)/,
  "Sources & Data Age must retain per-metric update details",
);
assert.match(
  riverRunScreen,
  /`Typical · \$\{typicalRange \?\? "Unavailable"\}`/,
  "Live Gauge Read tiles must present the percentile range used by their status badge",
);
assert.match(
  riverRunScreen,
  /typical range · median \$\{median\}/,
  "Gauge Read details must identify recent-era ranges and their median",
);
assert.match(
  riverRunScreen,
  /`Date avg · \$\{historicalAverage \?\? "Unavailable"\}`/,
  "Historical-only temperature must retain its explicitly labeled date average",
);
assert.match(
  riverRunScreen,
  /\? "No live sensor"/,
  "Historical-only temperature must use a compact one-line missing-sensor label",
);

assert.equal(
  packageJson.scripts?.["dev:river-run"],
  undefined,
  "The obsolete fixture-mode development command must be removed",
);
assert.equal(
  packageJson.scripts?.["dev:river-run:clear"],
  undefined,
  "The obsolete fixture-mode clear command must be removed",
);

console.log(
  "River Run UI QA passed: public flow is retained, admin review uses protected live endpoints, entitlement checks remain, and internal fixture controls/copy are absent.",
);
