import type { NormalizedBaselineObservation } from "./baselineGeneration.ts";
import type { NormalizedTemperatureBaselineObservation } from "./conditionsSuggestBaselineGeneration.ts";
import { type RiverRunFetch, usgsApiRequestInit } from "./usgs.ts";

const USGS_DV_URL =
  "https://api.waterdata.usgs.gov/ogcapi/v0/collections/daily/items";
const USGS_DAILY_FLOW_PARAMETER = "00060";
const USGS_DAILY_MEAN_STATISTIC = "00003";
const USGS_DAILY_TEMPERATURE_PARAMETER = "00010";

export async function fetchUsgsDailyFlowBaselineObservations(input: {
  fetchFn: RiverRunFetch;
  riverId: string;
  siteId: string;
  startDate: string;
  endDate: string;
}): Promise<NormalizedBaselineObservation[]> {
  const params = new URLSearchParams({
    f: "json",
    monitoring_location_id: input.siteId.startsWith("USGS-")
      ? input.siteId
      : `USGS-${input.siteId}`,
    parameter_code: USGS_DAILY_FLOW_PARAMETER,
    statistic_id: USGS_DAILY_MEAN_STATISTIC,
    datetime: `${input.startDate}/${input.endDate}`,
    limit: "10000",
  });
  const response = await input.fetchFn(
    `${USGS_DV_URL}?${params.toString()}`,
    usgsApiRequestInit(),
  );
  if (!response.ok) return [];
  return parseUsgsDailyFlowValues(await response.json(), {
    riverId: input.riverId,
    siteId: input.siteId,
  });
}

export async function fetchUsgsDailyWaterTemperatureObservations(input: {
  fetchFn: RiverRunFetch;
  sourceId: string;
  siteId: string;
  startDate: string;
  endDate: string;
}): Promise<NormalizedTemperatureBaselineObservation[]> {
  const params = new URLSearchParams({
    f: "json",
    monitoring_location_id: input.siteId.startsWith("USGS-")
      ? input.siteId
      : `USGS-${input.siteId}`,
    parameter_code: USGS_DAILY_TEMPERATURE_PARAMETER,
    statistic_id: USGS_DAILY_MEAN_STATISTIC,
    datetime: `${input.startDate}/${input.endDate}`,
    limit: "10000",
  });
  const response = await input.fetchFn(
    `${USGS_DV_URL}?${params.toString()}`,
    usgsApiRequestInit(),
  );
  if (!response.ok) return [];
  return parseUsgsDailyWaterTemperatureValues(await response.json(), input);
}

export function parseUsgsDailyWaterTemperatureValues(
  payload: unknown,
  options: { sourceId: string; siteId: string },
): NormalizedTemperatureBaselineObservation[] {
  const expectedSiteId = options.siteId.startsWith("USGS-")
    ? options.siteId
    : `USGS-${options.siteId}`;
  return asArray((payload as { features?: unknown[] } | null)?.features)
    .flatMap<NormalizedTemperatureBaselineObservation>((feature) => {
      const properties = (feature as {
        properties?: Record<string, unknown>;
      }).properties;
      if (
        !properties ||
        properties.monitoring_location_id !== expectedSiteId ||
        properties.parameter_code !== USGS_DAILY_TEMPERATURE_PARAMETER ||
        properties.statistic_id !== USGS_DAILY_MEAN_STATISTIC
      ) return [];
      const localDate = normalizeLocalDate(properties.time);
      const value = toFiniteNumber(properties.value);
      const unit = String(properties.unit_of_measure ?? "").toLowerCase();
      if (!localDate || value == null) return [];
      const waterTempF = unit === "degc" || unit.includes("celsius")
        ? value * 9 / 5 + 32
        : unit === "degf" || unit.includes("fahrenheit")
        ? value
        : null;
      return waterTempF == null
        ? []
        : [{ sourceId: options.sourceId, localDate, waterTempF }];
    })
    .toSorted((left, right) => left.localDate.localeCompare(right.localDate));
}

export function parseUsgsDailyFlowValues(
  payload: unknown,
  options: { riverId: string; siteId?: string },
): NormalizedBaselineObservation[] {
  const modern = parseModernDailyFlowValues(payload, options);
  if (modern.length > 0) return modern;
  const series = asArray(
    (payload as { value?: { timeSeries?: unknown[] } } | null)?.value
      ?.timeSeries,
  );
  const observations: NormalizedBaselineObservation[] = [];

  for (const item of series) {
    if (!isDailyFlowSeries(item)) continue;
    const values = asArray(
      (item as { values?: Array<{ value?: unknown[] }> }).values?.[0]?.value,
    );
    for (const value of values) {
      const localDate = normalizeLocalDate(
        (value as { dateTime?: unknown }).dateTime,
      );
      const numericValue = toFiniteNumber((value as { value?: unknown }).value);
      if (!localDate || numericValue == null) continue;
      observations.push({
        riverId: options.riverId,
        metric: "flow_cfs",
        localDate,
        value: numericValue,
      });
    }
  }

  return observations.toSorted((a, b) =>
    a.localDate.localeCompare(b.localDate)
  );
}

function parseModernDailyFlowValues(
  payload: unknown,
  options: { riverId: string; siteId?: string },
): NormalizedBaselineObservation[] {
  const observations: NormalizedBaselineObservation[] = [];
  for (
    const feature of asArray(
      (payload as { features?: unknown[] } | null)?.features,
    )
  ) {
    const properties = (feature as {
      properties?: Record<string, unknown>;
    }).properties;
    if (
      !properties ||
      properties.parameter_code !== USGS_DAILY_FLOW_PARAMETER ||
      properties.statistic_id !== USGS_DAILY_MEAN_STATISTIC ||
      !String(properties.monitoring_location_id ?? "").startsWith("USGS-") ||
      (options.siteId &&
        properties.monitoring_location_id !==
          (options.siteId.startsWith("USGS-")
            ? options.siteId
            : `USGS-${options.siteId}`))
    ) {
      continue;
    }
    const localDate = normalizeLocalDate(properties.time);
    const value = toFiniteNumber(properties.value);
    const unit = String(properties.unit_of_measure ?? "").toLowerCase();
    if (
      !localDate || value == null ||
      !(unit === "ft^3/s" || unit.includes("cubic feet"))
    ) {
      continue;
    }
    observations.push({
      riverId: options.riverId,
      metric: "flow_cfs",
      localDate,
      value,
    });
  }
  return observations.toSorted((a, b) =>
    a.localDate.localeCompare(b.localDate)
  );
}

function isDailyFlowSeries(item: unknown): boolean {
  const variable = (item as {
    variable?: {
      variableCode?: Array<{ value?: unknown }>;
      variableName?: unknown;
    };
  }).variable;
  const code = String(variable?.variableCode?.[0]?.value ?? "");
  const name = String(variable?.variableName ?? "").toLowerCase();
  return code === USGS_DAILY_FLOW_PARAMETER || name.includes("discharge");
}

function normalizeLocalDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match?.[1] ?? null;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  if (typeof value === "string" && value.trim().length === 0) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
