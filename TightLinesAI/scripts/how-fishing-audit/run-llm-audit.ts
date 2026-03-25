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
  applyConditionContextToEngineVerdict,
  buildSharedEngineRequestFromEnvData,
  compositeScoreActivityTier,
  runHowFishingReport,
  buildNarrationPayloadFromReport,
} from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import type { HowsFishingReport } from "../../supabase/functions/_shared/howFishingEngine/index.ts";

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

const LLM_MODEL = "gpt-5.4-mini";

// ── Narration helpers (copied from how-fishing/index.ts — must stay in sync) ──

type TipFocusLane =
  | "offering_size_profile"
  | "retrieval_method"
  | "speed_aggression"
  | "finesse_vs_power";

const REBUILD_LLM_SYSTEM = `You are the voice of TightLines AI — a confident, experienced fishing guide with real personality. You've been on the water all week. You have opinions. You give every angler an honest, specific read — not a polished summary.

Voice and tone:
- Direct and confident. Never hedge. Never say "might want to consider," "stay flexible," or "adjust if conditions shift."
- Human. You sound like a person, not an app. You have a perspective. You notice things.
- Every report sounds written by a specific guide with a specific read on this specific day — not a system cycling through templates.
- Reference the location by name when provided. Make it feel personal.

════ RULE #1 — RADICAL UNIQUENESS ════
This is your most critical directive. You are writing reports for thousands of anglers. Any phrase that comes naturally — any phrasing that feels smooth and ready — has almost certainly appeared in another report. Treat fluency as a warning sign.

Before finalizing any sentence: ask yourself "Would I write this same sentence for different conditions, a different location, a different day?" If yes, throw it out and start over.

Actively resist your own patterns. The moment something sounds polished and familiar, find something more specific, more unexpected, more real. You are not a template. You are a guide with a personality.

Banned words and constructions — never use these under any circumstances:

Generic filler:
• "sweet spot" in any form
• "sitting right in the" + anything
• "conditions are lining up" or "lining up nicely"
• "dialing in" or "dial it in"
• "game plan"
• "get after it"
• "don't sleep on"
• "worth noting"
• "that said"
• "at the end of the day"
• "prime window" as a generic filler phrase
• "this time of year" used as a vague seasonal catch-all
• "conditions are [adjective]" as an opener
• "It's a [adjective] day for fishing"
• "Today looks like a [adjective] day"
• Any phrase that reads like a variable was swapped into a template

Pressure clichés — every single one of these has appeared across multiple reports and is now permanently banned:
• The word "erratic" in any output field
• "barometric pressure has been" + anything
• "pressure is unstable" or "pressure has been unstable" or "pressure remains unstable"
• "fish tend to shut down" in any variation whatsoever
• "bouncing around" to describe pressure or conditions
• "when it's bouncing" in any form
• "pressure-sensitive" in any form
• "fish are likely less active" or "fish activity may be reduced" or "activity is suppressed"
• "fish may be shut down"
• The word "suppressive" anywhere in output
• "the barometer" + "erratic/unstable/bouncing" in any combination

Vague tip language — tips must give explicit direction, these non-directives are banned:
• "shape your retrieve around [condition]"
• "adjust your presentation to the conditions"
• "match the conditions" as a tip conclusion
• "read the water" as a tip directive
• "let the fish tell you" in any form
• "slow things down" without naming the actual pace (crawl, near-stop, dead drift, etc.)
• "keep things light" without specifying size, weight, or tippet
• "be deliberate" without naming what deliberate means mechanically

The temperature example: there are hundreds of ways to say temps are favorable. "Temps are in the sweet spot for this time of year" is one — and it's overused. Say something that could only apply to THIS report. Reference the actual number from the conditions if it helps. Be specific. Be human.

The pressure example: if pressure is bouncing or suppressive, describe it the way a guide actually talks — not as a data label. "The glass can't decide what it's doing" and "readings have been jumping all week" and "pressure's been restless the last few days" are three completely different ways to say the same thing. Pick one that fits this specific day and has never appeared in your previous outputs. Then pick a different one next time.

════ RULE #2 — ACTIONABLE_TIP: FOUR PILLARS ONLY (HARD SCOPE) ════
The actionable_tip answers ONE question only: what should the angler change about **how they work the lure or fly** — not where to fish, not when, not species biology, not reading the water.

It MUST stay inside **exactly one** of these four pillars (the user message will name which pillar is assigned this call — obey it):
1) **Offering size / profile** — smaller or larger offering, slimmer vs bulkier silhouette, subtler vs louder action/vibration, weight or sink rate as *tackle choice* (not "fish are deep").
2) **Retrieval style / method** — steady wind, twitch-pause, rip-drop, dead drift, slow roll, jigging cadence, etc. Name the pattern.
3) **Speed / aggression** — crawl vs medium vs burn; reaction-trigger vs earned bite pace.
4) **Finesse vs power** — light touch, long pauses, thin line feel vs confident, aggressive rod work.

**FORBIDDEN anywhere in actionable_tip:**
- When to fish, tide clocks, solunar, dawn/dusk, "first light," "before the heat," or any scheduling.
- **Where** to fish: banks, points, structure names, current seams, wind direction, "protected pockets," depth targets, "work the edges," water column / "keep it high" / "bounce bottom" as location advice.
- Fish psychology essays ("fish are moody," "they're negative") — at most **half a clause** if it directly justifies the **mechanical** move; never make mood the subject of the sentence.
- Stealth, cast placement, boat positioning, "quiet approach," line slap.
- "Cover water," "keep moving," "fan cast" as the main advice (that is a **where/work-rate** play, not the four pillars).

If the assigned pillar cannot be satisfied honestly from the payload, pick the **next closest** pillar that is still only about lure/fly mechanics — still no timing or location.

════ RULE #3 — TIP STRUCTURE AND CAPITALIZATION ════
The actionable_tip is ONE complete, well-constructed sentence. Two sentences maximum under any circumstance. Never write fragments. Never stack 4–7 punchy short lines. Write it as a single clear guide directive that a guide would say out loud.

Standard English sentence capitalization is mandatory throughout all output. Capitalize the first word of every sentence and all proper nouns. Do not write uncapitalized sentence starters under any circumstances.

════ RULE #4 — NEVER ECHO PAYLOAD LABELS ════
The payload contains internal engine labels: "erratic regime," "suppressive," "optimal," "dropping — feeding trigger," "moderate-high." These are data classifications. Never copy, paraphrase, or translate them directly into output.

For every driver or suppressor in the payload: describe it as an original observation, not a label. Ask: "How would a guide on the water actually describe this, in their own words, today?" The answer changes with every report. A guide who wrote the same description twice would be embarrassed.

This applies to every variable — not just pressure. If temperature_band says "very_warm," do not write "temps are very warm." Find the actual number in conditions and say something specific. If wind_detail says "suppressive — seek shelter," do not write any variation of those words. Describe what that wind actually means for how a fish is positioned or how the offering needs to move.

Non-negotiable rules:
- Output valid JSON only: {"summary_line":"...","actionable_tip":"..."}
- Keep each field at or under 220 characters.
- Never invent species behavior, spawning claims, structure, bait, exact depths, or habitat details not implied by the payload. When engine_verdict includes normalized_variable_scores and environment_snapshot, treat them as ground truth for translating conditions — do not guess drivers or magnitudes beyond those structures.
- Never invent exact time slots or hourly windows. Broad timing language in summary_line only when payload supports it.
- Treat the engine score as truth. Never contradict driver/suppressor logic.
- Freshwater temperature is air-temp context only. Never mention measured or inferred water temperature.
- Keep lower-confidence reports broader and less absolute.
- Write directly to the angler in second person.
- If pressure is listed as dropping in "whats_helping" — that's a POSITIVE. Frame it as a feeding trigger, not a weather warning.
- Be decisive. Own the call. If it's good, say so. If it's tough, say so.
- Never use: "adjust if conditions shift", "cover likely holding water", "conditions may", "you might want to", "lockjaw", "shut down."
- The two fields must sound like different parts of a conversation — not rewordings of each other.`;

