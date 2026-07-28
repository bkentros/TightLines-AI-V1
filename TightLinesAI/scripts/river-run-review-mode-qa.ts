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
assert.deepEqual(
  new Set(
    presence.scenarios.map((item) => item.snapshot.fishInRiver.curveDirection),
  ),
  new Set(["outside", "rising", "near_peak", "falling"]),
);

const prohibitedCopy = [
  /\bguarantee(?:d)?\b/i,
  /\bloaded\b/i,
  /\bstacked\b/i,
  /hot bite/i,
  /catch probability/i,
  /matched 24-hour comparison/i,
  /locked cumulative checkpoint/i,
  /hydraulic predictability/i,
  /primary gauged reach/i,
  /primary-reach/i,
  /building historical presence/i,
] as const;

for (const group of RIVER_RUN_REVIEW_GROUPS) {
  assert(group.scenarios.length > 0);
  for (const scenario of group.scenarios) {
    const snapshot = scenario.snapshot;
    assert(snapshot.engineVersion.includes("review"));
    assert(snapshot.configVersion.includes("review"));
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
      assert.equal(primitive.copyVersion, "river-run-copy-v2");
      assert(
        primitive.copyVariant === "A" || primitive.copyVariant === "B",
      );
      const copy = [
        primitive.label,
        primitive.headline,
        primitive.detail,
        primitive.tip,
      ].join(" ");
      for (const pattern of prohibitedCopy) {
        assert.equal(
          pattern.test(copy),
          false,
          `${scenario.id} contains prohibited copy ${pattern}: ${copy}`,
        );
      }
    }
  }
}

for (
  const group of RIVER_RUN_REVIEW_GROUPS.filter((item) =>
    !["combined", "evidence"].includes(item.id)
  )
) {
  const byStem = new Map<string, typeof group.scenarios>();
  for (const scenario of group.scenarios) {
    const stem = scenario.id.replace(/_[ab]$/, "");
    byStem.set(stem, [...(byStem.get(stem) ?? []), scenario]);
  }
  for (const [stem, pair] of byStem) {
    assert.equal(pair.length, 2, `${group.id}/${stem} must include A and B`);
    const a = pair.find((item) => item.id.endsWith("_a"))!;
    const b = pair.find((item) => item.id.endsWith("_b"))!;
    const key = group.id === "run_stage"
      ? "runStage"
      : group.id === "conditions"
      ? "conditionsSuggest"
      : group.id === "fish_in_river"
      ? "fishInRiver"
      : group.id;
    const left = a.snapshot[key as keyof typeof a.snapshot] as {
      score?: number | null;
      label: string;
      headline?: string;
      detail?: string;
      tip?: string;
      reasonCodes?: string[];
      copyVariant?: string;
    };
    const right = b.snapshot[key as keyof typeof b.snapshot] as typeof left;
    assert.equal(left.copyVariant, "A");
    assert.equal(right.copyVariant, "B");
    assert.equal(left.score, right.score, `${group.id}/${stem} score drift`);
    assert.equal(left.label, right.label, `${group.id}/${stem} label drift`);
    assert.deepEqual(
      left.reasonCodes,
      right.reasonCodes,
      `${group.id}/${stem} reason-code drift`,
    );
    assert.equal(
      left.detail,
      right.detail,
      `${group.id}/${stem} factual detail drift`,
    );
    assert.notEqual(
      left.headline,
      right.headline,
      `${group.id}/${stem} headline did not vary`,
    );
    assert.notEqual(
      left.tip,
      right.tip,
      `${group.id}/${stem} takeaway did not vary`,
    );
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
