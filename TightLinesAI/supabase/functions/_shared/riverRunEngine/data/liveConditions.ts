import type {
  GaugeFreshness,
  HydraulicSourceConfig,
  RiverLiveConditionMetric,
  RiverLiveConditions,
  RiverLiveMetricFreshness,
  RiverLiveMetricId,
  RiverLiveSeasonalContext,
  RiverMetric,
  RiverProfile,
  WaterTemperatureSourceConfig,
} from "../types.ts";
import {
  getLiveConditions,
  getSeasonalContext,
  type SupabaseLikeClient,
  upsertLiveConditions,
  upsertSeasonalContext,
} from "../storage/index.ts";
import {
  buildMeasuredTemperatureSeasonalContext,
  fetchUsgsSeasonalContext,
  MMW_SEASONAL_BASELINE_VERSION,
  USGS_SEASONAL_BASELINE_VERSION,
  withSeasonalComparison,
} from "./seasonalContext.ts";
import {
  computeGaugeFreshness,
  fetchUsgsInstantaneousValues,
  metricValue,
  type NormalizedGaugeObservation,
  parseUsgsInstantaneousValues,
  type RiverRunFetch,
  selectClosestObservationAtOrBefore,
  selectLatestUsableGaugeObservation,
} from "./usgs.ts";
import {
  fetchMonitorMyWatershedTemperature,
  fetchUsgsWaterTemperature,
  type NormalizedWaterTemperatureObservation,
  parseMonitorMyWatershedTemperature,
  parseUsgsWaterTemperature,
  resolveWaterTemperatureRead,
} from "./waterTemperature.ts";

export const RIVER_LIVE_CONDITIONS_VERSION = "river-live-conditions-v4";
const USGS_ATTRIBUTION =
  "U.S. Geological Survey Water Data for the Nation; values may be provisional and subject to revision.";

export async function readOrBuildRiverLiveConditions(input: {
  client: SupabaseLikeClient;
  river: RiverProfile;
  localDate: string;
  refreshSlot: string;
  refreshAtUtc: string;
  fetchFn: RiverRunFetch;
  gaugeObservations?: NormalizedGaugeObservation[];
  waterTemperatureObservationsBySource?: Record<
    string,
    NormalizedWaterTemperatureObservation[]
  >;
  seasonalContextsByMetric?: Partial<
    Record<RiverLiveMetricId, RiverLiveSeasonalContext | null>
  >;
}): Promise<RiverLiveConditions> {
  const cached = await getLiveConditions(input.client, {
    riverId: input.river.riverId,
    localDate: input.localDate,
    refreshSlot: input.refreshSlot,
    dataVersion: RIVER_LIVE_CONDITIONS_VERSION,
  });
  if (!cached.error && cached.data) return cached.data;
  if (cached.error) {
    console.error("[river-run] live conditions cache read failed", {
      riverId: input.river.riverId,
      message: cached.error.message,
    });
  }

  const built = await buildRiverLiveConditions(input);
  const stored = await upsertLiveConditions(input.client, built);
  if (stored.error) {
    console.error("[river-run] live conditions cache write failed", {
      riverId: input.river.riverId,
      message: stored.error.message,
    });
  }
  return stored.data ?? built;
}

