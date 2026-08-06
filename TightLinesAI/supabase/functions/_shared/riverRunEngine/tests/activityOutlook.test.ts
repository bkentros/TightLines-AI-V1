import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
  PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  scoreActivity,
  validateRunProfile,
} from "../index.ts";

const rules = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.activity!;
const cohoRules = PERE_MARQUETTE_FALL_COHO_RUN_PROFILE.activity!;
const steelheadRules = PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE.activity!;
const weatherOnlyRules = {
  ...rules,
  version: "weather-only-foundation-test-v1",
  dataMode: "weather_only" as const,
  weights: {
    light: 0.75,
    waterTemperature: 0,
    riverBehavior: 0,
    weather: 0.25,
  },
  caps: {
    ...rules.caps,
    noMeasuredRiverData: 69,
    noWaterTemperature: 69,
    weatherOnlyMaximum: 95,
  },
};

function weather(date: string, cloud = 80) {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
    cloud_cover_pct: cloud,
    shortwave_w_m2: (hour >= 10 && hour <= 16 ? 700 : 160) *
      (1 - cloud / 100 * 0.82),
    clear_sky_shortwave_w_m2: hour >= 10 && hour <= 16 ? 700 : 160,
    precipitation_in: hour === 7 ? 0.02 : 0,
  }));
}

Deno.test("weather-only Activity uses each block's own light and precipitation without inferring river state", () => {
  const date = "2026-09-10";
  const hourlyWeather = Array.from({ length: 24 }, (_, hour) => ({
    time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
    cloud_cover_pct: hour >= 9 && hour < 13 ? 100 : 0,
    shortwave_w_m2: hour >= 9 && hour < 13 ? 80 : 700,
    clear_sky_shortwave_w_m2: 700,
    precipitation_in: hour >= 9 && hour < 13 ? 0.005 : 0,
  }));
  const result = scoreActivity({
    rules: weatherOnlyRules,
    requestDate: date,
    targetDate: date,
    runStage: "building",
    staging: false,
    waterTempF: 55,
    temperatureTrend: "cooling",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 1500,
    flowSignal: "meaningful_rise",
    hourlyWeather,
  });

  assertEquals(result.confidence, "Limited");
  assert(result.blocks.every((block) => block.score <= 95));
  assertEquals(result.blocks[1].precipitationIn, 0.02);
  assert(result.blocks[1].score > result.blocks[2].score);
  assertEquals(result.reasonCodes.includes("activity_weather_only"), true);
  assertMatch(result.headline, /weather-only Chinook activity outlook/i);
  assertMatch(result.headline, /Limited confidence/i);
  assertMatch(result.detail, /evaluated weather/i);
  assertMatch(
    result.detail,
    /river conditions/i,
  );
  assertMatch(result.tip, /only as the strongest weather-supported window/i);
  assertMatch(result.tip, /Verify actual water temperature, level, clarity/i);
  assertMatch(result.detail, /weather-only/i);
  assertMatch(
    result.detail,
    /River level, clarity, and measured water temperature are unknown/i,
  );
  assertEquals(
    /favorable measured water temperature|river level remains workable/i.test(
      JSON.stringify(result),
    ),
    false,
  );
});

Deno.test("weather-only Activity rewards sustained light rain but not heavy precipitation", () => {
  const date = "2026-09-10";
  const scoreWith = (amounts: number[]) =>
    scoreActivity({
      rules: weatherOnlyRules,
      requestDate: date,
      targetDate: date,
      runStage: "building",
      staging: false,
      waterTempF: null,
      temperatureTrend: "neutral_missing",
      gaugeFreshness: "missing",
      weatherFreshness: "fresh",
      flowSignal: "unknown",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 80,
        shortwave_w_m2: 120,
        clear_sky_shortwave_w_m2: 600,
        precipitation_in: hour >= 5 && hour < 9 ? amounts[hour - 5] : 0,
      })),
    }).blocks[0].score;

  const brief = scoreWith([0.02, 0, 0, 0]);
  const sustained = scoreWith([0.005, 0.005, 0.005, 0.005]);
  const heavy = scoreWith([0.1, 0.1, 0.1, 0.1]);
  assert(sustained > brief);
  assert(sustained > heavy);
});

