/**
 * Shared LLM polish for How's Fishing — same prompts and OpenAI contract as the how-fishing edge function.
 */

import {
  applyConditionContextToEngineVerdict,
  compositeScoreActivityTier,
  type EngineContext,
  type HowsFishingReport,
  pickTipFocusFromEngine,
} from "../howFishingEngine/index.ts";
import type { NarrationPayload } from "../howFishingEngine/contracts/mod.ts";
import type { SharedEngineRequest } from "../howFishingEngine/contracts/input.ts";
import type { TipFocusLane } from "../howFishingEngine/narration/buildNarrationBrief.ts";

export type { TipFocusLane };

export const REBUILD_LLM_SYSTEM =
  `You are the voice of FinFindr — a confident, experienced fishing guide. You give every angler an honest, specific read — not a polished summary.

Voice and tone:
- Direct and confident. Never hedge. Never say "might want to consider," "stay flexible," or "adjust if conditions shift."
- Human. You sound like a person, not an app. You have a perspective. You notice things.
- Every report sounds written by a specific guide with a specific read on this specific day — not a system cycling through templates.
- Reference the location by name when provided. Make it feel personal.
- If the user message omits a location tag, open naturally: water type from context_guide, loose regional flavor from region_key in plain English, or "The bite here" / "this stretch of water" — never raw decimal coordinates.
- Never open summary_line with latitude/longitude, comma-separated coordinate pairs, or coordinate decimals as the subject.
- Never open summary_line with a duplicated quality word (e.g. "Excellent, excellent …" or repeating the score band as if it were the place name). Do not treat the band name (Good, Fair, etc.) as the location.

════ RULE #1 — CLEAR, NATURAL VOICE ════
Write the way a sharp fishing guide would actually talk at the ramp: clear sentences, confident tone, no jargon soup. Readability comes first — smooth, conversational English beats forced "unique" phrasing every time.

Plain and specific beats poetic and vague. Say what the day actually looks like and what it means for fishing — not how it feels in the abstract. "Overcast with steady 10 mph winds is a net positive here" beats "The sky lays low over the water today."

Still tailor the read to this location, date, and score band so it does not feel copy-pasted — but never twist grammar or vocabulary into something awkward just to be different.

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

Abstract or theatrical language — these produce confusing or strange-sounding copy and are banned:
• Metaphorical openers about how the water "feels" ("the water has a different feel today," "something's in the air," "you can feel the change coming")
• Literary weather phrases ("the sky lays heavy," "a sullen overcast," "the light goes soft," "the air holds a chill")
• Forced fishing idioms that don't say anything concrete ("trust the process," "the fish are talking," "this water rewards patience" as a standalone)
• Abstract mood-setting that delays the actual fishing read for more than half a sentence

Ground the summary in the payload: use real cues from conditions (air temp, wind, sky, rain) when they strengthen the story — plain language, not a stat dump.

For pressure and wind, describe what it means for fishing in everyday words. Do not paste internal engine label text verbatim (see RULE #4).

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
- **Tidal / schedule language in tips:** Never use the words **tide, tidal, slack, exchange, flood, ebb** in actionable_tip — even on coastal reports. Timing belongs in summary_line only.
- Fish psychology essays ("fish are moody," "they're negative") — at most **half a clause** if it directly justifies the **mechanical** move; never make mood the subject of the sentence.
- Stealth, cast placement, boat positioning, "quiet approach," line slap.
- "Cover water," "keep moving," "fan cast" as the main advice (that is a **where/work-rate** play, not the four pillars).

If the assigned pillar cannot be satisfied honestly from the payload, pick the **next closest** pillar that is still only about lure/fly mechanics — still no timing or location.

════ RULE #3 — TIP STRUCTURE AND CAPITALIZATION ════
The actionable_tip is ONE complete, well-constructed sentence. Two sentences maximum under any circumstance. Never write fragments. Never stack 4–7 punchy short lines. Write it as a single clear guide directive that a guide would say out loud.

Standard English sentence capitalization is mandatory throughout all output. Capitalize the first word of every sentence and all proper nouns. Do not write uncapitalized sentence starters under any circumstances.

════ RULE #4 — NEVER ECHO PAYLOAD LABELS ════
The payload contains internal engine labels: "erratic regime," "suppressive," "optimal," "dropping — feeding trigger," "moderate-high." These are data classifications. Never copy, paraphrase, or translate them directly into output.

For every driver or suppressor in the payload: translate it into plainspoken guide language — not a copy of the machine label.

If temperature_band says "very_warm," do not write "temps are very warm." Use the air temp number from conditions and say something specific. If wind_detail is harsh, describe the feel on the water and what it means for presentations — without echoing internal jargon.

When environment_snapshot.sky_narration_contract is present, sky and light language is **locked** to that object:
- Stay consistent with sky_character; paraphrase only from allowed_sky_descriptors for how the sky looks.
- Never use any forbidden_sky_term (case-insensitive) when describing clouds, sun, brightness, or glare.
- cloud_cover_pct_rounded must not be contradicted (e.g. do not call ~50% cloud cover "bluebird," "crystal clear," "no clouds," or "full blazing sun").

When condition_context.thermal_air_narration_plain is present, air-temperature copy must not contradict that sentence’s thermal story (warmer/cooler/hot/narrow windows).

Non-negotiable rules:
- Output valid JSON only: {"summary_line":"...","actionable_tip":"..."}
- Keep each field at or under 220 characters.
- Never expose internal language to users: no "engine", "model", "baseline", "slot", "target", "variable", "driver", "suppressor", or "confidence".
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

export const LLM_MODEL = "gpt-5.4-mini";

/** USD per 1M tokens — matches `how-fishing` edge `usage_tracking` estimate. */
export const LLM_INPUT_COST_PER_M_USD = 0.75;
export const LLM_OUTPUT_COST_PER_M_USD = 4.5;

/**
 * Estimated USD for one polish completion from reported token counts.
 * OpenAI’s real invoice can differ (cached input, tier, promos); treat as budget tracking only.
 */
export function estimatePolishCostUsd(
  promptTokens: number,
  completionTokens: number,
): number {
  return (
    promptTokens * LLM_INPUT_COST_PER_M_USD +
    completionTokens * LLM_OUTPUT_COST_PER_M_USD
  ) / 1_000_000;
}

/** Random source in [0, 1). Use `mulberry32Rng(seed)` for reproducible audits. */
export type PolishRandom = {
  next: () => number;
};

export function defaultPolishRandom(): PolishRandom {
  return { next: () => Math.random() };
}

/** Deterministic PRNG for audit replay (not cryptographic). */
export function mulberry32Rng(seed: number): PolishRandom {
  let a = seed >>> 0;
  return {
    next: () => {
      a += 0x6d2b79f5;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}

function displayScoreOutOfTen(score: number): string {
  const outOfTen = Math.round(score) / 10;
  return Number.isInteger(outOfTen) ? outOfTen.toFixed(0) : outOfTen.toFixed(1);
}

function contextGuide(context: EngineContext): string {
  if (context === "coastal_flats_estuary") {
    return [
      "Write specifically for shallow flats, estuaries, or brackish shoreline — places where tide still matters but slack water is not automatically bad.",
      "Use language about skinny water, flooded grass, creek mouths, wind chops, and sky glare without assuming violent current is always ideal.",
      "Do not sound like a deep inshore jetty report; avoid implying the angler is always fishing heavy moving water.",
    ].join(" ");
  }
  if (context === "freshwater_lake_pond") {
    return [
      "Write specifically for a freshwater lake or pond.",
      "Use language about covering water, staying flexible, lower-light periods, wind-protected banks, and broad seasonal positioning.",
      "Do not sound like a river report and do not mention tides or current windows.",
    ].join(" ");
  }
  if (context === "freshwater_river") {
    return [
      "Write specifically for a freshwater river.",
      "Use language about current seams, reduced flows, slower or clearer water, runoff carryover, and river stability.",
      "Do not sound like a lake report and do not mention tides.",
    ].join(" ");
  }
  return [
    "Write specifically for coastal inshore / moving-water salt or brackish settings (jetties, channels, surf-adjacent, classic tidal current).",
    "Use language about moving water, tide-driven positioning, wind exposure, cleaner water, and broad shoreline or marsh adjustments.",
    "Do not sound like a lake or river report.",
  ].join(" ");
}

const OPENER_ANGLES = [
  "Lead with the location name and how conditions look there specifically today.",
  "Lead with the strongest driver — name it and say why it matters for fishing.",
  "Lead with the season and what that means for fishing right now in this region.",
  "Lead with the overall read — is this a go day, a patience day, or a grind-it-out day? Be specific about why.",
  "Lead with what makes today different from a typical day in this region.",
  "Lead with a direct, confident statement about the score and back it up with the top driver.",
  "Lead with the atmospheric story — pressure, wind, or sky — and connect it directly to what the fish are doing.",
  "Lead with the water type and what it means for today — lake calm, river flow, tidal push.",
  "Lead with a contrast — what's working vs what's not — and give the honest, specific balance.",
  "Lead with the one thing that jumps off the data — the clear headline of this particular day.",
] as const;

function pickIndex(len: number, rng: PolishRandom): number {
  return Math.min(len - 1, Math.floor(rng.next() * len));
}

export function narrationDiversitySeed(
  report: HowsFishingReport,
  localDate: string | null | undefined,
): string {
  const lat = report.location.latitude.toFixed(2);
  const lon = report.location.longitude.toFixed(2);
  const d = localDate ?? report.location.local_date;
  const uuid =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${d}|${lat},${lon}|${report.score}|${report.band}|${uuid}`;
}

