-- Water Reader: aerial provider policy (national/regional) without per-waterbody aerial links.
-- See WATER_READER_MASTER_PLAN.md §0.4.7. Attribution, license, and storage flags stay on source_registry.
-- No policy rows are seeded; is_enabled defaults false; approval_status defaults pending_review.

create table if not exists public.water_reader_aerial_provider_policies (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.source_registry (id) on delete restrict,
  policy_key text not null unique,
  display_name text not null,
  is_enabled boolean not null default false,
  approval_status text not null default 'pending_review' check (
    approval_status in ('pending_review', 'approved', 'rejected')
  ),
  provider_health_status text not null default 'unvalidated' check (
    provider_health_status in ('unvalidated', 'reachable', 'unreachable', 'unsupported', 'blocked')
  ),
  provider_health_method text not null default 'head' check (
    provider_health_method in ('head', 'get')
  ),
  provider_health_target_url text,
  provider_health_checked_at timestamptz,
  provider_health_http_status integer,
  provider_health_error text,
  -- Example: { "exclude_state_codes": ["AK", "HI"], "notes": "optional ops context" }
  coverage jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists water_reader_aerial_provider_policies_source_idx
  on public.water_reader_aerial_provider_policies (source_id);

create index if not exists water_reader_aerial_provider_policies_enabled_idx
  on public.water_reader_aerial_provider_policies (is_enabled, approval_status)
  where is_enabled = true;

drop trigger if exists water_reader_aerial_provider_policies_set_updated_at
  on public.water_reader_aerial_provider_policies;
create trigger water_reader_aerial_provider_policies_set_updated_at
before update on public.water_reader_aerial_provider_policies
for each row execute function public.set_generic_updated_at();

alter table public.water_reader_aerial_provider_policies enable row level security;

-- Aerial from policy requires: enabled, policy approved, registry allowed+fetchable, aerial_imagery type,
-- provider health reachable, and lake state not listed in coverage.exclude_state_codes.
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
link_metrics as (
  select
    w.id as lake_id,
    coalesce(
      bool_or(
        le.source_mode = 'aerial'
        and le.is_fetch_ready
        and le.usability_status = 'usable'
      ),
      false
    ) as aerial_from_links,
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
),
policy_metrics as (
  select
    w.id as lake_id,
    exists (
      select 1
      from public.water_reader_aerial_provider_policies p
      join public.source_registry s on s.id = p.source_id
      where
        p.is_enabled = true
        and p.approval_status = 'approved'
        and s.review_status = 'allowed'
        and s.can_fetch = true
        and s.source_type = 'aerial_imagery'
        and p.provider_health_status = 'reachable'
        -- exclude_state_codes: JSON array of 2-letter state codes, uppercase (e.g. ["AK","HI"]).
        and not (
          coalesce(p.coverage->'exclude_state_codes', '[]'::jsonb)
          @> to_jsonb(w.state_code)
        )
    ) as aerial_from_policy
  from public.waterbody_index w
),
metrics as (
  select
    lm.lake_id,
    (lm.aerial_from_links or pm.aerial_from_policy) as aerial_available,
    lm.depth_machine_readable_available,
    lm.depth_chart_image_available,
    lm.has_pending,
    lm.has_blocked_candidate,
    lm.has_depth_pending_match_or_usability
  from link_metrics lm
  join policy_metrics pm on pm.lake_id = lm.lake_id
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

-- Verification (run manually on staging / local DB; roll back any test INSERTs):
--
-- A) Empty policy table preserves link-only aerial: compare a lake with only aerial links to the same
--    lake_id before/after policy inserts — with zero rows in water_reader_aerial_provider_policies,
--    aerial_available should equal the per-link OR path only (policy_metrics.aerial_from_policy is false).
--    select count(*) from public.water_reader_aerial_provider_policies;  -- expect 0 after clean apply
--
-- B) Disabled / pending / unvalidated must not widen aerial: a row with is_enabled=false OR
--    approval_status <> 'approved' OR provider_health_status <> 'reachable' must not make
--    aerial_from_policy true (snapshot should match B for lakes without usable aerial links).
--
-- C) Exclusion: enabled+approved+reachable policy with coverage '{"exclude_state_codes":["MN"]}'
--    must not apply to lakes where waterbody_index.state_code = 'MN' (use a non-MN lake to see
--    policy aerial if testing end-to-end). exclude_state_codes values should match state_code casing.
--
-- Smoke: select lake_id, aerial_available from public.waterbody_availability_snapshot limit 5;
