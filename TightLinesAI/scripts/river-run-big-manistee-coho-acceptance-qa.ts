import assert from "node:assert/strict";
import { RIVER_RUN_BIG_MANISTEE_COHO_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";

const groups = new Map(
  RIVER_RUN_BIG_MANISTEE_COHO_REVIEW_GROUPS.map((group) => [group.id, group]),
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
    `Missing Big Manistee Coho ${id} coverage`,
  );
}
const scenarios = RIVER_RUN_BIG_MANISTEE_COHO_REVIEW_GROUPS.flatMap((group) =>
  group.scenarios
);
assert(scenarios.length >= 84);
for (const scenario of scenarios) {
  const snapshot = scenario.snapshot;
  assert.equal(snapshot.riverId, "big_manistee");
  assert.equal(snapshot.runId, "big_manistee_fall_coho");
  assert.match(snapshot.secondaryNote ?? "", /04125550|Wellston/i);
  assert.match(snapshot.safety.gaugeBasis, /Upper river.*Tippy Dam/i);
  assert.equal(
    /Scottville|Walhalla|Pere Marquette/i.test(JSON.stringify(snapshot)),
    false,
  );
  assert.equal(
    /Tippy tailwater|toward M-55/i.test(JSON.stringify(snapshot.runStage)),
    false,
  );
}
const peak = scenarios.find((scenario) => scenario.id === "stage_peak_core")
  ?.snapshot;
assert(peak);
assert.equal(peak.localDate, "2026-10-20");
assert.equal(peak.fishInRiver.score, 50);
assert.match(peak.runStage.headline, /strongest seasonal/i);
assert.match(peak.runStage.detail, /sectional/i);

for (const scenario of groups.get("activity")!.scenarios) {
  const activity = scenario.snapshot.activity;
  assert(activity, `${scenario.id} is missing Coho Activity`);
  assert.equal(activity.blocks.length, 4);
  assert.match(activity.headline, /Coho/i);
  assert.match(activity.headline, /Upper-river/i);
  assert.match(
    `${activity.headline} ${activity.detail}`,
    /Upper-river|Upper river|Tippy Dam area/i,
  );
  assert.equal(
    /Scottville|Pere Marquette|Chinook/i.test(
      `${activity.headline} ${activity.detail} ${activity.tip}`,
    ),
    false,
  );
}
for (
  const id of ["activity_tapering", "activity_ending", "activity_post_run"]
) {
  const activity = scenarios.find((scenario) => scenario.id === id)!.snapshot
    .activity!;
  assert.match(
    activity.detail,
    /condition varies|fresher|spent|deteriorat|biological decline/i,
  );
  if (id === "activity_post_run") {
    assert.equal(["Active", "Highly active"].includes(activity.label), false);
  }
}

console.log(
  `Big Manistee Fall Coho acceptance QA passed: ${scenarios.length} production-derived scenarios, sectional three-section copy, concise Upper-river Activity, continuous late lifecycle, and a 50-point October 20 presence peak.`,
);
