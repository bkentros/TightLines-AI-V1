import {
  PIER_CAST_CALIBRATION_OBSERVATION_SOURCES,
  type PierCastCalibrationObservationSource,
} from "../config/representationCalibration.ts";
import type { PierCastArchiveClient } from "./lmhofsArchive.ts";
import type { PierCastLmhofsFetch } from "../providers/lmhofs.ts";

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
      if (aggregateQualityFlag !== 1) {
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
