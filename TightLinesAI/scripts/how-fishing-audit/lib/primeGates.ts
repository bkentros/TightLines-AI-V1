/**
 * Input-space "prime day" gates for audit expectations — NOT the engine score.
 * Use to decide whether a historical date deserves expect_band Good/Excellent before running regression.
 *
 * Aligns with MSL pressure history (same contract as get-environment / normalizePressure).
 */
import type { EngineContext } from "../../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import { normalizePressureDetailed } from "../../../supabase/functions/_shared/howFishingEngine/normalize/normalizePressure.ts";

export type PrimeTier = "excellent_stack" | "good_stack" | "not_prime";

export type PrimeGateResult = {
  tier: PrimeTier;
  /** Human-readable pass/fail for scenario notes */
  passes_prime_bar: boolean;
  pressure_label: string | null;
  reasons_ok: string[];
  reasons_fail: string[];
};

const WIND_MAX_EXCELLENT_MPH = 18;
const WIND_MAX_GOOD_MPH = 26;
/** 7-day precip sum at target index — rivers: avoid blown-out labeling */
const RIVER_PRECIP_7D_WARN_IN = 2.5;

export function evaluatePrimeGates(input: {
  context: EngineContext;
  pressure_history_msl: number[];
  /** Mean cloud cover % for fishing hours (e.g. 6am–8pm local) */
  cloud_cover_mean_pct: number;
  /** Max wind mph for target calendar day */
  wind_max_mph: number;
  /** Sum of daily precip inches over 7d ending target (optional) */
  precip_7d_sum_in?: number | null;
  /** Coastal: NOAA returned at least one tide event */
  has_valid_tide: boolean;
}): PrimeGateResult {
  const reasons_ok: string[] = [];
  const reasons_fail: string[] = [];

  const p = normalizePressureDetailed(input.pressure_history_msl);
  const plabel = p?.state.label ?? null;

  if (!p) {
    reasons_fail.push("pressure history missing or too short");
    return {
      tier: "not_prime",
      passes_prime_bar: false,
      pressure_label: null,
      reasons_ok,
      reasons_fail,
    };
  }

  const volatileBad = plabel === "volatile";
  const hardFall = plabel === "falling_hard";
  const excellentPressure = plabel === "falling_slow" || plabel === "falling_moderate";
  const okPressure = excellentPressure ||
    plabel === "stable_neutral" ||
    plabel === "rising_slow" ||
    plabel === "recently_stabilizing" ||
    plabel === "rising_fast";

  if (volatileBad) reasons_fail.push(`pressure volatile (${p.state.detail})`);
  else if (hardFall) reasons_fail.push(`pressure falling_hard (${p.state.detail})`);
  else {
    reasons_ok.push(`pressure ${plabel} (${p.state.detail})`);
  }

  const c = input.cloud_cover_mean_pct;
  if (c >= 15 && c <= 88) reasons_ok.push(`cloud mean ${Math.round(c)}% (usable light)`);
  else if (c < 10) reasons_fail.push(`cloud ${Math.round(c)}% (strong glare risk)`);
  else reasons_fail.push(`cloud ${Math.round(c)}% (very dim or inconsistent with “partial” stack)`);

  const w = input.wind_max_mph;
  if (w <= WIND_MAX_EXCELLENT_MPH) reasons_ok.push(`wind max ${Math.round(w)} mph`);
  else if (w <= WIND_MAX_GOOD_MPH) {
    reasons_ok.push(`wind max ${Math.round(w)} mph (ok for good-tier)`);
  } else reasons_fail.push(`wind max ${Math.round(w)} mph (too strong for prime bar)`);

  if (input.context === "freshwater_river") {
    const s7 = input.precip_7d_sum_in;
    if (s7 != null && s7 >= RIVER_PRECIP_7D_WARN_IN) {
      reasons_fail.push(`7d precip sum ${s7.toFixed(2)} in (runoff risk — verify flows before expect Good+)`);
    } else if (s7 != null) reasons_ok.push(`7d precip ${s7.toFixed(2)} in (moderate)`);
  }

  if (input.context === "coastal") {
    if (input.has_valid_tide) reasons_ok.push("tide predictions present");
    else reasons_fail.push("missing tide predictions (coastal prime stack incomplete)");
  }

  const fail = reasons_fail.length > 0;
  let tier: PrimeTier = "not_prime";
  if (
    !fail &&
    excellentPressure &&
    w <= WIND_MAX_EXCELLENT_MPH &&
    c >= 20 &&
    c <= 78 &&
    (input.context !== "coastal" || input.has_valid_tide)
  ) {
    tier = "excellent_stack";
  } else if (!fail && okPressure && !volatileBad && !hardFall && w <= WIND_MAX_GOOD_MPH) {
    tier = "good_stack";
  }

  const passes = tier !== "not_prime";

  return {
    tier,
    passes_prime_bar: passes,
    pressure_label: plabel,
    reasons_ok,
    reasons_fail,
  };
}
