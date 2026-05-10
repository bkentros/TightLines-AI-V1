# QA-3 Seasonal Row Biology and Selector Policy Audit

Date: 2026-05-08

Scope: documentation-first audit of the TightLinesAI / FinFindr daily-picks 2x2 recommender seasonal rows and selector policy. This pass focuses on spring, summer, and fall launch contexts: March, April, May, June, July, August, September, October, and November. Winter received structural sanity checks only.

No runtime, catalog, or seasonal CSV behavior was changed in this pass.

## 1. Executive summary

The daily-picks gates are structurally healthy. TypeScript passed, daily-picks tests passed, catalog and generated seasonal integrity tests passed, and every requested harness sweep reported zero failures and zero surface leaks.

The main launch risk is not hard invalid selection. The main launch risk is truthful variety: seasonal rows are broad enough that the same high-scoring families repeatedly occupy Top Pick and Honorable Mention, especially on the fly side. The current selector only gives a bonus for presentation/family diversity; it does not enforce the new product rule that Honorable Mention should use a different `family_group` from Top Pick when a valid in-band alternative exists.

Observed family-diversity breach in launch months: across 9,234 spring/summer/fall row-scenario-goal contexts, fly selections used the same Top/Honorable `family_group` 564 times even though a different-family candidate existed inside the honorable quality band. Lures did this only 2 times. This is launch-critical for product polish and recommendation credibility, especially because streamer-only fly inventory naturally clusters around baitfish/streamer families.

Seasonal rows remain biologically plausible at the hard-gate level, but several launch-critical row families still look like coverage padding rather than precise biology:

- Broad fly inventory appears in every launch row: `clouser_minnow`, `articulated_dungeon_streamer`, `articulated_baitfish_streamer`, `game_changer`, `rabbit_strip_leech`, `jighead_marabou_leech`, `lead_eye_leech`, and `feather_jig_leech` appear in all 828 spring/summer/fall rows.
- Pike rows are pike-first in their strongest selections, but still carry broad bass-coded crankbait and spinnerbait options across launch rows.
- Smallmouth river Big Fish rows still show goal-reason gaps and heavy concentration around `tube_jig`, `bladed_jig`, `clouser_minnow`, and articulated streamers.
- Surface gates are working, but surface-season rows are still broad. Surface should remain condition-driven; windy/stained pike should mean flash/reaction, not automatic surface.
- Trout rows are correctly river-only, but surface/mouse windows deserve QA-4 proof by region/month before launch.

## 2. Selector policy: how Top Pick and Honorable Mention should be chosen

### Top Pick contract

Top Pick should be chosen from hard-gated candidates only.

Required behavior:

- Use only candidates that survived species, water type, seasonal row, exclusion, column, pace, and surface gates.
- Rank by score first.
- Restrict selection to the Top Pick quality band.
- Apply deterministic variety only inside that quality band.
- Never rescue a seasonally invalid candidate.
- Never rewrite candidate profile metadata to satisfy a slot.

Current implementation status:

- `buildCandidatePool.ts` hard-gates seasonal row membership, species, water type, exclusions, column, pace, and surface.
- `selectDailyPicks.ts` selects Top Pick from the best-score quality band with deterministic jitter.
- No seasonal invalid rescue or candidate rewriting was observed.

Verdict: acceptable structurally. No code change recommended in QA-3.

### Honorable Mention contract

Honorable Mention should be chosen from the same hard-gated candidate pool.

Required behavior:

- Cannot duplicate the Top Pick ID.
- Must prefer a different `family_group` from Top Pick when a valid candidate exists inside the Honorable Mention quality band.
- Should prefer a different `presentation_group` too, but `family_group` is the stronger product rule.
- Should not drop below the quality band just to be different.
- If no different-family candidate exists inside the quality band, reuse family only with a diagnostic/review note.

Current implementation status:

- Current selector prevents duplicate Top Pick ID.
- Current selector uses a quality band.
- Current selector gives a diversity bonus, but it prioritizes different `presentation_group` before different `family_group`, and it can still choose same-family Honorable Mentions when different-family options exist in band.

Verdict: launch-critical selector policy gap. Implement in QA-4 with tests before behavior changes.

### Set B contract

Set B should provide a second credible 2x2 set, not novelty for novelty's sake.

Required behavior:

