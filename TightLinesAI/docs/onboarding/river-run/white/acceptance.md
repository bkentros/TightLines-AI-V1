# White River River Run Acceptance

**River ID:** `white`\
**Release configuration:** `2026-08-25-white-release.1`\
**Owner acceptance:** granted 2026-08-25\
**Public catalog:** approved

## Released scope

- Fall Chinook, Fall Coho, and Fall Steelhead are enabled below Hesperia Dam.
- Hesperia Dam is the hard upstream endpoint; copy and section progression do
  not imply passage above it.
- Species calendars and strengths are independent. Coho remains an explicitly
  sparse run; its presence and Activity copy cannot imply Chinook- or
  Steelhead-level abundance.
- Fruitvale hydraulics and the below-Hesperia temperature station describe
  different reaches. They remain separately attributed and are never silently
  blended into one observed Activity score.
- Activity uses the accepted, independently replayed Limited weather-only model
  for a fish already present. Gauge Read reports each valid live source it can;
  stale or missing sources are suppressed and recover automatically.
- Corridor copy uses intermediate transitions rather than holding the same
  lower-river message across long calendar gaps.

## Release evidence

- All three species passed calendar, endpoint, corridor-copy, source-isolation,
  partial/missing-data, weather-only Activity, and production endpoint tests.
- Fixed historical weather replays and stage-mean audits passed.
- Generated owner-review fixtures and UI/copy QA passed.
- Product owner accepted the rendered review on 2026-08-25.
- Local and linked Supabase migration histories were reconciled before release.
- Production uses the static catalog with the public release gate enabled.

## Known limits

- Flow and temperature remain reach-specific observations; neither represents
  the entire White River corridor.
- Coho is documented but sparse, and the calibrated ceiling is not a fish count
  or dependable catch claim.
- Activity does not infer abundance, migration, catch probability, access, or
  safety. Dam passage, regulations, closures, or provider changes trigger a
  targeted re-audit.

Acceptance, deployment, and production smoke results are recorded in the release
commit and deployment log; any later correction must update this packet and the
reusable onboarding guidance when it reveals a general rule.
