import assert from "node:assert/strict";

import { RIVER_RUN_STEELHEAD_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";
import {
  resolveRiverRunVisualModel,
  type RiverRunVisualKind,
} from "../lib/riverRunVisuals";

const expectedLabels: Record<string, Set<string>> = {
  run_stage: new Set([
    "Fall entry complete",
    "Before migration",
    "Beginning",
    "Building",
    "Peak",
    "Late fall",
    "Holding transition",
  ]),
  conditions: new Set([
    "Not monitoring yet",
    "Evaluating",
    "Ahead",
    "Typical",
    "Delayed",
    "Insufficient evidence",
    "Timing complete",
  ]),
  push: new Set([
    "Offseason",
    "Weak",
    "No clear push",
    "Possible",
    "Strong",
    "Very strong",
    "Unavailable",
    "Waiting for migration",
    "Fall entry complete",
  ]),
  fishability: new Set([
    "Poor",
    "Tough",
    "Fishable",
    "Good",
    "Excellent",
    "Unavailable",
  ]),
  activity: new Set([
    "Inactive",
    "Reserved",
    "Moderate",
    "Active",
    "Highly active",
    "Fall entry complete",
  ]),
  fish_in_river: new Set([
    "Not expected yet",
    "Low presence",
    "Limited presence",
    "Moderate presence",
    "High presence",
    "Peak presence",
    "Fall entry complete",
  ]),
};

const targets = {
  run_stage: ["run_stage", "runStage"],
  conditions: ["run_timing", "conditionsSuggest"],
  push: ["push", "push"],
  fishability: ["fishability", "fishability"],
  activity: ["activity", "activity"],
  fish_in_river: ["fish_in_river", "fishInRiver"],
} as const;

let scenarioCount = 0;
for (const group of RIVER_RUN_STEELHEAD_REVIEW_GROUPS) {
  assert(group.scenarios.length > 0, `Empty Steelhead group ${group.id}`);
  scenarioCount += group.scenarios.length;
  for (const scenario of group.scenarios) {
    assert(
      scenario.snapshot.runId === "pere_marquette_fall_steelhead" ||
        (group.id === "opportunity_copy" &&
          scenario.snapshot.runId.startsWith("qa_")),
      `${scenario.id} is not a Steelhead snapshot`,
    );
    const primitives = [
      scenario.snapshot.runStage,
      scenario.snapshot.conditionsSuggest,
      scenario.snapshot.push,
      scenario.snapshot.fishability,
      scenario.snapshot.activity,
      scenario.snapshot.fishInRiver,
      scenario.snapshot.interpretationNote,
    ].filter(Boolean);
    const publicCopy = primitives.flatMap((primitive) => [
      primitive!.label,
      primitive!.headline,
      primitive!.detail,
      "tip" in primitive! ? primitive!.tip : "",
      "whereToStart" in primitive! ? primitive!.whereToStart : "",
    ]).join(" ");
    if (group.id !== "opportunity_copy") {
      assert.equal(
        /\b(?:Chinook|Coho|spawning|gravel)\b/i.test(publicCopy),
        false,
      );
    }
    assert.equal(
      /\b(?:research(?:ed)?|configured?|checkpoint|baseline|percentile|engine|gauge|modeled|historical|cfs|visibility)\b/i
        .test(publicCopy),
      false,
      `${scenario.id} exposes internal language`,
    );
    assert.equal(
      /\bguarantee(?:d)?\b|\bloaded\b|\bstacked\b|hot bite|catch probability/i
        .test(publicCopy),
      false,
      `${scenario.id} overclaims`,
    );
  }
}

for (const [groupId, labels] of Object.entries(expectedLabels)) {
  const group = RIVER_RUN_STEELHEAD_REVIEW_GROUPS.find((item) =>
    item.id === groupId
  );
  assert(group, `Missing Steelhead group ${groupId}`);
  const [kind, primitiveKey] = targets[groupId as keyof typeof targets];
  const actual = new Set(
    group.scenarios.map((scenario) => scenario.snapshot[primitiveKey].label),
  );
  assert.deepEqual(actual, labels, `${groupId} state coverage changed`);
  for (const scenario of group.scenarios) {
    const model = resolveRiverRunVisualModel({
      kind: kind as RiverRunVisualKind,
      primitive: scenario.snapshot[primitiveKey],
    });
    assert(model.position >= 0 && model.position <= 1);
  }
}

const presenceScenarios =
  RIVER_RUN_STEELHEAD_REVIEW_GROUPS.find((item) => item.id === "fish_in_river")!
    .scenarios;
const presence = presenceScenarios
  .filter((item) =>
    item.id !== "fish_in_river_moderate_cap" &&
    item.snapshot.fishInRiver.score != null
  )
  .map((item) => item.snapshot.fishInRiver);
assert(presence.every((item) => item.riverCeiling === 80));
assert(
  presence.every((item) => item.historicalRunStrength === "strong"),
);
assert(
  presence.every((item) => typeof item.score === "number"),
  "Every Steelhead Fish In River review state must expose a numeric score",
);
assert(presence.some((item) => item.score === 80));
for (const item of presence) {
  const model = resolveRiverRunVisualModel({
    kind: "fish_in_river",
    primitive: item,
  });
  assert.equal(model.score, item.displayScore ?? item.score);
  assert(model.position >= 0 && model.position <= 1);
}
const completePresence = presenceScenarios.find((item) =>
  item.snapshot.fishInRiver.label === "Fall entry complete"
)?.snapshot.fishInRiver;
assert(completePresence);
assert.equal(completePresence.score, null);
assert.equal(completePresence.winterHoldingContext, false);

const waitingPush =
  RIVER_RUN_STEELHEAD_REVIEW_GROUPS.find((item) => item.id === "push")!
    .scenarios.find((item) =>
      item.snapshot.push.label === "Waiting for migration"
    )!
    .snapshot.push;
assert.match(
  waitingPush.headline ?? "",
  /Dependable (?:PM Steelhead )?fall entry has not started/,
);
assert.match(
  waitingPush.detail ?? "",
  /not scored as an in-season movement signal yet/i,
);
assert.doesNotMatch(
  waitingPush.headline ?? "",
  /fish have not started entering/i,
);

const push = RIVER_RUN_STEELHEAD_REVIEW_GROUPS.find((item) =>
  item.id === "push"
)!.scenarios.map((item) => item.snapshot.push);
assert(
  push.some((item) => item.components?.temperatureState === "cold_active"),
);
const coldHolding = push.find((item) =>
  item.components?.temperatureState === "cold_holding"
);
assert(coldHolding);
assert((coldHolding.score ?? 100) <= 49);
const completedPushModel = resolveRiverRunVisualModel({
  kind: "push",
  primitive: push.find((item) => item.label === "Fall entry complete")!,
});
assert.equal(completedPushModel.specialState, "complete");
assert.match(completedPushModel.stateNote, /FALL-ENTRY SIGNAL COMPLETE/);

console.log(
  `PM Fall Steelhead build QA passed: ${scenarioCount} scenarios, 80-point ceiling, explicit fall-entry completion, dedicated thermal states, copy safety, and visual contracts.`,
);
