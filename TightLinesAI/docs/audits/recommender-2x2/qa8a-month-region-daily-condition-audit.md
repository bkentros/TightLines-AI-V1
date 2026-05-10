# QA8A Month/Region Biology + Daily Condition Normalization Audit

Date: 2026-05-09

Scope: QA8A audited March-November daily-picks 2x2 behavior across species, region, month, water type, clarity, goal, and daily-condition normalization. This pass added audit-tool output only. No catalog inventory, seasonal CSV rows, generated row logic, selector policy, scoring weights, or biological gates were tuned.

## Files Changed

- `scripts/audit/daily-picks-archived-weather-replay.ts`
- `docs/audits/recommender-2x2/qa8a-month-region-daily-condition-audit.md`

## Audit Tooling Added

The archived-weather replay harness now supports:

- `--normalization`: prints the normalized `DailyScenario`, row geometry, selected candidate catalog column/pace, row-match status, condition reasons, goal reasons, and surface gate for each replay fixture.
- `--comparisons`: runs controlled one-input comparison fixtures for wind, hourly daylight wind, light, temperature state, clarity, activity score, runoff/current, missing runoff, and low-confidence weather reliability.

The comparison fixture set includes one explicit proof that valid hourly daylight wind beats scalar wind fallback: the fixture uses scalar wind 3 mph and hourly daylight wind 12 mph, and normalizes to `wind=breezy daylight_wind=12`.

## Methodology

1. Re-ran the launch harness across all March-November generated rows.
2. Re-ran archived-weather replay against the 18 fixed QA6/QA7 fixtures.
3. Added normalized replay output and checked selected candidate column/pace against row column/pace.
4. Added controlled comparison fixtures where one daily input changes at a time.
5. Ran a structural launch-row summary over generated seasonal rows.
6. Re-ran typecheck and recommender test suites.

## Month/Region Row Findings

Generated launch rows audited:

- Total March-November rows: 828
- `largemouth_bass`: 288 rows, split evenly across lake/pond and river; 170 surface-capable rows.
- `smallmouth_bass`: 252 rows, split evenly across lake/pond and river; 107 surface-capable rows.
- `northern_pike`: 162 rows, split evenly across lake/pond and river; 36 surface-capable rows.
- `trout`: 126 rows, river-only; 59 surface-capable rows.

Structural checks found:

- `badColumn=0`: every `column_baseline` is inside `column_range`.
- `badPace=0`: every `pace_baseline` is inside `pace_range`.
- `surfaceMismatch=0`: every `surface_seasonally_possible=true` row includes `surface` in `column_range`.
- `troutNonRiver=0`: trout remains river-only in launch rows.

Observed row geometry is broadly plausible for launch:

- LMB rows allow the widest surface and upper-column summer/fall warm-water spread.
- SMB rows stay narrower in early cold-water lake/river rows and open surface mainly in credible late-spring/summer windows.
- Pike rows keep surface windows narrower than bass and lean mid/upper reaction lanes in warmer months.
- Trout rows remain river streamer/topwater rows only, with runoff/current lanes handled through daily conditions rather than lake borrowing.

No launch-critical month/region row invariant break was found.

## Normalization Findings

Observed correct behavior:

- Wind uses daylight mean correctly when hourly daylight wind is available.
- Missing wind does not become calm; surface stays conservative.
- Calm + low light + active score emits `calm_surface` and `low_light_surface` only when seasonal surface is possible.
- Suppressed activity closes surface and emits no daily tags even on calm low-light input.
- Clear bright conditions emit `clear_subtle`; stained/dirty windy or breezy conditions emit reaction/vibration tags.
- Cold, warming, cooling/shock, and heat-limited states normalize into distinct thermal tags.
- Elevated/blown-out river conditions emit `current_swing`; unknown runoff does not.
- Trout elevated runoff emits `runoff_streamer`; non-trout elevated river comparison emitted `current_swing` but not `runoff_streamer`.
- Pressure is normalized into scenario diagnostics but remains conservative; no pressure scoring change was introduced.
- Low reliability produces `confidence=low`; missing runoff produces `missing=runoff confidence=medium`.

Replay detail checks found:

- Selected row column/pace mismatches: 0.
- Selected surface candidates while surface gate was `closed`: 0.
- Selected surface candidates while surface gate was `caution`: 0.

## Daily-Condition Impact Findings

Daily conditions materially changed outputs in both replay and controlled comparisons:

