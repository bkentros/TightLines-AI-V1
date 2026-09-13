-- Lifetime allowances are service-owned, separate from client-editable profiles.
create table public.feature_report_trials (
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null check (feature in ('color_match', 'pier_cast')),
  report_key text not null,
  envelope jsonb not null,
  used_at timestamptz not null default now(),
  primary key (user_id, feature)
);
alter table public.feature_report_trials enable row level security;
revoke all on public.feature_report_trials from anon, authenticated;
grant all on public.feature_report_trials to service_role;

create function public.claim_feature_report_trial(p_user_id uuid, p_feature text, p_report_key text, p_envelope jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare saved public.feature_report_trials;
begin
  insert into public.feature_report_trials(user_id,feature,report_key,envelope)
  values(p_user_id,p_feature,p_report_key,p_envelope) on conflict do nothing;
  select * into strict saved from public.feature_report_trials
    where user_id=p_user_id and feature=p_feature for update;
  if saved.report_key <> p_report_key then
    raise exception 'subscription_required';
  end if;
  -- Only the same city/report day can refresh. Its daily scores remain locked upstream.
  if p_feature='pier_cast' then
    update public.feature_report_trials set envelope=p_envelope
      where user_id=p_user_id and feature=p_feature;
    return p_envelope;
  end if;
  return saved.envelope;
end;
$$;
revoke all on function public.claim_feature_report_trial(uuid,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.claim_feature_report_trial(uuid,text,text,jsonb) to service_role;

-- Retain the validated/idempotent report writer; claim and insert share one transaction.
create function public.commit_color_picker_report_with_trial(p_user_id uuid,p_envelope jsonb,p_is_free boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare saved jsonb;
begin
  if p_is_free then
    perform pg_advisory_xact_lock(hashtextextended(p_user_id::text || ':color_match',0));
    select envelope into saved from public.feature_report_trials
      where user_id=p_user_id and feature='color_match';
    if found then
      if saved #>> '{request,typeId}' is distinct from p_envelope #>> '{request,typeId}'
         or saved #>> '{request,clarity}' is distinct from p_envelope #>> '{request,clarity}'
         or saved #>> '{request,date}' is distinct from p_envelope #>> '{request,date}' then
        raise exception 'subscription_required';
      end if;
      if saved #>> '{request,requestId}' = p_envelope #>> '{request,requestId}'
         and saved->'request' is distinct from p_envelope->'request' then
        raise exception 'color request conflict';
      end if;
      return saved;
    end if;
  end if;
  saved := public.commit_color_picker_report(p_user_id,p_envelope);
  if p_is_free then
    perform public.claim_feature_report_trial(p_user_id,'color_match',saved #>> '{selection,report,reportId}',saved);
  end if;
  return saved;
end;
$$;
revoke all on function public.commit_color_picker_report_with_trial(uuid,jsonb,boolean) from public,anon,authenticated;
grant execute on function public.commit_color_picker_report_with_trial(uuid,jsonb,boolean) to service_role;
