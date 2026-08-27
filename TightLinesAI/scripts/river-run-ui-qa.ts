import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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
  /lake_run_brown_trout[^\n]*Migratory Brown Trout/,
  "Migratory Brown Trout must be registered in the species picker",
);
assert.match(
  speciesImages,
  /lake_run_brown_trout[^\n]*migratory_brown_trout\.png/,
  "Migratory Brown Trout must use its distinct app asset",
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
const freshnessMarkup = riverRunScreen.match(
  /<Text\s+style=\{styles\.liveMetricFreshness\}[\s\S]*?<\/Text>/,
)?.[0] ?? "";
assert(freshnessMarkup, "Gauge Read freshness metadata must be rendered");
assert.doesNotMatch(
  freshnessMarkup,
  /adjustsFontSizeToFit|minimumFontScale/,
  "Flow and gauge-height metadata must not shrink below water-temperature metadata",
);
assert.match(
  riverRunScreen,
  /liveMetricFreshness:\s*\{[\s\S]*?fontSize:\s*8\.5,[\s\S]*?lineHeight:\s*11,/,
  "Gauge Read metadata must retain its original 8.5-point size",
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
