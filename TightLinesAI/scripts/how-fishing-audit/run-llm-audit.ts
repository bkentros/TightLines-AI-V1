#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env
/**
 * How's Fishing — Full LLM Narration Audit
 *
 * Reads the deterministic JSONL (from run-live-audit.ts), RE-RUNS the updated engine
 * (picks up all temp band / weight / timing fixes), calls OpenAI exactly as the
 * how-fishing edge function does, then auto-flags quality issues in each report.
 *
 * What this audits:
 *   - summary_line quality, tone, uniqueness, character length
 *   - actionable_tip adherence to the 4-pillar rule (no timing, no location)
 *   - banned phrases from RULE #1
 *   - LLM contradicting engine verdict (tip says "slow" when activity = high, etc.)
 *   - Tip/summary character limits (≤220 chars each)
 *   - Summary and tip sounding like rewrites of each other
 *   - Score changes from engine fixes (before vs after)
 *
 * Setup:
 *   export OPENAI_API_KEY="sk-..."
 *
 * Run:
 *   cd TightLinesAI && deno run --allow-net --allow-read --allow-write --allow-env \
 *     scripts/how-fishing-audit/run-llm-audit.ts \
 *     how-fishing-live-audit-results.jsonl \
 *     how-fishing-llm-audit-results.jsonl
 */

import { dirname, join } from "jsr:@std/path";
import { fromFileUrl } from "jsr:@std/path/from-file-url";
import {
  buildSharedEngineRequestFromEnvData,
  runHowFishingReport,
  buildNarrationPayloadFromReport,
} from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import type { HowsFishingReport } from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import { polishReportCopyOpenAI, LLM_MODEL } from "../../supabase/functions/_shared/howFishingPolish/mod.ts";

// ── CLI args ──────────────────────────────────────────────────────────────────

const auditDir = dirname(fromFileUrl(import.meta.url));
const defaultIn = join(auditDir, "../../..", "how-fishing-live-audit-results.jsonl");
const inPath = Deno.args[0] ?? defaultIn;
const outPath = Deno.args[1] ?? "how-fishing-llm-audit-results.jsonl";

const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY");
if (!OPENAI_KEY) {
  console.error("❌  OPENAI_API_KEY not set. Run: export OPENAI_API_KEY='sk-...'");
  Deno.exit(1);
}


async function callLLM(
  report: HowsFishingReport,
  locationName: string | null,
  localDate: string,
  envData: Record<string, unknown> | null,
): Promise<{ summary: string; tip: string; inT: number; outT: number } | null> {
  const narration = buildNarrationPayloadFromReport(report);
  const r = await polishReportCopyOpenAI(OPENAI_KEY!, report, narration, {
    locationName,
    localDate,
    envData,
  });
  if (!r) return null;
  return { summary: r.summary, tip: r.tip, inT: r.inT, outT: r.outT };
}

// ── Auto-audit flags ──────────────────────────────────────────────────────────

const BANNED_PHRASES = [
  "sweet spot", "lining up", "dial it in", "dialing in", "game plan",
  "get after it", "don't sleep on", "worth noting", "that said",
  "at the end of the day", "this time of year", "erratic",
  "barometric pressure has been", "pressure is unstable", "pressure has been unstable",
  "bouncing around", "pressure-sensitive", "fish are likely less active",
  "fish activity may be reduced", "activity is suppressed", "fish may be shut down",
  "suppressive", "fish tend to shut down", "adjust your presentation",
  "match the conditions", "read the water", "let the fish tell you",
  "shape your retrieve", "slow things down", "keep things light", "be deliberate",
  "cover water", "lockjaw", "shut down", "conditions may", "you might want to",
  "adjust if conditions shift",
];

const TIP_TIMING_WORDS = [
  "dawn", "dusk", "morning", "afternoon", "evening", "first light", "last light",
  "sunrise", "sunset", "o'clock", "a.m.", "p.m.", "am ", "pm ", "before the heat",
  "tide", "tidal", "exchange window", "solunar",
];

const TIP_LOCATION_WORDS = [
  "bank", "point", "points", "structure", "current seam", "seam", "depth",
  "shallow", "deep", "bottom", "water column", "edge", "pocket", "cove",
  "channel", "flat", "reef", "drop", "ledge", "cover", "vegetation",
  "keep it high", "work the", "bounce bottom", "position",
];

const ECHO_LABELS = [
  "optimal", "suppressive", "erratic regime", "volatile", "moderate-high",
  "falling_slow", "falling_moderate", "rising_slow", "heat_limited", "cold_limited",
];

