# FinFindr River Run - V1 Build Spec

**Feature:** River Run  
**Product:** FinFindr  
**Region:** Great Lakes tributaries
**Launch proof:** Pere Marquette River - Fall Chinook
**Core rule:** Deterministic, config-driven, no catch predictions, no fish-count claims.

River Run gives migratory anglers a clear read on a supported river/run using researched run dates, official gauge data, recent weather, temperature trends, and behavior profiles. The engine classifies known inputs into honest signals. It does not guess.

---

## 1. Product Contract

River Run answers five separate questions:

| Primitive | Question | Refresh behavior |
|---|---|---|
| Push Score | Are current/recent conditions likely to trigger fresh movement? | 8-hour condition refresh |
| Fishability Score | Is the river currently in fishable shape? | 8-hour condition refresh |
| Fish In River Score | Should fish seasonally be present based on researched dates and run strength? | Daily progression snapshot |
| Run Stage | Where is the run in its researched calendar window? | Daily progression snapshot |
| Schedule | Does the run appear ahead, on schedule, behind, or uncertain? | Daily progression snapshot |

River Run must not produce:

- Overall River Run Score
- Best Call
- Travel confidence
- Catch probability
- Fish counts
- Exact spot/pool recommendations
- Forecast-scored primitives
- Ungauged river support
- In-app admin dashboard

Each primitive returns:

```ts
type PrimitiveDisplay = {
  label: string;
  score?: number;
  headline: string;
  detail: string;
  tip: string;
  reasonCodes: string[];
};
```

---

## 2. V1 Scope

### 2.1 Launch Slice

The first production-audited run is:

```txt
State: Michigan
River: Pere Marquette River
Run: Fall Chinook
Gauge: USGS 04122500 - Pere Marquette River at Scottville, MI
Behavior profile: fall_cooling_rain_pulse
Temperature: measured water temperature if configured/available; otherwise air_temp_proxy
```

This slice is the required calibration proof before exposing additional configured runs.

### 2.2 V1 Support Model

V1 must be able to support **all Great Lakes fall migratory runs** for any qualified, admin-configured river:

- Fall Chinook
- Fall Coho
- Fall steelhead entry
- Lake-run brown trout
- Atlantic salmon fall run where locally relevant

Only configured runs that pass validation are visible. Unsupported rivers/runs are hidden.

The engine includes all behavior profiles in section 5 so expansion does not require engine rewrites. Public exposure remains config-gated and audit-gated one river/run at a time.

---

## 3. User Model

Users browse supported runs only:

```txt
State
  -> River
    -> Season
      -> Run
```

Example:

```txt
Michigan
  -> Pere Marquette River
    -> Fall
      -> Fall Chinook
      -> Fall Steelhead Entry
    -> Spring
      -> Spring Steelhead
```

UI rules:

- State list shows only states with at least one supported river.
- River list shows only rivers with at least one supported run.
- Season tabs are user-facing: `Spring`, `Summer`, `Fall`, `Winter`.
- Launch UI shows all four season tabs. Seasons with no supported runs are disabled/coming soon and must not open an unsupported result.
- Each season shows only configured runs that pass validation.
- Users never see behavior profile names.

Each run is a separate configured profile. A river can share one gauge across multiple runs, but each run owns its own dates, internal behavior profile, run strength, copy hints, and fishability tuning when configured.

---

## 4. Data Requirements

### 4.1 Gauge

Every public run requires an official gauge:

- Provider: `USGS` or `OTHER_OFFICIAL`
- Primary metric: `flow_cfs` or `gage_height_ft`
- Minimum history: 2 years usable history
- Preferred history: 5+ years
- Maximum age: default 6 hours, configurable per river

If current gauge data is missing, Push and Fishability are unavailable for that refresh. Schedule becomes `Uncertain` for that daily snapshot if gauge data is missing.

If gauge data is older than `maxAgeHours` but not older than 24 hours, return scores with stale caps and stale copy. If older than 24 hours, return unavailable for current-condition primitives.

### 4.2 Weather

Use the existing FinFindr/Open-Meteo weather snapshot at `weatherLat/weatherLon`, falling back to river mouth coordinates.

Required observed fields:

- Rain totals: 24h, 48h, 72h
- Overnight lows for air temperature trend

When forecast is shown, it appears only as a secondary note. Forecast must not change any V1 primitive score.

Weather freshness:

```txt
fresh: observed snapshot age <= 12h
stale: observed snapshot age > 12h and <= 24h
missing: observed snapshot unavailable or age > 24h
```

If weather is stale, use available gauge-driven signals and add stale-weather reason codes. If weather is missing, rain and air-proxy temperature signals are `0`; Schedule becomes `Uncertain` when two or more required non-gauge inputs are missing.

### 4.3 Water Temperature

Use water temperature when it is explicitly configured and available. Otherwise use air temperature as a proxy.

Temperature source priority:

1. Same gauge water temperature
2. Approved nearby water temperature gauge
3. Approved adjusted reference gauge
4. Air temperature proxy
5. Unavailable

