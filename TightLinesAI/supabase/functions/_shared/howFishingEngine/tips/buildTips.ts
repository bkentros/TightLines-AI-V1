import type {
  ActionableTipTag,
  EngineContext,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import { pickDeterministic } from "../copy/deterministicPick.ts";
import type { ActiveVariableScore } from "../score/types.ts";

/**
 * Actionable tip result — PRESENTATION only.
 * This field answers one question: how should the angler work the lure or fly today?
 * It must not tell them where to fish, when to fish, or how to read the water.
 */
export type EngineActionableTipBundle = {
  actionable_tip: string;
  actionable_tip_tag: ActionableTipTag;
};

function pick<T>(arr: readonly T[], seed: string, salt: string): T {
  return pickDeterministic(arr, seed, `tip:${salt}`);
}

function normalizeTipText(text: string): string {
  const clean = text
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
  if (!clean) return "";
  const withCapital = clean.charAt(0).toUpperCase() + clean.slice(1);
  return /[.!?]$/.test(withCapital) ? withCapital : `${withCapital}.`;
}

const CURRENT_SWEEP_TIPS = [
  "Cast slightly across the current and keep light contact so the bait sweeps naturally instead of coming back too straight.",
  "Use the current as part of the retrieve: cast a little uptide, let the bait swing, and add only small corrections.",
  "Let the current do most of the work today. Keep the rod steady and avoid overworking the bait.",
  "A clean swing is better than a busy retrieve here. Cast across the flow, stay in touch, and let the current move the bait.",
  "Keep the presentation simple in current: cast at an angle, maintain steady contact, and let the bait travel naturally with the flow.",
  "Do less with the rod and more with the angle. A natural sweep through the current will look better than constant twitching.",
  "Fish the bait on a controlled drift or swing today. Too much extra rod action will fight the current instead of helping it.",
  "Start with a slightly uptide cast and let the bait track across the flow before you speed it up or add extra movement.",
  "Keep just enough tension to feel the bait without pulling it out of the natural line of travel.",
  "When current is helping, the cleanest presentation is usually a controlled swing with only short, subtle changes in pace.",
] as const;

const CONTACT_CONTROL_TIPS = [
  "Shorten the cast a little and use enough weight to stay in contact with the bait from start to finish.",
  "Keep the rod lower and the retrieve steadier so you can feel the bait instead of letting slack hide what it is doing.",
  "This is a good day for cleaner contact. A slightly heavier setup and a shorter cast will usually help.",
  "Make the presentation easier to control than normal. Shorter casts and steady line tension will help more than extra speed.",
  "Keep the bait in touch with you the whole time. If the line is bowing too much, shorten up and simplify the retrieve.",
  "Use a more controlled presentation today: fewer long casts, less slack, and a steady pace you can actually manage.",
  "Go one step more controlled than usual. The goal today is feeling the bait cleanly, not just covering water.",
  "A smooth, connected retrieve is the priority. If you lose contact too often, shorten the cast or add a little weight.",
  "This is a line-control day. Keep the presentation compact enough that you can feel every change and keep the bait on track.",
  "Favor control over distance today. Staying connected to the bait matters more than firing the longest cast you can.",
] as const;

const VISIBILITY_LOUD_TIPS = [
  "Go a little bigger or louder and slow the retrieve down so fish have time to find it.",
  "Pick one thing that stands out today: a larger profile, more vibration, or more contrast, then move it slowly enough to track.",
  "Make the bait easier to notice than normal. Bigger profile and steadier pace usually beat subtle and fast.",
  "Use a presentation fish can find with feel as much as sight: more vibration, more contrast, and a little less speed.",
  "Do not make the fish search too hard. A more visible or thumping bait with a slower retrieve is the cleaner play.",
  "Make the bait easier to track today. Go more obvious with the profile or vibration, then keep the retrieve controlled.",
  "When visibility drops, help the fish out: stronger profile, clearer movement, and a slower finish.",
  "A louder presentation makes sense today, but only if you slow it down enough for fish to stay with it.",
  "Move toward a bait the fish can notice quickly, then fish it with a steady pace instead of sharp, frantic movement.",
  "This is a good day to give the bait more presence and less speed.",
] as const;

const VISIBILITY_NATURAL_TIPS = [
  "Downsize a step and keep the action clean and natural instead of overworking the bait.",
  "Use a more natural profile and fewer sharp twitches. Cleaner water and brighter light reward believable movement.",
  "A smaller, simpler look is usually better today. Let the bait move naturally instead of forcing extra action.",
  "Take one step toward subtle: slightly smaller profile, quieter action, and fewer unnecessary rod pops.",
  "This is a good day to fish more naturally. Keep the bait simple, not busy.",
  "Start with a cleaner presentation than usual: modest profile, smooth pace, and only short changes in action.",
  "Make the bait look easy to believe. Smaller or more natural usually beats loud or exaggerated today.",
  "Avoid too much extra flash or motion. A simple, believable retrieve is the better starting point.",
  "The clearer look today favors subtle over flashy. Scale the profile down a touch and keep the cadence calm.",
  "Let realism win today: natural size, natural movement, and no extra drama in the retrieve.",
] as const;

const PRESSURE_SLOW_TIPS = [
  "Shorten the movements and add longer pauses between them. On a tougher day, the pause often does more than the pull.",
  "Fish slower and cleaner than normal. Small movements and longer pauses usually beat constant action here.",
  "Take speed out of the presentation first. A slower bait with a cleaner pause is the better starting point.",
  "Do less with the bait today: shorter pulls, steadier line, and a pause long enough for fish to make up their mind.",
  "Favor a slower, more patient cadence. The bait should look easy to catch, not urgent.",
  "This is a good day for smaller moves and longer stops. Let the bait sit long enough to get noticed.",
  "Keep the presentation calm and deliberate. A tight day usually rewards control more than flair.",
  "Reduce the amount of movement in each retrieve cycle. Let the pause carry more of the presentation.",
  "Think soft and patient today: shorter hops, slower turns, and more time between actions.",
  "A steady slow retrieve with clear pauses is a better bet than ripping, burning, or constantly changing pace.",
] as const;

const COLD_SLOW_TIPS = [
  "Slow the retrieve down and lengthen the pause. Cold fish usually need more time than you think.",
  "Give the bait less action and more hang time. In cold conditions, simple usually beats busy.",
  "A smaller profile with a slower pace is a strong starting point when the water is cold.",
  "Fish the bait slowly enough that it stays in front of them, not just near them.",
  "Take a little size and a lot of speed out of the presentation today.",
  "Let the bait rest longer than feels natural. Cold fish often eat during the quiet part of the retrieve.",
  "Use a slower, tighter cadence today. Small moves and long pauses are more likely to get a real look.",
  "This is not a speed day. Keep the bait in the zone and let the pause do most of the work.",
  "Make the retrieve easy to finish: slower, smaller, and more patient from start to end.",
  "In the cold, the cleaner move is usually a reduced profile and a longer pause between each action.",
] as const;

const HEAT_EASY_TIPS = [
  "Make the bait easier to eat today: slightly smaller profile, smoother retrieve, and longer pauses.",
  "A compact, easy meal is the better look in warm, stressful conditions. Slow the bait down and let it hang.",
  "Reduce the amount of work the fish has to do. A smaller profile and steadier pace usually beat a big, fast presentation.",
  "When heat is the problem, simplify the bait: less speed, less bulk, and more time between movements.",
  "A calm, easy retrieve makes more sense than an aggressive one today. Think smooth and patient.",
  "Move toward a smaller or cleaner presentation and give the bait a longer finish before the next move.",
  "This is a good day to take some urgency out of the retrieve. Let the bait look easy to catch.",
  "Fish slower than normal and keep the profile simple. Warm, stressed fish usually do not want to chase a lot.",
  "A smoother cadence and a slightly simpler profile are both worth trying today.",
  "Think easy meal, not reaction bait: controlled speed, softer moves, and longer pauses.",
] as const;

const THERMAL_EDGE_TIPS = [
  "Temperature is close but not fully helping, so start with a slightly slower, cleaner presentation than your default.",
  "Keep the retrieve controlled and repeatable today. Conditions are close enough that small thermal misses matter.",
  "This is a good day to stay just a touch more patient than normal: clean pace, softer moves, and no wasted action.",
  "Do not force the presentation. A smooth, slightly slower retrieve is the better starting point when temperature is only close.",
  "Start simple and controlled today. The temperature window is close enough that overworking the bait can cost you.",
  "A measured presentation makes sense here: steady contact, modest pace, and pauses long enough to feel intentional.",
  "Keep the bait easy to track and easy to trust. Temperature is near the zone, but not helping enough for a busy retrieve.",
  "Go one step more controlled than an all-green day: clean cadence, light adjustments, and no extra speed.",
] as const;

const ACTIVE_CADENCE_TIPS = [
  "Start with a more active retrieve today. A steady medium pace is a better starting point than dragging it too slowly.",
  "Let the bait move with some intent. Fish are more likely to respond to a cleaner, more active cadence today.",
  "Do not over-finesse the first pass. A confident, steady retrieve is a better starting point here.",
  "This is a good day to keep the bait moving instead of pausing too long between actions.",
  "Fish with a little more pace than normal. A bait that moves with purpose should get more attention today.",
  "Try a medium, consistent retrieve before you slow all the way down. The fish look willing to move today.",
  "A cleaner, more active cadence makes sense today. Let the bait travel and trust the movement.",
  "Start one gear faster than your conservative setting and only slow down if the water tells you to.",
  "This looks more like a controlled movement day than a dead-stick day.",
  "Keep the bait lively enough to get noticed. Today favors commitment more than hesitation.",
  "Use a steadier retrieve and shorter pauses. The fish look more ready to meet the bait than wait on it.",
  "A smooth, active cadence is the clearer first choice today over a slow, stop-heavy presentation.",
] as const;

const GENERAL_PRESENTATION_TIPS = [
  "Start with a steady, simple retrieve and change only one thing at a time: speed, pause length, or profile.",
  "Keep the presentation easy to repeat today. A clean, consistent retrieve tells you more than constant changes.",
  "Begin with a middle-of-the-road presentation and make small adjustments instead of big jumps.",
  "Fish a clean, steady cadence first. If you need to adjust, change one variable and keep the rest the same.",
  "This is a good day to keep the retrieve simple, repeatable, and easy to read.",
  "Pick one clear presentation and stay with it long enough to learn something before changing it.",
  "Use a presentation you can repeat well: controlled speed, clear pauses, and no extra wasted movement.",
  "The best starting point today is simple and steady, not clever.",
  "Stay organized with the bait: one profile, one cadence, one adjustment at a time.",
  "Keep the presentation calm and consistent. Repeating a good retrieve will help more than changing every cast.",
] as const;

const BALANCED_PRESENTATION_TIPS = [
  "Keep the presentation clean and repeatable: moderate pace, clear pauses, and a profile that looks easy to trust.",
  "On a balanced day, a simple medium-speed retrieve is a better starting point than something extreme.",
  "Try a clean, controlled presentation first and let the fish tell you whether to speed up, slow down, or downsize.",
  "This is a day for a simple bait path and small adjustments, not dramatic changes every few casts.",
  "Stay with a believable presentation long enough to evaluate it. Balanced days reward patience more than constant changes.",
  "A moderate profile and a clean, steady cadence are both good starting choices today.",
  "Keep the bait easy to follow and easy to repeat. Balanced days usually reward clarity over creativity.",
  "The better move today is a calm, dependable presentation rather than something extreme on either end.",
] as const;

export function listTipCopyForAudit(): string[] {
  return [
    ...CURRENT_SWEEP_TIPS,
    ...CONTACT_CONTROL_TIPS,
    ...VISIBILITY_LOUD_TIPS,
    ...VISIBILITY_NATURAL_TIPS,
    ...PRESSURE_SLOW_TIPS,
    ...COLD_SLOW_TIPS,
    ...HEAT_EASY_TIPS,
    ...THERMAL_EDGE_TIPS,
    ...ACTIVE_CADENCE_TIPS,
    ...GENERAL_PRESENTATION_TIPS,
    ...BALANCED_PRESENTATION_TIPS,
  ];
}

/**
 * Build an actionable tip — PRESENTATION only.
 * The output should read like a clear mechanical adjustment for the bait or fly.
 */
export function buildActionableTip(
  context: EngineContext,
  topDriver: ActiveVariableScore | undefined,
  topSuppressor: ActiveVariableScore | undefined,
  norm: SharedNormalizedOutput["normalized"],
  seed: string,
): EngineActionableTipBundle {
  let actionable_tip: string = pick(GENERAL_PRESENTATION_TIPS, seed, "general");
  let actionable_tip_tag: ActionableTipTag = "presentation_general";

  const tempBand = norm.temperature?.band_label ?? null;
  const tempScore = norm.temperature?.final_score ?? null;
  const pressureLabel = norm.pressure_regime?.label ?? null;

  if (isCoastalFamilyContext(context) && (norm.tide_current_movement?.score ?? 0) >= 1.5) {
    actionable_tip = pick(CURRENT_SWEEP_TIPS, seed, "current_sweep");
    actionable_tip_tag = "presentation_current_sweep";
  } else if (topSuppressor?.key === "wind_condition") {
    actionable_tip = pick(CONTACT_CONTROL_TIPS, seed, "contact_control_negative_wind");
    actionable_tip_tag = "presentation_contact_control";
  } else if (
    topSuppressor?.key === "precipitation_disruption" ||
    topSuppressor?.key === "runoff_flow_disruption"
  ) {
    actionable_tip = pick(VISIBILITY_LOUD_TIPS, seed, "visibility_loud");
    actionable_tip_tag = "presentation_visibility_profile";
  } else if (topSuppressor?.key === "light_cloud_condition") {
    actionable_tip = pick(VISIBILITY_NATURAL_TIPS, seed, "visibility_natural_bright");
    actionable_tip_tag = "presentation_visibility_profile";
  } else if (topSuppressor?.key === "pressure_regime") {
    actionable_tip = pick(PRESSURE_SLOW_TIPS, seed, "pressure_slow");
    actionable_tip_tag = "presentation_slow_subtle";
  } else if (topSuppressor?.key === "temperature_condition") {
    if (tempBand === "very_cold" || tempBand === "cool") {
      actionable_tip = pick(COLD_SLOW_TIPS, seed, "cold_slow");
    } else if (
      (tempBand === "optimal" || tempBand === "near_optimal") &&
      tempScore != null &&
      tempScore < 0
    ) {
      actionable_tip = pick(THERMAL_EDGE_TIPS, seed, "thermal_edge");
    } else {
      actionable_tip = pick(HEAT_EASY_TIPS, seed, "heat_easy");
    }
    actionable_tip_tag = "presentation_slow_subtle";
  } else if (topDriver?.key === "temperature_condition") {
    actionable_tip = pick(ACTIVE_CADENCE_TIPS, seed, "active_cadence_temperature");
    actionable_tip_tag = "presentation_active_cadence";
  } else if (topDriver?.key === "pressure_regime") {
    if (pressureLabel === "rising_slow" || pressureLabel === "rising_fast") {
      actionable_tip = pick(PRESSURE_SLOW_TIPS, seed, "pressure_slow_positive_rise");
      actionable_tip_tag = "presentation_slow_subtle";
    } else {
      actionable_tip = pick(ACTIVE_CADENCE_TIPS, seed, "active_cadence_pressure");
      actionable_tip_tag = "presentation_active_cadence";
    }
  } else if (topDriver?.key === "light_cloud_condition") {
    actionable_tip = pick(ACTIVE_CADENCE_TIPS, seed, "active_cadence_light");
    actionable_tip_tag = "presentation_active_cadence";
  } else if (topDriver?.key === "precipitation_disruption") {
    actionable_tip = pick(VISIBILITY_NATURAL_TIPS, seed, "visibility_natural_dry");
    actionable_tip_tag = "presentation_visibility_profile";
  } else if (topDriver?.key === "wind_condition") {
    actionable_tip = pick(CONTACT_CONTROL_TIPS, seed, "contact_control_positive_wind");
    actionable_tip_tag = "presentation_contact_control";
  } else if (topDriver?.key === "tide_current_movement") {
    actionable_tip = pick(CURRENT_SWEEP_TIPS, seed, "current_sweep_driver");
    actionable_tip_tag = "presentation_current_sweep";
  } else if (topDriver) {
    actionable_tip = pick(BALANCED_PRESENTATION_TIPS, seed, "balanced");
    actionable_tip_tag = "presentation_general";
  }

  return { actionable_tip: normalizeTipText(actionable_tip), actionable_tip_tag };
}