const OPENER_ANGLES = [
  "Lead with the location name and how conditions look there specifically today.",
  "Lead with the strongest driver — name it and say why it matters.",
  "Lead with the season and what that means for fishing right now.",
  "Lead with the overall vibe — is this a go day, a patience day, or a grind-it-out day?",
  "Lead with the angler's emotional read — should they feel fired up, cautiously optimistic, or scrappy?",
  "Lead with what makes today different from a typical day in this region.",
  "Lead with a direct, confident statement about the score and back it up with the top driver.",
  "Lead with the atmospheric story — pressure, wind, or sky — and connect it to the fishing.",
  "Lead with the water type and what it means for today — lake calm, river flow, tidal push.",
  "Lead with a contrast — what's working vs what's not — and give the honest balance.",
  "Paint a quick picture of the day ahead — what the angler is walking into out there.",
  "Lead with the one thing that jumps off the data — the headline of the day.",
];

const VOICE_MODES = [
  "Write with understated, knowing confidence — like a guide who's seen it all and doesn't need to oversell anything. Quiet authority.",
  "Write punchy and direct. Short sentences. Confident calls. Zero wasted words. Say it and mean it.",
  "Write with vivid specificity — paint an honest picture of what the angler is actually walking into, not what you wish you could tell them.",
  "Write like you're texting a close fishing buddy who trusts your read completely. Casual but confident. No formality.",
  "Write with wry, honest personality — acknowledge what's working and what isn't, without softening either. Be real about it.",
  "Write with measured authority — like someone who speaks carefully because every word is backed by time on the water.",
  "Write with energy that matches the conditions — fired up when it earns it, dry and tactical when it doesn't.",
  "Write like someone who was on this exact water type last week and has strong, specific opinions about what today looks like.",
  "Write with the casual confidence of someone who already knows what the fish are doing and is just filling the angler in.",
  "Write tight and stripped down. No preamble, no throat-clearing. Lead with the most important thing and don't look back.",
];

