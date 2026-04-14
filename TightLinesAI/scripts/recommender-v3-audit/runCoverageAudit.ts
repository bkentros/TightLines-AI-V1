#!/usr/bin/env -S deno run --allow-read --allow-write

import {
  FLY_ARCHETYPE_IDS_V3,
  type FlyArchetypeIdV3,
  LURE_ARCHETYPE_IDS_V3,
  type LureArchetypeIdV3,
  type RecommenderV3ArchetypeId,
  type RecommenderV3DailyPayload,
  type RecommenderV3RankedArchetype,
  type RecommenderV3ResolvedProfile,
  type RecommenderV3SeasonalRow,
  type TacticalLaneV3,
} from "../../supabase/functions/_shared/recommenderEngine/v3/contracts.ts";
import {
  FLY_ARCHETYPES_V3,
  LURE_ARCHETYPES_V3,
} from "../../supabase/functions/_shared/recommenderEngine/v3/candidates/index.ts";
import { resolveFinalProfileV3 } from "../../supabase/functions/_shared/recommenderEngine/v3/resolveFinalProfile.ts";
import {
  scoreFlyCandidatesV3,
  scoreLureCandidatesV3,
} from "../../supabase/functions/_shared/recommenderEngine/v3/scoreCandidates.ts";
import { resolveSeasonalRowV3 } from "../../supabase/functions/_shared/recommenderEngine/v3/seasonal/resolveSeasonalRow.ts";
import { LARGEMOUTH_V3_SEASONAL_ROWS } from "../../supabase/functions/_shared/recommenderEngine/v3/seasonal/largemouth.ts";
import { SMALLMOUTH_V3_SEASONAL_ROWS } from "../../supabase/functions/_shared/recommenderEngine/v3/seasonal/smallmouth.ts";
import { TROUT_V3_SEASONAL_ROWS } from "../../supabase/functions/_shared/recommenderEngine/v3/seasonal/trout.ts";
import { NORTHERN_PIKE_V3_SEASONAL_ROWS } from "../../supabase/functions/_shared/recommenderEngine/v3/seasonal/pike.ts";
import {
  ARCHETYPE_ROLE_DEFINITIONS,
  type ArchetypeExpectationReach,
  FLY_ARCHETYPE_EXPECTATIONS,
  LURE_ARCHETYPE_EXPECTATIONS,
  type RecommenderV3ArchetypeAuditExpectation,
  V3_AUDIT_SUCCESS_TARGETS,
  V3_IMPLEMENTATION_SCOPE_AREAS,
} from "./archetypeExpectations.ts";
import {
  allSyntheticDailyPayloads,
} from "./syntheticRecommenderAudit.ts";

const OUTPUT_JSON =
  "docs/recommender-v3-audit/generated/v3-coverage-audit.json";
const OUTPUT_MARKDOWN =
  "docs/recommender-v3-audit/generated/v3-coverage-audit.md";

const ALL_ROWS: readonly RecommenderV3SeasonalRow[] = [
  ...LARGEMOUTH_V3_SEASONAL_ROWS,
  ...SMALLMOUTH_V3_SEASONAL_ROWS,
  ...TROUT_V3_SEASONAL_ROWS,
  ...NORTHERN_PIKE_V3_SEASONAL_ROWS,
];
const AUDITED_ROWS: readonly RecommenderV3SeasonalRow[] = [
  ...new Map(
    ALL_ROWS.map((row) => {
      const key = [row.species, row.region_key, row.month, row.context].join(
        "|",
      );
      return [
        key,
        resolveSeasonalRowV3(
          row.species,
          row.region_key,
          row.month,
          row.context,
        ),
      ];
    }),
  ).values(),
];

const CLARITIES = ["clear", "stained", "dirty"] as const;

const DAILY_PAYLOADS: readonly RecommenderV3DailyPayload[] =
  allSyntheticDailyPayloads();

const PACE_BY_LANE: Record<TacticalLaneV3, "slow" | "medium" | "fast"> = {
  bottom_contact: "slow",
  finesse_subtle: "slow",
  horizontal_search: "medium",
  reaction_mid_column: "fast",
  surface: "fast",
  cover_weedless: "medium",
  pike_big_profile: "fast",
  fly_baitfish: "medium",
  fly_bottom: "slow",
  fly_surface: "fast",
};

