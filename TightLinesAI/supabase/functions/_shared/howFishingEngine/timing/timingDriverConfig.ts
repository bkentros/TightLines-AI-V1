/**
 * Timing family configs — defines driver #1, #2, and fallback for each
 * timing family ID. Which family applies on a given day is resolved by
 * calendar month + climate zone + water context (see timingFamilies.ts).
 *
 * SALTWATER RULE: All coastal families use tide_exchange_window as primary.
 * No coastal family ever has a non-tide primary.
 *
 * Each family's rationale explains WHY those drivers were chosen so that
 * future tuning has context, not just raw config values.
 */

import type { TimingFamilyConfig } from "./timingTypes.ts";

export const TIMING_FAMILY_CONFIGS: Record<string, TimingFamilyConfig> = {
  // ─── Coastal (all zones, all seasons) ────────────────────────────────────
  coastal_all: {
    family_id: "coastal_all",
    primary_driver: "tide_exchange_window",
    secondary_driver: "low_light_geometry",
    fallback_bias: "dawn_evening",
    rationale:
      "Tide/current is always the #1 coastal timing anchor. Low-light geometry " +
      "can refine which exchange windows to prioritize. If tide data is absent " +
      "or weak, degrade to low-light then to dawn/evening (never pretend the whole clock is equal).",
  },

  // ─── Freshwater Lake/Pond — Cold Continental ─────────────────────────────
  lake_cold_winter: {
    family_id: "lake_cold_winter",
    primary_driver: "seek_warmth",
    secondary_driver: "low_light_geometry",
    fallback_bias: "afternoon",
    rationale:
      "Cold northern winters — any warming into midday/afternoon is the main " +
      "trigger. Fish are sluggish in cold; warmth concentrates activity. " +
      "If temp is flat, low-light dawn/dusk can still create edges. " +
      "Fallback leans afternoon because it's still the warmest part.",
  },
  lake_cold_spring: {
    family_id: "lake_cold_spring",
    primary_driver: "seek_warmth",
    secondary_driver: "low_light_geometry",
    fallback_bias: "morning_afternoon",
    rationale:
      "Spring warming is the dominant pattern in cold continental regions. " +
      "Afternoon warmth matters but mornings are increasingly productive as " +
      "days lengthen. Fallback broadens to morning+afternoon.",
  },
  lake_cold_summer: {
    family_id: "lake_cold_summer",
    primary_driver: "low_light_geometry",
    secondary_driver: "cloud_extended_low_light",
    fallback_bias: "dawn_evening",
    rationale:
      "Even cold-zone summers are warm enough that low-light transitions at " +
      "dawn/dusk create the best feeding windows. Cloud cover can extend " +
      "activity all day. Fallback is dawn+evening.",
  },
  lake_cold_fall: {
    family_id: "lake_cold_fall",
    primary_driver: "low_light_geometry",
    secondary_driver: "seek_warmth",
    fallback_bias: "morning_evening",
    rationale:
      "Fall transition — light diminishes and fish feed during low-light " +
      "windows, but as temps cool, warmth becomes secondary driver. " +
      "Fallback is shoulder hours.",
  },

  // ─── Freshwater Lake/Pond — Warm Temperate ───────────────────────────────
  lake_warm_winter: {
    family_id: "lake_warm_winter",
    primary_driver: "seek_warmth",
    secondary_driver: "low_light_geometry",
    fallback_bias: "morning_afternoon",
    rationale:
      "Warm-temperate winters are cool but not severe. Warming into midday " +
      "helps but the effect is milder than cold-continental. Low-light " +
      "geometry provides secondary edges.",
  },
  lake_warm_spring: {
    family_id: "lake_warm_spring",
    primary_driver: "low_light_geometry",
    secondary_driver: "cloud_extended_low_light",
    fallback_bias: "dawn_evening",
    rationale:
      "Warm-temperate spring is already warm enough that midday heat starts " +
      "to build. Low-light transitions become primary. Cloud cover can " +
      "extend productive windows.",
  },
  lake_warm_summer: {
    family_id: "lake_warm_summer",
    primary_driver: "avoid_heat",
    secondary_driver: "cloud_extended_low_light",
    fallback_bias: "dawn_evening",
    rationale:
      "Warm-temperate summers push fish to cooler low-light periods. " +
      "Heat avoidance is primary — steer away from midday. Cloud cover " +
      "can make midday tolerable. Fallback is dawn+evening.",
  },
  lake_warm_fall: {
    family_id: "lake_warm_fall",
    primary_driver: "low_light_geometry",
    secondary_driver: "seek_warmth",
    fallback_bias: "morning_evening",
    rationale:
      "Fall cooling makes low-light transitions primary again. As temps " +
      "drop, warmth becomes a secondary positive signal. Shoulder hours " +
      "are the fallback.",
  },

  // ─── Freshwater Lake/Pond — Hot Subtropical ──────────────────────────────
  lake_hot_winter: {
    family_id: "lake_hot_winter",
    primary_driver: "low_light_geometry",
    secondary_driver: "cloud_extended_low_light",
    fallback_bias: "dawn_evening",
    rationale:
      "Hot-subtropical winters are mild — temps rarely cold enough for " +
      "seek_warmth to matter. Low-light geometry drives timing year-round " +
      "in these regions. Cloud can extend all-day activity.",
  },
  lake_hot_spring: {
    family_id: "lake_hot_spring",
    primary_driver: "low_light_geometry",
    secondary_driver: "avoid_heat",
    fallback_bias: "dawn_evening",
    rationale:
      "Spring in hot zones heats up fast. Low-light is primary, with heat " +
      "avoidance as secondary (pushing away from midday on hot days).",
  },
  lake_hot_summer: {
    family_id: "lake_hot_summer",
    primary_driver: "avoid_heat",
    secondary_driver: "cloud_extended_low_light",
    fallback_bias: "dawn_evening",
    rationale:
      "Peak heat — fish are driven to dawn/dusk. Avoid-heat is the dominant " +
      "timing signal. Cloud cover is the only thing that can open up midday. " +
      "Fallback always dawn+evening.",
  },
  lake_hot_fall: {
    family_id: "lake_hot_fall",
    primary_driver: "low_light_geometry",
    secondary_driver: "avoid_heat",
    fallback_bias: "dawn_evening",
    rationale:
      "Hot-zone fall is still warm. Low-light geometry primary, heat " +
      "avoidance secondary. Dawn+evening fallback.",
  },

  // ─── Freshwater River — Cold Continental ─────────────────────────────────
  river_cold_winter: {
    family_id: "river_cold_winter",
    primary_driver: "seek_warmth",
    secondary_driver: "low_light_geometry",
    fallback_bias: "afternoon",
    rationale:
      "Same driver logic as lake_cold_winter. River flow doesn't change " +
      "the fundamental cold-water timing — warmth into afternoon is key. " +
      "Separate family ID for future runoff/flow timing additions.",
  },
  river_cold_spring: {
    family_id: "river_cold_spring",
    primary_driver: "seek_warmth",
    secondary_driver: "low_light_geometry",
    fallback_bias: "morning_afternoon",
    rationale:
      "Spring warming drives timing in cold rivers. Runoff/flow is already " +
      "captured in the score lane; timing still centers on warmth and light.",
  },
  river_cold_summer: {
    family_id: "river_cold_summer",
    primary_driver: "low_light_geometry",
    secondary_driver: "cloud_extended_low_light",
    fallback_bias: "dawn_evening",
    rationale:
      "Summer rivers in cold zones — low-light transitions drive timing. " +
      "Cloud cover can extend the window.",
  },
  river_cold_fall: {
    family_id: "river_cold_fall",
    primary_driver: "low_light_geometry",
    secondary_driver: "seek_warmth",
    fallback_bias: "morning_evening",
    rationale:
      "Fall cooling returns warmth as a secondary factor while low-light " +
      "geometry remains primary.",
  },

  // ─── Freshwater River — Warm Temperate ───────────────────────────────────
  river_warm_winter: {
    family_id: "river_warm_winter",
    primary_driver: "seek_warmth",
    secondary_driver: "low_light_geometry",
    fallback_bias: "morning_afternoon",
    rationale:
      "Warm-temperate river winters — same logic as lake equivalent. " +
      "Warmth drives timing, light is secondary.",
  },
  river_warm_spring: {
    family_id: "river_warm_spring",
    primary_driver: "low_light_geometry",
    secondary_driver: "cloud_extended_low_light",
    fallback_bias: "dawn_evening",
    rationale:
      "Spring warming makes low-light primary. Cloud cover extends windows.",
  },
  river_warm_summer: {
    family_id: "river_warm_summer",
    primary_driver: "avoid_heat",
    secondary_driver: "cloud_extended_low_light",
    fallback_bias: "dawn_evening",
    rationale:
      "Heat avoidance dominates warm-temperate river summers. " +
      "Dawn/evening are the productive windows.",
  },
  river_warm_fall: {
    family_id: "river_warm_fall",
    primary_driver: "low_light_geometry",
    secondary_driver: "seek_warmth",
    fallback_bias: "morning_evening",
    rationale:
      "Fall transition — light edges primary, warmth secondary as temps cool.",
  },

  // ─── Freshwater River — Hot Subtropical ──────────────────────────────────
  river_hot_winter: {
    family_id: "river_hot_winter",
    primary_driver: "low_light_geometry",
    secondary_driver: "cloud_extended_low_light",
    fallback_bias: "dawn_evening",
    rationale:
      "Hot-zone river winters are mild. Low-light geometry drives timing.",
  },
  river_hot_spring: {
    family_id: "river_hot_spring",
    primary_driver: "low_light_geometry",
    secondary_driver: "avoid_heat",
    fallback_bias: "dawn_evening",
    rationale:
      "Spring heats up fast in hot zones. Light is primary, heat avoidance " +
      "secondary.",
  },
  river_hot_summer: {
    family_id: "river_hot_summer",
    primary_driver: "avoid_heat",
    secondary_driver: "cloud_extended_low_light",
    fallback_bias: "dawn_evening",
    rationale:
      "Peak heat — avoid midday. Cloud is the only midday rescue.",
  },
  river_hot_fall: {
    family_id: "river_hot_fall",
    primary_driver: "low_light_geometry",
    secondary_driver: "avoid_heat",
    fallback_bias: "dawn_evening",
    rationale:
      "Still warm in hot-zone fall. Low-light primary, heat avoidance secondary.",
  },
};
