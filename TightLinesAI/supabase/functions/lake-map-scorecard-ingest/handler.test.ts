import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert";
import { createLakeMapScorecardHandler } from "./handler.ts";

const SECRET = "scorecard-test-secret-value";
const record = {
  station_id: "glos:2",
  sensor_key: "glos:2|parameter:7|GLOS Seagull",
  observation_time: "2026-10-06T12:00:00Z",
  model_cycle: "2026-10-06T06:00:00Z",
  valid_time: "2026-10-06T12:00:00Z",
  lead_hours: 6,
  sensor_depth_m: 1,
  model_depth_m: 0,
  depth_method: "surface_layer",
  depth_assumed: false,
  pair_status: "paired",
  model_version: "LMHOFS:COMF-3.6:2024-09-09",
  run_id: "run-1",
  observed_temperature_f: 60,
  model_temperature_f: 58,
  quality_flags: [],
};

function request(
  secret = SECRET,
  records: unknown = [record],
  method = "POST",
) {
  return new Request(
    "https://example.test/functions/v1/lake-map-scorecard-ingest",
    {
      method,
      headers: {
        "content-type": "application/json",
        "x-lake-map-scorecard-key": secret,
      },
      body: method === "POST" ? JSON.stringify({ records }) : undefined,
    },
  );
}

Deno.test("scorecard ingest kill switch and authentication run before database work", async () => {
  let calls = 0;
  const database = {
    rpc: () => {
      calls += 1;
      return Promise.resolve({ data: null, error: null });
    },
  };
  const disabled = createLakeMapScorecardHandler({
    enabled: false,
    internalSecret: SECRET,
    database,
  });
  assertEquals((await disabled(request("wrong-secret-value"))).status, 403);
  assertEquals((await disabled(request())).status, 503);
  const enabled = createLakeMapScorecardHandler({
    enabled: true,
    internalSecret: SECRET,
    database,
  });
  assertEquals((await enabled(request("wrong-secret-value"))).status, 403);
  assertEquals((await enabled(request(SECRET, [record], "GET"))).status, 405);
  assertEquals(calls, 0);
});

Deno.test("scorecard ingest commits a validated private batch", async () => {
  let received: unknown;
  const handler = createLakeMapScorecardHandler({
    enabled: true,
    internalSecret: SECRET,
    database: {
      rpc: (name, arguments_) => {
        received = { name, arguments_ };
        return Promise.resolve({
          data: { status: "committed", recordCount: 1 },
          error: null,
        });
      },
    },
  });
  const response = await handler(request());
  assertEquals(response.status, 200);
  assertEquals(await response.json(), { status: "committed", recordCount: 1 });
  assertEquals(
    (received as { name: string }).name,
    "commit_lake_map_temperature_scorecard_samples",
  );
});

Deno.test("scorecard ingest rejects malformed data and sanitizes database failures", async () => {
  const handler = createLakeMapScorecardHandler({
    enabled: true,
    internalSecret: SECRET,
    database: {
      rpc: () =>
        Promise.resolve({
          data: null,
          error: { message: "sensitive database detail" },
        }),
    },
  });
  assertEquals(
    (await handler(request(SECRET, [{ station_id: "incomplete" }]))).status,
    400,
  );
  const failed = await handler(request());
  assertEquals(failed.status, 503);
  assertEquals(await failed.json(), { error: "scorecard_commit_failed" });
});

Deno.test("scorecard migration is private, idempotent, durable, and exposes only a private summary", async () => {
  const migration = await Deno.readTextFile(
    new URL(
      "../../migrations/20261006150000_create_lake_map_temperature_scorecard.sql",
      import.meta.url,
    ),
  );
  assertStringIncludes(
    migration,
    "primary key (station_id, sensor_key, observation_time, model_cycle)",
  );
  assertStringIncludes(
    migration,
    "on conflict (station_id, sensor_key, observation_time, model_cycle) do update",
  );
  assertStringIncludes(
    migration,
    "observed_temperature_f - model_temperature_f",
  );
  assertStringIncludes(migration, "lake_map_temperature_scorecard_weekly");
  assertStringIncludes(migration, "percentile_cont(0.5)");
  assertStringIncludes(migration, "minimum two years");
  assertStringIncludes(migration, "pending_3d");
  assertStringIncludes(migration, "interpolated_3d");
  assertStringIncludes(migration, "model_version");
  assertStringIncludes(migration, "auth.role() <> 'service_role'");
  assertStringIncludes(
    migration,
    "revoke all on table public.lake_map_temperature_scorecard_samples from public, anon, authenticated",
  );
  assert(!migration.includes("cron.schedule"));
  assert(
    !migration.includes(
      "delete from public.lake_map_temperature_scorecard_samples",
    ),
  );
});
