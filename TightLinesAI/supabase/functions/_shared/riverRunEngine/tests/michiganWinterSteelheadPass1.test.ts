import { assert, assertEquals, assertGreater } from "jsr:@std/assert";
import {
  resolveRiverSpotFinderRecommendedSections,
  riverRunSpotFinderForRiver,
} from "../../../../../lib/riverRunSpotFinder.ts";
import {
  type ActivityWeatherHour,
  type AuditedRiverRunProfile,
  BIG_MANISTEE_CONFIGURATION_DOCUMENT,
  BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  BIG_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
  fetchRiverRunWeatherSnapshot,
  GRAND_CONFIGURATION_DOCUMENT,
  GRAND_FALL_STEELHEAD_RUN_PROFILE,
  GRAND_RIVER_PROFILE,
  GRAND_WINTER_STEELHEAD_RUN_PROFILE,
  isRunSeasonallyActive,
  MUSKEGON_CONFIGURATION_DOCUMENT,
  MUSKEGON_FALL_STEELHEAD_RUN_PROFILE,
  MUSKEGON_RIVER_PROFILE,
  MUSKEGON_WINTER_STEELHEAD_RUN_PROFILE,
  normalizeGaugeRead,
  PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
  PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  PERE_MARQUETTE_WINTER_STEELHEAD_RUN_PROFILE,
  resolveRunStage,
  resolveSeasonalZone,
  type RiverProfile,
  scoreActivity,
  scoreFishInRiver,
  ST_JOSEPH_CONFIGURATION_DOCUMENT,
  ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE,
  ST_JOSEPH_RIVER_PROFILE,
  ST_JOSEPH_WINTER_STEELHEAD_RUN_PROFILE,
  unavailableMigrationTiming,
  unavailablePush,
  validateConfigurationRevision,
  validateRunProfile,
} from "../index.ts";

const profiles: Array<{
  run: AuditedRiverRunProfile;
  fall: AuditedRiverRunProfile;
  river: RiverProfile;
  activation: string;
  prior: string;
  handoffScore: number;
  preferredSectionIds: string[];
}> = [
  {
    run: PERE_MARQUETTE_WINTER_STEELHEAD_RUN_PROFILE,
    fall: PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
    river: PERE_MARQUETTE_RIVER_PROFILE,
    activation: "2026-12-23",
    prior: "2026-12-22",
    handoffScore: 70,
    preferredSectionIds: ["pm_middle", "pm_upper"],
  },
  {
    run: BIG_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
    fall: BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
    river: BIG_MANISTEE_RIVER_PROFILE,
    activation: "2026-12-23",
    prior: "2026-12-22",
    handoffScore: 70,
    preferredSectionIds: ["manistee_upper"],
  },
  {
    run: MUSKEGON_WINTER_STEELHEAD_RUN_PROFILE,
    fall: MUSKEGON_FALL_STEELHEAD_RUN_PROFILE,
    river: MUSKEGON_RIVER_PROFILE,
    activation: "2026-12-23",
    prior: "2026-12-22",
    handoffScore: 80,
    preferredSectionIds: ["muskegon_upper"],
  },
  {
    run: ST_JOSEPH_WINTER_STEELHEAD_RUN_PROFILE,
    fall: ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE,
    river: ST_JOSEPH_RIVER_PROFILE,
    activation: "2026-12-23",
    prior: "2026-12-22",
    handoffScore: 81,
    preferredSectionIds: ["stjoe_middle"],
  },
  {
    run: GRAND_WINTER_STEELHEAD_RUN_PROFILE,
    fall: GRAND_FALL_STEELHEAD_RUN_PROFILE,
    river: GRAND_RIVER_PROFILE,
    activation: "2027-01-01",
    prior: "2026-12-31",
    handoffScore: 43,
    preferredSectionIds: ["grand_lower"],
  },
];

Deno.test("Michigan winter cohort is valid, holding-only, and fully scoped", () => {
  for (const { run, river } of profiles) {
    const result = validateRunProfile(run, river);
    assertEquals(
      result.valid,
      true,
      `${run.runId}: ${JSON.stringify(result.issues)}`,
    );
    assertEquals(result.publicVisible, true);
    assertEquals(run.season, "winter");
    assertEquals(run.runType, "holding");
    assertEquals(run.movementEngineId, "stable_cool_holding");
    assertEquals(run.activity?.profile, "steelhead_winter_holding");
    assertEquals(run.activity?.weights, {
      waterTemperature: 0.45,
      temperatureTrend: 0.2,
      light: 0.2,
      riverBehavior: 0.15,
      weather: 0,
    });
    assertEquals(run.primitiveCapabilities.push.status, "unavailable");
    assertEquals(
      run.primitiveCapabilities.push.status === "unavailable" &&
        run.primitiveCapabilities.push.reason,
      "not_applicable_to_holding",
    );
    assertEquals(
      run.primitiveCapabilities.migrationTiming.status,
      "unavailable",
    );
    assertEquals("push" in run, false);
    assertEquals("conditionsSuggest" in run, false);
    assert(run.activity?.inputReach);
    assert(run.waterTemperature);
    assert(run.fishabilityBands);
    assert(run.baselineCoverage);
  }
});

