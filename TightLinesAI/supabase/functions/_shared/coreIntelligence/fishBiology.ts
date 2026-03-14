// =============================================================================
// FISH BIOLOGY — Biological Feeding Preference Tables
//
// Soft multipliers (0.50–1.20) applied to block scores based on:
//   month × region × time-of-day × water type
//
// These represent real fish biology:
//   - Circadian feeding rhythms (crepuscular peaks, midday lulls)
//   - Metabolic response to seasonal temperature (cold = slow, warm = active)
//   - Photoperiod effects (short winter days compress feeding windows)
//   - Dissolved oxygen patterns (pre-dawn lows, wind mixing)
//   - Prey availability cycles (insect hatches, baitfish movement)
//
// The multiplier is applied AFTER the base block score is computed, so it acts
// as a biological "likelihood of feeding" overlay on top of environmental conditions.
// =============================================================================

import type { LatitudeBand, WaterType } from "./types.ts";
import type { CoastalBand } from "./seasonalProfiles.ts";

// ---------------------------------------------------------------------------
// Time-of-day categories (8 bins covering 24 hours)
// ---------------------------------------------------------------------------

export type TimeBin =
  | "pre_dawn"      // 04:00–06:00  — DO low point, some species active
  | "dawn"          // 06:00–08:00  — peak crepuscular feeding
  | "early_morning" // 08:00–10:00  — continued morning bite
  | "midday"        // 10:00–14:00  — typically slowest period
  | "afternoon"     // 14:00–16:00  — warming period, variable
  | "late_afternoon" // 16:00–18:00 — pre-sunset ramp up
  | "dusk"          // 18:00–20:00  — peak crepuscular feeding
  | "night";        // 20:00–04:00  — catfish/walleye/snook specialists

const TIME_BIN_ORDER: TimeBin[] = [
  "pre_dawn", "dawn", "early_morning", "midday",
  "afternoon", "late_afternoon", "dusk", "night",
];

/**
 * Given local minutes since midnight, return the time bin.
 * Adjusts for sunrise/sunset if provided (shifts dawn/dusk bins).
 */
export function getTimeBin(
  localMinutes: number,
  sunriseMin?: number | null,
  sunsetMin?: number | null,
): TimeBin {
  // If we have actual sunrise/sunset, use them to anchor dawn/dusk
  if (sunriseMin != null && sunsetMin != null) {
    // Pre-dawn: sunrise - 120 to sunrise - 30
    if (localMinutes >= sunriseMin - 120 && localMinutes < sunriseMin - 30) return "pre_dawn";
    // Dawn: sunrise - 30 to sunrise + 90
    if (localMinutes >= sunriseMin - 30 && localMinutes < sunriseMin + 90) return "dawn";
    // Early morning: sunrise + 90 to sunrise + 210 (3.5h after sunrise)
    if (localMinutes >= sunriseMin + 90 && localMinutes < sunriseMin + 210) return "early_morning";
    // Dusk: sunset - 60 to sunset + 60
    if (localMinutes >= sunsetMin - 60 && localMinutes < sunsetMin + 60) return "dusk";
    // Late afternoon: sunset - 180 to sunset - 60
    if (localMinutes >= sunsetMin - 180 && localMinutes < sunsetMin - 60) return "late_afternoon";
    // Afternoon: midpoint to late_afternoon start
    const middayEnd = sunriseMin + 210;
    const lateAftStart = sunsetMin - 180;
    if (middayEnd < lateAftStart) {
      const afternoonMid = (middayEnd + lateAftStart) / 2;
      if (localMinutes >= middayEnd && localMinutes < afternoonMid) return "midday";
      if (localMinutes >= afternoonMid && localMinutes < lateAftStart) return "afternoon";
    } else {
      // Short day — collapse midday/afternoon
      if (localMinutes >= middayEnd && localMinutes < lateAftStart) return "midday";
    }
    // Night: after dusk end or before pre-dawn
    if (localMinutes >= sunsetMin + 60 || localMinutes < sunriseMin - 120) return "night";
    // Fallback for gaps
    return "midday";
  }

  // Static fallback (no sun data)
  if (localMinutes < 240) return "night";
  if (localMinutes < 360) return "pre_dawn";
  if (localMinutes < 480) return "dawn";
  if (localMinutes < 600) return "early_morning";
  if (localMinutes < 840) return "midday";
  if (localMinutes < 960) return "afternoon";
  if (localMinutes < 1080) return "late_afternoon";
  if (localMinutes < 1200) return "dusk";
  return "night";
}

