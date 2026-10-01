import {
  buildPierCastHourlyTimeline,
  buildPierCastOfsDatasetUrl,
  listPierCastCommonCycleCandidates,
  PIER_CAST_GREAT_LAKES,
  PIER_CAST_GREAT_LAKES_MODELS,
  type PierCastGreatLakesModel,
} from "../../../lib/pierCastGreatLakes.ts";
import {
  PIER_CAST_WIND_GRID,
  PIER_CAST_WIND_GRID_SPACING_DEGREES,
  type PierCastWindGridNode,
} from "../../../lib/pierCastWindGrid.generated.ts";
import type { PierCastMapFoundationResponse } from "../../../lib/pierCastContracts.ts";

const OPEN_METEO_FREE_URL = "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_CUSTOMER_URL =
  "https://customer-api.open-meteo.com/v1/forecast";
const FOUNDATION_FRESH_MS = 60 * 60 * 1000;
const FOUNDATION_STALE_MS = 6 * 60 * 60 * 1000;
const NOAA_PROBE_TIMEOUT_MS = 8_000;
const OPEN_METEO_TIMEOUT_MS = 15_000;
const OPEN_METEO_BATCH_SIZE = 40;

type MapFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export type PierCastMapFoundationOptions = {
  fetchImpl?: MapFetch;
  now?: () => Date;
  openMeteoApiKey?: string | null;
  openMeteoBaseUrl?: string | null;
  requirePaidOpenMeteo?: boolean;
  windGrid?: readonly PierCastWindGridNode[];
  noaaLookbackHours?: number;
};

type FoundationCache = {
  response: PierCastMapFoundationResponse;
  expiresAt: number;
  staleUntil: number;
};

type OpenMeteoLocationResponse = {
  latitude?: unknown;
  longitude?: unknown;
  hourly?: {
    time?: unknown;
    wind_speed_10m?: unknown;
    wind_direction_10m?: unknown;
    wind_gusts_10m?: unknown;
  };
};

export function createPierCastMapFoundationReader(
  defaults: PierCastMapFoundationOptions = {},
) {
  let cache: FoundationCache | null = null;
  let inFlight: Promise<PierCastMapFoundationResponse> | null = null;

  return async (
    overrides: PierCastMapFoundationOptions = {},
  ): Promise<PierCastMapFoundationResponse> => {
    const options = { ...defaults, ...overrides };
    const now = (options.now ?? (() => new Date()))();
    if (!Number.isFinite(now.getTime())) {
      throw new Error("PierCast map foundation clock is invalid.");
    }
    if (cache && now.getTime() < cache.expiresAt) return cache.response;
    if (inFlight) return await inFlight;

    inFlight = buildFreshFoundation(options, now).then((response) => {
      cache = {
        response,
        expiresAt: now.getTime() + FOUNDATION_FRESH_MS,
        staleUntil: now.getTime() + FOUNDATION_STALE_MS,
      };
      return response;
    }).catch((error) => {
      if (cache && now.getTime() < cache.staleUntil) {
        return {
          ...cache.response,
          generatedAt: now.toISOString(),
          cacheStatus: "stale" as const,
          diagnostics: [
            ...cache.response.diagnostics,
            {
              source: "PIER_CAST_MAP" as const,
              code: "foundation_refresh_failed",
              message: error instanceof Error
                ? error.message
                : "Map foundation refresh failed.",
            },
          ],
        };
      }
      throw error;
    }).finally(() => {
      inFlight = null;
    });
    return await inFlight;
  };
}

export async function discoverPierCastGreatLakesCycle(input: {
  fetchImpl?: MapFetch;
  now: Date;
  lookbackHours?: number;
}): Promise<Date> {
  const fetchImpl = input.fetchImpl ?? fetch;
  const candidates = listPierCastCommonCycleCandidates(
    input.now,
    input.lookbackHours ?? 18,
  );
  for (const candidate of candidates) {
    const availability = await Promise.all(
      PIER_CAST_GREAT_LAKES_MODELS.map((model) =>
        probeCompleteNoaaCycle(fetchImpl, model, candidate)
      ),
    );
    if (availability.every(Boolean)) return candidate;
  }
  throw new Error(
    "No complete common 120-hour NOAA Great Lakes model cycle is available.",
  );
}

