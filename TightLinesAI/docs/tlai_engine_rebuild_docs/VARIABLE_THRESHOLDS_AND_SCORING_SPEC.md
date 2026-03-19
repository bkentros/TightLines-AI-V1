# VARIABLE_THRESHOLDS_AND_SCORING_SPEC

## Purpose

This document defines:
- non-temperature variable thresholds
- normalized variable states
- score math
- dynamic missing-variable reweighting
- band mapping
- contribution selection

Temperature-specific config lives in the temperature document.

---

## Normalized variable state schema

All non-temperature scored variables should normalize to one of these five score values:

- `+2`
- `+1`
- `0`
- `-1`
- `-2`

Recommended generic structure:

```ts
type VariableState = {
  label: string
  score: -2 | -1 | 0 | 1 | 2
  detail?: string
}
```

---

## Unit normalization rules

Normalize all upstream values before scoring:

- pressure: convert to `hPa` / `mb`
- wind: convert to `mph`
- precipitation totals: convert to `inches`
- precipitation rate: convert to `in/hr`
- current speed: prefer `knots`
- tide height: prefer `feet`

If an upstream API already returns these units, preserve them. If units are missing or mixed, normalize before any threshold logic runs.

---

## Pressure regime

### Purpose
Pressure should be read as a broad regime and stability signal. It should not be treated as a simplistic "high good / low bad" variable.

### Labels
- `stable_positive`
- `stable_neutral`
- `falling`
- `volatile`

### Inputs
- pressure series covering the last 24 hours when available
- at minimum: pressure now and one older comparison point

### Derived values
Use these derived values from the last 24 hours when available:

- `delta24 = latestPressure - oldestPressure`
- `range24 = maxPressure - minPressure`
- `max3hSwing = largest absolute pressure move across any rolling 3-hour interval`
- `directionChanges = number of sign changes in the pressure slope across the series`

If the API only provides a smaller lookback, scale the same logic down to the best available recent history and mark reliability down one level if pressure history is sparse.

### Classification precedence
Evaluate in this order:

#### 1. volatile
Assign `volatile` if **any** of the following are true:
- `range24 >= 5.0 hPa`
- `max3hSwing >= 2.0 hPa`
- `directionChanges >= 2` **and** `range24 >= 3.5 hPa`

Score: `-2`

#### 2. falling
Assign `falling` if:
- not already `volatile`
- and `delta24 <= -1.8 hPa`

Score: `-1`

#### 3. stable_positive
Assign `stable_positive` if:
- not already `volatile`
- and `delta24 >= +1.2 hPa`
- and `range24 < 5.0 hPa`

Score: `+1`

#### 4. stable_neutral
Assign `stable_neutral` if:
- not already matched above
- and `delta24` is between `-1.7 hPa` and `+1.1 hPa`

Score: `0`

### Fallback rule when only 2 pressure points exist
If only two recent pressure readings exist:
- `delta <= -1.8 hPa` → `falling`
- `delta >= +1.2 hPa` → `stable_positive`
- otherwise → `stable_neutral`

Do **not** assign `volatile` without at least 3 readings.

### Important rule
The engine should prefer simple regime interpretation over overfitted meteorology.

---

## Wind condition

### Labels
- `light`
- `moderate`
- `strong`
- `extreme`

### Thresholds
| label | mph |
|---|---|
| light | 0–7 |
| moderate | 8–15 |
| strong | 16–24 |
| extreme | 25+ |

### Context scoring
#### Freshwater Lake/Pond
- light: `0`
- moderate: `+1`
- strong: `-1`
- extreme: `-2`

#### Freshwater River
- light: `0`
- moderate: `0`
- strong: `-1`
- extreme: `-2`

#### Coastal
- light: `0`
- moderate: `+1`
- strong: `-1`
- extreme: `-2`

### Note
This keeps moderate wind from being uniformly bad. It may provide positive movement/chop in some contexts without overcomplicating direction.

---

## Light / cloud condition

### Labels
- `bright`
- `mixed`
- `low_light`

