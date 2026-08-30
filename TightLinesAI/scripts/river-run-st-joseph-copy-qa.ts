import assert from "node:assert/strict";

import {
  RIVER_RUN_ST_JOSEPH_COHO_REVIEW_GROUPS,
  RIVER_RUN_ST_JOSEPH_REVIEW_GROUPS,
  RIVER_RUN_ST_JOSEPH_STEELHEAD_REVIEW_GROUPS,
  type RiverRunReviewGroup,
} from "../lib/riverRunReviewFixtures.ts";
import { splitRiverRunDetailPoints } from "../lib/riverRunCopyFormatting.ts";

const runs = [
  ["Chinook", RIVER_RUN_ST_JOSEPH_REVIEW_GROUPS],
  ["Coho", RIVER_RUN_ST_JOSEPH_COHO_REVIEW_GROUPS],
  ["Steelhead", RIVER_RUN_ST_JOSEPH_STEELHEAD_REVIEW_GROUPS],
] as const;

const leakedRiver =
  /Little Manistee|Tippy|Wellston|Croton|Newaygo|Muskegon|Big Manistee|Pere Marquette|Betsie|Homestead|Scottville|Walhalla|Frankfort|Platte River|White River|Grand River|Au Sable|Root River/i;
const internalProcessLanguage =
  /\b(?:accepted|configured|owner-approved|research-approved|audited|calibrated)\b/i;
const approvedStageGeography =
  /Lower river \(St\. Joseph harbor–Berrien Springs\)|Middle river \(Berrien Springs–Niles\)|Upper river \(Niles–Twin Branch Dam\)|Lake Michigan|St\. Joseph harbor|no active St\. Joseph starting section/i;
const unavailableWinter =
  /winter holding|winter read|winter outlook|winter experience|hands? off to winter|shifts? into winter/i;
const primitiveGroups = new Set([
  "run_stage",
  "conditions",
  "push",
  "fishability",
  "activity",
  "fish_in_river",
]);

assert.deepEqual(
  splitRiverRunDetailPoints(
    "Measured river conditions describe the St. Joseph mainstem at Niles. Water conditions can differ elsewhere.",
  ),
  [
    "Measured river conditions describe the St. Joseph mainstem at Niles.",
    "Water conditions can differ elsewhere.",
  ],
  "St. Joseph must remain inside one complete bullet",
);
assert.deepEqual(
  splitRiverRunDetailPoints(
    "The U.S. gauge rose 3.2 percent. The next point remains complete.",
  ),
  [
    "The U.S. gauge rose 3.2 percent.",
    "The next point remains complete.",
  ],
  "Initialisms and decimal values must not create fragments",
);

