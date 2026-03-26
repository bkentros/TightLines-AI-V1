/**
 * buildNarrationBrief.ts
 *
 * Converts deterministic engine output into a structured plain-English brief.
 * The LLM receives this brief and only provides voice — it never interprets scores.
 *
 * Anti-contradiction guarantee: metabolicState is derived from temperature +
 * pressure and placed explicitly in the TIP DIRECTION section, so the
 * actionable_tip can never contradict the limiting factors.
 */

import type { HowsFishingReport } from "../contracts/report.ts";

export type TipFocusLane =
  | "offering_size_profile"
  | "retrieval_method"
  | "speed_aggression"
  | "finesse_vs_power";

export interface NarrationBriefResult {
  briefText: string;
  positiveCount: number;
  limitingCount: number;
}

type MetabolicState =
  | "active"
  | "selective"
  | "cold_limited"
  | "heat_limited"
  | "post_front_recovery"
  | "tough";

function deriveMetabolicState(report: HowsFishingReport): MetabolicState {
  const ctx = report.condition_context;
  const score = report.score;
  if (ctx?.temperature_metabolic_context === "cold_limited") return "cold_limited";
  if (ctx?.temperature_metabolic_context === "heat_limited") return "heat_limited";
  const pressureVar = ctx?.normalized_variable_scores.find(
    (v) => v.variable_key === "pressure_regime",
  );
  if (pressureVar?.engine_label === "rising_fast") return "post_front_recovery";
  if (score >= 65) return "active";
  if (score >= 42) return "selective";
  return "tough";
}

function metabolicConstraint(state: MetabolicState, band: string): string {
  switch (state) {
    case "active":
      return "Conditions are favorable — fish can commit. Match that energy. Medium-to-active pace is appropriate unless the tip lane specifically demands slow. Do NOT default to slow/ultra-finesse.";
    case "selective":
      return "Fish are present but picky. Clean, deliberate presentation beats power. Medium pace is the safe default — avoid pure aggression.";
    case "cold_limited":
      return "COLD TEMPERATURES are slowing fish metabolism — mandatory slow-down. NEVER suggest fast retrieves, aggressive rips, or power fishing. Finesse and patience are the only correct calls.";
    case "heat_limited":
      return "HEAT is narrowing the bite window. Fish are less active during peak warmth (timing section says when they are active). Finesse leans are appropriate; avoid writing as if fish are aggressive all day.";
    case "post_front_recovery":
      return "Pressure jumped after a front — fish are adjusting, not committing freely. Finesse over power, slower and subtler wins here.";
    case "tough":
      return `${band === "Poor" ? "Poor" : "Tough"} conditions overall. Be honest and constructive. Slower, more deliberate presentations outperform aggression when the bite is compromised.`;
  }
}

function variableKeyToName(key: string): string {
  const map: Record<string, string> = {
    temperature_condition: "temperature",
    pressure_regime: "pressure",
    wind_condition: "wind",
    light_cloud_condition: "sky / cloud cover",
    precipitation_disruption: "precipitation",
    runoff_flow_disruption: "river flow",
    tide_current_movement: "tidal movement",
  };
  return map[key] ?? key.replace(/_condition|_regime|_disruption|_movement/g, "").replace(/_/g, " ");
}

