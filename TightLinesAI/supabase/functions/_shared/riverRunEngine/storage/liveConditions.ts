import type {
  RiverLiveConditions,
  RiverLiveSeasonalContext,
} from "../types.ts";
import type {
  RiverLiveConditionsRow,
  RiverMetricSeasonalContextRow,
  RiverRunStorageResult,
  SupabaseLikeClient,
} from "./types.ts";
import { storageError } from "./types.ts";

export const LIVE_CONDITIONS_TABLE = "river_run_live_conditions";
export const SEASONAL_CONTEXTS_TABLE = "river_run_metric_seasonal_contexts";

export async function getLiveConditions(
  client: SupabaseLikeClient,
  key: {
    riverId: string;
    localDate: string;
    refreshSlot: string;
    dataVersion: string;
  },
): Promise<RiverRunStorageResult<RiverLiveConditions>> {
  const response = await client
    .from(LIVE_CONDITIONS_TABLE)
    .select()
    .eq("river_id", key.riverId)
    .eq("local_date", key.localDate)
    .eq("refresh_slot", key.refreshSlot)
    .eq("data_version", key.dataVersion)
    .maybeSingle();
  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  const row = response.data as RiverLiveConditionsRow | null;
  return {
    data: row?.conditions ?? null,
    found: row != null,
    error: null,
  };
}

export async function upsertLiveConditions(
  client: SupabaseLikeClient,
  conditions: RiverLiveConditions,
): Promise<RiverRunStorageResult<RiverLiveConditions>> {
  const row: RiverLiveConditionsRow = {
    river_id: conditions.riverId,
    local_date: conditions.localDate,
    refresh_slot: conditions.refreshSlot,
    data_version: conditions.dataVersion,
    refreshed_at: conditions.refreshedAt,
    conditions,
  };
  const response = await client
    .from(LIVE_CONDITIONS_TABLE)
    .upsert(row, {
      onConflict: "river_id,local_date,refresh_slot,data_version",
    })
    .select()
    .maybeSingle();
  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  const stored = response.data as RiverLiveConditionsRow | null;
  return {
    data: stored?.conditions ?? conditions,
    found: stored != null,
    error: null,
  };
}

export async function getSeasonalContext(
  client: SupabaseLikeClient,
  key: Omit<RiverMetricSeasonalContextRow, "context">,
): Promise<RiverRunStorageResult<RiverLiveSeasonalContext>> {
  const response = await client
    .from(SEASONAL_CONTEXTS_TABLE)
    .select()
    .eq("river_id", key.river_id)
    .eq("source_id", key.source_id)
    .eq("metric", key.metric)
    .eq("day_of_year", key.day_of_year)
    .eq("baseline_version", key.baseline_version)
    .maybeSingle();
  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  const row = response.data as RiverMetricSeasonalContextRow | null;
  return { data: row?.context ?? null, found: row != null, error: null };
}

export async function upsertSeasonalContext(
  client: SupabaseLikeClient,
  row: RiverMetricSeasonalContextRow,
): Promise<RiverRunStorageResult<RiverLiveSeasonalContext>> {
  const response = await client
    .from(SEASONAL_CONTEXTS_TABLE)
    .upsert(row, {
      onConflict: "river_id,source_id,metric,day_of_year,baseline_version",
    })
    .select()
    .maybeSingle();
  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  const stored = response.data as RiverMetricSeasonalContextRow | null;
  return {
    data: stored?.context ?? row.context,
    found: stored != null,
    error: null,
  };
}
