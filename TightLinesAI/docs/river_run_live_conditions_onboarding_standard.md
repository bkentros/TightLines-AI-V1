# River Run Live Conditions Onboarding Standard

**Status:** Normative
**Version:** 1.0
**Established:** 2026-08-24
**Applies to:** Gauge Read configuration, source research, storage, API output,
public copy, visual presentation, and onboarding acceptance

## 1. Product meaning

Gauge Read answers: what is the accepted station measuring now, how has that
measurement changed in roughly 24 hours, and how does it compare with this date
in prior years?

It is not a scored primitive and does not determine migration, presence,
Activity, Fishability, clarity, access, or safety. Other primitives may consume
some of the same accepted observations under their own rules.

## 2. Supported metrics

Current public metrics are:

- Discharge in CFS.
- Measured water temperature in °F.
- Gauge height in feet.

Only render metrics available from an accepted source. Do not create empty
tiles to force a three-column layout.

Additional metrics require a separate product contract before onboarding:

- Stable provider and history support.
- Public value and unit meaning.
- Freshness, trend, precision, and missing behavior.
- Reach interpretation.
- UI design and cross-platform tests.
- A clear user decision improved by the metric.

Turbidity may eventually be valuable, but it must not be inferred from flow or
rain. Dissolved oxygen and conductivity should not be exposed merely because a
station publishes them.

## 3. Source acceptance

For every candidate source verify:

- Provider, station/site ID, and exact parameter/series ID.
- Public station name.
- Coordinates and public river section.
- Live endpoint and returned unit.
- Historical endpoint and returned unit.
- Observation cadence.
- Maximum acceptable age.
- Provisional/revised flags and qualifiers.
- Historical start/end and material gaps.
- Sensor moves, datum changes, discontinuities, or method changes.
- Attribution and license.
- Reach represented and known exclusions.

Probe the real endpoint. Station metadata alone is insufficient.

### Source roles

- One primary hydraulic source.
- Optional hydraulic stations remain labeled context unless a future model
  normalizes each independently.
- Temperature sources are selected in priority order, never averaged.
- A fallback is publicly labeled by its actual station/reach.
- A source is rejected when its metric, recency, unit, series identity,
  licensing, or reach cannot be verified.

## 4. Capability states

### Available

All configured metrics have accepted current values.

### Partial

At least one accepted metric has a displayable value and another configured
metric is unavailable. Available measurements remain useful; missing metrics
are not fabricated.

### Unavailable

No accepted metric is displayable. The UI gives a compact honest explanation.
This does not make the entire River Run unsupported. Stage and Fish In River
may remain available, Activity may use an accepted weather-only model, and
Fishability remains deterministically unavailable without hydraulics.

## 5. Current-value precision

Display precision follows real source resolution and processing:

- Discharge: normally whole CFS; do not invent decimals when the provider
  supplies whole units.
- Gauge height: normally two decimals when the source supports hundredths.
- Water temperature: normally one decimal after the accepted conversion and
  smoothing contract.

Precision communicates measurement resolution, not certainty. Do not expose
more decimal places than the observation supports. Preserve normalized raw
values internally for calculations.

## 6. Freshness

Every metric is independently classified:

- Fresh.
- Delayed.
- Older than 24 hours.
- Missing.

Older-than-24-hours and missing values are suppressed rather than presented as
current. The details surface shows observation time, public freshness, and
provisional status when applicable.

Use friendly public terms. Provider enums, database keys, source IDs, adapter
names, and strings such as `monitor_my_watershed` must never appear publicly.

## 7. Twenty-four-hour trend

Compare with the closest accepted observation at or before approximately 24
hours earlier, within the engine’s tolerance. If no acceptable prior reading
exists, the trend is unknown.

Public directions:

- Discharge/gauge height: Rising, Falling, Stable.
- Water temperature: Warming, Cooling, Stable.
- Missing comparison: 24-hour trend unavailable.

Trend copy names the metric/station context. It does not infer fish movement,
clarity, watershed-wide change, or safety.

## 8. Date-based historical context

Historical comparison is tied to this date, not a broad season.

Contract:

- Use the target calendar date ±3 days.
- Search prior years only.
- Use approved/accepted daily observations under the provider-specific
  baseline contract.
- Record sample count, historical years, record kind, baseline version, and the
  exact month-day window.
- Do not silently shrink the ±3-day rule because the exact day exists.
- Do not silently broaden beyond ±3 days to manufacture an average.
- Disclose gaps through record length and data details.
- Return no average when history is insufficient.

Public comparisons:

- Discharge: Lower than average, Normal, Higher than average.
- Temperature: Colder, Normal, Warmer.
- Gauge height: No average until a datum-consistent historical baseline is
  explicitly implemented and accepted.

Thresholds use the accepted historical distribution, not arbitrary percent
differences. “Normal” does not mean ideal for fishing.

## 9. Reach and provenance copy

The collapsed Gauge Read surface stays concise. Expanded Sources & Data Age
contains:

- Friendly metric name and provider label.
- Full station name on its own wrapping line.
- Current/delayed status.
- Updated time and provisional qualifier.
- Date-average record length and ±3-day window, or unavailable.
- Concise attribution.
- What the gauge represents.
- A single date-average methodology note.

Avoid repeating the same long provider disclaimer for every tile when one
shared note is sufficient. Station titles wrap; they are not truncated merely
to keep a status badge on the same line.

Approved public provider naming examples:

- `U.S. Geological Survey`
- `Pere Marquette Trout Unlimited monitoring station`

Internal implementation/provider identifiers remain in diagnostics only.

## 10. River-level onboarding fields

The river foundation must configure:

- Hydraulic source array and exactly one primary when hydraulics are accepted.
- Available hydraulic metrics.
- Measured-temperature source priority.
- Source maximum ages.
- Historical record metadata where the provider does not publish normals.
- Condition data capabilities.
- Gauge limitation copy.
- Refresh schedule in the river timezone.
- Weather source separately; weather does not appear as a Gauge Read metric.

Live Conditions is configured once per river and reused across all species and
runs. Never duplicate gauge research per species.

## 11. Acceptance matrix

Required automated and visual cases:

- All metrics fresh.
- Each single metric missing.
- Partial state.
- All metrics unavailable.
- Delayed state.
- Older-than-24-hours suppression.
- Provisional and revised/approved qualifier handling.
- Rising, falling, and stable hydraulics.
- Warming, cooling, and stable temperature.
- Missing 24-hour comparison.
- Lower/normal/higher discharge date context.
- Colder/normal/warmer temperature date context.
- Insufficient historical average.
- Temperature fallback selection and actual-station labeling.
- Gauge reach limitation.
- No-gauge river.
- Exact ±3-day historical window and prior-year-only behavior.
- Source-appropriate display precision.
- Long station names and attribution on narrow iOS/Android layouts.
- Collapsed/expanded details.
- No internal terminology.

## 12. Live Conditions definition of done

Live Conditions is accepted only when:

- Every displayed metric has a verified live source, unit, freshness contract,
  station, and reach.
- Historical comparison uses the date ±3-day contract or is unavailable.
- Twenty-four-hour comparison fails honestly when prior data is missing.
- Public precision matches source resolution.
- Attribution and licensing are satisfied.
- Partial, stale, missing, fallback, and no-gauge states pass.
- Expanded copy is concise, wraps cleanly, and contains no internal language.
- Product owner accepts the collapsed and expanded visual presentation.
