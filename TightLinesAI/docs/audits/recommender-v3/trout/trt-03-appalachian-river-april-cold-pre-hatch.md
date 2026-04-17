# trt-03-appalachian-river-april-cold-pre-hatch — Appalachian river • April • early season cold, low pressure

> **Intent:** Early April on a WV/VA/NC Appalachian trout river. Water 46°F, cold start to the season, pre-main-hatch. Low pressure, overcast, cool. Guide read: nymphing and weighted streamers; water too cold for consistent surface. Subtle presence, slow pace, bottom-to-mid column. Surface should CLOSE or heavily demote.

## Setup

| Field | Value |
| --- | --- |
| Species | river_trout |
| Context | freshwater_river |
| Water clarity | stained |
| Condition profile | early_season_cold_clear |
| Region | appalachian |
| State | WV |
| Coordinates | 38.65, -79.85 |
| Date | 2026-04-06 (April) |
| Timezone | America/New_York |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 52°F |
| Daily mean / low / high | 46°F / 36°F / 56°F |
| Prior day mean | 48°F |
| Day minus 2 mean | 50°F |
| Measured water (now/24h/72h) | 46°F / 45°F / 44°F |
| Pressure (now) | 1006.0 mb |
| Pressure trend (48h) | falling strongly (1012.0 → 1010.5 → 1009.0 → 1007.5 → 1006.0) |
| Wind | 7 mph |
| Cloud cover | 90% |
| Precip 24h / 72h / 7d | 0.15″ / 0.50″ / 1.10″ |
| Active precip now | no |
| Sunrise / sunset | 2026-04-06T07:02:00-04:00 / 2026-04-06T19:46:00-04:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | aggressive |
| reaction_window | on |
| surface_window | clean |
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
  "pressure_regime": "falling_moderate",
  "wind_condition": "light",
  "light_cloud_condition": "heavy_overcast",
  "precipitation_disruption": null,
  "runoff_flow_disruption": "slightly_elevated"
}
```

### Variables triggered

- `pressure_regime`
- `light_cloud_condition`
- `runoff_flow_disruption`

### Daily preference notes

- Falling pressure supports a more willing feeding window.
- Lower light supports a slightly higher, more open lane.
- Slightly elevated runoff supports a more visible river presentation.

## Seasonal baseline (month 4)

| Field | Value |
| --- | --- |
| source region | appalachian |
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
| score | 15.930 |
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
| score | 14.400 |
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



### 1. Clouser Minnow — `clouser_minnow`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `baitfish_streamer` |
| primary_column | mid |
| pace | medium |
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

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 2. Slim Baitfish Streamer — `slim_minnow_streamer`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `baitfish_streamer` |
| primary_column | upper |
| pace | medium |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 10.150 |
| tactical_fit | 7.750 |
| practicality_fit | 0.550 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | -0.750 |

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
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 1.25,
    "detail": "It touches today's bold presence as a tertiary look rather than a lead."
  },
  {
    "code": "practicality_fit",
    "value": 0.55,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.6,
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Retrieve with a mix of short darts and longer glides; the thin profile tracks like a small minnow on a tight line. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 3. Bucktail Streamer — `bucktail_baitfish_streamer`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `baitfish_streamer` |
| primary_column | upper |
| pace | medium |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 9.550 |
| tactical_fit | 7.750 |
| practicality_fit | 0.550 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | -1.050 |

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
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 1.25,
    "detail": "It touches today's bold presence as a tertiary look rather than a lead."
  },
  {
    "code": "practicality_fit",
    "value": 0.55,
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

> Cast across or down and retrieve with consistent strips; add a pause every 4-5 strips so the bucktail flares and collapses like a stunned baitfish. Fish it with a more active cadence.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (2)
- [trio] fly trio: all three picks share family_group=baitfish_streamer. Low diversity.
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
