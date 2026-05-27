import type { ArchetypeIdV4, ConditionTag } from "../v4/contracts.ts";
import type { DailyScenario } from "./buildDailyScenario.ts";
import type { CandidateScore } from "./scoreCandidate.ts";
import type { DailyPicksVariant } from "./selectDailyPicks.ts";

type WhyLineSet = readonly [string, string, string];

const CONTEXT_LINES_BY_TAG = {
  calm_surface: [
    "Today's calm water lets fish study the surface",
    "Today's slick surface makes a clean wake easier to track",
    "With the surface quiet today, precise commotion matters",
  ],
  low_light_surface: [
    "Today's low light lets fish feed upward more comfortably",
    "Today's shade and low light make overhead prey feel safer to attack",
    "With softer light today, fish can commit shallower and higher",
  ],
  wind_reaction: [
    "A light breeze today gives moving baits enough cover to look natural",
    "Today's breeze can move bait and help fish commit to a moving target",
    "Today's ripple helps fish track flash and movement without studying it too long",
  ],
  dirty_vibration: [
    "Today's stained water makes feel and silhouette matter",
    "Today's reduced visibility favors a bait fish can track without studying it",
    "In today's dirty water, presence and outline help fish find the meal",
  ],
  clear_subtle: [
    "Today's clear water rewards a natural profile",
    "Today's good visibility calls for something convincing, not pushy",
    "When fish can inspect the bait today, a cleaner look matters",
  ],
  cold_slow: [
    "Today's cooler water favors an easy target",
    "Today's slower bite rewards a presentation fish do not have to chase far",
    "When fish are less willing to run today, control and hang time matter",
  ],
  warming_search: [
    "Today's warming water can spread fish out and open the chase window",
    "Today's warming trend helps fish slide into feeding lanes",
    "When today's bite is opening up, covering likely water matters",
  ],
  heat_finesse: [
    "Today's hot, tough bite rewards controlled presentations",
    "When today's heat slows the bite, a cleaner target can get extra looks",
    "Today's warm water calls for something fish can eat without much effort",
  ],
  runoff_streamer: [
    "Today's runoff points fish toward bigger silhouettes and easy meals",
    "Today's extra color in moving water rewards a profile fish can pick up quickly",
    "When today's flow carries food, a visible meal gets noticed",
  ],
  current_swing: [
    "Today's current gives fish a predictable ambush lane",
    "Today's moving water makes a controlled swing or drift feel natural",
    "Today's current helps deliver the bait to fish already facing upstream",
  ],
  cover_ambush: [
    "Today's cover pattern points fish toward short, committed strikes",
    "Around today's cover, fish often want a target that enters their space cleanly",
    "Today's tight cover rewards a bait that can show up and get out",
  ],
  open_water_search: [
    "Today's open-water setup calls for a bait that can show itself",
    "When fish are spread out today, a searchable profile earns more chances",
    "Away from obvious targets today, covering water with the right look matters",
  ],
} as const satisfies Record<ConditionTag, readonly string[]>;

const CONTEXT_LINES_BY_CLARITY = {
  clear: [
    "Today's clear water rewards a natural profile",
    "Today's good visibility makes realism and clean movement matter",
    "When fish can see well today, the right shape matters more than noise",
  ],
  stained: [
    "Today's stained water makes silhouette and feel important",
    "Today's color in the water helps fish commit to a stronger profile",
    "Today's reduced visibility rewards a bait that gives fish something to track",
  ],
  dirty: [
    "Today's dirty water puts a premium on presence",
    "Today's low visibility favors a bait fish can locate quickly",
    "When today's water has color, vibration and outline do real work",
  ],
} as const satisfies Record<DailyScenario["water_clarity"], readonly string[]>;

