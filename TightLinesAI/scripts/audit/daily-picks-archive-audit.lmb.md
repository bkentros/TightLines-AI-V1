# FinFindr LMB Daily-Picks Archive Audit
Generated: 2026-05-11T17:05:53.661Z

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
| breezy_windy_stained_reaction | 164 |
| dirty_vibration | 180 |
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
| Lake Okeechobee / central FL bass lake<br>2025-03-18 -> 2025-03-19 | changed | 7.8 | 3.5 | dirty_vibration|cold_slow -> calm_surface|cold_slow |
| Guntersville / Tennessee River reservoir<br>2025-10-19 -> 2025-10-20 | changed | 8.3 | 3.3 | wind_reaction|dirty_vibration|open_water_search -> none |
| Minnesota natural bass lake<br>2025-09-20 -> 2025-09-21 | changed | 1.8 | 1.5 | wind_reaction|dirty_vibration|open_water_search -> calm_surface |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 85 | WIND_NOT_ELEVATING_REACTION (95), BIG_FISH_NOT_FAVORING_UPSIDE (7), TOPWATER_SHOULDER_SEASON_REGION (2), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1), COLD_CLEAR_TOO_FAST (1) |
| calm_bright_clear_subtle | 1 | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (1) |
| calm_low_light_surface | 2 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2) |
| cold_slow_or_front | 63 | WIND_NOT_ELEVATING_REACTION (59), TOPWATER_SHOULDER_SEASON_REGION (8), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (7), BIG_FISH_NOT_FAVORING_UPSIDE (5), COLD_CLEAR_TOO_FAST (3) |
| dirty_vibration | 76 | WIND_NOT_ELEVATING_REACTION (74), BIG_FISH_NOT_FAVORING_UPSIDE (8), DIRTY_WIND_NOT_ELEVATING_VIBRATION (4), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), TOPWATER_SHOULDER_SEASON_REGION (3) |
| heat_limited_finesse | 10 | BIG_FISH_NOT_FAVORING_UPSIDE (7), HEAT_LIMITED_TOO_AGGRESSIVE (2), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| medium_confidence_archive | 257 | WIND_NOT_ELEVATING_REACTION (265), BIG_FISH_NOT_FAVORING_UPSIDE (22), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (20), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (8), TOPWATER_SHOULDER_SEASON_REGION (8) |
| river_elevated_runoff_current | 9 | WIND_NOT_ELEVATING_REACTION (6), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2), BIG_FISH_NOT_FAVORING_UPSIDE (2) |
| stable_pleasant_medium_confidence_archive | 131 | WIND_NOT_ELEVATING_REACTION (144), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (13), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (7), BIG_FISH_NOT_FAVORING_UPSIDE (4), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2) |
| warming_search | 47 | WIND_NOT_ELEVATING_REACTION (53), BIG_FISH_NOT_FAVORING_UPSIDE (6), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1) |

- WIND_NOT_ELEVATING_REACTION: 265
- BIG_FISH_NOT_FAVORING_UPSIDE: 22
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 20
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 8
- TOPWATER_SHOULDER_SEASON_REGION: 8
- DIRTY_WIND_NOT_ELEVATING_VIBRATION: 4
- COLD_CLEAR_TOO_FAST: 3
- HEAT_LIMITED_TOO_AGGRESSIVE: 2

