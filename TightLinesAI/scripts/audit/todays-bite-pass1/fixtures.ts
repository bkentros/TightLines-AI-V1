import {
  CANONICAL_REGION_KEYS,
  type RegionKey,
} from "../../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type {
  EngineContext,
  SharedEngineRequest,
} from "../../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
export const contexts: EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];
export const cities = [
  ["Montgomery", 32.3668, -86.3, "AL"],
  ["Jackson", 32.2988, -90.1848, "MS"],
  ["Tallahassee", 30.4383, -84.2807, "FL"],
  ["Asheville", 35.5951, -82.5515, "NC"],
  ["Valdosta", 30.8327, -83.2785, "GA"],
  ["Birmingham", 33.5186, -86.8104, "AL"],
  ["Mobile", 30.6954, -88.0399, "AL"],
  ["Shreveport", 32.5252, -93.7502, "LA"],
  ["Miami", 25.7617, -80.1918, "FL"],
  ["Dallas", 32.7767, -96.797, "TX"],
  ["Houston", 29.7604, -95.3698, "TX"],
  ["El Paso", 31.7619, -106.485, "TX"],
  ["Boston", 42.3601, -71.0589, "MA"],
  ["Buffalo", 42.8864, -78.8784, "NY"],
  ["Pittsburgh", 40.4406, -79.9959, "PA"],
  ["Chicago", 41.8781, -87.6298, "IL"],
  ["Columbus", 39.9612, -82.9988, "OH"],
  ["Seattle", 47.6062, -122.3321, "WA"],
  ["Spokane", 47.6588, -117.426, "WA"],
  ["Sacramento", 38.5816, -121.4944, "CA"],
  ["Los Angeles", 34.0522, -118.2437, "CA"],
  ["Honolulu", 21.3099, -157.8581, "HI"],
  ["Anchorage", 61.2181, -149.9003, "AK"],
  ["Annapolis", 38.9784, -76.4922, "MD"],
  ["Washington", 38.9072, -77.0369, "DC"],
] as const;
export type Fixture = {
  id: string;
  offset: number;
  city?: typeof cities[number];
  request: SharedEngineRequest;
};
export function makeRequest(
  region: RegionKey,
  month: number,
  offset: number,
  archetype: string,
  context: EngineContext,
): SharedEngineRequest {
  const date = `2026-${String(month).padStart(2, "0")}-${
    String(15 + offset).padStart(2, "0")
  }`;
  const southern = [
    "florida",
    "gulf_coast",
    "south_central",
    "southeast_atlantic",
  ].includes(region);
  const season = Math.cos((month - 7) * Math.PI / 6);
  let t = Math.round((southern ? 68 : 52) + (southern ? 14 : 22) * season) +
    offset * .2;
  let prior = t, d2 = t;
  if (archetype === "cold_front") {
    prior = t + 12;
    d2 = t + 18;
  }
  if (archetype === "gradual_cooling") {
    prior = t + 3;
    d2 = t + 6;
  }
  if (archetype === "warm_spell") {
    t += 8;
    prior = t - 6;
    d2 = t - 9;
  }
  if (archetype === "stable_winter_warm") {
    t = 65;
    prior = t;
    d2 = t;
  }
  const coastal = context.startsWith("coastal");
  const pressure = archetype === "pressure_48h"
    ? Array.from({ length: 48 }, (_, i) => 1015 - i * .125)
    : Array(25).fill(1013);
  return {
    latitude: 35,
    longitude: -90,
    state_code: "TN",
    region_key: region,
    local_date: date,
    local_timezone: "UTC",
    context,
    data_coverage: {},
    environment: {
      daily_mean_air_temp_f: t,
      prior_day_mean_air_temp_f: prior,
      day_minus_2_mean_air_temp_f: d2,
      daily_high_air_temp_f: t + 8,
      daily_low_air_temp_f: t - 8,
      pressure_history_mb: pressure,
      wind_speed_mph: archetype === "missing_wind" ? null : 8,
      cloud_cover_pct: archetype === "stable_winter_warm" ? 20 : 75,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0,
      active_precip_now: false,
      precip_rate_now_in_per_hr: 0,
      ...(coastal
        ? {
          current_speed_knots_max: 1.3,
          ...(offset === 0
            ? {
              measured_water_temp_f: t,
              measured_water_temp_24h_ago_f: prior,
              measured_water_temp_72h_ago_f: d2,
            }
            : {}),
        }
        : {}),
      sunrise_local: `${date}T07:00:00`,
      sunset_local: `${date}T18:00:00`,
    },
  };
}
export function* fixtures(): Generator<Fixture> {
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of contexts) {
        for (let offset = 0; offset <= 6; offset++) {
          for (const archetype of ["stable", "pressure_48h", "missing_wind"]) {
            yield {
              id: [region, month, context, offset, archetype].join("|"),
              offset,
              request: makeRequest(region, month, offset, archetype, context),
            };
          }
        }
      }
    }
  }
  for (
    const region of [
      "florida",
      "gulf_coast",
      "south_central",
      "southeast_atlantic",
    ] as RegionKey[]
  ) {
    for (const month of [9, 10, 11, 12, 1, 2, 3]) {
      for (const context of contexts) {
        for (let offset = 0; offset <= 6; offset++) {
          for (
            const archetype of [
              "cold_front",
              "gradual_cooling",
              "warm_spell",
              "stable_winter_warm",
            ]
          ) {
            yield {
              id: [region, month, context, offset, archetype].join("|"),
              offset,
              request: makeRequest(region, month, offset, archetype, context),
            };
          }
        }
      }
    }
  }
  for (const city of cities) {
    for (const month of [1, 3, 9, 10, 11, 12]) {
      for (const context of contexts) {
        const request = makeRequest(
          "midwest_interior",
          month,
          0,
          "stable",
          context,
        );
        request.latitude = city[1];
        request.longitude = city[2];
        request.state_code = city[3];
        yield {
          id: ["geo", city[0], month, context].join("|"),
          offset: 0,
          city,
          request,
        };
      }
    }
  }
}

