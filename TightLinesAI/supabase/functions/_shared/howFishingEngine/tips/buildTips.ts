import type {
  ActionableTipTag,
  DaypartNotePreset,
  EngineContext,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import type { ActiveVariableScore } from "../score/types.ts";

export type EngineTipDaypartBundle = {
  actionable_tip: string;
  actionable_tip_tag: ActionableTipTag;
  daypart_note: string | null;
  daypart_preset: DaypartNotePreset | null;
};

export type TipDaypartOptions = {
  local_date: string;
  solunar_peak_local?: string[] | null;
  /** NOAA-style high/low events (local station time) — coastal daypart hints */
  tide_high_low?: Array<{ time: string; value: number; type?: string }> | null;
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}



// ─── Tip pools — purely TACTICAL, zero timing language ──────────────────────
// These are engine-generated fallbacks. The LLM rewrites them from scratch.
// No "when to fish" content here — that lives in daypart_note exclusively.

// Strong tidal flow → how to fish it, not when
const COASTAL_TIDE_TIPS = [
  "Current is your structure — position where tidal flow deflects off any hard edge and work the seam on the swing.",
  "Fish the current breaks hard. Moving water stacks baitfish and the predators know it — work the edges, not the open flow.",
  "Let the tide do the work. Cast uptide or across, keep contact, and hit the feeding lane as the offering swings through.",
  "Target the transition zones where current eases — that's where fish post up to intercept without fighting the flow.",
  "Work the points and structure pockets where tidal push creates ambush zones. Fish are positioned there, not in the main flow.",
  "Strong current means fish are facing into it. Approach from downtide and put the offering in front of them, not behind.",
  "Current-driven fish are confident. You can fish with authority — cover the structure edges and key transition lines.",
];

// Wind suppressor → positioning + how to fish sheltered water tactically
const WIND_SHELTER_TIPS = [
  "Find the calm pockets — protected water concentrates fish and lets you make precise, controlled presentations.",
  "Sheltered banks aren't just comfortable — fish stack there too. Work that protected water deliberately, not quickly.",
  "Get behind structure. Fish sitting out of the wind are calmer and may require a lighter, more deliberate presentation.",
  "Wind-protected edges hold fish tight right now. Slow down once you're in the calm and pick the water apart carefully.",
  "The lee side is the play. Position there and fish methodically — breezy conditions compress fish into predictable spots.",
  "Less-exposed water concentrates fish today. Get there and fish with intention — thoroughness beats covering ground.",
  "Calm pockets are high-percentage today. Set up in the shelter and let the fish come to you rather than burning through water.",
  "Protected shorelines and cut banks are holding fish. Once you're there, soften your approach — these fish aren't spooky but they're tucked in tight.",
];

// Runoff / dirty water → visibility-adjusted tactics
const RUNOFF_TIPS = [
  "Low clarity means fish are hunting by feel and lateral line — slower retrieves with vibration or thump help them locate the offering.",
  "Stained water compresses visibility. Go bigger or louder to give fish something to find. Subtlety is wasted right now.",
  "Find the clarity edge where clean water meets turbid and fish that transition — that's where fish can actually see and intercept.",
  "Off-color conditions favor contrast. Anything with movement, vibration, or visibility earns more attention in this water.",
  "High, dirty water pushes fish tight to structure and margins. Slow down, fish the edges, and let them find the offering.",
  "Visibility is limited — fish aren't ranging far to feed. Get the presentation close, keep it slower, and put it right in their lane.",
  "In these conditions, fish are relying on senses other than sight. Prioritize feel and sound over visual appeal.",
];

// Cold band temp → fish metabolism genuinely slow, finesse-first tactics
// Only fires when temperature IS a suppressor with a cold/very_cold band_label
const TEMP_COLD_TIPS = [
  "Cold water means slow fish — match that energy with a slower retrieve and extended pauses. They'll eat, just not on your timeline.",
  "Fish are running on low-idle right now. Deliberate, finesse presentations out-earn anything aggressive.",
  "Cold-water fish won't chase. Give them something easy to intercept — keep it slow, give it time.",
  "Every pause matters more than every strip in these temps. Let the offering settle, twitch once, and hold.",
  "Cold conditions require patience. Keep the offering in the zone longer than feels right and let the fish make the move.",
  "Fish are conserving energy. Slow and subtle earns bites — anything too assertive just burns your time.",
  "Low-idle fish need a presentation that comes to them. Shrink the profile, slow the retrieve, and let pauses close the deal.",
];

// Favorable / optimal temp → active fish, confident approach earns bites
// Fires when temp is a POSITIVE driver — regardless of season
const TEMP_ACTIVE_TIPS = [
  "Fish are metabolically primed right now — a confident, assertive retrieve earns bites over timid finesse.",
  "Favorable temps mean fish are willing to commit. Cover water with purpose and trust they'll respond.",
  "Don't over-finesse this one. Conditions have fish active and a brisker pace is the right call.",
  "Fish are in a cooperative metabolic window. Keep the offering moving with confidence and cover your water.",
  "Active fish in good temps respond to authority. Move with purpose and let them commit.",
  "These conditions have fish feeding willingly. Trust the data, fish assertively, and don't slow down unless the water tells you to.",
  "Fish metabolism is on your side. A steady, purposeful retrieve gets bites — dragging it out is leaving fish behind.",
  "Temps are producing willing fish. Cover water thoroughly at a confident pace — this isn't a finesse day.",
];

// Generic fallback — methodical approach, no timing
const GENERAL_FLEXIBILITY_TIPS = [
  "Work the water methodically. Hit high-percentage structure, cover it thoroughly, and trust your proven presentations.",
  "No clear standout today — fish deliberately, stay patient, and lean on what you know works on this water.",
  "Cover your best water with intention. Today rewards persistence over anything flashy.",
  "Grind your most reliable spots and stay systematic. Patience and thoroughness win days like this.",
  "Pick your best water and fish it with intent. Conditions aren't gifting bites — earn them.",
  "Nothing stands out from the data — just put in focused time on proven structure and trust your approach.",
  "Work it methodically and stay in the water. On days like this, effort and consistency separate results.",
  "Slow down and be thorough. High-percentage spots fished carefully beat covering ground in marginal conditions.",
];

// Generic driver-based tip — condition is the lead, tactics follow
const LEAN_INTO_DRIVER_TEMPLATES: Array<(name: string) => string> = [
  (name) => `${name} is your biggest advantage today — let it shape how you approach every cast and retrieve.`,
  (name) => `Lean into ${name}. Fish are responding to it right now and your presentation should reflect that.`,
  (name) => `${name} is working in your corner today — fish with the conditions rather than against them.`,
  (name) => `Everything points to ${name} as the key variable. Let that drive your presentation choices.`,
  (name) => `${name} has fish primed right now — fish with that advantage in mind and don't overthink it.`,
  (name) => `Key on ${name} today. It's the one variable worth adjusting your whole approach around.`,
  (name) => `${name} is the signal right now. Read it, match your tactics to it, and stay with what's working.`,
];

// ─── Coastal-specific fallback — when no exchange data but still a coastal context ───
// Keeps tides as the anchor rather than falling through to temp/cloud/solunar timing.
const COASTAL_GENERAL_TIDE_TIMING = [
  "Work around today's tide exchanges — moving water is when inshore fish turn on. Don't spread effort evenly across the clock.",
  "Tidal movement drives the coastal bite. Fish the transitions; rest during the slack.",
  "Position for the tide changes today. Moving water is your window — slack tide is the slow stretch between them.",
  "Inshore fish key on tide exchanges. Work the moving-water windows and don't burn time during the dead-tide lulls.",
  "The bite follows the tide. Get positioned for the exchanges and fish the moving-water windows hard.",
];

// ─── Daypart note pools — timing language lives here, not in tips ────────────

const NO_TIMING_EDGE_LOW_RELIABILITY = [
  "No clear timing edge stands out — fish it as the day comes.",
  "Data's thin today, so no strong timing call to make. Fish when you can get out.",
  "Limited confidence right now — no single window stands clearly above another.",
  "Hard to pin down a prime window. Fish it as opportunities come.",
];

const MOVING_WATER_PERIODS = [
  "Time it around the moving water — that's when the bite turns on.",
  "Work the tide exchanges. Moving water is your trigger window today.",
  "Don't sit through the slack. Get on the water when the tide's running and make the most of it.",
  "The bite follows the tide today. Put your best effort into the moving-water windows.",
  "Plan your outing around the exchange windows — that's where the bite lives right now.",
];

const WARMEST_WINDOW = [
  "The warmest stretch of the day is your prime window — lean into it.",
  "Afternoon warmth is the trigger today. Be on the water when temps peak.",
  "Time your best push around peak warmth. That's the window that'll produce.",
  "Get out there when the day is at its warmest — that's your most productive stretch.",
  "Warmth builds as the day goes. Stack your effort around the highest temps of the day.",
];

const COOLER_LOW_LIGHT = [
  "Beat the heat — early morning and evening are the productive windows today.",
  "Warm temps push fish to cooler, low-light periods. Dawn and dusk are your best shots.",
  "Fish are going quiet in the heat. Hit it early, break mid-day, then close it out at dusk.",
  "Early and late are your windows. The middle of the day is a tough sell right now.",
  "Low-light edges are the move today. Morning bite and late afternoon are where it's at.",
];

const ALL_DAY_CLOUD = [
  "Heavy cloud cover is keeping light low all day — you can fish any window.",
  "Overcast all day means low light all day. No need to pick a window — fish it start to finish.",
  "Cloud's doing you a favor today — fish can stay active around the clock.",
  "With this cloud cover, light isn't the limiter. Fish whenever you can get out.",
];

const AFTERNOON_WARMTH = [
  "Afternoon warmth will be the trigger — plan your best push around it.",
  "Let the air warm up first. Afternoon is when cold-water fish start to move.",
  "Cold morning, then it warms. Save your prime spots for the afternoon stretch.",
  "The day builds as it goes. Your best window is the warmest part of the afternoon.",
  "Hold something back for the afternoon warmth. That's when this water comes alive.",
];

const COLD_ALL_DAY = [
  "Cold temps all day — no single window stands out. Fish when you can.",
  "It's cold start to finish today. No real timing edge — just put in your time.",
  "No warming trend to exploit. Fish your best spots and stay with it all day.",
  "Cold and steady. No clear prime window — slow and deliberate all day is the play.",
];

const EARLY_SOLUNAR = [
  "Early feeding windows look strongest — get out there at first light.",
  "First light is the move today. Get on the water before the sun gets up.",
  "Early is the word today. Dawn is when conditions peak, so make those first hours count.",
  "Don't sleep in. First light has the best of it today — be there early.",
  "Morning bite looks prime. Get your gear ready the night before and get out at first light.",
];

const NO_TIMING_FALLBACK = [
  "No major timing advantage today — fish it when you can get out.",
  "No clear edge on timing. Get out when it works and fish your best water.",
  "Clock's not really a factor today. Go when it works for you.",
  "No single window stands out — the whole day is fair game.",
  "Timing's neutral today. Fish your spots when you can get out there.",
];

/** Format a parsed hour+minute into readable time like "9:30am" or "3pm". */
function fmtTideTime(h: number, m: number): string {
  const period = h < 12 ? "am" : "pm";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const displayM = m > 0 ? `:${String(m).padStart(2, "0")}` : "";
  return `${displayH}${displayM}${period}`;
}

/**
 * Coastal timing hint built from today's NOAA high/low tide events.
 * Returns specific exchange times (e.g. "around 9:30am and 3pm") so the
 * angler knows exactly when to be in position — not just a vague band.
 * Times are local strings like "YYYY-MM-DD HH:mm" from NOAA lst_ldt.
 */
function coastalTideExchangeHint(
  localDate: string,
  events: Array<{ time: string; value?: number; type?: string }>
): string | null {
  const dayEvents = events.filter((e) => typeof e.time === "string" && e.time.startsWith(localDate));
  if (dayEvents.length < 2) return null;

  const parsed = dayEvents
    .map((e) => {
      const m = e.time.match(/\b(\d{1,2}):(\d{2})\b/);
      if (!m) return null;
      const hh = parseInt(m[1]!, 10);
      const mm = parseInt(m[2]!, 10);
      return Number.isFinite(hh) ? { h: hh, m: mm } : null;
    })
    .filter((x): x is { h: number; m: number } => x !== null);

  if (parsed.length === 0) {
    return pick([
      "Work around today's tide exchanges — fish the moving water on each side of high and low, not the slack in between.",
      "Today's tides are your anchor. Get on the water for the exchanges and ease off during the slack.",
      "Fish the transitions. Moving water around each tide change is where the bite lives today.",
    ]);
  }

  const timeStrs = parsed.map((p) => `around ${fmtTideTime(p.h, p.m)}`);

  if (timeStrs.length === 1) {
    return pick([
      `Tide exchange ${timeStrs[0]} — work the 90 minutes before and after that turn, that's your window.`,
      `The tide turns ${timeStrs[0]}. Get positioned ahead of it and fish the moving water hard on both sides.`,
      `Best bite centers on ${timeStrs[0]} when the tide shifts. Don't miss that moving-water window.`,
    ]);
  }

  if (timeStrs.length === 2) {
    return pick([
      `Two exchange windows today — ${timeStrs[0]} and ${timeStrs[1]}. Fish the movement on each side and ease off during the slack between them.`,
      `Tide turns ${timeStrs[0]} and ${timeStrs[1]}. Those are your two best windows — get in position before each one and fish the moving water hard.`,
      `Best opportunities near ${timeStrs[0]} and ${timeStrs[1]} around the tide changes. The transition windows are the bite; slack in between is the slow stretch.`,
      `Hit the water ${timeStrs[0]} and again ${timeStrs[1]} when the tide shifts. The exchange windows are where fish are active — dead tide between them is slow.`,
    ]);
  }

  // 3+ exchanges — show the two strongest windows
  const mainStrs = timeStrs.slice(0, 2);
  return pick([
    `Multiple exchanges today — key windows ${mainStrs.join(" and ")}. Fish the moving water around each turn and ease off during the slack.`,
    `Best bite windows ${mainStrs.join(" and ")} and potentially later. Get positioned before each tide change and work the transition hard.`,
    `Tides are active today. Target the ${mainStrs.join(" and ")} exchange windows — moving water is your trigger, slack is your rest.`,
  ]);
}

export function buildTipAndDaypart(
  context: EngineContext,
  topDriver: ActiveVariableScore | undefined,
  topSuppressor: ActiveVariableScore | undefined,
  norm: SharedNormalizedOutput["normalized"],
  reliability: string,
  opts?: TipDaypartOptions
): EngineTipDaypartBundle {
  const solunar = opts?.solunar_peak_local?.length
    ? opts.solunar_peak_local
    : null;

  // All tips are TACTICAL only — no timing language.
  // Timing belongs exclusively in daypart_note below.
  let actionable_tip = pick(GENERAL_FLEXIBILITY_TIPS);
  let actionable_tip_tag: ActionableTipTag = "general_flexibility";

  if (context === "coastal" && norm.tide_current_movement?.score === 2) {
    actionable_tip = pick(COASTAL_TIDE_TIPS);
    actionable_tip_tag = "coastal_tide_positive";
  } else if (topSuppressor?.key === "wind_condition" && topSuppressor.score < 0) {
    actionable_tip = pick(WIND_SHELTER_TIPS);
    actionable_tip_tag = "wind_shelter";
  } else if (topSuppressor?.key === "runoff_flow_disruption" && topSuppressor.score < 0) {
    actionable_tip = pick(RUNOFF_TIPS);
    actionable_tip_tag = "runoff_clarity_flow";
  } else if (topSuppressor?.key === "temperature_condition" && topSuppressor.score < 0) {
    // Temperature is actually a suppressor (cold/very_cold band) → slow fish, finesse approach
    actionable_tip = pick(TEMP_COLD_TIPS);
    actionable_tip_tag = "temperature_intraday_flex";
  } else if (topDriver?.key === "temperature_condition" && topDriver.score > 0) {
    // Temperature is a positive DRIVER — fish are active regardless of calendar month.
    // The engine already scored this as favorable; don't second-guess it with season logic.
    actionable_tip = pick(TEMP_ACTIVE_TIPS);
    actionable_tip_tag = "temperature_intraday_flex";
  } else if (topDriver) {
    const driverName = topDriver.key.replace(/_/g, " ");
    actionable_tip = pick(LEAN_INTO_DRIVER_TEMPLATES)(driverName);
    actionable_tip_tag = "lean_into_top_driver";
  }

  // --- Daypart logic: timing lives here, never in the tip above ---
  const coastalExchangeHint =
    context === "coastal" &&
    opts?.tide_high_low &&
    opts.tide_high_low.length >= 2
      ? coastalTideExchangeHint(opts.local_date, opts.tide_high_low)
      : null;

  let daypart_preset: DaypartNotePreset;
  let daypart_note: string;

  if (reliability === "low") {
    daypart_preset = "no_timing_edge";
    daypart_note = pick(NO_TIMING_EDGE_LOW_RELIABILITY);
  } else if (context === "coastal") {
    // Coastal ALWAYS anchors timing to tides — never falls through to temp/cloud/solunar.
    // Priority: specific exchange times > moving water score > general coastal tide note.
    daypart_preset = "moving_water_periods";
    if (coastalExchangeHint) {
      // Best case: we have actual tide exchange times — show them specifically.
      daypart_note = coastalExchangeHint;
    } else if (norm.tide_current_movement && norm.tide_current_movement.score >= 1) {
      // Moving water confirmed positive but no specific exchange times available.
      daypart_note = pick(MOVING_WATER_PERIODS);
    } else {
      // Fallback — always keep tides as the frame, even without specific data.
      daypart_note = pick(COASTAL_GENERAL_TIDE_TIMING);
    }
  } else if (
    norm.temperature?.band_label === "very_warm" ||
    norm.temperature?.band_label === "warm"
  ) {
    if (norm.temperature.final_score <= 0) {
      daypart_preset = "cooler_low_light_better";
      daypart_note = pick(COOLER_LOW_LIGHT);
    } else {
      daypart_preset = "no_timing_edge";
      daypart_note = pick(ALL_DAY_CLOUD);
    }
  } else if (norm.light_cloud_condition?.label === "low_light" && norm.light_cloud_condition.score > 0) {
    daypart_preset = "early_late_low_light";
    daypart_note = pick(ALL_DAY_CLOUD);
  } else if (
    norm.temperature?.band_label === "very_cold" ||
    norm.temperature?.band_label === "cool"
  ) {
    if (norm.temperature.trend_label === "warming" || norm.temperature.final_score >= 0) {
      daypart_preset = "warmest_part_may_help";
      daypart_note = pick(AFTERNOON_WARMTH);
    } else {
      daypart_preset = "no_timing_edge";
      daypart_note = pick(COLD_ALL_DAY);
    }
  } else if (solunar && reliability !== "low") {
    daypart_preset = "early_late_low_light";
    daypart_note = pick(EARLY_SOLUNAR);
  } else {
    daypart_preset = "no_timing_edge";
    daypart_note = pick(NO_TIMING_FALLBACK);
  }

  return {
    actionable_tip,
    actionable_tip_tag,
    daypart_note,
    daypart_preset,
  };
}
