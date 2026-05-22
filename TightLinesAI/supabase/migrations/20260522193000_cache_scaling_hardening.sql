create index if not exists environment_snapshots_fresh_lookup_idx
  on public.environment_snapshots (
    latitude_bucket,
    longitude_bucket,
    units,
    captured_at desc
  );

drop policy if exists "environment_snapshots_service_role_all"
  on public.environment_snapshots;

create policy "environment_snapshots_service_role_all"
  on public.environment_snapshots
  for all
  to service_role
  using (true)
  with check (true);
