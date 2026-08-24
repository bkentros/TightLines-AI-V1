# River Run Activity Onboarding Standard

**Status:** Normative
**Version:** 1.0
**Established:** 2026-08-24
**Applies to:** Every river/species Activity configuration, replay, public copy,
fixture, and acceptance decision

## 1. Product meaning

Activity estimates the conditional responsiveness of a fish already present
and compares the supported time blocks. It does not estimate abundance,
migration, fresh entry, catch probability, exact location, fishability, or
safety.

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
- Copy visibly says river level, clarity, and measured water temperature are
  not evaluated.
- Users are directed to verify actual river conditions.
- No Fishability inference is generated.

Weather-only mode is accepted separately per species. A river-level foundation
does not automatically enable all species.

## 5. Four-hour block contract

The supported local blocks are:

- 5–9 AM
- 9 AM–1 PM
- 1–5 PM
- 5–9 PM

Effective light and precipitation are evaluated inside the same block. Rain
from a previous block receives no inferred hydraulic or clarity effect.

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
- Every owner-calibrated value and why it was selected.

Do not present a calibrated weight or exact breakpoint as a published
biological constant unless a source truly establishes it.

## 8. Calibration contract

The versioned rule set must include:

- Profile/engine identifier.
- Data mode.
- Scope copy and early-season scope copy when applicable.
- Four component weights totaling one.
- Cold transition, preferred band, warm constraint, and barrier constraint.
- Missing-river, missing-temperature, late-run, ending, and weather-only caps
  as applicable.
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
judging the score distribution and record exclusions. A minimum five-year
window is expected; longer reliable records are preferred.

Required report:

- Expected dates and usable complete dates.
- Coverage percentage.
- Missing counts for current/prior hydraulics, temperature/lookback, and
  weather.
- Daily and block min, p10, median, p90, and max.
- Unique daily and block scores.
- Label distribution overall and by run phase.
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

Do not tune only to hit an attractive score distribution. Every change must
have a product or biological rationale and pass controlled tests.

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
- Static note: `Responsiveness if fish are present—not abundance or catch probability.`

## 12. Activity definition of done

Activity is accepted only when:

- Research and calibration decisions are versioned.
- Data mode and source reach are correct.
- Replay coverage and distributions are reviewed.
- Controlled and boundary tests pass.
- All public states have intended-state fixtures.
- Copy contains no abundance, movement, catch, safety, internal, or foreign
  geography claims.
- Today/tomorrow and block freezing pass in the river timezone.
- Product owner accepts the behavior and copy.
