import type { GearMode } from "../contracts/families.ts";

export type RecentRecommendationHistoryEntry = {
  archetype_id: string;
  gear_mode: GearMode;
  local_date: string;
};

function daysBetweenIsoDates(a: string, b: string): number | null {
  const utcA = Date.parse(`${a}T00:00:00Z`);
  const utcB = Date.parse(`${b}T00:00:00Z`);
  if (Number.isNaN(utcA) || Number.isNaN(utcB)) return null;
  return Math.round((utcB - utcA) / 86_400_000);
}

/**
 * Structural anti-repetition flag.
 * Recent history narrows a finalist pool only when at least one non-recent
 * exact-fit finalist exists; thin pools can still repeat an honest fit.
 */
export function isRecentlyShown(args: {
  archetypeId: string;
  side: GearMode;
  currentLocalDate: string;
  recentHistory: readonly RecentRecommendationHistoryEntry[];
}): boolean {
  const { archetypeId, side, currentLocalDate, recentHistory } = args;

  for (const entry of recentHistory) {
    if (entry.gear_mode !== side) continue;
    if (entry.archetype_id !== archetypeId) continue;

    const daysAgo = daysBetweenIsoDates(entry.local_date, currentLocalDate);
    if (daysAgo == null || daysAgo <= 0) continue;
    if (daysAgo <= 7) return true;
  }
  return false;
}
