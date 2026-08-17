import type { RiverRunReasonCode } from "../types.ts";
import type {
  RiverRunStorageResult,
  StoredConditionRefresh,
  SupabaseLikeClient,
} from "./types.ts";
import { storageError } from "./types.ts";

export const TIMING_OBSERVATIONS_TABLE = "river_run_timing_observations";
export const TIMING_OBSERVATIONS_ON_CONFLICT =
  "river_id,run_id,local_date,refresh_slot,gauge_site_id,temperature_source_id";

export type RiverRunTimingObservationRow = {
  river_id: string;
  run_id: string;
  local_date: string;
  refresh_slot: string;
  observation_at: string;
  gauge_metric: "flow_cfs" | "gage_height_ft";
  gauge_site_id: string;
  gauge_value: number | null;
  gauge_freshness: string;
  temperature_source_id: string;
  water_temp_f: number | null;
  temperature_freshness: string;
  reason_codes: RiverRunReasonCode[];
  provenance: Record<string, unknown>;
};

export function timingObservationFromConditionRefresh(
  refresh: StoredConditionRefresh,
): RiverRunTimingObservationRow | null {
  const gauge = refresh.sourceMetrics.gauge;
  const temperature = refresh.sourceMetrics.conditionsWaterTemperature;
  if (
    !gauge?.siteId || !gauge.primaryMetric ||
    !temperature?.sourceId
  ) return null;
  return {
    river_id: refresh.riverId,
    run_id: refresh.runId,
    local_date: refresh.localDate,
    refresh_slot: refresh.refreshSlot,
    observation_at: refresh.conditionRefreshAt,
    gauge_metric: gauge.primaryMetric,
    gauge_site_id: gauge.siteId,
    gauge_value: finiteOrNull(gauge.value),
    gauge_freshness: refresh.freshness.gauge,
    temperature_source_id: temperature.sourceId,
    water_temp_f: finiteOrNull(temperature.waterTempF),
    temperature_freshness: refresh.freshness.conditionsWaterTemperature,
    reason_codes: refresh.reasonCodes,
    provenance: {
      kind: "condition_refresh",
      engineVersion: refresh.engineVersion,
      configVersion: refresh.configVersion,
      gauge,
      temperature,
    },
  };
}

export async function upsertTimingObservationFromConditionRefresh(
  client: SupabaseLikeClient,
  refresh: StoredConditionRefresh,
): Promise<RiverRunStorageResult<RiverRunTimingObservationRow>> {
  const row = timingObservationFromConditionRefresh(refresh);
  if (!row) return { data: null, found: false, error: null };
  const response = await client
    .from(TIMING_OBSERVATIONS_TABLE)
    .upsert(row, { onConflict: TIMING_OBSERVATIONS_ON_CONFLICT })
    .select()
    .maybeSingle();
  const error = storageError(response.error);
  if (error) return { data: null, found: false, error };
  return {
    data: response.data as RiverRunTimingObservationRow | null,
    found: Boolean(response.data),
    error: null,
  };
}

export async function readTimingObservations(
  client: SupabaseLikeClient,
  key: {
    riverId: string;
    runId: string;
    startDate: string;
    endDate: string;
  },
): Promise<RiverRunStorageResult<RiverRunTimingObservationRow[]>> {
  const query = client
    .from(TIMING_OBSERVATIONS_TABLE)
    .select(
      "river_id,run_id,local_date,refresh_slot,observation_at,gauge_metric,gauge_site_id,gauge_value,gauge_freshness,temperature_source_id,water_temp_f,temperature_freshness,reason_codes,provenance",
    )
    .eq("river_id", key.riverId)
    .eq("run_id", key.runId)
    .gte("local_date", key.startDate)
    .lte("local_date", key.endDate)
    .order("observation_at", { ascending: true })
    .limit(1000);
  const result = await (query as unknown as Promise<{
    data: RiverRunTimingObservationRow[] | null;
    error: null | { message?: string; code?: string; details?: unknown };
  }>);
  const error = storageError(result.error);
  if (error) return { data: null, found: false, error };
  const data = result.data ?? [];
  return { data, found: data.length > 0, error: null };
}

function finiteOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
