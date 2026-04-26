import type {
  ArchetypeIdV4,
  ArchetypeProfileV4,
  SeasonalRowV4,
  TacticalColumn,
  TacticalPace,
} from "../v4/contracts.ts";
import type { TargetProfile } from "./shapeProfiles.ts";

type CopyVariants = readonly [string, string, string];
type PaceCopy = Partial<Record<TacticalPace, CopyVariants>>;
type WhyNotes = readonly [string, string, string];

function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)!;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function copyVariantIndex(
  seed: string,
  field: "why" | "how",
): 0 | 1 | 2 {
  return (hashSeed(`${seed}|${field}`) % 3) as 0 | 1 | 2;
}

function columnZoneLabel(c: TacticalColumn): string {
  switch (c) {
    case "bottom":
      return "bottom zone";
    case "mid":
      return "middle of the water column";
    case "upper":
      return "upper water column";
    case "surface":
      return "surface";
  }
}

function columnPlacementPhrase(c: TacticalColumn): string {
  switch (c) {
    case "bottom":
      return "in the bottom zone";
    case "mid":
      return "in the middle of the water column";
    case "upper":
      return "in the upper water column";
    case "surface":
      return "on the surface";
  }
}

function paceLabel(p: TacticalPace): string {
  switch (p) {
    case "slow":
      return "a slow pace";
    case "medium":
      return "a steady medium pace";
    case "fast":
      return "a fast reaction pace";
  }
}

function gearNoun(archetype: ArchetypeProfileV4): "lure" | "fly" {
  return archetype.gear_mode === "fly" ? "fly" : "lure";
}

