import {
  addDays,
  BIG_MANISTEE_CONFIGURATION_DOCUMENT,
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
  BIG_MANISTEE_FALL_COHO_RUN_PROFILE,
  BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  buildConditionRefresh,
  buildDailySnapshot,
  canonicalBaselineDay,
  type ConditionsSuggestEvidenceByDate,
  daysBetween,
  MUSKEGON_CONFIGURATION_DOCUMENT,
  MUSKEGON_FALL_CHINOOK_RUN_PROFILE,
  MUSKEGON_FALL_COHO_RUN_PROFILE,
  MUSKEGON_FALL_STEELHEAD_RUN_PROFILE,
  MUSKEGON_RIVER_PROFILE,
  resolveConditionsSuggestCheckpoints,
  resolveFlowBand,
  type RiverRunConditionRefresh,
  type RiverRunConditionsSuggestBaseline,
  scoreConditionsSuggest,
  ST_JOSEPH_CONFIGURATION_DOCUMENT,
  ST_JOSEPH_FALL_CHINOOK_RUN_PROFILE,
  ST_JOSEPH_FALL_COHO_RUN_PROFILE,
  ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE,
  ST_JOSEPH_RIVER_PROFILE,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";
import type { RiverRunSnapshotResponse } from "../lib/riverRunContracts.ts";
import type { RiverRunReviewGroup } from "../lib/riverRunReviewFixtures.types.ts";
import { buildReviewLiveConditionsFixture } from "./river-run-review-live-conditions-fixture.ts";

const requestedRunId = argumentValue("--run-id") ??
  "big_manistee_fall_chinook";
if (
  requestedRunId !== "big_manistee_fall_chinook" &&
  requestedRunId !== "big_manistee_fall_coho" &&
  requestedRunId !== "big_manistee_fall_steelhead" &&
  requestedRunId !== "muskegon_fall_chinook" &&
  requestedRunId !== "muskegon_fall_coho" &&
  requestedRunId !== "muskegon_fall_steelhead" &&
  requestedRunId !== "st_joseph_fall_chinook" &&
  requestedRunId !== "st_joseph_fall_coho" &&
  requestedRunId !== "st_joseph_fall_steelhead"
) {
  throw new Error(
    `Unsupported regulated-tailwater review run: ${requestedRunId}`,
  );
}
const muskegon = requestedRunId.startsWith("muskegon_");
const stJoseph = requestedRunId.startsWith("st_joseph_");
const coho = requestedRunId.endsWith("_coho");
const steelhead = requestedRunId.endsWith("_steelhead");
const run = stJoseph
  ? steelhead
    ? ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE
    : coho
    ? ST_JOSEPH_FALL_COHO_RUN_PROFILE
    : ST_JOSEPH_FALL_CHINOOK_RUN_PROFILE
  : muskegon
  ? steelhead
    ? MUSKEGON_FALL_STEELHEAD_RUN_PROFILE
    : coho
    ? MUSKEGON_FALL_COHO_RUN_PROFILE
    : MUSKEGON_FALL_CHINOOK_RUN_PROFILE
  : steelhead
  ? BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE
  : coho
  ? BIG_MANISTEE_FALL_COHO_RUN_PROFILE
  : BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE;
const river = stJoseph
  ? ST_JOSEPH_RIVER_PROFILE
  : muskegon
  ? MUSKEGON_RIVER_PROFILE
  : BIG_MANISTEE_RIVER_PROFILE;
const configuration = stJoseph
  ? ST_JOSEPH_CONFIGURATION_DOCUMENT
  : muskegon
  ? MUSKEGON_CONFIGURATION_DOCUMENT
  : BIG_MANISTEE_CONFIGURATION_DOCUMENT;
const configVersion = configuration.configVersion;
const gaugeSiteId =
  river.hydraulicSources.find((source) => source.role === "primary")!.siteId;
const temperatureSource = river.waterTemperatureSources[0];
const weatherPoint = river.weatherPoints.find((point) =>
  point.role === "primary"
)!;
const engineVersion = "river-run-v1.5.3-review";
const flow = stJoseph
  ? {
    veryLow: 1200,
    low: 1550,
    ideal: 2300,
    high: 4100,
    veryHigh: 5800,
    blown: 7000,
  }
  : muskegon
  ? {
    veryLow: 800,
    low: 1000,
    ideal: 1500,
    high: 2500,
    veryHigh: 4000,
    blown: 5200,
  }
  : {
    veryLow: 1050,
    low: 1200,
    ideal: 1650,
    high: 2300,
    veryHigh: 2800,
    blown: 3600,
  };

const stageDates = stJoseph && steelhead
  ? [
    ["offseason", "Before fall monitoring", "2026-07-31"],
    ["before_staging", "Skamania context", "2026-08-20"],
    ["staging", "Winter-run staging watch", "2026-09-10"],
    ["beginning_initial", "Beginning · first entry", "2026-09-25"],
    ["beginning_accumulating", "Beginning · accumulating", "2026-10-05"],
    ["building_established", "Building · established", "2026-10-15"],
    ["building_broad", "Building · broad corridor", "2026-11-01"],
    ["peak_core", "Peak · core", "2026-11-15"],
    ["peak_late", "Peak · late", "2026-12-01"],
    ["tapering", "Late fall", "2026-12-12"],
    ["ending", "Holding transition", "2026-12-20"],
    ["winter_holding", "Winter holding handoff", "2026-12-23"],
  ]
  : stJoseph && coho
  ? [
    ["offseason", "True offseason", "2026-08-09"],
    ["before_staging", "Before staging", "2026-08-15"],
    ["staging", "Lower-river staging", "2026-08-20"],
    ["beginning_initial", "Beginning · initial entry", "2026-09-01"],
    ["beginning_accumulating", "Beginning · accumulating", "2026-09-20"],
    ["building_established", "Building · established", "2026-10-01"],
    ["peak_core", "Peak · core", "2026-10-10"],
    ["peak_shoulder", "Peak · shoulder", "2026-10-25"],
    ["tapering", "Tapering", "2026-11-08"],
    ["ending", "Ending", "2026-11-20"],
    ["post_run", "Sparse late tail", "2026-12-01"],
    ["after", "After migration", "2026-12-06"],
  ]
  : stJoseph
  ? [
    ["offseason", "True offseason", "2026-07-31"],
    ["before_staging", "Before staging", "2026-08-10"],
    ["staging", "Lower-river staging", "2026-08-15"],
    ["beginning_initial", "Beginning · sectional entry", "2026-09-01"],
    ["building_established", "Building · established", "2026-09-15"],
    ["peak_core", "Peak · core", "2026-09-25"],
    ["peak_shoulder", "Peak · shoulder", "2026-10-05"],
    ["tapering", "Tapering", "2026-10-15"],
    ["ending", "Ending", "2026-10-27"],
    ["post_run", "Sparse late tail", "2026-11-05"],
    ["after", "After migration", "2026-11-09"],
  ]
  : muskegon && steelhead
  ? [
    ["offseason", "Before fall monitoring", "2026-08-19"],
    ["before_staging", "Before staging", "2026-09-01"],
    ["staging", "Lakeward staging", "2026-09-10"],
    ["beginning_initial", "Beginning · first entry", "2026-09-25"],
    ["beginning_accumulating", "Beginning · scattered fish", "2026-10-05"],
    ["building_established", "Building · established", "2026-10-15"],
    ["building_late", "Building · late October", "2026-10-25"],
    ["building_broad", "Building · broad", "2026-11-01"],
    ["peak_approach", "Peak · approach", "2026-11-10"],
    ["peak_core", "Peak · core", "2026-11-15"],
    ["peak_late", "Peak · late", "2026-11-30"],
    ["tapering", "Late fall", "2026-12-05"],
    ["ending", "Holding transition", "2026-12-20"],
    ["winter_holding", "Winter holding handoff", "2026-12-23"],
  ]
  : muskegon && coho
  ? [
    ["offseason", "True offseason", "2026-12-10"],
    ["before_staging", "Before staging", "2026-08-25"],
    ["staging", "Muskegon Lake staging", "2026-09-05"],
    ["beginning_initial", "Beginning · initial entry", "2026-09-15"],
    ["beginning_accumulating", "Beginning · scattered fish", "2026-09-25"],
    ["building_established", "Building · established", "2026-10-01"],
    ["building_broad", "Building · sectional", "2026-10-12"],
    ["peak_approach", "Peak · approach", "2026-10-20"],
    ["peak_core", "Peak · core", "2026-10-25"],
    ["peak_shoulder", "Peak · shoulder", "2026-11-03"],
    ["tapering_early", "Tapering · early", "2026-11-06"],
    ["tapering_late", "Tapering · late", "2026-11-14"],
    ["ending_early", "Ending · early", "2026-11-16"],
    ["ending_late", "Ending · late", "2026-11-29"],
    ["post_run", "Sparse late tail", "2026-12-05"],
  ]
  : muskegon
  ? [
    ["offseason", "True offseason", "2026-11-15"],
    ["before_staging", "Before staging", "2026-07-20"],
    ["staging", "Muskegon Lake staging", "2026-08-12"],
    ["beginning_initial", "Beginning · initial entry", "2026-08-20"],
    [
      "beginning_accumulating",
      "Beginning · scattered corridor fish",
      "2026-08-28",
    ],
    ["building_early", "Building · early", "2026-09-05"],
    ["building_broad", "Building · broad corridor", "2026-09-15"],
    ["peak_approach", "Peak · approach", "2026-09-25"],
    ["peak_core", "Peak · core", "2026-10-01"],
    ["peak_shoulder", "Peak · October shoulder", "2026-10-10"],
    ["tapering_early", "Tapering · early", "2026-10-13"],
    ["tapering_late", "Tapering · late October", "2026-10-24"],
    ["ending_early", "Ending · residual corridor fish", "2026-10-27"],
    ["ending_late", "Ending · late", "2026-11-04"],
    ["post_run", "Sparse late tail", "2026-11-10"],
  ]
  : steelhead
  ? [
    ["offseason", "True offseason", "2026-08-14"],
    ["before_staging", "Before fall-entry monitoring", "2026-08-15"],
    ["staging", "Staging · early Steelhead context", "2026-09-01"],
    ["beginning_initial", "Beginning · exploratory entry", "2026-09-15"],
    ["beginning_early", "Beginning · early entry", "2026-09-20"],
    ["beginning_accumulating", "Beginning · accumulating", "2026-10-01"],
    ["building_early", "Building · early", "2026-10-11"],
    ["building_established", "Building · established", "2026-10-15"],
    ["building_broad", "Building · broad", "2026-11-01"],
    ["peak_core", "Peak · core", "2026-11-15"],
    ["peak_late", "Peak · late", "2026-11-25"],
    ["tapering", "Late fall", "2026-12-05"],
    ["ending", "Holding transition", "2026-12-20"],
    ["fall_entry_complete", "Fall entry complete", "2026-12-23"],
  ]
  : coho
  ? [
    ["offseason", "True offseason", "2026-12-13"],
    ["before_staging", "Before staging", "2026-08-25"],
    ["staging", "Staging", "2026-09-01"],
    ["beginning_initial", "Beginning · initial entry", "2026-09-10"],
    ["beginning_accumulating", "Beginning · accumulating", "2026-09-20"],
    ["building_established", "Building · established", "2026-10-01"],
    ["building_late", "Building · late", "2026-10-10"],
    ["peak_approach", "Peak · approach", "2026-10-15"],
    ["peak_core", "Peak · core", "2026-10-20"],
    ["peak_shoulder", "Peak · shoulder", "2026-10-27"],
    ["tapering_early", "Tapering · early", "2026-11-01"],
    ["tapering_late", "Tapering · late", "2026-11-07"],
    ["ending", "Ending", "2026-11-11"],
    ["ending_residual", "Ending · residual", "2026-11-20"],
    ["post_run", "Late tail", "2026-12-01"],
  ]
  : [
    ["offseason", "True offseason", "2026-11-13"],
    ["before_staging", "Before staging", "2026-07-15"],
    ["staging", "Staging", "2026-08-01"],
    ["beginning_initial", "Beginning · initial entry", "2026-08-15"],
    ["beginning_accumulating", "Beginning · accumulating", "2026-08-22"],
    ["building_established", "Building · established", "2026-09-01"],
    ["building_broad", "Building · broad", "2026-09-10"],
    ["peak_approach", "Peak · approach", "2026-09-20"],
    ["peak_core", "Peak · core", "2026-09-30"],
    ["peak_shoulder", "Peak · shoulder", "2026-10-06"],
    ["tapering_early", "Tapering · early", "2026-10-11"],
    ["tapering_late", "Tapering · late", "2026-10-16"],
    ["ending", "Ending", "2026-10-21"],
    ["ending_residual", "Ending · residual", "2026-10-27"],
    ["post_run", "Late tail", "2026-11-01"],
  ] as const;

const activityFixture = stJoseph && steelhead
  ? {
    staging: "2026-09-10",
    beginning: "2026-10-05",
    building: "2026-11-01",
    peak: "2026-11-15",
    tapering: "2026-12-12",
    ending: "2026-12-20",
    postRun: "2026-12-23",
    beginningWarmF: 58,
    buildingHighF: 50,
    moderateF: 42,
    warmF: 64,
    barrierF: 68,
  }
  : stJoseph && coho
  ? {
    staging: "2026-08-20",
    beginning: "2026-09-20",
    building: "2026-10-02",
    peak: "2026-10-10",
    tapering: "2026-11-08",
    ending: "2026-11-20",
    postRun: "2026-12-01",
    beginningWarmF: 62.5,
    buildingHighF: 56,
    moderateF: 63,
    warmF: 68,
    barrierF: 72,
  }
  : stJoseph
  ? {
    staging: "2026-08-15",
    beginning: "2026-09-05",
    building: "2026-09-20",
    peak: "2026-09-25",
    tapering: "2026-10-15",
    ending: "2026-10-27",
    postRun: "2026-11-05",
    beginningWarmF: 67,
    buildingHighF: 61,
    moderateF: 68,
    warmF: 72,
    barrierF: 76,
  }
  : muskegon && steelhead
  ? {
    staging: "2026-09-10",
    beginning: "2026-10-05",
    building: "2026-11-01",
    peak: "2026-11-15",
    tapering: "2026-12-05",
    ending: "2026-12-20",
    postRun: "2026-12-23",
    beginningWarmF: 58,
    buildingHighF: 50,
    moderateF: 42,
    warmF: 64,
    barrierF: 68,
  }
  : muskegon && coho
  ? {
    staging: "2026-09-05",
    beginning: "2026-09-25",
    building: "2026-10-12",
    peak: "2026-10-25",
    tapering: "2026-11-10",
    ending: "2026-11-23",
    postRun: "2026-12-05",
    beginningWarmF: 62.5,
    buildingHighF: 56,
    moderateF: 63,
    warmF: 64,
    barrierF: 68,
  }
  : muskegon
  ? {
    staging: "2026-08-12",
    beginning: "2026-08-28",
    building: "2026-09-15",
    peak: "2026-10-01",
    tapering: "2026-10-20",
    ending: "2026-11-01",
    postRun: "2026-11-10",
    beginningWarmF: 66.5,
    buildingHighF: 61,
    moderateF: 67,
    warmF: 68,
    barrierF: 72,
  }
  : steelhead
  ? {
    staging: "2026-09-01",
    beginning: "2026-09-20",
    building: "2026-11-01",
    peak: "2026-11-15",
    tapering: "2026-12-05",
    ending: "2026-12-20",
    postRun: "2026-12-23",
    beginningWarmF: 58,
    buildingHighF: 50,
    moderateF: 42,
    warmF: 64,
    barrierF: 68,
  }
  : coho
  ? {
    staging: "2026-09-01",
    beginning: "2026-09-20",
    building: "2026-10-10",
    peak: "2026-10-20",
    tapering: "2026-11-05",
    ending: "2026-11-20",
    postRun: "2026-12-01",
    beginningWarmF: 62.5,
    buildingHighF: 56,
    moderateF: 63,
    warmF: 64,
    barrierF: 68,
  }
  : {
    staging: "2026-08-01",
    beginning: "2026-08-22",
    building: "2026-09-10",
    peak: "2026-09-30",
    tapering: "2026-10-16",
    ending: "2026-10-27",
    postRun: "2026-11-01",
    beginningWarmF: 66.5,
    buildingHighF: 61,
    moderateF: 67,
    warmF: 68,
    barrierF: 72,
  };

const presenceDates = distinctPresenceDates();

const groups: RiverRunReviewGroup[] = [
  {
    id: "run_stage",
    label: "Migration Stage",
    scenarios: stageDates.map(([id, label, localDate]) =>
      scenario(`stage_${id}`, label, localDate)
    ),
  },
  {
    id: "conditions",
    label: "Migration Timing",
    scenarios: [
      timingScenario(
        "timing_before",
        "Before evidence collection",
        "2026-07-24",
        "none",
      ),
      timingScenario(
        "timing_collecting",
        "Collecting first read",
        "2026-08-05",
        "none",
      ),
      timingScenario("timing_ahead", "Ahead", "2026-08-15", "ahead"),
      timingScenario("timing_typical", "Typical", "2026-08-15", "typical"),
      timingScenario("timing_delayed", "Delayed", "2026-08-15", "delayed"),
      timingScenario(
        "timing_insufficient",
        "Insufficient · no historical baseline",
        "2026-08-15",
        "insufficient",
      ),
      timingScenario(
        "timing_complete",
        "Timing complete · run underway",
        "2026-10-06",
        "typical",
      ),
    ],
  },
  {
    id: "push",
    label: "Push",
    scenarios: [
      scenario(
        "push_stable",
        `Stable · ${flow.ideal.toLocaleString("en-US")} CFS · 61°F`,
        "2026-09-30",
      ),
      scenario("push_weak", "Weak · warm, dry, falling", "2026-09-30", {
        flowSignal: "falling",
        rainSignal: "dry",
        temperatureSignal: "strong_warming",
        currentHydraulicValue: 1450,
        hydraulicAbsoluteChange24h: -120,
        hydraulicPercentChange24h: -7.6,
        waterTempF: 69,
      }),
      scenario("push_rising", "Possible · early rise", "2026-09-30", {
        flowSignal: "rising",
        rainSignal: "meaningful_rain",
        temperatureSignal: "cooling",
        currentHydraulicValue: 1600,
        hydraulicAbsoluteChange24h: 50,
        hydraulicPercentChange24h: 3.2,
        waterTempF: 62,
      }),
      scenario(
        "push_meaningful_rise",
        `Meaningful rise · ${flow.ideal.toLocaleString("en-US")} CFS · cooling`,
        "2026-09-30",
        {
          flowSignal: "meaningful_rise",
          rainSignal: "meaningful_rain",
          temperatureSignal: "cooling",
          currentHydraulicValue: flow.ideal,
          hydraulicAbsoluteChange24h: 100,
          hydraulicPercentChange24h: 7,
          waterTempF: 61,
        },
      ),
      scenario("push_sharp", "Very strong · sharp rise", "2026-09-30", {
        flowSignal: "sharp_rise",
        rainSignal: "heavy_rain",
        temperatureSignal: "strong_cooling",
        currentHydraulicValue: 1850,
        hydraulicAbsoluteChange24h: 220,
        hydraulicPercentChange24h: 13.5,
        waterTempF: 58,
      }),
      scenario("push_rain_precursor", "Rain · precursor only", "2026-09-30", {
        flowSignal: "stable",
        rainSignal: "heavy_rain",
        temperatureSignal: "cooling",
        currentHydraulicValue: flow.ideal,
        waterTempF: 61,
      }),
      scenario("push_unknown", "Gauge trend · unresolved", "2026-09-30", {
        flowSignal: "unknown",
        rainSignal: "heavy_rain",
        temperatureSignal: "cooling",
        hydraulicAbsoluteChange24h: null,
        hydraulicPercentChange24h: null,
      }),
      scenario("push_stale", "Gauge · stale cap", "2026-09-30", {
        gaugeFreshness: "stale",
        flowSignal: "sharp_rise",
        rainSignal: "heavy_rain",
        temperatureSignal: "strong_cooling",
        currentHydraulicValue: 1850,
        hydraulicAbsoluteChange24h: 220,
        hydraulicPercentChange24h: 13.5,
        waterTempF: 58,
      }),
      scenario("push_severe_high", "Gauge · severe high cap", "2026-09-30", {
        flowSignal: "sharp_rise",
        rainSignal: "heavy_rain",
        temperatureSignal: "strong_cooling",
        currentHydraulicValue: flow.blown,
        hydraulicAbsoluteChange24h: 500,
        hydraulicPercentChange24h: 16,
        waterTempF: 58,
      }),
      scenario("push_missing_gauge", "Unavailable · gauge", "2026-09-30", {
        gaugeFreshness: "missing",
        flowSignal: "unknown",
        currentHydraulicValue: null,
        hydraulicAbsoluteChange24h: null,
        hydraulicPercentChange24h: null,
      }),
      scenario(
        "push_missing_temperature",
        "Unavailable · water temperature",
        "2026-09-30",
        {
          waterTemperatureFreshness: "missing",
          temperatureSourceType: "unavailable",
          waterTempF: null,
        },
      ),
      scenario(
        "push_warm_entry",
        "Warm early entry · 1,500 CFS · 67°F",
        "2026-08-15",
        {
          flowSignal: "stable",
          rainSignal: "dry",
          temperatureSignal: "neutral",
          currentHydraulicValue: 1500,
          hydraulicAbsoluteChange24h: 0,
          hydraulicPercentChange24h: 0,
          waterTempF: 67,
        },
      ),
      scenario("push_too_warm", "Too warm · 70°F", "2026-08-15", {
        flowSignal: "meaningful_rise",
        rainSignal: "meaningful_rain",
        temperatureSignal: "cooling",
        currentHydraulicValue: flow.ideal,
        hydraulicAbsoluteChange24h: 100,
        hydraulicPercentChange24h: 7,
        waterTempF: 70,
      }),
      scenario(
        "push_barrier",
        `Migration barrier · ${flow.ideal.toLocaleString("en-US")} CFS · 73°F`,
        "2026-08-15",
        {
          flowSignal: "meaningful_rise",
          rainSignal: "meaningful_rain",
          temperatureSignal: "cooling",
          currentHydraulicValue: flow.ideal,
          hydraulicAbsoluteChange24h: 100,
          hydraulicPercentChange24h: 7,
          waterTempF: 73,
        },
      ),
      scenario(
        "fishability_very_low",
        `Very low · ${flow.veryLow.toLocaleString("en-US")} CFS`,
        "2026-09-30",
        {
          currentHydraulicValue: flow.veryLow,
          flowBand: "very_low",
        },
      ),
    ],
  },
  {
    id: "fishability",
    label: "Fishability",
    scenarios: [
      scenario(
        "fishability_low",
        `Low · ${flow.low.toLocaleString("en-US")} CFS`,
        "2026-09-30",
        { currentHydraulicValue: flow.low, flowBand: "low" },
      ),
      scenario(
        "fishability_blown",
        `Blown out · ${flow.blown.toLocaleString("en-US")} CFS`,
        "2026-09-30",
        {
          currentHydraulicValue: flow.blown,
          flowBand: "blown_out",
        },
      ),
      scenario("fishability_rising", "Trend · early rise", "2026-09-30", {
        currentHydraulicValue: 1700,
        flowBand: "ideal",
        flowSignal: "rising",
        hydraulicAbsoluteChange24h: 50,
        hydraulicPercentChange24h: 3.2,
      }),
      scenario(
        "fishability_sharp_high",
        "Trend · sharp rise into high water",
        "2026-09-30",
        {
          currentHydraulicValue: flow.high,
          flowBand: "high_fishable",
          flowSignal: "sharp_rise",
          hydraulicAbsoluteChange24h: 250,
          hydraulicPercentChange24h: 12.2,
        },
      ),
      scenario("fishability_unknown", "Trend · unresolved", "2026-09-30", {
        currentHydraulicValue: flow.ideal,
        flowBand: "ideal",
        flowSignal: "unknown",
        hydraulicAbsoluteChange24h: null,
        hydraulicPercentChange24h: null,
      }),
      scenario("fishability_stale", "Gauge · stale", "2026-09-30", {
        gaugeFreshness: "stale",
        currentHydraulicValue: flow.ideal,
        flowBand: "ideal",
      }),
      scenario("fishability_missing", "Unavailable · gauge", "2026-09-30", {
        gaugeFreshness: "missing",
        currentHydraulicValue: null,
        flowSignal: "unknown",
        hydraulicAbsoluteChange24h: null,
        hydraulicPercentChange24h: null,
      }),
      scenario(
        "fishability_ideal",
        `Ideal · ${flow.ideal.toLocaleString("en-US")} CFS`,
        "2026-09-30",
        { currentHydraulicValue: flow.ideal, flowBand: "ideal" },
      ),
      scenario(
        "fishability_high",
        `High · ${flow.high.toLocaleString("en-US")} CFS`,
        "2026-09-30",
        { currentHydraulicValue: flow.high, flowBand: "high_fishable" },
      ),
      scenario(
        "fishability_very_high",
        `Very high · ${flow.veryHigh.toLocaleString("en-US")} CFS`,
        "2026-09-30",
        { currentHydraulicValue: flow.veryHigh, flowBand: "very_high" },
      ),
    ],
  },
  ...(run.activity
    ? [{
      id: "activity",
      label: "Activity Outlook",
      scenarios: [
        scenario(
          "activity_staging",
          "Staging · conditional early fish",
          activityFixture.staging,
          { waterTempF: 69, cloudCoverPct: 85 },
        ),
        scenario(
          "activity_beginning_warm",
          "Beginning · warm but reactive",
          activityFixture.beginning,
          {
            waterTempF: activityFixture.beginningWarmF,
            cloudCoverPct: 100,
            precipitationIn: 0.02,
          },
        ),
        scenario(
          "activity_building_high",
          "Building · highly active",
          activityFixture.building,
          {
            waterTempF: activityFixture.buildingHighF,
            cloudCoverPct: 100,
            shortwaveWm2: 100,
            precipitationIn: 0.02,
          },
        ),
        scenario(
          "activity_peak_active",
          "Peak · active",
          activityFixture.peak,
          {
            waterTempF: 58,
            cloudCoverPct: 65,
          },
        ),
        scenario(
          "activity_moderate",
          "Building · moderate mixed window",
          activityFixture.building,
          {
            waterTempF: activityFixture.moderateF,
            cloudCoverPct: 0,
            shortwaveWm2: 760,
            currentHydraulicValue: flow.veryHigh,
            flowBand: "very_high",
            temperatureSignal: "strong_warming",
          },
        ),
        scenario(
          "activity_warm_constraint",
          `Warm constraint · ${activityFixture.warmF}°F`,
          activityFixture.beginning,
          {
            waterTempF: activityFixture.warmF,
            cloudCoverPct: 100,
            precipitationIn: 0.02,
          },
        ),
        scenario(
          "activity_barrier",
          `Warm barrier · ${activityFixture.barrierF}°F`,
          activityFixture.beginning,
          {
            waterTempF: activityFixture.barrierF,
            cloudCoverPct: 100,
            precipitationIn: 0.02,
          },
        ),
        scenario(
          "activity_blown_out",
          `Blown out · ${flow.blown.toLocaleString("en-US")} CFS`,
          activityFixture.peak,
          {
            currentHydraulicValue: flow.blown,
            flowBand: "blown_out",
            cloudCoverPct: 100,
          },
        ),
        scenario(
          "activity_tapering",
          steelhead
            ? "Late fall · cold-water response"
            : "Tapering · biological constraint",
          activityFixture.tapering,
          { waterTempF: 52, cloudCoverPct: 100, precipitationIn: 0.02 },
        ),
        scenario(
          "activity_ending",
          steelhead
            ? "Holding transition · fish remain alive"
            : "Ending · residual living fish",
          activityFixture.ending,
          { waterTempF: 50, cloudCoverPct: 100, precipitationIn: 0.02 },
        ),
        scenario(
          !stJoseph && steelhead
            ? "activity_fall_entry_complete"
            : "activity_post_run",
          steelhead
            ? !stJoseph
              ? "Fall entry complete"
              : "Winter holding · current responsiveness"
            : "Late tail · residual living fish",
          activityFixture.postRun,
          { waterTempF: 48, cloudCoverPct: 100, precipitationIn: 0.02 },
        ),
        scenario(
          "activity_missing_temperature",
          "Limited · missing measured temperature",
          activityFixture.peak,
          {
            waterTempF: null,
            waterTemperatureFreshness: "missing",
            temperatureSourceType: "unavailable",
            cloudCoverPct: 75,
          },
        ),
        scenario(
          "activity_missing_river",
          "Limited · missing river measurement",
          activityFixture.peak,
          {
            gaugeFreshness: "missing",
            currentHydraulicValue: null,
            flowSignal: "unknown",
            cloudCoverPct: 75,
          },
        ),
      ],
    }]
    : []),
  {
    id: "fish_in_river",
    label: "Fish In River",
    scenarios: presenceDates.map(([id, label, localDate]) =>
      scenario(`presence_${id}`, label, localDate)
    ),
  },
  {
    id: "combined",
    label: "Combined reads",
    scenarios: [
      scenario(
        "combined_strong_tough",
        "Strong movement + tough fishing shape",
        "2026-09-30",
        {
          flowSignal: "meaningful_rise",
          rainSignal: "meaningful_rain",
          temperatureSignal: "cooling",
          currentHydraulicValue: flow.veryHigh,
          hydraulicAbsoluteChange24h: 180,
          hydraulicPercentChange24h: 7,
          waterTempF: 59,
          flowBand: "very_high",
        },
      ),
      scenario(
        "combined_peak_weak",
        "Peak presence + weak movement",
        "2026-09-30",
        {
          flowSignal: "falling",
          rainSignal: "dry",
          temperatureSignal: "strong_warming",
          currentHydraulicValue: 1450,
          hydraulicAbsoluteChange24h: -120,
          hydraulicPercentChange24h: -7.6,
          waterTempF: 69,
        },
      ),
      scenario(
        "combined_fresh_missing_temp",
        "Fresh gauge + unavailable temperature",
        "2026-09-20",
        {
          waterTemperatureFreshness: "missing",
          temperatureSourceType: "unavailable",
          waterTempF: null,
        },
      ),
      scenario(
        "combined_good_low_presence",
        "Good shape + low seasonal presence",
        "2026-08-15",
        {
          currentHydraulicValue: flow.ideal,
          flowBand: "ideal",
        },
      ),
    ],
  },
  {
    id: "evidence",
    label: "Evidence quality",
    scenarios: [
      scenario(
        "evidence_fresh",
        `Fresh ${
          stJoseph ? "Niles" : muskegon ? "Croton" : "Wellston"
        } source pair`,
        muskegon ? "2026-10-01" : "2026-09-30",
      ),
      scenario("evidence_stale_gauge", "Limited · stale gauge", "2026-09-30", {
        gaugeFreshness: "stale",
      }),
      scenario(
        "evidence_missing_gauge",
        "Limited · missing gauge",
        "2026-09-30",
        {
          gaugeFreshness: "missing",
          flowSignal: "unknown",
          currentHydraulicValue: null,
          hydraulicAbsoluteChange24h: null,
          hydraulicPercentChange24h: null,
        },
      ),
      scenario(
        "evidence_missing_temperature",
        "Limited · missing measured water",
        "2026-09-30",
        {
          waterTemperatureFreshness: "missing",
          temperatureSourceType: "unavailable",
          waterTempF: null,
        },
      ),
    ],
  },
];

const outputPath = new URL(
  stJoseph && steelhead
    ? "../lib/riverRunStJosephSteelheadReviewFixtures.generated.ts"
    : stJoseph && coho
    ? "../lib/riverRunStJosephCohoReviewFixtures.generated.ts"
    : stJoseph
    ? "../lib/riverRunStJosephReviewFixtures.generated.ts"
    : muskegon && steelhead
    ? "../lib/riverRunMuskegonSteelheadReviewFixtures.generated.ts"
    : muskegon && coho
    ? "../lib/riverRunMuskegonCohoReviewFixtures.generated.ts"
    : muskegon
    ? "../lib/riverRunMuskegonReviewFixtures.generated.ts"
    : steelhead
    ? "../lib/riverRunBigManisteeSteelheadReviewFixtures.generated.ts"
    : coho
    ? "../lib/riverRunBigManisteeCohoReviewFixtures.generated.ts"
    : "../lib/riverRunBigManisteeReviewFixtures.generated.ts",
  import.meta.url,
);
const generated =
  `// This file is generated by scripts/generate-river-run-big-manistee-review-fixtures.ts.
// Do not hand-edit. Every primitive card below comes from production scoring code.

import type { RiverRunReviewGroup } from "./riverRunReviewFixtures.types";

export const ${
    stJoseph && steelhead
      ? "RIVER_RUN_ST_JOSEPH_STEELHEAD_REVIEW_GROUPS"
      : stJoseph && coho
      ? "RIVER_RUN_ST_JOSEPH_COHO_REVIEW_GROUPS"
      : stJoseph
      ? "RIVER_RUN_ST_JOSEPH_REVIEW_GROUPS"
      : muskegon && steelhead
      ? "RIVER_RUN_MUSKEGON_STEELHEAD_REVIEW_GROUPS"
      : muskegon && coho
      ? "RIVER_RUN_MUSKEGON_COHO_REVIEW_GROUPS"
      : muskegon
      ? "RIVER_RUN_MUSKEGON_REVIEW_GROUPS"
      : steelhead
      ? "RIVER_RUN_BIG_MANISTEE_STEELHEAD_REVIEW_GROUPS"
      : coho
      ? "RIVER_RUN_BIG_MANISTEE_COHO_REVIEW_GROUPS"
      : "RIVER_RUN_BIG_MANISTEE_REVIEW_GROUPS"
  }: RiverRunReviewGroup[] = ${
    JSON.stringify(groups, null, 2)
  } as unknown as RiverRunReviewGroup[];
`;

if (Deno.args.includes("--check")) {
  const current = await Deno.readTextFile(outputPath).catch(() => "");
  if (current !== generated) {
    console.error(
      `${river.displayName} ${run.displayName} review fixtures are stale.`,
    );
    Deno.exit(1);
  }
  console.log(
    `${river.displayName} ${run.displayName} review fixtures are current (${scenarioCount()} scenarios).`,
  );
} else {
  await Deno.writeTextFile(outputPath, generated);
  console.log(
    `Generated ${scenarioCount()} ${river.displayName} ${run.displayName} review scenarios.`,
  );
}

function scenario(
  id: string,
  label: string,
  localDate: string,
  overrides: Partial<ConditionInput> = {},
) {
  const daily = buildDailySnapshot({
    river,
    run,
    localDate,
    conditionsEvidenceByDate: {},
    conditionsBaselines: null,
    engineVersion,
    configVersion,
  });
  const condition = buildCondition(daily, localDate, overrides);
  const snapshot: RiverRunSnapshotResponse = {
    riverId: run.riverId,
    runId: run.runId,
    localDate,
    timezone: river.timezone,
    progressionSnapshotAt: `${localDate}T12:00:00.000Z`,
    conditionRefreshAt: `${localDate}T12:00:00.000Z`,
    refreshSlot: "16:00",
    progressionExpiresAt: `${localDate}T23:59:59.000Z`,
    nextConditionRefreshAt: `${addDays(localDate, 1)}T05:00:00.000Z`,
    runStage: condition.runStage,
    conditionsSuggest: condition.conditionsSuggest,
    pushHistory: {
      status: "none_recorded",
      minimumSupportiveScore: 50,
      trackingStartDate: condition.runStage.window.startDate,
      trackingEndDate: condition.runStage.window.endDate,
      throughDate: localDate,
      recentDailyReadsStatus: "available",
      recentDailyReads: [],
    },
    push: condition.push,
    fishability: condition.fishability,
    activity: condition.activity,
    fishInRiver: condition.fishInRiver,
    riverConditions: buildReviewLiveConditionsFixture({
      river,
      localDate,
      refreshSlot: "16:00",
      refreshedAt: `${localDate}T19:45:00.000Z`,
      flowCfs: condition.sourceMetrics.gauge?.value ?? null,
      flowDelta24h: condition.sourceMetrics.gauge?.absoluteChange24h ?? null,
      flowPercentDelta24h: condition.sourceMetrics.gauge?.percentChange24h ??
        null,
      waterTempF: condition.sourceMetrics.waterTemperature?.waterTempF ?? null,
    }),
    gauge: condition.sourceMetrics.gauge ?? null,
    weather: condition.sourceMetrics.weather ?? null,
    waterTemperature: condition.sourceMetrics.waterTemperature ?? null,
    conditionsWaterTemperature:
      condition.sourceMetrics.conditionsWaterTemperature ?? null,
    freshness: condition.freshness,
    dataQuality: condition.dataQuality,
    interpretationNote: condition.interpretationNote ?? null,
    secondaryNote: river.gaugeLimitationCopy,
    safety: {
      regulationReminder: river.regulationReminderCopy ??
        "Follow current regulations and signed boundaries.",
      gaugeBasis: river.gaugeLimitationCopy,
      activityDisclaimer:
        "River Migration is not a wading, boating, floating, or personal-safety rating.",
    },
    engineVersion: condition.engineVersion,
    configVersion: condition.configVersion,
  };
  return {
    id,
    label,
    note:
      `Canonical ${river.displayName} ${run.displayName} production copy · owner audit`,
    snapshot,
  };
}

function timingScenario(
  id: string,
  label: string,
  localDate: string,
  kind: "none" | "ahead" | "typical" | "delayed" | "insufficient",
) {
  const checkpointState = resolveConditionsSuggestCheckpoints(run, localDate)
    .filter((item) => item.checkpointDate <= localDate);
  const target = checkpointState.at(-1);
  const conditionsSuggest = !target || kind === "none"
    ? scoreConditionsSuggest({
      localDate,
      run,
      evidenceByDate: {},
      baselines: [],
    })
    : scoreConditionsSuggest({
      localDate,
      run,
      evidenceByDate: timingEvidence(
        target,
        kind === "insufficient" ? "typical" : kind,
      ),
      baselines: kind === "insufficient"
        ? []
        : checkpointState.map(timingBaseline),
    });
  const base = scenario(id, label, localDate);
  return { ...base, snapshot: { ...base.snapshot, conditionsSuggest } };
}

function timingBaseline(
  target: ReturnType<typeof resolveConditionsSuggestCheckpoints>[number],
): RiverRunConditionsSuggestBaseline {
  const expectedDays =
    daysBetween(target.observationStartDate, target.cutoffDate) + 1;
  return {
    riverId: run.riverId,
    runId: run.runId,
    checkpointId: target.checkpointId,
    referenceDayOfYear: canonicalBaselineDay(target.checkpointDate),
    observationStartDayOfYear: canonicalBaselineDay(
      target.observationStartDate,
    ),
    baselineVersion: run.conditionsSuggest.baselineVersion,
    gaugeMetric: "flow_cfs",
    gaugeSiteId,
    temperatureSourceId: run.conditionsSuggest.temperatureSourceId,
    componentSamples: {
      gaugeAbsoluteRise: [0, 100, 200, 350, 600],
      gaugeRelativeRisePct: [0, 6, 12, 22, 38],
      meanWaterTempF: [54, 58, 62, 66, 70],
      waterCoolingF: [-2, 1, 4, 8, 13],
    },
    historicalSamples: [10, 30, 50, 70, 90].map((evidenceIndex, index) => ({
      year: 2021 + index,
      usableDays: expectedDays,
      gaugeAbsoluteRise: index * 150,
      gaugeRelativeRisePct: index * 9,
      meanWaterTempF: 70 - index * 4,
      waterCoolingF: -2 + index * 4,
      gaugeResponsePercentile: 10 + index * 20,
      waterTemperaturePercentile: 10 + index * 20,
      evidenceIndex,
    })),
    indexPercentiles: { p10: 18, p25: 30, p75: 70, p90: 82 },
    distinctYears: 19,
    expectedDays,
    minimumUsableDays: Math.ceil(
      expectedDays * run.conditionsSuggest.minimumCoveragePercent,
    ),
    sourceNotes:
      "Synthetic owner-review baseline matching the production baseline schema.",
  };
}

function timingEvidence(
  target: ReturnType<typeof resolveConditionsSuggestCheckpoints>[number],
  kind: "ahead" | "typical" | "delayed",
): ConditionsSuggestEvidenceByDate {
  const count = daysBetween(target.observationStartDate, target.cutoffDate) + 1;
  const result: ConditionsSuggestEvidenceByDate = {};
  for (let index = 0; index < count; index++) {
    const localDate = addDays(target.observationStartDate, index);
    const progress = count <= 1 ? 1 : index / (count - 1);
    const gaugeValue = kind === "ahead"
      ? 1300 + progress * 900
      : kind === "delayed"
      ? 1500
      : 1450 + progress * 250;
    const waterTempF = kind === "ahead"
      ? 71 - progress * 18
      : kind === "delayed"
      ? 71
      : 68 - progress * 8;
    result[localDate] = {
      "16:00": {
        gaugeFreshness: "fresh",
        gaugeValue,
        gaugeMetric: "flow_cfs",
        gaugeSiteId,
        waterTemperatureFreshness: "fresh",
        waterTempF,
        waterTemperatureSourceId: run.conditionsSuggest.temperatureSourceId,
        reasonCodes: ["gauge_fresh", "temperature_measured"],
      },
    };
  }
  return result;
}

type ConditionInput = {
  flowSignal:
    | "falling"
    | "stable"
    | "rising"
    | "meaningful_rise"
    | "sharp_rise"
    | "unknown";
  rainSignal: "dry" | "meaningful_rain" | "heavy_rain";
  temperatureSignal:
    | "strong_warming"
    | "neutral"
    | "cooling"
    | "strong_cooling";
  currentHydraulicValue: number | null;
  hydraulicAbsoluteChange24h: number | null;
  hydraulicPercentChange24h: number | null;
  waterTempF: number | null;
  gaugeFreshness: "fresh" | "stale" | "missing";
  waterTemperatureFreshness: "fresh" | "missing";
  temperatureSourceType: "same_gauge" | "unavailable";
  flowBand?:
    | "very_low"
    | "low"
    | "ideal"
    | "high_fishable"
    | "very_high"
    | "blown_out";
  cloudCoverPct: number;
  shortwaveWm2?: number;
  precipitationIn: number;
};

function buildCondition(
  daily: ReturnType<typeof buildDailySnapshot>,
  localDate: string,
  overrides: Partial<ConditionInput>,
): RiverRunConditionRefresh {
  const input: ConditionInput = {
    flowSignal: "stable",
    rainSignal: "dry",
    temperatureSignal: "neutral",
    currentHydraulicValue: flow.ideal,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    waterTempF: 61,
    gaugeFreshness: "fresh",
    waterTemperatureFreshness: "fresh",
    temperatureSourceType: "same_gauge",
    cloudCoverPct: 60,
    precipitationIn: 0,
    ...overrides,
  };
  const flowBand = input.flowBand ??
    (input.currentHydraulicValue == null ? undefined : resolveFlowBand({
      metric: "flow_cfs",
      value: input.currentHydraulicValue,
      fishabilityBands: run.fishabilityBands,
    })?.band);
  const activityActive = run.activity &&
    localDate >= daily.runStage.window.stagingStartDate &&
    localDate <= daily.runStage.window.lateEndDate;
  return buildConditionRefresh({
    dailySnapshot: daily,
    localDate,
    refreshSlot: "16:00",
    movementEngineId: run.movementEngineId,
    primitiveCapabilities: run.primitiveCapabilities,
    pushRules: run.push,
    fishabilityBands: run.fishabilityBands,
    activityRules: activityActive ? run.activity : undefined,
    activityTargetDate: activityActive ? localDate : undefined,
    activityTargetStage: daily.runStage.stage,
    activityStaging: daily.runStage.stagingContext,
    gaugeFreshness: input.gaugeFreshness,
    weatherFreshness: "fresh",
    waterTemperatureFreshness: input.waterTemperatureFreshness,
    conditionsWaterTemperatureFreshness: "fresh",
    flowBand,
    currentHydraulicValue: input.currentHydraulicValue,
    hydraulicAbsoluteChange24h: input.hydraulicAbsoluteChange24h,
    hydraulicPercentChange24h: input.hydraulicPercentChange24h,
    rainSignal: input.rainSignal,
    flowSignal: input.flowSignal,
    temperatureSignal: input.temperatureSignal,
    temperatureSourceType: input.temperatureSourceType,
    waterTempF: input.waterTempF,
    missingNonGaugeInputCount: 0,
    sourceMetrics: {
      ...(input.currentHydraulicValue == null ? {} : {
        gauge: {
          provider: "USGS",
          siteId: gaugeSiteId,
          observedAt: `${localDate}T15:00:00.000Z`,
          primaryMetric: "flow_cfs",
          value: input.currentHydraulicValue,
          band: flowBand,
          trend: input.flowSignal,
          absoluteChange24h: input.hydraulicAbsoluteChange24h,
          percentChange24h: input.hydraulicPercentChange24h,
        },
      }),
      weather: {
        provider: "OPEN_METEO",
        evidenceType: "modeled_grid",
        weatherPointId: weatherPoint.weatherPointId,
        rain24hIn: input.rainSignal === "dry" ? 0 : 0.2,
        rain48hIn: input.rainSignal === "dry" ? 0 : 0.35,
        rain72hIn: input.rainSignal === "dry" ? 0 : 0.5,
        hourlyActivityWeather: Array.from({ length: 24 }, (_, hour) => ({
          time_local: `${localDate}T${String(hour).padStart(2, "0")}:00`,
          cloud_cover_pct: input.cloudCoverPct,
          shortwave_w_m2: input.shortwaveWm2 ??
            ((hour >= 8 && hour <= 18 ? 650 : 120) *
              (1 - input.cloudCoverPct / 100 * 0.82)),
          clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 650 : 120,
          precipitation_in: input.precipitationIn,
        })),
      },
      ...(input.waterTempF == null ? {} : {
        waterTemperature: {
          provider: "USGS",
          sourceId: temperatureSource.sourceId,
          siteId: temperatureSource.siteId,
          observedAt: `${localDate}T15:00:00.000Z`,
          waterTempF: input.waterTempF,
          trend: input.temperatureSignal,
          sourceType: "same_gauge",
          attribution: "U.S. Geological Survey Water Data for the Nation.",
        },
      }),
      ...(input.waterTempF == null ? {} : {
        conditionsWaterTemperature: {
          provider: "USGS",
          sourceId: temperatureSource.sourceId,
          siteId: temperatureSource.siteId,
          observedAt: `${localDate}T15:00:00.000Z`,
          waterTempF: input.waterTempF,
          trend: input.temperatureSignal,
          sourceType: "same_gauge",
          attribution: "U.S. Geological Survey Water Data for the Nation.",
        },
      }),
    },
    engineVersion,
    configVersion,
  });
}

function scenarioCount(): number {
  return groups.reduce((total, group) => total + group.scenarios.length, 0);
}

function distinctPresenceDates(): Array<readonly [string, string, string]> {
  const byBranch = new Map<string, string>();
  for (
    let localDate = steelhead
      ? "2026-08-14"
      : coho
      ? "2026-08-19"
      : "2026-06-30";
    localDate <=
      (steelhead ? "2026-12-24" : coho ? "2026-12-13" : "2026-11-13");
    localDate = addDays(localDate, 1)
  ) {
    const daily = buildDailySnapshot({
      river,
      run,
      localDate,
      conditionsEvidenceByDate: {},
      conditionsBaselines: null,
      engineVersion,
      configVersion,
    });
    const result = daily.fishInRiver;
    const branch = result.score === 0
      ? `${result.stage}:${result.label}`
      : result.label === "High presence" && result.curveFraction >= 0.8
      ? `${result.label}:${result.curveDirection}:upper_shoulder`
      : `${result.label}:${result.curveDirection}`;
    if (!byBranch.has(branch)) byBranch.set(branch, localDate);
  }
  return [...byBranch.entries()].map(([branch, localDate]) => {
    const daily = buildDailySnapshot({
      river,
      run,
      localDate,
      conditionsEvidenceByDate: {},
      conditionsBaselines: null,
      engineVersion,
      configVersion,
    });
    return [
      branch.replace(/[^a-z0-9]+/gi, "_").toLowerCase(),
      `${daily.fishInRiver.score} / 100 · ${daily.fishInRiver.label} · ${daily.fishInRiver.curveDirection}`,
      localDate,
    ] as const;
  });
}

function argumentValue(flag: string): string | null {
  const inline = Deno.args.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) return inline.slice(flag.length + 1) || null;
  const index = Deno.args.indexOf(flag);
  return index >= 0 ? Deno.args[index + 1] ?? null : null;
}
