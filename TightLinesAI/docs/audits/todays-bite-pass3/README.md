# Today's Bite — Pass 3 release preparation and final review

Local implementation, expanded evaluation and the identified corroboration-cutoff correction are complete. See the [final correction report](./corroboration-fix/README.md) for the latest evidence: 591 passing engine/session/provider tests, unchanged broad synthetic outputs, and a two-point maximum calendar movement in the regional replay. Earlier figures below describe the pre-correction checkpoint where indicated. Production deployment and on-device validation remain unperformed; catch-accuracy improvement is not established.

## Final changes

- A single `bite_conditions_2026_09_v1` revision isolates Today's Bite report caches, forecast-chip caches, backend forecast snapshots and recommendation client caches from previous-model results.
- The database recommendation-session identity stays unchanged. Existing sets are regenerated atomically under the new model, retaining the active A/B set, available variants, spent refresh allowance and expiry. Coordinate-identical sessions survive corrected state/region routing, including the existing-session check used for spent free trials.
- Session upgrades compare both refresh state and the stored model revision before writing. Failed generation leaves the saved session untouched; competing upgrades reread the winner. A request that loses a create/refresh race also validates/upgrades the winning session. Stored responses are never stamped as current merely by reading them.
- Today's Bite and recommendation expiry now use the shared timezone-aware midnight calculation, covering both DST transitions and the midnight hour.
- The captured provider sample exposed a fall DST date defect: Open-Meteo daily UNIX timestamps need the returned `utc_offset_seconds`, not each date's IANA offset. The shared provider adapter now follows that documented contract. Actual hourly and sunrise/sunset instants still use the IANA timezone. This shared-adapter change also affects get-environment's daily labels; all four importing edge entry points are typechecked.
- App TypeScript checking excludes executable audit documents, like its existing exclusions for scripts and edge code. Those Deno audit files are checked with their own runtime rather than accidentally pulling Deno imports into the Expo application project.

## Verification

- Full engine/recommender/session suite: 589 passing tests, including the captured-provider adapter, model/session and DST checks.
- Three executable client-cache tests pass: report round trips and owner isolation, old-cache exclusion, forecast range/snapshot isolation, recommendation owner/variant separation, and stable session identity.
- Four edge entry points (`how-fishing`, `forecast-scores`, `recommender`, `get-environment`) and the provider replay typecheck.
- App `tsc --noEmit`, existing recommender cache smoke checks and `git diff --check` pass.
- [Final replay parity](./final-parity.json): all **24,232 complete condition cases and 10,134 complete recommendation sets are byte-identical to Pass 2**, with 11 frozen archive checksums plus the captured provider checksum verified. Pass 3 release/session work does not recalibrate scoring. This replay begins at normalized provider-shaped inputs; the newly fixed raw-provider daily-date behavior has separate captured-data tests.
- [Provider replay](./provider-replay.json): 28 reports and 28 bass recommendation sets from the approved Tallahassee historical-weather sample; report/score-only parity, finite scores and surface gating checked. Corrected target dates are November 3–9, 2025. The complete captured response is retained in `provider-weather.json`.

The broader multi-region winter provider replay is now complete; see the [follow-up results](./regional-evaluation.md). It confirmed overall consistency improvements and exposed a hard Prime cutoff, now resolved in the final correction report. Existing synthetic and reanalysis evidence does not establish catch accuracy.

## All-pass assessment