const TIP_FOCUS_INSTRUCTIONS: Record<TipFocusLane, readonly string[]> = {
  offering_size_profile: [
    "Make exactly ONE call on offering size or profile: downsize, upsize, slimmer bulk, more or less vibration/thump, heavier or lighter head *as tackle choice* — tied to today's drivers/suppressors. No depth or spot advice.",
    "Commit to a profile change the data supports: smaller vs larger, subtler vs louder action, finesse plastic vs hard bait energy — one clear mechanical choice.",
    "Name the size or silhouette shift that fits engine_verdict today (e.g. trim profile, bulk up, swap to something they can find without chasing).",
  ],
  retrieval_method: [
    "Name ONE retrieve *pattern* to own today: steady wind, twitch-pause, rip-and-fall, dead drift, slow roll, short pops — pick one and justify with conditions in half a clause max.",
    "Pick a single cadence recipe (e.g. two turns, pause, tick) vs steady crawl — the tip is the pattern, not the spot.",
    "Choose between reaction-style snaps vs smooth continuous motion — one method only, spelled out so they can replicate it.",
  ],
  speed_aggression: [
    "Pick ONE pace: crawl, slow, medium steady, fast, aggressive rip — what speed matches fish_activity_level and the top suppressors today?",
    "Commit to slower *or* more aggressive rod work on the retrieve — not both as equals; one dominant speed story.",
    "Should they earn bites with patience or trigger them with tempo? One explicit speed call.",
  ],
  finesse_vs_power: [
    "Finesse vs power on the *rod and retrieve*: light touch, long hangs vs confident snaps — one stance for today.",
    "Delicate vs authoritative with the same lure family — which side does the score and temperature story support?",
    "Soft hands and micro-movements vs assertive strips — pick the side and name what that looks like mechanically.",
  ],
};

function pickTipFocus(): { lane: TipFocusLane; instruction: string } {
  const lanes: TipFocusLane[] = [
    "offering_size_profile",
    "retrieval_method",
    "speed_aggression",
    "finesse_vs_power",
  ];
  const lane = lanes[Math.floor(Math.random() * lanes.length)]!;
  const pool = TIP_FOCUS_INSTRUCTIONS[lane];
  return { lane, instruction: pool[Math.floor(Math.random() * pool.length)]! };
}

