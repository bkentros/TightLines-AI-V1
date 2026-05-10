# QA9E Final Launch Readiness

Date: 2026-05-10
Repo: TightLinesAI
Branch: `main`
Starting official commit: `1d43d4de590d4e9121d2e90c566ca99edf7a513e`

## Executive Summary

QA9E validates the current pushed daily-picks 2x2 launch path across repo state, engine tests, harnesses, archived replay, app smoke, deployed edge smoke, and biological spot checks.

Recommendation: **GO WITH CAVEATS**.

No recommender engine, catalog, seasonal row, scoring, selector, Set B, surface, or backend launch blocker was found. The only launch-facing issue discovered was stale onboarding copy that still said "Three lures and three flies." That copy was corrected locally in this pass to "Two lures and two flies..." and TypeScript was rerun successfully. Commit/push that copy fix plus this report before treating QA9E as fully reflected on `origin/main`.

Device/simulator visual QA was not completed because no booted iOS simulator or connected Android device was available from this terminal session. Metro served successfully and code-level UI checks passed.

## Official State Confirmation

Commands run:

```bash
git fetch --all --prune
git status -sb
git rev-parse HEAD
git rev-parse origin/main
git log --oneline -8
```

Findings before QA9E changes:

- Branch: `main`
- HEAD: `1d43d4de590d4e9121d2e90c566ca99edf7a513e`
- `origin/main`: `1d43d4de590d4e9121d2e90c566ca99edf7a513e`
- HEAD equaled `origin/main`
- Worktree was clean
- Current commit was `1d43d4d`, satisfying the requested official state

Recent log:

```text
1d43d4d Add daily-picks final product validation
9a9a315 Add daily-picks final validation report
0c9db2b Dashboard polish: transparent misty-pines + bigger illustration + per-tile hi/lo
e38944f Align How's Fishing summary copy with 5-band score labels
78a7904 Add daily-picks audit harnesses and QA reports
6a47165 Finalize daily-picks recommender QA tuning
fd0fac5 assets: update recommender lure and fly PNGs
3037814 Field-edition dashboard redesign + 5-band scoring
```

## Release Verification

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

- Seasonal matrix check before generation: passed
- Seasonal generation: wrote 384 LMB, 336 SMB, 216 pike, 168 trout rows
- `DATA_QUALITY_WARN`: 0
- Seasonal matrix check after generation: passed
- TypeScript: passed
- Typed recommender Deno suite: 142 passed, 0 failed
- Catalog/factory/generated integrity suite: 69 passed, 0 failed

After the local onboarding copy fix, `npx tsc --noEmit` was rerun and passed.

## Final Harnesses

### Launch-Month Harness

Command:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7
```

Results:

- Rows: 828
- Contexts: 9,234
- Failures: 0
- Lure pool min/p10/median: `6/7/17`
- Fly pool min/p10/median: `6/9/13`
- Thin pools `<4`: 0
- Geometry mismatches: 0
- Surface leaks: 0
- Caution surface selections: 0
- Family-diversity violations: 0
- Set B reuse reviews: 44/9,234
- Identical AP/BF sets: 3/4,617
- Adjacent-day repeated sets over 7 days: 7,242

### All-Month Harness

Command:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7
```

Results:

- Rows: 1,104
- Contexts: 12,312
- Failures: 0
- Lure pool min/p10/median: `6/6/16`
- Fly pool min/p10/median: `6/9/12`
- Thin pools `<4`: 0
- Geometry mismatches: 0
- Surface leaks: 0
- Caution surface selections: 0
- Family-diversity violations: 0
- Set B reuse reviews: 95/12,312
- Identical AP/BF sets: 4/6,156
- Adjacent-day repeated sets over 7 days: 9,737

### Launch Exposure Audit

Command:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-audit --exposure-days=7
```

Results:

- Contexts: 9,234
- Day runs: 129,276
- Adjacent Set A exact repeats: 19,853/55,404 (0.358)
- Adjacent Set B exact repeats: 12,831/55,404 (0.232)
- Slot ID/family repeat rates: 0.693/0.703
- Set A/B overlap: 31,659/64,638 (0.490)
- Set B full reuse: 0
- AP/BF identical: 6/32,319 (0.000 rounded)
- Family-diversity violations: 0
- Broad-fly watch: 198,147/258,552 (0.766)

### All-Month Exposure Audit

Command:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-audit --exposure-days=7
```

