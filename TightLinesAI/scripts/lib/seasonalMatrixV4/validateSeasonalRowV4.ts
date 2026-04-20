/**
 * §15.1 G1 / G6 / G8 seasonal row validation (generator + optional tests).
 */
import type { ArchetypeProfileV4 } from "../../../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import {
  FLY_ARCHETYPE_IDS_V4,
  FORAGE_POLICY_V4,
  LURE_ARCHETYPE_IDS_V4,
} from "../../../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import type { SeasonalRowV4 } from "../../../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../../../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../../../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { slot0Target, type PostureV4 } from "./tacticsAndPools.ts";

export type ValidationDiag = {
  level: "DATA_QUALITY_ERROR" | "DATA_QUALITY_WARN";
  message: string;
};

const LURE_BY_ID = new Map(LURE_ARCHETYPES_V4.map((a) => [a.id, a]));
const FLY_BY_ID = new Map(FLY_ARCHETYPES_V4.map((a) => [a.id, a]));

function rowLabel(row: SeasonalRowV4): string {
  const st = row.state_code ?? "*";
  return `(species=${row.species}, region=${row.region_key}, month=${row.month}, water_type=${row.water_type}, state=${st})`;
}

export function g1Error(
  ruleName: string,
  row: SeasonalRowV4,
  offending: string,
  expected: string,
  likelyCause:
    | "copy-paste from wrong species row"
    | "archetype catalog drift"
    | "baseline edited without updating range"
    | "new archetype missing from primary_ids"
    | "CSV hand-edit typo",
  fix: string,
): string {
  return (
    `[G1] ${ruleName} failed for row ${rowLabel(row)}\n` +
    `     Offending value: ${offending}\n` +
    `     Expected: ${expected}\n` +
    `     Likely cause: ${likelyCause}\n` +
    `     Fix: ${fix}`
  );
}

function isTroutRiverWinter(row: SeasonalRowV4): boolean {
  return (
    row.species === "trout" &&
    row.water_type === "freshwater_river" &&
    [12, 1, 2].includes(row.month)
  );
}

function passesForageHeadline(a: ArchetypeProfileV4, row: SeasonalRowV4): boolean {
  const allowed = [row.primary_forage];
  if (row.secondary_forage) allowed.push(row.secondary_forage);
  return a.forage_tags.some((t) => allowed.includes(t));
}

function archetypeMatchesSlot0(
  a: ArchetypeProfileV4,
  column: string,
  pace: string,
): boolean {
  if (a.column !== column) return false;
  return a.primary_pace === pace ||
    (a.secondary_pace != null && a.secondary_pace === pace);
}

