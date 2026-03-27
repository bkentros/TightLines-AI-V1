#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env
import { dirname, join } from "jsr:@std/path";
import { fromFileUrl } from "jsr:@std/path/from-file-url";
import {
  buildSharedEngineRequestFromEnvData,
} from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import { runRecommender } from "../../supabase/functions/_shared/recommenderEngine/index.ts";
import {
  buildRecommenderBrief,
  LLM_MODEL,
  primaryTrackKind,
  polishRecommenderOutput,
} from "../../supabase/functions/_shared/recommenderPolish/mod.ts";
import { fetchArchiveWeather } from "../how-fishing-audit/lib/fetchArchiveWeather.ts";
import { fetchSunriseSunset } from "../how-fishing-audit/lib/fetchSunriseSunset.ts";
import { fetchUSNOMoon } from "../how-fishing-audit/lib/fetchUSNOMoon.ts";
import { fetchNOAATides } from "../how-fishing-audit/lib/fetchNOAATides.ts";
import { mapArchiveToEnvData } from "../how-fishing-audit/lib/mapEnvData.ts";
import {
  e2eAuditPass,
  failureModeSummary,
  runRecommenderE2eAuditChecks,
  type RecommenderE2eScenario,
  worstSeverity,
} from "./lib/e2eAuditChecks.ts";
import { renderInAppStyleRecommenderReport } from "./lib/renderInAppStyleReport.ts";

const auditDir = dirname(fromFileUrl(import.meta.url));

function parseFlagValue(args: string[], name: string): string | null {
  const index = args.indexOf(name);
  if (index < 0 || !args[index + 1]) return null;
  return args[index + 1]!;
}

function estimatePolishCostUsd(promptTokens: number, completionTokens: number): number {
  const inputCostPer1M = 0.15;
  const outputCostPer1M = 0.60;
  return (promptTokens * inputCostPer1M + completionTokens * outputCostPer1M) / 1_000_000;
}

const args = [...Deno.args];
const skipLlm = args.includes("--skip-llm");
const limitArg = parseFlagValue(args, "--limit");
const onlyScenarioId = parseFlagValue(args, "--scenario-id");
const limit = limitArg ? Math.max(1, parseInt(limitArg, 10) || 1) : null;
const pos = args.filter((arg, index) =>
  !arg.startsWith("--") && args[index - 1] !== "--limit" && args[index - 1] !== "--scenario-id"
);

const scenariosPath = pos[0] ?? join(auditDir, "scenarios-e2e-mainstream-24.json");
const outPath = pos[1] ?? join(auditDir, "../../recommender-e2e-audit.jsonl");
const costSummaryPath = outPath.replace(/\.jsonl$/i, "-cost-summary.json");
const inAppPath = outPath.replace(/\.jsonl$/i, "-in-app.md");

const openaiKey = Deno.env.get("OPENAI_API_KEY") ?? "";
if (!skipLlm && !openaiKey) {
  console.error("OPENAI_API_KEY not set. Pass --skip-llm for engine-only runs.");
  Deno.exit(1);
}

let scenarios: RecommenderE2eScenario[] = JSON.parse(await Deno.readTextFile(scenariosPath));
if (onlyScenarioId) {
  scenarios = scenarios.filter((scenario) => scenario.id === onlyScenarioId);
}
if (limit != null) {
  scenarios = scenarios.slice(0, limit);
}

console.log(`Loaded ${scenarios.length} recommender E2E scenarios from ${scenariosPath}`);
console.log(`Output -> ${outPath}\n`);

await Deno.writeTextFile(outPath, "");

const summaryRows: Array<{
  id: string;
  context: string;
  top_lure: string;
  top_fly: string;
  pass: string;
  worst: string;
  n_flags: number;
  summary: string;
  cost_usd: number;
  prompt_tokens: number;
  completion_tokens: number;
}> = [];
const costLedger: Array<{
  scenario_id: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost_usd_estimate: number;
}> = [];
const inAppBlocks: string[] = [];

let ok = 0;
let fail = 0;
let skip = 0;

