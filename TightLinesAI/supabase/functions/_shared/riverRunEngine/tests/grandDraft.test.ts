import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  GRAND_CONFIGURATION_DOCUMENT,
  GRAND_FALL_CHINOOK_RUN_PROFILE,
  GRAND_FALL_COHO_RUN_PROFILE,
  GRAND_FALL_STEELHEAD_RUN_PROFILE,
  GRAND_RIVER_PROFILE,
  RIVER_RUN_RUN_PROFILES,
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
    assertEquals(run.fishabilityBands?.sourceLabel, "Fulton Street");
  }
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
