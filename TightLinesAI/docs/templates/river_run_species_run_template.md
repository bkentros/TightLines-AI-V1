# {{RIVER_NAME}} Fall {{SPECIES}} River Run Profile

**River ID:** `{{RIVER_ID}}` **Species slug:** `{{SPECIES}}` **Created:**
{{CREATED_ON}} **Status:** `research_incomplete`

> Prerequisite: the river foundation and public section wording are approved. Do
> not copy dates, thresholds, Activity weights, ceilings, or state prose from
> another river without independent evidence and replay acceptance.

## 0. Candidate capability audit

| Question/source class                               | Finding | Evidence IDs | Outcome    |
| --------------------------------------------------- | ------- | ------------ | ---------- |
| Occurs in this river system?                        |         |              | unresolved |
| Recurring run, rather than isolated occurrence?     |         |              | unresolved |
| Dependable public opportunity?                      |         |              | unresolved |
| Current agency assessment/species list              |         |              | unresolved |
| Stocking database and receiving-water history       |         |              | unresolved |
| Weir/ladder/creel/egg-take/technical-report archive |         |              | unresolved |
| Current agency field/enforcement observations       |         |              | unresolved |
| Regulations/closures (context only)                 |         |              | unresolved |
| Alias/scientific-name contradiction search          |         |              | unresolved |

**Capability decision:** `research_unresolved` **Contradiction search completed
by/date:** **Independent falsification review by/date:**

`unsupported` requires affirmative exclusion evidence or a completed search
across every applicable class. “Not found,” list omission, no stocking, or a
different-season record cannot independently establish absence. When occurrence
is established but calibration is weak, use a conservative ceiling/scope or keep
the run unresolved and hidden.

## 1. Species/run truth

| Field                               | Researched value | Evidence IDs | Status     |
| ----------------------------------- | ---------------- | ------------ | ---------- |
| Public species name                 |                  |              | unresolved |
| Run type                            |                  |              | unresolved |
| Migration purpose                   |                  |              | unresolved |
| Lifecycle after spawning            |                  |              | unresolved |
| Shared biology profile fit          |                  |              | unresolved |
| Distribution scope                  |                  |              | unresolved |
| Historical opportunity tier/ceiling |                  |              | unresolved |
| Barrier response differences        |                  |              | unresolved |

### 1.1 Species-specific endpoint decision

- Proposed product endpoint:
- Direct evidence this species reaches/passes each intervening structure:
- Structures with limited, seasonal, operational, or uncertain passage:
- Biological endpoint versus regulation/access/product endpoint:
- Opportunity distribution versus the physical endpoint:
- Exact reach represented by any Activity/Fishability measurement:
- Evidence that an apparent endpoint is affirmative exclusion rather than an
  access-list omission:
- Independent verifier/date:

### 1.2 Complete configuration-field inventory

Reconcile this table with the current `RiverRunProfile`, selected biology
profile, river profile, and any run-specific scoring rules. Add rows until every
runtime-affecting field is represented; this starter list is not a closed
schema.

| Config path/field                                                        | Proposed value | Direct evidence IDs | Comparison runs and comparability | Owner calibration | Replay/test artifact | Status     |
| ------------------------------------------------------------------------ | -------------- | ------------------- | --------------------------------- | ----------------- | -------------------- | ---------- |
| identity / biology / lifecycle / movement engine                         |                |                     |                                   |                   |                      | unresolved |
| primitiveCapabilities.*                                                  |                |                     |                                   |                   |                      | unresolved |
| runWindow.* (all boundaries)                                             |                |                     |                                   |                   |                      | unresolved |
| handoff.*                                                                |                |                     |                                   |                   |                      | unresolved |
| historicalPresence.maximum / distributionScope / anchors                 |                |                     |                                   |                   |                      | unresolved |
| activity.* (every source, weight, breakpoint, cap, ramp, missing rule)   |                |                     |                                   |                   |                      | unresolved |
| activity historical overlap (exact source pair; modern complete seasons) |                |                     |                                   |                   |                      | unresolved |
| fishabilityBands.* / baselineCoverage.*                                  |                |                     |                                   |                   |                      | unresolved |
| waterTemperature.* / conditionsSuggest.*                                 |                |                     |                                   |                   |                      | unresolved |
| runStageCopyStrategy / userCopyHints / version and audit gates           |                |                     |                                   |                   |                      | unresolved |

