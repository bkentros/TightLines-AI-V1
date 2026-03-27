#!/usr/bin/env -S deno run --allow-read
import { buildSharedEngineRequestFromEnvData } from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import { runRecommender } from "../../supabase/functions/_shared/recommenderEngine/index.ts";
import { RECOMMENDER_AUDIT_SCENARIOS } from "./auditScenarios.ts";

const scenarioId = Deno.args[0];

if (!scenarioId) {
  console.error("Usage: deno run --allow-read scripts/recommender-audit/debug-scenario.ts <scenario-id>");
  Deno.exit(1);
}

const scenario = RECOMMENDER_AUDIT_SCENARIOS.find((entry) => entry.id === scenarioId);
if (!scenario) {
  console.error(`Scenario not found: ${scenarioId}`);
  Deno.exit(1);
}

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

console.log(JSON.stringify({
  id: scenario.id,
  notes: scenario.notes,
  summary_seed: result.narration_payload.summary_seed,
  top_lures: result.lure_rankings.slice(0, 5),
  top_flies: result.fly_rankings.slice(0, 5),
  debug: result.debug,
}, null, 2));
