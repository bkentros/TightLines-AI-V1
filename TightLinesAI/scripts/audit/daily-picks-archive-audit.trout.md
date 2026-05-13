# FinFindr Trout Daily-Picks Archive Audit
Generated: 2026-05-12T20:23:06.211Z

## Scope Summary

| Metric | Value |
| --- | --- |
| Archived weather scenarios | 57 |
| Expanded recommendation runs | 684 |
| Months | Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec |
| Regions | 7 |
| Fisheries | 7 |
| Water types | freshwater_river |
| Clarity split | clear:228, stained:228, dirty:228 |
| Goal split | all_purpose:342, big_fish:342 |
| Skipped weather scenarios | 0 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/daily-picks-archive-audit.trout.jsonl |

## Condition Bucket Coverage

| Bucket | Expanded runs |
| --- | --- |
| calm_low_light_surface | 36 |
| calm_bright_clear_subtle | 32 |
| breezy_windy_stained_reaction | 64 |
| dirty_vibration | 128 |
| cold_slow_or_front | 288 |
| warming_search | 96 |
| heat_limited_finesse | 120 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 180 |
| river_elevated_runoff_current | 324 |
| medium_confidence_archive | 684 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 2 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-09-20 -> 2025-09-21 | changed | 2.5 | 3.7 | wind_reaction|dirty_vibration|runoff_streamer|current_swing|open_water_search -> low_light_surface|dirty_vibration|runoff_streamer|current_swing |
| Au Sable / Upper Midwest trout river<br>2025-10-19 -> 2025-10-20 | changed | 3.7 | 0.5 | wind_reaction|dirty_vibration|runoff_streamer|current_swing|open_water_search -> dirty_vibration|runoff_streamer|current_swing |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 15 | WIND_NOT_ELEVATING_REACTION (14), BIG_FISH_NOT_FAVORING_UPSIDE (4) |
| calm_bright_clear_subtle | 5 | BIG_FISH_NOT_FAVORING_UPSIDE (3), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (2) |
| calm_low_light_surface | 4 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2), BIG_FISH_NOT_FAVORING_UPSIDE (2) |
| cold_slow_or_front | 16 | BIG_FISH_NOT_FAVORING_UPSIDE (6), WIND_NOT_ELEVATING_REACTION (6), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (4) |
| dirty_vibration | 16 | WIND_NOT_ELEVATING_REACTION (10), BIG_FISH_NOT_FAVORING_UPSIDE (8) |
| heat_limited_finesse | 5 | BIG_FISH_NOT_FAVORING_UPSIDE (5) |
| medium_confidence_archive | 85 | BIG_FISH_NOT_FAVORING_UPSIDE (44), WIND_NOT_ELEVATING_REACTION (37), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (8), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (2) |
| river_elevated_runoff_current | 51 | WIND_NOT_ELEVATING_REACTION (31), BIG_FISH_NOT_FAVORING_UPSIDE (25) |
| stable_pleasant_medium_confidence_archive | 29 | BIG_FISH_NOT_FAVORING_UPSIDE (15), WIND_NOT_ELEVATING_REACTION (9), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (4), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (1) |
| warming_search | 35 | WIND_NOT_ELEVATING_REACTION (22), BIG_FISH_NOT_FAVORING_UPSIDE (18), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (1) |

- BIG_FISH_NOT_FAVORING_UPSIDE: 44
- WIND_NOT_ELEVATING_REACTION: 37
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 8
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 2

- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Blade Bait (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Sculpin Streamer (fly); Feather Jig Leech (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Blade Bait (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Sculpin Streamer (fly); Feather Jig Leech (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Inline Spinner (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Bucktail Streamer (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Conehead Streamer (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Woolly Bugger (fly); Rabbit-Strip Leech (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Sculpin Streamer (fly); Feather Jig Leech (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Blade Bait (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Blade Bait (lure); Sculpin Streamer (fly); Feather Jig Leech (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Blade Bait (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Blade Bait (lure); Sculpin Streamer (fly); Feather Jig Leech (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Feather Jig Leech (fly); Clouser Minnow (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Bucktail Streamer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Conehead Streamer (fly); Rabbit-Strip Leech (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Sculpin Streamer (fly); Feather Jig Leech (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Zonker Streamer (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Drop-Shot Minnow (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-05-15__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-05-15__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Hair Jig (lure); Inline Spinner (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- ca_lower_sac_trout__2025-05-23__freshwater_river__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Casting Spoon (lure); Small Floating Trout Plug (lure); Woolly Bugger (fly); Zonker Streamer (fly)
- wa_skagit_trout__2025-06-14__freshwater_river__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Casting Spoon (lure); Small Floating Trout Plug (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- wa_skagit_trout__2025-06-14__freshwater_river__dirty__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Small Floating Trout Plug (lure); Jighead Marabou Leech (fly); Baitfish Slider Fly (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Woolly Bugger (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Sculpin Streamer (fly); Woolly Bugger (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Inline Spinner (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Conehead Streamer (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-06-21__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Hair Jig (lure); Inline Spinner (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- ar_white_river_trout__2025-06-28__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- mt_madison_trout__2025-07-19__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Hair Jig (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Baitfish Slider Fly (fly)
- mt_madison_trout__2025-07-19__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Casting Spoon (lure); Inline Spinner (lure); Sculpzilla (fly); Baitfish Slider Fly (fly)
- mt_madison_trout__2025-07-19__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Sculpzilla (fly); Baitfish Slider Fly (fly)
- ca_lower_sac_trout__2025-07-24__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Drop-Shot Minnow (lure); Ned Rig (lure); Unweighted Baitfish Streamer (fly); Articulated Baitfish Streamer (fly)
- wa_skagit_trout__2025-08-02__freshwater_river__clear__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Inline Spinner (lure); Small Floating Trout Plug (lure); Woolly Bugger (fly); Conehead Streamer (fly)
- wa_skagit_trout__2025-08-02__freshwater_river__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Casting Spoon (lure); Small Floating Trout Plug (lure); Baitfish Slider Fly (fly); Bucktail Streamer (fly)
- wa_skagit_trout__2025-08-02__freshwater_river__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Inline Spinner (lure); Small Floating Trout Plug (lure); Conehead Streamer (fly); Woolly Bugger (fly)
- ny_upper_delaware_trout__2025-08-12__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Drop-Shot Minnow (lure); Ned Rig (lure); Unweighted Baitfish Streamer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-08-14__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Mouse Fly (fly); Rabbit-Strip Leech (fly)
- mi_au_sable_trout__2025-08-14__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Hair Jig (lure); Inline Spinner (lure); Rabbit-Strip Leech (fly); Mouse Fly (fly)
- ca_lower_sac_trout__2025-08-16__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Suspending Jerkbait (lure); Unweighted Baitfish Streamer (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-08-21__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Drop-Shot Minnow (lure); Ned Rig (lure); Slim Baitfish Streamer (fly); Sculpzilla (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 58
- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 42
- ADJACENT_DAY_EXACT_REPEAT: 8

- mi_au_sable_trout__2025-10-20__freshwater_river__dirty__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Woolly Bugger (fly)
- mt_madison_trout__2025-11-11__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- ar_white_river_trout__2025-12-12__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Lead-Eye Leech (fly)
- ar_white_river_trout__2025-12-12__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Hair Jig (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- ny_upper_delaware_trout__2025-12-12__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- mi_au_sable_trout__2025-12-12__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Lead-Eye Leech (fly); Zonker Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Sculpin Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Blade Bait (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Sculpin Streamer (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Sculpin Streamer (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Conehead Streamer (fly); Articulated Dungeon Streamer (fly)
- wv_elk_river_trout__2025-03-26__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Muddler Minnow (fly); Conehead Streamer (fly)
- wv_elk_river_trout__2025-03-26__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-03-26__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- wv_elk_river_trout__2025-03-26__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Zonker Streamer (fly); Conehead Streamer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Conehead Streamer (fly); Jighead Marabou Leech (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Inline Spinner (lure); Conehead Streamer (fly); Bucktail Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Zonker Streamer (fly); Articulated Dungeon Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Inline Spinner (lure); Conehead Streamer (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-04-12__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Ned Rig (lure); Sculpin Streamer (fly); Jighead Marabou Leech (fly)
- ar_white_river_trout__2025-04-12__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Rabbit-Strip Leech (fly); Muddler Minnow (fly)
- ar_white_river_trout__2025-04-12__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Rabbit-Strip Leech (fly); Sculpin Streamer (fly)
- ny_upper_delaware_trout__2025-04-17__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Drop-Shot Minnow (lure); Zonker Streamer (fly); Muddler Minnow (fly)
- ny_upper_delaware_trout__2025-04-17__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-04-17__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- ny_upper_delaware_trout__2025-04-17__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- ca_lower_sac_trout__2025-04-27__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Ned Rig (lure); Sculpin Streamer (fly); Jighead Marabou Leech (fly)
- ca_lower_sac_trout__2025-04-27__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Inline Spinner (lure); Sculpin Streamer (fly); Jighead Marabou Leech (fly)
- ca_lower_sac_trout__2025-04-27__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Inline Spinner (lure); Rabbit-Strip Leech (fly); Sculpin Streamer (fly)
- mt_madison_trout__2025-05-06__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- mt_madison_trout__2025-05-06__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Conehead Streamer (fly); Articulated Baitfish Streamer (fly)
- mt_madison_trout__2025-05-06__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Ned Rig (lure); Jighead Marabou Leech (fly); Muddler Minnow (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Drop-Shot Minnow (lure); Jighead Marabou Leech (fly); Muddler Minnow (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Sculpin Streamer (fly); Rabbit-Strip Leech (fly)
- ny_upper_delaware_trout__2025-05-15__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Inline Spinner (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-05-15__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-05-15__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Inline Spinner (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- mi_au_sable_trout__2025-05-23__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Inline Spinner (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- mi_au_sable_trout__2025-05-23__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- mi_au_sable_trout__2025-05-23__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Zonker Streamer (fly)
- ny_upper_delaware_trout__2025-06-21__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Casting Spoon (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-06-28__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Small Floating Trout Plug (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- ca_lower_sac_trout__2025-07-24__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Inline Spinner (lure); Rabbit-Strip Leech (fly); Muddler Minnow (fly)
- ca_lower_sac_trout__2025-08-16__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Rabbit-Strip Leech (fly); Sculpin Streamer (fly)

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | northeast | cold_slow:1 |
| Jan | south_central | warming:1 |
| Feb | appalachian | cold_slow:1 |
| Feb | great_lakes_upper_midwest | cold_slow:1 |
| Mar | appalachian | cold_slow:1 |
| Mar | great_lakes_upper_midwest | warming:1 |
| Mar | northeast | warming:1 |
| Mar | south_central | cooling_or_shock:1 |
| Apr | appalachian | warming:1 |
| Apr | great_lakes_upper_midwest | warming:1 |
| Apr | northeast | cold_slow:1 |
| Apr | northern_california | cold_slow:1 |
| Apr | south_central | cold_slow:1 |
| May | great_lakes_upper_midwest | cold_slow:1 |
| May | mountain_west | cold_slow:1 |
| May | northeast | warming:1 |
| May | northern_california | cooling_or_shock:1 |
| May | pacific_northwest | cold_slow:1 |
| May | south_central | stable:1 |
| Jun | appalachian | stable:1 |
| Jun | mountain_west | stable:1 |
| Jun | northeast | stable:1 |
| Jun | northern_california | heat_limited:1 |
| Jun | pacific_northwest | stable:1 |
| Jun | south_central | stable:1 |
| Jul | great_lakes_upper_midwest | heat_limited:1 |
| Jul | mountain_west | stable:1 |
| Jul | northeast | heat_limited:1 |
| Jul | northern_california | heat_limited:1 |
| Jul | south_central | heat_limited:1 |
| Aug | great_lakes_upper_midwest | cooling_or_shock:1 |
| Aug | mountain_west | stable:1 |
| Aug | northeast | heat_limited:1 |
| Aug | northern_california | heat_limited:1 |
| Aug | pacific_northwest | cooling_or_shock:1 |
| Aug | south_central | heat_limited:1 |
| Sep | great_lakes_upper_midwest | cooling_or_shock:1, stable:1 |
| Sep | mountain_west | cold_slow:1 |
| Sep | northeast | stable:1 |
| Sep | northern_california | heat_limited:1 |
| Sep | pacific_northwest | cooling_or_shock:1 |
| Sep | south_central | heat_limited:1 |
| Oct | great_lakes_upper_midwest | stable:1, cooling_or_shock:1 |
| Oct | mountain_west | cold_slow:1 |
| Oct | northeast | warming:1 |
| Oct | northern_california | cold_slow:1 |
| Oct | pacific_northwest | cold_slow:1 |
| Oct | south_central | stable:1 |
| Nov | mountain_west | stable:1 |
| Nov | northeast | warming:1 |
| Nov | northern_california | stable:1 |
| Nov | pacific_northwest | stable:1 |
| Dec | great_lakes_upper_midwest | cold_slow:1 |
| Dec | northeast | cold_slow:1 |
| Dec | south_central | cold_slow:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

| Scenario | Temp | Top winners needing review |
| --- | --- | --- |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear all_purpose A | 59.5-87.5F | Conehead Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear all_purpose B | 59.5-87.5F | Inline Spinner (medium); Bucktail Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear big_fish A | 59.5-87.5F | Casting Spoon (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear big_fish B | 59.5-87.5F | Suspending Jerkbait (medium); Unweighted Baitfish Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained all_purpose A | 59.5-87.5F | Inline Spinner (medium); Zonker Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained all_purpose B | 59.5-87.5F | Suspending Jerkbait (medium); Conehead Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained big_fish A | 59.5-87.5F | Inline Spinner (medium); Conehead Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained big_fish B | 59.5-87.5F | Suspending Jerkbait (medium); Zonker Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 dirty all_purpose A | 59.5-87.5F | Inline Spinner (medium); Baitfish Slider Fly (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 dirty all_purpose B | 59.5-87.5F | Casting Spoon (medium); Zonker Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 dirty big_fish A | 59.5-87.5F | Casting Spoon (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 dirty big_fish B | 59.5-87.5F | Inline Spinner (medium); Bucktail Streamer (medium) |
| Upper Delaware trout river<br>2025-07-12 clear all_purpose B | 66.4-85.7F | Suspending Jerkbait (medium) |
| Upper Delaware trout river<br>2025-07-12 clear big_fish B | 66.4-85.7F | Suspending Jerkbait (medium) |
| Upper Delaware trout river<br>2025-07-12 stained all_purpose B | 66.4-85.7F | Inline Spinner (medium) |
| Upper Delaware trout river<br>2025-07-12 stained big_fish B | 66.4-85.7F | Suspending Jerkbait (medium); Articulated Baitfish Streamer (medium) |
| Upper Delaware trout river<br>2025-07-12 dirty all_purpose B | 66.4-85.7F | Suspending Jerkbait (medium); Conehead Streamer (medium) |
| Upper Delaware trout river<br>2025-07-12 dirty big_fish B | 66.4-85.7F | Inline Spinner (medium) |
| Au Sable / Upper Midwest trout river<br>2025-07-16 clear all_purpose A | 67.2-85.6F | Inline Spinner (medium) |
| Au Sable / Upper Midwest trout river<br>2025-07-16 clear all_purpose B | 67.2-85.6F | Suspending Jerkbait (medium); Zonker Streamer (medium) |

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Aug | great_lakes_upper_midwest | open | bright | big_fish | 5 | 56.3-78.6F | 3.1 |
| Aug | mountain_west | open | mixed | all_purpose | 1 | 43.3-76.4F | 3.3 |
| Aug | mountain_west | open | mixed | big_fish | 5 | 43.3-76.4F | 3.3 |
| Aug | pacific_northwest | open | mixed | all_purpose | 3 | 57.1-79.6F | 4.2 |
| Aug | pacific_northwest | open | mixed | big_fish | 6 | 57.1-79.6F | 4.2 |
| Jul | mountain_west | caution | mixed | big_fish | 3 | 47.8-73.0F | 6.7 |
| Jun | mountain_west | open | mixed | big_fish | 5 | 39.2-65.3F | 5.2 |
| Jun | northeast | open | mixed | big_fish | 3 | 58.2-80.4F | 4.4 |
| Jun | pacific_northwest | open | low_light | all_purpose | 2 | 51.5-63.4F | 3.8 |
| Jun | pacific_northwest | open | low_light | big_fish | 5 | 51.5-63.4F | 3.8 |
| Jun | south_central | open | low_light | all_purpose | 1 | 73.6-84.9F | 3.8 |
| Jun | south_central | open | low_light | big_fish | 3 | 73.6-84.9F | 3.8 |
| May | northern_california | open | glare | all_purpose | 1 | 56.1-85.7F | 3.7 |
| May | northern_california | open | glare | big_fish | 5 | 56.1-85.7F | 3.7 |
| May | south_central | open | low_light | all_purpose | 1 | 62.6-80.4F | 6.5 |
| May | south_central | open | low_light | big_fish | 3 | 62.6-80.4F | 6.5 |
| Sep | great_lakes_upper_midwest | open | low_light | all_purpose | 1 | 55.3-73.0F | 6.4 |
| Sep | great_lakes_upper_midwest | open | low_light | big_fish | 5 | 55.3-73.0F | 6.4 |
| Sep | mountain_west | open | bright | big_fish | 4 | 36.3-64.9F | 5 |
| Sep | northeast | open | mixed | all_purpose | 1 | 51.9-74.6F | 3.6 |
| Sep | northeast | open | mixed | big_fish | 5 | 51.9-74.6F | 3.6 |
| Sep | pacific_northwest | open | low_light | big_fish | 3 | 57.8-61.6F | 1.4 |

### Shoulder-Season Topwater Selections

None.

## Water Column Diversity Diagnostics

### Same-Side Surface/Surface Summary

None.

### Remaining Same-Side Surface/Surface Examples

None.

### Same-Side Column/Band Summary

| Side | Same exact column | Same broad band | Same broad band with close different-band alt |
| --- | --- | --- | --- |
| lure | 282 | 282 | 198 |
| fly | 204 | 204 | 187 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 156 | - |
| open-surface rows with 2+ surface picks | 15 | 15 |
| open-surface rows with 3+ surface picks | 0 | 0 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 0 | 0 |
| lure surface/surface plus fly surface/upper | 0 | 0 |

### Surface/Upper Watch Examples

None.

## Pike Cold/Open Surface Diagnostics

Not applicable.

## Pike Clear/Bright Diagnostics

Not applicable.

## Pike Heat-Limited Diagnostics

Not applicable.

## Set B Diagnostics

### Set B Overlap Cause Counts

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

| Kind | Cause | Lure | Fly | Total |
| --- | --- | --- | --- | --- |
| exact_id | unavoidable_due_score_band | 52 | 0 | 52 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 9 | 0 | 9 |
| exact_id | unavoidable_due_goal_condition_fit | 8 | 0 | 8 |
| same_family_same_presentation | truly_avoidable | 0 | 42 | 42 |
| same_family_same_presentation | unavoidable_due_score_band | 0 | 36 | 36 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 13 | 13 |
| same_family_same_presentation | unavoidable_due_goal_condition_fit | 0 | 1 | 1 |
| same_family_different_presentation | truly_avoidable | 0 | 58 | 58 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 39 | 39 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 5 | 5 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 11 | 11 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Upper Delaware trout river<br>2025-01-18 dirty big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (172); Rabbit-Strip Leech (190) | Sculpzilla (186); Articulated Baitfish Streamer (156) | Sculpin Streamer (196, alt edge 40) |
| Upper Delaware trout river<br>2025-01-18 stained big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (172); Rabbit-Strip Leech (190) | Sculpzilla (186); Articulated Baitfish Streamer (156) | Sculpin Streamer (196, alt edge 40) |
| Elk River Appalachian trout water<br>2025-02-20 dirty big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (172); Rabbit-Strip Leech (190) | Sculpzilla (186); Articulated Baitfish Streamer (156) | Sculpin Streamer (196, alt edge 40) |
| Upper Delaware trout river<br>2025-11-08 clear big_fish | fly honorable: same_family_different_presentation | Sculpzilla (180); Articulated Dungeon Streamer (166) | Rabbit-Strip Leech (156); Articulated Baitfish Streamer (158) | Feather Jig Leech (180, alt edge 22) |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish | fly honorable: same_family_different_presentation | Articulated Baitfish Streamer (174); Sculpzilla (180) | Rabbit-Strip Leech (156); Articulated Dungeon Streamer (166) | Feather Jig Leech (180, alt edge 14) |
| Upper Delaware trout river<br>2025-03-30 clear big_fish | fly honorable: same_family_different_presentation | Articulated Baitfish Streamer (174); Sculpzilla (180) | Rabbit-Strip Leech (156); Articulated Dungeon Streamer (166) | Feather Jig Leech (180, alt edge 14) |
| Upper Delaware trout river<br>2025-11-08 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (188); Articulated Dungeon Streamer (174) | Rabbit-Strip Leech (164); Articulated Baitfish Streamer (166) | Feather Jig Leech (180, alt edge 14) |
| Upper Delaware trout river<br>2025-11-08 stained big_fish | fly honorable: same_family_different_presentation | Sculpzilla (188); Articulated Dungeon Streamer (174) | Rabbit-Strip Leech (164); Articulated Baitfish Streamer (166) | Feather Jig Leech (180, alt edge 14) |
| Skagit River Pacific Northwest trout water<br>2025-10-12 clear big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (162); Articulated Dungeon Streamer (176) | Sculpzilla (170); Articulated Baitfish Streamer (168) | Sculpin Streamer (182, alt edge 14) |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose | fly top: same_family_same_presentation | Sculpin Streamer (204); Feather Jig Leech (192) | Lead-Eye Leech (182); Zonker Streamer (190) | Bucktail Streamer (190, alt edge 8) |
| Lower Sacramento northern California trout tailwater<br>2025-10-25 clear big_fish | fly honorable: same_family_different_presentation | Sculpzilla (170); Articulated Dungeon Streamer (176) | Rabbit-Strip Leech (162); Articulated Baitfish Streamer (168) | Woolly Bugger (176, alt edge 8) |
| Madison River mountain-west trout water<br>2025-09-27 dirty all_purpose | fly honorable: same_family_same_presentation | Woolly Bugger (178); Sculpin Streamer (168) | Rabbit-Strip Leech (168); Muddler Minnow (160) | Jighead Marabou Leech (168, alt edge 8) |
| White River Ozark trout tailwater<br>2025-01-16 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (188); Articulated Baitfish Streamer (182) | Rabbit-Strip Leech (164); Articulated Dungeon Streamer (174) | Feather Jig Leech (180, alt edge 6) |
| Lower Sacramento northern California trout tailwater<br>2025-11-08 clear big_fish | fly honorable: same_family_different_presentation | Sculpzilla (180); Articulated Dungeon Streamer (166) | Rabbit-Strip Leech (156); Articulated Baitfish Streamer (158) | Feather Jig Leech (164, alt edge 6) |
| Au Sable / Upper Midwest trout river<br>2025-05-23 clear big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (162); Articulated Baitfish Streamer (184) | Sculpzilla (170); Articulated Dungeon Streamer (176) | Sculpin Streamer (182, alt edge 6) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-03-18 clear | B | 3/4 | Suspending Jerkbait; Inline Spinner; Bucktail Streamer; Clouser Minnow | Suspending Jerkbait; Inline Spinner; Bucktail Streamer; Articulated Dungeon Streamer |
| White River Ozark trout tailwater<br>2025-03-18 stained | A | 3/4 | Casting Spoon; Inline Spinner; Conehead Streamer; Bucktail Streamer | Inline Spinner; Casting Spoon; Bucktail Streamer; Articulated Baitfish Streamer |
| Upper Delaware trout river<br>2025-08-12 dirty | B | 3/4 | Drop-Shot Minnow; Inline Spinner; Jighead Marabou Leech; Baitfish Slider Fly | Inline Spinner; Drop-Shot Minnow; Articulated Baitfish Streamer; Baitfish Slider Fly |
| Lower Sacramento northern California trout tailwater<br>2025-08-16 clear | B | 3/4 | Ned Rig; Suspending Jerkbait; Sculpin Streamer; Unweighted Baitfish Streamer | Ned Rig; Suspending Jerkbait; Unweighted Baitfish Streamer; Articulated Baitfish Streamer |
| Au Sable / Upper Midwest trout river<br>2025-09-20 stained | B | 3/4 | Suspending Jerkbait; Casting Spoon; Conehead Streamer; Bucktail Streamer | Suspending Jerkbait; Casting Spoon; Articulated Baitfish Streamer; Bucktail Streamer |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 stained B | lure | Inline Spinner; Hair Jig |
| White River Ozark trout tailwater<br>2025-01-16 dirty B | lure | Inline Spinner; Hair Jig |
| White River Ozark trout tailwater<br>2025-03-18 clear B | lure | Suspending Jerkbait; Inline Spinner |
| White River Ozark trout tailwater<br>2025-03-18 stained B | lure | Suspending Jerkbait; Inline Spinner |
| Upper Delaware trout river<br>2025-03-30 clear B | lure | Inline Spinner; Hair Jig |
| Upper Delaware trout river<br>2025-03-30 stained B | lure | Inline Spinner; Hair Jig |
| Upper Delaware trout river<br>2025-03-30 dirty B | lure | Inline Spinner; Hair Jig |
| Au Sable / Upper Midwest trout river<br>2025-03-28 clear B | lure | Suspending Jerkbait; Blade Bait |
| Au Sable / Upper Midwest trout river<br>2025-03-28 stained B | lure | Suspending Jerkbait; Blade Bait |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty B | lure | Suspending Jerkbait; Blade Bait |
| Elk River Appalachian trout water<br>2025-04-04 dirty B | lure | Inline Spinner; Hair Jig |
| Au Sable / Upper Midwest trout river<br>2025-04-24 clear B | lure | Inline Spinner; Hair Jig |
| Au Sable / Upper Midwest trout river<br>2025-04-24 stained B | lure | Suspending Jerkbait; Hair Jig |
| Au Sable / Upper Midwest trout river<br>2025-04-24 dirty B | lure | Blade Bait; Drop-Shot Minnow |
| Upper Delaware trout river<br>2025-05-15 stained B | lure | Hair Jig; Suspending Jerkbait |
| Upper Delaware trout river<br>2025-05-15 dirty B | lure | Hair Jig; Inline Spinner |
| White River Ozark trout tailwater<br>2025-05-18 clear B | lure | Inline Spinner; Hair Jig |
| White River Ozark trout tailwater<br>2025-05-18 stained B | lure | Inline Spinner; Hair Jig |
| Elk River Appalachian trout water<br>2025-06-17 clear B | lure | Suspending Jerkbait; Inline Spinner |
| Elk River Appalachian trout water<br>2025-06-17 dirty B | lure | Inline Spinner; Hair Jig |
| Upper Delaware trout river<br>2025-06-21 stained B | lure | Hair Jig; Inline Spinner |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear A | lure | Casting Spoon; Drop-Shot Minnow |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear B | lure | Suspending Jerkbait; Inline Spinner |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained A | lure | Inline Spinner; Casting Spoon |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained B | lure | Suspending Jerkbait; Ned Rig |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 dirty A | lure | Casting Spoon; Suspending Jerkbait |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 dirty B | lure | Inline Spinner; Casting Spoon |
| White River Ozark trout tailwater<br>2025-06-28 stained B | lure | Inline Spinner; Hair Jig |
| Upper Delaware trout river<br>2025-07-12 clear A | lure | Drop-Shot Minnow; Ned Rig |
| Upper Delaware trout river<br>2025-07-12 clear B | lure | Suspending Jerkbait; Casting Spoon |
| Upper Delaware trout river<br>2025-07-12 stained A | lure | Drop-Shot Minnow; Ned Rig |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Inline Spinner [lure] | 31 | Casting Spoon (16), Small Floating Trout Plug (11), Blade Bait (4) | 7 |
| Hair Jig [lure] | 27 | Casting Spoon (12), Small Floating Trout Plug (11), Blade Bait (4) | 16.5 |
| Suspending Jerkbait [lure] | 12 | Casting Spoon (10), Hair Jig (2) | 20 |
| Drop-Shot Minnow [lure] | 7 | Hair Jig (4), Casting Spoon (2), Suspending Jerkbait (1) | 8.3 |
| Ned Rig [lure] | 5 | Hair Jig (4), Suspending Jerkbait (1) | 18.8 |
| Blade Bait [lure] | 4 | Casting Spoon (4) | 19 |
| Casting Spoon [lure] | 2 | Small Floating Trout Plug (2) | -2 |

## Pike Big Fish Upside Split Diagnostics

Not applicable.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Sculpzilla (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -2) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (156; goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (166; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (178, alt edge 12) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (194; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Feather Jig Leech (192; condition_tag:warming_search:+16, condition_tag:current_swing:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (190, alt edge -4) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (174; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Sculpzilla (188; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -10) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (164; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (182; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -4) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (194; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Feather Jig Leech (192; condition_tag:warming_search:+16, condition_tag:current_swing:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (182, alt edge -12) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (164; goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (174; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (170, alt edge -4) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (146; goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (172, alt edge 4) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Woolly Bugger (162; goal:all_purpose:reliable_action:+18); Rabbit-Strip Leech (152; goal:all_purpose:reliable_action:+18) | Bucktail Streamer (176, alt edge 14) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (194; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Feather Jig Leech (192; condition_tag:warming_search:+16, condition_tag:current_swing:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (190, alt edge -4) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Sculpzilla (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -2) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (156; goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (166; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (178, alt edge 12) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (194; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Feather Jig Leech (192; condition_tag:warming_search:+16, condition_tag:current_swing:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (190, alt edge -4) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (174; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Sculpzilla (188; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -10) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (164; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (182; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -4) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (194; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Feather Jig Leech (192; condition_tag:warming_search:+16, condition_tag:current_swing:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (182, alt edge -12) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (164; goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (174; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (170, alt edge -4) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Feather Jig Leech (162; condition_tag:warming_search:+16, goal:all_purpose:versatile_search:+12); Clouser Minnow (156; condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (174, alt edge 12) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (158; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (156; goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (162, alt edge 4) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (164; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (162, alt edge -4) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (156; goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (158; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (162, alt edge 4) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (184; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Sculpzilla (170; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (188, alt edge 4) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (184; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Feather Jig Leech (182; condition_tag:warming_search:+16, condition_tag:current_swing:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (200, alt edge 16) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (178; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (184; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (188, alt edge 4) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-06-17 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (184; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Woolly Bugger (178; condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18) | Bucktail Streamer (200, alt edge 16) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| current_open_water_acceptable | 24 |
| clear_subtle_wind_watch | 13 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-01-16 big_fish clear A | warming_search<br>neutral | Suspending Jerkbait 174<br>Casting Spoon 174 |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-01-16 big_fish clear B | warming_search<br>neutral | Inline Spinner 178<br>Blade Bait 164 |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-03-18 big_fish clear A | cold_slow_or_front<br>active | Casting Spoon 184<br>Inline Spinner 172 |
| clear_subtle_wind_watch | Upper Delaware trout river<br>2025-03-30 all_purpose clear A | warming_search<br>active | Inline Spinner 208<br>Casting Spoon 174 |
| clear_subtle_wind_watch | Upper Delaware trout river<br>2025-03-30 big_fish clear A | warming_search<br>active | Casting Spoon 174<br>Blade Bait 164 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 all_purpose stained A | breezy_windy_stained_reaction<br>neutral | Inline Spinner 208<br>Casting Spoon 174 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Casting Spoon 174<br>Blade Bait 164 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Inline Spinner 178<br>Hair Jig 158 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 all_purpose dirty A | dirty_vibration<br>neutral | Inline Spinner 200<br>Hair Jig 168 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 big_fish dirty B | dirty_vibration<br>neutral | Inline Spinner 170<br>Hair Jig 150 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 301 |
| acceptable_fit | 891 |
| strong_fit | 1544 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | B | fly | medium_confidence_archive | 78 |
| watch | big_fish | A | fly | medium_confidence_archive | 57 |
| watch | big_fish | B | lure | medium_confidence_archive | 47 |
| watch | all_purpose | A | lure | medium_confidence_archive | 42 |
| watch | big_fish | B | fly | cold_slow_or_front | 38 |
| watch | big_fish | A | lure | medium_confidence_archive | 32 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 29 |
| watch | big_fish | A | fly | cold_slow_or_front | 27 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 22 |
| watch | all_purpose | A | lure | river_elevated_runoff_current | 18 |
| watch | all_purpose | B | lure | medium_confidence_archive | 18 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 18 |
| watch | big_fish | B | fly | dirty_vibration | 17 |
| watch | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 17 |
| watch | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 17 |
| watch | all_purpose | A | fly | medium_confidence_archive | 16 |
| watch | all_purpose | A | lure | heat_limited_finesse | 16 |
| watch | big_fish | B | fly | warming_search | 15 |
| watch | big_fish | A | fly | heat_limited_finesse | 14 |
| watch | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 13 |
| watch | big_fish | B | lure | warming_search | 13 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 12 |
| watch | all_purpose | A | lure | cold_slow_or_front | 11 |
| watch | all_purpose | B | fly | medium_confidence_archive | 11 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 11 |
| watch | all_purpose | B | lure | heat_limited_finesse | 10 |
| watch | big_fish | A | fly | dirty_vibration | 10 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 10 |
| watch | big_fish | B | lure | cold_slow_or_front | 9 |
| watch | big_fish | A | lure | cold_slow_or_front | 8 |
| watch | big_fish | B | fly | heat_limited_finesse | 8 |
| watch | big_fish | B | lure | heat_limited_finesse | 8 |
| watch | big_fish | A | lure | dirty_vibration | 7 |
| watch | all_purpose | A | fly | heat_limited_finesse | 6 |
| watch | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 6 |
| watch | all_purpose | A | lure | dirty_vibration | 6 |
| watch | big_fish | A | fly | warming_search | 6 |
| watch | big_fish | A | lure | warming_search | 6 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 6 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 5 |
| watch | all_purpose | B | fly | heat_limited_finesse | 5 |
| watch | big_fish | A | lure | calm_low_light_surface | 5 |
| watch | big_fish | B | fly | calm_low_light_surface | 5 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 4 |
| watch | all_purpose | B | lure | cold_slow_or_front | 4 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 4 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 4 |
| watch | big_fish | B | fly | calm_bright_clear_subtle | 4 |
| watch | all_purpose | A | fly | cold_slow_or_front | 3 |
| watch | all_purpose | A | lure | calm_low_light_surface | 3 |
| watch | all_purpose | B | lure | dirty_vibration | 3 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 3 |
| watch | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 3 |
| watch | all_purpose | A | fly | dirty_vibration | 2 |
| watch | all_purpose | A | lure | warming_search | 2 |
| watch | all_purpose | B | fly | calm_bright_clear_subtle | 2 |
| watch | big_fish | B | lure | dirty_vibration | 2 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 1 |
| watch | all_purpose | A | fly | calm_low_light_surface | 1 |
| watch | all_purpose | A | fly | warming_search | 1 |
| watch | all_purpose | A | lure | calm_bright_clear_subtle | 1 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 1 |
| watch | all_purpose | B | fly | calm_low_light_surface | 1 |
| watch | all_purpose | B | fly | cold_slow_or_front | 1 |
| watch | all_purpose | B | fly | dirty_vibration | 1 |
| watch | all_purpose | B | fly | warming_search | 1 |
| watch | all_purpose | B | lure | calm_low_light_surface | 1 |
| watch | all_purpose | B | lure | warming_search | 1 |
| watch | big_fish | A | fly | calm_low_light_surface | 1 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 1 |
| watch | big_fish | B | lure | calm_low_light_surface | 1 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 187 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 152 |
| acceptable_fit | big_fish | A | lure | medium_confidence_archive | 114 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 111 |
| acceptable_fit | big_fish | B | lure | river_elevated_runoff_current | 96 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 93 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 93 |
| acceptable_fit | all_purpose | A | fly | medium_confidence_archive | 88 |
| acceptable_fit | big_fish | A | lure | heat_limited_finesse | 55 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 8 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 11 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-05-23 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Madison River mountain-west trout water<br>2025-05-06 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 clear all_purpose A | Inline Spinner (honorable_lure, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 stained all_purpose A | Inline Spinner (honorable_lure, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-04-04 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-05-23 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-05-23 stained all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Madison River mountain-west trout water<br>2025-05-06 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Madison River mountain-west trout water<br>2025-05-06 stained all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 clear all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 stained all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 stained all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-04-04 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-04-04 dirty all_purpose B | Inline Spinner (honorable_lure, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose A | Inline Spinner (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-03-30 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 768 | 370 | 48% |
| clear_subtle | 496 | 254 | 51% |
| dirty_vibration | 1024 | 0 | 0% |
| heat_finesse | 480 | 104 | 22% |
| cold_slow | 816 | 576 | 71% |
| low_light_surface | 240 | 28 | 12% |
| calm_surface | 528 | 72 | 14% |
| Trout dirty/runoff/current fit | 1456 | 1302 | 89% |
| Big Fish upside | 1368 | 961 | 70% |
| All Purpose reliable/versatile | 1368 | 1357 | 99% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Suspending Jerkbait [lure] (270), Hair Jig [lure] (265), Inline Spinner [lure] (255), Casting Spoon [lure] (190), Rabbit-Strip Leech [fly] (166), Articulated Baitfish Streamer [fly] (162), Sculpzilla [fly] (141), Woolly Bugger [fly] (135), Sculpin Streamer [fly] (131), Articulated Dungeon Streamer [fly] (128), Blade Bait [lure] (119), Drop-Shot Minnow [lure] (114) |
| All-purpose | Inline Spinner [lure] (161), Suspending Jerkbait [lure] (158), Hair Jig [lure] (133), Woolly Bugger [fly] (130), Sculpin Streamer [fly] (117), Jighead Marabou Leech [fly] (91), Casting Spoon [lure] (71), Drop-Shot Minnow [lure] (59) |
| Big-fish | Articulated Baitfish Streamer [fly] (155), Rabbit-Strip Leech [fly] (151), Sculpzilla [fly] (141), Hair Jig [lure] (132), Articulated Dungeon Streamer [fly] (128), Casting Spoon [lure] (119), Suspending Jerkbait [lure] (112), Inline Spinner [lure] (94) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 8 | 8 | 0 | 0 | 6 |
| fly | 19 | 19 | 0 | 0 | 0 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 270/684 | 39.5% | all_purpose:158, big_fish:112 | B:158, A:112 | top:143, honorable:127 | clear:105, stained:87, dirty:78 | freshwater_river:270 | current_swing:109, runoff_streamer:109, cold_slow:99, dirty_vibration:85 |
| Hair Jig<br>hair_jig | lure | 265/684 | 38.7% | all_purpose:133, big_fish:132 | A:157, B:108 | honorable:136, top:129 | clear:102, stained:89, dirty:74 | freshwater_river:265 | current_swing:151, runoff_streamer:151, cold_slow:109, dirty_vibration:108 |
| Inline Spinner<br>inline_spinner | lure | 255/684 | 37.3% | all_purpose:161, big_fish:94 | B:142, A:113 | top:164, honorable:91 | dirty:95, stained:88, clear:72 | freshwater_river:255 | current_swing:147, runoff_streamer:147, dirty_vibration:120, wind_reaction:99 |
| Casting Spoon<br>casting_spoon | lure | 190/684 | 27.8% | big_fish:119, all_purpose:71 | B:104, A:86 | honorable:121, top:69 | stained:73, dirty:68, clear:49 | freshwater_river:190 | current_swing:115, runoff_streamer:115, dirty_vibration:104, wind_reaction:91 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 166/684 | 24.3% | big_fish:151, all_purpose:15 | A:103, B:63 | top:94, honorable:72 | dirty:60, stained:55, clear:51 | freshwater_river:166 | current_swing:62, runoff_streamer:62, cold_slow:58, dirty_vibration:51 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 162/684 | 23.7% | big_fish:155, all_purpose:7 | B:96, A:66 | honorable:83, top:79 | stained:60, dirty:55, clear:47 | freshwater_river:162 | current_swing:74, runoff_streamer:74, dirty_vibration:59, wind_reaction:45 |
| Sculpzilla<br>sculpzilla | fly | 141/684 | 20.6% | big_fish:141 | A:75, B:66 | top:75, honorable:66 | dirty:52, stained:51, clear:38 | freshwater_river:141 | current_swing:80, runoff_streamer:80, dirty_vibration:54, cold_slow:39 |
| Woolly Bugger<br>woolly_bugger | fly | 135/684 | 19.7% | all_purpose:130, big_fish:5 | A:97, B:38 | honorable:85, top:50 | clear:46, dirty:45, stained:44 | freshwater_river:135 | current_swing:64, runoff_streamer:64, dirty_vibration:52, cold_slow:47 |
| Sculpin Streamer<br>sculpin_streamer | fly | 131/684 | 19.2% | all_purpose:117, big_fish:14 | A:98, B:33 | top:94, honorable:37 | clear:46, dirty:45, stained:40 | freshwater_river:131 | current_swing:87, runoff_streamer:87, dirty_vibration:63, cold_slow:62 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 128/552 | 23.2% | big_fish:128 | A:77, B:51 | honorable:79, top:49 | stained:45, dirty:44, clear:39 | freshwater_river:128 | current_swing:75, runoff_streamer:75, dirty_vibration:58, cold_slow:46 |
| Blade Bait<br>blade_bait | lure | 119/324 | 36.7% | big_fish:69, all_purpose:50 | B:66, A:53 | honorable:71, top:48 | dirty:47, stained:38, clear:34 | freshwater_river:119 | current_swing:73, runoff_streamer:73, cold_slow:67, dirty_vibration:61 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 114/528 | 21.6% | all_purpose:59, big_fish:55 | A:75, B:39 | honorable:59, top:55 | clear:46, dirty:38, stained:30 | freshwater_river:114 | heat_finesse:64, clear_subtle:38, calm_surface:28, current_swing:16 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 92/684 | 13.5% | all_purpose:91, big_fish:1 | B:57, A:35 | top:50, honorable:42 | dirty:36, clear:28, stained:28 | freshwater_river:92 | cold_slow:43, current_swing:43, runoff_streamer:43, dirty_vibration:34 |
| Ned Rig<br>ned_rig | lure | 89/684 | 13% | big_fish:48, all_purpose:41 | B:47, A:42 | honorable:58, top:31 | dirty:33, clear:30, stained:26 | freshwater_river:89 | cold_slow:40, heat_finesse:40, clear_subtle:21, current_swing:16 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 66/192 | 34.4% | big_fish:55, all_purpose:11 | A:46, B:20 | top:45, honorable:21 | stained:25, dirty:23, clear:18 | freshwater_river:66 | calm_surface:55, low_light_surface:22, current_swing:21, runoff_streamer:21 |
| Conehead Streamer<br>conehead_streamer | fly | 59/684 | 8.6% | all_purpose:50, big_fish:9 | B:44, A:15 | top:30, honorable:29 | stained:24, dirty:23, clear:12 | freshwater_river:59 | open_water_search:40, wind_reaction:40, dirty_vibration:36, current_swing:35 |
| Zonker Streamer<br>zonker_streamer | fly | 57/684 | 8.3% | all_purpose:49, big_fish:8 | B:45, A:12 | top:33, honorable:24 | dirty:23, stained:19, clear:15 | freshwater_river:57 | current_swing:38, runoff_streamer:38, dirty_vibration:34, open_water_search:34 |
| Muddler Minnow<br>muddler_sculpin | fly | 53/684 | 7.7% | all_purpose:49, big_fish:4 | B:45, A:8 | honorable:35, top:18 | clear:26, stained:17, dirty:10 | freshwater_river:53 | cold_slow:34, current_swing:26, runoff_streamer:26, dirty_vibration:18 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 49/684 | 7.2% | all_purpose:40, big_fish:9 | B:31, A:18 | top:25, honorable:24 | stained:21, clear:14, dirty:14 | freshwater_river:49 | open_water_search:25, wind_reaction:25, current_swing:21, dirty_vibration:21 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 37/684 | 5.4% | all_purpose:34, big_fish:3 | A:23, B:14 | top:28, honorable:9 | clear:29, dirty:4, stained:4 | freshwater_river:37 | clear_subtle:25, cold_slow:17, wind_reaction:9, calm_surface:6 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 36/312 | 11.5% | all_purpose:19, big_fish:17 | B:32, A:4 | honorable:28, top:8 | dirty:21, stained:11, clear:4 | freshwater_river:36 | heat_finesse:24, calm_surface:8, none:4, dirty_vibration:2 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 30/528 | 5.7% | all_purpose:19, big_fish:11 | B:21, A:9 | top:16, honorable:14 | clear:27, dirty:2, stained:1 | freshwater_river:30 | clear_subtle:26, calm_surface:12, heat_finesse:10, current_swing:7 |
| Feather Jig Leech<br>feather_jig_leech | fly | 26/684 | 3.8% | all_purpose:26 | A:19, B:7 | honorable:16, top:10 | stained:11, dirty:9, clear:6 | freshwater_river:26 | current_swing:18, runoff_streamer:18, warming_search:18, dirty_vibration:16 |
| Clouser Minnow<br>clouser_minnow | fly | 25/684 | 3.7% | all_purpose:25 | B:15, A:10 | honorable:17, top:8 | stained:11, clear:8, dirty:6 | freshwater_river:25 | heat_finesse:8, calm_surface:7, current_swing:5, runoff_streamer:5 |
| Mouse Fly<br>mouse_fly | fly | 20/108 | 18.5% | big_fish:20 | A:12, B:8 | honorable:13, top:7 | clear:7, stained:7, dirty:6 | freshwater_river:20 | calm_surface:17, current_swing:9, runoff_streamer:9, dirty_vibration:6 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 18/528 | 3.4% | all_purpose:10, big_fish:8 | B:15, A:3 | honorable:10, top:8 | clear:12, stained:6 | freshwater_river:18 | clear_subtle:12, calm_surface:8, heat_finesse:7, low_light_surface:2 |
| Crawfish Streamer<br>crawfish_streamer | fly | 3/84 | 3.6% | all_purpose:3 | B:3 | top:2, honorable:1 | clear:1, dirty:1, stained:1 | freshwater_river:3 | none:2, clear_subtle:1 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 270/2736 (9.9%) | 143/1368 (10.5%) | 127/1368 (9.3%) | 270/1368 (19.7%) | - |  |
| Hair Jig<br>hair_jig | lure | 265/2736 (9.7%) | 129/1368 (9.4%) | 136/1368 (9.9%) | 265/1368 (19.4%) | - |  |
| Inline Spinner<br>inline_spinner | lure | 255/2736 (9.3%) | 164/1368 (12%) | 91/1368 (6.7%) | 255/1368 (18.6%) | - |  |
| Casting Spoon<br>casting_spoon | lure | 190/2736 (6.9%) | 69/1368 (5%) | 121/1368 (8.8%) | 190/1368 (13.9%) | - |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 166/2736 (6.1%) | 94/1368 (6.9%) | 72/1368 (5.3%) | - | 166/1368 (12.1%) |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 162/2736 (5.9%) | 79/1368 (5.8%) | 83/1368 (6.1%) | - | 162/1368 (11.8%) |  |
| Sculpzilla<br>sculpzilla | fly | 141/2736 (5.2%) | 75/1368 (5.5%) | 66/1368 (4.8%) | - | 141/1368 (10.3%) |  |
| Woolly Bugger<br>woolly_bugger | fly | 135/2736 (4.9%) | 50/1368 (3.7%) | 85/1368 (6.2%) | - | 135/1368 (9.9%) |  |
| Sculpin Streamer<br>sculpin_streamer | fly | 131/2736 (4.8%) | 94/1368 (6.9%) | 37/1368 (2.7%) | - | 131/1368 (9.6%) |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 128/2736 (4.7%) | 49/1368 (3.6%) | 79/1368 (5.8%) | - | 128/1368 (9.4%) |  |
| Blade Bait<br>blade_bait | lure | 119/2736 (4.3%) | 48/1368 (3.5%) | 71/1368 (5.2%) | 119/1368 (8.7%) | - |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 114/2736 (4.2%) | 55/1368 (4%) | 59/1368 (4.3%) | 114/1368 (8.3%) | - |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 92/2736 (3.4%) | 50/1368 (3.7%) | 42/1368 (3.1%) | - | 92/1368 (6.7%) |  |
| Ned Rig<br>ned_rig | lure | 89/2736 (3.3%) | 31/1368 (2.3%) | 58/1368 (4.2%) | 89/1368 (6.5%) | - |  |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 66/2736 (2.4%) | 45/1368 (3.3%) | 21/1368 (1.5%) | 66/1368 (4.8%) | - |  |
| Conehead Streamer<br>conehead_streamer | fly | 59/2736 (2.2%) | 30/1368 (2.2%) | 29/1368 (2.1%) | - | 59/1368 (4.3%) |  |
| Zonker Streamer<br>zonker_streamer | fly | 57/2736 (2.1%) | 33/1368 (2.4%) | 24/1368 (1.8%) | - | 57/1368 (4.2%) |  |
| Muddler Minnow<br>muddler_sculpin | fly | 53/2736 (1.9%) | 18/1368 (1.3%) | 35/1368 (2.6%) | - | 53/1368 (3.9%) |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 49/2736 (1.8%) | 25/1368 (1.8%) | 24/1368 (1.8%) | - | 49/1368 (3.6%) |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 37/2736 (1.4%) | 28/1368 (2%) | 9/1368 (0.7%) | - | 37/1368 (2.7%) |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 36/2736 (1.3%) | 8/1368 (0.6%) | 28/1368 (2%) | - | 36/1368 (2.6%) |  |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 30/2736 (1.1%) | 16/1368 (1.2%) | 14/1368 (1%) | - | 30/1368 (2.2%) |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 26/2736 (1%) | 10/1368 (0.7%) | 16/1368 (1.2%) | - | 26/1368 (1.9%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 25/2736 (0.9%) | 8/1368 (0.6%) | 17/1368 (1.2%) | - | 25/1368 (1.8%) |  |
| Mouse Fly<br>mouse_fly | fly | 20/2736 (0.7%) | 7/1368 (0.5%) | 13/1368 (1%) | - | 20/1368 (1.5%) |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 18/2736 (0.7%) | 8/1368 (0.6%) | 10/1368 (0.7%) | - | 18/1368 (1.3%) |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 3/2736 (0.1%) | 2/1368 (0.1%) | 1/1368 (0.1%) | - | 3/1368 (0.2%) |  |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 270/684 | 39.5% | all_purpose:158, big_fish:112 | current_swing:109, runoff_streamer:109, cold_slow:99, dirty_vibration:85, wind_reaction:79 |
| Hair Jig<br>hair_jig | lure | 265/684 | 38.7% | all_purpose:133, big_fish:132 | current_swing:151, runoff_streamer:151, cold_slow:109, dirty_vibration:108, clear_subtle:66 |
| Inline Spinner<br>inline_spinner | lure | 255/684 | 37.3% | all_purpose:161, big_fish:94 | current_swing:147, runoff_streamer:147, dirty_vibration:120, wind_reaction:99, open_water_search:93 |
| Blade Bait<br>blade_bait | lure | 119/324 | 36.7% | big_fish:69, all_purpose:50 | current_swing:73, runoff_streamer:73, cold_slow:67, dirty_vibration:61, wind_reaction:46 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 66/192 | 34.4% | big_fish:55, all_purpose:11 | calm_surface:55, low_light_surface:22, current_swing:21, runoff_streamer:21, dirty_vibration:13 |
| Casting Spoon<br>casting_spoon | lure | 190/684 | 27.8% | big_fish:119, all_purpose:71 | current_swing:115, runoff_streamer:115, dirty_vibration:104, wind_reaction:91, open_water_search:79 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Inline Spinner<br>inline_spinner | lure | home-window >30% severe | 170/384 | 44.3% | selector_filtering_variety_jitter:99 | AP/BF 100/192, 70/192<br>clarity clear:128, dirty:128, stained:128<br>bucket dirty_vibration:112, cold_slow_or_front:80, breezy_windy_stained_reaction:60 |
| Hair Jig<br>hair_jig | lure | home-window >30% severe | 241/576 | 41.8% | goal_tags:141 | AP/BF 119/288, 122/288<br>clarity clear:216, stained:184, dirty:176<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:100 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | home-window >30% severe | 50/120 | 41.7% | goal_tags:51 | AP/BF 9/60, 41/60<br>clarity clear:40, dirty:40, stained:40<br>bucket stable_pleasant_medium_confidence_archive:52, calm_low_light_surface:36, cold_slow_or_front:16 |
| Blade Bait<br>blade_bait | lure | home-window >30% severe | 104/268 | 38.8% | daily_condition_tags:65 | AP/BF 42/134, 62/134<br>clarity clear:100, dirty:84, stained:84<br>bucket cold_slow_or_front:108, dirty_vibration:68, breezy_windy_stained_reaction:36 |
| Casting Spoon<br>casting_spoon | lure | home-window >30% severe | 144/384 | 37.5% | goal_tags:150 | AP/BF 49/192, 95/192<br>clarity clear:128, dirty:128, stained:128<br>bucket dirty_vibration:112, cold_slow_or_front:80, breezy_windy_stained_reaction:60 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | home-window >30% severe | 143/384 | 37.2% | daily_condition_tags:143 | AP/BF 85/192, 58/192<br>clarity clear:128, dirty:128, stained:128<br>bucket dirty_vibration:112, cold_slow_or_front:80, breezy_windy_stained_reaction:60 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | home-window >25% overdominant | 110/420 | 26.2% | goal_tags:186 | AP/BF 0/186, 110/234<br>clarity clear:140, dirty:140, stained:140<br>bucket dirty_vibration:108, cold_slow_or_front:86, stable_pleasant_medium_confidence_archive:64 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | home-window >25% overdominant | 114/444 | 25.7% | goal_tags:181 | AP/BF 2/198, 112/246<br>clarity clear:148, dirty:148, stained:148<br>bucket dirty_vibration:116, cold_slow_or_front:90, stable_pleasant_medium_confidence_archive:64 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | home-window >20% watch | 134/568 | 23.6% | daily_condition_tags:259 | AP/BF 11/284, 123/284<br>clarity clear:224, stained:192, dirty:152<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:68 |
| Sculpzilla<br>sculpzilla | fly | home-window >20% watch | 104/444 | 23.4% | goal_tags:229 | AP/BF 0/198, 104/246<br>clarity clear:148, dirty:148, stained:148<br>bucket dirty_vibration:116, cold_slow_or_front:90, stable_pleasant_medium_confidence_archive:64 |
| Sculpin Streamer<br>sculpin_streamer | fly | home-window >20% watch | 124/576 | 21.5% | goal_tags:208 | AP/BF 110/288, 14/288<br>clarity clear:216, stained:184, dirty:176<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:100 |
| Woolly Bugger<br>woolly_bugger | fly | home-window >20% watch | 114/568 | 20.1% | goal_tags:227 | AP/BF 109/284, 5/284<br>clarity clear:224, stained:192, dirty:152<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:68 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Inline Spinner<br>inline_spinner | lure | 255/2736 (9.3%) | 164/1368 (12%) | 91/1368 (6.7%) | 255/1368 (18.6%) | 170/384 (44.3%) | 111/384 (28.9%) / 59/384 (15.4%) | home>20%<br>home>25%<br>home>30% |
| Hair Jig<br>hair_jig | lure | 265/2736 (9.7%) | 129/1368 (9.4%) | 136/1368 (9.9%) | 265/1368 (19.4%) | 241/576 (41.8%) | 126/576 (21.9%) / 115/576 (20%) | home>20%<br>home>25%<br>home>30% |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 66/2736 (2.4%) | 45/1368 (3.3%) | 21/1368 (1.5%) | 66/1368 (4.8%) | 50/120 (41.7%) | 37/120 (30.8%) / 13/120 (10.8%) | home>20%<br>home>25%<br>home>30% |
| Blade Bait<br>blade_bait | lure | 119/2736 (4.3%) | 48/1368 (3.5%) | 71/1368 (5.2%) | 119/1368 (8.7%) | 104/268 (38.8%) | 45/268 (16.8%) / 59/268 (22%) | home>20%<br>home>25%<br>home>30% |
| Casting Spoon<br>casting_spoon | lure | 190/2736 (6.9%) | 69/1368 (5%) | 121/1368 (8.8%) | 190/1368 (13.9%) | 144/384 (37.5%) | 52/384 (13.5%) / 92/384 (24%) | home>20%<br>home>25%<br>home>30% |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 270/2736 (9.9%) | 143/1368 (10.5%) | 127/1368 (9.3%) | 270/1368 (19.7%) | 143/384 (37.2%) | 73/384 (19%) / 70/384 (18.2%) | home>20%<br>home>25%<br>home>30% |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 114/2736 (4.2%) | 55/1368 (4%) | 59/1368 (4.3%) | 114/1368 (8.3%) | 30/84 (35.7%) | 13/84 (15.5%) / 17/84 (20.2%) | home>20%<br>home>25%<br>home>30% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 128/2736 (4.7%) | 49/1368 (3.6%) | 79/1368 (5.8%) | 128/1368 (9.4%) | 110/420 (26.2%) | 41/420 (9.8%) / 69/420 (16.4%) | home>20%<br>home>25% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 162/2736 (5.9%) | 79/1368 (5.8%) | 83/1368 (6.1%) | 162/1368 (11.8%) | 114/444 (25.7%) | 50/444 (11.3%) / 64/444 (14.4%) | home>20%<br>home>25% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 166/2736 (6.1%) | 94/1368 (6.9%) | 72/1368 (5.3%) | 166/1368 (12.1%) | 134/568 (23.6%) | 79/568 (13.9%) / 55/568 (9.7%) | home>20% |
| Sculpzilla<br>sculpzilla | fly | 141/2736 (5.2%) | 75/1368 (5.5%) | 66/1368 (4.8%) | 141/1368 (10.3%) | 104/444 (23.4%) | 64/444 (14.4%) / 40/444 (9%) | home>20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 131/2736 (4.8%) | 94/1368 (6.9%) | 37/1368 (2.7%) | 131/1368 (9.6%) | 124/576 (21.5%) | 92/576 (16%) / 32/576 (5.6%) | home>20% |
| Woolly Bugger<br>woolly_bugger | fly | 135/2736 (4.9%) | 50/1368 (3.7%) | 85/1368 (6.2%) | 135/1368 (9.9%) | 114/568 (20.1%) | 37/568 (6.5%) / 77/568 (13.6%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.65.
Average expanded finalist pool size: 3.43.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 1015.
Rows/slots with expanded finalist pool size 1: 625.
Selected-tier singleton slots expanded above 1: 390.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 3.06 | 4.19 | 1 | 1 | 201 | 101 |
| fly/top | 3.62 | 4.56 | 1 | 1 | 157 | 78 |
| lure/honorable | 1.98 | 2.64 | 1 | 1 | 317 | 197 |
| lure/top | 1.93 | 2.36 | 1 | 1 | 340 | 249 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1606 |
| goal_or_priority_condition | 985 |
| credible_fallback | 137 |
| daily_lane_specialist | 8 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_and_priority_condition | 1606 |
| goal_or_priority_condition | 1604 |
| credible_fallback | 292 |
| daily_lane_specialist | 64 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 306 |
| family_diversity_scarcity | 284 |
| surface_safety_scarcity | 35 |

Representative expanded singleton finalist pools:
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__A lure/top: inline_spinner (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B lure/honorable: suspending_jerkbait (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B lure/top: inline_spinner (goal_or_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B lure/honorable: hair_jig (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__A lure/top: inline_spinner (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B lure/top: inline_spinner (goal_or_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B lure/honorable: hair_jig (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__B fly/top: jighead_marabou_leech (goal_or_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B lure/honorable: inline_spinner (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/top: muddler_sculpin (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__B fly/honorable: woolly_bugger (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B lure/top: ned_rig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B fly/top: woolly_bugger (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B fly/honorable: muddler_sculpin (goal_and_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 3.60 |
| Different-presentation close candidates | 1.53 |
| Different-family close candidates | 2.13 |
| Final expanded Set B pool | 2.23 |
| Same-family/same-presentation reintroduced | 173/1368 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 256 |
| Coverage pool used | 29 |
| Average used coverage pool size | 1.83 |
| Singleton used coverage pools | 9 |
| Broad pool larger than narrowed pool | 10 |
| Broad pool same as narrowed pool | 19 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 0 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 227 |
| broad | 29 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| inline_spinner | 19 |
| casting_spoon | 17 |
| suspending_jerkbait | 17 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| casting_spoon | 12 |
| suspending_jerkbait | 9 |
| inline_spinner | 6 |
| blade_bait | 2 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

None.

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 1968 | 0 | 0 |
| caution | 144 | 3 | 3 |

Caution-gate selected surface examples:
- mt_madison_trout__2025-07-19__freshwater_river__clear__big_fish__A: honorable_lure:small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__stained__big_fish__A: honorable_lure:small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__dirty__big_fish__A: honorable_lure:small_floating_trout_plug

Caution-gate surface finalist examples:
- mt_madison_trout__2025-07-19__freshwater_river__clear__big_fish__A lure/honorable: small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__stained__big_fish__A lure/honorable: small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__dirty__big_fish__A lure/honorable: small_floating_trout_plug

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_slider | baitfish_slider | upper<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Sculpin Streamer<br>sculpin_streamer | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: current_swing, cold_slow, runoff_streamer | 1: reliable_action | freshwater_river | false | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Hair Jig<br>hair_jig | lure | smallmouth_bass, trout | hair_jig | hair_jig | bottom<br>slow/medium | 2: baitfish, leech_worm | 2: clear, stained | 3: clear_subtle, current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 8 |
| Inline Spinner<br>inline_spinner | lure | smallmouth_bass, trout, northern_pike | spinner | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | trout | trout_plug | trout_surface_plug | surface<br>medium/slow | 2: surface_prey, baitfish | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_river | true | 8 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | largemouth_bass, smallmouth_bass, trout | jerkbait | jerkbait | mid<br>medium | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, wind_reaction | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | smallmouth_bass, northern_pike, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Conehead Streamer<br>conehead_streamer | fly | smallmouth_bass, trout | streamer_weighted | baitfish_streamer | mid<br>medium | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Crawfish Streamer<br>crawfish_streamer | fly | smallmouth_bass, trout | crawfish_fly | crawfish_fly | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: current_swing, clear_subtle | 1: reliable_action | freshwater_river | false | 7 |
| Feather Jig Leech<br>feather_jig_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: warming_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, clear_subtle | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Mouse Fly<br>mouse_fly | fly | largemouth_bass, trout | fly_mouse | surface_fly_frog_mouse | surface<br>slow/medium | 1: surface_prey | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 7 |
| Muddler Minnow<br>muddler_sculpin | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Sculpzilla<br>sculpzilla | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow/medium | 2: baitfish, crawfish | 2: stained, dirty | 2: runoff_streamer, current_swing | 1: big_fish_upside | freshwater_river | false | 7 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_unweighted | baitfish_streamer | upper<br>medium/slow | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Woolly Bugger<br>woolly_bugger | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | bugger_streamer | leech_bugger | mid<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Zonker Streamer<br>zonker_streamer | fly | smallmouth_bass, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 2: cold_slow, open_water_search | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | largemouth_bass, smallmouth_bass, trout | soft_plastic_minnow | drop_shot_minnow | mid<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Casting Spoon<br>casting_spoon | lure | northern_pike, trout | spoon | blade_spoon | mid<br>medium | 1: baitfish | 2: clear, stained | 2: open_water_search, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | smallmouth_bass, trout | streamer_sparse | baitfish_streamer | upper<br>medium/fast | 1: baitfish | 1: clear | 2: clear_subtle, current_swing | 1: reliable_action | freshwater_river | false | 5 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 162/684 | 114/444 | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20%<br>home-window share>25% overdominant |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 128/552 | 110/420 | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 36/312 | 0/108 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 25/684 | 11/396 | goal_tags>1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 3/84 | 1/76 | clear+stained+dirty clarity |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 26/684 | 22/568 | clear+stained+dirty clarity |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 92/684 | 83/576 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 37/684 | 35/576 | clear+stained+dirty clarity |
| Mouse Fly<br>mouse_fly | fly | 7 | 20/108 | 17/72 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 166/684 | 134/568 | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 131/684 | 124/576 | clear+stained+dirty clarity<br>home-window share>20% |
| Sculpzilla<br>sculpzilla | fly | 7 | 141/684 | 104/444 | home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 135/684 | 114/568 | clear+stained+dirty clarity<br>home-window share>20% |
| Blade Bait<br>blade_bait | lure | 7 | 119/324 | 104/268 | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Casting Spoon<br>casting_spoon | lure | 6 | 190/684 | 144/384 | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 114/528 | 30/84 | home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Hair Jig<br>hair_jig | lure | 8 | 265/684 | 241/576 | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Inline Spinner<br>inline_spinner | lure | 8 | 255/684 | 170/384 | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Ned Rig<br>ned_rig | lure | 9 | 89/684 | 85/576 | clear+stained+dirty clarity |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 8 | 66/192 | 50/120 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 270/684 | 143/384 | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 270/684 (39.5%) | 143/384 (37.2%) | all_purpose:158, big_fish:112 | top:143, honorable:127 | current_swing:109, runoff_streamer:109, cold_slow:99, dirty_vibration:85, wind_reaction:79 |
| Hair Jig<br>hair_jig | lure | 8 | 265/684 (38.7%) | 241/576 (41.8%) | all_purpose:133, big_fish:132 | honorable:136, top:129 | current_swing:151, runoff_streamer:151, cold_slow:109, dirty_vibration:108, clear_subtle:66 |
| Inline Spinner<br>inline_spinner | lure | 8 | 255/684 (37.3%) | 170/384 (44.3%) | all_purpose:161, big_fish:94 | top:164, honorable:91 | current_swing:147, runoff_streamer:147, dirty_vibration:120, wind_reaction:99, open_water_search:93 |
| Casting Spoon<br>casting_spoon | lure | 6 | 190/684 (27.8%) | 144/384 (37.5%) | big_fish:119, all_purpose:71 | honorable:121, top:69 | current_swing:115, runoff_streamer:115, dirty_vibration:104, wind_reaction:91, open_water_search:79 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 166/684 (24.3%) | 134/568 (23.6%) | big_fish:151, all_purpose:15 | top:94, honorable:72 | current_swing:62, runoff_streamer:62, cold_slow:58, dirty_vibration:51, wind_reaction:35 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 162/684 (23.7%) | 114/444 (25.7%) | big_fish:155, all_purpose:7 | honorable:83, top:79 | current_swing:74, runoff_streamer:74, dirty_vibration:59, wind_reaction:45, cold_slow:41 |
| Sculpzilla<br>sculpzilla | fly | 7 | 141/684 (20.6%) | 104/444 (23.4%) | big_fish:141 | top:75, honorable:66 | current_swing:80, runoff_streamer:80, dirty_vibration:54, cold_slow:39, wind_reaction:34 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 135/684 (19.7%) | 114/568 (20.1%) | all_purpose:130, big_fish:5 | honorable:85, top:50 | current_swing:64, runoff_streamer:64, dirty_vibration:52, cold_slow:47, heat_finesse:32 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 131/684 (19.2%) | 124/576 (21.5%) | all_purpose:117, big_fish:14 | top:94, honorable:37 | current_swing:87, runoff_streamer:87, dirty_vibration:63, cold_slow:62, wind_reaction:44 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 128/552 (23.2%) | 110/420 (26.2%) | big_fish:128 | honorable:79, top:49 | current_swing:75, runoff_streamer:75, dirty_vibration:58, cold_slow:46, wind_reaction:43 |
| Blade Bait<br>blade_bait | lure | 7 | 119/324 (36.7%) | 104/268 (38.8%) | big_fish:69, all_purpose:50 | honorable:71, top:48 | current_swing:73, runoff_streamer:73, cold_slow:67, dirty_vibration:61, wind_reaction:46 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 114/528 (21.6%) | 30/84 (35.7%) | all_purpose:59, big_fish:55 | honorable:59, top:55 | heat_finesse:64, clear_subtle:38, calm_surface:28, current_swing:16, runoff_streamer:16 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 92/684 (13.5%) | 83/576 (14.4%) | all_purpose:91, big_fish:1 | top:50, honorable:42 | cold_slow:43, current_swing:43, runoff_streamer:43, dirty_vibration:34, heat_finesse:18 |
| Ned Rig<br>ned_rig | lure | 9 | 89/684 (13%) | 85/576 (14.8%) | big_fish:48, all_purpose:41 | honorable:58, top:31 | cold_slow:40, heat_finesse:40, clear_subtle:21, current_swing:16, runoff_streamer:16 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 8 | 66/192 (34.4%) | 50/120 (41.7%) | big_fish:55, all_purpose:11 | top:45, honorable:21 | calm_surface:55, low_light_surface:22, current_swing:21, runoff_streamer:21, dirty_vibration:13 |
| Conehead Streamer<br>conehead_streamer | fly | 7 | 59/684 (8.6%) | 44/444 (9.9%) | all_purpose:50, big_fish:9 | top:30, honorable:29 | open_water_search:40, wind_reaction:40, dirty_vibration:36, current_swing:35, runoff_streamer:35 |
| Zonker Streamer<br>zonker_streamer | fly | 7 | 57/684 (8.3%) | 45/444 (10.1%) | all_purpose:49, big_fish:8 | top:33, honorable:24 | current_swing:38, runoff_streamer:38, dirty_vibration:34, open_water_search:34, wind_reaction:34 |
| Muddler Minnow<br>muddler_sculpin | fly | 7 | 53/684 (7.7%) | 52/576 (9%) | all_purpose:49, big_fish:4 | honorable:35, top:18 | cold_slow:34, current_swing:26, runoff_streamer:26, dirty_vibration:18, clear_subtle:17 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 49/684 (7.2%) | 33/396 (8.3%) | all_purpose:40, big_fish:9 | top:25, honorable:24 | open_water_search:25, wind_reaction:25, current_swing:21, dirty_vibration:21, runoff_streamer:21 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 37/684 (5.4%) | 35/576 (6.1%) | all_purpose:34, big_fish:3 | top:28, honorable:9 | clear_subtle:25, cold_slow:17, wind_reaction:9, calm_surface:6, heat_finesse:6 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 36/312 (11.5%) | 0/108 (0%) | all_purpose:19, big_fish:17 | honorable:28, top:8 | heat_finesse:24, calm_surface:8, none:4, dirty_vibration:2, open_water_search:2 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 5 | 30/528 (5.7%) | 9/264 (3.4%) | all_purpose:19, big_fish:11 | top:16, honorable:14 | clear_subtle:26, calm_surface:12, heat_finesse:10, current_swing:7, runoff_streamer:7 |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 26/684 (3.8%) | 22/568 (3.9%) | all_purpose:26 | honorable:16, top:10 | current_swing:18, runoff_streamer:18, warming_search:18, dirty_vibration:16, open_water_search:11 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 25/684 (3.7%) | 11/396 (2.8%) | all_purpose:25 | honorable:17, top:8 | heat_finesse:8, calm_surface:7, current_swing:5, runoff_streamer:5, warming_search:5 |
| Mouse Fly<br>mouse_fly | fly | 7 | 20/108 (18.5%) | 17/72 (23.6%) | big_fish:20 | honorable:13, top:7 | calm_surface:17, current_swing:9, runoff_streamer:9, dirty_vibration:6, low_light_surface:6 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 18/528 (3.4%) | 2/264 (0.8%) | all_purpose:10, big_fish:8 | honorable:10, top:8 | clear_subtle:12, calm_surface:8, heat_finesse:7, low_light_surface:2, warming_search:2 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 3/84 (3.6%) | 1/76 (1.3%) | all_purpose:3 | top:2, honorable:1 | none:2, clear_subtle:1 |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 270/684 (39.5%) | 143/384 (37.2%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Hair Jig<br>hair_jig | lure | 265/684 (38.7%) | 241/576 (41.8%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Inline Spinner<br>inline_spinner | lure | 255/684 (37.3%) | 170/384 (44.3%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Casting Spoon<br>casting_spoon | lure | 190/684 (27.8%) | 144/384 (37.5%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 166/684 (24.3%) | 134/568 (23.6%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 162/684 (23.7%) | 114/444 (25.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20%<br>home-window share>25% overdominant |
| Sculpzilla<br>sculpzilla | fly | 141/684 (20.6%) | 104/444 (23.4%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 135/684 (19.7%) | 114/568 (20.1%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 131/684 (19.2%) | 124/576 (21.5%) | catalog_tag_stack<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 128/552 (23.2%) | 110/420 (26.2%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant |
| Blade Bait<br>blade_bait | lure | 119/324 (36.7%) | 104/268 (38.8%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 114/528 (21.6%) | 30/84 (35.7%) | catalog_tag_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 66/192 (34.4%) | 50/120 (41.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias<br>acceptable_niche_concentration | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 576 | 85/576 (14.8%) | Inline Spinner (top), Hair Jig (honorable):43, Hair Jig (top), Suspending Jerkbait (honorable):35, Suspending Jerkbait (top), Hair Jig (honorable):31, Inline Spinner (top), Casting Spoon (honorable):30 | healthy / not underused |
| Hair Jig<br>hair_jig | lure | forage 2: baitfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: reliable_action | 576 | 241/576 (41.8%) | Inline Spinner (top), Casting Spoon (honorable):30, Inline Spinner (top), Suspending Jerkbait (honorable):29, Suspending Jerkbait (top), Inline Spinner (honorable):27, Drop-Shot Minnow (top), Ned Rig (honorable):25 | healthy / not underused |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 384 | 170/384 (44.3%) | Hair Jig (top), Suspending Jerkbait (honorable):22, Suspending Jerkbait (top), Casting Spoon (honorable):20, Hair Jig (top), Blade Bait (honorable):18, Hair Jig (top), Casting Spoon (honorable):18 | healthy / not underused |
| Casting Spoon<br>casting_spoon | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: open_water_search, wind_reaction<br>goal 1: versatile_search | 384 | 144/384 (37.5%) | Inline Spinner (top), Hair Jig (honorable):38, Inline Spinner (top), Suspending Jerkbait (honorable):23, Hair Jig (top), Suspending Jerkbait (honorable):22, Hair Jig (top), Blade Bait (honorable):18 | healthy / not underused |
| Blade Bait<br>blade_bait | lure | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, open_water_search<br>goal 1: reliable_action | 268 | 104/268 (38.8%) | Hair Jig (top), Suspending Jerkbait (honorable):23, Inline Spinner (top), Hair Jig (honorable):16, Hair Jig (top), Inline Spinner (honorable):13, Hair Jig (top), Ned Rig (honorable):13 | healthy / not underused |
| Suspending Jerkbait<br>suspending_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, wind_reaction<br>goal 2: reliable_action, versatile_search | 384 | 143/384 (37.2%) | Inline Spinner (top), Hair Jig (honorable):38, Inline Spinner (top), Casting Spoon (honorable):28, Hair Jig (top), Blade Bait (honorable):18, Hair Jig (top), Casting Spoon (honorable):18 | healthy / not underused |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, open_water_search<br>goal 2: reliable_action, versatile_search | 0 | 0/0 |  | scenario coverage |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | forage 2: surface_prey, baitfish<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 120 | 50/120 (41.7%) | Inline Spinner (top), Hair Jig (honorable):10, Suspending Jerkbait (top), Inline Spinner (honorable):8, Suspending Jerkbait (top), Hair Jig (honorable):7, Inline Spinner (top), Casting Spoon (honorable):6 | healthy / not underused |
| Woolly Bugger<br>woolly_bugger | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 568 | 114/568 (20.1%) | Sculpzilla (top), Articulated Dungeon Streamer (honorable):35, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):26, Sculpzilla (top), Articulated Baitfish Streamer (honorable):25, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):24 | healthy / not underused |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | forage 1: leech_worm<br>clarity 2: stained, dirty<br>condition 2: cold_slow, cover_ambush<br>goal 2: reliable_action, big_fish_upside | 568 | 134/568 (23.6%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):35, Sculpzilla (top), Articulated Baitfish Streamer (honorable):25, Articulated Baitfish Streamer (top), Sculpzilla (honorable):19 | healthy / not underused |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 576 | 83/576 (14.4%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):34, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):28, Sculpzilla (top), Articulated Baitfish Streamer (honorable):27 | healthy / not underused |
| Lead-Eye Leech<br>lead_eye_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, clear_subtle<br>goal 1: reliable_action | 576 | 35/576 (6.1%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):34, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):28, Sculpzilla (top), Articulated Baitfish Streamer (honorable):27 | selector/direct-score or overpowered competitors |
| Feather Jig Leech<br>feather_jig_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: warming_search, current_swing<br>goal 1: versatile_search | 568 | 22/568 (3.9%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):35, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):26, Sculpzilla (top), Articulated Baitfish Streamer (honorable):25 | selector/direct-score or overpowered competitors |
| Sculpin Streamer<br>sculpin_streamer | fly | forage 2: baitfish, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: current_swing, cold_slow, runoff_streamer<br>goal 1: reliable_action | 576 | 124/576 (21.5%) | Sculpzilla (top), Articulated Dungeon Streamer (honorable):34, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):28, Sculpzilla (top), Articulated Baitfish Streamer (honorable):27, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):25 | healthy / not underused |
| Sculpzilla<br>sculpzilla | fly | forage 2: baitfish, crawfish<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, current_swing<br>goal 1: big_fish_upside | 444 | 104/444 (23.4%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):22, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):20 | healthy / not underused |
| Muddler Minnow<br>muddler_sculpin | fly | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: current_swing, cold_slow<br>goal 1: reliable_action | 576 | 52/576 (9%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):34, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):28, Sculpzilla (top), Articulated Baitfish Streamer (honorable):27 | selector/direct-score or overpowered competitors |
| Crawfish Streamer<br>crawfish_streamer | fly | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 2: current_swing, clear_subtle<br>goal 1: reliable_action | 76 | 1/76 (1.3%) | Sculpin Streamer (top), Jighead Marabou Leech (honorable):10, Lead-Eye Leech (top), Muddler Minnow (honorable):7, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):6, Jighead Marabou Leech (top), Sculpin Streamer (honorable):5 | selector/direct-score or overpowered competitors |
| Clouser Minnow<br>clouser_minnow | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: current_swing, open_water_search<br>goal 2: reliable_action, versatile_search | 396 | 11/396 (2.8%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):34, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):21, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):19 | selector/direct-score or overpowered competitors |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 396 | 33/396 (8.3%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):34, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):21, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):19 | selector/direct-score or overpowered competitors |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | forage 1: baitfish<br>clarity 1: clear<br>condition 2: clear_subtle, current_swing<br>goal 1: reliable_action | 264 | 9/264 (3.4%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):22, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):15 | selector/direct-score or overpowered competitors |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: open_water_search, runoff_streamer<br>goal 2: versatile_search, big_fish_upside | 444 | 114/444 (25.7%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):35, Articulated Dungeon Streamer (top), Sculpzilla (honorable):20, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):20 | healthy / not underused |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, cover_ambush<br>goal 2: big_fish_upside, high_risk_high_reward | 420 | 110/420 (26.2%) | Sculpin Streamer (top), Woolly Bugger (honorable):41, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):22, Sculpzilla (top), Articulated Baitfish Streamer (honorable):20 | healthy / not underused |
| Game Changer<br>game_changer | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 1: open_water_search<br>goal 2: versatile_search, big_fish_upside | 0 | 0/0 |  | scenario coverage |
| Conehead Streamer<br>conehead_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 444 | 44/444 (9.9%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):35, Sculpzilla (top), Articulated Baitfish Streamer (honorable):26, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23 | selector/direct-score or overpowered competitors |
| Zonker Streamer<br>zonker_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 1: versatile_search | 444 | 45/444 (10.1%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):35, Sculpzilla (top), Articulated Baitfish Streamer (honorable):26, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23 | selector/direct-score or overpowered competitors |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: clear_subtle, open_water_search<br>goal 1: versatile_search | 264 | 2/264 (0.8%) | Sculpin Streamer (top), Woolly Bugger (honorable):47, Sculpzilla (top), Articulated Dungeon Streamer (honorable):22, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):15 | selector/direct-score or overpowered competitors |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 3: wind_reaction, open_water_search, warming_search<br>goal 1: versatile_search | 108 | 0/108 (0%) | Sculpin Streamer (top), Woolly Bugger (honorable):24, Sculpzilla (top), Articulated Baitfish Streamer (honorable):9, Articulated Baitfish Streamer (top), Sculpzilla (honorable):7, Articulated Dungeon Streamer (top), Sculpzilla (honorable):6 | selector/direct-score or overpowered competitors |
| Popper Fly<br>popper_fly | fly | forage 2: surface_prey, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: reliable_action, versatile_search | 0 | 0/0 |  | scenario coverage |
| Deer Hair Slider<br>deer_hair_slider | fly | forage 2: surface_prey, baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: calm_surface, low_light_surface<br>goal 1: big_fish_upside | 0 | 0/0 |  | scenario coverage |
| Mouse Fly<br>mouse_fly | fly | forage 1: surface_prey<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 72 | 17/72 (23.6%) | Sculpin Streamer (top), Woolly Bugger (honorable):9, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):3, Articulated Baitfish Streamer (top), Sculpzilla (honorable):3 | healthy / not underused |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Inline Spinner (inline_spinner), Rabbit-Strip Leech (rabbit_strip_leech), Small Floating Trout Plug (small_floating_trout_plug), Suspending Jerkbait (suspending_jerkbait)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Blade Bait (blade_bait), Casting Spoon (casting_spoon), Deer Hair Slider (deer_hair_slider), Drop-Shot Minnow (drop_shot_minnow), Game Changer (game_changer), Hair Jig (hair_jig), Inline Spinner (inline_spinner), Popper Fly (popper_fly), Rabbit-Strip Leech (rabbit_strip_leech), Sculpin Streamer (sculpin_streamer), Sculpzilla (sculpzilla), Small Floating Trout Plug (small_floating_trout_plug), Soft Plastic Jerkbait (soft_jerkbait), Suspending Jerkbait (suspending_jerkbait), Woolly Bugger (woolly_bugger)

### Probably selector problem, not catalog problem
Baitfish Slider Fly (baitfish_slider_fly), Bucktail Streamer (bucktail_baitfish_streamer), Clouser Minnow (clouser_minnow), Conehead Streamer (conehead_streamer), Crawfish Streamer (crawfish_streamer), Feather Jig Leech (feather_jig_leech), Lead-Eye Leech (lead_eye_leech), Muddler Minnow (muddler_sculpin), Slim Baitfish Streamer (slim_minnow_streamer), Unweighted Baitfish Streamer (unweighted_baitfish_streamer), Zonker Streamer (zonker_streamer)

## Utilization Notes / Coverage Gaps

- 6 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Jighead Marabou Leech, Muddler Minnow, Sculpin Streamer, Rabbit-Strip Leech, Woolly Bugger, Conehead Streamer, Sculpzilla, Zonker Streamer, Bucktail Streamer, Crawfish Streamer, Mouse Fly, Ned Rig |
| underused_home_window | Lead-Eye Leech, Feather Jig Leech, Clouser Minnow, Slim Baitfish Streamer, Unweighted Baitfish Streamer, Baitfish Slider Fly |
| no_home_window_coverage | None |
| over-dominant | Articulated Baitfish Streamer, Articulated Dungeon Streamer, Hair Jig, Casting Spoon, Inline Spinner, Suspending Jerkbait, Blade Bait, Small Floating Trout Plug |
| probably okay niche profile | Deer Hair Slider, Game Changer, Popper Fly, Soft Plastic Jerkbait |

## Trout Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 6.7% | 92/684 | 83/576 | 92 | 83 | 14.4% | 82/288 | 1/288 | 209 | healthy | activity neutral:424, active:104, suppressed:48<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:100 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):23, Sculpzilla (top), Articulated Baitfish Streamer (honorable):20 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 2.7% | 37/684 | 35/576 | 37 | 35 | 6.1% | 32/288 | 3/288 | 127 | underused_home_window | activity neutral:424, active:104, suppressed:48<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:100 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):23, Sculpzilla (top), Articulated Baitfish Streamer (honorable):20 |
| Muddler Minnow<br>muddler_sculpin | fly | 3.9% | 53/684 | 52/576 | 53 | 52 | 9% | 48/288 | 4/288 | 147 | healthy | activity neutral:424, active:104, suppressed:48<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:100 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):23, Sculpzilla (top), Articulated Baitfish Streamer (honorable):20 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9.6% | 131/684 | 124/576 | 131 | 124 | 21.5% | 110/288 | 14/288 | 282 | healthy | activity neutral:424, active:104, suppressed:48<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:100 | Articulated Dungeon Streamer (honorable), Sculpzilla (top):23, Sculpzilla (top), Articulated Baitfish Streamer (honorable):20, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):19 |
| Feather Jig Leech<br>feather_jig_leech | fly | 1.9% | 26/684 | 22/568 | 26 | 22 | 3.9% | 22/284 | 0/284 | 143 | underused_home_window | activity neutral:404, active:116, suppressed:48<br>clarity clear:224, stained:192, dirty:152<br>water freshwater_river:568<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:68 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):24, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 12.1% | 166/684 | 134/568 | 166 | 134 | 23.6% | 11/284 | 123/284 | 136 | healthy | activity neutral:404, active:116, suppressed:48<br>clarity clear:224, stained:192, dirty:152<br>water freshwater_river:568<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:68 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):24, Sculpzilla (top), Articulated Baitfish Streamer (honorable):20 |
| Woolly Bugger<br>woolly_bugger | fly | 9.9% | 135/684 | 114/568 | 135 | 114 | 20.1% | 109/284 | 5/284 | 243 | healthy | activity neutral:404, active:116, suppressed:48<br>clarity clear:224, stained:192, dirty:152<br>water freshwater_river:568<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:68 | Articulated Dungeon Streamer (honorable), Sculpzilla (top):24, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23, Sculpzilla (top), Articulated Baitfish Streamer (honorable):20 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 11.8% | 162/684 | 114/444 | 162 | 114 | 25.7% | 2/198 | 112/246 | 127 | over-dominant | activity neutral:306, active:90, suppressed:48<br>clarity clear:148, dirty:148, stained:148<br>water freshwater_river:444<br>bucket dirty_vibration:116, cold_slow_or_front:90, stable_pleasant_medium_confidence_archive:64 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):24, Articulated Dungeon Streamer (top), Sculpzilla (honorable):18 |
| Conehead Streamer<br>conehead_streamer | fly | 4.3% | 59/684 | 44/444 | 59 | 44 | 9.9% | 36/198 | 8/246 | 161 | healthy | activity neutral:306, active:90, suppressed:48<br>clarity clear:148, dirty:148, stained:148<br>water freshwater_river:444<br>bucket dirty_vibration:116, cold_slow_or_front:90, stable_pleasant_medium_confidence_archive:64 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):24, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23 |
| Sculpzilla<br>sculpzilla | fly | 10.3% | 141/684 | 104/444 | 141 | 104 | 23.4% | 0/198 | 104/246 | 100 | healthy | activity neutral:306, active:90, suppressed:48<br>clarity clear:148, dirty:148, stained:148<br>water freshwater_river:444<br>bucket dirty_vibration:116, cold_slow_or_front:90, stable_pleasant_medium_confidence_archive:64 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23, Articulated Baitfish Streamer (honorable), Rabbit-Strip Leech (top):20 |
| Zonker Streamer<br>zonker_streamer | fly | 4.2% | 57/684 | 45/444 | 57 | 45 | 10.1% | 38/198 | 7/246 | 159 | healthy | activity neutral:306, active:90, suppressed:48<br>clarity clear:148, dirty:148, stained:148<br>water freshwater_river:444<br>bucket dirty_vibration:116, cold_slow_or_front:90, stable_pleasant_medium_confidence_archive:64 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):24, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 9.4% | 128/552 | 110/420 | 128 | 110 | 26.2% | 0/186 | 110/234 | 111 | over-dominant | activity neutral:294, active:78, suppressed:48<br>clarity clear:140, dirty:140, stained:140<br>water freshwater_river:420<br>bucket dirty_vibration:108, cold_slow_or_front:86, stable_pleasant_medium_confidence_archive:64 | Sculpin Streamer (top), Woolly Bugger (honorable):41, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23, Articulated Baitfish Streamer (honorable), Rabbit-Strip Leech (top):20 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3.6% | 49/684 | 33/396 | 49 | 33 | 8.3% | 25/198 | 8/198 | 162 | healthy | activity neutral:276, active:72, suppressed:48<br>clarity clear:132, dirty:132, stained:132<br>water freshwater_river:396<br>bucket dirty_vibration:116, cold_slow_or_front:80, breezy_windy_stained_reaction:60 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):23, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):21 |
| Clouser Minnow<br>clouser_minnow | fly | 1.8% | 25/684 | 11/396 | 25 | 11 | 2.8% | 11/198 | 0/198 | 67 | underused_home_window | activity neutral:276, active:72, suppressed:48<br>clarity clear:132, dirty:132, stained:132<br>water freshwater_river:396<br>bucket dirty_vibration:116, cold_slow_or_front:80, breezy_windy_stained_reaction:60 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):23, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):21 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 2.2% | 30/528 | 9/264 | 30 | 9 | 3.4% | 8/132 | 1/132 | 38 | underused_home_window | activity neutral:180, active:48, suppressed:36<br>clarity clear:88, dirty:88, stained:88<br>water freshwater_river:264<br>bucket dirty_vibration:72, cold_slow_or_front:52, breezy_windy_stained_reaction:36 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):22, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):19 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 1.3% | 18/528 | 2/264 | 18 | 2 | 0.8% | 1/132 | 1/132 | 11 | underused_home_window | activity neutral:180, active:48, suppressed:36<br>clarity clear:88, dirty:88, stained:88<br>water freshwater_river:264<br>bucket dirty_vibration:72, cold_slow_or_front:52, breezy_windy_stained_reaction:36 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):22, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):19 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 2.6% | 36/312 | 0/108 | 36 | 0 | 0% | 0/54 | 0/54 | 3 | underused_home_window | activity neutral:96, active:12<br>clarity clear:36, dirty:36, stained:36<br>water freshwater_river:108<br>bucket dirty_vibration:28, stable_pleasant_medium_confidence_archive:28, calm_low_light_surface:24 | Sculpin Streamer (top), Woolly Bugger (honorable):24, Sculpzilla (top), Articulated Baitfish Streamer (honorable):8, Articulated Dungeon Streamer (top), Sculpzilla (honorable):6 |
| Crawfish Streamer<br>crawfish_streamer | fly | 0.2% | 3/84 | 1/76 | 3 | 1 | 1.3% | 1/38 | 0/38 | 0 | healthy | activity neutral:64, suppressed:12<br>clarity clear:28, dirty:24, stained:24<br>water freshwater_river:76<br>bucket cold_slow_or_front:40, dirty_vibration:20, breezy_windy_stained_reaction:12 | Sculpin Streamer (top), Jighead Marabou Leech (honorable):10, Lead-Eye Leech (top), Muddler Minnow (honorable):7, Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):6 |
| Mouse Fly<br>mouse_fly | fly | 1.5% | 20/108 | 17/72 | 20 | 17 | 23.6% | 0/36 | 17/36 | 15 | healthy | activity neutral:60, active:12<br>clarity clear:24, dirty:24, stained:24<br>water freshwater_river:72<br>bucket stable_pleasant_medium_confidence_archive:32, cold_slow_or_front:16, calm_low_light_surface:12 | Sculpin Streamer (top), Woolly Bugger (honorable):9, Sculpzilla (top), Articulated Baitfish Streamer (honorable):4, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):3 |
| Deer Hair Slider<br>deer_hair_slider | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Game Changer<br>game_changer | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Popper Fly<br>popper_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Hair Jig<br>hair_jig | lure | 19.4% | 265/684 | 241/576 | 265 | 241 | 41.8% | 119/288 | 122/288 | 167 | over-dominant | activity neutral:424, active:104, suppressed:48<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:100 | Inline Spinner (top), Suspending Jerkbait (honorable):28, Drop-Shot Minnow (top), Ned Rig (honorable):25, Inline Spinner (top), Casting Spoon (honorable):25 |
| Ned Rig<br>ned_rig | lure | 6.5% | 89/684 | 85/576 | 89 | 85 | 14.8% | 40/288 | 45/288 | 54 | healthy | activity neutral:424, active:104, suppressed:48<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:156, dirty_vibration:112, heat_limited_finesse:100 | Inline Spinner (top), Hair Jig (honorable):41, Inline Spinner (top), Suspending Jerkbait (honorable):28, Inline Spinner (top), Casting Spoon (honorable):25 |
| Casting Spoon<br>casting_spoon | lure | 13.9% | 190/684 | 144/384 | 190 | 144 | 37.5% | 49/192 | 95/192 | 51 | over-dominant | activity neutral:276, active:60, suppressed:48<br>clarity clear:128, dirty:128, stained:128<br>water freshwater_river:384<br>bucket dirty_vibration:112, cold_slow_or_front:80, breezy_windy_stained_reaction:60 | Inline Spinner (top), Hair Jig (honorable):36, Inline Spinner (top), Suspending Jerkbait (honorable):23, Hair Jig (top), Suspending Jerkbait (honorable):20 |
| Inline Spinner<br>inline_spinner | lure | 18.6% | 255/684 | 170/384 | 255 | 170 | 44.3% | 100/192 | 70/192 | 128 | over-dominant | activity neutral:276, active:60, suppressed:48<br>clarity clear:128, dirty:128, stained:128<br>water freshwater_river:384<br>bucket dirty_vibration:112, cold_slow_or_front:80, breezy_windy_stained_reaction:60 | Hair Jig (top), Suspending Jerkbait (honorable):20, Hair Jig (top), Blade Bait (honorable):18, Hair Jig (top), Casting Spoon (honorable):15 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 19.7% | 270/684 | 143/384 | 270 | 143 | 37.2% | 85/192 | 58/192 | 66 | over-dominant | activity neutral:276, active:60, suppressed:48<br>clarity clear:128, dirty:128, stained:128<br>water freshwater_river:384<br>bucket dirty_vibration:112, cold_slow_or_front:80, breezy_windy_stained_reaction:60 | Inline Spinner (top), Hair Jig (honorable):36, Inline Spinner (top), Casting Spoon (honorable):23, Hair Jig (top), Blade Bait (honorable):18 |
| Blade Bait<br>blade_bait | lure | 8.7% | 119/324 | 104/268 | 119 | 104 | 38.8% | 42/134 | 62/134 | 49 | over-dominant | activity neutral:196, suppressed:48, active:24<br>clarity clear:100, dirty:84, stained:84<br>water freshwater_river:268<br>bucket cold_slow_or_front:108, dirty_vibration:68, breezy_windy_stained_reaction:36 | Hair Jig (top), Suspending Jerkbait (honorable):17, Inline Spinner (top), Hair Jig (honorable):14, Hair Jig (top), Ned Rig (honorable):13 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 4.8% | 66/192 | 50/120 | 66 | 50 | 41.7% | 9/60 | 41/60 | 23 | over-dominant | activity neutral:108, active:12<br>clarity clear:40, dirty:40, stained:40<br>water freshwater_river:120<br>bucket stable_pleasant_medium_confidence_archive:52, calm_low_light_surface:36, cold_slow_or_front:16 | Inline Spinner (top), Hair Jig (honorable):10, Suspending Jerkbait (top), Hair Jig (honorable):7, Inline Spinner (top), Casting Spoon (honorable):6 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | 40/288 | 45/288 | goal_tags:314, daily_condition_tags:101, forage_clarity_stack:55, seasonal_baseline:11, selector_filtering_variety_jitter:10 | Upper Delaware trout river 2025-01-18 all_purpose clear: lost to Blade Bait by -6 (selector_filtering_variety_jitter)<br>Upper Delaware trout river 2025-01-18 big_fish stained: lost to Suspending Jerkbait by 2 (goal_tags)<br>Upper Delaware trout river 2025-01-18 big_fish clear: lost to Blade Bait by 6 (goal_tags) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>all_purpose clear cold_slow_or_front | 184 | Blade Bait<br>178 | -6 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish stained breezy_windy_stained_reaction | 156 | Suspending Jerkbait<br>158 | 2 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish clear cold_slow_or_front | 156 | Blade Bait<br>162 | 6 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish dirty dirty_vibration | 156 | Blade Bait<br>162 | 6 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:dirty:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 37 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lower Sacramento northern California trout tailwater<br>2025-07-24 all_purpose clear<br>heat_limited_finesse | B<br>honorable_lure | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>204 | -18 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-07-24 all_purpose stained<br>heat_limited_finesse | B<br>honorable_lure | Inline Spinner<br>170 | Drop-Shot Minnow<br>188 | -18 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-08-16 all_purpose clear<br>heat_limited_finesse | B<br>honorable_lure | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>204 | -18 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-08-16 all_purpose stained<br>heat_limited_finesse | B<br>honorable_lure | Inline Spinner<br>170 | Drop-Shot Minnow<br>188 | -18 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-08-21 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>204 | -18 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-08-21 all_purpose stained<br>heat_limited_finesse | B<br>honorable_lure | Inline Spinner<br>170 | Drop-Shot Minnow<br>188 | -18 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Madison River mountain-west trout water<br>2025-11-11 all_purpose clear<br>stable_pleasant_medium_confidence_archive | B<br>lure_of_the_day | Blade Bait<br>168 | Ned Rig<br>178 | -10 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:leech_worm:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| White River Ozark trout tailwater<br>2025-12-12 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>184 | Ned Rig<br>194 | -10 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:leech_worm:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Delaware trout river<br>2025-07-12 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>170 | Drop-Shot Minnow<br>178 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-07-12 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Inline Spinner<br>170 | Drop-Shot Minnow<br>178 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Au Sable / Upper Midwest trout river<br>2025-07-16 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>170 | Drop-Shot Minnow<br>178 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-07-28 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Inline Spinner<br>170 | Drop-Shot Minnow<br>178 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-07-28 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Inline Spinner<br>170 | Drop-Shot Minnow<br>178 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-08-12 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>194 | -8 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-08-12 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Inline Spinner<br>170 | Drop-Shot Minnow<br>178 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-09-15 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>194 | -8 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-09-15 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>170 | Drop-Shot Minnow<br>178 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-09-18 all_purpose clear<br>heat_limited_finesse | B<br>honorable_lure | Inline Spinner<br>170 | Drop-Shot Minnow<br>178 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-09-18 all_purpose stained<br>heat_limited_finesse | B<br>honorable_lure | Inline Spinner<br>170 | Drop-Shot Minnow<br>178 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-10-04 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Inline Spinner<br>170 | Drop-Shot Minnow<br>178 | -8 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-10-14 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Inline Spinner<br>170 | Drop-Shot Minnow<br>178 | -8 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-01-18 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>178 | Ned Rig<br>184 | -6 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Delaware trout river<br>2025-12-12 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>178 | Ned Rig<br>184 | -6 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Au Sable / Upper Midwest trout river<br>2025-12-12 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>178 | Ned Rig<br>184 | -6 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Delaware trout river<br>2025-05-15 all_purpose clear<br>warming_search | B<br>lure_of_the_day | Inline Spinner<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:current_swing:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-05-23 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Madison River mountain-west trout water<br>2025-06-07 all_purpose clear<br>stable_pleasant_medium_confidence_archive | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Skagit River Pacific Northwest trout water<br>2025-06-14 all_purpose clear<br>calm_low_light_surface | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-06-21 all_purpose clear<br>stable_pleasant_medium_confidence_archive | B<br>honorable_lure | Inline Spinner<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:current_swing:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Inline Spinner<br>202 | Drop-Shot Minnow<br>204 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:open_water_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 all_purpose stained<br>breezy_windy_stained_reaction | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:wind_reaction:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-06-28 all_purpose clear<br>calm_low_light_surface | B<br>lure_of_the_day | Inline Spinner<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:current_swing:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Au Sable / Upper Midwest trout river<br>2025-08-14 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Inline Spinner<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:current_swing:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Madison River mountain-west trout water<br>2025-08-23 all_purpose clear<br>stable_pleasant_medium_confidence_archive | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-09-13 all_purpose clear<br>stable_pleasant_medium_confidence_archive | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Skagit River Pacific Northwest trout water<br>2025-09-29 all_purpose clear<br>calm_low_light_surface | B<br>honorable_lure | Inline Spinner<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:current_swing:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Au Sable / Upper Midwest trout river<br>2025-10-20 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Inline Spinner<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:current_swing:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lead-Eye Leech<br>lead_eye_leech | fly | 35/576 | 6.1% | 127 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / clear / freshwater_river / cold_slow_or_front:38, big_fish / clear / freshwater_river / cold_slow_or_front:38 | goal_tags:247, daily_condition_tags:185, seasonal_baseline:56, selector_filtering_variety_jitter:36 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):23, Sculpzilla (top), Articulated Baitfish Streamer (honorable):20, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):19 |
| Feather Jig Leech<br>feather_jig_leech | fly | 22/568 | 3.9% | 143 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / clear / freshwater_river / cold_slow_or_front:38, big_fish / clear / freshwater_river / cold_slow_or_front:38 | goal_tags:416, daily_condition_tags:65, selector_filtering_variety_jitter:44, forage_clarity_stack:18 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):24, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23, Sculpzilla (top), Articulated Baitfish Streamer (honorable):20 |
| Clouser Minnow<br>clouser_minnow | fly | 11/396 | 2.8% | 67 | all_purpose / dirty / freshwater_river / dirty_vibration:58, big_fish / dirty / freshwater_river / dirty_vibration:58, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:30, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:30 | goal_tags:171, daily_condition_tags:166, raw_score:24, forage_clarity_stack:20 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):23, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):21, Articulated Baitfish Streamer (honorable), Rabbit-Strip Leech (top):19 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 9/264 | 3.4% | 38 | all_purpose / dirty / freshwater_river / dirty_vibration:36, big_fish / dirty / freshwater_river / dirty_vibration:36, all_purpose / clear / freshwater_river / cold_slow_or_front:18, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:18 | goal_tags:118, daily_condition_tags:96, forage_clarity_stack:26, raw_score:8 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):22, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):15 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 2/264 | 0.8% | 11 | all_purpose / dirty / freshwater_river / dirty_vibration:36, big_fish / dirty / freshwater_river / dirty_vibration:36, all_purpose / clear / freshwater_river / cold_slow_or_front:18, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:18 | goal_tags:193, daily_condition_tags:62, seasonal_baseline:5, raw_score:1 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):22, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):15 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 0/108 | 0% | 3 | all_purpose / dirty / freshwater_river / dirty_vibration:14, big_fish / dirty / freshwater_river / dirty_vibration:14, all_purpose / clear / freshwater_river / stable_pleasant_medium_confidence_archive:8, big_fish / clear / freshwater_river / stable_pleasant_medium_confidence_archive:8 | goal_tags:83, daily_condition_tags:25 | Sculpin Streamer (top), Woolly Bugger (honorable):24, Sculpzilla (top), Articulated Baitfish Streamer (honorable):8, Articulated Dungeon Streamer (top), Sculpzilla (honorable):6, Sculpzilla (honorable), Articulated Baitfish Streamer (top):6 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 241/576 | 41.8% | 167 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / clear / freshwater_river / cold_slow_or_front:38, big_fish / clear / freshwater_river / cold_slow_or_front:38 | goal_tags:141, selector_filtering_variety_jitter:81, daily_condition_tags:74, seasonal_baseline:32 | Inline Spinner (top), Suspending Jerkbait (honorable):28, Drop-Shot Minnow (top), Ned Rig (honorable):25, Inline Spinner (top), Casting Spoon (honorable):25, Inline Spinner (honorable), Suspending Jerkbait (top):18 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 114/444 | 25.7% | 127 | all_purpose / dirty / freshwater_river / dirty_vibration:58, big_fish / dirty / freshwater_river / dirty_vibration:58, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:30, big_fish / clear / freshwater_river / cold_slow_or_front:30 | goal_tags:181, daily_condition_tags:77, selector_filtering_variety_jitter:40, forage_clarity_stack:12 | Sculpin Streamer (top), Woolly Bugger (honorable):47, Articulated Dungeon Streamer (honorable), Sculpzilla (top):24, Articulated Dungeon Streamer (top), Sculpzilla (honorable):18, Sculpin Streamer (top), Jighead Marabou Leech (honorable):15 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 110/420 | 26.2% | 111 | all_purpose / dirty / freshwater_river / dirty_vibration:54, big_fish / dirty / freshwater_river / dirty_vibration:54, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:30, big_fish / clear / freshwater_river / cold_slow_or_front:30 | goal_tags:186, selector_filtering_variety_jitter:64, daily_condition_tags:56, forage_clarity_stack:3 | Sculpin Streamer (top), Woolly Bugger (honorable):41, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):23, Articulated Baitfish Streamer (honorable), Rabbit-Strip Leech (top):20, Sculpin Streamer (top), Jighead Marabou Leech (honorable):15 |
| Inline Spinner<br>inline_spinner | lure | 170/384 | 44.3% | 128 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:30, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:30 | selector_filtering_variety_jitter:99, goal_tags:79, daily_condition_tags:20, forage_clarity_stack:14 | Hair Jig (top), Suspending Jerkbait (honorable):20, Hair Jig (top), Blade Bait (honorable):18, Hair Jig (top), Casting Spoon (honorable):15, Suspending Jerkbait (top), Casting Spoon (honorable):15 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 143/384 | 37.2% | 66 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:30, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:30 | daily_condition_tags:143, goal_tags:42, selector_filtering_variety_jitter:29, forage_clarity_stack:21 | Inline Spinner (top), Hair Jig (honorable):36, Inline Spinner (top), Casting Spoon (honorable):23, Hair Jig (top), Blade Bait (honorable):18, Hair Jig (top), Casting Spoon (honorable):15 |
| Casting Spoon<br>casting_spoon | lure | 144/384 | 37.5% | 51 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:30, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:30 | goal_tags:150, daily_condition_tags:63, selector_filtering_variety_jitter:19, forage_clarity_stack:5 | Inline Spinner (top), Hair Jig (honorable):36, Inline Spinner (top), Suspending Jerkbait (honorable):23, Hair Jig (top), Suspending Jerkbait (honorable):20, Hair Jig (top), Blade Bait (honorable):18 |
| Blade Bait<br>blade_bait | lure | 104/268 | 38.8% | 49 | all_purpose / dirty / freshwater_river / dirty_vibration:34, big_fish / dirty / freshwater_river / dirty_vibration:34, all_purpose / clear / freshwater_river / cold_slow_or_front:28, big_fish / clear / freshwater_river / cold_slow_or_front:28 | daily_condition_tags:65, goal_tags:53, forage_clarity_stack:20, seasonal_baseline:13 | Hair Jig (top), Suspending Jerkbait (honorable):17, Inline Spinner (top), Hair Jig (honorable):14, Hair Jig (top), Ned Rig (honorable):13, Hair Jig (top), Casting Spoon (honorable):11 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 50/120 | 41.7% | 23 | all_purpose / clear / freshwater_river / stable_pleasant_medium_confidence_archive:10, all_purpose / stained / freshwater_river / stable_pleasant_medium_confidence_archive:10, big_fish / clear / freshwater_river / stable_pleasant_medium_confidence_archive:10, big_fish / stained / freshwater_river / stable_pleasant_medium_confidence_archive:10 | goal_tags:51, selector_filtering_variety_jitter:19 | Inline Spinner (top), Hair Jig (honorable):10, Suspending Jerkbait (top), Hair Jig (honorable):7, Inline Spinner (top), Casting Spoon (honorable):6, Inline Spinner (top), Suspending Jerkbait (honorable):6 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Suspending Jerkbait [lure] (24), Inline Spinner [lure] (23), Sculpin Streamer [fly] (14), Jighead Marabou Leech [fly] (12), Hair Jig [lure] (7) | Suspending Jerkbait [lure] (33), Inline Spinner [lure] (32), Woolly Bugger [fly] (28), Hair Jig [lure] (25), Sculpin Streamer [fly] (19) |
| calm_surface | big_fish | Small Floating Trout Plug [lure] (39), Articulated Baitfish Streamer [fly] (20), Articulated Dungeon Streamer [fly] (18), Hair Jig [lure] (12), Rabbit-Strip Leech [fly] (12) | Small Floating Trout Plug [lure] (46), Rabbit-Strip Leech [fly] (30), Articulated Baitfish Streamer [fly] (29), Sculpzilla [fly] (26), Hair Jig [lure] (25) |
| low_light_surface | all_purpose | Sculpin Streamer [fly] (13), Inline Spinner [lure] (12), Suspending Jerkbait [lure] (11), Jighead Marabou Leech [fly] (7), Bucktail Streamer [fly] (3) | Inline Spinner [lure] (15), Suspending Jerkbait [lure] (15), Woolly Bugger [fly] (14), Hair Jig [lure] (13), Sculpin Streamer [fly] (13) |
| low_light_surface | big_fish | Small Floating Trout Plug [lure] (16), Articulated Baitfish Streamer [fly] (14), Articulated Dungeon Streamer [fly] (9), Inline Spinner [lure] (6), Hair Jig [lure] (4) | Small Floating Trout Plug [lure] (17), Articulated Baitfish Streamer [fly] (15), Articulated Dungeon Streamer [fly] (15), Sculpzilla [fly] (14), Casting Spoon [lure] (13) |
| wind_reaction | all_purpose | Inline Spinner [lure] (37), Sculpin Streamer [fly] (28), Zonker Streamer [fly] (20), Casting Spoon [lure] (18), Suspending Jerkbait [lure] (16) | Inline Spinner [lure] (57), Suspending Jerkbait [lure] (43), Sculpin Streamer [fly] (39), Casting Spoon [lure] (37), Woolly Bugger [fly] (32) |
| wind_reaction | big_fish | Inline Spinner [lure] (31), Suspending Jerkbait [lure] (23), Rabbit-Strip Leech [fly] (19), Sculpzilla [fly] (19), Casting Spoon [lure] (18) | Casting Spoon [lure] (54), Articulated Baitfish Streamer [fly] (45), Articulated Dungeon Streamer [fly] (43), Inline Spinner [lure] (42), Suspending Jerkbait [lure] (36) |
| dirty_vibration | all_purpose | Sculpin Streamer [fly] (51), Inline Spinner [lure] (48), Hair Jig [lure] (25), Suspending Jerkbait [lure] (25), Zonker Streamer [fly] (20) | Inline Spinner [lure] (68), Sculpin Streamer [fly] (57), Suspending Jerkbait [lure] (55), Hair Jig [lure] (53), Woolly Bugger [fly] (50) |
| dirty_vibration | big_fish | Sculpzilla [fly] (37), Inline Spinner [lure] (36), Articulated Baitfish Streamer [fly] (25), Hair Jig [lure] (25), Articulated Dungeon Streamer [fly] (22) | Casting Spoon [lure] (64), Articulated Baitfish Streamer [fly] (59), Articulated Dungeon Streamer [fly] (58), Hair Jig [lure] (55), Sculpzilla [fly] (54) |
| clear_subtle | all_purpose | Lead-Eye Leech [fly] (21), Hair Jig [lure] (18), Suspending Jerkbait [lure] (18), Sculpin Streamer [fly] (17), Drop-Shot Minnow [lure] (13) | Hair Jig [lure] (31), Suspending Jerkbait [lure] (30), Drop-Shot Minnow [lure] (25), Woolly Bugger [fly] (24), Lead-Eye Leech [fly] (23) |
| clear_subtle | big_fish | Hair Jig [lure] (22), Rabbit-Strip Leech [fly] (19), Suspending Jerkbait [lure] (19), Articulated Dungeon Streamer [fly] (10), Articulated Baitfish Streamer [fly] (9) | Hair Jig [lure] (35), Suspending Jerkbait [lure] (35), Rabbit-Strip Leech [fly] (30), Articulated Baitfish Streamer [fly] (23), Articulated Dungeon Streamer [fly] (21) |
| cold_slow | all_purpose | Hair Jig [lure] (35), Sculpin Streamer [fly] (34), Suspending Jerkbait [lure] (27), Woolly Bugger [fly] (18), Jighead Marabou Leech [fly] (15) | Hair Jig [lure] (52), Sculpin Streamer [fly] (48), Woolly Bugger [fly] (45), Suspending Jerkbait [lure] (43), Jighead Marabou Leech [fly] (42) |
| cold_slow | big_fish | Hair Jig [lure] (37), Rabbit-Strip Leech [fly] (35), Sculpzilla [fly] (28), Suspending Jerkbait [lure] (26), Blade Bait [lure] (21) | Hair Jig [lure] (57), Suspending Jerkbait [lure] (56), Rabbit-Strip Leech [fly] (50), Articulated Dungeon Streamer [fly] (46), Articulated Baitfish Streamer [fly] (41) |
| warming_search | all_purpose | Inline Spinner [lure] (22), Sculpin Streamer [fly] (13), Casting Spoon [lure] (10), Suspending Jerkbait [lure] (10), Zonker Streamer [fly] (8) | Inline Spinner [lure] (27), Suspending Jerkbait [lure] (21), Feather Jig Leech [fly] (18), Hair Jig [lure] (17), Sculpin Streamer [fly] (16) |
| warming_search | big_fish | Inline Spinner [lure] (19), Rabbit-Strip Leech [fly] (13), Casting Spoon [lure] (12), Articulated Baitfish Streamer [fly] (10), Sculpzilla [fly] (10) | Inline Spinner [lure] (25), Casting Spoon [lure] (24), Articulated Baitfish Streamer [fly] (23), Sculpzilla [fly] (22), Articulated Dungeon Streamer [fly] (21) |
| heat_finesse | all_purpose | Drop-Shot Minnow [lure] (24), Woolly Bugger [fly] (19), Inline Spinner [lure] (16), Jighead Marabou Leech [fly] (15), Suspending Jerkbait [lure] (11) | Woolly Bugger [fly] (29), Drop-Shot Minnow [lure] (28), Suspending Jerkbait [lure] (28), Inline Spinner [lure] (26), Jighead Marabou Leech [fly] (18) |
| heat_finesse | big_fish | Drop-Shot Minnow [lure] (22), Rabbit-Strip Leech [fly] (22), Sculpzilla [fly] (13), Inline Spinner [lure] (12), Suspending Jerkbait [lure] (10) | Drop-Shot Minnow [lure] (36), Rabbit-Strip Leech [fly] (30), Articulated Baitfish Streamer [fly] (28), Ned Rig [lure] (28), Sculpzilla [fly] (25) |
| current_swing | all_purpose | Sculpin Streamer [fly] (76), Inline Spinner [lure] (61), Hair Jig [lure] (40), Suspending Jerkbait [lure] (34), Jighead Marabou Leech [fly] (20) | Inline Spinner [lure] (86), Sculpin Streamer [fly] (81), Hair Jig [lure] (74), Suspending Jerkbait [lure] (69), Woolly Bugger [fly] (61) |
| current_swing | big_fish | Sculpzilla [fly] (55), Inline Spinner [lure] (41), Hair Jig [lure] (40), Articulated Baitfish Streamer [fly] (33), Rabbit-Strip Leech [fly] (29) | Sculpzilla [fly] (80), Hair Jig [lure] (77), Casting Spoon [lure] (76), Articulated Dungeon Streamer [fly] (75), Articulated Baitfish Streamer [fly] (74) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 dirty big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (170); Hair Jig (150); Rabbit-Strip Leech (164); Articulated Dungeon Streamer (174) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (178); Hair Jig (158); Rabbit-Strip Leech (164); Articulated Baitfish Streamer (182) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-03-30 clear big_fish B | 38.3-62.8F, 11.8 mph wind, 80.6% cloud, 0 in precip | active, closed, wind_reaction+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (178); Hair Jig (158); Rabbit-Strip Leech (156); Articulated Dungeon Streamer (166) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-03-30 dirty big_fish B | 38.3-62.8F, 11.8 mph wind, 80.6% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (170); Hair Jig (150); Rabbit-Strip Leech (164); Articulated Dungeon Streamer (174) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-03-30 stained big_fish B | 38.3-62.8F, 11.8 mph wind, 80.6% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (178); Hair Jig (158); Rabbit-Strip Leech (164); Articulated Baitfish Streamer (182) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (178); Blade Bait (164); Rabbit-Strip Leech (156); Articulated Dungeon Streamer (166) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-03-18 stained big_fish B | 57.4-75.4F, 14 mph wind, 85.9% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Suspending Jerkbait (156); Inline Spinner (172); Conehead Streamer (172); Articulated Dungeon Streamer (168) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-05-18 clear big_fish B | 62.6-80.4F, 6.5 mph wind, 99.9% cloud, 0.4 in precip | neutral, open, low_light_surface+runoff_streamer+current_swing, medium | Inline Spinner (156); Hair Jig (148); Articulated Baitfish Streamer (168); Rabbit-Strip Leech (146) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-12-12 dirty all_purpose B | 29-45.6F, 5.6 mph wind, 78.3% cloud, 0 in precip | neutral, closed, cold_slow, medium | Ned Rig (168); Hair Jig (172); Lead-Eye Leech (182); Muddler Minnow (180) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-12-12 stained all_purpose B | 29-45.6F, 5.6 mph wind, 78.3% cloud, 0 in precip | neutral, closed, cold_slow, medium | Ned Rig (178); Suspending Jerkbait (166); Sculpin Streamer (198); Lead-Eye Leech (192) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lower Sacramento northern California trout tailwater<br>2025-11-08 stained big_fish B | 51.2-77.6F, 5 mph wind, 42.5% cloud, 0 in precip | neutral, closed, dirty_vibration+runoff_streamer+current_swing, medium | Hair Jig (158); Inline Spinner (146); Rabbit-Strip Leech (164); Articulated Baitfish Streamer (166) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-03-28 stained big_fish B | 27-50.9F, 8.1 mph wind, 99.2% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Suspending Jerkbait (146); Blade Bait (152); Sculpzilla (156); Articulated Dungeon Streamer (158) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Au Sable / Upper Midwest trout river<br>2025-09-21 clear big_fish B | 55.3-73F, 6.4 mph wind, 93.5% cloud, 0.4 in precip | neutral, open, low_light_surface+runoff_streamer+current_swing, medium | Inline Spinner (156); Hair Jig (148); Articulated Baitfish Streamer (168); Sculpzilla (170) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-10-19 dirty big_fish B | 45.6-56.8F, 10.6 mph wind, 95.1% cloud, 0.7 in precip | neutral, closed, wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (180); Suspending Jerkbait (148); Articulated Baitfish Streamer (192); Zonker Streamer (180) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-10-20 dirty all_purpose A | 38.7-57.7F, 6.9 mph wind, 18.8% cloud, 0 in precip | suppressed, closed, dirty_vibration+runoff_streamer+current_swing, medium | Inline Spinner (178); Suspending Jerkbait (150); Sculpin Streamer (184); Woolly Bugger (178) | ADJACENT_DAY_EXACT_REPEAT, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-12-12 clear all_purpose B | 1.7-22.9F, 7.9 mph wind, 99.6% cloud, 0.1 in precip | neutral, closed, wind_reaction+cold_slow, medium | Blade Bait (178); Suspending Jerkbait (176); Lead-Eye Leech (198); Muddler Minnow (192) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Madison River mountain-west trout water<br>2025-11-11 clear big_fish B | 28.2-45.8F, 4.1 mph wind, 64.1% cloud, 0 in precip | neutral, closed, clear_subtle, medium | Ned Rig (150); Hair Jig (174); Articulated Dungeon Streamer (154); Rabbit-Strip Leech (160) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-05-15 dirty big_fish B | 56.7-71.8F, 6 mph wind, 69.9% cloud, 0.1 in precip | neutral, closed, dirty_vibration+warming_search+runoff_streamer+current_swing, medium | Hair Jig (140); Inline Spinner (148); Articulated Baitfish Streamer (176); Rabbit-Strip Leech (154) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-05-15 stained big_fish B | 56.7-71.8F, 6 mph wind, 69.9% cloud, 0.1 in precip | neutral, closed, dirty_vibration+warming_search+runoff_streamer+current_swing, medium | Hair Jig (148); Suspending Jerkbait (140); Rabbit-Strip Leech (154); Articulated Baitfish Streamer (176) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-11-08 clear big_fish B | 39.4-50.9F, 6.5 mph wind, 83.1% cloud, 0.4 in precip | neutral, closed, warming_search+runoff_streamer+current_swing, medium | Hair Jig (158); Inline Spinner (146); Rabbit-Strip Leech (156); Articulated Baitfish Streamer (158) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-11-08 stained big_fish B | 39.4-50.9F, 6.5 mph wind, 83.1% cloud, 0.4 in precip | neutral, closed, dirty_vibration+warming_search+runoff_streamer+current_swing, medium | Hair Jig (158); Inline Spinner (146); Rabbit-Strip Leech (164); Articulated Baitfish Streamer (166) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-12-12 clear all_purpose B | 12.2-29.4F, 9.8 mph wind, 66.5% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, medium | Blade Bait (178); Suspending Jerkbait (176); Lead-Eye Leech (198); Muddler Minnow (192) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Skagit River Pacific Northwest trout water<br>2025-09-29 stained big_fish B | 57.8-61.6F, 1.4 mph wind, 100% cloud, 0.4 in precip | neutral, open, calm_surface+low_light_surface+dirty_vibration+runoff_streamer+current_swing, medium | Inline Spinner (156); Hair Jig (148); Articulated Dungeon Streamer (184); Sculpzilla (178) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Elk River Appalachian trout water<br>2025-06-17 clear big_fish B | 64.8-77.5F, 8.2 mph wind, 61.9% cloud, 0.3 in precip | neutral, caution, wind_reaction+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (156); Inline Spinner (188); Bucktail Streamer (188); Articulated Baitfish Streamer (184) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (192); Blade Bait (180); Lead-Eye Leech (182); Zonker Streamer (190) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (174); Casting Spoon (174); Articulated Baitfish Streamer (174); Sculpzilla (180) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (200); Hair Jig (168); Sculpin Streamer (194); Feather Jig Leech (192) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (208); Casting Spoon (174); Sculpin Streamer (194); Feather Jig Leech (192) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (174); Blade Bait (164); Articulated Dungeon Streamer (174); Sculpzilla (188) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-03-18 clear big_fish A | 57.4-75.4F, 14 mph wind, 85.9% cloud, 0 in precip | active, closed, wind_reaction+open_water_search, medium | Casting Spoon (184); Inline Spinner (172); Articulated Baitfish Streamer (168); Rabbit-Strip Leech (146) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-03-18 clear big_fish B | 57.4-75.4F, 14 mph wind, 85.9% cloud, 0 in precip | active, closed, wind_reaction+open_water_search, medium | Suspending Jerkbait (156); Inline Spinner (172); Bucktail Streamer (172); Articulated Dungeon Streamer (160) | BIG_FISH_NOT_FAVORING_UPSIDE |
| White River Ozark trout tailwater<br>2025-03-18 dirty all_purpose A | 57.4-75.4F, 14 mph wind, 85.9% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Casting Spoon (176); Suspending Jerkbait (178); Woolly Bugger (162); Rabbit-Strip Leech (152) | WIND_NOT_ELEVATING_REACTION |

## Known Coverage Gaps

- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
