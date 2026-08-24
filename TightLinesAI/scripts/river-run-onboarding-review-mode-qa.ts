import assert from "node:assert/strict";

import { RIVER_RUN_ONBOARDING_REVIEW_GROUPS_BY_RUN_ID } from "../lib/riverRunReviewFixtures";

const expectedRuns = new Set([
  "grand_fall_chinook",
  "grand_fall_coho",
  "grand_fall_steelhead",
  "platte_fall_chinook",
  "platte_fall_coho",
  "platte_fall_steelhead",
  "white_fall_chinook",
  "white_fall_coho",
  "white_fall_steelhead",
]);

assert.deepEqual(
  new Set(Object.keys(RIVER_RUN_ONBOARDING_REVIEW_GROUPS_BY_RUN_ID)),
  expectedRuns,
);

for (
  const [runId, groups] of Object.entries(
    RIVER_RUN_ONBOARDING_REVIEW_GROUPS_BY_RUN_ID,
  )
) {
  assert.deepEqual(
    new Set(groups.map((group) => group.id)),
    new Set([
      "run_stage",
      "activity",
      "fish_in_river",
      "fishability",
      "live_conditions",
    ]),
    `${runId} must expose the complete owner-review group set`,
  );
  for (const group of groups) {
    assert(group.scenarios.length > 0, `${runId}/${group.id} is empty`);
    for (const scenario of group.scenarios) {
      const snapshot = scenario.snapshot;
      assert.equal(snapshot.runId, runId);
      assert(snapshot.engineVersion.includes("onboarding-review"));
      assert(snapshot.configVersion.endsWith("-review"));
      assert(snapshot.runStage.headline.trim().length > 0);
      assert(snapshot.runStage.detail.trim().length > 0);
      assert(snapshot.runStage.tip.trim().length > 0);
      assert(snapshot.runStage.whereToStart?.trim().length);
      assert(snapshot.fishInRiver.headline.trim().length > 0);
      assert(snapshot.fishInRiver.detail.trim().length > 0);
      assert(snapshot.fishInRiver.tip.trim().length > 0);
      assert(snapshot.fishability.headline.trim().length > 0);
      assert(snapshot.fishability.detail.trim().length > 0);
      assert(snapshot.fishability.tip.trim().length > 0);
      if (group.id === "activity") {
        assert(snapshot.activity);
        assert(snapshot.activity.headline.trim().length > 0);
        assert(snapshot.activity.detail.trim().length > 0);
        assert(snapshot.activity.tip.trim().length > 0);
      }
      assert(snapshot.secondaryNote?.trim().length);
      assert(snapshot.riverConditions);
    }
  }

  const activity = groups.find((group) => group.id === "activity")!;
  if (runId === "platte_fall_coho") {
    assert(
      activity.scenarios.some((scenario) =>
        typeof scenario.snapshot.activity?.score === "number"
      ),
    );
    assert(
      activity.scenarios.every((scenario) =>
        scenario.snapshot.activity?.score == null ||
        scenario.snapshot.activity.score <= 90
      ),
    );
  } else {
    assert(
      activity.scenarios.every((scenario) =>
        scenario.snapshot.activity?.label === "Unavailable" &&
        scenario.snapshot.activity.score === null
      ),
      `${runId} Activity must fail closed in owner review`,
    );
  }

  const fishability = groups.find((group) => group.id === "fishability")!;
  if (runId.startsWith("platte_")) {
    assert(
      fishability.scenarios.every((scenario) =>
        scenario.snapshot.fishability.label === "Unavailable" &&
        scenario.snapshot.fishability.score === null
      ),
    );
  } else {
    assert(
      fishability.scenarios.some((scenario) =>
        typeof scenario.snapshot.fishability.score === "number"
      ),
    );
    assert(
      fishability.scenarios.some((scenario) =>
        scenario.snapshot.fishability.label === "Unavailable"
      ),
    );
  }

  const conditions = groups.find((group) => group.id === "live_conditions")!;
  assert(
    conditions.scenarios.some((scenario) =>
      scenario.snapshot.riverConditions?.status === "available"
    ),
  );
  assert(
    conditions.scenarios.some((scenario) =>
      scenario.snapshot.riverConditions?.status !== "available"
    ),
  );
}

const grandScenarios = Object.entries(
  RIVER_RUN_ONBOARDING_REVIEW_GROUPS_BY_RUN_ID,
).filter(([runId]) => runId.startsWith("grand_")).flatMap(([, groups]) =>
  groups.flatMap((group) => group.scenarios)
);
assert(
  grandScenarios.every((scenario) =>
    /Fulton Street/i.test(scenario.snapshot.secondaryNote ?? "") &&
    /North Park Street/i.test(scenario.snapshot.secondaryNote ?? "")
  ),
);

const whiteScenarios = Object.entries(
  RIVER_RUN_ONBOARDING_REVIEW_GROUPS_BY_RUN_ID,
).filter(([runId]) => runId.startsWith("white_")).flatMap(([, groups]) =>
  groups.flatMap((group) => group.scenarios)
);
assert(
  whiteScenarios.every((scenario) =>
    /Fruitvale Road/i.test(scenario.snapshot.secondaryNote ?? "") &&
    /Hesperia Dam/i.test(scenario.snapshot.secondaryNote ?? "")
  ),
);

console.log(
  `Grand, Platte, and White review-mode QA passed: ${
    Object.values(RIVER_RUN_ONBOARDING_REVIEW_GROUPS_BY_RUN_ID).reduce(
      (total, groups) =>
        total + groups.reduce(
          (groupTotal, group) => groupTotal + group.scenarios.length,
          0,
        ),
      0,
    )
  } private scenarios across ${expectedRuns.size} supported runs.`,
);
