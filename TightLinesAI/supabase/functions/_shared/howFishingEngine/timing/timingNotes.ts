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
    "Time your trip around moving water. That is the strongest window today.",
    "Work around the tide exchanges. Moving water is the key timing signal today.",
    "Save your best focus for moving water instead of slack periods.",
    "The bite is more likely to follow the tide today. Prioritize the moving-water windows.",
    "Plan around the tide exchanges. That is where the stronger window sits today.",
  ],

  /** Coastal: tide is a real driver but we don't have same-day exchange times to place on the clock */
  tide_uncertain_no_clock: [
    "Tide movement is favorable today, but exact turn times are not available here. Check a local tide chart and fish the moving water around those turns.",
    "Current and tide stage look supportive, but the exact exchange times are not available here. Use a local tide table and plan around high or low turns.",
    "Tides matter today, but exact turn times are missing here. Pull local tide times and focus on the moving-water periods around those turns.",
  ],

  tide_general_coastal: [
    "Work around today's tide exchanges. Moving water is when inshore fish are most likely to feed.",
    "Tidal movement appears to be a main coastal timing signal today. Fish the transitions and ease off during slack water.",
    "Position for the tide changes today. Moving water is your window — slack tide is the slow stretch between them.",
    "Inshore fish key on tide exchanges. Work the moving-water windows and ease off during slack periods.",
    "The bite is more likely to follow the tide. Get positioned for the exchanges and prioritize the moving-water windows.",
  ],

  // ── Temperature-driven ─────────────────────────────────────────────────
  warmth_intraday_peak: [
    "The temperature timing signal points to this window. Give it the first look.",
    "This is the clearest temperature-aligned window on the clock.",
    "Temperature is giving this part of the day the best timing support.",
  ],

  warmth_plateau_window: [
    "The temperature timing signal holds across these highlighted windows. Treat the whole stretch as useful.",
    "Temperature support spans more than one part of the day, so the window is broader than one brief peak.",
    "The temperature signal lasts across these periods instead of spiking and fading. Use the full highlighted stretch.",
  ],

  warmth_spike_aggregate: [
    "The day-over-day temperature change favors the later windows.",
    "A stronger temperature shift versus yesterday makes the latter half of the day more attractive.",
    "Today has a sharper temperature rebound, so afternoon into evening is the better stretch to lean on.",
  ],

  warmest_window: [
    "The temperature signal favors this stretch of the day.",
    "Afternoon has the better temperature timing signal today.",
    "Plan your main effort around the strongest temperature window.",
    "This part of the day has the best temperature support.",
    "The day builds as it goes. Focus on the stronger afternoon window.",
    "Afternoon is the key temperature window today.",
    "Lean on the part of the day with the best temperature support.",
    "The morning starts slower, and the better temperature window comes later.",
    "The day builds as it goes. Your best window is in the afternoon.",
    "Hold something back for the afternoon window. That is when the setup lines up best.",
  ],

  cooler_low_light: [
    "Temperature timing favors early and late today.",
    "Low-light periods are the better temperature windows. Dawn and dusk are the first windows to consider.",
    "The middle of the day is less supported. Focus on the early and late windows.",
    "Early and late look like the better windows. The middle of the day has less support.",
    "Low-light periods are the better play today. Focus on morning and evening.",
  ],

  coolest_window: [
    "Temperature timing favors these highlighted windows. Give them the first look.",
    "These parts of the day have the better temperature support.",
    "If temperature is shaping the clock, these are the windows to lean on.",
  ],

  // ── Light-driven ───────────────────────────────────────────────────────
  low_light_geometry_shaped: [
    "Hourly cloud cover makes one low-light transition better than the other. Give that side of the clock the first look.",
    "One end of the day has better low light. Focus on that side of the clock.",
    "Cloud cover is not even today. One dawn or dusk window has the real light advantage.",
  ],

  cloud_window_midday: [
    "A cloud window softens the sun for a stretch today. That is the better window to consider.",
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
    "Overcast all day means low light all day. You do not need to depend on one narrow window.",
    "Cloud cover is helping all day today, so longer active stretches are more realistic.",
    "With this cloud cover, light is not the main limiter. Fish whenever you can get out.",
  ],

  // ── Solunar ────────────────────────────────────────────────────────────
  solunar_minor: [
    "Early feeding windows look strongest, with first light getting the first look.",
    "First light is the move today. Plan around the hours before the sun gets high.",
    "Early is the word today. Dawn is when conditions line up best, so prioritize those first hours.",
    "First light has the best support today, so an early start is worth considering.",
    "The morning bite gets the best support. Plan ahead if you want to use the first-light window.",
  ],

  // ── Fallback pools (combo-specific defaults) ───────────────────────────
  fallback_afternoon: [
    "Afternoon looks like the best bet today. That is when conditions are most supportive.",
    "The afternoon stretch looks like the best window. Lean into the part of the day with the most support.",
    "Plan around the afternoon. That is where the day has the most support.",
  ],

  fallback_dawn_evening: [
    "Early and late are your windows today. Dawn and evening offer the best conditions.",
    "Fish early and late — dawn and evening are the better bets when other signals are flat.",
    "Dawn and dusk are the safest play today.",
  ],

  fallback_morning_evening: [
    "Shoulder hours are the play today — morning and evening look strongest.",
    "Morning and evening look like the better windows. Focus on those transitions.",
    "The productive windows are morning and evening today.",
  ],

  fallback_dawn_morning: [
    "Front-load your effort — dawn and morning have the best setup today.",
    "Get out early. Dawn through mid-morning looks like the more productive stretch.",
    "Morning hours are the call. Get on the water early and give that stretch a careful look.",
  ],

  fallback_morning_afternoon: [
    "The midday stretch looks like the more productive window today.",
    "Morning through afternoon looks strongest, so put more of your time there.",
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
    "It is difficult to pin down a best window. Fish when you have the chance.",
  ],

  // ── Cold all day (seek_warmth failed because flat cold) ────────────────
  cold_all_day: [
    "Temperature is steady all day, so no single window stands out. Fish when you can.",
    "Temperature does not create a clear timing advantage today.",
    "No clear temperature trend stands out. Fish your best spots and stay with it all day.",
    "Temperature is steady. No clear best window stands out, so fish with patience.",
  ],

  /** Dawn + afternoon + evening (no morning bucket) — widener / rare OR shapes */
  timing_dawn_afternoon_evening: [
    "Dawn, the middle of the day, and evening all rate today — put real time in those highlighted bands instead of the gaps between them.",
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
