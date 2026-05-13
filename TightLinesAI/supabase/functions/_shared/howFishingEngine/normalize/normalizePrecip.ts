import type { EngineContext, VariableState } from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import { clampEngineScore, pieceLinear } from "../score/engineScoreMath.ts";

type PrecipContext = Extract<
  EngineContext,
  "freshwater_lake_pond" | "coastal" | "coastal_flats_estuary"
>;

function finiteWindow(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function finiteRate(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function maxPresent(...values: Array<number | null>): number {
  return Math.max(0, ...values.filter((v): v is number => v != null));
}

function wetBaselineScore(
  context: PrecipContext,
  p7d: number,
): number {
  const coastal = isCoastalFamilyContext(context);
  const flats = context === "coastal_flats_estuary";
  const start = flats ? 1.15 : coastal ? 1.5 : 1.35;
  const saturated = flats ? 4.0 : coastal ? 5.0 : 4.5;
  return clampEngineScore(pieceLinear(p7d, start, saturated, -0.15, -1.05));
}

/**
 * Precipitation disruption V2 is production-wired.
 *
 * Public output shape and exported function signature are unchanged. Rollback is
 * limited to restoring the previous function body; callers should not change.
 */
export function normalizePrecipitationDisruption(
  context: PrecipContext,
  rateNow: number | null | undefined,
  p24: number | null | undefined,
  p72: number | null | undefined,
  activeNow: boolean | null | undefined,
  p7d?: number | null,
): VariableState | null {
  const hasRate = finiteRate(rateNow);
  const has24 = finiteWindow(p24);
  const has72 = finiteWindow(p72);
  const has7d = finiteWindow(p7d);
  const hasActiveSignal = activeNow === true && (hasRate || has24 || has72);
  const hasSignal = hasRate || has24 || has72 || has7d || hasActiveSignal;
  if (!hasSignal) return null;

  const coastal = isCoastalFamilyContext(context);
  const flats = context === "coastal_flats_estuary";
  const rate = hasRate ? rateNow : null;
  const r24 = has24 ? p24 : null;
  const r72 = has72 ? p72 : null;
  const r7d = has7d ? p7d : null;
  const hasActiveOrRateSignal = activeNow === true || (rate ?? 0) > 0;
  const wetBaseline = r7d != null &&
    r7d >= (flats ? 1.15 : coastal ? 1.5 : 1.35);

  if (!hasActiveOrRateSignal && (!has24 || !has72)) {
    return null;
  }

  const heavyRate = coastal ? 0.12 : 0.10;
  const heavy24 = flats ? 0.85 : coastal ? 1.1 : 0.75;
  const heavy72 = flats ? 1.7 : coastal ? 2.2 : 1.5;
  if (
    (rate != null && rate >= heavyRate) ||
    (r24 != null && r24 >= heavy24) ||
    (r72 != null && r72 >= heavy72)
  ) {
    const sev = maxPresent(
      rate != null ? rate / heavyRate : null,
      r24 != null ? r24 / heavy24 : null,
      r72 != null ? r72 / heavy72 : null,
    );
    return {
      label: "active_disruption",
      score: clampEngineScore(
        pieceLinear(Math.min(sev, 2.5), 1, 2.5, -1.1, -2),
      ),
    };
  }

  const moderateRate = coastal ? 0.045 : 0.04;
  const moderate24 = flats ? 0.24 : coastal ? 0.28 : 0.25;
  const moderate72 = flats ? 0.55 : coastal ? 0.7 : 0.55;
  if (
    (rate != null && rate >= moderateRate) ||
    (r24 != null && r24 >= moderate24) ||
    (r72 != null && r72 >= moderate72)
  ) {
    const u = maxPresent(
      rate != null && rate >= moderateRate
        ? pieceLinear(rate, moderateRate, heavyRate, 0, 1)
        : null,
      r24 != null && r24 >= moderate24
        ? pieceLinear(r24, moderate24, heavy24, 0, 1)
        : null,
      r72 != null && r72 >= moderate72
        ? pieceLinear(r72, moderate72, heavy72, 0, 1)
        : null,
      wetBaseline ? 0.25 : null,
    );
    return {
      label: "recent_rain",
      score: clampEngineScore(pieceLinear(Math.min(u, 1), 0, 1, -0.25, -1.0)),
    };
  }

  if (wetBaseline) {
    return {
      label: "recent_rain",
      score: wetBaselineScore(context, r7d),
    };
  }

  if (activeNow === true || (rate ?? 0) > 0) {
    const lightScore = flats ? -0.05 : coastal ? 0 : 0.05;
    return {
      label: (rate ?? 0) < 0.015 && (r24 ?? 0) < 0.12
        ? "light_mist"
        : "recent_rain",
      score: clampEngineScore(lightScore),
    };
  }

  if (
    r24 != null && r72 != null && r7d != null &&
    r24 < 0.01 && r72 < 0.01 && r7d < 0.2
  ) {
    return {
      label: "extended_dry",
      score: clampEngineScore(coastal ? 0.08 : 0.10),
    };
  }

  if (
    r24 != null && r72 != null && r24 >= 0.01 &&
    r24 < (coastal ? 0.2 : 0.15)
  ) {
    const damp = maxPresent(
      r24 / 0.2,
      r72 / 0.45,
      r7d != null ? r7d / 1.0 : null,
    );
    return {
      label: "light_mist",
      score: clampEngineScore(
        pieceLinear(Math.min(damp, 1), 0, 1, 0.06, -0.12),
      ),
    };
  }

  if (!has24 || !has72 || !has7d) return null;

  return {
    label: "dry_stable",
    score: clampEngineScore(coastal ? 0.06 : 0.08),
  };
}