Deno.test("weather-only Activity configuration rejects hidden river or temperature weight", () => {
  const invalid = {
    ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    activity: {
      ...weatherOnlyRules,
      weights: {
        light: 0.7,
        waterTemperature: 0.05,
        riverBehavior: 0,
        weather: 0.25,
      },
    },
  };
  const validation = validateRunProfile(invalid, PERE_MARQUETTE_RIVER_PROFILE);
  assertEquals(validation.valid, false);
  assert(validation.issues.some((issue) =>
    issue.field === "activity.weights" &&
    issue.message.includes("Weather-only Activity")
  ));
});

Deno.test("PM Chinook Activity produces four conditional staging windows", () => {
  const result = scoreActivity({
    rules,
    requestDate: "2026-08-01",
    targetDate: "2026-08-01",
    runStage: "pre_run",
    staging: true,
    waterTempF: 66,
    temperatureTrend: "cooling",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "normal_fishable",
    flowSignal: "stable",
    hourlyWeather: weather("2026-08-01"),
  });
  assertEquals(result.blocks.length, 4);
  assertEquals(result.conditionalPresence, true);
  assertEquals(result.confidence, "Full");
  assertMatch(result.detail, /early Chinook/i);
  assert(result.blocks[0].score > result.blocks[2].score);
});

Deno.test("PM Chinook Activity switches to tomorrow and caps forecast certainty", () => {
  const result = scoreActivity({
    rules,
    requestDate: "2026-09-10",
    targetDate: "2026-09-11",
    runStage: "building",
    staging: false,
    waterTempF: 58,
    temperatureTrend: "cooling",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "meaningful_rise",
    hourlyWeather: weather("2026-09-11", 95),
  });
  assertEquals(result.targetDayLabel, "Tomorrow");
  assertEquals(result.confidence, "Moderate");
  assert(result.blocks.every((block) => block.score <= rules.caps.tomorrow));
});

Deno.test("late Chinook biology and missing measurements prevent false highs", () => {
  const result = scoreActivity({
    rules,
    requestDate: "2026-10-25",
    targetDate: "2026-10-25",
    runStage: "ending",
    staging: false,
    waterTempF: null,
    temperatureTrend: "neutral_missing",
    gaugeFreshness: "missing",
    weatherFreshness: "fresh",
    flowSignal: "unknown",
    hourlyWeather: weather("2026-10-25", 100),
  });
  assertEquals(result.confidence, "Limited");
  assert(result.blocks.every((block) => block.score <= rules.caps.ending));
  assertMatch(result.detail, /spent|deteriorating/i);
});