function auditLLMOutput(
  summary: string,
  tip: string,
  report: HowsFishingReport,
): { flags: string[]; pass: boolean } {
  const flags: string[] = [];
  const summaryLow = summary.toLowerCase();
  const tipLow = tip.toLowerCase();
  const allText = (summary + " " + tip).toLowerCase();

  // Character limits
  if (summary.length > 220) flags.push(`summary_over_220_chars (${summary.length})`);
  if (tip.length > 220) flags.push(`tip_over_220_chars (${tip.length})`);

  // Banned phrases
  for (const phrase of BANNED_PHRASES) {
    if (allText.includes(phrase)) flags.push(`banned_phrase: "${phrase}"`);
  }

  // Tip timing/location violations
  for (const word of TIP_TIMING_WORDS) {
    if (tipLow.includes(word)) {
      flags.push(`tip_timing_violation: "${word}"`);
      break;
    }
  }
  for (const word of TIP_LOCATION_WORDS) {
    if (tipLow.includes(word)) {
      flags.push(`tip_location_violation: "${word}"`);
      break;
    }
  }

  // Echoing engine labels
  for (const label of ECHO_LABELS) {
    if (allText.includes(label)) {
      flags.push(`echoes_engine_label: "${label}"`);
      break;
    }
  }

  // LLM contradicts engine metabolic context
  const cc = report.condition_context;
  if (cc) {
    if (cc.temperature_metabolic_context === "heat_limited") {
      if (summaryLow.includes("cold") || summaryLow.includes("winter") || tipLow.includes("slow crawl")) {
        flags.push("contradicts_engine: heat_limited but LLM wrote cold/winter language");
      }
    }
    if (cc.temperature_metabolic_context === "cold_limited") {
      if (summaryLow.includes("heat") || summaryLow.includes("hot") || summaryLow.includes("warm day")) {
        flags.push("contradicts_engine: cold_limited but LLM wrote heat language");
      }
    }
    if (cc.avoid_midday_for_heat && (summaryLow.includes("midday") || summaryLow.includes("mid-day") || summaryLow.includes("noon"))) {
      flags.push("contradicts_engine: avoid_midday_for_heat=true but LLM praised midday");
    }
  }

  // Score contradiction: Excellent/Good but tip is ultra-pessimistic
  if (report.score >= 65 && (tipLow.includes("very slow") || tipLow.includes("nearly stationary") || tipLow.includes("barely move"))) {
    flags.push(`possible_contradiction: score=${report.score} (${report.band}) but tip is ultra-slow/pessimistic`);
  }

  // Summary/tip are too similar (first 8 words overlap check)
  const summaryWords = summaryLow.split(/\s+/).slice(0, 10);
  const tipWords = tipLow.split(/\s+/).slice(0, 10);
  const overlap = summaryWords.filter(w => w.length > 4 && tipWords.includes(w));
  if (overlap.length >= 4) {
    flags.push(`summary_tip_overlap: shared substantive words: ${overlap.slice(0, 4).join(", ")}`);
  }

  // Capital letter check (first char of each field)
  if (summary.length > 0 && summary[0] !== summary[0]!.toUpperCase()) {
    flags.push("summary_uncapitalized_start");
  }
  if (tip.length > 0 && tip[0] !== tip[0]!.toUpperCase()) {
    flags.push("tip_uncapitalized_start");
  }

  return { flags, pass: flags.length === 0 };
}

// ── Location name from scenario id ───────────────────────────────────────────

