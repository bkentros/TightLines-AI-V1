import assert from "node:assert/strict";

import { RIVER_RUN_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";
import {
  formatRiverRunTabStatus,
  resolveRiverRunVisualModel,
  type RiverRunVisualKind,
} from "../lib/riverRunVisuals";

const TARGETS = {
  run_stage: {
    kind: "run_stage",
    primitive: "runStage",
    expectedStops: 7,
  },
  conditions: {
    kind: "run_timing",
    primitive: "conditionsSuggest",
    expectedStops: 3,
  },
  push: {
    kind: "push",
    primitive: "push",
    expectedStops: 5,
  },
  fishability: {
    kind: "fishability",
    primitive: "fishability",
    expectedStops: 5,
  },
  fish_in_river: {
    kind: "fish_in_river",
    primitive: "fishInRiver",
    expectedStops: 6,
  },
} as const;

const seen = new Map<RiverRunVisualKind, Set<string>>();
let visualCount = 0;

for (const [groupId, target] of Object.entries(TARGETS)) {
  const group = RIVER_RUN_REVIEW_GROUPS.find((item) => item.id === groupId);
  assert(group, `Missing review group ${groupId}`);
  const labels = new Set<string>();

  for (const scenario of group.scenarios) {
    const primitive = scenario.snapshot[target.primitive];
    const model = resolveRiverRunVisualModel({
      kind: target.kind,
      primitive,
    });

    assert.equal(model.kind, target.kind);
    assert.equal(
      model.stops.length,
      target.expectedStops,
      `${scenario.id} has the wrong meter scale`,
    );
    assert(
      model.position >= 0 && model.position <= 1,
      `${scenario.id} marker is outside its meter`,
    );
    assert(model.stateLabel.trim().length > 0);
    assert(model.stateNote.trim().length > 0);
    const tabStatus = formatRiverRunTabStatus(target.kind, primitive);
    assert(tabStatus.trim().length > 0, `${scenario.id} has no tab status`);
    assert(
      tabStatus.length <= 14,
      `${scenario.id} tab status is too long for the five-tab rail: ${tabStatus}`,
    );
    assert(/^#[0-9A-F]{6}$/i.test(model.accent));
    assert.equal(
      new Set(model.stops.map((stop) => stop.shortLabel)).size,
      model.stops.length,
      `${scenario.id} repeats a visible meter label`,
    );
    for (const stop of model.stops) {
      assert(stop.label.trim().length > 0);
      assert(stop.shortLabel.trim().length > 0);
      assert(/^#[0-9A-F]{6}$/i.test(stop.color));
    }

    labels.add(primitive.label);
    visualCount += 1;
  }

  seen.set(target.kind, labels);
}

assert.deepEqual(
  seen.get("run_stage"),
  new Set([
    "Pre-run",
    "Beginning",
    "Building",
    "Peak",
    "Tapering",
    "Ending",
    "Post-run",
  ]),
);
assert.deepEqual(
  seen.get("run_timing"),
  new Set([
    "Evaluating",
    "Ahead",
    "Typical",
    "Delayed",
    "Insufficient evidence",
    "Timing complete",
  ]),
);
assert.deepEqual(
  seen.get("push"),
  new Set([
    "Weak",
    "No clear push",
    "Possible",
    "Strong",
    "Very strong",
    "Unavailable",
    "Waiting for run",
    "Run complete",
  ]),
);
assert.deepEqual(
  seen.get("fishability"),
  new Set([
    "Poor",
    "Tough",
    "Fishable",
    "Good",
    "Excellent",
    "Unavailable",
  ]),
);

const conditionsGroup = RIVER_RUN_REVIEW_GROUPS.find((item) =>
  item.id === "conditions"
)!;
const timingScale = resolveRiverRunVisualModel({
  kind: "run_timing",
  primitive: conditionsGroup.scenarios.find((scenario) =>
    scenario.snapshot.conditionsSuggest.label === "Typical"
  )!.snapshot.conditionsSuggest,
}).stops;
assert.deepEqual(
  timingScale.map((stop) => [stop.label, stop.color]),
  [
    ["Delayed", "#C94A42"],
    ["Typical", "#D6AA32"],
    ["Ahead", "#3DA85F"],
  ],
  "Run Timing must read red, yellow, green from left to right",
);
for (const scenario of conditionsGroup.scenarios) {
  const model = resolveRiverRunVisualModel({
    kind: "run_timing",
    primitive: scenario.snapshot.conditionsSuggest,
  });
  const label = scenario.snapshot.conditionsSuggest.label;
  if (label === "Evaluating") assert.equal(model.specialState, "waiting");
  if (label === "Insufficient evidence") {
    assert.equal(model.specialState, "unavailable");
  }
  if (label === "Timing complete") {
    assert.equal(model.specialState, "complete");
    const finalRead = scenario.snapshot.conditionsSuggest.timingLabel;
    if (finalRead && ["Ahead", "Typical", "Delayed"].includes(finalRead)) {
      assert.notEqual(
        model.selectedIndex,
        null,
        `${scenario.id} must preserve its final timing read`,
      );
    } else {
      assert.equal(
        model.selectedIndex,
        null,
        `${scenario.id} must not invent a final timing read`,
      );
    }
  }
}

const pushGroup = RIVER_RUN_REVIEW_GROUPS.find((item) => item.id === "push")!;
for (const scenario of pushGroup.scenarios) {
  const model = resolveRiverRunVisualModel({
    kind: "push",
    primitive: scenario.snapshot.push,
  });
  assert.equal(model.kicker, "FRESH FISH MOVEMENT SIGNAL");
  assert.equal(model.artLabel, "LAKE → RIVER");
  const label = scenario.snapshot.push.label;
  if (label === "Waiting for run") {
    assert.equal(model.specialState, "waiting");
  }
  if (label === "Run complete") {
    assert.equal(model.specialState, "complete");
  }
  if (label === "Unavailable") {
    assert.equal(model.specialState, "unavailable");
  }
  if (!model.specialState) {
    assert.equal(model.stateNote, "FRESH-WAVE POTENTIAL TODAY");
  }
}

const fishabilityGroup = RIVER_RUN_REVIEW_GROUPS.find((item) =>
  item.id === "fishability"
)!;
for (const scenario of fishabilityGroup.scenarios) {
  const model = resolveRiverRunVisualModel({
    kind: "fishability",
    primitive: scenario.snapshot.fishability,
  });
  if (scenario.snapshot.fishability.label === "Unavailable") {
    assert.equal(model.specialState, "unavailable");
  }
}

const presenceGroup = RIVER_RUN_REVIEW_GROUPS.find((item) =>
  item.id === "fish_in_river"
)!;
const presenceScale = resolveRiverRunVisualModel({
  kind: "fish_in_river",
  primitive: presenceGroup.scenarios[0].snapshot.fishInRiver,
}).stops;
assert.deepEqual(
  presenceScale.map((stop) => stop.color),
  [
    "#B83A32",
    "#D94B3A",
    "#E89647",
    "#E8C547",
    "#7CC36A",
    "#3DA85F",
  ],
  "Fish In River must use the same red-orange-yellow-green score progression",
);
assert.deepEqual(
  new Set(
    presenceGroup.scenarios.map((scenario) =>
      resolveRiverRunVisualModel({
        kind: "fish_in_river",
        primitive: scenario.snapshot.fishInRiver,
      }).direction
    ),
  ),
  new Set(["outside", "rising", "near_peak", "falling"]),
);

const lowerCap = {
  ...presenceGroup.scenarios.find((scenario) =>
    scenario.snapshot.fishInRiver.label === "Peak presence"
  )!.snapshot.fishInRiver,
  score: 60,
  maximum: 100,
  riverCeiling: 60,
};
const lowerCapModel = resolveRiverRunVisualModel({
  kind: "fish_in_river",
  primitive: lowerCap,
});
assert.equal(lowerCapModel.riverMaximum, 60);
assert.equal(lowerCapModel.selectedIndex, lowerCapModel.stops.length - 1);

for (const group of RIVER_RUN_REVIEW_GROUPS) {
  for (const scenario of group.scenarios) {
    const publicCopy = [
      scenario.snapshot.runStage.headline,
      scenario.snapshot.runStage.detail,
      scenario.snapshot.runStage.tip,
      scenario.snapshot.conditionsSuggest.headline,
      scenario.snapshot.conditionsSuggest.detail,
      scenario.snapshot.conditionsSuggest.tip,
      scenario.snapshot.push.headline,
      scenario.snapshot.push.detail,
      scenario.snapshot.push.tip,
      scenario.snapshot.fishability.headline,
      scenario.snapshot.fishability.detail,
      scenario.snapshot.fishability.tip,
      scenario.snapshot.fishInRiver.headline,
      scenario.snapshot.fishInRiver.detail,
      scenario.snapshot.fishInRiver.tip,
    ].join(" ");
    assert.equal(
      /Conditions Suggest/i.test(publicCopy),
      false,
      `${scenario.id} exposes the retired public primitive name`,
    );
    assert.equal(
      /\b(research(?:ed)?|configured?|checkpoint|baseline|percentile|engine|gauge|modeled|historical|cfs|visibility)\b/i
        .test(publicCopy),
      false,
      `${scenario.id} exposes internal language`,
    );
  }
}

console.log(
  `River Run visual QA passed: ${visualCount} generated primitive states, all scales, special states, directions, and river caps.`,
);
