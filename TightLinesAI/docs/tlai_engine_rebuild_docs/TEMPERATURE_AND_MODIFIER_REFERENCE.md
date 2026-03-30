# TEMPERATURE_AND_MODIFIER_REFERENCE

## Purpose

This document defines the most important logic in the rebuild:

- temperature interpretation
- base weights
- month modifiers
- region modifiers
- modifier caps
- starter temperature bands for every region and month

Temperature is the most detailed variable in this engine. It must carry most of the environmental seasonality without turning the feature into a species-specific simulator.

---

## Core temperature design

Temperature for How's Fishing is now split by context:

- freshwater uses daily mean **air temperature**
- coastal and flats/estuary use measured **coastal water temperature** when a nearby NOAA reading is available
- coastal and flats/estuary fall back to the existing air-temperature path when measured water temperature is missing or stale

### Why
- freshwater still needs the simpler air-temperature proxy
- coastal fish respond more directly to the actual water mass than to a short-lived air swing
- fallback-safe coastal water temperature improves realism without breaking score continuity
- the narration layer can still use air temperature for intraday feel

---

## Temperature scoring model

Temperature is built from four pieces:

1. band favorability
2. 72-hour trend
3. shock flag
4. context-aware timing implication for tips / daypart (not direct score weight beyond the final temperature score)

### Final formula
```ts
finalTemperatureScore = clamp(
  bandScore + trendAdjustment + shockAdjustment,
  -2,
  2
)
```

### Adjustment policy
- `bandScore` carries most of the meaning
- `trendAdjustment` is a slight nudge
- `shockAdjustment` mostly penalizes instability
- trend and shock must not override the band logic completely

---

## Temperature band labels

Each region x month x context group table uses five descriptive bands:

- `very_cold`
- `cool`
- `optimal`
- `warm`
- `very_warm`

Each band has:
- an upper bound in degrees F
- a favorability score for that month/region/context group

Allowed band scores:
- `-2`
- `-1`
- `0`
- `1`
- `2`

---

## Context groups for temperature

### Freshwater group
Use one shared freshwater temperature table for:
- `freshwater_lake_pond`
- `freshwater_river`

Reason:
- simpler
- river-specific differentiation comes from runoff / flow disruption
- avoids unnecessary split logic before real-world testing proves it is needed

### Coastal group
Use the coastal-family temperature path for:
- `coastal`
- `coastal_flats_estuary`

Reason:
- coastal seasonal air conditions are moderated differently
- coastal timing / exposure context differs enough to justify a separate table family
- measured water temperature is preferred when available because it better matches fish metabolism in these systems

---

## Trend rules

Trend uses the selected thermal source over roughly 72 hours:

- freshwater: mean air temperature
- coastal-family with NOAA coverage: measured water temperature
- coastal-family fallback: mean air temperature

### Labels
- `warming`
- `stable`
- `cooling`

### Thresholds
- `warming` if delta >= `+5°F`
- `cooling` if delta <= `-5°F`
- `stable` otherwise

### Trend adjustment
- `+1` only when the current month/region table says today's temperature is materially **more favorable** than the same table would have scored 72 hours ago
- `-1` only when the current month/region table says today's temperature is materially **less favorable** than 72 hours ago
- `0` otherwise

### Important rule
Trend is only a slight nudge. It must never be treated as more important than the band itself, and it must follow the row-defined biological target rather than assuming "warming is always good" or "cooling is always bad."

---

## Shock rules

Shock uses abrupt selected-source movement.

### Labels
- `none`
- `sharp_warmup`
- `sharp_cooldown`

### Thresholds
- `sharp_warmup` if the 24-hour move is `>= +10°F`
- `sharp_cooldown` if the 24-hour move is `<= -10°F`
- also treat it as shock when the total 48-hour move is very large and the last 24 hours are still moving hard in that same direction
- `none` otherwise

### Shock adjustment
- sharp_warmup: `-1`
- sharp_cooldown: `-1`
- none: `0`

### Important rule
Shock mostly penalizes instability. It does **not** usually help even if the direction seems favorable.
When shock is active, do not stack a trend bonus on top of it.

