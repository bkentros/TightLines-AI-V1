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

export type LastSupportivePushConditions = {
  localDate: string;
  refreshSlot: string;
  conditionRefreshAt: string;
  score: number;
  label: string;
};

export type RecentDailyPushConditions =
  | {
    localDate: string;
    status: "supportive_window";
    refreshSlot: string;
    conditionRefreshAt: string;
    score: number;
    label: string;
  }
  | {
    localDate: string;
    status: "no_supportive_window";
    score: null;
    label: "No supportive window";
  };

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

export async function getLastSupportivePushConditions(
  client: SupabaseLikeClient,
  key: {
    riverId: string;
    runId: string;
    trackingStartDate: string;
    throughDate: string;
    minimumScore: number;
    engineVersion: string;
    configVersion: string;
  },
): Promise<RiverRunStorageResult<LastSupportivePushConditions>> {
  const response = await client
    .from(CONDITION_REFRESH_TABLE)
    .select("local_date,refresh_slot,condition_refresh_at,push")
    .eq("river_id", key.riverId)
    .eq("run_id", key.runId)
    .eq("engine_version", key.engineVersion)
    .eq("config_version", key.configVersion)
    .gte("local_date", key.trackingStartDate)
    .lte("local_date", key.throughDate)
    .gte("push->score", key.minimumScore)
    .order("condition_refresh_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  if (!response.data) return { data: null, found: false, error: null };
  const row = response.data as Partial<RiverRunConditionRefreshRow>;
  const score = row.push?.score;
  if (
    typeof row.local_date !== "string" ||
    typeof row.refresh_slot !== "string" ||
    typeof row.condition_refresh_at !== "string" ||
    typeof score !== "number" ||
    !Number.isFinite(score) ||
    typeof row.push?.label !== "string"
  ) {
    return {
      data: null,
      found: false,
      error: {
        message: "Stored supportive Push history row is invalid.",
      },
    };
  }
  return {
    data: {
      localDate: row.local_date,
      refreshSlot: row.refresh_slot,
      conditionRefreshAt: row.condition_refresh_at,
      score,
      label: row.push.label,
    },
    found: true,
    error: null,
  };
}

export async function getRecentDailyPushConditions(
  client: SupabaseLikeClient,
  key: {
    riverId: string;
    runId: string;
    trackingStartDate: string;
    throughDate: string;
    maximumDays: number;
    minimumSupportiveScore: number;
    engineVersion: string;
    configVersion: string;
  },
): Promise<RiverRunStorageResult<RecentDailyPushConditions[]>> {
  const query = client
    .from(CONDITION_REFRESH_TABLE)
    .select("local_date,refresh_slot,condition_refresh_at,push")
    .eq("river_id", key.riverId)
    .eq("run_id", key.runId)
    .eq("engine_version", key.engineVersion)
    .eq("config_version", key.configVersion)
    .gte("local_date", key.trackingStartDate)
    .lte("local_date", key.throughDate)
    .order("condition_refresh_at", { ascending: false })
    // Retain enough rows for seven completed days even if the refresh cadence
    // becomes more frequent than the current four-hour schedule.
    .limit(key.maximumDays * 24);

  const result = await (query as unknown as Promise<{
    data: Partial<RiverRunConditionRefreshRow>[] | null;
    error: null | { message?: string; code?: string; details?: unknown };
  }>);
  const error = storageError(result.error);
  if (error) return { data: null, found: false, error };

  const rows = result.data ?? [];
  const days = new Map<
    string,
    {
      hasNumericRead: boolean;
      strongest?: Extract<
        RecentDailyPushConditions,
        { status: "supportive_window" }
      >;
    }
  >();
  for (const row of rows) {
    const score = row.push?.score;
    if (
      typeof row.local_date !== "string" ||
      typeof row.refresh_slot !== "string" ||
      typeof row.condition_refresh_at !== "string" ||
      (score !== null &&
        (typeof score !== "number" || !Number.isFinite(score))) ||
      typeof row.push?.label !== "string"
    ) {
      return {
        data: null,
        found: false,
        error: {
          message: "Stored daily Push history row is invalid.",
        },
      };
    }
    const day = days.get(row.local_date) ?? { hasNumericRead: false };
    if (typeof score === "number") {
      day.hasNumericRead = true;
      if (
        score >= key.minimumSupportiveScore &&
        (!day.strongest || score > day.strongest.score)
      ) {
        day.strongest = {
          localDate: row.local_date,
          status: "supportive_window",
          refreshSlot: row.refresh_slot,
          conditionRefreshAt: row.condition_refresh_at,
          score,
          label: row.push.label,
        };
      }
    }
    days.set(row.local_date, day);
  }
  const dailyReads = [...days.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .flatMap<RecentDailyPushConditions>(([localDate, day]) => {
      if (day.strongest) return [day.strongest];
      if (!day.hasNumericRead) return [];
      return [{
        localDate,
        status: "no_supportive_window",
        score: null,
        label: "No supportive window",
      }];
    })
    .slice(0, key.maximumDays);
  return {
    data: dailyReads,
    found: dailyReads.length > 0,
    error: null,
  };
}
