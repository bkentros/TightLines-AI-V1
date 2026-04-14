import type {
  RecommenderV3DailyPayload,
  RecommenderV3DailyTacticalPreference,
  RecommenderV3ResolvedProfile,
  RecommenderV3SeasonalRow,
} from "./contracts.ts";

const COLUMN_DIRECTION_ORDER = ["bottom", "mid", "upper", "surface"] as const;
const PACE_DIRECTION_ORDER = ["slow", "medium", "fast"] as const;
const PRESENCE_DIRECTION_ORDER = ["subtle", "moderate", "bold"] as const;

function directionalPreferenceOrder<T extends string>(
  canonicalOrder: readonly T[],
  baselineOrder: readonly T[],
  allowed: readonly T[],
  shift: -1 | 0 | 1,
): readonly T[] {
  const allowedSet = new Set(allowed);
  const filteredBaseline = baselineOrder.filter((item) => allowedSet.has(item));
  const filteredAllowed = [...new Set(allowed)].filter((item) =>
    canonicalOrder.includes(item)
  );

  if (filteredAllowed.length <= 1) return filteredAllowed;
  if (shift === 0 && filteredBaseline.length > 0) return filteredBaseline;

  const base = filteredBaseline[0] ?? filteredAllowed[0];
  const baseIndex = canonicalOrder.indexOf(base);
  if (baseIndex === -1) return filteredAllowed;

  const targetIndex = Math.max(
    0,
    Math.min(canonicalOrder.length - 1, baseIndex + shift),
  );
  const baselineRank = (item: T) => {
    const rank = filteredBaseline.indexOf(item);
    return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
  };
  const directionalPenalty = (index: number) => {
    if (shift > 0) return index < targetIndex ? 1 : 0;
    if (shift < 0) return index > targetIndex ? 1 : 0;
    return 0;
  };

  return [...filteredAllowed].sort((a, b) => {
    const aIndex = canonicalOrder.indexOf(a);
    const bIndex = canonicalOrder.indexOf(b);
    const aDistance = Math.abs(aIndex - targetIndex);
    const bDistance = Math.abs(bIndex - targetIndex);
    return aDistance - bDistance ||
      directionalPenalty(aIndex) - directionalPenalty(bIndex) ||
      baselineRank(a) - baselineRank(b);
  });
}

function buildDailyPreference(
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
): RecommenderV3DailyTacticalPreference {
  const baseline = seasonal.monthly_baseline;
  const filteredAllowedColumns = (
    daily.surface_allowed_today
      ? baseline.allowed_columns
      : baseline.allowed_columns.filter((column) => column !== "surface")
  );
  const columnOrder = directionalPreferenceOrder(
    COLUMN_DIRECTION_ORDER,
    baseline.column_preference_order,
    filteredAllowedColumns,
    daily.column_shift,
  );
  const paceOrder = directionalPreferenceOrder(
    PACE_DIRECTION_ORDER,
    baseline.pace_preference_order,
    baseline.allowed_paces,
    daily.pace_shift,
  );
  let presenceOrder = directionalPreferenceOrder(
    PRESENCE_DIRECTION_ORDER,
    baseline.presence_preference_order,
    baseline.allowed_presence,
    daily.presence_shift,
  );

  if (
    daily.suppress_fast_presentations &&
    !daily.high_visibility_needed &&
    presenceOrder.includes("subtle")
  ) {
    presenceOrder = [
      "subtle",
      ...presenceOrder.filter((presence) => presence !== "subtle"),
    ];
  }

  const safeColumnOrder = columnOrder.length > 0
    ? columnOrder
    : filteredAllowedColumns;
  let fallbackColumnOrder = safeColumnOrder;
  if (daily.surface_window === "rippled" && safeColumnOrder.includes("surface")) {
    const nonSurface = safeColumnOrder.filter((column) => column !== "surface");
    fallbackColumnOrder = nonSurface.length > 0
      ? [nonSurface[0]!, "surface", ...nonSurface.slice(1)]
      : safeColumnOrder;
  } else if (daily.surface_window !== "clean") {
    const nonSurface = safeColumnOrder.filter((column) => column !== "surface");
    fallbackColumnOrder = nonSurface.length > 0 ? nonSurface : safeColumnOrder;
  }

  return {
    preferred_column: fallbackColumnOrder[0] ?? "mid",
    secondary_column: fallbackColumnOrder[1],
    column_preference_order: fallbackColumnOrder,
    preferred_pace: paceOrder[0] ?? "medium",
    secondary_pace: paceOrder[1],
    pace_preference_order: paceOrder,
    preferred_presence: presenceOrder[0] ?? "moderate",
    secondary_presence: presenceOrder[1],
    presence_preference_order: presenceOrder,
    surface_allowed_today:
      baseline.surface_seasonally_possible && daily.surface_allowed_today,
    surface_window: daily.surface_window,
    reaction_window: daily.reaction_window,
    opportunity_mix: daily.opportunity_mix,
    notes: daily.notes,
  };
}

/**
 * Resolve the final tactical preference from the monthly baseline and
 * today's bounded daily shifts.
 */
export function resolveFinalProfileV3(
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
): RecommenderV3ResolvedProfile {
  return {
    monthly_baseline: seasonal.monthly_baseline,
    daily_preference: buildDailyPreference(seasonal, daily),
  };
}
