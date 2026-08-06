import {
  addDays,
  BETSIE_CONFIGURATION_DOCUMENT,
  BETSIE_FALL_CHINOOK_RUN_PROFILE,
  BETSIE_FALL_COHO_RUN_PROFILE,
  BETSIE_FALL_STEELHEAD_RUN_PROFILE,
  BETSIE_RIVER_PROFILE,
  buildConditionRefresh,
  buildDailySnapshot,
  type RiverRunConditionRefresh,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";
import type { RiverRunSnapshotResponse } from "../lib/riverRunContracts.ts";

const runIdArgIndex = Deno.args.indexOf("--run-id");
const requestedRunId = runIdArgIndex >= 0
  ? Deno.args[runIdArgIndex + 1]
  : "betsie_fall_chinook";
if (
  requestedRunId !== "betsie_fall_chinook" &&
  requestedRunId !== "betsie_fall_coho" &&
  requestedRunId !== "betsie_fall_steelhead"
) {
  throw new Error(`Unsupported Betsie review run: ${requestedRunId}`);
}
const coho = requestedRunId === "betsie_fall_coho";
const steelhead = requestedRunId === "betsie_fall_steelhead";
const run = steelhead
  ? BETSIE_FALL_STEELHEAD_RUN_PROFILE
  : coho
  ? BETSIE_FALL_COHO_RUN_PROFILE
  : BETSIE_FALL_CHINOOK_RUN_PROFILE;
const configVersion = BETSIE_CONFIGURATION_DOCUMENT.configVersion;

const stageDates = steelhead
  ? [
    ["before_staging", "Before staging", "2026-08-10"],
    ["staging", "Staging", "2026-08-27"],
    ["beginning", "Beginning", "2026-09-15"],
    ["building_early", "Building · below Homestead", "2026-10-06"],
    ["building_established", "Established", "2026-10-10"],
    ["building_broad", "Broadly established", "2026-10-27"],
    ["peak", "Peak · 70 ceiling", "2026-11-10"],
    ["tapering", "Late fall", "2026-11-30"],
    ["ending", "Holding transition", "2026-12-15"],
    ["winter_holding", "Winter holding · retained 61", "2026-12-18"],
  ] as const
  : coho
  ? [
    ["before_staging", "Before staging", "2026-08-10"],
    ["staging", "Staging", "2026-08-20"],
    ["beginning", "Beginning · limited river entry", "2026-08-27"],
    ["building_early", "Building · select deep holes", "2026-09-16"],
    [
      "building_established",
      "Late September · Homestead realistic",
      "2026-09-26",
    ],
    ["peak", "Peak · limited opportunity", "2026-10-15"],
    ["tapering", "Tapering", "2026-11-01"],
    ["ending", "Ending", "2026-11-16"],
    ["late_tail", "Late residual tail", "2026-11-26"],
    ["offseason", "Offseason", "2026-12-29"],
  ] as const
  : [
    ["before_staging", "Before staging", "2026-07-01"],
    ["staging", "Staging", "2026-07-28"],
    ["beginning", "Beginning · rare Homestead arrival", "2026-08-10"],
    ["building_early", "Building · downstream holes", "2026-08-19"],
    ["building_established", "Late August · Homestead realistic", "2026-08-27"],
    ["building_broad", "Broadly established corridor", "2026-09-05"],
    ["peak", "Peak", "2026-09-15"],
    ["tapering", "Tapering", "2026-09-26"],
    ["ending", "Ending", "2026-10-14"],
    ["late_tail", "Late residual tail", "2026-10-23"],
    ["offseason", "Offseason", "2026-11-06"],
  ] as const;

const presenceDates = steelhead
  ? [
    ["before", "Before river entry · 0", "2026-09-14"],
    ["start", "Beginning · 7", "2026-09-15"],
    ["early", "Early build · 14", "2026-09-26"],
    ["building", "Building · 25", "2026-10-05"],
    ["established", "Established · 32", "2026-10-10"],
    ["broad", "Broad · 53", "2026-10-27"],
    ["peak", "Peak · 70", "2026-11-10"],
    ["peak_end", "Peak end · 70", "2026-11-29"],
    ["late_fall", "Late fall · 69", "2026-11-30"],
    ["taper", "Taper · 63", "2026-12-14"],
    ["end", "Fall-entry end · 61", "2026-12-17"],
    ["winter_holding", "Winter handoff · 61", "2026-12-18"],
  ] as const
  : coho
  ? [
    ["before", "Before river entry · 0", "2026-08-26"],
    ["start", "Beginning · 3", "2026-08-27"],
    ["early", "Early build · 6", "2026-09-10"],
    ["half", "Building · 15", "2026-09-26"],
    ["peak", "Peak · 30", "2026-10-15"],
    ["shoulder", "Peak shoulder · 27", "2026-10-31"],
    ["taper", "Taper · 18", "2026-11-15"],
    ["late", "Late · 12", "2026-11-25"],
    ["tail", "Sparse tail · 6", "2026-12-10"],
    ["tail_end", "Tail end · 0", "2026-12-26"],
  ] as const
  : [
    ["before", "Before river entry · 0", "2026-08-09"],
    ["start", "Beginning · 10", "2026-08-10"],
    ["early", "Early build · 25", "2026-08-17"],
    ["half", "Building · 50", "2026-08-30"],
    ["peak", "Peak · 100", "2026-09-15"],
    ["shoulder", "Peak shoulder · 95", "2026-09-25"],
    ["taper", "Taper · 70", "2026-10-04"],
    ["late", "Late · 25", "2026-10-20"],
    ["tail_end", "Tail end · 0", "2026-11-03"],
  ] as const;

const referenceDate = steelhead
  ? "2026-11-10"
  : coho
  ? "2026-10-15"
  : "2026-09-15";

const groups = [
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
      scenario(
        "timing_unavailable",
        "Unavailable · no historical sensor baseline",
        referenceDate,
      ),
    ],
  },
  {
    id: "push",
    label: "Push",
    scenarios: [
      scenario(
        "push_unavailable",
        "Unavailable · no gauge or measured water temperature",
        referenceDate,
      ),
    ],
  },
  {
    id: "fishability",
    label: "Fishability",
    scenarios: [
      scenario(
        "fishability_unavailable",
        "Unavailable · no representative gauge",
        referenceDate,
      ),
    ],
  },
  ...(run.activity
    ? [{
      id: "activity",
      label: "Activity Outlook",
      scenarios: activityScenarios(),
    }]
    : []),
  {
    id: "fish_in_river",
    label: "Fish In River",
    scenarios: presenceDates.map(([id, label, localDate]) =>
      scenario(`presence_${id}`, label, localDate)
    ),
  },
];

