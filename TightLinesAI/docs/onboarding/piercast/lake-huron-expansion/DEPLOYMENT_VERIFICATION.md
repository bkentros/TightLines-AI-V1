# PierCast Lake Huron Production Deployment Verification

Deployment and verification date: 2026-09-15 UTC

Project: linked FinFindr production Supabase project

Implementation head deployed: `11015a803cb2a31ffe90423799596b9c8b24a359`

## Release boundary

This deployment activates only the private, disabled Formula v3 shadow path for Harbor Beach, Oscoda, and Port Sanilac. It does not promote Formula v3, change public Formula v2 scores, change public release rosters, or submit an application build. Specialist review, independent temperature representation, prospective outcome sampling, and explicit public-promotion gates remain blocked.

## Database migration

- Remote reconciliation showed exactly one pending migration: `20260915230000_expand_pier_cast_v3_lake_huron_manifest.sql`.
- Linked-project dry-run showed that same migration and no unrelated migration.
- The migration applied successfully.
- Post-apply migration parity is exact through `20260915230000`.
- Pre-deployment isolated PostgreSQL verification applied the complete migration and exercised the 70-pair manifest, historical 180/280 run constraints, new 350 run constraint, service-role-only functions, and source cron schedules.

## Edge Functions

Only the two affected functions were deployed. JWT verification remained enabled.

| Function | Production version | Status | Updated at (UTC) | Bundle SHA-256 |
| --- | ---: | --- | --- | --- |
| `pier-cast-ingest` | 21 | active | 2026-09-15T17:38:35.666Z | `a03dd2f86a91d15c53e3458bd8da9d7eebc4accb0a112baad06c41fea2691adf` |
| `pier-cast` | 30 | active | 2026-09-15T17:38:43.311Z | `afec35c75e50bd0d744d88c3dd77352cfe8dcdb59e02854303b0849b80424117` |

## Source-cohort verification

The first combined invocation correctly returned HTTP 503 because the existing primary and Wisconsin archives were on the 06:00 UTC issue while Lake Huron was on 12:00 UTC. No run was written and no mixed-issue outlook was constructed. After explicitly ingesting the existing primary and Wisconsin source cohorts, all three cohorts were verified on one issue:

| Cohort | Cities | Rows | Unique hours per city | LMHOFS issue |
| --- | ---: | ---: | ---: | --- |
| Primary Michigan/Lake Michigan | 5 | 605 | 121 | 2026-09-15T12:00:00Z |
| Wisconsin | 4 | 484 | 121 | 2026-09-15T12:00:00Z |
| Lake Huron | 3 | 363 | 121 | 2026-09-15T12:00:00Z |

The resulting combined source has 12 cities and 1,452 hourly samples. This confirms the same-issue fail-closed gate and recovery path in production.

## Private Formula v3 run

Production run ID: `7d264893-a06a-4bd9-adb1-139b78a50e40`

| Field | Verified value |
| --- | --- |
| Generated at | 2026-09-15T18:05:28.544Z |
| Source issue | 2026-09-15T12:00:00Z |
| Configuration | `piercast-v3-twelve-city-lake-huron-v3` |
| Engine | `pier-cast-opportunity-modes-v3-shadow-v1.2.0` |
| Formula | `piercast-opportunity-modes-bounded-temperature-v3` |
| Cities | 12 |
| Admitted pairs | 70 |
| Forecast rows | 350 |
| Dates | 5 (`2026-09-15` through `2026-09-19`) |
| Lead days | exactly 0, 1, 2, 3, 4 |
| Rows per pair | exactly 5 |
| Score range | 1.0 through 8.22929052219175 |
| Preview-only | every run/row boundary verified |
| Promotion status | every run/row is `blocked` |
| Assessment scope | lead 0 `remaining_day`; leads 1–4 `full_day` |

City roster sizes were verified as Ludington 8, Grand Haven 11, Manistee 10, Frankfort/Elberta 5, Sheboygan 4, Port Washington 4, Milwaukee 4, Racine 5, Kenosha 5, Harbor Beach 2, Oscoda 9, and Port Sanilac 3. Their exact sum is 70.

Historical evidence remains readable and unchanged:

- Run `72c7ee33-fe7b-4691-af69-69b156846001`: 180 rows, 9 cities, 36 pairs, 5 dates.
- Run `6550d54e-5bc7-46ab-9615-97cf30d4a9f5`: 280 rows, 9 cities, 56 pairs, 5 dates.

## Owner, privacy, and public isolation

- An existing allowlisted owner Auth user was not present. With explicit owner authorization, the allowlisted production owner user was provisioned through Supabase's non-emailed magic-link flow.
- The one-time session returned HTTP 200 from `/review/catalog` with all 12 cities and from `/review/v3/outlook` with all 12 cities, five dates per city, 1,452 source samples, and a 70-pair variable-roster sum.
- The one-time verification session was revoked with local scope (HTTP 204); no password was created or changed and other sessions were not affected.
- Anonymous access to both private v3 ledger tables was denied with HTTP 401.
- Anonymous access to the owner v3 route was denied with HTTP 403.
- Deployed authorization tests cover authenticated non-owner rejection; no production authorization rule or grant was relaxed.
- Public `/catalog` remained HTTP 200 on Formula v2 with exactly five cities and roster sizes `[6, 6, 8, 4, 4]`. None of the three unreleased Lake Huron cities appeared.

## QA and security

Before deployment:

- `npm run qa:pier-cast:foundation`: 206 Deno tests and 4 standings tests passed.
- `npm run qa:pier-cast:v3-pass2`: 40 tests passed.
- All deterministic Lake Huron, v3, legacy seasonal, remaining-species, Phase 2, private-roster, Phase 3, and seasonal-replay checks passed.
- `npx tsc --noEmit` passed.
- `git diff --check` passed.
- Implementation-head Gitleaks and CodeQL workflows passed.

The deployment-record commit must also pass Gitleaks and CodeQL before final handoff. No credentials, magic-link values, access tokens, or private owner data are recorded in this report.
