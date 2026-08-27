import assert from "node:assert/strict";

import {
  addDays,
  resolveRunStage,
  RIVER_RUN_RUN_PROFILES,
  scoreActivity,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";
import type { ActivityWeatherHour } from "../supabase/functions/_shared/riverRunEngine/scoring/activity.ts";

const runIds = [
  "platte_fall_chinook",
  "platte_fall_coho",
  "platte_fall_steelhead",
];

for (const runId of runIds) {
  const run = RIVER_RUN_RUN_PROFILES.find((item) => item.runId === runId);
  assert(run, `${runId} public profile missing`);
  assert.equal(run.primitiveCapabilities.activity.status, "available");
  assert(run.activity, `${runId} Activity rules missing`);
  assert.equal(run.activity.dataMode, "weather_only");
  assert.equal(run.activity.weights.waterTemperature, 0);
  assert.equal(run.activity.weights.riverBehavior, 0);
  assert.equal(
    round4(
      Object.values(run.activity.weights).reduce(
        (sum, value) => sum + value,
        0,
      ),
    ),
    1,
  );
  assert.deepEqual(run.activity.inputReach?.hydraulicSourceIds, []);
  assert.deepEqual(run.activity.inputReach?.waterTemperatureSourceIds, []);

  const date = seasonDate(2026, run.runWindow.peak, run.runWindow.stagingStart);
  const baselineWeather = weather(date);
  const baseline = result(run, date, baselineWeather);
  assert.equal(baseline.confidence, "Limited");
  assert.equal(baseline.blocks.length, 4);
  assert(baseline.score !== null);
  assert(
    baseline.score <= (run.activity.caps.weatherOnlyMaximum ?? 100),
  );
  assert.match(baseline.detail, /weather-only/i);
  assert.match(
    baseline.detail,
    /River level, clarity, and measured water temperature are unknown/i,
  );
  assert.doesNotMatch(
    `${baseline.headline} ${baseline.detail} ${baseline.tip}`,
    /measured water temperature is favorable|river level remains workable|river rose|blown out/i,
  );
  const scores = baseline.blocks.map((block) => block.score);
  assert(baseline.score >= Math.min(...scores));
  assert(baseline.score <= Math.max(...scores));

  const missingWeather = scoreActivity({
    rules: run.activity,
    requestDate: date,
    targetDate: date,
    runStage: resolveRunStage(run, date).stage,
    staging: false,
    waterTempF: null,
    temperatureTrend: "neutral_missing",
    gaugeFreshness: "missing",
    weatherFreshness: "missing",
    flowSignal: "unknown",
    hourlyWeather: [],
  });
  assert.equal(missingWeather.score, null);
  assert.equal(missingWeather.label, "Unavailable");
  assert.deepEqual(missingWeather.blocks, []);
  assert.match(
    missingWeather.detail,
    /no four-hour block can be scored or ranked/i,
  );

  const darkerFirstBlock = result(
    run,
    date,
    baselineWeather.map((hour) => ({
      ...hour,
      shortwave_w_m2: hour.time_local.slice(11, 13) >= "05" &&
          hour.time_local.slice(11, 13) < "09"
        ? 40
        : hour.shortwave_w_m2,
    })),
  );
  assert.notEqual(darkerFirstBlock.blocks[0].score, baseline.blocks[0].score);
  assert.deepEqual(
    darkerFirstBlock.blocks.slice(1).map((block) => block.score),
    baseline.blocks.slice(1).map((block) => block.score),
    `${runId} isolated light change leaked across blocks`,
  );

  const rainFirstBlock = result(
    run,
    date,
    baselineWeather.map((hour) => ({
      ...hour,
      precipitation_in: hour.time_local.slice(11, 13) >= "05" &&
          hour.time_local.slice(11, 13) < "09"
        ? 0.01
        : 0,
    })),
  );
  assert.notEqual(rainFirstBlock.blocks[0].score, baseline.blocks[0].score);
  assert.deepEqual(
    rainFirstBlock.blocks.slice(1).map((block) => block.score),
    baseline.blocks.slice(1).map((block) => block.score),
    `${runId} isolated precipitation change leaked across blocks`,
  );

  const tomorrowDate = addDays(date, 1);
  const tomorrow = scoreActivity({
    rules: run.activity,
    requestDate: date,
    targetDate: tomorrowDate,
    runStage: resolveRunStage(run, tomorrowDate).stage,
    staging: false,
    waterTempF: null,
    temperatureTrend: "neutral_missing",
    gaugeFreshness: "missing",
    weatherFreshness: "fresh",
    flowSignal: "unknown",
    hourlyWeather: weather(tomorrowDate),
  });
  assert.equal(tomorrow.targetDayLabel, "Tomorrow");
  assert(
    tomorrow.blocks.every((block) =>
      block.score <= (run.activity!.caps.weatherOnlyTomorrowMaximum ?? 100)
    ),
  );

  if (run.species === "steelhead") {
    assert.equal(run.activity.caps.weatherOnlyEvidenceScale, 0.8);
    assert(
      baseline.blocks.every((block) => block.score <= 80),
      `${runId} weather-only secondary inputs must not claim Highly active Steelhead`,
    );
    const comparisonDates = [
      run.runWindow.peak,
      run.runWindow.taperingEnd,
      run.runWindow.end,
      run.runWindow.lateEnd,
    ].map((monthDay) => seasonDate(2026, monthDay, run.runWindow.stagingStart));
    const comparisonScores = comparisonDates.map((comparisonDate) =>
      result(run, comparisonDate, weather(comparisonDate)).score
    );
    assert(
      comparisonScores.every((score) => score === comparisonScores[0]),
      `${runId} inherited salmon lifecycle behavior`,
    );
  } else {
    assert(run.activity.caps.lifecycleRamp);
    const ramp = run.activity.caps.lifecycleRamp;
    const start = seasonDate(2026, ramp.peakEnd, run.runWindow.stagingStart);
    const end = seasonDate(2026, ramp.endingEnd, run.runWindow.stagingStart);
    const lifecycleScores: number[] = [];
    for (
      let lifecycleDate = start;
      lifecycleDate <= end;
      lifecycleDate = addDays(lifecycleDate, 1)
    ) {
      lifecycleScores.push(
        result(run, lifecycleDate, weather(lifecycleDate)).score ?? 0,
      );
    }
    const deltas = lifecycleScores.slice(1).map((score, index) =>
      score - lifecycleScores[index]
    );
    assert(Math.max(...deltas.map(Math.abs)) <= 2, `${runId} lifecycle cliff`);
    assert(lifecycleScores.at(-1)! < lifecycleScores[0]);
  }
}

console.log(
  `Platte weather-only Activity QA passed for ${runIds.length} public river/species profiles.`,
);

function result(
  run: (typeof RIVER_RUN_DRAFT_RUN_PROFILES)[number],
  date: string,
  hourlyWeather: ActivityWeatherHour[],
) {
  return scoreActivity({
    rules: run.activity!,
    requestDate: date,
    targetDate: date,
    runStage: resolveRunStage(run, date).stage,
    staging: false,
    waterTempF: null,
    temperatureTrend: "neutral_missing",
    gaugeFreshness: "missing",
    weatherFreshness: "fresh",
    flowSignal: "unknown",
    hourlyWeather,
  });
}

function weather(date: string): ActivityWeatherHour[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
    cloud_cover_pct: 35,
    shortwave_w_m2: hour >= 5 && hour < 21 ? 450 : 0,
    clear_sky_shortwave_w_m2: hour >= 5 && hour < 21 ? 600 : 0,
    precipitation_in: 0,
  }));
}

function seasonDate(startYear: number, monthDay: string, start: string) {
  return `${monthDay < start ? startYear + 1 : startYear}-${monthDay}`;
}

function round4(value: number) {
  return Math.round(value * 10_000) / 10_000;
}
