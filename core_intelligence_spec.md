# FISHING CORE INTELLIGENCE ENGINE
## Complete Implementation Specification
### Shared Deterministic Intelligence Layer For All AI Features

---

> **Document Purpose:** This document defines the shared deterministic intelligence engine used by all AI features in TightLines AI. It specifies the complete environmental data pipeline, water-type routing, scoring logic, recovery logic, time-window logic, fish-behavior inference, and output contract required to build the engine with no ambiguity.
>
> **Scope:** This is the shared core intelligence layer. It is not the `How's Fishing Right Now?` feature spec and it is not the Recommender prompt spec. It produces deterministic outputs that other features consume.
>
> **Consumer Features:**
> - `How's Fishing Right Now?` uses this engine to generate overall conditions assessments, score breakdowns, alerts, and best/worst fishing windows.
> - `Lure / Fly Recommender` uses this engine to understand fish activity state, feeding intensity, positioning bias, and environmental drivers before generating species-specific recommendations.
> - `Water Reader` uses this engine to understand how fish should be behaving before mapping that behavior onto structure visible in images, charts, or satellite views.

---

## TABLE OF CONTENTS

1. [Core Role](#section-1)
2. [Required Inputs and APIs](#section-2)
3. [Water Type Routing](#section-3)
4. [Derived Variables](#section-4)
5. [Raw Score Engine](#section-5)
6. [Recovery Modifier](#section-6)
7. [Time Window Engine](#section-7)
8. [Behavior Inference Layer](#section-8)
9. [Engine Output Contract](#section-9)
10. [Caching and Implementation Rules](#section-10)

---

## SECTION 1 — CORE ROLE {#section-1}

The Fishing Core Intelligence Engine is the shared deterministic system that converts location-based environmental data into:

- a `raw_score` from 0–100
- a `recovery-adjusted score`
- ranked fishing windows for the current day
- water-type-aware component scores
- fish-behavior state outputs consumed by downstream features
- machine-readable alerts for severe biological suppression events

This engine is authoritative. The LLM never calculates these values. The LLM only interprets and explains them.

### 1A. Design Principles

1. **Deterministic before generative.**
   All scoring, weighting, routing, alerting, and fish-state outputs are calculated before any LLM call.

2. **Water type changes the biology.**
   Freshwater, saltwater, and brackish are not cosmetic labels. They change the relative importance of pressure, light, tide, temperature, wind, moon, and precipitation.

3. **Metabolic state is foundational.**
   Water temperature zone determines whether fish are physiologically capable of expressing aggressive feeding behavior at all. No favorable pressure, tide, or solunar window can fully override extreme metabolic suppression.

4. **Forcing variables outrank soft cues.**
   Tidal current, severe pressure change, and thermal stress are structural drivers. Solunar and moon phase are softer modifiers unless their effects are already expressed through a stronger variable.

5. **The engine is universal, outputs are feature-specific.**
   This engine produces shared environmental intelligence. Each feature consumes it differently.

### 1B. What The Engine Does Not Do

- It does not recommend lures, flies, or species.
- It does not analyze images.
- It does not decide UI layout.
- It does not generate final natural-language copy.
- It does not replace species-specific logic in the Recommender.

---

## SECTION 2 — REQUIRED INPUTS AND APIS {#section-2}

### 2A. Required Input Contract

Every engine run requires:

```json
{
  "lat": 28.0836,
  "lon": -82.5716,
  "timestamp_utc": "2026-03-11T13:15:00Z",
  "timezone": "America/New_York"
}
```

Optional upstream fields may be supplied by the caller if already fetched recently, but the engine must validate freshness before use.

### 2B. Required Data Sources

| Data Category | Source | Required Fields |
|---|---|---|
| Current weather | Open-Meteo | air temp, wind speed, wind direction, gusts, cloud cover, precipitation, humidity, surface pressure |
| Pressure history | Open-Meteo | hourly surface pressure for past 7 days |
| Temperature history | Open-Meteo | hourly air temp for past 72 hours, daily high/low air temp for past 7 days |
| Precipitation history | Open-Meteo | precipitation totals for past 48 hours and 7 days |
| Sun timing | Open-Meteo or Sunrise-Sunset.org | sunrise, sunset, civil twilight begin/end |
| Moon and solunar | USNO, Farmsense, or equivalent astronomy source | moon phase, illumination, moonrise, moonset, major/minor solunar windows |
| Tide predictions | NOAA CO-OPS for V1 | nearest station, high/low predictions, current phase context, tide heights |
| Salt/brackish water temperature | NOAA CO-OPS `water_temperature` in V1 | measured coastal water temperature when a qualifying station observation exists |

### 2C. Required Tide Fetches

For coastal runs, the engine must fetch:

1. **Current-day tide predictions**
   Used for current tide phase, next high/low, and daily tidal range.

2. **Thirty-day local tide range baseline**
   Used to calculate `tide_strength` from the current day's tidal range relative to that station's local spring/neap cycle.

The engine must not use one universal national ft threshold for `tide_strength`. Tidal ranges vary too much by coast, estuary, and station.

### 2D. Water Temperature Source Routing

| Water Type | Source |
|---|---|
| Freshwater | inferred from 7-day air history plus latitude-season correction |
| Saltwater | NOAA CO-OPS measured water temp when a qualifying station observation is available; otherwise unavailable in V1 |
| Brackish | NOAA CO-OPS measured water temp when a qualifying station observation is available; otherwise unavailable in V1 |

Deterministic fallback order:

1. `freshwater`
   - derive from the Section 4G model using recent Open-Meteo air-temperature history
   - if the 7-day air history required by Section 4G is unavailable, set `water_temp_f = null`
2. `saltwater`
   - use NOAA CO-OPS `water_temperature` if a station observation exists within 50 miles and a recent value is available
   - use the same NOAA CO-OPS station history to populate `measured_water_temp_72h_ago_f` when a qualifying observation exists near the 72-hour target
   - else set `water_temp_f = null`
3. `brackish`
   - use NOAA CO-OPS `water_temperature` if a station observation exists within 50 miles and a recent value is available
   - use the same NOAA CO-OPS station history to populate `measured_water_temp_72h_ago_f` when a qualifying observation exists near the 72-hour target
   - else set `water_temp_f = null`

The engine must return `water_temp_source` as one of:

- `freshwater_air_model`
- `noaa_coops`
- `noaa_ndbc`
- `marine_sst`
- `unavailable`

### 2E. Partial-Data and Fallback Rules

The engine must continue operating when one or more variables are unavailable.

Required handling rules:

1. Every variable and every component must end in exactly one status:
   - `available`
   - `fallback_used`
   - `unavailable`
   - `not_applicable`
2. If a primary source fails but an approved fallback exists in this spec, the engine must use the fallback and mark that variable `fallback_used`.
3. If no approved fallback exists, the variable must be set to `null`, marked `unavailable`, and excluded from score denominators.
4. Missing variables must never be silently converted to zero.
5. The engine must still return:
   - `raw_score`
   - `adjusted_score`
   - behavior outputs
   - time windows
   - explicit data-quality metadata describing what was missing
6. Alerts that cannot be evaluated because required inputs are missing must return `false` plus an explicit evaluation status of `not_evaluable_missing_inputs`.
7. If 1, 2, or 3 components fail, the engine must still score using only the remaining available components under the normalization rules in Sections 5M and 7C.

---

## SECTION 3 — WATER TYPE ROUTING {#section-3}

### 3A. Routing Rules

1. Query nearest NOAA tide station within 50 miles.
2. If no station is found, run `freshwater` only.
3. If a station is found, the location is coastal and the engine must support all three water types:
   - `freshwater`
   - `saltwater`
   - `brackish`

### 3B. Why Coastal Runs Produce Three Outputs

The same coordinates can legitimately produce three different behavior models:

- a nearby freshwater canal, pond, or inland lake
- open coastal or inshore saltwater
- estuarine or tidal-creek brackish water

For coastal users, the caller should run the engine three times against the same environmental snapshot with only `water_type` changed. The engine must not collapse these into one blended report.

### 3C. Water-Type-Specific Primary Timers

| Water Type | Primary Feeding Timer |
|---|---|
| Freshwater | light + solunar |
| Saltwater | tide phase + tide strength |
| Brackish | tide phase + tide strength + solunar |

---

## SECTION 4 — DERIVED VARIABLES {#section-4}

The engine must derive the following normalized states before scoring.

### 4A. Pressure Trend

Calculate:

```text
pressure_change_rate_mb_hr = (current_pressure_mb - pressure_3_hours_ago_mb) / 3
```

Map to:

- `rapidly_falling` if `< -1.5`
- `slowly_falling` if `-1.5 <= x < -0.5`
- `stable` if `-0.5 <= x <= 0.5`
- `slowly_rising` if `0.5 < x <= 1.5`
- `rapidly_rising` if `> 1.5`

### 4B. Light Condition

Use local time and current cloud cover percentage.

First calculate:

```text
current_local_minutes
civil_twilight_begin_minutes
sunrise_minutes
sunset_minutes
civil_twilight_end_minutes
```

Then classify in this exact order:

```text
if current_local_minutes >= civil_twilight_end_minutes
  or current_local_minutes < civil_twilight_begin_minutes:
  light_condition = night

else if current_local_minutes >= civil_twilight_begin_minutes
  and current_local_minutes <= sunrise_minutes + 90:
  if cloud_cover_pct >= 70:
    light_condition = dawn_window_overcast
  else:
    light_condition = dawn_window_clear

else if current_local_minutes >= sunset_minutes - 90
  and current_local_minutes <= civil_twilight_end_minutes:
  if cloud_cover_pct >= 70:
    light_condition = dusk_window_overcast
  else:
    light_condition = dusk_window_clear

else:
  if cloud_cover_pct >= 70:
    light_condition = midday_overcast
  else if cloud_cover_pct >= 35:
    light_condition = midday_partly_cloudy
  else:
    light_condition = midday_full_sun
```

### 4C. Solunar State

Classify `solunar_state` in this exact precedence order:

```text
1. within_major_window
2. within_30min_of_major
3. within_minor_window
4. within_30min_of_minor
5. outside_all_windows
```

Rules:

```text
if current_local_minutes is inside any major period start/end:
  solunar_state = within_major_window

else if current_local_minutes is within 30 minutes before major period start
  or within 30 minutes after major period end:
  solunar_state = within_30min_of_major

else if current_local_minutes is inside any minor period start/end:
  solunar_state = within_minor_window

else if current_local_minutes is within 30 minutes before minor period start
  or within 30 minutes after minor period end:
  solunar_state = within_30min_of_minor

else:
  solunar_state = outside_all_windows
```

### 4D. Tide Phase

Use local current time and the nearest adjacent predicted high/low tide extremes from the same station.

Definitions:

- `last_extremum` = most recent predicted high or low before current time
- `next_extremum` = next predicted high or low after current time
- `minutes_since_last` = current_time - last_extremum
- `minutes_to_next` = next_extremum - current_time

Classification:

```text
if abs(minutes_to_next) <= 15 or abs(minutes_since_last) <= 15:
  tide_phase_state = slack

else if minutes_to_next <= 60:
  tide_phase_state = final_hour_before_slack

else if last_extremum.type == low and next_extremum.type == high:
  if minutes_since_last <= 120:
    tide_phase_state = incoming_first_2_hours
  else:
    tide_phase_state = incoming_mid

else if last_extremum.type == high and next_extremum.type == low:
  if minutes_since_last <= 120:
    tide_phase_state = outgoing_first_2_hours
  else:
    tide_phase_state = outgoing_mid
```

If tide predictions are missing or there are not enough adjacent extrema to classify current phase, `tide_phase_state` must be `null`.

### 4E. Tide Strength

`Tide strength` is a separate variable from tide phase.

#### Inputs

- today's maximum predicted high tide
- today's minimum predicted low tide
- 30-day set of daily predicted ranges from the same station

#### Formulas

```text
today_tidal_range_ft = highest_predicted_high_ft - lowest_predicted_low_ft

daily_range_ft[day] = highest_predicted_high_ft_for_day - lowest_predicted_low_ft_for_day

local_p10 = 10th percentile of 30-day daily_range_ft set
local_p90 = 90th percentile of 30-day daily_range_ft set

range_strength_pct = clamp(
  (today_tidal_range_ft - local_p10) / max(local_p90 - local_p10, 0.10),
  0,
  1
) * 100
```

#### Classification

| `range_strength_pct` | Tide Strength State |
|---|---|
| 85–100 | strong_movement |
| 65–84 | above_average_movement |
| 40–64 | moderate_movement |
| 15–39 | weak_movement |
| 0–14 | minimal_movement |

This is the only approved V1 `tide_strength` method.

### 4F. Temperature Trend

Calculate 72-hour air temperature change:

```text
current_local_hour = latest completed local hour for the run timestamp

avg_air_temp_today = arithmetic mean of hourly air temperatures from local 00:00
through current_local_hour on the current day

avg_air_temp_3_days_ago = arithmetic mean of hourly air temperatures from local 00:00
through the same current_local_hour on the day 3 calendar days earlier

temp_trend_direction_f = avg_air_temp_today - avg_air_temp_3_days_ago

avg_air_temp_last_24h = arithmetic mean of the most recent 24 completed hourly
air-temperature observations

avg_air_temp_prev_24h = arithmetic mean of the 24 completed hourly
air-temperature observations immediately before `avg_air_temp_last_24h`

temp_trend_24h_f = avg_air_temp_last_24h - avg_air_temp_prev_24h
```

Map to:

- `rapid_warming` if `>= +4°F in 72 hrs`
- `warming` if `+1°F to +3.9°F`
- `stable` if within `±1°F`
- `cooling` if `-1°F to -3.9°F`
- `rapid_cooling` if `temp_trend_24h_f <= -4°F` or `temp_trend_direction_f <= -5°F`

Fallback rule:

- if hourly temperature history is incomplete for either comparison window, use the provider daily mean for that day where `daily_mean_f = (daily_high_f + daily_low_f) / 2`
- if neither hourly nor daily mean inputs are available, set `temp_trend_direction_f = null` and `temp_trend_state = null`

### 4G. Freshwater Water Temperature Estimate

Use the weighted 7-day air temperature model:

```text
water_temp_est_f = (
  air_temp_today     * 0.30 +
  air_temp_yesterday * 0.25 +
  air_temp_2days_ago * 0.20 +
  air_temp_3days_ago * 0.12 +
  air_temp_4days_ago * 0.07 +
  air_temp_5days_ago * 0.04 +
  air_temp_6days_ago * 0.02
)
```

Then apply latitude-season correction:

| Meteorological Season | lat `< 33` | lat `33 to 40` | lat `> 40` |
|---|---:|---:|---:|
| Dec-Jan-Feb | -2°F | -4°F | -5°F |
| Mar-Apr-May | -3°F | -5°F | -6°F |
| Jun-Jul-Aug | -4°F | -6°F | -8°F |
| Sep-Oct-Nov | -3°F | -5°F | -7°F |

Implementation requirement:

- Use the exact table above keyed by `latitude_band` and meteorological season.
- Do not use an LLM to estimate freshwater temperature.

### 4H. Water Temperature Absolute Zone

| Zone | Freshwater | Saltwater | Brackish |
|---|---|---|---|
| near_shutdown_cold | `< 36°F` | `< 50°F` | `< 48°F` |
| lethargic | `36–48°F` | `50–60°F` | `48–58°F` |
| transitional | `48–58°F` | `60–68°F` | `58–66°F` |
| active_prime | `58–72°F` | `68–80°F` | `66–78°F` |
| peak_aggression | `72–82°F` | `80–88°F` | `78–86°F` |
| thermal_stress_heat | `> 82°F` | `> 88°F` | `> 86°F` |

### 4I. Severe Alerts

#### Cold Stun Alert

Trigger when all are true:

- `water_type` is `saltwater` or `brackish`
- measured water temp is below `52°F` for saltwater or below `50°F` for brackish
- water temp has dropped more than `8°F` in the past 72 hours

If the required measured temperature or 72-hour comparison inputs are unavailable:

- `cold_stun_alert = false`
- `cold_stun_status = not_evaluable_missing_inputs`

#### Salinity Disruption Alert

Trigger when all are true:

- `water_type` is `brackish`
- `precip_48hr_inches > 2.0`

If `precip_48hr_inches` is unavailable:

- `salinity_disruption_alert = false`
- `salinity_disruption_status = not_evaluable_missing_inputs`

If the alert is fully evaluated, return status `evaluated`.

### 4J. Precipitation Condition

All precipitation classification must use inches.

If the weather provider returns precipitation in metric units, convert to inches before classification.

Inputs:

- `current_precip_in_hr`
- `precip_48hr_inches`

Exact thresholds:

```text
if precip_48hr_inches > 2.0:
  precip_condition = post_heavy_rain_48hr

else if current_precip_in_hr > 0.30:
  precip_condition = heavy_rain

else if current_precip_in_hr >= 0.10 and current_precip_in_hr <= 0.30:
  precip_condition = moderate_rain

else if current_precip_in_hr > 0 and current_precip_in_hr < 0.10:
  precip_condition = light_rain

else if current_precip_in_hr == 0 and precip_48hr_inches > 0 and precip_48hr_inches <= 0.50:
  precip_condition = post_light_rain_clearing

else:
  precip_condition = no_precip_stable
```

Saltwater-only display alias:

- `current_rain_any_intensity` means any of `light_rain`, `moderate_rain`, or `heavy_rain`
- `post_major_storm` means `precip_48hr_inches > 4.0` and current precipitation is `0`
- `extreme_storm_surge` is a manual exceptional-event override and must not be auto-triggered from weather data alone in V1

---

## SECTION 5 — RAW SCORE ENGINE {#section-5}

### 5A. Weight Tables

The raw score always totals 100 possible points.

#### Freshwater

| Variable | Max Points |
|---|---:|
| Water Temp Absolute Zone | 24 |
| Barometric Pressure Trend | 22 |
| Light Conditions | 18 |
| Temperature Trend | 12 |
| Solunar Period | 10 |
| Wind | 8 |
| Moon Phase / Nocturnal Illumination | 3 |
| Precipitation / Recent Rain Impact | 3 |
| **TOTAL** | **100** |

#### Saltwater

| Variable | Max Points |
|---|---:|
| Tide Phase | 20 |
| Tide Strength | 17 |
| Water Temp Absolute Zone | 19 |
| Barometric Pressure Trend | 14 |
| Wind | 8 |
| Light Conditions | 8 |
| Temperature Trend | 6 |
| Solunar Period | 4 |
| Moon Phase / Nocturnal Illumination | 2 |
| Precipitation / Recent Rain Impact | 2 |
| **TOTAL** | **100** |

#### Brackish

| Variable | Max Points |
|---|---:|
| Water Temp Absolute Zone | 18 |
| Tide Phase | 17 |
| Barometric Pressure Trend | 15 |
| Tide Strength | 12 |
| Light Conditions | 10 |
| Temperature Trend | 8 |
| Solunar Period | 8 |
| Wind | 7 |
| Precipitation / Recent Rain Impact | 3 |
| Moon Phase / Nocturnal Illumination | 2 |
| **TOTAL** | **100** |

### 5B. Universal Scaling Rule

All component scoring in this section is fully deterministic. No component may use:

- random selection inside a range
- midpoint guessing
- LLM judgment
- developer interpretation of "good", "fair", or "strong"

Legacy ranges from earlier planning documents are superseded by the exact formulas and fixed percentages below.

#### Helper Functions

```text
clamp(value, min, max) = max(min, min(value, max))

lerp(a, b, t) = a + ((b - a) * t)

inverse_lerp(value, min, max) = clamp((value - min) / (max - min), 0, 1)

component_score = round((component_pct / 100) * component_weight)
```

### 5C. Barometric Pressure Scoring

`pressure_state` must be determined from `pressure_change_rate_mb_hr` in Section 4A, then mapped to an exact `component_pct` as follows.

#### Falling and Rising States

```text
if pressure_state == rapidly_falling:
  // -1.5 mb/hr => 90, -3.0 mb/hr or lower => 100
  t = inverse_lerp(abs(pressure_change_rate_mb_hr), 1.5, 3.0)
  component_pct = round(lerp(90, 100, t))

if pressure_state == slowly_falling:
  // -0.5 mb/hr => 70, -1.5 mb/hr => 89
  t = inverse_lerp(abs(pressure_change_rate_mb_hr), 0.5, 1.5)
  component_pct = round(lerp(70, 89, t))

if pressure_state == slowly_rising:
  // +0.5 mb/hr => 39, +1.5 mb/hr => 20
  t = inverse_lerp(pressure_change_rate_mb_hr, 0.5, 1.5)
  component_pct = round(lerp(39, 20, t))

if pressure_state == rapidly_rising:
  // +1.5 mb/hr => 19, +3.0 mb/hr or higher => 0
  t = inverse_lerp(pressure_change_rate_mb_hr, 1.5, 3.0)
  component_pct = round(lerp(19, 0, t))
```

#### Stable State

When `pressure_state == stable`, the engine must use absolute pressure:

```text
if current_pressure_mb < 1010:
  // 1010 => 50, 1000 or lower => 69
  t = inverse_lerp(1010 - current_pressure_mb, 0, 10)
  component_pct = round(lerp(50, 69, t))

if current_pressure_mb >= 1010 and current_pressure_mb <= 1018:
  // 1010 => 60, 1018 => 48
  t = inverse_lerp(current_pressure_mb, 1010, 1018)
  component_pct = round(lerp(60, 48, t))

if current_pressure_mb > 1018:
  // 1018 => 56, 1030 or higher => 40
  t = inverse_lerp(current_pressure_mb, 1018, 1030)
  component_pct = round(lerp(56, 40, t))
```

### 5D. Light Condition Scoring

| Light Condition | `component_pct` |
|---|---:|
| dawn_window_overcast | 100 |
| dusk_window_overcast | 98 |
| dawn_window_clear | 84 |
| dusk_window_clear | 82 |
| midday_overcast | 60 |
| night | 52 |
| midday_partly_cloudy | 40 |
| midday_full_sun | 12 |

### 5E. Solunar Scoring

| Solunar State | `component_pct` |
|---|---:|
| within_major_window | 95 |
| within_30min_of_major | 75 |
| within_minor_window | 58 |
| within_30min_of_minor | 35 |
| outside_all_windows | 8 |

Routing:

- `freshwater`: full solunar weight applies
- `saltwater`: reduced solunar weight applies as a secondary modifier
- `brackish`: full brackish solunar weight applies

### 5F. Tide Phase Scoring

| Tide State | `component_pct` |
|---|---:|
| incoming_first_2_hours | 96 |
| outgoing_first_2_hours | 92 |
| incoming_mid | 74 |
| outgoing_mid | 70 |
| final_hour_before_slack | 32 |
| slack | 5 |

Routing:

- only `saltwater` and `brackish` score this variable
- `freshwater` does not include `tide_phase`

### 5G. Tide Strength Scoring

`tide_strength_score` is calculated directly from `range_strength_pct`.

```text
component_pct = round(range_strength_pct)
tide_strength_score = round((component_pct / 100) * tide_strength_weight)
```

For explanation and display:

| `range_strength_pct` | Label |
|---|---|
| 85–100 | Strong spring-like movement |
| 65–84 | Above-average movement |
| 40–64 | Moderate movement |
| 15–39 | Weak movement |
| 0–14 | Minimal movement |

### 5H. Water Temperature Absolute Zone Scoring

Water temperature zone scoring uses exact percentages. Bounded zones use linear interpolation inside the zone. Extreme zones use fixed percentages.

```text
if water_temp_zone == near_shutdown_cold:
  component_pct = 8

if water_temp_zone == lethargic:
  // lower bound => 25, upper bound => 42
  component_pct = round(lerp(25, 42, zone_progress))

if water_temp_zone == transitional:
  // lower bound => 50, upper bound => 67
  component_pct = round(lerp(50, 67, zone_progress))

if water_temp_zone == active_prime:
  // lower bound => 75, upper bound => 92
  component_pct = round(lerp(75, 92, zone_progress))

if water_temp_zone == peak_aggression:
  // lower bound => 83, upper bound => 100
  component_pct = round(lerp(83, 100, zone_progress))

if water_temp_zone == thermal_stress_heat:
  component_pct = 28
```

`zone_progress` must be calculated only for bounded zones:

```text
zone_progress = inverse_lerp(current_water_temp_f, zone_lower_bound_f, zone_upper_bound_f)
```

Bounded zones are:

- `lethargic`
- `transitional`
- `active_prime`
- `peak_aggression`

If `cold_stun_alert` is active:

- force water temp zone score to `0`
- force temperature trend score to `0`

### 5I. Temperature Trend Scoring

#### Base Trend Score

| Trend State | `base_pct` |
|---|---:|
| rapid_warming | 94 |
| warming | 75 |
| stable | 60 |
| cooling | 43 |
| rapid_cooling | 90 |

#### Zone Context Modifier

| Trend State | Landing Zone | Modifier |
|---|---|---:|
| rapid_cooling | active_prime or peak_aggression to active_prime | 1.00 |
| rapid_cooling | transitional | 0.70 |
| rapid_cooling | lethargic | 0.25 |
| rapid_cooling | near_shutdown_cold | 0.00 |
| rapid_warming | lethargic or transitional into active_prime | 1.00 |
| rapid_warming | already active_prime | 0.80 |
| rapid_warming | thermal_stress_heat | 0.10 |
| stable | active_prime or peak_aggression | 1.00 |
| stable | lethargic or near_shutdown_cold | 0.40 |
| cooling | active_prime | 0.85 |
| cooling | transitional | 0.70 |
| cooling | lethargic or near_shutdown_cold | 0.35 |

#### Final Formula

```text
temperature_trend_score = round(
  (base_pct / 100) * temperature_trend_weight * zone_modifier
)
```

Freshwater feed-up override:

- if `rapid_cooling` is detected and the landing freshwater zone is below `transitional`, suppress any feed-up flag entirely

### 5J. Wind Scoring

#### Freshwater

| Wind Condition | `component_pct` |
|---|---:|
| 5–12 mph | 92 |
| 0–4 mph | 65 |
| 13–20 mph | 62 |
| > 20 mph | `max(0, round(40 - min(wind_speed_mph - 20, 16) * 2.5))` |

#### Saltwater / Brackish

| Wind Condition | `component_pct` |
|---|---:|
| 5–12 mph, wind_with_tide | 92 |
| 5–12 mph, neutral_or_unknown_relationship | 75 |
| 5–12 mph, wind_against_tide | 58 |
| 0–4 mph | 54 |
| 13–20 mph, wind_with_tide | 55 |
| 13–20 mph, neutral_or_unknown_relationship | 39 |
| 13–20 mph, wind_against_tide | 22 |
| > 20 mph | `max(0, round(20 - min(wind_speed_mph - 20, 15) * 1.33))` |

Implementation rule:

- `wind_to_deg = (wind_from_deg + 180) mod 360`
- `angle_delta = smallest absolute angle between wind_to_deg and tide_flow_deg`
- classify `wind_with_tide` if `angle_delta <= 45`
- classify `wind_against_tide` if `angle_delta >= 135`
- classify `neutral_or_unknown_relationship` if `45 < angle_delta < 135`
- if `tide_flow_deg` is unavailable, classify `neutral_or_unknown_relationship`
- `tide_flow_deg` must come from a deterministic current-direction source or a deterministic pre-mapped local tidal-axis dataset; if neither exists, V1 must not guess it from the shoreline visually or from the LLM

### 5K. Moon Phase Scoring

Moon phase remains intentionally small because its main coastal effect is already captured by `tide_strength`.

| Moon Phase | `component_pct` |
|---|---:|
| new_moon | 95 |
| full_moon | 95 |
| waxing_or_waning_gibbous | 70 |
| first_or_third_quarter | 40 |
| waxing_or_waning_crescent | 20 |

### 5L. Precipitation Scoring

#### Freshwater

| Condition | `component_pct` |
|---|---:|
| light_rain | 92 |
| no_precip_stable | 52 |
| moderate_rain | 45 |
| post_light_rain_clearing | 54 |
| heavy_rain | 10 |
| post_heavy_rain_48hr | 6 |

#### Saltwater

| Condition | `component_pct` |
|---|---:|
| no_precip | 62 |
| current_rain_any_intensity | 58 |
| post_major_storm | 30 |
| extreme_storm_surge | 5 |

#### Brackish

| Condition | `component_pct` |
|---|---:|
| no_precip_stable | 62 |
| light_rain | 60 |
| moderate_rain | 35 |
| heavy_rain | 8 |
| post_heavy_rain_48hr | 5 |
| post_light_rain_clearing | 60 |

If `salinity_disruption_alert` is active:

- force brackish precipitation score to `0`

### 5M. Raw Score Formula

```text
available_component_points = sum(all non-null component scores for selected water_type)

available_weight_points = sum(all weights whose component score is non-null
for selected water_type)

raw_score = round((available_component_points / available_weight_points) * 100)
```

The sum must always be an integer from `0` to `100`.

Missing-data scoring rules:

- if a component is `unavailable`, exclude both its score and its weight from the formula
- if a component is `not_applicable` for the selected water type, it must already be absent from the weight table
- if `available_weight_points = 0`, return `raw_score = 0` and `reliability_tier = very_low_confidence`
- compute `coverage_pct = round((available_weight_points / total_possible_weight_points_for_water_type) * 100)`
- map `reliability_tier` from `coverage_pct` as:
  - `high` if `coverage_pct >= 85`
  - `degraded` if `70 <= coverage_pct <= 84`
  - `low_confidence` if `50 <= coverage_pct <= 69`
  - `very_low_confidence` if `coverage_pct < 50`

### 5N. Raw Score Interpretation

| Raw Score | Rating |
|---|---|
| 88–100 | Exceptional |
| 72–87 | Excellent |
| 55–71 | Good |
| 38–54 | Fair |
| 20–37 | Poor |
| 0–19 | Tough |

---

## SECTION 6 — RECOVERY MODIFIER {#section-6}

### 6A. Cold Front Detection

A cold front event is detected when:

1. pressure drops at least `4 mb` within any `12-hour` window
2. then rises at least `4 mb` within the next `24 hours`

Use hourly pressure history from the last 7 days.

### 6B. Recovery Multipliers

| Days Since Front | Freshwater | Saltwater | Brackish |
|---|---:|---:|---:|
| 0 | 0.35 | 0.55 | 0.45 |
| 1 | 0.45 | 0.65 | 0.55 |
| 2 | 0.60 | 0.78 | 0.69 |
| 3 | 0.75 | 0.88 | 0.82 |
| 4 | 0.88 | 0.95 | 0.92 |
| 5 | 0.95 | 1.00 | 0.98 |
| 6+ or none | 1.00 | 1.00 | 1.00 |

Brackish multiplier is the midpoint between freshwater and saltwater and is fixed to the values above.

### 6C. Final Score

```text
adjusted_score = round(raw_score * recovery_multiplier)
```

The `adjusted_score` is the authoritative score used by consuming features.

---

## SECTION 7 — TIME WINDOW ENGINE {#section-7}

The engine must produce best and worst fishing windows for the current local day.

### 7A. Resolution

Score the day in 30-minute blocks from local `00:00` to `23:30`.

### 7B. Window Score Additions

| Factor | Points |
|---|---:|
| block inside dawn window | +35 |
| block inside dusk window | +35 |
| block inside major solunar window (`freshwater`, `brackish`) | +20 |
| block inside minor solunar window (`freshwater`, `brackish`) | +12 |
| block inside major solunar window (`saltwater`) | +8 |
| block inside minor solunar window (`saltwater`) | +4 |
| block inside first 2 hours of incoming or outgoing tide (`saltwater`, `brackish`) | +25 |
| block inside mid incoming or mid outgoing tide (`saltwater`, `brackish`) | +15 |
| `tide_strength` above_average or strong (`saltwater`, `brackish`) | +10 |
| pressure currently falling | +15 |
| cloud cover > 60% | +8 |
| night block | +5 |

### 7C. Window Classification

Window scoring must follow the same missing-data normalization concept as Section 5M.

For each 30-minute block:

```text
block_points = sum(all achieved point additions whose inputs are available)

available_block_max = sum(all point additions that are evaluable for that block
and selected water type)

window_score = round((block_points / available_block_max) * 100)
```

Rules:

- if a factor cannot be evaluated for the block because required inputs are unavailable, exclude it from `available_block_max`
- if `available_block_max = 0`, set `window_score = 0`

| Window Score | Label |
|---|---|
| 65+ | PRIME |
| 45–64 | GOOD |
| 25–44 | SECONDARY |
| below 25 | not displayed as recommended |

Merge contiguous blocks of the same label into one displayed window.

### 7D. Worst Windows

Worst windows are contiguous blocks with the lowest scores, typically driven by:

- full sun midday
- slack tide or minimal tide movement
- stable/rising high pressure
- outside solunar windows
- heat stress or cold suppression state

At least one `worst_window` must always be returned.

### 7E. Edge-Case Rules (Time-Window Overrides)

The engine applies narrow deterministic override rules that reflect dominant biological constraints when one environmental force temporarily outweighs the usual timing mix. These rules adjust block scores after base scoring; they do not replace the base weighting architecture. See `ENGINE_EDGECASE_RULES_IMPLEMENTATION_PLAN.md` for full rationale and honesty requirements.

| Rule | Trigger | Effect |
|------|---------|--------|
| Freshwater cold-season midday warming | FW, cold zone (near_shutdown/lethargic/transitional), DJF/MAM | Already in base scoring via reduced dawn/dusk bonus, added midday warm bonus |
| Freshwater summer heat suppression | FW, thermal_stress_heat or peak_aggression, midday full/partly cloudy | Suppress midday blocks (-18 pts), add `heat_suppression_midday` driver |
| Freshwater rapid warming late-day shift | FW, rapid_warming or warming trend, cold zone | Bonus to late morning–afternoon (+12), `rapid_warming_late_day_bonus` driver |
| Freshwater overcast extension | FW, cloud ≥70%, not thermally stressed | Soften midday penalties (+8), `overcast_extension` driver |
| Post-front bluebird compression | recovery_active, pressure rising, clear light | Reduce block score (-10 pts), prevent PRIME, and cap remaining surfaced windows at GOOD; marginal windows may drop out entirely, `post_front_compression` driver |
| Saltwater slack-tide dominance cap | SW, tide phase slack or final_hour | Cap block score to prevent PRIME on dead movement, `slack_cap_applied` driver |
| Brackish runoff (precip proxy) | Brackish, salinity_disruption_alert | Penalize outgoing windows, favor incoming, `runoff_*` drivers |
| Cold inshore/brackish midday warming | Brackish, or saltwater with weaker/protected-style movement context, cold zone, midday warming window | Modest midday bonus (+10) unless strong incoming; not a broad open-coast saltwater rule, `cold_inshore_midday_warming` driver |

**Honesty requirement:** Brackish runoff logic uses precipitation as a freshwater-influx / salinity-disruption proxy only. The engine must never claim measured salinity; reports must describe it as rainfall-driven inference.

---

## SECTION 8 — BEHAVIOR INFERENCE LAYER {#section-8}

This layer converts score outputs into machine-readable fish-behavior states for downstream features.

### 8A. Required Behavior Outputs

The engine must return:

- `metabolic_state`
- `aggression_state`
- `positioning_bias`
- `feeding_timer`
- `presentation_difficulty`
- `dominant_positive_drivers`
- `dominant_negative_drivers`
- `active_alerts`

### 8B. Metabolic State

Direct mapping from water temperature zone:

| Zone | `metabolic_state` |
|---|---|
| near_shutdown_cold | shutdown |
| lethargic | lethargic |
| transitional | building |
| active_prime | active |
| peak_aggression | aggressive |
| thermal_stress_heat | suppressed_heat |

If `cold_stun_alert` is active, override to `cold_stun`.

### 8C. Aggression State

Map from `adjusted_score`:

| Adjusted Score | `aggression_state` |
|---|---|
| 0–19 | shut_down |
| 20–37 | negative |
| 38–54 | cautious |
| 55–71 | active |
| 72–87 | strong_feed |
| 88–100 | peak_feed |

Override rules:

- if `metabolic_state` is `shutdown`, cap aggression at `negative`
- if `metabolic_state` is `suppressed_heat`, cap aggression at `cautious`
- if `cold_stun_alert` is active, force aggression to `shut_down`

### 8D. Feeding Timer

| Water Type | `feeding_timer` |
|---|---|
| freshwater | `light_solunar` |
| saltwater | `tide_current` |
| brackish | `tide_plus_solunar` |

### 8E. Presentation Difficulty

| Aggression State | `presentation_difficulty` |
|---|---|
| shut_down | finesse_only |
| negative | difficult |
| cautious | moderate |
| active | standard |
| strong_feed | favorable |
| peak_feed | easiest_window |

### 8F. Positioning Bias Rules

The engine must output one primary `positioning_bias` and zero or more secondary tags.

#### Freshwater

| Condition | Primary Bias |
|---|---|
| dawn/dusk plus active metabolic state | `shallow_feeding_edges` |
| midday full sun or stable high pressure | `shade_depth_structure` |
| lethargic or near-shutdown | `deepest_stable_water` |
| rapid warming into active zone | `warming_flats_and_transitions` |
| rapid cooling but still active | `first_drop_and_transition_edges` |

Secondary tags:

- `windward_banks` if freshwater wind `component_pct >= 85`
- `low_light_surface_window` if dawn/dusk overcast

#### Saltwater

| Condition | Primary Bias |
|---|---|
| active tide plus above-average or strong tide strength | `current_breaks_cuts_passes_flats` |
| slack tide or minimal movement | `deeper_edges_channels_adjacent_structure` |
| thermal stress heat | `cooler_deeper_current_refuge` |
| cold stun alert | `warmest_available_refuge` |

Secondary tags:

- `windward_bait_push` if `wind_tide_relation = wind_with_tide` and wind `component_pct >= 85`
- `night_current_window` if night and strong tide strength

#### Brackish

| Condition | Primary Bias |
|---|---|
| active tide and normal salinity stability | `creek_mouths_oyster_bars_tidal_cuts` |
| salinity disruption alert | `higher_salinity_inlets_and_passes` |
| midday full sun and stable/rising pressure | `deeper_drains_dropoffs_and_shade` |
| rapid warming into active zone | `warming_flats_adjacent_to_escape_depth` |

Secondary tags:

- `wind_driven_shoreline_push` if wind `component_pct >= 85`
- `solunar_overlay_active` if current block is inside major solunar window

### 8G. Dominant Drivers

The engine must return:

- top 3 positive component contributors
- top 3 negative suppressors

Sort by:

1. absolute component score contribution
2. biological severity for alerts and hard suppressors

Hard suppressors that must always appear when active:

- `cold_stun_alert`
- `salinity_disruption_alert`
- `near_shutdown_cold`
- `thermal_stress_heat`
- `rapidly_rising_pressure`

---

## SECTION 9 — ENGINE OUTPUT CONTRACT {#section-9}

The engine must return a single structured JSON object.

```json
{
  "engine": "fishing_core_intelligence_v1",
  "water_type": "saltwater",
  "location": {
    "lat": 28.0836,
    "lon": -82.5716,
    "timezone": "America/New_York",
    "coastal": true,
    "nearest_tide_station_id": "8726520"
  },
  "environment": {
    "air_temp_f": 71,
    "water_temp_f": 68,
    "water_temp_source": "noaa_coops",
    "water_temp_zone": "active_prime",
    "wind_speed_mph": 9,
    "wind_direction": "SW",
    "cloud_cover_pct": 65,
    "pressure_mb": 1008.4,
    "pressure_change_rate_mb_hr": -0.8,
    "pressure_state": "slowly_falling",
    "precip_48hr_inches": 0.0,
    "precip_7day_inches": 1.2,
    "moon_phase": "waxing_gibbous",
    "moon_illumination_pct": 78,
    "solunar_state": "outside_all_windows",
    "tide_phase_state": "incoming_first_2_hours",
    "tide_strength_state": "above_average_movement",
    "range_strength_pct": 74
  },
  "scoring": {
    "weights": {
      "tide_phase": 20,
      "tide_strength": 17,
      "water_temp_zone": 19,
      "pressure": 14,
      "wind": 8,
      "light": 8,
      "temp_trend": 6,
      "solunar": 4,
      "moon_phase": 2,
      "precipitation": 2
    },
    "component_status": {
      "tide_phase": "available",
      "tide_strength": "available",
      "water_temp_zone": "fallback_used",
      "pressure": "available",
      "wind": "available",
      "light": "available",
      "temp_trend": "available",
      "solunar": "available",
      "moon_phase": "available",
      "precipitation": "available"
    },
    "components": {
      "tide_phase": 18,
      "tide_strength": 13,
      "water_temp_zone": 15,
      "pressure": 11,
      "wind": 7,
      "light": 4,
      "temp_trend": 4,
      "solunar": 1,
      "moon_phase": 1,
      "precipitation": 1
    },
    "coverage_pct": 100,
    "reliability_tier": "high",
    "raw_score": 75,
    "recovery_multiplier": 1.0,
    "adjusted_score": 75,
    "overall_rating": "Excellent"
  },
  "behavior": {
    "metabolic_state": "active",
    "aggression_state": "strong_feed",
    "feeding_timer": "tide_current",
    "presentation_difficulty": "favorable",
    "positioning_bias": "current_breaks_cuts_passes_flats",
    "secondary_positioning_tags": ["windward_bait_push"],
    "dominant_positive_drivers": ["incoming_tide", "above_average_tidal_range", "active_prime_water_temp"],
    "dominant_negative_drivers": ["outside_solunar_window"]
  },
  "data_quality": {
    "missing_variables": [],
    "fallback_variables": ["water_temp_f"],
    "notes": []
  },
  "alerts": {
    "cold_stun_alert": false,
    "cold_stun_status": "evaluated",
    "salinity_disruption_alert": false,
    "salinity_disruption_status": "evaluated"
  },
  "time_windows": [
    {
      "label": "PRIME",
      "start_local": "06:30",
      "end_local": "08:30",
      "window_score": 72,
      "drivers": ["dawn_window", "incoming_first_2_hours", "above_average_tide_strength"]
    }
  ]
}
```

### 9A. Output Requirements

- All enum strings must be stable and machine-readable.
- All times must be local to the run location.
- All scores must be integers except `recovery_multiplier`.
- Missing unavailable variables must be explicit, never silently omitted.
- If a variable does not apply for a water type, its weight must be absent from that run's `weights` object.
- `coverage_pct`, `reliability_tier`, `component_status`, and explicit missing/fallback lists are required output fields.

---

## SECTION 10 — CACHING AND IMPLEMENTATION RULES {#section-10}

### 10A. Recommended Cache Durations

| Data | TTL |
|---|---|
| current weather | 30 minutes |
| 7-day history | 6 hours |
| moon / solunar | 24 hours |
| tide predictions | 2 hours |
| 30-day tide range baseline | 24 hours |
| core engine output | 30 minutes |

### 10B. Hard Implementation Rules

1. The engine must be implemented as deterministic code in the backend.
2. The LLM must never perform scoring, routing, or alert detection.
3. The same environmental snapshot may be reused across `freshwater`, `saltwater`, and `brackish` runs, but each run must use its own weight table.
4. Every component score must be inspectable for transparency.
5. Any severe alert must be returned both as a boolean and as a stable enum in the positive/negative driver lists.
6. This engine is the single source of truth for environmental fish-state inference across the app.
7. The engine must not fail closed when some components are missing; it must normalize over available components and emit explicit data-quality metadata.
8. The engine must never invent missing environmental values with the LLM or with undocumented heuristics.

### 10C. Non-Negotiable V1 Boundaries

- No species-specific scoring in this engine.
- No lure/fly logic in this engine.
- No image interpretation in this engine.
- No user-entered subjective overrides in this engine.

---

*End of Specification — This engine is the shared deterministic environmental intelligence layer for TightLines AI. All downstream features must consume this layer rather than recreating their own weather, tide, temperature, or fish-state logic.*
