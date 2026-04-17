/**
 * Largemouth Bass — 5 scenarios focused on prime regions and commonly-fished months.
 *
 * Prime largemouth regions (guide-level consensus):
 *   - florida             → year-round fishery; Okeechobee, St. Johns, Rodman
 *   - southeast_atlantic  → GA/SC/NC reservoirs (Clarks Hill, Santee, Murray, Hartwell)
 *   - gulf_coast          → LA/TX deep-south reservoirs (Toledo Bend, Rayburn)
 *   - south_central       → TX/OK/AR trophy fishery (Fork, Falcon, Table Rock)
 *   - midwest_interior    → northern summer/fall; IN/OH/IL/MO reservoirs
 *
 * Most commonly fished months by region:
 *   - Florida: December-May (winter bed fishing), year-round really
 *   - Southeast / Gulf / South Central: March-October
 *   - Midwest Interior: April-October with May spawn / Oct fall feed being peak
 */

import type { ReportAuditScenarioSet } from "../types.ts";
import { pressureTrend } from "../helpers.ts";

export const LARGEMOUTH_SCENARIO_SET: ReportAuditScenarioSet = {
  species: "largemouth_bass",
  species_display_name: "Largemouth Bass",
  primary_regions_rationale:
    "Florida (year-round), Southeast Atlantic, Gulf Coast, and South Central dominate the " +
    "largemouth fishery — the bulk of guides, tournaments, and trophy fisheries live there. " +
    "Midwest Interior is a strong secondary with a defined spring-through-fall window.",
  commonly_fished_months_rationale:
    "FL fishes best Dec-May when bass are on beds and in winter staging; Southeast/Gulf/South " +
    "Central peak March-October; Midwest Interior is May (spawn) and October (fall feed). " +
    "The scenarios span cold-front winter, pre-spawn, post-spawn, summer heat, and fall feed.",
  scenarios: [
    {
      id: "lmb-01-florida-january-cold-front",
      title: "Florida lake • January • post-cold-front, bed edge",
      intent:
        "Mid-January on Lake Okeechobee or similar FL largemouth water. Air cooled into " +
        "the 50s after a front, water 58°F — cold for FL bass. Bluebird high pressure, " +
        "clear. Guide read: SLOW + SUBTLE presentations; flipping soft plastics in cover, " +
        "shaky head, lipless with long pauses. Surface should close; reaction baits demoted. " +
        "Opportunity mix should trend conservative.",
      species: "largemouth_bass",
      context: "freshwater_lake_pond",
      water_clarity: "stained",
      condition_profile: "post_front_bluebird",
      location: {
        region_key: "florida",
        state_code: "FL",
        latitude: 26.95,
        longitude: -80.88,
        timezone: "America/New_York",
        local_date: "2026-01-16",
        month: 1,
      },
      environment: {
        current_air_temp_f: 56,
        daily_mean_air_temp_f: 54,
        daily_low_air_temp_f: 42,
        daily_high_air_temp_f: 66,
        prior_day_mean_air_temp_f: 60,
        day_minus_2_mean_air_temp_f: 68,
        measured_water_temp_f: 58,
        measured_water_temp_24h_ago_f: 60,
        measured_water_temp_72h_ago_f: 64,
        pressure_mb: 1028,
        pressure_history_mb: pressureTrend(1028, 1012),
        wind_speed_mph: 4,
        cloud_cover_pct: 10,
        precip_24h_in: 0,
        precip_72h_in: 0.3,
        precip_7d_in: 0.5,
        active_precip_now: false,
        sunrise_local: "2026-01-16T07:13:00-05:00",
        sunset_local: "2026-01-16T17:47:00-05:00",
      },
    },
    {
      id: "lmb-02-southeast-atlantic-lake-april-prespawn",
      title: "SE Atlantic reservoir • April pre-spawn • warming, overcast moderate wind",
      intent:
        "Mid-April on a GA/SC reservoir (Clarks Hill, Murray). Water warming to low-60s, " +
        "bass staging in transition zones. Overcast, moderate wind, stable-to-falling " +
        "pressure — classic pre-spawn reaction day. Guide read: moving baits (squarebill, " +
        "spinnerbait, lipless, jerkbait) should rate high. Moderate-bold presence, " +
        "medium-fast pace. Surface possibly open but not dominant.",
      species: "largemouth_bass",
      context: "freshwater_lake_pond",
      water_clarity: "stained",
      condition_profile: "spring_spawn_warming",
      location: {
        region_key: "southeast_atlantic",
        state_code: "GA",
        latitude: 33.65,
        longitude: -82.2,
        timezone: "America/New_York",
        local_date: "2026-04-10",
        month: 4,
      },
      environment: {
        current_air_temp_f: 68,
        daily_mean_air_temp_f: 64,
        daily_low_air_temp_f: 54,
        daily_high_air_temp_f: 74,
        prior_day_mean_air_temp_f: 62,
        day_minus_2_mean_air_temp_f: 60,
        measured_water_temp_f: 62,
        measured_water_temp_24h_ago_f: 61,
        measured_water_temp_72h_ago_f: 58,
        pressure_mb: 1012,
        pressure_history_mb: pressureTrend(1012, 1017),
        wind_speed_mph: 12,
        cloud_cover_pct: 80,
        precip_24h_in: 0.05,
        precip_72h_in: 0.3,
        precip_7d_in: 0.8,
        active_precip_now: false,
        sunrise_local: "2026-04-10T07:04:00-04:00",
        sunset_local: "2026-04-10T20:06:00-04:00",
      },
    },
    {
      id: "lmb-03-south-central-lake-may-postspawn",
      title: "South Central reservoir • May post-spawn • warm, light breeze",
      intent:
        "Mid-May on a TX/OK reservoir (Falcon, Fork, Texoma). Post-spawn bass recovering, " +
        "keying on shad spawns and bream beds. Water 72°F, partly cloudy, light wind, " +
        "stable pressure. Guide read: a healthy mix — topwaters in low light, squarebills " +
        "and swim jigs mid-morning, jigs and Texas-rigged worms for bigger fish. Surface " +
        "open, presence can be bold.",
      species: "largemouth_bass",
      context: "freshwater_lake_pond",
      water_clarity: "stained",
      condition_profile: "stable_high_pressure_clear",
      location: {
        region_key: "south_central",
        state_code: "TX",
        latitude: 32.15,
        longitude: -95.7,
        timezone: "America/Chicago",
        local_date: "2026-05-14",
        month: 5,
      },
      environment: {
        current_air_temp_f: 78,
        daily_mean_air_temp_f: 74,
        daily_low_air_temp_f: 64,
        daily_high_air_temp_f: 84,
        prior_day_mean_air_temp_f: 72,
        day_minus_2_mean_air_temp_f: 72,
        measured_water_temp_f: 72,
        measured_water_temp_24h_ago_f: 71,
        measured_water_temp_72h_ago_f: 70,
        pressure_mb: 1017,
        pressure_history_mb: pressureTrend(1017, 1018),
        wind_speed_mph: 8,
        cloud_cover_pct: 50,
        precip_24h_in: 0,
        precip_72h_in: 0.1,
        precip_7d_in: 0.5,
        active_precip_now: false,
        sunrise_local: "2026-05-14T06:26:00-05:00",
        sunset_local: "2026-05-14T20:14:00-05:00",
      },
    },
    {
      id: "lmb-04-gulf-coast-lake-july-summer-heat",
      title: "Gulf Coast reservoir • July • deep summer heat, stable high pressure",
      intent:
        "Mid-July on Toledo Bend / Rayburn. Surface temps pushing 88°F, bass in deep " +
        "structure and on offshore brush piles. Stable high pressure, sun angle high, " +
        "light wind. Guide read: deep-diving crankbaits, football jigs, Carolina-rigged " +
        "worms, big worms on offshore structure. Surface bite windowed around dawn only. " +
        "Presence should skew bolder (deep/clarity demands visibility).",
      species: "largemouth_bass",
      context: "freshwater_lake_pond",
      water_clarity: "clear",
      condition_profile: "summer_peak_hot",
      location: {
        region_key: "gulf_coast",
        state_code: "LA",
        latitude: 31.5,
        longitude: -93.72,
        timezone: "America/Chicago",
        local_date: "2026-07-20",
        month: 7,
      },
      environment: {
        current_air_temp_f: 92,
        daily_mean_air_temp_f: 88,
        daily_low_air_temp_f: 76,
        daily_high_air_temp_f: 96,
        prior_day_mean_air_temp_f: 88,
        day_minus_2_mean_air_temp_f: 87,
        measured_water_temp_f: 87,
        measured_water_temp_24h_ago_f: 87,
        measured_water_temp_72h_ago_f: 86,
        pressure_mb: 1018,
        pressure_history_mb: pressureTrend(1018, 1017),
        wind_speed_mph: 5,
        cloud_cover_pct: 25,
        precip_24h_in: 0,
        precip_72h_in: 0,
        precip_7d_in: 0.2,
        active_precip_now: false,
        sunrise_local: "2026-07-20T06:21:00-05:00",
        sunset_local: "2026-07-20T20:22:00-05:00",
      },
    },
    {
      id: "lmb-05-midwest-interior-lake-october-fall-feed",
      title: "Midwest Interior lake • October • fall feed, cool falling water temps",
      intent:
        "Mid-October on an IN/OH/IL reservoir. Water dropping through the low-60s, bass " +
        "chasing shad in creek arms and on points before the winter shutdown. Overcast, " +
        "light wind, stable pressure. Guide read: lipless crankbaits, squarebills, " +
        "swimbaits, jerkbaits — moving, shad-imitating presentations dominate. Moderate " +
        "to bold presence, medium-fast pace. Surface closing as water cools.",
      species: "largemouth_bass",
      context: "freshwater_lake_pond",
      water_clarity: "stained",
      condition_profile: "fall_feed_cooling",
      location: {
        region_key: "midwest_interior",
        state_code: "IN",
        latitude: 40.0,
        longitude: -86.2,
        timezone: "America/New_York",
        local_date: "2026-10-11",
        month: 10,
      },
      environment: {
        current_air_temp_f: 58,
        daily_mean_air_temp_f: 56,
        daily_low_air_temp_f: 44,
        daily_high_air_temp_f: 68,
        prior_day_mean_air_temp_f: 58,
        day_minus_2_mean_air_temp_f: 62,
        measured_water_temp_f: 62,
        measured_water_temp_24h_ago_f: 63,
        measured_water_temp_72h_ago_f: 66,
        pressure_mb: 1016,
        pressure_history_mb: pressureTrend(1016, 1015),
        wind_speed_mph: 9,
        cloud_cover_pct: 75,
        precip_24h_in: 0,
        precip_72h_in: 0.2,
        precip_7d_in: 0.6,
        active_precip_now: false,
        sunrise_local: "2026-10-11T07:51:00-04:00",
        sunset_local: "2026-10-11T18:53:00-04:00",
      },
    },
  ],
};