- ca_clear_lake__2025-10-25__freshwater_lake_pond__clear__big_fish__A: TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST. Picks: Buzzbait (lure); Walking Topwater (lure); Deer Hair Slider (fly); Game Changer (fly)
- co_pueblo__2025-08-12__freshwater_lake_pond__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION. Picks: Magnum Worm (lure); Medium-Diving Crankbait (lure); Bluegill Streamer (fly); Game Changer (fly)
- fl_okeechobee__2025-08-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Magnum Worm (lure); Suspending Jerkbait (lure); Bluegill Streamer (fly); Game Changer (fly)
- fl_okeechobee__2025-08-18__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION. Picks: Paddle-Tail Swimbait (lure); Medium-Diving Crankbait (lure); Unweighted Baitfish Streamer (fly); Articulated Baitfish Streamer (fly)
- fl_okeechobee__2025-08-18__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Worm (lure); Compact Flipping Jig (lure); Game Changer (fly); Bluegill Streamer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Flat-Sided Crankbait (lure); Unweighted Baitfish Streamer (fly); Clouser Minnow (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__all_purpose__B: DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION. Picks: Soft Plastic Jerkbait (lure); Spinnerbait (lure); Clouser Minnow (fly); Unweighted Baitfish Streamer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Flat-Sided Crankbait (lure); Weightless Stick Worm (lure); Unweighted Baitfish Streamer (fly); Clouser Minnow (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Hollow-Body Frog (lure); Walking Topwater (lure); Deer Hair Slider (fly); Game Changer (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__dirty__all_purpose__A: DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Bladed Jig (lure); Popper Fly (fly); Unweighted Baitfish Streamer (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Hollow-Body Frog (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Spinnerbait (lure); Magnum Jerkbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION. Picks: Squarebill Crankbait (lure); Compact Flipping Jig (lure); Unweighted Baitfish Streamer (fly); Articulated Baitfish Streamer (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- al_guntersville__2025-06-07__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle-Tail Swimbait (lure); Swim Jig (lure); Popper Fly (fly); Clouser Minnow (fly)
- al_guntersville__2025-06-07__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Walking Topwater (lure); Hollow-Body Frog (lure); Deer Hair Slider (fly); Frog Fly (fly)
- al_guntersville__2025-06-07__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Hollow-Body Frog (lure); Deer Hair Slider (fly); Frog Fly (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- sc_santee_cooper__2025-04-05__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Walking Topwater (lure); Magnum Jerkbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- sc_santee_cooper__2025-04-05__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Walking Topwater (lure); Hollow-Body Frog (lure); Deer Hair Slider (fly); Game Changer (fly)
- sc_santee_cooper__2025-04-05__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Walking Topwater (lure); Deer Hair Slider (fly); Articulated Dungeon Streamer (fly)
- sc_santee_cooper__2025-05-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Hollow-Body Frog (lure); Walking Topwater (lure); Deer Hair Slider (fly); Frog Fly (fly)
- sc_santee_cooper__2025-05-18__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Wake Bait (lure); Hollow-Body Frog (lure); Frog Fly (fly); Articulated Baitfish Streamer (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Drop-Shot Minnow (lure); Finesse Jig (lure); Lead-Eye Leech (fly); Woolly Bugger (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Unweighted Baitfish Streamer (fly); Game Changer (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- mo_lake_ozarks__2025-06-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Weightless Stick Worm (lure); Flat-Sided Crankbait (lure); Popper Fly (fly); Unweighted Baitfish Streamer (fly)
- mo_lake_ozarks__2025-06-18__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Wake Bait (lure); Magnum Worm (lure); Game Changer (fly); Bluegill Streamer (fly)
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
- mn_minnetonka__2025-09-20__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Bluegill Streamer (fly); Articulated Baitfish Streamer (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- il_fox_chain__2025-06-14__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Glide Bait (lure); Magnum Worm (lure); Rabbit-Strip Leech (fly); Bluegill Streamer (fly)
- vt_champlain__2025-08-14__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Soft Plastic Jerkbait (lure); Paddle-Tail Swimbait (lure); Deceiver (fly); Baitfish Slider Fly (fly)
- vt_champlain__2025-08-14__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Magnum Worm (lure); Suspending Jerkbait (lure); Bluegill Streamer (fly); Game Changer (fly)
- vt_champlain__2025-08-14__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Paddle-Tail Swimbait (lure); Lipless Crankbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- wv_stonewall__2025-11-08__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- wv_stonewall__2025-11-08__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wv_new_river__2025-06-17__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Walking Topwater (lure); Compact Flipping Jig (lure); Deer Hair Slider (fly); Articulated Baitfish Streamer (fly)
- co_pueblo__2025-04-23__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- co_pueblo__2025-04-23__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- co_pueblo__2025-04-23__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- co_pueblo__2025-10-05__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Tube Jig (lure); Drop-Shot Minnow (lure); Clouser Minnow (fly); Baitfish Slider Fly (fly)
- co_pueblo__2025-10-05__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 76
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 30
- ADJACENT_DAY_EXACT_REPEAT: 4

- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Suspending Jerkbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Articulated Dungeon Streamer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mo_lake_ozarks__2025-04-24__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Weightless Stick Worm (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- mo_lake_ozarks__2025-04-24__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- vt_champlain__2025-10-12__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- wv_stonewall__2025-03-26__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Deep-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- co_pueblo__2025-04-23__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ca_clear_lake__2025-03-30__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ca_castaic__2025-02-18__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Suspending Jerkbait (lure); Deceiver (fly); Articulated Dungeon Streamer (fly)
- ca_castaic__2025-02-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- az_havasu__2025-03-25__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Drop-Shot Minnow (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Compact Flipping Jig (lure); Baitfish Slider Fly (fly); Articulated Dungeon Streamer (fly)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Glide Bait (lure); Bladed Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Spinnerbait (lure); Glide Bait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Soft Plastic Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Lead-Eye Leech (fly); Baitfish Slider Fly (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Soft Plastic Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Rabbit-Strip Leech (fly); Woolly Bugger (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Carolina-Rigged Stick Worm (lure); Baitfish Slider Fly (fly); Unweighted Baitfish Streamer (fly)
- fl_okeechobee__2025-12-12__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- fl_okeechobee__2025-12-12__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Swim Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- fl_okeechobee__2025-12-12__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Paddle-Tail Swimbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Lipless Crankbait (lure); Deceiver (fly); Articulated Dungeon Streamer (fly)
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
- sc_santee_cooper__2025-05-18__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Buzzbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Deer Hair Slider (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Deceiver (fly)
- nc_jordan_lake__2025-10-04__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Frog Fly (fly)
- mo_lake_ozarks__2025-02-20__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mo_lake_ozarks__2025-02-20__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mo_lake_ozarks__2025-02-20__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Deep-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mo_lake_ozarks__2025-04-24__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Drop-Shot Minnow (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Unweighted Baitfish Streamer (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Articulated Dungeon Streamer (fly); Deceiver (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Articulated Dungeon Streamer (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Spinnerbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Compact Flipping Jig (lure); Baitfish Slider Fly (fly); Bluegill Streamer (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Baitfish Slider Fly (fly); Rabbit-Strip Leech (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- il_fox_chain__2025-10-18__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Baitfish Slider Fly (fly); Articulated Baitfish Streamer (fly)

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
| Lake of the Ozarks<br>2025-04-24 dirty big_fish B | 56.2-78.4F | Magnum Jerkbait (medium); Articulated Baitfish Streamer (medium) |
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
| Aug | southwest_high_desert | caution | bright | big_fish | 1 | 67.7-95.6F | 6.7 |
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
| Jun | appalachian | open | low_light | all_purpose | 5 | 64.2-78.3F | 6.2 |
| Jun | appalachian | open | low_light | big_fish | 5 | 64.2-78.3F | 6.2 |
| Jun | florida | open | low_light | all_purpose | 3 | 78.3-85.4F | 5.7 |
| Jun | florida | open | low_light | big_fish | 6 | 78.3-85.4F | 5.7 |
| Jun | great_lakes_upper_midwest | caution | mixed | big_fish | 1 | 56.6-75.0F | 7.2 |
| Jun | midwest_interior | open | low_light | all_purpose | 6 | 66.9-79.1F | 10.1 |
| Jun | midwest_interior | open | low_light | big_fish | 6 | 66.9-79.1F | 10.1 |
| Jun | mountain_west | caution | glare | big_fish | 2 | 61.5-93.6F | 6.5 |
| Jun | northeast | open | mixed | all_purpose | 6 | 58.4-74.2F | 5.2 |
| Jun | northeast | open | mixed | big_fish | 6 | 58.4-74.2F | 5.2 |
| Jun | south_central | caution | mixed | big_fish | 2 | 74.8-84.7F | 7.3 |
| Jun | south_central | open | low_light | all_purpose | 1 | 71.3-84.0F | 7.2 |
| Jun | south_central | open | low_light | big_fish | 6 | 71.3-84.0F | 7.2 |
| Jun | southwest_high_desert | open | mixed | all_purpose | 6 | 66.8-83.2F | 4.8 |
| Jun | southwest_high_desert | open | mixed | big_fish | 5 | 66.8-83.2F | 4.8 |
| Mar | florida | open | bright | all_purpose | 3 | 59.2-76.4F | 5.9 |
| Mar | florida | open | bright | big_fish | 6 | 59.2-76.4F | 5.9 |
| May | appalachian | open | mixed | all_purpose | 5 | 51.3-72.6F | 5.3 |
| May | appalachian | open | mixed | big_fish | 6 | 51.3-72.6F | 5.3 |
| May | northern_california | open | bright | all_purpose | 6 | 44.9-75.1F | 5.4 |
| May | northern_california | open | bright | big_fish | 6 | 44.9-75.1F | 5.4 |
| May | south_central | caution | mixed | big_fish | 1 | 62.6-76.0F | 10.1 |
| May | southeast_atlantic | open | low_light | all_purpose | 6 | 60.5-85.1F | 5.3 |
| May | southeast_atlantic | open | low_light | big_fish | 12 | 60.5-85.1F | 5.3 |
| Nov | southwest_desert | open | low_light | big_fish | 4 | 64.4-73.2F | 6.2 |
| Oct | northern_california | open | low_light | big_fish | 5 | 49.9-59.6F | 9.9 |
| Oct | southeast_atlantic | open | mixed | big_fish | 6 | 54.6-75.9F | 3 |
| Sep | appalachian | open | low_light | all_purpose | 3 | 55.8-73.2F | 5.6 |
| Sep | appalachian | open | low_light | big_fish | 4 | 55.8-73.2F | 5.6 |
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
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Hollow-Body Frog; Frog Fly; Deer Hair Slider |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Walking Topwater |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained all_purpose B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Popper Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Walking Topwater |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Hollow-Body Frog; Frog Fly; Deer Hair Slider |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty all_purpose A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Popper Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Walking Topwater; Frog Fly |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Hollow-Body Frog |
| Sam Rayburn Reservoir<br>2025-04-12 clear all_purpose A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface+clear_subtle | Popper Fly |
| Sam Rayburn Reservoir<br>2025-04-12 clear big_fish A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface+clear_subtle | Walking Topwater; Deer Hair Slider; Frog Fly |
| Sam Rayburn Reservoir<br>2025-04-12 clear big_fish B | 55.2-78.8F, 5.6 mph, glare | open, calm_surface+clear_subtle | Hollow-Body Frog |
| Sam Rayburn Reservoir<br>2025-04-12 stained all_purpose A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Popper Fly |
| Sam Rayburn Reservoir<br>2025-04-12 stained big_fish A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Hollow-Body Frog; Walking Topwater; Deer Hair Slider |
| Sam Rayburn Reservoir<br>2025-04-12 stained big_fish B | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Buzzbait; Frog Fly |
| Sam Rayburn Reservoir<br>2025-04-12 dirty all_purpose A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Popper Fly |
| Sam Rayburn Reservoir<br>2025-04-12 dirty big_fish A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Walking Topwater; Frog Fly |
| Sam Rayburn Reservoir<br>2025-04-12 dirty big_fish B | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Buzzbait; Hollow-Body Frog; Deer Hair Slider |
| Lake Fork<br>2025-04-30 clear all_purpose B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction | Popper Fly |
| Lake Fork<br>2025-04-30 clear big_fish A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction | Hollow-Body Frog; Walking Topwater; Deer Hair Slider |
| Lake Fork<br>2025-04-30 clear big_fish B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction | Buzzbait; Frog Fly |
| Lake Fork<br>2025-04-30 stained all_purpose B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Popper Fly |
| Lake Fork<br>2025-04-30 stained big_fish A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Buzzbait; Hollow-Body Frog; Frog Fly |
| Lake Fork<br>2025-04-30 stained big_fish B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Walking Topwater; Deer Hair Slider |
| Lake Fork<br>2025-04-30 dirty all_purpose A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Popper Fly |
| Lake Fork<br>2025-04-30 dirty big_fish A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Buzzbait; Walking Topwater; Frog Fly; Deer Hair Slider |
| Lake Fork<br>2025-04-30 dirty big_fish B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Hollow-Body Frog |
| Guntersville / Tennessee River reservoir<br>2025-04-11 stained big_fish B | 48.7-60.9F, 9.6 mph, bright | caution, wind_reaction+dirty_vibration | Buzzbait |
| Santee Cooper<br>2025-04-05 clear all_purpose A | 67.1-82.8F, 9.6 mph, low_light | open, low_light_surface+wind_reaction | Popper Fly |
| Santee Cooper<br>2025-04-05 clear big_fish A | 67.1-82.8F, 9.6 mph, low_light | open, low_light_surface+wind_reaction | Buzzbait; Hollow-Body Frog; Deer Hair Slider; Frog Fly |

## Set B Diagnostics

### Set B Overlap Cause Counts

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

| Kind | Cause | Lure | Fly | Total |
| --- | --- | --- | --- | --- |
| exact_id | unavoidable_due_score_band | 2 | 0 | 2 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 1 | 0 | 1 |
| same_family_same_presentation | truly_avoidable | 61 | 15 | 76 |
| same_family_same_presentation | unavoidable_due_score_band | 8 | 6 | 14 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 1 | 0 | 1 |
| same_family_same_presentation | unavoidable_due_goal_condition_fit | 0 | 3 | 3 |
| same_family_different_presentation | truly_avoidable | 0 | 30 | 30 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 11 | 11 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 8 | 8 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-12-12 clear big_fish | lure honorable: same_family_same_presentation | Soft Plastic Jerkbait (146); Football Jig (134) | Flat-Sided Crankbait (146); Compact Flipping Jig (126) | Suspending Jerkbait (156, alt edge 30) |
| Lake Champlain<br>2025-10-12 clear big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (160); Football Jig (134) | Medium-Diving Crankbait (162); Compact Flipping Jig (126) | Paddle-Tail Swimbait (156, alt edge 30) |
| Lake of the Ozarks<br>2025-04-24 clear big_fish | lure honorable: same_family_same_presentation | Football Jig (140); Magnum Jerkbait (160) | Drop-Shot Minnow (158); Compact Flipping Jig (132) | Weightless Stick Worm (160, alt edge 28) |
| Southwest high-desert reservoir<br>2025-04-17 clear big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (160); Football Jig (140) | Flat-Sided Crankbait (150); Compact Flipping Jig (132) | Weightless Stick Worm (160, alt edge 28) |
| Lake Champlain<br>2025-10-12 dirty big_fish | lure top: same_family_same_presentation | Magnum Jerkbait (152); Compact Flipping Jig (134) | Football Jig (134); Paddle-Tail Swimbait (156) | Medium-Diving Crankbait (162, alt edge 28) |
| Guntersville / Tennessee River reservoir<br>2025-04-11 clear big_fish | fly honorable: same_family_same_presentation | Articulated Dungeon Streamer (156); Game Changer (144) | Unweighted Baitfish Streamer (162); Articulated Baitfish Streamer (136) | Baitfish Slider Fly (162, alt edge 26) |
| Guntersville / Tennessee River reservoir<br>2025-10-20 clear big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (176); Football Jig (134) | Tube Jig (148); Compact Flipping Jig (126) | Drop-Shot Minnow (152, alt edge 26) |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear big_fish | lure honorable: same_family_same_presentation | Squarebill Crankbait (142); Football Jig (156) | Tube Jig (148); Compact Flipping Jig (132) | Suspending Jerkbait (156, alt edge 24) |
| Lake Champlain<br>2025-10-12 stained big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (160); Compact Flipping Jig (134) | Medium-Diving Crankbait (162); Football Jig (134) | Paddle-Tail Swimbait (156, alt edge 22) |
| Southwest desert bass reservoir<br>2025-03-25 clear big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (170); Football Jig (140) | Drop-Shot Minnow (168); Compact Flipping Jig (132) | Ned Rig (152, alt edge 20) |
| Northern California bass lake<br>2025-03-30 clear big_fish | lure honorable: same_family_same_presentation | Football Jig (156); Magnum Jerkbait (170) | Medium-Diving Crankbait (162); Compact Flipping Jig (132) | Deep-Diving Crankbait (152, alt edge 20) |
| Minnesota natural bass lake<br>2025-05-15 clear big_fish | lure honorable: same_family_same_presentation | Football Jig (140); Magnum Jerkbait (144) | Squarebill Crankbait (142); Compact Flipping Jig (132) | Medium-Diving Crankbait (152, alt edge 20) |
| Lake of the Ozarks<br>2025-02-20 clear big_fish | lure honorable: same_family_same_presentation | Football Jig (170); Shaky-Head Worm (160) | Tube Jig (178); Compact Flipping Jig (146) | Ned Rig (166, alt edge 20) |
| Jordan Lake / Piedmont reservoir<br>2025-03-22 clear big_fish | lure honorable: same_family_same_presentation | Football Jig (140); Magnum Jerkbait (170) | Medium-Diving Crankbait (162); Compact Flipping Jig (132) | Drop-Shot Minnow (152, alt edge 20) |
| Lake Champlain<br>2025-04-27 clear big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (170); Football Jig (156) | Medium-Diving Crankbait (162); Compact Flipping Jig (132) | Deep-Diving Crankbait (152, alt edge 20) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Lake of the Ozarks<br>2025-11-11 dirty | B | 3/4 | Medium-Diving Crankbait; Lipless Crankbait; Articulated Baitfish Streamer; Game Changer | Lipless Crankbait; Medium-Diving Crankbait; Deceiver; Articulated Baitfish Streamer |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 clear B | lure | Paddle-Tail Swimbait; Medium-Diving Crankbait |
| Guntersville / Tennessee River reservoir<br>2025-10-19 stained B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Guntersville / Tennessee River reservoir<br>2025-10-19 dirty B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| Lake of the Ozarks<br>2025-11-11 clear B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Lake of the Ozarks<br>2025-11-11 stained B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Lake of the Ozarks<br>2025-11-11 dirty B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| Illinois / Indiana natural-lake example<br>2025-10-18 clear B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Illinois / Indiana natural-lake example<br>2025-10-18 stained B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| Illinois / Indiana natural-lake example<br>2025-10-18 dirty B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Lake Champlain<br>2025-08-14 clear B | lure | Paddle-Tail Swimbait; Lipless Crankbait |
| WV/VA highland reservoir<br>2025-11-08 stained B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| WV/VA highland reservoir<br>2025-11-08 dirty B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Appalachian river LMB context<br>2025-04-04 stained B | lure | Medium-Diving Crankbait; Spinnerbait |
| Appalachian river LMB context<br>2025-04-04 dirty B | lure | Medium-Diving Crankbait; Spinnerbait |
| Appalachian river LMB context<br>2025-05-06 stained B | lure | Squarebill Crankbait; Medium-Diving Crankbait |
| Appalachian river LMB context<br>2025-05-06 dirty B | lure | Flat-Sided Crankbait; Medium-Diving Crankbait |
| Colorado mountain-west reservoir<br>2025-08-12 clear B | lure | Soft Plastic Jerkbait; Suspending Jerkbait |
| Colorado mountain-west reservoir<br>2025-10-05 stained B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Colorado mountain-west reservoir<br>2025-10-05 dirty B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| Southwest desert bass reservoir<br>2025-06-28 stained B | lure | Drop-Shot Minnow; Bladed Jig |
| Southwest desert bass reservoir<br>2025-06-28 dirty B | lure | Drop-Shot Minnow; Squarebill Crankbait |
| Southwest desert bass reservoir<br>2025-08-21 stained B | lure | Medium-Diving Crankbait; Drop-Shot Minnow |
| Southwest desert bass reservoir<br>2025-08-21 dirty B | lure | Lipless Crankbait; Drop-Shot Minnow |
| Southwest high-desert reservoir<br>2025-08-23 clear A | lure | Medium-Diving Crankbait; Suspending Jerkbait |
| Southwest high-desert reservoir<br>2025-10-14 stained B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| Southwest high-desert reservoir<br>2025-10-14 dirty B | lure | Lipless Crankbait; Medium-Diving Crankbait |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Medium-Diving Crankbait [lure] | 19 | Magnum Jerkbait (15), Compact Flipping Jig (3), Magnum Worm (1) | -3.5 |
| Lipless Crankbait [lure] | 15 | Magnum Jerkbait (14), Magnum Worm (1) | 2.3 |
| Drop-Shot Minnow [lure] | 4 | Magnum Worm (4) | 8 |
| Spinnerbait [lure] | 2 | Compact Flipping Jig (2) | 6 |
| Squarebill Crankbait [lure] | 2 | Magnum Jerkbait (1), Magnum Worm (1) | 12 |
| Bladed Jig [lure] | 1 | Magnum Worm (1) | 10 |
| Flat-Sided Crankbait [lure] | 1 | Compact Flipping Jig (1) | 14 |

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 dirty all_purpose B | DIRTY_WIND_NOT_ELEVATING_VIBRATION (fly) | Clouser Minnow (146; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Unweighted Baitfish Streamer (150; goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (158, alt edge 8) | goal fit likely competed |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (lure) | Soft Plastic Jerkbait (202; condition_tag:clear_subtle:+16, condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Carolina-Rigged Stick Worm (176; condition_tag:clear_subtle:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Suspending Jerkbait (202, alt edge 0) | goal fit likely competed |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Bluegill Streamer (162; goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Deceiver (172, alt edge -4) | goal fit likely competed |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 clear big_fish A | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (fly) | Bluegill Streamer (162; goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Unweighted Baitfish Streamer (168, alt edge -8) | goal fit likely competed |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 clear big_fish B | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (lure) | Paddle-Tail Swimbait (162; condition_tag:open_water_search:+16); Medium-Diving Crankbait (172; condition_tag:wind_reaction:+16, condition_tag:open_water_search:+16) | Suspending Jerkbait (172, alt edge 0) | other condition fit likely competed |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Unweighted Baitfish Streamer (168; condition_tag:clear_subtle:+16, condition_tag:open_water_search:+16); Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Deceiver (172, alt edge 4) | goal fit likely competed |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (186; condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge -2) | goal fit likely competed |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 stained big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Worm (134; goal:big_fish:big_fish_upside:+20); Compact Flipping Jig (150; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20) | Lipless Crankbait (172, alt edge 22) | goal fit likely competed |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Bluegill Streamer (162; goal:big_fish:big_fish_upside:+20) | Deceiver (172, alt edge -4) | goal fit likely competed |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Worm (134; goal:big_fish:big_fish_upside:+20); Compact Flipping Jig (150; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20) | Lipless Crankbait (172, alt edge 22) | goal fit likely competed |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Bluegill Streamer (154; goal:big_fish:big_fish_upside:+20) | Deceiver (172, alt edge -4) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-02-11 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (148; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Jighead Marabou Leech (146; goal:all_purpose:reliable_action:+18) | Deceiver (164, alt edge 16) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-02-11 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (lure) | Deep-Diving Crankbait (164; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Tube Jig (164; goal:all_purpose:reliable_action:+18) | Suspending Jerkbait (166, alt edge 2) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-02-11 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (154; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Game Changer (156; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Deceiver (152, alt edge -4) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-02-11 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (154; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Clouser Minnow (166; condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Deceiver (164, alt edge -2) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-02-11 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (lure) | Carolina-Rigged Stick Worm (170; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Compact Flipping Jig (150; condition_tag:dirty_vibration:+16) | Suspending Jerkbait (166, alt edge -4) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-02-11 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (148; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (162; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Deceiver (152, alt edge -10) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-02-11 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Lead-Eye Leech (146; goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (154; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (164, alt edge 10) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-02-11 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (lure) | Deep-Diving Crankbait (164; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Bladed Jig (136; condition_tag:dirty_vibration:+16) | Medium-Diving Crankbait (158, alt edge -6) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-02-11 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (156; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (162; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Deceiver (152, alt edge -10) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 8) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (146; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (146; goal:all_purpose:versatile_search:+12); Clouser Minnow (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Deceiver (162, alt edge -2) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 stained big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Compact Flipping Jig (156; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20); Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 6) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| dirty_vibration_acceptable | 100 |
| clear_subtle_wind_watch | 76 |
| current_open_water_acceptable | 22 |
| other_wind_watch | 10 |
| surface_low_light_acceptable | 5 |
| true_dirty_stained_wind_miss | 1 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Lake Okeechobee / central FL bass lake<br>2025-08-18 all_purpose clear A | stable_pleasant_medium_confidence_archive<br>neutral | Soft Plastic Jerkbait 202<br>Carolina-Rigged Stick Worm 176 |
| clear_subtle_wind_watch | Lake Okeechobee / central FL bass lake<br>2025-08-18 big_fish clear A | stable_pleasant_medium_confidence_archive<br>neutral | Magnum Worm 134<br>Suspending Jerkbait 172 |
| clear_subtle_wind_watch | Lake Okeechobee / central FL bass lake<br>2025-08-18 big_fish clear B | stable_pleasant_medium_confidence_archive<br>neutral | Paddle-Tail Swimbait 162<br>Medium-Diving Crankbait 172 |
| clear_subtle_wind_watch | Sam Rayburn Reservoir<br>2025-02-11 all_purpose clear A | stable_pleasant_medium_confidence_archive<br>active | Suspending Jerkbait 166<br>Carolina-Rigged Stick Worm 170 |
| clear_subtle_wind_watch | Sam Rayburn Reservoir<br>2025-02-11 all_purpose clear B | stable_pleasant_medium_confidence_archive<br>active | Deep-Diving Crankbait 164<br>Tube Jig 164 |
| current_open_water_acceptable | Lake Okeechobee / central FL bass lake<br>2025-08-18 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Suspending Jerkbait 186<br>Paddle-Tail Swimbait 174 |
| current_open_water_acceptable | Sam Rayburn Reservoir<br>2025-02-11 all_purpose stained A | breezy_windy_stained_reaction<br>active | Blade Bait 174<br>Suspending Jerkbait 166 |
| current_open_water_acceptable | Sam Rayburn Reservoir<br>2025-02-11 all_purpose dirty A | dirty_vibration<br>active | Carolina-Rigged Stick Worm 162<br>Medium-Diving Crankbait 158 |
| current_open_water_acceptable | Sam Rayburn Reservoir<br>2025-02-11 big_fish dirty B | dirty_vibration<br>active | Lipless Crankbait 152<br>Football Jig 154 |
| current_open_water_acceptable | Lake Fork<br>2025-06-15 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Suspending Jerkbait 186<br>Medium-Diving Crankbait 172 |
| dirty_vibration_acceptable | Lake Okeechobee / central FL bass lake<br>2025-08-18 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Magnum Worm 134<br>Compact Flipping Jig 150 |
| dirty_vibration_acceptable | Lake Okeechobee / central FL bass lake<br>2025-08-18 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 172<br>Buzzbait 150 |
| dirty_vibration_acceptable | Lake Okeechobee / central FL bass lake<br>2025-08-18 big_fish dirty A | dirty_vibration<br>neutral | Magnum Worm 134<br>Compact Flipping Jig 150 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-02-11 all_purpose stained B | breezy_windy_stained_reaction<br>active | Carolina-Rigged Stick Worm 170<br>Compact Flipping Jig 150 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-02-11 big_fish stained A | breezy_windy_stained_reaction<br>active | Compact Flipping Jig 170<br>Medium-Diving Crankbait 158 |
| other_wind_watch | Sam Rayburn Reservoir<br>2025-03-28 big_fish stained B | breezy_windy_stained_reaction<br>active | Medium-Diving Crankbait 162<br>Football Jig 140 |
| other_wind_watch | Lake Fork<br>2025-03-29 all_purpose stained A | breezy_windy_stained_reaction<br>neutral | Paddle-Tail Swimbait 162<br>Suspending Jerkbait 180 |
| other_wind_watch | Lake Fork<br>2025-03-29 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 178<br>Football Jig 140 |
| other_wind_watch | Santee Cooper<br>2025-05-18 all_purpose stained A | breezy_windy_stained_reaction<br>active | Suspending Jerkbait 170<br>Medium-Diving Crankbait 140 |
| other_wind_watch | Jordan Lake / Piedmont reservoir<br>2025-03-22 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Suspending Jerkbait 180<br>Drop-Shot Minnow 154 |
| surface_low_light_acceptable | Lake Fork<br>2025-04-30 all_purpose stained B | breezy_windy_stained_reaction<br>active | Suspending Jerkbait 170<br>Soft Plastic Jerkbait 164 |
| surface_low_light_acceptable | Santee Cooper<br>2025-04-05 all_purpose stained A | breezy_windy_stained_reaction<br>active | Suspending Jerkbait 170<br>Lipless Crankbait 140 |
| surface_low_light_acceptable | Santee Cooper<br>2025-04-05 big_fish stained A | breezy_windy_stained_reaction<br>active | Walking Topwater 172<br>Hollow-Body Frog 162 |
| surface_low_light_acceptable | Santee Cooper<br>2025-05-18 big_fish stained A | breezy_windy_stained_reaction<br>active | Wake Bait 180<br>Hollow-Body Frog 162 |
| surface_low_light_acceptable | Minnesota natural bass lake<br>2025-07-16 all_purpose dirty A | dirty_vibration<br>neutral | Lipless Crankbait 172<br>Medium-Diving Crankbait 172 |
| true_dirty_stained_wind_miss | Minnesota natural bass lake<br>2025-05-15 big_fish stained A | breezy_windy_stained_reaction<br>active | Football Jig 140<br>Magnum Jerkbait 144 |

## Guide Verdict Summary

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | A | fly | medium_confidence_archive | 171 |
| watch | big_fish | B | fly | medium_confidence_archive | 120 |
| watch | big_fish | B | lure | medium_confidence_archive | 85 |
| watch | big_fish | A | lure | medium_confidence_archive | 80 |
| watch | all_purpose | A | fly | medium_confidence_archive | 64 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 57 |
| watch | big_fish | A | fly | cold_slow_or_front | 53 |
| watch | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 52 |
| watch | big_fish | A | fly | dirty_vibration | 51 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 48 |
| watch | all_purpose | A | lure | medium_confidence_archive | 43 |
| watch | all_purpose | B | fly | medium_confidence_archive | 40 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 36 |
| watch | big_fish | B | fly | dirty_vibration | 34 |
| watch | big_fish | A | fly | warming_search | 33 |
| watch | all_purpose | B | lure | medium_confidence_archive | 29 |
| watch | big_fish | B | fly | cold_slow_or_front | 29 |
| watch | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 29 |
| watch | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 27 |
| watch | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 26 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 24 |
| watch | big_fish | B | lure | cold_slow_or_front | 24 |
| watch | big_fish | A | lure | heat_limited_finesse | 23 |
| watch | big_fish | A | fly | heat_limited_finesse | 22 |
| watch | big_fish | B | fly | warming_search | 21 |
| watch | big_fish | B | lure | dirty_vibration | 21 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 20 |
| watch | all_purpose | B | fly | cold_slow_or_front | 19 |
| watch | big_fish | B | lure | heat_limited_finesse | 19 |
| watch | all_purpose | A | fly | dirty_vibration | 17 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 17 |
| watch | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 16 |
| watch | big_fish | A | lure | cold_slow_or_front | 16 |
| watch | all_purpose | A | fly | cold_slow_or_front | 15 |
| watch | all_purpose | A | lure | dirty_vibration | 13 |
| watch | all_purpose | B | lure | breezy_windy_stained_reaction | 13 |
| watch | big_fish | A | lure | warming_search | 13 |
| watch | big_fish | B | fly | calm_bright_clear_subtle | 13 |
| watch | big_fish | B | fly | heat_limited_finesse | 13 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 13 |
| watch | big_fish | A | lure | dirty_vibration | 11 |
| watch | big_fish | B | lure | warming_search | 11 |
| watch | all_purpose | A | fly | warming_search | 10 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 10 |
| watch | all_purpose | B | fly | dirty_vibration | 10 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 10 |
| watch | all_purpose | A | fly | heat_limited_finesse | 8 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 8 |
| watch | all_purpose | B | lure | dirty_vibration | 8 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 8 |
| watch | big_fish | B | lure | calm_bright_clear_subtle | 8 |
| watch | all_purpose | A | lure | river_elevated_runoff_current | 7 |
| watch | all_purpose | A | lure | warming_search | 7 |
| watch | all_purpose | B | fly | warming_search | 6 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 5 |
| watch | all_purpose | B | fly | heat_limited_finesse | 5 |
| watch | all_purpose | B | lure | heat_limited_finesse | 5 |
| watch | all_purpose | A | lure | breezy_windy_stained_reaction | 4 |
| watch | all_purpose | A | lure | cold_slow_or_front | 4 |
| watch | all_purpose | A | lure | heat_limited_finesse | 4 |
| watch | big_fish | A | fly | calm_low_light_surface | 4 |
| watch | big_fish | B | fly | calm_low_light_surface | 4 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 4 |
| watch | all_purpose | A | fly | calm_low_light_surface | 3 |
| watch | all_purpose | A | lure | calm_low_light_surface | 3 |
| watch | all_purpose | B | fly | river_elevated_runoff_current | 3 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 3 |
| watch | all_purpose | B | lure | warming_search | 3 |
| watch | all_purpose | B | fly | calm_low_light_surface | 2 |
| watch | all_purpose | B | lure | cold_slow_or_front | 2 |
| watch | big_fish | A | lure | calm_bright_clear_subtle | 2 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 2 |
| watch | all_purpose | A | fly | river_elevated_runoff_current | 1 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 1 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 238 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 200 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 173 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 168 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 118 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 94 |

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
| Northern California bass lake<br>2025-10-25 stained all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 dirty all_purpose A | Suspending Jerkbait (honorable_lure, lure, score 194) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 dirty big_fish A | Buzzbait (honorable_lure, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 stained big_fish A | Buzzbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 dirty big_fish A | Buzzbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>calm_surface+low_light_surface+dirty_vibration+warming_search+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 stained all_purpose A | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 stained all_purpose B | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 stained all_purpose B | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+dirty_vibration+warming_search+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 dirty all_purpose A | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 dirty all_purpose B | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 clear all_purpose A | Suspending Jerkbait (honorable_lure, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Southwest desert bass reservoir<br>2025-11-15 dirty big_fish A | Buzzbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Southwest desert bass reservoir<br>2025-11-15 stained big_fish A | Buzzbait (honorable_lure, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 dirty big_fish B | Buzzbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained big_fish A | Buzzbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Jordan Lake / Piedmont reservoir<br>2025-05-08 clear all_purpose A | Soft Plastic Jerkbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 clear all_purpose A | Clouser Minnow (honorable_fly, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 clear all_purpose B | Suspending Jerkbait (lure_of_the_day, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Southwest desert bass reservoir<br>2025-11-15 stained all_purpose A | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Southwest desert bass reservoir<br>2025-11-15 stained all_purpose B | Suspending Jerkbait (honorable_lure, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 1968 | 746 | 38% |
| clear_subtle | 560 | 249 | 44% |
| dirty_vibration | 1440 | 245 | 17% |
| heat_finesse | 480 | 79 | 16% |
| cold_slow | 432 | 214 | 50% |
| low_light_surface | 720 | 258 | 36% |
| calm_surface | 1056 | 352 | 33% |
| Big Fish upside | 1776 | 1441 | 81% |
| All Purpose reliable/versatile | 1776 | 1607 | 90% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Game Changer [fly] (254), Articulated Baitfish Streamer [fly] (202), Baitfish Slider Fly [fly] (200), Clouser Minnow [fly] (173), Deceiver [fly] (173), Compact Flipping Jig [lure] (159), Suspending Jerkbait [lure] (158), Medium-Diving Crankbait [lure] (148), Soft Plastic Jerkbait [lure] (132), Magnum Jerkbait [lure] (120), Articulated Dungeon Streamer [fly] (112), Rabbit-Strip Leech [fly] (100) |
| All-purpose | Clouser Minnow [fly] (171), Baitfish Slider Fly [fly] (148), Suspending Jerkbait [lure] (146), Soft Plastic Jerkbait [lure] (126), Deceiver [fly] (125), Paddle-Tail Swimbait [lure] (81), Popper Fly [fly] (71), Medium-Diving Crankbait [lure] (69) |
| Big-fish | Game Changer [fly] (188), Compact Flipping Jig [lure] (155), Articulated Baitfish Streamer [fly] (151), Magnum Jerkbait [lure] (120), Articulated Dungeon Streamer [fly] (112), Walking Topwater [lure] (90), Rabbit-Strip Leech [fly] (88), Deer Hair Slider [fly] (86) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 29 | 29 | 0 | 0 | 0 |
| fly | 19 | 19 | 0 | 0 | 1 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 254/888 | 28.6% | big_fish:188, all_purpose:66 | A:143, B:111 | honorable:143, top:111 | dirty:92, clear:84, stained:78 | freshwater_lake_pond:243, freshwater_river:11 | wind_reaction:151, dirty_vibration:110, open_water_search:89, warming_search:60 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 202/888 | 22.7% | big_fish:151, all_purpose:51 | A:114, B:88 | honorable:118, top:84 | dirty:82, stained:75, clear:45 | freshwater_lake_pond:191, freshwater_river:11 | wind_reaction:125, dirty_vibration:101, open_water_search:86, warming_search:46 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 200/840 | 23.8% | all_purpose:148, big_fish:52 | B:116, A:84 | top:128, honorable:72 | dirty:79, clear:61, stained:60 | freshwater_lake_pond:188, freshwater_river:12 | wind_reaction:151, dirty_vibration:107, open_water_search:70, low_light_surface:46 |
| Clouser Minnow<br>clouser_minnow | fly | 173/888 | 19.5% | all_purpose:171, big_fish:2 | B:104, A:69 | top:87, honorable:86 | stained:66, clear:60, dirty:47 | freshwater_lake_pond:161, freshwater_river:12 | wind_reaction:94, dirty_vibration:65, open_water_search:50, calm_surface:49 |
| Deceiver<br>deceiver | fly | 173/888 | 19.5% | all_purpose:125, big_fish:48 | B:101, A:72 | top:102, honorable:71 | dirty:66, stained:60, clear:47 | freshwater_lake_pond:168, freshwater_river:5 | wind_reaction:156, dirty_vibration:110, open_water_search:91, warming_search:36 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 159/888 | 17.9% | big_fish:155, all_purpose:4 | A:86, B:73 | honorable:119, top:40 | dirty:67, stained:60, clear:32 | freshwater_lake_pond:147, freshwater_river:12 | wind_reaction:105, dirty_vibration:94, open_water_search:47, warming_search:34 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 158/888 | 17.8% | all_purpose:146, big_fish:12 | B:86, A:72 | top:90, honorable:68 | clear:66, stained:58, dirty:34 | freshwater_lake_pond:152, freshwater_river:6 | wind_reaction:108, dirty_vibration:63, open_water_search:56, calm_surface:35 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 148/888 | 16.7% | big_fish:79, all_purpose:69 | B:88, A:60 | top:91, honorable:57 | dirty:52, stained:50, clear:46 | freshwater_lake_pond:142, freshwater_river:6 | wind_reaction:138, dirty_vibration:97, open_water_search:76, warming_search:43 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 132/840 | 15.7% | all_purpose:126, big_fish:6 | A:74, B:58 | top:67, honorable:65 | clear:58, stained:45, dirty:29 | freshwater_lake_pond:125, freshwater_river:7 | wind_reaction:63, calm_surface:52, dirty_vibration:39, clear_subtle:36 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 120/552 | 21.7% | big_fish:120 | A:94, B:26 | honorable:64, top:56 | clear:45, stained:41, dirty:34 | freshwater_lake_pond:113, freshwater_river:7 | wind_reaction:67, dirty_vibration:48, calm_surface:32, open_water_search:30 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 112/504 | 22.2% | big_fish:112 | B:62, A:50 | top:67, honorable:45 | dirty:39, stained:37, clear:36 | freshwater_lake_pond:112 | wind_reaction:70, dirty_vibration:52, open_water_search:29, warming_search:22 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 100/888 | 11.3% | big_fish:88, all_purpose:12 | A:53, B:47 | honorable:82, top:18 | stained:41, dirty:37, clear:22 | freshwater_lake_pond:88, freshwater_river:12 | wind_reaction:52, dirty_vibration:51, cold_slow:33, heat_finesse:19 |
| Walking Topwater<br>walking_topwater | lure | 91/528 | 17.2% | big_fish:90, all_purpose:1 | A:62, B:29 | top:49, honorable:42 | clear:31, dirty:31, stained:29 | freshwater_lake_pond:85, freshwater_river:6 | calm_surface:67, low_light_surface:43, warming_search:24, wind_reaction:24 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 89/888 | 10% | all_purpose:81, big_fish:8 | B:51, A:38 | top:50, honorable:39 | dirty:39, stained:30, clear:20 | freshwater_lake_pond:85, freshwater_river:4 | wind_reaction:43, warming_search:37, calm_surface:36, open_water_search:33 |
| Deer Hair Slider<br>deer_hair_slider | fly | 86/528 | 16.3% | big_fish:86 | A:52, B:34 | honorable:44, top:42 | clear:31, stained:28, dirty:27 | freshwater_lake_pond:80, freshwater_river:6 | calm_surface:60, low_light_surface:41, wind_reaction:26, warming_search:23 |
| Buzzbait<br>buzzbait | lure | 81/528 | 15.3% | big_fish:77, all_purpose:4 | B:44, A:37 | top:44, honorable:37 | stained:33, dirty:31, clear:17 | freshwater_lake_pond:72, freshwater_river:9 | low_light_surface:47, calm_surface:42, wind_reaction:39, dirty_vibration:34 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 80/840 | 9.5% | all_purpose:69, big_fish:11 | B:42, A:38 | honorable:49, top:31 | clear:44, stained:19, dirty:17 | freshwater_lake_pond:80 | clear_subtle:40, wind_reaction:35, calm_surface:29, dirty_vibration:20 |
| Bluegill Streamer<br>bluegill_streamer | fly | 76/408 | 18.6% | big_fish:75, all_purpose:1 | A:42, B:34 | top:45, honorable:31 | clear:30, stained:29, dirty:17 | freshwater_lake_pond:76 | calm_surface:40, wind_reaction:30, clear_subtle:19, open_water_search:17 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 71/840 | 8.5% | all_purpose:53, big_fish:18 | B:49, A:22 | top:44, honorable:27 | dirty:35, stained:25, clear:11 | freshwater_lake_pond:61, freshwater_river:10 | wind_reaction:50, dirty_vibration:44, low_light_surface:20, calm_surface:13 |
| Popper Fly<br>popper_fly | fly | 71/456 | 15.6% | all_purpose:71 | B:36, A:35 | top:53, honorable:18 | clear:26, stained:24, dirty:21 | freshwater_lake_pond:69, freshwater_river:2 | calm_surface:57, low_light_surface:29, clear_subtle:17, wind_reaction:14 |
| Football Jig<br>football_jig | lure | 69/360 | 19.2% | big_fish:69 | B:36, A:33 | honorable:43, top:26 | clear:29, stained:21, dirty:19 | freshwater_lake_pond:69 | wind_reaction:47, dirty_vibration:28, cold_slow:16, open_water_search:16 |
| Lipless Crankbait<br>lipless_crankbait | lure | 65/888 | 7.3% | big_fish:35, all_purpose:30 | B:41, A:24 | top:35, honorable:30 | dirty:28, stained:25, clear:12 | freshwater_lake_pond:65 | wind_reaction:63, open_water_search:56, dirty_vibration:51, warming_search:14 |
| Wake Bait<br>wake_bait | lure | 65/372 | 17.5% | big_fish:62, all_purpose:3 | A:43, B:22 | top:50, honorable:15 | clear:22, stained:22, dirty:21 | freshwater_lake_pond:65 | calm_surface:54, low_light_surface:25, warming_search:16, clear_subtle:14 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 57/888 | 6.4% | all_purpose:46, big_fish:11 | B:31, A:26 | top:33, honorable:24 | clear:27, stained:18, dirty:12 | freshwater_lake_pond:53, freshwater_river:4 | heat_finesse:33, clear_subtle:22, calm_surface:18, wind_reaction:11 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 56/840 | 6.7% | all_purpose:55, big_fish:1 | B:36, A:20 | top:29, honorable:27 | clear:33, stained:17, dirty:6 | freshwater_lake_pond:56 | calm_surface:26, clear_subtle:26, wind_reaction:15, cold_slow:14 |
| Magnum Worm<br>magnum_worm | lure | 54/336 | 16.1% | big_fish:53, all_purpose:1 | B:29, A:25 | honorable:33, top:21 | clear:22, dirty:16, stained:16 | freshwater_lake_pond:54 | wind_reaction:28, open_water_search:21, calm_surface:19, heat_finesse:19 |
| Spinnerbait<br>spinnerbait | lure | 53/888 | 6% | all_purpose:35, big_fish:18 | B:29, A:24 | honorable:31, top:22 | dirty:32, stained:17, clear:4 | freshwater_lake_pond:44, freshwater_river:9 | dirty_vibration:48, wind_reaction:41, open_water_search:18, warming_search:14 |
| Swim Jig<br>swim_jig | lure | 52/888 | 5.9% | all_purpose:51, big_fish:1 | B:31, A:21 | honorable:27, top:25 | dirty:24, stained:20, clear:8 | freshwater_lake_pond:49, freshwater_river:3 | calm_surface:32, warming_search:28, wind_reaction:12, dirty_vibration:11 |
| Woolly Bugger<br>woolly_bugger | fly | 49/888 | 5.5% | all_purpose:46, big_fish:3 | A:25, B:24 | honorable:35, top:14 | clear:17, stained:17, dirty:15 | freshwater_lake_pond:44, freshwater_river:5 | cold_slow:22, wind_reaction:19, dirty_vibration:17, heat_finesse:12 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 46/288 | 16% | all_purpose:44, big_fish:2 | A:27, B:19 | honorable:25, top:21 | clear:20, dirty:17, stained:9 | freshwater_lake_pond:44, freshwater_river:2 | calm_surface:21, wind_reaction:21, clear_subtle:13, dirty_vibration:11 |
| Tube Jig<br>tube_jig | lure | 44/888 | 5% | all_purpose:37, big_fish:7 | B:28, A:16 | honorable:23, top:21 | clear:28, stained:12, dirty:4 | freshwater_lake_pond:38, freshwater_river:6 | cold_slow:24, wind_reaction:19, clear_subtle:17, calm_surface:9 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 44/276 | 15.9% | all_purpose:44 | B:24, A:20 | top:35, honorable:9 | clear:15, dirty:15, stained:14 | freshwater_lake_pond:39, freshwater_river:5 | calm_surface:36, low_light_surface:14, warming_search:14, clear_subtle:8 |
| Mouse Fly<br>mouse_fly | fly | 39/312 | 12.5% | big_fish:39 | A:20, B:19 | top:21, honorable:18 | clear:15, dirty:13, stained:11 | freshwater_lake_pond:39 | calm_surface:35, low_light_surface:15, clear_subtle:10, warming_search:9 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 35/192 | 18.2% | big_fish:35 | A:20, B:15 | honorable:22, top:13 | clear:12, stained:12, dirty:11 | freshwater_lake_pond:35 | calm_surface:23, low_light_surface:23, wind_reaction:12, warming_search:9 |
| Frog Fly<br>frog_fly | fly | 32/192 | 16.7% | big_fish:32 | A:18, B:14 | honorable:20, top:12 | clear:12, dirty:10, stained:10 | freshwater_lake_pond:32 | low_light_surface:21, calm_surface:20, wind_reaction:12, warming_search:9 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 30/888 | 3.4% | all_purpose:30 | A:21, B:9 | top:16, honorable:14 | clear:25, dirty:3, stained:2 | freshwater_lake_pond:30 | clear_subtle:23, calm_surface:11, heat_finesse:9, wind_reaction:8 |
| Bladed Jig<br>bladed_jig | lure | 26/888 | 2.9% | all_purpose:21, big_fish:5 | A:15, B:11 | honorable:14, top:12 | dirty:15, stained:11 | freshwater_lake_pond:26 | dirty_vibration:25, wind_reaction:21, open_water_search:9, cold_slow:6 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 26/840 | 3.1% | all_purpose:16, big_fish:10 | B:15, A:11 | top:16, honorable:10 | clear:17, stained:5, dirty:4 | freshwater_lake_pond:24, freshwater_river:2 | clear_subtle:13, wind_reaction:12, calm_surface:11, cold_slow:7 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 20/204 | 9.8% | all_purpose:20 | A:13, B:7 | top:12, honorable:8 | clear:8, stained:7, dirty:5 | freshwater_lake_pond:15, freshwater_river:5 | wind_reaction:15, dirty_vibration:11, cold_slow:8, clear_subtle:4 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 19/888 | 2.1% | all_purpose:19 | A:11, B:8 | honorable:13, top:6 | stained:9, clear:7, dirty:3 | freshwater_lake_pond:16, freshwater_river:3 | cold_slow:13, wind_reaction:10, dirty_vibration:7, heat_finesse:3 |
| Blade Bait<br>blade_bait | lure | 18/888 | 2% | all_purpose:18 | A:13, B:5 | top:10, honorable:8 | dirty:9, stained:5, clear:4 | freshwater_lake_pond:18 | open_water_search:11, wind_reaction:11, dirty_vibration:8, cold_slow:6 |
| Feather Jig Leech<br>feather_jig_leech | fly | 16/888 | 1.8% | all_purpose:15, big_fish:1 | A:8, B:8 | honorable:12, top:4 | clear:7, stained:5, dirty:4 | freshwater_lake_pond:9, freshwater_river:7 | warming_search:15, current_swing:7, calm_surface:6, dirty_vibration:6 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 16/840 | 1.9% | all_purpose:13, big_fish:3 | A:9, B:7 | honorable:8, top:8 | dirty:10, clear:4, stained:2 | freshwater_lake_pond:16 | wind_reaction:7, dirty_vibration:6, open_water_search:6, cold_slow:5 |
| Ned Rig<br>ned_rig | lure | 14/396 | 3.5% | all_purpose:13, big_fish:1 | B:9, A:5 | honorable:8, top:6 | clear:8, dirty:5, stained:1 | freshwater_lake_pond:13, freshwater_river:1 | heat_finesse:7, cold_slow:6, wind_reaction:6, clear_subtle:4 |
| Finesse Jig<br>finesse_jig | lure | 12/396 | 3% | all_purpose:12 | B:7, A:5 | honorable:9, top:3 | clear:8, stained:3, dirty:1 | freshwater_lake_pond:11, freshwater_river:1 | heat_finesse:6, clear_subtle:5, cold_slow:5, wind_reaction:4 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9/396 | 2.3% | all_purpose:9 | B:7, A:2 | honorable:6, top:3 | clear:4, dirty:3, stained:2 | freshwater_lake_pond:8, freshwater_river:1 | cold_slow:5, clear_subtle:4, heat_finesse:4, wind_reaction:3 |
| Glide Bait<br>glidebait | lure | 9/36 | 25% | big_fish:9 | B:6, A:3 | honorable:6, top:3 | clear:3, dirty:3, stained:3 | freshwater_lake_pond:9 | cold_slow:6, dirty_vibration:4, calm_surface:3, wind_reaction:3 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/48 | 2.1% | big_fish:1 | A:1 | honorable:1 | clear:1 | freshwater_lake_pond:1 | clear_subtle:1, cold_slow:1 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 254/3552 (7.2%) | 111/1776 (6.3%) | 143/1776 (8.1%) | - | 254/1776 (14.3%) |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 202/3552 (5.7%) | 84/1776 (4.7%) | 118/1776 (6.6%) | - | 202/1776 (11.4%) |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 200/3552 (5.6%) | 128/1776 (7.2%) | 72/1776 (4.1%) | - | 200/1776 (11.3%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 173/3552 (4.9%) | 87/1776 (4.9%) | 86/1776 (4.8%) | - | 173/1776 (9.7%) |  |
| Deceiver<br>deceiver | fly | 173/3552 (4.9%) | 102/1776 (5.7%) | 71/1776 (4%) | - | 173/1776 (9.7%) |  |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 159/3552 (4.5%) | 40/1776 (2.3%) | 119/1776 (6.7%) | 159/1776 (9%) | - |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 158/3552 (4.4%) | 90/1776 (5.1%) | 68/1776 (3.8%) | 158/1776 (8.9%) | - |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 148/3552 (4.2%) | 91/1776 (5.1%) | 57/1776 (3.2%) | 148/1776 (8.3%) | - |  |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 132/3552 (3.7%) | 67/1776 (3.8%) | 65/1776 (3.7%) | 132/1776 (7.4%) | - |  |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 120/3552 (3.4%) | 56/1776 (3.2%) | 64/1776 (3.6%) | 120/1776 (6.8%) | - |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 112/3552 (3.2%) | 67/1776 (3.8%) | 45/1776 (2.5%) | - | 112/1776 (6.3%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 100/3552 (2.8%) | 18/1776 (1%) | 82/1776 (4.6%) | - | 100/1776 (5.6%) |  |
| Walking Topwater<br>walking_topwater | lure | 91/3552 (2.6%) | 49/1776 (2.8%) | 42/1776 (2.4%) | 91/1776 (5.1%) | - |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 89/3552 (2.5%) | 50/1776 (2.8%) | 39/1776 (2.2%) | 89/1776 (5%) | - |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 86/3552 (2.4%) | 42/1776 (2.4%) | 44/1776 (2.5%) | - | 86/1776 (4.8%) |  |
| Buzzbait<br>buzzbait | lure | 81/3552 (2.3%) | 44/1776 (2.5%) | 37/1776 (2.1%) | 81/1776 (4.6%) | - |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 80/3552 (2.3%) | 31/1776 (1.7%) | 49/1776 (2.8%) | - | 80/1776 (4.5%) |  |
| Bluegill Streamer<br>bluegill_streamer | fly | 76/3552 (2.1%) | 45/1776 (2.5%) | 31/1776 (1.7%) | - | 76/1776 (4.3%) |  |
| Popper Fly<br>popper_fly | fly | 71/3552 (2%) | 53/1776 (3%) | 18/1776 (1%) | - | 71/1776 (4%) |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 71/3552 (2%) | 44/1776 (2.5%) | 27/1776 (1.5%) | 71/1776 (4%) | - |  |
| Football Jig<br>football_jig | lure | 69/3552 (1.9%) | 26/1776 (1.5%) | 43/1776 (2.4%) | 69/1776 (3.9%) | - |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 65/3552 (1.8%) | 35/1776 (2%) | 30/1776 (1.7%) | 65/1776 (3.7%) | - |  |
| Wake Bait<br>wake_bait | lure | 65/3552 (1.8%) | 50/1776 (2.8%) | 15/1776 (0.8%) | 65/1776 (3.7%) | - |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 57/3552 (1.6%) | 33/1776 (1.9%) | 24/1776 (1.4%) | 57/1776 (3.2%) | - |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 56/3552 (1.6%) | 29/1776 (1.6%) | 27/1776 (1.5%) | 56/1776 (3.2%) | - |  |
| Magnum Worm<br>magnum_worm | lure | 54/3552 (1.5%) | 21/1776 (1.2%) | 33/1776 (1.9%) | 54/1776 (3%) | - |  |
| Spinnerbait<br>spinnerbait | lure | 53/3552 (1.5%) | 22/1776 (1.2%) | 31/1776 (1.7%) | 53/1776 (3%) | - |  |
| Swim Jig<br>swim_jig | lure | 52/3552 (1.5%) | 25/1776 (1.4%) | 27/1776 (1.5%) | 52/1776 (2.9%) | - |  |
| Woolly Bugger<br>woolly_bugger | fly | 49/3552 (1.4%) | 14/1776 (0.8%) | 35/1776 (2%) | - | 49/1776 (2.8%) |  |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 46/3552 (1.3%) | 21/1776 (1.2%) | 25/1776 (1.4%) | 46/1776 (2.6%) | - |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 44/3552 (1.2%) | 35/1776 (2%) | 9/1776 (0.5%) | - | 44/1776 (2.5%) |  |
| Tube Jig<br>tube_jig | lure | 44/3552 (1.2%) | 21/1776 (1.2%) | 23/1776 (1.3%) | 44/1776 (2.5%) | - |  |
| Mouse Fly<br>mouse_fly | fly | 39/3552 (1.1%) | 21/1776 (1.2%) | 18/1776 (1%) | - | 39/1776 (2.2%) |  |
| Hollow-Body Frog<br>hollow_body_frog | lure | 35/3552 (1%) | 13/1776 (0.7%) | 22/1776 (1.2%) | 35/1776 (2%) | - |  |
| Frog Fly<br>frog_fly | fly | 32/3552 (0.9%) | 12/1776 (0.7%) | 20/1776 (1.1%) | - | 32/1776 (1.8%) |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 30/3552 (0.8%) | 16/1776 (0.9%) | 14/1776 (0.8%) | - | 30/1776 (1.7%) |  |
| Bladed Jig<br>bladed_jig | lure | 26/3552 (0.7%) | 12/1776 (0.7%) | 14/1776 (0.8%) | 26/1776 (1.5%) | - |  |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 26/3552 (0.7%) | 16/1776 (0.9%) | 10/1776 (0.6%) | 26/1776 (1.5%) | - |  |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 20/3552 (0.6%) | 12/1776 (0.7%) | 8/1776 (0.5%) | - | 20/1776 (1.1%) |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 19/3552 (0.5%) | 6/1776 (0.3%) | 13/1776 (0.7%) | - | 19/1776 (1.1%) |  |
| Blade Bait<br>blade_bait | lure | 18/3552 (0.5%) | 10/1776 (0.6%) | 8/1776 (0.5%) | 18/1776 (1%) | - |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 16/3552 (0.5%) | 4/1776 (0.2%) | 12/1776 (0.7%) | - | 16/1776 (0.9%) |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 16/3552 (0.5%) | 8/1776 (0.5%) | 8/1776 (0.5%) | 16/1776 (0.9%) | - |  |
| Ned Rig<br>ned_rig | lure | 14/3552 (0.4%) | 6/1776 (0.3%) | 8/1776 (0.5%) | 14/1776 (0.8%) | - |  |
| Finesse Jig<br>finesse_jig | lure | 12/3552 (0.3%) | 3/1776 (0.2%) | 9/1776 (0.5%) | 12/1776 (0.7%) | - |  |
| Glide Bait<br>glidebait | lure | 9/3552 (0.3%) | 3/1776 (0.2%) | 6/1776 (0.3%) | 9/1776 (0.5%) | - |  |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9/3552 (0.3%) | 3/1776 (0.2%) | 6/1776 (0.3%) | 9/1776 (0.5%) | - |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/3552 (0%) | 0/1776 (0%) | 1/1776 (0.1%) | 1/1776 (0.1%) | - |  |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 254/888 | 28.6% | big_fish:188, all_purpose:66 | wind_reaction:151, dirty_vibration:110, open_water_search:89, warming_search:60, calm_surface:58 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | home-window >30% severe | 52/168 | 31% | goal_tags:53 | AP/BF 16/84, 36/84<br>clarity clear:112, dirty:28, stained:28<br>bucket warming_search:68, stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:28 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | home-window >25% overdominant | 34/132 | 25.8% | goal_tags:38 | AP/BF 29/66, 5/66<br>clarity clear:132<br>bucket calm_bright_clear_subtle:40, stable_pleasant_medium_confidence_archive:32, heat_limited_finesse:24 |
| Football Jig<br>football_jig | lure | home-window >25% overdominant | 22/86 | 25.6% | goal_tags:42 | AP/BF 0/38, 22/48<br>clarity clear:68, stained:18<br>bucket cold_slow_or_front:48, calm_bright_clear_subtle:12, heat_limited_finesse:12 |
| Wake Bait<br>wake_bait | lure | home-window >25% overdominant | 64/252 | 25.4% | goal_tags:117 | AP/BF 3/126, 61/126<br>clarity clear:84, dirty:84, stained:84<br>bucket stable_pleasant_medium_confidence_archive:72, calm_low_light_surface:60, heat_limited_finesse:32 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | home-window >20% watch | 39/156 | 25% | goal_tags:89 | AP/BF 33/78, 6/78<br>clarity clear:100, dirty:28, stained:28<br>bucket warming_search:64, stable_pleasant_medium_confidence_archive:32, calm_low_light_surface:28 |
| Walking Topwater<br>walking_topwater | lure | home-window >20% watch | 74/300 | 24.7% | goal_tags:141 | AP/BF 1/150, 73/150<br>clarity clear:100, dirty:100, stained:100<br>bucket stable_pleasant_medium_confidence_archive:76, calm_low_light_surface:72, warming_search:44 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | home-window >20% watch | 100/408 | 24.5% | goal_tags:197 | AP/BF 48/204, 52/204<br>clarity dirty:204, stained:204<br>bucket dirty_vibration:176, breezy_windy_stained_reaction:164, warming_search:28 |
| Hollow-Body Frog<br>hollow_body_frog | lure | home-window >20% watch | 23/96 | 24% | goal_tags:46 | AP/BF 0/48, 23/48<br>clarity clear:32, dirty:32, stained:32<br>bucket calm_low_light_surface:48, warming_search:16, heat_limited_finesse:12 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | home-window >20% watch | 39/168 | 23.2% | goal_tags:58 | AP/BF 7/84, 32/84<br>clarity clear:112, dirty:28, stained:28<br>bucket warming_search:68, stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:28 |
| Deer Hair Slider<br>deer_hair_slider | fly | home-window >20% watch | 69/300 | 23% | goal_tags:165 | AP/BF 0/150, 69/150<br>clarity clear:100, dirty:100, stained:100<br>bucket stable_pleasant_medium_confidence_archive:76, calm_low_light_surface:72, warming_search:44 |
| Foam Gurgler<br>foam_gurgler_fly | fly | home-window >20% watch | 44/192 | 22.9% | goal_tags:92 | AP/BF 44/96, 0/96<br>clarity clear:64, dirty:64, stained:64<br>bucket stable_pleasant_medium_confidence_archive:72, warming_search:28, calm_low_light_surface:24 |
| Bluegill Streamer<br>bluegill_streamer | fly | home-window >20% watch | 22/96 | 22.9% | goal_tags:48 | AP/BF 1/48, 21/48<br>clarity clear:56, dirty:20, stained:20<br>bucket warming_search:32, calm_low_light_surface:24, stable_pleasant_medium_confidence_archive:24 |
| Clouser Minnow<br>clouser_minnow | fly | home-window >20% watch | 37/168 | 22% | goal_tags:74 | AP/BF 37/84, 0/84<br>clarity clear:112, dirty:28, stained:28<br>bucket warming_search:68, stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:28 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | home-window >20% watch | 21/98 | 21.4% | goal_tags:49 | AP/BF 0/44, 21/54<br>clarity clear:80, stained:18<br>bucket cold_slow_or_front:52, calm_bright_clear_subtle:12, heat_limited_finesse:12 |
| Popper Fly<br>popper_fly | fly | home-window >20% watch | 56/264 | 21.2% | goal_tags:127 | AP/BF 56/132, 0/132<br>clarity clear:88, dirty:88, stained:88<br>bucket stable_pleasant_medium_confidence_archive:76, calm_low_light_surface:60, heat_limited_finesse:32 |
| Frog Fly<br>frog_fly | fly | home-window >20% watch | 20/96 | 20.8% | goal_tags:48 | AP/BF 0/48, 20/48<br>clarity clear:32, dirty:32, stained:32<br>bucket calm_low_light_surface:48, warming_search:16, heat_limited_finesse:12 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 254/3552 (7.2%) | 111/1776 (6.3%) | 143/1776 (8.1%) | 254/1776 (14.3%) | 52/168 (31%) | 21/168 (12.5%) / 31/168 (18.5%) | home>20%<br>home>25%<br>home>30% |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 132/3552 (3.7%) | 67/1776 (3.8%) | 65/1776 (3.7%) | 132/1776 (7.4%) | 34/132 (25.8%) | 24/132 (18.2%) / 10/132 (7.6%) | home>20%<br>home>25% |
| Football Jig<br>football_jig | lure | 69/3552 (1.9%) | 26/1776 (1.5%) | 43/1776 (2.4%) | 69/1776 (3.9%) | 22/86 (25.6%) | 10/86 (11.6%) / 12/86 (14%) | home>20%<br>home>25% |
| Wake Bait<br>wake_bait | lure | 65/3552 (1.8%) | 50/1776 (2.8%) | 15/1776 (0.8%) | 65/1776 (3.7%) | 64/252 (25.4%) | 50/252 (19.8%) / 14/252 (5.6%) | home>20%<br>home>25% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 200/3552 (5.6%) | 128/1776 (7.2%) | 72/1776 (4.1%) | 200/1776 (11.3%) | 39/156 (25%) | 20/156 (12.8%) / 19/156 (12.2%) | home>20% |
| Walking Topwater<br>walking_topwater | lure | 91/3552 (2.6%) | 49/1776 (2.8%) | 42/1776 (2.4%) | 91/1776 (5.1%) | 74/300 (24.7%) | 42/300 (14%) / 32/300 (10.7%) | home>20% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 148/3552 (4.2%) | 91/1776 (5.1%) | 57/1776 (3.2%) | 148/1776 (8.3%) | 100/408 (24.5%) | 62/408 (15.2%) / 38/408 (9.3%) | home>20% |
| Hollow-Body Frog<br>hollow_body_frog | lure | 35/3552 (1%) | 13/1776 (0.7%) | 22/1776 (1.2%) | 35/1776 (2%) | 23/96 (24%) | 8/96 (8.3%) / 15/96 (15.6%) | home>20% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 202/3552 (5.7%) | 84/1776 (4.7%) | 118/1776 (6.6%) | 202/1776 (11.4%) | 39/168 (23.2%) | 17/168 (10.1%) / 22/168 (13.1%) | home>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 86/3552 (2.4%) | 42/1776 (2.4%) | 44/1776 (2.5%) | 86/1776 (4.8%) | 69/300 (23%) | 34/300 (11.3%) / 35/300 (11.7%) | home>20% |
| Bluegill Streamer<br>bluegill_streamer | fly | 76/3552 (2.1%) | 45/1776 (2.5%) | 31/1776 (1.7%) | 76/1776 (4.3%) | 22/96 (22.9%) | 12/96 (12.5%) / 10/96 (10.4%) | home>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 44/3552 (1.2%) | 35/1776 (2%) | 9/1776 (0.5%) | 44/1776 (2.5%) | 44/192 (22.9%) | 35/192 (18.2%) / 9/192 (4.7%) | home>20% |
| Clouser Minnow<br>clouser_minnow | fly | 173/3552 (4.9%) | 87/1776 (4.9%) | 86/1776 (4.8%) | 173/1776 (9.7%) | 37/168 (22%) | 26/168 (15.5%) / 11/168 (6.5%) | home>20% |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 159/3552 (4.5%) | 40/1776 (2.3%) | 119/1776 (6.7%) | 159/1776 (9%) | 21/98 (21.4%) | 4/98 (4.1%) / 17/98 (17.3%) | home>20% |
| Popper Fly<br>popper_fly | fly | 71/3552 (2%) | 53/1776 (3%) | 18/1776 (1%) | 71/1776 (4%) | 56/264 (21.2%) | 41/264 (15.5%) / 15/264 (5.7%) | home>20% |
| Frog Fly<br>frog_fly | fly | 32/3552 (0.9%) | 12/1776 (0.7%) | 20/1776 (1.1%) | 32/1776 (1.8%) | 20/96 (20.8%) | 5/96 (5.2%) / 15/96 (15.6%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.40.
Average expanded finalist pool size: 3.65.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 1331.
Rows/slots with expanded finalist pool size 1: 507.
Selected-tier singleton slots expanded above 1: 824.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.12 | 3.49 | 1 | 1 | 371 | 137 |
| fly/top | 2.30 | 3.34 | 1 | 1 | 302 | 127 |
| lure/honorable | 2.83 | 3.91 | 1 | 1 | 286 | 95 |
| lure/top | 2.36 | 3.87 | 1 | 1 | 372 | 148 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1892 |
| goal_or_priority_condition | 1589 |
| credible_fallback | 71 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 2863 |
| goal_and_priority_condition | 1892 |
| credible_fallback | 378 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 231 |
| family_diversity_scarcity | 184 |
| surface_safety_scarcity | 92 |

Representative expanded singleton finalist pools:
- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__all_purpose__B fly/top: unweighted_baitfish_streamer (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B lure/top: flat_sided_crankbait (goal_or_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B lure/honorable: suspending_jerkbait (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B fly/honorable: unweighted_baitfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__all_purpose__B lure/top: squarebill_crankbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__big_fish__B fly/top: baitfish_slider_fly (credible_fallback; hard_gated_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__all_purpose__B fly/honorable: unweighted_baitfish_streamer (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__big_fish__B lure/honorable: glidebait (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__big_fish__B fly/honorable: unweighted_baitfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__all_purpose__B fly/top: popper_fly (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__clear__all_purpose__B fly/honorable: popper_fly (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__clear__big_fish__B lure/top: wake_bait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__stained__all_purpose__B fly/top: baitfish_slider_fly (goal_or_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__stained__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__stained__big_fish__B lure/top: wake_bait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__stained__big_fish__B lure/honorable: hollow_body_frog (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__dirty__all_purpose__B fly/top: baitfish_slider_fly (goal_or_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__dirty__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 4.36 |
| Different-presentation close candidates | 1.64 |
| Different-family close candidates | 2.42 |
| Final expanded Set B pool | 2.31 |
| Same-family/same-presentation reintroduced | 58/1776 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 360 |
| Coverage pool used | 138 |
| Average used coverage pool size | 4.30 |
| Singleton used coverage pools | 1 |
| Broad pool larger than narrowed pool | 66 |
| Broad pool same as narrowed pool | 72 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 19 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 222 |
| broad | 138 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| spinnerbait | 106 |
| bladed_jig | 94 |
| medium_diving_crankbait | 89 |
| squarebill_crankbait | 87 |
| lipless_crankbait | 82 |
| suspending_jerkbait | 72 |
| compact_flipping_jig | 43 |
| buzzbait | 21 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| compact_flipping_jig | 37 |
| spinnerbait | 22 |
| medium_diving_crankbait | 18 |
| suspending_jerkbait | 14 |
| squarebill_crankbait | 12 |
| bladed_jig | 9 |
| lipless_crankbait | 9 |
| buzzbait | 7 |
| magnum_jerkbait | 5 |
| hollow_body_frog | 2 |
| magnum_worm | 2 |
| football_jig | 1 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

- fl_okeechobee__2025-08-18__freshwater_lake_pond__stained__all_purpose__A: Spinnerbait; pool lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- fl_okeechobee__2025-08-18__freshwater_lake_pond__dirty__all_purpose__A: Lipless Crankbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- fl_okeechobee__2025-08-18__freshwater_lake_pond__dirty__all_purpose__B: Spinnerbait; pool bladed_jig, medium_diving_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__all_purpose__B: Spinnerbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, suspending_jerkbait
- tx_lake_fork__2025-06-15__freshwater_lake_pond__dirty__all_purpose__A: Lipless Crankbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- al_guntersville__2025-06-07__freshwater_lake_pond__stained__all_purpose__A: Spinnerbait; pool lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- sc_santee_cooper__2025-04-05__freshwater_lake_pond__dirty__all_purpose__A: Spinnerbait; pool buzzbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__dirty__all_purpose__A: Spinnerbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- mn_minnetonka__2025-03-20__freshwater_lake_pond__dirty__all_purpose__B: Spinnerbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, suspending_jerkbait
- mn_minnetonka__2025-05-15__freshwater_lake_pond__dirty__all_purpose__B: Spinnerbait; pool bladed_jig, lipless_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait

## Surface Safety Expansion Check

| Surface gate | Slots checked | Surface finalist IDs |
| --- | --- | --- |
| closed | 1440 | 0 |
| caution | 624 | 6 |

Caution-gate surface finalist examples:
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__B lure/honorable: buzzbait
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__big_fish__B lure/honorable: buzzbait
- al_guntersville__2025-04-11__freshwater_lake_pond__stained__big_fish__B lure/honorable: buzzbait
- il_fox_chain__2025-06-14__freshwater_lake_pond__clear__big_fish__B lure/honorable: wake_bait
- co_pueblo__2025-06-22__freshwater_lake_pond__stained__big_fish__B lure/honorable: buzzbait
- co_pueblo__2025-06-22__freshwater_lake_pond__dirty__big_fish__B lure/honorable: buzzbait

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
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 202/888 | 39/168 | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 112/504 | 0/0 | goal_tags>1 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 200/840 | 39/156 | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20% |
| Bluegill Streamer<br>bluegill_streamer | fly | 7 | 76/408 | 22/96 | home-window share>20% |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 173/888 | 37/168 | goal_tags>1<br>home-window share>20% |
| Deceiver<br>deceiver | fly | 7 | 173/888 | 33/168 | clear+stained+dirty clarity |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 86/528 | 69/300 | clear+stained+dirty clarity<br>home-window share>20% |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 16/888 | 0/0 | clear+stained+dirty clarity |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 44/276 | 44/192 | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Frog Fly<br>frog_fly | fly | 9 | 32/192 | 20/96 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Game Changer<br>game_changer | fly | 7 | 254/888 | 52/168 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 19/888 | 0/0 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 30/888 | 0/0 | clear+stained+dirty clarity |
| Mouse Fly<br>mouse_fly | fly | 7 | 39/312 | 0/0 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Popper Fly<br>popper_fly | fly | 8 | 71/456 | 56/264 | goal_tags>1<br>home-window share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 100/888 | 42/260 | goal_tags>1<br>reliable_action+big_fish_upside |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 20/204 | 12/68 | clear+stained+dirty clarity |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 49/888 | 29/236 | clear+stained+dirty clarity |
| Blade Bait<br>blade_bait | lure | 7 | 18/888 | 0/0 | clear+stained+dirty clarity |
| Buzzbait<br>buzzbait | lure | 9 | 81/528 | 59/300 | goal_tags>1<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 56/840 | 40/256 | goal_tags>1 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 7 | 159/888 | 21/98 | home-window share>20% |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 16/840 | 9/376 | clear+stained+dirty clarity |
| Football Jig<br>football_jig | lure | 7 | 69/360 | 22/86 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Glide Bait<br>glidebait | lure | 9 | 9/36 | 0/0 | goal_tags>1 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 9 | 35/192 | 23/96 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Magnum Worm<br>magnum_worm | lure | 7 | 54/336 | 0/0 | clear+stained+dirty clarity |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 148/888 | 100/408 | clear+stained+dirty clarity<br>home-window share>20% |
| Ned Rig<br>ned_rig | lure | 9 | 14/396 | 8/124 | clear+stained+dirty clarity |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 89/888 | 30/168 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 1/48 | 1/8 | clear+stained+dirty clarity |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 132/840 | 34/132 | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant |
| Spinnerbait<br>spinnerbait | lure | 7 | 53/888 | 48/408 | wind+dirty+stained/dirty clarity |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 71/840 | 45/384 | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 158/888 | 42/224 | goal_tags>1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 9/396 | 5/88 | condition_tags>3<br>clear+stained+dirty clarity |
| Wake Bait<br>wake_bait | lure | 9 | 65/372 | 64/252 | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20%<br>home-window share>25% overdominant |
| Walking Topwater<br>walking_topwater | lure | 8 | 91/528 | 74/300 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 46/288 | 12/52 | clear+stained+dirty clarity<br>goal_tags>1 |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 7 | 254/888 (28.6%) | 52/168 (31%) | big_fish:188, all_purpose:66 | honorable:143, top:111 | wind_reaction:151, dirty_vibration:110, open_water_search:89, warming_search:60, calm_surface:58 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 202/888 (22.7%) | 39/168 (23.2%) | big_fish:151, all_purpose:51 | honorable:118, top:84 | wind_reaction:125, dirty_vibration:101, open_water_search:86, warming_search:46, calm_surface:40 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 200/840 (23.8%) | 39/156 (25%) | all_purpose:148, big_fish:52 | top:128, honorable:72 | wind_reaction:151, dirty_vibration:107, open_water_search:70, low_light_surface:46, warming_search:43 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 173/888 (19.5%) | 37/168 (22%) | all_purpose:171, big_fish:2 | top:87, honorable:86 | wind_reaction:94, dirty_vibration:65, open_water_search:50, calm_surface:49, warming_search:45 |
| Deceiver<br>deceiver | fly | 7 | 173/888 (19.5%) | 33/168 (19.6%) | all_purpose:125, big_fish:48 | top:102, honorable:71 | wind_reaction:156, dirty_vibration:110, open_water_search:91, warming_search:36, low_light_surface:25 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 7 | 159/888 (17.9%) | 21/98 (21.4%) | big_fish:155, all_purpose:4 | honorable:119, top:40 | wind_reaction:105, dirty_vibration:94, open_water_search:47, warming_search:34, cold_slow:23 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 158/888 (17.8%) | 42/224 (18.8%) | all_purpose:146, big_fish:12 | top:90, honorable:68 | wind_reaction:108, dirty_vibration:63, open_water_search:56, calm_surface:35, warming_search:35 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 148/888 (16.7%) | 100/408 (24.5%) | big_fish:79, all_purpose:69 | top:91, honorable:57 | wind_reaction:138, dirty_vibration:97, open_water_search:76, warming_search:43, low_light_surface:16 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 132/840 (15.7%) | 34/132 (25.8%) | all_purpose:126, big_fish:6 | top:67, honorable:65 | wind_reaction:63, calm_surface:52, dirty_vibration:39, clear_subtle:36, open_water_search:35 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 7 | 120/552 (21.7%) | 0/0 | big_fish:120 | honorable:64, top:56 | wind_reaction:67, dirty_vibration:48, calm_surface:32, open_water_search:30, warming_search:26 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 112/504 (22.2%) | 0/0 | big_fish:112 | top:67, honorable:45 | wind_reaction:70, dirty_vibration:52, open_water_search:29, warming_search:22, cold_slow:21 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 100/888 (11.3%) | 42/260 (16.2%) | big_fish:88, all_purpose:12 | honorable:82, top:18 | wind_reaction:52, dirty_vibration:51, cold_slow:33, heat_finesse:19, warming_search:18 |
| Walking Topwater<br>walking_topwater | lure | 8 | 91/528 (17.2%) | 74/300 (24.7%) | big_fish:90, all_purpose:1 | top:49, honorable:42 | calm_surface:67, low_light_surface:43, warming_search:24, wind_reaction:24, clear_subtle:17 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 89/888 (10%) | 30/168 (17.9%) | all_purpose:81, big_fish:8 | top:50, honorable:39 | wind_reaction:43, warming_search:37, calm_surface:36, open_water_search:33, dirty_vibration:31 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 86/528 (16.3%) | 69/300 (23%) | big_fish:86 | honorable:44, top:42 | calm_surface:60, low_light_surface:41, wind_reaction:26, warming_search:23, dirty_vibration:19 |
| Buzzbait<br>buzzbait | lure | 9 | 81/528 (15.3%) | 59/300 (19.7%) | big_fish:77, all_purpose:4 | top:44, honorable:37 | low_light_surface:47, calm_surface:42, wind_reaction:39, dirty_vibration:34, warming_search:22 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 80/840 (9.5%) | 13/156 (8.3%) | all_purpose:69, big_fish:11 | honorable:49, top:31 | clear_subtle:40, wind_reaction:35, calm_surface:29, dirty_vibration:20, heat_finesse:17 |
| Bluegill Streamer<br>bluegill_streamer | fly | 7 | 76/408 (18.6%) | 22/96 (22.9%) | big_fish:75, all_purpose:1 | top:45, honorable:31 | calm_surface:40, wind_reaction:30, clear_subtle:19, open_water_search:17, dirty_vibration:16 |
| Popper Fly<br>popper_fly | fly | 8 | 71/456 (15.6%) | 56/264 (21.2%) | all_purpose:71 | top:53, honorable:18 | calm_surface:57, low_light_surface:29, clear_subtle:17, wind_reaction:14, warming_search:13 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 71/840 (8.5%) | 45/384 (11.7%) | all_purpose:53, big_fish:18 | top:44, honorable:27 | wind_reaction:50, dirty_vibration:44, low_light_surface:20, calm_surface:13, cold_slow:11 |
| Football Jig<br>football_jig | lure | 7 | 69/360 (19.2%) | 22/86 (25.6%) | big_fish:69 | honorable:43, top:26 | wind_reaction:47, dirty_vibration:28, cold_slow:16, open_water_search:16, warming_search:16 |
| Wake Bait<br>wake_bait | lure | 9 | 65/372 (17.5%) | 64/252 (25.4%) | big_fish:62, all_purpose:3 | top:50, honorable:15 | calm_surface:54, low_light_surface:25, warming_search:16, clear_subtle:14, wind_reaction:11 |
| Lipless Crankbait<br>lipless_crankbait | lure | 5 | 65/888 (7.3%) | 51/408 (12.5%) | big_fish:35, all_purpose:30 | top:35, honorable:30 | wind_reaction:63, open_water_search:56, dirty_vibration:51, warming_search:14, low_light_surface:8 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 57/888 (6.4%) | 23/136 (16.9%) | all_purpose:46, big_fish:11 | top:33, honorable:24 | heat_finesse:33, clear_subtle:22, calm_surface:18, wind_reaction:11, warming_search:7 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 56/840 (6.7%) | 40/256 (15.6%) | all_purpose:55, big_fish:1 | top:29, honorable:27 | calm_surface:26, clear_subtle:26, wind_reaction:15, cold_slow:14, heat_finesse:11 |
| Magnum Worm<br>magnum_worm | lure | 7 | 54/336 (16.1%) | 0/0 | big_fish:53, all_purpose:1 | honorable:33, top:21 | wind_reaction:28, open_water_search:21, calm_surface:19, heat_finesse:19, dirty_vibration:18 |
| Spinnerbait<br>spinnerbait | lure | 7 | 53/888 (6%) | 48/408 (11.8%) | all_purpose:35, big_fish:18 | honorable:31, top:22 | dirty_vibration:48, wind_reaction:41, open_water_search:18, warming_search:14, low_light_surface:11 |
| Swim Jig<br>swim_jig | lure | 7 | 52/888 (5.9%) | 32/544 (5.9%) | all_purpose:51, big_fish:1 | honorable:27, top:25 | calm_surface:32, warming_search:28, wind_reaction:12, dirty_vibration:11, low_light_surface:10 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 49/888 (5.5%) | 29/236 (12.3%) | all_purpose:46, big_fish:3 | honorable:35, top:14 | cold_slow:22, wind_reaction:19, dirty_vibration:17, heat_finesse:12, clear_subtle:9 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 46/288 (16%) | 12/52 (23.1%) | all_purpose:44, big_fish:2 | honorable:25, top:21 | calm_surface:21, wind_reaction:21, clear_subtle:13, dirty_vibration:11, heat_finesse:10 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 44/276 (15.9%) | 44/192 (22.9%) | all_purpose:44 | top:35, honorable:9 | calm_surface:36, low_light_surface:14, warming_search:14, clear_subtle:8, wind_reaction:8 |
| Tube Jig<br>tube_jig | lure | 7 | 44/888 (5%) | 0/0 | all_purpose:37, big_fish:7 | honorable:23, top:21 | cold_slow:24, wind_reaction:19, clear_subtle:17, calm_surface:9, dirty_vibration:8 |
| Mouse Fly<br>mouse_fly | fly | 7 | 39/312 (12.5%) | 0/0 | big_fish:39 | top:21, honorable:18 | calm_surface:35, low_light_surface:15, clear_subtle:10, warming_search:9, heat_finesse:8 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 9 | 35/192 (18.2%) | 23/96 (24%) | big_fish:35 | honorable:22, top:13 | calm_surface:23, low_light_surface:23, wind_reaction:12, warming_search:9, dirty_vibration:8 |
| Frog Fly<br>frog_fly | fly | 9 | 32/192 (16.7%) | 20/96 (20.8%) | big_fish:32 | honorable:20, top:12 | low_light_surface:21, calm_surface:20, wind_reaction:12, warming_search:9, dirty_vibration:8 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 30/888 (3.4%) | 0/0 | all_purpose:30 | top:16, honorable:14 | clear_subtle:23, calm_surface:11, heat_finesse:9, wind_reaction:8, cold_slow:7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 6 | 26/840 (3.1%) | 5/384 (1.3%) | all_purpose:16, big_fish:10 | top:16, honorable:10 | clear_subtle:13, wind_reaction:12, calm_surface:11, cold_slow:7, dirty_vibration:5 |
| Bladed Jig<br>bladed_jig | lure | 5 | 26/888 (2.9%) | 25/360 (6.9%) | all_purpose:21, big_fish:5 | honorable:14, top:12 | dirty_vibration:25, wind_reaction:21, open_water_search:9, cold_slow:6, low_light_surface:4 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 20/204 (9.8%) | 12/68 (17.6%) | all_purpose:20 | top:12, honorable:8 | wind_reaction:15, dirty_vibration:11, cold_slow:8, clear_subtle:4, heat_finesse:4 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 19/888 (2.1%) | 0/0 | all_purpose:19 | honorable:13, top:6 | cold_slow:13, wind_reaction:10, dirty_vibration:7, heat_finesse:3, open_water_search:2 |
| Blade Bait<br>blade_bait | lure | 7 | 18/888 (2%) | 0/0 | all_purpose:18 | top:10, honorable:8 | open_water_search:11, wind_reaction:11, dirty_vibration:8, cold_slow:6, calm_surface:4 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 16/840 (1.9%) | 9/376 (2.4%) | all_purpose:13, big_fish:3 | honorable:8, top:8 | wind_reaction:7, dirty_vibration:6, open_water_search:6, cold_slow:5, warming_search:4 |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 16/888 (1.8%) | 0/0 | all_purpose:15, big_fish:1 | honorable:12, top:4 | warming_search:15, current_swing:7, calm_surface:6, dirty_vibration:6, low_light_surface:4 |
| Ned Rig<br>ned_rig | lure | 9 | 14/396 (3.5%) | 8/124 (6.5%) | all_purpose:13, big_fish:1 | honorable:8, top:6 | heat_finesse:7, cold_slow:6, wind_reaction:6, clear_subtle:4, dirty_vibration:2 |
| Finesse Jig<br>finesse_jig | lure | 8 | 12/396 (3%) | 9/88 (10.2%) | all_purpose:12 | honorable:9, top:3 | heat_finesse:6, clear_subtle:5, cold_slow:5, wind_reaction:4 |
| Glide Bait<br>glidebait | lure | 9 | 9/36 (25%) | 0/0 | big_fish:9 | honorable:6, top:3 | cold_slow:6, dirty_vibration:4, calm_surface:3, wind_reaction:3, clear_subtle:2 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 9/396 (2.3%) | 5/88 (5.7%) | all_purpose:9 | honorable:6, top:3 | cold_slow:5, clear_subtle:4, heat_finesse:4, wind_reaction:3, dirty_vibration:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 1/48 (2.1%) | 1/8 (12.5%) | big_fish:1 | honorable:1 | clear_subtle:1, cold_slow:1 |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 254/888 (28.6%) | 52/168 (31%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias<br>scenario_coverage_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 202/888 (22.7%) | 39/168 (23.2%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias<br>scenario_coverage_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 200/840 (23.8%) | 39/156 (25%) | catalog_tag_stack<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20% |
| Clouser Minnow<br>clouser_minnow | fly | 173/888 (19.5%) | 37/168 (22%) | catalog_tag_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | goal_tags>1<br>home-window share>20% |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 159/888 (17.9%) | 21/98 (21.4%) | catalog_tag_stack<br>goal_tag_pressure<br>scenario_coverage_bias | home-window share>20% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 148/888 (16.7%) | 100/408 (24.5%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 132/840 (15.7%) | 34/132 (25.8%) | catalog_tag_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 120/552 (21.7%) | 0/0 | goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 112/504 (22.2%) | 0/0 | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1 |
| Walking Topwater<br>walking_topwater | lure | 91/528 (17.2%) | 74/300 (24.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 86/528 (16.3%) | 69/300 (23%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Bluegill Streamer<br>bluegill_streamer | fly | 76/408 (18.6%) | 22/96 (22.9%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | home-window share>20% |
| Popper Fly<br>popper_fly | fly | 71/456 (15.6%) | 56/264 (21.2%) | catalog_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Football Jig<br>football_jig | lure | 69/360 (19.2%) | 22/86 (25.6%) | catalog_tag_stack<br>goal_tag_pressure | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Wake Bait<br>wake_bait | lure | 65/372 (17.5%) | 64/252 (25.4%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20%<br>home-window share>25% overdominant |
| Foam Gurgler<br>foam_gurgler_fly | fly | 44/276 (15.9%) | 44/192 (22.9%) | catalog_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Hollow-Body Frog<br>hollow_body_frog | lure | 35/192 (18.2%) | 23/96 (24%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Frog Fly<br>frog_fly | fly | 32/192 (16.7%) | 20/96 (20.8%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 124 | 8/124 (6.5%) | Football Jig (top), Magnum Jerkbait (honorable):6, Magnum Jerkbait (top), Compact Flipping Jig (honorable):6, Magnum Jerkbait (top), Football Jig (honorable):6, Medium-Diving Crankbait (top), Football Jig (honorable):5 | selector/direct-score or overpowered competitors |
| Finesse Jig<br>finesse_jig | lure | forage 2: crawfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 88 | 9/88 (10.2%) | Magnum Jerkbait (top), Football Jig (honorable):7, Football Jig (top), Magnum Jerkbait (honorable):5, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5, Tube Jig (top), Compact Flipping Jig (honorable):4 | selector/direct-score or overpowered competitors |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 4: cover_ambush, cold_slow, clear_subtle, heat_finesse<br>goal 1: reliable_action | 88 | 5/88 (5.7%) | Magnum Jerkbait (top), Football Jig (honorable):7, Football Jig (top), Magnum Jerkbait (honorable):5, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5, Tube Jig (top), Compact Flipping Jig (honorable):4 | selector/direct-score or overpowered competitors |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | forage 2: leech_worm, baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, cold_slow<br>goal 2: reliable_action, versatile_search | 256 | 40/256 (15.6%) | Drop-Shot Minnow (top), Soft Plastic Jerkbait (honorable):9, Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):7, Football Jig (top), Magnum Jerkbait (honorable):6, Magnum Jerkbait (top), Compact Flipping Jig (honorable):6 | healthy / not underused |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, heat_finesse<br>goal 1: reliable_action | 136 | 23/136 (16.9%) | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):9, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):7, Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):7, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):5 | healthy / not underused |
| Spinnerbait<br>spinnerbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, dirty_vibration, cover_ambush<br>goal 0: none | 408 | 48/408 (11.8%) | Magnum Jerkbait (top), Compact Flipping Jig (honorable):23, Compact Flipping Jig (top), Magnum Jerkbait (honorable):16, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):13 | selector/direct-score or overpowered competitors |
| Bladed Jig<br>bladed_jig | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: dirty_vibration, cover_ambush<br>goal 0: none | 360 | 25/360 (6.9%) | Magnum Jerkbait (top), Compact Flipping Jig (honorable):20, Compact Flipping Jig (top), Magnum Jerkbait (honorable):16, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12 | selector/direct-score or overpowered competitors |
| Lipless Crankbait<br>lipless_crankbait | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 0: none | 408 | 51/408 (12.5%) | Magnum Jerkbait (top), Compact Flipping Jig (honorable):23, Compact Flipping Jig (top), Magnum Jerkbait (honorable):16, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):13 | healthy / not underused |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Clouser Minnow (clouser_minnow), Foam Gurgler (foam_gurgler_fly), Frog Fly (frog_fly), Game Changer (game_changer), Hollow-Body Frog (hollow_body_frog), Popper Fly (popper_fly), Soft Plastic Jerkbait (soft_jerkbait), Wake Bait (wake_bait), Walking Topwater (walking_topwater)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Baitfish Slider Fly (baitfish_slider_fly), Bluegill Streamer (bluegill_streamer), Clouser Minnow (clouser_minnow), Compact Flipping Jig (compact_flipping_jig), Deer Hair Slider (deer_hair_slider), Foam Gurgler (foam_gurgler_fly), Football Jig (football_jig), Frog Fly (frog_fly), Game Changer (game_changer), Hollow-Body Frog (hollow_body_frog), Magnum Jerkbait (magnum_jerkbait), Medium-Diving Crankbait (medium_diving_crankbait), Popper Fly (popper_fly), Soft Plastic Jerkbait (soft_jerkbait), Wake Bait (wake_bait), Walking Topwater (walking_topwater)

### Probably selector problem, not catalog problem
Bladed Jig (bladed_jig), Finesse Jig (finesse_jig), Ned Rig (ned_rig), Spinnerbait (spinnerbait), Texas-Rigged Soft-Plastic Craw (texas_rigged_soft_plastic_craw)

## Utilization Notes / Coverage Gaps

- 1 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Deer Hair Slider, Popper Fly, Rabbit-Strip Leech, Woolly Bugger, Foam Gurgler, Articulated Baitfish Streamer, Clouser Minnow, Deceiver, Baitfish Slider Fly, Unweighted Baitfish Streamer, Bluegill Streamer, Frog Fly, Warmwater Crawfish Fly, Lipless Crankbait, Medium-Diving Crankbait, Spinnerbait, Squarebill Crankbait, Buzzbait, Walking Topwater, Carolina-Rigged Stick Worm, Suspending Jerkbait, Paddle-Tail Swimbait, Drop-Shot Minnow, Compact Flipping Jig, Hollow-Body Frog, Finesse Jig, Weightless Stick Worm |
| underused_home_window | Swim Jig, Flat-Sided Crankbait, Deep-Diving Crankbait, Bladed Jig, Ned Rig, Texas-Rigged Soft-Plastic Craw |
| no_home_window_coverage | None |
| over-dominant | Game Changer, Wake Bait, Soft Plastic Jerkbait, Football Jig |
| probably okay niche profile | Worm Fly, Shaky-Head Worm, Topwater Popper |

## LMB Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Deer Hair Slider<br>deer_hair_slider | fly | 4.8% | 86/528 | 69/300 | 86 | 69 | 23% | 0/150 | 69/150 | 90 | healthy | activity neutral:216, active:84<br>clarity clear:100, dirty:100, stained:100<br>water freshwater_lake_pond:276, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:76, calm_low_light_surface:72, warming_search:44 | Popper Fly (top), Unweighted Baitfish Streamer (honorable):12, Foam Gurgler (top), Clouser Minnow (honorable):11, Clouser Minnow (honorable), Popper Fly (top):8 |
| Popper Fly<br>popper_fly | fly | 4% | 71/456 | 56/264 | 71 | 56 | 21.2% | 56/132 | 0/132 | 66 | healthy | activity neutral:204, active:60<br>clarity clear:88, dirty:88, stained:88<br>water freshwater_lake_pond:252, freshwater_river:12<br>bucket stable_pleasant_medium_confidence_archive:76, calm_low_light_surface:60, heat_limited_finesse:32 | Foam Gurgler (top), Clouser Minnow (honorable):11, Deer Hair Slider (honorable), Game Changer (top):10, Baitfish Slider Fly (top), Clouser Minnow (honorable):7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 5.6% | 100/888 | 42/260 | 100 | 42 | 16.2% | 8/130 | 34/130 | 48 | healthy | activity neutral:188, suppressed:52, active:20<br>clarity clear:184, stained:40, dirty:36<br>water freshwater_lake_pond:240, freshwater_river:20<br>bucket cold_slow_or_front:84, calm_bright_clear_subtle:48, stable_pleasant_medium_confidence_archive:36 | Articulated Dungeon Streamer (top), Game Changer (honorable):9, Popper Fly (top), Unweighted Baitfish Streamer (honorable):8, Clouser Minnow (honorable), Deceiver (top):6 |
| Woolly Bugger<br>woolly_bugger | fly | 2.8% | 49/888 | 29/236 | 49 | 29 | 12.3% | 26/118 | 3/118 | 34 | healthy | activity neutral:180, suppressed:48, active:8<br>clarity clear:164, dirty:36, stained:36<br>water freshwater_lake_pond:220, freshwater_river:16<br>bucket cold_slow_or_front:64, calm_bright_clear_subtle:48, stable_pleasant_medium_confidence_archive:36 | Articulated Dungeon Streamer (top), Game Changer (honorable):9, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):8, Popper Fly (top), Unweighted Baitfish Streamer (honorable):8 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 2.5% | 44/276 | 44/192 | 44 | 44 | 22.9% | 44/96 | 0/96 | 60 | healthy | activity neutral:144, active:48<br>clarity clear:64, dirty:64, stained:64<br>water freshwater_lake_pond:168, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:72, warming_search:28, calm_low_light_surface:24 | Deer Hair Slider (honorable), Game Changer (top):11, Popper Fly (top), Unweighted Baitfish Streamer (honorable):8, Clouser Minnow (honorable), Popper Fly (top):6 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 11.4% | 202/888 | 39/168 | 202 | 39 | 23.2% | 7/84 | 32/84 | 45 | healthy | activity neutral:88, active:80<br>clarity clear:112, dirty:28, stained:28<br>water freshwater_lake_pond:164, freshwater_river:4<br>bucket warming_search:68, stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:28 | Clouser Minnow (top), Baitfish Slider Fly (honorable):8, Clouser Minnow (top), Deceiver (honorable):5, Clouser Minnow (honorable), Popper Fly (top):4 |
| Clouser Minnow<br>clouser_minnow | fly | 9.7% | 173/888 | 37/168 | 173 | 37 | 22% | 37/84 | 0/84 | 54 | healthy | activity neutral:88, active:80<br>clarity clear:112, dirty:28, stained:28<br>water freshwater_lake_pond:164, freshwater_river:4<br>bucket warming_search:68, stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:28 | Game Changer (honorable), Articulated Baitfish Streamer (top):5, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):4, Deceiver (honorable), Baitfish Slider Fly (top):4 |
| Deceiver<br>deceiver | fly | 9.7% | 173/888 | 33/168 | 173 | 33 | 19.6% | 24/84 | 9/84 | 63 | healthy | activity neutral:88, active:80<br>clarity clear:112, dirty:28, stained:28<br>water freshwater_lake_pond:164, freshwater_river:4<br>bucket warming_search:68, stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:28 | Clouser Minnow (top), Baitfish Slider Fly (honorable):8, Game Changer (honorable), Articulated Baitfish Streamer (top):5, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):4 |
| Game Changer<br>game_changer | fly | 14.3% | 254/888 | 52/168 | 254 | 52 | 31% | 16/84 | 36/84 | 44 | over-dominant | activity neutral:88, active:80<br>clarity clear:112, dirty:28, stained:28<br>water freshwater_lake_pond:164, freshwater_river:4<br>bucket warming_search:68, stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:28 | Clouser Minnow (top), Baitfish Slider Fly (honorable):8, Clouser Minnow (top), Deceiver (honorable):5, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):4 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 11.3% | 200/840 | 39/156 | 200 | 39 | 25% | 33/78 | 6/78 | 78 | healthy | activity neutral:84, active:72<br>clarity clear:100, dirty:28, stained:28<br>water freshwater_lake_pond:152, freshwater_river:4<br>bucket warming_search:64, stable_pleasant_medium_confidence_archive:32, calm_low_light_surface:28 | Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):4, Clouser Minnow (honorable), Popper Fly (top):4, Clouser Minnow (top), Articulated Baitfish Streamer (honorable):4 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 4.5% | 80/840 | 13/156 | 80 | 13 | 8.3% | 11/78 | 2/78 | 20 | healthy | activity neutral:84, active:72<br>clarity clear:100, dirty:28, stained:28<br>water freshwater_lake_pond:152, freshwater_river:4<br>bucket warming_search:64, stable_pleasant_medium_confidence_archive:32, calm_low_light_surface:28 | Clouser Minnow (top), Baitfish Slider Fly (honorable):8, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):4, Clouser Minnow (honorable), Popper Fly (top):4 |
| Bluegill Streamer<br>bluegill_streamer | fly | 4.3% | 76/408 | 22/96 | 76 | 22 | 22.9% | 1/48 | 21/48 | 33 | healthy | activity neutral:60, active:36<br>clarity clear:56, dirty:20, stained:20<br>water freshwater_lake_pond:96<br>bucket warming_search:32, calm_low_light_surface:24, stable_pleasant_medium_confidence_archive:24 | Clouser Minnow (honorable), Popper Fly (top):4, Clouser Minnow (top), Baitfish Slider Fly (honorable):3, Clouser Minnow (top), Game Changer (honorable):3 |
| Frog Fly<br>frog_fly | fly | 1.8% | 32/192 | 20/96 | 32 | 20 | 20.8% | 0/48 | 20/48 | 25 | healthy | activity neutral:60, active:36<br>clarity clear:32, dirty:32, stained:32<br>water freshwater_lake_pond:96<br>bucket calm_low_light_surface:48, warming_search:16, heat_limited_finesse:12 | Baitfish Slider Fly (top), Clouser Minnow (honorable):6, Popper Fly (top), Unweighted Baitfish Streamer (honorable):4, Deer Hair Slider (top), Game Changer (honorable):3 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 1.1% | 20/204 | 12/68 | 20 | 12 | 17.6% | 12/34 | 0/34 | 19 | healthy | activity neutral:56, suppressed:8, active:4<br>clarity clear:40, stained:16, dirty:12<br>water freshwater_lake_pond:48, freshwater_river:20<br>bucket cold_slow_or_front:20, breezy_windy_stained_reaction:12, dirty_vibration:12 | Articulated Baitfish Streamer (top), Game Changer (honorable):4, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):3, Clouser Minnow (honorable), Deceiver (top):3 |
| Worm Fly<br>warmwater_worm_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Swim Jig<br>swim_jig | lure | 2.9% | 52/888 | 32/544 | 52 | 32 | 5.9% | 32/272 | 0/272 | 110 | underused_home_window | activity neutral:304, active:224, suppressed:16<br>clarity dirty:216, stained:216, clear:112<br>water freshwater_lake_pond:508, freshwater_river:36<br>bucket dirty_vibration:176, breezy_windy_stained_reaction:164, warming_search:72 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (honorable), Compact Flipping Jig (top):10 |
| Lipless Crankbait<br>lipless_crankbait | lure | 3.7% | 65/888 | 51/408 | 65 | 51 | 12.5% | 26/204 | 25/204 | 127 | healthy | activity neutral:216, active:176, suppressed:16<br>clarity dirty:204, stained:204<br>water freshwater_lake_pond:376, freshwater_river:32<br>bucket dirty_vibration:176, breezy_windy_stained_reaction:164, warming_search:28 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (honorable), Compact Flipping Jig (top):10 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8.3% | 148/888 | 100/408 | 148 | 100 | 24.5% | 48/204 | 52/204 | 171 | healthy | activity neutral:216, active:176, suppressed:16<br>clarity dirty:204, stained:204<br>water freshwater_lake_pond:376, freshwater_river:32<br>bucket dirty_vibration:176, breezy_windy_stained_reaction:164, warming_search:28 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Magnum Jerkbait (honorable), Compact Flipping Jig (top):10, Compact Flipping Jig (honorable), Magnum Jerkbait (top):9 |
| Spinnerbait<br>spinnerbait | lure | 3% | 53/888 | 48/408 | 53 | 48 | 11.8% | 35/204 | 13/204 | 135 | healthy | activity neutral:216, active:176, suppressed:16<br>clarity dirty:204, stained:204<br>water freshwater_lake_pond:376, freshwater_river:32<br>bucket dirty_vibration:176, breezy_windy_stained_reaction:164, warming_search:28 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (honorable), Compact Flipping Jig (top):10 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 1.5% | 26/840 | 5/384 | 26 | 5 | 1.3% | 3/192 | 2/192 | 38 | underused_home_window | activity neutral:208, active:160, suppressed:16<br>clarity dirty:192, stained:192<br>water freshwater_lake_pond:352, freshwater_river:32<br>bucket dirty_vibration:164, breezy_windy_stained_reaction:152, warming_search:28 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (honorable), Compact Flipping Jig (top):10 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 4% | 71/840 | 45/384 | 71 | 45 | 11.7% | 34/192 | 11/192 | 125 | healthy | activity neutral:208, active:160, suppressed:16<br>clarity dirty:192, stained:192<br>water freshwater_lake_pond:352, freshwater_river:32<br>bucket dirty_vibration:164, breezy_windy_stained_reaction:152, warming_search:28 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (honorable), Compact Flipping Jig (top):10 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 0.9% | 16/840 | 9/376 | 16 | 9 | 2.4% | 8/188 | 1/188 | 73 | underused_home_window | activity neutral:192, active:168, suppressed:16<br>clarity dirty:188, stained:188<br>water freshwater_lake_pond:376<br>bucket dirty_vibration:164, breezy_windy_stained_reaction:156, warming_search:24 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (honorable), Compact Flipping Jig (top):9 |
| Bladed Jig<br>bladed_jig | lure | 1.5% | 26/888 | 25/360 | 26 | 25 | 6.9% | 21/180 | 4/180 | 75 | underused_home_window | activity neutral:216, active:128, suppressed:16<br>clarity dirty:180, stained:180<br>water freshwater_lake_pond:328, freshwater_river:32<br>bucket dirty_vibration:176, breezy_windy_stained_reaction:164, calm_low_light_surface:8 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):11, Medium-Diving Crankbait (top), Football Jig (honorable):11, Magnum Jerkbait (honorable), Compact Flipping Jig (top):10 |
| Buzzbait<br>buzzbait | lure | 4.6% | 81/528 | 59/300 | 81 | 59 | 19.7% | 4/150 | 55/150 | 50 | healthy | activity neutral:216, active:84<br>clarity clear:100, dirty:100, stained:100<br>water freshwater_lake_pond:276, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:76, calm_low_light_surface:72, warming_search:44 | Wake Bait (top), Walking Topwater (honorable):13, Wake Bait (honorable), Walking Topwater (top):9, Wake Bait (top), Magnum Jerkbait (honorable):8 |
| Walking Topwater<br>walking_topwater | lure | 5.1% | 91/528 | 74/300 | 91 | 74 | 24.7% | 1/150 | 73/150 | 78 | healthy | activity neutral:216, active:84<br>clarity clear:100, dirty:100, stained:100<br>water freshwater_lake_pond:276, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:76, calm_low_light_surface:72, warming_search:44 | Buzzbait (top), Compact Flipping Jig (honorable):10, Wake Bait (top), Magnum Jerkbait (honorable):8, Paddle-Tail Swimbait (top), Swim Jig (honorable):7 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 3.2% | 56/840 | 40/256 | 56 | 40 | 15.6% | 39/128 | 1/128 | 42 | healthy | activity neutral:208, suppressed:48<br>clarity clear:160, stained:96<br>water freshwater_lake_pond:256<br>bucket cold_slow_or_front:72, heat_limited_finesse:48, breezy_windy_stained_reaction:44 | Drop-Shot Minnow (top), Soft Plastic Jerkbait (honorable):9, Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):7, Magnum Jerkbait (honorable), Football Jig (top):6 |
| Wake Bait<br>wake_bait | lure | 3.7% | 65/372 | 64/252 | 65 | 64 | 25.4% | 3/126 | 61/126 | 77 | over-dominant | activity neutral:192, active:60<br>clarity clear:84, dirty:84, stained:84<br>water freshwater_lake_pond:252<br>bucket stable_pleasant_medium_confidence_archive:72, calm_low_light_surface:60, heat_limited_finesse:32 | Buzzbait (top), Compact Flipping Jig (honorable):8, Walking Topwater (top), Magnum Jerkbait (honorable):7, Buzzbait (top), Walking Topwater (honorable):6 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8.9% | 158/888 | 42/224 | 158 | 42 | 18.8% | 39/112 | 3/112 | 100 | healthy | activity neutral:136, active:60, suppressed:28<br>clarity clear:144, stained:80<br>water freshwater_lake_pond:200, freshwater_river:24<br>bucket cold_slow_or_front:52, warming_search:48, breezy_windy_stained_reaction:44 | Magnum Jerkbait (top), Football Jig (honorable):8, Medium-Diving Crankbait (top), Football Jig (honorable):7, Magnum Jerkbait (top), Compact Flipping Jig (honorable):6 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 5% | 89/888 | 30/168 | 89 | 30 | 17.9% | 26/84 | 4/84 | 75 | healthy | activity neutral:88, active:80<br>clarity clear:112, dirty:28, stained:28<br>water freshwater_lake_pond:164, freshwater_river:4<br>bucket warming_search:68, stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:28 | Wake Bait (top), Walking Topwater (honorable):8, Buzzbait (top), Compact Flipping Jig (honorable):5, Buzzbait (top), Magnum Worm (honorable):5 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 3.2% | 57/888 | 23/136 | 57 | 23 | 16.9% | 18/68 | 5/68 | 42 | healthy | activity neutral:116, suppressed:20<br>clarity clear:136<br>water freshwater_lake_pond:132, freshwater_river:4<br>bucket calm_bright_clear_subtle:44, stable_pleasant_medium_confidence_archive:32, heat_limited_finesse:24 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):9, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):7, Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):7 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7.4% | 132/840 | 34/132 | 132 | 34 | 25.8% | 29/66 | 5/66 | 57 | over-dominant | activity neutral:116, suppressed:16<br>clarity clear:132<br>water freshwater_lake_pond:128, freshwater_river:4<br>bucket calm_bright_clear_subtle:40, stable_pleasant_medium_confidence_archive:32, heat_limited_finesse:24 | Carolina-Rigged Stick Worm (top), Tube Jig (honorable):6, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):5, Suspending Jerkbait (top), Drop-Shot Minnow (honorable):5 |
| Ned Rig<br>ned_rig | lure | 0.8% | 14/396 | 8/124 | 14 | 8 | 6.5% | 8/62 | 0/62 | 28 | underused_home_window | activity neutral:100, suppressed:24<br>clarity clear:68, stained:56<br>water freshwater_lake_pond:112, freshwater_river:12<br>bucket cold_slow_or_front:48, breezy_windy_stained_reaction:36, heat_limited_finesse:16 | Magnum Jerkbait (honorable), Football Jig (top):6, Magnum Jerkbait (top), Football Jig (honorable):6, Magnum Jerkbait (top), Compact Flipping Jig (honorable):5 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 9% | 159/888 | 21/98 | 159 | 21 | 21.4% | 0/44 | 21/54 | 4 | healthy | activity neutral:62, suppressed:20, active:16<br>clarity clear:80, stained:18<br>water freshwater_lake_pond:86, freshwater_river:12<br>bucket cold_slow_or_front:52, calm_bright_clear_subtle:12, heat_limited_finesse:12 | Magnum Jerkbait (top), Football Jig (honorable):7, Magnum Jerkbait (honorable), Football Jig (top):6, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):2 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 2% | 35/192 | 23/96 | 35 | 23 | 24% | 0/48 | 23/48 | 12 | healthy | activity neutral:60, active:36<br>clarity clear:32, dirty:32, stained:32<br>water freshwater_lake_pond:96<br>bucket calm_low_light_surface:48, warming_search:16, heat_limited_finesse:12 | Buzzbait (top), Walking Topwater (honorable):3, Suspending Jerkbait (top), Drop-Shot Minnow (honorable):3, Carolina-Rigged Stick Worm (top), Flat-Sided Crankbait (honorable):2 |
| Finesse Jig<br>finesse_jig | lure | 0.7% | 12/396 | 9/88 | 12 | 9 | 10.2% | 9/44 | 0/44 | 21 | healthy | activity neutral:56, suppressed:20, active:12<br>clarity clear:80, stained:8<br>water freshwater_lake_pond:76, freshwater_river:12<br>bucket cold_slow_or_front:52, calm_bright_clear_subtle:12, heat_limited_finesse:8 | Magnum Jerkbait (top), Football Jig (honorable):7, Magnum Jerkbait (honorable), Football Jig (top):5, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 0.5% | 9/396 | 5/88 | 9 | 5 | 5.7% | 5/44 | 0/44 | 24 | underused_home_window | activity neutral:56, suppressed:20, active:12<br>clarity clear:80, stained:8<br>water freshwater_lake_pond:76, freshwater_river:12<br>bucket cold_slow_or_front:52, calm_bright_clear_subtle:12, heat_limited_finesse:8 | Magnum Jerkbait (top), Football Jig (honorable):7, Magnum Jerkbait (honorable), Football Jig (top):5, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5 |
| Football Jig<br>football_jig | lure | 3.9% | 69/360 | 22/86 | 69 | 22 | 25.6% | 0/38 | 22/48 | 10 | over-dominant | activity neutral:54, suppressed:20, active:12<br>clarity clear:68, stained:18<br>water freshwater_lake_pond:86<br>bucket cold_slow_or_front:48, calm_bright_clear_subtle:12, heat_limited_finesse:12 | Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5, Magnum Jerkbait (top), Compact Flipping Jig (honorable):3, Tube Jig (top), Compact Flipping Jig (honorable):3 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 2.6% | 46/288 | 12/52 | 46 | 12 | 23.1% | 11/26 | 1/26 | 24 | healthy | activity neutral:48, suppressed:4<br>clarity clear:52<br>water freshwater_lake_pond:52<br>bucket stable_pleasant_medium_confidence_archive:16, heat_limited_finesse:12, calm_bright_clear_subtle:8 | Carolina-Rigged Stick Worm (top), Tube Jig (honorable):4, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):4, Carolina-Rigged Stick Worm (top), Flat-Sided Crankbait (honorable):3 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 0.1% | 1/48 | 1/8 | 1 | 1 | 12.5% | 0/4 | 1/4 | 3 | probably okay niche profile | activity suppressed:8<br>clarity clear:4, stained:4<br>water freshwater_lake_pond:8<br>bucket calm_bright_clear_subtle:4, cold_slow_or_front:4 | Carolina-Rigged Stick Worm (top), Tube Jig (honorable):2, Carolina-Rigged Stick Worm (honorable), Compact Flipping Jig (top):1, Finesse Jig (honorable), Texas-Rigged Soft-Plastic Craw (top):1 |
| Topwater Popper<br>popping_topwater | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |
| forage_clarity_stack | 25 |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 | all_purpose<br>stained<br>freshwater_lake_pond | cold_slow_or_front<br>suppressed | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 | big_fish<br>stained<br>freshwater_lake_pond | cold_slow_or_front<br>suppressed | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Sam Rayburn Reservoir<br>2025-02-11 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 136 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>primary_forage:baitfish:+12 |
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
| Minnesota natural bass lake<br>2025-09-20 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 156 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Champlain<br>2025-04-27 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Champlain<br>2025-08-14 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 156 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| WV/VA highland reservoir<br>2025-03-26 | all_purpose<br>stained<br>freshwater_lake_pond | cold_slow_or_front<br>suppressed | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| WV/VA highland reservoir<br>2025-03-26 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>suppressed | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| WV/VA highland reservoir<br>2025-11-08 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 156 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Colorado mountain-west reservoir<br>2025-04-23 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | 39/128 | 1/128 | goal_tags:83, daily_condition_tags:76, seasonal_baseline:32, forage_clarity_stack:18, selector_filtering_variety_jitter:7 | Lake Okeechobee / central FL bass lake 2025-03-18 all_purpose clear: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-03-19 all_purpose stained: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-03-19 all_purpose clear: lost to Suspending Jerkbait by 0 (selector_filtering_variety_jitter) |
| Ned Rig<br>ned_rig | 8/62 | 0/62 | goal_tags:65, forage_clarity_stack:35, daily_condition_tags:11, selector_filtering_variety_jitter:4, seasonal_baseline:1 | Jordan Lake / Piedmont reservoir 2025-03-22 all_purpose clear: lost to Drop-Shot Minnow by 10 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose stained: lost to Tube Jig by 12 (forage_clarity_stack) |
| Finesse Jig<br>finesse_jig | 9/44 | 0/44 | goal_tags:46, forage_clarity_stack:22, daily_condition_tags:6, selector_filtering_variety_jitter:5 | Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack)<br>Lake of the Ozarks 2025-02-20 all_purpose clear: lost to Carolina-Rigged Stick Worm by 12 (goal_tags) |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | 5/44 | 0/44 | goal_tags:48, forage_clarity_stack:25, daily_condition_tags:6, selector_filtering_variety_jitter:4 | Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Jordan Lake / Piedmont reservoir 2025-03-22 all_purpose clear: lost to Drop-Shot Minnow by 10 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-18<br>all_purpose clear cold_slow_or_front | 186 | Flat-Sided Crankbait<br>184 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-19<br>all_purpose stained cold_slow_or_front | 170 | Flat-Sided Crankbait<br>168 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-19<br>all_purpose clear calm_bright_clear_subtle | 186 | Suspending Jerkbait<br>186 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Finesse Jig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Carolina-Rigged Stick Worm<br>170 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Texas-Rigged Soft-Plastic Craw<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Carolina-Rigged Stick Worm<br>170 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-18<br>all_purpose stained cold_slow_or_front | 170 | Soft Plastic Jerkbait<br>174 | 4 | seasonal_baseline | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
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
| avoidIds | 22 |
| jitter_or_id_tiebreak | 6 |
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

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Swim Jig<br>swim_jig | lure | 32/544 | 5.9% | 110 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:82, big_fish / dirty / freshwater_lake_pond / dirty_vibration:82, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:78, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:78 | goal_tags:311, daily_condition_tags:149, selector_filtering_variety_jitter:44, forage_clarity_stack:7 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (honorable), Compact Flipping Jig (top):10, Suspending Jerkbait (top), Medium-Diving Crankbait (honorable):10 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 5/384 | 1.3% | 38 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:76, big_fish / dirty / freshwater_lake_pond / dirty_vibration:76, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72 | goal_tags:210, daily_condition_tags:144, forage_clarity_stack:19, selector_filtering_variety_jitter:6 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (honorable), Compact Flipping Jig (top):10, Compact Flipping Jig (honorable), Magnum Jerkbait (top):9 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 9/376 | 2.4% | 73 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:82, big_fish / dirty / freshwater_lake_pond / dirty_vibration:82, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:78, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:78 | goal_tags:217, daily_condition_tags:116, forage_clarity_stack:18, seasonal_baseline:9 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (honorable), Compact Flipping Jig (top):9, Medium-Diving Crankbait (honorable), Lipless Crankbait (top):8 |
| Bladed Jig<br>bladed_jig | lure | 25/360 | 6.9% | 75 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:82, big_fish / dirty / freshwater_lake_pond / dirty_vibration:82, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:78, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:78 | goal_tags:235, daily_condition_tags:63, forage_clarity_stack:27, selector_filtering_variety_jitter:10 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):11, Medium-Diving Crankbait (top), Football Jig (honorable):11, Magnum Jerkbait (honorable), Compact Flipping Jig (top):10, Compact Flipping Jig (honorable), Magnum Jerkbait (top):9 |
| Ned Rig<br>ned_rig | lure | 8/124 | 6.5% | 28 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:16, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:16, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:16, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:16 | goal_tags:65, forage_clarity_stack:35, daily_condition_tags:11, selector_filtering_variety_jitter:4 | Magnum Jerkbait (honorable), Football Jig (top):6, Magnum Jerkbait (top), Football Jig (honorable):6, Magnum Jerkbait (top), Compact Flipping Jig (honorable):5, Drop-Shot Minnow (top), Finesse Jig (honorable):4 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 5/88 | 5.7% | 24 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:20, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:20, all_purpose / clear / freshwater_lake_pond / calm_bright_clear_subtle:6, big_fish / clear / freshwater_lake_pond / calm_bright_clear_subtle:6 | goal_tags:48, forage_clarity_stack:25, daily_condition_tags:6, selector_filtering_variety_jitter:4 | Magnum Jerkbait (top), Football Jig (honorable):7, Magnum Jerkbait (honorable), Football Jig (top):5, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5, Tube Jig (top), Compact Flipping Jig (honorable):4 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Wake Bait<br>wake_bait | lure | 64/252 | 25.4% | 77 | all_purpose / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:12, all_purpose / dirty / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:12, all_purpose / stained / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:12, big_fish / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:12 | goal_tags:117, selector_filtering_variety_jitter:57, daily_condition_tags:10, forage_clarity_stack:4 | Buzzbait (top), Compact Flipping Jig (honorable):8, Walking Topwater (top), Magnum Jerkbait (honorable):7, Buzzbait (top), Walking Topwater (honorable):6, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):6 |
| Game Changer<br>game_changer | fly | 52/168 | 31% | 44 | all_purpose / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:20, big_fish / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:20, all_purpose / clear / freshwater_lake_pond / warming_search:14, big_fish / clear / freshwater_lake_pond / warming_search:14 | goal_tags:53, daily_condition_tags:34, selector_filtering_variety_jitter:27, forage_clarity_stack:1 | Clouser Minnow (top), Baitfish Slider Fly (honorable):8, Clouser Minnow (top), Deceiver (honorable):5, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):4, Clouser Minnow (honorable), Popper Fly (top):4 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 34/132 | 25.8% | 57 | all_purpose / clear / freshwater_lake_pond / calm_bright_clear_subtle:20, big_fish / clear / freshwater_lake_pond / calm_bright_clear_subtle:20, all_purpose / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:16, big_fish / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:16 | goal_tags:38, selector_filtering_variety_jitter:35, daily_condition_tags:14, seasonal_baseline:6 | Carolina-Rigged Stick Worm (top), Tube Jig (honorable):6, Flat-Sided Crankbait (top), Compact Flipping Jig (honorable):5, Suspending Jerkbait (top), Drop-Shot Minnow (honorable):5, Drop-Shot Minnow (top), Compact Flipping Jig (honorable):4 |
| Football Jig<br>football_jig | lure | 22/86 | 25.6% | 10 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:20, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:20, all_purpose / clear / freshwater_lake_pond / calm_bright_clear_subtle:6, big_fish / clear / freshwater_lake_pond / calm_bright_clear_subtle:6 | goal_tags:42, daily_condition_tags:13, forage_clarity_stack:5, selector_filtering_variety_jitter:3 | Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):5, Magnum Jerkbait (top), Compact Flipping Jig (honorable):3, Tube Jig (top), Compact Flipping Jig (honorable):3, Carolina-Rigged Stick Worm (top), Tube Jig (honorable):2 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Popper Fly [fly] (42), Foam Gurgler [fly] (31), Soft Plastic Jerkbait [lure] (25), Paddle-Tail Swimbait [lure] (22), Baitfish Slider Fly [fly] (21) | Popper Fly [fly] (57), Soft Plastic Jerkbait [lure] (50), Clouser Minnow [fly] (49), Baitfish Slider Fly [fly] (42), Foam Gurgler [fly] (36) |
| calm_surface | big_fish | Walking Topwater [lure] (41), Wake Bait [lure] (38), Bluegill Streamer [fly] (29), Deer Hair Slider [fly] (27), Buzzbait [lure] (24) | Walking Topwater [lure] (66), Deer Hair Slider [fly] (60), Wake Bait [lure] (51), Game Changer [fly] (45), Buzzbait [lure] (41) |
| low_light_surface | all_purpose | Baitfish Slider Fly [fly] (23), Suspending Jerkbait [lure] (21), Popper Fly [fly] (19), Clouser Minnow [fly] (17), Soft Plastic Jerkbait [lure] (14) | Baitfish Slider Fly [fly] (37), Clouser Minnow [fly] (35), Soft Plastic Jerkbait [lure] (31), Suspending Jerkbait [lure] (31), Popper Fly [fly] (29) |
| low_light_surface | big_fish | Buzzbait [lure] (29), Deer Hair Slider [fly] (20), Wake Bait [lure] (18), Walking Topwater [lure] (18), Game Changer [fly] (15) | Buzzbait [lure] (43), Walking Topwater [lure] (42), Deer Hair Slider [fly] (41), Game Changer [fly] (31), Wake Bait [lure] (25) |
| wind_reaction | all_purpose | Baitfish Slider Fly [fly] (60), Suspending Jerkbait [lure] (58), Deceiver [fly] (56), Clouser Minnow [fly] (52), Medium-Diving Crankbait [lure] (31) | Deceiver [fly] (108), Baitfish Slider Fly [fly] (99), Suspending Jerkbait [lure] (98), Clouser Minnow [fly] (94), Medium-Diving Crankbait [lure] (64) |
| wind_reaction | big_fish | Medium-Diving Crankbait [lure] (51), Game Changer [fly] (47), Baitfish Slider Fly [fly] (43), Deceiver [fly] (39), Articulated Baitfish Streamer [fly] (36) | Game Changer [fly] (110), Compact Flipping Jig [lure] (102), Articulated Baitfish Streamer [fly] (89), Medium-Diving Crankbait [lure] (74), Articulated Dungeon Streamer [fly] (70) |
| dirty_vibration | all_purpose | Baitfish Slider Fly [fly] (44), Deceiver [fly] (39), Suspending Jerkbait [lure] (36), Clouser Minnow [fly] (35), Medium-Diving Crankbait [lure] (21) | Deceiver [fly] (75), Baitfish Slider Fly [fly] (69), Clouser Minnow [fly] (63), Suspending Jerkbait [lure] (61), Medium-Diving Crankbait [lure] (46) |
| dirty_vibration | big_fish | Game Changer [fly] (38), Medium-Diving Crankbait [lure] (38), Baitfish Slider Fly [fly] (31), Deceiver [fly] (30), Articulated Baitfish Streamer [fly] (27) | Compact Flipping Jig [lure] (90), Game Changer [fly] (78), Articulated Baitfish Streamer [fly] (68), Articulated Dungeon Streamer [fly] (52), Medium-Diving Crankbait [lure] (51) |
| clear_subtle | all_purpose | Soft Plastic Jerkbait [lure] (22), Carolina-Rigged Stick Worm [lure] (15), Popper Fly [fly] (15), Lead-Eye Leech [fly] (12), Suspending Jerkbait [lure] (11) | Soft Plastic Jerkbait [lure] (30), Unweighted Baitfish Streamer [fly] (29), Carolina-Rigged Stick Worm [lure] (26), Clouser Minnow [fly] (23), Lead-Eye Leech [fly] (23) |
| clear_subtle | big_fish | Bluegill Streamer [fly] (15), Game Changer [fly] (14), Articulated Dungeon Streamer [fly] (12), Walking Topwater [lure] (12), Wake Bait [lure] (9) | Game Changer [fly] (31), Bluegill Streamer [fly] (19), Magnum Jerkbait [lure] (19), Deer Hair Slider [fly] (17), Walking Topwater [lure] (17) |
| cold_slow | all_purpose | Suspending Jerkbait [lure] (13), Tube Jig [lure] (10), Deceiver [fly] (9), Clouser Minnow [fly] (7), Woolly Bugger [fly] (7) | Woolly Bugger [fly] (20), Suspending Jerkbait [lure] (19), Tube Jig [lure] (19), Clouser Minnow [fly] (15), Baitfish Slider Fly [fly] (14) |
| cold_slow | big_fish | Articulated Dungeon Streamer [fly] (16), Articulated Baitfish Streamer [fly] (11), Magnum Jerkbait [lure] (11), Game Changer [fly] (10), Compact Flipping Jig [lure] (7) | Game Changer [fly] (25), Rabbit-Strip Leech [fly] (25), Compact Flipping Jig [lure] (23), Articulated Dungeon Streamer [fly] (21), Magnum Jerkbait [lure] (21) |
| warming_search | all_purpose | Clouser Minnow [fly] (29), Paddle-Tail Swimbait [lure] (22), Suspending Jerkbait [lure] (18), Baitfish Slider Fly [fly] (15), Deceiver [fly] (14) | Clouser Minnow [fly] (43), Baitfish Slider Fly [fly] (35), Paddle-Tail Swimbait [lure] (35), Suspending Jerkbait [lure] (34), Swim Jig [lure] (28) |
| warming_search | big_fish | Articulated Baitfish Streamer [fly] (21), Game Changer [fly] (21), Medium-Diving Crankbait [lure] (18), Buzzbait [lure] (16), Magnum Jerkbait [lure] (16) | Game Changer [fly] (41), Articulated Baitfish Streamer [fly] (35), Compact Flipping Jig [lure] (33), Magnum Jerkbait [lure] (26), Walking Topwater [lure] (24) |
| heat_finesse | all_purpose | Drop-Shot Minnow [lure] (19), Carolina-Rigged Stick Worm [lure] (11), Clouser Minnow [fly] (11), Baitfish Slider Fly [fly] (8), Weightless Stick Worm [lure] (8) | Clouser Minnow [fly] (24), Drop-Shot Minnow [lure] (23), Soft Plastic Jerkbait [lure] (21), Deceiver [fly] (13), Unweighted Baitfish Streamer [fly] (13) |
| heat_finesse | big_fish | Game Changer [fly] (13), Bluegill Streamer [fly] (12), Articulated Dungeon Streamer [fly] (9), Wake Bait [lure] (9), Articulated Baitfish Streamer [fly] (8) | Game Changer [fly] (26), Articulated Baitfish Streamer [fly] (21), Compact Flipping Jig [lure] (20), Magnum Worm [lure] (18), Magnum Jerkbait [lure] (17) |
| current_swing | all_purpose | Clouser Minnow [fly] (7), Soft Plastic Jerkbait [lure] (5), Foam Gurgler [fly] (4), Woolly Bugger [fly] (3), Feather Jig Leech [fly] (2) | Clouser Minnow [fly] (9), Feather Jig Leech [fly] (6), Soft Plastic Jerkbait [lure] (6), Baitfish Slider Fly [fly] (5), Foam Gurgler [fly] (5) |
| current_swing | big_fish | Game Changer [fly] (6), Buzzbait [lure] (5), Articulated Baitfish Streamer [fly] (3), Baitfish Slider Fly [fly] (3), Magnum Jerkbait [lure] (3) | Compact Flipping Jig [lure] (8), Game Changer [fly] (8), Rabbit-Strip Leech [fly] (8), Articulated Baitfish Streamer [fly] (7), Buzzbait [lure] (7) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Northern California bass lake<br>2025-10-25 clear big_fish A | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+cold_slow+open_water_search, medium | Buzzbait (182); Walking Topwater (178); Deer Hair Slider (166); Game Changer (176) | TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST, TOPWATER_SHOULDER_SEASON_REGION, TOPWATER_SHOULDER_SEASON_REGION |
| Sam Rayburn Reservoir<br>2025-03-28 dirty big_fish B | 63-72.2F, 9.3 mph wind, 97.7% cloud, 1.4 in precip | active, closed, wind_reaction+dirty_vibration, medium | Bladed Jig (150); Football Jig (140); Game Changer (154); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-04-11 clear big_fish B | 48.7-60.9F, 9.6 mph wind, 25.8% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle, medium | Squarebill Crankbait (154); Compact Flipping Jig (132); Unweighted Baitfish Streamer (162); Articulated Baitfish Streamer (136) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Southern California reservoir<br>2025-02-18 dirty big_fish B | 47.6-72.9F, 7.9 mph wind, 68.8% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Medium-Diving Crankbait (158); Compact Flipping Jig (170); Game Changer (156); Articulated Baitfish Streamer (162) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Northern California bass lake<br>2025-10-25 dirty big_fish B | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Compact Flipping Jig (150); Walking Topwater (170); Deer Hair Slider (166); Articulated Dungeon Streamer (168) | TOPWATER_SHOULDER_SEASON_REGION, TOPWATER_SHOULDER_SEASON_REGION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Colorado mountain-west reservoir<br>2025-04-23 clear big_fish B | 43.9-72.1F, 7.1 mph wind, 71.2% cloud, 0 in precip | active, closed, wind_reaction+warming_search, medium | Medium-Diving Crankbait (178); Compact Flipping Jig (132); Game Changer (154); Articulated Baitfish Streamer (146) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Colorado mountain-west reservoir<br>2025-04-23 dirty big_fish B | 43.9-72.1F, 7.1 mph wind, 71.2% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search, medium | Bladed Jig (150); Magnum Jerkbait (146); Game Changer (154); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Colorado mountain-west reservoir<br>2025-08-12 clear big_fish A | 60.3-86.9F, 7.6 mph wind, 27.3% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle+open_water_search, medium | Magnum Worm (134); Medium-Diving Crankbait (172); Bluegill Streamer (162); Game Changer (176) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Colorado mountain-west reservoir<br>2025-10-05 stained big_fish B | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Medium-Diving Crankbait (178); Lipless Crankbait (172); Articulated Dungeon Streamer (168); Game Changer (176) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Illinois / Indiana natural-lake example<br>2025-04-18 dirty big_fish B | 55-77.3F, 12.3 mph wind, 81.4% cloud, 1.1 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Compact Flipping Jig (156); Magnum Jerkbait (146); Deceiver (150); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Minnesota natural bass lake<br>2025-05-15 dirty big_fish B | 60.3-76.3F, 18.2 mph wind, 86.5% cloud, 0.3 in precip | active, closed, wind_reaction+dirty_vibration, medium | Bladed Jig (140); Football Jig (140); Articulated Dungeon Streamer (152); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Minnesota natural bass lake<br>2025-05-15 stained big_fish B | 60.3-76.3F, 18.2 mph wind, 86.5% cloud, 0.3 in precip | active, closed, wind_reaction+dirty_vibration, medium | Medium-Diving Crankbait (152); Compact Flipping Jig (156); Articulated Dungeon Streamer (152); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Jordan Lake / Piedmont reservoir<br>2025-03-22 dirty big_fish B | 44.6-71.1F, 9.8 mph wind, 0.4% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Medium-Diving Crankbait (162); Football Jig (140); Articulated Baitfish Streamer (154); Game Changer (154) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Southwest high-desert reservoir<br>2025-10-14 dirty big_fish B | 58.1-77.9F, 6.3 mph wind, 45.1% cloud, 0.1 in precip | neutral, caution, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Lipless Crankbait (172); Medium-Diving Crankbait (178); Game Changer (176); Articulated Baitfish Streamer (176) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake Fork<br>2025-03-29 clear big_fish B | 60.8-80.6F, 9.6 mph wind, 56.9% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Medium-Diving Crankbait (178); Football Jig (140); Game Changer (154); Articulated Dungeon Streamer (154) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Sam Rayburn Reservoir<br>2025-02-11 dirty big_fish B | 49.9-70.6F, 6.8 mph wind, 100% cloud, 0.7 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Lipless Crankbait (152); Football Jig (154); Game Changer (156); Articulated Baitfish Streamer (162) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-04-11 clear big_fish A | 48.7-60.9F, 9.6 mph wind, 25.8% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle, medium | Spinnerbait (144); Magnum Jerkbait (160); Articulated Dungeon Streamer (156); Game Changer (144) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Guntersville / Tennessee River reservoir<br>2025-04-11 stained big_fish A | 48.7-60.9F, 9.6 mph wind, 25.8% cloud, 0 in precip | neutral, caution, wind_reaction+dirty_vibration, medium | Magnum Jerkbait (144); Compact Flipping Jig (156); Articulated Dungeon Streamer (164); Game Changer (144) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Guntersville / Tennessee River reservoir<br>2025-06-07 clear all_purpose A | 71.3-84F, 7.2 mph wind, 91.3% cloud, 0.1 in precip | active, open, low_light_surface+wind_reaction+warming_search+open_water_search, medium | Paddle-Tail Swimbait (174); Swim Jig (166); Popper Fly (170); Clouser Minnow (186) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Guntersville / Tennessee River reservoir<br>2025-06-07 clear big_fish B | 71.3-84F, 7.2 mph wind, 91.3% cloud, 0.1 in precip | active, open, low_light_surface+wind_reaction+warming_search+open_water_search, medium | Walking Topwater (178); Hollow-Body Frog (162); Deer Hair Slider (166); Frog Fly (162) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Guntersville / Tennessee River reservoir<br>2025-06-07 stained big_fish B | 71.3-84F, 7.2 mph wind, 91.3% cloud, 0.1 in precip | active, open, low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Compact Flipping Jig (150); Hollow-Body Frog (162); Deer Hair Slider (166); Frog Fly (162) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Guntersville / Tennessee River reservoir<br>2025-10-19 dirty big_fish A | 54.1-72F, 12.4 mph wind, 33.6% cloud, 1.1 in precip | neutral, caution, wind_reaction+dirty_vibration+open_water_search, medium | Compact Flipping Jig (150); Magnum Jerkbait (168); Articulated Baitfish Streamer (176); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Guntersville / Tennessee River reservoir<br>2025-10-19 stained big_fish B | 54.1-72F, 12.4 mph wind, 33.6% cloud, 1.1 in precip | neutral, caution, wind_reaction+dirty_vibration+open_water_search, medium | Medium-Diving Crankbait (178); Lipless Crankbait (172); Game Changer (176); Articulated Dungeon Streamer (168) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Guntersville / Tennessee River reservoir<br>2025-10-20 clear big_fish B | 47.1-68.9F, 4.1 mph wind, 13.7% cloud, 0 in precip | suppressed, closed, clear_subtle, medium | Tube Jig (148); Compact Flipping Jig (126); Articulated Baitfish Streamer (152); Rabbit-Strip Leech (126) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Southwest desert bass reservoir<br>2025-03-25 clear big_fish B | 67.7-95.9F, 4.4 mph wind, 16.2% cloud, 0 in precip | neutral, closed, clear_subtle+heat_finesse, medium | Drop-Shot Minnow (168); Compact Flipping Jig (132); Game Changer (154); Articulated Baitfish Streamer (146) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Southwest desert bass reservoir<br>2025-11-15 clear big_fish A | 64.4-73.2F, 6.2 mph wind, 94% cloud, 0.4 in precip | active, open, low_light_surface+wind_reaction+open_water_search, medium | Magnum Jerkbait (176); Walking Topwater (178); Articulated Baitfish Streamer (168); Deer Hair Slider (166) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Southwest desert bass reservoir<br>2025-11-15 dirty all_purpose A | 64.4-73.2F, 6.2 mph wind, 94% cloud, 0.4 in precip | active, open, low_light_surface+wind_reaction+dirty_vibration+open_water_search, medium | Paddle-Tail Swimbait (168); Bladed Jig (156); Clouser Minnow (178); Game Changer (168) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Southwest desert bass reservoir<br>2025-11-15 stained big_fish B | 64.4-73.2F, 6.2 mph wind, 94% cloud, 0.4 in precip | active, open, low_light_surface+wind_reaction+dirty_vibration+open_water_search, medium | Lipless Crankbait (172); Magnum Jerkbait (176); Game Changer (176); Articulated Baitfish Streamer (176) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Southern California reservoir<br>2025-02-18 clear all_purpose A | 47.6-72.9F, 7.9 mph wind, 68.8% cloud, 0 in precip | active, closed, wind_reaction+warming_search+open_water_search, medium | Carolina-Rigged Stick Worm (170); Blade Bait (174); Feather Jig Leech (152); Articulated Baitfish Streamer (146) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Southern California reservoir<br>2025-02-18 clear big_fish B | 47.6-72.9F, 7.9 mph wind, 68.8% cloud, 0 in precip | active, closed, wind_reaction+warming_search+open_water_search, medium | Compact Flipping Jig (146); Suspending Jerkbait (136); Deceiver (152); Articulated Dungeon Streamer (154) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Southern California reservoir<br>2025-02-18 stained big_fish B | 47.6-72.9F, 7.9 mph wind, 68.8% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Lipless Crankbait (152); Football Jig (154); Game Changer (156); Articulated Dungeon Streamer (162) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Northern California bass lake<br>2025-03-30 stained big_fish B | 39.7-55.9F, 11.2 mph wind, 82.5% cloud, 0.4 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Medium-Diving Crankbait (162); Football Jig (156); Game Changer (154); Articulated Baitfish Streamer (154) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |

## Known Coverage Gaps

- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