Deno.test("Activity matrix reaches every label and varies without random jitter", () => {
  const scores = new Set<number>();
  const labels = new Set<string>();
  for (const waterTempF of [44, 55, 66, 69, 71]) {
    for (
      const flowBand of [
        "very_low",
        "low",
        "normal_fishable",
        "ideal",
        "high_fishable",
        "very_high",
        "blown_out",
      ] as const
    ) {
      for (const cloud of [0, 50, 100]) {
        const result = scoreActivity({
          rules,
          requestDate: "2026-09-10",
          targetDate: "2026-09-10",
          runStage: "building",
          staging: false,
          waterTempF,
          temperatureTrend: waterTempF >= 66 ? "strong_warming" : "cooling",
          gaugeFreshness: "fresh",
          weatherFreshness: "fresh",
          flowBand,
          flowSignal: flowBand === "blown_out" ? "sharp_rise" : "stable",
          hourlyWeather: weather("2026-09-10", cloud),
        });
        scores.add(result.score!);
        labels.add(result.label);
      }
    }
  }
  const highlyActive = scoreActivity({
    rules,
    requestDate: "2026-09-10",
    targetDate: "2026-09-10",
    runStage: "building",
    staging: false,
    waterTempF: 55,
    temperatureTrend: "cooling",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "meaningful_rise",
    hourlyWeather: weather("2026-09-10", 100).map((hour) => ({
      ...hour,
      shortwave_w_m2: 180,
      clear_sky_shortwave_w_m2: 700,
    })),
  });
  scores.add(highlyActive.score!);
  labels.add(highlyActive.label);
  assert(
    scores.size >= 20,
    `expected broad variability, received ${scores.size} unique scores`,
  );
  assertEquals(
    [...labels].sort(),
    ["Active", "Highly active", "Moderate", "Reserved"].sort(),
  );

  const input = {
    rules,
    requestDate: "2026-09-10",
    targetDate: "2026-09-10",
    runStage: "building" as const,
    staging: false,
    waterTempF: 58,
    temperatureTrend: "cooling" as const,
    gaugeFreshness: "fresh" as const,
    weatherFreshness: "fresh" as const,
    flowBand: "ideal" as const,
    flowSignal: "stable" as const,
    hourlyWeather: weather("2026-09-10", 80),
  };
  assertEquals(scoreActivity(input), scoreActivity(input));
});

Deno.test("Chinook Activity copy changes across lifecycle and confidence", () => {
  const reads = ([
    ["pre_run", true],
    ["beginning", false],
    ["building", false],
    ["peak", false],
    ["tapering", false],
    ["ending", false],
  ] as const).map(([runStage, staging]) =>
    scoreActivity({
      rules,
      requestDate: "2026-09-10",
      targetDate: "2026-09-10",
      runStage,
      staging,
      waterTempF: 58,
      temperatureTrend: "cooling",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      flowSignal: "stable",
      hourlyWeather: weather("2026-09-10", 80),
    })
  );
  assertEquals(new Set(reads.map((read) => read.detail)).size, reads.length);
  assertMatch(reads[0].detail, /sparse early Chinook/i);
  assertMatch(reads[1].detail, /lake-fresh/i);
  assertMatch(reads[4].detail, /unknown condition/i);
  assertMatch(reads[4].detail, /fresher fish may be more active/i);
  assertMatch(reads[5].detail, /spent|dying/i);
});

Deno.test("Activity explanations never promote an unavailable input", () => {
  const weatherOnly = scoreActivity({
    rules,
    requestDate: "2026-09-10",
    targetDate: "2026-09-10",
    runStage: "building",
    staging: false,
    waterTempF: null,
    temperatureTrend: "neutral_missing",
    gaugeFreshness: "missing",
    weatherFreshness: "fresh",
    flowSignal: "unknown",
    hourlyWeather: weather("2026-09-10", 80),
  });
  for (const block of weatherOnly.blocks) {
    assertEquals(
      /water temperature supports|measured river behavior supports/i.test(
        block.positiveDriver,
      ),
      false,
    );
    assertMatch(
      block.limitingFactor,
      /temperature is unavailable|river behavior is unavailable/i,
    );
  }
  assert(
    Math.max(...weatherOnly.blocks.map((block) => block.score)) >= 40,
    "weather-only rivers should remain useful instead of receiving stacked missing-data penalties",
  );
  assert(weatherOnly.blocks.every((block) => block.score <= 69));
});