export const WHY_NOTES_BY_ARCHETYPE_ID: Record<ArchetypeIdV4, WhyNotes> = {
  weightless_stick_worm: [
    "it falls naturally around shallow cover and pressured fish",
    "it gives inactive bass a quiet meal without much hardware",
    "it can be skipped, soaked, or twitched through small openings",
  ],
  carolina_rigged_stick_worm: [
    "it covers bottom while the worm trails behind with a natural glide",
    "it searches points and flats without leaving the strike zone",
    "it shows bass a soft worm shape after the weight stirs the bottom",
  ],
  shaky_head_worm: [
    "it keeps a worm upright and subtle where fish are feeding low",
    "it works cleanly through hard bottom, gravel, and sparse cover",
    "it gives cautious fish a small meal they can pin down",
  ],
  drop_shot_worm: [
    "it holds a small worm just above bottom without dragging it away",
    "it keeps the bait in front of suspended or bottom-oriented fish",
    "it lets you fish precisely when the bite is picky",
  ],
  drop_shot_minnow: [
    "it suspends a minnow shape in front of fish without overpowering them",
    "it matches small baitfish while staying controlled in place",
    "it shines when fish want a bait held still with only slight movement",
  ],
  ned_rig: [
    "it gives fish a compact bottom meal that is hard to overwork",
    "it slides through sparse cover and rock with a small meal",
    "it catches neutral fish by staying simple and close to bottom",
  ],
  tube_jig: [
    "it can imitate crawfish, gobies, or baitfish while staying low",
    "it spirals and glides in a way smallmouth and bass track well",
    "it works around rock and transitions without looking too aggressive",
  ],
  texas_rigged_soft_plastic_craw: [
    "it gets a craw shape into cover without hanging constantly",
    "it gives bass a defensive bottom meal around grass, wood, or brush",
    "it can be pitched tight and worked slowly through high-value cover",
  ],
  football_jig: [
    "it drags cleanly over rock and keeps a craw shape on bottom",
    "it shows fish a bulky meal without moving out of the bottom lane",
    "it is strong when bass are using points, ledges, or hard-bottom breaks",
  ],
  compact_flipping_jig: [
    "it puts a compact meal directly into cover where bass hold",
    "it falls quickly and stays efficient around wood, grass, and docks",
    "it gives you a precise bait for tight, high-percentage casts",
  ],
  finesse_jig: [
    "it offers a smaller craw look when fish will not chase",
    "it keeps bottom contact without looking bulky or unnatural",
    "it fits clear water, pressure, or cold fronts where subtle bites matter",
  ],
  swim_jig: [
    "it moves through grass and cover like a bluegill or small baitfish",
    "it lets you cover water while still fishing close to cover",
    "it gives bass a swimming bait that can be sped up or slowed down",
  ],
  hair_jig: [
    "it breathes on the pause and stays subtle in cold or clear water",
    "it keeps a natural look near bottom without too much vibration",
    "it gives pressured fish a quiet look that still has life",
  ],
  inline_spinner: [
    "it brings flash and vibration through a narrow lane",
    "it calls fish from current seams, banks, and scattered cover",
    "it is easy to keep moving at a controlled depth",
  ],
  spinnerbait: [
    "it gives flash and thump while staying snag-resistant around cover",
    "it is built for wind, stain, and fish willing to react",
    "it covers water efficiently while still coming through grass or wood",
  ],
  bladed_jig: [
    "it sends vibration through grass, stain, and reaction windows",
    "it hunts through the lane and gives bass a strong moving meal",
    "it bridges baitfish and craw appeal when fish are willing to chase",
  ],
  paddle_tail_swimbait: [
    "it presents a steady baitfish shape that tracks naturally",
    "it covers water without the sharp deflection of a crankbait",
    "it can be counted down and kept at the depth fish are using",
  ],
  soft_jerkbait: [
    "it darts like a wounded baitfish without much flash or noise",
    "it can glide over cover and pause in front of followers",
    "it gives fish a subtle chase bait in the upper lane",
  ],
  suspending_jerkbait: [
    "it hangs in the strike zone after each snap",
    "it is strong when fish track baitfish but need time to commit",
    "it lets you control depth, cadence, and pauses very precisely",
  ],
  squarebill_crankbait: [
    "it deflects through shallow cover and triggers reaction bites",
    "it searches the upper lane around wood, rock, and grass edges",
    "it gives fish a compact baitfish meal that changes direction on contact",
  ],
  flat_sided_crankbait: [
    "it has a tighter action that works when fish dislike wide wobble",
    "it tracks through the upper lane with a subtle baitfish look",
    "it is useful in cooler water or pressure when a crankbait still fits",
  ],
  medium_diving_crankbait: [
    "it reaches the middle of the water column and keeps moving",
    "it searches breaks, outside grass, and suspended fish efficiently",
    "it gives fish a baitfish meal that can deflect or tick cover",
  ],
  deep_diving_crankbait: [
    "it gets a moving bait down to deep edges and bottom contact",
    "it reaches fish holding low without switching to a slow drag",
    "it can grind into rock or ledges and trigger bites on deflection",
  ],
  lipless_crankbait: [
    "it covers water fast with vibration and a tight baitfish shape",
    "it rips free from grass and triggers fish that react to speed",
    "it searches flats and open lanes without needing a diving bill",
  ],
  blade_bait: [
    "it gives a tight vibration close to bottom in cold or deep water",
    "it shines when fish want a compact bait lifted and dropped",
    "it reaches depth quickly and stays efficient on vertical or short casts",
  ],
  casting_spoon: [
    "it flashes like fleeing baitfish and covers open water well",
    "it can be counted down to fish using the middle of the water column",
    "it works for cruising fish that respond to flash and speed changes",
  ],
  walking_topwater: [
    "it draws fish up with a side-to-side surface meal",
    "it covers open water and edges without sitting in one place",
    "it is right when fish will chase a moving meal on top",
  ],
  popping_topwater: [
    "it makes a compact surface disturbance and can pause in place",
    "it calls fish from cover without moving too far away",
    "it lets you mix sound, pause length, and small twitches on top",
  ],
  buzzbait: [
    "it covers shallow water fast with steady surface commotion",
    "it is strong around active fish that react to speed and noise",
    "it lets you run banks, grass edges, and lanes without slowing down",
  ],
  prop_bait: [
    "it adds surface flash and sputter without needing a long pull",
    "it can be stopped beside cover after calling fish up",
    "it gives fish a topwater meal with more disturbance than a walker",
  ],
  hollow_body_frog: [
    "it goes over grass, pads, and cover where open-hook baits cannot",
    "it gives bass a surface meal they can attack in heavy cover",
    "it can sit in holes and walk across mats without leaving the strike zone",
  ],
  large_profile_pike_swimbait: [
    "it gives pike a large baitfish shape with a steady kick",
    "it moves enough water for bigger predators to track it",
    "it can be kept in the lane without the hard dart of a jerkbait",
  ],
  pike_jerkbait: [
    "it flashes and pauses like a wounded baitfish pike can follow",
    "it lets you trigger followers with speed changes and stops",
    "it gives big fish a broad side flash in the middle lane",
  ],
  large_bucktail_spinner: [
    "it combines flash, pulse, and size for covering pike water",
    "it stays easy for pike to track even in stain or chop",
    "it searches weed edges, points, and current lanes efficiently",
  ],
  large_pike_topwater: [
    "it gives pike a big surface meal they can find from a distance",
    "it works when predators are willing to look up and track commotion",
    "it lets you cover shallow edges while keeping the strike visual",
  ],
  pike_jig_and_plastic: [
    "it puts a large meal close to bottom where pike can pin it",
    "it works when fish are lower but still want a baitfish shape",
    "it can be crawled, hopped, or swum just above bottom",
  ],
  clouser_minnow: [
    "it rides point-down and keeps a baitfish shape in the lane",
    "it gets down quickly without losing a clean swimming shape",
    "it is a dependable choice for current, edges, and open lanes",
  ],
  deceiver: [
    "it gives a slim baitfish shape with a natural flowing tail",
    "it tracks cleanly when fish want a streamer that is not bulky",
    "it can be stripped steadily without overpowering clear or calm water",
  ],
  bucktail_baitfish_streamer: [
    "it holds shape in current and keeps a clean baitfish silhouette",
    "it has enough size to be seen without looking oversized",
    "it works when fish are tracking small to mid-sized baitfish",
  ],
  slim_minnow_streamer: [
    "it matches smaller baitfish and stays subtle in the upper lane",
    "it darts cleanly without too much bulk or push",
    "it is useful when fish are chasing but still selective",
  ],
  articulated_baitfish_streamer: [
    "it adds jointed movement to a baitfish shape",
    "it gives predators a bigger moving meal without losing realism",
    "it keeps life in the fly even when you pause the retrieve",
  ],
  articulated_dungeon_streamer: [
    "it pushes water and shows fish a large vulnerable meal",
    "it works when predators are willing to eat a bigger streamer",
    "it adds movement and size while still being controllable",
  ],
  game_changer: [
    "it swims with a segmented baitfish action that looks alive",
    "it tracks naturally when fish are following but not committing",
    "it gives a realistic baitfish shape for steady streamer work",
  ],
  woolly_bugger: [
    "it is a versatile leech or nymph look that works in many lanes",
    "it pulses on the pause and keeps a natural look",
    "it catches fish when a simple, buggy swimming fly is enough",
  ],
  rabbit_strip_leech: [
    "it has natural movement even when barely stripped",
    "it stays low and gives fish a soft leech shape",
    "it works when fish want something alive but not fast",
  ],
  jighead_marabou_leech: [
    "it gets down and pulses with very little rod movement",
    "it keeps a leech shape close to bottom or the lower lane",
    "it is strong when fish want a slow meal that still breathes",
  ],
  lead_eye_leech: [
    "it sinks fast and keeps a compact leech shape low",
    "it reaches bottom-oriented fish without a bulky silhouette",
    "it works when depth control matters more than speed",
  ],
  feather_jig_leech: [
    "it gives a jigging leech look with a little more snap",
    "it stays compact while still pulsing on short strips",
    "it works when fish want a leech moved a bit more actively",
  ],
  balanced_leech: [
    "it hangs level under tension and looks alive while paused",
    "it stays in front of stillwater trout without moving out of the lane",
    "it is built for patient presentations where the pause matters",
  ],
  zonker_streamer: [
    "it gives a baitfish or leech look with constant rabbit-strip movement",
    "it has enough bulk to be seen while still moving naturally",
    "it works when fish want a swimming fly with a soft body pulse",
  ],
  sculpin_streamer: [
    "it matches bottom-oriented sculpins and baitfish",
    "it stays low where fish expect a sculpin to move",
    "it is strongest around rock, current breaks, and bottom cover",
  ],
  sculpzilla: [
    "it gives a heavier sculpin shape that gets down quickly",
    "it moves water close to bottom without needing a fast strip",
    "it is a good choice when fish are hunting low and tight to structure",
  ],
  muddler_sculpin: [
    "it can suggest a sculpin, minnow, or waking bait depending on retrieve",
    "it has a broad head that pushes water without too much flash",
    "it fits trout water where fish key on bottom prey near current breaks",
  ],
  crawfish_streamer: [
    "it matches bottom prey that fish expect around rock and cover",
    "it gives a defensive craw look without needing much speed",
    "it works when fish are feeding low and looking down",
  ],
  warmwater_crawfish_fly: [
    "it gives bass and smallmouth a craw shape in fly form",
    "it belongs around rock, grass edges, and bottom transitions",
    "it adds a non-baitfish fly option when fish are feeding low",
  ],
  warmwater_worm_fly: [
    "it offers a simple worm shape for warmwater fish feeding low",
    "it can be crawled slowly when fish will not chase",
    "it gives bass a soft bottom meal without much flash",
  ],
  conehead_streamer: [
    "it gets down quickly while keeping a clean streamer shape",
    "it is useful when current or depth calls for extra weight",
    "it gives fish a baitfish meal that stays under control",
  ],
  pike_bunny_streamer: [
    "it shows pike a large, breathing shape with natural movement",
    "it keeps action in the fly even during pauses",
    "it is a strong choice when pike want a big soft baitfish shape",
  ],
  large_articulated_pike_streamer: [
    "it gives pike a big jointed meal with plenty of movement",
    "it calls predators from distance without needing constant speed",
    "it keeps a large shape alive through strips and pauses",
  ],
  unweighted_baitfish_streamer: [
    "it stays higher in the lane and moves like a vulnerable baitfish",
    "it is useful over grass, shallow edges, and fish looking up",
    "it lets you fish a baitfish shape without sinking too quickly",
  ],
  baitfish_slider_fly: [
    "it slides and wakes like a baitfish near the upper lane",
    "it gives fish a subtle top-end meal without a hard pop",
    "it is useful when fish are looking up but not crushing loud surface flies",
  ],
  popper_fly: [
    "it calls fish up with a compact surface pop",
    "it can pause in place after making noise on top",
    "it works when fish will rise to a small surface disturbance",
  ],
  deer_hair_slider: [
    "it wakes and slides quietly across the surface",
    "it offers a softer topwater look than a hard popper",
    "it can be fished around calm pockets, seams, and cover edges",
  ],
  foam_gurgler_fly: [
    "it makes a light surface wake without sinking between strips",
    "it gives warmwater fish a small topwater meal with steady commotion",
    "it is useful when fish want something above them but not oversized",
  ],
  frog_fly: [
    "it matches a small frog or amphibian shape on top",
    "it belongs around grass, pads, banks, and shallow cover",
    "it gives bass a fly option for the same surface lane as frog lures",
  ],
  mouse_fly: [
    "it gives trout a large surface meal during low-light windows",
    "it can wake across current where trout are willing to look up",
    "it is a commitment fly for fish hunting big food on top",
  ],
  pike_flash_fly: [
    "it gives pike flash and a baitfish shape in the upper lane",
    "it is built for predators tracking shine, speed, and direction changes",
    "it adds a brighter fly option when pike are hunting baitfish",
  ],
};

