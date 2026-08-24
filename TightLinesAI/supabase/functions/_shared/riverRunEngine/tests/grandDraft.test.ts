import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  GRAND_CONFIGURATION_DOCUMENT,
  GRAND_FALL_CHINOOK_RUN_PROFILE,
  GRAND_FALL_COHO_RUN_PROFILE,
  GRAND_FALL_STEELHEAD_RUN_PROFILE,
  GRAND_RIVER_PROFILE,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

Deno.test("Grand draft foundation preserves species endpoints and split station scope", () => {
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

Deno.test("Grand supported drafts keep Activity unavailable and Fulton Fishability local", () => {
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
    assertEquals(result.publicVisible, false);
    assertEquals(run.primitiveCapabilities.activity.status, "unavailable");
    assertEquals(run.primitiveCapabilities.fishability.status, "available");
    assertEquals(run.fishabilityBands?.sourceLabel, "Fulton Street");
  }
});

Deno.test("Grand drafts validate but remain outside public registries", () => {
  for (
    const runId of [
      "grand_fall_chinook",
      "grand_fall_coho",
      "grand_fall_steelhead",
    ]
  ) {
    assertEquals(
      RIVER_RUN_RUN_PROFILES.some((run) => run.runId === runId),
      false,
    );
    assertEquals(
      RIVER_RUN_DRAFT_RUN_PROFILES.some((run) => run.runId === runId),
      true,
    );
  }
  const issues = validateConfigurationRevision({
    configKey: "grand",
    revision: 1,
    status: "draft",
    document: GRAND_CONFIGURATION_DOCUMENT,
    evidenceNotes:
      "Hidden Grand Phase C drafts with fail-closed passage and Activity capabilities.",
  });
  assert(issues.every((issue) => issue.severity !== "error"));
});
