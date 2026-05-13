# Today's Bite Renovation Plan

Source of truth for renovating FinFindr's deterministic "Today's Bite" / "How's Fishing Right Now" feature.

This document is intentionally detailed. It is meant to prevent the new scoring model from becoming another large, hard-to-reason-about system. The goal is a cleaner engine that scores conditions the way fish actually react: trend, stability, disruption, water type, region, month, and hard environmental limits.

Last updated: 2026-05-12

## 1. Scope

This plan covers the deterministic condition engine used by:

- Today's Bite / How's Fishing reports.
- 7-day forecast score chips.
- Home dashboard Today's Score display.
- The lure/fly recommender's daily scenario builder.

Important coupling:

- The recommender does not use the generated report prose (`summary_line`, `actionable_tip`, `drivers`, `suppressors`, timing copy).
- The recommender does use shared condition analysis through the How's Fishing engine.
- Any change to shared normalized variables, score, temperature labels, hydrology labels, wind/light labels, or pressure labels can affect recommender scenario tags and final lure/fly picks.

Primary engine path today:

- `supabase/functions/_shared/howFishingEngine/request/buildFromEnvData.ts`
- `supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts`
- `supabase/functions/_shared/howFishingEngine/normalize/*`
- `supabase/functions/_shared/howFishingEngine/score/scoreDay.ts`
- `supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts`
- `supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts`

Recommender coupling path:

- `supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/buildCandidatePool.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts`

## 2. Renovation Goal

The current engine leans too heavily on static region/month temperature bands, then applies trend as a small adjustment. That makes the system brittle. A table can be "correct" in one species context but wrong for a general daily read, and the engine can still produce confident-sounding verbal output.

The renovated model should:

1. Score fish reaction, not raw weather.
2. Treat temperature as the most important and most context-sensitive variable.
3. Use small, stable base weights by water type.
4. Use region/month context mostly inside each variable's interpretation, not as scattered global overrides.
5. Use hard caps for conditions that should biologically limit the whole day.
6. Keep river hydrology practical by using a precip-based runoff/hydrology proxy now, with optional gauge/flow data later.
7. Preserve recommender quality by validating every scoring change against recommender scenario outputs.

## 3. Non-Negotiable Design Principles

### 3.1 Behavior-first variables

Each variable must answer one behavioral question:

- Temperature: Are fish thermally comfortable, improving, stable, or shocked?
- Hydrology / runoff proxy: Is moving water fishable, stable, dirty, elevated, or blown out?
- Rain / precip: Is active/recent rain creating feeding opportunity, visibility issues, or disruption?
- Pressure: Is the barometer creating a feeding trigger, post-front recovery, or instability?
- Wind: Is wind helping cover/oxygen/movement or hurting control/safety?
- Light / cloud: Is light helping confidence/visibility or suppressing fish by glare, heat, or darkness?
- Tide / current: Is coastal water moving enough, too little, or too hard for the water type?

### 3.2 Small stable weights, rich variable logic

Do not solve regional complexity by constantly rewriting global weights. Keep water-type base weights stable. Let each variable's internal interpretation handle region/month differences.

Allowed weight modifications:

- Month modifiers: small, generally -4 to +4 points before normalization.
- Region modifiers: small, generally -4 to +4 points before normalization.
- No variable should move so far that the engine becomes unrecognizable by region.

### 3.3 General daily score, not species-specific

This is not a largemouth-only, trout-only, or striper-only score. It should represent broad fishability for a user-selected water type. Seasonal migrations matter, especially in coastal and coldwater regions, but they should not make the general score overfit one species.

### 3.4 Data honesty

If a key input is missing, the engine should:

- Omit that variable from active scoring.
- Redistribute weights.
- Lower reliability.
- Avoid pretending missing values are zero.

This is especially important for river hydrology. Missing 7-day precip should not be treated as "no runoff."

### 3.5 Adapter consistency before scoring cleverness

The input adapter must not compare unlike values. A known issue today:

- Forecast/today snapshot mode can use noon hourly air temp as `daily_mean_air_temp_f`.
- Prior days remain true daily means.
- Trend logic then compares noon today to mean prior days, which can create fake warming/cooling.

Fix source consistency before trusting any new temperature model.

## 4. Score Shape

Each variable emits:

```text
variable_reaction_score: -2.0 to +2.0
```

Meaning:

- `+2.0`: strong fish-behavior advantage.
- `+1.0`: helpful.
- `0.0`: background/neutral.
- `-1.0`: limiting.
- `-2.0`: major suppressor.

Composite score:

```text
raw_weighted_sum = sum(variable_reaction_score * active_weight_percent)

if raw_weighted_sum >= 0:
  score_pre_caps = 50 + raw_weighted_sum / 3.2
else:
  score_pre_caps = 50 + raw_weighted_sum / 4.0

score = clamp(round(score_pre_caps), 10, 100)
score = apply_behavioral_caps(score, condition_flags)
score = apply_small_alignment_boosts(score, condition_flags)
```

Reason for initially preserving the current positive/negative divisors:

- Keeps score magnitude familiar while variable logic changes.
- Makes old-vs-new shadow diffs easier to interpret.
- Calibration can revisit divisors after the shadow matrix stabilizes.

Score bands:

- `Prime`: 80-100
- `Good`: 65-79
- `Fair`: 50-64
- `Poor`: 35-49
- `Tough`: 10-34

## 5. Base Weights By Water Type

These base weights sum to 100 for each water type.

### 5.1 Lake / Pond

Lake/pond is top priority. Still water is highly temperature-driven, then shaped by light, wind, pressure, and precip.