- Avoid Set A IDs when valid alternatives exist.
- Still obey family diversity and quality-band rules.
- Never use invalid seasonal or weak biological candidates for novelty.
- When alternatives are not available, keep the strong biological pick and emit a review/diagnostic reason.

Current implementation status:

- Harness reports Set B reuse reviews but no hard failures.
- Baseline all-row sweep: 50 Set B reuse reviews out of 12,312 contexts.
- Dirty elevated river sweep: 49 Set B reuse reviews out of 1,272 contexts, concentrated in river Big Fish rows.

Verdict: acceptable structurally, but Set B should inherit the family-diversity rule once QA-4 updates selector behavior.

## 3. New family-diversity rule and edge cases

Rule: on each side, Top Pick and Honorable Mention should not share `family_group` when a valid different-family candidate exists inside the Honorable Mention quality band.

This applies to lures and flies. For flies, because the product is streamer-only and many flies are baitfish-based, this rule should not force weak biological variety. The right behavior is:

- Prefer different `family_group` inside band.
- Prefer different `presentation_group` after satisfying family diversity.
- If every in-band candidate shares the Top Pick family, allow same-family Honorable Mention.
- Emit a diagnostic/review note such as `family_diversity_unavailable` with side, Top Pick ID, family, band size, and available families.
- Never use a seasonal invalid, water invalid, species invalid, or out-of-band weak candidate merely to look different.

Observed launch evidence:

| Metric | Lures | Flies |
| --- | ---: | ---: |
| Same Top/HM family in launch contexts | 2 | 564 |
| Same Top/HM family with a different-family in-band alternative | 2 | 564 |
| Same Top/HM presentation in launch contexts | 984 | 2,772 |

The row-authored launch pools are not inherently too thin for family diversity. Across 828 spring/summer/fall rows, authored lure and fly pools each had at least 6 distinct families per row. The current issue is mostly selector policy plus score concentration, not missing row inventory.

## 4. Spring/summer/fall seasonal biology findings

Launch row inventory:

- Total rows: 1,104.
- Spring/summer/fall rows: 828.
- Launch rows by species: largemouth bass 288, smallmouth bass 252, northern pike 162, trout 126.
- Launch rows by water: 351 lake/pond rows, 477 river rows.

Launch surface row counts:

| Species | Lake/pond surface rows | River surface rows | Launch surface total |
| --- | ---: | ---: | ---: |
| Largemouth bass | 102 | 68 | 170 |
| Smallmouth bass | 56 | 51 | 107 |
| Northern pike | 20 | 16 | 36 |
| Trout | 0 | 59 | 59 |

Observed issue: row pools are intentionally broad, but several broad IDs appear in all or most launch rows. This weakens biological specificity and increases dominance:

| ID | Launch row presence | Audit classification |
| --- | ---: | --- |
| `clouser_minnow` | 828/828 | Observed issue, broad fly inventory |
| `articulated_dungeon_streamer` | 828/828 | Observed issue, broad fly inventory |
| `articulated_baitfish_streamer` | 828/828 | Observed issue, broad fly inventory |
| `game_changer` | 828/828 | Observed issue, broad fly inventory |
| `rabbit_strip_leech` | 828/828 | Observed issue, broad fly inventory |
| `jighead_marabou_leech` | 828/828 | Observed issue, broad fly inventory |
| `lead_eye_leech` | 828/828 | Observed issue, broad fly inventory |
| `feather_jig_leech` | 828/828 | Observed issue, broad fly inventory |
| `woolly_bugger` | 666/828 | Hypothesis: still too broad outside pike |
| `baitfish_slider_fly` | 633/828 | Observed issue if treated as broad surface/slider coverage |
| `deer_hair_slider` | 313/828 | Mostly surface-window dependent; needs row proof |
| `popper_fly` | 288/828 | Mostly surface-window dependent; needs row proof |
| `spinnerbait` | 702/828 | Observed pike/bass carryover risk |
| `squarebill_crankbait` | 574/828 | Observed pike/bass carryover risk |
| `flat_sided_crankbait` | 574/828 | Observed pike/bass carryover risk |
| `lipless_crankbait` | 658/828 | Observed pike/bass carryover risk |
| `buzzbait` | 313/828 | Surface-window and species-scope risk |
| `large_pike_tube` | 14/828 | Hypothesis: potentially underused pike-first river tool |
| `mouse_fly` | 59/828 | Trout surface-window risk; needs region/month proof |
| `small_floating_trout_plug` | 59/828 | Trout surface-window risk; needs region/month proof |

