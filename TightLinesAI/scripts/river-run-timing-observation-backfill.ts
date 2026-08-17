import {
  fetchMonitorMyWatershedTemperature,
  fetchUsgsDailyFlowBaselineObservations,
  fetchUsgsDailyWaterTemperatureObservations,
  getPrimaryHydraulicSource,
  type ObservedConditionRunProfile,
  parseMonitorMyWatershedTemperature,
  resolveConditionsSuggestCheckpoints,
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

const apply = Deno.args.includes("--apply");
const throughDate = argumentValue("--through") ?? yesterdayUtc();
const baseUrl = required("SUPABASE_URL").replace(/\/+$/, "");
const serviceKey = required("SUPABASE_SERVICE_ROLE_KEY");
const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
const rows: Record<string, unknown>[] = [];
const reports: Record<string, unknown>[] = [];

for (const run of RIVER_RUN_RUN_PROFILES) {
  if (
    run.primitiveCapabilities.migrationTiming.status !== "available" ||
    !run.conditionsSuggest
  ) continue;
  const observedRun = run as ObservedConditionRunProfile;
  const river = RIVER_RUN_RIVER_PROFILES.find((candidate) =>
    candidate.riverId === run.riverId
  );
  if (!river) throw new Error(`Missing river ${run.riverId}`);
  const checkpoints = resolveConditionsSuggestCheckpoints(
    observedRun,
    throughDate,
  );
  const startDate = checkpoints[0]?.observationStartDate;
  const finalCutoff = checkpoints.at(-1)?.cutoffDate;
  if (!startDate || !finalCutoff || startDate > throughDate) continue;
  const endDate = finalCutoff < throughDate ? finalCutoff : throughDate;
  const gauge = getPrimaryHydraulicSource(river);
  const temperatureSource = river.waterTemperatureSources.find((source) =>
    source.sourceId === run.conditionsSuggest!.temperatureSourceId
  );
  if (!temperatureSource) {
    throw new Error(`Missing Timing temperature source for ${run.runId}`);
  }
  const [flows, temperatures, existingDates] = await Promise.all([
    fetchUsgsDailyFlowBaselineObservations({
      fetchFn: fetch,
      riverId: river.riverId,
      siteId: gauge.siteId,
      startDate,
      endDate,
    }),
    dailyTemperatures({
      source: temperatureSource,
      timezone: river.timezone,
      startDate,
      endDate,
    }),
    readExistingDates({
      riverId: river.riverId,
      runId: run.runId,
      startDate,
      endDate,
      gaugeSiteId: gauge.siteId,
      temperatureSourceId: temperatureSource.sourceId,
    }),
  ]);
  const flowByDate = new Map(flows.map((item) => [item.localDate, item.value]));
  const temperatureByDate = new Map(
    temperatures.map((item) => [item.localDate, item.waterTempF]),
  );
  const missingDates = datesBetween(startDate, endDate).filter((date) =>
    !existingDates.has(date)
  );
  const recoverableDates = missingDates.filter((date) =>
    flowByDate.has(date) && temperatureByDate.has(date)
  );
  const unavailableDates = missingDates.filter((date) =>
    !flowByDate.has(date) || !temperatureByDate.has(date)
  );
  for (const localDate of recoverableDates) {
    rows.push({
      river_id: river.riverId,
      run_id: run.runId,
      local_date: localDate,
      refresh_slot: "12:00",
      observation_at: `${localDate}T12:00:00.000Z`,
      gauge_metric: gauge.primaryMetric,
      gauge_site_id: gauge.siteId,
      gauge_value: flowByDate.get(localDate),
      gauge_freshness: "fresh",
      temperature_source_id: temperatureSource.sourceId,
      water_temp_f: temperatureByDate.get(localDate),
      temperature_freshness: "fresh",
      reason_codes: [],
      provenance: {
        kind: "historical_daily_backfill",
        gaugeProvider: gauge.provider,
        gaugeStatistic: "daily_mean",
        temperatureProvider: temperatureSource.provider,
        temperatureStatistic: temperatureSource.provider === "USGS"
          ? "daily_mean"
          : "daily_median",
        generatedAt: new Date().toISOString(),
      },
    });
  }
  reports.push({
    riverId: river.riverId,
    runId: run.runId,
    startDate,
    endDate,
    existingDayCount: existingDates.size,
    missingDates,
    recoverableDates,
    unavailableDates,
  });
}

if (apply && rows.length > 0) await upsertRows(rows);
console.log(
  JSON.stringify(
    { apply, throughDate, rowCount: rows.length, reports },
    null,
    2,
  ),
);

async function dailyTemperatures(input: {
  source: NonNullable<
    (typeof RIVER_RUN_RIVER_PROFILES)[number]["waterTemperatureSources"]
  >[number];
  timezone: string;
  startDate: string;
  endDate: string;
}) {
  if (input.source.provider === "USGS") {
    return await fetchUsgsDailyWaterTemperatureObservations({
      fetchFn: fetch,
      sourceId: input.source.sourceId,
      siteId: input.source.siteId,
      startDate: input.startDate,
      endDate: input.endDate,
    });
  }
  const csv = await fetchMonitorMyWatershedTemperature({
    fetchFn: fetch,
    source: input.source,
    endAtUtc: `${input.endDate}T23:59:59.000Z`,
    lookbackDays: datesBetween(input.startDate, input.endDate).length + 2,
  });
  if (!csv) return [];
  const grouped = new Map<string, number[]>();
  for (
    const observation of parseMonitorMyWatershedTemperature({
      csv,
      source: input.source,
    }).observations
  ) {
    const localDate = localDateInTimezone(
      observation.observedAt,
      input.timezone,
    );
    if (localDate < input.startDate || localDate > input.endDate) continue;
    const values = grouped.get(localDate) ?? [];
    values.push(observation.waterTempF);
    grouped.set(localDate, values);
  }
  return [...grouped.entries()].map(([localDate, values]) => ({
    sourceId: input.source.sourceId,
    localDate,
    waterTempF: median(values),
  }));
}

async function readExistingDates(input: {
  riverId: string;
  runId: string;
  startDate: string;
  endDate: string;
  gaugeSiteId: string;
  temperatureSourceId: string;
}): Promise<Set<string>> {
  const canonical = await restRead("river_run_timing_observations", {
    river_id: `eq.${input.riverId}`,
    run_id: `eq.${input.runId}`,
    local_date: `gte.${input.startDate}`,
    and: `(local_date.lte.${input.endDate})`,
    gauge_site_id: `eq.${input.gaugeSiteId}`,
    temperature_source_id: `eq.${input.temperatureSourceId}`,
    select:
      "local_date,gauge_value,water_temp_f,gauge_freshness,temperature_freshness",
    limit: "1000",
  }, true);
  if (canonical) {
    return new Set(
      canonical.filter((row) =>
        row.gauge_freshness === "fresh" &&
        row.temperature_freshness === "fresh" &&
        finitePositive(row.gauge_value) && finite(row.water_temp_f)
      ).map((row) => String(row.local_date)),
    );
  }
  const legacy = await restRead("river_run_condition_refreshes", {
    river_id: `eq.${input.riverId}`,
    run_id: `eq.${input.runId}`,
    local_date: `gte.${input.startDate}`,
    and: `(local_date.lte.${input.endDate})`,
    select: "local_date,freshness,source_metrics",
    limit: "1000",
  });
  return new Set(
    (legacy ?? []).filter((row) => {
      const freshness = object(row.freshness);
      const source = object(row.source_metrics);
      const gauge = object(source.gauge);
      const temperature = object(source.conditionsWaterTemperature);
      return freshness.gauge === "fresh" &&
        freshness.conditionsWaterTemperature === "fresh" &&
        gauge.siteId === input.gaugeSiteId &&
        temperature.sourceId === input.temperatureSourceId &&
        finitePositive(gauge.value) && finite(temperature.waterTempF);
    }).map((row) => String(row.local_date)),
  );
}

async function restRead(
  table: string,
  params: Record<string, string>,
  allowMissing = false,
): Promise<Record<string, unknown>[] | null> {
  const url = new URL(`${baseUrl}/rest/v1/${table}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const response = await fetch(url, { headers });
  if (allowMissing && response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`${table}: ${response.status} ${await response.text()}`);
  }
  return await response.json();
}

async function upsertRows(payload: Record<string, unknown>[]) {
  const url = new URL(`${baseUrl}/rest/v1/river_run_timing_observations`);
  url.searchParams.set(
    "on_conflict",
    "river_id,run_id,local_date,refresh_slot,gauge_site_id,temperature_source_id",
  );
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`backfill: ${response.status} ${await response.text()}`);
  }
}

function datesBetween(startDate: string, endDate: string): string[] {
  const dates = [];
  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    dates.push(date);
  }
  return dates;
}
function addDays(localDate: string, amount: number): string {
  const date = new Date(`${localDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}
function yesterdayUtc(): string {
  return addDays(new Date().toISOString().slice(0, 10), -1);
}
function localDateInTimezone(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}
function median(values: number[]): number {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}
function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
function finitePositive(value: unknown): value is number {
  return finite(value) && value > 0;
}
function required(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}
function argumentValue(flag: string): string | null {
  const inline = Deno.args.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) return inline.slice(flag.length + 1) || null;
  const index = Deno.args.indexOf(flag);
  return index >= 0 ? Deno.args[index + 1] ?? null : null;
}
