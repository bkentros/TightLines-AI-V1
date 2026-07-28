# River Run PM Fall Chinook Foundation Audit

**Audit version:** 2026-07-28.4

**Release conclusion:** Foundation accepted locally; public release is not
accepted.

## Configured combination

- River/run: Pere Marquette River — Fall Chinook
- Movement engine: `fall_cooling` / `fall-cooling-v2`
- Nearby-water staging advisory: July 28
- River-presence start: August 15
- Peak candidate: September 20
- End / late end: October 20 / November 3
- Historical-presence maximum: `10`
- Presence curve: `pm-fall-chinook-presence-v1`

Staging context never increases Fish In River. Fish In River remains `0` before
August 15 and is displayed as `current / maximum`.

## Audited sources

- Primary hydraulic: USGS `04122500`, Pere Marquette River at Scottville
- Primary scored hydraulic metric: discharge (`flow_cfs`)
- Primary measured water temperature: PMTU Maple Leaf, Monitor My Watershed
  result `4939`
- Fallback measured water temperature: PMTU Bowman / 60th Street, result `3209`
- Validation/final fallback: PMTU M-37, result `3201`
- Dedicated Conditions Suggest temperature: PMTU M-37, result `3201`
- No air-temperature fallback; a temporary loss of every configured
  measured-water source makes temperature-dependent output unavailable

Push selects one temperature source in priority order. Conditions Suggest always
uses M-37 so its current source matches its five-year historical comparison. It
never substitutes Maple or Bowman into that comparison. The engine never
averages raw readings across separate stations. Upstream Push fallbacks are
labeled, still enforce warm-water constraints, and receive zero positive cooling
credit.

## Modern USGS baseline replay

- API: USGS Water Data OGC daily-values collection
- Source date range: `2016-01-01` through `2025-12-31`
- Normalized daily-flow observations: `3629`
- Baseline version: `2026-07-27`
- Generated canonical baseline rows: `365`
- Staging-through-late-end coverage: `100%` (`99 / 99` canonical days)
- Missing canonical baseline days: none

The live audit command was:

```sh
npm run audit:river-run:pm -- --fetch-usgs --start 2016-01-01 \
  --end 2025-12-31 --baseline-version 2026-07-27 --year 2026
```

## Conditions Suggest baseline

- Contract: `conditionsSuggest`; no public or internal `schedule` primitive
- Baseline version: `pm-fall-chinook-conditions-v2`
- Historical years: `2021` through `2025`
- Hydraulic evidence: Scottville `04122500` daily mean discharge
- Temperature evidence: PMTU M-37 result `3201` daily median measured water
  temperature
- Current evidence: cumulative daily representatives from July 28 staging start
  through each checkpoint cutoff; mean stored Scottville refreshes and median
  stored M-37 refreshes per completed date
- Model: two components only, `60%` gauge response and `40%` measured-water
  pattern
- Generated checkpoint rows: `4`
- Required checkpoint coverage: `100%` (`4 / 4`)
- 2026 checkpoints: river start August 15, building start August 24, peak start
  September 15, peak complete September 26
- Expected/minimum usable cumulative days: `18/15`, `27/22`, `49/40`, `60/48`
- Mechanical replay samples: `20`
- Candidate labels: `1 Ahead / 17 Typical / 2 Delayed`
- Final checkpoint labels: `1 Ahead / 17 Typical / 2 Delayed`
- Direct reversals tempered: `0` in the historical sample; deterministic
  reversal fixtures pass
- Strongly mixed samples held at Typical: `2`
- Ahead/Delayed candidate component-agreement violations: `0`

All four checkpoint baselines contain five usable historical years. The engine
still returns `Insufficient evidence` rather than weakening coverage, history,
window, version, or provenance requirements.

The baseline generation command is:

```sh
npm run build:river-run:pm-conditions-baseline
```

## Push interaction replay

- Rules version: `pm-fall-chinook-push-v3`
- Replay years: `2021` through `2025`
- Hydraulic evidence: Scottville daily mean discharge
- Temperature evidence: Maple Leaf daily median measured water
- Rain evidence: Baldwin watershed-point modeled gridded precipitation
- Usable configured-start-through-end days: `319`
- Labels:
  `16 Weak / 247 No clear push / 45 Possible / 10 Strong / 1 Very
  strong`
- Flow responses: `258 Stable`, `4 Falling`, `39 Rising`, `13 Meaningful`,
  `5 Sharp`
- Strong without a measured positive gauge response: `0`
- Rain credit after Meaningful or Sharp response: `0`
- Warm migration-barrier result above No clear push: `0`
- Severe-high-flow result above No clear push: `0`
- Very strong result without a Sharp response: `0`
- Incomplete or prohibited copy results: `0`

The strongest daily replay was September 25, 2024: a Sharp Scottville response,
57.6°F supportive measured water that was cooling, and rain treated as absorbed
context rather than a second score. It produced `86 / Very strong`.

