# FinFindr PierCast --- Implementation Specification

## Purpose

**PierCast** is a Great Lakes pier-fishing forecast that answers:

1.  **How good is this pier for fishing today and over the next 5
    days?**
2.  **Which species are realistically worth targeting from this pier
    during each forecast period?**

PierCast combines **configured local fishery knowledge** with **current
and forecast environmental data**. The engine must be reusable so a new
Great Lakes pier can be onboarded primarily through configuration rather
than new code.

------------------------------------------------------------------------

## Core Design Principle

**Fish presence and local availability come first.**

Good environmental conditions cannot create a high species rating if
that species is rarely available from that specific pier.

The scoring hierarchy is:

1.  Can this species realistically be available from this pier?
2.  How strong is this species' fishery at this specific pier?
3.  Is this a strong or weak year for that species?
4.  Is the species seasonally accessible from the pier right now?
5.  Are current/forecast environmental conditions increasing or
    decreasing that opportunity?
6.  Is the pier actually fishable?

Do **not** use a simple weighted average that allows excellent
temperature or weather to compensate for poor species presence.

------------------------------------------------------------------------

# Outputs

## 1. Overall Pier Score

A **1--10 score** answering:

> How good is the overall pier-fishing opportunity at this location
> during this forecast period?

This score is **independent of the individual species scores**. Do not
calculate it by averaging species ratings.

Use:

-   Port-specific general seasonal opportunity
-   Nearshore water temperature and trend
-   Wind/exposure
-   Waves and fishability
-   Relevant weather/light modifiers
-   Optional tributary influence where appropriate

The pier's general seasonal opportunity should prevent environmentally
favorable conditions from creating an unrealistically high overall
rating during a historically poor pier-fishing period.

------------------------------------------------------------------------

## 2. Species Opportunity Scores

Each relevant species receives an independent **1--10 opportunity
score** for that pier and forecast period.

Example:

-   Chinook --- 9.3
-   Coho --- 7.8
-   Steelhead --- 6.5

Do not display species whose current opportunity is irrelevant unless
needed.

------------------------------------------------------------------------

# Pier Configuration

Every pier should contain:

-   `pier_id`
-   Name
-   Great Lake
-   State/province
-   Latitude/longitude
-   Configured nearshore model sampling coordinate
-   Preferred observed temperature station, if available
-   Shoreline/pier exposure orientation
-   General seasonal pier-opportunity curve
-   Relevant species
-   Tributary/river association, if applicable
-   Fishability/safety thresholds
-   Data-source priority/fallback rules

**Do not automatically assume the nearest model grid point represents
the pier.** Configure an appropriate nearshore sampling location.

------------------------------------------------------------------------

# Pier × Species Configuration

Every relevant Pier × Species combination should contain:

### Local Fishery Baseline

How strong and consistently catchable this species is **from this
particular pier** compared with other locations.

This is a long-term characteristic of the fishery.

### Annual Abundance Modifier

Allows unusually strong or weak year classes, stocking changes,
survival, or population conditions to modify the long-term baseline
without rewriting it.

### Seasonal Accessibility Curve

A smooth year-round curve representing how likely that species is to be
within practical pier-fishing range at that location.

Avoid hard seasonal date switches.

### Temperature Suitability Curve

A continuous curve describing how favorable nearshore temperatures are
for **pier accessibility/behavior**, not merely the species' generic
physiological preferred temperature.

### Temperature-Trend Sensitivity

Defines how warming/cooling trends affect opportunity.

Magnitude, direction, and rate of change should be considered.

### Environmental Sensitivities

Species-specific effects where justified:

-   Wind/exposure
-   Waves
-   Light/cloud cover
-   Pressure/weather
-   Tributary flow/rainfall
-   Other future validated variables

Keep minor variables as modifiers rather than allowing them to dominate
the score.

------------------------------------------------------------------------

# Species Scoring Logic

Do not use a flat formula such as:

`30% baseline + 30% season + 30% temperature + 10% wind`

Instead use a gated model.

Conceptually:

**Availability Potential**

`Local Fishery Baseline × Annual Abundance × Seasonal Accessibility`

This establishes how much opportunity can realistically exist.

Then calculate:

**Environmental Suitability**

primarily from:

-   Current/forecast nearshore water temperature
-   Temperature trend
-   Relevant species-specific environmental modifiers

Environmental suitability determines how much of the available potential
is currently unlocked.

### Required behavior

Perfect temperature **must not** turn a weak local fishery into an elite
species opportunity.

Conversely, ideal conditions should be capable of strongly increasing
the score when the species has high local and seasonal availability.

Exact mathematical curves/coefficients should be configurable and
calibratable rather than hard-coded throughout the application.

------------------------------------------------------------------------

# Overall Pier Score Logic

The Overall Pier Score uses a separate model.

Conceptually:

`Port Seasonal Opportunity × Current Environmental Favorability`

Important factors:

