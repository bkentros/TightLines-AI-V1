import {
  PIER_CAST_CALIBRATION_OBSERVATION_SOURCES,
  type PierCastCalibrationObservationSource,
} from "../config/representationCalibration.ts";
import type { PierCastArchiveClient } from "./lmhofsArchive.ts";
import type { PierCastLmhofsFetch } from "../providers/lmhofs.ts";
import type { PierCastObservedTemperatureMapResponseV1 } from "../../../../../lib/pierCastConditionsV4.ts";

const GLOS_TABLEDAP_ROOT = "https://seagull-erddap.glos.org/erddap/tabledap";
const LOOKBACK_DAYS = 15;
const COMMIT_CHUNK_SIZE = 1000;

export type PierCastArchivedObservationRecord = {
  cityId: PierCastCalibrationObservationSource["cityId"];
  datasetId: string;
  temperatureVariable: string;
  observedAt: string;
  originalValue: number | null;
  originalUnit: "K";
  aggregateQualityFlag: number | null;
  temperatureC: number | null;
  recordStatus: "usable" | "rejected";
  rejectionReason:
    | "quality_not_good"
    | "missing_value"
    | "temperature_out_of_range"
    | null;
  sourceUrl: string;
  fetchedAt: string;
};

export type PierCastObservationIngestionSummary = {
  status: "complete" | "partial" | "unavailable";
  requestedSourceCount: number;
  successfulSourceCount: number;
  committedRecordCount: number;
  usableRecordCount: number;
  rejectedRecordCount: number;
  diagnostics: string[];
  sources: Array<{
    cityId: PierCastCalibrationObservationSource["cityId"];
    datasetId: string;
    status: "committed" | "unavailable";
    recordCount: number;
    usableCount: number;
    rejectedCount: number;
    diagnostic: string | null;
  }>;
};

export function buildPierCastCalibrationObservationUrl(
  source: PierCastCalibrationObservationSource,
  start: Date,
  end: Date,
): string {
  if (
    !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) ||
    end <= start
  ) {
    throw new Error("PierCast observation archive window is invalid.");
  }
  const clauses = [
    `time,${source.temperatureVariable},${source.aggregateQualityVariable}`,
    `time>=${start.toISOString()}`,
    `time<=${end.toISOString()}`,
    'orderBy("time")',
  ];
  return `${GLOS_TABLEDAP_ROOT}/${source.datasetId}.csv?${
    clauses.map(encodeURIComponent).join("&")
  }`;
}

export function parsePierCastCalibrationObservationCsv(input: {
  payload: string;
  source: PierCastCalibrationObservationSource;
  sourceUrl: string;
  fetchedAt: string;
}): PierCastArchivedObservationRecord[] {
  const lines = input.payload.trim().split(/\r?\n/);
  const expected = [
    "time",
    input.source.temperatureVariable,
    input.source.aggregateQualityVariable,
  ];
  if (lines.length < 2 || lines[0] !== expected.join(",")) {
    throw new Error("GLOS observation archive columns changed.");
  }
  const units = lines[1].split(",");
  if (units[0] !== "UTC" || units[1] !== input.source.reportedUnit) {
    throw new Error("GLOS observation archive units changed.");
  }
  return lines.slice(2).filter((line) => line.trim()).map((line) => {
    const values = line.split(",");
    if (values.length !== 3) {
      throw new Error("GLOS observation archive row is malformed.");
    }
    const observedDate = new Date(values[0]);
    if (!Number.isFinite(observedDate.getTime())) {
      throw new Error("GLOS observation archive row is malformed.");
    }
    const raw = values[1].trim() === "" ? Number.NaN : Number(values[1]);
    const originalValue = Number.isFinite(raw) ? raw : null;
    const quality = values[2].trim() === "" ? Number.NaN : Number(values[2]);
    const aggregateQualityFlag = Number.isFinite(quality) ? quality : null;
    if (
      aggregateQualityFlag !== null &&
      ![1, 2, 3, 4, 9].includes(aggregateQualityFlag)
    ) {
      throw new Error("GLOS observation archive quality flag changed.");
    }
    let temperatureC: number | null = null;
    let recordStatus: PierCastArchivedObservationRecord["recordStatus"] =
      "rejected";
    let rejectionReason: PierCastArchivedObservationRecord["rejectionReason"] =
      "missing_value";
    if (originalValue !== null && originalValue > -900) {
      if (
        aggregateQualityFlag !== null && aggregateQualityFlag !== 1
      ) {
        rejectionReason = "quality_not_good";
      } else {
        const converted = originalValue - 273.15;
        if (converted >= -2 && converted <= 40) {
          temperatureC = converted;
          recordStatus = "usable";
          rejectionReason = null;
        } else {
          rejectionReason = "temperature_out_of_range";
        }
      }
    }
    return {
      cityId: input.source.cityId,
      datasetId: input.source.datasetId,
      temperatureVariable: input.source.temperatureVariable,
      observedAt: observedDate.toISOString(),
      originalValue,
      originalUnit: input.source.reportedUnit,
      aggregateQualityFlag,
      temperatureC,
      recordStatus,
      rejectionReason,
      sourceUrl: input.sourceUrl,
      fetchedAt: input.fetchedAt,
    };
  });
}