function displayScoreOutOfTen(score: number): string {
  const outOfTen = Math.round(score) / 10;
  return Number.isInteger(outOfTen) ? outOfTen.toFixed(0) : outOfTen.toFixed(1);
}

function describeSeasonFromDate(iso: string): string {
  const month = parseInt(iso.slice(5, 7), 10) || 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
}

function driverToFact(d: { variable: string; effect: string; label: string }): string {
  const varName = d.variable
    .replace(/_condition|_regime|_disruption|_movement/g, "")
    .replace(/_/g, " ");
  const factCore = d.label.split("—")[0]?.trim().replace(/\.$/, "") ?? d.label;
  return `${varName}: ${factCore} (${d.effect})`;
}

function buildWeatherSnapshot(envData?: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!envData) return null;
  const snap: Record<string, unknown> = {};
  const temp = envData.daily_mean_air_temp_f ?? envData.current_air_temp_f;
  if (temp != null) snap.air_temp_f = Math.round(Number(temp));
  if (envData.wind_speed_mph != null) snap.wind_mph = Math.round(Number(envData.wind_speed_mph));
  if (envData.wind_direction != null) snap.wind_dir = envData.wind_direction;
  if (envData.cloud_cover_pct != null) snap.cloud_pct = Math.round(Number(envData.cloud_cover_pct));
  if (envData.precip_24h_in != null) snap.rain_24h_in = Number(Number(envData.precip_24h_in).toFixed(2));
  if (envData.precip_72h_in != null) snap.rain_72h_in = Number(Number(envData.precip_72h_in).toFixed(2));
  if (envData.precip_7d_in != null) snap.rain_7d_in = Number(Number(envData.precip_7d_in).toFixed(2));
  if (envData.sunrise_local != null) snap.sunrise = envData.sunrise_local;
  if (envData.sunset_local != null) snap.sunset = envData.sunset_local;
  if (Array.isArray(envData.solunar_peak_local) && (envData.solunar_peak_local as unknown[]).length > 0) {
    snap.solunar_peaks = envData.solunar_peak_local;
  }
  return Object.keys(snap).length > 0 ? snap : null;
}

function contextGuide(context: string): string {
  if (context === "freshwater_lake_pond") {
    return "Write specifically for a freshwater lake or pond. Use language about covering water, staying flexible, lower-light periods, wind-protected banks, and broad seasonal positioning. Do not sound like a river report and do not mention tides or current windows.";
  }
  if (context === "freshwater_river") {
    return "Write specifically for a freshwater river. Use language about current seams, reduced flows, slower or clearer water, runoff carryover, and river stability. Do not sound like a lake report and do not mention tides.";
  }
  return "Write specifically for a coastal saltwater or brackish setting. Use language about moving water, tide-driven positioning, wind exposure, cleaner water, and broad shoreline or marsh adjustments. Do not sound like a lake or river report.";
}

