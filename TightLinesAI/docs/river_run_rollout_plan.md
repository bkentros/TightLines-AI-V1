# River Run V1.1 Rollout Plan

> **Historical rollout plan.** Its public primitive model and implementation
> sequence are superseded by `docs/river_run_onboarding.md`. Retain this file as
> a record of the original engine rollout, not as instructions for a future
> river.

**Product:** FinFindr

**Launch proof:** Michigan → Pere Marquette River → Fall → Fall Chinook

**Plan version:** 2026-07-28.4

**Current release state:** Local development only; public runtime access must
remain disabled.

**Active phase:** Phase 7 integrated replay and app acceptance; individual
primitive owner/copy acceptance is intentionally deferred to the combined in-app
review

---

## 1. Authority And Working Rules

The normative product and engine contract is:

`TightLinesAI/docs/finfindr_river_run_v1_simple_spec.md`

This rollout plan controls implementation order and release evidence. If this
plan conflicts with the V1.1 specification, the specification wins and this plan
must be corrected before work continues.

Supporting references:

- PM audit: `TightLinesAI/docs/river_run_pm_fall_chinook_launch_audit.md`
- Integrated primitive audit:
  `TightLinesAI/docs/river_run_pm_integrated_audit.md`
- Current new-river guide: `TightLinesAI/docs/river_run_onboarding.md`
- Engine: `TightLinesAI/supabase/functions/_shared/riverRunEngine`
- Edge Function: `TightLinesAI/supabase/functions/river-run`
- Mobile screen: `TightLinesAI/app/river-run.tsx`
- Client contract: `TightLinesAI/lib/riverRunContracts.ts`
- Client helper: `TightLinesAI/lib/riverRun.ts`
- Audit script: `TightLinesAI/scripts/river-run-pm-launch-audit.ts`
- Production smoke script: `TightLinesAI/scripts/river-run-production-smoke.ts`

Working rules:

1. Work one numbered phase at a time.
2. Do not check off a task based only on code existence. Attach test, replay,
   audit, or runtime evidence.
3. Do not begin the next primitive until the active primitive's logic, score,
   label, copy, reason codes, and tests agree.
4. Do not add a second species or river before PM Fall Chinook passes the
   public-release gate.
5. Do not treat missing evidence as neutral evidence when that could improve or
   preserve a strong claim.
6. Do not use forecast values in V1.1 scoring.
7. Do not average raw values from separate gauges.
8. Any scoring/config change requires a version bump and replay.
9. Keep `RIVER_RUN_PUBLIC_ENABLED` false or unset until Phase 10.

### Primitive Completion Gate

A primitive is complete only when all of the following are checked:

- [ ] Inputs and prohibited inputs match the specification.
- [ ] Deterministic algorithm and every boundary are implemented.
- [ ] Score/label mapping is complete.
- [ ] Headline, detail, tip, and reason codes match every branch.
- [ ] Missing, stale, modeled, proxy, and out-of-window behavior is tested.
- [ ] Cross-primitive disagreements have deterministic interpretation copy.
- [ ] PM historical replay fixtures pass.
- [ ] Product owner reviews the final numeric output and user-facing copy.
- [ ] Engine, config, and copy versions are recorded.

---

## 2. Current Position

### Completed foundation

- [x] Reviewed the original River Run engine, endpoint, mobile experience,
      persistence, launch audit, and original rollout plan.
- [x] Added a runtime release gate that defaults to hidden.
- [x] Prevented public date, time, refresh-time, and environmental overrides.
- [x] Added a secret-protected internal refresh route.
- [x] Added an idempotent hourly cron definition that resolves source-audited
      local condition slots from each river profile. PM uses four-hour refreshes
      from staging through its historical-presence tail and a daily inactive
      refresh. Push still stops at the separate main-run end.
- [x] Added provider timeouts and deterministic provider-failure handling.
- [x] Made storage failures explicit instead of treating them as empty data.
- [x] Added mobile focus, foreground, and pull-to-refresh behavior.
- [x] Added request telemetry, live-input display, production smoke tooling, and
      a fishing-versus-activity safety disclaimer.
- [x] Wrote the normative V1.1 specification covering all agreed product
      decisions.