// ---------------------------------------------------------------------------
// Feeding preference tables
// ---------------------------------------------------------------------------
// Each table is: month (1-12) → array of 8 multipliers in TIME_BIN_ORDER
// Multiplier range: 0.50 (very unlikely to feed) to 1.20 (peak feeding)
// 1.00 = neutral (no biological bias)
//
// Biology basis:
// - Most freshwater species are crepuscular feeders (dawn/dusk peaks)
// - Cold months compress feeding into warmest hours (midday shift)
// - Hot months shift feeding to cooler periods (dawn/dusk/night)
// - Saltwater species have tidal feeding overlays (handled by tide component)
// - Winter: short photoperiod = compressed but intense feeding windows
// - Summer: extended photoperiod = more gradual, spread-out feeding
// ---------------------------------------------------------------------------

type MonthlyProfile = Record<number, number[]>; // month → [8 multipliers]

// ─── FRESHWATER ─────────────────────────────────────────────────────────────

const FW_FAR_NORTH: MonthlyProfile = {
  //          pre_dawn  dawn  early_morn  midday  afternoon  late_aft  dusk   night
  1:  [0.50, 0.55, 0.65, 1.10, 1.05, 0.75, 0.60, 0.50], // Jan — ice fishing, midday only
  2:  [0.50, 0.55, 0.70, 1.10, 1.05, 0.75, 0.60, 0.50], // Feb — same pattern, slightly better
  3:  [0.55, 0.65, 0.80, 1.05, 1.00, 0.80, 0.70, 0.50], // Mar — ice-out begins, warming midday
  4:  [0.65, 0.85, 0.95, 0.95, 0.90, 0.90, 0.90, 0.55], // Apr — ice-out, aggressive feeding
  5:  [0.70, 1.05, 1.00, 0.85, 0.85, 0.95, 1.10, 0.60], // May — spawn transitions, crepuscular
  6:  [0.75, 1.15, 1.05, 0.80, 0.80, 0.95, 1.15, 0.65], // Jun — peak crepuscular
  7:  [0.80, 1.15, 1.00, 0.75, 0.80, 1.00, 1.20, 0.70], // Jul — hot, dawn/dusk dominant
  8:  [0.80, 1.15, 1.00, 0.75, 0.80, 1.00, 1.15, 0.70], // Aug — same as Jul, slightly less
  9:  [0.70, 1.10, 1.00, 0.85, 0.85, 0.95, 1.10, 0.60], // Sep — fall feed-up begins
  10: [0.60, 0.95, 0.95, 0.95, 0.90, 0.85, 0.90, 0.55], // Oct — pre-winter gorge, all day
  11: [0.55, 0.70, 0.80, 1.05, 1.00, 0.75, 0.65, 0.50], // Nov — cooling, midday focus
  12: [0.50, 0.55, 0.65, 1.10, 1.05, 0.70, 0.60, 0.50], // Dec — deep winter, midday only
};

const FW_NORTH: MonthlyProfile = {
  1:  [0.50, 0.60, 0.70, 1.05, 1.00, 0.75, 0.65, 0.50],
  2:  [0.50, 0.65, 0.75, 1.05, 1.00, 0.80, 0.65, 0.50],
  3:  [0.55, 0.75, 0.85, 1.00, 0.95, 0.85, 0.75, 0.55],
  4:  [0.65, 0.95, 1.00, 0.90, 0.85, 0.90, 0.95, 0.55],
  5:  [0.75, 1.10, 1.00, 0.85, 0.85, 0.95, 1.10, 0.65],
  6:  [0.80, 1.15, 1.00, 0.80, 0.80, 1.00, 1.15, 0.70],
  7:  [0.80, 1.15, 1.00, 0.75, 0.80, 1.00, 1.20, 0.75],
  8:  [0.80, 1.15, 1.00, 0.75, 0.80, 1.00, 1.15, 0.70],
  9:  [0.75, 1.10, 1.00, 0.85, 0.85, 0.95, 1.10, 0.65],
  10: [0.60, 0.95, 0.95, 0.95, 0.90, 0.90, 0.90, 0.55],
  11: [0.55, 0.75, 0.85, 1.00, 0.95, 0.80, 0.70, 0.50],
  12: [0.50, 0.60, 0.70, 1.05, 1.00, 0.75, 0.65, 0.50],
};

