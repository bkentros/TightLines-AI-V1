# River Run Activity Onboarding Standard

**Status:** Normative **Version:** 1.3 **Established:** 2026-08-24 **Applies
to:** Every river/species Activity configuration, replay, public copy, fixture,
and acceptance decision

## 1. Product meaning

Activity estimates the conditional responsiveness of a fish already present and
compares the supported time blocks. It does not estimate abundance, migration,
fresh entry, catch probability, exact location, fishability, or safety.

Public labels are:

- Inactive
- Reserved
- Moderate
- Active
- Highly active

Every result remains conditional on fish being present. Stage and Fish In River
own the seasonal presence context.

## 2. Why Activity receives a separate onboarding track

Activity combines species biology, river reach, measured water when available,
hourly weather, four-block presentation, lifecycle, missing-data behavior, and
copy. Shared engine code provides mechanics, not proof that another river’s
weights, temperature response, flow shape, calendar, or lifecycle constraints
fit.

Every river/species combination therefore requires:

1. Evidence review.
2. Explicit data mode.
3. Versioned calibration proposal.
4. Multi-year replay.
5. Controlled boundary tests.
6. Complete copy-state review.
7. Owner acceptance.

For a multi-river onboarding wave, Activity is a separate mandatory stop gate
for one river at a time. Do not calibrate it while that river's species truth,
calendar, endpoints, non-Activity behavior, or source-reach decision is awaiting
approval. Replay every supported species for the approved river, present the
complete Activity and rendered-review evidence, and obtain owner acceptance
before beginning Activity or implementation for the next river. Cohort-level
research may compare candidate modes and evidence, but it is not calibration
approval. See section 1.2 of the rapid onboarding playbook.

## 3. Input boundary

Allowed inputs in the current model:

- Effective light derived from supported hourly weather.
- Measured water temperature when the source is accepted.
- Accepted river behavior/presentation shape when hydraulics exist.
- Precipitation inside the same four-hour block as restrained context.
- Calendar stage/lifecycle solely for biological constraints and copy context.

Excluded unless a future model is separately implemented and validated:

- Air temperature as a substitute for water temperature.
- Barometric pressure.
- Moon phase.
- Wind as a direct fish-response score.
- Inferred clarity without an accepted measurement/model contract.
- Angler reports, catches, social activity, or pressure.
- Push/Timing scores.
- Fish In River abundance as Activity credit.

## 4. Data modes

### 4.1 Observed-river mode

Requires:

- Accepted measured water temperature.
- Accepted hydraulic source and local Fishability shape.
- Accepted hourly weather point.
- Explicit source reach copy.

All inputs must describe their true reach. A tailwater station does not measure
the full river.

Hydraulics and measured temperature must be compatible at the scoring reach.
Stations separated by a dam, lake, major tributary, tailwater transition, or a
materially different corridor are not a valid pair merely because they share a
river name. They may remain independently useful in Gauge Read.

Two nearby mainstem stations may support a deliberately narrower observed reach
only when the packet proves compatibility rather than assuming it. Record
distance and intervening controls, compare simultaneous readings against a
co-located or bracketing reference when one exists, publish signed error and
absolute-error distributions, inspect construction/channel changes, and state
the exact geography that must not receive the score. A good proxy relationship
does not turn either station into a whole-river observation.

For a fail-closed observed model, define the minimum input contract explicitly:

- Full requires fresh hydraulics, fresh measured temperature, and usable hourly
  weather for the target date.
- One missing measured river input may produce Moderate only when the remaining
  river input and weather are usable and a replayed cap applies.
- Missing weather or all measured river inputs returns Unavailable with no
  score, blocks, or leader.
- Provider recovery restores scoring automatically; a failed read is never
  replaced by a neutral value or an implicit weather-only model.

### 4.2 Weather-only mode

Weather-only mode is a deliberate limited model for a river without accepted
live hydraulics and measured water temperature. It does not make missing river
inputs neutral observations.

Requirements:

- `dataMode: weather_only` is explicit and versioned.
- Temperature and river-behavior weights equal zero.
- Light and weather have positive weights and the full set totals one.
- Confidence remains Limited.
- A true weather-only maximum constrains output.
- When weather-only inputs omit the species' primary response driver, any
  proportional evidence reduction must be explicit, versioned, justified, and
  replayed. It cannot be tuned solely to obtain a preferred label distribution.
- Copy visibly says river level, clarity, and measured water temperature are not
  evaluated.
- Users are directed to verify actual river conditions.
- No Fishability inference is generated.

Weather-only mode is accepted separately per species. A river-level foundation
does not automatically enable all species.

If required hourly weather is missing, weather-only Activity is `Unavailable`:
no numeric score, no blocks, and no strongest-window language. It is not an
Inactive zero. Valid complete weather must automatically restore scoring after
an ordinary provider outage.

## 5. Four-hour block contract

The supported local blocks are:

- 5–9 AM
- 9 AM–1 PM
- 1–5 PM
- 5–9 PM

Effective light and precipitation are evaluated inside the same block. Rain from
a previous block receives no inferred hydraulic or clarity effect.

The day’s rollup must remain within the range of its block scores. A single
block’s controlled weather change must not leak into another block.

### Leader language

- Name one strongest block only when it exceeds the next block by the accepted
  display tolerance.
- When two leaders are within tolerance, name both and state that neither has a
  clear advantage.
- Do not say all four blocks are equal when only the leaders are close.
- When required hourly inputs are absent, do not invent a strongest block.
- Inactive output may name the least constrained block but must say no block is
  broadly favorable.

## 6. Today/tomorrow schedule contract

Activity displays Today before 9 PM local time. At 9 PM it changes to Tomorrow
with explicit copy. Tomorrow may refresh at the 9 PM rollover, midnight, and 4
AM. Once the target day begins, completed four-hour blocks remain frozen; later
refreshes must not rewrite a block whose time has passed.

Requirements:

- Target-date label is visible in compact and expanded states.
- Tomorrow uses actual next-day block scores, not a reduced placeholder.
- Midnight and 4 AM refreshes may update only future/unstarted blocks.
- The first block freezes after 9 AM, the second after 1 PM, the third after 5
  PM, and the fourth after 9 PM in the river timezone.
- Stored snapshot/version information makes the freeze deterministic across
  devices.
- Tests cover daylight-saving boundaries and UTC/local-date rollover.

## 7. Calibration research packet

The Activity specialist must record:

- Species lifecycle and whether adults die after spawning or persist.
- River-specific run phases.
- Published water-temperature evidence for adult behavior, with limitations.
- Station reach and regulated/tailwater effects.
- Local hydraulic presentation bands.
- Evidence for light sensitivity or the explicit fact that exact weights are
  owner/product calibration rather than biological constants.
- The limited role of precipitation.
- Missing-data behavior.
- Hydraulic-change thresholds and their empirical seasonal distribution when
  Activity runs without a Push calibration to supply them.
- For proxy-paired stations: simultaneous-pair sample count, signed bias,
  median/mean/p90/p99 absolute error, maximum error, dates, and reach decision.
- Every owner-calibrated value and why it was selected.

Do not present a calibrated weight or exact breakpoint as a published biological
constant unless a source truly establishes it.

## 8. Calibration contract

The versioned rule set must include:

- Profile/engine identifier.
- Data mode.
- Minimum input contract and Full/Moderate/Unavailable transition table.
- Scope copy and early-season scope copy when applicable.
- Four component weights totaling one.
- Cold transition, preferred band, warm constraint, and barrier constraint.
- Missing-river, missing-temperature, late-run, ending, and weather-only caps as
  applicable.
- Lifecycle ramp or deduction/constraint behavior.
- Evidence notes.

Calibration requirements:

- Light can separate blocks but cannot erase biological constraints.
- River behavior describes presentation shape; it does not re-award migration
  credit for a rise.
- Precipitation remains minor context and does not infer clarity.
- Warm and cold constraints change smoothly unless a genuine biological or
  data-quality barrier requires a hard cap.
- Lifecycle effects should avoid calendar-date score cliffs.
- Salmon late-run optimism is constrained without pretending every fish is in
  identical condition.
- Steelhead must not inherit salmon mortality logic.
- A complete-input response floor, if used, requires justification, lifecycle
  fade behavior, replay evidence, and explicit absence in limited-data states.

## 9. Historical replay protocol

Use the longest fixed interval with reliable coverage. Set the interval before
judging the score distribution and record exclusions. A minimum five-year window
is expected; longer reliable records are preferred.

Season iteration is local-date and year-aware. When the configured tail ends in
the next calendar year, expected-day counts, stage resolution, lifecycle dates,
weather requests, and controlled comparisons must all advance across New Year. A
lexical month-day loop is not an acceptable replay implementation.

Required report:

- Expected dates and usable complete dates.
- Coverage percentage.
- Missing counts for current/prior hydraulics, temperature/lookback, and
  weather.
- Daily and block min, p10, mean, median, p90, and max. Means never replace
  quantiles or distributions.
- Unique daily and block scores.
- Label distribution overall and by run phase.
- For Beginning, Building, Peak, Tapering, Ending, and every configured
  residual/holding phase: day count, complete-block count, daily distribution,
  pooled-block distribution, and the distribution for each named block.
- Best-block frequency.
- Block-spread median, p90, max, and useful thresholds.
- Warm, cold, preferred-temperature, low/high/extreme-flow subsets.
- Counts of exceptional (90+) results.
- Tapering, ending, residual, and holding distributions.
- Foreign-geography, reach-scope, copy-completeness, block, rollup, cap,
  lifecycle, and weather-leakage failures.

Review questions:

