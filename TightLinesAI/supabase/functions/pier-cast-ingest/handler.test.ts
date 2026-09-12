import { assertEquals } from "jsr:@std/assert";
import type { PierCastTemperatureIngestionOutcome } from "../_shared/pierCastEngine/index.ts";
import {
  type PierCastFieldTemperatureInput,
  validatePierCastFieldTemperatureObservation,
} from "../_shared/pierCastEngine/index.ts";
import { completeLmhofsBatch } from "../_shared/pierCastEngine/tests/fixtures/lmhofs.ts";
import { createPierCastIngestHandler } from "./handler.ts";

const SECRET = "pier-cast-test-secret";

function request(secret: string | null = SECRET, method = "POST"): Request {
  const headers = new Headers();
  if (secret) headers.set("x-pier-cast-internal-key", secret);
  return new Request("https://example.test/functions/v1/pier-cast-ingest", {
    method,
    headers,
  });
}

function liveOutcome(): PierCastTemperatureIngestionOutcome {
  return {
    status: "live_committed",
    source: "live_lmhofs",
    batch: completeLmhofsBatch(),
    fallbackUsed: false,
    diagnostics: [],
  };
}

Deno.test("PierCast ingestion authenticates before doing work", async () => {
  let calls = 0;
  let observationCalls = 0;
  const handler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () => {
      calls += 1;
      return Promise.resolve(liveOutcome());
    },
    ingestObservations: () => {
      observationCalls += 1;
      return Promise.reject(new Error("should not run"));
    },
  });

  assertEquals((await handler(request(null))).status, 403);
  assertEquals((await handler(request("wrong-secret-value"))).status, 403);
  assertEquals((await handler(request(SECRET, "GET"))).status, 405);
  assertEquals(calls, 0);
  assertEquals(observationCalls, 0);
});

Deno.test("PierCast ingestion reports private observation archival without affecting the live outcome", async () => {
  const handler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () => Promise.resolve(liveOutcome()),
    ingestObservations: () =>
      Promise.resolve({
        status: "partial",
        requestedSourceCount: 3,
        successfulSourceCount: 2,
        committedRecordCount: 20,
        usableRecordCount: 15,
        rejectedRecordCount: 5,
        diagnostics: [],
        sources: [],
      }),
  });

  const response = await handler(request());
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(body.status, "live_committed");
  assertEquals(body.calibrationObservations.status, "partial");
  assertEquals(body.calibrationObservations.usableRecordCount, 15);
});

Deno.test("authenticated field-temperature operation validates and privately archives usable and rejected evidence", async () => {
  let regularIngestCalls = 0;
  let archivedRecords = 0;
  const now = new Date("2026-09-11T18:00:00.000Z");
  const valid: PierCastFieldTemperatureInput = {
    sourceId: "manistee_north_pier__surface_logger_v1",
    cityId: "manistee_mi",
    structureId: "manistee_north_pier",
    observedAt: "2026-09-11T17:45:00.000Z",
    latitude: 44.25195,
    longitude: -86.34695,
    depthM: 0.5,
    temperatureC: 17.25,
    instrumentId: "logger-001",
    instrumentModel: "documented-test-logger",
    instrumentAccuracyC: 0.2,
    calibrationCheckedAt: "2026-09-11T16:00:00.000Z",
    calibrationReferenceC: 15,
    calibrationObservedC: 15.1,
    qualityFlag: "good",
    fieldSessionId: "manistee-2026-deployment-01",
  };
  const handler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () => {
      regularIngestCalls += 1;
      return Promise.resolve(liveOutcome());
    },
    validateFieldObservation: (input) =>
      validatePierCastFieldTemperatureObservation(input, now),
    archiveFieldObservations: (records) => {
      archivedRecords = records.length;
      return Promise.resolve(records.length);
    },
  });
  const headers = new Headers({
    "content-type": "application/json",
    "x-pier-cast-internal-key": SECRET,
    "x-pier-cast-operation": "field-temperature",
  });
  const response = await handler(
    new Request(
      "https://example.test/functions/v1/pier-cast-ingest",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          records: [valid, { ...valid, qualityFlag: "bad" }],
        }),
      },
    ),
  );
  assertEquals(response.status, 200);
  assertEquals(await response.json(), {
    status: "committed",
    committedRecordCount: 2,
    usableRecordCount: 1,
    rejectedRecordCount: 1,
    protocolVersion: "piercast-field-temperature-v1",
  });
  assertEquals(archivedRecords, 2);
  assertEquals(regularIngestCalls, 0);
});

