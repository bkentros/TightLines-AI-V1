import type {
  ActionableTipTag,
  EngineContext,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import type { ActiveVariableScore } from "../score/types.ts";

/**
 * Actionable tip result — TACTICAL only, zero timing language.
 * Timing recommendation is now handled by the timing engine
 * (timing/resolveTimingResult.ts) and returned separately.
 */
export type EngineActionableTipBundle = {
  actionable_tip: string;
  actionable_tip_tag: ActionableTipTag;
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

/**
 * Build an actionable tip — TACTICAL only, zero timing language.
 *
 * Timing recommendation is now produced by the timing engine
 * (timing/resolveTimingResult.ts) and wired into the report separately.
 */
export function buildActionableTip(
  context: EngineContext,
  topDriver: ActiveVariableScore | undefined,
  topSuppressor: ActiveVariableScore | undefined,
  norm: SharedNormalizedOutput["normalized"],
): EngineActionableTipBundle {
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
    actionable_tip = pick(TEMP_COLD_TIPS);
    actionable_tip_tag = "temperature_intraday_flex";
  } else if (topDriver?.key === "temperature_condition" && topDriver.score > 0) {
    actionable_tip = pick(TEMP_ACTIVE_TIPS);
    actionable_tip_tag = "temperature_intraday_flex";
  } else if (topDriver) {
    const driverName = topDriver.key.replace(/_/g, " ");
    actionable_tip = pick(LEAN_INTO_DRIVER_TEMPLATES)(driverName);
    actionable_tip_tag = "lean_into_top_driver";
  }

  return { actionable_tip, actionable_tip_tag };
}
