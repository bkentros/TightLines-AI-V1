import {
  assert,
  assertEquals,
  assertMatch,
  assertNotMatch,
} from "jsr:@std/assert";
import {
  BOIS_BRULE_CONFIGURATION_DOCUMENT,
  BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE,
  BOIS_BRULE_FALL_CHINOOK_RUN_PROFILE,
  BOIS_BRULE_FALL_COHO_RUN_PROFILE,
  BOIS_BRULE_FALL_STEELHEAD_RUN_PROFILE,
  BOIS_BRULE_RIVER_PROFILE,
  buildRiverLiveConditions,
  type NormalizedGaugeObservation,
  resolveRunStage,
  RIVER_RUN_RUN_PROFILES,
  scoreActivity,
  scoreFishInRiver,
  type SupabaseLikeClient,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

const runs = [
  BOIS_BRULE_FALL_CHINOOK_RUN_PROFILE,
  BOIS_BRULE_FALL_COHO_RUN_PROFILE,
  BOIS_BRULE_FALL_STEELHEAD_RUN_PROFILE,
  BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE,
];

Deno.test("Bois Brule four-species foundation validates in the public catalog", () => {
  const riverResult = validateRiverProfile(BOIS_BRULE_RIVER_PROFILE);
  assertEquals(
    riverResult.valid,
    true,
    riverResult.issues.map((issue) => issue.message).join("\n"),
  );
  assertEquals(BOIS_BRULE_RIVER_PROFILE.foundation?.targetSpecies, [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "lake_run_brown_trout",
  ]);

  for (const run of runs) {
    const result = validateRunProfile(run, BOIS_BRULE_RIVER_PROFILE);
    assertEquals(
      result.valid,
      true,
      `${run.runId}: ${result.issues.map((issue) => issue.message).join("\n")}`,
    );
    assertEquals(result.publicVisible, true, run.runId);
    assertEquals(run.publicAudit.isEnabled, true, run.runId);
    assertEquals(run.primitiveCapabilities.migrationStage.status, "available");
    assertEquals(run.primitiveCapabilities.fishInRiver.status, "available");
    assertEquals(run.primitiveCapabilities.activity.status, "available");
    assertEquals(run.primitiveCapabilities.fishability.status, "unavailable");
    assertEquals(run.activity?.dataMode, "weather_only");
    assertEquals(run.activity?.weights.waterTemperature, 0);
    assertEquals(run.activity?.weights.riverBehavior, 0);
    assertEquals(run.activity?.inputReach?.hydraulicSourceIds, []);
    assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, []);
    assertEquals(run.fishabilityBands, undefined);
    assert(
      RIVER_RUN_RUN_PROFILES.some((item) => item.runId === run.runId),
      `${run.runId} is missing from the public registry`,
    );
  }

  const issues = validateConfigurationRevision({
    configKey: "bois_brule",
    revision: 1,
    status: "published",
    document: BOIS_BRULE_CONFIGURATION_DOCUMENT,
    evidenceNotes: "Owner-approved Bois Brule four-species public release.",
  });
  assert(
    issues.every((issue) => issue.severity !== "error"),
    issues.map((issue) => issue.message).join("\n"),
  );
});