function locationFromId(id: string): string {
  const parts = id.split("-");
  const contextTypes = new Set(["lake", "river", "coastal", "pond"]);
  // Find last occurrence of a context type keyword (the context comes right before the date)
  let contextIdx = -1;
  for (let i = parts.length - 1; i >= 0; i--) {
    if (contextTypes.has(parts[i]!)) {
      contextIdx = i;
      break;
    }
  }
  const nameParts = contextIdx > 0 ? parts.slice(0, contextIdx) : parts.slice(0, parts.length - 4);
  return nameParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

// ── Main ─────────────────────────────────────────────────────────────────────

type AuditLine = {
  id: string;
  notes: string | null;
  local_date: string;
  context: string;
  region_key: string;
  score_before: number;
  band_before: string;
  score_after: number;
  band_after: string;
  score_delta: number;
  summary_line: string;
  actionable_tip: string;
  timing_window: string;
  timing_driver: string;
  timing_strength: string;
  reliability: string;
  drivers: string[];
  suppressors: string[];
  audit_flags: string[];
  audit_pass: boolean;
  llm_tokens_in: number;
  llm_tokens_out: number;
};

const rawLines = (await Deno.readTextFile(inPath)).split("\n").filter(Boolean);
console.log(`Loaded ${rawLines.length} scenarios from ${inPath}`);
console.log(`Model: ${LLM_MODEL}  |  Output → ${outPath}\n`);

await Deno.writeTextFile(outPath, ""); // clear output

let ok = 0, failed = 0, totalFlags = 0, totalIn = 0, totalOut = 0;

for (let i = 0; i < rawLines.length; i++) {
  const row = JSON.parse(rawLines[i]!) as {
    id: string;
    notes: string | null;
    input: {
      latitude: number;
      longitude: number;
      local_date: string;
      local_timezone: string;
      context: string;
      environment: Record<string, unknown>;
    };
    env_data: Record<string, unknown>;
    report: HowsFishingReport;
  };

  const { id, notes, input, env_data, report: reportBefore } = row;
  const locationName = locationFromId(id);

  // Re-run engine with updated code (picks up all temp band / weight fixes)
  let reportAfter: HowsFishingReport;
  try {
    const req = buildSharedEngineRequestFromEnvData(
      input.latitude,
      input.longitude,
      input.local_date,
      input.local_timezone,
      input.context as Parameters<typeof buildSharedEngineRequestFromEnvData>[4],
      env_data,
      0,
    );
    reportAfter = runHowFishingReport(req);
  } catch (err) {
    console.error(`ENGINE ERR [${id}]: ${err instanceof Error ? err.message : String(err)}`);
    failed++;
    continue;
  }

  // Call LLM
  let llmResult: Awaited<ReturnType<typeof callLLM>> = null;
  try {
    llmResult = await callLLM(reportAfter, locationName, input.local_date, env_data);
  } catch (err) {
    console.error(`LLM ERR [${id}]: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!llmResult) {
    console.error(`SKIP [${id}]: LLM returned null`);
    failed++;
    await new Promise((r) => setTimeout(r, 500));
    continue;
  }

  // Audit
  const { flags, pass } = auditLLMOutput(llmResult.summary, llmResult.tip, reportAfter);
  totalFlags += flags.length;
  totalIn += llmResult.inT;
  totalOut += llmResult.outT;

  const scoreDelta = reportAfter.score - reportBefore.score;
  const deltaStr = scoreDelta > 0 ? `+${scoreDelta}` : String(scoreDelta);
  const flagStr = pass ? "✓" : `⚠ ${flags.length} flag(s)`;

  console.log(
    `[${String(i + 1).padStart(3)}] ${id.padEnd(52)} ` +
    `${reportBefore.score}→${reportAfter.score} (${deltaStr}) ${reportAfter.band.padEnd(10)} ` +
    `${flagStr}`,
  );
  if (!pass) {
    for (const f of flags) console.log(`       ⚠  ${f}`);
  }
  console.log(`       📋 ${llmResult.summary.slice(0, 110)}${llmResult.summary.length > 110 ? "…" : ""}`);
  console.log(`       🎯 ${llmResult.tip.slice(0, 110)}${llmResult.tip.length > 110 ? "…" : ""}`);

  const auditLine: AuditLine = {
    id,
    notes: notes ?? null,
    local_date: input.local_date,
    context: input.context,
    region_key: reportAfter.location?.region_key ?? "",
    score_before: reportBefore.score,
    band_before: reportBefore.band,
    score_after: reportAfter.score,
    band_after: reportAfter.band,
    score_delta: scoreDelta,
    summary_line: llmResult.summary,
    actionable_tip: llmResult.tip,
    timing_window: (reportAfter.daypart_preset ?? "none"),
    timing_driver: reportAfter.timing_debug?.anchor_driver ?? "none",
    timing_strength: reportAfter.timing_strength ?? "none",
    reliability: reportAfter.reliability,
    drivers: reportAfter.drivers.map((d) => d.variable),
    suppressors: reportAfter.suppressors.map((s) => s.variable),
    audit_flags: flags,
    audit_pass: pass,
    llm_tokens_in: llmResult.inT,
    llm_tokens_out: llmResult.outT,
  };

  await Deno.writeTextFile(outPath, JSON.stringify(auditLine) + "\n", { append: true });
  ok++;

  // Pause between calls — respectful of OpenAI rate limits
  await new Promise((r) => setTimeout(r, 400));
}

// ── Summary ───────────────────────────────────────────────────────────────────

const estCost = ((totalIn * 0.15 + totalOut * 0.60) / 1_000_000);
console.log(`\n${"─".repeat(70)}`);
console.log(`Done. ${ok} ok, ${failed} failed.`);
console.log(`Flags: ${totalFlags} total across ${ok} reports (${(totalFlags / Math.max(ok, 1)).toFixed(1)} avg/report)`);
console.log(`Tokens: ${totalIn.toLocaleString()} in / ${totalOut.toLocaleString()} out`);
console.log(`Est. cost (gpt-5.4-mini): ~$${estCost.toFixed(3)}`);
console.log(`Results → ${outPath}`);