| Variable | Base Weight |
| --- | ---: |
| Temperature | 35 |
| Light / Cloud | 18 |
| Wind | 17 |
| Pressure | 17 |
| Rain / Precip | 13 |

Why:

- Temperature is the primary metabolic and seasonal variable in still water.
- Light and wind shape feeding confidence, visibility, oxygen mixing, and cover.
- Pressure matters, but should not overpower thermal reality.
- Rain matters in lakes, but usually through visibility, inflow, cooling, and disruption rather than whole-system flow.

### 5.2 River

River is top priority. Since universal gauge flow is not available, this model uses a hydrology/runoff proxy based on precip windows and region/month sensitivity.

| Variable | Base Weight |
| --- | ---: |
| Hydrology / Runoff Proxy | 34 |
| Temperature | 30 |
| Pressure | 14 |
| Light / Cloud | 12 |
| Wind | 10 |

Why:

- River fishability is dominated by water condition: stable, rising, dirty, clearing, or blown out.
- Temperature is still a major driver, especially for trout, bass, walleye, salmonids, and warmwater river systems.
- Pressure can trigger feeding but cannot rescue a blown river.
- Light matters in clear low water and heat.
- Wind is usually secondary in moving water unless it becomes a control/safety issue.

### 5.3 Inshore Coastal

Inshore is tide/current first, then wind and temperature.

| Variable | Base Weight |
| --- | ---: |
| Tide / Current | 40 |
| Wind | 20 |
| Temperature | 16 |
| Pressure | 10 |
| Light / Cloud | 10 |
| Rain / Precip | 4 |

Why:

- Moving tide/current is the main inshore feeding clock.
- Wind affects safety, bait movement, clarity, and fishability.
- Temperature matters, but broad inshore species tolerate more variance than many freshwater systems.
- Rain is low weight unless it creates freshwater discharge, dirty water, or storm conditions.

### 5.4 Flats / Estuary

Flats/estuary is still tide-driven, but wind and light matter more than broad inshore because skinny water depends on visibility, stealth, casting control, and fish comfort.

| Variable | Base Weight |
| --- | ---: |
| Tide / Current | 30 |
| Wind | 22 |
| Temperature | 18 |
| Light / Cloud | 16 |
| Pressure | 10 |
| Rain / Precip | 4 |

Why:

- Tide moves fish and bait on/off flats.
- Wind can quickly ruin sight, drift, casting, or safety.
- Light can help visibility but hurt stealth/glare depending sky and water clarity.
- Temperature can dominate shallow water in winter cold snaps and summer heat.

## 6. Supported Regions

Canonical region keys:

| Region Key | Broad Behavior Family | Freshwater Notes | River Hydrology Proxy Sensitivity | Coastal / Flats Notes |
| --- | --- | --- | --- | --- |
| `northeast` | cold continental | cold winters, strong spring/fall transitions, summer heat possible but not tropical | high | strong spring/fall coastal migrations; tide remains dominant |
| `southeast_atlantic` | warm humid | long warm season, spring/fall strong, summer heat suppression | medium | inshore redfish/seatrout/flounder style systems; rain can affect estuaries |
| `florida` | hot humid / subtropical | winter/spring prime, summer heat stress common | low | flats/inshore can be cold-snap sensitive in winter and heat-limited in summer |
| `gulf_coast` | hot humid | strong spring/fall, summer heat, mild winters | medium | tide/wind important; marsh/estuary rain can matter locally |
| `great_lakes_upper_midwest` | cold continental / big lake buffered | cold-tolerant mix; spring and fall excellent; lake thermal inertia matters | high | maps to nearest coastal temp family only when coastal contexts are used |
| `midwest_interior` | continental | strong spring/fall, hot summer, cold winter | high | no primary coastal behavior |
| `south_central` | warm humid / hot summer | excellent spring/fall, summer heat, mild winter warmups | medium | limited coastal mapping only through nearest family if needed |
| `mountain_west` | high interior | cold nights, altitude effects, snowmelt periods | medium | no primary coastal behavior |
| `southwest_desert` | hot arid | extreme heat management, winter/spring windows, monsoon disruptions | high | coastal mapping only as fallback; freshwater heat is dominant |
| `southwest_high_desert` | high arid / continental | cold winters, hot summers, large diurnal swings | high | no primary coastal behavior |
| `pacific_northwest` | maritime cool | cool wet winters, long spring, moderate summer, fall salmon/trout movement | high | coastal tide/wind/upwelling/fog matter |
| `southern_california` | hot arid / marine influence | mild winter, strong spring, summer heat in inland waters | high | coastal/inshore often good; wind/upwelling/light matter |
| `mountain_alpine` | alpine cold | short season, cold water, trout/kokanee, snowmelt risk | high | coastal mapping is fallback only |
| `northern_california` | mixed maritime/foothill | spring/fall strong, summer heat inland, coastal fog belt influence near coast | high | NorCal coast is wind/upwelling/tide sensitive |
| `appalachian` | cool highland / warm humid edge | cooler than lowland South, trout/bass mix, spring/fall important | high | coastal mapping fallback to southeast-atlantic if ever needed |
| `inland_northwest` | continental steppe / canyon | cold winter, hot/dry summer, spring/fall strong | medium | coastal mapping fallback to PNW |
| `alaska` | subarctic / cold maritime | short open-water season, salmonids, cold/dark winters | high | coastal seasonality and wind/tide matter heavily |
| `hawaii` | tropical marine | stable warm temps, rain/runoff/trade winds more important than season | medium | flats/offshore/inshore tropical; windward rain/runoff can matter |

## 7. Region-Month Thermal Phase Table

The temperature model should use phase context instead of giant static score tables as the main truth. Existing temp rows may still be used as guardrails and labels, but not as the primary score.

Phase codes:

- `COLD`: true cold season. Stable cold is limiting; warming helps; sharp cooldown hurts.
- `WINTER_WARM`: winter/mild season where above-normal warmth can improve activity.
- `WARMUP`: warming/pre-spawn/ice-out/spring transition. Gentle warming and stability are strong positives.
- `PRIME`: broad seasonal comfort. Stability is more important than direction.
- `HEAT`: heat-management season. Gentle cooling/cloud/rain relief helps; warming and stagnant heat hurt.
- `FALL`: cooling/fall-feed transition. Gentle cooling or stable seasonal comfort helps; sharp cooldown hurts.
- `LATE_FALL`: late fall sliding toward winter. Stability and mild warmth help; sharp cold hurts.
- `TROPICAL`: weak thermal seasonality. Stability, rain/runoff, wind, and light dominate.

| Region | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| northeast | COLD | COLD | WINTER_WARM | WARMUP | PRIME | PRIME | HEAT | HEAT | FALL | FALL | LATE_FALL | COLD |
| southeast_atlantic | WINTER_WARM | WARMUP | WARMUP | PRIME | PRIME | HEAT | HEAT | HEAT | FALL | FALL | PRIME | WINTER_WARM |
| florida | PRIME | PRIME | PRIME | PRIME | HEAT | HEAT | HEAT | HEAT | HEAT | FALL | PRIME | PRIME |
| gulf_coast | WINTER_WARM | WARMUP | PRIME | PRIME | HEAT | HEAT | HEAT | HEAT | HEAT | FALL | PRIME | WINTER_WARM |
| great_lakes_upper_midwest | COLD | COLD | WINTER_WARM | WARMUP | PRIME | PRIME | PRIME | PRIME | FALL | FALL | LATE_FALL | COLD |
| midwest_interior | COLD | COLD | WARMUP | PRIME | PRIME | HEAT | HEAT | HEAT | FALL | FALL | WINTER_WARM | COLD |
| south_central | WINTER_WARM | WARMUP | PRIME | PRIME | HEAT | HEAT | HEAT | HEAT | HEAT | FALL | PRIME | WINTER_WARM |
| mountain_west | COLD | COLD | WINTER_WARM | WARMUP | PRIME | PRIME | PRIME | PRIME | FALL | FALL | LATE_FALL | COLD |
| southwest_desert | WINTER_WARM | WARMUP | PRIME | HEAT | HEAT | HEAT | HEAT | HEAT | FALL | FALL | PRIME | WINTER_WARM |
| southwest_high_desert | COLD | WINTER_WARM | WARMUP | PRIME | PRIME | HEAT | HEAT | HEAT | FALL | FALL | WINTER_WARM | COLD |
| pacific_northwest | WINTER_WARM | WINTER_WARM | WARMUP | WARMUP | PRIME | PRIME | PRIME | PRIME | FALL | FALL | WINTER_WARM | WINTER_WARM |
| southern_california | WINTER_WARM | WARMUP | PRIME | PRIME | PRIME | HEAT | HEAT | HEAT | FALL | FALL | PRIME | WINTER_WARM |
| mountain_alpine | COLD | COLD | COLD | WARMUP | WARMUP | PRIME | PRIME | PRIME | FALL | FALL | COLD | COLD |
| northern_california | WINTER_WARM | WARMUP | WARMUP | PRIME | PRIME | PRIME | HEAT | HEAT | FALL | FALL | PRIME | WINTER_WARM |
| appalachian | COLD | WINTER_WARM | WARMUP | WARMUP | PRIME | PRIME | HEAT | HEAT | FALL | FALL | WINTER_WARM | COLD |
| inland_northwest | COLD | COLD | WARMUP | WARMUP | PRIME | PRIME | HEAT | HEAT | FALL | FALL | WINTER_WARM | COLD |
| alaska | COLD | COLD | COLD | WARMUP | WARMUP | PRIME | PRIME | PRIME | FALL | LATE_FALL | COLD | COLD |
| hawaii | TROPICAL | TROPICAL | TROPICAL | TROPICAL | TROPICAL | TROPICAL | TROPICAL | TROPICAL | TROPICAL | TROPICAL | TROPICAL | TROPICAL |

This table is a starting contract, not a free pass to ignore real local data. Absolute heat/cold guardrails still apply.

## 8. Variable Models

### 8.1 Temperature

Temperature is the most important and trickiest variable. It should be redesigned first after source consistency and shadow harness work.

#### Inputs

Required or useful:

- `daily_mean_air_temp_f`
- `daily_low_air_temp_f`
- `daily_high_air_temp_f`
- `prior_day_mean_air_temp_f`
- `day_minus_2_mean_air_temp_f`
- `hourly_air_temp_f` for timing, not for replacing daily mean score
- `measured_water_temp_f`
- `measured_water_temp_24h_ago_f`
- `measured_water_temp_72h_ago_f`
- `context`
- `region_key`
- `local_date` / month

Source rule:

- Freshwater score should use true daily mean air temperature unless a future reliable freshwater water-temp source exists.
- Coastal/inshore/flats should use measured coastal water temperature when available and reasonably fresh.
- If measured coastal water temp is used, compare water temp to water temp history, not air temp history.
- Do not compare noon temperature to prior daily means.

#### Behavioral question

Are fish thermally improving, stable, stressed, or shocked for this region/month/water type?

#### Core outputs

The new temperature normalizer should output structured fields:

```ts
thermal_phase:
  | "cold"
  | "winter_warm"
  | "warmup"
  | "prime"
  | "heat"
  | "fall"
  | "late_fall"
  | "tropical";

thermal_trend:
  | "stable"
  | "gentle_warming"
  | "strong_warming"
  | "sharp_warmup"
  | "gentle_cooling"
  | "strong_cooling"
  | "sharp_cooldown";

thermal_stability:
  | "stable"
  | "moving"
  | "unstable"
  | "shock";

thermal_stress:
  | "none"
  | "cold_limited"
  | "heat_limited"
  | "severe_cold"
  | "severe_heat";

temperature_reaction_score: number; // -2 to +2
```

