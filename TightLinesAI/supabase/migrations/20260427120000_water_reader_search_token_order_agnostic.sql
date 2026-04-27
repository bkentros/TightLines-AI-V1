-- Water Reader search: token-order-agnostic matching for lake names.
-- User queries often use a different word order than GNIS or the canonical
-- 3DHP `canonical_name` (e.g. "Lake Oakland" vs stored "Oakland Lake").
-- The previous implementation required the full normalized query as one
-- substring, so "lake oakland" could not match `normalized_name` "oakland lake".
-- This adds: all *specific* (non-generic waterbody) query tokens must appear
-- as substrings in the name, in any order. Generic terms (lake, pond, …) are
-- ignored for that conjunct so they do not break cross-order matches.
-- Single-token generic-only queries (e.g. "lake" alone) do not use the broad
-- legacy substring, to avoid a noisy national or large-state list.

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
  with
  p0 as (
    select
      public.normalize_waterbody_name(query_text) as norm_q,
      upper(nullif(trim(state_filter), '')) as state_q,
      greatest(1, least(coalesce(result_limit, 10), 25)) as row_limit
  ),
  p as (
    select
      p0.norm_q,
      p0.state_q,
      p0.row_limit,
      coalesce(st.specific_tokens, array[]::text[]) as specific_tokens,
      st.single_token_generic
    from p0
    cross join lateral (
      select
        coalesce((
          select array_agg(s.x order by s.x)
          from (
            select distinct lower(btrim(tk)) as x
            from unnest(string_to_array(p0.norm_q, ' ')) as u(tk)
            where length(btrim(tk)) > 0
              and lower(btrim(tk)) not in (
                'lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res',
                'the', 'a', 'an', 'of', 'and', 'or', '&'
              )
          ) s
        ), array[]::text[]) as specific_tokens,
        (
          (select count(*)::int
           from unnest(string_to_array(p0.norm_q, ' ')) as u1(t1)
           where length(btrim(t1)) > 0) = 1
          and exists (
            select 1
            from unnest(string_to_array(p0.norm_q, ' ')) as u2(t2)
            where length(btrim(t2)) > 0
              and lower(btrim(t2)) in (
                'lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res'
              )
          )
        ) as single_token_generic
    ) st
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
        when (not p.single_token_generic) and w.normalized_name like '%' || p.norm_q || '%' then 20
        when
          coalesce(array_length(p.specific_tokens, 1), 0) >= 1
          and not exists (
            select 1
            from unnest(p.specific_tokens) as q(tok)
            where w.normalized_name not like '%' || q.tok || '%'
          )
        then 24
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_index w
    cross join p
    where
      p.norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and (
        (not p.single_token_generic) and w.normalized_name like '%' || p.norm_q || '%'
        or (
          coalesce(array_length(p.specific_tokens, 1), 0) >= 1
          and not exists (
            select 1
            from unnest(p.specific_tokens) as q2(tok)
            where w.normalized_name not like '%' || q2.tok || '%'
          )
        )
      )
      and (
        case
          when w.normalized_name = p.norm_q then 0
          when w.normalized_name like p.norm_q || '%' then 10
          when (not p.single_token_generic) and w.normalized_name like '%' || p.norm_q || '%' then 20
          when
            coalesce(array_length(p.specific_tokens, 1), 0) >= 1
            and not exists (
              select 1
              from unnest(p.specific_tokens) as q3(tok)
              where w.normalized_name not like '%' || q3.tok || '%'
            )
          then 24
          else 100
        end
        < 100
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
      case
        when a.normalized_alias_name = p.norm_q then 2
        when a.normalized_alias_name like p.norm_q || '%' then 12
        when (not p.single_token_generic) and a.normalized_alias_name like '%' || p.norm_q || '%' then 22
        when
          coalesce(array_length(p.specific_tokens, 1), 0) >= 1
          and not exists (
            select 1
            from unnest(p.specific_tokens) as q4(tok)
            where a.normalized_alias_name not like '%' || q4.tok || '%'
          )
        then 26
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_aliases a
    join public.waterbody_index w on w.id = a.waterbody_id
    cross join p
    where
      p.norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and (
        (not p.single_token_generic) and a.normalized_alias_name like '%' || p.norm_q || '%'
        or (
          coalesce(array_length(p.specific_tokens, 1), 0) >= 1
          and not exists (
            select 1
            from unnest(p.specific_tokens) as q5(tok)
            where a.normalized_alias_name not like '%' || q5.tok || '%'
          )
        )
      )
      and (
        case
          when a.normalized_alias_name = p.norm_q then 2
          when a.normalized_alias_name like p.norm_q || '%' then 12
          when (not p.single_token_generic) and a.normalized_alias_name like '%' || p.norm_q || '%' then 22
          when
            coalesce(array_length(p.specific_tokens, 1), 0) >= 1
            and not exists (
              select 1
              from unnest(p.specific_tokens) as q6(tok)
              where a.normalized_alias_name not like '%' || q6.tok || '%'
            )
          then 26
          else 100
        end
        < 100
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
    coalesce(snap.data_tier, 'polygon_only') as data_tier,
    coalesce(snap.aerial_available, false) as aerial_available,
    coalesce(snap.depth_machine_readable_available, false) or
      coalesce(snap.depth_chart_image_available, false) as depth_available,
    coalesce(snap.depth_usability_status, 'unavailable') as depth_usability_status,
    coalesce(snap.availability, 'limited') as availability,
    coalesce(snap.source_status, 'limited') as source_status,
    snap.best_available_mode,
    coalesce(snap.confidence, 'low') as confidence
  from deduped d
  left join public.waterbody_availability_snapshot snap on snap.lake_id = d.id
  cross join p
  where d.rn = 1
  order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '')
  limit (select row_limit from p);
$$;

-- Manual verification (local / psql after apply; not run from CI):
--   select name, state from search_waterbodies('lake oakland', 'MI', 5);
--   select name, state from search_waterbodies('oakland', 'MI', 5);
--   select count(*) from search_waterbodies('lake', 'MI', 25);
--   select name from search_waterbodies('lake oakland', 'MI', 3);