Results:

- Contexts: 12,312
- Day runs: 172,368
- Adjacent Set A exact repeats: 26,514/73,872 (0.359)
- Adjacent Set B exact repeats: 16,516/73,872 (0.224)
- Slot ID/family repeat rates: 0.696/0.709
- Set A/B overlap: 40,325/86,184 (0.468)
- Set B full reuse: 0
- AP/BF identical: 19/43,092 (0.000 rounded)
- Family-diversity violations: 0
- Broad-fly watch: 265,464/344,736 (0.770)

## Archived-Weather Replay

Command:

```bash
deno run -A scripts/audit/daily-picks-archived-weather-replay.ts
```

Results:

- Fixtures: 18
- Goal runs: 36
- Broad-fly selected share: 0.528
- AP/BF identical fixture sets: 0
- Adjacent-day exact repeats: 1

Replay result: launch-critical scenarios remained biologically credible. Daily condition tags visibly moved selections: low-light surface windows lifted surface inventory, dirty/windy current windows lifted reaction/current tools, pike contexts used pike-first inventory, and trout mouse remained restricted to a strong July low-light Big Fish window.

## App and UI Launch Smoke

Commands/checks run:

```bash
xcrun simctl list devices booted
adb devices
CI=1 npx expo start --port 8088
curl -I --max-time 10 http://localhost:8088
rg -n "three lures|three flies|3:3|Three lures|Three flies" app components lib supabase/functions/_shared/recommenderEngine supabase/functions/recommender --glob '!node_modules'
```

Results:

- No booted iOS simulator was available.
- No connected Android device was available.
- Metro started successfully in CI mode.
- `curl -I http://localhost:8088` returned `200 OK`.
- Active `components/fishing/RecommenderView.tsx` renders:
  - Lure of the Day
  - Honorable Mention Lure
  - Fly of the Day
  - Honorable Mention Fly
- Set A / Set B language is present and understandable: First Picks, Second Opinion, one-time alternate set, saved until local midnight.
- Recommender UI uses mapped lure/fly images and fallback `IMAGE PENDING`.
- Long pick names are constrained with `numberOfLines`.
- No active recommender color-palette guidance was found.
- No active recommender 3:3 language was found.

Finding and fix:

- Stale launch-facing onboarding copy was found in `app/(onboarding)/step-1-welcome.tsx`: "Three lures and three flies..."
- Fixed locally to: "Two lures and two flies, ranked for weather, water, and the season you fish."
- Follow-up `rg` found only test names/comments mentioning old `3:3` runtime protection, not user-facing stale copy.

Visual QA caveat:

- Simulator/device visual QA remains not run from this terminal session. The app can serve via Metro, but final release should still include a human device pass for mobile layout overlap, image rendering, text readability, and second-opinion button feel.

## Backend and Live Edge Smoke

Live smoke used existing local env credentials only; no secrets were printed.

Project validated:

- `hsesngprhpgajyfbrwbf`

Live smoke result:

```text
LIVE_LAUNCH_SMOKE_OK {
  "projectId":"hsesngprhpgajyfbrwbf",
  "feature":"recommender_daily_picks_2x2_future",
  "version":"daily_picks_2x2_response_v1",
  "defaultDailyPicks":true,
  "slots":4,
  "setAStable":true,
  "apBfSeparate":true,
  "claritySeparate":true,
  "setBVariant":"B",
  "setBRepeatStable":true,
  "setBFullReuse":false,
  "imageMapped":true,
  "colorGuidance":false
}
```

Validated:

- Default path returns daily-picks 2x2, not old 3:3.
- Response feature/version are daily-picks.
- All Purpose and Big Fish are separate.
- Water clarity creates a separate session context.
- Set A repeats for same exact context/date.
- Set B creates once.
- Repeated Set B returns stored B.
- Set B does not fully reuse Set A.
- Response IDs are image-mappable in frontend maps.
- No active color guidance appears in the response.

