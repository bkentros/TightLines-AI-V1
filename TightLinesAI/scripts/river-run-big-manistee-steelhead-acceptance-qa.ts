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
  assert.match(snapshot.safety.gaugeBasis, /Tippy tailwater/i);
  const copy = JSON.stringify(snapshot);
  assert.equal(/Scottville|Walhalla|Pere Marquette/i.test(copy), false);
  assert.equal(
    /\bupper river\b/i.test(JSON.stringify(snapshot.runStage)),
    false,
  );
}

const peak = scenarios.find((scenario) => scenario.id === "stage_peak_core")
  ?.snapshot;
assert(peak);
assert.equal(peak.localDate, "2026-11-15");
assert.equal(peak.fishInRiver.score, 80);
assert.match(peak.runStage.whereToStart ?? "", /Tippy-to-High Bridge/i);
assert.match(peak.runStage.whereToStart ?? "", /toward M-55/i);

const winter = scenarios.find((scenario) =>
  scenario.id === "stage_winter_holding"
)?.snapshot;
assert(winter);
assert.equal(winter.localDate, "2026-12-23");
assert.equal(winter.runStage.label, "Winter holding");
assert.equal(winter.fishInRiver.score, 70);
assert.match(winter.runStage.detail, /have not left the river/i);

const staging = scenarios.find((scenario) => scenario.id === "stage_staging")
  ?.snapshot;
assert(staging);
assert.match(JSON.stringify(staging.runStage), /Skamania/i);

const activityScenarios = groups.get("activity")?.scenarios ?? [];
assert(activityScenarios.length >= 10);
for (const scenario of activityScenarios) {
  const activity = scenario.snapshot.activity;
  assert(activity, scenario.id);
  assert.equal(
    activity.rulesVersion,
    "big-manistee-fall-steelhead-activity-v1",
  );
  assert.equal(activity.blocks.length, 4);
  const copy = JSON.stringify(activity);
  assert.match(copy, /Steelhead/i);
  assert.match(copy, /Wellston\/Tippy tailwater/i);
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
  ["activity_tapering", "activity_ending", "activity_post_run"].includes(
    scenario.id,
  )
);
assert.equal(lateActivity.length, 3);
assert(
  lateActivity.every((scenario) =>
    /remain alive|winter holding|cold water/i.test(
      JSON.stringify(scenario.snapshot.activity),
    )
  ),
);

console.log(
  `Big Manistee Fall Steelhead acceptance QA passed: ${scenarios.length} production-derived scenarios, river-scoped Activity with no salmon taper, 80-point November 15 peak, 70-point winter handoff, Skamania-safe copy, named migratory reaches, shared Wellston hydraulics, and species-specific thermal behavior.`,
);
