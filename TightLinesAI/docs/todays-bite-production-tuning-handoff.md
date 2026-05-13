# Today's Bite Production Tuning Handoff

Last updated: 2026-05-13

This is the handoff document for finishing FinFindr's deterministic Today's Bite / How's Fishing engine after the major renovation phases. It is written for a new master agent who will direct a separate working agent through fast, aggressive, high-quality audit and tuning work.

The working model for the next phase is:

1. The master agent understands this document, inspects code and artifacts directly, and decides each next move.
2. The user copies one-click prompts from the master agent to a working agent.
3. The working agent implements or audits one bounded phase and reports limited output.
4. The user brings that limited output back to the master agent.
5. The master agent verifies in code/artifacts/tests, then gives the next one-click prompt.

Do not rely on a working agent's summary alone. Always verify in code and generated artifacts.

## Product Goal

Today's Bite is a deterministic daily fishing conditions read. It should answer, in plain product terms:

- How good is fishing right now or on this forecast day?
- Why is the day good, fair, tough, or prime?
- What environmental variables are helping or hurting?
- Is this score trustworthy given available weather/water data?
- Can the dashboard 6-day strip and the full report agree because they are built from the same daily snapshot logic?

The goal is not an academic weather score. It is a practical fish-behavior score for users making fishing decisions.

The engine must work across:

- all supported canonical regions
- all 12 months
- `freshwater_lake_pond`
- `freshwater_river`
- `coastal`
- `coastal_flats_estuary`
- today and forecast days 0 through 6

Lake/pond and river are the highest priority. Coastal and flats/estuary still matter, especially tide/current and measured water handling.

## Non-Negotiables

- Keep the engine deterministic and explainable.
- Do not make the system messy again.
- Do not hide uncertainty. Missing data must lower reliability or omit variables, not invent zeros.
- Do not change recommender production logic unless explicitly approved.
- Every scoring change must be checked against daily-picks recommender-facing outputs.
- Today's Bite report, dashboard score chips, and score-only calls must stay aligned.
- Future-day reports must use target-day forecast snapshot materialization, not current live weather.
- Current measured coastal water temperature may only apply to day-0/today snapshots, not future forecast days.
- No broad interpolation may be production-wired until monthly temperature tables are audited/smoothed and interpolation passes recommender safety thresholds.

## Current Production State

The engine has already been renovated in production for the main variable families.

### Source / Snapshot

Implemented:

- `daily_mean_air_temp_f` now comes from true daily high/low mean.
- Current/noon air is separate from daily mean.
- Forecast-day snapshots materialize target-day temp, precip, pressure, cloud, sun, tide, and prior-day windows.
- Forecast day offsets 0..6 are explicitly covered by tests/audits.
- App-side forecast cache advances at the fishing location's local midnight.
- Future forecast reports strip current measured-water temperature fields.

Important behavior:

- Day-0 coastal/flats may use measured water temperature when available.
- Future coastal/flats use forecast air fallback unless future measured water is legitimately available.

### Temperature

Production is wired to Temperature V2.1-lite.

Current behavior:

- Freshwater uses daily mean air temperature.
- Coastal/flats use measured water temperature when valid for day-0.
- Coastal/flats without measured water use air daily mean fallback.
- Region/month temperature rows still provide the seasonal favorability baseline.
- Stable favorable complete same-source history gets only a small `+0.05`.
- Stable neutral/bad hot/cold gets no stability rescue.
- Missing history gets no stability bonus.
- Shock toward meaningfully better favorability can soften only to `-0.90`.
- Shock into worse heat/cold keeps full penalty.
- Shock blocks trend stacking.

Important truth:

The engine still uses region/month temperature bands/tables. They matter. The renovation made the model cleaner and more behavior-aware, but table quality is still critical. If a region/month row is wrong, temperature can still be wrong.

Interpolation status:

- Broad interpolation was tested and was too disruptive.
- Boundary-only interpolation improved month cliffs but still caused too much score/recommender churn.
- Production intentionally uses the current region/month row directly.
- Interpolation remains parked until temperature tables are audited and smoothed.

### Rain / Runoff

Production is wired to Rain/Runoff V2.

Current behavior:

