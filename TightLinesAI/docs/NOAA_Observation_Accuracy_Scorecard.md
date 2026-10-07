# NOAA Observation Accuracy Scorecard

Status: production database ingest permanently disabled; private Parquet storage only;
no correction is built or shipped.

## Off-app storage decision (2026-10-07)

Scorecard compute must never use the production app database. The canonical
research store is Zstandard-compressed Parquet mirrored between this Mac and
the map-data R2 bucket under `private/scorecard/v1/`. That prefix is outside the
gatekeeper Worker's allowlist and returns 404 even with a valid map pass.

- Live pairing reads only the R2 observation archive and immutable NOAA runs.
  It writes one content-addressed Parquet fragment locally and to private R2.
- Historical backfill reads public NOAA/provider archives and writes the same
  local/R2 Parquet format. Its existing checkpoint remains authoritative; it
  currently contains 110 completed days and resumes without replaying them.
- Analysis reads only a local Parquet file or directory. It identity-dedupes an
  export baseline and later live/backfill fragments.
- `lake-map-scorecard-ingest` is not called. Its Edge switch and the legacy
  `LAKE_MAP_SCORECARD_ENABLED` Actions variable stay off.
- The independent Parquet workflow has a new exact-value kill switch,
  `LAKE_MAP_SCORECARD_PARQUET_ENABLED`, which defaults off until explicitly
  approved after merge.

The verified production export contains 368,092 rows. Its local Parquet copy
is 6,697,268 bytes; the downloaded R2 copy matched the local SHA-256 and row
count. Production deletion is a separate, owner-approved forward migration.

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

### Depth, time, space, and model-version rules (corrected before production)

- Provider depths at or above 1.5 m use the NOAA surface/top layer. Deeper
  sensors can only use a 3-D temperature profile interpolated to the sensor's
  actual depth by `lakemap/depth.py`. If that profile is unavailable, the
  observation is retained with a null model value and `pending_3d`; it is never
  compared with the surface. Unknown depths use a conservative 1.0 m default
  for offshore buoys, nearshore buoys, harbors, and connecting-water stations,
  and are permanently marked `depth_assumed=true`.
- Model temperature is linearly interpolated between the two hourly outputs
  bracketing the exact observation timestamp. The fractional lead, lower and
  upper model hours, and interpolation fraction are stored with the row.
- The nearest candidate must be a real model-water cell and no farther than
  6 km. Uncovered observations are retained as `uncovered` with a null model
  value, so coverage gaps remain countable and no value is fabricated.
- Station classes are `offshore_buoy`, `nearshore_buoy`, `harbor`, and
  `connecting_water`. Observation-provider name is separate from row origin
  (`live_archive`, `backfill`, or `synthetic`).
- Every row has a lake-specific model-version boundary. Current production is
  tagged `<OFS>:COMF-3.6:2024-09-16`; NOAA's updated service notice made COMF 3.6 and
  its updated FVCOM package effective September 16, 2024. Historical analysis
  must not pool rows across a version boundary.

The schema stores `sensor_depth_m`, `model_depth_m`, `depth_method`,
`depth_assumed`, `pair_status`, `model_version`, exact fractional lead, wind,
QC flags, and exact-water cell distance. Generated miss stays
`observed - model` and is null for pending/uncovered evidence.

The existing `Lake map validation` schedule remains the sole schedule. Its
normal validator runs exactly as before. A separate, kill-switched
`continue-on-error` job runs `job/scorecard_job.py`; therefore scorecard work
cannot alter the validator result, block a map publish, or delay any collector.

For every unique station/sensor/depth reading, each applicable saved NOAA run
is aligned by linear interpolation to the exact reading time. The private job:

1. reuses frozen `verification.json` values for reviewed GLOS/CO-OPS sites;
2. lazily decodes an immutable saved surface frame for NDBC-only sites;
3. selects the nearest cell in the same exact-water geometry used by the data
   job (never an extended land pixel), records model coordinates and distance,
   and retains the sample method. A reading more than 6 km from any actual
   modeled water cell is reported as uncovered instead of being paired to a
   misleading distant lake value;
