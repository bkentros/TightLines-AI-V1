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

function recencyWeight(daysAgo: number): number {
  if (daysAgo <= 1) return 70;
  if (daysAgo <= 3) return 45;
  if (daysAgo <= 7) return 25;
  return 0;
}

/**
 * Soft anti-repetition penalty.
 *
 * Recent history only nudges ranking away from repeats. It never blocks an
 * archetype outright, so genuinely thin exact-fit pools can still repeat the
 * best item when there is no honest alternative.
 */
export function recentHistoryPenalty(args: {
  archetypeId: string;
  side: GearMode;
  currentLocalDate: string;
  recentHistory: readonly RecentRecommendationHistoryEntry[];
}): number {
  const { archetypeId, side, currentLocalDate, recentHistory } = args;

  let total = 0;
  for (const entry of recentHistory) {
    if (entry.gear_mode !== side) continue;
    if (entry.archetype_id !== archetypeId) continue;

    const daysAgo = daysBetweenIsoDates(entry.local_date, currentLocalDate);
    if (daysAgo == null || daysAgo <= 0) continue;
    total += recencyWeight(daysAgo);
  }

  return Math.min(total, 90);
}
