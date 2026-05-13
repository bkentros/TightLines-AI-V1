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

export const NEGATIVE_BLOCK = `No text, numerals, logos, watermarks, scale bars, UI, water, sky, hands, rods, boxes, or extra tackle. Do not add stray hooks, duplicate blades, duplicate eyes, floating split rings, or invented hardware. Do not invent crossed hooks, melting plastic, bioluminescent colors, or extra phantom hooks. Do not substitute Game Changer articulation, crankbait lips, or swimbait joints on standard dry/streamer flies.`;

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
 * Locks camera to retail peg-board macro (reduces fantasy creatures on streamers / worm flies).
 * Inject for patterns that were rendering like hallucinations.
 */
export const FLY_SHOP_PRODUCT_PHOTO_CAMERA_BLOCK = `CAMERA / FRAMING (mandatory — **retail fly-shop truth**, not concept art): Imagine **one real tied fly** lifted from a **peg bin** (macro like **Fulling Mill / Rainy’s / Solitude** pack shots). **Strict lateral broadside catalog view**: single hook shank runs **left–right** across frame (eye left, bend/point right); **dorsal fur/feathers = upper silhouette edge**, **belly / peacock / bare shank = lower edge**; camera **level** with the fly, **orthographic** (no dramatic low-angle hero shot, no top-down, no underwater). Proportions of **an ordinary tied shop sample** — if in doubt, **plain and conservative**, not a “cooler” fantasy lure.`;

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
 * Placed after the title for rabbit_strip_leech.
 * Peg-card **rabbit strip (zonker) leech** — bead or cone, spiky collar, long zonker tail (matches common Umpqua-style bin photos).
 * Reference snapshot (human audit): `assets/reference/fly-examples/rabbit-strip-leech-user-reference.png`
 */
export const CONEHEAD_BUNNY_LEECH_ANCHOR_BLOCK = `RETAIL LOOK‑ALIKE (reference specimen): **Umpqua / fly-shop rabbit strip leech** macro — **small round bead at the hook eye** (often **gloss black**), **spiky palmered hackle / fiber collar** tight behind the bead, then a **long tapered rabbit zonker strip** as almost all of the fly’s length — **dense fur**, **hide edge** may read along the belly; **thin pearl or Krystal Flash** tucked **under** the fur; **single streamer hook**, point **down** in broadside. Catalog product shot.

PATTERN LOCK — **Rabbit-strip leech** (bunny / string leech — **not** peacock-belly zonker minnow, **not** Schultz dumbbells):

**Silhouette:** weighted front (**bead OR small metal cone** at eye) → **bristly collar** → **elongated rabbit fur** tapering toward the tail — **one dominant zonker strip** flowing aft.

**Must show:**
1) **Single hook**; **no dumbbells** on the shank (**lead_eye_leech** uses dumbbells).

2) **Collar** behind head: **hackle / schlappen / spiky fiber** — visibly **ragged**.

3) **Long zonker rabbit strip** — the main visual mass; some palmering OK if still **long leech**, not a **short puff**.

4) **Flash** under fur (optional, typical).

**FORBIDDEN**: dumbbell / Clouser eyes; **slim zonker minnow** with **silver/mylar or peacock belly** + dorsal strip only (that is **zonker_streamer**); marabou-only without zonker; articulated dungeon; trebles; soft plastic.`;

/** Placed after the title for lead_eye_leech.
 * Primary reference: stillwater **lead dumbbell + marabou tail** leech (shop peg-card). Schultz rabbit variant also valid.
 * Human ref: `assets/reference/fly-examples/lead-eye-leech-user-reference.png`
 */
