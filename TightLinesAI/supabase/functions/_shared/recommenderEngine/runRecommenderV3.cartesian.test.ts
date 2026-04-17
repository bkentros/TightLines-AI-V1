/**
 * This test iterates the production-reachable surface, not the full Cartesian product
 * over canonical regions. The upstream gate in `supabase/functions/recommender/index.ts`
 * rejects any (state, species, context) combo not present in `STATE_SPECIES_MAP`, so
 * biologically impossible tuples like northern_pike in Florida are not part of the
 * engine's contract.
 *
 * Fixed `SharedConditionAnalysis`: mirrors the neutral `analysis()` helper in
 * `__tests__/v3Foundation.test.ts` (stable pressure, light wind, mixed light, dry_stable,
 * stable runoff, neutral temperature context). Static values only — no RNG, no
 * `Date.now()` — so every `computeRecommenderV3` call is deterministic.
 */
import { assert, assertEquals } from "jsr:@std/assert";
import type { SharedConditionAnalysis } from "../howFishingEngine/analyzeSharedConditions.ts";
import { STATE_TO_REGION } from "../howFishingEngine/config/stateToRegion.ts";
import type { RegionKey } from "../howFishingEngine/contracts/region.ts";
import type { RecommenderRequest } from "./contracts/input.ts";
import type { SpeciesGroup } from "./contracts/species.ts";
import { STATE_SPECIES_MAP } from "./config/stateSpeciesGating.ts";
import { computeRecommenderV3 } from "./runRecommenderV3.ts";
import type { RecommenderV3Context, RecommenderV3Species } from "./v3/contracts.ts";
import {
  isContextAllowedForRecommenderV3,
  toLegacyRecommenderSpecies,
  toRecommenderV3Species,
} from "./v3/scope.ts";

/** One deterministic lat/lon + IANA timezone per state (bulk `STATE_TO_REGION` mapping; not lat/lon overrides). */
const STATE_REQUEST_ANCHOR: Record<
  string,
  { lat: number; lon: number; local_timezone: string }
