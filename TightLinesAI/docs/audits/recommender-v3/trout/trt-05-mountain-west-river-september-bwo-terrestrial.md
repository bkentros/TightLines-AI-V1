# trt-05-mountain-west-river-september-bwo-terrestrial — Mountain West river • September • BWO + late terrestrial, partly cloudy

> **Intent:** Mid-September on a MT/WY trout river. Water 58°F, BWOs ripping on overcast afternoons, late hoppers still working. Stable pressure trending lower, cool morning, partly cloudy. Guide read: mix of dry-dropper, streamer for bigger fish in low light, nymph for non-risers. Subtle-moderate presence, slow-medium pace, upper-to-mid column. Surface window should OPEN (key fall period).

## Setup

| Field | Value |
| --- | --- |
| Species | river_trout |
| Context | freshwater_river |
| Water clarity | clear |
| Condition profile | fall_feed_cooling |
| Region | mountain_west |
| State | WY |
| Coordinates | 44.15, -110.7 |
| Date | 2026-09-22 (September) |
| Timezone | America/Denver |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 62°F |
| Daily mean / low / high | 54°F / 38°F / 68°F |
| Prior day mean | 56°F |
| Day minus 2 mean | 58°F |
| Measured water (now/24h/72h) | 58°F / 58°F / 60°F |
| Pressure (now) | 1014.0 mb |
| Pressure trend (48h) | falling strongly (1018.0 → 1017.0 → 1016.0 → 1015.0 → 1014.0) |
| Wind | 6 mph |
| Cloud cover | 55% |
| Precip 24h / 72h / 7d | 0.00″ / 0.10″ / 0.40″ |
| Active precip now | no |
| Sunrise / sunset | 2026-09-22T06:48:00-06:00 / 2026-09-22T19:11:00-06:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | aggressive |
| reaction_window | on |
| surface_window | rippled |
| surface_allowed_today | true |
| suppress_fast_presentations | false |
| high_visibility_needed | false |
| opportunity_mix | aggressive |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | mid | surface | mid → surface → upper → bottom |
| pace | fast | medium | fast → medium |
| presence | subtle | moderate | subtle → moderate → bold |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | 0 |
| pace_shift | 1 |
| presence_shift | -1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "stable",
  "temperature_shock": "none",
  "pressure_regime": "falling_moderate",
  "wind_condition": "light",
  "light_cloud_condition": "mixed",
  "precipitation_disruption": null,
  "runoff_flow_disruption": "stable"
}
```

### Variables triggered

- `pressure_regime`
- `runoff_flow_disruption`

### Daily preference notes

- Falling pressure supports a more willing feeding window.

## Seasonal baseline (month 9)

| Field | Value |
| --- | --- |
| source region | mountain_west |
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



### 1. Suspending Jerkbait — `suspending_jerkbait`  _(best_match)_

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
    "detail": "It leads on today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 2. Inline Spinner — `inline_spinner`  _(strong_alternate)_

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
| score | 14.400 |
| tactical_fit | 10.500 |
| practicality_fit | 2.000 |
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
    "detail": "It leads on today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Fish it with a more active cadence.

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
| score | 15.250 |
| tactical_fit | 12.000 |
| practicality_fit | 2.000 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.750 |

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
    "detail": "It leads on today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Fish it with a more active cadence.

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
| score | 13.800 |
| tactical_fit | 10.500 |
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
    "detail": "It leads on today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Fish it with a more active cadence.

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
| score | 12.900 |
| tactical_fit | 10.500 |
| practicality_fit | 1.150 |
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
    "detail": "It leads on today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.15,
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Retrieve with a mix of short darts and longer glides; the thin profile tracks like a small minnow on a tight line. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 3. Articulated Baitfish Streamer — `articulated_baitfish_streamer`  _(change_up)_

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
| score | 12.580 |
| tactical_fit | 9.250 |
| practicality_fit | 1.400 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | -0.400 |

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
    "detail": "It leads on today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 1.25,
    "detail": "It touches today's subtle presence as a tertiary look rather than a lead."
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Cover water at mid-depth with steady strips; add a hard single rip followed by a full pause to imitate an injured baitfish fleeing and then stopping. Fish it with a more active cadence.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (3)
- [trio] lure trio: pick 3 (paddle_tail_swimbait, score=15.250) has a higher raw score than pick 2 (inline_spinner, score=14.400). This is expected under per-slot diversity_bonus reordering in topThreeSelection.ts and is not by itself a bug.
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
