import type { WaterClarity } from "../contracts/input.ts";
import type {
  RecommenderV3ArchetypeProfile,
  RecommenderV3DailyPayload,
  RecommenderV3RankedArchetype,
  RecommenderV3ResolvedProfile,
  RecommenderV3SeasonalRow,
} from "./contracts.ts";
import { colorReasonPhraseV3 } from "./colorDecision.ts";
import {
  buildSelectionRoleWhyChosen,
  buildWhyChosen,
} from "./recommendationCopy.ts";
import type { ScoredCandidate } from "./scoringTypes.ts";

const WORM_HEAVY_FAMILIES = new Set([
  "worm",
  "drop_shot",
]);

function roundScore(value: number): number {
  return Number(value.toFixed(2));
}

function compareScored(a: ScoredCandidate, b: ScoredCandidate): number {
  return (b.sort_score - a.sort_score) ||
    b.score - a.score ||
    b.tactical_fit - a.tactical_fit ||
    b.practicality_fit - a.practicality_fit ||
    b.forage_fit - a.forage_fit ||
    b.clarity_fit - a.clarity_fit ||
    a.profile.id.localeCompare(b.profile.id);
}

function isWormHeavyCandidate(candidate: ScoredCandidate): boolean {
  return WORM_HEAVY_FAMILIES.has(candidate.profile.family_group);
}

export function peerArchetypesCoherenceConflict(
  peer: RecommenderV3ArchetypeProfile,
  candidate: RecommenderV3ArchetypeProfile,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
): boolean {
  const leadPace = peer.pace;
  const candidatePace = candidate.pace;
  const leadSurface = peer.is_surface;
  const candidateSurface = candidate.is_surface;
  const leadBottom = peer.primary_column === "bottom";
  const candidateBottom = candidate.primary_column === "bottom";

  if (
    (leadSurface && candidateBottom) || (leadBottom && candidateSurface)
  ) {
    if (
      daily.surface_window === "closed" ||
      resolved.daily_preference.preferred_presence === "subtle" ||
      daily.suppress_fast_presentations
    ) {
      return true;
    }
  }

  if (leadPace === "slow" && candidatePace === "fast" && daily.suppress_fast_presentations) {
    return true;
  }

  if (
    leadPace === "fast" &&
    candidatePace === "slow" &&
    resolved.daily_preference.preferred_pace === "fast"
  ) {
    return true;
  }

  return false;
}

function peerScoredCoherenceConflict(
  peer: ScoredCandidate,
  candidate: ScoredCandidate,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
): boolean {
  return peerArchetypesCoherenceConflict(
    peer.profile,
    candidate.profile,
    daily,
    resolved,
  );
}

function changeupBonus(
  candidate: ScoredCandidate,
  selected: readonly ScoredCandidate[],
  resolved: RecommenderV3ResolvedProfile,
): number {
  const lead = selected[0]!;
  const usedFamilies = new Set(selected.map((entry) => entry.profile.family_group));
  const usedLanes = new Set(selected.map((entry) => entry.profile.tactical_lane));
  const usedColumns = new Set(selected.map((entry) => entry.profile.primary_column));
  const usedPaces = new Set(selected.map((entry) => entry.profile.pace));
  const usedPresence = new Set(selected.map((entry) => entry.profile.presence));
  let bonus = 0;
  if (!usedFamilies.has(candidate.profile.family_group)) bonus += 0.65;
  // Lane-diversity term (cf. `docs/audits/recommender-v3/_correction_plan.md`
  // §3.3). The asymmetric +0.3 reward / -0.15 penalty makes tactical-lane
  // variety a meaningful trio signal alongside family-group variety, so the
  // trio does not collapse to three picks from the same lane when their
  // family_group differs but lane shape is identical.
  if (!usedLanes.has(candidate.profile.tactical_lane)) bonus += 0.3;
  if (!usedColumns.has(candidate.profile.primary_column)) bonus += 0.2;
  if (!usedPaces.has(candidate.profile.pace)) bonus += 0.15;
  if (!usedPresence.has(candidate.profile.presence)) bonus += 0.1;
  if (usedFamilies.has(candidate.profile.family_group)) bonus -= 0.35;
  if (usedLanes.has(candidate.profile.tactical_lane)) bonus -= 0.15;
  if (candidate.profile.family_group === lead.profile.family_group) bonus -= 0.55;
  if (candidate.profile.tactical_lane === lead.profile.tactical_lane) bonus -= 0.25;
  if (
    isWormHeavyCandidate(candidate) &&
    selected.some((entry) => isWormHeavyCandidate(entry))
  ) {
    bonus -= 0.75;
  }
  if (
    candidate.profile.primary_column === resolved.daily_preference.secondary_column ||
    candidate.profile.pace === resolved.daily_preference.secondary_pace ||
    candidate.profile.presence === resolved.daily_preference.secondary_presence
  ) {
    bonus += 0.25;
  }
  if (
    resolved.daily_preference.surface_allowed_today &&
    candidate.profile.is_surface
  ) {
    bonus += resolved.daily_preference.surface_window === "clean" ? 0.45 : 0.3;
  }
  return bonus;
}