Deno.test("isolated effective-light changes stay in their block and own the explanation", () => {
  const date = "2026-09-10";
  const baseline = weather(date, 0);
  const changed = baseline.map((hour) => {
    const localHour = Number(hour.time_local.slice(11, 13));
    return localHour >= 9 && localHour < 13
      ? {
        ...hour,
        cloud_cover_pct: 100,
        shortwave_w_m2: 100,
        clear_sky_shortwave_w_m2: 700,
      }
      : hour;
  });
  const input = {
    rules,
    requestDate: date,
    targetDate: date,
    runStage: "building" as const,
    staging: false,
    waterTempF: 56,
    temperatureTrend: "cooling" as const,
    gaugeFreshness: "fresh" as const,
    weatherFreshness: "fresh" as const,
    flowBand: "ideal" as const,
    flowSignal: "meaningful_rise" as const,
  };
  const before = scoreActivity({ ...input, hourlyWeather: baseline });
  const after = scoreActivity({ ...input, hourlyWeather: changed });
  assert(after.blocks[1].score > before.blocks[1].score);
  assertEquals(
    [0, 2, 3].map((index) => after.blocks[index].score),
    [0, 2, 3].map((index) => before.blocks[index].score),
  );
  assertMatch(after.blocks[1].positiveDriver, /clouds|lower light/i);
});

Deno.test("continuous light varies while complete-input Chinook reads retain a soft opportunity floor", () => {
  const date = "2026-09-10";
  const common = {
    rules,
    requestDate: date,
    targetDate: date,
    runStage: "building" as const,
    staging: false,
    waterTempF: 56,
    temperatureTrend: "cooling" as const,
    gaugeFreshness: "fresh" as const,
    weatherFreshness: "fresh" as const,
    flowBand: "ideal" as const,
    flowSignal: "meaningful_rise" as const,
  };
  const scores = new Set(
    [700, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 150, 100]
      .map((radiation) =>
        scoreActivity({
          ...common,
          hourlyWeather: weather(date, 50).map((hour) => ({
            ...hour,
            shortwave_w_m2: radiation,
            clear_sky_shortwave_w_m2: 700,
          })),
        }).blocks[1].score
      ),
  );
  assert(
    scores.size >= 9,
    `expected continuous variation, received ${scores.size} scores`,
  );

  const severe = scoreActivity({
    ...common,
    waterTempF: 71,
    temperatureTrend: "strong_warming",
    flowBand: "blown_out",
    flowSignal: "sharp_rise",
    hourlyWeather: weather(date, 0).map((hour) => ({
      ...hour,
      precipitation_in: 0.2,
    })),
  });
  assertEquals(Math.min(...severe.blocks.map((block) => block.score)), 20);
  assert(severe.blocks.every((block) => block.score >= 20 && block.score < 30));
});

Deno.test("PM Coho Activity uses species copy and its own lower-tail semantics", () => {
  const date = "2026-10-15";
  const result = scoreActivity({
    rules: cohoRules,
    requestDate: date,
    targetDate: date,
    runStage: "peak",
    staging: false,
    waterTempF: 69,
    temperatureTrend: "strong_warming",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "blown_out",
    flowSignal: "sharp_rise",
    hourlyWeather: weather(date, 0).map((hour) => ({
      ...hour,
      precipitation_in: 0.3,
    })),
  });
  assertMatch(result.headline, /Coho activity outlook/i);
  assertMatch(result.detail, /Coho/i);
  assertEquals(/Chinook/i.test(`${result.detail} ${result.tip}`), false);
  assert(result.blocks.every((block) => block.score >= 15 && block.score < 25));
});

Deno.test("PM Coho Activity copy follows staging through late deterioration", () => {
  const date = "2026-11-30";
  const common = {
    rules: cohoRules,
    requestDate: date,
    targetDate: date,
    waterTempF: 52,
    temperatureTrend: "cooling" as const,
    gaugeFreshness: "fresh" as const,
    weatherFreshness: "fresh" as const,
    flowBand: "ideal" as const,
    flowSignal: "stable" as const,
    hourlyWeather: weather(date, 75),
  };
  const staging = scoreActivity({
    ...common,
    runStage: "pre_run",
    staging: true,
  });
  const ending = scoreActivity({
    ...common,
    runStage: "ending",
    staging: false,
  });
  assertMatch(staging.detail, /sparse early Coho/i);
  assertMatch(ending.detail, /spent|deteriorating/i);
  assert(ending.blocks.every((block) => block.score <= cohoRules.caps.ending));
});

