-- Prelaunch lock for the unfinished Smart Log feature.
-- Keep the tables in place for future development, but remove authenticated
-- client access until the feature is ready to ship.

drop policy if exists "sessions_select_own" on public.sessions;
drop policy if exists "sessions_insert_own" on public.sessions;
drop policy if exists "sessions_update_own" on public.sessions;
drop policy if exists "sessions_delete_own" on public.sessions;

drop policy if exists "catches_select_own" on public.catches;
drop policy if exists "catches_insert_own" on public.catches;
drop policy if exists "catches_update_own" on public.catches;
drop policy if exists "catches_delete_own" on public.catches;

notify pgrst, 'reload schema';