for (const [species, groups] of runs) {
  assert(groups.length >= 6, `${species}: all six primitive groups required`);
  for (const group of groups) {
    for (const scenario of group.scenarios) {
      const serialized = JSON.stringify(scenario.snapshot);
      assert.equal(
        leakedRiver.test(serialized),
        false,
        `${species} ${group.id}/${scenario.id} leaks another river`,
      );
      assert.equal(scenario.snapshot.riverId, "st_joseph");
      const visibleCopy = userFacingStrings(scenario).join("\n");
      assert.equal(
        leakedRiver.test(visibleCopy),
        false,
        `${species} ${group.id}/${scenario.id} leaks foreign geography in user copy`,
      );
      assert.equal(
        internalProcessLanguage.test(visibleCopy),
        false,
        `${species} ${group.id}/${scenario.id} leaks internal product-process language`,
      );
      const wrongSpecies = species === "Chinook"
        ? /\bCoho\b|\bSteelhead\b|\bSkamania\b/i
        : species === "Coho"
        ? /\bChinook\b|\bSteelhead\b|\bSkamania\b/i
        : /\bChinook\b|\bCoho\b/i;
      assert.equal(
        wrongSpecies.test(visibleCopy),
        false,
        `${species} ${group.id}/${scenario.id} leaks another species`,
      );

      if (primitiveGroups.has(group.id)) {
        const primitive = primitiveForGroup(group.id, scenario.snapshot);
        assert(primitive, `${species} ${group.id}/${scenario.id}: primitive`);
        assert(
          primitive.label?.trim(),
          `${species} ${group.id}/${scenario.id}: label`,
        );
        assert(
          primitive.headline?.trim(),
          `${species} ${group.id}/${scenario.id}: headline`,
        );
        assert(
          primitive.detail?.trim(),
          `${species} ${group.id}/${scenario.id}: why this read`,
        );
        auditDetailPoints(
          primitive.detail,
          `${species} ${group.id}/${scenario.id}`,
        );
        assert(
          primitive.tip?.trim(),
          `${species} ${group.id}/${scenario.id}: guide read`,
        );
        const primitiveCopy = [
          primitive.headline,
          primitive.detail,
          primitive.tip,
          primitive.whereToStart,
        ].filter(Boolean).join(" ");
        assert.equal(
          primitive.copyVersion,
          "river-run-copy-v38",
          `${species} ${group.id}/${scenario.id}: stale copy version`,
        );
        assert(
          wordCount(primitive.headline) <= 22,
          `${species} ${group.id}/${scenario.id}: long headline`,
        );
        assert(
          wordCount(primitive.detail) <= 48,
          `${species} ${group.id}/${scenario.id}: long Why copy (${
            wordCount(primitive.detail)
          } words)`,
        );
        assert(
          wordCount(primitive.tip) <= 40,
          `${species} ${group.id}/${scenario.id}: long Guide copy (${
            wordCount(primitive.tip)
          } words)`,
        );
        assert.equal(
          unavailableWinter.test(primitiveCopy),
          false,
          `${species} ${group.id}/${scenario.id}: unavailable winter copy`,
        );
      }
    }
  }

  const stages = requiredGroup(groups, "run_stage").scenarios;
  for (const scenario of stages) {
    const stage = scenario.snapshot.runStage;
    assert(stage.headline?.trim(), `${species} ${scenario.id}: headline`);
    assert(stage.detail?.trim(), `${species} ${scenario.id}: why this read`);
    assert(
      stage.whereToStart?.trim(),
      `${species} ${scenario.id}: where to start`,
    );
    assert(stage.tip?.trim(), `${species} ${scenario.id}: guide read`);
    assert.match(
      stage.whereToStart,
      approvedStageGeography,
      `${species} ${scenario.id}: Where to Start lacks approved geography`,
    );
  }

  const terminalLabel = species === "Steelhead"
    ? "Fall entry complete"
    : "Fall run complete";
  const complete = groups.flatMap((group) => group.scenarios).find((scenario) =>
    scenario.snapshot.runStage.label === terminalLabel ||
    scenario.snapshot.fishInRiver.label === terminalLabel
  );
  assert(complete, `${species}: terminal review state`);
  assert.equal(complete.snapshot.fishInRiver.score, null);
  assert.equal(
    complete.snapshot.fishInRiver.label,
    species === "Steelhead" ? "Fall entry complete" : "Fall run complete",
  );

  for (const scenario of requiredGroup(groups, "push").scenarios) {
    if (scenario.snapshot.push.score == null) continue;
    assert.match(
      `${scenario.snapshot.push.headline} ${scenario.snapshot.push.detail} ${scenario.snapshot.push.tip}`,
      /Niles/i,
    );
  }
  for (const scenario of requiredGroup(groups, "fishability").scenarios) {
    if (scenario.snapshot.fishability.label === "Unavailable") continue;
    assert.match(
      scenario.snapshot.fishability.detail,
      /Niles (?:mainstem )?reach/i,
    );
    assert.match(
      scenario.snapshot.fishability.tip,
      /Niles|every other section/i,
    );
  }
  for (const scenario of requiredGroup(groups, "activity").scenarios) {
    if (scenario.snapshot.activity?.score == null) continue;
    assert.match(
      `${scenario.snapshot.activity?.headline} ${scenario.snapshot.activity?.detail} ${scenario.snapshot.activity?.tip}`,
      /Niles/i,
    );
  }
}