## 5. Species-specific findings

### Largemouth bass

Observed: largemouth pools are healthy and broad. Largemouth harness sweep had zero failures and zero surface leaks. Pool health was strong: lure min/p10/median 14/14/17; fly min/p10/median 10/10/12.

Observed issue: the top selections concentrate around generalist or high-scoring profiles:

- Top flies: `articulated_dungeon_streamer` 1,139, `clouser_minnow` 1,108.
- Top lures: `suspending_jerkbait` 889, `bladed_jig` 816, `tube_jig` 763.

Hypothesis: largemouth surface rows are broadly plausible in warm launch months, but frog/buzzbait/walking/popping/prop options should remain bounded by month, region, and low-light/shallow-cover biology. Current hard surface gates are preventing daily surface leaks, so this is a seasonal-row refinement rather than a broken invariant.

Proposed fix type: seasonal row edit after QA-4 scoring traces identify which rows actually over-select surface or same-family choices.

### Smallmouth bass

Observed: smallmouth harness sweep had zero failures and zero surface leaks. Pool health was strong: lure min/p10/median 15/16/18; fly min/p10/median 11/11/17.

Observed issue: smallmouth Big Fish river rows show goal-reason gaps, especially in cold-clear and heat-clear launch contexts. Sample review queues repeatedly include smallmouth river `big_fish` contexts where selected candidates lacked goal reasons.

Observed issue: top and most-selected lures concentrate around `tube_jig` and `bladed_jig`; top flies concentrate around `clouser_minnow`, `articulated_dungeon_streamer`, `sculpzilla`, `game_changer`, and leeches. These are biologically plausible families, but the row/selector combination can feel repetitive.

Hypothesis: smallmouth river Big Fish needs sharper upside reasons: larger baitfish streamer, craw/sculpin, wake/slider only in credible warm low-light windows, and restraint around buzzbait/topwater.

Proposed fix type: scoring trace needed, then seasonal row edit and goal-tag review.

### Northern pike

Observed: pike harness sweep had zero failures and zero surface leaks. Pool health is thinner on lures than bass but still structurally safe: lure min/p10/median 7/8/12; fly min/p10/median 11/11/14.

Observed good behavior: pike-first tools do surface in selection:

- Top lures include `large_bucktail_spinner` 504, `pike_jig_and_plastic` 468, `large_pike_tube` 328, `large_profile_pike_swimbait` 280.
- Top flies include `large_articulated_pike_streamer` 195 and `pike_bunny_streamer` 181.

Observed issue: pike launch rows still carry bass-coded options broadly:

- `spinnerbait` appears in all 162 pike launch rows.
- `squarebill_crankbait`, `flat_sided_crankbait`, and `lipless_crankbait` each appear in 118 pike launch rows.
- `flat_sided_crankbait` was the 11th most-selected pike item across all slots; `spinnerbait` was the 12th top-selected pike item.

Hypothesis: these tools can be credible in some pike contexts, but the row scope is too broad unless each has a pike-first reason: flash/reaction, shallow weeds, stained water, spring/fall temperature windows, or river-specific current/ambush logic.

Proposed fix type: pike seasonal row edit after QA-4 selector traces; do not solve by broadening catalog metadata.

### Trout

Observed: trout rows are river-only and structurally healthy. Trout harness sweep had zero failures and zero surface leaks. Pool health: lure min/p10/median 6/6/6; fly min/p10/median 15/15/17.

Observed issue: trout lures are thin but stable; top lures concentrate around `suspending_jerkbait`, `hair_jig`, and `inline_spinner`.

Observed issue: trout flies remain broad and streamer-heavy, with `clouser_minnow`, `articulated_dungeon_streamer`, `lead_eye_leech`, and `game_changer` all prominent.

Hypothesis: trout mouse/surface rows are credible only in narrow warm, calm/low-light, big-fish windows, with strong regional caution. `mouse_fly` and `small_floating_trout_plug` appear in 59 launch trout river rows from May through September. May should receive special QA-4 proof because it can be excellent in some systems and premature in others.

Proposed fix type: seasonal row edit for trout surface windows; selector/scoring trace to verify whether surface choices are only selected under matching daily tags.