Deno.test("field-temperature operation rejects malformed and oversized batches", async () => {
  const handler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () => Promise.resolve(liveOutcome()),
    validateFieldObservation: (input) =>
      validatePierCastFieldTemperatureObservation(input),
    archiveFieldObservations: (records) => Promise.resolve(records.length),
  });
  const baseHeaders = {
    "content-type": "application/json",
    "x-pier-cast-internal-key": SECRET,
    "x-pier-cast-operation": "field-temperature",
  };
  const malformed = await handler(
    new Request(
      "https://example.test/functions/v1/pier-cast-ingest",
      { method: "POST", headers: baseHeaders, body: "{" },
    ),
  );
  assertEquals(malformed.status, 400);

  const nullBody = await handler(
    new Request(
      "https://example.test/functions/v1/pier-cast-ingest",
      { method: "POST", headers: baseHeaders, body: "null" },
    ),
  );
  assertEquals(nullBody.status, 400);

  const oversized = await handler(
    new Request(
      "https://example.test/functions/v1/pier-cast-ingest",
      {
        method: "POST",
        headers: { ...baseHeaders, "content-length": "1000001" },
        body: JSON.stringify({ records: [{}] }),
      },
    ),
  );
  assertEquals(oversized.status, 413);

  const actualOversized = await handler(
    new Request(
      "https://example.test/functions/v1/pier-cast-ingest",
      {
        method: "POST",
        headers: baseHeaders,
        body: JSON.stringify({ records: [], padding: "x".repeat(1_000_000) }),
      },
    ),
  );
  assertEquals(actualOversized.status, 413);
});

Deno.test("PierCast ingestion rejects unknown authenticated operations", async () => {
  let calls = 0;
  const handler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () => {
      calls += 1;
      return Promise.resolve(liveOutcome());
    },
  });
  const headers = new Headers({
    "x-pier-cast-internal-key": SECRET,
    "x-pier-cast-operation": "field-temperatures",
  });
  const response = await handler(
    new Request("https://example.test/functions/v1/pier-cast-ingest", {
      method: "POST",
      headers,
    }),
  );
  assertEquals(response.status, 400);
  assertEquals(calls, 0);
});

Deno.test("observation archive failure is nonfatal and explicitly diagnosed", async () => {
  const handler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () => Promise.resolve(liveOutcome()),
    ingestObservations: () => Promise.reject(new Error("GLOS unavailable")),
  });

  const response = await handler(request());
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(body.status, "live_committed");
  assertEquals(body.calibrationObservations.status, "unavailable");
  assertEquals(body.calibrationObservations.diagnostics, [
    "observation_ingestion_failed:GLOS unavailable",
  ]);
});

Deno.test("PierCast ingestion fails closed when its secret is absent", async () => {
  const handler = createPierCastIngestHandler({
    internalSecret: null,
    ingest: () => Promise.resolve(liveOutcome()),
  });
  const response = await handler(request());
  assertEquals(response.status, 500);
  assertEquals((await response.json()).error, "pier_cast_ingest_misconfigured");
});

Deno.test("PierCast ingestion reports complete live and cached outcomes", async () => {
  const liveHandler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () => Promise.resolve(liveOutcome()),
  });
  const liveResponse = await liveHandler(request());
  const liveBody = await liveResponse.json();
  assertEquals(liveResponse.status, 200);
  assertEquals(liveBody.status, "live_committed");
  assertEquals(liveBody.cityCount, 5);
  assertEquals(liveBody.sampleCount, 605);
  assertEquals(liveBody.fallbackUsed, false);

  const cachedHandler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () =>
      Promise.resolve({
        status: "cached_fallback",
        source: "fresh_archived_complete_cycle",
        batch: completeLmhofsBatch(),
        fallbackUsed: true,
        diagnostics: ["live_unavailable"],
      }),
  });
  const cachedResponse = await cachedHandler(request());
  const cachedBody = await cachedResponse.json();
  assertEquals(cachedResponse.status, 200);
  assertEquals(cachedBody.status, "cached_fallback");
  assertEquals(cachedBody.fallbackUsed, true);
});

