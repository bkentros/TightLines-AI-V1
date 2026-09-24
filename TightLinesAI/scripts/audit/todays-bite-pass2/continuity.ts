import { CANONICAL_REGION_KEYS } from "../../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import { contexts, makeRequest } from "../todays-bite-pass1/fixtures.ts";
import { analyzeSharedConditions as current } from "../../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
const archive = Deno.args[0];
if (!archive) throw Error("Pass the preserved Pass 1 _shared path");
const { analyzeSharedConditions: previous } = await import(
  `file://${archive}/howFishingEngine/analyzeSharedConditions.ts`
);
const deltas: {
  before: number;
  after: number;
  thermalBefore: number;
  thermalAfter: number;
  region: string;
  month: number;
  context: string;
  temperature: number;
}[] = [];
for (const region of CANONICAL_REGION_KEYS) {
  for (const context of contexts) {
    for (let month = 1; month <= 12; month++) {
      for (let t = 35; t <= 85; t += 2) {
        const req = makeRequest(region, month, 0, "stable", context);
        const env = req.environment;
        env.daily_mean_air_temp_f = t;
        env.prior_day_mean_air_temp_f = t;
        env.day_minus_2_mean_air_temp_f = t;
        if (context.startsWith("coastal")) {
          env.measured_water_temp_f = t;
          env.measured_water_temp_24h_ago_f = t;
          env.measured_water_temp_72h_ago_f = t;
        }
        const dates = [
          new Date(Date.UTC(2026, month, 0)),
          new Date(Date.UTC(2026, month, 1)),
        ].map((d) => d.toISOString().slice(0, 10));
        const results = [previous, current].map((fn) =>
          dates.map((date) => {
            const r = structuredClone(req);
            r.local_date = date;
            r.environment.sunrise_local = `${date}T07:00:00`;
            r.environment.sunset_local = `${date}T18:00:00`;
            const a = fn(r);
            return {
              score: a.scored.score,
              thermal: a.norm.normalized.temperature?.final_score ?? 0,
            };
          })
        );
        deltas.push({
          region,
          month,
          context,
          temperature: t,
          before: Math.abs(results[0][1].score - results[0][0].score),
          after: Math.abs(results[1][1].score - results[1][0].score),
          thermalBefore: Math.abs(
            results[0][1].thermal - results[0][0].thermal,
          ),
          thermalAfter: Math.abs(results[1][1].thermal - results[1][0].thermal),
        });
      }
    }
  }
}
const summary = (
  key: "before" | "after" | "thermalBefore" | "thermalAfter",
) => {
  const values = deltas.map((d) => d[key]).sort((a, b) => a - b);
  return {
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    p95: values[Math.floor(values.length * .95)],
    max: values.at(-1),
    over10: values.filter((v) => v > 10).length,
  };
};
const result = {
  pairs: deltas.length,
  before: summary("before"),
  after: summary("after"),
  thermalBefore: summary("thermalBefore"),
  thermalAfter: summary("thermalAfter"),
  largest_remaining: [...deltas].sort((a, b) => b.after - a.after).slice(0, 20),
  regressions: deltas.filter((d) => d.after > d.before + 3).length,
  worse_by_more_than_3: deltas.filter((d) => d.after > d.before + 3),
};
await Deno.writeTextFile(
  Deno.args[1] ?? "docs/audits/todays-bite-pass2/continuity.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result));

if (
  result.after.max! > 3 || result.regressions !== 0 ||
  result.after.mean >= result.before.mean
) throw Error("Month-boundary continuity guardrail failed");