---

## Timing implication rule for temperature

When temperature is:
- one of the top positive contributors
- and its month/region/context meaning clearly implies intra-day opportunity

the tip / daypart layer may emit a broad timing implication such as:
- warmest part of the day may help
- cooler parts of the day may be better
- no strong temperature timing edge

This is especially important for cases like:
- February Michigan freshwater river with favorable above-normal warmth
- hot midsummer southern freshwater where the warmest part of the day may be less helpful

This implication is for:
- tip generation
- daypart note

It is **not** an hourly recommendation engine.

---

## Base weights

### Freshwater Lake/Pond
| variable | base |
|---|---:|
| temperature_condition | 30 |
| pressure_regime | 25 |
| wind_condition | 18 |
| light_cloud_condition | 17 |
| precipitation_disruption | 10 |

### Freshwater River
| variable | base |
|---|---:|
| temperature_condition | 24 |
| pressure_regime | 20 |
| wind_condition | 12 |
| light_cloud_condition | 14 |
| runoff_flow_disruption | 30 |

### Coastal
| variable | base |
|---|---:|
| tide_current_movement | 30 |
| wind_condition | 24 |
| pressure_regime | 12 |
| light_cloud_condition | 12 |
| temperature_condition | 16 |
| precipitation_disruption | 6 |

### Coastal Flats / Estuary
| variable | base |
|---|---:|
| tide_current_movement | 24 |
| wind_condition | 26 |
| pressure_regime | 12 |
| light_cloud_condition | 14 |
| temperature_condition | 18 |
| precipitation_disruption | 6 |

---

## Modifier framework

### Final weight formula
```ts
finalWeight = clamp(
  baseWeight
  + monthModifier[context][month][variable]
  + regionModifier[context][region][variable],
  baseWeight - 5,
  baseWeight + 5
)
```

### Caps
These caps are global. They do **not** vary by month or region.

- month modifier cap: `±4`
- region modifier cap: `±3`
- combined movement from base: `±5`

### Important clarification
The **modifier values** change by month and region.
The **caps** do not.

---

## Month modifier tables

These are starter values for V1. They are intentionally broad, biologically sensible nudges rather than claims of perfect ecological truth.

### Freshwater Lake/Pond month modifiers
| month | temp | pressure | wind | light | precip |
|---|---:|---:|---:|---:|---:|
| Jan | +4 | +1 | 0 | +1 | 0 |
| Feb | +4 | +1 | 0 | +1 | 0 |
| Mar | +3 | +1 | 0 | +1 | 0 |
| Apr | +2 | +1 | 0 | 0 | 0 |
| May | +1 | 0 | 0 | 0 | 0 |
| Jun | 0 | 0 | 0 | +1 | 0 |
| Jul | +1 | 0 | 0 | +2 | 0 |
| Aug | +1 | 0 | 0 | +2 | 0 |
| Sep | +1 | 0 | 0 | +1 | 0 |
| Oct | +2 | +1 | 0 | 0 | 0 |
| Nov | +3 | +1 | 0 | +1 | 0 |
| Dec | +4 | +1 | 0 | +1 | 0 |

Interpretation:
- cold months make temperature more decisive
- hottest months make low-light slightly more important
- precipitation remains lightly weighted in stillwater outlooks

### Freshwater River month modifiers
| month | temp | pressure | wind | light | runoff |
|---|---:|---:|---:|---:|---:|
| Jan | +4 | +1 | 0 | +1 | +1 |
| Feb | +4 | +1 | 0 | +1 | +1 |
| Mar | +3 | +1 | 0 | 0 | +3 |
| Apr | +2 | 0 | 0 | 0 | +4 |
| May | +1 | 0 | 0 | 0 | +3 |
| Jun | 0 | 0 | 0 | +1 | +1 |
| Jul | +1 | 0 | 0 | +1 | 0 |
| Aug | +1 | 0 | 0 | +1 | 0 |
| Sep | +1 | 0 | 0 | 0 | 0 |
| Oct | +2 | 0 | 0 | 0 | +1 |
| Nov | +3 | +1 | 0 | 0 | +1 |
| Dec | +4 | +1 | 0 | +1 | +1 |

