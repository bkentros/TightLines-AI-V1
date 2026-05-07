-- Water Reader shared-state search support.
--
-- Some large border waters are stored once in waterbody_index because there is
-- one hydrography polygon, but anglers expect to find them from either state.
-- This table makes that mapping explicit instead of guessing from geometry.

create table if not exists public.waterbody_shared_states (
  id uuid primary key default gen_random_uuid(),
  waterbody_id uuid not null references public.waterbody_index (id) on delete cascade,
  search_state_code text not null check (search_state_code ~ '^[A-Z]{2}$'),
  display_state_code text not null check (display_state_code ~ '^[A-Z]{2}$'),
  reason text not null default 'shared_border_waterbody',
  created_at timestamptz not null default timezone('utc', now()),
  unique (waterbody_id, search_state_code)
);

create index if not exists waterbody_shared_states_lookup_idx
  on public.waterbody_shared_states (search_state_code, waterbody_id);

alter table public.waterbody_shared_states enable row level security;

with shared_seed(state_code, canonical_name, search_state_code, display_state_code, reason) as (
  values
    ('LA', 'Toledo Bend Reservoir', 'LA', 'LA', 'shared_border_waterbody'),
    ('LA', 'Toledo Bend Reservoir', 'TX', 'TX', 'shared_border_waterbody')
),
targets as (
  select distinct on (w.state_code, w.canonical_name, s.search_state_code)
    w.id,
    s.search_state_code,
    s.display_state_code,
    s.reason
  from shared_seed s
  join public.waterbody_index w
    on w.state_code = s.state_code
   and w.canonical_name = s.canonical_name
  order by
    w.state_code,
    w.canonical_name,
    s.search_state_code,
    w.surface_area_acres desc nulls last,
    w.search_priority,
    w.id
)
insert into public.waterbody_shared_states (
  waterbody_id,
  search_state_code,
  display_state_code,
  reason
)
select
  id,
  search_state_code,
  display_state_code,
  reason
from targets
on conflict (waterbody_id, search_state_code) do update
set
  display_state_code = excluded.display_state_code,
  reason = excluded.reason;
