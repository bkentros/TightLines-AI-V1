-- Remove duplicate Burntside Lake expansion links on non-proposal waterbody_ids.
-- Early apply of 20260425213000 joined on (canonical_name, county_name); USGS 3DHP
-- indexes four St. Louis "Burntside Lake" fragments. Only
-- 0c8f5a80-b9bd-419e-a137-7f0a8809de56 is in the reviewed proposal.

delete from public.waterbody_source_links
where metadata->>'batch' = 'mn_dnr_depth_expansion_approved_12'
  and waterbody_id in (
    '4f8ddfd6-9a92-42a2-91f5-c4c8fafc9db6'::uuid,
    'b72ada36-42e4-4b71-b9df-074f2d4a158e'::uuid,
    'd011eb60-8a67-47cc-8e73-2c016e368719'::uuid
  );