export const LEAD_EYE_LEECH_ANCHOR_BLOCK = `RETAIL LOOK‑ALIKE (reference specimen): **lead-eye stillwater leech** — **silver or nickel dumbbell eyes** + **hot spot head** (pink / orange / chartreuse dub) + **black chenille** + **palmered hackle** + **long marabou tail** + sparse tail flash. **Single hook**, broadside catalog shot.

**EYE PLACEMENT (mandatory — corrects “floating shelf” errors):** The dumbbells are **tied in at the hook eye** — **figure-eight lashed tight to the bend of the hook eye and the first millimeters of shank**, **not** hovering on a separate plane above the fly. **Dubbing fills around and between the eyes** (pink/head color **packed against** the lead) so the weights read **bedded into the head**, **flush** with the tie — **no air gap**, **no “tabletop”** of eyes sitting over empty space. In side profile, thread wraps and fur **touch the underside of the dumbbells**. **Do not** draw eyes as loose beads stacked on nothing.

**Alternate valid retail id (Great Lakes):** **Fulling Mill “Schultzy’s Red Eye Leech”** — dumbbells **at eye / forward shank** + rabbit + mallard + spun rabbit — same **integrated** eye rule.

PATTERN LOCK — **Lead-eye leech** (weighted dumbbell streamer — **not** bead-head rabbit strip leech, **not** Clouser bucktail minnow):

**Non‑negotiable:** **Pair of dumbbell eyes** secured **at the hook eye region** on the **dorsal/top of the shank** with **visible thread integration** — **never** bead-only head (**rabbit_strip_leech**).

**Typical build:**
1) **Eyes:** metallic dumbbells **touching** dubbed head material; **lashed at eye**, not mid-body on a bare shelf.
2) **Head:** **hot spot** dub forward of / wrapping the eyes.
3) **Body:** chenille + palmered hackle — buggy.
4) **Tail:** long marabou (+ flash).
5) **No** brass cone at nose.

**Schultz-style variant:** rabbit + mallard if dumbbells stay **eye‑lashed** and **bedded**.

**FORBIDDEN**: bead or cone **without** dumbbells; dumbbells **floating** with no dub/thread against the shank; **slim silver-belly zonker** (**zonker_streamer**); bucktail **Clouser wing**; articulated dungeon; trebles.`;

/** Placed after the title for zonker_streamer.
 * Dorsal barred (or plain) zonker + reflective silver/mylar or peacock belly; thread head.
 * Human ref: `assets/reference/fly-examples/zonker-streamer-user-reference.png`
 */
export const ZONKER_BAITFISH_ANCHOR_BLOCK = `RETAIL LOOK‑ALIKE (reference specimen): **Rabbit-zonker baitfish streamer** — **one zonker rabbit strip** along the **full dorsal / back** of the shank (often **barred**: pale cream, tan, or orange fur with **dark vertical bars**); fur **long and soft**, carrying **past the bend** to a **tapering tail**. **Ventral side** = **shiny fish belly**: **silver Mylar tinsel**, **mylar tube / piping**, or **wide pearl tinsel** wrapped on the shank (**high flash**); **peacock herl** is an acceptable alternate belly. **Head** = **small neat black thread** (or tiny bead) at the hook eye — **no tungsten cone**, **no lead dumbbells**. **Elongated minnow** silhouette ~**3–4× longer than it is deep**, single dark hook, point **down** in side view. Catalog broadside (neutral backdrop — **no** logos).

PATTERN LOCK — **Zonker streamer** (slim baitfish — **not** **rabbit_strip_leech**, **not** **lead_eye_leech**):

**Must show:**
1) **Flash underbody** on the **lower half** of the shank — **silver/metallic** preferred, **not** a 360° fur leech cigar.

2) **Zonker strip** on **top**: leather roughly straight along the back; fur sweeps **down the flanks**.

3) **Minimal head** — thread finish obvious.

**Split rule:**
• **This id** = **dorsal zonker + reflective belly + minnow proportions**.
• **rabbit_strip_leech** = weighted **bead/cone** + **spiky collar** + **long leech tail** (no silver minnow belly emphasis).

**FORBIDDEN**: nose cone or dumbbell eyes; palmered fur **tube** filling the frame; two articulated hooks; hard plastic minnow; trebles.`;

/** Placed after the title for sculpzilla (Kelly Galloup / Solitude — classic cone + olive + tan zonker look).
 * Human ref: `assets/reference/fly-examples/sculpzilla-user-reference.png`
 */
