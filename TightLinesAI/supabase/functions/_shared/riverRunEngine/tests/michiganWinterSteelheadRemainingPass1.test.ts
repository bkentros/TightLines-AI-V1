import {
  assert,
  assertEquals,
  assertGreater,
  assertMatch,
} from "jsr:@std/assert";
import {
  resolveRiverSpotFinderRecommendedSections,
  riverRunSpotFinderForRiver,
} from "../../../../../lib/riverRunSpotFinder.ts";
import {
  type ActivityWeatherHour,
  type AuditedRiverRunProfile,
  BEAR_CREEK_FALL_STEELHEAD_RUN_PROFILE,
  BEAR_CREEK_MANISTEE_CONFIGURATION_DOCUMENT,
  BEAR_CREEK_MANISTEE_RIVER_PROFILE,
  BEAR_CREEK_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
  BETSIE_CONFIGURATION_DOCUMENT,
  BETSIE_FALL_STEELHEAD_RUN_PROFILE,
  BETSIE_RIVER_PROFILE,
  BETSIE_WINTER_STEELHEAD_RUN_PROFILE,
  isRunSeasonallyActive,
  PLATTE_CONFIGURATION_DOCUMENT,
  PLATTE_FALL_STEELHEAD_RUN_PROFILE,
  PLATTE_RIVER_PROFILE,
  PLATTE_WINTER_STEELHEAD_RUN_PROFILE,
  resolveRunStage,
  resolveSeasonalZone,
  type RiverProfile,
  ROGUE_MI_CONFIGURATION_DOCUMENT,
  ROGUE_MI_FALL_STEELHEAD_RUN_PROFILE,
  ROGUE_MI_RIVER_PROFILE,
  ROGUE_MI_WINTER_STEELHEAD_RUN_PROFILE,
  scoreActivity,
  scoreFishInRiver,
  validateConfigurationRevision,
  validateRunProfile,
  WHITE_CONFIGURATION_DOCUMENT,
  WHITE_FALL_STEELHEAD_RUN_PROFILE,
  WHITE_RIVER_PROFILE,
  WHITE_WINTER_STEELHEAD_RUN_PROFILE,
} from "../index.ts";

const cohort: Array<{
  run: AuditedRiverRunProfile;
  fall: AuditedRiverRunProfile;
  river: RiverProfile;
  activation: string;
  prior: string;
  mode: "measured_water" | "air_temperature_proxy";
  preferredSectionIds: string[];
}> = [
  {
    run: BETSIE_WINTER_STEELHEAD_RUN_PROFILE,
    fall: BETSIE_FALL_STEELHEAD_RUN_PROFILE,
    river: BETSIE_RIVER_PROFILE,
    activation: "2026-12-18",
    prior: "2026-12-17",
    mode: "air_temperature_proxy",
    preferredSectionIds: ["betsie_us31_homestead"],
  },
  {
    run: BEAR_CREEK_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
    fall: BEAR_CREEK_FALL_STEELHEAD_RUN_PROFILE,
    river: BEAR_CREEK_MANISTEE_RIVER_PROFILE,
    activation: "2027-01-01",
    prior: "2026-12-31",
    mode: "air_temperature_proxy",
    preferredSectionIds: ["bear_creek_upper_access"],
  },
  {
    run: ROGUE_MI_WINTER_STEELHEAD_RUN_PROFILE,
    fall: ROGUE_MI_FALL_STEELHEAD_RUN_PROFILE,
    river: ROGUE_MI_RIVER_PROFILE,
    activation: "2027-01-01",
    prior: "2026-12-31",
    mode: "air_temperature_proxy",
    preferredSectionIds: ["rogue_upper_access"],
  },
  {
    run: PLATTE_WINTER_STEELHEAD_RUN_PROFILE,
    fall: PLATTE_FALL_STEELHEAD_RUN_PROFILE,
    river: PLATTE_RIVER_PROFILE,
    activation: "2026-12-16",
    prior: "2026-12-15",
    mode: "air_temperature_proxy",
    preferredSectionIds: ["platte_weir_access"],
  },
  {
    run: WHITE_WINTER_STEELHEAD_RUN_PROFILE,
    fall: WHITE_FALL_STEELHEAD_RUN_PROFILE,
    river: WHITE_RIVER_PROFILE,
    activation: "2026-12-29",
    prior: "2026-12-28",
    mode: "measured_water",
    preferredSectionIds: ["white_upper"],
  },
];