type PierCastObservedTemperatureArchiveRow = {
  dataset_id: unknown;
  observed_at: unknown;
  original_value: unknown;
  original_unit: unknown;
  aggregate_quality_flag: unknown;
  temperature_c: unknown;
  temperature_variable: unknown;
  source_url: unknown;
  fetched_at: unknown;
};

const OBSERVATION_FRESH_HOURS = 2;
const OBSERVATION_AGING_HOURS = 12;
const OBSERVATION_MAX_AGE_DAYS = 30;

export async function readPierCastObservedTemperatureMap(
  database: PierCastArchiveClient,
  now = new Date(),
): Promise<PierCastObservedTemperatureMapResponseV1> {
  if (!Number.isFinite(now.getTime())) {
    throw new Error("PierCast observation read time is invalid.");
  }
  const { data, error } = await database.rpc(
    "read_pier_cast_observed_temperature_map",
    {
      p_not_before: new Date(
        now.getTime() - OBSERVATION_MAX_AGE_DAYS * 86400_000,
      ).toISOString(),
      p_not_after: now.toISOString(),
    },
  );
  if (error) {
    throw new Error(
      error.message?.trim() || "PierCast observation archive read failed.",
    );
  }

  const rows = Array.isArray(data) ? data : [];
  const rowByDataset = new Map<string, PierCastObservedTemperatureArchiveRow>();
  const diagnostics: Array<{
    datasetId: string | null;
    code: string;
    message: string;
  }> = [];
  for (const candidate of rows) {
    const row = candidate as PierCastObservedTemperatureArchiveRow;
    if (typeof row?.dataset_id !== "string") {
      diagnostics.push({
        datasetId: null,
        code: "invalid_archive_row",
        message: "A station archive row was omitted because its identity was invalid.",
      });
      continue;
    }
    rowByDataset.set(row.dataset_id, row);
  }

  const stations = PIER_CAST_CALIBRATION_OBSERVATION_SOURCES.flatMap((source) => {
    const row = rowByDataset.get(source.datasetId);
    if (!row) {
      diagnostics.push({
        datasetId: source.datasetId,
        code: "no_recent_qualified_reading",
        message: `${source.displayName} has no qualified reading from the last 30 days.`,
      });
      return [];
    }
    const observedAt = isoDate(row.observed_at);
    const fetchedAt = isoDate(row.fetched_at);
    const temperatureC = finiteNumber(row.temperature_c);
    const reportedValue = finiteNumber(row.original_value);
    const latitude = finiteNumber(source.latitude);
    const longitude = finiteNumber(source.longitude);
    const flag = nullableQualityFlag(row.aggregate_quality_flag);
    const sourceUrl = trustedObservationSourceUrl(row.source_url);
    if (
      !observedAt || !fetchedAt || temperatureC === null ||
      reportedValue === null || latitude === null || longitude === null ||
      row.original_unit !== source.reportedUnit ||
      row.temperature_variable !== source.temperatureVariable ||
      !sourceUrl || flag === false || temperatureC < -2 ||
      temperatureC > 40 ||
      Math.abs(reportedValue - 273.15 - temperatureC) > 0.05
    ) {
      diagnostics.push({
        datasetId: source.datasetId,
        code: "invalid_archive_row",
        message: `${source.displayName} was omitted because its archived reading failed the public contract.`,
      });
      return [];
    }
    const ageHours = Math.max(0, (now.getTime() - Date.parse(observedAt)) / 3_600_000);
    const freshness = ageHours <= OBSERVATION_FRESH_HOURS
      ? "fresh" as const
      : ageHours <= OBSERVATION_AGING_HOURS
      ? "aging" as const
      : "stale" as const;
    return [{
      readingId: `${source.datasetId}:${observedAt}`,
      stationId: source.stationId,
      datasetId: source.datasetId,
      displayName: source.displayName,
      provider: source.provider,
      latitude,
      longitude,
      observedAt,
      temperatureC,
      reportedValue,
      reportedUnit: source.reportedUnit,
      temperatureVariable: source.temperatureVariable,
      measurementDepthM: source.measurementDepthM,
      quality: flag === 1 ? "passed" as const : "not_evaluated" as const,
      qualityFlag: flag,
      freshness,
      sourceUrl,
    }];
  });
  const newestFetchTime = rows.reduce((newest, row) => {
    const fetchedAt = Date.parse(String((row as PierCastObservedTemperatureArchiveRow).fetched_at));
    return Number.isFinite(fetchedAt) ? Math.max(newest, fetchedAt) : newest;
  }, Number.NEGATIVE_INFINITY);
  const cacheStatus = Number.isFinite(newestFetchTime) &&
      now.getTime() - newestFetchTime <= OBSERVATION_AGING_HOURS * 3_600_000
    ? "fresh" as const
    : "stale" as const;
  return {
    schemaVersion: "piercast-observed-temperature-map-v1",
    generatedAt: now.toISOString(),
    stations,
    cacheStatus,
    disclosure:
      "Observed points are timestamped station readings at a stated or unknown sensor depth. They are not a continuous lake surface, pier thermometer, harbor reading, catch forecast, or ranking input.",
    diagnostics,
  };
}

function isoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

function finiteNumber(value: unknown): number | null {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function nullableQualityFlag(value: unknown): 1 | null | false {
  if (value === null || value === undefined || value === "") return null;
  return Number(value) === 1 ? 1 : false;
}

function trustedObservationSourceUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
        url.hostname === "seagull-erddap.glos.org"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export async function ingestPierCastCalibrationObservations(input: {
  database: PierCastArchiveClient;
  now?: Date;
  fetchImpl?: PierCastLmhofsFetch;
  sources?: readonly PierCastCalibrationObservationSource[];
  lookbackDays?: number;
}): Promise<PierCastObservationIngestionSummary> {
  const now = input.now ?? new Date();
  const lookbackDays = input.lookbackDays ?? LOOKBACK_DAYS;
  if (
    !Number.isFinite(now.getTime()) || !Number.isInteger(lookbackDays) ||
    lookbackDays < 1 || lookbackDays > 366
  ) {
    throw new Error(
      "PierCast observation lookback must be 1 through 366 days.",
    );
  }
  const sources = [
    ...(input.sources ?? PIER_CAST_CALIBRATION_OBSERVATION_SOURCES),
  ];
  const start = new Date(now.getTime() - lookbackDays * 86400_000);
  const fetchedAt = now.toISOString();
  const fetchImpl = input.fetchImpl ?? fetch;
  const summaries = await Promise.all(sources.map(async (source) => {
    const sourceUrl = buildPierCastCalibrationObservationUrl(
      source,
      start,
      now,
    );
    let response: Response;
    try {
      response = await fetchImpl(sourceUrl, {
        headers: { Accept: "text/csv" },
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const records = parsePierCastCalibrationObservationCsv({
        payload: await response.text(),
        source,
        sourceUrl,
        fetchedAt,
      });
      for (let index = 0; index < records.length; index += COMMIT_CHUNK_SIZE) {
        const { error } = await input.database.rpc(
          "commit_pier_cast_temperature_observations",
          {
            p_records: records.slice(index, index + COMMIT_CHUNK_SIZE),
          },
        );
        if (error) {
          throw new Error(
            error.message?.trim() || "observation archive commit failed",
          );
        }
      }
      const usableCount = records.filter((record) =>
        record.recordStatus === "usable"
      ).length;
      return {
        cityId: source.cityId,
        datasetId: source.datasetId,
        status: "committed" as const,
        recordCount: records.length,
        usableCount,
        rejectedCount: records.length - usableCount,
        diagnostic: null,
      };
    } catch (error) {
      return {
        cityId: source.cityId,
        datasetId: source.datasetId,
        status: "unavailable" as const,
        recordCount: 0,
        usableCount: 0,
        rejectedCount: 0,
        diagnostic: error instanceof Error ? error.message : String(error),
      };
    }
  }));
  const successfulSourceCount =
    summaries.filter((summary) => summary.status === "committed").length;
  return {
    status: successfulSourceCount === sources.length
      ? "complete"
      : successfulSourceCount > 0
      ? "partial"
      : "unavailable",
    requestedSourceCount: sources.length,
    successfulSourceCount,
    committedRecordCount: summaries.reduce(
      (sum, summary) => sum + summary.recordCount,
      0,
    ),
    usableRecordCount: summaries.reduce(
      (sum, summary) => sum + summary.usableCount,
      0,
    ),
    rejectedRecordCount: summaries.reduce(
      (sum, summary) => sum + summary.rejectedCount,
      0,
    ),
    diagnostics: [],
    sources: summaries,
  };
}
