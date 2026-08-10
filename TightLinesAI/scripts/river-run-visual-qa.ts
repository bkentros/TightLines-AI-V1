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
    expectedStops: 5,
  },
} as const;

const seen = new Map<RiverRunVisualKind, Set<string>>();
let visualCount = 0;

const EXPECTED_SELECTED_INDEX: Record<
  RiverRunVisualKind,
  Record<string, number | null>
> = {
  run_stage: {
    Offseason: null,
    "Fall run complete": null,
    "Fall entry complete": null,
    "Before migration": 0,
    Beginning: 1,
    Building: 2,
    Peak: 3,
    Tapering: 4,
    Ending: 5,
    "After migration": 6,
  },
  run_timing: {
    "Not monitoring yet": null,
    Delayed: 0,
    Typical: 1,
    Ahead: 2,
    Evaluating: null,
    "Insufficient evidence": null,
  },
  push: {
    Offseason: null,
    Weak: 0,
    "No clear push": 1,
    Possible: 2,
    Strong: 3,
    "Very strong": 4,
    Unavailable: null,
    "Waiting for migration": null,
    "Migration complete": null,
    "Fall run complete": null,
    "Fall entry complete": null,
  },
  fishability: {
    Poor: 0,
    Tough: 1,
    Fishable: 2,
    Good: 3,
    Excellent: 4,
    Unavailable: null,
  },
  fish_in_river: {
    Offseason: 0,
    "Not expected yet": 0,
    "Migration complete": 0,
    "Low presence": 1,
    "Limited presence": 2,
    "Moderate presence": 3,
    "High presence": 4,
    "Peak presence": 5,
    "Fall run complete": null,
    "Fall entry complete": null,
  },
};

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
    if (target.kind === "fish_in_river") {
      if (
        primitive.label === "Fall run complete" ||
        primitive.label === "Fall entry complete"
      ) {
        assert.equal(model.selectedIndex, null);
        assert.equal(model.specialState, "complete");
        labels.add(primitive.label);
        visualCount += 1;
        continue;
      }
      const score = Math.max(
        0,
        Math.min(
          100,
          typeof primitive.displayScore === "number"
            ? primitive.displayScore
            : primitive.score ?? 0,
        ),
      );
      assert.equal(
        model.selectedIndex,
        Math.min(4, Math.max(0, Math.ceil(score / 20) - 1)),
        `${scenario.id} must select its absolute 0-100 presence band`,
      );
      assert.equal(
        model.position,
        score / 100,
        `${scenario.id} must place its marker at the public presence index`,
      );
      assert.deepEqual(
        model.ticks,
        [
          { label: "0", position: 0 },
          { label: "20", position: 0.2 },
          { label: "40", position: 0.4 },
          { label: "60", position: 0.6 },
          { label: "80", position: 0.8 },
          { label: "100", position: 1 },
        ],
        `${scenario.id} must place Fish In River labels on interval boundaries`,
      );
      if (primitive.label.endsWith(" presence")) {
        assert.equal(
          model.stateLabel,
          `${primitive.label.slice(0, -" presence".length)} for this river`,
          `${scenario.id} must identify its relative within-run state`,
        );
      }
    } else if (
      !(target.kind === "run_timing" && primitive.label === "Timing complete")
    ) {
      assert.equal(
        model.selectedIndex,
        EXPECTED_SELECTED_INDEX[target.kind][primitive.label],
        `${scenario.id} meter marker does not represent ${primitive.label}`,
      );
    }
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
    "Fall run complete",
    "Before migration",
    "Beginning",
    "Building",
    "Peak",
    "Tapering",
    "Ending",
    "After migration",
  ]),
);
assert.deepEqual(
  seen.get("run_timing"),
  new Set([
    "Not monitoring yet",
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
assert.deepEqual(
  seen.get("fish_in_river"),
  new Set([
    "Fall run complete",
    "Not expected yet",
    "Low presence",
    "Limited presence",
    "Moderate presence",
    "High presence",
    "Peak presence",
    "Migration complete",
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
  "Migration Timing must read red, yellow, green from left to right",
);
for (const scenario of conditionsGroup.scenarios) {
  const model = resolveRiverRunVisualModel({
    kind: "run_timing",
    primitive: scenario.snapshot.conditionsSuggest,
  });
  const label = scenario.snapshot.conditionsSuggest.label;
  if (label === "Not monitoring yet" || label === "Evaluating") {
    assert.equal(model.specialState, "waiting");
  }
  if (label === "Insufficient evidence") {
    assert.equal(model.specialState, "unavailable");
  }
  if (label === "Timing complete") {
    assert.equal(model.specialState, "complete");
    assert.equal(model.accent, "#8B98A5");
    assert.equal(
      formatRiverRunTabStatus(
        "run_timing",
        scenario.snapshot.conditionsSuggest,
      ),
      "COMPLETE",
    );
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
  if (label === "Waiting for migration") {
    assert.equal(model.specialState, "waiting");
  }
  if (label === "Migration complete" || label === "Offseason") {
    assert.equal(model.specialState, "complete");
  }
  if (label === "Unavailable") {
    assert.equal(model.specialState, "unavailable");
  }
  if (!model.specialState) {
    assert.equal(
      model.stateNote,
      "SUPPORT FOR FRESH MOVEMENT · NOT PROOF OF ARRIVALS",
    );
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
  presenceScale.map((stop) => [stop.label, stop.color]),
  [
    ["0–20", "#D94B3A"],
    ["20–40", "#E89647"],
    ["40–60", "#E8C547"],
    ["60–80", "#7CC36A"],
    ["80–100", "#3DA85F"],
  ],
  "Fish In River must expose one stable, absolute 0-100 index scale",
);
for (
  const [score, expectedBand, expectedPosition] of [
    [0, 0, 0],
    [1, 0, 0.01],
    [20, 0, 0.2],
    [21, 1, 0.21],
    [33, 1, 0.33],
    [40, 1, 0.4],
    [41, 2, 0.41],
    [60, 2, 0.6],
    [61, 3, 0.61],
    [80, 3, 0.8],
    [81, 4, 0.81],
    [100, 4, 1],
  ] as const
) {
  const model = resolveRiverRunVisualModel({
    kind: "fish_in_river",
    primitive: {
      ...presenceGroup.scenarios[0].snapshot.fishInRiver,
      label: "Low presence",
      score,
      displayScore: score,
    },
  });
  assert.equal(model.selectedIndex, expectedBand, `${score}/100 band mismatch`);
  assert.equal(
    model.position,
    expectedPosition,
    `${score}/100 marker-position mismatch`,
  );
}
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
for (const scenario of presenceGroup.scenarios) {
  const ceiling = scenario.snapshot.fishInRiver.riverCeiling ?? 100;
  const expectedStrength = ceiling <= 30
    ? "limited"
    : ceiling <= 70
    ? "moderate"
    : "strong";
  const model = resolveRiverRunVisualModel({
    kind: "fish_in_river",
    primitive: scenario.snapshot.fishInRiver,
  });
  assert.equal(
    scenario.snapshot.fishInRiver.historicalRunStrength,
    expectedStrength,
    `${scenario.id} must carry the strength selected by its configured ceiling`,
  );
  assert.equal(
    model.historicalRunStrength?.toLowerCase(),
    expectedStrength,
  );
  assert.equal(model.riverMaximum, ceiling);
  assert.equal(model.ceilingPosition, ceiling / 100);

  if (
    scenario.snapshot.runId === "pere_marquette_fall_chinook" &&
    scenario.id !== "fish_in_river_moderate_cap"
  ) {
    assert.equal(model.historicalRunStrength, "Strong");
    assert.equal(model.riverMaximum, 100);
    assert.equal(model.ceilingPosition, 1);
  }
}

const lowerCap = {
  ...presenceGroup.scenarios.find((scenario) =>
    scenario.snapshot.fishInRiver.label === "Peak presence"
  )!.snapshot.fishInRiver,
  score: 60,
  displayScore: 60,
  maximum: 100,
  riverCeiling: 60,
  historicalRunStrength: "moderate" as const,
};
const lowerCapModel = resolveRiverRunVisualModel({
  kind: "fish_in_river",
  primitive: lowerCap,
});
assert.equal(lowerCapModel.riverMaximum, 60);
assert.equal(lowerCapModel.ceilingPosition, 0.6);
assert.equal(lowerCapModel.historicalRunStrength, "Moderate");
assert.equal(lowerCapModel.position, 0.6);
assert.equal(lowerCapModel.selectedIndex, 2);
assert.equal(lowerCapModel.stateLabel, "Peak for this river");

const orangeHighModel = resolveRiverRunVisualModel({
  kind: "fish_in_river",
  primitive: {
    ...lowerCap,
    score: 36,
    displayScore: 36,
    label: "High presence",
  },
});
assert.equal(orangeHighModel.selectedIndex, 1);
assert.equal(orangeHighModel.accent, "#E89647");
assert.equal(orangeHighModel.stateLabel, "High for this river");

const yellowPeakModel = resolveRiverRunVisualModel({
  kind: "fish_in_river",
  primitive: {
    ...lowerCap,
    score: 55,
    displayScore: 55,
  },
});
assert.equal(yellowPeakModel.selectedIndex, 2);
assert.equal(yellowPeakModel.accent, "#E8C547");

const strongCapModel = resolveRiverRunVisualModel({
  kind: "fish_in_river",
  primitive: {
    ...lowerCap,
    score: 100,
    displayScore: 100,
    riverCeiling: 100,
    historicalRunStrength: "strong" as const,
  },
});
assert.equal(strongCapModel.riverMaximum, 100);
assert.equal(strongCapModel.ceilingPosition, 1);
assert.equal(strongCapModel.historicalRunStrength, "Strong");
assert.equal(strongCapModel.position, 1);
assert.equal(strongCapModel.selectedIndex, 4);

const limitedCapModel = resolveRiverRunVisualModel({
  kind: "fish_in_river",
  primitive: {
    ...lowerCap,
    score: 30,
    displayScore: 30,
    riverCeiling: 30,
    historicalRunStrength: "limited" as const,
  },
});
assert.equal(limitedCapModel.historicalRunStrength, "Limited");
assert.equal(limitedCapModel.ceilingPosition, 0.3);

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