Deno.test("remaining Michigan winter profiles validate with their exact source modes", () => {
  for (const { run, river, mode } of cohort) {
    const result = validateRunProfile(run, river);
    assertEquals(
      result.valid,
      true,
      `${run.runId}: ${JSON.stringify(result.issues)}`,
    );
    assertEquals(result.publicVisible, true);
    assertEquals(run.runType, "holding");
    assertEquals(run.movementEngineId, "stable_cool_holding");
    assertEquals(run.activity?.profile, "steelhead_winter_holding");
    assertEquals(run.activity?.winterTemperatureMode, mode);
    assertEquals(run.primitiveCapabilities.push.status, "unavailable");
    assertEquals(
      run.primitiveCapabilities.migrationTiming.status,
      "unavailable",
    );
    assertEquals("push" in run, false);
    assertEquals("conditionsSuggest" in run, false);
    assert(run.activity?.inputReach);
    if (mode === "measured_water") {
      assert(run.waterTemperature);
      assert(run.fishabilityBands);
      assert(run.baselineCoverage);
    } else {
      assertEquals(run.waterTemperature, undefined);
      assertEquals(run.activity?.confidenceCeiling, "Limited");
    }
  }
});

Deno.test("all five configuration documents publish winter biology and validate", () => {
  for (
    const document of [
      BETSIE_CONFIGURATION_DOCUMENT,
      BEAR_CREEK_MANISTEE_CONFIGURATION_DOCUMENT,
      ROGUE_MI_CONFIGURATION_DOCUMENT,
      PLATTE_CONFIGURATION_DOCUMENT,
      WHITE_CONFIGURATION_DOCUMENT,
    ]
  ) {
    assert(document.runs.some((run) => run.runId.endsWith("winter_steelhead")));
    assert(
      document.biologyProfiles.some((profile) =>
        profile.biologyProfileId === "great_lakes_steelhead_winter_holding_v1"
      ),
    );
    assert(document.movementEngineVersion.includes("stable-cool-holding"));
    const issues = validateConfigurationRevision({
      configKey: `${document.river.riverId}-winter-remaining-pass1-test`,
      revision: 1,
      status: "published",
      evidenceNotes: "Remaining Michigan Winter Steelhead Pass 1 fixture.",
      document,
    });
    assertEquals(
      issues,
      [],
      `${document.river.riverId}: ${JSON.stringify(issues)}`,
    );
  }
});

Deno.test("fall and winter handoffs are exact and never overlap", () => {
  for (const { run, fall, activation, prior } of cohort) {
    assertEquals(isRunSeasonallyActive(fall, prior), true, fall.runId);
    assertEquals(isRunSeasonallyActive(run, prior), false, run.runId);
    assertEquals(scoreFishInRiver(run, prior).score, null);
    assertEquals(isRunSeasonallyActive(fall, activation), false, fall.runId);
    assertEquals(isRunSeasonallyActive(run, activation), true, run.runId);
    assertEquals(resolveRunStage(run, activation).label, "Winter transition");
    assert(scoreFishInRiver(run, activation).score != null);
  }
});

Deno.test("every winter date has the intended phase and non-rising retained presence", () => {
  for (const { run, activation } of cohort) {
    const dates = inclusiveDates(activation, "2027-02-28");
    let previous = Number.POSITIVE_INFINITY;
    for (const date of dates) {
      const stage = resolveRunStage(run, date);
      const expected = date <= "2027-01-07"
        ? "Winter transition"
        : date < "2027-02-15"
        ? "Core winter hold"
        : "Spring approach";
      assertEquals(stage.label, expected, `${run.runId}/${date}`);
      assertEquals(stage.winterHoldingContext, true);
      const presence = scoreFishInRiver(run, date);
      assertEquals(presence.label, "Retained winter presence");
      assert(presence.score != null);
      assert(presence.score <= previous, `${run.runId}/${date}`);
      previous = presence.score;
    }
    assertEquals(
      resolveRunStage(run, "2027-03-01").label,
      "Winter holding complete",
    );
    assertEquals(isRunSeasonallyActive(run, "2027-03-01"), false);
    assertEquals(scoreFishInRiver(run, "2027-03-01").score, null);
  }
});

Deno.test("air proxy rewards stable warmth and gradual warm-ups but penalizes cold and swings", () => {
  for (
    const { run } of cohort.filter(({ mode }) =>
      mode === "air_temperature_proxy"
    )
  ) {
    const stableMild = proxyActivity(run, [36, 36, 36, 36], 75);
    const gradualWarm = proxyActivity(run, [27, 30, 33, 36], 75);
    const stableCold = proxyActivity(run, [17, 17, 17, 17], 75);
    const largeSwing = proxyActivity(run, [18, 40, 19, 39], 75);
    assert(stableMild.score != null && gradualWarm.score != null);
    assert(stableCold.score != null && largeSwing.score != null);
    assertGreater(stableMild.score, stableCold.score, run.runId);
    assertGreater(gradualWarm.score, stableCold.score, run.runId);
    assertGreater(stableMild.score, largeSwing.score, run.runId);
    assertEquals(stableMild.confidence, "Limited");
    assert(
      stableMild.score <= (run.activity?.dataMode === "weather_only" ? 64 : 69),
    );
    assertMatch(
      stableMild.detail,
      /never reported or treated as measured water temperature/i,
    );
  }
});