export function buildWhyChosenCopy(args: {
  archetype: ArchetypeProfileV4;
  row: SeasonalRowV4;
  targetProfile: TargetProfile;
  variant: 0 | 1 | 2;
}): string {
  const { archetype, targetProfile, variant } = args;
  const pace = paceLabel(targetProfile.pace);
  const column = columnZoneLabel(targetProfile.column);
  const placement = columnPlacementPhrase(targetProfile.column);
  const noun = gearNoun(archetype);
  const note = WHY_NOTES_BY_ARCHETYPE_ID[archetype.id][variant];

  const variants: CopyVariants = [
    `${archetype.display_name} fits the ${column}: ${note}. Fish this ${noun} at ${pace} so it stays in the strike zone.`,
    `I like ${archetype.display_name} ${placement} because ${note}. Keep it at ${pace} and make repeatable casts to good water.`,
    `${archetype.display_name} earns its place ${placement} because ${note}. Use ${pace}, then adjust only after the fish show a preference.`,
  ];

  return variants[variant];
}

const bottomDrag: PaceCopy = {
  slow: [
    "Cast past the cover, feel bottom, then drag a few inches and pause long enough for the bait to settle.",
    "Keep the line semi-tight, maintain bottom contact, and move it with the rod instead of the reel.",
    "Work it from hard spot to hard spot, pausing after each hop or drag so fish can pin it down.",
  ],
  medium: [
    "Use short hops and steady drags, then pause whenever it hits rock, grass, or a depth change.",
    "Keep it ticking bottom while you cover water, reeling slack only after each rod pull.",
    "Move it with controlled hops across the bottom lane and watch the line on every fall.",
  ],
};

