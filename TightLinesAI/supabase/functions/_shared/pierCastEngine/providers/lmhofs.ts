import { PIER_CAST_CITY_PROFILES } from "../config/cities.ts";
import type {
  PierCastCityId,
  PierCastCityTemperatureSource,
} from "../types.ts";

export const PIER_CAST_LMHOFS_FORECAST_HOURS = Object.freeze(
  Array.from({ length: 121 }, (_, forecastHour) => forecastHour),
);

const LMHOFS_MIN_PLAUSIBLE_TEMPERATURE_C = -2;
const LMHOFS_MAX_PLAUSIBLE_TEMPERATURE_C = 40;

export type PierCastLmhofsCycle = {
  issuedAt: string;
  ageHours: number;
};

export type PierCastLmhofsSample = {
  cityId: PierCastCityId;
  sourceId: string;
  productId: "NOAA_NOS_LMHOFS_REGULARGRID";
  issuedAt: string;
  forecastHour: number;
  validAt: string;
  temperatureC: number;
  rawUnit: "C";
  verticalSelection: "surface";
  depthIndex: 0;
  gridRow: number;
  gridColumn: number;
  latitude: number;
  longitude: number;
  sourceUrl: string;
};

export type PierCastLmhofsCityTimeline =
  | {
    status: "available";
    cityId: PierCastCityId;
    sourceId: string;
    issuedAt: string;
    requestedForecastHours: number[];
    coverageStart: string;
    coverageEnd: string;
    samples: PierCastLmhofsSample[];
    reasonCodes: readonly [];
  }
  | {
    status: "unavailable";
    cityId: PierCastCityId;
    sourceId: string;
    issuedAt: string;
    requestedForecastHours: number[];
    missingForecastHours: number[];
    samples: PierCastLmhofsSample[];
    reasonCodes: readonly ["temperature_partial_horizon"];
  };

export type PierCastLmhofsBatch =
  | {
    status: "available" | "partial";
    issuedAt: string;
    fetchedAt: string;
    cycleAgeHours: number;
    fullHorizonRequested: boolean;
    requestedForecastHours: number[];
    cities: PierCastLmhofsCityTimeline[];
    diagnostics: PierCastLmhofsDiagnostic[];
  }
  | {
    status: "unavailable";
    issuedAt: null;
    fetchedAt: string;
    cycleAgeHours: null;
    fullHorizonRequested: boolean;
    requestedForecastHours: number[];
    cities: [];
    diagnostics: PierCastLmhofsDiagnostic[];
  };

export type PierCastLmhofsDiagnostic = {
  code:
    | "cycle_not_complete"
    | "cycle_stale"
    | "request_failed"
    | "invalid_provider_payload";
  message: string;
  cityId?: PierCastCityId;
  forecastHour?: number;
  sourceUrl?: string;
  httpStatus?: number;
  attempts?: number;
};

export type PierCastLmhofsFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export type FetchPierCastLmhofsBatchOptions = {
  fetchImpl?: PierCastLmhofsFetch;
  now?: () => Date;
  forecastHours?: readonly number[];
  concurrency?: number;
  requestTimeoutMs?: number;
  discoveryLookbackHours?: number;
  maxAttempts?: number;
};

type LmhofsSource = PierCastCityTemperatureSource & {
  productId: "NOAA_NOS_LMHOFS_REGULARGRID";
  configuredLocation: NonNullable<
    PierCastCityTemperatureSource["configuredLocation"]
  >;
};

type CitySource = {
  cityId: PierCastCityId;
  source: LmhofsSource;
};

type PointFetchResult =
  | { ok: true; sample: PierCastLmhofsSample }
  | { ok: false; diagnostic: PierCastLmhofsDiagnostic };

export function listPierCastLmhofsCycleCandidates(
  now: Date,
  lookbackHours = 18,
): Date[] {
  if (!Number.isFinite(now.getTime()) || lookbackHours < 0) return [];
  const latestCycle = new Date(now);
  latestCycle.setUTCMinutes(0, 0, 0);
  latestCycle.setUTCHours(Math.floor(latestCycle.getUTCHours() / 6) * 6);

  const candidates: Date[] = [];
  for (let offsetHours = 0; offsetHours <= lookbackHours; offsetHours += 6) {
    candidates.push(
      new Date(latestCycle.getTime() - offsetHours * 60 * 60 * 1000),
    );
  }
  return candidates;
}