Interpretation:
- spring runoff matters most in rivers
- winter still makes temperature very important
- wind remains a lighter river variable

### Coastal month modifiers
| month | tide | wind | pressure | light | temp | precip |
|---|---:|---:|---:|---:|---:|---:|
| Jan | +1 | +1 | +1 | 0 | +3 | 0 |
| Feb | +1 | +1 | +1 | 0 | +3 | 0 |
| Mar | +1 | +1 | +1 | 0 | +2 | 0 |
| Apr | +1 | 0 | 0 | 0 | +1 | 0 |
| May | +1 | 0 | 0 | 0 | 0 | 0 |
| Jun | 0 | +1 | 0 | +1 | 0 | 0 |
| Jul | 0 | +1 | 0 | +1 | +1 | 0 |
| Aug | 0 | +1 | 0 | +1 | +1 | 0 |
| Sep | +1 | +1 | 0 | 0 | 0 | 0 |
| Oct | +1 | +1 | +1 | 0 | +1 | 0 |
| Nov | +1 | +1 | +1 | 0 | +2 | 0 |
| Dec | +1 | +1 | +1 | 0 | +3 | 0 |

Interpretation:
- temperature matters more in colder months
- wind remains highly relevant much of the year
- tide remains the structural anchor of the coastal context

### Coastal Flats / Estuary month modifiers
| month | tide | wind | pressure | light | temp | precip |
|---|---:|---:|---:|---:|---:|---:|
| Jan | 0 | +1 | 0 | +1 | +3 | 0 |
| Feb | 0 | +1 | 0 | +1 | +3 | 0 |
| Mar | 0 | +1 | 0 | +1 | +2 | 0 |
| Apr | 0 | +1 | 0 | +1 | +1 | 0 |
| May | 0 | +1 | 0 | +1 | 0 | 0 |
| Jun | -1 | +2 | 0 | +2 | 0 | 0 |
| Jul | -1 | +2 | 0 | +2 | +1 | 0 |
| Aug | -1 | +2 | 0 | +2 | +1 | 0 |
| Sep | 0 | +2 | +1 | +1 | 0 | 0 |
| Oct | 0 | +1 | +1 | +1 | +1 | 0 |
| Nov | 0 | +1 | +1 | +1 | +2 | 0 |
| Dec | 0 | +1 | 0 | +1 | +3 | 0 |

Interpretation:
- tide stays important, but less dominant than inshore coastal
- wind and light matter more in skinny water because drift control, visibility, and approach angle shape the bite
- temperature remains a bigger seasonal lever than classic inshore current in winter and shoulder seasons

---

## Region modifier tables

These are starter region nudges. They should remain light. They tune emphasis without creating giant custom engines.

### Freshwater Lake/Pond region modifiers
| region | temp | pressure | wind | light | precip |
|---|---:|---:|---:|---:|---:|
| northeast | +2 | 0 | 0 | 0 | 0 |
| southeast_atlantic | 0 | 0 | 0 | 0 | 0 |
| florida | -1 | 0 | 0 | +1 | 0 |
| gulf_coast | -1 | 0 | 0 | +1 | 0 |
| great_lakes_upper_midwest | +3 | 0 | 0 | 0 | 0 |
| midwest_interior | +2 | 0 | 0 | 0 | 0 |
| south_central | 0 | 0 | 0 | 0 | 0 |
| mountain_west | +2 | 0 | 0 | 0 | 0 |
| southwest | 0 | 0 | 0 | +1 | 0 |
| pacific_coast | 0 | 0 | 0 | 0 | 0 |

### Freshwater River region modifiers
| region | temp | pressure | wind | light | runoff |
|---|---:|---:|---:|---:|---:|
| northeast | +1 | 0 | 0 | 0 | +1 |
| southeast_atlantic | 0 | 0 | 0 | 0 | +1 |
| florida | -1 | 0 | 0 | 0 | +1 |
| gulf_coast | -1 | 0 | 0 | 0 | +2 |
| great_lakes_upper_midwest | +2 | 0 | 0 | 0 | +1 |
| midwest_interior | +1 | 0 | 0 | 0 | +2 |
| south_central | 0 | 0 | 0 | 0 | +1 |
| mountain_west | +1 | 0 | 0 | 0 | +1 |
| southwest | 0 | 0 | 0 | 0 | +1 |
| pacific_coast | 0 | 0 | 0 | 0 | +1 |

