import type { ArchetypeProfileV4, SeasonalRowV4 } from "../v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../v4/candidates/lures.ts";
import type { DailyScenario } from "./buildDailyScenario.ts";
import { assertScenarioMatchesSeasonalRow } from "./assertScenarioMatchesSeasonalRow.ts";

export type CandidateSide = "lure" | "fly";

export type DailyPickCandidate = {
  side: CandidateSide;
  profile: ArchetypeProfileV4;
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
  if (!row.column_range.includes(profile.column)) return false;
  if (!hasPaceIntersection(profile, row)) return false;
  if (
    profile.is_surface &&
    (!seasonalSurfaceAllowed(row) || scenario.surface_daily_gate === "closed")
  ) {
    return false;
  }
  return true;
}

function buildSidePool(args: {
  side: CandidateSide;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): DailyPickCandidate[] {
  const catalog = args.side === "lure" ? LURE_BY_ID : FLY_BY_ID;
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
      candidates.push({ side: args.side, profile });
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