export function buildPierCastLmhofsDatasetUrl(
  endpointTemplate: string,
  issuedAt: Date,
  forecastHour: number,
): string {
  if (
    !Number.isInteger(forecastHour) || forecastHour < 0 || forecastHour > 120
  ) {
    throw new Error(
      "LMHOFS forecast hour must be an integer from 0 through 120.",
    );
  }
  const year = String(issuedAt.getUTCFullYear());
  const month = String(issuedAt.getUTCMonth() + 1).padStart(2, "0");
  const day = String(issuedAt.getUTCDate()).padStart(2, "0");
  const cycle = String(issuedAt.getUTCHours()).padStart(2, "0");
  const dateStamp = `${year}${month}${day}`;
  const hour = String(forecastHour).padStart(3, "0");

  return endpointTemplate
    .replace("{YYYY}", year)
    .replace("{MM}", month)
    .replace("{DD}", day)
    .replace("{CC}", cycle)
    .replace("{YYYYMMDD}", dateStamp)
    .replace("{HHH}", hour);
}

export function buildPierCastLmhofsPointUrl(
  source: LmhofsSource,
  issuedAt: Date,
  forecastHour: number,
): string {
  const location = source.configuredLocation;
  const datasetUrl = buildPierCastLmhofsDatasetUrl(
    source.endpoint,
    issuedAt,
    forecastHour,
  );
  const projection =
    `Times[0:1:0],temp[0:1:0][${location.depthIndex}:1:${location.depthIndex}]` +
    `[${location.gridRow}:1:${location.gridRow}]` +
    `[${location.gridColumn}:1:${location.gridColumn}]`;
  return `${datasetUrl}.ascii?${encodeURIComponent(projection)}`;
}

export function parsePierCastLmhofsPointResponse(
  payload: string,
): { validAt: string; temperatureC: number } {
  const timeMatch = payload.match(
    /Times\[1\]\s*\n\s*"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?)"/,
  );
  const temperatureMatch = payload.match(
    /^\[0\]\[0\]\[0\],\s*([^\s]+)\s*$/m,
  );
  if (!timeMatch || !temperatureMatch) {
    throw new Error(
      "LMHOFS response omitted its exact valid time or point temperature.",
    );
  }

  const validDate = new Date(`${timeMatch[1]}Z`);
  const temperatureC = Number(temperatureMatch[1]);
  if (!Number.isFinite(validDate.getTime()) || !Number.isFinite(temperatureC)) {
    throw new Error(
      "LMHOFS response contained a non-finite time or temperature.",
    );
  }
  if (
    temperatureC < LMHOFS_MIN_PLAUSIBLE_TEMPERATURE_C ||
    temperatureC > LMHOFS_MAX_PLAUSIBLE_TEMPERATURE_C
  ) {
    throw new Error(
      "LMHOFS temperature fell outside the provider sanity range.",
    );
  }

  return {
    validAt: validDate.toISOString(),
    temperatureC,
  };
}

