# FinFindr River Run — V1.1 Product And Engine Specification

**Product:** FinFindr

**Feature:** River Run

**Region:** Great Lakes tributaries

**Launch proof:** Pere Marquette River — Fall Chinook

**Specification version:** 2026-07-28.4

**Status:** Normative target contract; implementation reconciliation is required
before public release.

River Run gives migratory anglers five separate, deterministic reads for a
configured river/run/species combination. It uses researched seasonal timing,
official gauge data, weather context, temperature context, and river-specific
calibration.

The engine must never invent missing evidence or present an inference as an
observation. When the available evidence cannot support a determination, the
correct output is `Unavailable`, `Insufficient evidence`, or explicitly
qualified copy.

This document is the single source of truth for River Run V1.1. Existing code,
tests, API examples, or rollout notes that conflict with this document are
implementation gaps and must not be treated as accepted behavior.

---

## 1. Product Contract

River Run answers five independent questions:

| Primitive          | User question                                                                                                                                            | Output                                                                              | Refresh           |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------- |
| Run Stage          | Where is this researched run on its calendar?                                                                                                            | Stage label                                                                         | Daily             |
| Conditions Suggest | At five early-season checkpoints, do cumulative completed conditions suggest earlier, typical, or delayed timing compared with this river/run's history? | Evaluating; Ahead, Typical, Delayed, or Insufficient evidence; then Timing complete | Stage checkpoint  |
| Push               | Do current and recent conditions support a fresh movement event for this river/run/species?                                                              | Internal 0–100 score; public label and qualitative meter, or Unavailable            | Condition refresh |
| Fishability        | Is the primary gauged reach currently in a fishable river shape?                                                                                         | Internal 0–100 score; public label and qualitative meter, or Unavailable            | Condition refresh |
| Fish In River      | What historical seasonal-presence level is reasonable for this date on this river/run/species?                                                           | Internal 0–100 score limited by a river-specific ceiling; public label and meter    | Daily             |

River Run must not produce:

- An overall River Run score
- Catch probability
- Fish counts
- Travel confidence
- A safety rating
- Exact spot or pool recommendations
- Forecast-scored primitives
- A claim that modeled weather is directly observed weather
- A claim that favorable conditions prove fish moved

### 1.1 Primitive Display Contract

Every primitive returns score/label and copy as one versioned decision:

```ts
type PrimitiveDisplay = {
  score?: number | null;
  label: string;
  headline: string;
  detail: string;
  tip: string;
  reasonCodes: string[];
};
```

Rules:

- Run Stage and Conditions Suggest do not require a numeric score.
- Push and Fishability return `score: null` when required current evidence is
  unavailable.
- Fish In River returns an internal integer from `0` through `100`. Its public
  meter and label hide the number, while the configured 1–10 historical-presence
  maximum is converted to a river-specific ceiling in ten-point increments.
- All numeric primitive scores remain internal because they rank deterministic
  states rather than expressing calibrated probabilities or measurements.
- Headline, detail, tip, label, score, and reason codes must describe the same
  determination.
- A scoring-rule change is incomplete until its copy and copy tests change in
  the same version.
- Unavailable or insufficient states must still return useful deterministic copy
  explaining what is missing.

### 1.2 Evidence Language

The product distinguishes:

- **Observed:** an official gauge measurement or other verified sensor value.
- **Modeled:** a weather-model estimate for a past or current time.
- **Historical configuration:** researched run dates, presence cap, and curve.
- **Inference:** a deterministic conclusion from the inputs above.

Copy must use the correct evidence language. It must not silently promote
modeled, proxy, configured, or inferred information into an observation.

---

## 2. Launch Scope And Locked Decisions

The first production-audited combination is:

```txt
State: Michigan
River: Pere Marquette River
Run/species: Fall Chinook
Primary gauge: USGS 04122500 — Pere Marquette River at Scottville, MI
Run Stage dates: researched and configured by the product owner
Historical-presence maximum: 10
Temperature source: measured water when audited and available;
                    no air-temperature fallback
```

Locked product decisions:

1. The user-facing name remains **Run Stage**.
2. The former Schedule primitive is named **Conditions Suggest**.
3. Conditions Suggest must compare against river/run-specific historical
   conditions; universal thresholds alone cannot support Ahead or Delayed.
4. Push must account for interactions. More rain, more rise, or more cooling is
   not automatically better.
5. Fishability cannot equate a historical percentile with Ideal or Blown Out
   unless that relationship is independently audited for the river/reach.
6. Fish In River uses a configured maximum from 1–10 for each river/run/species
   combination and projects it onto the public 0–100 scale. Pere Marquette Fall
   Chinook may reach 100; a maximum-6 run may reach only 60.
7. A river may use one or more gauges. One gauge is fully supported and remains
   the default.
8. Raw readings from different gauges must never be averaged together.
9. Forecast values may be displayed as secondary information but never change a
   V1.1 primitive.

Only configured combinations that pass evidence, configuration, replay, copy,
and runtime acceptance gates may be shown publicly.

---

## 3. Shared Input Truth Layer

All five primitives depend on normalized, provenance-aware inputs. Provider
payloads must never be read directly by scoring functions.

```txt
provider payload
  -> validation and provenance
  -> canonical timestamp and units
  -> normalized observation/model
  -> river/run-specific signal
  -> primitive determination
  -> matching copy
```

### 3.1 Hydraulic Source Configuration

A river config contains one or more role-based official hydraulic sources:

```ts
type HydraulicSourceConfig = {
  sourceId: string;
  provider: "USGS";
  siteId: string;
  name: string;
  role:
    | "primary"
    | "upstream_context"
    | "tributary_context"
    | "secondary_context";
  primaryMetric: "flow_cfs" | "gage_height_ft";
  availableMetrics: Array<"flow_cfs" | "gage_height_ft">;
  historyYearsAvailable: number;
  maxAgeHours: number;
  reachQuality: "good" | "acceptable" | "limited";
  reachNotes: string;
};
```

Rules:

- Exactly one gauge is `primary`.
- A single primary gauge is sufficient.
- Fishability uses the primary gauge because it describes the configured primary
  reach.
- Additional gauges are optional context for Push and Conditions Suggest.
- Each gauge is normalized against its own metric, datum, history, and seasonal
  distribution.
- CFS values from different drainage areas and gage-height values from different
  datums must never be averaged.
- If multiple gauges are used in a combined signal, combine only normalized
  dimensionless signals with audited weights.
- Missing optional gauges reduce evidence quality but do not make the primary
  gauge unavailable.
- Copy must identify the primary gauge and state that conditions can vary by
  reach.

Provider validation must:

- Reject provider missing-value sentinels and non-finite values.
- Preserve provisional/approved and other provider qualifiers.
- Reject observations flagged invalid for the scored metric.
- Verify the returned site and parameter match configuration.
- Store observation timestamps in UTC.
- Use a modern supported provider API. Legacy provider endpoints with announced
  retirement dates cannot be the only production path.

Gauge freshness:

```txt
fresh: current age <= configured maxAgeHours (default 6h)
stale: current age > maxAgeHours and <= 24h
unavailable: missing, invalid, future-dated, or older than 24h
```

The 24-hour comparison observation must fall within an audited tolerance around
the target time. A much older value cannot be silently treated as “24 hours
ago.” If no value meets tolerance, the trend is unknown.

### 3.2 Gauge Historical Baselines

Historical baselines are specific to:

```txt
gauge + metric + local day-of-year window + baseline version
```

Requirements:

- Minimum five distinct usable years for a public historical comparison.
- Ten or more years are preferred when the gauge record supports it.
- Use a ±14 local-day window by default.
- Store sample count, distinct years, provider, metric, method, and version.
- Separate historical level distributions from historical change distributions.
- Historical change baselines store both absolute 24-hour change and relative
  24-hour percent change.
- A relative percent change alone cannot define a major event because a small
  absolute rise from a very low base can produce a misleading percentage.
- Baseline regeneration requires a new version and replay acceptance.

Historical level percentiles describe how unusual the current river level is.
They do not automatically mean Ideal, Fishable, Unsafe, or Blown Out.

### 3.3 Weather

Weather is contextual evidence, not direct evidence of fish movement.

Required normalized fields:

- Past/current precipitation totals for 24h, 48h, and 72h
- Provider/model name
- Grid point or station location
- Value-valid time
- Payload fetch time
- Evidence type: observed, modeled, or proxy

Rules:

- Score only values whose valid time is at or before the refresh time.
- Forecast arrays must remain structurally separate from scored past/current
  arrays.
- Local provider timestamps must be converted with the returned timezone or UTC
  offset. A local timestamp must never be parsed as UTC without conversion.
- A successful fetch does not make every returned value “observed.”
- Missing precipitation is unknown, not dry.
- Weather freshness uses the valid time of the scored data, not merely the HTTP
  fetch time.
- A single configured weather point is supported.
- Multiple watershed weather points are optional. If used, precipitation may be
  combined only with documented basin weights; otherwise each point remains
  context.

Rain is a precursor. Once the primary gauge shows the river response to the same
event, Push must not award the full rain and gauge effects twice.

### 3.4 Temperature

Temperature source priority:

1. Same-gauge measured water temperature
2. Audited nearby water-temperature gauge
3. Audited adjusted reference gauge
4. Unavailable

Rules:

- Every supported river/run must configure at least one audited measured-water
  source. A river with no viable measured-water source is not supported.
- Measured water temperature may use both absolute biological suitability and
  trend.
- An adjusted reference source applies its configured adjustment before trend
  and suitability rules.
- If temperature evidence is unavailable, copy must not describe the water as
  warming, cooling, hot, cold, or stable.
- If all configured sources are stale or temporarily unavailable, every
  temperature-dependent determination fails closed as Unavailable.
- Temperature logic is species-, season-, and run-profile-specific.
- Cooling is not monotonically beneficial. Push value depends on cooling toward
  an appropriate range, not simply becoming colder.

### 3.5 Missing And Stale Evidence

Missing evidence must not receive a positive score by default.

- Missing primary gauge: Push and Fishability are Unavailable.
- Stale primary gauge: scores use conservative caps and explicit stale copy.
- Missing rain: no rain benefit and a missing-evidence reason code.
- Missing current measured-water temperature: Push is Unavailable.
- Proxy or partial evidence lowers data quality and may restrict strong claims.
- Conditions Suggest returns Insufficient evidence when its historical or
  completed-day requirements are not met.

---

## 4. Configuration Contract

### 4.1 River Profile

```ts
type RiverProfile = {
  riverId: string;
  displayName: string;
  state: "MI" | "WI" | "IL" | "IN" | "OH" | "PA" | "NY";
  timezone: string;
  mouthLat: number;
  mouthLon: number;

  hydraulicSources: HydraulicSourceConfig[]; // one or more; exactly one primary

  waterTemperatureSources: Array<{
    sourceId: string;
    provider: "USGS" | "MONITOR_MY_WATERSHED";
    siteId: string;
    seriesId?: string;
    name: string;
    role: "primary" | "fallback" | "validation";
    priority: number;
    sourceType: "same_gauge" | "nearby_gauge" | "adjusted_reference_gauge";
    maxAgeHours: number;
    smoothingWindowHours: number;
    minValidF: number;
    maxValidF: number;
    maxRateChangeFPerHour: number;
    maxPeerDifferenceF: number;
    adjustmentF?: number;
    reachNotes: string;
    attribution: string;
  }>;

  weatherPoints: Array<{
    weatherPointId: string;
    lat: number;
    lon: number;
    role: "primary" | "basin_context";
    basinWeight?: number;
  }>;

  supportStatus: "beta" | "verified";
  gaugeLimitationCopy: string;
};
```

### 4.2 River/Run/Species Profile

