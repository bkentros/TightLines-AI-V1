import {
  baselineRowsToUpsertSql,
  canonicalBaselineDaysBetween,
  canonicalMonthDayFromBaselineDay,
  fetchUsgsDailyFlowBaselineObservations,
  generateGaugeBaselineRows,
  type NormalizedBaselineObservation,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  resolveActiveRunWindow,
  validateRiverProfile,
  validateRunProfile,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

type ObservationFile = {
  observations?: NormalizedBaselineObservation[];
};

type Args = {
  input?: string;
  fetchUsgs?: boolean;
  start?: string;
  end?: string;
  baselineVersion?: string;
  year?: number;
  outObservationsJson?: string;
  outBaselinesJson?: string;
  outBaselinesSql?: string;
};

const args = parseArgs(Deno.args);
if (!args.input && !args.fetchUsgs) {
  usageAndExit();
}
if (args.fetchUsgs && (!args.start || !args.end)) {
  usageAndExit(
    "--fetch-usgs requires --start YYYY-MM-DD and --end YYYY-MM-DD.",
  );
}

const baselineVersion = args.baselineVersion ?? "pm-launch-audit";
const auditYear = args.year ?? new Date().getUTCFullYear();
const river = PERE_MARQUETTE_RIVER_PROFILE;
const run = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;
const metric = river.gauge.primaryMetric;

const observations = args.fetchUsgs
  ? await fetchUsgsDailyFlowBaselineObservations({
    fetchFn: fetch,
    riverId: river.riverId,
    siteId: river.gauge.siteId,
    startDate: args.start!,
    endDate: args.end!,
  })
  : await readObservationFile(args.input!);

const normalizedObservations = observations.map(normalizeObservation);
const riverValidation = validateRiverProfile(river);
const runValidation = validateRunProfile(run, river);
const generatedBaselines = generateGaugeBaselineRows({
  observations: normalizedObservations,
  riverId: river.riverId,
  metric,
  baselineVersion,
  sourceNotes:
    "PM Fall Chinook baseline seed generated from normalized USGS daily values.",
});

const runWindow = resolveActiveRunWindow(
  run,
  `${auditYear}-${run.runWindow.peak}`,
);
const requiredDays = canonicalBaselineDaysBetween(
  runWindow.earlyStartDate,
  runWindow.lateEndDate,
);
const generatedDays = new Set(generatedBaselines.map((row) => row.dayOfYear));
const missingDays = requiredDays.filter((day) => !generatedDays.has(day));
const coveragePercent = requiredDays.length === 0
  ? 0
  : (requiredDays.length - missingDays.length) / requiredDays.length;

if (args.outObservationsJson) {
  await Deno.writeTextFile(
    args.outObservationsJson,
    `${JSON.stringify(normalizedObservations, null, 2)}\n`,
  );
}
if (args.outBaselinesJson) {
  await Deno.writeTextFile(
    args.outBaselinesJson,
    `${JSON.stringify(generatedBaselines, null, 2)}\n`,
  );
}
if (args.outBaselinesSql) {
  await Deno.writeTextFile(
    args.outBaselinesSql,
    `${baselineRowsToUpsertSql(generatedBaselines)}\n`,
  );
}

const report = {
  riverId: river.riverId,
  runId: run.runId,
  configValidation: {
    riverValid: riverValidation.valid,
    runStructurallyValid: runValidation.valid,
    runPublicVisible: runValidation.publicVisible,
    issueCount: riverValidation.issues.length + runValidation.issues.length,
  },
  publicAudit: {
    isEnabled: run.publicAudit?.isEnabled === true,
    auditVersion: run.publicAudit?.auditVersion ?? null,
  },
  observations: {
    source: args.fetchUsgs ? "usgs_daily_values" : "local_json",
    rowCount: normalizedObservations.length,
    start: args.start ?? null,
    end: args.end ?? null,
  },
  baselines: {
    metric,
    baselineVersion,
    generatedRowCount: generatedBaselines.length,
    coveragePercent,
    requiredCanonicalDayCount: requiredDays.length,
    missingCanonicalBaselineDays: missingDays,
    missingMonthDays: missingDays.map(canonicalMonthDayFromBaselineDay),
  },
  readiness: {
    configStructurallyValid: riverValidation.valid && runValidation.valid,
    baselineCoveragePass: coveragePercent >= 0.9,
    publicAuditEnabled: run.publicAudit?.isEnabled === true,
    readyForPublicEnable: riverValidation.valid &&
      runValidation.valid &&
      coveragePercent >= 0.9 &&
      run.publicAudit?.isEnabled === true,
  },
};

console.log(JSON.stringify(report, null, 2));

async function readObservationFile(
  path: string,
): Promise<NormalizedBaselineObservation[]> {
  const raw = JSON.parse(await Deno.readTextFile(path)) as
    | ObservationFile
    | NormalizedBaselineObservation[];
  return Array.isArray(raw) ? raw : raw.observations ?? [];
}

function parseArgs(values: string[]): Args {
  const parsed: Args = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--fetch-usgs") {
      parsed.fetchUsgs = true;
      continue;
    }
    const [flag, inline] = value.split("=", 2);
    const next = inline ?? values[index + 1];
    if (inline == null && flag.startsWith("--")) index += 1;
    if (flag === "--input") parsed.input = next;
    if (flag === "--start") parsed.start = next;
    if (flag === "--end") parsed.end = next;
    if (flag === "--baseline-version") parsed.baselineVersion = next;
    if (flag === "--year") parsed.year = Number(next);
    if (flag === "--out-observations-json") parsed.outObservationsJson = next;
    if (flag === "--out-baselines-json") parsed.outBaselinesJson = next;
    if (flag === "--out-baselines-sql") parsed.outBaselinesSql = next;
  }
  return parsed;
}

function normalizeObservation(
  observation: NormalizedBaselineObservation,
): NormalizedBaselineObservation {
  return {
    riverId: observation.riverId,
    metric: observation.metric,
    localDate: observation.localDate,
    value: typeof observation.value === "number" ? observation.value : null,
  };
}

function usageAndExit(message?: string): never {
  if (message) console.error(message);
  console.error(
    [
      "Usage:",
      "  deno run --allow-read --allow-write --allow-net=waterservices.usgs.gov scripts/river-run-pm-launch-audit.ts --input observations.json",
      "  deno run --allow-read --allow-write --allow-net=waterservices.usgs.gov scripts/river-run-pm-launch-audit.ts --fetch-usgs --start YYYY-MM-DD --end YYYY-MM-DD",
      "",
      "Optional exports:",
      "  --out-observations-json path --out-baselines-json path --out-baselines-sql path",
    ].join("\n"),
  );
  Deno.exit(1);
}
