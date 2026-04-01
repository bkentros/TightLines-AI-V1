/**
 * howToFishPhrases — technique instructions for a given family.
 *
 * Keyed on: family_id × motion_type
 * 6 variants each — picked deterministically by date + species seed.
 * Keep tactical and specific. ≤ 20 words per phrase.
 */

import type { MotionType } from "../contracts/behavior.ts";
import type { FlyFamilyId, LureFamilyId } from "../contracts/families.ts";

type FamilyId = LureFamilyId | FlyFamilyId;

// Grouped by motion type for families where the family_id match isn't needed
export const HOW_TO_FISH_BY_MOTION: Record<
  MotionType,
  readonly [string, string, string, string, string, string]
> = {
  steady: [
    "Steady, medium-speed retrieve just above the bottom. Keep contact with structure.",
    "Reel at a consistent clip — vary only if fish follow but don't commit.",
    "Slow-roll through the zone, letting the action do the work.",
    "Maintain constant contact and reel speed — let the lure track naturally through the zone.",
    "Straight retrieve at a pace that keeps you in the fish zone. No pauses needed.",
    "Lock in a steady retrieve and let the profile do the work — change speed only on follows.",
  ],
  hop: [
    "Lift the rod tip, let it fall, reel up slack. Repeat on or near the bottom.",
    "Short hops along the bottom with a full pause on each fall.",
    "Pop-hop retrieve — keep contact with the substrate throughout.",
    "Two-foot hop, let it fall completely, pause 2 seconds, repeat. Stay in contact.",
    "Hop it off the bottom and follow the fall — most strikes happen on the descent.",
    "Quick upward snap, then reel to keep contact with the bottom on the fall.",
  ],
  twitch_pause: [
    "Two quick twitches, then a full 2–3 second pause. Strike on the fall.",
    "Snap the rod tip down, pause. Fish often hit on the pause.",
    "Erratic twitch-twitch-pause — mimic a disoriented baitfish.",
    "Twitch twice sharply, pause long enough to feel the bottom, repeat.",
    "Quick rod snaps followed by a dead pause — the hesitation triggers the bite.",
    "Irregular twitch cadence with longer pauses when fish are following but not eating.",
  ],
  rip: [
    "Hard, fast rip off the bottom, then let it flutter back down.",
    "Rip the lure aggressively, triggering a reflex strike on the drop.",
    "Burn it fast — rip-rip-rip with just enough pause to let it sink.",
    "Violent upward rod sweep, follow it down on a semi-slack line. Strikes happen on the drop.",
    "Rip hard off structure, pause immediately. The flutter after the rip is the trigger.",
    "Fast aggressive strips — get it moving fast and let the bottom contact create the erratic action.",
  ],
  sweep: [
    "Long, sweeping rod arc to the side, then reel back to position.",
    "Sweep the fly across current in a long arc, let it swing to dangle.",
    "Slow, broad sweep through the strike zone — works well on large streamers.",
    "Extend the rod sweeping across the current, then swing it back upstream.",
    "Broad arc with the rod from upstream to downstream — let the current do the work.",
    "Sweep slowly across the seam, pause at the end of the arc before the next cast.",
  ],
  walk: [
    "Rhythmic rod tip twitches with slack line — keep the cadence consistent.",
    "Walk-the-dog with steady left-right action. Vary pace if fish follow.",
    "Loose-wrist rod twitches to walk the lure side-to-side over the target.",
    "Short snap-snap cadence with minimal rod movement — keep the lure in the zone.",
    "Slack between twitches is key — too tight and it won't walk. Stay loose.",
    "Walk it over the target area with a steady pop-pop-pause rhythm.",
  ],
  pop: [
    "Short, sharp rod pop to create a splash, then pause 2–3 seconds.",
    "Pop-pause-pop. Let rings dissipate before the next pop.",
    "Aggressive pops for active fish; slower pops when fish are subtle.",
    "One hard pop, long pause. Give fish time to commit before the next disturbance.",
    "Vary pop intensity — loud pops to locate fish, softer pops once they're close.",
    "Pop it into position over cover, pause until the rings die, pop again. Be patient.",
  ],
  drag: [
    "Dead slow bottom drag. Pull a few inches, pause, repeat.",
    "Drag along the substrate — don't lift off the bottom.",
    "Ultra-slow bottom drag. Let the lure do the work with minimal angler input.",
    "Inch it forward, keep rod pressure consistent, pause for 3 seconds between moves.",
    "Stay in contact with the bottom at all times — lift and you lose the fish.",
    "Dead stick it, drag it a foot, dead stick again. Patience wins this game.",
  ],
  swing: [
    "Cast across current, mend for a dead drift, let it swing to below you.",
    "Swing the fly on a tight line — speed up or slow down with rod angle.",
    "Cross-current cast, let the fly swing tight across the seam.",
    "Quarter-downstream cast, controlled mend, swing the fly through the bucket.",
    "Let it drift, then swing it fully broadside through the run before recast.",
    "Lead with the rod tip on the swing — slowing it down or speeding it up changes the depth.",
  ],
};