Deno.test("clouds improve time windows while rain receives no independent winter credit", () => {
  for (
    const { run } of cohort.filter(({ mode }) =>
      mode === "air_temperature_proxy"
    )
  ) {
    const clear = proxyActivity(run, [28, 28, 28, 28], 0, 0);
    const cloudy = proxyActivity(run, [28, 28, 28, 28], 90, 0);
    const rainy = proxyActivity(run, [28, 28, 28, 28], 90, 0.08);
    assert(clear.score != null && cloudy.score != null && rainy.score != null);
    assertGreater(cloudy.score, clear.score, run.runId);
    assertEquals(rainy.score, cloudy.score, run.runId);
    assertMatch(rainy.detail, /Rain receives no independent positive score/);
  }
});

Deno.test("proxy pathways fail closed without a usable multi-day temperature pattern", () => {
  for (
    const { run } of cohort.filter(({ mode }) =>
      mode === "air_temperature_proxy"
    )
  ) {
    const result = scoreActivity({
      ...baseActivityInput(run),
      hourlyWeather: oneDayWeather("2027-01-20", 36, 70),
    });
    assertEquals(result.score, null, run.runId);
    assertEquals(result.label, "Unavailable");
    assertMatch(result.detail, /multi-day air-temperature pattern/i);
  }
});

Deno.test("Rogue measured flow matters, fails conservatively, and never becomes whole-river truth", () => {
  const ideal = proxyActivity(ROGUE_MI_WINTER_STEELHEAD_RUN_PROFILE, [
    32,
    34,
    36,
    38,
  ], 80);
  const blown = proxyActivity(
    ROGUE_MI_WINTER_STEELHEAD_RUN_PROFILE,
    [32, 34, 36, 38],
    80,
    0,
    "blown_out",
  );
  const missing = proxyActivity(
    ROGUE_MI_WINTER_STEELHEAD_RUN_PROFILE,
    [32, 34, 36, 38],
    80,
    0,
    "ideal",
    "missing",
  );
  assert(ideal.score != null && blown.score != null && missing.score != null);
  assertGreater(ideal.score, blown.score);
  assert(blown.score <= 19);
  assert(missing.score <= 59);
  assertMatch(ideal.detail, /lower Rogue|Packer Drive/i);
});

Deno.test("White retains measured-water priority, cold caps, and warming benefit", () => {
  const suitableWarming = measuredActivity(40, "warming", 85, "ideal");
  const suitableStable = measuredActivity(40, "neutral", 85, "ideal");
  const nearFreezing = measuredActivity(33, "warming", 100, "ideal");
  const blown = measuredActivity(40, "warming", 100, "blown_out");
  assert(suitableWarming.score != null && suitableStable.score != null);
  assert(nearFreezing.score != null && blown.score != null);
  assertGreater(suitableWarming.score, suitableStable.score);
  assert(nearFreezing.score <= 29);
  assert(blown.score <= 19);
  assertMatch(suitableWarming.detail, /measured-water warm-up/i);
});

Deno.test("Spot Finder keeps every audited winter section and only prioritizes starting water", () => {
  for (const { run, river, activation, preferredSectionIds } of cohort) {
    const finder = riverRunSpotFinderForRiver(run.riverId, "steelhead", "MI");
    assert(finder, `${run.runId} lacks a Steelhead Spot Finder`);
    const expected = finder.sections.map((section) => section.id);
    const finderReachIds = [
      ...new Set(
        finder.sections.flatMap((section) => section.foundationReachIds),
      ),
    ].toSorted();
    const fullWinterCorridor = [
      ...new Set(
        Object.values(run.seasonalZonePlan!.phases).flat(),
      ),
    ].toSorted();
    assertEquals(
      finderReachIds,
      fullWinterCorridor,
      `${run.runId} Spot Finder must cover every supported winter reach`,
    );
    for (const date of inclusiveDates(activation, "2027-02-28")) {
      const zone = resolveSeasonalZone({
        river,
        run,
        stage: resolveRunStage(run, date),
        localDate: date,
      });
      const resolved = resolveRiverSpotFinderRecommendedSections(finder, zone);
      assertEquals(
        resolved.recommendedSections.map((section) => section.id),
        expected,
      );
      assertEquals(
        resolved.preferredStartSections.map((section) => section.id),
        preferredSectionIds,
      );
      assertEquals(
        resolved.viableWinterSections.map((section) => section.id),
        expected.filter((id) => !preferredSectionIds.includes(id)),
      );
      assertEquals(resolved.otherSections, []);
      assertEquals(zone.winterHoldingGuidance?.allCorridorSectionsViable, true);
    }
  }
});

