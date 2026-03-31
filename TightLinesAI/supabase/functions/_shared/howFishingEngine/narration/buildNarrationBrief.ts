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
import { AIR_TEMP_LARGE_DIURNAL_SWING_F } from "../config/airTempDisplayConstants.ts";
import { engineScoreTier, ENGINE_SCORE_EPSILON } from "../score/engineScoreMath.ts";

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

export type MetabolicState =
  | "active"
  | "selective"
  | "cold_limited"
  | "heat_limited"
  | "post_front_recovery"
  | "tough";

export function deriveMetabolicState(report: HowsFishingReport): MetabolicState {
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
  tempLowHigh: { low: number; high: number } | null,
): string {
  switch (key) {
    case "temperature_condition": {
      const t =
        tempLowHigh != null
          ? `${Math.round(tempLowHigh.low)}–${Math.round(tempLowHigh.high)}°F forecast air (low–high) — `
          : tempF != null
            ? `${Math.round(tempF)}°F air (representative daily value) — `
            : "";
      if (label === "optimal") return `${t}right in the seasonal range`;
      if (label === "near_optimal") {
        if (score <= -ENGINE_SCORE_EPSILON) {
          return `${t}close to the seasonal range, but still on the edge of the better window`;
        }
        return `${t}close to the seasonal range`;
      }
      if (label === "warm") {
        if (score >= 1) return `${t}running warm, metabolism is up`;
        if (score >= ENGINE_SCORE_EPSILON) {
          return `${t}warming side of normal — still a fishable thermal band`;
        }
        return `${t}warm for the calendar but thermally tempered — not a big heat penalty`;
      }
      if (label === "cool") return `${t}a bit below average, slightly slower bite`;
      if (label === "very_warm") {
        if (score <= -ENGINE_SCORE_EPSILON) {
          return `${t}quite hot — activity windows are narrow`;
        }
        if (score <= ENGINE_SCORE_EPSILON) {
          return `${t}hot for the date — warmth is a headwind but not extreme on the model`;
        }
        return `${t}upper warm range — monitor low-light and comfort water`;
      }
      if (label === "very_cold" || label === "cold") {
        return `${t}well below seasonal range — fish are sluggish`;
      }
      return `${t}${label.replace(/_/g, " ")}`;
    }
    case "pressure_regime": {
      if (label === "falling_slow") return "easing down gradually — a favorable feeding signal";
      if (label === "falling_moderate") return "dropping steadily — front approaching, classic feed-up window";
      if (label === "falling_hard") return "dropping hard and fast — short aggressive window before the front hits";
      if (label === "rising_slow") return "slowly recovering after a front";
      if (label === "rising_fast") return "bouncing up sharply after a front — fish are recalibrating";
      if (label === "recently_stabilizing") return "pressure settled after earlier swings — conditions are calming down";
      if (label === "volatile") return "moving in both directions — unsettled pattern";
      if (label === "stable_neutral") return "flat and steady — no directional pressure story";
      return label.replace(/_/g, " ");
    }
    case "wind_condition": {
      const wt = engineScoreTier(score);
      if (wt === 2) return "glass calm — great for delicate presentations";
      if (wt === 1) return "light breeze — ripple without the problems";
      if (wt === 0) return "moderate — manageable but needs attention";
      if (wt === -1) return "building strong — boat control and casting take more effort";
      return "very strong — safety and sheltered water are the priority";
    }
    case "light_cloud_condition": {
      const lt = engineScoreTier(score);
      if (lt === 2) return "heavy overcast — low light keeps fish active and less cautious";
      if (lt === 1) return "helpful cloud cover — softened light extends feeding periods";
      if (lt === 0) return "mixed sky — average light, no strong edge either way";
      if (lt === -1) return "bright and clear — fish may hold tighter to shade and cover";
      return "direct sun and glare — fish are most cautious right now";
    }
    case "precipitation_disruption": {
      if (label === "light_mist") {
        return "trace moisture — conditions essentially stable; may stir warm-water species";
      }
      const pt = engineScoreTier(score);
      if (pt >= 1) return "dry stretch — water is stable and predictable";
      if (pt === 0) return "light rain or recent wet weather — minor effect";
      if (pt === -1) return "recent rain affecting water clarity and fish position";
      return "heavy rain or runoff — conditions are disrupted";
    }
    case "runoff_flow_disruption": {
      const rt = engineScoreTier(score);
      if (rt >= 1) return "flows are clear and fishable — normal river patterns apply";
      if (rt === 0) return "elevated flows — fish are pushed toward slower water";
      return "high or dirty water — visibility and access are limited";
    }
    case "tide_current_movement": {
      if (score >= 1.5) {
        return "strong tidal exchange — baitfish and predators are moving";
      }
      if (score >= 0.5) {
        return "good tidal movement — current is working in your favor";
      }
      if (score > -0.5) return "moderate exchange — average tide day";
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
    return (lightVar && lightVar.engine_score >= ENGINE_SCORE_EPSILON)
      ? "Pressure easing + overcast sky — a textbook setup for an active bite"
      : "Pressure easing ahead of a weather change — fish often feed up in this window";
  }
  if (pl === "falling_hard") {
    return "Pressure dropping hard — short, aggressive window before the front moves through";
  }
  if (pl === "recently_stabilizing") {
    return "Pressure was messy earlier but has settled down — the bite may rebuild as conditions normalize";
  }
  if (pl === "rising_fast") {
    return "Front has passed, pressure rebounding — bite is rebuilding as conditions settle";
  }
  if (metab === "heat_limited") {
    return "Heat is the main story — peak activity narrows to cooler parts of the day";
  }
  if (metab === "cold_limited") {
    return "Cold conditions are keeping fish sluggish — slow and methodical is the call";
  }
  if (windVar && windVar.engine_score <= -1.5) {
    return "Strong wind is the main challenge — sheltered water makes all the difference today";
  }
  if (lightVar && lightVar.engine_score >= 1.5) {
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
  if (ctx === "coastal_flats_estuary") return "shallow flats, estuary, or brackish shoreline";
  return "coastal inshore / saltwater";
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

/**
 * Translates every scored variable into an explicit mechanical hint for the tip.
 *
 * CONFLICT RESOLUTION: metabolicState is passed in and acts as the highest authority.
 * When a variable hint would conflict with the metabolic constraint (e.g. overcast
 * saying "assertive retrieves" while cold_limited says "never fast"), the hint is
 * rewritten to align with metabolicState rather than contradict it. The LLM never
 * receives two instructions that point in opposite directions.
 *
 * Priority order:
 *   1. metabolicState (temperature + pressure + score — fish physiology)
 *   2. variable-specific mechanical hints (environment demands)
 *   3. tip lane instruction (what aspect of technique to address)
 *
 * Coverage per variable:
 *   wind          → calm = finesse-friendly; strong = compact/heavy; very strong = no drifts
 *   light/cloud   → overcast = bolder OK (unless constrained); bright/glare = subtle mandatory
 *   precipitation → stained = bigger/vibration; clear = size restraint
 *   runoff/flow   → high/dirty = bump size + slow near slack; clear = precise/natural
 *   tide          → active = match flow pace (unless constrained); slack = methodical
 *   pressure      → falling_hard = short decisive window; volatile = compact/quick;
 *                   rising_slow = start subtle, build
 */
function deriveTipContextFromVariables(
  report: HowsFishingReport,
  metabolicState: MetabolicState,
): string[] {
  const cc = report.condition_context;
  if (!cc) return [];

  // Whether the metabolic state mandates slow/finesse — used to resolve conflicts
  const metabolicDemandsSlowFinesse =
    metabolicState === "cold_limited" ||
    metabolicState === "post_front_recovery" ||
    metabolicState === "tough";

  const hints: string[] = [];

  for (const norm of cc.normalized_variable_scores) {
    const key = norm.variable_key;
    const score = norm.engine_score;
    const label = norm.engine_label;

    switch (key) {
      // ── Wind ──────────────────────────────────────────────────────────────
      case "wind_condition": {
        const wt = engineScoreTier(score);
        if (wt === 2) {
          hints.push(
            "Calm water: ultra-subtle presentations shine — fish detect the lightest touch; finesse-friendly environment.",
          );
        } else if (wt === -1) {
          hints.push(
            "Strong wind: heavier or more compact offerings cut through better; long slow drifts lose control in chop; shorter snappier cadences outperform.",
          );
        } else if (wt === -2) {
          hints.push(
            "Very strong wind: heavy compact presentations only — anything light or slow gets blown off course.",
          );
        }
        break;
      }

      // ── Light / Cloud ──────────────────────────────────────────────────────
      case "light_cloud_condition":
        if (score >= 1.5) {
          if (metabolicDemandsSlowFinesse) {
            // Overcast is a positive light condition, but metabolic state overrides pace
            hints.push(
              "Heavy overcast: bolder profiles can help fish locate the offering — but keep the pace slow; metabolic conditions demand patience over aggression.",
            );
          } else {
            hints.push(
              "Heavy overcast: fish are less cautious — bolder profiles and more assertive retrieves earn more than usual.",
            );
          }
        } else if (score <= -ENGINE_SCORE_EPSILON) {
          hints.push(
            "Bright/clear conditions: fish can see everything — natural subtle profiles and slower deliberate pacing outperform loud or bulky presentations.",
          );
        }
        break;

      // ── Precipitation ──────────────────────────────────────────────────────
      case "precipitation_disruption":
        if (score <= -ENGINE_SCORE_EPSILON) {
          hints.push(
            "Stained or disrupted water: larger more visible offerings with extra vibration help fish locate the bait; slow down near calmer edges.",
          );
        } else if (score >= ENGINE_SCORE_EPSILON) {
          hints.push(
            "Clear stable water: fish can inspect freely — size restraint and natural presentation beat loud or oversized profiles.",
          );
        }
        break;

      // ── Runoff / River Flow ────────────────────────────────────────────────
      case "runoff_flow_disruption":
        if (score <= -ENGINE_SCORE_EPSILON) {
          hints.push(
            "High or dirty water: bump up size and visibility so fish can find the offering; slow the pace near slack pockets where fish have retreated.",
          );
        } else if (score >= ENGINE_SCORE_EPSILON) {
          hints.push(
            "Clear fishable flows: fish can see precisely — natural sizes and deliberate presentation beat power-covering water.",
          );
        }
        break;

      // ── Tide / Current ────────────────────────────────────────────────────
      case "tide_current_movement":
        if (score >= ENGINE_SCORE_EPSILON) {
          if (metabolicDemandsSlowFinesse) {
            // Active tide suggests pace-matching, but metabolic state demands slow
            hints.push(
              "Active tidal current: use the flow to drift your presentation slowly and naturally — don't speed up to match current; metabolic conditions require a measured pace.",
            );
          } else {
            hints.push(
              "Active tidal current: pace the retrieve to work with the flow — matching or slightly exceeding current speed often triggers more than fighting it.",
            );
          }
        } else if (score <= -ENGINE_SCORE_EPSILON) {
          hints.push(
            "Minimal current today: no flow to concentrate fish — precise methodical presentation beats covering water fast; fish aren't stacked by current.",
          );
        }
        break;

      // ── Pressure ──────────────────────────────────────────────────────────
      case "pressure_regime":
        if (label === "falling_hard") {
          if (metabolicDemandsSlowFinesse) {
            // Fast-dropping pressure normally calls for reaction triggers, but metabolic state overrides
            hints.push(
              "Pressure dropping hard: short window, but metabolic conditions require slow deliberate presentations — short precise moves over fast reaction triggers.",
            );
          } else {
            hints.push(
              "Pressure dropping hard: short window — decisive reaction-style presentations outperform slow drawn-out sequences; fish can go off the bite quickly.",
            );
          }
        } else if (label === "volatile") {
          if (metabolicDemandsSlowFinesse) {
            hints.push(
              "Unsettled pressure: commitment windows are short — keep presentations brief and deliberate; slow finesse over fast covering.",
            );
          } else {
            hints.push(
              "Unsettled pressure: commitment windows are short — compact decisive presentations beat slow drawn-out ones; don't linger on one retrieve pattern.",
            );
          }
        } else if (label === "rising_slow") {
          hints.push(
            "Pressure slowly recovering: fish are gradually re-engaging — start subtle and build toward more confident presentations as the session progresses.",
          );
        } else if (label === "recently_stabilizing") {
          hints.push(
            "Pressure has settled after earlier swings: let the spot reload and fish it methodically before bouncing around too fast.",
          );
        }
        break;

      // temperature_condition tip context is handled by metabolicConstraint()
      default:
        break;
    }
  }

  return hints;
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
  const snap = cc?.environment_snapshot;
  const tempF = snap?.daily_mean_air_temp_f ?? snap?.current_air_temp_f ?? null;
  const lo = snap?.daily_low_air_temp_f ?? null;
  const hi = snap?.daily_high_air_temp_f ?? null;
  const tempLowHigh =
    lo != null &&
      hi != null &&
      Number.isFinite(lo) &&
      Number.isFinite(hi)
      ? { low: lo, high: hi }
      : null;
  const diurnalRange =
    tempLowHigh != null ? Math.round(tempLowHigh.high - tempLowHigh.low) : null;

  // Build factors in exact report.drivers / report.suppressors order
  const positiveFactors: string[] = report.drivers.map((d) => {
    const norm = cc?.normalized_variable_scores.find((v) => v.variable_key === d.variable);
    if (!norm) return variableKeyToName(d.variable);
    const plain = variableToPlain(
      d.variable,
      norm.engine_label,
      norm.engine_score,
      d.variable === "temperature_condition" ? tempF : null,
      d.variable === "temperature_condition" ? tempLowHigh : null,
    );
    return `${variableKeyToName(d.variable)}: ${plain}`;
  });

  const limitingFactors: string[] = report.suppressors.map((s) => {
    const norm = cc?.normalized_variable_scores.find((v) => v.variable_key === s.variable);
    if (!norm) return variableKeyToName(s.variable);
    const plain = variableToPlain(
      s.variable,
      norm.engine_label,
      norm.engine_score,
      s.variable === "temperature_condition" ? tempF : null,
      s.variable === "temperature_condition" ? tempLowHigh : null,
    );
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

  /** Neutral metabolic: headline + timing come from the engine; LLM only voices labels/tip/solunar. */
  const engineOwnsHeadlineTiming = (cc?.temperature_metabolic_context ?? "neutral") === "neutral";

  const thermalBlockFull: string[] = engineOwnsHeadlineTiming
    ? []
    : [
      "HARD RULES — TEMPERATURE",
      "°F in factor lines = AIR only, never numeric water temp. Water feel: words only (warm, cool, cold, …).",
      tempLowHigh != null
        ? `Forecast air ~${Math.round(tempLowHigh.low)}°F (low) to ~${Math.round(tempLowHigh.high)}°F (high). Representative model temp is not always the daily high — see snapshot.`
        : tempF != null
          ? `Representative air ~${Math.round(tempF)}°F — context only.`
          : "No air range in snapshot — do not invent highs/lows.",
      // Diurnal swing instruction removed — was causing LLM to generate "large range" timing language.
      // ...(diurnalRange != null && diurnalRange >= AIR_TEMP_LARGE_DIURNAL_SWING_F
      //   ? [
      //     `~${diurnalRange}°F diurnal swing: tie timing prose to BEST TIME below (not heat stress unless heat_limited).`,
      //   ]
      //   : []),
      "",
      "HARD RULES — SUMMARY + TIMING vs METABOLIC",
      `temperature_metabolic_context=${cc?.temperature_metabolic_context ?? "unknown"}; metabolic_state=${metabolicState}; band=${cc?.temperature_band ?? "unknown"}; avoid_midday_for_heat=${cc?.avoid_midday_for_heat === true ? "true" : "false"}.`,
      metabolicState === "heat_limited"
        ? "You MAY name heat/peak warmth as narrowing the bite; stay consistent with TIP DIRECTION. Do not blame cold as limiter."
        : metabolicState === "cold_limited"
          ? "You MAY name cold as slowing/narrowing; stay consistent with TIP DIRECTION. Do not blame heat as limiter."
          : "Do not treat heat or frigid air as the bite limiter unless this line is heat_limited/cold_limited above. Cool morning + warmer afternoon is normal, not heat stress.",
      "",
    ];

  const thermalBlockSlim: string[] = engineOwnsHeadlineTiming
    ? [
      "<output_scope>",
      "engine_owns_headline_and_timing: true",
      "Return summary_line and timing_insight each as exactly \".\" (one period). The server replaces them with engine text.",
      "Focus on driver_labels, suppressor_labels, actionable_tip, solunar_note only.",
      "voice_mode and lead_angle below = tone for those fields only, not for headline/timing.",
      "</output_scope>",
      "",
      "TEMPERATURE (for paraphrasing driver/suppressor lines only)",
      "°F = AIR, never numeric water temp.",
      `avoid_midday_for_heat=${cc?.avoid_midday_for_heat === true ? "true" : "false"} — when false, do NOT frame warm afternoons as a negative or suggest avoiding midday due to heat.`,
      "CRITICAL: temperature_metabolic_context is neutral — heat and cold are NOT constraining today. Do NOT write heat-avoidance or cold-stress language in driver_labels. No phrases like 'heat trims the window', 'cooler edges of the day', 'warm stretch limits action', 'cold slows the bite', or similar. Describe temperature as a neutral-to-positive factor.",
      "",
    ]
    : [];

  const lines: string[] = [
    `<voice_mode>${voiceMode}</voice_mode>`,
    `<lead_angle>${openerAngle}</lead_angle>`,
    `<generation_id>${localDate}|${report.location.latitude.toFixed(2)},${report.location.longitude.toFixed(2)}|${report.score}|${uniqueId}</generation_id>`,
    "",
    "FISHING CONDITIONS BRIEF",
    "═══════════════════════",
    ...thermalBlockSlim,
    ...thermalBlockFull,
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
    ...(engineOwnsHeadlineTiming
      ? []
      : [
        "",
        "BEST TIME TO FISH",
        formatTimingSection(report),
      ]),
    "",
    "SOLUNAR CONTEXT",
    solunarLine,
    "",
    "TIP DIRECTION",
    `Focus: ${tipLaneToPlain(tipLane)}`,
    `Instruction: ${tipInstruction}`,
    `Fish activity / metabolic state: ${metabolicConstraint(metabolicState, report.band)}`,
    ...(() => {
      const hints = deriveTipContextFromVariables(report, metabolicState);
      if (hints.length === 0) return [];
      return [
        "Mechanical context — tip must match ALL of these (already resolved vs metabolic state):",
        ...hints.map((h) => `  • ${h}`),
      ];
    })(),
    "Tip: one mechanical change (lure/fly work only). No where/when/tides/depth/stealth.",
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
