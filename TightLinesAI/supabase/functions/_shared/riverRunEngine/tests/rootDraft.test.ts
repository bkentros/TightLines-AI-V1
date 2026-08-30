import {
  assert,
  assertEquals,
  assertMatch,
  assertNotMatch,
} from "jsr:@std/assert";
import {
  resolveRunStage,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  ROOT_CONFIGURATION_DOCUMENT,
  ROOT_FALL_BROWN_TROUT_RUN_PROFILE,
  ROOT_FALL_CHINOOK_RUN_PROFILE,
  ROOT_FALL_COHO_RUN_PROFILE,
  ROOT_FALL_STEELHEAD_RUN_PROFILE,
  ROOT_RIVER_PROFILE,
  scoreActivity,
  scoreFishInRiver,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

const runs = [
  ROOT_FALL_CHINOOK_RUN_PROFILE,
  ROOT_FALL_COHO_RUN_PROFILE,
  ROOT_FALL_STEELHEAD_RUN_PROFILE,
  ROOT_FALL_BROWN_TROUT_RUN_PROFILE,
];

Deno.test("Root four-species Gate 4B foundation validates and remains hidden", () => {
  const riverResult = validateRiverProfile(ROOT_RIVER_PROFILE);
  assertEquals(
    riverResult.valid,
    true,
    riverResult.issues.map((issue) => issue.message).join("\n"),
  );
  assertEquals(ROOT_RIVER_PROFILE.foundation?.targetSpecies, [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "lake_run_brown_trout",
  ]);

  for (const run of runs) {
    const result = validateRunProfile(run, ROOT_RIVER_PROFILE);
    assertEquals(
      result.valid,
      true,
      `${run.runId}: ${result.issues.map((issue) => issue.message).join("\n")}`,
    );
    assertEquals(result.publicVisible, false, run.runId);
    assertEquals(run.publicAudit.isEnabled, false, run.runId);
    assertEquals(run.primitiveCapabilities.migrationStage.status, "available");
    assertEquals(run.primitiveCapabilities.fishInRiver.status, "available");
    const fishability = run.primitiveCapabilities.fishability;
    assertEquals(fishability.status, "unavailable");
    if (fishability.status !== "unavailable") throw new Error(run.runId);
    assertEquals(
      fishability.reason,
      "no_accepted_hydraulic_source",
    );
    assertEquals(run.fishabilityBands, undefined);
    assertEquals(run.primitiveCapabilities.activity.status, "available");
    assertEquals(run.activity?.dataMode, "weather_only");
    assertEquals(run.activity?.inputReach?.hydraulicSourceIds, []);
    assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, []);
    assertEquals(run.activity?.inputReach?.weatherPointIds, [
      "root_horlick_weather",
    ]);
    assert(
      RIVER_RUN_DRAFT_RUN_PROFILES.some((draft) => draft.runId === run.runId),
      `${run.runId} missing from private draft registry`,
    );
    assert(
      !RIVER_RUN_RUN_PROFILES.some((item) => item.runId === run.runId),
      `${run.runId} leaked into the public registry`,
    );
  }

  const issues = validateConfigurationRevision({
    configKey: "root",
    revision: 1,
    status: "draft",
    document: ROOT_CONFIGURATION_DOCUMENT,
    evidenceNotes: "Root Gate 4B hidden weather-only Activity candidate.",
  });
  assert(
    issues.every((issue) => issue.severity !== "error"),
    issues.map((issue) => issue.message).join("\n"),
  );
});

Deno.test("Root Activity is Limited weather-only context and ignores both upstream river sources", () => {
  for (const run of runs) {
    const rules = run.activity!;
    const common = {
      rules,
      requestDate: `2026-${run.runWindow.peak}`,
      targetDate: `2026-${run.runWindow.peak}`,
      runStage: "peak" as const,
      staging: false,
      waterTempF: null,
      temperatureTrend: "neutral_missing" as const,
      gaugeFreshness: "missing" as const,
      weatherFreshness: "fresh" as const,
      flowSignal: "unknown" as const,
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `2026-${run.runWindow.peak}T${
          String(hour).padStart(2, "0")
        }:00`,
        cloud_cover_pct: 85,
        shortwave_w_m2: hour >= 8 && hour < 18 ? 100 : 0,
        clear_sky_shortwave_w_m2: hour >= 8 && hour < 18 ? 450 : 0,
        precipitation_in: 0.01,
      })),
    };
    const weatherOnly = scoreActivity(common);
    const withInventedUpstreamRiverInputs = scoreActivity({
      ...common,
      waterTempF: 50,
      gaugeFreshness: "fresh",
      flowSignal: "sharp_rise",
    });

    assertEquals(weatherOnly.confidence, "Limited", run.runId);
    assertEquals(weatherOnly.score, withInventedUpstreamRiverInputs.score);
    assert(weatherOnly.score !== null && weatherOnly.score <= 90, run.runId);
    assertMatch(weatherOnly.headline, /weather-only/i, run.runId);
    assertMatch(
      weatherOnly.detail,
      /River level, clarity, and measured water temperature are unknown/i,
      run.runId,
    );
  }
});

