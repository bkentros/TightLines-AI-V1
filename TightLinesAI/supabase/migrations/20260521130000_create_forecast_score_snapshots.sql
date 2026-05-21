create table if not exists public.forecast_score_snapshots (
  snapshot_key text primary key,
  latitude_bucket numeric(6,2) not null,
  longitude_bucket numeric(7,2) not null,
  units text not null check (units in ('imperial', 'metric')),
  local_date date not null,
  timezone text not null,
  payload jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists forecast_score_snapshots_active_lookup_idx
  on public.forecast_score_snapshots (
    latitude_bucket,
    longitude_bucket,
    units,
    expires_at desc
  );

create index if not exists forecast_score_snapshots_local_date_idx
  on public.forecast_score_snapshots (local_date, created_at desc);

create or replace function public.set_forecast_score_snapshots_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists forecast_score_snapshots_set_updated_at
  on public.forecast_score_snapshots;

create trigger forecast_score_snapshots_set_updated_at
before update on public.forecast_score_snapshots
for each row
execute function public.set_forecast_score_snapshots_updated_at();

alter table public.forecast_score_snapshots enable row level security;

drop policy if exists "forecast_score_snapshots_service_role_all"
  on public.forecast_score_snapshots;

create policy "forecast_score_snapshots_service_role_all"
  on public.forecast_score_snapshots
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
