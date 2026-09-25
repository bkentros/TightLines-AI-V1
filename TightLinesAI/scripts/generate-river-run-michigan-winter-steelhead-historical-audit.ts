import {
  BIG_MANISTEE_RIVER_PROFILE,
  BIG_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
  GRAND_RIVER_PROFILE,
  GRAND_WINTER_STEELHEAD_RUN_PROFILE,
  isRunSeasonallyActive,
  MUSKEGON_RIVER_PROFILE,
  MUSKEGON_WINTER_STEELHEAD_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  PERE_MARQUETTE_WINTER_STEELHEAD_RUN_PROFILE,
  resolveRunStage,
  ST_JOSEPH_RIVER_PROFILE,
  ST_JOSEPH_WINTER_STEELHEAD_RUN_PROFILE,
  validateRunProfile,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

type ScoreSummary = {
  min: number | null;
  p10: number | null;
  median: number | null;
  p90: number | null;
  max: number | null;
  mean: number | null;
};

type Group = {
  days: number;
  scores: ScoreSummary;
  labels: Record<string, number>;
};

type Replay = {
  runId: string;
  rulesVersion: string;
  expectedDays: number;
  usableDays: number;
  dayScore: ScoreSummary;
  dayLabels: Record<string, number>;
  missing: Record<string, number>;
  invariants: Record<string, number>;
  winterBehavior: {
    temperatureSourcesUsed: Record<string, number>;
    temperatureBands: Record<string, Group>;
    temperatureTrends: Record<string, Group>;
    flowBands: Record<string, Group>;
    calendarMonths: Record<string, Group>;
    winterSeasons: Record<string, Group>;
    cloudWindows: {
      daysWithAtLeast40PointCloudContrast: number;
      cloudierBlockHigher: number;
      tiedBecauseOfCapsOrRounding: number;
      cloudierBlockLower: number;
      cloudierMinusClearerScore: ScoreSummary;
    };
    daysAtLeast60: number;
    daysAtLeast80: number;
    daysAtLeast90: number;
    topActivityDays: Array<{
      date: string;
      score: number;
      waterTempF: number;
      temperatureSignal: string;
      flowBand: string;
      bestBlock: string;
      spread: number;
    }>;
  };
};

const AUDIT_DIR = "docs/audits";
const OUTPUT =
  `${AUDIT_DIR}/river-run-michigan-winter-steelhead-historical-behavior-audit.json`;
const entries = [
  {
    slug: "pere-marquette",
    run: PERE_MARQUETTE_WINTER_STEELHEAD_RUN_PROFILE,
    river: PERE_MARQUETTE_RIVER_PROFILE,
    prior: "2026-12-22",
    activation: "2026-12-23",
  },
  {
    slug: "big-manistee",
    run: BIG_MANISTEE_WINTER_STEELHEAD_RUN_PROFILE,
    river: BIG_MANISTEE_RIVER_PROFILE,
    prior: "2026-12-22",
    activation: "2026-12-23",
  },
  {
    slug: "muskegon",
    run: MUSKEGON_WINTER_STEELHEAD_RUN_PROFILE,
    river: MUSKEGON_RIVER_PROFILE,
    prior: "2026-12-22",
    activation: "2026-12-23",
  },
  {
    slug: "st-joseph",
    run: ST_JOSEPH_WINTER_STEELHEAD_RUN_PROFILE,
    river: ST_JOSEPH_RIVER_PROFILE,
    prior: "2026-12-22",
    activation: "2026-12-23",
  },
  {
    slug: "grand",
    run: GRAND_WINTER_STEELHEAD_RUN_PROFILE,
    river: GRAND_RIVER_PROFILE,
    prior: "2026-12-31",
    activation: "2027-01-01",
  },
] as const;

const reports = await Promise.all(
  entries.map(async ({ slug }) =>
    JSON.parse(
      await Deno.readTextFile(
        `${AUDIT_DIR}/river-run-${slug}-winter-steelhead-activity-replay.json`,
      ),
    ) as Replay
  ),
);

const expectedDays = sum(reports.map((report) => report.expectedDays));
const usableDays = sum(reports.map((report) => report.usableDays));
const activeDays = sum(
  reports.map((report) =>
    (report.dayLabels.Active ?? 0) + (report.dayLabels["Highly active"] ?? 0)
  ),
);
const highlyActiveDays = sum(
  reports.map((report) => report.dayLabels["Highly active"] ?? 0),
);
const daysAtLeast90 = sum(
  reports.map((report) => report.winterBehavior.daysAtLeast90),
);
const cloudContrasts = sum(
  reports.map((report) =>
    report.winterBehavior.cloudWindows.daysWithAtLeast40PointCloudContrast
  ),
);
const cloudHigher = sum(
  reports.map((report) =>
    report.winterBehavior.cloudWindows.cloudierBlockHigher
  ),
);
const cloudTied = sum(
  reports.map((report) =>
    report.winterBehavior.cloudWindows.tiedBecauseOfCapsOrRounding
  ),
);
const cloudLower = sum(
  reports.map((report) =>
    report.winterBehavior.cloudWindows.cloudierBlockLower
  ),
);

const temperatureTotals = Object.fromEntries(
  [
    "atOrBelow33_5F",
    "above33_5To35F",
    "from35To36F",
    "from36To37F",
    "from37To38F",
    "from38To42F",
    "from42To45F",
    "above45F",
  ].map((band) => [
    band,
    sum(
      reports.map((report) =>
        report.winterBehavior.temperatureBands[band]?.days ?? 0
      ),
    ),
  ]),
);

const implementation = entries.map(
  ({ run, river, prior, activation }, index) => {
    const validation = validateRunProfile(run, river);
    const winterPhases = Object.values(run.seasonalZonePlan?.phases ?? {});
    const firstWinterPhase = winterPhases[0] ?? [];
    return {
      runId: run.runId,
      validAndPublic: validation.valid && validation.publicVisible,
      auditVersion: run.publicAudit?.auditVersion,
      profile: run.activity?.profile,
      weights: run.activity?.weights,
      pushUnavailable: run.primitiveCapabilities.push.status === "unavailable",
      timingUnavailable:
        run.primitiveCapabilities.migrationTiming.status === "unavailable",
      inactiveBeforeActivation: !isRunSeasonallyActive(run, prior),
      activeOnActivation: isRunSeasonallyActive(run, activation),
      inactiveMarch1: !isRunSeasonallyActive(run, "2027-03-01"),
      activationLabel: resolveRunStage(run, activation).label,
      noMigrationApproachArea: !run.seasonalZonePlan?.earlyApproach,
      fullHoldingCorridorEveryPhase: winterPhases.length === 7 &&
        winterPhases.every((reachIds) =>
          JSON.stringify(reachIds) === JSON.stringify(firstWinterPhase)
        ),
      sourceCoveragePercent: round2(
        reports[index].usableDays / reports[index].expectedDays * 100,
      ),
    };
  },
);

const acceptance = {
  allProfilesValidAndPublic: implementation.every((item) =>
    item.validAndPublic
  ),
  exactNonOverlappingSeasonGates: implementation.every((item) =>
    item.inactiveBeforeActivation && item.activeOnActivation &&
    item.inactiveMarch1 && item.activationLabel === "Winter transition"
  ),
  holdingPrimitivesOnly: implementation.every((item) =>
    item.profile === "steelhead_winter_holding" && item.pushUnavailable &&
    item.timingUnavailable
  ),
  winterSpotFinderKeepsFullCorridor: implementation.every((item) =>
    item.noMigrationApproachArea && item.fullHoldingCorridorEveryPhase
  ),
  everyRiverCoverageAtLeast90Percent: implementation.every((item) =>
    item.sourceCoveragePercent >= 90
  ),
  aggregateCoverageAtLeast95Percent: usableDays / expectedDays >= .95,
  allReplayInvariantsPass: reports.every((report) =>
    Object.values(report.invariants).every((count) => count === 0)
  ),
  winterMostlyBelowActive: activeDays / usableDays < .5,
  highlyActiveDaysRemainRare: highlyActiveDays / usableDays < .1,
  ninetyPlusDaysRemainExceptional: daysAtLeast90 / usableDays < .02,
  nearFreezingAlwaysConstrained: reports.every((report) =>
    (report.winterBehavior.temperatureBands.atOrBelow33_5F.scores.max ?? 100) <=
      29
  ),
  sub35AlwaysConstrained: reports.every((report) =>
    (report.winterBehavior.temperatureBands.above33_5To35F.scores.max ?? 100) <=
      49
  ),
  favorableWaterOutscoresColdWater: reports.every((report) => {
    const bands = report.winterBehavior.temperatureBands;
    return (bands.from38To42F.scores.median ?? 0) >
        (bands.from35To36F.scores.median ?? 100) &&
      (bands.from35To36F.scores.median ?? 0) >
        (bands.above33_5To35F.scores.median ?? 100);
  }),
  measuredWarmingOutscoresNeutralWhereObserved: reports.every((report) => {
    const warming = report.winterBehavior.temperatureTrends.warming;
    const neutral = report.winterBehavior.temperatureTrends.neutral;
    return !warming || !neutral ||
      (warming.scores.median ?? 0) > (neutral.scores.median ?? 100);
  }),
  sharpWarmingIsBelowGradualWarmingWhereObserved: reports.every((report) => {
    const gradual = report.winterBehavior.temperatureTrends.warming;
    const sharp = report.winterBehavior.temperatureTrends.strong_warming;
    return !gradual || !sharp ||
      (sharp.scores.median ?? 100) < (gradual.scores.median ?? 0);
  }),
  blownOutWaterAlwaysInactive: reports.every((report) => {
    const blownOut = report.winterBehavior.flowBands.blown_out;
    return !blownOut || (blownOut.scores.max ?? 100) <= 19;
  }),
  cloudWindowsAreHelpfulButBounded: cloudContrasts > 0 && cloudHigher > 0 &&
    cloudLower === 0 &&
    reports.every((report) =>
      (report.winterBehavior.cloudWindows.cloudierMinusClearerScore.max ??
        100) <=
        8
    ),
  topHistoricalDaysHaveCredibleThermalSupport: reports.every((report) =>
    report.winterBehavior.topActivityDays.slice(0, 3).every((day) =>
      day.waterTempF >= 38 &&
      ["neutral", "warming"].includes(day.temperatureSignal)
    )
  ),
  everyActiveCalendarMonthHasHistoricalCoverage: reports.every((report) => {
    const required = report.runId === "grand_winter_steelhead"
      ? ["January", "February"]
      : ["December", "January", "February"];
    return required.every((month) =>
      (report.winterBehavior.calendarMonths[month]?.days ?? 0) > 0
    );
  }),
  multiYearBehaviorIsNotFlat: reports.every((report) =>
    new Set(
      Object.values(report.winterBehavior.winterSeasons).map((group) =>
        group.scores.median
      ),
    ).size >= 2
  ),
};

const coreAccepted = Object.values(acceptance).every(Boolean);
if (!coreAccepted) {
  throw new Error(
    `Historical behavior audit failed: ${JSON.stringify(acceptance)}`,
  );
}

const audit = {
  auditVersion: "michigan-winter-steelhead-historical-behavior-v1",
  completedOn: "2026-09-25",
  status: "accepted_with_watch_item",
  judgment:
    "The model behaves like a winter responsiveness model: most days remain below Active, near-freezing and blown-out conditions are hard-limited, and genuinely strong days cluster around favorable measured water or gradual warming. Cloud cover changes time-window ranking without rescuing a thermally or hydraulically poor day.",
  replay: {
    expectedRiverDays: expectedDays,
    usableRiverDays: usableDays,
    coveragePercent: round2(usableDays / expectedDays * 100),
    activeOrHigherDays: activeDays,
    activeOrHigherPercent: round2(activeDays / usableDays * 100),
    highlyActiveDays,
    highlyActivePercent: round2(highlyActiveDays / usableDays * 100),
    daysAtLeast90,
    daysAtLeast90Percent: round2(daysAtLeast90 / usableDays * 100),
    temperatureDayCounts: temperatureTotals,
    cloudContrastDays: cloudContrasts,
    cloudierWindowHigher: cloudHigher,
    cloudierWindowTiedByCapsOrRounding: cloudTied,
    cloudierWindowLower: cloudLower,
  },
  rivers: reports.map((report) => {
    const behavior = report.winterBehavior;
    const high = report.dayLabels["Highly active"] ?? 0;
    const active = report.dayLabels.Active ?? 0;
    return {
      runId: report.runId,
      usableDays: report.usableDays,
      coveragePercent: round2(report.usableDays / report.expectedDays * 100),
      median: report.dayScore.median,
      p90: report.dayScore.p90,
      activeOrHigherPercent: round2((active + high) / report.usableDays * 100),
      highlyActivePercent: round2(high / report.usableDays * 100),
      temperatureSourcesUsed: behavior.temperatureSourcesUsed,
      temperatureBands: behavior.temperatureBands,
      temperatureTrends: behavior.temperatureTrends,
      flowBands: behavior.flowBands,
      calendarMonths: behavior.calendarMonths,
      cloudWindows: behavior.cloudWindows,
      winterSeasons: behavior.winterSeasons,
      topActivityDays: behavior.topActivityDays.slice(0, 5),
    };
  }),
  implementation,
  acceptance,
  watchItem: {
    severity: "low",
    finding:
      "The 35–36°F band sits on the Moderate/Active boundary. Its median is 57–61 by river, and Big Manistee produced 56 Active days out of 72 in that band while Muskegon produced 35 out of 59.",
    interpretation:
      "These are low-end Active scores rather than false high scores, and the overall winter distribution remains conservative. Still, this is the narrow range most likely to feel optimistic if field experience says stable 35°F water should normally remain Moderate unless it is warming.",
    recommendedFollowUp:
      "Keep the current release calibration for now. During owner review, compare a candidate rule that caps water below 36°F at 59 unless the measured trend is gradual warming; accept it only if the replay improves wording/field realism without erasing documented short winter windows.",
  },
  auditCorrections: [
    "Historical Open-Meteo hours are requested in UTC and converted with America/Detroit historical timezone rules.",
    "Pere Marquette fallback days now compute 24/72-hour trends only within the same PMTU sensor series; cross-station differences cannot create warming credit.",
    "Each winter review row contains exactly three daylight blocks with explicit block ID, score, and cloud columns.",
  ],
  limitations: [
    "This is a model-behavior audit, not a catch-rate validation.",
    "Daily USGS temperature means smooth short intraday thermal changes, especially below regulated tailwaters.",
    "Pere Marquette uses three explicitly labeled PMTU stations in priority order and is not a single co-located lower-river record.",
    "Cloud comparisons rank windows within a day; caps intentionally create ties during near-freezing or blown-out conditions.",
  ],
};

const rendered = `${JSON.stringify(audit, null, 2)}\n`;
if (Deno.args.includes("--check")) {
  const current = await Deno.readTextFile(OUTPUT);
  if (current !== rendered) {
    throw new Error(`${OUTPUT} is stale; regenerate the historical audit.`);
  }
} else {
  await Deno.mkdir(AUDIT_DIR, { recursive: true });
  await Deno.writeTextFile(OUTPUT, rendered);
}

console.log(JSON.stringify(
  {
    status: audit.status,
    usableRiverDays: usableDays,
    coveragePercent: audit.replay.coveragePercent,
    activeOrHigherPercent: audit.replay.activeOrHigherPercent,
    highlyActivePercent: audit.replay.highlyActivePercent,
    daysAtLeast90: audit.replay.daysAtLeast90,
    cloudContrastDays: cloudContrasts,
    acceptance,
    watchItem: audit.watchItem,
  },
  null,
  2,
));

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
