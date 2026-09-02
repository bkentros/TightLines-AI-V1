-- Evaluate auth context once per statement instead of once per candidate row.
-- The policy predicates and role access remain otherwise unchanged.

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (id = (select auth.uid()));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles for delete
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "ai_sessions_select_own" on public.ai_sessions;
create policy "ai_sessions_select_own"
  on public.ai_sessions for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "ai_sessions_insert_own" on public.ai_sessions;
create policy "ai_sessions_insert_own"
  on public.ai_sessions for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "usage_tracking_select_own" on public.usage_tracking;
create policy "usage_tracking_select_own"
  on public.usage_tracking for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "app_feedback_insert_own" on public.app_feedback;
create policy "app_feedback_insert_own"
  on public.app_feedback for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "app_feedback_select_own" on public.app_feedback;
create policy "app_feedback_select_own"
  on public.app_feedback for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Scope service-role policies to the service role directly. This removes both
-- per-row auth.role() evaluation and overlap with authenticated SELECT policy.
drop policy if exists "forecast_score_snapshots_service_role_all"
  on public.forecast_score_snapshots;
create policy "forecast_score_snapshots_service_role_all"
  on public.forecast_score_snapshots for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "referral_funnel_events_service_role_all"
  on public.referral_funnel_events;
create policy "referral_funnel_events_service_role_all"
  on public.referral_funnel_events for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "referral_funnel_events_portal_read"
  on public.referral_funnel_events;
create policy "referral_funnel_events_portal_read"
  on public.referral_funnel_events for select
  to authenticated
  using (
    creator_id in (
      select c.id
      from public.creators c
      where c.owner_user_id = (select auth.uid())
        or lower(c.email) = lower(
          coalesce((select auth.jwt() ->> 'email'), '')
        )
    )
    or lower(coalesce((select auth.jwt() ->> 'email'), '')) =
      'brandonkentros@icloud.com'
  );

notify pgrst, 'reload schema';
