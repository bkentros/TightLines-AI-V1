import type { NormalizedBaselineObservation } from "./baselineGeneration.ts";
import type { RiverRunFetch } from "./usgs.ts";

const USGS_DV_URL = "https://waterservices.usgs.gov/nwis/dv/";
const USGS_DAILY_FLOW_PARAMETER = "00060";

export async function fetchUsgsDailyFlowBaselineObservations(input: {
  fetchFn: RiverRunFetch;
  riverId: string;
  siteId: string;
  startDate: string;
  endDate: string;
}): Promise<NormalizedBaselineObservation[]> {
  const params = new URLSearchParams({
    format: "json",
    sites: input.siteId,
    parameterCd: USGS_DAILY_FLOW_PARAMETER,
    startDT: input.startDate,
    endDT: input.endDate,
    siteStatus: "all",
  });
  const response = await input.fetchFn(`${USGS_DV_URL}?${params.toString()}`);
  if (!response.ok) return [];
  return parseUsgsDailyFlowValues(await response.json(), {
    riverId: input.riverId,
  });
}

export function parseUsgsDailyFlowValues(
  payload: unknown,
  options: { riverId: string },
): NormalizedBaselineObservation[] {
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
