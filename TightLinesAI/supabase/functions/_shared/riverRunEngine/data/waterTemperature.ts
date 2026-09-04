import type {
  GaugeFreshness,
  RiverRunReasonCode,
  TemperatureSourceType,
  WaterTemperatureSourceConfig,
} from "../types.ts";
import {
  resolveTemperatureTrendSignal,
  type TemperatureTrendResult,
} from "../metrics/temperature.ts";
import { fetchUsgsContinuousPages, type RiverRunFetch } from "./usgs.ts";
import { buildDirectEventSeries } from "../metrics/directEvent.ts";
import type { DirectEventSample } from "../types.ts";

export type NormalizedWaterTemperatureObservation = {
  sourceId: string;
  provider: WaterTemperatureSourceConfig["provider"];
  siteId: string;
  seriesId?: string;
  observedAt: string;
  waterTempF: number;
  approvalStatus?: string;
  qualifier?: string;
  timeSeriesId?: string;
  source:
    | "monitor_my_watershed_csv"
    | "usgs_continuous_values"
    | "ndbc_realtime_standard_meteorological";
};

export async function fetchNdbcWaterTemperature(input: {
  fetchFn: RiverRunFetch;
  source: WaterTemperatureSourceConfig;
}): Promise<string | null> {
  if (input.source.provider !== "NOAA_NDBC") return null;
  const response = await input.fetchFn(
    `https://www.ndbc.noaa.gov/data/realtime2/${input.source.siteId}.txt`,
  );
  if (!response.ok || typeof response.text !== "function") return null;
  return await response.text();
}

