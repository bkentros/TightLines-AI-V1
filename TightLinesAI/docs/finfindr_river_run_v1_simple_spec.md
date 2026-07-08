# FinFindr River Run - Simple V1 Spec

**Feature:** River Run  
**Product:** FinFindr  
**V1 region:** Great Lakes tributaries  
**V1 goal:** A simple, deterministic, plug-and-play run conditions engine for migratory species.  
**Core principle:** The engine never guesses. It classifies known river, weather, date, and admin-configured run data into clear user-facing signals.

This spec replaces the larger V1 concept with a smaller build target that can be completed quickly, tested carefully, and expanded one river/run at a time.

---

## 1. Product Summary

River Run helps anglers understand five things for a supported migratory river run:

1. **Push Score** - Are current/recent conditions likely to trigger fresh movement?
2. **Fishability Score** - Is the river currently in fishable shape?
3. **Fish In River Score** - Based on researched run dates, should fish seasonally be present?
4. **Run Stage** - Where is the run in its researched calendar window?
5. **Schedule** - Does the run appear ahead, on schedule, behind, or uncertain?

River Run does **not** predict catches, fish counts, exact locations, or guaranteed movement. It is a run conditions and timing tool.

Each primitive must show:

- A score or label
- A short explanation
- A practical angler tip
- The data basis when relevant

Example:

```txt
Push Score: Strong
Recent rain, rising flow, and cooler temperatures are lining up for this fall Chinook run.
Cover lower-river travel lanes while the river stays fishable.
```

### 1.1 Primitive Time Horizons

Each primitive has a fixed time horizon. This prevents the product from feeling twitchy and prevents the engine from using the wrong kind of data for a decision.

| Primitive | Time horizon | Update behavior | Reason |
|---|---|---|---|
| Push Score | Current snapshot + last 24h/48h/72h | Can change on each same-day refresh | Movement triggers are recent weather/flow events |
| Fishability Score | Current gauge + last 24h trend | Can change on each same-day refresh | River shape can change quickly |
| Fish In River Score | Date curve + 7-day Schedule nudge | Stable to slow-moving | Seasonal presence should not twitch hourly |
| Run Stage | Date only | Changes only when date crosses stage boundary | Stage is researched calendar context |
| Schedule | Weighted rolling 7-day progression | Slow-moving; one-day events should rarely flip it | Schedule describes run progression, not today's trigger |

Daily copy must make disagreements understandable. Example: "Today's push improved, but the 7-day schedule still looks behind."

---

## 2. V1 Scope

### 2.1 In Scope

| Area | V1 decision |
|---|---|
| Region | Great Lakes tributaries only |
| Species | Chinook salmon, coho salmon, steelhead, Skamania, lake-run brown trout, Atlantic salmon |
| River support | Only admin-configured rivers/runs are visible |
| Admin tooling | No dashboard; profiles live in version-controlled config |
| Gauge source | USGS or equivalent official gauge required |
| Gauge history | 2 years minimum, 5 years preferred |
| Weather source | Existing FinFindr/Open-Meteo weather snapshot |
| Scores | Push, Fishability, Fish In River |
| Labels | Run Stage, Schedule |
| Stability / refresh | Daily progression snapshot; optional 8-hour condition refreshes for Push/Fishability |
| User copy | Deterministic templates, no LLM |
| Forecast | V1 scores use current/observed snapshot only; forecast can appear only as a note |

### 2.2 Out of Scope

- Overall River Run Score
- Best Call
- Travel confidence
- Push notifications
- 10-day outlook
- Admin dashboard
- User-submitted river requests in-app
- Automatic river onboarding
- Automatic gauge substitution
- Exact spot/pool recommendations
- Fish-count or catch-probability claims

---

## 3. Required User Model

Users browse only supported runs:

```txt
State
  -> River
    -> Species/run
```

Example:

```txt
Michigan
  -> Pere Marquette River
    -> Fall Chinook
    -> Fall Steelhead
    -> Spring Steelhead
```

Each card is a distinct configured run. Pere Marquette fall Chinook and Pere Marquette fall steelhead are separate profiles because their start, peak, end, and behavior can be different even when they share the same river and gauge.

Unsupported rivers and unsupported species/runs are hidden completely.

---

## 4. The Five Primitives

### 4.1 Push Score

**Question:** Are current/recent conditions likely to trigger fresh movement?

Push Score is primarily weather, flow, and temperature driven. It is behavior-profile aware. A fall Chinook run and spring steelhead run should not interpret the same weather the same way.

Inputs:

- Recent rain: 24h, 48h, 72h
- Current flow/height percentile or admin band
- Flow/height trend: rising, stable, falling
- Water temperature trend when available
- Air temperature trend when water temperature is unavailable
- Run behavior profile
- Gauge freshness

Push Score labels:

| Score | Label |
|---:|---|
| 0-24 | Weak |
| 25-49 | Limited |
| 50-69 | Possible |
| 70-84 | Strong |
| 85-100 | Very strong |

Important rules:

- Push Score can be elevated before the normal start date, but copy must describe it as an early signal.
- Push Score must not imply fish are definitely present.
- Push Score must be capped if the gauge is stale or missing required data.
- Heavy rain can increase Push Score while Fishability decreases. These are separate primitives.

### 4.2 Fishability Score

**Question:** Is the river in fishable shape right now?

Fishability Score is mostly gauge driven. It should work even outside the run window, because river shape is separate from fish presence.