const FW_MID: MonthlyProfile = {
  1:  [0.55, 0.70, 0.80, 1.00, 0.95, 0.80, 0.70, 0.55],
  2:  [0.55, 0.75, 0.85, 1.00, 0.95, 0.85, 0.75, 0.55],
  3:  [0.60, 0.85, 0.95, 0.95, 0.90, 0.90, 0.85, 0.55],
  4:  [0.70, 1.00, 1.00, 0.90, 0.85, 0.95, 1.00, 0.60],
  5:  [0.75, 1.10, 1.00, 0.85, 0.85, 0.95, 1.10, 0.65],
  6:  [0.80, 1.15, 1.00, 0.75, 0.80, 1.00, 1.15, 0.70],
  7:  [0.80, 1.10, 0.95, 0.70, 0.75, 1.00, 1.20, 0.75],
  8:  [0.80, 1.10, 0.95, 0.70, 0.75, 1.00, 1.15, 0.75],
  9:  [0.75, 1.10, 1.00, 0.80, 0.80, 0.95, 1.10, 0.65],
  10: [0.65, 1.00, 1.00, 0.90, 0.90, 0.95, 1.00, 0.60],
  11: [0.60, 0.80, 0.90, 0.95, 0.90, 0.85, 0.80, 0.55],
  12: [0.55, 0.70, 0.80, 1.00, 0.95, 0.80, 0.70, 0.55],
};

const FW_SOUTH: MonthlyProfile = {
  1:  [0.60, 0.80, 0.90, 0.95, 0.90, 0.85, 0.80, 0.55],
  2:  [0.65, 0.90, 0.95, 0.90, 0.85, 0.90, 0.90, 0.60],
  3:  [0.70, 1.00, 1.00, 0.85, 0.85, 0.95, 1.00, 0.65],
  4:  [0.75, 1.10, 1.00, 0.80, 0.80, 0.95, 1.10, 0.70],
  5:  [0.80, 1.10, 0.95, 0.75, 0.75, 1.00, 1.15, 0.75],
  6:  [0.85, 1.05, 0.90, 0.65, 0.70, 0.95, 1.15, 0.80],
  7:  [0.85, 1.05, 0.85, 0.60, 0.65, 0.95, 1.15, 0.85],
  8:  [0.85, 1.05, 0.85, 0.60, 0.65, 0.95, 1.15, 0.85],
  9:  [0.80, 1.10, 0.95, 0.70, 0.75, 1.00, 1.15, 0.75],
  10: [0.75, 1.05, 1.00, 0.80, 0.80, 0.95, 1.05, 0.65],
  11: [0.65, 0.90, 0.95, 0.90, 0.85, 0.90, 0.90, 0.60],
  12: [0.60, 0.80, 0.90, 0.95, 0.90, 0.85, 0.80, 0.55],
};

const FW_DEEP_SOUTH: MonthlyProfile = {
  1:  [0.65, 0.90, 0.95, 0.90, 0.85, 0.90, 0.90, 0.60],
  2:  [0.70, 0.95, 1.00, 0.85, 0.85, 0.95, 0.95, 0.65],
  3:  [0.75, 1.05, 1.00, 0.80, 0.80, 0.95, 1.05, 0.70],
  4:  [0.80, 1.10, 0.95, 0.75, 0.75, 1.00, 1.10, 0.75],
  5:  [0.85, 1.05, 0.90, 0.65, 0.70, 0.95, 1.15, 0.80],
  6:  [0.90, 1.00, 0.85, 0.55, 0.60, 0.90, 1.10, 0.90],
  7:  [0.90, 1.00, 0.80, 0.50, 0.55, 0.90, 1.10, 0.90],
  8:  [0.90, 1.00, 0.80, 0.50, 0.55, 0.90, 1.10, 0.90],
  9:  [0.85, 1.05, 0.90, 0.65, 0.65, 0.95, 1.10, 0.80],
  10: [0.80, 1.05, 0.95, 0.75, 0.75, 0.95, 1.05, 0.70],
  11: [0.70, 0.95, 1.00, 0.85, 0.85, 0.90, 0.95, 0.65],
  12: [0.65, 0.90, 0.95, 0.90, 0.85, 0.90, 0.90, 0.60],
};

