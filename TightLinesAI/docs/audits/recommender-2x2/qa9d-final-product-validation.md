# QA9D Final Product Validation

Date: 2026-05-10
Repo: TightLinesAI
Branch: `main`
Validated commit: `9a9a315903b10374c942a7cf1f13b59b80c623c4`

## Executive Summary

QA9D validated the official committed daily-picks 2x2 recommender state after the QA1-QA9C audit/tuning series and post-merge 5-band How's Fishing work.

Launch recommendation: ready to launch from a recommender quality standpoint.

No launch blockers were found. The final committed state preserves the critical product rules:

- Daily-picks returns exactly four slots: Lure of the Day, Honorable Mention Lure, Fly of the Day, Honorable Mention Fly.
- Set A is stable for the same exact context/date until local midnight.
- Set B is available exactly once, stored separately, and does not fully reuse Set A.
- Top Pick and Honorable Mention preserve family diversity when in-band alternatives exist.
- No selected candidate leaked outside row column/pace envelopes.
- No surface picks appeared when seasonal surface was closed.
- No caution-gate surface selections appeared.
- AP/BF separation remains healthy.
- Daily conditions are visible in score reasons and selected outputs.
- No weak novelty picks were introduced.
- The 5-band score labels do not directly affect daily-picks lure/fly behavior.

Known non-blocking watch items remain:

- Broad-fly exposure is high, but explainable by the streamer-only fly model and current catalog shape.
- Set A/B overlap remains visible, but constrained by quality bands and no-weak-novelty rules.
- Adjacent-day repeats remain when candidates are clear winners or valid pools are narrower.

## Official State

Commands run:

```bash
git fetch --all --prune
git status -sb
git rev-parse HEAD
git rev-parse origin/main
git log --oneline -8
```

Findings:

- Current branch: `main`
- HEAD: `9a9a315903b10374c942a7cf1f13b59b80c623c4`
- `origin/main`: `9a9a315903b10374c942a7cf1f13b59b80c623c4`
- Worktree before QA9D report creation: clean
- No uncommitted recommender changes were present before this report.

Recent commits:

```text
9a9a315 Add daily-picks final validation report
0c9db2b Dashboard polish: transparent misty-pines + bigger illustration + per-tile hi/lo
e38944f Align How's Fishing summary copy with 5-band score labels
78a7904 Add daily-picks audit harnesses and QA reports
6a47165 Finalize daily-picks recommender QA tuning
fd0fac5 assets: update recommender lure and fly PNGs
3037814 Field-edition dashboard redesign + 5-band scoring
ba0e7ec Complete daily-picks 2x2 recommender renovation
```

## Baseline Verification

Commands run:

```bash
npm run check:seasonal-matrix
npm run gen:seasonal-rows-v4
npm run check:seasonal-matrix
npx tsc --noEmit
deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__
deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts
```

Results:

- Seasonal matrix check: passed before and after generation.
- Seasonal generation: wrote 384 LMB, 336 SMB, 216 pike, and 168 trout rows.
- `DATA_QUALITY_WARN`: 0
- TypeScript: passed.
- Typed recommender Deno suite: 142 passed, 0 failed.
- Catalog/factory/generated integrity suite: 69 passed, 0 failed.

## Harness Results

### Launch-Month Quality Harness

Command:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7
```

Results:

- Rows: 828
- Contexts: 9,234
- Failures: 0
- Pool health: lures min/p10/median `6/7/17`; flies `6/9/13`
- Thin pools `<4`: 0
- Geometry mismatches: 0
- Surface leaks: 0
- Caution-gate surface selections: 0
- Family-diversity violations: 0
- Set B reuse review contexts: 44/9,234
- Identical AP/BF sets: 3/4,617
- Adjacent-day repeated sets over 7 days: 7,242

### All-Month Quality Harness

Command:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7
```

Results:

- Rows: 1,104
- Contexts: 12,312
- Failures: 0
- Pool health: lures min/p10/median `6/6/16`; flies `6/9/12`
- Thin pools `<4`: 0
- Geometry mismatches: 0
- Surface leaks: 0
- Caution-gate surface selections: 0
- Family-diversity violations: 0
- Set B reuse review contexts: 95/12,312
- Identical AP/BF sets: 4/6,156
- Adjacent-day repeated sets over 7 days: 9,737

