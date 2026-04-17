# lmb-02-southeast-atlantic-lake-april-prespawn — SE Atlantic reservoir • April pre-spawn • warming, overcast moderate wind

> **Intent:** Mid-April on a GA/SC reservoir (Clarks Hill, Murray). Water warming to low-60s, bass staging in transition zones. Overcast, moderate wind, stable-to-falling pressure — classic pre-spawn reaction day. Guide read: moving baits (squarebill, spinnerbait, lipless, jerkbait) should rate high. Moderate-bold presence, medium-fast pace. Surface possibly open but not dominant.

## Setup

| Field | Value |
| --- | --- |
| Species | largemouth_bass |
| Context | freshwater_lake_pond |
| Water clarity | stained |
| Condition profile | spring_spawn_warming |
| Region | southeast_atlantic |
| State | GA |
| Coordinates | 33.65, -82.2 |
| Date | 2026-04-10 (April) |
| Timezone | America/New_York |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 68°F |
| Daily mean / low / high | 64°F / 54°F / 74°F |
| Prior day mean | 62°F |
| Day minus 2 mean | 60°F |
| Measured water (now/24h/72h) | 62°F / 61°F / 58°F |
| Pressure (now) | 1012.0 mb |
| Pressure trend (48h) | falling strongly (1017.0 → 1015.8 → 1014.5 → 1013.3 → 1012.0) |
| Wind | 12 mph |
| Cloud cover | 80% |
| Precip 24h / 72h / 7d | 0.05″ / 0.30″ / 0.80″ |
| Active precip now | no |
| Sunrise / sunset | 2026-04-10T07:04:00-04:00 / 2026-04-10T20:06:00-04:00 |

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
| column | upper | mid | upper → mid |
| pace | medium | fast | medium → fast |
| presence | bold | moderate | bold → moderate → subtle |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | 1 |
| pace_shift | 0 |
| presence_shift | 1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "stable",
  "temperature_shock": "none",
  "pressure_regime": "falling_moderate",
  "wind_condition": "moderate",
  "light_cloud_condition": "low_light",
  "precipitation_disruption": "light_mist",
  "runoff_flow_disruption": null
}
```

### Variables triggered

- `pressure_regime`
- `light_cloud_condition`
- `wind_condition`
- `precipitation_disruption`

### Daily preference notes

- Falling pressure supports a more willing feeding window.
- Lower light supports a slightly higher, more open lane.
- Moderate chop improves fishability and supports a stronger moving look.

## Seasonal baseline (month 4)

| Field | Value |
| --- | --- |
| source region | southeast_atlantic |
| region fallback used | false |
| state-scoped row | false |
| primary forage | crawfish |
| secondary forage | baitfish |
| surface seasonally possible | false |
| monthly allowed columns | upper, mid |
| monthly column order | upper → mid |
| monthly allowed paces | medium, fast |
| monthly pace order | medium → fast |
| monthly allowed presence | subtle, moderate, bold |
| monthly presence order | moderate → subtle → bold |
| typical seasonal water column | top |
| typical seasonal location | shallow |

## Lures



### 1. Swim Jig — `swim_jig`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `jig` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.350 |
| tactical_fit | 12.000 |
| practicality_fit | 1.550 |
| forage_fit | 0.450 |
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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.55,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.45,
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

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It stays high enough in the zone to match the day's more open positioning.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Keep it high in the zone.

**Automated flags**

_(none)_

### 2. Weightless Stick Worm — `weightless_stick_worm`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `cover_weedless` |
| family_group | `worm` |
| primary_column | upper |
| pace | medium |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 11.850 |
| tactical_fit | 10.500 |
| practicality_fit | 0.350 |
| forage_fit | 0.000 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.050 |

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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.35,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.65,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0,
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different cover weedless look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast to shade lines and feed slack on the fall so the bait shimmies naturally through the upper/mid column; if it reaches cover without a bite, lift it free and re-pitch rather than dragging.

**Automated flags**

_(none)_

### 3. Compact Flipping Jig — `compact_flipping_jig`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `cover_weedless` |
| family_group | `jig` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.930 |
| tactical_fit | 12.000 |
| practicality_fit | 0.000 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | -0.800 |

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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 0,
    "detail": "Its day-level practicality stays clean for today's conditions."
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Get the bait right into the cover before moving it — thumb the spool on the drop, and if you don't feel a strike, give it one or two hops then move on. Keep it high in the zone.

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
| score | 12.850 |
| tactical_fit | 10.500 |
| practicality_fit | 1.550 |
| forage_fit | 0.450 |
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
    "value": 2.5,
    "detail": "Its secondary column overlaps today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.55,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.45,
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

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. Clouser Minnow tracks well when baitfish is a realistic meal.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

**Automated flags**

_(none)_

### 2. Woolly Bugger — `woolly_bugger`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_bottom` |
| family_group | `bugger_leech` |
| primary_column | mid |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 4.230 |
| tactical_fit | 2.500 |
| practicality_fit | 0.000 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.450 |

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
    "value": 2.5,
    "detail": "Its secondary column overlaps today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": -2.5,
    "detail": "Its pace profile pulls against today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 0,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.48,
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting.

**Automated flags**

_(none)_

### 3. Crawfish Streamer — `crawfish_streamer`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_bottom` |
| family_group | `bottom_streamer` |
| primary_column | bottom |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 5.250 |
| tactical_fit | 4.000 |
| practicality_fit | 0.000 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.700 |

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
    "value": -2.5,
    "detail": "Its column profile pulls against today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 0,
    "detail": "Its day-level practicality stays clean for today's conditions."
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. Crawfish Streamer tracks well when crawfish is a realistic meal. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Keep it low in the strike zone.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (3)
- [trio] lure trio: two of three picks share a family_group. Moderate diversity.
- [trio] lure trio: pick 3 (compact_flipping_jig, score=13.930) has a higher raw score than pick 2 (weightless_stick_worm, score=11.850). This is expected under per-slot diversity_bonus reordering in topThreeSelection.ts and is not by itself a bug.
- [trio] fly trio: pick 3 (crawfish_streamer, score=5.250) has a higher raw score than pick 2 (woolly_bugger, score=4.230). This is expected under per-slot diversity_bonus reordering in topThreeSelection.ts and is not by itself a bug.


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
