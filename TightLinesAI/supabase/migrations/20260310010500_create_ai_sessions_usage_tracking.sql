
-- ─── ai_sessions ─────────────────────────────────────────────────────────────
-- Every AI call (recommender, water reader, how's fishing) logged here.
create table public.ai_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  session_type    text not null
                    check (session_type in ('recommendation','water_reader','fishing_now')),
  input_payload   jsonb not null default '{}',
  response_payload jsonb,
  token_cost_usd  numeric(8,6) not null default 0,
  created_at      timestamptz not null default now()
);

create index ai_sessions_user_id_idx on public.ai_sessions(user_id);
create index ai_sessions_type_idx on public.ai_sessions(session_type);
create index ai_sessions_created_at_idx on public.ai_sessions(created_at desc);

alter table public.ai_sessions enable row level security;

create policy "ai_sessions_select_own"
  on public.ai_sessions for select
  to authenticated
  using (user_id = auth.uid());

create policy "ai_sessions_insert_own"
  on public.ai_sessions for insert
  to authenticated
  with check (user_id = auth.uid());


-- ─── usage_tracking ──────────────────────────────────────────────────────────
-- Per-user per-billing-period cost counter. Updated by Edge Functions after
-- every AI call. Used for tier enforcement and approaching-limit warnings.
create table public.usage_tracking (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  billing_period  text not null,                -- e.g. "2026-03" (YYYY-MM)
  total_cost_usd  numeric(10,6) not null default 0,
  call_count      integer not null default 0,
  updated_at      timestamptz not null default now(),
  unique (user_id, billing_period)
);

create trigger usage_tracking_updated_at
  before update on public.usage_tracking
  for each row execute procedure public.handle_updated_at();

create index usage_tracking_user_billing_idx on public.usage_tracking(user_id, billing_period);

alter table public.usage_tracking enable row level security;

create policy "usage_tracking_select_own"
  on public.usage_tracking for select
  to authenticated
  using (user_id = auth.uid());

-- Edge Functions use service role key — no insert policy needed for client


-- ─── FK: sessions → ai_sessions (now that ai_sessions exists) ───────────────
alter table public.sessions
  add constraint sessions_ai_session_fk
  foreign key (ai_session_id) references public.ai_sessions(id) on delete set null;
;