function activityScenarios() {
  if (steelhead) {
    return [
      scenario("activity_staging", "Staging · conditional fish", "2026-08-27", {
        cloud: 85,
        rainPerWetHour: 0.005,
        wetHours: 4,
      }),
      scenario(
        "activity_beginning_bright",
        "Beginning · bright and dry",
        "2026-09-15",
        { cloud: 5 },
      ),
      scenario(
        "activity_building_cloudy",
        "Building · dark and dry",
        "2026-10-27",
        { cloud: 95 },
      ),
      scenario(
        "activity_peak_light_rain",
        "Peak · sustained light rain",
        "2026-11-10",
        { cloud: 95, rainPerWetHour: 0.005, wetHours: 4 },
      ),
      scenario("activity_peak_heavy_rain", "Peak · heavy rain", "2026-11-10", {
        cloud: 95,
        rainPerWetHour: 0.1,
        wetHours: 4,
      }),
      scenario(
        "activity_late_fall",
        "Late fall · fish remain alive",
        "2026-11-30",
        { cloud: 95, rainPerWetHour: 0.005, wetHours: 4 },
      ),
      scenario(
        "activity_holding_transition",
        "Holding transition · fish remain alive",
        "2026-12-15",
        { cloud: 95, rainPerWetHour: 0.005, wetHours: 4 },
      ),
      scenario(
        "activity_fall_end",
        "Fall-entry end · current responsiveness",
        "2026-12-17",
        { cloud: 95, rainPerWetHour: 0.005, wetHours: 4 },
      ),
      scenario(
        "activity_winter_holding",
        "Winter holding · current responsiveness",
        "2026-12-18",
        { cloud: 95, rainPerWetHour: 0.005, wetHours: 4 },
      ),
    ];
  }
  if (coho) {
    return [
      scenario("activity_staging", "Staging · conditional fish", "2026-08-20", {
        cloud: 85,
        rainPerWetHour: 0.005,
        wetHours: 4,
      }),
      scenario(
        "activity_beginning_bright",
        "Beginning · bright and dry",
        "2026-08-27",
        { cloud: 5 },
      ),
      scenario(
        "activity_building_cloudy",
        "Building · dark and dry",
        "2026-09-26",
        { cloud: 95 },
      ),
      scenario(
        "activity_peak_light_rain",
        "Peak · sustained light rain",
        "2026-10-15",
        { cloud: 95, rainPerWetHour: 0.005, wetHours: 4 },
      ),
      scenario("activity_peak_heavy_rain", "Peak · heavy rain", "2026-10-15", {
        cloud: 95,
        rainPerWetHour: 0.1,
        wetHours: 4,
      }),
      scenario("activity_taper_start", "Tapering · first day", "2026-11-01", {
        cloud: 95,
        rainPerWetHour: 0.005,
        wetHours: 4,
      }),
      scenario("activity_taper_end", "Tapering · final day", "2026-11-15", {
        cloud: 95,
        rainPerWetHour: 0.005,
        wetHours: 4,
      }),
      scenario("activity_ending", "Ending · lifecycle adjusted", "2026-11-25", {
        cloud: 95,
        rainPerWetHour: 0.005,
        wetHours: 4,
      }),
      scenario(
        "activity_late_tail",
        "Late tail · residual fish",
        "2026-12-26",
        { cloud: 95, rainPerWetHour: 0.005, wetHours: 4 },
      ),
    ];
  }
  return [
    scenario(
      "activity_staging",
      "Staging · conditional fish",
      "2026-07-28",
      { cloud: 85, rainPerWetHour: 0.005, wetHours: 4 },
    ),
    scenario(
      "activity_beginning_bright",
      "Beginning · bright and dry",
      "2026-08-10",
      { cloud: 5 },
    ),
    scenario(
      "activity_building_cloudy",
      "Building · dark and dry",
      "2026-09-05",
      { cloud: 95 },
    ),
    scenario(
      "activity_peak_light_rain",
      "Peak · sustained light rain",
      "2026-09-15",
      { cloud: 95, rainPerWetHour: 0.005, wetHours: 4 },
    ),
    scenario(
      "activity_peak_heavy_rain",
      "Peak · heavy rain",
      "2026-09-15",
      { cloud: 95, rainPerWetHour: 0.1, wetHours: 4 },
    ),
    scenario("activity_taper_start", "Tapering · first day", "2026-09-26", {
      cloud: 95,
      rainPerWetHour: 0.005,
      wetHours: 4,
    }),
    scenario("activity_taper_end", "Tapering · final day", "2026-10-13", {
      cloud: 95,
      rainPerWetHour: 0.005,
      wetHours: 4,
    }),
    scenario(
      "activity_ending",
      "Ending · lifecycle adjusted",
      "2026-10-22",
      { cloud: 95, rainPerWetHour: 0.005, wetHours: 4 },
    ),
    scenario(
      "activity_late_tail",
      "Late tail · residual fish",
      "2026-10-23",
      { cloud: 95, rainPerWetHour: 0.005, wetHours: 4 },
    ),
  ];
}

