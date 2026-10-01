// Read-only synthetic probes for the companion scoring review.
// Run: deno run --allow-read docs/audits/todays-bite-scoring-review-probes-2026-09-23.ts
import { analyzeSharedConditions } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { buildSharedNormalizedOutput } from "../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts";
import { resolveRegionForCoordinates } from "../../supabase/functions/_shared/howFishingEngine/context/resolveRegion.ts";
import { FRESHWATER_TEMP_ROWS } from "../../supabase/functions/_shared/howFishingEngine/config/tempBandsFreshwater.ts";
import type {
  EngineContext,
  RegionKey,
  SharedEngineRequest,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
function req(
  region: RegionKey,
  month: number,
  t: number,
  context: EngineContext = "freshwater_lake_pond",
  overrides: Record<string, unknown> = {},
): SharedEngineRequest {
  return {
    latitude: 28,
    longitude: -82,
    state_code: "FL",
    region_key: region,
    local_date: `2026-${String(month).padStart(2, "0")}-15`,
    local_timezone: "America/New_York",
    context,
    data_coverage: {},
    environment: {
      daily_mean_air_temp_f: t,
      prior_day_mean_air_temp_f: t,
      day_minus_2_mean_air_temp_f: t,
      pressure_history_mb: Array.from(
        { length: 25 },
        (_, i) => 1015 - 3 * i / 24,
      ),
      wind_speed_mph: 10,
      cloud_cover_pct: 75,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0,
      active_precip_now: false,
      precip_rate_now_in_per_hr: 0,
      ...(context.startsWith("coastal")
        ? {
          measured_water_temp_f: t,
          measured_water_temp_24h_ago_f: t,
          measured_water_temp_72h_ago_f: t,
          current_speed_knots_max: 1.3,
        }
        : {}),
      ...overrides,
    },
  };
}
function brief(r: SharedEngineRequest) {
  const original = buildSharedNormalizedOutput(r);
  const a = analyzeSharedConditions(r);
  return {
    region: r.region_key,
    date: r.local_date,
    context: r.context,
    temp: r.environment.daily_mean_air_temp_f,
    water: r.environment.measured_water_temp_f,
    cloud: r.environment.cloud_cover_pct,
    score: a.scored.score,
    legacy: a.scored.legacy_score,
    band: a.scored.band,
    tempOriginal: original.normalized.temperature?.final_score,
    tempAdjusted: a.norm.normalized.temperature?.final_score,
    tempLabel: a.norm.normalized.temperature?.band_label,
    light: a.norm.normalized.light_cloud_condition?.score,
    reliability: a.norm.reliability,
    primeReasons: a.scored.prime_disqualification_reasons,
    timing: a.timing.timing_strength,
  };
}
const geo = [
  ["Montgomery AL", 32.3668, -86.3],
  ["Jackson MS", 32.2988, -90.1848],
  ["Shreveport LA", 32.5252, -93.7502],
  ["Mobile AL", 30.6954, -88.0399],
  ["Valdosta GA", 30.8327, -83.2785],
  ["Miami FL", 25.7617, -80.1918],
  ["Tallahassee FL", 30.4383, -84.2807],
  ["Dallas TX", 32.7767, -96.797],
  ["Asheville NC", 35.5951, -82.5515],
  ["Birmingham AL", 33.5186, -86.8104],
] as const;
console.log(
  "GEO",
  JSON.stringify(
    geo.map(([city, lat, lon]) => ({
      city,
      ...resolveRegionForCoordinates(lat, lon),
    })),
  ),
);
for (
  const region of [
    "florida",
    "gulf_coast",
    "south_central",
    "southeast_atlantic",
  ] as RegionKey[]
) {
  for (const m of [9, 10, 11, 12, 1, 2]) {
    console.log("FIXED65", JSON.stringify(brief(req(region, m, 65))));
  }
}
for (const m of [9, 10, 11, 12, 1]) {
  console.log(
    "GULF_WATER74",
    JSON.stringify(brief(req("gulf_coast", m, 74, "coastal"))),
  );
}
for (const t of [61.99, 62, 62.01, 63, 64, 65, 66, 67, 68]) {
  console.log(
    "FL_WINTER",
    JSON.stringify(
      brief(
        req("florida", 1, t, "freshwater_lake_pond", { cloud_cover_pct: 0 }),
      ),
    ),
  );
}
for (const cloud of [24.99, 25, 25.01, 84.99, 85, 85.01]) {
  console.log(
    "CLOUD_EDGE",
    JSON.stringify(
      brief(
        req("south_central", 1, 40, "freshwater_lake_pond", {
          cloud_cover_pct: cloud,
        }),
      ),
    ),
  );
}
for (const t of [60, 68, 74]) {
  for (const rain of [0, 1]) {
    console.log(
      "FL_REPAIR",
      JSON.stringify(
        brief(
          req("florida", 11, t, "freshwater_lake_pond", {
            precip_72h_in: rain,
          }),
        ),
      ),
    );
  }
}
for (const measured of [true, false]) {
  console.log(
    "SOURCE",
    JSON.stringify(brief(req(
      "florida",
      1,
      70,
      "coastal",
      measured ? {} : {
        measured_water_temp_f: null,
        measured_water_temp_24h_ago_f: null,
        measured_water_temp_72h_ago_f: null,
      },
    ))),
  );
}
console.log(
  "INSTANT",
  JSON.stringify(
    brief(
      req("florida", 1, 65, "freshwater_lake_pond", {
        daily_mean_air_temp_f: null,
        current_air_temp_f: 65,
        prior_day_mean_air_temp_f: null,
        day_minus_2_mean_air_temp_f: null,
      }),
    ),
  ),
);
const boundary: any[] = [];
for (const region of Object.keys(FRESHWATER_TEMP_ROWS) as RegionKey[]) {
  for (
    const context of [
      "freshwater_lake_pond",
      "freshwater_river",
      "coastal",
      "coastal_flats_estuary",
    ] as EngineContext[]
  ) {
    for (const m of [9, 10, 11, 12, 1, 2]) {
      for (let t = 35; t <= 85; t += 1) {
        const a = brief(req(region, m, t, context)),
          b = brief(req(region, m === 12 ? 1 : m + 1, t, context));
        boundary.push({
          region,
          context,
          month: m,
          t,
          from: a.score,
          to: b.score,
          delta: b.score - a.score,
          tempFrom: a.tempOriginal,
          tempTo: b.tempOriginal,
        });
      }
    }
  }
}
boundary.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
console.log("BOUNDARY_MAX", JSON.stringify(boundary.slice(0, 15)));
console.log(
  "BOUNDARY_SOUTH",
  JSON.stringify(
    boundary.filter((x) =>
      ["florida", "gulf_coast", "south_central", "southeast_atlantic"].includes(
        x.region,
      )
    ).slice(0, 20),
  ),
);
for (const date of ["2026-10-31", "2026-11-01"]) {
  console.log(
    "ACTUAL_BOUNDARY",
    JSON.stringify(
      brief({ ...req("south_central", 10, 65), local_date: date }),
    ),
  );
}
for (const t of [58.77, 58.78, 66.88, 66.89]) {
  console.log(
    "REPAIR_EDGE",
    JSON.stringify(brief(req("florida", t < 60 ? 11 : 1, t))),
  );
}
for (const rain of [.999, 1.0]) {
  console.log(
    "RAIN_EDGE",
    JSON.stringify(
      brief(
        req("florida", 11, 68, "freshwater_lake_pond", { precip_72h_in: rain }),
      ),
    ),
  );
}
for (
  const region of [
    "midwest_interior",
    "gulf_coast",
    "south_central",
    "southeast_atlantic",
  ] as RegionKey[]
) console.log("GEO_EFFECT", JSON.stringify(brief(req(region, 1, 55))));
for (const hours of [25, 48]) {
  console.log(
    "PRESSURE_WINDOW",
    JSON.stringify({
      hours,
      pressure: buildSharedNormalizedOutput(
        req("south_central", 11, 65, "freshwater_lake_pond", {
          pressure_history_mb: Array.from(
            { length: hours },
            (_, i) => 1015 - 3 * i / 24,
          ),
        }),
      ).normalized.pressure_regime,
      score: brief(
        req("south_central", 11, 65, "freshwater_lake_pond", {
          pressure_history_mb: Array.from(
            { length: hours },
            (_, i) => 1015 - 3 * i / 24,
          ),
        }),
      ).score,
    }),
  );
}
