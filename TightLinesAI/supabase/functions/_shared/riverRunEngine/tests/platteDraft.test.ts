import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  PLATTE_CONFIGURATION_DOCUMENT,
  PLATTE_FALL_COHO_RUN_PROFILE,
  PLATTE_RIVER_PROFILE,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

Deno.test("Platte draft foundation keeps Honor Gauge Read separate from the lower run reach", () => {
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

Deno.test("Platte Coho is a valid hidden weather-only draft with unavailable Fishability", () => {
  const result = validateRunProfile(
    PLATTE_FALL_COHO_RUN_PROFILE,
    PLATTE_RIVER_PROFILE,
  );
  assertEquals(
    result.valid,
    true,
    result.issues.map((issue) => issue.message).join("\n"),
  );
  assertEquals(result.publicVisible, false);
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

Deno.test("Platte stays outside public registries while draft replay can discover it", () => {
  assertEquals(
    RIVER_RUN_RUN_PROFILES.some((run) => run.runId === "platte_fall_coho"),
    false,
  );
  assertEquals(
    RIVER_RUN_DRAFT_RUN_PROFILES.some((run) =>
      run.runId === "platte_fall_coho"
    ),
    true,
  );
  const issues = validateConfigurationRevision({
    configKey: "platte",
    revision: 1,
    status: "draft",
    document: PLATTE_CONFIGURATION_DOCUMENT,
    evidenceNotes:
      "Hidden Phase C draft for fixed replay and production-shaped acceptance.",
  });
  assert(issues.every((issue) => issue.severity !== "error"));
});
