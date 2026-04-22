/**
 * **Test-only / synthetic** flat `env_data` chunks for the recommender’s shared
 * How’s pipeline (`buildSharedEngineRequestForRecommender` → `analyzeSharedConditions`).
 *
 * Values were calibrated once against `analyzeRecommenderConditions` for Florida
 * `freshwater_lake_pond` on `2026-04-15` — see `howsScoreRegimeFixtures.test.ts`.
 * Do not use in production payloads.
 */

import type { RecommenderRequest } from "../contracts/input.ts";

export const SYNTHETIC_HOWS_FIXTURE_TAG = "synthetic_hows_fixture_id" as const;

/** Florida lake pin + April calendar row (matches seasonal matrix month). */
export function syntheticLmbFloridaLakeAprilBase(): Pick<
  RecommenderRequest,
  "location" | "species" | "context" | "water_clarity"
> {
  return {
    location: {
      latitude: 28.0614,
      longitude: -82.3026,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-04-15",
      local_timezone: "America/New_York",
      month: 4,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  };
}

/** Target regime: suppressive (`score0to100` ≤ 35). */
export function syntheticHowsEnvLmbLakeSuppressive(): Record<string, unknown> {
  return {
    [SYNTHETIC_HOWS_FIXTURE_TAG]: "lmb_lake_fl_apr_suppressive_v1",
    daily_mean_air_temp_f: 35,
    prior_day_mean_air_temp_f: 36,
    day_minus_2_mean_air_temp_f: 37,
    pressure_history_mb: [1020, 1010, 1000, 990],
    wind_speed_mph: 35,
    cloud_cover_pct: 100,
    precip_24h_in: 0,
    precip_72h_in: 0,
    precip_7d_in: 0,
  };
}

/** Target band: neutral (~50, used as “middling” anchor in tests). */
export function syntheticHowsEnvLmbLakeNeutralMiddling(): Record<string, unknown> {
  return {
    [SYNTHETIC_HOWS_FIXTURE_TAG]: "lmb_lake_fl_apr_neutral_middling_v1",
    daily_mean_air_temp_f: 66,
    prior_day_mean_air_temp_f: 65.7,
    day_minus_2_mean_air_temp_f: 65.4,
    pressure_history_mb: [1013, 1010.5],
    wind_speed_mph: 5,
    cloud_cover_pct: 25,
    precip_24h_in: 0,
    precip_72h_in: 0,
    precip_7d_in: 0,
  };
}

/** Target regime: aggressive (`score0to100` ≥ 70). */
export function syntheticHowsEnvLmbLakeAggressive(): Record<string, unknown> {
  return {
    [SYNTHETIC_HOWS_FIXTURE_TAG]: "lmb_lake_fl_apr_aggressive_v1",
    daily_mean_air_temp_f: 78,
    prior_day_mean_air_temp_f: 77,
    day_minus_2_mean_air_temp_f: 76,
    pressure_history_mb: [1013, 1012.5, 1012, 1011.8, 1011.5, 1011.2],
    wind_speed_mph: 4,
    cloud_cover_pct: 15,
    precip_24h_in: 0,
    precip_72h_in: 0,
    precip_7d_in: 0,
  };
}

export function syntheticLmbLakeRequest(
  env_data: Record<string, unknown>,
): RecommenderRequest {
  return { ...syntheticLmbFloridaLakeAprilBase(), env_data };
}
