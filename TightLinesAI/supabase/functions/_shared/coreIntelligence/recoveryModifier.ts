// =============================================================================
// CORE INTELLIGENCE ENGINE — RECOVERY MODIFIER
// Implements Section 6 of core_intelligence_spec.md
// Cold front detection and recovery multiplier calculation.
// =============================================================================

import type { WaterType, EnvironmentSnapshot } from "./types.ts";

// ---------------------------------------------------------------------------
// Section 6A — Cold Front Detection
// A front is detected when:
//   1. pressure drops >= 4mb within any 12-hour window
//   2. then rises >= 4mb within the next 24 hours
// Uses hourly pressure history from the last 7 days.
// ---------------------------------------------------------------------------

export function detectColdFront(
  env: EnvironmentSnapshot
): { daysSinceFront: number } {
  const history = env.hourly_pressure_mb;
  if (history.length < 12) return { daysSinceFront: 6 };

  // Sort oldest first
  const sorted = [...history].sort(
    (a, b) => new Date(a.time_utc).getTime() - new Date(b.time_utc).getTime()
  );

  const nowMs = new Date(env.timestamp_utc).getTime();
  let bestFrontMs: number | null = null;

  for (let i = 0; i < sorted.length - 1; i++) {
    const windowStart = sorted[i];

    // Find a point ~12 hours later
    const target12h = new Date(windowStart.time_utc).getTime() + 12 * 3600 * 1000;
    let closestIdx12 = -1;
    let closestDiff12 = Infinity;
    for (let j = i + 1; j < sorted.length; j++) {
      const diff = Math.abs(new Date(sorted[j].time_utc).getTime() - target12h);
      if (diff < closestDiff12) {
        closestDiff12 = diff;
        closestIdx12 = j;
      }
    }
    if (closestIdx12 < 0 || closestDiff12 > 2 * 3600 * 1000) continue;

    const dropValue = windowStart.value - sorted[closestIdx12].value;
    if (dropValue < 4) continue; // no drop

    // Check for 4mb rise in the next 24 hours after the bottom
    const bottomMs = new Date(sorted[closestIdx12].time_utc).getTime();
    const target24h = bottomMs + 24 * 3600 * 1000;
    let closestIdx24 = -1;
    let closestDiff24 = Infinity;
    for (let j = closestIdx12 + 1; j < sorted.length; j++) {
      const t = new Date(sorted[j].time_utc).getTime();
      if (t > target24h + 2 * 3600 * 1000) break;
      const diff = Math.abs(t - target24h);
      if (diff < closestDiff24) {
        closestDiff24 = diff;
        closestIdx24 = j;
      }
    }
    if (closestIdx24 < 0 || closestDiff24 > 2 * 3600 * 1000) continue;

    const riseValue = sorted[closestIdx24].value - sorted[closestIdx12].value;
    if (riseValue < 4) continue;

    // Front confirmed — the front "passed" at the bottom
    if (!bestFrontMs || bottomMs > bestFrontMs) {
      bestFrontMs = bottomMs;
    }
  }

  if (bestFrontMs === null) return { daysSinceFront: 6 };

  const daysSince = Math.floor((nowMs - bestFrontMs) / (24 * 3600 * 1000));
  return { daysSinceFront: Math.max(0, daysSince) };
}

// ---------------------------------------------------------------------------
// Section 6B — Recovery Multiplier Table
// ---------------------------------------------------------------------------

const RECOVERY_MULTIPLIERS: Record<
  WaterType,
  Array<{ days: number; multiplier: number }>
> = {
  freshwater: [
    { days: 0, multiplier: 0.35 },
    { days: 1, multiplier: 0.45 },
    { days: 2, multiplier: 0.60 },
    { days: 3, multiplier: 0.75 },
    { days: 4, multiplier: 0.88 },
    { days: 5, multiplier: 0.95 },
  ],
  saltwater: [
    { days: 0, multiplier: 0.55 },
    { days: 1, multiplier: 0.65 },
    { days: 2, multiplier: 0.78 },
    { days: 3, multiplier: 0.88 },
    { days: 4, multiplier: 0.95 },
    { days: 5, multiplier: 1.00 },
  ],
  brackish: [
    { days: 0, multiplier: 0.45 },
    { days: 1, multiplier: 0.55 },
    { days: 2, multiplier: 0.69 },
    { days: 3, multiplier: 0.82 },
    { days: 4, multiplier: 0.92 },
    { days: 5, multiplier: 0.98 },
  ],
};

export function getRecoveryMultiplier(
  waterType: WaterType,
  daysSinceFront: number
): number {
  if (daysSinceFront >= 6) return 1.0;
  const table = RECOVERY_MULTIPLIERS[waterType];
  const entry = table.find((e) => e.days === daysSinceFront);
  return entry ? entry.multiplier : 1.0;
}

// ---------------------------------------------------------------------------
// Section 6C — Final (Adjusted) Score
// ---------------------------------------------------------------------------

export function computeAdjustedScore(
  rawScore: number,
  recoveryMultiplier: number
): number {
  return Math.round(rawScore * recoveryMultiplier);
}
