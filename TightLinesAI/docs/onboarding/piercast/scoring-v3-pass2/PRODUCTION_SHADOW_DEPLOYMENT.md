# Formula v3 production shadow deployment

**Latest deployment verified:** September 18, 2026 UTC

**Supabase project:** `hsesngprhpgajyfbrwbf`

**Public state:** established 12-city Formula v3 catalog active; five current onboarding cities absent

## Current deployment

- Applied migrations through `20260917193000_pier_cast_v3_common_species_audit_v6.sql`.
- Deployed only the affected `pier-cast` and `pier-cast-ingest` Edge Functions.
- Triggered a fresh private v3 run through the Vault-backed ingestion function. The six-hour schedule and same-issue source-cohort gate remain in place.
- Corrected 18 established-Wisconsin salmonid calibrations in the active Formula v3 runtime. Historical v3 runs remain immutable.
- Added a final defensive 1.0–10.0 clamp after the existing Formula v3 input bounds; calibration generators reject any mode ceiling above 10.0.
- Kept Two Rivers, Kewaunee, Algoma, Manitowoc and Waukegan outside the runtime manifest and public catalog.

## Latest verified private run

| Field | Value |
|---|---|
| Run ID | `f545a44a-cc63-4187-a547-0aff3f8c7551` |
| Generated at | `2026-09-18T02:21:03.035Z` |
| NOAA source issue | `2026-09-17T18:00:00Z` |
| Configuration | `piercast-v3-twelve-city-common-species-audit-v6` |
| Engine | `pier-cast-opportunity-modes-v3-shadow-v1.4.0` |
| Formula | `piercast-opportunity-modes-bounded-temperature-v3` |
| Forecast manifest | 470/470 |
| Cities / pairs / dates | 12 / 94 / 5 |
| Lead days | exactly 0, 1, 2, 3, 4 |
| Score range | 1.0–8.27373395362149 |
| Preview / promotion | `true` / `blocked` |

Verified pair counts are Ludington 10, Grand Haven 15, Manistee 12,
Frankfort/Elberta 7, Sheboygan 4, Port Washington 4, Milwaukee 4, Racine 5,
Kenosha 5, Harbor Beach 7, Oscoda 10, and Port Sanilac 11. Every pair has
exactly five lead rows, every row has a mode and calibration ID, lead 0 uses
`remaining_day`, and leads 1–4 use `full_day`.

The Vault-backed trigger returned a request ID and produced a new v6 run with 470 available forecasts. The immediately preceding v5 run for the same NOAA source issue remains intact with 470 forecasts. The v6 run is append-only and did not rewrite v5 or any earlier run.

## Isolation checks

- Public `/catalog` returned HTTP 200 on Formula v3 with the established 12 cities and roster sizes `[10, 15, 12, 7, 4, 4, 4, 5, 5, 7, 10, 11]`.
- Two Rivers, Kewaunee, Algoma, Manitowoc and Waukegan are absent from that catalog.
- Anonymous reads of the private v3 run ledger returned HTTP 401 / PostgreSQL `42501` permission denied.
- Anonymous `/review/v3/outlook` returned HTTP 403 with `pier_cast_review_forbidden`.
- All current and historical v3 run-ledger records remain append-only private evidence. The live public projection is generated from the current calibrated Formula v3 runtime and coherent source cohorts.
- A post-deploy authenticated production smoke returned all 12 complete established-city reports, preserved the four-report free quota, and enforced the fifth-report paywall.

## Historical manifests preserved

The migration accepts all historical configuration versions, including v5, as
immutable prior evidence while requiring 470 rows for configuration v6. It
does not rewrite or reinterpret those earlier runs.

## Store-build starting position

- EAS account `tightlinesai` is connected to project `@tightlinesai/tightlines-ai` (`fbe2fc29-e0ac-49f0-a755-5a7c5f233d31`).
- The Expo configuration resolves app version `1.12`, iOS bundle ID and Android package `com.finseekr.finfindr`, and the EAS production build profile exists with remote app-version management.
- The local store-like prebuild environment check passed. All five required public Supabase, RevenueCat, and auth redirect variable names are configured in the production EAS environment; their values were not displayed during this check.
- TypeScript passed. The v3 quality gate passed 44/44 focused tests and 171,550 score invariants; the broader PierCast foundation suite passed 210/210 tests. Local iOS and Android Expo exports both bundled successfully.
- No iOS or Android production build was started, and no store submission was made. Those remain explicit release actions for the owner.
