import type {
  ActivityState,
  ChaseRadiusState,
  DepthLaneId,
  PresentationMotion,
  RelationTagId,
  ScoredId,
  StrikeZoneState,
} from "./contracts.ts";

export const DEPTH_LANE_IDS = [
  "very_shallow",
  "shallow",
  "mid_depth",
  "deep",
  "suspended",
  "bottom_oriented",
  "upper_column",
  "lower_column",
] as const satisfies readonly DepthLaneId[];

export const RELATION_TAG_IDS = [
  "cover_oriented",
  "vegetation_oriented",
  "edge_oriented",
  "structure_oriented",
  "current_break_oriented",
  "channel_related",
  "flats_related",
  "shoreline_cruising",
  "open_water_roaming",
  "shade_oriented",
  "depth_transition_oriented",
  "undercut_bank_oriented",
  "hole_oriented",
  "seam_oriented",
  "point_oriented",
  "drain_oriented",
  "grass_edge_oriented",
  "pothole_oriented",
  "trough_oriented",
  "oyster_bar_oriented",
  "marsh_edge_oriented",
  // River structural zones — distinct from seam/hole; give precision to fish position routing
  "riffle_oriented",   // fast, oxygenated, shallow water; active feeding in summer; trout/smallmouth prime zone
  "tailout_oriented",  // tail of a pool graduating to riffle; prime intercept position at many flow levels
  "pool_oriented",     // deep holding water; refuge in winter, high flow, and extreme heat
] as const satisfies readonly RelationTagId[];

export const DAYPART_IDS = ["dawn", "morning", "afternoon", "evening"] as const;

export type DaypartId = (typeof DAYPART_IDS)[number];

export function emptyScoreMap<T extends string>(
  ids: readonly T[],
): Record<T, number> {
  return Object.fromEntries(ids.map((id) => [id, 0])) as Record<T, number>;
}

export function addToScore<T extends string>(
  scores: Record<T, number>,
  id: T,
  delta: number,
): void {
  scores[id] = Number((scores[id] + delta).toFixed(2));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function topScoredIds<T extends string>(
  scores: Record<T, number>,
  ids: readonly T[],
  limit = ids.length,
): Array<ScoredId<T>> {
  return ids
    .map((id) => ({ id, score: Number(scores[id].toFixed(2)) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function activityFromIndex(index: number): ActivityState {
  if (index <= -1.1) return "inactive";
  if (index < 0.5) return "neutral";
  if (index < 1.6) return "active";
  return "aggressive";
}

export function strikeZoneFromIndex(index: number): StrikeZoneState {
  if (index <= -0.5) return "narrow";
  if (index < 0.65) return "moderate";
  return "wide";
}

export function chaseRadiusFromIndex(index: number): ChaseRadiusState {
  if (index <= -0.45) return "short";
  if (index < 0.75) return "moderate";
  return "long";
}

export function uniq<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function highlightedDayparts(
  highlighted?: [boolean, boolean, boolean, boolean],
): DaypartId[] {
  if (!highlighted) return [];
  return DAYPART_IDS.filter((_, i) => highlighted[i]);
}

export function daypartLabel(daypart: DaypartId): string {
  switch (daypart) {
    case "dawn":
      return "Dawn";
    case "morning":
      return "Morning";
    case "afternoon":
      return "Afternoon";
    case "evening":
      return "Evening";
  }
}

export function motionLabel(motion: PresentationMotion): string {
  switch (motion) {
    case "twitch_pause":
      return "twitch-pause";
    case "walk_pause":
      return "walk-pause";
    case "pop_pause":
      return "pop-pause";
    case "straight_retrieve":
      return "straight retrieve";
    case "drift_natural":
      return "natural drift";
    default:
      return motion.replaceAll("_", " ");
  }
}
