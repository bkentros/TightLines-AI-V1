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
  ["MI", "WI"],
);
assert.deepEqual(
  riverRunSeasonChoices(catalog, "MI").map((choice) => choice.id),
  ["fall", "spring"],
);
assert.deepEqual(
  riverRunSpeciesChoices(catalog, "MI", "fall").map((choice) => choice.id),
  ["chinook_salmon"],
);
assert.deepEqual(
  riverRunRiverChoices(catalog, "MI", "fall", "chinook_salmon").map(
    (choice) => choice.id,
  ),
  ["pere_marquette", "betsie"],
);
assert.deepEqual(
  riverRunRiverChoices(catalog, "WI", "fall", "coho_salmon").map(
    (choice) => choice.id,
  ),
  ["root"],
);
assert.equal(formatRiverRunSpecies("chinook_salmon"), "Chinook Salmon");

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

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const riverRunScreen = readFileSync(
  `${projectRoot}app/river-run.tsx`,
  "utf8",
);
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
  "River Run must keep internal scores off the public primitive cards",
);
assert.match(
  riverRunScreen,
  /function formatPreviousTimingRead[\s\S]*?Previous timing read:[\s\S]*?previousTimingLabel[\s\S]*?formatLocalDate\(timing\.previousCheckpointDate\)/,
  "Run Timing must display the dated previous checkpoint read",
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
  /function formatLastSupportivePush[\s\S]*?Last supportive signal this run/,
  "Push history must retain the last supportive signal as secondary context",
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

const chinookPath = `${projectRoot}assets/images/fish/chinook_salmon.png`;
assert(existsSync(chinookPath), "Missing River Run Chinook image");
const png = readFileSync(chinookPath);
assert.equal(png.subarray(1, 4).toString("ascii"), "PNG");
assert.equal(
  png[25],
  6,
  "Chinook image must be an RGBA PNG with transparency",
);

console.log(
  "River Run UI QA passed: catalog order, downstream filtering, target resolution, unclipped detail copy, dated Push history without scores, and Chinook alpha asset.",
);
