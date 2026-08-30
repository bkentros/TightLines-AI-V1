import {
  assert,
  assertEquals,
  assertMatch,
  assertNotMatch,
} from "jsr:@std/assert";
import {
  resolveAdminOverrideBand,
  resolveRunStage,
  RIVER_RUN_RUN_PROFILES,
  scoreActivity,
  scoreFishability,
  scoreFishInRiver,
  SHEBOYGAN_CONFIGURATION_DOCUMENT,
  SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE,
  SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE,
  SHEBOYGAN_FALL_COHO_RUN_PROFILE,
  SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE,
  SHEBOYGAN_RIVER_PROFILE,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

const runs = [
  SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE,
  SHEBOYGAN_FALL_COHO_RUN_PROFILE,
  SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE,
  SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE,
];

Deno.test("Sheboygan four-species foundation validates in the public catalog", () => {
  const riverResult = validateRiverProfile(SHEBOYGAN_RIVER_PROFILE);
  assertEquals(
    riverResult.valid,
    true,
    riverResult.issues.map((issue) => issue.message).join("\n"),
  );
  assertEquals(SHEBOYGAN_RIVER_PROFILE.foundation?.targetSpecies, [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "lake_run_brown_trout",
  ]);
  assertEquals(SHEBOYGAN_RIVER_PROFILE.waterTemperatureSources, []);
  assertEquals(
    SHEBOYGAN_RIVER_PROFILE.conditionDataCapabilities.waterTemperature.status,
    "unavailable",
  );

  for (const run of runs) {
    const result = validateRunProfile(run, SHEBOYGAN_RIVER_PROFILE);
    assertEquals(
      result.valid,
      true,
      `${run.runId}: ${result.issues.map((issue) => issue.message).join("\n")}`,
    );
    assertEquals(result.publicVisible, true, run.runId);
    assertEquals(run.publicAudit.isEnabled, true, run.runId);
    assertEquals(run.primitiveCapabilities.migrationStage.status, "available");
    assertEquals(run.primitiveCapabilities.fishInRiver.status, "available");
    assertEquals(run.primitiveCapabilities.fishability.status, "available");
    assertEquals(run.primitiveCapabilities.activity.status, "available");
    assertEquals(run.activity?.dataMode, "weather_only");
    assertEquals(run.activity?.inputReach?.hydraulicSourceIds, []);
    assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, []);
    assertEquals(run.activity?.inputReach?.weatherPointIds, [
      "sheboygan_i43_weather",
    ]);
    assert(
      RIVER_RUN_RUN_PROFILES.some((publicRun) => publicRun.runId === run.runId),
      `${run.runId} is missing from the public registry`,
    );
  }

  const issues = validateConfigurationRevision({
    configKey: "sheboygan",
    revision: 1,
    status: "published",
    document: SHEBOYGAN_CONFIGURATION_DOCUMENT,
    evidenceNotes: "Owner-approved Sheboygan four-species public release.",
  });
  assert(
    issues.every((issue) => issue.severity !== "error"),
    issues.map((issue) => issue.message).join("\n"),
  );
});

Deno.test("Sheboygan Activity is Limited weather-only context and ignores river inputs", () => {
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
    const withoutRiverInputs = scoreActivity(common);
    const withInventedRiverInputs = scoreActivity({
      ...common,
      waterTempF: 50,
      gaugeFreshness: "fresh",
      flowSignal: "sharp_rise",
    });

    assertEquals(withoutRiverInputs.confidence, "Limited", run.runId);
    assertEquals(withoutRiverInputs.score, withInventedRiverInputs.score);
    assert(
      withoutRiverInputs.score !== null && withoutRiverInputs.score <= 90,
      run.runId,
    );
    assertMatch(withoutRiverInputs.headline, /weather-only/i, run.runId);
    assertMatch(
      withoutRiverInputs.detail,
      /River level, clarity, and measured water temperature are unknown/i,
      run.runId,
    );
  }
});

Deno.test("Sheboygan strengths, broad distribution, and Waelderhaus endpoint stay exact", () => {
  assertEquals(
    runs.map((run) => [
      run.species,
      run.historicalPresence.maximum,
      run.historicalPresence.distributionScope,
    ]),
    [
      ["chinook_salmon", 8, "broad"],
      ["coho_salmon", 8, "broad"],
      ["steelhead", 5, "broad"],
      ["lake_run_brown_trout", 8, "broad"],
    ],
  );
  assertMatch(
    SHEBOYGAN_RIVER_PROFILE.foundation?.upstreamTerminus ?? "",
    /Waelderhaus Dam/i,
  );
  assertEquals(
    SHEBOYGAN_RIVER_PROFILE.foundation?.reaches.map((reach) =>
      reach.displayName
    ),
    [
      "Harbor & Lower City — Lake Michigan to Kiwanis Park",
      "Urban River — Kiwanis Park to I-43",
      "Kohler Reach — I-43 to Waelderhaus Dam",
    ],
  );
});

Deno.test("Sheboygan calendars preserve independent salmon, Steelhead, and Brown lifecycles", () => {
  assertEquals(SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE.runWindow.peak, "10-10");
  assertEquals(SHEBOYGAN_FALL_COHO_RUN_PROFILE.runWindow.peak, "10-20");
  assertEquals(SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE.runWindow.peak, "10-01");
  assertEquals(
    SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE.runWindow.peak,
    "11-25",
  );
  assertEquals(SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE.runType, "fall_entry");
  assertEquals(
    SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE.runType,
    "fall_repeat_spawn",
  );
});

