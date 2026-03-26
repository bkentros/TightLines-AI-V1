#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env
/**
 * How's Fishing — E2E historical audit: archive weather → engine → gpt-5.4-mini polish → JSONL + table.
 *
 *   cd TightLinesAI && export OPENAI_API_KEY="sk-..."
 *   deno run --allow-net --allow-read --allow-write --allow-env \
 *     scripts/how-fishing-audit/run-e2e-how-fishing-audit.ts \
 *     scripts/how-fishing-audit/scenarios-e2e-50.json \
 *     how-fishing-e2e-audit.jsonl
 *
 * Options:
 *   --polish-seed 424242   — deterministic opener/voice/lane per row (combined with scenario id)
 *
 * Cost reporting (per call + totals):
 *   Each JSONL row includes llm.cost_usd_estimate and llm.pricing (same formula as how-fishing edge).
 *   A companion *-cost-summary.json lists every call’s tokens and estimated USD plus rollups.
 *   *-in-app.md — same rows rendered like RebuildReportView (user-visible copy + QA footer).
 */

import { dirname, join } from "jsr:@std/path";
import { fromFileUrl } from "jsr:@std/path/from-file-url";
import {
  buildSharedEngineRequestFromEnvData,
  buildNarrationPayloadFromReport,
  runHowFishingReport,
} from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import {
  mulberry32Rng,
  polishReportCopyOpenAI,
  mergeEngineEnvironmentIntoEnvData,
  LLM_MODEL,
  estimatePolishCostUsd,
  LLM_INPUT_COST_PER_M_USD,
  LLM_OUTPUT_COST_PER_M_USD,
} from "../../supabase/functions/_shared/howFishingPolish/mod.ts";
import { fetchArchiveWeather } from "./lib/fetchArchiveWeather.ts";
import { fetchSunriseSunset } from "./lib/fetchSunriseSunset.ts";
import { fetchUSNOMoon } from "./lib/fetchUSNOMoon.ts";
import { fetchNOAATides } from "./lib/fetchNOAATides.ts";
import { mapArchiveToEnvData } from "./lib/mapEnvData.ts";
import { findNoonHourIndex } from "./lib/dateUtils.ts";
import {
  runE2eAuditChecks,
  e2eAuditPass,
  worstSeverity,
  failureModeSummary,
} from "./lib/e2eAuditChecks.ts";
import { renderInAppStyleReport } from "./lib/renderInAppStyleReport.ts";

type E2eScenario = {
  id: string;
  notes?: string;
  latitude: number;
  longitude: number;
  local_date: string;
  local_timezone: string;
  context: EngineContext;
  region_key?: string;
  state_code?: string;
  altitude_ft?: number;
  tide_station_id?: string;
  location_name?: string;
  e2e_seed_note?: string;
};

function scenarioRngSeed(global: number, id: string): number {
  let h = global >>> 0;
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(31, h) + id.charCodeAt(i)!;
    h >>>= 0;
  }
  return h;
}

const auditDir = dirname(fromFileUrl(import.meta.url));
const flags = Deno.args.filter((a) => a.startsWith("--"));
const pos = Deno.args.filter((a) => !a.startsWith("--"));
let polishSeed = 424242;
for (let i = 0; i < flags.length; i++) {
  if (flags[i] === "--polish-seed" && flags[i + 1]) polishSeed = parseInt(flags[i + 1]!, 10) || polishSeed;
}

const scenariosPath = pos[0] ?? join(auditDir, "scenarios-e2e-50.json");
const outPath = pos[1] ?? join(auditDir, "../../how-fishing-e2e-audit.jsonl");

const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY");
if (!OPENAI_KEY) {
  console.error("❌ OPENAI_API_KEY not set.");
  Deno.exit(1);
}

const CONTEXTS: EngineContext[] = ["freshwater_lake_pond", "freshwater_river", "coastal"];

const scenarios: E2eScenario[] = JSON.parse(await Deno.readTextFile(scenariosPath));
console.log(`Loaded ${scenarios.length} scenarios from ${scenariosPath}`);
console.log(`Output → ${outPath}\n`);

await Deno.writeTextFile(outPath, "");

