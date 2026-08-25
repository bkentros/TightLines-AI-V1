import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  PLATTE_CONFIGURATION_DOCUMENT,
  PLATTE_FALL_CHINOOK_RUN_PROFILE,
  PLATTE_FALL_COHO_RUN_PROFILE,
  PLATTE_FALL_STEELHEAD_RUN_PROFILE,
  PLATTE_RIVER_PROFILE,
  RIVER_RUN_RUN_PROFILES,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

Deno.test("Platte foundation keeps Honor Gauge Read separate from the lower run reach", () => {
  const result = validateRiverProfile(PLATTE_RIVER_PROFILE);
  assertEquals(
    result.valid,
    true,
    result.issues.map((issue) => issue.message).join("\n"),
  );
  assertEquals(PLATTE_RIVER_PROFILE.foundation!.primaryGaugeReachId, null);
  assertEquals(PLATTE_RIVER_PROFILE.foundation!.contextualGaugeSiteIds, [
    "04126740",
  ]);
  assertMatch(
    PLATTE_RIVER_PROFILE.gaugeLimitationCopy,
    /upstream of Platte Lake/i,
  );
});

Deno.test("Platte Chinook and Fall Steelhead are valid public weather-only runs", () => {
  for (
    const run of [
      PLATTE_FALL_CHINOOK_RUN_PROFILE,
      PLATTE_FALL_STEELHEAD_RUN_PROFILE,
    ]
  ) {
    const result = validateRunProfile(run, PLATTE_RIVER_PROFILE);
    assertEquals(
      result.valid,
      true,
      result.issues.map((issue) => issue.message).join("\n"),
    );
    assertEquals(result.publicVisible, true);
    assertEquals(run.primitiveCapabilities.fishInRiver.status, "available");
    assertEquals(run.primitiveCapabilities.activity.status, "available");
    assertEquals(run.activity?.dataMode, "weather_only");
    assertEquals(run.activity?.weights.riverBehavior, 0);
    assertEquals(run.activity?.weights.waterTemperature, 0);
    assertEquals(run.primitiveCapabilities.fishability.status, "unavailable");
  }
});

Deno.test("Platte Coho is a valid public weather-only run with unavailable Fishability", () => {
  const result = validateRunProfile(
    PLATTE_FALL_COHO_RUN_PROFILE,
    PLATTE_RIVER_PROFILE,
  );
  assertEquals(
    result.valid,
    true,
    result.issues.map((issue) => issue.message).join("\n"),
  );
  assertEquals(result.publicVisible, true);
  assertEquals(PLATTE_FALL_COHO_RUN_PROFILE.activity?.dataMode, "weather_only");
  assertEquals(PLATTE_FALL_COHO_RUN_PROFILE.activity?.weights.riverBehavior, 0);
  assertEquals(
    PLATTE_FALL_COHO_RUN_PROFILE.activity?.weights.waterTemperature,
    0,
  );
  assertEquals(
    PLATTE_FALL_COHO_RUN_PROFILE.primitiveCapabilities.fishability.status,
    "unavailable",
  );
});

Deno.test("Platte release is present in public registries", () => {
  assertEquals(
    RIVER_RUN_RUN_PROFILES.some((run) => run.runId === "platte_fall_coho"),
    true,
  );
  const issues = validateConfigurationRevision({
    configKey: "platte",
    revision: 1,
    status: "published",
    document: PLATTE_CONFIGURATION_DOCUMENT,
    evidenceNotes:
      "Released Platte configuration with fixed replay and production-shaped acceptance.",
  });
  assert(issues.every((issue) => issue.severity !== "error"));
});
