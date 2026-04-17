# smb-03-northeast-river-june-postspawn — Northeast river • June post-spawn • overcast, pre-front reaction day

> **Intent:** Early June on a NY/PA smallmouth river (e.g. Susquehanna). Post-spawn fish aggressive, recovering, feeding on baitfish and crayfish. Overcast, falling pressure, moderate wind — classic reaction window. Guide read: mid-column reaction baits should rate high, pace medium-fast, bolder presence OK.

## Setup

| Field | Value |
| --- | --- |
| Species | smallmouth_bass |
| Context | freshwater_river |
| Water clarity | stained |
| Condition profile | pre_front_falling_pressure |
| Region | northeast |
| State | PA |
| Coordinates | 40.75, -76.55 |
| Date | 2026-06-08 (June) |
| Timezone | America/New_York |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 72°F |
| Daily mean / low / high | 70°F / 60°F / 78°F |
| Prior day mean | 72°F |
| Day minus 2 mean | 74°F |
| Measured water (now/24h/72h) | 68°F / 68°F / 67°F |
| Pressure (now) | 1008.0 mb |
| Pressure trend (48h) | falling strongly (1016.0 → 1014.0 → 1012.0 → 1010.0 → 1008.0) |
| Wind | 14 mph |
| Cloud cover | 85% |
| Precip 24h / 72h / 7d | 0.15″ / 0.40″ / 0.90″ |
| Active precip now | no |
| Sunrise / sunset | 2026-06-08T05:30:00-04:00 / 2026-06-08T20:31:00-04:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | slightly_aggressive |
| reaction_window | on |
| surface_window | rippled |
| surface_allowed_today | true |
| suppress_fast_presentations | false |
| high_visibility_needed | true |
| opportunity_mix | aggressive |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | upper | surface | upper → surface → mid |
| pace | medium | fast | medium → fast |
| presence | moderate | subtle | moderate → subtle |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | 1 |
| pace_shift | -1 |
| presence_shift | 1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "stable",
  "temperature_shock": "none",
  "pressure_regime": "volatile",
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

- Rising or volatile pressure tightens the daily window.
- Lower light supports a slightly higher, more open lane.
- Slightly elevated runoff supports a more visible river presentation.

## Seasonal baseline (month 6)

| Field | Value |
| --- | --- |
| source region | northeast |
| region fallback used | false |
| state-scoped row | true |
| primary forage | baitfish |
| secondary forage | crawfish |
| surface seasonally possible | true |
| monthly allowed columns | surface, upper, mid |
| monthly column order | surface → upper → mid |
| monthly allowed paces | medium, fast |
| monthly pace order | medium → fast |
| monthly allowed presence | subtle, moderate |
| monthly presence order | subtle → moderate |
| typical seasonal water column | top |
| typical seasonal location | shallow |

## Lures



### 1. Squarebill Crankbait — `squarebill_crankbait`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `crankbait` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 17.370 |
| tactical_fit | 12.000 |
| practicality_fit | 4.120 |
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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred moderate presence."
  },
  {
    "code": "practicality_fit",
    "value": 4.12,
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

> This is today's top overall read. It fishes cleanly for today's conditions. Rising or volatile pressure tightens the daily window. The month is still baitfish-forward, and this stays inside that search lane.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Keep it high in the zone.

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
| score | 17.310 |
| tactical_fit | 12.000 |
| practicality_fit | 4.060 |
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
    "detail": "It leads on today's preferred moderate presence."
  },
  {
    "code": "practicality_fit",
    "value": 4.06,
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

> Behind today's lead look, this stays inside the day's window. It fishes cleanly for today's conditions. Rising or volatile pressure tightens the daily window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Keep it high in the zone.

**Automated flags**

_(none)_

### 3. Paddle-Tail Swimbait — `paddle_tail_swimbait`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `swimbait` |
| primary_column | upper |
| pace | medium |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 15.680 |
| tactical_fit | 12.000 |
| practicality_fit | 1.780 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.500 |

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
    "detail": "It leads on today's preferred moderate presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.78,
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Rising or volatile pressure tightens the daily window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.

**Automated flags**

_(none)_

## Flies



### 1. Game Changer — `game_changer`  _(best_match)_

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
| score | 14.650 |
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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred moderate presence."
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

> This is today's top overall read. It matches the column/pace the conditions push toward today. Rising or volatile pressure tightens the daily window. The month is still baitfish-forward, and this stays inside that search lane.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.

**Automated flags**

_(none)_

### 2. Popper Fly — `popper_fly`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_surface` |
| family_group | `surface_fly` |
| primary_column | surface |
| pace | fast |
| presence | moderate |
| is_surface | true |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.490 |
| tactical_fit | 10.500 |
| practicality_fit | 2.150 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.850 |

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
    "detail": "It leads on today's preferred moderate presence."
  },
  {
    "code": "practicality_fit",
    "value": 2.15,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.59,
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly surface look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.

**Automated flags**

_(none)_

### 3. Clouser Minnow — `clouser_minnow`  _(change_up)_

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
| score | 13.050 |
| tactical_fit | 9.250 |
| practicality_fit | 2.000 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.450 |

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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred moderate presence."
  },
  {
    "code": "practicality_fit",
    "value": 2,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.55,
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Rising or volatile pressure tightens the daily window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

**Automated flags**

_(none)_

## Automated flags summary

_(none)_

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
