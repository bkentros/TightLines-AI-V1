import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  riverRunRiverChoices,
  riverRunStateChoices,
} from "../lib/riverRunCatalogSelection";
import type { RiverRunCatalogResponse } from "../lib/riverRunContracts";
import {
  RIVER_ACCESS_GENERAL_WARNING,
  RIVER_RUN_SPOT_FINDERS,
  riverAccessSectionLabel,
  riverRunSpotFinderForRiver,
  resolveRiverSpotFinderRecommendedSections,
} from "../lib/riverRunSpotFinder";
import { RIVER_RUN_CONFIGURATION_DOCUMENTS } from "../supabase/functions/_shared/riverRunEngine/config/catalog";
import { resolveRunStage } from "../supabase/functions/_shared/riverRunEngine/scoring/runStage";

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
    ["WA", "Washington"],
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
assert.deepEqual(
  Object.fromEntries(
    ["milwaukee", "sheboygan", "root", "bois_brule"].map((riverId) => [
      riverId,
      RIVER_RUN_SPOT_FINDERS[riverId].sections.map((section) => ({
        label: `${riverAccessSectionLabel(section.position)} · ${section.rangeLabel}`,
        spots: section.spots.length,
      })),
    ]),
  ),
  {
    milwaukee: [
      {
        label: "Lower Run Section · Lake Michigan to North Avenue",
        spots: 1,
      },
      {
        label: "Middle Run Section · North Avenue to Kletzsch Park",
        spots: 8,
      },
      {
        label: "Upper Run Section · Kletzsch Park to Bridge Street Dam",
        spots: 4,
      },
    ],
    sheboygan: [
      {
        label: "Lower Run Section · Lake Michigan to Kiwanis Park",
        spots: 1,
      },
      { label: "Middle Run Section · Kiwanis Park to I-43", spots: 3 },
      { label: "Upper Run Section · I-43 to Waelderhaus Dam", spots: 1 },
    ],
    root: [
      {
        label: "Lower Run Section · Lake Michigan to 6th Street",
        spots: 1,
      },
      { label: "Middle Run Section · 6th Street to Island Park", spots: 2 },
      {
        label: "Upper Run Section · Island Park to Steelhead Facility",
        spots: 1,
      },
    ],
    bois_brule: [
      {
        label: "Lower Run Section · Lake Superior to Fishway Refuge",
        spots: 11,
      },
      {
        label: "Middle Run Section · Fishway Refuge to County Highway FF",
        spots: 3,
      },
      {
        label: "Upper Run Section · County Highway FF to Highway 2",
        spots: 7,
      },
    ],
  },
  "Wisconsin Spot Finder inventories must retain their audited corridor sections and counts",
);
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
  /const primitiveTabStickyIndex = resultSpotFinder \? 3 : 2;/,
  "The production sticky-header index must account for Gauge Read and the conditional Spot Finder card",
);
assert.match(
  riverRunScreen,
  /<LiveRiverConditionsCard[\s\S]*?<SpotFinderCard[\s\S]*?<PrimitiveTabBar/,
  "Spot Finder must render directly below Gauge Read and above the River Run tabs",
);
assert.match(
  riverRunScreen,
  /<View style=\{styles\.snapshotResultStack\}>[\s\S]*?<SnapshotView[\s\S]*?<FeedbackCard/,
  "The completed read and coverage-request card must share an explicitly spaced stack",
);
assert.match(
  riverRunScreen,
  /snapshotResultStack:\s*\{\s*gap:\s*16\s*\}/,
  "Safety and coverage request cards must retain a full 16-point visual gap",
);
assert.match(
  riverRunScreen,
  /<SpotFinderCard[\s\S]*?runStage=\{resultSnapshot\?\.runStage\}/,
  "Spot Finder must receive the snapshot's structured Migration Stage",
);
assert.equal(
  (riverRunScreen.match(/tabTitle:\s*"/g) ?? []).length,
  3,
  "River Run must expose exactly three public read tabs",
);
assert.match(
  riverRunScreen,
  /fishingShape=\{resultSnapshot\?\.fishability\}[\s\S]*?FISHING SHAPE/,
  "Calibrated presentation workability must appear as Fishing Shape inside Gauge Read",
);
assert.match(
  riverRunScreen,
  /FISHING_SHAPE_METER[\s\S]*?Poor[\s\S]*?Tough[\s\S]*?Fishable[\s\S]*?Good[\s\S]*?Excellent/,
  "Fishing Shape must retain the canonical red-to-green five-state order",
);
assert.match(
  riverRunScreen,
  /findIndex\(\(stop\)[\s\S]*?stop\.label\.toLowerCase\(\)[\s\S]*?label\.trim\(\)\.toLowerCase\(\)/,
  "The Fishing Shape meter selection must come from the displayed label",
);
assert.doesNotMatch(
  riverRunScreen,
  /Presentation conditions for the represented gauge reach · not fish abundance/,
  "Fishing Shape must not retain the explanatory sentence below its rating",
);
assert.doesNotMatch(
  riverRunScreen,
  /tabTitle:\s*"FISHABILITY"|cardTitle:\s*"Fishability"|\/ 04/,
  "Fishability must not remain a standalone fourth read",
);
for (const retiredPublicSurface of [
  "WHERE TO START",
  "WHY THIS READ",
  "GUIDE&apos;S READ",
]) {
  assert.doesNotMatch(
    riverRunScreen,
    new RegExp(retiredPublicSurface),
    `${retiredPublicSurface} must not remain in the public River Run UI`,
  );
}
assert.match(
  riverRunScreen,
  /SEASONAL ZONE[\s\S]*?Calendar-based orientation · not a live location report/,
  "Stage must use a structured, explicitly calendar-based Seasonal Zone",
);
assert.doesNotMatch(
  riverRunScreen,
  /maps\.apple\.com|google\.com\/maps\/dir|OPEN APPLE MAPS|OPEN GOOGLE MAPS|PIN BEING VERIFIED|VERIFIED ENTRANCE COORDINATE|spotFinderDirections|spotFinderModal/,
  "Spot Finder must not expose navigation pins, directions, or pin-verification states",
);
assert.match(
  riverRunScreen,
  /spotOpen[\s\S]*?VIEW OFFICIAL SOURCE[\s\S]*?spot\.sourceLocator[\s\S]*?spot\.sourceLabel[\s\S]*?spot\.verifiedOn/,
  "Every expanded Spot Finder access must retain its official source, locator guidance, identity and verification date",
);
assert.match(
  riverRunScreen,
  /resolveRiverSpotFinderRecommendedSections\(finder, runStage\?\.stage\)[\s\S]*?RECOMMENDED[\s\S]*?OTHER RIVER ACCESS/,
  "Spot Finder must prioritize stage-derived recommended sections while retaining other river access",
);
assert.match(
  riverRunScreen,
  /Broad starting areas—not a live fish-location report/,
  "Spot Finder recommendations must retain their broad seasonal limitation",
);
assert.match(
  riverRunScreen,
  /Sections describe the supported migration corridor, not the entire river\. \{finder\.orientationNote\}/,
  "Spot Finder must distinguish run-corridor position from whole-river geography",
);
assert.match(
  riverRunScreen,
  /NO RUN-BASED RECOMMENDATION[\s\S]*?migration is not in an active stage/,
  "Spot Finder must explain why pre-run and completed reports have no recommendation",
);
assert.match(
  riverRunScreen,
  /spotFinderSectionToggle[\s\S]*?accessibilityState=\{\{ expanded: sectionOpen \}\}[\s\S]*?spotFinderAccessToggle[\s\S]*?accessibilityState=\{\{ expanded: spotOpen \}\}/,
  "Spot Finder sections and access details must use accessible progressive disclosure",
);
assert.match(
  riverRunScreen,
  /const \[expandedSectionIds, setExpandedSectionIds\] = useState<string\[\]>\(\[\]\)/,
  "Spot Finder sections must start collapsed",
);
assert.doesNotMatch(
  riverRunScreen,
  /recommendedSections\.slice\(0,\s*1\)/,
  "Spot Finder must not automatically expand the first recommended section",
);
assert.match(
  riverRunScreen,
  /onPress=\{\(\) => \{\s*hapticSelection\(\);\s*setExpandedSectionIds\(\[\]\);\s*setExpandedSpotIds\(\[\]\);[\s\S]*?setOpen\(\(current\) => !current\)/,
  "Closing and reopening Spot Finder must restore its collapsed section state",
);
assert.match(
  riverRunScreen,
  /spotFinderSectionRecommended:[\s\S]*?borderLeftWidth:\s*5[\s\S]*?spotFinderRecommendedBadge:[\s\S]*?backgroundColor:\s*"#167B78"/,
  "Recommended sections must retain a strong rail and filled status badge",
);
assert.match(
  riverRunScreen,
  /spotFinderOtherSectionGroup:[\s\S]*?borderTopWidth:\s*1[\s\S]*?spotFinderAccessList:[\s\S]*?gap:\s*8[\s\S]*?spotFinderAccessRow:[\s\S]*?borderWidth:\s*1/,
  "Other sections and expanded access rows must remain visually separated",
);
assert.match(
  riverRunScreen,
  /section\.spots\.length === 1[\s\S]*?ACCESS POINT[\s\S]*?ACCESS POINTS/,
  "Section counts must identify access points instead of showing an unexplained number",
);
assert.doesNotMatch(
  riverRunScreen,
  /spotFinderSectionFilters|activeSectionId|spotFinderListViewport|nestedScrollEnabled/,
  "Spot Finder must not restore the dense filter and nested-scroll interface",
);
assert.doesNotMatch(
  riverRunScreen,
  /SOURCE LISTED|WHERE THE SOURCE EXPLAINS IT|VIEW LOCATION SOURCE/,
  "Spot Finder must not repeat retired source and location labels on every access row",
);
assert.doesNotMatch(
  riverRunScreen,
  /spotFinderSpotName}[\s\S]{0,80}numberOfLines|spotFinderCautionText}[\s\S]{0,80}numberOfLines/,
  "Spot Finder must not visually truncate access names or material cautions",
);
assert.match(
  RIVER_ACCESS_GENERAL_WARNING,
  /listed access name does not guarantee legal parking, safe wading, open roads or permission to cross neighboring land/,
  "Spot Finder must distinguish a listed access name from parking, wading, road and property permission",
);

const riverCoordinateBounds: Record<
  string,
  { minLat: number; maxLat: number; minLon: number; maxLon: number }
> = {
  pere_marquette: {
    minLat: 43.8,
    maxLat: 44.02,
    minLon: -86.5,
    maxLon: -85.75,
  },
  betsie: { minLat: 44.55, maxLat: 44.66, minLon: -86.22, maxLon: -86.04 },
  big_manistee: { minLat: 44.15, maxLat: 44.4, minLon: -86.4, maxLon: -85.8 },
  muskegon: { minLat: 43.2, maxLat: 43.5, minLon: -86.25, maxLon: -85.6 },
  st_joseph: { minLat: 41.7, maxLat: 42.2, minLon: -86.6, maxLon: -86.2 },
  grand: { minLat: 42.6, maxLat: 43.2, minLon: -86.3, maxLon: -84.4 },
  white: { minLat: 43.35, maxLat: 43.65, minLon: -86.45, maxLon: -85.9 },
};

for (
  const riverId of [
    "pere_marquette",
    "betsie",
    "big_manistee",
    "muskegon",
    "st_joseph",
    "grand",
    "white",
    "milwaukee",
    "sheboygan",
    "root",
    "bois_brule",
  ]
) {
  const finder = RIVER_RUN_SPOT_FINDERS[riverId];
  assert(finder, `${riverId} must have a Spot Finder inventory`);
  assert(finder.sections.length > 0, `${riverId} must have access sections`);
  assert(
    finder.sections.every((section) => section.spots.length > 0),
    `${riverId} Spot Finder sections must not be empty`,
  );
  for (const spot of finder.sections.flatMap((section) => section.spots)) {
    assert(
      spot.sourceUrl.startsWith("https://"),
      `${spot.id} needs an official HTTPS source`,
    );
    assert.match(
      spot.verifiedOn,
      /^\d{4}-\d{2}-\d{2}$/,
      `${spot.id} needs a verification date`,
    );
    assert(
      spot.sourceLocator.trim().length >= 24,
      `${spot.id} needs a useful source-location explanation`,
    );
    assert.notEqual(
      spot.sourceUrl,
      "https://www.michigan.gov/dnr/things-to-do/boating",
      `${spot.id} must open the actual DNR facility finder, not its introductory page`,
    );
    assert.notEqual(
      spot.sourceUrl,
      "https://www.fs.usda.gov/r09/huron-manistee/recreation",
      `${spot.id} must open an individual Forest Service access page`,
    );
    assert(
      [
        "cms3.revize.com",
        "experience.arcgis.com",
        "miottawa.org",
        "s34427.pcdn.co",
        "swmichigan.org",
        "www.berriencounty.org",
        "www.dnr.state.mi.us",
        "www.eatoncounty.org",
        "www.fs.usda.gov",
        "www.grandrapidsmi.gov",
        "www.gtrlc.org",
        "www.michigan.gov",
        "www.michiganwatertrails.org",
        "www.nilesmi.org",
        "www.villageofberriensprings.com",
        "dnr.wisconsin.gov",
        "www.village.thiensville.wi.us",
        "www.villageofgraftonwi.gov",
      ].includes(new URL(spot.sourceUrl).hostname),
      `${spot.id} must use an approved government, land-manager, or regional public-access source`,
    );
    if (spot.latitude == null || spot.longitude == null) {
      continue;
    }
    const bounds = riverCoordinateBounds[riverId];
    assert(
      spot.latitude >= bounds.minLat && spot.latitude <= bounds.maxLat &&
        spot.longitude >= bounds.minLon && spot.longitude <= bounds.maxLon,
      `${spot.id} coordinate falls outside the audited ${riverId} corridor`,
    );
  }
}

for (const finder of Object.values(RIVER_RUN_SPOT_FINDERS)) {
  if (finder.riverRunAligned === false) continue;
  const document = RIVER_RUN_CONFIGURATION_DOCUMENTS.find((candidate) =>
    candidate.river.riverId === finder.riverId
  );
  assert(document?.river.foundation, `${finder.riverId} needs a river foundation`);
  const reachIds = new Set(
    document.river.foundation.reaches.map((reach) => reach.reachId),
  );
  const positions = finder.sections.map((section) => section.position);
  assert(
    positions.length === 1 && positions[0] === "lower" ||
      positions.length === 2 && positions.join(",") === "lower,upper" ||
      positions.length === 3 && positions.join(",") === "lower,middle,upper",
    `${finder.riverId} must use the canonical downstream-to-upstream section structure`,
  );
  for (const section of finder.sections) {
    assert.equal(
      riverAccessSectionLabel(section.position),
      `${section.position[0].toUpperCase()}${section.position.slice(1)} Run Section`,
      `${finder.riverId}/${section.id} must derive its public section name from position`,
    );
    assert(
      section.rangeLabel.trim().length > 0,
      `${finder.riverId}/${section.id} needs concrete boundary context`,
    );
    assert(
      section.foundationReachIds.length > 0,
      `${finder.riverId}/${section.id} must reference canonical foundation geography`,
    );
    for (const reachId of section.foundationReachIds) {
      assert(
        reachIds.has(reachId),
        `${finder.riverId}/${section.id} references unknown reach ${reachId}`,
      );
    }
  }
}
for (const species of ["chinook_salmon", "coho_salmon", "steelhead"] as const) {
  assert.equal(
    riverRunSpotFinderForRiver("platte", species, "MI"),
    undefined,
    `Platte Spot Finder must remain hidden for ${species} until practical fishing access is audited inside its species corridor`,
  );
}
assert.deepEqual(
  riverRunSpotFinderForRiver("grand", "chinook_salmon")?.sections.map((section) =>
    section.id
  ),
  ["grand_lower", "grand_middle"],
  "Grand Chinook must not receive access beyond its Webber Dam endpoint",
);
assert.deepEqual(
  riverRunSpotFinderForRiver("grand", "steelhead")?.sections.map((section) =>
    section.id
  ),
  ["grand_lower", "grand_middle", "grand_upper"],
  "Grand Steelhead may retain its accepted upper accessible corridor",
);
const grandChinookFinder = riverRunSpotFinderForRiver(
  "grand",
  "chinook_salmon",
);
assert(grandChinookFinder);
for (
  const stage of [
    "beginning",
    "building",
    "peak",
    "tapering",
    "ending",
  ] as const
) {
  assert.equal(
    resolveRiverSpotFinderRecommendedSections(grandChinookFinder, stage)
      .recommendedSections.some((section) => section.id === "grand_upper"),
    false,
    `Grand Chinook must never recommend the species-ineligible above-Webber section while ${stage}`,
  );
}

for (const species of ["chinook_salmon", "coho_salmon", "steelhead"] as const) {
  const betsieFinder = riverRunSpotFinderForRiver("betsie", species, "MI");
  assert(betsieFinder);
  assert.deepEqual(
    betsieFinder.sections.map((section) => ({
      label: riverAccessSectionLabel(section.position),
      range: section.rangeLabel,
    })),
    [
      { label: "Lower Run Section", range: "Betsie Lake to US-31" },
      {
        label: "Upper Run Section",
        range: "US-31 to signed Homestead closure",
      },
    ],
    `Betsie ${species} must present two relative run sections ending at Homestead`,
  );
  assert.deepEqual(
    resolveRiverSpotFinderRecommendedSections(betsieFinder, "ending")
      .recommendedSections.map((section) => section.id),
    ["betsie_us31_homestead"],
    `Betsie ${species} Ending must recommend only the terminal supported reach below Homestead`,
  );
}

const pmFinder = riverRunSpotFinderForRiver(
  "pere_marquette",
  "chinook_salmon",
);
assert(pmFinder, "Pere Marquette Spot Finder must be available for Chinook");
const pmRecommendations = {
  beginning: ["pm_lower"],
  building: ["pm_lower", "pm_middle"],
  peak: ["pm_lower", "pm_middle", "pm_upper"],
  tapering: ["pm_middle", "pm_upper"],
  ending: ["pm_middle", "pm_upper"],
} as const;
for (const [stage, expectedSectionIds] of Object.entries(pmRecommendations)) {
  const result = resolveRiverSpotFinderRecommendedSections(
    pmFinder,
    stage as keyof typeof pmRecommendations,
  );
  assert.deepEqual(
    result.recommendedSections.map((section) => section.id),
    expectedSectionIds,
    `Pere Marquette ${stage} recommendations must follow the shared three-section progression`,
  );
  assert.equal(result.hasRecommendation, true);
  for (const section of result.recommendedSections) {
    assert.deepEqual(
      section.spots,
      pmFinder.sections.find((candidate) => candidate.id === section.id)?.spots,
      `${section.id} must retain every eligible public access without ranking`,
    );
  }
}
for (const stage of [undefined, "pre_run", "post_run"] as const) {
  const result = resolveRiverSpotFinderRecommendedSections(pmFinder, stage);
  assert.equal(
    result.hasRecommendation,
    false,
    `${stage ?? "missing"} stage must not imply a section recommendation`,
  );
  assert.deepEqual(result.otherSections, pmFinder.sections);
}
for (
  const stage of [
    "beginning",
    "building",
    "peak",
    "tapering",
    "ending",
  ] as const
) {
  const oneSection = resolveRiverSpotFinderRecommendedSections(
    { sections: pmFinder.sections.slice(0, 1) },
    stage,
  );
  assert.deepEqual(
    oneSection.recommendedSections.map((section) => section.id),
    ["pm_lower"],
    `A one-section corridor must retain its only eligible section while ${stage}`,
  );
}

for (const species of ["chinook_salmon", "coho_salmon", "steelhead"] as const) {
  const finder = riverRunSpotFinderForRiver("st_joseph", species, "MI");
  assert(
    finder,
    `Michigan St. Joseph Spot Finder must be available for ${species}`,
  );
  assert.equal(
    finder.sections.reduce((total, section) => total + section.spots.length, 0),
    13,
    `Michigan St. Joseph Spot Finder must retain all 13 access points for ${species}`,
  );
  assert.equal(
    riverRunSpotFinderForRiver("st_joseph", species, "IN"),
    undefined,
    `Indiana St. Joseph Spot Finder must remain hidden until its access inventory is audited for ${species}`,
  );
}
const stJosephFinder = riverRunSpotFinderForRiver("st_joseph", "steelhead", "MI");
assert(stJosephFinder);
const stJosephBuilding = resolveRiverSpotFinderRecommendedSections(
  stJosephFinder,
  "building",
);
assert.deepEqual(
  stJosephBuilding.recommendedSections.map((section) => section.id),
  ["stjoe_lower", "stjoe_middle"],
  "A two-section corridor must recommend both supported sections while Building",
);
const stJosephEnding = resolveRiverSpotFinderRecommendedSections(
  stJosephFinder,
  "ending",
);
assert.deepEqual(
  stJosephEnding.recommendedSections.map((section) => section.id),
  ["stjoe_middle"],
  "A two-section corridor must recommend only its upstream section while Ending",
);

let recommendationMatrixCases = 0;
for (const document of RIVER_RUN_CONFIGURATION_DOCUMENTS) {
  const presentations = document.river.presentationContexts ?? [{
    state: document.river.state,
    foundationReachIds: undefined,
  }];
  for (const run of document.runs) {
    const checkpointDates = new Set(
      Object.values(run.runWindow)
        .filter((monthDay): monthDay is string => typeof monthDay === "string")
        .map((monthDay) => `2026-${monthDay}`),
    );
    for (const presentation of presentations) {
      const finder = riverRunSpotFinderForRiver(
        document.river.riverId,
        run.species,
        presentation.state,
      );
      if (!finder) continue;
      for (const localDate of checkpointDates) {
        const stage = resolveRunStage(run, localDate);
        const result = resolveRiverSpotFinderRecommendedSections(
          finder,
          stage.stage,
        );
        recommendationMatrixCases += 1;
        if (stage.stage === "pre_run" || stage.stage === "post_run") {
          assert.equal(
            result.hasRecommendation,
            false,
            `${run.runId}/${presentation.state}/${localDate} must not recommend sections outside the active migration`,
          );
          assert.deepEqual(result.otherSections, finder.sections);
          continue;
        }
        const expected = stage.stage === "beginning"
          ? finder.sections.slice(0, 1)
          : stage.stage === "building"
          ? finder.sections.slice(0, Math.min(2, finder.sections.length))
          : stage.stage === "peak"
          ? finder.sections
          : finder.sections.length >= 3
          ? finder.sections.slice(-2)
          : finder.sections.slice(-1);
        assert.deepEqual(
          result.recommendedSections.map((section) => section.id),
          expected.map((section) => section.id),
          `${run.runId}/${presentation.state}/${localDate} must follow the shared ${stage.stage} progression`,
        );
        assert.equal(result.hasRecommendation, true);
        for (const section of result.recommendedSections) {
          assert.equal(
            result.otherSections.some((candidate) =>
              candidate.id === section.id
            ),
            false,
            `${section.id} must not be duplicated across recommended and other access`,
          );
        }
      }
    }
  }
}
assert(
  recommendationMatrixCases > 250,
  "Spot Finder recommendation QA must exercise the full river/species/state/stage checkpoint matrix",
);

assert.doesNotMatch(
  riverRunScreen,
  /sourceLocationHint|spot\.latitude|spot\.longitude/,
  "The UI must not turn internal location hints or coordinates into customer navigation",
);

const retiredSpotFinderSources =
  /stelprdb5180864|stelprd3807298|sjcity\.com\/parksrec\/page\/riverview-park|SR24-St-Joesph-River-Assessment/;
assert.doesNotMatch(
  JSON.stringify(RIVER_RUN_SPOT_FINDERS),
  retiredSpotFinderSources,
  "Known retired Spot Finder source URLs must not return",
);
const seventySecondStreet = RIVER_RUN_SPOT_FINDERS.pere_marquette.sections
  .flatMap((section) => section.spots)
  .find((spot) => spot.id === "pm_72nd_angler");
assert.equal(
  seventySecondStreet?.sourceUrl,
  "https://www.fs.usda.gov/r09/huron-manistee/recreation/72nd-st-angler-access",
  "72nd Street must use its live individual Forest Service access page",
);

assert.equal(
  RIVER_RUN_SPOT_FINDERS.platte,
  undefined,
  "Paddling-oriented Platte water accesses must not be presented as fishing recommendations",
);
const sectionSpotNames = (riverId: string, sectionId: string) =>
  RIVER_RUN_SPOT_FINDERS[riverId].sections.find((section) =>
    section.id === sectionId
  )?.spots.map((spot) => spot.name);
assert.deepEqual(
  sectionSpotNames("pere_marquette", "pm_middle")?.slice(0, 3),
  ["Indian Bridge River Access", "Walhalla Road Bridge", "Sulak / Upper Branch"],
  "Pere Marquette middle access must follow the audited downstream-to-upstream order",
);
assert.deepEqual(
  sectionSpotNames("pere_marquette", "pm_upper"),
  [
    "Rainbow Rapids Access",
    "Bowman Bridge River Access",
    "Gleason's Landing",
    "Claybanks River Access",
    "Green Cottage Access",
    "72nd Street Angler Trail",
    "M-37 Bridge Access",
  ],
  "Pere Marquette upper access must follow the audited downstream-to-upstream order",
);
assert.deepEqual(
  sectionSpotNames("big_manistee", "manistee_middle"),
  ["Bear Creek Access", "Blacksmith Bayou", "High Bridge Access"],
  "Big Manistee middle access must stop at High Bridge",
);
assert.deepEqual(
  sectionSpotNames("big_manistee", "manistee_upper")?.slice(0, 3),
  [
    "Sawdust Hole River Access",
    "Suicide Bend River Access",
    "Tunk Hole River Access",
  ],
  "Big Manistee accesses above High Bridge must remain in the Tippy Dam reach",
);
assert.deepEqual(
  sectionSpotNames("grand", "grand_lower")?.slice(-2),
  ["Grandville Access", "Johnson Park"],
  "Grand lower access must stop below Sixth Street Dam",
);
assert.deepEqual(
  sectionSpotNames("grand", "grand_middle")?.slice(0, 4),
  [
    "Riverside Park River Access",
    "Rogue River Mouth",
    "Knapp Street Bridge",
    "Ada Access",
  ],
  "Grand access above Sixth Street must remain in the middle passage corridor",
);
assert.match(
  RIVER_RUN_SPOT_FINDERS.grand.orientationNote,
  /Coho and Steelhead only; Chinook River Run guidance stops at Webber Dam/,
  "Grand Spot Finder must disclose the species-specific Webber endpoint",
);
assert.doesNotMatch(
  JSON.stringify(RIVER_RUN_SPOT_FINDERS.white),
  /Island Landing/,
  "White Spot Finder must stop below impassable Hesperia Dam",
);
for (const riverId of ["milwaukee", "sheboygan", "root", "bois_brule"]) {
  assert.equal(
    RIVER_RUN_SPOT_FINDERS[riverId].safetyLink?.url,
    "https://dnr.wisconsin.gov/topic/Fishing/seasons",
    `${riverId} must open current Wisconsin rules instead of Michigan closures`,
  );
}
assert.doesNotMatch(
  JSON.stringify(
    RIVER_RUN_SPOT_FINDERS.milwaukee.sections.flatMap((section) =>
      section.spots.map((spot) => spot.name)
    ),
  ),
  /Veterans Memorial Park/,
  "Milwaukee Spot Finder must stop below Bridge Street Dam",
);
const bruleLowerSection = RIVER_RUN_SPOT_FINDERS.bois_brule.sections.find(
  (section) => section.id === "bois_brule_mouth_lower",
);
assert.deepEqual(
  bruleLowerSection?.spots.slice(-2).map((spot) => spot.name),
  ["Cloverland Park", "Highway 13 Landing"],
  "Cloverland Park and Highway 13 Landing must remain below the Brule fishway",
);
assert.doesNotMatch(
  JSON.stringify(
    RIVER_RUN_SPOT_FINDERS.root.sections.flatMap((section) =>
      section.spots.map((spot) => spot.name)
    ),
  ),
  /Colonial Park|Quarry Lake Park|Horlick Dam/,
  "Root Spot Finder must stop at the Steelhead Facility product endpoint",
);
assert.doesNotMatch(
  JSON.stringify(
    RIVER_RUN_SPOT_FINDERS.bois_brule.sections.flatMap((section) =>
      section.spots.map((spot) => spot.name)
    ),
  ),
  /Culhane Road|Mays Ledges|Red Gate|CTH FF Roadside/,
  "Bois Brule Spot Finder must exclude private-roadside and closed-refuge locations",
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
