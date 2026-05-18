-- PostGIS was relocated from public to extensions by Supabase Support.
-- App-owned RPCs that use PostGIS must include extensions in their function
-- search_path so geometry/geography types and ST_* functions resolve reliably.

alter function public.water_reader_polygon_support_policy(text, extensions.geometry)
  set search_path = public, extensions;

alter function public.search_waterbodies_enrich_row(
  uuid,
  text,
  text,
  text,
  text,
  numeric,
  extensions.geometry,
  extensions.geometry
)
  set search_path = public, extensions;

alter function public.browse_waterbodies_by_state(text, text, integer)
  set search_path = public, extensions;

alter function public.search_waterbodies_impl_20260427(text, text, integer)
  set search_path = public, extensions;

alter function public.search_waterbodies(text, text, integer)
  set search_path = public, extensions;

alter function public.get_waterbody_polygon_for_reader(uuid)
  set search_path = public, extensions;

alter function public.get_waterbody_polygon_runtime_for_reader(uuid)
  set search_path = public, extensions;
