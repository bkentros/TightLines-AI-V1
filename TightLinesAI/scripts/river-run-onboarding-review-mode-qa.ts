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
  "milwaukee_fall_chinook",
  "milwaukee_fall_coho",
  "milwaukee_fall_steelhead",
  "milwaukee_fall_brown_trout",
  "sheboygan_fall_chinook",
  "sheboygan_fall_coho",
  "sheboygan_fall_steelhead",
  "sheboygan_fall_brown_trout",
  "root_fall_chinook",
  "root_fall_coho",
  "root_fall_steelhead",
  "root_fall_brown_trout",
  "bois_brule_fall_chinook",
  "bois_brule_fall_coho",
  "bois_brule_fall_steelhead",
  "bois_brule_fall_brown_trout",
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
  assert(
    activity.scenarios.some((scenario) =>
      typeof scenario.snapshot.activity?.score === "number"
    ),
  );
  if (
    runId.startsWith("grand_") || runId.startsWith("milwaukee_") ||
    runId.startsWith("white_")
  ) {
    assert(
      activity.scenarios.some((scenario) =>
        scenario.snapshot.activity?.confidence === "Full"
      ),
    );
    assert(
      activity.scenarios.every((scenario) =>
        (runId.startsWith("grand_")
          ? /downtown Grand Rapids mainstem/i
          : runId.startsWith("milwaukee_")
          ? /Urban Greenway near Estabrook Park/i
          : /below-Hesperia corridor/i).test(
            scenario.snapshot.activity?.detail ?? "",
          )
      ),
    );
    for (
      const id of [
        "activity_missing_temperature",
        "activity_missing_hydraulics",
      ]
    ) {
      const partial = activity.scenarios.find((scenario) => scenario.id === id);
      assert.equal(partial?.snapshot.activity?.confidence, "Moderate");
      assert(
        typeof partial?.snapshot.activity?.score === "number" &&
          partial.snapshot.activity.score <= 69,
      );
    }
    const noRiverInputs = activity.scenarios.find((scenario) =>
      scenario.id === "activity_missing_both_river_inputs"
    );
    assert.equal(noRiverInputs?.snapshot.activity?.label, "Unavailable");
    assert.equal(noRiverInputs?.snapshot.activity?.score, null);
  } else {
    assert(
      activity.scenarios.every((scenario) =>
        scenario.snapshot.activity?.confidence === "Limited" &&
        (scenario.snapshot.activity.score == null ||
          scenario.snapshot.activity.score <=
            (runId.endsWith("steelhead") ? 80 : 90))
      ),
    );
    assert(
      activity.scenarios.every((scenario) =>
        /weather-only/i.test(scenario.snapshot.activity?.headline ?? "") &&
        /River level, clarity, and measured water temperature are unknown/i
          .test(
            scenario.snapshot.activity?.detail ?? "",
          )
      ),
    );
  }
  const missingWeather = activity.scenarios.find((scenario) =>
    scenario.id === "activity_missing_weather"
  );
  assert.equal(missingWeather?.snapshot.activity?.label, "Unavailable");
  assert.equal(missingWeather?.snapshot.activity?.score, null);
  assert.deepEqual(missingWeather?.snapshot.activity?.blocks, []);

  const stages = groups.find((group) => group.id === "run_stage")!;
  const stageDates = new Set(
    stages.scenarios.map((scenario) => scenario.snapshot.localDate),
  );
  const window = stages.scenarios[0].snapshot.runStage.window;
  for (
    const boundaryDate of [
      addOneDay(window.beginningEndDate),
      addOneDay(window.peakEndDate),
      addOneDay(window.taperingEndDate),
      addOneDay(window.endDate),
      addOneDay(window.postRunLateCopyEndDate),
    ]
  ) {
    assert(
      stageDates.has(boundaryDate),
      `${runId} review fixtures omit copy transition ${boundaryDate}`,
    );
  }

  const fishability = groups.find((group) => group.id === "fishability")!;
  if (runId.startsWith("platte_") || runId.startsWith("bois_brule_")) {
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
  if (runId.startsWith("sheboygan_")) {
    assert(
      conditions.scenarios.some((scenario) =>
        scenario.snapshot.riverConditions?.status === "partial"
      ),
      `${runId} lacks its expected flow-only Gauge Read scenario`,
    );
    assert(
      conditions.scenarios.every((scenario) =>
        scenario.snapshot.riverConditions?.metrics.every((metric) =>
          metric.metric !== "water_temperature_f"
        )
      ),
      `${runId} must not imply a measured water temperature`,
    );
  } else if (runId.startsWith("root_")) {
    assert(
      conditions.scenarios.some((scenario) =>
        scenario.snapshot.riverConditions?.status === "partial" &&
        scenario.snapshot.riverConditions.metrics.some((metric) =>
          metric.metric === "water_temp_f"
        )
      ),
      `${runId} lacks its expected separately sourced upper-river Gauge Read`,
    );
  } else if (runId.startsWith("bois_brule_")) {
    assert(
      conditions.scenarios.some((scenario) =>
        scenario.snapshot.riverConditions?.status === "partial" &&
        scenario.snapshot.riverConditions.metrics.some((metric) =>
          metric.metric === "water_temp_f" && metric.value === null &&
          metric.seasonalContext?.windowRadiusDays === 0
        )
      ),
      `${runId} lacks historical-only exact-date temperature context`,
    );
  } else {
    assert(
      conditions.scenarios.some((scenario) =>
        scenario.snapshot.riverConditions?.status === "available"
      ),
      `${runId} lacks an available Gauge Read scenario`,
    );
  }
  assert(
    conditions.scenarios.some((scenario) =>
      scenario.snapshot.riverConditions?.status !== "available"
    ),
    `${runId} lacks a degraded Gauge Read scenario`,
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

const milwaukeeScenarios = Object.entries(
  RIVER_RUN_ONBOARDING_REVIEW_GROUPS_BY_RUN_ID,
).filter(([runId]) => runId.startsWith("milwaukee_")).flatMap(([, groups]) =>
  groups.flatMap((group) => group.scenarios)
);

const sheboyganScenarios = Object.entries(
  RIVER_RUN_ONBOARDING_REVIEW_GROUPS_BY_RUN_ID,
).filter(([runId]) => runId.startsWith("sheboygan_")).flatMap(([, groups]) =>
  groups.flatMap((group) => group.scenarios)
);
assert(
  sheboyganScenarios.every((scenario) =>
    /I-43/i.test(scenario.snapshot.secondaryNote ?? "") &&
    /Harbor/i.test(scenario.snapshot.secondaryNote ?? "") &&
    /Waelderhaus/i.test(scenario.snapshot.secondaryNote ?? "")
  ),
);
assert(
  sheboyganScenarios.every((scenario) =>
    /^Restrictions first:/.test(scenario.snapshot.runStage.whereToStart ?? "")
  ),
);
assert(
  milwaukeeScenarios.every((scenario) =>
    /Estabrook Park/i.test(scenario.snapshot.secondaryNote ?? "") &&
    /Harbor/i.test(scenario.snapshot.secondaryNote ?? "") &&
    /North Shore/i.test(scenario.snapshot.secondaryNote ?? "")
  ),
);
assert(
  milwaukeeScenarios.every((scenario) =>
    /^Restrictions first:/.test(scenario.snapshot.runStage.whereToStart ?? "")
  ),
);
assert(
  whiteScenarios.every((scenario) =>
    /Fruitvale Road/i.test(scenario.snapshot.secondaryNote ?? "") &&
    /Hesperia Dam/i.test(scenario.snapshot.secondaryNote ?? "")
  ),
);

console.log(
  `Onboarding review-mode QA passed: ${
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

function addOneDay(localDate: string): string {
  const value = new Date(`${localDate}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}