**Code-to-packet reconciliation reviewer/date:**

### 1.3 Portfolio strength comparison

The 1–10 maximum is ordinal product calibration, never a fish count. Compare
both weaker and stronger accepted runs before selecting it.

| Comparator run                | Maximum | Direct counts/years | Creel/destination evidence | Stocking/reproduction | Corridor/concentration/passage | Why comparable or not | Proposed consequence |
| ----------------------------- | ------: | ------------------- | -------------------------- | --------------------- | ------------------------------ | --------------------- | -------------------- |
| Closest weaker accepted run   |         |                     |                            |                       |                                |                       |                      |
| Proposed run                  |         |                     |                            |                       |                                |                       |                      |
| Closest stronger accepted run |         |                     |                            |                       |                                |                       |                      |

- Maximum confidence:
- Distribution-scope confidence:
- Evidence representing only one reach/ladder/weir:
- Facility operating window, capture/bypass limits, and represented run phase:
- Local field calibration source, season, observation years/effort, and limits:
- Why adjacent ratings were accepted or rejected:

## 2. Seasonal calendar

All dates are month-day values in the river timezone. Explain each boundary; do
not infer dates solely from a nearby river.

| Boundary                      | Date | Meaning | Evidence IDs | Evidence kind: entry/passage/harvest/spawn/egg-take/operation | Bias/limitations | Owner calibration? | Confidence |
| ----------------------------- | ---- | ------- | ------------ | ------------------------------------------------------------- | ---------------- | ------------------ | ---------- |
| Pre-run monitoring start      |      |         |              |                                                               |                  | no                 |            |
| Staging start                 |      |         |              |                                                               |                  | no                 |            |
| River-run start               |      |         |              |                                                               |                  | no                 |            |
| Beginning end                 |      |         |              |                                                               |                  | no                 |            |
| Established building start    |      |         |              |                                                               |                  | no                 |            |
| Broad building start, if used |      |         |              |                                                               |                  | no                 |            |
| Peak start                    |      |         |              |                                                               |                  | no                 |            |
| Peak anchor                   |      |         |              |                                                               |                  | no                 |            |
| Peak end                      |      |         |              |                                                               |                  | no                 |            |
| Tapering end                  |      |         |              |                                                               |                  | no                 |            |
| Main run end                  |      |         |              |                                                               |                  | no                 |            |
| Historical-presence tail end  |      |         |              |                                                               |                  | no                 |            |
| Late-copy end                 |      |         |              |                                                               |                  | no                 |            |

Explicitly reconcile first mouth concentration, first river entry, dependable
beginning, migration/passage peak, harvest peak, spawning/egg-take peak, and
terminal tail. A weir becoming effective or an agency beginning collection does
not prove fish first arrived that day.

## 3. Migration Stage copy matrix

For every reachable substate record the expected section plan and copy intent.
Stage uses seasonal expectation, never live confirmation.

| State key        | Trigger/date | Label | Primary section | Conditional secondary section | Headline intent | Why points | Guide action | Limitation |
| ---------------- | ------------ | ----- | --------------- | ----------------------------- | --------------- | ---------- | ------------ | ---------- |
| offseason        |              |       |                 |                               |                 |            |              |            |
| staging          |              |       |                 |                               |                 |            |              |            |
| beginning        |              |       |                 |                               |                 |            |              |            |
| building         |              |       |                 |                               |                 |            |              |            |
| peak             |              |       |                 |                               |                 |            |              |            |
| tapering         |              |       |                 |                               |                 |            |              |            |
| ending           |              |       |                 |                               |                 |            |              |            |
| terminal/handoff |              |       |                 |                               |                 |            |              |            |

## 4. Fish In River profile

