# QA8D Exposure Variety Policy

Date: 2026-05-09

## Executive Summary

QA8D audited and tuned daily-picks exposure behavior. The confirmed issue was selector-level repetition: many adjacent-day repeats happened even when the row had valid, close-scoring alternatives inside the existing quality band.

Fix made:
- Kept hard gates and scoring unchanged.
- Kept existing Top and Honorable quality bands.
- Increased deterministic date-seeded variety inside the Top/HM quality bands.
- Added a clear-winner guard: a Top candidate with a 10+ point raw score lead still wins.
- Added a condition-fit guard: when close in-band candidates exist and at least one has a daily `condition_tag` score reason, variety chooses among condition-fit candidates first.

Result:
- Launch Set A adjacent exact repeat rate improved from `0.497` to `0.314`.
- Launch Set B adjacent exact repeat rate improved from `0.240` to `0.167`.
- Launch slot ID repeat rate improved from `0.777` to `0.683`.
- Family-diversity violations stayed `0`.
- Set B full reuse stayed `0`.
- No geometry mismatches, surface leaks, caution-gate surface selections, or thin pools were introduced.

## Current Selector And Session Behavior

Top Pick:
- Candidate pool is built only from row-authored profiles and hard daily gates.
- Candidates are scored before selector variety.
- Top selection uses the Top quality band around the best raw score.
- Set B applies avoid IDs from Set A before selecting when alternatives exist.
- Variety is deterministic from seed, local date, recommendation goal, variant, side, slot, and candidate ID.

Honorable Mention:
- Uses the same hard-gated pool.
- Cannot duplicate Top Pick ID.
- Builds the existing honorable quality band from remaining candidates.
- Requires different `family_group` when a different-family candidate exists in-band.
- Uses presentation/column diversity and deterministic jitter only after family eligibility.
- Does not leave the quality band for novelty.

Set B:
- Receives Set A selected IDs as avoid IDs.
- Avoids Set A IDs when alternatives exist.
- Preserves Top/HM family diversity.
- Never uses invalid seasonal or hard-gated candidates.

Session behavior:
- Set A remains stable for the exact context until location-local midnight because the session stores the generated response.
- Exactly one Set B second opinion is allowed for the exact session key.
- Session key separates local date, location key, state/region, species, water type, water clarity, goal, and engine version.

Why repeats were high:
- The selector already used date-seeded jitter, but `TOP_JITTER_POINTS=8` and `HONORABLE_JITTER_POINTS=4` were too small relative to common score spreads.
- Candidates inside the quality band could remain effectively unreachable when the raw leader was only moderately ahead.
- Synthetic harness daily conditions repeat the same scenario template across adjacent dates, so selector variety is the main source of day-to-day movement in that audit.

## Variety Policy

The product policy after QA8D:
- Hard gates always win.
- Row-authored seasonal biology always decides legality.
- Daily condition, goal, forage, clarity, column, and pace scoring happens before variety.
- Variety only operates inside strong quality bands.
- A clear Top Pick winner is not forced away: `10+` raw score lead keeps the raw winner.
- Close Top Pick candidates may rotate deterministically by date/seed.
- When close candidates exist and any in-band candidate has a daily condition-tag score reason, variety prefers condition-fit candidates.
- Honorable Mention still requires different `family_group` when available in-band.
- Set B still avoids Set A IDs when alternatives exist.
- No candidate below the Top/HM quality band is selected for novelty.
- No persistence or weather snapshotting is added.

## Implementation Details

Changed `selectDailyPicks.ts`:
- `TOP_JITTER_POINTS` now equals `TOP_QUALITY_BAND` (`18`).
- `HONORABLE_JITTER_POINTS` increased to `12`.
- Added `TOP_COMMANDING_SCORE_LEAD = 10`.
- Added raw-score clear-winner guard for Top Pick.
- Added condition-fit preference for close in-band variety choices.

Changed tests:
- Added selector test that a commanding winner stays selected across dates.
- Added selector test that close non-tied candidates can rotate without selecting an out-of-band candidate.
- Adjusted one family-unavailable test to allow Top Pick date variety while still proving same-family reuse only when necessary.

Changed audit tooling:
- Added `--exposure-audit` to `scripts/audit/daily-picks-quality-harness.ts`.
- Reports adjacent Set A/Set B exact repeat rates, slot ID/family repeat rates, Set A/B overlap, AP/BF identical rate, family-diversity violations, exposure leaders, and broad-fly watch share.

## Repetition Metrics

Launch months, March-November:

| Metric | Before | After |
|---|---:|---:|
| Set A adjacent exact repeat rate | 0.497 | 0.314 |
| Set B adjacent exact repeat rate | 0.240 | 0.167 |
| Slot ID repeat rate | 0.777 | 0.683 |
| Slot family repeat rate | 0.785 | 0.695 |
| Set A/B overlap rate | 0.511 | 0.475 |
| Set B full reuse | 0 | 0 |
| AP/BF identical rate | 0.002 | 0.025 |
| Family violations | 0 | 0 |
| Broad-fly watch share | 0.752 | 0.758 |

