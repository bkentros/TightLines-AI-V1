import { assertEquals } from "jsr:@std/assert";
import {
  ingestPierCastTemperatureCycle,
  type PierCastArchiveClient,
} from "../index.ts";
import {
  completeLmhofsBatch,
  unavailableLmhofsBatch,
} from "./fixtures/lmhofs.ts";

const unusedDatabase: PierCastArchiveClient = {
  rpc: () => {
    throw new Error("unexpected database call");
  },
};

Deno.test("temperature ingestion commits a complete live cycle before fallback", async () => {
  let archiveCalls = 0;
  let fallbackCalls = 0;
  const outcome = await ingestPierCastTemperatureCycle({
    database: unusedDatabase,
    engineVersion: "test",
    now: new Date("2026-09-10T00:45:00Z"),
    operations: {
      fetchLive: () => Promise.resolve(completeLmhofsBatch()),
      archiveLive: () => {
        archiveCalls += 1;
        return Promise.resolve();
      },
      readFreshArchive: () => {
        fallbackCalls += 1;
        return Promise.resolve(null);
      },
    },
  });

  assertEquals(outcome.status, "live_committed");
  assertEquals(outcome.source, "live_lmhofs");
  assertEquals(outcome.fallbackUsed, false);
  assertEquals(archiveCalls, 1);
  assertEquals(fallbackCalls, 0);
});

Deno.test("temperature ingestion uses one fresh complete archived cycle after live failure", async () => {
  const outcome = await ingestPierCastTemperatureCycle({
    database: unusedDatabase,
    engineVersion: "test",
    operations: {
      fetchLive: () => Promise.resolve(unavailableLmhofsBatch()),
      readFreshArchive: () => Promise.resolve(completeLmhofsBatch()),
    },
  });

  assertEquals(outcome.status, "cached_fallback");
  assertEquals(outcome.source, "fresh_archived_complete_cycle");
  assertEquals(outcome.fallbackUsed, true);
  assertEquals(outcome.batch?.cities.length, 5);
});

Deno.test("temperature ingestion uses the archive when the live provider throws", async () => {
  const outcome = await ingestPierCastTemperatureCycle({
    database: unusedDatabase,
    engineVersion: "test",
    operations: {
      fetchLive: () => Promise.reject(new Error("provider exception")),
      readFreshArchive: () => Promise.resolve(completeLmhofsBatch()),
    },
  });

  assertEquals(outcome.status, "cached_fallback");
  assertEquals(outcome.source, "fresh_archived_complete_cycle");
  assertEquals(
    outcome.diagnostics.includes("live_fetch_failed:provider exception"),
    true,
  );
});

Deno.test("temperature ingestion returns unavailable after live and archive fail", async () => {
  const outcome = await ingestPierCastTemperatureCycle({
    database: unusedDatabase,
    engineVersion: "test",
    operations: {
      fetchLive: () => Promise.resolve(unavailableLmhofsBatch()),
      readFreshArchive: () => Promise.resolve(null),
    },
  });

  assertEquals(outcome.status, "unavailable");
  assertEquals(outcome.source, null);
  assertEquals(outcome.fallbackUsed, false);
  assertEquals(
    outcome.diagnostics.includes("fresh_complete_archive_missing"),
    true,
  );
});

Deno.test("temperature ingestion falls back if a live cycle cannot be archived", async () => {
  const outcome = await ingestPierCastTemperatureCycle({
    database: unusedDatabase,
    engineVersion: "test",
    operations: {
      fetchLive: () => Promise.resolve(completeLmhofsBatch()),
      archiveLive: () => Promise.reject(new Error("commit failed")),
      readFreshArchive: () => Promise.resolve(completeLmhofsBatch()),
    },
  });

  assertEquals(outcome.status, "cached_fallback");
  assertEquals(
    outcome.diagnostics.some((diagnostic) =>
      diagnostic.startsWith("live_archive_failed:")
    ),
    true,
  );
});
