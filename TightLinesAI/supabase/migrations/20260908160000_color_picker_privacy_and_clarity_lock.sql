-- Color Match no longer needs coordinates or forecast snapshots. Existing
-- immutable choices remain intact while unnecessary context is redacted.
update public.color_picker_reports
set envelope = jsonb_set(
  envelope - 'weather',
  '{request}',
  (envelope->'request') - 'latitude' - 'longitude' - 'window',
  false
)
where envelope ? 'weather'
   or envelope->'request' ?| array['latitude', 'longitude', 'window'];

drop index if exists public.color_picker_daily_unique;
create unique index color_picker_daily_unique
  on public.color_picker_reports(user_id, type_id, clarity, daily_date)
  where daily_date is not null;

create or replace function public.commit_color_picker_report(p_user_id uuid, p_envelope jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  saved jsonb;
  report jsonb := p_envelope #> '{selection,report}';
  report_day date;
begin
  if p_envelope->>'schemaVersion' is distinct from '2'
     or p_envelope ? 'weather'
     or p_envelope->'request' ?| array['latitude', 'longitude', 'window']
     or report->>'selectionVersion' is distinct from '4.0.0'
     or report->>'userId' is distinct from p_user_id::text
     or report->>'requestId' is distinct from p_envelope #>> '{request,requestId}'
     or report->>'typeId' is distinct from p_envelope #>> '{request,typeId}'
     or report->>'clarity' is distinct from p_envelope #>> '{request,clarity}' then
    raise exception 'invalid color report';
  end if;

  report_day := (p_envelope #>> '{request,date}')::date;
  if report_day is distinct from ((report->>'generatedAt')::timestamptz at time zone (p_envelope #>> '{request,timezone}'))::date
     or jsonb_typeof(report->'groups') is distinct from 'array'
     or jsonb_array_length(report->'groups') <> 2
     or (select array_agg(g->>'light' order by g->>'light') from jsonb_array_elements(report->'groups') g)
        is distinct from array['cloudy','sunny']
     or exists (
       select 1
       from jsonb_array_elements(report->'groups') g
       where jsonb_typeof(g->'patternIds') is distinct from 'array'
          or jsonb_array_length(g->'patternIds') <> 2
          or (select count(distinct value) from jsonb_array_elements_text(g->'patternIds')) <> 2
     ) then
    raise exception 'invalid daily color report';
  end if;

  insert into public.color_picker_reports(
    id,user_id,request_id,type_id,clarity,catalog_version,selection_version,
    lights,envelope,created_at,daily_date
  ) values (
    (report->>'reportId')::uuid,p_user_id,report->>'requestId',report->>'typeId',
    report->>'clarity',report->>'catalogVersion',report->>'selectionVersion',
    array(select g->>'light' from jsonb_array_elements(report->'groups') g),
    p_envelope,(report->>'generatedAt')::timestamptz,report_day
  ) on conflict do nothing;

  select envelope into saved
  from public.color_picker_reports
  where user_id=p_user_id and request_id=report->>'requestId';
  if found then
    if saved->'request' is distinct from p_envelope->'request' then
      raise exception 'color request conflict' using errcode='P0001';
    end if;
    return saved;
  end if;

  select envelope into strict saved
  from public.color_picker_reports
  where user_id=p_user_id
    and type_id=report->>'typeId'
    and clarity=report->>'clarity'
    and daily_date=report_day;
  return saved;
end;
$$;
revoke all on function public.commit_color_picker_report(uuid,jsonb) from public, anon, authenticated;
grant execute on function public.commit_color_picker_report(uuid,jsonb) to service_role;
