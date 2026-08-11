import assert from "node:assert/strict";
import { RIVER_RUN_BIG_MANISTEE_STEELHEAD_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";

const groups = new Map(
  RIVER_RUN_BIG_MANISTEE_STEELHEAD_REVIEW_GROUPS.map((
    group,
  ) => [group.id, group]),
);
for (
  const id of [
    "run_stage",
    "conditions",
    "push",
    "fishability",
    "activity",
    "fish_in_river",
  ]
) {
  assert(
    groups.get(id)?.scenarios.length,
    `Missing Big Manistee Steelhead ${id} coverage`,
  );
}
const scenarios = RIVER_RUN_BIG_MANISTEE_STEELHEAD_REVIEW_GROUPS.flatMap((
  group,
) => group.scenarios);
assert(scenarios.length >= 60);
for (const scenario of scenarios) {
  const snapshot = scenario.snapshot;
  assert.equal(snapshot.riverId, "big_manistee");
  assert.equal(snapshot.runId, "big_manistee_fall_steelhead");
  assert.match(snapshot.secondaryNote ?? "", /04125550|Wellston/i);
  assert.match(snapshot.safety.gaugeBasis, /Upper river.*Tippy Dam/i);
  const copy = JSON.stringify(snapshot);
  assert.equal(/Scottville|Walhalla|Pere Marquette/i.test(copy), false);
  assert.equal(
    /Tippy tailwater|toward M-55/i.test(JSON.stringify(snapshot.runStage)),
    false,
  );
  assert.equal(
    /Skamania|summer-run|winter-run|winter holding/i.test(copy),
    false,
  );
}

const peak = scenarios.find((scenario) => scenario.id === "stage_peak_core")
  ?.snapshot;
assert(peak);
assert.equal(peak.localDate, "2026-11-15");
assert.equal(peak.fishInRiver.score, 80);
assert.match(
  peak.runStage.whereToStart ?? "",
  /Upper river \(High Bridge–Tippy Dam\).*Tippy Dam area/i,
);
assert.match(peak.runStage.whereToStart ?? "", /Middle river/i);

const complete = scenarios.find((scenario) =>
  scenario.id === "stage_fall_entry_complete"
)?.snapshot;
assert(complete);
assert.equal(complete.localDate, "2026-12-23");
assert.equal(complete.runStage.label, "Fall entry complete");
assert.equal(complete.fishInRiver.score, null);
assert.equal(complete.activity?.score, null);
assert.deepEqual(complete.activity?.blocks, []);

const staging = scenarios.find((scenario) => scenario.id === "stage_staging")
  ?.snapshot;
assert(staging);
assert.match(JSON.stringify(staging.runStage), /early Steelhead/i);

const activityScenarios = groups.get("activity")?.scenarios ?? [];
assert(activityScenarios.length >= 10);
for (const scenario of activityScenarios) {
  const activity = scenario.snapshot.activity;
  assert(activity, scenario.id);
  assert.equal(
    activity.rulesVersion,
    "big-manistee-fall-steelhead-activity-v1",
  );
  if (scenario.id === "activity_fall_entry_complete") {
    assert.equal(activity.score, null);
    assert.equal(activity.blocks.length, 0);
    continue;
  }
  assert.equal(activity.blocks.length, 4);
  const copy = JSON.stringify(activity);
  assert.match(copy, /Steelhead/i);
  assert.match(copy, /Upper-river|Upper river|Tippy Dam area/i);
  assert.equal(
    /spent|dying|deteriorat|mortality|Chinook|Coho/i.test(copy),
    false,
  );
  assert.equal(
    activity.reasonCodes.includes("activity_late_biology_cap"),
    false,
  );
}
const lateActivity = activityScenarios.filter((scenario) =>
  ["activity_tapering", "activity_ending", "activity_fall_entry_complete"]
    .includes(
      scenario.id,
    )
);
assert.equal(lateActivity.length, 3);
assert.equal(
  lateActivity.at(-1)?.snapshot.activity?.label,
  "Fall entry complete",
);

console.log(
  `Big Manistee Fall Steelhead acceptance QA passed: ${scenarios.length} production-derived scenarios, early-Steelhead language, three approved sections, Upper-river source scope, an 80-point November 15 peak, and a scoreless Fall entry complete state.`,
);
