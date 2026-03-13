// =============================================================================
// CORE INTELLIGENCE ENGINE — RECOVERY MODIFIER
// Implements Section 6 of core_intelligence_spec.md
// Cold front detection (pressure + cooling confirmation) and recovery multiplier.
// =============================================================================

import type { WaterType, EnvironmentSnapshot, FrontSeverity } from "./types.ts";

// ---------------------------------------------------------------------------
// Section 6A — Cold Front Detection
// A front is confirmed when:
//   1. Pressure drops >= 4 mb within a 12-hour window
//   2. Then rises >= 4 mb within the next 24 hours
//   3. Meaningful cooling: mean air temp in 24h after bottom is cooler than
//      mean air temp in 24h before the drop start (by at least 2°F)
// Uses hourly pressure and optional hourly air temp from the last 7 days.
// Severity: mild (4–6 mb drop), moderate (6–10 mb), severe (>10 mb or large temp drop).
// ---------------------------------------------------------------------------

function meanAirTempInWindow(
  hourly: Array<{ time_utc: string; value: number }>,
  startMs: number,
  endMs: number
): number | null {
  const vals = hourly
    .filter((h) => {
      const t = new Date(h.time_utc).getTime();
      return t >= startMs && t < endMs;
    })
    .map((h) => h.value);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function detectColdFront(
  env: EnvironmentSnapshot
): { daysSinceFront: number; frontSeverity: FrontSeverity | null; developing_front: boolean } {
  const history = env.hourly_pressure_mb;
  if (history.length < 12) return { daysSinceFront: 6, frontSeverity: null, developing_front: false };

  const sorted = [...history].sort(
    (a, b) => new Date(a.time_utc).getTime() - new Date(b.time_utc).getTime()
  );

  const nowMs = new Date(env.timestamp_utc).getTime();

  // Track all completed front events, not just the most recent
  interface FrontEvent {
    bottomMs: number;
    dropMb: number;
    severity: FrontSeverity;
    riseCompleted: boolean;
  }
  const completedFronts: FrontEvent[] = [];

  // Also detect developing fronts (drop confirmed but rise not yet)
  let developingFront = false;

  for (let i = 0; i < sorted.length - 1; i++) {
    const windowStart = sorted[i];
    const startMs = new Date(windowStart.time_utc).getTime();

    // Look for minimum pressure within 12h window
    const target12h = startMs + 12 * 3600 * 1000;
    let minPressureIdx = -1;
    let minPressure = windowStart.value;
    for (let j = i + 1; j < sorted.length; j++) {
      const t = new Date(sorted[j].time_utc).getTime();
      if (t > target12h + 2 * 3600 * 1000) break;
      if (sorted[j].value < minPressure) {
        minPressure = sorted[j].value;
        minPressureIdx = j;
      }
    }
    if (minPressureIdx < 0) continue;

    const dropValue = windowStart.value - minPressure;
    if (dropValue < 4) continue;

    const bottomMs = new Date(sorted[minPressureIdx].time_utc).getTime();

    // Check if this bottom overlaps with an already-detected front (within 36h)
    const overlapsExisting = completedFronts.some(
      (f) => Math.abs(f.bottomMs - bottomMs) < 36 * 3600 * 1000
    );
    if (overlapsExisting) continue;

    // Look for rise phase: pressure rises >=4mb within 24h after bottom
    const target24h = bottomMs + 24 * 3600 * 1000;
    let maxPressureAfterBottom = minPressure;
    let maxPressureAfterIdx = -1;
    for (let j = minPressureIdx + 1; j < sorted.length; j++) {
      const t = new Date(sorted[j].time_utc).getTime();
      if (t > target24h + 2 * 3600 * 1000) break;
      if (sorted[j].value > maxPressureAfterBottom) {
        maxPressureAfterBottom = sorted[j].value;
        maxPressureAfterIdx = j;
      }
    }

    const riseValue = maxPressureAfterBottom - minPressure;

    // If rise hasn't reached 4mb yet, check if we're still in the rise window
    if (riseValue < 4) {
      // Check if the bottom was recent enough that a rise could still happen
      if (nowMs - bottomMs < 24 * 3600 * 1000 && dropValue >= 4) {
        developingFront = true;
      }
      continue;
    }

    // Cooling confirmation when we have enough air temp history
    let coolingConfirmed = true;
    if (env.hourly_air_temp_f.length >= 72) {
      const beforeStart = startMs - 24 * 3600 * 1000;
      const afterEnd = bottomMs + 24 * 3600 * 1000;
      const meanBefore = meanAirTempInWindow(env.hourly_air_temp_f, beforeStart, startMs);
      const meanAfter = meanAirTempInWindow(env.hourly_air_temp_f, bottomMs, afterEnd);
      if (meanBefore !== null && meanAfter !== null) {
        const coolingDegF = meanBefore - meanAfter;
        coolingConfirmed = coolingDegF >= 2;
      }
    }
    if (!coolingConfirmed) continue;

    // Front is confirmed and completed
    let severity: FrontSeverity;
    if (dropValue > 10) severity = "severe";
    else if (dropValue >= 6) severity = "moderate";
    else severity = "mild";

    completedFronts.push({
      bottomMs,
      dropMb: dropValue,
      severity,
      riseCompleted: true,
    });
  }

  if (completedFronts.length === 0) {
    return { daysSinceFront: 6, frontSeverity: null, developing_front: developingFront };
  }

  // Return the most recent completed front
  const mostRecent = completedFronts.sort((a, b) => b.bottomMs - a.bottomMs)[0];
  const daysSince = Math.floor((nowMs - mostRecent.bottomMs) / (24 * 3600 * 1000));
  return {
    daysSinceFront: Math.max(0, daysSince),
    frontSeverity: mostRecent.severity,
    developing_front: developingFront,
  };
}

// ---------------------------------------------------------------------------
// Section 6B — Recovery Multiplier (weaker, biologically realistic)
// Base table by water type and days since front; severity modifier applied after.
// ---------------------------------------------------------------------------

const RECOVERY_BASE_MULTIPLIERS: Record<
  WaterType,
  Array<{ days: number; multiplier: number }>
> = {
  freshwater: [
    { days: 0, multiplier: 0.82 },
    { days: 1, multiplier: 0.88 },
    { days: 2, multiplier: 0.94 },
    { days: 3, multiplier: 0.98 },
    { days: 4, multiplier: 1.0 },
    { days: 5, multiplier: 1.0 },
  ],
  saltwater: [
    { days: 0, multiplier: 0.88 },
    { days: 1, multiplier: 0.93 },
    { days: 2, multiplier: 0.97 },
    { days: 3, multiplier: 1.0 },
    { days: 4, multiplier: 1.0 },
    { days: 5, multiplier: 1.0 },
  ],
  brackish: [
    { days: 0, multiplier: 0.85 },
    { days: 1, multiplier: 0.91 },
    { days: 2, multiplier: 0.96 },
    { days: 3, multiplier: 1.0 },
    { days: 4, multiplier: 1.0 },
    { days: 5, multiplier: 1.0 },
  ],
};

const SEVERITY_MODIFIER: Record<FrontSeverity, number> = {
  mild: 0.03,
  moderate: 0.0,
  severe: -0.05,
};

export function getRecoveryMultiplier(
  waterType: WaterType,
  daysSinceFront: number,
  frontSeverity: FrontSeverity | null
): number {
  if (daysSinceFront >= 6) return 1.0;
  const table = RECOVERY_BASE_MULTIPLIERS[waterType];
  const entry = table.find((e) => e.days === daysSinceFront);
  let mult = entry ? entry.multiplier : 1.0;
  if (frontSeverity) {
    mult = Math.max(0.5, Math.min(1.0, mult + SEVERITY_MODIFIER[frontSeverity]));
  }
  return Math.round(mult * 100) / 100;
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
