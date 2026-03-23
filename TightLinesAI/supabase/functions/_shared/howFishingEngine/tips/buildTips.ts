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

// Recent rain or downpour making the day harder (precip as suppressor)
const PRECIP_RAIN_TIPS = [
  "Rain has the water stirred up or stained. Slow your retrieve down, pick lures fish can feel or hear (vibration, rattle, or a bigger profile), and fish closer to shore and cover where water is often a bit clearer.",
  "Wet weather usually means poorer visibility underwater. Make easier targets: slower strips or cranks, pauses so fish can find the bait, and colors that stand out against muddy or tannic water.",
  "After rain, skip long casts into the middle. Work the bank, points, and anywhere creeks or runoff pour in — predators often sit where fresh, food-filled water meets the main lake.",
  "If it is still raining hard, safety first — but when you can fish, expect fish tighter to banks and wood. Keep retrieves simple and easy to track.",
  "Stained water from rain rewards patience. One slow, thorough pass through a good spot beats racing around the lake.",
];

// Dry, settled weather helping the bite (precip score +1 / +2 — NOT “disruption” in the lay sense)
const PRECIP_DRY_FAVORABLE_TIPS = [
  "Weather has been dry and settled, so water is usually clearer than after a big rain. Fish can see farther — use natural-looking colors, avoid loud line slap on the water, and make the first cast count.",
  "Calm, dry stretches mean fish often use their eyes more. Stealth helps: approach quietly, longer leaders if you use braid, and realistic retrieves rather than burning baits past them.",
  "Without fresh runoff muddying things, you can fish a bit farther from the bank and still get bit — but keep watching for shade, docks, and grass edges where fish hide from bright sun.",
  "Dry conditions are a good day to experiment with finesse (lighter line, smaller baits) in clear pockets, and power fishing (chunkier baits) right against cover where fish ambush.",
];

// Barometer helping the day (slow fall or moderate fall — fish often feed ahead of a front)
const PRESSURE_FALLING_FAVORABLE_TIPS = [
  "Air pressure has been dropping slowly — that often gets fish feeding ahead of a weather change. Cover water at a steady pace, try a few retrieve speeds, and don’t give up on a spot after one cast.",
  "A gentle falling barometer is a classic “go fishing” signal. Make confident casts to likely spots (cover, depth changes, baitfish) and change lure depth or speed before you change locations.",
];

// Post-front, pressure recovering — fish can be picky
const PRESSURE_RISING_SLOW_TIPS = [
  "Pressure is creeping back up after weather moved through — fish sometimes need smaller, slower offerings. Downsize a bit, add pauses, and hit the same good spots more thoroughly.",
];