const chinookPeak = stageScenario(
  RIVER_RUN_ST_JOSEPH_REVIEW_GROUPS,
  "stage_peak_core",
);
assert.match(chinookPeak.snapshot.runStage.headline, /selective/i);
assert.match(
  chinookPeak.snapshot.runStage.detail,
  /3-of-10|not a claim of strong or uniform/i,
);
assert.match(chinookPeak.snapshot.runStage.whereToStart ?? "", /selective/i);

const cohoBuilding = stageScenario(
  RIVER_RUN_ST_JOSEPH_COHO_REVIEW_GROUPS,
  "stage_building_established",
);
assert.match(
  cohoBuilding.snapshot.runStage.whereToStart ?? "",
  /Middle river/i,
);

const steelheadStaging = stageScenario(
  RIVER_RUN_ST_JOSEPH_STEELHEAD_REVIEW_GROUPS,
  "stage_staging",
);
assert.match(
  steelheadStaging.snapshot.runStage.detail,
  /Skamania/i,
);
assert.doesNotMatch(steelheadStaging.snapshot.runStage.detail, /Manistee/i);
assert.match(steelheadStaging.snapshot.runStage.tip, /one Steelhead|Skamania/i);

const evidenceLabels = runs.flatMap(([, groups]) =>
  requiredGroup(groups, "evidence").scenarios.map((scenario) => scenario.label)
);
assert(evidenceLabels.every((label) => !/Wellston|Croton/i.test(label)));
assert(evidenceLabels.some((label) => /Niles/i.test(label)));

console.log(
  "St. Joseph copy QA passed: three-section Stage guidance, terminal behavior, and Niles scope across all six primitives.",
);

function requiredGroup(groups: RiverRunReviewGroup[], id: string) {
  const group = groups.find((candidate) => candidate.id === id);
  assert(group, `Missing ${id} review group`);
  return group;
}

function stageScenario(groups: RiverRunReviewGroup[], id: string) {
  const scenario = requiredGroup(groups, "run_stage").scenarios.find(
    (candidate) => candidate.id === id,
  );
  assert(scenario, `Missing ${id}`);
  return scenario;
}

function primitiveForGroup(groupId: string, snapshot: Record<string, any>) {
  switch (groupId) {
    case "run_stage":
      return snapshot.runStage;
    case "conditions":
      return snapshot.conditionsSuggest;
    case "push":
      return snapshot.push;
    case "fishability":
      return snapshot.fishability;
    case "activity":
      return snapshot.activity;
    case "fish_in_river":
      return snapshot.fishInRiver;
  }
}

function userFacingStrings(value: unknown): string[] {
  const visibleKeys = new Set([
    "label",
    "headline",
    "detail",
    "tip",
    "whereToStart",
    "scopeCopy",
    "positiveDriver",
    "limitingFactor",
    "note",
    "regulationReminder",
    "activityDisclaimer",
    "gaugeLimitation",
    "attribution",
    "name",
  ]);
  const output: string[] = [];
  visit(value, false);
  return output;

  function visit(candidate: unknown, include: boolean) {
    if (typeof candidate === "string") {
      if (include) output.push(candidate);
      return;
    }
    if (Array.isArray(candidate)) {
      for (const item of candidate) visit(item, include);
      return;
    }
    if (!candidate || typeof candidate !== "object") return;
    for (const [key, child] of Object.entries(candidate)) {
      visit(child, include || visibleKeys.has(key));
    }
  }
}

function auditDetailPoints(detail: string, context: string) {
  const points = splitRiverRunDetailPoints(detail);
  assert(points.length > 0, `${context}: at least one detail point`);
  assert.equal(
    points.join(" "),
    detail.trim().replace(/\s+/g, " "),
    `${context}: parser must preserve the complete Why This Read copy`,
  );
  assert(points.length <= 3, `${context}: more than three Why points`);
  for (const point of points) {
    assert.match(point, /[.!?]$/, `${context}: incomplete bullet: ${point}`);
    assert.match(
      point,
      /^["“'(]*[A-Z0-9]/,
      `${context}: fragment bullet: ${point}`,
    );
    assert(
      point.trim().split(/\s+/).length >= 4,
      `${context}: undersized bullet fragment: ${point}`,
    );
  }
}

function wordCount(value?: string): number {
  return value?.trim() ? value.trim().split(/\s+/).length : 0;
}
