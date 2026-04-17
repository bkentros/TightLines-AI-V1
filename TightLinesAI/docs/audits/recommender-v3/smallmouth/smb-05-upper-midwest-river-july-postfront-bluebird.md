# smb-05-upper-midwest-river-july-postfront-bluebird — Upper Midwest river • July • post-cold-front bluebird (classic tough day)

> **Intent:** Mid-July on a MN smallmouth river the day after a strong cold front. Bluebird sky, flat calm, high pressure, water temps holding but fish tight-lipped. Guide read: SUBTLE + SLOW + BOTTOM presentations; drop-shot, tube on the bottom, finesse worms. Surface should close or heavily demote. Opportunity mix should lean conservative. This is a stress-test scenario.

## Setup

| Field | Value |
| --- | --- |
| Species | smallmouth_bass |
| Context | freshwater_river |
| Water clarity | clear |
| Condition profile | post_front_bluebird |
| Region | great_lakes_upper_midwest |
| State | MN |
| Coordinates | 45.55, -94.15 |
| Date | 2026-07-22 (July) |
| Timezone | America/Chicago |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 68°F |
| Daily mean / low / high | 66°F / 54°F / 76°F |
| Prior day mean | 74°F |
| Day minus 2 mean | 80°F |
| Measured water (now/24h/72h) | 70°F / 72°F / 73°F |
| Pressure (now) | 1025.0 mb |
| Pressure trend (48h) | rising strongly (1008.0 → 1012.3 → 1016.5 → 1020.8 → 1025.0) |
| Wind | 3 mph |
| Cloud cover | 10% |
| Precip 24h / 72h / 7d | 0.02″ / 0.90″ / 1.10″ |
| Active precip now | no |
| Sunrise / sunset | 2026-07-22T05:42:00-05:00 / 2026-07-22T20:49:00-05:00 |

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
| pace | slow | medium | slow → medium → fast |
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
  "temperature_trend": "cooling",
  "temperature_shock": "none",
  "pressure_regime": "volatile",
  "wind_condition": "calm",
  "light_cloud_condition": "bright",
  "precipitation_disruption": null,
  "runoff_flow_disruption": "elevated"
}
```

### Variables triggered

- `temperature_trend`
- `pressure_regime`
- `light_cloud_condition`
- `runoff_flow_disruption`

### Daily preference notes

- A cooling trend tightens fish and shifts preference lower and slower.
- Rising or volatile pressure tightens the daily window.
- Bright light trims the day back toward cleaner looks.
- Elevated runoff tightens fish and pulls the day lower and slower.

## Seasonal baseline (month 7)

| Field | Value |
| --- | --- |
| source region | great_lakes_upper_midwest |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | crawfish |
| surface seasonally possible | true |
| monthly allowed columns | surface, upper, mid, bottom |
| monthly column order | mid → upper → bottom → surface |
| monthly allowed paces | slow, medium, fast |
| monthly pace order | medium → slow → fast |
| monthly allowed presence | subtle, moderate |
| monthly presence order | subtle → moderate |
| typical seasonal water column | mid |
| typical seasonal location | shallow_mid |

## Lures



### 1. Tube Jig — `tube_jig`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `bottom_contact` |
| family_group | `tube` |
| primary_column | upper |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.140 |
| tactical_fit | 10.500 |
| practicality_fit | 1.150 |
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
    "detail": "It leads on today's preferred slow pace."
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

> Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 2. Paddle-Tail Swimbait — `paddle_tail_swimbait`  _(strong_alternate)_

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
| score | 9.250 |
| tactical_fit | 9.000 |
| practicality_fit | -0.650 |
| forage_fit | 0.550 |
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
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": -0.65,
    "detail": "Its practicality holds up in river conditions."
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 3. Soft Plastic Jerkbait — `soft_jerkbait`  _(change_up)_

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
| score | 9.250 |
| tactical_fit | 9.000 |
| practicality_fit | -0.650 |
| forage_fit | 0.550 |
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
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": -0.65,
    "detail": "Its practicality holds up in river conditions."
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

> Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Slow down and lengthen the pause.

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
| score | 14.850 |
| tactical_fit | 12.000 |
| practicality_fit | 1.950 |
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
    "value": 1.95,
    "detail": "Its practicality holds up in river conditions."
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

> This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold.

**How to fish** _(verbatim — audit for technique correctness)_

> Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 2. Muddler Minnow — `muddler_sculpin`  _(strong_alternate)_

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
| score | 12.900 |
| tactical_fit | 10.500 |
| practicality_fit | 0.850 |
| forage_fit | 0.550 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.800 |

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
    "value": 0.85,
    "detail": "Its practicality holds up in river conditions."
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Sink and crawl it along bottom with rod-tip leads so the deer hair pushes water, or swing it through soft seams on a tight line. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 3. Slim Baitfish Streamer — `slim_minnow_streamer`  _(change_up)_

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
| score | 10.750 |
| tactical_fit | 10.500 |
| practicality_fit | -0.650 |
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
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": -0.65,
    "detail": "Its practicality holds up in river conditions."
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

> Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip. Slow down and lengthen the pause.

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
