-- USGS TNM national aerial policy: CONUS-first coverage exclusions (policy stays disabled).
-- Sets coverage.exclude_state_codes for AK, HI, PR, GU, MP; merges into existing coverage jsonb.
-- Does not set is_enabled = true. Apply production only after staging verification.
-- Prerequisite: policy row from 20260426230100_water_reader_usgs_tnm_registry_and_aerial_policy.sql

update public.water_reader_aerial_provider_policies
set
  coverage = coverage || jsonb_build_object(
    'exclude_state_codes', jsonb_build_array('AK', 'HI', 'PR', 'GU', 'MP'),
    'conus_first_note', 'Excluded until coverage QA; see WATER_READER_USGS_TNM_NATIONAL_AERIAL_APPROVAL_PACKET.md.'
  ),
  is_enabled = false,
  updated_at = timezone('utc', now())
where policy_key = 'usgs_tnm_naip_plus_national';
