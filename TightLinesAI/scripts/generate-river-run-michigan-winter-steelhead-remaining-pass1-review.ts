import {
  type ActivityWeatherHour,
  type AuditedRiverRunProfile,
  BEAR_CREEK_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
  BETSIE_WINTER_STEELHEAD_RUN_PROFILE,
  PLATTE_WINTER_STEELHEAD_RUN_PROFILE,
  resolveRunStage,
  ROGUE_MI_WINTER_STEELHEAD_RUN_PROFILE,
  scoreActivity,
  scoreFishInRiver,
  WHITE_WINTER_STEELHEAD_RUN_PROFILE,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";
import { riverRunSpotFinderForRiver } from "../lib/riverRunSpotFinder.ts";

const OUTPUT = new URL(
  "../docs/audits/river-run-michigan-winter-steelhead-remaining-pass1-review.json",
  import.meta.url,
);
const runs = [
  BETSIE_WINTER_STEELHEAD_RUN_PROFILE,
  BEAR_CREEK_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
  ROGUE_MI_WINTER_STEELHEAD_RUN_PROFILE,
  PLATTE_WINTER_STEELHEAD_RUN_PROFILE,
  WHITE_WINTER_STEELHEAD_RUN_PROFILE,
];

const fixture = {
  schemaVersion: "michigan-winter-steelhead-remaining-pass1-review-v1",
  generatedFrom:
    "deterministic engine inputs; no live or historical provider data",
  disclaimer:
    "Pass 1 accepts authoritative evidence, exact fall-to-winter gating, source isolation, deterministic Activity behavior, copy, fail-safes, and full-corridor Spot Finder behavior. Historical replay and final calibration remain Pass 2.",
  evidence: [
    {
      source: "Michigan DNR Steelhead species profile",
      url:
        "https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead",
      supports:
        "fall entry, overwinter retention, and spring spawning lifecycle",
    },
    {
      source: "Workman, Hayes, and Coon (Transactions of the AFS 131:463–475)",
      url: "https://academic.oup.com/tafs/article-abstract/131/3/463/7891291",
      supports:
        "water temperature as a major adult Steelhead movement correlate",
    },
    {
      source: "Michigan DNR Central Lake Michigan Management Unit",
      url:
        "https://www.michigan.gov/dnr/managing-resources/fisheries/units/c-michigan",
      supports: "Betsie Homestead access and Steelhead fishery context",
    },
    {
      source: "Michigan DNR Better Fishing Waters",
      url:
        "https://www.michigan.gov/dnr/things-to-do/fishing/where/better-fishing-waters",
      supports:
        "agency-recognized Betsie, Rogue, and Platte Steelhead opportunity",
    },
    {
      source: "Michigan DNR Rogue River Natural River Plan",
      url:
        "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/NaturalRivers/Rogue_River_Plan.pdf?rev=6a9bfe649fa541dda8675bc3cef972ec",
      supports:
        "Rogue corridor characteristics and public river access at bridge crossings",
    },
    {
      source: "National Park Service Platte River Point Water Access",
      url: "https://www.nps.gov/places/000/platte-river-point-water-access.htm",
      supports:
        "Platte River Point, El Dorado, and Fish Weir lower-corridor access",
    },
    {
      source: "Michigan DNR Lower White River Status Report 2012-121",
      url:
        "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Status/folder1/2012-121.pdf",
      supports:
        "winter-run Steelhead stocking and below-Hesperia fishery history",
    },
  ],
  rivers: runs.map(reviewRun),
};
const serialized = `${JSON.stringify(fixture, null, 2)}\n`;

if (Deno.args.includes("--check")) {
  const current = await Deno.readTextFile(OUTPUT);
  if (current !== serialized) {
    throw new Error(
      "Remaining Michigan Winter Steelhead Pass 1 review fixture is stale.",
    );
  }
  console.log(
    "Remaining Michigan Winter Steelhead Pass 1 review fixture is current.",
  );
} else {
  await Deno.writeTextFile(OUTPUT, serialized);
  console.log(`Wrote ${OUTPUT.pathname}`);
}

function reviewRun(run: AuditedRiverRunProfile) {
  const activation = dateForMonthDay(run.runWindow.start);
  const before = shiftDate(activation, -1);
  const finder = riverRunSpotFinderForRiver(run.riverId, "steelhead", "MI");
  return {
    riverId: run.riverId,
    runId: run.runId,
    activityMode: run.activity?.winterTemperatureMode,
    activityWeights: run.activity?.weights,
    activityScope: run.activity?.scopeCopy,
    activation,
    lifecycle: [
      ["before_activation", before],
      ["activation", activation],
      ["core_hold", "2027-01-08"],
      ["spring_approach", "2027-02-15"],
      ["winter_end", "2027-02-28"],
      ["after_winter", "2027-03-01"],
    ].map(([id, date]) => ({
      id,
      date,
      phase: resolveRunStage(run, date).label,
      presence: scoreFishInRiver(run, date).score,
    })),
    activity: run.activity?.winterTemperatureMode === "measured_water"
      ? measuredScenarios(run)
      : proxyScenarios(run),
    spotFinder: {
      sectionIds: finder?.sections.map((section) => section.id) ?? [],
      foundationReachIds:
        finder?.sections.flatMap((section) => section.foundationReachIds) ?? [],
      preferredStartReachIds:
        run.seasonalZonePlan?.winterHoldingGuidance?.preferredStartReachIds ??
          [],
      allCorridorSectionsViable: true,
    },
  };
}

function proxyScenarios(run: AuditedRiverRunProfile) {
  const scenarios = [
    proxyScenario(run, "stable_mild_cloudy", [36, 36, 36, 36], 85, "ideal"),
    proxyScenario(run, "gradual_warming", [27, 30, 33, 36], 70, "ideal"),
    proxyScenario(run, "stable_cold", [17, 17, 17, 17], 85, "ideal"),
    proxyScenario(run, "large_swing", [18, 40, 19, 39], 85, "ideal"),
    proxyScenario(run, "clear_stable_28f", [28, 28, 28, 28], 0, "ideal"),
    proxyScenario(run, "cloudy_stable_28f", [28, 28, 28, 28], 90, "ideal"),
  ];
  if (run.fishabilityBands) {
    scenarios.push(
      proxyScenario(run, "blown_out", [32, 34, 36, 38], 85, "blown_out"),
    );
  }
  return scenarios;
}

function proxyScenario(
  run: AuditedRiverRunProfile,
  id: string,
  temperatures: [number, number, number, number],
  cloud: number,
  flowBand: "ideal" | "blown_out",
) {
  const dates = ["2027-01-17", "2027-01-18", "2027-01-19", "2027-01-20"];
  const bands = run.fishabilityBands;
  const result = scoreActivity({
    rules: run.activity!,
    requestDate: "2027-01-20",
    targetDate: "2027-01-20",
    runStage: "building",
    staging: false,
    waterTempF: null,
    waterTemperatureFreshness: "missing",
    temperatureTrend: "neutral_missing",
    gaugeFreshness: bands ? "fresh" : "missing",
    weatherFreshness: "fresh",
    flowBand: bands ? flowBand : undefined,
    currentHydraulicValue: bands
      ? (bands.ideal.min + bands.ideal.max) / 2
      : null,
    fishabilityBands: bands,
    flowSignal: "stable",
    hourlyWeather: dates.flatMap((date, index) =>
      weather(date, temperatures[index], cloud)
    ),
    refreshSlot: "07:00",
    copyStrategy: run.runStageCopyStrategy,
  });
  return summarizeActivity(id, result);
}

function measuredScenarios(run: AuditedRiverRunProfile) {
  return [
    measuredScenario(run, "near_freezing", 33, "warming", 100, "ideal"),
    measuredScenario(run, "stable_suitable", 40, "neutral", 70, "ideal"),
    measuredScenario(run, "warming_suitable", 40, "warming", 70, "ideal"),
    measuredScenario(
      run,
      "large_warming_swing",
      40,
      "strong_warming",
      70,
      "ideal",
    ),
    measuredScenario(run, "blown_out", 40, "warming", 90, "blown_out"),
  ];
}

function measuredScenario(
  run: AuditedRiverRunProfile,
  id: string,
  waterTempF: number,
  trend: "neutral" | "warming" | "strong_warming",
  cloud: number,
  flowBand: "ideal" | "blown_out",
) {
  const bands = run.fishabilityBands!;
  const result = scoreActivity({
    rules: run.activity!,
    requestDate: "2027-01-20",
    targetDate: "2027-01-20",
    runStage: "building",
    staging: false,
    waterTempF,
    waterTemperatureFreshness: "fresh",
    temperatureTrend: trend,
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand,
    currentHydraulicValue: (bands.ideal.min + bands.ideal.max) / 2,
    fishabilityBands: bands,
    flowSignal: "stable",
    hourlyWeather: weather("2027-01-20", 34, cloud),
    refreshSlot: "07:00",
    copyStrategy: run.runStageCopyStrategy,
  });
  return summarizeActivity(id, result);
}

function summarizeActivity(
  id: string,
  result: ReturnType<typeof scoreActivity>,
) {
  return {
    id,
    score: result.score,
    label: result.label,
    confidence: result.confidence,
    reasonCodes: result.reasonCodes,
    daylightBlocks: result.blocks.map((block) => ({
      id: block.id,
      label: block.label,
      score: block.score,
    })),
  };
}

function weather(
  date: string,
  temperatureF: number,
  cloud: number,
): ActivityWeatherHour[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
    cloud_cover_pct: cloud,
    shortwave_w_m2: hour >= 8 && hour < 17
      ? Math.round(500 * (1 - cloud / 125))
      : 0,
    clear_sky_shortwave_w_m2: hour >= 8 && hour < 17 ? 500 : 0,
    precipitation_in: 0,
    temperature_2m_f: temperatureF,
    is_day: hour >= 8 && hour < 17 ? 1 : 0,
  }));
}

function dateForMonthDay(monthDay: string): string {
  return monthDay.startsWith("01-") || monthDay.startsWith("02-")
    ? `2027-${monthDay}`
    : `2026-${monthDay}`;
}

function shiftDate(date: string, days: number): string {
  return new Date(Date.parse(`${date}T12:00:00Z`) + days * 86_400_000)
    .toISOString().slice(0, 10);
}
