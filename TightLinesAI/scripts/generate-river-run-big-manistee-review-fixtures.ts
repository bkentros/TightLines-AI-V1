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
  resolveConditionsSuggestCheckpoints,
  resolveFlowBand,
  type RiverRunConditionRefresh,
  type RiverRunConditionsSuggestBaseline,
  scoreConditionsSuggest,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";
import type { RiverRunSnapshotResponse } from "../lib/riverRunContracts.ts";
import type { RiverRunReviewGroup } from "../lib/riverRunReviewFixtures.types.ts";

const requestedRunId = argumentValue("--run-id") ??
  "big_manistee_fall_chinook";
if (
  requestedRunId !== "big_manistee_fall_chinook" &&
  requestedRunId !== "big_manistee_fall_coho" &&
  requestedRunId !== "big_manistee_fall_steelhead"
) throw new Error(`Unsupported Big Manistee review run: ${requestedRunId}`);
const coho = requestedRunId === "big_manistee_fall_coho";
const steelhead = requestedRunId === "big_manistee_fall_steelhead";
const run = steelhead
  ? BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE
  : coho
  ? BIG_MANISTEE_FALL_COHO_RUN_PROFILE
  : BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE;
const configVersion = BIG_MANISTEE_CONFIGURATION_DOCUMENT.configVersion;
const engineVersion = "river-run-v1.5.3-review";

const stageDates = steelhead
  ? [
    ["offseason", "True offseason", "2026-08-14"],
    ["before_staging", "Before fall-entry monitoring", "2026-08-15"],
    ["staging", "Staging · Skamania context", "2026-09-01"],
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
    ["winter_holding", "Winter holding handoff", "2026-12-23"],
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
      scenario("push_stable", "Stable · 1,650 CFS · 61°F", "2026-09-30"),
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
        "Meaningful rise · 1,650 CFS · cooling",
        "2026-09-30",
        {
          flowSignal: "meaningful_rise",
          rainSignal: "meaningful_rain",
          temperatureSignal: "cooling",
          currentHydraulicValue: 1650,
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
        currentHydraulicValue: 1650,
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
        currentHydraulicValue: 3600,
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
        currentHydraulicValue: 1650,
        hydraulicAbsoluteChange24h: 100,
        hydraulicPercentChange24h: 7,
        waterTempF: 70,
      }),
      scenario(
        "push_barrier",
        "Migration barrier · 1,650 CFS · 73°F",
        "2026-08-15",
        {
          flowSignal: "meaningful_rise",
          rainSignal: "meaningful_rain",
          temperatureSignal: "cooling",
          currentHydraulicValue: 1650,
          hydraulicAbsoluteChange24h: 100,
          hydraulicPercentChange24h: 7,
          waterTempF: 73,
        },
      ),
      scenario("fishability_very_low", "Very low · 1,050 CFS", "2026-09-30", {
        currentHydraulicValue: 1050,
        flowBand: "very_low",
      }),
    ],
  },
  {
    id: "fishability",
    label: "Fishability",
    scenarios: [
      scenario(
        "fishability_low",
        "Low · 1,200 CFS",
        "2026-09-30",
        { currentHydraulicValue: 1200, flowBand: "low" },
      ),
      scenario("fishability_blown", "Blown out · 3,600 CFS", "2026-09-30", {
        currentHydraulicValue: 3600,
        flowBand: "blown_out",
      }),
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
          currentHydraulicValue: 2300,
          flowBand: "high_fishable",
          flowSignal: "sharp_rise",
          hydraulicAbsoluteChange24h: 250,
          hydraulicPercentChange24h: 12.2,
        },
      ),
      scenario("fishability_unknown", "Trend · unresolved", "2026-09-30", {
        currentHydraulicValue: 1650,
        flowBand: "ideal",
        flowSignal: "unknown",
        hydraulicAbsoluteChange24h: null,
        hydraulicPercentChange24h: null,
      }),
      scenario("fishability_stale", "Gauge · stale", "2026-09-30", {
        gaugeFreshness: "stale",
        currentHydraulicValue: 1650,
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
        "Ideal · 1,650 CFS",
        "2026-09-30",
        { currentHydraulicValue: 1650, flowBand: "ideal" },
      ),
      scenario(
        "fishability_high",
        "High · 2,300 CFS",
        "2026-09-30",
        { currentHydraulicValue: 2300, flowBand: "high_fishable" },
      ),
      scenario(
        "fishability_very_high",
        "Very high · 2,800 CFS",
        "2026-09-30",
        { currentHydraulicValue: 2800, flowBand: "very_high" },
      ),
    ],
  },
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
          currentHydraulicValue: 2800,
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
          currentHydraulicValue: 1650,
          flowBand: "ideal",
        },
      ),
    ],
  },
  {
    id: "evidence",
    label: "Evidence quality",
    scenarios: [
      scenario("evidence_fresh", "Fresh Wellston source pair", "2026-09-30"),
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
  steelhead
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
    steelhead
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
    console.error(`Big Manistee ${run.displayName} review fixtures are stale.`);
    Deno.exit(1);
  }
  console.log(
    `Big Manistee ${run.displayName} review fixtures are current (${scenarioCount()} scenarios).`,
  );
} else {
  await Deno.writeTextFile(outputPath, generated);
  console.log(
    `Generated ${scenarioCount()} Big Manistee ${run.displayName} review scenarios.`,
  );
}

