import type {
  GaugeFreshness,
  RiverMetric,
  RiverRunReasonCode,
} from "../types.ts";
import {
  type FlowTrendResult,
  resolveFlowTrendSignal,
} from "../metrics/flow.ts";

export type RiverRunFetch = (
  input: string | URL,
  init?: RequestInit,
) => Promise<{
  ok: boolean;
  json(): Promise<unknown>;
  text?: () => Promise<string>;
}>;

export type NormalizedGaugeObservation = {
  provider: "USGS";
  siteId: string;
  observedAt: string;
  flow_cfs?: number;
  gage_height_ft?: number;
  approvalStatus?: string;
  qualifier?: string;
  timeSeriesId?: string;
  source: "usgs_continuous_values";
};

export type NormalizedGaugeRead = {
  provider: "USGS";
  siteId: string;
  primaryMetric: RiverMetric;
  current: NormalizedGaugeObservation | null;
  prior24h: NormalizedGaugeObservation | null;
  gaugeFreshness: GaugeFreshness;
  flowTrend: FlowTrendResult;
  reasonCodes: RiverRunReasonCode[];
};

const USGS_CONTINUOUS_URL =
  "https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items";
const USGS_PARAMETER_CODES: Record<RiverMetric, string> = {
  flow_cfs: "00060",
  gage_height_ft: "00065",
};

export async function fetchUsgsInstantaneousValues(input: {
  fetchFn: RiverRunFetch;
  siteId: string;
  metrics?: RiverMetric[];
  period?: string;
  endAtUtc?: string;
}): Promise<unknown | null> {
  const metrics: RiverMetric[] = input.metrics?.length
    ? [...input.metrics]
    : ["flow_cfs"];
  const endAtUtc = normalizeIso(input.endAtUtc) ?? new Date().toISOString();
  const startAtUtc = new Date(
    Date.parse(endAtUtc) - periodMilliseconds(input.period ?? "P2D"),
  ).toISOString();
  const monitoringLocationId = usgsMonitoringLocationId(input.siteId);
  const payloads = await Promise.all(metrics.map(async (metric) => {
    const params = new URLSearchParams({
      f: "json",
      monitoring_location_id: monitoringLocationId,
      parameter_code: USGS_PARAMETER_CODES[metric],
      datetime: `${startAtUtc}/${endAtUtc}`,
      limit: "1000",
    });
    const response = await input.fetchFn(
      `${USGS_CONTINUOUS_URL}?${params.toString()}`,
    );
    if (!response.ok) return null;
    return await response.json();
  }));
  if (payloads.every((payload) => payload == null)) return null;
  return {
    type: "FeatureCollection",
    features: payloads.flatMap((payload) =>
      asArray(
        (payload as { features?: unknown[] } | null)?.features,
      )
    ),
  };
}

export function parseUsgsInstantaneousValues(
  payload: unknown,
  siteId: string,
): NormalizedGaugeObservation[] {
  const modern = parseModernUsgsContinuousValues(payload, siteId);
  if (modern.length > 0) return modern;

  const series = asArray(
    (payload as { value?: { timeSeries?: unknown[] } } | null)?.value
      ?.timeSeries,
  );
  const byTimestamp = new Map<string, NormalizedGaugeObservation>();

  for (const item of series) {
    const metric = metricFromUsgsSeries(item);
    if (!metric) continue;
    const values = asArray(
      (item as { values?: Array<{ value?: unknown[] }> }).values?.[0]?.value,
    );
    for (const value of values) {
      const observedAt = normalizeIso(
        (value as { dateTime?: unknown }).dateTime,
      );
      const numericValue = toFiniteNumber((value as { value?: unknown }).value);
      if (!observedAt || numericValue == null) continue;

      const existing = byTimestamp.get(observedAt) ?? {
        provider: "USGS" as const,
        siteId,
        observedAt,
        source: "usgs_continuous_values" as const,
      };
      existing[metric] = numericValue;
      byTimestamp.set(observedAt, existing);
    }
  }

  return [...byTimestamp.values()].toSorted((a, b) =>
    Date.parse(a.observedAt) - Date.parse(b.observedAt)
  );
}

function parseModernUsgsContinuousValues(
  payload: unknown,
  siteId: string,
): NormalizedGaugeObservation[] {
  const expectedLocation = usgsMonitoringLocationId(siteId);
  const byTimestamp = new Map<string, NormalizedGaugeObservation>();
  for (
    const feature of asArray(
      (payload as { features?: unknown[] } | null)?.features,
    )
  ) {
    const properties = (feature as { properties?: Record<string, unknown> })
      .properties;
    if (!properties) continue;
    if (String(properties.monitoring_location_id ?? "") !== expectedLocation) {
      continue;
    }
    const metric = metricFromParameterCode(properties.parameter_code);
    const observedAt = normalizeIso(properties.time);
    const value = toFiniteNumber(properties.value);
    if (!metric || !observedAt || value == null) continue;
    if (!isExpectedUsgsUnit(metric, properties.unit_of_measure)) continue;

    const observation = byTimestamp.get(observedAt) ?? {
      provider: "USGS" as const,
      siteId,
      observedAt,
      source: "usgs_continuous_values" as const,
    };
    observation[metric] = value;
    const approvalStatus = String(properties.approval_status ?? "").trim();
    if (approvalStatus) observation.approvalStatus = approvalStatus;
    const qualifier = String(properties.qualifier ?? "").trim();
    if (qualifier) observation.qualifier = qualifier;
    const timeSeriesId = String(properties.time_series_id ?? "").trim();
    if (timeSeriesId) observation.timeSeriesId = timeSeriesId;
    byTimestamp.set(observedAt, observation);
  }
  return [...byTimestamp.values()].toSorted((a, b) =>
    Date.parse(a.observedAt) - Date.parse(b.observedAt)
  );
}

