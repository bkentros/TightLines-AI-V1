# UI_UX_REBUILD_SPEC

## Purpose

This document defines the frontend changes required so the app UI matches the rebuilt engine.

The current How's Fishing UI is more complex than the rebuilt feature. It must be simplified.

---

## Product-level UI changes

### Keep
- the main How's Fishing entry point
- location-based report generation
- current-location flow
- water-context selection
- report generation button
- score + band presentation
- concise result explanation

### Remove or simplify
- 7-day forecast strip
- forecast-day modal prompt
- exact window sections
- separate saltwater / brackish tabs
- extra legacy V2/V3 report sections that assume the old engine contract
- overly dense result cards

---

## Input screen changes

### Final context choices
Only show:
- Freshwater Lake/Pond
- Freshwater River
- Coastal

### Coastal visibility rule
Only show `Coastal` if location is within 50 miles of an ocean coastline.

### Coastal eligibility implementation rule
Operationalize the 50-mile rule this way:
- use the existing coastal-proximity helper if the repo already has one
- otherwise compute straight-line distance from the resolved user coordinates to the nearest ocean coastline reference point or coastline geometry supported by the app
- Great Lakes shoreline does **not** count as coastal eligibility for this feature
- eligibility is a UI/input rule only; the engine itself remains capable of scoring `coastal` if explicitly called

### Important
- Great Lakes remain freshwater only
- no separate Saltwater and Brackish options in this rebuild

### Future-ready note
The UI should be implemented so future manual location search can be added without changing the engine contract.

That means:
- the report request builder should work from resolved lat/lon + context
- not from "device GPS only" assumptions

---

## Result screen design

### Required top section
Show:
- numeric score
- band
- concise summary line
- generated date / local-day context if currently shown in a clean way

### Required body sections
Show:
- Why today looks this way
  - up to 2 drivers
  - up to 2 suppressors
- What to do with it
  - one actionable tip
- Timing note
  - one optional broad daypart note
- Reliability note
  - only if medium or low

### Removed sections
Do not show:
- best times
- decent times
- worst times
- multiple time cards
- prime/good/fair/slow labels
- weekly strip
- future-day prompt modal

---

## UX goals

The rebuilt results screen should feel:
- faster
- cleaner
- less noisy
- more honest
- easier to scan

The user should understand the report in seconds.

---

## Recommended card layout

### Card 1 — Score
- Score number
- Band label
- Summary line

### Card 2 — Key factors
- Drivers
- Suppressors

### Card 3 — What to do
- Actionable tip
- Optional broad daypart note

### Card 4 — Reliability (conditional)
- only render if medium or low

---

## Existing frontend areas affected

### Likely affected screens / modules
- `app/how-fishing.tsx`
- `lib/howFishing.ts`
- `lib/howFishingV2.ts`
- `components/fishing/ReportView*`
- `components/fishing/WaterTypeTabBar*`
- `components/fishing/WeeklyForecastStrip.tsx`
- any helper types or cards currently built around:
  - best times
  - decent times
  - worst times
  - engine.v2 compatibility fields

---

## UI behavior changes

### Generation flow
The report should always represent today's full local day.

No future-day report generation in this rebuild.

### Refresh behavior
Refresh should simply regenerate today's current report for the active context.

### Tabs / context switching
If multiple contexts are available (for example inland freshwater vs coastal):
- allow user to switch context before generation
- after generation, show only the report for the chosen context
- do not keep legacy multi-report tab assumptions alive

---

## Copy changes

### Context labels
Use:
- Freshwater Lake/Pond
- Freshwater River
- Coastal

### Band labels
Use:
- Poor
- Fair
- Good
- Excellent

### Timing language
Use:
- Better early
- Better late
- Warmest part of the day may help
- Cooler / lower-light periods may be better
- Moving-water periods matter most
- No strong timing edge today

Do not use old exact timing phrasing.

---

## Simplification guidance for the agent

If a current UI section exists only because of the older engine output shape, remove it.

Do not preserve UI complexity that no longer maps to the rebuilt engine.