function scenario(
  id: string,
  label: string,
  localDate: string,
  overrides: Partial<ConditionInput> = {},
) {
  const daily = buildDailySnapshot({
    river: BIG_MANISTEE_RIVER_PROFILE,
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
    timezone: BIG_MANISTEE_RIVER_PROFILE.timezone,
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
    fishInRiver: condition.fishInRiver,
    gauge: condition.sourceMetrics.gauge ?? null,
    weather: condition.sourceMetrics.weather ?? null,
    waterTemperature: condition.sourceMetrics.waterTemperature ?? null,
    conditionsWaterTemperature:
      condition.sourceMetrics.conditionsWaterTemperature ?? null,
    freshness: condition.freshness,
    dataQuality: condition.dataQuality,
    interpretationNote: condition.interpretationNote ?? null,
    secondaryNote: BIG_MANISTEE_RIVER_PROFILE.gaugeLimitationCopy,
    safety: {
      regulationReminder: BIG_MANISTEE_RIVER_PROFILE.regulationReminderCopy ??
        "Follow current regulations and signed boundaries.",
      gaugeBasis:
        "Wellston represents the Tippy tailwater and upper migratory corridor; downstream conditions can differ.",
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
      `Canonical Big Manistee ${run.displayName} production copy · owner audit`,
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
    gaugeSiteId: "04125550",
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
        gaugeSiteId: "04125550",
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
    currentHydraulicValue: 1650,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    waterTempF: 61,
    gaugeFreshness: "fresh",
    waterTemperatureFreshness: "fresh",
    temperatureSourceType: "same_gauge",
    ...overrides,
  };
  const flowBand = input.flowBand ??
    (input.currentHydraulicValue == null ? undefined : resolveFlowBand({
      metric: "flow_cfs",
      value: input.currentHydraulicValue,
      fishabilityBands: run.fishabilityBands,
    })?.band);
  return buildConditionRefresh({
    dailySnapshot: daily,
    localDate,
    refreshSlot: "16:00",
    movementEngineId: run.movementEngineId,
    primitiveCapabilities: run.primitiveCapabilities,
    pushRules: run.push,
    fishabilityBands: run.fishabilityBands,
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
          siteId: "04125550",
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
        weatherPointId: "big_manistee_wellston_weather",
        rain24hIn: input.rainSignal === "dry" ? 0 : 0.2,
        rain48hIn: input.rainSignal === "dry" ? 0 : 0.35,
        rain72hIn: input.rainSignal === "dry" ? 0 : 0.5,
      },
      ...(input.waterTempF == null ? {} : {
        waterTemperature: {
          provider: "USGS",
          sourceId: "big_manistee_wellston_temperature",
          siteId: "04125550",
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
          sourceId: "big_manistee_wellston_temperature",
          siteId: "04125550",
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
      river: BIG_MANISTEE_RIVER_PROFILE,
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
      river: BIG_MANISTEE_RIVER_PROFILE,
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