export async function fetchPierCastLmhofsBatch(
  options: FetchPierCastLmhofsBatchOptions = {},
): Promise<PierCastLmhofsBatch> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const clock = options.now ?? (() => new Date());
  const requestedAt = clock();
  const forecastHours = normalizeForecastHours(
    options.forecastHours ?? PIER_CAST_LMHOFS_FORECAST_HOURS,
  );
  const fullHorizonRequested = forecastHours.length === 121 &&
    forecastHours.every((hour, index) => hour === index);
  const citySources = getLmhofsCitySources();
  const maxAttempts = normalizeMaxAttempts(options.maxAttempts ?? 2);
  const discovery = await discoverLatestCompleteCycle({
    citySource: citySources[0],
    fetchImpl,
    requestedAt,
    requestTimeoutMs: options.requestTimeoutMs ?? 15_000,
    lookbackHours: options.discoveryLookbackHours ?? 18,
    maxAttempts,
  });

  if (!discovery.cycle) {
    return {
      status: "unavailable",
      issuedAt: null,
      fetchedAt: clock().toISOString(),
      cycleAgeHours: null,
      fullHorizonRequested,
      requestedForecastHours: forecastHours,
      cities: [],
      diagnostics: discovery.diagnostics,
    };
  }

  const tasks = citySources.flatMap((citySource) =>
    forecastHours.map((forecastHour) => () =>
      fetchPoint({
        citySource,
        issuedAt: new Date(discovery.cycle!.issuedAt),
        forecastHour,
        fetchImpl,
        requestTimeoutMs: options.requestTimeoutMs ?? 15_000,
        maxAttempts,
      })
    )
  );
  const results = await mapWithConcurrency(
    tasks,
    normalizeConcurrency(options.concurrency ?? 8),
  );
  const diagnostics = [
    ...discovery.diagnostics,
    ...results.flatMap((result) => result.ok ? [] : [result.diagnostic]),
  ];
  const successfulSamples = results.flatMap((result) =>
    result.ok ? [result.sample] : []
  );
  const cities = citySources.map(({ cityId, source }) => {
    const samples = successfulSamples
      .filter((sample) => sample.cityId === cityId)
      .sort((a, b) => a.forecastHour - b.forecastHour);
    const presentHours = new Set(samples.map((sample) => sample.forecastHour));
    const missingForecastHours = forecastHours.filter((hour) =>
      !presentHours.has(hour)
    );

    if (missingForecastHours.length > 0) {
      return {
        status: "unavailable",
        cityId,
        sourceId: source.sourceId,
        issuedAt: discovery.cycle!.issuedAt,
        requestedForecastHours: forecastHours,
        missingForecastHours,
        samples,
        reasonCodes: ["temperature_partial_horizon"],
      } as const;
    }
    return {
      status: "available",
      cityId,
      sourceId: source.sourceId,
      issuedAt: discovery.cycle!.issuedAt,
      requestedForecastHours: forecastHours,
      coverageStart: samples[0].validAt,
      coverageEnd: samples[samples.length - 1].validAt,
      samples,
      reasonCodes: [],
    } as const;
  });

  return {
    status: cities.every((city) => city.status === "available")
      ? "available"
      : "partial",
    issuedAt: discovery.cycle.issuedAt,
    fetchedAt: clock().toISOString(),
    cycleAgeHours: discovery.cycle.ageHours,
    fullHorizonRequested,
    requestedForecastHours: forecastHours,
    cities,
    diagnostics,
  };
}

async function discoverLatestCompleteCycle(input: {
  citySource: CitySource;
  fetchImpl: PierCastLmhofsFetch;
  requestedAt: Date;
  requestTimeoutMs: number;
  lookbackHours: number;
  maxAttempts: number;
}): Promise<{
  cycle: PierCastLmhofsCycle | null;
  diagnostics: PierCastLmhofsDiagnostic[];
}> {
  const diagnostics: PierCastLmhofsDiagnostic[] = [];
  for (
    const issuedAt of listPierCastLmhofsCycleCandidates(
      input.requestedAt,
      input.lookbackHours,
    )
  ) {
    const result = await fetchPoint({
      citySource: input.citySource,
      issuedAt,
      forecastHour: 120,
      fetchImpl: input.fetchImpl,
      requestTimeoutMs: input.requestTimeoutMs,
      maxAttempts: input.maxAttempts,
    });
    if (!result.ok) {
      diagnostics.push({
        ...result.diagnostic,
        code: result.diagnostic.code === "request_failed" &&
            result.diagnostic.httpStatus === 404
          ? "cycle_not_complete"
          : result.diagnostic.code,
      });
      continue;
    }

    const ageHours = (input.requestedAt.getTime() - issuedAt.getTime()) /
      (60 * 60 * 1000);
    const freshnessLimit = input.citySource.source.freshnessLimitHours;
    if (ageHours > freshnessLimit) {
      diagnostics.push({
        code: "cycle_stale",
        message: `Latest complete LMHOFS cycle is ${
          ageHours.toFixed(2)
        } hours old; limit is ${freshnessLimit}.`,
        sourceUrl: result.sample.sourceUrl,
      });
      return { cycle: null, diagnostics };
    }
    return {
      cycle: { issuedAt: issuedAt.toISOString(), ageHours },
      diagnostics,
    };
  }
  return { cycle: null, diagnostics };
}

