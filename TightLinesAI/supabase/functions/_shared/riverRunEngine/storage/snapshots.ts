import type {
  RiverRunDailySnapshotRow,
  RiverRunStorageResult,
  StoredDailySnapshot,
  SupabaseLikeClient,
} from "./types.ts";
import { storageError } from "./types.ts";

export const DAILY_SNAPSHOT_TABLE = "river_run_daily_progression_snapshots";
export const DAILY_SNAPSHOT_ON_CONFLICT =
  "river_id,run_id,local_date,engine_version,config_version";

export function serializeDailySnapshot(
  snapshot: StoredDailySnapshot,
): RiverRunDailySnapshotRow {
  return {
    river_id: snapshot.riverId,
    run_id: snapshot.runId,
    local_date: snapshot.localDate,
    timezone: snapshot.timezone,
    progression_snapshot_at: snapshot.progressionSnapshotAt,
    run_stage: snapshot.runStage,
    conditions_suggest: snapshot.conditionsSuggest,
    fish_in_river: snapshot.fishInRiver,
    evidence_summaries: snapshot.evidenceSummaries,
    source_dates: snapshot.sourceDates,
    source_refresh_slots: snapshot.sourceRefreshSlots,
    reason_codes: snapshot.reasonCodes,
    engine_version: snapshot.engineVersion,
    config_version: snapshot.configVersion,
  };
}

export function deserializeDailySnapshot(
  row: RiverRunDailySnapshotRow,
): StoredDailySnapshot {
  return {
    riverId: row.river_id,
    runId: row.run_id,
    localDate: row.local_date,
    timezone: row.timezone,
    progressionSnapshotAt: row.progression_snapshot_at,
    runStage: row.run_stage,
    conditionsSuggest: row.conditions_suggest,
    fishInRiver: row.fish_in_river,
    evidenceSummaries: row.evidence_summaries,
    sourceDates: row.source_dates,
    sourceRefreshSlots: row.source_refresh_slots,
    reasonCodes: row.reason_codes,
    engineVersion: row.engine_version,
    configVersion: row.config_version,
  };
}

export async function upsertDailySnapshot(
  client: SupabaseLikeClient,
  snapshot: StoredDailySnapshot,
): Promise<RiverRunStorageResult<StoredDailySnapshot>> {
  const response = await client
    .from(DAILY_SNAPSHOT_TABLE)
    .upsert(serializeDailySnapshot(snapshot), {
      onConflict: DAILY_SNAPSHOT_ON_CONFLICT,
    })
    .select()
    .maybeSingle();

  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  if (!response.data) return { data: null, found: false, error: null };
  return {
    data: deserializeDailySnapshot(response.data as RiverRunDailySnapshotRow),
    found: true,
    error: null,
  };
}

export async function getDailySnapshot(
  client: SupabaseLikeClient,
  key: {
    riverId: string;
    runId: string;
    localDate: string;
    engineVersion: string;
    configVersion: string;
  },
): Promise<RiverRunStorageResult<StoredDailySnapshot>> {
  const response = await client
    .from(DAILY_SNAPSHOT_TABLE)
    .select()
    .eq("river_id", key.riverId)
    .eq("run_id", key.runId)
    .eq("local_date", key.localDate)
    .eq("engine_version", key.engineVersion)
    .eq("config_version", key.configVersion)
    .maybeSingle();

  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  if (!response.data) return { data: null, found: false, error: null };
  return {
    data: deserializeDailySnapshot(response.data as RiverRunDailySnapshotRow),
    found: true,
    error: null,
  };
}
