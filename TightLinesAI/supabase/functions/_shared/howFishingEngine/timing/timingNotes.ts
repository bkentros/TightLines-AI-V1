/**
 * Daypart note text pools — timing language lives here exclusively.
 * Tactical tip language lives in buildTips.ts — never timing language there.
 *
 * Each pool is keyed by a note_pool_key string that evaluators reference.
 * Selection is seeded so the same timing scenario always returns the same note.
 */

import type { DaypartFlags } from "./timingTypes.ts";
import { pickDeterministic } from "../copy/deterministicPick.ts";

// ── Note pools ───────────────────────────────────────────────────────────────

const POOLS: Record<string, string[]> = {
  // ── Tide-driven (coastal) ──────────────────────────────────────────────
  // tide_exchange_specific is handled dynamically in the tide evaluator
  // (it formats actual exchange times), so there's no static pool here.

  tide_moving_water: [
    "Time your trip around the moving water. That is the best window today.",
    "Work the tide exchanges. Moving water is the key trigger today.",
    "Do not spend your best effort on slack water. Fish when the tide is moving.",
    "The bite follows the tide today. Put your best effort into the moving-water windows.",
    "Plan around the tide exchanges. That is where the best window sits today.",
  ],

  /** Coastal: tide is a real driver but we don't have same-day exchange times to place on the clock */
  tide_uncertain_no_clock: [
    "Tide movement is favorable today, but exact turn times are not available here. Check a local tide chart and fish the moving water around those turns.",
    "Current and tide stage look supportive, but the exact exchange times are not available here. Use a local tide table and plan around high or low turns.",
    "Tides matter today, but exact turn times are missing here. Pull local tide times and focus on the moving-water periods around those turns.",
  ],

  tide_general_coastal: [
    "Work around today's tide exchanges. Moving water is when inshore fish are most likely to feed.",
    "Tidal movement drives the coastal bite today. Fish the transitions and ease off during slack water.",
    "Position for the tide changes today. Moving water is your window — slack tide is the slow stretch between them.",
    "Inshore fish key on tide exchanges. Work the moving-water windows and ease off during slack periods.",
    "The bite follows the tide. Get positioned for the exchanges and fish the moving-water windows hard.",
  ],

  // ── Temperature-driven ─────────────────────────────────────────────────
  warmth_intraday_peak: [
    "This is the warmest fishable part of the day. Put your best effort into this window.",
    "Temperatures peak here, and that is the clearest warmth signal on the clock.",
    "This part of the day has the best warmth. Lean into it.",
  ],

  warmth_plateau_window: [
    "Temperatures stay elevated across these highlighted windows, not just one brief peak. Treat the whole stretch as your best window.",
    "Warmth holds across more than one part of the day, so you have a broader temperature-driven window than one peak hour.",
    "The warming signal lasts across these periods instead of spiking and fading. Fish the full warm stretch.",
  ],

  warmth_spike_aggregate: [
    "Air temperatures are running much warmer than yesterday. Focus on the warmer second half of the day.",
    "A strong warmup versus yesterday makes the latter half of the day more attractive.",
    "Today has a sharp warm rebound, so afternoon into evening is the better stretch to lean on.",
  ],

  warmest_window: [
    "The warmest stretch of the day is your best window.",
    "Afternoon warmth is the trigger today. Be on the water when temperatures peak.",
    "Time your best effort around peak warmth.",
    "The warmest part of the day is your best stretch.",
    "Warmth builds as the day goes. Focus on the highest temperatures of the day.",
    "Afternoon warmth is the key trigger today.",
    "Lean on the warmest part of the day. That is when cold-water fish are most likely to move.",
    "A cold morning gives way to better warmth later. Save your best water for the afternoon.",
    "The day builds as it goes. Your best window is the warmest part of the afternoon.",
    "Hold something back for the afternoon warmth. That's when this water comes alive.",
  ],

  cooler_low_light: [
    "Beat the heat. Early morning and evening are the best windows today.",
    "Warm temps push fish to cooler, low-light periods. Dawn and dusk are your best shots.",
    "Fish are less likely to feed in the heat. Focus on the early and late windows.",
    "Early and late are your best windows. The middle of the day is the toughest stretch.",
    "Low-light periods are the better play today. Focus on morning and evening.",
  ],

  coolest_window: [
    "This cooler stretch is where the heat backs off the most. Put your best effort into these windows.",
    "Heat is less intense during these parts of the day, so they are the better windows.",
    "If you are fishing around the heat, these are the cooler windows to lean on.",
  ],

  // ── Light-driven ───────────────────────────────────────────────────────
  low_light_geometry_shaped: [
    "Hourly cloud cover makes one low-light transition better than the other. Put your best effort there.",
    "One end of the day has better low light. Focus on that side of the clock.",
    "Cloud cover is not even today. One dawn or dusk window has the real light advantage.",
  ],

  cloud_window_midday: [
    "A cloud window softens the sun for a stretch today. That is your better feeding window.",
    "A multi-hour cloud block breaks up the glare today. That window is worth leaning on.",
    "Cloud cover builds during this part of the day, giving you softer light and a better bite window.",
    "Low-light cover holds for a stretch today. Take advantage of that window while it lasts.",
  ],

  cloud_extended_shaped: [
    "Cloud cover is uneven through the day. The thickest low-light stretch sits in these windows, so lean on them more than the brighter gaps.",
    "Hourly cloud cover shows where low light lasts the longest. Fish those stretches instead of treating the whole day the same.",
    "Some parts of the day stay cloudier than others. Those are your better feeding windows.",
  ],

  low_light_geometry: [
    "Dawn and dusk have the best light today — plan around those transitions.",
    "Clear skies make dawn and evening your best windows.",
    "Low-light periods are the better play today. Be on the water for the transitions.",
    "The light change at dawn and dusk is your main advantage today.",
    "Sun angle works in your favor early and late. Dawn and evening are the call.",
  ],

  cloud_all_day: [
    "Heavy cloud cover is keeping light low all day. You can fish any window.",
    "Overcast all day means low light all day. There is no need to force one narrow window.",
    "Cloud cover is helping all day today, so fish can stay active for longer stretches.",
    "With this cloud cover, light is not the main limiter. Fish whenever you can get out.",
  ],

  // ── Solunar ────────────────────────────────────────────────────────────
  solunar_minor: [
    "Early feeding windows look strongest — get out there at first light.",
    "First light is the move today. Get on the water before the sun gets up.",
    "Early is the word today. Dawn is when conditions peak, so make those first hours count.",
    "Don't sleep in. First light has the best of it today — be there early.",
    "The morning bite gets the best support. Get your gear ready the night before and get out at first light.",
  ],

  // ── Fallback pools (combo-specific defaults) ───────────────────────────
  fallback_afternoon: [
    "Afternoon is your best bet today. That is when conditions are most supportive.",
    "The afternoon stretch is your best window. Lean into the warmest part of the day.",
    "Plan your push around the afternoon. That's where the day is most productive.",
  ],

  fallback_dawn_evening: [
    "Early and late are your windows today. Dawn and evening offer the best conditions.",
    "Fish early and late — dawn and evening are your best bets when other signals are flat.",
    "Dawn and dusk are the safest play today.",
  ],

  fallback_morning_evening: [
    "Shoulder hours are the play today — morning and evening look strongest.",
    "Morning and evening are your best windows. Focus on those transitions.",
    "The productive windows are morning and evening today.",
  ],

  fallback_dawn_morning: [
    "Front-load your effort — dawn and morning have the best setup today.",
    "Get out early. Dawn through mid-morning is your most productive stretch.",
    "Morning hours are the call. Get on the water early and fish it hard.",
  ],

  fallback_morning_afternoon: [
    "Midday stretch is your most productive window today.",
    "Morning through afternoon looks strongest — stack your effort there.",
    "The middle of the day is where conditions line up best today.",
  ],

  fallback_all_day: [
    "No single window stands out — the whole day is fair game.",
    "No major timing advantage today — fish it when you can get out.",
    "No clear timing advantage today. Get out when it works and fish your best water.",
    "The clock is not the main factor today. Go when it works for you.",
    "Timing is neutral today. Fish when you can get out there.",
  ],

  // ── Low-reliability / degraded ─────────────────────────────────────────
  no_timing_low_reliability: [
    "No clear timing advantage stands out — fish it as the day comes.",
    "The timing read is broad today. Fish when you can get out.",
    "No single window stands clearly above another right now.",
    "It is hard to pin down a best window. Fish when you have the chance.",
  ],

  // ── Cold all day (seek_warmth failed because flat cold) ────────────────
  cold_all_day: [
    "Cold temps all day — no single window stands out. Fish when you can.",
    "It is cold from start to finish today. No clear timing advantage stands out.",
    "No warming trend to exploit. Fish your best spots and stay with it all day.",
    "Cold and steady. No clear best window stands out, so fish slow all day.",
  ],

  /** Dawn + afternoon + evening (no morning bucket) — widener / rare OR shapes */
  timing_dawn_afternoon_evening: [
    "Dawn, the warmer middle of the day, and evening all rate today — put real time in those highlighted bands instead of the gaps between them.",
    "Early, mid-day, and late windows all show promise — work those highlighted stretches rather than splitting effort evenly across the clock.",
  ],
};

