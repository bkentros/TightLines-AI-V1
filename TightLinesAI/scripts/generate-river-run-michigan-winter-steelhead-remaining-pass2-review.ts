type ScoreSummary = {
  min: number | null;
  p10: number | null;
  median: number | null;
  p90: number | null;
  max: number | null;
  mean: number | null;
};

type GroupSummary = {
  days: number;
  scores: ScoreSummary;
  labels: Record<string, number>;
};

type ReplayReport = {
  runId: string;
  rulesVersion: string;
  mode: "air_temperature_proxy" | "measured_water";
  replayYears: string;
  expectedDays: number;
  usableDays: number;
  coveragePercent: number;
  missing: Record<string, number>;
  dayScore: ScoreSummary;
  dayLabels: Record<string, number>;
  byAirPattern: Record<string, GroupSummary> | null;
  byMeasuredWaterBand: Record<string, GroupSummary> | null;
  byFlowBand: Record<string, GroupSummary> | null;
  cloudWindowAudit: {
    daysWithAtLeast40PointCloudContrast: number;
    cloudierHigher: number;
    tied: number;
    cloudierLower: number;
    scoreDifference: ScoreSummary;
  };
  spread: ScoreSummary;
  invariants: Record<string, number>;
  reviewSampleSize: number;
};

const AUDIT_DIR = "docs/audits";
const OUTPUT =
  `${AUDIT_DIR}/river-run-michigan-winter-steelhead-remaining-pass2-review.json`;
const riverIds = [
  "betsie",
  "bear-creek-manistee",
  "rogue-mi",
  "platte",
  "white",
] as const;

const reports = await Promise.all(riverIds.map(async (riverId) => {
  const path =
    `${AUDIT_DIR}/river-run-${riverId}-winter-steelhead-remaining-pass2-replay.json`;
  return JSON.parse(await Deno.readTextFile(path)) as ReplayReport;
}));
const csvAudits = await Promise.all(riverIds.map(async (riverId) => {
  const path =
    `${AUDIT_DIR}/river-run-${riverId}-winter-steelhead-remaining-pass2-review-100.csv`;
  const lines = (await Deno.readTextFile(path)).trimEnd().split("\n");
  const columns = parseCsvRow(lines[0]).length;
  return {
    rows: Math.max(0, lines.length - 1),
    columns,
    malformedRows: lines.slice(1).filter((line) =>
      parseCsvRow(line).length !== columns
    ).length,
  };
}));

const proxyReports = reports.filter((report) =>
  report.mode === "air_temperature_proxy"
);
const measuredReport = reports.find((report) =>
  report.mode === "measured_water"
)!;
const expectedDays = sum(reports.map((report) => report.expectedDays));
const usableDays = sum(reports.map((report) => report.usableDays));
const minimumCoverage = Math.min(
  ...reports.map((report) => report.usableDays / report.expectedDays * 100),
);
const invariantFailures = reports.flatMap((report) =>
  Object.entries(report.invariants).flatMap(([name, count]) =>
    count === 0 ? [] : [{ runId: report.runId, name, count }]
  )
);
const totalActiveOrHigher = sum(
  reports.map((report) =>
    (report.dayLabels.Active ?? 0) + (report.dayLabels["Highly active"] ?? 0)
  ),
);
const maximumBlockSpread = Math.max(
  ...reports.map((report) => report.spread.max ?? 0),
);