- Calm low-light LMB lake opened surface and selected surface/upper inventory such as `wake_bait`, `walking_topwater`, `popper_fly`, `foam_gurgler_fly`, `deer_hair_slider`, and `mouse_fly`.
- Windy stained LMB lake closed surface and moved to `squarebill_crankbait`, `spinnerbait`, `bladed_jig`, and baitfish streamer lanes.
- Dirty/elevated LMB river remained subsurface after the QA7 surface-caution fix: `squarebill_crankbait` / `bladed_jig` and baitfish streamer flies.
- SMB elevated river changed from jerkbait/muddler lanes into `lipless_crankbait`, `big_smallmouth_tube`, `woolly_bugger`, `sculpin_streamer`, and `sculpzilla` lanes.
- Pike windy/stained fixtures split across pike-first reaction tools: `pike_spinnerbait` and `large_bucktail_spinner`, with pike-first flies.
- Pike clear/calm Big Fish selected `pike_glidebait` plus `weedless_spoon`, while AP stayed more search-oriented with `inline_spinner` and `shallow_minnowbait`.
- Trout runoff selected runoff/current streamer inventory while low-light trout Big Fish selected `small_floating_trout_plug` and `mouse_fly`.

Thermal tags do affect score reasons and some honorable choices, but their output impact is lighter than wind/surface/clarity/current in the current fixture set. This looks conservative, not broken, but QA8B should decide whether heat-limited bright-water bass needs more visible finesse movement.

## AP vs Big Fish Condition Response

Archived replay after QA8A tooling:

- Fixtures: 18
- Goal runs: 36
- AP/BF identical fixture sets: 0
- Adjacent-day exact repeats: 1
- Broad fly selected share: 0.431

AP and Big Fish are separating sensibly under daily conditions:

- AP commonly keeps reliable search tools: `inline_spinner`, `suspending_jerkbait`, `flat_sided_crankbait`, `clouser_minnow`, and similar inventory.
- Big Fish moves toward upside tools when the row and daily tags support it: `wake_bait`, `walking_topwater`, `mouse_fly`, `big_smallmouth_tube`, `magnum_jerkbait`, `pike_glidebait`, and larger pike/trout streamers.
- Daily condition tags are shared by both goals, but goal reasons remain distinct: AP gets `reliable_action` / `versatile_search`; Big Fish gets `big_fish_upside` / `high_risk_high_reward`.

No AP/BF selector-policy break was found.

## Proven Issues

No hard invariant break was found in QA8A.

Confirmed remaining launch risks:

- Broad flies remain over-represented in real-weather replay: broad fly selected share is 0.431. This is consistent with QA6/QA7 and still looks like row authoring plus broad truthful tags rather than a daily-condition normalization bug.
- Adjacent-day exact repeats remain real, not only synthetic: archived replay still has one SMB Great Lakes lake AP repeat from 2025-05-07 to 2025-05-08, and launch harness adjacent-day repeats remain high.
- Thermal tags have lighter visible selection impact than wind/surface/current/clarity. This is not proven wrong, but heat/cold comparison fixtures should be reviewed in QA8B before any scoring change.
- Launch harness still reports 14 identical AP/BF sets out of 4617 row/scenario pairs, concentrated in thin or constrained contexts. This is not a QA8A normalization bug, but it belongs in the exposure/variety follow-up.

## Tests and Harnesses Run

- `git status --short`
- `npm run check:seasonal-matrix`
- `npm run gen:seasonal-rows-v4`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts --normalization`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts --comparisons`

## Harness Results

Launch harness:

- Rows: 828
- Row/scenario/goal contexts: 9234
- Failures: 0
- Pool health: lure min/p10/median 6/7/17; fly min/p10/median 9/11/14; thin pools 0
- Selected condition-reason rate: 0.672
- Goal-reason rate: 0.878
- Surface leaks: 0
- Set B reuse reviews: 15/9234
- Identical AP/BF sets: 14/4617
- Adjacent-day repeated sets over 7 days: 8339
- Family-diversity violations with in-band alternatives: 0 for lures and flies in Set A and Set B

Archived replay:

- Fixtures: 18
- Goal runs: 36
- Broad fly selected share: 0.431
- AP/BF identical fixture sets: 0
- Adjacent-day exact repeats: 1

## Recommended QA8B Fix Focus

1. Add an exposure/variety pass for adjacent-day repeats, with exact-set, top-pick, family_group, and broad-fly-family diagnostics.
2. Review broad-fly row authoring by species/month/water/goal before touching weights. Prioritize rows where broad flies beat more specific inventory without strong condition or goal reasons.
3. Add heat-limited and cold-slow replay fixtures per species to decide whether thermal tags should have more visible selection impact.
4. Keep pressure diagnostic-only unless real replay evidence shows a specific pressure pattern should affect confidence or copy.
5. Preserve QA7 surface-caution behavior; QA8A found no selected surface candidates under caution in replay detail output.
6. Add automated replay assertions for the core normalization invariants proven here: hourly wind precedence, no low-light surface tags when seasonal surface is closed, no current tags on unknown runoff, and row column/pace match for selected candidates.