Existing `band_label`, `trend_label`, `shock_label`, and `final_score` can be preserved for compatibility, but the new fields should be the behavioral truth.

#### Trend classification

Use same-source values:

```text
delta24 = today_mean - prior_day_mean
delta72 = today_mean - day_minus_2_mean
```

Classification:

| Trend | Rule |
| --- | --- |
| stable | abs(delta24) < 3F and abs(delta72) < 5F |
| gentle_warming | delta72 >= 3F and delta72 < 8F, no shock |
| strong_warming | delta72 >= 8F and delta72 < 16F, no shock |
| sharp_warmup | delta24 >= 10F, or delta72 >= 16F with final 24h leg >= 5F |
| gentle_cooling | delta72 <= -3F and delta72 > -8F, no shock |
| strong_cooling | delta72 <= -8F and delta72 > -16F, no shock |
| sharp_cooldown | delta24 <= -10F, or delta72 <= -16F with final 24h leg <= -5F |

#### Temperature phase reaction table

This table defines trend reaction before absolute stress adjustment.

| Phase | Stable | Gentle Warming | Strong Warming | Sharp Warmup | Gentle Cooling | Strong Cooling | Sharp Cooldown |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| COLD | -0.4 | +0.7 | +0.9 | -0.2 | -0.9 | -1.2 | -1.8 |
| WINTER_WARM | +0.2 | +1.0 | +1.1 | +0.2 | -0.5 | -0.9 | -1.6 |
| WARMUP | +0.5 | +1.3 | +1.0 | -0.1 | -0.6 | -1.0 | -1.8 |
| PRIME | +1.2 | +0.5 | +0.2 | -0.8 | +0.5 | +0.1 | -1.3 |
| HEAT | -0.2 | -0.6 | -1.0 | -1.7 | +1.0 | +0.5 | -0.4 |
| FALL | +0.7 | +0.2 | -0.1 | -0.7 | +1.0 | +0.6 | -1.5 |
| LATE_FALL | +0.2 | +0.7 | +0.5 | -0.3 | -0.4 | -0.8 | -1.7 |
| TROPICAL | +0.8 | +0.2 | 0.0 | -0.4 | +0.2 | 0.0 | -0.4 |

Rationale:

- In cold/winter periods, warming helps but shock is still bad.
- In warmup periods, gentle warming is the strongest thermal trigger.
- In prime periods, stability beats direction.
- In heat periods, cooling helps but sharp cooldown can still destabilize.
- In fall, gentle cooling can improve feeding, but hard cold fronts suppress.
- In tropical regions, temperature is usually secondary unless heat/cold stress appears.

#### Absolute stress adjustment

Absolute stress must use region/month guardrails. Existing temp band rows can be reused as guardrail lookup, but not as primary score truth.

Guardrail behavior:

| Thermal stress | Adjustment | Score cap |
| --- | ---: | ---: |
| none | 0 | none |
| mild cold_limited | -0.4 to -0.8 | 68 |
| severe_cold | -1.0 to -1.6 | 55 |
| mild heat_limited | -0.4 to -0.8 | 68 |
| severe_heat | -1.0 to -1.8 | 55 |
| lethal/unsafe stress if ever detected | force near -2 | 45 |

Do not let a "good trend" fully erase severe heat/cold. A hot Florida July cooling from 90F to 82F can improve from terrible to fishable, but should not become thermally "prime" unless the guardrail agrees.

#### Water-type differences

Lake/pond:

- Temperature receives the strongest weight.
- Still water responds strongly to stability and heat/cold stress.
- Summer heat stability should often be neutral-to-negative, not helpful.
- Spring warmup and fall cooling should be meaningful positives.

River:

- Temperature is second only to hydrology.
- Cold trout/salmonid rivers may tolerate cooler conditions better than warmwater lakes.
- Heat stress should be severe for trout-rich regions and summer low-water rivers.
- If hydrology is blown out, temperature cannot rescue the day.

Inshore:

- Use measured coastal water temp when available.
- Air temp should be a fallback and lower reliability.
- Tide/current remains more important than temperature.
- Cold snaps in Florida/Gulf/Southeast flats/inshore are high-impact.

Flats/estuary:

- Shallow water reacts faster to cold snaps, heat, sun, and wind.
- Temperature should matter more than broad inshore but less than tide/wind.
- Winter warmup can be very positive on flats.
- Summer severe heat should cap surface/skinny-water optimism.

#### Known recommender impact

Temperature affects:

- `thermal_mode`
- `cold_slow`
- `warming_search`
- `heat_finesse`
- `surface_daily_gate`
- `activity_level` through `hows_score`
- candidate scoring lanes for slow/subtle, heat bottom, active/warming search

Any change to temperature labels or score must be tested against recommender outputs.

### 8.2 Hydrology / Runoff Proxy For Rivers

This replaces the overloaded idea of "runoff / flow" as if direct flow data is universal. It is not. The practical v1 model should be explicit: a precip-based hydrology proxy.

#### Inputs

Required:

- `precip_24h_in`
- `precip_72h_in`
- `precip_7d_in`
- `region_key`
- `month`
- `temperature trend` for snowmelt/warm-rain risk where relevant

Optional future inputs:

- USGS gauge flow percentile.
- River stage trend.
- Snowpack/snowmelt model.
- Watershed saturation model.

Rule:

- If any of 24h, 72h, or 7d precip windows are missing, omit hydrology from river scoring and lower reliability.
- Do not impute missing hydrology windows as zero.

#### Behavioral question

Is the river likely stable and fishable, slightly elevated but workable, dirty/heavy, or blown out?

#### Sensitivity families

Start from existing region sensitivity, then add seasonal snowmelt risk.

| Sensitivity | Regions |
| --- | --- |
| Low | `florida` |
| Medium | `southeast_atlantic`, `gulf_coast`, `south_central`, `mountain_west`, `inland_northwest`, `hawaii` |
| High | `northeast`, `great_lakes_upper_midwest`, `midwest_interior`, `southwest_desert`, `southwest_high_desert`, `pacific_northwest`, `southern_california`, `mountain_alpine`, `northern_california`, `appalachian`, `alaska` |

Seasonal adjustment:

- `mountain_alpine`, `alaska`, `mountain_west`, `pacific_northwest`, `inland_northwest`, `northern_california`, and `great_lakes_upper_midwest` should increase hydrology risk in spring/early summer when warming + precip can imply snowmelt or cold runoff.
- `southwest_desert`, `southwest_high_desert`, and `southern_california` should treat heavy rain as flashier and more disruptive even when totals are modest.
- `florida` has lower broad river runoff sensitivity but can still score negative on heavy active/recent rain.

#### Scoring interpretation

| Proxy State | Score |
| --- | ---: |
| stable_clear | +0.8 to +1.3 |
| stable_normal | +0.4 to +0.9 |
| slightly_elevated | -0.1 to +0.5 |
| elevated_or_stained | -0.5 to -1.2 |
| blown_out_proxy | -1.5 to -2.0 |
| falling_clearing_proxy if detectable | +0.3 to +0.8 |

#### Caps

| Hydrology condition | Composite cap |
| --- | ---: |
| elevated_or_stained | max 65 unless temperature/pressure/light strongly align |
| blown_out_proxy | max 48 |
| blown_out_proxy + active precip | max 42 |
| missing hydrology windows | no cap, but reliability cannot be high |

#### Known recommender impact

Hydrology affects:

- `water_movement_mode`
- `dirty_vibration`
- `runoff_streamer`
- `current_swing`
- `surface_daily_gate` indirectly through activity level
- trout dirty-current mismatch logic

This is one of the most important recommender safety surfaces.

### 8.3 Rain / Precip

Rain is scored directly for lake/pond and coastal contexts. For rivers, rain feeds the hydrology proxy instead of appearing as a separate active scoring variable.

#### Inputs

- `active_precip_now`
- `precip_rate_now_in_per_hr`
- `precip_24h_in`
- `precip_72h_in`
- `precip_7d_in`
- `context`
- `region_key`
- `month`

#### Behavioral question

Is rain creating a helpful low-light/cooling/feeding nudge, a visibility/disruption problem, or a severe active-weather limit?

#### Scoring interpretation

| Rain State | Dry Baseline | Wet Baseline | Score |
| --- | --- | --- | ---: |
| no_recent_rain | yes | no | +0.1 to +0.4 |
| no_recent_rain | no | yes | 0 |
| light_mist | yes | no | 0 to +0.3 |
| light_mist | no | yes | -0.1 to 0 |
| light_active_rain | any | any | -0.1 to +0.2 depending heat/light |
| moderate_active_rain | any | any | -0.4 to -0.9 |
| heavy_active_rain | any | any | -1.2 to -2.0 |
| recent_rain_clearing | dry-to-normal | no | +0.1 to +0.5 |
| recent_rain_on_wet_baseline | no | yes | -0.4 to -1.2 |

Important:

- `active_precip_now === true` must not automatically mean heavy disruption.
- Rate and totals should determine active severity.
- Trace rain can help in heat, low light, and stale summer conditions.
- Recent rain on already wet ground should be negative.

#### Water-type differences

Lake/pond:

- Light rain can help with low light and cooling.
- Heavy rain can reduce visibility, change inflows, and create safety/usability issues.
- Long dry stability can be modestly positive but should not become a daymaker.

Inshore:

- Low direct weight.
- Heavy rain/freshwater discharge can hurt clarity/salinity.
- Light rain is often secondary to tide/wind.

Flats/estuary:

- Low direct weight but can matter through clarity and freshwater influence.
- Heavy rain after wet baseline should be more negative than in broad inshore.

River:

- Do not score rain separately.
- Feed hydrology proxy.

### 8.4 Pressure

Pressure is already closer to a behavior-first variable than temperature. Renovation should refine confidence and avoid overclaiming.

#### Inputs

- `pressure_history_mb`
- sample count / history quality
- 24h delta
- recent 3h swing
- direction changes
- recent stabilization

#### Behavioral question

Is pressure creating a feeding trigger, stable background, post-front recovery, or ongoing instability?

#### Scoring interpretation

| Pressure State | Score |
| --- | ---: |
| falling_slow | +0.4 to +1.0 |
| falling_moderate | +0.8 to +1.5 |
| falling_hard | -0.4 to +0.5 depending volatility |
| stable_neutral | -0.1 to +0.3 |
| recently_stabilizing | +0.2 to +0.6 |
| rising_slow | -0.1 to +0.3 |
| rising_fast | -0.5 to -1.2 |
| volatile | -1.2 to -2.0 |

Reliability:

- 2-point pressure history can score, but should lower reliability.
- Sparse pressure history should not generate strong surfaced copy.
- Good pressure should not overcome severe thermal, hydrology, wind, or heavy precip caps.

#### Water-type differences

Lake/pond:

- Pressure can be a meaningful feed trigger.
- It should never outweigh severe heat/cold.

River:

- Pressure is secondary to hydrology and temperature.
- Falling pressure can help if water is fishable.

