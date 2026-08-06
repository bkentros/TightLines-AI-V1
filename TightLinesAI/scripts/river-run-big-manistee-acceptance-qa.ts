import assert from "node:assert/strict";
import { RIVER_RUN_BIG_MANISTEE_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";

const groups = new Map(
  RIVER_RUN_BIG_MANISTEE_REVIEW_GROUPS.map((group) => [group.id, group]),
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
    `Missing Big Manistee ${id} review coverage`,
  );
}
const scenarios = RIVER_RUN_BIG_MANISTEE_REVIEW_GROUPS.flatMap((group) =>
  group.scenarios
);
assert(
  scenarios.length >= 57,
  `Expected at least 57 scenarios, got ${scenarios.length}`,
);
for (const scenario of scenarios) {
  const snapshot = scenario.snapshot;
  assert.equal(snapshot.riverId, "big_manistee");
  assert.equal(snapshot.runId, "big_manistee_fall_chinook");
  assert.match(snapshot.secondaryNote ?? "", /04125550|Wellston/i);
  assert.match(snapshot.safety.gaugeBasis, /Tippy tailwater/i);
  assert.equal(
    /Scottville|Walhalla|Pere Marquette/i.test(JSON.stringify(snapshot)),
    false,
    `${scenario.id} leaks PM geography`,
  );
  for (
    const primitive of [
      snapshot.runStage,
      snapshot.conditionsSuggest,
      snapshot.push,
      snapshot.fishability,
      snapshot.fishInRiver,
      ...(snapshot.activity ? [snapshot.activity] : []),
    ]
  ) {
    assert(primitive.label.trim());
    assert(primitive.headline.trim());
    assert(primitive.detail.trim());
    assert(primitive.tip.trim());
  }
}

const ids = new Set(scenarios.map((scenario) => scenario.id));
for (
  const id of [
    "stage_beginning_initial",
    "stage_beginning_accumulating",
    "stage_building_established",
    "stage_building_broad",
    "stage_peak_approach",
    "stage_peak_core",
    "stage_peak_shoulder",
    "stage_tapering_early",
    "stage_tapering_late",
    "stage_ending_residual",
    "push_sharp",
    "push_stale",
    "push_missing_gauge",
    "fishability_blown",
    "fishability_sharp_high",
    "fishability_missing",
    "activity_staging",
    "activity_building_high",
    "activity_warm_constraint",
    "activity_barrier",
    "activity_tapering",
    "activity_ending",
    "activity_missing_temperature",
    "activity_missing_river",
  ]
) assert(ids.has(id), `Missing acceptance scenario ${id}`);

for (const scenario of groups.get("activity")!.scenarios) {
  const activity = scenario.snapshot.activity;
  assert(activity, `${scenario.id} is missing Activity`);
  assert.equal(activity.blocks.length, 4);
  assert.match(activity.detail, /Wellston\/Tippy tailwater/i);
  assert.match(activity.detail, /farther downstream/i);
  assert.match(activity.detail, /strongest window/i);
  assert.match(activity.detail, /main limitation/i);
  assert.equal(
    /Scottville|Pere Marquette/i.test(
      `${activity.headline} ${activity.detail} ${activity.tip}`,
    ),
    false,
  );
}

for (const id of ["activity_tapering", "activity_ending", "activity_post_run"]) {
  const activity = scenarios.find((scenario) => scenario.id === id)!.snapshot
    .activity!;
  if (id !== "activity_tapering") {
    assert.equal(["Active", "Highly active"].includes(activity.label), false);
  }
  assert.match(activity.detail, /fresher|spent|deteriorat|biological decline/i);
}

console.log(
  `Big Manistee Fall Chinook acceptance QA passed: ${scenarios.length} production-derived scenarios, river-specific Activity, subphases, source provenance, conservative failure states, and no PM geography leakage.`,
);
