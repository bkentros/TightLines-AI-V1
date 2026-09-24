// Controlled cross-feature sensitivity probes; no production changes.
// Run: deno run --no-lock --allow-read docs/audits/todays-bite-cross-feature-review-probes-2026-09-23.ts
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { bandFromScore } from "../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts";
import type { RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
function req(
  region: RegionKey,
  month: number,
  species: RecommenderRequest["species"] = "largemouth_bass",
  clarity: RecommenderRequest["water_clarity"] = "clear",
  goal: RecommenderRequest["recommendation_goal"] = "all_purpose",
  t = 65,
): RecommenderRequest {
  return {
    location: {
      latitude: 30,
      longitude: -90,
      state_code: "LA",
      region_key: region,
      local_date: `2026-${String(month).padStart(2, "0")}-15`,
      local_timezone: "America/Chicago",
      month,
    },
    species,
    context: species === "river_trout"
      ? "freshwater_river"
      : "freshwater_lake_pond",
    water_clarity: clarity,
    recommendation_goal: goal,
    env_data: {
      daily_mean_air_temp_f: t,
      prior_day_mean_air_temp_f: t,
      day_minus_2_mean_air_temp_f: t,
      daily_high_air_temp_f: t + 10,
      wind_speed_mph: 5,
      cloud_cover_pct: 20,
      pressure_history_mb: Array.from(
        { length: 25 },
        (_, i) => 1015 - 3 * i / 24,
      ),
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0,
      precip_rate_now_in_per_hr: 0,
      active_precip_now: false,
    },
  };
}
function run(
  r: RecommenderRequest,
  overrideScore?: number,
  analysisOverride?: ReturnType<typeof analyzeRecommenderConditions>,
) {
  const analysis = analysisOverride ?? analyzeRecommenderConditions(r);
  const seasonalRow = resolveDailyPicksSeasonalRow({
    species: r.species,
    region_key: r.location.region_key,
    month: r.location.month,
    water_type: r.context,
  });
  return runDailyPicksEngine({
    req: r,
    analysis: overrideScore == null ? analysis : {
      ...analysis,
      scored: {
        ...analysis.scored,
        score: overrideScore,
        band: bandFromScore(overrideScore),
      },
    },
    seasonalRow,
    seed: "cross-feature-review-fixed-seed",
    variant: "A",
  });
}
function brief(x: ReturnType<typeof run>) {
  return {
    score: x.scenario.hows_score,
    confidence: x.scenario.confidence,
    pressure: x.scenario.pressure_mode,
    activity: x.scenario.activity_level,
    thermal: x.scenario.thermal_mode,
    surface: x.scenario.surface_daily_gate,
    reasons: x.scenario.surface_daily_reason_codes,
    tags: x.scenario.scenario_tags,
    lures: x.diagnostics.selected_lure_ids,
    flies: x.diagnostics.selected_fly_ids,
    pools: [x.candidate_pool.lures.length, x.candidate_pool.flies.length],
  };
}
const pairs = [[35, 36], [69, 70], [79, 80], [75, 76]];
const counts = pairs.map(([a, b]) => ({
  pair: `${a}->${b}`,
  rows: 0,
  selection: 0,
  pool: 0,
  rankingScores: 0,
  surface: 0,
  thermal: 0,
  tags: 0,
  examples: [] as unknown[],
}));
let skippedMissingRows = 0;
for (
  const region of [
    "florida",
    "gulf_coast",
    "south_central",
    "southeast_atlantic",
  ] as RegionKey[]
) {
  for (const month of [1, 3, 11]) {
    for (
      const species of [
        "largemouth_bass",
        "smallmouth_bass",
        "pike_musky",
        "river_trout",
      ] as RecommenderRequest["species"][]
    ) {
      for (const clarity of ["clear", "stained", "dirty"] as const) {
        for (const goal of ["all_purpose", "big_fish"] as const) {
          const r = req(region, month, species, clarity, goal);
          try {
            const analysis = analyzeRecommenderConditions(r);
            for (let p = 0; p < pairs.length; p++) {
              const [a, b] = pairs[p];
              const x = run(r, a, analysis),
                y = run(r, b, analysis),
                xb = brief(x),
                yb = brief(y),
                c = counts[p];
              c.rows++;
              const changed = JSON.stringify([xb.lures, xb.flies]) !==
                JSON.stringify([yb.lures, yb.flies]);
              if (changed) c.selection++;
              if (
                JSON.stringify([
                  x.candidate_pool.lures.map((z) => z.profile.id),
                  x.candidate_pool.flies.map((z) => z.profile.id),
                ]) !== JSON.stringify([
                  y.candidate_pool.lures.map((z) => z.profile.id),
                  y.candidate_pool.flies.map((z) => z.profile.id),
                ])
              ) c.pool++;
              if (
                JSON.stringify([x.lure_scores, x.fly_scores]) !==
                  JSON.stringify([y.lure_scores, y.fly_scores])
              ) {
                c.rankingScores++;
              }
              if (xb.surface !== yb.surface) c.surface++;
              if (xb.thermal !== yb.thermal) c.thermal++;
              if (JSON.stringify(xb.tags) !== JSON.stringify(yb.tags)) c.tags++;
              if (changed && c.examples.length < 2) {
                c.examples.push({
                  region,
                  month,
                  species,
                  clarity,
                  goal,
                  before: xb,
                  after: yb,
                });
              }
            }
          } catch (e) {
            if (
              e instanceof Error &&
              e.name === "DailyPicksSeasonalRowMissingError"
            ) skippedMissingRows++;
            else throw e;
          }
        }
      }
    }
  }
}
console.log("SCORE_ONLY", JSON.stringify({ counts, skippedMissingRows }));
for (const region of ["south_central", "gulf_coast"] as RegionKey[]) {
  for (
    const species of (region === "gulf_coast"
      ? ["largemouth_bass"]
      : ["largemouth_bass", "pike_musky", "river_trout"]) as RecommenderRequest[
        "species"
      ][]
  ) {
    const r = req(
      region,
      1,
      species,
      "clear",
      "all_purpose",
      region === "south_central" ? 65 : 75,
    );
    const analysis = analyzeRecommenderConditions(r);
    console.log(
      "WINTER_WARM",
      JSON.stringify({
        region,
        species,
        air: r.env_data.daily_mean_air_temp_f,
        temp: analysis.norm.normalized.temperature,
        result: brief(run(r)),
      }),
    );
  }
}
for (const t of [58.77, 58.78, 60, 65, 68]) {
  const r = req("florida", 11, "largemouth_bass", "clear", "all_purpose", t);
  const a = analyzeRecommenderConditions(r);
  console.log(
    "FLORIDA_REPAIR",
    JSON.stringify({
      t,
      temp: a.norm.normalized.temperature,
      result: brief(run(r)),
    }),
  );
}
for (
  const region of [
    "midwest_interior",
    "gulf_coast",
    "south_central",
  ] as RegionKey[]
) {
  const r = req(region, 11);
  const x = run(r);
  console.log(
    "REGION",
    JSON.stringify({
      region,
      row: {
        column: x.row.column_range,
        pace: x.row.pace_range,
        forage: x.row.primary_forage,
        surface: x.row.surface_seasonally_possible,
      },
      result: brief(x),
    }),
  );
}
const reference = req("south_central", 11);
const original = analyzeRecommenderConditions(reference);
const before = brief(run(reference, undefined, original));
const modified = structuredClone(original);
modified.norm.reliability = "low";
console.log(
  "CONFIDENCE_ONLY",
  JSON.stringify({
    before,
    after: brief(run(reference, undefined, modified)),
    note:
      "Final score held fixed; confidence differs but ranking inputs do not.",
  }),
);
const pressureModified = structuredClone(original);
if (pressureModified.norm.normalized.pressure_regime) {
  pressureModified.norm.normalized.pressure_regime.label = "volatile";
}
console.log(
  "PRESSURE_LABEL_ONLY",
  JSON.stringify({
    before,
    after: brief(run(reference, undefined, pressureModified)),
    note: "Final score and other normalized data held fixed.",
  }),
);

const warmReq = req(
  "south_central",
  1,
  "largemouth_bass",
  "clear",
  "all_purpose",
  65,
);
const warmAnalysis = analyzeRecommenderConditions(warmReq);
const correctedLabel = structuredClone(warmAnalysis);
correctedLabel.norm.normalized.temperature!.band_label = "warm";
console.log(
  "WARM_LABEL_SENSITIVITY",
  JSON.stringify({
    before: brief(run(warmReq, undefined, warmAnalysis)),
    after: brief(run(warmReq, undefined, correctedLabel)),
    note:
      "Only band label changed, to demonstrate the consumer contract; not a proposed thermal calibration.",
  }),
);
const repairReq = req(
  "florida",
  11,
  "largemouth_bass",
  "clear",
  "all_purpose",
  60,
);
const repairAnalysis = analyzeRecommenderConditions(repairReq);
const unboosted = structuredClone(repairAnalysis);
unboosted.norm.normalized.temperature!.final_score = -1.44;
console.log(
  "REPAIR_FIELD_SENSITIVITY",
  JSON.stringify({
    before: brief(run(repairReq, undefined, repairAnalysis)),
    after: brief(run(repairReq, undefined, unboosted)),
    note:
      "Only normalized thermal score restored to its pre-repair value; composite score held fixed.",
  }),
);
