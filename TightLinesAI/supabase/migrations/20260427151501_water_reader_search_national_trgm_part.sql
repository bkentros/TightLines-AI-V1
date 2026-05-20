create extension if not exists pg_trgm;

create index if not exists waterbody_index_searchable_name_trgm_partial
  on public.waterbody_index
  using gin (normalized_name gin_trgm_ops)
  where is_named = true
    and is_searchable = true
    and waterbody_type in ('lake', 'pond', 'reservoir');

analyze public.waterbody_index;
analyze public.waterbody_aliases;
;
