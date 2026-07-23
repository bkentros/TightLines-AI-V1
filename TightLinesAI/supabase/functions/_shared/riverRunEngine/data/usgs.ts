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
) => Promise<{ ok: boolean; json(): Promise<unknown> }>;

export type NormalizedGaugeObservation = {
  provider: "USGS";
  siteId: string;
  observedAt: string;
  flow_cfs?: number;
  gage_height_ft?: number;
  source: "usgs_instantaneous_values";
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

const USGS_IV_URL = "https://waterservices.usgs.gov/nwis/iv/";
const USGS_PARAMETER_CODES: Record<RiverMetric, string> = {
  flow_cfs: "00060",
  gage_height_ft: "00065",
};

export async function fetchUsgsInstantaneousValues(input: {
  fetchFn: RiverRunFetch;
  siteId: string;
  metrics?: RiverMetric[];
  period?: string;
}): Promise<unknown | null> {
  const metrics: RiverMetric[] = input.metrics?.length
    ? [...input.metrics]
    : ["flow_cfs"];
  const params = new URLSearchParams({
    format: "json",
    sites: input.siteId,
    parameterCd: metrics.map((metric) => USGS_PARAMETER_CODES[metric]).join(
      ",",
    ),
    siteStatus: "all",
    period: input.period ?? "P2D",
  });
  const response = await input.fetchFn(`${USGS_IV_URL}?${params.toString()}`);
  if (!response.ok) return null;
  return await response.json();
}

export function parseUsgsInstantaneousValues(
  payload: unknown,
  siteId: string,
): NormalizedGaugeObservation[] {
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
        source: "usgs_instantaneous_values" as const,
      };
      existing[metric] = numericValue;
      byTimestamp.set(observedAt, existing);
    }
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
    rising24hPercent?: number;
    meaningfulRise24hPercent?: number;
    sharpRise24hPercent?: number;
  };
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
  const gaugeFreshness = computeGaugeFreshness({
    observation: current,
    refreshAtUtc: input.refreshAtUtc,
    maxAgeHours: input.maxAgeHours,
  });
  const flowTrend = resolveFlowTrendSignal({
    currentValue: current ? metricValue(current, input.primaryMetric) : null,
    value24hAgo: prior24h ? metricValue(prior24h, input.primaryMetric) : null,
    ...input.riseThresholds,
  });
  return {
    provider: "USGS",
    siteId: input.siteId,
    primaryMetric: input.primaryMetric,
    current,
    prior24h,
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
