/**
 * Shared wording + per-archetype anatomy copy for recommender tackle illustrations.
 * Matches FinFindr “paper” UI: warm paper, ink-like edges, premium field-note vibe —
 * not clip art, not lab-plate scientific detail overload.
 *
 * Used by `scripts/generate-recommender-tackle-images.ts`.
 */

/** Solid plate behind the subject for `gpt-image-2` (no native transparency). Post-process to alpha. */
export const CHROMA_KEY_HEX = "#F0E8D4";

/**
 * GPT Image 2: use opaque generation on CHROMA_KEY_HEX, then strip background externally.
 */
export const SHARED_STYLE_BLOCK = `Visual tone — FinFindr paper UI: calm, premium, outdoorsy. Think a modern tackle journal illustration: clear readable silhouette first, then gentle material truth. Soft warm light, muted natural colors, subtle ink-hair edges (deep muted green-brown, not harsh black outlines). Light paper-grain suggestion is OK if extremely subtle; no posterized vector look, no glossy 3D render, no sticker/clip-art simplicity, no hyper-detailed scientific plate with labels, cross-sections, or micro-texture noise.

Accuracy beats decoration: proportions, hook count/placement, wire arms, blades, lips, skirts, and fly-tying elements must match what anglers actually fish. One isolated specimen only.`;

export const COMPOSITION_BLOCK = `Layout: single object, side profile or slight three-quarter only if needed for hardware truth. Centered. Subject’s longest span fills roughly 78–85% of the square frame with even breathing room; do not crop hook bends, tail fibers, blades, bills, or legs. No drop shadow on the backdrop, no cast shadow on the background color.`;

export const NEGATIVE_BLOCK = `No text, numerals, logos, watermarks, scale bars, UI, water, sky, hands, rods, boxes, or extra tackle. Do not add stray hooks, duplicate blades, duplicate eyes, floating split rings, or invented hardware.`;

export const BACKGROUND_BLOCK = `The entire background must be a single flat solid color exactly ${CHROMA_KEY_HEX} (light warm paper) with zero gradient, vignette, texture spots, or props. The lure/fly may be grounded with realistic contact shading on itself only.`;

export type TackleKind = "lure" | "fly";

export type TacklePromptEntry = {
  key: string;
  kind: TackleKind;
  displayName: string;
  /** Anatomy-first description; merged into final prompt. */
  anatomy: string;
};