Deno.test("every Coho lifecycle and confidence state stays species-correct and names a limitation", () => {
  const date = "2026-10-15";
  const stages = [
    ["pre_run", true],
    ["beginning", false],
    ["building", false],
    ["peak", false],
    ["tapering", false],
    ["ending", false],
    ["post_run", false],
  ] as const;
  const dataStates = [
    {
      gaugeFreshness: "fresh" as const,
      weatherFreshness: "fresh" as const,
      waterTempF: 52,
      flowBand: "ideal" as const,
      hourlyWeather: weather(date, 80),
    },
    {
      gaugeFreshness: "missing" as const,
      weatherFreshness: "fresh" as const,
      waterTempF: 52,
      flowBand: undefined,
      hourlyWeather: weather(date, 80),
    },
    {
      gaugeFreshness: "missing" as const,
      weatherFreshness: "fresh" as const,
      waterTempF: null,
      flowBand: undefined,
      hourlyWeather: weather(date, 80),
    },
  ];
  for (const [runStage, staging] of stages) {
    for (const state of dataStates) {
      const result = scoreActivity({
        rules: cohoRules,
        requestDate: date,
        targetDate: date,
        runStage,
        staging,
        waterTempF: state.waterTempF,
        temperatureTrend: state.waterTempF == null
          ? "neutral_missing"
          : "cooling",
        gaugeFreshness: state.gaugeFreshness,
        weatherFreshness: state.weatherFreshness,
        flowBand: state.flowBand,
        flowSignal: state.flowBand ? "stable" : "unknown",
        hourlyWeather: state.hourlyWeather,
      });
      const copy = `${result.headline} ${result.detail} ${result.tip}`;
      assertMatch(copy, /Coho/i);
      assertMatch(result.detail, /main limitation/i);
      assertEquals(/Chinook|Steelhead|catch probability/i.test(copy), false);
      assertEquals(result.blocks.length, 4);
      for (const block of result.blocks) {
        assert(block.positiveDriver.trim().length > 0);
        assert(block.limitingFactor.trim().length > 0);
        assertEquals(
          /Chinook|Steelhead/i.test(
            `${block.positiveDriver} ${block.limitingFactor}`,
          ),
          false,
        );
      }
    }
  }
});

Deno.test("PM Steelhead Activity is temperature-led without salmon floors or late mortality", () => {
  const date = "2026-12-10";
  const common = {
    rules: steelheadRules,
    requestDate: date,
    targetDate: date,
    runStage: "tapering" as const,
    staging: false,
    temperatureTrend: "neutral" as const,
    gaugeFreshness: "fresh" as const,
    weatherFreshness: "fresh" as const,
    flowBand: "ideal" as const,
    flowSignal: "stable" as const,
    hourlyWeather: weather(date, 95),
  };
  const cold = scoreActivity({ ...common, waterTempF: 35 });
  const active = scoreActivity({ ...common, waterTempF: 48 });
  assert(active.score! > cold.score!);
  assert(cold.blocks.some((block) => block.score < 60));
  assertEquals(cold.reasonCodes.includes("activity_late_biology_cap"), false);
  assertEquals(
    /Chinook|Coho|spent|dying|deteriorat/i.test(
      `${cold.headline} ${cold.detail} ${cold.tip}`,
    ),
    false,
  );
  assertMatch(cold.detail, /winter holding/i);
});