## Exposure Audit

### Launch Months

Command:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-audit --exposure-days=7
```

Results:

- Rows: 828
- Contexts: 9,234
- Day runs: 129,276
- Adjacent Set A exact repeats: 19,853/55,404 (0.358)
- Adjacent Set B exact repeats: 12,831/55,404 (0.232)
- Slot ID repeat rate: 0.693
- Slot family repeat rate: 0.703
- Set A/B overlap: 31,659/64,638 (0.490)
- Set B full reuse: 0
- AP/BF identical: 6/32,319 (0.000 rounded)
- Family-diversity violations: 0
- Broad-fly watch share: 198,147/258,552 (0.766)

### All Months

Command:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-audit --exposure-days=7
```

Results:

- Rows: 1,104
- Contexts: 12,312
- Day runs: 172,368
- Adjacent Set A exact repeats: 26,514/73,872 (0.359)
- Adjacent Set B exact repeats: 16,516/73,872 (0.224)
- Slot ID repeat rate: 0.696
- Slot family repeat rate: 0.709
- Set A/B overlap: 40,325/86,184 (0.468)
- Set B full reuse: 0
- AP/BF identical: 19/43,092 (0.000 rounded)
- Family-diversity violations: 0
- Broad-fly watch share: 265,464/344,736 (0.770)

## Broad-Fly Watch Metric

### Launch Months

Command:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --broad-fly-audit --exposure-days=7
```

Results:

- Rows: 828
- Contexts: 9,234
- Fly pool health min/p10/median: `6/9/13`
- Thin fly pools `<4`: 0
- Broad fly selected slots: 28,280/36,936 (0.766)
- Broad top slots: 13,970
- Broad honorable slots: 14,310

Top broad fly selected IDs:

- `game_changer`: 5,077
- `articulated_baitfish_streamer`: 4,746
- `clouser_minnow`: 3,793
- `unweighted_baitfish_streamer`: 3,639
- `lead_eye_leech`: 2,040
- `rabbit_strip_leech`: 1,900

### All Months

Command:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --broad-fly-audit --exposure-days=7
```

Results:

- Rows: 1,104
- Contexts: 12,312
- Fly pool health min/p10/median: `6/9/12`
- Thin fly pools `<4`: 0
- Broad fly selected slots: 37,877/49,248 (0.769)
- Broad top slots: 18,710
- Broad honorable slots: 19,167

Top broad fly selected IDs:

- `game_changer`: 6,335
- `articulated_baitfish_streamer`: 6,165
- `clouser_minnow`: 4,908
- `unweighted_baitfish_streamer`: 3,705
- `rabbit_strip_leech`: 3,456
- `lead_eye_leech`: 2,967

Assessment: broad-fly exposure remains a watch item, not a launch blocker. Pool health is viable, family-diversity rules hold, and broad-fly dominance is partly structural because the fly side is streamer-only.

## Archived-Weather Replay

Command:

```bash
deno run -A scripts/audit/daily-picks-archived-weather-replay.ts
```

Results:

- Fixtures: 18
- Goal runs: 36
- Broad fly selected share: 0.528
- AP/BF identical fixture sets: 0
- Adjacent-day exact repeats: 1

Replay selections were biologically coherent across LMB, SMB, pike, and trout. Daily condition tags moved the intended inventory up: low-light surface windows produced surface/big-fish options, dirty/windy river windows produced reaction/current tools, clear/cold contexts stayed subsurface and restrained, and pike reaction contexts favored pike-first flash/spinnerbait/bucktail inventory.

## Product Response QA

Response shape and contract were verified through typed tests, response shaping inspection, replay output, and live smoke:

- Response feature: `recommender_daily_picks_2x2_future`
- Engine response version: `daily_picks_2x2_response_v1`
- Four slot keys are required and rendered:
  - `lure_of_the_day`
  - `honorable_lure`
  - `fly_of_the_day`
  - `honorable_fly`
