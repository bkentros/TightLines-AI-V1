-- Four distinct city/local-date PierCast reports per free account.
-- Preserve the first claim made under the earlier one-report policy.
create table public.pier_cast_report_claims (
  user_id uuid not null references auth.users(id) on delete cascade,
  report_key text not null,
  envelope jsonb not null,
  used_at timestamptz not null default now(),
  primary key (user_id, report_key)
);
create index pier_cast_report_claims_latest on public.pier_cast_report_claims (user_id, used_at desc);
alter table public.pier_cast_report_claims enable row level security;
revoke all on public.pier_cast_report_claims from anon, authenticated;
grant all on public.pier_cast_report_claims to service_role;

insert into public.pier_cast_report_claims (user_id, report_key, envelope, used_at)
select user_id, report_key, envelope, used_at
from public.feature_report_trials
where feature = 'pier_cast';

create function public.claim_pier_cast_report(p_user_id uuid, p_report_key text, p_envelope jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare used_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text || ':pier_cast', 0));
  -- An older Edge Function may have recorded the first claim after this migration.
  insert into public.pier_cast_report_claims (user_id, report_key, envelope, used_at)
  select user_id, report_key, envelope, used_at
  from public.feature_report_trials
  where user_id = p_user_id and feature = 'pier_cast'
  on conflict do nothing;
  if exists (
    select 1 from public.pier_cast_report_claims
    where user_id = p_user_id and report_key = p_report_key
  ) then
    update public.pier_cast_report_claims set envelope = p_envelope
    where user_id = p_user_id and report_key = p_report_key;
    return p_envelope;
  end if;
  select count(*) into used_count from public.pier_cast_report_claims where user_id = p_user_id;
  if used_count >= 4 then
    raise exception 'subscription_required';
  end if;
  insert into public.pier_cast_report_claims (user_id, report_key, envelope)
  values (p_user_id, p_report_key, p_envelope);
  return p_envelope;
end;
$$;
revoke all on function public.claim_pier_cast_report(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.claim_pier_cast_report(uuid,text,jsonb) to service_role;
