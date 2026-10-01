import {
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  validateConfigurationRevision,
  validateRunProfile,
  WISCONSIN_WINTER_CONFIGURATION_DOCUMENTS,
  WISCONSIN_WINTER_PASS1_DECISIONS,
  WISCONSIN_WINTER_RUN_PROFILES,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

type Replay = {
  runId: string;
  expectedDays: number;
  usableDays: number;
  coveragePercent: number;
  dayScore: { median: number | null; max: number | null; mean: number | null };
  dayLabels: Record<string, number>;
  counterfactuals: {
    cold: number;
    favorable: number;
    gradualWarming: number;
    largeSwing: number;
  };
  invariants: Record<string, number>;
  reviewSampleSize: number;
  limitations: string[];
};

const OUTPUT = "docs/audits/river-run-wisconsin-winter-pass3-review.json";
const riverById = new Map(
  RIVER_RUN_RIVER_PROFILES.map((river) => [river.riverId, river]),
);
const allRunsById = new Map(
  RIVER_RUN_RUN_PROFILES.map((run) => [run.runId, run]),
);
const decisions = WISCONSIN_WINTER_PASS1_DECISIONS.flatMap((river) =>
  river.species
);
const reports = await Promise.all(
  WISCONSIN_WINTER_RUN_PROFILES.map(async (run) =>
    JSON.parse(
      await Deno.readTextFile(
        `docs/audits/river-run-${
          run.runId.replaceAll("_", "-")
        }-activity-replay.json`,
      ),
    ) as Replay
  ),
);
const profileErrors = WISCONSIN_WINTER_RUN_PROFILES.flatMap((run) => {
  const river = riverById.get(run.riverId);
  if (!river) return [{ runId: run.runId, field: "river", message: "missing" }];
  return validateRunProfile(run, river).issues
    .filter((issue) => issue.severity === "error")
    .map((issue) => ({
      runId: run.runId,
      field: issue.field,
      message: issue.message,
    }));
});
const documentErrors = WISCONSIN_WINTER_CONFIGURATION_DOCUMENTS.flatMap(
  (document) =>
    validateConfigurationRevision({
      configKey: document.river.riverId,
      revision: 1,
      status: "published",
      evidenceNotes: "Wisconsin winter Pass 3 acceptance validation.",
      document,
    }).filter((issue) => issue.severity === "error").map((issue) => ({
      riverId: document.river.riverId,
      field: issue.field,
      message: issue.message,
    })),
);
const invariantFailures = reports.flatMap((report) =>
  Object.entries(report.invariants).flatMap(([name, count]) =>
    count === 0 ? [] : [{ runId: report.runId, name, count }]
  )
);
const expectedDays = sum(reports.map((report) => report.expectedDays));
const usableDays = sum(reports.map((report) => report.usableDays));
const minimumCoverage = Math.min(
  ...reports.map((report) => report.coveragePercent),
);
const handoffFailures = decisions.flatMap((decision) => {
  const fall = allRunsById.get(decision.fallRunId);
  const winter = allRunsById.get(decision.futureRunId);
  return fall && winter &&
      winter.runWindow.start === nextMonthDay(fall.runWindow.end) &&
      winter.runWindow.end === "02-28"
    ? []
    : [decision.futureRunId];
});
const acceptance = {
  exactlyFiveRiversAndTenSpeciesPathways:
    WISCONSIN_WINTER_CONFIGURATION_DOCUMENTS.length === 5 &&
    WISCONSIN_WINTER_RUN_PROFILES.length === 10,
  everyProfileValid: profileErrors.length === 0,
  everyConfigurationDocumentValid: documentErrors.length === 0,
  exactFallToWinterHandoffs: handoffFailures.length === 0,
  everyReplayAtLeast80PercentCoverage: minimumCoverage >= 80,
  aggregateReplayAtLeast90PercentCoverage: usableDays / expectedDays >= .9,
  oneHundredStratifiedRowsPerPathway: reports.every((report) =>
    report.reviewSampleSize === 100
  ),
  everyMechanicalInvariantPasses: invariantFailures.length === 0,
  favorableConditionsOutscoreCold: reports.every((report) =>
    report.counterfactuals.favorable > report.counterfactuals.cold
  ),
  stableGradualWarmupOutscoresLargeSwing: reports.every((report) =>
    report.counterfactuals.gradualWarming >
      report.counterfactuals.largeSwing
  ),
  winterScoresRemainConservative: reports.every((report) =>
    (report.dayScore.median ?? 101) <= 59
  ),
};
const accepted = Object.values(acceptance).every(Boolean);

const audit = {
  auditVersion: "wisconsin-winter-steelhead-brown-trout-pass3-v1",
  completedOn: "2026-09-28",
  status: accepted ? "accepted" : "rejected",
  scope: {
    state: "Wisconsin",
    rivers: WISCONSIN_WINTER_PASS1_DECISIONS.map((river) => river.riverId),
    species: ["steelhead", "lake_run_brown_trout"],
    pathways: reports.map((report) => report.runId),
    replayYears: "2021-2025 winter starts",
  },
  method: [
    "Pass 3 incorporates the implementation dependency and five-season behavioral replay before final acceptance.",
    "Archived hourly weather is evaluated on every source-complete active day; representative USGS flow is included where accepted.",
    "Milwaukee and Kewaunee measured-water records begin in 2026, so no earlier water temperatures are invented; deterministic measured-water counterfactuals lock thermal behavior while the historical replay audits the available flow/light pathway.",
    "Every score remains conditional responsiveness for fish already present, never abundance, migration, catch probability, access, ice, or safety.",
  ].join(" "),
  authoritativeSources: [
    {
      role: "legal_season",
      source: "Wisconsin DNR Inland Trout and Salmon Regulations",
      url: "https://dnr.wisconsin.gov/topic/Fishing/seasons/trout",
    },
    {
      role: "tributary_night_restriction",
      source: "Wisconsin DNR Fall Fishing",
      url:
        "https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html",
    },
    {
      role: "winter_brown_trout_location",
      source: "Wisconsin DNR A Year of Fishing",
      url:
        "https://dnr.wisconsin.gov/topic/Fishing/outreach/yearoffishing.html",
    },
    {
      role: "winter_brown_trout_retention",
      source: "Wisconsin DNR 2026 Fishing Report",
      url: "https://dnr.wisconsin.gov/topic/Fishing/outreach/wifishingreport",
    },
    {
      role: "root_river_seasonal_facility_context",
      source: "Wisconsin DNR Root River Report",
      url:
        "https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/rootriverreport",
    },
    {
      role: "bois_brule_exclusion",
      source: "Wisconsin DNR Bois Brule Fishing",
      url:
        "https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/boisbrulefishing",
    },
    {
      role: "flow_and_temperature",
      source: "USGS Water Data for the Nation",
      url: "https://api.waterdata.usgs.gov/ogcapi/v0/",
    },
    {
      role: "hourly_weather_archive",
      source: "Open-Meteo Historical Weather API",
      url: "https://open-meteo.com/en/docs/historical-weather-api",
    },
  ],
  replay: {
    expectedPathwayDays: expectedDays,
    usablePathwayDays: usableDays,
    coveragePercent: round2(usableDays / expectedDays * 100),
    minimumPathwayCoveragePercent: minimumCoverage,
    reviewedRows: sum(reports.map((report) => report.reviewSampleSize)),
    invariantFailures,
    pathways: reports.map((report) => ({
      runId: report.runId,
      expectedDays: report.expectedDays,
      usableDays: report.usableDays,
      coveragePercent: report.coveragePercent,
      score: report.dayScore,
      labels: report.dayLabels,
      counterfactuals: report.counterfactuals,
      reviewedRows: report.reviewSampleSize,
      limitations: report.limitations,
    })),
  },
  validation: { profileErrors, documentErrors, handoffFailures },
  calibrationDecision: {
    result: "accept_pass3_profiles_and_retain_calibrated_thresholds",
    reasons: [
      "Five-season weather and river-source replays keep typical winter days conservative while preserving occasional Active windows.",
      "Stable mild conditions and gradual warming outperform persistent cold and large swings in every pathway.",
      "Clouds rank legal daylight windows; rain receives no independent positive score.",
      "Measured-water scoring leads only where a fresh accepted sensor exists. Air-proxy pathways stay explicitly Limited and capped.",
      "Steelhead retains the full audited river corridor with preferred starting reaches; Brown Trout is restricted to its accepted lower-river or harbor corridor.",
    ],
    activationContract:
      "Each winter profile remains absent until the day after its species-specific fall endpoint, ends February 28, and never overlaps its fall profile.",
    springContract:
      "March 1 is inactive for these winter profiles and reserved for separately researched spring pathways.",
  },
  acceptance,
};

if (!accepted) {
  throw new Error(
    `Wisconsin winter Pass 3 rejected: ${JSON.stringify(acceptance)}`,
  );
}
const rendered = `${JSON.stringify(audit, null, 2)}\n`;
if (Deno.args.includes("--check")) {
  const current = await Deno.readTextFile(OUTPUT);
  if (current !== rendered) throw new Error(`${OUTPUT} is stale`);
  console.log("Wisconsin winter Pass 3 review artifact is current.");
} else {
  await Deno.mkdir("docs/audits", { recursive: true });
  await Deno.writeTextFile(OUTPUT, rendered);
  console.log(`Wrote ${OUTPUT}`);
}

function nextMonthDay(value: string): string {
  const [month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(2000, month - 1, day + 1));
  return `${String(date.getUTCMonth() + 1).padStart(2, "0")}-${
    String(date.getUTCDate()).padStart(2, "0")
  }`;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