- [x] Reconciled this rollout plan with the V1.1 specification.
- [x] Added stable movement-engine identities. Only `fall_cooling` is
      implemented; reserved engines fail closed.
- [x] Added role-based hydraulic, measured-water, and weather source arrays.
- [x] Added immutable draft/published/archived config revisions with atomic
      publishing.
- [x] Separated PM's July 28 staging advisory from its August 15 river start.
- [x] Replaced `runStrength` and the 0–100 Fish In River output with a
      river-specific versioned 1–10 presence curve and `current / maximum` UI.
- [x] Configured Scottville hydraulics and Maple → Bowman → M-37 measured-water
      priority.
- [x] Added modern USGS continuous/daily adapters and strict Monitor My
      Watershed parsing, QA, smoothing, peer-check, and fallback tests.
- [x] Replaced Schedule with the `conditionsSuggest` contract across the engine,
      storage, endpoint, client, UI, reason codes, and tests.
- [x] Implemented four conservative, cumulative Conditions Suggest stage
      checkpoints using only primary-gauge response and measured water
      temperature.
- [x] Generated the versioned 2021–2025 PM Conditions Suggest baseline from
      Scottville flow and the dedicated M-37 measured-water series for all five
      checkpoints.

### Reusable foundation order completed

1. [x] Specify stable movement engines and separate staging from river presence.
2. [x] Move PM Fall Chinook's river start to August 15.
3. [x] Replace singular source fields with role-based hydraulic,
       water-temperature, and weather arrays.
4. [x] Add validated immutable draft/published configuration revisions.
5. [x] Add generic modern USGS and Monitor My Watershed adapters.
6. [x] Configure Scottville plus Maple, Bowman, and M-37 for PM.
7. [x] Replay the 2016–2025 Scottville history, seed config-version-matched
       baselines, reconcile conservative score/copy invariants, and create the
       new-river onboarding template.

Runtime defaults to the code-shipped validated document. After the revision
migration is deployed and at least one revision is published,
`RIVER_RUN_CONFIG_SOURCE=database` makes the Edge Function load only valid
published documents. An empty, invalid, or failed database config read fails
closed rather than reverting silently.

Completing this order does not complete every public rollout phase. The
remaining Conditions Suggest in-app calibration/copy acceptance, PM threshold
acceptance, hidden runtime observation, and public release gates stay open
below.

### Reconciled legacy behavior

The former percentile-derived Fishability bands and rain/stain proxy have been
removed. Fishability now uses audited PM absolute discharge bands, matched
24-hour hydraulic change, and primary-gauge freshness only. Weather
normalization keeps modeled precipitation distinct from measured water and
excludes forecast values from scoring. Remaining truth-layer acceptance items
are tracked in Phase 1 rather than described as active scoring behavior.

### Production state

- No V1.1 database schema, baseline, function, or app contract is deployed.
- The runtime public gate must remain false or unset.
- Existing local River Run migrations have not been accepted for V1.1 deployment
  and may be amended or replaced before the first production push.
- PM Run Stage is configured with an explicit July 1 pre-run watch, July 28
  staging advisory, August 15 river start, September 15–30 Peak, October 27
  main-run end, November 8 historical-presence tail, and November 11 true
  offseason copy transition. These boundaries and curve anchors remain
  calibration candidates.
- PM Fall Chinook's intended historical-presence maximum is `10`; its source
  notes and curve still require acceptance.

---

## 3. Phase 1 — Shared Gauge, Weather, And Temperature Truth Layer

Goal: make every downstream primitive consume trustworthy, provenance-aware
inputs.

### 3.1 Gauge provider and normalization

- [x] Implement the modern USGS Water Data API as the production path.
- [x] Remove the legacy WaterServices production path.
- [ ] Validate returned site ID, parameter, units, and timestamps.
- [ ] Reject missing-value sentinels, invalid values, and unusable qualifiers.
- [ ] Preserve provisional/approved and relevant provider qualifiers.
- [ ] Normalize all observation timestamps to UTC while preserving source
      timezone metadata.
- [ ] Add an audited tolerance around the target 24-hour comparison point.
- [ ] Return unknown trend when no comparison observation meets tolerance.
- [ ] Separate absolute 24-hour change from relative percentage change.
- [ ] Add structured provider telemetry without logging secrets or tokens.