Inputs:

- Current flow or gage height
- Default percentile bands or config override bands
- Flow/height stability
- Heavy recent rain as stain/dirty-water proxy
- Gauge freshness
- Water temperature safety where relevant

Fishability Score labels:

| Score | Label |
|---:|---|
| 0-24 | Poor |
| 25-49 | Tough |
| 50-69 | Fishable |
| 70-84 | Good |
| 85-100 | Excellent |

Important rules:

- Fishability should not care whether the run has started.
- A high Push Score and low Fishability Score is valid.
- Fishability should be capped low when current flow/height is in the blown-out band.
- If the river is very low, Fishability should not be excellent even if the water is clear/stable.

### 4.3 Fish In River Score

**Question:** Based on researched run timing, should meaningful numbers of fish seasonally be present?

Fish In River Score is primarily date based, using admin-entered start, peak, and end dates. The 7-day Schedule can nudge the score when the run appears Ahead or Behind, but the engine must not pretend to know actual fish counts.

Inputs:

- Admin start date
- Admin peak date
- Admin end date
- Early window, default 14 days before start
- Late window, default 14 days after end
- Run strength, 1-5
- Schedule status
- 7-day Schedule as a condition nudge

Fish In River Score labels:

| Score | Label |
|---:|---|
| 0-19 | Very unlikely |
| 20-39 | A few possible |
| 40-59 | Building presence |
| 60-79 | Likely present |
| 80-100 | Peak presence |

Important rules:

- Dates are the backbone.
- Schedule may nudge Fish In River Score up or down.
- A pre-run date with Ahead schedule can move from "Very unlikely" to "A few possible."
- A peak date with Behind schedule should not collapse to zero; the calendar still matters.
- Copy must avoid fish-count claims.

### 4.4 Run Stage

**Question:** Where are we in the researched run window?

Run Stage is the only primitive that directly owns before/after date behavior. It is primarily calendar based.

Run Stage labels:

| Stage | Meaning |
|---|---|
| Pre-run | Before the researched start date |
| Beginning | First part of the run window |
| Building | Run is progressing toward peak |
| Peak | Near the researched peak window |
| Tapering | Past peak but still inside active window |
| Ending | Late in the normal run window |
| Post-run | After the researched end date |

Default stage windows:

```txt
Pre-run:    before start
Beginning:  start through first 20% of start->peak span
Building:   after beginning through peak window
Peak:       peak +/- configured peakWindowDays, default 5
Tapering:   after peak window through 75% of peak->end span
Ending:     final 25% of peak->end span
Post-run:   after end
```

Exact stage math:

1. Convert `start`, `peak`, and `end` from `MM-DD` into local dates for the active run year.
2. If a run crosses New Year, allow `end` to fall in the next calendar year. Example: `start = 11-15`, `peak = 02-01`, `end = 04-15`.
3. Determine the active run year by choosing the start/peak/end window closest to the snapshot date.
4. Let `daysStartToPeak = max(1, daysBetween(start, peak))`.
5. Let `daysPeakToEnd = max(1, daysBetween(peak, end))`.
6. Let `beginningEnd = start + ceil(daysStartToPeak * 0.20)`.
7. Let `peakStart = peak - peakWindowDays`.
8. Let `peakEnd = peak + peakWindowDays`.
9. Let `taperingEnd = peakEnd + ceil(daysBetween(peakEnd, end) * 0.75)`.

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

Important rules:

- Run Stage should be stable and easy to explain.
- Weather can influence Schedule, not the core stage label.
- Stage copy can mention likely river section strategy, but must avoid exact locations.

### 4.5 Schedule

**Question:** Does the run appear ahead, on schedule, behind, or uncertain?

Schedule is a slower-moving 7-day progression read. It interprets whether the last week of conditions has likely accelerated, supported, delayed, or muddied the run relative to the researched date window.

Schedule is not the same as Push Score:

- **Push Score** answers: "Are today's current/recent conditions triggering movement?"
- **Schedule** answers: "Has the last week made this run look early, normal, delayed, or unclear?"

Schedule labels:

| Schedule | Meaning |
|---|---|
| Ahead | Conditions have been favorable enough to suggest earlier-than-normal movement |
| On schedule | Conditions and dates line up normally |
| Behind | Conditions have been unfavorable enough to suggest delayed or limited movement |
| Uncertain | Data is missing, conflicting, or too far outside the useful window |

Important rules:

- Schedule uses a rolling 7-day lookback, weighted toward the most recent 3 days.
- Schedule can show Ahead up to 14 days before start.
- Far before the early window, Schedule should be Uncertain or hidden.
- Far after the late window, Schedule should be Uncertain or Post-run context only.
- Schedule must be behavior-profile aware.
- Schedule and Run Stage should be displayed together.
- Schedule can change over the season, but it should change more slowly than Push Score.

Example:

```txt
Stage: Pre-run
Schedule: Ahead

It is still before the normal run window, but recent conditions have favored early movement.
Some fish may be trickling in. Cover lower-river water and staging areas before assuming the main run has started.
```

Example of non-conflicting change:

```txt
Day 1:
Stage: Pre-run
Schedule: Ahead
Push Score: Strong

The last week has favored early movement, and today's conditions still support a push.

Day 8:
Stage: Building
Schedule: On schedule
Push Score: Limited

The run is now inside its normal window. The broader schedule looks normal, but today's push signal is weaker.
```

---

## 5. Behavior Profiles

