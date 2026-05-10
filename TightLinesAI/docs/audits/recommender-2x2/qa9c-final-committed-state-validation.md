# QA9C Final Committed-State Validation

Date: 2026-05-10

## Executive Summary

QA9C validated the daily-picks 2x2 recommender from a temporary worktree checked out at the committed QA state:

- Commit: `e38944f9b3cbf43832b812e7b2597396dcdb5e34`
- Worktree: `/Users/brandonkentros/TightLines AI V1/TightLinesAI-qa9-final`
- App directory used for commands: `/Users/brandonkentros/TightLines AI V1/TightLinesAI-qa9-final/TightLinesAI`

Final result:
- No launch blockers found.
- The committed recommender QA state satisfies hard gates, row geometry, surface policy, family diversity, Set B session rules, AP/BF separation, and no-weak-novelty constraints.
- Broad-fly exposure and Set A/B overlap remain watch metrics, not launch blockers.
- The 5-band How's Fishing labels still do not directly affect daily-picks recommendations.

No recommender behavior was tuned in this pass.

## Clean Worktree Setup

Commands run from the primary checkout:

- `git rev-parse HEAD`
- `git status -sb`
- `git worktree add ../TightLinesAI-qa9-final HEAD`

Source checkout state before adding the worktree:
- `main...origin/main [ahead 3]`
- Local dirty leftovers remained untouched:
  - `assets/images/misty-pines.png`
  - `deno.lock`
  - `scripts/generate-recommender-tackle-images.ts`
  - `scripts/strip-recommender-tackle-backgrounds.sh`
  - `assets/reference/`
  - `scripts/strip-recommender-tackle-chroma-key.ts`

Validation worktree confirmation:
- `git status -sb`: `## HEAD (no branch)`
- `git log --oneline -5`:
  - `e38944f Align How's Fishing summary copy with 5-band score labels`
  - `78a7904 Add daily-picks audit harnesses and QA reports`
  - `6a47165 Finalize daily-picks recommender QA tuning`
  - `fd0fac5 assets: update recommender lure and fly PNGs`
  - `3037814 Field-edition dashboard redesign + 5-band scoring`

Path note:
- The added worktree root contains the app under `TightLinesAI/`, so package/test commands were run from `../TightLinesAI-qa9-final/TightLinesAI`.
- An initial `npm run check:seasonal-matrix` from the worktree root failed because there is no `package.json` at that outer root. This was a path issue only.

Dependency setup note:
- The fresh worktree had no `node_modules`.
- `npx tsc --noEmit` initially failed before dependencies were installed.
- `npm install` hit the existing React peer conflict; `npm install --legacy-peer-deps` succeeded inside the temporary worktree only.
- The typed recommender Deno suite initially failed until Deno materialized npm-backed dependencies. `deno cache --node-modules-dir=auto ...` resolved this in the temp worktree.
- `deno cache` temporarily modified `deno.lock`; that temp-only change was restored with `git restore deno.lock`.
- After restoring `deno.lock`, the typed recommender Deno suite still passed.
- Final temp worktree status after validation dependency setup and restore: clean.

## Final Verification

Seasonal matrix:
- `npm run check:seasonal-matrix`: passed.
- `npm run gen:seasonal-rows-v4`: passed.
  - LMB rows: `384`
  - SMB rows: `336`
  - Pike rows: `216`
  - Trout rows: `168`
  - `DATA_QUALITY_WARN count: 0`
- second `npm run check:seasonal-matrix`: passed.

TypeScript:
- `npx tsc --noEmit`: passed after temp dependency install.

Deno:
- Recommender/daily-picks typed suite: `142 passed`.
- Catalog/factory/generated integrity suite: `69 passed`.

## Harness Results

Launch harness:
- Rows: `828`
- Contexts: `9234`
- Failures: `0`
- Pool health: lure `6/7/17`, fly `6/9/13`
- Thin pools `<4`: `0`
- Selected condition-reason rate: `0.755`
- Selected goal-reason rate: `0.916`
- Geometry mismatches: `0`
- Surface leaks: `0`
- Caution surface selections: `0`
- Family-diversity violations: `0`
- Set B reuse reviews: `44/9234`
- Identical AP/BF sets: `3/4617`
- Adjacent-day repeated sets over 7 days: `7242`

All-month harness:
- Rows: `1104`
- Contexts: `12312`
- Failures: `0`
- Pool health: lure `6/6/16`, fly `6/9/12`
- Thin pools `<4`: `0`
- Selected condition-reason rate: `0.727`
- Selected goal-reason rate: `0.911`
- Geometry mismatches: `0`
- Surface leaks: `0`
- Caution surface selections: `0`
- Family-diversity violations: `0`
- Set B reuse reviews: `95/12312`
- Identical AP/BF sets: `4/6156`
- Adjacent-day repeated sets over 7 days: `9737`

## Exposure Results

