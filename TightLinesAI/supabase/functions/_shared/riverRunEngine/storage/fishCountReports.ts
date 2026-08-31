import type {
  RiverRunFishCountReportRow,
  RiverRunFishCountSourceCacheRow,
  RiverRunStorageResult,
  StoredFishCountSourceCache,
  SupabaseLikeClient,
} from "./types.ts";
import { storageError } from "./types.ts";

export const FISH_COUNT_SOURCE_CACHE_TABLE =
  "river_run_fish_count_source_cache";
export const FISH_COUNT_REPORTS_TABLE = "river_run_fish_count_reports";

export async function getFishCountSourceCache(
  client: SupabaseLikeClient,
  riverId: string,
  sourceId: string,
): Promise<RiverRunStorageResult<StoredFishCountSourceCache>> {
  const response = await client.from(FISH_COUNT_SOURCE_CACHE_TABLE).select()
    .eq("river_id", riverId).eq("source_id", sourceId).maybeSingle();
  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  if (!response.data) return { data: null, found: false, error: null };
  const row = response.data as unknown as RiverRunFishCountSourceCacheRow;
  return {
    data: {
      riverId: row.river_id,
      sourceId: row.source_id,
      checkedAt: row.checked_at,
      lastSuccessAt: row.last_success_at ?? undefined,
      report: row.report,
    },
    found: true,
    error: null,
  };
}

export async function upsertFishCountSourceCache(
  client: SupabaseLikeClient,
  cache: StoredFishCountSourceCache,
): Promise<RiverRunStorageResult<StoredFishCountSourceCache>> {
  const row: RiverRunFishCountSourceCacheRow = {
    river_id: cache.riverId,
    source_id: cache.sourceId,
    checked_at: cache.checkedAt,
    last_success_at: cache.lastSuccessAt ?? null,
    report_identity: cache.report.reportIdentity,
    data_version: cache.report.dataVersion,
    report: cache.report,
  };
  const response = await client.from(FISH_COUNT_SOURCE_CACHE_TABLE).upsert(
    row,
    { onConflict: "river_id,source_id" },
  ).select().maybeSingle();
  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  return { data: cache, found: true, error: null };
}

export async function archiveFishCountReport(
  client: SupabaseLikeClient,
  cache: StoredFishCountSourceCache,
): Promise<RiverRunStorageResult<StoredFishCountSourceCache>> {
  const reads = Object.values(cache.report.reads);
  const reportDate = reads.map((read) => read?.reportDate).filter(Boolean)
    .toSorted().at(-1) ?? null;
  const observedThrough = reads.map((read) => read?.observedThrough).filter(
    Boolean,
  ).toSorted().at(-1) ?? null;
  const row: RiverRunFishCountReportRow = {
    river_id: cache.riverId,
    source_id: cache.sourceId,
    report_identity: cache.report.reportIdentity,
    report_date: reportDate,
    observed_through: observedThrough,
    data_version: cache.report.dataVersion,
    report: cache.report,
  };
  const response = await client.from(FISH_COUNT_REPORTS_TABLE).upsert(row, {
    onConflict: "river_id,source_id,report_identity",
    ignoreDuplicates: true,
  }).select().maybeSingle();
  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  return { data: cache, found: true, error: null };
}