Rules:

- Measured water temperature can drive trend and configured absolute temperature caps.
- Adjusted reference gauge applies `adjustmentF` before trend/cap logic.
- Air proxy uses overnight lows, not daytime highs.
- Air proxy can influence Push and Schedule, but copy must say it is a proxy.
- Air proxy temperature signal is capped to `-1`, `0`, or `+1` after profile mapping. It must never create a `+2` or `-2` temperature signal.
- Air proxy must not trigger absolute water-temperature caps.
- If no temperature source is usable, temperature signal is `0` and copy must not mention temperature.

### 4.4 Input Normalization

All provider data must be normalized into canonical units and local-time windows before scoring. Behavior profiles consume normalized signals only; they must not read provider-specific fields directly.

Gauge normalization:

- Store gauge observations with `observedAt` in UTC.
- Convert discharge to `flow_cfs`.
- Convert gage height to `gage_height_ft`.
- Use the run's configured `primaryMetric` for flow/height band and trend.
- Compare current gauge value only against baselines for the same metric.
- Compute 24h flow/height trend from the latest usable observation and the closest usable observation at or before 24h prior.
- If the 24h prior comparison point is missing, trend is `unknown` and contributes neutral signal `0` with a reason code.

Weather normalization:

- Store weather snapshot timestamp in UTC.
- Compute rain totals in inches over local rolling 24h, 48h, and 72h windows ending at the condition refresh time.
- Convert precipitation to inches before thresholding.
- Use the river timezone for daily weather windows.
- If rain totals are unavailable, rain signal is neutral `0` with a reason code.

Temperature normalization:

- Convert all temperature inputs to Fahrenheit.
- For measured water temperature, use daily median when enough readings exist; otherwise use the reading closest to the refresh time.
- For adjusted reference gauges, apply `adjustmentF` before trend calculations.
- For air proxy, use overnight lows in the river timezone.
- Compute temperature trends from normalized daily values.
- If fewer than 2 usable values exist in the last 72h, temperature trend is `neutral_missing` and contributes `0`.

Profile mapping order:

```txt
provider data -> normalized metrics -> raw signals -> behavior profile signal values -> scores
```

---

## 5. Internal Behavior Profiles

A behavior profile defines how rain, flow, and temperature signals affect migratory movement. Runs choose one profile in config.

Behavior profiles are internal engine profiles, not UI categories. Users select season and run. The engine reads the configured profile for that run.

### 5.1 V1 Profiles

| Profile | Typical runs |
|---|---|
| `fall_cooling_rain_pulse` | Fall Chinook, coho, lake-run browns, Atlantic salmon, fall steelhead entry |
| `spring_warming_flow_pulse` | Spring steelhead, spring Atlantic salmon where relevant |
| `winter_thaw_flow_window` | Winter steelhead |
| `summer_cool_rain_pulse` | Skamania/summer steelhead |
| `stable_cool_holding` | Holding fish after primary movement windows |

The PM Fall Chinook launch run uses `fall_cooling_rain_pulse`.

Seasonal mental model:

```txt
Fall: cooling + rain + rising flow
Winter: thaw/rain window + fishable stability
Spring: warming + fishable flow
Summer: cooler break + rain pulse + temperature safety
Holding: stable cool fishable conditions after fish are already in the river
```

Species differences are primarily config-driven:

- Run dates
- Run strength
- Temperature source/rules
- Rain thresholds
- Rise thresholds
- Fishability bands
- Copy hints

Run strength is a population/significance input, not a conditions input. In V1, `runStrength` affects **Fish In River Score only**. Schedule does not affect Fish In River Score. It must not change Push, Fishability, Run Stage, or Schedule:

- Push describes whether today's conditions favor movement.
- Fishability describes river shape.
- Run Stage describes calendar position.
- Schedule describes 7-day progression.
- Fish In River describes likely seasonal presence from date curve + run strength, which is where weak/medium/signature runs should differ.

### 5.2 Signal Values

Each profile scores three movement signals:

- Rain signal
- Flow/height signal
- Temperature signal

Each signal returns:

| Value | Meaning |
|---:|---|
| +2 | Strongly favorable |
| +1 | Favorable |
| 0 | Neutral or missing |
| -1 | Unfavorable |
| -2 | Strongly unfavorable |

```txt
favorabilityIndex = rainSignal + flowSignal + tempSignal
```

Temperature source adjustment:

```txt
if temperatureSource is air_temp_proxy:
  tempSignal = clamp(tempSignal, -1, 1)
if temperatureSource is unavailable:
  tempSignal = 0
```

Rain and flow/height signals are not weakened by temperature source.

Favorability level:

| favorabilityIndex | Level |
|---:|---|
| 4 to 6 | Very favorable |
| 2 to 3 | Favorable |
| -1 to 1 | Neutral |
| -3 to -2 | Unfavorable |
| -6 to -4 | Very unfavorable |

### 5.3 Raw Signal Definitions

