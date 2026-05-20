# Prelaunch Database Pass 2

## Migration Reconciliation

Do not run `supabase db push --include-all` until migration history is reconciled.
The linked project has drifted: some migration IDs exist locally but not remotely,
and some exist remotely but not locally. Treat the remote database as production
state and reconcile deliberately.

Recommended sequence:

1. Freeze schema changes except emergency launch hardening.
2. Run `supabase migration list` and save the output.
3. Dump the remote schema with `supabase db dump --schema public,water_reader_private`.
4. Decide which local-only migrations are already represented in remote schema.
5. Recover or document remote-only migration IDs before marking anything repaired.
6. Apply only the launch hardening migrations after the history table is trusted.

Pass 2 added additive migrations for:

- locking Smart Log table access prelaunch
- adding account-deletion lifecycle constraints for user-linked tables

An existing local migration, `20260518170000_postgis_extensions_search_path.sql`,
already covers Water Reader PostGIS function search paths.

## Do Not Ship Until

- `supabase migration list` shows expected local/remote alignment
- `supabase db push --dry-run` contains only intended new migrations
- `supabase db lint --linked --schema public` has no app-owned schema errors