export async function fetchPierCastGreatLakesWind(input: {
  fetchImpl?: MapFetch;
  apiKey?: string | null;
  baseUrl?: string | null;
  nodes?: readonly PierCastWindGridNode[];
  validTimes: readonly string[];
  fetchedAt: string;
}): Promise<PierCastMapFoundationResponse["wind"]> {
  const fetchImpl = input.fetchImpl ?? fetch;
  const nodes = input.nodes ?? PIER_CAST_WIND_GRID;
  if (nodes.length === 0) throw new Error("PierCast wind grid is empty.");
  if (input.validTimes.length !== 121) {
    throw new Error("PierCast wind requires exactly 121 hourly valid times.");
  }
  const apiKey = input.apiKey?.trim() ?? "";
  const baseUrl = input.baseUrl?.trim() ||
    (apiKey ? OPEN_METEO_CUSTOMER_URL : OPEN_METEO_FREE_URL);
  const batches = Array.from(
    { length: Math.ceil(nodes.length / OPEN_METEO_BATCH_SIZE) },
    (_, batchIndex) =>
      nodes.slice(
        batchIndex * OPEN_METEO_BATCH_SIZE,
        (batchIndex + 1) * OPEN_METEO_BATCH_SIZE,
      ),
  );
  const results = (await Promise.all(batches.map(async (batch) => {
    const url = new URL(baseUrl);
    url.searchParams.set(
      "latitude",
      batch.map((node) => node.latitude).join(","),
    );
    url.searchParams.set(
      "longitude",
      batch.map((node) => node.longitude).join(","),
    );
    url.searchParams.set(
      "hourly",
      "wind_speed_10m,wind_direction_10m,wind_gusts_10m",
    );
    url.searchParams.set("wind_speed_unit", "mph");
    url.searchParams.set("timezone", "GMT");
    // NOAA publication delays can make the newest common four-system cycle
    // 18 hours old. Request one full day of hourly history so wind remains
    // exactly aligned without extrapolation during a delayed model cycle.
    url.searchParams.set("past_hours", "24");
    url.searchParams.set("forecast_hours", "121");
    url.searchParams.set("models", "best_match");
    if (apiKey) url.searchParams.set("apikey", apiKey);

    const response = await fetchWithTimeout(
      fetchImpl,
      url,
      OPEN_METEO_TIMEOUT_MS,
    );
    if (!response.ok) {
      throw new Error(
        `Open-Meteo wind request failed with HTTP ${response.status}.`,
      );
    }
    const raw = await response.json() as unknown;
    const locations = Array.isArray(raw) ? raw : [raw];
    if (locations.length !== batch.length) {
      throw new Error(
        "Open-Meteo wind response did not match the requested grid.",
      );
    }
    return locations.map((location, index) =>
      parseWindLocation(batch[index]!, location, input.validTimes)
    );
  }))).flat();

  return {
    provider: "Open-Meteo",
    model: "best_match",
    fetchedAt: input.fetchedAt,
    forecastStart: input.validTimes[0]!,
    forecastEnd: input.validTimes[120]!,
    temporalResolutionHours: 1,
    nodeSpacingDegrees: PIER_CAST_WIND_GRID_SPACING_DEGREES,
    nodes: results,
    disclosure:
      "Hourly modeled 10-metre wind guidance. Speed, direction, and gusts may differ at pier level because of shoreline exposure, structures, and rapid convective changes.",
  };
}