This is a mechanical daily-resolution interaction replay. Runtime uses
near-real-time gauge and temperature observations and modeled rolling
precipitation. The replay proves score/copy invariants; it does not prove that
fish entered on any historical date.

Every active-window Push result now carries the lake-entry disclaimer: fresh
fish may enter without a textbook weather event, entries are more commonly
associated with cooling/rain/river-rise support, and the engine cannot confirm
or rule out movement. The app separately shows the most recent stored
`Possible`-or-stronger category and date as a “supportive Push signal.” That
history is limited to this exact river, run season, engine version, and
configuration version; it never calls the date a confirmed fish push.

Push and its supportive-condition history now begin on the configured PM river
start, August 15—not the July 28 nearby-water staging advisory. Both remain
active through the configured October 20 end. After that date the score and
history disappear and the primitive reports that fresh-push tracking is
complete.

The replay command is:

```sh
npm run replay:river-run:pm-push
```

## Fishability calibration and replay

- Rules version: `pm-scottville-fishability-v1`
- Primary scored reach/metric: Scottville lower-mainstem discharge
- Calibration history: USGS daily means, August 15–October 20, 2016–2025
- Usable days: `670`
- Modern distribution: approximately
  `p10 416 / p25 468 / median 536 / p75
  627 / p90 802 / p95 1,066 / p99 1,458 cfs`
- Audited bands: `<400 Very Low`; `>=400 to <475 Low`;
  `>=475 to <525 Normal
  Fishable`; `>=525 to <=750 Ideal`;
  `>750 to <=1,000 High Fishable`; `>1,000
  to <1,600 Very High`;
  `>=1,600 Blown Out`
- Band counts:
  `50 Very Low / 136 Low / 121 Normal / 284 Ideal / 41 High / 33
  Very High / 5 Blown Out`
- Score labels: `9 Poor / 85 Tough / 165 Fishable / 157 Good / 254 Excellent`
- Very Low, Blown Out, and sharp-rise/high-water cap violations: `0`
- Incomplete or unsupported rain/stain/clarity copy results: `0`

Fishability now uses only the current audited band, matched 24-hour hydraulic
change, and gauge freshness. It does not use rainfall or weather freshness.
Seasonal percentiles support calibration and relative context but never assign
the live fishing-shape band. This allows a supportive Push event and difficult
Fishability to coexist without contradiction.

The replay command is:

```sh
npm run replay:river-run:pm-fishability
```

## Local acceptance evidence

- River and run configuration validation passed with zero issues.
- Reserved/unimplemented movement engines fail closed.
- Modern USGS continuous and daily parsing is site/parameter/unit checked.
- Monitor My Watershed temperature parsing verifies site, aqueous medium, and
  Fahrenheit units.
- Temperature physical range, rate change, three-hour median, freshness, peer
  disagreement, fallback order, and unavailable behavior are tested.
- Run Stage, staging separation, lower river caps, Fish In River copy, mixed
  primitive interpretation, API, storage, and app contracts are tested.
- Conditions Suggest Evaluating, Ahead, Typical, Delayed, insufficient, Timing
  complete, mixed-signal, source/window mismatch, cumulative coverage,
  checkpoint locking, reversal tempering, and copy branches are tested.
- Rain and same-day Push cannot change Conditions Suggest.
- PM Push hydraulic thresholds require paired absolute and relative changes.
- PM Push temperature suitability, cooling plateau, warm barrier, rain
  precursor, no-response, unknown-trend, stale, severe-high, and outside-window
  behavior are tested.
- Push history active/current, prior-supportive, no-record, season boundary, and
  configuration-version isolation behavior are tested.
- The lake-entry disclaimer and “last supportive conditions” wording are covered
  by copy tests.
- Every reachable Push label and representative cross-primitive copy branch is
  covered.
- Every Fishability boundary, label, conservative cap, unavailable branch,
  reason code, and primary-reach copy branch is covered.
- Draft/published/archived configuration revision storage is included in
  migration `20260727120000_create_river_run_config_revisions.sql`.
- The integrated 2021–2025 daily replay covers 495 snapshots with zero
  unexplained disagreements, prohibited copy claims, or season-boundary Push
  violations. See `docs/river_run_pm_integrated_audit.md`.

## Blocking release gates

This audit does not approve public release. The following remain:

1. Review the PM Conditions Suggest output and copy in-app with the product
   owner after all primitives are implemented.
2. Review the PM Push output and copy in-app with the product owner after all
   primitives are implemented.
3. Review the implemented PM-specific Fishability thresholds and copy in-app;
   the 2016–2025 replay covers 670 run-window days with all cap/copy invariants
   passing.
4. Review final scores and all copy branches together with the product owner.
5. Deploy hidden by staging start and continuously collect the daily
   Scottville/M-37 evidence needed for checkpoint coverage. If deployment begins
   later, use only a verified provenance-preserving backfill; otherwise accept
   `Insufficient evidence`.
6. Observe provider transitions and pass production smoke.

`RIVER_RUN_PUBLIC_ENABLED` must remain false or unset until those gates pass.