const softFall: PaceCopy = {
  slow: [
    "Cast to cover, let it fall on slack line, then wait before adding a small lift.",
    "Let it glide naturally, twitch once or twice, and pause again before moving it out.",
    "Skip or pitch it to shade, watch the line on the fall, and avoid overworking it.",
  ],
  medium: [
    "Cover high-percentage casts with a cast-fall-twitch rhythm, then move to the next opening.",
    "Use short lifts to keep it gliding through the upper lane, then let it fall beside cover.",
    "Twitch it just enough to make it wander, then pause when it reaches shade, grass, or wood.",
  ],
};

const dropShot: PaceCopy = {
  slow: [
    "Set the weight down, tighten the line, and shake the bait without moving the sinker much.",
    "Hold it above bottom with tiny rod-tip pulses, then pause until the line feels heavy.",
    "Drop straight to the fish, keep the bait hovering, and let current or boat drift add life.",
  ],
};

const pitchCover: PaceCopy = {
  slow: [
    "Pitch tight to cover, let it fall on a controlled line, then crawl it before the next pitch.",
    "Drop it into holes and edges, shake it once, and pause before easing it out.",
    "Let it fall cleanly, hop it once or twice, and be ready for a bite as it leaves cover.",
  ],
};

const swimMid: PaceCopy = {
  slow: [
    "Count it down, swim it just fast enough to keep it alive, and pause beside cover.",
    "Use a low rod angle and slow retrieve so it tracks level instead of rising too high.",
    "Let it fall to the lane, swim it a few feet, then kill it briefly at edges or shade.",
  ],
  medium: [
    "Retrieve steadily through the lane, adding a half-second pause when it passes cover.",
    "Keep the rod tip pointed at the bait and use the reel to hold a clean, even track.",
    "Cover water at a controlled pace, counting it down again after each cast if depth changes.",
  ],
  fast: [
    "Burn it through open lanes, then hesitate at cover so followers have a chance to eat.",
    "Speed it up enough to trigger reaction bites, but keep it from blowing out of the lane.",
    "Make long casts, retrieve quickly, and add one sharp change of speed near the best cover.",
  ],
};

