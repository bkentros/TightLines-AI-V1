/**
 * recommenderPolish/mod.ts
 *
 * LLM narration layer for the gear recommender. Follows the same architecture
 * as howFishingPolish: the deterministic engine decides everything, the LLM
 * only provides voice and personality.
 *
 * The brief builder translates all engine output into structured plain English
 * so the LLM never needs to interpret raw scores or IDs.
 */

import type {
  RecommenderGearMode,
  RecommenderResponse,
} from "../recommenderEngine/contracts.ts";
import type { BehaviorResolution } from "../recommenderEngine/modifiers.ts";
import { archetypeLabel } from "../recommenderEngine/narration.ts";

// ── Model config (matches how-fishing) ──────────────────────────────────────

export const LLM_MODEL = "gpt-5.4-mini";

// ── System prompt ───────────────────────────────────────────────────────────

const RECOMMENDER_LLM_SYSTEM = `You are the voice of TightLines AI — a confident, experienced fishing guide giving an angler a direct gear recommendation. The deterministic engine already decided what to throw, where fish are, and how they are acting. Your job is to voice those decisions with personality and authority. You add nothing new — you translate and humanize what is already in the brief.

Voice and tone:
- Direct and confident. Never hedge. Never write "might want to consider," "you may want to try," "could be worth exploring," or any variation.
- Human. You sound like a person, not an app. You have a read on today. You have been on this water type.
- Second person only: "you" and "your." Never "the angler," "one should," or "anglers."
- Reference the location by name when provided. Make it feel specific and personal.

════ RULE #1 — CLEAR, NATURAL VOICE ════
Write the way a sharp guide talks at the ramp. Clear sentences, confident tone, no jargon soup. Smooth English beats forced "unique" phrasing every time. Say what the gear does and why it fits today — not how the fishing "feels" in the abstract.

Banned words and constructions — never use under any circumstances:
• "sweet spot" in any form
• "game plan"
• "get after it"
• "dialing in" or "dial it in"
• "don't sleep on"
• "worth noting"
• "that said"
• "at the end of the day"
• "conditions are lining up" or "lining up nicely"
• "this time of year" as a vague catch-all
• "conditions are [adjective]" as an opener
• "It's a [adjective] day for fishing"
• "a versatile option" — say why it fits today specifically
• "depending on conditions" in any form
• "adjust if conditions shift"
• "let the fish tell you"
• "read the water" as a directive
• "stay flexible" in any form
• Any phrase that reads like a variable was swapped into a template

Banned pressure clichés:
• "barometric pressure has been" + anything
• "pressure is unstable" or "pressure remains unstable"
• "fish tend to shut down" in any form
• "fish may be shut down"
• "bouncing around" to describe pressure
• "pressure-sensitive" in any form
• "fish are likely less active" or "activity is suppressed"
• The word "erratic" anywhere in output

Banned vague tip language:
• "work it through the strike zone" without naming pace and depth
• "keep it in the feeding lane" without naming pace and depth
• "match the retrieve to the conditions"
• "be patient" without saying what patient means mechanically
• "slow things down" without naming the actual pace or action
• "cover water" as the main advice without naming how

════ RULE #2 — PRESENTATION_TIP SCOPE (HARD CONSTRAINT) ════
The presentation_tip answers ONE question only: how should the angler work the primary family right now. It must stay inside exactly one of these pillars:
1) Pace / speed — dead slow, slow, medium, burn. Name it explicitly.
2) Lane / depth — upper lane, mid lane, lower lane, bottom. Name it explicitly.
3) Action / motion — steady, twitch-pause, yo-yo, natural drift, hopping, bottom contact. Name it.
4) Finesse vs power — light touch, long pauses, aggressive commitment, confident rod work.

FORBIDDEN in presentation_tip:
- Where to fish: specific structure, edges, banks, points, grass lines, channel edges, current seams
- When to fish: time of day, tidal windows, solunar, "first light," "before the heat," "evening window"
- Species identification, spawning behavior, or any fish biology
- Mechanics from backup families — if alternates are listed they are backups only, never mix their retrieves into the tip
- Invented mechanics not explicitly present in the brief (hops, drags, snaps, shakes, swing instructions unless those exact words appear)

════ RULE #3 — NEVER ECHO PAYLOAD LABELS ════
The brief contains internal engine labels: "fall_feed," "finesse_best," "baitfish_match," "seam_oriented," "hatch_window," "current_drift_best." These are data classifications. Never copy, paraphrase, or directly translate them into output.

Translate engine language into plain guide speech:
- Do not write "fish are in fall feed mode" — say "fish are aggressively stacking calories ahead of winter"
- Do not write "finesse best conditions" — say "long pauses and a light touch are what's earning bites right now"
- Do not write "baitfish match is active" — say "fish are locked on baitfish schools"
- Do not write "hatch window" — say "insects are hatching" or "there's surface activity building"

════ NEVER NAME A SPECIES ════
Never write bass, trout, redfish, snook, tarpon, salmon, steelhead, walleye, pike, smallmouth, largemouth, speckled trout, or any other specific fish name. Say "fish" only, always.

Air vs water temperatures: never write a numeric water temperature. Degrees in the brief mean AIR only. Water feel is words only (warm, cool, cold, chilly).

Output: valid JSON only — no markdown, no extra keys, no commentary outside the object:
{"headline":"…","where_insight":"…","behavior_read":"…","presentation_tip":"…"}`;