### 3.2 One-or-more-gauge model

- [x] Replace the singular river `gauge` with `hydraulicSources[]`.
- [x] Require exactly one `primary` hydraulic source.
- [x] Support a river with only its primary source.
- [x] Support optional upstream, tributary, and secondary-context roles in
      configuration.
- [ ] Normalize every gauge against its own metric, datum, and history.
- [x] Prevent raw CFS or gage-height averaging in the role-based contract.
- [ ] Define normalized signal weights only for audited multi-gauge use.
- [ ] Ensure missing optional gauges reduce data quality without disabling the
      primary gauge.
- [x] Keep Fishability controlled only by the primary gauge.
- [ ] Add copy identifying the primary reach and optional context gauges.

PM V1.1 uses USGS `04122500` as its single primary gauge unless a later audited
config adds context gauges. Multiple gauges are supported but never required.

### 3.3 Weather normalization

- [ ] Convert Open-Meteo local timestamps with the returned timezone/offset, or
      request unambiguous UTC timestamps.
- [ ] Keep value-valid time separate from payload fetch time.
- [ ] Preserve daily date/value alignment when a weather value is null.
- [ ] Structurally separate past/current scored arrays from forecast arrays.
- [ ] Reject every weather value whose valid time is after refresh time.
- [ ] Label Open-Meteo values accurately as modeled rather than observed.
- [ ] Compute 24h, 48h, and 72h precipitation windows from past/current values
      only.
- [ ] Keep missing rain distinct from observed dry conditions.
- [ ] Support one primary weather point.
- [ ] Keep optional basin weather points out of scoring until documented
      weighting and replay prove value.

### 3.4 Temperature normalization

- [x] Implement the configured temperature-source priority.
- [x] Keep measured water, adjusted reference, and unavailable sources distinct.
- [x] Use source-dated values only.
- [x] Apply adjusted-reference offsets before trend/suitability calculations.
- [x] Remove air temperature from River Run inputs and scoring.
- [x] Require every supported river/run to reference at least one audited
      measured-water source.
- [x] Fail temperature-dependent output closed when all configured measured
      sources are stale or unavailable.
- [x] Return missing temperature rather than fabricated neutral/stable copy.
- [x] Store source type and evidence quality with every refresh.

### 3.5 Historical baseline foundation

- [ ] Add separate storage contracts for historical gauge level and historical
      gauge change.
- [ ] Generate both absolute and relative 24-hour change distributions.
- [ ] Use the river timezone and the configured ±14-day seasonal window.
- [ ] Require at least five distinct usable years for public historical
      comparisons.
- [ ] Store sample count, distinct years, provider, metric, method, and version.
- [ ] Generate a new V1.1 PM baseline version rather than silently reusing
      `2026-07-08`.
- [ ] Add coverage validation that fails closed.
- [ ] Add idempotent migrations and repository tests.

### Phase 1 exit criteria

- [ ] All truth-layer acceptance tests in V1.1 Section 11.1 pass.
- [ ] No forecast temperature or precipitation can affect a score.
- [ ] EST/EDT boundary fixtures pass.
- [ ] One-gauge and optional multi-gauge fixtures pass.
- [ ] PM level and change baseline reports show five or more usable years.
- [ ] Data provenance is visible in stored fixtures and API test responses.
- [ ] No downstream primitive still reads provider-specific payload fields.

---

## 4. Phase 2 — Run Stage

Goal: finalize the calendar-only primitive and its copy before any
condition-driven primitive.

- [ ] Preserve the user-facing title `Run Stage`.
- [ ] Confirm cross-year and same-year date-window resolution.
- [ ] Test every day immediately before, on, and after each stage boundary.
- [ ] Verify gauges and weather cannot change Run Stage.
- [ ] Rewrite every headline, detail, and tip to describe calendar timing only.
- [ ] Remove claims such as “fish are present” or “the run is established.”
- [ ] Record source notes for PM start, peak, end, and window widths.
- [ ] Mark the existing candidate PM dates accepted, revised, or unresolved.
- [ ] Complete the Primitive Completion Gate for Run Stage.

Candidate PM dates requiring evidence:

```txt
staging advisory: July 28
river start: August 15
peak stage: September 15–30
peak reference: September 20
end: October 27
late end: November 8
true offseason copy begins: November 11
```

### Phase 2 exit criteria

- [ ] All Run Stage boundary and copy tests pass.
- [ ] PM date research is attached to the config/audit record.
- [ ] Product owner accepts both the date behavior and final copy.

---

## 5. Phase 3 — Fish In River Historical Presence

Goal: replace the old population-strength model with the agreed river/run/
species historical-presence level.

- [x] Replace `runStrength: 1–5` with `historicalPresence.maximum: 1–10`.
- [x] Replace the 0–100 Fish In River result with an integer 0–10 level.
- [x] Add the configured maximum to the API and client contract.
- [x] Show the level as `current / maximum`, such as `8 / 10`.
- [x] Set PM Fall Chinook's intended maximum to `10`.
- [x] Add evidence notes and sources supporting PM's maximum.
- [x] Version and store the historical presence curve anchors.
- [x] Ensure Run Stage and the presence curve use the same active run year.
- [ ] Prove weather, gauges, Push, Fishability, and Conditions Suggest cannot
      alter this primitive.
- [ ] Rewrite every label and copy branch around “historical seasonal presence.”
- [ ] Prohibit live fish-count or observed-presence implications.
- [x] Add a maximum-6 fixture proving a lower-cap run cannot reach 10.
- [ ] Update storage, API, mobile UI, audit script, and telemetry properties.
- [ ] Complete the Primitive Completion Gate for Fish In River.

### Phase 3 exit criteria

- [ ] PM reaches exactly 10 only at accepted peak curve points.
- [ ] A lower-cap fixture never exceeds its configured maximum.
- [ ] Every date boundary and copy branch passes.
- [ ] Product owner accepts the PM curve, maximum, labels, and copy.

---

## 6. Phase 4 — Push

Goal: produce a conservative, river/run/species-specific current movement-
trigger read without double-counting weather and river response.

### 6.1 PM interaction table

- [x] Define PM gauge event strength using current state, absolute change,
      relative change, and historical same-season change percentiles.
- [x] Define PM rain thresholds as precursor context.
- [x] Define measured-water suitability and trend rules.
- [x] Define adjusted-reference water-source influence, cap, provenance, and
      reason code.
- [x] Define too-low, too-high, Severe High, stale, missing, and out-of-window
      caps.
- [x] Document every interaction and cap with a reason code.

### 6.2 Required behavior

- [x] Give rain precursor value before a gauge response where appropriate.
- [x] Replace full rain credit once the primary gauge reflects the same event.
- [x] Prevent rain and gauge from receiving duplicate full credit.
- [x] Prevent a dry rainfall estimate from subtracting once the primary gauge
      shows a Meaningful or Sharp measured rise.
- [x] Prevent heavy rain into an already-high river from reading as simply
      better.
- [x] Evaluate temperature direction together with absolute biological
      suitability when measured water exists.
- [x] Prevent continued cooling below a configured suitable range from adding
      benefit.
- [x] Make missing current measured-water temperature Unavailable; missing rain
      adds no credit.
- [x] Make missing/older-than-24h primary gauge Unavailable.
- [x] Cap stale gauge at 55.
- [x] Cap Severe High hydraulics at 49 unless a documented PM exception is
      accepted.
- [x] Begin Push automatically on each run's configured river `start`, not its
      earlier staging advisory.
- [x] Stop Push scores and supportive-history display after that run's
      configured `end`.
- [x] Keep Push independent from Fish In River.

### 6.3 Score and copy

- [x] Retain the 0–100 Push scale unless replay demonstrates a product reason to
      revise it.
- [x] Verify Weak, No clear push, Possible, Strong, and Very strong boundaries.
- [x] Build copy for every score band and material modifier.
- [x] State that Push describes trigger conditions, not confirmed movement.
- [x] State that fresh lake entry may occur without a textbook event and is more
      commonly associated with cooling, rain, and a river rise.
- [x] Show the latest recorded `Possible`-or-stronger supportive conditions for
      the exact run season, engine version, and configuration version.
- [x] Keep this history separate from scoring and call it a “supportive Push
      signal,” never a confirmed push; show its category and date.
- [x] Add deterministic interpretation copy for Strong Push with poor
      Fishability.