export function validateSeasonalRowV4(row: SeasonalRowV4): ValidationDiag[] {
  const diags: ValidationDiag[] = [];

  const pushErr = (
    rule: string,
    offending: string,
    expected: string,
    cause: Parameters<typeof g1Error>[4],
    fix: string,
  ) => {
    diags.push({
      level: "DATA_QUALITY_ERROR",
      message: g1Error(rule, row, offending, expected, cause, fix),
    });
  };

  if (!row.column_range.includes(row.column_baseline)) {
    pushErr(
      "column-baseline-in-range",
      String(row.column_baseline),
      "column_baseline must be an element of column_range",
      "baseline edited without updating range",
      "Add the baseline to column_range or change column_baseline to a member of column_range.",
    );
  }
  if (!row.pace_range.includes(row.pace_baseline)) {
    pushErr(
      "pace-baseline-in-range",
      String(row.pace_baseline),
      "pace_baseline must be an element of pace_range",
      "baseline edited without updating range",
      "Add the baseline to pace_range or change pace_baseline.",
    );
  }
  if (row.column_baseline === "surface") {
    pushErr(
      "p14-column-baseline-surface",
      "surface",
      "column_baseline !== \"surface\" (P14)",
      "baseline edited without updating range",
      "Move seasonal anchor to mid/upper/bottom; keep surface only inside column_range.",
    );
  }
  if (row.column_range.filter((c) => c !== "surface").length < 1) {
    pushErr(
      "non-surface-column-exists",
      row.column_range.join("|"),
      "at least one non-surface column in column_range",
      "CSV hand-edit typo",
      "Ensure column_range includes bottom, mid, and/or upper — not surface alone.",
    );
  }

  const minPrimaryLure = 3;
  const minPrimaryFly = isTroutRiverWinter(row) ? 2 : 3;
  if (row.primary_lure_ids.length < minPrimaryLure) {
    pushErr(
      "primary-lure-count",
      String(row.primary_lure_ids.length),
      `primary_lure_ids.length >= ${minPrimaryLure}`,
      "new archetype missing from primary_ids",
      "Add curated lure ids (typically from eligible v3 pool) until at least 3 entries.",
    );
  }
  if (row.primary_fly_ids.length < minPrimaryFly) {
    pushErr(
      "primary-fly-count",
      String(row.primary_fly_ids.length),
      `primary_fly_ids.length >= ${minPrimaryFly}` +
        (isTroutRiverWinter(row) ? " (trout-river-winter relaxation)" : ""),
      "new archetype missing from primary_ids",
      "Add curated fly ids; trout Dec–Feb river rows allow 2 minimum per §15.1 G1.",
    );
  }

  const exL = new Set(row.excluded_lure_ids ?? []);
  const exF = new Set(row.excluded_fly_ids ?? []);
  for (const id of row.primary_lure_ids) {
    if (exL.has(id)) {
      pushErr(
        "primary-excluded-lure-overlap",
        id,
        "primary_lure_ids ∩ excluded_lure_ids must be empty",
        "CSV hand-edit typo",
        "Remove id from primary_lure_ids or from excluded_lure_ids.",
      );
    }
  }
  for (const id of row.primary_fly_ids) {
    if (exF.has(id)) {
      pushErr(
        "primary-excluded-fly-overlap",
        id,
        "primary_fly_ids ∩ excluded_fly_ids must be empty",
        "CSV hand-edit typo",
        "Remove id from primary_fly_ids or from excluded_fly_ids.",
      );
    }
  }

  const policy = FORAGE_POLICY_V4[row.species];
  if (!policy.has(row.primary_forage)) {
    pushErr(
      "g6-primary-forage",
      row.primary_forage,
      `primary_forage must be in FORAGE_POLICY_V4 for ${row.species}`,
      "copy-paste from wrong species row",
      "Pick a forage bucket allowed for this species (§15.1 G6).",
    );
  }
  if (
    row.secondary_forage && !policy.has(row.secondary_forage)
  ) {
    pushErr(
      "g6-secondary-forage",
      row.secondary_forage,
      `secondary_forage must be in FORAGE_POLICY_V4 for ${row.species}`,
      "copy-paste from wrong species row",
      "Clear secondary_forage or choose an allowed bucket.",
    );
  }
  if (row.species === "trout" && row.secondary_forage === "insect_misc") {
    pushErr(
      "g6-trout-insect",
      "insect_misc",
      "trout rows may not use insect_misc (G6)",
      "copy-paste from wrong species row",
      "Use leech_worm as hatch-month proxy per §17.6.",
    );
  }
  if (row.species === "trout" && row.primary_forage === "insect_misc") {
    pushErr(
      "g6-trout-insect-primary",
      "insect_misc",
      "trout primary_forage may not be insect_misc (G6)",
      "copy-paste from wrong species row",
      "Author leech_worm or baitfish as primary forage.",
    );
  }
  if (row.species === "northern_pike" && row.primary_forage === "insect_misc") {
    pushErr("g6-pike-insect", "insect_misc", "pike may not use insect_misc", "copy-paste from wrong species row", "Use baitfish, bluegill_perch, or surface_prey.");
  }

  if (row.surface_seasonally_possible && !row.column_range.includes("surface")) {
    pushErr(
      "surface-range-true",
      row.column_range.join("|"),
      "column_range must include surface when surface_seasonally_possible is true",
      "baseline edited without updating range",
      "Add surface to column_range or set surface_seasonally_possible false.",
    );
  }
  if (!row.surface_seasonally_possible && row.column_range.includes("surface")) {
    pushErr(
      "surface-range-false",
      row.column_range.join("|"),
      "column_range must not include surface when surface_seasonally_possible is false",
      "baseline edited without updating range",
      "Remove surface from column_range or set surface_seasonally_possible true.",
    );
  }

  if (!row.surface_seasonally_possible) {
    for (const id of row.primary_fly_ids) {
      if (id === "mouse_fly") {
        pushErr(
          "mouse-fly-requires-surface-season",
          "mouse_fly",
          "mouse_fly in primary_fly_ids only when surface_seasonally_possible (§17.6)",
          "copy-paste from wrong species row",
          "Remove mouse_fly or set surface_seasonally_possible true and add surface to column_range.",
        );
      }
    }
  }

  for (const id of row.primary_lure_ids) {
    if (!(LURE_ARCHETYPE_IDS_V4 as readonly string[]).includes(id)) {
      pushErr(
        "lure-id-exists",
        id,
        "id must exist in LURE_ARCHETYPE_IDS_V4",
        "archetype catalog drift",
        "Fix typo or add archetype to v4 lure catalog in Phase 2.",
      );
      continue;
    }
    const a = LURE_BY_ID.get(id)!;
    if (!a.species_allowed.includes(row.species)) {
      pushErr(
        "primary-species-gate",
        id,
        `every id in primary_lure_ids must have ${row.species} in species_allowed`,
        "copy-paste from wrong species row",
        `Remove ${id} from primary_lure_ids or broaden species_allowed in the catalog (escalate if intentional).`,
      );
    }
    if (!a.water_types_allowed.includes(row.water_type)) {
      pushErr(
        "primary-water-gate",
        id,
        `every id in primary_lure_ids must allow water_type ${row.water_type}`,
        "copy-paste from wrong species row",
        `Remove ${id} or fix water_types_allowed on the archetype.`,
      );
    }
    if (!row.column_range.includes(a.column)) {
      pushErr(
        "primary-column-in-row-range",
        id,
        `archetype column ${a.column} must be in row.column_range`,
        "new archetype missing from primary_ids",
        "Remove archetype from primary_lure_ids or widen column_range.",
      );
    }
    const paceOk =
      row.pace_range.includes(a.primary_pace) ||
      (a.secondary_pace != null && row.pace_range.includes(a.secondary_pace));
    if (!paceOk) {
      pushErr(
        "primary-pace-in-row-range",
        id,
        `archetype pace must fall in row.pace_range (primary or secondary)`,
        "copy-paste from wrong species row",
        "Remove archetype or widen pace_range.",
      );
    }
  }

  for (const id of row.primary_fly_ids) {
    if (!(FLY_ARCHETYPE_IDS_V4 as readonly string[]).includes(id)) {
      pushErr(
        "fly-id-exists",
        id,
        "id must exist in FLY_ARCHETYPE_IDS_V4",
        "archetype catalog drift",
        "Fix typo or add fly to v4 catalog.",
      );
      continue;
    }
    const a = FLY_BY_ID.get(id)!;
    if (!a.species_allowed.includes(row.species)) {
      pushErr(
        "primary-fly-species-gate",
        id,
        `every id in primary_fly_ids must have ${row.species} in species_allowed`,
        "copy-paste from wrong species row",
        `Remove ${id} from primary_fly_ids.`,
      );
    }
    if (!a.water_types_allowed.includes(row.water_type)) {
      pushErr(
        "primary-fly-water-gate",
        id,
        `every id in primary_fly_ids must allow water_type ${row.water_type}`,
        "copy-paste from wrong species row",
        `Remove ${id} or fix catalog water_types_allowed.`,
      );
    }
    if (!row.column_range.includes(a.column)) {
      pushErr(
        "primary-fly-column-in-row-range",
        id,
        `fly column ${a.column} must be in row.column_range`,
        "baseline edited without updating range",
        "Widen column_range or remove fly from primary_fly_ids.",
      );
    }
    const paceOk =
      row.pace_range.includes(a.primary_pace) ||
      (a.secondary_pace != null && row.pace_range.includes(a.secondary_pace));
    if (!paceOk) {
      pushErr(
        "primary-fly-pace-in-row-range",
        id,
        `fly pace must fall in row.pace_range`,
        "copy-paste from wrong species row",
        "Widen pace_range or remove fly.",
      );
    }
  }

  for (const id of row.excluded_lure_ids ?? []) {
    if (!(LURE_ARCHETYPE_IDS_V4 as readonly string[]).includes(id)) {
      pushErr("excluded-lure-exists", id, "valid lure id", "CSV hand-edit typo", "Remove or fix id.");
    }
  }
  for (const id of row.excluded_fly_ids ?? []) {
    if (!(FLY_ARCHETYPE_IDS_V4 as readonly string[]).includes(id)) {
      pushErr("excluded-fly-exists", id, "valid fly id", "CSV hand-edit typo", "Remove or fix id.");
    }
  }

  const minLureForage = 2;
  const minFlyForage = isTroutRiverWinter(row) ? 1 : 2;
  const lureForage = row.primary_lure_ids.filter((id) => {
    const a = LURE_BY_ID.get(id);
    return a && passesForageHeadline(a, row);
  }).length;
  if (lureForage < minLureForage) {
    pushErr(
      "primary-lure-forage-coverage",
      String(lureForage),
      `at least ${minLureForage} primary lures must match primary/secondary forage`,
      "new archetype missing from primary_ids",
      "Add lure ids whose forage_tags intersect the row forage buckets.",
    );
  }
  const flyForage = row.primary_fly_ids.filter((id) => {
    const a = FLY_BY_ID.get(id);
    return a && passesForageHeadline(a, row);
  }).length;
  if (flyForage < minFlyForage) {
    pushErr(
      "primary-fly-forage-coverage",
      String(flyForage),
      `at least ${minFlyForage} primary flies must match primary/secondary forage` +
        (isTroutRiverWinter(row) ? " (trout-river-winter relaxation)" : ""),
      "new archetype missing from primary_ids",
      "Add streamer/leech patterns tagged for the row forage.",
    );
  }

  const WIND = 10;
  for (const posture of ["aggressive", "neutral", "suppressed"] as PostureV4[]) {
    let t0: { column: string; pace: string };
    try {
      t0 = slot0Target(row, posture, WIND);
    } catch (e) {
      pushErr(
        "g8-tactics",
        String(e),
        "resolvable tactics for posture " + posture,
        "baseline edited without updating range",
        "Ensure column_baseline remains in surface-gated column sets for every posture.",
      );
      continue;
    }
    const lureHit = row.primary_lure_ids.some((id) => {
      const a = LURE_BY_ID.get(id);
      return a && archetypeMatchesSlot0(a, t0.column, t0.pace);
    });
    if (!lureHit) {
      diags.push({
        level: "DATA_QUALITY_WARN",
        message:
          `[DATA_QUALITY_WARN] [G8] primary_lure_ids may miss slot-0 headline coverage for posture=${posture} ${rowLabel(row)} — target (${t0.column}, ${t0.pace}). Headline fallback chain may fire.`,
      });
    }
    const flyHit = row.primary_fly_ids.some((id) => {
      const a = FLY_BY_ID.get(id);
      return a && archetypeMatchesSlot0(a, t0.column, t0.pace);
    });
    if (!flyHit) {
      diags.push({
        level: "DATA_QUALITY_WARN",
        message:
          `[DATA_QUALITY_WARN] [G8] primary_fly_ids may miss slot-0 headline coverage for posture=${posture} ${rowLabel(row)} — target (${t0.column}, ${t0.pace}).`,
      });
    }
  }

  return diags;
}