// ── Voice diversity ─────────────────────────────────────────────────────────

const VOICE_MODES = [
  "Write like a guide who just scouted this water and is giving the angler a confident game plan.",
  "Write punchy and direct. Short sentences. Say what to throw, where, and how. Zero filler.",
  "Write with knowing specificity — like someone who's fished these exact conditions before and has strong opinions.",
  "Write like you're rigging up beside the angler and telling them exactly what you'd tie on first.",
  "Write with wry confidence — be real about what's working and what's fighting you, then make the call anyway.",
  "Write with the casual certainty of someone who already knows the answer and is just sharing it.",
  "Write with measured authority — every word backed by time on the water. No fluff, no hedging.",
  "Write with energy that matches the conditions — fired up when it earns it, dry and tactical when it doesn't.",
];

const LEAD_ANGLES = [
  "Lead with the top family — name it and say exactly why it fits today's conditions.",
  "Lead with where fish are sitting and what that means for how to present.",
  "Lead with the seasonal story — what this time of year demands from the angler.",
  "Lead with the daily conditions angle — what today's weather is doing to fish and how to use it.",
  "Lead with the behavior read — how fish are acting right now and what that demands from the presentation.",
  "Lead with the presentation approach — the specific pace, depth, and action that conditions are calling for.",
  "Lead with the water type — what fishing this body of water well looks like on a day like today.",
  "Lead with the forage — what fish are keyed on and how to match it with the primary family.",
  "Lead with the clarity and light — how visibility is shaping the bite and what that demands from color and speed.",
  "Lead with what the engine is saying is the strongest signal today — one clear statement of what to do and why.",
];

// ── Label helpers ───────────────────────────────────────────────────────────

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

function seasonPhaseToPlain(phase: string): string {
  const map: Record<string, string> = {
    winter_hold: "winter hold — fish are sluggish and deep",
    spring_transition: "spring transition — fish are moving shallow as water warms",
    warm_transition: "warm transition — fish are active and feeding broadly",
    summer_pattern: "summer pattern — fish are settled into predictable summer behavior",
    summer_heat: "summer heat — fish are seeking cooler water and narrow feeding windows",
    fall_feed: "fall feed — fish are aggressive and stacking calories",
    late_fall: "late fall — fish are slowing down and shifting deeper",
  };
  return map[phase] ?? phase.replaceAll("_", " ");
}

