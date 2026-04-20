# Phase 3 — Item catalog biological eligibility review

**Source of truth:** [`tightlines_recommender_architecture_clean.md`](../tightlines_recommender_architecture_clean.md)

This pass re-audited every lure and fly archetype against strict biological
honesty and the architecture's §Item profile model. The goal was a catalog
whose `species_allowed` and `water_types_allowed` surfaces are believable
to anglers, not padded to inflate recommendation pools.

Phase 2 established the seasonal biology truth. Phase 3 establishes the
item biology truth. Phase 4 will measure per-context sufficiency against
this now-tightened catalog.

## Architectural boundaries observed this phase

- **No month-level or region-level fields were added to archetypes.**
  The architecture's §Item profile model lists the allowed lean profile
  (`id`, `name`, `side`, `family`, `speciesAllowed`, `waterTypesAllowed`,
  `column`, `pacePrimary`, optional `paceSecondary`, `forageTags`,
  `isTopwater`) and the Simplicity Rules for v1 explicitly ban "bloated
  metadata" (lines 103, 652). Month/region filtering is intentionally
  handled at the seasonal-row layer (`column_range`, `pace_range`,
  `surface_seasonally_possible`), not at the item layer.
- **Column and pace assignments were not changed.** They were reviewed
  but each remained biologically defensible against the architecture's
  hard profile rules (one canonical column, one primary pace,
  adjacent-only secondary pace).
- **Clarity strengths were not touched.** Clarity is a separate runtime
  gate and was already authored at reasonable granularity.
- **Forage tags were spot-checked but not trimmed further.** The
  existing coarse taxonomy (baitfish / crawfish / bluegill_perch /
  leech_worm / surface_prey) is tight, and `surface_prey` is correctly
  scoped to surface items.
- **Factory-level gates (P13, G7 surface-fly species gate) were
  preserved as-is.** Those already encode hard species truths.

## Lure catalog — 10 tightenings

