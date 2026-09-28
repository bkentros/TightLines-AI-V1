import {
  assert,
  assertEquals,
  assertGreater,
  assertMatch,
} from "jsr:@std/assert";
import {
  type ActivityWeatherHour,
  type AuditedRiverRunProfile,
  BEAR_CREEK_MANISTEE_CONFIGURATION_DOCUMENT,
  BEAR_CREEK_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
  BETSIE_CONFIGURATION_DOCUMENT,
  BETSIE_WINTER_STEELHEAD_RUN_PROFILE,
  isRunSeasonallyActive,
  PLATTE_CONFIGURATION_DOCUMENT,
  PLATTE_WINTER_STEELHEAD_RUN_PROFILE,
  ROGUE_MI_CONFIGURATION_DOCUMENT,
  ROGUE_MI_WINTER_STEELHEAD_RUN_PROFILE,
  scoreActivity,
  WHITE_CONFIGURATION_DOCUMENT,
  WHITE_WINTER_STEELHEAD_RUN_PROFILE,
} from "../index.ts";

const runs = [
  BETSIE_WINTER_STEELHEAD_RUN_PROFILE,
  BEAR_CREEK_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
  ROGUE_MI_WINTER_STEELHEAD_RUN_PROFILE,
  PLATTE_WINTER_STEELHEAD_RUN_PROFILE,
  WHITE_WINTER_STEELHEAD_RUN_PROFILE,
];

const documents = [
  BETSIE_CONFIGURATION_DOCUMENT,
  BEAR_CREEK_MANISTEE_CONFIGURATION_DOCUMENT,
  ROGUE_MI_CONFIGURATION_DOCUMENT,
  PLATTE_CONFIGURATION_DOCUMENT,
  WHITE_CONFIGURATION_DOCUMENT,
];

type Group = {
  days: number;
  scores: { median: number | null; max: number | null };
};

type Replay = {
  runId: string;
  mode: "air_temperature_proxy" | "measured_water";
  replayYears: string;
  expectedDays: number;
  usableDays: number;
  reviewSampleSize: number;
  dayLabels: Record<string, number>;
  byAirPattern: Record<string, Group> | null;
  byMeasuredWaterBand: Record<string, Group> | null;
  byFlowBand: Record<string, Group> | null;
  cloudWindowAudit: {
    daysWithAtLeast40PointCloudContrast: number;
    cloudierLower: number;
  };
  spread: { max: number | null };
  invariants: Record<string, number>;
};

Deno.test("remaining Pass 2 historical reports accept all five source contracts", async () => {
  let expected = 0;
  let usable = 0;
  for (const run of runs) {
    const slug = run.riverId.replaceAll("_", "-");
    const path = new URL(
      `../../../../../docs/audits/river-run-${slug}-winter-steelhead-remaining-pass2-replay.json`,
      import.meta.url,
    );
    const report = JSON.parse(await Deno.readTextFile(path)) as Replay;
    assertEquals(report.runId, run.runId);
    assertEquals(
      report.replayYears,
      run.riverId === "white" ? "2022-2025" : "2021-2025",
    );
    assert(report.usableDays / report.expectedDays >= .95, run.runId);
    assertEquals(report.reviewSampleSize, 100);
    assertEquals(
      Object.values(report.invariants).filter((count) => count !== 0),
      [],
      run.runId,
    );
    assert(report.cloudWindowAudit.daysWithAtLeast40PointCloudContrast > 0);
    assertEquals(report.cloudWindowAudit.cloudierLower, 0);
    assert((report.spread.max ?? 0) >= 5 && (report.spread.max ?? 99) <= 12);
    assertMatch(run.publicAudit.notes ?? "", /Pass 2 acceptance/);
    assertMatch(run.researchNotes ?? "", /historical replay/i);
    assert(
      !/pending Pass 2|remain Pass 1 hypotheses/i.test(run.sourceNotes ?? ""),
    );

    if (report.mode === "air_temperature_proxy") {
      const warming = report.byAirPattern!.gradual_warming;
      const cold = report.byAirPattern!.persistent_cold;
      const swing = report.byAirPattern!.large_swing;
      assertGreater(warming.scores.median!, cold.scores.median!, run.runId);
      assertGreater(warming.scores.median!, swing.scores.median!, run.runId);
      assert((cold.scores.max ?? 100) <= 39);
      assert((swing.scores.max ?? 100) <= 39);
      assertEquals(report.dayLabels["Highly active"] ?? 0, 0);
      assert((report.dayLabels.Active ?? 0) / report.usableDays < .5);
    } else {
      const useful = report.byMeasuredWaterBand!["38To45F"];
      const freezing = report.byMeasuredWaterBand!.atOrBelow33_5F;
      assertGreater(useful.scores.median!, freezing.scores.median!);
      assert((freezing.scores.max ?? 100) <= 29);
    }
    expected += report.expectedDays;
    usable += report.usableDays;
  }
  assert(usable / expected >= .98);
});

