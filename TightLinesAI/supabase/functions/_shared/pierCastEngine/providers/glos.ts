import { PIER_CAST_CITY_PROFILES } from "../config/cities.ts";
import type {
  PierCastCityId,
  PierCastCityTemperatureSource,
} from "../types.ts";
import {
  normalizePierCastGlosObservation,
  type PierCastGlosObservation,
} from "../validation/temperatureComparison.ts";
import type { PierCastLmhofsFetch } from "./lmhofs.ts";

const GLOS_TABLEDAP_ROOT = "https://seagull-erddap.glos.org/erddap/tabledap";

type ObservationConfig = NonNullable<
  PierCastCityTemperatureSource["validationObservation"]
>;

export type PierCastGlosObservationBatch =
  | {
    status: "available";
    cityId: PierCastCityId;
    datasetId: string;
    sourceUrl: string;
    requestedStart: string;
    requestedEnd: string;
    observations: PierCastGlosObservation[];
    usableObservations: Array<
      Extract<PierCastGlosObservation, { status: "available" }>
    >;
    rejectedCount: number;
    reasonCodes: [];
  }
  | {
    status: "unavailable";
    cityId: PierCastCityId;
    datasetId: string | null;
    sourceUrl: string | null;
    requestedStart: string;
    requestedEnd: string;
    observations: PierCastGlosObservation[];
    usableObservations: [];
    rejectedCount: number;
    reasonCodes: Array<
      | "validation_observation_not_configured"
      | "validation_observation_request_failed"
      | "validation_observation_payload_invalid"
      | "validation_observation_no_quality_passed_values"
    >;
  };

export function buildPierCastGlosObservationUrl(
  config: ObservationConfig,
  start: Date,
  end: Date,
): string {
  validateObservationWindow(start, end);
  const clauses = [
    `time,${config.temperatureVariable},${config.aggregateQualityVariable}`,
    `time>=${start.toISOString()}`,
    `time<=${end.toISOString()}`,
    'orderBy("time")',
  ];
  return `${GLOS_TABLEDAP_ROOT}/${config.datasetId}.csv?${
    clauses.map(encodeURIComponent).join("&")
  }`;
}

export function parsePierCastGlosCsv(
  payload: string,
  config: ObservationConfig,
): PierCastGlosObservation[] {
  const lines = payload.trim().split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error("GLOS response omitted CSV headers or units.");
  }
  const expectedHeaders = [
    "time",
    config.temperatureVariable,
    config.aggregateQualityVariable,
  ];
  if (lines[0] !== expectedHeaders.join(",")) {
    throw new Error(
      "GLOS response columns did not match the configured contract.",
    );
  }
  const units = lines[1].split(",");
  if (units[0] !== "UTC" || units[1] !== config.reportedUnit) {
    throw new Error(
      "GLOS response units did not match the configured contract.",
    );
  }

  return lines.slice(2).filter((line) => line.trim().length > 0).map((line) => {
    const values = line.split(",");
    if (values.length !== 3) {
      return normalizePierCastGlosObservation({
        datasetId: config.datasetId,
        observedAt: "invalid",
        value: Number.NaN,
        unit: config.reportedUnit,
        aggregateQualityFlag: null,
      });
    }
    return normalizePierCastGlosObservation({
      datasetId: config.datasetId,
      observedAt: values[0],
      value: Number(values[1]),
      unit: config.reportedUnit,
      aggregateQualityFlag: Number.isFinite(Number(values[2]))
        ? Number(values[2])
        : null,
    });
  });
}

export async function fetchPierCastGlosObservations(input: {
  cityId: PierCastCityId;
  start: Date;
  end: Date;
  fetchImpl?: PierCastLmhofsFetch;
  requestTimeoutMs?: number;
}): Promise<PierCastGlosObservationBatch> {
  validateObservationWindow(input.start, input.end);
  const requestedStart = input.start.toISOString();
  const requestedEnd = input.end.toISOString();
  const city = PIER_CAST_CITY_PROFILES.find((candidate) =>
    candidate.cityId === input.cityId
  );
  const config = city?.waterTemperatureSource?.validationObservation ?? null;
  if (!config) {
    return {
      status: "unavailable",
      cityId: input.cityId,
      datasetId: null,
      sourceUrl: null,
      requestedStart,
      requestedEnd,
      observations: [],
      usableObservations: [],
      rejectedCount: 0,
      reasonCodes: ["validation_observation_not_configured"],
    };
  }

  const sourceUrl = buildPierCastGlosObservationUrl(
    config,
    input.start,
    input.end,
  );
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    input.requestTimeoutMs ?? 20_000,
  );
  let response: Response;
  try {
    response = await (input.fetchImpl ?? fetch)(sourceUrl, {
      headers: { Accept: "text/csv" },
      signal: controller.signal,
    });
  } catch {
    return unavailableObservationBatch(
      input.cityId,
      config.datasetId,
      sourceUrl,
      requestedStart,
      requestedEnd,
      "validation_observation_request_failed",
    );
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    return unavailableObservationBatch(
      input.cityId,
      config.datasetId,
      sourceUrl,
      requestedStart,
      requestedEnd,
      "validation_observation_request_failed",
    );
  }

  let observations: PierCastGlosObservation[];
  try {
    observations = parsePierCastGlosCsv(await response.text(), config);
  } catch {
    return unavailableObservationBatch(
      input.cityId,
      config.datasetId,
      sourceUrl,
      requestedStart,
      requestedEnd,
      "validation_observation_payload_invalid",
    );
  }
  const usableObservations = observations.filter((
    observation,
  ): observation is Extract<PierCastGlosObservation, { status: "available" }> =>
    observation.status === "available"
  );
  if (usableObservations.length === 0) {
    return {
      status: "unavailable",
      cityId: input.cityId,
      datasetId: config.datasetId,
      sourceUrl,
      requestedStart,
      requestedEnd,
      observations,
      usableObservations: [],
      rejectedCount: observations.length,
      reasonCodes: ["validation_observation_no_quality_passed_values"],
    };
  }
  return {
    status: "available",
    cityId: input.cityId,
    datasetId: config.datasetId,
    sourceUrl,
    requestedStart,
    requestedEnd,
    observations,
    usableObservations,
    rejectedCount: observations.length - usableObservations.length,
    reasonCodes: [],
  };
}

function validateObservationWindow(start: Date, end: Date): void {
  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    end <= start ||
    end.getTime() - start.getTime() > 366 * 24 * 60 * 60 * 1000
  ) {
    throw new Error(
      "GLOS observation window must be valid and at most 366 days.",
    );
  }
}

function unavailableObservationBatch(
  cityId: PierCastCityId,
  datasetId: string,
  sourceUrl: string,
  requestedStart: string,
  requestedEnd: string,
  reason:
    | "validation_observation_request_failed"
    | "validation_observation_payload_invalid",
): PierCastGlosObservationBatch {
  return {
    status: "unavailable",
    cityId,
    datasetId,
    sourceUrl,
    requestedStart,
    requestedEnd,
    observations: [],
    usableObservations: [],
    rejectedCount: 0,
    reasonCodes: [reason],
  };
}