const VOICE_MODES = [
  "Write with understated, knowing confidence — like a guide who's seen it all and doesn't need to oversell anything. Quiet authority.",
  "Write punchy and direct. Short sentences. Confident calls. Zero wasted words. Say it and mean it.",
  "Write with honest specificity — tell the angler exactly what the conditions mean today, no softening and no hype.",
  "Write with measured authority — like someone who speaks carefully because every word is backed by time on the water.",
  "Write with energy that matches the conditions — fired up when it earns it, dry and tactical when it doesn't.",
  "Write like someone who was on this exact water type last week and has strong, specific opinions about what today looks like.",
  "Write with the casual confidence of someone who already knows what the fish are doing and is just filling the angler in.",
  "Write tight and stripped down. No preamble, no throat-clearing. Lead with the most important thing and don't look back.",
] as const;

/**
 * Copies engine-resolved scalars onto env_data so polish sees the same numbers scoreDay used.
 */
export function mergeEngineEnvironmentIntoEnvData(
  envData: Record<string, unknown>,
  environment: SharedEngineRequest["environment"],
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...envData };
  const keys: (keyof SharedEngineRequest["environment"])[] = [
    "current_air_temp_f",
    "daily_mean_air_temp_f",
    "prior_day_mean_air_temp_f",
    "day_minus_2_mean_air_temp_f",
    "pressure_mb",
    "wind_speed_mph",
    "cloud_cover_pct",
    "precip_24h_in",
    "precip_72h_in",
    "precip_7d_in",
    "active_precip_now",
    "precip_rate_now_in_per_hr",
    "sunrise_local",
    "sunset_local",
  ];
  for (const k of keys) {
    const v = environment[k];
    if (v != null && v !== "") out[k as string] = v as unknown;
  }
  if (
    Array.isArray(environment.solunar_peak_local) &&
    environment.solunar_peak_local.length > 0
  ) {
    out.solunar_peak_local = environment.solunar_peak_local;
  }
  return out;
}