const FRESHWATER_TABLES: Record<LatitudeBand, MonthlyProfile> = {
  far_north: FW_FAR_NORTH,
  north: FW_NORTH,
  mid: FW_MID,
  south: FW_SOUTH,
  deep_south: FW_DEEP_SOUTH,
};

// ─── SALTWATER ──────────────────────────────────────────────────────────────
// Saltwater species are heavily tide-driven (handled by tide component),
// but still have biological feeding preferences by season/time.
// Key differences from freshwater:
// - Night fishing is much more productive (snook, tarpon, snapper)
// - Tidal feeding overlaps make midday viable in moving water
// - Cold water species (stripers, bluefish) have winter midday peak

const SW_NORTH_COAST: MonthlyProfile = {
  // Cold saltwater: striped bass, bluefish, cod, tautog
  1:  [0.50, 0.60, 0.75, 1.05, 1.00, 0.80, 0.65, 0.55],
  2:  [0.50, 0.65, 0.80, 1.05, 1.00, 0.80, 0.70, 0.55],
  3:  [0.55, 0.75, 0.85, 1.00, 0.95, 0.85, 0.80, 0.55],
  4:  [0.60, 0.90, 0.95, 0.90, 0.90, 0.90, 0.95, 0.60],
  5:  [0.70, 1.05, 1.00, 0.85, 0.85, 0.95, 1.10, 0.70],
  6:  [0.75, 1.10, 1.00, 0.80, 0.85, 1.00, 1.15, 0.75],
  7:  [0.80, 1.10, 0.95, 0.80, 0.85, 1.00, 1.15, 0.80],
  8:  [0.80, 1.10, 0.95, 0.80, 0.85, 1.00, 1.15, 0.80],
  9:  [0.75, 1.10, 1.00, 0.85, 0.85, 0.95, 1.10, 0.70],
  10: [0.65, 0.95, 1.00, 0.90, 0.90, 0.90, 0.95, 0.60],
  11: [0.55, 0.75, 0.85, 1.00, 0.95, 0.85, 0.75, 0.55],
  12: [0.50, 0.60, 0.75, 1.05, 1.00, 0.80, 0.65, 0.55],
};

const SW_MID_COAST: MonthlyProfile = {
  // Transitional saltwater: redfish, flounder, sea trout, drum
  1:  [0.55, 0.75, 0.85, 1.00, 0.95, 0.85, 0.80, 0.55],
  2:  [0.55, 0.80, 0.90, 0.95, 0.90, 0.85, 0.85, 0.60],
  3:  [0.65, 0.90, 0.95, 0.90, 0.85, 0.90, 0.95, 0.65],
  4:  [0.70, 1.00, 1.00, 0.85, 0.85, 0.95, 1.05, 0.70],
  5:  [0.75, 1.10, 0.95, 0.80, 0.80, 0.95, 1.10, 0.75],
  6:  [0.80, 1.10, 0.90, 0.75, 0.80, 1.00, 1.15, 0.80],
  7:  [0.85, 1.05, 0.90, 0.70, 0.75, 0.95, 1.15, 0.85],
  8:  [0.85, 1.05, 0.90, 0.70, 0.75, 0.95, 1.15, 0.85],
  9:  [0.80, 1.10, 0.95, 0.75, 0.80, 0.95, 1.10, 0.75],
  10: [0.70, 1.00, 1.00, 0.85, 0.85, 0.95, 1.00, 0.65],
  11: [0.60, 0.85, 0.90, 0.95, 0.90, 0.85, 0.85, 0.60],
  12: [0.55, 0.75, 0.85, 1.00, 0.95, 0.85, 0.80, 0.55],
};