const WHY_LINES_BY_ID = {
  weightless_stick_worm: [
    "a weightless stick worm falls with a slow shimmy that pressured bass can eat without chasing",
    "it slips around shallow cover and docks while looking like an easy, dying meal",
    "its quiet fall keeps the bait in the strike zone long enough for neutral fish to decide",
  ],
  carolina_rigged_stick_worm: [
    "a Carolina-rigged stick worm covers bottom while keeping a soft, natural profile behind the weight",
    "it lets you probe points, flats, and breaks without overpowering fish",
    "the separated weight finds the bottom while the worm trails behind like a vulnerable meal",
  ],
  shaky_head_worm: [
    "a shaky head keeps a worm upright and nervous in one small feeding window",
    "it shines when fish need a bottom bait that moves without leaving the spot",
    "the light head and subtle tail give bass a clean target around rock, docks, and sparse cover",
  ],
  drop_shot_worm: [
    "a drop-shot worm holds just off bottom where fish can stare it down and still eat it",
    "it gives inactive fish a small, easy target without dragging the bait out of place",
    "the suspended worm looks alive with very little movement from the rod",
  ],
  drop_shot_minnow: [
    "a drop-shot minnow keeps a baitfish profile pinned in front of fish that are watching, not chasing",
    "it is a clean way to show a small minnow above bottom without overworking it",
    "the rig lets the minnow hover naturally around rock, grass edges, or suspended marks",
  ],
  ned_rig: [
    "a Ned rig gives fish a compact bottom meal that looks harmless and easy to eat",
    "its small profile keeps getting bites when larger baits feel like too much",
    "the stand-up look mimics small craws, gobies, and bottom prey without needing much action",
  ],
  tube_jig: [
    "a tube jig glides and spirals like a goby, craw, or dying baitfish near bottom",
    "it is subtle enough for clear water but still has bulk fish can find",
    "the hollow body breathes on pauses and gives smallmouth a familiar bottom profile",
  ],
  big_smallmouth_tube: [
    "a bigger tube keeps the smallmouth profile but adds enough bulk to tempt better fish",
    "it looks like a full meal around rock, breaks, and current seams",
    "the wider spiral fall gives curious smallmouth time to track it and commit",
  ],
  texas_rigged_soft_plastic_craw: [
    "a Texas-rigged craw gets into cover while still looking like a real bottom meal",
    "its compact claws give bass a target they can pin without needing a long chase",
    "the weedless rig lets the craw work through grass, wood, and rock where bites happen",
  ],
  football_jig: [
    "a football jig drags cleanly over rock and shows fish a craw profile with real bottom feel",
    "its wide head keeps contact and helps the skirt flare when it stops",
    "it is built for points, ledges, and hard bottom where bigger bass feed down",
  ],
  compact_flipping_jig: [
    "a compact flipping jig punches into cover with a full-meal look in a small package",
    "it gives bass a craw-shaped target that enters their space quickly",
    "the shorter profile is easier for fish to inhale around wood, grass, and docks",
  ],
  finesse_jig: [
    "a finesse jig keeps the craw profile but trims the bulk for pressured or clear-water fish",
    "it gives bass a bottom bait with texture, flare, and a smaller bite-sized shape",
    "the compact skirt and trailer look alive without forcing a fast retrieve",
  ],
  swim_jig: [
    "a swim jig moves like a bluegill or baitfish while staying clean through grass and cover",
    "it lets you fish a moving bait where treble hooks or open hooks struggle",
    "the skirt adds a fuller profile without losing the steady swimming action",
  ],
  hair_jig: [
    "a hair jig breathes and glides with almost no rod movement",
    "it gives clear-water fish a subtle baitfish or leech profile that does not look mechanical",
    "the natural fibers keep moving on the pause, which is often when followers commit",
  ],
  inline_spinner: [
    "an inline spinner gives trout and bass flash with a tight, easy-to-track vibration",
    "its compact blade calls fish from current, pockets, and small feeding lanes",
    "the small spinning profile looks like quick baitfish or an escaping bug-sized meal",
  ],
  spinnerbait: [
    "a spinnerbait combines flash, thump, and a weed-resistant frame fish can track around cover",
    "it gives bass a baitfish target that stays visible and readable in chop or stain",
    "the blades call fish in while the skirt gives them a clear place to strike",
  ],
  bladed_jig: [
    "a bladed jig has the hard thump and hunting action to trigger fish in grass or stained water",
    "it feels like a baitfish pushing water, which helps fish locate it quickly",
    "the blade gives the bait presence while the skirt and trailer make it look alive",
  ],
  paddle_tail_swimbait: [
    "a paddle-tail swimbait gives fish a steady baitfish profile with a thump they can follow",
    "it covers water without looking frantic, which makes it useful for roaming fish",
    "the tail kick adds just enough vibration while the body keeps a natural minnow shape",
  ],
  glidebait: [
    "a glide bait shows big fish a slow, broad meal that can pull followers from distance",
    "its side-to-side movement looks like an exposed baitfish that is not escaping cleanly",
    "the larger profile can make quality fish reveal themselves even before they bite",
  ],
  compact_glidebait: [
    "a compact glide bait keeps the drawing power of a glide in a size more fish will commit to",
    "it gives followers a slower baitfish target without asking them to eat a giant lure",
    "the smaller glide is easier to work around docks, points, and shallow targets",
  ],
  soft_jerkbait: [
    "a soft jerkbait darts and glides like a wounded baitfish without much hardware showing",
    "it stays natural in shallow water where fish can get a good look",
    "the weightless slash and slow fall make it deadly around grass, shade, and schooling fish",
  ],
  suspending_jerkbait: [
    "a suspending jerkbait hangs in front of fish after the flash gets their attention",
    "it mimics a stunned baitfish and gives followers time to close the gap",
    "the pause is the weapon, especially when fish track but will not chase far",
  ],
  magnum_jerkbait: [
    "a magnum jerkbait gives pike and bigger bass a larger baitfish target that still stops in their face",
    "its hard flash and suspend can turn a curious follower into a committed strike",
    "the bigger profile matches larger forage without losing the trigger of a sharp pause",
  ],
  squarebill_crankbait: [
    "a squarebill crashes through shallow cover and deflects like fleeing bait",
    "its wide wobble and contact make fish react before they can inspect it",
    "the bill helps it hunt through wood, rock, and shallow grass where bass ambush",
  ],
  flat_sided_crankbait: [
    "a flat-sided crankbait has a tighter action that looks natural when fish are wary",
    "it gives bass a baitfish profile with less roll and flash than a wide-wobbling plug",
    "the subtle vibration is a strong fit when fish want movement but not chaos",
  ],
  medium_diving_crankbait: [
    "a medium-diving crankbait reaches the mid-depth lanes where bass often intercept bait",
    "it covers points, edges, and outside grass with a steady, deflecting profile",
    "the diving bill keeps it in contact long enough to trigger reaction bites",
  ],
  deep_diving_crankbait: [
    "a deep-diving crankbait gets down to ledges and breaks where fish can group up",
    "it shows offshore fish a moving bait that digs, deflects, and stays in their zone",
    "the bigger diving profile is built to reach fish that are feeding below casual casting depth",
  ],
  lipless_crankbait: [
    "a lipless crankbait covers water fast with flash and vibration fish can feel",
    "it rips free from grass and gives bass a sudden target to react to",
    "the tight shimmy and rattling profile help locate fish across flats and open lanes",
  ],
  blade_bait: [
    "a blade bait gives cold or deep fish a tight vibration without a big profile",
    "it drops fast, stays compact, and flashes like a struggling baitfish",
    "the lift-and-fall action keeps it near bottom where reluctant fish can pick it off",
  ],
  casting_spoon: [
    "a casting spoon flashes and flutters like a wounded baitfish falling through the column",
    "it casts far and reaches roaming fish without losing a simple baitfish look",
    "the flutter on the drop gives trout, pike, and bass an easy moment to strike",
  ],
  small_floating_trout_plug: [
    "a floating trout plug gives trout a small baitfish profile that can pause and rise naturally",
    "it works current edges and shallow lanes without sinking below feeding fish too quickly",
    "the floating body lets you twitch, pause, and let current reset the lure",
  ],
  walking_topwater: [
    "a walking bait calls fish up with a side-to-side surface track they can follow",
    "it covers open water and points while looking like a struggling baitfish on top",
    "the walking cadence gives fish time to line up the strike instead of just swiping",
  ],
  popping_topwater: [
    "a popper creates a focused surface cue without moving too far from the strike zone",
    "it imitates a small baitfish or panfish struggling in one tight window",
    "the splash-and-pause rhythm helps fish find it and then commit",
  ],
  buzzbait: [
    "a buzzbait makes a loud surface trail that helps aggressive fish find it fast",
    "it covers shallow water quickly and turns cover-oriented fish into reaction biters",
    "the squeak, wake, and blade churn give bass one clear target to crush",
  ],
  prop_bait: [
    "a prop bait throws flash and sputter while staying close to the strike zone",
    "it is strong when fish will rise but need a bait that pauses between commotion",
    "the props make noise without forcing the lure to leave high-percentage water",
  ],
  hollow_body_frog: [
    "a hollow-body frog gives bass a compact surface target they can track and commit to",
    "its weedless body lets you work a topwater through shallow lanes and around cover",
    "the frog profile creates a patient overhead meal when bigger fish are willing to rise",
  ],
  wake_bait: [
    "a wake bait leaves a slow surface bulge that looks like an easy baitfish or bluegill",
    "it gives followers a clear target without the sharp pop of a louder topwater",
    "the steady wake keeps the bait visible over shallow cover and along edges",
  ],
  magnum_worm: [
    "a magnum worm gives bigger bass a slow, full-sized meal near bottom",
    "it keeps drawing power without forcing fish to chase a moving bait",
    "the long profile works through cover and structure where quality fish settle in",
  ],
  large_profile_pike_swimbait: [
    "a large paddle-tail swimbait gives pike a full baitfish meal with a steady thump",
    "it matches the size pike like to track and can be slow-rolled through prime lanes",
    "the big body and tail kick help predators find it without needing a frantic retrieve",
  ],
  pike_spinnerbait: [
    "an oversized spinnerbait gives pike flash, thump, and a single-hook target around weeds",
    "it moves water like a fleeing baitfish while staying cleaner than most treble baits",
    "the big blades make it easy for pike to track in chop, stain, or shallow cover",
  ],
  weedless_spoon: [
    "a weedless spoon flashes through grass where pike and bass expect bait to hide",
    "it slips through vegetation while wobbling like a wounded panfish",
    "the wide flutter gives fish a clear target in lanes that snag other lures",
  ],
  shallow_minnowbait: [
    "a shallow twitchbait stays high and wounded where pike can track it over weeds",
    "its flash-and-pause action looks like baitfish trying to escape shallow cover",
    "the shallow running depth keeps it above trouble while still triggering followers",
  ],
  pike_glidebait: [
    "a large glide bait gives pike a broad, slow meal that is easy to follow",
    "its sweeping movement can pull predators from weed edges and open pockets",
    "the pause and turn give following pike a clean angle to eat",
  ],
  pike_jerkbait: [
    "a pike jerkbait throws hard flash and then stalls like a wounded baitfish",
    "it is built for followers that need a pause before they commit",
    "the larger profile and sharp side-kick fit pike that are hunting over weeds and breaks",
  ],
  large_bucktail_spinner: [
    "a large bucktail spinner gives pike constant flash, pulse, and a target they can track",
    "it covers big water efficiently while keeping a simple, proven predator profile",
    "the blade calls fish in and the bucktail gives them a full silhouette to hit",
  ],
  large_pike_topwater: [
    "a large walking bait gives pike a noisy surface target they can track from below",
    "it shines when predators are willing to rise for a full-sized meal",
    "the big surface cadence creates a clear strike point without diving into weeds",
  ],
  pike_jig_and_plastic: [
    "a heavy jig and plastic puts a large baitfish profile down where pike hold",
    "it can be swum or hopped through deeper lanes while keeping a single-hook setup",
    "the jig gives control and the plastic adds the size pike expect from an easy meal",
  ],
  large_pike_tube: [
    "a large tube jig glides, pulses, and falls like a wounded baitfish pike can overtake",
    "its bulky body gives predators a visible target without needing much speed",
    "the slow spiral and tentacle movement make it strong around breaks, weeds, and pockets",
  ],
  clouser_minnow: [
    "a Clouser rides hook-up and gives fish a jigging baitfish look",
    "its weighted eyes help it cut through current and reach feeding depth quickly",
    "the sparse bucktail keeps the minnow profile clean enough for clear or pressured water",
  ],
  deceiver: [
    "a Deceiver has a long baitfish profile with movement that does not look bulky",
    "it swims with a clean silhouette that predators recognize without needing heavy weight",
    "the feather tail breathes on the pause and keeps following fish interested",
  ],
  bucktail_baitfish_streamer: [
    "a bucktail baitfish streamer gives a durable, readable minnow shape with natural taper",
    "it holds its profile in current and still looks alive on short strips",
    "the bucktail pulses without collapsing, which helps fish track the fly",
  ],
  slim_minnow_streamer: [
    "a slim minnow streamer matches small baitfish without adding unnecessary bulk",
    "it is a clean choice when fish are feeding by sight and inspecting the fly",
    "the narrow profile darts naturally and looks easy for trout or bass to overtake",
  ],
  articulated_baitfish_streamer: [
    "an articulated baitfish adds jointed movement that makes a larger fly look alive",
    "it gives predators a bigger meal with a swimming hinge instead of a stiff profile",
    "the articulated body keeps moving between strips, which helps convert followers",
  ],
  articulated_dungeon_streamer: [
    "a Dungeon streamer pushes water and suggests a big sculpin, leech, or baitfish",
    "it is built to move better fish that want a full meal, not a snack",
    "the articulated bulk and head movement make it easy for predators to locate",
  ],
  game_changer: [
    "a Game Changer swims with a segmented baitfish action that looks alive on every strip",
    "it gives clear-water predators a convincing profile with more body movement than flash",
    "the jointed body tracks like a real minnow and keeps followers engaged",
  ],
  jighead_marabou_leech: [
    "a jigged marabou leech rides deep and breathes even when barely moving",
    "it gives fish a compact leech profile that drops quickly into the feeding lane",
    "the jig hook keeps it near bottom while marabou adds life on the pause",
  ],
  lead_eye_leech: [
    "a lead-eye leech sinks with purpose and keeps a soft profile near bottom",
    "it is a simple, strong choice when fish want a dark, easy meal",
    "the weighted eyes help the fly jig and stall where trout, bass, or smallmouth can eat it",
  ],
  woolly_bugger: [
    "a Woolly Bugger covers leech, baitfish, and bug duty in one forgiving profile",
    "it has enough movement to look alive without needing perfect retrieves",
    "the marabou tail and hackle keep working on strips, swings, and slow crawls",
  ],
  rabbit_strip_leech: [
    "a rabbit-strip leech undulates naturally and looks alive even at slow speed",
    "it gives fish a bigger soft-bodied meal without a hard, mechanical action",
    "the rabbit strip breathes on the pause, which is useful when fish follow closely",
  ],
  balanced_leech: [
    "a balanced leech hangs level under an indicator or slow retrieve",
    "it keeps the fly in front of fish with a natural, suspended posture",
    "the horizontal hang makes it look like an easy leech meal instead of a dropping jig",
  ],
  zonker_streamer: [
    "a Zonker streamer uses rabbit-strip movement to suggest a wounded baitfish",
    "it keeps a strong silhouette while still swimming with soft, natural motion",
    "the strip pulses on every pause and gives predators a clear target",
  ],
  sculpin_streamer: [
    "a sculpin streamer matches bottom-hugging forage that trout and smallmouth expect",
    "it stays compact and low, which fits fish hunting near rocks and current breaks",
    "the broad head and short profile look like prey trying to pin itself to bottom",
  ],
  sculpzilla: [
    "a Sculpzilla gets down quickly and moves like a fleeing sculpin or baitfish",
    "it combines weight, flash, and a soft tail for fish holding near bottom",
    "the conehead and trailing hook make it a strong choice when bigger fish are hunting low",
  ],
  muddler_sculpin: [
    "a Muddler Sculpin pushes water with a natural baitfish or sculpin shape",
    "it works well when fish want a bulkier meal that still looks natural",
    "the spun head creates presence while the body keeps the profile believable",
  ],
  crawfish_streamer: [
    "a crawfish streamer shows fish a defensive bottom meal they already know",
    "it is strongest around rock, banks, and current breaks where craws get exposed",
    "the claws and low profile give bass or trout a clear target near bottom",
  ],
  warmwater_crawfish_fly: [
    "a crawfish fly gives bass a familiar bottom meal with movement and shape",
    "it works through warmwater cover where fish expect craws to kick and settle",
    "the compact craw profile invites short, confident eats near rocks, docks, and grass",
  ],
  warmwater_worm_fly: [
    "a worm fly gives warmwater fish a slow, easy meal when they are not chasing",
    "it sinks and wiggles without looking unnatural or oversized",
    "the simple profile is easy for bass and panfish to pin down in tight water",
  ],
  conehead_streamer: [
    "a conehead streamer gets down and keeps a strong baitfish pulse on the strip",
    "the cone adds depth and push while the tail gives fish movement to follow",
    "it is a practical choice when the fly needs to swim with authority below the surface",
  ],
  pike_bunny_streamer: [
    "a Bunny Streamer gives pike a large, breathing baitfish shape that moves at slow speed",
    "the rabbit strip creates a big target without needing a frantic retrieve",
    "its long, soft profile keeps working during pauses when pike often close",
  ],
  large_articulated_pike_streamer: [
    "a big articulated streamer gives pike a jointed, full-sized meal to track",
    "it moves water and keeps swimming between strips, which helps convert follows",
    "the larger profile fits predators looking for one worthwhile bite",
  ],
  unweighted_baitfish_streamer: [
    "an unweighted baitfish rides high and moves naturally over weeds or shallow cover",
    "it gives predators a suspending minnow look without dropping into trouble",
    "the lighter build lets the fly hover and turn like vulnerable bait",
  ],
  baitfish_slider_fly: [
    "a baitfish slider pushes a subtle surface wake without being too loud",
    "it gives fish a high-riding minnow profile they can track from below",
    "the sliding action is a good fit when fish will rise but want a cleaner target",
  ],
  bluegill_streamer: [
    "a bluegill streamer gives bass a broad panfish profile around shallow cover",
    "it matches the shape of a meal largemouth often expect near grass, docks, and beds",
    "the taller silhouette helps fish see it as a full meal rather than a small minnow",
  ],
  popper_fly: [
    "a bass popper creates a focused surface pop that stays near the strike zone",
    "it gives fish a struggling surface meal they can find, pause on, and eat",
    "the cupped face makes enough noise to call fish without racing away",
  ],
  deer_hair_slider: [
    "a deer-hair slider wakes and slips across the surface with a softer footprint than a popper",
    "it is ideal when fish will look up but shy from too much splash",
    "the deer hair floats naturally and suggests a baitfish, bug, or small surface prey",
  ],
  foam_gurgler_fly: [
    "a foam gurgler leaves a small wake and bubble trail fish can track",
    "it gives surface-feeding fish commotion without the bulk of a large popper",
    "the foam body stays high and lets you fish slow over likely water",
  ],
  frog_fly: [
    "a frog popper fits shallow cover where bass expect an overhead meal",
    "it gives fish a surface target that belongs around mats, pads, grass, and shade",
    "the frog shape makes sense in places where minnows are not the only surface food",
  ],
  feather_jig_leech: [
    "a marabou jig leech sinks cleanly and breathes with tiny movements",
    "it gives trout or smallmouth a compact leech meal near bottom or current edges",
    "the jigging profile keeps it controlled while the feathers add life",
  ],
  pike_flash_fly: [
    "a Flash Fly gives pike a bright baitfish signal they can see from distance",
    "it is built to be noticed, especially when visibility or chop makes subtle flies disappear",
    "the flash and length create a clear predator target without needing heavy weight",
  ],
  mouse_fly: [
    "a mouse pattern gives fish a slow, vulnerable surface meal with a strong silhouette",
    "it is a big-bite surface option when predators are willing to hunt overhead",
    "the waking profile makes it easy for fish to track across shade, banks, and soft current",
  ],
} as const satisfies Record<ArchetypeIdV4, WhyLineSet>;

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickIndex(length: number, key: string): number {
  return hashSeed(key) % length;
}