The engine must not hardcode all logic by species. Instead, each configured run chooses a behavior profile.

A behavior profile defines how weather, flow, and temperature should be interpreted for that run.

### 5.1 V1 Behavior Profiles

| Profile | Typical runs | Favorable pattern |
|---|---|---|
| `fall_cooling_rain_pulse` | Chinook, coho, lake-run browns, Atlantic salmon, some fall steelhead | Rain, rising flow, cooling air/water |
| `spring_warming_flow_pulse` | Spring steelhead, spring Atlantics where applicable | Warming trend, fishable flow, modest rise |
| `winter_steelhead_window` | Winter steelhead | Rain/flow bump with cool but fishable/stable water |
| `summer_skamania_pulse` | Skamania | Rain/flow pulse, cooler breaks, temperature safety |
| `stable_cool_holding` | Holding fish after primary push | Stable fishable flow, cool water, no blowout |

The same species can use different profiles in different seasons. Example:

```txt
Steelhead - Fall Entry: fall_cooling_rain_pulse
Steelhead - Winter: winter_steelhead_window
Steelhead - Spring: spring_warming_flow_pulse
Skamania - Summer: summer_skamania_pulse
```

### 5.2 Favorability Levels

Each profile classifies current/recent conditions into:

| Level | Meaning |
|---|---|
| Very favorable | Multiple major signals align for this run profile |
| Favorable | At least one major signal is strong, or multiple minor signals align |
| Neutral | Conditions are not strongly helping or hurting movement |
| Unfavorable | Conditions are working against this run profile |
| Very unfavorable | Strong negative signals or unsafe/unfishable river conditions |

For fall cooling runs, rain alone, cooling alone, or a meaningful flow rise alone can be favorable. The combination of rain + rising flow + cooling is very favorable.

### 5.2.1 Numeric Favorability Model

Each behavior profile scores three movement signals:

- Rain signal
- Flow/height signal
- Temperature signal

Each signal returns one of these values:

| Signal value | Meaning |
|---:|---|
| +2 | Strongly favorable |
| +1 | Favorable |
| 0 | Neutral |
| -1 | Unfavorable |
| -2 | Strongly unfavorable |

The engine sums the three signal values into `favorabilityIndex`.

| Favorability index | Level |
|---:|---|
| 4 to 6 | Very favorable |
| 2 to 3 | Favorable |
| -1 to 1 | Neutral |
| -3 to -2 | Unfavorable |
| -6 to -4 | Very unfavorable |

If signals conflict strongly, use the numeric sum. Example: strong rain `+2`, meaningful rise `+2`, strong warming `-2` gives `+2`, which is Favorable, not Very favorable.

Critical guardrails:

- If fishability band is `blown_out`, Push can remain elevated but copy must warn that Fishability is poor.
- If gauge is stale, cap Push Score at 55.
- If required gauge data is unavailable, Push Score is unavailable and Schedule is Uncertain.
- If temperature source is `unavailable`, temperature signal is `0` and copy must not mention temperature.

### 5.2.2 Behavior Profile Signal Tables

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
| Meaningful rise | +2 if fishable, +0 if high/very-high |
| Rising | +1 |
| Stable fishable flow | +1 |
| Falling with low/very-low band | -1 |
| Strong warming | +2 |
| Warming | +1 |
| Neutral temp | 0 |
| Cooling | -1 |
| Strong cooling | -2 |

`winter_steelhead_window`

| Raw signal | Value |
|---|---:|
| Strong/heavy rain | +1 if not blown out |
| Meaningful rain | +1 |
| Dry/stale | -1 |
| Meaningful rise | +2 if fishable, +0 if high/very-high |
| Rising | +1 |
| Stable fishable flow | +1 |
| Sharp rise into high/very-high | -1 |
| Stable cool/cold water | +1 |
| Cooling | 0 |
| Warming | +1 if water remains cool/fishable |
| Strong warming | 0 by default; -2 if measured water temp exceeds `temperatureRules.tooWarmF` |

`summer_skamania_pulse`

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
| Unsafe warm water, if configured | -2 and cap Push Score at 50 |

`stable_cool_holding`

| Raw signal | Value |
|---|---:|
| Meaningful/strong rain | 0 or -1 if it destabilizes fishability |
| Light rain | 0 |
| Dry/stale | 0 |
| Stable fishable flow | +2 |
| Rising/falling within fishable band | 0 |
| Sharp rise or blown out | -2 |
| Stable cool water | +1 |
| Cooling/warming | 0 |

### 5.2.3 Optional Absolute Temperature Rules

Trend is the default temperature input. Absolute water temperature rules are optional admin config because not every run has reliable water temperature data.

Optional fields:

```ts
temperatureRules?: {
  tooColdF?: number;
  idealMinF?: number;
  idealMaxF?: number;
  tooWarmF?: number;
}
```

If measured water temperature is available:

- `tooWarmF` can cap Push Score and Fishability Score for temperature-sensitive runs.
- `tooColdF` can reduce Push Score for spring warming runs.
- Air temperature proxy must not trigger absolute water-temperature caps.

### 5.3 Defining Temperature Trends

Temperature trends use normalized daily values and recent lookback windows. The engine must not compare random hourly highs/lows directly, because one noisy reading can falsely create a warming or cooling signal.

Preferred source order:

1. Same gauge water temperature
2. Approved nearby water temperature gauge
3. Approved adjusted reference gauge
4. Air temperature proxy
5. Unavailable

