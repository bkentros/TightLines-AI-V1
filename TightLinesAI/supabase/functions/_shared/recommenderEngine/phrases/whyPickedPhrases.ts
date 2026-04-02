/**
 * whyPickedPhrases — why a given family is the right call.
 *
 * Keyed on: trigger_type × forage_mode
 * Each entry has 6 variants so pickDeterministic can rotate them.
 * Keep each phrase short (1 sentence, ≤ 15 words).
 */

import type { ForageMode, TriggerType } from "../contracts/behavior.ts";

type PhraseKey = `${TriggerType}:${ForageMode}`;

export const WHY_PICKED_PHRASES: Record<
  PhraseKey,
  readonly string[]
> = {
  // ── finesse × forage ──────────────────────────────────────────────────────

  "finesse:baitfish": [
    "Subtle action mimics stunned bait — exactly what inactive fish will eat.",
    "Finesse profiles match lethargic baitfish that sluggish fish can't resist.",
    "Slow, natural presentation convinces fish that aren't chasing.",
    "When fish won't chase, a dying-baitfish imitation is the right call.",
    "Downsizing to finesse gets bites from fish that have lockjaw.",
    "Light line and natural baitfish profile — the go-to when conditions are tough.",
  ],
  "finesse:crawfish": [
    "Drag-and-pause mimics a crawfish sitting still on the bottom.",
    "Slow bottom contact lets inactive fish eat without committing to a chase.",
    "Crawfish imitation in the strike zone is a reliable cold-bite trigger.",
    "A barely-moving crawfish is impossible for a bottom fish to pass up.",
    "Finesse craw presentation keeps the bait in the strike zone longest.",
    "Inactive bass still respond to a craw sitting right on their nose.",
  ],
  "finesse:shrimp": [
    "Slow shrimp presentation is hard for neutral coastal fish to ignore.",
    "Natural shrimp drift into the strike zone triggers finesse bites.",
    "Inactive fish still respond to a slow-moving shrimp profile.",
    "A shrimp hanging in the current is exactly what picky redfish want.",
    "Finesse shrimp presentation is the most natural thing coastal fish see.",
    "When fish won't commit, slow down and let the shrimp do the work.",
  ],
  "finesse:crab": [
    "Stationary crab presentation is perfect for neutral, bottom-holding fish.",
    "Crab imitation dragged slowly triggers even lock-jawed fish.",
    "A crab sitting still on the bottom is the most natural thing a redfish sees.",
    "Tailing fish respond to a crab profile even when they won't chase anything else.",
    "Finesse crab — dead stick it on the bottom and wait for the eat.",
    "Bottom-sitting crab profile is the highest-percentage play for inactive reds.",
  ],
  "finesse:leech": [
    "Subtle undulating action mimics a leech drifting in current.",
    "Slow leech profile is the call when fish need convincing.",
    "Leeches are always available forage — a slow presentation matches the hatch.",
    "Walleye and trout are conditioned to eat slow-drifting leeches year-round.",
    "A finesse leech on the swing is irresistible in cold-water conditions.",
    "When nothing else works, a dead-drifted leech profile cleans up.",
  ],
  "finesse:surface_prey": [
    "Subtle surface action works when fish are glancing up but not committing.",
    "Minimal disturbance topwater matches nervous surface bait.",
    "A gentle finesse surface presentation won't spook wary fish.",
    "Fish are looking up — a quiet surface presentation seals the deal.",
    "Soft surface action when fish are adjacent but not locked in.",
    "A finesse topwater approach convinces fish that nearly rose but didn't.",
  ],
  "finesse:mixed": [
    "Versatile profile covers multiple forage bases when fish are picky.",
    "Slow, natural action works across forage types when conditions are tough.",
    "Mixed forage situations call for a subtle profile that doesn't commit to one prey.",
    "When fish are selective about multiple prey types, finesse wins.",
    "A natural, low-commitment presentation covers the bases in mixed conditions.",
    "Finesse approach when you don't know exactly what fish are keying on.",
  ],

  // ── reaction × forage ────────────────────────────────────────────────────

  "reaction:baitfish": [
    "Fast flash and vibration triggers an instinctive strike from active fish.",
    "Speed and profile match fleeing baitfish — a pure reaction bite.",
    "Aggressive baitfish schools call for a fast, triggering presentation.",
    "Burning through the zone triggers fish that are in chase mode.",
    "Active predators responding to fleeing bait — speed and flash are the call.",
    "Reaction bites are the best bites — match the chaotic energy of escaping bait.",
  ],
  "reaction:crawfish": [
    "Ripping off the bottom imitates a fleeing crawfish — a proven reaction trigger.",
    "Crawfish that dart suddenly draw committed, reaction-based strikes.",
    "A fast crawfish escape action triggers ambush-oriented fish.",
    "Bass key on crawfish popping off rocks — a ripping action matches that exactly.",
    "Reaction craw retrieve activates territorial instincts in active fish.",
    "Rip it fast and let it fall — the stop-and-drop triggers the hardest bites.",
  ],
  "reaction:shrimp": [
    "Shrimp pop and dart when threatened — a quick retrieve matches that perfectly.",
    "Reaction shrimp presentation triggers fish keying on movement, not smell.",
    "A fast-darting shrimp imitation draws reaction bites from active fish.",
    "Snook and redfish will explode on a shrimp that darts suddenly.",
    "Popping and darting shrimp profile triggers aggressive coastal fish.",
    "When fish are active on flats, a fast shrimp presentation brings the most committed bites.",
  ],
  "reaction:crab": [
    "Crab can move quickly when threatened — a ripping action triggers a reaction.",
    "Fast crab presentation works when fish are actively hunting the flat.",
    "Active fish will chase a quickly-moving crab profile.",
    "A crab scrambling across the bottom triggers the hardest redfish bites.",
    "Reaction-based crab retrieve activates fish that are in feeding mode.",
    "Moving the crab quickly creates urgency — fish commit before thinking.",
  ],
  "reaction:leech": [
    "Ripping a leech-style fly triggers reflex bites from aggressive fish.",
    "A fast-moving leech profile catches fish that won't chase a slow presentation.",
    "Reaction-based leech retrieve works when fish are in a feeding frenzy.",
    "Stripping aggressively triggers walleye and trout that are locked on baitfish.",
    "Fast leech action on a swing creates the urgency that triggers committed bites.",
    "Fish keyed on leeches respond best to an erratic, darting retrieve.",
  ],
  "reaction:surface_prey": [
    "Explosive surface action triggers hard reaction strikes from below.",
    "Fleeing surface prey call for a loud, fast topwater presentation.",
    "Aggressive topwater triggers the instinct to eat anything trying to escape.",
    "Bass schooling under surface bait — make noise and get out of the way.",
    "Reaction topwater triggers the most explosive bites of the day.",
    "Fast, loud surface presentation when fish are schooling and chasing bait up.",
  ],
  "reaction:mixed": [
    "Fast, triggering presentation works when fish are active and forage is varied.",
    "Reaction-based retrieves cover water efficiently on actively feeding fish.",
    "When fish are keyed on multiple prey types, a triggering action brings the bite.",
    "Active fish in mixed forage conditions respond best to something that triggers instinct.",
    "Burning through varied cover triggers fish that would otherwise require precise matching.",
    "Reaction approach covers water and finds the most aggressive fish in the area.",
  ],

  // ── natural_match × forage ────────────────────────────────────────────────

  "natural_match:baitfish": [
    "Profile and color closely match the baitfish fish are actively feeding on.",
    "Swimming action and silhouette replicate the primary forage at this time of year.",
    "Natural baitfish match puts the right profile in front of fish focused on feeding.",
    "Matching the local baitfish exactly — shade, size, and swim — maximizes confidence bites.",
    "Fish are targeting a specific baitfish — matching it precisely produces the best results.",
    "A natural baitfish presentation gets bites from fish that are eating, not reacting.",
  ],
  "natural_match:crawfish": [
    "Color and body shape closely imitate the crawfish fish are targeting.",
    "Crawfish-profile lures on or near the bottom match exactly what fish are eating.",
    "Natural crawfish presentation is a proven pick when fish are locked on the bottom.",
    "Matching crawfish size and color in the strike zone produces the most consistent bites.",
    "Fish are dialed in on crawfish — a precise imitation beats anything else.",
    "Natural craw profile at the right depth is the highest-percentage bottom bite available.",
  ],
  "natural_match:shrimp": [
    "Shrimp-profile lure in the right color is the closest natural match available.",
    "Mimicking the shape and movement of shrimp is hard for feeding fish to ignore.",
    "Natural shrimp presentations produce when fish are selectively feeding.",
    "Matching shrimp that are abundant in the system right now — size and color matter.",
    "A precise shrimp imitation on the right depth produces bites other approaches miss.",
    "Feeding fish on a shrimp pattern — natural match beats flash or reaction every time.",
  ],
  "natural_match:crab": [
    "Crab imitation on the bottom matches exactly what tailing fish are eating.",
    "Profile and color replicate crabs that fish are actively hunting.",
    "Natural crab presentation is often the only thing that works on selective fish.",
    "Tailing redfish are locked on crab — a precise imitation placed in their path is the answer.",
    "A crab that looks real is the best way to fool selectively-feeding fish.",
    "Matching the crab's size and coloration makes this the most convincing presentation available.",
  ],
  "natural_match:leech": [
    "Undulating action and dark profile closely match leeches in low-light conditions.",
    "Natural leech movement is one of the best walleye and trout triggers.",
    "Matching the leech hatch with a natural-profile fly or lure is the right call.",
    "Walleye conditioned on leeches respond best to a matching natural presentation.",
    "Trout holding in current seams eat a natural leech drift without hesitation.",
    "A precise leech match outfishes flashier presentations when fish are selective.",
  ],
  "natural_match:surface_prey": [
    "Surface popper or walker matches wounded prey fish are glassing from below.",
    "Natural topwater profile triggers fish that are already looking up.",
    "Matching the surface prey with the right profile converts looks into bites.",
    "Fish are glassing surface bait — a profile that matches size and action seals the deal.",
    "Natural surface presentation convinces fish that are half-committed and watching.",
    "Matching the actual size and action of surface prey is more important than noise today.",
  ],
  "natural_match:mixed": [
    "Versatile profile matches whichever forage fish happen to be targeting.",
    "In mixed forage conditions, a natural presentation that covers multiple bases wins.",
    "Profile and action match the available forage mix without over-committing.",
    "A natural, versatile presentation works when fish are switching between forage types.",
    "Mixed conditions favor a natural presentation that doesn't look out of place anywhere.",
    "When fish are opportunistic, a natural versatile profile is the most consistent producer.",
  ],

  // ── aggressive × forage ──────────────────────────────────────────────────

  "aggressive:baitfish": [
    "Big profile and aggressive action targets the largest predators in the area.",
    "Supersized baitfish presentation pushes active fish to commit hard.",
    "When fish are aggressive, a big, loud baitfish profile draws the best bites.",
    "Upsizing in an active bite separates the biggest fish from the followers.",
    "Dominant fish respond to a bigger target — go large and get the best bites.",
    "Maximum baitfish profile triggers the most territorial fish in the school.",
  ],
  "aggressive:crawfish": [
    "Aggressive fish will pounce on a crawfish that's in their zone.",
    "Big crawfish profile triggers territorial strikes from active predators.",
    "Dialing up size and action draws the most aggressive fish in the area.",
    "Bass in full aggression mode hit a big crawfish without hesitation.",
    "A large crawfish presentation triggers the biggest, most dominant fish.",
    "When fish are fired up on craw, go big — size triggers the hardest bites.",
  ],
  "aggressive:shrimp": [
    "Active fish on the flats respond to an aggressive shrimp presentation.",
    "Bigger, louder shrimp imitation triggers the most active coastal fish.",
    "When fish are fired up, push the shrimp presentation harder.",
    "Large shrimp profile on the flat triggers redfish that are actively hunting.",
    "An aggressive shrimp action fires up fish that are keyed on crustaceans.",
    "Upsizing the shrimp when fish are active brings the hardest, most committed bites.",
  ],
  "aggressive:crab": [
    "Larger crab profile triggers dominant, actively-feeding fish.",
    "Aggressive fish will commit hard to a big crab that enters their zone.",
    "Upsizing the crab imitation is the right move when fish are competing for food.",
    "A big crab presentation on a flat full of active reds produces the hardest strikes.",
    "Aggressive fish don't inspect — a large crab profile triggers an immediate eat.",
    "Max-size crab imitation for maximum aggression — don't downsize today.",
  ],
  "aggressive:leech": [
    "Active fish respond to bigger, faster leech presentations.",
    "An aggressive leech retrieve triggers the most active predators.",
    "When fish are feeding hard, upsizing the leech is the right call.",
    "Large, articulated leech pattern triggers the biggest walleye in the system.",
    "An aggressive strip cadence fires up fish keyed on leeches.",
    "Big leech presentation in aggressive conditions draws the dominant fish.",
  ],
  "aggressive:surface_prey": [
    "Loud, aggressive topwater triggers explosive surface strikes.",
    "When fish are schooling and active, a big topwater draws the hardest bites.",
    "Max noise and movement on the surface triggers the top predators in the school.",
    "Blow it up — fish are aggressive and a big surface profile gets the best bites.",
    "Schooling fish are in competition mode — the loudest topwater wins.",
    "Maximum surface disturbance triggers the biggest fish under the school.",
  ],
  "aggressive:mixed": [
    "Aggressive action and large profile triggers fish in a competitive feeding mode.",
    "Big, loud presentation triggers the dominant fish when they're in a frenzy.",
    "Active fish keyed on varied forage hit big, aggressive presentations hard.",
    "Competitive feeding mode — go bigger and louder to trigger the best fish.",
    "Fish competing for food in mixed forage conditions hit the boldest presentation first.",
    "Large, triggering profile is the right call when fish are fired up on anything that moves.",
  ],
};

/** Fallback phrase when no key matches. */
export const WHY_PICKED_FALLBACK: readonly string[] = [
  "Strong match for current conditions and forage.",
  "Profile and action align with what fish are likely targeting.",
  "Solid all-around pick for the current species and conditions.",
  "Best available match for today's forage and activity level.",
  "Presentation properties align closely with current fish behavior.",
  "Reliable producer given the current combination of conditions.",
];
