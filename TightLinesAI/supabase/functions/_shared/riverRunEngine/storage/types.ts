import type { RiverRunConditionRefresh } from "../snapshot/buildConditionRefresh.ts";
import type { RiverRunDailySnapshot } from "../snapshot/buildDailySnapshot.ts";
import type { RiverMetric, RiverRunReasonCode } from "../types.ts";

export type RiverRunStorageError = {
  message: string;
  code?: string;
  details?: unknown;
};

export type RiverRunStorageResult<T> = {
  data: T | null;
  found: boolean;
  error: RiverRunStorageError | null;
};

export type SupabaseLikeClient = {
  from(table: string): SupabaseLikeQuery;
};

export type SupabaseLikeQuery = {
  select(columns?: string): SupabaseLikeQuery;
  upsert(
    row: Record<string, unknown>,
    options?: { onConflict?: string; ignoreDuplicates?: boolean },
  ): SupabaseLikeQuery;
  eq(column: string, value: unknown): SupabaseLikeQuery;
  gte(column: string, value: unknown): SupabaseLikeQuery;
  lte(column: string, value: unknown): SupabaseLikeQuery;
  order(column: string, options?: { ascending?: boolean }): SupabaseLikeQuery;
  maybeSingle(): Promise<SupabaseLikeResponse<Record<string, unknown> | null>>;
};

export type SupabaseLikeResponse<T> = {
  data: T;
  error: null | {
    message?: string;
    code?: string;
    details?: unknown;
  };
};

export type StoredDailySnapshot = RiverRunDailySnapshot & {
  progressionSnapshotAt: string;
};

export type StoredConditionRefresh =
  & Omit<RiverRunConditionRefresh, "runStage" | "schedule" | "fishInRiver">
  & {
    conditionRefreshAt: string;
  };

export type RiverRunGaugeBaseline = {
  riverId: string;
  metric: RiverMetric;
  dayOfYear: number;
  baselineVersion: string;
  percentiles: Record<string, number>;
  bandData: Record<string, unknown>;
  sampleCount: number;
  distinctYears: number;
  windowDays: number;
  sourceNotes?: string | null;
  createdAt?: string;
};

export type RiverRunGaugeBaselineRow = {
  river_id: string;
  metric: RiverMetric;
  day_of_year: number;
  baseline_version: string;
  percentiles: Record<string, number>;
  band_data: Record<string, unknown>;
  sample_count: number;
  distinct_years: number;
  window_days: number;
  source_notes?: string | null;
  created_at?: string;
};

export type RiverRunDailySnapshotRow = {
  river_id: string;
  run_id: string;
  local_date: string;
  timezone: string;
  progression_snapshot_at: string;
  run_stage: RiverRunDailySnapshot["runStage"];
  schedule: RiverRunDailySnapshot["schedule"];
  fish_in_river: RiverRunDailySnapshot["fishInRiver"];
  favorability_summaries: RiverRunDailySnapshot["favorabilitySummaries"];
  source_dates: string[];
  source_refresh_slots: Partial<Record<string, string>>;
  reason_codes: RiverRunReasonCode[];
  engine_version: string;
  config_version: string;
};

export type RiverRunConditionRefreshRow = {
  river_id: string;
  run_id: string;
  local_date: string;
  refresh_slot: string;
  condition_refresh_at: string;
  push: RiverRunConditionRefresh["push"];
  fishability: RiverRunConditionRefresh["fishability"];
  source_metrics: RiverRunConditionRefresh["sourceMetrics"];
  freshness: RiverRunConditionRefresh["freshness"];
  data_quality: RiverRunConditionRefresh["dataQuality"];
  interpretation_note?: RiverRunConditionRefresh["interpretationNote"] | null;
  reason_codes: RiverRunReasonCode[];
  engine_version: string;
  config_version: string;
};

export function storageError(
  error: SupabaseLikeResponse<unknown>["error"],
): RiverRunStorageError | null {
  if (!error) return null;
  return {
    message: error.message ?? "River Run storage operation failed.",
    code: error.code,
    details: error.details,
  };
}