const summaryRows: {
  id: string;
  band: string;
  score: number;
  pass: string;
  worst: string;
  n_flags: number;
  summary: string;
  cost_usd: number;
  prompt_tokens: number;
  completion_tokens: number;
}[] = [];

const costLedger: {
  scenario_id: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost_usd_estimate: number;
}[] = [];

let ok = 0;
let fail = 0;
let skip = 0;
const skipReasons: Record<string, number> = {};
function recordSkip(reason: string) {
  skipReasons[reason] = (skipReasons[reason] ?? 0) + 1;
  skip++;
}
let totalPromptTok = 0;
let totalCompletionTok = 0;
let totalCostUsd = 0;
const inAppReportBlocks: string[] = [];

for (let idx = 0; idx < scenarios.length; idx++) {
  const s = scenarios[idx]!;
  if (!CONTEXTS.includes(s.context)) {
    console.error(`SKIP ${s.id}: invalid context`);
    recordSkip("invalid_context");
    continue;
  }

  try {
    const archive = await fetchArchiveWeather(s.latitude, s.longitude, s.local_date);
    if (!archive) {
      console.error(`SKIP ${s.id}: archive fetch failed`);
      recordSkip("archive_fetch_failed");
      continue;
    }

    const tzOffsetHours = archive.tz_offset_seconds / 3600;
    const [sun, moon, tides] = await Promise.all([
      fetchSunriseSunset(s.latitude, s.longitude, s.local_date, archive.timezone),
      fetchUSNOMoon(s.latitude, s.longitude, s.local_date, tzOffsetHours),
      s.context === "coastal" && s.tide_station_id
        ? fetchNOAATides(s.tide_station_id, s.local_date, tzOffsetHours)
        : Promise.resolve(null),
    ]);

    let env_data: Record<string, unknown> = mapArchiveToEnvData(
      archive,
      s.local_date,
      archive.timezone,
      sun,
      moon,
      tides ?? null,
    );
    if (s.altitude_ft != null) env_data = { ...env_data, altitude_ft: s.altitude_ft };

    const reqAuto = buildSharedEngineRequestFromEnvData(
      s.latitude,
      s.longitude,
      s.local_date,
      s.local_timezone,
      s.context,
      env_data,
      0,
    );
    const req: SharedEngineRequest = s.region_key
      ? { ...reqAuto, region_key: s.region_key as SharedEngineRequest["region_key"] }
      : reqAuto;

    let report = runHowFishingReport(req);
    const narr = buildNarrationPayloadFromReport(report);

    const envForPolish: Record<string, unknown> = {
      ...mergeEngineEnvironmentIntoEnvData(env_data, req.environment),
      polish_day_offset: 0,
    };

    const rowRng = mulberry32Rng(scenarioRngSeed(polishSeed, s.id));

    const polished = await polishReportCopyOpenAI(OPENAI_KEY, report, narr, {
      locationName: s.location_name ?? null,
      localDate: s.local_date,
      envData: envForPolish,
      rng: rowRng,
      captureRaw: true,
    });

    if (!polished) {
      console.error(`SKIP ${s.id}: LLM returned null`);
      recordSkip("llm_null");
      continue;
    }

    const costUsd = estimatePolishCostUsd(polished.inT, polished.outT);
    totalPromptTok += polished.inT;
    totalCompletionTok += polished.outT;
    totalCostUsd += costUsd;
    costLedger.push({
      scenario_id: s.id,
      model: LLM_MODEL,
      prompt_tokens: polished.inT,
      completion_tokens: polished.outT,
      cost_usd_estimate: Number(costUsd.toFixed(6)),
    });

    report = { ...report, summary_line: polished.summary, actionable_tip: polished.tip };

    const noonIdx = findNoonHourIndex(archive.hourly_times_unix, s.local_date, archive.timezone);
    const noonTemp =
      noonIdx >= 0 ? archive.hourly_temp_f[noonIdx] ?? null : null;

    const auditFlags = runE2eAuditChecks({
      summary: polished.summary,
      tip: polished.tip,
      report,
      assigned_tip_lane: polished.assigned_tip_focus_lane,
      env_data: envForPolish,
      raw_weather: {
        noon_temp_f: noonTemp,
        engine_daily_mean_air_temp_f: req.environment.daily_mean_air_temp_f ?? null,
        daily_precip_in_at_target: archive.daily_precip_in[14],
        daily_wind_max_mph_at_target: archive.daily_wind_max_mph[14],
      },
    });

    const pass = e2eAuditPass(auditFlags);
    const worst = worstSeverity(auditFlags) ?? "none";
    const failSummary = failureModeSummary(auditFlags);

    if (pass) ok++;
    else fail++;

    const line = JSON.stringify({
      scenario: {
        id: s.id,
        notes: s.notes ?? null,
        latitude: s.latitude,
        longitude: s.longitude,
        local_date: s.local_date,
        local_timezone: s.local_timezone,
        context: s.context,
        region_key: req.region_key,
        location_name: s.location_name ?? null,
      },
      env_data: envForPolish,
      raw_weather: {
        open_meteo_timezone: archive.timezone,
        open_meteo_tz_offset_seconds: archive.tz_offset_seconds,
        noon_temp_f: noonTemp,
        engine_daily_mean_air_temp_f: req.environment.daily_mean_air_temp_f ?? null,
        daily_precip_in_at_target: archive.daily_precip_in[14],
        daily_wind_max_mph_at_target: archive.daily_wind_max_mph[14],
        daily_temp_max_f_at_target: archive.daily_temp_max_f[14],
        daily_temp_min_f_at_target: archive.daily_temp_min_f[14],
        usno_moon_phase: moon?.phase ?? null,
        noaa_tide_phase: tides?.phase ?? null,
      },
      engine_report: report,
      llm: {
        model: LLM_MODEL,
        summary_line: polished.summary,
        actionable_tip: polished.tip,
        openai_id: polished.openai_id ?? null,
        raw_message_content: polished.raw_message_content ?? null,
        assigned_tip_focus_lane: polished.assigned_tip_focus_lane,
        opener_angle: polished.opener_angle,
        voice_mode: polished.voice_mode,
        usage: { prompt_tokens: polished.inT, completion_tokens: polished.outT },
        cost_usd_estimate: Number(costUsd.toFixed(6)),
        pricing: {
          input_usd_per_million: LLM_INPUT_COST_PER_M_USD,
          output_usd_per_million: LLM_OUTPUT_COST_PER_M_USD,
          note:
            "Matches how-fishing edge estimatePolishCostUsd; OpenAI invoice may differ.",
        },
        user_message: polished.user_message,
      },
      audit: {
        automated_flags: auditFlags,
        worst_severity: worst,
        pass,
        failure_mode_summary: failSummary,
      },
    });

    await Deno.writeTextFile(outPath, line + "\n", { append: true });

    inAppReportBlocks.push(
      renderInAppStyleReport({
        scenario: {
          id: s.id,
          location_name: s.location_name ?? null,
          latitude: s.latitude,
          longitude: s.longitude,
          local_date: s.local_date,
          local_timezone: s.local_timezone,
          context: s.context,
          region_key: req.region_key ?? null,
        },
        report: {
          band: report.band,
          score: report.score,
          summary_line: report.summary_line,
          actionable_tip: report.actionable_tip,
          drivers: report.drivers,
          suppressors: report.suppressors,
          daypart_note: report.daypart_note ?? null,
          daypart_preset: report.daypart_preset ?? null,
          highlighted_periods: report.highlighted_periods as boolean[] | undefined,
          reliability: report.reliability,
          reliability_note: report.reliability_note ?? null,
        },
        env_data: envForPolish,
        audit: {
          pass,
          worst_severity: String(worst),
          failure_mode_summary: failSummary,
          n_flags: auditFlags.length,
        },
      }),
    );

    summaryRows.push({
      id: s.id,
      band: report.band,
      score: report.score,
      pass: pass ? "PASS" : "FAIL",
      worst: String(worst),
      n_flags: auditFlags.length,
      summary: failSummary.slice(0, 80),
      cost_usd: costUsd,
      prompt_tokens: polished.inT,
      completion_tokens: polished.outT,
    });

    const mark = pass ? "✓" : "✗";
    console.log(
      `[${String(idx + 1).padStart(2)}/${scenarios.length}] ${mark} ${s.id.slice(0, 44).padEnd(44)} ` +
        `${report.band} score=${report.score} flags=${auditFlags.length} ` +
        `cost≈$${costUsd.toFixed(4)} (${polished.inT}+${polished.outT} tok)`,
    );
  } catch (err) {
    console.error(`ERROR ${s.id}:`, err instanceof Error ? err.message : String(err));
    recordSkip("exception");
  }

  await new Promise((r) => setTimeout(r, 150));
}