function climateBandToPlain(band: string): string {
  const map: Record<string, string> = {
    cold: "cold-climate zone",
    maritime: "maritime / mild-winter zone",
    temperate: "temperate interior zone",
    alpine: "high-altitude / alpine zone",
    arid: "arid / desert zone",
    warm: "warm-climate zone",
    tropical: "tropical / subtropical zone",
  };
  return map[band] ?? band;
}

function depthLabel(id: string): string {
  const map: Record<string, string> = {
    very_shallow: "very shallow water",
    shallow: "shallow water",
    upper_column: "the upper water column",
    mid_depth: "mid-depth water",
    lower_column: "the lower water column",
    deep: "deep water",
    bottom_oriented: "bottom-oriented lanes",
  };
  return map[id] ?? id.replaceAll("_", " ");
}

function relationLabel(id: string): string {
  const map: Record<string, string> = {
    cover_oriented: "cover",
    vegetation_oriented: "vegetation and weed lines",
    edge_oriented: "edges and transitions",
    structure_oriented: "hard structure",
    current_break_oriented: "current breaks",
    channel_related: "channel edges",
    flats_related: "open flats",
    shoreline_cruising: "shoreline",
    open_water_roaming: "open water",
    shade_oriented: "shaded areas",
    depth_transition_oriented: "depth transitions",
    undercut_bank_oriented: "undercut banks",
    hole_oriented: "deeper holes",
    seam_oriented: "current seams",
    point_oriented: "points",
    drain_oriented: "drains",
    grass_edge_oriented: "grass edges",
    pothole_oriented: "potholes",
    trough_oriented: "troughs",
    oyster_bar_oriented: "oyster bars",
    marsh_edge_oriented: "marsh edges",
    riffle_oriented: "riffles and pocket water",
    tailout_oriented: "tailouts",
    pool_oriented: "pools",
  };
  return map[id] ?? id.replaceAll("_", " ");
}

function styleFlagToPlain(flag: string): string {
  const map: Record<string, string> = {
    finesse_best: "light touch and long pauses are winning",
    tight_to_cover: "fish are tucked tight to cover",
    horizontal_search_best: "fish are willing to intercept a moving presentation",
    topwater_window: "surface conditions are favorable",
    slow_bottom_best: "slow bottom contact is the right call",
    current_drift_best: "fish are keyed on the current",
    draining_window_best: "falling water is pulling fish toward drains and outflows",
    flooding_window_best: "rising water is pushing fish onto the flats",
    baitfish_match: "fish are locked onto baitfish",
    willing_to_chase: "fish will commit from a distance",
    hatch_window: "an insect hatch is building or active",
  };
  return map[flag] ?? flag.replaceAll("_", " ");
}

function activityExplanation(activity: string, seasonPhase: string): string {
  if (activity === "inactive") return "metabolism is low — fish are not moving far or striking aggressively";
  if (activity === "neutral") return "fish are present but not committing freely — deliberate presentations win";
  if (activity === "aggressive") return "fish are running hot — they'll chase and hit hard";
  // active
  if (seasonPhase === "fall_feed") return "fall feed mode — fish are actively hunting";
  if (seasonPhase === "warm_transition") return "warming water has fish fired up and willing to eat";
  return "fish are actively feeding and willing to move for the right presentation";
}

function strikeExplanation(zone: string): string {
  if (zone === "narrow") return "fish need the presentation close and precise — no room for sloppy casts";
  if (zone === "wide") return "fish are intercepting from a distance — cover water confidently";
  return "moderate zone — clean presentations within a few feet will draw strikes";
}

function chaseExplanation(radius: string): string {
  if (radius === "short") return "fish are not chasing — put it right on them";
  if (radius === "long") return "fish are willing to cover ground for food";
  return "moderate willingness to move — a few feet of chase is realistic";
}