Deno.test("Root strengths, corridor, source separation, and facility endpoint stay exact", () => {
  assertEquals(
    runs.map((run) => [
      run.species,
      run.historicalPresence.maximum,
      run.historicalPresence.distributionScope,
    ]),
    [
      ["chinook_salmon", 8, "broad"],
      ["coho_salmon", 9, "broad"],
      ["steelhead", 7, "broad"],
      ["lake_run_brown_trout", 7, "broad"],
    ],
  );
  assertMatch(
    ROOT_RIVER_PROFILE.foundation?.upstreamTerminus ?? "",
    /downstream face.*Steelhead Facility/i,
  );
  assertEquals(
    ROOT_RIVER_PROFILE.foundation?.reaches.map((reach) => reach.displayName),
    [
      "Harbor & Downtown — Lake Michigan to 6th Street",
      "City Parks — 6th Street to Island Park",
      "Lincoln Park — Island Park to the Steelhead Facility",
    ],
  );
  assertEquals(ROOT_RIVER_PROFILE.foundation?.primaryGaugeReachId, null);
  assertEquals(ROOT_RIVER_PROFILE.hydraulicSources[0].siteId, "04087240");
  assertEquals(
    ROOT_RIVER_PROFILE.waterTemperatureSources[0].siteId,
    "04087234",
  );
  assertMatch(
    ROOT_RIVER_PROFILE.gaugeLimitationCopy ?? "",
    /separate upper-river readings/i,
  );
});

Deno.test("Root calendars preserve direct salmon timing and living-fish lifecycles", () => {
  assertEquals(ROOT_FALL_CHINOOK_RUN_PROFILE.runWindow.peak, "10-08");
  assertEquals(ROOT_FALL_COHO_RUN_PROFILE.runWindow.peak, "10-15");
  assertEquals(ROOT_FALL_STEELHEAD_RUN_PROFILE.runWindow.peak, "10-10");
  assertEquals(ROOT_FALL_BROWN_TROUT_RUN_PROFILE.runWindow.peak, "11-30");
  assertEquals(ROOT_FALL_STEELHEAD_RUN_PROFILE.runType, "fall_entry");
  assertEquals(ROOT_FALL_BROWN_TROUT_RUN_PROFILE.runType, "fall_repeat_spawn");

  for (const run of runs) {
    const peak = scoreFishInRiver(run, `2026-${run.runWindow.peak}`);
    assertEquals(peak.score, run.historicalPresence.maximum * 10, run.runId);
  }
});

Deno.test("Root Stage copy leads with restrictions and the operational facility warning", () => {
  for (const run of runs) {
    const stage = resolveRunStage(run, `2026-${run.runWindow.peak}`);
    assertMatch(stage.whereToStart ?? "", /^Restrictions first:/i, run.runId);
    assertMatch(
      stage.whereToStart ?? "",
      /night-fishing restriction/i,
      run.runId,
    );
    assertMatch(JSON.stringify(stage), /Steelhead Facility/i, run.runId);
    assertMatch(JSON.stringify(stage), /Lincoln Park|City Parks/i, run.runId);
    assertNotMatch(
      JSON.stringify(stage),
      /Waelderhaus|Kletzsch|Bridge Street|Hesperia/i,
      run.runId,
    );
  }
});

Deno.test("Root Steelhead and Brown completion do not claim death or departure", () => {
  const steelheadStage = resolveRunStage(
    ROOT_FALL_STEELHEAD_RUN_PROFILE,
    "2027-01-01",
  );
  const brownStage = resolveRunStage(
    ROOT_FALL_BROWN_TROUT_RUN_PROFILE,
    "2027-01-16",
  );
  assertEquals(steelheadStage.label, "Fall entry complete");
  assertEquals(brownStage.label, "Fall migration complete");
  assertMatch(steelheadStage.tip, /may remain through winter/i);
  assertMatch(brownStage.detail, /remain.*or return lakeward/i);
  assertNotMatch(
    JSON.stringify({ steelheadStage, brownStage }),
    /die|dead|mortality/i,
  );
});

Deno.test("Root keeps upper-Horlick hydraulics as Gauge Read context but fails corridor Fishability closed", () => {
  assertEquals(ROOT_RIVER_PROFILE.foundation?.primaryGaugeReachId, null);
  assertEquals(ROOT_RIVER_PROFILE.hydraulicSources[0].siteId, "04087240");
  const baseline = ROOT_RIVER_PROFILE.fixedFlowSeasonalBaseline;
  assert(baseline);
  assertEquals(baseline.normals["02-15"]?.historicalYears, 6);
  assertEquals(baseline.normals["02-15"]?.sampleCount, 42);
  for (const run of runs) {
    const fishability = run.primitiveCapabilities.fishability;
    assertEquals(fishability.status, "unavailable");
    if (fishability.status !== "unavailable") throw new Error(run.runId);
    assertEquals(run.fishabilityBands, undefined);
    assertMatch(
      fishability.notes ?? "",
      /upstream of the product endpoint/i,
    );
    assertMatch(
      fishability.notes ?? "",
      /Gauge Read context/i,
    );
  }
});