const costSummaryPath = outPath.toLowerCase().endsWith(".jsonl")
  ? outPath.slice(0, -6) + "-cost-summary.json"
  : `${outPath}-cost-summary.json`;
const inAppPath = outPath.toLowerCase().endsWith(".jsonl")
  ? outPath.slice(0, -6) + "-in-app.md"
  : `${outPath}-in-app.md`;
const nBilled = costLedger.length;

await Deno.writeTextFile(
  costSummaryPath,
  JSON.stringify(
    {
      model: LLM_MODEL,
      completed_llm_calls: nBilled,
      pricing_usd_per_million_tokens: {
        input: LLM_INPUT_COST_PER_M_USD,
        output: LLM_OUTPUT_COST_PER_M_USD,
      },
      totals: {
        prompt_tokens: totalPromptTok,
        completion_tokens: totalCompletionTok,
        estimated_cost_usd: Number(totalCostUsd.toFixed(6)),
      },
      per_call: costLedger,
      disclaimer:
        "cost_usd_estimate uses the same formula as how-fishing edge usage; OpenAI billing may differ.",
    },
    null,
    2,
  ) + "\n",
);

if (inAppReportBlocks.length > 0) {
  const inAppHeader =
    "# How's Fishing — E2E audit (in-app layout)\n\n" +
    "Each section mirrors **RebuildReportView** " +
    "(score + summary, top reasons, best timing, solunar when present, tip, confidence when shown).\n" +
    "Location, date, and scenario id are for audit traceability only.\n\n" +
    "----\n\n";
  await Deno.writeTextFile(
    inAppPath,
    inAppHeader + inAppReportBlocks.join("\n\n────────────────────────────────────────\n\n"),
  );
}