Deno.test("Steelhead can reach an exceptional 95-97 only inside the thermal apex with aligned conditions", () => {
  const date = "2026-10-20";
  const alignedWeather = weather(date, 100).map((hour) => ({
    ...hour,
    shortwave_w_m2: 0,
    clear_sky_shortwave_w_m2: 700,
    precipitation_in: 0.01,
  }));
  const scoreAt = (waterTempF: number) =>
    scoreActivity({
      rules: steelheadRules,
      requestDate: date,
      targetDate: date,
      runStage: "peak",
      staging: false,
      waterTempF,
      temperatureTrend: "cooling",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      flowSignal: "stable",
      hourlyWeather: alignedWeather,
    });
  const apex = scoreAt(51);
  const lowerShoulder = scoreAt(44);
  const upperShoulder = scoreAt(56);

  assert(apex.score != null && apex.score >= 95 && apex.score <= 97);
  assertEquals(apex.label, "Highly active");
  assert(lowerShoulder.score != null && lowerShoulder.score < apex.score);
  assert(upperShoulder.score != null && upperShoulder.score < apex.score);
});

Deno.test("Steelhead rising flow does not duplicate Push credit in Activity", () => {
  const date = "2026-11-10";
  const common = {
    rules: steelheadRules,
    requestDate: date,
    targetDate: date,
    runStage: "building" as const,
    staging: false,
    waterTempF: 48,
    temperatureTrend: "neutral" as const,
    gaugeFreshness: "fresh" as const,
    weatherFreshness: "fresh" as const,
    flowBand: "ideal" as const,
    hourlyWeather: weather(date, 60),
  };
  const stable = scoreActivity({ ...common, flowSignal: "stable" });
  const rising = scoreActivity({
    ...common,
    flowSignal: "meaningful_rise",
  });
  assertEquals(
    rising.blocks.map((block) => block.score),
    stable.blocks.map((block) => block.score),
  );
});

Deno.test("every Steelhead lifecycle and confidence state uses living-fish and winter-handoff copy", () => {
  const date = "2026-11-15";
  for (
    const [runStage, staging] of [
      ["pre_run", true],
      ["beginning", false],
      ["building", false],
      ["peak", false],
      ["tapering", false],
      ["ending", false],
      ["post_run", false],
    ] as const
  ) {
    for (
      const state of [
        { temp: 48, gauge: "fresh", weatherState: "fresh", cloud: 70 },
        { temp: 48, gauge: "missing", weatherState: "fresh", cloud: 70 },
        { temp: null, gauge: "missing", weatherState: "fresh", cloud: 70 },
      ] as const
    ) {
      const result = scoreActivity({
        rules: steelheadRules,
        requestDate: date,
        targetDate: date,
        runStage,
        staging,
        waterTempF: state.temp,
        temperatureTrend: state.temp == null ? "neutral_missing" : "neutral",
        gaugeFreshness: state.gauge,
        weatherFreshness: state.weatherState,
        flowBand: state.gauge === "fresh" ? "ideal" : undefined,
        flowSignal: state.gauge === "fresh" ? "stable" : "unknown",
        hourlyWeather: weather(date, state.cloud),
      });
      const copy = `${result.headline} ${result.detail} ${result.tip}`;
      assertMatch(copy, /Steelhead/i);
      assertMatch(result.detail, /main limitation/i);
      assertEquals(
        /Chinook|Coho|spent|dying|deteriorat|mortality/i.test(copy),
        false,
      );
      if (["tapering", "ending", "post_run"].includes(runStage)) {
        assertMatch(copy, /winter holding|cold water/i);
      }
    }
  }
});

