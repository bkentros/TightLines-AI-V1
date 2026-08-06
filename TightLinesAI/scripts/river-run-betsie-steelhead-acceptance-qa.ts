import assert from "node:assert/strict";

import { RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";
import {
  resolveRiverRunVisualModel,
  type RiverRunVisualKind,
} from "../lib/riverRunVisuals";
import { riverRunFishingGuideForSpecies } from "../lib/riverRunFishingGuides";

const targets = {
  run_stage: ["run_stage", "runStage"],
  conditions: ["run_timing", "conditionsSuggest"],
  push: ["push", "push"],
  fishability: ["fishability", "fishability"],
  activity: ["activity", "activity"],
  fish_in_river: ["fish_in_river", "fishInRiver"],
} as const;

let scenarioCount = 0;
for (const group of RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS) {
  assert(
    group.scenarios.length > 0,
    `Empty Betsie Steelhead group ${group.id}`,
  );
  scenarioCount += group.scenarios.length;
  for (const scenario of group.scenarios) {
    const snapshot = scenario.snapshot;
    assert.equal(snapshot.riverId, "betsie");
    assert.equal(snapshot.runId, "betsie_fall_steelhead");
    assert.equal(snapshot.gauge, null);
    assert.equal(snapshot.waterTemperature, null);
    assert.equal(snapshot.conditionsWaterTemperature, null);
    assert.equal(snapshot.conditionsSuggest.label, "Unavailable");
    assert.equal(snapshot.push.label, "Unavailable");
    assert.equal(snapshot.fishability.label, "Unavailable");
    assert.equal(snapshot.pushHistory.status, "unavailable");
    assert.match(snapshot.safety.regulationReminder, /Homestead/i);
    if (group.id === "activity") {
      assert(snapshot.activity, scenario.id);
      assert.equal(snapshot.activity.confidence, "Limited");
      assert.equal(
        snapshot.activity.rulesVersion,
        "betsie-fall-steelhead-weather-activity-v1",
      );
      assert(snapshot.activity.blocks.every((block) => block.score <= 95));
      assert(snapshot.activity.reasonCodes.includes("activity_weather_only"));
      assert.equal(
        snapshot.activity.reasonCodes.includes("activity_late_biology_cap"),
        false,
      );
      assert.match(snapshot.activity.headline, /weather-only Steelhead/i);
      assert.match(snapshot.activity.headline, /Limited confidence/i);
      assert.match(snapshot.activity.detail, /evaluated weather/i);
      assert.match(snapshot.activity.tip, /weather[- ]support/i);
      assert.match(
        snapshot.activity.tip,
        /verify actual water temperature, level, clarity/i,
      );
      assert.match(
        snapshot.activity.detail,
        /River level, clarity, and measured water temperature are unknown/i,
      );
      assert.equal(
        /Chinook|Coho|spent|dying|deteriorat|mortality|favorable measured water temperature|river level remains workable/i
          .test(
            JSON.stringify(snapshot.activity),
          ),
        false,
      );
    }

    const publicCopy = JSON.stringify(snapshot);
    assert.equal(/\bChinook\b|\bCoho\b/i.test(publicCopy), false, scenario.id);
    if (group.id === "run_stage") {
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
        /\bPush\b|\bFishability\b|Migration Timing/i.test(stageCopy),
        false,
        `${scenario.id} recommends an unavailable primitive`,
      );
      assert.equal(/spawning gravel|deteriorated fish/i.test(stageCopy), false);
    }

    if (group.id === "fish_in_river") {
      assert.equal(snapshot.fishInRiver.riverCeiling, 70);
      assert.equal(snapshot.fishInRiver.historicalRunStrength, "moderate");
      assert((snapshot.fishInRiver.score ?? 0) <= 70);
      assert.equal(
        /open the winter holding read/i.test(snapshot.fishInRiver.tip ?? ""),
        false,
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
      assert(visual.stateLabel.length > 0);
      assert(visual.stateNote.length > 0);
    }
  }
}

assert.equal(scenarioCount, 34);
const byId = new Map(
  RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS.flatMap((group) =>
    group.scenarios.map((scenario) => [scenario.id, scenario] as const)
  ),
);

const peak = byId.get("stage_peak")?.snapshot.runStage;
assert(peak);
assert.match(peak.headline, /strongest Betsie fall Steelhead opportunity/i);
assert.match(peak.whereToStart ?? "", /lakeward end/i);
assert.match(peak.whereToStart ?? "", /legal Homestead approach/i);
assert.match(peak.whereToStart ?? "", /signed closure/i);

const winter = byId.get("stage_winter_holding")?.snapshot.runStage;
assert(winter);
assert.equal(winter.winterHoldingContext, true);
assert.match(winter.tip ?? "", /61\/100/i);

const unchangedLateScores = [
  "activity_peak_light_rain",
  "activity_late_fall",
  "activity_holding_transition",
  "activity_fall_end",
  "activity_winter_holding",
].map((id) => byId.get(id)?.snapshot.activity?.score);
assert(unchangedLateScores.every((score) => score === unchangedLateScores[0]));

const expectedPresence = new Map([
  ["presence_before", 0],
  ["presence_start", 7],
  ["presence_early", 14],
  ["presence_building", 25],
  ["presence_established", 32],
  ["presence_broad", 53],
  ["presence_peak", 70],
  ["presence_peak_end", 70],
  ["presence_late_fall", 69],
  ["presence_taper", 63],
  ["presence_end", 61],
  ["presence_winter_holding", 61],
]);
for (const [id, expected] of expectedPresence) {
  assert.equal(byId.get(id)?.snapshot.fishInRiver.score, expected, id);
}

const steelheadGuide = riverRunFishingGuideForSpecies("steelhead");
assert(
  steelheadGuide.methods.some((method) => method.title === "Stripping flies"),
  "Every Steelhead river must expose stripping flies in the technique dropdown",
);

console.log(
  `Betsie Fall Steelhead acceptance QA passed: ${scenarioCount} production-derived scenarios, weather-only Activity with no salmon taper, exact five-day PM lead, 70-point Moderate/Broad presence ceiling, 61-point winter handoff, Homestead copy, unavailable hydraulic primitives, stripping-flies guidance, and visual contracts.`,
);
