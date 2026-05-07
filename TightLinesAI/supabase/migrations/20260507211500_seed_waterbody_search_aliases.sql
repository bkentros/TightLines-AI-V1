-- Water Reader search aliases for high-traffic fisheries and common names.
--
-- `waterbody_aliases` already participates in public.search_waterbodies().
-- This seed keeps official hydrography names searchable by the names anglers
-- actually type, without changing the canonical waterbody_index rows.

with alias_seed(state_code, canonical_name, alias_name) as (
  values
    ('TX', 'Lake Fork Reservoir', 'Lake Fork'),
    ('TX', 'Lake Fork Reservoir', 'Fork Reservoir'),
    ('TX', 'Sam Rayburn Reservoir', 'Sam Rayburn'),
    ('TX', 'Sam Rayburn Reservoir', 'Lake Sam Rayburn'),
    ('TX', 'Sam Rayburn Reservoir', 'Rayburn Reservoir'),
    ('LA', 'Toledo Bend Reservoir', 'Toledo Bend'),
    ('LA', 'Toledo Bend Reservoir', 'Toledo Bend Lake'),
    ('LA', 'Toledo Bend Reservoir', 'Toledo Bend Reservoir'),
    ('MO', 'Lake of the Ozarks', 'Ozarks'),
    ('MO', 'Lake of the Ozarks', 'Lake Ozark'),
    ('MO', 'Lake of the Ozarks', 'LOZ'),
    ('MO', 'Table Rock Lake', 'Table Rock'),
    ('MO', 'Table Rock Lake', 'Table Rock Reservoir'),
    ('TN', 'Kentucky Lake', 'Kentucky Reservoir'),
    ('AL', 'Guntersville Lake', 'Lake Guntersville'),
    ('FL', 'Lake Okeechobee', 'Okeechobee'),
    ('FL', 'Lake Okeechobee', 'Big O'),
    ('TX', 'Falcon Reservoir', 'Falcon Lake'),
    ('TX', 'Falcon Reservoir', 'Lake Falcon'),
    ('TX', 'Falcon Reservoir', 'Falcon International Reservoir'),
    ('TX', 'Amistad Reservoir', 'Lake Amistad'),
    ('TX', 'Amistad Reservoir', 'Amistad Lake'),
    ('GA', 'Lake Sidney Lanier', 'Lake Lanier'),
    ('GA', 'Lake Sidney Lanier', 'Lanier'),
    ('GA', 'Lake Sidney Lanier', 'Sidney Lanier'),
    ('GA', 'Hartwell Lake', 'Lake Hartwell'),
    ('SC', 'Hartwell Lake', 'Lake Hartwell'),
    ('OK', 'Eufaula Lake', 'Lake Eufaula'),
    ('VT', 'Lake Champlain', 'Champlain')
),
targets as (
  select distinct on (w.state_code, w.canonical_name)
    w.id,
    w.state_code,
    w.canonical_name
  from public.waterbody_index w
  join alias_seed s
    on s.state_code = w.state_code
   and s.canonical_name = w.canonical_name
  order by
    w.state_code,
    w.canonical_name,
    w.surface_area_acres desc nulls last,
    w.search_priority,
    w.id
)
insert into public.waterbody_aliases (
  waterbody_id,
  alias_name,
  alias_source
)
select
  t.id,
  s.alias_name,
  'launch_seed'
from alias_seed s
join targets t
  on t.state_code = s.state_code
 and t.canonical_name = s.canonical_name
on conflict (waterbody_id, normalized_alias_name) do update
set alias_source = excluded.alias_source;
