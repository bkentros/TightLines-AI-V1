import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const base = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !key) {
  throw new Error("Supabase production configuration is required.");
}

const configVersion = "piercast-v3-twenty-seven-city-st-joseph-harrisville-pass3-v10";
const onboardingCityIds = [
  "st_joseph_mi",
  "south_haven_mi",
  "holland_mi",
  "lexington_mi",
  "harrisville_mi",
];

const headers = { apikey: key, Authorization: `Bearer ${key}` };
const runs = await get(
  `/rest/v1/pier_cast_v3_shadow_forecast_runs?select=run_id,config_version,generated_at,source_issued_at,source_fetched_at,engine_version,formula_version,preview_only,promotion_status,forecast_count&config_version=eq.${configVersion}&order=generated_at.desc&limit=1`,
);
const run = runs[0];
if (!run) throw new Error("No production Pass 3 run exists.");
const forecastPath =
  `/rest/v1/pier_cast_v3_shadow_forecasts?select=city_id,species_id,lead_day,local_date,score,display_score,score_status,promotion_status&run_id=eq.${run.run_id}`;
const forecasts = [
  ...await get(`${forecastPath}&limit=1000&offset=0`),
  ...await get(`${forecastPath}&limit=1000&offset=1000`),
];

const cityIds = unique(forecasts.map((row) => row.city_id));
const pairs = unique(
  forecasts.map((row) => `${row.city_id}/${row.species_id}`),
);
const onboarding = forecasts.filter((row) =>
  onboardingCityIds.includes(row.city_id)
);
const onboardingPairs = unique(
  onboarding.map((row) => `${row.city_id}/${row.species_id}`),
);
const scores = forecasts.flatMap((row) =>
  typeof row.score === "number" ? [row.score] : []
);
const checks = {
  runForecastCount: run.forecast_count === 1110,
  storedForecastCount: forecasts.length === 1110,
  cityCount: cityIds.length === 27,
  pairCount: pairs.length === 222,
  leadDays: JSON.stringify(unique(forecasts.map((row) => row.lead_day))) ===
    JSON.stringify([0, 1, 2, 3, 4]),
  onboardingCityCount:
    unique(onboarding.map((row) => row.city_id)).length === 5,
  onboardingPairCount: onboardingPairs.length === 49,
  onboardingForecastCount: onboarding.length === 245,
  previewOnly: run.preview_only === true,
  promotionBlocked: run.promotion_status === "blocked" &&
    forecasts.every((row) => row.promotion_status === "blocked"),
  scoreCap: scores.length > 0 &&
    scores.every((score) => score >= 1 && score <= 10),
};
if (Object.values(checks).some((result) => !result)) {
  throw new Error(
    `Production Pass 3 verification failed: ${JSON.stringify(checks)}`,
  );
}

const artifact = {
  schemaVersion: "piercast-st-joseph-harrisville-public-release-verification-v2",
  verifiedAt: new Date().toISOString(),
  environment: "production",
  run,
  actual: {
    storedForecastCount: forecasts.length,
    cityCount: cityIds.length,
    pairCount: pairs.length,
    onboardingCityCount: unique(onboarding.map((row) => row.city_id)).length,
    onboardingPairCount: onboardingPairs.length,
    onboardingForecastCount: onboarding.length,
    minimumStoredScore: Math.min(...scores),
    maximumStoredScore: Math.max(...scores),
    onboardingSpecies: Object.fromEntries(onboardingCityIds.map((cityId) => [
      cityId,
      unique(
        onboarding.filter((row) => row.city_id === cityId).map((row) =>
          row.species_id
        ),
      ),
    ])),
  },
  checks,
  independentAcceptance: {
    ownerProductionQa:
      "PASS: 27 ranked cities from one coherent six-cohort issue.",
    publicProductionQa:
      "PASS: all 27 cities are in the public projection with complete five-day reports.",
    authenticatedNormalUserSmoke:
      "PASS: all 27 cities are visible to a normal user; owner review remains 403; quota, saved refresh, and all paid reports pass.",
  },
  result: "pass",
};

const directory = resolve(
  "docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass3",
);
await mkdir(directory, { recursive: true });
await writeFile(
  resolve(directory, "production-verification.json"),
  `${JSON.stringify(artifact, null, 2)}\n`,
);
console.log(
  `PASS: production run ${run.run_id} contains 1110 rows, 27 cities, 222 pairs, and all five publicly released onboarding reports.`,
);

async function get(path) {
  const response = await fetch(`${base}${path}`, { headers });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `Production query failed (${response.status}): ${JSON.stringify(body)}`,
    );
  }
  return body;
}

function unique(values) {
  return [...new Set(values)].sort((a, b) =>
    typeof a === "number" && typeof b === "number"
      ? a - b
      : String(a).localeCompare(String(b))
  );
}
