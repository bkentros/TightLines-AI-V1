# FinFindr LMB Daily-Picks Archive Audit
Generated: 2026-05-12T14:39:13.094Z

## Scope Summary

| Metric | Value |
| --- | --- |
| Archived weather scenarios | 74 |
| Expanded recommendation runs | 888 |
| Months | Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec |
| Regions | 12 |
| Fisheries | 17 |
| Water types | freshwater_lake_pond, freshwater_river |
| Clarity split | clear:296, stained:296, dirty:296 |
| Goal split | all_purpose:444, big_fish:444 |
| Skipped weather scenarios | 0 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/daily-picks-archive-audit.lmb.jsonl |

## Condition Bucket Coverage

| Bucket | Expanded runs |
| --- | --- |
| calm_low_light_surface | 72 |
| calm_bright_clear_subtle | 48 |
| breezy_windy_stained_reaction | 108 |
| dirty_vibration | 120 |
| cold_slow_or_front | 216 |
| warming_search | 192 |
| heat_limited_finesse | 120 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 348 |
| river_elevated_runoff_current | 36 |
| medium_confidence_archive | 888 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 3 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 -> 2025-03-19 | changed | 7.8 | 3.5 | cold_slow -> calm_surface|cold_slow |
| Guntersville / Tennessee River reservoir<br>2025-10-19 -> 2025-10-20 | changed | 8.3 | 3.3 | wind_reaction|dirty_vibration|open_water_search -> none |
| Minnesota natural bass lake<br>2025-09-20 -> 2025-09-21 | changed | 1.8 | 1.5 | none -> calm_surface |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 55 | WIND_NOT_ELEVATING_REACTION (62), BIG_FISH_NOT_FAVORING_UPSIDE (4), TOPWATER_SHOULDER_SEASON_REGION (2), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1), COLD_CLEAR_TOO_FAST (1) |
| calm_bright_clear_subtle | 1 | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (1) |
| calm_low_light_surface | 2 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2) |
| cold_slow_or_front | 56 | WIND_NOT_ELEVATING_REACTION (49), TOPWATER_SHOULDER_SEASON_REGION (8), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (7), BIG_FISH_NOT_FAVORING_UPSIDE (6), COLD_CLEAR_TOO_FAST (3) |
| dirty_vibration | 46 | WIND_NOT_ELEVATING_REACTION (42), BIG_FISH_NOT_FAVORING_UPSIDE (5), DIRTY_WIND_NOT_ELEVATING_VIBRATION (4), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), TOPWATER_SHOULDER_SEASON_REGION (3) |
| heat_limited_finesse | 4 | BIG_FISH_NOT_FAVORING_UPSIDE (3), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| medium_confidence_archive | 168 | WIND_NOT_ELEVATING_REACTION (160), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (18), BIG_FISH_NOT_FAVORING_UPSIDE (15), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (9), TOPWATER_SHOULDER_SEASON_REGION (8) |
| river_elevated_runoff_current | 5 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), BIG_FISH_NOT_FAVORING_UPSIDE (2), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| stable_pleasant_medium_confidence_archive | 82 | WIND_NOT_ELEVATING_REACTION (82), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (11), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (8), BIG_FISH_NOT_FAVORING_UPSIDE (4), DIRTY_WIND_NOT_ELEVATING_VIBRATION (3) |
| warming_search | 20 | WIND_NOT_ELEVATING_REACTION (20), BIG_FISH_NOT_FAVORING_UPSIDE (2), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1) |

- WIND_NOT_ELEVATING_REACTION: 160
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 18
- BIG_FISH_NOT_FAVORING_UPSIDE: 15
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 9
- TOPWATER_SHOULDER_SEASON_REGION: 8
- DIRTY_WIND_NOT_ELEVATING_VIBRATION: 4
- COLD_CLEAR_TOO_FAST: 3