Deno.test("PierCast ingestion commits one private shadow forecast after a usable cycle", async () => {
  let archivedSource = "";
  const handler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () => Promise.resolve(liveOutcome()),
    archiveShadowForecast: (outcome) => {
      archivedSource = outcome.source;
      return Promise.resolve({
        status: "committed",
        runId: "850753b5-83bf-4a2f-b28f-3ec866ee6f6d",
        generatedAt: "2026-09-10T00:35:00.000Z",
        forecastCount: 100,
        formulaVersion: "seasonal-opportunity-bounded-temperature-v2",
      });
    },
  });

  const response = await handler(request());
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(archivedSource, "live_lmhofs");
  assertEquals(body.shadowForecast.status, "committed");
  assertEquals(body.shadowForecast.forecastCount, 100);
  assertEquals(
    body.shadowForecast.formulaVersion,
    "seasonal-opportunity-bounded-temperature-v2",
  );
});

Deno.test("shadow archival failure is diagnosed without losing temperature ingestion", async () => {
  const handler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () => Promise.resolve(liveOutcome()),
    archiveShadowForecast: () =>
      Promise.reject(new Error("ledger unavailable")),
  });

  const response = await handler(request());
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(body.status, "live_committed");
  assertEquals(body.shadowForecast.status, "unavailable");
  assertEquals(body.shadowForecast.diagnostics, [
    "shadow_forecast_archive_failed:ledger unavailable",
  ]);
});

Deno.test("PierCast ingestion commits the immutable daily score snapshot only from a live cycle", async () => {
  let dailySnapshotCalls = 0;
  const liveHandler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () => Promise.resolve(liveOutcome()),
    archiveDailyScoreSnapshot: (outcome) => {
      dailySnapshotCalls += 1;
      assertEquals(outcome.status, "live_committed");
      return Promise.resolve({
        status: "committed",
        lakeDate: "2026-09-10",
        setAt: "2026-09-10T00:36:00.000Z",
        publishAt: "2026-09-10T05:00:00.000Z",
        cityCount: 5,
      });
    },
  });

  const liveResponse = await liveHandler(request());
  const liveBody = await liveResponse.json();
  assertEquals(liveResponse.status, 200);
  assertEquals(liveBody.dailyScoreSnapshot.status, "committed");
  assertEquals(liveBody.dailyScoreSnapshot.lakeDate, "2026-09-10");

  const cachedHandler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () =>
      Promise.resolve({
        status: "cached_fallback",
        source: "fresh_archived_complete_cycle",
        batch: completeLmhofsBatch(),
        fallbackUsed: true,
        diagnostics: ["live_unavailable"],
      }),
    archiveDailyScoreSnapshot: () => {
      dailySnapshotCalls += 1;
      throw new Error("cached data must never set the daily score");
    },
  });
  const cachedBody = await (await cachedHandler(request())).json();
  assertEquals(cachedBody.dailyScoreSnapshot, null);
  assertEquals(dailySnapshotCalls, 1);
});

Deno.test("daily score snapshot failure is diagnosed without losing live conditions", async () => {
  const handler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () => Promise.resolve(liveOutcome()),
    archiveDailyScoreSnapshot: () =>
      Promise.reject(new Error("snapshot ledger unavailable")),
  });

  const response = await handler(request());
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(body.status, "live_committed");
  assertEquals(body.dailyScoreSnapshot.status, "unavailable");
  assertEquals(body.dailyScoreSnapshot.diagnostics, [
    "daily_score_snapshot_archive_failed:snapshot ledger unavailable",
  ]);
});

Deno.test("PierCast ingestion returns 503 when no safe cycle exists", async () => {
  const handler = createPierCastIngestHandler({
    internalSecret: SECRET,
    ingest: () =>
      Promise.resolve({
        status: "unavailable",
        source: null,
        batch: null,
        fallbackUsed: false,
        diagnostics: ["fresh_complete_archive_missing"],
      }),
  });
  const response = await handler(request());
  assertEquals(response.status, 503);
  const body = await response.json();
  assertEquals(body.status, "unavailable");
  assertEquals(body.shadowForecast, null);
  assertEquals(body.dailyScoreSnapshot, null);
});
