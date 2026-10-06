# NOAA Observation Accuracy Scorecard

Status: built on `feat/noaa-observation-scorecard`; **not deployed or enabled**.

## Read-only audit (2026-10-06)

### Live Lake Map / Cloudflare

- The gatekeeper's 15-minute scheduled collector writes a replaceable
  `observations/latest.json` and immutable snapshots at
  `observations/v1/YYYY/MM/DD/<timestamp>.json`.
- It does not delete observation snapshots. Each snapshot retains NOAA NDBC,
  NOAA CO-OPS, and GLOS water readings, GLOS depth profiles, station geometry,
  source quality, and colocated NDBC wind when available.
- The current snapshot audit returned HTTP 200 with 102 stations, 99 water
  stations, 28 known sensor depths, and eight multi-depth profiles. Source
  health was good for all three providers.

### NOAA run evidence / R2

- Every published run is immutable under `runs/<run>/`; the uploader does not
  delete runs. The research index keeps up to 4,000 run pointers, more than two
  years at four cycles per day. The small `latest.json.verificationRuns` list is
  only a client pointer and does not control retention.
- Every run already freezes 121 hourly surface values at reviewed GLOS and
  CO-OPS sites in `verification.json`, including the nearest model cell and its
  distance. Full surface PNG grids are also retained, so NDBC-only stations can
  be sampled without changing future map builds.
- The existing daily validator already joins observations to as-issued runs and
  writes immutable private match evidence. As of its latest successful run it
  processed 96 snapshots, 9,494 unique observations, and 30,165 pairs for one
  UTC day. Its signed error is model minus observed; the scorecard adds the
  requested observed-minus-model `miss` without changing the old metric.
- Local credentials are staging-scoped and correctly received `AccessDenied`
  when asked to list production R2. The retention findings above come from the
  checked-in uploader/collector contracts, public pointers, and successful
  production workflow logs; no broader production credential was requested.

### PierCast / Supabase

- `pier_cast_temperature_cycles` and `pier_cast_temperature_samples` archive
  LMHOFS forecast cycles for PierCast cities (97 cycles and 58,685 samples in
  the audit), not a five-lake station scorecard.
- `pier_cast_temperature_observations` contains 33,926 rows for three reviewed
  city datasets (`obs_62`, `obs_671`, `obs_709`); 905 were usable and the rest
  retained with rejection reasons. The private field-observation table was
  empty.
- `read_pier_cast_temperature_validation_pairs` calculates city pairs on
  demand. It does not persist station/cycle pairs and uses model-minus-observed.
  No cleanup migration was found for those archives.

Conclusion: R2 already has the durable raw inputs and match audit trail.
Duplicating collection in Supabase or adding another cron would add failure
surface without adding evidence.

## Design

The existing `Lake map validation` schedule remains the sole schedule. Its
normal validator runs exactly as before. A separate, kill-switched
`continue-on-error` job runs `job/scorecard_job.py`; therefore scorecard work
cannot alter the validator result, block a map publish, or delay any collector.

For every unique station/sensor/depth reading, each applicable saved NOAA run
is aligned to its nearest hourly valid time within 30 minutes. The private job:

1. reuses frozen `verification.json` values for reviewed GLOS/CO-OPS sites;
2. lazily decodes an immutable saved surface frame for NDBC-only sites;
3. selects the nearest cell in the same exact-water geometry used by the data
   job (never an extended land pixel), records model coordinates and distance,
   and retains the sample method. A reading more than 6 km from any actual
   modeled water cell is reported as uncovered instead of being paired to a
   misleading distant lake value;
4. retains every unique reading in scorecard mode (the pre-existing validation
   metrics still select one nearest reading per sensor/hour);
5. records GLOS profile depths as distinct sensor keys; and
6. writes immutable private scorecard evidence to
   `validation/scorecard/evidence/v1/...` before best-effort Supabase sync.

`lake_map_temperature_scorecard_samples` is private and idempotent on station,
sensor, observation time, model cycle, and lead hour. It stores observed and
model temperatures, generated observed-minus-model miss in °F and °C, sensor
depth, normalized station class, raw type, colocated and time-aligned wind,
source quality, QC flags, model-cell geometry/distance, run, and evidence hash.
Rows are retained indefinitely, with a declared minimum of two years.