for (const scenario of scenarios) {
  try {
    const archive = await fetchArchiveWeather(
      scenario.latitude,
      scenario.longitude,
      scenario.local_date,
    );
    if (!archive) {
      console.error(`SKIP ${scenario.id}: archive fetch failed`);
      skip++;
      continue;
    }

    const tzOffsetHours = archive.tz_offset_seconds / 3600;
    const [sun, moon, tides] = await Promise.all([
      fetchSunriseSunset(
        scenario.latitude,
        scenario.longitude,
        scenario.local_date,
        archive.timezone,
      ),
      fetchUSNOMoon(
        scenario.latitude,
        scenario.longitude,
        scenario.local_date,
        tzOffsetHours,
      ),
      (scenario.context === "coastal" || scenario.context === "coastal_flats_estuary") &&
          scenario.tide_station_id
        ? fetchNOAATides(scenario.tide_station_id, scenario.local_date, tzOffsetHours)
        : Promise.resolve(null),
    ]);

    let envData: Record<string, unknown> = mapArchiveToEnvData(
      archive,
      scenario.local_date,
      archive.timezone,
      sun,
      moon,
      tides ?? null,
    );
    if (scenario.altitude_ft != null) {
      envData = { ...envData, altitude_ft: scenario.altitude_ft };
    }

    const requestAuto = buildSharedEngineRequestFromEnvData(
      scenario.latitude,
      scenario.longitude,
      scenario.local_date,
      scenario.local_timezone,
      scenario.context as SharedEngineRequest["context"],
      envData,
      0,
    );
    const request: SharedEngineRequest = scenario.region_key
      ? { ...requestAuto, region_key: scenario.region_key as SharedEngineRequest["region_key"] }
      : requestAuto;

    const { response, behaviorResolution } = runRecommender({
      request,
      refinements: scenario.refinements ?? {},
    });

    const brief = buildRecommenderBrief({
      response,
      behavior: behaviorResolution,
      localDate: scenario.local_date,
      locationName: scenario.location_name ?? null,
    });

    let promptTokens = 0;
    let completionTokens = 0;
    let costUsd = 0;

    if (!skipLlm) {
      const polished = await polishRecommenderOutput(openaiKey, brief, response, primaryTrackKind(response));
      if (!polished) {
        console.error(`SKIP ${scenario.id}: LLM returned null`);
        skip++;
        continue;
      }
      response.polished = polished.polished;
      promptTokens = polished.inT;
      completionTokens = polished.outT;
      costUsd = estimatePolishCostUsd(promptTokens, completionTokens);
      costLedger.push({
        scenario_id: scenario.id,
        model: LLM_MODEL,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        cost_usd_estimate: Number(costUsd.toFixed(6)),
      });
    }

    const auditFlags = runRecommenderE2eAuditChecks({
      scenario,
      response,
      polished: response.polished,
      requirePolishedCopy: !skipLlm,
    });
    const pass = e2eAuditPass(auditFlags);
    const worst = worstSeverity(auditFlags) ?? "none";
    const failSummary = failureModeSummary(auditFlags);
    if (pass) ok++;
    else fail++;

    const line = JSON.stringify({
      scenario,
      env_snapshot: {
        timezone: archive.timezone,
        noon_air_temp_f: (envData.weather as Record<string, unknown> | undefined)?.temperature ?? null,
        pressure_mb: (envData.weather as Record<string, unknown> | undefined)?.pressure ?? null,
        cloud_cover_pct: (envData.weather as Record<string, unknown> | undefined)?.cloud_cover ?? null,
        wind_mph: (envData.weather as Record<string, unknown> | undefined)?.wind_speed ?? null,
        precip_mm: (envData.weather as Record<string, unknown> | undefined)?.precipitation ?? null,
        sunrise: (envData.sun as Record<string, unknown> | undefined)?.sunrise ?? null,
        sunset: (envData.sun as Record<string, unknown> | undefined)?.sunset ?? null,
        tide_phase: (envData.tides as Record<string, unknown> | undefined)?.phase ?? null,
      },
      engine: response,
      llm: {
        model: skipLlm ? null : LLM_MODEL,
        skipped: skipLlm,
        brief,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        cost_usd_estimate: Number(costUsd.toFixed(6)),
      },
      audit: {
        pass,
        worst_severity: worst,
        failure_mode_summary: failSummary,
        flags: auditFlags,
      },
    }) + "\n";
    await Deno.writeTextFile(outPath, line, { append: true });

    inAppBlocks.push(renderInAppStyleRecommenderReport({
      scenario,
      response,
      audit: {
        pass,
        worst_severity: worst,
        failure_mode_summary: failSummary,
        n_flags: auditFlags.length,
      },
    }));

    summaryRows.push({
      id: scenario.id,
      context: scenario.context,
      top_lure: response.lure_rankings[0]
        ? `${response.lure_rankings[0].family_id}:${response.lure_rankings[0].best_method.method_id}`
        : "none",
      top_fly: response.fly_rankings[0]
        ? `${response.fly_rankings[0].family_id}:${response.fly_rankings[0].best_method.method_id}`
        : "none",
      pass: pass ? "PASS" : "FAIL",
      worst,
      n_flags: auditFlags.length,
      summary: failSummary,
      cost_usd: Number(costUsd.toFixed(6)),
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
    });

    console.log(
      pass ? "ok" : "review",
      scenario.id,
      response.lure_rankings[0]
        ? `${response.lure_rankings[0].family_id}:${response.lure_rankings[0].best_method.method_id}`
        : "none",
    );
    if (!pass) {
      auditFlags.forEach((flag) => console.log(`  - [${flag.severity}] ${flag.code}: ${flag.detail}`));
    }
  } catch (error) {
    console.error(`SKIP ${scenario.id}:`, error instanceof Error ? error.message : String(error));
    skip++;
  }
}

await Deno.writeTextFile(
  costSummaryPath,
  JSON.stringify(
    {
      model: skipLlm ? null : LLM_MODEL,
      totals: {
        scenarios: scenarios.length,
        passed: ok,
        failed: fail,
        skipped: skip,
        prompt_tokens: costLedger.reduce((sum, row) => sum + row.prompt_tokens, 0),
        completion_tokens: costLedger.reduce((sum, row) => sum + row.completion_tokens, 0),
        cost_usd_estimate: Number(costLedger.reduce((sum, row) => sum + row.cost_usd_estimate, 0).toFixed(6)),
      },
      rows: costLedger,
      summary: summaryRows,
    },
    null,
    2,
  ),
);

await Deno.writeTextFile(inAppPath, inAppBlocks.join("\n\n---\n\n"));

console.error(
  `Recommender E2E audit complete: ${ok} passed / ${fail} failed / ${skip} skipped. ` +
    `Wrote ${outPath}, ${costSummaryPath}, ${inAppPath}`,
);
