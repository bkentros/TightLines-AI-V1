import {
  conditionsSuggestBaselineRowsToUpsertSql,
  generateConditionsSuggestBaselineRows,
  type NormalizedBaselineObservation,
  type NormalizedTemperatureBaselineObservation,
  resolveConditionsSuggestCheckpoints,
  ST_JOSEPH_FALL_CHINOOK_RUN_PROFILE,
  ST_JOSEPH_FALL_COHO_RUN_PROFILE,
  ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE as run,
  ST_JOSEPH_RIVER_PROFILE as river,
  summarizeConditionsSuggestHistoricalReplay,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

const START_YEAR = 2012;
const END_YEAR = 2025;
const selectedRun = {
  st_joseph_fall_chinook: ST_JOSEPH_FALL_CHINOOK_RUN_PROFILE,
  st_joseph_fall_coho: ST_JOSEPH_FALL_COHO_RUN_PROFILE,
  st_joseph_fall_steelhead: run,
}[argumentValue("--run-id") ?? "st_joseph_fall_steelhead"] ?? run;
const inputPath = argumentValue("--input-json");
const payload = inputPath
  ? JSON.parse(await Deno.readTextFile(inputPath))
  : await fetchUsgsDailyPayload();
const { gaugeObservations, temperatureObservations } = parseWaterServicesDaily(
  payload,
);
const checkpoints = resolveConditionsSuggestCheckpoints(
  selectedRun,
  `2026-${selectedRun.runWindow.peak}`,
).map((checkpoint) => ({
  checkpointId: checkpoint.checkpointId,
  observationStartMonthDay: checkpoint.observationStartDate.slice(5),
  checkpointMonthDay: checkpoint.checkpointDate.slice(5),
}));
const rows = generateConditionsSuggestBaselineRows({
  gaugeObservations,
  temperatureObservations,
  riverId: river.riverId,
  runId: selectedRun.runId,
  gaugeMetric: "flow_cfs",
  gaugeSiteId: "04101500",
  temperatureSourceId: "st_joseph_niles_temperature",
  baselineVersion: selectedRun.conditionsSuggest.baselineVersion,
  checkpoints,
  minimumCoveragePercent: selectedRun.conditionsSuggest.minimumCoveragePercent,
  minimumUsableYears: selectedRun.conditionsSuggest.minimumUsableYears,
  coolEnoughPercentileCap:
    selectedRun.conditionsSuggest.coolEnoughPercentileCap,
  tooWarmF: selectedRun.push.temperature.tooWarmF,
  gaugeWeight: selectedRun.conditionsSuggest.gaugeWeight!,
  waterTemperatureWeight: selectedRun.conditionsSuggest.waterTemperatureWeight!,
  sourceNotes: selectedRun.runId === "st_joseph_fall_chinook"
    ? "St. Joseph Fall Chinook cumulative Migration Timing checkpoints: USGS 04101500 daily mean discharge and same-station measured water temperature, fixed 2012-2025 archive; staging start through each completed checkpoint; 55% Niles hydraulic pattern and 45% measured-water cooling pattern. Missing temperature days are not imputed, Mottville is excluded, and the result describes timing at the Niles reach rather than ladder passage or river-wide abundance."
    : selectedRun.runId === "st_joseph_fall_coho"
    ? "St. Joseph Fall Coho cumulative Migration Timing checkpoints: USGS 04101500 daily mean discharge and same-station measured water temperature, fixed 2012-2025 archive; staging start through each completed checkpoint; 55% Niles hydraulic pattern and 45% measured-water cooling pattern. Missing temperature days are not imputed, Mottville is excluded, and the result describes timing at the Niles reach rather than ladder passage or river-wide abundance."
    : "St. Joseph Fall Steelhead cumulative Migration Timing checkpoints: USGS 04101500 daily mean discharge and same-station measured water temperature, fixed 2012-2025 archive; staging start through each completed checkpoint; 40% Niles hydraulic pattern and 60% measured-water cooling pattern. Missing temperature days are not imputed, Mottville is excluded, and the result describes timing at the Niles reach rather than ladder passage or river-wide abundance.",
});

const calibrationGaugeObservations = gaugeObservations.filter((item) =>
  item.localDate.slice(5) >= "08-15" && item.localDate.slice(5) <= "12-24"
);
const flowValues = calibrationGaugeObservations.map((item) => item.value ?? 0);
const positiveChanges = consecutivePositiveChanges(
  calibrationGaugeObservations,
);
const report = {
  riverId: river.riverId,
  runId: selectedRun.runId,
  auditWindow: `${START_YEAR}-${END_YEAR}`,
  gaugeObservationCount: gaugeObservations.length,
  temperatureObservationCount: temperatureObservations.length,
  flowPercentilesCfs: percentiles(flowValues),
  positiveDailyChangePercentiles: {
    absoluteCfs: percentiles(positiveChanges.map((item) => item.absolute)),
    percent: percentiles(positiveChanges.map((item) => item.percent)),
  },
  generatedRows: rows.length,
  requiredRows: checkpoints.length,
  distinctYearsByCheckpoint: Object.fromEntries(
    rows.map((row) => [row.checkpointId, row.distinctYears]),
  ),
  historicalReplay: summarizeConditionsSuggestHistoricalReplay({
    rows,
    run: selectedRun,
  }),
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

async function fetchUsgsDailyPayload(): Promise<unknown> {
  const url = new URL("https://waterservices.usgs.gov/nwis/dv/");
  url.search = new URLSearchParams({
    format: "json",
    sites: "04101500",
    startDT: `${START_YEAR}-01-01`,
    endDT: `${END_YEAR}-12-31`,
    parameterCd: "00060,00010",
    siteStatus: "all",
  }).toString();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`USGS daily request failed: ${response.status}`);
  }
  return await response.json();
}

