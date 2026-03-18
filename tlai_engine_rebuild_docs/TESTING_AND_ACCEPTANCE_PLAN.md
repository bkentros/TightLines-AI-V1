# TESTING_AND_ACCEPTANCE_PLAN

## Purpose

This plan verifies that the rebuilt engine:
- scores consistently
- behaves sensibly by region/month/context
- degrades gracefully when data is missing
- drives the simplified UI correctly

---

## Test layers

### 1. Unit tests
Test individual normalizers and helpers.

### 2. Scoring tests
Test weight application, reweighting, and band mapping.

### 3. Golden scenario tests
Test realistic region/month/context cases.

### 4. Contract tests
Test edge-function output shape.

### 5. UI acceptance checks
Test the simplified screen and result rendering.

---

## Unit test coverage

### Temperature
- correct freshwater vs coastal table selection
- correct month row selection
- correct band assignment
- correct trend assignment for 72-hour movement
- correct shock assignment at 10°F threshold
- correct final temperature score clamping

### Pressure
- stable_positive
- stable_neutral
- falling
- volatile

### Wind
- light / moderate / strong / extreme threshold boundaries

### Light
- bright / mixed / low-light threshold boundaries

### Precipitation
- dry_stable / recent_rain / active_disruption

### Runoff
- low / medium / high sensitivity region mapping
- correct bucket assignment across thresholds

### Tide
- slack / moving / strong_moving / too_strong mapping

---

## Scoring tests

### Weight tests
- base weight selection by context
- month modifier application
- region modifier application
- cap clamping to base ±5

### Reweight tests
- one missing variable
- two missing variables
- fewer than 3 available variables

### Band tests
Verify exact mapping:
- 75–100 = Excellent
- 58–74 = Good
- 40–57 = Fair
- 0–39 = Poor

### Contribution ranking tests
- top drivers chosen from highest positive contributions
- top suppressors chosen from lowest / most negative contributions
- neutral/missing variables excluded

---

## Golden scenario suite

### 1. February Michigan freshwater river, warmer-than-normal day
Expected:
- temperature strongly positive
- runoff only negative if recent rain supports it
- tip may mention warmer part of day helping
- band likely Good if other conditions are not bad

### 2. February Michigan freshwater river, cold snap
Expected:
- temperature negative
- broad tip should not imply warm-day help
- score likely Fair/Poor depending on other variables

### 3. April Midwest river after heavy rain
Expected:
- runoff major suppressor
- river report clearly different from lake logic
- reliability high if precip windows are present

### 4. July Florida freshwater lake, very hot bright calm day
Expected:
- temperature may not help
- low-light importance may matter
- tip may favor cooler/low-light periods
- no exact hourly windows

### 5. October Northeast freshwater lake, stable mild conditions
Expected:
- balanced Good/Excellent possibility
- summary should feel stable rather than extreme

### 6. Summer Gulf Coast coastal day with strong movement and manageable wind
Expected:
- tide/current strong positive
- coastal-specific tip about moving water
- no brackish/salt split

### 7. Pacific Coast coastal day with strong wind suppressor
Expected:
- wind suppressor visible
- tip should reference protected water / reduced exposure

### 8. Data-missing coastal day with no tide data
Expected:
- report still returns
- weights rebalanced
- reliability reduced
- no tide claims in summary or tip

### 9. Data-missing freshwater day with only two variables available
Expected:
- report still returns
- reliability forced low
- wording broad and soft
- no overconfident detail

---

## Contract tests

Verify edge-function response includes:
- score
- band
- summary_line
- drivers
- suppressors
- actionable_tip
- optional daypart note
- reliability

Verify it does **not** include old window-heavy structures once the rebuild is complete.

---

## UI acceptance checks

### Input screen
- shows Freshwater Lake/Pond
- shows Freshwater River
- shows Coastal only when eligible
- no salt/brackish split
- no forecast strip

### Results screen
- score and band visible
- summary visible
- drivers visible
- suppressors visible
- actionable tip visible
- optional daypart note visible when applicable
- reliability note only when needed
- no exact timing cards

---

## Manual smoke-check list

At minimum, manually test:
- inland freshwater lake
- inland freshwater river
- coastal-eligible location
- one northern winter case
- one southern summer case
- one spring runoff case
- one missing-variable case

---

## Fail conditions

The rebuild should be considered incomplete if any of these happen:
- exact windows still appear
- forecast strip still appears
- brackish and saltwater still appear as separate tabs
- missing data causes hard failure
- missing data is narrated as if present
- freshwater narration mentions measured water temp
- old engine folders remain in active imports
- old report cards still render empty/legacy sections
