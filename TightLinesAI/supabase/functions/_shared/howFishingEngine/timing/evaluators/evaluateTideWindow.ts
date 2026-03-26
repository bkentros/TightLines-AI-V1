/**
 * Tide exchange window evaluator — coastal timing driver #1.
 *
 * SALTWATER RULE: Tide/current should normally be the primary timing anchor
 * for all coastal contexts. This evaluator must degrade gracefully when
 * tide data is missing, weak, flat, or unusable.
 *
 * Qualification:
 * - Best case: parseable NOAA high/low events → map exchanges to dayparts.
 *   Highlight **every** bucket that contains at least one same-day exchange so
 *   tiles match the tide windows (e.g. dawn + afternoon, not dawn + evening when
 *   a key slack is ~2:40pm). One representative clock time per lit bucket feeds
 *   `exchange_times` so narration and highlights stay aligned.
 * - Mid case: tide_current_movement score ≥ 1 but no specific times → honest
 *   "tides matter but clock unknown" with **no** daypart highlights (not all four).
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

function minutesSinceMidnight(h: number, m: number): number {
  return h * 60 + m;
}

/**
 * Union of all daypart buckets that contain a tide event, plus one display string
 * per bucket (earliest event in that bucket, chronological order).
 */
function daypartsAndExchangeStringsFromParsed(
  parsed: { h: number; m: number }[],
): { periods: DaypartFlags; exchangeTimeStrs: string[] } {
  const bestInBucket = new Map<number, { h: number; m: number }>();

  for (const p of parsed) {
    const bucket = daypartFromHourNearest(p.h);
    const mins = minutesSinceMidnight(p.h, p.m);
    const prev = bestInBucket.get(bucket);
    if (!prev || mins < minutesSinceMidnight(prev.h, prev.m)) {
      bestInBucket.set(bucket, { h: p.h, m: p.m });
    }
  }

  const periods: DaypartFlags = [false, false, false, false];
  for (const b of bestInBucket.keys()) {
    periods[b] = true;
  }

  const sortedByClock = [...bestInBucket.values()].sort(
    (a, b) => minutesSinceMidnight(a.h, a.m) - minutesSinceMidnight(b.h, b.m),
  );
  const exchangeTimeStrs = sortedByClock.map(
    (hm) => `around ${fmtTideTime(hm.h, hm.m)}`,
  );

  return { periods, exchangeTimeStrs };
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
        const { periods, exchangeTimeStrs } = daypartsAndExchangeStringsFromParsed(parsed);

        const strength: TimingStrength = parsed.length >= 2 ? "very_strong" : "strong";

        return {
          driver_id: "tide_exchange_window",
          role: "anchor",
          strength,
          periods,
          note_pool_key: "tide_exchange_specific",
          exchange_times: exchangeTimeStrs,
          debug_reason:
            `Parsed ${parsed.length} tide event(s) for ${localDate}; ` +
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
