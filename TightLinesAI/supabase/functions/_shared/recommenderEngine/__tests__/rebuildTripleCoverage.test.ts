import { assertEquals } from "jsr:@std/assert";
import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import { computeRecommenderRebuild } from "../rebuild/runRecommenderRebuild.ts";
import type { RecommenderV4Species, SeasonalRowV4 } from "../v4/contracts.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/largemouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/northern_pike.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/smallmouth_bass.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/trout.ts";

const ROWS: readonly SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
];

const SPECIES_TO_LEGACY: Record<RecommenderV4Species, SpeciesGroup> = {
  largemouth_bass: "largemouth_bass",
  smallmouth_bass: "smallmouth_bass",
  northern_pike: "pike_musky",
  trout: "river_trout",
};

function analysisForScore(score: number): SharedConditionAnalysis {
  return {
    scored: { score },
    norm: {
      normalized: {
        light_cloud_condition: { label: "mixed" },
        temperature: {
          band_label: "mild",
          trend_label: "stable",
          shock_label: "none",
        },
        runoff_flow_disruption: { label: "stable" },
      },
    },
  } as unknown as SharedConditionAnalysis;
}

function requestForRow(args: {
  row: SeasonalRowV4;
  clarity: RecommenderRequest["water_clarity"];
  windMph: number;
}): RecommenderRequest {
  const { row, clarity, windMph } = args;
  return {
    location: {
      latitude: 40,
      longitude: -90,
      state_code: "ZZ",
      region_key: row.region_key,
      local_date: `2026-${String(row.month).padStart(2, "0")}-15`,
      local_timezone: "America/New_York",
      month: row.month,
    },
    species: SPECIES_TO_LEGACY[row.species],
    context: row.water_type,
    water_clarity: clarity,
    env_data: { wind_speed_mph: windMph },
  };
}

Deno.test("rebuild: every generated seasonal row returns a full 3:3 lure/fly set", () => {
  const gaps: string[] = [];

  for (const row of ROWS) {
    for (const clarity of ["clear", "stained", "dirty"] as const) {
      for (
        const regime of [
          { label: "suppressive", score: 20 },
          { label: "neutral", score: 55 },
          { label: "aggressive", score: 85 },
        ] as const
      ) {
        for (
          const wind of [
            { label: "low_wind", mph: 5 },
            { label: "surface_block_wind", mph: 16 },
          ] as const
        ) {
          const result = computeRecommenderRebuild(
            requestForRow({ row, clarity, windMph: wind.mph }),
            analysisForScore(regime.score),
          );

          if (
            result.lureSlotPicks.length !== 3 ||
            result.flySlotPicks.length !== 3
          ) {
            gaps.push(
              [
                row.species,
                row.region_key,
                row.water_type,
                `m${row.month}`,
                clarity,
                regime.label,
                wind.label,
                `lures=${result.lureSlotPicks.length}`,
                `flies=${result.flySlotPicks.length}`,
              ].join("|"),
            );
          }
        }
      }
    }
  }

  assertEquals(gaps, []);
});
