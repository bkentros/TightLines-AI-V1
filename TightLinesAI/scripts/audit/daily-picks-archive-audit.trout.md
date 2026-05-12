# FinFindr Trout Daily-Picks Archive Audit
Generated: 2026-05-12T12:53:45.322Z

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
| breezy_windy_stained_reaction | 96 |
| dirty_vibration | 144 |
| cold_slow_or_front | 300 |
| warming_search | 168 |
| heat_limited_finesse | 24 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 192 |
| river_elevated_runoff_current | 324 |
| medium_confidence_archive | 684 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 1 |
| adjacent_day_change | 1 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-09-20 -> 2025-09-21 | changed | 2.5 | 3.7 | wind_reaction|dirty_vibration|runoff_streamer|current_swing|open_water_search -> low_light_surface|wind_reaction|dirty_vibration|runoff_streamer|current_swing|open_water_search |
| Au Sable / Upper Midwest trout river<br>2025-10-19 -> 2025-10-20 | similar | 3.7 | 0.5 | wind_reaction|dirty_vibration|runoff_streamer|current_swing|open_water_search -> wind_reaction|dirty_vibration|runoff_streamer|current_swing|open_water_search |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 17 | WIND_NOT_ELEVATING_REACTION (17), BIG_FISH_NOT_FAVORING_UPSIDE (1) |
| calm_bright_clear_subtle | 7 | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (6), BIG_FISH_NOT_FAVORING_UPSIDE (1) |
| calm_low_light_surface | 1 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1) |
| cold_slow_or_front | 35 | WIND_NOT_ELEVATING_REACTION (28), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (4), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2), BIG_FISH_NOT_FAVORING_UPSIDE (2), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| dirty_vibration | 25 | WIND_NOT_ELEVATING_REACTION (24), BIG_FISH_NOT_FAVORING_UPSIDE (1), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| heat_limited_finesse | 6 | BIG_FISH_NOT_FAVORING_UPSIDE (6) |
| medium_confidence_archive | 100 | WIND_NOT_ELEVATING_REACTION (73), BIG_FISH_NOT_FAVORING_UPSIDE (14), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (9), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (8), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| river_elevated_runoff_current | 47 | WIND_NOT_ELEVATING_REACTION (48), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| stable_pleasant_medium_confidence_archive | 27 | WIND_NOT_ELEVATING_REACTION (22), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (3) |
| warming_search | 32 | WIND_NOT_ELEVATING_REACTION (23), BIG_FISH_NOT_FAVORING_UPSIDE (6), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (2) |

- WIND_NOT_ELEVATING_REACTION: 73
- BIG_FISH_NOT_FAVORING_UPSIDE: 14
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 9
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 8
- DIRTY_WIND_NOT_ELEVATING_VIBRATION: 1