> = {
  AL: { lat: 32.8067, lon: -86.7911, local_timezone: "America/Chicago" },
  AK: { lat: 64.2008, lon: -149.4937, local_timezone: "America/Anchorage" },
  AZ: { lat: 34.2744, lon: -111.6602, local_timezone: "America/Phoenix" },
  AR: { lat: 34.7465, lon: -92.2896, local_timezone: "America/Chicago" },
  CA: { lat: 36.7783, lon: -119.4179, local_timezone: "America/Los_Angeles" },
  CO: { lat: 39.0598, lon: -105.3111, local_timezone: "America/Denver" },
  CT: { lat: 41.6032, lon: -72.6884, local_timezone: "America/New_York" },
  DE: { lat: 38.9108, lon: -75.5277, local_timezone: "America/New_York" },
  FL: { lat: 27.6648, lon: -81.5158, local_timezone: "America/New_York" },
  GA: { lat: 32.1656, lon: -82.9001, local_timezone: "America/New_York" },
  HI: { lat: 19.8968, lon: -155.5828, local_timezone: "Pacific/Honolulu" },
  ID: { lat: 44.0682, lon: -114.742, local_timezone: "America/Boise" },
  IL: { lat: 40.6331, lon: -89.3985, local_timezone: "America/Chicago" },
  IN: { lat: 40.2672, lon: -86.1349, local_timezone: "America/Indiana/Indianapolis" },
  IA: { lat: 41.878, lon: -93.0977, local_timezone: "America/Chicago" },
  KS: { lat: 38.5266, lon: -96.7265, local_timezone: "America/Chicago" },
  KY: { lat: 37.8393, lon: -84.27, local_timezone: "America/New_York" },
  LA: { lat: 30.9843, lon: -91.9623, local_timezone: "America/Chicago" },
  ME: { lat: 45.2538, lon: -69.4455, local_timezone: "America/New_York" },
  MD: { lat: 39.0458, lon: -76.6413, local_timezone: "America/New_York" },
  MA: { lat: 42.4072, lon: -71.3824, local_timezone: "America/New_York" },
  MI: { lat: 44.3148, lon: -85.6024, local_timezone: "America/Detroit" },
  MN: { lat: 46.7296, lon: -94.6859, local_timezone: "America/Chicago" },
  MS: { lat: 32.3547, lon: -89.3985, local_timezone: "America/Chicago" },
  MO: { lat: 37.9643, lon: -91.8318, local_timezone: "America/Chicago" },
  MT: { lat: 46.8797, lon: -110.3626, local_timezone: "America/Denver" },
  NE: { lat: 41.4925, lon: -99.9018, local_timezone: "America/Chicago" },
  NV: { lat: 38.8026, lon: -116.4194, local_timezone: "America/Los_Angeles" },
  NH: { lat: 43.1939, lon: -71.5724, local_timezone: "America/New_York" },
  NJ: { lat: 40.0583, lon: -74.4057, local_timezone: "America/New_York" },
  NM: { lat: 34.5199, lon: -105.8701, local_timezone: "America/Denver" },
  NY: { lat: 43.2994, lon: -74.2179, local_timezone: "America/New_York" },
  NC: { lat: 35.7596, lon: -79.0193, local_timezone: "America/New_York" },
  ND: { lat: 47.5515, lon: -101.002, local_timezone: "America/Chicago" },
  OH: { lat: 40.4173, lon: -82.9071, local_timezone: "America/New_York" },
  OK: { lat: 35.0078, lon: -97.0929, local_timezone: "America/Chicago" },
  OR: { lat: 43.8041, lon: -120.5542, local_timezone: "America/Los_Angeles" },
  PA: { lat: 41.2033, lon: -77.1945, local_timezone: "America/New_York" },
  RI: { lat: 41.5801, lon: -71.4774, local_timezone: "America/New_York" },
  SC: { lat: 33.8361, lon: -81.1637, local_timezone: "America/New_York" },
  SD: { lat: 43.9695, lon: -99.9018, local_timezone: "America/Chicago" },
  TN: { lat: 35.5175, lon: -86.5804, local_timezone: "America/Chicago" },
  TX: { lat: 31.9686, lon: -99.9018, local_timezone: "America/Chicago" },
  UT: { lat: 39.321, lon: -111.0937, local_timezone: "America/Denver" },
  VT: { lat: 44.5588, lon: -72.5778, local_timezone: "America/New_York" },
  VA: { lat: 37.4316, lon: -78.6569, local_timezone: "America/New_York" },
  WA: { lat: 47.7511, lon: -120.7401, local_timezone: "America/Los_Angeles" },
  WV: { lat: 38.5976, lon: -80.4549, local_timezone: "America/New_York" },
  WI: { lat: 43.7844, lon: -88.7879, local_timezone: "America/Chicago" },
  WY: { lat: 43.076, lon: -107.2903, local_timezone: "America/Denver" },
};

const FIXED_ANALYSIS = {
  scored: {
    score: 60,
    band: "Good",
    drivers: [],
    suppressors: [],
  },
  timing: {
    timing_strength: "good",
    highlighted_periods: [false, false, false, false],
  },
  condition_context: {
    temperature_metabolic_context: "neutral",
    temperature_trend: "stable",
    temperature_shock: "none",
  },
  norm: {
    normalized: {
      pressure_regime: { label: "stable_neutral", score: 0 },
      wind_condition: { label: "light", score: 0.2 },
      light_cloud_condition: { label: "mixed", score: 0 },
      precipitation_disruption: { label: "dry_stable", score: 0.1 },
      runoff_flow_disruption: { label: "stable", score: 0.6 },
    },
  },
} as unknown as SharedConditionAnalysis;

function tupleLabel(
  stateCode: string,
  v3Species: RecommenderV3Species,
  regionKey: string,
  month: number,
  context: RecommenderV3Context,
): string {
  return `(stateCode=${stateCode}, v3Species=${v3Species}, regionKey=${regionKey}, month=${month}, context=${context})`;
}

function padMonth(m: number): string {
  return m < 10 ? `0${m}` : `${m}`;
}

