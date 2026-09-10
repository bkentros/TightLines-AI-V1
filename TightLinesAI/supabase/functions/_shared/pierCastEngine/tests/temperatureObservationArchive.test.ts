import { assertEquals, assertThrows } from "jsr:@std/assert";
import {
  buildPierCastCalibrationObservationUrl,
  ingestPierCastCalibrationObservations,
  parsePierCastCalibrationObservationCsv,
  type PierCastArchiveClient,
  type PierCastCalibrationObservationSource,
} from "../index.ts";

const SOURCE = {
  cityId: "grand_haven_mi",
  provider: "GLOS Seagull ERDDAP",
  datasetId: "obs_671",
  temperatureVariable: "sea_water_temperature_1",
  aggregateQualityVariable: "sea_water_temperature_1_aggregate_test",
  reportedUnit: "K",
  role: "configured",
  limitation: "test fixture",
} as const satisfies PierCastCalibrationObservationSource;

const HEADER =
  "time,sea_water_temperature_1,sea_water_temperature_1_aggregate_test\nUTC,K,1";

Deno.test("observation archive preserves raw QC evidence and only converts flag 1", () => {
  const records = parsePierCastCalibrationObservationCsv({
    payload:
      `${HEADER}\n2026-09-09T12:00:00Z,295.15,1\n2026-09-09T12:10:00Z,19.1,4\n2026-09-09T12:20:00Z,NaN,9\n2026-09-09T12:30:00Z,350,1`,
    source: SOURCE,
    sourceUrl: "https://example.test/obs.csv",
    fetchedAt: "2026-09-10T00:00:00.000Z",
  });

  assertEquals(
    records.map((record) => ({
      originalValue: record.originalValue,
      flag: record.aggregateQualityFlag,
      temperatureC: record.temperatureC,
      status: record.recordStatus,
      reason: record.rejectionReason,
    })),
    [
      {
        originalValue: 295.15,
        flag: 1,
        temperatureC: 22,
        status: "usable",
        reason: null,
      },
      {
        originalValue: 19.1,
        flag: 4,
        temperatureC: null,
        status: "rejected",
        reason: "quality_not_good",
      },
      {
        originalValue: null,
        flag: 9,
        temperatureC: null,
        status: "rejected",
        reason: "missing_value",
      },
      {
        originalValue: 350,
        flag: 1,
        temperatureC: null,
        status: "rejected",
        reason: "temperature_out_of_range",
      },
    ],
  );
});

Deno.test("observation archive rejects changed columns, units, and QC vocabulary", () => {
  const base = {
    source: SOURCE,
    sourceUrl: "https://example.test/obs.csv",
    fetchedAt: "2026-09-10T00:00:00.000Z",
  };
  assertThrows(
    () =>
      parsePierCastCalibrationObservationCsv({
        ...base,
        payload: "time,wrong,flag\nUTC,K,1\n2026-09-09T12:00:00Z,295.15,1",
      }),
  );
  assertThrows(
    () =>
      parsePierCastCalibrationObservationCsv({
        ...base,
        payload:
          "time,sea_water_temperature_1,sea_water_temperature_1_aggregate_test\nUTC,degree_C,1\n2026-09-09T12:00:00Z,22,1",
      }),
  );
  assertThrows(
    () =>
      parsePierCastCalibrationObservationCsv({
        ...base,
        payload: `${HEADER}\n2026-09-09T12:00:00Z,295.15,7`,
      }),
  );
});

Deno.test("observation ingestion uses an exact bounded query and commits normalized records", async () => {
  const calls: Array<
    { functionName: string; arguments_: Record<string, unknown> }
  > = [];
  const database: PierCastArchiveClient = {
    rpc: (functionName, arguments_) => {
      calls.push({ functionName, arguments_ });
      return Promise.resolve({ data: { status: "committed" }, error: null });
    },
  };
  let requestedUrl = "";
  const now = new Date("2026-09-10T00:00:00.000Z");
  const summary = await ingestPierCastCalibrationObservations({
    database,
    now,
    lookbackDays: 1,
    sources: [SOURCE],
    fetchImpl: (input) => {
      requestedUrl = String(input);
      return Promise.resolve(
        new Response(
          `${HEADER}\n2026-09-09T12:00:00Z,295.15,1\n2026-09-09T12:10:00Z,19.1,4`,
          { status: 200 },
        ),
      );
    },
  });

  assertEquals(
    requestedUrl,
    buildPierCastCalibrationObservationUrl(
      SOURCE,
      new Date("2026-09-09T00:00:00.000Z"),
      now,
    ),
  );
  assertEquals(calls.length, 1);
  assertEquals(
    calls[0].functionName,
    "commit_pier_cast_temperature_observations",
  );
  assertEquals((calls[0].arguments_.p_records as unknown[]).length, 2);
  assertEquals(summary.status, "complete");
  assertEquals(summary.committedRecordCount, 2);
  assertEquals(summary.usableRecordCount, 1);
  assertEquals(summary.rejectedRecordCount, 1);
  assertEquals(summary.diagnostics, []);
});

Deno.test("observation ingestion isolates an unavailable source", async () => {
  const database: PierCastArchiveClient = {
    rpc: () => {
      throw new Error("database should not be called");
    },
  };
  const summary = await ingestPierCastCalibrationObservations({
    database,
    sources: [SOURCE],
    fetchImpl: () =>
      Promise.resolve(new Response("unavailable", { status: 503 })),
  });

  assertEquals(summary.status, "unavailable");
  assertEquals(summary.successfulSourceCount, 0);
  assertEquals(summary.sources[0].diagnostic, "HTTP 503");
});
