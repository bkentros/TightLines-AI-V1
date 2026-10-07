import { assertEquals } from "jsr:@std/assert";
import {
  commitPierCastOutlookSnapshot,
  PIER_CAST_OUTLOOK_SNAPSHOT_VERSION,
  readPierCastOutlookSnapshot,
} from "../archive/outlookSnapshots.ts";

const snapshot = {
  sourceIssuedAt: "2026-10-07T12:00:00.000Z",
  snapshotVersion: PIER_CAST_OUTLOOK_SNAPSHOT_VERSION,
  generatedAt: "2026-10-07T12:05:00.000Z",
  publicOutlook: { source: { issuedAt: "2026-10-07T12:00:00.000Z" } },
  conditionsOutlook: {
    source: { issuedAt: "2026-10-07T12:00:00.000Z" },
  },
};

Deno.test("outlook snapshots commit and read by immutable runtime version", async () => {
  const calls: Array<[string, Record<string, unknown>]> = [];
  const database = {
    rpc(name: string, args: Record<string, unknown>) {
      calls.push([name, args]);
      return Promise.resolve({ data: snapshot, error: null });
    },
  };
  const committed = await commitPierCastOutlookSnapshot({
    database,
    sourceIssuedAt: snapshot.sourceIssuedAt,
    generatedAt: snapshot.generatedAt,
    publicOutlook: snapshot.publicOutlook as never,
    conditionsOutlook: snapshot.conditionsOutlook as never,
  });
  const read = await readPierCastOutlookSnapshot({
    database,
    now: new Date("2026-10-07T13:00:00.000Z"),
    maxAgeHours: 13,
  });
  assertEquals(committed.sourceIssuedAt, snapshot.sourceIssuedAt);
  assertEquals(read?.snapshotVersion, PIER_CAST_OUTLOOK_SNAPSHOT_VERSION);
  assertEquals(calls.map(([name]) => name), [
    "commit_pier_cast_outlook_snapshot",
    "read_pier_cast_outlook_snapshot",
  ]);
  assertEquals(
    calls[1]?.[1].p_snapshot_version,
    PIER_CAST_OUTLOOK_SNAPSHOT_VERSION,
  );
});

Deno.test("outlook snapshot read preserves an unavailable result", async () => {
  const database = {
    rpc() {
      return Promise.resolve({ data: null, error: null });
    },
  };
  assertEquals(
    await readPierCastOutlookSnapshot({
      database,
      now: new Date("2026-10-07T13:00:00.000Z"),
      maxAgeHours: 24,
    }),
    null,
  );
});