- mi_au_sable_trout__2025-03-28__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Blade Bait (lure); Game Changer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Blade Bait (lure); Inline Spinner (lure); Sculpzilla (fly); Rabbit-Strip Leech (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Soft Plastic Jerkbait (lure); Hair Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Soft Plastic Jerkbait (lure); Unweighted Baitfish Streamer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-09-20__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Soft Plastic Jerkbait (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Blade Bait (lure); Sculpin Streamer (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Soft Plastic Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Hair Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Sculpin Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Blade Bait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Inline Spinner (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Blade Bait (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Soft Plastic Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Inline Spinner (lure); Articulated Baitfish Streamer (fly); Clouser Minnow (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-04-12__freshwater_river__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Hair Jig (lure); Ned Rig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Game Changer (fly); Clouser Minnow (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Soft Plastic Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Inline Spinner (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Soft Plastic Jerkbait (lure); Inline Spinner (lure); Game Changer (fly); Sculpzilla (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Ned Rig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Casting Spoon (lure); Ned Rig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Small Floating Trout Plug (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Small Floating Trout Plug (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ca_lower_sac_trout__2025-05-23__freshwater_river__clear__all_purpose__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Conehead Streamer (fly); Zonker Streamer (fly)
- wa_skagit_trout__2025-06-14__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Small Floating Trout Plug (lure); Game Changer (fly); Woolly Bugger (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Clouser Minnow (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-06-21__freshwater_river__dirty__all_purpose__A: DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Inline Spinner (lure); Hair Jig (lure); Clouser Minnow (fly); Muddler Minnow (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__clear__all_purpose__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Zonker Streamer (fly); Baitfish Slider Fly (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Game Changer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-07-12__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Small Floating Trout Plug (lure); Clouser Minnow (fly); Woolly Bugger (fly)
- mt_madison_trout__2025-07-19__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mt_madison_trout__2025-07-19__freshwater_river__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Soft Plastic Jerkbait (lure); Clouser Minnow (fly); Game Changer (fly)
- mt_madison_trout__2025-07-19__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Game Changer (fly); Sculpzilla (fly)
- ca_lower_sac_trout__2025-07-24__freshwater_river__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Inline Spinner (lure); Small Floating Trout Plug (lure); Feather Jig Leech (fly); Clouser Minnow (fly)
- ar_white_river_trout__2025-07-28__freshwater_river__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Small Floating Trout Plug (lure); Conehead Streamer (fly); Feather Jig Leech (fly)
- ar_white_river_trout__2025-07-28__freshwater_river__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Small Floating Trout Plug (lure); Feather Jig Leech (fly); Baitfish Slider Fly (fly)
- ny_upper_delaware_trout__2025-08-12__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Soft Plastic Jerkbait (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-08-12__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 51
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 35
- ADJACENT_DAY_EXACT_REPEAT: 9

- mi_au_sable_trout__2025-10-20__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Inline Spinner (lure); Blade Bait (lure); Zonker Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Bucktail Streamer (fly); Clouser Minnow (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Clouser Minnow (fly); Bucktail Streamer (fly)
- ny_upper_delaware_trout__2025-06-21__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Bucktail Streamer (fly); Clouser Minnow (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Bucktail Streamer (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Casting Spoon (lure); Inline Spinner (lure); Conehead Streamer (fly); Bucktail Streamer (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Small Floating Trout Plug (lure); Inline Spinner (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-10-20__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Casting Spoon (lure); Inline Spinner (lure); Zonker Streamer (fly); Conehead Streamer (fly)
- ny_upper_delaware_trout__2025-12-12__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- mi_au_sable_trout__2025-12-12__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Sculpin Streamer (fly); Zonker Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Blade Bait (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Sculpin Streamer (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-03-26__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- wv_elk_river_trout__2025-03-26__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Hair Jig (lure); Conehead Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Hair Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Conehead Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Suspending Jerkbait (lure); Conehead Streamer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Inline Spinner (lure); Articulated Baitfish Streamer (fly); Clouser Minnow (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-04-17__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-04-17__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Conehead Streamer (fly); Articulated Baitfish Streamer (fly)
- ca_lower_sac_trout__2025-04-27__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Inline Spinner (lure); Rabbit-Strip Leech (fly); Woolly Bugger (fly)
- mt_madison_trout__2025-05-06__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Clouser Minnow (fly); Muddler Minnow (fly)
- ny_upper_delaware_trout__2025-05-15__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Conehead Streamer (fly); Zonker Streamer (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Small Floating Trout Plug (lure); Inline Spinner (lure); Conehead Streamer (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Inline Spinner (lure); Articulated Baitfish Streamer (fly); Zonker Streamer (fly)
- mi_au_sable_trout__2025-05-23__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ca_lower_sac_trout__2025-05-23__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Soft Plastic Jerkbait (lure); Slim Baitfish Streamer (fly); Bucktail Streamer (fly)
- mt_madison_trout__2025-06-07__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Small Floating Trout Plug (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Bucktail Streamer (fly); Conehead Streamer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Hair Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Inline Spinner (lure); Bucktail Streamer (fly); Clouser Minnow (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Clouser Minnow (fly); Baitfish Slider Fly (fly)
- mi_au_sable_trout__2025-07-16__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Clouser Minnow (fly); Bucktail Streamer (fly)
- mt_madison_trout__2025-07-19__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Baitfish Slider Fly (fly); Bucktail Streamer (fly)
- mt_madison_trout__2025-07-19__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Clouser Minnow (fly); Zonker Streamer (fly)
- mt_madison_trout__2025-08-23__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Hair Jig (lure); Clouser Minnow (fly); Woolly Bugger (fly)
- ny_upper_delaware_trout__2025-09-13__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Small Floating Trout Plug (lure); Suspending Jerkbait (lure); Mouse Fly (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-09-13__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Small Floating Trout Plug (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-09-20__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-09-20__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Bucktail Streamer (fly)

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
| Apr | great_lakes_upper_midwest | cooling_or_shock:1 |
| Apr | northeast | cold_slow:1 |
| Apr | northern_california | cold_slow:1 |
| Apr | south_central | stable:1 |
| May | great_lakes_upper_midwest | cold_slow:1 |
| May | mountain_west | cold_slow:1 |
| May | northeast | warming:1 |
| May | northern_california | stable:1 |
| May | pacific_northwest | cold_slow:1 |
| May | south_central | stable:1 |
| Jun | appalachian | stable:1 |
| Jun | mountain_west | cooling_or_shock:1 |
| Jun | northeast | cooling_or_shock:1 |
| Jun | northern_california | cooling_or_shock:1 |
| Jun | pacific_northwest | stable:1 |
| Jun | south_central | stable:1 |
| Jul | great_lakes_upper_midwest | warming:1 |
| Jul | mountain_west | stable:1 |
| Jul | northeast | stable:1 |
| Jul | northern_california | warming:1 |
| Jul | south_central | warming:1 |
| Aug | great_lakes_upper_midwest | stable:1 |
| Aug | mountain_west | cooling_or_shock:1 |
| Aug | northeast | heat_limited:1 |
| Aug | northern_california | stable:1 |
| Aug | pacific_northwest | stable:1 |
| Aug | south_central | stable:1 |
| Sep | great_lakes_upper_midwest | cooling_or_shock:1, stable:1 |
| Sep | mountain_west | warming:1 |
| Sep | northeast | cooling_or_shock:1 |
| Sep | northern_california | cooling_or_shock:1 |
| Sep | pacific_northwest | stable:1 |
| Sep | south_central | heat_limited:1 |
| Oct | great_lakes_upper_midwest | stable:1, cooling_or_shock:1 |
| Oct | mountain_west | cold_slow:1 |
| Oct | northeast | cooling_or_shock:1 |
| Oct | northern_california | cold_slow:1 |
| Oct | pacific_northwest | cold_slow:1 |
| Oct | south_central | warming:1 |
| Nov | mountain_west | warming:1 |
| Nov | northeast | warming:1 |
| Nov | northern_california | warming:1 |
| Nov | pacific_northwest | stable:1 |
| Dec | great_lakes_upper_midwest | cold_slow:1 |
| Dec | northeast | cold_slow:1 |
| Dec | south_central | warming:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

| Scenario | Temp | Top winners needing review |
| --- | --- | --- |
| Upper Delaware trout river<br>2025-08-12 clear all_purpose A | 60.1-88.8F | Soft Plastic Jerkbait (medium) |
| Upper Delaware trout river<br>2025-08-12 clear all_purpose B | 60.1-88.8F | Slim Baitfish Streamer (medium) |
| Upper Delaware trout river<br>2025-08-12 clear big_fish A | 60.1-88.8F | Unweighted Baitfish Streamer (medium) |
| Upper Delaware trout river<br>2025-08-12 clear big_fish B | 60.1-88.8F | Articulated Baitfish Streamer (medium) |
| Upper Delaware trout river<br>2025-08-12 stained all_purpose A | 60.1-88.8F | Soft Plastic Jerkbait (medium) |
| Upper Delaware trout river<br>2025-08-12 stained all_purpose B | 60.1-88.8F | Clouser Minnow (medium) |
| Upper Delaware trout river<br>2025-08-12 stained big_fish A | 60.1-88.8F | Game Changer (medium) |
| Upper Delaware trout river<br>2025-08-12 stained big_fish B | 60.1-88.8F | Suspending Jerkbait (medium); Articulated Baitfish Streamer (medium) |
| Upper Delaware trout river<br>2025-08-12 dirty all_purpose A | 60.1-88.8F | Bucktail Streamer (medium) |
| Upper Delaware trout river<br>2025-08-12 dirty all_purpose B | 60.1-88.8F | Suspending Jerkbait (medium); Game Changer (medium) |
| Upper Delaware trout river<br>2025-08-12 dirty big_fish B | 60.1-88.8F | Inline Spinner (medium); Game Changer (medium) |
| White River Ozark trout tailwater<br>2025-09-18 clear all_purpose A | 67.2-94.5F | Suspending Jerkbait (medium) |
| White River Ozark trout tailwater<br>2025-09-18 clear all_purpose B | 67.2-94.5F | Clouser Minnow (medium) |
| White River Ozark trout tailwater<br>2025-09-18 clear big_fish A | 67.2-94.5F | Game Changer (medium) |
| White River Ozark trout tailwater<br>2025-09-18 clear big_fish B | 67.2-94.5F | Soft Plastic Jerkbait (medium) |
| White River Ozark trout tailwater<br>2025-09-18 stained all_purpose A | 67.2-94.5F | Inline Spinner (medium) |
| White River Ozark trout tailwater<br>2025-09-18 stained all_purpose B | 67.2-94.5F | Clouser Minnow (medium) |
| White River Ozark trout tailwater<br>2025-09-18 stained big_fish A | 67.2-94.5F | Game Changer (medium) |
| White River Ozark trout tailwater<br>2025-09-18 stained big_fish B | 67.2-94.5F | Soft Plastic Jerkbait (medium) |
| White River Ozark trout tailwater<br>2025-09-18 dirty all_purpose A | 67.2-94.5F | Casting Spoon (medium); Clouser Minnow (medium) |

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Aug | great_lakes_upper_midwest | open | bright | big_fish | 5 | 56.3-78.6F | 3.1 |
| Aug | mountain_west | open | mixed | big_fish | 6 | 43.3-76.4F | 3.3 |
| Aug | northern_california | open | mixed | big_fish | 6 | 70.7-89.2F | 5.2 |
| Aug | pacific_northwest | open | mixed | big_fish | 5 | 57.1-79.6F | 4.2 |
| Aug | south_central | open | bright | all_purpose | 1 | 71.7-88.4F | 4.9 |
| Aug | south_central | open | bright | big_fish | 5 | 71.7-88.4F | 4.9 |
| Jul | great_lakes_upper_midwest | open | mixed | big_fish | 4 | 67.2-85.6F | 5.5 |
| Jul | northeast | open | mixed | all_purpose | 1 | 66.4-85.7F | 5.5 |
| Jul | northeast | open | mixed | big_fish | 5 | 66.4-85.7F | 5.5 |
| Jul | northern_california | open | mixed | all_purpose | 1 | 67.5-93.9F | 5.1 |
| Jul | northern_california | open | mixed | big_fish | 6 | 67.5-93.9F | 5.1 |
| Jul | south_central | open | mixed | all_purpose | 2 | 78.8-96.4F | 4.5 |
| Jul | south_central | open | mixed | big_fish | 6 | 78.8-96.4F | 4.5 |
| Jun | mountain_west | open | mixed | big_fish | 5 | 39.2-65.3F | 5.2 |
| Jun | northeast | open | mixed | big_fish | 3 | 58.2-80.4F | 4.4 |
| Jun | pacific_northwest | open | low_light | all_purpose | 1 | 51.5-63.4F | 3.8 |
| Jun | pacific_northwest | open | low_light | big_fish | 5 | 51.5-63.4F | 3.8 |
| Jun | south_central | open | low_light | big_fish | 3 | 73.6-84.9F | 3.8 |
| May | northern_california | open | glare | big_fish | 5 | 56.1-85.7F | 3.7 |
| May | south_central | open | low_light | big_fish | 3 | 62.6-80.4F | 6.5 |
| Sep | great_lakes_upper_midwest | open | low_light | big_fish | 3 | 55.3-73.0F | 6.4 |
| Sep | mountain_west | open | glare | big_fish | 5 | 36.3-64.9F | 5 |
| Sep | northeast | open | mixed | all_purpose | 2 | 51.9-74.6F | 3.6 |
| Sep | northeast | open | mixed | big_fish | 6 | 51.9-74.6F | 3.6 |
| Sep | pacific_northwest | open | low_light | big_fish | 5 | 57.8-61.6F | 1.4 |

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
| lure | 214 | 214 | 143 |
| fly | 303 | 303 | 250 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 228 | - |
| open-surface rows with 2+ surface picks | 25 | 25 |
| open-surface rows with 3+ surface picks | 0 | 0 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 10 | 10 |
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
| exact_id | unavoidable_due_score_band | 50 | 0 | 50 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 5 | 0 | 5 |
| same_family_same_presentation | truly_avoidable | 0 | 51 | 51 |
| same_family_same_presentation | unavoidable_due_score_band | 0 | 18 | 18 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 11 | 11 |
| same_family_different_presentation | truly_avoidable | 0 | 35 | 35 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 35 | 35 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 7 | 7 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 2 | 2 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (168); Articulated Dungeon Streamer (164) | Sculpzilla (178); Articulated Baitfish Streamer (148) | Sculpin Streamer (182, alt edge 34) |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (176); Articulated Dungeon Streamer (172) | Sculpzilla (186); Articulated Baitfish Streamer (156) | Sculpin Streamer (182, alt edge 26) |
| Elk River Appalachian trout water<br>2025-02-20 stained big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (176); Articulated Dungeon Streamer (172) | Sculpzilla (186); Articulated Baitfish Streamer (156) | Sculpin Streamer (182, alt edge 26) |
| Upper Delaware trout river<br>2025-01-18 clear big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (164); Sculpzilla (178) | Rabbit-Strip Leech (168); Articulated Baitfish Streamer (148) | Jighead Marabou Leech (172, alt edge 24) |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose | fly honorable: same_family_same_presentation | Sculpin Streamer (180); Bucktail Streamer (190) | Clouser Minnow (192); Sculpzilla (168) | Conehead Streamer (190, alt edge 22) |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Articulated Dungeon Streamer (172) | Rabbit-Strip Leech (176); Articulated Baitfish Streamer (156) | Jighead Marabou Leech (172, alt edge 16) |
| Upper Delaware trout river<br>2025-01-18 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Articulated Dungeon Streamer (172) | Rabbit-Strip Leech (176); Articulated Baitfish Streamer (156) | Jighead Marabou Leech (172, alt edge 16) |
| Elk River Appalachian trout water<br>2025-02-20 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Articulated Dungeon Streamer (172) | Rabbit-Strip Leech (176); Articulated Baitfish Streamer (156) | Jighead Marabou Leech (172, alt edge 16) |
| Upper Delaware trout river<br>2025-12-12 dirty all_purpose | fly honorable: same_family_same_presentation | Sculpin Streamer (168); Woolly Bugger (164) | Rabbit-Strip Leech (174); Muddler Minnow (160) | Jighead Marabou Leech (174, alt edge 14) |
| Madison River mountain-west trout water<br>2025-09-27 clear big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (160); Sculpzilla (138) | Game Changer (160); Articulated Baitfish Streamer (152) | Mouse Fly (162, alt edge 10) |
| Lower Sacramento northern California trout tailwater<br>2025-11-08 clear big_fish | fly honorable: same_family_different_presentation | Sculpzilla (180); Articulated Dungeon Streamer (166) | Game Changer (150); Articulated Baitfish Streamer (158) | Feather Jig Leech (166, alt edge 8) |
| Lower Sacramento northern California trout tailwater<br>2025-05-23 clear all_purpose | fly honorable: same_family_same_presentation | Conehead Streamer (152); Zonker Streamer (152) | Slim Baitfish Streamer (164); Bucktail Streamer (152) | Unweighted Baitfish Streamer (158, alt edge 6) |
| Au Sable / Upper Midwest trout river<br>2025-09-21 clear big_fish | fly top: same_family_same_presentation | Game Changer (176); Articulated Dungeon Streamer (176) | Articulated Baitfish Streamer (184); Sculpzilla (170) | Bucktail Streamer (188, alt edge 4) |
| Au Sable / Upper Midwest trout river<br>2025-10-20 clear big_fish | fly top: same_family_same_presentation | Articulated Dungeon Streamer (176); Game Changer (176) | Articulated Baitfish Streamer (184); Sculpzilla (170) | Bucktail Streamer (188, alt edge 4) |
| Upper Delaware trout river<br>2025-04-17 clear big_fish | fly top: same_family_same_presentation | Game Changer (176); Articulated Dungeon Streamer (176) | Articulated Baitfish Streamer (184); Sculpzilla (170) | Bucktail Streamer (188, alt edge 4) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 dirty | B | 3/4 | Inline Spinner; Blade Bait; Sculpin Streamer; Articulated Baitfish Streamer | Blade Bait; Inline Spinner; Sculpzilla; Articulated Baitfish Streamer |
| White River Ozark trout tailwater<br>2025-03-18 stained | B | 3/4 | Suspending Jerkbait; Soft Plastic Jerkbait; Game Changer; Articulated Baitfish Streamer | Inline Spinner; Soft Plastic Jerkbait; Game Changer; Articulated Baitfish Streamer |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty | A | 4/4 | Casting Spoon; Suspending Jerkbait; Articulated Baitfish Streamer; Game Changer | Suspending Jerkbait; Casting Spoon; Game Changer; Articulated Baitfish Streamer |
| White River Ozark trout tailwater<br>2025-04-12 dirty | B | 3/4 | Inline Spinner; Hair Jig; Game Changer; Articulated Baitfish Streamer | Inline Spinner; Hair Jig; Articulated Baitfish Streamer; Sculpzilla |
| Au Sable / Upper Midwest trout river<br>2025-04-24 dirty | A | 4/4 | Casting Spoon; Suspending Jerkbait; Bucktail Streamer; Articulated Baitfish Streamer | Suspending Jerkbait; Casting Spoon; Bucktail Streamer; Articulated Baitfish Streamer |
| Au Sable / Upper Midwest trout river<br>2025-04-24 dirty | B | 3/4 | Inline Spinner; Soft Plastic Jerkbait; Conehead Streamer; Game Changer | Soft Plastic Jerkbait; Inline Spinner; Game Changer; Sculpzilla |
| White River Ozark trout tailwater<br>2025-07-28 dirty | B | 3/4 | Soft Plastic Jerkbait; Inline Spinner; Articulated Baitfish Streamer; Game Changer | Soft Plastic Jerkbait; Small Floating Trout Plug; Game Changer; Articulated Baitfish Streamer |
| Upper Delaware trout river<br>2025-08-12 dirty | B | 3/4 | Suspending Jerkbait; Inline Spinner; Game Changer; Articulated Baitfish Streamer | Inline Spinner; Suspending Jerkbait; Game Changer; Rabbit-Strip Leech |
| Lower Sacramento northern California trout tailwater<br>2025-09-15 dirty | B | 3/4 | Inline Spinner; Soft Plastic Jerkbait; Zonker Streamer; Baitfish Slider Fly | Inline Spinner; Soft Plastic Jerkbait; Zonker Streamer; Articulated Baitfish Streamer |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-03-28 clear B | lure | Inline Spinner; Blade Bait |
| Au Sable / Upper Midwest trout river<br>2025-03-28 stained B | lure | Inline Spinner; Blade Bait |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty B | lure | Blade Bait; Inline Spinner |
| White River Ozark trout tailwater<br>2025-04-12 stained A | lure | Blade Bait; Suspending Jerkbait |
| White River Ozark trout tailwater<br>2025-04-12 stained B | lure | Inline Spinner; Soft Plastic Jerkbait |
| White River Ozark trout tailwater<br>2025-04-12 dirty A | lure | Soft Plastic Jerkbait; Casting Spoon |
| White River Ozark trout tailwater<br>2025-04-12 dirty B | lure | Inline Spinner; Hair Jig |
| Skagit River Pacific Northwest trout water<br>2025-05-08 stained B | lure | Inline Spinner; Ned Rig |
| Skagit River Pacific Northwest trout water<br>2025-05-08 dirty B | lure | Casting Spoon; Ned Rig |
| Upper Delaware trout river<br>2025-08-12 clear B | lure | Ned Rig; Soft Plastic Jerkbait |
| Upper Delaware trout river<br>2025-08-12 stained B | lure | Suspending Jerkbait; Inline Spinner |
| Upper Delaware trout river<br>2025-08-12 dirty B | lure | Inline Spinner; Suspending Jerkbait |
| White River Ozark trout tailwater<br>2025-09-18 clear B | lure | Soft Plastic Jerkbait; Ned Rig |
| White River Ozark trout tailwater<br>2025-09-18 stained B | lure | Soft Plastic Jerkbait; Inline Spinner |
| White River Ozark trout tailwater<br>2025-09-18 dirty B | lure | Inline Spinner; Soft Plastic Jerkbait |
| Upper Delaware trout river<br>2025-10-04 stained A | lure | Suspending Jerkbait; Hair Jig |
| Upper Delaware trout river<br>2025-10-04 stained B | lure | Inline Spinner; Soft Plastic Jerkbait |
| Upper Delaware trout river<br>2025-10-04 dirty A | lure | Hair Jig; Inline Spinner |
| Upper Delaware trout river<br>2025-10-04 dirty B | lure | Suspending Jerkbait; Casting Spoon |
| White River Ozark trout tailwater<br>2025-10-14 stained B | lure | Suspending Jerkbait; Inline Spinner |
| White River Ozark trout tailwater<br>2025-10-14 dirty B | lure | Inline Spinner; Hair Jig |
| Madison River mountain-west trout water<br>2025-11-11 clear B | lure | Ned Rig; Blade Bait |
| Madison River mountain-west trout water<br>2025-11-11 stained B | lure | Hair Jig; Ned Rig |
| Madison River mountain-west trout water<br>2025-11-11 dirty B | lure | Hair Jig; Blade Bait |
| White River Ozark trout tailwater<br>2025-12-12 clear B | lure | Hair Jig; Ned Rig |
| White River Ozark trout tailwater<br>2025-12-12 stained B | lure | Hair Jig; Ned Rig |
| White River Ozark trout tailwater<br>2025-12-12 dirty B | lure | Ned Rig; Blade Bait |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Inline Spinner [lure] | 10 | Casting Spoon (5), Hair Jig (4), Suspending Jerkbait (1) | 10.4 |
| Ned Rig [lure] | 5 | Hair Jig (2), Suspending Jerkbait (2), Casting Spoon (1) | 18.8 |
| Blade Bait [lure] | 4 | Casting Spoon (4) | 12.5 |
| Soft Plastic Jerkbait [lure] | 4 | Hair Jig (4) | 14 |
| Suspending Jerkbait [lure] | 3 | Hair Jig (2), Casting Spoon (1) | 6.7 |
| Casting Spoon [lure] | 1 | Suspending Jerkbait (1) | 28 |
| Hair Jig [lure] | 1 | Casting Spoon (1) | 20 |

## Pike Big Fish Upside Split Diagnostics

Not applicable.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -2) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (166; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (178, alt edge 12) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (192; condition_tag:current_swing:+16, condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Sculpzilla (168; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16) | Bucktail Streamer (190, alt edge -2) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (174; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Sculpzilla (188; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -10) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (182, alt edge 2) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (172, alt edge -4) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (184, alt edge 16) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (172, alt edge -4) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (176, alt edge 8) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (164, alt edge -12) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Sculpzilla (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -2) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (166; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (178, alt edge 12) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (190, alt edge 10) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (182; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -4) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (174; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (170, alt edge -4) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (150; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (162, alt edge -4) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Sculpzilla (156; goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (162, alt edge -4) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (158; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Game Changer (158; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (166, alt edge 8) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (154, alt edge -12) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (156; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (150; goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (154, alt edge -2) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (176; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Sculpzilla (170; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (188, alt edge 12) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (184; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (188, alt edge 4) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (178; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (184; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (188, alt edge 4) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (184; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Clouser Minnow (194; condition_tag:current_swing:+16, condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (192, alt edge -2) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (178; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (192; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (180, alt edge -12) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| current_open_water_acceptable | 39 |
| clear_subtle_wind_watch | 29 |
| surface_low_light_acceptable | 2 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-01-16 big_fish clear A | warming_search<br>neutral | Hair Jig 186<br>Casting Spoon 174 |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-01-16 big_fish clear B | warming_search<br>neutral | Suspending Jerkbait 174<br>Blade Bait 164 |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-03-18 big_fish clear A | cold_slow_or_front<br>active | Suspending Jerkbait 168<br>Casting Spoon 184 |
| clear_subtle_wind_watch | Upper Delaware trout river<br>2025-03-30 big_fish clear A | warming_search<br>active | Suspending Jerkbait 158<br>Blade Bait 164 |
| clear_subtle_wind_watch | Upper Delaware trout river<br>2025-03-30 big_fish clear B | warming_search<br>active | Casting Spoon 174<br>Hair Jig 170 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Hair Jig 176<br>Suspending Jerkbait 176 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Casting Spoon 174<br>Hair Jig 170 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 all_purpose dirty B | dirty_vibration<br>neutral | Inline Spinner 200<br>Blade Bait 170 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-03-18 all_purpose stained B | breezy_windy_stained_reaction<br>active | Suspending Jerkbait 186<br>Soft Plastic Jerkbait 176 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-03-18 big_fish stained B | breezy_windy_stained_reaction<br>active | Inline Spinner 172<br>Soft Plastic Jerkbait 158 |
| surface_low_light_acceptable | White River Ozark trout tailwater<br>2025-05-18 big_fish dirty A | dirty_vibration<br>neutral | Casting Spoon 176<br>Small Floating Trout Plug 170 |
| surface_low_light_acceptable | Au Sable / Upper Midwest trout river<br>2025-09-21 big_fish dirty B | dirty_vibration<br>neutral | Small Floating Trout Plug 170<br>Inline Spinner 180 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 227 |
| acceptable_fit | 721 |
| strong_fit | 1788 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | B | fly | medium_confidence_archive | 60 |
| watch | big_fish | A | fly | medium_confidence_archive | 56 |
| watch | big_fish | B | lure | medium_confidence_archive | 40 |
| watch | big_fish | B | fly | cold_slow_or_front | 27 |
| watch | big_fish | A | fly | cold_slow_or_front | 26 |
| watch | all_purpose | A | lure | medium_confidence_archive | 25 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 22 |
| watch | big_fish | A | fly | dirty_vibration | 20 |
| watch | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 20 |
| watch | big_fish | A | lure | medium_confidence_archive | 18 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 18 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 17 |
| watch | all_purpose | A | fly | medium_confidence_archive | 16 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 14 |
| watch | big_fish | A | fly | warming_search | 14 |
| watch | big_fish | B | fly | dirty_vibration | 14 |
| watch | big_fish | B | lure | warming_search | 13 |
| watch | all_purpose | A | lure | river_elevated_runoff_current | 12 |
| watch | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 10 |
| watch | big_fish | B | fly | warming_search | 10 |
| watch | big_fish | B | lure | cold_slow_or_front | 10 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 9 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 9 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 9 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 9 |
| watch | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 9 |
| watch | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 8 |
| watch | all_purpose | A | lure | warming_search | 8 |
| watch | big_fish | B | lure | heat_limited_finesse | 8 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 7 |
| watch | all_purpose | B | fly | medium_confidence_archive | 6 |
| watch | all_purpose | B | lure | medium_confidence_archive | 6 |
| watch | big_fish | B | fly | calm_bright_clear_subtle | 6 |
| watch | all_purpose | A | lure | dirty_vibration | 5 |
| watch | big_fish | A | lure | cold_slow_or_front | 5 |
| watch | big_fish | B | fly | calm_low_light_surface | 5 |
| watch | all_purpose | A | fly | cold_slow_or_front | 4 |
| watch | all_purpose | A | lure | heat_limited_finesse | 4 |
| watch | all_purpose | B | fly | cold_slow_or_front | 4 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 4 |
| watch | big_fish | A | lure | warming_search | 4 |
| watch | all_purpose | A | fly | warming_search | 3 |
| watch | all_purpose | A | lure | calm_low_light_surface | 3 |
| watch | all_purpose | A | lure | cold_slow_or_front | 3 |
| watch | all_purpose | B | lure | cold_slow_or_front | 3 |
| watch | big_fish | A | fly | calm_low_light_surface | 3 |
| watch | big_fish | B | fly | heat_limited_finesse | 3 |
| watch | all_purpose | A | lure | calm_bright_clear_subtle | 2 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 2 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 2 |
| watch | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 2 |
| watch | big_fish | A | fly | heat_limited_finesse | 2 |
| watch | all_purpose | A | fly | calm_low_light_surface | 1 |
| watch | all_purpose | A | fly | heat_limited_finesse | 1 |
| watch | all_purpose | B | fly | calm_bright_clear_subtle | 1 |
| watch | all_purpose | B | lure | calm_low_light_surface | 1 |
| watch | all_purpose | B | lure | dirty_vibration | 1 |
| watch | all_purpose | B | lure | warming_search | 1 |
| watch | big_fish | A | lure | calm_low_light_surface | 1 |
| watch | big_fish | B | lure | calm_bright_clear_subtle | 1 |
| watch | big_fish | B | lure | calm_low_light_surface | 1 |
| watch | big_fish | B | lure | dirty_vibration | 1 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 131 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 108 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 104 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 91 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 90 |
| acceptable_fit | all_purpose | A | fly | medium_confidence_archive | 75 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 73 |
| acceptable_fit | big_fish | A | lure | medium_confidence_archive | 49 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 47 |
| acceptable_fit | big_fish | B | lure | river_elevated_runoff_current | 45 |
| acceptable_fit | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 39 |
| acceptable_fit | big_fish | B | fly | warming_search | 38 |
| acceptable_fit | all_purpose | B | lure | warming_search | 37 |
| acceptable_fit | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 37 |
| acceptable_fit | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 34 |
| acceptable_fit | big_fish | B | lure | warming_search | 34 |
| acceptable_fit | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 33 |
| acceptable_fit | big_fish | B | lure | dirty_vibration | 33 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 8 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 8 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| White River Ozark trout tailwater<br>2025-05-18 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-05-23 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-09-21 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Madison River mountain-west trout water<br>2025-05-06 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 clear all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 stained all_purpose A | Inline Spinner (honorable_lure, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-04-04 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-05-18 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-05-23 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-09-21 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Madison River mountain-west trout water<br>2025-05-06 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-04-04 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-04-04 dirty all_purpose B | Inline Spinner (honorable_lure, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose A | Inline Spinner (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-03-30 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 clear all_purpose A | Hair Jig (honorable_lure, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 1152 | 549 | 48% |
| clear_subtle | 528 | 257 | 49% |
| dirty_vibration | 1152 | 0 | 0% |
| heat_finesse | 96 | 12 | 13% |
| cold_slow | 672 | 392 | 58% |
| low_light_surface | 240 | 21 | 9% |
| calm_surface | 816 | 118 | 14% |
| Trout dirty/runoff/current fit | 1584 | 1459 | 92% |
| Big Fish upside | 1368 | 1152 | 84% |
| All Purpose reliable/versatile | 1368 | 1359 | 99% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Suspending Jerkbait [lure] (268), Hair Jig [lure] (253), Inline Spinner [lure] (237), Casting Spoon [lure] (212), Articulated Baitfish Streamer [fly] (204), Soft Plastic Jerkbait [lure] (161), Game Changer [fly] (160), Sculpzilla [fly] (135), Articulated Dungeon Streamer [fly] (121), Clouser Minnow [fly] (109), Blade Bait [lure] (98), Small Floating Trout Plug [lure] (90) |
| All-purpose | Inline Spinner [lure] (174), Suspending Jerkbait [lure] (148), Hair Jig [lure] (114), Clouser Minnow [fly] (109), Soft Plastic Jerkbait [lure] (88), Casting Spoon [lure] (85), Sculpin Streamer [fly] (77), Woolly Bugger [fly] (73) |
| Big-fish | Articulated Baitfish Streamer [fly] (140), Hair Jig [lure] (139), Sculpzilla [fly] (134), Game Changer [fly] (129), Casting Spoon [lure] (127), Articulated Dungeon Streamer [fly] (121), Suspending Jerkbait [lure] (120), Small Floating Trout Plug [lure] (82) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 8 | 8 | 0 | 0 | 7 |
| fly | 20 | 19 | 1 | 0 | 1 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 268/684 | 39.2% | all_purpose:148, big_fish:120 | A:134, B:134 | top:150, honorable:118 | clear:107, stained:91, dirty:70 | freshwater_river:268 | wind_reaction:126, current_swing:116, open_water_search:116, runoff_streamer:116 |
| Hair Jig<br>hair_jig | lure | 253/684 | 37% | big_fish:139, all_purpose:114 | A:150, B:103 | top:133, honorable:120 | clear:102, stained:76, dirty:75 | freshwater_river:253 | current_swing:151, runoff_streamer:151, dirty_vibration:107, cold_slow:87 |
| Inline Spinner<br>inline_spinner | lure | 237/684 | 34.6% | all_purpose:174, big_fish:63 | B:138, A:99 | top:138, honorable:99 | dirty:91, stained:90, clear:56 | freshwater_river:237 | current_swing:125, dirty_vibration:125, runoff_streamer:125, wind_reaction:118 |
| Casting Spoon<br>casting_spoon | lure | 212/684 | 31% | big_fish:127, all_purpose:85 | A:111, B:101 | honorable:114, top:98 | dirty:88, stained:75, clear:49 | freshwater_river:212 | wind_reaction:126, dirty_vibration:119, open_water_search:117, current_swing:114 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 204/684 | 29.8% | big_fish:140, all_purpose:64 | B:117, A:87 | top:105, honorable:99 | dirty:84, stained:73, clear:47 | freshwater_river:204 | current_swing:102, runoff_streamer:102, dirty_vibration:101, wind_reaction:93 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 161/528 | 30.5% | all_purpose:88, big_fish:73 | B:85, A:76 | honorable:106, top:55 | clear:74, stained:44, dirty:43 | freshwater_river:161 | calm_surface:65, open_water_search:58, wind_reaction:57, clear_subtle:55 |
| Game Changer<br>game_changer | fly | 160/684 | 23.4% | big_fish:129, all_purpose:31 | B:89, A:71 | honorable:86, top:74 | dirty:64, clear:55, stained:41 | freshwater_river:160 | wind_reaction:65, open_water_search:60, calm_surface:57, dirty_vibration:48 |
| Sculpzilla<br>sculpzilla | fly | 135/684 | 19.7% | big_fish:134, all_purpose:1 | A:83, B:52 | honorable:94, top:41 | dirty:48, clear:44, stained:43 | freshwater_river:135 | current_swing:76, runoff_streamer:76, dirty_vibration:56, wind_reaction:51 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 121/552 | 21.9% | big_fish:121 | A:64, B:57 | top:68, honorable:53 | stained:44, dirty:39, clear:38 | freshwater_river:121 | current_swing:68, runoff_streamer:68, dirty_vibration:57, wind_reaction:56 |
| Clouser Minnow<br>clouser_minnow | fly | 109/684 | 15.9% | all_purpose:109 | B:73, A:36 | top:60, honorable:49 | stained:41, clear:40, dirty:28 | freshwater_river:109 | current_swing:51, runoff_streamer:51, calm_surface:43, dirty_vibration:39 |
| Blade Bait<br>blade_bait | lure | 98/324 | 30.2% | big_fish:60, all_purpose:38 | B:56, A:42 | honorable:65, top:33 | dirty:38, stained:32, clear:28 | freshwater_river:98 | current_swing:60, runoff_streamer:60, dirty_vibration:57, cold_slow:53 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 90/288 | 31.3% | big_fish:82, all_purpose:8 | A:52, B:38 | top:62, honorable:28 | stained:35, dirty:34, clear:21 | freshwater_river:90 | calm_surface:84, current_swing:21, runoff_streamer:21, warming_search:21 |
| Sculpin Streamer<br>sculpin_streamer | fly | 80/684 | 11.7% | all_purpose:77, big_fish:3 | A:56, B:24 | top:49, honorable:31 | clear:30, dirty:29, stained:21 | freshwater_river:80 | current_swing:59, runoff_streamer:59, dirty_vibration:41, cold_slow:36 |
| Conehead Streamer<br>conehead_streamer | fly | 79/684 | 11.5% | all_purpose:59, big_fish:20 | A:49, B:30 | top:50, honorable:29 | stained:33, clear:23, dirty:23 | freshwater_river:79 | open_water_search:66, wind_reaction:66, current_swing:49, runoff_streamer:49 |
| Zonker Streamer<br>zonker_streamer | fly | 75/684 | 11% | all_purpose:62, big_fish:13 | A:48, B:27 | top:53, honorable:22 | stained:34, clear:21, dirty:20 | freshwater_river:75 | open_water_search:55, wind_reaction:53, current_swing:45, runoff_streamer:45 |
| Woolly Bugger<br>woolly_bugger | fly | 73/684 | 10.7% | all_purpose:73 | B:40, A:33 | honorable:54, top:19 | stained:29, clear:26, dirty:18 | freshwater_river:73 | current_swing:37, runoff_streamer:37, cold_slow:35, calm_surface:29 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 70/684 | 10.2% | all_purpose:54, big_fish:16 | A:38, B:32 | top:48, honorable:22 | dirty:27, stained:23, clear:20 | freshwater_river:70 | open_water_search:52, wind_reaction:52, dirty_vibration:40, current_swing:38 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 70/684 | 10.2% | big_fish:62, all_purpose:8 | B:40, A:30 | honorable:48, top:22 | dirty:29, stained:25, clear:16 | freshwater_river:70 | cold_slow:38, dirty_vibration:30, current_swing:27, runoff_streamer:27 |
| Ned Rig<br>ned_rig | lure | 49/684 | 7.2% | all_purpose:29, big_fish:20 | B:29, A:20 | honorable:34, top:15 | clear:19, dirty:17, stained:13 | freshwater_river:49 | cold_slow:23, current_swing:13, runoff_streamer:13, heat_finesse:12 |
| Mouse Fly<br>mouse_fly | fly | 34/192 | 17.7% | big_fish:34 | A:21, B:13 | top:19, honorable:15 | stained:12, clear:11, dirty:11 | freshwater_river:34 | calm_surface:34, warming_search:11, clear_subtle:10, current_swing:9 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 28/684 | 4.1% | all_purpose:28 | A:18, B:10 | top:20, honorable:8 | clear:22, dirty:3, stained:3 | freshwater_river:28 | clear_subtle:20, calm_surface:10, cold_slow:10, wind_reaction:6 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 27/684 | 3.9% | all_purpose:26, big_fish:1 | A:15, B:12 | honorable:18, top:9 | clear:10, stained:10, dirty:7 | freshwater_river:27 | cold_slow:19, current_swing:14, runoff_streamer:14, dirty_vibration:12 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 27/528 | 5.1% | all_purpose:25, big_fish:2 | B:20, A:7 | top:14, honorable:13 | clear:24, dirty:3 | freshwater_river:27 | clear_subtle:24, calm_surface:15, current_swing:8, runoff_streamer:8 |
| Muddler Minnow<br>muddler_sculpin | fly | 24/684 | 3.5% | all_purpose:22, big_fish:2 | B:20, A:4 | honorable:15, top:9 | clear:9, stained:9, dirty:6 | freshwater_river:24 | cold_slow:18, current_swing:9, dirty_vibration:9, runoff_streamer:9 |
| Feather Jig Leech<br>feather_jig_leech | fly | 20/684 | 2.9% | all_purpose:20 | A:10, B:10 | top:11, honorable:9 | stained:9, dirty:8, clear:3 | freshwater_river:20 | warming_search:17, calm_surface:9, current_swing:8, runoff_streamer:8 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 18/312 | 5.8% | all_purpose:18 | B:12, A:6 | honorable:12, top:6 | dirty:9, stained:5, clear:4 | freshwater_river:18 | calm_surface:9, open_water_search:8, wind_reaction:8, dirty_vibration:6 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 14/528 | 2.7% | all_purpose:7, big_fish:7 | A:8, B:6 | honorable:7, top:7 | clear:13, stained:1 | freshwater_river:14 | clear_subtle:13, calm_surface:9, open_water_search:3, warming_search:3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/84 | 0% |  |  |  |  |  |  |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 268/2736 (9.8%) | 150/1368 (11%) | 118/1368 (8.6%) | 268/1368 (19.6%) | - |  |
| Hair Jig<br>hair_jig | lure | 253/2736 (9.2%) | 133/1368 (9.7%) | 120/1368 (8.8%) | 253/1368 (18.5%) | - |  |
| Inline Spinner<br>inline_spinner | lure | 237/2736 (8.7%) | 138/1368 (10.1%) | 99/1368 (7.2%) | 237/1368 (17.3%) | - |  |
| Casting Spoon<br>casting_spoon | lure | 212/2736 (7.7%) | 98/1368 (7.2%) | 114/1368 (8.3%) | 212/1368 (15.5%) | - |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 204/2736 (7.5%) | 105/1368 (7.7%) | 99/1368 (7.2%) | - | 204/1368 (14.9%) |  |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 161/2736 (5.9%) | 55/1368 (4%) | 106/1368 (7.7%) | 161/1368 (11.8%) | - |  |
| Game Changer<br>game_changer | fly | 160/2736 (5.8%) | 74/1368 (5.4%) | 86/1368 (6.3%) | - | 160/1368 (11.7%) |  |
| Sculpzilla<br>sculpzilla | fly | 135/2736 (4.9%) | 41/1368 (3%) | 94/1368 (6.9%) | - | 135/1368 (9.9%) |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 121/2736 (4.4%) | 68/1368 (5%) | 53/1368 (3.9%) | - | 121/1368 (8.8%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 109/2736 (4%) | 60/1368 (4.4%) | 49/1368 (3.6%) | - | 109/1368 (8%) |  |
| Blade Bait<br>blade_bait | lure | 98/2736 (3.6%) | 33/1368 (2.4%) | 65/1368 (4.8%) | 98/1368 (7.2%) | - |  |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 90/2736 (3.3%) | 62/1368 (4.5%) | 28/1368 (2%) | 90/1368 (6.6%) | - |  |
| Sculpin Streamer<br>sculpin_streamer | fly | 80/2736 (2.9%) | 49/1368 (3.6%) | 31/1368 (2.3%) | - | 80/1368 (5.8%) |  |
| Conehead Streamer<br>conehead_streamer | fly | 79/2736 (2.9%) | 50/1368 (3.7%) | 29/1368 (2.1%) | - | 79/1368 (5.8%) |  |
| Zonker Streamer<br>zonker_streamer | fly | 75/2736 (2.7%) | 53/1368 (3.9%) | 22/1368 (1.6%) | - | 75/1368 (5.5%) |  |
| Woolly Bugger<br>woolly_bugger | fly | 73/2736 (2.7%) | 19/1368 (1.4%) | 54/1368 (3.9%) | - | 73/1368 (5.3%) |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 70/2736 (2.6%) | 48/1368 (3.5%) | 22/1368 (1.6%) | - | 70/1368 (5.1%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 70/2736 (2.6%) | 22/1368 (1.6%) | 48/1368 (3.5%) | - | 70/1368 (5.1%) |  |
| Ned Rig<br>ned_rig | lure | 49/2736 (1.8%) | 15/1368 (1.1%) | 34/1368 (2.5%) | 49/1368 (3.6%) | - |  |
| Mouse Fly<br>mouse_fly | fly | 34/2736 (1.2%) | 19/1368 (1.4%) | 15/1368 (1.1%) | - | 34/1368 (2.5%) |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 28/2736 (1%) | 20/1368 (1.5%) | 8/1368 (0.6%) | - | 28/1368 (2%) |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 27/2736 (1%) | 9/1368 (0.7%) | 18/1368 (1.3%) | - | 27/1368 (2%) |  |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 27/2736 (1%) | 14/1368 (1%) | 13/1368 (1%) | - | 27/1368 (2%) |  |
| Muddler Minnow<br>muddler_sculpin | fly | 24/2736 (0.9%) | 9/1368 (0.7%) | 15/1368 (1.1%) | - | 24/1368 (1.8%) |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 20/2736 (0.7%) | 11/1368 (0.8%) | 9/1368 (0.7%) | - | 20/1368 (1.5%) |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 18/2736 (0.7%) | 6/1368 (0.4%) | 12/1368 (0.9%) | - | 18/1368 (1.3%) |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 14/2736 (0.5%) | 7/1368 (0.5%) | 7/1368 (0.5%) | - | 14/1368 (1%) |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/2736 (0%) | 0/1368 (0%) | 0/1368 (0%) | - | 0/1368 (0%) |  |

## Zero-Selected Eligible Profiles

| Profile | Gear | Candidate opportunities | Top available contexts | Top competing winners |
| --- | --- | --- | --- | --- |
| Crawfish Streamer<br>crawfish_streamer | fly | 84 | all_purpose / clear / freshwater_river / cold_slow_or_front:10, all_purpose / dirty / freshwater_river / dirty_vibration:10, big_fish / clear / freshwater_river / cold_slow_or_front:10, big_fish / dirty / freshwater_river / dirty_vibration:10 | Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):7, Sculpin Streamer (top), Jighead Marabou Leech (honorable):7, Jighead Marabou Leech (top), Sculpin Streamer (honorable):5, Muddler Minnow (top), Woolly Bugger (honorable):5 |

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 268/684 | 39.2% | all_purpose:148, big_fish:120 | wind_reaction:126, current_swing:116, open_water_search:116, runoff_streamer:116, dirty_vibration:101 |
| Hair Jig<br>hair_jig | lure | 253/684 | 37% | big_fish:139, all_purpose:114 | current_swing:151, runoff_streamer:151, dirty_vibration:107, cold_slow:87, wind_reaction:86 |
| Inline Spinner<br>inline_spinner | lure | 237/684 | 34.6% | all_purpose:174, big_fish:63 | current_swing:125, dirty_vibration:125, runoff_streamer:125, wind_reaction:118, open_water_search:115 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 90/288 | 31.3% | big_fish:82, all_purpose:8 | calm_surface:84, current_swing:21, runoff_streamer:21, warming_search:21, low_light_surface:18 |
| Casting Spoon<br>casting_spoon | lure | 212/684 | 31% | big_fish:127, all_purpose:85 | wind_reaction:126, dirty_vibration:119, open_water_search:117, current_swing:114, runoff_streamer:114 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 161/528 | 30.5% | all_purpose:88, big_fish:73 | calm_surface:65, open_water_search:58, wind_reaction:57, clear_subtle:55, current_swing:48 |
| Blade Bait<br>blade_bait | lure | 98/324 | 30.2% | big_fish:60, all_purpose:38 | current_swing:60, runoff_streamer:60, dirty_vibration:57, cold_slow:53, wind_reaction:49 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 204/684 | 29.8% | big_fish:140, all_purpose:64 | current_swing:102, runoff_streamer:102, dirty_vibration:101, wind_reaction:93, open_water_search:92 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | home-window >30% severe | 222/500 | 44.4% | goal_tags:139 | AP/BF 97/250, 125/250<br>clarity clear:212, stained:152, dirty:136<br>bucket cold_slow_or_front:148, dirty_vibration:112, breezy_windy_stained_reaction:72 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | home-window >30% severe | 82/204 | 40.2% | goal_tags:94 | AP/BF 8/102, 74/102<br>clarity clear:68, dirty:68, stained:68<br>bucket stable_pleasant_medium_confidence_archive:52, cold_slow_or_front:44, warming_search:40 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | home-window >30% severe | 192/504 | 38.1% | daily_condition_tags:175 | AP/BF 105/252, 87/252<br>clarity clear:168, dirty:168, stained:168<br>bucket dirty_vibration:136, warming_search:108, breezy_windy_stained_reaction:96 |
| Casting Spoon<br>casting_spoon | lure | home-window >30% severe | 183/504 | 36.3% | goal_tags:203 | AP/BF 70/252, 113/252<br>clarity clear:168, dirty:168, stained:168<br>bucket dirty_vibration:136, warming_search:108, breezy_windy_stained_reaction:96 |
| Inline Spinner<br>inline_spinner | lure | home-window >30% severe | 181/504 | 35.9% | selector_filtering_variety_jitter:145 | AP/BF 134/252, 47/252<br>clarity clear:168, dirty:168, stained:168<br>bucket dirty_vibration:136, warming_search:108, breezy_windy_stained_reaction:96 |
| Blade Bait<br>blade_bait | lure | home-window >30% severe | 79/252 | 31.3% | goal_tags:69 | AP/BF 29/126, 50/126<br>clarity clear:96, stained:80, dirty:76<br>bucket cold_slow_or_front:84, dirty_vibration:72, breezy_windy_stained_reaction:48 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | home-window >30% severe | 162/528 | 30.7% | goal_tags:164 | AP/BF 47/252, 115/276<br>clarity clear:176, dirty:176, stained:176<br>bucket dirty_vibration:136, warming_search:108, cold_slow_or_front:106 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | home-window >25% overdominant | 102/348 | 29.3% | daily_condition_tags:163 | AP/BF 52/174, 50/174<br>clarity clear:116, dirty:116, stained:116<br>bucket dirty_vibration:92, breezy_windy_stained_reaction:68, cold_slow_or_front:68 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | home-window >20% watch | 107/468 | 22.9% | goal_tags:222 | AP/BF 0/222, 107/246<br>clarity clear:156, dirty:156, stained:156<br>bucket dirty_vibration:124, cold_slow_or_front:106, breezy_windy_stained_reaction:92 |
| Mouse Fly<br>mouse_fly | fly | home-window >20% watch | 34/156 | 21.8% | goal_tags:78 | AP/BF 0/78, 34/78<br>clarity clear:52, dirty:52, stained:52<br>bucket stable_pleasant_medium_confidence_archive:52, warming_search:40, cold_slow_or_front:24 |
| Game Changer<br>game_changer | fly | home-window >20% watch | 111/528 | 21% | daily_condition_tags:184 | AP/BF 15/252, 96/276<br>clarity clear:176, dirty:176, stained:176<br>bucket dirty_vibration:136, warming_search:108, cold_slow_or_front:106 |
| Sculpzilla<br>sculpzilla | fly | home-window >20% watch | 111/528 | 21% | goal_tags:299 | AP/BF 1/252, 110/276<br>clarity clear:176, dirty:176, stained:176<br>bucket dirty_vibration:136, warming_search:108, cold_slow_or_front:106 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 253/2736 (9.2%) | 133/1368 (9.7%) | 120/1368 (8.8%) | 253/1368 (18.5%) | 222/500 (44.4%) | 124/500 (24.8%) / 98/500 (19.6%) | home>20%<br>home>25%<br>home>30% |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 90/2736 (3.3%) | 62/1368 (4.5%) | 28/1368 (2%) | 90/1368 (6.6%) | 82/204 (40.2%) | 56/204 (27.5%) / 26/204 (12.7%) | home>20%<br>home>25%<br>home>30% |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 268/2736 (9.8%) | 150/1368 (11%) | 118/1368 (8.6%) | 268/1368 (19.6%) | 192/504 (38.1%) | 101/504 (20%) / 91/504 (18.1%) | home>20%<br>home>25%<br>home>30% |
| Casting Spoon<br>casting_spoon | lure | 212/2736 (7.7%) | 98/1368 (7.2%) | 114/1368 (8.3%) | 212/1368 (15.5%) | 183/504 (36.3%) | 90/504 (17.9%) / 93/504 (18.5%) | home>20%<br>home>25%<br>home>30% |
| Inline Spinner<br>inline_spinner | lure | 237/2736 (8.7%) | 138/1368 (10.1%) | 99/1368 (7.2%) | 237/1368 (17.3%) | 181/504 (35.9%) | 116/504 (23%) / 65/504 (12.9%) | home>20%<br>home>25%<br>home>30% |
| Blade Bait<br>blade_bait | lure | 98/2736 (3.6%) | 33/1368 (2.4%) | 65/1368 (4.8%) | 98/1368 (7.2%) | 79/252 (31.3%) | 27/252 (10.7%) / 52/252 (20.6%) | home>20%<br>home>25%<br>home>30% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 204/2736 (7.5%) | 105/1368 (7.7%) | 99/1368 (7.2%) | 204/1368 (14.9%) | 162/528 (30.7%) | 81/528 (15.3%) / 81/528 (15.3%) | home>20%<br>home>25%<br>home>30% |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 161/2736 (5.9%) | 55/1368 (4%) | 106/1368 (7.7%) | 161/1368 (11.8%) | 102/348 (29.3%) | 29/348 (8.3%) / 73/348 (21%) | home>20%<br>home>25% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 121/2736 (4.4%) | 68/1368 (5%) | 53/1368 (3.9%) | 121/1368 (8.8%) | 107/468 (22.9%) | 54/468 (11.5%) / 53/468 (11.3%) | home>20% |
| Mouse Fly<br>mouse_fly | fly | 34/2736 (1.2%) | 19/1368 (1.4%) | 15/1368 (1.1%) | 34/1368 (2.5%) | 34/156 (21.8%) | 19/156 (12.2%) / 15/156 (9.6%) | home>20% |
| Game Changer<br>game_changer | fly | 160/2736 (5.8%) | 74/1368 (5.4%) | 86/1368 (6.3%) | 160/1368 (11.7%) | 111/528 (21%) | 46/528 (8.7%) / 65/528 (12.3%) | home>20% |
| Sculpzilla<br>sculpzilla | fly | 135/2736 (4.9%) | 41/1368 (3%) | 94/1368 (6.9%) | 135/1368 (9.9%) | 111/528 (21%) | 37/528 (7%) / 74/528 (14%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.56.
Average expanded finalist pool size: 3.30.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 1034.
Rows/slots with expanded finalist pool size 1: 654.
Selected-tier singleton slots expanded above 1: 380.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 3.03 | 4.15 | 1 | 1 | 202 | 102 |
| fly/top | 3.21 | 4.16 | 1 | 1 | 178 | 92 |
| lure/honorable | 2.07 | 2.61 | 1 | 1 | 313 | 206 |
| lure/top | 1.94 | 2.28 | 1 | 1 | 341 | 254 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1709 |
| goal_or_priority_condition | 935 |
| credible_fallback | 92 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_and_priority_condition | 1709 |
| goal_or_priority_condition | 1690 |
| credible_fallback | 171 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 312 |
| family_diversity_scarcity | 274 |
| surface_safety_scarcity | 68 |

Representative expanded singleton finalist pools:
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B fly/top: sculpin_streamer (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B lure/honorable: inline_spinner (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__A lure/top: inline_spinner (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B lure/honorable: suspending_jerkbait (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B lure/top: inline_spinner (goal_or_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__A lure/top: inline_spinner (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B lure/honorable: inline_spinner (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__B fly/top: jighead_marabou_leech (goal_or_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B lure/honorable: inline_spinner (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/top: muddler_sculpin (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__B fly/honorable: articulated_dungeon_streamer (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B lure/top: ned_rig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B fly/top: jighead_marabou_leech (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B fly/honorable: muddler_sculpin (goal_and_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 3.40 |
| Different-presentation close candidates | 1.11 |
| Different-family close candidates | 1.79 |
| Final expanded Set B pool | 2.05 |
| Same-family/same-presentation reintroduced | 178/1368 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 288 |
| Coverage pool used | 48 |
| Average used coverage pool size | 1.88 |
| Singleton used coverage pools | 16 |
| Broad pool larger than narrowed pool | 13 |
| Broad pool same as narrowed pool | 35 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 0 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 240 |
| broad | 48 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| inline_spinner | 39 |
| suspending_jerkbait | 26 |
| casting_spoon | 25 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| suspending_jerkbait | 19 |
| casting_spoon | 16 |
| inline_spinner | 11 |
| blade_bait | 2 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

None.

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 1584 | 0 | 0 |
| caution | 240 | 0 | 0 |

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
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
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
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | jerkbait_soft | jerkbait | upper<br>medium/slow | 1: baitfish | 2: clear, stained | 2: clear_subtle, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Casting Spoon<br>casting_spoon | lure | northern_pike, trout | spoon | blade_spoon | mid<br>medium | 1: baitfish | 2: clear, stained | 2: open_water_search, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | smallmouth_bass, trout | streamer_sparse | baitfish_streamer | upper<br>medium/fast | 1: baitfish | 1: clear | 2: clear_subtle, current_swing | 1: reliable_action | freshwater_river | false | 5 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 204/684 | 162/528 | goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 121/552 | 107/468 | goal_tags>1<br>home-window share>20% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 18/312 | 13/180 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 109/684 | 72/504 | goal_tags>1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 0/84 | 0/60 | clear+stained+dirty clarity |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 20/684 | 19/560 | clear+stained+dirty clarity |
| Game Changer<br>game_changer | fly | 7 | 160/684 | 111/528 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 27/684 | 23/500 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 28/684 | 27/500 | clear+stained+dirty clarity |
| Mouse Fly<br>mouse_fly | fly | 7 | 34/192 | 34/156 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 70/684 | 60/560 | goal_tags>1<br>reliable_action+big_fish_upside |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 80/684 | 73/500 | clear+stained+dirty clarity |
| Sculpzilla<br>sculpzilla | fly | 7 | 135/684 | 111/528 | home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 73/684 | 65/560 | clear+stained+dirty clarity |
| Blade Bait<br>blade_bait | lure | 7 | 98/324 | 79/252 | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Casting Spoon<br>casting_spoon | lure | 6 | 212/684 | 183/504 | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Hair Jig<br>hair_jig | lure | 8 | 253/684 | 222/500 | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Inline Spinner<br>inline_spinner | lure | 8 | 237/684 | 181/504 | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Ned Rig<br>ned_rig | lure | 9 | 49/684 | 39/500 | clear+stained+dirty clarity |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 8 | 90/288 | 82/204 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 161/528 | 102/348 | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 268/684 | 192/504 | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 268/684 (39.2%) | 192/504 (38.1%) | all_purpose:148, big_fish:120 | top:150, honorable:118 | wind_reaction:126, current_swing:116, open_water_search:116, runoff_streamer:116, dirty_vibration:101 |
| Hair Jig<br>hair_jig | lure | 8 | 253/684 (37%) | 222/500 (44.4%) | big_fish:139, all_purpose:114 | top:133, honorable:120 | current_swing:151, runoff_streamer:151, dirty_vibration:107, cold_slow:87, wind_reaction:86 |
| Inline Spinner<br>inline_spinner | lure | 8 | 237/684 (34.6%) | 181/504 (35.9%) | all_purpose:174, big_fish:63 | top:138, honorable:99 | current_swing:125, dirty_vibration:125, runoff_streamer:125, wind_reaction:118, open_water_search:115 |
| Casting Spoon<br>casting_spoon | lure | 6 | 212/684 (31%) | 183/504 (36.3%) | big_fish:127, all_purpose:85 | honorable:114, top:98 | wind_reaction:126, dirty_vibration:119, open_water_search:117, current_swing:114, runoff_streamer:114 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 204/684 (29.8%) | 162/528 (30.7%) | big_fish:140, all_purpose:64 | top:105, honorable:99 | current_swing:102, runoff_streamer:102, dirty_vibration:101, wind_reaction:93, open_water_search:92 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 161/528 (30.5%) | 102/348 (29.3%) | all_purpose:88, big_fish:73 | honorable:106, top:55 | calm_surface:65, open_water_search:58, wind_reaction:57, clear_subtle:55, current_swing:48 |
| Game Changer<br>game_changer | fly | 7 | 160/684 (23.4%) | 111/528 (21%) | big_fish:129, all_purpose:31 | honorable:86, top:74 | wind_reaction:65, open_water_search:60, calm_surface:57, dirty_vibration:48, current_swing:44 |
| Sculpzilla<br>sculpzilla | fly | 7 | 135/684 (19.7%) | 111/528 (21%) | big_fish:134, all_purpose:1 | honorable:94, top:41 | current_swing:76, runoff_streamer:76, dirty_vibration:56, wind_reaction:51, open_water_search:47 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 121/552 (21.9%) | 107/468 (22.9%) | big_fish:121 | top:68, honorable:53 | current_swing:68, runoff_streamer:68, dirty_vibration:57, wind_reaction:56, open_water_search:51 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 109/684 (15.9%) | 72/504 (14.3%) | all_purpose:109 | top:60, honorable:49 | current_swing:51, runoff_streamer:51, calm_surface:43, dirty_vibration:39, open_water_search:36 |
| Blade Bait<br>blade_bait | lure | 7 | 98/324 (30.2%) | 79/252 (31.3%) | big_fish:60, all_purpose:38 | honorable:65, top:33 | current_swing:60, runoff_streamer:60, dirty_vibration:57, cold_slow:53, wind_reaction:49 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 8 | 90/288 (31.3%) | 82/204 (40.2%) | big_fish:82, all_purpose:8 | top:62, honorable:28 | calm_surface:84, current_swing:21, runoff_streamer:21, warming_search:21, low_light_surface:18 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 80/684 (11.7%) | 73/500 (14.6%) | all_purpose:77, big_fish:3 | top:49, honorable:31 | current_swing:59, runoff_streamer:59, dirty_vibration:41, cold_slow:36, wind_reaction:30 |
| Conehead Streamer<br>conehead_streamer | fly | 7 | 79/684 (11.5%) | 74/528 (14%) | all_purpose:59, big_fish:20 | top:50, honorable:29 | open_water_search:66, wind_reaction:66, current_swing:49, runoff_streamer:49, dirty_vibration:48 |
| Zonker Streamer<br>zonker_streamer | fly | 7 | 75/684 (11%) | 65/528 (12.3%) | all_purpose:62, big_fish:13 | top:53, honorable:22 | open_water_search:55, wind_reaction:53, current_swing:45, runoff_streamer:45, dirty_vibration:44 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 73/684 (10.7%) | 65/560 (11.6%) | all_purpose:73 | honorable:54, top:19 | current_swing:37, runoff_streamer:37, cold_slow:35, calm_surface:29, dirty_vibration:28 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 70/684 (10.2%) | 61/504 (12.1%) | all_purpose:54, big_fish:16 | top:48, honorable:22 | open_water_search:52, wind_reaction:52, dirty_vibration:40, current_swing:38, runoff_streamer:38 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 70/684 (10.2%) | 60/560 (10.7%) | big_fish:62, all_purpose:8 | honorable:48, top:22 | cold_slow:38, dirty_vibration:30, current_swing:27, runoff_streamer:27, wind_reaction:19 |
| Ned Rig<br>ned_rig | lure | 9 | 49/684 (7.2%) | 39/500 (7.8%) | all_purpose:29, big_fish:20 | honorable:34, top:15 | cold_slow:23, current_swing:13, runoff_streamer:13, heat_finesse:12, clear_subtle:11 |
| Mouse Fly<br>mouse_fly | fly | 7 | 34/192 (17.7%) | 34/156 (21.8%) | big_fish:34 | top:19, honorable:15 | calm_surface:34, warming_search:11, clear_subtle:10, current_swing:9, runoff_streamer:9 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 28/684 (4.1%) | 27/500 (5.4%) | all_purpose:28 | top:20, honorable:8 | clear_subtle:20, calm_surface:10, cold_slow:10, wind_reaction:6, warming_search:5 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 27/684 (3.9%) | 23/500 (4.6%) | all_purpose:26, big_fish:1 | honorable:18, top:9 | cold_slow:19, current_swing:14, runoff_streamer:14, dirty_vibration:12, wind_reaction:10 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 5 | 27/528 (5.1%) | 12/348 (3.4%) | all_purpose:25, big_fish:2 | top:14, honorable:13 | clear_subtle:24, calm_surface:15, current_swing:8, runoff_streamer:8, warming_search:6 |
| Muddler Minnow<br>muddler_sculpin | fly | 7 | 24/684 (3.5%) | 21/500 (4.2%) | all_purpose:22, big_fish:2 | honorable:15, top:9 | cold_slow:18, current_swing:9, dirty_vibration:9, runoff_streamer:9, wind_reaction:9 |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 20/684 (2.9%) | 19/560 (3.4%) | all_purpose:20 | top:11, honorable:9 | warming_search:17, calm_surface:9, current_swing:8, runoff_streamer:8, dirty_vibration:7 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 18/312 (5.8%) | 13/180 (7.2%) | all_purpose:18 | honorable:12, top:6 | calm_surface:9, open_water_search:8, wind_reaction:8, dirty_vibration:6, warming_search:5 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 14/528 (2.7%) | 6/348 (1.7%) | all_purpose:7, big_fish:7 | honorable:7, top:7 | clear_subtle:13, calm_surface:9, open_water_search:3, warming_search:3, wind_reaction:3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 0/84 (0%) | 0/60 (0%) |  |  |  |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 268/684 (39.2%) | 192/504 (38.1%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Hair Jig<br>hair_jig | lure | 253/684 (37%) | 222/500 (44.4%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Inline Spinner<br>inline_spinner | lure | 237/684 (34.6%) | 181/504 (35.9%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Casting Spoon<br>casting_spoon | lure | 212/684 (31%) | 183/504 (36.3%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 204/684 (29.8%) | 162/528 (30.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 161/528 (30.5%) | 102/348 (29.3%) | catalog_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant |
| Game Changer<br>game_changer | fly | 160/684 (23.4%) | 111/528 (21%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Sculpzilla<br>sculpzilla | fly | 135/684 (19.7%) | 111/528 (21%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | home-window share>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 121/552 (21.9%) | 107/468 (22.9%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Blade Bait<br>blade_bait | lure | 98/324 (30.2%) | 79/252 (31.3%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 90/288 (31.3%) | 82/204 (40.2%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias<br>acceptable_niche_concentration | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Mouse Fly<br>mouse_fly | fly | 34/192 (17.7%) | 34/156 (21.8%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 500 | 39/500 (7.8%) | Hair Jig (top), Suspending Jerkbait (honorable):34, Suspending Jerkbait (top), Inline Spinner (honorable):33, Suspending Jerkbait (top), Hair Jig (honorable):30, Inline Spinner (top), Soft Plastic Jerkbait (honorable):26 | selector/direct-score or overpowered competitors |
| Hair Jig<br>hair_jig | lure | forage 2: baitfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: reliable_action | 500 | 222/500 (44.4%) | Suspending Jerkbait (top), Inline Spinner (honorable):33, Inline Spinner (top), Soft Plastic Jerkbait (honorable):26, Inline Spinner (top), Casting Spoon (honorable):24, Suspending Jerkbait (top), Casting Spoon (honorable):16 | healthy / not underused |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 504 | 181/504 (35.9%) | Hair Jig (top), Suspending Jerkbait (honorable):31, Casting Spoon (top), Suspending Jerkbait (honorable):26, Suspending Jerkbait (top), Casting Spoon (honorable):26, Hair Jig (top), Casting Spoon (honorable):21 | healthy / not underused |
| Casting Spoon<br>casting_spoon | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: open_water_search, wind_reaction<br>goal 1: versatile_search | 504 | 183/504 (36.3%) | Inline Spinner (top), Soft Plastic Jerkbait (honorable):37, Hair Jig (top), Suspending Jerkbait (honorable):31, Inline Spinner (top), Hair Jig (honorable):26, Suspending Jerkbait (top), Inline Spinner (honorable):24 | healthy / not underused |
| Blade Bait<br>blade_bait | lure | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, open_water_search<br>goal 1: reliable_action | 252 | 79/252 (31.3%) | Hair Jig (top), Suspending Jerkbait (honorable):23, Suspending Jerkbait (top), Inline Spinner (honorable):15, Hair Jig (top), Casting Spoon (honorable):14, Inline Spinner (top), Hair Jig (honorable):13 | healthy / not underused |
| Suspending Jerkbait<br>suspending_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, wind_reaction<br>goal 2: reliable_action, versatile_search | 504 | 192/504 (38.1%) | Inline Spinner (top), Soft Plastic Jerkbait (honorable):37, Inline Spinner (top), Hair Jig (honorable):26, Inline Spinner (top), Casting Spoon (honorable):24, Hair Jig (top), Casting Spoon (honorable):21 | healthy / not underused |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, open_water_search<br>goal 2: reliable_action, versatile_search | 348 | 102/348 (29.3%) | Inline Spinner (top), Hair Jig (honorable):23, Suspending Jerkbait (top), Casting Spoon (honorable):22, Casting Spoon (top), Suspending Jerkbait (honorable):21, Suspending Jerkbait (top), Inline Spinner (honorable):19 | healthy / not underused |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | forage 2: surface_prey, baitfish<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 204 | 82/204 (40.2%) | Hair Jig (top), Soft Plastic Jerkbait (honorable):11, Inline Spinner (top), Casting Spoon (honorable):11, Suspending Jerkbait (top), Hair Jig (honorable):11, Suspending Jerkbait (top), Inline Spinner (honorable):11 | healthy / not underused |
| Woolly Bugger<br>woolly_bugger | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 560 | 65/560 (11.6%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):27, Articulated Baitfish Streamer (top), Game Changer (honorable):26, Articulated Dungeon Streamer (top), Sculpzilla (honorable):22, Articulated Dungeon Streamer (top), Game Changer (honorable):14 | selector/direct-score or overpowered competitors |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | forage 1: leech_worm<br>clarity 2: stained, dirty<br>condition 2: cold_slow, cover_ambush<br>goal 2: reliable_action, big_fish_upside | 560 | 60/560 (10.7%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):27, Articulated Baitfish Streamer (top), Game Changer (honorable):26, Articulated Dungeon Streamer (top), Sculpzilla (honorable):22, Sculpin Streamer (top), Woolly Bugger (honorable):15 | selector/direct-score or overpowered competitors |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 500 | 23/500 (4.6%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):25, Articulated Baitfish Streamer (top), Game Changer (honorable):23, Articulated Dungeon Streamer (top), Sculpzilla (honorable):19, Sculpin Streamer (top), Woolly Bugger (honorable):15 | selector/direct-score or overpowered competitors |
| Lead-Eye Leech<br>lead_eye_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, clear_subtle<br>goal 1: reliable_action | 500 | 27/500 (5.4%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):25, Articulated Baitfish Streamer (top), Game Changer (honorable):23, Articulated Dungeon Streamer (top), Sculpzilla (honorable):19, Sculpin Streamer (top), Woolly Bugger (honorable):15 | selector/direct-score or overpowered competitors |
| Feather Jig Leech<br>feather_jig_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: warming_search, current_swing<br>goal 1: versatile_search | 560 | 19/560 (3.4%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):27, Articulated Baitfish Streamer (top), Game Changer (honorable):26, Articulated Dungeon Streamer (top), Sculpzilla (honorable):22, Sculpin Streamer (top), Woolly Bugger (honorable):15 | selector/direct-score or overpowered competitors |
| Sculpin Streamer<br>sculpin_streamer | fly | forage 2: baitfish, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: current_swing, cold_slow, runoff_streamer<br>goal 1: reliable_action | 500 | 73/500 (14.6%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):25, Articulated Baitfish Streamer (top), Game Changer (honorable):23, Articulated Dungeon Streamer (top), Sculpzilla (honorable):19, Sculpzilla (top), Articulated Dungeon Streamer (honorable):14 | healthy / not underused |
| Sculpzilla<br>sculpzilla | fly | forage 2: baitfish, crawfish<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, current_swing<br>goal 1: big_fish_upside | 528 | 111/528 (21%) | Articulated Baitfish Streamer (top), Game Changer (honorable):30, Sculpin Streamer (top), Woolly Bugger (honorable):15, Articulated Dungeon Streamer (top), Game Changer (honorable):14, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):14 | healthy / not underused |
| Muddler Minnow<br>muddler_sculpin | fly | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: current_swing, cold_slow<br>goal 1: reliable_action | 500 | 21/500 (4.2%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):25, Articulated Baitfish Streamer (top), Game Changer (honorable):23, Articulated Dungeon Streamer (top), Sculpzilla (honorable):19, Sculpin Streamer (top), Woolly Bugger (honorable):15 | selector/direct-score or overpowered competitors |
| Crawfish Streamer<br>crawfish_streamer | fly | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 2: current_swing, clear_subtle<br>goal 1: reliable_action | 60 | 0/60 (0%) | Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):7, Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):5, Jighead Marabou Leech (top), Sculpin Streamer (honorable):4 | selector/direct-score or overpowered competitors |
| Clouser Minnow<br>clouser_minnow | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: current_swing, open_water_search<br>goal 2: reliable_action, versatile_search | 504 | 72/504 (14.3%) | Articulated Baitfish Streamer (top), Game Changer (honorable):26, Articulated Baitfish Streamer (top), Sculpzilla (honorable):22, Articulated Dungeon Streamer (top), Sculpzilla (honorable):18, Sculpin Streamer (top), Woolly Bugger (honorable):15 | healthy / not underused |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 504 | 61/504 (12.1%) | Articulated Baitfish Streamer (top), Game Changer (honorable):26, Articulated Baitfish Streamer (top), Sculpzilla (honorable):22, Articulated Dungeon Streamer (top), Sculpzilla (honorable):18, Sculpin Streamer (top), Woolly Bugger (honorable):15 | healthy / not underused |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | forage 1: baitfish<br>clarity 1: clear<br>condition 2: clear_subtle, current_swing<br>goal 1: reliable_action | 348 | 12/348 (3.4%) | Articulated Baitfish Streamer (top), Game Changer (honorable):22, Articulated Baitfish Streamer (top), Sculpzilla (honorable):19, Conehead Streamer (top), Articulated Baitfish Streamer (honorable):12, Sculpin Streamer (top), Woolly Bugger (honorable):12 | selector/direct-score or overpowered competitors |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: open_water_search, runoff_streamer<br>goal 2: versatile_search, big_fish_upside | 528 | 162/528 (30.7%) | Articulated Dungeon Streamer (top), Sculpzilla (honorable):21, Sculpin Streamer (top), Woolly Bugger (honorable):15, Articulated Dungeon Streamer (top), Game Changer (honorable):14, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):14 | healthy / not underused |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, cover_ambush<br>goal 2: big_fish_upside, high_risk_high_reward | 468 | 107/468 (22.9%) | Articulated Baitfish Streamer (top), Game Changer (honorable):27, Articulated Baitfish Streamer (top), Sculpzilla (honorable):23, Conehead Streamer (top), Articulated Baitfish Streamer (honorable):13, Game Changer (top), Articulated Baitfish Streamer (honorable):13 | healthy / not underused |
| Game Changer<br>game_changer | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 1: open_water_search<br>goal 2: versatile_search, big_fish_upside | 528 | 111/528 (21%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):25, Articulated Dungeon Streamer (top), Sculpzilla (honorable):21, Sculpin Streamer (top), Woolly Bugger (honorable):15, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):14 | healthy / not underused |
| Conehead Streamer<br>conehead_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 528 | 74/528 (14%) | Articulated Baitfish Streamer (top), Game Changer (honorable):30, Articulated Baitfish Streamer (top), Sculpzilla (honorable):25, Articulated Dungeon Streamer (top), Sculpzilla (honorable):21, Sculpin Streamer (top), Woolly Bugger (honorable):15 | healthy / not underused |
| Zonker Streamer<br>zonker_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 1: versatile_search | 528 | 65/528 (12.3%) | Articulated Baitfish Streamer (top), Game Changer (honorable):30, Articulated Baitfish Streamer (top), Sculpzilla (honorable):25, Articulated Dungeon Streamer (top), Sculpzilla (honorable):21, Sculpin Streamer (top), Woolly Bugger (honorable):15 | healthy / not underused |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: clear_subtle, open_water_search<br>goal 1: versatile_search | 348 | 6/348 (1.7%) | Articulated Baitfish Streamer (top), Game Changer (honorable):22, Articulated Baitfish Streamer (top), Sculpzilla (honorable):19, Conehead Streamer (top), Articulated Baitfish Streamer (honorable):12, Sculpin Streamer (top), Woolly Bugger (honorable):12 | selector/direct-score or overpowered competitors |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 3: wind_reaction, open_water_search, warming_search<br>goal 1: versatile_search | 180 | 13/180 (7.2%) | Articulated Baitfish Streamer (top), Game Changer (honorable):10, Articulated Baitfish Streamer (top), Sculpzilla (honorable):9, Game Changer (top), Sculpzilla (honorable):7, Articulated Dungeon Streamer (top), Sculpzilla (honorable):6 | selector/direct-score or overpowered competitors |
| Popper Fly<br>popper_fly | fly | forage 2: surface_prey, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: reliable_action, versatile_search | 0 | 0/0 |  | scenario coverage |
| Deer Hair Slider<br>deer_hair_slider | fly | forage 2: surface_prey, baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: calm_surface, low_light_surface<br>goal 1: big_fish_upside | 0 | 0/0 |  | scenario coverage |
| Mouse Fly<br>mouse_fly | fly | forage 1: surface_prey<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 156 | 34/156 (21.8%) | Game Changer (top), Articulated Baitfish Streamer (honorable):9, Articulated Baitfish Streamer (top), Game Changer (honorable):8, Game Changer (top), Sculpzilla (honorable):8, Articulated Baitfish Streamer (top), Sculpzilla (honorable):4 | healthy / not underused |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Game Changer (game_changer), Inline Spinner (inline_spinner), Mouse Fly (mouse_fly), Small Floating Trout Plug (small_floating_trout_plug), Soft Plastic Jerkbait (soft_jerkbait), Suspending Jerkbait (suspending_jerkbait)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Blade Bait (blade_bait), Casting Spoon (casting_spoon), Deer Hair Slider (deer_hair_slider), Game Changer (game_changer), Hair Jig (hair_jig), Inline Spinner (inline_spinner), Mouse Fly (mouse_fly), Popper Fly (popper_fly), Sculpzilla (sculpzilla), Small Floating Trout Plug (small_floating_trout_plug), Soft Plastic Jerkbait (soft_jerkbait), Suspending Jerkbait (suspending_jerkbait)

### Probably selector problem, not catalog problem
Baitfish Slider Fly (baitfish_slider_fly), Crawfish Streamer (crawfish_streamer), Feather Jig Leech (feather_jig_leech), Jighead Marabou Leech (jighead_marabou_leech), Lead-Eye Leech (lead_eye_leech), Muddler Minnow (muddler_sculpin), Ned Rig (ned_rig), Rabbit-Strip Leech (rabbit_strip_leech), Slim Baitfish Streamer (slim_minnow_streamer), Unweighted Baitfish Streamer (unweighted_baitfish_streamer), Woolly Bugger (woolly_bugger)

## Utilization Notes / Coverage Gaps

- 1 eligible profile(s) were never selected despite appearing in candidate pools; these are prime coverage or selector-balance review targets.
- 8 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Rabbit-Strip Leech, Woolly Bugger, Conehead Streamer, Game Changer, Sculpzilla, Zonker Streamer, Bucktail Streamer, Clouser Minnow, Sculpin Streamer, Articulated Dungeon Streamer, Mouse Fly |
| underused_home_window | Feather Jig Leech, Jighead Marabou Leech, Lead-Eye Leech, Muddler Minnow, Slim Baitfish Streamer, Unweighted Baitfish Streamer, Baitfish Slider Fly, Crawfish Streamer, Ned Rig |
| no_home_window_coverage | None |
| over-dominant | Articulated Baitfish Streamer, Casting Spoon, Inline Spinner, Suspending Jerkbait, Hair Jig, Soft Plastic Jerkbait, Blade Bait, Small Floating Trout Plug |
| probably okay niche profile | Deer Hair Slider, Popper Fly |

## Trout Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Feather Jig Leech<br>feather_jig_leech | fly | 1.5% | 20/684 | 19/560 | 20 | 19 | 3.4% | 19/280 | 0/280 | 73 | underused_home_window | activity neutral:448, active:76, suppressed:36<br>clarity clear:224, stained:180, dirty:156<br>water freshwater_river:560<br>bucket cold_slow_or_front:148, dirty_vibration:116, warming_search:108 | Articulated Baitfish Streamer (top), Game Changer (honorable):20, Articulated Baitfish Streamer (top), Sculpzilla (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):17 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 5.1% | 70/684 | 60/560 | 70 | 60 | 10.7% | 6/280 | 54/280 | 62 | healthy | activity neutral:448, active:76, suppressed:36<br>clarity clear:224, stained:180, dirty:156<br>water freshwater_river:560<br>bucket cold_slow_or_front:148, dirty_vibration:116, warming_search:108 | Articulated Baitfish Streamer (top), Game Changer (honorable):20, Articulated Baitfish Streamer (top), Sculpzilla (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):17 |
| Woolly Bugger<br>woolly_bugger | fly | 5.3% | 73/684 | 65/560 | 73 | 65 | 11.6% | 65/280 | 0/280 | 112 | healthy | activity neutral:448, active:76, suppressed:36<br>clarity clear:224, stained:180, dirty:156<br>water freshwater_river:560<br>bucket cold_slow_or_front:148, dirty_vibration:116, warming_search:108 | Articulated Baitfish Streamer (top), Game Changer (honorable):20, Articulated Baitfish Streamer (top), Sculpzilla (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):17 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 14.9% | 204/684 | 162/528 | 204 | 162 | 30.7% | 47/252 | 115/276 | 177 | over-dominant | activity neutral:414, active:78, suppressed:36<br>clarity clear:176, dirty:176, stained:176<br>water freshwater_river:528<br>bucket dirty_vibration:136, warming_search:108, cold_slow_or_front:106 | Articulated Dungeon Streamer (top), Sculpzilla (honorable):16, Sculpin Streamer (top), Woolly Bugger (honorable):15, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):14 |
| Conehead Streamer<br>conehead_streamer | fly | 5.8% | 79/684 | 74/528 | 79 | 74 | 14% | 54/252 | 20/276 | 228 | healthy | activity neutral:414, active:78, suppressed:36<br>clarity clear:176, dirty:176, stained:176<br>water freshwater_river:528<br>bucket dirty_vibration:136, warming_search:108, cold_slow_or_front:106 | Articulated Baitfish Streamer (top), Game Changer (honorable):24, Articulated Baitfish Streamer (top), Sculpzilla (honorable):17, Articulated Dungeon Streamer (top), Sculpzilla (honorable):16 |
| Game Changer<br>game_changer | fly | 11.7% | 160/684 | 111/528 | 160 | 111 | 21% | 15/252 | 96/276 | 117 | healthy | activity neutral:414, active:78, suppressed:36<br>clarity clear:176, dirty:176, stained:176<br>water freshwater_river:528<br>bucket dirty_vibration:136, warming_search:108, cold_slow_or_front:106 | Articulated Baitfish Streamer (top), Sculpzilla (honorable):17, Articulated Dungeon Streamer (top), Sculpzilla (honorable):16, Sculpin Streamer (top), Woolly Bugger (honorable):15 |
| Sculpzilla<br>sculpzilla | fly | 9.9% | 135/684 | 111/528 | 135 | 111 | 21% | 1/252 | 110/276 | 108 | healthy | activity neutral:414, active:78, suppressed:36<br>clarity clear:176, dirty:176, stained:176<br>water freshwater_river:528<br>bucket dirty_vibration:136, warming_search:108, cold_slow_or_front:106 | Articulated Baitfish Streamer (top), Game Changer (honorable):24, Sculpin Streamer (top), Woolly Bugger (honorable):15, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):14 |
| Zonker Streamer<br>zonker_streamer | fly | 5.5% | 75/684 | 65/528 | 75 | 65 | 12.3% | 52/252 | 13/276 | 244 | healthy | activity neutral:414, active:78, suppressed:36<br>clarity clear:176, dirty:176, stained:176<br>water freshwater_river:528<br>bucket dirty_vibration:136, warming_search:108, cold_slow_or_front:106 | Articulated Baitfish Streamer (top), Game Changer (honorable):24, Articulated Baitfish Streamer (top), Sculpzilla (honorable):17, Articulated Dungeon Streamer (top), Sculpzilla (honorable):16 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 5.1% | 70/684 | 61/504 | 70 | 61 | 12.1% | 45/252 | 16/252 | 246 | healthy | activity neutral:396, active:72, suppressed:36<br>clarity clear:168, dirty:168, stained:168<br>water freshwater_river:504<br>bucket dirty_vibration:136, warming_search:108, breezy_windy_stained_reaction:96 | Articulated Baitfish Streamer (top), Game Changer (honorable):21, Sculpin Streamer (top), Woolly Bugger (honorable):15, Articulated Baitfish Streamer (top), Sculpzilla (honorable):14 |
| Clouser Minnow<br>clouser_minnow | fly | 8% | 109/684 | 72/504 | 109 | 72 | 14.3% | 72/252 | 0/252 | 189 | healthy | activity neutral:396, active:72, suppressed:36<br>clarity clear:168, dirty:168, stained:168<br>water freshwater_river:504<br>bucket dirty_vibration:136, warming_search:108, breezy_windy_stained_reaction:96 | Articulated Baitfish Streamer (top), Game Changer (honorable):21, Sculpin Streamer (top), Woolly Bugger (honorable):15, Articulated Baitfish Streamer (top), Sculpzilla (honorable):14 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 2% | 27/684 | 23/500 | 27 | 23 | 4.6% | 22/250 | 1/250 | 68 | underused_home_window | activity neutral:432, suppressed:36, active:32<br>clarity clear:212, stained:152, dirty:136<br>water freshwater_river:500<br>bucket cold_slow_or_front:148, dirty_vibration:112, breezy_windy_stained_reaction:72 | Articulated Baitfish Streamer (top), Sculpzilla (honorable):18, Articulated Baitfish Streamer (top), Game Changer (honorable):17, Sculpin Streamer (top), Woolly Bugger (honorable):15 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 2% | 28/684 | 27/500 | 28 | 27 | 5.4% | 27/250 | 0/250 | 51 | underused_home_window | activity neutral:432, suppressed:36, active:32<br>clarity clear:212, stained:152, dirty:136<br>water freshwater_river:500<br>bucket cold_slow_or_front:148, dirty_vibration:112, breezy_windy_stained_reaction:72 | Articulated Baitfish Streamer (top), Sculpzilla (honorable):18, Articulated Baitfish Streamer (top), Game Changer (honorable):17, Sculpin Streamer (top), Woolly Bugger (honorable):15 |
| Muddler Minnow<br>muddler_sculpin | fly | 1.8% | 24/684 | 21/500 | 24 | 21 | 4.2% | 19/250 | 2/250 | 44 | underused_home_window | activity neutral:432, suppressed:36, active:32<br>clarity clear:212, stained:152, dirty:136<br>water freshwater_river:500<br>bucket cold_slow_or_front:148, dirty_vibration:112, breezy_windy_stained_reaction:72 | Articulated Baitfish Streamer (top), Sculpzilla (honorable):18, Articulated Baitfish Streamer (top), Game Changer (honorable):17, Sculpin Streamer (top), Woolly Bugger (honorable):15 |
| Sculpin Streamer<br>sculpin_streamer | fly | 5.8% | 80/684 | 73/500 | 80 | 73 | 14.6% | 70/250 | 3/250 | 133 | healthy | activity neutral:432, suppressed:36, active:32<br>clarity clear:212, stained:152, dirty:136<br>water freshwater_river:500<br>bucket cold_slow_or_front:148, dirty_vibration:112, breezy_windy_stained_reaction:72 | Articulated Baitfish Streamer (top), Sculpzilla (honorable):18, Articulated Baitfish Streamer (top), Game Changer (honorable):17, Articulated Dungeon Streamer (top), Sculpzilla (honorable):14 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8.8% | 121/552 | 107/468 | 121 | 107 | 22.9% | 0/222 | 107/246 | 120 | healthy | activity neutral:354, active:78, suppressed:36<br>clarity clear:156, dirty:156, stained:156<br>water freshwater_river:468<br>bucket dirty_vibration:124, cold_slow_or_front:106, breezy_windy_stained_reaction:92 | Articulated Baitfish Streamer (top), Game Changer (honorable):22, Articulated Baitfish Streamer (top), Sculpzilla (honorable):16, Sculpin Streamer (top), Woolly Bugger (honorable):13 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 2% | 27/528 | 12/348 | 27 | 12 | 3.4% | 12/174 | 0/174 | 38 | underused_home_window | activity neutral:300, active:24, suppressed:24<br>clarity clear:116, dirty:116, stained:116<br>water freshwater_river:348<br>bucket dirty_vibration:92, breezy_windy_stained_reaction:68, cold_slow_or_front:68 | Articulated Baitfish Streamer (top), Game Changer (honorable):17, Articulated Baitfish Streamer (top), Sculpzilla (honorable):14, Sculpin Streamer (top), Woolly Bugger (honorable):12 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 1% | 14/528 | 6/348 | 14 | 6 | 1.7% | 4/174 | 2/174 | 20 | underused_home_window | activity neutral:300, active:24, suppressed:24<br>clarity clear:116, dirty:116, stained:116<br>water freshwater_river:348<br>bucket dirty_vibration:92, breezy_windy_stained_reaction:68, cold_slow_or_front:68 | Articulated Baitfish Streamer (top), Game Changer (honorable):17, Articulated Baitfish Streamer (top), Sculpzilla (honorable):14, Sculpin Streamer (top), Woolly Bugger (honorable):12 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 1.3% | 18/312 | 13/180 | 18 | 13 | 7.2% | 13/90 | 0/90 | 33 | underused_home_window | activity neutral:180<br>clarity clear:60, dirty:60, stained:60<br>water freshwater_river:180<br>bucket dirty_vibration:40, warming_search:40, breezy_windy_stained_reaction:28 | Articulated Baitfish Streamer (top), Game Changer (honorable):7, Articulated Dungeon Streamer (top), Sculpzilla (honorable):6, Clouser Minnow (honorable), Bucktail Streamer (top):6 |
| Mouse Fly<br>mouse_fly | fly | 2.5% | 34/192 | 34/156 | 34 | 34 | 21.8% | 0/78 | 34/78 | 30 | healthy | activity neutral:144, active:12<br>clarity clear:52, dirty:52, stained:52<br>water freshwater_river:156<br>bucket stable_pleasant_medium_confidence_archive:52, warming_search:40, cold_slow_or_front:24 | Articulated Baitfish Streamer (honorable), Game Changer (top):8, Articulated Baitfish Streamer (top), Game Changer (honorable):7, Game Changer (top), Sculpzilla (honorable):6 |
| Crawfish Streamer<br>crawfish_streamer | fly | 0% | 0/84 | 0/60 | 0 | 0 | 0% | 0/30 | 0/30 | 4 | underused_home_window | activity neutral:48, suppressed:12<br>clarity clear:20, dirty:20, stained:20<br>water freshwater_river:60<br>bucket cold_slow_or_front:28, dirty_vibration:20, breezy_windy_stained_reaction:12 | Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):7, Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):5 |
| Deer Hair Slider<br>deer_hair_slider | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Popper Fly<br>popper_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Casting Spoon<br>casting_spoon | lure | 15.5% | 212/684 | 183/504 | 212 | 183 | 36.3% | 70/252 | 113/252 | 87 | over-dominant | activity neutral:396, active:72, suppressed:36<br>clarity clear:168, dirty:168, stained:168<br>water freshwater_river:504<br>bucket dirty_vibration:136, warming_search:108, breezy_windy_stained_reaction:96 | Inline Spinner (top), Soft Plastic Jerkbait (honorable):36, Hair Jig (top), Suspending Jerkbait (honorable):27, Inline Spinner (top), Hair Jig (honorable):26 |
| Inline Spinner<br>inline_spinner | lure | 17.3% | 237/684 | 181/504 | 237 | 181 | 35.9% | 134/252 | 47/252 | 197 | over-dominant | activity neutral:396, active:72, suppressed:36<br>clarity clear:168, dirty:168, stained:168<br>water freshwater_river:504<br>bucket dirty_vibration:136, warming_search:108, breezy_windy_stained_reaction:96 | Hair Jig (top), Suspending Jerkbait (honorable):27, Hair Jig (top), Blade Bait (honorable):18, Casting Spoon (top), Suspending Jerkbait (honorable):15 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 19.6% | 268/684 | 192/504 | 268 | 192 | 38.1% | 105/252 | 87/252 | 103 | over-dominant | activity neutral:396, active:72, suppressed:36<br>clarity clear:168, dirty:168, stained:168<br>water freshwater_river:504<br>bucket dirty_vibration:136, warming_search:108, breezy_windy_stained_reaction:96 | Inline Spinner (top), Soft Plastic Jerkbait (honorable):36, Inline Spinner (top), Hair Jig (honorable):26, Inline Spinner (top), Casting Spoon (honorable):24 |
| Hair Jig<br>hair_jig | lure | 18.5% | 253/684 | 222/500 | 253 | 222 | 44.4% | 97/250 | 125/250 | 145 | over-dominant | activity neutral:432, suppressed:36, active:32<br>clarity clear:212, stained:152, dirty:136<br>water freshwater_river:500<br>bucket cold_slow_or_front:148, dirty_vibration:112, breezy_windy_stained_reaction:72 | Inline Spinner (top), Soft Plastic Jerkbait (honorable):25, Inline Spinner (top), Casting Spoon (honorable):24, Inline Spinner (honorable), Suspending Jerkbait (top):21 |
| Ned Rig<br>ned_rig | lure | 3.6% | 49/684 | 39/500 | 49 | 39 | 7.8% | 25/250 | 14/250 | 35 | underused_home_window | activity neutral:432, suppressed:36, active:32<br>clarity clear:212, stained:152, dirty:136<br>water freshwater_river:500<br>bucket cold_slow_or_front:148, dirty_vibration:112, breezy_windy_stained_reaction:72 | Hair Jig (top), Suspending Jerkbait (honorable):28, Inline Spinner (top), Hair Jig (honorable):25, Inline Spinner (top), Soft Plastic Jerkbait (honorable):25 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 11.8% | 161/528 | 102/348 | 161 | 102 | 29.3% | 52/174 | 50/174 | 65 | over-dominant | activity neutral:300, active:24, suppressed:24<br>clarity clear:116, dirty:116, stained:116<br>water freshwater_river:348<br>bucket dirty_vibration:92, breezy_windy_stained_reaction:68, cold_slow_or_front:68 | Inline Spinner (top), Hair Jig (honorable):23, Inline Spinner (top), Casting Spoon (honorable):18, Inline Spinner (honorable), Suspending Jerkbait (top):16 |
| Blade Bait<br>blade_bait | lure | 7.2% | 98/324 | 79/252 | 98 | 79 | 31.3% | 29/126 | 50/126 | 50 | over-dominant | activity neutral:196, suppressed:36, active:20<br>clarity clear:96, stained:80, dirty:76<br>water freshwater_river:252<br>bucket cold_slow_or_front:84, dirty_vibration:72, breezy_windy_stained_reaction:48 | Hair Jig (top), Suspending Jerkbait (honorable):21, Inline Spinner (top), Hair Jig (honorable):13, Hair Jig (top), Casting Spoon (honorable):10 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 6.6% | 90/288 | 82/204 | 90 | 82 | 40.2% | 8/102 | 74/102 | 30 | over-dominant | activity neutral:192, active:12<br>clarity clear:68, dirty:68, stained:68<br>water freshwater_river:204<br>bucket stable_pleasant_medium_confidence_archive:52, cold_slow_or_front:44, warming_search:40 | Hair Jig (top), Soft Plastic Jerkbait (honorable):11, Inline Spinner (top), Casting Spoon (honorable):11, Inline Spinner (top), Soft Plastic Jerkbait (honorable):9 |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | 25/250 | 14/250 | goal_tags:371, daily_condition_tags:66, forage_clarity_stack:14, selector_filtering_variety_jitter:8, seasonal_baseline:2 | Upper Delaware trout river 2025-01-18 all_purpose clear: lost to Blade Bait by -6 (selector_filtering_variety_jitter)<br>Upper Delaware trout river 2025-01-18 big_fish stained: lost to Suspending Jerkbait by 2 (goal_tags)<br>Upper Delaware trout river 2025-01-18 big_fish clear: lost to Blade Bait by 6 (goal_tags) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>all_purpose clear cold_slow_or_front | 184 | Blade Bait<br>178 | -6 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish stained breezy_windy_stained_reaction | 156 | Suspending Jerkbait<br>158 | 2 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish clear cold_slow_or_front | 156 | Blade Bait<br>162 | 6 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish dirty dirty_vibration | 156 | Blade Bait<br>162 | 6 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:dirty:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 3 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Upper Delaware trout river<br>2025-01-18 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>178 | Ned Rig<br>184 | -6 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Delaware trout river<br>2025-12-12 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>178 | Ned Rig<br>184 | -6 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Au Sable / Upper Midwest trout river<br>2025-12-12 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>178 | Ned Rig<br>184 | -6 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Feather Jig Leech<br>feather_jig_leech | fly | 19/560 | 3.4% | 73 | all_purpose / dirty / freshwater_river / dirty_vibration:58, big_fish / dirty / freshwater_river / dirty_vibration:58, all_purpose / clear / freshwater_river / cold_slow_or_front:48, big_fish / clear / freshwater_river / cold_slow_or_front:48 | goal_tags:411, daily_condition_tags:90, selector_filtering_variety_jitter:24, forage_clarity_stack:16 | Articulated Baitfish Streamer (top), Game Changer (honorable):20, Articulated Baitfish Streamer (top), Sculpzilla (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):17, Sculpin Streamer (top), Woolly Bugger (honorable):15 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 23/500 | 4.6% | 68 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / clear / freshwater_river / cold_slow_or_front:48, big_fish / clear / freshwater_river / cold_slow_or_front:48 | goal_tags:297, daily_condition_tags:131, selector_filtering_variety_jitter:25, forage_clarity_stack:14 | Articulated Baitfish Streamer (top), Sculpzilla (honorable):18, Articulated Baitfish Streamer (top), Game Changer (honorable):17, Sculpin Streamer (top), Woolly Bugger (honorable):15, Articulated Dungeon Streamer (top), Sculpzilla (honorable):14 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 27/500 | 5.4% | 51 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / clear / freshwater_river / cold_slow_or_front:48, big_fish / clear / freshwater_river / cold_slow_or_front:48 | goal_tags:293, daily_condition_tags:137, forage_clarity_stack:17, selector_filtering_variety_jitter:16 | Articulated Baitfish Streamer (top), Sculpzilla (honorable):18, Articulated Baitfish Streamer (top), Game Changer (honorable):17, Sculpin Streamer (top), Woolly Bugger (honorable):15, Articulated Dungeon Streamer (top), Sculpzilla (honorable):14 |
| Muddler Minnow<br>muddler_sculpin | fly | 21/500 | 4.2% | 44 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / clear / freshwater_river / cold_slow_or_front:48, big_fish / clear / freshwater_river / cold_slow_or_front:48 | goal_tags:296, daily_condition_tags:141, seasonal_baseline:20, forage_clarity_stack:19 | Articulated Baitfish Streamer (top), Sculpzilla (honorable):18, Articulated Baitfish Streamer (top), Game Changer (honorable):17, Sculpin Streamer (top), Woolly Bugger (honorable):15, Articulated Dungeon Streamer (top), Sculpzilla (honorable):14 |
| Ned Rig<br>ned_rig | lure | 39/500 | 7.8% | 35 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / clear / freshwater_river / cold_slow_or_front:48, big_fish / clear / freshwater_river / cold_slow_or_front:48 | goal_tags:371, daily_condition_tags:66, forage_clarity_stack:14, selector_filtering_variety_jitter:8 | Hair Jig (top), Suspending Jerkbait (honorable):28, Inline Spinner (top), Hair Jig (honorable):25, Inline Spinner (top), Soft Plastic Jerkbait (honorable):25, Inline Spinner (top), Casting Spoon (honorable):24 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 12/348 | 3.4% | 38 | all_purpose / dirty / freshwater_river / dirty_vibration:46, big_fish / dirty / freshwater_river / dirty_vibration:46, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:34, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:34 | goal_tags:205, daily_condition_tags:110, forage_clarity_stack:13, selector_filtering_variety_jitter:7 | Articulated Baitfish Streamer (top), Game Changer (honorable):17, Articulated Baitfish Streamer (top), Sculpzilla (honorable):14, Sculpin Streamer (top), Woolly Bugger (honorable):12, Articulated Dungeon Streamer (top), Sculpzilla (honorable):11 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 6/348 | 1.7% | 20 | all_purpose / dirty / freshwater_river / dirty_vibration:46, big_fish / dirty / freshwater_river / dirty_vibration:46, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:34, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:34 | goal_tags:232, daily_condition_tags:93, seasonal_baseline:12, forage_clarity_stack:3 | Articulated Baitfish Streamer (top), Game Changer (honorable):17, Articulated Baitfish Streamer (top), Sculpzilla (honorable):14, Sculpin Streamer (top), Woolly Bugger (honorable):12, Articulated Dungeon Streamer (top), Sculpzilla (honorable):11 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 13/180 | 7.2% | 33 | all_purpose / dirty / freshwater_river / dirty_vibration:20, big_fish / dirty / freshwater_river / dirty_vibration:20, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:14, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:14 | goal_tags:126, daily_condition_tags:24, seasonal_baseline:11, selector_filtering_variety_jitter:6 | Articulated Baitfish Streamer (top), Game Changer (honorable):7, Articulated Dungeon Streamer (top), Sculpzilla (honorable):6, Clouser Minnow (honorable), Bucktail Streamer (top):6, Articulated Baitfish Streamer (top), Sculpzilla (honorable):5 |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/60 | 0% | 4 | all_purpose / clear / freshwater_river / cold_slow_or_front:10, all_purpose / dirty / freshwater_river / dirty_vibration:10, big_fish / clear / freshwater_river / cold_slow_or_front:10, big_fish / dirty / freshwater_river / dirty_vibration:10 | daily_condition_tags:32, goal_tags:27, forage_clarity_stack:1 | Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):7, Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):5, Lead-Eye Leech (top), Muddler Minnow (honorable):4 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 162/528 | 30.7% | 177 | all_purpose / dirty / freshwater_river / dirty_vibration:68, big_fish / dirty / freshwater_river / dirty_vibration:68, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:48, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:48 | goal_tags:164, daily_condition_tags:103, selector_filtering_variety_jitter:79, forage_clarity_stack:10 | Articulated Dungeon Streamer (top), Sculpzilla (honorable):16, Sculpin Streamer (top), Woolly Bugger (honorable):15, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):14, Articulated Dungeon Streamer (honorable), Game Changer (top):12 |
| Inline Spinner<br>inline_spinner | lure | 181/504 | 35.9% | 197 | all_purpose / dirty / freshwater_river / dirty_vibration:68, big_fish / dirty / freshwater_river / dirty_vibration:68, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:48, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:48 | selector_filtering_variety_jitter:145, goal_tags:122, forage_clarity_stack:27, daily_condition_tags:22 | Hair Jig (top), Suspending Jerkbait (honorable):27, Hair Jig (top), Blade Bait (honorable):18, Casting Spoon (top), Suspending Jerkbait (honorable):15, Suspending Jerkbait (top), Casting Spoon (honorable):15 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 192/504 | 38.1% | 103 | all_purpose / dirty / freshwater_river / dirty_vibration:68, big_fish / dirty / freshwater_river / dirty_vibration:68, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:48, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:48 | daily_condition_tags:175, selector_filtering_variety_jitter:50, forage_clarity_stack:36, goal_tags:36 | Inline Spinner (top), Soft Plastic Jerkbait (honorable):36, Inline Spinner (top), Hair Jig (honorable):26, Inline Spinner (top), Casting Spoon (honorable):24, Hair Jig (top), Blade Bait (honorable):18 |
| Casting Spoon<br>casting_spoon | lure | 183/504 | 36.3% | 87 | all_purpose / dirty / freshwater_river / dirty_vibration:68, big_fish / dirty / freshwater_river / dirty_vibration:68, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:48, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:48 | goal_tags:203, daily_condition_tags:55, selector_filtering_variety_jitter:50, forage_clarity_stack:9 | Inline Spinner (top), Soft Plastic Jerkbait (honorable):36, Hair Jig (top), Suspending Jerkbait (honorable):27, Inline Spinner (top), Hair Jig (honorable):26, Inline Spinner (honorable), Suspending Jerkbait (top):20 |
| Hair Jig<br>hair_jig | lure | 222/500 | 44.4% | 145 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / clear / freshwater_river / cold_slow_or_front:48, big_fish / clear / freshwater_river / cold_slow_or_front:48 | goal_tags:139, selector_filtering_variety_jitter:78, daily_condition_tags:33, seasonal_baseline:22 | Inline Spinner (top), Soft Plastic Jerkbait (honorable):25, Inline Spinner (top), Casting Spoon (honorable):24, Inline Spinner (honorable), Suspending Jerkbait (top):21, Inline Spinner (honorable), Casting Spoon (top):14 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 102/348 | 29.3% | 65 | all_purpose / dirty / freshwater_river / dirty_vibration:46, big_fish / dirty / freshwater_river / dirty_vibration:46, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:34, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:34 | daily_condition_tags:163, seasonal_baseline:40, goal_tags:30, selector_filtering_variety_jitter:13 | Inline Spinner (top), Hair Jig (honorable):23, Inline Spinner (top), Casting Spoon (honorable):18, Inline Spinner (honorable), Suspending Jerkbait (top):16, Inline Spinner (honorable), Casting Spoon (top):14 |
| Blade Bait<br>blade_bait | lure | 79/252 | 31.3% | 50 | all_purpose / dirty / freshwater_river / dirty_vibration:36, big_fish / dirty / freshwater_river / dirty_vibration:36, all_purpose / clear / freshwater_river / cold_slow_or_front:28, big_fish / clear / freshwater_river / cold_slow_or_front:28 | goal_tags:69, daily_condition_tags:51, forage_clarity_stack:26, seasonal_baseline:15 | Hair Jig (top), Suspending Jerkbait (honorable):21, Inline Spinner (top), Hair Jig (honorable):13, Hair Jig (top), Casting Spoon (honorable):10, Hair Jig (top), Ned Rig (honorable):10 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 82/204 | 40.2% | 30 | all_purpose / stained / freshwater_river / stable_pleasant_medium_confidence_archive:10, big_fish / stained / freshwater_river / stable_pleasant_medium_confidence_archive:10, all_purpose / clear / freshwater_river / cold_slow_or_front:8, all_purpose / clear / freshwater_river / stable_pleasant_medium_confidence_archive:8 | goal_tags:94, selector_filtering_variety_jitter:26, daily_condition_tags:2 | Hair Jig (top), Soft Plastic Jerkbait (honorable):11, Inline Spinner (top), Casting Spoon (honorable):11, Inline Spinner (top), Soft Plastic Jerkbait (honorable):9, Suspending Jerkbait (top), Hair Jig (honorable):9 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Suspending Jerkbait [lure] (34), Inline Spinner [lure] (27), Clouser Minnow [fly] (22), Soft Plastic Jerkbait [lure] (20), Articulated Baitfish Streamer [fly] (13) | Inline Spinner [lure] (51), Suspending Jerkbait [lure] (47), Clouser Minnow [fly] (43), Soft Plastic Jerkbait [lure] (39), Hair Jig [lure] (35) |
| calm_surface | big_fish | Small Floating Trout Plug [lure] (59), Articulated Baitfish Streamer [fly] (27), Game Changer [fly] (24), Articulated Dungeon Streamer [fly] (19), Mouse Fly [fly] (19) | Small Floating Trout Plug [lure] (76), Game Changer [fly] (46), Articulated Baitfish Streamer [fly] (45), Sculpzilla [fly] (41), Mouse Fly [fly] (34) |
| low_light_surface | all_purpose | Inline Spinner [lure] (12), Suspending Jerkbait [lure] (9), Zonker Streamer [fly] (7), Clouser Minnow [fly] (5), Bucktail Streamer [fly] (4) | Inline Spinner [lure] (17), Suspending Jerkbait [lure] (13), Clouser Minnow [fly] (11), Soft Plastic Jerkbait [lure] (11), Casting Spoon [lure] (10) |
| low_light_surface | big_fish | Small Floating Trout Plug [lure] (12), Articulated Baitfish Streamer [fly] (10), Articulated Dungeon Streamer [fly] (6), Game Changer [fly] (6), Hair Jig [lure] (6) | Small Floating Trout Plug [lure] (17), Articulated Baitfish Streamer [fly] (13), Casting Spoon [lure] (13), Sculpzilla [fly] (13), Articulated Dungeon Streamer [fly] (12) |
| wind_reaction | all_purpose | Inline Spinner [lure] (56), Suspending Jerkbait [lure] (31), Casting Spoon [lure] (30), Zonker Streamer [fly] (28), Bucktail Streamer [fly] (21) | Inline Spinner [lure] (88), Suspending Jerkbait [lure] (62), Casting Spoon [lure] (54), Conehead Streamer [fly] (46), Zonker Streamer [fly] (40) |
| wind_reaction | big_fish | Casting Spoon [lure] (39), Suspending Jerkbait [lure] (30), Articulated Baitfish Streamer [fly] (29), Hair Jig [lure] (26), Inline Spinner [lure] (22) | Casting Spoon [lure] (72), Suspending Jerkbait [lure] (64), Articulated Baitfish Streamer [fly] (60), Articulated Dungeon Streamer [fly] (56), Hair Jig [lure] (54) |
| dirty_vibration | all_purpose | Inline Spinner [lure] (55), Suspending Jerkbait [lure] (30), Sculpin Streamer [fly] (27), Casting Spoon [lure] (26), Clouser Minnow [fly] (23) | Inline Spinner [lure] (84), Suspending Jerkbait [lure] (55), Casting Spoon [lure] (51), Hair Jig [lure] (46), Sculpin Streamer [fly] (41) |
| dirty_vibration | big_fish | Casting Spoon [lure] (34), Hair Jig [lure] (33), Articulated Baitfish Streamer [fly] (32), Inline Spinner [lure] (30), Articulated Dungeon Streamer [fly] (25) | Casting Spoon [lure] (68), Articulated Baitfish Streamer [fly] (62), Hair Jig [lure] (61), Articulated Dungeon Streamer [fly] (57), Sculpzilla [fly] (55) |
| clear_subtle | all_purpose | Suspending Jerkbait [lure] (25), Hair Jig [lure] (18), Lead-Eye Leech [fly] (15), Soft Plastic Jerkbait [lure] (14), Slim Baitfish Streamer [fly] (13) | Hair Jig [lure] (32), Suspending Jerkbait [lure] (32), Soft Plastic Jerkbait [lure] (29), Inline Spinner [lure] (28), Clouser Minnow [fly] (25) |
| clear_subtle | big_fish | Hair Jig [lure] (26), Suspending Jerkbait [lure] (22), Articulated Baitfish Streamer [fly] (20), Game Changer [fly] (17), Articulated Dungeon Streamer [fly] (11) | Hair Jig [lure] (37), Suspending Jerkbait [lure] (33), Game Changer [fly] (32), Sculpzilla [fly] (27), Articulated Baitfish Streamer [fly] (26) |
| cold_slow | all_purpose | Sculpin Streamer [fly] (27), Hair Jig [lure] (24), Suspending Jerkbait [lure] (21), Inline Spinner [lure] (17), Blade Bait [lure] (11) | Hair Jig [lure] (40), Inline Spinner [lure] (38), Woolly Bugger [fly] (35), Sculpin Streamer [fly] (34), Suspending Jerkbait [lure] (33) |
| cold_slow | big_fish | Hair Jig [lure] (27), Suspending Jerkbait [lure] (21), Articulated Baitfish Streamer [fly] (17), Articulated Dungeon Streamer [fly] (17), Rabbit-Strip Leech [fly] (17) | Hair Jig [lure] (47), Suspending Jerkbait [lure] (40), Articulated Dungeon Streamer [fly] (38), Blade Bait [lure] (33), Rabbit-Strip Leech [fly] (33) |
| warming_search | all_purpose | Inline Spinner [lure] (28), Suspending Jerkbait [lure] (20), Clouser Minnow [fly] (17), Hair Jig [lure] (15), Sculpin Streamer [fly] (14) | Inline Spinner [lure] (42), Suspending Jerkbait [lure] (36), Clouser Minnow [fly] (29), Hair Jig [lure] (29), Casting Spoon [lure] (22) |
| warming_search | big_fish | Hair Jig [lure] (22), Casting Spoon [lure] (21), Articulated Baitfish Streamer [fly] (18), Articulated Dungeon Streamer [fly] (17), Game Changer [fly] (15) | Sculpzilla [fly] (40), Casting Spoon [lure] (37), Articulated Baitfish Streamer [fly] (34), Hair Jig [lure] (33), Game Changer [fly] (30) |
| heat_finesse | all_purpose | Clouser Minnow [fly] (4), Hair Jig [lure] (3), Suspending Jerkbait [lure] (3), Bucktail Streamer [fly] (2), Lead-Eye Leech [fly] (2) | Ned Rig [lure] (6), Clouser Minnow [fly] (5), Soft Plastic Jerkbait [lure] (5), Suspending Jerkbait [lure] (5), Hair Jig [lure] (4) |
| heat_finesse | big_fish | Game Changer [fly] (5), Hair Jig [lure] (5), Articulated Dungeon Streamer [fly] (3), Articulated Baitfish Streamer [fly] (2), Inline Spinner [lure] (2) | Game Changer [fly] (6), Hair Jig [lure] (6), Ned Rig [lure] (6), Sculpzilla [fly] (5), Articulated Baitfish Streamer [fly] (4) |
| current_swing | all_purpose | Inline Spinner [lure] (62), Sculpin Streamer [fly] (44), Hair Jig [lure] (34), Suspending Jerkbait [lure] (33), Clouser Minnow [fly] (29) | Inline Spinner [lure] (96), Hair Jig [lure] (66), Suspending Jerkbait [lure] (61), Sculpin Streamer [fly] (57), Clouser Minnow [fly] (51) |
| current_swing | big_fish | Hair Jig [lure] (52), Articulated Baitfish Streamer [fly] (41), Sculpzilla [fly] (33), Casting Spoon [lure] (32), Articulated Dungeon Streamer [fly] (30) | Hair Jig [lure] (85), Sculpzilla [fly] (75), Articulated Baitfish Streamer [fly] (70), Casting Spoon [lure] (70), Articulated Dungeon Streamer [fly] (68) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-09-21 dirty big_fish B | 55.3-73F, 6.4 mph wind, 93.5% cloud, 0.4 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Small Floating Trout Plug (170); Inline Spinner (180); Game Changer (176); Articulated Baitfish Streamer (192) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-10-20 dirty big_fish B | 38.7-57.7F, 6.9 mph wind, 18.8% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (180); Blade Bait (154); Zonker Streamer (180); Articulated Baitfish Streamer (192) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| Elk River Appalachian trout water<br>2025-06-17 clear big_fish B | 64.8-77.5F, 8.2 mph wind, 61.9% cloud, 0.3 in precip | neutral, caution, wind_reaction+runoff_streamer+current_swing+open_water_search, medium | Soft Plastic Jerkbait (158); Hair Jig (160); Game Changer (176); Articulated Baitfish Streamer (184) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (174); Blade Bait (164); Game Changer (166); Articulated Dungeon Streamer (166) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Hair Jig (176); Suspending Jerkbait (176); Clouser Minnow (192); Sculpzilla (168) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-03-18 stained big_fish B | 57.4-75.4F, 14 mph wind, 85.9% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Inline Spinner (172); Soft Plastic Jerkbait (158); Game Changer (176); Articulated Baitfish Streamer (176) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear big_fish B | 59.5-87.5F, 9.2 mph wind, 19.1% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle+open_water_search, medium | Hair Jig (160); Soft Plastic Jerkbait (174); Unweighted Baitfish Streamer (162); Sculpzilla (138) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Au Sable / Upper Midwest trout river<br>2025-03-28 clear big_fish B | 27-50.9F, 8.1 mph wind, 99.2% cloud, 0 in precip | active, closed, wind_reaction+warming_search+open_water_search, medium | Inline Spinner (162); Blade Bait (152); Bucktail Streamer (162); Articulated Baitfish Streamer (158) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty big_fish B | 27-50.9F, 8.1 mph wind, 99.2% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Blade Bait (152); Inline Spinner (154); Sculpzilla (156); Rabbit-Strip Leech (150) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Au Sable / Upper Midwest trout river<br>2025-03-28 stained big_fish B | 27-50.9F, 8.1 mph wind, 99.2% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Inline Spinner (162); Blade Bait (152); Game Changer (166); Sculpzilla (156) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Au Sable / Upper Midwest trout river<br>2025-09-20 clear big_fish B | 50.5-70.2F, 8.9 mph wind, 74.9% cloud, 0.6 in precip | neutral, caution, wind_reaction+runoff_streamer+current_swing+open_water_search, medium | Soft Plastic Jerkbait (158); Hair Jig (160); Articulated Dungeon Streamer (176); Sculpzilla (170) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Au Sable / Upper Midwest trout river<br>2025-09-20 dirty big_fish B | 50.5-70.2F, 8.9 mph wind, 74.9% cloud, 0.6 in precip | neutral, caution, wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Soft Plastic Jerkbait (150); Suspending Jerkbait (148); Articulated Baitfish Streamer (192); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-09-20 stained big_fish B | 50.5-70.2F, 8.9 mph wind, 74.9% cloud, 0.6 in precip | neutral, caution, wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (188); Hair Jig (160); Articulated Baitfish Streamer (192); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-09-21 clear all_purpose B | 55.3-73F, 6.4 mph wind, 93.5% cloud, 0.4 in precip | neutral, open, low_light_surface+wind_reaction+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (184); Suspending Jerkbait (186); Clouser Minnow (202); Bucktail Streamer (200) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-09-21 clear big_fish B | 55.3-73F, 6.4 mph wind, 93.5% cloud, 0.4 in precip | neutral, open, low_light_surface+wind_reaction+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (168); Hair Jig (160); Articulated Baitfish Streamer (184); Sculpzilla (170) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-09-21 dirty all_purpose B | 55.3-73F, 6.4 mph wind, 93.5% cloud, 0.4 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (176); Inline Spinner (210); Conehead Streamer (192); Bucktail Streamer (192) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-09-21 stained big_fish B | 55.3-73F, 6.4 mph wind, 93.5% cloud, 0.4 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (184); Hair Jig (160); Articulated Baitfish Streamer (192); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-10-20 clear big_fish B | 38.7-57.7F, 6.9 mph wind, 18.8% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (184); Soft Plastic Jerkbait (174); Articulated Baitfish Streamer (184); Sculpzilla (170) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-10-20 dirty all_purpose B | 38.7-57.7F, 6.9 mph wind, 18.8% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (176); Inline Spinner (210); Articulated Baitfish Streamer (184); Clouser Minnow (194) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-10-20 stained all_purpose A | 38.7-57.7F, 6.9 mph wind, 18.8% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (218); Suspending Jerkbait (186); Clouser Minnow (202); Articulated Baitfish Streamer (184) | WIND_NOT_ELEVATING_REACTION, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-10-20 stained all_purpose B | 38.7-57.7F, 6.9 mph wind, 18.8% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (184); Inline Spinner (218); Zonker Streamer (200); Conehead Streamer (200) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-12-12 clear all_purpose B | 1.7-22.9F, 7.9 mph wind, 99.6% cloud, 0.1 in precip | neutral, closed, wind_reaction+cold_slow, medium | Blade Bait (178); Suspending Jerkbait (176); Lead-Eye Leech (184); Muddler Minnow (178) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Madison River mountain-west trout water<br>2025-11-11 clear big_fish B | 28.2-45.8F, 4.1 mph wind, 64.1% cloud, 0 in precip | active, closed, warming_search, medium | Ned Rig (134); Blade Bait (140); Sculpzilla (152); Articulated Baitfish Streamer (138) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-03-30 clear all_purpose B | 38.3-62.8F, 11.8 mph wind, 80.6% cloud, 0 in precip | active, closed, wind_reaction+warming_search+runoff_streamer+current_swing+open_water_search, medium | Hair Jig (176); Suspending Jerkbait (176); Bucktail Streamer (190); Clouser Minnow (192) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-03-30 clear big_fish B | 38.3-62.8F, 11.8 mph wind, 80.6% cloud, 0 in precip | active, closed, wind_reaction+warming_search+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (174); Hair Jig (170); Game Changer (166); Articulated Dungeon Streamer (166) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-06-21 stained all_purpose B | 58.2-80.4F, 4.4 mph wind, 50.2% cloud, 0 in precip | neutral, open, calm_surface+dirty_vibration+runoff_streamer+current_swing, medium | Suspending Jerkbait (170); Casting Spoon (152); Bucktail Streamer (168); Clouser Minnow (186) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-12-12 clear all_purpose B | 12.2-29.4F, 9.8 mph wind, 66.5% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, medium | Blade Bait (178); Suspending Jerkbait (176); Lead-Eye Leech (184); Muddler Minnow (178) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Elk River Appalachian trout water<br>2025-04-04 clear big_fish B | 57.2-69.3F, 8.6 mph wind, 100% cloud, 0.5 in precip | neutral, closed, wind_reaction+warming_search+runoff_streamer+current_swing+open_water_search, medium | Soft Plastic Jerkbait (158); Casting Spoon (184); Articulated Baitfish Streamer (184); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Elk River Appalachian trout water<br>2025-04-04 dirty all_purpose B | 57.2-69.3F, 8.6 mph wind, 100% cloud, 0.5 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (176); Inline Spinner (210); Articulated Baitfish Streamer (184); Clouser Minnow (194) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Elk River Appalachian trout water<br>2025-04-04 dirty big_fish B | 57.2-69.3F, 8.6 mph wind, 100% cloud, 0.5 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (180); Hair Jig (152); Sculpzilla (178); Articulated Baitfish Streamer (192) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Elk River Appalachian trout water<br>2025-04-04 stained all_purpose B | 57.2-69.3F, 8.6 mph wind, 100% cloud, 0.5 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (186); Casting Spoon (184); Clouser Minnow (202); Bucktail Streamer (200) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (192); Blade Bait (180); Sculpin Streamer (190); Zonker Streamer (190) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |

## Known Coverage Gaps

- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