| id | field | before | after | rationale |
| --- | --- | --- | --- | --- |
| `carolina_rigged_stick_worm` | `water_types_allowed` | L, R | L | C-rig is a hard-bottom lake/pond finesse presentation. In current, the heavy sinker drags and kills the leader's floating-worm action. River use is marginal enough that listing rivers is eligibility padding. |
| `football_jig` | `water_types_allowed` | L, R | L | The football head exists specifically to drag lake points, ledges, and hard clay bottoms. Rivers do not host that structure; SMB and LMB river anglers use compact finesse jigs, tubes, or hair jigs. Listing rivers is padding. |
| `compact_flipping_jig` | `species_allowed` | LMB, SMB | LMB | Flipping into cover is a LMB tactic. SMB rarely live in the mat/grass/pad/laydown cover this archetype targets, and SMB anglers don't flip. Listing SMB was convenience, not biology. |
| `hair_jig` | `species_allowed` | LMB, SMB, trout | SMB, trout | The hair jig is an iconic SMB river cold-water tactic, and steelhead/large-trout use is real. LMB hair-jig use is a rare eccentricity, not a representative tactic. Listing LMB was padding. |
| `inline_spinner` | `species_allowed` | LMB, SMB, trout | SMB, trout | Inline spinners (Mepps, Panther Martin) are classic stream trout / river SMB tools. LMB anglers use safety-pin spinnerbaits; the inline profile is too small and too fast for typical LMB presentations. Listing LMB was padding. |
| `blade_bait` | `species_allowed` | LMB, SMB, pike | LMB, SMB | Blade baits are cold-water, vertical, flash-and-vibration presentations for suspended bass and walleye. Pike will hit anything metal, but the archetype isn't a meaningful pike pattern — they get targeted with large jerkbaits and spinners instead. |
| `buzzbait` | `species_allowed` | LMB, SMB | LMB | Buzzbaits live in thick LMB cover (grass, pads, slop) and are a grass-lake signature. SMB rarely live there and rarely commit to a fast surface-blade presentation; SMB topwater is dominated by walkers, poppers, and props. Listing SMB was padding. |
| `large_bucktail_spinner` | `species_allowed` | pike, LMB | pike | This archetype represents musky/pike-sized bucktails (#5+ blades, long flowing tails). LMB will occasionally hit one but the archetype is sized and presented for pike. Listing LMB was padding. |
| `large_pike_topwater` | `species_allowed` | pike, LMB | pike | Oversized pike topwaters (Suick Weagle-style, large prop/tail baits) are too big and too violent for typical LMB recommendations. LMB already have `walking_topwater`, `popping_topwater`, `prop_bait`, `buzzbait`, and `hollow_body_frog`. Listing pike-scale topwaters for LMB was padding. |
| `pike_jig_and_plastic` | `species_allowed` | pike, LMB | pike | Pike jig-and-plastic implies oversized jigs with large soft plastics (6"+). LMB already have `compact_flipping_jig`, `football_jig`, `finesse_jig`, and `texas_rigged_soft_plastic_craw`. Listing pike-scale jigs for LMB was padding. |

## Fly catalog — 6 tightenings

| id | field | before | after | rationale |
| --- | --- | --- | --- | --- |
| `bucktail_baitfish_streamer` | `species_allowed` | SMB, LMB, pike, trout | SMB, pike, trout | Bucktail streamers are iconic for SMB river, trout, and pike. River LMB fly-fishing with bucktails is a marginal tactic; LMB fly anglers gravitate to poppers, frog flies, articulated baitfish, and game-changers. |
| `zonker_streamer` | `species_allowed` | SMB, LMB, trout | SMB, trout | Zonkers are a SMB and trout streamer family (heavy-headed rabbit strip). LMB rarely connect with zonkers in conditions where a popper/frog/articulated-baitfish wouldn't be a better choice. |
| `sculpin_streamer` | `species_allowed` | SMB, LMB, pike, trout | SMB, trout | Sculpins live in cool, rocky river habitat — which is SMB/trout territory by definition. LMB rivers don't host sculpins as meaningful forage, and pike hunt much larger prey than a #4 sculpin pattern. |
| `sculpzilla` | `species_allowed` | SMB, LMB, pike, trout | SMB, trout | Same reasoning as `sculpin_streamer` — it is a larger sculpin profile but still a cool-water rocky-bottom imitation, not a LMB or pike pattern. |
| `crawfish_streamer` | `species_allowed` | SMB, LMB, trout | SMB, trout | Fly-fishing a crawfish pattern is overwhelmingly a river SMB (and big-river trout) presentation. River LMB crawfish fly is marginal; LMB anglers fish lakes and favor poppers/frogs/articulated baitfish on the fly. |
| `conehead_streamer` | `species_allowed` | SMB, LMB, trout | SMB, trout | Cone-weighted streamers are mid-column river trout and SMB tools; river LMB use is marginal and not representative. |

## What was reviewed but intentionally not changed

These were considered for tightening and kept as-is:

- `weightless_stick_worm` kept with `L + R`. Senko-style slack-water
  presentations in river eddies and flooded slack pools are a real
  SMB/LMB river tactic (pitch-and-drift in low-current areas).
- `shaky_head_worm`, `drop_shot_worm`, `drop_shot_minnow` kept with
  `L + R`. Finesse presentations in river pools and current breaks are
  legitimate SMB tactics.
- `tube_jig` kept with `L + R`. SMB tubes in rivers are iconic.
- `texas_rigged_soft_plastic_craw` kept with `L + R`. River LMB in
  woody cover, and river SMB in limestone cover, both take T-rig craws.
- `spinnerbait` kept with LMB + SMB. SMB spinnerbait use in stained
  lakes is secondary but real.
- `swim_jig` kept with LMB + SMB. SMB swim-jig fishing in grass edges
  and river pools is legitimate.
- `suspending_jerkbait` kept with trout. Hard suspending minnow plugs
  for large brown trout in deep river pools are a real, if specialized,
  tactic.
- `casting_spoon` kept with all four species. Spoons are genuinely
  cross-species.
- `prop_bait` kept with LMB + SMB. SMB prop-bait fishing in rivers is
  a summer tactic.
- `hollow_body_frog` kept with LMB + pike (lake-only). Pike hollow-body
  frogs in heavy pad cover are a legitimate niche.
- `articulated_dungeon_streamer` kept with LMB, pike, trout (no SMB).
  Big-profile dungeon streamers for SMB exist but are edge-case; the
  archetype is anchored in pike/big-trout/big-LMB territory.
- `woolly_bugger` kept without pike. Pike woolly buggers are
  undersized; pike-scale streamers already have dedicated archetypes.
- `deceiver` kept without trout. The deceiver silhouette is too large
  for most trout water.

## Summary of catalog-wide impact

- **Lure archetype count:** unchanged at 36.
- **Fly archetype count:** unchanged at 21.
- **Appendix A id sets unchanged.**
- **Factory validators still pass** (G2, G7, P13, etc.).
- **Cross-species eligibility is tighter:** 16 total eligibility
  tightenings removed padded cross-species or cross-water entries.
- **No new catalog structure was introduced.** The existing
  `ArchetypeProfileV4` schema was sufficient for biology-first
  tightening; no structural change was needed.

## Expected downstream effect

Because the catalog now filters out padded eligibility, some
`(species, region, month, water_type)` contexts will honestly produce
fewer than 3 lures or fewer than 3 flies after Phase 2's seasonal
envelope gating + Phase 3's species/water gating is applied. Early
evidence from the existing integration and coverage tests:

- LMB great_lakes_upper_midwest m6 freshwater_lake_pond: fly slot 2
  now unfillable under the assumed wide `primary_fly_ids = allFlies`
  test payload, because five of the non-surface streamers that were
  previously LMB-eligible are now SMB/trout/pike-only.
- Pike great_lakes_upper_midwest m12 freshwater_lake_pond (narrow
  bottom + slow envelope): lure slot 2 unfillable because blade_bait
  was removed from pike eligibility; pike cold-bottom-slow inventory
  is genuinely thin in this catalog.
- v4 coverage matrix reports ~1803 engine errors across the
  9-payload × 126-context test grid, which is the per-context
  sufficiency signal Phase 4 is designed to consume.

**These are not Phase 3 bugs.** They are the exact honest inventory
signal the architecture requests ("if a context honestly supports
fewer than 3 lures or fewer than 3 flies, the engine should return
only the eligible count rather than inventing or relaxing
recommendations"). Phase 4 will audit these shortfalls context by
context and decide where the catalog honestly needs expansion vs.
where the output should truthfully carry fewer picks.

## What was intentionally not done

- **Per-context inventory sufficiency review** — Phase 4.
- **Re-population of `primary_lure_ids` / `primary_fly_ids` in seasonal
  rows** — Phase 4.
- **Engine implementation changes** — Phase 5 (including the question
  of whether the engine should tolerate fewer than 3 picks when
  honestly constrained).
- **Catalog expansion** (adding new archetypes) — only justified by
  Phase 4's sufficiency findings, not by Phase 3's honesty pruning.
- **Fallback or rescue logic to preserve integration-test assumptions**
  — explicitly forbidden.
- **Seasonal row widening to rescue thin pools** — explicitly
  forbidden; Phase 2's biology is the trusted layer.
