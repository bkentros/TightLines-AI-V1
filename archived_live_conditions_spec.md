# LIVE CONDITIONS — "HOW'S FISHING RIGHT NOW"
## Complete Implementation Specification
### AI-Powered Real-Time Fishing Conditions Intelligence

---

> **Document Purpose:** This is a complete, unambiguous implementation specification for the Live Conditions feature. It covers every required API integration, the full scoring engine, all prompt engineering instructions, and the complete output specification. It is written to be handed directly to an AI coding agent or engineering team with no follow-up required.
>
> **Scope:** General fishing conditions assessment for any location — freshwater, saltwater, and brackish. This feature is NOT species-specific. Species-specific advice is handled by the Recommender feature.
>
> **Key Distinction from Recommender:** The Recommender is a deep, user-configured tool. This feature is a single tap — "how's fishing right now?" — that reads the user's GPS location and returns an honest, biologically-grounded conditions assessment with zero configuration required.

---

## TABLE OF CONTENTS

1. [Feature Architecture Overview](#section-1)
2. [Required API Integrations](#section-2)
3. [Dashboard — Live Conditions Feed (Collapsed View)](#section-3)
4. [Expanded Conditions Page (Full Detail View)](#section-4)
5. [Conditions Scoring Engine](#section-5)
6. [7-Day History & Recovery Modifier](#section-6)
7. [Time Window Engine](#section-7)
8. [AI Prompt Engineering Specification](#section-8)
9. [Complete Output Specification](#section-9)
10. [Caching, Cost & Implementation Notes](#section-10)

---

## SECTION 1 — FEATURE ARCHITECTURE OVERVIEW {#section-1}

### User Flow

```
HOME SCREEN DASHBOARD
└─> Live Conditions card (collapsed — shows basic conditions at a glance)
        │
        │  [User taps card]
        ▼
EXPANDED CONDITIONS PAGE (full detail view)
Shows all condition variables in large cards:
  - Weather variables (temp, wind, pressure, cloud, precip)
  - Lunar variables (moon phase, solunar windows)
  - Tide variables (saltwater/brackish only)
  - Historical context (7-day pressure + temp trend)
        │
        │  [User taps "How's Fishing Right Now?"]
        ▼
AI ANALYSIS (single API call)
        │
        ▼
RESULTS PAGE
  1. Overall Fishing Rating
  2. Best Times to Fish Today
  3. Worst Times to Fish Today
  4. Key Factors Breakdown
  5. Tips for Today
```

### Data Flow

```
GPS Location
     │
     ├──> Weather API          → temp, wind, pressure, cloud, precip, 7-day history
     ├──> Moon/Solunar API     → moon phase, illumination, solunar windows
     ├──> Tide API             → tide phase, direction, times (salt/brackish only)
     ├──> Astronomy API        → sunrise, sunset, civil twilight times
     │
     ▼
Conditions Scoring Engine
     │
     ├──> Raw Score (0–100)
     ├──> Recovery Modifier (post-front adjustment)
     ├──> Adjusted Score
     ├──> Time Window Engine output
     │
     ▼
Structured JSON payload → Claude API → Formatted output
```

---

## SECTION 2 — REQUIRED API INTEGRATIONS {#section-2}

### 2A. APIs Already in Use (Basic Dashboard)

These are assumed to already be integrated for the basic dashboard weather feed:

| Variable | Source | Endpoint Notes |
|---|---|---|
| Air Temperature (°F) | OpenWeatherMap / Open-Meteo | Current conditions |
| Wind Speed (mph) | OpenWeatherMap / Open-Meteo | Current conditions |
| Wind Direction | OpenWeatherMap / Open-Meteo | Cardinal + degrees |
| Cloud Cover (%) | OpenWeatherMap / Open-Meteo | 0–100% |
| Precipitation | OpenWeatherMap / Open-Meteo | Type + intensity |
| Barometric Pressure (mb) | OpenWeatherMap / Open-Meteo | Current reading |

### 2B. Additional APIs Required for Expanded View + AI Analysis

The following APIs must be added. Without them, the AI analysis will be incomplete and inaccurate. Each is listed with its endpoint, what it returns, and why it is required.

---

#### API 1 — Barometric Pressure History
**Provider:** Open-Meteo (free) or OpenWeatherMap Historical (free tier available)
**Why it's required:** A single pressure reading tells you nothing. The *trend* and *rate of change* over the past 6 hours, and the *history* over the past 7 days to detect cold front passage, are the most important variables in the entire scoring system. Without this, the engine cannot calculate the Recovery Modifier (post-front adjustment) or determine pressure trend direction.

**What to fetch:**
- Pressure readings at 1-hour intervals for the past 6 hours (for trend calculation)
- Pressure readings at 24-hour intervals for the past 7 days (for front detection)

**Open-Meteo endpoint:**
```
https://api.open-meteo.com/v1/forecast?
  latitude={lat}&longitude={lon}
  &hourly=surface_pressure
  &past_days=7
  &forecast_days=1
  &timezone=auto
```

**Calculate from response:**
- Pressure trend: compare current reading to reading 3 hours ago
  - Change > +1.5 mb/hr = rapidly rising
  - Change +0.5 to +1.5 mb/hr = slowly rising
  - Change within ±0.5 mb/hr = stable
  - Change -0.5 to -1.5 mb/hr = slowly falling
  - Change > -1.5 mb/hr = rapidly falling
- Front detection: scan 7-day history for a drop of 4+ mb over 12 hours followed by a rise of 4+ mb over 12 hours. Record date of most recent qualifying event. Calculate days elapsed since that event.

---

#### API 2 — 7-Day Temperature History
**Provider:** Open-Meteo (free)
**Why it's required:** The direction of temperature change over the past 72 hours determines whether fish are in a warming trend (increasing aggression), cooling trend (repositioning), or urgent feed-up window (rapid drop). A single current temperature reading cannot reveal any of this.

**What to fetch:**
- Daily high/low air temperature for the past 7 days
- Hourly air temperature for the past 72 hours (for trend calculation)

**Open-Meteo endpoint:**
```
https://api.open-meteo.com/v1/forecast?
  latitude={lat}&longitude={lon}
  &hourly=temperature_2m
  &daily=temperature_2m_max,temperature_2m_min
  &past_days=7
  &forecast_days=1
  &timezone=auto
  &temperature_unit=fahrenheit
```

**Calculate from response:**
- 3-day temp trend: compare today's average temp to average from 3 days ago
  - Warming (+2°F or more) = POSITIVE
  - Stable (within 1°F) = NEUTRAL
  - Slowly cooling (-1 to -3°F) = CAUTION
  - Rapidly cooling (>3°F drop in 24hrs) = URGENT FEED-UP WINDOW — flag prominently

---

#### API 3 — 7-Day Precipitation History
**Provider:** Open-Meteo (free)
**Why it's required:** Recent heavy rain affects water clarity, runoff levels, dissolved oxygen, and fish positioning for days after the rain event ends. Knowing that it rained 1.5 inches two days ago explains stained water conditions and predicts where fish are likely holding even if current conditions look clean.

**What to fetch:**
- Daily precipitation totals for the past 7 days
- Precipitation type (rain vs. snow vs. none)

**Open-Meteo endpoint:**
```
https://api.open-meteo.com/v1/forecast?
  latitude={lat}&longitude={lon}
  &daily=precipitation_sum,precipitation_hours
  &past_days=7
  &forecast_days=1
  &timezone=auto
```

**Calculate from response:**
- Total precipitation in past 48 hours (post-rain override trigger if > 2 inches)
- Total precipitation in past 7 days (for context)

---

#### API 4 — Sunrise, Sunset & Civil Twilight
**Provider:** Sunrise-Sunset.org (free) or Open-Meteo (free, included in weather response)
**Why it's required:** Dawn and dusk light windows are consistently the highest-percentage feeding times for virtually all species. The exact times are required to calculate Time Windows accurately. Civil twilight (the 30 minutes before sunrise and after sunset when it is still dark but sky begins/ends glowing) is the peak of the peak — the single most productive fishing window of any day.

**Sunrise-Sunset.org endpoint:**
```
https://api.sunrise-sunset.org/json?
  lat={lat}&lng={lon}
  &date=today
  &formatted=0
```

**Returns:**
- `sunrise` — exact UTC timestamp of sunrise
- `sunset` — exact UTC timestamp of sunset
- `civil_twilight_begin` — start of civil twilight (before sunrise)
- `civil_twilight_end` — end of civil twilight (after sunset)

**Convert to local time using device timezone. Calculate:**
- Dawn window: civil_twilight_begin to 90 minutes after sunrise
- Dusk window: 90 minutes before sunset to civil_twilight_end
- Midday: 3 hours after sunrise to 3 hours before sunset

---

#### API 5 — Moon Phase & Solunar Windows
**Provider:** Farmsense (paid, purpose-built for fishing/hunting) OR AstroAPI (free tier available) for moon data + custom solunar calculation
**Why it's required:** Solunar theory identifies the gravitational windows when feeding activity peaks — moon overhead (major), moon underfoot (major), moonrise (minor), moonset (minor). These are not the same as tide times. In freshwater, these are the primary feeding timers. In saltwater, they support the tide-based timing. Moon phase determines the intensity of all solunar periods and is a direct spawn trigger for many species.

**Farmsense endpoint (recommended — purpose-built):**
```
https://api.farmsense.net/v1/moonphases/?
  d={unix_timestamp}
```

**Returns:**
- Moon phase name (New, Waxing Crescent, First Quarter, Waxing Gibbous, Full, etc.)
- Moon illumination percentage (0–100%)
- Moonrise and moonset times
- Major solunar period start/end times (moon overhead + underfoot)
- Minor solunar period start/end times (moonrise + moonset)
- Solunar rating for the day (1–5 scale)

**Alternative — calculate manually from moon position:**
If using AstroAPI or similar for moon position data, major solunar periods are centered on the times when the moon is directly overhead (upper transit) and directly underfoot (lower transit). Major periods last approximately 2 hours (1 hour before and 1 hour after transit). Minor periods are centered on moonrise and moonset and last approximately 1 hour.

---

#### API 6 — Tide Data (Saltwater / Brackish Locations Only)
**Provider:** NOAA CO-OPS API (free, US waters) or WorldTides (paid, global)
**Why it's required:** For inshore saltwater and brackish species, tide phase is the single most important feeding timer — more important even than solunar windows. Moving water forces baitfish and directly triggers feeding behavior. Without tide data, the AI analysis is fundamentally incomplete for any coastal or estuarine location.

**Detection logic:** Determine whether the user's GPS location is within 50 miles of a coastline or tidal waterway. If yes, attempt to find the nearest NOAA tide station and fetch tide data. If no station is found within range, treat as freshwater/no-tide.

**NOAA CO-OPS API endpoint:**
```
Nearest station lookup:
https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?
  type=tidepredictions
  &units=english

Tide predictions for nearest station:
https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?
  station={station_id}
  &product=predictions
  &datum=MLLW
  &time_zone=lst_ldt
  &interval=hilo
  &units=english
  &application=fishing_app
  &format=json
  &begin_date={today}
  &end_date={today}
```

**WorldTides endpoint (global alternative):**
```
https://www.worldtides.info/api/v3?
  heights&extremes
  &lat={lat}&lon={lon}
  &key={api_key}
  &days=1
```

**Calculate from response:**
- Current tide phase: compare current time to high/low tide times
  - If between low and high, moving toward high = incoming (flood)
  - If between high and low, moving toward low = outgoing (ebb)
  - If within 30 minutes of high or low = approaching slack
  - If at high or low ± 15 minutes = slack
- Hours until next tide change
- Rate of tide change (height delta per hour) — faster change = more active fishing

---

#### API Summary — What Each Variable Enables

| API | Variables Returned | Feature Unlocked |
|---|---|---|
| Open-Meteo (historical) | 7-day pressure history, 7-day temp history, 7-day precip history | Recovery Modifier, Temp Trend Signal, Post-Rain Override |
| Sunrise-Sunset.org | Sunrise, sunset, civil twilight times | Dawn/Dusk window scoring, Time Window Engine |
| Farmsense / AstroAPI | Moon phase, illumination, solunar major/minor windows | Solunar scoring, Moon phase scoring, nocturnal feeding context |
| NOAA / WorldTides | Tide phase, tide height, high/low times | Tide scoring (saltwater), saltwater Time Window Engine |

---

## SECTION 3 — DASHBOARD: LIVE CONDITIONS FEED (COLLAPSED VIEW) {#section-3}

The collapsed dashboard card shows a quick-scan summary of current conditions. It must load fast — data should be cached and refreshed on a configurable interval (suggested: 30 minutes). This view does NOT show solunar or tide data — those are shown in the expanded view.

### Collapsed Card — Required Data Points

| Data Point | Source | Display Format |
|---|---|---|
| Air Temperature | Weather API | "72°F" |
| Wind | Weather API | "SW 8 mph" |
| Barometric Pressure | Weather API | "29.92 inHg — Falling" |
| Cloud Cover | Weather API | "Partly Cloudy (45%)" |
| Precipitation | Weather API | "None" or "Light Rain" |
| Conditions Score (pre-calculated) | Scoring Engine | "Good — 71/100" |

The Conditions Score on the collapsed card must be calculated and cached at the same time as the weather data refresh. It does not require an AI call — it is a deterministic score from the Conditions Scoring Engine (Section 5).

---

## SECTION 4 — EXPANDED CONDITIONS PAGE (FULL DETAIL VIEW) {#section-4}

When the user taps the collapsed card, the Expanded Conditions Page loads. This page shows all variables in large, readable cards before the user triggers the AI analysis. The purpose of this page is to give the angler full situational awareness before they tap "How's Fishing Right Now?"

### Required Cards on Expanded Page

**Card 1 — Weather Conditions**
- Air temperature + 7-day trend (warming / stable / cooling)
- Wind speed, direction, gust speed
- Barometric pressure + trend label (Rapidly Falling / Slowly Falling / Stable / Slowly Rising / Rapidly Rising)
- Cloud cover percentage + descriptive label
- Precipitation type and intensity
- Humidity

**Card 2 — Pressure History (Visual)**
- Mini sparkline or bar chart of pressure over the last 7 days
- Visual highlight of any detected cold front events
- Label: "Last cold front: X days ago" or "No recent fronts detected"

**Card 3 — Temperature Trend**
- Current air temp
- 3-day trend direction with label (Warming / Stable / Cooling / URGENT: Rapid Drop)
- 7-day high/low chart

**Card 4 — Lunar Conditions**
- Moon phase name + visual icon
- Moon illumination percentage
- Moonrise and moonset times
- Today's major solunar windows (times + duration)
- Today's minor solunar windows (times + duration)
- Daily solunar rating (1–5)

**Card 5 — Tide Conditions (Saltwater / Brackish Only)**
- Current tide phase (Incoming / Outgoing / Slack)
- Current tide height
- Next high tide time + height
- Next low tide time + height
- Tidal range for the day (difference between high and low)
- Hours until next tide change

**Card 6 — Light Conditions**
- Sunrise time
- Sunset time
- Civil twilight begin (morning)
- Civil twilight end (evening)
- Current light condition label (Pre-Dawn / Dawn Window / Morning / Midday / Evening / Dusk Window / Night)

**Card 7 — Conditions Score**
- Adjusted Score (0–100) with label
- Score breakdown showing contribution of each variable
- Recovery modifier note if applied (e.g., "Score reduced — cold front 2 days ago")

### "How's Fishing Right Now?" Button
- Displayed prominently at the bottom of the Expanded Conditions Page
- Triggering it initiates the AI API call
- Button should be disabled / show spinner during API call
- Results navigate to the Results Page

---

## SECTION 5 — CONDITIONS SCORING ENGINE {#section-5}

The Conditions Scoring Engine produces a deterministic Raw Score (0–100) from environmental data alone, before any AI call is made. This score is used on both the collapsed dashboard card and as a primary input to the AI analysis. The Recovery Modifier is then applied to produce the Adjusted Score.

This scoring system is intentionally separated from the Recommender's scoring engine. The Recommender incorporates species-specific variables (optimal temp range per species, spawn state, etc.). This engine scores conditions objectively for all fish in general — it is the universal baseline.

**Variable weights are water-type-specific.** The same environmental variable has fundamentally different biological importance depending on whether the angler is fishing freshwater, saltwater, or brackish. A single universal weight table would produce systematically inaccurate scores — for example, treating tide phase as equal in importance to solunar windows when in saltwater tide is a structural forcing mechanism and solunar is a soft gravitational cue. The three tables below each total 100 points and reflect the actual biological hierarchy for each water type.

### 5A. Variable Weights by Water Type (each totals 100 points)

**Freshwater**

| Variable | Max Points | Rationale |
|---|---|---|
| Barometric Pressure Trend | 28 pts | Dominant variable in enclosed freshwater. Fish have no tidal forcing to override pressure stress — they simply suspend and stop feeding post-front until fully recovered. |
| Light Conditions | 20 pts | Dawn and dusk are the primary feeding clocks in freshwater. No tidal override exists. Light is the single strongest behavioral trigger for predator activity. |
| Water Temp Absolute Zone | 12 pts | New variable. Enclosed freshwater bodies swing in temperature rapidly. Absolute zone determines whether fish are metabolically capable of feeding at all. Inferred via AI-enhanced thermal lag formula — see Section 5J. |
| Temperature Trend (3-day direction) | 12 pts | Trend direction amplified or suppressed by absolute zone (see 5E and 5J coupling). Rapid cooling at prime temps triggers feed-up; rapid cooling into lethargic zone triggers shutdown. |
| Solunar Period | 12 pts | Soft gravitational feeding cue. Well-documented correlation with feeding activity but not a forcing mechanism — fish can and do ignore it under bad pressure or extreme temps. |
| Wind | 10 pts | Oxygenates water, creates surface chop, concentrates baitfish on windward banks. Genuinely important in freshwater. |
| Moon Phase | 4 pts | Drives solunar intensity but tidal amplitude is irrelevant in freshwater. Secondary influence only. |
| Precipitation | 2 pts | Light rain is mildly beneficial. Heavy rain has limited impact in large water bodies. The absolute temp zone already captures cold-rain-shutdown scenarios. |
| **TOTAL** | **100 pts** | |

**Saltwater**

| Variable | Max Points | Rationale |
|---|---|---|
| Tidal Phase | 25 pts | Elevated from universal 15 pts. Tidal current is a structural biological forcing mechanism — baitfish, oxygen, and predators all move because water moves. Fish feed because they must navigate current. |
| Barometric Pressure Trend | 22 pts | Reduced from 28 pts. Tidal current partially overrides pressure stress — post-front fish in saltwater are forced to reposition with tidal flow and often feed opportunistically even under poor pressure. |
| Light Conditions | 14 pts | Reduced from 20 pts. Light still matters but an incoming tide at noon outperforms a perfect dawn window on dead slack water. Tide is the primary clock in salt. |
| Moon Phase | 10 pts | Elevated from 4 pts. Moon phase directly controls spring vs. neap tidal amplitude — new/full moon produces strongest current and most productive inshore conditions. This is a structural force variable, not secondary. |
| Water Temp Absolute Zone | 10 pts | Saltwater water temp is measured directly from NOAA CO-OPS tide stations (same endpoint already queried for tides). Cold stun events in shallow coastal species are real and catastrophic — see Section 5J. |
| Temperature Trend (3-day direction) | 8 pts | Reduced from 12 pts. Ocean and coastal water bodies are thermally buffered — 3-day air temp trends have far less direct impact than in enclosed freshwater lakes. |
| Wind | 8 pts | Wind matters through a different mechanism in salt — wind vs. tide direction in passes and inlets, baitfish concentration, boat safety. Slightly reduced from freshwater. |
| Precipitation | 3 pts | Open saltwater fish are nearly unaffected by rain. Small weight retained for extreme post-storm surge scenarios. |
| **TOTAL** | **100 pts** | |

**Brackish**

| Variable | Max Points | Rationale |
|---|---|---|
| Barometric Pressure Trend | 24 pts | Between freshwater and saltwater. Tidal current exists but is attenuated vs. open coast. Pressure stress recovery is intermediate. |
| Tidal Phase + Solunar (blended) | 20 pts | Combined and elevated from 15 pts. Both timers are active in estuarine environments. Moving water in a tidal creek or estuary is a genuine forcing mechanism even if weaker than open coast. Scored as blended 50/50 — see Section 5D. |
| Light Conditions | 16 pts | Between freshwater (20) and saltwater (14). Light matters significantly in shallow estuary flats environments where species like redfish tail and hunt visually. |
| Water Temp Absolute Zone | 12 pts | Brackish environments are shallow and thermally volatile — closer to freshwater in thermal behavior. Cold events in estuaries can be severe. Measured from NOAA where available; inferred fallback. |
| Temperature Trend (3-day direction) | 10 pts | Estuaries respond faster thermally than open coast but slower than enclosed lakes. Intermediate weight. |
| Wind | 8 pts | Wind vs. tide direction matters in tidal creeks and passes. Same weight as saltwater. |
| Moon Phase | 7 pts | Between freshwater (4) and saltwater (10). Tidal amplitude effect is real in estuaries but attenuated compared to open coast. |
| Precipitation | 3 pts | Heavy rain in brackish estuaries causes salinity crashes that displace species entirely. Scored at 3 because the damage is scenario-specific and triggers a separate Salinity Disruption Alert — see Section 5H. |
| **TOTAL** | **100 pts** | |

---

### 5B. Barometric Pressure Scoring

**Max points by water type: Freshwater = 28 pts | Saltwater = 22 pts | Brackish = 24 pts**

The scoring table below produces a normalized 0–100% score that is then scaled to the water-type-specific max. The biological mechanism (swim bladder response to pressure change) is universal across all fish — what differs is the degree to which tidal current can override pressure stress. In saltwater, a fish on an active incoming tide is forced to reposition and feed regardless of pressure discomfort. In enclosed freshwater, no such forcing exists.

Calculate pressure trend from the difference between the current reading and the reading from 3 hours ago, expressed as mb/hr.

| Pressure State | % of Max | Biological Explanation |
|---|---|---|
| Rapidly falling (> 1.5 mb/hr drop) | 90–100% | The swim bladder of a fish functions as an internal barometer. Falling pressure causes the gas inside to expand slightly, creating a sensation of buoyancy and physical well-being. Fish respond with pre-front aggression — feeding heavily before the cold arrives. This is empirically the best single fishing condition that exists. In saltwater, this effect is still strong but partially masked by tidal activity. |
| Slowly falling (0.5–1.5 mb/hr drop) | 70–89% | Same biological mechanism, less urgent. Fish are actively feeding and willing to chase presentations. Excellent conditions across all water types. |
| Stable low pressure (< 1010 mb, stable ± 0.5 mb/hr) | 50–69% | Overcast skies and low light typically accompany low pressure systems. Fish are comfortable and feeding normally. Consistent, fishable conditions. |
| Stable high pressure (> 1018 mb, stable ± 0.5 mb/hr) | 40–56% | Clear skies, bright sun, fish are deep and predictable. Feeding is measured and deliberate. Pattern fishing works but fish are not aggressive. |
| Slowly rising (0.5–1.5 mb/hr rise) | 20–39% | Post-front recovery underway. Fish beginning to return to structure but still cautious. In saltwater, tidal current accelerates this recovery — fish begin feeding sooner than freshwater counterparts. |
| Rapidly rising (> 1.5 mb/hr rise, post-front) | 0–19% | The worst scenario. Rapid pressure increase after cold front passage maximally stresses the swim bladder. In freshwater: fish suspend mid-column, stop feeding entirely, nearly uncatchable. In saltwater: still very difficult but tidal movement forces some activity. Do not sugarcoat this in the output. |

**Implementation:** `pressure_score = (percentage × water_type_max) / 100`, rounded to nearest integer.

---

### 5C. Light Condition Scoring

**Max points by water type: Freshwater = 20 pts | Saltwater = 14 pts | Brackish = 16 pts**

Light is the primary feeding clock in freshwater — no tidal override exists, so dawn and dusk windows are the single strongest behavioral triggers available. In saltwater, tide is the primary clock and light is secondary; an incoming tide at noon outperforms a perfect dawn on dead slack water. Brackish is intermediate — shallow estuary environments mean light still matters significantly for species hunting visually on flats.

The table below produces a normalized 0–100% score scaled to the water-type max.

Calculate current light condition by comparing current time to civil twilight begin, sunrise, sunset, and civil twilight end.

| Light Condition | % of Max | Biological Explanation |
|---|---|---|
| Civil twilight to 90 min post-sunrise (Dawn Window) + overcast | 90–100% | Peak feeding window in freshwater. Predators have maximum visual advantage over prey in low light. Baitfish are active near the surface, fish that held deep overnight are pushing shallow. Overcast extends this window further. In saltwater and brackish, this is still excellent but subordinate to tide state. |
| 90 min pre-sunset to civil twilight end (Dusk Window) + overcast | 90–100% | Equivalent to dawn. Fish that retreated deep during midday return to feeding edges. Cooling air temperatures in the evening also trigger surface activity. |
| Dawn window + clear sky | 70–89% | Same timing advantage but fish may push off faster once full sun hits. Still excellent across all water types. |
| Dusk window + clear sky | 70–89% | Same as above. |
| Overcast all day, midday | 50–69% | Continuous low light maintains feeding posture throughout the day. Some of the most productive all-day fishing occurs under solid overcast — especially in freshwater where no tidal trigger exists midday. |
| Night (civil twilight end to civil twilight begin next day) | 45–65% | Species-dependent. Many predators feed actively at night. Score conservatively for general assessment. In saltwater, night + strong tidal movement is a high-value combination. |
| Partly cloudy, midday (intermittent cloud cover) | 30–49% | Fish go active when clouds pass over and retreat when sun re-emerges. Inconsistent but fishable. |
| Full sun, midday, clear sky | 0–24% | Maximum light penetration. Predators lose ambush advantage. Fish retreat to shade, structure, or depth. Very difficult in freshwater. In saltwater, active tide partially offsets this — fish must still move with current. |

**Implementation:** `light_score = (percentage × water_type_max) / 100`, rounded to nearest integer.

---

### 5D. Solunar / Tide Scoring

**Max points by water type: Freshwater = 12 pts (solunar only) | Saltwater = 25 pts (tide primary) | Brackish = 20 pts (blended 50/50)**

**Water type routing — three paths:**
- **Freshwater:** Use Solunar Scoring exclusively. Tide section hidden from output.
- **Saltwater:** Use Tide Phase Scoring as primary timer. Solunar shown in output as secondary context only. This category includes all ocean-adjacent US coastal waters with a NOAA tide station within 50 miles, and international ocean-adjacent waters (WorldTides fallback).
- **Brackish:** Blended scoring — 50% tide phase score + 50% solunar score, averaged to produce the section 5D points. Both timers displayed in output. Tidal influence is real but attenuated in estuarine environments; fish respond to both gravitational triggers.
- **Unknown / cannot determine from GPS:** Default to Solunar Scoring (freshwater path).

> **Implementation note:** Water type is detected automatically by GPS. See Section 10C for detection logic. The user sees three pre-generated report tabs (Freshwater / Saltwater / Brackish) when within 50 miles of the coast. Only the Freshwater tab is generated for inland users. See Section 9 for tab display spec.

#### Solunar Scoring — Freshwater (and 50% weight for Brackish)

| Solunar Period | Points |
|---|---|
| Within major solunar window (~2hr window centered on moon overhead or underfoot) | 12–15 pts |
| Within 30 minutes of a major window (approaching or just ending) | 8–11 pts |
| Within minor solunar window (~1hr window centered on moonrise or moonset) | 6–9 pts |
| Within 30 minutes of a minor window | 4–6 pts |
| Outside all solunar windows | 0–3 pts |

#### Tide Phase Scoring — Saltwater (primary) and Brackish (50% weight)

| Tide State | Points | Biological Explanation |
|---|---|---|
| First 2 hours of incoming tide | 12–15 pts | Baitfish pushed onto flats and into structure by rising water. Predators follow and feed aggressively. The most productive inshore window. |
| Mid incoming tide | 8–11 pts | Sustained feeding, fish spread across available structure. |
| First 2 hours of outgoing tide | 11–14 pts | Water flushing through cuts, passes, and creek mouths concentrates baitfish. Ambush predators stack on current breaks. Often equals or exceeds incoming tide productivity. |
| Mid outgoing tide | 7–10 pts | Sustained but fish begin repositioning toward ambush points at current breaks. |
| Final hour before slack | 3–6 pts | Tide momentum slowing. Baitfish dispersing. Feeding activity dropping. |
| Slack tide | 0–2 pts | Water stopped. Bait disperses. Predators scatter or suspend. Least productive inshore window. |

**Brackish blended score formula:**
```
Section5D_score = (solunar_score × 0.50) + (tide_phase_score × 0.50)
```

---

### 5E. Temperature Trend Scoring

**Max points by water type: Freshwater = 12 pts | Saltwater = 8 pts | Brackish = 10 pts**

**CRITICAL: This section is coupled with Section 5J (Water Temp Absolute Zone).** The trend score is not standalone — it is multiplied by a zone context modifier derived from the current absolute water temperature. The direction of a temperature change means completely different things depending on where the temperature is landing. A rapid cooling drop from 78°F → 70°F is a legitimate feed-up window. A rapid cooling drop from 44°F → 36°F is a shutdown accelerating. The old universal table scored both identically at 12–15 pts — this was wrong.

#### 5E Base Trend Score (% of max before zone modifier)

| 3-Day Temperature Trend | % of Max | Biological Explanation |
|---|---|---|
| Rapid warming (+4°F or more in 72 hours) | 87–100% | Fish metabolism accelerating rapidly. Aggression increasing. Fish moving shallower toward structure. Pre-spawn staging behavior may be triggered. Excellent conditions — if landing in Active or Peak zone. |
| Steady warming (+1–3°F in 72 hours) | 67–83% | Gradual metabolic increase. Fish becoming more active day by day. Good conditions improving. |
| Stable (within 1°F over 72 hours) | 53–67% | Fish fully adjusted to current conditions. Patternable, holding consistent locations. Neutral — neither improving nor degrading. |
| Slow cooling (-1 to -3°F in 72 hours) | 33–53% | Fish beginning to reposition toward deeper or thermal refuges. Transitional — fishing is possible but patterns are shifting. |
| Rapid cooling (-4°F or more in 24 hours) | 80–100% | IMPORTANT: Base score is HIGH because rapid cooling can trigger an urgent feed-up window. However, this score is subject to heavy zone modifier suppression — see table below. Do not apply high score unless landing zone confirms it. |
| Prolonged cold (see 5J zone thresholds, 7+ days) | 0–20% | Fish fully cold-adapted and lethargic. Metabolism near minimum. Only the most finesse presentations may work. |

#### 5E Zone Context Modifier (multiply base trend score by this)

| Trend Direction | Landing Zone (from 5J) | Modifier | Reasoning |
|---|---|---|---|
| Rapid cooling | Active → Active or Peak → Active | × 1.0 | Classic feed-up window — heading into or staying in prime temps. Full score. |
| Rapid cooling | Any zone → Transitional | × 0.70 | Partial feed-up — some species still responsive, others shutting down. |
| Rapid cooling | Any zone → Lethargic | × 0.25 | Not a feed-up. This is a shutdown entering. Suppress aggressively. |
| Rapid cooling | Any zone → Near-shutdown | × 0.0 | Override to zero. No feed-up possible. Fish cannot respond physiologically. |
| Rapid warming | Lethargic / Transitional → Active | × 1.0 | Real awakening event. Fish metabolism coming online. Full score. |
| Rapid warming | Already Active (staying in Active) | × 0.80 | Still good but diminishing returns — fish are already feeding. |
| Rapid warming | Any zone → Thermal Stress (heat) | × 0.10 | Warming into danger zone. Fish retreating, not feeding. Nearly zero. |
| Stable | Active / Peak zone | × 1.0 | Patternable, consistent. Full neutral score. |
| Stable | Lethargic / Near-shutdown zone | × 0.40 | Stable but cold — fish barely moving regardless of stability. |

**Rapid cooling feed-up override rule (freshwater):** If rapid cooling is detected AND the landing water temp (from 5J) is below the Transitional threshold for that water type, suppress the feed-up flag entirely and replace with: *"Rapid cooling detected — but water temperature has entered the lethargic zone. Any feed-up window has closed."*

**Final 5E score formula:**
```
trend_base_pct = base trend score as percentage (from table above)
zone_modifier = zone context modifier (from table above)
5E_score = round((trend_base_pct / 100) × water_type_max × zone_modifier)
```

---

### 5F. Wind Scoring

**Max points by water type: Freshwater = 10 pts | Saltwater = 8 pts | Brackish = 8 pts**

Wind affects freshwater and saltwater environments through fundamentally different mechanisms. In freshwater, wind oxygenates the water column, creates surface chop that reduces fish wariness, and concentrates baitfish on windward banks — direction is secondary to speed. In saltwater and brackish environments, the critical variable is **wind direction relative to tide direction**. Wind-with-tide smooths the surface and accelerates baitfish concentration through passes; wind-against-tide creates dangerous standing waves in inlets and passes, degrades presentation control, and is a real safety hazard in inshore boats.

#### Freshwater Wind Scoring (max 10 pts)

| Wind Condition | Points | Biological Explanation |
|---|---|---|
| 5–12 mph, any direction | 8–10 pts | Ideal range. Surface chop breaks up light refraction, reducing fish wariness. Baitfish pushed to windward banks. Slightly elevated dissolved oxygen from wave action. |
| 0–4 mph (calm) | 5–7 pts | Clear surface, fish can see threats clearly, more deliberate feeding. Not bad — requires more precise presentations. |
| 13–20 mph | 5–7 pts | Windward banks concentrate baitfish and produce well. Casting accuracy decreases. Still fishable with adjustment. |
| > 20 mph | 0–4 pts | Difficult to fish effectively. Presentation control degrades significantly. |

#### Saltwater / Brackish Wind Scoring (max 8 pts)

| Wind Condition | Points | Biological Explanation |
|---|---|---|
| 5–12 mph, wind-with-tide direction | 7–8 pts | Optimal. Wind assists tidal flow, concentrates baitfish against structure. Surface chop reduces fish wariness without creating dangerous conditions. |
| 5–12 mph, wind-against-tide direction | 4–5 pts | Chop created in passes and inlets can degrade boat control and presentation. Fish still active on tide but conditions less comfortable. |
| 0–4 mph (calm) | 4–6 pts | Calm in salt means no wind-assisted baitfish concentration and a flat, clear surface that increases fish wariness. Still fishable. |
| 13–20 mph, wind-with-tide | 4–6 pts | Active fishing possible on lee shores and inside structure. Baitfish heavily concentrated. Boat handling requires attention. |
| 13–20 mph, wind-against-tide | 1–3 pts | Standing waves in inlets and passes. Dangerous for small inshore boats. Fish activity reduced by turbulent conditions. |
| > 20 mph | 0–2 pts | Difficult to dangerous conditions inshore. Presentation control near impossible. Safety concern. |

> **Implementation note:** Wind direction vs. tide direction requires comparing `wind_direction` from Open-Meteo with the current tidal phase direction (incoming = generally landward, outgoing = generally seaward). This is an approximation — exact inlet geometry is not modeled. If wind direction data is ambiguous, default to the calm/neutral row for direction-dependent entries.

---

### 5G. Moon Phase Scoring

**Max points by water type: Freshwater = 4 pts | Saltwater = 10 pts | Brackish = 7 pts**

Moon phase has fundamentally different levels of importance depending on water type. In saltwater, the moon directly controls tidal amplitude — new and full moons produce spring tides with the strongest tidal range and current, which is the most productive inshore fishing period of the month. Quarter moons produce neap tides with minimal tidal range and often poor inshore conditions. This is a structural biological forcing variable in saltwater, not a secondary influence. In freshwater, tidal amplitude is irrelevant and moon phase acts only as a soft solunar intensity modifier and nocturnal light influence — genuinely secondary. Brackish is intermediate.

| Moon Phase | % of Max | Saltwater Explanation | Freshwater Explanation |
|---|---|---|---|
| New Moon | 90–100% | Spring tide — maximum tidal range and current. Strongest inshore feeding conditions of the lunar cycle. Full darkness intensifies nocturnal feeding. | Strongest solunar periods of the month. Full darkness increases nocturnal feeding activity. |
| Full Moon | 90–100% | Spring tide equivalent to new moon. Moonlit nights can trigger surface feeding binges in salt. Strongest tidal range. | Moonlit nights trigger feeding activity. Spawn trigger for many species. Strong solunar periods. |
| Waxing/Waning Gibbous | 60–79% | Above-average tidal range. Strong current. Good inshore fishing conditions. | Strong but not peak solunar intensity. Good fishing periods. |
| First Quarter / Third Quarter | 30–49% | Neap tide — minimal tidal range and current. Weakest inshore conditions of the lunar cycle. Fish activity reduced significantly in tidal environments. | Moderate solunar influence. Fishing is consistent but not peak. |
| Waxing/Waning Crescent | 10–29% | Near-neap tidal conditions. Weak current. Least productive inshore period. | Weakest solunar intensity. Minimum nocturnal influence. |

**Implementation:** `moon_score = (percentage × water_type_max) / 100`, rounded to nearest integer.

---

### 5H. Precipitation Scoring

**Max points by water type: Freshwater = 2 pts | Saltwater = 3 pts | Brackish = 3 pts**

Precipitation affects the three water types very differently. In freshwater, light rain is beneficial — it washes insects into the water, reduces surface clarity, and lowers fish wariness — but the overall weight is small because most rain events have limited impact on large enclosed water bodies. In open saltwater, rain is nearly irrelevant to fish behavior — fish don't care about what's happening above the waterline in most scenarios. In brackish estuaries, heavy rain is the most dangerous precipitation scenario: sustained heavy freshwater influx from watershed runoff rapidly drops salinity, causing species like redfish, speckled trout, and flounder to vacate normal structure entirely. This triggers a specific Salinity Disruption Alert.

#### Freshwater Precipitation (max 2 pts)

| Condition | Points | Explanation |
|---|---|---|
| No precipitation, stable | 1 pt | Neutral baseline. |
| Light rain (< 0.1 in/hr) | 2 pts | Reduces surface visibility, washes terrestrial insects into water, oxygenates surface. Beneficial. |
| Moderate rain (0.1–0.3 in/hr) | 1 pt | Runoff beginning to affect clarity on smaller waterways. Neutral to slight negative. |
| Heavy rain (> 0.3 in/hr) | 0 pts | Significant runoff degrades water clarity. Presentation control difficult. |
| Post-rain, clearing (within 6 hours) | 1 pt | Fish returning to feeding zones. Oxygen elevated. |
| Post-heavy-rain (> 2 inches in past 48 hrs) | 0 pts | Water clarity still affected. Fish displaced from normal structure. |

#### Saltwater Precipitation (max 3 pts)

| Condition | Points | Explanation |
|---|---|---|
| No precipitation | 2 pts | Neutral-positive baseline. Open saltwater is unaffected by rain and conditions are stable. |
| Any rain (light through heavy, current) | 2 pts | Open saltwater fish are nearly unaffected by rain events. Surface disturbance is minimal. |
| Post-major-storm (> 4 inches in past 48 hrs) | 1 pt | Storm surge and turbidity from runoff can affect inshore near river mouths. Offshore unaffected. |
| Extreme storm surge event | 0 pts | Exceptional scenario only. Conditions degraded until water clarity recovers. |

#### Brackish Precipitation (max 3 pts)

| Condition | Points | Explanation |
|---|---|---|
| No precipitation, stable | 2 pts | Stable salinity. Estuary conditions normal. |
| Light rain (< 0.1 in/hr) | 2 pts | Minimal salinity disruption. Fish unaffected. |
| Moderate rain (0.1–0.3 in/hr) | 1 pt | Minor salinity reduction beginning. Fish may begin to reposition. |
| Heavy rain (> 0.3 in/hr, current) | 0 pts | **SALINITY DISRUPTION ALERT triggered** — see below. |
| Post-heavy-rain (> 2 inches in past 48 hrs) | 0 pts | **SALINITY DISRUPTION ALERT triggered** — see below. |
| Post-light-rain, clearing | 2 pts | Salinity normalizing. Fish returning to structure. |

**Salinity Disruption Alert (Brackish only):** Triggered when `precip_48hr_inches > 2.0` at a brackish location. When triggered, override the precipitation section score to 0 pts and inject the following alert into the output:

> *"Heavy freshwater influx has likely disrupted estuarine salinity. Species such as redfish, speckled trout, and flounder may have vacated normal structure and relocated to higher-salinity areas near inlets and passes. Conditions will remain degraded until salinity stabilizes — typically 2–5 days post-event depending on watershed size and tidal flushing."*

---

### 5I. Raw Score Interpretation

The score thresholds and display labels below apply universally across all three water types. The weights that produced the score differ by water type (see 5A), but the interpretation of the resulting 0–100 score is identical — a 74 in freshwater and a 74 in saltwater both read as "Good" and carry the same biological meaning relative to their respective environments.

| Raw Score | Overall Rating | Display Label |
|---|---|---|
| 88–100 | Exceptional | "Exceptional — Get on the water now" |
| 72–87 | Excellent | "Excellent — Strong feeding conditions" |
| 55–71 | Good | "Good — Solid fishing conditions" |
| 38–54 | Fair | "Fair — Fish but adjust your approach" |
| 20–37 | Poor | "Poor — Difficult conditions, fish selectively" |
| 0–19 | Tough | "Tough — Post-front shutdown, conditions unfavorable" |

---

### 5J. Water Temperature Absolute Zone Scoring (NEW)

**Max points by water type: Freshwater = 12 pts | Saltwater = 10 pts | Brackish = 12 pts**

Water temperature determines whether fish are metabolically capable of feeding at all. Without it, a "Good" score in February in Minnesota and a "Good" score in July in Florida are indistinguishable — but these represent completely different biological realities. This section introduces the absolute zone score and drives the coupled modifier in Section 5E.

#### Data Source Routing

| Water Type | Source | Method | Display Label |
|---|---|---|---|
| **Saltwater** | NOAA CO-OPS tide station `water_temperature` field | Same API call already made for tides — parse the extra field. If unavailable, fall back to NOAA NDBC buoy or Open-Meteo marine SST. | `68°F 📡 NOAA measured` |
| **Brackish** | NOAA CO-OPS tide station `water_temperature` field (nearest estuarine station) | Same as saltwater. If no station returns water temp, use Open-Meteo marine SST for the nearest coastal cell. | `62°F 📡 NOAA measured` or `est. 60°F` |
| **Freshwater** | Inferred — AI-enhanced thermal lag formula | No direct measurement available. Computed from 7-day air temp history + seasonal baseline. **Always labeled as estimated.** | `est. 61°F 🧠 Inferred` |

#### Freshwater Thermal Lag Formula (AI-Enhanced Inference)

Freshwater surface temperature is estimated using a three-layer model, executed in order:

**Layer 1 — Weighted rolling air temp average (primary estimate):**
```
Water_Temp_Est = (
  air_temp_today        × 0.30 +
  air_temp_yesterday    × 0.25 +
  air_temp_2days_ago    × 0.20 +
  air_temp_3days_ago    × 0.12 +
  air_temp_4days_ago    × 0.07 +
  air_temp_5days_ago    × 0.04 +
  air_temp_6days_ago    × 0.02
)
```
Weights sum to 1.0. Uses daily average air temp (mean of high and low). Recent days weighted more heavily because surface water responds to recent conditions more than older ones.

**Layer 2 — Seasonal baseline correction:**
A regression offset is applied based on `lat` and `day_of_year` using NOAA climatological normals:
- Southern US (lat < 33°): water lags air by ~2–4°F on average
- Mid-latitude (33–40°): water lags air by ~4–6°F on average
- Northern US (lat > 40°): water lags air by ~5–8°F in spring/fall; ice-over possible below 32°F air for 5+ days

**Layer 3 — Confidence assessment:**
- `"high"`: 7 full days of air temp history available, no major gaps
- `"medium"`: 4–6 days available, or recent extreme weather event
- `"low"`: fewer than 4 days of history, or first session with no historical data loaded

**Output fields added to AI payload:**
```json
"water_temp": {
  "freshwater_estimated_f": 61,
  "freshwater_source": "thermal_lag",
  "freshwater_confidence": "medium",
  "saltwater_measured_f": 68,
  "saltwater_source": "noaa_coops",
  "zone_freshwater": "transitional",
  "zone_saltwater": "active"
}
```

#### Absolute Zone Scoring Table

Score is based on which thermal zone the water temperature falls in. Zones are defined separately per water type because metabolic thresholds differ between freshwater and marine species populations.

| Zone | Freshwater Temp | Saltwater Temp | Brackish Temp | Points (% of max) | Biological State |
|---|---|---|---|---|---|
| Near-shutdown (cold) | < 36°F | < 50°F | < 48°F | 0–17% (0–2 pts) | Metabolism near zero. Fish barely move. Finesse only — if at all. |
| Lethargic | 36–48°F | 50–60°F | 48–58°F | 25–42% (3–5 pts) | Very slow metabolism. Only the most patient slow presentations work. |
| Transitional | 48–58°F | 60–68°F | 58–66°F | 50–67% (6–8 pts) | Metabolism building. Fish catchable with effort and correct approach. |
| Active / Prime | 58–72°F | 68–80°F | 66–78°F | 75–92% (9–11 pts) | Optimal metabolic range for most temperate species. Fish feeding with intent. |
| Peak Aggression | 72–82°F | 80–88°F | 78–86°F | 83–100% (10–12 pts) | Surface feeding, aggressive strikes, full water column activity. Best overall metabolic state. |
| Thermal Stress (heat) | > 82°F | > 88°F | > 86°F | 17–42% (2–5 pts) | Dissolved oxygen dropping. Fish retreating to depth, shade, thermoclines, or strong current. Feeding suppressed. |

#### Cold Stun Alert (Saltwater and Brackish Only)

Triggered when ALL of the following are true:
- Water type is `saltwater` or `brackish`
- Measured water temp falls below **52°F (saltwater)** or **50°F (brackish)**
- Water temp has dropped **> 8°F in the past 72 hours**

When triggered:
- Override 5J score to **0 pts** regardless of zone table
- Override 5E trend score to **0 pts**
- Inject the following alert into the output at the highest prominence level:

> *"COLD STUN ALERT: Water temperature has dropped rapidly into the danger zone for shallow coastal species. Fish such as snook, tarpon, and redfish may be experiencing cold stun — a documented physiological state where fish become partially or fully catatonic and unable to feed or swim effectively. Do not expect normal feeding behavior. If fish are located, they will be holding in the warmest available water (deep channels, dark-bottom flats, near warm water discharge). This is not a fishing shutdown — it is a species welfare concern. Handle any fish with extreme care; they may not survive release in this condition."*

#### Water Temperature Card — Current Conditions Page

The water temperature card appears on the Current Conditions Page automatically, populated from the `get-environment` Edge Function on every load — it does not require report generation. It appears regardless of water type.

**Inland users (freshwater only):**
```
┌─────────────────────────────────────────────────────┐
│  Water Temperature                                   │
│  ──────────────────────────────────────────────────  │
│  est. 61°F   🧠 Inferred                            │
│                                                      │
│  Zone: Transitional  ●●●○○                          │
│  3-day air trend: Warming +3.2°F                     │
│  Confidence: Medium                                  │
│                                                      │
│  ⓘ Freshwater temperature is estimated using an     │
│  AI-enhanced model combining recent air temperature  │
│  history, your location, and seasonal norms.        │
│  Actual temp may vary by water body size and depth. │
└─────────────────────────────────────────────────────┘
```

**Coastal users (within 50 miles — shows both readings):**
```
┌─────────────────────────────────────────────────────┐
│  Water Temperature                                   │
│  ──────────────────────────────────────────────────  │
│  Salt / Brackish   68°F   📡 NOAA measured          │
│  Freshwater        est. 61°F   🧠 Inferred          │
│                                                      │
│  Salt zone:    Active / Prime  ●●●●○                 │
│  Fresh zone:   Transitional    ●●●○○                 │
│  3-day trend:  Warming +3.2°F                        │
└─────────────────────────────────────────────────────┘
```

The `🧠 Inferred` label with the ⓘ tap-to-expand explanation is **mandatory** on all freshwater estimates. It must never be displayed without the inference disclosure.

## SECTION 6 — 7-DAY HISTORY & RECOVERY MODIFIER {#section-6}

The Recovery Modifier adjusts the Raw Score based on recent cold front activity. Without it, a score of 75 on Day 2 after a cold front would appear identical to a legitimate 75 on a stable weather day — but these fish behave completely differently. The modifier makes the score honest.

### 6A. Cold Front Detection Algorithm

A cold front event is defined as: a pressure drop of 4+ mb over any 12-hour window within the 7-day history, followed within 24 hours by a pressure rise of 4+ mb over any 12-hour window.

```
Algorithm:
1. Fetch hourly pressure readings for past 7 days
2. Scan for any 12-hour window where pressure dropped 4+ mb
3. For each qualifying drop, check if a 4+ mb rise occurred within the next 24 hours
4. If yes: record as a cold front event, note the date
5. Identify the most recent qualifying event
6. Calculate: days_since_front = (today - front_event_date) in calendar days
7. If no qualifying event found: days_since_front = 7 (apply no modifier)
```

### 6B. Recovery Multiplier Table

| Days Since Last Cold Front | Freshwater Multiplier | Saltwater Multiplier | Brackish Multiplier |
|---|---|---|---|
| Day 0 (front passing now) | × 0.35 | × 0.55 | × 0.45 |
| Day 1 post-front | × 0.45 | × 0.65 | × 0.55 |
| Day 2 post-front | × 0.60 | × 0.78 | × 0.69 |
| Day 3 post-front | × 0.75 | × 0.88 | × 0.82 |
| Day 4 post-front | × 0.88 | × 0.95 | × 0.92 |
| Day 5 post-front | × 0.95 | × 1.00 | × 0.98 |
| Day 6+ or no recent front | × 1.00 | × 1.00 | × 1.00 |

**Brackish multiplier** is the average of the freshwater and saltwater multipliers, rounded to two decimal places. Brackish environments have tidal current influence (faster recovery than enclosed freshwater) but lower salinity and less tidal amplitude than open ocean, so recovery is intermediate.

**Why saltwater recovers faster:** Tidal current forces fish to move and feed regardless of pressure comfort. Freshwater fish in enclosed systems have no such forcing mechanism and can simply suspend and wait out the stress.

### 6C. Adjusted Score Formula

```
Adjusted Score = Raw Score × Recovery Multiplier

Example:
  Raw Score      = 78  (good current conditions — falling pressure, dawn window, overcast)
  Front detected 2 days ago, freshwater location
  Multiplier     = × 0.60
  Adjusted Score = 78 × 0.60 = 47  (FAIR)

The adjusted score is what gets displayed and passed to the AI.
Always include a note when a modifier is applied:
  "Score adjusted: cold front passed 2 days ago — fish still recovering from pressure stress."
```

### 6D. 7-Day History Variables Passed to AI

In addition to the Adjusted Score, the following historical context must be included in the AI input payload:

- `days_since_front`: integer or null (if no front detected)
- `front_severity`: "major" (>8 mb change) / "moderate" (4–8 mb change) / "none"
- `temp_trend_3day`: "rapid_warming" / "warming" / "stable" / "cooling" / "rapid_cooling"
- `temp_trend_direction`: float (°F change over 72 hours, e.g., -4.2 or +2.8)
- `precip_48hr_total`: float (inches of precipitation in past 48 hours)
- `precip_7day_total`: float (inches of precipitation in past 7 days)
- `pressure_trend`: "rapidly_falling" / "slowly_falling" / "stable" / "slowly_rising" / "rapidly_rising"
- `pressure_change_rate`: float (mb/hr, e.g., -1.8 or +0.6)

---

## SECTION 7 — TIME WINDOW ENGINE {#section-7}

The Time Window Engine calculates the best and worst fishing windows for today using a combination of light timing, solunar data, tide data, and pressure trend. It produces a ranked list of windows that appears in the output.

### 7A. Window Score Calculation

For each hour of the current day, calculate a Window Score. **Routing is water-type-aware:**

| Factor | Points Added |
|---|---|
| Within civil twilight begin to 90 min post-sunrise (dawn window) | +35 pts |
| Within 90 min pre-sunset to civil twilight end (dusk window) | +35 pts |
| Within major solunar window — **Freshwater and Brackish** | +25 pts |
| Tidal movement — first 2 hrs of incoming or outgoing tide — **Saltwater and Brackish** | +25 pts |
| Within minor solunar window — **Freshwater and Brackish** | +15 pts |
| Pressure actively falling during this hour | +15 pts |
| Cloud cover > 60% during this hour | +8 pts |
| Moon overhead or underfoot (within 30 min) | +10 pts |
| Night hours (civil dusk to civil dawn) | +5 pts base |

> **Brackish note:** For brackish locations, both the solunar row and the tidal row are included in Window Score calculation simultaneously, reflecting that fish in estuarine environments respond to both gravitational triggers.

### 7B. Window Classification

Merge contiguous high-scoring hours into windows. Classify by score:

| Score | Label |
|---|---|
| 65+ pts | PRIME |
| 45–64 pts | GOOD |
| 25–44 pts | SECONDARY |
| Below 25 | Do not display as a recommended window |

Worst times are hours with the lowest Window Scores, particularly:
- Midday + full sun + high pressure + slack tide (saltwater / brackish) / outside solunar (freshwater / brackish)

### 7C. Output Format for Time Windows

```
Best Times Today:
  [PRIME]      6:02 AM – 8:15 AM
               Civil twilight + dawn + major solunar overlapping
               → Multiple high-value factors converging

  [GOOD]       1:20 PM – 2:10 PM
               Minor solunar window
               → Single moderate factor

  [PRIME]      7:30 PM – 8:45 PM
               Dusk window + incoming tide first 2 hours (saltwater)
               → Two major factors converging

Worst Times Today:
  11:00 AM – 1:00 PM
  → Full sun midday, outside all solunar windows, slack tide approaching
  → Lowest activity window of the day
```

---

## SECTION 8 — AI PROMPT ENGINEERING SPECIFICATION {#section-8}

### 8A. AI Input Payload (Full JSON Structure)

The following JSON object is constructed by the scoring engine and passed to Claude with every analysis call. The AI does not calculate scores — it receives them as structured inputs and uses them to write the analysis.

> **Three-report architecture:** When the user is within 50 miles of the coast, three separate Claude calls are made in parallel — one per water type (`freshwater`, `saltwater`, `brackish`). Each call receives the same environmental payload but a different `water_type` value in the `location` object, which causes the scoring engine to route 5D and 7A logic differently and causes the AI to tailor its language accordingly. All three calls share one `get-environment` API call (environmental data is fetched once and reused).

```json
{
  "feature": "live_conditions_analysis",
  "water_type": "saltwater",
  "location": {
    "lat": 28.0836,
    "lon": -82.5716,
    "nearest_city": "Tampa, FL",
    "coastal": true,
    "miles_to_coast": 8.4
  },
  "current_conditions": {
    "air_temp_f": 71,
    "wind_speed_mph": 9,
    "wind_direction": "SW",
    "cloud_cover_pct": 65,
    "pressure_mb": 1008.4,
    "pressure_trend": "slowly_falling",
    "pressure_change_rate_mb_hr": -0.8,
    "precipitation_current": "none",
    "humidity_pct": 78
  },
  "historical_context": {
    "days_since_front": 6,
    "front_severity": "moderate",
    "temp_trend_3day": "stable",
    "temp_trend_direction_f": -0.4,
    "precip_48hr_inches": 0.0,
    "precip_7day_inches": 1.2
  },
  "lunar_data": {
    "moon_phase": "waxing_gibbous",
    "moon_illumination_pct": 78,
    "moonrise": "14:32",
    "moonset": "02:18",
    "major_solunar_1": { "start": "08:15", "end": "10:15" },
    "major_solunar_2": { "start": "20:30", "end": "22:30" },
    "minor_solunar_1": { "start": "02:18", "end": "03:18" },
    "minor_solunar_2": { "start": "14:32", "end": "15:32" },
    "daily_solunar_rating": 4
  },
  "tide_data": {
    "available": true,
    "current_phase": "incoming",
    "current_height_ft": 1.4,
    "hours_into_current_phase": 1.5,
    "next_high": { "time": "09:42", "height_ft": 2.8 },
    "next_low": { "time": "16:15", "height_ft": 0.3 },
    "tidal_range_ft": 2.5
  },
  "light_data": {
    "civil_twilight_begin": "06:42",
    "sunrise": "07:08",
    "sunset": "19:54",
    "civil_twilight_end": "20:20",
    "current_light_condition": "morning"
  },
  "scoring": {
    "raw_score": 74,
    "recovery_multiplier": 1.00,
    "adjusted_score": 74,
    "overall_rating": "Good",
    "score_components": {
      "pressure": 22,
      "light": 10,
      "solunar_tide": 11,
      "temp_trend": 9,
      "wind": 8,
      "moon_phase": 4,
      "precipitation": 3
    },
    "recovery_note": null
  },
  "time_windows": [
    { "label": "PRIME", "start": "06:42", "end": "08:30", "score": 70, "factors": ["dawn_window", "incoming_tide_first_2hrs"] },
    { "label": "GOOD", "start": "14:32", "end": "15:32", "score": 48, "factors": ["minor_solunar"] },
    { "label": "PRIME", "start": "19:00", "end": "20:20", "score": 67, "factors": ["dusk_window", "major_solunar_2_approaching"] },
    { "worst": true, "start": "11:30", "end": "14:00", "score": 12, "factors": ["midday_sun", "approaching_slack_tide", "outside_solunar"] }
  ],
  "current_time": "09:15",
  "analysis_date": "2026-03-11"
}
```

---

### 8B. System Prompt — Verbatim

The following system prompt must be used verbatim for every Live Conditions AI call.

---

**SYSTEM PROMPT — BEGIN**

You are a professional fishing guide and fish biologist with 30 years of experience across freshwater, saltwater, and brackish water environments in North America. You have deep expertise in fish physiology, feeding behavior, environmental triggers, and how atmospheric and aquatic conditions affect fish activity at a biological level.

You will receive a structured JSON object containing current environmental conditions, historical weather context, a pre-calculated conditions score (0–100), time windows for today, lunar data, and tide data where applicable. Your job is to produce a clear, honest, biologically grounded fishing conditions analysis.

**CRITICAL INSTRUCTIONS — READ ALL OF THESE BEFORE GENERATING OUTPUT:**

**1. Honesty over optimism.**
Do not soften bad conditions to make the user feel better. If the score is 22 and fish are in post-front shutdown, say exactly that. Anglers respect honest assessments. Vague positivity erodes trust immediately. A score of 22 should read like a 22, not a 65 with caveats.

**2. Use the pre-calculated score and components.**
The `adjusted_score` in the payload is deterministic and authoritative. Do not recalculate or contradict it. The `score_components` tell you exactly which variables are dragging the score down or pushing it up — reference them explicitly in your analysis.

**3. Explain the biology, not just the number.**
Every condition statement must connect to fish physiology or behavior. Do not say "pressure is falling so fishing should be good." Say: "Falling pressure causes slight expansion in a fish's swim bladder, creating a sensation the fish interprets as positive buoyancy — this physiological comfort state triggers pre-front feeding aggression across virtually all species." The user should learn something.

**4. The Recovery Modifier is mandatory context.**
If `days_since_front` is between 0 and 5, this must be prominently explained. A score of 65 on Day 2 post-front is very different from a score of 65 on stable weather. The fish are still recovering regardless of what current pressure readings show. Explain exactly how many days since the front and what stage of recovery the fish are in.

**5. The Rapid Cooling Feed-Up Window is time-critical.**
If `temp_trend_3day` is "rapid_cooling" (drop > 3°F in 24 hours), flag this immediately and prominently. This is one of the best fishing windows of the year and it is time-limited. Tell the user to act now. Explain that fish gorge before cold water slows their metabolism and that this window closes within hours.

**6. Do not invent species-specific advice.**
This feature is a general conditions assessment — not species-specific. Do not recommend specific lures, flies, or target species. That is the job of the Recommender feature. You may reference general categories of fish behavior (e.g., "predators will be pushing shallow," "expect fish to hold tight to structure") but never say "bass will be hitting topwater" or "use a chartreuse spinnerbait."

**7. Time windows are pre-calculated — use them exactly.**
The `time_windows` array in the payload contains the ranked windows for today. Use these exact times in the Best Times and Worst Times sections. Do not recalculate or invent new times.

**8. Water type governs your primary feeding timer and language.**
The `water_type` field in the payload tells you which report this is. Adjust your analysis accordingly:
- **"freshwater":** Solunar windows are the primary feeding timer. Tide section is not present — do not reference tides at all.
- **"saltwater":** Tide phase is the primary feeding timer. Reference solunar as secondary context only. Use coastal species language (inshore, flats, structure, current breaks, passes).
- **"brackish":** Both tide phase and solunar windows influence feeding behavior in estuarine environments. Reference both timers. Use estuarine language (creek mouths, oyster bars, grassy flats, tidal cuts). Explain that tidal influence is real but attenuated compared to open saltwater — fish respond to both gravitational triggers simultaneously.
Never confuse the timers for the wrong water type, and never say "saltwater" or reference tides when `water_type` is "freshwater."

**9. Tone: direct, confident, professional.**
Write like a seasoned guide who has spent 30 years on the water and respects the intelligence of the angler reading this. No filler phrases. No "tight lines." No generic encouragement. Every sentence earns its place by containing specific, actionable information rooted in fish biology.

**10. Output format is strict — follow it exactly.**
Produce the output in this exact order with these exact section headers:

---

**OVERALL FISHING RATING**
[Rating label]: [1–2 sentence summary explaining the rating in biological terms. Be specific about which variables are most responsible for the rating.]

---

**BEST TIMES TO FISH TODAY**
[List each PRIME and GOOD window from the payload in order. Format: Time range — Label. One sentence of reasoning for each that references the specific factors driving that window.]

---

**WORST TIMES TO FISH TODAY**
[List the worst window(s). Format: Time range — why to avoid it. One sentence connecting the poor conditions to fish behavior.]

---

**KEY FACTORS**

**Barometric Pressure:** [Current reading, trend label, and what it means for fish right now — reference swim bladder physiology. If post-front recovery is active, state the recovery day and what stage fish are in.]

**Temperature Trend:** [3-day trend direction and biological implication. If rapid cooling detected, flag urgently. If stable, explain that fish are patternable. If warming, explain increasing aggression.]

**Light Conditions:** [Current light state and what it means. Reference the upcoming dawn or dusk window if within 3 hours.]

**[Tide or Solunar]:** [If saltwater: current tide phase, direction, and biological impact. State hours until next tide change. If freshwater: current solunar status and next major window time.]

**Moon Phase:** [Phase name, illumination %, and what it means for feeding intensity and tidal range.]

**Wind:** [Speed, direction, assessment of whether it is helping or hurting. Reference surface chop and baitfish concentration if relevant.]

**Precipitation / Recent Rain:** [Current precip status. If significant rain in past 48 hours, note likely water clarity impact and fish displacement.]

---

**TIPS FOR TODAY**
[2–3 actionable, condition-specific tips. Each tip must directly reference one or more of the conditions in the payload. Tips must be general (not species-specific) but immediately usable by the angler.]

---

**SYSTEM PROMPT — END**

---

### 8C. Output Length Guidance

- Overall Fishing Rating: 2–3 sentences maximum
- Best Times: 3–5 windows listed, 1 sentence each
- Worst Times: 1–2 windows, 1 sentence each
- Key Factors: 3–5 sentences per factor
- Tips for Today: 2–3 tips, 2–3 sentences each
- Total output: target 400–600 words. Concise but complete.

---

### 8D. Example Output — Good Conditions (Saltwater, Day 6 Post-Front)

The following is an example of what correct AI output looks like for a saltwater location on Day 6 post-front recovery with good current conditions. Use this as a reference for tone, depth, and specificity.

---

**OVERALL FISHING RATING**
Good (74/100): Conditions are solidly favorable today. Slowly falling pressure is triggering pre-front feeding behavior across the water column, and with the cold front now 6 days behind us, fish have had sufficient time to fully recover their normal physiological equilibrium. The incoming tide is currently in its peak window — moving water is concentrating baitfish and positioning predators on ambush structure.

---

**BEST TIMES TO FISH TODAY**

6:42 AM – 8:30 AM — PRIME: The overlap of civil twilight, the dawn feeding window, and the first two hours of incoming tide creates a convergence of three major feeding triggers simultaneously. This is the highest-probability window of the day.

7:30 PM – 8:20 PM — PRIME: The dusk window aligns with the approach of the evening major solunar period. Low light returns predators to the edges they abandoned during midday.

2:32 PM – 3:32 PM — GOOD: The minor solunar window provides a single moderate feeding trigger. Worth being on the water but do not expect the sustained activity of the morning window.

---

**WORST TIMES TO FISH TODAY**

11:30 AM – 2:00 PM — Avoid: Full sun at peak angle combined with approaching slack tide and no solunar activity produces the lowest feeding activity window of the day. Fish will be holding deep in shade or suspended away from feeding structure.

---

**KEY FACTORS**

**Barometric Pressure:** 1008.4 mb and falling at 0.8 mb/hr. Slowly falling pressure causes gradual expansion in a fish's swim bladder, creating a physiological comfort state that triggers increased feeding aggression. This is one of the most favorable pressure states for fishing. No cold front activity has been detected in the past 7 days, so fish are not carrying any residual pressure stress from recent weather events.

**Temperature Trend:** Air temperature has been stable over the past 72 hours (change of -0.4°F). Fish are fully adjusted to current conditions and are holding predictable locations on known structure. Stable temperature means consistent, patternable fishing — no urgent feed-up window but no shutdown either.

**Light Conditions:** Currently morning light, approximately 2 hours past sunrise. The peak dawn feeding window has just closed. The next high-value light window is the dusk period beginning around 7:30 PM. If you are still on the water, work shaded structure and overhangs during the midday period.

**Tide:** Currently incoming tide, 1.5 hours into the flood phase. This is the single most productive inshore window for coastal species — rising water pushes baitfish onto flats and structure, drawing predators up from deeper holding areas. Approximately 2 hours remain before the tide peaks and feeding intensity begins to drop.

**Moon Phase:** Waxing Gibbous at 78% illumination. Above-average solunar intensity today. The evening major solunar window (8:30–10:30 PM) aligns with a near-full moon, which will produce some of the strongest nocturnal feeding of this lunar cycle.

**Wind:** SW at 9 mph. This is the ideal wind range — enough surface chop to reduce fish wariness of overhead threats without impeding presentation accuracy. SW wind will concentrate baitfish on northeast-facing banks and points.

**Recent Rain:** 1.2 inches of rain fell over the past 7 days, last significant event was 4 days ago. Water clarity has likely recovered to normal levels. No runoff concerns.

---

**TIPS FOR TODAY**

The morning tide window is closing within the next 2 hours — prioritize active fishing now rather than later. Moving water is concentrating baitfish at current breaks, points, and structure edges. Position yourself where water is forced through narrow passages or around visible structure.

When the tide slows toward slack (approximately 9:42 AM high), shift to deeper adjacent structure and slow your approach. This is not the time to cover water — it is the time to work one quality piece of structure thoroughly with a patient presentation.

The evening dusk window (7:30–8:20 PM) will be worth returning for. The combination of fading light and the approaching major solunar period will push fish back onto feeding edges. The near-full moon will also support feeding activity well into the night for anyone willing to stay late.

---

## SECTION 9 — COMPLETE OUTPUT SPECIFICATION {#section-9}

### 9A. Water Type Tab Display

The Results Page uses a tabbed layout to present water type reports. Tab visibility and pre-generation are governed by coastal proximity:

| User GPS Position | Tabs Displayed | Reports Pre-Generated |
|---|---|---|
| Inland (> 50 miles from coast) | Freshwater only | 1 Claude call |
| Coastal (≤ 50 miles from coast) | Freshwater · Saltwater · Brackish | 3 Claude calls (parallel) |

**Default tab:** Freshwater is always the default active tab on page load, regardless of location. This reflects that most fishing in the US is freshwater by volume of anglers. Users near the coast can immediately tap Saltwater or Brackish to see those pre-generated reports without any additional wait.

**Tab labels:**
- Freshwater (droplet icon)
- Saltwater (wave icon)
- Brackish (blend icon or just labeled "Brackish")

**Pre-generation timing:** All three Claude calls are made in parallel when the user taps "How's Fishing Right Now?" — a single loading state covers all three. Once all three complete, tabs are unlocked. Do not show tab-specific loading states — wait for all three before unlocking.

**Note:** Great Lakes-specific routing was later removed from the active V1 plan. This archived behavior is obsolete and no longer reflects the current source of truth.

---

### 9B. Required Output Components

The Results Page must display all of the following components. No component is optional.

| Component | Display Requirements |
|---|---|
| **Water Type Tabs** | Freshwater / Saltwater / Brackish tab bar at top of Results Page. Only Saltwater and Brackish tabs visible if coastal. Tabs are disabled (grayed out) during initial load, then unlock when all reports are ready. |
| Overall Fishing Rating | Large, prominent rating label (Exceptional / Excellent / Good / Fair / Poor / Tough) + adjusted score number + 2–3 sentence AI summary |
| Recovery Note | If `days_since_front` is 0–5, display a visible callout: "Cold front X days ago — fish recovering (Day X of 6)" |
| Rapid Cooling Alert | If `temp_trend_3day` = rapid_cooling, display prominent alert: "URGENT: Rapid temperature drop detected — active feed-up window NOW" |
| Best Times to Fish Today | Ranked list of PRIME and GOOD windows with time ranges, quality labels, and one-sentence reasoning each |
| Worst Times to Fish Today | List of low-activity windows with one-sentence explanation |
| Key Factors Breakdown | Individual condition cards for: Pressure, Temperature Trend, Light, Tide/Solunar (routed by water type), Moon Phase, Wind, Precipitation |
| Score Breakdown | Visual showing each variable's contribution to the final score (e.g., bar chart or component list) |
| Tips for Today | 2–3 actionable tips from the AI |
| Timestamp + Cache Status | "Conditions as of [time] — refreshes in [X] minutes" |

---

## SECTION 10 — CACHING, COST & IMPLEMENTATION NOTES {#section-10}

### 10A. Caching Strategy

| Data Type | Cache Duration | Rationale |
|---|---|---|
| Current weather conditions | 30 minutes | Weather changes slowly enough that 30-minute staleness is acceptable |
| 7-day historical data | 6 hours | Historical data does not change; fetching it repeatedly wastes API calls |
| Moon / solunar data | 24 hours | Solunar windows are calculated per day — refresh once daily |
| Tide data | 2 hours | Tide predictions are deterministic and change predictably |
| Conditions Score (pre-calculated) | 30 minutes | Refreshes with weather data |
| AI analysis output — Freshwater report | 45 minutes | Sufficient for most use patterns; prevents redundant AI calls on repeated taps |
| AI analysis output — Saltwater report | 45 minutes | Cached separately from Freshwater report under a distinct cache key |
| AI analysis output — Brackish report | 45 minutes | Cached separately under its own cache key |

> **Cache key structure for AI reports:** `how_fishing_report_{lat}_{lon}_{water_type}_{date}` — one key per water type per location per day. This allows each tab to independently cache and refresh without invalidating the others.

> **Dashboard widget vs. Results Page data:** The Live Conditions Widget on the dashboard reads from a 15-minute TTL `EnvironmentData` cache. When the user taps into the Current Conditions Page (expanded view), it reads that same cache — not a fresh pull. When the user taps "How's Fishing Right Now?" to generate reports, a forced fresh `get-environment` call is made first, then all three Claude calls are fired in parallel. This ensures the AI always analyzes the most current conditions.

### 10B. API Cost Summary

| API | Cost |
|---|---|
| Open-Meteo (weather + history) | Free — no API key required |
| USNO (moon phase, solunar, civil twilight) | Free |
| Sunrise-Sunset.org (civil twilight fallback) | Free |
| NOAA CO-OPS (tides, US coastal only) | Free |
| WorldTides (tides, global / international) | Paid — check current pricing at worldtides.info. Planned for post-V1 international expansion. Not implemented in V1. |
| Claude API (AI analysis) | ~$0.01–0.015 per analysis (claude-sonnet, text only). **For coastal users, 3 calls are made per "How's Fishing Right Now?" tap — budget approximately $0.03–0.045 per coastal session.** |

> **Cost control:** The 45-minute AI report cache is critical. Repeated taps within 45 minutes serve from cache — no additional Claude calls. Subscription tier gating applies per the standard usage limits in the Supabase `usage_tracking` table.

### 10C. Implementation Notes

1. **GPS-only for this feature.** Manual location entry is not supported. The analysis requires accurate coordinates for tide station lookup, solunar calculation, and sunrise/sunset times. If GPS is unavailable, display a prompt to enable location services rather than falling back to manual entry.

2. **Water type detection — archived logic:**
   - Query for the nearest NOAA tide station within 50 miles. If a station is found → location is coastal. Show all three tabs. Pre-generate all three reports.
   - If no NOAA station within 50 miles → inland freshwater. Show Freshwater tab only. Generate one report.
   - **Brackish determination within coastal:** Brackish is offered as a tab option for all coastal users (NOAA station found). True estuarine detection (GIS boundary datasets) is deferred for post-V1. For V1, let the user self-select via the Brackish tab if they know they are fishing an estuary, tidal creek, or river mouth. The tab architecture supports this without additional detection logic.

3. **Three parallel Claude calls — implementation pattern:**
   ```typescript
   // When coastal — fire all three in parallel after fresh env fetch
   const [freshwater, saltwater, brackish] = await Promise.all([
     callHowFishing(freshEnv, 'freshwater'),
     callHowFishing(freshEnv, 'saltwater'),
     callHowFishing(freshEnv, 'brackish'),
   ]);
   ```
   Each call passes the same `freshEnv` payload but a different `water_type` string. The scoring engine within the Edge Function reads `water_type` to route 5D scoring and 7A window calculation correctly.

4. **Results are not saved.** This is a conditions check, not a fishing session. Do not log to the fishing journal or activity history.

5. **This feature validates the pipeline.** Build and test this feature before the full Recommender. It confirms: (a) all environmental APIs are flowing correctly, (b) the Edge Function → Claude pipeline works end-to-end, (c) tier gating logic functions, (d) cost tracking logs correctly.

6. **The AI does not calculate the score.** The score is calculated deterministically by the Conditions Scoring Engine before the AI call is made. The AI receives the completed score as an input and uses it to write the analysis. This ensures the score is consistent, auditable, and not subject to AI interpretation variance.

7. **No species-specific output from this feature.** The AI prompt explicitly prohibits species-specific lure or tactic recommendations. That boundary must be preserved — it protects the Recommender's value and keeps this feature focused.

8. **Surfacing the Recommender.** After displaying the results, include a soft call-to-action: "Want species-specific lure recommendations for these conditions? → Open Recommender." This drives engagement to the deeper feature without cluttering the conditions output.

9. **Transparency builds trust.** The score breakdown component (showing each variable's contribution) is not optional — it is core to the product's credibility. Anglers are deeply skeptical of black-box ratings. Showing your work earns trust. A score that dropped from 80 to 48 because of the cold front recovery modifier is far more credible when the user can see exactly why.

10. **WorldTides (global tide data — post-V1):** For V1, tidal data is NOAA CO-OPS only (US coastal). International users at coastal locations will receive Freshwater-only reports if no NOAA station is found. WorldTides API (worldtides.info) is the planned integration for international tide coverage post-V1. When added, Steps 2 and 3 of the water type detection logic (10C note 2) will first check NOAA, then fall back to WorldTides for a station before defaulting to freshwater.

---

*End of Specification — All scoring weights, biological explanations, and API integrations in this document reflect validated fish physiology and field-tested fishing knowledge. Scoring weights are starting baselines to be tuned with real usage and catch feedback over time.*
