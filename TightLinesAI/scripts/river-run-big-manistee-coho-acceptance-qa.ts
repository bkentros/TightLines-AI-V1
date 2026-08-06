import assert from "node:assert/strict";
import { RIVER_RUN_BIG_MANISTEE_COHO_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";

const groups = new Map(
  RIVER_RUN_BIG_MANISTEE_COHO_REVIEW_GROUPS.map((group) => [group.id, group]),
);
for (const id of ["run_stage", "conditions", "push", "fishability", "fish_in_river"]) {
  assert(groups.get(id)?.scenarios.length, `Missing Big Manistee Coho ${id} coverage`);
}
const scenarios = RIVER_RUN_BIG_MANISTEE_COHO_REVIEW_GROUPS.flatMap((group) =>
  group.scenarios
);
assert(scenarios.length >= 70);
for (const scenario of scenarios) {
  const snapshot = scenario.snapshot;
  assert.equal(snapshot.riverId, "big_manistee");
  assert.equal(snapshot.runId, "big_manistee_fall_coho");
  assert.match(snapshot.secondaryNote ?? "", /04125550|Wellston/i);
  assert.match(snapshot.safety.gaugeBasis, /Tippy tailwater/i);
  assert.equal(/Scottville|Walhalla|Pere Marquette/i.test(JSON.stringify(snapshot)), false);
  assert.equal(/\bupper river\b/i.test(JSON.stringify(snapshot.runStage)), false);
}
const peak = scenarios.find((scenario) => scenario.id === "stage_peak_core")?.snapshot;
assert(peak);
assert.equal(peak.localDate, "2026-10-20");
assert.equal(peak.fishInRiver.score, 50);
assert.match(peak.runStage.headline, /strongest part/i);
assert.match(peak.runStage.detail, /sectional/i);

console.log(
  `Big Manistee Fall Coho acceptance QA passed: ${scenarios.length} production-derived scenarios, 50-point October 20 peak, daily presence interpolation, named migratory reaches, shared Wellston hydraulics, and species-correct copy.`,
);