| Area | Final standing |
| --- | --- |
| Pass 1: region/state, pressure horizons and favorable winter-warmth interpretation | Implemented, preserved before/after evidence, final regression suite passes. |
| Pass 2: seasonal/source/light/score calibration | Implemented. Maximum fixed-weather month-boundary jump fell from 35 to 3 points in 22,464 pairs. Pressure and activity thresholds deliberately retained after evaluation. |
| Cross-feature behavior | No lost recommendation coverage. Pass 2 changed picks in 521 sets relative to Pass 1; every response was reproduced by the preserved recommender with the updated shared analysis. Pass 3 preserves those outputs. |
| Material score changes | Reviewed in the [Pass 2 report](../todays-bite-pass2/README.md): southern measured-water corrections can raise scores; removing hot-side regional relief and calendar discontinuities can lower them. Higher average scores are not the objective. |
| Cache and stored-session transition | Implemented and tested locally, including refresh preservation, routing corrections, races and generation failure. No database schema migration is required. |
| Real-provider validation | 27 regional fall/winter samples evaluated; approval blocker resolved. The identified calendar regression is now corrected. |
| Production release / on-device validation | Not performed. No claim that the live application is running this model. |
| Catch prediction / finer biological regions | Not established by software tests. Needs observed outcomes and source-specific waterbody/species evidence. |

The expanded evaluation supports the overall direction and verified cross-feature contracts. The Brownsville Prime cutoff has now been corrected and revalidated; no identified local calibration defect remains from this audit. Production rollout is not complete, and zero real-world regression is not established.

## Release and rollback procedure

1. Preserve the original, Pass 1, Pass 2 and final archives; retain the current shared revision across every deployed consumer.
2. Deploy the same tested source revision to `get-environment` (daily-date fix), `forecast-scores`, `how-fishing` and `recommender`. Publish the matching app/OTA cache changes as part of the same release window. Avoid a prolonged mixed deployment; there is no claim that separate edge deploys are atomic.
3. Verify signed-in fresh and retained A/B sessions in staging/production, including a spent free trial, spent refresh and corrected routing. Check displayed daily score, forecast chip, full report and recommendations against the same snapshot. Test both newly updated and still-old clients; old installed clients can retain their existing local caches until expiry.
4. Confirm versioned forecast snapshots and new client namespaces are populated, and that backend session rows retain refresh counters while responses carry the new condition revision. Do not delete session rows to force regeneration.
5. Roll back all consumers together if live checks fail. Preserve refresh counters. When reverting calibration in an upgraded build, use a new shared model revision so the in-place upgrade regenerates rollback outputs rather than reusing the rejected model's sets. Merely restoring old binaries can serve cached new-model sets until expiry; do not describe that as a complete rollback.

No deployment, session/database write, credential access or entitlement reset was performed during this pass.

## Reproduction and provenance

Run from `TightLinesAI`:

```sh
deno test --no-lock --node-modules-dir=none --allow-read --allow-env supabase/functions/_shared/howFishingEngine supabase/functions/_shared/recommenderEngine supabase/functions/_shared/openMeteoDailyDate.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/recommender/index.test.ts
node --test scripts/audit/todays-bite-pass3/client-cache.test.cjs
node --import tsx scripts/recommender-cache-smoke.ts
./node_modules/.bin/tsc --noEmit
deno check --no-lock --node-modules-dir=none supabase/functions/how-fishing/index.ts supabase/functions/forecast-scores/index.ts supabase/functions/recommender/index.ts supabase/functions/get-environment/index.ts scripts/audit/todays-bite-pass3/provider-replay.ts

deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/run.ts compare --output-dir=docs/audits/todays-bite-pass3
deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/run.ts compare --boundaries --output-dir=docs/audits/todays-bite-pass3
python3 scripts/audit/todays-bite-pass3/verify-final.py
# Restore the frozen Pass 1 shared source as described in the Pass 2 report first.
deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass3/provider-replay.ts /tmp/todays-bite-pass2-pass1/_shared
```

Weather source: [Open-Meteo Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api), latitude 30.4383, longitude −84.2807, October 20–November 10, 2025, hourly temperature/pressure/cloud/wind/precipitation and daily high/low/precipitation/sunrise/sunset, Fahrenheit, mph, millimeters, `America/New_York`, UNIX timestamps. This is reanalysis (model-reconstructed historical weather), not a station-only measurement, archived forecast skill test or catch dataset. [Provider timestamp contract](https://open-meteo.com/en/docs) specifies applying its returned offset to daily UNIX dates.