### Coastal region modifiers
| region | tide | wind | pressure | light | temp | precip |
|---|---:|---:|---:|---:|---:|---:|
| northeast | +1 | +1 | 0 | 0 | +1 | 0 |
| southeast_atlantic | 0 | 0 | 0 | 0 | 0 | 0 |
| florida | 0 | 0 | 0 | 0 | 0 | 0 |
| gulf_coast | 0 | 0 | 0 | 0 | 0 | +1 |
| great_lakes_upper_midwest | 0 | 0 | 0 | 0 | 0 | 0 |
| midwest_interior | 0 | 0 | 0 | 0 | 0 | 0 |
| south_central | 0 | 0 | 0 | 0 | 0 | 0 |
| mountain_west | 0 | 0 | 0 | 0 | 0 | 0 |
| southwest | 0 | 0 | 0 | 0 | 0 | 0 |
| pacific_coast | +1 | +1 | 0 | 0 | 0 | 0 |

Important:
- only coastal-eligible regions actually matter for coastal runtime
- inland regions may still exist in config for completeness but should not be user-selectable via the UI coastal rule

### Coastal Flats / Estuary region modifiers
| region | tide | wind | pressure | light | temp | precip |
|---|---:|---:|---:|---:|---:|---:|
| northeast | 0 | 0 | 0 | 0 | +1 | 0 |
| southeast_atlantic | -1 | +1 | 0 | +1 | 0 | -1 |
| florida | -1 | +1 | 0 | +1 | +1 | -1 |
| gulf_coast | -1 | +1 | 0 | +1 | 0 | 0 |
| pacific_northwest | 0 | +1 | 0 | 0 | 0 | -1 |
| southern_california | -1 | +1 | 0 | +1 | 0 | -1 |
| northern_california | 0 | +1 | 0 | 0 | 0 | -1 |
| alaska | 0 | +1 | 0 | 0 | +2 | 0 |
| hawaii | 0 | +1 | 0 | +1 | 0 | -1 |

---

## Freshwater temperature starter tables

These are keyed by `region x month`.

### Schema
For each row:
- `vc_max` = upper bound for very_cold
- `cool_max` = upper bound for cool
- `optimal_max` = upper bound for optimal
- `warm_max` = upper bound for warm
- values above `warm_max` are `very_warm`
- scores are listed in order:
  - `very_cold_score`
  - `cool_score`
  - `optimal_score`
  - `warm_score`
  - `very_warm_score`

### Northeast freshwater
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 22 | 32 | 42 | 52 | -2,-1,1,2,0 |
| Feb | 24 | 34 | 44 | 54 | -2,-1,1,2,0 |
| Mar | 30 | 40 | 50 | 60 | -2,-1,1,2,0 |
| Apr | 40 | 50 | 60 | 70 | -2,-1,2,1,-1 |
| May | 50 | 60 | 70 | 80 | -2,-1,2,1,-1 |
| Jun | 58 | 68 | 76 | 84 | -2,-1,2,0,-2 |
| Jul | 64 | 72 | 80 | 88 | -2,-1,2,0,-2 |
| Aug | 62 | 72 | 80 | 88 | -2,-1,2,0,-2 |
| Sep | 54 | 64 | 74 | 82 | -2,-1,2,1,-1 |
| Oct | 44 | 54 | 64 | 74 | -2,-1,2,1,-1 |
| Nov | 34 | 44 | 54 | 64 | -2,-1,1,2,0 |
| Dec | 26 | 36 | 46 | 56 | -2,-1,1,2,0 |

