# Recommender 2x2 Master Agent Handoff

Created: 2026-05-08  
Purpose: handoff for the master/steering agent taking over the FinFindr lure/fly recommender renovation.

## Role Split

The user is Brandon. He wants the lure/fly recommender renovated carefully across multiple passes.

There are two agent roles:

- **Master agent:** You steer the feature to success. You inspect builder results, judge quality through the actual codebase, update planning docs, and provide Brandon with one-click-copy prompts for the builder agent.
- **Builder agent:** The same builder agent will continue implementing individual passes from prompts. The builder should summarize results briefly. The master agent must verify by reading code and running focused tests.

The master agent should not blindly trust builder summaries. Verify the files directly.

## Current State

Completed:

- Pass 0: planning document created.
- Pass 1: current-state audit completed.
- Pass 2: goal-aware contract/cache/session foundation completed.
- Passes 3-8F: daily-picks 2x2 catalog, seasonal, engine, session, frontend, deployment, and backend default cutover completed.
- Pass 9A: old active 3:3 / v3 / rebuild runtime cleanup completed.
- Pass 9B: archival scripts/package scripts/old docs cleanup completed.
- Pass 9C: final post-cleanup release verification, deployment, and smoke completed; active lure/fly image coverage is complete.

Important current reality:

- Daily-picks 2x2 is the live recommender path in the app and backend.
- Normal recommender requests route to `resolveDailyPicksSession` and return exactly four picks.
- `x-recommender-preview: daily_picks_2x2` remains harmless/backward-compatible but is no longer required.
- The remote V1 target `hsesngprhpgajyfbrwbf` has the `recommendation_goal` session migration applied, and recommender function version 80 was deployed during Pass 8F.
- Pass 9C deployed cleaned recommender function version 81 to `hsesngprhpgajyfbrwbf` and real no-preview HTTP smoke passed.
- Old active 3:3 / v3 / rebuild runtime files, old fallback UI, and stale archival scripts/docs were removed in Passes 9A-9B.
- Active v4 catalog image coverage is complete: all 39 lure IDs and all 31 fly IDs have PNG assets and frontend mappings.

## Source Of Truth Docs

Read these first:

- `docs/recommender-2x2-renovation-plan.md`
- `docs/audits/recommender-2x2/current-runtime-map.md`
- `docs/audits/recommender-2x2/catalog-profile-audit.md`
- `docs/audits/recommender-2x2/seasonal-row-audit.md`
- `docs/audits/recommender-2x2/removal-candidates.md`

Use the 2x2 renovation plan as the source of truth where docs conflict. Most stale v3/rebuild architecture docs were removed in Pass 9B.

## Key Architecture Direction

The new engine must become a deterministic 2x2 daily recommendation engine:

- Lure of the Day
- Honorable Mention Lure
- Fly of the Day
- Honorable Mention Fly

The setup flow should become:

1. Species
2. Water type
3. Water clarity
4. Goal: `all_purpose` or `big_fish`

Core rule:

> Seasonal biology decides what is allowed. Daily conditions decide what rises to the top. Variety chooses among strong valid options.

Do not let daily weather resurrect seasonally invalid presentations. Example: March LMB topwater can be viable in Florida, but should generally not be viable for Michigan/Northern LMB until a later seasonal row permits it.

## Important Technical State After Cutover

Backend:

- `RecommendationGoal = "all_purpose" | "big_fish"` exists in `supabase/functions/_shared/recommenderEngine/contracts/input.ts`.
- `RecommenderRequest` includes `recommendation_goal`.
- Missing goal defaults to `all_purpose`.
- Invalid goal returns `400 invalid_goal`.
- `supabase/functions/recommender/index.ts` routes default requests to `resolveDailyPicksSession`.
- `supabase/functions/recommender/dailyPicksSession.ts` includes goal in the session key and stores Set A / Set B daily-picks responses.
- `supabase/functions/_shared/recommenderEngine/dailyPicks/**` contains the active scenario, pool, scoring, selector, assembly, response shaping, and exact row resolver path.

Frontend:

- `lib/recommenderContracts.ts` includes `RecommendationGoal`.
- `RecommenderCallParams.recommendation_goal` remains optional at the call boundary.
- `lib/recommender.ts` defaults omitted goal to `all_purpose`.
- `lib/recommender.ts` includes goal in cache identity and edge request body.
- `components/fishing/RecommenderView.tsx` renders the daily-picks 2x2 response shape.

Database:

- Migration added: `supabase/migrations/20260508120000_add_recommendation_goal_to_recommender_daily_sessions.sql`.
- Migration adds `recommendation_goal`, check constraint, and goal-inclusive primary key.
- Migration has been applied on the V1 target used for Pass 8F deployment/smoke.

Common verification after cleanup:

- `npx tsc --noEmit`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`

## Next Planned Pass

Next is fixture-driven quality audit/tuning against the live daily-picks 2x2 baseline as needed.

## Master Agent Workflow

For each pass:

1. Read the current source-of-truth docs.
2. Provide Brandon a single one-click-copy prompt for the builder.
3. Make the builder prompt narrow and unambiguous.
4. Require the builder to summarize:
   - Files changed
   - Behavior changed
   - Tests run
   - Key notes
   - Caveats/blockers
   - Next recommended pass
5. When Brandon returns builder results, inspect the code directly.
6. Run focused tests yourself where appropriate.
7. Accept, reject, or ask for a follow-up builder pass.
8. Update docs when the source of truth changes.

## Verification Rules

Prefer concrete inspection over assumptions:

- Use `rg` to trace imports and references.
- Read touched files with `sed` or equivalent.
- Check `git status --short`.
- Run focused tests before accepting implementation.
- Run broader tests when shared contracts/fixtures are touched.

For recommender backend work, common tests are:

```bash
npx tsc --noEmit
deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__
```

For wider shared-engine changes, consider:

```bash
deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts
```

## Guardrails

Do not allow the renovation to drift into random tuning.

Do not allow builder passes to:

- Patch buzzbait only with copy.
- Keep target-slot pace as the future display model.
- Reintroduce old 3:3 output assumptions as active product behavior.
- Let forage or clarity overpower biology.
- Let daily weather override seasonal regional truth.
- Add broad catalog eligibility just to fill pools.
- Reintroduce deleted old runtime/script/doc dependencies without a deliberate migration reason.
- Skip doc updates after pass completion.

## Worktree Note

At the time of the original handoff, the worktree contained many uncommitted recommender renovation changes. Do not assume files are committed. Check `git status --short` before making or reviewing changes.

The master agent should protect unrelated user changes if any appear later.

## Current Best Next Prompt To Produce

The next prompt should be for fixture-driven recommendation-quality auditing or focused release polish. Daily-picks 2x2 is the active engine path; old-engine migration and cleanup are complete.
