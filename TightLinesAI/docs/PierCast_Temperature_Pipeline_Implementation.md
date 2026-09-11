# PierCast — Temperature Pipeline Implementation

**Completed:** 2026-09-10
**Status:** Live adapter, private model and strict-QC observation archives, authenticated ingestion function, and cycle-aligned schedule are deployed and verified in the FinFindr production project. Public scoring remains disabled pending representation and product validation.
**Related:** [LMHOFS representation review](PierCast_LMHOFS_Representation_Review.md) · [Core temperature calibration](PierCast_Core_Temperature_and_Source_Calibration.md) · [Representation/calibration decision](PierCast_Temperature_Representation_and_Calibration.md)

## Implemented behavior

The shared LMHOFS adapter now:

1. derives candidate issue cycles on exact six-hour UTC boundaries;
2. finds the newest cycle with a valid forecast-hour-120 point and rejects it if older than the configured 12-hour freshness limit;
3. requests only the frozen surface row/column for each city and forecast hour;
4. strictly parses the provider's valid time and Celsius temperature;
5. verifies that valid time equals issue time plus forecast hour;
6. rejects non-finite values and temperatures outside the provider sanity range of `-2–40 °C`;
7. retries transient network, `429`, and `5xx` failures at most twice, but does not retry missing cycle files;
8. uses bounded concurrency rather than whole-domain downloads;
9. assembles independent city timelines and marks a city unavailable if any requested hour is missing; and
10. retains issue time, forecast hour, valid time, exact grid coordinates, units, source identity, and source URL for reproduction.

The normal pipeline requests hours `0–120` inclusive. A failure for one city cannot be substituted with another city's point, interpolated over, or silently filled from the prior hour.

## Live all-five audit

At `2026-09-10T00:43:56Z`, the adapter selected the fresh, complete `2026-09-09T18:00:00Z` LMHOFS cycle. The newer 00 UTC cycle existed as a candidate but had not published forecast hour 120, so the adapter correctly moved to the prior complete cycle.

| City | Hourly samples | Missing hours | Five-day range |
| --- | ---: | ---: | ---: |
| Ludington | 121 | 0 | 20.84–22.49 °C |
| Grand Haven | 121 | 0 | 20.25–23.07 °C |
| Manistee | 121 | 0 | 19.80–21.81 °C |
| Frankfort–Elberta | 121 | 0 | 18.99–21.23 °C |
| Sheboygan | 121 | 0 | 11.53–18.41 °C |

This confirms current technical extraction and completeness. It does not establish pier-water accuracy, forecast skill, or permission to score. The repeatable command is:

```sh
npm run audit:pier-cast:lmhofs -- --full --summary
```

A repeat full-horizon run at `2026-09-10T01:17:16Z` again returned all 605 samples from the `2026-09-09T18:00:00Z` cycle and completed in 4.76 seconds from the local audit environment. That measured run is comfortably inside the scheduler's 55-second HTTP timeout, while the provider adapter still retains its own bounded per-request timeout and retry behavior.

## Observation comparison

The GLOS adapter freezes each dataset's temperature variable, aggregate quality variable, reported Kelvin unit, and known nominal depth. It converts Kelvin only after validating the timestamp, value, range, and aggregate quality flag. Only QARTOD aggregate flag `1` is admitted to accuracy metrics; flags `2`, `3`, `4`, `9`, missing flags, fill values, and malformed records are retained as rejected evidence.

A live one-hour contract check found:

| City | Dataset | Records | Accepted for metrics | Finding |
| --- | --- | ---: | ---: | --- |
| Grand Haven | `obs_671` | 24 | 0 | Available numeric records carried aggregate flag `4`; fill rows had no usable flag. |
| Sheboygan | `obs_709` | 12 | 0 | Records carried aggregate flag `2` (`not evaluated`), so they remain context rather than validation evidence. |

This is a source-quality finding, not evidence that the model is correct or incorrect. The comparison module is ready to pair the nearest passing observation within a controlled tolerance and report count, signed bias, MAE, RMSE, maximum absolute error, and mean time offset once acceptable overlaps exist.

## Private archive and safe fallback

The migration creates service-role-only cycle and sample tables plus an atomic commit function. The commit accepts only:

- batch status `available`;
- the complete `0–120` horizon;
- exactly five configured cities;
- exactly 121 unique hours per city; and
- exactly 605 internally consistent samples.

