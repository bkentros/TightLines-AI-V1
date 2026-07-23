import type {
  RiverRunGaugeBaseline,
  RiverRunGaugeBaselineRow,
  RiverRunStorageResult,
  SupabaseLikeClient,
} from "./types.ts";
import { storageError } from "./types.ts";
import type { RiverMetric } from "../types.ts";

export const GAUGE_BASELINES_TABLE = "river_run_gauge_baselines";

export function deserializeGaugeBaseline(
  row: RiverRunGaugeBaselineRow,
): RiverRunGaugeBaseline {
  return {
    riverId: row.river_id,
    metric: row.metric,
    dayOfYear: row.day_of_year,
    baselineVersion: row.baseline_version,
    percentiles: row.percentiles,
    bandData: row.band_data,
    sampleCount: row.sample_count,
    distinctYears: row.distinct_years,
    windowDays: row.window_days,
    sourceNotes: row.source_notes,
    createdAt: row.created_at,
  };
}

export async function readGaugeBaselines(
  client: SupabaseLikeClient,
  key: {
    riverId: string;
    metric: RiverMetric;
    baselineVersion: string;
  },
): Promise<RiverRunStorageResult<RiverRunGaugeBaseline[]>> {
  const response = await client
    .from(GAUGE_BASELINES_TABLE)
    .select()
    .eq("river_id", key.riverId)
    .eq("metric", key.metric)
    .eq("baseline_version", key.baselineVersion)
    .order("day_of_year", { ascending: true });

  const result = await (response as unknown as Promise<{
    data: RiverRunGaugeBaselineRow[] | null;
    error: null | { message?: string; code?: string; details?: unknown };
  }>);

  const error = storageError(result.error);
  if (error) return { data: null, found: false, error };
  const rows = result.data ?? [];
  return {
    data: rows.map(deserializeGaugeBaseline),
    found: rows.length > 0,
    error: null,
  };
}
