# Species Biological Sensibility Audit

Generated: 2026-04-23

## Scope

This audit compares catalog-level species eligibility against generated seasonal row usage for largemouth bass, smallmouth bass, northern pike, and trout. It is intentionally biological and tactical, not a selector-policy audit.

## Method

- Loaded all v4 lure and fly archetypes and all generated seasonal rows.
- Counted eligible lure/fly archetypes by species from `species_allowed`.
- Counted seasonal row authoring frequency for each species/archetype pair.
- Flagged pairings that are biologically weak, too broadly authored, dormant, or acceptable edge cases.
- Made only two catalog-level corrections where the mismatch was strong: trout was removed from `spinnerbait` and `buzzbait`.
- Did not hand-edit generated seasonal rows.

## Species Inventory

| species | seasonal rows | eligible lures | eligible flies | reviewed pairings |
| --- | ---: | ---: | ---: | ---: |
| largemouth_bass | 384 | 29 | 15 | 5 |
| smallmouth_bass | 336 | 29 | 22 | 3 |
| northern_pike | 216 | 17 | 18 | 4 |
| trout | 168 | 14 | 23 | 12 |

## High-Signal Findings

- Bass and pike catalogs are broadly sensible; most suspicious cases are not catalog failures but row ubiquity.
- Trout had two clear catalog mismatches: `spinnerbait` and `buzzbait`; both are now no longer trout-eligible.
- `casting_spoon` is biologically strong for trout and northern pike, plausible for bass, but over-authored for largemouth at 100% of rows.
- `blade_bait` and `lipless_crankbait` are acceptable trout edge/search tools, but their 100% trout row usage should be watched before Phase 4 amplifies them.
- `mouse_fly` is a strong trout keep: row usage is seasonal and biologically coherent.
- `frog_fly` and `hollow_body_frog` are biologically correct for largemouth/pike surface windows; prior absence was geometry, not species mismatch.
- `balanced_leech` is a dormant trout stillwater artifact: biologically plausible, but currently has no row path because trout rows are river-only.
- Pike-specific lures and flies look clean; the main pike watch item is whether all-row `tube_jig` usage crowds stronger pike-specific choices.

## Reviewed Pairings

