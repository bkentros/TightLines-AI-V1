import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../supabase/migrations/20261014173000_pier_cast_invoker_timeouts_and_stagger.sql",
  import.meta.url,
);
const migration = await readFile(migrationUrl, "utf8");

const rawInvokers = [
  "pier_cast_raw_invoke_primary_v1",
  "pier_cast_raw_invoke_wisconsin_v1",
  "pier_cast_raw_invoke_lake_huron_v1",
  "pier_cast_raw_invoke_pentwater_caseville_v1",
  "pier_cast_raw_invoke_five_city_v1",
  "pier_cast_raw_invoke_chicago_alpena_v1",
  "pier_cast_raw_invoke_stj_harrisville_v1",
  "pier_cast_raw_invoke_v3_v1",
];

test("all raw PierCast invokers are normalized to 150 seconds", () => {
  for (const invoker of rawInvokers) {
    assert.match(migration, new RegExp(`'${invoker}'`));
  }
  assert.match(migration, /timeout_milliseconds := 150000/);
  assert.match(migration, /timeout_match\[2\] <> '150000'/);
  assert.match(migration, /Required PierCast raw invoker is missing/);
});

test("regular cohorts and aggregate have unique, ordered start minutes", () => {
  const schedules = [...migration.matchAll(/'((?:[0-5]?\d) (?:3,9,15,21|4,10,16,22) \* \* \*)'/g)]
    .map((match) => match[1]);

  assert.deepEqual(schedules, [
    "35 3,9,15,21 * * *",
    "40 3,9,15,21 * * *",
    "45 3,9,15,21 * * *",
    "50 3,9,15,21 * * *",
    "55 3,9,15,21 * * *",
    "0 4,10,16,22 * * *",
    "5 4,10,16,22 * * *",
    "10 4,10,16,22 * * *",
  ]);
  assert.equal(new Set(schedules.map((schedule) => schedule.split(" ")[0])).size, 8);
  assert.match(migration, /regular_job_count <> 8 or distinct_minute_count <> 8/);
});