type ArchetypeStats = {
  viable_rows: number;
  top3_hits: number;
  top1_hits: number;
};

type CollisionExample = {
  species: string;
  region_key: string;
  month: number;
  context: string;
  clarity: string;
  gear_mode: "lure" | "fly";
  redundancy_key: string;
  ids: string[];
};

type RowSensitivityExample = {
  species: string;
  region_key: string;
  month: number;
  context: string;
  gear_mode: "lure" | "fly";
  unique_top1_count: number;
  unique_top3_signature_count: number;
  sample_top1_ids: string[];
  sample_lineups: string[];
};

type TacticalConflictExample = {
  species: string;
  region_key: string;
  month: number;
  context: string;
  clarity: string;
  gear_mode: "lure" | "fly";
  reason: string;
  ids: string[];
  lanes: string[];
  scores: number[];
};

type ReachabilityEntry<T extends string> = {
  id: T;
  role: RecommenderV3ArchetypeAuditExpectation["role"];
  required_reach: ArchetypeExpectationReach;
  notes: string;
  viable_rows: number;
  top3_hits: number;
  top1_hits: number;
  actual_best_reach: "none" | "viable_only" | "top3" | "top1";
  status: "pass" | "fail";
  failure_reason?: string;
};

type TargetStatus = {
  actual: number;
  target: number;
  pass: boolean;
};

function buildStats<T extends string>(
  ids: readonly T[],
): Record<T, ArchetypeStats> {
  return Object.fromEntries(
    ids.map((id) => [id, { viable_rows: 0, top3_hits: 0, top1_hits: 0 }]),
  ) as Record<T, ArchetypeStats>;
}

function toScenarioKey(row: RecommenderV3SeasonalRow): string {
  return `${row.species}|${row.region_key}|${row.context}|${row.month}`;
}

