-- Existing snapshots remain readable. New two-per-light reports get one daily
-- slot per user and broad bait, independent of clarity, location or request ID.
alter table public.color_picker_reports add column daily_date date;
create unique index color_picker_daily_unique
  on public.color_picker_reports(user_id, type_id, daily_date)
  where daily_date is not null;

create or replace function public.commit_color_picker_report(p_user_id uuid, p_envelope jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  saved jsonb;
  report jsonb := p_envelope #> '{selection,report}';
  report_day date;
begin
  if report->>'userId' is distinct from p_user_id::text
     or report->>'requestId' is distinct from p_envelope #>> '{request,requestId}'
     or report->>'typeId' is distinct from p_envelope #>> '{request,typeId}'
     or report->>'clarity' is distinct from p_envelope #>> '{request,clarity}'
     or p_envelope->>'schemaVersion' is distinct from '1' then
    raise exception 'invalid color report';
  end if;
  -- Only the new daily format reserves a slot; archived formats remain intact.
  if report->>'selectionVersion' = '3.0.0' then
    report_day := (p_envelope #>> '{request,date}')::date;
    if report_day is distinct from ((report->>'generatedAt')::timestamptz at time zone (p_envelope #>> '{request,timezone}'))::date
       or jsonb_array_length(report->'groups') <> 2
       or exists (select 1 from jsonb_array_elements(report->'groups') g where jsonb_array_length(g->'patternIds') <> 2) then
      raise exception 'invalid daily color report';
    end if;
  end if;
  insert into public.color_picker_reports(id,user_id,request_id,type_id,clarity,catalog_version,selection_version,lights,envelope,created_at,daily_date)
  values ((report->>'reportId')::uuid,p_user_id,report->>'requestId',report->>'typeId',report->>'clarity',report->>'catalogVersion',report->>'selectionVersion',
    array(select g->>'light' from jsonb_array_elements(report->'groups') g),p_envelope,(report->>'generatedAt')::timestamptz,report_day)
  on conflict do nothing;
  select envelope into saved from public.color_picker_reports where user_id=p_user_id and request_id=report->>'requestId';
  if found then
    if saved->'request' is distinct from p_envelope->'request' then raise exception 'color request conflict' using errcode='P0001'; end if;
    return saved;
  end if;
  select envelope into strict saved from public.color_picker_reports where user_id=p_user_id and type_id=report->>'typeId' and daily_date=report_day;
  return saved;
end;
$$;
revoke all on function public.commit_color_picker_report(uuid,jsonb) from public, anon, authenticated;
grant execute on function public.commit_color_picker_report(uuid,jsonb) to service_role;