const spinnerRetrieve: PaceCopy = {
  slow: [
    "Slow-roll it just fast enough to feel the blade pulse while it stays near the fish.",
    "Keep the rod tip low, let it run deep, and avoid pumping the bait out of the lane.",
    "Crawl it through cover with steady pressure and pause only when it bumps something.",
  ],
  medium: [
    "Use a steady retrieve so the blades thump consistently from cast to boat.",
    "Run it past cover at a medium pace, ticking grass or wood without stopping completely.",
    "Let the flash search water, then angle the next cast tighter to any follow or strike.",
  ],
  fast: [
    "Burn it high enough to flash, then slow for one turn when it reaches cover.",
    "Use speed to trigger fish, but keep enough tension to feel the blades working.",
    "Cover water quickly with long casts and aim for edges, shade lines, and wind-blown banks.",
  ],
};

const jerkPause: PaceCopy = {
  slow: [
    "Twitch once or twice, pause on slack line, and let the bait sit where a fish can inspect it.",
    "Use short downward snaps, then wait long enough for the bait to stop moving.",
    "Keep the cadence patient: snap, pause, watch the line, then snap again.",
  ],
  medium: [
    "Work a twitch-pause cadence with enough rhythm to keep the bait moving forward.",
    "Snap it twice, pause briefly, and repeat while keeping the rod tip low.",
    "Keep it in the lane with controlled snaps, then pause longer when it reaches cover.",
  ],
  fast: [
    "Use sharp snaps and short pauses to make followers react before they study it.",
    "Rip it quickly through the lane, then kill it for a beat near the best cover.",
    "Keep the cadence aggressive but leave tiny pauses so the bait looks catchable.",
  ],
};

