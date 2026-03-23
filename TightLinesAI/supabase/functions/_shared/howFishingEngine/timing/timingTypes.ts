/**
 * Timing engine types — deterministic timing-window subsystem.
 *
 * The timing engine runs as a parallel lane to scoring.
 * Score lane: "how good is today overall?"
 * Timing lane: "when today should you fish?"
 *
 * A variable can appear in both lanes but is evaluated separately in each.
 */

import type { DaypartNotePreset } from "../contracts/mod.ts";

// ── Driver identifiers ──────────────────────────────────────────────────────

/**
 * Each driver ID names a distinct intraday timing phenomenon.
 * The same raw variable (e.g. temperature) can back different drivers
 * depending on combo: `seek_warmth` in cold combos, `avoid_heat` in hot ones.
 */
export type TimingDriverId =
  | "tide_exchange_window"
  | "seek_warmth"
  | "avoid_heat"
  | "low_light_geometry"
  | "cloud_extended_low_light"
  | "solunar_minor"
  | "neutral_fallback";

// ── Timing strength (independent of daily score band) ────────────────────────

export type TimingStrength =
  | "very_strong"   // #1 qualifies AND #2 confirms/supports meaningfully
  | "strong"        // #1 qualifies clearly on its own
  | "good"          // #1 failed, #2 qualifies; or #1 qualifies weakly
  | "fair_default"; // neither qualifies, combo fallback used

// ── Daypart flags ────────────────────────────────────────────────────────────

/** [dawn 5-7am, morning 7-11am, afternoon 11-5pm, evening 5-9pm] */
export type DaypartFlags = [boolean, boolean, boolean, boolean];

// ── Fallback bias ────────────────────────────────────────────────────────────

/** Combo-specific default window when no driver qualifies */
export type DaypartBias =
  | "dawn_evening"       // early + late low-light
  | "afternoon"          // warmest stretch
  | "morning_evening"    // moderate shoulder bookends
  | "dawn_morning"       // early push
  | "morning_afternoon"  // midday block
  | "all_day";           // no strong bias

// ── Signal roles ─────────────────────────────────────────────────────────────

/**
 * How a timing driver relates to the final recommendation:
 * - anchor: controls the window
 * - confirmer: aligns with anchor, strengthens confidence
 * - widener: extends the anchored window to additional periods
 * - narrower: suppresses part of the anchored window (not used in v1)
 * - score_only: helps daily score without influencing timing
 * - not_applicable: data absent or driver doesn't apply today
 */
export type TimingSignalRole =
  | "anchor"
  | "confirmer"
  | "widener"
  | "narrower"
  | "score_only"
  | "not_applicable";

// ── Timing signal (one evaluator's output) ───────────────────────────────────

export type TimingSignal = {
  driver_id: TimingDriverId;
  role: TimingSignalRole;
  strength: TimingStrength;
  periods: DaypartFlags;
  /** Key into the note text pools in timingNotes.ts */
  note_pool_key: string;
  /** Tide-specific: formatted exchange times for narration */
  exchange_times?: string[];
  /** Human-readable reason this signal qualified (debug) */
  debug_reason: string;
};

// ── Timing trace (full decision audit) ───────────────────────────────────────

export type TimingTrace = {
  family_id: string;
  /** Second family when freshwater month-blend runs (same month as `month_blend_t`) */
  family_id_secondary?: string | null;
  /** Weight toward `family_id_secondary` after smoothstep [0,1] */
  month_blend_t?: number | null;
  context: string;
  region: string;
  month: number;
  climate_zone: string;
  season: string;
  primary_driver: TimingDriverId;
  primary_qualified: boolean;
  primary_signal: TimingSignal | null;
  secondary_driver: TimingDriverId;
  secondary_qualified: boolean;
  secondary_signal: TimingSignal | null;
  secondary_role: TimingSignalRole;
  fallback_bias: DaypartBias;
  fallback_used: boolean;
  selection_reason: string;
};

// ── Timing result (final output) ─────────────────────────────────────────────

export type TimingResult = {
  anchor_driver: TimingDriverId;
  timing_strength: TimingStrength;
  highlighted_periods: DaypartFlags;
  /** Backward-compatible preset for older frontends */
  daypart_preset: DaypartNotePreset | null;
  daypart_note: string;
  fallback_used: boolean;
  trace: TimingTrace;
};

// ── Combo grouping helpers ───────────────────────────────────────────────────

export type SeasonKey = "winter" | "spring" | "summer" | "fall";

/**
 * Timing climate archetypes (5) — finer than scoring’s per-region weights,
 * coarser than per-RegionKey tables. Each maps to a 12-month family row.
 */
export type ClimateZone =
  | "interior_continental"
  | "maritime_cool"
  | "warm_humid"
  | "hot_humid"
  | "hot_arid";

// ── Family config ────────────────────────────────────────────────────────────

export type TimingFamilyConfig = {
  family_id: string;
  primary_driver: TimingDriverId;
  secondary_driver: TimingDriverId;
  fallback_bias: DaypartBias;
  /** Human-readable rationale for this family's driver choices */
  rationale: string;
};

// ── Evaluator options (raw data beyond normalized state) ─────────────────────

export type TimingEvalOptions = {
  local_date: string;
  tide_high_low?: Array<{ time: string; value: number; type?: string }> | null;
  solunar_peak_local?: string[] | null;
  sunrise_local?: string | null;
  sunset_local?: string | null;
  cloud_cover_pct?: number | null;
  /** Same means used in normalizeTemperature — for day-over-day warmth gate */
  daily_mean_air_temp_f?: number | null;
  prior_day_mean_air_temp_f?: number | null;
  /**
   * Optional 24 hourly air temps (°F), index 0 = local midnight — when present,
   * seek_warmth places the window on the steepest warming step or warmest fishable hour.
   */
  hourly_air_temp_f?: number[] | null;
  /** 24 hourly cloud % (0–100), index 0 = local midnight */
  hourly_cloud_cover_pct?: number[] | null;
};