export async function buildRiverLiveConditions(input: {
  client: SupabaseLikeClient;
  river: RiverProfile;
  localDate: string;
  refreshSlot: string;
  refreshAtUtc: string;
  fetchFn: RiverRunFetch;
  gaugeObservations?: NormalizedGaugeObservation[];
  waterTemperatureObservationsBySource?: Record<
    string,
    NormalizedWaterTemperatureObservation[]
  >;
  seasonalContextsByMetric?: Partial<
    Record<RiverLiveMetricId, RiverLiveSeasonalContext | null>
  >;
}): Promise<RiverLiveConditions> {
  const primaryHydraulic = input.river.hydraulicSources.find((source) =>
    source.role === "primary"
  );
  const temperatureSources = [...input.river.waterTemperatureSources]
    .sort((left, right) => left.priority - right.priority);
  const [gaugeObservations, temperaturePayload] = await Promise.all([
    primaryHydraulic
      ? input.gaugeObservations ?? fetchGaugeObservations(
        input.fetchFn,
        primaryHydraulic,
        input.refreshAtUtc,
      )
      : Promise.resolve([]),
    input.waterTemperatureObservationsBySource
      ? Promise.resolve({
        observations: input.waterTemperatureObservationsBySource,
        rejected: {},
      })
      : fetchTemperatureObservations(
        input.fetchFn,
        temperatureSources,
        input.refreshAtUtc,
      ),
  ]);

  const metrics: RiverLiveConditionMetric[] = [];
  if (primaryHydraulic) {
    for (const metric of primaryHydraulic.availableMetrics) {
      const seasonal = metric === "flow_cfs"
        ? await resolveSeasonalContext({
          ...input,
          sourceId: primaryHydraulic.sourceId,
          siteId: primaryHydraulic.siteId,
          metric,
          provider: "USGS",
        })
        : null;
      metrics.push(buildHydraulicMetric({
        source: primaryHydraulic,
        metric,
        observations: gaugeObservations,
        refreshAtUtc: input.refreshAtUtc,
        seasonalContext: seasonal,
      }));
    }
  }

  if (temperatureSources.length) {
    const read = resolveWaterTemperatureRead({
      sources: temperatureSources,
      sourcePriority: temperatureSources.map((source) => source.sourceId),
      observationsBySource: temperaturePayload.observations,
      rejectedBySource: temperaturePayload.rejected,
      refreshAtUtc: input.refreshAtUtc,
    });
    const selectedSource = temperatureSources.find((source) =>
      source.sourceId === read.sourceId
    ) ?? temperatureSources[0];
    const seasonal = await resolveSeasonalContext({
      ...input,
      sourceId: selectedSource.sourceId,
      siteId: selectedSource.siteId,
      metric: "water_temp_f",
      provider: selectedSource.provider,
      temperatureSource: selectedSource,
    });
    metrics.push(buildTemperatureMetric({
      source: selectedSource,
      observations: temperaturePayload.observations[selectedSource.sourceId] ??
        [],
      currentValue: read.smoothedWaterTempF,
      currentObservation: read.current,
      freshness: read.freshness,
      seasonalContext: seasonal,
    }));
  } else if (input.river.historicalWaterTemperatureSource) {
    metrics.push(buildHistoricalTemperatureMetric({
      source: input.river.historicalWaterTemperatureSource,
      localDate: input.localDate,
    }));
  }

  const availableCount =
    metrics.filter((metric) => metric.value != null).length;
  return {
    riverId: input.river.riverId,
    status: availableCount === 0
      ? "unavailable"
      : availableCount === metrics.length
      ? "available"
      : "partial",
    refreshedAt: input.refreshAtUtc,
    localDate: input.localDate,
    refreshSlot: input.refreshSlot,
    metrics,
    limitation: input.river.gaugeLimitationCopy,
    dataVersion: RIVER_LIVE_CONDITIONS_VERSION,
  };
}

function buildHistoricalTemperatureMetric(input: {
  source: NonNullable<RiverProfile["historicalWaterTemperatureSource"]>;
  localDate: string;
}): RiverLiveConditionMetric {
  const normal = input.source.normals[input.localDate.slice(5)];
  return {
    metric: "water_temp_f",
    label: "Historical Water Temperature",
    value: null,
    unit: "°F",
    freshness: "missing",
    sourceId: input.source.sourceId,
    provider: input.source.provider,
    stationName: input.source.name,
    siteId: input.source.siteId,
    representedReach: input.source.reachNotes,
    attribution: input.source.attribution,
    trend24h: {
      direction: "unknown",
      delta: null,
      percentDelta: null,
    },
    seasonalContext: normal
      ? {
        average: normal.averageF,
        p10: normal.p10F,
        p25: normal.p25F,
        median: normal.medianF,
        p75: normal.p75F,
        p90: normal.p90F,
        historicalYears: normal.historicalYears,
        sampleCount: normal.sampleCount,
        availableWindowDays: 1,
        windowRadiusDays: 0,
        windowStartMonthDay: input.localDate.slice(5),
        windowEndMonthDay: input.localDate.slice(5),
        recordKind: "recent",
        baselineVersion: input.source.baselineVersion,
        source: "usgs_approved_exact_date_archive",
      }
      : undefined,
  };
}