function selectionThreshold(opportunityMix: RecommenderV3ResolvedProfile["daily_preference"]["opportunity_mix"]): number {
  switch (opportunityMix) {
    case "conservative":
      return 0.45;
    case "aggressive":
      return 1.15;
    case "balanced":
    default:
      return 0.8;
  }
}

function finalizeCandidate(
  candidate: ScoredCandidate,
  selectionRole: RecommenderV3RankedArchetype["selection_role"],
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
  waterClarity: WaterClarity,
): RecommenderV3RankedArchetype {
  const roleIndex: 0 | 1 | 2 = selectionRole === "best_match"
    ? 0
    : selectionRole === "strong_alternate"
    ? 1
    : 2;
  const cd = candidate.resolved_color_decision;
  return {
    id: candidate.profile.id,
    display_name: candidate.profile.display_name,
    gear_mode: candidate.profile.gear_mode,
    family_group: candidate.profile.family_group,
    primary_column: candidate.profile.primary_column,
    pace: candidate.profile.pace,
    presence: candidate.profile.presence,
    is_surface: candidate.profile.is_surface,
    tactical_lane: candidate.profile.tactical_lane,
    score: candidate.score,
    selection_role: selectionRole,
    tactical_fit: candidate.tactical_fit,
    practicality_fit: candidate.practicality_fit,
    forage_fit: candidate.forage_fit,
    clarity_fit: candidate.clarity_fit,
    diversity_bonus: roundScore(candidate.diversity_bonus),
    color_theme: candidate.color_theme,
    color_recommendations: candidate.color_recommendations,
    color_decision: {
      theme: cd.color_theme,
      reason_code: cd.reason_code,
      short_reason: colorReasonPhraseV3(cd.reason_code),
    },
    why_chosen: buildSelectionRoleWhyChosen(
      {
        ...candidate,
        why_chosen: buildWhyChosen(
          candidate.profile,
          candidate.breakdown,
          seasonal,
          daily,
          resolved,
          waterClarity,
          candidate.diversity_bonus,
        ),
      },
      selectionRole,
    ),
    how_to_fish: candidate.how_to_fish_by_role[roleIndex],
    breakdown: candidate.breakdown,
  };
}