/** Raw adapter/snapshot cases crossing month/year boundaries and US fall DST. */
export function* boundaryFixtures() {
  const places = [cities[0], cities[1], cities[2], cities[4]];
  for (
    const start of [
      "2026-09-28",
      "2026-10-28",
      "2026-11-28",
      "2026-12-28",
      "2027-01-28",
      "2027-02-26",
      "2027-03-28",
    ]
  ) {
    for (const city of places) {
      for (const context of contexts) {
        for (const profile of ["cooling", "warming", "missing"]) {
          for (let offset = 0; offset <= 6; offset++) {
            const initial = Date.parse(`${start}T00:00:00Z`);
            const date = new Date(initial + offset * 86400000).toISOString()
              .slice(0, 10);
            const request = makeRequest(
              "south_central",
              Number(date.slice(5, 7)),
              offset,
              "stable",
              context,
            );
            request.latitude = city[1];
            request.longitude = city[2];
            request.local_date = date;
            request.local_timezone = city[3] === "FL" || city[3] === "GA"
              ? "America/New_York"
              : "America/Chicago";
            const highs = Array.from(
              { length: 21 },
              (_, i) => profile === "cooling" ? 85 - i : 50 + i,
            );
            const raw = {
              timezone: request.local_timezone,
              measured_water_temp_f: 65,
              measured_water_temp_24h_ago_f: 64,
              measured_water_temp_72h_ago_f: 63,
              weather: {
                temp_7day_high: highs,
                temp_7day_low: highs.map((x) => x - 16),
                pressure: 1013,
                pressure_48hr: Array(48).fill(1013),
                wind_speed: profile === "missing" ? null : 8,
                cloud_cover: 50,
                precip_7day_daily: Array(21).fill(0),
              },
              hourly_pressure_mb: Array.from(
                { length: 21 * 24 },
                (_, i) => ({
                  time_utc: new Date(initial - 14 * 86400000 + i * 3600000)
                    .toISOString(),
                  value: profile === "missing" && i % 3 === 0
                    ? null
                    : 1015 - (i % 48) * .08,
                }),
              ),
            };
            yield {
              id: ["boundary", city[0], start, context, profile, offset].join(
                "|",
              ),
              offset,
              request,
              raw,
            };
          }
        }
      }
    }
  }
}