- [ ] Complete the Primitive Completion Gate for Push.

### Phase 4 exit criteria

- [x] Dry/hot, cooling-only, rain-before-rise, fishable-rise, large-rise,
      high-water, stale, and missing-input fixtures pass.
- [x] Score and copy replay together for representative PM historical events.
- [x] No replay result contains duplicate rain/gauge credit.
- [x] Supportive-condition history cannot leak across seasons or configuration
      versions and reports an honest no-record/unavailable state.
- [ ] Product owner accepts PM Push scoring and final copy.

---

## 7. Phase 5 — Conditions Suggest

Goal: replace Schedule with a conservative historical comparison of cumulative
completed conditions at four meaningful early-run checkpoints.

### 7.1 Rename and contract migration

- [x] Rename the user-facing primitive from Schedule to Conditions Suggest.
- [x] Replace public API key `schedule` with `conditionsSuggest`.
- [x] Update engine types, storage payloads, reason codes, telemetry, app
      contracts, UI, tests, and copy.
- [x] Do not add a compatibility adapter because V1.1 is not deployed.
- [x] Ensure the final public response exposes only one primitive.

Legacy migration filenames containing `schedule` may remain only when renaming
would break an already-applied migration history. Because River Run V1.1 is not
deployed, prefer clear V1.1 migration names before the first push.

### 7.2 Historical determination

- [x] Evaluate only at river start, building start, peak start, and peak
      complete.
- [x] Use every completed date from staging start through each checkpoint's
      cutoff; later checkpoints retain earlier evidence.
- [x] Keep the displayed result locked between checkpoints while raw evidence
      continues to refresh daily.
- [x] Display Evaluating before river start.
- [x] Use primary-gauge response normalized against the PM historical change
      distribution.
- [x] Require measured water-temperature suitability/trend.
- [x] Return Insufficient evidence when measured water temperature is
      unavailable.
- [x] Do not score rain independently.
- [x] Generate the equivalent cumulative checkpoint index for every usable
      historical year.
- [x] Use the configured p75 default for Ahead.
- [x] Use the configured p25 default for Delayed.
- [x] Use Typical between those boundaries.
- [x] Require at least 80% usable cumulative days and five historical years.
- [x] Return Insufficient evidence immediately when a required gate fails.
- [x] Cap progressively colder relative conditions once the configured
      cool-enough percentile is reached.
- [x] Temper a direct Ahead-to-Delayed or Delayed-to-Ahead checkpoint reversal
      to Typical.
- [x] At peak complete, display Timing complete, retain the last timing result
      in `timingLabel`, and stop later timing reclassification.

PM implementation evidence:

- Baseline version: `pm-fall-chinook-conditions-v3`
- Gauge: Scottville `04122500`, discharge only
- Dedicated comparison temperature: PMTU M-37 result `3201`
- Historical years: 2021–2025
- Covered checkpoints: `5 / 5`
- 2026 checkpoint dates: August 15, August 24, September 1, September 15,
  September 26
- Cumulative expected/minimum days: `18/15`, `27/22`, `35/28`, `49/40`, `60/48`
- Mechanical replay: `25` historical checkpoint samples
- Candidate distribution: `1 Ahead / 22 Typical / 2 Delayed`
- Final checkpoint distribution: `1 Ahead / 22 Typical / 2 Delayed`
- Direct reversals tempered: `0` in the historical sample; deterministic
  reversal fixtures pass
- Strongly mixed samples resolved conservatively: `3`
- Ahead/Delayed candidate component-agreement violations: `0`

Maple remains the first current-temperature source for Push. Conditions Suggest
uses M-37 for both its current daily evidence and its M-37 historical comparison
so source provenance never changes silently.

### 7.3 Copy

- [x] Every confident headline naturally says “Conditions suggest…”.
- [x] Copy names cumulative completed conditions and the historical checkpoint
      comparison.
- [x] Copy never claims biological progression was observed.
- [x] Copy explains missing measured water temperature, missing history, or
      insufficient days.
- [x] Copy distinguishes today's Push from the locked cumulative checkpoint.
- [x] Post-peak copy says the configured run is well underway by calendar timing
      only until the main run end; it then says timing and Push are complete
      without claiming fish were observed.