- Light active rain is mild, not automatically disruptive.
- Heavy active rain remains strongly negative.
- Wet-baseline recent rain is handled more honestly.
- Missing precip windows are not treated as zero.
- River runoff is a precipitation-based hydrology proxy using 24h/72h/7d windows.
- River runoff returns missing/null if required precip windows are incomplete.
- Spring/early-summer mountain/PNW/Alaska/Great Lakes hydrology sensitivity exists.
- Desert/high-desert/southern California remain flash-sensitive.

### Wind

Production is wired to Wind V2 score-only high-wind penalty.

Current behavior:

- Light/useful breeze behavior is preserved.
- High/extreme wind is more negative by context.
- Labels/tags/gates were preserved to protect recommender coupling.

### Light / Cloud

Production is wired to Light/Cloud V2.

Current behavior:

- Heavy overcast no longer becomes an oversized daymaker.
- Heavy overcast is capped when paired with strong wind.
- Clear/cold neutralization and warm/hot glare behavior are preserved.
- Labels/details/missing behavior are preserved.

### Pressure

Pressure was audited and left unchanged.

Current behavior was already good:

- Stable pressure is neutral.
- Sparse/two-point history downgrades reliability.
- Missing pressure does not inflate reliability.
- Fast falls and volatile pressure are penalized.
- Recent stabilization is handled separately.

### Tide / Current

Production is wired to Tide/Current V2 score-only behavior.

Current behavior:

- Measured current wins over stage/high-low exchange.
- Inshore soft current is modestly helpful.
- Inshore too-hard current is clearly negative.
- Flats/estuary soft current is helpful.
- Flats/estuary strong/too-hard current is cautionary or negative.
- Stage-only behavior, missing behavior, reliability, source priority, and timing were preserved.
- Tide timing changes remain diagnostic-only.

### Final Score Policy

Production is wired to Phase 9F `combined_policy_light`.

Final score-only caps:

- `active_disruption` precipitation caps final score at `55`.
- `recent_rain` with precipitation score `<= -0.45` caps final score at `65`.
- Any surfaced suppressor with weighted contribution `<= -10` caps scores above `70` to `69`.

This only changes final score and band. It preserves:

- normalized variables
- labels
- details
- modes
- reliability
- contributions
- drivers
- suppressors
- recommender production logic

## Latest Verified Production Audit State

Latest integrated production audit:

- Total rows: `41,472`
- Regions: `18`
- Months: `12`
- Contexts: `4`
- Archetypes: `24`
- Water clarity variants: `clear`, `stained`

Resolved / clean flags:

- `heavy_rain_score_too_high`: `0`
- `wet_baseline_score_too_high`: `0`
- `high_score_with_major_suppressor`: `0`
- `report_copy_conflicts_with_score`: `0`
- `river_blown_out_score_too_high`: `0`
- `river_stable_flow_overrewarded`: `0`
- `high_wind_score_too_high`: `0`
- `heavy_overcast_windy_score_too_high`: `0`
- `coastal_slack_score_too_high`: `0`
- `flats_too_hard_current_score_too_high`: `0`
- `missing_data_reliability_too_high`: `0`
- `driver_suppressor_conflict`: `0`

Remaining production audit flags:

- `low_score_with_multiple_strong_drivers`: `812`
- `hot_bright_calm_not_penalized`: `482`
- `improving_temp_shock_over_penalized`: `236`
- `stable_bad_temp_scored_too_well`: `118`
- `cold_clear_not_neutral_enough`: `84`
- `worsening_temp_shock_under_penalized`: `4`

Recommender protection in latest production audit:

- Attempted freshwater recommender rows: `20,736`
- Valid recommender rows: `17,280`
- Unsupported exact rows: `3,456`
- Actual recommender errors: `0`
- Coastal/flats rows: recorded as not applicable for daily-picks comparison in this harness

Latest validation commands passed:

```bash
deno run --allow-read --allow-write scripts/audit/run-todays-bite-integrated-rain-policy-cap-audit.ts
deno run --allow-read --allow-write scripts/audit/run-todays-bite-integrated-production-audit.ts
deno test --allow-all supabase/functions/_shared/howFishingEngine/__tests__/*.test.ts
deno test --allow-all supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/dailyScenario.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/runDailyPicksEngine.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/runDailyPicksSurface.test.ts supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts
npx tsc --noEmit
```