```ts
type RiverRunProfile = {
  runId: string;
  riverId: string;
  displayName: string;
  species:
    | "chinook_salmon"
    | "coho_salmon"
    | "steelhead"
    | "skamania"
    | "lake_run_brown_trout"
    | "atlantic_salmon";
  season: "spring" | "summer" | "fall" | "winter";
  runType:
    | "fall_spawn"
    | "fall_entry"
    | "winter_run"
    | "spring_spawn"
    | "summer_run"
    | "holding";
  movementEngineId:
    | "fall_cooling"
    | "spring_warming"
    | "winter_thaw"
    | "summer_cooling"
    | "stable_cool_holding";

  runWindow: {
    preRunStart: string; // MM-DD; start of useful pre-run watch
    stagingStart: string; // MM-DD; nearby-water advisory only
    start: string; // MM-DD
    beginningEnd: string; // MM-DD
    buildingEstablishedStart: string; // MM-DD; copy substate only
    peakStart: string; // MM-DD
    peak: string; // MM-DD
    peakEnd: string; // MM-DD
    taperingEnd: string; // MM-DD
    end: string; // MM-DD
    lateEnd: string; // MM-DD; historical-presence tail
    postRunLateCopyEnd: string; // MM-DD; final late post-run copy day
  };

  historicalPresence: {
    maximum: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    curveVersion: string;
    evidenceNotes: string;
    sourceNotes: string;
    anchors?: Array<{
      dayOffsetFromStart: number;
      fractionOfMaximum: number; // 0 through 1
    }>;
  };

  push: {
    version: string;
    hydraulic: {
      metric: "flow_cfs" | "gage_height_ft";
      sourceLabel: string;
      lowValue: number;
      highValue: number;
      severeHighValue: number;
      rising24h: { absolute: number; percent: number };
      meaningfulRise24h: { absolute: number; percent: number };
      sharpRise24h: { absolute: number; percent: number };
    };
    rain: {
      meaningful48hIn: number;
      strong48hIn: number;
      heavy48hIn: number;
    };
    temperature: {
      suitabilityLabel: string;
      supportiveMinF: number;
      supportiveMaxF: number;
      tooWarmF: number;
      migrationBarrierF: number;
    };
    caps: {
      staleGauge: number;
      unknownTrend: number;
      noGaugeResponse: number;
      tooWarm: number;
      migrationBarrier: number;
      severeHighFlow: number;
      outsideExtendedWindow: number;
    };
    evidenceNotes: string;
    sourceNotes: string;
  };

  fishabilityBands: {
    version: string;
    metric: "flow_cfs" | "gage_height_ft";
    sourceLabel: string;
    tooLow: { max: number };
    lowFishable: { min: number; max: number };
    ideal: { min: number; max: number };
    highFishable: { min: number; max: number };
    blownOut: { min: number };
    caps: {
      staleGauge: number;
      unknownTrend: number;
      veryLow: number;
      blownOut: number;
      sharpRiseHigh: number;
    };
    evidenceNotes: string;
    sourceNotes: string;
  };

  waterTemperature: {
    sourcePriority: string[]; // references river waterTemperatureSources
    upstreamFallbackPositiveSignalCap: 0 | 1 | 2;
    notes: string;
  };

  conditionsSuggest: {
    baselineVersion: string;
    temperatureSourceId: string;
    finalCheckpointDaysAfterPeak: number;
    minimumUsableYears: number; // public minimum 5
    minimumCoveragePercent: number; // default 0.80 per checkpoint
    aheadPercentile: number; // default 75
    delayedPercentile: number; // default 25
    coolEnoughPercentileCap: number; // default 75
  };

  researchNotes: string;
  sourceNotes: string;
};
```

### 4.3 Movement Engines And Configuration Revisions

Movement engines are versioned code modules. River/run configuration selects an
engine and supplies researched dates, sources, thresholds, presence curves, and
copy inputs. River profiles do not fork biological algorithms.

Only `fall_cooling` is implemented in V1.1. The other identifiers are reserved
for schema stability, and validation rejects them until their algorithms and
acceptance tests ship. Relabeling a configuration can never cause fall logic to
run for a spring or winter combination.

The movement engine does not own every fact:

| Primitive          | Stable owner                                                 |
| ------------------ | ------------------------------------------------------------ |
| Run Stage          | Shared calendar algorithm + configured dates                 |
| Conditions Suggest | Movement-engine historical comparison + river/run baselines  |
| Push               | Movement-engine current-trigger rules + river/run thresholds |
| Fishability        | Shared primary-reach algorithm + river thresholds            |
| Fish In River      | Shared curve algorithm + run-specific maximum/anchors        |

This is how a new river remains mostly configuration without letting one engine
silently reinterpret calendar timing, river shape, or historical presence.

Every editable river configuration is an immutable numbered revision with
`draft`, `published`, or `archived` status. A revision records its schema,
configuration, movement-engine version, complete river/run document, evidence
notes, and publication time. Publishing a validated draft atomically archives
the prior published revision. Live dates, sources, caps, thresholds, notes, or
copy inputs are never edited in place.

### 4.4 Configuration Validation

A public combination must fail closed when:

- It does not have exactly one primary gauge.
- Its primary metric or required provider series is unavailable.
- Its run dates are invalid or undocumented.
- Its historical-presence maximum or curve lacks evidence notes.
- Its Fishability thresholds are incomplete or unaudited.
- Conditions Suggest lacks five usable historical years.
- Gauge or temperature source configuration is inconsistent.
- A multi-gauge weight references a gauge without its own valid baseline.
- Required reason-code and copy mappings are missing.
- Replay and boundary tests have not passed for the config version.
- The movement engine is unimplemented or incompatible with season/run type.
- Temperature priority references a source absent from the river profile.
- `stagingStart`, `start`, `peak`, `end`, and `lateEnd` are not ordered.

The launch runtime release gate remains separate from config validity.

---

## 5. Canonical Signals

Signals describe evidence. They are not user-facing primitive conclusions.

### 5.1 Primary Gauge State

The primary gauge produces:

- Current canonical value
- Relative historical level percentile
- Audited Fishability band, when configured
- 24-hour absolute change
- 24-hour relative percent change
- Historical percentile of each change measure
- Direction: falling, stable, or rising
- Event strength: none, rising, meaningful, or sharp
- Freshness and provider qualifiers

A rising event becomes stronger only when both its relative and absolute changes
are credible for that gauge. Configured measurement floors and historical change
distributions prevent small-base percentage spikes from being overstated.

### 5.2 Rain Context

Rain uses river/run-specific thresholds. Defaults may seed research but cannot
become public calibration without review.

```txt
missing
dry
light
meaningful
strong
heavy
```

Heavy rain is not automatically strongly favorable. Its effect depends on:

- Current primary-gauge band
- Whether the gauge is already responding
- Whether the response remains in a fishable range
- Run profile and season

### 5.3 Temperature Context

Temperature produces:

- Evidence source and quality
- Absolute suitability when measured water is available
- 24/72-hour trend
- Cooling, neutral, or warming category
- Too-cold or too-warm constraint when measured and configured

Trend and absolute suitability must be evaluated together. Cooling toward a
fall-run range can help; continued cooling below a configured suitable range
must not keep adding benefit.

### 5.4 Interaction Rules

The engine must use an interaction decision table rather than blindly summing
three independent maximum-strength signals.

Required invariants:

- Rain and gauge response from the same event cannot both receive full
  independent credit.
- A sharp rise into Too High or Blown Out cannot produce an uncapped Strong
  Push.
- Heavy rain into an already-high river cannot be described simply as better.
- Adjusted-reference water temperature cannot receive the strongest positive
  contribution unless its configured reach relationship has been validated.
- Missing inputs cannot improve a score.
- Optional secondary gauges cannot override an unavailable primary gauge.
- Favorable Push and poor Fishability may coexist, but the response must explain
  why.
- Push must not score or report movement-trigger conditions before the
  configured river-run `start` or after its configured `end`.

Exact PM thresholds and interaction-table values are audited implementation
artifacts. They must be recorded with a config version, replayed historically,
and accepted before the runtime public gate is enabled.

---

## 6. Primitive Specifications

### 6.1 Run Stage

Run Stage uses only the researched and configured local-calendar window.
Weather, gauges, Push, Fishability, and Conditions Suggest never change it.

Stages:

```txt
Pre-run
Beginning
Building
Peak
Tapering
Ending
Post-run
```

Date segmentation is explicit river/run configuration:

```txt
Post-run: before preRunStart
Pre-run: preRunStart through the day before start
Beginning: start through beginningEnd
Building: after beginningEnd through the day before peakStart
  Early Building copy: before buildingEstablishedStart
  Established Building copy: buildingEstablishedStart through the day before peakStart
Peak: peakStart through peakEnd
Tapering: after peakEnd through taperingEnd
Ending: after taperingEnd through end
Post-run: after end
  Late-run copy: after end through postRunLateCopyEnd
  Offseason copy: after postRunLateCopyEnd through the day before the next preRunStart
```

`lateEnd` controls the historical Fish In River tail. `postRunLateCopyEnd`
controls Run Stage copy only. Keeping them separate prevents one primitive's
seasonal estimate from silently changing another primitive's angler guidance.

`stagingStart` is separate from river presence. Between `stagingStart` and
`start`, Run Stage may explain that mature fish can stage in nearby lake,
harbor, or river-mouth water and, where supported, that rare early fish are
possible in the river. Fish In River remains `0` until the configured river
start because this context does not establish dependable seasonal presence.
Staging copy is seasonal context, not an observation.

Cross-year runs are supported. Copy must call Run Stage a calendar read and must
not claim that fish were observed.

### 6.2 Conditions Suggest

User-facing title: **Conditions Suggest**

Question:

> At the current early-season checkpoint, do cumulative completed conditions
> suggest earlier, typical, or delayed timing compared with this same
> river/run's historical checkpoint pattern?

Labels:

```txt
Evaluating
Ahead
Typical
Delayed
Insufficient evidence
Timing complete
```

Conditions Suggest does not prove the biological run is ahead or delayed. Every
headline must begin with or naturally include “Conditions suggest.”

#### Checkpoints and update behavior

Raw observations continue to refresh and store every scheduled day. The
user-facing timing determination changes only at these five run-calendar
checkpoints:

| Checkpoint             | Becomes active                     | Completed evidence cutoff       |
| ---------------------- | ---------------------------------- | ------------------------------- |
| `river_start`          | First river-start day              | Day before river start          |
| `building_start`       | First building day                 | Last beginning day              |
| `building_established` | Later-building guidance boundary   | Day before that boundary        |
| `peak_start`           | First peak day                     | Day before peak start           |
| `peak_complete`        | Final configured timing checkpoint | Day before the final checkpoint |

Every checkpoint starts its evidence window at `stagingStart`. Later checkpoints
therefore retain all earlier evidence instead of replacing it with a short
rolling window. Between checkpoints, the result is locked and a deterministic
recomputation must return the same result.

Beginning with the second checkpoint, the result also carries the immediately
previous checkpoint's public timing label and date. The app displays that past
read as context; it does not expose the next configured checkpoint date.

Before the river-start checkpoint the label is `Evaluating`; no early timing
claim is made. At `peak_complete`, Conditions Suggest stops classifying timing
and displays `Timing complete`. Through the configured main run end it explains
that the run is well underway by calendar timing. After the main run end it says
the run window has passed and that Conditions Suggest and Push are complete. The
last checkpoint's result remains available separately as `timingLabel` for audit
and interpretation. Conditions Suggest does not restart or drift during
tapering, ending, or post-run.

#### Evidence

Each cumulative checkpoint uses only:

1. Primary-gauge response, normalized against same-date historical change.
2. Required measured water-temperature state/trend from one selected audited
   source.

Rain does not independently score Conditions Suggest. The primary gauge is the
evidence that watershed precipitation produced a meaningful river response. Rain
remains available to Push as precursor context.

For each completed date from staging start through the checkpoint cutoff, first
form one daily representative from every usable stored refresh on that date:

- Arithmetic mean of the primary-gauge values.
- Median of measured water-temperature values.

A single usable refresh can represent a date, but all available matching
refreshes must participate. Current and historical daily evidence must use the
same source IDs and units. Historical Scottville discharge uses the provider's
daily mean; historical M-37 temperature uses the daily median.

Secondary gauges may participate only when:

- Their hydrologic role is documented.
- They have their own historical baselines.
- Their normalized weights are configured and sum correctly.
- Replay proves they improve the determination.

Raw readings from separate stations are never averaged. Multiple reads from the
same configured source may be combined into that source's daily representative
as described above.

#### Historical comparison

For each historical year, compute the same cumulative evidence index from
staging start through the equivalent checkpoint cutoff. Compare the current
checkpoint index with the matching checkpoint distribution:

```txt
>= configured ahead percentile (default p75): Ahead
<= configured delayed percentile (default p25): Delayed
between those thresholds: Typical
```

The current and historical indices must use the same algorithm, data source
class, units, and baseline version.

The fall-cooling V1.1 calculation has two component signals:

```txt
Gauge response =
  conservative lower percentile of
  (sum of positive absolute daily rises,
   sum of positive relative daily rises)

Water pattern =
  average of
  (cooler cumulative mean percentile,
   cumulative start-to-cutoff cooling percentile)

Evidence index = 60% gauge response + 40% water pattern
```

The configured too-warm threshold caps the water component below the supportive
side. Once water is cool enough relative to history, the configured cool-enough
percentile cap prevents progressively colder water from creating unlimited
additional support. This is a conservative relative-data plateau, not a claim
that one universal temperature is biologically ideal.

Ahead requires both component signals to be at or above their historical
midpoint; Delayed requires both to be at or below it. Strongly opposed
components return Typical. This agreement rule is intentionally conservative:
one favorable signal cannot overpower one unfavorable signal. Gauge height, rain
totals, air temperature, forecasts, Push, Fishability, and Fish In River are not
inputs.

#### Evidence gates

Return `Insufficient evidence` when:

- Fewer than the configured percentage of cumulative dates are usable (default
  80%).
- The checkpoint cutoff date lacks a usable primary-gauge read.
- The checkpoint cutoff date lacks usable measured water temperature.
- Historical baseline has fewer than five usable years.
- Baseline/config versions do not match.
- Baseline checkpoint, observation start, cutoff, or expected-day definition
  does not match the current checkpoint.
- Required source provenance is unknown.

Measured water temperature is required. Missing measured temperature cannot
produce Ahead, Typical, or Delayed; the determination returns
`Insufficient evidence`.

#### Transition discipline

Checkpoint labels are evaluated in order. A direct reversal from Ahead to
Delayed, or Delayed to Ahead, is tempered to Typical at that checkpoint. A later
checkpoint may move from Typical to either direction if its cumulative evidence
and component-agreement gates support that result. `Insufficient
evidence` is
immediate and can never be carried forward as a confident claim.

### 6.3 Push

Push estimates current movement-trigger conditions for the configured
river/run/species. It is an inference, not proof that fish moved.

Inputs:

- Primary-gauge value and 24-hour response
- Rain precursor context
- Temperature suitability and trend
- Extended run-window applicability
- Freshness and completeness

Required evaluation order:

1. Validate primary gauge and freshness.
2. Resolve current hydraulic state and 24-hour gauge-response strength.
3. Resolve temperature source, absolute suitability, and trend.
4. Resolve rain precursor.
5. Apply interaction rules so rain and gauge response are not double-counted.
6. Apply high/low river, temperature, stale, unknown-trend, and out-of-window
   caps.
7. Map the final 0–100 score to copy.

Labels:

|  Score | Label         |
| -----: | ------------- |
|   0–24 | Weak          |
|  25–49 | No clear push |
|  50–69 | Possible      |
|  70–84 | Strong        |
| 85–100 | Very strong   |

Required conservative behavior:

- Missing/older-than-24h primary gauge: Unavailable.
- Missing current measured water temperature: Unavailable.
- Stale primary gauge: maximum 55.
- Unknown 24-hour gauge trend: maximum 49.
- No rising gauge response: maximum 69.
- Too-warm measured water: run-specific cap; a migration-barrier state is capped
  at 49.
- Cooling below the configured supportive range receives no extra credit.
- Severe-high primary hydraulics: maximum 49 unless an audited run-specific
  exception explicitly proves otherwise.
- Before the configured river-run `start`: no score; say the river run has not
  started, leave lake/harbor/river-mouth staging to Run Stage, and do not expose
  the configured date.
- After the configured river-run `end`: no new score or history entry; say the
  season's fresh-movement read is complete while the final seven completed
  in-run dates remain available as past context.
- Every active-window Push result remains probabilistic. Its headline, detail,
  and guide guidance describe how strongly the measured water supports movement
  without claiming that fish entered or ruling out unprompted movement.

Push exposes a compact history dropdown for the specific river/run season. It
shows up to seven completed prior local dates, newest first. Each row uses the
strongest stored `Possible`-or-greater window for that date and displays its
public Push category and peak local time. A completed date with valid reads but
no supportive window says `No supportive window`; a date without usable stored
evidence says `No recorded read`. It never shows the still-changing current
date, reconstructs a missing read, or exposes a numeric score. The lookup:

- starts at that season's configured river-run `startDate`, never at the earlier
  staging advisory;
- records through the configured `endDate`, inclusive, and freezes to the final
  seven in-run dates afterward;
- matches the exact river, run, engine version, and configuration version;
- returns the strongest stored supportive window for each completed local date;
- breaks equal-score ties with the later stored refresh;
- distinguishes a valid day without a supportive window from a missing day;
- keeps absent dates visible as `No recorded read`;
- caps the list at seven dates; and
- reports a temporarily unavailable history honestly if the lookup fails.

Push also retains the most recent recorded supportive-condition context below
the daily history. “Supportive” means a stored Push score of at least `50`
(`Possible` or stronger); it does not mean that fish movement was observed. The
supportive-context lookup:

- returns the most recent stored condition refresh, not a reconstructed or
  guessed date;
- reports `not_started`, `active_now`, `previously_recorded`, `none_recorded`,
  `unavailable`, or `complete`; and
- does not change today's Push score.

User copy must say “supportive Push signal,” never claim that a push occurred.
When today is `Possible` or stronger it shows the current category and date.
When today is lower, it shows the latest recorded `Possible`-or-stronger
category and date. When no matching row exists it says that no supportive Push
signal has been recorded yet this run; it does not claim that no entry occurred.

#### 6.3.1 PM Fall Chinook Push V5

The PM implementation is `pm-fall-chinook-push-v5`. Scottville discharge is the
hydraulic lead. A positive response tier requires both its absolute and relative
24-hour threshold:

| Scottville response |                   Required change | Hydraulic base |
| ------------------- | --------------------------------: | -------------: |
| Falling             |               10% or more decline |             20 |
| Stable              |                      Below Rising |             35 |
| Rising              |            at least 15 cfs and 2% |             52 |
| Meaningful rise     |            at least 45 cfs and 7% |             70 |
| Sharp rise          |           at least 85 cfs and 13% |             80 |
| Unknown comparison  | no trustworthy matched comparison |     30, cap 49 |

Current discharge is Low at or below 425 cfs, High at or above 825 cfs, and
Severe High at or above 1,100 cfs. Low with no positive response subtracts 5.
High and Severe High subtract 5; Severe High also caps the result at 49.

Measured-water states:

| Water state       |                   Range | Trend treatment                                                          |
| ----------------- | ----------------------: | ------------------------------------------------------------------------ |
| Supportive        |                 51–63°F | strong cooling +10; cooling +6; steady 0; warming -5; strong warming -10 |
| Transitional warm |   above 63 through 68°F | +8; +5; -3; -8; -12                                                      |
| Too warm          | above 68 and below 70°F | -5; -8; -12; -15; -18, cap 69                                            |
| Migration barrier |          70°F or warmer | -20, cap 49                                                              |
| Cool plateau      |              below 51°F | 0; further cooling earns no credit                                       |

The trend columns are ordered strong cooling, cooling, steady, warming, and
strong warming. Strong/cooling thresholds are a 72-hour decline of at least
5°F/2°F, with 24-hour declines of at least 3°F/1.5°F also qualifying. Warming
uses the corresponding positive thresholds.

The Baldwin-point Open-Meteo rainfall input is modeled gridded context, not a
rain-gauge observation. Its 48-hour thresholds are 0.35, 0.75, and 1.50 inches.
It is precursor only: meaningful/strong/heavy estimates add 5/8/10 before a
measured river response, no more than 3 once Scottville is merely Rising, and
zero once Scottville is Meaningfully or Sharply Rising. Rain adds zero when
discharge is already High or Severe High. An effectively dry estimate subtracts
5 only before a measured Meaningful or Sharp rise; once that rise exists, the
measured response supersedes the dry estimate and rain contributes zero.

The final score is the hydraulic base plus small state, temperature, and rain
modifiers, followed by caps. It is not a probability. The five score labels use
the table above. The 2021–2025 daily historical replay must remain a release
gate because it verifies interactions but cannot validate actual fish entry. For
PM, an upstream temperature fallback still applies absolute warm-water
constraints but receives zero positive cooling credit; Maple remains the
first-priority measured-water source.

### 6.4 Fishability

Fishability describes the current shape of the configured primary gauged reach.
It does not describe fish presence, movement, catch probability, wading safety,
or boating safety.

Inputs:

- Current value from the configured primary hydraulic source
- Audited absolute Fishability band for that source and metric
- Matched 24-hour absolute and relative change, classified with the run's paired
  hydraulic-change thresholds
- Primary-gauge freshness

Rain is not a stain/clarity score. Rain may be shown as context, but it cannot
directly claim turbidity or water clarity without a validated turbidity source
or audited local relationship.