export function listTimingCopyForAudit(): string[] {
  return Object.values(POOLS).flat();
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Pick a deterministic note from the pool for the given key.
 * Returns a generic fallback if the key is unknown (defensive).
 */
export function pickTimingNote(poolKey: string, seed = poolKey): string {
  const pool = POOLS[poolKey];
  if (!pool || pool.length === 0) {
    return "No clear timing advantage today — fish when you can get out.";
  }
  return pickDeterministic(pool, seed, `timing:${poolKey}`);
}

/**
 * Maps final [dawn, morning, afternoon, evening] flags → a pool whose wording matches the tiles.
 * Used when periods were merged (month blend, widener) so narrative cannot drift from the winner’s note alone.
 */
export function notePoolKeyForDaypartFlags(periods: DaypartFlags): string {
  const key = periods.map((v) => (v ? "1" : "0")).join("");
  switch (key) {
    case "1001":
      return "fallback_dawn_evening";
    case "0010":
      return "warmest_window";
    case "1101":
      return "cooler_low_light";
    case "1111":
      return "fallback_all_day";
    case "0110":
      return "fallback_morning_afternoon";
    // morning + evening shoulders (no dawn bucket, no afternoon) — not a "midday" window
    case "0101":
      return "fallback_morning_evening";
    // dawn + afternoon without the morning bucket — true mid-clock block
    case "1010":
      return "fallback_morning_afternoon";
    case "1100":
      return "fallback_dawn_morning";
    case "0000":
      return "fallback_all_day";
    case "0011":
      return "warmest_window";
    case "0001":
      return "fallback_morning_evening";
    case "0100":
      return "fallback_dawn_morning";
    case "1000":
      return "fallback_dawn_morning";
    case "1011":
      return "timing_dawn_afternoon_evening";
    case "0111":
      return "warmest_window";
    default:
      return "fallback_all_day";
  }
}

export function synthesizeDaypartNoteForPeriods(
  periods: DaypartFlags,
  seed?: string,
): string {
  const poolKey = notePoolKeyForDaypartFlags(periods);
  return pickTimingNote(
    poolKey,
    seed ?? periods.map((v) => (v ? "1" : "0")).join(""),
  );
}
