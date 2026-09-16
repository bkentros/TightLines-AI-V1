# Formula v3 production shadow deployment

**Latest deployment verified:** September 16, 2026 UTC

**Supabase project:** `hsesngprhpgajyfbrwbf`

**Public promotion:** blocked

## Current deployment

- Applied migration `20260916220000_pier_cast_v3_seasonal_research_v5.sql` with exact local/remote migration parity.
- Deployed only the affected `pier-cast` and `pier-cast-ingest` Edge Functions.
- Triggered a fresh private v3 run through the Vault-backed ingestion function. The six-hour schedule and same-issue source-cohort gate remain in place.
- Kept Formula v2, the public five-city catalog, public roster sizes, and historical v3 runs unchanged.

## Latest verified private run

| Field | Value |
|---|---|
| Run ID | `1aba5832-ec9c-4a76-9a1b-eafa405d44e3` |
| Generated at | `2026-09-16T15:50:39.455Z` |
| NOAA source issue | `2026-09-16T06:00:00Z` |
| Configuration | `piercast-v3-twelve-city-seasonal-research-v5` |
| Engine | `pier-cast-opportunity-modes-v3-shadow-v1.4.0` |
| Formula | `piercast-opportunity-modes-bounded-temperature-v3` |
| Forecast manifest | 470/470 |
| Cities / pairs / dates | 12 / 94 / 5 |
| Lead days | exactly 0, 1, 2, 3, 4 |
| Score range | 1.0–8.24956453621518 |
| Preview / promotion | `true` / `blocked` |

Verified pair counts are Ludington 10, Grand Haven 15, Manistee 12,
Frankfort/Elberta 7, Sheboygan 4, Port Washington 4, Milwaukee 4, Racine 5,
Kenosha 5, Harbor Beach 7, Oscoda 10, and Port Sanilac 11. Every pair has
exactly five lead rows, every row has a mode and calibration ID, lead 0 uses
`remaining_day`, and leads 1–4 use `full_day`.

The private ingestion request returned HTTP 200 with `status=committed`, 12 cities, 1,452 coherent input samples, and 470 forecasts. The September 16 Milwaukee lead-0 scores are coho **6.79** and Chinook **6.26** with near-perfect temperature suitability. The immediately preceding v4 run for the same NOAA source issue remains intact with 470 forecasts; its Milwaukee coho and Chinook scores were 5.85 and 5.19. The new run is append-only and did not rewrite v4.

## Isolation checks

- Public `/catalog` returned HTTP 200 on Formula v2 with the unchanged five cities and roster sizes `[6, 6, 8, 4, 4]`.
- The three Lake Huron review cities remain absent from the public catalog.
- Anonymous reads of the private v3 run ledger returned HTTP 401 / PostgreSQL `42501` permission denied.
- Anonymous `/review/v3/outlook` returned HTTP 403 with `pier_cast_review_forbidden`.
- All current and historical v3 records remain append-only private evidence; this deployment does not establish forecast accuracy.

## Historical manifests preserved

The migration accepts all historical configuration versions, including v4, as
immutable prior evidence while requiring 470 rows for configuration v5. It
does not rewrite or reinterpret those earlier runs.

## Store-build starting position

- EAS account `tightlinesai` is connected to project `@tightlinesai/tightlines-ai` (`fbe2fc29-e0ac-49f0-a755-5a7c5f233d31`).
- The Expo configuration resolves app version `1.12`, iOS bundle ID and Android package `com.finseekr.finfindr`, and the EAS production build profile exists with remote app-version management.
- The local store-like prebuild environment check passed. All five required public Supabase, RevenueCat, and auth redirect variable names are configured in the production EAS environment; their values were not displayed during this check.
- TypeScript passed. The v3 quality gate passed 44/44 focused tests and 171,550 score invariants; the broader PierCast foundation suite passed 210/210 tests. Local iOS and Android Expo exports both bundled successfully.
- No iOS or Android production build was started, and no store submission was made. Those remain explicit release actions for the owner.