- co_pueblo__2025-08-12__freshwater_lake_pond__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION. Picks: Magnum Worm (lure); Medium-Diving Crankbait (lure); Bluegill Streamer (fly); Game Changer (fly)
- ca_clear_lake__2025-10-25__freshwater_lake_pond__clear__big_fish__A: TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST. Picks: Buzzbait (lure); Magnum Jerkbait (lure); Deer Hair Slider (fly); Game Changer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Flat-Sided Crankbait (lure); Unweighted Baitfish Streamer (fly); Clouser Minnow (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__all_purpose__B: DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION. Picks: Soft Plastic Jerkbait (lure); Spinnerbait (lure); Clouser Minnow (fly); Unweighted Baitfish Streamer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Flat-Sided Crankbait (lure); Weightless Stick Worm (lure); Unweighted Baitfish Streamer (fly); Clouser Minnow (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__dirty__all_purpose__A: DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Bladed Jig (lure); Popper Fly (fly); Unweighted Baitfish Streamer (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Spinnerbait (lure); Magnum Jerkbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION. Picks: Squarebill Crankbait (lure); Compact Flipping Jig (lure); Unweighted Baitfish Streamer (fly); Articulated Baitfish Streamer (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- sc_santee_cooper__2025-04-05__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Walking Topwater (lure); Compact Flipping Jig (lure); Deer Hair Slider (fly); Game Changer (fly)
- sc_santee_cooper__2025-05-18__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Walking Topwater (lure); Wake Bait (lure); Frog Fly (fly); Bluegill Streamer (fly)
- sc_santee_cooper__2025-05-18__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Wake Bait (lure); Compact Flipping Jig (lure); Frog Fly (fly); Articulated Baitfish Streamer (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Drop-Shot Minnow (lure); Finesse Jig (lure); Lead-Eye Leech (fly); Woolly Bugger (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Unweighted Baitfish Streamer (fly); Game Changer (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- mo_lake_ozarks__2025-06-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Weightless Stick Worm (lure); Flat-Sided Crankbait (lure); Popper Fly (fly); Unweighted Baitfish Streamer (fly)
- mo_lake_ozarks__2025-06-18__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Wake Bait (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Mouse Fly (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Tube Jig (lure); Bladed Jig (lure); Clouser Minnow (fly); Game Changer (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Deep-Diving Crankbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Bluegill Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- mn_minnetonka__2025-07-16__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Wake Bait (lure); Compact Flipping Jig (lure); Game Changer (fly); Deer Hair Slider (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain__2025-08-14__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Soft Plastic Jerkbait (lure); Paddle-Tail Swimbait (lure); Deceiver (fly); Baitfish Slider Fly (fly)
- vt_champlain__2025-08-14__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Magnum Worm (lure); Suspending Jerkbait (lure); Bluegill Streamer (fly); Game Changer (fly)
- vt_champlain__2025-08-14__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Paddle-Tail Swimbait (lure); Lipless Crankbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- wv_new_river__2025-06-17__freshwater_river__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK, DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Weightless Stick Worm (lure); Buzzbait (lure); Clouser Minnow (fly); Popper Fly (fly)
- co_pueblo__2025-10-05__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Tube Jig (lure); Drop-Shot Minnow (lure); Clouser Minnow (fly); Baitfish Slider Fly (fly)
- co_pueblo__2025-10-05__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- co_pueblo__2025-10-05__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Lipless Crankbait (lure); Medium-Diving Crankbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ca_clear_lake__2025-10-25__freshwater_lake_pond__stained__big_fish__A: TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST. Picks: Magnum Jerkbait (lure); Buzzbait (lure); Baitfish Slider Fly (fly); Articulated Baitfish Streamer (fly)
- ca_clear_lake__2025-10-25__freshwater_lake_pond__dirty__big_fish__A: TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST. Picks: Magnum Jerkbait (lure); Buzzbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ca_clear_lake__2025-10-25__freshwater_lake_pond__dirty__big_fish__B: TOPWATER_SHOULDER_SEASON_REGION. Picks: Compact Flipping Jig (lure); Walking Topwater (lure); Deer Hair Slider (fly); Articulated Dungeon Streamer (fly)
- ca_castaic__2025-02-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Carolina-Rigged Stick Worm (lure); Blade Bait (lure); Feather Jig Leech (fly); Articulated Baitfish Streamer (fly)
- fl_okeechobee__2025-08-18__freshwater_lake_pond__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Soft Plastic Jerkbait (lure); Magnum Worm (lure); Bluegill Streamer (fly); Articulated Baitfish Streamer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Lipless Crankbait (lure); Articulated Baitfish Streamer (fly); Clouser Minnow (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Deceiver (fly); Game Changer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Bladed Jig (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Soft Plastic Jerkbait (lure); Suspending Jerkbait (lure); Unweighted Baitfish Streamer (fly); Clouser Minnow (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Magnum Jerkbait (lure); Game Changer (fly); Bluegill Streamer (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Squarebill Crankbait (lure); Buzzbait (lure); Bluegill Streamer (fly); Game Changer (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Squarebill Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Drop-Shot Minnow (lure); Clouser Minnow (fly); Game Changer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle-Tail Swimbait (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Articulated Baitfish Streamer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Articulated Dungeon Streamer (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 81
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 30
- ADJACENT_DAY_EXACT_REPEAT: 6
- SET_B_ID_OVERLAP_AVOIDABLE: 5

- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Soft Plastic Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Rabbit-Strip Leech (fly); Woolly Bugger (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Articulated Dungeon Streamer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mo_lake_ozarks__2025-04-24__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Weightless Stick Worm (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- mo_lake_ozarks__2025-04-24__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Weightless Stick Worm (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- vt_champlain__2025-10-12__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- wv_stonewall__2025-03-26__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Deep-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- wv_stonewall__2025-11-08__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Paddle-Tail Swimbait (lure); Compact Flipping Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wv_stonewall__2025-11-08__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Medium-Diving Crankbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- co_pueblo__2025-04-23__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ca_clear_lake__2025-03-30__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ca_castaic__2025-02-18__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Suspending Jerkbait (lure); Deceiver (fly); Articulated Dungeon Streamer (fly)
- ca_castaic__2025-02-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- az_havasu__2025-03-25__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Drop-Shot Minnow (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- nm_elephant_butte__2025-10-14__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Compact Flipping Jig (lure); Baitfish Slider Fly (fly); Articulated Dungeon Streamer (fly)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Glide Bait (lure); Flat-Sided Crankbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Soft Plastic Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Lead-Eye Leech (fly); Baitfish Slider Fly (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__all_purpose__B: ADJACENT_DAY_EXACT_REPEAT. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Popper Fly (fly); Baitfish Slider Fly (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hollow-Body Frog (lure); Magnum Jerkbait (lure); Frog Fly (fly); Articulated Dungeon Streamer (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Carolina-Rigged Stick Worm (lure); Baitfish Slider Fly (fly); Unweighted Baitfish Streamer (fly)
- fl_okeechobee__2025-12-12__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- fl_okeechobee__2025-12-12__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Swim Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- fl_okeechobee__2025-12-12__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Paddle-Tail Swimbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Carolina-Rigged Stick Worm (lure); Deep-Diving Crankbait (lure); Woolly Bugger (fly); Feather Jig Leech (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Drop-Shot Minnow (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Drop-Shot Minnow (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Ned Rig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-04-12__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Magnum Jerkbait (lure); Buzzbait (lure); Articulated Dungeon Streamer (fly); Frog Fly (fly)
- tx_sam_rayburn__2025-04-12__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Buzzbait (lure); Hollow-Body Frog (lure); Articulated Dungeon Streamer (fly); Deer Hair Slider (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Baitfish Slider Fly (fly); Game Changer (fly)
- al_guntersville__2025-03-08__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Baitfish Slider Fly (fly); Game Changer (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Compact Flipping Jig (lure); Unweighted Baitfish Streamer (fly); Articulated Baitfish Streamer (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Football Jig (lure); Baitfish Slider Fly (fly); Articulated Baitfish Streamer (fly)
- al_guntersville__2025-10-20__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- al_guntersville__2025-10-20__freshwater_lake_pond__stained__big_fish__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- al_guntersville__2025-10-20__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Paddle-Tail Swimbait (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- al_guntersville__2025-10-20__freshwater_lake_pond__dirty__big_fish__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- al_guntersville__2025-10-20__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Spinnerbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- sc_santee_cooper__2025-05-18__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Buzzbait (lure); Squarebill Crankbait (lure); Articulated Dungeon Streamer (fly); Deer Hair Slider (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Deceiver (fly)
- nc_jordan_lake__2025-10-04__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hollow-Body Frog (lure); Magnum Jerkbait (lure); Articulated Dungeon Streamer (fly); Frog Fly (fly)
- mo_lake_ozarks__2025-02-20__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mo_lake_ozarks__2025-02-20__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mo_lake_ozarks__2025-02-20__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Deep-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mo_lake_ozarks__2025-04-24__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Drop-Shot Minnow (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Unweighted Baitfish Streamer (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Articulated Dungeon Streamer (fly); Deceiver (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Articulated Dungeon Streamer (fly)

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | florida | cold_slow:1 |
| Feb | midwest_interior | cold_slow:1 |
| Feb | south_central | stable:1 |
| Feb | southern_california | warming:1 |
| Mar | appalachian | cold_slow:1 |
| Mar | florida | cold_slow:2 |
| Mar | great_lakes_upper_midwest | stable:1 |
| Mar | northern_california | cold_slow:1 |
| Mar | south_central | cooling_or_shock:1, warming:2 |
| Mar | southeast_atlantic | cooling_or_shock:1 |
| Mar | southwest_desert | heat_limited:1 |
| Apr | appalachian | warming:1 |
| Apr | great_lakes_upper_midwest | cooling_or_shock:1 |
| Apr | midwest_interior | heat_limited:1 |
| Apr | mountain_west | warming:1 |
| Apr | northeast | cold_slow:1 |
| Apr | south_central | stable:3 |
| Apr | southeast_atlantic | stable:1 |
| Apr | southern_california | cooling_or_shock:1 |
| Apr | southwest_high_desert | heat_limited:1 |
| May | appalachian | stable:1, cold_slow:1 |
| May | great_lakes_upper_midwest | stable:1 |
| May | northern_california | stable:1 |
| May | south_central | stable:1 |
| May | southeast_atlantic | stable:1, warming:1 |
| Jun | appalachian | stable:1 |
| Jun | florida | stable:1 |
| Jun | great_lakes_upper_midwest | stable:1 |
| Jun | midwest_interior | stable:1 |
| Jun | mountain_west | heat_limited:1 |
| Jun | northeast | stable:1 |
| Jun | south_central | stable:1, warming:1 |
| Jun | southwest_desert | heat_limited:1 |
| Jun | southwest_high_desert | stable:1 |
| Jul | appalachian | warming:1 |
| Jul | great_lakes_upper_midwest | cooling_or_shock:1 |
| Jul | south_central | warming:1 |
| Jul | southeast_atlantic | heat_limited:1 |
| Jul | southern_california | warming:1 |
| Aug | florida | stable:1 |
| Aug | great_lakes_upper_midwest | warming:1 |
| Aug | mountain_west | cooling_or_shock:1 |
| Aug | northeast | stable:1 |
| Aug | northern_california | stable:1 |
| Aug | southeast_atlantic | stable:1 |
| Aug | southwest_desert | heat_limited:1 |
| Aug | southwest_high_desert | stable:1 |
| Sep | appalachian | warming:1 |
| Sep | great_lakes_upper_midwest | stable:2 |
| Sep | midwest_interior | heat_limited:1 |
| Sep | south_central | stable:1 |
| Sep | southeast_atlantic | stable:1 |
| Sep | southern_california | heat_limited:1 |
| Oct | great_lakes_upper_midwest | heat_limited:1 |
| Oct | mountain_west | stable:1 |
| Oct | northeast | warming:1 |
| Oct | northern_california | cold_slow:1 |
| Oct | south_central | stable:1, cooling_or_shock:1 |
| Oct | southeast_atlantic | warming:1 |
| Oct | southwest_high_desert | warming:1 |
| Nov | appalachian | warming:1 |
| Nov | midwest_interior | cooling_or_shock:1 |
| Nov | southwest_desert | cooling_or_shock:1 |
| Dec | florida | stable:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

| Scenario | Temp | Top winners needing review |
| --- | --- | --- |
| Santee Cooper<br>2025-07-28 clear all_purpose B | 80.4-94.6F | Popper Fly (medium) |
| Santee Cooper<br>2025-07-28 clear big_fish A | 80.4-94.6F | Walking Topwater (medium) |
| Santee Cooper<br>2025-07-28 clear big_fish B | 80.4-94.6F | Deer Hair Slider (medium) |
| Santee Cooper<br>2025-07-28 stained all_purpose A | 80.4-94.6F | Game Changer (medium) |
| Santee Cooper<br>2025-07-28 stained all_purpose B | 80.4-94.6F | Clouser Minnow (medium) |
| Santee Cooper<br>2025-07-28 stained big_fish A | 80.4-94.6F | Walking Topwater (medium) |
| Santee Cooper<br>2025-07-28 dirty all_purpose A | 80.4-94.6F | Suspending Jerkbait (medium); Baitfish Slider Fly (medium) |
| Santee Cooper<br>2025-07-28 dirty all_purpose B | 80.4-94.6F | Squarebill Crankbait (medium); Deceiver (medium) |
| Santee Cooper<br>2025-07-28 dirty big_fish A | 80.4-94.6F | Deer Hair Slider (medium) |
| Lake of the Ozarks<br>2025-04-24 clear all_purpose B | 56.2-78.4F | Unweighted Baitfish Streamer (medium) |
| Lake of the Ozarks<br>2025-04-24 clear big_fish A | 56.2-78.4F | Game Changer (medium) |
| Lake of the Ozarks<br>2025-04-24 stained all_purpose B | 56.2-78.4F | Unweighted Baitfish Streamer (medium) |
| Lake of the Ozarks<br>2025-04-24 stained big_fish A | 56.2-78.4F | Articulated Baitfish Streamer (medium) |
| Lake of the Ozarks<br>2025-04-24 dirty all_purpose A | 56.2-78.4F | Game Changer (medium) |
| Lake of the Ozarks<br>2025-04-24 dirty all_purpose B | 56.2-78.4F | Baitfish Slider Fly (medium) |
| Lake of the Ozarks<br>2025-04-24 dirty big_fish B | 56.2-78.4F | Articulated Baitfish Streamer (medium) |
| Lake of the Ozarks<br>2025-09-13 clear all_purpose A | 71.4-93.8F | Foam Gurgler (medium) |
| Lake of the Ozarks<br>2025-09-13 clear all_purpose B | 71.4-93.8F | Popper Fly (medium) |
| Lake of the Ozarks<br>2025-09-13 clear big_fish B | 71.4-93.8F | Walking Topwater (medium); Game Changer (medium) |
| Lake of the Ozarks<br>2025-09-13 stained all_purpose A | 71.4-93.8F | Clouser Minnow (medium) |

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Apr | south_central | caution | bright | big_fish | 1 | 48.7-60.9F | 9.6 |
| Apr | south_central | open | glare | all_purpose | 3 | 55.2-78.8F | 5.6 |
| Apr | south_central | open | glare | big_fish | 6 | 55.2-78.8F | 5.6 |
| Apr | south_central | open | low_light | all_purpose | 3 | 63.2-78.0F | 11.6 |
| Apr | south_central | open | low_light | big_fish | 6 | 63.2-78.0F | 11.6 |
| Apr | southeast_atlantic | open | low_light | all_purpose | 3 | 67.1-82.8F | 9.6 |
| Apr | southeast_atlantic | open | low_light | big_fish | 6 | 67.1-82.8F | 9.6 |
| Apr | southern_california | open | mixed | all_purpose | 3 | 52.9-78.6F | 5.4 |
| Apr | southern_california | open | mixed | big_fish | 5 | 52.9-78.6F | 5.4 |
| Aug | florida | caution | bright | big_fish | 2 | 83.1-89.8F | 6.9 |
| Aug | great_lakes_upper_midwest | open | mixed | all_purpose | 5 | 58.5-77.6F | 4.7 |
| Aug | great_lakes_upper_midwest | open | mixed | big_fish | 6 | 58.5-77.6F | 4.7 |
| Aug | southeast_atlantic | open | low_light | all_purpose | 4 | 72.1-80.9F | 4.6 |
| Aug | southeast_atlantic | open | low_light | big_fish | 6 | 72.1-80.9F | 4.6 |
| Aug | southwest_high_desert | caution | bright | big_fish | 3 | 67.7-95.6F | 6.7 |
| Jul | appalachian | open | bright | all_purpose | 4 | 69.2-86.6F | 4.8 |
| Jul | appalachian | open | bright | big_fish | 6 | 69.2-86.6F | 4.8 |
| Jul | great_lakes_upper_midwest | open | low_light | all_purpose | 3 | 56.8-70.2F | 13.8 |
| Jul | great_lakes_upper_midwest | open | low_light | big_fish | 6 | 56.8-70.2F | 13.8 |
| Jul | south_central | open | low_light | all_purpose | 5 | 76.6-94.7F | 4.1 |
| Jul | south_central | open | low_light | big_fish | 6 | 76.6-94.7F | 4.1 |
| Jul | southeast_atlantic | open | mixed | all_purpose | 3 | 80.4-94.6F | 4.2 |
| Jul | southeast_atlantic | open | mixed | big_fish | 6 | 80.4-94.6F | 4.2 |
| Jul | southern_california | open | glare | all_purpose | 5 | 64.3-89.0F | 5.6 |
| Jul | southern_california | open | glare | big_fish | 6 | 64.3-89.0F | 5.6 |
| Jun | appalachian | open | low_light | all_purpose | 6 | 64.2-78.3F | 6.2 |
| Jun | appalachian | open | low_light | big_fish | 6 | 64.2-78.3F | 6.2 |
| Jun | florida | open | low_light | all_purpose | 3 | 78.3-85.4F | 5.7 |
| Jun | florida | open | low_light | big_fish | 6 | 78.3-85.4F | 5.7 |
| Jun | great_lakes_upper_midwest | caution | mixed | big_fish | 1 | 56.6-75.0F | 7.2 |
| Jun | midwest_interior | open | low_light | all_purpose | 6 | 66.9-79.1F | 10.1 |
| Jun | midwest_interior | open | low_light | big_fish | 6 | 66.9-79.1F | 10.1 |
| Jun | mountain_west | caution | glare | big_fish | 1 | 61.5-93.6F | 6.5 |
| Jun | northeast | open | mixed | all_purpose | 6 | 58.4-74.2F | 5.2 |
| Jun | northeast | open | mixed | big_fish | 6 | 58.4-74.2F | 5.2 |
| Jun | south_central | caution | mixed | big_fish | 3 | 74.8-84.7F | 7.3 |
| Jun | south_central | open | low_light | all_purpose | 2 | 71.3-84.0F | 7.2 |
| Jun | south_central | open | low_light | big_fish | 6 | 71.3-84.0F | 7.2 |
| Jun | southwest_high_desert | open | mixed | all_purpose | 6 | 66.8-83.2F | 4.8 |
| Jun | southwest_high_desert | open | mixed | big_fish | 6 | 66.8-83.2F | 4.8 |
| Mar | florida | open | bright | all_purpose | 3 | 59.2-76.4F | 5.9 |
| Mar | florida | open | bright | big_fish | 6 | 59.2-76.4F | 5.9 |
| May | appalachian | open | mixed | all_purpose | 5 | 51.3-72.6F | 5.3 |
| May | appalachian | open | mixed | big_fish | 6 | 51.3-72.6F | 5.3 |
| May | northern_california | open | bright | all_purpose | 6 | 44.9-75.1F | 5.4 |
| May | northern_california | open | bright | big_fish | 6 | 44.9-75.1F | 5.4 |
| May | south_central | caution | mixed | big_fish | 1 | 62.6-76.0F | 10.1 |
| May | southeast_atlantic | open | low_light | all_purpose | 6 | 60.5-85.1F | 5.3 |
| May | southeast_atlantic | open | low_light | big_fish | 12 | 60.5-85.1F | 5.3 |
| Nov | southwest_desert | open | low_light | all_purpose | 1 | 64.4-73.2F | 6.2 |
| Nov | southwest_desert | open | low_light | big_fish | 6 | 64.4-73.2F | 6.2 |
| Oct | northern_california | open | low_light | big_fish | 6 | 49.9-59.6F | 9.9 |
| Oct | southeast_atlantic | open | mixed | big_fish | 6 | 54.6-75.9F | 3 |
| Sep | appalachian | open | low_light | all_purpose | 3 | 55.8-73.2F | 5.6 |
| Sep | appalachian | open | low_light | big_fish | 6 | 55.8-73.2F | 5.6 |
| Sep | great_lakes_upper_midwest | open | mixed | all_purpose | 6 | 60.7-74.0F | 4.6 |
| Sep | great_lakes_upper_midwest | open | mixed | big_fish | 6 | 60.7-74.0F | 4.6 |
| Sep | midwest_interior | open | mixed | all_purpose | 6 | 71.4-93.8F | 5.3 |
| Sep | midwest_interior | open | mixed | big_fish | 6 | 71.4-93.8F | 5.3 |
| Sep | south_central | open | bright | all_purpose | 6 | 72.8-91.2F | 3.6 |
| Sep | south_central | open | bright | big_fish | 6 | 72.8-91.2F | 3.6 |
| Sep | southeast_atlantic | open | low_light | all_purpose | 3 | 71.7-81.1F | 3.9 |
| Sep | southeast_atlantic | open | low_light | big_fish | 6 | 71.7-81.1F | 3.9 |
| Sep | southern_california | open | glare | all_purpose | 5 | 62.0-94.0F | 4.8 |
| Sep | southern_california | open | glare | big_fish | 6 | 62.0-94.0F | 4.8 |

### Shoulder-Season Topwater Selections

| Scenario | Weather | Daily | Topwater picks |
| --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear all_purpose B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Popper Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Hollow-Body Frog; Frog Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Walking Topwater; Deer Hair Slider |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained all_purpose B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Popper Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Walking Topwater |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Hollow-Body Frog; Frog Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty all_purpose A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Popper Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Walking Topwater; Frog Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Hollow-Body Frog |
| Sam Rayburn Reservoir<br>2025-04-12 clear all_purpose A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface+clear_subtle | Popper Fly |
| Sam Rayburn Reservoir<br>2025-04-12 clear big_fish A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface+clear_subtle | Walking Topwater; Deer Hair Slider |
| Sam Rayburn Reservoir<br>2025-04-12 clear big_fish B | 55.2-78.8F, 5.6 mph, glare | open, calm_surface+clear_subtle | Hollow-Body Frog; Frog Fly |
| Sam Rayburn Reservoir<br>2025-04-12 stained all_purpose A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Popper Fly |
| Sam Rayburn Reservoir<br>2025-04-12 stained big_fish A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Hollow-Body Frog; Walking Topwater; Deer Hair Slider |
| Sam Rayburn Reservoir<br>2025-04-12 stained big_fish B | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Buzzbait; Frog Fly |
| Sam Rayburn Reservoir<br>2025-04-12 dirty all_purpose A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Popper Fly |
| Sam Rayburn Reservoir<br>2025-04-12 dirty big_fish A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Walking Topwater; Frog Fly |
| Sam Rayburn Reservoir<br>2025-04-12 dirty big_fish B | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Buzzbait; Hollow-Body Frog; Deer Hair Slider |
| Lake Fork<br>2025-04-30 clear all_purpose B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction | Popper Fly |
| Lake Fork<br>2025-04-30 clear big_fish A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction | Hollow-Body Frog; Deer Hair Slider |
| Lake Fork<br>2025-04-30 clear big_fish B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction | Buzzbait; Walking Topwater; Frog Fly |
| Lake Fork<br>2025-04-30 stained all_purpose B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Popper Fly |
| Lake Fork<br>2025-04-30 stained big_fish A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Buzzbait; Frog Fly |
| Lake Fork<br>2025-04-30 stained big_fish B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Walking Topwater; Deer Hair Slider |
| Lake Fork<br>2025-04-30 dirty all_purpose A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Popper Fly |
| Lake Fork<br>2025-04-30 dirty big_fish A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Buzzbait; Frog Fly |
| Lake Fork<br>2025-04-30 dirty big_fish B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Walking Topwater; Deer Hair Slider |
| Guntersville / Tennessee River reservoir<br>2025-04-11 stained big_fish B | 48.7-60.9F, 9.6 mph, bright | caution, wind_reaction+dirty_vibration | Buzzbait |
| Santee Cooper<br>2025-04-05 clear all_purpose A | 67.1-82.8F, 9.6 mph, low_light | open, low_light_surface+wind_reaction | Popper Fly |
| Santee Cooper<br>2025-04-05 clear big_fish A | 67.1-82.8F, 9.6 mph, low_light | open, low_light_surface+wind_reaction | Buzzbait; Deer Hair Slider |

## Water Column Diversity Diagnostics

### Same-Side Surface/Surface Summary

| Side | Goal | Set | Region | Month | Clarity | Surface tags | Rows | Close non-surface alt | Credible non-surface alt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lure | big_fish | A | appalachian | Jun | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | appalachian | Sep | stained | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | florida | Jun | clear | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | florida | Jun | dirty | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | florida | Jun | stained | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | midwest_interior | Jun | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | midwest_interior | Sep | dirty | calm_surface | 1 | 0 | 0 |
| lure | big_fish | A | northeast | Jun | clear | calm_surface | 1 | 0 | 0 |
| lure | big_fish | A | northeast | Jun | stained | calm_surface | 1 | 0 | 0 |
| lure | big_fish | A | northern_california | May | stained | calm_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Apr | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Apr | dirty | calm_surface | 1 | 1 | 0 |
| lure | big_fish | A | south_central | Apr | stained | calm_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | May | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | May | clear | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Aug | clear | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | southeast_atlantic | Aug | dirty | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Aug | dirty | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | southeast_atlantic | Aug | stained | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Aug | stained | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Sep | dirty | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Sep | stained | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | southwest_high_desert | Jun | clear | calm_surface | 1 | 0 | 0 |
| lure | big_fish | A | southwest_high_desert | Jun | stained | calm_surface | 1 | 0 | 0 |

### Remaining Same-Side Surface/Surface Examples

| Scenario | Side | Selected surface pair | Close non-surface alternatives | Why left |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-06-20 clear big_fish B | lure | Walking Topwater (172); Wake Bait (180) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Lake Okeechobee / central FL bass lake<br>2025-06-20 stained big_fish A | lure | Buzzbait (168); Walking Topwater (172) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Lake Okeechobee / central FL bass lake<br>2025-06-20 dirty big_fish B | lure | Wake Bait (172); Walking Topwater (164) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Sam Rayburn Reservoir<br>2025-04-12 stained big_fish A | lure | Hollow-Body Frog (162); Walking Topwater (172) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Sam Rayburn Reservoir<br>2025-04-12 dirty big_fish B | lure | Buzzbait (152); Hollow-Body Frog (162) | close: Squarebill Crankbait (upper, 146)<br>credible: none | Close alternatives lacked clear goal or daily-condition fit. |
| Lake Fork<br>2025-04-30 clear big_fish B | lure | Buzzbait (176); Walking Topwater (172) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |
| Santee Cooper<br>2025-05-18 clear big_fish B | lure | Walking Topwater (172); Wake Bait (180) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Santee Cooper<br>2025-09-27 stained big_fish B | lure | Wake Bait (180); Walking Topwater (178) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |
| Santee Cooper<br>2025-09-27 dirty big_fish B | lure | Walking Topwater (170); Buzzbait (174) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |
| Jordan Lake / Piedmont reservoir<br>2025-05-08 clear big_fish B | lure | Walking Topwater (172); Wake Bait (180) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |
| Jordan Lake / Piedmont reservoir<br>2025-08-11 clear big_fish B | lure | Wake Bait (180); Walking Topwater (178) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |
| Jordan Lake / Piedmont reservoir<br>2025-08-11 stained big_fish A | lure | Walking Topwater (178); Wake Bait (180) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Jordan Lake / Piedmont reservoir<br>2025-08-11 stained big_fish B | lure | Buzzbait (174); Hollow-Body Frog (162) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Jordan Lake / Piedmont reservoir<br>2025-08-11 dirty big_fish A | lure | Walking Topwater (170); Wake Bait (172) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Jordan Lake / Piedmont reservoir<br>2025-08-11 dirty big_fish B | lure | Buzzbait (174); Hollow-Body Frog (162) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Lake of the Ozarks<br>2025-06-18 clear big_fish B | lure | Wake Bait (180); Buzzbait (176) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Lake of the Ozarks<br>2025-09-13 dirty big_fish B | lure | Wake Bait (172); Walking Topwater (170) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |
| Lake Champlain<br>2025-06-21 clear big_fish A | lure | Walking Topwater (172); Wake Bait (180) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Lake Champlain<br>2025-06-21 stained big_fish A | lure | Walking Topwater (172); Wake Bait (180) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Appalachian river LMB context<br>2025-06-17 clear big_fish A | lure | Buzzbait (160); Walking Topwater (172) | close: none<br>credible: none | No close non-surface alternative in the audit band. |

### Same-Side Column/Band Summary

| Side | Same exact column | Same broad band | Same broad band with close different-band alt |
| --- | --- | --- | --- |
| lure | 298 | 298 | 248 |
| fly | 290 | 290 | 281 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 372 | - |
| open-surface rows with 2+ surface picks | 150 | 150 |
| open-surface rows with 3+ surface picks | 20 | 20 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 101 | 101 |
| lure surface/surface plus fly surface/upper | 2 | 2 |

### Surface/Upper Watch Examples

| Scenario | Daily | Selected bands | Close lower-column alternatives |
| --- | --- | --- | --- |
| Jordan Lake / Piedmont reservoir<br>2025-08-11 clear big_fish B | calm_surface+low_light_surface+clear_subtle; neutral | Wake Bait (surface, 180); Walking Topwater (surface, 178); Deer Hair Slider (surface, 166); Unweighted Baitfish Streamer (upper, 152) | lure: Suspending Jerkbait (mid, 156)<br>fly: Bluegill Streamer (mid, 162); Game Changer (mid, 160); Articulated Baitfish Streamer (mid, 152) |
| Southwest high-desert reservoir<br>2025-06-25 clear big_fish A | calm_surface+clear_subtle; neutral | Walking Topwater (surface, 172); Wake Bait (surface, 180); Deer Hair Slider (surface, 160); Unweighted Baitfish Streamer (upper, 162) | lure: none<br>fly: Bluegill Streamer (mid, 152); Game Changer (mid, 144) |

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
| exact_id | truly_avoidable | 5 | 0 | 5 |
| exact_id | unavoidable_due_score_band | 2 | 0 | 2 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 1 | 0 | 1 |
| same_family_same_presentation | truly_avoidable | 68 | 13 | 81 |
| same_family_same_presentation | unavoidable_due_score_band | 10 | 7 | 17 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 2 | 2 |
| same_family_same_presentation | unavoidable_due_goal_condition_fit | 0 | 5 | 5 |
| same_family_different_presentation | truly_avoidable | 0 | 30 | 30 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 18 | 18 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 7 | 7 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| WV/VA highland reservoir<br>2025-11-08 clear big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (160); Football Jig (134) | Paddle-Tail Swimbait (156); Compact Flipping Jig (126) | Medium-Diving Crankbait (162, alt edge 36) |
| Lake Okeechobee / central FL bass lake<br>2025-12-12 clear big_fish | lure honorable: same_family_same_presentation | Soft Plastic Jerkbait (146); Football Jig (134) | Flat-Sided Crankbait (146); Compact Flipping Jig (126) | Suspending Jerkbait (156, alt edge 30) |
| Lake Champlain<br>2025-10-12 clear big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (160); Football Jig (134) | Medium-Diving Crankbait (162); Compact Flipping Jig (126) | Paddle-Tail Swimbait (156, alt edge 30) |
| Lake of the Ozarks<br>2025-04-24 clear big_fish | lure honorable: same_family_same_presentation | Football Jig (140); Magnum Jerkbait (160) | Drop-Shot Minnow (158); Compact Flipping Jig (132) | Weightless Stick Worm (160, alt edge 28) |
| Southwest high-desert reservoir<br>2025-04-17 clear big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (160); Football Jig (140) | Flat-Sided Crankbait (150); Compact Flipping Jig (132) | Weightless Stick Worm (160, alt edge 28) |
| Lake Champlain<br>2025-10-12 dirty big_fish | lure top: same_family_same_presentation | Magnum Jerkbait (152); Compact Flipping Jig (134) | Football Jig (134); Paddle-Tail Swimbait (156) | Medium-Diving Crankbait (162, alt edge 28) |
| Guntersville / Tennessee River reservoir<br>2025-04-11 clear big_fish | fly honorable: same_family_same_presentation | Articulated Dungeon Streamer (156); Game Changer (144) | Unweighted Baitfish Streamer (162); Articulated Baitfish Streamer (136) | Baitfish Slider Fly (162, alt edge 26) |
| Guntersville / Tennessee River reservoir<br>2025-10-20 clear big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (176); Football Jig (134) | Tube Jig (148); Compact Flipping Jig (126) | Drop-Shot Minnow (152, alt edge 26) |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear big_fish | lure honorable: same_family_same_presentation | Squarebill Crankbait (142); Football Jig (156) | Tube Jig (148); Compact Flipping Jig (132) | Suspending Jerkbait (156, alt edge 24) |
| Colorado mountain-west reservoir<br>2025-04-23 dirty big_fish | lure top: same_family_same_presentation | Magnum Jerkbait (146); Compact Flipping Jig (140) | Football Jig (140); Paddle-Tail Swimbait (150) | Medium-Diving Crankbait (162, alt edge 22) |
| Colorado mountain-west reservoir<br>2025-04-23 stained big_fish | lure top: same_family_same_presentation | Magnum Jerkbait (154); Compact Flipping Jig (140) | Football Jig (140); Paddle-Tail Swimbait (150) | Medium-Diving Crankbait (162, alt edge 22) |
| Southwest high-desert reservoir<br>2025-10-14 dirty big_fish | lure top: same_family_same_presentation | Magnum Jerkbait (152); Compact Flipping Jig (134) | Football Jig (134); Medium-Diving Crankbait (162) | Paddle-Tail Swimbait (156, alt edge 22) |
| Southwest high-desert reservoir<br>2025-10-14 stained big_fish | lure top: same_family_same_presentation | Magnum Jerkbait (160); Compact Flipping Jig (134) | Football Jig (134); Medium-Diving Crankbait (162) | Paddle-Tail Swimbait (156, alt edge 22) |
| Lake Champlain<br>2025-10-12 stained big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (160); Compact Flipping Jig (134) | Medium-Diving Crankbait (162); Football Jig (134) | Paddle-Tail Swimbait (156, alt edge 22) |
| WV/VA highland reservoir<br>2025-11-08 dirty big_fish | lure top: same_family_same_presentation | Magnum Jerkbait (152); Compact Flipping Jig (134) | Football Jig (134); Medium-Diving Crankbait (162) | Paddle-Tail Swimbait (156, alt edge 22) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Lake of the Ozarks<br>2025-11-11 dirty | B | 3/4 | Medium-Diving Crankbait; Lipless Crankbait; Articulated Baitfish Streamer; Game Changer | Lipless Crankbait; Medium-Diving Crankbait; Deceiver; Articulated Baitfish Streamer |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| Guntersville / Tennessee River reservoir<br>2025-10-19 stained B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Guntersville / Tennessee River reservoir<br>2025-10-19 dirty B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| Lake of the Ozarks<br>2025-11-11 clear B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Lake of the Ozarks<br>2025-11-11 stained B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Lake of the Ozarks<br>2025-11-11 dirty B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| Illinois / Indiana natural-lake example<br>2025-10-18 clear B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Illinois / Indiana natural-lake example<br>2025-10-18 stained B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| Illinois / Indiana natural-lake example<br>2025-10-18 dirty B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Lake Champlain<br>2025-08-14 clear B | lure | Paddle-Tail Swimbait; Lipless Crankbait |
| Appalachian river LMB context<br>2025-04-04 stained B | lure | Medium-Diving Crankbait; Spinnerbait |
| Appalachian river LMB context<br>2025-04-04 dirty B | lure | Medium-Diving Crankbait; Spinnerbait |
| Appalachian river LMB context<br>2025-05-06 clear B | lure | Flat-Sided Crankbait; Tube Jig |
| Appalachian river LMB context<br>2025-05-06 stained B | lure | Tube Jig; Flat-Sided Crankbait |
| Appalachian river LMB context<br>2025-05-06 dirty B | lure | Ned Rig; Flat-Sided Crankbait |
| Colorado mountain-west reservoir<br>2025-08-12 clear B | lure | Soft Plastic Jerkbait; Suspending Jerkbait |
| Colorado mountain-west reservoir<br>2025-10-05 stained B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Colorado mountain-west reservoir<br>2025-10-05 dirty B | lure | Lipless Crankbait; Medium-Diving Crankbait |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Medium-Diving Crankbait [lure] | 12 | Magnum Jerkbait (10), Compact Flipping Jig (2) | -5.3 |
| Lipless Crankbait [lure] | 10 | Magnum Jerkbait (10) | 2.4 |
| Flat-Sided Crankbait [lure] | 3 | Magnum Jerkbait (3) | 10 |
| Spinnerbait [lure] | 2 | Compact Flipping Jig (2) | 6 |
| Tube Jig [lure] | 2 | Magnum Jerkbait (2) | 12 |
| Ned Rig [lure] | 1 | Magnum Jerkbait (1) | 16 |

## Pike Big Fish Upside Split Diagnostics

Not applicable.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 clear big_fish A | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (fly) | Bluegill Streamer (162; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (152; goal:big_fish:big_fish_upside:+20) | Unweighted Baitfish Streamer (152, alt edge -10) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 8) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (146; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (146; goal:all_purpose:versatile_search:+12); Clouser Minnow (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Deceiver (162, alt edge -2) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 stained big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Compact Flipping Jig (156; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20); Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 6) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (lure) | Compact Flipping Jig (136; condition_tag:dirty_vibration:+16); Bladed Jig (150; condition_tag:dirty_vibration:+16) | Suspending Jerkbait (172, alt edge 22) | other condition fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Bladed Jig (150; condition_tag:dirty_vibration:+16); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 12) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (154; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-05-10 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Unweighted Baitfish Streamer (158; goal:all_purpose:versatile_search:+12); Clouser Minnow (154; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (174, alt edge 16) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-05-10 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (144; goal:big_fish:big_fish_upside:+20); Bluegill Streamer (152; goal:big_fish:big_fish_upside:+20) | Baitfish Slider Fly (162, alt edge 10) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-05-10 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (lure) | Bladed Jig (140; condition_tag:dirty_vibration:+16); Flat-Sided Crankbait (152; goal:all_purpose:reliable_action:+18) | Squarebill Crankbait (174, alt edge 22) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-05-10 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Unweighted Baitfish Streamer (158; goal:all_purpose:versatile_search:+12); Clouser Minnow (154; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (174, alt edge 16) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-05-10 stained big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (144; goal:big_fish:big_fish_upside:+20); Compact Flipping Jig (156; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20) | Squarebill Crankbait (162, alt edge 6) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-05-10 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (164; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Baitfish Slider Fly (162, alt edge -2) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-05-10 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Bluegill Streamer (152; goal:big_fish:big_fish_upside:+20); Game Changer (144; goal:big_fish:big_fish_upside:+20) | Baitfish Slider Fly (162, alt edge 10) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-05-10 dirty all_purpose B | DIRTY_WIND_NOT_ELEVATING_VIBRATION (fly) | Clouser Minnow (146; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Unweighted Baitfish Streamer (150; goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (174, alt edge 24) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-05-10 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (146; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Unweighted Baitfish Streamer (150; goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (174, alt edge 24) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-05-10 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (164; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Baitfish Slider Fly (162, alt edge -2) | goal fit likely competed |
| Lake Fork<br>2025-03-29 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Game Changer (146; goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (168, alt edge 4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20); Compact Flipping Jig (132; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (178, alt edge 24) | goal fit likely competed |
| Lake Fork<br>2025-03-29 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (146; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (126; goal:big_fish:big_fish_upside:+20) | Baitfish Slider Fly (156, alt edge 10) | goal fit likely competed |
| Lake Fork<br>2025-03-29 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (154; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Baitfish Slider Fly (156, alt edge 2) | goal fit likely competed |
| Lake Fork<br>2025-03-29 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Articulated Baitfish Streamer (146; goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (168, alt edge 4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 stained big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20); Compact Flipping Jig (156; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (178, alt edge 22) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| dirty_vibration_acceptable | 60 |
| clear_subtle_wind_watch | 44 |
| current_open_water_acceptable | 13 |
| other_wind_watch | 9 |
| surface_low_light_acceptable | 3 |
| true_dirty_stained_wind_miss | 1 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Sam Rayburn Reservoir<br>2025-03-28 big_fish clear A | cold_slow_or_front<br>active | Magnum Jerkbait 154<br>Football Jig 140 |
| clear_subtle_wind_watch | Sam Rayburn Reservoir<br>2025-05-10 all_purpose clear B | stable_pleasant_medium_confidence_archive<br>neutral | Soft Plastic Jerkbait 164<br>Suspending Jerkbait 170 |
| clear_subtle_wind_watch | Sam Rayburn Reservoir<br>2025-05-10 big_fish clear A | stable_pleasant_medium_confidence_archive<br>neutral | Medium-Diving Crankbait 140<br>Magnum Jerkbait 144 |
| clear_subtle_wind_watch | Lake Fork<br>2025-03-29 all_purpose clear A | warming_search<br>neutral | Suspending Jerkbait 180<br>Drop-Shot Minnow 154 |
| clear_subtle_wind_watch | Lake Fork<br>2025-03-29 big_fish clear A | warming_search<br>neutral | Magnum Jerkbait 154<br>Compact Flipping Jig 132 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-03-28 all_purpose stained A | breezy_windy_stained_reaction<br>active | Bladed Jig 150<br>Lipless Crankbait 150 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-03-28 big_fish stained A | breezy_windy_stained_reaction<br>active | Compact Flipping Jig 156<br>Magnum Jerkbait 154 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-03-28 all_purpose dirty A | dirty_vibration<br>active | Compact Flipping Jig 136<br>Bladed Jig 150 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-03-28 big_fish dirty B | dirty_vibration<br>active | Bladed Jig 150<br>Football Jig 140 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-05-10 all_purpose stained A | breezy_windy_stained_reaction<br>neutral | Bladed Jig 140<br>Flat-Sided Crankbait 152 |
| other_wind_watch | Sam Rayburn Reservoir<br>2025-03-28 big_fish stained B | breezy_windy_stained_reaction<br>active | Medium-Diving Crankbait 162<br>Football Jig 140 |
| other_wind_watch | Lake Fork<br>2025-03-29 all_purpose stained A | breezy_windy_stained_reaction<br>neutral | Paddle-Tail Swimbait 162<br>Suspending Jerkbait 180 |
| other_wind_watch | Lake Fork<br>2025-03-29 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 178<br>Football Jig 140 |
| other_wind_watch | Santee Cooper<br>2025-05-18 all_purpose stained A | breezy_windy_stained_reaction<br>active | Suspending Jerkbait 170<br>Medium-Diving Crankbait 140 |
| other_wind_watch | Jordan Lake / Piedmont reservoir<br>2025-03-22 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Suspending Jerkbait 180<br>Drop-Shot Minnow 154 |
| surface_low_light_acceptable | Lake Fork<br>2025-04-30 all_purpose stained B | breezy_windy_stained_reaction<br>active | Suspending Jerkbait 170<br>Soft Plastic Jerkbait 164 |
| surface_low_light_acceptable | Santee Cooper<br>2025-04-05 all_purpose stained A | breezy_windy_stained_reaction<br>active | Suspending Jerkbait 170<br>Lipless Crankbait 140 |
| surface_low_light_acceptable | Minnesota natural bass lake<br>2025-07-16 all_purpose dirty A | dirty_vibration<br>neutral | Lipless Crankbait 172<br>Medium-Diving Crankbait 172 |
| current_open_water_acceptable | Guntersville / Tennessee River reservoir<br>2025-10-19 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 178<br>Lipless Crankbait 172 |
| current_open_water_acceptable | Lake of the Ozarks<br>2025-11-11 all_purpose dirty B | dirty_vibration<br>neutral | Medium-Diving Crankbait 178<br>Lipless Crankbait 172 |
| current_open_water_acceptable | Minnesota natural bass lake<br>2025-03-20 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Football Jig 154<br>Magnum Jerkbait 162 |
| current_open_water_acceptable | Lake Champlain<br>2025-08-14 big_fish stained B | breezy_windy_stained_reaction<br>active | Magnum Worm 134<br>Medium-Diving Crankbait 172 |
| current_open_water_acceptable | Colorado mountain-west reservoir<br>2025-08-12 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Paddle-Tail Swimbait 162<br>Magnum Worm 134 |
| true_dirty_stained_wind_miss | Minnesota natural bass lake<br>2025-05-15 big_fish stained A | breezy_windy_stained_reaction<br>active | Football Jig 140<br>Magnum Jerkbait 144 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 579 |
| acceptable_fit | 1488 |
| strong_fit | 1485 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | A | fly | medium_confidence_archive | 148 |
| watch | big_fish | A | lure | medium_confidence_archive | 104 |
| watch | big_fish | B | fly | medium_confidence_archive | 83 |
| watch | big_fish | B | lure | medium_confidence_archive | 83 |
| watch | all_purpose | A | fly | medium_confidence_archive | 59 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 51 |
| watch | big_fish | A | fly | cold_slow_or_front | 49 |
| watch | all_purpose | A | lure | medium_confidence_archive | 41 |
| watch | big_fish | A | fly | dirty_vibration | 38 |
| watch | all_purpose | B | fly | medium_confidence_archive | 35 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 34 |
| watch | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 33 |
| watch | big_fish | A | lure | warming_search | 31 |
| watch | all_purpose | B | lure | medium_confidence_archive | 26 |
| watch | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 25 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 25 |
| watch | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 25 |
| watch | big_fish | A | lure | heat_limited_finesse | 24 |
| watch | big_fish | B | lure | cold_slow_or_front | 24 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 23 |
| watch | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 22 |
| watch | big_fish | A | fly | warming_search | 22 |
| watch | big_fish | A | lure | cold_slow_or_front | 22 |
| watch | big_fish | B | fly | cold_slow_or_front | 21 |
| watch | big_fish | B | fly | dirty_vibration | 21 |
| watch | big_fish | A | fly | heat_limited_finesse | 20 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 17 |
| watch | all_purpose | B | fly | cold_slow_or_front | 17 |
| watch | big_fish | B | lure | heat_limited_finesse | 17 |
| watch | all_purpose | A | fly | cold_slow_or_front | 15 |
| watch | big_fish | B | fly | warming_search | 15 |
| watch | big_fish | B | lure | dirty_vibration | 15 |
| watch | big_fish | B | lure | warming_search | 15 |
| watch | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 14 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 13 |
| watch | all_purpose | A | fly | dirty_vibration | 12 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 12 |
| watch | all_purpose | A | lure | dirty_vibration | 11 |
| watch | all_purpose | B | lure | breezy_windy_stained_reaction | 10 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 10 |
| watch | big_fish | A | lure | dirty_vibration | 10 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 9 |
| watch | big_fish | B | fly | calm_bright_clear_subtle | 9 |
| watch | big_fish | B | fly | heat_limited_finesse | 9 |
| watch | all_purpose | A | fly | warming_search | 8 |
| watch | all_purpose | A | lure | river_elevated_runoff_current | 8 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 8 |
| watch | big_fish | A | lure | calm_low_light_surface | 8 |
| watch | all_purpose | A | fly | heat_limited_finesse | 7 |
| watch | all_purpose | A | lure | warming_search | 7 |
| watch | all_purpose | B | fly | dirty_vibration | 7 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 7 |
| watch | all_purpose | B | lure | dirty_vibration | 7 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 6 |
| watch | big_fish | B | lure | calm_bright_clear_subtle | 6 |
| watch | big_fish | B | lure | calm_low_light_surface | 6 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 5 |
| watch | all_purpose | A | lure | cold_slow_or_front | 5 |
| watch | all_purpose | A | lure | heat_limited_finesse | 5 |
| watch | all_purpose | B | fly | warming_search | 5 |
| watch | big_fish | A | fly | calm_low_light_surface | 5 |
| watch | big_fish | B | fly | calm_low_light_surface | 5 |
| watch | all_purpose | A | lure | breezy_windy_stained_reaction | 4 |
| watch | all_purpose | B | fly | heat_limited_finesse | 4 |
| watch | big_fish | A | lure | calm_bright_clear_subtle | 4 |
| watch | all_purpose | A | fly | calm_low_light_surface | 3 |
| watch | all_purpose | A | lure | calm_low_light_surface | 3 |
| watch | all_purpose | B | fly | river_elevated_runoff_current | 3 |
| watch | all_purpose | B | lure | cold_slow_or_front | 3 |
| watch | all_purpose | B | lure | heat_limited_finesse | 3 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 3 |
| watch | all_purpose | B | lure | warming_search | 3 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 3 |
| watch | all_purpose | A | fly | river_elevated_runoff_current | 2 |
| watch | all_purpose | B | fly | calm_low_light_surface | 2 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 1 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 263 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 241 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 199 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 196 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 9 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 9 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| Northern California bass lake<br>2025-10-25 stained all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 dirty all_purpose A | Suspending Jerkbait (honorable_lure, lure, score 194) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 dirty big_fish A | Buzzbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>calm_surface+low_light_surface+dirty_vibration+warming_search+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 stained all_purpose B | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 stained all_purpose B | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+dirty_vibration+warming_search+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 dirty all_purpose B | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 clear all_purpose A | Suspending Jerkbait (honorable_lure, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 dirty big_fish B | Buzzbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained big_fish A | Buzzbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Jordan Lake / Piedmont reservoir<br>2025-05-08 clear all_purpose A | Soft Plastic Jerkbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 clear all_purpose B | Clouser Minnow (honorable_fly, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Illinois / Indiana natural-lake example<br>2025-10-18 stained all_purpose A | Soft Plastic Jerkbait (lure_of_the_day, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+heat_finesse+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Illinois / Indiana natural-lake example<br>2025-10-18 stained all_purpose A | Clouser Minnow (honorable_fly, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+heat_finesse+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained all_purpose B | Suspending Jerkbait (lure_of_the_day, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained all_purpose B | Clouser Minnow (honorable_fly, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 clear all_purpose A | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+warming_search+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 clear all_purpose B | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Illinois / Indiana natural-lake example<br>2025-10-18 dirty all_purpose B | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+heat_finesse+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Illinois / Indiana natural-lake example<br>2025-10-18 stained all_purpose B | Deceiver (honorable_fly, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+heat_finesse+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained all_purpose A | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 1296 | 499 | 39% |
| clear_subtle | 560 | 265 | 47% |
| dirty_vibration | 960 | 172 | 18% |
| heat_finesse | 480 | 92 | 19% |
| cold_slow | 432 | 238 | 55% |
| low_light_surface | 720 | 227 | 32% |
| calm_surface | 1056 | 327 | 31% |
| Big Fish upside | 1776 | 1426 | 80% |
| All Purpose reliable/versatile | 1776 | 1652 | 93% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Game Changer [fly] (255), Articulated Baitfish Streamer [fly] (206), Clouser Minnow [fly] (177), Baitfish Slider Fly [fly] (169), Compact Flipping Jig [lure] (163), Suspending Jerkbait [lure] (154), Deceiver [fly] (142), Soft Plastic Jerkbait [lure] (138), Medium-Diving Crankbait [lure] (125), Rabbit-Strip Leech [fly] (124), Magnum Jerkbait [lure] (119), Articulated Dungeon Streamer [fly] (115) |
| All-purpose | Clouser Minnow [fly] (175), Suspending Jerkbait [lure] (142), Baitfish Slider Fly [fly] (133), Soft Plastic Jerkbait [lure] (131), Deceiver [fly] (110), Paddle-Tail Swimbait [lure] (82), Popper Fly [fly] (72), Unweighted Baitfish Streamer [fly] (71) |
| Big-fish | Game Changer [fly] (187), Compact Flipping Jig [lure] (160), Articulated Baitfish Streamer [fly] (157), Magnum Jerkbait [lure] (119), Articulated Dungeon Streamer [fly] (115), Rabbit-Strip Leech [fly] (111), Walking Topwater [lure] (83), Bluegill Streamer [fly] (81) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 29 | 29 | 0 | 0 | 0 |
| fly | 19 | 19 | 0 | 0 | 1 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 255/888 | 28.7% | big_fish:187, all_purpose:68 | A:146, B:109 | honorable:131, top:124 | dirty:93, stained:84, clear:78 | freshwater_lake_pond:243, freshwater_river:12 | wind_reaction:92, dirty_vibration:69, warming_search:58, calm_surface:57 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 206/888 | 23.2% | big_fish:157, all_purpose:49 | A:120, B:86 | honorable:113, top:93 | dirty:89, stained:75, clear:42 | freshwater_lake_pond:194, freshwater_river:12 | wind_reaction:75, dirty_vibration:63, warming_search:48, open_water_search:47 |
| Clouser Minnow<br>clouser_minnow | fly | 177/888 | 19.9% | all_purpose:175, big_fish:2 | B:105, A:72 | top:93, honorable:84 | stained:67, clear:61, dirty:49 | freshwater_lake_pond:166, freshwater_river:11 | wind_reaction:62, calm_surface:49, dirty_vibration:45, warming_search:44 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 169/840 | 20.1% | all_purpose:133, big_fish:36 | B:103, A:66 | top:95, honorable:74 | dirty:64, stained:53, clear:52 | freshwater_lake_pond:165, freshwater_river:4 | wind_reaction:96, dirty_vibration:67, low_light_surface:45, calm_surface:44 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 163/888 | 18.4% | big_fish:160, all_purpose:3 | A:95, B:68 | honorable:128, top:35 | dirty:66, stained:60, clear:37 | freshwater_lake_pond:151, freshwater_river:12 | wind_reaction:70, dirty_vibration:63, warming_search:29, open_water_search:26 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 154/888 | 17.3% | all_purpose:142, big_fish:12 | B:79, A:75 | top:92, honorable:62 | clear:62, stained:53, dirty:39 | freshwater_lake_pond:151, freshwater_river:3 | wind_reaction:73, dirty_vibration:43, calm_surface:38, warming_search:38 |
| Deceiver<br>deceiver | fly | 142/888 | 16% | all_purpose:110, big_fish:32 | B:77, A:65 | top:78, honorable:64 | dirty:55, stained:47, clear:40 | freshwater_lake_pond:141, freshwater_river:1 | wind_reaction:103, dirty_vibration:71, open_water_search:50, warming_search:26 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 138/840 | 16.4% | all_purpose:131, big_fish:7 | A:79, B:59 | top:70, honorable:68 | clear:60, stained:49, dirty:29 | freshwater_lake_pond:131, freshwater_river:7 | calm_surface:52, wind_reaction:39, clear_subtle:37, low_light_surface:32 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 125/888 | 14.1% | big_fish:66, all_purpose:59 | B:80, A:45 | top:76, honorable:49 | dirty:45, stained:43, clear:37 | freshwater_lake_pond:121, freshwater_river:4 | wind_reaction:96, dirty_vibration:72, open_water_search:45, warming_search:45 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 124/888 | 14% | big_fish:111, all_purpose:13 | A:66, B:58 | honorable:101, top:23 | stained:49, dirty:46, clear:29 | freshwater_lake_pond:112, freshwater_river:12 | wind_reaction:36, dirty_vibration:35, cold_slow:34, warming_search:25 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 119/552 | 21.6% | big_fish:119 | A:104, B:15 | honorable:61, top:58 | clear:43, stained:41, dirty:35 | freshwater_lake_pond:112, freshwater_river:7 | wind_reaction:47, calm_surface:34, dirty_vibration:32, warming_search:26 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 115/504 | 22.8% | big_fish:115 | B:68, A:47 | top:71, honorable:44 | dirty:39, stained:39, clear:37 | freshwater_lake_pond:115 | wind_reaction:57, dirty_vibration:39, warming_search:23, cold_slow:22 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 107/888 | 12% | all_purpose:82, big_fish:25 | B:54, A:53 | honorable:61, top:46 | dirty:50, stained:36, clear:21 | freshwater_lake_pond:103, freshwater_river:4 | warming_search:54, calm_surface:47, low_light_surface:30, wind_reaction:20 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 88/840 | 10.5% | all_purpose:71, big_fish:17 | B:45, A:43 | honorable:57, top:31 | clear:53, dirty:18, stained:17 | freshwater_lake_pond:87, freshwater_river:1 | clear_subtle:46, calm_surface:35, wind_reaction:24, low_light_surface:22 |
| Walking Topwater<br>walking_topwater | lure | 84/528 | 15.9% | big_fish:83, all_purpose:1 | A:44, B:40 | top:63, honorable:21 | clear:31, stained:27, dirty:26 | freshwater_lake_pond:78, freshwater_river:6 | calm_surface:65, low_light_surface:35, warming_search:20, clear_subtle:18 |
| Bluegill Streamer<br>bluegill_streamer | fly | 82/408 | 20.1% | big_fish:81, all_purpose:1 | A:43, B:39 | top:53, honorable:29 | clear:31, stained:30, dirty:21 | freshwater_lake_pond:82 | calm_surface:40, clear_subtle:20, low_light_surface:17, warming_search:17 |
| Deer Hair Slider<br>deer_hair_slider | fly | 81/528 | 15.3% | big_fish:80, all_purpose:1 | A:45, B:36 | top:45, honorable:36 | clear:29, dirty:26, stained:26 | freshwater_lake_pond:75, freshwater_river:6 | calm_surface:54, low_light_surface:39, warming_search:22, wind_reaction:17 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 76/888 | 8.6% | all_purpose:55, big_fish:21 | B:46, A:30 | top:44, honorable:32 | clear:35, stained:26, dirty:15 | freshwater_lake_pond:72, freshwater_river:4 | heat_finesse:40, clear_subtle:28, calm_surface:24, warming_search:11 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 76/840 | 9% | all_purpose:48, big_fish:28 | B:50, A:26 | honorable:41, top:35 | dirty:36, stained:26, clear:14 | freshwater_lake_pond:68, freshwater_river:8 | wind_reaction:44, dirty_vibration:38, low_light_surface:33, calm_surface:14 |
| Swim Jig<br>swim_jig | lure | 74/888 | 8.3% | all_purpose:64, big_fish:10 | B:45, A:29 | honorable:44, top:30 | dirty:32, stained:31, clear:11 | freshwater_lake_pond:71, freshwater_river:3 | warming_search:41, calm_surface:39, low_light_surface:18, none:13 |
| Football Jig<br>football_jig | lure | 74/360 | 20.6% | big_fish:74 | A:37, B:37 | honorable:40, top:34 | clear:29, stained:23, dirty:22 | freshwater_lake_pond:74 | wind_reaction:40, dirty_vibration:23, warming_search:20, cold_slow:16 |
| Popper Fly<br>popper_fly | fly | 73/456 | 16% | all_purpose:72, big_fish:1 | B:37, A:36 | top:53, honorable:20 | clear:27, stained:24, dirty:22 | freshwater_lake_pond:69, freshwater_river:4 | calm_surface:56, low_light_surface:31, clear_subtle:17, warming_search:13 |
| Wake Bait<br>wake_bait | lure | 69/372 | 18.5% | big_fish:66, all_purpose:3 | A:36, B:33 | top:53, honorable:16 | stained:26, clear:23, dirty:20 | freshwater_lake_pond:69 | calm_surface:53, low_light_surface:25, warming_search:15, clear_subtle:14 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 62/840 | 7.4% | all_purpose:61, big_fish:1 | B:40, A:22 | honorable:33, top:29 | clear:36, stained:20, dirty:6 | freshwater_lake_pond:62 | calm_surface:26, clear_subtle:26, cold_slow:14, heat_finesse:12 |
| Woolly Bugger<br>woolly_bugger | fly | 60/888 | 6.8% | all_purpose:57, big_fish:3 | B:34, A:26 | honorable:43, top:17 | stained:22, clear:20, dirty:18 | freshwater_lake_pond:52, freshwater_river:8 | cold_slow:24, wind_reaction:17, dirty_vibration:13, heat_finesse:12 |
| Magnum Worm<br>magnum_worm | lure | 55/336 | 16.4% | big_fish:54, all_purpose:1 | B:28, A:27 | honorable:35, top:20 | dirty:20, clear:18, stained:17 | freshwater_lake_pond:55 | heat_finesse:24, calm_surface:16, none:13, clear_subtle:12 |
| Buzzbait<br>buzzbait | lure | 54/528 | 10.2% | big_fish:49, all_purpose:5 | B:31, A:23 | top:35, honorable:19 | dirty:23, stained:21, clear:10 | freshwater_lake_pond:44, freshwater_river:10 | low_light_surface:41, dirty_vibration:24, calm_surface:20, wind_reaction:20 |
| Tube Jig<br>tube_jig | lure | 49/888 | 5.5% | all_purpose:41, big_fish:8 | B:30, A:19 | top:26, honorable:23 | clear:29, stained:15, dirty:5 | freshwater_lake_pond:42, freshwater_river:7 | cold_slow:27, clear_subtle:17, wind_reaction:14, calm_surface:9 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 49/288 | 17% | all_purpose:46, big_fish:3 | A:29, B:20 | top:26, honorable:23 | clear:20, dirty:19, stained:10 | freshwater_lake_pond:46, freshwater_river:3 | calm_surface:21, wind_reaction:15, clear_subtle:13, low_light_surface:12 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 45/276 | 16.3% | all_purpose:45 | B:24, A:21 | top:35, honorable:10 | clear:15, dirty:15, stained:15 | freshwater_lake_pond:39, freshwater_river:6 | calm_surface:36, low_light_surface:15, warming_search:14, clear_subtle:8 |
| Lipless Crankbait<br>lipless_crankbait | lure | 41/888 | 4.6% | big_fish:26, all_purpose:15 | B:24, A:17 | honorable:22, top:19 | dirty:17, stained:15, clear:9 | freshwater_lake_pond:41 | wind_reaction:38, open_water_search:33, dirty_vibration:29, low_light_surface:7 |
| Spinnerbait<br>spinnerbait | lure | 40/888 | 4.5% | all_purpose:22, big_fish:18 | B:23, A:17 | honorable:24, top:16 | dirty:24, stained:11, clear:5 | freshwater_lake_pond:33, freshwater_river:7 | dirty_vibration:32, wind_reaction:29, open_water_search:11, low_light_surface:9 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 35/840 | 4.2% | all_purpose:19, big_fish:16 | B:22, A:13 | top:18, honorable:17 | clear:21, stained:9, dirty:5 | freshwater_lake_pond:32, freshwater_river:3 | clear_subtle:16, calm_surface:12, cold_slow:11, wind_reaction:8 |
| Mouse Fly<br>mouse_fly | fly | 34/312 | 10.9% | big_fish:34 | A:18, B:16 | top:23, honorable:11 | clear:15, dirty:10, stained:9 | freshwater_lake_pond:34 | calm_surface:29, low_light_surface:15, clear_subtle:9, warming_search:9 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 30/888 | 3.4% | all_purpose:30 | A:21, B:9 | honorable:17, top:13 | clear:25, dirty:3, stained:2 | freshwater_lake_pond:28, freshwater_river:2 | clear_subtle:22, calm_surface:11, cold_slow:9, heat_finesse:9 |
| Frog Fly<br>frog_fly | fly | 28/192 | 14.6% | big_fish:28 | A:15, B:13 | honorable:14, top:14 | clear:10, dirty:10, stained:8 | freshwater_lake_pond:28 | calm_surface:19, low_light_surface:16, wind_reaction:9, clear_subtle:6 |
| Feather Jig Leech<br>feather_jig_leech | fly | 27/888 | 3% | all_purpose:26, big_fish:1 | B:14, A:13 | honorable:21, top:6 | clear:12, stained:8, dirty:7 | freshwater_lake_pond:20, freshwater_river:7 | warming_search:22, calm_surface:7, current_swing:7, dirty_vibration:6 |
| Ned Rig<br>ned_rig | lure | 23/396 | 5.8% | all_purpose:20, big_fish:3 | B:14, A:9 | honorable:14, top:9 | dirty:11, clear:10, stained:2 | freshwater_lake_pond:18, freshwater_river:5 | cold_slow:11, heat_finesse:7, wind_reaction:6, clear_subtle:4 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 22/204 | 10.8% | all_purpose:19, big_fish:3 | A:13, B:9 | top:14, honorable:8 | clear:9, stained:8, dirty:5 | freshwater_lake_pond:14, freshwater_river:8 | cold_slow:11, wind_reaction:11, dirty_vibration:8, clear_subtle:4 |
| Blade Bait<br>blade_bait | lure | 21/888 | 2.4% | all_purpose:20, big_fish:1 | A:14, B:7 | top:11, honorable:10 | dirty:12, clear:5, stained:4 | freshwater_lake_pond:20, freshwater_river:1 | open_water_search:9, wind_reaction:9, cold_slow:6, dirty_vibration:5 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 20/840 | 2.4% | all_purpose:14, big_fish:6 | A:12, B:8 | honorable:14, top:6 | dirty:13, stained:4, clear:3 | freshwater_lake_pond:20 | cold_slow:7, none:5, warming_search:4, wind_reaction:4 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 19/192 | 9.9% | big_fish:19 | B:10, A:9 | top:15, honorable:4 | clear:7, dirty:6, stained:6 | freshwater_lake_pond:19 | calm_surface:15, low_light_surface:10, warming_search:6, clear_subtle:4 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 18/888 | 2% | all_purpose:18 | A:12, B:6 | honorable:11, top:7 | stained:9, clear:7, dirty:2 | freshwater_lake_pond:16, freshwater_river:2 | cold_slow:14, wind_reaction:5, heat_finesse:3, dirty_vibration:2 |
| Bladed Jig<br>bladed_jig | lure | 16/888 | 1.8% | all_purpose:13, big_fish:3 | A:10, B:6 | top:9, honorable:7 | dirty:10, stained:6 | freshwater_lake_pond:16 | dirty_vibration:15, wind_reaction:15, open_water_search:5, low_light_surface:3 |
| Finesse Jig<br>finesse_jig | lure | 14/396 | 3.5% | all_purpose:14 | B:9, A:5 | honorable:9, top:5 | clear:8, stained:5, dirty:1 | freshwater_lake_pond:12, freshwater_river:2 | cold_slow:7, heat_finesse:6, clear_subtle:5, wind_reaction:3 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9/396 | 2.3% | all_purpose:9 | B:7, A:2 | honorable:6, top:3 | clear:4, stained:3, dirty:2 | freshwater_lake_pond:9 | cold_slow:5, clear_subtle:4, heat_finesse:4, wind_reaction:2 |
| Glide Bait<br>glidebait | lure | 9/36 | 25% | big_fish:9 | A:6, B:3 | top:5, honorable:4 | clear:3, dirty:3, stained:3 | freshwater_lake_pond:9 | cold_slow:6, calm_surface:3, none:3, clear_subtle:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/48 | 2.1% | big_fish:1 | A:1 | honorable:1 | clear:1 | freshwater_lake_pond:1 | clear_subtle:1, cold_slow:1 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 255/3552 (7.2%) | 124/1776 (7%) | 131/1776 (7.4%) | - | 255/1776 (14.4%) |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 206/3552 (5.8%) | 93/1776 (5.2%) | 113/1776 (6.4%) | - | 206/1776 (11.6%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 177/3552 (5%) | 93/1776 (5.2%) | 84/1776 (4.7%) | - | 177/1776 (10%) |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 169/3552 (4.8%) | 95/1776 (5.3%) | 74/1776 (4.2%) | - | 169/1776 (9.5%) |  |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 163/3552 (4.6%) | 35/1776 (2%) | 128/1776 (7.2%) | 163/1776 (9.2%) | - |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 154/3552 (4.3%) | 92/1776 (5.2%) | 62/1776 (3.5%) | 154/1776 (8.7%) | - |  |
| Deceiver<br>deceiver | fly | 142/3552 (4%) | 78/1776 (4.4%) | 64/1776 (3.6%) | - | 142/1776 (8%) |  |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 138/3552 (3.9%) | 70/1776 (3.9%) | 68/1776 (3.8%) | 138/1776 (7.8%) | - |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 125/3552 (3.5%) | 76/1776 (4.3%) | 49/1776 (2.8%) | 125/1776 (7%) | - |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 124/3552 (3.5%) | 23/1776 (1.3%) | 101/1776 (5.7%) | - | 124/1776 (7%) |  |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 119/3552 (3.4%) | 58/1776 (3.3%) | 61/1776 (3.4%) | 119/1776 (6.7%) | - |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 115/3552 (3.2%) | 71/1776 (4%) | 44/1776 (2.5%) | - | 115/1776 (6.5%) |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 107/3552 (3%) | 46/1776 (2.6%) | 61/1776 (3.4%) | 107/1776 (6%) | - |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 88/3552 (2.5%) | 31/1776 (1.7%) | 57/1776 (3.2%) | - | 88/1776 (5%) |  |
| Walking Topwater<br>walking_topwater | lure | 84/3552 (2.4%) | 63/1776 (3.5%) | 21/1776 (1.2%) | 84/1776 (4.7%) | - |  |
| Bluegill Streamer<br>bluegill_streamer | fly | 82/3552 (2.3%) | 53/1776 (3%) | 29/1776 (1.6%) | - | 82/1776 (4.6%) |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 81/3552 (2.3%) | 45/1776 (2.5%) | 36/1776 (2%) | - | 81/1776 (4.6%) |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 76/3552 (2.1%) | 44/1776 (2.5%) | 32/1776 (1.8%) | 76/1776 (4.3%) | - |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 76/3552 (2.1%) | 35/1776 (2%) | 41/1776 (2.3%) | 76/1776 (4.3%) | - |  |
| Football Jig<br>football_jig | lure | 74/3552 (2.1%) | 34/1776 (1.9%) | 40/1776 (2.3%) | 74/1776 (4.2%) | - |  |
| Swim Jig<br>swim_jig | lure | 74/3552 (2.1%) | 30/1776 (1.7%) | 44/1776 (2.5%) | 74/1776 (4.2%) | - |  |
| Popper Fly<br>popper_fly | fly | 73/3552 (2.1%) | 53/1776 (3%) | 20/1776 (1.1%) | - | 73/1776 (4.1%) |  |
| Wake Bait<br>wake_bait | lure | 69/3552 (1.9%) | 53/1776 (3%) | 16/1776 (0.9%) | 69/1776 (3.9%) | - |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 62/3552 (1.7%) | 29/1776 (1.6%) | 33/1776 (1.9%) | 62/1776 (3.5%) | - |  |
| Woolly Bugger<br>woolly_bugger | fly | 60/3552 (1.7%) | 17/1776 (1%) | 43/1776 (2.4%) | - | 60/1776 (3.4%) |  |
| Magnum Worm<br>magnum_worm | lure | 55/3552 (1.5%) | 20/1776 (1.1%) | 35/1776 (2%) | 55/1776 (3.1%) | - |  |
| Buzzbait<br>buzzbait | lure | 54/3552 (1.5%) | 35/1776 (2%) | 19/1776 (1.1%) | 54/1776 (3%) | - |  |
| Tube Jig<br>tube_jig | lure | 49/3552 (1.4%) | 26/1776 (1.5%) | 23/1776 (1.3%) | 49/1776 (2.8%) | - |  |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 49/3552 (1.4%) | 26/1776 (1.5%) | 23/1776 (1.3%) | 49/1776 (2.8%) | - |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 45/3552 (1.3%) | 35/1776 (2%) | 10/1776 (0.6%) | - | 45/1776 (2.5%) |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 41/3552 (1.2%) | 19/1776 (1.1%) | 22/1776 (1.2%) | 41/1776 (2.3%) | - |  |
| Spinnerbait<br>spinnerbait | lure | 40/3552 (1.1%) | 16/1776 (0.9%) | 24/1776 (1.4%) | 40/1776 (2.3%) | - |  |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 35/3552 (1%) | 18/1776 (1%) | 17/1776 (1%) | 35/1776 (2%) | - |  |
| Mouse Fly<br>mouse_fly | fly | 34/3552 (1%) | 23/1776 (1.3%) | 11/1776 (0.6%) | - | 34/1776 (1.9%) |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 30/3552 (0.8%) | 13/1776 (0.7%) | 17/1776 (1%) | - | 30/1776 (1.7%) |  |
| Frog Fly<br>frog_fly | fly | 28/3552 (0.8%) | 14/1776 (0.8%) | 14/1776 (0.8%) | - | 28/1776 (1.6%) |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 27/3552 (0.8%) | 6/1776 (0.3%) | 21/1776 (1.2%) | - | 27/1776 (1.5%) |  |
| Ned Rig<br>ned_rig | lure | 23/3552 (0.6%) | 9/1776 (0.5%) | 14/1776 (0.8%) | 23/1776 (1.3%) | - |  |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 22/3552 (0.6%) | 14/1776 (0.8%) | 8/1776 (0.5%) | - | 22/1776 (1.2%) |  |
| Blade Bait<br>blade_bait | lure | 21/3552 (0.6%) | 11/1776 (0.6%) | 10/1776 (0.6%) | 21/1776 (1.2%) | - |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 20/3552 (0.6%) | 6/1776 (0.3%) | 14/1776 (0.8%) | 20/1776 (1.1%) | - |  |
| Hollow-Body Frog<br>hollow_body_frog | lure | 19/3552 (0.5%) | 15/1776 (0.8%) | 4/1776 (0.2%) | 19/1776 (1.1%) | - |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 18/3552 (0.5%) | 7/1776 (0.4%) | 11/1776 (0.6%) | - | 18/1776 (1%) |  |
| Bladed Jig<br>bladed_jig | lure | 16/3552 (0.5%) | 9/1776 (0.5%) | 7/1776 (0.4%) | 16/1776 (0.9%) | - |  |
| Finesse Jig<br>finesse_jig | lure | 14/3552 (0.4%) | 5/1776 (0.3%) | 9/1776 (0.5%) | 14/1776 (0.8%) | - |  |
| Glide Bait<br>glidebait | lure | 9/3552 (0.3%) | 5/1776 (0.3%) | 4/1776 (0.2%) | 9/1776 (0.5%) | - |  |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9/3552 (0.3%) | 3/1776 (0.2%) | 6/1776 (0.3%) | 9/1776 (0.5%) | - |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/3552 (0%) | 0/1776 (0%) | 1/1776 (0.1%) | 1/1776 (0.1%) | - |  |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 255/888 | 28.7% | big_fish:187, all_purpose:68 | wind_reaction:92, dirty_vibration:69, warming_search:58, calm_surface:57, open_water_search:48 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | home-window >30% severe | 51/168 | 30.4% | goal_tags:56 | AP/BF 16/84, 35/84<br>clarity clear:88, dirty:40, stained:40<br>bucket warming_search:92, calm_low_light_surface:28, stable_pleasant_medium_confidence_archive:20 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | home-window >25% overdominant | 48/168 | 28.6% | goal_tags:76 | AP/BF 30/84, 18/84<br>clarity clear:88, dirty:40, stained:40<br>bucket warming_search:92, calm_low_light_surface:28, stable_pleasant_medium_confidence_archive:20 |
| Football Jig<br>football_jig | lure | home-window >25% overdominant | 28/102 | 27.5% | goal_tags:47 | AP/BF 0/42, 28/60<br>clarity clear:68, stained:34<br>bucket cold_slow_or_front:56, calm_bright_clear_subtle:12, heat_limited_finesse:12 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | home-window >25% overdominant | 35/132 | 26.5% | goal_tags:38 | AP/BF 29/66, 6/66<br>clarity clear:132<br>bucket calm_bright_clear_subtle:40, stable_pleasant_medium_confidence_archive:32, heat_limited_finesse:24 |
| Wake Bait<br>wake_bait | lure | home-window >20% watch | 63/252 | 25% | goal_tags:117 | AP/BF 3/126, 60/126<br>clarity clear:84, dirty:84, stained:84<br>bucket stable_pleasant_medium_confidence_archive:72, calm_low_light_surface:60, warming_search:40 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | home-window >20% watch | 41/168 | 24.4% | goal_tags:65 | AP/BF 10/84, 31/84<br>clarity clear:88, dirty:40, stained:40<br>bucket warming_search:92, calm_low_light_surface:28, stable_pleasant_medium_confidence_archive:20 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | home-window >20% watch | 83/344 | 24.1% | goal_tags:178 | AP/BF 43/172, 40/172<br>clarity dirty:172, stained:172<br>bucket dirty_vibration:116, breezy_windy_stained_reaction:108, warming_search:52 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | home-window >20% watch | 38/160 | 23.8% | goal_tags:96 | AP/BF 32/80, 6/80<br>clarity clear:80, dirty:40, stained:40<br>bucket warming_search:88, calm_low_light_surface:28, cold_slow_or_front:16 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | home-window >20% watch | 28/118 | 23.7% | goal_tags:58 | AP/BF 0/50, 28/68<br>clarity clear:80, stained:38<br>bucket cold_slow_or_front:64, warming_search:14, calm_bright_clear_subtle:12 |
| Foam Gurgler<br>foam_gurgler_fly | fly | home-window >20% watch | 45/192 | 23.4% | goal_tags:92 | AP/BF 45/96, 0/96<br>clarity clear:64, dirty:64, stained:64<br>bucket stable_pleasant_medium_confidence_archive:76, warming_search:28, calm_low_light_surface:24 |
| Bluegill Streamer<br>bluegill_streamer | fly | home-window >20% watch | 20/88 | 22.7% | goal_tags:44 | AP/BF 1/44, 19/44<br>clarity clear:40, dirty:24, stained:24<br>bucket warming_search:40, calm_low_light_surface:24, calm_bright_clear_subtle:8 |
| Walking Topwater<br>walking_topwater | lure | home-window >20% watch | 66/300 | 22% | goal_tags:141 | AP/BF 1/150, 65/150<br>clarity clear:100, dirty:100, stained:100<br>bucket stable_pleasant_medium_confidence_archive:80, calm_low_light_surface:72, warming_search:52 |
| Popper Fly<br>popper_fly | fly | home-window >20% watch | 58/264 | 22% | goal_tags:125 | AP/BF 57/132, 1/132<br>clarity clear:88, dirty:88, stained:88<br>bucket stable_pleasant_medium_confidence_archive:80, calm_low_light_surface:60, warming_search:40 |
| Clouser Minnow<br>clouser_minnow | fly | home-window >20% watch | 36/168 | 21.4% | goal_tags:78 | AP/BF 36/84, 0/84<br>clarity clear:88, dirty:40, stained:40<br>bucket warming_search:92, calm_low_light_surface:28, stable_pleasant_medium_confidence_archive:20 |
| Deer Hair Slider<br>deer_hair_slider | fly | home-window >20% watch | 64/300 | 21.3% | goal_tags:168 | AP/BF 0/150, 64/150<br>clarity clear:100, dirty:100, stained:100<br>bucket stable_pleasant_medium_confidence_archive:80, calm_low_light_surface:72, warming_search:52 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | home-window >20% watch | 29/136 | 21.3% | goal_tags:74 | AP/BF 20/68, 9/68<br>clarity clear:136<br>bucket calm_bright_clear_subtle:44, stable_pleasant_medium_confidence_archive:32, heat_limited_finesse:24 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 255/3552 (7.2%) | 124/1776 (7%) | 131/1776 (7.4%) | 255/1776 (14.4%) | 51/168 (30.4%) | 21/168 (12.5%) / 30/168 (17.9%) | home>20%<br>home>25%<br>home>30% |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 107/3552 (3%) | 46/1776 (2.6%) | 61/1776 (3.4%) | 107/1776 (6%) | 48/168 (28.6%) | 19/168 (11.3%) / 29/168 (17.3%) | home>20%<br>home>25% |
| Football Jig<br>football_jig | lure | 74/3552 (2.1%) | 34/1776 (1.9%) | 40/1776 (2.3%) | 74/1776 (4.2%) | 28/102 (27.5%) | 14/102 (13.7%) / 14/102 (13.7%) | home>20%<br>home>25% |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 138/3552 (3.9%) | 70/1776 (3.9%) | 68/1776 (3.8%) | 138/1776 (7.8%) | 35/132 (26.5%) | 25/132 (18.9%) / 10/132 (7.6%) | home>20%<br>home>25% |
| Wake Bait<br>wake_bait | lure | 69/3552 (1.9%) | 53/1776 (3%) | 16/1776 (0.9%) | 69/1776 (3.9%) | 63/252 (25%) | 53/252 (21%) / 10/252 (4%) | home>20% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 206/3552 (5.8%) | 93/1776 (5.2%) | 113/1776 (6.4%) | 206/1776 (11.6%) | 41/168 (24.4%) | 21/168 (12.5%) / 20/168 (11.9%) | home>20% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 125/3552 (3.5%) | 76/1776 (4.3%) | 49/1776 (2.8%) | 125/1776 (7%) | 83/344 (24.1%) | 52/344 (15.1%) / 31/344 (9%) | home>20% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 169/3552 (4.8%) | 95/1776 (5.3%) | 74/1776 (4.2%) | 169/1776 (9.5%) | 38/160 (23.8%) | 17/160 (10.6%) / 21/160 (13.1%) | home>20% |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 163/3552 (4.6%) | 35/1776 (2%) | 128/1776 (7.2%) | 163/1776 (9.2%) | 28/118 (23.7%) | 4/118 (3.4%) / 24/118 (20.3%) | home>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 45/3552 (1.3%) | 35/1776 (2%) | 10/1776 (0.6%) | 45/1776 (2.5%) | 45/192 (23.4%) | 35/192 (18.2%) / 10/192 (5.2%) | home>20% |
| Bluegill Streamer<br>bluegill_streamer | fly | 82/3552 (2.3%) | 53/1776 (3%) | 29/1776 (1.6%) | 82/1776 (4.6%) | 20/88 (22.7%) | 9/88 (10.2%) / 11/88 (12.5%) | home>20% |
| Walking Topwater<br>walking_topwater | lure | 84/3552 (2.4%) | 63/1776 (3.5%) | 21/1776 (1.2%) | 84/1776 (4.7%) | 66/300 (22%) | 53/300 (17.7%) / 13/300 (4.3%) | home>20% |
| Popper Fly<br>popper_fly | fly | 73/3552 (2.1%) | 53/1776 (3%) | 20/1776 (1.1%) | 73/1776 (4.1%) | 58/264 (22%) | 41/264 (15.5%) / 17/264 (6.4%) | home>20% |
| Clouser Minnow<br>clouser_minnow | fly | 177/3552 (5%) | 93/1776 (5.2%) | 84/1776 (4.7%) | 177/1776 (10%) | 36/168 (21.4%) | 25/168 (14.9%) / 11/168 (6.5%) | home>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 81/3552 (2.3%) | 45/1776 (2.5%) | 36/1776 (2%) | 81/1776 (4.6%) | 64/300 (21.3%) | 34/300 (11.3%) / 30/300 (10%) | home>20% |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 76/3552 (2.1%) | 44/1776 (2.5%) | 32/1776 (1.8%) | 76/1776 (4.3%) | 29/136 (21.3%) | 15/136 (11%) / 14/136 (10.3%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.50.
Average expanded finalist pool size: 3.67.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 1304.
Rows/slots with expanded finalist pool size 1: 516.
Selected-tier singleton slots expanded above 1: 788.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.18 | 3.52 | 1 | 1 | 378 | 143 |
| fly/top | 2.31 | 3.30 | 1 | 1 | 308 | 130 |
| lure/honorable | 2.98 | 3.94 | 1 | 1 | 272 | 102 |
| lure/top | 2.54 | 3.92 | 1 | 1 | 346 | 141 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1767 |
| goal_or_priority_condition | 1655 |
| credible_fallback | 130 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 2774 |
| goal_and_priority_condition | 1767 |
| credible_fallback | 520 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 230 |
| family_diversity_scarcity | 197 |
| surface_safety_scarcity | 89 |

Representative expanded singleton finalist pools:
- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__all_purpose__B fly/top: unweighted_baitfish_streamer (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B lure/top: flat_sided_crankbait (goal_or_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B lure/honorable: suspending_jerkbait (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B fly/honorable: unweighted_baitfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__big_fish__B fly/top: baitfish_slider_fly (credible_fallback; hard_gated_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__all_purpose__B fly/honorable: unweighted_baitfish_streamer (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__big_fish__B lure/honorable: glidebait (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__all_purpose__B fly/top: popper_fly (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__clear__all_purpose__B fly/honorable: popper_fly (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__clear__big_fish__B lure/honorable: wake_bait (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__stained__all_purpose__B fly/top: baitfish_slider_fly (goal_or_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__stained__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__stained__big_fish__B lure/top: wake_bait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__stained__big_fish__B lure/honorable: hollow_body_frog (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__dirty__all_purpose__B fly/top: baitfish_slider_fly (goal_or_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__dirty__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__dirty__big_fish__B fly/honorable: deer_hair_slider (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-08-18__freshwater_lake_pond__clear__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; surface_safety_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 4.46 |
| Different-presentation close candidates | 1.68 |
| Different-family close candidates | 2.46 |
| Final expanded Set B pool | 2.33 |
| Same-family/same-presentation reintroduced | 66/1776 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 240 |
| Coverage pool used | 88 |
| Average used coverage pool size | 4.06 |
| Singleton used coverage pools | 1 |
| Broad pool larger than narrowed pool | 42 |
| Broad pool same as narrowed pool | 46 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 9 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 152 |
| broad | 88 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| spinnerbait | 64 |
| bladed_jig | 59 |
| squarebill_crankbait | 55 |
| medium_diving_crankbait | 52 |
| lipless_crankbait | 47 |
| suspending_jerkbait | 41 |
| compact_flipping_jig | 20 |
| buzzbait | 19 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| compact_flipping_jig | 21 |
| spinnerbait | 15 |
| medium_diving_crankbait | 13 |
| squarebill_crankbait | 13 |
| buzzbait | 6 |
| suspending_jerkbait | 6 |
| magnum_jerkbait | 5 |
| lipless_crankbait | 4 |
| bladed_jig | 3 |
| magnum_worm | 2 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__all_purpose__B: Spinnerbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, suspending_jerkbait
- sc_santee_cooper__2025-04-05__freshwater_lake_pond__dirty__all_purpose__A: Spinnerbait; pool buzzbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__dirty__all_purpose__A: Spinnerbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- mn_minnetonka__2025-03-20__freshwater_lake_pond__dirty__all_purpose__B: Spinnerbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, suspending_jerkbait
- mn_minnetonka__2025-05-15__freshwater_lake_pond__dirty__all_purpose__B: Spinnerbait; pool bladed_jig, lipless_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- wv_new_river__2025-09-29__freshwater_river__stained__all_purpose__A: Spinnerbait; pool bladed_jig, buzzbait, spinnerbait, squarebill_crankbait
- ca_clear_lake__2025-08-16__freshwater_lake_pond__stained__big_fish__B: Lipless Crankbait; pool bladed_jig, lipless_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- ca_clear_lake__2025-08-16__freshwater_lake_pond__dirty__all_purpose__B: Lipless Crankbait; pool bladed_jig, lipless_crankbait, squarebill_crankbait, suspending_jerkbait
- ca_castaic__2025-02-18__freshwater_lake_pond__dirty__all_purpose__B: Spinnerbait; pool bladed_jig, compact_flipping_jig, lipless_crankbait, spinnerbait, suspending_jerkbait

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 1440 | 0 | 0 |
| caution | 624 | 12 | 15 |

Caution-gate selected surface examples:
- fl_okeechobee__2025-08-18__freshwater_lake_pond__stained__big_fish__B: honorable_lure:wake_bait
- fl_okeechobee__2025-08-18__freshwater_lake_pond__dirty__big_fish__B: honorable_lure:buzzbait
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__B: honorable_lure:buzzbait
- tx_lake_fork__2025-06-15__freshwater_lake_pond__clear__big_fish__B: honorable_lure:wake_bait
- tx_lake_fork__2025-06-15__freshwater_lake_pond__stained__big_fish__B: honorable_lure:wake_bait
- tx_lake_fork__2025-06-15__freshwater_lake_pond__dirty__big_fish__B: honorable_lure:buzzbait
- al_guntersville__2025-04-11__freshwater_lake_pond__stained__big_fish__B: honorable_lure:buzzbait
- il_fox_chain__2025-06-14__freshwater_lake_pond__clear__big_fish__B: honorable_lure:wake_bait
- co_pueblo__2025-06-22__freshwater_lake_pond__stained__big_fish__B: honorable_lure:wake_bait
- nm_elephant_butte__2025-08-23__freshwater_lake_pond__clear__big_fish__B: honorable_lure:walking_topwater

Caution-gate surface finalist examples:
- fl_okeechobee__2025-08-18__freshwater_lake_pond__stained__big_fish__B lure/honorable: wake_bait, walking_topwater
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__B lure/honorable: buzzbait
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__big_fish__B lure/honorable: buzzbait
- tx_lake_fork__2025-06-15__freshwater_lake_pond__clear__big_fish__B lure/honorable: wake_bait, walking_topwater
- tx_lake_fork__2025-06-15__freshwater_lake_pond__stained__big_fish__B lure/honorable: wake_bait, walking_topwater
- al_guntersville__2025-04-11__freshwater_lake_pond__stained__big_fish__B lure/honorable: buzzbait
- il_fox_chain__2025-06-14__freshwater_lake_pond__clear__big_fish__B lure/honorable: wake_bait
- co_pueblo__2025-06-22__freshwater_lake_pond__stained__big_fish__B lure/honorable: wake_bait
- nm_elephant_butte__2025-08-23__freshwater_lake_pond__clear__big_fish__B lure/honorable: wake_bait, walking_topwater
- nm_elephant_butte__2025-08-23__freshwater_lake_pond__stained__big_fish__B lure/honorable: wake_bait, walking_topwater

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_slider | baitfish_slider | upper<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Foam Gurgler<br>foam_gurgler_fly | fly | largemouth_bass, smallmouth_bass, northern_pike | fly_gurgler | surface_fly_gurgler | surface<br>medium/slow | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 9 |
| Frog Fly<br>frog_fly | fly | largemouth_bass, northern_pike | fly_frog | surface_fly_frog_mouse | surface<br>slow/medium | 1: surface_prey | 3: clear, stained, dirty | 3: calm_surface, low_light_surface, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 9 |
| Buzzbait<br>buzzbait | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_buzz | topwater_open | surface<br>fast/medium | 2: surface_prey, baitfish | 2: stained, dirty | 3: low_light_surface, wind_reaction, dirty_vibration | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 9 |
| Glide Bait<br>glidebait | lure | largemouth_bass, smallmouth_bass | hard_swimbait | glidebait | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: clear, stained | 3: clear_subtle, open_water_search, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 9 |
| Hollow-Body Frog<br>hollow_body_frog | lure | largemouth_bass, northern_pike | surface_frog | topwater_frog | surface<br>slow/medium | 1: surface_prey | 3: clear, stained, dirty | 3: calm_surface, low_light_surface, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | largemouth_bass, smallmouth_bass | soft_plastic_craw | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 4: cover_ambush, cold_slow, clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Wake Bait<br>wake_bait | lure | largemouth_bass, smallmouth_bass | surface_wake | topwater_open | surface<br>slow/medium | 3: surface_prey, baitfish, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Deer Hair Slider<br>deer_hair_slider | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_slider | surface_fly_slider | surface<br>medium/fast | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | true | 8 |
| Popper Fly<br>popper_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_popper | surface_fly_popper_slider | surface<br>medium/slow | 2: surface_prey, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 8 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | bottom<br>slow | 2: leech_worm, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 2: reliable_action, versatile_search | freshwater_lake_pond | false | 8 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_deep | crankbait | bottom<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 2: open_water_search, cold_slow | 1: versatile_search | freshwater_lake_pond | false | 8 |
| Finesse Jig<br>finesse_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, leech_worm | 2: clear, stained | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | largemouth_bass, smallmouth_bass | crankbait_medium | crankbait | mid<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 0: none | freshwater_lake_pond, freshwater_river | false | 8 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | largemouth_bass, smallmouth_bass, northern_pike | swimbait | swimbait | mid<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Shaky-Head Worm<br>shaky_head_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium/fast | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: cover_ambush, dirty_vibration, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | largemouth_bass, smallmouth_bass, trout | jerkbait | jerkbait | mid<br>medium | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, wind_reaction | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Walking Topwater<br>walking_topwater | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_walking | topwater_open | surface<br>medium | 2: surface_prey, baitfish | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 8 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | upper<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: clear_subtle, heat_finesse | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bluegill Streamer<br>bluegill_streamer | fly | largemouth_bass | bluegill_streamer | baitfish_streamer | mid<br>slow/medium | 2: bluegill_perch, baitfish | 2: clear, stained | 2: cover_ambush, warming_search | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Deceiver<br>deceiver | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_baitfish | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Feather Jig Leech<br>feather_jig_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: warming_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, clear_subtle | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Mouse Fly<br>mouse_fly | fly | largemouth_bass, trout | fly_mouse | surface_fly_frog_mouse | surface<br>slow/medium | 1: surface_prey | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_unweighted | baitfish_streamer | upper<br>medium/slow | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | largemouth_bass, smallmouth_bass | crawfish_fly | crawfish_fly | bottom<br>slow/medium | 1: crawfish | 3: clear, stained, dirty | 2: cover_ambush, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Woolly Bugger<br>woolly_bugger | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | bugger_streamer | leech_bugger | mid<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 2: cold_slow, open_water_search | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | largemouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, bluegill_perch | 2: stained, dirty | 2: cover_ambush, dirty_vibration | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | largemouth_bass, smallmouth_bass | soft_plastic_minnow | drop_shot_minnow | mid<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Football Jig<br>football_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: cold_slow, cover_ambush | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | largemouth_bass, smallmouth_bass | jerkbait | jerkbait | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, open_water_search | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Magnum Worm<br>magnum_worm | lure | largemouth_bass | soft_plastic_worm | worm_power | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cover_ambush, heat_finesse | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | jerkbait_soft | jerkbait | upper<br>medium/slow | 1: baitfish | 2: clear, stained | 2: clear_subtle, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Spinnerbait<br>spinnerbait | lure | largemouth_bass, smallmouth_bass, northern_pike | safety_pin_spinner | spinner_vibration | mid<br>medium/slow | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, dirty_vibration, cover_ambush | 0: none | freshwater_lake_pond, freshwater_river | false | 7 |
| Swim Jig<br>swim_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_swimming | swim_jig | mid<br>medium/fast | 2: bluegill_perch, baitfish | 2: stained, dirty | 2: cover_ambush, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Tube Jig<br>tube_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | tube_jig | ned_tube_finesse | bottom<br>slow/medium | 2: crawfish, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium | 1: baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 6 |
| Bladed Jig<br>bladed_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | bladed_jig | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: dirty_vibration, cover_ambush | 0: none | freshwater_lake_pond, freshwater_river | false | 5 |
| Lipless Crankbait<br>lipless_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_lipless | crankbait | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: wind_reaction, open_water_search | 0: none | freshwater_lake_pond, freshwater_river | false | 5 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 206/888 | 41/168 | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 115/504 | 0/0 | goal_tags>1 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 169/840 | 38/160 | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20% |
| Bluegill Streamer<br>bluegill_streamer | fly | 7 | 82/408 | 20/88 | home-window share>20% |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 177/888 | 36/168 | goal_tags>1<br>home-window share>20% |
| Deceiver<br>deceiver | fly | 7 | 142/888 | 28/168 | clear+stained+dirty clarity |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 81/528 | 64/300 | clear+stained+dirty clarity<br>home-window share>20% |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 27/888 | 0/0 | clear+stained+dirty clarity |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 45/276 | 45/192 | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Frog Fly<br>frog_fly | fly | 9 | 28/192 | 16/96 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Game Changer<br>game_changer | fly | 7 | 255/888 | 51/168 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 18/888 | 0/0 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 30/888 | 0/0 | clear+stained+dirty clarity |
| Mouse Fly<br>mouse_fly | fly | 7 | 34/312 | 0/0 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Popper Fly<br>popper_fly | fly | 8 | 73/456 | 58/264 | goal_tags>1<br>home-window share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 124/888 | 45/264 | goal_tags>1<br>reliable_action+big_fish_upside |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 22/204 | 15/68 | clear+stained+dirty clarity |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 60/888 | 31/236 | clear+stained+dirty clarity |
| Blade Bait<br>blade_bait | lure | 7 | 21/888 | 0/0 | clear+stained+dirty clarity |
| Buzzbait<br>buzzbait | lure | 9 | 54/528 | 36/300 | goal_tags>1<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 62/840 | 41/256 | goal_tags>1 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 7 | 163/888 | 28/118 | home-window share>20% |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 20/840 | 10/320 | clear+stained+dirty clarity |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 76/888 | 29/136 | home-window share>20% |
| Football Jig<br>football_jig | lure | 7 | 74/360 | 28/102 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Glide Bait<br>glidebait | lure | 9 | 9/36 | 0/0 | goal_tags>1 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 9 | 19/192 | 11/96 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Magnum Worm<br>magnum_worm | lure | 7 | 55/336 | 0/0 | clear+stained+dirty clarity |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 125/888 | 83/344 | clear+stained+dirty clarity<br>home-window share>20% |
| Ned Rig<br>ned_rig | lure | 9 | 23/396 | 10/124 | clear+stained+dirty clarity |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 107/888 | 48/168 | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20%<br>home-window share>25% overdominant |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 1/48 | 1/8 | clear+stained+dirty clarity |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 138/840 | 35/132 | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant |
| Spinnerbait<br>spinnerbait | lure | 7 | 40/888 | 33/344 | wind+dirty+stained/dirty clarity |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 76/840 | 43/320 | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 154/888 | 38/224 | goal_tags>1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 9/396 | 6/100 | condition_tags>3<br>clear+stained+dirty clarity |
| Wake Bait<br>wake_bait | lure | 9 | 69/372 | 63/252 | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Walking Topwater<br>walking_topwater | lure | 8 | 84/528 | 66/300 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 49/288 | 12/52 | clear+stained+dirty clarity<br>goal_tags>1 |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 7 | 255/888 (28.7%) | 51/168 (30.4%) | big_fish:187, all_purpose:68 | honorable:131, top:124 | wind_reaction:92, dirty_vibration:69, warming_search:58, calm_surface:57, open_water_search:48 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 206/888 (23.2%) | 41/168 (24.4%) | big_fish:157, all_purpose:49 | honorable:113, top:93 | wind_reaction:75, dirty_vibration:63, warming_search:48, open_water_search:47, calm_surface:43 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 177/888 (19.9%) | 36/168 (21.4%) | all_purpose:175, big_fish:2 | top:93, honorable:84 | wind_reaction:62, calm_surface:49, dirty_vibration:45, warming_search:44, low_light_surface:34 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 169/840 (20.1%) | 38/160 (23.8%) | all_purpose:133, big_fish:36 | top:95, honorable:74 | wind_reaction:96, dirty_vibration:67, low_light_surface:45, calm_surface:44, warming_search:40 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 7 | 163/888 (18.4%) | 28/118 (23.7%) | big_fish:160, all_purpose:3 | honorable:128, top:35 | wind_reaction:70, dirty_vibration:63, warming_search:29, open_water_search:26, cold_slow:23 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 154/888 (17.3%) | 38/224 (17%) | all_purpose:142, big_fish:12 | top:92, honorable:62 | wind_reaction:73, dirty_vibration:43, calm_surface:38, warming_search:38, low_light_surface:31 |
| Deceiver<br>deceiver | fly | 7 | 142/888 (16%) | 28/168 (16.7%) | all_purpose:110, big_fish:32 | top:78, honorable:64 | wind_reaction:103, dirty_vibration:71, open_water_search:50, warming_search:26, low_light_surface:21 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 138/840 (16.4%) | 35/132 (26.5%) | all_purpose:131, big_fish:7 | top:70, honorable:68 | calm_surface:52, wind_reaction:39, clear_subtle:37, low_light_surface:32, dirty_vibration:26 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 125/888 (14.1%) | 83/344 (24.1%) | big_fish:66, all_purpose:59 | top:76, honorable:49 | wind_reaction:96, dirty_vibration:72, open_water_search:45, warming_search:45, low_light_surface:14 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 124/888 (14%) | 45/264 (17%) | big_fish:111, all_purpose:13 | honorable:101, top:23 | wind_reaction:36, dirty_vibration:35, cold_slow:34, warming_search:25, heat_finesse:20 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 7 | 119/552 (21.6%) | 0/0 | big_fish:119 | honorable:61, top:58 | wind_reaction:47, calm_surface:34, dirty_vibration:32, warming_search:26, cold_slow:21 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 115/504 (22.8%) | 0/0 | big_fish:115 | top:71, honorable:44 | wind_reaction:57, dirty_vibration:39, warming_search:23, cold_slow:22, calm_surface:20 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 107/888 (12%) | 48/168 (28.6%) | all_purpose:82, big_fish:25 | honorable:61, top:46 | warming_search:54, calm_surface:47, low_light_surface:30, wind_reaction:20, dirty_vibration:17 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 88/840 (10.5%) | 11/160 (6.9%) | all_purpose:71, big_fish:17 | honorable:57, top:31 | clear_subtle:46, calm_surface:35, wind_reaction:24, low_light_surface:22, heat_finesse:17 |
| Walking Topwater<br>walking_topwater | lure | 8 | 84/528 (15.9%) | 66/300 (22%) | big_fish:83, all_purpose:1 | top:63, honorable:21 | calm_surface:65, low_light_surface:35, warming_search:20, clear_subtle:18, wind_reaction:11 |
| Bluegill Streamer<br>bluegill_streamer | fly | 7 | 82/408 (20.1%) | 20/88 (22.7%) | big_fish:81, all_purpose:1 | top:53, honorable:29 | calm_surface:40, clear_subtle:20, low_light_surface:17, warming_search:17, heat_finesse:16 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 81/528 (15.3%) | 64/300 (21.3%) | big_fish:80, all_purpose:1 | top:45, honorable:36 | calm_surface:54, low_light_surface:39, warming_search:22, wind_reaction:17, clear_subtle:15 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 76/840 (9%) | 43/320 (13.4%) | all_purpose:48, big_fish:28 | honorable:41, top:35 | wind_reaction:44, dirty_vibration:38, low_light_surface:33, calm_surface:14, none:9 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 76/888 (8.6%) | 29/136 (21.3%) | all_purpose:55, big_fish:21 | top:44, honorable:32 | heat_finesse:40, clear_subtle:28, calm_surface:24, warming_search:11, low_light_surface:9 |
| Football Jig<br>football_jig | lure | 7 | 74/360 (20.6%) | 28/102 (27.5%) | big_fish:74 | honorable:40, top:34 | wind_reaction:40, dirty_vibration:23, warming_search:20, cold_slow:16, open_water_search:11 |
| Swim Jig<br>swim_jig | lure | 7 | 74/888 (8.3%) | 46/464 (9.9%) | all_purpose:64, big_fish:10 | honorable:44, top:30 | warming_search:41, calm_surface:39, low_light_surface:18, none:13, dirty_vibration:7 |
| Popper Fly<br>popper_fly | fly | 8 | 73/456 (16%) | 58/264 (22%) | all_purpose:72, big_fish:1 | top:53, honorable:20 | calm_surface:56, low_light_surface:31, clear_subtle:17, warming_search:13, wind_reaction:11 |
| Wake Bait<br>wake_bait | lure | 9 | 69/372 (18.5%) | 63/252 (25%) | big_fish:66, all_purpose:3 | top:53, honorable:16 | calm_surface:53, low_light_surface:25, warming_search:15, clear_subtle:14, heat_finesse:10 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 62/840 (7.4%) | 41/256 (16%) | all_purpose:61, big_fish:1 | honorable:33, top:29 | calm_surface:26, clear_subtle:26, cold_slow:14, heat_finesse:12, none:9 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 60/888 (6.8%) | 31/236 (13.1%) | all_purpose:57, big_fish:3 | honorable:43, top:17 | cold_slow:24, wind_reaction:17, dirty_vibration:13, heat_finesse:12, clear_subtle:9 |
| Magnum Worm<br>magnum_worm | lure | 7 | 55/336 (16.4%) | 0/0 | big_fish:54, all_purpose:1 | honorable:35, top:20 | heat_finesse:24, calm_surface:16, none:13, clear_subtle:12, open_water_search:9 |
| Buzzbait<br>buzzbait | lure | 9 | 54/528 (10.2%) | 36/300 (12%) | big_fish:49, all_purpose:5 | top:35, honorable:19 | low_light_surface:41, dirty_vibration:24, calm_surface:20, wind_reaction:20, current_swing:10 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 49/288 (17%) | 12/52 (23.1%) | all_purpose:46, big_fish:3 | top:26, honorable:23 | calm_surface:21, wind_reaction:15, clear_subtle:13, low_light_surface:12, heat_finesse:11 |
| Tube Jig<br>tube_jig | lure | 7 | 49/888 (5.5%) | 0/0 | all_purpose:41, big_fish:8 | top:26, honorable:23 | cold_slow:27, clear_subtle:17, wind_reaction:14, calm_surface:9, dirty_vibration:5 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 45/276 (16.3%) | 45/192 (23.4%) | all_purpose:45 | top:35, honorable:10 | calm_surface:36, low_light_surface:15, warming_search:14, clear_subtle:8, dirty_vibration:8 |
| Lipless Crankbait<br>lipless_crankbait | lure | 5 | 41/888 (4.6%) | 29/344 (8.4%) | big_fish:26, all_purpose:15 | honorable:22, top:19 | wind_reaction:38, open_water_search:33, dirty_vibration:29, low_light_surface:7, heat_finesse:4 |
| Spinnerbait<br>spinnerbait | lure | 7 | 40/888 (4.5%) | 33/344 (9.6%) | all_purpose:22, big_fish:18 | honorable:24, top:16 | dirty_vibration:32, wind_reaction:29, open_water_search:11, low_light_surface:9, warming_search:9 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 6 | 35/840 (4.2%) | 5/320 (1.6%) | all_purpose:19, big_fish:16 | top:18, honorable:17 | clear_subtle:16, calm_surface:12, cold_slow:11, wind_reaction:8, low_light_surface:6 |
| Mouse Fly<br>mouse_fly | fly | 7 | 34/312 (10.9%) | 0/0 | big_fish:34 | top:23, honorable:11 | calm_surface:29, low_light_surface:15, clear_subtle:9, warming_search:9, heat_finesse:6 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 30/888 (3.4%) | 0/0 | all_purpose:30 | honorable:17, top:13 | clear_subtle:22, calm_surface:11, cold_slow:9, heat_finesse:9, wind_reaction:4 |
| Frog Fly<br>frog_fly | fly | 9 | 28/192 (14.6%) | 16/96 (16.7%) | big_fish:28 | honorable:14, top:14 | calm_surface:19, low_light_surface:16, wind_reaction:9, clear_subtle:6, dirty_vibration:6 |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 27/888 (3%) | 0/0 | all_purpose:26, big_fish:1 | honorable:21, top:6 | warming_search:22, calm_surface:7, current_swing:7, dirty_vibration:6, low_light_surface:6 |
| Ned Rig<br>ned_rig | lure | 9 | 23/396 (5.8%) | 10/124 (8.1%) | all_purpose:20, big_fish:3 | honorable:14, top:9 | cold_slow:11, heat_finesse:7, wind_reaction:6, clear_subtle:4, none:3 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 22/204 (10.8%) | 15/68 (22.1%) | all_purpose:19, big_fish:3 | top:14, honorable:8 | cold_slow:11, wind_reaction:11, dirty_vibration:8, clear_subtle:4, heat_finesse:4 |
| Blade Bait<br>blade_bait | lure | 7 | 21/888 (2.4%) | 0/0 | all_purpose:20, big_fish:1 | top:11, honorable:10 | open_water_search:9, wind_reaction:9, cold_slow:6, dirty_vibration:5, calm_surface:4 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 20/840 (2.4%) | 10/320 (3.1%) | all_purpose:14, big_fish:6 | honorable:14, top:6 | cold_slow:7, none:5, warming_search:4, wind_reaction:4, dirty_vibration:3 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 9 | 19/192 (9.9%) | 11/96 (11.5%) | big_fish:19 | top:15, honorable:4 | calm_surface:15, low_light_surface:10, warming_search:6, clear_subtle:4, cold_slow:3 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 18/888 (2%) | 0/0 | all_purpose:18 | honorable:11, top:7 | cold_slow:14, wind_reaction:5, heat_finesse:3, dirty_vibration:2, clear_subtle:1 |
| Bladed Jig<br>bladed_jig | lure | 5 | 16/888 (1.8%) | 15/240 (6.3%) | all_purpose:13, big_fish:3 | top:9, honorable:7 | dirty_vibration:15, wind_reaction:15, open_water_search:5, low_light_surface:3, cold_slow:2 |
| Finesse Jig<br>finesse_jig | lure | 8 | 14/396 (3.5%) | 11/100 (11%) | all_purpose:14 | honorable:9, top:5 | cold_slow:7, heat_finesse:6, clear_subtle:5, wind_reaction:3 |
| Glide Bait<br>glidebait | lure | 9 | 9/36 (25%) | 0/0 | big_fish:9 | top:5, honorable:4 | cold_slow:6, calm_surface:3, none:3, clear_subtle:2 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 9/396 (2.3%) | 6/100 (6%) | all_purpose:9 | honorable:6, top:3 | cold_slow:5, clear_subtle:4, heat_finesse:4, wind_reaction:2, dirty_vibration:1 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 1/48 (2.1%) | 1/8 (12.5%) | big_fish:1 | honorable:1 | clear_subtle:1, cold_slow:1 |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 255/888 (28.7%) | 51/168 (30.4%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias<br>scenario_coverage_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 206/888 (23.2%) | 41/168 (24.4%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias<br>scenario_coverage_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Clouser Minnow<br>clouser_minnow | fly | 177/888 (19.9%) | 36/168 (21.4%) | catalog_tag_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | goal_tags>1<br>home-window share>20% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 169/840 (20.1%) | 38/160 (23.8%) | catalog_tag_stack<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20% |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 163/888 (18.4%) | 28/118 (23.7%) | catalog_tag_stack<br>goal_tag_pressure<br>scenario_coverage_bias | home-window share>20% |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 138/840 (16.4%) | 35/132 (26.5%) | catalog_tag_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 125/888 (14.1%) | 83/344 (24.1%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 119/552 (21.6%) | 0/0 | goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 115/504 (22.8%) | 0/0 | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 107/888 (12%) | 48/168 (28.6%) | catalog_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20%<br>home-window share>25% overdominant |
| Walking Topwater<br>walking_topwater | lure | 84/528 (15.9%) | 66/300 (22%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Bluegill Streamer<br>bluegill_streamer | fly | 82/408 (20.1%) | 20/88 (22.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 81/528 (15.3%) | 64/300 (21.3%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 76/888 (8.6%) | 29/136 (21.3%) | catalog_tag_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | home-window share>20% |
| Football Jig<br>football_jig | lure | 74/360 (20.6%) | 28/102 (27.5%) | catalog_tag_stack<br>goal_tag_pressure | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Popper Fly<br>popper_fly | fly | 73/456 (16%) | 58/264 (22%) | catalog_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Wake Bait<br>wake_bait | lure | 69/372 (18.5%) | 63/252 (25%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 45/276 (16.3%) | 45/192 (23.4%) | catalog_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 124 | 10/124 (8.1%) | Magnum Jerkbait (top), Compact Flipping Jig (honorable):7, Football Jig (top), Magnum Jerkbait (honorable):6, Magnum Jerkbait (top), Football Jig (honorable):6, Medium-Diving Crankbait (top), Football Jig (honorable):5 | selector/direct-score or overpowered competitors |
| Finesse Jig<br>finesse_jig | lure | forage 2: crawfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 100 | 11/100 (11%) | Magnum Jerkbait (top), Football Jig (honorable):7, Football Jig (top), Magnum Jerkbait (honorable):5, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5, Drop-Shot Minnow (top), Carolina-Rigged Stick Worm (honorable):3 | selector/direct-score or overpowered competitors |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 4: cover_ambush, cold_slow, clear_subtle, heat_finesse<br>goal 1: reliable_action | 100 | 6/100 (6%) | Magnum Jerkbait (top), Football Jig (honorable):7, Football Jig (top), Magnum Jerkbait (honorable):5, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5, Drop-Shot Minnow (top), Carolina-Rigged Stick Worm (honorable):3 | selector/direct-score or overpowered competitors |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | forage 2: leech_worm, baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, cold_slow<br>goal 2: reliable_action, versatile_search | 256 | 41/256 (16%) | Drop-Shot Minnow (top), Soft Plastic Jerkbait (honorable):9, Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):7, Suspending Jerkbait (top), Drop-Shot Minnow (honorable):7, Football Jig (top), Magnum Jerkbait (honorable):6 | healthy / not underused |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, heat_finesse<br>goal 1: reliable_action | 136 | 29/136 (21.3%) | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):9, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):7, Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):7, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):5 | healthy / not underused |
| Spinnerbait<br>spinnerbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, dirty_vibration, cover_ambush<br>goal 0: none | 344 | 33/344 (9.6%) | Magnum Jerkbait (top), Compact Flipping Jig (honorable):20, Medium-Diving Crankbait (top), Football Jig (honorable):13, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):11, Compact Flipping Jig (top), Magnum Jerkbait (honorable):10 | selector/direct-score or overpowered competitors |
| Bladed Jig<br>bladed_jig | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: dirty_vibration, cover_ambush<br>goal 0: none | 240 | 15/240 (6.3%) | Magnum Jerkbait (top), Compact Flipping Jig (honorable):12, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):11, Medium-Diving Crankbait (top), Football Jig (honorable):11, Compact Flipping Jig (top), Magnum Jerkbait (honorable):10 | selector/direct-score or overpowered competitors |
| Lipless Crankbait<br>lipless_crankbait | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 0: none | 344 | 29/344 (8.4%) | Magnum Jerkbait (top), Compact Flipping Jig (honorable):20, Medium-Diving Crankbait (top), Football Jig (honorable):13, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):11, Compact Flipping Jig (top), Magnum Jerkbait (honorable):10 | selector/direct-score or overpowered competitors |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Clouser Minnow (clouser_minnow), Foam Gurgler (foam_gurgler_fly), Game Changer (game_changer), Popper Fly (popper_fly), Soft Plastic Jerkbait (soft_jerkbait), Wake Bait (wake_bait), Walking Topwater (walking_topwater)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Baitfish Slider Fly (baitfish_slider_fly), Bluegill Streamer (bluegill_streamer), Clouser Minnow (clouser_minnow), Compact Flipping Jig (compact_flipping_jig), Deer Hair Slider (deer_hair_slider), Drop-Shot Minnow (drop_shot_minnow), Foam Gurgler (foam_gurgler_fly), Football Jig (football_jig), Game Changer (game_changer), Magnum Jerkbait (magnum_jerkbait), Medium-Diving Crankbait (medium_diving_crankbait), Paddle-Tail Swimbait (paddle_tail_swimbait), Popper Fly (popper_fly), Soft Plastic Jerkbait (soft_jerkbait), Wake Bait (wake_bait), Walking Topwater (walking_topwater)

### Probably selector problem, not catalog problem
Bladed Jig (bladed_jig), Finesse Jig (finesse_jig), Lipless Crankbait (lipless_crankbait), Ned Rig (ned_rig), Spinnerbait (spinnerbait), Texas-Rigged Soft-Plastic Craw (texas_rigged_soft_plastic_craw)

## Utilization Notes / Coverage Gaps

- 1 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Deer Hair Slider, Popper Fly, Rabbit-Strip Leech, Woolly Bugger, Foam Gurgler, Articulated Baitfish Streamer, Clouser Minnow, Deceiver, Baitfish Slider Fly, Frog Fly, Bluegill Streamer, Warmwater Crawfish Fly, Swim Jig, Lipless Crankbait, Medium-Diving Crankbait, Spinnerbait, Squarebill Crankbait, Buzzbait, Walking Topwater, Carolina-Rigged Stick Worm, Wake Bait, Suspending Jerkbait, Drop-Shot Minnow, Ned Rig, Compact Flipping Jig, Finesse Jig, Hollow-Body Frog, Weightless Stick Worm |
| underused_home_window | Unweighted Baitfish Streamer, Deep-Diving Crankbait, Flat-Sided Crankbait, Bladed Jig, Texas-Rigged Soft-Plastic Craw |
| no_home_window_coverage | None |
| over-dominant | Game Changer, Paddle-Tail Swimbait, Soft Plastic Jerkbait, Football Jig |
| probably okay niche profile | Worm Fly, Shaky-Head Worm, Topwater Popper |

## LMB Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Deer Hair Slider<br>deer_hair_slider | fly | 4.6% | 81/528 | 64/300 | 81 | 64 | 21.3% | 0/150 | 64/150 | 96 | healthy | activity neutral:216, active:84<br>clarity clear:100, dirty:100, stained:100<br>water freshwater_lake_pond:276, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:80, calm_low_light_surface:72, warming_search:52 | Popper Fly (top), Unweighted Baitfish Streamer (honorable):13, Foam Gurgler (top), Clouser Minnow (honorable):11, Articulated Baitfish Streamer (top), Game Changer (honorable):7 |
| Popper Fly<br>popper_fly | fly | 4.1% | 73/456 | 58/264 | 73 | 58 | 22% | 57/132 | 1/132 | 69 | healthy | activity neutral:204, active:60<br>clarity clear:88, dirty:88, stained:88<br>water freshwater_lake_pond:252, freshwater_river:12<br>bucket stable_pleasant_medium_confidence_archive:80, calm_low_light_surface:60, warming_search:40 | Deer Hair Slider (honorable), Game Changer (top):11, Foam Gurgler (top), Clouser Minnow (honorable):11, Baitfish Slider Fly (top), Clouser Minnow (honorable):7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7% | 124/888 | 45/264 | 124 | 45 | 17% | 9/132 | 36/132 | 45 | healthy | activity neutral:188, suppressed:52, active:24<br>clarity clear:184, stained:44, dirty:36<br>water freshwater_lake_pond:244, freshwater_river:20<br>bucket cold_slow_or_front:104, calm_bright_clear_subtle:48, stable_pleasant_medium_confidence_archive:36 | Articulated Dungeon Streamer (top), Game Changer (honorable):8, Popper Fly (top), Unweighted Baitfish Streamer (honorable):8, Articulated Baitfish Streamer (top), Game Changer (honorable):5 |
| Woolly Bugger<br>woolly_bugger | fly | 3.4% | 60/888 | 31/236 | 60 | 31 | 13.1% | 28/118 | 3/118 | 35 | healthy | activity neutral:180, suppressed:48, active:8<br>clarity clear:164, dirty:36, stained:36<br>water freshwater_lake_pond:220, freshwater_river:16<br>bucket cold_slow_or_front:80, calm_bright_clear_subtle:48, stable_pleasant_medium_confidence_archive:36 | Articulated Dungeon Streamer (top), Game Changer (honorable):8, Popper Fly (top), Unweighted Baitfish Streamer (honorable):8, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):7 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 2.5% | 45/276 | 45/192 | 45 | 45 | 23.4% | 45/96 | 0/96 | 60 | healthy | activity neutral:144, active:48<br>clarity clear:64, dirty:64, stained:64<br>water freshwater_lake_pond:168, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:76, warming_search:28, calm_low_light_surface:24 | Deer Hair Slider (honorable), Game Changer (top):12, Popper Fly (top), Unweighted Baitfish Streamer (honorable):8, Clouser Minnow (honorable), Popper Fly (top):6 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 11.6% | 206/888 | 41/168 | 206 | 41 | 24.4% | 10/84 | 31/84 | 47 | healthy | activity active:84, neutral:84<br>clarity clear:88, dirty:40, stained:40<br>water freshwater_lake_pond:164, freshwater_river:4<br>bucket warming_search:92, calm_low_light_surface:28, stable_pleasant_medium_confidence_archive:20 | Clouser Minnow (top), Baitfish Slider Fly (honorable):8, Clouser Minnow (top), Deceiver (honorable):6, Articulated Dungeon Streamer (top), Game Changer (honorable):4 |
| Clouser Minnow<br>clouser_minnow | fly | 10% | 177/888 | 36/168 | 177 | 36 | 21.4% | 36/84 | 0/84 | 49 | healthy | activity active:84, neutral:84<br>clarity clear:88, dirty:40, stained:40<br>water freshwater_lake_pond:164, freshwater_river:4<br>bucket warming_search:92, calm_low_light_surface:28, stable_pleasant_medium_confidence_archive:20 | Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):7, Articulated Baitfish Streamer (top), Game Changer (honorable):5, Articulated Dungeon Streamer (top), Game Changer (honorable):4 |
| Deceiver<br>deceiver | fly | 8% | 142/888 | 28/168 | 142 | 28 | 16.7% | 22/84 | 6/84 | 45 | healthy | activity active:84, neutral:84<br>clarity clear:88, dirty:40, stained:40<br>water freshwater_lake_pond:164, freshwater_river:4<br>bucket warming_search:92, calm_low_light_surface:28, stable_pleasant_medium_confidence_archive:20 | Clouser Minnow (top), Baitfish Slider Fly (honorable):8, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):7, Articulated Baitfish Streamer (top), Game Changer (honorable):5 |
| Game Changer<br>game_changer | fly | 14.4% | 255/888 | 51/168 | 255 | 51 | 30.4% | 16/84 | 35/84 | 48 | over-dominant | activity active:84, neutral:84<br>clarity clear:88, dirty:40, stained:40<br>water freshwater_lake_pond:164, freshwater_river:4<br>bucket warming_search:92, calm_low_light_surface:28, stable_pleasant_medium_confidence_archive:20 | Clouser Minnow (top), Baitfish Slider Fly (honorable):8, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):7, Clouser Minnow (top), Deceiver (honorable):6 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9.5% | 169/840 | 38/160 | 169 | 38 | 23.8% | 32/80 | 6/80 | 74 | healthy | activity active:80, neutral:80<br>clarity clear:80, dirty:40, stained:40<br>water freshwater_lake_pond:156, freshwater_river:4<br>bucket warming_search:88, calm_low_light_surface:28, cold_slow_or_front:16 | Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):7, Articulated Baitfish Streamer (top), Game Changer (honorable):5, Clouser Minnow (top), Deceiver (honorable):5 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 5% | 88/840 | 11/160 | 88 | 11 | 6.9% | 10/80 | 1/80 | 18 | underused_home_window | activity active:80, neutral:80<br>clarity clear:80, dirty:40, stained:40<br>water freshwater_lake_pond:156, freshwater_river:4<br>bucket warming_search:88, calm_low_light_surface:28, cold_slow_or_front:16 | Clouser Minnow (top), Baitfish Slider Fly (honorable):8, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):7, Articulated Baitfish Streamer (top), Game Changer (honorable):5 |
| Frog Fly<br>frog_fly | fly | 1.6% | 28/192 | 16/96 | 28 | 16 | 16.7% | 0/48 | 16/48 | 30 | healthy | activity neutral:60, active:36<br>clarity clear:32, dirty:32, stained:32<br>water freshwater_lake_pond:96<br>bucket calm_low_light_surface:48, warming_search:24, heat_limited_finesse:12 | Baitfish Slider Fly (top), Clouser Minnow (honorable):6, Mouse Fly (top), Articulated Baitfish Streamer (honorable):5, Popper Fly (top), Unweighted Baitfish Streamer (honorable):5 |
| Bluegill Streamer<br>bluegill_streamer | fly | 4.6% | 82/408 | 20/88 | 82 | 20 | 22.7% | 1/44 | 19/44 | 39 | healthy | activity neutral:48, active:40<br>clarity clear:40, dirty:24, stained:24<br>water freshwater_lake_pond:88<br>bucket warming_search:40, calm_low_light_surface:24, calm_bright_clear_subtle:8 | Articulated Baitfish Streamer (top), Game Changer (honorable):3, Clouser Minnow (honorable), Popper Fly (top):3, Clouser Minnow (top), Baitfish Slider Fly (honorable):3 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 1.2% | 22/204 | 15/68 | 22 | 15 | 22.1% | 12/34 | 3/34 | 16 | healthy | activity neutral:56, suppressed:8, active:4<br>clarity clear:40, stained:16, dirty:12<br>water freshwater_lake_pond:48, freshwater_river:20<br>bucket cold_slow_or_front:28, breezy_windy_stained_reaction:8, dirty_vibration:8 | Articulated Baitfish Streamer (top), Game Changer (honorable):4, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):3, Articulated Dungeon Streamer (top), Game Changer (honorable):2 |
| Worm Fly<br>warmwater_worm_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Swim Jig<br>swim_jig | lure | 4.2% | 74/888 | 46/464 | 74 | 46 | 9.9% | 37/232 | 9/232 | 118 | healthy | activity neutral:252, active:212<br>clarity dirty:188, stained:188, clear:88<br>water freshwater_lake_pond:436, freshwater_river:28<br>bucket dirty_vibration:116, breezy_windy_stained_reaction:108, warming_search:104 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):15, Medium-Diving Crankbait (top), Football Jig (honorable):12, Buzzbait (top), Compact Flipping Jig (honorable):9 |
| Lipless Crankbait<br>lipless_crankbait | lure | 2.3% | 41/888 | 29/344 | 41 | 29 | 8.4% | 12/172 | 17/172 | 91 | healthy | activity active:176, neutral:168<br>clarity dirty:172, stained:172<br>water freshwater_lake_pond:320, freshwater_river:24<br>bucket dirty_vibration:116, breezy_windy_stained_reaction:108, warming_search:52 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):13, Medium-Diving Crankbait (top), Football Jig (honorable):12, Buzzbait (top), Compact Flipping Jig (honorable):9 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 7% | 125/888 | 83/344 | 125 | 83 | 24.1% | 43/172 | 40/172 | 127 | healthy | activity active:176, neutral:168<br>clarity dirty:172, stained:172<br>water freshwater_lake_pond:320, freshwater_river:24<br>bucket dirty_vibration:116, breezy_windy_stained_reaction:108, warming_search:52 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):13, Buzzbait (top), Compact Flipping Jig (honorable):9, Compact Flipping Jig (honorable), Magnum Jerkbait (top):7 |
| Spinnerbait<br>spinnerbait | lure | 2.3% | 40/888 | 33/344 | 40 | 33 | 9.6% | 22/172 | 11/172 | 90 | healthy | activity active:176, neutral:168<br>clarity dirty:172, stained:172<br>water freshwater_lake_pond:320, freshwater_river:24<br>bucket dirty_vibration:116, breezy_windy_stained_reaction:108, warming_search:52 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):13, Medium-Diving Crankbait (top), Football Jig (honorable):12, Buzzbait (top), Compact Flipping Jig (honorable):9 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 1.1% | 20/840 | 10/320 | 20 | 10 | 3.1% | 8/160 | 2/160 | 52 | underused_home_window | activity active:168, neutral:152<br>clarity dirty:160, stained:160<br>water freshwater_lake_pond:320<br>bucket breezy_windy_stained_reaction:108, dirty_vibration:108, warming_search:48 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):13, Medium-Diving Crankbait (top), Football Jig (honorable):12, Suspending Jerkbait (top), Soft Plastic Jerkbait (honorable):7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 2% | 35/840 | 5/320 | 35 | 5 | 1.6% | 4/160 | 1/160 | 33 | underused_home_window | activity active:160, neutral:160<br>clarity dirty:160, stained:160<br>water freshwater_lake_pond:296, freshwater_river:24<br>bucket dirty_vibration:108, breezy_windy_stained_reaction:100, warming_search:52 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):13, Medium-Diving Crankbait (top), Football Jig (honorable):12, Buzzbait (top), Compact Flipping Jig (honorable):9 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 4.3% | 76/840 | 43/320 | 76 | 43 | 13.4% | 26/160 | 17/160 | 88 | healthy | activity active:160, neutral:160<br>clarity dirty:160, stained:160<br>water freshwater_lake_pond:296, freshwater_river:24<br>bucket dirty_vibration:108, breezy_windy_stained_reaction:100, warming_search:52 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):13, Medium-Diving Crankbait (top), Football Jig (honorable):12, Buzzbait (top), Compact Flipping Jig (honorable):9 |
| Buzzbait<br>buzzbait | lure | 3% | 54/528 | 36/300 | 54 | 36 | 12% | 5/150 | 31/150 | 61 | healthy | activity neutral:216, active:84<br>clarity clear:100, dirty:100, stained:100<br>water freshwater_lake_pond:276, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:80, calm_low_light_surface:72, warming_search:52 | Walking Topwater (top), Compact Flipping Jig (honorable):11, Wake Bait (top), Magnum Jerkbait (honorable):10, Wake Bait (honorable), Walking Topwater (top):9 |
| Walking Topwater<br>walking_topwater | lure | 4.7% | 84/528 | 66/300 | 84 | 66 | 22% | 1/150 | 65/150 | 84 | healthy | activity neutral:216, active:84<br>clarity clear:100, dirty:100, stained:100<br>water freshwater_lake_pond:276, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:80, calm_low_light_surface:72, warming_search:52 | Wake Bait (top), Magnum Jerkbait (honorable):10, Wake Bait (top), Paddle-Tail Swimbait (honorable):8, Buzzbait (top), Compact Flipping Jig (honorable):7 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 3.5% | 62/840 | 41/256 | 62 | 41 | 16% | 40/128 | 1/128 | 47 | healthy | activity neutral:208, suppressed:48<br>clarity clear:160, stained:96<br>water freshwater_lake_pond:256<br>bucket cold_slow_or_front:72, heat_limited_finesse:52, calm_bright_clear_subtle:44 | Drop-Shot Minnow (top), Soft Plastic Jerkbait (honorable):9, Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):7, Suspending Jerkbait (top), Drop-Shot Minnow (honorable):7 |
| Wake Bait<br>wake_bait | lure | 3.9% | 69/372 | 63/252 | 69 | 63 | 25% | 3/126 | 60/126 | 79 | healthy | activity neutral:192, active:60<br>clarity clear:84, dirty:84, stained:84<br>water freshwater_lake_pond:252<br>bucket stable_pleasant_medium_confidence_archive:72, calm_low_light_surface:60, warming_search:40 | Walking Topwater (top), Compact Flipping Jig (honorable):9, Walking Topwater (top), Magnum Jerkbait (honorable):7, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):6 |
| Bladed Jig<br>bladed_jig | lure | 0.9% | 16/888 | 15/240 | 16 | 15 | 6.3% | 13/120 | 2/120 | 52 | underused_home_window | activity neutral:168, active:72<br>clarity dirty:120, stained:120<br>water freshwater_lake_pond:216, freshwater_river:24<br>bucket dirty_vibration:116, breezy_windy_stained_reaction:108, calm_low_light_surface:8 | Medium-Diving Crankbait (top), Football Jig (honorable):10, Buzzbait (top), Compact Flipping Jig (honorable):8, Compact Flipping Jig (honorable), Magnum Jerkbait (top):7 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8.7% | 154/888 | 38/224 | 154 | 38 | 17% | 35/112 | 3/112 | 99 | healthy | activity neutral:136, active:60, suppressed:28<br>clarity clear:144, stained:80<br>water freshwater_lake_pond:200, freshwater_river:24<br>bucket warming_search:60, cold_slow_or_front:56, calm_bright_clear_subtle:32 | Magnum Jerkbait (top), Football Jig (honorable):9, Magnum Jerkbait (top), Compact Flipping Jig (honorable):8, Medium-Diving Crankbait (top), Football Jig (honorable):7 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 6% | 107/888 | 48/168 | 107 | 48 | 28.6% | 30/84 | 18/84 | 74 | over-dominant | activity active:84, neutral:84<br>clarity clear:88, dirty:40, stained:40<br>water freshwater_lake_pond:164, freshwater_river:4<br>bucket warming_search:92, calm_low_light_surface:28, stable_pleasant_medium_confidence_archive:20 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):6, Magnum Jerkbait (top), Football Jig (honorable):5, Medium-Diving Crankbait (honorable), Football Jig (top):4 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 4.3% | 76/888 | 29/136 | 76 | 29 | 21.3% | 20/68 | 9/68 | 44 | healthy | activity neutral:116, suppressed:20<br>clarity clear:136<br>water freshwater_lake_pond:132, freshwater_river:4<br>bucket calm_bright_clear_subtle:44, stable_pleasant_medium_confidence_archive:32, heat_limited_finesse:24 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):9, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):7, Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):7 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7.8% | 138/840 | 35/132 | 138 | 35 | 26.5% | 29/66 | 6/66 | 56 | over-dominant | activity neutral:116, suppressed:16<br>clarity clear:132<br>water freshwater_lake_pond:128, freshwater_river:4<br>bucket calm_bright_clear_subtle:40, stable_pleasant_medium_confidence_archive:32, heat_limited_finesse:24 | Carolina-Rigged Stick Worm (top), Tube Jig (honorable):6, Suspending Jerkbait (top), Drop-Shot Minnow (honorable):6, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):5 |
| Ned Rig<br>ned_rig | lure | 1.3% | 23/396 | 10/124 | 23 | 10 | 8.1% | 10/62 | 0/62 | 28 | healthy | activity neutral:100, suppressed:24<br>clarity clear:68, stained:56<br>water freshwater_lake_pond:112, freshwater_river:12<br>bucket cold_slow_or_front:52, breezy_windy_stained_reaction:32, heat_limited_finesse:16 | Magnum Jerkbait (honorable), Football Jig (top):6, Magnum Jerkbait (top), Compact Flipping Jig (honorable):6, Magnum Jerkbait (top), Football Jig (honorable):6 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 9.2% | 163/888 | 28/118 | 163 | 28 | 23.7% | 0/50 | 28/68 | 7 | healthy | activity neutral:68, active:26, suppressed:24<br>clarity clear:80, stained:38<br>water freshwater_lake_pond:102, freshwater_river:16<br>bucket cold_slow_or_front:64, warming_search:14, calm_bright_clear_subtle:12 | Magnum Jerkbait (top), Football Jig (honorable):7, Magnum Jerkbait (honorable), Football Jig (top):6, Drop-Shot Minnow (top), Carolina-Rigged Stick Worm (honorable):3 |
| Football Jig<br>football_jig | lure | 4.2% | 74/360 | 28/102 | 74 | 28 | 27.5% | 0/42 | 28/60 | 12 | over-dominant | activity neutral:56, suppressed:24, active:22<br>clarity clear:68, stained:34<br>water freshwater_lake_pond:102<br>bucket cold_slow_or_front:56, calm_bright_clear_subtle:12, heat_limited_finesse:12 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):6, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5, Drop-Shot Minnow (top), Carolina-Rigged Stick Worm (honorable):3 |
| Finesse Jig<br>finesse_jig | lure | 0.8% | 14/396 | 11/100 | 14 | 11 | 11% | 11/50 | 0/50 | 22 | healthy | activity neutral:60, suppressed:24, active:16<br>clarity clear:80, stained:20<br>water freshwater_lake_pond:84, freshwater_river:16<br>bucket cold_slow_or_front:64, calm_bright_clear_subtle:12, heat_limited_finesse:8 | Magnum Jerkbait (top), Football Jig (honorable):7, Magnum Jerkbait (honorable), Football Jig (top):5, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 0.5% | 9/396 | 6/100 | 9 | 6 | 6% | 6/50 | 0/50 | 27 | underused_home_window | activity neutral:60, suppressed:24, active:16<br>clarity clear:80, stained:20<br>water freshwater_lake_pond:84, freshwater_river:16<br>bucket cold_slow_or_front:64, calm_bright_clear_subtle:12, heat_limited_finesse:8 | Magnum Jerkbait (top), Football Jig (honorable):7, Magnum Jerkbait (honorable), Football Jig (top):5, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 1.1% | 19/192 | 11/96 | 19 | 11 | 11.5% | 0/48 | 11/48 | 17 | healthy | activity neutral:60, active:36<br>clarity clear:32, dirty:32, stained:32<br>water freshwater_lake_pond:96<br>bucket calm_low_light_surface:48, warming_search:24, heat_limited_finesse:12 | Wake Bait (honorable), Walking Topwater (top):5, Wake Bait (top), Drop-Shot Minnow (honorable):4, Suspending Jerkbait (top), Drop-Shot Minnow (honorable):3 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 2.8% | 49/288 | 12/52 | 49 | 12 | 23.1% | 11/26 | 1/26 | 24 | healthy | activity neutral:48, suppressed:4<br>clarity clear:52<br>water freshwater_lake_pond:52<br>bucket stable_pleasant_medium_confidence_archive:16, heat_limited_finesse:12, calm_bright_clear_subtle:8 | Carolina-Rigged Stick Worm (top), Tube Jig (honorable):4, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):4, Wake Bait (honorable), Walking Topwater (top):4 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 0.1% | 1/48 | 1/8 | 1 | 1 | 12.5% | 0/4 | 1/4 | 3 | probably okay niche profile | activity suppressed:8<br>clarity clear:4, stained:4<br>water freshwater_lake_pond:8<br>bucket calm_bright_clear_subtle:4, cold_slow_or_front:4 | Carolina-Rigged Stick Worm (top), Tube Jig (honorable):2, Carolina-Rigged Stick Worm (honorable), Compact Flipping Jig (top):1, Finesse Jig (honorable), Texas-Rigged Soft-Plastic Craw (top):1 |
| Topwater Popper<br>popping_topwater | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |
| forage_clarity_stack | 15 |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |
| Sam Rayburn Reservoir<br>2025-03-28 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Sam Rayburn Reservoir<br>2025-03-28 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Sam Rayburn Reservoir<br>2025-03-28 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Sam Rayburn Reservoir<br>2025-05-10 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Lake Fork<br>2025-04-30 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Jordan Lake / Piedmont reservoir<br>2025-03-22 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake of the Ozarks<br>2025-06-18 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Minnesota natural bass lake<br>2025-03-20 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 136 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| Minnesota natural bass lake<br>2025-05-15 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Minnesota natural bass lake<br>2025-07-16 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 156 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Champlain<br>2025-04-27 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Champlain<br>2025-08-14 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 156 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Colorado mountain-west reservoir<br>2025-08-12 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 156 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Northern California bass lake<br>2025-03-30 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Northern California bass lake<br>2025-08-16 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 156 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | 40/128 | 1/128 | goal_tags:84, daily_condition_tags:68, seasonal_baseline:36, forage_clarity_stack:19, selector_filtering_variety_jitter:8 | Lake Okeechobee / central FL bass lake 2025-03-18 all_purpose clear: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-03-18 all_purpose stained: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-03-19 all_purpose stained: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter) |
| Ned Rig<br>ned_rig | 10/62 | 0/62 | goal_tags:61, forage_clarity_stack:35, daily_condition_tags:11, selector_filtering_variety_jitter:4, seasonal_baseline:3 | Jordan Lake / Piedmont reservoir 2025-03-22 all_purpose clear: lost to Drop-Shot Minnow by 10 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose stained: lost to Tube Jig by 12 (forage_clarity_stack) |
| Finesse Jig<br>finesse_jig | 11/50 | 0/50 | goal_tags:51, forage_clarity_stack:26, daily_condition_tags:5, selector_filtering_variety_jitter:5, seasonal_baseline:2 | Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack)<br>Lake of the Ozarks 2025-02-20 all_purpose clear: lost to Carolina-Rigged Stick Worm by 12 (goal_tags) |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | 6/50 | 0/50 | goal_tags:53, forage_clarity_stack:28, selector_filtering_variety_jitter:6, daily_condition_tags:5, seasonal_baseline:2 | Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Jordan Lake / Piedmont reservoir 2025-03-22 all_purpose clear: lost to Drop-Shot Minnow by 10 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-18<br>all_purpose clear cold_slow_or_front | 186 | Flat-Sided Crankbait<br>184 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-18<br>all_purpose stained cold_slow_or_front | 170 | Flat-Sided Crankbait<br>168 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-19<br>all_purpose stained cold_slow_or_front | 170 | Flat-Sided Crankbait<br>168 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-19<br>all_purpose clear calm_bright_clear_subtle | 186 | Suspending Jerkbait<br>186 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Finesse Jig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Carolina-Rigged Stick Worm<br>170 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Texas-Rigged Soft-Plastic Craw<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Carolina-Rigged Stick Worm<br>170 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Ned Rig<br>Jordan Lake / Piedmont reservoir 2025-03-22<br>all_purpose clear cold_slow_or_front | 170 | Drop-Shot Minnow<br>180 | 10 | forage_clarity_stack | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Jordan Lake / Piedmont reservoir 2025-03-22<br>all_purpose clear cold_slow_or_front | 170 | Drop-Shot Minnow<br>180 | 10 | forage_clarity_stack | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 |
| Finesse Jig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Tube Jig<br>148 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Finesse Jig<br>Lake of the Ozarks 2025-02-20<br>all_purpose clear calm_bright_clear_subtle | 200 | Carolina-Rigged Stick Worm<br>212 | 12 | goal_tags | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Tube Jig<br>148 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose stained breezy_windy_stained_reaction | 164 | Tube Jig<br>176 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Texas-Rigged Soft-Plastic Craw<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Tube Jig<br>148 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Finesse Jig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Suspending Jerkbait<br>186 | 16 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Suspending Jerkbait<br>186 | 16 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Suspending Jerkbait<br>186 | 16 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 23 |
| jitter_or_id_tiebreak | 8 |
| honorable_diversity_or_replacement | 2 |
| set_b_group_novelty | 2 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lake of the Ozarks<br>2025-02-20 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Finesse Jig<br>200 | Carolina-Rigged Stick Worm<br>212 | -12 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake of the Ozarks<br>2025-02-20 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>184 | Carolina-Rigged Stick Worm<br>196 | -12 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Ned Rig<br>170 | Drop-Shot Minnow<br>180 | -10 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |
| Southwest desert bass reservoir<br>2025-06-28 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>182 | Drop-Shot Minnow<br>190 | -8 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12 |
| Southwest desert bass reservoir<br>2025-06-28 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>166 | Drop-Shot Minnow<br>174 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| Santee Cooper<br>2025-07-28 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>182 | Drop-Shot Minnow<br>190 | -8 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12 |
| Santee Cooper<br>2025-07-28 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>166 | Drop-Shot Minnow<br>174 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| Southwest desert bass reservoir<br>2025-08-21 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>166 | Drop-Shot Minnow<br>174 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| Lake of the Ozarks<br>2025-09-13 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>166 | Drop-Shot Minnow<br>174 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| Southern California reservoir<br>2025-09-15 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>166 | Drop-Shot Minnow<br>174 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Ned Rig<br>192 | Drop-Shot Minnow<br>196 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Southwest desert bass reservoir<br>2025-08-21 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Soft Plastic Jerkbait<br>186 | Drop-Shot Minnow<br>190 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_primary_pace:medium:+10 |
| Lake of the Ozarks<br>2025-09-13 all_purpose clear<br>heat_limited_finesse | B<br>honorable_lure | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>190 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Southern California reservoir<br>2025-09-15 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>190 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Flat-Sided Crankbait<br>184 | Carolina-Rigged Stick Worm<br>186 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 all_purpose stained<br>cold_slow_or_front | B<br>honorable_lure | Flat-Sided Crankbait<br>168 | Carolina-Rigged Stick Worm<br>170 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Flat-Sided Crankbait<br>168 | Carolina-Rigged Stick Worm<br>170 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>170 | Finesse Jig<br>170 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Lake of the Ozarks<br>2025-02-20 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Finesse Jig<br>200 | Ned Rig<br>200 | 0 | set_b_group_novelty | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake of the Ozarks<br>2025-02-20 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>184 | Ned Rig<br>184 | 0 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Suspending Jerkbait<br>186 | Carolina-Rigged Stick Worm<br>186 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Ned Rig<br>192 | Finesse Jig<br>192 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Ned Rig<br>170 | Finesse Jig<br>170 | 0 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |
| Northern California bass lake<br>2025-03-30 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>170 | Finesse Jig<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Northern California bass lake<br>2025-03-30 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Appalachian river LMB context<br>2025-04-04 all_purpose clear<br>warming_search | B<br>lure_of_the_day | Soft Plastic Jerkbait<br>180 | Drop-Shot Minnow<br>180 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Southwest high-desert reservoir<br>2025-04-17 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Ned Rig<br>192 | Finesse Jig<br>192 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Lake of the Ozarks<br>2025-04-24 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Finesse Jig<br>192 | Ned Rig<br>192 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Lake of the Ozarks<br>2025-04-24 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Drop-Shot Minnow<br>170 | Ned Rig<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 |
| Lake of the Ozarks<br>2025-04-24 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Drop-Shot Minnow<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 |
| Lake Champlain<br>2025-04-27 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Carolina-Rigged Stick Worm<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Lake Champlain<br>2025-04-27 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Appalachian river LMB context<br>2025-05-06 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Appalachian river LMB context<br>2025-05-06 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 10/320 | 3.1% | 52 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:54, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:54, big_fish / dirty / freshwater_lake_pond / dirty_vibration:54, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:54 | goal_tags:186, daily_condition_tags:95, forage_clarity_stack:16, seasonal_baseline:7 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):13, Medium-Diving Crankbait (top), Football Jig (honorable):12, Suspending Jerkbait (top), Soft Plastic Jerkbait (honorable):7, Buzzbait (top), Compact Flipping Jig (honorable):6 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 5/320 | 1.6% | 33 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:50, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:50, big_fish / dirty / freshwater_lake_pond / dirty_vibration:50, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:50 | goal_tags:177, daily_condition_tags:114, forage_clarity_stack:22, selector_filtering_variety_jitter:2 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):13, Medium-Diving Crankbait (top), Football Jig (honorable):12, Buzzbait (top), Compact Flipping Jig (honorable):9, Compact Flipping Jig (honorable), Magnum Jerkbait (top):7 |
| Bladed Jig<br>bladed_jig | lure | 15/240 | 6.3% | 52 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:54, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:54, big_fish / dirty / freshwater_lake_pond / dirty_vibration:54, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:54 | goal_tags:162, daily_condition_tags:39, forage_clarity_stack:21, selector_filtering_variety_jitter:3 | Medium-Diving Crankbait (top), Football Jig (honorable):10, Buzzbait (top), Compact Flipping Jig (honorable):8, Compact Flipping Jig (honorable), Magnum Jerkbait (top):7, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):6 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 11/160 | 6.9% | 18 | all_purpose / dirty / freshwater_lake_pond / warming_search:16, all_purpose / stained / freshwater_lake_pond / warming_search:16, big_fish / dirty / freshwater_lake_pond / warming_search:16, big_fish / stained / freshwater_lake_pond / warming_search:16 | goal_tags:119, daily_condition_tags:17, forage_clarity_stack:6, seasonal_baseline:6 | Clouser Minnow (top), Baitfish Slider Fly (honorable):8, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):7, Articulated Baitfish Streamer (top), Game Changer (honorable):5, Clouser Minnow (top), Deceiver (honorable):5 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 6/100 | 6% | 27 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:20, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:20, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:8, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:8 | goal_tags:53, forage_clarity_stack:28, selector_filtering_variety_jitter:6, daily_condition_tags:5 | Magnum Jerkbait (top), Football Jig (honorable):7, Magnum Jerkbait (honorable), Football Jig (top):5, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5, Drop-Shot Minnow (top), Carolina-Rigged Stick Worm (honorable):3 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 48/168 | 28.6% | 74 | all_purpose / dirty / freshwater_lake_pond / warming_search:16, all_purpose / stained / freshwater_lake_pond / warming_search:16, big_fish / dirty / freshwater_lake_pond / warming_search:16, big_fish / stained / freshwater_lake_pond / warming_search:16 | goal_tags:76, selector_filtering_variety_jitter:25, daily_condition_tags:12, forage_clarity_stack:7 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):6, Magnum Jerkbait (top), Football Jig (honorable):5, Medium-Diving Crankbait (honorable), Football Jig (top):4, Suspending Jerkbait (honorable), Soft Plastic Jerkbait (top):4 |
| Game Changer<br>game_changer | fly | 51/168 | 30.4% | 48 | all_purpose / dirty / freshwater_lake_pond / warming_search:16, all_purpose / stained / freshwater_lake_pond / warming_search:16, big_fish / dirty / freshwater_lake_pond / warming_search:16, big_fish / stained / freshwater_lake_pond / warming_search:16 | goal_tags:56, daily_condition_tags:35, selector_filtering_variety_jitter:25, seasonal_baseline:1 | Clouser Minnow (top), Baitfish Slider Fly (honorable):8, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):7, Clouser Minnow (top), Deceiver (honorable):6, Bluegill Streamer (honorable), Deer Hair Slider (top):4 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 35/132 | 26.5% | 56 | all_purpose / clear / freshwater_lake_pond / calm_bright_clear_subtle:20, big_fish / clear / freshwater_lake_pond / calm_bright_clear_subtle:20, all_purpose / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:16, big_fish / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:16 | goal_tags:38, selector_filtering_variety_jitter:36, daily_condition_tags:14, forage_clarity_stack:5 | Carolina-Rigged Stick Worm (top), Tube Jig (honorable):6, Suspending Jerkbait (top), Drop-Shot Minnow (honorable):6, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):5, Drop-Shot Minnow (top), Compact Flipping Jig (honorable):4 |
| Football Jig<br>football_jig | lure | 28/102 | 27.5% | 12 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:20, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:20, big_fish / stained / freshwater_lake_pond / warming_search:10, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:8 | goal_tags:47, daily_condition_tags:13, forage_clarity_stack:7, selector_filtering_variety_jitter:5 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):6, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5, Drop-Shot Minnow (top), Carolina-Rigged Stick Worm (honorable):3, Tube Jig (top), Compact Flipping Jig (honorable):3 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Popper Fly [fly] (42), Foam Gurgler [fly] (31), Soft Plastic Jerkbait [lure] (25), Paddle-Tail Swimbait [lure] (22), Baitfish Slider Fly [fly] (21) | Popper Fly [fly] (56), Soft Plastic Jerkbait [lure] (50), Clouser Minnow [fly] (49), Baitfish Slider Fly [fly] (42), Foam Gurgler [fly] (36) |
| calm_surface | big_fish | Walking Topwater [lure] (51), Wake Bait [lure] (42), Bluegill Streamer [fly] (28), Deer Hair Slider [fly] (27), Game Changer [fly] (20) | Walking Topwater [lure] (64), Deer Hair Slider [fly] (54), Wake Bait [lure] (50), Game Changer [fly] (44), Bluegill Streamer [fly] (39) |
| low_light_surface | all_purpose | Baitfish Slider Fly [fly] (24), Suspending Jerkbait [lure] (21), Popper Fly [fly] (18), Clouser Minnow [fly] (15), Soft Plastic Jerkbait [lure] (13) | Clouser Minnow [fly] (34), Baitfish Slider Fly [fly] (33), Soft Plastic Jerkbait [lure] (32), Popper Fly [fly] (30), Suspending Jerkbait [lure] (30) |
| low_light_surface | big_fish | Buzzbait [lure] (30), Walking Topwater [lure] (24), Deer Hair Slider [fly] (23), Wake Bait [lure] (19), Mouse Fly [fly] (13) | Deer Hair Slider [fly] (38), Buzzbait [lure] (36), Walking Topwater [lure] (34), Articulated Baitfish Streamer [fly] (27), Game Changer [fly] (27) |
| wind_reaction | all_purpose | Baitfish Slider Fly [fly] (43), Suspending Jerkbait [lure] (40), Deceiver [fly] (38), Clouser Minnow [fly] (31), Medium-Diving Crankbait [lure] (23) | Deceiver [fly] (71), Suspending Jerkbait [lure] (67), Baitfish Slider Fly [fly] (64), Clouser Minnow [fly] (62), Medium-Diving Crankbait [lure] (47) |
| wind_reaction | big_fish | Medium-Diving Crankbait [lure] (37), Game Changer [fly] (30), Articulated Dungeon Streamer [fly] (28), Deceiver [fly] (26), Articulated Baitfish Streamer [fly] (23) | Game Changer [fly] (70), Compact Flipping Jig [lure] (68), Articulated Dungeon Streamer [fly] (57), Articulated Baitfish Streamer [fly] (53), Medium-Diving Crankbait [lure] (49) |
| dirty_vibration | all_purpose | Baitfish Slider Fly [fly] (30), Deceiver [fly] (26), Suspending Jerkbait [lure] (26), Clouser Minnow [fly] (23), Medium-Diving Crankbait [lure] (18) | Deceiver [fly] (49), Baitfish Slider Fly [fly] (45), Clouser Minnow [fly] (43), Suspending Jerkbait [lure] (41), Medium-Diving Crankbait [lure] (37) |
| dirty_vibration | big_fish | Medium-Diving Crankbait [lure] (28), Game Changer [fly] (24), Articulated Baitfish Streamer [fly] (20), Articulated Dungeon Streamer [fly] (20), Deceiver [fly] (19) | Compact Flipping Jig [lure] (60), Game Changer [fly] (52), Articulated Baitfish Streamer [fly] (43), Articulated Dungeon Streamer [fly] (39), Medium-Diving Crankbait [lure] (35) |
| clear_subtle | all_purpose | Soft Plastic Jerkbait [lure] (22), Carolina-Rigged Stick Worm [lure] (15), Popper Fly [fly] (15), Suspending Jerkbait [lure] (11), Unweighted Baitfish Streamer [fly] (11) | Soft Plastic Jerkbait [lure] (30), Unweighted Baitfish Streamer [fly] (29), Carolina-Rigged Stick Worm [lure] (26), Clouser Minnow [fly] (24), Lead-Eye Leech [fly] (22) |
| clear_subtle | big_fish | Bluegill Streamer [fly] (16), Game Changer [fly] (14), Articulated Dungeon Streamer [fly] (13), Walking Topwater [lure] (13), Wake Bait [lure] (10) | Game Changer [fly] (28), Bluegill Streamer [fly] (20), Magnum Jerkbait [lure] (19), Walking Topwater [lure] (18), Unweighted Baitfish Streamer [fly] (17) |
| cold_slow | all_purpose | Tube Jig [lure] (13), Suspending Jerkbait [lure] (11), Woolly Bugger [fly] (8), Clouser Minnow [fly] (7), Deceiver [fly] (7) | Woolly Bugger [fly] (22), Tube Jig [lure] (21), Suspending Jerkbait [lure] (18), Clouser Minnow [fly] (14), Jighead Marabou Leech [fly] (14) |
| cold_slow | big_fish | Articulated Dungeon Streamer [fly] (16), Magnum Jerkbait [lure] (13), Articulated Baitfish Streamer [fly] (11), Game Changer [fly] (11), Football Jig [lure] (7) | Game Changer [fly] (25), Rabbit-Strip Leech [fly] (25), Compact Flipping Jig [lure] (23), Articulated Dungeon Streamer [fly] (22), Magnum Jerkbait [lure] (21) |
| warming_search | all_purpose | Clouser Minnow [fly] (30), Suspending Jerkbait [lure] (21), Paddle-Tail Swimbait [lure] (19), Swim Jig [lure] (15), Baitfish Slider Fly [fly] (14) | Clouser Minnow [fly] (42), Paddle-Tail Swimbait [lure] (35), Suspending Jerkbait [lure] (35), Baitfish Slider Fly [fly] (32), Swim Jig [lure] (32) |
| warming_search | big_fish | Articulated Baitfish Streamer [fly] (22), Game Changer [fly] (21), Walking Topwater [lure] (20), Magnum Jerkbait [lure] (17), Medium-Diving Crankbait [lure] (15) | Game Changer [fly] (41), Articulated Baitfish Streamer [fly] (35), Compact Flipping Jig [lure] (28), Magnum Jerkbait [lure] (26), Medium-Diving Crankbait [lure] (25) |
| heat_finesse | all_purpose | Drop-Shot Minnow [lure] (20), Clouser Minnow [fly] (13), Carolina-Rigged Stick Worm [lure] (11), Weightless Stick Worm [lure] (9), Baitfish Slider Fly [fly] (8) | Clouser Minnow [fly] (25), Drop-Shot Minnow [lure] (25), Soft Plastic Jerkbait [lure] (21), Unweighted Baitfish Streamer [fly] (13), Carolina-Rigged Stick Worm [lure] (12) |
| heat_finesse | big_fish | Game Changer [fly] (14), Bluegill Streamer [fly] (13), Drop-Shot Minnow [lure] (11), Articulated Dungeon Streamer [fly] (9), Wake Bait [lure] (9) | Game Changer [fly] (29), Magnum Worm [lure] (23), Articulated Baitfish Streamer [fly] (21), Compact Flipping Jig [lure] (20), Rabbit-Strip Leech [fly] (18) |
| current_swing | all_purpose | Clouser Minnow [fly] (6), Foam Gurgler [fly] (4), Soft Plastic Jerkbait [lure] (4), Paddle-Tail Swimbait [lure] (3), Squarebill Crankbait [lure] (3) | Clouser Minnow [fly] (9), Feather Jig Leech [fly] (6), Foam Gurgler [fly] (6), Soft Plastic Jerkbait [lure] (5), Squarebill Crankbait [lure] (5) |
| current_swing | big_fish | Game Changer [fly] (7), Buzzbait [lure] (6), Walking Topwater [lure] (4), Articulated Baitfish Streamer [fly] (3), Rabbit-Strip Leech [fly] (3) | Game Changer [fly] (9), Articulated Baitfish Streamer [fly] (8), Compact Flipping Jig [lure] (8), Rabbit-Strip Leech [fly] (8), Buzzbait [lure] (7) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Sam Rayburn Reservoir<br>2025-03-28 dirty big_fish B | 63-72.2F, 9.3 mph wind, 97.7% cloud, 1.4 in precip | active, closed, wind_reaction+dirty_vibration, medium | Bladed Jig (150); Football Jig (140); Game Changer (154); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-04-11 clear big_fish B | 48.7-60.9F, 9.6 mph wind, 25.8% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle, medium | Squarebill Crankbait (154); Compact Flipping Jig (132); Unweighted Baitfish Streamer (162); Articulated Baitfish Streamer (136) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Southern California reservoir<br>2025-02-18 dirty big_fish B | 47.6-72.9F, 7.9 mph wind, 68.8% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Medium-Diving Crankbait (158); Compact Flipping Jig (170); Game Changer (156); Articulated Baitfish Streamer (162) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Northern California bass lake<br>2025-10-25 clear big_fish A | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+cold_slow+open_water_search, medium | Buzzbait (182); Magnum Jerkbait (192); Deer Hair Slider (166); Game Changer (176) | TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST, TOPWATER_SHOULDER_SEASON_REGION |
| Northern California bass lake<br>2025-10-25 dirty big_fish B | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Compact Flipping Jig (150); Walking Topwater (170); Deer Hair Slider (166); Articulated Dungeon Streamer (168) | TOPWATER_SHOULDER_SEASON_REGION, TOPWATER_SHOULDER_SEASON_REGION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Colorado mountain-west reservoir<br>2025-08-12 clear big_fish A | 60.3-86.9F, 7.6 mph wind, 27.3% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle+open_water_search, medium | Magnum Worm (134); Medium-Diving Crankbait (172); Bluegill Streamer (162); Game Changer (176) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Colorado mountain-west reservoir<br>2025-10-05 stained big_fish B | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Medium-Diving Crankbait (178); Lipless Crankbait (172); Articulated Dungeon Streamer (168); Game Changer (176) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Illinois / Indiana natural-lake example<br>2025-04-18 dirty big_fish B | 55-77.3F, 12.3 mph wind, 81.4% cloud, 1.1 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Compact Flipping Jig (156); Magnum Jerkbait (146); Deceiver (150); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Minnesota natural bass lake<br>2025-05-15 dirty big_fish B | 60.3-76.3F, 18.2 mph wind, 86.5% cloud, 0.3 in precip | active, closed, wind_reaction+dirty_vibration, medium | Bladed Jig (140); Football Jig (140); Articulated Dungeon Streamer (152); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Minnesota natural bass lake<br>2025-05-15 stained big_fish B | 60.3-76.3F, 18.2 mph wind, 86.5% cloud, 0.3 in precip | active, closed, wind_reaction+dirty_vibration, medium | Medium-Diving Crankbait (152); Compact Flipping Jig (156); Articulated Dungeon Streamer (152); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Jordan Lake / Piedmont reservoir<br>2025-03-22 dirty big_fish B | 44.6-71.1F, 9.8 mph wind, 0.4% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Medium-Diving Crankbait (162); Football Jig (140); Articulated Baitfish Streamer (154); Game Changer (154) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Fork<br>2025-03-29 clear big_fish B | 60.8-80.6F, 9.6 mph wind, 56.9% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Medium-Diving Crankbait (178); Football Jig (140); Game Changer (154); Articulated Dungeon Streamer (154) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-04-11 clear big_fish A | 48.7-60.9F, 9.6 mph wind, 25.8% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle, medium | Spinnerbait (144); Magnum Jerkbait (160); Articulated Dungeon Streamer (156); Game Changer (144) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Guntersville / Tennessee River reservoir<br>2025-04-11 stained big_fish A | 48.7-60.9F, 9.6 mph wind, 25.8% cloud, 0 in precip | neutral, caution, wind_reaction+dirty_vibration, medium | Magnum Jerkbait (144); Compact Flipping Jig (156); Articulated Dungeon Streamer (164); Game Changer (144) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Guntersville / Tennessee River reservoir<br>2025-10-19 dirty big_fish A | 54.1-72F, 12.4 mph wind, 33.6% cloud, 1.1 in precip | neutral, caution, wind_reaction+dirty_vibration+open_water_search, medium | Compact Flipping Jig (150); Magnum Jerkbait (168); Articulated Baitfish Streamer (176); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Guntersville / Tennessee River reservoir<br>2025-10-19 stained big_fish B | 54.1-72F, 12.4 mph wind, 33.6% cloud, 1.1 in precip | neutral, caution, wind_reaction+dirty_vibration+open_water_search, medium | Medium-Diving Crankbait (178); Lipless Crankbait (172); Game Changer (176); Articulated Dungeon Streamer (168) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Guntersville / Tennessee River reservoir<br>2025-10-20 clear big_fish B | 47.1-68.9F, 4.1 mph wind, 13.7% cloud, 0 in precip | suppressed, closed, clear_subtle, medium | Tube Jig (148); Compact Flipping Jig (126); Articulated Baitfish Streamer (152); Rabbit-Strip Leech (126) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Southwest desert bass reservoir<br>2025-03-25 clear big_fish B | 67.7-95.9F, 4.4 mph wind, 16.2% cloud, 0 in precip | neutral, closed, clear_subtle+heat_finesse, medium | Drop-Shot Minnow (168); Compact Flipping Jig (132); Game Changer (154); Articulated Baitfish Streamer (146) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Southern California reservoir<br>2025-02-18 clear all_purpose A | 47.6-72.9F, 7.9 mph wind, 68.8% cloud, 0 in precip | active, closed, wind_reaction+warming_search+open_water_search, medium | Carolina-Rigged Stick Worm (170); Blade Bait (174); Feather Jig Leech (152); Articulated Baitfish Streamer (146) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Southern California reservoir<br>2025-02-18 clear big_fish B | 47.6-72.9F, 7.9 mph wind, 68.8% cloud, 0 in precip | active, closed, wind_reaction+warming_search+open_water_search, medium | Compact Flipping Jig (146); Suspending Jerkbait (136); Deceiver (152); Articulated Dungeon Streamer (154) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Southern California reservoir<br>2025-02-18 stained big_fish B | 47.6-72.9F, 7.9 mph wind, 68.8% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Lipless Crankbait (152); Football Jig (154); Game Changer (156); Articulated Dungeon Streamer (162) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Northern California bass lake<br>2025-03-30 stained big_fish B | 39.7-55.9F, 11.2 mph wind, 82.5% cloud, 0.4 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Medium-Diving Crankbait (162); Football Jig (156); Game Changer (154); Articulated Baitfish Streamer (154) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Northern California bass lake<br>2025-10-25 dirty big_fish A | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Magnum Jerkbait (184); Buzzbait (190); Articulated Baitfish Streamer (176); Game Changer (176) | TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST |
| Northern California bass lake<br>2025-10-25 stained big_fish A | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Magnum Jerkbait (192); Buzzbait (190); Baitfish Slider Fly (162); Articulated Baitfish Streamer (176) | TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST |
| Northern California bass lake<br>2025-10-25 stained big_fish B | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Walking Topwater (178); Compact Flipping Jig (150); Articulated Dungeon Streamer (168); Game Changer (176) | TOPWATER_SHOULDER_SEASON_REGION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Colorado mountain-west reservoir<br>2025-04-23 clear big_fish B | 43.9-72.1F, 7.1 mph wind, 71.2% cloud, 0 in precip | active, closed, warming_search, medium | Medium-Diving Crankbait (162); Compact Flipping Jig (132); Rabbit-Strip Leech (126); Articulated Baitfish Streamer (146) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Colorado mountain-west reservoir<br>2025-10-05 clear all_purpose B | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+open_water_search, medium | Tube Jig (182); Drop-Shot Minnow (180); Clouser Minnow (186); Baitfish Slider Fly (174) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Colorado mountain-west reservoir<br>2025-10-05 clear big_fish B | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+open_water_search, medium | Football Jig (134); Suspending Jerkbait (172); Unweighted Baitfish Streamer (162); Articulated Dungeon Streamer (160) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Colorado mountain-west reservoir<br>2025-10-05 dirty big_fish B | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Lipless Crankbait (172); Medium-Diving Crankbait (178); Game Changer (176); Articulated Dungeon Streamer (168) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty big_fish B | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Suspending Jerkbait (148); Football Jig (156); Articulated Dungeon Streamer (152); Rabbit-Strip Leech (150) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 stained big_fish B | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Suspending Jerkbait (156); Compact Flipping Jig (156); Articulated Dungeon Streamer (152); Game Changer (144) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained all_purpose A | 59.2-76.4F, 5.9 mph wind, 19.1% cloud, 0 in precip | neutral, open, calm_surface+cold_slow, medium | Soft Plastic Jerkbait (174); Carolina-Rigged Stick Worm (170); Rabbit-Strip Leech (158); Woolly Bugger (158) | ADJACENT_DAY_EXACT_REPEAT, ADJACENT_DAY_EXACT_REPEAT |

## Known Coverage Gaps

- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
