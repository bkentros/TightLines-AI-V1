# Grand River River Run Acceptance

**River ID:** `grand`\
**Release configuration:** `2026-08-25-grand-release.1`\
**Owner acceptance:** granted 2026-08-25\
**Public catalog:** approved

## Released scope

- Fall Chinook, Fall Coho, and Fall Steelhead are enabled.
- Fish In River calendars, strength ceilings, section progression, endpoint
  behavior, copy, and four-primitive output were reviewed and accepted.
- Migratory guidance stops at Webber Dam and stays conservative wherever the
  complete current passage route is not established.
- Activity represents the downtown Grand Rapids mainstem only: Fulton Street
  hydraulics, North Park measured temperature, and Grand Rapids weather. Copy
  must not imply that these readings directly describe Grand Haven or the full
  lower river.
- Every source is freshness-gated independently. Missing or stale readings
  reduce confidence or make the affected primitive unavailable; no value is
  fabricated.

## Release evidence

- All three species passed deterministic calendar, endpoint, copy, provider,
  partial/missing-data, and production endpoint tests.
- Fixed historical Activity replays and stage-mean audits passed. Peak has the
  highest stage mean for every species; warm, barrier, blown-out, and missing
  evidence caps remain authoritative.
- Generated owner-review fixtures and UI/copy QA passed.
- Product owner accepted the rendered review on 2026-08-25.
- Local and linked Supabase migration histories were reconciled before release.
- Production uses the static catalog (`RIVER_RUN_CONFIG_SOURCE=static`) with the
  public release gate enabled.

## Known limits

- Fulton Street was reconstructed; its rating/source behavior must be re-audited
  if USGS publishes a material change.
- Activity is a conditions response for a fish already present, not a live fish
  count, abundance estimate, catch forecast, access statement, or safety claim.
- Passage, regulations, closures, gauge metadata, or station changes trigger a
  targeted re-audit before expanding the modeled corridor.

Acceptance, deployment, and production smoke results are recorded in the release
commit and deployment log; any later correction must update this packet and the
reusable onboarding guidance when it reveals a general rule.
