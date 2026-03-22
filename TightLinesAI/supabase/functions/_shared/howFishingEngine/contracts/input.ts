/**
 * Shared engine input — ENGINE_REBUILD_MASTER_PLAN § Shared input contract
 * Optional fields beyond the doc snippet are allowed for richer normalization (e.g. precip rate).
 */

import type { EngineContext } from "./context.ts";
import type { RegionKey } from "./region.ts";

export type SharedEngineRequest = {
  latitude: number;
  longitude: number;
  state_code: string | null;
  region_key: RegionKey;
  local_date: string;
  local_timezone: string;
  context: EngineContext;
  environment: {
    current_air_temp_f?: number | null;
    daily_mean_air_temp_f?: number | null;
    prior_day_mean_air_temp_f?: number | null;
    day_minus_2_mean_air_temp_f?: number | null;
    pressure_mb?: number | null;
    pressure_history_mb?: number[] | null;
    wind_speed_mph?: number | null;
    cloud_cover_pct?: number | null;
    precip_24h_in?: number | null;
    precip_72h_in?: number | null;
    precip_7d_in?: number | null;
    active_precip_now?: boolean | null;
    /** Optional — improves precip disruption when present */
    precip_rate_now_in_per_hr?: number | null;
    tide_movement_state?: string | null;
    tide_station_id?: string | null;
    /** Strongest current speed (kt) today when available */
    current_speed_knots_max?: number | null;
    /** Hourly tide height (ft) for 3h swing — optional */
    tide_height_hourly_ft?: number[] | null;
    /** CO-OPS high/low events for intra-day movement proxy */
    tide_high_low?: Array<{ time: string; value: number; type?: string }> | null;
    sunrise_local?: string | null;
    sunset_local?: string | null;
    solunar_peak_local?: string[] | null;
  };
  data_coverage: {
    source_notes?: string[];
  };
};
