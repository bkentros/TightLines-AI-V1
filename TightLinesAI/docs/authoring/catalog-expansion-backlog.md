# Catalog expansion backlog (post-rebuild)

**Status:** draft (2026-04-20)
**Upstream:** Phase 2 seasonal biology, Phase 3 item eligibility, Phase 4 inventory sufficiency, Phase 5 engine cutover
**Source of truth:** [`tightlines_recommender_architecture_clean.md`](../tightlines_recommender_architecture_clean.md)

## 1. Backlog summary

This backlog is a **short, prioritized, biologically-grounded list** of
catalog adjustments that would most improve the rebuilt recommender's
output quality for real thin contexts, without weakening the
architecture's simplicity or honesty.

It is **not** a wishlist. It is the result of a deliberate review of the
structural thin spots Phase 4 already measured, where each candidate is
evaluated against three questions:

1. Is the thin spot a real weakness, or an honest biological silence?
2. Is the gap worth paying the complexity cost of a new archetype?
3. Would a small eligibility revisit on an existing item solve it better?

The bar for expansion is high. Current catalog totals after Phase 3:
**36 lures, 21 flies**. We should not grow that count unless each new
archetype represents a real, distinct biological tactic that meaningfully
unblocks engine behaviour, not padding.

## 2. Do not expand — honest thinness that must remain thin

These thin spots were considered and are explicitly rejected as
expansion candidates. Documenting them here prevents future drift.

### 2.1 Trout river `(upper, *)` lures — **do not add**

The trout-river lure catalog is `hair_jig, casting_spoon, inline_spinner,
suspending_jerkbait` and has no `upper`-column archetype. Upper-column
conventional-lure tactics for trout (high-riding small minnow plugs,
surface spoons) are marginal, niche, and overlap heavily with fly
presentations. **Biologically honest silence.** Trout upper / surface
presentations are a fly-only domain and the fly catalog covers them
(dry flies, emergers, poppers for warmwater hybrids — not in scope here).

### 2.2 Trout river `(surface, *)` lures — **do not add**

Same reasoning as 2.1. No trout-river lure should ever sit in the
`surface` column in this product.

### 2.3 Northern pike river `(upper, *)` and `(surface, *)` — **do not add**

Pike river fishing is structurally a mid-column / bottom-adjacent game
in current. Surface pike river presentations (e.g., large wake baits
drifted) are real but extremely niche; the existing pike lake surface
archetypes (`large_pike_topwater`, `hollow_body_frog`) cover the
addressable reality. Adding a river-topwater pike archetype to chase
a relaxation warning would be padding, not biology.

### 2.4 Suppressed-posture `(bottom, slow)` fly headline misses — **do not add**

The 80 `primary_fly_ids may miss slot-0 headline coverage for
posture=suppressed target=(bottom, slow)` warnings are caused by the
only (bottom, slow) fly being `rabbit_strip_leech`
(`forage_tags: ["leech_worm"]`) while the row forages are
`baitfish`/`bluegill_perch`/`crawfish`. This is not a missing archetype;
it is a **real biological tension**: suppressed bass on the bottom
often *do* eat leeches/worms, but our coarse forage taxonomy doesn't
express that overlap. See §3.3 for the eligibility revisit that fixes
this without new items.

### 2.5 LMB fly catalog density in general — **do not pad**

LMB fly-fishing is a legitimately narrow discipline compared to LMB
conventional tackle. The 9 LMB fly archetypes (7 families) that
survived Phase 3 represent the true discipline: poppers, frogs, leeches,
articulated streamers, baitfish streamers, Clousers, and game-changers.
Adding sculpins, zonkers, crawfish streamers, or mouse patterns back to
LMB was considered in Phase 3 and correctly rejected. Do not revisit.

---

## 3. Priority expansion candidates

Each candidate is scoped as tightly as possible. Priority reflects the
frequency of the thin spot the addition unblocks **and** whether the
addition is biologically defensible on its own merits (not as a
recommendation-pool rescue).

### 3.1 **HIGH** — Add one upper-column LMB fly streamer

- **Gap name:** LMB fly `upper`-column zero-coverage
- **Affected:** `largemouth_bass` × `{freshwater_lake_pond,
  freshwater_river}` × any context where slot recipe lands on
  `(upper, *)`. The §20.4 coverage sweep attributes the **majority of
  LMB fly-side engine failures** to this single hole, and the worst
  manifestation (`integration §14.A`) lives here.
- **Why worth fixing:** Real LMB fly anglers *do* fish upper-column
  streamers — unweighted articulated baitfish flies on floating lines,
  "Boogie Bug"-style high-riding streamers, and unweighted sliders.
  The absence of `upper` LMB streamers is a genuine catalog gap, not a
  biological silence. This is the only LMB fly-side addition I
  recommend.
