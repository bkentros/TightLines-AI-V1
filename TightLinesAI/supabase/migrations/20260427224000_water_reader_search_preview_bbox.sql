-- Water Reader search: preview-only geometry-derived bbox for aerial source framing.
--
-- This bbox is a lightweight WGS84 envelope derived from waterbody geometry,
-- padded and clamped for non-interactive USGS exportImage preview framing only.
-- It is not analysis geometry and must not be used for overlays, scoring,
-- extraction, or final Water Reader map/report work.

drop function if exists public.search_waterbodies(text, text, integer);
drop function if exists public.search_waterbodies_enrich_row(uuid, text, text, text, text, numeric, geometry);

create or replace function public.search_waterbodies_enrich_row(
  in_id uuid,
  in_canonical_name text,
  in_state_code text,
  in_county_name text,
  in_waterbody_type text,
  in_surface_area_acres numeric,
  in_centroid geometry,
  in_geometry geometry
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
  preview_bbox_min_lon double precision,
  preview_bbox_min_lat double precision,
  preview_bbox_max_lon double precision,
  preview_bbox_max_lat double precision,
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
  with lm as (
    select
      coalesce(bool_or(l.source_mode = 'aerial' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and l.usability_status = 'usable'), false) as aerial_from_links,
      coalesce(bool_or(l.source_mode = 'depth' and l.depth_source_kind = 'machine_readable' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and l.lake_match_status = 'matched' and l.usability_status = 'usable'), false) as depth_machine_readable_available,
      coalesce(bool_or(l.source_mode = 'depth' and l.depth_source_kind = 'chart_image' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and l.lake_match_status = 'matched' and l.usability_status = 'usable'), false) as depth_chart_image_available,
      coalesce(bool_or(l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'unvalidated'), false) as has_pending,
      coalesce(bool_or(l.approval_status = 'approved' and (s.review_status <> 'allowed' or s.can_fetch = false or l.fetch_validation_status in ('blocked', 'unreachable') or l.lake_match_status = 'mismatched' or l.usability_status = 'not_usable')), false) as has_blocked_candidate,
      coalesce(bool_or(l.source_mode = 'depth' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and (l.lake_match_status <> 'matched' or l.usability_status <> 'usable')), false) as has_depth_pending_match_or_usability
    from public.waterbody_source_links l
    join public.source_registry s on s.id = l.source_id
    where l.waterbody_id = in_id
  ),
  pm as (
    select exists (
      select 1
      from public.water_reader_aerial_provider_policies p
      join public.source_registry s on s.id = p.source_id
      where p.is_enabled = true
        and p.approval_status = 'approved'
        and s.review_status = 'allowed'
        and s.can_fetch = true
        and s.source_type = 'aerial_imagery'
        and p.provider_health_status = 'reachable'
        and not (coalesce(p.coverage -> 'exclude_state_codes', '[]'::jsonb) @> to_jsonb(in_state_code))
    ) as aerial_from_policy
  ),
  bbox_raw as (
    select
      ST_XMin(env)::double precision as min_lon,
      ST_YMin(env)::double precision as min_lat,
      ST_XMax(env)::double precision as max_lon,
      ST_YMax(env)::double precision as max_lat
    from (
      select ST_Envelope(in_geometry) as env
      where in_geometry is not null and not ST_IsEmpty(in_geometry)
    ) e
  ),
  bbox_padded as (
    select
      (min_lon + max_lon) / 2.0 as center_lon,
      (min_lat + max_lat) / 2.0 as center_lat,
      least(
        0.18,
        greatest(0.002, ((max_lat - min_lat) / 2.0) * 1.08)
      ) as half_lat,
      least(
        0.18 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))),
        greatest(
          0.002 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))),
          ((max_lon - min_lon) / 2.0) * 1.08
        )
      ) as half_lon
    from bbox_raw
    where min_lon < max_lon and min_lat < max_lat
  ),
  bbox as (
    select
      greatest(-180.0, center_lon - half_lon) as min_lon,
      greatest(-90.0, center_lat - half_lat) as min_lat,
      least(180.0, center_lon + half_lon) as max_lon,
      least(90.0, center_lat + half_lat) as max_lat
    from bbox_padded
  ),
  m as (
    select
      lm.aerial_from_links or pm.aerial_from_policy as aerial_available,
      lm.depth_machine_readable_available,
      lm.depth_chart_image_available,
      lm.has_pending,
      lm.has_blocked_candidate,
      lm.has_depth_pending_match_or_usability
    from lm cross join pm
  )
  select
    in_id as lake_id,
    in_canonical_name as name,
    in_state_code as state,
    in_county_name as county,
    in_waterbody_type as waterbody_type,
    in_surface_area_acres as surface_area_acres,
    ST_Y(in_centroid) as centroid_lat,
    ST_X(in_centroid) as centroid_lon,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.min_lon else null end as preview_bbox_min_lon,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.min_lat else null end as preview_bbox_min_lat,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.max_lon else null end as preview_bbox_max_lon,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.max_lat else null end as preview_bbox_max_lat,
    case
      when m.aerial_available and m.depth_machine_readable_available then 'full_depth_aerial'
      when m.depth_machine_readable_available then 'depth_only'
      when m.depth_chart_image_available then 'chart_aligned_depth'
      when m.aerial_available then 'aerial_only'
      else 'polygon_only'
    end as data_tier,
    m.aerial_available,
    m.depth_machine_readable_available or m.depth_chart_image_available as depth_available,
    case when m.depth_machine_readable_available or m.depth_chart_image_available then 'usable' when m.has_depth_pending_match_or_usability then 'needs_review' else 'unavailable' end as depth_usability_status,
    case when m.aerial_available and (m.depth_machine_readable_available or m.depth_chart_image_available) then 'both_available' when m.depth_machine_readable_available or m.depth_chart_image_available then 'depth_available' when m.aerial_available then 'aerial_available' when m.has_blocked_candidate then 'blocked' else 'limited' end as availability,
    case when m.aerial_available or m.depth_machine_readable_available or m.depth_chart_image_available then 'ready' when m.has_pending or m.has_depth_pending_match_or_usability then 'partial' when m.has_blocked_candidate then 'blocked' else 'limited' end as source_status,
    case when m.depth_machine_readable_available or m.depth_chart_image_available then 'depth' when m.aerial_available then 'aerial' else null end as best_available_mode,
    case when m.depth_machine_readable_available then 'high' when m.aerial_available or m.depth_chart_image_available then 'medium' else 'low' end as confidence
  from m
  left join bbox b on true;