- [ ] Complete the Primitive Completion Gate for Conditions Suggest.

### Phase 5 exit criteria

- [x] Evaluating, Ahead, Typical, Delayed, Insufficient evidence, and Timing
      complete boundaries pass.
- [x] Checkpoint locking, cumulative retention, reversal tempering, and
      immediate-insufficient behavior pass.
- [x] Same-day Push cannot alter Conditions Suggest.
- [x] Rain alone cannot alter Conditions Suggest.
- [x] Mechanical 2021–2025 PM replay passes with zero candidate agreement
      violations.
- [ ] Product-owner calibration and copy review pass.

---

## 8. Phase 6 — Fishability

Goal: describe the primary gauged reach's current fishing shape without
unsupported clarity or safety claims.

### 8.1 PM threshold audit

- [x] Research and configure PM-specific Too Low, Low Fishable, Ideal, High
      Fishable, Too High, and Blown Out thresholds.
- [x] Record the metric, reach, season/run applicability, sources, and version.
- [x] Treat historical percentiles only as relative level context.
- [x] Do not infer Ideal or Blown Out solely from p40/p65/p90.
- [x] Fail Fishability closed if audited PM absolute thresholds are absent.

### 8.2 Algorithm and copy

- [x] Use the accepted compact band-base plus 24-hour trend-modifier table and
      conservative freshness/state caps.
- [x] Remove rain/stain scoring.
- [x] Do not claim water clarity without a validated turbidity source or audited
      relationship.
- [x] Use only the primary gauge for the score.
- [x] Make missing/older-than-24h primary gauge Unavailable.
- [x] Apply stale, unknown-trend, Very Low, sharp-rise/high-water, and Blown Out
      caps.
- [x] Explain the primary gauged reach and reach limitations.
- [x] Include the fishing-versus-wading/boating safety disclaimer.
- [ ] Complete the Primitive Completion Gate for Fishability.

### Phase 6 exit criteria

- [x] Every audited PM band boundary passes immediately below, at, and above its
      threshold.
- [x] Relative-percentile copy never becomes an absolute fishability claim.
- [x] No Fishability branch claims stain, clarity, wading safety, or boating
      safety.
- [ ] Product owner accepts PM thresholds, scores, and final copy.

---

## 9. Phase 7 — Integrated PM Replay, Copy, And App Acceptance

Goal: prove that the five completed primitives form one coherent product.

### 9.1 Cross-primitive matrix

- [x] Cover every Run Stage.
- [x] Cover every Conditions Suggest label.
- [x] Cover every Push and Fishability score band.
- [x] Cover Fish In River levels 0–10 and lower configured maximums.
- [ ] Cover fresh, stale, missing, modeled, adjusted-reference, and partial
      evidence.
- [ ] Cover single-gauge and optional multi-gauge disagreement.
- [x] Cover Strong Push + Poor/Tough Fishability.
- [x] Cover Peak Run Stage + Weak Push.
- [x] Cover Good Fishability + low historical presence.
- [x] Cover Delayed Conditions Suggest + Strong Push.
- [x] Cover Ahead Conditions Suggest + Beginning Stage.
- [x] Prove Strong Push + Post-run Stage is unreachable in a scored snapshot.

Every scenario asserts:

```txt
inputs
  -> normalized evidence
  -> score
  -> label
  -> reason codes
  -> headline/detail/tip
  -> data quality
  -> interpretation note
```

### 9.2 PM historical replay

- [x] Select representative PM fall seasons across at least five years.
- [ ] Include dry/hot, cooling, moderate rain, rain-before-rise, fishable rise,
      large rise, high water, falling water, stale data, and missing data.
- [ ] Store replay inputs, provider provenance, expected output, and reviewer
      notes.
- [x] Review numeric output and composed copy together.
- [x] Record false-positive, false-negative, overclaim, and contradiction
      findings.
- [x] Version any threshold, curve, or copy change and rerun the full replay.
- [ ] Produce a signed PM V1.1 calibration report.

### 9.3 Mobile and contract acceptance

- [x] Align server, client, storage payload, and mobile UI types for measured
      water provenance and Fish In River.
