# TightLines AI V1 Starter Config Pack — Codebase-Aligned

This starter pack is the first implementation-ready config layer for the rebuilt engine.
It now reflects both the agreed engine design and the realities of the uploaded codebase.

## Core change after codebase review

The starter pack is now centered on **single confirmed environment mode execution**.

That means the engine should no longer be configured around auto-running multiple reports for all plausible water contexts.

Instead, every engine run must receive one of these confirmed environment modes:
- `freshwater_lake`
- `freshwater_river`
- `brackish`
- `saltwater`

---

## 1. Environment mode registry

## Canonical V1 modes

### `freshwater_lake`
Covers:
- lakes
- ponds
- reservoirs
- stillwater freshwater systems

### `freshwater_river`
Covers:
- rivers
- streams
- moving freshwater systems

### `brackish`
Covers broad V1 estuarine/brackish conditions such as:
- estuaries
- marsh systems
- tidal creeks
- backwater transition zones

Do not split brackish further in V1.

### `saltwater`
Covers broad V1 inshore/coastal saltwater conditions such as:
- bays
- flats
- coastal inlets
- marsh edges
- open inshore coastline
- broad surf-adjacent use

Do not split surf into its own engine mode in V1.

---

## 2. Water type and body type setup rules

### Setup order
1. user selects `water_type`
2. system filters valid body types
3. if freshwater, user selects freshwater subtype
4. if freshwater, optional manual water temp entry appears
5. engine mode is finalized

### Canonical mapping
- `water_type = freshwater` + `freshwater_subtype = lake | pond | reservoir` -> `environment_mode = freshwater_lake`
- `water_type = freshwater` + `freshwater_subtype = river | stream` -> `environment_mode = freshwater_river`
- `water_type = brackish` -> `environment_mode = brackish`
- `water_type = saltwater` -> `environment_mode = saltwater`

### Non-applicable UI rules
- selecting `saltwater` removes freshwater body choices
- selecting `brackish` removes freshwater body choices
- selecting `freshwater` requires a freshwater subtype choice

---

## 3. Water temperature source priority config

## Freshwater modes
### Priority order
1. manual freshwater temp entered by user
2. inferred freshwater temp model
3. degraded/no-strong-water-temp-claim state

### Manual freshwater temp rule
If user enters freshwater water temperature:
- treat it as highest-priority source
- assign max source confidence
- do not blend with inferred freshwater temp
- retain provenance as `manual_user_entered`

## Saltwater and brackish modes
### Priority order
1. measured coastal/brackish source
2. fallback measured marine source if applicable
3. degraded state if unavailable

### Rule
No manual water temp entry for saltwater or brackish.

---

## 4. Region config

Use these 7 V1 regions:
- `northeast`
- `great_lakes_upper_midwest`
- `mid_atlantic`
- `southeast_atlantic`
- `gulf_florida`
- `interior_south_plains`
- `west_southwest`

### Region role
Region is a coarse seasonal/context modifier.
Region should not overpower:
- actual temperature state
- temperature trend
- environmental conditions
- inferred seasonal-state

---

## 5. Seasonal-state registry

Seasonal-state is resolved from:
- region
- month/date
- temperature context
- recent temperature trend
- environment mode

### Freshwater seasonal states
- `deep_winter`
- `winter_transition`
- `spring_warming`
- `spawn_window_broad`
- `post_spawn_broad`
- `stable_summer`
- `summer_heat_stress`
- `early_fall_feed`
- `late_fall_cooling`

### Saltwater / brackish seasonal states
- `coastal_cold_slow`
- `coastal_cold_but_active`
- `coastal_transition_feed`
- `coastal_stable_warm`
- `coastal_heat_stress`

### Rule
Month is only an input into seasonal-state, not the truth by itself.

---

## 6. Core variable registry

### V1 variable families
- `water_temp`
- `air_temp_trend_recent`
- `pressure_level`
- `pressure_trend`
- `wind_speed`
- `wind_direction_relevance`
- `cloud_light`
- `precip_current_recent`
- `moon_phase`
- `solunar_support`
- `time_of_day`
- `tide_phase`
- `tide_strength`

