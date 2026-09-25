type ScoreSummary = {
  min: number | null;
  p10: number | null;
  median: number | null;
  p90: number | null;
  max: number | null;
  mean: number | null;
};

type ReplayReport = {
  runId: string;
  rulesVersion: string;
  replayYears: string;
  method: string;
  expectedDays: number;
  usableDays: number;
  missing: Record<string, number>;
  dayScore: ScoreSummary;
  blockScore: ScoreSummary;
  dayLabels: Record<string, number>;
  byTemperature: Record<string, { days: number; scores: ScoreSummary }>;
  spread: ScoreSummary;
  invariants: Record<string, number>;
  reviewSampleSize: number;
};

const AUDIT_DIR = "docs/audits";
const OUTPUT = `${AUDIT_DIR}/river-run-michigan-winter-steelhead-pass2-review.json`;
const riverIds = [
  "pere-marquette",
  "big-manistee",
  "muskegon",
  "st-joseph",
  "grand",
] as const;

const reports = await Promise.all(riverIds.map(async (riverId) => {
  const path = `${AUDIT_DIR}/river-run-${riverId}-winter-steelhead-activity-replay.json`;
  return JSON.parse(await Deno.readTextFile(path)) as ReplayReport;
}));

const reviewCsvAudits = await Promise.all(riverIds.map(async (riverId) => {
  const path = `${AUDIT_DIR}/river-run-${riverId}-winter-steelhead-activity-review-100.csv`;
  const lines = (await Deno.readTextFile(path)).trimEnd().split("\n");
  const headerColumns = parseCsvRow(lines[0]).length;
  return {
    rows: Math.max(0, lines.length - 1),
    headerColumns,
    malformedRows: lines.slice(1).filter((line) =>
      parseCsvRow(line).length !== headerColumns
    ).length,
  };
}));
const reviewRows = reviewCsvAudits.map((audit) => audit.rows);

const expectedDays = sum(reports.map((report) => report.expectedDays));
const usableDays = sum(reports.map((report) => report.usableDays));
const invariantFailures = reports.flatMap((report) =>
  Object.entries(report.invariants).flatMap(([name, count]) =>
    count === 0 ? [] : [{ runId: report.runId, name, count }]
  )
);
const minimumRiverCoverage = Math.min(
  ...reports.map((report) => report.usableDays / report.expectedDays * 100),
);
const favorableTemperatureDays = sum(reports.map((report) =>
  report.byTemperature.from38To45F?.days ?? 0
));
const coldTemperatureDays = sum(reports.map((report) =>
  report.byTemperature.below38F?.days ?? 0
));
const maximumObservedBlockSpread = Math.max(
  ...reports.map((report) => report.spread.max ?? 0),
);
const totalReviewRows = sum(reviewRows);

const acceptance = {
  allFiveRunsPresent: reports.length === riverIds.length,
  everyRiverAtLeast90PercentCoverage: minimumRiverCoverage >= 90,
  aggregateCoverageAtLeast95Percent: usableDays / expectedDays >= .95,
  allMechanicalInvariantsPass: invariantFailures.length === 0,
  oneHundredStratifiedRowsPerRiver:
    reviewRows.every((count) => count === 100) && totalReviewRows === 500,
  reviewCsvShapesValid: reviewCsvAudits.every((audit) =>
    audit.headerColumns === 21 && audit.malformedRows === 0
  ),
  measuredTemperatureSeparatesFavorableWater:
    reports.every((report) => {
      const favorable = report.byTemperature.from38To45F;
      const cold = report.byTemperature.below38F;
      return favorable && cold && favorable.days > 0 && cold.days > 0 &&
        (favorable.scores.median ?? 0) > (cold.scores.median ?? 100);
    }),
  cloudsRankWindowsWithoutDominatingDailyScore:
    maximumObservedBlockSpread >= 5 && maximumObservedBlockSpread <= 12,
};
const accepted = Object.values(acceptance).every(Boolean);