- Diagnostics are present, including family-diversity diagnostics.
- Response includes species, water type/context, water clarity, recommendation goal, region, month, local date, scenario summary, and session metadata.
- No stale 3:3 fields are required.
- No active daily-picks color guidance is emitted.

Copy quality:

- `why_chosen` is built from actual score reasons: uncertainty, active goal fit, daily condition tags, forage, clarity, and surface gate context.
- Stale inactive goal reasons are filtered by current recommendation goal.
- `how_to_fish` comes from the selected catalog profile's factual variants.
- Buzzbait and other surface lures retain their surface/pace truth; the response shaper does not rewrite biology.
- Missing inputs and lower confidence produce a conservative uncertainty note.
- Big Fish copy is driven by active `big_fish` score reasons rather than random novelty.
- All Purpose copy is driven by reliable-action and versatile-search reasons.

Color guidance:

- `lib/colorPaletteImages.ts` explicitly notes that daily-picks 2x2 no longer sends palette guidance.
- `app/recommender.tsx` imports palette images only in the static preload list.
- `components/fishing/RecommenderView.tsx` does not render daily-picks color palette recommendations.
- Result: color guidance is inactive for daily-picks and no stale color-palette UI was found in the active recommender view.

## Image and Asset QA

Verified by the catalog validation suite and direct file/mapping inspection:

- Active new QA5B lure IDs have manifest entries, frontend mappings, and assets:
  - `compact_glidebait`
  - `magnum_jerkbait`
  - `big_smallmouth_tube`
  - `wake_bait`
  - `magnum_worm`
  - `pike_spinnerbait`
  - `weedless_spoon`
  - `shallow_minnowbait`
  - `pike_glidebait`
- Active new QA5B fly ID has manifest entry, frontend mapping, and asset:
  - `bluegill_streamer`
- `lib/lureImages.ts` and `lib/flyImages.ts` map the new IDs.
- The active test `QA-5B: new inventory has manifest, asset, and frontend image mapping` passed.
- No missing image IDs appeared in replay or live smoke outputs.

## App/UI Smoke

Commands attempted:

```bash
npx expo start --web --port 8088 --non-interactive
CI=1 npx expo start --port 8088
curl -I --max-time 10 http://localhost:8088
```

Results:

- Expo web smoke was blocked because the repo does not currently have the required `react-native-web` dependency installed for `expo start --web`.
- Native Metro smoke succeeded in CI mode:
  - Metro started on `http://localhost:8088`
  - HTTP health check returned `200 OK`
- A browser/mobile visual smoke was not run from this terminal session.

Code-level UI inspection:

- `app/recommender.tsx` exposes species, water type, clarity, and All Purpose / Big Fish setup controls.
- `components/fishing/RecommenderView.tsx` renders the daily-picks 2x2 as four cards in canonical slot order.
- Set A / Set B language is visible and understandable: first picks, second opinion, one-time alternate set, saved until local midnight.
- Images render through `getLureImage` and `getFlyImage`; missing images fall back to `IMAGE PENDING`.
- No old 3:3 UI language was found in the active `RecommenderView`.
- No active daily-picks color-palette UI was found.
- Long names are constrained with `numberOfLines` in card titles and metadata chips.

Assessment: app smoke is acceptable for launch QA, with a caveat that visual mobile layout should still be checked on device/simulator as a product release step.

## Backend and Live Smoke

Local/test-level backend smoke passed in the typed recommender suite:

- Default recommender path returns daily-picks 2x2.
- Invalid `recommendation_goal` is rejected.
- All Purpose and Big Fish sessions are separate.
- Water clarity creates separate session contexts.
- Set A repeats for the same exact context/date.
- Set B is available once.
- Repeated Set B request returns stored B.
- Local midnight expiration logic remains intact.

Live remote smoke was run using existing local env credentials without printing secrets.

All Purpose Set A smoke:

```text
LIVE_SMOKE_OK status=200 feature=recommender_daily_picks_2x2_future goal=all_purpose variant=A picks=spinnerbait,suspending_jerkbait,clouser_minnow,articulated_baitfish_streamer
```