### Southeast Atlantic freshwater
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 30 | 40 | 52 | 62 | -2,-1,1,2,0 |
| Feb | 34 | 44 | 56 | 66 | -2,-1,1,2,0 |
| Mar | 42 | 52 | 64 | 74 | -2,-1,2,1,-1 |
| Apr | 50 | 60 | 72 | 82 | -2,-1,2,1,-1 |
| May | 58 | 68 | 78 | 86 | -2,-1,2,0,-2 |
| Jun | 66 | 74 | 82 | 90 | -2,-1,2,0,-2 |
| Jul | 70 | 78 | 84 | 92 | -2,-1,1,0,-2 |
| Aug | 70 | 78 | 84 | 92 | -2,-1,1,0,-2 |
| Sep | 64 | 72 | 80 | 88 | -2,-1,2,0,-2 |
| Oct | 54 | 64 | 74 | 84 | -2,-1,2,1,-1 |
| Nov | 42 | 52 | 64 | 74 | -2,-1,2,1,-1 |
| Dec | 34 | 44 | 56 | 66 | -2,-1,1,2,0 |

### Florida freshwater
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 42 | 52 | 64 | 74 | -2,-1,1,2,0 |
| Feb | 46 | 56 | 68 | 78 | -2,-1,1,2,0 |
| Mar | 54 | 64 | 74 | 82 | -2,-1,2,1,-1 |
| Apr | 62 | 70 | 80 | 88 | -2,-1,2,1,-1 |
| May | 68 | 76 | 84 | 90 | -2,-1,2,0,-2 |
| Jun | 72 | 80 | 86 | 92 | -2,-1,1,0,-2 |
| Jul | 74 | 82 | 88 | 94 | -2,-1,1,0,-2 |
| Aug | 74 | 82 | 88 | 94 | -2,-1,1,0,-2 |
| Sep | 72 | 80 | 86 | 92 | -2,-1,1,0,-2 |
| Oct | 64 | 72 | 82 | 90 | -2,-1,2,0,-2 |
| Nov | 54 | 64 | 76 | 84 | -2,-1,2,1,-1 |
| Dec | 46 | 56 | 68 | 78 | -2,-1,1,2,0 |

### Gulf Coast freshwater
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 38 | 48 | 60 | 70 | -2,-1,1,2,0 |
| Feb | 42 | 52 | 64 | 74 | -2,-1,1,2,0 |
| Mar | 50 | 60 | 70 | 80 | -2,-1,2,1,-1 |
| Apr | 58 | 68 | 78 | 86 | -2,-1,2,1,-1 |
| May | 66 | 74 | 82 | 90 | -2,-1,2,0,-2 |
| Jun | 72 | 80 | 86 | 92 | -2,-1,1,0,-2 |
| Jul | 74 | 82 | 88 | 94 | -2,-1,1,0,-2 |
| Aug | 74 | 82 | 88 | 94 | -2,-1,1,0,-2 |
| Sep | 70 | 78 | 84 | 92 | -2,-1,1,0,-2 |
| Oct | 60 | 70 | 80 | 88 | -2,-1,2,0,-2 |
| Nov | 48 | 58 | 68 | 78 | -2,-1,2,1,-1 |
| Dec | 40 | 50 | 62 | 72 | -2,-1,1,2,0 |

### Great Lakes / Upper Midwest freshwater
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 14 | 24 | 34 | 44 | -2,-1,1,2,0 |
| Feb | 16 | 26 | 36 | 46 | -2,-1,1,2,0 |
| Mar | 24 | 34 | 44 | 54 | -2,-1,1,2,0 |
| Apr | 36 | 46 | 56 | 66 | -2,-1,2,1,-1 |
| May | 46 | 56 | 66 | 76 | -2,-1,2,1,-1 |
| Jun | 56 | 66 | 74 | 82 | -2,-1,2,0,-2 |
| Jul | 62 | 70 | 78 | 86 | -2,-1,2,0,-2 |
| Aug | 60 | 70 | 78 | 86 | -2,-1,2,0,-2 |
| Sep | 52 | 62 | 72 | 80 | -2,-1,2,1,-1 |
| Oct | 40 | 50 | 60 | 70 | -2,-1,2,1,-1 |
| Nov | 28 | 38 | 48 | 58 | -2,-1,1,2,0 |
| Dec | 18 | 28 | 38 | 48 | -2,-1,1,2,0 |