- [x] Show the five exact V1.1 primitive titles.
- [x] Show Fish In River as current/maximum.
- [x] Show primary gauge, reach limitation, freshness, and temperature source.
- [x] Show weather provenance.
- [ ] Confirm pull-to-refresh, screen focus, and foreground refresh.
- [ ] Confirm unavailable and insufficient states render correctly.
- [x] Confirm interpretation notes do not hide primitive copy.
- [ ] Confirm accessibility and small-screen layouts.
- [ ] Confirm request telemetry uses V1.1 primitive and error names.

### Phase 7 exit criteria

- [x] No unexplained cross-primitive contradiction remains.
- [x] No prohibited fish-count, certainty, clarity, or safety claim remains.
- [x] Full unit, integration, type, formatting, and replay suites pass.
- [x] PM launch and integrated audits are rewritten for V1.1 and marked
      repository-accepted.
- [ ] Product owner approves the complete PM screen, scores, and copy.

---

## 10. Phase 8 — Deployment Packaging And Dry Run

Goal: prepare one coherent V1.1 artifact without changing public state.

- [ ] Reconcile or replace all undeployed River Run migrations.
- [ ] Ensure migrations create V1.1 level/change baseline storage and updated
      snapshot contracts.
- [ ] Rename the undeployed scheduled-refresh migration if appropriate.
- [ ] Generate and audit the V1.1 PM baseline seed.
- [ ] Bump engine, config, baseline, curve, and copy versions.
- [ ] Update the PM audit script for all V1.1 gates.
- [ ] Update the production smoke script for `conditionsSuggest`, multi-gauge
      response shape, and 0–10 Fish In River.
- [ ] Confirm `RIVER_RUN_PUBLIC_ENABLED` defaults false.
- [ ] Confirm internal refresh authorization and minimum secret length.
- [ ] Run a database migration dry run.
- [ ] Run all automated validation from a clean checkout-equivalent state.
- [ ] Record exact migrations, function version, app build, and expected smoke
      commands in the launch audit.

### Phase 8 exit criteria

- [ ] Dry run contains only expected V1.1 migrations.
- [ ] No legacy public contract remains reachable.
- [ ] No production write or public exposure occurred.
- [ ] Repository acceptance evidence is complete.

---

## 11. Phase 9 — Hidden Production Rollout

Goal: verify real providers, cron, storage, auth, and rendering while the public
catalog remains hidden.

- [ ] Generate a production `RIVER_RUN_INTERNAL_KEY` with at least 16 random
      characters.
- [ ] Set Edge Function secrets with `RIVER_RUN_PUBLIC_ENABLED=false`.
- [ ] Add required Vault secrets for project URL, anon key, and matching
      internal key.
- [ ] Deploy accepted V1.1 migrations.
- [ ] Deploy the V1.1 River Run Edge Function.
- [ ] Confirm hourly cron exists and invokes the protected refresh route.
- [ ] Run hidden production smoke with `EXPECT_RIVER_RUN_PUBLIC=false`.
- [ ] Confirm the public catalog remains empty.
- [ ] Confirm level/change baselines and all expected snapshot/condition rows
      persist.
- [ ] Confirm provider provenance, freshness, and source timestamps are correct.
- [ ] Exercise provider timeouts, missing data, stale data, and storage errors.
- [ ] Install an internal/closed build on physical devices.
- [ ] Verify every V1.1 primitive and copy state against stored evidence.
- [ ] Monitor all expected condition slots and the daily snapshot.

### Hidden observation gate

- [ ] Observe at least 14 consecutive days during the PM fall evaluation window.
- [ ] Observe at least one meaningful weather/gauge transition, or extend the
      hidden period until one occurs.
- [ ] Confirm every expected refresh is either successfully stored or correctly
      represented as unavailable/insufficient.
- [ ] Resolve all severity-1 and severity-2 scoring, copy, storage, auth, and
      provider defects.
- [ ] Version and replay every calibration change before redeploying.
- [ ] Product owner accepts hidden production scores and rendered copy.

### Phase 9 exit criteria

- [ ] Runtime infrastructure is stable while public access remains disabled.
- [ ] Live provider inputs match stored normalized evidence.
- [ ] Hidden live reads remain conservative and composition-safe.
- [ ] Final launch audit records runtime acceptance.

---

## 12. Phase 10 — Controlled Public Release