function inferDailyMeanFromSevenDay(
  envData: Record<string, unknown>,
  dayOffset: number,
): number | null {
  const w = envData.weather;
  if (!w || typeof w !== "object") return null;
  const ww = w as Record<string, unknown>;
  const th = ww.temp_7day_high as number[] | undefined;
  const tl = ww.temp_7day_low as number[] | undefined;
  if (!th?.length || !tl?.length) return null;
  const idx = Math.min(
    Math.max(0, 14 + dayOffset),
    th.length - 1,
    tl.length - 1,
  );
  const hi = th[idx];
  const lo = tl[idx];
  if (hi == null || lo == null) return null;
  return (Number(hi) + Number(lo)) / 2;
}

/**
 * Merge nested get-environment / mapArchive shape with flat keys for LLM conditions block.
 * Prefer daily_mean_air_temp_f (what temperature scoring uses) over a single noon scalar.
 */
export function buildWeatherSnapshot(
  envData?: Record<string, unknown> | null,
): Record<string, unknown> | null {
  if (!envData) return null;
  const snap: Record<string, unknown> = {};
  const w = envData.weather;
  const ww = w && typeof w === "object" ? (w as Record<string, unknown>) : null;

  const dayOff = typeof envData.polish_day_offset === "number" &&
      Number.isFinite(envData.polish_day_offset)
    ? Math.max(0, Math.floor(envData.polish_day_offset))
    : 0;
  const inferredDaily = inferDailyMeanFromSevenDay(envData, dayOff);

  let temp: number | null = null;
  let tempBasis: string | null = null;
  if (envData.daily_mean_air_temp_f != null) {
    temp = Number(envData.daily_mean_air_temp_f);
    tempBasis = "daily_mean_engine";
  } else if (inferredDaily != null) {
    temp = inferredDaily;
    tempBasis = "daily_mean_inferred_high_low";
  } else if (envData.current_air_temp_f != null) {
    temp = Number(envData.current_air_temp_f);
    tempBasis = "current_observation";
  } else if (ww?.temperature != null) {
    temp = Number(ww.temperature);
    tempBasis = "weather_scalar";
  }
  if (temp != null && Number.isFinite(temp)) {
    snap.air_temp_f = Math.round(temp);
    snap.air_temp_basis = tempBasis;
  }

  const wind = envData.wind_speed_mph ??
    (ww?.wind_speed != null ? Number(ww.wind_speed) : null);
  if (wind != null) snap.wind_mph = Math.round(Number(wind));

  if (envData.wind_direction != null) snap.wind_dir = envData.wind_direction;

  const cloud = envData.cloud_cover_pct ??
    (ww?.cloud_cover != null ? Number(ww.cloud_cover) : null);
  if (cloud != null) snap.cloud_pct = Math.round(Number(cloud));

  if (envData.precip_24h_in != null) {
    snap.rain_24h_in = Number(Number(envData.precip_24h_in).toFixed(2));
  }
  if (envData.precip_72h_in != null) {
    snap.rain_72h_in = Number(Number(envData.precip_72h_in).toFixed(2));
  }
  if (envData.precip_7d_in != null) {
    snap.rain_7d_in = Number(Number(envData.precip_7d_in).toFixed(2));
  }

  const sun = envData.sun as Record<string, unknown> | undefined;
  if (typeof envData.sunrise_local === "string") {
    snap.sunrise = envData.sunrise_local;
  } else if (sun && typeof sun.sunrise === "string") snap.sunrise = sun.sunrise;
  if (typeof envData.sunset_local === "string") {
    snap.sunset = envData.sunset_local;
  } else if (sun && typeof sun.sunset === "string") snap.sunset = sun.sunset;

  if (
    Array.isArray(envData.solunar_peak_local) &&
    (envData.solunar_peak_local as unknown[]).length > 0
  ) {
    snap.solunar_peaks = envData.solunar_peak_local;
  } else {
    const solunar = envData.solunar as {
      major_periods?: Array<{ start?: string }>;
    } | undefined;
    const peaks = solunar?.major_periods
      ?.map((p) => p.start)
      .filter((s): s is string => typeof s === "string" && s.length > 0);
    if (peaks && peaks.length > 0) snap.solunar_peaks = peaks;
  }

  return Object.keys(snap).length > 0 ? snap : null;
}