const crankRetrieve: PaceCopy = {
  medium: [
    "Crank until it reaches depth, then keep a steady retrieve and let contact create deflection.",
    "Aim it at rock, wood, or grass edges, then pause for a beat after it ticks cover.",
    "Use a medium retrieve that keeps it digging without overpowering fish that only follow.",
  ],
  fast: [
    "Burn it through the lane, let it deflect, and keep reeling unless it loads up.",
    "Make long casts and use speed to force a decision, especially around hard cover.",
    "Run it fast enough to hunt, then briefly stall after contact to trigger the bite.",
  ],
};

const bladeLift: PaceCopy = {
  slow: [
    "Lift it just off bottom, follow it down on a tight line, and pause after it lands.",
    "Use short rod lifts so it vibrates once or twice before falling back into place.",
    "Keep the hops small and controlled, watching for the line to jump on the drop.",
  ],
  medium: [
    "Snap it off bottom, let it fall on tension, and repeat without dragging it too far.",
    "Use a lift-fall rhythm to cover the break while keeping the bait close to bottom.",
    "Hop it steadily and treat every heavy feeling on the fall like a bite.",
  ],
};

const surfaceWalk: PaceCopy = {
  slow: [
    "Walk it with short slack-line twitches, then let it sit until the rings fade.",
    "Make it glide side to side, pausing longer beside grass, shade, or isolated cover.",
    "Keep the cadence slow and wait to feel weight before setting the hook.",
  ],
  medium: [
    "Walk it steadily across open lanes, adding short pauses at the highest-value spots.",
    "Use a clean side-to-side rhythm and keep slack in the line so it turns sharply.",
    "Cover water on top, then repeat casts where fish miss or follow.",
  ],
  fast: [
    "Move it quickly to call active fish, but pause briefly when it crosses cover.",
    "Use a fast walking cadence across open water and slow down after any swirl.",
    "Keep it moving high on the surface until a fish shows, then make the next cast slower.",
  ],
};

const surfacePop: PaceCopy = {
  slow: [
    "Pop it once, let the rings fade completely, then move it just enough to breathe.",
    "Use soft single pops around cover and make the pause longer than the pull.",
    "Keep it almost still between pops so fish can rise and find it.",
  ],
  medium: [
    "Use a pop-pop-pause cadence, then stop it beside shade, grass, or current seams.",
    "Make enough noise to call fish up, but leave short pauses so they can commit.",
    "Work it across the surface with steady pops and vary volume until fish respond.",
  ],
  fast: [
    "Pop it quickly across open lanes, then stop it hard at cover or the edge of shade.",
    "Use sharp pops to cover water, but keep one pause in every short sequence.",
    "Make it spit and move, then kill it when a fish swirls behind it.",
  ],
};