Deno.test("production Activity scenario matrix stays deterministic, internally consistent, and species-safe", () => {
  const profiles = [
    ["Chinook", rules],
    ["Coho", cohoRules],
    ["Steelhead", steelheadRules],
  ] as const;
  const stages = [
    "pre_run",
    "beginning",
    "building",
    "peak",
    "tapering",
    "ending",
    "post_run",
  ] as const;
  const temperatures = [null, 34, 39, 44, 50, 56, 64, 68, 72] as const;
  const flowBands = [
    "very_low",
    "low",
    "normal_fishable",
    "ideal",
    "high_fishable",
    "very_high",
    "blown_out",
  ] as const;
  const flowSignals = [
    "stable",
    "meaningful_rise",
    "sharp_rise",
    "falling",
  ] as const;
  const clouds = [0, 35, 70, 100] as const;
  const expectedLabel = (score: number) =>
    score >= 80
      ? "Highly active"
      : score >= 60
      ? "Active"
      : score >= 40
      ? "Moderate"
      : score >= 20
      ? "Reserved"
      : "Inactive";
  let cases = 0;

  for (const [species, profileRules] of profiles) {
    for (const runStage of stages) {
      for (const waterTempF of temperatures) {
        for (const flowBand of flowBands) {
          for (const flowSignal of flowSignals) {
            for (const cloud of clouds) {
              const date = "2026-10-15";
              const input = {
                rules: profileRules,
                requestDate: date,
                targetDate: date,
                runStage,
                staging: runStage === "pre_run",
                waterTempF,
                temperatureTrend: waterTempF == null
                  ? "neutral_missing" as const
                  : waterTempF >= 64
                  ? "strong_warming" as const
                  : "cooling" as const,
                gaugeFreshness: "fresh" as const,
                weatherFreshness: "fresh" as const,
                flowBand,
                flowSignal,
                hourlyWeather: weather(date, cloud),
              };
              const result = scoreActivity(input);
              const repeat = scoreActivity(input);
              const blockScores = result.blocks.map((block) => block.score);
              const allCopy =
                `${result.headline} ${result.detail} ${result.tip}`;

              assertEquals(result, repeat);
              assertEquals(result.blocks.length, 4);
              assert(result.score != null);
              assert(result.score >= Math.min(...blockScores));
              assert(result.score <= Math.max(...blockScores));
              assertEquals(result.label, expectedLabel(result.score));
              assertMatch(result.headline, new RegExp(species, "i"));
              assertMatch(result.detail, /strongest window/i);
              assertMatch(result.detail, /main limitation/i);
              assertEquals(
                /undefined|null|NaN|\[object Object\]/.test(allCopy),
                false,
              );
              if (species === "Steelhead") {
                assertEquals(
                  /spent|dying|deteriorat|mortality/i.test(allCopy),
                  false,
                );
              }
              cases += 1;
            }
          }
        }
      }
    }
  }
  assertEquals(cases, 21168);
});

Deno.test("PM Chinook floor and lifecycle constraints change continuously after Peak", () => {
  const scoreFor = (
    date: string,
    runStage: "peak" | "tapering" | "ending" | "post_run",
  ) =>
    scoreActivity({
      rules,
      requestDate: date,
      targetDate: date,
      runStage,
      staging: false,
      waterTempF: 55,
      temperatureTrend: "neutral",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      flowSignal: "stable",
      hourlyWeather: weather(date, 85),
    }).blocks[0].score;
  const scores = [
    scoreFor("2026-09-30", "peak"),
    scoreFor("2026-10-01", "tapering"),
    scoreFor("2026-10-18", "tapering"),
    scoreFor("2026-10-19", "ending"),
    scoreFor("2026-10-27", "ending"),
    scoreFor("2026-10-28", "post_run"),
  ];
  assert(scores[0] - scores[1] <= 2);
  assert(scores[2] - scores[3] <= 5);
  assertEquals(scores[0] - scores[2], 15);
  assert(scores[4] - scores[5] <= 1);
});