// Barometer swinging hard or crashing — tougher bite
const PRESSURE_TOUGH_TIPS = [
  "The barometer has been jumpy or dropping fast — bass and other predators often go off feed briefly. Slow way down, downsize baits, and fish the most comfortable-looking water (stable depth, cover, out of heavy current).",
  "When pressure is unstable, make short, quiet presentations to high-percentage spots instead of burning a whole bank. Pauses and finesse often beat aggressive retrieves.",
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
// Cloud / light helping (overcast, low light — fish less spooky, often shallower)
const LIGHT_LOW_OVERCAST_TIPS = [
  "Clouds cut glare and fish often roam more freely. You can get away with slightly bolder presentations — try parallel casts along banks and cover without spooking fish as easily as on a bluebird day.",
  "Low, gray light is a great time to fish shallower than you think. Work visible cover and transitions (grass lines, drop-offs) with steady retrieves and let the fish tell you the speed.",
];

// Sun / glare challenging day — still might be driver in edge cases; keep practical
const LIGHT_BRIGHT_TIPS = [
  "Bright sun pushes many fish to shade, deeper water, or tight to cover. Put the bait where their eyes are protected — docks, trees, ledges — and use steady, predictable retrieves.",
];

// Light wind or calm helping (already positive score from normalizer)
const WIND_HELPING_TIPS = [
  "Wind is light enough to fish comfortably but can hide your presence. Use it to your advantage: cast with the breeze when you can and work edges where a little chop breaks up your silhouette.",
  "Calm or light air makes boat control and line control easier. Take time to make accurate casts to specific targets instead of fan-casting randomly.",
];

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

// Last resort — never use raw engine key names; keep grade-school clear
const BALANCED_DAY_TIPS = [
  "Nothing in the data screams one magic pattern — that’s normal. Pick two or three spots you trust, fish them slowly and thoroughly, and change lure depth or speed before you run to a new lake.",
  "On an “in-between” day, basics win: match something food-sized, fish where fish hide (cover, depth changes), and stay patient. Small adjustments beat constant running around.",
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

  const pr = norm.precipitation_disruption;
  const pReg = norm.pressure_regime;
  const lite = norm.light_cloud_condition;
  const w = norm.wind_condition;

  if (context === "coastal" && norm.tide_current_movement?.score === 2) {
    actionable_tip = pick(COASTAL_TIDE_TIPS);
    actionable_tip_tag = "coastal_tide_positive";
  } else if (topSuppressor?.key === "wind_condition" && topSuppressor.score < 0) {
    actionable_tip = pick(WIND_SHELTER_TIPS);
    actionable_tip_tag = "wind_shelter";
  } else if (topSuppressor?.key === "precipitation_disruption" && topSuppressor.score < 0) {
    actionable_tip = pick(PRECIP_RAIN_TIPS);
    actionable_tip_tag = "lean_into_top_driver";
  } else if (topSuppressor?.key === "runoff_flow_disruption" && topSuppressor.score < 0) {
    actionable_tip = pick(RUNOFF_TIPS);
    actionable_tip_tag = "runoff_clarity_flow";
  } else if (topSuppressor?.key === "pressure_regime" && topSuppressor.score < 0) {
    actionable_tip = pick(PRESSURE_TOUGH_TIPS);
    actionable_tip_tag = "lean_into_top_driver";
  } else if (topSuppressor?.key === "light_cloud_condition" && topSuppressor.score < 0) {
    actionable_tip = pick(LIGHT_BRIGHT_TIPS);
    actionable_tip_tag = "lean_into_top_driver";
  } else if (topSuppressor?.key === "temperature_condition" && topSuppressor.score < 0) {
    actionable_tip = pick(TEMP_COLD_TIPS);
    actionable_tip_tag = "temperature_intraday_flex";
  } else if (topDriver?.key === "temperature_condition" && topDriver.score > 0) {
    actionable_tip = pick(TEMP_ACTIVE_TIPS);
    actionable_tip_tag = "temperature_intraday_flex";
  } else if (topDriver?.key === "precipitation_disruption" && topDriver.score > 0 && pr && pr.score > 0) {
    actionable_tip = pick(PRECIP_DRY_FAVORABLE_TIPS);
    actionable_tip_tag = "lean_into_top_driver";
  } else if (topDriver?.key === "pressure_regime" && topDriver.score > 0 && pReg) {
    const lbl = pReg.label;
    if (lbl === "falling_slow" || lbl === "falling_moderate") {
      actionable_tip = pick(PRESSURE_FALLING_FAVORABLE_TIPS);
    } else if (lbl === "rising_slow") {
      actionable_tip = pick(PRESSURE_RISING_SLOW_TIPS);
    } else {
      actionable_tip = pick(PRESSURE_FALLING_FAVORABLE_TIPS);
    }
    actionable_tip_tag = "lean_into_top_driver";
  } else if (topDriver?.key === "light_cloud_condition" && topDriver.score > 0 && lite) {
    actionable_tip = pick(LIGHT_LOW_OVERCAST_TIPS);
    actionable_tip_tag = "lean_into_top_driver";
  } else if (topDriver?.key === "wind_condition" && topDriver.score > 0 && w) {
    actionable_tip = pick(WIND_HELPING_TIPS);
    actionable_tip_tag = "lean_into_top_driver";
  } else if (topDriver) {
    actionable_tip = pick(BALANCED_DAY_TIPS);
    actionable_tip_tag = "general_flexibility";
  }

  return { actionable_tip, actionable_tip_tag };
}
