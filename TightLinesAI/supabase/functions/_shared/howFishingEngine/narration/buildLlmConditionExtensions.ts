import type { SharedEngineRequest } from "../contracts/input.ts";
import type { EngineContext } from "../contracts/mod.ts";
import type { SharedNormalizedOutput } from "../contracts/normalized.ts";
import type {
  LlmCompositeContribution,
  LlmEnvironmentSnapshot,
  LlmNormalizedVariableScore,
  LlmPressureHistorySummary,
} from "../contracts/report.ts";
import { buildSkyNarrationContract } from "./skyNarrationContract.ts";
import type { ScoredVariableKey } from "../contracts/variables.ts";
import { isScoredVariableKey } from "../contracts/variables.ts";
import type { ActiveVariableScore } from "../score/types.ts";

function summarizePressureHistory(mb: number[] | null | undefined): LlmPressureHistorySummary | null {
  if (!mb || mb.length === 0) return null;
  const first = mb[0]!;
  const last = mb[mb.length - 1]!;
  let min = first;
  let max = first;
  for (const v of mb) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return {
    sample_count: mb.length,
    first_mb: first,
    last_mb: last,
    min_mb: min,
    max_mb: max,
  };
}

function normalizedEntryForKey(
  key: ScoredVariableKey,
  n: SharedNormalizedOutput["normalized"],
): LlmNormalizedVariableScore | null {
  switch (key) {
    case "temperature_condition": {
      const t = n.temperature;
      if (!t) return null;
      return {
        variable_key: key,
        engine_score: t.final_score,
        engine_label: t.band_label,
        engine_detail: null,
        temperature_breakdown: t,
      };
    }
    case "pressure_regime": {
      const p = n.pressure_regime;
      if (!p) return null;
      return {
        variable_key: key,
        engine_score: p.score,
        engine_label: p.label,
        engine_detail: p.detail ?? null,
      };
    }
    case "wind_condition": {
      const w = n.wind_condition;
      if (!w) return null;
      return {
        variable_key: key,
        engine_score: w.score,
        engine_label: w.label,
        engine_detail: w.detail ?? null,
      };
    }
    case "light_cloud_condition": {
      const l = n.light_cloud_condition;
      if (!l) return null;
      return {
        variable_key: key,
        engine_score: l.score,
        engine_label: l.label,
        engine_detail: l.detail ?? null,
      };
    }
    case "precipitation_disruption": {
      const pr = n.precipitation_disruption;
      if (!pr) return null;
      return {
        variable_key: key,
        engine_score: pr.score,
        engine_label: pr.label,
        engine_detail: pr.detail ?? null,
      };
    }
    case "runoff_flow_disruption": {
      const r = n.runoff_flow_disruption;
      if (!r) return null;
      return {
        variable_key: key,
        engine_score: r.score,
        engine_label: r.label,
        engine_detail: r.detail ?? null,
      };
    }
    case "tide_current_movement": {
      const ti = n.tide_current_movement;
      if (!ti) return null;
      return {
        variable_key: key,
        engine_score: ti.score,
        engine_label: ti.label,
        engine_detail: ti.detail ?? null,
      };
    }
    default:
      return null;
  }
}

function buildNormalizedVariableScores(
  norm: SharedNormalizedOutput,
): LlmNormalizedVariableScore[] {
  const out: LlmNormalizedVariableScore[] = [];
  for (const key of norm.available_variables) {
    if (!isScoredVariableKey(key)) continue;
    const e = normalizedEntryForKey(key, norm.normalized);
    if (e) out.push(e);
  }
  return out;
}

function buildCompositeContributions(contributions: ActiveVariableScore[]): LlmCompositeContribution[] {
  return contributions.map((c) => ({
    variable_key: c.key,
    normalized_score: c.score,
    weight: c.weight,
    weight_percent: Math.round(c.weight * 10_000) / 100,
    weighted_contribution: c.weightedContribution,
  }));
}

function buildEnvironmentSnapshot(
  env: SharedEngineRequest["environment"],
  context: EngineContext,
): LlmEnvironmentSnapshot {
  return {
    current_air_temp_f: env.current_air_temp_f ?? null,
    daily_mean_air_temp_f: env.daily_mean_air_temp_f ?? null,
    prior_day_mean_air_temp_f: env.prior_day_mean_air_temp_f ?? null,
    day_minus_2_mean_air_temp_f: env.day_minus_2_mean_air_temp_f ?? null,
    pressure_mb: env.pressure_mb ?? null,
    wind_speed_mph: env.wind_speed_mph ?? null,
    cloud_cover_pct: env.cloud_cover_pct ?? null,
    precip_24h_in: env.precip_24h_in ?? null,
    precip_72h_in: env.precip_72h_in ?? null,
    precip_7d_in: env.precip_7d_in ?? null,
    active_precip_now: env.active_precip_now ?? null,
    precip_rate_now_in_per_hr: env.precip_rate_now_in_per_hr ?? null,
    tide_movement_state: env.tide_movement_state ?? null,
    tide_station_id: env.tide_station_id ?? null,
    current_speed_knots_max: env.current_speed_knots_max ?? null,
    sunrise_local: env.sunrise_local ?? null,
    sunset_local: env.sunset_local ?? null,
    solunar_peak_count: env.solunar_peak_local != null ? env.solunar_peak_local.length : null,
    hourly_air_temp_sample_count: env.hourly_air_temp_f != null ? env.hourly_air_temp_f.length : null,
    hourly_cloud_cover_sample_count: env.hourly_cloud_cover_pct != null
      ? env.hourly_cloud_cover_pct.length
      : null,
    pressure_history_summary: summarizePressureHistory(env.pressure_history_mb ?? undefined),
    tide_high_low_event_count: env.tide_high_low != null ? env.tide_high_low.length : null,
    sky_narration_contract: buildSkyNarrationContract(env.cloud_cover_pct, context),
  };
}

/** Deterministic structured facts for narration — never use stochastic driver lines here. */
export function buildLlmConditionExtensions(
  norm: SharedNormalizedOutput,
  contributions: ActiveVariableScore[],
  environment: SharedEngineRequest["environment"],
  context: EngineContext,
): {
  normalized_variable_scores: LlmNormalizedVariableScore[];
  composite_contributions: LlmCompositeContribution[];
  environment_snapshot: LlmEnvironmentSnapshot;
} {
  return {
    normalized_variable_scores: buildNormalizedVariableScores(norm),
    composite_contributions: buildCompositeContributions(contributions),
    environment_snapshot: buildEnvironmentSnapshot(environment, context),
  };
}