export const SCULPZILLA_ANCHOR_BLOCK = `RETAIL LOOK‑ALIKE (reference specimen): **Sculpzilla** articulated sculpin (**Kelly Galloup / Solitude S103** class) — **heavy dark metallic cone** (black or dark gunmetal nickel) at the nose with **large round cherry-red 3D dome eyes** on **both sides** of the cone; **not** painted lure eyes on plastic. Immediately behind the cone, a **wide bushy olive-green collar** (**marabou, schlappen, or stacked soft hackle**) that **flares outward** then sweeps back.

**Body / wing:** **one long natural tan or cream rabbit zonker strip** along the **dorsal line** — **dense fur** extending **horizontally well past the front hook bend** toward the tail; color reads **earthy** (tan / beige / natural), not hot chartreuse. **Articulation:** a **thin wire or heavy mono loop** may show **underneath** the fur, linking the **front dressed hook** to a **small trailing stinger hook** at the **rear of the zonker** — **one hinge only**, not a caterpillar of beads.

**Proportions:** **front-heavy** (cone + olive bulk dominates the first third to half); rear is **mostly flowing zonker** on the stinger — **no second cone**, **no second eye pair** on the trailer.

Output = **one isolated fly** on flat paper (**no tying vise**, **no hands**, **no blue studio** — use project background rules only).

PATTERN LOCK — **Sculpzilla** (**two single hooks, one articulation**):

**Non‑negotiable:** **metal cone** + **big red dome eyes** + **olive bushy collar** + **tan/cream zonker** + **stinger hook** at tail.

**Optional (keep minor):** throat dub (pearl/olive), **guinea** flecks, **mallard flank** pectorals — many ties omit obvious pectorals; do **not** let extras obscure the **olive collar + tan zonker** read.

**FORBIDDEN:** Game Changer multi-shank spine; molded swimbait plates; crankbait lip; trebles; **matching heavy dressings** on front and rear hooks; **cone without red eyes**; **only rabbit with no cone** (wrong id).`;

/** Placed after the title for warmwater_worm_fly.
 * Human ref: `assets/reference/fly-examples/warmwater-worm-fly-user-reference.png` — **stick-worm silhouette**, Texas-rig on offset hook, **tied fiber body**, mottled olive/tan/brown.
 */
export const RICH_ULTIMATE_WORM_ANCHOR_BLOCK = `RETAIL LOOK‑ALIKE — **warmwater worm fly**: **same silhouette and Texas-rig topology as a weightless soft-plastic stick worm**, but the **whole bait is hand-tied fly material** — **never** factory-molded plastic.

**LOCK THIS TOPOLOGY (prevents generic chenille cigar worms):**
1) **Shape:** Long **stick-worm** profile — **cylindrical**, **~pencil-thick**, **slight taper toward the tail**, **gentle S-curve** along the body (soft worm lying on paper — **not** ramrod straight).
2) **Material (critical):** Body = **dense fuzzy pile** from **chenille, mop yarn, dubbing brush, or blended yarn** — **matte fibrous**, **cottony short hairs**, **compressible** — **zero** PVC gloss, **zero** mold seam, **zero** slick rubber read.
3) **Color (mandatory):** **Mottled mix** of **olive + tan + yellow-brown** (watermelon / pumpkinseed vibe) — **speckled and blended** along the shank — **not** solid single-color olive only; **not** neat horizontal stripes.
4) **Hook & rig — Texas / offset on a fly:** **Wide-gap offset worm hook**, dark finish. **Hook eye** at the **front “head”** of the worm. Shank **enters** the fuzzy body from the nose; **bend and point curve back** so the **point and barb are buried inside the fuzzy pile** around the **middle third** of the worm (**weedless / pegged** — **no** bare needle sticking out).
5) **Head:** **Tiny black** bead or dense black thread **only** at the eye — **no** bullet weight, **no** jig head, **no** cone.

**Single specimen**, strict lateral catalog view (S-curve stays **in the picture plane**). Match the **reference specimen** mentally — **do not** improvise a different worm pattern.

**ANTI-HALLUCINATION:** Do **not** add **any text, titles, logos, watermarks, or captions**. Do **not** add second hooks, split shot, swivels, or line. Do **not** substitute a **straight fuzzy cigar** with **exposed hook point** — this id **must** read **Texas-rigged stick worm**.

PATTERN LOCK — **Warmwater worm fly**

**FORBIDDEN:** Molded **TPE / soft-plastic** stick-worm or ribbontail blank; **high-gloss** worm; **uniform olive** only; **jig/cone** at nose; **trebles**; **multiple worms**; **vise or hands**; **printing** or **lettering** on the image.`;