const outputPath = new URL(
  steelhead
    ? "../lib/riverRunBetsieSteelheadReviewFixtures.generated.ts"
    : coho
    ? "../lib/riverRunBetsieCohoReviewFixtures.generated.ts"
    : "../lib/riverRunBetsieReviewFixtures.generated.ts",
  import.meta.url,
);
const exportName = steelhead
  ? "RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS"
  : coho
  ? "RIVER_RUN_BETSIE_COHO_REVIEW_GROUPS"
  : "RIVER_RUN_BETSIE_REVIEW_GROUPS";
const generated =
  `// This file is generated by scripts/generate-river-run-betsie-review-fixtures.ts.
// Do not hand-edit. Every primitive below comes from production scoring code.

import type { RiverRunReviewGroup } from "./riverRunReviewFixtures.types";

export const ${exportName}: RiverRunReviewGroup[] = ${
    JSON.stringify(groups, null, 2)
  } as unknown as RiverRunReviewGroup[];
`;

if (Deno.args.includes("--check")) {
  const current = await Deno.readTextFile(outputPath).catch(() => "");
  if (current !== generated) {
    console.error(
      `Betsie ${run.displayName} review fixtures are stale. Run the matching generate:river-run:betsie command.`,
    );
    Deno.exit(1);
  }
  console.log(
    `Betsie ${run.displayName} review fixtures match production copy (${scenarioCount()} scenarios).`,
  );
} else {
  await Deno.writeTextFile(outputPath, generated);
  console.log(
    `Generated ${scenarioCount()} Betsie ${run.displayName} review scenarios from production scoring code.`,
  );
}

type ActivityFixture = {
  cloud: number;
  rainPerWetHour?: number;
  wetHours?: number;
};