const acceptance = {
  allFiveRunsPresent: reports.length === 5 && proxyReports.length === 4 &&
    measuredReport != null,
  everyRiverAtLeast95PercentCoverage: minimumCoverage >= 95,
  aggregateCoverageAtLeast98Percent: usableDays / expectedDays >= .98,
  allMechanicalInvariantsPass: invariantFailures.length === 0,
  oneHundredReviewRowsPerRiver: csvAudits.every((audit) => audit.rows === 100),
  reviewCsvShapesValid: csvAudits.every((audit) =>
    audit.columns === 21 && audit.malformedRows === 0
  ),
  proxyWintersRemainPredominantlyNonActive: proxyReports.every((report) =>
    (report.dayLabels.Active ?? 0) / report.usableDays < .5 &&
    (report.dayLabels["Highly active"] ?? 0) === 0
  ),
  proxyWarmupsSeparateFromColdAndSwings: proxyReports.every((report) => {
    const warming = report.byAirPattern?.gradual_warming;
    const cold = report.byAirPattern?.persistent_cold;
    const swing = report.byAirPattern?.large_swing;
    return warming && cold && swing && warming.days >= 20 && cold.days >= 20 &&
      swing.days >= 20 && (warming.scores.median ?? 0) >
        (cold.scores.median ?? 100) &&
      (warming.scores.median ?? 0) >
        (swing.scores.median ?? 100) &&
      (cold.scores.max ?? 100) <= 39 &&
      (swing.scores.max ?? 100) <= 39;
  }),
  measuredWaterSeparatesUsefulFromNearFreezing: (() => {
    const useful = measuredReport.byMeasuredWaterBand?.["38To45F"];
    const frozen = measuredReport.byMeasuredWaterBand?.atOrBelow33_5F;
    return useful && frozen && useful.days >= 20 && frozen.days >= 20 &&
      (useful.scores.median ?? 0) > (frozen.scores.median ?? 100) &&
      (frozen.scores.max ?? 100) <= 29;
  })(),
  blownOutRogueDaysAreInactive: (() => {
    const blownOut = reports.find((report) =>
      report.runId === "rogue_mi_winter_steelhead"
    )?.byFlowBand?.blown_out;
    return blownOut && blownOut.days > 0 && (blownOut.scores.max ?? 100) <= 19;
  })(),
  cloudsOnlyImproveOrTieComparedWindows:
    reports.every((report) =>
      report.cloudWindowAudit.daysWithAtLeast40PointCloudContrast > 0 &&
      report.cloudWindowAudit.cloudierLower === 0
    ) && maximumBlockSpread >= 5 && maximumBlockSpread <= 12,
};
const accepted = Object.values(acceptance).every(Boolean);

