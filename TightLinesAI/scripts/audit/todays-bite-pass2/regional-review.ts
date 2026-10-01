import { analyzeSharedConditions as current } from "../../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { resolveRegionForCoordinates } from "../../../supabase/functions/_shared/howFishingEngine/context/resolveRegion.ts";
import { CANONICAL_REGION_KEYS } from "../../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import { freshwaterTempRow } from "../../../supabase/functions/_shared/howFishingEngine/config/tempBandsFreshwater.ts";
import { coastalTempRow } from "../../../supabase/functions/_shared/howFishingEngine/config/tempBandsCoastal.ts";
import { coastalWaterTempRow } from "../../../supabase/functions/_shared/howFishingEngine/config/tempBandsCoastalWater.ts";
import { normalizeTemperature } from "../../../supabase/functions/_shared/howFishingEngine/normalize/normalizeTemperature.ts";
import { makeRequest } from "../todays-bite-pass1/fixtures.ts";
const archive = Deno.args[0];
if (!archive) throw Error("Pass the preserved Pass 1 _shared path");
const { analyzeSharedConditions: previous } = await import(
  `file://${archive}/howFishingEngine/analyzeSharedConditions.ts`
);
const cities = [
  ["Tallahassee", 30.4383, -84.2807],
  ["Tampa", 27.9506, -82.4572],
  ["Miami", 25.7617, -80.1918],
  ["Dallas", 32.7767, -96.797],
  ["Houston", 29.7604, -95.3698],
  ["Brownsville", 25.9017, -97.4975],
  ["Montgomery", 32.3668, -86.3],
  ["Jackson", 32.2988, -90.1848],
  ["Mobile", 30.6954, -88.0399],
] as const;
const rows = [];
let thermalProbes = 0;
for (const region of CANONICAL_REGION_KEYS) {
  for (let month = 1; month <= 12; month++) {
    for (
      const [source, lookup] of [["air_freshwater", freshwaterTempRow], [
        "air_coastal",
        coastalTempRow,
      ], ["water_coastal", coastalWaterTempRow]] as const
    ) {
      const row = lookup(region, month);
      if (!row) {
        throw Error(`Missing thermal row ${region}/${month}/${source}`);
      }
      const bands = row.slice(0, 4) as number[];
      if (
        bands.some((x, i) =>
          !Number.isFinite(x) || (i > 0 && x <= bands[i - 1])
        )
      ) throw Error("Invalid thermal anchors");
      for (let t = 25; t <= 105; t++) {
        const normalized = normalizeTemperature(
          source === "air_freshwater" ? "freshwater_lake_pond" : "coastal",
          region,
          month,
          t,
          t,
          t,
          source === "water_coastal"
            ? {
              measuredWaterTempF: t,
              measuredWaterTemp24hAgoF: t,
              measuredWaterTemp72hAgoF: t,
            }
            : undefined,
        )!;
        if (
          !Number.isFinite(normalized.final_score) ||
          Math.abs(normalized.final_score) > 2
        ) throw Error("Invalid thermal score");
        thermalProbes++;
      }
      rows.push({ region, month, source, anchors: row });
    }
  }
}
const sequences = [];
for (const [city, lat, lon] of cities) {
  for (const month of [9, 10, 11, 12, 1, 2, 3]) {
    for (
      const context of [
        "freshwater_lake_pond",
        "freshwater_river",
        "coastal",
        "coastal_flats_estuary",
      ] as const
    ) {
      for (
        const [profile, t, prior, history] of [
          ["steady", 65, 65, 65],
          ["gradual_cooling", 55, 58, 61],
          ["cold_front", 45, 65, 68],
          ["winter_warm_spell", 72, 68, 63],
        ] as const
      ) {
        const location = resolveRegionForCoordinates(lat, lon);
        const req = makeRequest(
          location.region_key,
          month,
          0,
          "stable",
          context,
        );
        req.latitude = lat;
        req.longitude = lon;
        req.state_code = location.state_code;
        Object.assign(req.environment, {
          daily_mean_air_temp_f: t,
          prior_day_mean_air_temp_f: prior,
          day_minus_2_mean_air_temp_f: history,
          daily_high_air_temp_f: t + 8,
          daily_low_air_temp_f: t - 8,
        });
        if (context.startsWith("coastal")) {
          Object.assign(req.environment, {
            measured_water_temp_f: t,
            measured_water_temp_24h_ago_f: prior,
            measured_water_temp_72h_ago_f: history,
          });
        }
        const before = previous(req), after = current(req);
        const temp = after.norm.normalized.temperature!;
        if (
          profile === "cold_front" &&
          (temp.shock_label === "none" ||
            temp.regional_calibration_adjustment !== 0)
        ) {
          throw Error("Cold-front guardrail");
        }
        sequences.push({
          city,
          region: location.region_key,
          month,
          context,
          profile,
          before: before.scored.score,
          after: after.scored.score,
          thermal: temp.final_score,
          source: temp.source_quality,
          shock: temp.shock_label,
        });
      }
    }
  }
}
const result = {
  note:
    "Controlled synthetic inputs isolate geography and seasonal behavior; these are not city weather forecasts or catch observations. Regional labels are not new subregions.",
  rows_reviewed: rows.length,
  thermal_probes: thermalProbes,
  sequence_cases: sequences.length,
  rows,
  sequences,
};
await Deno.writeTextFile(
  "docs/audits/todays-bite-pass2/regional-review.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log({ rows: rows.length, thermalProbes, sequences: sequences.length });