Rain:

| Raw signal | Definition |
|---|---|
| Dry/stale | < 0.10 in over 72h |
| Light rain | 0.10-0.34 in over 48h |
| Meaningful rain | 0.35-0.74 in over 48h |
| Strong rain | 0.75-1.49 in over 48h |
| Heavy rain | >= 1.50 in over 48h |

Flow/height trend:

| Raw signal | Definition |
|---|---|
| Falling | Current metric down >= 10% over 24h |
| Stable | Current metric within +/- 10% over 24h |
| Rising | Current metric up 10-24% over 24h |
| Meaningful rise | Current metric up 25-49% over 24h |
| Sharp rise | Current metric up >= 50% over 24h |

Temperature trend:

| Raw signal | Measured water definition | Air proxy definition |
|---|---|---|
| Strong cooling | Down >= 5 F over 72h or >= 3 F over 24h | Overnight lows down >= 8 F over 72h |
| Cooling | Down 2-4.9 F over 72h or 1.5-2.9 F over 24h | Overnight lows down 4-7.9 F over 72h |
| Neutral | Within +/- 2 F over 72h | Overnight lows within +/- 4 F over 72h |
| Warming | Up 2-4.9 F over 72h or 1.5-2.9 F over 24h | Overnight lows up 4-7.9 F over 72h |
| Strong warming | Up >= 5 F over 72h or >= 3 F over 24h | Overnight lows up >= 8 F over 72h |
| Neutral missing | Fewer than 2 usable daily values in 72h | Fewer than 2 usable overnight lows in 72h |

### 5.4 Profile Signal Tables

`fall_cooling_rain_pulse`

| Raw signal | Value |
|---|---:|
| Strong/heavy rain | +2 |
| Meaningful rain | +1 |
| Light rain | 0 |
| Dry/stale | -1 |
| Meaningful rise or sharp rise | +2 |
| Rising | +1 |
| Stable | 0 |
| Falling with low/very-low band | -1 |
| Strong cooling | +2 |
| Cooling | +1 |
| Neutral temp | 0 |
| Warming | -1 |
| Strong warming | -2 |

`spring_warming_flow_pulse`

| Raw signal | Value |
|---|---:|
| Strong/heavy rain | +1 if not blown out |
| Meaningful rain | +1 |
| Light rain or dry/stale | 0 |
| Meaningful rise | +2 if fishable, 0 if high/very-high |
| Rising | +1 |
| Stable fishable flow | +1 |
| Falling with low/very-low band | -1 |
| Strong warming | +2 |
| Warming | +1 |
| Neutral temp | 0 |
| Cooling | -1 |
| Strong cooling | -2 |

`winter_thaw_flow_window`

| Raw signal | Value |
|---|---:|
| Strong/heavy rain | +1 if not blown out |
| Meaningful rain | +1 |
| Dry/stale | -1 |
| Meaningful rise | +2 if fishable, 0 if high/very-high |
| Rising | +1 |
| Stable fishable flow | +1 |
| Sharp rise into high/very-high | -1 |
| Stable cool/cold water | +1 |
| Cooling | 0 |
| Warming | +1 if water remains cool/fishable |
| Strong warming | 0 by default; -2 if measured water temp exceeds `tooWarmF` |

`summer_cool_rain_pulse`

| Raw signal | Value |
|---|---:|
| Strong/heavy rain | +2 if not blown out |
| Meaningful rain | +1 |
| Dry/stale | -1 |
| Meaningful rise or sharp rise | +2 if fishable |
| Rising | +1 |
| Stable | 0 |
| Cooler break / cooling | +1 |
| Strong cooling after heat | +2 |
| Neutral temp | 0 |
| Warming | -1 |
| Unsafe warm measured water | -2 and cap Push at 50 |

`stable_cool_holding`

| Raw signal | Value |
|---|---:|
| Meaningful/strong rain | 0, or -1 if it destabilizes fishability |
| Light rain | 0 |
| Dry/stale | 0 |
| Stable fishable flow | +2 |
| Rising/falling within fishable band | 0 |
| Sharp rise or blown out | -2 |
| Stable cool water | +1 |
| Cooling/warming | 0 |

---

## 6. Fishability Bands

Fishability bands come from either historical percentiles or config overrides.

Default percentile bands:

| Canonical band | Display label | Percentile |
|---|---|---|
| `very_low` | Very low | below p10 |
| `low` | Low | p10-p25 |
| `normal_fishable` | Normal/fishable | p25-p35 and p65-p70 |
| `ideal` | Ideal | p35-p65 |
| `high_fishable` | High/fishable | p70-p85 |
| `very_high` | Very high | p85-p90 |
| `blown_out` | Blown out | above p90 |

Percentiles are computed per day-of-year using a +/- 14 day rolling window across all available years.

Config override example:

```ts
fishabilityBands: {
  metric: 'flow_cfs',
  tooLow: { max: 250 },
  lowFishable: { min: 250, max: 400 },
  ideal: { min: 400, max: 850 },
  highFishable: { min: 850, max: 1200 },
  blownOut: { min: 1200 }
}
```

