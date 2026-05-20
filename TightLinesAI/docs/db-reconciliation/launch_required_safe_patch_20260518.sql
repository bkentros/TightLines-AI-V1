-- FinFindr pre-launch database patch.
--
-- Purpose:
--   1. Create the missing in-app feedback table used by submit-feedback.
--   2. Lock unfinished Smart Log/Catch Log tables at the database policy layer.
--   3. Add account-deletion lifecycle constraints without validating/scanning
--      historical rows during launch prep.
--
-- This file is intentionally idempotent and avoids Water Reader/search data.
-- It should be applied manually only after review because migration history is
-- currently drifted and `supabase db push --include-all` is not safe.

begin;

-- In-app support, bug reports, feature suggestions, and contextual read feedback.
create table if not exists public.app_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  user_email text,
  username text,
  subscription_tier text,
  topic text,
  sentiment text,
  feature_name text,
  message text,
  context jsonb default '{}'::jsonb,
  app_platform text,
  email_sent boolean default false,
  created_at timestamptz default now()
);

alter table public.app_feedback
  alter column topic set not null,
  alter column message set not null,
  alter column context set not null,
  alter column email_sent set not null,
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.app_feedback'::regclass
      and conname = 'app_feedback_topic_check'
  ) then
    alter table public.app_feedback
      add constraint app_feedback_topic_check
      check (
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
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.app_feedback'::regclass
      and conname = 'app_feedback_sentiment_check'
  ) then
    alter table public.app_feedback
      add constraint app_feedback_sentiment_check
      check (sentiment in ('looks_right', 'needs_work', 'note'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.app_feedback'::regclass
      and conname = 'app_feedback_message_check'
  ) then
    alter table public.app_feedback
      add constraint app_feedback_message_check
      check (char_length(trim(message)) between 8 and 4000);
  end if;
end $$;

create index if not exists app_feedback_created_at_idx
  on public.app_feedback(created_at desc);

create index if not exists app_feedback_user_id_idx
  on public.app_feedback(user_id);

create index if not exists app_feedback_topic_idx
  on public.app_feedback(topic);

alter table public.app_feedback enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'app_feedback'
      and policyname = 'app_feedback_insert_own'
  ) then
    create policy "app_feedback_insert_own"
      on public.app_feedback for insert
      to authenticated
      with check (user_id = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'app_feedback'
      and policyname = 'app_feedback_select_own'
  ) then
    create policy "app_feedback_select_own"
      on public.app_feedback for select
      to authenticated
      using (user_id = auth.uid());
  end if;
end $$;

grant insert, select on table public.app_feedback to authenticated;
grant all on table public.app_feedback to service_role;

-- Account deletion lifecycle hardening. Use NOT VALID so this does not scan
-- historical rows during launch prep; new writes are still enforced.
do $$
begin
  alter table public.app_feedback
    drop constraint if exists app_feedback_user_id_fkey;

  alter table public.app_feedback
    add constraint app_feedback_user_id_fkey
    foreign key (user_id)
    references public.profiles(id)
    on delete cascade
    not valid;

  if to_regclass('public.water_reader_user_history') is not null
    and not exists (
      select 1
      from pg_constraint
      where conrelid = 'public.water_reader_user_history'::regclass
        and conname = 'water_reader_user_history_user_id_fkey'
    )
  then
    alter table public.water_reader_user_history
      add constraint water_reader_user_history_user_id_fkey
      foreign key (user_id)
      references public.profiles(id)
      on delete cascade
      not valid;
  end if;

  if to_regclass('public.water_reader_user_active_generation_requests') is not null
    and not exists (
      select 1
      from pg_constraint
      where conrelid = 'public.water_reader_user_active_generation_requests'::regclass
        and conname = 'water_reader_user_active_generation_requests_user_id_fkey'
    )
  then
    alter table public.water_reader_user_active_generation_requests
      add constraint water_reader_user_active_generation_requests_user_id_fkey
      foreign key (user_id)
      references public.profiles(id)
      on delete cascade
      not valid;
  end if;

  if to_regclass('public.app_feature_rate_limit_buckets') is not null
    and not exists (
      select 1
      from pg_constraint
      where conrelid = 'public.app_feature_rate_limit_buckets'::regclass
        and conname = 'app_feature_rate_limit_buckets_user_id_fkey'
    )
  then
    alter table public.app_feature_rate_limit_buckets
      add constraint app_feature_rate_limit_buckets_user_id_fkey
      foreign key (user_id)
      references public.profiles(id)
      on delete cascade
      not valid;
  end if;

  if to_regclass('public.waterbody_search_miss_events') is not null
    and not exists (
      select 1
      from pg_constraint
      where conrelid = 'public.waterbody_search_miss_events'::regclass
        and conname = 'waterbody_search_miss_events_user_id_fkey'
    )
  then
    alter table public.waterbody_search_miss_events
      add constraint waterbody_search_miss_events_user_id_fkey
      foreign key (user_id)
      references public.profiles(id)
      on delete set null
      not valid;
  end if;

  if to_regclass('public.water_reader_generation_jobs') is not null
    and not exists (
      select 1
      from pg_constraint
      where conrelid = 'public.water_reader_generation_jobs'::regclass
        and conname = 'water_reader_generation_jobs_requested_by_fkey'
    )
  then
    alter table public.water_reader_generation_jobs
      add constraint water_reader_generation_jobs_requested_by_fkey
      foreign key (requested_by)
      references public.profiles(id)
      on delete set null
      not valid;
  end if;
end $$;

-- Prelaunch lock for unfinished Smart Log/Catch Log client access.
drop policy if exists "sessions_select_own" on public.sessions;
drop policy if exists "sessions_insert_own" on public.sessions;
drop policy if exists "sessions_update_own" on public.sessions;
drop policy if exists "sessions_delete_own" on public.sessions;

drop policy if exists "catches_select_own" on public.catches;
drop policy if exists "catches_insert_own" on public.catches;
drop policy if exists "catches_update_own" on public.catches;
drop policy if exists "catches_delete_own" on public.catches;

notify pgrst, 'reload schema';

commit;