/**
 * High-viz warmwater deer-hair slider (stacked multi-tone head, yellow collar, grizzly tail, legs).
 * Human ref: `assets/reference/fly-examples/deer-hair-slider-user-reference.png`
 */
export const DEER_HAIR_SLIDER_ANCHOR_BLOCK = `RETAIL LOOK‑ALIKE (reference specimen): **deer-hair slider** — **spun and densely packed deer hair**, **trimmed into a slick wedge / bullet head** (aerodynamic, **not** a flat foam popper face).

**Head color bands (mandatory — busy shop tie):**
- **Dorsal / top:** deep **navy blue** deer hair.
- **Mid band:** **speckled orange and brown** (spotted / mottled).
- **Ventral / belly:** **clean white** hair.
- **Throat accent:** **neon hot pink** patch on the **lower front** of the head.

**Eyes:** **Large 3D eyes both sides** — **silver or chrome outer ring** with **black pupil** (reflective doll-eye look, **not** tiny flat stick-ons only).

**Collar:** **Bright canary yellow** hair or **soft feather** flaring **immediately behind the head** — crisp transition before the tail.

**Tail / wing:** **Long streamer feathers** including **grizzly-style barred** black-and-tan feathers; **mixed with tan and light brown bucktail or calf** for bulk; tail extends **well past the bend**.

**Legs (mandatory):** **several long thin dark rubber or silicone sili-legs** trailing **past the tail**, wiggly.

**Hook:** **One** stout warmwater hook; point **down** in broadside; **no** treble.

**Framing:** **Peg-bin lateral** — **eye left**, tail right; **flat warm paper backdrop per project** — **no vise**, **no hands**, **no sterile white sweep**.

PATTERN LOCK — **Deer-hair slider (hi-vis)**

**FORBIDDEN:** Hollow frog body; hard prop bait; foam **cup** popper; **plain solid brown head only** (wrong — must show **blue / orange speck / white / pink** zones); trebles; second fly.`;

/**
 * Simpler baitfish-style slide (wake minnow read — distinct from multi-band deer-hair slider above).
 */
export const BAITFISH_SLIDER_ANCHOR_BLOCK = `RETAIL LOOK‑ALIKE: **baitfish slider / slide** — **natural brown deer-hair stacked head** (trimmed bullet, **not** foam popper). **Large 3D eyes** — **white ring + black pupil** on **both sides**. **Rusty red / hot pink marabou or synthetic collar**; **long tapered tan bucktail tail** past the bend. **Single** surface hook. **Hi-minnow silhouette** — slightly **leaner tail** than bulky pike flies. Peg-bin broadside, paper background, **no vise**.

**FORBIDDEN:** Multi-band navy/orange/white/pink competition slider head (that is **deer_hair_slider** id); trebles; hard topwater plug.`;

/**
 * Jack Gartside / catalog **foam gurgler** — dorsal foam strip + folded front lip (not deep popper cup).
 * Human ref: `assets/reference/fly-examples/foam-gurgler-user-reference.png`
 */
export const FOAM_GURGLER_ANCHOR_BLOCK = `RETAIL LOOK‑ALIKE (reference specimen): **foam gurgler** topwater fly — **sheet or strip of white closed-cell foam** lashed along the **dorsal / top** of the hook shank.

**Front lip (signature):** At the **hook eye**, the foam is **folded or stacked upward** into a **blunt rectangular or tab-shaped lip** that **projects above** the shank and **slightly forward** over the eye — **gurgle plate**, **not** a deeply dished bass-popper cup.

**Body (ventral to foam):** **White fluffy dressing** under the foam — **palmered saddle/schlappen**, **chenille**, or similar — **matte**, fishable bulk along the shank.

**Tail:** **Long white bucktail, calf, or synthetic** — **wispy**, **≈1.5–2× the dressed body length**, flowing aft from the bend.

**Palette (reference tie):** **all white** — foam, hackle, and tail **matching** (cream-white OK); **no** hot-chartreuse foam unless you stay in white family.

**Hook:** **One** surface streamer hook; **metal may read silver** at bend; point **down** in **strict lateral broadside** (**eye left**, **tail right**).

**Output:** **pegged product shot on flat warm paper only** — **no** solid blue studio, **no** white mat border, **no** drop shadow on the backdrop (per project composition rules).

PATTERN LOCK — **Foam gurgler**

**FORBIDDEN:** Deer-hair slider head; hollow frog; **deep concave popper face only** with no dorsal foam strip; **trebles**; **vise**; **two-tone foam/rainbow** unless still reads as classic **white gurgler**.`;

