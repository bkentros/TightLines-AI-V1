-- Water Reader search discovery hardening.
--
-- Goals:
-- - Keep exact/prefix/name-token matches fast and ranked first.
-- - Let county/parish text help disambiguate instead of making searches fail.
-- - Use pg_trgm fuzzy matching as a last local fallback for misspellings and
--   official-name/common-name drift.
-- - Record zero/weak result searches so real user misses can become aliases.

create extension if not exists pg_trgm;

create index if not exists waterbody_index_normalized_county_name_trgm_idx
  on public.waterbody_index
  using gin (public.normalize_waterbody_name(coalesce(county_name, '')) gin_trgm_ops);

create table if not exists public.waterbody_search_miss_events (
  id uuid primary key default gen_random_uuid(),
  query_text text not null,
  normalized_query text not null,
  state_filter text,
  result_count integer not null default 0,
  fallback_attempted boolean not null default false,
  fallback_indexed_count integer not null default 0,
  top_result_name text,
  top_result_state text,
  top_result_county text,
  user_id uuid,
  request_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists waterbody_search_miss_events_created_at_idx
  on public.waterbody_search_miss_events (created_at desc);

create index if not exists waterbody_search_miss_events_state_query_idx
  on public.waterbody_search_miss_events (state_filter, normalized_query, created_at desc);

alter table public.waterbody_search_miss_events enable row level security;

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
  confidence text,
  water_reader_support_status text,
  water_reader_support_reason text,
  has_polygon_geometry boolean,
  polygon_area_acres double precision,
  polygon_qa_flags text[]
)
language plpgsql
stable
as $$
declare
  norm_q text := public.normalize_waterbody_name(query_text);
  state_q text := upper(nullif(trim(state_filter), ''));
  row_limit int := greatest(1, least(coalesce(result_limit, 10), 25));
  specific_tokens text[] := array[]::text[];
  local_tokens text[] := array[]::text[];
  single_token_generic boolean := false;
  short_generic_prefix boolean := false;
  long_tok text := null;
  specific_phrase text := '';
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
      'the', 'a', 'an', 'of', 'and', 'or', 'county', 'parish', 'borough',
      'municipality', 'township'
    )
  ),
  local_context as (
    select distinct token
    from tokens
    where token not in (
      'lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res',
      'the', 'a', 'an', 'of', 'and', 'or', 'county', 'parish', 'borough',
      'municipality', 'township'
    )
      and length(token) >= 3
  )
  select
    coalesce(array_agg(s.token order by s.token), array[]::text[]),
    coalesce(
      (select array_agg(l.token order by l.token) from local_context l),
      array[]::text[]
    ),
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
    (select token from specific order by char_length(token) desc nulls last, token limit 1),
    coalesce((select string_agg(s2.token, ' ' order by s2.token) from specific s2), '')
  into specific_tokens, local_tokens, single_token_generic, short_generic_prefix, long_tok, specific_phrase
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
      end
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
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
              and public.normalize_waterbody_name(coalesce(w.county_name, '')) not like '%' || q.tok || '%'
          )
        then 24
        else 100
      end
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q2(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q2.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
    from public.waterbody_index w
    where
      norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and coalesce(array_length(specific_tokens, 1), 0) >= 1
      and long_tok is not null
      and (
        w.normalized_name like '%' || long_tok || '%'
        or public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || long_tok || '%'
      )
      and not exists (
        select 1
        from unnest(specific_tokens) as q3(tok)
        where w.normalized_name not like '%' || q3.tok || '%'
          and public.normalize_waterbody_name(coalesce(w.county_name, '')) not like '%' || q3.tok || '%'
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
      end
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q4(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q4.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
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
            from unnest(specific_tokens) as q5(tok)
            where a.normalized_alias_name not like '%' || q5.tok || '%'
              and public.normalize_waterbody_name(coalesce(w.county_name, '')) not like '%' || q5.tok || '%'
          )
        then 26
        else 100
      end
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q6(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q6.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
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
      and (
        a.normalized_alias_name like '%' || long_tok || '%'
        or public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || long_tok || '%'
      )
      and not exists (
        select 1
        from unnest(specific_tokens) as q7(tok)
        where a.normalized_alias_name not like '%' || q7.tok || '%'
          and public.normalize_waterbody_name(coalesce(w.county_name, '')) not like '%' || q7.tok || '%'
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
      350
      - least(80, greatest(
          similarity(w.normalized_name, norm_q),
          similarity(w.normalized_name, specific_phrase),
          word_similarity(norm_q, w.normalized_name),
          word_similarity(specific_phrase, w.normalized_name)
        ) * 80)::integer
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q8(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q8.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
    from public.waterbody_index w
    where
      norm_q <> ''
      and char_length(norm_q) >= 4
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and (
        w.normalized_name % norm_q
        or (specific_phrase <> '' and w.normalized_name % specific_phrase)
        or word_similarity(norm_q, w.normalized_name) >= 0.52
        or (specific_phrase <> '' and word_similarity(specific_phrase, w.normalized_name) >= 0.52)
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
      335
      - least(80, greatest(
          similarity(a.normalized_alias_name, norm_q),
          similarity(a.normalized_alias_name, specific_phrase),
          word_similarity(norm_q, a.normalized_alias_name),
          word_similarity(specific_phrase, a.normalized_alias_name)
        ) * 80)::integer
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q9(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q9.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
    from public.waterbody_aliases a
    join public.waterbody_index w on w.id = a.waterbody_id
    where
      norm_q <> ''
      and char_length(norm_q) >= 4
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and (
        a.normalized_alias_name % norm_q
        or (specific_phrase <> '' and a.normalized_alias_name % specific_phrase)
        or word_similarity(norm_q, a.normalized_alias_name) >= 0.52
        or (specific_phrase <> '' and word_similarity(specific_phrase, a.normalized_alias_name) >= 0.52)
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
