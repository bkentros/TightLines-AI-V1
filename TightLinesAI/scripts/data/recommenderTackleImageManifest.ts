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

export const COMPOSITION_BLOCK = `Layout: single object, side profile or slight three-quarter only if needed for hardware truth. Centered.

**Catalog scale (critical — keep uniform in the recommender grid):** Measure the subject as one unit (whole lure, whole fly, or whole rig from the first piece to the last: e.g. weight → worm tail, or eye to tail fibers). The tight axis-aligned bounding box around *all* of that hardware must occupy **about 80–84%** of the frame on its long dimension, with balanced margins — same apparent size as a tackle-shop product grid, every id. Tiny flies must enlarge to stay readable (still within 80–84%); long pike/musky rigs stay within that band so nothing touches the edges. Do not crop hook bends, tail fibers, blades, bills, or legs.

No drop shadow on the backdrop, no cast shadow on the background color.`;

export const NEGATIVE_BLOCK = `No text, numerals, logos, watermarks, scale bars, UI, water, sky, hands, rods, boxes, or extra tackle. Do not add stray hooks, duplicate blades, duplicate eyes, floating split rings, or invented hardware.`;

/**
 * Drop-shot: single factual topology block. Placed immediately after the title in generate-recommender-tackle-images.ts
 * so the model locks onto real tackle before style tokens.
 *
 * True drop-shot: the sinker is tied to a tag or separate leader that shares the hook knot (e.g. Palomar with long tag,
 * or dropper tied at eye). The sinker hangs below the hook; the bait is nose-hooked above the sinker.
 */
export const DROP_SHOT_RIG_TOPOLOGY = `SUBJECT: Drop-shot finesse rig (real bass tackle). Side-profile catalog photo.

Topology (do not change — prevents wrong rigs): The metal hook EYE is a three-way junction. (A) Main fishing line from above is knotted ONLY to the eye. (B) A second separate line (dropper / tag) is also knotted ONLY to that same eye and runs down to a small teardrop or pencil sinker at the bottom — NOT one long vertical line with the hook threaded on the middle like a shish-kebab; the sinker branch must meet at the eye. (C) The hook shank leaves the eye toward the bait; gap opens sideways relative to the vertical lines.

Dropper: longer than the bait (about 1.5× soft plastic length or more). Sinker: small, lighter-looking than the bait.

Hook size (worm and minnow): TINY finesse drop-shot hook — size #1–#2 class look: short shank, light wire, NARROW gap (gap barely wider than the bait’s head). FORBIDDEN: wide-gap offset flipping hook, big bass worm hook, giant hook overwhelming the plastic.

Bait placement on hook (critical): Only the nose touches metal. The head sits in the LOWEST part of the hook bend (bottom of the J), not slid up the straight shank toward the eye. The hook POINT, BARB, and bend must stay clearly visible in the picture — a proper nose-hook with metal showing; do not bury the barb deep inside the body or hide the point.

Bait size: modest finesse proportions — slightly compact plastic in the frame (worm: ~4-inch class curly worm, not huge; minnow: small shad). Tail and body hang free below the bend.

Wrong rigs: Texas bullet above hook; Carolina swivel; jighead in bait; hook through mid-body; trebles; one continuous line through hook to sinker without a branch at the eye.`;

/**
 * Appended only for drop_shot_worm — minnow prompt stays unchanged (user accepted minnow).
 */
export const DROP_SHOT_WORM_ONLY_BLOCK = `WORM IMAGE ONLY (minnow generation does not use this paragraph):

Hook must be MICRO: fine-wire mosquito / dropshot hook (size #4–#2 class look), very short shank, narrow gap — gap only slightly wider than the worm head is thick. FORBIDDEN: wide-gap bass hook, long shank, or any hook that looks as tall as the worm head.

Worm head sits ONLY in the bottom of the hook bend (deepest part of the J). The straight shank between eye and bend must stay clear — mostly bare metal with no worm sliding up the stem toward the eye. FORBIDDEN: worm bunched at the eye, worm touching shank above the bend, head riding halfway up the stem. RIGHT: tiny nose hook seated in the bend only; long curly tail hangs free below.

Worm plastic: modest finesse size in frame, not elongated giant.`;