const SW_SOUTH_COAST: MonthlyProfile = {
  // Warm saltwater: snook, tarpon, permit, bonefish, snapper, grouper
  // Strong night feeding, dawn key, midday brutal in summer
  1:  [0.65, 0.90, 0.95, 0.90, 0.85, 0.90, 0.95, 0.65],
  2:  [0.70, 0.95, 0.95, 0.85, 0.85, 0.90, 1.00, 0.70],
  3:  [0.75, 1.00, 1.00, 0.80, 0.80, 0.95, 1.05, 0.75],
  4:  [0.80, 1.05, 0.95, 0.75, 0.80, 0.95, 1.10, 0.80],
  5:  [0.85, 1.10, 0.90, 0.70, 0.75, 0.95, 1.15, 0.85],
  6:  [0.90, 1.05, 0.85, 0.60, 0.65, 0.90, 1.10, 0.90],
  7:  [0.90, 1.05, 0.80, 0.55, 0.60, 0.90, 1.10, 0.95],
  8:  [0.90, 1.05, 0.80, 0.55, 0.60, 0.90, 1.10, 0.95],
  9:  [0.85, 1.10, 0.90, 0.65, 0.70, 0.95, 1.10, 0.85],
  10: [0.80, 1.05, 0.95, 0.75, 0.80, 0.95, 1.05, 0.75],
  11: [0.70, 0.95, 0.95, 0.85, 0.85, 0.90, 1.00, 0.70],
  12: [0.65, 0.90, 0.95, 0.90, 0.85, 0.90, 0.95, 0.65],
};

const SALTWATER_TABLES: Record<CoastalBand, MonthlyProfile> = {
  north_coast: SW_NORTH_COAST,
  mid_coast: SW_MID_COAST,
  south_coast: SW_SOUTH_COAST,
};

// ─── BRACKISH ───────────────────────────────────────────────────────────────
// Brackish blends freshwater and saltwater patterns.
// Estuarine species: redfish, flounder, mullet, tarpon (in warmer months).
// More tide-influenced than freshwater, less than open saltwater.

const BK_NORTH_COAST: MonthlyProfile = {
  1:  [0.50, 0.65, 0.80, 1.05, 1.00, 0.80, 0.70, 0.55],
  2:  [0.55, 0.70, 0.85, 1.00, 0.95, 0.85, 0.70, 0.55],
  3:  [0.60, 0.80, 0.90, 0.95, 0.90, 0.85, 0.80, 0.60],
  4:  [0.65, 0.95, 1.00, 0.90, 0.85, 0.90, 0.95, 0.65],
  5:  [0.75, 1.10, 1.00, 0.85, 0.85, 0.95, 1.10, 0.70],
  6:  [0.80, 1.10, 0.95, 0.80, 0.80, 1.00, 1.15, 0.75],
  7:  [0.80, 1.10, 0.95, 0.75, 0.80, 1.00, 1.15, 0.80],
  8:  [0.80, 1.10, 0.95, 0.75, 0.80, 1.00, 1.15, 0.80],
  9:  [0.75, 1.10, 1.00, 0.85, 0.85, 0.95, 1.10, 0.70],
  10: [0.65, 0.95, 1.00, 0.90, 0.90, 0.90, 0.95, 0.60],
  11: [0.55, 0.75, 0.85, 1.00, 0.95, 0.85, 0.75, 0.55],
  12: [0.50, 0.65, 0.80, 1.05, 1.00, 0.80, 0.70, 0.55],
};

