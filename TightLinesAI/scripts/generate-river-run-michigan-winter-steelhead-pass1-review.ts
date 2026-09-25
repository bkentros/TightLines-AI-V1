import {
  type ActivityWeatherHour,
  type AuditedRiverRunProfile,
  BIG_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
  GRAND_WINTER_STEELHEAD_RUN_PROFILE,
  MUSKEGON_WINTER_STEELHEAD_RUN_PROFILE,
  PERE_MARQUETTE_WINTER_STEELHEAD_RUN_PROFILE,
  type RawTemperatureTrendSignal,
  resolveRunStage,
  scoreActivity,
  scoreFishInRiver,
  ST_JOSEPH_WINTER_STEELHEAD_RUN_PROFILE,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

const OUTPUT = new URL(
  "../docs/audits/river-run-michigan-winter-steelhead-pass1-review.json",
  import.meta.url,
);
const runs = [
  PERE_MARQUETTE_WINTER_STEELHEAD_RUN_PROFILE,
  BIG_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
  MUSKEGON_WINTER_STEELHEAD_RUN_PROFILE,
  ST_JOSEPH_WINTER_STEELHEAD_RUN_PROFILE,
  GRAND_WINTER_STEELHEAD_RUN_PROFILE,
];

const fixture = {
  schemaVersion: "michigan-winter-steelhead-pass1-review-v1",
  generatedFrom: "deterministic engine inputs; no live provider data",
  disclaimer:
    "Pass 1 verifies lifecycle, handoff continuity, scoring direction, daylight windows, and fail-safes. Historical calibration is reserved for Pass 2.",
  rivers: runs.map(reviewRun),
};
const serialized = `${JSON.stringify(fixture, null, 2)}\n`;

if (Deno.args.includes("--check")) {
  const current = await Deno.readTextFile(OUTPUT);
  if (current !== serialized) {
    throw new Error("Winter Steelhead Pass 1 review fixture is stale.");
  }
  console.log("Winter Steelhead Pass 1 review fixture is current.");
} else {
  await Deno.writeTextFile(OUTPUT, serialized);
  console.log(`Wrote ${OUTPUT.pathname}`);
}

function reviewRun(run: AuditedRiverRunProfile) {
  const winterYear = 2027;
  const activation = run.runWindow.start === "01-01"
    ? `${winterYear}-01-01`
    : `${winterYear - 1}-12-23`;
  const before = run.runWindow.start === "01-01"
    ? `${winterYear - 1}-12-31`
    : `${winterYear - 1}-12-22`;
  const lifecycleDates = [
    ["before_activation", before],
    ["activation", activation],
    ["core_hold", `${winterYear}-01-08`],
    ["spring_approach", `${winterYear}-02-15`],
    ["winter_end", `${winterYear}-02-28`],
    ["after_winter", `${winterYear}-03-01`],
  ] as const;
  return {
    riverId: run.riverId,
    runId: run.runId,
    activation,
    capabilities: run.primitiveCapabilities,
    lifecycle: lifecycleDates.map(([id, date]) => ({
      id,
      date,
      phase: resolveRunStage(run, date).label,
      presence: scoreFishInRiver(run, date).score,
    })),
    activity: [
      activityScenario(
        run,
        "near_freezing_cloudy",
        33,
        "warming",
        100,
        "ideal",
      ),
      activityScenario(run, "stable_suitable_clear", 40, "neutral", 0, "ideal"),
      activityScenario(
        run,
        "warming_suitable_cloudy",
        40,
        "warming",
        90,
        "ideal",
      ),
      activityScenario(
        run,
        "large_warming_swing",
        40,
        "strong_warming",
        90,
        "ideal",
      ),
      activityScenario(run, "blown_out", 40, "warming", 90, "blown_out"),
      activityScenario(
        run,
        "missing_water_temperature",
        null,
        "neutral_missing",
        90,
        "ideal",
      ),
    ],
  };
}

function activityScenario(
  run: AuditedRiverRunProfile,
  id: string,
  waterTempF: number | null,
  trend: RawTemperatureTrendSignal,
  cloud: number,
  flowBand: "ideal" | "blown_out",
) {
  const date = "2027-01-20";
  const ideal = run.fishabilityBands!.ideal;
  const result = scoreActivity({
    rules: run.activity!,
    requestDate: date,
    targetDate: date,
    runStage: "building",
    staging: false,
    waterTempF,
    waterTemperatureFreshness: waterTempF == null ? "missing" : "fresh",
    temperatureTrend: trend,
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand,
    currentHydraulicValue: (ideal.min + ideal.max) / 2,
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: reviewWeather(date, cloud),
    refreshSlot: "07:00",
    copyStrategy: run.runStageCopyStrategy,
  });
  return {
    id,
    waterTempF,
    trend,
    cloudCoverPct: cloud,
    flowBand,
    score: result.score,
    label: result.label,
    confidence: result.confidence,
    daylightBlocks: result.blocks.map((block) => ({
      id: block.id,
      label: block.label,
      score: block.score,
    })),
    reasonCodes: result.reasonCodes,
  };
}

function reviewWeather(date: string, cloud: number): ActivityWeatherHour[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
    cloud_cover_pct: cloud,
    shortwave_w_m2: hour >= 8 && hour < 17
      ? Math.round(500 * (1 - cloud / 125))
      : 0,
    clear_sky_shortwave_w_m2: hour >= 8 && hour < 17 ? 500 : 0,
    precipitation_in: 0,
    temperature_2m_f: 34,
    is_day: hour >= 8 && hour < 17 ? 1 : 0,
  }));
}