export function selectTopThreeCandidates(
  scored: ScoredCandidate[],
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload,
  seasonal: RecommenderV3SeasonalRow,
  waterClarity: WaterClarity,
): RecommenderV3RankedArchetype[] {
  const sorted = [...scored].sort(compareScored);
  if (sorted.length === 0) return [];

  const selected: ScoredCandidate[] = [{ ...sorted[0]!, diversity_bonus: 0 }];
  const threshold = selectionThreshold(resolved.daily_preference.opportunity_mix);

  while (selected.length < 3 && selected.length < sorted.length) {
    const remaining = sorted.filter((candidate) =>
      !selected.some((chosen) => chosen.profile.id === candidate.profile.id)
    );
    const bestRemaining = remaining[0]!;
    let chosen = { ...bestRemaining, diversity_bonus: 0 };
    const leadIsWormHeavy = isWormHeavyCandidate(selected[0]!);
    const bestRemainingRepeatsFamily = selected.some((entry) =>
      entry.profile.family_group === bestRemaining.profile.family_group
    );
    const bestRemainingRepeatsWormClass = isWormHeavyCandidate(bestRemaining) &&
      selected.some((entry) => isWormHeavyCandidate(entry));
    let coherentRemaining: ScoredCandidate[];
    if (selected.length === 1) {
      coherentRemaining = remaining.filter((candidate) =>
        !peerScoredCoherenceConflict(selected[0]!, candidate, daily, resolved)
      );
    } else {
      const coherentWithAllPeers = remaining.filter((candidate) =>
        selected.every((peer) =>
          !peerScoredCoherenceConflict(peer, candidate, daily, resolved)
        )
      );
      coherentRemaining = coherentWithAllPeers.length > 0
        ? coherentWithAllPeers
        : remaining.filter((candidate) =>
          !peerScoredCoherenceConflict(selected[0]!, candidate, daily, resolved)
        );
    }
    const orderedCoherent = [...coherentRemaining].sort(compareScored);
    let bestCoherentRemaining = orderedCoherent[0] ?? bestRemaining;
    if (selected.length >= 2) {
      const pick2Safe = orderedCoherent.find(
        (c) => !peerScoredCoherenceConflict(selected[1]!, c, daily, resolved),
      );
      if (pick2Safe) bestCoherentRemaining = pick2Safe;
    }

    const changeupPool =
      selected.length >= 2
        ? orderedCoherent.filter(
          (c) => !peerScoredCoherenceConflict(selected[1]!, c, daily, resolved),
        )
        : orderedCoherent;

    if (selected.length === 1) {
      const diverse = coherentRemaining
        .map((candidate) => ({
          candidate: {
            ...candidate,
            diversity_bonus: changeupBonus(candidate, selected, resolved),
          },
        }))
        .filter(({ candidate }) =>
          candidate.profile.family_group !== selected[0]!.profile.family_group &&
          (!leadIsWormHeavy || !isWormHeavyCandidate(candidate))
        )
        .sort((a, b) =>
          b.candidate.diversity_bonus - a.candidate.diversity_bonus ||
          compareScored(a.candidate, b.candidate)
        );
      const diversityThreshold = bestRemainingRepeatsFamily || bestRemainingRepeatsWormClass
        ? threshold + 1.4
        : threshold;
      if (
        diverse[0] &&
        diverse[0].candidate.score >= bestCoherentRemaining.score - diversityThreshold
      ) {
        chosen = diverse[0].candidate;
      } else {
        chosen = {
          ...bestCoherentRemaining,
          diversity_bonus: changeupBonus(bestCoherentRemaining, selected, resolved),
        };
      }
    } else {
      const changeups = changeupPool
        .map((candidate) => ({
          candidate: {
            ...candidate,
            diversity_bonus: changeupBonus(candidate, selected, resolved),
          },
        }))
        .sort((a, b) =>
          b.candidate.diversity_bonus - a.candidate.diversity_bonus ||
          compareScored(a.candidate, b.candidate)
        );
      const changeupThreshold = bestRemainingRepeatsFamily || bestRemainingRepeatsWormClass
        ? threshold + 1.4
        : threshold + 0.2;
      if (
        changeups[0] &&
        changeups[0].candidate.diversity_bonus > 0 &&
        changeups[0].candidate.score >= bestCoherentRemaining.score - changeupThreshold
      ) {
        chosen = changeups[0].candidate;
      } else {
        chosen = {
          ...bestCoherentRemaining,
          diversity_bonus: changeupBonus(bestCoherentRemaining, selected, resolved),
        };
      }
    }

    if (selected.length >= 2) {
      if (peerScoredCoherenceConflict(selected[1]!, chosen, daily, resolved)) {
        const rescue = [...remaining].sort(compareScored).find((candidate) =>
          !peerScoredCoherenceConflict(selected[0]!, candidate, daily, resolved) &&
          !peerScoredCoherenceConflict(selected[1]!, candidate, daily, resolved)
        );
        if (rescue) {
          chosen = {
            ...rescue,
            diversity_bonus: changeupBonus(rescue, selected, resolved),
          };
        }
      }
    }

    selected.push(chosen);
  }

  while (selected.length < 3 && selected.length < sorted.length) {
    const fallback = sorted.find((candidate) => {
      if (selected.some((chosen) => chosen.profile.id === candidate.profile.id)) {
        return false;
      }
      if (
        selected.length >= 2 &&
        peerScoredCoherenceConflict(selected[1]!, candidate, daily, resolved)
      ) {
        return false;
      }
      return true;
    });
    if (!fallback) break;
    selected.push({
      ...fallback,
      diversity_bonus: changeupBonus(fallback, selected, resolved),
    });
  }

  return selected.slice(0, 3).map((candidate, index) =>
    finalizeCandidate(
      candidate,
      index === 0 ? "best_match" : index === 1 ? "strong_alternate" : "change_up",
      seasonal,
      daily,
      resolved,
      waterClarity,
    )
  );
}
