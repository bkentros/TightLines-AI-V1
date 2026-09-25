import { assert, assertEquals, assertGreater } from "jsr:@std/assert";
import {
  type ActivityWeatherHour,
  type AuditedRiverRunProfile,
  BIG_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
  GRAND_WINTER_STEELHEAD_RUN_PROFILE,
  MUSKEGON_WINTER_STEELHEAD_RUN_PROFILE,
  PERE_MARQUETTE_WINTER_STEELHEAD_RUN_PROFILE,
  scoreActivity,
  ST_JOSEPH_WINTER_STEELHEAD_RUN_PROFILE,
} from "../index.ts";

const runs = [
  PERE_MARQUETTE_WINTER_STEELHEAD_RUN_PROFILE,
  BIG_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
  MUSKEGON_WINTER_STEELHEAD_RUN_PROFILE,
  ST_JOSEPH_WINTER_STEELHEAD_RUN_PROFILE,
  GRAND_WINTER_STEELHEAD_RUN_PROFILE,
];

type ReplayReport = {
  runId: string;
  expectedDays: number;
  usableDays: number;
  replayYears: string;
  method: string;
  reviewSampleSize: number;
  spread: { max: number };
  invariants: Record<string, number>;
  byTemperature: Record<
    string,
    { days: number; scores: { median: number | null } }
  >;
};

Deno.test("Pass 2 historical reports accept all five winter profiles", async () => {
  let expected = 0;
  let usable = 0;
  for (const run of runs) {
    const river = run.riverId.replaceAll("_", "-");
    const path = new URL(
      `../../../../../docs/audits/river-run-${river}-winter-steelhead-activity-replay.json`,
      import.meta.url,
    );
    const report = JSON.parse(await Deno.readTextFile(path)) as ReplayReport;
    assertEquals(report.runId, run.runId);
    assertEquals(report.replayYears, "2021-2025");
    assert(report.method.includes("measured water temperature"));
    assert(report.method.includes("not catch rates"));
    assert(report.usableDays / report.expectedDays >= .9);
    assertEquals(report.reviewSampleSize, 100);
    assert(report.spread.max >= 5 && report.spread.max <= 12);
    assertEquals(
      Object.values(report.invariants).filter((count) => count !== 0),
      [],
    );
    const cold = report.byTemperature.below38F;
    const favorable = report.byTemperature.from38To45F;
    assert(cold.days > 0 && favorable.days > 0);
    assertGreater(favorable.scores.median!, cold.scores.median!);
    expected += report.expectedDays;
    usable += report.usableDays;
  }
  assert(usable / expected >= .95);
});