const audit = {
  auditVersion: "michigan-winter-steelhead-pass2-v1",
  completedOn: "2026-09-25",
  status: accepted ? "accepted" : "rejected",
  scope: {
    state: "Michigan",
    species: "Steelhead",
    pathway: "Winter holding",
    rivers: reports.map((report) => report.runId),
    replayYears: "2021-2025 winter starts (December-start seasons continue into the following February)",
  },
  method: [
    "Mechanical replay of every model-active winter date using accepted USGS/PMTU measured-water records and archived hourly weather.",
    "Hourly weather is requested in UTC and converted with America/Detroit historical timezone rules before daylight blocks are scored; this avoids the archive provider's fixed-offset historical labeling.",
    "The replay evaluates model behavior, confidence, scope copy, and safety caps. It does not estimate catch probability or validate fish abundance.",
  ].join(" "),
  sourceRecords: [
    {
      role: "biology_and_season",
      source: "Michigan DNR Steelhead species profile",
      url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead",
    },
    {
      role: "temperature_led_movement_context",
      source: "Workman, Hayes, and Coon (2002), Transactions of the American Fisheries Society",
      url: "https://doi.org/10.1577/1548-8659(2002)131%3C0463:AMOSMI%3E2.0.CO;2",
    },
    {
      role: "winter_run_strain_context",
      source: "Michigan DNR Little Manistee River Weir",
      url: "https://www.michigan.gov/dnr/managing-resources/fisheries/hatcheries/little-manistee-river-weir",
    },
    {
      role: "flow_and_water_temperature",
      source: "USGS Water Data for the Nation: 04122500, 04125550, 04121970, 04101500, 04119000, and 04118564",
      url: "https://api.waterdata.usgs.gov/ogcapi/v0/",
    },
    {
      role: "pere_marquette_water_temperature",
      source: "Pere Marquette Trout Unlimited stations via Monitor My Watershed",
      url: "https://monitormywatershed.org/",
    },
    {
      role: "hourly_light_and_cloud_archive",
      source: "Open-Meteo Historical Weather API",
      url: "https://open-meteo.com/en/docs/historical-weather-api",
    },
  ],
  replay: {
    expectedRiverDays: expectedDays,
    usableRiverDays: usableDays,
    coveragePercent: round2(usableDays / expectedDays * 100),
    minimumRiverCoveragePercent: round2(minimumRiverCoverage),
    scoredDaylightBlocks: usableDays * 3,
    stratifiedReviewRows: totalReviewRows,
    favorableMeasuredWaterDays38To45F: favorableTemperatureDays,
    colderMeasuredWaterDaysBelow38F: coldTemperatureDays,
    maximumObservedWithinDayBlockSpread: maximumObservedBlockSpread,
    invariantFailures,
    rivers: reports.map((report, index) => ({
      runId: report.runId,
      rulesVersion: report.rulesVersion,
      expectedDays: report.expectedDays,
      usableDays: report.usableDays,
      coveragePercent: round2(report.usableDays / report.expectedDays * 100),
      dayScore: report.dayScore,
      labels: report.dayLabels,
      reviewRows: reviewRows[index],
      reviewCsvColumns: reviewCsvAudits[index].headerColumns,
      malformedReviewRows: reviewCsvAudits[index].malformedRows,
      missing: report.missing,
      maximumBlockSpread: report.spread.max,
    })),
  },
  calibrationDecision: {
    result: "retain_pass1_thresholds_and_weights",
    reasons: [
      "Measured water temperature cleanly separates the 38–45°F band from colder winter water across every river while near-freezing and blown-out caps remain intact.",
      "Gradual measured-water warming remains more favorable than stable, cooling, or sharp-swing counterfactuals; air temperature is never substituted for measured water.",
      "Cloud-filtered daylight changes block ranking by a useful but bounded amount, while rain contributes no independent positive score.",
      "River-specific score distributions reflect observed thermal and hydraulic differences instead of a forced statewide baseline.",
      "No lifecycle adjustment is added: winter phase labels describe the seasonal handoff, while Activity remains driven by current conditions.",
    ],
    unchangedWeights: {
      waterTemperature: 0.45,
      temperatureTrend: 0.2,
      daylightAndCloud: 0.2,
      hydraulics: 0.15,
      independentRain: 0,
    },
    unchangedSeasonBoundary: {
      pereMarquette: "December 23 through February 28",
      bigManistee: "December 23 through February 28",
      muskegon: "December 23 through February 28",
      stJoseph: "December 23 through February 28",
      grand: "January 1 through February 28",
      march1: "inactive; reserved for a separately researched spring pathway",
    },
  },
  acceptance,
  limitations: [
    "Scores are mechanistic responsiveness estimates, not catch-rate predictions.",
    "Pere Marquette temperature uses the configured priority chain across three labeled PMTU stations; it is not a single co-located lower-river record.",
    "Grand River combines Fulton Street flow with North Park measured temperature and is restricted to the documented downtown scope.",
    "Each remaining USGS model describes its named gauge reach, not the entire river.",
    "Historical replay cannot validate ice access or personal safety; ice-affected live readings remain excluded from scoring.",
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

console.log(JSON.stringify({
  status: audit.status,
  expectedRiverDays: expectedDays,
  usableRiverDays: usableDays,
  coveragePercent: audit.replay.coveragePercent,
  scoredDaylightBlocks: audit.replay.scoredDaylightBlocks,
  stratifiedReviewRows: totalReviewRows,
  acceptance,
}, null, 2));

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
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      result.push(value);
      value = "";
    } else {
      value += character;
    }
  }
  result.push(value);
  return result;
}