Set B session smoke:

```text
LIVE_SETB_OK A=A/1 B=B/0 repeatStable=true fullReuse=false
```

Assessment: deployed edge function returns daily-picks 2x2 and preserves the one Set B rule for the tested account/context.

## Biological Spot Checks

Spot checks were performed from archived replay selections.

### Largemouth Bass

- Florida spring low-light lake:
  - AP: paddle-tail/swim jig and slider/pop-style flies are credible action picks.
  - BF: walking topwater/frog and deer-hair/frog fly are credible low-light surface-upside picks.
- Midwest dirty/current river Big Fish:
  - Bladed jig / compact flipping jig and weighted/current-capable flies are credible; surface stayed caution and no surface pick leaked.
- Great Lakes fall low-light lake Big Fish:
  - Wake bait / walking topwater and deer-hair/mouse fly are plausible in open low-light surface windows.

### Smallmouth Bass

- Great Lakes clear/cool lake:
  - AP stayed jerkbait/crank/craw-worm style; BF moved to bladed jig / big smallmouth tube and leech/crawfish flies.
- Great Lakes dirty river Big Fish:
  - Bladed jig / big smallmouth tube and sculpin/leech flies are credible current/dirty-water options.
- Northeast cold clear river:
  - AP suspending jerkbait/tube and sculpin/bugger; BF big tube/magnum jerkbait and leech/sculpin. Good cold-clear restraint.

### Northern Pike

- Great Lakes windy stained lake:
  - Pike spinnerbait, bucktail, pike jig, pike flash/bunny flies are pike-first and condition-credible.
- Clear calm lake Big Fish:
  - Pike glidebait and pike jig are credible clear/calm larger-profile options.
- Summer low-light lake Big Fish:
  - Large pike topwater and pike glidebait are credible in open low-light surface windows.
- Fall windy river:
  - Pike spinnerbait / bucktail and pike-first flies are credible reaction/current choices.

### Trout

- Mountain runoff river:
  - Inline spinner/casting spoon and sculpin/clouser/dungeon/game-changer streamers are credible runoff/current selections.
- July low-light river Big Fish:
  - Mouse fly appears only in a strong seasonal low-light surface context; this matches QA8B intent.
- Bright clear September river:
  - Subsurface jerkbait/spinner/spoon/soft jerkbait and clouser/game-changer/articulated baitfish selections are credible; no surface leak.
- Alaska/cold low-light river:
  - Small floating trout plug appears for BF, but mouse fly does not; cold-slow subsurface flies remain prominent.

Assessment: selected outputs make sense to an angler across species, region, month, water type, column/pace, daily conditions, AP/BF goal separation, and copy.

## Launch Readiness Classification

Launch blockers:

- None found.

Should fix before launch:

- None required by QA9D.

Watch after launch:

- Broad-fly exposure remains high. Watch user perception and future fly-side inventory breadth.
- Set A/B overlap remains visible. Current behavior is an intentional no-weak-novelty tradeoff inside quality bands.
- Adjacent-day repeats remain in narrow pools or clear-winner contexts. This is acceptable for launch, but worth monitoring.

Deferred winter polish:

- Continue watching winter row credibility as seasonal usage grows. QA8A.1/QA8A.2/QA8B found no hard invariant breaks.

No issue:

- 5-band score label work does not directly affect daily-picks.
- Daily-picks uses numeric How's Fishing score/activity inputs, not ScoreBand strings.
- Color guidance is inactive for daily-picks.

## Caveats

- Visual mobile UI was not exercised in a simulator/device from this terminal session. Metro served successfully, and UI code inspection found no stale 3:3 or color-palette path, but final release should still include a human device pass.
- Live smoke used existing local env credentials and a test account/context. It validated edge function shape and Set B behavior, but was intentionally narrow.
- Broad-fly share is a watch metric, not a blocker, because the fly side is currently streamer-only.

## Final Recommendation

Daily-picks 2x2 is launch-ready from the recommender QA standpoint.

Proceed with release confidence, while keeping broad-fly exposure, Set A/B overlap, and adjacent-day repeats on the post-launch telemetry/watchlist.
