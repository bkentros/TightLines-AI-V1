import assert from "node:assert/strict";

import { RIVER_RUN_BETSIE_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";
import {
  resolveRiverRunVisualModel,
  type RiverRunVisualKind,
} from "../lib/riverRunVisuals";

const targets = {
  run_stage: ["run_stage", "runStage"],
  conditions: ["run_timing", "conditionsSuggest"],
  push: ["push", "push"],
  fishability: ["fishability", "fishability"],
  activity: ["activity", "activity"],
  fish_in_river: ["fish_in_river", "fishInRiver"],
} as const;

let scenarioCount = 0;
for (const group of RIVER_RUN_BETSIE_REVIEW_GROUPS) {
  assert(group.scenarios.length > 0, `Empty Betsie review group ${group.id}`);
  scenarioCount += group.scenarios.length;
  for (const scenario of group.scenarios) {
    const snapshot = scenario.snapshot;
    assert.equal(snapshot.riverId, "betsie");
    assert.equal(snapshot.runId, "betsie_fall_chinook");
    assert.equal(snapshot.gauge, null);
    assert.equal(snapshot.waterTemperature, null);
    assert.equal(snapshot.conditionsWaterTemperature, null);
    assert.equal(snapshot.conditionsSuggest.label, "Unavailable");
    assert.equal(snapshot.conditionsSuggest.score, null);
    assert.equal(snapshot.push.label, "Unavailable");
    assert.equal(snapshot.push.score, null);
    assert.equal(snapshot.fishability.label, "Unavailable");
    assert.equal(snapshot.fishability.score, null);
    assert.equal(snapshot.pushHistory.status, "unavailable");
    assert.equal(snapshot.pushHistory.recentDailyReadsStatus, "unavailable");
    assert.match(snapshot.safety.regulationReminder, /300 feet of Homestead/i);
    if (group.id === "activity") {
      assert(snapshot.activity, scenario.id);
      assert.equal(snapshot.activity.confidence, "Limited");
      assert.equal(
        snapshot.activity.rulesVersion,
        "betsie-fall-chinook-weather-activity-v1",
      );
      assert(snapshot.activity.blocks.every((block) => block.score <= 95));
      assert(snapshot.activity.reasonCodes.includes("activity_weather_only"));
      assert.match(
        snapshot.activity.headline,
        /weather-only Betsie.*Chinook|weather-only Betsie outlook/i,
      );
      assert.match(snapshot.activity.headline, /Limited confidence/i);
      assert.match(snapshot.activity.detail, /Weather /i);
      assert.equal(
        /favorable measured water temperature|river level remains workable/i
          .test(JSON.stringify(snapshot.activity)),
        false,
      );
    }

    const stageCopy = [
      snapshot.runStage.headline,
      snapshot.runStage.whereToStart,
      snapshot.runStage.detail,
      snapshot.runStage.tip,
    ].join(" ");
    assert.equal(
      /lower[ -]river|middle[ -]river|upper[ -]river/i.test(stageCopy),
      false,
      `${scenario.id} leaks PM-scale geography`,
    );
    assert.equal(
      /above[- ]Homestead|above the structure|pass(?:ed|ing)? upstream/i.test(
        stageCopy,
      ),
      false,
      `${scenario.id} implies migratory access above Homestead`,
    );
    assert.equal(
      /guarantee(?:d)?|fish definitely moved|catch probability/i
        .test(JSON.stringify(snapshot)),
      false,
      `${scenario.id} overclaims Betsie conditions or presence`,
    );
    if (group.id === "run_stage" || group.id === "fish_in_river") {
      const guideRead = group.id === "run_stage"
        ? snapshot.runStage.tip
        : snapshot.fishInRiver.tip;
      assert(guideRead?.trim(), `${scenario.id} has no Guide's Read`);
      assert.match(guideRead, /[.!?]$/, `${scenario.id} is incomplete`);
      assert.equal(
        /\bPush\b|\bFishability\b|Migration Timing|live primitives/i.test(
          guideRead,
        ),
        false,
        `${scenario.id} recommends an unavailable primitive: ${guideRead}`,
      );
    }

    const target = targets[group.id as keyof typeof targets];
    if (target) {
      const [kind, key] = target;
      const visual = resolveRiverRunVisualModel({
        kind: kind as RiverRunVisualKind,
        primitive: snapshot[key],
      });
      assert(visual.position >= 0 && visual.position <= 1);
      assert(visual.stateLabel.length > 0, `${scenario.id} lacks visual label`);
      assert(visual.stateNote.length > 0, `${scenario.id} lacks visual note`);
    }
  }
}

assert.equal(scenarioCount, 33);

const byId = new Map(
  RIVER_RUN_BETSIE_REVIEW_GROUPS.flatMap((group) =>
    group.scenarios.map((scenario) => [scenario.id, scenario] as const)
  ),
);
const beginning = byId.get("stage_beginning")?.snapshot.runStage;
assert(beginning);
assert.match(
  beginning.detail ?? "",
  /most dependable near the river entrance/i,
);
assert.equal(beginning.whereToStart, "Betsie Lake–US-31 reach.");

const lateAugust = byId.get("stage_building_established")?.snapshot.runStage;
assert(lateAugust);
assert.match(
  lateAugust.detail ?? "",
  /earlier fish can be in the US-31–Homestead reach/i,
);

const clearLeader = byId.get("activity_clear_leader")?.snapshot.activity;
assert(clearLeader);
assert.match(clearLeader.detail, /5–9 AM is strongest/i);

const expectedPresence = new Map([
  ["presence_before", 0],
  ["presence_start", 10],
  ["presence_early", 25],
  ["presence_half", 50],
  ["presence_peak", 100],
  ["presence_shoulder", 95],
  ["presence_taper", 70],
  ["presence_late", 25],
  ["presence_tail_end", 0],
]);
for (const [id, expected] of expectedPresence) {
  assert.equal(byId.get(id)?.snapshot.fishInRiver.score, expected, id);
}

console.log(
  `Betsie Fall Chinook acceptance QA passed: ${scenarioCount} production-derived scenarios, weather-only Activity, exact two-reach geography, seasonal anchors, capability-safe Guide's Reads, unavailable hydraulic primitives, and visual contracts.`,
);