- Are exceptional scores uncommon and explainable?
- Does the median fit the species and run phase?
- Are blocks meaningfully differentiated without artificial volatility?
- Does missing evidence reduce confidence rather than become credit?
- Can warm, cold, or extreme conditions remain implausibly optimistic?
- Do late salmon scores decline smoothly?
- Do Steelhead remain alive without being automatically active?
- Does the represented reach appear in copy where material?

Do not tune only to hit an attractive score distribution. Every change must have
a product or biological rationale and pass controlled tests.

### 9.1 Stage-by-block acceptance table

Every replay artifact must contain one row per lifecycle stage and block with:

| Stage | Block | Usable days | Samples | Min | p10 | Mean | Median | p90 | Max | Label shares | Cap/confidence notes |
| ----- | ----- | ----------: | ------: | --: | --: | ---: | -----: | --: | --: | ------------ | -------------------- |

Also include an `all blocks` row for each stage. Do not pool a sparse stage into
an adjacent stage merely to make its results look stable. Stage means are a
diagnostic for lifecycle behavior—not acceptance targets and not evidence of
catch rates.

The lifecycle shape is nevertheless a product acceptance invariant for every
species/run replay:

- Peak must have the highest mean daily Activity score.
- Building and Tapering must form the nearest meaningful shoulders. Unless the
  packet predeclares a stricter evidence-backed tolerance, each must remain
  below and within 20 points of Peak.
- Pre-run, Beginning, Ending, and Post-run/residual means must remain below
  Peak. They should be noticeably lower without an unexplained stage cliff.
- Environmental inputs must still differentiate years and days within every
  stage. Never obtain the shape by replacing live conditions with a calendar
  score.

If temperature or another historically correlated input erases this shape, first
verify the run calendar, thresholds, station reach, and replay interval. If
those remain accepted, use a small, versioned stage-response adjustment with a
true maximum. Apply and test hard warm, barrier, extreme-flow, and missing data
caps after the adjustment so lifecycle shaping cannot manufacture a high score
under unsafe or unsupported conditions. Record the before/after stage means and
rationale in the calibration ledger.

### 9.2 Calibration iteration ledger

Record the baseline ruleset before tuning. For every candidate change record:

- Field and before/after values.
- Direct evidence or product defect that motivated the change.
- Expected stage/block effect before running the replay.
- Actual before/after deltas in coverage, quantiles, means, labels, caps,
  missing states, lifecycle continuity, and invariant failures.
- Decision: accept, reject, or investigate.

Rerun the complete predeclared interval after every accepted group of changes.
Never retain a partial replay made with a different calendar, source contract,
or scoring version as the final artifact. Acceptance requires the final
ruleset's full replay and zero unexplained invariant failures.

## 10. Controlled acceptance tests

At minimum prove:

- Isolated cloud/light changes affect only the intended block.
- Isolated in-block rain affects only that block and remains bounded.
- Temperature shoulders and constraints are monotonic where intended.
- Warm and barrier caps cannot be bypassed by dark skies.
- Extreme hydraulics constrain observed-river output.
- Missing temperature and hydraulics never become positive reasons.
- Weather-only output never mentions measured river or temperature behavior.
- Daily rollup stays inside the block range.
- Leader/tie language matches block separation.
- Lifecycle transitions have no unexplained one-day cliff.
- Salmon and Steelhead terminal behavior remain distinct.
- Today/tomorrow rollover and block freezing work at every boundary.
- Headline, Why points, Guide’s Read, confidence, and target date agree.

## 11. Public copy states

Every Activity configuration must cover:

- Today and tomorrow.
- Full, Moderate, and Limited confidence.
- Staging/conditional sparse-fish context.
- Beginning, building, peak, tapering, ending, and terminal behavior.
- Inactive through Highly active labels.
- Clear leader, near tie, and no-separation cases.
- Missing weather.
- Missing measured temperature.
- Missing river behavior.
- Weather-only behavior.
- Warm, cold, and extreme-flow constraints.

Copy structure:

- Headline: responsiveness conclusion plus the material qualification.
- Why point 1: overall interpretation.
- Why point 2: strongest block/leader relationship and primary driver when
  supported.
- Why point 3: the most important limitation, confidence, or lifecycle fact.
- Guide’s Read: one prioritized way to use the outlook.
- Static note:
  `Responsiveness if fish are present—not abundance or catch probability.`

## 12. Activity definition of done

Activity is accepted only when:

- Research and calibration decisions are versioned.
- Data mode and source reach are correct.
- Replay coverage and distributions are reviewed.
- Every lifecycle stage and every four-hour block has the required distribution
  table or an explicit insufficient-coverage blocker.
- The calibration iteration ledger preserves baseline, rejected candidates,
  accepted changes, and final full-replay results.
- Controlled and boundary tests pass.
- All public states have intended-state fixtures.
- Copy contains no abundance, movement, catch, safety, internal, or foreign
  geography claims.
- Today/tomorrow and block freezing pass in the river timezone.
- Product owner accepts the behavior and copy.
