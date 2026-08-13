import assert from "node:assert/strict";

import {
  RIVER_RUN_BETSIE_COHO_REVIEW_GROUPS,
  RIVER_RUN_BETSIE_REVIEW_GROUPS,
  RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS,
} from "../lib/riverRunReviewFixtures";

const runs = [
  ["Chinook", RIVER_RUN_BETSIE_REVIEW_GROUPS],
  ["Coho", RIVER_RUN_BETSIE_COHO_REVIEW_GROUPS],
  ["Steelhead", RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS],
] as const;
const foreignGeography =
  /Pere Marquette|Maple Leaf|Green Cottage|Little Manistee|Tippy|Croton|Newaygo|Niles|South Bend|Mishawaka|Twin Branch|St\. Joseph|Muskegon/i;
const vagueBetsieSections =
  /\b(?:lower|middle|upper)[ -](?:river|reach|section|Betsie)\b|lakeward end|legal Homestead approach/i;
const wrongfulPassage =
  /above[- ]Homestead|above the (?:dam|structure)|pass(?:ed|ing)? (?:the structure|upstream)/i;
const filler =
  /at this point in time|generally speaking|it is important to|in order to|as a matter of fact/i;
const internalProcessLanguage =
  /\b(?:accepted|configured|owner-approved|research-approved|audited|calibrated)\b/i;

let scenarioCount = 0;
for (const [species, groups] of runs) {
  for (const group of groups) {
    for (const scenario of group.scenarios) {
      scenarioCount++;
      const snapshot = scenario.snapshot;
      const primitives = [
        snapshot.runStage,
        snapshot.conditionsSuggest,
        snapshot.push,
        snapshot.fishability,
        snapshot.activity,
        snapshot.fishInRiver,
      ].filter(Boolean);
      const copy = primitives.map((primitive) =>
        [
          primitive?.headline,
          "whereToStart" in (primitive ?? {})
            ? (primitive as { whereToStart?: string }).whereToStart
            : undefined,
          primitive?.detail,
          primitive?.tip,
        ].filter(Boolean).join(" ")
      ).join(" ");

      assert.equal(
        foreignGeography.test(copy),
        false,
        `${species}/${scenario.id}: foreign geography`,
      );
      assert.equal(
        vagueBetsieSections.test(copy),
        false,
        `${species}/${scenario.id}: vague Betsie section`,
      );
      assert.equal(
        wrongfulPassage.test(copy),
        false,
        `${species}/${scenario.id}: wrongful dam passage`,
      );
      assert.equal(
        filler.test(copy),
        false,
        `${species}/${scenario.id}: filler copy`,
      );
      assert.equal(
        internalProcessLanguage.test(copy),
        false,
        `${species}/${scenario.id}: internal product-process language`,
      );
      assert.equal(
        /\bwinter(?:time| holding| read| outlook)?\b/i.test(copy),
        false,
        `${species}/${scenario.id}: winter reference`,
      );
      assert.equal(
        /river-wide|full-corridor guarantee/i.test(copy),
        false,
        `${species}/${scenario.id}: overbroad distribution`,
      );

      for (const primitive of primitives) {
        assert.equal(
          primitive?.copyVersion,
          "river-run-copy-v35",
          `${species}/${scenario.id}: stale copy version`,
        );
        assert(
          wordCount(primitive?.headline) <= 20,
          `${species}/${scenario.id}: long headline`,
        );
        assert(
          wordCount(primitive?.detail) <= 42,
          `${species}/${scenario.id}: long Why copy`,
        );
        assert(
          wordCount(primitive?.tip) <= 32,
          `${species}/${scenario.id}: long Guide copy`,
        );
        assert(
          sentenceCount(primitive?.detail) <= 3,
          `${species}/${scenario.id}: more than three Why points`,
        );
      }

      assert.equal(snapshot.conditionsSuggest.score, null);
      assert.equal(snapshot.push.score, null);
      assert.equal(snapshot.fishability.score, null);
      assert.match(
        snapshot.conditionsSuggest.headline,
        /not available for the Betsie/i,
      );
      assert.match(snapshot.push.headline, /not available for the Betsie/i);
      assert.match(
        snapshot.fishability.headline,
        /not available for the Betsie/i,
      );

      if (group.id === "run_stage" && snapshot.runStage.whereToStart) {
        assert.match(
          snapshot.runStage.whereToStart,
          /Betsie Lake–US-31 reach|US-31–Homestead reach|Lake Michigan, Frankfort harbor, and Betsie Lake|No dependable starting reach/i,
          `${species}/${scenario.id}: Where to Start lacks an approved anchor`,
        );
      }

      if (group.id === "activity" && snapshot.activity?.score != null) {
        const sorted = [...snapshot.activity.blocks].sort((a, b) =>
          b.score - a.score
        );
        const separated = sorted[0].score - sorted[1].score >= 3;
        if (separated) {
          assert.match(
            snapshot.activity.detail,
            new RegExp(`${escapeRegExp(sorted[0].label)} is strongest`, "i"),
          );
          assert.doesNotMatch(
            snapshot.activity.detail,
            /leading windows, but neither/i,
          );
        } else {
          assert.doesNotMatch(snapshot.activity.detail, /\bis strongest\b/i);
          assert.match(
            snapshot.activity.detail,
            /leading windows, but neither has a clear advantage/i,
          );
        }
      }

      const presence = snapshot.fishInRiver;
      if (presence.displayScore != null && presence.score != null) {
        assert(
          presence.displayScore % 5 === 0 ||
            presence.displayScore === presence.riverCeiling,
          `${species}/${scenario.id}: public presence score is not rounded to five`,
        );
      }
    }
  }
}

const steelheadComplete = RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS
  .flatMap((group) => group.scenarios)
  .find((scenario) => scenario.id === "activity_fall_entry_complete")?.snapshot;
assert(steelheadComplete);
assert.equal(steelheadComplete.runStage.label, "Fall entry complete");
assert.equal(steelheadComplete.runStage.winterHoldingContext, false);
assert.equal(steelheadComplete.fishInRiver.score, null);
assert.equal(steelheadComplete.fishInRiver.displayScore, undefined);
assert.equal(steelheadComplete.activity?.score, null);
assert.deepEqual(steelheadComplete.activity?.blocks, []);
assert.match(steelheadComplete.runStage.tip ?? "", /late August/i);

for (
  const groups of [
    RIVER_RUN_BETSIE_REVIEW_GROUPS,
    RIVER_RUN_BETSIE_COHO_REVIEW_GROUPS,
  ]
) {
  const complete = groups.flatMap((group) => group.scenarios)
    .find((scenario) => scenario.id === "stage_offseason")?.snapshot;
  assert(complete);
  assert.equal(complete.runStage.label, "Fall run complete");
  assert.match(complete.runStage.headline, /fall run is complete/i);
  assert.equal(complete.fishInRiver.label, "Fall run complete");
  assert.equal(complete.fishInRiver.score, null);
  assert.equal(complete.fishInRiver.displayScore, undefined);
}

console.log(
  `Betsie copy QA passed across ${scenarioCount} production-derived scenarios and all six primitives.`,
);

function wordCount(value?: string): number {
  return value?.trim() ? value.trim().split(/\s+/).length : 0;
}

function sentenceCount(value?: string): number {
  return value?.trim()
    ? value.split(/[.!?]+(?:\s|$)/).filter((part) => part.trim()).length
    : 0;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
