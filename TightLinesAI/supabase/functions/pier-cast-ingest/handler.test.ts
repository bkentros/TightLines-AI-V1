import { assertEquals } from "jsr:@std/assert";
import type { PierCastTemperatureIngestionOutcome } from "../_shared/pierCastEngine/index.ts";
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
  assertEquals((await response.json()).status, "unavailable");
});