function buildHydraulicMetric(input: {
  source: HydraulicSourceConfig;
  metric: RiverMetric;
  observations: NormalizedGaugeObservation[];
  refreshAtUtc: string;
  seasonalContext: RiverLiveSeasonalContext | null;
}): RiverLiveConditionMetric {
  const current = selectLatestUsableGaugeObservation(
    input.observations,
    input.metric,
  );
  const rawFreshness = computeGaugeFreshness({
    observation: current,
    refreshAtUtc: input.refreshAtUtc,
    maxAgeHours: input.source.maxAgeHours,
  });
  const currentValue = current ? metricValue(current, input.metric) : null;
  const target = current
    ? new Date(Date.parse(current.observedAt) - 24 * 60 * 60 * 1000)
      .toISOString()
    : null;
  const candidatePrior = target
    ? selectClosestObservationAtOrBefore(
      input.observations,
      input.metric,
      target,
    )
    : null;
  const prior = candidatePrior && target &&
      Math.abs(Date.parse(candidatePrior.observedAt) - Date.parse(target)) <=
        3 * 60 * 60 * 1000
    ? candidatePrior
    : null;
  const priorValue = prior ? metricValue(prior, input.metric) : null;
  const delta = currentValue != null && priorValue != null
    ? roundTo(currentValue - priorValue, input.metric === "flow_cfs" ? 1 : 3)
    : null;
  const percentDelta = input.metric === "flow_cfs" && delta != null &&
      priorValue != null && priorValue > 0
    ? roundTo(delta / priorValue * 100, 1)
    : null;
  const threshold = input.metric === "flow_cfs"
    ? Math.max(10, Math.abs(currentValue ?? 0) * .01)
    : .02;
  const direction = delta == null
    ? "unknown" as const
    : Math.abs(delta) < threshold
    ? "stable" as const
    : delta > 0
    ? "rising" as const
    : "falling" as const;
  const freshness = publicFreshness(rawFreshness);
  const displayValue = freshness === "older_than_24h" || freshness === "missing"
    ? null
    : currentValue;
  return {
    metric: input.metric,
    label: input.metric === "flow_cfs" ? "Discharge" : "Gauge Height",
    value: displayValue,
    unit: input.metric === "flow_cfs" ? "CFS" : "ft",
    observedAt: current?.observedAt,
    freshness,
    approvalStatus: current?.approvalStatus,
    qualifier: current?.qualifier,
    sourceId: input.source.sourceId,
    provider: "USGS",
    stationName: input.source.name,
    siteId: input.source.siteId,
    representedReach: input.source.reachNotes,
    attribution: USGS_ATTRIBUTION,
    trend24h: {
      direction,
      delta,
      percentDelta,
      comparisonObservedAt: prior?.observedAt,
    },
    seasonalContext: displayValue != null && input.seasonalContext
      ? withSeasonalComparison(
        input.seasonalContext,
        input.metric,
        displayValue,
      )
      : undefined,
  };
}

function buildTemperatureMetric(input: {
  source: WaterTemperatureSourceConfig;
  observations: NormalizedWaterTemperatureObservation[];
  currentValue: number | null;
  currentObservation: NormalizedWaterTemperatureObservation | null;
  freshness: GaugeFreshness;
  seasonalContext: RiverLiveSeasonalContext | null;
}): RiverLiveConditionMetric {
  const targetMs = input.currentObservation
    ? Date.parse(input.currentObservation.observedAt) - 24 * 60 * 60 * 1000
    : NaN;
  const priorWindowStart = targetMs -
    input.source.smoothingWindowHours * 60 * 60 * 1000;
  const priorWindow = input.observations.filter((observation) => {
    const observedAt = Date.parse(observation.observedAt);
    return observedAt <= targetMs && observedAt >= priorWindowStart;
  });
  const prior = priorWindow.reduce<
    NormalizedWaterTemperatureObservation | null
  >(
    (latest, observation) =>
      !latest ||
        Date.parse(observation.observedAt) > Date.parse(latest.observedAt)
        ? observation
        : latest,
    null,
  );
  const priorValue = priorWindow.length
    ? median(priorWindow.map((observation) => observation.waterTempF))
    : null;
  const delta = input.currentValue != null && priorValue != null
    ? roundTo(input.currentValue - priorValue, 1)
    : null;
  const freshness = publicFreshness(input.freshness);
  const displayValue = freshness === "older_than_24h" || freshness === "missing"
    ? null
    : input.currentValue;
  return {
    metric: "water_temp_f",
    label: "Water Temperature",
    value: displayValue,
    unit: "°F",
    observedAt: input.currentObservation?.observedAt,
    freshness,
    approvalStatus: input.currentObservation?.approvalStatus,
    qualifier: input.currentObservation?.qualifier,
    sourceId: input.source.sourceId,
    provider: input.source.provider,
    stationName: input.source.name,
    siteId: input.source.siteId,
    representedReach: input.source.reachNotes,
    attribution: input.source.attribution,
    trend24h: {
      direction: delta == null
        ? "unknown"
        : Math.abs(delta) < .5
        ? "stable"
        : delta > 0
        ? "warming"
        : "cooling",
      delta,
      percentDelta: null,
      comparisonObservedAt: prior?.observedAt,
    },
    seasonalContext: displayValue != null && input.seasonalContext
      ? withSeasonalComparison(
        input.seasonalContext,
        "water_temp_f",
        displayValue,
      )
      : undefined,
  };
}

