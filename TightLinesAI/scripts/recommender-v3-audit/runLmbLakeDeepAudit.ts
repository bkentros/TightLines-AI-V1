#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * runLmbLakeDeepAudit.ts
 *
 * Deep quantitative audit over LMB lake/pond archive scenarios: variety, score
 * separation, component shares on winners, clarity-sweep behavior, and per-archetype
 * win profiles. Use this to tune `archetypeConditionWeights`, clarity fit, guardrails,
 * and eligibility — not as a pass/fail gate unless you add expectations later.
 *
 * Requires: docs/recommender-v3-audit/generated/lmb-lake-viewer-archive-env.json
 *
 * Usage:
 *   deno run --allow-read --allow-write \
 *     scripts/recommender-v3-audit/runLmbLakeDeepAudit.ts
 *
 * Outputs:
 *   docs/recommender-v3-audit/generated/lmb-lake-deep-audit.json
 *   docs/recommender-v3-audit/generated/lmb-lake-deep-audit.md
 */

import {
  runRecommenderV3,
  type RecommenderRequest,
} from "../../supabase/functions/_shared/recommenderEngine/index.ts";
import type { ArchiveBatchBundle, ArchiveScenarioBundle } from "./archiveBundle.ts";
import { LMB_LAKE_VIEWER_SCENARIOS } from "./lmbLakeViewerScenarios.ts";

const ARCHIVE_PATH = "docs/recommender-v3-audit/generated/lmb-lake-viewer-archive-env.json";
const OUT_JSON = "docs/recommender-v3-audit/generated/lmb-lake-deep-audit.json";
const OUT_MD = "docs/recommender-v3-audit/generated/lmb-lake-deep-audit.md";

type RankedLite = {
  id: string;
  family_key: string;
  tactical_lane: string;
  score: number;
  water_column_fit: number;
  posture_fit: number;
  presentation_fit: number;
  forage_bonus: number;
  daily_condition_fit: number;
  clarity_fit: number;
  guardrail_penalty: number;
};

type ScenarioRecord = {
  scenario_id: string;
  region_key: string;
  region_label: string;
  month: number;
  local_date: string;
  water_clarity: string;
  lure_top1: RankedLite;
  lure_top3: RankedLite[];
  fly_top1: RankedLite;
  fly_top3: RankedLite[];
  lure_spread_1_3: number;
  fly_spread_1_3: number;
  lure_top3_duplicate_family: boolean;
  fly_top3_duplicate_family: boolean;
  variables_triggered: string[];
  posture_band: string;
  posture_score_10: number;
};

function toRankedLite(r: {
  id: string;
  family_key: string;
  tactical_lane: string;
  score: number;
  water_column_fit: number;
  posture_fit: number;
  presentation_fit: number;
  forage_bonus: number;
  daily_condition_fit: number;
  clarity_fit: number;
  guardrail_penalty: number;
}): RankedLite {
  return {
    id: r.id,
    family_key: r.family_key,
    tactical_lane: r.tactical_lane,
    score: r.score,
    water_column_fit: r.water_column_fit,
    posture_fit: r.posture_fit,
    presentation_fit: r.presentation_fit,
    forage_bonus: r.forage_bonus,
    daily_condition_fit: r.daily_condition_fit,
    clarity_fit: r.clarity_fit,
    guardrail_penalty: r.guardrail_penalty,
  };
}

function duplicateFamilyInTop3(rows: RankedLite[]): boolean {
  const fam = rows.map((r) => r.family_key);
  return new Set(fam).size < fam.length;
}

function shannonEntropy(counts: Map<string, number>): number {
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let h = 0;
  for (const c of counts.values()) {
    const p = c / total;
    h -= p * Math.log2(p);
  }
  return h;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(
    sorted.length - 1,
    Math.floor((p / 100) * (sorted.length - 1)),
  );
  return sorted[idx]!;
}

function median(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[m]!
    : (sorted[m - 1]! + sorted[m]!) / 2;
}

function buildReq(
  scenario: (typeof LMB_LAKE_VIEWER_SCENARIOS)[number],
  bundle: ArchiveScenarioBundle,
): RecommenderRequest {
  return {
    location: {
      latitude: scenario.latitude,
      longitude: scenario.longitude,
      state_code: scenario.state_code,
      region_key: bundle.location.region_key,
      local_date: scenario.local_date,
      local_timezone: scenario.timezone,
      month: bundle.location.month,
    },
    species: "largemouth_bass",
    context: scenario.context,
    water_clarity: scenario.water_clarity,
    env_data: (bundle.shared_environment ?? {}) as Record<string, unknown>,
  };
}