Deno.test("Platte access inventory is complete, official, and closure-safe", () => {
  const finder = riverRunSpotFinderForRiver("platte", "steelhead", "MI");
  assert(finder);
  assertEquals(finder.sections.map((section) => section.foundationReachIds), [
    ["platte_lower_entry"],
    ["platte_weir_approach"],
  ]);
  assertEquals(finder.sections.flatMap((section) => section.spots).length, 3);
  for (const spot of finder.sections.flatMap((section) => section.spots)) {
    assertEquals(spot.sourceLabel, "National Park Service");
    assert(spot.sourceUrl.startsWith("https://www.nps.gov/"));
  }
  const weir = finder.sections[1].spots[0];
  assertMatch(weir.caution ?? "", /closed within 300 feet|closure/i);
  assertMatch(finder.orientationNote, /Honor.*excluded/i);
});

function proxyActivity(
  run: AuditedRiverRunProfile,
  dailyTemperatures: [number, number, number, number],
  cloud: number,
  precipitation = 0,
  flowBand: "ideal" | "blown_out" = "ideal",
  gaugeFreshness: "fresh" | "missing" = "fresh",
) {
  const dates = ["2027-01-17", "2027-01-18", "2027-01-19", "2027-01-20"];
  const hourlyWeather = dates.flatMap((date, index) =>
    oneDayWeather(date, dailyTemperatures[index], cloud, precipitation)
  );
  const bands = run.fishabilityBands;
  return scoreActivity({
    ...baseActivityInput(run),
    gaugeFreshness,
    flowBand: bands ? flowBand : undefined,
    currentHydraulicValue: bands
      ? (bands.ideal.min + bands.ideal.max) / 2
      : null,
    fishabilityBands: bands,
    hourlyWeather,
  });
}

function measuredActivity(
  waterTempF: number,
  temperatureTrend: "warming" | "neutral",
  cloud: number,
  flowBand: "ideal" | "blown_out",
) {
  const run = WHITE_WINTER_STEELHEAD_RUN_PROFILE;
  const bands = run.fishabilityBands!;
  return scoreActivity({
    ...baseActivityInput(run),
    waterTempF,
    waterTemperatureFreshness: "fresh",
    temperatureTrend,
    gaugeFreshness: "fresh",
    flowBand,
    currentHydraulicValue: (bands.ideal.min + bands.ideal.max) / 2,
    fishabilityBands: bands,
    hourlyWeather: oneDayWeather("2027-01-20", 34, cloud),
  });
}

function baseActivityInput(run: AuditedRiverRunProfile) {
  return {
    rules: run.activity!,
    requestDate: "2027-01-20",
    targetDate: "2027-01-20",
    runStage: "building" as const,
    staging: false,
    waterTempF: null,
    waterTemperatureFreshness: "missing" as const,
    temperatureTrend: "neutral_missing" as const,
    gaugeFreshness: "missing" as const,
    weatherFreshness: "fresh" as const,
    flowSignal: "stable" as const,
    hourlyWeather: [] as ActivityWeatherHour[],
    refreshSlot: "07:00",
    copyStrategy: run.runStageCopyStrategy,
  };
}

function oneDayWeather(
  date: string,
  temperatureF: number,
  cloud: number,
  precipitation = 0,
): ActivityWeatherHour[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
    cloud_cover_pct: cloud,
    shortwave_w_m2: hour >= 8 && hour < 17
      ? Math.round(500 * (1 - cloud / 125))
      : 0,
    clear_sky_shortwave_w_m2: hour >= 8 && hour < 17 ? 500 : 0,
    precipitation_in: precipitation,
    temperature_2m_f: temperatureF,
    is_day: hour >= 8 && hour < 17 ? 1 : 0,
  }));
}

function inclusiveDates(start: string, end: string): string[] {
  const dates: string[] = [];
  for (
    let cursor = new Date(`${start}T12:00:00Z`);
    cursor <= new Date(`${end}T12:00:00Z`);
    cursor = new Date(cursor.getTime() + 86_400_000)
  ) {
    dates.push(cursor.toISOString().slice(0, 10));
  }
  return dates;
}