Deno.test("all five published configuration documents validate with winter biology", () => {
  for (
    const document of [
      PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
      BIG_MANISTEE_CONFIGURATION_DOCUMENT,
      MUSKEGON_CONFIGURATION_DOCUMENT,
      ST_JOSEPH_CONFIGURATION_DOCUMENT,
      GRAND_CONFIGURATION_DOCUMENT,
    ]
  ) {
    const issues = validateConfigurationRevision({
      configKey: `${document.river.riverId}-winter-pass1-test`,
      revision: 1,
      status: "published",
      evidenceNotes: "Winter Steelhead Pass 1 validation fixture.",
      document,
    });
    assertEquals(
      issues,
      [],
      `${document.river.riverId}: ${JSON.stringify(issues)}`,
    );
  }
});

Deno.test("winter activation is exact, non-overlapping, and preserves every fall endpoint", () => {
  for (const { run, fall, activation, prior, handoffScore } of profiles) {
    assertEquals(resolveRunStage(run, prior).label, "Not active yet");
    assertEquals(isRunSeasonallyActive(run, prior), false);
    assertEquals(isRunSeasonallyActive(fall, prior), true);
    assertEquals(scoreFishInRiver(run, prior).score, null);
    assertEquals(resolveRunStage(run, activation).label, "Winter transition");
    assertEquals(isRunSeasonallyActive(run, activation), true);
    assertEquals(isRunSeasonallyActive(fall, activation), false);
    assertEquals(scoreFishInRiver(run, activation).score, handoffScore);
  }
});

Deno.test("winter phases end February 28 without claiming a March spring run", () => {
  for (const { run } of profiles) {
    const year = run.runWindow.start === "01-01" ? 2027 : 2027;
    assertEquals(
      resolveRunStage(run, `${year}-01-08`).label,
      "Core winter hold",
    );
    assertEquals(
      resolveRunStage(run, `${year}-02-15`).label,
      "Spring approach",
    );
    assertEquals(
      resolveRunStage(run, `${year}-02-28`).label,
      "Spring approach",
    );
    assertEquals(
      resolveRunStage(run, `${year}-03-01`).label,
      "Winter holding complete",
    );
    assertEquals(isRunSeasonallyActive(run, `${year}-03-01`), false);
    assertEquals(scoreFishInRiver(run, `${year}-03-01`).score, null);
  }
});

Deno.test("every active date uses winter-only phase and unavailable-primitive copy", () => {
  for (const { run, activation } of profiles) {
    const endYear = Number(activation.slice(0, 4)) +
      (run.runWindow.start === "12-23" ? 1 : 0);
    for (
      const localDate of inclusiveDates(activation, `${endYear}-02-28`)
    ) {
      const stage = resolveRunStage(run, localDate);
      const expectedLabel = localDate <= `${endYear}-01-07`
        ? "Winter transition"
        : localDate < `${endYear}-02-15`
        ? "Core winter hold"
        : "Spring approach";
      assertEquals(stage.label, expectedLabel, `${run.runId}/${localDate}`);
      assertEquals(stage.winterHoldingContext, true);
      assert(stage.headline.includes("Steelhead"));
      assert(
        /retained|presence changes slowly|winter holding/i.test(stage.detail),
        `${run.runId}/${localDate}: ${stage.detail}`,
      );
      assert(stage.tip.length > 0);

      const presence = scoreFishInRiver(run, localDate);
      assertEquals(presence.label, "Retained winter presence");
      assert(presence.score != null);
      assertEquals(presence.curveDirection, "falling");
      assert(presence.detail.includes("not a fish count"));
    }

    const timing = unavailableMigrationTiming(
      "not_applicable_to_holding",
      run.runStageCopyStrategy,
    );
    const push = unavailablePush(
      "not_applicable_to_holding",
      run.runStageCopyStrategy,
    );
    assertEquals(
      timing.headline,
      "Migration Timing is not used for winter holding.",
    );
    assert(timing.detail.includes("already retained from fall entry"));
    assertEquals(push.headline, "Push is not used for winter holding.");
    assert(push.detail.includes("does not turn rain, flow change, or warming"));
  }
});

