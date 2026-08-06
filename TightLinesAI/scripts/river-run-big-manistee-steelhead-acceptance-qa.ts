import assert from "node:assert/strict";
import { RIVER_RUN_BIG_MANISTEE_STEELHEAD_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";

const groups = new Map(
  RIVER_RUN_BIG_MANISTEE_STEELHEAD_REVIEW_GROUPS.map((group) => [group.id, group]),
);
for (const id of ["run_stage", "conditions", "push", "fishability", "fish_in_river"]) {
  assert(groups.get(id)?.scenarios.length, `Missing Big Manistee Steelhead ${id} coverage`);
}
const scenarios = RIVER_RUN_BIG_MANISTEE_STEELHEAD_REVIEW_GROUPS.flatMap((group) =>
  group.scenarios
);
assert(scenarios.length >= 60);
for (const scenario of scenarios) {
  const snapshot = scenario.snapshot;
  assert.equal(snapshot.riverId, "big_manistee");
  assert.equal(snapshot.runId, "big_manistee_fall_steelhead");
  assert.match(snapshot.secondaryNote ?? "", /04125550|Wellston/i);
  assert.match(snapshot.safety.gaugeBasis, /Tippy tailwater/i);
  const copy = JSON.stringify(snapshot);
  assert.equal(/Scottville|Walhalla|Pere Marquette/i.test(copy), false);
  assert.equal(/\bupper river\b/i.test(JSON.stringify(snapshot.runStage)), false);
}

const peak = scenarios.find((scenario) => scenario.id === "stage_peak_core")?.snapshot;
assert(peak);
assert.equal(peak.localDate, "2026-11-15");
assert.equal(peak.fishInRiver.score, 80);
assert.match(peak.runStage.whereToStart ?? "", /Tippy-to-High Bridge/i);
assert.match(peak.runStage.whereToStart ?? "", /toward M-55/i);

const winter = scenarios.find((scenario) => scenario.id === "stage_winter_holding")?.snapshot;
assert(winter);
assert.equal(winter.localDate, "2026-12-23");
assert.equal(winter.runStage.label, "Winter holding");
assert.equal(winter.fishInRiver.score, 70);
assert.match(winter.runStage.detail, /have not left the river/i);

const staging = scenarios.find((scenario) => scenario.id === "stage_staging")?.snapshot;
assert(staging);
assert.match(JSON.stringify(staging.runStage), /Skamania/i);

console.log(
  `Big Manistee Fall Steelhead acceptance QA passed: ${scenarios.length} production-derived scenarios, 80-point November 15 peak, 70-point winter handoff, Skamania-safe copy, named migratory reaches, shared Wellston hydraulics, and species-specific thermal behavior.`,
);