async function resolveSeasonalContext(input: {
  client: SupabaseLikeClient;
  river: RiverProfile;
  localDate: string;
  fetchFn: RiverRunFetch;
  sourceId: string;
  siteId: string;
  metric: RiverLiveMetricId;
  provider: "USGS" | "MONITOR_MY_WATERSHED";
  temperatureSource?: WaterTemperatureSourceConfig;
  seasonalContextsByMetric?: Partial<
    Record<RiverLiveMetricId, RiverLiveSeasonalContext | null>
  >;
}): Promise<RiverLiveSeasonalContext | null> {
  if (input.metric in (input.seasonalContextsByMetric ?? {})) {
    return input.seasonalContextsByMetric?.[input.metric] ?? null;
  }
  if (input.metric === "gage_height_ft") return null;
  const fixedFlowBaseline = input.metric === "flow_cfs"
    ? input.river.fixedFlowSeasonalBaseline
    : undefined;
  const baselineVersion = fixedFlowBaseline?.baselineVersion ??
    (input.provider === "USGS"
      ? USGS_SEASONAL_BASELINE_VERSION
      : MMW_SEASONAL_BASELINE_VERSION);
  const key = {
    river_id: input.river.riverId,
    source_id: input.sourceId,
    site_id: input.siteId,
    metric: input.metric,
    day_of_year: localDayOfYear(input.localDate),
    baseline_version: baselineVersion,
  };
  const cached = await getSeasonalContext(input.client, key);
  if (!cached.error && cached.data) return cached.data;
  if (cached.error) {
    console.error("[river-run] seasonal context cache read failed", {
      riverId: input.river.riverId,
      sourceId: input.sourceId,
      metric: input.metric,
      message: cached.error.message,
    });
  }
  let context: RiverLiveSeasonalContext | null = null;
  try {
    context = fixedFlowBaseline
      ? fixedFlowSeasonalContext(fixedFlowBaseline, input.localDate)
      : input.provider === "USGS"
      ? await fetchUsgsSeasonalContext({
        fetchFn: input.fetchFn,
        siteId: input.siteId,
        metric: input.metric as "flow_cfs" | "water_temp_f",
        localDate: input.localDate,
      })
      : input.temperatureSource
      ? await fetchMonitorSeasonalContext({
        fetchFn: input.fetchFn,
        river: input.river,
        source: input.temperatureSource,
        localDate: input.localDate,
      })
      : null;
  } catch (error) {
    console.error("[river-run] seasonal context provider failed", {
      riverId: input.river.riverId,
      sourceId: input.sourceId,
      metric: input.metric,
      message: error instanceof Error ? error.message : String(error),
    });
  }
  if (!context) return null;
  const stored = await upsertSeasonalContext(input.client, { ...key, context });
  if (stored.error) {
    console.error("[river-run] seasonal context cache write failed", {
      riverId: input.river.riverId,
      sourceId: input.sourceId,
      metric: input.metric,
      message: stored.error.message,
    });
  }
  return stored.data ?? context;
}

function fixedFlowSeasonalContext(
  baseline: NonNullable<RiverProfile["fixedFlowSeasonalBaseline"]>,
  localDate: string,
): RiverLiveSeasonalContext | null {
  const normal = baseline.normals[localDate.slice(5)];
  return normal
    ? {
      ...normal,
      windowRadiusDays: 3,
      recordKind: "recent",
      baselineVersion: baseline.baselineVersion,
      source: "usgs_approved_fixed_period_archive",
    }
    : null;
}