export function driverToFact(
  d: { variable: string; effect: string; label: string },
): string {
  const varName = d.variable
    .replace(/_condition|_regime|_disruption|_movement/g, "")
    .replace(/_/g, " ");
  const factCore = d.label.split("—")[0]?.trim().replace(/\.$/, "") ?? d.label;
  return `${varName}: ${factCore} (${d.effect})`;
}

function describeSeasonFromDate(iso: string): string {
  const month = parseInt(iso.slice(5, 7), 10) || 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
}

export type PolishPromptMeta = {
  diversity_seed: string;
  assigned_tip_focus_lane: TipFocusLane;
  opener_angle: string;
  voice_mode: string;
  user_message: string;
};

/** Exact-match labels that read like score bands or audit tags — omit &lt;location&gt; to avoid awkward opens ("Excellent, excellent …"). */
const PLACEHOLDER_LOCATION_TOKENS = new Set(
  ["excellent", "good", "fair", "poor", "prime", "coverage"].map((s) =>
    s.toLowerCase()
  ),
);

/**
 * Resolves reverse-geocode / audit placeholder strings for the polish prompt.
 * Returns null to skip &lt;location&gt; (coordinates_hint + context_guide still ground the copy).
 */
export function polishLocationLabelForPrompt(
  locationName: string | null | undefined,
  scoreBand: string,
): string | null {
  const t = (locationName ?? "").trim();
  if (!t) return null;
  const low = t.toLowerCase();
  if (PLACEHOLDER_LOCATION_TOKENS.has(low)) return null;
  if (low === scoreBand.toLowerCase()) return null;
  return t;
}

