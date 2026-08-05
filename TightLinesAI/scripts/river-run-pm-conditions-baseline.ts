import {
  conditionsSuggestBaselineRowsToUpsertSql,
  fetchMonitorMyWatershedTemperature,
  fetchUsgsDailyFlowBaselineObservations,
  generateConditionsSuggestBaselineRows,
  getPrimaryHydraulicSource,
  type NormalizedTemperatureBaselineObservation,
  parseMonitorMyWatershedTemperature,
  PERE_MARQUETTE_RIVER_PROFILE,
  resolveConditionsSuggestCheckpoints,
  RIVER_RUN_RUN_PROFILES,
  summarizeConditionsSuggestHistoricalReplay,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

const river = PERE_MARQUETTE_RIVER_PROFILE;
const runId = argumentValue("--run-id") ?? "pere_marquette_fall_chinook";
const run = RIVER_RUN_RUN_PROFILES.find((candidate) =>
  candidate.runId === runId && candidate.riverId === river.riverId
);
if (!run) {
  throw new Error(`Unknown Pere Marquette run ID: ${runId}`);
}
const gauge = getPrimaryHydraulicSource(river);
const temperatureSource = river.waterTemperatureSources.find((source) =>
  source.sourceId === run.conditionsSuggest.temperatureSourceId
);
if (!temperatureSource) {
  throw new Error(
    "Configured Conditions Suggest temperature source is missing.",
  );
}

const startYear = 2021;
const endYear = 2025;
const gaugeObservations = await fetchUsgsDailyFlowBaselineObservations({
  fetchFn: fetch,
  riverId: river.riverId,
  siteId: gauge.siteId,
  startDate: `${startYear}-01-01`,
  endDate: `${endYear}-12-31`,
});
const temperatureObservations: NormalizedTemperatureBaselineObservation[] = [];
const temperatureRowsByYear: Record<string, number> = {};
for (let year = startYear; year <= endYear; year++) {
  const csv = await fetchMonitorMyWatershedTemperature({
    fetchFn: fetch,
    source: temperatureSource,
    endAtUtc: `${year}-12-31T23:59:59.000Z`,
    lookbackDays: 365,
  });
  if (!csv) {
    temperatureRowsByYear[String(year)] = 0;
    continue;
  }
  const parsed = parseMonitorMyWatershedTemperature({
    csv,
    source: temperatureSource,
  });
  const annual = parsed.observations.filter((observation) =>
    observation.observedAt.startsWith(`${year}-`)
  );
  temperatureRowsByYear[String(year)] = annual.length;
  temperatureObservations.push(...annual.map((observation) => ({
    sourceId: observation.sourceId,
    localDate: localDateInTimezone(observation.observedAt, river.timezone),
    waterTempF: observation.waterTempF,
  })));
}

const checkpointDefinitions = resolveConditionsSuggestCheckpoints(
  run,
  `2026-${run.runWindow.peak}`,
).map((checkpoint) => ({
  checkpointId: checkpoint.checkpointId,
  observationStartMonthDay: checkpoint.observationStartDate.slice(5),
  checkpointMonthDay: checkpoint.checkpointDate.slice(5),
}));
const sourceNotes =
  `PM ${run.displayName} cumulative Conditions Suggest checkpoints: USGS ${gauge.siteId} daily mean ${gauge.primaryMetric} and PMTU/Monitor My Watershed ${temperatureSource.siteId} result ${temperatureSource.seriesId}, ${startYear}-${endYear}; staging start through each completed checkpoint; ${Math.round((run.conditionsSuggest.gaugeWeight ?? 0.6) * 100)}% gauge response and ${Math.round((run.conditionsSuggest.waterTemperatureWeight ?? 0.4) * 100)}% measured-water pattern.`;
const rows = generateConditionsSuggestBaselineRows({
  gaugeObservations,
  temperatureObservations,
  riverId: river.riverId,
  runId: run.runId,
  gaugeMetric: gauge.primaryMetric,
  gaugeSiteId: gauge.siteId,
  temperatureSourceId: temperatureSource.sourceId,
  baselineVersion: run.conditionsSuggest.baselineVersion,
  checkpoints: checkpointDefinitions,
  minimumCoveragePercent: run.conditionsSuggest.minimumCoveragePercent,
  minimumUsableYears: run.conditionsSuggest.minimumUsableYears,
  coolEnoughPercentileCap: run.conditionsSuggest.coolEnoughPercentileCap,
  tooWarmF: run.push.temperature.tooWarmF,
  gaugeWeight: run.conditionsSuggest.gaugeWeight,
  waterTemperatureWeight: run.conditionsSuggest.waterTemperatureWeight,
  sourceNotes,
});
const missingCheckpoints = checkpointDefinitions.filter((checkpoint) =>
  !rows.some((row) => row.checkpointId === checkpoint.checkpointId)
).map((checkpoint) => checkpoint.checkpointId);
const coveragePercent = rows.length / checkpointDefinitions.length;
const historicalReplay = summarizeConditionsSuggestHistoricalReplay({
  rows,
  run,
});
const report = {
  riverId: river.riverId,
  runId: run.runId,
  baselineVersion: run.conditionsSuggest.baselineVersion,
  gaugeObservationCount: gaugeObservations.length,
  temperatureRowsByYear,
  temperatureObservationCount: temperatureObservations.length,
  requiredCheckpoints: checkpointDefinitions.length,
  generatedRows: rows.length,
  coveragePercent,
  missingCheckpoints,
  minimumDistinctYears: rows.length === 0
    ? 0
    : Math.min(...rows.map((row) => row.distinctYears)),
  checkpointRows: rows.map((row) => ({
    checkpointId: row.checkpointId,
    expectedDays: row.expectedDays,
    minimumUsableDays: row.minimumUsableDays,
    distinctYears: row.distinctYears,
  })),
  historicalReplay,
};

const outputIndex = Deno.args.findIndex((arg) => arg === "--out-sql");
if (outputIndex >= 0) {
  const outputPath = Deno.args[outputIndex + 1];
  if (!outputPath) throw new Error("--out-sql requires a path.");
  await Deno.writeTextFile(
    outputPath,
    `${conditionsSuggestBaselineRowsToUpsertSql(rows)}\n`,
  );
}
console.log(JSON.stringify(report, null, 2));
if (coveragePercent < 0.9) Deno.exit(1);

function localDateInTimezone(iso: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const value = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${value.year}-${value.month}-${value.day}`;
}

function argumentValue(flag: string): string | null {
  const inline = Deno.args.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) return inline.slice(flag.length + 1) || null;
  const index = Deno.args.indexOf(flag);
  return index >= 0 ? Deno.args[index + 1] ?? null : null;
}