Normalized daily values:

- **Measured water temperature:** use daily median when enough readings exist; otherwise use the reading closest to the configured snapshot time.
- **Air proxy:** use overnight low for cooling/warming trend, not daytime high.
- **Adjusted reference gauge:** apply `adjustmentF` before computing trend.
- **Missing day:** skip that day for trend calculation.

Minimum data for measured water-temperature trend:

- At least 2 usable daily values in the last 72h.
- If fewer than 2 usable values exist, temperature trend is `neutral_missing` and contributes `0`.

Minimum data for air-proxy trend:

- At least 2 usable overnight lows in the last 72h.
- If fewer than 2 usable values exist, temperature trend is `neutral_missing` and contributes `0`.

Definitions:

| Trend | Water temp definition | Air proxy definition |
|---|---|---|
| Strong cooling | Down >= 5 F over 72h or down >= 3 F over 24h | Overnight lows down >= 8 F over 72h |
| Cooling | Down 2-4.9 F over 72h or down 1.5-2.9 F over 24h | Overnight lows down 4-7.9 F over 72h |
| Neutral | Change within +/- 2 F over 72h | Overnight lows within +/- 4 F over 72h |
| Warming | Up 2-4.9 F over 72h or up 1.5-2.9 F over 24h | Overnight lows up 4-7.9 F over 72h |
| Strong warming | Up >= 5 F over 72h or up >= 3 F over 24h | Overnight lows up >= 8 F over 72h |
| Neutral missing | Not enough usable data | Not enough usable data |

Air proxy rules:

- Air proxy can influence Push Score and Schedule.
- Air proxy must use cautious copy.
- Air proxy must never claim actual water temperature.
- Air proxy effects should be weaker than measured water temperature.
- `neutral_missing` contributes `0` to favorability and must add a missing-temperature reason code.

### 5.4 Defining Rain Signals

Rain uses observed precipitation from the active condition refresh and recent lookback windows.

Default thresholds:

| Signal | Definition |
|---|---|
| Dry/stale | < 0.10 in over 72h |
| Light rain | 0.10-0.34 in over 48h |
| Meaningful rain | 0.35-0.74 in over 48h |
| Strong rain | 0.75-1.49 in over 48h |
| Heavy rain | >= 1.50 in over 48h |

Admin can override thresholds per river/run.

### 5.5 Defining Flow/Height Signals

Flow/height uses the configured primary metric.

Definitions:

| Signal | Definition |
|---|---|
| Falling | Current metric down >= 10% over 24h |
| Stable | Current metric within +/- 10% over 24h |
| Rising | Current metric up 10-24% over 24h |
| Meaningful rise | Current metric up 25-49% over 24h |
| Sharp rise | Current metric up >= 50% over 24h |

Admin can override rise thresholds per river/run.

---

## 6. Fishability Bands

V1 supports two ways to define fishability bands.

### 6.1 Default Percentile Bands

If no config override is provided, the engine builds gauge baselines from historical daily values.

Minimum history:

- 2 years required for beta support
- 5 years preferred for full support

Default bands:

| Band | Percentile |
|---|---|
| Very low | below p10 |
| Low | p10-p25 |
| Normal/fishable | p25-p70 |
| High/fishable | p70-p85 |
| Very high | p85-p90 |
| Blown out | above p90 |

Percentiles are computed per day-of-year using a rolling window, default +/- 14 days.

### 6.2 Config Override Bands

Config overrides are preferred when local knowledge is available.

In V1, "admin override" means a version-controlled config change made by the owner/operator or a coding agent working with the owner. It does **not** mean an in-app admin dashboard or live user-facing tuning control.

Example:

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

Config override rules:

- Overrides apply to the river/run profile.
- If the same river has multiple runs, they may share bands or define different bands.
- The engine must expose whether bands were `percentile_default` or `admin_override`.

---

## 7. Admin Config Model

