# TightLines AI V3 Data Baselines Spec

## 1. Purpose

This document defines the baseline datasets required by V3, how they must be structured, how they may be used, and how they must not be used.

The implementation agent must treat this document as binding. Historical baselines are a support layer, not a substitute for real measured conditions.

## 2. Core principle

Historical baselines exist to answer questions like:
- is the recent air-temperature trend warmer or cooler than normal for this state and month?
- is recent rainfall above or below normal for this state and month?
- is a measured coastal water temperature cooler or warmer than typical for this month?
- does a broad freshwater temperature range suggest seasonal progress may be lagging or accelerated?

Historical baselines do not exist to:
- fabricate a missing measured freshwater water temperature for headline scoring
- generate fake exact biology
- overpower strongly suppressive real-world measured conditions

## 3. Required baseline groups

### 3.1 State monthly air-temperature baselines
Use for:
- 7-day and 14-day recent-trend comparisons
- seasonal progress context
- narration
- limited timing nuance

Minimum fields:
- `state`
- `month`
- `avg_temp_normal`
- `avg_high_normal`
- `avg_low_normal`
- `range_low`
- `range_high`
- `source_name`
- `source_url_or_reference`
- `source_period`
- `quality_flag`

### 3.2 State monthly precipitation baselines
Use for:
- wetter-than-normal vs drier-than-normal context
- runoff/stain tendency context
- narration
- limited timing nuance where relevant

Minimum fields:
- `state`
- `month`
- `precip_total_normal`
- `range_low`
- `range_high`
- optional wetness-band thresholds
- `source_name`
- `source_url_or_reference`
- `source_period`
- `quality_flag`

### 3.3 State monthly freshwater temperature baselines
Use for:
- contextual freshwater seasonal interpretation only
- cautious narration support
- historical comparison flags

Broad subtypes required:
- `lake_pond`
- `river_stream`

Minimum fields:
- `state`
- `month`
- `subtype`
- `temp_range_low`
- `temp_range_high`
- `methodology_note`
- `source_name`
- `source_url_or_reference`
- `source_period`
- `quality_flag`

Important:
- a broad range is acceptable
- it does not need to be perfect
- it must be as defensible and reasonable as possible
- it must not pretend to be precision for every waterbody in a state

### 3.4 Coastal monthly water-temperature baselines
Use for:
- saltwater/brackish water-temperature comparisons
- narration support
- limited timing nuance when measured coastal water temperature exists

Minimum fields:
- `state_or_coastal_zone`
- `month`
- `temp_range_low`
- `temp_range_high`
- `source_name`
- `source_url_or_reference`
- `source_period`
- `quality_flag`

## 4. Required source policy

The implementation agent must gather baseline values from credible public sources and document the exact source methodology.

### 4.1 Preferred source order
#### Air temperature and precipitation
Prefer:
1. NOAA U.S. Climate Normals
2. PRISM normals/anomaly products as support or gap-fill

#### Coastal water temperature
Prefer:
1. NOAA coastal/marine water-temperature products
2. other government/public marine datasets only if NOAA alone is insufficient

#### Freshwater temperature
Prefer, in this order where practical:
1. USGS/public federal datasets
2. state agency datasets with public methodology
3. other credible public datasets if government coverage is incomplete

### 4.2 Documentation requirement
The implementation agent must create one baseline-source methodology summary that records:
- what source was used for each baseline group
- what time period the normals/ranges represent
- what was directly sourced vs approximated
- how freshwater statewide ranges were estimated where no perfect statewide source existed
- what confidence tier each dataset received

### 4.3 Non-negotiable sourcing rule
If the agent cannot find a perfect statewide freshwater source, it must still:
- choose the best defensible public source(s)
- create a broad range rather than a false precision value
- document the approximation method clearly

It must not:
- invent values with no cited basis
- hide approximations
- silently mix incomparable source types without documenting it

## 5. Variables that do NOT require baseline datasets

Do not create monthly historical baseline tables for:
- wind
- pressure
- cloud cover
- moon phase
- solunar
- tide/current timing
- sunrise/sunset

These variables matter, but they should be evaluated as immediate-condition signals rather than historical-normal signals.

## 6. Data-quality and storage rules

### 6.1 Storage format
The first implementation should use a simple, auditable format such as:
- typed JSON files
- or typed TypeScript data exports

Do not over-engineer this into a database for phase 1.

### 6.2 Required metadata
Every baseline row/group must support:
- source metadata
- quality/confidence flag
- optional methodology note
- optional approximation note

### 6.3 Failure behavior
If a baseline is missing:
- the report must still run
- no score path should fail
- the engine should omit that comparison flag and reduce context richness if necessary

## 7. Engine usage rules

### Allowed uses
Historical baselines may be used to generate flags like:
- `recent_air_trend_cooler_than_normal`
- `recent_air_trend_warmer_than_normal`
- `recent_precip_wetter_than_normal`
- `recent_precip_drier_than_normal`
- `measured_coastal_temp_cooler_than_normal`
- `measured_coastal_temp_warmer_than_normal`
- `seasonal_progress_lagging`
- `seasonal_progress_accelerated`

Historical baselines may also support summary lines such as:
- "Recent temperatures have run slightly cooler than normal for March in this state."
- "Recent rainfall has been above normal for this month."

### Disallowed uses
Historical baselines may not be used to:
- turn missing freshwater water temperature into a fake measured score input
- produce exact fish-position claims
- rescue a strongly suppressive measured day by implying that historical context is more important than current conditions

## 8. Comparison design guidance

### Air-temperature comparison
The engine should be able to compare:
- recent 3-day trend vs state-month normal
- recent 7-day trend vs state-month normal
- recent 14-day trend vs state-month normal

At minimum, 7-day and 14-day comparisons should be supported.

### Precipitation comparison
The engine should compare recent precipitation windows against monthly normal totals in a sensible broad way. The first implementation does not need complex hydrology modeling.

### Freshwater temperature comparison
If freshwater temp is not directly measured, freshwater baseline ranges should support only broad context such as:
- likely seasonal lag
- likely seasonal acceleration
- cautious narration hints

They must not become fake measured temperature for the score.

## 9. Deliverables required from the implementation agent

The baseline phase is not complete unless the agent provides:
- baseline data files
- baseline type definitions
- baseline loading/util functions
- historical comparison helper(s)
- one baseline methodology/source summary document
- a short implementation summary of how missing baseline cases are handled