1.  General seasonal opportunity for that specific pier
2.  Nearshore water temperature
3.  Temperature trend
4.  Wind/exposure
5.  Wave conditions
6.  Relevant weather/light modifiers
7.  Tributary influence where applicable
8.  Pier fishability

Do not allow species with naturally low availability at that port to
reduce the Overall Pier Score.

------------------------------------------------------------------------

# Wind Handling

Never treat compass wind direction as universally positive or negative.

Each pier has an exposure/orientation configuration.

Convert forecast wind into:

-   Onshore component
-   Offshore component
-   Alongshore component
-   Speed
-   Duration

This allows the same wind direction to affect opposite sides of a Great
Lake differently.

When forecast water temperature already comes from a hydrodynamic model
incorporating wind, avoid heavily counting wind again for its
temperature effect.

Wind may still independently affect waves, casting, drift, and pier
fishability.

------------------------------------------------------------------------

# Temperature Data

Use public Great Lakes observed and forecast data.

Source priority:

1.  Reliable nearby observed sensor for current conditions when
    representative
2.  Configured nearshore hydrodynamic model point
3.  Valid fallback model location

Track internal data quality/confidence.

The forecast engine should ingest multiple forecast periods rather than
only one daily temperature.

Preserve hourly/sub-daily temperature data internally so the engine can
detect:

-   Rapid cooling/warming
-   Upwelling/cold-water pushes
-   Best portions of a day

Daily scores can then summarize the underlying higher-resolution
calculations.

------------------------------------------------------------------------

# Tributary Influence

Some piers are associated with river mouths/harbors and migratory
fisheries.

Allow optional tributary inputs:

-   River discharge/flow
-   Flow trend
-   Recent rainfall
-   Other validated migration indicators

Apply these only to Pier × Species combinations where tributary
conditions meaningfully affect pier opportunity.

------------------------------------------------------------------------

# Fishability Gate

Separate **biological opportunity** from whether the pier is practically
fishable.

Consider:

-   Wave height
-   Wind
-   Severe weather
-   Ice
-   Known closure/access status when available

A species may have a high biological opportunity while the pier is
currently unfavorable or unsafe.

Do not silently erase the biological species score. Surface the
fishability limitation separately and allow it to cap or qualify the
Overall Pier Score.

------------------------------------------------------------------------

# Forecast

Generate ratings for:

-   Today
-   +1 day
-   +2 days
-   +3 days
-   +4 days
-   +5 days

Run calculations internally at the highest practical temporal resolution
supported by the forecast data, then aggregate into daily user-facing
scores.

Also determine a **best fishing window** when the sub-daily data
supports one.

Forecast confidence should decline with lead time, but **do not lower
the actual predicted rating solely because it is farther into the
future**. Store/display confidence separately.

------------------------------------------------------------------------

# Data Confidence

Maintain an internal confidence value based on:

-   Observed vs modeled temperature
-   Distance/representativeness of data source
-   Missing inputs
-   Forecast lead time
-   Stale data
-   Fallback data usage

The scoring engine must handle missing variables gracefully and should
never fabricate unavailable measurements.

------------------------------------------------------------------------

# User Experience

Keep the interface much simpler than the engine.

Example:

## PierCast --- Ludington

**Today: 8.9/10 --- Excellent**

### 5-Day Forecast

Sat 8.9 \| Sun 8.1 \| Mon 7.0 \| Tue 9.3 \| Wed 8.6

### Best Targets

-   Chinook --- 9.4
-   Steelhead --- 7.8
-   Coho --- 7.1

**Best Window:** 7 PM--11 PM

**Why:** Cooling nearshore water during strong seasonal Chinook
availability is improving pier opportunity.

Only expose technical environmental details when useful. The primary
experience should answer:

> Is this pier worth fishing, when should I go, and what should I
> target?

------------------------------------------------------------------------

# Architecture Requirement

Build PierCast as a **configuration-driven engine**.

Adding a new Great Lakes pier should primarily require:

1.  Pier configuration
2.  Environmental sampling/source configuration
3.  General pier seasonal curve
4.  Relevant species list
5.  Pier × Species configurations

It should **not require writing new scoring logic for each pier**.

Global species defaults may be used, but every Pier × Species
configuration must support overrides because Great Lakes fisheries
differ substantially by location.

------------------------------------------------------------------------

# Calibration Requirement

All scoring curves, gates, coefficients, thresholds, and modifiers must
be centrally configurable.

Do not bury constants throughout application code.

The system should support future calibration using:

-   Actual catch/report data
-   User feedback
-   Agency population/stocking information
-   Historical environmental conditions
-   Observed forecast performance

The initial engine should remain explainable and deterministic enough
that a developer can identify **why a score changed**.

------------------------------------------------------------------------

## Final Principle

PierCast predicts **fishing opportunity**, not guaranteed catch
probability.

Static/configured fishery knowledge determines **what opportunity
realistically exists**.

Live and forecast environmental conditions determine **how favorable
that opportunity is right now and over the next five days**.