async function fetchMonitorSeasonalContext(input: {
  fetchFn: RiverRunFetch;
  river: RiverProfile;
  source: WaterTemperatureSourceConfig;
  localDate: string;
}): Promise<RiverLiveSeasonalContext | null> {
  const startYear = input.source.historicalStartYear;
  const endYear = input.source.historicalEndYear;
  if (!startYear || !endYear || endYear < startYear) return null;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index,
  );
  const valuesByYear = await Promise.all(years.map(async (year) => {
    const dailyValues: Array<{ localDate: string; value: number }> = [];
    const center = historicalCenterDate(input.localDate, year);
    if (!center) return dailyValues;
    const end = new Date(`${center}T23:59:59Z`);
    end.setUTCDate(end.getUTCDate() + 3);
    const csv = await fetchMonitorMyWatershedTemperature({
      fetchFn: input.fetchFn,
      source: input.source,
      endAtUtc: end.toISOString(),
      lookbackDays: 7,
    });
    if (!csv) return dailyValues;
    const parsed = parseMonitorMyWatershedTemperature({
      csv,
      source: input.source,
    });
    const byDate = new Map<string, number[]>();
    for (const observation of parsed.observations) {
      const localDate = localDateInTimezone(
        observation.observedAt,
        input.river.timezone,
      );
      byDate.set(localDate, [
        ...(byDate.get(localDate) ?? []),
        observation.waterTempF,
      ]);
    }
    for (const [localDate, values] of byDate) {
      dailyValues.push({ localDate, value: median(values) });
    }
    return dailyValues;
  }));
  return buildMeasuredTemperatureSeasonalContext({
    dailyValues: valuesByYear.flat(),
    localDate: input.localDate,
  });
}

async function fetchGaugeObservations(
  fetchFn: RiverRunFetch,
  source: HydraulicSourceConfig,
  refreshAtUtc: string,
): Promise<NormalizedGaugeObservation[]> {
  try {
    const payload = await fetchUsgsInstantaneousValues({
      fetchFn,
      siteId: source.siteId,
      metrics: source.availableMetrics,
      // Retain the last readable observation during a multi-day provider fault
      // so the UI can show when the station last produced usable data.
      period: "P7D",
      endAtUtc: refreshAtUtc,
    });
    return parseUsgsInstantaneousValues(payload ?? {}, source.siteId);
  } catch {
    return [];
  }
}

async function fetchTemperatureObservations(
  fetchFn: RiverRunFetch,
  sources: WaterTemperatureSourceConfig[],
  refreshAtUtc: string,
): Promise<{
  observations: Record<string, NormalizedWaterTemperatureObservation[]>;
  rejected: Record<string, number>;
}> {
  const entries = await Promise.all(sources.map(async (source) => {
    try {
      const parsed = source.provider === "USGS"
        ? parseUsgsWaterTemperature({
          payload: await fetchUsgsWaterTemperature({
            fetchFn,
            source,
            endAtUtc: refreshAtUtc,
          }) ?? {},
          source,
        })
        : parseMonitorMyWatershedTemperature({
          csv: await fetchMonitorMyWatershedTemperature({
            fetchFn,
            source,
            endAtUtc: refreshAtUtc,
          }) ?? "",
          source,
        });
      return [source.sourceId, parsed] as const;
    } catch {
      return [source.sourceId, {
        observations: [] as NormalizedWaterTemperatureObservation[],
        rejectedObservationCount: 1,
      }] as const;
    }
  }));
  return {
    observations: Object.fromEntries(
      entries.map(([sourceId, parsed]) => [sourceId, parsed.observations]),
    ),
    rejected: Object.fromEntries(
      entries.map(([sourceId, parsed]) => [
        sourceId,
        parsed.rejectedObservationCount,
      ]),
    ),
  };
}

function publicFreshness(value: GaugeFreshness): RiverLiveMetricFreshness {
  return value === "stale" ? "delayed" : value;
}

function localDayOfYear(localDate: string): number {
  const current = Date.parse(`${localDate}T12:00:00Z`);
  const start = Date.parse(`${localDate.slice(0, 4)}-01-01T12:00:00Z`);
  return Math.floor((current - start) / (24 * 60 * 60 * 1000)) + 1;
}

function historicalCenterDate(localDate: string, year: number): string | null {
  const candidate = `${year}-${localDate.slice(5)}`;
  const parsed = new Date(`${candidate}T12:00:00Z`);
  return parsed.toISOString().slice(0, 10) === candidate ? candidate : null;
}

function localDateInTimezone(utcIso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(utcIso));
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function roundTo(value: number, places: number): number {
  const multiplier = 10 ** places;
  return Math.round(value * multiplier) / multiplier;
}