| species | archetype | side | status | authored rows | row share | layer | reason | recommended action |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
| trout | spinnerbait | lure | narrow | 0 | 0.0% | both | Bass/pike safety-pin spinner, not the same biological lane as trout inline spinners; rows had it everywhere before catalog narrowing. | Applied catalog narrowing; remove from trout seasonal rows on the next source-matrix cleanup. |
| trout | buzzbait | lure | narrow | 0 | 0.0% | both | Fast surface buzzbait is a bass/pike tool; trout surface lanes are better represented by mouse, popper/slider, and small hard topwater edge cases. | Applied catalog narrowing; remove from trout seasonal rows on the next source-matrix cleanup. |
| largemouth_bass | casting_spoon | lure | seasonal-fix | 84 | 21.9% | seasonal | Biologically plausible for schooling/vertical baitfish windows, but not credible as a 100% largemouth row resident. | Keep catalog eligibility; reduce seasonal authoring to baitfish/open-water/cold or suspended windows. |
| smallmouth_bass | casting_spoon | lure | watch | 336 | 100.0% | seasonal | More defensible than largemouth in clear baitfish and current/open-water settings, but still too broadly authored at 100%. | Keep eligibility; monitor and narrow row usage if spoons over-surface in warm shallow contexts. |
| trout | casting_spoon | lure | keep | 168 | 100.0% | none | Classic trout search/flash bait and biologically sensible around baitfish, current, and cold-water windows. | No catalog change. |
| northern_pike | casting_spoon | lure | keep | 216 | 100.0% | none | Strong pike fit: flash, profile, and open-water coverage are biologically aligned. | No catalog change. |
| trout | blade_bait | lure | watch | 0 | 0.0% | seasonal | Plausible cold-water baitfish tool, but 100% row usage is broader than the biology suggests. | Keep eligibility; later reduce warm/surface-adjacent row authoring if it becomes overexposed. |
| trout | lipless_crankbait | lure | watch | 168 | 100.0% | seasonal | Can make sense for aggressive baitfish-oriented trout, but the current all-row authoring is broad. | Keep for now; consider seasonal row narrowing before any exposure boost. |
| trout | walking_topwater | lure | watch | 59 | 35.1% | none | Uncommon but plausible for large trout in summer surface-prey windows; current usage is confined to surface rows. | Keep as an edge case; do not broaden. |
| trout | popping_topwater | lure | watch | 59 | 35.1% | none | Plausible but niche trout surface bait; acceptable only because row usage is surface-seasonal rather than universal. | Keep as an edge case; monitor exposure. |
| trout | mouse_fly | fly | keep | 59 | 35.1% | none | Biologically sensible as a summer/night/low-light river surface-prey pattern; row usage is seasonal, not universal. | No catalog change. |
| trout | balanced_leech | fly | watch | 0 | 0.0% | catalog | Trout-only stillwater leech is biologically valid, but current trout recommender rows are river-only so it has no authored runtime path. | No species correction; decide later whether trout lakes enter scope or remove this dormant archetype. |
| largemouth_bass | woolly_bugger | fly | keep | 384 | 100.0% | none | Broadly viable bass fly as a small streamer/leech/bugger profile; recent geometry fixes address opportunity rather than species fit. | No catalog change. |
| smallmouth_bass | woolly_bugger | fly | keep | 336 | 100.0% | none | Excellent smallmouth river/lake fly fit across crawfish, leech, and baitfish-adjacent presentations. | No catalog change. |
| largemouth_bass | frog_fly | fly | keep | 14 | 3.6% | none | Strong summer surface/vegetation largemouth fly lane; row scarcity is intentional and tactical. | No catalog change. |
| northern_pike | frog_fly | fly | keep | 20 | 9.3% | none | Pike regularly key on surface prey near weeds; frog fly is a sensible niche topwater option. | No catalog change. |
| largemouth_bass | hollow_body_frog | lure | keep | 14 | 3.6% | none | Canonical vegetation/surface largemouth bait and now has honest surface-slot opportunity. | No catalog change. |
| northern_pike | hollow_body_frog | lure | watch | 0 | 0.0% | seasonal | Biologically plausible for pike, but catalog eligibility is dormant because rows currently never author it. | Keep eligibility; consider adding only to summer weed/topwater pike rows if product wants pike frog visibility. |
| trout | popper_fly | fly | watch | 59 | 35.1% | none | Less canonical than mouse for trout, but plausible as a summer surface attractor and not broadly authored outside surface windows. | Keep for now; monitor exposure after daily-condition logic. |
| trout | deer_hair_slider | fly | watch | 59 | 35.1% | none | Waking/skating deer-hair surface fly is an edge trout lane; acceptable as long as it stays seasonal. | Keep as a niche edge case. |
| northern_pike | tube_jig | lure | watch | 216 | 100.0% | seasonal | Pike will eat tubes, but pike-specific swimbaits, spoons, bucktails, jerkbaits, and jig/plastic are stronger defaults. | Keep eligibility; consider reducing row ubiquity only if it crowds pike-specific archetypes. |
| largemouth_bass | bladed_jig | lure | keep | 384 | 100.0% | none | Strong largemouth stained-water baitfish/crawfish tool; low exposure is tactical/slot-related, not species mismatch. | No catalog change. |
| smallmouth_bass | bladed_jig | lure | keep | 336 | 100.0% | none | Less universal than largemouth but still valid around grass, rock, baitfish, and stained-water reaction windows. | No catalog change. |
| trout | game_changer | fly | keep | 168 | 100.0% | none | Large articulated baitfish streamer is biologically sensible for predatory trout, though not every trout day. | No catalog change. |

## Generated Row Follow-Up

These pairings are still present in generated rows even though catalog eligibility now blocks them. Clean the source matrix rather than editing generated files by hand.

| species | archetype | side | authored rows | row share |
| --- | --- | --- | ---: | ---: |


## Recommended Corrections Before Phase 4

### Applied Catalog Corrections

- Removed `trout` from `spinnerbait.species_allowed`.
- Removed `trout` from `buzzbait.species_allowed`.

### Recommended Seasonal Source-Matrix Cleanup

- Remove `spinnerbait` from trout seasonal source rows.
- Remove `buzzbait` from trout seasonal source rows.
- Reduce `casting_spoon` in largemouth rows from universal to baitfish/open-water/cold/suspended contexts.
- Watch, but do not yet remove, trout `blade_bait`, `lipless_crankbait`, `walking_topwater`, and `popping_topwater`.

## Bottom Line

The recommender is not broadly biologically unsound by species. The strongest pre-Phase-4 correction is trout catalog narrowing for bass-style wire baits. Most other concerns are seasonal-source breadth issues or acceptable edge cases that should be monitored after daily-condition logic is added.