4. retains every unique reading in scorecard mode (the pre-existing validation
   metrics still select one nearest reading per sensor/hour);
5. records GLOS profile depths as distinct sensor keys, with deeper readings
   pending until compatible 3-D evidence is available; and
6. writes a content-addressed Parquet fragment under
   `private/scorecard/v1/samples/stream=<live|backfill>/date=YYYY-MM-DD/`.

The Parquet schema preserves the former table's observation/model identity,
generated observed-minus-model miss in °F and °C, sensor depth, normalized
station class, raw type, colocated and time-aligned wind, source quality, QC
flags, model-cell geometry/distance, run, and evidence hash. Rows are retained
indefinitely, with a declared minimum of two years.

QC is additive: readings are never silently dropped. `out_of_range` is outside
28.4–104 °F; `stale` means the first captured snapshot lagged the reading by
more than 90 minutes; `spike` is an isolated ≥9 °F excursion bracketed within
two hours by readings within 3 °F of each other; and
`source_not_evaluated` preserves weaker provider status. Wind is stored only
when its timestamp is within 90 minutes of the water observation.

Buoys at least 10 km from the exact shoreline are classified offshore; other
buoys are nearshore. Fixed lake stations are harbors. River, canal, channel,
strait, St. Clair, Detroit, St. Marys, and Niagara sites are connecting water.

`scorecard_analysis.py` produces private summaries from Parquet by station,
depth band, UTC month, model lead, version, and condition. No app role, RPC, or
Edge Function can read this store.

### Current-data dry run

The corrected read-only run against the production gate's 2026-10-06 06Z
run processed 190 readings into 190 schema-valid rows: 95 paired surface rows,
73 `pending_3d` rows, and 22 uncovered rows. It found 75 deep readings and zero
deep readings incorrectly routed to the surface; the largest accepted cell
distance was 2.17 km. No object or database write occurred.

## Safety and kill switches

- Legacy GitHub variable `LAKE_MAP_SCORECARD_ENABLED` stays `false`.
- Edge secret `LAKE_MAP_SCORECARD_ENABLED` stays `false`; the legacy ingest
  function is never called.
- The off-app workflow runs only when the independent GitHub variable
  `LAKE_MAP_SCORECARD_PARQUET_ENABLED` is exactly `true`.
- All scorecard workflow steps remain `continue-on-error`. Existing map, app,
  PierCast, collector, and validation outputs do not depend on this path.

## Public historical backfill boundaries

The current comparable model era starts at **2024-09-16 15:00Z**, when NOAA
made COMF 3.6 effective for the Great Lakes OFS and updated its FVCOM package.
Only rows tagged with that current version enter candidate-correction analysis.
Older rows can still be retained as evidence, but remain tagged
`pre-COMF-3.6` and are excluded from correction fitting and evaluation. The
one-off backfill covers May 1 through December 15 for 2023–2025 and May 1
through the current date in 2026. It samples 00Z and 12Z cycles at leads 0, 24,
72, and 120 hours when those forecast products exist. Position history is part
of station identity; a date without a verified station position is uncovered
rather than assigned today's coordinates.

There is a hard upstream retention limit. NOAA documents the production NODD
bucket as rolling 30 days, native AWS 3-D forecast fields as two months, NCEI
3-D forecast retention as none, and CO-OPS THREDDS as 31 days. NCEI retains old
3-D **nowcasts**, not gridded forecasts. Direct catalog and one-byte object
probes on October 6, 2026 found the following surface-forecast coverage:

| Year | `noaa-ofs-pds` | `noaa-nos-ofs-pds` | NCEI | CO-OPS THREDDS |
| --- | --- | --- | --- | --- |
| 2023 | none | expired | native nowcast fields and station forecasts; no gridded forecasts | none |
| 2024 | none | regular-grid forecasts May-Aug, before the current comparable version; current-version Sep-Dec forecasts absent | native nowcast fields and station forecasts; no gridded forecasts | none |
| 2025 | none | no May-Dec gridded forecast fields found | native nowcast fields and station forecasts; no gridded forecasts | none |
| 2026 | current rolling month | regular-grid forecasts May-Sep; native 3-D forecasts for the recent rolling period | native nowcast fields and station forecasts | September 6 onward at probe time |

NCEI's retained OFS station products materially improve that picture. Each
file contains full-depth temperature at fixed NOAA output stations every six
minutes through 120 hours. The sampler accepts one only when the output station
is within 6 km of the observation position and belongs to the same modeled
waterbody, then records `sample_method='station_file'`. It still interpolates
the exact observation time between hourly samples. A current-catalog audit
found these matches:

| Model | Fixed OFS outputs | Outputs within 6 km | Unique observed sites |
| --- | ---: | ---: | ---: |
| LMHOFS | 48 | 33 | 32 |
| LEOFS | 28 | 21 | 16 |
| LOOFS | 12 | 7 | 7 |
| LSOFS | 19 | 16 | 15 |
| **Total** | **107** | **77** | **70** |

Matched observed-site identifiers were:

- LMHOFS: `9075014`, `9075099`, `9087096`, `NDBC_MNMM4`, `45184`, `DCW`,
  `9087031`, `9075065`, `NDBC_FTGM4`, `NDBC_RCKM4`, `ECCC 26-1`, `45014`,
  `45002`, `45175`, `45003`, `45154`, `45013`, `45024`, `45022`, `45162`,
  `45137`, `45174`, `SPOT-1563`, `45029`, `45008`, `45143`, `SPOT-31964C`,
  `45168`, `45163`, `45170`, `45026`, and `45149`.
- LEOFS: `9063020`, `PA-DEP-1538`, `9063085`, `9063079`, `9063063`,
  `9063053`, `WIM_968`, `45005`, `45132`, `NDBC_BUFN6`, `45165`, `45167`,
  `45164`, `45169`, `UWRAEON7-26`, and `UWRAEON1-24`.
- LOOFS: `9052000`, `45189`, `NDBC_RPRN6`, `NDBC_OLCN6`, `45139`, `45159`,
  and `45012`.
- LSOFS: `9099090`, `9099064`, `SPOT-33110C`, `SPOT-1360`, `NDBC_PTIM4`,
  `NDBC_LTRM4`, `45006`, `45001`, `SPOT-31300C`, `45023`, `45027`, `45136`,
  `SPOT-1980`, `45172`, and `SPOT-1362`.

Some anonymous or connecting-water fixed outputs cluster near the same site,
which is why output-match count exceeds unique-site count. Pairing is performed
against that day's observation position, not merely this catalog audit.

The backfill tries an eligible NCEI station file first, then native AWS fields,
AWS regular-grid 3-D fields, and finally NCEI native nowcast `n006` for exact
lead 0. Missing products remain uncovered (or `pending_3d` for deep sensors)
rather than substituting a surface value.

Consequently:

- recent deep lead 0/24/72/120 rows can be recovered from 3-D forecast fields;
- old deep lead-0 rows can be recovered from NCEI nowcasts where available;
- old deep +24/+72/+120 rows must remain absent/pending because the model files
  no longer exist in the named public archives;
- no surface value may be substituted for those missing deep products.

Observation inputs remain available independently: NDBC annual stdmet,
dataset-specific GLOS Seagull ERDDAP tables (including temperature strings),
and bounded CO-OPS water-temperature API requests. The backfill writes
`source='backfill'`, uses an on-disk checkpoint, and stores only station-near
model samples in local/private-R2 Parquet. Download caches are temporary and
are not production schedules or GitHub Actions artifacts.

### Temperature data-assimilation independence