function variableToPlain(
  key: string,
  label: string,
  score: number,
  tempF: number | null,
): string {
  switch (key) {
    case "temperature_condition": {
      const t = tempF != null ? `${Math.round(tempF)}°F — ` : "";
      if (label === "optimal") return `${t}right in the seasonal range`;
      if (label === "warm") return `${t}running warm, metabolism is up`;
      if (label === "cool") return `${t}a bit below average, slightly slower bite`;
      if (label === "very_warm") return `${t}quite hot — activity windows are narrow`;
      if (label === "very_cold" || label === "cold") return `${t}well below seasonal range — fish are sluggish`;
      return `${t}${label.replace(/_/g, " ")}`;
    }
    case "pressure_regime": {
      if (label === "falling_slow") return "easing down gradually — a favorable feeding signal";
      if (label === "falling_moderate") return "dropping steadily — front approaching, classic feed-up window";
      if (label === "falling_hard") return "dropping hard and fast — short aggressive window before the front hits";
      if (label === "rising_slow") return "slowly recovering after a front";
      if (label === "rising_fast") return "bouncing up sharply after a front — fish are recalibrating";
      if (label === "volatile") return "moving in both directions — unsettled pattern";
      if (label === "stable_neutral") return "flat and steady — no directional pressure story";
      return label.replace(/_/g, " ");
    }
    case "wind_condition": {
      if (score >= 2) return "glass calm — great for delicate presentations";
      if (score === 1) return "light breeze — ripple without the problems";
      if (score === 0) return "moderate — manageable but needs attention";
      if (score === -1) return "building strong — boat control and casting take more effort";
      return "very strong — safety and sheltered water are the priority";
    }
    case "light_cloud_condition": {
      if (score >= 2) return "heavy overcast — low light keeps fish active and less cautious";
      if (score === 1) return "helpful cloud cover — softened light extends feeding periods";
      if (score === 0) return "mixed sky — average light, no strong edge either way";
      if (score === -1) return "bright and clear — fish may hold tighter to shade and cover";
      return "direct sun and glare — fish are most cautious right now";
    }
    case "precipitation_disruption": {
      if (score >= 1) return "dry stretch — water is stable and predictable";
      if (score === 0) return "light rain or recent wet weather — minor effect";
      if (score === -1) return "recent rain affecting water clarity and fish position";
      return "heavy rain or runoff — conditions are disrupted";
    }
    case "runoff_flow_disruption": {
      if (score >= 1) return "flows are clear and fishable — normal river patterns apply";
      if (score === 0) return "elevated flows — fish are pushed toward slower water";
      return "high or dirty water — visibility and access are limited";
    }
    case "tide_current_movement": {
      if (score >= 2) return "strong tidal exchange — baitfish and predators are moving";
      if (score === 1) return "good tidal movement — current is working in your favor";
      if (score === 0) return "moderate exchange — average tide day";
      return "slack or minimal tide — current isn't helping today";
    }
    default:
      return label.replace(/_/g, " ");
  }
}

function deriveDominantPattern(report: HowsFishingReport): string {
  const ctx = report.condition_context;
  if (!ctx) {
    if (report.score >= 70) return "Multiple conditions are aligned — a strong overall day";
    if (report.score >= 50) return "Mixed conditions — some things working, some not";
    return "Conditions are working against the bite today";
  }
  const pressureVar = ctx.normalized_variable_scores.find((v) => v.variable_key === "pressure_regime");
  const lightVar = ctx.normalized_variable_scores.find((v) => v.variable_key === "light_cloud_condition");
  const windVar = ctx.normalized_variable_scores.find((v) => v.variable_key === "wind_condition");
  const pl = pressureVar?.engine_label ?? "";
  const metab = ctx.temperature_metabolic_context;
  const tempBand = ctx.temperature_band;

  if (pl === "falling_moderate" || pl === "falling_slow") {
    return (lightVar && lightVar.engine_score >= 1)
      ? "Pressure easing + overcast sky — a textbook setup for an active bite"
      : "Pressure easing ahead of a weather change — fish often feed up in this window";
  }
  if (pl === "falling_hard") {
    return "Pressure dropping hard — short, aggressive window before the front moves through";
  }
  if (pl === "rising_fast") {
    return "Front has passed, pressure rebounding — bite is rebuilding as conditions settle";
  }
  if (metab === "heat_limited" || tempBand === "very_warm") {
    return "Heat is the main story — peak activity narrows to cooler parts of the day";
  }
  if (metab === "cold_limited" || tempBand === "very_cold") {
    return "Cold conditions are keeping fish sluggish — slow and methodical is the call";
  }
  if (windVar && windVar.engine_score <= -2) {
    return "Strong wind is the main challenge — sheltered water makes all the difference today";
  }
  if (lightVar && lightVar.engine_score >= 2) {
    return "Heavy cloud deck keeps light low — fish stay active well past normal windows";
  }
  if (report.score >= 75) return "Several conditions are aligned — a strong overall day";
  if (report.score >= 55) return "Decent setup with a few things working in your favor";
  if (report.score >= 38) return "Mixed conditions — some factors helping, some fighting you";
  return "Conditions are stacked against the bite today";
}