## 6. Water-type credibility findings

Observed acceptable:

- Trout rows are river-only.
- No harness surface leak occurred in lake/pond or river contexts.
- Candidate pools stayed above thin thresholds for all species and water types.

Observed issue:

- Pike river rows still show Set B reuse in dirty elevated river Big Fish contexts. Dirty elevated river sweep had 49 Set B reuse reviews out of 1,272 contexts, mostly pike and largemouth river Big Fish.
- Several pike river rows rely on broad reaction families instead of clearly pike-first river tools.
- Warmwater river rows include lake-credible crankbaits and spinnerbaits widely. That can be valid, but row authorship should distinguish current, bank cover, depth, and stained-water conditions rather than using broad lake/river carryover.

Proposed fix type: seasonal row edit and scoring trace needed.

## 7. Surface-window findings

Observed good behavior: all harness sweeps reported zero surface leaks. The daily surface gate is doing its job.

Observed issue: surface-season rows are broad, and surface-capable IDs appear in many launch rows:

- `buzzbait` appears in 313 launch rows.
- `baitfish_slider_fly` appears in 633 launch rows.
- `deer_hair_slider` appears in 313 launch rows.
- `popper_fly` appears in 288 launch rows.
- `mouse_fly` and `small_floating_trout_plug` appear in 59 launch trout rows.

Hypothesis: row-level surface possibility is probably too permissive for some shoulder-month and river contexts, especially pike and trout. However, because daily gates prevented surface leaks, this should be handled as QA-4/QA-5 row refinement rather than an emergency invariant fix.

Proposed fix type: seasonal row edit, with tests asserting no surface candidate appears when `surface_seasonally_possible` is false and no surface choice appears unless the daily context allows surface.

## 8. Broad fly inventory findings

Observed launch-critical issue: broad flies are present in every spring/summer/fall row:

- `clouser_minnow`
- `articulated_dungeon_streamer`
- `articulated_baitfish_streamer`
- `game_changer`
- `rabbit_strip_leech`
- `jighead_marabou_leech`
- `lead_eye_leech`
- `feather_jig_leech`

Harness dominance evidence:

- Baseline all-row top selected: `clouser_minnow` 3,389; `articulated_dungeon_streamer` 2,745; `lead_eye_leech` 1,243; `game_changer` 825.
- Baseline all-row most selected: `articulated_dungeon_streamer` 4,880; `clouser_minnow` 4,686; `game_changer` 2,386; `lead_eye_leech` 2,043.
- Windy/stained top selected: `clouser_minnow` 969, `articulated_baitfish_streamer` 354, `game_changer` 264.
- Dirty elevated river top selected: `articulated_dungeon_streamer` 409, `clouser_minnow` 319, `sculpzilla` 227, `sculpin_streamer` 220.

Observed issue: this creates biological plausibility at the cost of specificity. Most of these flies are defensible somewhere, but not all of them should be active everywhere across all species, water types, months, and regions.

Proposed fix type: seasonal row edit. Do not solve by weakening catalog truth or by adding scoring penalties globally.

## 9. Pike-first row credibility findings

Observed pike-first strengths:

- Pike-specific lures and flies are selected frequently enough to prove the system can surface them.
- `large_bucktail_spinner`, `pike_jig_and_plastic`, `large_profile_pike_swimbait`, `large_pike_tube`, `large_articulated_pike_streamer`, and `pike_bunny_streamer` all appear meaningfully in pike results.

Observed pike-first risks:

- `spinnerbait` in all pike launch rows is too broad unless rows justify shallow weeds, flash, stained water, or aggressive pike ambush windows.
- Bass-coded crankbait carryover is broad: squarebill, flat-sided, and lipless crankbaits appear in 118 pike launch rows.
- `large_pike_tube` appears in only 14 launch rows, all pike river, while broader bass-coded reaction tools carry much wider pike coverage.
- Pike wind should be flash/reaction first, not automatic surface. Current daily gates avoid surface leaks, but row-level surface options should stay narrow.

Classification: launch-critical spring/summer/fall row credibility issue. Proposed fix type: seasonal row edit plus trace review.

## 10. Family-group diversity risk by row/species/side

Observed launch selection risk:

| Species | Lure same-family Top/HM with in-band alternative | Fly same-family Top/HM with in-band alternative |
| --- | ---: | ---: |
| Largemouth bass | 2 | 266 |
| Smallmouth bass | 0 | 86 |
| Northern pike | 0 | 160 |
| Trout | 0 | 52 |

Observed launch scenario risk:

| Scenario | Lure same-family with alt | Fly same-family with alt |
| --- | ---: | ---: |
| `cold_clear_suppressed` | 0 | 82 |
| `windy_stained_reaction` | 0 | 160 |
| `calm_low_light_surface_stress` | 2 | 81 |
| `missing_wind_low_confidence` | 0 | 0 |
| `heat_clear_bright` | 0 | 0 |
| `dirty_elevated_river` | 0 | 241 |

Representative patterns:

- `articulated_dungeon_streamer` paired with `articulated_baitfish_streamer` in `streamer_articulated` even when a different-family fly was in band.
- `lead_eye_leech` paired with `jighead_marabou_leech` or `rabbit_strip_leech` in `leech_family` even when a different-family fly was in band.

Classification: launch-critical selector rule/test issue.

## 11. Set B and adjacent-day variety implications

Observed:

- Baseline all-row Set B reuse reviews: 50/12,312 contexts.
- Largemouth sweep: 8/4,224.
- Smallmouth sweep: 0/3,696.
- Pike sweep: 41/2,376.
- Trout sweep: 1/2,016.
- Dirty elevated river sweep: 49/1,272.

Observed adjacent-day repeated sets:

- Baseline all-row: 11,116 repeated adjacent-day sets.
- Largemouth: 3,831.
- Smallmouth: 3,175.
- Pike: 2,264.
- Trout: 1,846.
- Dirty elevated river: 1,204.
- Calm low light: 1,944.
- Windy stained: 1,726.
- Heat clear bright: 2,092.

Interpretation: Set B reuse is limited but concentrated in dirty elevated river Big Fish contexts. Adjacent-day repetition is high because deterministic variety is not yet providing meaningful day-to-day change for many stable contexts. That is not necessarily biologically wrong, but it should be a product decision. Family-diversity enforcement will improve within-set variety but will not by itself solve adjacent-day repetition.

Proposed fix type: selector rule/test for family diversity first; later exposure/rotation policy if product wants stronger adjacent-day freshness.

## 12. Launch-critical red flags

1. Selector does not yet enforce the new family-diversity rule. This produced 564 fly same-family Top/Honorable selections in launch contexts despite in-band different-family alternatives.

2. Broad fly row authoring is too permissive for launch specificity. Eight fly IDs appear in all 828 spring/summer/fall rows.

3. Pike launch rows still carry bass-coded reaction and crankbait options broadly. This is biologically defensible in some situations but too broad without row-level pike-first rationale.

4. Smallmouth river Big Fish contexts still show goal-reason gaps, especially in cold-clear and heat-clear launch rows.

5. Surface gates are healthy, but surface-season rows are broad. Trout `mouse_fly` and `small_floating_trout_plug` need region/month proof, especially May.

6. Dirty elevated river Big Fish contexts produce most Set B reuse reviews. This points to a pool/score concentration problem, not a hard validity failure.

## 13. Recommended narrow fixes for QA-4/QA-5

QA-4 selector/test focus:

- Implement Honorable Mention family-priority selection inside the existing quality band.
- Keep duplicate-ID prevention.
- Do not drop below the quality band for family diversity.
- Add a diagnostic/review reason when same-family reuse is unavoidable.
- Apply the same rule to Set B selection.
- Preserve current hard-gate behavior and deterministic scoring.

QA-4 trace focus:

- Add or run score traces for same-family fly pairs in dirty elevated river, windy stained, and calm low-light launch contexts.
- Trace pike rows where `spinnerbait`, `flat_sided_crankbait`, `squarebill_crankbait`, or `lipless_crankbait` outrank pike-first tools.
- Trace smallmouth river Big Fish rows with goal-reasonless selections.
- Trace trout May surface rows involving `mouse_fly` and `small_floating_trout_plug`.

QA-5 seasonal row focus:

- Narrow all-row fly authoring. Keep broad baitfish/leech tools only where species, forage, water, and month justify them.
- Pike rows: reduce bass-coded crankbait carryover; promote pike-first flash, swimbait, bucktail, tube, and pike streamer logic where biologically appropriate.
- Smallmouth river rows: sharpen Big Fish inventory around sculpin/craw/baitfish/tube use with real upside reasons.
- Largemouth surface rows: keep frog/buzzbait/walking/popping/prop options in credible shallow, warm, cover, low-light, or stained windows.
- Trout rows: keep river-only model; narrow mouse/surface to warm low-light big-fish contexts by region/month.

Catalog follow-up after row proof:

- Revisit QA-2 catalog concerns only with row evidence: `spinnerbait` trout allowance, `tube_jig` pike allowance, surface-family grouping granularity, and dead active inventory.

## 14. Tests that should be added before behavior changes

Selector tests:

- Honorable Mention chooses a different `family_group` from Top Pick when a different-family candidate exists inside the honorable quality band.
- Honorable Mention may reuse family when every in-band candidate shares the Top Pick family.
- Honorable Mention must not select outside the quality band solely for family diversity.
- Family diversity outranks presentation diversity when the two conflict.
- Set B avoids Set A IDs and still applies family diversity when valid in-band alternatives exist.
- Selector emits or records a review/diagnostic reason when same-family reuse is unavoidable.

Invariant tests:

- No seasonal invalid rescue: a candidate not authored in the row cannot be selected even if it would improve variety.
- No candidate profile rewriting: selected metadata must match catalog metadata.
- Surface candidate cannot be selected when daily context or seasonal row closes surface.

Seasonal integrity tests:

- Launch rows should report broad fly IDs whose row presence exceeds a chosen review threshold.
- Pike launch rows should flag bass-coded crankbait/spinnerbait carryover for review by water type, month, and region.
- Trout surface rows should be reviewable by month/region, especially May.
- Dirty elevated river Big Fish contexts should have enough in-band non-overlap for Set B or emit a precise diagnostic.

## Baseline commands and results

Static and test checks:

| Command | Result |
| --- | --- |
| `git status --short` | Dirty worktree with pre-existing image/script/docs changes; QA-3 doc added in this pass |
| `npx tsc --noEmit` | Passed |
| `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__` | Passed: 129 passed, 0 failed |
| `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts` | Passed: 60 passed, 0 failed |

Harness sweeps:

| Command | Rows | Contexts | Failures | Surface leaks | Key note |
| --- | ---: | ---: | ---: | ---: | --- |
| `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7` | 1,104 | 12,312 | 0 | 0 | Broad fly dominance; 50 Set B reuse reviews |
| `deno run -A scripts/audit/daily-picks-quality-harness.ts --species=largemouth_bass --exposure-days=7` | 384 | 4,224 | 0 | 0 | High broad-fly concentration; 8 Set B reuse reviews |
| `deno run -A scripts/audit/daily-picks-quality-harness.ts --species=smallmouth_bass --exposure-days=7` | 336 | 3,696 | 0 | 0 | Big Fish goal-reason gaps; 23 identical AP/BF sets |
| `deno run -A scripts/audit/daily-picks-quality-harness.ts --species=northern_pike --exposure-days=7` | 216 | 2,376 | 0 | 0 | 41 Set B reuse reviews; pike-first tools selected but broad carryover remains |
| `deno run -A scripts/audit/daily-picks-quality-harness.ts --species=trout --water=freshwater_river --exposure-days=7` | 168 | 2,016 | 0 | 0 | River-only; lure pool thin but safe |
| `deno run -A scripts/audit/daily-picks-quality-harness.ts --scenario=dirty_elevated_river --water=freshwater_river --exposure-days=7` | 636 | 1,272 | 0 | 0 | 49 Set B reuse reviews; broad streamer/reaction concentration |
| `deno run -A scripts/audit/daily-picks-quality-harness.ts --scenario=calm_low_light_surface_stress --exposure-days=7` | 1,104 | 2,208 | 0 | 0 | Surface gate safe; low condition-reason rate 0.410 |
| `deno run -A scripts/audit/daily-picks-quality-harness.ts --scenario=windy_stained_reaction --exposure-days=7` | 1,104 | 2,208 | 0 | 0 | Good condition-reason rate 0.907; reaction dominance |
| `deno run -A scripts/audit/daily-picks-quality-harness.ts --scenario=heat_clear_bright --exposure-days=7` | 1,104 | 2,208 | 0 | 0 | Pike heat-clear tagless reviews; SMB Big Fish goal gaps |