async function fetchPoint(input: {
  citySource: CitySource;
  issuedAt: Date;
  forecastHour: number;
  fetchImpl: PierCastLmhofsFetch;
  requestTimeoutMs: number;
  maxAttempts: number;
}): Promise<PointFetchResult> {
  const { cityId, source } = input.citySource;
  const location = source.configuredLocation;
  const sourceUrl = buildPierCastLmhofsPointUrl(
    source,
    input.issuedAt,
    input.forecastHour,
  );
  for (let attempt = 1; attempt <= input.maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      input.requestTimeoutMs,
    );
    try {
      const response = await input.fetchImpl(sourceUrl, {
        headers: { Accept: "text/plain" },
        signal: controller.signal,
      });
      if (!response.ok) {
        const retryable = response.status === 429 || response.status >= 500;
        if (retryable && attempt < input.maxAttempts) continue;
        return {
          ok: false,
          diagnostic: {
            code: "request_failed",
            message: `LMHOFS request returned HTTP ${response.status}.`,
            cityId,
            forecastHour: input.forecastHour,
            sourceUrl,
            httpStatus: response.status,
            attempts: attempt,
          },
        };
      }

      let parsed: ReturnType<typeof parsePierCastLmhofsPointResponse>;
      try {
        parsed = parsePierCastLmhofsPointResponse(await response.text());
      } catch (error) {
        return {
          ok: false,
          diagnostic: {
            code: "invalid_provider_payload",
            message: error instanceof Error ? error.message : String(error),
            cityId,
            forecastHour: input.forecastHour,
            sourceUrl,
            attempts: attempt,
          },
        };
      }

      const expectedValidAt = new Date(
        input.issuedAt.getTime() + input.forecastHour * 60 * 60 * 1000,
      ).toISOString();
      if (parsed.validAt !== expectedValidAt) {
        return {
          ok: false,
          diagnostic: {
            code: "invalid_provider_payload",
            message:
              `LMHOFS valid time ${parsed.validAt} did not match expected ${expectedValidAt}.`,
            cityId,
            forecastHour: input.forecastHour,
            sourceUrl,
            attempts: attempt,
          },
        };
      }

      return {
        ok: true,
        sample: {
          cityId,
          sourceId: source.sourceId,
          productId: "NOAA_NOS_LMHOFS_REGULARGRID",
          issuedAt: input.issuedAt.toISOString(),
          forecastHour: input.forecastHour,
          validAt: parsed.validAt,
          temperatureC: parsed.temperatureC,
          rawUnit: "C",
          verticalSelection: "surface",
          depthIndex: 0,
          gridRow: location.gridRow,
          gridColumn: location.gridColumn,
          latitude: location.latitude,
          longitude: location.longitude,
          sourceUrl,
        },
      };
    } catch (error) {
      if (attempt >= input.maxAttempts) {
        return {
          ok: false,
          diagnostic: {
            code: "request_failed",
            message: error instanceof Error ? error.message : String(error),
            cityId,
            forecastHour: input.forecastHour,
            sourceUrl,
            attempts: attempt,
          },
        };
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error("Unreachable LMHOFS retry state.");
}

function getLmhofsCitySources(): CitySource[] {
  return PIER_CAST_CITY_PROFILES.map((city) => {
    const source = city.waterTemperatureSource;
    if (
      !source ||
      source.productId !== "NOAA_NOS_LMHOFS_REGULARGRID" ||
      !source.configuredLocation ||
      source.configuredLocation.gridCellStatus !== "candidate"
    ) {
      throw new Error(
        `PierCast city ${city.cityId} lacks a candidate LMHOFS cell.`,
      );
    }
    return {
      cityId: city.cityId,
      source: source as LmhofsSource,
    };
  });
}

function normalizeForecastHours(hours: readonly number[]): number[] {
  const normalized = [...new Set(hours)].sort((a, b) => a - b);
  if (
    normalized.length === 0 ||
    normalized.some((hour) => !Number.isInteger(hour) || hour < 0 || hour > 120)
  ) {
    throw new Error(
      "LMHOFS forecast hours must be unique integers from 0 through 120.",
    );
  }
  return normalized;
}

function normalizeConcurrency(concurrency: number): number {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 20) {
    throw new Error("LMHOFS concurrency must be an integer from 1 through 20.");
  }
  return concurrency;
}

function normalizeMaxAttempts(maxAttempts: number): number {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 3) {
    throw new Error("LMHOFS max attempts must be an integer from 1 through 3.");
  }
  return maxAttempts;
}

async function mapWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number,
): Promise<T[]> {
  const results = new Array<T>(tasks.length);
  let nextIndex = 0;
  async function worker(): Promise<void> {
    while (nextIndex < tasks.length) {
      const index = nextIndex++;
      results[index] = await tasks[index]();
    }
  }
  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, tasks.length) },
      () => worker(),
    ),
  );
  return results;
}
