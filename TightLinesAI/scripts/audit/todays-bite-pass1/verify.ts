/** Attribute every replay difference. Requires an untouched archive of baseline_commit.
 * deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/verify.ts /tmp/todays-bite-pass1-original/TightLinesAI/supabase/functions/_shared
 */
const dir = "docs/audits/todays-bite-pass1";
const prefix = Deno.args.includes("--boundaries") ? "boundaries-" : "";
if (!Deno.args[0]) throw Error("Provide baseline _shared archive path");
const oldRoot = new URL(`file://${Deno.args[0].replace(/\/$/, "")}/`);
const { runHowFishingReport } = await import(
  new URL("howFishingEngine/runHowFishingReport.ts", oldRoot).href
);
const { analyzeSharedConditions } = await import(
  new URL("howFishingEngine/analyzeSharedConditions.ts", oldRoot).href
);
const { runDailyPicksSurface } = await import(
  new URL("recommenderEngine/dailyPicks/runDailyPicksSurface.ts", oldRoot).href
);
const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);
async function* records(name: string): AsyncGenerator<any> {
  const manifest = JSON.parse(
    await Deno.readTextFile(`${dir}/${prefix}${name}.manifest.json`),
  );
  const bytes = await Deno.readFile(`${dir}/${prefix}${name}.jsonl.gz`);
  const hash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
  ).map((x) => x.toString(16).padStart(2, "0")).join("");
  if (hash !== manifest.sha256) throw Error(`${name} checksum mismatch`);
  const file = await Deno.open(`${dir}/${prefix}${name}.jsonl.gz`);
  let pending = "";
  for await (
    const chunk of file.readable.pipeThrough(new DecompressionStream("gzip"))
      .pipeThrough(new TextDecoderStream())
  ) {
    pending += chunk;
    let idx: number;
    while ((idx = pending.indexOf("\n")) >= 0) {
      yield JSON.parse(pending.slice(0, idx));
      pending = pending.slice(idx + 1);
    }
  }
  if (pending.trim()) throw Error("Unterminated baseline record");
}
const stats = {
  fixtures: 0,
  unchanged_reports: 0,
  changed_reports: 0,
  changed_scores: 0,
  changed_bands: 0,
  changed_timing: 0,
  changed_reliability: 0,
  geographic_changes: 0,
  pressure_window_changes: 0,
  unaffected_reports_exact: 0,
  report_counterfactual_exact: 0,
  baseline_recommendations: 0,
  candidate_recommendations: 0,
  added_recommendations: 0,
  lost_recommendations: 0,
  changed_recommendation_responses: 0,
  changed_selected_picks: 0,
  recommendations_matching_corrected_inputs: 0,
  recommendations_changed_by_thermal_semantics: 0,
  unexplained_changes: 0,
};
const examples: any[] = [];
const geoChanges: Record<string, unknown> = {};
const a = records("baseline");
const b = records("candidate");
while (true) {
  const [aa, bb] = await Promise.all([a.next(), b.next()]);
  if (aa.done || bb.done) {
    if (aa.done !== bb.done) throw Error("Fixture counts differ");
    break;
  }
  const before = aa.value, after = bb.value;
  if (before.id !== after.id) throw Error("Fixture IDs differ");
  stats.fixtures++;
  const geographic = before.input.region_key !== after.input.region_key ||
    before.input.state_code !== after.input.state_code;
  const pressure =
    (after.input.environment.pressure_history_mb?.length ?? 0) > 25;
  if (geographic) {
    stats.geographic_changes++;
    geoChanges[after.id.split("|")[1]] = {
      before: {
        state: before.input.state_code,
        region: before.input.region_key,
      },
      after: { state: after.input.state_code, region: after.input.region_key },
    };
  }
  if (pressure) stats.pressure_window_changes++;
  if (same(before.report, after.report)) stats.unchanged_reports++;
  else stats.changed_reports++;
  if (before.report.score !== after.report.score) stats.changed_scores++;
  if (before.report.band !== after.report.band) stats.changed_bands++;
  if (
    !same([
      before.report.highlighted_periods,
      before.report.daypart_note,
      before.report.daypart_preset,
      before.report.timing_strength,
    ], [
      after.report.highlighted_periods,
      after.report.daypart_note,
      after.report.daypart_preset,
      after.report.timing_strength,
    ])
  ) stats.changed_timing++;
  if (before.report.reliability !== after.report.reliability) {
    stats.changed_reliability++;
  }
  if (!geographic && !pressure) {
    if (!same(before.report, after.report)) {
      throw Error(`Unexplained report change ${after.id}`);
    }
    stats.unaffected_reports_exact++;
  }
  // Original engine + corrected location + exactly 24h of hourly pressure must
  // reproduce the ENTIRE new report, including wording, timing, confidence, and debug.
  const corrected = structuredClone(after.input);
  if (corrected.environment.pressure_history_mb) {
    corrected.environment.pressure_history_mb = corrected.environment
      .pressure_history_mb.slice(-25).filter((x: unknown) =>
        typeof x === "number" && Number.isFinite(x)
      );
  }
  const expected = runHowFishingReport(corrected);
  if (!same(expected, after.report)) {
    throw Error(`Counterfactual report mismatch ${after.id}`);
  }
  stats.report_counterfactual_exact++;
  const analysis = analyzeSharedConditions(corrected);
  stats.baseline_recommendations += before.recommendations.length;
  stats.candidate_recommendations += after.recommendations.length;
  for (const rec of before.recommendations) {
    if (
      !after.recommendations.some((x: any) =>
        x.species === rec.species && x.goal === rec.goal
      )
    ) {
      stats.lost_recommendations++;
      throw Error(`Lost coverage ${after.id} ${rec.species}`);
    }
  }
  for (const rec of after.recommendations) {
    const previous = before.recommendations.find((x: any) =>
      x.species === rec.species && x.goal === rec.goal
    );
    if (!previous) stats.added_recommendations++;
    else {
      if (!same(previous.response, rec.response)) {
        stats.changed_recommendation_responses++;
      }
      const picks = (
        r: any,
      ) => [r.diagnostics.selected_lure_ids, r.diagnostics.selected_fly_ids];
      if (!same(picks(previous.response), picks(rec.response))) {
        stats.changed_selected_picks++;
      }
    }
    const req = {
      location: {
        latitude: corrected.latitude,
        longitude: corrected.longitude,
        state_code: corrected.state_code ?? "TN",
        region_key: corrected.region_key,
        local_date: corrected.local_date,
        local_timezone: corrected.local_timezone,
        month: Number(corrected.local_date.slice(5, 7)),
      },
      species: rec.species,
      context: corrected.context,
      water_clarity: rec.goal === "all_purpose" ? "clear" : "stained",
      recommendation_goal: rec.goal,
      env_data: corrected.environment,
    };
    const expectedRec = runDailyPicksSurface(req, {
      seed: `pass1|${after.id}|${rec.species}|${rec.goal}`,
      variant: "A",
      analysis,
    });
    if (same(expectedRec, rec.response)) {
      stats.recommendations_matching_corrected_inputs++;
    } else {
      const t = analysis.norm.normalized.temperature;
      if (t?.band_label !== "very_warm" || !(t.final_score > .5)) {
        throw Error(
          `Unexplained recommender change ${after.id} ${rec.species}`,
        );
      }
      if (
        rec.response.scenario_summary.scenario_tags.includes("heat_finesse")
      ) {
        throw Error(`Favorable seasonal warmth still heat-limited ${after.id}`);
      }
      stats.recommendations_changed_by_thermal_semantics++;
    }
  }
  if (
    (geographic && after.id.includes("|1|freshwater_lake_pond")) ||
    (after.id ===
      "south_central|1|freshwater_lake_pond|0|stable_winter_warm") ||
    (after.id === "florida|1|freshwater_lake_pond|0|pressure_48h")
  ) {
    examples.push({
      id: after.id,
      before: {
        score: before.report.score,
        band: before.report.band,
        temperature: before.normalized.normalized.temperature,
        pressure: before.normalized.normalized.pressure_regime,
        scenario: before.recommendations[0]?.response.scenario_summary,
        picks: before.recommendations[0]?.response.diagnostics,
      },
      after: {
        score: after.report.score,
        band: after.report.band,
        temperature: after.normalized.normalized.temperature,
        pressure: after.normalized.normalized.pressure_regime,
        scenario: after.recommendations[0]?.response.scenario_summary,
        picks: after.recommendations[0]?.response.diagnostics,
      },
    });
  }
  if (stats.fixtures % 4000 === 0) console.log(`verified ${stats.fixtures}`);
}
const result = { stats, geographic_changes: geoChanges, examples };
await Deno.writeTextFile(
  `${dir}/${prefix}comparison.json`,
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(stats));
