/**
 * Locks the River Migration free-tier contract:
 * - one lifetime full snapshot for any supported combination;
 * - only that combination may ask the server for a replay;
 * - server replay requires the exact local date, refresh slot, engine, and config;
 * - after refresh rollover, every request paywalls forever.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { canAttemptRiverRunReport } from "../lib/subscription";
import type { UserProfile } from "../lib/types";

const target = {
  riverId: "pere_marquette",
  runId: "pere_marquette_fall_chinook",
  presentationState: "MI",
};
const fresh = {
  id: "free-user",
  free_river_run_trial_used_at: null,
} as UserProfile;
const spent = {
  id: "free-user",
  free_river_run_trial_used_at: "2026-08-08T12:00:00.000Z",
  free_river_run_trial_river_id: target.riverId,
  free_river_run_trial_run_id: target.runId,
  free_river_run_trial_presentation_state: target.presentationState,
} as UserProfile;

assert.equal(canAttemptRiverRunReport("free", fresh, target), true);
assert.equal(canAttemptRiverRunReport("free", spent, target), true);
assert.equal(
  canAttemptRiverRunReport("free", spent, {
    ...target,
    runId: "pere_marquette_fall_coho",
  }),
  false,
);
assert.equal(
  canAttemptRiverRunReport("free", spent, {
    riverId: "salmon_ny",
    runId: "salmon_ny_fall_chinook",
    presentationState: "NY",
  }),
  false,
  "a lifetime claim on one river must paywall a different river and state",
);
assert.equal(canAttemptRiverRunReport("angler", spent, null), true);
assert.equal(canAttemptRiverRunReport("free", null, target), false);

const server = readFileSync("supabase/functions/river-run/index.ts", "utf8");
const migration = readFileSync(
  "supabase/migrations/20260808110000_add_free_river_run_trial.sql",
  "utf8",
);
const app = readFileSync("app/river-run.tsx", "utf8");

for (
  const identity of [
    "riverId",
    "runId",
    "presentationState",
    "localDate",
    "refreshSlot",
    "engineVersion",
    "configVersion",
  ]
) {
  assert.match(
    server,
    new RegExp(`profile\\.free_river_run_trial_[\\s\\S]*?key\\.${identity}`),
    `server replay identity must include ${identity}`,
  );
}
assert.match(
  server,
  /const \[result, riverConditions(?:, fishCounts)?\] = await Promise\.all\([\s\S]*?readOrBuildSnapshot[\s\S]*?readOrBuildRiverLiveConditions[\s\S]*?claimFreeRiverRunTrial/,
  "the free trial must be claimed only after both the snapshot and live conditions are available",
);
assert.match(server, /freeTrialUnused[\s\S]*?claimFreeRiverRunTrial/);
assert.match(server, /"subscription_required"/);
assert.match(migration, /profiles_free_river_run_trial_complete_check/);
assert.match(migration, /free_river_run_trial_refresh_slot/);
assert.match(migration, /free_river_run_trial_engine_version/);
assert.match(app, /error\.code === "subscription_required"/);
assert.match(app, /next\.accessTier === "free_trial"/);

console.log("River Migration free-trial contract smoke passed.");