The API must expose `bandSource` as `percentile_default` or `admin_override`.

---

## 7. Config Model

### 7.1 River Profile

```ts
export type RiverProfile = {
  riverId: string;
  displayName: string;
  state: 'MI' | 'WI' | 'IL' | 'IN' | 'OH' | 'PA' | 'NY';
  region: 'great_lakes';
  timezone: string;

  mouthLat: number;
  mouthLon: number;
  weatherLat?: number;
  weatherLon?: number;

  gauge: {
    provider: 'USGS' | 'OTHER_OFFICIAL';
    siteId: string;
    name: string;
    primaryMetric: 'flow_cfs' | 'gage_height_ft';
    secondaryMetric?: 'flow_cfs' | 'gage_height_ft';
    historyYearsAvailable?: number;
    maxAgeHours?: number;
    reachQuality: 'good' | 'acceptable' | 'limited';
    reachNotes: string;
  };

  supportStatus: 'beta' | 'verified';
  gaugeLimitationCopy: string;
};
```

### 7.2 Run Profile

```ts
export type RiverRunProfile = {
  runId: string;
  riverId: string;

  displayName: string;
  species:
    | 'chinook_salmon'
    | 'coho_salmon'
    | 'steelhead'
    | 'skamania'
    | 'lake_run_brown_trout'
    | 'atlantic_salmon';

  season: 'spring' | 'summer' | 'fall' | 'winter';
  runType:
    | 'fall_spawn'
    | 'fall_entry'
    | 'winter_run'
    | 'spring_spawn'
    | 'summer_run'
    | 'holding';

  behaviorProfile:
    | 'fall_cooling_rain_pulse'
    | 'spring_warming_flow_pulse'
    | 'winter_thaw_flow_window'
    | 'summer_cool_rain_pulse'
    | 'stable_cool_holding';

  runWindow: {
    start: string; // MM-DD
    peak: string;  // MM-DD
    end: string;   // MM-DD
    earlyWindowDays?: number; // default 14
    lateWindowDays?: number;  // default 14
    peakWindowDays?: number;  // default 5
  };

  runStrength: 1 | 2 | 3 | 4 | 5;

  rainThresholds?: {
    meaningful48hIn?: number;
    strong48hIn?: number;
    heavy48hIn?: number;
  };

  riseThresholds?: {
    rising24hPercent?: number;
    meaningfulRise24hPercent?: number;
    sharpRise24hPercent?: number;
  };

  fishabilityBands?: FishabilityBands;

  waterTemperatureSource: {
    type:
      | 'same_gauge'
      | 'nearby_gauge'
      | 'adjusted_reference_gauge'
      | 'air_temp_proxy'
      | 'unavailable';
    provider?: 'USGS' | 'OTHER_OFFICIAL' | 'OpenMeteo';
    siteId?: string;
    adjustmentF?: number;
    notes: string;
  };

  temperatureRules?: {
    tooColdF?: number;
    idealMinF?: number;
    idealMaxF?: number;
    tooWarmF?: number;
  };

  userCopyHints?: {
    preRunTip?: string;
    peakTip?: string;
    endingTip?: string;
  };
};
```

### 7.3 Validation

Invalid configs are hidden from users and logged.

Required validation:

- River has ID, display name, state, timezone, coordinates, and gauge config.
- Weather point falls back to mouth coordinates when omitted.
- Gauge provider/site ID are present.
- Gauge reach quality is `good` or `acceptable` for public support.
- Gauge has at least 2 years of usable history.
- Gauge has the configured primary metric.
- Run has supported species, season, run type, and behavior profile.
- Run dates are valid, including cross-year windows.
- Run strength is 1-5.
- If no fishability override exists, baseline percentiles exist.
- Temperature source config is valid.

---

## 8. Snapshot And Refresh Contract

### 8.1 Daily Progression Snapshot

Create one daily progression snapshot per:

```txt
riverId + runId + localDate
```

It is generated at or shortly after local midnight. If scheduled generation fails, the first request of the day must generate it before returning the snapshot.

The daily progression snapshot owns:

- Run Stage
- Schedule
- Fish In River Score
- 7-day favorability summaries
- Config version
- Engine version

### 8.2 Required 8-Hour Condition Refresh

Create condition refreshes at fixed local slots:

```txt
00:00
08:00
16:00
```

Key:

```txt
riverId + runId + localDate + refreshSlot
```

The condition refresh owns:

- Push Score
- Fishability Score
- Gauge value and trend
- Rain totals
- Temperature trend
- Reason codes
- Freshness metadata

A condition refresh must read the existing daily progression snapshot. It must not recalculate Run Stage, Schedule, or Fish In River.

### 8.3 Stored Context

Snapshot/refresh rows must store enough context to explain the output later:

- River/run IDs
- Local date
- Snapshot/refresh timestamps
- Refresh slot
- Gauge values and observed timestamp
- Flow/height band and trend
- Rain totals
- Temperature source and trend
- Derived scores/labels
- Reason codes
- Data freshness metadata
- Engine version
- Config version

---

## 9. Scoring Algorithms

All scoring is deterministic. Same config plus same inputs must produce the same output.

### 9.1 Push Score

1. Resolve raw rain, flow, and temperature signals.
2. Convert raw signals through the run behavior profile.
3. Sum into `favorabilityIndex`.
4. Convert to base score.
5. Apply modifiers and caps.

Base score:

| Favorability level | Base Push Score |
|---|---:|
| Very unfavorable | 10 |
| Unfavorable | 25 |
| Neutral | 45 |
| Favorable | 68 |
| Very favorable | 86 |

Modifiers:

```txt
+5 if current fishability band is normal_fishable or ideal
-10 if current fishability band is very_high
-15 if current fishability band is blown_out
-10 if gauge is stale
```

Caps:

```txt
if gauge is stale: Push <= 55
if measured water temp exceeds configured tooWarmF: Push <= 50
if gauge is missing: Push unavailable
```

Final score:

```txt
pushScore = clamp(round(base + modifiers), 0, 100)
```

Labels:

| Score | Label |
|---:|---|
| 0-24 | Weak |
| 25-49 | Limited |
| 50-69 | Possible |
| 70-84 | Strong |
| 85-100 | Very strong |

### 9.2 Fishability Score

Fishability is river shape, not fish presence.

Formula:

```txt
fishabilityScore =
  round(
    bandScore * 0.55 +
    trendScore * 0.25 +
    rainStainScore * 0.15 +
    freshnessScore * 0.05
  )
```

Band score:

| Band | Score |
|---|---:|
| very_low | 25 |
| low | 45 |
| normal_fishable | 75 |
| ideal | 90 |
| high_fishable | 60 |
| very_high | 35 |
| blown_out | 15 |

Trend score:

| Trend | Score |
|---|---:|
| stable | 85 |
| falling | 65 |
| rising | 65 |
| meaningful_rise | 45 |
| sharp_rise | 25 |

Rain/stain proxy score:

| Rain signal | Score |
|---|---:|
| dry_stale | 90 |
| light_rain | 90 |
| meaningful_rain | 70 |
| strong_rain | 45 |
| heavy_rain | 25 |

Freshness score:

| Freshness | Score |
|---|---:|
| fresh | 100 |
| stale | 40 |
| missing | 0 |

Caps:

```txt
if blown_out: Fishability <= 25
if sharp_rise and band is high_fishable/very_high/blown_out: Fishability <= 40
if very_low: Fishability <= 45
if gauge_stale: Fishability <= 55
if gauge_missing: Fishability unavailable
```

Labels:

| Score | Label |
|---:|---|
| 0-24 | Poor |
| 25-49 | Tough |
| 50-69 | Fishable |
| 70-84 | Good |
| 85-100 | Excellent |

### 9.3 Fish In River Score

Fish In River is date-first. It is not a fish count.

Use linear interpolation across the run window:

| Position | Base score |
|---|---:|
| More than earlyWindowDays before start | 5 |
| Early window before start | 15 at window start -> 35 day before start |
| Start date | 40 |
| Beginning | 40 -> 55 |
| Building | 55 -> 75 |
| Peak window | 80 -> 100 at peak day -> 80 |
| Tapering | 80 -> 60 |
| Ending | 60 -> 35 |
| Late window after end | 30 -> 10 |
| More than lateWindowDays after end | 5 |

Run strength adjustment:

`runStrength` represents the relative strength/significance of that species run on that river. It scales Fish In River because a weak run should not look as seasonally loaded as a signature run, even on the same calendar date.

Apply the strength multiplier and cap after the date score, then apply the contextual caps below.

| runStrength | Meaning | Multiplier | Strength cap |
|---:|---|---:|---:|
| 1 | Weak/rare run | 0.55 | 55 |
| 2 | Light run | 0.70 | 70 |
| 3 | Medium run | 0.85 | 85 |
| 4 | Strong run | 0.95 | 95 |
| 5 | Signature run | 1.00 | 100 |

```txt
strengthAdjustedScore = min(base * runStrengthMultiplier, runStrengthCap)
```

Caps:

```txt
Pre-run: max 39
Beginning: max 60
Post-run: max 25
More than lateWindowDays after end: max 10
```

Final score:

```txt
fishInRiverScore = clamp(round(strengthAdjustedScore after contextual caps), 0, 100)
```

Labels:

| Score | Label |
|---:|---|
| 0-19 | Very unlikely |
| 20-39 | A few possible |
| 40-59 | Building presence |
| 60-79 | Likely present |
| 80-100 | Peak presence |

### 9.4 Run Stage

Convert `start`, `peak`, and `end` from `MM-DD` into local dates for the active run year. Cross-year runs are allowed.

Active run year selection:

```txt
1. Build candidate start/peak/end windows using previous, current, and next calendar-year starts.
2. For cross-year runs, allow peak/end to fall in the following calendar year when needed.
3. Choose the candidate window whose start->end span is closest to the snapshot date.
4. Use that candidate window for Run Stage and Fish In River date math.
```

Default windows:

```txt
Pre-run:    before start
Beginning:  start through first 20% of start->peak span
Building:   after beginning through peak window
Peak:       peak +/- peakWindowDays, default 5
Tapering:   after peak window through 75% of peak->end span
Ending:     final 25% of peak->end span
Post-run:   after end
```

Stage selection:

```txt
if date < start:                 Pre-run
else if date <= beginningEnd:    Beginning
else if date < peakStart:        Building
else if date <= peakEnd:         Peak
else if date <= taperingEnd:     Tapering
else if date <= end:             Ending
else:                            Post-run
```

Weather never changes Run Stage.

### 9.5 Schedule

Schedule is a rolling 7-day progression read, not today's push.

For each of the last 7 local dates, compute that day's `favorabilityIndex` using the run's behavior profile.

Weights:

| Day | Weight |
|---:|---:|
| 0 today | 1.50 |
| -1 | 1.35 |
| -2 | 1.20 |
| -3 | 1.00 |
| -4 | 0.80 |
| -5 | 0.65 |
| -6 | 0.50 |

```txt
progressionIndex = weightedAverage(favorabilityIndex[-6..0])
```

Progression levels:

| progressionIndex | Level |
|---:|---|
| >= 2.25 | Strongly favorable week |
| 1.00 to 2.24 | Favorable week |
| -0.99 to 0.99 | Neutral/mixed week |
| -2.24 to -1.00 | Unfavorable week |
| <= -2.25 | Strongly unfavorable week |

Decision table:

| Stage | Strongly favorable | Favorable | Neutral/mixed | Unfavorable | Strongly unfavorable |
|---|---|---|---|---|---|
| Pre-run, inside early window | Ahead | Ahead | Uncertain | Uncertain | Uncertain |
| Pre-run, before early window | Uncertain | Uncertain | Uncertain | Uncertain | Uncertain |
| Beginning | Ahead | On schedule | On schedule | Behind | Behind |
| Building | Ahead | On schedule | On schedule | Behind | Behind |
| Peak | On schedule | On schedule | On schedule | Behind | Uncertain |
| Tapering | On schedule | On schedule | On schedule | Behind | Behind |
| Ending | On schedule | On schedule | On schedule | Behind | Behind |
| Post-run, inside late window | Uncertain | Uncertain | Uncertain | Behind | Behind |
| Post-run, after late window | Uncertain | Uncertain | Uncertain | Uncertain | Uncertain |

Override rules:

```txt
if gauge data is missing: Schedule = Uncertain
if fewer than 4 of last 7 days are usable: Schedule = Uncertain
if two or more required non-gauge inputs are missing today: Schedule = Uncertain
if no decision table case matches: Schedule = Uncertain
```

Smoothing:

```txt
if previousSchedule is missing:
  use candidateSchedule
else if candidateSchedule equals previousSchedule:
  use candidateSchedule
else if candidateSchedule is Uncertain:
  use Uncertain
else if progressionIndex crossed the relevant threshold by at least 0.35:
  use candidateSchedule
else if candidateSchedule has appeared for 2 consecutive daily progression snapshots:
  use candidateSchedule
else:
  keep previousSchedule
```

---

## 10. Copy Contract

Copy is deterministic. No LLM.

The copy layer must explain disagreements between primitives:

| Condition | Required copy angle |
|---|---|
| High Push + Low Fishability | Fish may move, but the river may be hard to fish cleanly. |
| Ahead Schedule + Pre-run Stage | Some early fish are possible, but the main run is not established. |
| Peak Stage + Weak Push | Fish may be present, but fresh movement is limited today. |
| Good Fishability + Low Fish In River | The river is in shape, but the run is not seasonally established. |
| Behind Schedule + Strong Push | Today's conditions improved, but the broader 7-day schedule still looks delayed. |
| Stale gauge | Gauge data is stale; use caution interpreting current river shape. |
| Air proxy temperature | Cooler/warmer nights may affect the trend; do not claim measured water temperature. |

Required copy examples live in Appendix A.

---

## 11. API Shape

### 11.1 `GET /river-run/rivers`

Returns only valid, supported, visible runs.

The API returns runs as a flat array per river. The client renders static season tabs (`Spring`, `Summer`, `Fall`, `Winter`) and groups returned runs by each run's `season` field. Seasons with no returned runs render disabled/coming soon and must not open a result.

```json
{
  "states": [
    {
      "state": "MI",
      "rivers": [
        {
          "riverId": "pere_marquette",
          "displayName": "Pere Marquette River",
          "runs": [
            {
              "runId": "pere_marquette_fall_chinook",
              "displayName": "Fall Chinook",
              "species": "chinook_salmon",
              "season": "fall",
              "supportStatus": "beta"
            }
          ]
        }
      ]
    }
  ]
}
```

