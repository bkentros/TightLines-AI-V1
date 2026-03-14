# TightLines AI — Intelligence Engine Overview

## Architecture

```
GPS Coords → get-environment (Open-Meteo, NOAA, Solunar API)
         → EnvironmentSnapshot
         → Core Intelligence Engine (deterministic scoring)
         → LLM Narrative Layer (Claude Haiku 4.5)
         → FeatureBundle → Client UI
```

The engine is **fully deterministic** — all scores, time windows, alerts, and behavior states are computed before the LLM sees anything. Claude only writes the narrative; it cannot override engine numbers.

---

## Scored Variables (13 Components)

| # | Variable | Source | Scoring Method |
|---|----------|--------|----------------|
| 1 | **Water Temperature Zone** | NOAA CO-OPS (coastal) or air-temp model (freshwater) | Gaussian — monthly optimal per latitude band |
| 2 | **Barometric Pressure Change** | Open-Meteo hourly history | Gaussian — falling pressure is optimal |
| 3 | **Light Condition** | Calculated from sun position + cloud cover | Categorical — dawn/dusk windows score highest |
| 4 | **Temperature Trend** | 72-hour air temp delta | Gaussian — warming in cold months, cooling in hot months |
| 5 | **Solunar State** | Solunar API (major/minor periods) | Categorical — proximity to major window |
| 6 | **Wind Speed** | Open-Meteo current | Gaussian — light breeze optimal, calm/high penalized |
| 7 | **Moon Phase** | Calculated from date | Categorical — new/full moon slight bonus |
| 8 | **Precipitation** | Open-Meteo 48hr + 7-day accumulation | Categorical — light rain good, heavy rain bad |
| 9 | **Tide Phase** (salt/brackish) | NOAA CO-OPS predictions | Categorical — first 2hr of incoming is prime |
| 10 | **Tide Strength** (salt/brackish) | NOAA tidal range % of max | Gaussian — moderate movement optimal |
| 11 | **Cloud Cover** | Open-Meteo current % | Gaussian — seasonal optimal (overcast summer, clear winter) |
| 12 | **Wind-Tide Relation** (salt/brackish) | Derived from wind dir + tide flow | Categorical — wind with tide = bonus |
| 13 | **Seasonal Fish Behavior** | Derived from water temp + month + latitude | Modifier — frames all other scoring |

---

## Scoring Formula

Each component is scored 0–100 using **Gaussian optimal baselines**:

```
score = 100 × exp(-0.5 × ((actual - optimal) / sigma)²)
```

- Baselines are **monthly** and vary by **latitude band** (far_north → deep_south for freshwater, north_coast → south_coast for saltwater)
- Asymmetric sigmas: `sigma_above` and `sigma_below` differ (e.g., fish tolerate warming better than cooling)
- Precipitation and tides use **categorical scoring** (lookup tables, not Gaussian)

### Raw Score
```
raw_score = Σ(component_score × weight) / Σ(weights)
```

### Adjusted Score
```
adjusted_score = raw_score × recovery_multiplier × thermal_cap
```

- **Recovery multiplier**: 0.65–1.0 based on days since cold front (0–5 day recovery curve)
- **Thermal cap**: Logistic curve capping score when water temp is in lethal/stress zones

---

## Weight Distribution

Weights are **monthly** and **per-water-type**, totaling 100.

### Freshwater (approximate ranges across months)
| Component | Weight Range | Notes |
|-----------|-------------|-------|
| Water Temp | 18–26 | Highest in coldest months |
| Pressure | 21–25 | Consistently high |
| Light | 14–20 | Lower in winter |
| Temp Trend | 11–19 | Highest in winter |
| Solunar | 4–14 | Highest in summer |
| Wind | 6–8 | Consistent |
| Moon Phase | 2–4 | Always low |
| Precipitation | 2–6 | Seasonal variation |

### Saltwater
| Component | Weight | Notes |
|-----------|--------|-------|
| Tide Phase | 20 | Dominant factor |
| Tide Strength | 17 | Current flow critical |
| Water Temp | 19 | Thermal comfort |
| Pressure | 14 | Supporting factor |
| Wind | 8 | Open water tolerant |
| Light | 8 | Less impactful offshore |
| Temp Trend | 6 | Stabilized offshore |
| Solunar | 4 | Feeding trigger |
| Moon Phase | 2 | Very low |
| Precipitation | 2 | Very low |

### Brackish
Hybrid — tide phase (17), water temp (18), pressure (15), tide strength (12), solunar (8), light (10), temp trend (8), wind (7), precip (3), moon (2).

---

## Time Window Engine (Block Scoring)

The day is split into **48 blocks of 30 minutes** (00:00–23:30 local).

### Block Score
```
block_score = daily_raw_score × factor_quality × feeding_multiplier
```

- **factor_quality** (0–1.0): Time-varying factors — light condition, solunar proximity, tide phase/strength at that moment
- **feeding_multiplier** (0.50–1.20): Biological feeding likelihood per time-of-day bin, varies by season and latitude

### Solunar Bonuses (added to block score)
| Proximity | Bonus |
|-----------|-------|
| Within major window | +40 |
| Within 30 min of major | +25 |
| Within 60 min of major | +15 |
| Within 90 min of major | +8 |
| Within minor window | +15 |
| Outside all windows | 0 |

### Tidal Current Bonuses (salt/brackish)
| Phase | Bonus |
|-------|-------|
| Incoming first 2 hours | +35 |
| Outgoing first 2 hours | +25 |
| Incoming mid | +20 |
| Outgoing mid | +15 |
| Final hour before slack | +10 |
| Slack | –15 |

