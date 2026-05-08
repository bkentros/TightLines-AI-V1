# Pass 9B Archival Cleanup

Date: 2026-05-08

## Scope

Pass 9B removed stale package scripts, one-off audit scripts, and old v3/rebuild documentation after Pass 9A deleted the active old 3:3 / v3 / rebuild runtime. This was a cleanup-only pass; daily-picks scoring, selection, sessions, response shape, catalog profiles, seasonal rows, frontend UX, migrations, and image assets were not changed.

## Package Scripts Removed

- `audit:eligibility`
- `audit:recommender:v4:exposure`
- All `audit:recommender:v3:*` scripts

Kept active recommender scripts:

- `audit:catalog-gaps`
- `gen:recommender-tackle-images`
- `gen:recommender-tackle-images:replace`
- `postgen:recommender-tackle-alpha`
- `gen:recommender-species-fish-images`
- `gen:recommender-watertype-images`
- `gen:recommender-waterclarity-images`
- `gen:seasonal-rows-v4`
- `check:seasonal-matrix`

## Script Folders Deleted

- `scripts/recommender-v3-audit/`
- `scripts/recommender-v3-report-audit/`
- `scripts/lmb-rebuild-audit/`
- `scripts/smb-rebuild-audit/`
- `scripts/pike-rebuild-audit/`
- `scripts/trout-rebuild-audit/`

## One-Off Scripts Deleted

- `scripts/audit-eligibility-by-region-v4.ts`
- `scripts/audit-recommender-final-scenario-qa.ts`
- `scripts/audit-recommender-geometry-pool-comparison.ts`
- `scripts/audit-recommender-pike-quality-qa.ts`
- `scripts/audit-recommender-profile-geometry-catalog-gap.ts`
- `scripts/audit-recommender-rebuild-pool-health.ts`
- `scripts/audit-recommender-repeat-cause-analysis.ts`
- `scripts/audit-recommender-slot-stickiness-and-row-inclusion.ts`
- `scripts/audit-recommender-species-confidence-qa.ts`
- `scripts/audit-recommender-trout-river-quality-qa.ts`
- `scripts/audit-recommender-v4-exposure.ts`
- `scripts/audit-recommender-v4-species-sanity.ts`
- `scripts/diagnose-recommender-v4-phase4a-lure-balance.ts`
- `scripts/diagnose-recommender-v4-phase4b-fly-balance.ts`
- `scripts/migrate-v3-seasonal-csv-v4.ts`
- `scripts/recommenderCalibrationScenarios.ts`

## Docs Deleted

- `docs/recommender-v3-audit/`
- `docs/audits/recommender-v3/`
- `docs/audits/recommender-rebuild/`
- `docs/recommender-v3-fix-plan.md`
- `docs/recommender-v3-maintainer-guide.md`
- `docs/recommender-v3-nine-of-ten-plan.md`
- `docs/recommender-v3-post-tuning-checklist.md`
- `docs/recommender-v3-renovation-spec.md`
- `docs/recommender-v3-roadmap.md`
- `docs/recommender-selection-refinement-plan.md`
- `docs/recommender-v4-simplified-design.md`
- `docs/tightlines_recommender_architecture_clean.md`

## Intentionally Kept

- Supabase migrations, including historical `recommender_recent_history` migrations.
- `supabase/functions/recommender/dailyPicksSession.ts` and active tests.
- `supabase/functions/_shared/recommenderEngine/dailyPicks/**`.
- Active v4 catalog and generated seasonal metadata.
- `data/seasonal-matrix/**`.
- Active image generation, image mapping, and active asset workflows.
- Water-reader scripts/docs.
- Current `docs/audits/recommender-2x2/**` renovation history and deployment/audit docs.
- `scripts/catalog-gap-analysis-v4.ts`, because it imports active v4 catalog/contracts and remains useful for future inventory audits.

## Remaining Old-Term References

Remaining references are intentional and limited to:

- Historical migrations that created or altered old tables.
- Tests that assert old 3:3 response fields are absent from the daily-picks response.
- Test variable names such as `dailySessions` that describe fake table state, not the deleted `dailySession.ts` module.
- Current 2x2 renovation/audit docs where old terms appear as explicit history or cleanup evidence.

## Result

Daily-picks 2x2 remains the only active recommender engine path. The repo no longer advertises package scripts or archival docs for deleted v3/rebuild tooling.