const BK_MID_COAST: MonthlyProfile = {
  1:  [0.55, 0.75, 0.85, 1.00, 0.95, 0.85, 0.80, 0.60],
  2:  [0.60, 0.80, 0.90, 0.95, 0.90, 0.85, 0.85, 0.60],
  3:  [0.65, 0.90, 0.95, 0.90, 0.85, 0.90, 0.90, 0.65],
  4:  [0.70, 1.00, 1.00, 0.85, 0.85, 0.95, 1.00, 0.70],
  5:  [0.80, 1.10, 0.95, 0.80, 0.80, 0.95, 1.10, 0.75],
  6:  [0.85, 1.05, 0.90, 0.75, 0.80, 1.00, 1.15, 0.80],
  7:  [0.85, 1.05, 0.90, 0.70, 0.75, 0.95, 1.15, 0.85],
  8:  [0.85, 1.05, 0.90, 0.70, 0.75, 0.95, 1.15, 0.85],
  9:  [0.80, 1.10, 0.95, 0.80, 0.80, 0.95, 1.10, 0.75],
  10: [0.70, 1.00, 1.00, 0.85, 0.85, 0.95, 1.00, 0.65],
  11: [0.60, 0.85, 0.90, 0.95, 0.90, 0.85, 0.85, 0.60],
  12: [0.55, 0.75, 0.85, 1.00, 0.95, 0.85, 0.80, 0.60],
};

const BK_SOUTH_COAST: MonthlyProfile = {
  1:  [0.65, 0.90, 0.95, 0.90, 0.85, 0.90, 0.90, 0.65],
  2:  [0.70, 0.95, 0.95, 0.85, 0.85, 0.90, 0.95, 0.70],
  3:  [0.75, 1.00, 1.00, 0.80, 0.80, 0.95, 1.05, 0.75],
  4:  [0.80, 1.05, 0.95, 0.75, 0.80, 0.95, 1.10, 0.80],
  5:  [0.85, 1.10, 0.90, 0.70, 0.75, 0.95, 1.10, 0.85],
  6:  [0.90, 1.05, 0.85, 0.60, 0.65, 0.90, 1.10, 0.90],
  7:  [0.90, 1.00, 0.80, 0.55, 0.60, 0.90, 1.10, 0.90],
  8:  [0.90, 1.00, 0.80, 0.55, 0.60, 0.90, 1.10, 0.90],
  9:  [0.85, 1.05, 0.90, 0.65, 0.70, 0.95, 1.10, 0.85],
  10: [0.80, 1.05, 0.95, 0.80, 0.80, 0.95, 1.05, 0.75],
  11: [0.70, 0.95, 0.95, 0.85, 0.85, 0.90, 0.95, 0.70],
  12: [0.65, 0.90, 0.95, 0.90, 0.85, 0.90, 0.90, 0.65],
};

const BRACKISH_TABLES: Record<CoastalBand, MonthlyProfile> = {
  north_coast: BK_NORTH_COAST,
  mid_coast: BK_MID_COAST,
  south_coast: BK_SOUTH_COAST,
};

// ---------------------------------------------------------------------------
// Main lookup function
// ---------------------------------------------------------------------------

/**
 * Returns the biological feeding preference multiplier for a given block.
 *
 * @param waterType - freshwater, saltwater, or brackish
 * @param band - latitude band (freshwater) or coastal band (salt/brackish)
 * @param month - 1-12
 * @param timeBin - time-of-day category
 * @returns multiplier 0.50–1.20
 */
export function getFeedingPreference(
  waterType: WaterType,
  band: LatitudeBand | CoastalBand,
  month: number,
  timeBin: TimeBin,
): number {
  const idx = TIME_BIN_ORDER.indexOf(timeBin);
  if (idx < 0) return 1.0;

  const m = Math.max(1, Math.min(12, month));

  let table: MonthlyProfile | undefined;

  if (waterType === "freshwater") {
    table = FRESHWATER_TABLES[band as LatitudeBand];
  } else if (waterType === "saltwater") {
    table = SALTWATER_TABLES[band as CoastalBand];
  } else {
    table = BRACKISH_TABLES[band as CoastalBand];
  }

  if (!table) return 1.0;

  const row = table[m];
  if (!row || row.length <= idx) return 1.0;

  return row[idx];
}

/**
 * Convenience: get feeding preference from local minutes and sun times.
 */
export function getFeedingPreferenceForBlock(
  waterType: WaterType,
  band: LatitudeBand | CoastalBand,
  month: number,
  localMinutes: number,
  sunriseMin?: number | null,
  sunsetMin?: number | null,
): number {
  const timeBin = getTimeBin(localMinutes, sunriseMin, sunsetMin);
  return getFeedingPreference(waterType, band, month, timeBin);
}
