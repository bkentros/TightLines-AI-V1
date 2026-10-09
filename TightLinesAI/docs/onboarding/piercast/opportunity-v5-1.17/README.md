# PierCast unified opportunity candidate — 1.17

Reviewed: 2026-10-09  
Runtime status: **1.17 app branch only; no Edge Function, database or live-app change**

## Decision

PierCast 1.17 uses one hidden opportunity calculation for all 18 configured
species and all 254 admitted city/species pairings:

`1 + (fishery strength - 1) × seasonal availability × (0.30 + 0.70 × temperature suitability)`

The maximum realized seasonal mode wins; modes never add together. Regulation,
targeting and access restrictions gate ranking before score order. Exact
unrounded opportunity orders rows. The UI receives only Prime, Good, Fair,
Poor or an unavailable/off-season state and never displays the number.

Lake trout uses the owner-approved October 2026 all-city replacement: 26
numeric cities and six research holds. Every other configured species uses the
evidence-reviewed Formula v3 pairing and temperature curve already preserved
in the repository. The candidate does not enable the private v3 server flags or
change the v4 wire contract.

## Surface consistency

The same candidate evaluator now supplies:

- city order within every species leaderboard;
- Today labels and Season timing in those standings;
- label and exact species order inside a city report;
- the selected species' city standing; and
- the five-day calendar's primary-species winner.

Non-selected species do not display their old v4 standing in a projected city
report. Showing no rank is preferable to presenting a stale rank, and avoids a
17-request leaderboard fan-out. A later version-gated server projection can
return all exact standings in one response without changing older clients.

## Calendar contract

Only these six primary Great Lakes pier species may become the calendar's top
pick:

- Chinook salmon
- Coho salmon
- Atlantic salmon
- Steelhead
- Brown trout
- Lake trout

Freshwater drum and all other warm-water or secondary targets remain available
in their own standings and city-report species cards, but cannot displace a
primary salmonid in the five-day calendar. Each future day is recomputed from
the primary pool using that day's modeled mean water temperature. If no primary
species is eligible and scoreable, the day remains unavailable rather than
promoting a secondary species.

## Evidence basis

The non-lake-trout candidate reuses the 32-city, seven-major-species audit and
the full 254-pair Formula v3 calibration. Those artifacts preserve pair-level
source IDs, annual mode curves, regulation windows and primary-source lineage.
The principal sources are Michigan DNR Pier/Dock creel records and port
roadmaps, Wisconsin DNR pier-mode reports, Indiana DNR shore/pier guidance, and
Illinois pedestrian-creel reports. The separate October 2026 lake-trout audit
supersedes only lake-trout magnitude and timing decisions.

Relevant review artifacts:

- `docs/onboarding/piercast/major-species-all-city-audit-2026-09/`
- `docs/onboarding/piercast/seasonal-opportunity-audit-2026-09/`
- `docs/onboarding/piercast/lake-trout-recalibration-2026-10/`
- `supabase/functions/_shared/pierCastEngine/config/v3Calibration.generated.ts`

## Release boundary

This is an app-side candidate so it can be reviewed without changing the live
server used by 1.14, 1.15 and 1.16. Before production promotion:

1. Recheck regulations and structure access.
2. Replay all 254 pairs across all dates and label boundaries.
3. Add a 1.17-only server opt-in so older requests retain v4 behavior.
4. Verify the server and app projections are byte-for-byte equivalent in label,
   order, timing and calendar winner.
5. Use a normal PR, deploy one function at a quiet time with the prior version
   ready for rollback, and run the health workflow.

