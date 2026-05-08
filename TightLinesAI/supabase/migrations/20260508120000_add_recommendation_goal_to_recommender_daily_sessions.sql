alter table public.recommender_daily_sessions
  add column if not exists recommendation_goal text not null default 'all_purpose';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.recommender_daily_sessions'::regclass
      and conname = 'recommender_daily_sessions_recommendation_goal_check'
  ) then
    alter table public.recommender_daily_sessions
      add constraint recommender_daily_sessions_recommendation_goal_check
      check (recommendation_goal in ('all_purpose', 'big_fish'));
  end if;
end $$;

do $$
declare
  pk_name text;
begin
  select conname
  into pk_name
  from pg_constraint
  where conrelid = 'public.recommender_daily_sessions'::regclass
    and contype = 'p';

  if pk_name is not null then
    execute format(
      'alter table public.recommender_daily_sessions drop constraint %I',
      pk_name
    );
  end if;

  alter table public.recommender_daily_sessions
    add primary key (
      user_id,
      local_date,
      lat_key,
      lon_key,
      state_code,
      species,
      region_key,
      water_type,
      water_clarity,
      recommendation_goal,
      engine_version
    );
end $$;