function round(value: number): number {
  return Number(value.toFixed(4));
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : round(numerator / denominator);
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function actualBestReach(
  stats: ArchetypeStats,
): ReachabilityEntry<string>["actual_best_reach"] {
  if (stats.top1_hits > 0) return "top1";
  if (stats.top3_hits > 0) return "top3";
  if (stats.viable_rows > 0) return "viable_only";
  return "none";
}

function collectRedundancyCollisions(
  ids: readonly RecommenderV3ArchetypeId[],
  gear_mode: "lure" | "fly",
): string[] {
  const redundancyCounts = new Map<string, number>();
  for (const id of ids) {
    const profile = gear_mode === "lure"
      ? LURE_ARCHETYPES_V3[id as LureArchetypeIdV3]
      : FLY_ARCHETYPES_V3[id as FlyArchetypeIdV3];
    const key = profile.family_group;
    if (!key) continue;
    redundancyCounts.set(key, (redundancyCounts.get(key) ?? 0) + 1);
  }
  return [...redundancyCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([key]) => key);
}

function detectTacticalConflict(
  candidates: readonly RecommenderV3RankedArchetype[],
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
): { reason: string; lanes: string[]; scores: number[] } | null {
  if (candidates.length < 2) return null;
  const top = candidates[0]!;
  const topPace = PACE_BY_LANE[top.tactical_lane];
  const topSurface = top.tactical_lane === "surface" ||
    top.tactical_lane === "fly_surface";
  const topBottom = top.tactical_lane === "bottom_contact" ||
    top.tactical_lane === "fly_bottom";

  for (const candidate of candidates.slice(1)) {
    const pace = PACE_BY_LANE[candidate.tactical_lane];
    const surface = candidate.tactical_lane === "surface" ||
      candidate.tactical_lane === "fly_surface";
    const bottom = candidate.tactical_lane === "bottom_contact" ||
      candidate.tactical_lane === "fly_bottom";

    if ((topSurface && bottom) || (topBottom && surface)) {
      if (
        daily.surface_window === "closed" ||
        resolved.daily_preference.preferred_presence === "subtle" ||
        daily.suppress_fast_presentations
      ) {
        return {
          reason: "surface_vs_bottom",
          lanes: candidates.map((entry) => entry.tactical_lane),
          scores: candidates.map((entry) => entry.score),
        };
      }
    }
    if (
      topPace === "slow" && pace === "fast" &&
      daily.suppress_fast_presentations
    ) {
      return {
        reason: "slow_vs_fast",
        lanes: candidates.map((entry) => entry.tactical_lane),
        scores: candidates.map((entry) => entry.score),
      };
    }
    if (
      topPace === "fast" && pace === "slow" &&
      resolved.daily_preference.preferred_pace === "fast"
    ) {
      return {
        reason: "slow_vs_fast",
        lanes: candidates.map((entry) => entry.tactical_lane),
        scores: candidates.map((entry) => entry.score),
      };
    }
  }

  return null;
}

function summarizeStats<T extends string>(
  stats: Record<T, ArchetypeStats>,
  ids: readonly T[],
  expectations: Record<T, RecommenderV3ArchetypeAuditExpectation>,
) {
  const entries = ids.map((id) => {
    const expectation = expectations[id];
    const stat = stats[id];
    const best = actualBestReach(stat);
    const pass = expectation.required_reach === "top1"
      ? stat.top1_hits > 0
      : stat.top3_hits > 0;
    return {
      id,
      role: expectation.role,
      required_reach: expectation.required_reach,
      notes: expectation.notes,
      viable_rows: stat.viable_rows,
      top3_hits: stat.top3_hits,
      top1_hits: stat.top1_hits,
      actual_best_reach: best,
      status: pass ? "pass" : "fail",
      failure_reason: pass
        ? undefined
        : expectation.required_reach === "top1"
        ? "expected_top1_but_never_won"
        : "expected_top3_but_never_appeared",
    } satisfies ReachabilityEntry<T>;
  });

  return {
    never_viable: entries.filter((entry) => entry.viable_rows === 0).map((
      entry,
    ) => entry.id),
    never_top3: entries.filter((entry) => entry.top3_hits === 0).map((entry) =>
      entry.id
    ),
    never_top1: entries.filter((entry) => entry.top1_hits === 0).map((entry) =>
      entry.id
    ),
    lowest_top3_presence: entries
      .filter((entry) => entry.top3_hits > 0)
      .sort((a, b) => a.top3_hits - b.top3_hits || a.id.localeCompare(b.id))
      .slice(0, 12),
    top1_leaders: entries
      .filter((entry) => entry.top1_hits > 0)
      .sort((a, b) => b.top1_hits - a.top1_hits || a.id.localeCompare(b.id))
      .slice(0, 12),
    expectation_mismatches: entries.filter((entry) => entry.status === "fail"),
    reachability_by_id: entries,
    role_summary: {
      winner_capable: {
        total:
          entries.filter((entry) => entry.role === "winner_capable").length,
        failing:
          entries.filter((entry) =>
            entry.role === "winner_capable" && entry.status === "fail"
          ).length,
      },
      top3_support: {
        total: entries.filter((entry) => entry.role === "top3_support").length,
        failing:
          entries.filter((entry) =>
            entry.role === "top3_support" && entry.status === "fail"
          ).length,
      },
      intentional_low_frequency_specialty: {
        total:
          entries.filter((entry) =>
            entry.role === "intentional_low_frequency_specialty"
          ).length,
        failing:
          entries.filter((entry) =>
            entry.role === "intentional_low_frequency_specialty" &&
            entry.status === "fail"
          ).length,
      },
    },
  };
}

function intentTable(
  title: string,
  entries: readonly ReachabilityEntry<string>[],
): string[] {
  return [
    `## ${title}`,
    "",
    "| Archetype | Role | Required | Status |",
    "| --- | --- | --- | --- |",
    ...entries.map((entry) =>
      `| ${entry.id} | ${entry.role} | ${entry.required_reach} | ${entry.status} |`
    ),
    "",
  ];
}

function buildTargetStatus(
  actual: number,
  target: number,
): TargetStatus {
  return {
    actual: round(actual),
    target,
    pass: actual <= target,
  };
}

function toMarkdown(payload: Record<string, unknown>): string {
  const lure = payload.lure as Record<string, unknown>;
  const fly = payload.fly as Record<string, unknown>;
  const locked = payload.locked_top1_rows as Record<string, number>;
  const lowSensitivity = payload.low_daily_sensitivity_rows as Record<
    string,
    Record<string, unknown>
  >;
  const conflicts = payload.tactical_conflicts as Record<
    string,
    Record<string, unknown>
  >;
  const targets = payload.success_targets as Record<
    string,
    Record<string, TargetStatus>
  >;
  const redundancyCollisions = payload
    .redundancy_collisions as CollisionExample[];

  const lines = [
    "# V3 Coverage Audit",
    "",
    `Generated: ${payload.generated_at}`,
    "",
    `Seasonal rows audited: ${payload.seasonal_rows}`,
    `Synthetic daily states per row: ${payload.synthetic_states_per_row}`,
    "",
    "## Scope",
    "",
    ...V3_IMPLEMENTATION_SCOPE_AREAS.map((item) => `- ${item}`),
    "",
    "## Role Definitions",
    "",
    ...Object.entries(ARCHETYPE_ROLE_DEFINITIONS).map(([role, description]) =>
      `- \`${role}\`: ${description}`
    ),
    "",
    "## Success Targets",
    "",
    `Locked top-1 ratio: lure ${
      formatPercent((targets.locked_top1_ratio.lure as TargetStatus).actual)
    } / target <= ${
      formatPercent((targets.locked_top1_ratio.lure as TargetStatus).target)
    }, fly ${
      formatPercent((targets.locked_top1_ratio.fly as TargetStatus).actual)
    } / target <= ${
      formatPercent((targets.locked_top1_ratio.fly as TargetStatus).target)
    }`,
    `Low daily sensitivity ratio: lure ${
      formatPercent(
        (targets.low_daily_sensitivity_ratio.lure as TargetStatus).actual,
      )
    } / target <= ${
      formatPercent(
        (targets.low_daily_sensitivity_ratio.lure as TargetStatus).target,
      )
    }, fly ${
      formatPercent(
        (targets.low_daily_sensitivity_ratio.fly as TargetStatus).actual,
      )
    } / target <= ${
      formatPercent(
        (targets.low_daily_sensitivity_ratio.fly as TargetStatus).target,
      )
    }`,
    `Tactical conflict rate: lure ${
      formatPercent(
        (targets.tactical_conflict_rate.lure as TargetStatus).actual,
      )
    } / target <= ${
      formatPercent(
        (targets.tactical_conflict_rate.lure as TargetStatus).target,
      )
    }, fly ${
      formatPercent((targets.tactical_conflict_rate.fly as TargetStatus).actual)
    } / target <= ${
      formatPercent((targets.tactical_conflict_rate.fly as TargetStatus).target)
    }`,
    `Expectation mismatches: lure ${
      (targets.expectation_mismatches.lure as TargetStatus).actual.toFixed(0)
    } / target <= ${
      (targets.expectation_mismatches.lure as TargetStatus).target.toFixed(0)
    }, fly ${
      (targets.expectation_mismatches.fly as TargetStatus).actual.toFixed(0)
    } / target <= ${
      (targets.expectation_mismatches.fly as TargetStatus).target.toFixed(0)
    }`,
    "",
    "## Locked Top-1 Rows",
    "",
    `Lure rows with only one possible top-1 across all synthetic states: ${locked.lure}`,
    `Fly rows with only one possible top-1 across all synthetic states: ${locked.fly}`,
    "",
    "## Low Daily Sensitivity",
    "",
    `Lure rows with only one top-1 and at most two ordered top-3 lineups: ${lowSensitivity.lure.count}`,
    `Fly rows with only one top-1 and at most two ordered top-3 lineups: ${lowSensitivity.fly.count}`,
    "",
    "## Tactical Conflicts",
    "",
    `Lure evaluated states with top-3 pace/story conflicts: ${conflicts.lure.count}`,
    `Fly evaluated states with top-3 pace/story conflicts: ${conflicts.fly.count}`,
    "",
    "## Library Reachability",
    "",
    `Lures never viable: ${
      ((lure.never_viable as string[]) ?? []).join(", ") || "none"
    }`,
    `Lures never top 3: ${
      ((lure.never_top3 as string[]) ?? []).join(", ") || "none"
    }`,
    `Lures never top 1: ${
      ((lure.never_top1 as string[]) ?? []).join(", ") || "none"
    }`,
    "",
    `Flies never viable: ${
      ((fly.never_viable as string[]) ?? []).join(", ") || "none"
    }`,
    `Flies never top 3: ${
      ((fly.never_top3 as string[]) ?? []).join(", ") || "none"
    }`,
    `Flies never top 1: ${
      ((fly.never_top1 as string[]) ?? []).join(", ") || "none"
    }`,
    "",
    "## Intended vs Actual",
    "",
    `Lure expectation mismatches: ${
      ((lure.expectation_mismatches as unknown[]) ?? []).length
    }`,
    `Fly expectation mismatches: ${
      ((fly.expectation_mismatches as unknown[]) ?? []).length
    }`,
    "",
    "## Redundancy Collisions",
    "",
    redundancyCollisions.length === 0
      ? "No tagged top-3 redundancy collisions were detected."
      : `Detected ${redundancyCollisions.length} tagged redundancy collisions.`,
    "",
  ];

  return [
    ...lines,
    ...intentTable(
      "Lure Intent Table",
      lure.reachability_by_id as ReachabilityEntry<string>[],
    ),
    ...intentTable(
      "Fly Intent Table",
      fly.reachability_by_id as ReachabilityEntry<string>[],
    ),
  ].join("\n");
}

async function main() {
  const lureStats = buildStats(LURE_ARCHETYPE_IDS_V3);
  const flyStats = buildStats(FLY_ARCHETYPE_IDS_V3);

  let lockedLureRows = 0;
  let lockedFlyRows = 0;
  let lowSensitivityLureRows = 0;
  let lowSensitivityFlyRows = 0;
  let lureConflictStates = 0;
  let flyConflictStates = 0;

  const lureLowSensitivityExamples: RowSensitivityExample[] = [];
  const flyLowSensitivityExamples: RowSensitivityExample[] = [];
  const lureConflictExamples: TacticalConflictExample[] = [];
  const flyConflictExamples: TacticalConflictExample[] = [];
  const redundancyCollisions: CollisionExample[] = [];

  for (const row of AUDITED_ROWS) {
    for (const id of row.eligible_lure_ids) lureStats[id].viable_rows += 1;
    for (const id of row.eligible_fly_ids) flyStats[id].viable_rows += 1;

    const uniqueLureTop1 = new Set<string>();
    const uniqueFlyTop1 = new Set<string>();
    const uniqueLureLineups = new Set<string>();
    const uniqueFlyLineups = new Set<string>();

    for (const clarity of CLARITIES) {
      for (const daily of DAILY_PAYLOADS) {
        const resolved = resolveFinalProfileV3(row, daily);
        const lures = scoreLureCandidatesV3(
          row,
          resolved,
          daily,
          clarity,
          null,
        );
        const flies = scoreFlyCandidatesV3(
          row,
          resolved,
          daily,
          clarity,
          null,
        );
        const lureLineup = lures.map((candidate) => candidate.id).join(" > ");
        const flyLineup = flies.map((candidate) => candidate.id).join(" > ");

        uniqueLureLineups.add(lureLineup);
        uniqueFlyLineups.add(flyLineup);

        for (const [index, candidate] of lures.entries()) {
          lureStats[candidate.id as LureArchetypeIdV3].top3_hits += 1;
          if (index === 0) {
            lureStats[candidate.id as LureArchetypeIdV3].top1_hits += 1;
            uniqueLureTop1.add(candidate.id);
          }
        }
        for (const [index, candidate] of flies.entries()) {
          flyStats[candidate.id as FlyArchetypeIdV3].top3_hits += 1;
          if (index === 0) {
            flyStats[candidate.id as FlyArchetypeIdV3].top1_hits += 1;
            uniqueFlyTop1.add(candidate.id);
          }
        }

        const lureConflict = detectTacticalConflict(
          lures,
          daily,
          resolved,
        );
        if (lureConflict) {
          lureConflictStates += 1;
          if (lureConflictExamples.length < 25) {
            lureConflictExamples.push({
              species: row.species,
              region_key: row.region_key,
              month: row.month,
              context: row.context,
              clarity,
              gear_mode: "lure",
              reason: lureConflict.reason,
              ids: lures.map((candidate) => candidate.id),
              lanes: lureConflict.lanes,
              scores: lureConflict.scores,
            });
          }
        }

        const flyConflict = detectTacticalConflict(
          flies,
          daily,
          resolved,
        );
        if (flyConflict) {
          flyConflictStates += 1;
          if (flyConflictExamples.length < 25) {
            flyConflictExamples.push({
              species: row.species,
              region_key: row.region_key,
              month: row.month,
              context: row.context,
              clarity,
              gear_mode: "fly",
              reason: flyConflict.reason,
              ids: flies.map((candidate) => candidate.id),
              lanes: flyConflict.lanes,
              scores: flyConflict.scores,
            });
          }
        }

        for (
          const redundancy_key of collectRedundancyCollisions(
            lures.map((candidate) => candidate.id),
            "lure",
          )
        ) {
          if (redundancyCollisions.length < 25) {
            redundancyCollisions.push({
              species: row.species,
              region_key: row.region_key,
              month: row.month,
              context: row.context,
              clarity,
              gear_mode: "lure",
              redundancy_key,
              ids: lures.map((candidate) => candidate.id),
            });
          }
        }

        for (
          const redundancy_key of collectRedundancyCollisions(
            flies.map((candidate) => candidate.id),
            "fly",
          )
        ) {
          if (redundancyCollisions.length < 25) {
            redundancyCollisions.push({
              species: row.species,
              region_key: row.region_key,
              month: row.month,
              context: row.context,
              clarity,
              gear_mode: "fly",
              redundancy_key,
              ids: flies.map((candidate) => candidate.id),
            });
          }
        }
      }
    }

    if (uniqueLureTop1.size === 1) lockedLureRows += 1;
    if (uniqueFlyTop1.size === 1) lockedFlyRows += 1;

    if (uniqueLureTop1.size === 1 && uniqueLureLineups.size <= 2) {
      lowSensitivityLureRows += 1;
      if (lureLowSensitivityExamples.length < 25) {
        lureLowSensitivityExamples.push({
          species: row.species,
          region_key: row.region_key,
          month: row.month,
          context: row.context,
          gear_mode: "lure",
          unique_top1_count: uniqueLureTop1.size,
          unique_top3_signature_count: uniqueLureLineups.size,
          sample_top1_ids: [...uniqueLureTop1].slice(0, 3),
          sample_lineups: [...uniqueLureLineups].slice(0, 3),
        });
      }
    }

    if (uniqueFlyTop1.size === 1 && uniqueFlyLineups.size <= 2) {
      lowSensitivityFlyRows += 1;
      if (flyLowSensitivityExamples.length < 25) {
        flyLowSensitivityExamples.push({
          species: row.species,
          region_key: row.region_key,
          month: row.month,
          context: row.context,
          gear_mode: "fly",
          unique_top1_count: uniqueFlyTop1.size,
          unique_top3_signature_count: uniqueFlyLineups.size,
          sample_top1_ids: [...uniqueFlyTop1].slice(0, 3),
          sample_lineups: [...uniqueFlyLineups].slice(0, 3),
        });
      }
    }
  }

  const lureSummary = summarizeStats(
    lureStats,
    LURE_ARCHETYPE_IDS_V3,
    LURE_ARCHETYPE_EXPECTATIONS,
  );
  const flySummary = summarizeStats(
    flyStats,
    FLY_ARCHETYPE_IDS_V3,
    FLY_ARCHETYPE_EXPECTATIONS,
  );
  const evaluatedStates = AUDITED_ROWS.length * CLARITIES.length *
    DAILY_PAYLOADS.length;

  const payload = {
    generated_at: new Date().toISOString(),
    seasonal_rows: AUDITED_ROWS.length,
    synthetic_states_per_row: CLARITIES.length * DAILY_PAYLOADS.length,
    scenario_keys_sample: ALL_ROWS.slice(0, 5).map(toScenarioKey),
    scope: {
      problem_areas: [...V3_IMPLEMENTATION_SCOPE_AREAS],
      role_definitions: ARCHETYPE_ROLE_DEFINITIONS,
    },
    success_targets: {
      locked_top1_ratio: {
        lure: buildTargetStatus(
          ratio(lockedLureRows, AUDITED_ROWS.length),
          V3_AUDIT_SUCCESS_TARGETS.locked_top1_ratio_max.lure,
        ),
        fly: buildTargetStatus(
          ratio(lockedFlyRows, AUDITED_ROWS.length),
          V3_AUDIT_SUCCESS_TARGETS.locked_top1_ratio_max.fly,
        ),
      },
      low_daily_sensitivity_ratio: {
        lure: buildTargetStatus(
          ratio(lowSensitivityLureRows, AUDITED_ROWS.length),
          V3_AUDIT_SUCCESS_TARGETS.low_daily_sensitivity_ratio_max.lure,
        ),
        fly: buildTargetStatus(
          ratio(lowSensitivityFlyRows, AUDITED_ROWS.length),
          V3_AUDIT_SUCCESS_TARGETS.low_daily_sensitivity_ratio_max.fly,
        ),
      },
      tactical_conflict_rate: {
        lure: buildTargetStatus(
          ratio(lureConflictStates, evaluatedStates),
          V3_AUDIT_SUCCESS_TARGETS.tactical_conflict_rate_max.lure,
        ),
        fly: buildTargetStatus(
          ratio(flyConflictStates, evaluatedStates),
          V3_AUDIT_SUCCESS_TARGETS.tactical_conflict_rate_max.fly,
        ),
      },
      expectation_mismatches: {
        lure: buildTargetStatus(
          lureSummary.expectation_mismatches.length,
          V3_AUDIT_SUCCESS_TARGETS.expectation_mismatches_max.lure,
        ),
        fly: buildTargetStatus(
          flySummary.expectation_mismatches.length,
          V3_AUDIT_SUCCESS_TARGETS.expectation_mismatches_max.fly,
        ),
      },
      never_viable: {
        lure: buildTargetStatus(
          lureSummary.never_viable.length,
          V3_AUDIT_SUCCESS_TARGETS.never_viable_max.lure,
        ),
        fly: buildTargetStatus(
          flySummary.never_viable.length,
          V3_AUDIT_SUCCESS_TARGETS.never_viable_max.fly,
        ),
      },
      never_top3: {
        lure: buildTargetStatus(
          lureSummary.never_top3.length,
          V3_AUDIT_SUCCESS_TARGETS.never_top3_max.lure,
        ),
        fly: buildTargetStatus(
          flySummary.never_top3.length,
          V3_AUDIT_SUCCESS_TARGETS.never_top3_max.fly,
        ),
      },
    },
    locked_top1_rows: {
      lure: lockedLureRows,
      fly: lockedFlyRows,
    },
    low_daily_sensitivity_rows: {
      lure: {
        count: lowSensitivityLureRows,
        examples: lureLowSensitivityExamples,
      },
      fly: {
        count: lowSensitivityFlyRows,
        examples: flyLowSensitivityExamples,
      },
    },
    tactical_conflicts: {
      lure: {
        count: lureConflictStates,
        examples: lureConflictExamples,
      },
      fly: {
        count: flyConflictStates,
        examples: flyConflictExamples,
      },
    },
    lure: lureSummary,
    fly: flySummary,
    redundancy_collisions: redundancyCollisions,
  };

  await Deno.writeTextFile(
    OUTPUT_JSON,
    `${JSON.stringify(payload, null, 2)}\n`,
  );
  await Deno.writeTextFile(OUTPUT_MARKDOWN, `${toMarkdown(payload)}\n`);
  console.log(`Wrote ${OUTPUT_JSON}`);
  console.log(`Wrote ${OUTPUT_MARKDOWN}`);
}

if (import.meta.main) {
  await main();
}