export function buildPolishUserMessage(
  narration: NarrationPayload,
  report: HowsFishingReport,
  diversitySeed: string,
  rng: PolishRandom,
  locationName?: string | null,
  localDate?: string | null,
  envData?: Record<string, unknown> | null,
  conditionContext?: HowsFishingReport["condition_context"] | null,
): PolishPromptMeta {
  const scoreOutOfTen = displayScoreOutOfTen(narration.score);
  const seasonLabel = localDate ? describeSeasonFromDate(localDate) : null;
  const locationCtx = polishLocationLabelForPrompt(locationName, report.band);
  const weatherSnap = buildWeatherSnapshot(envData);

  const openerAngle = OPENER_ANGLES[pickIndex(OPENER_ANGLES.length, rng)]!;
  const tipFocus = pickTipFocusFromEngine(report, rng);
  const voiceMode = VOICE_MODES[pickIndex(VOICE_MODES.length, rng)]!;

  const engineVerdict: Record<string, unknown> = {
    fish_activity_level: compositeScoreActivityTier(narration.score),
    timing_strength: narration.timing_strength ?? null,
  };
  if (conditionContext) {
    applyConditionContextToEngineVerdict(engineVerdict, conditionContext);
  }

  const gapDetails = report.normalized_debug?.data_gaps ?? [];

  const user_message = [
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
    locationCtx ? `<location>${locationCtx}</location>` : "",
    localDate ? `<date>${localDate}</date>` : "",
    seasonLabel ? `<season>${seasonLabel}</season>` : "",
    `<coordinates_hint>Internal only — do not quote numbers in summary_line. ${
      report.location.latitude.toFixed(3)
    }, ${
      report.location.longitude.toFixed(3)
    } (${report.location.region_key})</coordinates_hint>`,
    "<context_guide>",
    contextGuide(narration.context),
    "</context_guide>",
    "<timing_for_summary_only>",
    "The next field is for summary_line broad timing language ONLY. actionable_tip must NEVER reference it.",
    `daypart_preset: ${narration.daypart_preset}`,
    `timing_anchor_driver: ${narration.timing_anchor_driver}`,
    `recommended_fishing_dayparts: ${
      JSON.stringify(narration.highlighted_dayparts_for_narration)
    }`,
    report.daypart_note
      ? `engine_timing_note: ${report.daypart_note}`
      : "engine_timing_note: null",
    "If engine_timing_note ever disagrees with recommended_fishing_dayparts on which clock buckets matter, recommended_fishing_dayparts wins for summary_line timing claims.",
    "</timing_for_summary_only>",
    "<tip_hard_scope>",
    "See system RULE #2. Tip = one of: offering size/profile, retrieval method, speed/aggression, finesse vs power — ONLY.",
    "</tip_hard_scope>",
    "<payload>",
    JSON.stringify(
      {
        location_name: locationCtx,
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
        recommended_fishing_dayparts:
          narration.highlighted_dayparts_for_narration,
        whats_helping: narration.drivers.map(driverToFact),
        whats_hurting: narration.suppressors.map(driverToFact),
        data_confidence: narration.reliability,
        data_gap_details: gapDetails,
        ...(weatherSnap ? { conditions: weatherSnap } : {}),
      },
      null,
      2,
    ),
    "</payload>",
    "<output_contract>",
    "conditions.air_temp_f is the air temperature (°F) the engine used for scoring: prefer daily mean when air_temp_basis is daily_mean_engine or daily_mean_inferred_high_low; otherwise a single observation. Verbal temperature in summary_line must match this number within a few degrees — do not invent a different temp.",
    "summary_line: one or two short sentences (max 220 chars total). A clear, direct read on the day — what the conditions actually mean for fishing, not an abstract mood statement. Do NOT repeat, paraphrase, or preview sentences from whats_helping or whats_hurting; those lists own the detailed 'why'. You MAY align broad timing language with engine_timing_note and recommended_fishing_dayparts when present. Reference the location by name if payload.location_name is provided. If payload.location_name is null, never use raw coordinates in summary_line — use water type, informal region phrasing, or 'here'. Optional: one grounded detail from 'conditions' (temp, wind, or rain) if it adds life — not a stat dump. Never mention solunar_peaks in summary unless you frame them as soft folklore; engine timing_note takes priority.",
    "actionable_tip: ONE complete sentence (two max, 220 chars total). MUST stay inside ASSIGNED_TIP_FOCUS_LANE only (offering_size_profile | retrieval_method | speed_aggression | finesse_vs_power). Name a concrete mechanical move: explicit pace OR explicit size/profile change OR explicit retrieve pattern OR explicit finesse-vs-power stance. FORBIDDEN in actionable_tip: where to fish, structure, depth, water column targets, any tide/tidal/slack/exchange language, time of day, solunar, boat/stealth/cast placement, 'cover water' as main advice, fish-mood monologues.",
    "CRITICAL — engine_verdict.fish_activity_level states which composite score band the engine assigned (it is not a live fish survey). engine_verdict.temperature_band is the air-temp normalization bucket. Your tip must be consistent with both. If fish_activity_level is in the high composite band and temperature_band is optimal, do NOT default to ultra-slow finesse unless that lane still demands a speed call — then choose a faster retrieve method or power stance instead.",
    "If temperature_band is warm or very_warm, NEVER frame the bite as 'cold water' or winter-style lethargy — that is a hard factual error. If it is very_cold or cool, do not write heat-stress advice.",
    "Trust engine_verdict.temperature_metabolic_context: heat_limited = heat is constraining the bite (even in a normally cool month); cold_limited = cold is the limiter; neutral = neither dominates the metabolic story.",
    "CRITICAL — when temperature_metabolic_context is 'neutral', you MUST NOT write that heat is narrowing windows, limiting the bite, or suppressing fish activity — even if temperature_band is 'warm'. Neutral means the warm air is not a metabolic penalty. In spring, a warm band with a neutral metabolic context means fish metabolism is elevated and the warmth is a positive, not a suppressor. If engine_verdict.thermal_air_narration_plain says 'running warm, metabolism is up' or similar, the summary must reflect that as a positive signal, not a heat warning.",
    "Hard gate on clock buckets: use payload.recommended_fishing_dayparts (same list as engine_verdict.recommended_fishing_dayparts when present). Only those strings may be praised as the primary or 'best' bite window in summary_line. If 'afternoon' is not in that list, do NOT write that midafternoon or afternoon is the best push, peak window, or main event — even colloquially. Morning+evening days get shoulder language only; you may mention other parts of the day only as weaker or honest secondary options.",
    "If data_gap_details or data_gaps_variable_keys is non-empty, do not invent specifics for those variables — stay honest about uncertainty.",
    "Authoritative facts for each scored variable are engine_verdict.normalized_variable_scores (labels + engine_score) and the weighting in composite_contributions. environment_snapshot is the scalar/summary input the engine used. Do not infer fish behavior, habitat, or underwater conditions beyond what those fields and the band/score imply. If whats_helping or whats_hurting ever disagrees with normalized_variable_scores on sign or severity for a variable, ignore the conflicting clause and follow normalized_variable_scores.",
    "Use engine_tip_seed only as loose phrasing inspiration; you may rewrite completely. Do not copy it verbatim if it violates ASSIGNED_TIP_FOCUS_LANE.",
    "Uniqueness: generation_id must produce visibly different phrasing from any other generation_id you have written. If a sentence could apply unchanged to a different lake on a different day, rewrite.",
    "Do not mention JSON, payload, scoring math, data confidence, score numbers, generation_id, or lane machine labels in output.",
    "</output_contract>",
  ].filter(Boolean).join("\n");

  return {
    diversity_seed: diversitySeed,
    assigned_tip_focus_lane: tipFocus.lane,
    opener_angle: openerAngle,
    voice_mode: voiceMode,
    user_message,
  };
}

