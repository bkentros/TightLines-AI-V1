import {
  type RiverRunConditionsSuggestBaseline,
  type RiverRunConditionsSuggestBaselineRow,
  type RiverRunStorageResult,
  storageError,
  type SupabaseLikeClient,
} from "./types.ts";

export const CONDITIONS_SUGGEST_BASELINES_TABLE =
  "river_run_conditions_suggest_baselines";

export function deserializeConditionsSuggestBaseline(
  row: RiverRunConditionsSuggestBaselineRow,
): RiverRunConditionsSuggestBaseline {
  return {
    riverId: row.river_id,
    runId: row.run_id,
    checkpointId: row.checkpoint_id,
    referenceDayOfYear: row.reference_day_of_year,
    observationStartDayOfYear: row.observation_start_day_of_year,
    baselineVersion: row.baseline_version,
    gaugeMetric: row.gauge_metric,
    gaugeSiteId: row.gauge_site_id,
    temperatureSourceId: row.temperature_source_id,
    componentSamples: row.component_samples,
    historicalSamples: row.historical_samples,
    indexPercentiles: row.index_percentiles,
    distinctYears: row.distinct_years,
    expectedDays: row.expected_days,
    minimumUsableDays: row.minimum_usable_days,
    sourceNotes: row.source_notes,
    createdAt: row.created_at,
  };
}

export async function readConditionsSuggestBaselines(
  client: SupabaseLikeClient,
  key: {
    riverId: string;
    runId: string;
    baselineVersion: string;
  },
): Promise<RiverRunStorageResult<RiverRunConditionsSuggestBaseline[]>> {
  const response = await client
    .from(CONDITIONS_SUGGEST_BASELINES_TABLE)
    .select()
    .eq("river_id", key.riverId)
    .eq("run_id", key.runId)
    .eq("baseline_version", key.baselineVersion)
    .order("reference_day_of_year", { ascending: true });
  const result = await (response as unknown as Promise<{
    data: RiverRunConditionsSuggestBaselineRow[] | null;
    error: null | { message?: string; code?: string; details?: unknown };
  }>);
  const error = storageError(result.error);
  if (error) return { data: null, found: false, error };
  const rows = result.data ?? [];
  return {
    data: rows.map(deserializeConditionsSuggestBaseline),
    found: rows.length > 0,
    error: null,
  };
}
