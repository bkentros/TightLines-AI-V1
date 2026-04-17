# pike-02-northeast-lake-september-fall-feed — Northeast lake • September • fall feed, stable cool clear

> **Intent:** Late September on Lake Champlain / St. Lawrence-style pike/musky water. Water cooling through the mid-60s, fish binging on ciscos and perch before winter. Stable high pressure, clear, cool morning. Guide read: big swimbaits, glide baits, bucktails, jerkbaits — bold presence, medium pace. Surface open but not dominant. Mix should trend balanced-to-aggressive given the fall feed window.

## Setup

| Field | Value |
| --- | --- |
| Species | pike_musky |
| Context | freshwater_lake_pond |
| Water clarity | clear |
| Condition profile | fall_feed_cooling |
| Region | northeast |
| State | VT |
| Coordinates | 44.55, -73.2 |
| Date | 2026-09-26 (September) |
| Timezone | America/New_York |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 62°F |
| Daily mean / low / high | 58°F / 48°F / 68°F |
| Prior day mean | 60°F |
| Day minus 2 mean | 62°F |
| Measured water (now/24h/72h) | 63°F / 64°F / 66°F |
| Pressure (now) | 1020.0 mb |
| Pressure trend (48h) | rising (1019.0 → 1019.3 → 1019.5 → 1019.8 → 1020.0) |
| Wind | 6 mph |
| Cloud cover | 30% |
| Precip 24h / 72h / 7d | 0.00″ / 0.10″ / 0.40″ |
| Active precip now | no |
| Sunrise / sunset | 2026-09-26T06:39:00-04:00 / 2026-09-26T18:37:00-04:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | slightly_aggressive |
| reaction_window | watch |
| surface_window | rippled |
| surface_allowed_today | true |
| suppress_fast_presentations | false |
| high_visibility_needed | false |
| opportunity_mix | balanced |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | mid | bottom | mid → bottom → upper |
| pace | medium | fast | medium → fast |
| presence | moderate | bold | moderate → bold |

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
  "pressure_regime": "rising_slow",
  "wind_condition": "light",
  "light_cloud_condition": "mixed",
  "precipitation_disruption": "dry_stable",
  "runoff_flow_disruption": null
}
```

### Variables triggered

- `precipitation_disruption`

### Daily preference notes

_(none)_

## Seasonal baseline (month 9)

| Field | Value |
| --- | --- |
| source region | northeast |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | bluegill_perch |
| surface seasonally possible | false |
| monthly allowed columns | upper, mid, bottom |
| monthly column order | mid → bottom → upper |
| monthly allowed paces | medium, fast |
| monthly pace order | medium → fast |
| monthly allowed presence | moderate, bold |
| monthly presence order | moderate → bold |
| typical seasonal water column | mid |
| typical seasonal location | shallow_mid |

## Lures



### 1. Large Paddle-Tail Swimbait — `large_profile_pike_swimbait`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `pike_big_profile` |
| family_group | `pike_swimbait` |
| primary_column | upper |
| pace | fast |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.140 |
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
    "detail": "It leads on today's preferred mid column."
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
    "value": 0,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.69,
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
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. It leads on today's preferred mid column. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Slow-roll at a steady mid-depth pace; pike follow long before committing, so keep your nerve and don't speed up or stop until the line goes tight.

**Automated flags**

_(none)_

### 2. Casting Spoon — `casting_spoon`  _(strong_alternate)_

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
| score | 13.450 |
| tactical_fit | 12.000 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
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
    "value": 4,
    "detail": "It leads on today's preferred mid column."
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It leads on today's preferred mid column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it with a lift-and-drop over suspended fish; the concave face spins as it falls — strikes are usually on the drop, so keep a semi-tight line.

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
| score | 13.450 |
| tactical_fit | 12.000 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
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
    "detail": "It leads on today's preferred mid column."
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred mid column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even.

**Automated flags**

- [BUG] lure 3 (paddle_tail_swimbait): copy describes bottom-dragging/crawling technique but archetype primary_column=upper.

## Flies



### 1. Articulated Pike Streamer — `large_articulated_pike_streamer`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `pike_big_profile` |
| family_group | `pike_streamer` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.140 |
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
    "detail": "It leads on today's preferred mid column."
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
    "value": 0,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.69,
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
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. It leads on today's preferred mid column. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat.

**Automated flags**

_(none)_

### 2. Articulated Dungeon Streamer — `articulated_dungeon_streamer`  _(strong_alternate)_

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
| score | 11.950 |
| tactical_fit | 10.500 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.500 |

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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred moderate presence."
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It leads on today's preferred mid column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.

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
| score | 11.950 |
| tactical_fit | 10.500 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred moderate presence."
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred mid column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Cover water at mid-depth with steady strips; add a hard single rip followed by a full pause to imitate an injured baitfish fleeing and then stopping.

**Automated flags**

_(none)_

## Automated flags summary

### BUG (1)
- [rec:paddle_tail_swimbait] lure 3 (paddle_tail_swimbait): copy describes bottom-dragging/crawling technique but archetype primary_column=upper.


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