Partial fetches cannot be committed as complete. Re-ingesting the same cycle is idempotent by city, issue time, and forecast hour.

The ingestion pipeline uses this fixed order:

1. discover the newest complete, fresh LMHOFS cycle and retry transient point failures;
2. require all 605 samples and atomically commit that live cycle;
3. if live retrieval or the commit fails, use the newest previously archived complete cycle only when it is no more than 13 hours old; and
4. otherwise return `unavailable`.

The 13-hour archive guard represents two six-hour model cycles plus one hour of publication/scheduler tolerance. At the scheduled `:35` run, the previous safe cycle is approximately 12 hours 35 minutes old when a new cycle fails. A literal 12-hour cutoff would reject it prematurely. The pipeline never carries forward an individual temperature, fills a missing hour, combines cities from different cycles, or mixes forecast cycles.

The schema, transaction-gated reader/writer functions, and application orchestration are applied to the FinFindr production project. Migration history was checked first: these were the only two pending migrations.

## Authenticated scheduled ingestion

The deployed private `pier-cast-ingest` Edge Function accepts `POST` only and requires both the normal Supabase gateway credential and a dedicated `x-pier-cast-internal-key`. The handler uses a constant-time secret comparison, fails closed when the dedicated secret is absent or too short, returns `503` when neither live nor safe archived data is available, and never exposes service credentials.

The schedule migration invokes this function at `00:35`, `06:35`, `12:35`, and `18:35` UTC. It retrieves its project URL, anon key, and dedicated PierCast internal key from Supabase Vault. Missing Vault values skip the call rather than sending an unauthenticated request. The database invoker is not executable by `public`, `anon`, or `authenticated`; only `service_role` retains direct execution.

Production configuration and verification completed on `2026-09-10`:

- `PIER_CAST_INTERNAL_KEY` was generated specifically for this module and stored as an Edge Function secret;
- matching `pier_cast_internal_key`, `pier_cast_project_url`, and `pier_cast_anon_key` entries were created in Supabase Vault;
- `pier-cast-ingest` was deployed with JWT verification retained;
- an initial request (`813`) failed closed with HTTP `401` because the locally named anon credential was a modern publishable key rather than a JWT;
- only the PierCast Vault gateway entry was corrected to the project's legacy anon JWT—no client or other-module credentials were changed;
- corrected requests `814` and `815` both returned HTTP `200` and `live_committed`; and
- the repeat request left storage at one cycle and exactly 605 distinct `(city, issue time, forecast hour)` keys, verifying idempotency.

The first post-deployment automatic run also passed: cron run `821` executed at `2026-09-10 12:35 UTC`, network response `830` returned HTTP `200`, LMHOFS status was `live_committed`, all 605 model samples were present, and strict-QC observation archival completed. Because the next model issue was not complete yet, the ingester correctly selected the newest complete `2026-09-10T06:00:00Z` issue rather than admitting a partial cycle.

## Private prospective observation archive

The same authenticated job now retrieves a bounded 15-day window from three validation-only GLOS contracts in parallel with the LMHOFS work: supplemental Ludington `obs_62`, Grand Haven `obs_671`, and Sheboygan `obs_709`. Raw reported value, declared Kelvin unit, aggregate QC flag, source URL, fetch timestamp, and rejection reason are retained. Celsius is created only after aggregate flag `1` passes; observation failure never fails or replaces the model cycle.

The observation table and its commit/read-pairs RPCs are service-role-only. The read-pairs RPC chooses the nearest accepted observation within a caller-bounded tolerance and is not called by the public PierCast endpoint. A PostgreSQL return-type mismatch found during the first production RPC check was corrected in forward migration `20260910122000`; the corrected function executes successfully.

Production requests `827` and `828` both returned HTTP `200`, `live_committed`, and identical source summaries. Repeat ingestion remained idempotent at 13,460 unique records:

| City | Dataset | Archived | QC-good usable | Explicitly rejected |
| --- | --- | ---: | ---: | ---: |
| Ludington | `obs_62` | 1,930 | 81 | 1,849 |
| Grand Haven | `obs_671` | 7,716 | 59 | 7,657 |
| Sheboygan | `obs_709` | 3,814 | 0 | 3,814 |

The current production validation-pair count is zero because the retained GLOS records end on 2026-09-08 while production LMHOFS archival begins on 2026-09-09. This is an honest empty overlap, not an ingestion failure. Future same-time records will become pairable automatically if the seasonal feeds resume and pass QC.

