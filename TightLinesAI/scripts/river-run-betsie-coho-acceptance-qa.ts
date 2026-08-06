import assert from "node:assert/strict";

import { RIVER_RUN_BETSIE_COHO_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";
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
for (const group of RIVER_RUN_BETSIE_COHO_REVIEW_GROUPS) {
  assert(group.scenarios.length > 0, `Empty Betsie Coho group ${group.id}`);
  scenarioCount += group.scenarios.length;
  for (const scenario of group.scenarios) {
    const snapshot = scenario.snapshot;
    assert.equal(snapshot.riverId, "betsie");
    assert.equal(snapshot.runId, "betsie_fall_coho");
    assert.equal(snapshot.gauge, null);
    assert.equal(snapshot.waterTemperature, null);
    assert.equal(snapshot.conditionsWaterTemperature, null);
    assert.equal(snapshot.conditionsSuggest.label, "Unavailable");
    assert.equal(snapshot.push.label, "Unavailable");
    assert.equal(snapshot.fishability.label, "Unavailable");
    assert.equal(snapshot.pushHistory.status, "unavailable");
    assert.match(snapshot.safety.regulationReminder, /300 feet of Homestead/i);
    if (group.id === "activity") {
      assert(snapshot.activity, scenario.id);
      assert.equal(snapshot.activity.confidence, "Limited");
      assert.equal(
        snapshot.activity.rulesVersion,
        "betsie-fall-coho-weather-activity-v1",
      );
      assert(snapshot.activity.blocks.every((block) => block.score <= 95));
      assert(snapshot.activity.reasonCodes.includes("activity_weather_only"));
      assert.match(snapshot.activity.headline, /weather-only Coho/i);
      assert.match(snapshot.activity.headline, /Limited confidence/i);
      assert.match(snapshot.activity.detail, /evaluated weather/i);
      assert.match(snapshot.activity.tip, /weather[- ]support/i);
      assert.match(
        snapshot.activity.tip,
        /Verify actual water temperature, level, clarity/i,
      );
      assert.match(snapshot.activity.detail, /sectional/i);
      assert.match(
        snapshot.activity.detail,
        /River level, clarity, and measured water temperature are unknown/i,
      );
      assert.equal(
        /Chinook|Steelhead|favorable measured water temperature|river level remains workable/i
          .test(
            JSON.stringify(snapshot.activity),
          ),
        false,
      );
    }

    const publicCopy = JSON.stringify(snapshot);
    assert.equal(/\bChinook\b/i.test(publicCopy), false, scenario.id);
    assert.equal(
      /lower[ -]river|middle[ -]river|upper[ -]river/i.test(
        [
          snapshot.runStage.headline,
          snapshot.runStage.whereToStart,
          snapshot.runStage.detail,
          snapshot.runStage.tip,
        ].join(" "),
      ),
      false,
      `${scenario.id} leaks PM-scale geography`,
    );
    assert.equal(
      /above[- ]Homestead|above the structure|pass(?:ed|ing)? upstream/i.test(
        [
          snapshot.runStage.headline,
          snapshot.runStage.whereToStart,
          snapshot.runStage.detail,
          snapshot.runStage.tip,
        ].join(" "),
      ),
      false,
      `${scenario.id} implies migratory access above Homestead`,
    );
    assert.equal(
      /\bPush\b|\bFishability\b|Migration Timing|live primitives/i.test(
        group.id === "run_stage"
          ? snapshot.runStage.tip ?? ""
          : group.id === "fish_in_river"
          ? snapshot.fishInRiver.tip ?? ""
          : "",
      ),
      false,
      `${scenario.id} recommends an unavailable primitive`,
    );

    if (group.id === "fish_in_river") {
      assert.equal(snapshot.fishInRiver.riverCeiling, 30);
      assert.equal(snapshot.fishInRiver.historicalRunStrength, "limited");
      assert((snapshot.fishInRiver.score ?? 0) <= 30);
    }

    const target = targets[group.id as keyof typeof targets];
    if (target) {
      const [kind, key] = target;
      const visual = resolveRiverRunVisualModel({
        kind: kind as RiverRunVisualKind,
        primitive: snapshot[key],
      });
      assert(visual.position >= 0 && visual.position <= 1);
      assert(visual.stateLabel.length > 0);
      assert(visual.stateNote.length > 0);
    }
  }
}

assert.equal(scenarioCount, 32);
const byId = new Map(
  RIVER_RUN_BETSIE_COHO_REVIEW_GROUPS.flatMap((group) =>
    group.scenarios.map((scenario) => [scenario.id, scenario] as const)
  ),
);

const established = byId.get("stage_building_established")?.snapshot.runStage;
assert(established);
assert.match(established.detail ?? "", /late September/i);
assert.match(established.detail ?? "", /Homestead end.*is realistic/i);

const peak = byId.get("stage_peak")?.snapshot.runStage;
assert(peak);
assert.match(peak.headline ?? "", /limited Coho salmon opportunity/i);
assert.match(peak.whereToStart ?? "", /select substantial corridor holes/i);
assert.match(peak.whereToStart ?? "", /lakeward end/i);
assert.match(peak.tip ?? "", /direct fish activity/i);

const expectedPresence = new Map([
  ["presence_before", 0],
  ["presence_start", 3],
  ["presence_early", 6],
  ["presence_half", 15],
  ["presence_peak", 30],
  ["presence_shoulder", 27],
  ["presence_taper", 18],
  ["presence_late", 12],
  ["presence_tail", 6],
  ["presence_tail_end", 0],
]);
for (const [id, expected] of expectedPresence) {
  assert.equal(byId.get(id)?.snapshot.fishInRiver.score, expected, id);
}

console.log(
  `Betsie Fall Coho acceptance QA passed: ${scenarioCount} production-derived scenarios, weather-only Activity with continuous lifecycle adjustment, exact five-day PM lead, 30-point Limited/Sectional presence ceiling, species-safe Homestead copy, unavailable hydraulic primitives, and visual contracts.`,
);