### Thresholds (cloud cover)
| label | cloud cover |
|---|---|
| bright | 0–25% |
| mixed | 26–69% |
| low_light | 70–100% |

### Context scoring
#### Freshwater Lake/Pond
- bright: `-1`
- mixed: `0`
- low_light: `+1`

#### Freshwater River
- bright: `-1`
- mixed: `0`
- low_light: `+1`

#### Coastal
- bright: `0`
- mixed: `0`
- low_light: `+1`

### Important note
This variable is intentionally broad and should not become a sunrise/sunset proxy. Daypart logic handles broad timing notes separately.

---

## Precipitation disruption

### Applies to
- `freshwater_lake_pond`
- `coastal`

### Labels
- `dry_stable`
- `recent_rain`
- `active_disruption`

### Inputs
- active precipitation rate now (`precipRateNowInPerHr`)
- precip_24h_in
- precip_72h_in

### Classification precedence
Evaluate in this order.

#### active_disruption
Assign `active_disruption` if **any** of the following are true:
- `precipRateNowInPerHr >= 0.10`
- `precip_24h_in >= 0.75`
- `precip_72h_in >= 1.50`

Score: `-2`

#### recent_rain
Assign `recent_rain` if not already `active_disruption` and **any** of the following are true:
- `0.02 <= precipRateNowInPerHr < 0.10`
- `0.10 <= precip_24h_in < 0.75`
- `0.35 <= precip_72h_in < 1.50`

Score: `-1`

#### dry_stable
Assign `dry_stable` otherwise.

Score: `0`

### Implementation rule
Keep this broad. Do not convert lake/coastal precipitation into a detailed runoff model.

---

## River runoff / flow disruption

### Applies to
- `freshwater_river`

### Why
This is the main variable that makes river logic meaningfully different from lake logic.

### Labels
- `stable`
- `slightly_elevated`
- `elevated`
- `blown_out`

### Inputs
- precip_24h_in
- precip_72h_in
- precip_7d_in

### Scoring
- stable: `+1`
- slightly_elevated: `0`
- elevated: `-1`
- blown_out: `-2`

### Starter regional runoff sensitivity classes

#### low sensitivity regions
Use where rivers often handle moderate rain a bit better:
- mountain_west

#### medium sensitivity regions
- northeast
- southeast_atlantic
- florida
- great_lakes_upper_midwest
- south_central
- pacific_coast

#### high sensitivity regions
- gulf_coast
- midwest_interior
- southwest

### Starter thresholds by sensitivity class

#### low sensitivity
- stable: 24h < 0.30 and 72h < 0.70 and 7d < 1.50
- slightly_elevated: 24h < 0.60 and 72h < 1.20 and 7d < 2.50
- elevated: 24h < 1.00 and 72h < 2.00 and 7d < 4.00
- blown_out: otherwise

#### medium sensitivity
- stable: 24h < 0.20 and 72h < 0.50 and 7d < 1.20
- slightly_elevated: 24h < 0.45 and 72h < 1.00 and 7d < 2.20
- elevated: 24h < 0.80 and 72h < 1.75 and 7d < 3.50
- blown_out: otherwise

#### high sensitivity
- stable: 24h < 0.15 and 72h < 0.40 and 7d < 1.00
- slightly_elevated: 24h < 0.35 and 72h < 0.80 and 7d < 1.80
- elevated: 24h < 0.60 and 72h < 1.40 and 7d < 3.00
- blown_out: otherwise

### Important rule
This is a precipitation-based river proxy, not a true discharge model.

---

## Tide / current movement

### Applies to
- `coastal`

### Labels
- `slack`
- `moving`
- `strong_moving`
- `too_strong`

### Scores
- slack: `-1`
- moving: `+1`
- strong_moving: `+2`
- too_strong: `-1`

### Raw-data priority order
Use the highest-quality available source in this order:

1. `currentSpeedKnots` time series
2. tide-height time series with timestamps
3. tide stage label only (fallback)

### A. If current speed in knots is available
Classify using the strongest representative current speed during the report day:

- slack: `< 0.50 kt`
- moving: `0.50–1.49 kt`
- strong_moving: `1.50–2.50 kt`
- too_strong: `> 2.50 kt`

### B. If only tide-height time series is available
Approximate movement using the largest absolute tide-height change over any rolling 3-hour period.

Call this value `max3hTideDeltaFt`.

- slack: `< 0.30 ft`
- moving: `0.30–0.99 ft`
- strong_moving: `1.00–1.80 ft`
- too_strong: `> 1.80 ft`

### C. If only tide stage label is available
Use this fallback mapping:

- slack / high slack / low slack → `slack`
- incoming / outgoing / rising / falling → `moving`
- spring / strong / peak flow → `strong_moving`

Do **not** assign `too_strong` from stage label alone.

### Missing-data rule
If current/tide data is unavailable:
- omit the variable
- reweight the remaining coastal variables
- lower reliability
- do not narrate tide as if it was known

---

## Solunar use

### Rule
Solunar does not change the score.

### Allowed use
It may slightly influence the broad daypart note when:
- data exists
- reliability is not low
- the note remains broad, not exact

Allowed example:
- Feeding windows may line up better early.

Not allowed:
- Exact solunar score bonus
- Solunar-driven hourly confidence claims

---

## Dynamic missing-variable handling

### Required behavior
If a scored variable cannot be fetched or normalized successfully:
1. omit that variable from scoring
2. remove its configured weight from the active weight set
3. renormalize the remaining active weights so total active weight returns to `100`
4. lower reliability if the missing variable materially affects confidence
5. prevent narration from referencing the missing variable as known fact

### Minimum scored-variable rule
Always return a report.

However:
- if fewer than `3` scored variables remain active, force `low` reliability
- if `3` or `4` scored variables remain active, allow at most `medium` reliability
- full `high` reliability requires all core variables for that context except one optional omission

### Core-variable expectations by context
#### Freshwater Lake/Pond
Core variables:
- temperature
- pressure
- wind
- light_cloud
- precipitation

#### Freshwater River
Core variables:
- temperature
- pressure
- wind
- light_cloud
- runoff

#### Coastal
Core variables:
- temperature
- pressure
- wind
- light_cloud
- tide_current
- precipitation

---

## Contribution math

Drivers and suppressors must be selected from weighted contributions, not from freeform heuristics.

### For each active variable
Compute:

```ts
weightedContribution = normalizedWeight * variableScore
```

Where:
- `normalizedWeight` is the active post-reweight percentage
- `variableScore` is in `[-2, -1, 0, +1, +2]`

### Driver selection
- sort active variables by descending positive weighted contribution
- show up to `2`
- do not show zero-contribution variables

### Suppressor selection
- sort active variables by ascending negative weighted contribution
- show up to `2`
- do not show zero-contribution variables

### Tie-break rule
If two contributions are equal, prefer the variable with the higher configured base weight for that context.

---

## Score normalization

Because contexts have different variable counts, do **not** map raw weighted sums directly to the visible score.

### Step 1 — compute weighted raw sum

```ts
rawSum = Σ(normalizedWeight * variableScore)
```

### Step 2 — compute maximum possible raw sum for active variables

Since each active variable can score at most `+2`:

```ts
maxPossible = Σ(normalizedWeight * 2)
minPossible = Σ(normalizedWeight * -2)
```

With weights normalized to 100, `maxPossible = 200` and `minPossible = -200`.

### Step 3 — map to 0–100

```ts
score0to100 = ((rawSum - minPossible) / (maxPossible - minPossible)) * 100
```

Equivalent simplified form when active weights sum to 100:

```ts
score0to100 = ((rawSum + 200) / 400) * 100
```

Round to nearest whole number for display.

### Practical note
This keeps lake, river, and coastal scores comparable even though coastal has an extra scored variable.

---

## Band mapping

Map final normalized score to:

- `Poor`: `< 40`
- `Fair`: `40–57`
- `Good`: `58–74`
- `Excellent`: `75+`

These are canonical V1 thresholds.