### Window Classification
| Label | Block Score Range |
|-------|-------------------|
| PRIME | ≥ 80 |
| GOOD | 60–79 |
| FAIR | 40–59 |
| SLOW | 15–39 |
| NOT RECOMMENDED | < 15 or safety alert |

Contiguous blocks with the same label are merged into time windows. The top 2 best and worst windows are returned in the report.

---

## Alert System

| Alert | Trigger | Effect |
|-------|---------|--------|
| **Cold Stun** | Water temp drops 8–12°F in 72h (threshold varies by region) | Blocks capped at 5–15, metabolic = "cold_stun" |
| **Salinity Disruption** | 48hr precip > 4" + coastal location | Score × 0.4 in estuaries |
| **Rapid Cooling** | temp_trend_state = "rapid_cooling" | Aggression reduced 1–2 tiers |
| **Severe Weather** | Air temp < –15°F OR wind > 35–45 mph | Safety flag, blocks = NOT_RECOMMENDED |
| **Developing Front** | Pressure drop ≥ 4 mb in 12h, no rise confirmed | Pre-front feeding window flagged |
| **Cold Front Recovery** | Days since front 0–5 | Recovery multiplier 0.65–1.0 over 5 days |

### Cold Front Recovery Curve
| Days Since Front | Multiplier (severe) | Multiplier (mild) |
|-----------------|---------------------|--------------------|
| 0 | 0.65 | 0.75 |
| 1 | 0.75 | 0.85 |
| 2 | 0.85 | 0.92 |
| 3 | 0.92 | 0.98 |
| 4+ | 1.00 | 1.00 |

---

## Behavior State Derivation

### Metabolic State (from water temp zone)
| Water Temp Zone | Metabolic State |
|-----------------|-----------------|
| near_shutdown_cold | shutdown |
| lethargic | lethargic |
| transitional | building |
| active_prime | active |
| peak_aggression | aggressive |
| thermal_stress_heat | suppressed_heat |

### Aggression State (from adjusted score, capped by metabolic state)
| Score | Aggression |
|-------|-----------|
| ≤ 19 | shut_down |
| 20–37 | negative |
| 38–54 | cautious |
| 55–71 | active |
| 72–87 | strong_feed |
| > 87 | peak_feed |

### Seasonal Fish Behavior
| State | Meaning |
|-------|---------|
| deep_winter_survival | Barely moving, holding deep |
| pre_spawn_buildup | Moving shallow, feeding aggressively |
| spawn_period | Distracted, relocated to beds |
| post_spawn_recovery | Scattered, selective |
| summer_peak_activity | Active on dawn/dusk edges |
| summer_heat_suppression | Pushed deep for cool water |
| fall_feed_buildup | Gorging before winter |
| late_fall_slowdown | Winding down |
| mild_winter_active | Comfortable despite winter |

---

## Overall Rating Scale

| Score Range | Rating |
|-------------|--------|
| 88–100 | Exceptional |
| 72–87 | Excellent |
| 55–71 | Good |
| 38–54 | Fair |
| 20–37 | Poor |
| 0–19 | Tough |

---

## LLM Narrative Layer

The LLM (Claude Haiku 4.5) receives all engine data and produces:
- **Headline** — 1 sentence, buddy tone
- **Rating summary** — 1 sentence explanation
- **Best/decent/worst times** — using engine time windows, with reasoning
- **Key factors** — 7 environmental factors explained conversationally
- **Tips** — 3 actionable tips for today
- **Strategy** — presentation speed, target depth, tactical approach note

The LLM **cannot** change scores, time windows, or alerts. It only explains them.

### Deterministic Fallback
If Claude is unavailable, a rule-based fallback generates all narrative fields from engine data alone. Users still get a complete report.

---

## Data Sources

| Data | Provider | Refresh |
|------|----------|---------|
| Weather (temp, wind, pressure, clouds, precip) | Open-Meteo | Real-time |
| Tides (phase, height, predictions) | NOAA CO-OPS | 6-min intervals |
| Water temperature (coastal) | NOAA CO-OPS | Real-time measured |
| Water temperature (freshwater) | Air-temp regression model | Estimated |
| Solunar periods (major/minor) | Solunar API | Daily |
| Moon phase & illumination | Calculated | Daily |
| 7-day forecast | Open-Meteo daily | Hourly updates |

---

## Caching

| Cache | TTL | Key |
|-------|-----|-----|
| Environment data | 15 min | `env_${lat}_${lon}` |
| Analysis (full report) | 45 min | `analysis_${lat}_${lon}` |
| Weekly forecast | 2 hours | `forecast_weekly_${lat}_${lon}` |

All caches invalidate at midnight and on significant location change.

---

## Engine Source Files

All in `supabase/functions/_shared/coreIntelligence/`:

| File | Purpose |
|------|---------|
| `index.ts` | Orchestration, output assembly, summary generation |
| `types.ts` | All type definitions |
| `scoreEngine.ts` | Weight tables, raw score computation |
| `optimalBaselines.ts` | Monthly Gaussian baselines per latitude band |
| `timeWindowEngine.ts` | 48-block scoring, window classification |
| `derivedVariables.ts` | Pressure trend, light, solunar, tide, temp classification |
| `behaviorInference.ts` | Metabolic/aggression/feeding/positioning derivation |
| `seasonalProfiles.ts` | Monthly weight redistribution, coastal/latitude band mapping |
| `recoveryModifier.ts` | Cold front detection, severity, recovery multiplier |
| `fishBiology.ts` | Time-of-day feeding preference multipliers |