Deno.test("Bois Brule Activity is Limited weather-only and ignores gauge and historical temperature", () => {
  for (const run of runs) {
    const localDate = `2026-${run.runWindow.peak}`;
    const common = {
      rules: run.activity!,
      requestDate: localDate,
      targetDate: localDate,
      runStage: "peak" as const,
      staging: false,
      waterTempF: null,
      temperatureTrend: "neutral_missing" as const,
      gaugeFreshness: "missing" as const,
      weatherFreshness: "fresh" as const,
      flowSignal: "unknown" as const,
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `${localDate}T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 85,
        shortwave_w_m2: hour >= 8 && hour < 18 ? 100 : 0,
        clear_sky_shortwave_w_m2: hour >= 8 && hour < 18 ? 450 : 0,
        precipitation_in: 0.01,
      })),
    };
    const weatherOnly = scoreActivity(common);
    const withInventedRiverInputs = scoreActivity({
      ...common,
      waterTempF: 50,
      gaugeFreshness: "fresh",
      flowSignal: "sharp_rise",
    });

    assertEquals(weatherOnly.confidence, "Limited", run.runId);
    assertEquals(weatherOnly.score, withInventedRiverInputs.score, run.runId);
    assert(weatherOnly.score !== null && weatherOnly.score <= 90, run.runId);
    assertMatch(weatherOnly.headline, /weather-only/i, run.runId);
    assertMatch(
      weatherOnly.detail,
      /River level, clarity, and measured water temperature are unknown/i,
      run.runId,
    );
  }
});

Deno.test("Bois Brule Activity preserves salmon decline and living-fish calibrations", () => {
  assertEquals(
    BOIS_BRULE_FALL_CHINOOK_RUN_PROFILE.activity?.caps.lifecycleRamp,
    {
      peakEnd: "09-30",
      taperingEnd: "10-10",
      endingEnd: "10-31",
    },
  );
  assertEquals(
    BOIS_BRULE_FALL_COHO_RUN_PROFILE.activity?.caps.lifecycleRamp,
    {
      peakEnd: "10-15",
      taperingEnd: "10-31",
      endingEnd: "11-25",
    },
  );
  assertEquals(
    BOIS_BRULE_FALL_STEELHEAD_RUN_PROFILE.activity?.caps.lifecycleRamp,
    undefined,
  );
  assertEquals(
    BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE.activity?.caps.lifecycleRamp,
    undefined,
  );
  assertEquals(
    BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE.activity
      ?.stageResponseAdjustment,
    {
      pre_run: 0,
      beginning: 0,
      building: 0,
      peak: 6,
      tapering: 0,
      ending: 0,
      post_run: 0,
    },
  );
  assertEquals(
    BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE.activity?.caps
      .weatherOnlyEvidenceScale,
    0.8,
  );
  assertEquals(
    BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE.activity?.caps
      .stageResponseMaximum,
    80,
  );
});

Deno.test("Bois Brule strengths, scopes, early Brown calendar, and fall-entry lifecycle stay exact", () => {
  assertEquals(
    runs.map((run) => [
      run.species,
      run.historicalPresence.maximum,
      run.historicalPresence.distributionScope,
      run.runWindow.peak,
    ]),
    [
      ["chinook_salmon", 2, "sectional", "09-05"],
      ["coho_salmon", 8, "broad", "09-28"],
      ["steelhead", 9, "broad", "09-28"],
      ["lake_run_brown_trout", 7, "broad", "08-15"],
    ],
  );
  assertEquals(BOIS_BRULE_FALL_STEELHEAD_RUN_PROFILE.runType, "fall_entry");
  assertEquals(
    BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE.runType,
    "fall_repeat_spawn",
  );
  for (const run of runs) {
    assertEquals(
      scoreFishInRiver(run, `2026-${run.runWindow.peak}`).score,
      run.historicalPresence.maximum * 10,
      run.runId,
    );
  }
});

Deno.test("Bois Brule Stage copy leads with every seasonal and refuge restriction", () => {
  for (const run of runs) {
    const stage = resolveRunStage(run, `2026-${run.runWindow.peak}`);
    assertMatch(stage.whereToStart ?? "", /^Restrictions first:/i, run.runId);
    assertMatch(stage.whereToStart ?? "", /Nov\. 15/i, run.runId);
    assertMatch(stage.whereToStart ?? "", /Box Car Hole/i, run.runId);
    assertMatch(stage.whereToStart ?? "", /Mays Ledges/i, run.runId);
    assertMatch(stage.whereToStart ?? "", /500-foot refuge/i, run.runId);
    assertMatch(JSON.stringify(stage), /Highway 2/i, run.runId);
    assertNotMatch(
      JSON.stringify(stage),
      /Waelderhaus|Kletzsch|Steelhead Facility|Hesperia/i,
      run.runId,
    );
  }
});

Deno.test("Bois Brule post-season Steelhead and Brown copy preserves living-fish truth", () => {
  const steelhead = resolveRunStage(
    BOIS_BRULE_FALL_STEELHEAD_RUN_PROFILE,
    "2026-12-01",
  );
  const brown = resolveRunStage(
    BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE,
    "2026-10-21",
  );
  assertEquals(steelhead.label, "Fall entry complete");
  assertEquals(brown.label, "Fall migration complete");
  assertMatch(steelhead.tip, /overwinter/i);
  assertMatch(brown.detail, /survive spawning/i);
  assertMatch(brown.detail, /no longer estimates/i);
  assertNotMatch(JSON.stringify({ steelhead, brown }), /die|dead|mortality/i);
});

Deno.test("Bois Brule Gauge Read keeps current temperature unavailable while showing exact-date history", async () => {
  const conditions = await buildRiverLiveConditions({
    client: {} as SupabaseLikeClient,
    river: BOIS_BRULE_RIVER_PROFILE,
    localDate: "2026-09-15",
    refreshSlot: "08:00",
    refreshAtUtc: "2026-09-15T13:00:00Z",
    fetchFn: () => {
      throw new Error("provider should not be called");
    },
    gaugeObservations: gaugeObservations(),
    seasonalContextsByMetric: {
      flow_cfs: null,
      gage_height_ft: null,
    },
  });

  assertEquals(conditions.status, "partial");
  const temperature = conditions.metrics.find((metric) =>
    metric.metric === "water_temp_f"
  );
  assert(temperature);
  assertEquals(temperature.value, null);
  assertEquals(temperature.observedAt, undefined);
  assertEquals(temperature.trend24h.delta, null);
  assertEquals(temperature.seasonalContext?.average, 57.6);
  assertEquals(temperature.seasonalContext?.historicalYears, 3);
  assertEquals(temperature.seasonalContext?.windowRadiusDays, 0);
  assertEquals(
    temperature.seasonalContext?.source,
    "usgs_approved_exact_date_archive",
  );
  assertMatch(conditions.limitation, /not today's temperature/i);
});

function gaugeObservations(): NormalizedGaugeObservation[] {
  return [
    {
      provider: "USGS",
      siteId: "04025500",
      observedAt: "2026-09-14T12:00:00Z",
      flow_cfs: 110,
      gage_height_ft: 1.4,
      approvalStatus: "Provisional",
      source: "usgs_continuous_values",
    },
    {
      provider: "USGS",
      siteId: "04025500",
      observedAt: "2026-09-15T12:00:00Z",
      flow_cfs: 120,
      gage_height_ft: 1.44,
      approvalStatus: "Provisional",
      source: "usgs_continuous_values",
    },
  ];
}