- **Solution class:** **New archetype** — exactly one.
- **Proposed shape (for authoring, not implementation):**
  - id candidate: `floating_baitfish_streamer` or `unweighted_baitfish_streamer`
  - family_group candidate: `streamer_unweighted` or `streamer_floating`
    — must be **distinct from** existing LMB streamer families
    (`streamer_weighted`, `streamer_baitfish`, `streamer_articulated`,
    `streamer_segmented`) to actually relieve the family-distinct
    starve case in `integration §14.A`.
  - column: `upper`
  - primary_pace: `medium` (primary target), secondary_pace: `slow`
    (for swing/dead-drift variants in lake grass edges)
  - forage_tags: `["baitfish"]` (and optionally `bluegill_perch` for
    lake summer contexts)
  - species_allowed: `["largemouth_bass", "smallmouth_bass",
    "northern_pike"]` — this one archetype simultaneously fills the
    LMB-lake-upper, LMB-river-upper, SMB-lake-upper, and pike-upper
    fly holes listed in Phase 4 §2.1.
  - water_types_allowed: `[L, R]`
  - clarity_strengths: `["clear", "stained"]`
- **Expected impact:** eliminates `integration §14.A`'s slot-2 starve;
  cuts the LMB-fly contribution of the §20.4 1,374 error count
  substantially; adds one honest biological tool that bass-fly anglers
  already use.
- **Priority rationale:** single-archetype addition, multi-species
  unlock, cleanly solves the largest measured thin-spot cluster.

### 3.2 **MEDIUM** — Revisit `pike_jig_and_plastic` water eligibility

- **Gap name:** Pike river `(bottom, *)` zero-coverage
- **Affected:** `northern_pike` × `freshwater_river` × all months; 86
  G8 warnings attributed to pike river `(bottom, slow)` slot targets.
- **Why worth fixing:** The entire reason the pike river bottom
  column is zero is Phase 3's decision to scope `pike_jig_and_plastic`
  to `[L]` only. That decision reads as conservative now — pike **do**
  hold on river bottom in deep holes, current seams, tailouts, and
  slack-water pools, and a heavy jig with a plastic trailer is a
  legitimate presentation for them there. This is the same archetype,
  just applied in rivers; it is not padding.
- **Solution class:** **Small eligibility revisit on existing
  archetype** — no new item, no new family, no new metadata.
- **Proposed change:** `pike_jig_and_plastic.water_types_allowed`:
  `[L]` → `[L, R]`. Nothing else changes.
- **Expected impact:** closes the 86-count G8 `(bottom, slow)` lure
  warnings for pike river; the engine's `nearestAdjacentColumn`
  relaxation ladder stops firing on pike river bottom slots.
- **Priority rationale:** zero new complexity, meaningful coverage
  improvement, and defensibly biological. This is the highest
  cost/benefit ratio in the backlog.
- **Caveat:** before applying, confirm with a short biology check
  that the archetype's `how_to_fish_variants` text still reads
  honestly in a river context (current versions describe dragging
  hard-bottom ledges, which is rivers too). If the text is
  lake-specific, add one river-applicable variant rather than
  rewriting existing ones.

### 3.3 **MEDIUM** — Tag `rabbit_strip_leech` with `baitfish`

- **Gap name:** Suppressed-posture `(bottom, slow)` fly headline miss
  for bass forage rows
- **Affected:** LMB lake/river, SMB lake/river rows with
  `primary_forage ∈ {baitfish, bluegill_perch, crawfish}` and
  suppressed-posture slot-0 target `(bottom, slow)`. 80 G8 warnings.
- **Why worth fixing:** The `rabbit_strip_leech` is **the** suppressed
  bottom fly for bass. Its rabbit-strip action imitates a slow-swimming
  small baitfish as much as a leech when fished on bottom, which is
  why real fly anglers tie it on specifically for cold-water,
  suppressed-fish conditions on baitfish-forage waters. The
  `forage_tags: ["leech_worm"]` classification is too narrow for how
  the fly actually fishes. Adding `"baitfish"` reflects angler reality.
- **Solution class:** **Forage-tag revisit on existing archetype** —
  no new item, no new family.
- **Proposed change:**
  `rabbit_strip_leech.forage_tags: ["leech_worm"]` →
  `["leech_worm", "baitfish"]`.
- **Expected impact:** clears the 80-count suppressed-posture
  headline-miss warnings; the headline pool now includes the fly in
  baitfish-forage rows where real anglers would fish it; no
  behavioural change for leech-forage rows.
- **Priority rationale:** one-line change, high frequency payoff,
  biologically defensible. Lower priority than 3.2 only because
  rabbit-strip-as-baitfish is a slightly softer biology claim than
  a pike jig working in a river.