Observed passing counts:

- How Fishing tests: `186 passed | 0 failed`
- Recommender tests: `88 passed | 0 failed`
- TypeScript: passed

## Honest Current Concern

The architecture is in good shape, but the score range is too compressed for realistic complete-data archetypes.

Recent check from integrated production audit:

Including `missing_partial_data` synthetic fixture:

- Max score: `100`
- Min score: `10`

Excluding `missing_partial_data`:

- Realistic complete-data max: `78`
- Realistic complete-data min: `20`
- Rows `>= 90`: `0`
- Rows `>= 95`: `0`

This is not acceptable as final product calibration.

The engine should be able to show:

- upper 9s / near 10 on rare, unusually excellent days
- 8s on legitimately strong days
- 6s/7s for normal good-but-not-perfect days
- 4s/5s for mixed or mediocre days
- 2s for bad days
- rare 1s for catastrophic conditions

The current engine is safer and more sensible than before, but it is too conservative at the top end. It can reach low scores on bad setups, but true elite complete-data days are not scoring high enough.

## Why The Design Is Still Correct

The new architecture is the right direction because it is:

- deterministic
- source-correct
- explainable
- region/month aware
- water-type aware
- trend/stability/shock aware
- reliability-aware
- recommender-protected
- forecast-day aware

The problem is no longer the engine shape. The problem is calibration:

1. Region/month temperature tables must be audited and smoothed.
2. Complete-data elite/catastrophic fixtures must be added.
3. The final score curve must be calibrated so aligned positive drivers can reach the 90s without inflating ordinary days.
4. Remaining edge flags must be reviewed to determine true issue vs false-positive audit flag.
5. Copy polish should happen only after numeric calibration is stable.

## Core Tuning Goals

### Goal 1: Temperature Tables Must Be Trustworthy

Temperature is the most important and most sensitive variable.

Audit every region/month/context combination for:

- sensible cold/cool/near-optimal/optimal/warm/hot bands
- no sharp month-to-month cliffs unless biologically justified
- no stable bad hot/cold row scoring too well
- no unrealistic coastal air fallback behavior
- measured coastal water rows distinct from coastal air fallback rows
- trout/coldwater regions not over-warm-biased
- warmwater regions not over-cold-biased
- Florida/Gulf/South summer heat suppression
- northern spring/fall transition realism
- mountain/Alaska cold-season realism

Do not production-wire interpolation yet. First audit the tables. Then decide whether interpolation is needed and safe.

### Goal 2: Score Range Must Match Product Intuition

The 0-100 score maps to a 1.0-10.0 user-facing score.

Target behavior:

- `95-100`: freakishly excellent, rare, full-stack alignment, no major suppressors, high reliability
- `90-94`: excellent / upper 9s, rare, unusually good day
- `80-89`: strong / prime day, uncommon but not impossible
- `65-79`: good day, common enough in favorable seasons
- `50-64`: fair/mixed
- `35-49`: poor/tough
- `20-34`: bad
- `10-19`: rare catastrophic / near-unfishable conditions

The user explicitly wants upper 9s to be possible, almost 10 on unusually good days, 2s for bad days, and rare 1s for terrible days. The engine must support this without becoming hype-driven.

### Goal 3: Protect Recommender

The lure/fly recommender has already been heavily audited. Do not damage it.

Track at minimum:

- selected-pick changes
- thermal mode changes
- surface gate changes
- scenario tag changes
- water movement mode changes
- activity tier changes
- unsupported exact rows vs true errors

Hard rule:

- Production recommender logic/catalog/gates/scoring/tags/pick selection must not be changed unless the user explicitly approves.

Score-only changes can still affect recommender if recommender activity tiers use How Fishing score. Always measure this.

### Goal 4: Forecast 6-Day Must Stay Accurate

Any tuning must preserve:

- day offset 0..6 target-day means
- prior-day and day-minus-two temp history
- precip windows ending on target day
- pressure history ending near target local noon
- future measured-water stripping
- target-date tides and sun fields
- local-midnight cache semantics

