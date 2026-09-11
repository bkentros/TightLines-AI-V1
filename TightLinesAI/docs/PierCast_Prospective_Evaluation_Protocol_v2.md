# PierCast Prospective Evaluation Protocol v2

**Re-frozen:** 2026-09-10 after the full-scale seasonal recalibration and before the first outcome was recorded<br>
**Forecast cohort:** engine `pier-cast-simple-model-v0.8.0`, active formula `seasonal-opportunity-bounded-temperature-v2`, same-issue comparator `seasonal-ceiling-x-temperature-v1`, seasonal calibration `piercast-core-seasonal-v0.4.0`, temperature calibration `piercast-core-temperature-v0.2.0`, and rating rubric `finfindr-opportunity-v1`<br>
**Status:** preregistered internal pilot protocol; not a claim of statistical validation

Protocol v1 remains frozen for the historical v0.7/v0.3 forecast cohort. Its forecasts and any attached outcomes must not be pooled silently with this cohort.

## Purpose and questions

This protocol tests the usefulness of the **FinFindr Opportunity Rating**. The score is not a fish count, detected presence, catch probability, or biological measurement. Its intended job is to rank target-specific pier opportunities on the shared `1.0–10.0` rubric.

The prospective evaluation asks:

1. Do higher PierCast scores rank target-specific pier sessions better than lower scores?
2. Does the bounded-temperature v2 score discriminate outcomes better than the direct-multiplier v1 comparator and the city × species seasonal rating alone?
3. How often do `Good` and `Excellent` previews correspond to an effort-backed zero-catch result?
4. Is performance reasonably stable across city, species, season, and forecast lead?

## Frozen analysis cohort

Any change to the formula, seasonal curve, temperature curve, source plan, outcome rubric, or material data-processing rule creates a new versioned cohort. Results from changed cohorts must not be silently pooled with this one.

The primary analysis uses one lead-day-1 forecast per eligible outcome: the latest as-issued lead-day-1 forecast generated before the start of the outcome's local calendar date. Lead day 0 and lead days 2–4 are secondary analyses. If more than one forecast can match under those rules, the latest eligible `generated_at` wins; forecasts generated after the event are never eligible.

## Eligible outcomes

The primary outcome cohort contains target-specific, assessable sessions with actual fishing effort recorded by the fisher, or a verified quantitative source with comparable effort. Each record must identify a supported city, included pier or breakwall, local date, and one of the four core species.

For an owner trip, the selected species means the angler deliberately targeted that species during the recorded effort. A trip targeting multiple core species may create one record per genuinely targeted species using the same effort duration. Incidental catches without target-specific effort are not primary outcomes.

An eligible `zero_catch` requires explicit positive effort and `catch_count = 0`. A positive requires `catch_count >= 1`. Closure, no access, unsafe/unfishable conditions, and insufficient observation remain useful operational records but are non-assessable `unknown` outcomes and never negatives.

Exclude from the primary cohort:

- qualitative reports without comparable effort;
- duplicates, test records, or records outside the supported city/species/structure scope;
- outcomes entered selectively only because a memorable catch occurred;
- forecasts generated after the relevant event; and
- any record whose inclusion rule was changed after its result was inspected.

All exclusions and their reasons must be counted and reported.

## Outcomes, baselines, and metrics

The primary outcome is binary: `positive` versus effort-backed `zero_catch`. Catch per unit effort, calculated as `catch_count / (effort_minutes / 60)`, is secondary and must remain species-specific.

The primary predictor is the full continuous bounded-temperature v2 score. Its fixed comparators are the same-issue direct-multiplier v1 score and the continuous seasonal rating before temperature adjustment. City, species, calendar month, and forecast lead are prespecified strata, not extra score inputs.

The primary metric is concordance/AUC for the lead-day-1 binary outcome, with uncertainty estimated by resampling city-date clusters. Report the same metric for both comparators and the paired differences between models.

Secondary reporting includes:

- observed positive share and catch-per-effort by the fixed rubric bands `Poor` (1–2), `Limited` (3–4), `Fair` (5–6), `Good` (7–8), and `Excellent` (9–10);
- Spearman association between continuous score and catch per unit effort;
- effort-backed zero-catch rate within `Good` and `Excellent` forecasts;
- results by lead day, city, species, and season where sample sizes permit; and
- counts and reasons for non-assessable sessions and unavailable forecasts.

Every estimate must show its denominator and uncertainty. A single catch, anecdote, or average score is not validation.

The owner can see the forecast while recording an outcome, so this is not a blinded trial. Forecast-driven trip selection, angler skill, method, repeat participation, and voluntary-reporting bias must be disclosed as limitations; they cannot be erased by a larger sample.

## Review boundary and stopping rule

At 50 eligible outcomes, perform only a data-quality review: check missingness, duplication, score-band coverage, targeting interpretation, and whether the collection workflow is selecting catches over blanks. Do not tune the model at this checkpoint.

A confirmatory evaluation requires all of the following:

- at least 200 eligible assessable outcomes spanning at least two open-water seasonal cycles;
- at least 50 outcomes with score `<= 4.0`, 50 with score `> 4.0` and `<= 6.0`, and 50 with score `> 6.0`;
- at least 20 eligible outcomes for every city and core species included in a reported claim;
- no single city, species, or calendar month contributing more than 40% of the primary cohort; and
- both positive and effort-backed zero-catch outcomes in the primary cohort.

If these conditions are not met, collection extends and the evidentiary bar is not lowered after examining results.

## Prespecified decision rule

The model supports a usefulness claim for this cohort only if all applicable conditions hold:

1. lead-day-1 full-model AUC has a point estimate of at least `0.60` and the lower bound of its 95% interval is above `0.50`;
2. the paired AUC difference versus both direct-multiplier v1 and seasonal-only is reported; v2 must not be worse than either by more than `0.02` at the lower bound of its 90% interval, and at least one paired point estimate must improve by `+0.02`;
3. observed positive share shows no material decrease as score bands rise;
4. among outcomes scored above `6.0`, the full model's effort-backed zero-catch rate is not more than 10 percentage points worse than the rate among outcomes whose seasonal-only ceiling is above `6.0`;
5. no adequately sampled city or species subgroup shows a material inverse ranking; and
6. the separate temperature-representation gate has passed for every city included in a public dynamic-temperature claim.

Failure triggers diagnosis of outcome collection, seasonal timing, temperature representation, and thermal response as separate components before any curve changes. It does not justify fitting to a few failed or successful trips.

## Sheboygan constraint

Sheboygan Chinook may be evaluated in the pooled protocol. A stronger Sheboygan-specific claim for coho, steelhead, or brown trout additionally requires at least 30 eligible local sessions for that species plus corroborating local evidence. Until then, those non-Chinook profiles remain medium-confidence candidates.

## Audit and release controls

- Preserve every as-issued forecast, outcome, version identifier, exclusion, and analysis script needed to reproduce the result.
- Do not tune on this cohort and then describe performance on the same cohort as held-out validation.
- Publish negative and inconclusive findings alongside favorable ones.
- Formula or calibration changes start a new prospective cohort; the original cohort remains immutable.
- Public ratings stay disabled until both prospective outcome and city-level temperature-representation gates pass.