Historical percentiles may be shown as relative river context:

```txt
Unusually low
Below typical
Typical
Above typical
Unusually high
```

They cannot independently assign Ideal or Blown Out.

V1.1 uses a small rule table rather than a weighted multi-variable formula.
Start with the configured band base, add the current trend modifier, then apply
all conservative caps:

| Audited band    | Base |
| --------------- | ---: |
| Very Low        |   35 |
| Low             |   55 |
| Normal Fishable |   70 |
| Ideal           |   88 |
| High Fishable   |   68 |
| Very High       |   40 |
| Blown Out       |   15 |

| Matched 24-hour trend | Modifier |
| --------------------- | -------: |
| Stable                |       +5 |
| Falling               |       +2 |
| Rising                |        0 |
| Meaningful rise       |       -8 |
| Sharp rise            |      -20 |
| Unknown               |      -10 |

This scoring intentionally permits Strong Push and Tough Fishability at the same
time: a hydraulic event may support entry while a fast-changing or high-water
reach becomes harder to fish.

Labels:

|  Score | Label     |
| -----: | --------- |
|   0–24 | Poor      |
|  25–49 | Tough     |
|  50–69 | Fishable  |
|  70–84 | Good      |
| 85–100 | Excellent |

Required caps:

- Missing/older-than-24h primary gauge: Unavailable.
- Stale primary gauge: maximum 55.
- Unknown 24-hour trend: maximum 69.
- Blown Out audited band: maximum 24.
- Sharp rise into High Fishable, Very High, or Blown Out: maximum 40.
- Very Low audited band: maximum 45.

Only the primary gauge determines Fishability. Optional upstream or tributary
gauges may appear in context copy but cannot be averaged into the reach score.

For PM Fall Chinook V1, Scottville discharge uses:

| Band            | Scottville discharge |
| --------------- | -------------------: |
| Very Low        |           `<400 cfs` |
| Low             |     `>=400 and <500` |
| Normal Fishable |     `>=500 and <525` |
| Ideal           |    `>=525 and <=750` |
| High Fishable   |   `>750 and <=1,000` |
| Very High       |  `>1,000 and <1,600` |
| Blown Out       |        `>=1,600 cfs` |

These bands describe the lower-mainstem shape represented by Scottville during
this configured run. They are not universal PM thresholds and are never safety
thresholds.

### 6.5 Fish In River

Fish In River is a historical seasonal-presence level. It is not a fish count
and does not use live gauge, weather, Push, Fishability, or Conditions Suggest.

Each river/run/species config owns:

- Researched start, peak, and end dates
- A documented historical presence curve
- A historical-presence maximum from 1 through 10
- Evidence and source notes

Examples:

```txt
Pere Marquette Fall Chinook internal maximum: 10 → public ceiling: 100
White River Fall Chinook possible internal maximum: 6 or 7 → ceiling: 60 or 70
```

The actual White River value is not accepted until its own research and audit
are complete.

Calculation:

```txt
curveFraction = historical curve value for local date, from 0 through 1
riverCeiling = historicalPresence.maximum * 10
fishInRiverScore = round(curveFraction * riverCeiling)
fishInRiverScore = clamp(fishInRiverScore, 0, riverCeiling)
```

Default curve shape may be generated from Run Stage dates, but its anchors must
be stored/versioned and accepted:

| Calendar position   | Default fraction of configured maximum |
| ------------------- | -------------------------------------: |
| Before early window |                                   0.00 |
| Early window        |                            0.10 → 0.30 |
| Start / Beginning   |                            0.35 → 0.50 |
| Building            |                            0.50 → 0.75 |
| Peak window         |                     0.80 → 1.00 → 0.80 |
| Tapering            |                            0.80 → 0.60 |
| Ending              |                            0.60 → 0.30 |
| Late window         |                            0.25 → 0.10 |
| After late window   |                                   0.00 |

Copy must say “historical seasonal presence” or equivalent. It must not say that
a specific number of fish are currently present.

Suggested level labels are based on the score's share of that run's
river-specific ceiling:

| Share of ceiling | Label             |
| ---------------: | ----------------- |
|               0% | Outside run       |
|            1–20% | Low presence      |
|           21–40% | Limited presence  |
|           41–60% | Moderate presence |
|          61–<90% | High presence     |
|          90–100% | Peak presence     |

The public UI displays a qualitative meter and label without a numeric score.
The independently audited river ceiling still prevents a lower-strength
river/run from reaching an overstated meter position.

---

## 7. Copy And Cross-Primitive Consistency

Copy is deterministic and versioned. No runtime LLM writes primitive copy.

### 7.1 Copy Responsibilities

For every reachable state:

- **Headline:** directly answers only that primitive's question.
- **Detail:** names the evidence and relevant time window.
- **Tip:** leads with a concrete first action and, when supported, identifies
  the river section, water type, and order of approach without promising fish or
  safety.
- **Reason codes:** identify the exact branch and limitations.

Copy must:

- Distinguish observed, modeled, adjusted-reference, historical, and inferred
  evidence.
- Mention stale, missing, partial, or adjusted-reference evidence when it
  affects the result.
- Use “Conditions suggest…” for all Conditions Suggest conclusions.
- Describe Run Stage as calendar timing.
- Describe Fish In River as historical seasonal presence.
- Describe Push as movement-trigger conditions, not observed movement.
- Describe Fishability as the primary gauged reach, not the entire river.
- Make every available Fishability detail state that it describes how the flow
  should fish if migratory fish are present, not how many fish are present.
- Give Guide's Read a clear priority. Do not hand the decision back to the user
  with an unranked list of plausible water types.

Copy must not use unsupported claims such as:

```txt
fish are here
the river is loaded
fish definitely moved
safe to wade
safe to boat
guaranteed
best day
```

### 7.2 Interpretation Notes

Independent primitives can legitimately point in different directions. That is
not a contradiction when the response explains the dimensions.

Required interpretation cases:

| Combination                                | Required explanation                                                                                              |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Strong Push + Poor/Tough Fishability       | Movement-trigger conditions may be favorable while the river is difficult to fish.                                |
| Peak Run Stage + Weak Push                 | Historical calendar timing may be near peak while fresh trigger conditions are weak.                              |
| Good Fishability + low Fish In River       | River shape can be good outside the stronger historical-presence window.                                          |
| Delayed Conditions Suggest + Strong Push   | Today improved while the locked cumulative checkpoint still suggests delay.                                       |
| Ahead Conditions Suggest + Beginning Stage | The first cumulative checkpoint is early relative to history while the configured calendar has entered Beginning. |
| Post-run Stage + residual Fish In River    | The main run window is complete while a separately configured historical-presence tail remains.                   |
| Optional gauges disagree                   | The primary gauge controls the main determination; secondary context is mixed.                                    |