V1 river/run registration is config-only. No admin dashboard is required.

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

  // Weather can be sampled at a watershed-representative point instead of the mouth.
  weatherLat?: number;
  weatherLon?: number;

  gauge: {
    provider: 'USGS' | 'OTHER_OFFICIAL';
    siteId: string;
    name: string;
    primaryMetric: 'flow_cfs' | 'gage_height_ft';
    secondaryMetric?: 'flow_cfs' | 'gage_height_ft';
    historyYearsAvailable?: number;
    maxAgeHours?: number; // default 6
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
    | 'winter_steelhead_window'
    | 'summer_skamania_pulse'
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

### 7.3 Config Validation

The engine must validate river/run config before exposing a run through `GET /river-run/rivers`.

Invalid configs are hidden from users and reported in logs/admin diagnostics.

Required validation:

- River has `riverId`, `displayName`, `state`, `timezone`, mouth coordinates, and gauge config.
- Weather point uses `weatherLat/weatherLon` when present; otherwise falls back to `mouthLat/mouthLon`.
- Gauge provider and site ID are present.
- Gauge `reachQuality` is `good` or `acceptable`. `limited` gauges are not V1-public unless explicitly marked beta by owner decision.
- Gauge has at least 2 years of usable history.
- Gauge has the configured primary metric.
- Run has supported species, season, run type, and behavior profile.
- Run has valid `start`, `peak`, and `end` dates.
- Date order is valid, including cross-year runs.
- Run strength is 1-5.
- If no `fishabilityBands` override exists, historical percentile baselines must exist.
- Temperature source config is valid. `air_temp_proxy` and `unavailable` are allowed, but copy must stay cautious.

Unsupported today behavior:

- Missing current gauge data: do not score Push or Fishability; return `supportedToday: false`.
- Stale gauge beyond configured `maxAgeHours`: score only with stale caps and stale copy, or return unavailable if older than 24h.
- Missing weather data: Push uses available gauge signals and missing weather reason codes; if two or more non-gauge inputs are missing, Schedule is `Uncertain`.
- Missing water temperature: temperature signal is `neutral_missing` unless air proxy is configured.

The engine must prefer `Uncertain` or unavailable over an invented answer.

### 7.4 Example

```ts
export const pereMarquette: RiverProfile = {
  riverId: 'pere_marquette',
  displayName: 'Pere Marquette River',
  state: 'MI',
  region: 'great_lakes',
  timezone: 'America/Detroit',
  mouthLat: 43.945,
  mouthLon: -86.279,
  weatherLat: 43.955,
  weatherLon: -86.250,
  gauge: {
    provider: 'USGS',
    siteId: '04122500',
    name: 'Pere Marquette River at Scottville',
    primaryMetric: 'flow_cfs',
    secondaryMetric: 'gage_height_ft',
    reachQuality: 'good',
    reachNotes: 'Representative lower-river gauge for V1 run conditions.',
  },
  supportStatus: 'beta',
  gaugeLimitationCopy:
    'Based on the USGS gauge at Scottville. Conditions can vary by reach.',
};

export const pmFallChinook: RiverRunProfile = {
  runId: 'pere_marquette_fall_chinook',
  riverId: 'pere_marquette',
  displayName: 'Fall Chinook',
  species: 'chinook_salmon',
  season: 'fall',
  runType: 'fall_spawn',
  behaviorProfile: 'fall_cooling_rain_pulse',
  runWindow: {
    start: '08-25',
    peak: '09-20',
    end: '10-15',
  },
  runStrength: 5,
  waterTemperatureSource: {
    type: 'air_temp_proxy',
    provider: 'OpenMeteo',
    notes: 'Fallback only until an approved water temperature source is configured.',
  },
};
```

---

## 8. Snapshot Contract

River Run should be stable where stability matters and fresh where freshness matters. Run Stage, Fish In River Score, and Schedule must not twitch throughout the day. Push Score and Fishability Score may refresh because river conditions can change quickly.

### 8.1 Snapshot Timing

For each river/run, create one daily progression snapshot keyed by:

```txt
riverId + runId + localDate
```

The progression snapshot should be generated at or shortly after local midnight in the river timezone. If scheduled generation fails, the first request of the day can generate it.

The progression snapshot owns:

- Run Stage
- Schedule
- Fish In River Score
- 7-day favorability summaries

V1 may also create same-day condition refreshes every 8 hours:

```txt
riverId + runId + localDate + refreshSlot
```

Allowed refresh slots:

```txt
00:00 local
08:00 local
16:00 local
```

Same-day condition refreshes own:

- Push Score
- Fishability Score
- Gauge value/trend
- Rain totals
- Temperature trend if new data is available

Important: an 8-hour refresh must not recalculate Run Stage, Schedule, or Fish In River Score except by reading the existing daily progression snapshot.

### 8.2 Snapshot Inputs

The progression snapshot stores:

- Current/latest gauge reading available at snapshot time
- Prior gauge readings needed for 24h/48h/72h trend
- Prior daily favorability summaries needed for the 7-day Schedule
- Observed precipitation totals for 24h/48h/72h
- Air temp and overnight-low trend
- Water temp reading/trend when available
- Historical percentile baseline for the day
- Config version
- Engine version

Each condition refresh stores:

- Gauge value and observed timestamp
- Flow/height band and trend
- Rain totals available at refresh time
- Temperature trend source and value when available
- Push Score output
- Fishability Score output
- Reason codes
- Data freshness metadata

### 8.3 Forecast Use

Forecast is not used to score the five V1 primitives.

Forecast may appear as a secondary note only:

```txt
Rain in the next 48 hours may change the push signal.
```

Forecast notes must be visually secondary and must not alter the current-day scores.

---

## 9. Scoring Logic

All scoring is deterministic. Same snapshot + same config = same output.

### 9.1 Push Score

Push Score is computed from favorability factors.

Use this deterministic conversion:

| Favorability level | Base Push Score |
|---|---:|
| Very unfavorable | 10 |
| Unfavorable | 25 |
| Neutral | 45 |
| Favorable | 68 |
| Very favorable | 86 |

Then apply small deterministic modifiers:

```txt
+5 if current fishability band is ideal/normal-fishable
-10 if current fishability band is very-high
-15 if current fishability band is blown-out
-10 if gauge observedAt is older than gauge.maxAgeHours, default 6
cap at 55 if gauge is stale
cap at 50 if configured unsafe warm water is present
```

The final Push Score is clamped to 0-100.

Profile-specific signal tables are defined in section 5.2.2. Do not invent extra behavior during implementation.

If a raw signal is not available, use `0` for that signal and add a reason code for missing data. If gauge data is missing entirely, the run is unsupported for that day.

### 9.2 Fishability Score

Fishability Score is computed from river shape.

Default weights:

| Factor | Weight |
|---|---:|
| Current flow/height band | 55 |
| Stability/trend | 25 |
| Recent heavy rain/stain proxy | 15 |
| Gauge freshness | 5 |

Band scoring:

| Band | Base score |
|---|---:|
| Very low | 25 |
| Low | 45 |
| Normal/fishable | 75 |
| Ideal | 90 |
| High/fishable | 60 |
| Very high | 35 |
| Blown out | 15 |

Caps:

```txt
if blown_out: fishability <= 25
if sharp_rise and high_or_above: fishability <= 40
if very_low: fishability <= 45
if gauge_stale: fishability <= 55
```

### 9.3 Fish In River Score

Fish In River Score starts from a date curve, then receives a small schedule nudge.

Base date curve uses linear interpolation inside each date segment:

| Position | Base score |
|---|---:|
| More than earlyWindowDays before start | 5 |
| Early window before start | 10 at window start -> 25 day before start |
| Start date | 35 |
| Beginning | 40 -> 55 |
| Building | 55 -> 75 |
| Peak window | 80 -> 100 at peak day -> 80 |
| Tapering | 80 -> 60 |
| Ending | 60 -> 35 |
| Late window after end | 30 -> 10 |
| More than lateWindowDays after end | 5 |

Use the same active run year and cross-year date handling as Run Stage.

Run strength nudge:

```txt
runStrength 1-2: -5 max from active-window score
runStrength 3: no nudge
runStrength 4-5: +5 max during active window
```

Schedule nudge:

```txt
Ahead: +10 max, only in early/pre-run/beginning/building contexts
Behind: -10 max, only before peak or during building contexts
Uncertain: no positive nudge
On schedule: no nudge
```

Important:

- The nudge must never move a score across into unrealistic territory.
- Pre-run + Ahead can mean "a few possible," not "peak presence."
- Post-run should remain low unless a configured late window exists.
- Final caps:
  - Pre-run: max 39, even if Ahead.
  - Beginning: max 60.
  - Post-run: max 25.
  - More than lateWindowDays after end: max 10.

### 9.4 Run Stage

Run Stage is derived from the configured dates only.

Weather does not change the stage. This keeps the engine predictable.

### 9.5 Schedule

Schedule is derived from a rolling 7-day behavior-profile favorability index.

For each of the last 7 local dates, compute that day's `favorabilityIndex` using the same behavior-profile signal tables from section 5.2.2. The current snapshot date is day 0.

Use these weights:

| Day | Weight |
|---:|---:|
| 0 today | 1.50 |
| -1 | 1.35 |
| -2 | 1.20 |
| -3 | 1.00 |
| -4 | 0.80 |
| -5 | 0.65 |
| -6 | 0.50 |

Compute:

```txt
progressionIndex = weightedAverage(favorabilityIndex[-6..0])
```

Progression levels:

| Progression index | 7-day level |
|---:|---|
| >= 2.25 | Strongly favorable week |
| 1.00 to 2.24 | Favorable week |
| -0.99 to 0.99 | Neutral/mixed week |
| -2.24 to -1.00 | Unfavorable week |
| <= -2.25 | Strongly unfavorable week |

### 9.5.1 Schedule Smoothing

Schedule should not flip because `progressionIndex` barely crosses a threshold.

After calculating the new candidate Schedule, compare it to the previous local day's Schedule:

```txt
if previousSchedule is missing:
  use candidateSchedule
else if candidateSchedule equals previousSchedule:
  keep candidateSchedule
else if progressionIndex crossed the relevant threshold by at least 0.35:
  use candidateSchedule
else if candidateSchedule has appeared for 2 consecutive daily progression snapshots:
  use candidateSchedule
else:
  keep previousSchedule
```

Never smooth into a less conservative state when data is missing. Missing or invalid data may immediately change Schedule to `Uncertain`.

Use this exact Schedule decision table:

| Stage | Strongly favorable week | Favorable week | Neutral/mixed week | Unfavorable week | Strongly unfavorable week |
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

- If gauge data is missing: `Uncertain`.
- If required date config is invalid: unsupported config error.
- If fewer than 4 of the last 7 days have usable favorability data: `Uncertain`.
- If two or more required non-gauge inputs are missing for today's snapshot: `Uncertain`.
- If fishability is blown out, Schedule can still be Ahead or On schedule, but copy must say the river may be too high to fish cleanly.
- If the 7-day progression index is between -0.99 and 0.99, use Neutral/mixed.
- Conservative default: if a case is not covered by this table, use `Uncertain`.

Schedule may move from Ahead to On schedule as the run enters the normal window. This is not a contradiction. It means early conditions accelerated the start, but the broader run has now settled into its researched timing window.

---

## 10. User Copy System

All copy is deterministic. No LLM.

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

### 10.1 Data Freshness Metadata

The API should include data freshness metadata for transparency, but this is not a sixth primitive.

Required metadata:

```ts
type RiverRunDataFreshness = {
  gauge: 'fresh' | 'stale' | 'missing';
  weather: 'fresh' | 'stale' | 'missing';
  waterTemperature: 'measured' | 'proxy' | 'missing';
  scheduleDaysUsable: number; // 0-7
};
```

User-facing copy should mention stale or proxy data only when it affects interpretation.

### 10.2 Disagreement Copy Rules

The copy layer must deliberately handle disagreement between primitives.

Required combinations:

| Condition | Required copy angle |
|---|---|
| High Push + Low Fishability | "Fish may move, but the river may be hard to fish cleanly." |
| Ahead Schedule + Pre-run Stage | "Some early fish are possible, but the main run is not established." |
| Peak Stage + Weak Push | "Fish may be present, but fresh movement is limited today." |
| Good Fishability + Low Fish In River | "The river is in shape, but the run is not seasonally established." |
| Behind Schedule + Strong Push | "Today's conditions improved, but the broader 7-day schedule still looks delayed." |
| Stale gauge | "Gauge data is stale; use caution interpreting current river shape." |

Disagreement copy should be concise and practical. It should not apologize for the model; it should explain what each signal means.

### 10.3 Push Copy Examples

Fall cooling, weak:

```txt
Weather has not lined up for a strong push yet.
This fall run usually improves with cooler rain or a noticeable river bump.
Watch for the next cooldown or meaningful rain before expecting stronger movement.
```

Fall cooling, very strong:

```txt
Recent rain, rising flow, and cooler temperatures are lining up for this run.
These are favorable movement conditions for fall salmon.
Cover lower-river travel lanes while the river stays fishable.
```

Spring warming, weak:

```txt
Spring movement conditions are still muted.
Cold or unstable conditions can slow this run even inside the normal window.
Look for a warming trend with fishable flows.
```

Neutral:

```txt
Conditions are not strongly helping or hurting movement right now.
A push could develop with the next meaningful weather change.
Use the river shape and run stage to decide how aggressive to be.
```

### 10.4 Fishability Copy Examples

Good:

```txt
The river is within its configured fishable range.
Flow looks manageable for this run based on the selected gauge.
Focus on normal travel lanes and holding water.
```

Blown out:

```txt
The river is running above the configured fishable range.
Fish may move in these conditions, but clean fishing can be difficult or unsafe.
Wait for the river to drop and stabilize.
```

Very low:

```txt
The river is below its normal fishable range.
Low, clear water can make fish cautious and movement limited.
Use stealth, cover water carefully, and watch for the next bump.
```

### 10.5 Fish In River Copy Examples

Pre-run low:

```txt
This is before the normal run window.
Meaningful fish numbers are unlikely in the river yet.
Focus near the mouth, lower-river staging water, or nearby lake staging areas.
```

Pre-run but Ahead:

```txt
This is still before the normal run window, but recent conditions have favored early movement.
Some fish may be trickling in before the main run.
Cover lower-river water and staging areas rather than assuming the whole system is loaded.
```

Peak:

```txt
This is near the researched peak window for this run.
Fish are more likely to be spread through the river when fishability cooperates.
Use Push Score and Fishability Score to judge how active the window is today.
```

Ending:

```txt
This run is late in its normal window.
Fresh movement may be less consistent, but fish can still be present.
Focus on remaining holding water and favorable short windows.
```

### 10.6 Run Stage Copy Examples

Each stage has baseline copy. Schedule can add a second sentence.

Example:

```txt
Stage: Building
The run is inside its normal window and should be gaining fish when conditions cooperate.
```

If Schedule is Behind:

```txt
Recent conditions have been less favorable, so the run may be progressing slower than normal.
```

### 10.7 Schedule Copy Examples

Ahead:

```txt
This run may be progressing faster than normal because recent conditions favor movement for this species.
```

On schedule:

```txt
Current conditions fit the normal timing window for this run.
```

Behind:

```txt
This run may be lagging because key movement conditions have not lined up yet.
```

Uncertain:

```txt
The calendar and conditions are giving mixed signals, or important data is missing.
```

---

## 11. API Shape

### 11.1 `GET /river-run/rivers`

Returns supported states, rivers, and configured runs.

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

Returns the stable local-day progression snapshot plus the latest same-day condition refresh.

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
    "tip": "Use Push Score and Fishability Score to decide how aggressive to be."
  },
  "schedule": {
    "label": "Behind",
    "progressionIndex": -1.34,
    "usableDays": 7,
    "headline": "This run may be progressing slower than normal.",
    "detail": "The last week has not strongly favored movement for this run profile.",
    "tip": "Watch for the next cooldown, rain, or river bump."
  },
  "push": {
    "score": 42,
    "label": "Limited",
    "headline": "Weather has not lined up for a strong push yet.",
    "detail": "This fall run usually improves with cooler rain or a noticeable river bump.",
    "tip": "Watch for the next cooldown or meaningful rain before expecting stronger movement.",
    "reasonCodes": ["dry_72h", "stable_flow", "warm_neutral"]
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
    "detail": "Fish should be increasingly present, but current conditions suggest the run may be lagging.",
    "tip": "Cover water efficiently and prioritize lower-to-middle river areas until stronger push conditions arrive.",
    "reasonCodes": ["building_stage", "schedule_behind"]
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
  "engineVersion": "river-run-simple-v1.0.0"
}
```

---

## 12. Storage

V1 can use minimal tables.

| Table | Purpose |
|---|---|
| `river_run_gauge_baselines` | Historical percentile baselines |
| `river_run_daily_progression_snapshots` | Stable Run Stage, Schedule, and Fish In River output per river/run/local date |
| `river_run_condition_refreshes` | Same-day Push and Fishability refreshes per river/run/local date/refresh slot |

Optional:

| Table | Purpose |
|---|---|
| `river_run_gauge_observations` | Cached normalized gauge readings |

Config remains in code for V1.

Snapshot rows must store enough raw input context to explain or debug the output later:

- River/run IDs
- Local date
- Progression snapshot timestamp
- Condition refresh timestamp and refresh slot
- Gauge values and trend values
- Weather values and trend values
- Temperature source and trend
- Derived scores/labels
- Reason codes
- Data freshness metadata
- Engine version
- Config version

---

## 13. File Structure

Recommended V1 structure:

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
      midnight.ts
    tests/
      pereMarquetteFallChinook.test.ts
      behaviorProfiles.test.ts
      stageScheduleCombos.test.ts
```

