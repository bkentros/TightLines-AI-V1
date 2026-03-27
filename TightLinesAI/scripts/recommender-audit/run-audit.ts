#!/usr/bin/env -S deno run --allow-read --allow-write
import { buildSharedEngineRequestFromEnvData } from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import { runRecommender } from "../../supabase/functions/_shared/recommenderEngine/index.ts";
import {
  RECOMMENDER_AUDIT_SCENARIOS,
  type RecommenderAuditScenario,
} from "./auditScenarios.ts";

function includesAny(actual: string[], expected: string[] | undefined): boolean {
  if (!expected || expected.length === 0) return true;
  return expected.some((item) => actual.includes(item));
}

function excludesAll(actual: string[], forbidden: string[] | undefined): boolean {
  if (!forbidden || forbidden.length === 0) return true;
  return forbidden.every((item) => !actual.includes(item));
}

function evaluateScenario(s: RecommenderAuditScenario, result: ReturnType<typeof runRecommender>): string[] {
  const findings: string[] = [];
  const depths = result.fish_behavior.position.depth_lanes.slice(0, 3).map((item) => item.id);
  const relations = result.fish_behavior.position.relation_tags.slice(0, 4).map((item) => item.id);
  const archetypes = result.presentation_archetypes.slice(0, 3).map((item) => item.archetype_id);
  const styleFlags = result.fish_behavior.behavior.style_flags;
  const lureIds = result.lure_rankings.slice(0, 3).map((item) => item.family_id);
  const flyIds = result.fly_rankings.slice(0, 3).map((item) => item.family_id);
  const activity = result.fish_behavior.behavior.activity;

  if (!includesAny(depths, s.expectations.top_depth_in)) {
    findings.push(`expected one of top_depth_in=${JSON.stringify(s.expectations.top_depth_in)} but saw ${JSON.stringify(depths.slice(0, 3))}`);
  }
  if (!includesAny(relations, s.expectations.top_relation_in)) {
    findings.push(`expected one of top_relation_in=${JSON.stringify(s.expectations.top_relation_in)} but saw ${JSON.stringify(relations.slice(0, 4))}`);
  }
  if (!includesAny(archetypes, s.expectations.top_archetype_in)) {
    findings.push(`expected one of top_archetype_in=${JSON.stringify(s.expectations.top_archetype_in)} but saw ${JSON.stringify(archetypes.slice(0, 3))}`);
  }
  if (!excludesAll(archetypes, s.expectations.forbidden_top_archetype_ids)) {
    findings.push(`forbidden top archetype in ${JSON.stringify(s.expectations.forbidden_top_archetype_ids)} but saw ${JSON.stringify(archetypes.slice(0, 3))}`);
  }
  if (!includesAny(styleFlags, s.expectations.required_style_flags)) {
    findings.push(`expected style flag in ${JSON.stringify(s.expectations.required_style_flags)} but saw ${JSON.stringify(styleFlags)}`);
  }
  if (!includesAny(lureIds, s.expectations.top_lure_ids_in)) {
    findings.push(`expected lure family in ${JSON.stringify(s.expectations.top_lure_ids_in)} but saw ${JSON.stringify(lureIds.slice(0, 3))}`);
  }
  if (!excludesAll(lureIds, s.expectations.forbidden_top_lure_ids)) {
    findings.push(`forbidden top lure family in ${JSON.stringify(s.expectations.forbidden_top_lure_ids)} but saw ${JSON.stringify(lureIds.slice(0, 3))}`);
  }
  if (!includesAny(flyIds, s.expectations.top_fly_ids_in)) {
    findings.push(`expected fly family in ${JSON.stringify(s.expectations.top_fly_ids_in)} but saw ${JSON.stringify(flyIds.slice(0, 3))}`);
  }
  if (!includesAny([activity], s.expectations.activity_in)) {
    findings.push(`expected activity in ${JSON.stringify(s.expectations.activity_in)} but saw ${JSON.stringify(activity)}`);
  }
  return findings;
}

const outPath = Deno.args[0] ?? "recommender-audit-results.jsonl";
await Deno.writeTextFile(outPath, "");

let passCount = 0;

for (const scenario of RECOMMENDER_AUDIT_SCENARIOS) {
  const request = buildSharedEngineRequestFromEnvData(
    scenario.latitude,
    scenario.longitude,
    scenario.local_date,
    scenario.local_timezone,
    scenario.context,
    scenario.env_data,
  );
  const result = runRecommender({
    request,
    refinements: scenario.refinements ?? {},
  });
  const findings = evaluateScenario(scenario, result);
  const pass = findings.length === 0;
  if (pass) passCount++;

  await Deno.writeTextFile(
    outPath,
    JSON.stringify({
      id: scenario.id,
      notes: scenario.notes,
      pass,
      findings,
      summary: {
        top_depths: result.fish_behavior.position.depth_lanes.slice(0, 3),
        top_relations: result.fish_behavior.position.relation_tags.slice(0, 4),
        top_archetypes: result.presentation_archetypes.slice(0, 2).map((item) => item.archetype_id),
        top_lures: result.lure_rankings.slice(0, 3).map((item) => item.family_id),
        top_flies: result.fly_rankings.slice(0, 3).map((item) => item.family_id),
      },
      debug: result.debug,
    }) + "\n",
    { append: true },
  );

  console.log(pass ? "ok" : "review", scenario.id, result.lure_rankings[0]?.family_id ?? "none");
  if (!pass) {
    findings.forEach((finding) => console.log("  -", finding));
  }
}

console.error(`Audit complete: ${passCount}/${RECOMMENDER_AUDIT_SCENARIOS.length} scenarios passed. Wrote ${outPath}`);