### Applicability rules
- tide variables apply only to `saltwater` and `brackish`
- freshwater modes ignore tide variables entirely
- current is represented indirectly in `freshwater_river` through river behavior context and not through tidal scoring

---

## 7. Weight hierarchy philosophy

## Freshwater lake
Highest influence should generally come from:
1. water temp
2. temp trend
3. pressure trend/state
4. light/time-of-day
5. wind
6. moon/solunar support
7. precipitation/runoff effects

## Freshwater river
Highest influence should generally come from:
1. water temp
2. temp trend
3. flow-sensitive presentation/holding context
4. pressure trend/state
5. light/time-of-day
6. precipitation/runoff signal
7. moon/solunar support

## Brackish
Highest influence should generally come from:
1. tide/current movement
2. water temp
3. pressure trend/state
4. wind
5. light/time-of-day
6. precipitation/runoff / salinity disruption signal
7. moon/solunar support

## Saltwater
Highest influence should generally come from:
1. tide/current movement
2. water temp
3. pressure trend/state
4. wind
5. light/time-of-day
6. moon/solunar support
7. precipitation/storm effects

### Rule
Moon/solunar is not a dominant primary variable.
Its influence should expand mainly when baseline fish comfort and activity are already reasonably supportive.

---

## 8. Variable response-curve philosophy

Each variable should support:
- preferred range
- low-side stress range
- high-side stress range
- asymmetric penalties
- context-sensitive weight

### Important rule
The engine must not assume that being above target is equally bad as being below target.
That must be configurable by context.

### Examples of intended behavior
- some seasonal contexts should penalize below-target water temperatures harder than above-target
- some hot-weather contexts should penalize above-target water temperatures much harder than below-target
- wind can be helpful in some contexts and strongly harmful in others
- precipitation can be neutral, helpful, or disruptive depending on water type and recent accumulation

---

## 9. Confidence and reliability rules

### Water temp confidence behavior
If user enters freshwater temp:
- confidence = max confidence tier
- source = manual_user_entered

If freshwater temp is inferred:
- confidence varies by inference quality
- stability/volatility of recent air temperatures should influence confidence
- river modes should generally be less inference-confident than stillwater freshwater

If coastal/brackish measured temp is missing:
- degrade confidence
- reduce water-temp-driven claims accordingly

### Reliability output should include
- overall report confidence
- degraded modules
- key inferred critical inputs
- claim guard state

---

## 10. Severe suppression rules

Strong suppression must be allowed to cap otherwise positive conditions.

Examples:
- dangerous weather
- strong post-front suppression
- extreme cold/heat stress
- runoff/salinity disruption in brackish systems

### Rule
A good moon window or active tide should not fully override a legitimately poor biological or fishability state.

---

## 11. Score bands

### Internal score
- `0–100`

### User-facing labels
- `Poor`
- `Fair`
- `Good`
- `Great`

You may retain more granular internal distinctions if needed, but the user-facing top-level band should stay simple.

---

## 12. Narration-safe output labels

The engine should output approved tactical labels, not freeform biological storytelling.

### Examples
- activity state
- feeding readiness
- broad positioning tendency
- presentation speed bias
- confidence state
- primary drivers
- suppressors

The LLM should narrate only from these approved labels and facts.

---

## 13. Config file map

Recommended V2 config structure:
- `config/environmentModes.ts`
- `config/regions.ts`
- `config/seasonalStates.ts`
- `config/variableRegistry.ts`
- `config/weightProfiles.ts`
- `config/responseCurves.ts`
- `config/reliabilityRules.ts`
- `config/scoreBands.ts`
- `config/narrationGuards.ts`

---

## 14. Codebase alignment notes

### Current code that this starter pack should replace conceptually
- old `coreIntelligence` seasonal profiles
- old static weight organization
- old multi-context bundle assumptions

### Current code that should be updated to consume this pack
- `app/how-fishing.tsx`
- `lib/howFishing.ts`
- `store/forecastStore.ts`
- `supabase/functions/how-fishing/index.ts`

---

## 15. UI/UX alignment note

The current codebase is already close enough to support this shift, but the context choice must move to **before** report generation.

The setup flow should explicitly drive the engine mode.
The result screen should no longer behave like a chooser among auto-generated contexts.