const frogSurface: PaceCopy = {
  slow: [
    "Twitch it in place over holes, pads, or shade, then pause before moving it again.",
    "Walk it a few inches at a time and let it sit on the best-looking openings.",
    "Keep the rod tip down, work it slowly over cover, and wait to feel weight before swinging.",
  ],
  medium: [
    "Walk it across mats or grass with steady twitches, then stop it at edges and holes.",
    "Use a steady topwater cadence across cover and slow down where a fish could ambush.",
    "Keep it moving over thick cover, then pause when it reaches open water.",
  ],
};

const flyStrip: PaceCopy = {
  slow: [
    "Cast across the lane, mend or count it down, then use short strips with long pauses.",
    "Strip slowly and let the fly hang after each pull so the materials keep moving.",
    "Keep slack under control, pause often, and watch the leader for soft eats.",
  ],
  medium: [
    "Use steady strips with brief pauses, keeping the fly swimming broadside through the lane.",
    "Strip-strip-pause through cover edges, then change angle if fish follow without eating.",
    "Keep the retrieve clean and controlled, speeding up only after the fly clears the best water.",
  ],
  fast: [
    "Use fast strips to make the fly dart, then kill it for a short pause near the best water.",
    "Strip quickly through open lanes and stay ready for a hard eat on the stop.",
    "Make the fly flee, pause just long enough to look vulnerable, then accelerate again.",
  ],
};

const flyLeech: PaceCopy = {
  slow: [
    "Let it sink to the lane, then use one-inch strips and long pauses so it pulses in place.",
    "Crawl it with short strips, keeping the rod low and the line tight enough to feel weight.",
    "Fish it slowly through the lower lane and let the materials breathe between moves.",
  ],
  medium: [
    "Use medium strips and pause when it reaches cover, depth changes, or current breaks.",
    "Swim it through the lower lane with a strip-pause rhythm and watch for the line to stop.",
    "Keep it moving steadily, then add a longer pause when fish are following.",
  ],
};

const flyBottom: PaceCopy = {
  slow: [
    "Let it reach bottom, strip it a few inches, and pause so it looks like prey trying to hide.",
    "Bump it along bottom with short strips and keep enough tension to feel subtle takes.",
    "Work it slowly through rock, seams, or transitions and let it settle after each move.",
  ],
  medium: [
    "Use short, firm strips near bottom and pause after it bumps rock or cover.",
    "Hop it along the bottom lane at a steady pace, watching for the leader to tick.",
    "Keep it low, move it with controlled strips, and slow down in the best-looking water.",
  ],
};

const flySurface: PaceCopy = {
  slow: [
    "Land it softly, let it sit, then give one small twitch and wait again.",
    "Move it just enough to make a ring on top, pausing longer near banks, shade, or seams.",
    "Keep the rod low, use tiny strips, and let the fish eat before lifting.",
  ],
  medium: [
    "Use a steady strip-pause cadence on top and stop it beside cover or current breaks.",
    "Keep it waking or sliding across the surface, then pause where a fish can track it.",
    "Move it with short strips, vary the pause, and repeat casts after swirls or misses.",
  ],
  fast: [
    "Skate it quickly across open lanes, then stop it near cover so followers can catch it.",
    "Use fast strips to cover water on top, adding short pauses after any boil or wake.",
    "Make it flee across the surface, then kill it briefly in the strike zone.",
  ],
};