Deno.test("remaining Pass 2 aggregate acceptance is current and complete", async () => {
  const path = new URL(
    "../../../../../docs/audits/river-run-michigan-winter-steelhead-remaining-pass2-review.json",
    import.meta.url,
  );
  const audit = JSON.parse(await Deno.readTextFile(path)) as {
    status: string;
    replay: {
      expectedRiverDays: number;
      usableRiverDays: number;
      scoredDaylightBlocks: number;
      stratifiedReviewRows: number;
      invariantFailures: unknown[];
    };
    acceptance: Record<string, boolean>;
  };
  assertEquals(audit.status, "accepted");
  assertEquals(audit.replay.expectedRiverDays, 1578);
  assertEquals(audit.replay.usableRiverDays, 1562);
  assertEquals(audit.replay.scoredDaylightBlocks, 4686);
  assertEquals(audit.replay.stratifiedReviewRows, 500);
  assertEquals(audit.replay.invariantFailures, []);
  assertEquals(Object.values(audit.acceptance).every(Boolean), true);
});

Deno.test("remaining configuration and public audit versions are promoted to Pass 2", () => {
  for (const document of documents) {
    assertMatch(document.configVersion, /winter-steelhead-pass2-v1/);
    const winter = document.runs.find((run) =>
      run.species === "steelhead" && run.season === "winter"
    );
    assert(winter, document.river.riverId);
    assertMatch(
      winter.publicAudit.auditVersion ?? "",
      /winter-steelhead-pass2-v1/,
    );
  }
});

Deno.test("remaining fall-to-winter handoffs stay exact across normal and leap years", () => {
  for (const document of documents) {
    const fall = document.runs.find((run) =>
      run.species === "steelhead" && run.season === "fall"
    )!;
    const winter = document.runs.find((run) =>
      run.species === "steelhead" && run.season === "winter"
    )!;
    for (let year = 2026; year <= 2030; year++) {
      const activation = `${year}-${winter.runWindow.start}`;
      const prior = shiftDate(activation, -1);
      const endYear = winter.runWindow.end < winter.runWindow.start
        ? year + 1
        : year;
      const end = `${endYear}-${winter.runWindow.end}`;
      const after = shiftDate(end, 1);
      assertEquals(isRunSeasonallyActive(fall, prior), true, fall.runId);
      assertEquals(isRunSeasonallyActive(winter, prior), false, winter.runId);
      assertEquals(isRunSeasonallyActive(fall, activation), false, fall.runId);
      assertEquals(
        isRunSeasonallyActive(winter, activation),
        true,
        winter.runId,
      );
      assertEquals(isRunSeasonallyActive(winter, end), true, winter.runId);
      assertEquals(isRunSeasonallyActive(winter, after), false, winter.runId);
    }
  }
});

Deno.test("remaining Pass 2 locks air-proxy thermal ordering and ceilings", () => {
  for (
    const run of runs.filter((candidate) =>
      candidate.activity?.winterTemperatureMode === "air_temperature_proxy"
    )
  ) {
    const mild = proxy(run, [36, 36, 36, 36], [70, 70, 70]);
    const warming = proxy(run, [27, 30, 33, 36], [70, 70, 70]);
    const cold = proxy(run, [18, 18, 18, 18], [70, 70, 70]);
    const swing = proxy(run, [18, 40, 19, 39], [70, 70, 70]);
    const ceiling = run.activity!.dataMode === "weather_only" ? 64 : 69;
    assertGreater(mild.score!, cold.score!, run.runId);
    assertGreater(warming.score!, cold.score!, run.runId);
    assertGreater(mild.score!, swing.score!, run.runId);
    assert(cold.score! <= 39 && swing.score! <= 39);
    assert(mild.score! <= ceiling && warming.score! <= ceiling);
    assertEquals(mild.confidence, "Limited");
  }
});

