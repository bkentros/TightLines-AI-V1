import assert from "node:assert/strict";
import { RIVER_RUN_BIG_MANISTEE_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";

const groups = new Map(
  RIVER_RUN_BIG_MANISTEE_REVIEW_GROUPS.map((group) => [group.id, group]),
);
for (const id of ["run_stage", "conditions", "push", "fishability", "fish_in_river"]) {
  assert(groups.get(id)?.scenarios.length, `Missing Big Manistee ${id} review coverage`);
}
const scenarios = RIVER_RUN_BIG_MANISTEE_REVIEW_GROUPS.flatMap((group) =>
  group.scenarios
);
assert(scenarios.length >= 57, `Expected at least 57 scenarios, got ${scenarios.length}`);
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
  for (const primitive of [
    snapshot.runStage,
    snapshot.conditionsSuggest,
    snapshot.push,
    snapshot.fishability,
    snapshot.fishInRiver,
  ]) {
    assert(primitive.label.trim());
    assert(primitive.headline.trim());
    assert(primitive.detail.trim());
    assert(primitive.tip.trim());
  }
}

const ids = new Set(scenarios.map((scenario) => scenario.id));
for (const id of [
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
]) assert(ids.has(id), `Missing acceptance scenario ${id}`);

console.log(
  `Big Manistee Fall Chinook acceptance QA passed: ${scenarios.length} production-derived scenarios, river-specific subphases, source provenance, conservative failure states, and no PM geography leakage.`,
);