### 11.2 `GET /river-run/snapshot?riverId=&runId=`

Returns the stable daily progression snapshot plus the latest required 8-hour condition refresh.

```json
{
  "riverId": "pere_marquette",
  "runId": "pere_marquette_fall_chinook",
  "localDate": "2026-09-10",
  "timezone": "America/Detroit",
  "progressionSnapshotAt": "2026-09-10T04:10:00Z",
  "conditionRefreshAt": "2026-09-10T12:10:00Z",
  "refreshSlot": "08:00",
  "progressionExpiresAt": "2026-09-11T04:00:00Z",
  "nextConditionRefreshAt": "2026-09-10T20:00:00Z",
  "runStage": {
    "label": "Building",
    "headline": "The run is inside its normal window.",
    "detail": "Fish presence should be increasing when conditions cooperate.",
    "tip": "Use Push Score and Fishability Score to decide how aggressive to be.",
    "reasonCodes": ["stage_building"]
  },
  "schedule": {
    "label": "Behind",
    "progressionIndex": -1.34,
    "usableDays": 7,
    "headline": "This run may be progressing slower than normal.",
    "detail": "The last week has not strongly favored movement for this run profile.",
    "tip": "Watch for the next cooldown, rain, or river bump.",
    "reasonCodes": ["unfavorable_week"]
  },
  "push": {
    "score": 42,
    "label": "Limited",
    "headline": "Weather has not lined up for a strong push yet.",
    "detail": "This fall run usually improves with cooler rain or a noticeable river bump.",
    "tip": "Watch for the next cooldown or meaningful rain before expecting stronger movement.",
    "reasonCodes": ["dry_72h", "stable_flow", "temperature_neutral_proxy"]
  },
  "fishability": {
    "score": 76,
    "label": "Good",
    "headline": "The river is within its configured fishable range.",
    "detail": "Flow looks manageable based on the selected gauge.",
    "tip": "Focus on normal travel lanes and holding water.",
    "reasonCodes": ["normal_flow_band", "stable_flow"]
  },
  "fishInRiver": {
    "score": 58,
    "label": "Building presence",
    "headline": "This run is building by the calendar.",
    "detail": "Fish should be increasingly present for a signature run at this point in the window.",
    "tip": "Cover water efficiently and prioritize lower-to-middle river areas until stronger push conditions arrive.",
    "reasonCodes": ["building_stage", "run_strength_signature"]
  },
  "gauge": {
    "provider": "USGS",
    "siteId": "04122500",
    "observedAt": "2026-09-10T03:30:00Z",
    "primaryMetric": "flow_cfs",
    "value": 420,
    "bandSource": "percentile_default",
    "band": "normal_fishable"
  },
  "weather": {
    "rain24hIn": 0.02,
    "rain48hIn": 0.05,
    "rain72hIn": 0.06,
    "temperatureTrend": "neutral",
    "temperatureSource": "air_temp_proxy"
  },
  "freshness": {
    "gauge": "fresh",
    "weather": "fresh",
    "waterTemperature": "proxy",
    "scheduleDaysUsable": 7
  },
  "secondaryNote": "Rain in the next 48 hours may change the push signal.",
  "safety": {
    "regulationReminder": "Check current local regulations before fishing.",
    "gaugeBasis": "Based on the USGS gauge at Scottville. Conditions can vary by reach."
  },
  "engineVersion": "river-run-v1.0.0",
  "configVersion": "2026-07-07"
}
```

---

## 12. Storage

V1 uses three tables:

| Table | Purpose |
|---|---|
| `river_run_gauge_baselines` | Historical percentile baselines |
| `river_run_daily_progression_snapshots` | Stable Run Stage, Schedule, Fish In River per local date |
| `river_run_condition_refreshes` | Push and Fishability per local date/refresh slot |

Config remains in version-controlled code.

---

## 13. Recommended File Structure

```txt
supabase/functions/
  river-run/
    index.ts

  _shared/riverRunEngine/
    types.ts
    config/
      rivers.ts
      runs.ts
    data/
      usgs.ts
      weatherSnapshot.ts
      baselines.ts
    metrics/
      dateWindow.ts
      rain.ts
      flow.ts
      temperature.ts
      favorability.ts
    scoring/
      push.ts
      fishability.ts
      fishInRiver.ts
      runStage.ts
      schedule.ts
    copy/
      templates.ts
      reasonCodes.ts
    snapshot/
      buildDailySnapshot.ts
      buildConditionRefresh.ts
      refreshSlots.ts
    tests/
      pereMarquetteFallChinook.test.ts
      behaviorProfiles.test.ts
      stageScheduleCombos.test.ts
```

---

## 14. Acceptance Tests

### 14.1 Launch Run Tests

- Pere Marquette Fall Chinook config validates.
- USGS 04122500 primary metric resolves.
- Weather point resolves.
- Air proxy temperature resolves when measured water temperature is unavailable.
- Daily progression snapshot is stable by local date.
- 00:00, 08:00, and 16:00 condition refresh slots are scheduled, and missing slots are generated on first request.

