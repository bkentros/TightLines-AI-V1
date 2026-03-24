#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * One-off How's Fishing engine batch runner for manual QA (~100 scenarios).
 *
 * Input: JSON array of scenarios (see scenarios.sample.json).
 * Output: JSONL — one line per scenario with id, request summary, full report.
 *
 * Run from repo root or TightLinesAI:
 *   cd TightLinesAI && deno run --allow-read --allow-write scripts/how-fishing-audit/run-audit.ts scripts/how-fishing-audit/scenarios.sample.json
 *
 * Historical / “real” weather: populate env_data to match the shape produced by
 * get-environment (see buildSharedEngineRequestFromEnvData in request/buildFromEnvData.ts).
 * Open-Meteo archive can fill weather.* arrays; coastal rows may add tides/sun/solunar/hourly_*.
 */
import { dirname, join } from "jsr:@std/path";
import { fromFileUrl } from "jsr:@std/path/from-file-url";
import {
  buildSharedEngineRequestFromEnvData,
  runHowFishingReport,
} from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";

type Scenario = {
  id: string;
  notes?: string;
  latitude: number;
  longitude: number;
  local_date: string;
  local_timezone: string;
  context: EngineContext;
  env_data: Record<string, unknown>;
};

const CONTEXTS: EngineContext[] = ["freshwater_lake_pond", "freshwater_river", "coastal"];

const auditDir = dirname(fromFileUrl(import.meta.url));
const defaultScenarios = join(auditDir, "scenarios.sample.json");
const scenariosPath = Deno.args[0] ?? defaultScenarios;
const outPath = Deno.args[1] ?? "how-fishing-audit-results.jsonl";

const raw = await Deno.readTextFile(scenariosPath);
const scenarios = JSON.parse(raw) as Scenario[];

await Deno.writeTextFile(outPath, "");

for (const s of scenarios) {
  if (!CONTEXTS.includes(s.context)) {
    throw new Error(`Invalid context for ${s.id}: ${s.context}`);
  }
  const req = buildSharedEngineRequestFromEnvData(
    s.latitude,
    s.longitude,
    s.local_date,
    s.local_timezone,
    s.context,
    s.env_data,
    0,
  );
  const report = runHowFishingReport(req);
  const line = JSON.stringify({
    id: s.id,
    notes: s.notes ?? null,
    input: {
      latitude: s.latitude,
      longitude: s.longitude,
      local_date: s.local_date,
      local_timezone: s.local_timezone,
      context: s.context,
      region_key: req.region_key,
      environment: req.environment,
      data_coverage: req.data_coverage,
    },
    report,
  });
  await Deno.writeTextFile(outPath, line + "\n", { append: true });
  console.log("ok", s.id, report.band, report.score);
}

console.error("Wrote", scenarios.length, "lines to", outPath);
