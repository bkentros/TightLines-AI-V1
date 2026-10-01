# Common-species audit deployment verification

Verified September 18, 2026 UTC against Supabase project `hsesngprhpgajyfbrwbf`.

## Applied runtime

- Configuration: `piercast-v3-twelve-city-common-species-audit-v6`
- Engine: `pier-cast-opportunity-modes-v3-shadow-v1.4.0`
- Formula: `piercast-opportunity-modes-bounded-temperature-v3`
- Migration: `20260917193000_pier_cast_v3_common_species_audit_v6.sql`
- Functions: `pier-cast` and `pier-cast-ingest`

## Fresh append-only evidence run

| Field | Verified value |
|---|---|
| Run ID | `f545a44a-cc63-4187-a547-0aff3f8c7551` |
| Generated | `2026-09-18T02:21:03.035Z` |
| NOAA source issue | `2026-09-17T18:00:00Z` |
| Forecasts | 470 |
| Cities | 12 |
| City/species pairs | 94 |
| Dates / lead days | 5 / exactly 0–4 |
| Available scores | 470/470 |
| Score range | 1.0–8.27373395362149 |
| Preview / promotion | `true` / `blocked` |

Every pair has five rows. Lead 0 uses `remaining_day`; leads 1–4 use `full_day`. The preceding v5 run for the same source issue remains present and unchanged.

## Visibility verification

- The public catalog is the already released 12-city Formula v3 catalog.
- Two Rivers, Kewaunee, Algoma, Manitowoc and Waukegan are absent from the public catalog and runtime forecast manifest.
- Anonymous access to `/review/v3/outlook` returns HTTP 403.
- Anonymous reads of the private run ledger return HTTP 401 / PostgreSQL `42501`.

This deploy corrects the established-city calibration scale while keeping all five current onboarding cities private until their later release pass.

## Hard score bound

The September 18 function redeploy adds an explicit final `clamp(1, 10, score)` after the existing input validation. Formula v3 also rejects fishery strength above 10, seasonal availability or thermal fit outside 0–1, and seasonal potential above fishery strength. Calibration generators now fail if a pair or mode ceiling falls outside 2.1–10.0. The post-deploy live smoke returned 12 complete established-city reports and the full local gate passed 45/45 focused tests plus 171,550 score invariants.
