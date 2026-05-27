import type { ArchetypeProfileV4, SeasonalRowV4 } from "../v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../v4/candidates/lures.ts";
import {
  type DailyScenario,
  SHOULDER_SURFACE_REASON_CODES,
} from "./buildDailyScenario.ts";
import { assertScenarioMatchesSeasonalRow } from "./assertScenarioMatchesSeasonalRow.ts";

export type CandidateSide = "lure" | "fly";
export type CandidateSource = "row" | "catalog_backfill";

export type DailyPickCandidate = {
  side: CandidateSide;
  profile: ArchetypeProfileV4;
  source?: CandidateSource;
};

export type DailyPickCandidatePool = {
  lures: DailyPickCandidate[];
  flies: DailyPickCandidate[];
};

const LURE_BY_ID = new Map(LURE_ARCHETYPES_V4.map((profile) => [
  profile.id,
  profile,
]));
const FLY_BY_ID = new Map(FLY_ARCHETYPES_V4.map((profile) => [
  profile.id,
  profile,
]));

const MIN_AUTHORED_CANDIDATES_BEFORE_BACKFILL = 2;
const TARGET_POOL_SIZE_BEFORE_BACKFILL = 16;
const TARGET_FAMILY_GROUPS_BEFORE_BACKFILL = 10;
const TARGET_PRESENTATION_GROUPS_BEFORE_BACKFILL = 8;
const ACTIVE_TARGET_POOL_SIZE_BEFORE_BACKFILL = 20;
const ACTIVE_TARGET_FAMILY_GROUPS_BEFORE_BACKFILL = 12;
const ACTIVE_TARGET_PRESENTATION_GROUPS_BEFORE_BACKFILL = 10;
const MAX_GENERAL_BACKFILL_ADDITIONS = 8;
const SHOULDER_SURFACE_REASON_CODE_SET = new Set<string>(
  SHOULDER_SURFACE_REASON_CODES,
);

function hasPaceIntersection(
  profile: ArchetypeProfileV4,
  row: SeasonalRowV4,
): boolean {
  return row.pace_range.includes(profile.primary_pace) ||
    (profile.secondary_pace != null &&
      row.pace_range.includes(profile.secondary_pace));
}

function seasonalSurfaceAllowed(row: SeasonalRowV4): boolean {
  return row.column_range.includes("surface") &&
    row.surface_seasonally_possible;
}

function hasShoulderSurfaceException(scenario: DailyScenario): boolean {
  return scenario.surface_daily_reason_codes.some((code) =>
    SHOULDER_SURFACE_REASON_CODE_SET.has(code)
  );
}

function dailySurfaceAllowed(
  row: SeasonalRowV4,
  scenario: DailyScenario,
): boolean {
  return seasonalSurfaceAllowed(row) ||
    hasShoulderSurfaceException(scenario);
}

function hasColumnFit(
  profile: ArchetypeProfileV4,
  row: SeasonalRowV4,
  scenario: DailyScenario,
): boolean {
  if (row.column_range.includes(profile.column)) return true;
  return profile.is_surface &&
    profile.column === "surface" &&
    row.column_range.includes("upper") &&
    hasShoulderSurfaceException(scenario);
}

function passesHardGates(args: {
  profile: ArchetypeProfileV4;
  side: CandidateSide;
  row: SeasonalRowV4;
  scenario: DailyScenario;
  excludedIds: ReadonlySet<string>;
}): boolean {
  const { profile, side, row, scenario, excludedIds } = args;
  if (profile.gear_mode !== side) return false;
  if (!profile.species_allowed.includes(scenario.species)) return false;
  if (!profile.water_types_allowed.includes(scenario.water_type)) return false;
  if (excludedIds.has(profile.id)) return false;
  if (!hasColumnFit(profile, row, scenario)) return false;
  if (!hasPaceIntersection(profile, row)) return false;
  if (
    profile.is_surface &&
    (!dailySurfaceAllowed(row, scenario) ||
      scenario.surface_daily_gate === "closed")
  ) {
    return false;
  }
  return true;
}

function distinctCount(
  candidates: readonly DailyPickCandidate[],
  key: (candidate: DailyPickCandidate) => string,
): number {
  return new Set(candidates.map(key)).size;
}

