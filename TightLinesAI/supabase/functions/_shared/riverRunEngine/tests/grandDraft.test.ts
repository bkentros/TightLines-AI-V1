import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  GRAND_CONFIGURATION_DOCUMENT,
  GRAND_FALL_CHINOOK_RUN_PROFILE,
  GRAND_FALL_COHO_RUN_PROFILE,
  GRAND_FALL_STEELHEAD_RUN_PROFILE,
  GRAND_RIVER_PROFILE,
  resolveFlowBand,
  RIVER_RUN_RUN_PROFILES,
  scoreFishability,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

Deno.test("Grand foundation preserves species endpoints and split station scope", () => {
  const result = validateRiverProfile(GRAND_RIVER_PROFILE);
  assertEquals(
    result.valid,
    true,
    result.issues.map((item) => item.message).join("\n"),
  );
  assertMatch(
    GRAND_RIVER_PROFILE.foundation!.upstreamTerminus,
    /Webber Dam for Chinook/i,
  );
  assertMatch(
    GRAND_RIVER_PROFILE.foundation!.upstreamTerminus,
    /Moores Park Dam for Coho and Steelhead/i,
  );
  assertMatch(GRAND_RIVER_PROFILE.gaugeLimitationCopy, /below Sixth Street/i);
  assertMatch(GRAND_RIVER_PROFILE.gaugeLimitationCopy, /above Sixth Street/i);
});

Deno.test("Grand Fishability is species-independent and deterministic at Fulton boundaries", () => {
  const runs = [
    GRAND_FALL_CHINOOK_RUN_PROFILE,
    GRAND_FALL_COHO_RUN_PROFILE,
    GRAND_FALL_STEELHEAD_RUN_PROFILE,
  ];
  const expectedBands: Array<[number, string]> = [
    [1199, "very_low"],
    [1200, "low"],
    [1599, "low"],
    [1600, "ideal"],
    [4000, "ideal"],
    [4000.5, "high_fishable"],
    [4001, "high_fishable"],
    [6399, "high_fishable"],
    [6400, "blown_out"],
  ];

  for (const run of runs) {
    for (const [value, expectedBand] of expectedBands) {
      assertEquals(
        resolveFlowBand({
          metric: "flow_cfs",
          value,
          fishabilityBands: run.fishabilityBands,
        })?.band,
        expectedBand,
        `${run.runId} at ${value} CFS`,
      );
    }
  }

  const results = runs.map((run) =>
    scoreFishability({
      rules: run.fishabilityBands!,
      gaugeFreshness: "fresh",
      flowBand: "ideal",
      flowSignal: "stable",
      currentHydraulicValue: 1690,
      copyStrategy: run.runStageCopyStrategy,
    })
  );
  assertEquals(results.map((result) => result.score), [93, 93, 93]);
  assertEquals(results.map((result) => result.label), [
    "Excellent",
    "Excellent",
    "Excellent",
  ]);
  for (const result of results) {
    assertMatch(result.detail, /live flow card compares this date/i);
    assertMatch(result.detail, /Fulton Street reach/i);
    assertMatch(result.detail, /not the full Grand River/i);
  }
});

Deno.test("Grand validation rejects an ideal-to-high Fishability gap", () => {
  const run = structuredClone(GRAND_FALL_CHINOOK_RUN_PROFILE);
  run.fishabilityBands!.highFishable.min = 4001;
  const result = validateRunProfile(run, GRAND_RIVER_PROFILE);
  assert(
    result.issues.some((issue) =>
      issue.code === "config_invalid_value" &&
      issue.field === "fishabilityBands"
    ),
  );
});

Deno.test("Grand public runs use reach-scoped observed Activity and Fulton Fishability", () => {
  for (
    const run of [
      GRAND_FALL_CHINOOK_RUN_PROFILE,
      GRAND_FALL_COHO_RUN_PROFILE,
      GRAND_FALL_STEELHEAD_RUN_PROFILE,
    ]
  ) {
    const result = validateRunProfile(run, GRAND_RIVER_PROFILE);
    assertEquals(
      result.valid,
      true,
      `${run.runId}: ${result.issues.map((item) => item.message).join("\n")}`,
    );
    assertEquals(result.publicVisible, true);
    assertEquals(run.primitiveCapabilities.activity.status, "available");
    assertEquals(run.activity?.dataMode, "observed_river");
    assertEquals(
      run.activity?.minimumInputContract,
      "weather_and_one_measured_river_input",
    );
    assertEquals(run.activity?.inputReach?.reachIds, ["grand_lower"]);
    assertEquals(run.activity?.inputReach?.hydraulicSourceIds, [
      "grand_fulton_usgs",
    ]);
    assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, [
      "grand_north_park_temperature",
    ]);
    assertEquals(run.waterTemperature?.sourcePriority, [
      "grand_north_park_temperature",
    ]);
    assertMatch(
      run.activity?.scopeCopy ?? "",
      /downtown Grand Rapids mainstem/i,
    );
    assertMatch(
      run.activity?.scopeCopy ?? "",
      /does not directly measure Grand Haven/i,
    );
    assertEquals(run.primitiveCapabilities.fishability.status, "available");
    assertEquals(run.fishabilityBands?.sourceLabel, "Fulton Street reach");
    assertEquals(
      run.fishabilityBands?.version,
      "grand-fulton-shared-fishability-v2",
    );
  }
  const bands = [
    GRAND_FALL_CHINOOK_RUN_PROFILE.fishabilityBands,
    GRAND_FALL_COHO_RUN_PROFILE.fishabilityBands,
    GRAND_FALL_STEELHEAD_RUN_PROFILE.fishabilityBands,
  ];
  assertEquals(bands[0], bands[1]);
  assertEquals(bands[1], bands[2]);
});

Deno.test("Grand release validates and is present in public registries", () => {
  for (
    const runId of [
      "grand_fall_chinook",
      "grand_fall_coho",
      "grand_fall_steelhead",
    ]
  ) {
    assertEquals(
      RIVER_RUN_RUN_PROFILES.some((run) => run.runId === runId),
      true,
    );
  }
  const issues = validateConfigurationRevision({
    configKey: "grand",
    revision: 1,
    status: "published",
    document: GRAND_CONFIGURATION_DOCUMENT,
    evidenceNotes:
      "Released Grand configuration with fail-closed passage and independently replayed downtown observed Activity.",
  });
  assert(issues.every((issue) => issue.severity !== "error"));
});
