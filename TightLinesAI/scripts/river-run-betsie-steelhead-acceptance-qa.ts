import assert from "node:assert/strict";

import { RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures";
import {
  resolveRiverRunVisualModel,
  type RiverRunVisualKind,
} from "../lib/riverRunVisuals";
import { riverRunFishingGuideForSpecies } from "../lib/riverRunFishingGuides";
import {
  BETSIE_FALL_STEELHEAD_RUN_PROFILE,
  resolveRunStage,
} from "../supabase/functions/_shared/riverRunEngine/index";

const targets = {
  run_stage: ["run_stage", "runStage"],
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
      assert.equal(
        snapshot.activity.reasonCodes.includes("activity_late_biology_cap"),
        false,
      );
      if (snapshot.activity.score != null) {
        assert(snapshot.activity.reasonCodes.includes("activity_weather_only"));
        assert.match(
          snapshot.activity.headline,
          /weather-only Betsie.*Steelhead|weather-only Betsie outlook/i,
        );
        assert.match(snapshot.activity.headline, /Limited confidence/i);
        assert.match(snapshot.activity.detail, /Weather /i);
      } else {
        assert(
          snapshot.activity.reasonCodes.includes(
            "activity_fall_entry_complete",
          ),
        );
      }
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

assert.equal(scenarioCount, 35);
const byId = new Map(
  RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS.flatMap((group) =>
    group.scenarios.map((scenario) => [scenario.id, scenario] as const)
  ),
);

const peak = byId.get("stage_peak")?.snapshot.runStage;
assert(peak);
assert.match(peak.headline, /strongest Betsie fall Steelhead window/i);
assert.equal(peak.whereToStart, "US-31–Homestead reach.");

const complete = byId.get("stage_fall_entry_complete")?.snapshot.runStage;
assert(complete);
assert.equal(complete.label, "Fall entry complete");
assert.equal(complete.winterHoldingContext, false);
assert.match(complete.tip ?? "", /late August/i);

const preseason = resolveRunStage(
  BETSIE_FALL_STEELHEAD_RUN_PROFILE,
  "2026-08-07",
);
assert.equal(preseason.winterHoldingContext, false);
assert.equal(preseason.label, "Before migration");
assert.match(preseason.tip ?? "", /staging begins/i);
assert.equal(
  /winter holding|have transitioned/i.test(JSON.stringify(preseason)),
  false,
  "Pre-season Betsie Steelhead copy must not describe winter holding",
);

const unchangedLateScores = [
  "activity_peak_light_rain",
  "activity_late_fall",
  "activity_holding_transition",
  "activity_fall_end",
].map((id) => byId.get(id)?.snapshot.activity?.score);
assert(unchangedLateScores.every((score) => score === unchangedLateScores[0]));

const completedActivity = byId.get("activity_fall_entry_complete")?.snapshot
  .activity;
assert(completedActivity);
assert.equal(completedActivity.score, null);
assert.equal(completedActivity.label, "Fall entry complete");

const clearLeader = byId.get("activity_clear_leader")?.snapshot.activity;
assert(clearLeader);
assert.match(clearLeader.detail, /5–9 AM is strongest/i);

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
  ["presence_fall_entry_complete", null],
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
  `Betsie Fall Steelhead acceptance QA passed: ${scenarioCount} production-derived scenarios, weather-only Activity with no salmon taper, exact five-day PM lead, 70-point Moderate presence ceiling, Fall entry complete terminal behavior, exact two-reach copy, unavailable hydraulic primitives, stripping-flies guidance, and visual contracts.`,
);