---

## 14. Acceptance Tests

V1 must pass deterministic scenario tests.

### 14.1 Date/Stage Tests

| Scenario | Expected |
|---|---|
| 30 days before start | Stage Pre-run, Fish In River very low, Schedule Uncertain |
| 10 days before start + 7-day strongly favorable fall cooling pattern | Stage Pre-run, Schedule Ahead, Fish In River nudged to "A few possible" |
| Start date + neutral conditions | Stage Beginning, Schedule On schedule |
| Building window + hot/dry/low fall conditions | Stage Building, Schedule Behind |
| Peak date + neutral/fishable conditions | Stage Peak, Fish In River high |
| After peak window but before `taperingEnd` | Stage Tapering |
| After `taperingEnd` but before end | Stage Ending |
| 20 days after end | Stage Post-run, Fish In River very low |

### 14.2 Push Tests

| Scenario | Expected |
|---|---|
| Fall cooling: rain + rise + cooling | Very strong Push |
| Fall cooling: strong rain only, neutral flow/temp, fishable band | Strong Push |
| Fall cooling: cooling only, neutral rain/flow, fishable band | Possible Push |
| Fall cooling: strong cooling only, neutral rain/flow, fishable band | Strong Push |
| Fall cooling: warm/dry/falling | Weak Push |
| Spring warming: warming + fishable modest rise | Strong Push |
| Spring warming: cooling only, neutral rain/flow, fishable band | Limited Push |
| Spring warming: strong cooling + dry/stale + low/falling flow | Weak Push |
| Summer Skamania: rain pulse + cooler break | Strong Push |
| Winter steelhead: rain bump + stable cool flow | Strong Push |

