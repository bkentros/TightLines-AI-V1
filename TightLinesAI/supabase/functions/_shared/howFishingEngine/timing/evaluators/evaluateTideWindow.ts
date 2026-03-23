/**
 * Tide exchange window evaluator — coastal timing driver #1.
 *
 * SALTWATER RULE: Tide/current should normally be the primary timing anchor
 * for all coastal contexts. This evaluator must degrade gracefully when
 * tide data is missing, weak, flat, or unusable.
 *
 * Qualification:
 * - Best case: parseable NOAA high/low events → map exchanges to dayparts.
 *   If exchanges scatter across 3+ buckets, keep only the **earliest and latest**
 *   bucket so we never imply “all four windows are equally best.”
 * - Mid case: tide_current_movement score ≥ 1 but no specific times → honest
 *   “tides matter but clock unknown” with **no** daypart highlights (not all four).
 * - Worst case: no usable tide data → returns null, lets secondary/fallback take over
 */

import type { SharedNormalizedOutput } from "../../contracts/mod.ts";
import type {
  DaypartFlags,
  TimingEvalOptions,
  TimingSignal,
  TimingStrength,
} from "../timingTypes.ts";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Map an hour (0–23) to its daypart index: 0=dawn, 1=morning, 2=afternoon, 3=evening */
function daypartFromHour(h: number): number | null {
  if (h >= 5 && h < 7) return 0; // dawn
  if (h >= 7 && h < 11) return 1; // morning
  if (h >= 11 && h < 17) return 2; // afternoon
  if (h >= 17 && h < 21) return 3; // evening
  return null;
}

/**
 * Map any hour to the closest marketing daypart so night/early-morning tides
 * still anchor to dawn or evening instead of lighting the entire clock.
 */
function daypartFromHourNearest(h: number): number {
  const d = daypartFromHour(h);
  if (d !== null) return d;
  if (h < 5) return 0;
  return 3;
}

/** Parse hour/minute from NOAA-style strings (ISO `...T06:30:00` or `... 06:30`). */
function parseHourMinuteFromTideTime(time: string): { h: number; m: number } | null {
  const iso = time.match(/(?:T|\s)(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (iso) {
    const hh = parseInt(iso[1]!, 10);
    const mm = parseInt(iso[2]!, 10);
    if (Number.isFinite(hh) && Number.isFinite(mm)) return { h: hh, m: mm };
  }
  const head = time.match(/^(\d{1,2}):(\d{2})\b/);
  if (head) {
    const hh = parseInt(head[1]!, 10);
    const mm = parseInt(head[2]!, 10);
    if (Number.isFinite(hh) && Number.isFinite(mm)) return { h: hh, m: mm };
  }
  return null;
}

/** Format a parsed hour+minute into readable time like "9:30am" or "3pm". */
function fmtTideTime(h: number, m: number): string {
  const period = h < 12 ? "am" : "pm";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const displayM = m > 0 ? `:${String(m).padStart(2, "0")}` : "";
  return `${displayH}${displayM}${period}`;
}

/**
 * Build daypart flags from exchange hours.
 * - One distinct bucket → highlight only that bucket (e.g. slack at 2pm → afternoon).
 * - Two buckets → both highlighted.
 * - Three or more distinct buckets → highlight **earliest and latest** only
 *   (typical two-tide narrative without “fish everywhere”).
 */
function daypartsFromExchangeHours(hours: number[]): DaypartFlags {
  const buckets = new Set<number>();
  for (const h of hours) {
    buckets.add(daypartFromHourNearest(h));
  }
  if (buckets.size === 0) return [false, false, false, false];

  const sorted = [...buckets].sort((a, b) => a - b);
  const out: DaypartFlags = [false, false, false, false];

  if (sorted.length <= 2) {
    for (const i of sorted) out[i] = true;
    return out;
  }

  out[sorted[0]!] = true;
  out[sorted[sorted.length - 1]!] = true;
  return out;
}

// ── Main evaluator ───────────────────────────────────────────────────────────

export function evaluateTideWindow(
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): TimingSignal | null {
  const tideState = norm.normalized.tide_current_movement;
  const events = opts.tide_high_low;
  const localDate = opts.local_date;

  // ── Try to parse specific exchange times from NOAA data ────────────────
  if (events && events.length >= 2 && localDate) {
    const dayEvents = events.filter(
      (e) => typeof e.time === "string" && e.time.startsWith(localDate),
    );

    if (dayEvents.length >= 2) {
      const parsed: { h: number; m: number }[] = [];
      for (const e of dayEvents) {
        const hm = parseHourMinuteFromTideTime(e.time);
        if (hm) parsed.push(hm);
      }

      if (parsed.length > 0) {
        const periods = daypartsFromExchangeHours(parsed.map((p) => p.h));

        const timeStrs = parsed.map((p) => `around ${fmtTideTime(p.h, p.m)}`);
        const strength: TimingStrength = parsed.length >= 2 ? "very_strong" : "strong";

        return {
          driver_id: "tide_exchange_window",
          role: "anchor",
          strength,
          periods,
          note_pool_key: "tide_exchange_specific",
          exchange_times: timeStrs,
          debug_reason:
            `Parsed ${parsed.length} tide exchange(s) for ${localDate}; ` +
            `highlighted dayparts: ` +
            periods.map((v, i) => v ? ["dawn", "morning", "afternoon", "evening"][i] : null)
              .filter(Boolean)
              .join(", "),
        };
      }
    }
  }

  // ── Positive tide score but no parseable exchange times ─────────────────
  if (tideState && tideState.score >= 1) {
    return {
      driver_id: "tide_exchange_window",
      role: "anchor",
      strength: "good",
      periods: [false, false, false, false],
      note_pool_key: "tide_uncertain_no_clock",
      debug_reason:
        `Tide score ${tideState.score} ≥ 1 but no parseable same-day exchange times — ` +
        "no false daypart highlights; narration stays tide-anchored.",
    };
  }

  // ── No usable tide signal ──────────────────────────────────────────────
  return null;
}
