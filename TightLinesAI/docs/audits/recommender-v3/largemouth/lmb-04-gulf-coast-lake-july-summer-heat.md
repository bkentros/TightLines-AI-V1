# lmb-04-gulf-coast-lake-july-summer-heat — Gulf Coast reservoir • July • deep summer heat, stable high pressure

> **Intent:** Mid-July on Toledo Bend / Rayburn. Surface temps pushing 88°F, bass in deep structure and on offshore brush piles. Stable high pressure, sun angle high, light wind. Guide read: deep-diving crankbaits, football jigs, Carolina-rigged worms, big worms on offshore structure. Surface bite windowed around dawn only. Presence should skew bolder (deep/clarity demands visibility).

## Setup

| Field | Value |
| --- | --- |
| Species | largemouth_bass |
| Context | freshwater_lake_pond |
| Water clarity | clear |
| Condition profile | summer_peak_hot |
| Region | gulf_coast |
| State | LA |
| Coordinates | 31.5, -93.72 |
| Date | 2026-07-20 (July) |
| Timezone | America/Chicago |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 92°F |
| Daily mean / low / high | 88°F / 76°F / 96°F |
| Prior day mean | 88°F |
| Day minus 2 mean | 87°F |
| Measured water (now/24h/72h) | 87°F / 87°F / 86°F |
| Pressure (now) | 1018.0 mb |
| Pressure trend (48h) | rising (1017.0 → 1017.3 → 1017.5 → 1017.8 → 1018.0) |
| Wind | 5 mph |
| Cloud cover | 25% |
| Precip 24h / 72h / 7d | 0.00″ / 0.00″ / 0.20″ |
| Active precip now | no |
| Sunrise / sunset | 2026-07-20T06:21:00-05:00 / 2026-07-20T20:22:00-05:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | neutral |
| reaction_window | watch |
| surface_window | closed |
| surface_allowed_today | false |
| suppress_fast_presentations | false |
| high_visibility_needed | false |
| opportunity_mix | balanced |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | bottom | mid | bottom → mid |
| pace | slow | medium | slow → medium |
| presence | subtle | moderate | subtle → moderate |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | -1 |
| pace_shift | -1 |
| presence_shift | -1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "stable",
  "temperature_shock": "none",
  "pressure_regime": "rising_slow",
  "wind_condition": "light",
  "light_cloud_condition": "bright",
  "precipitation_disruption": "extended_dry",
  "runoff_flow_disruption": null
}
```

### Variables triggered

- `light_cloud_condition`
- `precipitation_disruption`

### Daily preference notes

- Bright light trims the day back toward cleaner looks.

## Seasonal baseline (month 7)

| Field | Value |
| --- | --- |
| source region | gulf_coast |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | bluegill_perch |
| surface seasonally possible | true |
| monthly allowed columns | bottom, mid |
| monthly column order | bottom → mid |
| monthly allowed paces | slow, medium |
| monthly pace order | slow → medium |
| monthly allowed presence | subtle, moderate |
| monthly presence order | subtle → moderate |
| typical seasonal water column | low |
| typical seasonal location | mid_deep |

## Lures



### 1. Texas-Rigged Soft-Plastic Craw — `texas_rigged_soft_plastic_craw`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `cover_weedless` |
| family_group | `soft_craw` |
| primary_column | bottom |
| pace | medium |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 12.350 |
| tactical_fit | 12.000 |
| practicality_fit | 0.000 |
| forage_fit | 0.000 |
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
    "detail": "It leads on today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + bright sun — go natural. _(code: `clear_bright_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Bright light trims the day back toward cleaner looks. It stays low in the zone where this day still wants fish to hold.

**How to fish** _(verbatim — audit for technique correctness)_

> Flip or pitch into cover, let the craw fall straight on semi-slack line, then hop it once or twice before the next pitch. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 2. Football Jig — `football_jig`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `bottom_contact` |
| family_group | `jig` |
| primary_column | mid |
| pace | slow |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 12.050 |
| tactical_fit | 10.500 |
| practicality_fit | 0.000 |
| forage_fit | 0.550 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.650 |

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
    "detail": "It leads on today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.65,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.55,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + bright sun — go natural. _(code: `clear_bright_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 3. Spinnerbait — `spinnerbait`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `spinnerbait` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 8.450 |
| tactical_fit | 7.500 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
| clarity_fit | -0.150 |
| diversity_bonus | 1.400 |

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
    "detail": "Its secondary column overlaps today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
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
    "value": 1.1,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": -0.15,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + bright sun — go natural. _(code: `clear_bright_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast past the target and retrieve through it, varying speed to find the blade thump fish respond to; hesitate briefly at cover edges. Slow down and lengthen the pause.

**Automated flags**

_(none)_

## Flies



### 1. Woolly Bugger — `woolly_bugger`  _(best_match)_

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
| score | 14.130 |
| tactical_fit | 12.000 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
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
    "detail": "It leads on today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
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
    "value": 1.1,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + bright sun — go natural. _(code: `clear_bright_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 2. Balanced Leech — `balanced_leech`  _(strong_alternate)_

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
| score | 14.100 |
| tactical_fit | 12.000 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
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
    "detail": "It leads on today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.65,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 1.1,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + bright sun — go natural. _(code: `clear_bright_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Let it suspend just off bottom or under cover and move it only with tiny strips; the balanced posture is the trigger, not speed. Slow down and lengthen the pause.

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
| score | 12.350 |
| tactical_fit | 12.000 |
| practicality_fit | 0.000 |
| forage_fit | 0.000 |
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
    "value": 4,
    "detail": "It leads on today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + bright sun — go natural. _(code: `clear_bright_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Bright light trims the day back toward cleaner looks. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Pinch the fly to the bottom and move it in erratic 1-2 inch hops with long pauses; the slower and lower, the better — crawfish don't sprint. Slow down and lengthen the pause.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (2)
- [trio] fly trio: two of three picks share a family_group. Moderate diversity.
- [trio] fly trio: all three picks share tactical_lane=fly_bottom. Very low tactical diversity.


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
