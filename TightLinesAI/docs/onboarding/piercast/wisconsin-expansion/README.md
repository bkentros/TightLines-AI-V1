# Wisconsin PierCast shadow cohort

Status: deployed private owner-review shadow. Scope version: `piercast-wisconsin-shadow-v1`.

This cohort contains Port Washington, Milwaukee, Racine, and Kenosha. The three new cities cover a general city-harbor reading anchored to their main public DNR-listed piers. Each scores Coho Salmon, Chinook Salmon, Steelhead, and Brown Trout across five dates. Yellow perch is visible as an unscored conditional lead in Racine and Kenosha.

The complete research basis, confidence statement, limitations, and numbered citations are in [RESEARCH_REPORT.md](./RESEARCH_REPORT.md). Exact runtime-mirrored curves are in [seasonal-curves.json](./seasonal-curves.json), evidence in [evidence-ledger.json](./evidence-ledger.json), and NOAA cell probes in [lmhofs-sampling-audit.json](./lmhofs-sampling-audit.json).

## Isolation and integrity

- Public five-city scope remains unchanged.
- All four Wisconsin cities must archive one complete 121-hour cycle together (484 samples).
- Each shadow run must contain four cities × four species × five dates (80 forecasts).
- Partial cycles fail closed; only a complete fresh cohort archive can serve as fallback.
- Owner review and owner standings consume the unified expansion outlook.
- Public catalogs, reports, trials, daily snapshots, and leaderboards do not consume this cohort.

## Production verification

Verified on September 14, 2026 after applying `20260914190000_wisconsin_pier_cast_shadow_cohort.sql` and deploying `pier-cast-ingest` plus `pier-cast`:

- NOAA LMHOFS issue cycle: `2026-09-14T18:00:00Z`.
- Archived temperatures: 484 total, exactly 121 for each of four cities.
- Shadow run: `ad656b20-0da9-41ef-b47a-133c74b68c91`.
- Archived forecasts: 80 total, exactly 20 for each city; 80 available and 0 unavailable.
- External public API smoke test: five released catalog cities and five leaderboard cities; zero expansion-city exposure.

The migration replaces the former Port-only cron schedule with `pier-cast-wisconsin-shadow-ingestion` at minute 45 after each 00/06/12/18 UTC LMHOFS issue cycle.