Deno.test("Spot Finder prioritizes measured starting water while retaining every winter section", () => {
  for (const { run, river, activation, preferredSectionIds } of profiles) {
    const finder = riverRunSpotFinderForRiver(run.riverId, "steelhead", "MI");
    assert(finder, `${run.runId} is missing its audited Steelhead Spot Finder`);
    assertEquals(run.seasonalZonePlan?.earlyApproach, undefined);

    const expectedSectionIds = finder.sections.map((section) => section.id);
    const endYear = Number(activation.slice(0, 4)) +
      (run.runWindow.start === "12-23" ? 1 : 0);
    for (
      const localDate of inclusiveDates(activation, `${endYear}-02-28`)
    ) {
      const stage = resolveRunStage(run, localDate);
      const seasonalZone = resolveSeasonalZone({
        river,
        run,
        stage,
        localDate,
      });
      const sections = resolveRiverSpotFinderRecommendedSections(
        finder,
        seasonalZone,
      );
      assertEquals(seasonalZone.status, "active", `${run.runId}/${localDate}`);
      assertEquals(
        sections.recommendedSections.map((section) => section.id),
        expectedSectionIds,
        `${run.runId}/${localDate}`,
      );
      assertEquals(
        sections.preferredStartSections.map((section) => section.id),
        preferredSectionIds,
        `${run.runId}/${localDate} preferred start`,
      );
      assertEquals(
        sections.viableWinterSections.map((section) => section.id),
        expectedSectionIds.filter((id) => !preferredSectionIds.includes(id)),
        `${run.runId}/${localDate} viable winter water`,
      );
      assertEquals(
        seasonalZone.winterHoldingGuidance?.activityScopeCopy,
        run.activity?.scopeCopy,
        `${run.runId}/${localDate} Activity scope`,
      );
      assertEquals(
        seasonalZone.winterHoldingGuidance?.allCorridorSectionsViable,
        true,
        `${run.runId}/${localDate} corridor viability`,
      );
      assertEquals(sections.otherSections, [], `${run.runId}/${localDate}`);
      assertEquals(
        sections.hasRecommendation,
        true,
        `${run.runId}/${localDate}`,
      );
    }
  }
});

Deno.test("winter presence never rises and remains separate from Activity", () => {
  for (const { run, activation } of profiles) {
    const year = Number(activation.slice(0, 4)) +
      (run.runWindow.start === "12-23" ? 1 : 0);
    const dates = inclusiveDates(activation, `${year}-02-28`);
    const scores = dates.map((date) => scoreFishInRiver(run, date).score!);
    for (let index = 1; index < scores.length; index++) {
      assert(scores[index] <= scores[index - 1], `${run.runId}: ${scores}`);
    }
    assertEquals(
      scoreFishInRiver(run, activation).label,
      "Retained winter presence",
    );
  }
});

function weather(
  date: string,
  cloudCoverPct: number,
  daylightStart = 8,
  daylightEnd = 17,
): ActivityWeatherHour[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
    cloud_cover_pct: cloudCoverPct,
    shortwave_w_m2: hour >= daylightStart && hour < daylightEnd
      ? Math.round(500 * (1 - cloudCoverPct / 125))
      : 0,
    clear_sky_shortwave_w_m2: hour >= daylightStart && hour < daylightEnd
      ? 500
      : 0,
    precipitation_in: 0,
    temperature_2m_f: 34,
    is_day: hour >= daylightStart && hour < daylightEnd ? 1 : 0,
  }));
}

