-- Deferred install attribution: app opens + funnel events for creator analytics.

alter table public.referral_clicks
  add column if not exists app_opened_at timestamptz,
  add column if not exists app_open_match_method text
    check (
      app_open_match_method is null
      or app_open_match_method in ('deep_link', 'clipboard', 'fingerprint', 'universal_link')
    );

create index if not exists referral_clicks_app_open_pending_idx
  on public.referral_clicks (creator_id, created_at desc)
  where app_opened_at is null;

create index if not exists referral_clicks_fingerprint_match_idx
  on public.referral_clicks (ip_hash, user_agent_hash, created_at desc)
  where app_opened_at is null and ip_hash is not null and user_agent_hash is not null;

create table if not exists public.referral_funnel_events (
  id uuid primary key default gen_random_uuid(),
  referral_click_id uuid not null references public.referral_clicks(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  event_type text not null
    check (event_type in ('click', 'app_open', 'signup', 'subscribed')),
  match_method text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists referral_funnel_events_creator_created_idx
  on public.referral_funnel_events (creator_id, created_at desc);

create index if not exists referral_funnel_events_click_idx
  on public.referral_funnel_events (referral_click_id, event_type);

alter table public.referral_funnel_events enable row level security;

create policy "referral_funnel_events_service_role_all"
  on public.referral_funnel_events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

revoke all on table public.referral_funnel_events from anon, authenticated;

grant select on table public.referral_funnel_events to authenticated;

create policy "referral_funnel_events_portal_read"
  on public.referral_funnel_events for select
  to authenticated
  using (
    creator_id in (
      select c.id from public.creators c
      where c.owner_user_id = auth.uid()
        or lower(c.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
    or lower(coalesce(auth.jwt() ->> 'email', '')) = 'brandonkentros@icloud.com'
  );