## Biological Sanity Spot Checks

### Largemouth Bass

- Warm low-light lake Big Fish: clearly launch-credible. Walking topwater/frog/wake/mouse-style surface inventory appears only in open low-light surface windows.
- Dirty/current river Big Fish: clearly launch-credible. Bladed jig/compact jig and weighted/current-capable flies rise without surface leakage under caution.
- Clear/cool lake All Purpose: clearly launch-credible. Jerkbait/crank/finesse and subtle fly profiles stay condition-appropriate.

### Smallmouth Bass

- Great Lakes clear/cool lake: clearly launch-credible. Jerkbait/crank/craw/bugger choices fit cold/cool water and AP/BF separates.
- Dirty river Big Fish: clearly launch-credible. Bladed jig, big smallmouth tube, sculpin/leech/baitfish flies are credible current options.
- Cold clear river: clearly launch-credible. Subsurface tube/jerkbait/sculpin/leech choices show restraint.

### Northern Pike

- Windy stained lake: clearly launch-credible. Pike spinnerbait, bucktail, pike jig, flash/bunny flies rise correctly.
- Clear calm Big Fish: clearly launch-credible. Pike glidebait/jig and large pike flies fit the context.
- Summer low-light surface: clearly launch-credible. Large pike topwater appears only when surface is open.
- Fall windy river: clearly launch-credible. Pike-first reaction tools remain prominent.

### Trout

- Mountain runoff: clearly launch-credible. Spoons/spinners/sculpin/clouser/articulated streamers match runoff/current.
- July low-light Big Fish: clearly launch-credible. Mouse fly appears in a narrow, seasonally credible low-light context.
- Bright clear September river: clearly launch-credible. Subsurface clear-water streamer/spinner/jerkbait choices remain restrained.
- Cold/Alaska low-light river: clearly launch-credible. Small floating trout plug can appear, mouse does not over-broaden, cold-slow subsurface flies remain prominent.

## Release Checklist

### Engine

- [x] Daily-picks default path
- [x] Exact seasonal row resolution
- [x] No fallback borrowing
- [x] Valid candidate pools
- [x] Condition-aware scoring
- [x] AP/BF separation
- [x] Family diversity
- [x] Set A/B session rules
- [x] No weak novelty

### Catalog/Rows

- [x] Species truth
- [x] Water type truth
- [x] Month/region envelope
- [x] Pike-first inventory
- [x] Trout mouse scope
- [x] Broad-fly watch accepted
- [x] Images mapped

### App/Product

- [x] 2x2 UI renders in active recommender view
- [x] Controls present in code for species, water type, clarity, and goal
- [x] Copy is factual after local onboarding stale-copy fix
- [x] Images map through frontend lure/fly maps
- [x] No active stale 3:3 recommender copy
- [x] No active stale color guidance
- [ ] Mobile visual QA on simulator/device not run from this session

### Backend/Deploy

- [x] Typed tests pass
- [x] Harnesses pass
- [x] Live smoke passes against `hsesngprhpgajyfbrwbf`
- [x] Daily-picks deployed response shape confirmed
- [x] Secrets not exposed

## Findings Classification

Launch blockers:

- None after the local onboarding copy fix.

Should fix before launch:

- Commit and push the QA9E onboarding copy fix so official `origin/main` no longer contains stale "Three lures and three flies" user-facing copy.
- Perform one human mobile device/simulator visual pass if release process allows.

Watch after launch:

- Broad-fly exposure remains high but accepted for streamer-only fly model.
- Set A/B overlap remains visible but constrained by quality bands.
- Adjacent-day repeats remain in clear-winner or narrow-pool contexts.

Deferred:

- Winter polish can remain deferred; hard all-month invariants are clean.

## Go/No-Go

**GO WITH CAVEATS**

The recommender engine/backend/product path is launch-ready. Before launch, commit/push the local stale-copy fix from this pass and, ideally, do a quick human device/simulator visual pass. No algorithmic tuning is needed for launch.