QC is additive: readings are never silently dropped. `out_of_range` is outside
28.4–104 °F; `stale` means the first captured snapshot lagged the reading by
more than 90 minutes; `spike` is an isolated ≥9 °F excursion bracketed within
two hours by readings within 3 °F of each other; and
`source_not_evaluated` preserves weaker provider status. Wind is stored only
when its timestamp is within 90 minutes of the water observation.

Buoys at least 10 km from the exact shoreline are classified offshore; other
buoys are nearshore. Explicit CO-OPS identities remain `coops`; fixed harbor,
pier, river, canal, marina, intake, and crib sites are `harbor`.

The private `lake_map_temperature_scorecard_weekly` view groups by station,
UTC week, and model lead. It reports sample count, clean sample count, mean miss,
median absolute miss (the “typical” miss), and mean absolute miss. Public,
anonymous, and authenticated roles have no table, view, or commit-function
access.

### Current-data dry run

A read-only run against the public 2026-10-06 14:30Z observation snapshot and
the immutable `20261006T06Z-10060926` forecast produced 149 candidate rows from
84 stations at model leads 6–8 hours. It retained 92 rows with known sensor
depth, found only expected `stale` / `source_not_evaluated` flags, and kept every
accepted model-cell distance at or below 2.17 km. Twenty-five distinct sensor
readings were honestly uncovered: 11 were more than 6 km from the GLOFS water
domain and 14 had no valid saved-grid value nearby. They were not paired to a
distant or fabricated temperature. Earlier snapshots also exercised the
NDBC-only saved-grid fallback; deterministic unit tests cover it independently.
No object, database, workflow, or deployed function was changed by the dry run.

## Safety and kill switch

- GitHub variable `LAKE_MAP_SCORECARD_ENABLED` must be exactly `true`.
- Edge secret `LAKE_MAP_SCORECARD_ENABLED` must independently be exactly
  `true`.
- The Edge Function also requires a separate internal secret and limits input
  to 500 validated records per request.
- All scorecard workflow steps are `continue-on-error`; Python sync catches and
  sanitizes every network/parse error; Edge responses never return database
  details. Existing map, app, PierCast, collector, and validation outputs do not
  depend on this path.

## Production steps (only after owner approval)

1. Review and merge the branch through the normal protected workflow. Do not
   use `--admin`.
2. Keep both kill switches off. Apply migration `20261006150000` with
   `supabase db push`, then run `supabase migration list --linked` and confirm
   local/remote parity through `20261006150000`.
3. Create one new random internal secret. Store it as the Edge Function secret
   and the GitHub Actions secret `LAKE_MAP_SCORECARD_INTERNAL_KEY` using the
   respective secret-management UIs; never place or print its value in a
   command, log, issue, or committed file.
4. Run `supabase functions deploy lake-map-scorecard-ingest --no-verify-jwt` to
   deploy only that function (the
   dedicated internal secret is its authentication boundary). Confirm an unauthenticated call is
   forbidden and an authenticated call still returns `disabled` while the Edge
   kill switch is off.
5. Turn on the Edge kill switch, leave the GitHub variable off, and send one
   synthetic private batch. Confirm one row, observed-minus-model sign,
   idempotent re-send, evidence hash, and weekly-view output; remove the
   synthetic row with a forward cleanup migration if production policy requires
   a pristine table.
6. Set repository variable `LAKE_MAP_SCORECARD_ENABLED=true`, manually dispatch
   `Lake map validation` for one completed UTC date, and confirm the original
   validation step is unchanged while the separate scorecard step writes rows.
7. Backfill each available immutable observation date (archive starts
   2026-10-01) with
   `gh workflow run lake-map-validation.yml -f date=YYYY-MM-DD`.
   Re-runs are safe because the database key upserts.
8. Verify canonical leads 0/6/12/24/48/72/120, NDBC saved-grid rows, GLOS depth
   rows, nonnegative cell distances, sane wind offsets, QC counts, and the
   weekly view. Monitor the next scheduled run before considering rollout done.

## Forward rollback

Immediately set repository variable `LAKE_MAP_SCORECARD_ENABLED=false`; this
prevents the workflow from doing any R2 or Supabase scorecard work. Set the Edge
Function kill switch false as defense in depth. Existing app/map/PierCast paths
need no rollback. If storage removal is required, add (do not edit history) a
new migration that revokes and drops the weekly view, commit function, and
scorecard table. Immutable private R2 evidence may be retained for audit or
removed under a separately reviewed data-retention operation.