function metabolicConstraint(activity: string, seasonPhase: string): string {
  if (activity === "inactive" || seasonPhase === "winter_hold") {
    return "COLD / INACTIVE conditions — mandatory slow-down. NEVER suggest fast retrieves, aggressive rips, or power fishing. Finesse and patience are the only correct calls.";
  }
  if (seasonPhase === "summer_heat") {
    return "HEAT is narrowing the bite window. Finesse leans are appropriate; avoid writing as if fish are aggressive all day.";
  }
  if (activity === "aggressive") {
    return "Conditions are favorable — fish are committing. Match that energy. Medium-to-active pace is appropriate.";
  }
  if (activity === "active") {
    return "Fish are active and feeding. Medium pace is the safe default, but bolder presentations can earn extra bites.";
  }
  return "Fish are present but picky. Clean, deliberate presentation beats power. Medium pace is the safe default.";
}

function modifierToPlain(mod: string): string {
  const map: Record<string, string> = {
    very_cold_temperature_band: "Very cold air temperatures",
    cool_temperature_band: "Below-average air temperatures",
    optimal_temperature: "Air temps right in the seasonal sweet spot",
    very_warm_temperature: "Hot air temperatures narrowing windows",
    warming_trend: "Warming trend over recent days",
    cooling_trend: "Cooling trend over recent days",
    sharp_cooldown: "Sharp temperature drop",
    sharp_warmup: "Sharp temperature spike",
    positive_pressure: "Rising barometric pressure",
    negative_pressure: "Falling barometric pressure",
    strong_wind: "Strong wind conditions",
    exposed_wind_calm: "Calm, exposed conditions",
    low_light_conditions: "Low light / overcast skies",
    bright_conditions: "Bright, clear skies",
    light_precipitation: "Light precipitation",
    heavy_precipitation: "Heavy precipitation disruption",
    high_runoff: "High river flows / runoff",
    rising_tide_active: "Active rising tide",
    falling_tide_drain_focus: "Falling tide — drains and outflows",
    seasonal_activity_cap: "Seasonal ceiling on fish activity",
    dirty_water_profile: "Stained or dirty water",
    clear_water_profile: "Clear water conditions",
  };
  return map[mod] ?? mod.replaceAll("_", " ");
}

// ── Context guide ───────────────────────────────────────────────────────────

function contextGuideForRecommender(ctx: string): string {
  if (ctx === "freshwater_lake_pond") {
    return [
      "LAKE / POND GUIDE — things that matter here:",
      "• Fish locate on structure, depth transitions, and vegetation. Their depth shifts with season and time of day.",
      "• Thermoclines, weed edges, and points concentrate fish. Be precise about the depth zone.",
      "• Surface presentations are a narrow seasonal window (warm months, low-light hours). Outside that, go subsurface.",
      "• Clarity drives how tight fish relate to cover. Dirty water = tight to cover. Clear water = fish can see from farther.",
      "• Wind-blown banks and current from inlets create temporary feeding lanes.",
    ].join("\n");
  }
  if (ctx === "freshwater_river") {
    return [
      "RIVER / STREAM GUIDE — things that matter here:",
      "• Current defines everything. Fish hold in seams, behind obstructions, in pools, and in tailouts.",
      "• Riffles are feeding zones — fish ambush food tumbling through. Dead-drifts and tight swings work.",
      "• Pools concentrate fish in cold or low-activity windows. Slow and deep is the call.",
      "• Tailouts gather fish that have vacated riffles. Mid-depth, slower pace.",
      "• Flow level matters: high runoff pushes fish to the banks and slackwater edges.",
      "• Hatch activity can completely override depth and structure logic — insects in the film beat everything.",
    ].join("\n");
  }
  if (ctx === "coastal_flats_estuary") {
    return [
      "FLATS / ESTUARY GUIDE — things that matter here:",
      "• Tidal movement controls everything. Rising tide spreads fish onto the flats. Falling tide pulls them back toward drains and deeper cuts.",
      "• During the flooding window, fish cruise and cover ground aggressively — intercept patterns work.",
      "• During the draining window, fish stack near drain mouths, troughs, and pothole edges.",
      "• Clarity dictates how close to present. Clear flats = stealthy approach and precise casts.",
      "• Oyster bars, potholes, and grass edges are prime ambush spots on every tide phase.",
    ].join("\n");
  }
  // coastal
  return [
    "COASTAL / INSHORE GUIDE — things that matter here:",
    "• Structure is the anchor. Jetties, ledges, points, channel edges, and drop-offs hold fish.",
    "• Tide phasing shapes activity windows — fish move and feed aggressively on tide transitions.",
    "• Current seams near structure are the most reliable contact points.",
    "• Surf zone fish often hold in troughs and behind bars — read the water for the feeding lane.",
    "• Baitfish schools drive everything in open coastal water. Presence of birds or surface bust-ups is the signal.",
  ].join("\n");
}

