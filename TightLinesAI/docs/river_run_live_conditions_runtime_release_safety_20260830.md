# River Run Live Conditions Runtime Release Safety — 2026-08-30

## Production observation

- The public endpoint currently exposes eight unique rivers and 24 unique runs
  (27 state placements because St. Joseph appears in Michigan and Indiana).
- Stored Live Conditions rows show the deployed runtime is writing
  `river-live-conditions-v3` data.
- The submitted mobile builds consume the catalog and snapshot endpoints
  dynamically and ignore additive response fields.
- No Wisconsin run or Big Manistee lake-run Brown Trout profile is currently
  exposed by production.

## Runtime defect and correction

High-cadence USGS series can exceed the provider's 1,000-row page. Treating the
first page as the complete response can select an old value as the newest value.
The corrected provider follows accepted USGS OGC `next` links, rejects foreign
origins/paths, loops, malformed links, page failures, and responses that exceed
the 16-page safety bound. Both hydraulic and water-temperature fetches use the
same fail-closed pagination path. The provider regression contains 1,050 rows
and proves that the newest second-page reading wins.

## Installed-build protection

Owner approval in source control is no longer sufficient to expose a run at
runtime. The Edge Function applies a separate released-run gate before catalog,
snapshot, and protected-refresh handling:

- Without `RIVER_RUN_RELEASED_RUN_IDS`, it defaults to the previously released
  eight-river/24-run catalog.
- A comma-separated setting releases only the listed, known run IDs.
- `*` is an explicit full-catalog release and must not be set until the mobile
  and backend release gates are approved.
- An empty or invalid environment value fails back to the legacy released set.
- Approved but unreleased runs are absent from `/rivers`, reject direct public
  snapshots, and are excluded from protected refresh work.

This permits the Live Conditions correction to be deployed without exposing
the Wisconsin portfolio or Big Manistee Browns to existing store builds.

## Verification

- River Run engine: 375 passed.
- Edge endpoint: 55 passed, including explicit release filtering and the
  legacy-default contract.
- TypeScript: passed.
- Production smoke defaults to the legacy catalog. A later full release must
  run it with `RIVER_RUN_EXPECTED_RELEASE=full`.

## Deployment record

- Edge Function `river-run` version 24 deployed at 2026-08-30 02:35:55 UTC.
- No migration was created or applied. `supabase migration list --linked`
  reports complete local/remote parity through `20260824120000`.
- The post-deploy catalog retained 9 state placements, 8 unique rivers, and 24
  unique runs. Wisconsin and Big Manistee Browns remained absent.
- A direct Milwaukee snapshot request returned `404 river_run_not_found` before
  authentication or provider work.
- An existing allowlisted Play review account prewarmed all eight released
  rivers; no production user was created or modified.
- Production smoke passed on engine `river-run-v1.16.0` and Live Conditions
  `river-live-conditions-v4`: eight persisted current-version river rows, 70
  seasonal-context rows, authenticated snapshot/cache replay, and fresh valid
  readings wherever a live source is configured. Betsie remained honestly
  unavailable by design.
- The smoke harness was also corrected to treat Platte's valid flow/height read
  as available and to paginate/filter PostgREST storage audits instead of
  silently accepting the first 1,000 rows.
