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
  addDays,
  isRunSeasonallyActive,
  resolveRunStage,
  resolveSeasonalZone,
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  scoreActivity,
  scoreFishInRiver,
  validateConfigurationRevision,
  validateRunProfile,
  WISCONSIN_WINTER_CONFIGURATION_DOCUMENTS,
  WISCONSIN_WINTER_PASS1_DECISIONS,
  WISCONSIN_WINTER_PASS1_EXCLUSIONS,
  WISCONSIN_WINTER_RUN_PROFILES,
} from "../index.ts";
import type { ActivityWeatherHour, AuditedRiverRunProfile } from "../index.ts";

const runs = WISCONSIN_WINTER_RUN_PROFILES;
const rivers = new Map(
  RIVER_RUN_RIVER_PROFILES.map((river) => [river.riverId, river]),
);
const allRuns = new Map(
  RIVER_RUN_RUN_PROFILES.map((run) => [run.runId, run]),
);

Deno.test("Wisconsin Pass 3 validates all ten winter profiles and five combined documents", () => {
  assertEquals(runs.length, 10);
  assertEquals(WISCONSIN_WINTER_CONFIGURATION_DOCUMENTS.length, 5);
  assertEquals(new Set(runs.map((run) => run.riverId)).size, 5);
  assertEquals(
    runs.filter((run) => run.species === "steelhead").length,
    5,
  );
  assertEquals(
    runs.filter((run) => run.species === "lake_run_brown_trout").length,
    5,
  );
  for (const run of runs) {
    const result = validateRunProfile(run, rivers.get(run.riverId));
    assertEquals(
      result.valid,
      true,
      `${run.runId}: ${JSON.stringify(result.issues)}`,
    );
    assertEquals(result.publicVisible, true, run.runId);
  }
  for (const document of WISCONSIN_WINTER_CONFIGURATION_DOCUMENTS) {
    const errors = validateConfigurationRevision({
      configKey: document.river.riverId,
      revision: 1,
      status: "published",
      evidenceNotes: "Pass 3 test",
      document,
    }).filter((issue) => issue.severity === "error");
    assertEquals(errors, [], document.river.riverId);
  }
});

Deno.test("fall and winter pathways hand off on adjacent dates with no overlap", () => {
  for (const river of WISCONSIN_WINTER_PASS1_DECISIONS) {
    for (const decision of river.species) {
      const fall = allRuns.get(decision.fallRunId)!;
      const winter = allRuns.get(decision.futureRunId)!;
      assert(fall && winter, decision.futureRunId);
      assertEquals(winter.runWindow.start, nextMonthDay(fall.runWindow.end));
      const activation = dated(winter.runWindow.start);
      const prior = addDays(activation, -1);
      assertEquals(isRunSeasonallyActive(fall, prior), true, fall.runId);
      assertEquals(isRunSeasonallyActive(winter, prior), false, winter.runId);
      assertEquals(isRunSeasonallyActive(fall, activation), false, fall.runId);
      assertEquals(
        isRunSeasonallyActive(winter, activation),
        true,
        winter.runId,
      );
      assertEquals(isRunSeasonallyActive(winter, "2027-02-28"), true);
      assertEquals(isRunSeasonallyActive(winter, "2027-03-01"), false);
    }
  }
});

Deno.test("winter pathways expose holding primitives without Push or Migration Timing", () => {
  for (const run of runs) {
    assertEquals(run.runType, "holding");
    assertEquals(run.movementEngineId, "stable_cool_holding");
    assertEquals(run.primitiveCapabilities.activity.status, "available");
    assertEquals(run.primitiveCapabilities.fishInRiver.status, "available");
    assertEquals(run.primitiveCapabilities.migrationStage.status, "available");
    assertEquals(run.primitiveCapabilities.push.status, "unavailable");
    assertEquals(
      run.primitiveCapabilities.migrationTiming.status,
      "unavailable",
    );
    assertEquals(run.push, undefined);
    assertEquals(run.conditionsSuggest, undefined);
    assertEquals(run.runWindow.end, "02-28");
  }
});

Deno.test("presence carries the fall endpoint forward without rising or extending into March", () => {
  for (const run of runs) {
    const start = dated(run.runWindow.start);
    const year = Number(start.slice(0, 4)) +
      (run.runWindow.start.startsWith("12-") ? 1 : 0);
    const dates = inclusiveDates(start, `${year}-02-28`);
    const values = dates.map((date) => scoreFishInRiver(run, date).score!);
    assert(values.every((value) => value != null), run.runId);
    for (let index = 1; index < values.length; index++) {
      assert(
        values[index] <= values[index - 1],
        `${run.runId}/${dates[index]}`,
      );
    }
    assertEquals(scoreFishInRiver(run, `${year}-03-01`).score, null);
    assertEquals(scoreFishInRiver(run, addDays(start, -1)).score, null);
  }
});

