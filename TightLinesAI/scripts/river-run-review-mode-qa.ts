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
    "Waiting for run",
    "Run complete",
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
const presenceScores = presence.scenarios.map((item) =>
  item.snapshot.fishInRiver.score
).filter((value): value is number => typeof value === "number");
assert.equal(Math.min(...presenceScores), 0);
assert.equal(Math.max(...presenceScores), 100);
assert(
  presenceScores.every((value) =>
    Number.isInteger(value) && value >= 0 && value <= 100
  ),
);
assert(
  presence.scenarios.every((item) => item.snapshot.fishInRiver.maximum === 100),
);
assert.deepEqual(
  new Set(
    presence.scenarios.map((item) => item.snapshot.fishInRiver.curveDirection),
  ),
  new Set(["outside", "rising", "near_peak", "falling"]),
);
assert(
  presence.scenarios.every((item) =>
    item.snapshot.fishInRiver.label !== "Peak presence" ||
    item.snapshot.fishInRiver.curveFraction >= 0.9
  ),
  "Peak Presence review states must begin at 90% of the river ceiling",
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
  /\bresearch(?:ed)?\b/i,
  /\bconfigured?\b/i,
  /\bcheckpoint\b/i,
  /\bbaseline\b/i,
  /\bpercentile\b/i,
  /\bengine\b/i,
  /\bgauge\b/i,
  /\bmodeled\b/i,
  /\bhistorical\b/i,
  /\bcfs\b/i,
  /\bvisibility\b/i,
  /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\b/i,
  /\b20\d{2}-\d{2}-\d{2}\b/,
] as const;
const directiveGuideLead =
  /^(?:Begin|Start|Fish|Keep|Skip|Leave|Do not|Stop|Choose|Stay|Concentrate|Target|Work|Check|Cover)\b/;
const ambiguousGuideCopy = [
  /\blet\b.+\bdecide\b/i,
  /should be practical/i,
  /keep(?:ing)? expectations (?:measured|conservative)/i,
  /^focus on\b/i,
  /use your judgment/i,
  /postpone (?:the )?river trip/i,
] as const;