The 6-day dashboard score and generated report for that date should agree because they use the same snapshot semantics.

## Recommended Finishing Sequence

Move fast, but keep each phase bounded and measurable.

### Phase A: Baseline Calibration Audit

Create or update a dedicated production calibration audit that answers:

- What is the realistic complete-data score distribution?
- Which archetypes can reach 80, 90, and 95?
- Which archetypes can reach 30, 20, and 10?
- Which regions/months never produce elite days even under ideal conditions?
- Which regions/months produce too many poor days under acceptable conditions?
- Which flags are true issues vs audit false positives?

This audit must exclude `missing_partial_data` from top-end/bottom-end score range conclusions.

Required output:

- JSONL artifact
- Markdown artifact
- score distribution by context
- score distribution by region
- score distribution by month
- top 50 realistic complete-data rows
- bottom 50 realistic complete-data rows
- elite-day miss table
- catastrophic-day miss table
- recommender impact table

### Phase B: Temperature Table Audit

Audit the monthly region/context temperature rows before tuning score curve.

Required output:

- table of region/month/context seasonal row values
- month-to-month row deltas
- large-cliff flags
- unrealistic hot/cold band flags
- stable bad temp flags
- improving shock flags
- recommended row edits, if any

Do not apply broad table edits without shadow candidate comparison.

### Phase C: Temperature Table Tuning

If Phase B finds row issues, tune the tables in shadow first.

Acceptance:

- stable bad temp flags decrease materially
- improving/worsening shock flags do not regress
- no broad recommender churn
- no large score deltas outside intended temperature rows
- interpolation remains off unless explicitly approved later

### Phase D: Score Range Calibration

Once table quality is acceptable, tune the final score curve or alignment policy.

Possible levers:

- positive raw score divisor
- negative raw score divisor
- high-confidence elite alignment boost
- catastrophic suppressor floor/cap
- no-major-suppressor prime boost
- context-specific score curve only if clearly justified

Do not use sloppy global inflation.

Elite boosts should require:

- high reliability
- no major suppressors
- multiple strong drivers
- temperature not bad
- hydrology/tide not bad for water type
- wind not extreme
- rain not disruptive

Catastrophic low scores should require:

- major suppressor stack
- bad thermal condition or shock
- blown-out hydrology, extreme wind, active disruption, too-hard current, or severe heat/glare combo
- high enough data confidence

Acceptance targets should be set before adoption. Suggested initial targets:

- realistic complete-data matrix has some `>= 90`
- rare elite fixtures can reach `95-99`
- ordinary good fixtures do not inflate above 90
- realistic complete-data matrix has some `10-19`
- bad fixtures can reach `20-29`
- no fixed prior issue regressions
- recommender selected-pick change rate stays low and explainable

### Phase E: Remaining Integrated Flags

Tackle remaining flags only after score range tuning:

- `low_score_with_multiple_strong_drivers`
- `hot_bright_calm_not_penalized`
- `improving_temp_shock_over_penalized`
- `stable_bad_temp_scored_too_well`
- `cold_clear_not_neutral_enough`
- `worsening_temp_shock_under_penalized`

For each flag:

- identify whether it is true issue or false-positive flag design
- fix scoring only if the behavior is truly wrong
- fix audit flag if the engine is right and the audit is too naive

### Phase F: Real-Weather Archive Validation

Synthetic audits are necessary but not sufficient.

Run representative real-weather archive checks across:

- northern lakes
- southern lakes
- Midwest rivers
- mountain trout rivers
- Florida/Gulf coastal
- southeast inshore
- flats/estuary
- desert/high desert
- Alaska/cold regions
- Great Lakes transition seasons

Use actual known dates or archive fixtures with weather patterns:

- perfect spring warming trend
- stable summer heat
- post-front cold shock
- heavy rain / blown river
- stable clear river
- overcast breezy good day
- bright calm hot day
- coastal moving tide
- flats slack/tough day
- high-wind coastal day

Archive validation should inspect:

- score
- band
- drivers
- suppressors
- report summary
- timing note
- reliability
- recommender scenario if freshwater daily-picks supported

### Phase G: Copy / Narrative Alignment

Only after numeric calibration is stable:

- fix summary copy that overstates or understates a score
- ensure drivers/suppressors match prose
- ensure active rain, wet baseline, hot bright calm, and stable bad temp do not produce misleading positive language
- keep copy deterministic
- avoid overtechnical internal phrases

### Phase H: Final Release Readiness

Before production rollout to thousands of users, require:

- all How Fishing tests pass
- all recommender tests pass
- `npx tsc --noEmit` passes
- integrated production audit passes
- calibration audit passes
- score range targets pass
- forecast day 0..6 readiness passes
- no recommender production logic drift
- no unreviewed app/cache/snapshot drift
- no unexplained score distribution collapse or inflation

## Master Agent Responsibilities

The master agent must:

- read this document
- inspect relevant code and artifacts directly
- never accept the working agent's claims without verification
- keep the work sequenced
- protect recommender quality
- provide one-click-copy prompts to the user
- make prompts specific enough that the working agent cannot wander
- demand compact but complete working-agent reports
- keep production changes behind shadow audits until adoption is justified
- avoid changing multiple unrelated surfaces in one phase

The master agent should be decisive. This is not an open-ended brainstorm anymore. The renovation architecture is in place; the remaining work is production calibration.

## Working Agent Reporting Format

Every working-agent prompt should request this exact report shape:

```text
Files changed
- ...

Behavior changed
- ...

Audit results
- ...

Recommender impact
- ...

Validation
- ...

Risks / caveats
- ...

Explicitly untouched
- ...
```

The working agent should not paste huge JSONL content. It should summarize metrics and point to artifacts.

## Initial Handoff Prompt For The Next Master Agent

Copy this into the next master agent:

```text
You are taking over as master/director for FinFindr's deterministic Today's Bite / How's Fishing production tuning.

Read this handoff document first:
docs/todays-bite-production-tuning-handoff.md

Context:
The major renovation is already production-wired for source/snapshot consistency, Temperature V2.1-lite, Rain/Runoff V2, Wind V2, Light/Cloud V2, Tide/Current V2, and Phase 9F final score caps. Pressure was audited and left unchanged.

Your job is not to restart the renovation. Your job is to direct the final deep audit/tuning session so the engine is production-ready for thousands of users.

Operating model:
- I will paste your prompts to a separate working agent.
- The working agent will return limited output to me.
- I will paste that output back to you.
- You must verify in code and artifacts, then provide the next one-click-copy prompt.

Critical priorities:
- Protect the lure/fly recommender. Do not change recommender production logic/catalog/gates/scoring/tags/pick selection unless explicitly approved.
- Audit/tune all supported regions, all 12 months, and all 4 water types.
- Lake/pond and river are top priority, but coastal and flats/estuary must remain sensible.
- Keep forecast day 0..6 snapshot behavior correct.
- Do not production-wire interpolation yet. It was tested and parked because it caused too much churn.
- Temperature bands/tables still matter and must be audited carefully.
- Current realistic complete-data scores are too compressed: excluding `missing_partial_data`, max is about 78, min is about 20, and there are no 90+ complete-data elite days.

End goal:
- Rare upper 9s / near 10 must be possible on unusually excellent days.
- 8s must be possible on strong days.
- 2s must be possible on bad days.
- Rare 1s must be possible on catastrophic days.
- Ordinary good days must not inflate into fake 9s.
- Bad data must not produce confident scores.
- Recommender output must stay protected and monitored.

Before giving me any worker prompt:
1. Inspect `docs/todays-bite-production-tuning-handoff.md`.
2. Inspect the latest integrated production audit artifacts:
   - `scripts/audit/todays-bite-integrated-production-audit.md`
   - `scripts/audit/todays-bite-integrated-production-audit.jsonl`
3. Inspect current temperature parity/audit artifacts:
   - `scripts/audit/todays-bite-temperature-v21-audit.md`
4. Inspect the key production files:
   - `supabase/functions/_shared/howFishingEngine/normalize/normalizeTemperature.ts`
   - `supabase/functions/_shared/howFishingEngine/score/scoreDay.ts`
   - `supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts`

Then provide the first one-click-copy prompt for the working agent.

The first working-agent phase should probably be a dedicated calibration baseline audit, not production tuning. It should quantify score compression excluding `missing_partial_data`, add elite/catastrophic complete-data fixtures, audit all regions/months/contexts, and report recommender impact surfaces.

Be aggressive and fast, but disciplined. We need production readiness, not cosmetic improvement.
```

