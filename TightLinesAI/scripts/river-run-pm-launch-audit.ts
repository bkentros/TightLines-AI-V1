import {
  baselineRowsToUpsertSql,
  canonicalBaselineDaysBetween,
  canonicalMonthDayFromBaselineDay,
  fetchUsgsDailyFlowBaselineObservations,
  generateGaugeBaselineRows,
  getPrimaryHydraulicSource,
  getRunTemperatureSources,
  type NormalizedBaselineObservation,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  resolveActiveRunWindow,
  resolveConditionsSuggestCheckpoints,
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
const hydraulicSource = getPrimaryHydraulicSource(river);
const metric = hydraulicSource.primaryMetric;

const observations = args.fetchUsgs
  ? await fetchUsgsDailyFlowBaselineObservations({
    fetchFn: fetch,
    riverId: river.riverId,
    siteId: hydraulicSource.siteId,
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
  sourceNotes: args.fetchUsgs
    ? `PM Fall Chinook USGS daily mean discharge ${args.start} through ${args.end} via Water Data OGC API; plus-or-minus 14 canonical-day rolling percentiles.`
    : "PM Fall Chinook normalized local audit observations; plus-or-minus 14 canonical-day rolling percentiles.",
});

const runWindow = resolveActiveRunWindow(
  run,
  `${auditYear}-${run.runWindow.peak}`,
);
const requiredDays = canonicalBaselineDaysBetween(
  runWindow.stagingStartDate,
  runWindow.lateEndDate,
);
const generatedDays = new Set(generatedBaselines.map((row) => row.dayOfYear));
const missingDays = requiredDays.filter((day) => !generatedDays.has(day));
const coveragePercent = requiredDays.length === 0
  ? 0
  : (requiredDays.length - missingDays.length) / requiredDays.length;
const requiredConditionCheckpointIds = resolveConditionsSuggestCheckpoints(
  run,
  `${auditYear}-${run.runWindow.peak}`,
).map((checkpoint) => checkpoint.checkpointId);
const conditionsSeed = await inspectConditionsSuggestSeed(
  requiredConditionCheckpointIds,
  run.conditionsSuggest.baselineVersion,
);
const conditionsTemperatureSource = getRunTemperatureSources(river, run).find(
  (source) => source.sourceId === run.conditionsSuggest.temperatureSourceId,
);

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
  sources: {
    primaryHydraulic: {
      sourceId: hydraulicSource.sourceId,
      provider: hydraulicSource.provider,
      siteId: hydraulicSource.siteId,
      metric: hydraulicSource.primaryMetric,
    },
    measuredWaterTemperaturePriority: getRunTemperatureSources(river, run)
      .map((source) => ({
        sourceId: source.sourceId,
        provider: source.provider,
        siteId: source.siteId,
        seriesId: source.seriesId ?? null,
        role: source.role,
      })),
    conditionsSuggestTemperature: conditionsTemperatureSource
      ? {
        sourceId: conditionsTemperatureSource.sourceId,
        provider: conditionsTemperatureSource.provider,
        siteId: conditionsTemperatureSource.siteId,
        seriesId: conditionsTemperatureSource.seriesId ?? null,
      }
      : null,
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
  conditionsSuggestBaseline: {
    baselineVersion: run.conditionsSuggest.baselineVersion,
    generatedRowCount: conditionsSeed.generatedRowCount,
    coveragePercent: conditionsSeed.coveragePercent,
    requiredCheckpointCount: requiredConditionCheckpointIds.length,
    missingCheckpoints: conditionsSeed.missingCheckpoints,
    minimumUsableYears: run.conditionsSuggest.minimumUsableYears,
    repositorySeedPresent: conditionsSeed.repositorySeedPresent,
  },
  push: {
    rulesVersion: run.push.version,
    replayCommand: "npm run replay:river-run:pm-push",
  },
  fishability: {
    rulesVersion: run.fishabilityBands.version,
    metric: run.fishabilityBands.metric,
    sourceLabel: run.fishabilityBands.sourceLabel,
    replayCommand: "npm run replay:river-run:pm-fishability",
  },
  readiness: {
    configStructurallyValid: riverValidation.valid && runValidation.valid,
    baselineCoveragePass: coveragePercent >= 0.9,
    conditionsSuggestBaselinePass: conditionsSeed.repositorySeedPresent &&
      conditionsSeed.coveragePercent >= 0.9,
    publicAuditEnabled: run.publicAudit?.isEnabled === true,
    foundationDataPass: riverValidation.valid &&
      runValidation.valid &&
      coveragePercent >= 0.9 &&
      run.publicAudit?.isEnabled === true,
    readyForPublicEnable: false,
    blockingGates: [
      "Conditions Suggest in-app owner output/copy acceptance",
      "PM Push in-app owner output/copy acceptance",
      "PM Fishability in-app owner output/copy acceptance",
      "hidden production observation and production smoke",
    ],
  },
};

console.log(JSON.stringify(report, null, 2));

async function inspectConditionsSuggestSeed(
  requiredCheckpointIds: string[],
  expectedBaselineVersion: string,
): Promise<{
  repositorySeedPresent: boolean;
  generatedRowCount: number;
  coveragePercent: number;
  missingCheckpoints: string[];
}> {
  const seedUrl = new URL(
    "../supabase/migrations/20260727123000_seed_river_run_pm_conditions_suggest_baselines.sql",
    import.meta.url,
  );
  try {
    const sql = await Deno.readTextFile(seedUrl);
    const pattern =
      /^\s{2}\('pere_marquette', 'pere_marquette_fall_chinook', '(river_start|building_start|peak_start|peak_complete)', \d+, \d+, '([^']+)'/gm;
    const seededCheckpoints = new Set(
      [...sql.matchAll(pattern)]
        .filter((match) => match[2] === expectedBaselineVersion)
        .map((match) => match[1]),
    );
    const missingCheckpoints = requiredCheckpointIds.filter((checkpointId) =>
      !seededCheckpoints.has(checkpointId)
    );
    return {
      repositorySeedPresent: true,
      generatedRowCount: seededCheckpoints.size,
      coveragePercent: requiredCheckpointIds.length === 0
        ? 0
        : (requiredCheckpointIds.length - missingCheckpoints.length) /
          requiredCheckpointIds.length,
      missingCheckpoints,
    };
  } catch {
    return {
      repositorySeedPresent: false,
      generatedRowCount: 0,
      coveragePercent: 0,
      missingCheckpoints: requiredCheckpointIds,
    };
  }
}

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
      "  deno run --allow-read --allow-write --allow-net=api.waterdata.usgs.gov,monitormywatershed.org scripts/river-run-pm-launch-audit.ts --input observations.json",
      "  deno run --allow-read --allow-write --allow-net=api.waterdata.usgs.gov,monitormywatershed.org scripts/river-run-pm-launch-audit.ts --fetch-usgs --start YYYY-MM-DD --end YYYY-MM-DD",
      "",
      "Optional exports:",
      "  --out-observations-json path --out-baselines-json path --out-baselines-sql path",
    ].join("\n"),
  );
  Deno.exit(1);
}
