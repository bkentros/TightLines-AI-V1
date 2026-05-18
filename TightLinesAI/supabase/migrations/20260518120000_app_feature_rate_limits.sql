create table if not exists public.app_feature_rate_limit_buckets (
  user_id uuid not null,
  feature text not null,
  window_seconds integer not null,
  window_start timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, feature, window_seconds, window_start),
  constraint app_feature_rate_limit_buckets_feature_check
    check (char_length(feature) between 1 and 80),
  constraint app_feature_rate_limit_buckets_window_check
    check (window_seconds between 1 and 2678400),
  constraint app_feature_rate_limit_buckets_count_check
    check (request_count >= 0)
);

create index if not exists app_feature_rate_limit_buckets_window_start_idx
  on public.app_feature_rate_limit_buckets (window_start);

alter table public.app_feature_rate_limit_buckets enable row level security;

drop policy if exists "app_feature_rate_limit_buckets_service_role_all"
  on public.app_feature_rate_limit_buckets;

create policy "app_feature_rate_limit_buckets_service_role_all"
  on public.app_feature_rate_limit_buckets
  for all
  to service_role
  using (true)
  with check (true);

create or replace function public.consume_app_feature_rate_limit(
  in_user_id uuid,
  in_feature text,
  in_window_seconds integer,
  in_max_requests integer,
  in_now timestamptz default now()
)
returns table (
  allowed boolean,
  feature text,
  window_seconds integer,
  max_requests integer,
  request_count integer,
  remaining integer,
  reset_at timestamptz,
  retry_after_seconds integer
)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  normalized_feature text := left(nullif(btrim(in_feature), ''), 80);
  normalized_window integer := greatest(coalesce(in_window_seconds, 60), 1);
  normalized_max integer := greatest(coalesce(in_max_requests, 1), 1);
  bucket_start timestamptz;
  bucket_reset_at timestamptz;
  new_count integer;
begin
  if in_user_id is null or normalized_feature is null then
    return query
    select false, coalesce(normalized_feature, 'unknown'), normalized_window,
      normalized_max, 0, 0, in_now + make_interval(secs => normalized_window),
      normalized_window;
    return;
  end if;

  bucket_start := to_timestamp(
    floor(extract(epoch from in_now) / normalized_window) * normalized_window
  );
  bucket_reset_at := bucket_start + make_interval(secs => normalized_window);

  insert into public.app_feature_rate_limit_buckets (
    user_id,
    feature,
    window_seconds,
    window_start,
    request_count,
    updated_at
  )
  values (
    in_user_id,
    normalized_feature,
    normalized_window,
    bucket_start,
    1,
    timezone('utc', now())
  )
  on conflict on constraint app_feature_rate_limit_buckets_pkey
  do update set
    request_count = public.app_feature_rate_limit_buckets.request_count + 1,
    updated_at = timezone('utc', now())
  returning public.app_feature_rate_limit_buckets.request_count into new_count;

  if random() < 0.02 then
    delete from public.app_feature_rate_limit_buckets
    where window_start < in_now - interval '3 days';
  end if;

  return query
  select
    new_count <= normalized_max,
    normalized_feature,
    normalized_window,
    normalized_max,
    new_count,
    greatest(normalized_max - new_count, 0),
    bucket_reset_at,
    case
      when new_count <= normalized_max then 0
      else greatest(1, ceiling(extract(epoch from (bucket_reset_at - in_now)))::integer)
    end;
end;
$$;

revoke all on table public.app_feature_rate_limit_buckets from anon, authenticated;
revoke all on function public.consume_app_feature_rate_limit(uuid, text, integer, integer, timestamptz) from public;

grant execute on function public.consume_app_feature_rate_limit(uuid, text, integer, integer, timestamptz)
  to service_role;

notify pgrst, 'reload schema';
