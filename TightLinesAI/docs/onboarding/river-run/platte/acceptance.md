# Platte River River Run Acceptance

**River ID:** `platte`\
**Release configuration:** `2026-08-25-platte-release.1`\
**Owner acceptance:** granted 2026-08-25\
**Public catalog:** approved

## Released scope

- Fall Chinook, Fall Coho, and Fall Steelhead are enabled below the Lower Platte
  River Weir.
- Species calendars and strengths are river-specific: Coho is the signature
  concentrated run, while Chinook and Steelhead retain their independently
  researched timing and ceilings.
- Activity is an explicitly Limited, lower-corridor weather-only response for a
  fish already present. It uses effective light and restrained same-block
  precipitation and never invents lower-river flow, clarity, or temperature.
- The Honor USGS station is upstream. It may appear as an attributed Gauge Read
  but is excluded from lower-corridor Activity and Fishability.
- Invalid, stale, `Eqp`, or missing provider values are suppressed. A later
  fresh numeric observation restores Gauge Read automatically without a redeploy
  or manual toggle.

## Release evidence

- All three species passed calendar, endpoint, copy, outage/recovery,
  weather-only Activity, and production endpoint tests.
- Fixed 2007–2025 weather replays and stage-mean audits passed; lifecycle stage
  behavior and weather-only confidence ceilings remain bounded.
- Generated owner-review fixtures and UI/copy QA passed.
- Product owner accepted the rendered review on 2026-08-25.
- Local and linked Supabase migration histories were reconciled before release.
- Production uses the static catalog with the public release gate enabled.

## Known limits

- No accepted lower-corridor hydraulic or measured water-temperature source is
  currently available, so Fishability remains unavailable and Activity remains
  Limited weather-only.
- Activity does not infer fish abundance, migration, catch probability, access,
  or safety.
- Weir operations, passage, regulations, station metadata, or new lower-river
  sensors trigger a targeted re-audit.

Acceptance, deployment, and production smoke results are recorded in the release
commit and deployment log; any later correction must update this packet and the
reusable onboarding guidance when it reveals a general rule.