/**
 * Placed immediately after the title for soft_jerkbait (before style blocks) so the model locks camera like product photography.
 */
export const SOFT_FLUKE_SIDE_VIEW_BLOCK = `CAMERA / VIEW (mandatory — prevents wrong angle): **Pure lateral side profile** — the same angle as a tackle-pack product photo or silhouette diagram: camera level with the bait, looking horizontally, bait length running **left–right** across the frame. You see exactly **one broadside** of the body (dainty nose on one end, forked tail on the other). Back is the **upper** edge, belly is the **lower** edge in the picture. FORBIDDEN: top-down, dorsal, bird's-eye, plan view, “floating above the bait” angles, three-quarter from above, any view where the wide **flat back** of the fluke faces the camera, or where both tail lobes spread out symmetrically like wings toward the lens. No “looking down the length” of the bait. No perspective twist — treat as flat orthographic broadside (not angled three-quarter). Keep orthographic side-view truth — Zoom Salty Super Fluke on its side on the paper.`;

/**
 * Placed after the title for articulated_dungeon_streamer (Kelly Galloup Sex Dungeon class).
 * Matches common step-by-steps (e.g. Fly Life Media, Charlie's Fly Box tying demos).
 */
export const ARTICULATED_DUNGEON_ANCHOR_BLOCK = `PATTERN LOCK — **Kelly Galloup “Sex Dungeon”** articulated streamer (search photos / video SBS — **not** a hard lure). Checklist every time:

1) **Two single streamer hooks** (#2 front / #4 rear class look) joined by **one short loop of articulation wire** between shanks. **FORBIDDEN**: treble hooks; diving lip / bill; molded plastic baitfish.

2) **Rear = tail section**: long **olive + barred brown/black marabou** flowing back with a few strands of **gold or pearl Micro Flashabou** — tail is **soft feather**, not a hard paddle.

3) **Front = business end**: **Ice Dub or similar sparkly dub** body (olive-brown), brushed slightly buggy; **olive schlappen** wrapped as a collar; **barred rubber sili-legs** kicking out sideways; optional thin wire rib **subtle**, not the main visual.

4) **Head = spun deer hair** trimmed into a **forward wedge / sculpin face** — you must see **hair clipped to angles**, not a resin plug. **Large silver or black-barred dumbbell eyes** lashed **on top of the deer hair**.

If the head reads as epoxy minnow, metal jig cone, or crankbait — wrong pattern.`;

/**
 * Placed after the title for rabbit_strip_leech (Conehead Bunny Leech class).
 * Matches standard bunny-leech recipes (Orvis / Trident / Flylords conehead demos).
 */