The API returns at most one `interpretationNote` object. That object must
collect every applicable disagreement explanation and reason code; it must not
stop after the first match. Tests must also prove an active Push cannot coexist
with Pre-run or Post-run Stage in a scored snapshot.

### 7.3 Data Quality

Data quality is not travel confidence.

```ts
type DataQuality = {
  label: "Fresh" | "Partial" | "Stale" | "Limited";
  reasonCodes: string[];
};
```

- **Fresh:** required primary evidence is current, direct where required, and
  historical coverage passes.
- **Partial:** result is usable with one disclosed limitation, such as a
  validated adjusted-reference source or missing optional gauge.
- **Stale:** a stale permitted input changed a cap or copy.
- **Limited:** a primitive is unavailable/insufficient or multiple important
  limitations apply.

### 7.4 Score/Copy Atomicity

Every scoring branch must have:

- Boundary tests immediately below, at, and above its threshold
- Expected label
- Expected reason codes
- Expected copy template ID
- Prohibited-claim assertions

A pull request must not change a score boundary without updating the
corresponding copy expectations and replay fixtures.

---

## 8. Snapshot, API, And Storage Contract

### 8.1 Refresh Ownership

Daily progression snapshot:

```txt
riverId + runId + localDate + engineVersion + configVersion
```

Owns:

- Run Stage
- Conditions Suggest
- Fish In River
- Historical source/baseline versions
- Copy template versions

Condition refreshes use a required, source-audited schedule on each river
profile. The schedule has separate active-season and inactive-season local
slots. Active season begins at that run's configured staging start and ends with
its historical-presence tail. This keeps Fishability current anywhere the
product can still show seasonal fish presence without extending Push beyond its
separate main-run window. The boundaries come from each run configuration, so
the refresh engine does not hard-code dates.

For PM Fall Chinook:

- active season: local `00:00`, `04:00`, `08:00`, `12:00`, `16:00`, and `20:00`
- outside the active season: local `00:00`
- the protected hourly job runs shortly after the hour so the newest source
  transmissions have time to arrive

Condition refresh key:

```txt
riverId + runId + localDate + refreshSlot + engineVersion + configVersion
```

Owns:

- Push
- Fishability
- Current gauge/weather/temperature evidence
- Freshness, data quality, and interpretation note

Condition refreshes must not recalculate daily primitives.

### 8.2 Public API Shape

Target response keys:

```ts
type RiverRunSnapshot = {
  riverId: string;
  runId: string;
  localDate: string;
  timezone: string;

  runStage: PrimitiveDisplay;
  conditionsSuggest: PrimitiveDisplay;
  push: PrimitiveDisplay;
  pushHistory: {
    status:
      | "not_started"
      | "active_now"
      | "previously_recorded"
      | "none_recorded"
      | "unavailable"
      | "complete";
    minimumSupportiveScore: 50;
    trackingStartDate: string;
    trackingEndDate: string;
    throughDate: string;
    recentDailyReadsStatus: "available" | "unavailable";
    recentDailyReads: Array<{
      localDate: string;
      status:
        | "supportive_window"
        | "no_supportive_window"
        | "missing";
      refreshSlot?: string;
      conditionRefreshAt?: string;
      score: number | null;
      label: string;
    }>;
    lastSupportiveConditions?: {
      localDate: string;
      refreshSlot: string;
      conditionRefreshAt: string;
      score: number;
      label: string;
    };
  };
  fishability: PrimitiveDisplay;
  fishInRiver: PrimitiveDisplay & {
    score: number;
    maximum: 100;
    riverCeiling: number;
  };

  primaryGauge: NormalizedGaugeContext;
  secondaryGauges?: NormalizedGaugeContext[];
  weather: NormalizedWeatherContext;
  freshness: Record<string, string>;
  dataQuality: DataQuality;
  interpretationNote?: {
    headline: string;
    detail: string;
    reasonCodes: string[];
  };
  safety: {
    regulationReminder: string;
    gaugeBasis: string;
    activityDisclaimer: string;
  };
  engineVersion: string;
  configVersion: string;
};
```

V1.1 uses only the `conditionsSuggest` API key. The former `schedule` key must
not appear in the final public response; the undeployed client and server
contract migrated atomically without a compatibility alias.

### 8.3 Storage

Required logical storage:

| Data                          | Purpose                                                  |
| ----------------------------- | -------------------------------------------------------- |
| Gauge observations            | Auditable normalized current and historical measurements |
| Gauge level baselines         | Same-season relative river context                       |
| Gauge change baselines        | Same-season absolute and relative change context         |
| Temperature baselines/context | Measured-water trend evidence from audited sources       |
| Daily progression snapshots   | Run Stage, Conditions Suggest, Fish In River             |
| Condition refreshes           | Push, Fishability, and source evidence                   |

Stored decisions must retain:

- Provider and evidence type
- Original valid time and normalized UTC time
- River local date
- Source qualifiers
- Primary/secondary gauge roles
- Raw normalized metrics used
- Baseline, config, engine, and copy versions
- Scores, labels, reason codes, and copy template IDs

Writes are idempotent. Storage errors fail the snapshot deterministically; they
must not silently act as missing history.

---

## 9. Safety, Release, And Operations

- Public clients cannot inject dates, times, weather, gauges, or refresh
  timestamps.
- Scheduled refresh uses a protected internal endpoint.
- The runtime public gate defaults off.
- Provider calls have timeouts and structured failure logging.
- Missing providers degrade only according to the evidence rules above.
- Every response states:

```txt
Fishability describes fishing conditions, not wading or boating safety.
```

- Gauge reach copy remains visible.
- Current regulations remain the angler's responsibility.
- Forecasts are informational and never alter V1.1 scores.

Public enablement requires:

1. Input truth-layer acceptance.
2. PM config/source audit.
3. Historical baseline coverage.
4. Primitive boundary tests.
5. Historical replay with score and copy review.
6. Cross-primitive consistency matrix.
7. Hidden production smoke tests.
8. Runtime monitoring.

---

## 10. Required Implementation Order

To keep development linear and prevent downstream rework:

1. Reconcile the shared gauge/weather/temperature truth layer with Section 3.
2. Reconcile Run Stage and its complete copy matrix.
3. Replace Fish In River with the configured, river-capped 0–100
   historical-presence model.
4. Rebuild Push interactions and calibrate PM thresholds.
5. Replace Schedule with Conditions Suggest and add historical change baselines.
6. Rebuild Fishability without the rain/stain proxy and require audited bands.
7. Run the complete cross-primitive scenario and copy matrix.
8. Update the rollout plan with verified completion evidence.
9. Begin hidden production rollout.

The rollout must remain paused at the public-enable step until items 1–7 pass.

---

