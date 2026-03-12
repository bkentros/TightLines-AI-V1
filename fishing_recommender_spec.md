# LURE & FLY RECOMMENDER
## Complete Implementation Specification
### Species-Specific Recommendation Feature Powered By The Core Intelligence Engine

---

> **Document Purpose:** This is a complete, unambiguous implementation specification for the AI-powered Lure / Fly Recommender feature. It covers the feature architecture, species-specific inference layers, data inputs, API requirements, depth logic, species reference tables, and prompt engineering needed to build a production-ready recommender with no follow-up required.
>
> **Scope:** Freshwater, Saltwater, and Brackish water species across North America.
> **Modes:** Conventional tackle and Fly fishing.
>
> **Source Of Truth Boundary:** General environmental intelligence, water-type routing, deterministic weighting, recovery logic, tide strength, time-window generation, alerts, broad fish-state inference, missing-data normalization, and engine data-quality metadata come from `core_intelligence_spec.md`. This file defines how the Recommender consumes that engine and layers species-specific recommendation logic on top of it.

---

## TABLE OF CONTENTS

1. [Full System Architecture](#section-1)
2. [Data Inputs & API Sources](#section-2)
3. [Core Intelligence Dependency](#section-3)
4. [Species-Specific Adjustment Layer](#section-4)
5. [Species Water Temperature Logic](#section-5)
6. [Recommendation Time Window Prioritization](#section-6)
7. [Species Behavior State Engine](#section-7)
8. [Depth Inference Engine](#section-8)
9. [AI Recommendation Layer](#section-9)
10. [Water Clarity Logic](#section-10)
11. [The Golden Window Formula](#section-11)
12. [Freshwater vs. Saltwater vs. Brackish Routing](#section-12)
13. [Edge Cases & Override Logic](#section-13)
14. [Complete Output Specification](#section-14)
15. [Implementation Notes for Engineering](#section-15)

---

## SECTION 1 — FULL SYSTEM ARCHITECTURE {#section-1}

The recommender processes inputs through 9 sequential stages. Each stage feeds the next. No stage is optional.

```
STAGE 1:  Location Sync
          └─> Auto-populate: pressure, wind, cloud, precip, sunrise/sunset,
              moon phase, solunar times, tide data, 7-day weather history

STAGE 2:  User Confirms: species, body of water, water type,
          clarity, structure, water temp (freshwater)

STAGE 3:  Core Intelligence Engine  →  Baseline environmental truth
          └─> Raw Score / Adjusted Score / Alerts / Windows /
              Metabolic State / Aggression State / Positioning Bias

STAGE 4:  Species-Specific Adjustment Layer
          └─> Target species temperature fit / lifecycle fit /
              body-of-water fit / nocturnal bias / clarity relevance

STAGE 5:  Recommendation Time Window Prioritization
          └─> Re-rank engine windows for the selected species

STAGE 6:  Species Behavior State    →  e.g. PRE-SPAWN / SUMMER PATTERN

STAGE 7:  Depth Inference Engine    →  Depth range + zone description

STAGE 8:  Mode Router               →  Conventional or Fly output path

STAGE 9:  AI Recommendation Layer   →  Lures/flies ranked 1–5
          + Confidence Indicator       with How / Where / Why
```

---

## SECTION 2 — DATA INPUTS & API SOURCES {#section-2}

### 2A. Auto-Populated Inputs (via Location Sync)

All of the following variables must be fetched automatically when the user syncs their location. The user should never be asked for these manually unless an API call fails.

| Variable | API Source | Notes |
|---|---|---|
| Air Temperature (°F) | Open-Meteo | Current reading |
| Wind Speed (mph) | Open-Meteo | Current reading |
| Wind Direction | Open-Meteo | Cardinal + degrees |
| Cloud Cover (%) | Open-Meteo | 0–100% |
| Precipitation (type + intensity) | Open-Meteo | Current + historical totals |
| Barometric Pressure (mb or inHg) | Open-Meteo | Current reading |
| Pressure trend (rising/falling/stable) | Calculated from API | Compare readings over 3hrs |
| Sunrise / Sunset / Civil Twilight | Open-Meteo + Sunrise-Sunset fallback | Exact times for location |
| Moon Phase | USNO / equivalent astronomy source | 0–1 illumination + phase name |
| Moon Rise / Set Times | USNO / equivalent astronomy source | For nocturnal feeding |
| Solunar Major Windows | Computed from moon transit data | Two ~2hr windows per day |
| Solunar Minor Windows | Computed from moon rise/set | Two ~1hr windows per day |
| Tide Phase + Height | NOAA CO-OPS / WorldTides fallback later | Saltwater/brackish only |
| Tide Direction (incoming/outgoing) | Calculated from tide predictions | Derived from adjacent extremes |
| Next High / Low Tide Times | NOAA CO-OPS | Saltwater/brackish only |
| Tide Strength | Derived from 30-day local tide range baseline | Saltwater/brackish only |
| Sea Surface Water Temp | NOAA CO-OPS / buoy / marine SST fallback | Saltwater/coastal only |
| 7-Day Pressure History | Open-Meteo historical endpoint | Hourly readings |
| 7-Day Temp History | Open-Meteo historical endpoint | Hourly + daily high/low |
| 7-Day Precipitation History | Open-Meteo historical endpoint | Daily totals |

### 2A.1 Core Engine Inputs Consumed By Recommender

The recommender must consume these deterministic outputs from `core_intelligence_spec.md` rather than recalculating them:

- `raw_score`
- `adjusted_score`
- `overall_rating`
- `score component breakdown`
- `component_status`
- `coverage_pct`
- `reliability_tier`
- `missing_variables`
- `fallback_variables`
- `recovery_multiplier`
- `water_temp_zone`
- `pressure_state`
- `light_condition`
- `solunar_state`
- `tide_phase_state`
- `tide_strength_state`
- `metabolic_state`
- `aggression_state`
- `positioning_bias`
- `time_windows`
- `cold_stun_alert`
- `salinity_disruption_alert`

### 2B. User-Confirmed Inputs (Manual Entry Required)

| Variable | Why It Cannot Be Auto-Populated |
|---|---|
| Target Species | Personal choice — angler decides |
| Body of Water | Required for tidal station lookup and species routing |
| Water Type (fresh / salt / brackish) | Determines entire logic routing path |
| Water Clarity (clear / stained / muddy) | No reliable API exists for inland waters |
| Bottom / Structure Type | Local knowledge only |
| Water Temperature (freshwater) | Not available via API for most lakes and rivers |
| Spot Description (optional) | Hyperlocal — AI uses this for contextual lure notes |

### 2C. Variables That Cannot Be Automated

These are real factors that affect fish behavior but cannot be reliably sourced for all locations. The AI must not attempt to infer or fabricate them. If a user provides them manually, they must be used.

- **Thermocline depth** — measurable only with a fish finder or temperature probe
- **Fishing pressure** — no API; crowd-sourced data takes years to build
- **Local hatch activity (fly fishing)** — hyper-local, unmeasurable remotely
- **Baitfish presence** — no reliable API; infer from season + water temp

---

## SECTION 3 — CORE INTELLIGENCE DEPENDENCY {#section-3}

The Recommender does **not** own the general environmental scoring engine anymore.

It must consume the deterministic outputs from `core_intelligence_spec.md` first, then layer species-specific logic on top.

### 3A. Required Engine Inputs

The Recommender must receive, at minimum:

- `raw_score`
- `adjusted_score`
- `overall_rating`
- `component score breakdown`
- `component_status`
- `coverage_pct`
- `reliability_tier`
- `data_quality`
- `pressure_state`
- `water_temp_zone`
- `temp_trend_state`
- `light_condition`
- `solunar_state`
- `tide_phase_state`
- `tide_strength_state`
- `recovery_multiplier`
- `metabolic_state`
- `aggression_state`
- `positioning_bias`
- `time_windows`
- `cold_stun_alert`
- `salinity_disruption_alert`

### 3B. Why This Matters

The shared core engine already models:

- freshwater vs saltwater vs brackish environmental biology
- front recovery
- tide strength
- current fish activity level
- dominant feeding timers
- broad fish positioning bias

The Recommender must not rebuild any of those systems independently. Duplicating that logic would create conflicting truths across the app.

### 3C. Recommender Baseline Score

The Recommender's baseline activity score is:

```text
recommender_base_score = core_engine.adjusted_score
```

This is the environmental baseline for all later species-specific recommendation logic.

### 3D. Partial-Data Inheritance Rules

The Recommender must inherit the core engine's missing-data handling rather than replacing it with its own hidden assumptions.

Rules:

1. If the core engine returns `reliability_tier = high` or `degraded`, the Recommender may run normally.
2. If the core engine returns `reliability_tier = low_confidence`, the Recommender may still run, but must reduce presentation certainty and show a visible caution note.
3. If the core engine returns `reliability_tier = very_low_confidence`, the Recommender may still run only if species, water type, and at least one valid engine time window are available; otherwise return a structured feature error instead of bluffing.
4. The Recommender must never rebuild a missing environmental variable from the LLM.
5. Missing engine variables must remain explicit in the final output.

---

## SECTION 4 — SPECIES-SPECIFIC ADJUSTMENT LAYER {#section-4}

After consuming the core engine, the Recommender must apply species-specific adjustments. These do not replace the environmental engine. They interpret how favorable those conditions are for the **selected species**.

### 4A. Adjustment Inputs

Required species-specific inputs:

- selected species
- water type
- body of water type
- water clarity
- user-entered freshwater temperature when available
- structure / bottom type
- current date
- latitude band

### 4B. Species Temperature Fit Modifier

The most important Recommender-specific adjustment is target-species temperature fit.

Use the selected species' optimal feeding range from Section 7B.

```text
species_temp_delta_f = distance between current_water_temp_f and nearest edge of species optimal range
```

Apply:

| Species Temp Fit | Modifier |
|---|---:|
| inside optimal range | +8 |
| within 5°F outside optimal | +4 |
| within 10°F outside optimal | 0 |
| within 15°F outside optimal | -8 |
| 20°F+ outside optimal | -15 |

### 4C. Lifecycle Fit Modifier

Once `species_behavior_state` is determined, apply:

| Species Behavior State | Modifier |
|---|---:|
| PRE-SPAWN STAGING | +6 |
| FALL FEED-UP | +6 |
| SUMMER PATTERN | +2 |
| TRANSITIONAL | +1 |
| SPAWNING | -6 |
| POST-SPAWN RECOVERY | -10 |
| WINTER LETHARGIC | -12 |

### 4D. Final Recommender Score

```text
recommender_adjusted_score = clamp(
  recommender_base_score + species_temp_fit_modifier + lifecycle_fit_modifier,
  0,
  100
)
```

This score is used only for presentation pacing, lure aggressiveness, and recommendation confidence inside the Recommender. It does not replace the core engine's environmental score elsewhere in the app.

---

## SECTION 5 — SPECIES WATER TEMPERATURE LOGIC {#section-5}

The Recommender inherits the environmental temperature logic from `core_intelligence_spec.md`, but it must also evaluate current water temperature against the target species' biological range.

### 5A. Water Temperature Source Priority

Use in this order:

1. user-entered freshwater water temperature
2. core engine measured saltwater/brackish water temperature
3. core engine inferred freshwater water temperature
4. `null`

Rules:

- if multiple temperature candidates exist, the higher-priority source always wins
- the final payload must carry `water_temp_source`
- if the final selected temperature is `null`, the Recommender must skip species temperature-fit math, skip any temperature-dependent depth precision, and degrade confidence accordingly
- the Recommender must never fabricate a replacement water temperature

### 5B. Species Temperature Interpretation

The same environmental water temperature may mean very different things by species.

Example:

- `62°F` for Largemouth Bass can be highly favorable pre-spawn
- `62°F` for Snook is severe thermal suppression
- `62°F` for Brown Trout may be near the upper end of comfort

The Recommender must therefore use the target species table in Section 7B for:

- final activity pacing
- presentation aggressiveness
- depth adjustment
- lure/fly profile size
- confidence level

### 5C. Rapid Cooling Recommendation Rule

If the core engine reports `rapid_cooling`:

- and the species temperature fit is still favorable, increase reaction-bait / aggressive-presentation preference
- and the landing zone is cold-suppressed for the selected species, suppress feed-up language and shift toward slowdown logic

### 5D. Heat And Cold Override

If the selected species is more than `20°F` outside its optimal range, cap the final `recommender_adjusted_score`:

- `30` for cold extreme
- `40` for heat extreme during daytime

This cap is species-specific and is applied after the modifier formula in Section 4D.

---

## SECTION 6 — RECOMMENDATION TIME WINDOW PRIORITIZATION {#section-6}

The Recommender must use the core engine's `time_windows` as its baseline. It may re-rank emphasis for the selected species, but it must not invent new windows that contradict the engine.

### 6A. Baseline Rule

```text
recommendation_windows = core_engine.time_windows
```

### 6B. Species-Specific Window Biases

Apply the following emphasis modifiers to the engine windows:

| Condition | Window Priority Adjustment |
|---|---:|
| nocturnal species and window is night or dusk-adjacent | +10 |
| species behavior state is PRE-SPAWN and window aligns with warming afternoon trend | +6 |
| species behavior state is WINTER_LETHARGIC and window is midday warming period | +6 |
| species behavior state is SUMMER_PATTERN and window is bright midday full sun | -10 |
| selected species is tide-driven in coastal system and window aligns with strong moving tide | +10 |
| selected species is visually oriented in clear water and window is low light | +6 |

### 6C. Species With Strong Night Bias

Night bias should be considered for:

- Brown Trout
- Walleye
- Catfish
- Snook
- Tarpon
- Striped Bass

### 6D. Output Rule

The Recommender may sort and describe windows differently for the selected species, but every displayed window must originate from the core engine output.

---

## SECTION 7 — SPECIES BEHAVIOR STATE ENGINE {#section-7}

The Species Behavior State classifies what the fish is doing right now in its biological lifecycle. This is critical because the same lure that catches fish in pre-spawn will fail completely during post-spawn recovery. The AI must know the state to give valid recommendations.

### 7A. State Classification Logic

Determine state using: current water temperature + calendar date + latitude zone (Northern / Southern US) + moon phase (for spawn trigger species).

| State | Behavioral Description + Implication |
|---|---|
| PRE-SPAWN STAGING | Fish are fattening up aggressively before spawn. Most willing to eat large profile baits. Moving from deep wintering areas to shallower structure. Best time of year to catch large fish. Use larger presentations, cover water. |
| SPAWNING | Fish are on beds or spawning aggregations. They are NOT actively feeding — they strike to protect territory. Sight-fishing with reaction-based presentations. Do not use feeding behavior logic — use annoyance/aggression logic. |
| POST-SPAWN RECOVERY | Fish are exhausted and staged deep near spawning areas. They feed sporadically and very slowly. Ultra-finesse presentations. Smallest profiles. Longest pauses. This is the hardest period to fish. |
| SUMMER PATTERN | Fish have settled into seasonal structure. Feed heavily in low-light windows only (dawn/dusk). Deep during midday. Thermocline positioning if lake is stratified. Match the hatch — forage-matching lures outperform attractor lures. |
| FALL FEED-UP | Water cooling, fish instinctively gorge before winter. Aggressive, chasing shad schools, opportunistic. Topwater and swimbaits during shad kills. One of the best fishing periods of the year. |
| WINTER LETHARGIC | Metabolism near-shutdown. Fish stacked in deepest available water with stable temperature. Will not chase — presentation must be placed directly in front of them and moved extremely slowly. Jigging or deadstick only. |
| TRANSITIONAL (Spring Warming) | Ice-out through pre-spawn. Fish moving from winter areas. Following warm water. Unpredictable positioning but increasingly aggressive. Fan-cast to find them. |

### 7B. Species-Specific Biological Reference Table

Use this table to score water temperature (Section 3C) and determine species behavior state (Section 7A). Spawn temps are the primary trigger — water must reach this temp for spawn behavior to begin.

| Species | Optimal Feeding (°F) | Spawn Trigger (°F) | Stress Threshold (°F) | Notes |
|---|---|---|---|---|
| Largemouth Bass | 65–75°F | 63–68°F (spring) | < 50°F or > 88°F | Spawn on beds in shallows; bed-guarding male strikes only |
| Smallmouth Bass | 60–70°F | 60–65°F (spring) | < 48°F or > 85°F | Prefer rocky structure; more pressure-sensitive than largemouth |
| Spotted Bass | 62–72°F | 60–65°F (spring) | < 50°F or > 86°F | Similar to smallmouth; prefer current and deeper rocky areas |
| Striped Bass (freshwater) | 55–68°F | 55–65°F (spring, rivers) | < 40°F or > 75°F | Anadromous; follow shad schools; crash baitfish at surface |
| Walleye | 55–68°F | 42–50°F (very early spring) | < 38°F or > 76°F | Spawn earliest of all freshwater gamefish; light-sensitive, low-light feeding |
| Northern Pike | 55–65°F | 40–50°F (ice-out) | < 38°F or > 78°F | Ambush predator; feed aggressively post ice-out before bass are active |
| Musky | 60–70°F | 55–60°F (spring) | < 45°F or > 80°F | Apex predator; follow/learn pattern; brief feeding windows |
| Yellow Perch | 58–68°F | 44–54°F (early spring) | < 40°F or > 78°F | School fish; follow schools vertically throughout water column |
| Crappie | 60–70°F | 62–68°F (spring) | < 48°F or > 82°F | Spawn in shallows around brush; easiest to target during spawn |
| Bluegill / Panfish | 65–78°F | 68–75°F (late spring) | < 50°F or > 88°F | Sunfish family; bed aggressively; excellent fly rod targets on beds |
| Trout (Rainbow) | 52–62°F | 40–50°F (fall/winter) | < 38°F or > 68°F | Cold-water species; spawn fall/winter; dry fly feeding in optimal range |
| Trout (Brown) | 50–65°F | 42–52°F (fall) | < 35°F or > 70°F | Nocturnal feeders; largest fish caught at night on big streamers |
| Trout (Brook) | 48–60°F | 40–50°F (fall) | < 35°F or > 65°F | Most temperature-sensitive trout; cold headwater specialist |
| Catfish (Channel) | 70–85°F | 70–75°F (late spring) | < 50°F or > 90°F | Opportunistic; scent-based; feed heavily in warm turbid water post-rain |
| Redfish (Red Drum) | 70–85°F | Fall cooling to low 70s | < 55°F or > 92°F | Tailing on flats at high tide; ambush in current on outgoing; spawn offshore |
| Speckled Trout (Spotted) | 65–80°F | 68–72°F (spring + fall) | < 50°F or > 88°F | Cold-kills — extreme cold causes mass die-offs; seek warmest water in winter |
| Snook | 72–86°F | 80–86°F (summer) | < 60°F or > 90°F | Cold-sensitive; migrate to warm springs/canals in winter; spawn on full/new moon |
| Tarpon | 75–87°F | Offshore; temp + lunar triggered | < 68°F or > 92°F | Migratory; peak season spring/summer; sight-fishing; rolling fish = active |
| Flounder | 60–75°F | Fall migration, offshore | < 48°F or > 82°F | Ambush from flat position; key edges and current breaks |
| Striped Bass (coastal) | 55–68°F | 55–65°F (spring rivers) | < 40°F or > 76°F | Schooling; follow bunker/menhaden; crash bait schools at surface |
| Bluefish | 62–72°F | Offshore, temp triggered | < 50°F or > 82°F | Aggressive schooling; choppy conditions don't deter feeding |
| Permit | 72–84°F | Offshore, lunar triggered | < 64°F or > 88°F | Hardest inshore fly target; crab patterns only; extremely spooky |
| Bonefish | 74–86°F | Offshore, lunar triggered | < 65°F or > 90°F | Tailing fish on flats; extremely spooky; shrimp and crab patterns only |

---

## SECTION 8 — DEPTH INFERENCE ENGINE {#section-8}

Depth cannot be retrieved from any API. It must be inferred from the combination of water temperature, season, time of day, pressure state, and species behavior state. The engine produces a depth range and zone description, not a single number.

### 8A. Baseline Depth by Season + Water Temp

| Condition | Baseline Depth Range | Zone Description |
|---|---|---|
| Ice-out / Early spring warming (38–52°F) | 1–8 ft | Shallowest warmest water first — dark bottom flats, sun-warmed bays, black rock |
| Pre-spawn staging (52–63°F, bass example) | 4–12 ft | Transitional structure — points, channel swings, secondary points off main lake |
| Spawn (species-specific temp reached) | 0–4 ft | Visible shallow structure — gravel, sand, laydowns, dock pilings, grass edges |
| Post-spawn recovery | 8–18 ft | Deep adjacent structure off spawning flats — first available break |
| Early summer (post-spawn, stable temps) | 8–15 ft | Main lake points, humps, channel edges |
| Peak summer (optimal temp or above) | Varies | Follows baitfish and thermocline. 2–5 ft at dawn/dusk, 15–30 ft midday |
| Fall cooling begins (temp dropping from peak) | Variable — tracking baitfish | Follows shad schools — could be anywhere from surface to 20 ft |
| Late fall / hard cooling | 10–20 ft | Baitfish staging on main lake points and bluff walls |
| Winter (below 50°F freshwater) | 20–40 ft | Deepest warmest stable water — reservoir creek channels, deep main lake |

### 8B. Pressure Modifier on Depth

| Pressure State | Depth Adjustment |
|---|---|
| Rapidly falling pressure | Fish shallower than seasonal baseline by 2–5 ft. Pre-front surge pushes fish up. |
| Stable low pressure | At or near seasonal baseline depth. |
| Stable high pressure | At or slightly deeper than seasonal baseline. |
| Rapidly rising post-front | Push 5–10 ft deeper than seasonal baseline. Fish suspend mid-column or hold deep structure tight. |

### 8C. Time of Day Modifier on Depth

| Time of Day | Depth Adjustment |
|---|---|
| Dawn (first light to 2 hrs post-sunrise) | Shallower than baseline by 2–4 ft regardless of season |
| Morning (2–5 hrs post-sunrise) | At baseline |
| Midday (5 hrs post-sunrise to 3 hrs pre-sunset) | Deeper than baseline by 3–8 ft in bright conditions; at baseline if overcast |
| Evening (3 hrs pre-sunset to sunset) | Returning toward baseline and shallower |
| Dusk (last 90 min of light) | Shallower than baseline by 2–4 ft |
| Night | Species-dependent. Bass: 0–5 ft near lights/docks. Walleye: very shallow flats. Catfish: shallow and moving. |

### 8D. Depth Inference Output Format

Output must always be a range with structure context, never a single number:

```
"Given falling pressure, overcast skies, 68°F water temperature, and late spring
timing (pre-spawn staging), expect Largemouth Bass in the 4–10 ft range along
transitional structure. Focus on secondary points off the main lake and the
first significant drop adjacent to flat spawning areas. Dawn window may push
fish shallower — work 1–4 ft over the flats in the first 90 minutes of light."
```

---

## SECTION 9 — AI RECOMMENDATION LAYER {#section-9}

This section defines the complete prompt engineering specification for the AI that generates lure and fly recommendations. The AI receives the core engine outputs plus all species-specific inference outputs as structured input and produces ranked recommendations with full context.

### 9A. AI Input Payload (structured JSON passed to model)

```json
{
  "core_adjusted_score": 72,
  "core_raw_score": 80,
  "core_coverage_pct": 92,
  "core_reliability_tier": "high",
  "core_component_status": {},
  "core_data_quality": {
    "missing_variables": [],
    "fallback_variables": ["water_temp_f"]
  },
  "recovery_modifier": 0.90,
  "days_since_front": 4,
  "pressure_state": "slowly_rising",
  "metabolic_state": "active",
  "aggression_state": "strong_feed",
  "positioning_bias": "current_breaks_cuts_passes_flats",
  "water_temp": 68,
  "water_temp_trend": "stable",
  "water_temp_zone": "active_prime",
  "recommender_adjusted_score": 78,
  "species": ["Largemouth Bass"],
  "species_behavior_state": "PRE_SPAWN_STAGING",
  "water_type": "freshwater",
  "water_clarity": "stained",
  "body_of_water": "reservoir",
  "structure": "laydowns and grass edges",
  "depth_range": "4-10 ft",
  "depth_zone": "transitional secondary points",
  "cloud_cover": 40,
  "wind_speed": 8,
  "wind_direction": "SW",
  "time_windows": [
    { "label": "PRIME", "start": "6:10 AM", "end": "8:05 AM", "factors": ["dawn", "minor solunar"] }
  ],
  "moon_phase": "waxing_gibbous",
  "mode": "conventional",
  "spot_description": "Deep bend with fallen timber and a grass line on the far bank"
}
```

### 9B. System Prompt for AI Recommendation Model

The following system prompt must be used verbatim. It encodes fish biology, presentation logic, and output structure requirements.

---

**SYSTEM PROMPT — BEGIN**

You are a professional fishing guide and fish biologist with 30 years of experience across freshwater, saltwater, and brackish water environments in North America. You have expert knowledge of fish behavior, feeding triggers, lure presentation, and how environmental conditions affect every species.

You will receive a structured JSON object containing deterministic core-engine outputs, a calculated recommendation score, species behavior state, depth inference, and time window data. Your job is to produce ranked lure or fly recommendations that a professional guide would actually use under these exact conditions.

**RULES:**

1. Recommend exactly 5 lures or flies, ranked from most to least likely to produce.

2. Each recommendation must include:
   - Lure/fly name + size/weight/color
   - **How to Fish it** — retrieve style, cadence, pause length, sink rate
   - **Where to Fish it** — depth + structure type
   - **Why It Works** — condition-specific biological reasoning, not generic fishing tips

3. The **Why It Works** must reference the specific conditions provided (pressure state, water temp, clarity, species behavior state). Never give generic reasons.

4. Adjust presentation style based on `recommender_adjusted_score`:
   - Score 65+: Faster retrieves, larger profiles, reaction-based
   - Score 45–64: Medium pace, standard profiles, match forage
   - Score below 45: Slowest possible, smallest profile, maximum pause

5. Adjust lure color based on `water_clarity`:
   - **Clear:** Natural colors — green pumpkin, shad, smoke, olive, white
   - **Stained:** Contrast colors — chartreuse, white/chartreuse, black/blue, June bug
   - **Muddy:** Maximum visibility — bright chartreuse, solid black, fire tiger, hot orange

6. Adjust lure selection based on `species_behavior_state`:
   - **PRE_SPAWN_STAGING:** Larger profiles, reaction baits, creature baits that mimic crawfish
   - **SPAWNING:** Bed-fishing presentations only — do not suggest feeding lures
   - **POST_SPAWN_RECOVERY:** Smallest finesse only — drop shot, ned rig, small inline spinners
   - **SUMMER_PATTERN:** Match the hatch — identify primary forage (shad, crawfish, bluegill) from body_of_water + region and match it precisely
   - **FALL_FEEDUP:** Match shad schools — swimbaits, topwater, large crankbaits
   - **WINTER_LETHARGIC:** Jigs and drop shots only, ultra-slow, smallest size

7. For fly fishing mode, replace all conventional lures with appropriate fly patterns. Specify: fly pattern name, hook size, weight (bead head or not), sink rate, and strip cadence.

8. Begin the response with a one-paragraph **Situational Assessment** summarizing what the fish are doing right now biologically and why. This must be specific to the input data — never generic.

9. After the 5 recommendations, include a **Best Approach Summary** of 2–3 sentences telling the angler exactly where to start and what to do first when they arrive at the water.

10. If `core_reliability_tier` is not `high`, reduce certainty in tone appropriately. You may acknowledge reduced confidence, but you must never invent missing conditions or pretend unavailable variables were measured.

11. Never use filler phrases like "tight lines" or generic statements. Every sentence must contain actionable, condition-specific information.

**SYSTEM PROMPT — END**

---

### 9C. Lure Selection Logic by Condition Matrix

The AI uses these matrices to filter appropriate lure categories before selecting specific recommendations. This prevents illogical combinations (e.g., topwater in muddy water, crankbaits in post-spawn recovery).

#### Conventional Tackle

| Score Range | Clear Water | Stained Water | Muddy Water | Best Structure | Retrieve |
|---|---|---|---|---|---|
| 85–100 (Exceptional) | Topwater, jerkbait, swimbait | Chatterbait, spinnerbait, lipless crank | Spinnerbait, loud rattling crank | Edges, transitions, ambush points | Fast, reaction-based |
| 65–84 (Good) | Jerkbait, swimbait, crank | Swimbait, chatterbait, square bill crank | Spinnerbait, bladed jig, dark crank | Structure edges, mid-depth | Medium, varied cadence |
| 45–64 (Fair) | Ned rig, drop shot, wacky rig | Ned rig, shaky head, swimbait | Texas rig, flipping jig, bladed jig | Tight to structure | Slow, long pauses |
| 25–44 (Poor) | Drop shot, finesse ned, small spy bait | Small ned rig, finesse jig | Slow-rolled spinnerbait, finesse jig | Deep adjacent structure | Deadstick, minimal movement |
| 0–24 (Tough) | Ned rig deadstick, hair jig | Small jig, tube bait | Jig deadstick | Deepest structure | Motionless or near-motionless |

#### Fly Fishing

| Condition | Freshwater Patterns | Saltwater / Brackish Patterns |
|---|---|---|
| High activity + surface feeding | Dry flies (elk hair caddis, adams, stimulator), poppers, foam beetles | Poppers, crease flies, EP baitfish on top |
| High activity + subsurface | Woolly bugger, streamer (clouser minnow), muddler minnow | Clouser minnow, deceiver, EP baitfish |
| Mid activity + matching hatch | Hare's ear nymph, pheasant tail, bead head prince nymph | Crab patterns, shrimp patterns (size 2–6) |
| Low activity + finesse | Small nymphs (size 16–20), scuds, zebra midge | Small crab, merkin crab, EP shrimp size 4 |
| Spawning species (bass on beds) | Deer hair bug, large rubber-leg dragon, near-bed presentation | N/A for most saltwater spawn scenarios |
| Clear sight-fishing flats | N/A | Crab: Del Brown's Merkin (permit), EP spawning shrimp (bonefish), Wulff's red/orange crab (redfish) |
| Dirty/stained water | Woolly bugger black or olive size 4–8, rattle beads | Black/purple bunny leech, weighted chartreuse Clouser |

### 9D. Confidence Indicator

Every recommendation output must include a Confidence Indicator that tells the angler how reliable the recommendation is based on data quality.

Base the confidence indicator on the engine first, then downgrade further for missing user inputs.

| Confidence Level | Conditions — What to Display |
|---|---|
| HIGH | `core_reliability_tier = high` and all required user inputs are present. |
| MEDIUM | `core_reliability_tier = degraded`, or engine reliability is `high` but one important non-engine user input is missing such as water clarity, structure, or freshwater water temp. |
| LOW | `core_reliability_tier = low_confidence` or `very_low_confidence`, or multiple important non-engine user inputs are missing. Treat recommendations as general guidance only. |

Required explanation rules:

- if confidence is not `HIGH`, list the exact missing or fallback variables driving the downgrade
- if water temperature is inferred rather than measured or user-entered, say so explicitly
- if engine reliability is `very_low_confidence`, the UI must visually warn that recommendations are broad guidance only

---

## SECTION 10 — WATER CLARITY LOGIC {#section-10}

Water clarity is one of the most important lure selection variables but cannot be automated. It is entered by the user and must be used consistently throughout all downstream logic.

### 10A. Clarity Classification

| Clarity Level | Definition | How to Identify |
|---|---|---|
| Clear | Visibility > 3 ft. Can see bottom in 3–4 ft of water. | Clean lakes, spring-fed rivers, low-wind days |
| Stained | Visibility 1–3 ft. Slight tannin/algae color. Bottom visible in 1–2 ft. | After moderate rain, tannin-stained rivers, normal coastal bays |
| Muddy | Visibility < 1 ft. Cannot see lure 6 inches below surface. | Heavy recent rain, high wind on shallow lakes, post-flood conditions |

### 10B. Clarity × Species × Presentation Matrix

| Species Group | Clear Water Behavior | Stained / Muddy Behavior |
|---|---|---|
| Bass (largemouth / smallmouth) | Highly visual — sight-feeds, skeptical of unnatural profiles. Natural colors, precise casts, slower presentations. | Relies on lateral line — vibration and sound become primary strike triggers. Chatterbait, Colorado blade spinnerbait, rattle trap. |
| Redfish / Inshore Saltwater | Tailers visible on flats — sight-fishing with precise placement. Spooky. Long casts required. | Ambush in current and structure — cannot sight-fish. Use noise and vibration. Gold spoon, rattling cork. |
| Trout (freshwater) | Extremely selective — must match the hatch precisely. Fly fishing most effective. Tiny tippet required. | Less selective — will take larger attractor patterns. Woolly buggers and streamers outperform dry flies. |
| Walleye | Light-sensitive — feed in very low light even in clear water. Dawn/dusk and night dominant. | Feed more broadly throughout the day as light penetration drops. |
| Catfish | Scent-based — clarity has almost no effect on feeding behavior. Bait odor > visual presentation. | Slightly more active — rain runoff activates feeding instinct. Scent remains primary trigger. |

---

## SECTION 11 — THE GOLDEN WINDOW FORMULA {#section-11}

The Golden Window describes the optimal convergence of all high-impact variables. When these conditions align simultaneously, it produces the most aggressive feeding behavior observable across virtually all species. The system must detect and flag this explicitly when it occurs.

### All 6 Conditions Must Be True Simultaneously

1. **Pressure:** Falling (any rate — faster is better)
2. **Tide:** Moving (incoming or outgoing, first 2 hrs) — *saltwater only*
   **OR Solunar:** Within major solunar window — *freshwater only*
3. **Light:** Dawn or dusk window (within 90 min of sunrise or sunset)
4. **Sky:** Overcast (cloud cover > 50%)
5. **Temperature:** Within species optimal feeding range
6. **Recovery:** Day 5+ since last cold front (multiplier ≥ 0.95)

**When all 6 conditions are met:**
- Display a prominent **GOLDEN WINDOW** alert in the UI
- Expected adjusted score: 88–100
- Recommendation style: Reaction baits, larger profiles, faster retrieves
- Display message: *"Perfect storm of feeding conditions. This is a rare window — be on the water."*

---

## SECTION 12 — FRESHWATER VS. SALTWATER VS. BRACKISH ROUTING {#section-12}

The engine must route differently based on water type. This is not cosmetic — the biological drivers are fundamentally different between environments. Water type is determined by user input in Stage 2.

| Logic Component | Freshwater | Saltwater / Brackish |
|---|---|---|
| Primary feeding timer | Solunar windows (15 pts) | Tide phase (15 pts) — replaces solunar |
| Pressure recovery curve | Full penalty (×0.35–1.00) | Reduced penalty (×0.55–1.00) — tidal forcing |
| Depth inference baseline | Driven by season + water temp | Driven by tide phase + structure type |
| Spawn trigger | Water temp + calendar date | Water temp + lunar phase + offshore migration |
| Lure selection driver | Structure + forage + pressure | Tide position + current + bait presence |
| Primary forage signal | Crawfish, shad, bluegill, perch — season-dependent | Shrimp, crab, mullet, menhaden, pilchards — region-dependent |
| Cold front severity | Severe — enclosed system, no forcing | Moderate — tidal current partially overrides shutdown |
| Fly fishing primary approach | Match the hatch — entomology-driven | Match the bait — shrimp, crab, baitfish patterns |

---

## SECTION 13 — EDGE CASES & OVERRIDE LOGIC {#section-13}

### 13A. Spawning Override

When `species_behavior_state = SPAWNING`, override normal lure recommendation logic completely. Do not recommend feeding presentations. Instead:

- **Bass:** Recommend bed-fishing techniques only — slow drop on bed, creature baits, hair jigs. Frame as territory defense response, not feeding.
- **Redfish / Snook:** These species spawn offshore and cannot be targeted on spawn. Redirect to staging fish near spawn aggregation areas.
- **Trout:** Note that disturbing spawning redds (nests) is unethical and illegal in most jurisdictions. Recommend fishing staging fish below the redd.

### 13B. Extreme Temperature Override

When water temp is more than 20°F outside optimal range, override the depth inference engine:

- **Cold extreme (freshwater winter < 40°F):** Always recommend deepest available water. Always recommend slowest possible presentations. Apply a score cap of 30 regardless of other factors.
- **Heat extreme (saltwater > 90°F, freshwater > 88°F):** Fish seek thermal refuge. Recommend springs, inflows, shaded deep structure, night fishing only. Apply a score cap of 40 during midday hours.

### 13C. Post-Heavy-Rain Override

When precipitation history shows > 2 inches in the past 48 hours:

- **Freshwater:** Assume muddy water regardless of user clarity input. Apply muddy water lure logic. Note that fish may be holding at muddy/clear water interfaces — highly productive ambush zone.
- **Saltwater:** Apply reduced salinity flag for brackish and estuarine species. Note that freshwater inflows at river mouths attract feeding fish.
- **All water types:** Focus on current breaks, outflow points, and the mudline edge.

### 13D. Night Fishing Override

When current time is between civil dusk and civil dawn (full dark):

- **Depth override:** Most species move shallow at night regardless of season or pressure.
- **Color override:** Black and dark colors create the best silhouette contrast against the surface. Recommend black or dark purple as primary colors.
- **Species-specific positioning:**
  - Snook and bass: near lights and dock pilings
  - Catfish: shallow flats and points
  - Walleye: gravel flats and sandy points
  - Tarpon: bridges and passes on moving tides
- **Fly fishing at night:** Large dark streamers on sinking lines — black woolly bugger, black bunny leech. Slow strip.

---

## SECTION 14 — COMPLETE OUTPUT SPECIFICATION {#section-14}

The final output delivered to the user must contain all of the following components in the order listed. No component is optional when data is available.

| Component | Description + Format |
|---|---|
| Activity Score Display | Adjusted score (0–100) with label (Exceptional / Good / Fair / Poor / Tough). Show recovery modifier note if applied. |
| Confidence Indicator | HIGH / MEDIUM / LOW derived from `core_reliability_tier` plus missing user inputs, with brief explanation of the exact missing/fallback variables if not HIGH. |
| Golden Window Alert (if triggered) | Prominent callout when all 6 Golden Window conditions are met. |
| Today's Best Windows | Time-stamped window list with quality tier (PRIME / GOOD / SECONDARY) and contributing factors. |
| Species Behavior State | Current state label with one sentence explaining what this means for today's fishing. |
| Situational Assessment | One paragraph from the AI describing what the fish are doing right now biologically. Must be specific to input data. |
| Depth Inference | Depth range + zone description + modifiers (time of day, pressure). Presented as a natural language sentence. |
| Temperature Trend Signal | Direction + urgency label. Flag URGENT FEED-UP if rapid cooling detected. |
| Recommendations 1–5 | Each with: lure/fly name + size/weight/color, How to Fish, Where to Fish, Why It Works. |
| Best Approach Summary | 2–3 sentence closing telling the angler exactly where to start and what to do first. |

---

## SECTION 15 — IMPLEMENTATION NOTES FOR ENGINEERING {#section-15}

1. **The core intelligence engine runs BEFORE the Recommender logic begins.** The Recommender consumes `core_intelligence_spec.md` outputs — it does not rebuild the general environmental scoring system.

2. **The Recovery Modifier comes from the core engine.** The Recommender must consume it, not calculate a second separate front-recovery system.

3. **Water type (fresh / salt / brackish) must be confirmed before any scoring begins.** It changes the entire routing logic. Do not assume from location alone.

4. **Solunar windows (freshwater) and tide data (saltwater) are NOT the same thing** and must never be combined or swapped. Route explicitly based on `water_type` and the core engine outputs.

5. **The AI recommendation model receives structured JSON, not free-form text.** Parse and validate all inputs before constructing the prompt.

6. **Environmental scores come from the core engine; species-specific modifiers live here.** Keep those responsibilities separate.

7. **For fly fishing mode,** all conventional lure logic is replaced by fly pattern logic. The upstream environmental intelligence is identical — only the recommendation output path changes.

8. **Do not fabricate variables.** If water temp is unknown, leave it unknown. Do not invent a reading. Confidence must degrade according to the rules above, and in severe missing-data cases the feature may need to return broad guidance or a structured error instead of pretending precision.

9. **The Depth Inference Engine output is always a range, never a single number.** Single-number depth recommendations create false precision and erode user trust.

10. **The Situational Assessment paragraph must be generated fresh for every query.** It must reference the specific combination of inputs — never reuse boilerplate language.

11. **Engine data quality is authoritative.** The Recommender may add its own user-input confidence penalties, but it must never override `coverage_pct`, `reliability_tier`, `component_status`, or missing-variable reporting from the core engine.

---

*End of Specification — All engines, formulas, and tables in this document reflect validated fish biology and field-tested fishing knowledge. Scoring weights are starting baselines and should be tuned with real catch data over time.*
