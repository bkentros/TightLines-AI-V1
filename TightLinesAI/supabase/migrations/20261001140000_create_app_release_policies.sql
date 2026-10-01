-- Remotely enables one dismissible store-update notice per released native
-- build. This table contains public release metadata only; clients may read it
-- but only the service role can change it.

create table public.app_release_policies (
  platform text primary key check (platform in ('ios', 'android')),
  enabled boolean not null default false,
  latest_build integer not null default 0 check (latest_build >= 0),
  latest_version text not null default '' check (length(latest_version) <= 32),
  store_url text not null check (
    store_url ~ '^https://' and length(store_url) <= 500
  ),
  title text not null default 'UPDATE AVAILABLE' check (length(title) <= 80),
  message text not null default
    'A newer FinFindr release is ready with the latest fixes and improvements.'
    check (length(message) <= 300),
  updated_at timestamptz not null default now()
);

alter table public.app_release_policies enable row level security;
revoke all on public.app_release_policies from public, anon, authenticated;
grant select on public.app_release_policies to anon, authenticated;
grant all on public.app_release_policies to service_role;

create policy "Public release policies are readable"
  on public.app_release_policies
  for select
  to anon, authenticated
  using (true);

insert into public.app_release_policies (
  platform,
  enabled,
  latest_build,
  latest_version,
  store_url
)
values
  (
    'ios',
    false,
    0,
    '',
    'https://apps.apple.com/app/id6769178136'
  ),
  (
    'android',
    false,
    0,
    '',
    'https://play.google.com/store/apps/details?id=com.finseekr.finfindr'
  );

comment on table public.app_release_policies is
  'Public, read-only native release metadata for the dismissible app update prompt.';