## Suggested First Prompt From Master To Working Agent

The next master agent may revise this after inspection, but this is the intended first worker prompt:

```text
Implement Phase 10A as an audit-only Today's Bite calibration baseline. Do not change production scoring behavior.

Goal:
Quantify current production score compression and identify exactly what must be tuned so the engine can support rare upper-9s, normal strong 8s, bad 2s, and rare catastrophic 1s without harming recommender behavior.

Files to inspect first:
- docs/todays-bite-production-tuning-handoff.md
- scripts/audit/run-todays-bite-integrated-production-audit.ts
- scripts/audit/todays-bite-integrated-production-audit.md
- scripts/audit/todays-bite-temperature-v21-audit.md
- supabase/functions/_shared/howFishingEngine/normalize/normalizeTemperature.ts
- supabase/functions/_shared/howFishingEngine/score/scoreDay.ts

Create a new audit script:
- scripts/audit/run-todays-bite-calibration-baseline-audit.ts

Generate artifacts:
- scripts/audit/todays-bite-calibration-baseline-audit.jsonl
- scripts/audit/todays-bite-calibration-baseline-audit.md

Audit requirements:
1. Cover all canonical regions, all 12 months, and all four contexts:
   - freshwater_lake_pond
   - freshwater_river
   - coastal
   - coastal_flats_estuary
2. Include water clarity variants where recommender comparison needs them.
3. Exclude `missing_partial_data` from realistic score-range conclusions, but still track it separately.
4. Add explicit complete-data archetypes for:
   - elite_full_stack_lake
   - elite_full_stack_river
   - elite_full_stack_coastal
   - elite_full_stack_flats
   - strong_good_not_elite
   - ordinary_good
   - mixed_fair
   - bad_stack
   - catastrophic_lake
   - catastrophic_river
   - catastrophic_coastal
   - catastrophic_flats
   - hot_bright_calm
   - stable_bad_hot
   - stable_bad_cold
   - improving_temp_shock
   - worsening_temp_shock
5. For every row, record:
   - region
   - month
   - context
   - archetype
   - clarity if applicable
   - score
   - band
   - reliability
   - drivers
   - suppressors
   - normalized temperature fields
   - precip/runoff/tide/wind/light/pressure labels and scores
   - final score caps triggered, if inferable
   - flags
6. Produce Markdown summaries for:
   - score distribution by context
   - score distribution by region
   - score distribution by month
   - complete-data max/min excluding missing_partial_data
   - rows >=80, >=90, >=95
   - rows <35, <30, <20
   - top 50 realistic complete-data rows
   - bottom 50 realistic complete-data rows
   - elite fixture misses: elite rows below 90
   - catastrophic fixture misses: catastrophic rows above 20 or 30, split by severity
   - temperature table suspect rows
   - remaining integrated flag counts
7. Recommender protection:
   - Run daily-picks comparison for freshwater rows where existing exact daily-picks matrix supports it.
   - Record unsupported exact rows separately from true errors.
   - Report selected-pick IDs, thermal mode, activity tier, surface gate, scenario tags, and water movement mode where available.
   - Do not modify recommender production code.

Acceptance for this phase:
- Audit-only. No production normalizer, scoreDay, report copy, app UI, forecast/cache, or recommender production changes.
- Artifacts generated.
- How Fishing test suite passes.
- Recommender test suite passes.
- npx tsc --noEmit passes.

Validation commands:
deno run --allow-read --allow-write scripts/audit/run-todays-bite-calibration-baseline-audit.ts
deno test --allow-all supabase/functions/_shared/howFishingEngine/__tests__/*.test.ts
deno test --allow-all supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/dailyScenario.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/runDailyPicksEngine.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/runDailyPicksSurface.test.ts supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts
npx tsc --noEmit

Return only:
Files changed
Audit totals
Score range findings
Elite/catastrophic miss findings
Temperature table suspect findings
Remaining flags
Recommender impact
Validation results
Risks/caveats
Explicitly untouched
```
