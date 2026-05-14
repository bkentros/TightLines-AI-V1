-- In-app support, bug reports, feature suggestions, and contextual read feedback.
create table public.app_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  user_email text,
  username text,
  subscription_tier text,
  topic text not null check (
    topic in (
      'general',
      'bug',
      'feature',
      'subscription',
      'todays_bite',
      'tackle_box',
      'water_read',
      'smart_log'
    )
  ),
  sentiment text check (sentiment in ('looks_right', 'needs_work', 'note')),
  feature_name text,
  message text not null check (char_length(trim(message)) between 8 and 4000),
  context jsonb not null default '{}'::jsonb,
  app_platform text,
  email_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index app_feedback_created_at_idx on public.app_feedback(created_at desc);
create index app_feedback_user_id_idx on public.app_feedback(user_id);
create index app_feedback_topic_idx on public.app_feedback(topic);

alter table public.app_feedback enable row level security;

create policy "app_feedback_insert_own"
  on public.app_feedback for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "app_feedback_select_own"
  on public.app_feedback for select
  to authenticated
  using (user_id = auth.uid());