function scoreReasonValue(reason: string, prefix: string): string | null {
  if (!reason.startsWith(prefix)) return null;
  const rest = reason.slice(prefix.length);
  const marker = rest.lastIndexOf(":");
  return marker === -1 ? rest : rest.slice(0, marker);
}

function scoredConditionTags(score: CandidateScore): ConditionTag[] {
  const tags: ConditionTag[] = [];
  for (const reason of score.reasons) {
    const rawTag = scoreReasonValue(reason, "condition_tag:");
    if (rawTag == null) continue;
    tags.push(rawTag as ConditionTag);
  }
  return tags;
}

function firstMatchedConditionTag(
  score: CandidateScore,
  scenario: DailyScenario,
): ConditionTag | null {
  for (const tag of scoredConditionTags(score)) {
    if (scenario.scenario_tags.includes(tag)) return tag;
  }
  return null;
}

function windReactionLine(args: {
  scenario: DailyScenario;
  key: string;
}): string {
  const strongWindLines = [
    "Today's stronger wind gives moving baits enough cover to look natural",
    "Today's chop can push bait and help fish commit to a moving target",
    "With more wind today, flash and movement are easier for fish to track",
  ] as const;
  const breezeLines = CONTEXT_LINES_BY_TAG.wind_reaction;
  const fallbackLines = [
    "Today's moving-bait window favors something fish can track cleanly",
    "Today's setup gives reaction presentations a little extra room to work",
    "Today favors a presentation that can show itself without asking fish to study it",
  ] as const;

  const lines = args.scenario.wind_mode === "windy"
    ? strongWindLines
    : args.scenario.wind_mode === "breezy"
    ? breezeLines
    : fallbackLines;
  return lines[pickIndex(lines.length, `${args.key}|wind_reaction`)]!;
}

