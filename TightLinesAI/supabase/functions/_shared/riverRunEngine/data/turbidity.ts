import type { GaugeFreshness, TurbiditySourceConfig } from "../types.ts";
import {
  computeGaugeFreshness,
  fetchUsgsContinuousPages,
  type RiverRunFetch,
} from "./usgs.ts";

const USGS_CONTINUOUS_URL =
  "https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items";

export type NormalizedTurbidityObservation = {
  provider: "USGS";
  sourceId: string;
  siteId: string;
  observedAt: string;
  turbidityFnu: number;
  approvalStatus?: string;
  qualifier?: string;
  timeSeriesId?: string;
  source: "usgs_continuous_values";
};

export type NormalizedTurbidityRead = {
  current: NormalizedTurbidityObservation | null;
  prior24h: NormalizedTurbidityObservation | null;
  freshness: GaugeFreshness;
};

export async function fetchUsgsTurbidity(input: {
  fetchFn: RiverRunFetch;
  source: TurbiditySourceConfig;
  endAtUtc: string;
  period?: string;
}): Promise<unknown | null> {
  const endAt = normalizeIso(input.endAtUtc);
  if (!endAt) return null;
  const startAt = new Date(
    Date.parse(endAt) - periodMilliseconds(input.period ?? "P7D"),
  ).toISOString();
  const params = new URLSearchParams({
    f: "json",
    monitoring_location_id: `USGS-${input.source.siteId}`,
    parameter_code: input.source.parameterCode,
    datetime: `${startAt}/${endAt}`,
    limit: "1000",
  });
  return await fetchUsgsContinuousPages({
    fetchFn: input.fetchFn,
    initialUrl: `${USGS_CONTINUOUS_URL}?${params.toString()}`,
  });
}

export function parseUsgsTurbidity(input: {
  payload: unknown;
  source: TurbiditySourceConfig;
}): NormalizedTurbidityObservation[] {
  const expectedLocation = `USGS-${input.source.siteId}`;
  const observations: NormalizedTurbidityObservation[] = [];
  for (
    const feature of asArray(
      (input.payload as { features?: unknown[] } | null)?.features,
    )
  ) {
    const properties = (feature as { properties?: Record<string, unknown> })
      .properties;
    if (!properties) continue;
    if (String(properties.monitoring_location_id ?? "") !== expectedLocation) {
      continue;
    }
    if (
      String(properties.parameter_code ?? "") !== input.source.parameterCode
    ) {
      continue;
    }
    const unit = String(properties.unit_of_measure ?? "").trim().toUpperCase()
      .replace(/^_+/, "");
    if (unit !== "FNU") {
      continue;
    }
    const qualifier = String(properties.qualifier ?? "").trim();
    if (hasEquipmentFaultQualifier(qualifier)) continue;
    const observedAt = normalizeIso(properties.time);
    const turbidityFnu = finiteNumber(properties.value);
    if (!observedAt || turbidityFnu == null || turbidityFnu < 0) continue;
    const observation: NormalizedTurbidityObservation = {
      provider: "USGS",
      sourceId: input.source.sourceId,
      siteId: input.source.siteId,
      observedAt,
      turbidityFnu,
      source: "usgs_continuous_values",
    };
    const approvalStatus = String(properties.approval_status ?? "").trim();
    if (approvalStatus) observation.approvalStatus = approvalStatus;
    if (qualifier) observation.qualifier = qualifier;
    const timeSeriesId = String(properties.time_series_id ?? "").trim();
    if (timeSeriesId) observation.timeSeriesId = timeSeriesId;
    observations.push(observation);
  }
  return observations.toSorted((left, right) =>
    Date.parse(left.observedAt) - Date.parse(right.observedAt)
  );
}

export function resolveTurbidityRead(input: {
  observations: readonly NormalizedTurbidityObservation[];
  refreshAtUtc: string;
  maxAgeHours: number;
}): NormalizedTurbidityRead {
  const current = input.observations.at(-1) ?? null;
  const targetMs = current
    ? Date.parse(current.observedAt) - 24 * 60 * 60 * 1000
    : NaN;
  let candidate: NormalizedTurbidityObservation | null = null;
  for (const observation of input.observations) {
    if (Date.parse(observation.observedAt) <= targetMs) candidate = observation;
    else break;
  }
  const prior24h = candidate && Number.isFinite(targetMs) &&
      Math.abs(Date.parse(candidate.observedAt) - targetMs) <=
        3 * 60 * 60 * 1000
    ? candidate
    : null;
  return {
    current,
    prior24h,
    freshness: computeGaugeFreshness({
      observation: current,
      refreshAtUtc: input.refreshAtUtc,
      maxAgeHours: input.maxAgeHours,
    }),
  };
}

function hasEquipmentFaultQualifier(qualifier: string): boolean {
  return qualifier.split(/[\s,;|]+/).some((part) =>
    part.toUpperCase() === "EQUIP"
  );
}

function normalizeIso(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

function finiteNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function periodMilliseconds(period: string): number {
  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?)?$/.exec(period);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  return (Number(match[1] ?? 0) * 24 + Number(match[2] ?? 0)) *
    60 * 60 * 1000;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