### Midwest Interior freshwater
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 18 | 28 | 38 | 48 | -2,-1,1,2,0 |
| Feb | 22 | 32 | 42 | 52 | -2,-1,1,2,0 |
| Mar | 32 | 42 | 52 | 62 | -2,-1,1,2,0 |
| Apr | 44 | 54 | 64 | 74 | -2,-1,2,1,-1 |
| May | 54 | 64 | 74 | 84 | -2,-1,2,1,-1 |
| Jun | 64 | 72 | 80 | 88 | -2,-1,2,0,-2 |
| Jul | 70 | 78 | 84 | 92 | -2,-1,1,0,-2 |
| Aug | 68 | 76 | 84 | 92 | -2,-1,1,0,-2 |
| Sep | 58 | 68 | 78 | 86 | -2,-1,2,0,-2 |
| Oct | 46 | 56 | 66 | 76 | -2,-1,2,1,-1 |
| Nov | 34 | 44 | 54 | 64 | -2,-1,1,2,0 |
| Dec | 24 | 34 | 44 | 54 | -2,-1,1,2,0 |

### South Central freshwater
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 28 | 38 | 50 | 60 | -2,-1,1,2,0 |
| Feb | 32 | 42 | 54 | 64 | -2,-1,1,2,0 |
| Mar | 42 | 52 | 64 | 74 | -2,-1,2,1,-1 |
| Apr | 52 | 62 | 72 | 82 | -2,-1,2,1,-1 |
| May | 62 | 70 | 80 | 88 | -2,-1,2,0,-2 |
| Jun | 70 | 78 | 84 | 92 | -2,-1,1,0,-2 |
| Jul | 74 | 82 | 88 | 94 | -2,-1,1,0,-2 |
| Aug | 72 | 80 | 86 | 92 | -2,-1,1,0,-2 |
| Sep | 66 | 74 | 82 | 90 | -2,-1,2,0,-2 |
| Oct | 54 | 64 | 74 | 84 | -2,-1,2,1,-1 |
| Nov | 42 | 52 | 62 | 72 | -2,-1,1,2,0 |
| Dec | 32 | 42 | 52 | 62 | -2,-1,1,2,0 |

### Mountain West freshwater
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 16 | 26 | 36 | 46 | -2,-1,1,2,0 |
| Feb | 20 | 30 | 40 | 50 | -2,-1,1,2,0 |
| Mar | 30 | 40 | 50 | 60 | -2,-1,1,2,0 |
| Apr | 40 | 50 | 60 | 70 | -2,-1,2,1,-1 |
| May | 50 | 60 | 70 | 80 | -2,-1,2,1,-1 |
| Jun | 58 | 68 | 76 | 84 | -2,-1,2,0,-2 |
| Jul | 64 | 72 | 80 | 88 | -2,-1,2,0,-2 |
| Aug | 62 | 70 | 78 | 86 | -2,-1,2,0,-2 |
| Sep | 52 | 62 | 72 | 80 | -2,-1,2,1,-1 |
| Oct | 40 | 50 | 60 | 70 | -2,-1,2,1,-1 |
| Nov | 28 | 38 | 48 | 58 | -2,-1,1,2,0 |
| Dec | 18 | 28 | 38 | 48 | -2,-1,1,2,0 |

### Southwest freshwater
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 30 | 40 | 52 | 62 | -2,-1,1,2,0 |
| Feb | 34 | 44 | 56 | 66 | -2,-1,1,2,0 |
| Mar | 44 | 54 | 66 | 76 | -2,-1,2,1,-1 |
| Apr | 54 | 64 | 74 | 84 | -2,-1,2,1,-1 |
| May | 64 | 72 | 80 | 88 | -2,-1,2,0,-2 |
| Jun | 72 | 80 | 86 | 94 | -2,-1,1,0,-2 |
| Jul | 76 | 84 | 90 | 98 | -2,-1,1,0,-2 |
| Aug | 74 | 82 | 88 | 96 | -2,-1,1,0,-2 |
| Sep | 68 | 76 | 84 | 92 | -2,-1,2,0,-2 |
| Oct | 56 | 66 | 76 | 86 | -2,-1,2,1,-1 |
| Nov | 42 | 52 | 62 | 72 | -2,-1,1,2,0 |
| Dec | 32 | 42 | 54 | 64 | -2,-1,1,2,0 |

