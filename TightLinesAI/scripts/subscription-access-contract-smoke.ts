import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  canAttemptRiverRunReport,
  canGenerateForecastReport,
  canGenerateRecommenderReport,
  canGenerateRiverRunReport,
  canGenerateWaterRead,
  canViewForecastScore,
  shouldLimitFreeTodayBiteReport,
} from "../lib/subscription";
import { maxForecastDayOffsetForTier } from "../supabase/functions/_shared/subscriptionAccessPolicy";
import type { UserProfile } from "../lib/types";

const fresh = {
  subscription_tier: "free",
  free_recommender_trial_used_at: null,
  free_water_read_trial_used_at: null,
  free_today_bite_full_used_at: null,
  free_river_run_trial_used_at: null,
} as UserProfile;
const spent = {
  ...fresh,
  free_recommender_trial_used_at: "2026-08-12T00:00:00.000Z",
  free_water_read_trial_used_at: "2026-08-12T00:00:00.000Z",
  free_today_bite_full_used_at: "2026-08-12T00:00:00.000Z",
  free_river_run_trial_used_at: "2026-08-12T00:00:00.000Z",
  free_river_run_trial_river_id: "river-a",
  free_river_run_trial_run_id: "run-a",
  free_river_run_trial_presentation_state: "MI",
} as UserProfile;

assert.equal(canGenerateRecommenderReport("free", null), false);
assert.equal(canGenerateWaterRead("free", null, 0), false);
assert.equal(canGenerateRiverRunReport("free", null), false);
assert.equal(shouldLimitFreeTodayBiteReport("free", null), true);

assert.equal(canGenerateRecommenderReport("free", fresh), true);
assert.equal(canGenerateWaterRead("free", fresh, 0), true);
assert.equal(canGenerateRiverRunReport("free", fresh), true);
assert.equal(shouldLimitFreeTodayBiteReport("free", fresh), false);

assert.equal(canGenerateRecommenderReport("free", spent), false);
assert.equal(canGenerateWaterRead("free", spent, 1), false);
assert.equal(canGenerateRiverRunReport("free", spent), false);
assert.equal(shouldLimitFreeTodayBiteReport("free", spent), true);
assert.equal(canAttemptRiverRunReport("free", spent, {
  riverId: "river-a",
  runId: "run-a",
  presentationState: "MI",
}), true);
assert.equal(canAttemptRiverRunReport("free", spent, {
  riverId: "river-b",
  runId: "run-b",
  presentationState: "MI",
}), false);

assert.equal(canGenerateForecastReport("free"), false);
assert.equal(canViewForecastScore("free", 1), true);
assert.equal(canViewForecastScore("free", 2), false);
assert.equal(maxForecastDayOffsetForTier("free"), 1);

for (const tier of ["angler", "master_angler"] as const) {
  assert.equal(canGenerateRecommenderReport(tier, spent), true);
  assert.equal(canGenerateWaterRead(tier, spent, 99), true);
  assert.equal(canGenerateRiverRunReport(tier, spent), true);
  assert.equal(canGenerateForecastReport(tier), true);
  assert.equal(shouldLimitFreeTodayBiteReport(tier, spent), false);
  assert.equal(maxForecastDayOffsetForTier(tier), 6);
}

const forecastServer = readFileSync(
  "supabase/functions/forecast-scores/index.ts",
  "utf8",
);
assert.match(forecastServer, /select\("subscription_tier"\)/);
assert.match(
  forecastServer,
  /Math\.min\([\s\S]*?requestedMaxDayOffset[\s\S]*?maxForecastDayOffsetForTier\(access\.tier\)/,
);

console.log("Subscription access contract smoke passed.");
