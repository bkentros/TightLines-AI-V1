import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  COWLITZ_FALL_COHO_RUN_PROFILE,
  COWLITZ_RIVER_PROFILE,
  GREEN_RIVER_PROFILE,
  PUYALLUP_RIVER_PROFILE,
  RIVER_RUN_DRAFT_RIVER_PROFILES,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  scoreActivity,
  scoreFishability,
  validateRiverProfile,
  validateRunProfile,
  WASHINGTON_DRAFT_RIVERS,
  WASHINGTON_DRAFT_RUNS,
} from "../index.ts";

Deno.test("Washington foundations validate and remain owner-review only", () => {
  assertEquals(WASHINGTON_DRAFT_RIVERS.length, 3);
  assertEquals(WASHINGTON_DRAFT_RUNS.length, 6);
  for (const river of WASHINGTON_DRAFT_RIVERS) {
    const result = validateRiverProfile(river);
    assertEquals(
      result.valid,
      true,
      result.issues.map((item) => item.message).join("\n"),
    );
    assertEquals(river.region, "pacific_northwest");
    assertEquals(river.waterTemperatureSources, []);
    assertEquals(
      river.conditionDataCapabilities.waterTemperature.status,
      "unavailable",
    );
    assertEquals(river.fishCountSources?.length, 1);
    assert(
      RIVER_RUN_DRAFT_RIVER_PROFILES.some((item) =>
        item.riverId === river.riverId
      ),
    );
    assert(
      !RIVER_RUN_RIVER_PROFILES.some((item) => item.riverId === river.riverId),
    );
  }
  for (const run of WASHINGTON_DRAFT_RUNS) {
    const river = WASHINGTON_DRAFT_RIVERS.find((item) =>
      item.riverId === run.riverId
    )!;
    const result = validateRunProfile(run, river);
    assertEquals(
      result.valid,
      true,
      result.issues.map((item) => item.message).join("\n"),
    );
    assertEquals(result.publicVisible, false);
    assertEquals(run.publicAudit.isEnabled, false);
    assertEquals(run.activity?.dataMode, "weather_only");
    assertEquals(run.activity?.weights.riverBehavior, 0);
    assertEquals(run.activity?.weights.waterTemperature, 0);
    assertEquals(run.activity?.inputReach?.hydraulicSourceIds, []);
    assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, []);
    assertEquals(run.primitiveCapabilities.push.status, "unavailable");
    assertEquals(
      run.primitiveCapabilities.migrationTiming.status,
      "unavailable",
    );
    assert(
      RIVER_RUN_DRAFT_RUN_PROFILES.some((item) => item.runId === run.runId),
    );
    assert(!RIVER_RUN_RUN_PROFILES.some((item) => item.runId === run.runId));
  }
});

Deno.test("Green Fishability is an Auburn/Big Soos presentation read only", () => {
  const run = WASHINGTON_DRAFT_RUNS.find((item) =>
    item.runId === "green_fall_chinook"
  )!;
  const result = scoreFishability({
    rules: run.fishabilityBands!,
    gaugeFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "stable",
    currentHydraulicValue: 420,
  });
  assertEquals(typeof result.score, "number");
  assertMatch(result.detail, /Auburn\/Big Soos mainstem/i);
  assertMatch(result.detail, /does not describe the tidal Duwamish/i);
  assertMatch(result.detail, /fish abundance/i);
});