function formatTimingSection(report: HowsFishingReport): string {
  const periods = report.highlighted_periods;
  const note = report.daypart_note;
  const names = ["dawn", "morning", "afternoon", "evening"];

  if (periods) {
    const best = names.filter((_, i) => periods[i as 0 | 1 | 2 | 3]);
    const avoided = names.filter((_, i) => !periods[i as 0 | 1 | 2 | 3]);
    if (best.length === 4) return note ?? "Conditions are fairly consistent throughout the day";
    if (best.length > 0) {
      const bestStr = best.join(" and ");
      const avoidStr = avoided.length > 0 && avoided.length <= 2 ? ` — avoid ${avoided.join(" and ")} if possible` : "";
      return `Best windows: ${bestStr}${avoidStr}${note ? `. ${note}` : ""}`;
    }
  }
  return note ?? "No strong timing signal today — fish throughout the day";
}

function bandToPlain(band: string): string {
  if (band === "Excellent") return "Excellent — one of the stronger days of the season";
  if (band === "Good") return "Good — solid conditions, worth getting out";
  if (band === "Fair") return "Fair — some things working, some not; patience helps";
  return "Poor — tough day, go in with realistic expectations";
}

function contextToPlain(ctx: string): string {
  if (ctx === "freshwater_lake_pond") return "freshwater lake or pond";
  if (ctx === "freshwater_river") return "freshwater river";
  return "coastal / saltwater";
}

function seasonFromDate(iso: string): string {
  const m = parseInt(iso.slice(5, 7), 10) || 1;
  const d = parseInt(iso.slice(8, 10), 10) || 1;
  if (m === 3) return d < 15 ? "early spring" : "mid-spring";
  if (m === 4) return "mid-spring";
  if (m === 5) return d < 20 ? "late spring" : "late spring / early summer";
  if (m === 6) return "early summer";
  if (m === 7) return "midsummer";
  if (m === 8) return d < 20 ? "late summer" : "late summer / early fall";
  if (m === 9) return "early fall";
  if (m === 10) return d < 15 ? "mid-fall" : "late fall";
  if (m === 11) return "late fall";
  if (m === 12) return "early winter";
  if (m === 1) return "midwinter";
  return "late winter / early spring";
}

function tipLaneToPlain(lane: TipFocusLane): string {
  switch (lane) {
    case "offering_size_profile":
      return "LURE/FLY SIZE AND PROFILE — bigger or smaller, slimmer or bulkier, more or less vibration/action (tackle choice only, never depth or structure)";
    case "retrieval_method":
      return "RETRIEVE METHOD — the specific cadence (steady, twitch-pause, rip-and-fall, dead drift, slow roll, etc.)";
    case "speed_aggression":
      return "RETRIEVE SPEED — how fast or slow: crawl, slow, medium, fast, aggressive rip";
    case "finesse_vs_power":
      return "FINESSE vs POWER — light touch and subtle movements vs confident, assertive rod work";
  }
}

