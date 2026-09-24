/** Prove Pass 2 pick changes come from shared conditions, not changed ranking/catalog code. */
import { analyzeSharedConditions } from "../../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
const archive = Deno.args[0];
if (!archive) throw Error("Pass the preserved Pass 1 _shared path");
const { runDailyPicksSurface } = await import(
  `file://${archive}/recommenderEngine/dailyPicks/runDailyPicksSurface.ts`
);
let sets = 0, fixtures = 0;
for (const prefix of ["", "boundaries-"]) {
  const file = await Deno.open(
    `docs/audits/todays-bite-pass2/${prefix}candidate.jsonl.gz`,
  );
  let pending = "";
  for await (
    const chunk of file.readable.pipeThrough(new DecompressionStream("gzip"))
      .pipeThrough(new TextDecoderStream())
  ) {
    pending += chunk;
    let index: number;
    while ((index = pending.indexOf("\n")) >= 0) {
      const row = JSON.parse(pending.slice(0, index));
      pending = pending.slice(index + 1);
      fixtures++;
      if (!row.recommendations.length) continue;
      const req = row.input;
      const analysis = analyzeSharedConditions(req);
      for (const rec of row.recommendations) {
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
          species: rec.species,
          context: req.context,
          water_clarity: rec.goal === "all_purpose" ? "clear" : "stained",
          recommendation_goal: rec.goal,
          env_data: req.environment,
        };
        const actual = runDailyPicksSurface(request, {
          seed: `pass1|${row.id}|${rec.species}|${rec.goal}`,
          variant: "A",
          analysis,
        });
        if (JSON.stringify(actual) !== JSON.stringify(rec.response)) {
          throw Error(
            `Unattributed recommendation change: ${row.id}/${rec.species}/${rec.goal}`,
          );
        }
        sets++;
      }
    }
  }
  if (pending.trim()) throw Error("Truncated artifact");
}
const result = {
  fixtures,
  recommendation_sets: sets,
  pass1_recommender_with_pass2_analysis_exact_matches: sets,
  unattributed_changes: 0,
};
await Deno.writeTextFile(
  "docs/audits/todays-bite-pass2/recommender-parity.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(result);