Inshore/flats:

- Pressure is secondary to tide/wind.
- Strong pre-front feeding can matter, but unsafe wind/storms cap the day.

#### Known recommender impact

Pressure currently affects the recommender mostly through `hows_score` and `activity_level`, not direct candidate tags.

### 8.5 Wind

Wind should be scored as fishability + cover + oxygen/movement + control/safety, not as a generic mph bucket.

#### Inputs

- daylight/fishable-hour wind mean
- current wind if live mode lacks hourly
- daily max wind as fallback for forecast days
- gusts if available later
- context
- region/month for safety and seasonal expectations

Adapter rule:

- Prefer daylight/fishable-hour wind for daily score.
- Do not let overnight wind dominate the daily score.
- For future days, do not use live current wind.

#### Behavioral question

Is wind creating useful chop/movement/cover, or hurting control, visibility, presentation, and safety?

#### Scoring interpretation by water type

Lake/pond:

| Wind | Score |
| --- | ---: |
| glass calm, bright/clear | -0.3 to 0 |
| calm, overcast/cold | 0 to +0.2 |
| light breeze | +0.4 to +0.8 |
| moderate chop | +0.6 to +1.1 |
| strong wind | -0.4 to -1.2 |
| extreme/dangerous | -1.5 to -2.0 |

River:

| Wind | Score |
| --- | ---: |
| calm-light | 0 |
| moderate | -0.1 to +0.2 |
| strong | -0.5 to -1.2 |
| extreme/dangerous | -1.5 to -2.0 |

Inshore:

| Wind | Score |
| --- | ---: |
| calm | 0 to +0.2 |
| light/moderate | +0.5 to +1.2 |
| strong but fishable | -0.2 to -1.0 |
| unsafe/extreme | -1.5 to -2.0 |

Flats/estuary:

| Wind | Score |
| --- | ---: |
| calm with harsh light | -0.2 to 0 |
| light breeze | +0.3 to +0.8 |
| moderate wind | 0 to +0.4 |
| strong wind | -0.8 to -1.5 |
| extreme/dangerous | -2.0 |

#### Caps

| Wind condition | Composite cap |
| --- | ---: |
| extreme freshwater wind | max 50 |
| unsafe coastal/flats wind | max 45 |
| flats strong wind + bright glare | max 55 |

#### Known recommender impact

Wind affects:

- `wind_mode`
- `daylight_wind_mph`
- `wind_reaction`
- `dirty_vibration`
- `open_water_search`
- surface gates
- surface candidate hard gates

### 8.6 Light / Cloud

Light should be contextual. More cloud is not always better.

#### Inputs

- daylight/fishable-hour cloud mean
- cloud by daypart if available
- temperature phase/stress
- context
- water type

Adapter rule:

- Prefer daylight/fishable-hour cloud for daily score.
- Use hourly cloud for timing windows.
- Avoid using overnight cloud to score the fishing day.

#### Behavioral question

Is light helping fish feed confidently, extending low-light behavior, providing heat relief, or creating glare/visibility problems?

#### Scoring interpretation

Cold / winter-warm phases:

| Light State | Score |
| --- | ---: |
| clear sun | 0 to +0.4 |
| mixed cloud | 0 to +0.3 |
| heavy overcast | -0.2 to +0.3 |

Warmup / prime phases:

| Light State | Score |
| --- | ---: |
| harsh clear/glare | -0.6 to -1.0 |
| bright but not harsh | -0.2 to 0 |
| mixed cloud | +0.2 to +0.6 |
| low light / overcast | +0.6 to +1.2 |

Heat phases:

| Light State | Score |
| --- | ---: |
| harsh clear/glare | -0.8 to -1.4 |
| mixed cloud | +0.2 to +0.7 |
| heavy overcast / storm shade without heavy precip | +0.6 to +1.1 |

Flats:

- Very low cloud / high sun can help sight fishing but hurt stealth/glare.
- Score should not simply reward clear sky.
- Combine with wind: bright + calm + clear water tends toward subtle/negative; bright + slight ripple can be workable.

#### Known recommender impact

Light affects:

- `light_mode`
- `clear_subtle`
- `low_light_surface`
- `calm_surface` interaction
- surface gates
- visibility/profile candidate scoring

### 8.7 Tide / Current

Tide/current is only for coastal and flats/estuary contexts.

#### Inputs

- tide high/low events
- tide phase/stage
- current speed max if available
- tide height hourly if available later
- context: inshore vs flats/estuary

#### Behavioral question

Is the water moving enough to position bait and feeding fish, too slack, or too hard for the target water type?

#### Scoring interpretation

Inshore:

| Tide / Current State | Score |
| --- | ---: |
| weak/slack | -0.8 to -0.2 |
| moving | +0.5 to +1.1 |
| strong exchange | +1.2 to +2.0 |
| extreme/unfishable if ever detected | -0.5 to -1.5 |

Flats/estuary:

| Tide / Current State | Score |
| --- | ---: |
| slack | -0.3 to 0 |
| gentle movement | +0.5 to +1.2 |
| strong but fishable exchange | +0.8 to +1.5 |
| too hard / washing out skinny water | -0.5 to -1.2 |

#### Caps and priority

- Tide/current remains the highest weight for inshore and flats.
- Strong tide should not erase unsafe wind or severe active storm caps.
- Missing tide on a coastal context should lower reliability and may prevent coastal contexts from being shown, depending existing coastal eligibility.

#### Known recommender impact

Tide/current affects:

- current-sweep presentation tips in Today's Bite
- coastal surface/timing behavior
- candidate tags indirectly through score/activity and surface gates

## 9. Composite Caps And Boosts

Weights are not enough. Caps protect against mathematically good but biologically silly scores.