Deno.test("PM Coho floor and lifecycle constraints interpolate across the full back half", () => {
  const scoreFor = (
    date: string,
    runStage: "peak" | "tapering" | "ending" | "post_run",
    adverse = false,
  ) =>
    scoreActivity({
      rules: cohoRules,
      requestDate: date,
      targetDate: date,
      runStage,
      staging: false,
      waterTempF: adverse ? 68 : 54,
      temperatureTrend: "neutral",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: adverse ? "blown_out" : "ideal",
      flowSignal: "stable",
      hourlyWeather: weather(date, adverse ? 0 : 85),
    }).blocks[0].score;
  const lifecycle = [
    scoreFor("2026-11-05", "peak"),
    scoreFor("2026-11-06", "tapering"),
    scoreFor("2026-11-20", "tapering"),
    scoreFor("2026-11-21", "ending"),
    scoreFor("2026-11-30", "ending"),
    scoreFor("2026-12-01", "post_run"),
  ];
  assert(lifecycle[0] - lifecycle[1] <= 2);
  assertEquals(lifecycle[0] - lifecycle[2], 15);
  assert(lifecycle[2] - lifecycle[3] <= 5);
  assert(lifecycle[4] - lifecycle[5] <= 1);

  const fadingFloor = [
    scoreFor("2026-11-05", "peak", true),
    scoreFor("2026-11-13", "tapering", true),
    scoreFor("2026-11-20", "tapering", true),
  ];
  assert(fadingFloor[0] > fadingFloor[1]);
  assert(fadingFloor[1] > fadingFloor[2]);
  assert(fadingFloor[2] < 15);
});

Deno.test("late salmon best-case conditions remain biologically bounded and explain fresh versus spent fish", () => {
  for (
    const [species, profileRules, stage, date, ceiling, permitsActive] of [
      ["Chinook", rules, "tapering", "2026-10-18", 85, true],
      ["Chinook", rules, "ending", "2026-10-27", 49, false],
      ["Chinook", rules, "post_run", "2026-10-28", 49, false],
      ["Coho", cohoRules, "tapering", "2026-11-20", 85, true],
      ["Coho", cohoRules, "ending", "2026-11-25", 64, true],
      ["Coho", cohoRules, "ending", "2026-11-30", 42, false],
      ["Coho", cohoRules, "post_run", "2026-12-16", 42, false],
    ] as const
  ) {
    const result = scoreActivity({
      rules: profileRules,
      requestDate: date,
      targetDate: date,
      runStage: stage,
      staging: false,
      waterTempF: 50,
      temperatureTrend: "cooling",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      flowSignal: "stable",
      hourlyWeather: weather(date, 100),
    });
    assert(result.score != null && result.score <= ceiling);
    if (!permitsActive) {
      assertEquals(["Active", "Highly active"].includes(result.label), false);
    }
    assertMatch(result.detail, /fresher/i);
    assertMatch(result.detail, /unknown condition/i);
    assertMatch(result.detail, /more active than this score/i);
    assertMatch(
      result.detail,
      stage === "tapering"
        ? /condition|deteriorating|cannot judge/i
        : /spent|deteriorating|biological decline/i,
    );
    assertMatch(result.tip, new RegExp(`living ${species}`, "i"));
  }
});

Deno.test("tomorrow Activity uses only target-day weather and remains forecast-capped", () => {
  const today = "2026-10-15";
  const tomorrow = "2026-10-16";
  const result = scoreActivity({
    rules: steelheadRules,
    requestDate: today,
    targetDate: tomorrow,
    runStage: "building",
    staging: false,
    waterTempF: 48,
    temperatureTrend: "neutral",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "stable",
    hourlyWeather: [...weather(today, 0), ...weather(tomorrow, 100)],
  });
  const tomorrowOnly = scoreActivity({
    rules: steelheadRules,
    requestDate: today,
    targetDate: tomorrow,
    runStage: "building",
    staging: false,
    waterTempF: 48,
    temperatureTrend: "neutral",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "stable",
    hourlyWeather: weather(tomorrow, 100),
  });
  assertEquals(result, tomorrowOnly);
  assertEquals(result.targetDayLabel, "Tomorrow");
  assertEquals(result.confidence, "Moderate");
  assert(
    result.blocks.every((block) => block.score <= steelheadRules.caps.tomorrow),
  );
  assertMatch(result.headline, /Tomorrow/i);
});
