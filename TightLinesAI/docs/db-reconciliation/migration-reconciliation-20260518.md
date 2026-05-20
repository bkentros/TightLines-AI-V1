# Migration Reconciliation - 2026-05-18

This is a pre-launch reconciliation note for the linked Supabase project. It is intentionally conservative: the checks below were read-only except for fetching missing migration files into the local repo and deleting one empty local artifact.

## Commands Run

- `supabase migration list`
- `supabase migration fetch`
- `supabase db dump --schema public --file docs/db-reconciliation/remote_schema_20260518.sql`
- `supabase db push --dry-run`
- `supabase db push --include-all --dry-run`
- `supabase db lint --linked --fail-on none --schema public`

No remote schema changes were applied during this reconciliation pass.

## Files Added From Remote History

`supabase migration fetch` recovered these remote-applied migrations that were missing locally:

- `20260425141032_water_reader_mn_dnr_depth_pilot.sql`
- `20260425154703_water_reader_mn_dnr_pilot_usable_source_paths.sql`
- `20260426030108_water_reader_mn_dnr_depth_expansion_12.sql`
- `20260426030216_water_reader_mn_dnr_expansion_12_burntside_duplicate_cleanup.sql`
- `20260427143131_water_reader_search_token_order_agnostic.sql`
- `20260427151501_water_reader_search_national_trgm_part.sql`
- `20260427151553_water_reader_search_national_function_part.sql`
- `20260427175300_water_reader_search_preview_bbox.sql`
- `20260427222257_water_reader_aerial_tile_plan.sql`
- `20260512122405_add_password_reset_email_lookup.sql`
- `20260512131050_add_delete_current_user_account.sql`

The fetch also tried to overwrite existing tracked migrations. Those tracked changes were reverted immediately so the local files were not silently replaced.

## Local Cleanup

Deleted `20260425021528_optimize_water_reader_promotion_centroid_county.sql` because it was a tracked zero-byte migration, was not applied remotely, and had no schema effect.

## Current Push Risk

Do not run:

```sh
supabase db push --include-all
```

The dry run says it would attempt to apply many older local-only migrations before the latest remote version, including data/search/ingest migrations that are not safe to replay blindly.

The normal dry run also refuses to proceed because local files still exist before the latest remote migration:

```sh
supabase db push --dry-run
```

That means the migration folder still does not cleanly represent the remote production history.

## Important Findings

The remote database does not currently have `public.app_feedback`, but the app's `submit-feedback` Edge Function inserts into that table. As-is, the in-app support form can return "Could not save feedback" in production.

The Smart Log/Catch Log lock migration is local-only. The app UI is locked locally, but the remote database still shows authenticated RLS policies for `public.sessions` and `public.catches` until `20260518130000_lock_smart_log_prelaunch.sql` is applied.

The account deletion lifecycle migration is local-only. The Edge Function cleanup is improved locally, but the remote database does not yet have the new FK lifecycle constraints from `20260518132000_account_deletion_data_lifecycle.sql`.

The PostGIS search-path migration is local-only in history, but the remote schema dump already shows the affected Water Reader functions using `search_path = public, extensions`. This should be treated as a history-repair candidate, not replayed blindly.

Three May 4 migration versions are 12 digits (`202605040001`, `202605040002`, `202605040003`). Supabase CLI debug output shows timestamp parse errors for these versions, and `migration list` displays them as both local-only and remote-only even though they exist on both sides. This is a history-format issue to clean up carefully, not a schema missing issue.

## Recommended Next Step

Do a small, explicit repair/apply plan instead of `--include-all`.

The launch-required SQL has been isolated here:

- `docs/db-reconciliation/launch_required_safe_patch_20260518.sql`
- `docs/db-reconciliation/launch_required_safe_patch_verify_20260518.sql`
- `scripts/apply-launch-db-patch.sh`

The runner defaults to verification-only:

```sh
scripts/apply-launch-db-patch.sh --verify
```

When ready to apply the narrow launch patch from a terminal with `SUPABASE_DB_PASSWORD` exported:

```sh
scripts/apply-launch-db-patch.sh --apply
```

This path avoids the broken migration replay list and does not touch Water Reader/search/ingest logic.

## Launch Patch Applied

Applied `docs/db-reconciliation/launch_required_safe_patch_20260518.sql` manually on 2026-05-18 through `scripts/apply-launch-db-patch.sh --apply`.

Post-apply verification:

- `app_feedback_table_exists`: `true`
- `app_feedback_rls_enabled`: `true`
- `smart_log_authenticated_policies_remaining`: `0`
- `launch_lifecycle_constraints`: `6`

The six lifecycle constraints are intentionally `NOT VALID` (`convalidated = false`) so launch prep did not scan historical rows. New writes and future deletes are still protected.

`supabase db lint --linked --fail-on none --schema public` returned no schema errors after the patch.

After the launch patch is confirmed:

1. Keep the fetched remote-applied migration files.
2. Verify each remaining local-only migration against the remote schema/data.
3. Mark only verified already-applied versions as applied in migration history.
4. Archive or remove local-only migrations that are dev/ingest artifacts and not production schema.
5. Repair migration history so future `supabase db push` runs cleanly again.
