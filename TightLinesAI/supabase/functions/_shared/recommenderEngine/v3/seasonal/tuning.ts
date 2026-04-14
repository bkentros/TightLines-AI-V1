import type {
  ForageBucketV3,
  RecommenderV3ArchetypeId,
  RecommenderV3MonthlyBaselineProfile,
  RecommenderV3SeasonalRow,
  SeasonalWaterColumnV3,
  TacticalColumnV3,
  TacticalPaceV3,
  TacticalPresenceV3,
} from "../contracts.ts";

export type LegacyWaterColumn = "top" | "shallow" | "mid" | "bottom";
export type LegacyMood = "negative" | "neutral" | "active";
export type LegacyPresentationStyle = "subtle" | "balanced" | "bold";

const SEASONAL_COLUMN_ORDER: readonly SeasonalWaterColumnV3[] = [
  "low",
  "mid_low",
  "mid",
  "high",
  "top",
] as const;

export function baseSeasonalWaterColumn(
  base: LegacyWaterColumn,
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

const SURFACE_ARCHETYPE_IDS = new Set<RecommenderV3ArchetypeId>([
  "walking_topwater",
  "popping_topwater",
  "buzzbait",
  "prop_bait",
  "hollow_body_frog",
  "popper_fly",
  "frog_fly",
  "mouse_fly",
]);

function uniqueOrdered<T extends string>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function columnPreferenceOrderForSeasonalColumn(
  column: SeasonalWaterColumnV3,
  surfaceSeasonallyPossible: boolean,
): readonly TacticalColumnV3[] {
  switch (column) {
    case "top":
      return uniqueOrdered(
        surfaceSeasonallyPossible
          ? ["surface", "upper", "mid"]
          : ["upper", "mid", "bottom"],
      );
    case "high":
      return uniqueOrdered(
        surfaceSeasonallyPossible
          ? ["upper", "mid", "surface", "bottom"]
          : ["upper", "mid", "bottom"],
      );
    case "mid":
      return uniqueOrdered(
        surfaceSeasonallyPossible
          ? ["mid", "upper", "bottom", "surface"]
          : ["mid", "bottom", "upper"],
      );
    case "mid_low":
      return ["bottom", "mid", "upper"];
    case "low":
    default:
      return ["bottom", "mid"];
  }
}

function pacePreferenceOrderForMood(
  mood: LegacyMood,
): readonly TacticalPaceV3[] {
  switch (mood) {
    case "negative":
      return ["slow", "medium"];
    case "neutral":
      return ["medium", "slow", "fast"];
    case "active":
    default:
      return ["medium", "fast", "slow"];
  }
}

function presencePreferenceOrderForStyle(
  style: LegacyPresentationStyle,
): readonly TacticalPresenceV3[] {
  switch (style) {
    case "subtle":
      return ["subtle", "moderate"];
    case "bold":
      return ["bold", "moderate", "subtle"];
    case "balanced":
    default:
      return ["moderate", "subtle", "bold"];
  }
}

function allowedColumnsFromPreference(
  preference: readonly TacticalColumnV3[],
): readonly TacticalColumnV3[] {
  return uniqueOrdered(preference);
}

function allowedPacesFromPreference(
  preference: readonly TacticalPaceV3[],
): readonly TacticalPaceV3[] {
  return uniqueOrdered(preference);
}

function allowedPresenceFromPreference(
  preference: readonly TacticalPresenceV3[],
): readonly TacticalPresenceV3[] {
  return uniqueOrdered(preference);
}

export function buildMonthlyBaselineProfile(options: {
  typical_seasonal_water_column: SeasonalWaterColumnV3;
  typical_seasonal_location: RecommenderV3SeasonalRow["monthly_baseline"]["typical_seasonal_location"];
  base_mood: LegacyMood;
  base_presentation_style: LegacyPresentationStyle;
  primary_forage: ForageBucketV3;
  secondary_forage?: ForageBucketV3;
  eligible_archetype_ids: readonly RecommenderV3ArchetypeId[];
}): RecommenderV3MonthlyBaselineProfile {
  const surfaceSeasonallyPossible = options.eligible_archetype_ids.some((id) =>
    SURFACE_ARCHETYPE_IDS.has(id)
  );
  const columnPreferenceOrder = columnPreferenceOrderForSeasonalColumn(
    options.typical_seasonal_water_column,
    surfaceSeasonallyPossible,
  );
  const pacePreferenceOrder = pacePreferenceOrderForMood(options.base_mood);
  const presencePreferenceOrder = presencePreferenceOrderForStyle(
    options.base_presentation_style,
  );

  return {
    allowed_columns: allowedColumnsFromPreference(columnPreferenceOrder),
    column_preference_order: columnPreferenceOrder,
    allowed_paces: allowedPacesFromPreference(pacePreferenceOrder),
    pace_preference_order: pacePreferenceOrder,
    allowed_presence: allowedPresenceFromPreference(presencePreferenceOrder),
    presence_preference_order: presencePreferenceOrder,
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
