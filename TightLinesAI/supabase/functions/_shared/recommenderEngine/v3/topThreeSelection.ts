import type {
  RecommenderV3ArchetypeProfile,
  RecommenderV3DailyPayload,
  RecommenderV3RankedArchetype,
  RecommenderV3ResolvedProfile,
} from "./contracts.ts";
import { buildSelectionRoleWhyChosen } from "./recommendationCopy.ts";
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

function isSlowLane(profile: RecommenderV3ArchetypeProfile): boolean {
  return profile.tactical_lane === "bottom_contact" ||
    profile.tactical_lane === "finesse_subtle" ||
    profile.tactical_lane === "fly_bottom";
}

function isSurfaceLane(profile: RecommenderV3ArchetypeProfile): boolean {
  return profile.tactical_lane === "surface" || profile.tactical_lane === "fly_surface";
}

function lanePace(profile: RecommenderV3ArchetypeProfile): "slow" | "medium" | "fast" {
  if (isSlowLane(profile)) return "slow";
  if (
    profile.tactical_lane === "reaction_mid_column" ||
    isSurfaceLane(profile) ||
    profile.tactical_lane === "pike_big_profile"
  ) {
    return "fast";
  }
  return "medium";
}

export function peerArchetypesCoherenceConflict(
  peer: RecommenderV3ArchetypeProfile,
  candidate: RecommenderV3ArchetypeProfile,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
): boolean {
  const leadPace = lanePace(peer);
  const candidatePace = lanePace(candidate);
  const leadSurface = isSurfaceLane(peer);
  const candidateSurface = isSurfaceLane(candidate);
  const leadBottom = isSlowLane(peer);
  const candidateBottom = isSlowLane(candidate);

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
    (candidate.profile.tactical_lane === "surface" || candidate.profile.tactical_lane === "fly_surface")
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
): RecommenderV3RankedArchetype {
  const roleIndex: 0 | 1 | 2 = selectionRole === "best_match"
    ? 0
    : selectionRole === "strong_alternate"
    ? 1
    : 2;
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
    opportunity_mix_fit: roundScore(candidate.opportunity_mix_fit),
    color_theme: candidate.color_theme,
    color_recommendations: candidate.color_recommendations,
    why_chosen: buildSelectionRoleWhyChosen(candidate, selectionRole),
    how_to_fish: candidate.how_to_fish_by_role[roleIndex],
    breakdown: candidate.breakdown,
  };
}

export function selectTopThreeCandidates(
  scored: ScoredCandidate[],
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload,
): RecommenderV3RankedArchetype[] {
  const sorted = [...scored].sort(compareScored);
  if (sorted.length === 0) return [];

  const selected: ScoredCandidate[] = [{ ...sorted[0]!, opportunity_mix_fit: 0 }];
  const threshold = selectionThreshold(resolved.daily_preference.opportunity_mix);

  while (selected.length < 3 && selected.length < sorted.length) {
    const remaining = sorted.filter((candidate) =>
      !selected.some((chosen) => chosen.profile.id === candidate.profile.id)
    );
    const bestRemaining = remaining[0]!;
    let chosen = { ...bestRemaining, opportunity_mix_fit: 0 };
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
            opportunity_mix_fit: changeupBonus(candidate, selected, resolved),
          },
        }))
        .filter(({ candidate }) =>
          candidate.profile.family_group !== selected[0]!.profile.family_group &&
          (!leadIsWormHeavy || !isWormHeavyCandidate(candidate))
        )
        .sort((a, b) =>
          b.candidate.opportunity_mix_fit - a.candidate.opportunity_mix_fit ||
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
          opportunity_mix_fit: changeupBonus(bestCoherentRemaining, selected, resolved),
        };
      }
    } else {
      const changeups = changeupPool
        .map((candidate) => ({
          candidate: {
            ...candidate,
            opportunity_mix_fit: changeupBonus(candidate, selected, resolved),
          },
        }))
        .sort((a, b) =>
          b.candidate.opportunity_mix_fit - a.candidate.opportunity_mix_fit ||
          compareScored(a.candidate, b.candidate)
        );
      const changeupThreshold = bestRemainingRepeatsFamily || bestRemainingRepeatsWormClass
        ? threshold + 1.4
        : threshold + 0.2;
      if (
        changeups[0] &&
        changeups[0].candidate.opportunity_mix_fit > 0 &&
        changeups[0].candidate.score >= bestCoherentRemaining.score - changeupThreshold
      ) {
        chosen = changeups[0].candidate;
      } else {
        chosen = {
          ...bestCoherentRemaining,
          opportunity_mix_fit: changeupBonus(bestCoherentRemaining, selected, resolved),
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
            opportunity_mix_fit: changeupBonus(rescue, selected, resolved),
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
      opportunity_mix_fit: changeupBonus(fallback, selected, resolved),
    });
  }

  return selected.slice(0, 3).map((candidate, index) =>
    finalizeCandidate(
      candidate,
      index === 0 ? "best_match" : index === 1 ? "strong_alternate" : "change_up",
    )
  );
}