- **Caveat:** verify against §15.1 G6 forage policy — ensure
  `baitfish` is allowed for all four bass/pike/trout species that
  `rabbit_strip_leech` currently serves. (It is: `baitfish` is in
  every species' forage policy.)

### 3.4 **LOW** — Consider one pike lake slow-pace mid-column "glide/jerk" archetype

- **Gap name:** Pike lake `pace=[slow]` family-distinctness
- **Affected:** pike lake December–February rows with narrow
  `pace_range=[slow]`; `integration §14.C` specifically.
- **Why worth considering:** pike lake `pace=[slow]` currently yields
  only 2 distinct non-surface families (`pike_jig` and `pike_swimbait`).
  A third slow-pace family — e.g., a large glide-bait-style soft-jerk
  presentation worked slow mid-column — is a real cold-water pike
  tactic.
- **Solution class:** **New archetype** — only if the existing
  `large_profile_pike_swimbait` doesn't already approximate it.
  Before adding, check whether relaxing
  `large_profile_pike_swimbait.primary_pace` from `medium` to `slow`
  (with `secondary_pace: "medium"`) would capture the same biology
  without a new archetype. If so, treat this as an eligibility revisit
  (one-line change), not an addition.
- **Expected impact:** resolves `integration §14.C` slot-2 starve;
  removes the last residual engine-error cluster after 3.1 and 3.2.
- **Priority rationale:** low because (a) this is one narrow context,
  (b) the fix is a reshape of an existing archetype before it is an
  addition, (c) the architecture explicitly permits fewer-than-3
  outputs here and Phase 5 will surface that gracefully anyway.

---

## 4. Possible later candidates

These ideas passed the biology check but failed the
cost/benefit-vs-frequency check. Documented so they aren't forgotten;
not scheduled.

### 4.1 SMB lake `upper` fly coverage

`slim_minnow_streamer` is river-only (biologically correct — slim
minnow swings are current-driven). SMB lakes legitimately have no
`upper` fly. Adding an upper-column SMB lake baitfish fly (e.g., a
Galloup-style surface-swimmer) is borderline. **If** 3.1 goes in and
its `species_allowed` includes SMB, this gap is resolved as a byproduct
and no separate work is needed. If not, revisit on merit.

### 4.2 Trout river `(upper, medium)` conventional lure

Listed for transparency only. Rejected in 2.1. A topwater trout plug
(Rapala skitter-type) exists in reality but is far too niche to add
to an architecture that emphasizes believability. A user whose fishing
relies on this tactic is better served by the fly side of the
recommender. Do not schedule.

### 4.3 A small mid-column pike river baitfish fly

Pike river fly coverage is already strong (`clouser_minnow`, `deceiver`,
`bucktail_baitfish_streamer`, `articulated_baitfish_streamer`,
`articulated_dungeon_streamer`, `game_changer`, `rabbit_strip_leech`,
`pike_bunny_streamer`, `large_articulated_pike_streamer`). No gap here.
Do not schedule.

### 4.4 Winter trout-river nymph-style fly

Phase 4 noted trout-river-winter rows take the G1 minimum=2 primary
flies relaxation. The trout fly catalog is already broad (12–13
primaries warm-season, 2+ winter), and winter trout river fishing is
a legitimately-narrow nymph/streamer window. The current catalog does
not carry nymphs (conscious architecture decision — nymphs are a
whole second taxonomy). Do not schedule unless the product scope
changes.

---

## 5. Expansion guardrails

Future catalog expansion work — this backlog or any later pass —
must obey the architecture:

1. **No new item-level fields.** The lean profile listed in the
   architecture doc (id, display_name, family_group, column,
   primary_pace, secondary_pace, forage_tags, clarity_strengths,
   species_allowed, water_types_allowed, how_to_fish_variants) is
   the permanent shape. Do not add month, region, posture, size,
   or any other "helpful" metadata.

2. **One archetype = one canonical column and one primary pace.**
   Adjacent-only `secondary_pace`. No multi-column items (architecture
   §Simplicity rules, line 660).

3. **`family_group` must be meaningfully distinct.** An expansion
   is not useful if it collides with an existing family that is
   already consumed by sibling picks on the same row. 3.1 specifically
   names the distinct family requirement.

4. **Add archetypes only when a real biological tactic is missing,
   never to meet a count or "fill slots".** If the engine can
   relax to a credible pick, that is by design — not a bug to
   paper over with inventory.

5. **Prefer an eligibility revisit to a new archetype.** 3.2 and 3.3
   are both one-line changes that give better cost/benefit than any
   new item could. Always check the existing catalog for a
   revisitable item before proposing a new one.

6. **No new forage buckets.** The forage taxonomy is coarse
   (`baitfish`, `crawfish`, `bluegill_perch`, `leech_worm`,
   `surface_prey`) and must stay that way. Expansion works by
   tagging an existing archetype with an existing bucket where
   honest (see 3.3), not by inventing new buckets.

7. **No item-level region/month filtering.** If a "would only
   recommend this item in spring" instinct surfaces, that is a
   seasonal-row authoring concern (Phase 2 biology), not an
   item-level one.

8. **Every addition must pass every invariant the factory already
   enforces.** In particular: G7 surface-fly species gate, P13
   surface-column archetype list, G2 column/pace consistency.

9. **After any expansion, re-run the full pipeline.** `gen:seasonal-rows-v4`,
   `check:seasonal-matrix`, `audit:eligibility`, plus the v4 deno
   test suite. A passing G1 and a bounded, explained G8 warning
   count is the standard.

10. **Update Phase 3 and Phase 4 memos, not the architecture doc.**
    The architecture doc is stable product-level truth. The
    authoring memos are the right place for evolving catalog
    decisions.
