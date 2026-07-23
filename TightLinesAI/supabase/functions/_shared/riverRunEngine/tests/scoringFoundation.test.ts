import { assert, assertEquals } from "jsr:@std/assert";
import {
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  resolveActiveRunWindow,
  resolveFavorability,
  resolveRainSignal,
  resolveRunStage,
  resolveTemperatureTrendSignal,
  type RiverRunProfile,
  scoreFishability,
  scoreFishInRiver,
  scorePush,
} from "../index.ts";

const pmRun = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;

function runWith(overrides: Partial<RiverRunProfile>): RiverRunProfile {
  return {
    ...pmRun,
    ...overrides,
    runWindow: {
      ...pmRun.runWindow,
      ...overrides.runWindow,
    },
  };
}

Deno.test("Run Stage scenarios cover pre-run through post-run", () => {
  assertEquals(resolveRunStage(pmRun, "2026-08-10").stage, "pre_run");
  assertEquals(resolveRunStage(pmRun, "2026-08-25").stage, "beginning");
  assertEquals(resolveRunStage(pmRun, "2026-09-10").stage, "building");
  assertEquals(resolveRunStage(pmRun, "2026-09-20").stage, "peak");
  assertEquals(resolveRunStage(pmRun, "2026-10-01").stage, "tapering");
  assertEquals(resolveRunStage(pmRun, "2026-10-15").stage, "ending");
  assertEquals(resolveRunStage(pmRun, "2026-11-05").stage, "post_run");
});

Deno.test("cross-year run window selects active year around snapshot date", () => {
  const winterRun = runWith({
    runWindow: {
      start: "12-15",
      peak: "01-10",
      end: "02-15",
      peakWindowDays: 5,
    },
  });

  const window = resolveActiveRunWindow(winterRun, "2027-01-05");

  assertEquals(window.startDate, "2026-12-15");
  assertEquals(window.peakDate, "2027-01-10");
  assertEquals(window.endDate, "2027-02-15");
});

Deno.test("Fish In River applies pre-run cap, peak signature score, weak cap, and post-run cap", () => {
  const preRun = scoreFishInRiver(pmRun, "2026-08-15");
  const peakSignature = scoreFishInRiver(pmRun, "2026-09-20");
  const weakPeak = scoreFishInRiver(runWith({ runStrength: 1 }), "2026-09-20");
  const postRun = scoreFishInRiver(pmRun, "2026-11-10");

  assert(preRun.score !== null && preRun.score! <= 39);
  assertEquals(peakSignature.score, 100);
  assertEquals(peakSignature.label, "Peak presence");
  assert(weakPeak.score !== null && weakPeak.score! <= 55);
  assert(postRun.score !== null && postRun.score! <= 10);
});

Deno.test("rain missing and dry produce different fall profile movement effects", () => {
  const missingRain = resolveRainSignal({
    rain48hIn: null,
    rain72hIn: null,
  });
  const dryRain = resolveRainSignal({ rain48hIn: 0.02, rain72hIn: 0.04 });
  const missingFavorability = resolveFavorability({
    behaviorProfile: "fall_cooling_rain_pulse",
    rainSignal: missingRain.rawSignal,
    flowSignal: "stable",
    temperatureSignal: "neutral_missing",
    temperatureSourceType: "unavailable",
    flowBand: "normal_fishable",
  });
  const dryFavorability = resolveFavorability({
    behaviorProfile: "fall_cooling_rain_pulse",
    rainSignal: dryRain.rawSignal,
    flowSignal: "stable",
    temperatureSignal: "neutral_missing",
    temperatureSourceType: "unavailable",
    flowBand: "normal_fishable",
  });

  assertEquals(missingRain.rawSignal, "missing_rain_data");
  assertEquals(dryRain.rawSignal, "dry");
  assertEquals(missingFavorability.rainSignal, 0);
  assertEquals(dryFavorability.rainSignal, -1);
});