- Historical maximum (1–10):
- Public opportunity tier:
- Distribution scope:
- Curve version:
- Direction transitions:
- Terminal behavior:
- Handoff behavior, only if a destination experience exists:

| Day offset from run start | Fraction of maximum | Biological/observational reason | Evidence IDs |
| ------------------------: | ------------------: | ------------------------------- | ------------ |
|                           |                     |                                 |              |

Acceptance:

- Public values use state-preserving five-point rounding and `≈` where required.
- The marker and copy use the same public value.
- Complete is not displayed as zero.
- The value is a seasonal estimate, never a live fish count.

## 5. Activity calibration

Read `docs/river_run_activity_onboarding_standard.md` completely.

### Evidence and mode

- Mode: `observed_river` / `weather_only` / unresolved
- Temperature source and represented reach:
- Hydraulic source and represented reach:
- Weather point:
- Species lifecycle evidence:
- Direct evidence versus owner-calibrated values:

### Source pairing decision

| Input                      | Source/reach | Same scoring reach as other observed inputs? | Included? | Reason |
| -------------------------- | ------------ | -------------------------------------------- | --------- | ------ |
| Hydraulics                 |              |                                              |           |        |
| Measured water temperature |              |                                              |           |        |
| Weather point              |              |                                              |           |        |

Stations separated by a dam, lake, major tributary, tailwater transition, or
materially different corridor cannot form observed-river Activity. If mode is
weather-only, list every excluded river source explicitly.

If a narrow observed reach uses nearby rather than co-located stations, record
distance/intervening controls and the simultaneous-pair validation: dates,
sample count, signed bias, mean/median/p90/p99/max absolute error, reference
station, construction/channel caveats, and excluded geography.

### Observed input/fallback contract

| Available inputs                               | Confidence/result                                               | Cap  | Recovery behavior |
| ---------------------------------------------- | --------------------------------------------------------------- | ---- | ----------------- |
| Weather + hydraulics + measured temperature    | Full                                                            |      |                   |
| Weather + hydraulics only                      | Moderate / Unavailable                                          |      |                   |
| Weather + measured temperature only            | Moderate / Unavailable                                          |      |                   |
| Weather only                                   | Unavailable unless separately accepted weather-only rules exist | none |                   |
| River inputs without target-day hourly weather | Unavailable                                                     | none |                   |

### Proposed rules

| Component                  | Weight | Rationale | Evidence/calibration IDs |
| -------------------------- | -----: | --------- | ------------------------ |
| Effective light            |        |           |                          |
| Measured water temperature |        |           |                          |
| River behavior             |        |           |                          |
| Precipitation context      |        |           |                          |

| Temperature/lifecycle control          | Value/dates                              | Rationale                         |
| -------------------------------------- | ---------------------------------------- | --------------------------------- |
| Cold-side transition                   |                                          |                                   |
| Preferred minimum/maximum              |                                          |                                   |
| Warm constraint                        |                                          |                                   |
| Barrier constraint                     |                                          |                                   |
| Tapering transition                    |                                          |                                   |
| Ending transition                      |                                          |                                   |
| Residual/holding behavior              |                                          |                                   |
| Weather-only true maxima               |                                          |                                   |
| Missing-primary-evidence scale, if any |                                          |                                   |
| Missing hourly weather                 | Unavailable; no score, blocks, or leader | Required for any four-block model |

### Required Activity replay report

- Replay years and coverage percentage.
- Exact local start/end dates, expected-day calculation, and whether the run
  crosses New Year.
- Missing flow, prior flow, temperature, lookback, and weather counts.
- Daily and block min/p10/mean/median/p90/max.
- Beginning, Building, Peak, Tapering, Ending, and residual/holding
  stage-by-four-hour-block counts, min/p10/mean/median/p90/max, label shares,
  cap frequency, and confidence/missing-state notes.
- Lifecycle-shape proof: Peak has the highest daily mean; Building and Tapering
  are below and normally within 20 points of Peak; all outside-stage means are
  lower without unexplained cliffs.
- Any stage-response adjustment, its true maximum, before/after means, and proof
  that warm, barrier, extreme-flow, and missing-data caps still hold.
