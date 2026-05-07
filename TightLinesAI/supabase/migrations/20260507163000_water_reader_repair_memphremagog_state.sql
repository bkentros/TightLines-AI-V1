-- Correct Lake Memphremagog from the NY preload envelope to its expected
-- Vermont search bucket. The US-side lake access/user search expectation is
-- Orleans County, VT; the source polygon centroid falls north of the US line,
-- which left county enrichment null during preload.

update public.waterbody_index
set
  state_code = 'VT',
  county_name = 'Orleans',
  region_key = 'northeast',
  source_summary = coalesce(source_summary, '{}'::jsonb) || jsonb_build_object(
    'manual_launch_repair',
    jsonb_build_object(
      'reason', 'corrected cross-border preload state bucket for Lake Memphremagog',
      'state_code', 'VT',
      'county_name', 'Orleans'
    )
  )
where id = '8d9ea1f6-8a82-405c-b6ea-6e6567e12218'
  and canonical_name = 'Lake Memphremagog';

