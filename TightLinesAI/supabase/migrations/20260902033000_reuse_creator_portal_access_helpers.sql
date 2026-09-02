-- Reuse the stable creator access helpers used by the other portal policies.
-- This preserves access semantics and avoids per-row auth context evaluation.

drop policy if exists "referral_funnel_events_portal_read"
  on public.referral_funnel_events;

create policy "referral_funnel_events_portal_read"
  on public.referral_funnel_events for select
  to authenticated
  using (
    public.is_finfindr_creator_admin()
    or creator_id in (select public.auth_creator_ids())
  );

notify pgrst, 'reload schema';