$$;

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
  preview_bbox_min_lon double precision,
  preview_bbox_min_lat double precision,
  preview_bbox_max_lon double precision,
  preview_bbox_max_lat double precision,
  data_tier text,
  aerial_available boolean,
  depth_available boolean,
  depth_usability_status text,
  availability text,
  source_status text,
  best_available_mode text,
  confidence text
)
language plpgsql
stable
as $$
declare
  norm_q text := public.normalize_waterbody_name(query_text);
  state_q text := upper(nullif(trim(state_filter), ''));
  row_limit int := greatest(1, least(coalesce(result_limit, 10), 25));
  specific_tokens text[] := array[]::text[];
  single_token_generic boolean := false;
  short_generic_prefix boolean := false;
  long_tok text := null;
begin
  with tokens as (
    select lower(btrim(tk)) as token
    from unnest(string_to_array(norm_q, ' ')) as u(tk)
    where length(btrim(tk)) > 0
  ),
  specific as (
    select distinct token
    from tokens
    where token not in (
      'lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res',
      'the', 'a', 'an', 'of', 'and', 'or', '&'
    )
  )
  select
    coalesce(array_agg(s.token order by s.token), array[]::text[]),
    (
      (select count(*) from tokens) = 1
      and exists (
        select 1
        from tokens
        where token in ('lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res')
      )
    ),
    exists (
      select 1
      from tokens
      where token in ('lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res')
    )
    and (select count(*) from specific) = 1
    and (select max(length(token)) from specific) = 1,
    (select token from specific order by char_length(token) desc nulls last limit 1)
  into specific_tokens, single_token_generic, short_generic_prefix, long_tok
  from specific s;

  if short_generic_prefix then
    return query
    with candidate_matches as (
      select * from (
        select
          w.id,
          w.canonical_name,
          w.state_code,
          w.county_name,
          w.waterbody_type,
          w.surface_area_acres,
          w.centroid,
          w.geometry,
          case
            when w.normalized_name = norm_q then 0
            when w.normalized_name like norm_q || '%' then 10
            else 100
          end + w.search_priority as rank_score
        from public.waterbody_index w
        where
          norm_q <> ''
          and w.is_named = true
          and w.is_searchable = true
          and w.waterbody_type in ('lake', 'pond', 'reservoir')
          and (state_q is null or w.state_code = state_q)
          and w.normalized_name like norm_q || '%'
        order by w.search_priority, w.canonical_name, w.state_code, coalesce(w.county_name, '')
        limit 50
      ) phrase

      union all

      select * from (
        select
          w.id,
          w.canonical_name,
          w.state_code,
          w.county_name,
          w.waterbody_type,
          w.surface_area_acres,
          w.centroid,
          w.geometry,
          case
            when a.normalized_alias_name = norm_q then 2
            when a.normalized_alias_name like norm_q || '%' then 12
            else 100
          end + w.search_priority as rank_score
        from public.waterbody_aliases a
        join public.waterbody_index w on w.id = a.waterbody_id
        where
          norm_q <> ''
          and w.is_named = true
          and w.is_searchable = true
          and w.waterbody_type in ('lake', 'pond', 'reservoir')
          and (state_q is null or w.state_code = state_q)
          and a.normalized_alias_name like norm_q || '%'
        order by w.search_priority, w.canonical_name, w.state_code, coalesce(w.county_name, '')
        limit 50
      ) alias_phrase
    ),
    deduped as (
      select
        c.*,
        row_number() over (
          partition by c.id
          order by c.rank_score, c.canonical_name, c.state_code, coalesce(c.county_name, '')
        ) as rn
      from candidate_matches c
    ),
    limited as materialized (
      select *
      from deduped d
      where d.rn = 1
      order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '')
      limit row_limit
    )
    select e.*
    from limited d
    cross join lateral public.search_waterbodies_enrich_row(
      d.id,
      d.canonical_name,
      d.state_code,
      d.county_name,
      d.waterbody_type,
      d.surface_area_acres,
      d.centroid,
      d.geometry
    ) e
    order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '');
    return;
  end if;

  return query
  with candidate_matches as (
    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      case
        when w.normalized_name = norm_q then 0
        when w.normalized_name like norm_q || '%' then 10
        when (not single_token_generic) and w.normalized_name like '%' || norm_q || '%' then 20
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_index w
    where
      norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and (not single_token_generic)
      and w.normalized_name like '%' || norm_q || '%'

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      case
        when w.normalized_name = norm_q then 0
        when w.normalized_name like norm_q || '%' then 10
        when (not single_token_generic) and w.normalized_name like '%' || norm_q || '%' then 20
        when coalesce(array_length(specific_tokens, 1), 0) >= 1
          and not exists (
            select 1
            from unnest(specific_tokens) as q(tok)
            where w.normalized_name not like '%' || q.tok || '%'
          )
        then 24
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_index w
    where
      norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and coalesce(array_length(specific_tokens, 1), 0) >= 1
      and long_tok is not null
      and w.normalized_name like '%' || long_tok || '%'
      and not exists (
        select 1
        from unnest(specific_tokens) as q2(tok)
        where w.normalized_name not like '%' || q2.tok || '%'
      )

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      case
        when a.normalized_alias_name = norm_q then 2
        when a.normalized_alias_name like norm_q || '%' then 12
        when (not single_token_generic) and a.normalized_alias_name like '%' || norm_q || '%' then 22
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_aliases a
    join public.waterbody_index w on w.id = a.waterbody_id
    where
      norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and (not single_token_generic)
      and a.normalized_alias_name like '%' || norm_q || '%'

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      case
        when a.normalized_alias_name = norm_q then 2
        when a.normalized_alias_name like norm_q || '%' then 12
        when (not single_token_generic) and a.normalized_alias_name like '%' || norm_q || '%' then 22
        when coalesce(array_length(specific_tokens, 1), 0) >= 1
          and not exists (
            select 1
            from unnest(specific_tokens) as q4(tok)
            where a.normalized_alias_name not like '%' || q4.tok || '%'
          )
        then 26
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_aliases a
    join public.waterbody_index w on w.id = a.waterbody_id
    where
      norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and coalesce(array_length(specific_tokens, 1), 0) >= 1
      and long_tok is not null
      and a.normalized_alias_name like '%' || long_tok || '%'
      and not exists (
        select 1
        from unnest(specific_tokens) as q5(tok)
        where a.normalized_alias_name not like '%' || q5.tok || '%'
      )
  ),
  deduped as (
    select
      c.*,
      row_number() over (
        partition by c.id
        order by c.rank_score, c.canonical_name, c.state_code, coalesce(c.county_name, '')
      ) as rn
    from candidate_matches c
  ),
  limited as materialized (
    select *
    from deduped d
    where d.rn = 1
    order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '')
    limit row_limit
  )
  select e.*
  from limited d
  cross join lateral public.search_waterbodies_enrich_row(
    d.id,
    d.canonical_name,
    d.state_code,
    d.county_name,
    d.waterbody_type,
    d.surface_area_acres,
    d.centroid,
    d.geometry
  ) e
  order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '');
end;
$$;

select pg_notify('pgrst', 'reload schema');