console.log(`\n── Summary ──\npass: ${ok}  fail: ${fail}  skip: ${skip}`);
if (skip > 0 && Object.keys(skipReasons).length > 0) {
  console.log("Skip breakdown:");
  for (
    const [reason, n] of Object.entries(skipReasons).sort((a, b) => b[1] - a[1])
  ) {
    console.log(`  • ${reason}: ${n}`);
  }
}
console.log("\n| id | band | score | pass | worst | flags | cost_usd | tok in/out | note |");
console.log("|---|------|-------|------|-------|-------|----------|------------|------|");
for (const r of summaryRows) {
  const note = r.summary.replace(/\|/g, "/");
  console.log(
    `| ${r.id} | ${r.band} | ${r.score} | ${r.pass} | ${r.worst} | ${r.n_flags} | ` +
      `${r.cost_usd.toFixed(4)} | ${r.prompt_tokens}/${r.completion_tokens} | ${note} |`,
  );
}

console.log(`\n── GPT cost (${LLM_MODEL}, estimated) ──`);
console.log(
  `Pricing: $${LLM_INPUT_COST_PER_M_USD}/1M input, $${LLM_OUTPUT_COST_PER_M_USD}/1M output (edge parity).`,
);
console.log(`LLM calls completed: ${nBilled}`);
console.log(`Total prompt tokens: ${totalPromptTok}  |  completion: ${totalCompletionTok}`);
console.log(`Total estimated USD: $${totalCostUsd.toFixed(4)}`);
if (nBilled > 0) {
  console.log(`Average per call: $${(totalCostUsd / nBilled).toFixed(4)}`);
}
console.log(`Per-call breakdown written → ${costSummaryPath}`);
if (inAppReportBlocks.length > 0) {
  console.log(`In-app layout (user-visible copy) → ${inAppPath}`);
}