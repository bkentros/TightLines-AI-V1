-- Account deletion lifecycle hardening.
--
-- Profile-owned tables already cascade through public.profiles. These tables
-- were missing FK lifecycle behavior or retained feedback PII after profile
-- deletion. Use NOT VALID to avoid blocking deploys on any historical rows;
-- new writes are still enforced and future profile deletes cascade/scrub.

do $$
begin
  if to_regclass('public.app_feedback') is not null then
    alter table public.app_feedback
      drop constraint if exists app_feedback_user_id_fkey;

    alter table public.app_feedback
      add constraint app_feedback_user_id_fkey
      foreign key (user_id)
      references public.profiles(id)
      on delete cascade
      not valid;
  end if;

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

notify pgrst, 'reload schema';