export function selectLatestUsableGaugeObservation(
  observations: readonly NormalizedGaugeObservation[],
  metric: RiverMetric,
): NormalizedGaugeObservation | null {
  for (let index = observations.length - 1; index >= 0; index--) {
    if (metricValue(observations[index], metric) != null) {
      return observations[index];
    }
  }
  return null;
}

export function selectClosestObservationAtOrBefore(
  observations: readonly NormalizedGaugeObservation[],
  metric: RiverMetric,
  targetUtcIso: string,
): NormalizedGaugeObservation | null {
  const targetMs = Date.parse(targetUtcIso);
  let selected: NormalizedGaugeObservation | null = null;
  for (const observation of observations) {
    if (metricValue(observation, metric) == null) continue;
    const observedMs = Date.parse(observation.observedAt);
    if (observedMs <= targetMs) selected = observation;
    else break;
  }
  return selected;
}

export function computeGaugeFreshness(input: {
  observation: NormalizedGaugeObservation | null;
  refreshAtUtc: string;
  maxAgeHours: number;
}): GaugeFreshness {
  if (!input.observation) return "missing";
  const ageHours = (Date.parse(input.refreshAtUtc) -
    Date.parse(input.observation.observedAt)) / (60 * 60 * 1000);
  if (!Number.isFinite(ageHours) || ageHours < 0) return "missing";
  if (ageHours <= input.maxAgeHours) return "fresh";
  if (ageHours <= 24) return "stale";
  return "older_than_24h";
}

export function normalizeGaugeRead(input: {
  observations: readonly NormalizedGaugeObservation[];
  siteId: string;
  primaryMetric: RiverMetric;
  refreshAtUtc: string;
  maxAgeHours: number;
  riseThresholds?: {
    rising24hAbsolute?: number;
    rising24hPercent?: number;
    meaningfulRise24hAbsolute?: number;
    meaningfulRise24hPercent?: number;
    sharpRise24hAbsolute?: number;
    sharpRise24hPercent?: number;
  };
  comparisonToleranceHours?: number;
}): NormalizedGaugeRead {
  const current = selectLatestUsableGaugeObservation(
    input.observations,
    input.primaryMetric,
  );
  const prior24h = current
    ? selectClosestObservationAtOrBefore(
      input.observations,
      input.primaryMetric,
      new Date(Date.parse(current.observedAt) - 24 * 60 * 60 * 1000)
        .toISOString(),
    )
    : null;
  const comparisonToleranceHours = input.comparisonToleranceHours ?? 3;
  const usablePrior24h = prior24h && current &&
      Math.abs(
          Date.parse(prior24h.observedAt) -
            (Date.parse(current.observedAt) - 24 * 60 * 60 * 1000),
        ) <= comparisonToleranceHours * 60 * 60 * 1000
    ? prior24h
    : null;
  const gaugeFreshness = computeGaugeFreshness({
    observation: current,
    refreshAtUtc: input.refreshAtUtc,
    maxAgeHours: input.maxAgeHours,
  });
  const flowTrend = resolveFlowTrendSignal({
    currentValue: current ? metricValue(current, input.primaryMetric) : null,
    value24hAgo: usablePrior24h
      ? metricValue(usablePrior24h, input.primaryMetric)
      : null,
    ...input.riseThresholds,
  });
  return {
    provider: "USGS",
    siteId: input.siteId,
    primaryMetric: input.primaryMetric,
    current,
    prior24h: usablePrior24h,
    gaugeFreshness,
    flowTrend,
    reasonCodes: [gaugeReasonCode(gaugeFreshness), ...flowTrend.reasonCodes],
  };
}

export function metricValue(
  observation: NormalizedGaugeObservation,
  metric: RiverMetric,
): number | null {
  const value = observation[metric];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function metricFromUsgsSeries(item: unknown): RiverMetric | null {
  const variable = (item as {
    variable?: {
      variableCode?: Array<{ value?: unknown }>;
      variableName?: unknown;
    };
  }).variable;
  const code = String(variable?.variableCode?.[0]?.value ?? "");
  const name = String(variable?.variableName ?? "").toLowerCase();
  if (code === "00060" || name.includes("discharge")) return "flow_cfs";
  if (code === "00065" || name.includes("gage height")) {
    return "gage_height_ft";
  }
  return null;
}

function metricFromParameterCode(value: unknown): RiverMetric | null {
  const code = String(value ?? "");
  if (code === "00060") return "flow_cfs";
  if (code === "00065") return "gage_height_ft";
  return null;
}

function isExpectedUsgsUnit(metric: RiverMetric, unit: unknown): boolean {
  const normalized = String(unit ?? "").toLowerCase();
  if (metric === "flow_cfs") {
    return normalized === "ft^3/s" || normalized.includes("cubic feet");
  }
  return normalized === "ft" || normalized.includes("feet");
}

function usgsMonitoringLocationId(siteId: string): string {
  return siteId.startsWith("USGS-") ? siteId : `USGS-${siteId}`;
}

function periodMilliseconds(period: string): number {
  const match = /^P(\d+)D$/.exec(period);
  const days = match ? Number(match[1]) : 2;
  return Math.max(1, days) * 24 * 60 * 60 * 1000;
}

function gaugeReasonCode(freshness: GaugeFreshness): RiverRunReasonCode {
  switch (freshness) {
    case "fresh":
      return "gauge_fresh";
    case "stale":
      return "gauge_stale";
    case "missing":
      return "gauge_missing";
    case "older_than_24h":
      return "gauge_older_than_24h";
  }
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeIso(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

function toFiniteNumber(value: unknown): number | null {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}
