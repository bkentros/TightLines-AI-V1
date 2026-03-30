create table if not exists public.environment_snapshots (
  snapshot_key text primary key,
  latitude_bucket numeric(6,2) not null,
  longitude_bucket numeric(7,2) not null,
  units text not null check (units in ('imperial', 'metric')),
  local_date date not null,
  payload jsonb not null,
  captured_at timestamptz not null default timezone('utc', now()),
  has_hourly_weather boolean not null default false,
  weather_available boolean not null default false,
  tides_available boolean not null default false,
  water_temp_available boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists environment_snapshots_local_date_idx
  on public.environment_snapshots (local_date, captured_at desc);

create index if not exists environment_snapshots_geo_idx
  on public.environment_snapshots (latitude_bucket, longitude_bucket, local_date);

create or replace function public.set_environment_snapshots_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists environment_snapshots_set_updated_at on public.environment_snapshots;

create trigger environment_snapshots_set_updated_at
before update on public.environment_snapshots
for each row
execute function public.set_environment_snapshots_updated_at();

alter table public.environment_snapshots enable row level security;
