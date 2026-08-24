import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  formatRiverRunSpecies,
  resolveRiverRunTarget,
  riverRunRiverChoices,
  riverRunSeasonChoices,
  riverRunSpeciesChoices,
  riverRunStateChoices,
} from "../lib/riverRunCatalogSelection";
import type { RiverRunCatalogResponse } from "../lib/riverRunContracts";
import { RIVER_RUN_BETSIE_REVIEW_GROUPS } from "../lib/riverRunBetsieReviewFixtures.generated";
import { RIVER_RUN_MUSKEGON_REVIEW_GROUPS } from "../lib/riverRunMuskegonReviewFixtures.generated";
import { RIVER_RUN_MUSKEGON_COHO_REVIEW_GROUPS } from "../lib/riverRunMuskegonCohoReviewFixtures.generated";
import { RIVER_RUN_MUSKEGON_STEELHEAD_REVIEW_GROUPS } from "../lib/riverRunMuskegonSteelheadReviewFixtures.generated";
import { RIVER_RUN_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures.generated";

const catalog: RiverRunCatalogResponse = {
  states: [
    {
      state: "MI",
      displayName: "Michigan",
      rivers: [
        {
          riverId: "pere_marquette",
          displayName: "Pere Marquette River",
          state: "MI",
          runs: [
            {
              runId: "pm_fall_chinook",
              displayName: "Fall Chinook",
              species: "chinook_salmon",
              season: "fall",
            },
            {
              runId: "pm_fall_coho",
              displayName: "Fall Coho",
              species: "coho_salmon",
              season: "fall",
            },
            {
              runId: "pm_fall_steelhead",
              displayName: "Fall Steelhead",
              species: "steelhead",
              season: "fall",
            },
            {
              runId: "pm_spring_steelhead",
              displayName: "Spring Steelhead",
              species: "steelhead",
              season: "spring",
            },
          ],
        },
        {
          riverId: "betsie",
          displayName: "Betsie River",
          state: "MI",
          runs: [
            {
              runId: "betsie_fall_chinook",
              displayName: "Fall Chinook",
              species: "chinook_salmon",
              season: "fall",
            },
            {
              runId: "betsie_fall_coho",
              displayName: "Fall Coho",
              species: "coho_salmon",
              season: "fall",
            },
            {
              runId: "betsie_fall_steelhead",
              displayName: "Fall Steelhead",
              species: "steelhead",
              season: "fall",
            },
          ],
        },
      ],
    },
    {
      state: "WI",
      displayName: "Wisconsin",
      rivers: [
        {
          riverId: "root",
          displayName: "Root River",
          state: "WI",
          runs: [
            {
              runId: "root_fall_coho",
              displayName: "Fall Coho",
              species: "coho_salmon",
              season: "fall",
            },
          ],
        },
      ],
    },
  ],
};

assert.deepEqual(
  riverRunStateChoices(catalog).map((choice) => choice.id),
  ["MI", "IN", "NY", "WI", "OH"],
);
assert.equal(
  riverRunStateChoices(catalog).find((choice) => choice.id === "NY")?.disabled,
  true,
);
assert.equal(
  riverRunStateChoices(catalog).find((choice) => choice.id === "WI")?.disabled,
  undefined,
  "A future presentation row must become selectable when catalog support exists",
);
assert.deepEqual(
  riverRunSeasonChoices(catalog, "MI").map((choice) => choice.id),
  ["fall", "winter", "spring", "summer"],
);
assert.equal(
  riverRunSeasonChoices(catalog, "MI").find((choice) => choice.id === "winter")
    ?.disabled,
  true,
);
assert.deepEqual(
  riverRunSpeciesChoices(catalog, "MI", "fall").map((choice) => choice.id),
  ["chinook_salmon", "coho_salmon", "steelhead", "atlantic_salmon"],
);
assert.equal(
  riverRunSpeciesChoices(catalog, "MI", "fall").find((choice) =>
    choice.id === "atlantic_salmon"
  )?.disabled,
  true,
);
const michiganFallRiverIds = [
  "pere_marquette",
  "betsie",
  "big_manistee",
  "muskegon",
  "st_joseph",
  "grand",
  "platte",
  "white",
  "au_sable",
];
assert.deepEqual(
  riverRunRiverChoices(catalog, "MI", "fall", "chinook_salmon").map(
    (choice) => choice.id,
  ),
  michiganFallRiverIds,
);
assert.equal(
  riverRunRiverChoices(catalog, "MI", "fall", "steelhead").find((choice) =>
    choice.id === "st_joseph"
  )?.disabled,
  true,
  "St. Joseph must remain visible but disabled until its public audit gate opens",
);
assert.deepEqual(
  riverRunRiverChoices(catalog, "MI", "fall", "coho_salmon").map((choice) =>
    choice.id
  ),
  michiganFallRiverIds,
);
assert.deepEqual(
  riverRunRiverChoices(catalog, "MI", "fall", "steelhead").map((choice) =>
    choice.id
  ),
  michiganFallRiverIds,
);
assert.deepEqual(
  riverRunRiverChoices(catalog, "MI", "fall", "atlantic_salmon"),
  [{
    id: "au_sable",
    label: "Au Sable River",
    subtitle: "Coming later",
    disabled: true,
  }],
  "Atlantic Salmon must only advertise the Au Sable among planned rivers",
);
assert.deepEqual(
  riverRunRiverChoices(catalog, "WI", "fall", "coho_salmon").map(
    (choice) => choice.id,
  ),
  ["root"],
);

const stJosephOrderingCatalog: RiverRunCatalogResponse = {
  states: [
    {
      state: "MI",
      displayName: "Michigan",
      rivers: [{
        riverId: "st_joseph",
        displayName: "St. Joseph River",
        state: "MI",
        runs: [{
          runId: "st_joseph_fall_coho",
          displayName: "Fall Coho",
          species: "coho_salmon",
          season: "fall",
        }],
      }],
    },
    {
      state: "IN",
      displayName: "Indiana",
      rivers: [{
        riverId: "st_joseph",
        displayName: "St. Joseph River",
        state: "IN",
        runs: [{
          runId: "st_joseph_fall_coho",
          displayName: "Fall Coho",
          species: "coho_salmon",
          season: "fall",
        }],
      }],
    },
  ],
};
const michiganStJosephChoices = riverRunRiverChoices(
  stJosephOrderingCatalog,
  "MI",
  "fall",
  "coho_salmon",
);
assert.equal(
  michiganStJosephChoices.findIndex((choice) => choice.id === "st_joseph"),
  michiganStJosephChoices.findIndex((choice) => choice.id === "muskegon") + 1,
  "Michigan must place St. Joseph immediately below Muskegon",
);
assert.equal(
  michiganStJosephChoices.find((choice) => choice.id === "st_joseph")?.disabled,
  undefined,
  "A supported Michigan St. Joseph read must remain selectable",
);
assert.deepEqual(
  riverRunRiverChoices(stJosephOrderingCatalog, "IN", "fall", "coho_salmon"),
  [{
    id: "st_joseph",
    label: "St. Joseph River",
    subtitle: "Audited river migration",
  }],
  "Indiana must present St. Joseph first and as its only river",
);
assert.equal(formatRiverRunSpecies("chinook_salmon"), "Chinook Salmon");
assert.equal(formatRiverRunSpecies("coho_salmon"), "Coho Salmon");
assert.equal(formatRiverRunSpecies("steelhead"), "Steelhead");
assert.equal(formatRiverRunSpecies("atlantic_salmon"), "Atlantic Salmon");

const target = resolveRiverRunTarget(catalog, {
  stateCode: "MI",
  season: "fall",
  species: "chinook_salmon",
  riverId: "betsie",
});
assert.equal(target?.run.runId, "betsie_fall_chinook");
const betsieCohoTarget = resolveRiverRunTarget(catalog, {
  stateCode: "MI",
  season: "fall",
  species: "coho_salmon",
  riverId: "betsie",
});
assert.equal(betsieCohoTarget?.run.runId, "betsie_fall_coho");
const betsieSteelheadTarget = resolveRiverRunTarget(catalog, {
  stateCode: "MI",
  season: "fall",
  species: "steelhead",
  riverId: "betsie",
});
assert.equal(betsieSteelheadTarget?.run.runId, "betsie_fall_steelhead");
assert.equal(
  resolveRiverRunTarget(catalog, {
    stateCode: "MI",
    season: "spring",
    species: "chinook_salmon",
    riverId: "pere_marquette",
  }),
  null,
);
assert.equal(
  resolveRiverRunTarget(catalog, {
    stateCode: "MI",
    season: "fall",
    species: "steelhead",
    riverId: "muskegon",
  }),
  null,
  "A disabled presentation-only river must never resolve as supported",
);

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const riverRunScreen = readFileSync(
  `${projectRoot}app/river-run.tsx`,
  "utf8",
);

const primitiveTabsBlock = riverRunScreen.match(
  /const PRIMITIVE_TABS:[\s\S]*?\n\];/,
);
assert(primitiveTabsBlock, "Missing River Migration primitive tabs");
assert.deepEqual(
  [...primitiveTabsBlock[0].matchAll(/id: "([^"]+)"/g)].map((match) =>
    match[1]
  ),
  ["run_stage", "activity", "fish_in_river", "fishability"],
  "River Migration must show only Stage, Activity, Fish In River, and Fishability, in that order",
);
assert.match(
  riverRunScreen,
  /primitiveTabPosition[\s\S]*?\/ 04/,
  "River Migration primitive navigation must report four visible reads",
);
assert.match(
  riverRunScreen,
  /TOMORROW · FORECAST[\s\S]*?Updates after[\s\S]*?midnight and shortly after 4 AM/,
  "Tomorrow Activity must be unmistakably labeled with its refresh timing",
);
for (const lifecycleLabel of ["NOW", "ENDED", "UPCOMING"]) {
  assert.match(
    riverRunScreen,
    new RegExp(`\\? \"${lifecycleLabel}\\"|: \"${lifecycleLabel}\\"`),
    `Activity blocks must render the ${lifecycleLabel} lifecycle state`,
  );
}
const snapshotViewBlock = riverRunScreen.match(
  /function SnapshotView\([\s\S]*?\nfunction ActivePrimitivePanel/,
);
assert(snapshotViewBlock, "Missing River Migration snapshot view");
assert.equal(
  /snapshot\.(?:conditionsSuggest|push|pushHistory|interpretationNote)|PushHistoryDropdown|formatPreviousTimingRead/
    .test(
      snapshotViewBlock[0],
    ),
  false,
  "Hidden Timing and Push reads must not be reachable from the result view",
);
assert.match(
  riverRunScreen,
  /RIVER_RUN_REVIEW_GROUPS\)\.filter\(\(group\) =>[\s\S]*?group\.id !== "conditions" && group\.id !== "push"/,
  "Developer review navigation must also hide Timing and Push groups",
);
assert.match(
  riverRunScreen,
  /<LiveRiverConditionsCard[\s\S]*?<PrimitiveTabBar/,
  "Live River Conditions must appear above the primitive navigation",
);
assert.match(
  riverRunScreen,
  /resultSnapshot\.riverConditions \?\?\s*unavailableRiverConditions\(resultSnapshot\)/,
  "Live River Conditions must show an explicit unavailable card instead of disappearing when an older payload omits the field",
);
for (const group of RIVER_RUN_REVIEW_GROUPS) {
  for (const scenario of group.scenarios) {
    assert(
      scenario.snapshot.riverConditions,
      `Pere Marquette review fixture ${scenario.id} must include Live River Conditions`,
    );
  }
}
for (const group of RIVER_RUN_BETSIE_REVIEW_GROUPS) {
  for (const scenario of group.scenarios) {
    assert.equal(
      scenario.snapshot.riverConditions?.status,
      "unavailable",
      `Betsie review fixture ${scenario.id} must show the honest no-gauge state`,
    );
  }
}
assert.match(
  riverRunScreen,
  /const primitiveTabStickyIndex = RIVER_RUN_REVIEW_ENABLED \? 3 : 2;/,
  "Primitive sticky-header indexing must account for the live conditions card",
);
assert.match(
  riverRunScreen,
  /: resultSnapshot\s*\?\s*\(\s*<View>\s*<SnapshotView[\s\S]*?<FeedbackCard[\s\S]*?<\/View>\s*\)/,
  "Result content must use a native View so ScrollView layout props are not passed to a Fragment",
);
assert.match(
  riverRunScreen,
  /function LiveMetricTile[\s\S]*?Date avg ·[\s\S]*?liveMetricTrendCopy/,
  "Every live metric tile must expose a date-specific average and 24-hour trend",
);
assert.match(
  riverRunScreen,
  /calendar\s+date ±3 days/,
  "Live condition details must disclose the always-on plus-or-minus three-day baseline window",
);
assert.match(
  riverRunScreen,
  /const metricColumns = fontScale >= 1\.25 \? 1 : width >= 380 \? 3 : 2/,
  "Live condition tiles must use three compact columns on standard phones, two on narrow phones, and one for large text",
);
assert.match(
  riverRunScreen,
  /style=\{styles\.liveConditionsSubtitle\}[\s\S]*?numberOfLines=\{1\}[\s\S]*?Compared with past years on this date\./,
  "Gauge Read subtitle must keep its concise past-years comparison on one line",
);
assert.match(
  riverRunScreen,
  /SOURCES & DATA AGE[\s\S]*?liveMetricFreshnessCopy\(metric\)[\s\S]*?liveMetricBaselineCopy\(metric\)/,
  "Live condition freshness and historical basis must live in the details disclosure",
);
assert.match(
  riverRunScreen,
  /liveMetricProviderLabel\(metric\.provider\)[\s\S]*?provider === "USGS" \? "USGS" : "Monitor My Watershed"/,
  "Live condition source labels must translate internal provider enums into customer-facing names",
);
assert.match(
  riverRunScreen,
  /<\/View>\s*<Text\s+style=\{styles\.liveConditionsDetailStation\}\s+numberOfLines=\{2\}[\s\S]*?\{metric\.stationName\}/,
  "Live condition station names must wrap on their own two-line row instead of truncating beside the freshness badge",
);
assert.match(
  riverRunScreen,
  /metric\.metric === "flow_cfs"[\s\S]*?Math\.round\(value\)[\s\S]*?metric\.metric === "gage_height_ft"[\s\S]*?value\.toFixed\(2\)[\s\S]*?value\.toFixed\(1\)/,
  "Live condition precision must remain whole CFS, hundredths of a foot, and tenths of a degree Fahrenheit",
);
assert.match(
  riverRunScreen,
  /liveMetricComparisonPill[\s\S]*?liveMetricTrendRow/,
  "Compact Live Condition tiles must retain seasonal comparison and 24-hour trend",
);
assert.match(
  riverRunScreen,
  /No accepted gauge or water-temperature sensor currently[\s\S]*?Modeled weather is not substituted/,
  "Rivers without accepted sensors must receive an honest no-gauge state",
);

assert.match(
  riverRunScreen,
  /const RIVER_RUN_REVIEW_ENABLED = __DEV__ &&[\s\S]*?process\.env\.EXPO_PUBLIC_RIVER_RUN_REVIEW_MODE === "true";/,
  "Generated fixture review must require an explicit development-only environment flag",
);
assert.match(
  riverRunScreen,
  /const \[reviewMode, setReviewMode\] = useState\(RIVER_RUN_REVIEW_ENABLED\);/,
  "Ordinary development sessions must initialize River Migration against the live API",
);
assert.match(
  riverRunScreen,
  /state: "MI"[\s\S]*?riverId: "st_joseph"[\s\S]*?st_joseph_fall_chinook[\s\S]*?st_joseph_fall_coho[\s\S]*?st_joseph_fall_steelhead/,
  "Michigan review catalog must enable all three St. Joseph reports",
);
assert.match(
  riverRunScreen,
  /state: "IN"[\s\S]*?riverId: "st_joseph"[\s\S]*?st_joseph_fall_chinook[\s\S]*?st_joseph_fall_coho[\s\S]*?st_joseph_fall_steelhead/,
  "Indiana review catalog must enable all three St. Joseph reports",
);
assert.match(
  riverRunScreen,
  /selectedRiverId === "betsie" &&[\s\S]*?selectedSpecies === "steelhead"[\s\S]*?RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS/,
  "Betsie Steelhead must use its own production-derived review fixture catalog",
);
assert.match(
  riverRunScreen,
  /canAttemptRiverRunReport\([\s\S]*?!reviewMode && !canAttemptReport[\s\S]*?setShowSubscribePrompt\(true\)/,
  "Free users must spend or replay their River Migration trial only when they try to generate a report",
);
assert.match(
  riverRunScreen,
  /error instanceof RiverRunRequestError[\s\S]*?error\.code === "subscription_required"[\s\S]*?setShowSubscribePrompt\(true\)/,
  "An expired same-combination refresh must transition from the server response to the paywall",
);
assert.match(
  riverRunScreen,
  /selectedRiverId === "muskegon" && selectedSpecies === "chinook_salmon"[\s\S]*?RIVER_RUN_MUSKEGON_REVIEW_GROUPS/,
  "Muskegon Chinook must use its own production-derived review fixtures",
);
assert.match(
  riverRunScreen,
  /selectedRiverId === "muskegon" && selectedSpecies === "coho_salmon"[\s\S]*?RIVER_RUN_MUSKEGON_COHO_REVIEW_GROUPS/,
  "Muskegon Coho must use its own production-derived review fixtures",
);
assert.match(
  riverRunScreen,
  /selectedRiverId === "muskegon" && selectedSpecies === "steelhead"[\s\S]*?RIVER_RUN_MUSKEGON_STEELHEAD_REVIEW_GROUPS/,
  "Muskegon Steelhead must use its own production-derived review fixtures",
);
assert.match(
  riverRunScreen,
  /reviewSnapshot\.riverId === selectedTarget\.river\.riverId[\s\S]*?reviewSnapshot\.runId === selectedTarget\.run\.runId/,
  "Review snapshots must match both the selected river and run before rendering",
);
for (const group of RIVER_RUN_MUSKEGON_REVIEW_GROUPS) {
  for (const scenario of group.scenarios) {
    assert.equal(scenario.snapshot.riverId, "muskegon", scenario.id);
    assert.equal(scenario.snapshot.runId, "muskegon_fall_chinook", scenario.id);
    const copy = JSON.stringify(scenario.snapshot);
    assert.doesNotMatch(
      copy,
      /Pere Marquette|Big Manistee|Tippy|Wellston|High Bridge|Bear Creek|M-55|Scottville|Walhalla|Homestead/i,
      scenario.id,
    );
  }
}
for (const group of RIVER_RUN_MUSKEGON_COHO_REVIEW_GROUPS) {
  for (const scenario of group.scenarios) {
    assert.equal(scenario.snapshot.riverId, "muskegon", scenario.id);
    assert.equal(scenario.snapshot.runId, "muskegon_fall_coho", scenario.id);
    const copy = JSON.stringify(scenario.snapshot);
    assert.doesNotMatch(
      copy,
      /Pere Marquette|Big Manistee|Tippy|Wellston|High Bridge|Bear Creek|M-55|Scottville|Walhalla|Homestead/i,
      scenario.id,
    );
  }
}
for (const group of RIVER_RUN_MUSKEGON_STEELHEAD_REVIEW_GROUPS) {
  for (const scenario of group.scenarios) {
    assert.equal(scenario.snapshot.riverId, "muskegon", scenario.id);
    assert.equal(
      scenario.snapshot.runId,
      "muskegon_fall_steelhead",
      scenario.id,
    );
    const copy = JSON.stringify(scenario.snapshot);
    assert.doesNotMatch(
      copy,
      /Pere Marquette|Big Manistee|Tippy|Wellston|High Bridge|Bear Creek|M-55|Scottville|Walhalla|Homestead/i,
      scenario.id,
    );
    if (group.id === "activity") {
      assert.doesNotMatch(
        copy,
        /spent|dying|deteriorat|mortality/i,
        scenario.id,
      );
    }
  }
}
const muskegonStage = RIVER_RUN_MUSKEGON_REVIEW_GROUPS.find((group) =>
  group.id === "run_stage"
);
assert.ok(muskegonStage);
for (const scenario of muskegonStage.scenarios) {
  assert.match(
    scenario.snapshot.runStage.whereToStart ?? "",
    /Muskegon Lake|M-120|Newaygo|Croton|no dependable|no active Muskegon/i,
    `${scenario.id} must give Muskegon-specific starting guidance`,
  );
}
assert.match(
  riverRunScreen,
  /selectedRiverId === "betsie" &&[\s\S]*?selectedSpecies === "coho_salmon"[\s\S]*?RIVER_RUN_BETSIE_COHO_REVIEW_GROUPS/,
  "Betsie Coho must use its own production-derived review fixture catalog",
);
const homeScreen = readFileSync(`${projectRoot}app/(tabs)/index.tsx`, "utf8");
const welcomeScreen = readFileSync(
  `${projectRoot}app/(auth)/welcome.tsx`,
  "utf8",
);
assert.match(
  homeScreen,
  /code="01"[\s\S]*?title="River Migration"[\s\S]*?badge="NEW"[\s\S]*?code="02"[\s\S]*?title="Today's Bite"[\s\S]*?code="03"[\s\S]*?title="Tackle Box"[\s\S]*?code="04"[\s\S]*?title="Water Read"/,
  "Authenticated-home modules must lead with new River Migration",
);
assert.match(
  homeScreen,
  /title="River Migration"[\s\S]*?desc="Migration stage, activity, fish presence & fishability"[\s\S]*?descLines=\{2\}/,
  "Authenticated-home River Migration description must remain concise",
);
assert.match(
  welcomeScreen,
  /numeral: "I"[\s\S]*?moduleId: "todays-bite"[\s\S]*?numeral: "II"[\s\S]*?moduleId: "river-run"[\s\S]*?numeral: "III"[\s\S]*?moduleId: "tackle-box"[\s\S]*?numeral: "IV"[\s\S]*?moduleId: "water-read"/,
  "Signed-out modules must use Today's Bite, River Migration, Tackle Box, Water Read order",
);
const welcomeRiverMigration = welcomeScreen.match(
  /\{\s*numeral: "II",[\s\S]*?moduleId: "river-run"[\s\S]*?\n  \},/,
);
assert(welcomeRiverMigration, "Missing signed-out River Migration module");
assert.doesNotMatch(
  welcomeRiverMigration[0],
  /comingSoon:\s*true/,
  "Signed-out River Migration must not be greyed out",
);
assert.match(
  riverRunScreen,
  /disabled=\{disabled\}[\s\S]*?accessibilityState=\{\{ checked: selected, disabled \}\}/,
  "Future catalog choices must be disabled visually and accessibly",
);
assert.match(
  riverRunScreen,
  /<ResultHero[\s\S]*?readDate=\{currentDeviceLocalDate\(\)\}/,
  "The visible read date must use the user's current device date, not a review fixture date",
);
assert.doesNotMatch(
  riverRunScreen,
  /\{snapshot \? formatLocalDate\(snapshot\.localDate\) : "Preview"\}/,
  "Review fixture dates must not leak into the result hero",
);
assert.match(
  riverRunScreen,
  /resultFishStage:\s*\{[\s\S]*?height:\s*128,[\s\S]*?overflow:\s*"hidden"[\s\S]*?resultFishImage:\s*\{[\s\S]*?transform:\s*\[\{ scale: 1\.48 \}\]/,
  "The result fish stage must remove roughly one third of its vertical whitespace without shrinking the fish",
);
assert.match(
  riverRunScreen,
  /<FeedbackCard[\s\S]*?featureName="River Migration Coverage"[\s\S]*?variant="request"[\s\S]*?compact[\s\S]*?title=\{config\.requestTitle\}/,
  "Supported setup steps must expose the compact coverage-request route",
);
assert.match(
  riverRunScreen,
  /\{!loading && !error\s*\?\s*\(\s*<View style=\{styles\.actionsRow\}>/,
  "Every setup step must keep Back and Continue controls independent of request-card availability",
);
assert.match(
  riverRunScreen,
  /\{!loading && !error && config\.requestTitle && config\.requestAction\s*\?\s*\(\s*<FeedbackCard/,
  "Coverage request cards must render only for configured request categories",
);
assert.doesNotMatch(
  riverRunScreen,
  /Need another season\?|Request a season/,
  "The season step must not request coverage for already-planned seasons",
);
for (
  const requestLabel of [
    "Request a state",
    "Request a species",
    "Request a river",
  ]
) {
  assert.match(
    riverRunScreen,
    new RegExp(requestLabel),
    `${requestLabel} coverage action must remain available`,
  );
}
assert.match(
  riverRunScreen,
  /choice\.id === "steelhead"[\s\S]*?speciesChoiceImageSteelhead/,
  "Steelhead must use its normalized compact selector-image sizing",
);
const riverRunVisual = readFileSync(
  `${projectRoot}components/river-run/RiverRunVisual.tsx`,
  "utf8",
);
const riverRunFishingGuides = readFileSync(
  `${projectRoot}lib/riverRunFishingGuides.ts`,
  "utf8",
);
const anglerFacingFeatureSources = [
  riverRunScreen,
  riverRunVisual,
  riverRunFishingGuides,
  welcomeScreen,
  homeScreen,
  readFileSync(`${projectRoot}app/module-icons-preview.tsx`, "utf8"),
  readFileSync(`${projectRoot}lib/riverRunCatalogSelection.ts`, "utf8"),
];
for (const source of anglerFacingFeatureSources) {
  assert.equal(
    /\b(?:River Run|Run Stage|Run Timing|Pre-run|Post-run|Waiting for run|Audited river run|Daily run score)\b|(?<!\bFall )\bRun complete\b/i
      .test(
        source,
      ),
    false,
    "Angler-facing feature copy must use river or migration language, not run jargon",
  );
}
const detailCopyRender = riverRunScreen.match(
  /<PrimitiveDetailCopy value=\{primitive\.detail\} \/>/,
);
assert(detailCopyRender, "Missing River Run detail-copy render");
assert.equal(
  /numberOfLines|maxWidth|\bwidth\s*:/.test(detailCopyRender[0]),
  false,
  "Why This Read copy must not impose a line or width constraint",
);
assert.match(
  riverRunScreen,
  /function PrimitiveDetailWordFlow\(\{ value \}: \{ value: string \}\)[\s\S]*?Platform\.OS !== "android"[\s\S]*?<Text style=\{styles\.primitiveDetailText\}[\s\S]*?\{value\.trim\(\)\}[\s\S]*?<\/Text>/,
  "Why This Read must use native multiline text so Android preserves normal line height",
);
assert.match(
  riverRunScreen,
  /function PrimitiveHeadlineCopy\(\{ value \}: \{ value: string \}\)[\s\S]*?Platform\.OS !== "android"[\s\S]*?<Text[\s\S]*?style=\{styles\.primitiveHeadlineText\}[\s\S]*?\{value\.trim\(\)\}[\s\S]*?<\/Text>/,
  "Primitive headlines must use native multiline text",
);
assert.match(
  riverRunScreen,
  /function PrimitiveGuideReadCopy\(\{ value \}: \{ value: string \}\)[\s\S]*?Platform\.OS !== "android"[\s\S]*?<Text[\s\S]*?style=\{styles\.primitiveTipText\}[\s\S]*?\{value\.trim\(\)\}[\s\S]*?<\/Text>/,
  "Guide's Read must use native multiline text",
);
assert.match(
  riverRunScreen,
  /function PrimitiveDetailCopy\(\{ value \}: \{ value: string \}\)[\s\S]*?splitRiverRunDetailPoints\(value\)[\s\S]*?detailLines\.map\(\(line, lineIndex\) => \([\s\S]*?<View style=\{styles\.primitiveDetailBullet\} \/>[\s\S]*?<PrimitiveDetailWordFlow value=\{line\} \/>/,
  "Why This Read must render each sentence as a safe bullet row",
);
const detailCardStyle = riverRunScreen.match(
  /primitiveDetail:\s*\{([\s\S]*?)\n  \},/,
);
const detailTextStyle = riverRunScreen.match(
  /primitiveDetailText:\s*\{([\s\S]*?)\n  \},/,
);
assert(detailCardStyle, "Missing Why This Read card style");
assert(detailTextStyle, "Missing Why This Read text style");
for (
  const [name, style] of [
    ["card", detailCardStyle[1]],
    ["text", detailTextStyle[1]],
  ] as const
) {
  assert.equal(
    /\b(?:height|maxHeight):/.test(style),
    false,
    `Why This Read ${name} must not impose a fixed height`,
  );
  assert.equal(
    /overflow:\s*"hidden"/.test(style),
    false,
    `Why This Read ${name} must not suppress overflowing copy`,
  );
}
assert.equal(
  /primitiveDetailBody|detailBodyWidth|detailCopy/.test(
    riverRunScreen,
  ),
  false,
  "Why This Read must not restore a native paragraph-width workaround",
);
assert.equal(
  /Math\.round\(primitive\.score\)|primitiveScoreValue|primitiveScoreMax/.test(
    riverRunScreen,
  ),
  false,
  "River Run must not restore generic primitive scores on public cards",
);
assert.match(
  riverRunScreen,
  /styles\.primitiveHeaderState[\s\S]*?\{visual\.stateLabel\}/,
  "Fish In River must render its clarified within-run state wording",
);
const primitiveHeaderStateStyle = riverRunScreen.match(
  /primitiveHeaderState:\s*\{([\s\S]*?)\n  \},/,
);
assert(primitiveHeaderStateStyle, "Missing primitive header state style");
assert.match(
  primitiveHeaderStateStyle[1],
  /includeFontPadding:\s*false/,
  "Primitive state headings must disable Android font padding for vertical alignment",
);
assert.match(
  primitiveHeaderStateStyle[1],
  /textAlignVertical:\s*"center"/,
  "Primitive state headings must remain vertically centered on Android",
);
assert.match(
  riverRunVisual,
  /model\.kind === "fish_in_river"[\s\S]*?RIVER CEILING[\s\S]*?\{model\.riverMaximum\}[\s\S]*?\/100/,
  "Fish In River must put the river ceiling in the top-right badge",
);
assert.match(
  riverRunVisual,
  /HISTORICAL MIGRATION STRENGTH[\s\S]*?historicalStrengthColor[\s\S]*?model\.historicalRunStrength[\s\S]*?PRESENCE INDEX[\s\S]*?presenceIndexScore[\s\S]*?color: model\.accent[\s\S]*?\{model\.score\}[\s\S]*?presenceIndexMaximum[\s\S]*?>\/100</,
  "Fish In River must color only the presence score and keep /100 separate",
);
assert.match(
  riverRunVisual,
  /presenceIndexScore:\s*\{[\s\S]*?fontSize:\s*13[\s\S]*?presenceIndexMaximum:\s*\{[\s\S]*?fontSize:\s*10[\s\S]*?color:\s*"#FFFFFF"/,
  "The colored presence score must be larger than the white /100 maximum",
);
assert.match(
  riverRunVisual,
  /function historicalStrengthColor[\s\S]*?case "strong":[\s\S]*?#48CF78[\s\S]*?case "moderate":[\s\S]*?#F2C94C[\s\S]*?case "limited":[\s\S]*?case "weak":[\s\S]*?#F06A61/,
  "Historical migration strength must be green, yellow, or red by tier",
);
assert.match(
  riverRunScreen,
  /function PrimitiveGuideReadCopy[\s\S]*?style=\{styles\.primitiveTipText\}[\s\S]*?\{value\.trim\(\)\}/,
  "Guide's Read must use native multiline text with stable Android line metrics",
);
assert.match(
  riverRunScreen,
  /const \[detailExpanded, setDetailExpanded\] = useState\(false\)[\s\S]*?accessibilityState=\{\{ expanded: detailExpanded \}\}[\s\S]*?WHY THIS READ[\s\S]*?detailExpanded[\s\S]*?<PrimitiveDetailCopy/,
  "Why This Read must be an accessible collapsed-by-default disclosure while Guide's Read remains visible",
);
assert.match(
  riverRunScreen,
  /activity\.reasonCodes\?\.includes\("activity_weather_only"\)[\s\S]*?WEATHER-ONLY ACTIVITY[\s\S]*?Limited for this river[\s\S]*?No live river metrics[\s\S]*?no measured water[\s\S]*?temperature, level, or clarity/,
  "Weather-only Activity must visibly distinguish ungauged rivers from live river-metric outlooks",
);
assert.match(
  riverRunScreen,
  /function PrimitiveHeadlineCopy[\s\S]*?style=\{styles\.primitiveHeadlineText\}[\s\S]*?\{value\.trim\(\)\}/,
  "Every primitive headline must use native multiline text with stable Android line metrics",
);
assert.match(
  riverRunVisual,
  /model\.kind === "fish_in_river" && ceilingPercent < 100[\s\S]*?presenceAboveCeiling/,
  "Fish In River must visibly mask the scale above a run's configured ceiling",
);
assert.match(
  riverRunScreen,
  /<Text style=\{styles\.resultHeroMetaLabel\}>DATA<\/Text>[\s\S]*?snapshot\?\.dataQuality\.label/,
  "River Run must keep the top-level data-quality status visible",
);
assert.equal(
  /function EvidenceSection|DATA BEHIND THIS READ|MEASURED INPUTS|Gauge reading|Gauge source|Temp source|Weather source/
    .test(
      riverRunScreen,
    ),
  false,
  "River Run must not expose the removed evidence dropdown or raw source metadata",
);
assert.match(
  riverRunScreen,
  /function GaugeForecastDropdown[\s\S]*?GAUGE & FORECAST CONTEXT[\s\S]*?snapshot\.safety\.gaugeBasis[\s\S]*?Forecast weather informs Activity Outlook only; Fishability[\s\S]*?remains observation-led/,
  "Gauge basis and visible-primitive forecast notes must live together in a dedicated dropdown",
);
assert.match(
  riverRunScreen,
  /function ResultDropdown[\s\S]*?useState\(false\)[\s\S]*?accessibilityState=\{\{ expanded \}\}[\s\S]*?chevron-up[\s\S]*?chevron-down/,
  "Result information dropdowns must be collapsed by default and accessible",
);
assert.match(
  riverRunScreen,
  /<FishingMethodsDropdown species=\{species\} \/>/,
  "Every generated River Run read must include its species-specific fishing guide",
);
assert.match(
  riverRunFishingGuides,
  /PACIFIC_SALMON_GUIDE[\s\S]*?Float or centerpin eggs[\s\S]*?ThunderSticks[\s\S]*?Bottom-drift or chuck-and-duck[\s\S]*?Beads[\s\S]*?Swinging flies/,
  "The salmon guide must include the complete reaction-presentation method set",
);
assert.match(
  riverRunFishingGuides,
  /species === "chinook_salmon" \|\| species === "coho_salmon"[\s\S]*?return PACIFIC_SALMON_GUIDE/,
  "Chinook and Coho must share the salmon guide",
);
assert.match(
  riverRunFishingGuides,
  /STEELHEAD_GUIDE[\s\S]*?continue to feed[\s\S]*?Float or centerpin presentations[\s\S]*?Indicator nymphing[\s\S]*?Swinging flies[\s\S]*?Stripping flies[\s\S]*?Spinners, spoons and plugs[\s\S]*?Bottom drifting/,
  "Steelhead must have a feeding-aware, species-specific method guide",
);
assert.match(
  riverRunFishingGuides,
  /flies-only or artificial-lures-only[\s\S]*?bait, bead, hook, weight[\s\S]*?Never snag/,
  "Fishing methods must carry a prominent reach-specific regulation and anti-snagging warning",
);
assert.match(
  riverRunScreen,
  /function reviewScenarioDateCopy[\s\S]*?AUDIT ONLY[\s\S]*?State begins[\s\S]*?Push states are driven by live conditions[\s\S]*?Fishability states are driven by live flow/,
  "Review mode must expose effective or fixture dates without adding them to live cards",
);
assert.match(
  riverRunScreen,
  /label=\{`\$\{scenario\.label\} · \$\{[\s\S]*?formatLocalDate\(scenario\.snapshot\.localDate\)/,
  "Every review-state chip must expose its audit date",
);
assert.match(
  riverRunScreen,
  /primitive\.whereToStart[\s\S]*?WHERE TO START[\s\S]*?primitive\.whereToStart/,
  "Migration Stage must render one prominent Where To Start line",
);
const detailFlowStyle = riverRunScreen.match(
  /primitiveDetailText:\s*\{([\s\S]*?)\n  \},/,
);
assert(detailFlowStyle, "Missing Why This Read native text style");
assert.match(
  detailFlowStyle[1],
  /lineHeight:\s*21[\s\S]*?includeFontPadding:\s*false/,
  "Why This Read must use compact Android line metrics",
);
const detailBulletRowStyle = riverRunScreen.match(
  /primitiveDetailBulletRow:\s*\{([\s\S]*?)\n  \},/,
);
assert(detailBulletRowStyle, "Missing Why This Read bullet-row style");
assert.equal(
  /flexDirection:\s*"row"/.test(detailBulletRowStyle[1]),
  false,
  "Why This Read bullet rows must not restore the native flex text-row bug",
);

for (
  const species of [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "atlantic_salmon",
  ] as const
) {
  const imagePath = `${projectRoot}assets/images/fish/${species}.png`;
  assert(existsSync(imagePath), `Missing River Run ${species} image`);
  const png = readFileSync(imagePath);
  assert.equal(png.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(
    png[25],
    6,
    `${species} image must be an RGBA PNG with transparency`,
  );
}
const speciesImageRegistry = readFileSync(
  `${projectRoot}lib/riverRunSpeciesImages.ts`,
  "utf8",
);
assert.match(speciesImageRegistry, /coho_salmon\.png/);
assert.match(speciesImageRegistry, /steelhead\.png/);
assert.match(speciesImageRegistry, /atlantic_salmon\.png/);
for (const size of ["small", "medium", "large"] as const) {
  const imagePath = `${projectRoot}assets/images/river-run/river_${size}.png`;
  assert(existsSync(imagePath), `Missing ${size} river selector image`);
  const png = readFileSync(imagePath);
  assert.equal(png.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(png[25], 6, `${size} river image must retain transparency`);
}
const riverChoiceImageRegistry = readFileSync(
  `${projectRoot}lib/riverRunChoiceImages.ts`,
  "utf8",
);
for (const riverId of ["pere_marquette", "white"]) {
  assert.match(
    riverChoiceImageRegistry,
    new RegExp(`${riverId}: "medium"`),
  );
}
assert.match(
  riverChoiceImageRegistry,
  /betsie: "small"/,
  "Betsie should use the small-river artwork in recognition of its short below-Homestead corridor",
);
for (
  const riverId of [
    "big_manistee",
    "muskegon",
    "st_joseph",
    "grand",
    "platte",
    "au_sable",
  ]
) {
  assert.match(
    riverChoiceImageRegistry,
    new RegExp(`${riverId}: "large"`),
  );
}
assert.doesNotMatch(
  riverRunScreen,
  /Activity Outlook is not configured|first production slice is limited/,
  "Live River Run must not expose stale review-era Activity fallback copy",
);
assert.match(
  riverRunScreen,
  /function StateChoiceIcon[\s\S]*?<TopographicLines[\s\S]*?\{stateCode\}/,
  "State choices must render readable monograms over contour lines",
);
for (const icon of ["leaf", "snow", "flower", "sunny"]) {
  assert.match(
    riverRunScreen,
    new RegExp(`icon: "${icon}"`),
    `Missing ${icon} season icon`,
  );
}
assert.match(
  riverRunScreen,
  /const riverImage = step === 4 \? getRiverRunRiverImage\(choice\.id\) : null/,
  "River choices must resolve their size-specific illustrations",
);
assert.doesNotMatch(
  riverRunScreen.match(/style=\{\[styles\.choiceTitle[\s\S]*?<\/Text>/)?.[0] ??
    "",
  /adjustsFontSizeToFit/,
  "Choice titles must not auto-shrink the enabled Michigan row",
);
assert.match(
  riverRunScreen,
  /selectedSpecies === "coho_salmon"[\s\S]*?RIVER_RUN_COHO_REVIEW_GROUPS[\s\S]*?selectedSpecies === "steelhead"[\s\S]*?RIVER_RUN_STEELHEAD_REVIEW_GROUPS[\s\S]*?: RIVER_RUN_REVIEW_GROUPS/,
  "Development review must select species-correct Coho fixtures",
);
assert.match(
  riverRunScreen,
  /runId: "pere_marquette_fall_coho"[\s\S]*?species: "coho_salmon"/,
  "Development catalog must expose the Coho review run",
);
assert.match(
  riverRunScreen,
  /runId: "pere_marquette_fall_steelhead"[\s\S]*?species: "steelhead"/,
  "Development catalog must expose the Fall Steelhead review run",
);

console.log(
  "River Run UI QA passed: compact catalog filtering, state/season icons, river-size artwork, and four transparent salmonid assets.",
);
