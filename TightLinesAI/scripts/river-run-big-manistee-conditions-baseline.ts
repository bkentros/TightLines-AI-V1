import {
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
  BIG_MANISTEE_FALL_COHO_RUN_PROFILE,
  BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  conditionsSuggestBaselineRowsToUpsertSql,
  fetchUsgsDailyFlowBaselineObservations,
  generateConditionsSuggestBaselineRows,
  getPrimaryHydraulicSource,
  type NormalizedTemperatureBaselineObservation,
  resolveConditionsSuggestCheckpoints,
  summarizeConditionsSuggestHistoricalReplay,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

const river = BIG_MANISTEE_RIVER_PROFILE;
const requestedRunId = argumentValue("--run-id") ??
  "big_manistee_fall_chinook";
if (
  requestedRunId !== "big_manistee_fall_chinook" &&
  requestedRunId !== "big_manistee_fall_coho" &&
  requestedRunId !== "big_manistee_fall_steelhead"
) throw new Error(`Unsupported Big Manistee baseline run: ${requestedRunId}`);
const run = requestedRunId === "big_manistee_fall_steelhead"
  ? BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE
  : requestedRunId === "big_manistee_fall_coho"
  ? BIG_MANISTEE_FALL_COHO_RUN_PROFILE
  : BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE;
const conditionsRules = run.conditionsSuggest;
if (
  conditionsRules.gaugeWeight == null ||
  conditionsRules.waterTemperatureWeight == null
) throw new Error("Big Manistee Timing weights are missing.");
const gauge = getPrimaryHydraulicSource(river);
const temperatureSource = river.waterTemperatureSources.find((source) =>
  source.sourceId === run.conditionsSuggest.temperatureSourceId
);
if (!temperatureSource) {
  throw new Error("Big Manistee temperature source is missing.");
}

const startYear = 2007;
const endYear = 2025;
const gaugeObservations = await fetchUsgsDailyFlowBaselineObservations({
  fetchFn: fetch,
  riverId: river.riverId,
  siteId: gauge.siteId,
  startDate: `${startYear}-01-01`,
  endDate: `${endYear}-12-31`,
});
const temperatureObservations = await fetchDailyTemperature({
  siteId: temperatureSource.siteId,
  sourceId: temperatureSource.sourceId,
  startDate: `${startYear}-01-01`,
  endDate: `${endYear}-12-31`,
});
const checkpoints = resolveConditionsSuggestCheckpoints(
  run,
  `2026-${run.runWindow.peak}`,
).map((checkpoint) => ({
  checkpointId: checkpoint.checkpointId,
  observationStartMonthDay: checkpoint.observationStartDate.slice(5),
  checkpointMonthDay: checkpoint.checkpointDate.slice(5),
}));
const sourceNotes =
  `Big Manistee ${run.displayName} cumulative Migration Timing checkpoints: USGS ${gauge.siteId} daily mean discharge and measured water temperature, ${startYear}-${endYear}; staging start through each completed checkpoint; ${
    Math.round(conditionsRules.gaugeWeight * 100)
  }% regulated-tailwater response and ${
    Math.round(conditionsRules.waterTemperatureWeight * 100)
  }% measured-water pattern. No upstream gauge or air-temperature substitute is used.`;
const rows = generateConditionsSuggestBaselineRows({
  gaugeObservations,
  temperatureObservations,
  riverId: river.riverId,
  runId: run.runId,
  gaugeMetric: gauge.primaryMetric,
  gaugeSiteId: gauge.siteId,
  temperatureSourceId: temperatureSource.sourceId,
  baselineVersion: run.conditionsSuggest.baselineVersion,
  checkpoints,
  minimumCoveragePercent: run.conditionsSuggest.minimumCoveragePercent,
  minimumUsableYears: run.conditionsSuggest.minimumUsableYears,
  coolEnoughPercentileCap: run.conditionsSuggest.coolEnoughPercentileCap,
  tooWarmF: run.push.temperature.tooWarmF,
  gaugeWeight: run.conditionsSuggest.gaugeWeight,
  waterTemperatureWeight: run.conditionsSuggest.waterTemperatureWeight,
  sourceNotes,
});
const report = {
  riverId: river.riverId,
  runId: run.runId,
  baselineVersion: run.conditionsSuggest.baselineVersion,
  gaugeObservationCount: gaugeObservations.length,
  temperatureObservationCount: temperatureObservations.length,
  generatedRows: rows.length,
  requiredRows: checkpoints.length,
  distinctYearsByCheckpoint: Object.fromEntries(
    rows.map((row) => [row.checkpointId, row.distinctYears]),
  ),
  historicalReplay: summarizeConditionsSuggestHistoricalReplay({ rows, run }),
};

const outputPath = argumentValue("--out-sql");
if (outputPath) {
  await Deno.writeTextFile(
    outputPath,
    `${conditionsSuggestBaselineRowsToUpsertSql(rows)}\n`,
  );
}
console.log(JSON.stringify(report, null, 2));
if (rows.length !== checkpoints.length) Deno.exit(1);

async function fetchDailyTemperature(input: {
  siteId: string;
  sourceId: string;
  startDate: string;
  endDate: string;
}): Promise<NormalizedTemperatureBaselineObservation[]> {
  const params = new URLSearchParams({
    f: "json",
    monitoring_location_id: input.siteId.startsWith("USGS-")
      ? input.siteId
      : `USGS-${input.siteId}`,
    parameter_code: "00010",
    statistic_id: "00003",
    datetime: `${input.startDate}/${input.endDate}`,
    limit: "10000",
  });
  const response = await fetch(
    `https://api.waterdata.usgs.gov/ogcapi/v0/collections/daily/items?${params}`,
  );
  if (!response.ok) return [];
  const payload = await response.json() as { features?: unknown[] };
  return (payload.features ?? []).flatMap((feature) => {
    const properties = (feature as { properties?: Record<string, unknown> })
      .properties;
    if (
      !properties || properties.parameter_code !== "00010" ||
      properties.statistic_id !== "00003"
    ) return [];
    const localDate = String(properties.time ?? "").slice(0, 10);
    const value = Number(properties.value);
    const unit = String(properties.unit_of_measure ?? "").toLowerCase();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate) || !Number.isFinite(value)) {
      return [];
    }
    const waterTempF = unit === "degc" || unit.includes("celsius")
      ? value * 9 / 5 + 32
      : unit === "degf" || unit.includes("fahrenheit")
      ? value
      : null;
    return waterTempF == null
      ? []
      : [{ sourceId: input.sourceId, localDate, waterTempF }];
  });
}

function argumentValue(flag: string): string | null {
  const inline = Deno.args.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) return inline.slice(flag.length + 1) || null;
  const index = Deno.args.indexOf(flag);
  return index >= 0 ? Deno.args[index + 1] ?? null : null;
}