## Owner-review five-date outlook

The deployed PierCast Edge Function now exposes **GET /review/outlook** behind the same verified owner authorization as the research catalog. It reads only the latest complete archived all-five cycle while that cycle is within the 13-hour freshness guard. It does not fetch a second live cycle, combine issues, or expose the archive tables.

For every city, the builder creates the remaining local day plus four full local dates. It linearly interpolates temperature at assessment boundaries, splits hourly intervals when a provisional temperature-curve knot is crossed, applies the versioned formula at each segment endpoint, and duration-weights the result across the complete requested day. An incomplete fifth day returns unavailable rather than scoring its favorable subset.

The response contains 25 city-date outlooks and 100 core-species evaluations, source issue/fetch provenance, hourly surface-temperature chart points, daily coverage, seasonal opportunity ratings, and one-decimal FinFindr rating reads. It is explicitly preview-only, every city remains blocked for insufficient evidence, every configuration rating flag remains false, and headline promotion remains blocked. The mobile owner-review screen displays these values as an opportunity preview with Fahrenheit/Celsius temperature ranges, explicit nearshore thermal-fit percentages, and repeated non-public labeling.

The exact builder was exercised against the production archive before deployment: the current 605-sample cycle produced 100 complete provisional evaluations in a 142,739-byte response without changing a public flag. Production boundary checks after deployment returned an empty public catalog and HTTP 403 for both missing and invalid owner tokens.

The latest shadow-verified complete `2026-09-10T12:00:00Z` issue contains five cities, 121 forecast hours per city, and 605 total samples. Engine `v0.7.0`, deployed in `pier-cast-ingest` Edge Function version 7, applies bounded-temperature formula v2 and archives the direct-multiplier formula v1 against the identical issue as a private comparator. The seasonal and temperature curves themselves are unchanged. Cron job `3` is active on `35 0,6,12,18 * * *`. Production privilege checks confirm that neither `anon` nor `authenticated` can select the private archives or execute the commit, read, scheduler, or shadow-ledger functions; `service_role` can execute the scheduler.

## Activation state

- The private archive and schedule migrations are applied to production.
- The private strict-QC observation archive and corrected validation-pair RPC are applied to production.
- The authenticated ingestion function is deployed as version 7 with gateway JWT verification and its dedicated internal-key check retained.
- Dedicated Edge and Vault secrets are configured without reusing another module's key.
- The cron schedule is active, manual authenticated production invocations passed, and the first verified post-deployment automatic invocation passed.
- Four complete production model cycles (2,420 samples) and 14,036 unique observation records are archived; repeat ingestion is idempotent.
- The authenticated five-date owner-review outlook is deployed in `pier-cast` version 11; the mobile review presentation exposes nearshore thermal fit, a rolling current-to-day-five temperature timeline, and public outlook access does not exist.
- Private prospective forecast capture is deployed: each complete issue commits 100 immutable active-v2 rows and 100 immutable same-issue v1-comparator rows. The first paired run and repeated-cycle idempotency check passed.
- The same owner endpoint includes private ledger status, same-day forecast candidates, confirmation-gated outcome entry, recent outcomes, and idempotent retry behavior. The evaluation protocol was frozen before any outcome was recorded.
- No live temperature endpoint was added to the public API.
- All cells remain candidates.
- All species and city/species rating flags remain disabled.
- The public PierCast catalog remains empty.
- The seasonal and thermal curves are unchanged. Active formula v2 uses `clamp(1, 10, 1 + (P - 1) × (0.30 + 0.75T))`; formula v1 remains a same-issue shadow comparator. The active private thermal candidate is v0.2, changing only sub-50 °F shoulders; temperature-curve v0.1 remains in code for comparison and the complete warm side is unchanged.

## Next work

1. Compare the private v0.1 and v0.2 cold-water outputs against reference days and eventual pier outcomes without treating attractive values as validation.
2. Continue monitoring automatic scheduled runs, including source lag, archive freshness, fallback use, and GLOS resumption/cessation.
3. Accumulate the frozen protocol's required days, regimes, matches per lead, and operating seasons; do not promote aggregate flags 2, 3, or 4.
4. Obtain qualified observation coverage for Manistee and Frankfort–Elberta and documented sensor depth/plume context for existing sources.
5. Build the private owner-facing entry/review interface on the deployed append-only outcome RPC, then evaluate the two-input rating against prospectively held dated outcomes before any city/species activation.