## 11. Acceptance Tests

### 11.1 Shared Inputs

- Local provider timestamps convert correctly across EST/EDT transitions.
- No future forecast hour or day can enter scored rain or temperature windows.
- Removing a null weather value does not shift its date.
- Modeled weather remains labeled modeled.
- Missing rain differs from observed dry conditions.
- USGS missing-value sentinels and invalid qualifiers are rejected.
- A 24-hour comparison outside tolerance produces unknown trend.
- One primary gauge works without optional gauges.
- Multi-gauge normalized signals never average raw CFS or gage height.
- Missing secondary gauges do not make the primary gauge unavailable.

### 11.2 Run Stage

- Every boundary date maps to the configured stage.
- Cross-year windows resolve correctly.
- Weather and gauge changes never alter Run Stage.
- Every stage's copy says or clearly implies calendar timing.

### 11.3 Conditions Suggest

- Uses four configured stage checkpoints and never same-day Push.
- Every checkpoint reuses cumulative evidence from staging start through its own
  completed cutoff.
- The result remains unchanged between checkpoints even as new raw data arrives.
- Uses primary-gauge historical change rather than universal change alone.
- Requires configured cumulative coverage (default 80%) and five historical
  years.
- p75/p25 boundaries and configured overrides are tested.
- Rain cannot directly improve Conditions Suggest.
- Missing measured water temperature returns Insufficient evidence.
- Colder-than-supportive relative conditions stop gaining credit at the
  configured cool-enough cap.
- A direct Ahead-to-Delayed or Delayed-to-Ahead checkpoint reversal returns
  Typical.
- The first tapering date returns Timing complete, retains the final
  `timingLabel`, and uses well-underway calendar copy.
- Evaluating and Timing complete do not falsely degrade overall data quality.
- Every output begins with or naturally includes “Conditions suggest.”

### 11.4 Push

- Moderate rain before gauge response can add precursor context.
- Gauge response replaces full rain credit once the river responds.
- Rain and gauge cannot receive duplicate full credit.
- A meaningful fishable rise can support Strong Push.
- Heavy rain into Blown Out cannot support an uncapped Strong Push.
- Cooling toward the configured range may help.
- Cooling below a too-cold threshold does not keep helping.
- Warming above a too-warm threshold applies its cap.
- Missing rain and temperature cap Push below Strong.
- Stale/missing gauge behavior matches the contract.
- Pre-run/post-run copy never claims fish movement occurred.

### 11.5 Fishability

- Audited absolute bands determine Fishability.
- Percentiles alone use relative-level language only.
- Rain does not claim stain or clarity.
- Stable Ideal can score Good/Excellent.
- Sharp rise into Too High/Blown Out is capped.
- Very low, stale, and unavailable cases apply their caps/copy.
- Only the primary gauge controls the score.
- Every response includes the activity safety disclaimer.

### 11.6 Fish In River

- Score is an integer from 0–100.
- Score never exceeds ten times the configured combination maximum.
- PM Fall Chinook can reach 100 at its configured peak.
- A maximum-7 run cannot exceed 70 at peak.
- Run Stage dates and the presence curve use the same active run year.
- Weather/gauge inputs never change Fish In River.
- Copy always identifies the value as historical seasonal presence.
- Public output hides the internal numeric score and uses the corresponding
  qualitative meter position and label.

### 11.7 Cross-Primitive And Copy

- Every score boundary maps to exactly one label and copy template.
- Every reachable state returns non-empty headline, detail, and tip.
- Stale, adjusted-reference, modeled, missing, and historical evidence are
  described correctly.
- All required disagreement cases return deterministic explanations.
- Prohibited claims never appear.
- Score, label, reason code, and copy assertions are reviewed together.
- Historical replay snapshots include both numeric outputs and final copy.

---

## 12. Definition Of Done

River Run V1.1 is ready for hidden production rollout when:

- This specification and implementation agree.
- PM run dates and presence maximum are sourced and audited.
- The modern gauge provider path and truth-layer tests pass.
- Historical level and change baselines meet coverage requirements.
- Run Stage and Fish In River pass all calendar boundaries.
- Push interaction logic passes PM historical replay.
- Conditions Suggest compares with real PM historical distributions.
- Fishability uses audited PM thresholds and no unsupported stain proxy.
- One-gauge and optional multi-gauge behavior are deterministic.
- Every primitive's score and copy are reviewed as one product decision.
- Missing and stale evidence fail conservatively.
- Cross-primitive explanations cover every apparent disagreement.
- Production remains release-gated until hidden smoke and monitoring pass.

Public River Run is ready only after hidden production results also pass the
rollout plan's runtime acceptance gates.

---

## Appendix A — Copy Patterns

These are patterns, not final PM copy. Final strings are versioned and reviewed
with their score branches.

Run Stage — Building:

```txt
The configured run calendar is in its building stage.
This stage comes from the researched start, peak, and end dates for this run.
Compare calendar timing with the other River Run reads.
```

Conditions Suggest — Delayed:

```txt
Conditions suggest delayed timing.
Cumulative completed gauge and temperature evidence is running behind the
historical pattern at this Pere Marquette fall Chinook checkpoint.
Use today's Push separately; current movement conditions can change without
changing this locked checkpoint result.
```

Conditions Suggest — Insufficient evidence:

```txt
There is not enough completed historical evidence to classify timing.
The checkpoint is missing required gauge or measured-temperature coverage,
matching history, or source quality.
Use Run Stage for calendar timing; this checkpoint will not guess.
```

Conditions Suggest — Timing complete:

```txt
Conditions timing evaluation is complete.
Through the main run end, the configured Pere Marquette fall Chinook run is
well underway by calendar timing and early-run classification no longer
updates. After the main run end, the run window has passed and Conditions
Suggest and Push are complete.
Fish In River may retain separately configured historical seasonal-presence
context; it does not extend the Push window.
```

Push — Strong:

```txt
Current conditions support a strong movement-trigger signal.
The primary gauge response and temperature context are favorable for this
river/run, without exceeding its high-water constraints.
This describes trigger conditions, not confirmed fish movement.
```

Fishability — Good:

```txt
The primary gauged reach is in good fishing shape.
The current gauge band and rate of change are within the audited range for
this river/run.
Conditions can vary away from the gauge; this is not a wading or boating
safety rating.
```

Fish In River — 80/100:

```txt
Seasonal presence is 80 out of 100.
This date falls in a historically strong portion of the researched Pere
Marquette fall Chinook window.
This is a calendar-based historical estimate, not a live fish count.
```

Strong Push + Tough Fishability:

```txt
Movement-trigger conditions and fishing shape are pointing in different
directions.
The event may support movement while the primary gauged reach remains
difficult to fish.
Read Push and Fishability separately and do not use Fishability as a safety
rating.
```