/**
 * **Frog popper** — hard olive body, red cup face, yellow/black eyes, legs + hackle tail.
 * Human ref: `assets/reference/fly-examples/frog-fly-user-reference.png`
 */
export const FROG_FLY_ANCHOR_BLOCK = `RETAIL LOOK‑ALIKE (reference specimen): **frog popper fly** — **hard buoyant head** (**balsa, cork, or turned dense foam** look) **bulbous and rounded**, **dark olive green** with **subtle darker green mottling / spots** like frog skin — **not** soft hollow plastic walking-frog bait.

**Popping face (signature):** **Front is a deep concave / cupped popper mouth** — interior painted **solid bright red**. A **small metal line-tie eyelet** sits **in the center** of the red cup (or at the cup floor). **Not** a flat hair head.

**Eyes:** **Large 3D eyes on both sides** of the head — **bright yellow outer ring** with **black pupil** in the center (**not** white googly eyes).

**Tail assembly:** From the **rear of the head**, **several long thin tan or light-orange rubber/sili legs** trail back; mixed with **yellow and olive-green feathers** (**hackle, schlappen, or marabou**) for **bulk and movement**.

**Hook:** **Single** gap hook **under** the body, point **down** / aft in broadside.

**Weed guard:** **Thin stiff wire or heavy mono loop** from the **front/head area** toward the **hook point** — **snag deflector**, clearly visible in profile.

**Framing:** **Strict lateral peg-card** — **hook eye / line tie to the right** or **left** consistently with other flies (**eye left, tail/legs right** preferred); **flat warm paper** backdrop per project (**not** pure white studio).

PATTERN LOCK — **Frog popper (topwater bug)**

**FORBIDDEN:** **Spun deer-hair** green-and-black **striped** hair-frog only (wrong id look); **trebles**; **molded bass walking frog** with hinged legs; **missing red cup face**; **vise**; white-only googly eyes as the only eye style.`;

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
    displayName: "Texas-Rigged Craw",
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
    key: "compact_glidebait",
    kind: "lure",
    displayName: "Compact Glide Bait",
    anatomy:
      "Compact hard glide swimbait scaled for smallmouth: shorter, slimmer two-section baitfish body than a trophy bass glide; one clean hinge, small nose line tie, two small trebles on belly/tail hangers. Realistic perch/shad profile. No diving lip, no soft paddle tail, no jig skirt.",
  },
  {
    key: "soft_jerkbait",
    kind: "lure",
    displayName: "Soft Jerkbait",
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
    key: "magnum_jerkbait",
    kind: "lure",
    displayName: "Magnum Jerkbait",
    anatomy:
      "Oversized hard suspending jerkbait for bass: longer/deeper minnow body than standard jerkbait, clear diving lip, sturdy split rings, two or three trebles, baitfish paint. No soft tail, no glidebait joint, no pike/musky bucktail hardware.",
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
    displayName: "Floating Trout Plug",
    anatomy:
      "Small slim floating minnow plug for trout: tiny lip or wake lip, single hooks (treble or singles per classic trout plug style) — keep tidy and small-bodied; no offshore trolling plug scale.",
  },
  {
    key: "walking_topwater",
    kind: "lure",
    displayName: "Walking Bait",
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
    key: "wake_bait",
    kind: "lure",
    displayName: "Wake Bait",
    anatomy:
      "Hard-bodied shallow wake bait: short square/wake bill angled down from nose, buoyant baitfish/bluegill body, two treble hooks, built to bulge the surface. No popper cup, no propellers, no deep-diving crankbait bill.",
  },
  {
    key: "magnum_worm",
    kind: "lure",
    displayName: "Magnum Worm",
    anatomy:
      "Oversized soft-plastic ribbon-tail or straight-tail bass worm rigged Texas-style: bullet weight ahead of offset wide-gap hook, long thick worm body, big swimming tail, hook point buried weedless. No jig skirt, no treble hooks.",
  },
  {
    key: "large_profile_pike_swimbait",
    kind: "lure",
    displayName: "Large Paddle-Tail Swimbait",
    anatomy:
      "Oversize musky/pike molded swimbait body with visible hook harness or jig hook, big paddle tail; show as rigged big bait typical for esox.",
  },
  {
    key: "pike_spinnerbait",
    kind: "lure",
    displayName: "Oversized Spinnerbait",
    anatomy:
      "Oversized safety-pin spinnerbait built for pike: heavy V-wire frame, large blades on upper arm, bulky skirt or pike-scale trailer on lower jig head, stout single hook. Larger and heavier than bass spinnerbait, no trebles.",
  },
  {
    key: "weedless_spoon",
    kind: "lure",
    displayName: "Weedless Spoon",
    anatomy:
      "Classic weedless pike spoon: broad curved metal spoon body, single large hook at tail with wire weed guard over the point, split ring or line tie at nose. No treble hook, no jig skirt, no spinner arm.",
  },
  {
    key: "shallow_minnowbait",
    kind: "lure",
    displayName: "Shallow Twitchbait",
    anatomy:
      "Shallow-running hard minnowbait for pike: elongated floating minnow body, tiny shallow lip or twitchbait bill, two or three trebles, durable pike-scale hardware. No deep diving bill, no glide joint, no soft plastic tail.",
  },
  {
    key: "pike_glidebait",
    kind: "lure",
    displayName: "Large Glide Bait",
    anatomy:
      "Large pike/musky glide bait: big hard two-section baitfish body with one visible hinge, heavy split rings and trebles, realistic perch or baitfish proportions. No diving lip, no spinner blades, no soft paddle tail.",
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
    displayName: "Large Walking Bait",
    anatomy:
      "Large **walk-the-dog** topwater in the **Heddon Zara Spook** lineage (same silhouette anglers associate with ‘the Spook’): elongated **symmetric cigar / torpedo** hard body, gently rounded nose — **no** deep **popper** cup or scooped splash mouth, **no** nose or tail **propeller**, **no** buzz blade, **not** a pencil popper. Line tie at the **nose**. Two **treble hooks** on split rings (belly + tail) typical; hardware can read a bit heavier for pike/musky but the **body style stays Spook**, not chugger/wake/prop bait.",
  },
  {
    key: "pike_jig_and_plastic",
    kind: "lure",
    displayName: "Heavy Paddle-Tail Swimbait",
    anatomy:
      "Heavy jig head with large **single** hook and long **paddle-tail** soft-plastic trailer; esox proportions, not bass Ned. **No weed guard** — no fiber/brush/bristle guard above the hook; clean collar from head to exposed hook only.",
  },
  {
    key: "large_pike_tube",
    kind: "lure",
    displayName: "Large Tube Jig",
    anatomy:
      "Large pike tube rigged on a stout jig head: oversized hollow tube body with flared tentacles, heavy single hook, baitfish/perch-scale profile, built for pike/musky rather than bass finesse. It should look larger and heavier than tube_jig.",
  },
  {
    key: "big_smallmouth_tube",
    kind: "lure",
    displayName: "Big Tube Jig",
    anatomy:
      "Larger smallmouth tube jig: oversized hollow tube body on internal jig head, tentacle skirt flared at rear, exposed single jig hook, goby/craw/baitfish profile. Bigger than finesse tube_jig but not a pike tube.",
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
    displayName: "Articulated Baitfish",
    anatomy:
      "Modern **articulated streamer fly**: **two (or more) single streamer hooks** in tandem, joined only by **trailer wire, braid loop, or short shank** — show **small wire/ring** hinge between sections. Each section tied with **bucktail, craft fur, flash blend, ostrich, etc.** — **soft fiber, vise and thread**. **FORBIDDEN**: **any** clear or painted **diving lip / bill** (this is not a crankbait); **FORBIDDEN**: **treble hooks**; hard plastic minnow shell, swimbait plate segments, or conventional lure hardware; stick-on 3D fish scales on plastic blanks.",
  },
  {
    key: "articulated_dungeon_streamer",
    kind: "fly",
    displayName: "Dungeon Streamer",
    anatomy:
      "Honor the opening **PATTERN LOCK** checklist (Sex Dungeon). Emphasize **bulk forward** from **deer hair** + **dumbbells**, **length aft** from **marabou**; total **5–7 inch** impression in frame. **Articulation** visible as **small metal loop** only — each half **fully dressed** with tying thread at wraps. **FORBIDDEN**: one-hook flat streamer; rabbit strip leech bead/zonker tail (that's rabbit_strip_leech); 3D molded shad body.",
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
      "**Umpqua-class rabbit strip leech** (peg-card): **bead or small cone at eye** + **spiky collar** + **long zonker rabbit strip** (tapering tail) + flash under fur; single hook, point down in side view. **FORBIDDEN**: Schultz dumbbells; peacock-belly zonker minnow; dungeon; plastic; trebles.",
  },
  {
    key: "jighead_marabou_leech",
    kind: "fly",
    displayName: "Jigged Marabou Leech",
    anatomy:
      "Weighted jig hook with stacked marabou and flash; lead or painted head obvious; single hook only.",
  },
  {
    key: "lead_eye_leech",
    kind: "fly",
    displayName: "Lead-Eye Leech",
    anatomy:
      "**Lead-eye leech:** dumbbells **lashed at hook eye / forward shank**, **bedded in pink/chartreuse dub** (no floating shelf); black chenille + palmered hackle; long marabou tail + flash. **FORBIDDEN**: eyes hovering with gap; no dumbbells; zonker minnow; trebles.",
  },
  {
    key: "feather_jig_leech",
    kind: "fly",
    displayName: "Marabou Jig Leech",
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
      "**Zonker streamer** (reference style): **barred (or solid) rabbit zonker on dorsal** + **silver Mylar/tinsel/piping** or **peacock** belly + **small black thread head** — **long lean minnow** ~3–4× length:height. **FORBIDDEN**: rabbit_strip_leech leech build; dumbbells; cone; dungeon; trebles.",
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
      "**Sculpzilla** (reference style): **dark cone + BIG red 3D eyes** + **bushy olive marabou/schlappen collar** + **long natural tan/cream zonker** to **articulated stinger** (wire under fur OK) — **front heavy**. Optional guinea/mallard accents only if subtle. **FORBIDDEN**: Game Changer spine; tiny/missing eyes; second cone on trailer; trebles.",
  },
  {
    key: "muddler_sculpin",
    kind: "fly",
    displayName: "Muddler Minnow",
    anatomy:
      "**Classic Muddler Minnow** (Gapen): **single hook** — **spun natural deer hair** **packed and trimmed** into a **forward-sloping collar / muddlar head** (you see **clipped hair tips** in a **cone/cup** ahead of the wing, **not** a smooth 3D-printed dome); **flat tinsel or mylar body**; **mottled turkey tail** + **gray squirrel** underwing (often **slim**, **not** a full zonker blanket); optional **black or red saddle** at the hair base. **No dumbbells**; **no** sculpin **helmet cone**; **no** rabbit zonker strip along the back. **FORBIDDEN**: **Fish-Skull / molded baitfish head**; **lead eyes**; **articulated wire**; **treble hooks**; **long palmered rabbit carrot body**; modern **jig cone** with skirt. Read as **1960s–80s muddler**, not a tube jig.",
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
    displayName: "Crawfish Fly",
    anatomy:
      "Bass-bug style craw: wide silhouette, dumbbell eyes, silicone or sili legs, maybe deer hair or foam carapace; single hook; reads as bass-craw fly not crankbait.",
  },
  {
    key: "warmwater_worm_fly",
    kind: "fly",
    displayName: "Worm Fly",
    anatomy:
      "**Warmwater worm fly (Texas-rig, tied fibers):** **Wide-gap offset hook**; **stick-worm pencil profile** with **gentle S-curve**; body **mottled olive + tan + yellow-brown** speckle; **dense matte chenille/mop/dubbing pile** — **not** molded plastic. **Point buried in fuzz** ~**mid-body**. **Black micro head** at eye. One fly. **FORBIDDEN**: slick soft-plastic worm blank; solid olive only; exposed point; jig; text; trebles.",
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
    displayName: "Bunny Streamer",
    anatomy:
      "Long zonker strip for esox, big hook, heavy eyes or head; bulky but streamlined for pike/musky.",
  },
  {
    key: "large_articulated_pike_streamer",
    kind: "fly",
    displayName: "Big Articulated Streamer",
    anatomy:
      "Long multi-section pike fly: big head fibers, long trailing tail, two+ hook sections articulated; one fly.",
  },
  {
    key: "unweighted_baitfish_streamer",
    kind: "fly",
    displayName: "Unweighted Baitfish",
    anatomy:
      "Light bucktail/synthetic minnow with no heavy cone; neutral sink look; single hook.",
  },
  {
    key: "baitfish_slider_fly",
    kind: "fly",
    displayName: "Baitfish Slider",
    anatomy:
      "**Baitfish slider (simpler tie):** **brown deer-hair bullet head**, **big white/black doll eyes**, **rust/pink collar**, **long tan bucktail** — lean wake **minnow** profile, single hook. **NOT** the multi-color navy-orange-white-pink banded head (**deer_hair_slider**). **FORBIDDEN**: foam popper; trebles; vise.",
  },
  {
    key: "bluegill_streamer",
    kind: "fly",
    displayName: "Bluegill Streamer",
    anatomy:
      "Large warmwater bluegill/panfish streamer on one stout bass hook: broad flat sunfish profile with stacked deer hair or synthetic brush head, barred olive/blue/orange fibers, subtle flash, optional mono weed guard. Tied fly materials only; no hard plastic body, no treble hooks.",
  },
  {
    key: "popper_fly",
    kind: "fly",
    displayName: "Bass Popper",
    anatomy:
      "Foam or spun hair popper head with cup face, short collar, tail fibers; single surface hook.",
  },
  {
    key: "deer_hair_slider",
    kind: "fly",
    displayName: "Deer Hair Slider",
    anatomy:
      "**Deer-hair slider (hi-vis reference):** **wedge deer-hair head** with **navy top**, **speckled orange-brown mid**, **white belly**, **neon pink throat**; **silver-ring 3D eyes**; **canary yellow collar**; **grizzly barred + tan feather/bucktail tail**; **dark sili-legs** past tail. Single hook broadside. **FORBIDDEN**: plain brown-only head; foam popper; trebles; vise.",
  },
  {
    key: "foam_gurgler_fly",
    kind: "fly",
    displayName: "Foam Gurgler",
    anatomy:
      "**Foam gurgler:** **white closed-cell foam** strip on **top of shank**; **folded-up front lip/tab** over **hook eye** for gurgle (not big popper cup). **White palmer/chenille** underbody; **long white bucktail/synth tail** ~2× body. **All-white** reference tie. Single hook broadside. **FORBIDDEN**: deer-hair slider; trebles; vise; blue studio card.",
  },
  {
    key: "frog_fly",
    kind: "fly",
    displayName: "Frog Popper",
    anatomy:
      "**Frog popper (reference):** **hard olive mottled head**; **deep red concave popper face** with **central line tie**; **yellow ring + black pupil** eyes on sides; **tan rubber legs** + **yellow/olive hackle-marabou tail**; **mono/wire weed guard**; single hook beneath body, broadside. **FORBIDDEN**: deer-hair striped frog; trebles; walking hollow frog; vise.",
  },
  {
    key: "mouse_fly",
    kind: "fly",
    displayName: "Mouse Pattern",
    anatomy:
      "Deer hair or foam mouse with naked tail strip, single big gap hook; reads as night mouse pattern — avoid photoreal fur face; tied fly.",
  },
  {
    key: "pike_flash_fly",
    kind: "fly",
    displayName: "Flash Fly",
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
