# PierCast v1 Scope Freeze

**Frozen:** 2026-09-11\
**Scope version:** `piercast-five-city-four-species-v1`

PierCast v1 is closed to expansion while the initial product is validated. A
code-level roster in `config/scope.ts` and foundation tests prevent accidental
additions from becoming covered product scope.

## Cities

1. Ludington, Michigan
2. Grand Haven, Michigan
3. Manistee, Michigan
4. Frankfort–Elberta, Michigan
5. Sheboygan, Wisconsin

## Species

1. Chinook salmon
2. Coho salmon
3. Steelhead
4. Brown trout

The broader thirteen-species research inventory remains historical/discovery
material only. It is not PierCast v1 product scope and may not acquire a rating
curve or `ratingEnabled` state without a new scope version.

## Covered structures

| City              | Covered structure                                    |
| ----------------- | ---------------------------------------------------- |
| Ludington         | North Breakwater                                     |
| Grand Haven       | South Pier                                           |
| Manistee          | North Pier                                           |
| Frankfort–Elberta | Frankfort North Breakwater; Elberta South Breakwater |
| Sheboygan         | North Pier; South Pier                               |

Unresolved aliases and reported construction closures are deliberately excluded.
The exact IDs are frozen in code; a UI must count only structures with
`disposition: candidate`.

## Change control

A scope change requires all of the following:

- a new scope version;
- an explicit product decision approving expansion;
- authoritative access and structure identity evidence;
- a frozen seasonal curve and source plan;
- the same representation, outcome, privacy, and release gates as this cohort;
  and
- updated tests and onboarding dossiers.

Routine forecast refreshes, access reviews, sensor records, and outcome
observations do not change the frozen scope.
