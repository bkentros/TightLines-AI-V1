/**
 * Continuous calendar position for timing — smooth handoff between adjacent
 * monthly family rows (day-to-day within the month + month boundaries).
 */

import type { DaypartFlags } from "./timingTypes.ts";

export function parseLocalDateParts(iso: string): { y: number; m: number; d: number } | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const y = parseInt(m[1]!, 10);
  const mo = parseInt(m[2]!, 10);
  const d = parseInt(m[3]!, 10);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

export function daysInMonth(year: number, month1to12: number): number {
  return new Date(year, month1to12, 0).getDate();
}

/** Hermite smoothstep on [0,1] — eases in/out at month edges */
export function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/**
 * Maps local_date to adjacent calendar months and blend weight toward the *next* month.
 * Continuous index c = (month-1) + (day-1)/daysInMonth ∈ [0,12).
 */
export function adjacentMonthsBlend(iso: string): {
  loMonth: number;
  hiMonth: number;
  /** Smoothstepped weight toward hiMonth (0 = lo only, 1 = hi only) */
  t: number;
} | null {
  const p = parseLocalDateParts(iso);
  if (!p) return null;
  const dim = daysInMonth(p.y, p.m);
  const d = Math.min(p.d, dim);
  const c = (p.m - 1) + (d - 1) / dim;
  const cSafe = Math.min(Math.max(c, 0), 11.999999);
  const loIdx = Math.floor(cSafe);
  const hiIdx = (loIdx + 1) % 12;
  const tRaw = cSafe - loIdx;
  return {
    loMonth: loIdx + 1,
    hiMonth: hiIdx + 1,
    t: smoothstep01(tRaw),
  };
}

/** Merge dayparts (OR) then keep at most two buckets (earliest + latest lit). */
export function collapsePeriodsToMaxTwo(p: DaypartFlags): DaypartFlags {
  const idxs = [0, 1, 2, 3].filter((i) => p[i]);
  if (idxs.length <= 2) return p;
  const lo = idxs[0]!;
  const hi = idxs[idxs.length - 1]!;
  const out: DaypartFlags = [false, false, false, false];
  out[lo] = true;
  out[hi] = true;
  return out;
}
