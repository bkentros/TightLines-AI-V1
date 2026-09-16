# Formula v3 production shadow deployment

**Latest deployment verified:** September 16, 2026 UTC

**Supabase project:** `hsesngprhpgajyfbrwbf`

**Public promotion:** blocked

## Current deployment

- Applied migration `20260915234500_expand_pier_cast_v3_species_manifest.sql` with exact local/remote migration parity.
- Deployed only the affected `pier-cast` and `pier-cast-ingest` Edge Functions.
- Preserved the Vault-backed six-hour private v3 schedule and its same-issue source-cohort gate.
- Kept Formula v2, the public five-city catalog, public roster sizes, and historical v3 runs unchanged.

## Latest verified private run

| Field | Value |
|---|---|
| Run ID | `5e41ef9e-b3bd-4a54-a3a4-2e1a13afcbb3` |
| Generated at | `2026-09-16T00:26:42.796Z` |
| NOAA source issue | `2026-09-15T12:00:00Z` |
| Configuration | `piercast-v3-twelve-city-species-expansion-v4` |
| Engine | `pier-cast-opportunity-modes-v3-shadow-v1.3.0` |
| Formula | `piercast-opportunity-modes-bounded-temperature-v3` |
| Forecast manifest | 470/470 |
| Cities / pairs / dates | 12 / 94 / 5 |
| Lead days | exactly 0, 1, 2, 3, 4 |
| Score range | 1.0–8.22929052219175 |
| Preview / promotion | `true` / `blocked` |

Verified pair counts are Ludington 10, Grand Haven 15, Manistee 12,
Frankfort/Elberta 7, Sheboygan 4, Port Washington 4, Milwaukee 4, Racine 5,
Kenosha 5, Harbor Beach 7, Oscoda 10, and Port Sanilac 11. Every pair has
exactly five lead rows, every row has a mode and calibration ID, lead 0 uses
`remaining_day`, and leads 1–4 use `full_day`.

## Isolation checks

- Public `/catalog` returned HTTP 200 on Formula v2 with the unchanged five cities and roster sizes `[6, 6, 8, 4, 4]`.
- The three Lake Huron review cities remain absent from the public catalog.
- Anonymous reads of the private v3 run ledger returned HTTP 401 / PostgreSQL `42501` permission denied.
- Anonymous `/review/v3/outlook` returned HTTP 403 with `pier_cast_review_forbidden`.
- All current and historical v3 records remain append-only private evidence; this deployment does not establish forecast accuracy.

## Historical manifests preserved

The migration accepts the historical 180-, 280-, and 350-row manifests as
immutable prior evidence while requiring 470 rows for configuration v4. It
does not rewrite or reinterpret those earlier runs.
