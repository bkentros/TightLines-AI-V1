# River Run Live Conditions Onboarding Standard

**Status:** Normative **Version:** 1.3 **Established:** 2026-08-24 **Applies
to:** Gauge Read configuration, source research, storage, API output, public
copy, visual presentation, and onboarding acceptance

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

Only render metrics available from an accepted source. Do not create empty tiles
to force a three-column layout.

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

For a multi-river wave, candidate-source discovery and endpoint probing belong
in the cohort foundation/source-feasibility gate. Record accepted, rejected, and
unresolved sources for every river and stop for owner approval before a source
is treated as runtime configuration. Final reach eligibility and Gauge
Read/Fishability/Activity roles are then locked during that river's individual
truth gate; approval for one river or primitive does not approve another. See
section 1.2 of the rapid onboarding playbook.

The probe must validate returned timestamps and numeric observations, not only
HTTP success. Record parameter codes, units, null/sentinel behavior, timezone,
cadence, and the probe date. A provider outage or malfunction fails closed to
the appropriate delayed/missing state. Once complete valid observations resume,
the normal refresh path must automatically restore the metric without a code or
configuration change.

Repeat the probe immediately before release across **every public river**, not
only the newly onboarded river. Resolve the latest usable observation
independently for each configured metric; discharge and gauge height can publish
at different timestamps. Separate these conclusions:

- Adapter/configuration health.
- Provider/station health.
- Freshness of the latest readable observation.
- Eligibility for Gauge Read, Fishability, Activity, or context only.

An HTTP 200 with null values, `Eqp`/`EQUIP`, nonnumeric sentinels, wrong units,
wrong series identity, or only stale observations is not a working live read.

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
metric is unavailable. Available measurements remain useful; missing metrics are
not fabricated.

### Unavailable

No accepted metric is displayable. The UI gives a compact honest explanation.
This does not make the entire River Run unsupported. Stage and Fish In River may
remain available, Activity may use an accepted weather-only model, and
Fishability remains deterministically unavailable without hydraulics.

Primitive fallback is evaluated independently from Gauge Read. A configured
observed Activity model may be capped Moderate with one fresh measured river
input, but must follow its declared minimum-input contract; missing weather or
all required measured river inputs may make Activity Unavailable even while
Gauge Read is Partial. When a provider resumes with a valid fresh value, the
next refresh must automatically restore the corresponding metric and scoring
state. Do not require a configuration change, carry forward a fault sentinel, or
substitute a seasonal average.

Distinguish unavailable states in public copy:

- **Unreadable:** an accepted configured source exists but currently has no
  displayable observation.
- **No accepted gauge:** research found no source that accurately represents the
  modeled river reach.
- **Unsupported metric:** another metric may be readable, but this metric has no
  accepted source.

## 5. Current-value precision

Display precision follows real source resolution and processing:

- Discharge: normally whole CFS; do not invent decimals when the provider
  supplies whole units.
- Gauge height: normally two decimals when the source supports hundredths.
- Water temperature: normally one decimal after the accepted conversion and
  smoothing contract.

Precision communicates measurement resolution, not certainty. Do not expose more
decimal places than the observation supports. Preserve normalized raw values
internally for calculations.

## 6. Freshness

Every metric is independently classified:

- Fresh.
- Delayed.
- Older than 24 hours.
- Missing.

Older-than-24-hours and missing values are suppressed rather than presented as
current. Gauge Read refreshes on an independent hourly cache key in season and
out of season; the protected hourly job warms that key, and the first request in
a new hour safely fills it if necessary. The four-hour scored-primitive cadence
must not prevent Gauge Read from seeking a newer observation.

Keep three times distinct:

- `observedAt`: when the provider measured the value.
- `refreshedAt`: when FinFindr queried/built Gauge Read.
- Device time: when the user is viewing it.

Freshness is based on provider `observedAt`, never request/cache time. The
collapsed surface and every metric tile visibly show `CURRENT`, `DELAYED`,
`PARTIAL`, or `UNREADABLE` plus friendly observation age and the exact
observation timestamp. Do not bury age only inside an expanded disclosure or
label a delayed cached observation `LIVE`.

During a multi-day provider fault, query enough recent history to retain the
last readable observation timestamp while suppressing its numeric value. Public
copy says the provider reading is currently unreadable and, when known, when it
was last readable. `NO GAUGE` is reserved for a river with no accepted source;
it is not the label for a configured malfunctioning station.

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
- Use approved/accepted daily observations under the provider-specific baseline
  contract.
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

Observation age is also shown on the collapsed metric tile; expanded details add
station, provenance, methodology, and reach rather than hiding the basic
freshness truth.

Avoid repeating the same long provider disclaimer for every tile when one shared
note is sufficient. Station titles wrap; they are not truncated merely to keep a
status badge on the same line.

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

The river's biological/scoring schedule and hourly Gauge Read retrieval are
separate contracts. Do not add 24 scoring slots merely to make measurements
fresher; keep the hourly live-conditions key species-independent so one provider
pull can serve every run on the river.

## 11. Acceptance matrix

Required automated and visual cases:

- All metrics fresh.
- Each single metric missing.
- Provider fault followed by a valid recovered numeric reading.
- Equipment-fault/null sentinel produces `UNREADABLE`, not zero, Stable, or
  `NO GAUGE`.
- Last readable observation time remains visible through a multi-day outage
  while its value remains suppressed.
- Hourly Gauge Read key is independent from the scored primitive refresh slot.
- Observation age is visible without expanding details and uses provider time.
- Hidden owner review uses the authenticated current-provider path. Fixture
  primitive scenarios cannot replace the visible Gauge Read, and a failed live
  review request must remain unavailable rather than falling back to synthetic
  measurements.
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
- Unreadable configured-source copy is distinct from no-accepted-gauge copy.
- Hourly refresh, last-readable timestamp, and automatic provider recovery pass.
- Expanded copy is concise, wraps cleanly, and contains no internal language.
- Product owner accepts the collapsed and expanded visual presentation.