export const TACKLE_PROMPTS: readonly TacklePromptEntry[] = [
  // ── Lures (37) ─────────────────────────────────────────────────────────────
  {
    key: "weightless_stick_worm",
    kind: "lure",
    displayName: "Weightless Stick Worm",
    anatomy:
      "Unrigged soft-plastic stick worm only (no hook, no weight, no line tie). Straight tapered cylinder with slightly blunt nose and thin tail; matte soft-plastic. Side profile.",
  },
  {
    key: "carolina_rigged_stick_worm",
    kind: "lure",
    displayName: "Carolina-Rigged Stick Worm",
    anatomy:
      "Carolina rig in fishing order: main line to bullet/egg sinker, then bead, then swivel; leader to offset wide-gap hook with stick worm threaded Texas-style (point buried). Show subtle rig components scaled clearly; single hook only.",
  },
  {
    key: "shaky_head_worm",
    kind: "lure",
    displayName: "Shaky-Head Worm",
    anatomy:
      "Stand-up shaky head jig (semi-standoff head, single hook) with finesse straight-tail or ribbon worm nose-hooked or threaded; skirt fibers only if minimal. Single hook, no trailer hook.",
  },
  {
    key: "drop_shot_worm",
    kind: "lure",
    displayName: "Drop-Shot Worm",
    anatomy:
      "Drop-shot: teardrop or cylinder weight at bottom of rig, thin wire or fluorocarbon stem up to single drop-shot hook (nose-pinned or micro knot), small worm or roboworm shape above weight. One hook only; no extra hooks.",
  },
  {
    key: "drop_shot_minnow",
    kind: "lure",
    displayName: "Drop-Shot Minnow",
    anatomy:
      "Same drop-shot geometry as drop-shot worm but with small soft minnow or shad-profile plastic on a single drop-shot hook; subtle split tail or paddle — one tail only.",
  },
  {
    key: "ned_rig",
    kind: "lure",
    displayName: "Ned Rig",
    anatomy:
      "Mushroom or Ned jig head (light wire hook) with short buoyant stick bait or TRD-style straight worm; compact profile, upright posture implied. Single hook; no skirt blades.",
  },
  {
    key: "tube_jig",
    kind: "lure",
    displayName: "Tube Jig",
    anatomy:
      "Hollow tube bait on internal jig head, tentacle skirt flair at back; jig eye and line tie at nose. Single exposed jig hook exiting tube — typical tube jig, not a crankbait.",
  },
  {
    key: "texas_rigged_soft_plastic_craw",
    kind: "lure",
    displayName: "Texas-Rigged Soft-Plastic Craw",
    anatomy:
      "Bullet or flipping weight above peg (optional) to offset hook buried Tex-pose in craw creature; claws/pincers distinct. Single hook; no trebles.",
  },
  {
    key: "football_jig",
    kind: "lure",
    displayName: "Football Jig",
    anatomy:
      "Football-shaped jig head, stout hook, silicone or living-rubber skirt, optional short craw or chunk trailer; dragging head shape obvious. Single hook.",
  },
  {
    key: "compact_flipping_jig",
    kind: "lure",
    displayName: "Compact Flipping Jig",
    anatomy:
      "Short compact jig with brush guard or fiber weed guard, heavy hook, thick skirt, craw or chunk trailer optional; bulkier than finesse jig. One hook.",
  },
  {
    key: "finesse_jig",
    kind: "lure",
    displayName: "Finesse Jig",
    anatomy:
      "Smaller jig head, sparse skirt, light wire or medium wire finesse hook, small trailer (craw chunk or twin tail). One hook.",
  },
  {
    key: "swim_jig",
    kind: "lure",
    displayName: "Swim Jig",
    anatomy:
      "Keel or bullet swim head with inline line tie, streaming skirt, single jig hook, often paired with paddle swimbait trailer; no spinner arm.",
  },
  {
    key: "hair_jig",
    kind: "lure",
    displayName: "Hair Jig",
    anatomy:
      "Marabou or bucktail hair collar tied to jig head with thread, single hook; hairs sweep backward. No blades unless a tiny accent — prefer classic hair jig only.",
  },
  {
    key: "inline_spinner",
    kind: "lure",
    displayName: "Inline Spinner",
    anatomy:
      "Straight-through shaft: line tie, body (weighted tube or bead chain), clevis or free-spinning blade ahead of single hook (often dressed); blade count as one primary spinner blade on shaft — no spinnerbait V-wire.",
  },
  {
    key: "spinnerbait",
    kind: "lure",
    displayName: "Spinnerbait",
    anatomy:
      "Classic V-bent wire: line tie at apex; lower arm weighted jig-style head with single hook and rubber/skirt; upper arm one or two blades on swivel hardware. Never a treble on the wire arm.",
  },
  {
    key: "bladed_jig",
    kind: "lure",
    displayName: "Bladed Jig",
    anatomy:
      "Chatter-style: weighted jig head, silicone skirt, single hook, flat chisel/vibrating blade directly in front of head on same line axis (not a spinnerbait wire arm).",
  },
  {
    key: "paddle_tail_swimbait",
    kind: "lure",
    displayName: "Paddle-Tail Swimbait",
    anatomy:
      "Unrigged soft hollow or solid swimbait with one paddle tail, baitfish profile, belly slot implied but no harness; no trebles, no jig head unless molded micro harness — prefer separate swimbait body only.",
  },
  {
    key: "soft_jerkbait",
    kind: "lure",
    displayName: "Soft Plastic Jerkbait",
    anatomy:
      "Soft stick minnow / fluke-style with split belly or boot tail variants OK; unrigged: no hooks. Single tail, slender jerkbait silhouette.",
  },
  {
    key: "suspending_jerkbait",
    kind: "lure",
    displayName: "Suspending Jerkbait",
    anatomy:
      "Hard minnow jerkbait, pronounced diving lip, two or three treble hooks belly and tail typical, line tie forward. No paddle tail, no jig skirt.",
  },
  {
    key: "squarebill_crankbait",
    kind: "lure",
    displayName: "Squarebill Crankbait",
    anatomy:
      "Stubby crank body with squared diving lip, line tie at bill, trebles; wobble crank silhouette.",
  },
  {
    key: "flat_sided_crankbait",
    kind: "lure",
    displayName: "Flat-Sided Crankbait",
    anatomy:
      "Tall flat flanks with narrow bill compared to round baits; subtle action implied in form; trebles.",
  },
  {
    key: "medium_diving_crankbait",
    kind: "lure",
    displayName: "Medium-Diving Crankbait",
    anatomy:
      "Medium-depth crank with mid-length bill, rounded minnow/craw shape; two trebles.",
  },
  {
    key: "deep_diving_crankbait",
    kind: "lure",
    displayName: "Deep-Diving Crankbait",
    anatomy:
      "Long bill relative to body, slender cranking body, two trebles; deep diver proportions.",
  },
  {
    key: "lipless_crankbait",
    kind: "lure",
    displayName: "Lipless Crankbait",
    anatomy:
      "No diving lip; line tie on nose or top; rattling lipless body; belly and tail trebles common.",
  },
  {
    key: "blade_bait",
    kind: "lure",
    displayName: "Blade Bait",
    anatomy:
      "Metal blade-shaped body with front line tie, rear hook hanger, often twin treble or single treble setups — show typical winter blade bait; no crank lip.",
  },
  {
    key: "casting_spoon",
    kind: "lure",
    displayName: "Casting Spoon",
    anatomy:
      "Curved casting spoon, split ring or solid tie, single treble or single hook at narrow end; no lip, no skirt.",
  },
  {
    key: "small_floating_trout_plug",
    kind: "lure",
    displayName: "Small Floating Trout Plug",
    anatomy:
      "Small slim floating minnow plug for trout: tiny lip or wake lip, single hooks (treble or singles per classic trout plug style) — keep tidy and small-bodied; no offshore trolling plug scale.",
  },
  {
    key: "walking_topwater",
    kind: "lure",
    displayName: "Walking Topwater",
    anatomy:
      "Zara-style cigar walker: no deep cup, tail-heavy walkers show belly hooks; trebles belly/tail.",
  },
  {
    key: "popping_topwater",
    kind: "lure",
    displayName: "Topwater Popper",
    anatomy:
      "Cupped face popper, short baitfish profile, open-gape mouth cup, rear treble typical.",
  },
  {
    key: "buzzbait",
    kind: "lure",
    displayName: "Buzzbait",
    anatomy:
      "Inline buzz: wire arm, line tie, squeak blade spinning on front, molded lead/shaft skirt with single upturned hook (buzzbait hook); no Colorado spinnerbait blades.",
  },
  {
    key: "prop_bait",
    kind: "lure",
    displayName: "Prop Bait",
    anatomy:
      "Dual or triple propellers on nose and tail, hard torpedo body, trebles mid-body; props on shafts, not buzz blade.",
  },
  {
    key: "hollow_body_frog",
    kind: "lure",
    displayName: "Hollow-Body Frog",
    anatomy:
      "Hollow collapsible frog with twin upturned hooks tucked along back, legs trailing; weedless double hook frame.",
  },
  {
    key: "large_profile_pike_swimbait",
    kind: "lure",
    displayName: "Large Paddle-Tail Swimbait",
    anatomy:
      "Oversize musky/pike molded swimbait body with visible hook harness or jig hook, big paddle tail; show as rigged big bait typical for esox.",
  },
  {
    key: "pike_jerkbait",
    kind: "lure",
    displayName: "Large Jerkbait",
    anatomy:
      "Long glider/jerk minnow for pike; larger hooks, often 3 trebles, subtle lip or lipless jerk style — not tiny trout size.",
  },
  {
    key: "large_bucktail_spinner",
    kind: "lure",
    displayName: "Large Bucktail Spinner",
    anatomy:
      "Inline or safety-pin style big spinner for musky/pike: heavy blade(s), massive bucktail skirt, single dressed hook — avoid confusing with bass spinnerbait scale.",
  },
  {
    key: "large_pike_topwater",
    kind: "lure",
    displayName: "Large Pike Topwater",
    anatomy:
      "Big chugger, large wake bait, or tail-prop topwater scaled for pike/musky; hardware looks heavy-duty.",
  },
  {
    key: "pike_jig_and_plastic",
    kind: "lure",
    displayName: "Paddle Tail Pike Jig",
    anatomy:
      "Heavy jig head with large single hook and long paddle-tail trailer; esox proportions, not bass ned.",
  },
  // ── Flies (31) ────────────────────────────────────────────────────────────
  {
    key: "clouser_minnow",
    kind: "fly",
    displayName: "Clouser Minnow",
    anatomy:
      "Classic Clouser on single streamer hook: dumbbell eyes on top of shank near eye, bucktail/synthetic wing forming baitfish taper, thread head. No treble, no spinning hardware.",
  },
  {
    key: "deceiver",
    kind: "fly",
    displayName: "Deceiver",
    anatomy:
      "Single hook, stacked bucktail/saddle feathers, tapered baitfish silhouette, minimal flash if any; tied-fly construction obvious.",
  },
  {
    key: "bucktail_baitfish_streamer",
    kind: "fly",
    displayName: "Bucktail Streamer",
    anatomy:
      "Sparse to medium bucktail streamer, single hook, wide-profile minnow wing; cone or thread head OK, no dumbbell unless subtle.",
  },
  {
    key: "slim_minnow_streamer",
    kind: "fly",
    displayName: "Slim Baitfish Streamer",
    anatomy:
      "Narrow stacked fibers, long baitfish profile, single hook; lightweight tying.",
  },
  {
    key: "articulated_baitfish_streamer",
    kind: "fly",
    displayName: "Articulated Baitfish Streamer",
    anatomy:
      "Two shanks jointed, free-swinging tail section, baitfish colors; two hooks in tandem per articulated pattern — not two separate flies.",
  },
  {
    key: "articulated_dungeon_streamer",
    kind: "fly",
    displayName: "Articulated Dungeon Streamer",
    anatomy:
      "Heavy articulated head fibers, big dumbbell or stacked deer hair, long marabou/synthetic tail; dungeon bulk forward, flowing rear. Jointed construction visible.",
  },
  {
    key: "game_changer",
    kind: "fly",
    displayName: "Game Changer",
    anatomy:
      "Blane Changer–style jointed fish: multiple short shanks creating articulated swim spine; sculpted fish silhouette. Multiple segment hooks only as one unified fly.",
  },
  {
    key: "woolly_bugger",
    kind: "fly",
    displayName: "Woolly Bugger",
    anatomy:
      "Single hook, chenille/dubbed body, palmered hackle, marabou tail, optional bead at head; leech/bugger proportions.",
  },
  {
    key: "rabbit_strip_leech",
    kind: "fly",
    displayName: "Rabbit-Strip Leech",
    anatomy:
      "Crosscut or straight rabbit strip wrapping leech body, jelly-like motion implied, cone or bead optional, single hook.",
  },
  {
    key: "jighead_marabou_leech",
    kind: "fly",
    displayName: "Jighead Marabou Leech",
    anatomy:
      "Weighted jig hook with stacked marabou and flash; lead or painted head obvious; single hook only.",
  },
  {
    key: "lead_eye_leech",
    kind: "fly",
    displayName: "Lead-Eye Leech",
    anatomy:
      "Hourglass or barbell lead eyes tied mid-shank, sparse marabou/synthetic leech tail; jig hook; not a Clouser minnow wing shape — more leech.",
  },
  {
    key: "feather_jig_leech",
    kind: "fly",
    displayName: "Feather Jig Leech",
    anatomy:
      "Feathered wing over marabou or flash, weighted head, single hook; looks tied, not plastic bait.",
  },
  {
    key: "balanced_leech",
    kind: "fly",
    displayName: "Balanced Leech",
    anatomy:
      "Pin or dumbbell balance pivot tied so fly rides horizontal under tension; leech body fibers; single hook.",
  },
  {
    key: "zonker_streamer",
    kind: "fly",
    displayName: "Zonker Streamer",
    anatomy:
      "Hide strip zonker wing along shank, sculpin/minnow profile, single hook, often weighted head or cones.",
  },
  {
    key: "sculpin_streamer",
    kind: "fly",
    displayName: "Sculpin Streamer",
    anatomy:
      "Wide pectoral wing or deer hair head, sculpin mottling, jig hook or streamer hook, bottom-hugging silhouette.",
  },
  {
    key: "sculpzilla",
    kind: "fly",
    displayName: "Sculpzilla",
    anatomy:
      "Collapsible deer hair or spun head with stacked body, prominent wool/flash tail; articulated or long shank typical — show recognizable sculpin streamer mass.",
  },
  {
    key: "muddler_sculpin",
    kind: "fly",
    displayName: "Muddler Minnow",
    anatomy:
      "Spun deer-hair muddler head with collar hackle, slim tail; single hook; no metal lip.",
  },
  {
    key: "crawfish_streamer",
    kind: "fly",
    displayName: "Crawfish Streamer",
    anatomy:
      "Claws from furry foam, rubber legs, dubbing body, lead or bead eyes; craw profile with single hook.",
  },
  {
    key: "warmwater_crawfish_fly",
    kind: "fly",
    displayName: "Warmwater Crawfish Fly",
    anatomy:
      "Bass-bug style craw: wide silhouette, dumbbell eyes, silicone or sili legs, maybe deer hair or foam carapace; single hook; reads as bass-craw fly not crankbait.",
  },
  {
    key: "warmwater_worm_fly",
    kind: "fly",
    displayName: "Worm Fly",
    anatomy:
      "San Juan worm style or chenille worm with bead or unweighted; thin worm body, single hook; not soft plastic worm.",
  },
  {
    key: "conehead_streamer",
    kind: "fly",
    displayName: "Conehead Streamer",
    anatomy:
      "Metal cone on front, sparse to medium wing, baitfish taper, single hook.",
  },
  {
    key: "pike_bunny_streamer",
    kind: "fly",
    displayName: "Large Rabbit Strip Streamer",
    anatomy:
      "Long zonker strip for esox, big hook, heavy eyes or head; bulky but streamlined for pike/musky.",
  },
  {
    key: "large_articulated_pike_streamer",
    kind: "fly",
    displayName: "Articulated Pike Streamer",
    anatomy:
      "Long multi-section pike fly: big head fibers, long trailing tail, two+ hook sections articulated; one fly.",
  },
  {
    key: "unweighted_baitfish_streamer",
    kind: "fly",
    displayName: "Unweighted Baitfish Streamer",
    anatomy:
      "Light bucktail/synthetic minnow with no heavy cone; neutral sink look; single hook.",
  },
  {
    key: "baitfish_slider_fly",
    kind: "fly",
    displayName: "Baitfish Slider Fly",
    anatomy:
      "Slider or slide-style deer hair / stacked head that pushes water; baitfish profile, single hook.",
  },
  {
    key: "popper_fly",
    kind: "fly",
    displayName: "Popper Fly",
    anatomy:
      "Foam or spun hair popper head with cup face, short collar, tail fibers; single surface hook.",
  },
  {
    key: "deer_hair_slider",
    kind: "fly",
    displayName: "Deer Hair Slider",
    anatomy:
      "Spun deer hair head with sliding/walking hair collar aesthetics, single hook; not a hard-bait walker.",
  },
  {
    key: "foam_gurgler_fly",
    kind: "fly",
    displayName: "Foam Gurgler",
    anatomy:
      "Stacked foam gurgler head ramp, short body stack, tail fibers; cupped foam lip feel; single hook.",
  },
  {
    key: "frog_fly",
    kind: "fly",
    displayName: "Frog Fly",
    anatomy:
      "Deer hair or foam frog silhouette with splayed legs, weed guard or upturned hook; artificial fly, not hyper-real green frog photo.",
  },
  {
    key: "mouse_fly",
    kind: "fly",
    displayName: "Mouse Fly",
    anatomy:
      "Deer hair or foam mouse with naked tail strip, single big gap hook; reads as night mouse pattern — avoid photoreal fur face; tied fly.",
  },
  {
    key: "pike_flash_fly",
    kind: "fly",
    displayName: "Pike Flash Fly",
    anatomy:
      "Flash-forward esox baitfish: long flash blend wing, short heavy head, big single or tandem hook esox style; flashy but still a dressed fly.",
  },
] as const;

const byKey = new Map(TACKLE_PROMPTS.map((e) => [e.key, e] as const));

export function getTacklePromptEntry(key: string): TacklePromptEntry | undefined {
  return byKey.get(key);
}

export function tacklePromptKeys(): string[] {
  return TACKLE_PROMPTS.map((e) => e.key);
}
