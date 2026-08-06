import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  scoreActivity,
} from "../index.ts";

const rules = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.activity!;

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
  assertMatch(reads[4].detail, /living Chinook/i);
  assertMatch(reads[5].detail, /spent|deteriorating/i);
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
