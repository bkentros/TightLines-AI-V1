import type { RiverRunConditionRefresh } from "../snapshot/buildConditionRefresh.ts";
import type { RiverRunDailySnapshot } from "../snapshot/buildDailySnapshot.ts";
import type { ConditionsSuggestCheckpointId } from "../metrics/conditionsCheckpoints.ts";
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
  limit(count: number): SupabaseLikeQuery;
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
  & Omit<
    RiverRunConditionRefresh,
    "runStage" | "conditionsSuggest" | "fishInRiver"
  >
  & {
    conditionRefreshAt: string;
  };

export type ConditionsSuggestComponentSamples = {
  gaugeAbsoluteRise: number[];
  gaugeRelativeRisePct: number[];
  meanWaterTempF: number[];
  waterCoolingF: number[];
};

export type ConditionsSuggestHistoricalSample = {
  year: number;
  usableDays: number;
  gaugeAbsoluteRise: number;
  gaugeRelativeRisePct: number;
  meanWaterTempF: number;
  waterCoolingF: number;
  gaugeResponsePercentile: number;
  waterTemperaturePercentile: number;
  evidenceIndex: number;
};

export type RiverRunConditionsSuggestBaseline = {
  riverId: string;
  runId: string;
  checkpointId: ConditionsSuggestCheckpointId;
  referenceDayOfYear: number;
  observationStartDayOfYear: number;
  baselineVersion: string;
  gaugeMetric: RiverMetric;
  gaugeSiteId: string;
  temperatureSourceId: string;
  componentSamples: ConditionsSuggestComponentSamples;
  historicalSamples: ConditionsSuggestHistoricalSample[];
  indexPercentiles: {
    p10: number;
    p25: number;
    p75: number;
    p90: number;
  };
  distinctYears: number;
  expectedDays: number;
  minimumUsableDays: number;
  sourceNotes?: string | null;
  createdAt?: string;
};

export type RiverRunConditionsSuggestBaselineRow = {
  river_id: string;
  run_id: string;
  checkpoint_id: ConditionsSuggestCheckpointId;
  reference_day_of_year: number;
  observation_start_day_of_year: number;
  baseline_version: string;
  gauge_metric: RiverMetric;
  gauge_site_id: string;
  temperature_source_id: string;
  component_samples: ConditionsSuggestComponentSamples;
  historical_samples: ConditionsSuggestHistoricalSample[];
  index_percentiles: RiverRunConditionsSuggestBaseline["indexPercentiles"];
  distinct_years: number;
  expected_days: number;
  minimum_usable_days: number;
  source_notes?: string | null;
  created_at?: string;
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
  conditions_suggest: RiverRunDailySnapshot["conditionsSuggest"];
  fish_in_river: RiverRunDailySnapshot["fishInRiver"];
  evidence_summaries: RiverRunDailySnapshot["evidenceSummaries"];
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
    message: error.message ?? "River Migration storage operation failed.",
    code: error.code,
    details: error.details,
  };
}
