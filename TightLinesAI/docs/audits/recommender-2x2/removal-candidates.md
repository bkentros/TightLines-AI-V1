# Removal Candidates

Pass: 1 current-state audit  
Scope: documentation only; no files removed

This list is conservative. "Candidate" means remove, deprecate, quarantine, or rewrite later after the 2x2 engine is live and imports/tests are updated.

## Current 3:3 Slot Engine Files

These files are production runtime today. Do not remove until after Pass 9 cutover and replacement tests pass.

| Path | Current Role | Why Remove/Deprecate Later | Safe To Remove When |
| --- | --- | --- | --- |
| `supabase/functions/_shared/recommenderEngine/runRecommenderRebuildSurface.ts` | Production surface adapter for rebuild response | Emits old `recommender_rebuild` response, 0-3 arrays, target-slot pace, and `source_slot_index` | New `runDailyPicksSurface` is live and edge handler no longer imports it |
| `supabase/functions/_shared/recommenderEngine/rebuild/runRecommenderRebuild.ts` | Production rebuild orchestrator | Builds 3 target profiles before selecting real candidates | New 2x2 engine core handles daily scenario, pool, scoring, selection |
| `supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts` | Builds current 3 target profiles and surface blocking | Central source of target-slot architecture and slow surface target issue | New daily scenario layer replaces target profiles |
| `supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts` | Selects up to 3 lures/flies per side for target slots | Contains adjacent pace slot fill, rescue/fallback pools, `source_slot_index`, hard-coded boosts | New candidate pool/scoring/2-pick selector replaces it |
| `supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts` | Current hard-coded condition-window ID lists | Should become normalized daily scenario plus catalog `condition_tags` | New tag-based scenario/scoring path is live |
| `supabase/functions/_shared/recommenderEngine/rebuild/dailyTacticalProfile.ts` | Current diagnostic condition profile | Partly overlaps target daily scenario but still tied to old windows | New `buildDailyScenario` replaces it |
| `supabase/functions/_shared/recommenderEngine/rebuild/copy.ts` | Copy builder driven by target profile | Can describe slot pace instead of actual item identity | New 2x2 copy layer uses candidate identity and scenario |
| `supabase/functions/_shared/recommenderEngine/rebuild/recentHistory.ts` | Rebuild-specific recent-history helper | Shape only tracks ID/gear/date; new history needs rank role, presentation group, family group, goal | New recent history model is in use |
| `supabase/functions/_shared/recommenderEngine/rebuild/wind.ts` | Current daylight wind helper | Useful concept but missing wind returns 0 and thresholds differ from plan | Either rewritten into `buildDailyScenario` or retained only as a corrected utility |
| `supabase/functions/_shared/recommenderEngine/rebuild/constants.ts` | Column/pace ordering helper | May be obsolete if new engine owns simple tactical ordering | No remaining imports |

## Production Support Files To Keep For Now

These are not removal candidates yet, but will need goal-aware edits in later passes.

| Path | Current Role | Keep Until |
| --- | --- | --- |
| `supabase/functions/recommender/index.ts` | Production edge entry | Keep; update to call new surface adapter at cutover |
| `supabase/functions/recommender/dailySession.ts` | Production A/B session table logic | Keep or replace with goal-aware session module/table |
| `supabase/functions/recommender/recentHistory.ts` | Production recent-history persistence | Keep or replace with goal/rank/presentation-aware history |
| `supabase/functions/_shared/recommenderEngine/contracts/input.ts` | Backend request type | Keep; extend with goal in Pass 2 |
| `supabase/functions/_shared/recommenderEngine/contracts/output.ts` | Backend response/session constants | Keep; replace response shape/version in cutover |
| `supabase/functions/_shared/recommenderEngine/v4/contracts.ts` | Catalog/seasonal contracts | Keep and extend with condition/goal tags |
| `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts` | Current best lure catalog base | Keep and renovate |
| `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts` | Current best fly catalog base | Keep and renovate |
| `data/seasonal-matrix/*.csv` | Seasonal authoring source | Keep and renovate |
| `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/*.ts` | Runtime generated seasonal rows | Keep; regenerate after CSV changes |
| `scripts/generate-seasonal-rows-v4.ts` | CSV-to-TS generator | Keep; update semantics/docs if columns are renamed conceptually |
| `scripts/check-seasonal-matrix-consistency.ts` | Generated parity check | Keep |

## Old v3 Runtime / Scoring Files

These are legacy/offline today, but still have imports from tests, scripts, and the `index.ts` barrel. Do not remove until import references are gone or quarantined.

