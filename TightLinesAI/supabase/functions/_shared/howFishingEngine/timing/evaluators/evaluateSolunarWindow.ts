/**
 * Solunar timing evaluator — weak secondary/fallback signal.
 *
 * Solunar data (major/minor feeding peaks) is the weakest timing driver.
 * It only fires as a secondary driver or as the last resort before fallback.
 * Strength is always fair_default — it should never override a qualified
 * primary signal on its own.
 */

import type { SharedNormalizedOutput } from "../../contracts/mod.ts";
import type {
  DaypartFlags,
  TimingEvalOptions,
  TimingSignal,
} from "../timingTypes.ts";

/** Map an hour (0–23) to its daypart index: 0=dawn, 1=morning, 2=afternoon, 3=evening */
function daypartFromHour(h: number): number | null {
  if (h >= 5 && h < 7) return 0;
  if (h >= 7 && h < 11) return 1;
  if (h >= 11 && h < 17) return 2;
  if (h >= 17 && h < 21) return 3;
  return null;
}

export function evaluateSolunarWindow(
  _norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): TimingSignal | null {
  const peaks = opts.solunar_peak_local;
  if (!peaks || peaks.length === 0) return null;

  // Parse solunar peak times → map to dayparts
  const periods: DaypartFlags = [false, false, false, false];
  let anyParsed = false;

  for (const peak of peaks) {
    // Solunar peaks may be formatted as "HH:mm", "H:mm AM/PM", etc.
    const match24 = peak.match(/\b(\d{1,2}):(\d{2})\b/);
    if (match24) {
      let h = parseInt(match24[1]!, 10);
      // Handle AM/PM suffix if present
      const ampm = peak.match(/\b(am|pm)\b/i);
      if (ampm) {
        const isPm = ampm[1]!.toLowerCase() === "pm";
        if (isPm && h < 12) h += 12;
        if (!isPm && h === 12) h = 0;
      }
      const dp = daypartFromHour(h);
      if (dp !== null) {
        periods[dp] = true;
        anyParsed = true;
      }
    }
  }

  // If nothing was parseable, default to dawn+evening (classic solunar bias)
  if (!anyParsed) {
    periods[0] = true; // dawn
    periods[3] = true; // evening
  }

  return {
    driver_id: "solunar_minor",
    role: "anchor",
    strength: "fair_default",
    periods,
    note_pool_key: "solunar_minor",
    debug_reason:
      `Solunar peaks available (${peaks.length} entries); ` +
      `parsed=${anyParsed}; strength capped at fair_default.`,
  };
}