All months:

| Metric | Before | After |
|---|---:|---:|
| Set A adjacent exact repeat rate | 0.496 | 0.311 |
| Set B adjacent exact repeat rate | 0.254 | 0.163 |
| Slot ID repeat rate | 0.780 | 0.679 |
| Slot family repeat rate | 0.795 | 0.694 |
| Set A/B overlap rate | 0.485 | 0.457 |
| Set B full reuse | 0 | 0 |
| AP/BF identical rate | 0.006 | 0.034 |
| Family violations | 0 | 0 |
| Broad-fly watch share | 0.751 | 0.760 |

## Harness And Replay Results

Launch harness after:
- Rows: 828
- Contexts: 9234
- Failures: 0
- Pool health: lure `6/7/17`, fly `6/9/13`
- Geometry mismatches: 0
- Surface leaks: 0
- Caution surface selections: 0
- Family diversity violations with in-band alternative: 0
- Adjacent repeated sets over 7 days: 6903

All-month harness after:
- Rows: 1104
- Contexts: 12312
- Failures: 0
- Pool health: lure `6/6/16`, fly `6/9/12`
- Geometry mismatches: 0
- Surface leaks: 0
- Caution surface selections: 0
- Family diversity violations with in-band alternative: 0
- Adjacent repeated sets over 7 days: 9235

Archived-weather replay after:
- Fixtures: 18
- Goal runs: 36
- Broad fly selected share: 0.500
- AP/BF identical fixture sets: 0
- Adjacent-day exact repeats: 1
- No red flags printed.

Broad-fly watch:
- Launch broad-fly audit share: 0.757
- All-month broad-fly audit share: 0.758
- Broad flies remain a watch metric, but QA8D did not tune fly row authoring or scoring.

## Confirmed Causes Of Repetition

Selector/exposure issue:
- Confirmed. Existing date jitter was too weak for common in-band score spreads.

Scoring issue:
- Not confirmed for this pass. Daily condition scoring was materially visible; launch selected condition-reason rate increased to `0.863` after condition-fit variety preference.

Row-authoring issue:
- Not confirmed as the primary repeat cause. Pools remained healthy, and repeats moved significantly with selector-only changes.

Legitimate biology:
- Still present. Some repeats remain because one candidate is a commanding winner, pools are narrow in some exact contexts, or the synthetic scenario does not change daily conditions.

## Proof No Weak Novelty Was Introduced

Tests:
- Clear winner remains selected across dates.
- Close non-tied candidates can rotate only inside Top quality band.
- Out-of-band novelty candidate is not selected.
- Honorable does not drop below quality band for diversity.
- Dirty poor-fit bass fixture still does not promote `glidebait`.

Harness:
- `0` selected column/pace mismatches.
- `0` surface leaks.
- `0` caution-gate surface selections.
- `0` thin contexts below 4 per side.

## Proof Family Diversity And Set B Rules Hold

Tests:
- HM chooses different family when in-band alternative exists.
- HM may reuse family only when every in-band candidate shares Top family.
- Set B avoidance still works with family diversity.
- Session tests confirm same Set A returns for same context/date and only one Set B refresh is allowed.

Harness:
- Launch family-diversity violations: `0`
- All-month family-diversity violations: `0`
- Launch Set B full reuse: `0`
- All-month Set B full reuse: `0`

## Remaining Red Flags

- AP/BF identical rate rose from `0.002` to `0.025` launch and `0.006` to `0.034` all-month. Absolute rate remains low, but QA8E should watch whether condition-fit preference sometimes collapses AP/BF variety in narrow contexts.
- Slot family repeat rate remains high at `0.695` launch, which is expected when the same biology remains dominant but still worth watching.
- Broad fly share remains high at roughly `0.76` in synthetic harness exposure; QA8C cleanup reduced clear padding, but broad streamers are still core fly inventory.
- Set A/B overlap improved but remains `0.475` launch. Full reuse is zero, so this is not a contract break.

## Recommended Next Pass

Run QA8E targeted exposure review:
- Inspect AP/BF identical contexts introduced or amplified by condition-fit preference.
- Review Set A/B overlap contexts where overlap persists despite healthy pools.
- Decide whether family-level adjacent-day variety should be added as a second-order preference inside the same quality band.
- Keep broad-fly monitoring active but do not tune fly scoring from exposure metrics alone.

## Commands Run

- `git status --short`
- `npm run check:seasonal-matrix`
- `npm run gen:seasonal-rows-v4`
- `npm run check:seasonal-matrix`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/selectDailyPicks.test.ts`
- `deno test -A supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/selectDailyPicks.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/previewQualityFixtures.test.ts --fail-fast`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-audit --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-audit --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --broad-fly-audit`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --broad-fly-audit`