export const HOW_COPY_BY_ARCHETYPE_ID: Record<ArchetypeIdV4, PaceCopy> = {
  weightless_stick_worm: softFall,
  carolina_rigged_stick_worm: bottomDrag,
  shaky_head_worm: bottomDrag,
  drop_shot_worm: dropShot,
  drop_shot_minnow: dropShot,
  ned_rig: bottomDrag,
  tube_jig: bottomDrag,
  texas_rigged_soft_plastic_craw: pitchCover,
  football_jig: bottomDrag,
  compact_flipping_jig: pitchCover,
  finesse_jig: bottomDrag,
  swim_jig: swimMid,
  hair_jig: bottomDrag,
  inline_spinner: spinnerRetrieve,
  spinnerbait: spinnerRetrieve,
  bladed_jig: swimMid,
  paddle_tail_swimbait: swimMid,
  soft_jerkbait: jerkPause,
  suspending_jerkbait: jerkPause,
  squarebill_crankbait: crankRetrieve,
  flat_sided_crankbait: crankRetrieve,
  medium_diving_crankbait: crankRetrieve,
  deep_diving_crankbait: crankRetrieve,
  lipless_crankbait: crankRetrieve,
  blade_bait: bladeLift,
  casting_spoon: swimMid,
  walking_topwater: surfaceWalk,
  popping_topwater: surfacePop,
  buzzbait: surfaceWalk,
  prop_bait: surfaceWalk,
  hollow_body_frog: frogSurface,
  large_profile_pike_swimbait: swimMid,
  pike_jerkbait: jerkPause,
  large_bucktail_spinner: spinnerRetrieve,
  large_pike_topwater: surfaceWalk,
  pike_jig_and_plastic: bottomDrag,
  clouser_minnow: flyStrip,
  deceiver: flyStrip,
  bucktail_baitfish_streamer: flyStrip,
  slim_minnow_streamer: flyStrip,
  articulated_baitfish_streamer: flyStrip,
  articulated_dungeon_streamer: flyStrip,
  game_changer: flyStrip,
  jighead_marabou_leech: flyLeech,
  lead_eye_leech: flyLeech,
  woolly_bugger: flyLeech,
  rabbit_strip_leech: flyLeech,
  balanced_leech: flyLeech,
  zonker_streamer: flyStrip,
  sculpin_streamer: flyBottom,
  sculpzilla: flyBottom,
  muddler_sculpin: flyBottom,
  crawfish_streamer: flyBottom,
  conehead_streamer: flyStrip,
  pike_bunny_streamer: flyStrip,
  large_articulated_pike_streamer: flyStrip,
  unweighted_baitfish_streamer: flyStrip,
  baitfish_slider_fly: flyStrip,
  warmwater_crawfish_fly: flyBottom,
  warmwater_worm_fly: flyBottom,
  popper_fly: flySurface,
  deer_hair_slider: flySurface,
  foam_gurgler_fly: flySurface,
  frog_fly: flySurface,
  feather_jig_leech: flyLeech,
  pike_flash_fly: flyStrip,
  mouse_fly: flySurface,
};

const fallbackHow: Record<TacticalPace, CopyVariants> = {
  slow: [
    "Fish it slowly through the assigned lane with short moves and patient pauses.",
    "Use controlled rod movement, keep it at the right depth, and pause before leaving good water.",
    "Slow down, keep contact with the lure or fly, and let fish show you when to speed up.",
  ],
  medium: [
    "Work it steadily through the assigned lane and pause briefly at the best pieces of cover.",
    "Use a medium retrieve that keeps it tracking cleanly without rushing past fish.",
    "Cover water at a controlled pace, then repeat productive angles.",
  ],
  fast: [
    "Move it quickly through the assigned lane and use short pauses to make it catchable.",
    "Use speed to trigger reaction bites while keeping the lure or fly at the right depth.",
    "Cover water fast, but slow down immediately around follows, boils, or missed strikes.",
  ],
};

export function buildHowToFishCopy(args: {
  archetype: ArchetypeProfileV4;
  targetProfile: TargetProfile;
  variant: 0 | 1 | 2;
}): string {
  const { archetype, targetProfile, variant } = args;
  const paceCopy = HOW_COPY_BY_ARCHETYPE_ID[archetype.id];
  const variants = paceCopy[targetProfile.pace] ??
    fallbackHow[targetProfile.pace];
  return variants[variant];
}
