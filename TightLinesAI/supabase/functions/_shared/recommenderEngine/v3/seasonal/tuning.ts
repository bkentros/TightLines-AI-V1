import type {
  FlyArchetypeIdV3,
  ForageBucketV3,
  LureArchetypeIdV3,
  RecommenderV3ArchetypeId,
  RecommenderV3MonthlyBaselineProfile,
  RecommenderV3SeasonalRow,
  SeasonalWaterColumnV3,
  TacticalColumnV3,
  TacticalPaceV3,
  TacticalPresenceV3,
} from "../contracts.ts";

/** Authoring-time water column before regional/month shifts. */
export type AuthoredWaterColumn = "top" | "shallow" | "mid" | "bottom";

export type BaseMood =
  | "dormant"
  | "negative"
  | "neutral_subtle"
  | "neutral"
  | "active"
  | "aggressive";

export type BasePresentationStyle =
  | "subtle"
  | "leaning_subtle"
  | "balanced"
  | "leaning_bold"
  | "bold";

export type AuthoredSeasonalCore = {
  base_water_column: AuthoredWaterColumn;
  base_mood: BaseMood;
  base_presentation_style: BasePresentationStyle;
  primary_forage: RecommenderV3SeasonalRow["monthly_baseline"]["primary_forage"];
  secondary_forage?: RecommenderV3SeasonalRow["monthly_baseline"]["secondary_forage"];
  primary_lure_archetypes?: readonly LureArchetypeIdV3[];
  viable_lure_archetypes: readonly LureArchetypeIdV3[];
  primary_fly_archetypes?: readonly FlyArchetypeIdV3[];
  viable_fly_archetypes: readonly FlyArchetypeIdV3[];
  /** Declared biology: when false, eligible pools must not include surface archetypes. */
  surface_seasonally_possible: boolean;
};

const SEASONAL_COLUMN_ORDER: readonly SeasonalWaterColumnV3[] = [
  "low",
  "mid_low",
  "mid",
  "high",
  "top",
] as const;

export function baseSeasonalWaterColumn(
  base: AuthoredWaterColumn,
): SeasonalWaterColumnV3 {
  switch (base) {
    case "top":
      return "top";
    case "shallow":
      return "high";
    case "mid":
      return "mid";
    case "bottom":
    default:
      return "low";
  }
}

export function shiftSeasonalWaterColumn(
  base: SeasonalWaterColumnV3,
  delta: -2 | -1 | 0 | 1 | 2,
): SeasonalWaterColumnV3 {
  const start = SEASONAL_COLUMN_ORDER.indexOf(base);
  if (start === -1) return base;
  const next = Math.max(
    0,
    Math.min(SEASONAL_COLUMN_ORDER.length - 1, start + delta),
  );
  return SEASONAL_COLUMN_ORDER[next]!;
}

/** Deterministic seasonal pool: unique ids, lexicographic order. */
export function sortEligibleArchetypeIds<T extends string>(
  viable: readonly T[],
): readonly T[] {
  return [...new Set(viable)].sort((a, b) => a.localeCompare(b));
}

export const V3_SURFACE_ARCHETYPE_IDS = new Set<RecommenderV3ArchetypeId>([
  "walking_topwater",
  "popping_topwater",
  "buzzbait",
  "prop_bait",
  "hollow_body_frog",
  "popper_fly",
  "frog_fly",
  "mouse_fly",
]);

/** Allowed tactical columns for the resolved seasonal water column and surface biology. */
export function allowedColumnsForSeasonalColumn(
  column: SeasonalWaterColumnV3,
  surfaceSeasonallyPossible: boolean,
): readonly TacticalColumnV3[] {
  switch (column) {
    case "top":
      return surfaceSeasonallyPossible
        ? ["surface", "upper", "mid"]
        : ["upper", "mid"];
    case "high":
      return surfaceSeasonallyPossible
        ? ["surface", "upper", "mid"]
        : ["upper", "mid"];
    case "mid":
      return surfaceSeasonallyPossible
        ? ["surface", "upper", "mid", "bottom"]
        : ["upper", "mid", "bottom"];
    case "mid_low":
      return ["mid", "bottom"];
    case "low":
    default:
      return ["bottom", "mid"];
  }
}

/**
 * Preference order for scoring within the monthly allowed column window.
 * Must be a permutation-style ordering using only values from
 * `allowedColumnsForSeasonalColumn` (subset, no extras).
 */
export function columnPreferenceOrderForSeasonalColumn(
  column: SeasonalWaterColumnV3,
  surfaceSeasonallyPossible: boolean,
): readonly TacticalColumnV3[] {
  const allowed = new Set(
    allowedColumnsForSeasonalColumn(column, surfaceSeasonallyPossible),
  );
  const pick = (order: readonly TacticalColumnV3[]): readonly TacticalColumnV3[] =>
    order.filter((c) => allowed.has(c));
  switch (column) {
    case "top":
      return pick(
        surfaceSeasonallyPossible
          ? ["surface", "upper", "mid"]
          : ["upper", "mid"],
      );
    case "high":
      return pick(
        surfaceSeasonallyPossible
          ? ["upper", "mid", "surface"]
          : ["upper", "mid"],
      );
    case "mid":
      return pick(
        surfaceSeasonallyPossible
          ? ["mid", "upper", "bottom", "surface"]
          : ["mid", "bottom", "upper"],
      );
    case "mid_low":
      return pick(["bottom", "mid"]);
    case "low":
    default:
      return pick(["bottom", "mid"]);
  }
}