export function buildNarrationBrief(
  report: HowsFishingReport,
  locationName: string | null,
  localDate: string,
  tipLane: TipFocusLane,
  tipInstruction: string,
  voiceMode: string,
  openerAngle: string,
): NarrationBriefResult {
  const cc = report.condition_context;
  const metabolicState = deriveMetabolicState(report);
  const dominantPattern = deriveDominantPattern(report);
  const season = seasonFromDate(localDate);
  const tempF = cc?.environment_snapshot.current_air_temp_f ?? null;

  // Build factors in exact report.drivers / report.suppressors order
  const positiveFactors: string[] = report.drivers.map((d) => {
    const norm = cc?.normalized_variable_scores.find((v) => v.variable_key === d.variable);
    if (!norm) return variableKeyToName(d.variable);
    const plain = variableToPlain(d.variable, norm.engine_label, norm.engine_score,
      d.variable === "temperature_condition" ? tempF : null);
    return `${variableKeyToName(d.variable)}: ${plain}`;
  });

  const limitingFactors: string[] = report.suppressors.map((s) => {
    const norm = cc?.normalized_variable_scores.find((v) => v.variable_key === s.variable);
    if (!norm) return variableKeyToName(s.variable);
    const plain = variableToPlain(s.variable, norm.engine_label, norm.engine_score,
      s.variable === "temperature_condition" ? tempF : null);
    return `${variableKeyToName(s.variable)}: ${plain}`;
  });

  const solunarCount = cc?.environment_snapshot.solunar_peak_count ?? null;
  let solunarLine: string;
  if (solunarCount != null && solunarCount > 0) {
    solunarLine = `${solunarCount === 1 ? "One" : "Two"} solunar peak period${solunarCount > 1 ? "s" : ""} today — treat as soft context, not a guarantee. Frame it as an interesting note for the angler.`;
  } else {
    solunarLine = "No notable solunar peaks today — keep the solunar_note brief and low-key.";
  }

  const missingVars = cc?.missing_variables ?? report.normalized_debug?.missing_variables ?? [];
  const dataLine = missingVars.length > 0
    ? `Data gaps: ${missingVars.map(variableKeyToName).join(", ")} — do not write confident copy about these.`
    : "Full data available — write with normal confidence.";

  const uniqueId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const lines: string[] = [
    `<voice_mode>${voiceMode}</voice_mode>`,
    `<lead_angle>${openerAngle}</lead_angle>`,
    `<generation_id>${localDate}|${report.location.latitude.toFixed(2)},${report.location.longitude.toFixed(2)}|${report.score}|${uniqueId}</generation_id>`,
    "",
    "FISHING CONDITIONS BRIEF",
    "═══════════════════════",
    `Location: ${locationName ?? `${report.location.latitude.toFixed(2)}, ${report.location.longitude.toFixed(2)}`}`,
    `Water type: ${contextToPlain(report.context)}`,
    `Season: ${season}`,
    "",
    "TODAY'S STORY",
    "─────────────",
    `Overall: ${bandToPlain(report.band)}`,
    `Main pattern: ${dominantPattern}`,
    "",
    "WHAT'S WORKING FOR YOU",
    positiveFactors.length > 0
      ? `Write one short natural phrase per factor below (${positiveFactors.length} total) — plain English, max 70 chars each, in the same order:`
      : "Nothing is strongly positive today — driver_labels should be an empty array [].",
    ...positiveFactors.map((f) => `→ ${f}`),
    "",
    "WORKING AGAINST YOU",
    limitingFactors.length > 0
      ? `Write one short honest phrase per factor below (${limitingFactors.length} total) — not discouraging, max 70 chars each, in the same order:`
      : "Nothing notable is limiting the fishing — suppressor_labels should be an empty array [].",
    ...limitingFactors.map((f) => `→ ${f}`),
    "",
    "BEST TIME TO FISH",
    formatTimingSection(report),
    "",
    "SOLUNAR CONTEXT",
    solunarLine,
    "",
    "TIP DIRECTION",
    `Focus: ${tipLaneToPlain(tipLane)}`,
    `Instruction: ${tipInstruction}`,
    `Fish metabolic state: ${metabolicConstraint(metabolicState, report.band)}`,
    "Tip MUST be: one clear mechanical change in HOW to work the lure or fly.",
    "Tip MUST NOT mention: where to fish, structure, depth, tides, time of day, stealth/approach.",
    "",
    "DATA QUALITY",
    dataLine,
  ];

  return {
    briefText: lines.filter((l) => l !== undefined).join("\n"),
    positiveCount: positiveFactors.length,
    limitingCount: limitingFactors.length,
  };
}
