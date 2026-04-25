-- Corrective follow-up migration for Water Reader backbone cleanup.
-- Purpose:
-- 1. Make source-link validation explicitly path-specific.
-- 2. Preserve provider health as a separate concept.
-- 3. Safely bring environments up to the intended schema even if an earlier
--    version of the backbone migration was already applied.

alter table if exists public.source_registry
  rename column validation_url to provider_health_check_url;

alter table if exists public.waterbody_source_links
  rename column fetch_validation_target_url to source_path_validation_target_url;

alter table if exists public.waterbody_source_links
  add column if not exists provider_health_status text
    not null default 'unvalidated'
    check (provider_health_status in ('unvalidated', 'reachable', 'unreachable', 'unsupported', 'blocked'));

alter table if exists public.waterbody_source_links
  add column if not exists provider_health_method text
    not null default 'head'
    check (provider_health_method in ('head', 'get'));

alter table if exists public.waterbody_source_links
  add column if not exists provider_health_target_url text;

alter table if exists public.waterbody_source_links
  add column if not exists provider_health_checked_at timestamptz;

alter table if exists public.waterbody_source_links
  add column if not exists provider_health_http_status integer;

alter table if exists public.waterbody_source_links
  add column if not exists provider_health_error text;

create index if not exists waterbody_source_links_provider_health_idx
  on public.waterbody_source_links (provider_health_status, source_mode);

update public.source_registry
set provider_health_check_url = null
where provider_key = 'ma_sample_chart';

update public.waterbody_source_links l
set
  source_path_validation_target_url = l.source_path,
  provider_health_status = case
    when s.provider_health_check_url is null then 'unvalidated'
    else l.provider_health_status
  end,
  provider_health_target_url = s.provider_health_check_url,
  provider_health_checked_at = case
    when s.provider_health_check_url is null then null
    else coalesce(l.provider_health_checked_at, l.fetch_validation_checked_at)
  end,
  provider_health_http_status = case
    when s.provider_health_check_url is null then null
    else coalesce(l.provider_health_http_status, l.fetch_validation_http_status)
  end,
  provider_health_error = case
    when s.provider_health_check_url is null then null
    else l.provider_health_error
  end
from public.source_registry s
where s.id = l.source_id;

create or replace view public.waterbody_availability_snapshot as
with link_eval as (
  select
    l.waterbody_id as lake_id,
    l.source_mode,
    l.depth_source_kind,
    l.approval_status,
    l.coverage_status,
    l.fetch_validation_status,
    l.lake_match_status,
    l.usability_status,
    s.review_status,
    s.can_fetch,
    (
      l.approval_status = 'approved'
      and s.review_status = 'allowed'
      and s.can_fetch = true
      and l.fetch_validation_status = 'reachable'
      and l.coverage_status not in ('blocked', 'unavailable')
    ) as is_fetch_ready,
    (
      l.approval_status = 'approved'
      and s.review_status = 'allowed'
      and s.can_fetch = true
      and l.fetch_validation_status = 'unvalidated'
    ) as is_pending,
    (
      l.approval_status = 'approved'
      and (
        s.review_status <> 'allowed'
        or s.can_fetch = false
        or l.fetch_validation_status in ('blocked', 'unreachable')
        or l.lake_match_status = 'mismatched'
        or l.usability_status = 'not_usable'
      )
    ) as is_blocked_candidate
  from public.waterbody_source_links l
  join public.source_registry s on s.id = l.source_id
),
metrics as (
  select
    w.id as lake_id,
    coalesce(
      bool_or(
        le.source_mode = 'aerial'
        and le.is_fetch_ready
        and le.usability_status = 'usable'
      ),
      false
    ) as aerial_available,
    coalesce(
      bool_or(
        le.source_mode = 'depth'
        and le.depth_source_kind = 'machine_readable'
        and le.is_fetch_ready
        and le.lake_match_status = 'matched'
        and le.usability_status = 'usable'
      ),
      false
    ) as depth_machine_readable_available,
    coalesce(
      bool_or(
        le.source_mode = 'depth'
        and le.depth_source_kind = 'chart_image'
        and le.is_fetch_ready
        and le.lake_match_status = 'matched'
        and le.usability_status = 'usable'
      ),
      false
    ) as depth_chart_image_available,
    coalesce(bool_or(le.is_pending), false) as has_pending,
    coalesce(bool_or(le.is_blocked_candidate), false) as has_blocked_candidate,
    coalesce(
      bool_or(
        le.source_mode = 'depth'
        and le.is_fetch_ready
        and (
          le.lake_match_status <> 'matched'
          or le.usability_status <> 'usable'
        )
      ),
      false
    ) as has_depth_pending_match_or_usability
  from public.waterbody_index w
  left join link_eval le on le.lake_id = w.id
  group by w.id
)
select
  m.lake_id,
  m.aerial_available,
  m.depth_machine_readable_available,
  m.depth_chart_image_available,
  case
    when m.aerial_available and m.depth_machine_readable_available then 'full_depth_aerial'
    when m.depth_machine_readable_available then 'depth_only'
    when m.depth_chart_image_available then 'chart_aligned_depth'
    when m.aerial_available then 'aerial_only'
    else 'polygon_only'
  end as data_tier,
  case
    when m.depth_machine_readable_available or m.depth_chart_image_available then 'depth'
    when m.aerial_available then 'aerial'
    else null
  end as best_available_mode,
  case
    when m.depth_machine_readable_available or m.depth_chart_image_available then 'usable'
    when m.has_depth_pending_match_or_usability then 'needs_review'
    else 'unavailable'
  end as depth_usability_status,
  case
    when m.aerial_available or m.depth_machine_readable_available or m.depth_chart_image_available then 'ready'
    when m.has_pending or m.has_depth_pending_match_or_usability then 'partial'
    when m.has_blocked_candidate then 'blocked'
    else 'limited'
  end as source_status,
  case
    when m.aerial_available and (m.depth_machine_readable_available or m.depth_chart_image_available) then 'both_available'
    when m.depth_machine_readable_available or m.depth_chart_image_available then 'depth_available'
    when m.aerial_available then 'aerial_available'
    when m.has_blocked_candidate then 'blocked'
    else 'limited'
  end as availability,
  case
    when m.depth_machine_readable_available then 'high'
    when m.aerial_available or m.depth_chart_image_available then 'medium'
    else 'low'
  end as confidence
from metrics m;
