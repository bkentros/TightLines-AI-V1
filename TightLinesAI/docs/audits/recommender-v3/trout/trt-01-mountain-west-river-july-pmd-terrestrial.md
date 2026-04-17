# trt-01-mountain-west-river-july-pmd-terrestrial — Mountain West river • July • PMD + terrestrial window, stable clear

> **Intent:** Mid-July on a MT/WY classic trout river (Madison / Bighorn / Green). Water clear and cool (low-60s), fish keyed on PMDs morning and hoppers/terrestrials afternoon. Stable pressure, partly cloudy, light wind. Guide read: dry-fly + nymph rigs dominate; streamers secondary. Subtle-to-moderate presence, slow-to-medium pace, upper-to-mid column. Surface OPEN is appropriate.

## Setup

| Field | Value |
| --- | --- |
| Species | river_trout |
| Context | freshwater_river |
| Water clarity | clear |
| Condition profile | stable_high_pressure_clear |
| Region | mountain_west |
| State | MT |
| Coordinates | 45.35, -111.3 |
| Date | 2026-07-16 (July) |
| Timezone | America/Denver |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 74°F |
| Daily mean / low / high | 66°F / 48°F / 82°F |
| Prior day mean | 65°F |
| Day minus 2 mean | 64°F |
| Measured water (now/24h/72h) | 60°F / 59°F / 58°F |
| Pressure (now) | 1018.0 mb |
| Pressure trend (48h) | stable (1018.0 → 1018.0 → 1018.0 → 1018.0 → 1018.0) |
| Wind | 5 mph |
| Cloud cover | 30% |
| Precip 24h / 72h / 7d | 0.00″ / 0.00″ / 0.20″ |
| Active precip now | no |
| Sunrise / sunset | 2026-07-16T05:51:00-06:00 / 2026-07-16T21:18:00-06:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | aggressive |
| reaction_window | watch |
| surface_window | rippled |
| surface_allowed_today | true |
| suppress_fast_presentations | false |
| high_visibility_needed | false |
| opportunity_mix | aggressive |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | upper | surface | upper → surface → mid |
| pace | medium | slow | medium → slow → fast |
| presence | subtle | moderate | subtle → moderate → bold |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | 0 |
| pace_shift | 0 |
| presence_shift | -1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "stable",
  "temperature_shock": "none",
  "pressure_regime": "stable_neutral",
  "wind_condition": "light",
  "light_cloud_condition": "mixed",
  "precipitation_disruption": null,
  "runoff_flow_disruption": "perfect_clear"
}
```

### Variables triggered

- `runoff_flow_disruption`

### Daily preference notes

_(none)_

## Seasonal baseline (month 7)

| Field | Value |
| --- | --- |
| source region | mountain_west |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | insect_misc |
| surface seasonally possible | true |
| monthly allowed columns | surface, upper, mid |
| monthly column order | upper → mid → surface |
| monthly allowed paces | slow, medium, fast |
| monthly pace order | medium → slow → fast |
| monthly allowed presence | subtle, moderate, bold |
| monthly presence order | moderate → subtle → bold |
| typical seasonal water column | high |
| typical seasonal location | shallow |

## Lures



### 1. Paddle-Tail Swimbait — `paddle_tail_swimbait`  _(best_match)_

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
| score | 13.700 |
| tactical_fit | 12.000 |
| practicality_fit | 0.450 |
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
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.45,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane.

**How to fish** _(verbatim — audit for technique correctness)_

> Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.

**Automated flags**

_(none)_

### 2. Soft Plastic Jerkbait — `soft_jerkbait`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `soft_jerkbait` |
| primary_column | upper |
| pace | medium |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.700 |
| tactical_fit | 12.000 |
| practicality_fit | 0.450 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.250 |

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
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.45,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Snap the rod sideways so the bait darts left or right, then drop the rod tip so it glides and sinks on a slack line before the next snap. Keep it high in the zone.

**Automated flags**

_(none)_

### 3. Hair Jig — `hair_jig`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `finesse_subtle` |
| family_group | `hair_jig` |
| primary_column | upper |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.100 |
| tactical_fit | 12.000 |
| practicality_fit | -0.150 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.350 |

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
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": -0.15,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along. Keep it high in the zone.

**Automated flags**

_(none)_

## Flies



### 1. Slim Baitfish Streamer — `slim_minnow_streamer`  _(best_match)_

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
| score | 14.400 |
| tactical_fit | 12.000 |
| practicality_fit | 0.450 |
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
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.7,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip. Keep it high in the zone.

**Automated flags**

_(none)_

### 2. Bucktail Streamer — `bucktail_baitfish_streamer`  _(strong_alternate)_

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
| score | 13.700 |
| tactical_fit | 12.000 |
| practicality_fit | 0.450 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | -1.300 |

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
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.45,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast across or down and retrieve with consistent strips; add a pause every 4-5 strips so the bucktail flares and collapses like a stunned baitfish. Keep it high in the zone.

**Automated flags**

_(none)_

### 3. Muddler Minnow — `muddler_sculpin`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_bottom` |
| family_group | `bottom_streamer` |
| primary_column | bottom |
| pace | slow |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 10.030 |
| tactical_fit | 7.750 |
| practicality_fit | 0.450 |
| forage_fit | 0.900 |
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
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.58,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast across and let current animate the fly; add a slow retrieve in lakes and ponds, using rod dips to make the deer hair head push water and dive. Keep it high in the zone.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (1)
- [trio] fly trio: two of three picks share a family_group. Moderate diversity.


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