function parseWaterServicesDaily(payload: unknown): {
  gaugeObservations: NormalizedBaselineObservation[];
  temperatureObservations: NormalizedTemperatureBaselineObservation[];
} {
  const series = (payload as {
    value?: { timeSeries?: Array<Record<string, unknown>> };
  })?.value?.timeSeries ?? [];
  const gaugeObservations: NormalizedBaselineObservation[] = [];
  const temperatureObservations: NormalizedTemperatureBaselineObservation[] =
    [];
  for (const item of series) {
    const variable = item.variable as {
      variableCode?: Array<{ value?: string }>;
    } | undefined;
    const code = variable?.variableCode?.[0]?.value;
    const values = (item.values as
      | Array<{
        value?: Array<{ value?: string; dateTime?: string }>;
      }>
      | undefined)?.[0]?.value ?? [];
    for (const observation of values) {
      const localDate = observation.dateTime?.slice(0, 10) ?? "";
      const value = Number(observation.value);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate) || !Number.isFinite(value)) {
        continue;
      }
      const year = Number(localDate.slice(0, 4));
      if (year < START_YEAR || year > END_YEAR) continue;
      if (code === "00060") {
        gaugeObservations.push({
          riverId: river.riverId,
          metric: "flow_cfs",
          localDate,
          value,
        });
      } else if (code === "00010") {
        temperatureObservations.push({
          sourceId: "st_joseph_niles_temperature",
          localDate,
          waterTempF: value * 9 / 5 + 32,
        });
      }
    }
  }
  return { gaugeObservations, temperatureObservations };
}

function consecutivePositiveChanges(
  observations: NormalizedBaselineObservation[],
) {
  const sorted = [...observations].sort((a, b) =>
    a.localDate.localeCompare(b.localDate)
  );
  return sorted.flatMap((current, index) => {
    const previous = sorted[index - 1];
    if (!previous) return [];
    const gapDays = (Date.parse(`${current.localDate}T00:00:00Z`) -
      Date.parse(`${previous.localDate}T00:00:00Z`)) / 86_400_000;
    const currentValue = current.value ?? 0;
    const previousValue = previous.value ?? 0;
    const absolute = currentValue - previousValue;
    return gapDays === 1 && absolute > 0 && previousValue > 0
      ? [{ absolute, percent: absolute / previousValue * 100 }]
      : [];
  });
}

function percentiles(values: number[]) {
  return Object.fromEntries(
    [1, 5, 10, 25, 50, 75, 90, 95, 99].map((percentile) => [
      `p${percentile}`,
      Math.round(quantile(values, percentile / 100) * 10) / 10,
    ]),
  );
}

function quantile(values: number[], fraction: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return Number.NaN;
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

function argumentValue(flag: string): string | null {
  const inline = Deno.args.find((arg) => arg.startsWith(`${flag}=`));
  return inline?.slice(flag.length + 1) || null;
}