Deno.test("winter copy is species-correct across pre-run, core hold, and spring approach", () => {
  for (const run of runs) {
    const pre = resolveRunStage(run, addDays(dated(run.runWindow.start), -1));
    const core = resolveRunStage(run, "2027-01-30");
    const approach = resolveRunStage(run, "2027-02-20");
    assertEquals(pre.label, "Not active yet");
    assertEquals(core.label, "Core winter hold");
    assertEquals(approach.label, "Spring approach");
    const copy = [pre, core, approach]
      .map((item) => `${item.headline} ${item.detail} ${item.tip}`)
      .join(" ");
    if (run.species === "lake_run_brown_trout") {
      assertMatch(copy, /Brown Trout/);
      assert(!/Winter Steelhead/.test(copy), run.runId);
      assertMatch(approach.detail, /does not invent a spring Brown Trout run/i);
    } else {
      assertMatch(copy, /Steelhead/);
      assert(!/Winter Brown Trout/.test(copy), run.runId);
      assertMatch(approach.detail, /does not infer spring/i);
    }
    assert(!/\bRiver\s+(Steelhead|Brown Trout)/.test(copy), run.runId);
  }
});

Deno.test("Spot Finder retains each accepted corridor and separates preferred starts from viable alternatives", () => {
  for (const run of runs) {
    const river = rivers.get(run.riverId)!;
    const finder = riverRunSpotFinderForRiver(run.riverId, run.species, "WI");
    assert(finder, run.runId);
    const date = "2027-01-30";
    const zone = resolveSeasonalZone({
      river,
      run,
      stage: resolveRunStage(run, date),
      localDate: date,
    });
    const result = resolveRiverSpotFinderRecommendedSections(finder, zone);
    const expected = finder.sections.filter((section) =>
      section.foundationReachIds.some((reachId) =>
        run.seasonalZoneReachIds?.includes(reachId)
      )
    );
    const preferredReachIds = new Set(
      run.seasonalZonePlan!.winterHoldingGuidance!.preferredStartReachIds,
    );
    const expectedPreferred = expected.filter((section) =>
      section.foundationReachIds.some((reachId) =>
        preferredReachIds.has(reachId)
      )
    );
    assertEquals(
      result.recommendedSections.map((section) => section.id),
      expected.map((section) => section.id),
      run.runId,
    );
    assertEquals(
      result.preferredStartSections.map((section) => section.id),
      expectedPreferred.map((section) => section.id),
      run.runId,
    );
    assertEquals(
      result.viableWinterSections.length,
      expected.length - expectedPreferred.length,
      run.runId,
    );
    assertEquals(zone.winterHoldingGuidance?.allCorridorSectionsViable, true);
    assertEquals(
      zone.winterHoldingGuidance?.activityScopeCopy,
      run.activity?.scopeCopy,
    );
  }
  const manitowoc = runs.find((run) =>
    run.runId === "manitowoc_winter_steelhead"
  )!;
  assertEquals(
    manitowoc.seasonalZoneReachIds?.includes("manitowoc_upper_corridor"),
    false,
  );
});

Deno.test("measured-water pathways favor suitable gradual warming and enforce hard winter caps", () => {
  for (
    const run of runs.filter((candidate) =>
      candidate.activity?.winterTemperatureMode === "measured_water"
    )
  ) {
    const favorable = measuredActivity(run, 41, "warming", "ideal");
    const stable = measuredActivity(run, 41, "neutral", "ideal");
    const swing = measuredActivity(run, 41, "strong_warming", "ideal");
    const freezing = measuredActivity(run, 33, "warming", "ideal");
    const blown = measuredActivity(run, 41, "warming", "blown_out");
    assertGreater(favorable.score!, stable.score!, run.runId);
    assertGreater(stable.score!, swing.score!, run.runId);
    assert(freezing.blocks.every((block) => block.score <= 29), run.runId);
    assert(blown.blocks.every((block) => block.score <= 19), run.runId);
    assertEquals(favorable.confidence, "Full");
    assertMatch(favorable.detail, /measured-water warm-up/i);
  }
});

Deno.test("air-proxy pathways favor stable warmth and gradual warmups but stay Limited and penalize cold or swings", () => {
  for (
    const run of runs.filter((candidate) =>
      candidate.activity?.winterTemperatureMode === "air_temperature_proxy"
    )
  ) {
    const cold = proxyActivity(run, [18, 18, 19, 19]);
    const mild = proxyActivity(run, [34, 35, 35, 36]);
    const warming = proxyActivity(run, [29, 31, 33, 35]);
    const swing = proxyActivity(run, [20, 42, 21, 44]);
    assertGreater(mild.score!, cold.score!, run.runId);
    assertGreater(warming.score!, swing.score!, run.runId);
    assertEquals(mild.confidence, "Limited", run.runId);
    assert(
      mild.score! <= (run.activity!.dataMode === "weather_only" ? 64 : 69),
    );
    assertMatch(
      mild.detail,
      /never reported or treated as measured water temperature/i,
    );
    assertMatch(mild.detail, /Rain receives no independent positive score/i);
  }
});

