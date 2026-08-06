import assert from "node:assert/strict";

import { RIVER_RUN_COHO_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";
import {
  resolveRiverRunVisualModel,
  type RiverRunVisualKind,
} from "../lib/riverRunVisuals";

const expectedLabels: Record<string, Set<string>> = {
  run_stage: new Set([
    "Offseason",
    "Before migration",
    "Beginning",
    "Building",
    "Peak",
    "Tapering",
    "Ending",
    "After migration",
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
    "Migration complete",
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
  ]),
  fish_in_river: new Set([
    "Offseason",
    "Not expected yet",
    "Low presence",
    "Limited presence",
    "Moderate presence",
    "High presence",
    "Peak presence",
    "Migration complete",
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
for (const group of RIVER_RUN_COHO_REVIEW_GROUPS) {
  assert(group.scenarios.length > 0, `Empty Coho review group ${group.id}`);
  scenarioCount += group.scenarios.length;
  for (const scenario of group.scenarios) {
    assert(
      scenario.snapshot.runId === "pere_marquette_fall_coho" ||
        (group.id === "opportunity_copy" &&
          scenario.snapshot.runId.startsWith("qa_")),
      `${scenario.id} is not a Coho acceptance snapshot`,
    );
    assert.equal(
      /Chinook/i.test(JSON.stringify(scenario.snapshot)),
      false,
      `${scenario.id} leaks Chinook identity into Coho acceptance`,
    );
    const publicCopy = [
      scenario.snapshot.runStage,
      scenario.snapshot.conditionsSuggest,
      scenario.snapshot.push,
      scenario.snapshot.fishability,
      scenario.snapshot.activity,
      scenario.snapshot.fishInRiver,
      scenario.snapshot.interpretationNote,
    ].flatMap((primitive) =>
      primitive
        ? [
          "label" in primitive ? primitive.label : "",
          primitive.headline,
          primitive.detail,
          "tip" in primitive ? primitive.tip : "",
          "whereToStart" in primitive ? primitive.whereToStart : "",
        ]
        : []
    ).join(" ");
    assert.equal(
      /\b(research(?:ed)?|configured?|checkpoint|baseline|percentile|engine|gauge|modeled|historical|cfs|visibility|run)\b/i
        .test(publicCopy),
      false,
      `${scenario.id} exposes internal language`,
    );
    assert.equal(
      /\bguarantee(?:d)?\b|\bloaded\b|\bstacked\b|hot bite|catch probability/i
        .test(publicCopy),
      false,
      `${scenario.id} overclaims the Coho opportunity`,
    );
    assert.equal(
      /river mouth|lower[- ]river|middle[- ]river|upper[- ]river|travel lanes?|holding water|\bholes?\b|\bbends?\b|current edges?/i
        .test(
          scenario.snapshot.fishInRiver.tip,
        ),
      false,
      `${scenario.id} Fish In River guidance prescribes a location owned by Migration Stage`,
    );
  }
}
assert.equal(scenarioCount, 119);

for (const [groupId, labels] of Object.entries(expectedLabels)) {
  const group = RIVER_RUN_COHO_REVIEW_GROUPS.find((item) =>
    item.id === groupId
  );
  assert(group, `Missing Coho review group ${groupId}`);
  const [kind, primitiveKey] = targets[groupId as keyof typeof targets];
  const actual = new Set(
    group.scenarios.map((scenario) => scenario.snapshot[primitiveKey].label),
  );
  assert.deepEqual(actual, labels, `${groupId} does not cover every state`);
  for (const scenario of group.scenarios) {
    const model = resolveRiverRunVisualModel({
      kind: kind as RiverRunVisualKind,
      primitive: scenario.snapshot[primitiveKey],
    });
    assert(model.position >= 0 && model.position <= 1);
    assert(model.stateLabel.length > 0);
    assert(model.stateNote.length > 0);
  }
}

const presenceGroup = RIVER_RUN_COHO_REVIEW_GROUPS.find((item) =>
  item.id === "fish_in_river"
)!;
const presence = presenceGroup.scenarios.map((item) =>
  item.snapshot.fishInRiver
);
const scores = presence.map((item) => item.score).filter(
  (score): score is number => typeof score === "number",
);
assert.equal(Math.min(...scores), 0);
assert.equal(Math.max(...scores), 60);
assert(presence.every((item) => item.riverCeiling === 60));
assert(
  presence.every((item) => item.historicalRunStrength === "moderate"),
  "PM Coho must carry its configured Moderate run strength into every read",
);
assert(
  presence.every((item) =>
    item.label !== "Peak presence" || item.curveFraction >= 0.9
  ),
);
for (const item of presence) {
  const model = resolveRiverRunVisualModel({
    kind: "fish_in_river",
    primitive: item,
  });
  assert.equal(model.historicalRunStrength, "Moderate");
  assert.equal(model.riverMaximum, 60);
  assert.equal(model.ceilingPosition, 0.6);
  assert.equal(model.position, item.score / 100);
}

const speciesCopy = presence.flatMap((item) => [
  item.headline,
  item.detail,
  item.tip,
]).join(" ");
assert.match(speciesCopy, /Coho/i);
assert.equal(
  /signature|major run|river-wide numbers/i.test(speciesCopy),
  false,
);

console.log(
  `PM Fall Coho acceptance QA passed: ${scenarioCount} species-correct scenarios, every primitive state, 60-point ceiling, copy safety, and visual contracts.`,
);
