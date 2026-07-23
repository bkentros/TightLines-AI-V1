import type {
  RiverRunConditionRefreshRow,
  RiverRunStorageResult,
  StoredConditionRefresh,
  SupabaseLikeClient,
} from "./types.ts";
import { storageError } from "./types.ts";

export const CONDITION_REFRESH_TABLE = "river_run_condition_refreshes";
export const CONDITION_REFRESH_ON_CONFLICT =
  "river_id,run_id,local_date,refresh_slot,engine_version,config_version";

export function serializeConditionRefresh(
  refresh: StoredConditionRefresh,
): RiverRunConditionRefreshRow {
  return {
    river_id: refresh.riverId,
    run_id: refresh.runId,
    local_date: refresh.localDate,
    refresh_slot: refresh.refreshSlot,
    condition_refresh_at: refresh.conditionRefreshAt,
    push: refresh.push,
    fishability: refresh.fishability,
    source_metrics: refresh.sourceMetrics,
    freshness: refresh.freshness,
    data_quality: refresh.dataQuality,
    interpretation_note: refresh.interpretationNote ?? null,
    reason_codes: refresh.reasonCodes,
    engine_version: refresh.engineVersion,
    config_version: refresh.configVersion,
  };
}

export function deserializeConditionRefresh(
  row: RiverRunConditionRefreshRow,
): StoredConditionRefresh {
  return {
    riverId: row.river_id,
    runId: row.run_id,
    localDate: row.local_date,
    refreshSlot: row.refresh_slot as StoredConditionRefresh["refreshSlot"],
    conditionRefreshAt: row.condition_refresh_at,
    push: row.push,
    fishability: row.fishability,
    sourceMetrics: row.source_metrics,
    freshness: row.freshness,
    dataQuality: row.data_quality,
    interpretationNote: row.interpretation_note ?? undefined,
    reasonCodes: row.reason_codes,
    engineVersion: row.engine_version,
    configVersion: row.config_version,
  };
}

export async function upsertConditionRefresh(
  client: SupabaseLikeClient,
  refresh: StoredConditionRefresh,
): Promise<RiverRunStorageResult<StoredConditionRefresh>> {
  const response = await client
    .from(CONDITION_REFRESH_TABLE)
    .upsert(serializeConditionRefresh(refresh), {
      onConflict: CONDITION_REFRESH_ON_CONFLICT,
    })
    .select()
    .maybeSingle();

  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  if (!response.data) return { data: null, found: false, error: null };
  return {
    data: deserializeConditionRefresh(
      response.data as RiverRunConditionRefreshRow,
    ),
    found: true,
    error: null,
  };
}

export async function getConditionRefresh(
  client: SupabaseLikeClient,
  key: {
    riverId: string;
    runId: string;
    localDate: string;
    refreshSlot: string;
    engineVersion: string;
    configVersion: string;
  },
): Promise<RiverRunStorageResult<StoredConditionRefresh>> {
  const response = await client
    .from(CONDITION_REFRESH_TABLE)
    .select()
    .eq("river_id", key.riverId)
    .eq("run_id", key.runId)
    .eq("local_date", key.localDate)
    .eq("refresh_slot", key.refreshSlot)
    .eq("engine_version", key.engineVersion)
    .eq("config_version", key.configVersion)
    .maybeSingle();

  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  if (!response.data) return { data: null, found: false, error: null };
  return {
    data: deserializeConditionRefresh(
      response.data as RiverRunConditionRefreshRow,
    ),
    found: true,
    error: null,
  };
}