Deno.test("cloud cover ranks daylight windows without overriding thermal constraints", () => {
  for (const run of runs) {
    const result = run.activity!.winterTemperatureMode === "measured_water"
      ? measuredActivity(run, 41, "neutral", "ideal", [0, 100, 0])
      : proxyActivity(run, [34, 35, 35, 36], [0, 100, 0]);
    assertEquals(result.blocks.length, 3, run.runId);
    const scores = result.blocks.map((block) => block.score);
    assertGreater(Math.max(...scores), Math.min(...scores), run.runId);
    assertEquals(result.blocks[1].cloudCoverPct, 100, run.runId);
  }
});

Deno.test("five-season replay artifacts cover every pathway and pass all invariants", async () => {
  for (const run of runs) {
    const path = new URL(
      `../../../../../docs/audits/river-run-${
        run.runId.replaceAll("_", "-")
      }-activity-replay.json`,
      import.meta.url,
    );
    const report = JSON.parse(await Deno.readTextFile(path)) as {
      runId: string;
      replayYears: string;
      expectedDays: number;
      usableDays: number;
      reviewSampleSize: number;
      dayScore: { median: number };
      counterfactuals: Record<string, number>;
      invariants: Record<string, number>;
    };
    assertEquals(report.runId, run.runId);
    assertEquals(report.replayYears, "2021-2025");
    assert(report.usableDays / report.expectedDays >= .8, run.runId);
    assertEquals(report.reviewSampleSize, 100, run.runId);
    assert(report.dayScore.median <= 59, run.runId);
    assertGreater(
      report.counterfactuals.favorable,
      report.counterfactuals.cold,
    );
    assertGreater(
      report.counterfactuals.gradualWarming,
      report.counterfactuals.largeSwing,
    );
    assertEquals(Object.values(report.invariants).filter(Boolean), []);
  }
});

Deno.test("Bois Brule remains excluded because the supported downstream season closes November 15", () => {
  const exclusion = WISCONSIN_WINTER_PASS1_EXCLUSIONS.find((item) =>
    item.riverId === "bois_brule"
  );
  assert(exclusion);
  assertMatch(exclusion.evidenceNotes, /November 15|closes/i);
  assertEquals(runs.some((run) => run.riverId === "bois_brule"), false);
});

function measuredActivity(
  run: AuditedRiverRunProfile,
  temp: number,
  trend: "neutral" | "warming" | "strong_warming",
  flowBand: "ideal" | "blown_out",
  cloudBySegment: [number, number, number] = [70, 70, 70],
) {
  const date = "2027-01-20";
  return scoreActivity({
    rules: run.activity!,
    requestDate: date,
    targetDate: date,
    runStage: "building",
    staging: false,
    waterTempF: temp,
    waterTemperatureFreshness: "fresh",
    temperatureTrend: trend,
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand,
    currentHydraulicValue: midpoint(run),
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: weather(date, 34, cloudBySegment),
    copyStrategy: run.runStageCopyStrategy,
  });
}

function proxyActivity(
  run: AuditedRiverRunProfile,
  temperatures: [number, number, number, number],
  cloudBySegment: [number, number, number] = [70, 70, 70],
) {
  const date = "2027-01-20";
  const dates = ["2027-01-17", "2027-01-18", "2027-01-19", date];
  return scoreActivity({
    rules: run.activity!,
    requestDate: date,
    targetDate: date,
    runStage: "building",
    staging: false,
    waterTempF: null,
    waterTemperatureFreshness: "missing",
    temperatureTrend: "neutral_missing",
    gaugeFreshness: run.fishabilityBands ? "fresh" : "missing",
    weatherFreshness: "fresh",
    flowBand: run.fishabilityBands ? "ideal" : undefined,
    currentHydraulicValue: run.fishabilityBands ? midpoint(run) : null,
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: dates.flatMap((item, index) =>
      weather(item, temperatures[index], cloudBySegment)
    ),
    copyStrategy: run.runStageCopyStrategy,
  });
}

function weather(
  date: string,
  temperatureF: number,
  cloudBySegment: [number, number, number],
): ActivityWeatherHour[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const isDay = hour >= 8 && hour < 17;
    const segment = hour < 11 ? 0 : hour < 14 ? 1 : 2;
    const cloud = cloudBySegment[segment];
    return {
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: cloud,
      shortwave_w_m2: isDay ? Math.round(500 * (1 - cloud / 125)) : 0,
      clear_sky_shortwave_w_m2: isDay ? 500 : 0,
      precipitation_in: 0,
      temperature_2m_f: temperatureF + Math.sin(hour / 24 * Math.PI * 2) * 3,
      is_day: isDay ? 1 : 0,
    };
  });
}

function midpoint(run: AuditedRiverRunProfile): number {
  const ideal = run.fishabilityBands!.ideal;
  return (ideal.min + ideal.max) / 2;
}

function dated(monthDay: string): string {
  return `${monthDay.startsWith("12-") ? 2026 : 2027}-${monthDay}`;
}

function nextMonthDay(value: string): string {
  const [month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(2000, month - 1, day + 1));
  return `${String(date.getUTCMonth() + 1).padStart(2, "0")}-${
    String(date.getUTCDate()).padStart(2, "0")
  }`;
}

function inclusiveDates(start: string, end: string): string[] {
  const dates: string[] = [];
  for (let date = start; date <= end; date = addDays(date, 1)) dates.push(date);
  return dates;
}