### Pacific Coast freshwater
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 34 | 44 | 54 | 64 | -2,-1,1,2,0 |
| Feb | 36 | 46 | 56 | 66 | -2,-1,1,2,0 |
| Mar | 42 | 52 | 62 | 72 | -2,-1,2,1,-1 |
| Apr | 48 | 58 | 68 | 78 | -2,-1,2,1,-1 |
| May | 54 | 64 | 72 | 80 | -2,-1,2,1,-1 |
| Jun | 58 | 66 | 74 | 82 | -2,-1,2,0,-2 |
| Jul | 62 | 70 | 78 | 86 | -2,-1,2,0,-2 |
| Aug | 62 | 70 | 78 | 86 | -2,-1,2,0,-2 |
| Sep | 58 | 66 | 74 | 82 | -2,-1,2,0,-2 |
| Oct | 48 | 58 | 68 | 78 | -2,-1,2,1,-1 |
| Nov | 40 | 50 | 60 | 70 | -2,-1,1,2,0 |
| Dec | 34 | 44 | 54 | 64 | -2,-1,1,2,0 |

---

## Coastal temperature starter tables

### Northeast coastal
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 24 | 34 | 44 | 54 | -2,-1,1,2,0 |
| Feb | 26 | 36 | 46 | 56 | -2,-1,1,2,0 |
| Mar | 34 | 44 | 54 | 64 | -2,-1,1,2,0 |
| Apr | 42 | 52 | 62 | 72 | -2,-1,2,1,-1 |
| May | 50 | 60 | 68 | 76 | -2,-1,2,1,-1 |
| Jun | 58 | 66 | 74 | 82 | -2,-1,2,0,-2 |
| Jul | 64 | 72 | 78 | 86 | -2,-1,2,0,-2 |
| Aug | 64 | 72 | 78 | 86 | -2,-1,2,0,-2 |
| Sep | 58 | 66 | 74 | 82 | -2,-1,2,1,-1 |
| Oct | 48 | 58 | 66 | 76 | -2,-1,2,1,-1 |
| Nov | 38 | 48 | 58 | 68 | -2,-1,1,2,0 |
| Dec | 28 | 38 | 48 | 58 | -2,-1,1,2,0 |

### Southeast Atlantic coastal
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 34 | 44 | 56 | 66 | -2,-1,1,2,0 |
| Feb | 38 | 48 | 60 | 70 | -2,-1,1,2,0 |
| Mar | 46 | 56 | 68 | 78 | -2,-1,2,1,-1 |
| Apr | 54 | 64 | 74 | 84 | -2,-1,2,1,-1 |
| May | 62 | 70 | 78 | 86 | -2,-1,2,0,-2 |
| Jun | 68 | 76 | 82 | 90 | -2,-1,2,0,-2 |
| Jul | 72 | 80 | 84 | 92 | -2,-1,1,0,-2 |
| Aug | 72 | 80 | 84 | 92 | -2,-1,1,0,-2 |
| Sep | 68 | 76 | 82 | 90 | -2,-1,2,0,-2 |
| Oct | 58 | 68 | 76 | 86 | -2,-1,2,1,-1 |
| Nov | 46 | 56 | 68 | 78 | -2,-1,2,1,-1 |
| Dec | 38 | 48 | 60 | 70 | -2,-1,1,2,0 |

