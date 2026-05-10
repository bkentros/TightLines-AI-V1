# QA-2 Catalog Truth Audit

Date: 2026-05-08  
Scope: documentation-first truth audit of active daily-picks 2x2 lure and fly catalog metadata.  
Behavior change: none.

## Executive Summary

The active catalog is structurally valid and complete for the current closed ID sets: 39 lures and 31 flies. The requested TypeScript, catalog validation, factory invariant, generated seasonal integrity, and daily-picks harness checks pass. No catalog file was edited because no hard invariant break was found.

The catalog is not yet truthful enough to treat all active metadata as biologically final for spring, summer, and fall launch quality. The largest launch-critical risk is not a missing hard gate; it is broad catalog truth combining with broad seasonal row authoring. Several fly streamers and leech-family flies are globally eligible across all 1,104 seasonal rows, making them powerful variety and dominance risks. Several lure profiles also carry species or water eligibility that is unused today or looks like old coverage padding rather than truthful identity.

Hard positives:

- `is_surface` matches `column: surface`; no harness surface leaks were observed.
- Trout lake/pond remains blocked by generated rows even though one dormant profile is trout lake-only.
- Pike-specific inventory now exists for the large pike tube, pike jerkbait, pike swimbait, bucktail, pike jig/plastic, and pike flies.
- `glidebait` remains narrowly bass lake/pond and Big Fish only.

Launch-critical red flags:

- Broad fly profiles (`clouser_minnow`, `articulated_baitfish_streamer`, `articulated_dungeon_streamer`, `game_changer`, `rabbit_strip_leech`, `jighead_marabou_leech`, `lead_eye_leech`, `feather_jig_leech`) are authored into every generated row. That is not catalog-invalid, but it is biologically too broad for spring/summer/fall recommendation credibility without row-level proof.
- `spinnerbait` allows trout in the catalog, even though rows do not currently author it for trout. That is a species-truth issue waiting for a future row mistake.
- `tube_jig` allows pike even though pike rows were cleaned to use `large_pike_tube`; this now looks like stale compatibility padding.
- Bass-coded crankbaits and `lipless_crankbait` are still authored into many pike rows; pike can eat them, but their current breadth looks more like inherited coverage than pike-first recommendation truth.
- Surface/topwater profiles are internally truthful but compressed by grouping: `topwater_open` mixes walking, popping, buzzbait, prop bait, and large pike topwater. This can hide meaningful variety and make surface picks feel less tactical.
- Dead active inventory exists: `drop_shot_worm`, `popping_topwater`, `prop_bait`, `balanced_leech`, and `warmwater_worm_fly` have zero generated row usage.

## Methodology

Read first:

- `docs/audits/recommender-2x2/quality-audit-master-plan.md`
- `docs/recommender-2x2-master-agent-handoff.md`
- `docs/recommender-2x2-renovation-plan.md`
- `docs/audits/recommender-2x2/catalog-profile-audit.md`
- `docs/audits/recommender-2x2/seasonal-row-audit.md`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts`
- `scripts/audit/daily-picks-quality-harness.ts`

Static checks:

- Imported the live lure/fly catalog and counted active IDs.
- Compared each profile's species, water, column, pace, forage, clarity, condition tags, goal tags, surface flag, grouping, and how-to-fish variants against real-world lure/fly identity.
- Scanned generated seasonal row usage for total and launch-month usage. Launch months are March-November; winter months received structural sanity only.
- Treated seasonal row breadth as evidence, not proof of correctness.

Harness checks:

- Baseline all-scenario sweep.
- `windy_stained_reaction`
- `dirty_elevated_river` limited to freshwater river.
- `calm_low_light_surface_stress`
- `heat_clear_bright`

Important scoring context:

- `scoreCandidate.ts` uses condition tags, goal tags, clarity, forage, baseline column/pace, and a surface caution penalty as bounded score additions.
- Catalog `clarity_strengths` is not a hard gate.
- Row-authored IDs plus hard gates decide eligibility before scoring.

## Launch-Critical Catalog Risks

Observed issues:

- Broad all-row fly authoring creates dominance pressure. `clouser_minnow`, `articulated_baitfish_streamer`, `articulated_dungeon_streamer`, `game_changer`, `rabbit_strip_leech`, `jighead_marabou_leech`, `lead_eye_leech`, and `feather_jig_leech` each appear in all 1,104 generated rows and all 828 launch-month row contexts.
- Harness exposure confirms concentration: all-scenario top-slot leaders were `fly:clouser_minnow` at 3,389 top selections and `fly:articulated_dungeon_streamer` at 2,745; all-slot leaders were `fly:articulated_dungeon_streamer` at 4,880 and `fly:clouser_minnow` at 4,686.
- `articulated_dungeon_streamer` is Big Fish/dirty/runoff/cover inventory, but its all-row authoring lets it overperform even outside narrow trophy-streamer contexts.
- Several warmwater profiles carry pike or trout eligibility in catalog but are either not authored for that species or look like fallback compatibility: `spinnerbait` includes trout; `tube_jig` includes pike; `soft_jerkbait` and `blade_bait` include all four species.
- Dead active profiles reduce honest variety: `drop_shot_worm`, `popping_topwater`, `prop_bait`, `balanced_leech`, and `warmwater_worm_fly` have zero row usage.

Hypotheses:

- Broad fly eligibility is partially real-world defensible at the archetype level, but all-row seasonal authoring likely reflects old 3:3 coverage pressure.
- The selector's high adjacent-day repeat rate is amplified by grouping and scoring concentration, not just by deterministic seed behavior.

## Profile-By-Profile Audit Table

Legend: `OK` means catalog metadata is truthful enough for launch if seasonal rows remain honest. `Review` means plausible but needs QA-3 row/trace proof. `Fix later` means a narrow catalog change is recommended after row compatibility tests. `Dead` means active catalog inventory has zero current generated row usage.

| Profile | Fields Audited | Truth Judgment | Exposure / Padding Risk | Later Action |
| --- | --- | --- | --- | --- |
| `weightless_stick_worm` | Bass-only lake/river, upper medium/slow, worm, all clarity, `clear_subtle`/`heat_finesse`, all-purpose, non-surface; copy matches slack-line fall. | OK. Species corrected to bass-only; water broad but credible around shallow cover. | Launch usage 130 rows; can be useful heat-finesse inventory, not dominant in harness. | Keep; QA-3 should confirm it does not appear as bottom drag inventory. |
| `carolina_rigged_stick_worm` | Bass lake-only, bottom slow, worm/baitfish, clear/stained, `clear_subtle`/`cold_slow`, all-purpose, non-surface; copy matches dragging rig. | OK for lake/pond. | Very broad all-year lake authoring; launch usage 270. Could be old coverage in shallow warm rows. | Row audit spring/fall cold/deep lake uses; no catalog fix now. |
| `shaky_head_worm` | Bass lake/river, bottom slow, worm, all clarity, `clear_subtle`/`cold_slow`, all-purpose; copy truthful. | OK, though dirty strength is only credible as profile/cover rather than visibility. | Low launch usage 70; not over-dominant. | Consider stained/clear only later if dirty outputs overclaim finesse visibility. |
| `drop_shot_worm` | Bass lake/river, mid slow, worm, clear/stained, heat/clear finesse, all-purpose; copy truthful. | OK catalog identity. | Dead: zero generated row usage. | Decide in QA-3 whether to author into summer clear/heat bass rows or remove from active catalog. |
| `drop_shot_minnow` | Bass lake/river, mid slow baitfish, clear/stained, heat/clear finesse, all-purpose; copy truthful. | OK. | Extremely broad all-row bass usage; selected heavily in heat clear bright. | QA-3 should verify it is not the default all-season bass finesse filler. |
| `ned_rig` | Bass/trout lake/river, bottom slow craw/worm, all clarity, cold/clear all-purpose; copy truthful for Ned. | Review. Bass/SMB truth strong; trout river lure use is plausible but niche. Trout lake is irrelevant because rows are river-only. Dirty clarity may be too broad. | Very broad launch usage 514 including all trout rows. | QA-3 trout row trace: prove trout Ned is intentional lure-side support, not padding. |
| `tube_jig` | Bass/pike lake/river, bottom slow/medium craw/baitfish, clear/stained, cold/clear all-purpose; copy truthful for bass/SMB tube. | Fix later. Bass/SMB truth strong; pike species allowance is stale now that `large_pike_tube` exists. | Launch usage 540 for bass/SMB only; no pike row usage. Harness all-slot count 2,650, high dominance. | Remove `northern_pike` after compatibility test proves no pike rows rely on it. |
| `texas_rigged_soft_plastic_craw` | Bass lake/river bottom slow craw, all clarity, cover/cold all-purpose; copy truthful. | OK. | Broad usage but not top-dominant. | Keep; QA-3 should confirm winter-only cold rows are not overusing it. |
| `football_jig` | Bass lake-only bottom slow/medium craw, all clarity, cold/cover, reliable + Big Fish; copy truthful. | OK. | Lake-only broad all-year usage; launch 184. | Keep; row audit should confirm hard-bottom/ledge seasons not generic pond filler. |
| `compact_flipping_jig` | LMB lake/river bottom slow craw/bluegill, stained/dirty, cover/dirty, Big Fish; copy truthful. | OK. | Broad all-year LMB usage; credible cover tool. | Keep. |
| `finesse_jig` | Bass lake/river bottom slow craw/worm, clear/stained, cold/clear all-purpose; copy truthful. | OK. | Broad usage but biologically reliable. | Keep. |
| `swim_jig` | Bass lake/river mid medium/fast bluegill/baitfish, stained/dirty, cover/warming, versatile; copy truthful. | OK. | Very broad all bass rows; may be generic moving-bait padding in cold/clear rows. | QA-3 trace cold clear spring/fall rows. |
| `hair_jig` | SMB/trout river bottom slow/medium baitfish/worm, clear/stained, current/cold/clear, all-purpose; copy truthful. | OK. | Launch 252, top-selected 641 all scenarios; credible river cold/current tool. | Keep; monitor trout vs SMB overuse. |
| `inline_spinner` | SMB/trout/pike lake/river mid medium/fast baitfish, clear/stained, current/open-water, all-purpose/search; copy truthful. | OK. | Broad but real multi-species search lure; selected often. | Keep; QA-3 should ensure pike rows do not prefer it over pike-first bucktail too often. |
| `spinnerbait` | All four species lake/river mid medium/slow, baitfish/bluegill, stained/dirty, wind/dirty/cover, versatile; copy truthful for bass/pike. | Fix later. Trout species allowance is not truthful enough for product recommendations, though current rows do not author trout. | Very broad launch usage 702 for bass/pike; trout is dormant risk. | Remove trout from `species_allowed`; add test that no trout row authors `spinnerbait`. |
| `bladed_jig` | Bass/pike lake/river mid medium/fast, baitfish/craw, stained/dirty, wind/dirty/cover, versatile + Big Fish; copy is yo-yo but more blade-bait-like than steady ChatterBait. | Review. Species/pike scope plausible but row breadth needs proof; how-to variants overemphasize snap/yo-yo. | High harness dominance: all-slot 2,726; windy top lure 920. | QA-3 trace by species/water; later copy tweak toward steady retrieve with deflection. |
| `paddle_tail_swimbait` | Bass/pike lake/river mid medium/fast baitfish/bluegill, all clarity, open/warming, versatile; copy truthful. | OK. | Broad row usage; not harness dominant. | Keep; row audit pike should compare with large pike swimbait. |
| `glidebait` | Bass lake-only mid slow/medium baitfish/bluegill, clear/stained, clear/open/cover, Big Fish high risk; copy truthful. | OK. | Narrow launch usage 5 rows; intentionally not all-purpose. | Keep; QA-3 should preserve narrow Big Fish lane. |
| `soft_jerkbait` | All species lake/river upper medium/slow baitfish, clear/stained, clear/open, versatile; copy truthful. | Review. Bass/SMB truth strong; pike/trout can be plausible but broad all-four eligibility needs row proof. | Launch usage 678; likely coverage padding in some pike/trout contexts. | QA-3 trace pike/trout rows before narrowing. |
| `suspending_jerkbait` | Bass/trout lake/river mid medium baitfish, clear/stained, clear/cold, all-purpose/search; copy truthful. | Review. Bass/SMB strong; trout river lure plausible; lake eligibility okay for bass only because trout lake rows absent. | High dominance: top-slot 2,179; all-slot 3,263. | QA-3 exposure trace by species/month; verify not all-purpose default. |
| `squarebill_crankbait` | Bass/pike lake/river upper medium/fast baitfish/bluegill, stained/dirty, cover/dirty/wind, versatile; copy truthful. | Review. Bass truth strong; pike and river scope may be overbroad. | Launch usage 574 including pike. | QA-3 pike row audit; consider pike removal if pike-first alternatives cover same windows. |
| `flat_sided_crankbait` | Bass/pike lake/river upper medium baitfish, clear/stained, clear/cold, reliable; copy truthful. | Review. Bass/SMB cold crank truth strong; pike use is questionable as recommendation identity. | Launch usage 574 including pike. | QA-3 pike/fall row trace. |
| `medium_diving_crankbait` | Bass lake/river mid medium baitfish/craw, all clarity, open/warming, versatile; copy truthful. | OK. | Broad all bass usage; can be generic search filler. | Keep; QA-3 check river credibility by region/current. |
| `deep_diving_crankbait` | Bass/pike lake-only bottom medium baitfish/craw, all clarity, open/cold, versatile; copy truthful. | Review. Bass lake truth strong; pike deep crankbait eligibility is less pike-first. | Launch usage 351 including pike lake. | QA-3 pike lake rows; consider pike removal if large swimbait/spoon/jerkbait cover. |
| `lipless_crankbait` | Bass/pike lake/river mid medium/fast baitfish/craw, stained/dirty, wind/warming/open, versatile; copy truthful. | Review. Bass grass/flats truth strong; pike/river scope can be real but broad. | High exposure in windy and calm scenarios; launch usage 658. | QA-3 spring/fall pike and river trace. |
| `blade_bait` | All species lake/river bottom slow/medium baitfish, all clarity, cold/open, reliable; copy truthful. | Review. Cold water multi-species truth is plausible, but all-four/all-water/all-clarity is powerful. | Largest lure row usage: 1,035 total, 759 launch. | QA-3 prove cold/open row specificity; consider narrowing dirty clarity later. |
| `casting_spoon` | Pike/trout lake/river mid medium baitfish, clear/stained, open/wind, versatile; copy truthful. | OK. | Broad but credible for pike/trout; not bass. | Keep. |
| `small_floating_trout_plug` | Trout river surface medium/slow, surface prey/baitfish, clear/stained, calm/low-light, Big Fish high risk; copy truthful. | OK but narrow. | Launch usage 59, May-Sept only. | QA-3 verify May rows and daily gates keep it rare. |
| `walking_topwater` | Bass/pike lake/river surface medium, surface prey/baitfish, clear/stained, calm/low-light/open, Big Fish high risk; copy truthful. | Review. Bass truth strong; pike truth plausible; river scope needs row proof. | Launch usage 277; group compressed with other topwaters. | Split group later or QA-3 trace variety first. |
| `popping_topwater` | Bass lake/river surface medium/slow, surface prey, clear/stained, calm/low-light, reliable + high risk; copy truthful. | OK catalog identity. | Dead: zero row usage. | Either author into narrow bass surface rows or remove from active catalog. |
| `buzzbait` | Bass/pike lake/river surface fast/medium, surface prey/baitfish, stained/dirty, low-light/wind/dirty, Big Fish high risk; copy truthful. | Review. LMB truth strong; SMB and pike plausible but should be narrow. Fast pace and surface identity are correct. | Launch usage 313; wind tag can compete with non-surface pike reaction if surface gate open. | QA-3 region/month row audit; no catalog pace change. |
| `prop_bait` | Bass lake/river surface medium, surface prey, clear/stained, calm/low-light, Big Fish high risk; copy truthful. | OK catalog identity. | Dead: zero row usage. | Author narrow calm/low-light bass rows or remove. |
| `hollow_body_frog` | LMB/pike lake-only surface slow/medium, surface prey, all clarity, calm/low-light/cover, Big Fish high risk; copy truthful. | Review. LMB truth strong; pike frog is plausible but should be vegetation-specific. | Launch usage 25, LMB only despite pike catalog allowance. | QA-3 surface rows; consider pike removal if no pike rows intentionally use it. |
| `large_profile_pike_swimbait` | Pike lake/river mid medium/slow baitfish/bluegill, all clarity, open/cover, Big Fish; copy truthful. | OK. | Broad pike all-year usage; pike-first and needed. | Keep; maybe add `wind_reaction` only if trace shows wind misses pike swimbait unfairly. |
| `pike_jerkbait` | Pike lake/river mid medium/fast baitfish, clear/stained, wind/open, Big Fish; copy truthful. | OK. | Broad pike usage; credible pike-first tool. | Keep. |
| `large_bucktail_spinner` | Pike lake/river mid medium/fast baitfish/bluegill, clear/stained, wind/open, Big Fish/search; copy truthful. | OK. | Broad pike usage; correct pike reaction/search profile. | Keep. |
| `large_pike_topwater` | Pike catalog lake/river surface medium/slow, surface prey/baitfish, clear/stained, calm/low-light, Big Fish high risk; copy uses walking cadence. | Review. Pike surface truth okay in narrow warm/calm windows; river catalog allowance is unused and should be proven. | Launch usage 20, lake only. Grouped as generic `topwater_open`. | Consider lake-only catalog if QA-3 finds no honest pike river surface rows. |
| `pike_jig_and_plastic` | Pike lake/river bottom slow/medium baitfish/bluegill, stained/dirty, cold/dirty, reliable + Big Fish; copy currently copied from football jig and mentions flat head. | Fix later for copy. Metadata is useful pike-first cold/dirty bottom inventory. | Broad pike usage; not biologically broken. | Rewrite how-to variants to pike jig/plastic rather than football jig language; add copy assertion. |
| `large_pike_tube` | Pike lake/river bottom slow/medium baitfish/bluegill, all clarity, cold/current/cover, reliable + Big Fish; copy truthful. | OK. | Narrow 41 row usage, mostly winter/river, launch 14. | Keep; QA-3 ensure it covers pike river cold/slow without reviving generic `tube_jig`. |
| `clouser_minnow` | All species lake/river mid medium/fast baitfish, clear/stained, current/open, all-purpose/search; copy truthful. | Review. Very real multi-species fly, but all-row authoring is too broad for product truth. | All 1,104 rows; top fly in windy and all-scenario top slots. | QA-3 row narrowing by species/water/season; no catalog species fix yet. |
| `deceiver` | Bass/pike lake/river mid medium baitfish, all clarity, open, versatile; copy truthful. | OK. | Broad warmwater/pike use but not trout. | Keep; dirty clarity only matters as bounded bonus. |
| `bucktail_baitfish_streamer` | SMB/pike/trout river-only mid medium/slow baitfish, clear/stained, current/open, versatile; copy truthful. | OK. | River-only usage 333 launch; species credible. | Keep. |
| `slim_minnow_streamer` | SMB/trout river upper medium/fast baitfish, clear, clear/current, reliable; copy truthful. | OK. | Narrow launch usage 197; good clear-water inventory. | Keep. |
| `articulated_baitfish_streamer` | All species lake/river mid medium/slow baitfish, stained/dirty, open/runoff, versatile + Big Fish; copy truthful. | Review. All-four species plausible, but all-row authoring is too broad. | All 1,104 rows; windy all-slot 930. | QA-3 row narrowing by dirty/runoff/current contexts. |
| `articulated_dungeon_streamer` | All species lake/river mid slow/medium baitfish/bluegill, stained/dirty, runoff/cover, Big Fish high risk; copy truthful. | Review / launch-critical. Truthful as a trophy streamer, not truthful as universal row inventory. | All 1,104 rows; all-slot harness leader 4,880; selected heavily even in calm/heat. | QA-3 highest-priority row and score trace. |
| `game_changer` | All species lake/river mid medium baitfish, all clarity, open, versatile + Big Fish; copy truthful. | Review. Real cross-species streamer, but trout/pike/bass all-row use may be too generic. | All 1,104 rows; high exposure 2,386 all-slot. | QA-3 row narrowing or group separation. |
| `woolly_bugger` | All species catalog lake/river mid slow/medium leech, all clarity, cold/current, reliable; copy truthful. | Review. Excellent bass/trout/SMB fly; pike catalog allowance now appears stale because pike rows no longer author it. | 888 rows, no pike row usage. | Consider removing pike from catalog after compatibility test. |
| `rabbit_strip_leech` | All species lake/river bottom slow/medium leech, stained/dirty, cold/cover, reliable + Big Fish; copy truthful. | Review. Strong fly, but all-species/all-row authoring is too broad, especially pike/trout lake context. | All 1,104 rows. | QA-3 row narrowing by cold/deep/stained use. |
| `jighead_marabou_leech` | All species lake/river bottom slow/medium leech, all clarity, cold/current, reliable; copy truthful. | Review. Useful but all-row authoring likely padding. | All 1,104 rows; dirty river selected. | QA-3 seasonal narrowing. |
| `lead_eye_leech` | All species lake/river bottom slow leech, all clarity, cold/clear, reliable; copy has winter bass language. | Review / copy risk. Metadata is cold/clear leech; copy overmentions winter bass and may not fit trout/pike. | All 1,104 rows; all-slot 2,043. | QA-3 trace plus later copy variants by generic leech language. |
| `feather_jig_leech` | All species lake/river bottom medium/slow leech, all clarity, warming/current, versatile; copy has bass wording. | Review. Warming/current leech can be useful, but all-row and all-species breadth is excessive. | All 1,104 rows; calm scenario top 250. | QA-3 row narrowing; later copy genericize. |
| `balanced_leech` | Trout lake-only bottom slow leech, clear/stained, cold/clear, reliable; copy truthful for stillwater. | Dead / lower priority. Trout lake is unsupported, so this profile cannot currently appear. | Zero row usage. | Remove from active catalog or keep only if trout lake/pond product is deliberately added later. |
| `zonker_streamer` | SMB/trout lake/river mid medium/slow baitfish, clear/stained, open/current, versatile; copy truthful. | Review. Trout lake eligibility is harmless today but not needed; SMB lake is credible. | Launch usage 378. | QA-3 confirm trout rows are river-only; no urgent fix. |
| `sculpin_streamer` | SMB/trout river bottom slow baitfish/craw, all clarity, current/cold/runoff, reliable; copy truthful. | OK. | Launch usage 252; good river truth. | Keep. |
| `sculpzilla` | SMB/trout river bottom slow/medium baitfish/craw, stained/dirty, runoff/current, Big Fish; copy truthful. | OK. | Launch usage 252; dirty river top exposure. | Keep. |
| `muddler_sculpin` | SMB/trout river bottom slow, clear/stained, current/cold, reliable; copy variant mentions lakes/ponds despite river-only catalog. | Fix later for copy. Metadata OK; one how-to variant conflicts with water type. | Launch usage 252. | Rewrite third variant to river-only; add copy test for river-only profiles. |
| `crawfish_streamer` | SMB/trout river bottom slow crawfish, all clarity, current/clear, reliable; copy truthful. | OK, though trout crawfish is region/size dependent. | Launch usage 138; not dominant. | Keep; QA-3 trout region checks. |
| `warmwater_crawfish_fly` | Bass/SMB lake/river bottom slow/medium crawfish, all clarity, cover/cold, reliable; copy truthful. | OK. | Launch usage 172; good warmwater-specific profile. | Keep. |
| `warmwater_worm_fly` | Bass/SMB lake/river bottom slow/medium worm, all clarity, cover/cold, reliable; copy truthful. | OK catalog identity. | Dead: zero row usage. | Decide whether to author as warmwater fly finesse inventory or remove. |
| `conehead_streamer` | SMB/trout river mid medium baitfish, clear/stained, current/open, versatile; copy truthful. | OK. | Launch usage 252; credible river streamer. | Keep. |
| `pike_bunny_streamer` | Pike lake/river mid slow/medium baitfish/bluegill, stained/dirty, wind/cover/cold, Big Fish; copy truthful. | OK. | Broad pike usage; pike-first. | Keep. |
| `large_articulated_pike_streamer` | Pike lake/river mid slow/medium baitfish, stained/dirty, wind/cover, Big Fish high risk; copy truthful. | OK. | Broad pike usage; pike-first. | Keep. |
| `unweighted_baitfish_streamer` | All species lake/river upper medium/slow baitfish/bluegill, clear/stained, clear/open, versatile; copy truthful. | Review. Good surface-adjacent/subsurface streamer, but all-four species broadness needs row proof. | Launch usage 678; high all-slot exposure 1,792. | QA-3 row narrowing in pike/trout contexts. |
| `baitfish_slider_fly` | All species lake/river upper medium/fast baitfish/bluegill, all clarity, open/warming, versatile; copy truthful. | Review. Not surface, but rides high; trout usage is now surface-row limited by previous cleanup. | Launch usage 633; all-slot calm 396. | QA-3 confirm non-surface cleanup held and pike/bass use is not generic. |
| `popper_fly` | All species catalog lake/river surface medium/slow, surface prey/bluegill, clear/stained, calm/low-light, all-purpose/search; copy truthful. | Review. Trout catalog allowance exists, but generated rows currently do not author trout. Pike/bass truth okay. | Launch usage 288, no trout row usage. | Consider removing trout from catalog unless future trout popper row is intentional. |
| `deer_hair_slider` | All species catalog lake/river surface medium/fast, surface prey/baitfish, all clarity, calm/low-light, Big Fish high risk; copy truthful. | Review. Trout catalog allowance exists but no trout row usage; dirty clarity broad. | Launch usage 313; calm top exposure. | QA-3 surface row credibility; consider trout removal. |
| `foam_gurgler_fly` | Bass/SMB/pike lake/river surface medium/slow, surface prey/baitfish, all clarity, calm/low-light, reliable/search; copy truthful. | OK with row gating. | Launch usage 247; surface gate prevents leaks. | Keep; row audit pike river surface. |
| `frog_fly` | LMB/pike lake-only surface slow/medium, surface prey, all clarity, calm/low-light/cover, Big Fish high risk; copy truthful. | Review. Like hollow frog: truthful over cover, not generic surface. | Launch usage 45. | QA-3 verify pike/LMB rows are vegetation/cover-style, not open water. |
| `mouse_fly` | Trout river surface slow/medium, surface prey, clear/stained, calm/low-light, Big Fish high risk; copy truthful. | OK but very narrow. | Launch usage 59, May-Sept; May may be too early in some regions. | QA-3 focus on May trout surface rows and low-light gate. |
| `pike_flash_fly` | Pike lake/river upper medium/fast baitfish, all clarity, wind/open, Big Fish/search; copy truthful. | OK. | Launch usage 102; good pike wind/open inventory. | Keep. |

## Species-Specific Findings

Largemouth bass:

- Catalog is mostly credible. Best launch risks are surface scope and broad moving-bait row usage, not species truth.
- LMB frog profiles are correct only if rows imply cover/vegetation windows. Catalog itself cannot express vegetation beyond `cover_ambush`.
- Dead bass surface lures (`popping_topwater`, `prop_bait`) reduce honest surface variety.

Smallmouth bass:

- SMB inherits many LMB topwater and moving-bait tools. Walking/popping/prop topwater and buzzbait can be credible in narrow warm windows, but QA-3 should prove SMB rows are not merely copied from LMB.
- SMB Big Fish river contexts show goal-reasonless samples in cold/heat scenarios, suggesting not enough honest Big Fish-tagged inventory survives some row/scenario combinations.

Northern pike:

- Pike-first catalog coverage is much better after the pike-specific additions.
- Catalog still carries bass-coded crankbait and buzzbait paths into pike launch rows. Some are plausible, but pike-first alternatives should usually beat them unless row/condition traces prove otherwise.
- `large_pike_topwater` is catalog river-eligible but currently row-authored only in lakes. That should be resolved one way or the other later.

Trout:

- Trout river-only row invariant holds.
- Trout lure-side catalog has plausible narrow tools (`hair_jig`, `inline_spinner`, `suspending_jerkbait`, `blade_bait`, `casting_spoon`, `small_floating_trout_plug`, `ned_rig`), but `ned_rig` and `blade_bait` need row-trace proof to avoid feeling bass-derived.
- Trout fly streamers are mostly credible, but the all-row broad articulated/leech authoring makes trout outputs vulnerable to trophy-streamer overuse.
- `balanced_leech` is trout lake-only and therefore dead in the current product.

## Water-Type Credibility Findings

Observed issues:

- Lake/pond and river are often both enabled at catalog level. That is acceptable only when rows stay precise.
- River-enabled bass/pike crankbaits (`squarebill_crankbait`, `flat_sided_crankbait`, `lipless_crankbait`) need QA-3 proof by species and region.
- `large_pike_topwater` allows river but has no river row usage.
- `muddler_sculpin` is river-only but one how-to variant says "lakes and ponds."
- `balanced_leech` is lake-only trout, while trout lake/pond is unsupported.

Lower-priority winter-only notes:

- Winter rows structurally pass; no deep winter tuning was done.
- Several winter broad pools contribute to all-year usage counts, but launch-month findings above are enough to justify QA-3 focus first.

## Goal-Tag Findings: All-Purpose vs Big Fish

Observed issues:

- All-purpose inventory is generally abundant and tends to select reliable/search profiles.
- Big Fish inventory exists, but some Big Fish contexts still select no goal-tagged candidate. Baseline harness found 129 goal-reasonless contexts across all scenarios; `heat_clear_bright` alone found 14, all sampled from SMB river Big Fish launch-adjacent windows.
- `popping_topwater` combines `reliable_action` with `high_risk_high_reward`, which may be semantically mixed. It can be right for a popper, but should be tested through actual calm/low-light all-purpose vs Big Fish traces.
- `articulated_dungeon_streamer` and other Big Fish flies have so much row availability that Big Fish can become "big articulated streamer by default."

Hypothesis:

- Some all-purpose vs Big Fish sameness is legitimate in cold constrained river rows, but launch Big Fish contexts should usually have at least one selected `goal:big_fish:*` reason when credible larger-profile inventory exists.

## Condition-Tag Findings: Do Daily Tags Have Honest Catalog Matches?

Observed positives:

- `windy_stained_reaction` produced no tagless contexts, no goal-reasonless contexts, and no surface leaks.
- `dirty_elevated_river` produced no tagless contexts, no goal-reasonless contexts, and lifted believable dirty/current/runoff inventory.
- Surface tags did not resurrect seasonally or daily invalid surface profiles.

Observed issues:

- Baseline all-scenario sweep found 1,082 tagless contexts.
- `calm_low_light_surface_stress` found 618 tagless contexts, mostly when seasonal rows correctly closed surface and selected non-surface Big Fish inventory had no calm/low-light tags.
- `heat_clear_bright` found 232 tagless contexts, heavily sampled from pike contexts; pike has little honest `heat_finesse` inventory, so this may be a scenario/species mismatch rather than catalog failure.

Interpretation:

- The condition-tag vocabulary is useful, but some scenario templates do not have honest matches for every species and row. QA-3 should distinguish "no honest catalog match exists" from "row omitted the honest match."

## Variety/Exposure Risks From Catalog Grouping

Observed grouping compression:

- `fly:baitfish_streamer` has 9 profiles.
- `fly:leech_bugger` has 6 profiles.
- `lure:crankbait` has 5 profiles.
- `lure:topwater_open` has 5 profiles.
- `lure:spinner_vibration` has 4 profiles.
- `lure:worm_finesse` has 4 profiles.

Exposure findings:

- All-scenario harness repeated adjacent-day exact sets in 11,116 of 12,312 contexts over a seven-day exposure simulation.
- Set B reuse was low overall at 50 of 12,312 comparisons, but dirty elevated river Big Fish produced 49 of those reviews.
- Dominance is concentrated in a small set of broad profiles: `clouser_minnow`, `articulated_dungeon_streamer`, `suspending_jerkbait`, `bladed_jig`, `tube_jig`, `game_changer`, and `lead_eye_leech`.

Implication:

- Catalog grouping is coarse enough to hide distinct tactical choices. However, row/truth cleanup should happen before selector tuning so the variety layer rotates among honest candidates.

## Immediate Red Flags

Spring/summer/fall launch blockers or near-blockers:

- All-row broad fly streamers and leeches are the top catalog truth risk.
- `spinnerbait` trout catalog eligibility should be removed later unless an explicit trout spinnerbait strategy is desired.
- `tube_jig` pike catalog eligibility should be removed later now that `large_pike_tube` exists.
- `articulated_dungeon_streamer` needs row/score trace follow-up because it behaves like universal Big Fish inventory.
- `pike_jig_and_plastic` how-to-fish copy is factually copied from football jig language.
- `muddler_sculpin` how-to-fish copy mentions lakes/ponds despite river-only water eligibility.

Lower-priority or not launch-blocking:

- Dead active profiles should be cleaned or authored later, but zero row usage prevents them from causing bad picks today.
- Winter rows need structural sanity only for this pass; they passed.

## Hypotheses Requiring Seasonal-Row Or Score-Trace Follow-Up

- Broad fly authoring is the main source of fly dominance, especially for `clouser_minnow` and `articulated_dungeon_streamer`.
- Pike pike-first profiles may be present but not always scoring above bass-coded crankbait/spinnerbait inventory under windy/dirty windows.
- SMB river Big Fish lacks enough honest Big Fish-tagged candidates in some heat/cold launch-adjacent contexts.
- Surface rows may be biologically correct at boolean level but too broad at individual-ID level, especially May trout mouse/surface and pike/LMB frog rows.
- Adjacent-day repetition may be partially selector-driven, but catalog/row concentration should be reduced before tuning selection weights.

## Recommended QA-3 Seasonal Row Audit Focus

1. Launch-month broad fly inventory: audit every row where all-row streamers/leeches appear, starting with `articulated_dungeon_streamer`, `clouser_minnow`, `game_changer`, `rabbit_strip_leech`, `lead_eye_leech`, and `feather_jig_leech`.
2. Pike launch rows: verify pike-specific lures/flies beat bass-coded crankbaits and spinnerbait except where the latter are genuinely better.
3. SMB river Big Fish: inspect March-November rows with goal-reasonless or identical all-purpose/Big Fish outputs.
4. Surface launch rows: audit LMB/SMB/pike topwater IDs by region/month, with special attention to buzzbait, hollow-body frog, frog fly, and large pike topwater.
5. Trout May-September surface rows: verify `mouse_fly`, `small_floating_trout_plug`, and surface fly usage are narrow and low-light/calm compatible.
6. Dead inventory decision pass: either author narrow row windows for zero-usage profiles or mark them inactive/remove them from the active catalog.

## Narrow Fixes Recommended Later, With Proposed Tests

Do not apply these in QA-2 unless Brandon explicitly starts a tuning/fix pass.

1. Remove trout from `spinnerbait.species_allowed`.
   - Rationale: not truthful enough as a mainstream trout recommendation.
   - Test: generated seasonal integrity asserts no trout row authors `spinnerbait`; catalog validation asserts spinnerbait species are LMB/SMB/pike only.

2. Remove pike from `tube_jig.species_allowed`.
   - Rationale: pike tube coverage should use `large_pike_tube`.
   - Test: generated seasonal integrity asserts no pike row authors `tube_jig`; catalog validation asserts `large_pike_tube` is pike-only and `tube_jig` is bass/SMB only.

3. Rewrite `pike_jig_and_plastic.how_to_fish_variants`.
   - Current issue: copy references football-jig mechanics instead of a pike jig/plastic.
   - Test: catalog copy test rejects "football head" / "flat head" wording for `pike_jig_and_plastic`.

4. Rewrite `muddler_sculpin.how_to_fish_variants[2]`.
   - Current issue: river-only catalog copy mentions lakes and ponds.
   - Test: generic water-copy assertion for river-only profiles, or a focused assertion for `muddler_sculpin`.

5. Decide zero-usage active profile policy.
   - Profiles: `drop_shot_worm`, `popping_topwater`, `prop_bait`, `balanced_leech`, `warmwater_worm_fly`.
   - Test: add generated seasonal audit that flags active profiles with zero row usage unless explicitly documented as future/dormant inventory.

6. Split overly coarse presentation groups only after QA-3 row cleanup.
   - Candidate splits: `topwater_open`, `baitfish_streamer`, `leech_bugger`, `crankbait`, `spinner_vibration`.
   - Test: selector fixture proving Set B and adjacent-day rotation can choose distinct tactical groups when strong alternatives exist.

## Baseline Check Results

Commands run:

```bash
git status --short
npx tsc --noEmit
deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts
deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7
deno run -A scripts/audit/daily-picks-quality-harness.ts --scenario=windy_stained_reaction --exposure-days=7
deno run -A scripts/audit/daily-picks-quality-harness.ts --scenario=dirty_elevated_river --water=freshwater_river --exposure-days=7
deno run -A scripts/audit/daily-picks-quality-harness.ts --scenario=calm_low_light_surface_stress --exposure-days=7
deno run -A scripts/audit/daily-picks-quality-harness.ts --scenario=heat_clear_bright --exposure-days=7
```

Results:

- `npx tsc --noEmit`: passed.
- Deno validation/invariant/integrity tests: 60 passed, 0 failed.
- Harness baseline all scenarios: 12,312 contexts, 0 failures, 0 surface leaks, 0 thin pools, 50 Set B reuse reviews, 30 identical goal-set reviews, 11,116 adjacent-day repeat reviews.
- `windy_stained_reaction`: 2,208 contexts, 0 failures, 0 surface leaks, 0 tagless contexts, 0 goal-reasonless contexts.
- `dirty_elevated_river` river-only: 1,272 contexts, 0 failures, 0 surface leaks, 49 Set B reuse reviews.
- `calm_low_light_surface_stress`: 2,208 contexts, 0 failures, 0 surface leaks, 618 tagless contexts.
- `heat_clear_bright`: 2,208 contexts, 0 failures, 0 surface leaks, 232 tagless contexts, 14 goal-reasonless contexts.

