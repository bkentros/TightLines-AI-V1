import type { EngineContext, VariableState } from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import { clampEngineScore, pieceLinear } from "../score/engineScoreMath.ts";

/**
 * Precipitation disruption — same label buckets as V1; scores tapered within buckets.
 */
export function normalizePrecipitationDisruption(
  context: Extract<EngineContext, "freshwater_lake_pond" | "coastal">,
  rateNow: number | null | undefined,
  p24: number | null | undefined,
  p72: number | null | undefined,
  activeNow: boolean | null | undefined,
): VariableState | null {
  const hasSignal =
    p24 != null || p72 != null || rateNow != null || activeNow === true;
  if (!hasSignal) return null;

  const rate = rateNow ?? 0;
  const r24 = p24 ?? 0;
  const r72 = p72 ?? 0;

  if (isCoastalFamilyContext(context)) {
    if (rate >= 0.12 || r24 >= 1.1 || r72 >= 2.2 || activeNow === true) {
      const sev = Math.max(
        rate / 0.12,
        r24 / 1.1,
        r72 / 2.2,
        activeNow === true ? 1 : 0,
      );
      const score = clampEngineScore(
        pieceLinear(Math.min(sev, 3), 1, 2.6, -1.05, -2),
      );
      return { label: "active_disruption", score };
    }
    if (
      (rate >= 0.03 && rate < 0.12) ||
      (r24 >= 0.2 && r24 < 1.1) ||
      (r72 >= 0.6 && r72 < 2.2)
    ) {
      const ur = rate >= 0.03 && rate < 0.12
        ? pieceLinear(rate, 0.03, 0.12, 0, 1)
        : 0;
      const u24 = r24 >= 0.2 && r24 < 1.1
        ? pieceLinear(r24, 0.2, 1.1, 0, 1)
        : 0;
      const u72 = r72 >= 0.6 && r72 < 2.2
        ? pieceLinear(r72, 0.6, 2.2, 0, 1)
        : 0;
      const u = Math.max(ur, u24, u72);
      const score = clampEngineScore(pieceLinear(u, 0, 1, -0.35, -1.1));
      return { label: "recent_rain", score };
    }
    if (r24 < 0.01 && r72 < 0.01 && rate < 0.01) {
      return { label: "extended_dry", score: 2 };
    }
    const dryness = Math.max(r24, r72, rate);
    const score = clampEngineScore(
      pieceLinear(dryness, 0, 0.35, 1.85, 0.95),
    );
    return { label: "dry_stable", score };
  }

  if (rate >= 0.1 || r24 >= 0.75 || r72 >= 1.5 || activeNow === true) {
    const sev = Math.max(
      rate / 0.1,
      r24 / 0.75,
      r72 / 1.5,
      activeNow === true ? 1 : 0,
    );
    const score = clampEngineScore(
      pieceLinear(Math.min(sev, 3), 1, 2.6, -1.05, -2),
    );
    return { label: "active_disruption", score };
  }
  if (
    (rate >= 0.02 && rate < 0.1) ||
    (r24 >= 0.1 && r24 < 0.75) ||
    (r72 >= 0.35 && r72 < 1.5)
  ) {
    const ur = rate >= 0.02 && rate < 0.1
      ? pieceLinear(rate, 0.02, 0.1, 0, 1)
      : 0;
    const u24 = r24 >= 0.1 && r24 < 0.75
      ? pieceLinear(r24, 0.1, 0.75, 0, 1)
      : 0;
    const u72 = r72 >= 0.35 && r72 < 1.5
      ? pieceLinear(r72, 0.35, 1.5, 0, 1)
      : 0;
    const u = Math.max(ur, u24, u72);
    const score = clampEngineScore(pieceLinear(u, 0, 1, -0.35, -1.1));
    return { label: "recent_rain", score };
  }
  if (r24 < 0.01 && r72 < 0.01 && rate < 0.01) {
    return { label: "extended_dry", score: 2 };
  }
  const dryness = Math.max(r24, r72, rate);
  const score = clampEngineScore(
    pieceLinear(dryness, 0, 0.3, 1.85, 0.95),
  );
  return { label: "dry_stable", score };
}