- Any non-default warm-water maximum, the threshold-boundary defect it corrects,
  its replay delta, and proof that it remains below Active without weakening the
  barrier ceiling.
- Label distribution by lifecycle phase.
- Best-block distribution and block-spread distribution.
- Warm, cold, extreme-flow, and missing-data distributions.
- Controlled isolated-variable tests.
- Lifecycle boundary continuity tests.
- Complete copy and reach-scope invariants.
- Calibration changes made after replay and why.
- Provider recovery and missing-weather fail-closed tests.

| Stage     | Block      | Usable days | Samples | Min | p10 | Mean | Median | p90 | Max | Label shares | Cap/confidence notes |
| --------- | ---------- | ----------: | ------: | --: | --: | ---: | -----: | --: | --: | ------------ | -------------------- |
| Beginning | all blocks |             |         |     |     |      |        |     |     |              |                      |
| Building  | all blocks |             |         |     |     |      |        |     |     |              |                      |
| Peak      | all blocks |             |         |     |     |      |        |     |     |              |                      |
| Tapering  | all blocks |             |         |     |     |      |        |     |     |              |                      |
| Ending    | all blocks |             |         |     |     |      |        |     |     |              |                      |

Repeat each stage for all four named blocks and add residual/holding rows when
configured.

| Iteration | Fields changed | Evidence/product reason | Expected effect | Full replay artifact | Actual distribution/invariant delta | Decision   |
| --------- | -------------- | ----------------------- | --------------- | -------------------- | ----------------------------------- | ---------- |
| Baseline  |                |                         |                 |                      |                                     | unresolved |

Activity remains blocked until the replay is reviewed. A plausible anecdotal day
is not sufficient acceptance.

## 6. Fishability profile

If no accepted local hydraulic source exists, configure the deterministic
unavailable state and do not borrow another river’s gauge.

| Boundary          | Value | Evidence/calibration rationale |
| ----------------- | ----: | ------------------------------ |
| Too low maximum   |       |                                |
| Low fishable      |       |                                |
| Ideal             |       |                                |
| High fishable     |       |                                |
| Blown out minimum |       |                                |

- Metric/source/reach:
- Trend behavior:
- Freshness and unknown-trend caps:
- Permanent scope note:
- Extreme-state guidance:

Fishability describes presentation shape, not abundance, access, or safety.

## 7. Four-primitive copy acceptance

For Stage, Activity, Fish In River, and Fishability:

- [ ] Every reachable state and material variant has a fixture.
- [ ] Headline is one conclusion with the material qualifier.
- [ ] Why This Read has one to three independent points.
- [ ] Guide’s Read gives one prioritized action.
- [ ] Permanent limitations are not repeated as filler.
- [ ] Geography uses approved section labels only.
- [ ] No internal scores, thresholds, reason codes, provider IDs, or workflow
      language leaks publicly.
- [ ] Copy does not claim fish arrival, catch probability, or safety.
- [ ] Terminal behavior matches species lifecycle.
- [ ] Valid cross-primitive tensions remain intact.
- [ ] Foreign river, landmark, dam, gauge, and species denylist passes.

## 8. Research evidence ledger

| Evidence ID | Authority/title | URL/path | Published/updated | Event/data year(s) | Relevant page/table | Accessed | Facts supported | Limitations |
| ----------- | --------------- | -------- | ----------------- | ------------------ | ------------------- | -------- | --------------- | ----------- |
| R-001       |                 |          |                   |                    |                     |          |                 |             |

## 9. Run gate

**Run decision:** `blocked` **Configuration version:** **Activity rules
version:** **Presence curve version:** **Copy version:** **Replay artifact:**
**Owner acceptance/date:**

### Post-review correction record

| Review finding | Root-cause class | Structured truth/config corrected | Artifact/tests rerun | Generalizable? | Canonical guide/template/QA updated | Reviewer/date |
| -------------- | ---------------- | --------------------------------- | -------------------- | -------------- | ----------------------------------- | ------------- |
|                |                  |                                   |                      |                |                                     |               |
