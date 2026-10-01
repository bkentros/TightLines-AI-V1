/** Shadow experiment only: restores production weights before every next fixture. */
import { BASE_WEIGHTS } from "../../../supabase/functions/_shared/howFishingEngine/config/baseWeights.ts";
import { analyzeSharedConditions } from "../../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { runDailyPicksSurface } from "../../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksSurface.ts";
import { fixtures } from "../todays-bite-pass1/fixtures.ts";
import { resolveRegionForCoordinates } from "../../../supabase/functions/_shared/howFishingEngine/context/resolveRegion.ts";
const counts = {
  fixtures: 0,
  changed_scores: 0,
  max_absolute_change: 0,
  absolute_delta_sum: 0,
  crossed_activity_70: 0,
  crossed_prime_80: 0,
  recommendation_sets: 0,
  changed_picks: 0,
  changed_activity: 0,
};
for (const fixture of fixtures()) {
  const req = structuredClone(fixture.request);
  if (fixture.city) {
    Object.assign(
      req,
      resolveRegionForCoordinates(req.latitude, req.longitude),
    );
  }
  const base = analyzeSharedConditions(req);
  const weights = BASE_WEIGHTS[req.context];
  const pressure = weights.pressure_regime!;
  let shadow: ReturnType<typeof analyzeSharedConditions>;
  try {
    weights.pressure_regime = pressure * .75;
    shadow = analyzeSharedConditions(req);
  } finally {
    weights.pressure_regime = pressure;
  }
  const delta = Math.abs(base.scored.score - shadow.scored.score);
  counts.fixtures++;
  counts.changed_scores += Number(delta !== 0);
  counts.absolute_delta_sum += delta;
  counts.max_absolute_change = Math.max(counts.max_absolute_change, delta);
  counts.crossed_activity_70 += Number(
    (base.scored.score >= 70) !== (shadow.scored.score >= 70),
  );
  counts.crossed_prime_80 += Number(
    (base.scored.score >= 80) !== (shadow.scored.score >= 80),
  );
  if (fixture.offset !== 0 || req.context.startsWith("coastal")) continue;
  for (
    const species of [
      "largemouth_bass",
      "smallmouth_bass",
      "pike_musky",
      "river_trout",
    ] as const
  ) {
    if (species === "river_trout" && req.context !== "freshwater_river") {
      continue;
    }
    for (const goal of ["all_purpose", "big_fish"] as const) {
      const request = {
        location: {
          latitude: req.latitude,
          longitude: req.longitude,
          state_code: req.state_code ?? "TN",
          region_key: req.region_key,
          local_date: req.local_date,
          local_timezone: req.local_timezone,
          month: Number(req.local_date.slice(5, 7)),
        },
        species,
        context: req.context,
        water_clarity: goal === "all_purpose"
          ? "clear" as const
          : "stained" as const,
        recommendation_goal: goal,
        env_data: req.environment,
      };
      try {
        const before = runDailyPicksSurface(request, {
          seed: `sensitivity|${fixture.id}|${species}|${goal}`,
          variant: "A",
          analysis: base,
        });
        const after = runDailyPicksSurface(request, {
          seed: `sensitivity|${fixture.id}|${species}|${goal}`,
          variant: "A",
          analysis: shadow,
        });
        counts.recommendation_sets++;
        counts.changed_activity += Number(
          before.scenario_summary.activity_level !==
            after.scenario_summary.activity_level,
        );
        counts.changed_picks += Number(
          JSON.stringify(Object.values(before.picks).map((p) => p.id)) !==
            JSON.stringify(Object.values(after.picks).map((p) => p.id)),
        );
      } catch (e) {
        if (
          !(e instanceof Error) ||
          e.name !== "DailyPicksSeasonalRowMissingError"
        ) throw e;
      }
    }
  }
}
const result = {
  experiment:
    "Reduce base pressure weights by 25%; renormalize remaining contributions. Synthetic sensitivity, not outcome validation.",
  decision:
    "Retain production pressure weights pending catch-outcome validation.",
  ...counts,
};
await Deno.writeTextFile(
  "docs/audits/todays-bite-pass2/pressure-sensitivity.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(result);
