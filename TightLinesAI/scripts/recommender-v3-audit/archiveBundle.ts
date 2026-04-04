import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/input.ts";

export const LARGEMOUTH_GOLD_BATCH_1_ARCHIVE_ENV_PATH =
  "docs/recommender-v3-audit/generated/largemouth-v3-gold-batch-1-archive-env.json";

export const LARGEMOUTH_GOLD_BATCH_1_OUTPUT_MARKDOWN =
  "docs/recommender-v3-audit/generated/largemouth-v3-gold-batch-1-review-sheet.md";

export const LARGEMOUTH_GOLD_BATCH_1_OUTPUT_JSON =
  "docs/recommender-v3-audit/generated/largemouth-v3-gold-batch-1-review-sheet.json";

export function batchFileSlug(batchId: string): string {
  return batchId.replace(/_/g, "-");
}

export function buildArchiveEnvPath(batchId: string): string {
  return `docs/recommender-v3-audit/generated/${batchFileSlug(batchId)}-archive-env.json`;
}

export function buildReviewSheetMarkdownPath(batchId: string): string {
  return `docs/recommender-v3-audit/generated/${batchFileSlug(batchId)}-review-sheet.md`;
}

export function buildReviewSheetJsonPath(batchId: string): string {
  return `docs/recommender-v3-audit/generated/${batchFileSlug(batchId)}-review-sheet.json`;
}

export type ArchiveBundleStatus =
  | "ready"
  | "archive_fetch_failed";

export type ArchiveScenarioSummary = {
  archive_timezone: string | null;
  noon_air_temp_f: number | null;
  pressure_noon_mb: number | null;
  cloud_cover_noon_pct: number | null;
  daily_high_air_temp_f: number | null;
  daily_low_air_temp_f: number | null;
  daily_precip_in: number | null;
  daily_wind_max_mph: number | null;
  moon_phase: string | null;
  sunrise_local: string | null;
  sunset_local: string | null;
};

export type ArchiveScenarioBundle = {
  scenario_id: string;
  label: string;
  status: ArchiveBundleStatus;
  location: {
    latitude: number;
    longitude: number;
    state_code: string;
    timezone: string;
    local_date: string;
    region_key: RegionKey;
    month: number;
  };
  archive_summary: ArchiveScenarioSummary;
  env_data: Record<string, unknown> | null;
  shared_environment: SharedEngineRequest["environment"] | null;
  data_coverage: SharedEngineRequest["data_coverage"];
  error: string | null;
};

export type ArchiveBatchBundle = {
  batch_id: string;
  generated_at: string;
  scenario_count: number;
  scenarios: ArchiveScenarioBundle[];
};
