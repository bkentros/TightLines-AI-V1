# Formula v3 production shadow deployment

**Deployed:** September 15, 2026  
**Supabase project:** `hsesngprhpgajyfbrwbf`  
**Public promotion:** blocked

## Deployment

- Applied migration `20260914233000_pier_cast_v3_shadow_ledger.sql`.
- Deployed Edge Function `pier-cast` with the owner-only `/review/v3/outlook` path.
- Deployed Edge Function `pier-cast-ingest` with the authenticated `v3-shadow` operation.
- Installed the Vault-backed six-hour schedule at minute 50 after each LMHOFS issue window.

## First verified run

| Field | Value |
|---|---|
| Run ID | `72c7ee33-fe7b-4691-af69-69b156846001` |
| Generated at | `2026-09-15T11:19:31.943Z` |
| NOAA source issue | `2026-09-15T00:00:00Z` |
| Engine | `pier-cast-opportunity-modes-v3-shadow-v1.0.0` |
| Formula | `piercast-opportunity-modes-bounded-temperature-v3` |
| Forecast manifest | 180/180 |
| Promotion status | `blocked` |

The manifest count was independently read from the private forecast table after the ingestion request completed. This proves deployment and archival wiring; it does not establish prospective forecast accuracy.

## Post-deployment smoke checks

- All 180 stored rows have a mode calibration.
- All 180 rows retain `promotion_status = blocked`.
- All numeric scores remain inside 1–10.
- Every seasonal potential is between 1 and its researched fishery strength.
- The public leaderboard returns HTTP 200 with the unchanged five-city production cohort.
- An anonymous request to `/review/v3/outlook` returns HTTP 403 with `pier_cast_review_forbidden`.
