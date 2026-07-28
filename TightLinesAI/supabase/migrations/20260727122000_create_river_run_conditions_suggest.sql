alter table public.river_run_daily_progression_snapshots
  rename column schedule to conditions_suggest;

alter table public.river_run_daily_progression_snapshots
  rename column favorability_summaries to evidence_summaries;

create table if not exists public.river_run_conditions_suggest_baselines (
  id bigserial primary key,
  river_id text not null,
  run_id text not null,
  checkpoint_id text not null
    check (
      checkpoint_id in (
        'river_start',
        'building_start',
        'peak_start',
        'peak_complete'
      )
    ),
  reference_day_of_year integer not null
    check (reference_day_of_year between 1 and 365),
  observation_start_day_of_year integer not null
    check (observation_start_day_of_year between 1 and 365),
  baseline_version text not null,
  gauge_metric text not null
    check (gauge_metric in ('flow_cfs', 'gage_height_ft')),
  gauge_site_id text not null,
  temperature_source_id text not null,
  component_samples jsonb not null,
  historical_samples jsonb not null,
  index_percentiles jsonb not null,
  distinct_years integer not null check (distinct_years >= 5),
  expected_days integer not null check (expected_days >= 5),
  minimum_usable_days integer not null
    check (
      minimum_usable_days >= 5 and
      minimum_usable_days <= expected_days
    ),
  source_notes text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (
    river_id,
    run_id,
    checkpoint_id,
    baseline_version
  )
);

create index if not exists river_run_conditions_suggest_baselines_lookup_idx
  on public.river_run_conditions_suggest_baselines (
    river_id,
    run_id,
    baseline_version,
    checkpoint_id
  );

alter table public.river_run_conditions_suggest_baselines
  enable row level security;

drop policy if exists "river_run_conditions_suggest_baselines_service_role_all"
  on public.river_run_conditions_suggest_baselines;

create policy "river_run_conditions_suggest_baselines_service_role_all"
  on public.river_run_conditions_suggest_baselines
  for all
  to service_role
  using (true)
  with check (true);

revoke all
  on table public.river_run_conditions_suggest_baselines
  from anon, authenticated;