// ── Brief builder ───────────────────────────────────────────────────────────

export type RecommenderBriefInput = {
  response: RecommenderResponse;
  behavior: BehaviorResolution;
  localDate: string;
  locationName: string | null;
};

function choosePrimaryTrack(response: RecommenderResponse): {
  kind: RecommenderGearMode;
  family: RecommenderResponse["lure_rankings"][number] | RecommenderResponse["fly_rankings"][number] | undefined;
  alternate: RecommenderResponse["lure_rankings"][number] | RecommenderResponse["fly_rankings"][number] | undefined;
} {
  const topLure = response.lure_rankings[0];
  const topFly = response.fly_rankings[0];
  const topLure2 = response.lure_rankings[1];
  const topFly2 = response.fly_rankings[1];

  return !topFly || (topLure != null && topLure.score >= topFly.score)
    ? { kind: "lure", family: topLure, alternate: topLure2 }
    : { kind: "fly", family: topFly, alternate: topFly2 };
}

export function buildRecommenderBrief(input: RecommenderBriefInput): string {
  const { response, behavior, localDate, locationName } = input;
  const voiceMode = VOICE_MODES[Math.floor(Math.random() * VOICE_MODES.length)]!;
  const leadAngle = LEAD_ANGLES[Math.floor(Math.random() * LEAD_ANGLES.length)]!;
  const generationId = `rec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  const topDepth = response.fish_behavior.position.depth_lanes[0];
  const topRelation = response.fish_behavior.position.relation_tags[0];
  const secondRelation = response.fish_behavior.position.relation_tags[1];
  const topArchetype = response.presentation_archetypes[0];
  const fb = response.fish_behavior.behavior;

  const topLure = response.lure_rankings[0];
  const topFly = response.fly_rankings[0];
  const primaryTrack = choosePrimaryTrack(response);

  const lines: string[] = [
    `<generation_id>${generationId}</generation_id>`,
    `<uniqueness_directive>This is generation ${generationId}. Do NOT recycle the opening 6 words from any prior response. Every headline must start fresh.</uniqueness_directive>`,
    `<voice_mode>${voiceMode}</voice_mode>`,
    `<lead_angle>${leadAngle}</lead_angle>`,
    "",
    "GEAR RECOMMENDATION BRIEF",
    "═════════════════════════",
    "",
    "SEASONAL CONTEXT",
    "─────────────────",
    `Location: ${locationName ?? "coordinates provided"}`,
    `Water type: ${contextToPlain(response.context)}`,
    `Season: ${seasonFromDate(localDate)}`,
    `Climate band: ${climateBandToPlain(behavior.climate_band)}`,
    `Season phase: ${seasonPhaseToPlain(behavior.season_phase)}`,
    "",
    "<context_guide>",
    contextGuideForRecommender(response.context),
    "</context_guide>",
    "",
    "DAILY CONDITIONS PICTURE",
    "────────────────────────",
  ];

  for (const mod of behavior.active_modifiers) {
    lines.push(`→ ${modifierToPlain(mod)}`);
  }
  lines.push(`→ Water clarity: ${behavior.inferred_clarity}`);
  lines.push(`→ Light profile: ${behavior.light_profile.replaceAll("_", " ")}`);
  lines.push(`→ Current profile: ${behavior.current_profile}`);

  const missing = response.shared_condition_summary.reliability !== "high"
    ? "Some condition data is thin — stay broad."
    : "Full data available — write with normal confidence.";
  lines.push(`Data quality: ${missing}`);
  lines.push("");

  if (response.shared_condition_summary.drivers.length > 0) {
    lines.push("WHAT'S HELPING");
    for (const d of response.shared_condition_summary.drivers) {
      lines.push(`→ ${d.label}`);
    }
    lines.push("");
  }
  if (response.shared_condition_summary.suppressors.length > 0) {
    lines.push("WHAT'S LIMITING");
    for (const s of response.shared_condition_summary.suppressors) {
      lines.push(`→ ${s.label}`);
    }
    lines.push("");
  }

  lines.push("WHERE FISH ARE RIGHT NOW");
  lines.push("────────────────────────");
  lines.push(`Primary depth zone: ${topDepth ? depthLabel(topDepth.id) : "mid-depth water"}`);
  lines.push(`Key positioning: relating to ${topRelation ? relationLabel(topRelation.id) : "edges and transitions"}`);
  if (secondRelation) {
    lines.push(`Secondary positioning: ${relationLabel(secondRelation.id)}`);
  }
  lines.push("");

  lines.push("HOW FISH ARE BEHAVING");
  lines.push("─────────────────────");
  lines.push(`Activity: ${fb.activity} — ${activityExplanation(fb.activity, behavior.season_phase)}`);
  lines.push(`Strike zone: ${fb.strike_zone} — ${strikeExplanation(fb.strike_zone)}`);
  lines.push(`Chase radius: ${fb.chase_radius} — ${chaseExplanation(fb.chase_radius)}`);
  if (fb.style_flags.length > 0) {
    lines.push(`Style signals: ${fb.style_flags.map(styleFlagToPlain).join("; ")}`);
  }
  lines.push("");

  lines.push("BEST PRESENTATION APPROACH");
  lines.push("──────────────────────────");
  if (topArchetype) {
    lines.push(`Lead archetype: ${archetypeLabel(topArchetype.archetype_id)}`);
    lines.push(`Speed: ${topArchetype.speed.replaceAll("_", " ")}`);
    lines.push(`Key motions: ${topArchetype.motions.map((m) => m.replaceAll("_", " ")).join(", ") || "n/a"}`);
    lines.push(`Key triggers: ${topArchetype.triggers.map((t) => t.replaceAll("_", " ")).join(", ") || "n/a"}`);
    lines.push(`Depth target: ${topArchetype.depth_target.replaceAll("_", " ")}`);
  }
  lines.push("");

  lines.push("PRIMARY NARRATIVE TRACK");
  lines.push("───────────────────────");
  if (primaryTrack.family) {
    lines.push(`Primary gear track: ${primaryTrack.kind}`);
    lines.push(`Primary family: ${primaryTrack.family.display_name}`);
    lines.push(`Primary setup: ${primaryTrack.family.best_method.setup_label}`);
    lines.push(
      `Primary presentation guide: ${primaryTrack.family.best_method.presentation_guide.pace} pace, ` +
        `${primaryTrack.family.best_method.presentation_guide.lane} lane, ` +
        `${primaryTrack.family.best_method.presentation_guide.action}`,
    );
    lines.push(`Public guidance line: ${primaryTrack.family.best_method.presentation_guide.summary}`);
    lines.push(
      `Internal method reference only: ${primaryTrack.family.best_method.label} — ${primaryTrack.family.best_method.presentation_note}`,
    );
    if (primaryTrack.alternate) {
      lines.push(`Backup on same gear track: ${primaryTrack.alternate.display_name}`);
    }
    const alternateMode = primaryTrack.kind === "lure" ? topFly : topLure;
    if (alternateMode) {
      lines.push(`Backup on the other gear track: ${alternateMode.display_name}`);
    }
  }
  if (primaryTrack.family?.color_profile_guidance?.length) {
    lines.push(`Color guidance: ${primaryTrack.family.color_profile_guidance.join(", ")}`);
  }
  lines.push("");

  lines.push("METABOLIC / ACTIVITY CONSTRAINT");
  lines.push("───────────────────────────────");
  lines.push(metabolicConstraint(fb.activity, behavior.season_phase));
  lines.push("");

  const dayparts = behavior.best_dayparts;
  if (dayparts.length > 0) {
    lines.push("BEST TIMING WINDOWS");
    lines.push("────────────────────");
    lines.push(dayparts.join(", "));
    lines.push("");
  }

  lines.push("<output_contract>");
  lines.push("Each output field must satisfy these rules — no exceptions:");
  lines.push("");
  lines.push('headline (1 sentence, ≤ 22 words):');
  lines.push("  • State the primary family and the single most important reason it fits today.");
  lines.push("  • Must not start with 'The,' 'Today,' or the water type.");
  lines.push("  • Must not name a species. Must not use any banned word.");
  lines.push("");
  lines.push('where_insight (1–2 sentences, ≤ 40 words):');
  lines.push("  • Say what depth zone fish are in and what structure or cover they are near.");
  lines.push("  • Must be specific to today's depth zone and relation from the brief.");
  lines.push("  • Do not say 'edges,' 'areas,' or 'spots' without naming the specific type.");
  lines.push("");
  lines.push('behavior_read (1–2 sentences, ≤ 40 words):');
  lines.push("  • Say how fish are acting and what that demands from the angler.");
  lines.push("  • Must reference activity level in plain English (no label echoing).");
  lines.push("  • Must not include any presentation instruction — that belongs in presentation_tip.");
  lines.push("");
  lines.push('presentation_tip (1–2 sentences, ≤ 50 words):');
  lines.push("  • Name pace, depth lane, and one motion or action type. All three, explicitly.");
  lines.push("  • Must match the pace/lane/action from the primary presentation guide.");
  lines.push("  • Must not name structure, location, species, or timing windows.");
  lines.push("  • Must not reference backup families or their retrieve mechanics.");
  lines.push("</output_contract>");
  lines.push("");

  lines.push("INSTRUCTIONS FOR OUTPUT");
  lines.push("───────────────────────");
  lines.push("Write with confident authority. You are a guide who already knows what's working.");
  lines.push("No hedge words (might, could, possibly, perhaps, maybe).");
  lines.push("No engine jargon (activity_index, relation_tag, archetype_id).");
  lines.push("No numeric water temperatures — air temps in °F only.");
  lines.push("Do not contradict the metabolic constraint above.");
  lines.push("The primary family, primary setup, and primary presentation guide are the truth.");
  lines.push("The output_contract above is a hard constraint — every field must satisfy its rules.");
  lines.push("Do not borrow cadence, depth behavior, or motion from any backup option.");
  lines.push("The engine already decided WHERE/HOW/WHAT — you voice it with personality.");

  return lines.join("\n");
}

// ── Polished output type ────────────────────────────────────────────────────

export type PolishedRecommenderCopy = {
  track_kind: RecommenderGearMode;
  headline: string;
  where_insight: string;
  behavior_read: string;
  presentation_tip: string;
};

// ── Sanitize ────────────────────────────────────────────────────────────────

function stripNumericWaterTemp(text: string): string {
  if (!text) return text;
  let s = text;
  s = s.replace(/\b\d{1,3}\s*°?\s*F?\s*[-\s]?degree\s+water\b/gi, "warm water");
  s = s.replace(/\b\d{1,3}\s*°\s*water\b/gi, "warm water");
  s = s.replace(/\bwater\s+(?:temp(?:erature)?s?|temperature)\s*(?:of|at|around|near|about|is)?\s*\d{1,3}\s*°?\s*F?\b/gi, "water conditions");
  s = s.replace(/\bwater\s+(?:at|around|near|of|about)\s+\d{1,3}\s*°?\s*F?\b/gi, "water");
  return s.replace(/\s{2,}/g, " ").trim();
}

const SPECIES_TERM_RE =
  /\b(?:striped bass|sea trout|speckled trout|smallmouth|largemouth|bass|trout|redfish|snook|tarpon|steelhead|salmon|striper)\b/gi;

function stripSpeciesClaims(text: string): string {
  if (!text) return text;
  return text.replace(SPECIES_TERM_RE, "fish").replace(/\s{2,}/g, " ").trim();
}

function violatesBroadActionGuide(
  text: string,
  guide: RecommenderResponse["lure_rankings"][number]["best_method"]["presentation_guide"] | undefined,
): boolean {
  if (!guide || !text) return false;
  const lower = text.toLowerCase();

  if (
    guide.action !== "bottom contact" &&
    (/\bhop\b/.test(lower) || /\bdrag\b/.test(lower) || /\bcrawl\b/.test(lower) || lower.includes("bottom contact"))
  ) {
    return true;
  }
  if (
    guide.action !== "natural drift" &&
    (lower.includes("dead-drift") || lower.includes("dead drift") || /\bswing\b/.test(lower))
  ) {
    return true;
  }
  if (
    guide.action !== "surface commotion" &&
    (/\bpop\b/.test(lower) || /\bwalk\b/.test(lower))
  ) {
    return true;
  }
  return false;
}

function sanitizePolishedField(text: string): string {
  let s = stripSpeciesClaims(stripNumericWaterTemp(text));
  s = s.replace(/\b(upper|mid|lower|bottom)(?:-|\s)lane\s+lane\b/gi, "$1 lane");
  return s.replace(/\s{2,}/g, " ").trim();
}

// ── OpenAI call ─────────────────────────────────────────────────────────────

export async function polishRecommenderOutput(
  openaiKey: string,
  briefText: string,
  response: RecommenderResponse,
  trackKind: RecommenderGearMode,
): Promise<{ polished: PolishedRecommenderCopy; inT: number; outT: number } | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        max_completion_tokens: 1024,
        reasoning_effort: "none",
        temperature: 0.82,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: RECOMMENDER_LLM_SYSTEM },
          { role: "user", content: briefText },
        ],
      }),
    });

    if (!res.ok) {
      console.error("[recommender-polish] OpenAI returned", res.status);
      return null;
    }

    const json = await res.json() as {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens: number; completion_tokens: number };
    };

    const text = json.choices?.[0]?.message?.content ?? "";
    const inT = json.usage?.prompt_tokens ?? 0;
    const outT = json.usage?.completion_tokens ?? 0;

    const parsed = JSON.parse(text) as Record<string, unknown>;
    const primaryTrack = choosePrimaryTrack(response);
    const primaryGuide = primaryTrack.family?.best_method.presentation_guide;

    const headline = typeof parsed.headline === "string"
      ? sanitizePolishedField(parsed.headline.slice(0, 280))
      : "";
    const where_insight = typeof parsed.where_insight === "string"
      ? sanitizePolishedField(parsed.where_insight.slice(0, 280))
      : "";
    const behavior_read = typeof parsed.behavior_read === "string"
      ? sanitizePolishedField(parsed.behavior_read.slice(0, 280))
      : "";
    let presentation_tip = typeof parsed.presentation_tip === "string"
      ? sanitizePolishedField(parsed.presentation_tip.slice(0, 280))
      : "";
    if (violatesBroadActionGuide(presentation_tip, primaryGuide)) {
      presentation_tip = primaryGuide?.summary ?? presentation_tip;
    }

    if (!headline && !where_insight && !behavior_read && !presentation_tip) {
      console.error("[recommender-polish] all fields empty after parse");
      return null;
    }

    return {
      polished: { track_kind: trackKind, headline, where_insight, behavior_read, presentation_tip },
      inT,
      outT,
    };
  } catch (e) {
    console.error("[recommender-polish] failed:", e);
    return null;
  }
}

export function primaryTrackKind(response: RecommenderResponse): RecommenderGearMode {
  return choosePrimaryTrack(response).kind;
}