Caps should apply after weighted scoring.

| Condition Flag | Composite Cap |
| --- | ---: |
| `blown_out_proxy` river | 48 |
| `blown_out_proxy` + active precip | 42 |
| `severe_heat` | 55 |
| `severe_heat` with low-light/cloud/wind relief | 62 |
| `severe_cold` | 55 |
| `sharp_cooldown` in cold/warmup/fall | 58 |
| `dangerous_wind_freshwater` | 50 |
| `dangerous_wind_coastal_or_flats` | 45 |
| `heavy_active_precip` | 55 |
| `heavy_active_precip` + high wind | 45 |
| `low_reliability` | no hard cap by itself, but no `Prime` unless the active variables are strongly aligned |

Boosts should be small:

| Alignment Flag | Boost |
| --- | ---: |
| stable prime temperature + stable hydrology + usable light/wind | +3 to +5 |
| gentle warming in warmup phase + falling/moderate pressure + fishable wind | +3 to +6 |
| heat phase with cooling trend + overcast + manageable wind | +3 to +5 |
| fall cooling trend + stable water + usable light | +3 to +5 |
| strong tide + safe wind + non-disruptive rain | +3 to +5 coastal only |

Do not stack boosts beyond +8 total.

## 10. Reliability Rules

Reliability should describe confidence, not simply score quality.

High reliability:

- Most expected variables present.
- Pressure history adequate.
- For river, hydrology windows complete.
- For coastal, tide/current data present.
- Source values are same-kind comparisons.

Medium reliability:

- One important variable missing.
- Sparse pressure history.
- Coastal temperature uses air fallback instead of measured water.
- River hydrology present but partial quality concerns exist.

Low reliability:

- Fewer than three useful variables.
- River missing hydrology windows.
- Coastal missing tide/current.
- Adapter source notes indicate important fallback/mismatch.

No report copy should overstate precision when reliability is low.

## 11. Adapter Fixes Required Before Scoring Renovation

These must happen before changing the scoring model.

### 11.1 Daily mean consistency

Problem:

- Forecast/today snapshot mode can use noon air as daily mean.
- Prior values are true daily means.
- Trend becomes inconsistent.

Required fix:

- `daily_mean_air_temp_f` should always mean true daily mean from high/low, or a true 24h mean if available.
- `current_air_temp_f` or `noon_air_temp_f` can exist separately for display/timing.
- Temperature trend must compare same-source daily mean values.

### 11.2 Measured coastal water temperature

Problem:

- NOAA water temp is fetched and passed in, but temperature normalization ignores it.

Required fix:

- Coastal and flats contexts should use `measured_water_temp_f` when available.
- Trend should use measured water temp history when available.
- If water temp is used, `measurement_source` should be `coastal_water_temp`.
- If air fallback is used for coastal, reliability should downgrade.

### 11.3 Daylight wind/cloud

Problem:

- Daily wind/cloud scalars can overrepresent non-fishing hours.

Required fix:

- Add engine environment fields for daylight/fishable-hour wind and cloud, or compute them in adapter.
- Use daylight/fishable-hour aggregates for score.
- Keep hourly arrays for timing windows.

### 11.4 Precip semantics

Problem:

- Active precip can be too blunt.

Required fix:

- Separate active rate, daily total, 72h total, and 7d antecedent wetness.
- Do not let `active_precip_now` alone force severe disruption.
- If current precip value matches daily total, do not treat it as an hourly rate.

## 12. Recommender Impact Guardrails

The recommender must be monitored after each shared-engine change.

Fields to snapshot before and after:

- `hows_score`
- `activity_level`
- `thermal_mode`
- `water_movement_mode`
- `pressure_mode`
- `light_mode`
- `wind_mode`
- `surface_daily_gate`
- `surface_daily_reason_codes`
- `scenario_tags`
- selected lure IDs
- selected fly IDs
- finalist score reasons

Highest-risk tags:

- `cold_slow`
- `warming_search`
- `heat_finesse`
- `clear_subtle`
- `wind_reaction`
- `dirty_vibration`
- `runoff_streamer`
- `current_swing`
- `open_water_search`
- `low_light_surface`
- `calm_surface`

Policy:

- Prose-only Today's Bite changes are safe for recommender.
- Shared normalized variable changes are not automatically safe.
- Score changes that move `activity_level` across `suppressed`, `neutral`, and `active` thresholds require recommender review.
- Temperature changes require special review because they affect thermal tags and surface gates.
- Hydrology changes require special review because they affect trout/river dirty-current behavior.

## 13. Validation Strategy

### 13.1 Shadow engine before live replacement

Build a shadow scorer that can run old and new outputs side by side without changing live reports or recommender results.

Minimum comparison fields:

- old score
- new score
- old band
- new band
- old drivers
- new drivers
- old suppressors
- new suppressors
- normalized variable scores
- caps applied
- boosts applied
- reliability
- source notes

### 13.2 Matrix coverage

Synthetic matrix should cover:

- all 18 regions
- all 12 months
- all 4 water types where applicable
- lake/pond and river as top priority
- key weather scenarios:
  - stable prime
  - cold stable
  - gentle warming
  - sharp warmup
  - gentle cooling
  - sharp cooldown
  - heat stable
  - heat relief cloud/rain
  - dry stable
  - light rain
  - heavy active precip
  - wet baseline rain
  - stable river hydrology
  - elevated river hydrology
  - blown river proxy
  - falling pressure
  - rising pressure
  - volatile pressure
  - calm bright
  - useful breeze
  - dangerous wind
  - inshore strong tide
  - inshore slack tide
  - flats gentle tide
  - flats too-hard wind/current

### 13.3 Golden examples