Deno.test("fall cooling rain plus rise plus cooling produces Very strong Push", () => {
  const result = scorePush({
    behaviorProfile: "fall_cooling_rain_pulse",
    gaugeFreshness: "fresh",
    rainSignal: "heavy_rain",
    flowSignal: "meaningful_rise",
    temperatureSignal: "strong_cooling",
    temperatureSourceType: "same_gauge",
    flowBand: "ideal",
  });

  assertEquals(result.score, 91);
  assertEquals(result.label, "Very strong");
  assertEquals(result.favorability?.favorabilityLevel, "very_favorable");
});

Deno.test("fall cooling warm dry falling produces Weak Push", () => {
  const result = scorePush({
    behaviorProfile: "fall_cooling_rain_pulse",
    gaugeFreshness: "fresh",
    rainSignal: "dry",
    flowSignal: "falling",
    temperatureSignal: "strong_warming",
    temperatureSourceType: "same_gauge",
    flowBand: "low",
  });

  assertEquals(result.score, 10);
  assertEquals(result.label, "Weak");
});

Deno.test("stale gauge caps Push at 55", () => {
  const result = scorePush({
    behaviorProfile: "fall_cooling_rain_pulse",
    gaugeFreshness: "stale",
    rainSignal: "heavy_rain",
    flowSignal: "meaningful_rise",
    temperatureSignal: "strong_cooling",
    temperatureSourceType: "same_gauge",
    flowBand: "ideal",
  });

  assertEquals(result.score, 55);
  assert(result.reasonCodes.includes("gauge_stale"));
});

Deno.test("missing gauge makes Push unavailable", () => {
  const result = scorePush({
    behaviorProfile: "fall_cooling_rain_pulse",
    gaugeFreshness: "missing",
    rainSignal: "heavy_rain",
    flowSignal: "meaningful_rise",
    temperatureSignal: "strong_cooling",
    temperatureSourceType: "same_gauge",
    flowBand: "ideal",
  });

  assertEquals(result.score, null);
  assertEquals(result.label, "Unavailable");
  assert(result.reasonCodes.includes("gauge_missing"));
});

Deno.test("ideal stable fishability is Excellent", () => {
  const result = scoreFishability({
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "stable",
    rainSignal: "dry",
  });

  assertEquals(result.score, 89);
  assertEquals(result.label, "Excellent");
});

Deno.test("blown out fishability cap applies", () => {
  const result = scoreFishability({
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "blown_out",
    flowSignal: "sharp_rise",
    rainSignal: "heavy_rain",
  });

  assert(result.score !== null && result.score! <= 25);
});

Deno.test("very low fishability cap applies", () => {
  const result = scoreFishability({
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "very_low",
    flowSignal: "stable",
    rainSignal: "dry",
  });

  assert(result.score !== null && result.score! <= 45);
});

Deno.test("missing gauge makes Fishability unavailable", () => {
  const result = scoreFishability({
    gaugeFreshness: "missing",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "stable",
    rainSignal: "dry",
  });

  assertEquals(result.score, null);
  assertEquals(result.label, "Unavailable");
  assert(result.reasonCodes.includes("gauge_missing"));
});

Deno.test("air proxy temp signal cannot produce +2 or -2", () => {
  const cooling = resolveFavorability({
    behaviorProfile: "fall_cooling_rain_pulse",
    rainSignal: "dry",
    flowSignal: "stable",
    temperatureSignal: "strong_cooling",
    temperatureSourceType: "air_temp_proxy",
    flowBand: "normal_fishable",
  });
  const warming = resolveFavorability({
    behaviorProfile: "fall_cooling_rain_pulse",
    rainSignal: "dry",
    flowSignal: "stable",
    temperatureSignal: "strong_warming",
    temperatureSourceType: "air_temp_proxy",
    flowBand: "normal_fishable",
  });

  assertEquals(cooling.tempSignal, 1);
  assertEquals(warming.tempSignal, -1);
});

Deno.test("neutral observed temperature is not marked temperature_neutral_missing", () => {
  const result = resolveTemperatureTrendSignal({
    sourceType: "same_gauge",
    delta72hF: 0.5,
    delta24hF: 0.2,
    hasEnoughValues: true,
  });

  assertEquals(result.rawSignal, "neutral");
  assert(result.reasonCodes.includes("temperature_measured"));
  assertEquals(
    result.reasonCodes.includes("temperature_neutral_missing"),
    false,
  );
});
