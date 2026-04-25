drop function if exists public.search_waterbodies(text, text, integer);

create or replace function public.search_waterbodies(
  query_text text,
  state_filter text default null,
  result_limit integer default 10
)
returns table (
  lake_id uuid,
  name text,
  state text,
  county text,
  waterbody_type text,
  surface_area_acres numeric,
  centroid_lat double precision,
  centroid_lon double precision,
  data_tier text,
  aerial_available boolean,
  depth_available boolean,
  depth_usability_status text,
  availability text,
  source_status text,
  best_available_mode text,
  confidence text
)
language sql
stable
as $$
  with params as (
    select
      public.normalize_waterbody_name(query_text) as norm_q,
      upper(nullif(trim(state_filter), '')) as state_q,
      greatest(1, least(coalesce(result_limit, 10), 25)) as row_limit
  ),
  candidate_matches as (
    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      case
        when w.normalized_name = p.norm_q then 0
        when w.normalized_name like p.norm_q || '%' then 10
        when w.normalized_name like '%' || p.norm_q || '%' then 20
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_index w
    cross join params p
    where
      p.norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and w.normalized_name like '%' || p.norm_q || '%'

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      case
        when a.normalized_alias_name = p.norm_q then 2
        when a.normalized_alias_name like p.norm_q || '%' then 12
        when a.normalized_alias_name like '%' || p.norm_q || '%' then 22
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_aliases a
    join public.waterbody_index w on w.id = a.waterbody_id
    cross join params p
    where
      p.norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and a.normalized_alias_name like '%' || p.norm_q || '%'
  ),
  deduped as (
    select
      c.*,
      row_number() over (
        partition by c.id
        order by c.rank_score, c.canonical_name, c.state_code, coalesce(c.county_name, '')
      ) as rn
    from candidate_matches c
  )
  select
    d.id as lake_id,
    d.canonical_name as name,
    d.state_code as state,
    d.county_name as county,
    d.waterbody_type,
    d.surface_area_acres,
    ST_Y(d.centroid) as centroid_lat,
    ST_X(d.centroid) as centroid_lon,
    coalesce(a.data_tier, 'polygon_only') as data_tier,
    coalesce(a.aerial_available, false) as aerial_available,
    coalesce(a.depth_machine_readable_available, false) or
      coalesce(a.depth_chart_image_available, false) as depth_available,
    coalesce(a.depth_usability_status, 'unavailable') as depth_usability_status,
    coalesce(a.availability, 'limited') as availability,
    coalesce(a.source_status, 'limited') as source_status,
    a.best_available_mode,
    coalesce(a.confidence, 'low') as confidence
  from deduped d
  left join public.waterbody_availability_snapshot a on a.lake_id = d.id
  cross join params p
  where d.rn = 1
  order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '')
  limit (select row_limit from params);
$$;