The test suite should include human-readable golden scenarios, not only numeric unit tests.

Examples:

- Florida lake, July, stable 90F heat, bright/calm: not Good because pressure is nice.
- Florida lake, July, cooling from extreme heat with clouds: improved but not automatically Prime.
- Northeast lake, April, gentle warming after cold: strong improvement.
- Great Lakes lake, May, cool but stable: not harshly cold-limited.
- Midwest river, April, heavy recent rain: hydrology suppressor surfaces.
- Mountain alpine river, June, warming + wet week: snowmelt/runoff risk.
- PNW river, fall, stable flows + cooling: positive river read.
- Alaska July, stable open-water season: not cold-limited by lower temps.
- Hawaii, stable trade-wind day: temp not dominant.
- Inshore Northeast fall, good tide + safe wind: strong but not ignoring temp/storms.
- Florida flats winter cold snap: temperature can dominate despite tide.
- Flats summer bright/calm/heat: surface caution or closed unless low-light relief exists.

### 13.4 Recommender regression tests

For each representative scenario, compare:

- selected lure/fly IDs
- scenario tags
- candidate score reasons
- surface hard gates

Acceptable recommender changes:

- Changes that make biological sense and are explainable by new condition truth.
- Example: blown river generates `runoff_streamer` more consistently.
- Example: heat stress generates `heat_finesse` more consistently.

Unacceptable recommender changes:

- Random churn from labels only.
- Surface baits opening during heat/wind caps.
- Big-fish or all-purpose picks changing because score text changed.
- Cold/heat/warming tags caused by source mismatch.

## 14. Implementation Phases

### Phase 0: Planning document

Status: this document.

No engine code changes.

### Phase 1: Adapter/source consistency

Goals:

- Fix daily mean vs noon/current source mismatch.
- Add or expose daylight wind/cloud aggregates.
- Wire measured coastal water temp correctly.
- Preserve existing score behavior as much as possible.

Success criteria:

- Existing tests pass or are intentionally updated.
- New adapter tests prove same-source temperature trend.
- New coastal water-temp tests prove `measurement_source`.

### Phase 2: Shadow-mode scoring harness

Goals:

- Run old and new candidate scoring side by side.
- Produce JSON/Markdown audit output.
- Include recommender scenario diffs.

Success criteria:

- No live behavior changes.
- Matrix can run locally with deterministic output.
- Output is small enough to review but detailed enough to act on.

### Phase 3: Temperature reaction model

Goals:

- Add behavior-first temperature normalizer.
- Preserve compatibility fields.
- Add new behavioral fields.
- Add caps/flags for severe thermal stress.

Success criteria:

- Temperature golden cases pass.
- No source-mismatch trends.
- Recommender thermal tags are reviewed.

### Phase 4: Hydrology/rain renovation

Goals:

- Rename/define river concept as Hydrology / Runoff Proxy.
- Keep precip-based proxy as v1.
- Do not assume universal gauge flow.
- Separate lake/coastal rain from river hydrology.

Success criteria:

- River hydrology golden cases pass.
- Missing 7d precip omits hydrology and lowers reliability.
- Recommender river tags reviewed.

### Phase 5: Wind/light/pressure refinements

Goals:

- Use daylight/fishable-hour wind and cloud for score.
- Keep pressure behavior but refine sparse-history confidence.
- Add light-temperature interactions.

Success criteria:

- Bright cold days are not falsely penalized.
- Bright hot/calm days are not falsely rewarded.
- Useful wind is rewarded; dangerous wind caps.

### Phase 6: Composite caps and calibration

Goals:

- Add caps/boosts after weighted score.
- Keep caps transparent in debug output.
- Calibrate final score distribution.

Success criteria:

- Blown rivers cannot score Good.
- Severe heat/cold cannot score Prime.
- Stable aligned days can still reach Good/Prime.
- Home dashboard score remains explainable.

### Phase 7: Recommender impact audit and adjustment

Goals:

- Run recommender diff matrix.
- Identify intended vs unintended pick changes.
- Adjust scenario mapping only where needed.

Success criteria:

- No unexplained lure/fly churn.
- Surface gates stay sensible.
- Existing catalog validation and daily-picks tests pass.

### Phase 8: UI/copy polish

Goals:

- Make report prose reflect new behavioral fields.
- Avoid saying "temperature is a problem" when the model means "unstable trend" or "edge of window."
- Keep user-facing language specific but not overconfident.

Success criteria:

- Copy reflects score causes.
- Low reliability copy is honest.
- No recommender code depends on prose.

## 15. Implementation Rules For Working Agents

Any agent implementing this renovation must follow these rules:

1. Do not start by tuning random thresholds.
2. Do not edit recommender behavior without a recommender diff.
3. Do not change report prose to hide scoring errors.
4. Do not treat missing hydrology as dry/stable.
5. Do not compare current/noon temp to prior daily means.
6. Do not assume direct river flow data exists everywhere.
7. Do not make region/month weight tables huge.
8. Do not remove existing debug fields until replacements are proven.
9. Preserve deterministic behavior.
10. Add tests before flipping live behavior.

## 16. Definition Of Done

The renovation is done when:

- Lake/pond scores are sensible across all regions/months.
- River scores are sensible using the hydrology proxy and do not overrate blown conditions.
- Inshore and flats/estuary scores remain tide-aware and water-type-specific.
- Temperature behavior is explainable without relying on giant static score bands.
- Source data comparisons are consistent.
- Score drivers/suppressors match the score.
- Report copy no longer signals deeper engine confusion.
- Home dashboard score aligns with report scores.
- Recommender scenario tags and picks are audited and intentionally preserved or improved.
- All relevant Deno tests pass.
- Shadow audit shows no unexplained region/month/water-type failures.