### 14.3 Fishability Tests

| Scenario | Expected |
|---|---|
| Normal/ideal band + stable | Good/Excellent |
| Blown-out band | Poor/Tough, cap applied |
| Very low band | Poor/Tough, cap applied |
| Sharp rise into high band | Fishability capped |
| Stale gauge | Fishability capped and copy mentions stale data |

### 14.4 Copy Combination Tests

Every Run Stage x Schedule combination that can appear must have valid copy.

Required combinations:

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

No combination may return empty copy.

---

## 15. Product Guardrails

- Never claim fish are definitely present.
- Never claim a user will catch fish.
- Never produce exact fish counts.
- Never recommend unsafe river use.
- Never hide poor Fishability behind a strong Push Score.
- Never use forecast to score current-day V1 primitives.
- Always show gauge basis and regulation reminder.
- Always identify when air temperature is only a proxy.
- Only show supported configured rivers/runs.
- Only expose rivers/runs that pass config validation.
- Never support ungauged rivers in V1.
- Never expose a poorly positioned gauge as public-supported; use `limited` only for hidden diagnostics or explicit beta review.
- If a run is unsupported today because critical data is missing, show unavailable instead of partial confidence theater.
- Same inputs must always produce same outputs.

---

## 16. Build Plan

### Phase 1 - Config and Types