const audit = {
  auditVersion: "michigan-winter-steelhead-remaining-pass2-v1",
  completedOn: "2026-09-27",
  status: accepted ? "accepted" : "rejected",
  scope: {
    state: "Michigan",
    species: "Steelhead",
    pathway: "Winter holding",
    rivers: reports.map((report) => report.runId),
    replayYears:
      "2021-2025 winter starts for Betsie, Bear Creek, Rogue, and Platte; 2022-2025 winter starts for White because the accepted Weaver Street archive begins in 2022.",
  },
  method: [
    "Every model-active date was replayed with archived hourly Open-Meteo weather converted from UTC through America/Detroit historical timezone rules.",
    "Rogue alone adds its configured Packer Drive USGS daily flow; White requires both configured Fruitvale USGS flow and Weaver Street measured temperature from Monitor My Watershed.",
    "No missing observation was filled and no neighboring river sensor was borrowed. The audit measures deterministic model behavior, not fish abundance, access, safety, or catch probability.",
  ].join(" "),
  sourceRecords: [
    {
      role: "biology_and_season",
      source: "Michigan DNR Steelhead species profile",
      url:
        "https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead",
    },
    {
      role: "temperature_led_movement_context",
      source:
        "Workman, Hayes, and Coon (2002), Transactions of the American Fisheries Society",
      url:
        "https://doi.org/10.1577/1548-8659(2002)131%3C0463:AMOSMI%3E2.0.CO;2",
    },
    {
      role: "flow",
      source: "USGS Water Data for the Nation: 04118500 and 04122200",
      url: "https://api.waterdata.usgs.gov/ogcapi/v0/",
    },
    {
      role: "white_measured_water_temperature",
      source: "Weaver Street station via Monitor My Watershed",
      url: "https://monitormywatershed.org/",
    },
    {
      role: "hourly_weather_archive",
      source: "Open-Meteo Historical Weather API",
      url: "https://open-meteo.com/en/docs/historical-weather-api",
    },
  ],
  replay: {
    expectedRiverDays: expectedDays,
    usableRiverDays: usableDays,
    coveragePercent: round2(usableDays / expectedDays * 100),
    minimumRiverCoveragePercent: round2(minimumCoverage),
    scoredDaylightBlocks: usableDays * 3,
    stratifiedReviewRows: sum(csvAudits.map((audit) => audit.rows)),
    activeOrHigherDays: totalActiveOrHigher,
    activeOrHigherPercent: round2(totalActiveOrHigher / usableDays * 100),
    maximumObservedWithinDayBlockSpread: maximumBlockSpread,
    invariantFailures,
    rivers: reports.map((report, index) => ({
      runId: report.runId,
      rulesVersion: report.rulesVersion,
      mode: report.mode,
      replayYears: report.replayYears,
      expectedDays: report.expectedDays,
      usableDays: report.usableDays,
      coveragePercent: report.coveragePercent,
      dayScore: report.dayScore,
      labels: report.dayLabels,
      reviewRows: csvAudits[index].rows,
      reviewCsvColumns: csvAudits[index].columns,
      malformedReviewRows: csvAudits[index].malformedRows,
      missing: report.missing,
      maximumBlockSpread: report.spread.max,
    })),
  },
  calibrationDecision: {
    result: "retain_pass1_dates_presence_and_activity_calibration",
    reasons: [
      "All four air-proxy rivers remain predominantly Reserved or Inactive; gradual warmups separate cleanly from persistent cold and large-swing days without producing Highly active claims.",
      "Rogue flow adds a legitimate hydraulic fail-safe: every observed blown-out day is capped at 19 while measured flow remains explicitly lower-reach only.",
      "White measured water provides the strongest discrimination: every day at or below 33.5°F is capped at 29, while 38–45°F water supports a 75 median and only 11 of 236 usable days reach Highly active.",
      "Cloud cover improves or ties the daylight window in every high-contrast comparison, never reverses it, and remains bounded by the thermal and hydraulic caps; rain receives no independent credit.",
      "The month-by-month results remain condition-led rather than being inflated by a lifecycle stage. Presence declines separately toward the February 28 spring handoff.",
    ],
    unchangedModeCalibration: {
      weatherOnly:
        "60% multi-day air-temperature context, 40% daylight/cloud, Limited confidence, 64 today / 62 tomorrow ceiling",
      rogue:
        "50% multi-day air-temperature context, 25% lower-reach measured flow, 25% daylight/cloud, Limited confidence, 69 ceiling",
      white:
        "45% measured water temperature, 20% measured-water trend, 20% daylight/cloud, 15% measured flow",
      independentRainWeight: 0,
    },
    unchangedSeasonBoundaries: {
      betsie: "December 18 through February 28",
      bearCreekManistee: "January 1 through February 28",
      rogue: "January 1 through February 28",
      platte: "December 16 through February 28",
      white: "December 29 through February 28",
      march1: "inactive; reserved for a separately researched spring pathway",
    },
  },
  acceptance,
  limitations: [
    "Air-proxy scores are deliberately Limited context and never measured or estimated water temperature.",
    "Betsie, Bear Creek, and Platte have no accepted live hydraulic input; the model cannot infer river level, clarity, ice, access, or safety.",
    "Rogue flow represents Packer Drive only. White combines separately located Fruitvale flow and Weaver Street temperature, with the reach limits always disclosed.",
    "Historical source replay validates model mechanics and plausible differentiation, not catch rates or equal fish distribution across the corridor.",
  ],
};

if (!accepted) {
  throw new Error(`Pass 2 acceptance failed: ${JSON.stringify(acceptance)}`);
}

const rendered = `${JSON.stringify(audit, null, 2)}\n`;
if (Deno.args.includes("--check")) {
  const current = await Deno.readTextFile(OUTPUT);
  if (current !== rendered) {
    throw new Error(`${OUTPUT} is stale; regenerate the Pass 2 review.`);
  }
} else {
  await Deno.mkdir(AUDIT_DIR, { recursive: true });
  await Deno.writeTextFile(OUTPUT, rendered);
}

console.log(JSON.stringify(
  {
    status: audit.status,
    expectedRiverDays: expectedDays,
    usableRiverDays: usableDays,
    coveragePercent: audit.replay.coveragePercent,
    scoredDaylightBlocks: audit.replay.scoredDaylightBlocks,
    stratifiedReviewRows: audit.replay.stratifiedReviewRows,
    acceptance,
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

function parseCsvRow(line: string): string[] {
  const result: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index++;
      } else quoted = !quoted;
    } else if (character === "," && !quoted) {
      result.push(value);
      value = "";
    } else value += character;
  }
  result.push(value);
  return result;
}