function inclusiveDates(start: string, end: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${start}T12:00:00Z`);
  const final = new Date(`${end}T12:00:00Z`);
  while (cursor <= final) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

function activity(input: {
  temp: number | null;
  trend:
    | "neutral_missing"
    | "strong_cooling"
    | "cooling"
    | "neutral"
    | "warming"
    | "strong_warming";
  cloud?: number;
  flowBand?: "ideal" | "blown_out";
  temperatureFreshness?: "fresh" | "stale" | "missing";
}) {
  const run = BIG_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE;
  const date = "2027-01-20";
  return scoreActivity({
    rules: run.activity!,
    requestDate: date,
    targetDate: date,
    runStage: "building",
    staging: false,
    waterTempF: input.temp,
    waterTemperatureFreshness: input.temperatureFreshness ??
      (input.temp == null ? "missing" : "fresh"),
    temperatureTrend: input.trend,
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: input.flowBand ?? "ideal",
    currentHydraulicValue: 1550,
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: weather(date, input.cloud ?? 75),
    refreshSlot: "07:00",
    copyStrategy: run.runStageCopyStrategy,
  });
}

Deno.test("winter Activity prioritizes measured water temperature and sensible trend", () => {
  const warming = activity({ temp: 40, trend: "warming" });
  const stable = activity({ temp: 40, trend: "neutral" });
  const cooling = activity({ temp: 40, trend: "cooling" });
  const swing = activity({ temp: 40, trend: "strong_warming" });
  assertGreater(warming.score!, stable.score!);
  assertGreater(stable.score!, cooling.score!);
  assertGreater(warming.score!, swing.score!);
  assert(
    warming.detail.includes("Rain receives no independent positive score"),
  );
});

Deno.test("clouds rank daylight windows but cannot rescue near-freezing water", () => {
  const cloudy = activity({ temp: 40, trend: "neutral", cloud: 95 });
  const clear = activity({ temp: 40, trend: "neutral", cloud: 0 });
  const freezing = activity({ temp: 33, trend: "warming", cloud: 100 });
  assertGreater(cloudy.score!, clear.score!);
  assert(freezing.score! <= 29);
  assert(freezing.reasonCodes.includes("activity_winter_near_freezing_cap"));
});

Deno.test("winter Activity uses dynamic daylight blocks and conservative missing-data caps", () => {
  const result = activity({ temp: 40, trend: "neutral" });
  assertEquals(result.blocks.map((block) => block.id), [
    "08-11",
    "11-14",
    "14-17",
  ]);
  assert(result.blocks.every((block) => !block.label.includes("9 PM")));
  const noTemperature = activity({
    temp: null,
    trend: "neutral_missing",
    temperatureFreshness: "missing",
  });
  assert(noTemperature.score! <= 59);
  const staleTemperature = activity({
    temp: 40,
    trend: "warming",
    temperatureFreshness: "stale",
  });
  assert(staleTemperature.score! <= 59);
  const blownOut = activity({
    temp: 40,
    trend: "warming",
    flowBand: "blown_out",
  });
  assert(blownOut.score! <= 19);
});

Deno.test("tomorrow keeps forecast air temperature as context, never a water substitute", () => {
  const run = BIG_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE;
  const result = scoreActivity({
    rules: run.activity!,
    requestDate: "2027-01-19",
    targetDate: "2027-01-20",
    runStage: "building",
    staging: false,
    waterTempF: 40,
    waterTemperatureFreshness: "fresh",
    temperatureTrend: "neutral",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 1550,
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: weather("2027-01-20", 75),
    refreshSlot: "21:00",
  });
  assert(result.detail.includes("air temperature provides context only"));
  assert(result.detail.includes("does not convert air to water temperature"));
  assertEquals(result.confidence, "Moderate");
});

Deno.test("ice-affected USGS flow stays visible but is excluded from scoring", () => {
  const read = normalizeGaugeRead({
    observations: [{
      provider: "USGS",
      siteId: "04125550",
      observedAt: "2027-01-20T12:00:00.000Z",
      flow_cfs: 1500,
      qualifier: "P, Ice",
      source: "usgs_continuous_values",
    }],
    siteId: "04125550",
    primaryMetric: "flow_cfs",
    refreshAtUtc: "2027-01-20T13:00:00.000Z",
    maxAgeHours: 2,
  });
  assertEquals(read.current?.flow_cfs, 1500);
  assertEquals(read.gaugeFreshness, "missing");
  assertEquals(read.flowTrend.rawSignal, "unknown");
  assertEquals(read.fourHourSeries, []);
  assert(read.reasonCodes.includes("gauge_ice_affected"));
});

Deno.test("weather provider retains daylight and air temperature as labeled context", async () => {
  let requested = "";
  const snapshot = await fetchRiverRunWeatherSnapshot({
    lat: 44.2,
    lon: -86.2,
    fetchedAtUtc: "2027-01-20T12:00:00.000Z",
    fetchFn: async (input) => {
      requested = String(input);
      return {
        ok: true,
        json: async () => ({
          timezone: "America/Detroit",
          hourly: {
            time: ["2027-01-20T08:00"],
            precipitation: [0],
            cloud_cover: [80],
            shortwave_radiation: [40],
            shortwave_radiation_clear_sky: [200],
            temperature_2m: [29],
            is_day: [1],
          },
          daily: { time: ["2027-01-20"], precipitation_probability_max: [0] },
        }),
      };
    },
  });
  assert(requested.includes("temperature_2m"));
  assert(requested.includes("is_day"));
  assert(requested.includes("temperature_unit=fahrenheit"));
  assertEquals(snapshot?.hourly_activity_weather?.[0].temperature_2m_f, 29);
  assertEquals(snapshot?.hourly_activity_weather?.[0].is_day, 1);
});