Goal: expose only the accepted PM Fall Chinook combination.

- [ ] Confirm the PM config audit gate passes V1.1.
- [ ] Confirm no other river/run/species combination is public-enabled.
- [ ] Set `RIVER_RUN_PUBLIC_ENABLED=true`.
- [ ] Run authenticated production smoke with `EXPECT_RIVER_RUN_PUBLIC=true`.
- [ ] Confirm Michigan → Pere Marquette River → Fall → Fall Chinook appears.
- [ ] Confirm all other unsupported combinations remain hidden.
- [ ] Confirm manual, focus, foreground, and scheduled refresh behavior on
      physical devices.
- [ ] Monitor request success, provider freshness, unavailable rates, refresh
      completeness, scores, copy branches, and client errors.
- [ ] Define and test the release-disable procedure.
- [ ] Disable public access immediately for a material scoring/copy integrity,
      provider provenance, auth, storage, or safety defect.

### Phase 10 exit criteria

- [ ] PM Fall Chinook is publicly stable.
- [ ] No unresolved high-severity defect remains.
- [ ] Telemetry and operational response procedures are verified.
- [ ] Public output continues to match the accepted V1.1 engine and copy.

---

## 13. Expansion After PM Acceptance

Expansion happens one river/run/species combination at a time. Every new
combination repeats the relevant evidence, primitive, copy, replay, hidden
production, and public-release gates.

Recommended order:

1. Additional PM species that reuse the accepted primary gauge and weather
   infrastructure.
2. One additional river with one species/run.
3. Additional species on accepted rivers.
4. Spring, winter, summer, and holding movement profiles.

Each new combination requires:

- [ ] Researched Run Stage dates and source notes.
- [ ] Historical-presence maximum and curve.
- [ ] Primary gauge and optional context-gauge audit.
- [ ] Five-plus-year level and change baselines.
- [ ] Temperature-source audit.
- [ ] Movement interaction table.
- [ ] Fishability thresholds.
- [ ] Complete score/copy matrix.
- [ ] Historical replay.
- [ ] Hidden production observation.
- [ ] Explicit public enablement.

Candidate PM combinations, not yet approved:

- Fall Coho
- Fall steelhead entry
- Spring steelhead

Current Activity Outlook expansion status (August 2026):

- [x] PM Fall Chinook Activity, including continuous post-Peak floor and
      lifecycle interpolation.
- [x] Big Manistee Fall Chinook Activity, independently calibrated to Wellston.
- [x] Big Manistee Fall Coho Activity, including continuous November tapering
      and ending interpolation.
- [x] PM Fall Coho Activity back-half interpolation, using PM-specific dates and
      a dedicated replay/acceptance audit.
- [x] PM Fall Steelhead Activity without a salmon floor or mortality taper.
- [x] Big Manistee Steelhead Activity, calibrated to the Wellston/Tippy
      tailwater and audited without a salmon floor or mortality taper.
- [x] Ungauged-river weather-only Activity engine foundation: four-hour
      effective light plus in-block precipitation, Limited confidence, no air
      temperature substitution, and no inferred river state.
- [x] Betsie Chinook weather-only Activity calibration and 2007–2025 replay,
      including the continuous salmon floor/lifecycle transition.
- [x] Betsie Coho weather-only Activity calibration and 2007–2025 replay,
      including sectional copy and continuous lifecycle interpolation.
- [x] Betsie Steelhead weather-only Activity calibration and 2007–2025 replay,
      with no floor, lifecycle deduction, or mortality taper.

No candidate becomes a config shortcut. A shared river or gauge does not prove
shared run timing, presence maximum, temperature response, movement behavior,
Fishability thresholds, or copy.

---

## 14. Final Guiding Rule

River Run earns trust through bounded claims:

- Run Stage is researched calendar timing.
- Conditions Suggest is a historical comparison of completed evidence.
- Push is a current movement-trigger inference.
- Fishability is the shape of the primary gauged reach.
- Fish In River is a configured historical seasonal-presence level.

Prefer `Unavailable`, `Insufficient evidence`, or cautious copy over a stronger
answer that the available evidence cannot support. One deeply calibrated,
explainable PM Fall Chinook product is the prerequisite for every future River
Run expansion.