// Family-specific overrides when the motion-based default isn't enough
export const HOW_TO_FISH_FAMILY_OVERRIDE: Partial<
  Record<FamilyId, readonly [string, string, string, string, string, string]>
> = {
  topwater_frog: [
    "Cast to cover, let rings settle, then walk it across the mat.",
    "Fish slow over pads and matted grass — pause near any opening.",
    "Slow walking retrieve across vegetation — fish hit when it enters a pocket.",
    "Land it on the mat, pause 3 full seconds, then walk to the nearest gap.",
    "Walk-the-frog retrieve with a pause every 6–8 inches over thick cover.",
    "Let it sit completely still after landing — then walk it across the mat to the open water edge.",
  ],
  lipless_crankbait: [
    "Yo-yo retrieve: rip up, let it flutter, repeat. Stay in contact with grass.",
    "Steady medium reel through the water column, or yo-yo in grass.",
    "Burn and kill — fast reel, sudden stop. Reaction bite on the fall.",
    "Rip it free from grass, let it flutter back down, feel for the tick-tick before striking.",
    "High-speed burn just above the grass tops — pause when it snags and let it float free.",
    "Yo-yo it along the bottom: rip up sharply, drop back, repeat. Most bites come on the flutter.",
  ],
  diving_crankbait: [
    "Cast long, hold rod tip down, and reel at a consistent pace.",
    "Banging the bill off bottom structure triggers reaction strikes.",
    "Vary retrieve speed — pause after contacting cover and let it float up.",
    "Keep the rod tip low and pointed at the lure for maximum dive depth.",
    "Contact bottom deliberately — the deflection off rocks and wood triggers bites.",
    "Crank it down, then vary the speed and pause after every deflection.",
  ],
  jerkbait: [
    "Twitch-twitch-pause. Let the bait hang long enough for fish to commit.",
    "Sharp downward snaps with slack line, then a full pause between moves.",
    "Work it like a wounded baitfish: two snaps, pause, then one quick twitch.",
    "Twitch it over grass or around cover, letting it glide and stall in place.",
    "Vary pause length until fish tell you what cadence they want.",
    "Snap it hard, feed a touch of slack, and let it suspend like a stunned shad.",
  ],
  spinnerbait: [
    "Slow-roll along the bottom or burn just beneath the surface.",
    "Helicopter the blades down walls of wood or rock structure.",
    "Run it through any break, edge, or inside corner at a steady clip.",
    "Slow-roll over hard bottom — keep the blades ticking through the strike zone.",
    "Cast past cover, reel fast to depth, then slow-roll through the strike zone.",
    "Let it helicopter along vertical structure — fish hit on the fall with tight line.",
  ],
  casting_spoon: [
    "Cast to feeding fish or structure, reel at medium speed with slight rod tip action.",
    "Flutter it down then reel fast — flash triggers reaction bites.",
    "Wobble on a slow reel or jig it lightly for finicky fish.",
    "Cast over schools and reel fast to trigger reaction strikes on the initial drop.",
    "Let it sink to depth, reel a few cranks, let it flutter back down. Repeat.",
    "Fan cast around structure and reel at medium speed with occasional rod drops.",
  ],
  shrimp_crab_plastic: [
    "Dead-drop to the bottom, drag slowly, and pause near any cover.",
    "Pitch under mangroves or onto flats edges, drag slowly to the fish.",
    "Ultra-slow drag or dead stick — let the scent and profile do the work.",
    "Pitch ahead of tailing fish, let it sink completely, and wait for the line to move.",
    "Cast to structure, let it sink, then inch it forward with 6-inch drags and long pauses.",
    "Dead stick it on the bottom near cover — fish often pick it up without any rod movement.",
  ],
  large_profile_swimbait: [
    "Slow, steady bottom roll — keep the tail kicking consistently.",
    "Glide it through open water or over structure at a deliberate pace.",
    "Slow-roll on a wide-gap hook. Let the body sway naturally.",
    "Cast deep, slow-roll it back on the bottom — let the tail do the work.",
    "Keep it barely moving at depth — big profile fish eat what looks like an easy meal.",
    "Work it along the outside edge of structure at walking pace — one body-length per two cranks.",
  ],
  streamer_baitfish: [
    "Strip-strip-pause. Vary strip speed until fish commit.",
    "Long, fast strips with occasional pauses — imitate fleeing bait.",
    "Short quick strips near structure, slow down in open water.",
    "Two long strips, pause 2 seconds, then one short strip — vary the cadence.",
    "Fast strips near the surface, slower strips as you count it down to depth.",
    "Mix short and long strips erratically — no consistent cadence. Baitfish aren't consistent.",
  ],
  streamer_articulated: [
    "Long, aggressive strips to make the fly undulate fully.",
    "Mix strip cadences — big fish often hit on the hesitation.",
    "Dead drift followed by a hard strip — the pause-then-dart is key.",
    "Two hard pulls, hesitate, one more — the articulation needs speed to work.",
    "Fast erratic strips near the bank, then let it swing back through deep water.",
    "Strip hard three times, then let it hang in current for a full 3 seconds before the next set.",
  ],
  topwater_popper_fly: [
    "Hard strip to pop the fly, then a 3-second pause. Repeat.",
    "Pop with authority — let the rings die before the next strip.",
    "Aggressive pops for active fish; slow it down if fish are wary.",
    "One sharp haul-strip to pop, then strip out slack while waiting. Don't rush.",
    "Pop it into position, wait for the surface to settle completely, pop again.",
    "Vary pop intensity — loud hard pops to locate, gentle pops once fish are on the fly.",
  ],
  slider_diver_fly: [
    "Strip and let it dive, pause and let it resurface. Repeat.",
    "Short quick strips to dive, then a pause to float back up.",
    "Vary strip speed — the dive-and-float action triggers subsurface strikes.",
    "Two quick strips to get it under, pause 2 seconds, let it rise, repeat.",
    "Strip aggressively to dive it, then go completely still — the rise triggers the eat.",
    "Medium strips to get it diving, long pause — fish often eat it on the way back up.",
  ],
  shrimp_fly: [
    "Lead the fish and strip into its path. One or two short strips.",
    "Cast ahead of the fish, let it sink to depth, then short precise strips.",
    "Dead drift in current or short hops in still water.",
    "Lead the fish by 6 feet, let the fly settle, then one short strip as it approaches.",
    "Cast well ahead, mend for natural drift, then a single strip when the fish is close.",
    "Let it sink fully to the bottom, then one slow strip — wait for the take.",
  ],
  crab_fly: [
    "Lead the fish by 6 feet, let it sink, and give a slow single strip when in range.",
    "Cast ahead of a tailing fish, let the fly sink, and wait for the eat.",
    "Slow drag along the bottom — resist the urge to over-strip.",
    "Put it down and leave it alone — tailing fish will find it.",
    "One cast, let it sink completely, then never move it until the fish is on it.",
    "Cast past the tailing fish, strip it into position, then freeze. Wait for the line to pull.",
  ],
  leech_worm_fly: [
    "Long, slow pulls on the swing. Pause between strips.",
    "Dead drift or slow swing with occasional short strips.",
    "Slow to medium strip retrieve with pauses — the wiggle does the work.",
    "Let it swing on a tight line, then hand-twist it back through slow water.",
    "Single slow strips with a 3-second hand-pause — the natural movement is the trigger.",
    "Swing through the run, then let it dangle at the end of the swing before recasting.",
  ],
};