Deno.test("Washington source reaches and barriers stay river-specific", () => {
  assertEquals(
    GREEN_RIVER_PROFILE.foundation?.upstreamTerminus,
    "Tacoma municipal watershed boundary below the Headworks diversion",
  );
  assertEquals(
    PUYALLUP_RIVER_PROFILE.foundation?.upstreamTerminus,
    "Carbon River confluence",
  );
  assertEquals(
    COWLITZ_RIVER_PROFILE.foundation?.upstreamTerminus,
    "Barrier Dam adult separator exclusion boundary",
  );
  assertMatch(
    GREEN_RIVER_PROFILE.gaugeLimitationCopy,
    /no live representative water-temperature/i,
  );
  assertMatch(
    PUYALLUP_RIVER_PROFILE.gaugeLimitationCopy,
    /historical calendar-date/i,
  );
  assertMatch(
    COWLITZ_RIVER_PROFILE.gaugeLimitationCopy,
    /neither station provides live water temperature/i,
  );
  assertEquals(
    GREEN_RIVER_PROFILE.historicalWaterTemperatureSource?.siteId,
    "12113000",
  );
  assertMatch(
    GREEN_RIVER_PROFILE.historicalWaterTemperatureSource?.reachNotes ?? "",
    /never today's temperature/i,
  );
  assertEquals(
    PUYALLUP_RIVER_PROFILE.historicalWaterTemperatureSource?.siteId,
    "10A040",
  );
  assertEquals(
    PUYALLUP_RIVER_PROFILE.historicalWaterTemperatureSource?.provider,
    "WA_ECOLOGY",
  );
  assertMatch(
    PUYALLUP_RIVER_PROFILE.historicalWaterTemperatureSource?.reachNotes ?? "",
    /currently inactive/i,
  );
  const runsByRiver = (riverId: "green" | "puyallup" | "cowlitz") =>
    WASHINGTON_DRAFT_RUNS.filter((run) => run.riverId === riverId);
  const greenRuns = runsByRiver("green");
  assertEquals(
    greenRuns.map((run) => run.primitiveCapabilities.fishability.status),
    ["available", "available"],
  );
  assertEquals(
    greenRuns.map((run) => run.fishabilityBands?.sourceLabel),
    [
      "Auburn / Big Soos mainstem reach",
      "Auburn / Big Soos mainstem reach",
    ],
  );
  assertEquals(
    runsByRiver("puyallup").map((run) => run.fishabilityBands?.sourceLabel),
    [
      "Puyallup / Clarks lower-mainstem reach",
      "Puyallup / Clarks lower-mainstem reach",
    ],
  );
  assertEquals(
    runsByRiver("cowlitz").map((run) => run.fishabilityBands?.sourceLabel),
    [
      "Castle Rock lower-mainstem reach",
      "Castle Rock lower-mainstem reach",
    ],
  );
  for (const run of WASHINGTON_DRAFT_RUNS) {
    assertEquals(run.primitiveCapabilities.fishability.status, "available");
    assert(run.fishabilityBands);
    assert(run.baselineCoverage?.hasPercentileBaselines);
  }
  assertEquals(COWLITZ_FALL_COHO_RUN_PROFILE.runWindow.end, "01-15");
  assertEquals(COWLITZ_FALL_COHO_RUN_PROFILE.runWindow.lateEnd, "02-01");
});

Deno.test("Puyallup and Cowlitz Fishability copy remains gauge-reach specific", () => {
  const cases = [
    {
      runId: "puyallup_fall_chinook",
      value: 1850,
      required: /lower mainstem near Puyallup and Clarks Creek/i,
      excluded: /does not infer glacial turbidity/i,
    },
    {
      runId: "cowlitz_fall_chinook",
      value: 5860,
      required: /lower mainstem near Castle Rock/i,
      excluded: /does not describe the Barrier Dam tailwater/i,
    },
  ] as const;
  for (const item of cases) {
    const run = WASHINGTON_DRAFT_RUNS.find((candidate) =>
      candidate.runId === item.runId
    )!;
    const result = scoreFishability({
      rules: run.fishabilityBands!,
      gaugeFreshness: "fresh",
      flowBand: "ideal",
      flowSignal: "stable",
      currentHydraulicValue: item.value,
    });
    assertEquals(typeof result.score, "number");
    assertMatch(result.detail, item.required);
    assertMatch(result.detail, item.excluded);
  }
});

