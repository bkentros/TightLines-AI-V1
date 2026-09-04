-- Close the remaining direct Data API surface around Water Reader discovery.
--
-- Mobile clients call the authenticated, rate-limited waterbody-search Edge
-- Function. These helpers are implementation details of that function and of
-- service-role maintenance scripts; allowing anon/authenticated callers to
-- execute them directly bypasses the Edge Function rate-limit boundary.

revoke execute on function public.browse_waterbodies_by_county(text, text, integer)
  from public, anon, authenticated;
revoke execute on function public.browse_waterbodies_by_state(text, text, integer)
  from public, anon, authenticated;
revoke execute on function public.browse_waterbodies_near_point(double precision, double precision, double precision, text, integer)
  from public, anon, authenticated;
revoke execute on function public.list_waterbody_counties_for_state(text, integer)
  from public, anon, authenticated;
revoke execute on function public.normalize_waterbody_name(text)
  from public, anon, authenticated;
revoke execute on function public.search_waterbodies(text, text, integer)
  from public, anon, authenticated;
revoke execute on function public.search_waterbodies_enrich_row(
  uuid,
  text,
  text,
  text,
  text,
  numeric,
  extensions.geometry,
  extensions.geometry
) from public, anon, authenticated;
revoke execute on function public.search_waterbodies_impl_20260427(text, text, integer)
  from public, anon, authenticated;
revoke execute on function public.water_reader_polygon_support_policy(text, extensions.geometry)
  from public, anon, authenticated;

grant execute on function public.browse_waterbodies_by_county(text, text, integer)
  to service_role;
grant execute on function public.browse_waterbodies_by_state(text, text, integer)
  to service_role;
grant execute on function public.browse_waterbodies_near_point(double precision, double precision, double precision, text, integer)
  to service_role;
grant execute on function public.list_waterbody_counties_for_state(text, integer)
  to service_role;
grant execute on function public.normalize_waterbody_name(text)
  to service_role;
grant execute on function public.search_waterbodies(text, text, integer)
  to service_role;
grant execute on function public.search_waterbodies_enrich_row(
  uuid,
  text,
  text,
  text,
  text,
  numeric,
  extensions.geometry,
  extensions.geometry
) to service_role;
grant execute on function public.search_waterbodies_impl_20260427(text, text, integer)
  to service_role;
grant execute on function public.water_reader_polygon_support_policy(text, extensions.geometry)
  to service_role;

-- Supabase's security advisor flags extension-owned objects in public. All
-- search functions already pin `extensions` in their trusted search path, and
-- existing indexes retain their operator-class OIDs when the extension moves.
alter extension pg_trgm set schema extensions;

-- The national index is bulk-loaded by backend jobs. Its statistics had never
-- been refreshed in production (41,778 actual rows vs. an estimate of 61),
-- which causes poor plans for trigram and prefix searches.
analyze public.waterbody_index;
analyze public.waterbody_aliases;

notify pgrst, 'reload schema';