The LMHOFS, LEOFS, LOOFS, and LSOFS technical reports do not describe
assimilation or nudging of model temperature toward NDBC, GLOS, or CO-OPS
temperature observations at the scorecard stations. Forecast cycles continue
from the preceding nowcast/restart and use atmospheric forcing. LEOFS does use
observed water temperature at the Detroit and Niagara River open boundaries;
those boundary inputs are not the buoy/CO-OPS validation sites. LOOFS/LSOFS
also adjust water level through measured levels and artificial
precipitation/evaporation, not water temperature. Therefore scorecard rows are
not flagged `assimilated=true`; the independence caveat is documented instead
of inventing a flag unsupported by the model configuration.

Sources: [NOAA Technical Report 087 (LEOFS)](https://tidesandcurrents.noaa.gov/publications/CO-OPS_Tech_Report_087_LEOFS_Final.pdf),
[Technical Report 091 (LMHOFS)](https://tidesandcurrents.noaa.gov/ofs/publications/CO-OPS_Techrpt_091_LMHOFS_2019.pdf),
[Technical Report 103 (LOOFS/LSOFS)](https://tidesandcurrents.noaa.gov/ofs/publications/CO-OPS_Techreport_103_2023_LOOFS_LSOFS.pdf),
and [NOAA's OFS archive FAQ](https://www.tidesandcurrents.noaa.gov/ofs/ofs_faq.html).

The one-off workstation command is `job/scorecard_public_backfill.py`. It uses
anonymous public-source reads only, requires an explicit `--store` before it
can advance its checkpoint, validates every generated row against the schema
contract, and checkpoints completed UTC days locally. `h5py` and `s3fs` are
workstation-only dependencies used for range reads; they are deliberately not
part of the scheduled map job. A typical invocation from `web/lake-map` is:

```sh
.venv/bin/python job/scorecard_public_backfill.py \
  --start 2026-08-07 --end 2026-10-05 \
  --cache /tmp/finfindr-scorecard-public-backfill \
  --env-file ../../.env --store
```

## Research analysis (never runtime correction)

`scorecard_analysis.py` reports clean observed-minus-model miss by station,
surface/depth band, month, nearest canonical lead, and model version. “Typical”
miss is median absolute miss. Its candidate learns a circularly smoothed
station/depth seasonal bias from current-version lead-0 rows, shrinks it toward
zero by sample size and observed spread, then learns each station/depth lead
fade from retained station-file, 2026, and private-archive forecast rows. Sparse
lead evidence is conservatively shrunk toward an exponential fallback; a sign
reversal fades to NOAA rather than applying a correction in the wrong
direction. Wind-associated rapid rises and drops are reported separately and
excluded from steady-correction fitting. Leave-one-season-out evaluation
compares candidate MAE with unmodified NOAA MAE. Fewer than 90 clean samples or
fewer than three covered month/lead groups remains NOAA by default. Only
`COMF-3.6:2024-09-16` rows enter fitting/evaluation. This script emits research
evidence only and cannot change a map, forecast, ranking, public API, or app
response.

## Activation steps (only after owner approval)

1. Review and merge this branch through the normal protected workflow. Do not
   use `--admin`.
2. Keep both legacy production switches off. Leave the independent Parquet
   switch off during merge.
3. Run one requested-date Parquet job and verify its local file, private R2
   metadata, row count, readback, and Worker 404 behavior.
4. Set `LAKE_MAP_SCORECARD_PARQUET_ENABLED=true` and monitor the next scheduled
   live fragment. This never enables the legacy Edge ingest.
5. Update the existing workstation runner to use `--store`, preserving
   `/private/tmp/finfindr-scorecard-backfill-v2/checkpoint.json`, then resume
   only after explicit owner approval.
6. Point analysis at the local store root so the verified export baseline and
   later fragments are read and identity-deduped together.

## Forward rollback

Set `LAKE_MAP_SCORECARD_PARQUET_ENABLED=false` to stop new fragments. Both
legacy switches remain false. Existing app/map/PierCast paths need no rollback.
Private R2 evidence may be retained for audit or removed only under a separately
reviewed data-retention operation.
