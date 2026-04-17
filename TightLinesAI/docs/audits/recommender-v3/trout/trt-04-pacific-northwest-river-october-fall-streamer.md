# trt-04-pacific-northwest-river-october-fall-streamer — PNW river • October • fall streamer window, stained water

> **Intent:** Mid-October on an OR/WA trout river (Deschutes-style canyon country). Water in the low-50s, stained from fall rain, browns aggressive. Overcast, cool, light wind. Guide read: streamer swinging dominates, nymphing as fallback. Bold presence, medium pace, mid-column. Surface largely closed (water too cool & stained for consistent dries).

## Setup

| Field | Value |
| --- | --- |
| Species | river_trout |
| Context | freshwater_river |
| Water clarity | stained |
| Condition profile | fall_feed_cooling |
| Region | pacific_northwest |
| State | OR |
| Coordinates | 44.85, -121.65 |
| Date | 2026-10-18 (October) |
| Timezone | America/Los_Angeles |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 58°F |
| Daily mean / low / high | 54°F / 44°F / 62°F |
| Prior day mean | 55°F |
| Day minus 2 mean | 56°F |
| Measured water (now/24h/72h) | 51°F / 52°F / 54°F |
| Pressure (now) | 1014.0 mb |
| Pressure trend (48h) | falling (1016.0 → 1015.5 → 1015.0 → 1014.5 → 1014.0) |
| Wind | 8 mph |
| Cloud cover | 85% |
| Precip 24h / 72h / 7d | 0.10″ / 0.40″ / 1.20″ |
| Active precip now | no |
| Sunrise / sunset | 2026-10-18T07:31:00-07:00 / 2026-10-18T18:21:00-07:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | aggressive |
| reaction_window | on |
| surface_window | rippled |
| surface_allowed_today | true |
| suppress_fast_presentations | false |
| high_visibility_needed | true |
| opportunity_mix | aggressive |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | upper | surface | upper → surface → mid → bottom |
| pace | fast | medium | fast → medium |
| presence | bold | moderate | bold → moderate → subtle |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | 1 |
| pace_shift | 1 |
| presence_shift | 1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "stable",
  "temperature_shock": "none",
  "pressure_regime": "falling_slow",
  "wind_condition": "moderate",
  "light_cloud_condition": "low_light",
  "precipitation_disruption": null,
  "runoff_flow_disruption": "slightly_elevated"
}
```

### Variables triggered

- `pressure_regime`
- `light_cloud_condition`
- `wind_condition`
- `runoff_flow_disruption`

### Daily preference notes

- Falling pressure supports a more willing feeding window.
- Lower light supports a slightly higher, more open lane.
- Slightly elevated runoff supports a more visible river presentation.

## Seasonal baseline (month 10)

| Field | Value |
| --- | --- |
| source region | pacific_northwest |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | leech_worm |
| surface seasonally possible | true |
| monthly allowed columns | surface, upper, mid, bottom |
| monthly column order | mid → upper → bottom → surface |
| monthly allowed paces | medium, fast |
| monthly pace order | medium → fast |
| monthly allowed presence | subtle, moderate, bold |
| monthly presence order | moderate → subtle → bold |
| typical seasonal water column | mid |
| typical seasonal location | shallow_mid |

## Lures



### 1. Inline Spinner — `inline_spinner`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `spinner` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 15.900 |
| tactical_fit | 12.000 |
| practicality_fit | 2.000 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.000 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 2,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.65,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 2. Suspending Jerkbait — `suspending_jerkbait`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `reaction_mid_column` |
| family_group | `jerkbait` |
| primary_column | upper |
| pace | fast |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.430 |
| tactical_fit | 10.500 |
| practicality_fit | 2.000 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.200 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 2,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.68,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 3. Casting Spoon — `casting_spoon`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `reaction_mid_column` |
| family_group | `spoon` |
| primary_column | mid |
| pace | fast |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 12.500 |
| tactical_fit | 9.250 |
| practicality_fit | 2.000 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.950 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 1.25,
    "detail": "It touches today's upper column as a tertiary look rather than a lead."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 2,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it with a lift-and-drop over suspended fish; the concave face spins as it falls — strikes are usually on the drop, so keep a semi-tight line. Fish it with a more active cadence.

**Automated flags**

_(none)_

## Flies



### 1. Articulated Baitfish Streamer — `articulated_baitfish_streamer`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `baitfish_streamer` |
| primary_column | upper |
| pace | medium |
| presence | bold |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 15.330 |
| tactical_fit | 12.000 |
| practicality_fit | 1.400 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.000 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.4,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.68,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 2. Game Changer — `game_changer`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `articulated_streamer` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 15.300 |
| tactical_fit | 12.000 |
| practicality_fit | 1.400 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.600 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.4,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.65,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 3. Articulated Dungeon Streamer — `articulated_dungeon_streamer`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `articulated_streamer` |
| primary_column | mid |
| pace | medium |
| presence | bold |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 11.900 |
| tactical_fit | 9.250 |
| practicality_fit | 1.400 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | -0.300 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 1.25,
    "detail": "It touches today's upper column as a tertiary look rather than a lead."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.4,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal. Fish it with a more active cadence.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (2)
- [trio] fly trio: two of three picks share a family_group. Moderate diversity.
- [trio] fly trio: all three picks share tactical_lane=fly_baitfish. Very low tactical diversity.


## Auditor checklist

Work top-to-bottom. Record findings in the "Auditor notes" section below,
citing specific recommendation ids and quoted copy. Tag each finding with
`[BLOCKER]`, `[BUG]`, `[POLISH]`, or `[FYI]`.

- [ ] 1. **Day read** — do posture_band / opportunity_mix / surface_window / daily preference (column/pace/presence) match what a guide would deduce from the environment above?
- [ ] 2. **Primary forage** — does `seasonal_row.primary_forage` make biological sense for species + region + month?
- [ ] 3. **Lure selections** — are the 3 lures reasonable for this species/water/season/region? Any obvious misses or oddities?
- [ ] 4. **Fly selections** — are the 3 flies reasonable for this species/water/season/region? Any obvious misses or oddities?
- [ ] 5. **Per-rec authored dimensions** — do `primary_column`, `pace`, `presence`, `is_surface` match what this lure/fly is known for? Flag any authored ranges that look wrong.
- [ ] 6. **Why-chosen accuracy** — does each `why_chosen` cite drivers that actually match this lure + this day? Flag generic fluff, hallucinated reasons, or claims that contradict the day read.
- [ ] 7. **How-to-fish accuracy** — does each `how_to_fish` describe the CORRECT technique for this archetype, consistent with its column/pace/presence? Flag anything technically wrong.
- [ ] 8. **Trio coherence** — do the 3 lures (and 3 flies) form a sensible diverse-but-compatible set? Any pair that should not coexist given today's gates?
- [ ] 9. **Cross-check auto-flags** — for each auto-flag above, confirm or dismiss with reasoning.

## Auditor notes

_(fill in findings here — be specific, cite ids + quotes, tag severity, recommend fix with file path / function name when possible)_
