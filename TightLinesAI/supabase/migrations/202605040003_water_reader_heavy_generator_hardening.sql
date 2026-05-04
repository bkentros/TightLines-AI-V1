-- Water Reader heavy-generation hardening.
-- Runtime simplification is only for generation payload size/CPU management.
-- Original polygon validity, support labels, and QA flags remain authoritative.

revoke all on function public.get_waterbody_polygon_runtime_for_reader(uuid) from public;
revoke all on function public.get_waterbody_polygon_runtime_for_reader(uuid) from anon;
revoke all on function public.get_waterbody_polygon_runtime_for_reader(uuid) from authenticated;
grant execute on function public.get_waterbody_polygon_runtime_for_reader(uuid) to service_role;

comment on function public.get_waterbody_polygon_runtime_for_reader(uuid) is
  'Water Reader service-role-only runtime payload RPC. May return topology-preserving simplified GeoJSON for generation only; original support labels and QA flags remain authoritative.';

notify pgrst, 'reload schema';