if (import.meta.main) {
  const raw = await Deno.readTextFile(ARCHIVE_PATH);
  const archiveBundle = JSON.parse(raw) as ArchiveBatchBundle;
  const bundleMap = new Map(
    archiveBundle.scenarios.map((s) => [s.scenario_id, s]),
  );

  const records: ScenarioRecord[] = [];
  let skipped = 0;

  for (const scenario of LMB_LAKE_VIEWER_SCENARIOS) {
    const bundle = bundleMap.get(scenario.id);
    if (!bundle || bundle.status !== "ready" || !bundle.shared_environment) {
      skipped += 1;
      continue;
    }
    const req = buildReq(scenario, bundle);
    const rawRes = runRecommenderV3(req);
    const l3 = rawRes.lure_recommendations.slice(0, 3).map(toRankedLite);
    const f3 = rawRes.fly_recommendations.slice(0, 3).map(toRankedLite);
    const dp = rawRes.daily_payload;

    records.push({
      scenario_id: scenario.id,
      region_key: bundle.location.region_key,
      region_label: scenario.region_label,
      month: bundle.location.month,
      local_date: scenario.local_date,
      water_clarity: scenario.water_clarity,
      lure_top1: l3[0]!,
      lure_top3: l3,
      fly_top1: f3[0]!,
      fly_top3: f3,
      lure_spread_1_3: (l3[0]?.score ?? 0) - (l3[2]?.score ?? 0),
      fly_spread_1_3: (f3[0]?.score ?? 0) - (f3[2]?.score ?? 0),
      lure_top3_duplicate_family: duplicateFamilyInTop3(l3),
      fly_top3_duplicate_family: duplicateFamilyInTop3(f3),
      variables_triggered: [...dp.variables_triggered],
      posture_band: dp.posture_band,
      posture_score_10: dp.posture_band === "aggressive"
        ? 9
        : dp.posture_band === "slightly_aggressive"
        ? 7
        : dp.posture_band === "neutral"
        ? 5
        : dp.posture_band === "slightly_suppressed"
        ? 3
        : 1,
    });
  }

  const n = records.length;
  const lureTop1Counts = new Map<string, number>();
  const flyTop1Counts = new Map<string, number>();

  for (const r of records) {
    lureTop1Counts.set(
      r.lure_top1.id,
      (lureTop1Counts.get(r.lure_top1.id) ?? 0) + 1,
    );
    flyTop1Counts.set(
      r.fly_top1.id,
      (flyTop1Counts.get(r.fly_top1.id) ?? 0) + 1,
    );
  }

  const lureEntropy = shannonEntropy(lureTop1Counts);
  const flyEntropy = shannonEntropy(flyTop1Counts);
  const lureEffective = Math.pow(2, lureEntropy);
  const flyEffective = Math.pow(2, flyEntropy);

  const lureSpreads = records.map((r) => r.lure_spread_1_3).sort((a, b) => a - b);
  const flySpreads = records.map((r) => r.fly_spread_1_3).sort((a, b) => a - b);

  const shareDaily = records.map((r) => {
    const s = r.lure_top1.score;
    return s > 0.05 ? r.lure_top1.daily_condition_fit / s : 0;
  }).sort((a, b) => a - b);
  const shareClarity = records.map((r) => {
    const s = r.lure_top1.score;
    return s > 0.05 ? r.lure_top1.clarity_fit / s : 0;
  }).sort((a, b) => a - b);

  const byRegion = new Map<
    string,
    { count: number; lureTop1: Map<string, number> }
  >();
  for (const r of records) {
    let g = byRegion.get(r.region_key);
    if (!g) {
      g = { count: 0, lureTop1: new Map() };
      byRegion.set(r.region_key, g);
    }
    g.count += 1;
    const id = r.lure_top1.id;
    g.lureTop1.set(id, (g.lureTop1.get(id) ?? 0) + 1);
  }

  const regionEntropy = [...byRegion.entries()].map(([rk, g]) => ({
    region_key: rk,
    scenario_count: g.count,
    lure_top1_entropy: shannonEntropy(g.lureTop1),
    lure_effective_choices: Math.pow(2, shannonEntropy(g.lureTop1)),
  }));

  /** When archetype is lure #1, aggregate components (for tuning lane/delta). */
  const lureWinStats = new Map<
    string,
    {
      wins: number;
      sum_daily: number;
      sum_clarity: number;
      sum_score: number;
      lanes: Map<string, number>;
    }
  >();

  for (const r of records) {
    const id = r.lure_top1.id;
    let s = lureWinStats.get(id);
    if (!s) {
      s = { wins: 0, sum_daily: 0, sum_clarity: 0, sum_score: 0, lanes: new Map() };
      lureWinStats.set(id, s);
    }
    s.wins += 1;
    s.sum_daily += r.lure_top1.daily_condition_fit;
    s.sum_clarity += r.lure_top1.clarity_fit;
    s.sum_score += r.lure_top1.score;
    const lane = r.lure_top1.tactical_lane;
    s.lanes.set(lane, (s.lanes.get(lane) ?? 0) + 1);
  }

  const lureWinProfile = [...lureWinStats.entries()]
    .map(([id, s]) => ({
      lure_id: id,
      top1_wins: s.wins,
      win_rate: s.wins / n,
      mean_score_when_top1: s.sum_score / s.wins,
      mean_daily_condition_fit_when_top1: s.sum_daily / s.wins,
      mean_clarity_fit_when_top1: s.sum_clarity / s.wins,
      tactical_lane_when_top1: [...s.lanes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
        "",
    }))
    .sort((a, b) => b.top1_wins - a.top1_wins);

  /** July 8 clarity triples: does top1 change with clarity? */
  const sweepGroups = new Map<string, ScenarioRecord[]>();
  for (const r of records) {
    const m = r.scenario_id.match(
      /^(.+_m07_d08)_(clear|stained|dirty)$/,
    );
    if (!m) continue;
    const base = m[1]!;
    if (!sweepGroups.has(base)) sweepGroups.set(base, []);
    sweepGroups.get(base)!.push(r);
  }

  const claritySweep = [...sweepGroups.entries()].map(([base, group]) => {
    const sorted = [...group].sort((a, b) =>
      a.water_clarity.localeCompare(b.water_clarity)
    );
    const lureIds = sorted.map((x) => x.lure_top1.id);
    const flyIds = sorted.map((x) => x.fly_top1.id);
    const lureScores = sorted.map((x) => x.lure_top1.score);
    return {
      sweep_base_id: base,
      region_key: sorted[0]?.region_key ?? "",
      distinct_lure_top1: new Set(lureIds).size,
      distinct_fly_top1: new Set(flyIds).size,
      lure_top1_by_clarity: Object.fromEntries(
        sorted.map((x) => [x.water_clarity, x.lure_top1.id]),
      ) as Record<string, string>,
      lure_score_range: Math.max(...lureScores) - Math.min(...lureScores),
    };
  });

  const maxLureShare = Math.max(...lureTop1Counts.values()) / n;
  const dominantLureId = [...lureTop1Counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "";

  const tuningFlags: string[] = [];
  if (maxLureShare > 0.22) {
    tuningFlags.push(
      `Single lure archetype is #1 in ${(maxLureShare * 100).toFixed(1)}% of cells (${dominantLureId}) — review variety goals vs seasonal reality.`,
    );
  }
  if (lureEffective < 8) {
    tuningFlags.push(
      `Lure #1 diversity is low (effective ~${lureEffective.toFixed(1)} distinct archetypes at 50/50 split). Consider ID_DELTA / lane weights / eligibility.`,
    );
  }
  if (median(lureSpreads) < 1.2) {
    tuningFlags.push(
      `Median lure score gap (#1−#3) is ${median(lureSpreads).toFixed(2)} — rankings may be fragile; small weight changes reorder often.`,
    );
  }
  const identicalClaritySweep = claritySweep.filter((s) =>
    s.distinct_lure_top1 === 1 && s.distinct_fly_top1 === 1
  ).length;
  if (identicalClaritySweep >= claritySweep.length * 0.5) {
    tuningFlags.push(
      `${identicalClaritySweep}/${claritySweep.length} July-8 clarity triples keep the same #1 lure and fly — clarity may be under-weighted vs weather/posture on peak summer days.`,
    );
  }
  if (records.filter((r) => r.lure_top3_duplicate_family).length > n * 0.15) {
    tuningFlags.push(
      `>15% of scenarios show duplicate family_key in lure top-3 — check top3_redundancy_key coverage on archetypes.`,
    );
  }

  const payload = {
    generated_at: new Date().toISOString(),
    archive_bundle_generated_at: archiveBundle.generated_at,
    scenario_count_requested: LMB_LAKE_VIEWER_SCENARIOS.length,
    scenario_count_run: n,
    scenario_count_skipped: skipped,
    summary: {
      lure_top1_entropy_bits: lureEntropy,
      lure_effective_distinct_top1: lureEffective,
      fly_top1_entropy_bits: flyEntropy,
      fly_effective_distinct_top1: flyEffective,
      lure_top1_histogram: Object.fromEntries(
        [...lureTop1Counts.entries()].sort((a, b) => b[1] - a[1]),
      ),
      fly_top1_histogram: Object.fromEntries(
        [...flyTop1Counts.entries()].sort((a, b) => b[1] - a[1]),
      ),
      lure_spread_1_3_percentiles: {
        p10: percentile(lureSpreads, 10),
        p50: median(lureSpreads),
        p90: percentile(lureSpreads, 90),
      },
      fly_spread_1_3_percentiles: {
        p10: percentile(flySpreads, 10),
        p50: median(flySpreads),
        p90: percentile(flySpreads, 90),
      },
      lure_winner_share_of_score: {
        daily_condition_fit: {
          p10: percentile(shareDaily, 10),
          p50: median(shareDaily),
          p90: percentile(shareDaily, 90),
        },
        clarity_fit: {
          p10: percentile(shareClarity, 10),
          p50: median(shareClarity),
          p90: percentile(shareClarity, 90),
        },
      },
      july_8_clarity_sweeps: claritySweep,
      tuning_flags: tuningFlags,
    },
    by_region: regionEntropy,
    lure_win_profile: lureWinProfile,
    records,
  };

  await Deno.writeTextFile(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`);

  const md = [
    `# LMB lake/pond — deep audit`,
    ``,
    `Generated: ${payload.generated_at}`,
    `Archive: ${payload.archive_bundle_generated_at ?? "—"}`,
    `Scenarios run: **${n}** (skipped ${skipped})`,
    ``,
    `## Goals`,
    ``,
    `- **Variety:** spread of #1 picks and healthy #1−#3 separation.`,
    `- **Best-for-conditions:** winner score components (especially \`daily_condition_fit\` and \`clarity_fit\`) should reflect the day; use \`lure_win_profile\` and per-scenario \`records\` to tune \`archetypeConditionWeights.ts\` and archetype \`clarity_strengths\`.`,
    ``,
    `## Summary`,
    ``,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Lure #1 entropy (bits) | ${lureEntropy.toFixed(2)} |`,
    `| Effective distinct lure #1s (exp entropy) | ${lureEffective.toFixed(1)} |`,
    `| Fly #1 entropy (bits) | ${flyEntropy.toFixed(2)} |`,
    `| Median lure score gap (#1−#3) | ${median(lureSpreads).toFixed(2)} |`,
    `| Median share of #1 score from daily_condition_fit | ${median(shareDaily).toFixed(2)} |`,
    `| Median share of #1 score from clarity_fit | ${median(shareClarity).toFixed(2)} |`,
    ``,
    `## Heuristic tuning flags`,
    ``,
    tuningFlags.length
      ? tuningFlags.map((t) => `- ${t}`).join("\n")
      : `- (none — thresholds not tripped)`,
    ``,
    `## July 8 clarity sweeps`,
    ``,
    `| Region (base id) | Distinct lure #1 | Distinct fly #1 | Score range (lure #1) |`,
    `|------------------|------------------|-----------------|------------------------|`,
    ...claritySweep.map((s) =>
      `| ${s.sweep_base_id} | ${s.distinct_lure_top1} | ${s.distinct_fly_top1} | ${s.lure_score_range.toFixed(2)} |`
    ),
    ``,
    `## Top lure win profile (when #1)`,
    ``,
    `| Lure | Wins | Win rate | mean daily_fit | mean clarity_fit | mean score |`,
    `|------|------|----------|----------------|------------------|------------|`,
    ...lureWinProfile.slice(0, 20).map((p) =>
      `| ${p.lure_id} | ${p.top1_wins} | ${(p.win_rate * 100).toFixed(1)}% | ${p.mean_daily_condition_fit_when_top1.toFixed(2)} | ${p.mean_clarity_fit_when_top1.toFixed(2)} | ${p.mean_score_when_top1.toFixed(2)} |`
    ),
    ``,
    `Full JSON: \`${OUT_JSON}\` (includes every scenario record with top-3 components).`,
    ``,
  ].join("\n");

  await Deno.writeTextFile(OUT_MD, md);

  console.log(`Wrote ${OUT_JSON}`);
  console.log(`Wrote ${OUT_MD}`);
  console.log(`Run ${n} scenarios, skipped ${skipped}`);
  if (tuningFlags.length) {
    console.log("\nFlags:");
    for (const f of tuningFlags) console.log(`  - ${f}`);
  }
}
