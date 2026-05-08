# Pass 9A Old Engine Cleanup

Date: 2026-05-08

Scope: old 3:3 recommender deletion/quarantine preflight and first cleanup after backend default cutover to daily-picks 2x2.

## Active Engine After Cleanup

Daily-picks 2x2 is the only active recommender engine in the app/backend path:

- `supabase/functions/recommender/index.ts`
- `supabase/functions/recommender/dailyPicksSession.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/**`
- `supabase/functions/_shared/recommenderEngine/v4/contracts.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/**`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/**`
- `lib/recommender.ts`
- `lib/recommenderContracts.ts`
- `components/fishing/RecommenderView.tsx`
- `app/recommender.tsx`

The edge function now imports recommender validation/contracts directly from active modules rather than the removed legacy recommender barrel. Unsupported recommender scope checks use the v4 species/context scope used by daily-picks.

## Deleted Or Quarantined In Pass 9A

| Group | Removed paths | Reason |
|---|---|---|
| Legacy endpoint support | `supabase/functions/recommender/dailySession.ts`, `supabase/functions/recommender/recentHistory.ts` | The default endpoint now uses `dailyPicksSession.ts`; daily-picks does not write `recommender_recent_history`. |
| Old surface adapters | `supabase/functions/_shared/recommenderEngine/runRecommenderRebuildSurface.ts`, `runRecommenderV3.ts`, `runRecommenderV3Surface.ts`, `runRecommenderV3.cartesian.test.ts` | No active import after default cutover. |
| Old export barrel/contracts | `supabase/functions/_shared/recommenderEngine/index.ts`, `legacyV3.ts`, `contracts/output.ts` | The live endpoint imports active input/species/state/v4 scope modules directly; old 3:3 output contracts are not supported. |
| Old rebuild runtime | `supabase/functions/_shared/recommenderEngine/rebuild/**` | Current runtime no longer computes 3:3 rebuild selections. |
| Old v3 runtime | `supabase/functions/_shared/recommenderEngine/v3/**` | v3 species/candidate/scoring path is not active. |
| Experimental v4 top-three runtime | `supabase/functions/_shared/recommenderEngine/v4/engine/**`, `v4/colors.ts`, `v4/colorDecision.ts`, `v4/index.ts`, `v4/seasonal/resolveSeasonalRow.ts` | Superseded by daily-picks resolver/pool/scoring/selector/response layers. |
| Old behavior tests | Rebuild/v3 and old experimental v4 tests under `supabase/functions/_shared/recommenderEngine/__tests__/` and `v4/__tests__/` | These protected 3:3/top-three behavior rather than active daily-picks behavior. |
| Old docs | `supabase/functions/_shared/recommenderEngine/ENGINE_V3_MAINTAINER_GUIDE.md` | No longer describes an active maintained runtime. |

## Frontend Cleanup

- `lib/recommenderContracts.ts` now treats `RecommenderResponse` as the daily-picks response shape only.
- Legacy 3:3 response types and `isLegacyRecommenderResponse` were removed.
- `components/fishing/RecommenderView.tsx` no longer has an unreachable old-shape fallback branch.
- `app/recommender.tsx` now maps the daily-picks species directly for the result species image.
- `lib/colorPaletteImages.ts` no longer documents palette preloads in terms of old `RankedRecommendation` output.

## Tests Kept For Active Behavior

- `supabase/functions/recommender/index.test.ts`
- `supabase/functions/recommender/dailyPicksSession.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts`
- `supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `supabase/functions/_shared/recommenderEngine/__tests__/gatingParity.test.ts`

`generatedSeasonalIntegrity.test.ts` now asserts daily-picks minimum primary-pool size of two per side rather than preserving the old 3:3 minimum.

## Intentionally Kept

- v4 catalog profile files and generated seasonal rows because daily-picks candidate pools consume them.
- Seasonal CSV authoring files because they remain the source for generated v4 seasonal rows.
- Shared condition analysis and How's Fishing normalization modules because daily-picks scenario construction still uses them.
- `supabase/migrations/20260508120000_add_recommendation_goal_to_recommender_daily_sessions.sql` and older migrations. Pass 9A did not alter migration history.
- Image mappings/assets because the active app result cards still use them.

## Remaining Old-Code References

Remaining references are not active old-engine imports:

- Historical migrations still define `public.recommender_recent_history`; migrations were intentionally left unchanged.
- Some tests use literal `lure_recommendations` / `fly_recommendations` strings to assert stale 3:3 fields are absent from daily-picks responses.
- Daily-picks tests include negative assertions that active code does not import old rebuild adapters.
- Existing docs, package scripts, and offline scripts outside the active app/backend runtime still mention or import rebuild/v3 history and should be handled in a follow-up Pass 9B. Those scripts are now archival; many will not run after the old runtime deletion.

## Follow-Up Recommendation

Pass 9B should be limited to archival cleanup: stale docs, offline scripts, old migration-history notes, and any naming polish such as frontend `RECOMMENDER_V3_UI_*` constants if Brandon wants the repository to have fewer historical references. No daily-picks selection, scoring, catalog, seasonal, or UI behavior changes are needed for that cleanup.