export type PolishResult = {
  summary: string;
  tip: string;
  inT: number;
  outT: number;
  openai_id?: string;
  raw_message_content?: string;
  assigned_tip_focus_lane: TipFocusLane;
  opener_angle: string;
  voice_mode: string;
  user_message: string;
};

export async function polishReportCopyOpenAI(
  openaiKey: string,
  report: HowsFishingReport,
  narration: NarrationPayload,
  opts: {
    locationName?: string | null;
    localDate?: string | null;
    envData?: Record<string, unknown> | null;
    diversitySeed?: string | null;
    rng?: PolishRandom;
    captureRaw?: boolean;
  } = {},
): Promise<PolishResult | null> {
  const rng = opts.rng ?? defaultPolishRandom();
  const diversitySeed = opts.diversitySeed ??
    narrationDiversitySeed(report, opts.localDate ?? null);
  const { user_message, assigned_tip_focus_lane, opener_angle, voice_mode } =
    buildPolishUserMessage(
      narration,
      report,
      diversitySeed,
      rng,
      opts.locationName,
      opts.localDate,
      opts.envData,
      report.condition_context ?? null,
    );

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      // Reasoning models bill hidden reasoning + visible tokens against this cap.
      // max_tokens is deprecated and too tight here (reasoning can exhaust the budget with empty content).
      max_completion_tokens: 2048,
      reasoning_effort: "none",
      temperature: 0.78,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: REBUILD_LLM_SYSTEM },
        { role: "user", content: user_message },
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    console.error(
      `howFishingPolish OpenAI HTTP ${res.status}: ${errBody.slice(0, 240)}`,
    );
    return null;
  }
  const json = await res.json() as {
    id?: string;
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens: number; completion_tokens: number };
  };
  const text = json.choices?.[0]?.message?.content ?? "";
  const inT = json.usage?.prompt_tokens ?? 0;
  const outT = json.usage?.completion_tokens ?? 0;
  try {
    const p = JSON.parse(text) as {
      summary_line?: string;
      actionable_tip?: string;
    };
    const summary = typeof p.summary_line === "string"
      ? p.summary_line.slice(0, 280)
      : "";
    const tip = typeof p.actionable_tip === "string"
      ? p.actionable_tip.slice(0, 280)
      : "";
    if (summary && tip) {
      const base: PolishResult = {
        summary,
        tip,
        inT,
        outT,
        assigned_tip_focus_lane,
        opener_angle,
        voice_mode,
        user_message,
      };
      if (json.id) base.openai_id = json.id;
      if (opts.captureRaw) base.raw_message_content = text;
      return base;
    }
  } catch {
    /* fall through */
  }
  return null;
}