function weather(input: {
  date: string;
  cloudBySegment?: [number, number, number];
  precipitationIn?: number;
  airTemperatureF?: number;
}): ActivityWeatherHour[] {
  const cloudBySegment = input.cloudBySegment ?? [50, 50, 50];
  return Array.from({ length: 24 }, (_, hour) => {
    const isDay = hour >= 8 && hour < 17;
    const segment = hour < 11 ? 0 : hour < 14 ? 1 : 2;
    const cloud = cloudBySegment[segment];
    return {
      time_local: `${input.date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: cloud,
      shortwave_w_m2: isDay ? Math.round(500 * (1 - cloud / 125)) : 0,
      clear_sky_shortwave_w_m2: isDay ? 500 : 0,
      precipitation_in: isDay ? input.precipitationIn ?? 0 : 0,
      temperature_2m_f: input.airTemperatureF ?? 32,
      is_day: isDay ? 1 : 0,
    };
  });
}

function score(input: {
  run?: AuditedRiverRunProfile;
  temp: number | null;
  trend:
    | "neutral_missing"
    | "strong_cooling"
    | "cooling"
    | "neutral"
    | "warming"
    | "strong_warming";
  cloudBySegment?: [number, number, number];
  precipitationIn?: number;
  flowBand?: "ideal" | "blown_out" | null;
  gaugeFreshness?: "fresh" | "stale" | "missing";
  temperatureFreshness?: "fresh" | "stale" | "missing";
  airTemperatureF?: number;
}) {
  const run = input.run ?? BIG_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE;
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
    gaugeFreshness: input.gaugeFreshness ?? "fresh",
    weatherFreshness: "fresh",
    flowBand: input.flowBand === null ? undefined : input.flowBand ?? "ideal",
    currentHydraulicValue: 1550,
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: weather({
      date,
      cloudBySegment: input.cloudBySegment,
      precipitationIn: input.precipitationIn,
      airTemperatureF: input.airTemperatureF,
    }),
    refreshSlot: "07:00",
  });
}

Deno.test("Pass 2 locks thermal direction and sharp-swing ordering on every river", () => {
  for (const run of runs) {
    const warming = score({ run, temp: 40, trend: "warming" });
    const stable = score({ run, temp: 40, trend: "neutral" });
    const cooling = score({ run, temp: 40, trend: "cooling" });
    const strongWarming = score({ run, temp: 40, trend: "strong_warming" });
    const strongCooling = score({ run, temp: 40, trend: "strong_cooling" });
    assertGreater(warming.score!, stable.score!, run.runId);
    assertGreater(stable.score!, cooling.score!, run.runId);
    assertGreater(warming.score!, strongWarming.score!, run.runId);
    assertGreater(cooling.score!, strongCooling.score!, run.runId);
  }
});

Deno.test("Pass 2 locks cloud to its daylight block and gives rain no bonus", () => {
  const clear = score({
    temp: 40,
    trend: "neutral",
    cloudBySegment: [0, 0, 0],
  });
  const middleCloud = score({
    temp: 40,
    trend: "neutral",
    cloudBySegment: [0, 100, 0],
  });
  assertEquals(clear.blocks.length, 3);
  assertEquals(clear.blocks.map((block) => block.id), [
    "08-11",
    "11-14",
    "14-17",
  ]);
  assertEquals(middleCloud.blocks[0].score, clear.blocks[0].score);
  assertGreater(middleCloud.blocks[1].score, clear.blocks[1].score);
  assertEquals(middleCloud.blocks[2].score, clear.blocks[2].score);

  const wet = score({
    temp: 40,
    trend: "neutral",
    cloudBySegment: [0, 0, 0],
    precipitationIn: .08,
  });
  assertEquals(
    wet.blocks.map((block) => block.score),
    clear.blocks.map((block) => block.score),
  );
  assertEquals(wet.score, clear.score);
});

Deno.test("Pass 2 locks near-freezing, blown-out, stale, and missing-data behavior", () => {
  const freezing = score({ temp: 33, trend: "warming" });
  const sub35 = score({ temp: 34.5, trend: "warming" });
  const blownOut = score({
    temp: 40,
    trend: "warming",
    flowBand: "blown_out",
  });
  const staleTemperature = score({
    temp: 40,
    trend: "warming",
    temperatureFreshness: "stale",
  });
  const noTemperature = score({ temp: null, trend: "neutral_missing" });
  const noRiver = score({
    temp: 40,
    trend: "warming",
    flowBand: null,
    gaugeFreshness: "missing",
  });
  const neither = score({
    temp: null,
    trend: "neutral_missing",
    flowBand: null,
    gaugeFreshness: "missing",
  });
  assert(freezing.blocks.every((block) => block.score <= 29));
  assert(sub35.blocks.every((block) => block.score <= 49));
  assert(blownOut.blocks.every((block) => block.score <= 19));
  assert(staleTemperature.blocks.every((block) => block.score <= 59));
  assert(noTemperature.blocks.every((block) => block.score <= 59));
  assert(noRiver.blocks.every((block) => block.score <= 69));
  assertEquals(neither.score, null);
  assertEquals(neither.blocks, []);
  assertEquals(neither.label, "Unavailable");
});

Deno.test("Pass 2 proves extreme air warmth cannot substitute for measured water", () => {
  const coldAir = score({
    temp: null,
    trend: "neutral_missing",
    airTemperatureF: 5,
  });
  const warmAir = score({
    temp: null,
    trend: "neutral_missing",
    airTemperatureF: 70,
  });
  assertEquals(warmAir.score, coldAir.score);
  assertEquals(
    warmAir.blocks.map((block) => block.score),
    coldAir.blocks.map((block) => block.score),
  );
});