| Path | Current Role | Why Remove/Deprecate Later | Safe To Remove When |
| --- | --- | --- | --- |
| `supabase/functions/_shared/recommenderEngine/runRecommenderV3.ts` | Legacy v3 compute path | Superseded by rebuild and then 2x2 | No scripts/tests import it and historical baselines are archived |
| `supabase/functions/_shared/recommenderEngine/runRecommenderV3Surface.ts` | Legacy v3 surface adapter | Not production; old 3-pick surface | No scripts/tests import it |
| `supabase/functions/_shared/recommenderEngine/legacyV3.ts` | Legacy v3 import point for tools | Keeps v3 alive for audits | Audits no longer need executable v3 |
| `supabase/functions/_shared/recommenderEngine/v3/**` | Legacy seasonal tables, candidates, scoring, copy, guards, tests | Requires agents to understand old architecture; conflicts with 2x2 direction | 2x2 has its own regression baselines and old reports are static |
| `supabase/functions/_shared/recommenderEngine/runRecommenderV3.cartesian.test.ts` | Legacy cartesian coverage test | Protects v3 3:3 behavior | v3 executable path removed/quarantined |
| `supabase/functions/_shared/recommenderEngine/__tests__/v3Foundation.test.ts` | Legacy v3 foundation test | Asserts 3 lure and 3 fly recommendations | v3 path retired |
| `supabase/functions/_shared/recommenderEngine/__tests__/v3RegressionBaselines.test.ts` | Legacy v3 baseline test | Protects old expected outputs | New 2x2 baseline suite replaces it |
| `supabase/functions/_shared/recommenderEngine/__tests__/v3DailyShiftAnchors.test.ts` | Legacy v3 daily shift test | Old daily behavior | New scenario tests replace it |
| `supabase/functions/_shared/recommenderEngine/__tests__/v3SeasonalRegressionAnchors.test.ts` | Legacy v3 seasonal anchors | Old seasonal system | New seasonal 2x2 row tests replace it |

## Old v4 Experimental Files

These are not production. Some ideas may be reusable, but the old top-three shape conflicts with 2x2.

| Path | Current Role | Why Remove/Deprecate Later | Safe To Remove When |
| --- | --- | --- | --- |
| `supabase/functions/_shared/recommenderEngine/v4/engine/runRecommenderV4.ts` | Experimental top-three v4 engine | Produces three lures and three flies; has old surface/wind assumptions | New 2x2 engine covers useful pieces |
| `supabase/functions/_shared/recommenderEngine/v4/engine/buildEligiblePool.ts` | Experimental pool builder | Old top-3 candidate construction | New hard-gated pool replaces it |
| `supabase/functions/_shared/recommenderEngine/v4/engine/pickTop3.ts` | Experimental top-3 selector | Directly conflicts with 2x2 output | New `selectDailyPicks` replaces it |
| `supabase/functions/_shared/recommenderEngine/v4/engine/resolveTodayTactics.ts` | Experimental 3-slot tactics | Old column/pace distribution model | New daily scenario replaces distributions |
| `supabase/functions/_shared/recommenderEngine/v4/engine/resolveDailyPayload.ts` | Experimental daily payload | Missing wind defaults to 99 and top-three assumptions differ from plan | New scenario layer is implemented |
| `supabase/functions/_shared/recommenderEngine/v4/engine/buildCopy.ts` | Experimental copy | Slot-role/top-three copy model | New 2x2 copy layer exists |
| `supabase/functions/_shared/recommenderEngine/v4/engine/buildSeed.ts`, `prng.ts`, `xfnv1a.ts` | Experimental deterministic seed utilities | May be reusable; not deletion-first | Keep if reused; remove if new utilities supersede |
| `supabase/functions/_shared/recommenderEngine/v4/engine/diagnostics.ts` | Experimental diagnostics | May be reusable conceptually | Keep if reused; remove if new diagnostics supersede |
| `supabase/functions/_shared/recommenderEngine/v4/seasonal/resolveSeasonalRow.ts` | Experimental v4 seasonal resolver with fallback/state rows | Differs from production exact lookup and new plan no-borrowing rule | No remaining tests/tools depend on fallback behavior |

## Tests Protecting Old 3:3 Behavior

Likely remove or rewrite after 2x2 replacement:

