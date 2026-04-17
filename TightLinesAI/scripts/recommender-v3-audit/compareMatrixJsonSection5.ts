/**
 * Compare two matrix review-sheet JSON files (Section 5 verification):
 * - Same top-3 lure/fly ids per scenario
 * - Same scores on each candidate
 * - Count why_chosen text changes
 * - Count scenarios where post adds color_decision (pre missing)
 *
 * Usage:
 *   deno run --allow-read scripts/recommender-v3-audit/compareMatrixJsonSection5.ts \
 *     /path/pre.json /path/post.json
 */
type Candidate = Record<string, unknown>;

/** Top-3 lists only (avoids duplicating top_1 which matches [0]). */
function collectCandidates(actual: Record<string, unknown>): Candidate[] {
  const out: Candidate[] = [];
  for (const key of ["top_3_lures", "top_3_flies"] as const) {
    const arr = actual[key];
    if (Array.isArray(arr)) {
      for (const c of arr) {
        if (c && typeof c === "object") out.push(c as Candidate);
      }
    }
  }
  return out;
}

function stripVolatile(c: Candidate): Record<string, unknown> {
  const { why_chosen: _w, color_decision: _cd, ...rest } = c;
  return rest;
}

function main(prePath: string, postPath: string) {
  const pre = JSON.parse(Deno.readTextFileSync(prePath)) as {
    scenarios: { scenario_id: string; actual_output: Record<string, unknown> }[];
  };
  const post = JSON.parse(Deno.readTextFileSync(postPath)) as {
    scenarios: { scenario_id: string; actual_output: Record<string, unknown> }[];
  };

  const preMap = new Map(pre.scenarios.map((s) => [s.scenario_id, s]));
  let idMismatches = 0;
  let scoreMismatches = 0;
  let whyChanged = 0;
  let colorDecisionAdded = 0;
  let candidatesCompared = 0;

  for (const ps of post.scenarios) {
    const pr = preMap.get(ps.scenario_id);
    if (!pr) continue;
    const preC = collectCandidates(pr.actual_output);
    const postC = collectCandidates(ps.actual_output);
    if (preC.length !== postC.length) {
      console.error(`Length mismatch ${ps.scenario_id}: ${preC.length} vs ${postC.length}`);
      Deno.exit(1);
    }
    for (let i = 0; i < postC.length; i++) {
      const a = preC[i]!;
      const b = postC[i]!;
      candidatesCompared++;
      if (a["id"] !== b["id"]) idMismatches++;
      if (a["score"] !== b["score"]) scoreMismatches++;
      if (a["why_chosen"] !== b["why_chosen"]) whyChanged++;
      if (b["color_decision"] != null && a["color_decision"] == null) {
        colorDecisionAdded++;
      }
      const sa = JSON.stringify(stripVolatile(a));
      const sb = JSON.stringify(stripVolatile(b));
      if (sa !== sb) {
        console.error(
          `Structural diff ${ps.scenario_id} idx=${i} id=${b["id"]}\npre=${sa}\npost=${sb}`,
        );
        Deno.exit(1);
      }
    }
  }

  console.log(JSON.stringify({
    scenarios_compared: post.scenarios.length,
    candidates_compared: candidatesCompared,
    id_mismatches: idMismatches,
    score_mismatches: scoreMismatches,
    why_chosen_changed: whyChanged,
    color_decision_added_vs_pre: colorDecisionAdded,
  }, null, 2));
}

const [prePath, postPath] = Deno.args;
if (!prePath || !postPath) {
  console.error("Usage: compareMatrixJsonSection5.ts <pre.json> <post.json>");
  Deno.exit(1);
}
main(prePath, postPath);
