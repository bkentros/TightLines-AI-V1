import assert from "node:assert/strict";

import { RIVER_RUN_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";

const expectedLabels: Record<string, Set<string>> = {
  run_stage: new Set([
    "Pre-run",
    "Beginning",
    "Building",
    "Peak",
    "Tapering",
    "Ending",
    "Post-run",
  ]),
  conditions: new Set([
    "Evaluating",
    "Ahead",
    "Typical",
    "Delayed",
    "Insufficient evidence",
    "Timing complete",
  ]),
  push: new Set([
    "Weak",
    "No clear push",
    "Possible",
    "Strong",
    "Very strong",
    "Unavailable",
    "Tracking not started",
    "Tracking complete",
  ]),
  fishability: new Set([
    "Poor",
    "Tough",
    "Fishable",
    "Good",
    "Excellent",
    "Unavailable",
  ]),
};

for (const [groupId, labels] of Object.entries(expectedLabels)) {
  const group = RIVER_RUN_REVIEW_GROUPS.find((item) => item.id === groupId);
  assert(group, `Missing review group ${groupId}`);
  const actual = new Set(group.scenarios.map((scenario) => {
    switch (groupId) {
      case "run_stage":
        return scenario.snapshot.runStage.label;
      case "conditions":
        return scenario.snapshot.conditionsSuggest.label;
      case "push":
        return scenario.snapshot.push.label;
      case "fishability":
        return scenario.snapshot.fishability.label;
      default:
        return "";
    }
  }));
  assert.deepEqual(actual, labels);
}

const presence = RIVER_RUN_REVIEW_GROUPS.find((item) =>
  item.id === "fish_in_river"
);
assert(presence);
assert.deepEqual(
  new Set(presence.scenarios.map((item) => item.snapshot.fishInRiver.score)),
  new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
);

for (const group of RIVER_RUN_REVIEW_GROUPS) {
  assert(group.scenarios.length > 0);
  for (const scenario of group.scenarios) {
    const snapshot = scenario.snapshot;
    assert(snapshot.engineVersion.endsWith("-review-fixture"));
    assert(snapshot.configVersion.endsWith("-review-fixture"));
    assert.equal(snapshot.localDate.length, 10);
    for (
      const primitive of [
        snapshot.runStage,
        snapshot.conditionsSuggest,
        snapshot.push,
        snapshot.fishability,
        snapshot.fishInRiver,
      ]
    ) {
      assert(primitive.label.trim().length > 0);
      assert(primitive.headline?.trim().length);
      assert(primitive.detail?.trim().length);
      assert(primitive.tip?.trim().length);
    }
  }
}

console.log(
  `River Run review mode QA passed: ${
    RIVER_RUN_REVIEW_GROUPS.reduce(
      (count, group) => count + group.scenarios.length,
      0,
    )
  } local scenarios.`,
);