Launch exposure:
- Contexts: `9234`
- Day runs: `129276`
- Adjacent Set A exact repeats: `19853/55404` (`0.358`)
- Adjacent Set B exact repeats: `12831/55404` (`0.232`)
- Slot ID/family repeat rates: `0.693/0.703`
- Set A/B overlap: `31659/64638` (`0.490`)
- Set B full reuse: `0`
- AP/BF identical: `6/32319` (`0.000`)
- Family-diversity violations: `0`
- Broad-fly watch: `198147/258552` (`0.766`)

All-month exposure:
- Contexts: `12312`
- Day runs: `172368`
- Adjacent Set A exact repeats: `26514/73872` (`0.359`)
- Adjacent Set B exact repeats: `16516/73872` (`0.224`)
- Slot ID/family repeat rates: `0.696/0.709`
- Set A/B overlap: `40325/86184` (`0.468`)
- Set B full reuse: `0`
- AP/BF identical: `19/43092` (`0.000`)
- Family-diversity violations: `0`
- Broad-fly watch: `265464/344736` (`0.770`)

## Broad-Fly Watch

Launch broad-fly audit:
- Rows: `828`
- Contexts: `9234`
- Fly pool health: `6/9/13`
- Thin fly pools `<4`: `0`
- Broad fly selected slots: `28280/36936` (`0.766`)
- Broad top/HM slots: top `0.378`, honorable `0.387`

All-month broad-fly audit:
- Rows: `1104`
- Contexts: `12312`
- Fly pool health: `6/9/12`
- Thin fly pools `<4`: `0`
- Broad fly selected slots: `37877/49248` (`0.769`)
- Broad top/HM slots: top `0.380`, honorable `0.389`

Conclusion:
- Broad flies remain high-volume, especially `game_changer`, `articulated_baitfish_streamer`, `clouser_minnow`, `unweighted_baitfish_streamer`, and leech-family flies.
- This is still a watch metric because pool health and hard validity remain clean.

## Archived Replay

Archived-weather replay:
- Fixtures: `18`
- Goal runs: `36`
- Broad fly selected share: `0.528`
- AP/BF identical fixture sets: `0`
- Adjacent-day exact repeats: `1`

Replay confirmed:
- Daily condition tags visibly affect selected outputs.
- Low-light/surface windows lift surface inventory only when surface is open.
- Dirty/current contexts remain subsurface under caution gates.
- Pike reaction contexts remain pike-first.
- Trout mouse remains limited to credible summer/early-fall surface Big Fish contexts.

## Product Rule Validation

Final committed state satisfies:
- Exact 2x2 response shape: yes, covered by response shaper and engine tests.
- Set A stable for exact context until local midnight: yes, covered by session tests.
- Exactly one Set B: yes, covered by session tests.
- Set B avoids Set A IDs when valid alternatives exist: yes, covered by selector/engine/session tests; exposure audit shows `0` full reuse.
- Top/HM family diversity when in-band alternatives exist: yes, harness and exposure report `0` violations.
- No surface leaks: yes, launch and all-month harnesses report `0`.
- No caution-gate surface selections: yes, launch and all-month harnesses report `0`.
- No selected column/pace mismatch: yes, launch and all-month harnesses report `0` geometry mismatches.
- AP/BF separation: yes, launch `3/4617` identical harness sets, all-month `4/6156`, archived replay `0`.
- Daily conditions influence score reasons: yes, selected condition-reason rate is launch `0.755`, all-month `0.727`.
- No weak novelty picks: yes, selector tests preserve quality-band and clear-winner behavior.
- Pool health remains viable: yes, no side drops below four candidates in harness or broad-fly audit.
- Broad-fly exposure remains a watch metric, not a blocker: yes.
- 5-band score labels do not directly affect daily-picks: yes; daily-picks uses numeric `analysis.scored.score`, not `ScoreBand` labels.

## Launch Blockers

None found.

## Remaining Watch Items

- Broad-fly exposure remains high:
  - launch `0.766`
  - all-month `0.769`
- Set A/B overlap remains visible:
  - launch `0.490`
  - all-month `0.468`
- Adjacent-day repeats remain present where quality bands are narrow or a candidate is a strong biological winner.
- Fresh validation worktrees need dependency bootstrap:
  - `npm install --legacy-peer-deps`
  - Deno npm dependency materialization, e.g. `deno cache --node-modules-dir=auto ...`

## Push Readiness

The three committed QA commits are safe to push from a recommender-quality perspective:
- `6a47165 Finalize daily-picks recommender QA tuning`
- `78a7904 Add daily-picks audit harnesses and QA reports`
- `e38944f Align How's Fishing summary copy with 5-band score labels`

Caveat:
- This QA9C report itself is currently an uncommitted local audit doc.
- The primary checkout still has unrelated/unconfirmed leftover asset/tooling files that should not be pushed without Brandon approval.

## Temporary Worktree

The temporary validation worktree should remain until Brandon approves cleanup or wants to inspect it:
- `/Users/brandonkentros/TightLines AI V1/TightLinesAI-qa9-final`

After approval, it can be removed with `git worktree remove ../TightLinesAI-qa9-final` from the primary repo.