Deno.test("remaining Pass 2 locks cloud-window locality and zero rain credit", () => {
  for (const run of runs) {
    const clear = run.riverId === "white"
      ? measured(run, 40, "neutral", [0, 0, 0], 0)
      : proxy(run, [28, 28, 28, 28], [0, 0, 0], 0);
    const middleCloud = run.riverId === "white"
      ? measured(run, 40, "neutral", [0, 100, 0], 0)
      : proxy(run, [28, 28, 28, 28], [0, 100, 0], 0);
    const wet = run.riverId === "white"
      ? measured(run, 40, "neutral", [0, 100, 0], .08)
      : proxy(run, [28, 28, 28, 28], [0, 100, 0], .08);
    assertEquals(middleCloud.blocks[0].score, clear.blocks[0].score, run.runId);
    assertGreater(
      middleCloud.blocks[1].score,
      clear.blocks[1].score,
      run.runId,
    );
    assertEquals(middleCloud.blocks[2].score, clear.blocks[2].score, run.runId);
    assertEquals(wet.score, middleCloud.score, run.runId);
    assertEquals(
      wet.blocks.map((block) => block.score),
      middleCloud.blocks.map((block) => block.score),
      run.runId,
    );
  }
});

Deno.test("remaining Pass 2 locks Rogue and White hydraulic and thermal fail-safes", () => {
  const rogueIdeal = proxy(
    ROGUE_MI_WINTER_STEELHEAD_RUN_PROFILE,
    [32, 34, 36, 38],
    [80, 80, 80],
  );
  const rogueBlown = proxy(
    ROGUE_MI_WINTER_STEELHEAD_RUN_PROFILE,
    [32, 34, 36, 38],
    [80, 80, 80],
    0,
    "blown_out",
  );
  const whiteFreezing = measured(
    WHITE_WINTER_STEELHEAD_RUN_PROFILE,
    33,
    "warming",
    [100, 100, 100],
  );
  const whiteUseful = measured(
    WHITE_WINTER_STEELHEAD_RUN_PROFILE,
    40,
    "warming",
    [100, 100, 100],
  );
  const whiteBlown = measured(
    WHITE_WINTER_STEELHEAD_RUN_PROFILE,
    40,
    "warming",
    [100, 100, 100],
    0,
    "blown_out",
  );
  assertGreater(rogueIdeal.score!, rogueBlown.score!);
  assert(rogueBlown.score! <= 19);
  assertGreater(whiteUseful.score!, whiteFreezing.score!);
  assert(whiteFreezing.score! <= 29);
  assert(whiteBlown.score! <= 19);
});

function proxy(
  run: AuditedRiverRunProfile,
  temperatures: [number, number, number, number],
  cloud: [number, number, number],
  precipitation = 0,
  flowBand: "ideal" | "blown_out" = "ideal",
) {
  const dates = ["2027-01-17", "2027-01-18", "2027-01-19", "2027-01-20"];
  const bands = run.fishabilityBands;
  return scoreActivity({
    ...base(run),
    gaugeFreshness: bands ? "fresh" : "missing",
    flowBand: bands ? flowBand : undefined,
    currentHydraulicValue: bands
      ? (bands.ideal.min + bands.ideal.max) / 2
      : null,
    fishabilityBands: bands,
    hourlyWeather: dates.flatMap((date, index) =>
      weather(date, temperatures[index], cloud, precipitation)
    ),
  });
}

function measured(
  run: AuditedRiverRunProfile,
  waterTempF: number,
  temperatureTrend: "neutral" | "warming",
  cloud: [number, number, number],
  precipitation = 0,
  flowBand: "ideal" | "blown_out" = "ideal",
) {
  const bands = run.fishabilityBands!;
  return scoreActivity({
    ...base(run),
    waterTempF,
    waterTemperatureFreshness: "fresh",
    temperatureTrend,
    gaugeFreshness: "fresh",
    flowBand,
    currentHydraulicValue: (bands.ideal.min + bands.ideal.max) / 2,
    fishabilityBands: bands,
    hourlyWeather: weather("2027-01-20", 34, cloud, precipitation),
  });
}

function base(run: AuditedRiverRunProfile) {
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

function weather(
  date: string,
  temperatureF: number,
  cloudBySegment: [number, number, number],
  precipitation: number,
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
      precipitation_in: isDay ? precipitation : 0,
      temperature_2m_f: temperatureF,
      is_day: isDay ? 1 : 0,
    };
  });
}

function shiftDate(date: string, days: number): string {
  return new Date(new Date(`${date}T12:00:00Z`).getTime() + days * 86_400_000)
    .toISOString().slice(0, 10);
}
