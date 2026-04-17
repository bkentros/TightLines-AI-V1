# pike-04-mountain-west-lake-october-cold-front — Mountain West lake • October • post-front, cold clear

> **Intent:** Mid-October on a MT/WY cold-water pike reservoir (Fort Peck / similar). Water in the low-50s, pike keying on hardcore fall feed but post-front has dampened them. Bluebird high pressure, very cool morning. Guide read: big swimbaits and jerkbaits worked slower; presence still bold but pace trending slower. Surface likely closing. This is a stress-test for cold-fast-species logic.

## Setup

| Field | Value |
| --- | --- |
| Species | pike_musky |
| Context | freshwater_lake_pond |
| Water clarity | clear |
| Condition profile | post_front_bluebird |
| Region | mountain_west |
| State | MT |
| Coordinates | 47.95, -106.75 |
| Date | 2026-10-15 (October) |
| Timezone | America/Denver |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 48°F |
| Daily mean / low / high | 44°F / 30°F / 56°F |
| Prior day mean | 52°F |
| Day minus 2 mean | 60°F |
| Measured water (now/24h/72h) | 52°F / 54°F / 57°F |
| Pressure (now) | 1028.0 mb |
| Pressure trend (48h) | rising strongly (1009.0 → 1013.8 → 1018.5 → 1023.3 → 1028.0) |
| Wind | 4 mph |
| Cloud cover | 15% |
| Precip 24h / 72h / 7d | 0.00″ / 0.30″ / 0.40″ |
| Active precip now | no |
| Sunrise / sunset | 2026-10-15T07:38:00-06:00 / 2026-10-15T18:36:00-06:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | suppressed |
| reaction_window | off |
| surface_window | closed |
| surface_allowed_today | false |
| suppress_fast_presentations | true |
| high_visibility_needed | false |
| opportunity_mix | conservative |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | bottom | mid | bottom → mid → upper |
| pace | medium | fast | medium → fast |
| presence | moderate | bold | moderate → bold |

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
  "temperature_trend": "cooling",
  "temperature_shock": "none",
  "pressure_regime": "volatile",
  "wind_condition": "light",
  "light_cloud_condition": "bright",
  "precipitation_disruption": "dry_stable",
  "runoff_flow_disruption": null
}
```

### Variables triggered

- `temperature_trend`
- `pressure_regime`
- `light_cloud_condition`
- `precipitation_disruption`

### Daily preference notes

- A cooling trend tightens fish and shifts preference lower and slower.
- Rising or volatile pressure tightens the daily window.
- Bright light trims the day back toward cleaner looks.

## Seasonal baseline (month 10)

| Field | Value |
| --- | --- |
| source region | mountain_west |
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
| score | 10.300 |
| tactical_fit | 10.500 |
| practicality_fit | -1.100 |
| forage_fit | 0.550 |
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
    "detail": "Its secondary column overlaps today's preferred bottom column."
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
    "value": -1.1,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
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

> This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane.

**How to fish** _(verbatim — audit for technique correctness)_

> Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.

**Automated flags**

_(none)_

### 2. Spinnerbait — `spinnerbait`  _(strong_alternate)_

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
| score | 9.800 |
| tactical_fit | 10.500 |
| practicality_fit | -1.100 |
| forage_fit | 0.550 |
| clarity_fit | -0.150 |
| diversity_bonus | 0.350 |

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
    "value": -1.1,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.55,
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise.

**Automated flags**

- [BUG] lure 2 (spinnerbait): copy describes bottom-dragging/crawling technique but archetype primary_column=upper.

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
| score | 8.100 |
| tactical_fit | 10.500 |
| practicality_fit | -3.300 |
| forage_fit | 0.550 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.550 |

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
    "value": -3.3,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast, let it flutter to depth, then reel with a rhythmic rise-and-fall so the flashing face covers the full water column; vary sink time to find the depth.

**Automated flags**

- [BUG] lure 3 (casting_spoon): archetype pace=fast but daily suppress_fast_presentations=true. Engine selected a fast presentation under suppression; expected it to be blocked or demoted.

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
| score | 10.890 |
| tactical_fit | 10.500 |
| practicality_fit | -1.100 |
| forage_fit | 0.550 |
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
    "detail": "Its secondary column overlaps today's preferred bottom column."
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
    "value": -1.1,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.59,
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

> This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat. Keep it high in the zone.

**Automated flags**

_(none)_

### 2. Large Rabbit Strip Streamer — `pike_bunny_streamer`  _(strong_alternate)_

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
| score | 10.850 |
| tactical_fit | 10.500 |
| practicality_fit | -1.100 |
| forage_fit | 0.550 |
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
    "value": 2.5,
    "detail": "Its secondary column overlaps today's preferred bottom column."
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
    "value": -1.1,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.55,
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It gives you a different pike big profile look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip with long, steady pulls so the rabbit hair breathes and the profile stays big; pause after every 2-3 strips to let following pike close. Keep it high in the zone.

**Automated flags**

_(none)_

### 3. Deceiver — `deceiver`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `baitfish_streamer` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 10.300 |
| tactical_fit | 10.500 |
| practicality_fit | -1.100 |
| forage_fit | 0.550 |
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
    "value": 2.5,
    "detail": "Its secondary column overlaps today's preferred bottom column."
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
    "value": -1.1,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip in long, smooth pulls so the saddle feathers breathe; add a pause every few strips for followers to close the gap. Keep it high in the zone.

**Automated flags**

_(none)_

## Automated flags summary

### BUG (2)
- [rec:spinnerbait] lure 2 (spinnerbait): copy describes bottom-dragging/crawling technique but archetype primary_column=upper.
- [rec:casting_spoon] lure 3 (casting_spoon): archetype pace=fast but daily suppress_fast_presentations=true. Engine selected a fast presentation under suppression; expected it to be blocked or demoted.


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
