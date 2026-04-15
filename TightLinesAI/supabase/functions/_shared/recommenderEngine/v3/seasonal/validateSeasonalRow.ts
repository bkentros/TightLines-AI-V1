import { FLY_ARCHETYPES_V3 } from "../candidates/flies.ts";
import { LURE_ARCHETYPES_V3 } from "../candidates/lures.ts";
import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3SeasonalRow,
  TacticalColumnV3,
  TacticalPaceV3,
  TacticalPresenceV3,
} from "../contracts.ts";
function rowKey(row: RecommenderV3SeasonalRow): string {
  return [row.species, row.region_key, row.month, row.context].join("|");
}

function assertNoDupes<T extends string>(
  label: string,
  ids: readonly T[] | undefined,
  rowKeyStr: string,
): void {
  if (!ids?.length) return;
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      throw new Error(
        `${rowKeyStr}: duplicate id '${id}' in ${label}`,
      );
    }
    seen.add(id);
  }
}

function assertSubset<T extends string>(
  label: string,
  order: readonly T[],
  allowed: readonly T[],
  rowKeyStr: string,
): void {
  const allow = new Set(allowed);
  for (const v of order) {
    if (!allow.has(v)) {
      throw new Error(
        `${rowKeyStr}: ${label} contains '${v}' which is not in allowed set [${[...allow].join(", ")}]`,
      );
    }
  }
}

/** True if the archetype overlaps the monthly allowed box on any tactical axis. */
function archetypeFitsAllowedLanes(
  p: RecommenderV3ArchetypeProfile,
  allowed_columns: readonly TacticalColumnV3[],
  allowed_paces: readonly TacticalPaceV3[],
  allowed_presence: readonly TacticalPresenceV3[],
): boolean {
  const colOk =
    allowed_columns.includes(p.primary_column) ||
    (p.secondary_column != null &&
      allowed_columns.includes(p.secondary_column));
  const paceOk =
    allowed_paces.includes(p.pace) ||
    (p.secondary_pace != null && allowed_paces.includes(p.secondary_pace));
  const presOk =
    allowed_presence.includes(p.presence) ||
    (p.secondary_presence != null &&
      allowed_presence.includes(p.secondary_presence));
  return colOk || paceOk || presOk;
}

/**
 * Structural checks for authored seasonal rows. Invoked at module load.
 *
 * Tactical lane check: each eligible archetype must overlap the monthly
 * allowed column, pace, or presence set on at least one axis (OR). A strict
 * AND across all three rejected many historically authored spawn-shallow rows
 * where resolved `typical_seasonal_water_column` is upper-column biased while
 * classic leech/craw streamers remain bottom-tagged in the fly catalog.
 */
export function validateSeasonalRows(
  rows: readonly RecommenderV3SeasonalRow[],
  label: string,
): void {
  for (const row of rows) {
    const key = rowKey(row);
    const baseline = row.monthly_baseline;

    if (row.species === "trout" && row.context !== "freshwater_river") {
      throw new Error(
        `${label} ${key}: trout rows must use freshwater_river context`,
      );
    }

    assertNoDupes("eligible_lure_ids", row.eligible_lure_ids, key);
    assertNoDupes("eligible_fly_ids", row.eligible_fly_ids, key);
    assertNoDupes("primary_lure_ids", row.primary_lure_ids, key);
    assertNoDupes("primary_fly_ids", row.primary_fly_ids, key);

    if (row.eligible_lure_ids.length < 3) {
      throw new Error(`${label} ${key}: eligible_lure_ids needs >= 3 entries`);
    }
    if (row.eligible_fly_ids.length < 3) {
      throw new Error(`${label} ${key}: eligible_fly_ids needs >= 3 entries`);
    }

    assertSubset(
      "column_preference_order",
      baseline.column_preference_order,
      baseline.allowed_columns,
      key,
    );
    assertSubset(
      "pace_preference_order",
      baseline.pace_preference_order,
      baseline.allowed_paces,
      key,
    );
    assertSubset(
      "presence_preference_order",
      baseline.presence_preference_order,
      baseline.allowed_presence,
      key,
    );

    const lureEligible = new Set(row.eligible_lure_ids);
    const flyEligible = new Set(row.eligible_fly_ids);

    for (const id of row.primary_lure_ids ?? []) {
      if (!lureEligible.has(id)) {
        throw new Error(
          `${label} ${key}: primary_lure_ids contains '${id}' not in eligible_lure_ids`,
        );
      }
    }
    for (const id of row.primary_fly_ids ?? []) {
      if (!flyEligible.has(id)) {
        throw new Error(
          `${label} ${key}: primary_fly_ids contains '${id}' not in eligible_fly_ids`,
        );
      }
    }

    if (!baseline.surface_seasonally_possible) {
      for (const id of row.eligible_lure_ids) {
        const p = LURE_ARCHETYPES_V3[id];
        if (p.is_surface) {
          throw new Error(
            `${label} ${key}: surface_seasonally_possible is false but eligible lure '${id}' is_surface`,
          );
        }
      }
      for (const id of row.eligible_fly_ids) {
        const p = FLY_ARCHETYPES_V3[id];
        if (p.is_surface) {
          throw new Error(
            `${label} ${key}: surface_seasonally_possible is false but eligible fly '${id}' is_surface`,
          );
        }
      }
    }

    for (const id of row.eligible_lure_ids) {
      if (!LURE_ARCHETYPES_V3[id]) {
        throw new Error(`${label} ${key}: unknown eligible lure id '${id}'`);
      }
      const p = LURE_ARCHETYPES_V3[id];
      if (!p.species_allowed.includes(row.species)) {
        throw new Error(
          `${label} ${key}: lure '${id}' is not compatible with species ${row.species}`,
        );
      }
      if (!p.water_types_allowed.includes(row.context)) {
        throw new Error(
          `${label} ${key}: lure '${id}' is not compatible with context ${row.context}`,
        );
      }
      if (
        !archetypeFitsAllowedLanes(
          p,
          baseline.allowed_columns,
          baseline.allowed_paces,
          baseline.allowed_presence,
        )
      ) {
        throw new Error(
          `${label} ${key}: lure '${id}' does not fit allowed column/pace/presence lanes`,
        );
      }
    }

    for (const id of row.eligible_fly_ids) {
      if (!FLY_ARCHETYPES_V3[id]) {
        throw new Error(`${label} ${key}: unknown eligible fly id '${id}'`);
      }
      const p = FLY_ARCHETYPES_V3[id];
      if (!p.species_allowed.includes(row.species)) {
        throw new Error(
          `${label} ${key}: fly '${id}' is not compatible with species ${row.species}`,
        );
      }
      if (!p.water_types_allowed.includes(row.context)) {
        throw new Error(
          `${label} ${key}: fly '${id}' is not compatible with context ${row.context}`,
        );
      }
      if (
        !archetypeFitsAllowedLanes(
          p,
          baseline.allowed_columns,
          baseline.allowed_paces,
          baseline.allowed_presence,
        )
      ) {
        throw new Error(
          `${label} ${key}: fly '${id}' does not fit allowed column/pace/presence lanes`,
        );
      }
    }
  }
}