- Add RiverProfile and RiverRunProfile types
- Add first supported river/run config
- Add supported species and behavior profiles
- Add config validation and hidden invalid-run diagnostics

### Phase 2 - Data Inputs

- Fetch USGS current and historical gauge data
- Build percentile baselines
- Read weather from configured weather point or river mouth fallback
- Implement daily progression snapshot keying
- Implement 8-hour condition refresh slots

### Phase 3 - Metrics

- Rain signal
- Flow/height band and trend
- Temperature trend
- Date window/stage
- Behavior-profile favorability

### Phase 4 - Scores and Labels

- Push Score
- Fishability Score
- Fish In River Score
- Run Stage
- Schedule
- Deterministic copy templates

### Phase 5 - API and UI

- `GET /river-run/rivers`
- `GET /river-run/snapshot`
- App state/river/run selector
- Five primitive cards
- Gauge/safety footer

### Phase 6 - Tests and Calibration

- Scenario tests
- Stage/schedule copy matrix tests
- One historical backtest for first river/run
- Manual review of all user-facing copy

---

## 17. V1 Definition of Done

River Run V1 is ready when:

- At least one Great Lakes river/run is configured
- Gauge has 2+ years of history
- Gauge reach quality is marked `good` or explicitly accepted as beta
- Config validation hides invalid runs
- Daily progression snapshot is stable by local date
- Push and Fishability can refresh in 8-hour condition slots without changing Schedule/Stage/Fish In River
- All five primitives render with score/label/copy where applicable
- All supported Run Stage x Schedule combinations have deterministic copy
- Blown-out/very-low/stale-gauge caps work
- Air-temp proxy copy is cautious
- Unsupported-today response works for missing critical gauge data
- Unsupported rivers are hidden
- Scenario tests pass
- User-facing language avoids over-promising

---

## 18. Future V2 Ideas

Do not build these in V1:

- 3-5 day outlook
- Push notifications
- User river requests/votes
- Admin dashboard
- Presentation recommendations
- Reach-specific lower/middle/upper timing
- Multiple gauges per river
- Manual field report overlays
- Confidence as a visible sixth primitive
- Overall score, if real users ask for it later