Deno.test("Sheboygan every Stage transition and seasonal peak remains exact", () => {
  const transitions = [
    [
      SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE,
      [
        "2026-08-24",
        "2026-08-25",
        "2026-09-11",
        "2026-10-10",
        "2026-10-21",
        "2026-11-03",
        "2026-11-11",
      ],
    ],
    [
      SHEBOYGAN_FALL_COHO_RUN_PROFILE,
      [
        "2026-09-09",
        "2026-09-10",
        "2026-09-21",
        "2026-10-20",
        "2026-11-01",
        "2026-11-21",
        "2026-12-01",
      ],
    ],
    [
      SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE,
      [
        "2026-08-14",
        "2026-09-01",
        "2026-09-11",
        "2026-10-01",
        "2026-10-16",
        "2026-11-16",
        "2026-12-16",
      ],
    ],
    [
      SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE,
      [
        "2026-09-30",
        "2026-10-01",
        "2026-10-16",
        "2026-11-25",
        "2026-12-11",
        "2026-12-21",
        "2027-01-16",
      ],
    ],
  ] as const;
  const expected = [
    "pre_run",
    "beginning",
    "building",
    "peak",
    "tapering",
    "ending",
    "post_run",
  ];

  for (const [run, dates] of transitions) {
    assertEquals(
      dates.map((date) => resolveRunStage(run, date).stage),
      expected,
      run.runId,
    );
    const peak = scoreFishInRiver(run, dates[3]);
    assertEquals(peak.score, run.historicalPresence.maximum * 10, run.runId);
  }
});

Deno.test("Sheboygan Stage copy puts restrictions first and follows the three-section corridor", () => {
  const checks = [
    [SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE, "2026-08-20"],
    [SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE, "2026-08-28"],
    [SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE, "2026-09-06"],
    [SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE, "2026-09-12"],
    [SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE, "2026-10-10"],
    [SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE, "2026-10-25"],
    [SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE, "2026-11-03"],
    [SHEBOYGAN_FALL_COHO_RUN_PROFILE, "2026-10-20"],
    [SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE, "2026-11-20"],
    [SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE, "2026-11-25"],
  ] as const;

  for (const [run, date] of checks) {
    const result = resolveRunStage(run, date);
    assertMatch(result.whereToStart ?? "", /^Restrictions first:/i);
    assertMatch(result.whereToStart ?? "", /night-fishing restriction/i);
    assertMatch(result.detail, /Waelderhaus Dam/i);
    assertNotMatch(
      JSON.stringify(result),
      /Kletzsch|Estabrook|Milwaukee Harbor|Hesperia|Twin Branch/i,
    );
  }

  assertMatch(
    resolveRunStage(SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE, "2026-08-28")
      .whereToStart ?? "",
    /Harbor & Lower City/i,
  );
  assertMatch(
    resolveRunStage(SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE, "2026-09-12")
      .whereToStart ?? "",
    /Urban River/i,
  );
  assertMatch(
    resolveRunStage(SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE, "2026-10-10")
      .whereToStart ?? "",
    /Kohler Reach/i,
  );
});

Deno.test("Sheboygan Brown Trout completion preserves repeat-spawner uncertainty", () => {
  const stage = resolveRunStage(
    SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE,
    "2027-01-16",
  );
  const presence = scoreFishInRiver(
    SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE,
    "2027-01-16",
  );
  assertEquals(stage.label, "Fall migration complete");
  assertEquals(presence.score, null);
  assertMatch(stage.detail, /remain.*or return lakeward/i);
  assertMatch(presence.detail, /remain.*or return lakeward/i);
  assertNotMatch(JSON.stringify({ stage, presence }), /die|dead|mortality/i);
});

Deno.test("Sheboygan Steelhead completion ends only the fall-entry model", () => {
  const stage = resolveRunStage(
    SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE,
    "2027-01-01",
  );
  const presence = scoreFishInRiver(
    SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE,
    "2027-01-01",
  );
  assertEquals(stage.label, "Fall entry complete");
  assertEquals(presence.score, null);
  assertMatch(stage.tip, /may remain through winter/i);
  assertNotMatch(JSON.stringify({ stage, presence }), /die|dead|mortality/i);
});

Deno.test("Sheboygan Fishability is I-43 scoped and honors audited boundaries", () => {
  const baseline = SHEBOYGAN_RIVER_PROFILE.fixedFlowSeasonalBaseline;
  assert(baseline);
  assertEquals(baseline.normals["02-15"]?.historicalYears, 7);
  assertEquals(baseline.normals["02-15"]?.sampleCount, 49);
  const bands = SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE.fishabilityBands!;
  assertEquals(bands.tooLow.max, 87);
  assertEquals(bands.ideal, { min: 118, max: 338 });
  assertEquals(bands.highFishable, { min: 338, max: 674 });
  assertEquals(resolveAdminOverrideBand(338, bands), "ideal");
  assertEquals(resolveAdminOverrideBand(338.5, bands), "high_fishable");
  assertEquals(bands.blownOut.min, 875);
  assertEquals(resolveAdminOverrideBand(675, bands), "very_high");

  const display = scoreFishability({
    rules: bands,
    gaugeFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 201,
    flowSignal: "stable",
  });
  assertEquals(display.label, "Excellent");
  assertMatch(display.detail, /live flow card compares this date/i);
  assertMatch(display.detail, /fixed presentation bands/i);
  assertMatch(display.detail, /I-43/i);
  assertMatch(display.detail, /Sheboygan Harbor/i);
  assertMatch(display.detail, /Kohler Reach/i);
  assertNotMatch(JSON.stringify(display), /fish abundance|safe to wade/i);
});