for (const group of RIVER_RUN_REVIEW_GROUPS) {
  assert(group.scenarios.length > 0);
  for (const scenario of group.scenarios) {
    const snapshot = scenario.snapshot;
    assert(snapshot.engineVersion.includes("review"));
    assert(snapshot.configVersion.includes("review"));
    assert.equal(snapshot.localDate.length, 10);
    if (snapshot.interpretationNote) {
      assert.equal(
        /(?:^|\s)\d+\.\s/.test(snapshot.interpretationNote.detail ?? ""),
        false,
        `${scenario.id} has numbered How to Read Today copy`,
      );
      if ((snapshot.interpretationNote.reasonCodes?.length ?? 0) > 1) {
        assert.equal(
          snapshot.interpretationNote.detail?.split("\n\n").length,
          snapshot.interpretationNote.reasonCodes?.length,
          `${scenario.id} must separate each mixed read into a clean paragraph`,
        );
      }
    }
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
      assert.match(
        primitive.tip.trim(),
        directiveGuideLead,
        `${scenario.id} Guide's Read must lead with a concrete action: ${primitive.tip}`,
      );
      for (const pattern of ambiguousGuideCopy) {
        assert.equal(
          pattern.test(primitive.tip),
          false,
          `${scenario.id} has an ambiguous Guide's Read ${pattern}: ${primitive.tip}`,
        );
      }
      assert(
        /[.!?]$/.test(primitive.detail.trim()),
        `${scenario.id} has an incomplete Why This Read sentence: ${primitive.detail}`,
      );
      assert.equal(
        primitive.detail.includes("…"),
        false,
        `${scenario.id} has suppressed Why This Read copy`,
      );
      assert.equal(primitive.copyVersion, "river-run-copy-v10");
      assert.equal("copyVariant" in primitive, false);
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

const fishabilityScenarios =
  RIVER_RUN_REVIEW_GROUPS.find((item) => item.id === "fishability")
    ?.scenarios ?? [];
for (const scenario of fishabilityScenarios) {
  const display = scenario.snapshot.fishability;
  if (display.score !== null) {
    assert.match(
      display.detail,
      /Fishability describes how this flow should fish if migratory fish are present; it does not estimate how many fish are in the river\./,
      `${scenario.id} must preserve the Fishability evidence boundary`,
    );
  }
}
assert.equal(
  new Set(
    fishabilityScenarios.map((scenario) =>
      scenario.snapshot.fishability.detail
    ),
  ).size,
  fishabilityScenarios.length,
  "Every audited Fishability branch must provide a distinct explanation",
);
assert.equal(
  new Set(
    fishabilityScenarios.map((scenario) => scenario.snapshot.fishability.tip),
  ).size,
  fishabilityScenarios.length,
  "Every audited Fishability branch must provide distinct fishing direction",
);

const timingScenarios =
  RIVER_RUN_REVIEW_GROUPS.find((item) => item.id === "conditions")?.scenarios ??
    [];
for (const scenario of timingScenarios) {
  const timing = scenario.snapshot.conditionsSuggest;
  if ((timing.completedCheckpointCount ?? 0) >= 2) {
    assert(timing.previousCheckpointId);
    assert.match(timing.previousCheckpointDate ?? "", /^\d{4}-\d{2}-\d{2}$/);
    assert(timing.previousTimingLabel);
  } else {
    assert.equal(timing.previousCheckpointId, undefined);
    assert.equal(timing.previousCheckpointDate, undefined);
    assert.equal(timing.previousTimingLabel, undefined);
  }
}
const timingPostRun = timingScenarios.find((scenario) =>
  scenario.id === "conditions_complete_post"
);
assert(timingPostRun);
assert.equal(timingPostRun.snapshot.runStage.stage, "post_run");
assert.equal(timingPostRun.snapshot.conditionsSuggest.label, "Timing complete");
assert.match(
  timingPostRun.snapshot.conditionsSuggest.detail,
  /main run has passed/,
);

const pushScenarios =
  RIVER_RUN_REVIEW_GROUPS.find((item) => item.id === "push")?.scenarios ?? [];
for (const scenario of pushScenarios) {
  const history = scenario.snapshot.pushHistory;
  assert(history);
  const reads = history.recentDailyReads ?? [];
  assert(reads.length <= 7);
  assert.equal(
    reads.some((read) => read.localDate === scenario.snapshot.localDate),
    false,
    `${scenario.id} must not include today's still-changing Push read`,
  );
  for (let index = 1; index < reads.length; index += 1) {
    assert(
      reads[index - 1].localDate > reads[index].localDate,
      `${scenario.id} Push history must be newest first`,
    );
  }
  assert(
    reads.every((read) => {
      if (read.status === "missing") {
        return read.score === null && read.label === "No recorded read";
      }
      if (read.status === "no_supportive_window") {
        return read.score === null && read.label === "No supportive window" &&
          !read.refreshSlot && !read.conditionRefreshAt;
      }
      return read.status === "supportive_window" &&
        typeof read.score === "number" &&
        read.score >= history.minimumSupportiveScore &&
        ["Possible", "Strong", "Very strong"].includes(read.label) &&
        Boolean(read.refreshSlot) &&
        Boolean(read.conditionRefreshAt);
    }),
  );
}
const pushFirstDay = pushScenarios.find((scenario) =>
  scenario.id === "push_first_day"
);
assert(pushFirstDay);
assert.deepEqual(pushFirstDay.snapshot.pushHistory?.recentDailyReads, []);

for (const group of RIVER_RUN_REVIEW_GROUPS) {
  for (const scenario of group.scenarios) {
    const snapshot = scenario.snapshot;
    const startDate = snapshot.runStage.window.startDate;
    const endDate = snapshot.runStage.window.endDate;
    if (snapshot.localDate < startDate) {
      assert.equal(
        snapshot.push.label,
        "Waiting for run",
        `${scenario.id} cannot show an active Push before the run`,
      );
      assert.equal(snapshot.pushHistory?.status, "not_started");
    } else if (snapshot.localDate > endDate) {
      assert.equal(
        snapshot.push.label,
        "Run complete",
        `${scenario.id} cannot show an active Push after the main run`,
      );
      assert.equal(snapshot.pushHistory?.status, "complete");
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