export const CONEHEAD_BUNNY_LEECH_ANCHOR_BLOCK = `PATTERN LOCK — **Conehead Bunny Leech** (same fly anglers call a **rabbit-strip / zonker leech**). Checklist:

1) **One long streamer hook** + **brass or tungsten CONE** pressed to the **hook eye** (cone is **mandatory** for this id — not a bare bead head).

2) **One cross-cut rabbit zonker strip**: tie **free tail at the bend** ~**1–1.25× shank** long, then **palmer the strip forward** in tight spirals — **hide leather shows as a spiral ridge**, **fur combed rearward** so the fly is a **thick furry cylinder** (dense “carrot” leech), **almost nothing but rabbit fur** from cone to bend.

3) Optional **thin lead wire** under the cone only for weight — **not** a visible ribbed body.

**FORBIDDEN**: dominant **gold wire rib** as the main pattern; skinny San Juan worm; woolly bugger (palmered hackle + marabou tail) without **zonker hide** spiraling the shank; articulated two-hook dungeon; treble hooks.`;

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
  // ── Lures (39) ─────────────────────────────────────────────────────────────
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
      "Bait: slim finesse curly- or ribbon-tail worm; compact in frame; green pumpkin / olive with fine flake. Not a Senko. Apply shared drop-shot rig above plus WORM IMAGE ONLY paragraph.",
  },
  {
    key: "drop_shot_minnow",
    kind: "lure",
    displayName: "Drop-Shot Minnow",
    anatomy:
      "Bait: small slender soft minnow — compact in frame, fork tail, no jig head. Follow bend seating, exposed point/barb, tiny hook, and rig junction rules above.",
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
      "Texas rig in horizontal side profile (same left–right layout as other lure cards — not a vertical top-to-bottom stack). Main line through a modest bullet or flipping weight above the hook (weight slightly small, not a huge cone), line tied to eye of offset wide-gap hook. Weedless Texas craw: point buried under plastic; claws and appendages read clearly. Single hook; no swivel. Craw body runs along the frame like other horizontal baits.",
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
    key: "glidebait",
    kind: "lure",
    displayName: "Glide Bait",
    anatomy:
      "Hard multi-section glide swimbait (two or three jointed segments) for wide S-glide swim — rigid resin/billboard plastic look, realistic baitfish sculpt, visible hinge pins or seams between sections. Line tie at nose only (split ring at nose OK). Two or three treble hooks typical, mounted only on belly and/or tail segment — hooks sit flush in hangers molded into the body; no Texas bullet, no jig skirt, no soft-plastic paddle tail, no deep diving lip like a jerkbait. FORBIDDEN at the tail: extra dangling split rings, swivels, stinger clips, spare singles, trailing wire, or any tiny loose hook hardware past the last body segment — tail section ends clean except approved trebles.",
  },
  {
    key: "soft_jerkbait",
    kind: "lure",
    displayName: "Soft Plastic Jerkbait",
    anatomy:
      "Unrigged soft plastic — **Zoom Salty Super Fluke class** (salt-impregnated shad imitator anglers recognize by silhouette): ~5–5.25 inch proportions in the frame, slender tapering baitfish body, slightly **deep belly**, **molded belly hook slot** along the mid-ventral line (reads as a subtle slit / groove on the lower silhouette in side view). Tail narrows to a **deep fork** with two long, thin soft tail lobes tapering to points — classic erratic-dart fluke tail, **not** a single flat paddle, **not** curly or ribbon. Nose is narrow and softly pointed. Matte soft-plastic. Hardware: none (no hook, nail weight, or jig). The finished shape must be visually indistinguishable from that bait lying **flat on its side** for measurement — identical lateral outline to a Salty Super Fluke, not a hard jerkbait minnow and not a swimbait.",
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
      "Large **walk-the-dog** topwater in the **Heddon Zara Spook** lineage (same silhouette anglers associate with ‘the Spook’): elongated **symmetric cigar / torpedo** hard body, gently rounded nose — **no** deep **popper** cup or scooped splash mouth, **no** nose or tail **propeller**, **no** buzz blade, **not** a pencil popper. Line tie at the **nose**. Two **treble hooks** on split rings (belly + tail) typical; hardware can read a bit heavier for pike/musky but the **body style stays Spook**, not chugger/wake/prop bait.",
  },
  {
    key: "pike_jig_and_plastic",
    kind: "lure",
    displayName: "Paddle Tail Pike Jig",
    anatomy:
      "Heavy jig head with large **single** hook and long **paddle-tail** soft-plastic trailer; esox proportions, not bass Ned. **No weed guard** — no fiber/brush/bristle guard above the hook; clean collar from head to exposed hook only.",
  },
  {
    key: "large_pike_tube",
    kind: "lure",
    displayName: "Large Pike Tube",
    anatomy:
      "Large pike tube rigged on a stout jig head: oversized hollow tube body with flared tentacles, heavy single hook, baitfish/perch-scale profile, built for pike/musky rather than bass finesse. It should look larger and heavier than tube_jig.",
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
      "Classic **Lefty Kreh Deceiver** streamer on **one long, heavy-wire streamer hook** — **large** profile (think full **3–6 inch** class in the frame, **not** a small nymph or short wet fly): **long tail** of **several saddle hackles** tied **at the bend**, concave sides paired so the tips extend **well past the hook bend** (often ~2× shank length of tail fiber beyond the bend); then **stacked clumps** of **light belly + dark bucktail (or similar)** building forward toward the head for a **long, sleek taper**; finished with a **small thread head** at the hook eye. Tied fly only — **all feathers, hair, thread**. **FORBIDDEN**: diving lip / plastic bill; **treble hooks**; articulated trailer hook; dumbbell eyes (keep classic, weight-forward eyes off); epoxy minnow head shaped like a hard plug; hard plastic body.",
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
      "Modern **articulated streamer fly**: **two (or more) single streamer hooks** in tandem, joined only by **trailer wire, braid loop, or short shank** — show **small wire/ring** hinge between sections. Each section tied with **bucktail, craft fur, flash blend, ostrich, etc.** — **soft fiber, vise and thread**. **FORBIDDEN**: **any** clear or painted **diving lip / bill** (this is not a crankbait); **FORBIDDEN**: **treble hooks**; hard plastic minnow shell, swimbait plate segments, or conventional lure hardware; stick-on 3D fish scales on plastic blanks.",
  },
  {
    key: "articulated_dungeon_streamer",
    kind: "fly",
    displayName: "Articulated Dungeon Streamer",
    anatomy:
      "Honor the opening **PATTERN LOCK** checklist (Sex Dungeon). Emphasize **bulk forward** from **deer hair** + **dumbbells**, **length aft** from **marabou**; total **5–7 inch** impression in frame. **Articulation** visible as **small metal loop** only — each half **fully dressed** with tying thread at wraps. **FORBIDDEN**: one-hook flat streamer; conehead zonker (that's rabbit_strip_leech); 3D molded shad body.",
  },
  {
    key: "game_changer",
    kind: "fly",
    displayName: "Game Changer",
    anatomy:
      "**Blane Chocklett Game Changer** — a **fully tied articulated streamer**, **not** a hard plastic lure: **series of short Fish-Spine / shank segments** (several bumps in a row) **wrapped with feather, Body Wrap–type synthetic, chenille, or stacked hair** so each segment looks like **soft fly tying**, junctions **hidden by bulk** — **one hook** on the rearmost segment (typical). **Optional glued 3D eyes** on the head segment only. **4–6 inch** total baitfish proportions in frame, swimming silhouette. **FORBIDDEN**: injection-molded swimbait plastic; **treble hooks**; metal or plastic **crank lip**; glossy toy fish; exposed bare metal jointed spine with no fiber wrapping (every segment should show **tied materials**).",
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
      "Honor the opening **PATTERN LOCK** (**Conehead Bunny Leech**). Colors often **olive, black, brown, purple, or sculpin barred** — body texture must be **zonker fur** from palmering, not chenille segments. **Single hook point** exits under the fur near the rear third. **FORBIDDEN**: bead-chain eyes as main head weight (use **cone**); marabou tail without palmered strip; dungeon deer-hair head.",
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
      "**Classic lead-eye / dumbbell leech** (lake Stillwater–style): **moderate or large brass or lead dumbbell eyes** lashed **on top of the hook shank at the front third** (not Clouser-style eyes flipped under for keel). **Slim to medium body** — sparse chenille or dubbed thorax optional; **long leech tail** of **marabou, rabbit strip, or arctic fox** that **dominates the length** of the pattern, with **light Krystal Flash** OK. **One straight streamer hook**; **jig-style hook** OK but **no** spun deer-hair head. **FORBIDDEN**: massive jig cone like a tube jig; **treble hooks**; dumbbells so huge they read as a saltwater Clouser head profile with stacked bucktail wing; articulated wire.",
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
      "**Balanced leech under an indicator** (Phil Rowley / McBride lineage): usually a **90° jig hook** **or** shank with **a short pin / wire extension projecting forward from the hook eye** with a **tungsten bead (or shot) fixed on that pin** so the fly **suspends level** — **counterweight forward**, **marabou / soft fiber** body and tail aft. **FORBIDDEN**: **spinner blade** or **safety-pin wire arm**; **any** inline spinner hardware; **treble hooks**; conventional bass spinnerbait look. Must read as **stillwater balanced nymph/leech**, not a lure with a blade.",
  },
  {
    key: "zonker_streamer",
    kind: "fly",
    displayName: "Zonker Streamer",
    anatomy:
      "**Rabbit zonker strip** fly: **hide strip with fur** tied **wing-style along the top of the shank** (or palmered once) so the **fur lays back** toward the tail — **clear lateral-line profile** of a **small baitfish**. **Single streamer hook**; **optional** small bead or dumbbell for jigging **OK**; barred olive/chartreuse/black **zonker** look typical. **Sparse** throat flash or saddle optional. **FORBIDDEN**: **molded sculpin helmet head** filling half the frame (that is a different pattern); **treble hooks**; hard plastic minnow body; long articulated shank with two full dressings unless still clearly **zonker-strip based**.",
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
      "**Sculpzilla-class articulated sculpin** (Solitude / Galloup lineage): **two sections** — **rear stinger hook** with **zonker strip / bunny wing** as the tail; **front section** on a short shank with **cross-eyed or straight tungsten cone** forward, **buggy dubbed olive body** (picked/brushed), **guinea or speckled hackle** at the collar, **small mallard/chickabou pectoral accents**. Linked by **articulation wire** with a **jump ring** — **soft materials only**, unmistakably **tied flies**. **FORBIDDEN**: **treble hooks**; **crankbait lip**; hard plastic segments; single-shank muddler that is not articulated (this id is **articulated**); generic deer-hair bass bug without bunny tail.",
  },
  {
    key: "muddler_sculpin",
    kind: "fly",
    displayName: "Muddler Minnow",
    anatomy:
      "**Classic Muddler Minnow** (Gapen sculpin/baitfish): **single hook** — **spun natural deer-hair head** **trimmed into a rounded/muddlar collar** (bristly trimmed cup forward of wing); **gold oval tinsel or mylar body**; **mottled turkey** tail and often **gray squirrel** underwing; optional **black or red hackle collar** at the hair head base. **No dumbbell eyes** on classic version; **no** dumbbell keel. **FORBIDDEN**: heavy sculpin **helmet** cone dominating the nose; **treble hooks**; plastic bill; long zonker wing (that is zonker_streamer, not this id). Read as **historic muddler**, not a modern jig streamer.",
  },
  {
    key: "crawfish_streamer",
    kind: "fly",
    displayName: "Crawfish Streamer",
    anatomy:
      "**Bass/warmwater crayfish streamer** on **one hook** (often **wide-gap, point-riding-up**): **segmented dubbed or chenille thorax/abdomen** in olive/rust/orange; **two obvious claws** splayed — **rabbit zonker**, **micro pine squirrel**, **curled mallard**, or **thin foam** chewed to claws; ** barred rubber legs** splaying sideways; **medium lead or bead eyes** on the \"head.\" Read as **crawdad from the side** in the water, not a dry fly. **FORBIDDEN**: **treble hooks**; **diving lip**; skinny **San Juan worm** only; giant pike articulated dungeon; missing claws entirely.",
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
      "**Weightless Texas-rigged Senko-style worm fly** (McElligott / bass-fly convention): **offset wide-gap worm hook** or **straight worm hook** with **one continuous, straight, slightly tapering soft-stick body** in **olive, black, green pumpkin, or brown** — body built from **dense worm chenille, EP-style cylinder, or stacked foam strip** so it reads like a **~4–5 inch class Senko**, **not** a wire-thin San Juan. **Texas rig**: hook point **buried back into the plastic/fiber body** (weedless slot), shank inside the body with **gentle belly bend**. **FORBIDDEN**: **bead head** or **cone** at the nose (weightless Texas); **split shot**; red wire-worm only; nymph abdomen with tail filaments; **treble hooks**. **No extra hardware** — must resemble **weightless senko on an EWG**, photographed side-on.",
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
