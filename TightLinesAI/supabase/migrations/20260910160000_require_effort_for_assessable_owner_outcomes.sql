alter table public.pier_cast_shadow_outcomes
  drop constraint pier_cast_shadow_outcomes_evidence_quality_check;

alter table public.pier_cast_shadow_outcomes
  add constraint pier_cast_shadow_outcomes_evidence_quality_check
  check (evidence_quality in (
    'direct_effort',
    'direct_observation',
    'verified_quantitative',
    'verified_qualitative'
  ));

alter table public.pier_cast_shadow_outcomes
  add constraint pier_cast_shadow_owner_evidence_check
  check (
    source_type <> 'owner_trip'
    or (
      assessment_status = 'assessable'
      and evidence_quality = 'direct_effort'
      and effort_minutes is not null
    )
    or (
      assessment_status <> 'assessable'
      and evidence_quality = 'direct_observation'
      and effort_minutes is null
    )
  );

comment on constraint pier_cast_shadow_owner_evidence_check
  on public.pier_cast_shadow_outcomes is
  'Owner-trip positives and zeroes require explicit effort; access/condition observations remain non-outcomes without fishing effort.';