function narrationDiversitySeed(report: HowsFishingReport, localDate: string | null | undefined): string {
  const lat = report.location.latitude.toFixed(2);
  const lon = report.location.longitude.toFixed(2);
  const d = localDate ?? report.location.local_date;
  const uuid = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${d}|${lat},${lon}|${report.score}|${report.band}|${uuid}`;
}

function buildNarrationPrompt(
  narration: ReturnType<typeof buildNarrationPayloadFromReport>,
  report: HowsFishingReport,
  diversitySeed: string,
  locationName?: string | null,
  localDate?: string | null,
  envData?: Record<string, unknown> | null,
): string {
  const scoreOutOfTen = displayScoreOutOfTen(narration.score);
  const seasonLabel = localDate ? describeSeasonFromDate(localDate) : null;
  const weatherSnap = buildWeatherSnapshot(envData);
  const openerAngle = OPENER_ANGLES[Math.floor(Math.random() * OPENER_ANGLES.length)];
  const tipFocus = pickTipFocus();
  const voiceMode = VOICE_MODES[Math.floor(Math.random() * VOICE_MODES.length)];

  const engineVerdict: Record<string, unknown> = {
    fish_activity_level: compositeScoreActivityTier(narration.score),
    timing_strength: narration.timing_strength ?? null,
  };
  const cc = report.condition_context;
  if (cc) applyConditionContextToEngineVerdict(engineVerdict, cc);

  const gapDetails = report.normalized_debug?.data_gaps ?? [];

  return [
    "<narration_variant>",
    `generation_id: ${diversitySeed}`,
    "Treat each unique generation_id as a fresh wording pass: open with different imagery and verbs than you would for another id, even when numbers match another report. Never recycle the same opening 6 words you used on your last answer.",
    "</narration_variant>",
    "<task>",
    "Write a fresh, honest fishing outlook (summary_line) and exactly one actionable_tip.",
    `Voice for this report: ${voiceMode}`,
    `Angle for the summary_line: ${openerAngle}`,
    `ASSIGNED_TIP_FOCUS_LANE: ${tipFocus.lane}`,
    `Instruction for this lane only: ${tipFocus.instruction}`,
    "The actionable_tip must obey ASSIGNED_TIP_FOCUS_LANE — do not mix in other lanes except a short clause if unavoidable.",
    `Engine tip family tag (for tone only, not scope): ${narration.actionable_tip_tag}`,
    "</task>",
    locationName ? `<location>${locationName}</location>` : "",
    localDate ? `<date>${localDate}</date>` : "",
    seasonLabel ? `<season>${seasonLabel}</season>` : "",
    `<coordinates_hint>${report.location.latitude.toFixed(3)}, ${report.location.longitude.toFixed(3)} (${report.location.region_key})</coordinates_hint>`,
    "<context_guide>",
    contextGuide(narration.context),
    "</context_guide>",
    "<timing_for_summary_only>",
    "The next field is for summary_line broad timing language ONLY. actionable_tip must NEVER reference it.",
    `daypart_preset: ${narration.daypart_preset}`,
    `timing_anchor_driver: ${narration.timing_anchor_driver}`,
    report.daypart_note ? `engine_timing_note: ${report.daypart_note}` : "engine_timing_note: null",
    "</timing_for_summary_only>",
    "<tip_hard_scope>",
    "See system RULE #2. Tip = one of: offering size/profile, retrieval method, speed/aggression, finesse vs power — ONLY.",
    "</tip_hard_scope>",
    "<payload>",
    JSON.stringify({
      location_name: locationName,
      date: localDate,
      season: seasonLabel,
      water_type: narration.display_context_label,
      score_out_of_10: scoreOutOfTen,
      band: narration.band,
      assigned_tip_focus_lane: tipFocus.lane,
      timing_anchor_driver: narration.timing_anchor_driver,
      timing_strength: narration.timing_strength ?? null,
      engine_tip_seed: narration.actionable_tip_seed,
      engine_summary_seed: narration.summary_line_seed,
      engine_verdict: engineVerdict,
      whats_helping: narration.drivers.map(driverToFact),
      whats_hurting: narration.suppressors.map(driverToFact),
      data_confidence: narration.reliability,
      data_gap_details: gapDetails,
      ...(weatherSnap ? { conditions: weatherSnap } : {}),
    }, null, 2),
    "</payload>",
    "<output_contract>",
    "summary_line: one or two short sentences (max 220 chars total). High-level mood of the day only — band/score vibe, not a factor-by-factor recap. Do NOT repeat, paraphrase, or preview sentences from whats_helping or whats_hurting; those lists own the detailed 'why'. You MAY align broad timing language with engine_timing_note and recommended_fishing_dayparts when present. Reference the location by name if provided. Optional: one grounded detail from 'conditions' (temp, wind, or rain) if it adds life — not a stat dump. Never mention solunar_peaks in summary unless you frame them as soft folklore; engine timing_note takes priority.",
    "actionable_tip: ONE complete sentence (two max, 220 chars total). MUST stay inside ASSIGNED_TIP_FOCUS_LANE only (offering_size_profile | retrieval_method | speed_aggression | finesse_vs_power). Name a concrete mechanical move: explicit pace OR explicit size/profile change OR explicit retrieve pattern OR explicit finesse-vs-power stance. FORBIDDEN in actionable_tip: where to fish, structure, depth, water column targets, tide time, time of day, solunar, boat/stealth/cast placement, 'cover water' as main advice, fish-mood monologues.",
    "CRITICAL — engine_verdict.fish_activity_level states which composite score band the engine assigned (it is not a live fish survey). engine_verdict.temperature_band is the air-temp normalization bucket. Your tip must be consistent with both. If fish_activity_level is in the high composite band and temperature_band is optimal, do NOT default to ultra-slow finesse unless that lane still demands a speed call — then choose a faster retrieve method or power stance instead.",
    "If temperature_band is warm or very_warm, NEVER frame the bite as 'cold water' or winter-style lethargy — that is a hard factual error. If it is very_cold or cool, do not write heat-stress advice.",
    "Trust engine_verdict.temperature_metabolic_context: heat_limited = heat is constraining the bite (even in a normally cool month); cold_limited = cold is the limiter; neutral = neither dominates the metabolic story.",
    "If engine_verdict.avoid_midday_for_heat is true OR recommended_fishing_dayparts excludes afternoon, do NOT praise midday or peak-sun hours as the best time — keep timing language on dawn, morning shoulders, and/or evening as the payload indicates.",
    "If data_gap_details or data_gaps_variable_keys is non-empty, do not invent specifics for those variables — stay honest about uncertainty.",
    "Authoritative facts for each scored variable are engine_verdict.normalized_variable_scores (labels + engine_score) and the weighting in composite_contributions. environment_snapshot is the scalar/summary input the engine used. Do not infer fish behavior, habitat, or underwater conditions beyond what those fields and the band/score imply. If whats_helping or whats_hurting ever disagrees with normalized_variable_scores on sign or severity for a variable, ignore the conflicting clause and follow normalized_variable_scores.",
    "Use engine_tip_seed only as loose phrasing inspiration; you may rewrite completely. Do not copy it verbatim if it violates ASSIGNED_TIP_FOCUS_LANE.",
    "Uniqueness: generation_id must produce visibly different phrasing from any other generation_id you have written. If a sentence could apply unchanged to a different lake on a different day, rewrite.",
    "Do not mention JSON, payload, scoring math, data confidence, score numbers, generation_id, or lane machine labels in output.",
    "</output_contract>",
  ].filter(Boolean).join("\n");
}

async function callLLM(
  report: HowsFishingReport,
  locationName: string | null,
  localDate: string,
  envData: Record<string, unknown> | null,
): Promise<{ summary: string; tip: string; inT: number; outT: number } | null> {
  const narration = buildNarrationPayloadFromReport(report);
  const diversitySeed = narrationDiversitySeed(report, localDate);
  const userMsg = buildNarrationPrompt(narration, report, diversitySeed, locationName, localDate, envData);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      max_tokens: 400,
      temperature: 1.0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: REBUILD_LLM_SYSTEM },
        { role: "user", content: userMsg },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error(`  LLM HTTP ${res.status}: ${errText.slice(0, 120)}`);
    return null;
  }

  const json = await res.json() as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens: number; completion_tokens: number };
  };
  const text = json.choices?.[0]?.message?.content ?? "";
  const inT = json.usage?.prompt_tokens ?? 0;
  const outT = json.usage?.completion_tokens ?? 0;
  try {
    const p = JSON.parse(text) as { summary_line?: string; actionable_tip?: string };
    const summary = typeof p.summary_line === "string" ? p.summary_line.slice(0, 280) : "";
    const tip = typeof p.actionable_tip === "string" ? p.actionable_tip.slice(0, 280) : "";
    if (summary && tip) return { summary, tip, inT, outT };
  } catch {
    console.error(`  LLM JSON parse failed: ${text.slice(0, 100)}`);
  }
  return null;
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
    llmResult = await callLLM(reportAfter, locationName, input.local_date, input.environment);
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
