/**
 * Timing profile configs — one anchor driver plus one feeding-bias fallback.
 *
 * Design rule:
 * - each month/region/context combo resolves to a single anchor
 * - if the anchor cannot produce a real window, fall back to the combo's
 *   biologically typical feeding-bias window
 * - solunar is not part of timing selection
 */

import type { TimingFamilyConfig } from "./timingTypes.ts";

export const TIMING_FAMILY_CONFIGS: Record<string, TimingFamilyConfig> = {
  // ─── Freshwater lakes ──────────────────────────────────────────────────
  lake_cold_winter: {
    family_id: "lake_cold_winter",
    anchor_driver: "seek_warmth",
    fallback_bias: "afternoon",
    rationale: "Cold-water lake winter: warming is the cleanest timing signal; fallback stays on the warmest afternoon window.",
  },
  lake_cold_spring: {
    family_id: "lake_cold_spring",
    anchor_driver: "seek_warmth",
    fallback_bias: "morning_afternoon",
    rationale: "Cold spring lakes improve as the day warms; midday through afternoon is the default bias.",
  },
  lake_cold_summer: {
    family_id: "lake_cold_summer",
    anchor_driver: "light_window",
    fallback_bias: "dawn_evening",
    rationale: "Even in northern summer, low-light windows are the broadest dependable bite periods.",
  },
  lake_cold_fall: {
    family_id: "lake_cold_fall",
    anchor_driver: "light_window",
    fallback_bias: "morning_evening",
    rationale: "Cooling fall lakes usually favor shoulder windows when light softens and bait moves.",
  },
  lake_warm_winter: {
    family_id: "lake_warm_winter",
    anchor_driver: "seek_warmth",
    fallback_bias: "morning_afternoon",
    rationale: "Warm-temperate winter fish still respond best after the water has time to warm.",
  },
  lake_warm_spring: {
    family_id: "lake_warm_spring",
    anchor_driver: "light_window",
    fallback_bias: "dawn_evening",
    rationale: "Warm spring lakes are active enough that light transitions become the cleanest clock signal.",
  },
  lake_warm_summer: {
    family_id: "lake_warm_summer",
    anchor_driver: "avoid_heat",
    fallback_bias: "dawn_evening",
    rationale: "Warm summer lake fish pull away from the harsh middle of the day when heat builds.",
  },
  lake_warm_fall: {
    family_id: "lake_warm_fall",
    anchor_driver: "light_window",
    fallback_bias: "morning_evening",
    rationale: "Warm fall lakes return to shoulder-hour feeding as the sun angle softens.",
  },
  lake_hot_winter: {
    family_id: "lake_hot_winter",
    anchor_driver: "seek_warmth",
    fallback_bias: "morning_afternoon",
    rationale: "Subtropical winter lakes still fish best once shallow water has warmed for a few hours.",
  },
  lake_hot_spring: {
    family_id: "lake_hot_spring",
    anchor_driver: "light_window",
    fallback_bias: "dawn_evening",
    rationale: "Hot-zone spring is already bright and warming fast; low-light windows are the safest broad default.",
  },
  lake_hot_summer: {
    family_id: "lake_hot_summer",
    anchor_driver: "avoid_heat",
    fallback_bias: "dawn_evening",
    rationale: "Peak summer heat compresses activity into the coolest low-light periods.",
  },
  lake_hot_fall: {
    family_id: "lake_hot_fall",
    anchor_driver: "light_window",
    fallback_bias: "morning_evening",
    rationale: "Hot fall still favors shoulder windows until true cooling arrives.",
  },

  // ─── Freshwater rivers ────────────────────────────────────────────────
  river_cold_winter: {
    family_id: "river_cold_winter",
    anchor_driver: "seek_warmth",
    fallback_bias: "afternoon",
    rationale: "Cold rivers still hinge on the warmest part of the day when temperatures are winter-low.",
  },
  river_cold_spring: {
    family_id: "river_cold_spring",
    anchor_driver: "seek_warmth",
    fallback_bias: "morning_afternoon",
    rationale: "Spring river fish generally improve as the water warms and insect activity builds.",
  },
  river_cold_summer: {
    family_id: "river_cold_summer",
    anchor_driver: "light_window",
    fallback_bias: "dawn_evening",
    rationale: "Summer rivers favor lower-light windows once daytime pressure and brightness rise.",
  },
  river_cold_fall: {
    family_id: "river_cold_fall",
    anchor_driver: "light_window",
    fallback_bias: "morning_evening",
    rationale: "Cool-season river feeding usually clusters around shoulder periods rather than the hardest sun.",
  },
  river_warm_winter: {
    family_id: "river_warm_winter",
    anchor_driver: "seek_warmth",
    fallback_bias: "morning_afternoon",
    rationale: "Warm-temperate winter rivers still fish best after some daytime warming.",
  },
  river_warm_spring: {
    family_id: "river_warm_spring",
    anchor_driver: "light_window",
    fallback_bias: "dawn_evening",
    rationale: "Spring rivers are broadest at the low-light edges once the system is active.",
  },
  river_warm_summer: {
    family_id: "river_warm_summer",
    anchor_driver: "avoid_heat",
    fallback_bias: "dawn_evening",
    rationale: "Warm summer rivers still reward early and late when heat and angling pressure ease off.",
  },
  river_warm_fall: {
    family_id: "river_warm_fall",
    anchor_driver: "light_window",
    fallback_bias: "morning_evening",
    rationale: "Fall rivers return to shoulder-hour movement once the summer heat fades.",
  },
  river_hot_winter: {
    family_id: "river_hot_winter",
    anchor_driver: "seek_warmth",
    fallback_bias: "morning_afternoon",
    rationale: "Hot-zone winter rivers still respond to late-morning warming more than dawn chill.",
  },
  river_hot_spring: {
    family_id: "river_hot_spring",
    anchor_driver: "light_window",
    fallback_bias: "dawn_evening",
    rationale: "Hot spring rivers are better framed by low-light windows than by trying to chase midday.",
  },
  river_hot_summer: {
    family_id: "river_hot_summer",
    anchor_driver: "avoid_heat",
    fallback_bias: "dawn_evening",
    rationale: "Peak southern river summer should avoid the hottest, brightest middle stretch.",
  },
  river_hot_fall: {
    family_id: "river_hot_fall",
    anchor_driver: "light_window",
    fallback_bias: "morning_evening",
    rationale: "Hot fall rivers still fish better on the shoulders until true cooling sets in.",
  },

  // ─── Coastal inshore ──────────────────────────────────────────────────
  coastal_cold_winter_tide: {
    family_id: "coastal_cold_winter_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "afternoon",
    rationale: "In cold coastal winters, tide still sets the clock; if the tide clock is missing, the warmest part of the day is the better broad default.",
  },
  coastal_cold_shoulder_tide: {
    family_id: "coastal_cold_shoulder_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_afternoon",
    rationale: "Cold-zone spring shoulder fishing broadens beyond dawn but still benefits from daylight warming.",
  },
  coastal_cold_summer_tide: {
    family_id: "coastal_cold_summer_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "dawn_evening",
    rationale: "When the tide clock is unavailable in summer, low-light edges remain the cleanest inshore default.",
  },
  coastal_cold_fall_tide: {
    family_id: "coastal_cold_fall_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_evening",
    rationale: "Cold-zone fall inshore fishing usually holds best in shoulder windows when bait is moving.",
  },
  coastal_warm_winter_tide: {
    family_id: "coastal_warm_winter_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_afternoon",
    rationale: "Warm-coast winter fish usually improve after the chill burns off if the tide clock is missing.",
  },
  coastal_warm_shoulder_tide: {
    family_id: "coastal_warm_shoulder_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_evening",
    rationale: "Warm inshore shoulder seasons tend to favor classic shoulder-hour feeds when tide timing is unavailable.",
  },
  coastal_warm_summer_tide: {
    family_id: "coastal_warm_summer_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "dawn_evening",
    rationale: "Warm inshore summer defaults to the coolest low-light windows when exchange times are missing.",
  },
  coastal_hot_winter_tide: {
    family_id: "coastal_hot_winter_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_afternoon",
    rationale: "Subtropical inshore winter often improves once the day has warmed for a few hours.",
  },
  coastal_hot_shoulder_tide: {
    family_id: "coastal_hot_shoulder_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_evening",
    rationale: "Hot-zone shoulder seasons still favor shoulder periods when a tide-clock read is unavailable.",
  },
  coastal_hot_summer_tide: {
    family_id: "coastal_hot_summer_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "dawn_evening",
    rationale: "Subtropical summer inshore fishing should default to early and late if exact tide timing is unavailable.",
  },

  // ─── Flats / estuary ───────────────────────────────────────────────────
  flats_cold_winter_warmth: {
    family_id: "flats_cold_winter_warmth",
    anchor_driver: "seek_warmth",
    fallback_bias: "afternoon",
    rationale: "Cold flats fish often wait for shallow-water warming before becoming broadly catchable.",
  },
  flats_cold_spring_tide: {
    family_id: "flats_cold_spring_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_afternoon",
    rationale: "Temperate spring flats regain tide-driven movement, but broad effort still leans later than dawn.",
  },
  flats_cold_summer_light: {
    family_id: "flats_cold_summer_light",
    anchor_driver: "light_window",
    fallback_bias: "dawn_evening",
    rationale: "Summer flats are most forgiving around lower-light edges if no sharper timing signal appears.",
  },
  flats_cold_fall_tide: {
    family_id: "flats_cold_fall_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_evening",
    rationale: "Fall flats fish often line up around movement and shoulder windows instead of dead-sun midday.",
  },
  flats_warm_winter_warmth: {
    family_id: "flats_warm_winter_warmth",
    anchor_driver: "seek_warmth",
    fallback_bias: "morning_afternoon",
    rationale: "Warm-coast winter flats still fish best after sunlight has warmed the skinniest water.",
  },
  flats_warm_spring_tide: {
    family_id: "flats_warm_spring_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_evening",
    rationale: "Spring flats usually revolve around water movement, with shoulder periods as the safe broad default.",
  },
  flats_warm_summer_heat: {
    family_id: "flats_warm_summer_heat",
    anchor_driver: "avoid_heat",
    fallback_bias: "dawn_evening",
    rationale: "Warm-summer flats become harsh under high sun, so early and late are the dependable broad windows.",
  },
  flats_warm_fall_tide: {
    family_id: "flats_warm_fall_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_evening",
    rationale: "Warm fall flats return to movement-driven shoulder feeds once peak summer heat fades.",
  },
  flats_hot_winter_warmth: {
    family_id: "flats_hot_winter_warmth",
    anchor_driver: "seek_warmth",
    fallback_bias: "morning_afternoon",
    rationale: "Subtropical winter flats often improve from late morning through afternoon as shallow water warms.",
  },
  flats_hot_spring_tide: {
    family_id: "flats_hot_spring_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_evening",
    rationale: "Spring subtropical flats still fish best around moving water, with shoulder periods as the backup rhythm.",
  },
  flats_hot_summer_heat: {
    family_id: "flats_hot_summer_heat",
    anchor_driver: "avoid_heat",
    fallback_bias: "dawn_evening",
    rationale: "Peak summer flats should avoid harsh midday exposure whenever no sharper signal appears.",
  },
  flats_hot_fall_tide: {
    family_id: "flats_hot_fall_tide",
    anchor_driver: "tide_exchange_window",
    fallback_bias: "morning_evening",
    rationale: "Hot-zone fall flats still tend to feed better on moving water and shoulder light.",
  },
};