function contextLine(args: {
  score: CandidateScore;
  scenario: DailyScenario;
  key: string;
}): string {
  const tag = firstMatchedConditionTag(args.score, args.scenario);
  if (tag != null) {
    if (tag === "wind_reaction") {
      return windReactionLine({
        scenario: args.scenario,
        key: args.key,
      });
    }
    const lines = CONTEXT_LINES_BY_TAG[tag];
    return lines[pickIndex(lines.length, `${args.key}|tag|${tag}`)]!;
  }

  const lines = CONTEXT_LINES_BY_CLARITY[args.scenario.water_clarity];
  const clarityLine = lines[
    pickIndex(
      lines.length,
      `${args.key}|clarity|${args.scenario.water_clarity}`,
    )
  ]!;
  if (clarityLine != null) return clarityLine;

  return "Today's setup favors a dependable profile";
}

function shouldAllowStrongWindLanguage(args: {
  score: CandidateScore;
  scenario: DailyScenario;
}): boolean {
  return args.scenario.wind_mode === "windy" &&
    args.scenario.scenario_tags.includes("wind_reaction") &&
    scoredConditionTags(args.score).includes("wind_reaction");
}

function containsWindLanguage(line: string): boolean {
  return /\b(wind|windy|breeze|breezy|chop|choppy|ripple)\b/i.test(line);
}

function filteredWhyLines(args: {
  score: CandidateScore;
  scenario: DailyScenario;
}): WhyLineSet | readonly string[] {
  const lines = WHY_LINES_BY_ID[args.score.profile.id];
  if (shouldAllowStrongWindLanguage(args)) return lines;

  const conservativeLines = lines.filter((line) => !containsWindLanguage(line));
  return conservativeLines.length > 0 ? conservativeLines : lines;
}

export function whyThisCopy(args: {
  score: CandidateScore;
  scenario: DailyScenario;
  slot: string;
  seed: string;
  variant: DailyPicksVariant;
}): string {
  const profileId = args.score.profile.id;
  const key = [
    args.seed,
    args.scenario.local_date,
    args.slot,
    args.variant,
    profileId,
  ].join("|");
  const context = contextLine({
    score: args.score,
    scenario: args.scenario,
    key,
  });
  const whyLines = filteredWhyLines({
    score: args.score,
    scenario: args.scenario,
  });
  const whyLine = whyLines[pickIndex(whyLines.length, `${key}|why`)]!;

  return `${context}, and ${whyLine}.`;
}