### Florida coastal
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 46 | 56 | 68 | 78 | -2,-1,1,2,0 |
| Feb | 50 | 60 | 72 | 80 | -2,-1,1,2,0 |
| Mar | 58 | 68 | 78 | 86 | -2,-1,2,1,-1 |
| Apr | 66 | 74 | 82 | 90 | -2,-1,2,0,-2 |
| May | 72 | 80 | 86 | 92 | -2,-1,1,0,-2 |
| Jun | 76 | 84 | 88 | 94 | -2,-1,1,0,-2 |
| Jul | 78 | 86 | 90 | 96 | -2,-1,1,0,-2 |
| Aug | 78 | 86 | 90 | 96 | -2,-1,1,0,-2 |
| Sep | 76 | 84 | 88 | 94 | -2,-1,1,0,-2 |
| Oct | 68 | 76 | 84 | 92 | -2,-1,2,0,-2 |
| Nov | 58 | 68 | 78 | 86 | -2,-1,2,1,-1 |
| Dec | 50 | 60 | 72 | 80 | -2,-1,1,2,0 |

### Gulf Coast coastal
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 42 | 52 | 64 | 74 | -2,-1,1,2,0 |
| Feb | 46 | 56 | 68 | 78 | -2,-1,1,2,0 |
| Mar | 54 | 64 | 74 | 84 | -2,-1,2,1,-1 |
| Apr | 62 | 70 | 80 | 88 | -2,-1,2,1,-1 |
| May | 70 | 78 | 84 | 90 | -2,-1,2,0,-2 |
| Jun | 76 | 82 | 88 | 94 | -2,-1,1,0,-2 |
| Jul | 78 | 84 | 90 | 96 | -2,-1,1,0,-2 |
| Aug | 78 | 84 | 90 | 96 | -2,-1,1,0,-2 |
| Sep | 74 | 80 | 86 | 92 | -2,-1,1,0,-2 |
| Oct | 64 | 72 | 80 | 88 | -2,-1,2,0,-2 |
| Nov | 54 | 64 | 74 | 84 | -2,-1,2,1,-1 |
| Dec | 44 | 54 | 66 | 76 | -2,-1,1,2,0 |

### Pacific Coast coastal
| month | vc_max | cool_max | optimal_max | warm_max | scores |
|---|---:|---:|---:|---:|---|
| Jan | 40 | 50 | 60 | 70 | -2,-1,1,2,0 |
| Feb | 42 | 52 | 62 | 72 | -2,-1,1,2,0 |
| Mar | 46 | 56 | 66 | 76 | -2,-1,2,1,-1 |
| Apr | 50 | 60 | 70 | 80 | -2,-1,2,1,-1 |
| May | 54 | 62 | 72 | 80 | -2,-1,2,1,-1 |
| Jun | 58 | 66 | 74 | 82 | -2,-1,2,0,-2 |
| Jul | 60 | 68 | 76 | 84 | -2,-1,2,0,-2 |
| Aug | 60 | 68 | 76 | 84 | -2,-1,2,0,-2 |
| Sep | 60 | 68 | 76 | 84 | -2,-1,2,0,-2 |
| Oct | 54 | 62 | 72 | 80 | -2,-1,2,1,-1 |
| Nov | 46 | 56 | 66 | 76 | -2,-1,1,2,0 |
| Dec | 40 | 50 | 60 | 70 | -2,-1,1,2,0 |

### Coastal note
Only the five practical coastal regions above need coastal runtime tables for this rebuild:
- northeast
- southeast_atlantic
- florida
- gulf_coast
- pacific_coast

No coastal runtime is needed for inland regions in V1.

---

## Implementation notes for the agent

### Band interpretation rule
- pick the correct context group
- pick the correct region
- pick the correct month row
- compare today's mean air temperature to the band thresholds
- assign the descriptive band
- use that row's band score

### Example
If:
- region = `great_lakes_upper_midwest`
- month = `February`
- context = `freshwater_river`
- today's mean air temp = `45°F`

Use the shared freshwater table for Great Lakes / Upper Midwest, February:
- very_cold <= 16
- cool <= 26
- optimal <= 36
- warm <= 46
- above 46 = very_warm

`45°F` falls in `warm`, score `+2`.

This is why a warm February Michigan river day can correctly read as favorable.

### Calibration expectation
These tables are the canonical V1 starter set. Implementation should use them exactly first, then future real-world testing can refine them later.

Do not invent a different temperature system during implementation.