async function buildFreshFoundation(
  options: PierCastMapFoundationOptions,
  now: Date,
): Promise<PierCastMapFoundationResponse> {
  if (options.requirePaidOpenMeteo && !options.openMeteoApiKey?.trim()) {
    throw new Error(
      "Paid Open-Meteo configuration is required for PierCast wind.",
    );
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  const issuedAt = await discoverPierCastGreatLakesCycle({
    fetchImpl,
    now,
    lookbackHours: options.noaaLookbackHours,
  });
  const validTimes = buildPierCastHourlyTimeline(issuedAt, 120);
  const fetchedAt = now.toISOString();
  const wind = await fetchPierCastGreatLakesWind({
    fetchImpl,
    apiKey: options.openMeteoApiKey,
    baseUrl: options.openMeteoBaseUrl,
    nodes: options.windGrid,
    validTimes,
    fetchedAt,
  });
  const models = PIER_CAST_GREAT_LAKES_MODELS.map((model) => ({
    ofsId: model.ofsId,
    productId: model.productId,
    lakeIds: [...model.lakeIds],
    issuedAt: issuedAt.toISOString(),
    forecastStart: validTimes[0]!,
    forecastEnd: validTimes[120]!,
    forecastHorizonHours: 120 as const,
    temporalResolutionHours: 1 as const,
    status: "available" as const,
  }));
  return {
    mode: "great_lakes_map_foundation",
    schemaVersion: "pier-cast-map-foundation-v1",
    generatedAt: fetchedAt,
    cacheStatus: "fresh",
    timeline: {
      startsAt: validTimes[0]!,
      endsAt: validTimes[120]!,
      stepHours: 1,
      frameCount: 121,
      validTimes,
    },
    temperature: {
      provider: "NOAA NOS",
      cycleIssuedAt: issuedAt.toISOString(),
      models,
      disclosure:
        "Hourly NOAA NOS modeled surface-temperature guidance from LSOFS, LMHOFS, LEOFS, and LOOFS. It is not a pier thermometer and may not resolve harbor mixing, river plumes, depth-specific temperature, or shoreline structures.",
    },
    wind,
    bathymetry: {
      static: true,
      sources: PIER_CAST_GREAT_LAKES.map((lake) => ({
        lakeId: lake.lakeId,
        displayName: lake.displayName,
        ...lake.bathymetry,
      })),
      disclosure:
        "NOAA NCEI bathymetry is a static fishing-context layer compiled from historical soundings. It must never be used for navigation.",
    },
    diagnostics: [],
  };
}

async function probeCompleteNoaaCycle(
  fetchImpl: MapFetch,
  model: PierCastGreatLakesModel,
  issuedAt: Date,
): Promise<boolean> {
  const url = `${buildPierCastOfsDatasetUrl(model, issuedAt, 120)}.dds`;
  try {
    const response = await fetchWithTimeout(
      fetchImpl,
      url,
      NOAA_PROBE_TIMEOUT_MS,
    );
    if (!response.ok) return false;
    const descriptor = await response.text();
    return /\btemp\b/i.test(descriptor) && /\bTimes\b/.test(descriptor);
  } catch {
    return false;
  }
}

function parseWindLocation(
  node: PierCastWindGridNode,
  raw: unknown,
  validTimes: readonly string[],
): PierCastMapFoundationResponse["wind"]["nodes"][number] {
  if (!raw || typeof raw !== "object") {
    throw new Error(`Open-Meteo omitted wind node ${node.nodeId}.`);
  }
  const location = raw as OpenMeteoLocationResponse;
  const times = arrayOfStrings(location.hourly?.time);
  const speeds = arrayOfNumbers(location.hourly?.wind_speed_10m);
  const directions = arrayOfNumbers(location.hourly?.wind_direction_10m);
  const gusts = arrayOfNumbers(location.hourly?.wind_gusts_10m);
  if (
    times.length !== speeds.length ||
    times.length !== directions.length ||
    times.length !== gusts.length
  ) {
    throw new Error(
      `Open-Meteo returned inconsistent wind arrays for ${node.nodeId}.`,
    );
  }
  const valuesByTime = new Map(times.map((time, index) => [
    normalizeOpenMeteoTime(time),
    {
      speedMph: speeds[index]!,
      directionDegrees: directions[index]!,
      gustMph: gusts[index]!,
    },
  ]));
  const points = validTimes.map((validAt) => {
    const value = valuesByTime.get(validAt);
    if (
      !value ||
      value.speedMph < 0 || value.speedMph > 200 ||
      value.gustMph < 0 || value.gustMph > 250 ||
      value.directionDegrees < 0 || value.directionDegrees > 360
    ) {
      throw new Error(
        `Open-Meteo wind coverage is incomplete for ${node.nodeId}.`,
      );
    }
    return value;
  });
  return {
    ...node,
    speedMph: points.map((point) => point.speedMph),
    directionDegrees: points.map((point) => point.directionDegrees),
    gustMph: points.map((point) => point.gustMph),
  };
}

function normalizeOpenMeteoTime(value: string): string {
  const normalized = /(?:Z|[+-]\d{2}:?\d{2})$/.test(value)
    ? value
    : `${value}Z`;
  const parsed = new Date(normalized);
  if (!Number.isFinite(parsed.getTime())) {
    throw new Error("Open-Meteo returned an invalid wind timestamp.");
  }
  return parsed.toISOString();
}

function arrayOfStrings(value: unknown): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error("Open-Meteo returned an invalid wind time array.");
  }
  return value as string[];
}

function arrayOfNumbers(value: unknown): number[] {
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "number" || !Number.isFinite(item))
  ) {
    throw new Error("Open-Meteo returned an invalid numeric wind array.");
  }
  return value as number[];
}

async function fetchWithTimeout(
  fetchImpl: MapFetch,
  input: string | URL | Request,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(input, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
