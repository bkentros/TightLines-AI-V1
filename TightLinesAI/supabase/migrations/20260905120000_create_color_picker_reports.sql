-- Immutable snapshots; all writes go through the service-role RPC.
create table public.color_picker_reports (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id text not null,
  type_id text not null,
  clarity text not null check (clarity in ('clear','stained','dirty')),
  catalog_version text not null,
  selection_version text not null,
  lights text[] not null,
  envelope jsonb not null,
  created_at timestamptz not null,
  unique(user_id, request_id)
);
create index color_picker_history_idx on public.color_picker_reports(user_id,type_id,clarity,created_at desc);
alter table public.color_picker_reports enable row level security;
create policy color_picker_read_own on public.color_picker_reports for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.color_picker_reports from anon, authenticated;
grant select on public.color_picker_reports to authenticated;
grant all on public.color_picker_reports to service_role;

create function public.commit_color_picker_report(p_user_id uuid, p_envelope jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  saved jsonb;
  report jsonb := p_envelope #> '{selection,report}';
begin
  if report->>'userId' is distinct from p_user_id::text
     or report->>'requestId' is distinct from p_envelope #>> '{request,requestId}'
     or p_envelope->>'schemaVersion' is distinct from '1' then
    raise exception 'invalid color report';
  end if;
  insert into public.color_picker_reports(id,user_id,request_id,type_id,clarity,catalog_version,selection_version,lights,envelope,created_at)
  values ((report->>'reportId')::uuid,p_user_id,report->>'requestId',report->>'typeId',report->>'clarity',report->>'catalogVersion',report->>'selectionVersion',
    array(select g->>'light' from jsonb_array_elements(report->'groups') g),p_envelope,(report->>'generatedAt')::timestamptz)
  on conflict (user_id,request_id) do nothing;
  select envelope into strict saved from public.color_picker_reports where user_id=p_user_id and request_id=report->>'requestId';
  if saved->'request' is distinct from p_envelope->'request' then raise exception 'color request conflict' using errcode='P0001'; end if;
  return saved;
end;
$$;
revoke all on function public.commit_color_picker_report(uuid,jsonb) from public, anon, authenticated;
grant execute on function public.commit_color_picker_report(uuid,jsonb) to service_role;