Deno.test(
  "computeRecommenderV3: production-reachable STATE_SPECIES_MAP surface returns three unique eligible picks with boolean fallback flag",
  () => {
    const missingRegion = Object.keys(STATE_SPECIES_MAP).filter(
      (sc) => STATE_TO_REGION[sc] === undefined,
    );
    if (missingRegion.length > 0) {
      console.warn(
        `[runRecommenderV3.cartesian] Skipping states with no bulk STATE_TO_REGION entry: ${missingRegion.join(", ")}`,
      );
    }

    for (const stateCode of Object.keys(STATE_SPECIES_MAP).sort()) {
      const speciesMap = STATE_SPECIES_MAP[stateCode];
      if (!speciesMap) continue;

      const regionKey = STATE_TO_REGION[stateCode];
      if (regionKey === undefined) continue;

      const anchor = STATE_REQUEST_ANCHOR[stateCode];
      if (anchor === undefined) {
        throw new Error(
          `Missing STATE_REQUEST_ANCHOR for state ${stateCode} (add lat/lon for this STATE_SPECIES_MAP key).`,
        );
      }

      for (const [legacySpecies, entry] of Object.entries(speciesMap)) {
        const v3Species = toRecommenderV3Species(legacySpecies as SpeciesGroup);
        if (v3Species === null) continue;

        for (const context of entry.contexts) {
          if (!isContextAllowedForRecommenderV3(v3Species, context)) continue;

          for (let month = 1; month <= 12; month++) {
            const req: RecommenderRequest = {
              location: {
                latitude: anchor.lat,
                longitude: anchor.lon,
                state_code: stateCode,
                region_key: regionKey as RegionKey,
                local_date: `2026-${padMonth(month)}-15`,
                local_timezone: anchor.local_timezone,
                month,
              },
              species: toLegacyRecommenderSpecies(v3Species),
              context,
              water_clarity: "stained",
              env_data: {},
            };

            let response;
            try {
              response = computeRecommenderV3(req, FIXED_ANALYSIS);
            } catch (err) {
              throw new Error(
                `computeRecommenderV3 threw ${tupleLabel(stateCode, v3Species, regionKey, month, context)}: ${err}`,
              );
            }

            assertEquals(
              response.lure_recommendations.length,
              3,
              `lure_recommendations.length ${tupleLabel(stateCode, v3Species, regionKey, month, context)}`,
            );
            assertEquals(
              response.fly_recommendations.length,
              3,
              `fly_recommendations.length ${tupleLabel(stateCode, v3Species, regionKey, month, context)}`,
            );

            assert(
              typeof response.used_region_fallback === "boolean",
              `used_region_fallback must be boolean ${tupleLabel(stateCode, v3Species, regionKey, month, context)} (got ${typeof response.used_region_fallback})`,
            );
            assert(
              typeof response.used_state_scoped_row === "boolean",
              `used_state_scoped_row must be boolean ${tupleLabel(stateCode, v3Species, regionKey, month, context)} (got ${typeof response.used_state_scoped_row})`,
            );

            const eligibleLures = new Set(
              response.seasonal_row.eligible_lure_ids as readonly string[],
            );
            const eligibleFlies = new Set(
              response.seasonal_row.eligible_fly_ids as readonly string[],
            );

            for (const rec of response.lure_recommendations) {
              assert(
                eligibleLures.has(rec.id as string),
                `lure id not in seasonal eligible_lure_ids ${tupleLabel(stateCode, v3Species, regionKey, month, context)}: id=${rec.id}`,
              );
            }
            for (const rec of response.fly_recommendations) {
              assert(
                eligibleFlies.has(rec.id as string),
                `fly id not in seasonal eligible_fly_ids ${tupleLabel(stateCode, v3Species, regionKey, month, context)}: id=${rec.id}`,
              );
            }

            const lureIds = response.lure_recommendations.map((r) => r.id);
            const flyIds = response.fly_recommendations.map((r) => r.id);
            assertEquals(
              new Set(lureIds).size,
              lureIds.length,
              `duplicate lure ids ${tupleLabel(stateCode, v3Species, regionKey, month, context)}: ${lureIds.join(",")}`,
            );
            assertEquals(
              new Set(flyIds).size,
              flyIds.length,
              `duplicate fly ids ${tupleLabel(stateCode, v3Species, regionKey, month, context)}: ${flyIds.join(",")}`,
            );
          }
        }
      }
    }
  },
);