function scenario(
  id: string,
  label: string,
  localDate: string,
  activityFixture?: ActivityFixture,
) {
  const daily = buildDailySnapshot({
    river: BETSIE_RIVER_PROFILE,
    run,
    localDate,
    conditionsEvidenceByDate: {},
    conditionsBaselines: null,
    engineVersion: "river-run-v1.5.3-review",
    configVersion,
  });
  const condition = buildUnavailableCondition(
    daily,
    localDate,
    activityFixture,
  );
  const snapshot: RiverRunSnapshotResponse = {
    riverId: run.riverId,
    runId: run.runId,
    localDate,
    timezone: BETSIE_RIVER_PROFILE.timezone,
    progressionSnapshotAt: `${localDate}T12:00:00.000Z`,
    conditionRefreshAt: `${localDate}T12:00:00.000Z`,
    refreshSlot: "00:00",
    progressionExpiresAt: `${localDate}T23:59:59.000Z`,
    nextConditionRefreshAt: `${addDays(localDate, 1)}T05:00:00.000Z`,
    runStage: condition.runStage,
    conditionsSuggest: condition.conditionsSuggest,
    push: condition.push,
    pushHistory: {
      status: "unavailable",
      minimumSupportiveScore: 50,
      trackingStartDate: condition.runStage.window.startDate,
      trackingEndDate: condition.runStage.window.endDate,
      throughDate: localDate,
      recentDailyReadsStatus: "unavailable",
      recentDailyReads: [],
    },
    fishability: condition.fishability,
    activity: condition.activity,
    fishInRiver: condition.fishInRiver,
    gauge: null,
    weather: null,
    waterTemperature: null,
    conditionsWaterTemperature: null,
    freshness: condition.freshness,
    dataQuality: condition.dataQuality,
    interpretationNote: condition.interpretationNote ?? null,
    secondaryNote: BETSIE_RIVER_PROFILE.gaugeLimitationCopy,
    safety: {
      regulationReminder: BETSIE_RIVER_PROFILE.regulationReminderCopy ??
        "Follow current regulations and signed boundaries.",
      gaugeBasis:
        "No accepted live gauge represents the below-Homestead corridor; Fishability is unavailable.",
      activityDisclaimer:
        "River Migration is not a wading, boating, floating, or personal-safety rating.",
    },
    engineVersion: condition.engineVersion,
    configVersion: condition.configVersion,
  };
  return {
    id,
    label,
    note: `Canonical Betsie ${run.displayName} production copy · owner audit`,
    snapshot,
  };
}

function buildUnavailableCondition(
  daily: ReturnType<typeof buildDailySnapshot>,
  localDate: string,
  activityFixture?: ActivityFixture,
): RiverRunConditionRefresh {
  const activityActive = Boolean(
    run.activity && localDate >= daily.runStage.window.stagingStartDate &&
      localDate <= daily.runStage.window.lateEndDate,
  );
  const fixture = activityFixture ?? { cloud: 60 };
  return buildConditionRefresh({
    dailySnapshot: daily,
    localDate,
    refreshSlot: "00:00",
    movementEngineId: run.movementEngineId,
    primitiveCapabilities: run.primitiveCapabilities,
    activityRules: activityActive ? run.activity : undefined,
    activityTargetDate: activityActive ? localDate : undefined,
    activityTargetStage: daily.runStage.stage,
    activityStaging: daily.runStage.stagingContext,
    gaugeFreshness: "missing",
    weatherFreshness: activityActive ? "fresh" : "missing",
    waterTemperatureFreshness: "missing",
    conditionsWaterTemperatureFreshness: "missing",
    currentHydraulicValue: null,
    hydraulicAbsoluteChange24h: null,
    hydraulicPercentChange24h: null,
    rainSignal: "missing_rain_data",
    flowSignal: "unknown",
    temperatureSignal: "neutral_missing",
    temperatureSourceType: "unavailable",
    waterTempF: null,
    missingNonGaugeInputCount: 2,
    rainReasonCodes: ["rain_missing"],
    flowReasonCodes: ["gauge_missing", "flow_trend_unknown"],
    temperatureReasonCodes: [
      "temperature_unavailable",
      "temperature_neutral_missing",
    ],
    sourceMetrics: {
      ...(activityActive
        ? {
          weather: {
            provider: "OPEN_METEO" as const,
            evidenceType: "modeled_grid" as const,
            weatherPointId: "betsie_homestead_weather_context",
            rain24hIn: 0,
            rain48hIn: 0,
            rain72hIn: 0,
            hourlyActivityWeather: Array.from({ length: 24 }, (_, hour) => {
              const wet = hour >= 9 &&
                hour < 9 + Math.min(4, fixture.wetHours ?? 0);
              const clear = hour >= 5 && hour < 21 ? 650 : 0;
              return {
                time_local: `${localDate}T${String(hour).padStart(2, "0")}:00`,
                cloud_cover_pct: fixture.cloud,
                shortwave_w_m2: clear * (1 - fixture.cloud / 100 * 0.88),
                clear_sky_shortwave_w_m2: clear,
                precipitation_in: wet ? fixture.rainPerWetHour ?? 0 : 0,
              };
            }),
          },
        }
        : {}),
      waterTemperature: {
        sourceType: "unavailable",
        trend: "neutral_missing",
      },
      conditionsWaterTemperature: {
        sourceType: "unavailable",
        trend: "neutral_missing",
      },
    },
    engineVersion: "river-run-v1.5.3-review",
    configVersion,
  });
}

function scenarioCount(): number {
  return groups.reduce((total, group) => total + group.scenarios.length, 0);
}