Deno.test("Washington calendars and opportunity strengths remain exactly reconciled", () => {
  type ExpectedRun = {
    runWindow: (typeof WASHINGTON_DRAFT_RUNS)[number]["runWindow"];
    maximum:
      (typeof WASHINGTON_DRAFT_RUNS)[number]["historicalPresence"]["maximum"];
    scope: (typeof WASHINGTON_DRAFT_RUNS)[number]["historicalPresence"][
      "distributionScope"
    ];
  };
  const expected: Record<string, ExpectedRun> = {
    green_fall_chinook: {
      runWindow: {
        preRunStart: "06-20",
        stagingStart: "07-10",
        start: "07-20",
        beginningEnd: "08-19",
        buildingEstablishedStart: "08-20",
        buildingBroadStart: "09-01",
        peakStart: "09-10",
        peak: "09-20",
        peakEnd: "10-05",
        taperingEnd: "10-25",
        end: "11-05",
        lateEnd: "11-15",
        postRunLateCopyEnd: "11-20",
      },
      maximum: 7,
      scope: "broad",
    },
    green_fall_coho: {
      runWindow: {
        preRunStart: "07-20",
        stagingStart: "08-10",
        start: "08-20",
        beginningEnd: "09-04",
        buildingEstablishedStart: "09-05",
        buildingBroadStart: "09-15",
        peakStart: "09-20",
        peak: "10-05",
        peakEnd: "10-25",
        taperingEnd: "11-15",
        end: "12-01",
        lateEnd: "12-15",
        postRunLateCopyEnd: "12-20",
      },
      maximum: 8,
      scope: "broad",
    },
    puyallup_fall_chinook: {
      runWindow: {
        preRunStart: "06-20",
        stagingStart: "07-01",
        start: "07-15",
        beginningEnd: "07-31",
        buildingEstablishedStart: "08-01",
        buildingBroadStart: "08-15",
        peakStart: "08-20",
        peak: "09-01",
        peakEnd: "09-20",
        taperingEnd: "10-01",
        end: "10-15",
        lateEnd: "10-25",
        postRunLateCopyEnd: "10-31",
      },
      maximum: 8,
      scope: "broad",
    },
    puyallup_fall_coho: {
      runWindow: {
        preRunStart: "07-25",
        stagingStart: "08-15",
        start: "08-25",
        beginningEnd: "09-09",
        buildingEstablishedStart: "09-10",
        buildingBroadStart: "09-20",
        peakStart: "09-25",
        peak: "10-05",
        peakEnd: "10-25",
        taperingEnd: "11-10",
        end: "11-25",
        lateEnd: "12-05",
        postRunLateCopyEnd: "12-10",
      },
      maximum: 7,
      scope: "broad",
    },
    cowlitz_fall_chinook: {
      runWindow: {
        preRunStart: "07-01",
        stagingStart: "07-20",
        start: "08-01",
        beginningEnd: "08-14",
        buildingEstablishedStart: "08-15",
        buildingBroadStart: "08-25",
        peakStart: "09-01",
        peak: "09-15",
        peakEnd: "09-30",
        taperingEnd: "10-20",
        end: "11-15",
        lateEnd: "12-01",
        postRunLateCopyEnd: "12-10",
      },
      maximum: 6,
      scope: "broad",
    },
    cowlitz_fall_coho: {
      runWindow: {
        preRunStart: "07-15",
        stagingStart: "08-01",
        start: "08-15",
        beginningEnd: "08-31",
        buildingEstablishedStart: "09-01",
        buildingBroadStart: "09-15",
        peakStart: "09-20",
        peak: "10-10",
        peakEnd: "10-31",
        taperingEnd: "11-30",
        end: "01-15",
        lateEnd: "02-01",
        postRunLateCopyEnd: "02-15",
      },
      maximum: 9,
      scope: "broad",
    },
  };
  const actual: Record<string, ExpectedRun> = Object.fromEntries(
    WASHINGTON_DRAFT_RUNS.map((run) => [
      run.runId,
      {
        runWindow: run.runWindow,
        maximum: run.historicalPresence.maximum,
        scope: run.historicalPresence.distributionScope,
      },
    ]),
  );
  assertEquals(actual, expected);
});

Deno.test("Washington Fish Counts sources cannot alter Activity", () => {
  for (const run of WASHINGTON_DRAFT_RUNS) {
    const localDate = `2026-${run.runWindow.peak}`;
    const scored = scoreActivity({
      rules: run.activity!,
      requestDate: localDate,
      targetDate: localDate,
      runStage: "peak",
      staging: false,
      waterTempF: null,
      temperatureTrend: "neutral_missing",
      gaugeFreshness: "missing",
      weatherFreshness: "fresh",
      flowSignal: "unknown",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `${localDate}T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 80,
        shortwave_w_m2: hour >= 7 && hour < 19 ? 100 : 0,
        clear_sky_shortwave_w_m2: hour >= 7 && hour < 19 ? 500 : 0,
        precipitation_in: 0,
      })),
    });
    const withInventedRiverSignal = scoreActivity({
      rules: run.activity!,
      requestDate: localDate,
      targetDate: localDate,
      runStage: "peak",
      staging: false,
      waterTempF: 50,
      temperatureTrend: "strong_cooling",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowSignal: "sharp_rise",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `${localDate}T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 80,
        shortwave_w_m2: hour >= 7 && hour < 19 ? 100 : 0,
        clear_sky_shortwave_w_m2: hour >= 7 && hour < 19 ? 500 : 0,
        precipitation_in: 0,
      })),
    });
    assertEquals(scored.score, withInventedRiverSignal.score, run.runId);
    assertEquals(scored.confidence, "Limited", run.runId);
    assertMatch(scored.detail, /weather-only/i, run.runId);
  }
});