| Path | Current Role | Why It Conflicts | Safe Replacement |
| --- | --- | --- | --- |
| `supabase/functions/_shared/recommenderEngine/__tests__/rebuildTripleCoverage.test.ts` | Requires every generated row to return full 3:3 and Set B difference | Old 3:3 coverage pressure | 2x2 row sufficiency and variety tests |
| `supabase/functions/_shared/recommenderEngine/__tests__/rebuildVarietyCoverage.test.ts` | Asserts 3-fly/3-lure examples | Old array length and coverage behavior | 2x2 top/honorable diversity tests |
| `supabase/functions/_shared/recommenderEngine/__tests__/rebuildVarietyRegression.test.ts` | Asserts triple rotation and 3-pick behavior | Old triple semantics | 14-day 2x2 no-repeat tests |
| `supabase/functions/_shared/recommenderEngine/__tests__/rebuildWeightedVariety.test.ts` | Many assertions for 3 picks, rescue, source slot indices | Old selector internals | Candidate scoring/quality band/selection tests |
| `supabase/functions/_shared/recommenderEngine/__tests__/rebuildTargetProfileGeometry.test.ts` | Protects three target profiles | Target profiles should disappear | Daily scenario tests |
| `supabase/functions/_shared/recommenderEngine/__tests__/rebuildSelectSideSlotExact.test.ts` | Protects slot matching, adjacent pace fill, `source_slot_index` | New engine should score real candidates, no slot source index | Display identity and hard-gated pool tests |
| `supabase/functions/_shared/recommenderEngine/__tests__/rebuildSurfaceContract.test.ts` | Protects current response shape and target-slot pace behavior | New output is 2x2 and item pace must be catalog pace | New surface contract tests |
| `supabase/functions/_shared/recommenderEngine/__tests__/rebuildDailyConditionWindows.test.ts` | Protects current condition windows | New normalized scenario/tags replace windows | Scenario tag tests |
| `supabase/functions/_shared/recommenderEngine/v4/__tests__/coverage.test.ts` | Asserts top-3 length in old v4 engine | Top-3 architecture obsolete | 2x2 coverage tests |
| `supabase/functions/_shared/recommenderEngine/v4/__tests__/pickTop3.test.ts` | Protects old top-three selector | Old selection architecture | 2x2 selector tests |
| `supabase/functions/_shared/recommenderEngine/v4/__tests__/distributionResolution.test.ts` | Protects 3-slot column/pace distributions | Old target distribution model | Daily scenario tests |
| `supabase/functions/_shared/recommenderEngine/v4/__tests__/oneOnOneSpread.test.ts` | Protects neutral 1+1+1 spread | Old top-three idea | Not needed unless concept reused |
| `supabase/functions/_shared/recommenderEngine/v4/__tests__/surfaceCapFlipTarget.test.ts` | Protects old top-3 surface cap repair | New engine should hard-gate surface before selection | Surface gate tests |

Tests to keep and extend:

- `supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts`
- `supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `supabase/functions/recommender/index.test.ts`, but rewrite for goal/session/2x2 behavior.

## Scripts That Are Legacy Or Unclear

Keep until new audit scripts replace them or their outputs are archived.

| Path | Current Role | Candidate Action |
| --- | --- | --- |
| `scripts/audit-recommender-rebuild-pool-health.ts` | Rebuild pool health report using current selector | Replace with 2x2 inventory sufficiency report |
| `scripts/audit-recommender-slot-stickiness-and-row-inclusion.ts` | Current slot/history/inclusion audit | Replace with no-repeat and row allowed-ID audit |
| `scripts/audit-recommender-repeat-cause-analysis.ts` | Current repeat analysis | Replace with 2x2 no-repeat diagnostics |
| `scripts/audit-recommender-profile-geometry-catalog-gap.ts` | Target profile/catalog gap audit | Replace with candidate pool/scenario tag gap audit |
| `scripts/audit-recommender-geometry-pool-comparison.ts` | Old geometry pool comparison | Obsolete after target profiles removed |
| `scripts/audit-recommender-final-scenario-qa.ts` | Current final scenario QA | Rewrite for planned scenario regressions |
| `scripts/audit-recommender-pike-quality-qa.ts` | Current pike QA over rebuild selector | Rewrite for pike 2x2 wind/flash/big-profile behavior |
| `scripts/audit-recommender-trout-river-quality-qa.ts` | Current trout QA over rebuild selector | Rewrite for trout streamer/topwater 2x2 behavior |
| `scripts/audit-recommender-v4-exposure.ts` | Current v4/rebuild exposure audit | Likely obsolete after cutover |
| `scripts/diagnose-recommender-v4-phase4a-lure-balance.ts` | Old phase diagnostic | Quarantine after 2x2 catalog pass |
| `scripts/diagnose-recommender-v4-phase4b-fly-balance.ts` | Old phase diagnostic | Quarantine after 2x2 catalog pass |
| `scripts/recommender-v3-audit/**` | Legacy v3 audit system | Archive-only after new baselines exist |
| `scripts/*-rebuild-audit/run*RebuildAudit.ts` | Species-specific rebuild audit runners | Rewrite or remove after new 2x2 audit scripts exist |
| `scripts/migrate-v3-seasonal-csv-v4.ts` | One-time migration utility | Likely archive/remove after CSV renovation |
| `scripts/annotate-g8-notes-v4.ts` | Old G8 note utility | Likely obsolete after 3:3 G8 no longer matters |
| `scripts/remediate-lake-crawfish-fly-csv-v4.ts` | One-time remediation utility | Archive/remove after confirming no workflow depends on it |

Scripts likely to keep:

- `scripts/generate-seasonal-rows-v4.ts`
- `scripts/check-seasonal-matrix-consistency.ts`
- `scripts/generate-recommender-gating.ts`
- image generation/manifest scripts for species, water type, clarity, tackle assets, unless asset workflow changes.

## Docs That Conflict With The New 2x2 Plan

Do not delete now. Add superseded headers or quarantine in cleanup.

| Path | Current Role | Conflict |
| --- | --- | --- |
| `docs/recommender-v4-simplified-design.md` | Historical v4/top-three design; already has superseded header in current worktree | Top-three output, old surface cap, old v4 cutover plan |
| `docs/tightlines_recommender_architecture_clean.md` | Current/rebuild architecture doc; modified in worktree before this pass | 3-slot rebuild and `source_slot_index` semantics |
| `docs/recommender-selection-refinement-plan.md` | Current rebuild selection refinement notes | Three target profiles and up-to-three output |
| `docs/recommender-v3-maintainer-guide.md` | Legacy v3 maintainer guide | Old v3 scoring/top-three model |
| `docs/recommender-v3-roadmap.md` | Legacy v3 roadmap | Old product direction |
| `docs/recommender-v3-renovation-spec.md` | Legacy v3 renovation | Superseded by v4/rebuild and now 2x2 |
| `docs/recommender-v3-fix-plan.md` | Legacy v3 fix plan | Top-3 scoring/diversity |
| `docs/recommender-v3-post-tuning-checklist.md` | Legacy v3 tuning checklist | Top-3 targets and old QA |
| `docs/recommender-v3-nine-of-ten-plan.md` | Legacy top-3 quality plan | Explicit 3:3 assertions |
| `docs/recommender-audit-tuning-plan.md` | Older audit/tuning plan | Needs review for conflict |
| `docs/authoring/phase-4-inventory-sufficiency.md` | Old inventory sufficiency | Mentions 3-pick assertions; may be useful historical context only |
| `data/seasonal-matrix/schema.md` | Seasonal schema doc | Stale live runtime note says embedded v3 tables are used |
| `docs/audits/recommender-v3/**` | Historical v3 audits | Archive-only after 2x2 |
| `docs/audits/recommender-v4/**` | Historical v4 audits | Archive or mark superseded after 2x2 |
| `docs/audits/recommender-rebuild/**` | Current rebuild audit outputs | Archive after new 2x2 audits replace them |

## Files To Keep Until Production Depends On New 2x2

- `supabase/functions/_shared/recommenderEngine/rebuild/**`
- `supabase/functions/_shared/recommenderEngine/runRecommenderRebuildSurface.ts`
- `supabase/functions/recommender/dailySession.ts`
- `supabase/functions/recommender/recentHistory.ts`
- `supabase/functions/recommender/index.ts`
- `lib/recommender.ts`
- `lib/recommenderContracts.ts`
- `app/recommender.tsx`
- `components/fishing/RecommenderView.tsx`
- `data/seasonal-matrix/*.csv`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/*.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/*.ts`

## Cleanup Order Recommendation

1. Finish Passes 2-9 first: goal contract, frontend, catalog, seasonal rows, new engine, adapter/session, UI, and production cutover.
2. Run `rg` for all old entry points: `runRecommenderRebuildSurface`, `computeRecommenderRebuild`, `selectArchetypesForSide`, `buildTargetProfiles`, `runRecommenderV4`, `runRecommenderV3`.
3. Remove or quarantine tests that only protect 3:3.
4. Remove old rebuild files when no production or accepted audit script imports them.
5. Split legacy docs into an archive section or add explicit superseded headers.
6. Keep historical audit outputs only if clearly labeled as old-engine evidence.