export function parseNdbcWaterTemperature(input: {
  text: string;
  source: WaterTemperatureSourceConfig;
}): {
  observations: NormalizedWaterTemperatureObservation[];
  rejectedObservationCount: number;
} {
  const lines = input.text.split(/\r?\n/).filter(Boolean);
  const header = lines.find((line) => line.startsWith("#YY"));
  if (!header) return { observations: [], rejectedObservationCount: 1 };
  const columns = header.replace(/^#/, "").trim().split(/\s+/);
  const indexes = Object.fromEntries(
    columns.map((name, index) => [name, index]),
  );
  if (
    ["YY", "MM", "DD", "hh", "mm", "WTMP"].some((name) => indexes[name] == null)
  ) {
    return { observations: [], rejectedObservationCount: 1 };
  }
  const observations: NormalizedWaterTemperatureObservation[] = [];
  let rejectedObservationCount = 0;
  for (const line of lines) {
    if (line.startsWith("#")) continue;
    const values = line.trim().split(/\s+/);
    const waterTempC = Number(values[indexes.WTMP]);
    const parts = ["YY", "MM", "DD", "hh", "mm"].map((name) =>
      Number(values[indexes[name]])
    );
    if (
      !Number.isFinite(waterTempC) ||
      parts.some((part) => !Number.isInteger(part))
    ) {
      rejectedObservationCount++;
      continue;
    }
    const [year, month, day, hour, minute] = parts;
    const observedAt = new Date(Date.UTC(year, month - 1, day, hour, minute))
      .toISOString();
    observations.push({
      sourceId: input.source.sourceId,
      provider: "NOAA_NDBC",
      siteId: input.source.siteId,
      observedAt,
      waterTempF: waterTempC * 9 / 5 + 32 + (input.source.adjustmentF ?? 0),
      source: "ndbc_realtime_standard_meteorological",
    });
  }
  return filterTemperatureObservations({
    observations,
    source: input.source,
    rejectedObservationCount,
  });
}

export type NormalizedWaterTemperatureRead = {
  sourceId?: string;
  sourceName?: string;
  sourceType: TemperatureSourceType;
  current: NormalizedWaterTemperatureObservation | null;
  smoothedWaterTempF: number | null;
  freshness: GaugeFreshness;
  trend: TemperatureTrendResult;
  changes: Array<{
    hours: 12 | 24 | 48;
    deltaF: number | null;
  }>;
  fourHourSeries: DirectEventSample[];
  isUpstreamFallback: boolean;
  rejectedObservationCount: number;
  reasonCodes: RiverRunReasonCode[];
};

export async function fetchMonitorMyWatershedTemperature(input: {
  fetchFn: RiverRunFetch;
  source: WaterTemperatureSourceConfig;
  endAtUtc: string;
  lookbackDays?: number;
}): Promise<string | null> {
  if (input.source.provider !== "MONITOR_MY_WATERSHED") return null;
  if (!input.source.seriesId) return null;
  const end = new Date(input.endAtUtc);
  const start = new Date(
    end.getTime() - (input.lookbackDays ?? 4) * 24 * 60 * 60 * 1000,
  );
  const params = new URLSearchParams({
    result_ids: input.source.seriesId,
    min_datetime: start.toISOString().slice(0, 10),
    max_datetime: new Date(end.getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
  });
  const response = await input.fetchFn(
    `https://monitormywatershed.org/api/csv-values/?${params.toString()}`,
  );
  if (!response.ok || typeof response.text !== "function") return null;
  return await response.text();
}

export async function fetchUsgsWaterTemperature(input: {
  fetchFn: RiverRunFetch;
  source: WaterTemperatureSourceConfig;
  endAtUtc: string;
  lookbackDays?: number;
}): Promise<unknown | null> {
  if (input.source.provider !== "USGS") return null;
  const end = new Date(input.endAtUtc);
  const start = new Date(
    end.getTime() - (input.lookbackDays ?? 4) * 24 * 60 * 60 * 1000,
  );
  const params = new URLSearchParams({
    f: "json",
    monitoring_location_id: input.source.siteId.startsWith("USGS-")
      ? input.source.siteId
      : `USGS-${input.source.siteId}`,
    parameter_code: "00010",
    datetime: `${start.toISOString()}/${end.toISOString()}`,
    limit: "1000",
  });
  return await fetchUsgsContinuousPages({
    fetchFn: input.fetchFn,
    initialUrl:
      `https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items?${params.toString()}`,
  });
}

export function parseUsgsWaterTemperature(input: {
  payload: unknown;
  source: WaterTemperatureSourceConfig;
}): {
  observations: NormalizedWaterTemperatureObservation[];
  rejectedObservationCount: number;
} {
  const expectedSiteId = input.source.siteId.startsWith("USGS-")
    ? input.source.siteId
    : `USGS-${input.source.siteId}`;
  const observations: NormalizedWaterTemperatureObservation[] = [];
  let rejectedObservationCount = 0;
  const features = Array.isArray(
      (input.payload as { features?: unknown[] } | null)?.features,
    )
    ? (input.payload as { features: unknown[] }).features
    : [];
  for (const feature of features) {
    const properties = (feature as { properties?: Record<string, unknown> })
      .properties;
    if (
      !properties ||
      properties.monitoring_location_id !== expectedSiteId ||
      properties.parameter_code !== "00010"
    ) {
      rejectedObservationCount++;
      continue;
    }
    const observedAt = normalizeIso(properties.time);
    const value = Number(properties.value);
    const unit = String(properties.unit_of_measure ?? "").toLowerCase();
    if (!observedAt || !Number.isFinite(value)) {
      rejectedObservationCount++;
      continue;
    }
    const waterTempF = unit === "degc" || unit.includes("celsius")
      ? value * 9 / 5 + 32
      : unit === "degf" || unit.includes("fahrenheit")
      ? value
      : null;
    if (waterTempF == null) {
      rejectedObservationCount++;
      continue;
    }
    const observation: NormalizedWaterTemperatureObservation = {
      sourceId: input.source.sourceId,
      provider: input.source.provider,
      siteId: input.source.siteId,
      seriesId: input.source.seriesId,
      observedAt,
      waterTempF: waterTempF + (input.source.adjustmentF ?? 0),
      source: "usgs_continuous_values",
    };
    const approvalStatus = String(properties.approval_status ?? "").trim();
    if (approvalStatus) observation.approvalStatus = approvalStatus;
    const qualifier = String(properties.qualifier ?? "").trim();
    if (qualifier) observation.qualifier = qualifier;
    const timeSeriesId = String(properties.time_series_id ?? "").trim();
    if (timeSeriesId) observation.timeSeriesId = timeSeriesId;
    observations.push(observation);
  }
  return filterTemperatureObservations({
    observations,
    source: input.source,
    rejectedObservationCount,
  });
}

export function parseMonitorMyWatershedTemperature(input: {
  csv: string;
  source: WaterTemperatureSourceConfig;
}): {
  observations: NormalizedWaterTemperatureObservation[];
  rejectedObservationCount: number;
} {
  const metadata = parseMetadata(input.csv);
  if (metadata.SiteCode !== input.source.siteId) {
    return { observations: [], rejectedObservationCount: 1 };
  }
  if (metadata.SampleMedium?.toLowerCase() !== "liquid aqueous") {
    return { observations: [], rejectedObservationCount: 1 };
  }
  if (metadata.VariableUnitsName?.toLowerCase() !== "degree fahrenheit") {
    return { observations: [], rejectedObservationCount: 1 };
  }

  const candidates = input.csv.split(/\r?\n/).flatMap((line) => {
    if (!/^\d{4}-\d{2}-\d{2}/.test(line)) return [];
    const columns = line.split(",");
    const observedAt = normalizeMonitorUtc(columns[0]);
    const rawValue = Number(columns[3]);
    if (!observedAt || !Number.isFinite(rawValue)) return [];
    return [{
      sourceId: input.source.sourceId,
      provider: input.source.provider,
      siteId: input.source.siteId,
      seriesId: input.source.seriesId,
      observedAt,
      waterTempF: rawValue + (input.source.adjustmentF ?? 0),
      source: "monitor_my_watershed_csv" as const,
    }];
  }).toSorted((a, b) => Date.parse(a.observedAt) - Date.parse(b.observedAt));

  return filterTemperatureObservations({
    observations: candidates,
    source: input.source,
    rejectedObservationCount: 0,
  });
}

export function resolveWaterTemperatureRead(input: {
  sources: WaterTemperatureSourceConfig[];
  sourcePriority: string[];
  observationsBySource: Record<
    string,
    NormalizedWaterTemperatureObservation[]
  >;
  rejectedBySource?: Record<string, number>;
  refreshAtUtc: string;
}): NormalizedWaterTemperatureRead {
  const orderedSources = input.sourcePriority.flatMap((sourceId) => {
    const source = input.sources.find((candidate) =>
      candidate.sourceId === sourceId
    );
    return source ? [source] : [];
  });
  const candidates = orderedSources.map((source, index) =>
    buildCandidateRead({
      source,
      observations: input.observationsBySource[source.sourceId] ?? [],
      refreshAtUtc: input.refreshAtUtc,
      isUpstreamFallback: index > 0,
      rejectedObservationCount: input.rejectedBySource?.[source.sourceId] ?? 0,
    })
  );
  const selected =
    candidates.find((candidate) =>
      candidate.freshness === "fresh" &&
      candidate.current != null &&
      peerValidated(candidate, candidates, orderedSources)
    ) ?? candidates.find((candidate) =>
      candidate.freshness === "stale" &&
      candidate.current != null &&
      peerValidated(candidate, candidates, orderedSources)
    );

  if (selected) return selected;
  const rejectedObservationCount = candidates.reduce(
    (sum, candidate) => sum + candidate.rejectedObservationCount,
    0,
  );
  return {
    sourceType: "unavailable",
    current: null,
    smoothedWaterTempF: null,
    freshness:
      candidates.some((candidate) => candidate.freshness === "older_than_24h")
        ? "older_than_24h"
        : "missing",
    trend: resolveTemperatureTrendSignal({
      sourceType: "unavailable",
      hasEnoughValues: false,
    }),
    changes: [],
    fourHourSeries: [],
    isUpstreamFallback: false,
    rejectedObservationCount,
    reasonCodes: [
      "temperature_unavailable",
      ...(rejectedObservationCount > 0
        ? ["temperature_value_invalid" as const]
        : []),
    ],
  };
}

function buildCandidateRead(input: {
  source: WaterTemperatureSourceConfig;
  observations: NormalizedWaterTemperatureObservation[];
  refreshAtUtc: string;
  isUpstreamFallback: boolean;
  rejectedObservationCount: number;
}): NormalizedWaterTemperatureRead {
  const usableObservations = input.observations.filter((observation) =>
    Date.parse(observation.observedAt) <= Date.parse(input.refreshAtUtc)
  );
  const current = usableObservations[usableObservations.length - 1] ?? null;
  const freshness = temperatureFreshness({
    observedAt: current?.observedAt,
    refreshAtUtc: input.refreshAtUtc,
    maxAgeHours: input.source.maxAgeHours,
  });
  const smoothedWaterTempF = current
    ? median(
      usableObservations
        .filter((observation) =>
          Date.parse(observation.observedAt) >=
            Date.parse(current.observedAt) -
              input.source.smoothingWindowHours * 60 * 60 * 1000
        )
        .map((observation) => observation.waterTempF),
    )
    : null;
  const prior24h = current
    ? closestAtOrBefore(
      usableObservations,
      Date.parse(current.observedAt) - 24 * 60 * 60 * 1000,
    )
    : null;
  const prior72h = current
    ? closestAtOrBefore(
      usableObservations,
      Date.parse(current.observedAt) - 72 * 60 * 60 * 1000,
    )
    : null;
  const sourceType = input.source.sourceType;
  const changes = ([12, 24, 48] as const).map((hours) => {
    if (smoothedWaterTempF == null || !current) {
      return { hours, deltaF: null };
    }
    const targetMs = Date.parse(current.observedAt) - hours * 60 * 60 * 1000;
    const prior = closestAtOrBefore(usableObservations, targetMs);
    const withinTolerance = prior && Math.abs(
          Date.parse(prior.observedAt) - targetMs,
        ) <= 3 * 60 * 60 * 1000;
    return {
      hours,
      deltaF: withinTolerance ? smoothedWaterTempF - prior.waterTempF : null,
    };
  });
  const fourHourSeries = buildDirectEventSeries({
    observations: usableObservations,
    refreshAtUtc: input.refreshAtUtc,
    observedAt: (observation) => observation.observedAt,
    value: (observation) => observation.waterTempF,
  });
  const trend = resolveTemperatureTrendSignal({
    sourceType,
    delta24hF: smoothedWaterTempF != null && prior24h
      ? smoothedWaterTempF - prior24h.waterTempF
      : null,
    delta72hF: smoothedWaterTempF != null && prior72h
      ? smoothedWaterTempF - prior72h.waterTempF
      : null,
    hasEnoughValues: smoothedWaterTempF != null && prior72h != null,
  });
  const reasonCodes = new Set<RiverRunReasonCode>([
    ...trend.reasonCodes,
    input.isUpstreamFallback
      ? "temperature_upstream_fallback"
      : "temperature_primary_source",
  ]);
  if (freshness !== "fresh") reasonCodes.add("temperature_source_stale");
  if (input.rejectedObservationCount > 0) {
    reasonCodes.add("temperature_value_invalid");
  }
  return {
    sourceId: input.source.sourceId,
    sourceName: input.source.name,
    sourceType,
    current,
    smoothedWaterTempF,
    freshness,
    trend,
    changes,
    fourHourSeries,
    isUpstreamFallback: input.isUpstreamFallback,
    rejectedObservationCount: input.rejectedObservationCount,
    reasonCodes: [...reasonCodes],
  };
}

function peerValidated(
  selected: NormalizedWaterTemperatureRead,
  candidates: NormalizedWaterTemperatureRead[],
  sources: WaterTemperatureSourceConfig[],
): boolean {
  if (selected.smoothedWaterTempF == null || !selected.sourceId) return false;
  const source = sources.find((candidate) =>
    candidate.sourceId === selected.sourceId
  );
  if (!source) return false;
  const peerValues = candidates
    .filter((candidate) =>
      candidate.sourceId !== selected.sourceId &&
      candidate.freshness === "fresh" &&
      candidate.smoothedWaterTempF != null
    )
    .map((candidate) => candidate.smoothedWaterTempF!);
  if (peerValues.length < 2) return true;
  const peerMedian = median(peerValues);
  return peerMedian == null ||
    Math.abs(selected.smoothedWaterTempF - peerMedian) <=
      source.maxPeerDifferenceF;
}

function temperatureFreshness(input: {
  observedAt?: string;
  refreshAtUtc: string;
  maxAgeHours: number;
}): GaugeFreshness {
  if (!input.observedAt) return "missing";
  const ageHours = (Date.parse(input.refreshAtUtc) -
    Date.parse(input.observedAt)) / (60 * 60 * 1000);
  if (!Number.isFinite(ageHours) || ageHours < 0) return "missing";
  if (ageHours <= input.maxAgeHours) return "fresh";
  if (ageHours <= 24) return "stale";
  return "older_than_24h";
}

function closestAtOrBefore(
  observations: NormalizedWaterTemperatureObservation[],
  targetMs: number,
): NormalizedWaterTemperatureObservation | null {
  let selected: NormalizedWaterTemperatureObservation | null = null;
  for (const observation of observations) {
    if (Date.parse(observation.observedAt) <= targetMs) selected = observation;
    else break;
  }
  return selected;
}

function parseMetadata(csv: string): Record<string, string> {
  const metadata: Record<string, string> = {};
  for (const line of csv.split(/\r?\n/)) {
    const match = /^# ([A-Za-z][A-Za-z0-9]+):\s*(.*)$/.exec(line);
    if (match && metadata[match[1]] === undefined) {
      metadata[match[1]] = match[2].trim();
    }
  }
  return metadata;
}

function normalizeMonitorUtc(value: string | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim().replace(" ", "T") + "Z";
  const milliseconds = Date.parse(normalized);
  return Number.isFinite(milliseconds)
    ? new Date(milliseconds).toISOString()
    : null;
}

function normalizeIso(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds)
    ? new Date(milliseconds).toISOString()
    : null;
}

function filterTemperatureObservations(input: {
  observations: NormalizedWaterTemperatureObservation[];
  source: WaterTemperatureSourceConfig;
  rejectedObservationCount: number;
}): {
  observations: NormalizedWaterTemperatureObservation[];
  rejectedObservationCount: number;
} {
  const observations: NormalizedWaterTemperatureObservation[] = [];
  let rejectedObservationCount = input.rejectedObservationCount;
  for (
    const candidate of input.observations.toSorted((a, b) =>
      Date.parse(a.observedAt) - Date.parse(b.observedAt)
    )
  ) {
    if (
      candidate.waterTempF < input.source.minValidF ||
      candidate.waterTempF > input.source.maxValidF
    ) {
      rejectedObservationCount++;
      continue;
    }
    const prior = observations[observations.length - 1];
    if (prior) {
      const elapsedHours = (Date.parse(candidate.observedAt) -
        Date.parse(prior.observedAt)) / (60 * 60 * 1000);
      if (elapsedHours > 0 && elapsedHours <= 1) {
        const rate = Math.abs(candidate.waterTempF - prior.waterTempF) /
          elapsedHours;
        if (rate > input.source.maxRateChangeFPerHour) {
          rejectedObservationCount++;
          continue;
        }
      }
    }
    observations.push(candidate);
  }
  return { observations, rejectedObservationCount };
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}