export function allowedPacesForMood(
  mood: BaseMood,
): readonly TacticalPaceV3[] {
  switch (mood) {
    case "dormant":
      return ["slow"];
    case "negative":
      return ["slow", "medium"];
    case "neutral_subtle":
      return ["slow", "medium"];
    case "neutral":
      return ["slow", "medium", "fast"];
    case "active":
      return ["medium", "fast"];
    case "aggressive":
      return ["medium", "fast"];
    default: {
      const _x: never = mood;
      return _x;
    }
  }
}

export function pacePreferenceOrderForMood(
  mood: BaseMood,
): readonly TacticalPaceV3[] {
  const allowed = new Set(allowedPacesForMood(mood));
  const pick = (order: readonly TacticalPaceV3[]): readonly TacticalPaceV3[] =>
    order.filter((p) => allowed.has(p));
  switch (mood) {
    case "dormant":
      return pick(["slow"]);
    case "negative":
      return pick(["slow", "medium"]);
    case "neutral_subtle":
      return pick(["medium", "slow"]);
    case "neutral":
      return pick(["medium", "slow", "fast"]);
    case "active":
      return pick(["medium", "fast"]);
    case "aggressive":
      return pick(["fast", "medium"]);
    default: {
      const _x: never = mood;
      return _x;
    }
  }
}

export function allowedPresenceForStyle(
  style: BasePresentationStyle,
): readonly TacticalPresenceV3[] {
  switch (style) {
    case "subtle":
      return ["subtle"];
    case "leaning_subtle":
      return ["subtle", "moderate"];
    case "balanced":
      return ["subtle", "moderate", "bold"];
    case "leaning_bold":
      return ["moderate", "bold"];
    case "bold":
      return ["bold"];
    default: {
      const _x: never = style;
      return _x;
    }
  }
}

export function presencePreferenceOrderForStyle(
  style: BasePresentationStyle,
): readonly TacticalPresenceV3[] {
  const allowed = new Set(allowedPresenceForStyle(style));
  const pick = (order: readonly TacticalPresenceV3[]): readonly TacticalPresenceV3[] =>
    order.filter((p) => allowed.has(p));
  switch (style) {
    case "subtle":
      return pick(["subtle"]);
    case "leaning_subtle":
      return pick(["subtle", "moderate"]);
    case "balanced":
      return pick(["moderate", "subtle", "bold"]);
    case "leaning_bold":
      return pick(["moderate", "bold"]);
    case "bold":
      return pick(["bold"]);
    default: {
      const _x: never = style;
      return _x;
    }
  }
}

export function buildMonthlyBaselineProfile(options: {
  typical_seasonal_water_column: SeasonalWaterColumnV3;
  typical_seasonal_location: RecommenderV3SeasonalRow["monthly_baseline"]["typical_seasonal_location"];
  base_mood: BaseMood;
  base_presentation_style: BasePresentationStyle;
  primary_forage: ForageBucketV3;
  secondary_forage?: ForageBucketV3;
  surface_seasonally_possible: boolean;
}): RecommenderV3MonthlyBaselineProfile {
  const surfaceSeasonallyPossible = options.surface_seasonally_possible;
  const allowed_columns = allowedColumnsForSeasonalColumn(
    options.typical_seasonal_water_column,
    surfaceSeasonallyPossible,
  );
  const column_preference_order = columnPreferenceOrderForSeasonalColumn(
    options.typical_seasonal_water_column,
    surfaceSeasonallyPossible,
  );
  const allowed_paces = allowedPacesForMood(options.base_mood);
  const pace_preference_order = pacePreferenceOrderForMood(options.base_mood);
  const allowed_presence = allowedPresenceForStyle(options.base_presentation_style);
  const presence_preference_order = presencePreferenceOrderForStyle(
    options.base_presentation_style,
  );

  return {
    allowed_columns,
    column_preference_order,
    allowed_paces,
    pace_preference_order,
    allowed_presence,
    presence_preference_order,
    surface_seasonally_possible: surfaceSeasonallyPossible,
    primary_forage: options.primary_forage,
    secondary_forage: options.secondary_forage,
    typical_seasonal_water_column: options.typical_seasonal_water_column,
    typical_seasonal_location: options.typical_seasonal_location,
  };
}

function seasonalRowKey(row: RecommenderV3SeasonalRow): string {
  return [row.species, row.region_key, row.month, row.context].join("|");
}

/**
 * Seasonal authoring can intentionally override a prior row for the same
 * species/region/month/context key. Using a keyed registry keeps the exported
 * tables unique and makes the replacement explicit at construction time.
 */
export function upsertSeasonalRow(
  rows: Map<string, RecommenderV3SeasonalRow>,
  row: RecommenderV3SeasonalRow,
): void {
  rows.set(seasonalRowKey(row), row);
}

export function finalizeSeasonalRows(
  rows: Map<string, RecommenderV3SeasonalRow>,
): readonly RecommenderV3SeasonalRow[] {
  return [...rows.values()];
}

export function assertNoDuplicateSeasonalRows(
  rows: readonly RecommenderV3SeasonalRow[],
  label: string,
): void {
  const seen = new Set<string>();
  for (const row of rows) {
    const key = seasonalRowKey(row);
    if (seen.has(key)) {
      throw new Error(`${label} contains duplicate seasonal row key '${key}'.`);
    }
    seen.add(key);
  }
}