### 14.2 Date/Stage Tests

| Scenario | Expected |
|---|---|
| 30 days before start | Stage Pre-run, Fish In River very low, Schedule Uncertain |
| 10 days before start + strongly favorable fall week | Stage Pre-run, Schedule Ahead, Fish In River "A few possible" |
| Start date + neutral conditions | Stage Beginning, Schedule On schedule |
| Building window + hot/dry/low fall conditions | Stage Building, Schedule Behind |
| Peak date + neutral/fishable conditions | Stage Peak, Fish In River high |
| After peak window before taperingEnd | Stage Tapering |
| After taperingEnd before end | Stage Ending |
| 20 days after end | Stage Post-run, Fish In River very low |

### 14.3 Push Tests

| Scenario | Expected |
|---|---|
| Fall cooling: rain + rise + cooling | Very strong Push |
| Fall cooling: strong rain only, neutral flow/temp, fishable band | Strong Push |
| Fall cooling: cooling only, neutral rain/flow, fishable band | Possible Push |
| Fall cooling: strong cooling only, neutral rain/flow, fishable band | Strong Push |
| Fall cooling: warm/dry/falling | Weak Push |
| Stale gauge | Push capped at 55 |
| Missing gauge | Push unavailable |

### 14.4 Fishability Tests

| Scenario | Expected |
|---|---|
| Normal/ideal band + stable | Good/Excellent |
| Blown-out band | Poor/Tough, cap applied |
| Very low band | Poor/Tough, cap applied |
| Sharp rise into high band | Fishability capped |
| Stale gauge | Fishability capped and copy mentions stale data |
| Missing gauge | Fishability unavailable |

### 14.5 Profile Coverage Tests

Each behavior profile must have deterministic signal mapping tests:

- `fall_cooling_rain_pulse`
- `spring_warming_flow_pulse`
- `winter_thaw_flow_window`
- `summer_cool_rain_pulse`
- `stable_cool_holding`

### 14.6 Copy Matrix Tests

Every reachable Run Stage x Schedule combination returns non-empty copy:

- Pre-run + Ahead
- Pre-run + Uncertain
- Beginning + Ahead
- Beginning + On schedule
- Beginning + Behind
- Building + Ahead
- Building + On schedule
- Building + Behind
- Peak + On schedule
- Peak + Behind
- Peak + Uncertain
- Tapering + On schedule
- Tapering + Behind
- Ending + On schedule
- Ending + Behind
- Post-run + Uncertain

---

## 15. Definition Of Done

River Run V1 is ready when:

- PM Fall Chinook is configured and audited.
- The engine can support additional Great Lakes fall runs through config only.
- Config validation hides invalid runs.
- Gauge baseline generation works with at least 2 years of history.
- Daily progression snapshots are stable by local date.
- Required 8-hour condition refreshes work.
- Push and Fishability refresh without changing Stage, Schedule, or Fish In River.
- All five primitives render with deterministic labels/copy.
- Fishability formula and caps match this spec.
- Push formula and caps match this spec.
- Fish In River formula and caps match this spec.
- Schedule smoothing and decision table match this spec.
- Water temperature uses measured/configured sources when available and air proxy otherwise.
- Air proxy copy is cautious.
- Missing/stale gauge behavior works.
- Unsupported rivers/runs are hidden.
- Acceptance tests pass.
- User-facing language avoids over-promising.

---

## Appendix A - Copy Examples

Keep copy concise, practical, and honest.

Push, fall cooling, very strong:

```txt
Recent rain, rising flow, and cooler temperatures are lining up for this run.
These are favorable movement conditions for fall salmon.
Cover lower-river travel lanes while the river stays fishable.
```

Push, neutral:

```txt
Conditions are not strongly helping or hurting movement right now.
A push could develop with the next meaningful weather change.
Use river shape and run stage to decide how aggressive to be.
```

Fishability, good:

```txt
The river is within its configured fishable range.
Flow looks manageable based on the selected gauge.
Focus on normal travel lanes and holding water.
```

Fishability, blown out:

```txt
The river is running above its configured fishable range.
Fish may move in these conditions, but clean fishing can be difficult or unsafe.
Wait for the river to drop and stabilize.
```

Disagreement copy, Pre-run + Ahead Schedule:

```txt
This is still before the normal run window, but recent conditions have favored early movement.
Some early fish may be possible, but Fish In River remains date- and run-strength based.
Cover lower-river water and staging areas rather than assuming the whole system is loaded.
```

Fish In River, peak:

```txt
This is near the researched peak window for this run.
Fish are more likely to be spread through the river when fishability cooperates.
Use Push Score and Fishability Score to judge how active the window is today.
```

Schedule, uncertain:

```txt
The calendar and conditions are giving mixed signals, or important data is missing.
Use the current Push and Fishability signals more than the schedule label today.
```
