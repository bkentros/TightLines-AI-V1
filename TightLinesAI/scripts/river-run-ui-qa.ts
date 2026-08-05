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
  ["MI", "NY", "WI", "OH"],
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
  riverRunSeasonChoices(catalog, "MI").find((choice) =>
    choice.id === "winter"
  )?.disabled,
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
for (const species of ["coho_salmon", "steelhead"]) {
  assert.deepEqual(
    riverRunRiverChoices(catalog, "MI", "fall", species).map((choice) =>
      choice.id
    ),
    michiganFallRiverIds,
  );
}
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
  /title="River Migration"[\s\S]*?desc="Migration stage, river conditions, fishability & fish presence"[\s\S]*?descLines=\{2\}/,
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
  "Every setup step must expose the compact coverage-request route",
);
assert.match(
  riverRunScreen,
  /choice\.id === "steelhead"[\s\S]*?speciesChoiceImageSteelhead/,
  "Steelhead must use its normalized compact selector-image sizing",
);
const riverRunVisual = readFileSync(
  `${projectRoot}components/river-run/RiverRunVisual.tsx`,
  "utf8",
);
const anglerFacingFeatureSources = [
  riverRunScreen,
  riverRunVisual,
  welcomeScreen,
  homeScreen,
  readFileSync(`${projectRoot}app/module-icons-preview.tsx`, "utf8"),
  readFileSync(`${projectRoot}lib/riverRunCatalogSelection.ts`, "utf8"),
];
for (const source of anglerFacingFeatureSources) {
  assert.equal(
    /\b(?:River Run|Run Stage|Run Timing|Pre-run|Post-run|Waiting for run|Run complete|Audited river run|Daily run score)\b/i
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
  /function PrimitiveDetailWordFlow\(\{ value \}: \{ value: string \}\)[\s\S]*?value\.trim\(\)\.split\(\/\\s\+\/\)[\s\S]*?words\.map\(\(word, wordIndex\) => \([\s\S]*?<Text[\s\S]*?\{word\}[\s\S]*?<\/Text>/,
  "Why This Read must wrap independently measured words instead of one native paragraph",
);
assert.match(
  riverRunScreen,
  /function PrimitiveDetailCopy\(\{ value \}: \{ value: string \}\)[\s\S]*?splitPrimitiveDetail\(value\)[\s\S]*?detailLines\.map\(\(line, lineIndex\) => \([\s\S]*?<View style=\{styles\.primitiveDetailBullet\} \/>[\s\S]*?<PrimitiveDetailWordFlow value=\{line\} \/>/,
  "Why This Read must render each sentence as a safe bullet row",
);
const detailCardStyle = riverRunScreen.match(
  /primitiveDetail:\s*\{([\s\S]*?)\n  \},/,
);
const detailTextStyle = riverRunScreen.match(
  /primitiveDetailWord:\s*\{([\s\S]*?)\n  \},/,
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
assert.match(
  riverRunVisual,
  /model\.kind === "fish_in_river"[\s\S]*?PRESENCE INDEX[\s\S]*?\{model\.score\}[\s\S]*?\/100/,
  "Fish In River must always identify and display its public presence index",
);
assert.match(
  riverRunVisual,
  /styles\.presenceIndexValue[\s\S]*?color: model\.accent[\s\S]*?\{model\.score\}[\s\S]*?styles\.presenceIndexMaximum[\s\S]*?\/100/,
  "Only the Fish In River index value must inherit its absolute meter color",
);
assert.match(
  riverRunVisual,
  /HISTORICAL MIGRATION STRENGTH[\s\S]*?model\.historicalRunStrength[\s\S]*?RIVER \/ SPECIES CEILING[\s\S]*?model\.riverMaximum/,
  "Fish In River must emphasize configured historical strength and ceiling",
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
assert.equal(
  /snapshot\.safety\.gaugeBasis/.test(riverRunScreen),
  false,
  "River Run must not render gauge-basis metadata in the public safety card",
);
assert.match(
  riverRunScreen,
  /function formatPreviousTimingRead[\s\S]*?Previous timing read:[\s\S]*?previousTimingLabel[\s\S]*?formatLocalDate\(timing\.previousCheckpointDate\)/,
  "Migration Timing must display the dated previous checkpoint read",
);
assert.match(
  riverRunScreen,
  /function PushHistoryDropdown[\s\S]*?recentDailyReads[\s\S]*?Recent Push windows[\s\S]*?read\.localDate[\s\S]*?formatPushHistoryWindow/,
  "Push must expose the dated recent daily-read dropdown",
);
assert.equal(
  /PushHistoryDropdown[\s\S]*?\{read\.score\}/.test(riverRunScreen),
  false,
  "Push history must not expose internal numeric scores",
);
assert.match(
  riverRunScreen,
  /function formatLastSupportivePush[\s\S]*?Last supportive signal this season/,
  "Push history must retain the last supportive signal as secondary context",
);
assert.match(
  riverRunScreen,
  /primitive\.whereToStart[\s\S]*?WHERE TO START[\s\S]*?primitive\.whereToStart/,
  "Migration Stage must render one prominent Where To Start line",
);
const detailFlowStyle = riverRunScreen.match(
  /primitiveDetailTextFlow:\s*\{([\s\S]*?)\n  \},/,
);
assert(detailFlowStyle, "Missing Why This Read word-flow style");
assert.match(
  detailFlowStyle[1],
  /flexDirection:\s*"row"[\s\S]*?flexWrap:\s*"wrap"/,
  "Why This Read must wrap word nodes inside the visible card width",
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
for (const riverId of ["pere_marquette", "betsie", "white"]) {
  assert.match(
    riverChoiceImageRegistry,
    new RegExp(`${riverId}: "medium"`),
  );
}
for (const riverId of ["big_manistee", "muskegon", "grand", "platte", "au_sable"]) {
  assert.match(
    riverChoiceImageRegistry,
    new RegExp(`${riverId}: "large"`),
  );
}
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
  riverRunScreen.match(/style=\{\[styles\.choiceTitle[\s\S]*?<\/Text>/)?.[0] ?? "",
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