function shouldGeneralBackfillSide(args: {
  rowAuthoredCandidateCount: number;
  candidates: readonly DailyPickCandidate[];
  scenario: DailyScenario;
}): boolean {
  if (
    args.scenario.species !== "largemouth_bass" &&
    args.scenario.species !== "smallmouth_bass"
  ) {
    return false;
  }
  if (
    args.rowAuthoredCandidateCount <
      MIN_AUTHORED_CANDIDATES_BEFORE_BACKFILL
  ) {
    return false;
  }

  const activeTarget = args.scenario.activity_level === "active" ||
    args.scenario.activity_level === "high_opportunity";
  const targetPoolSize = activeTarget
    ? ACTIVE_TARGET_POOL_SIZE_BEFORE_BACKFILL
    : TARGET_POOL_SIZE_BEFORE_BACKFILL;
  const targetFamilyGroups = activeTarget
    ? ACTIVE_TARGET_FAMILY_GROUPS_BEFORE_BACKFILL
    : TARGET_FAMILY_GROUPS_BEFORE_BACKFILL;
  const targetPresentationGroups = activeTarget
    ? ACTIVE_TARGET_PRESENTATION_GROUPS_BEFORE_BACKFILL
    : TARGET_PRESENTATION_GROUPS_BEFORE_BACKFILL;

  return args.candidates.length < targetPoolSize ||
    distinctCount(
        args.candidates,
        (candidate) => candidate.profile.family_group,
      ) < targetFamilyGroups ||
    distinctCount(
        args.candidates,
        (candidate) => candidate.profile.presentation_group,
      ) < targetPresentationGroups;
}

function goalBackfillFit(
  profile: ArchetypeProfileV4,
  scenario: DailyScenario,
): boolean {
  if (scenario.recommendation_goal === "all_purpose") {
    return profile.goal_tags.includes("reliable_action") ||
      profile.goal_tags.includes("versatile_search");
  }
  return profile.goal_tags.includes("big_fish_upside") ||
    profile.goal_tags.includes("high_risk_high_reward");
}

function conditionBackfillFit(
  profile: ArchetypeProfileV4,
  scenario: DailyScenario,
): boolean {
  return scenario.scenario_tags.some((tag) =>
    profile.condition_tags.includes(tag)
  );
}

function forageBackfillFit(
  profile: ArchetypeProfileV4,
  row: SeasonalRowV4,
): boolean {
  return profile.forage_tags.includes(row.primary_forage) ||
    (row.secondary_forage != null &&
      profile.forage_tags.includes(row.secondary_forage));
}

function catalogBackfillFit(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (hasShoulderSurfaceException(scenario) && profile.is_surface) {
    return true;
  }
  return conditionBackfillFit(profile, scenario) ||
    forageBackfillFit(profile, row) ||
    goalBackfillFit(profile, scenario);
}

function buildSidePool(args: {
  side: CandidateSide;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): DailyPickCandidate[] {
  const catalog = args.side === "lure" ? LURE_BY_ID : FLY_BY_ID;
  const catalogProfiles = args.side === "lure"
    ? LURE_ARCHETYPES_V4
    : FLY_ARCHETYPES_V4;
  const authoredIds = args.side === "lure"
    ? args.row.primary_lure_ids
    : args.row.primary_fly_ids;
  const excludedIds = new Set(
    args.side === "lure"
      ? args.row.excluded_lure_ids ?? []
      : args.row.excluded_fly_ids ?? [],
  );
  const candidates: DailyPickCandidate[] = [];

  for (const id of authoredIds) {
    const profile = catalog.get(id);
    if (profile == null) continue;
    if (
      passesHardGates({
        profile,
        side: args.side,
        row: args.row,
        scenario: args.scenario,
        excludedIds,
      })
    ) {
      candidates.push({ side: args.side, profile, source: "row" });
    }
  }

  const shoulderSurfaceBackfill = hasShoulderSurfaceException(args.scenario);
  const generalBackfill = shouldGeneralBackfillSide({
    rowAuthoredCandidateCount: candidates.length,
    candidates,
    scenario: args.scenario,
  });

  if (shoulderSurfaceBackfill || generalBackfill) {
    const candidateIds = new Set(
      candidates.map((candidate) => candidate.profile.id),
    );
    let generalBackfillAdditions = 0;
    for (const profile of catalogProfiles) {
      if (candidateIds.has(profile.id)) continue;
      const surfaceExceptionFit = shoulderSurfaceBackfill && profile.is_surface;
      if (!surfaceExceptionFit && !generalBackfill) continue;
      if (
        !surfaceExceptionFit &&
        generalBackfillAdditions >= MAX_GENERAL_BACKFILL_ADDITIONS
      ) {
        continue;
      }
      if (
        !catalogBackfillFit({
          profile,
          row: args.row,
          scenario: args.scenario,
        })
      ) {
        continue;
      }
      if (
        passesHardGates({
          profile,
          side: args.side,
          row: args.row,
          scenario: args.scenario,
          excludedIds,
        })
      ) {
        candidates.push({
          side: args.side,
          profile,
          source: "catalog_backfill",
        });
        candidateIds.add(profile.id);
        if (!surfaceExceptionFit) generalBackfillAdditions++;
      }
    }
  }

  return candidates;
}

export function buildCandidatePool(args: {
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): DailyPickCandidatePool {
  assertScenarioMatchesSeasonalRow(args);

  return {
    lures: buildSidePool({
      side: "lure",
      row: args.row,
      scenario: args.scenario,
    }),
    flies: buildSidePool({
      side: "fly",
      row: args.row,
      scenario: args.scenario,
    }),
  };
}
