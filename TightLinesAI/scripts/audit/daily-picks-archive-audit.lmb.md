# FinFindr LMB Daily-Picks Archive Audit
Generated: 2026-05-12T20:23:42.872Z

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
| breezy_windy_stained_reaction | 104 |
| dirty_vibration | 116 |
| cold_slow_or_front | 348 |
| warming_search | 48 |
| heat_limited_finesse | 24 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 456 |
| river_elevated_runoff_current | 36 |
| medium_confidence_archive | 888 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 3 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 -> 2025-03-19 | changed | 7.8 | 3.5 | cold_slow -> calm_surface|cold_slow |
| Guntersville / Tennessee River reservoir<br>2025-10-19 -> 2025-10-20 | changed | 8.3 | 3.3 | none -> cold_slow |
| Minnesota natural bass lake<br>2025-09-20 -> 2025-09-21 | changed | 1.8 | 1.5 | none -> calm_surface |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 51 | WIND_NOT_ELEVATING_REACTION (54), BIG_FISH_NOT_FAVORING_UPSIDE (5), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2), TOPWATER_SHOULDER_SEASON_REGION (2), COLD_CLEAR_TOO_FAST (1) |
| calm_bright_clear_subtle | 1 | BIG_FISH_NOT_FAVORING_UPSIDE (1) |
| calm_low_light_surface | 3 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3) |
| cold_slow_or_front | 72 | WIND_NOT_ELEVATING_REACTION (59), BIG_FISH_NOT_FAVORING_UPSIDE (16), TOPWATER_SHOULDER_SEASON_REGION (8), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), COLD_CLEAR_TOO_FAST (3) |
| dirty_vibration | 44 | WIND_NOT_ELEVATING_REACTION (39), BIG_FISH_NOT_FAVORING_UPSIDE (6), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), DIRTY_WIND_NOT_ELEVATING_VIBRATION (3), TOPWATER_SHOULDER_SEASON_REGION (3) |
| medium_confidence_archive | 177 | WIND_NOT_ELEVATING_REACTION (146), BIG_FISH_NOT_FAVORING_UPSIDE (30), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (16), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (14), TOPWATER_SHOULDER_SEASON_REGION (8) |
| river_elevated_runoff_current | 5 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), BIG_FISH_NOT_FAVORING_UPSIDE (2), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| stable_pleasant_medium_confidence_archive | 85 | WIND_NOT_ELEVATING_REACTION (67), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (15), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (11), BIG_FISH_NOT_FAVORING_UPSIDE (9), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| warming_search | 13 | WIND_NOT_ELEVATING_REACTION (10), BIG_FISH_NOT_FAVORING_UPSIDE (5) |

- WIND_NOT_ELEVATING_REACTION: 146
- BIG_FISH_NOT_FAVORING_UPSIDE: 30
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 16
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 14
- TOPWATER_SHOULDER_SEASON_REGION: 8
- COLD_CLEAR_TOO_FAST: 3
- DIRTY_WIND_NOT_ELEVATING_VIBRATION: 3

- tx_lake_fork__2025-04-30__freshwater_lake_pond__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK, DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION. Picks: Buzzbait (lure); Bladed Jig (lure); Popper Fly (fly); Unweighted Baitfish Streamer (fly)
- co_pueblo__2025-08-12__freshwater_lake_pond__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION. Picks: Magnum Worm (lure); Medium-Diving Crankbait (lure); Bluegill Streamer (fly); Game Changer (fly)
- ca_clear_lake__2025-10-25__freshwater_lake_pond__clear__big_fish__A: TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST. Picks: Buzzbait (lure); Magnum Jerkbait (lure); Deer Hair Slider (fly); Game Changer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- sc_santee_cooper__2025-04-05__freshwater_lake_pond__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK, WIND_NOT_ELEVATING_REACTION. Picks: Buzzbait (lure); Spinnerbait (lure); Popper Fly (fly); Unweighted Baitfish Streamer (fly)
- sc_santee_cooper__2025-04-05__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Walking Topwater (lure); Compact Flipping Jig (lure); Deer Hair Slider (fly); Game Changer (fly)
- sc_santee_cooper__2025-05-18__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Walking Topwater (lure); Wake Bait (lure); Frog Fly (fly); Bluegill Streamer (fly)
- sc_santee_cooper__2025-05-18__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Wake Bait (lure); Compact Flipping Jig (lure); Frog Fly (fly); Articulated Baitfish Streamer (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Tube Jig (lure); Soft Plastic Jerkbait (lure); Deceiver (fly); Clouser Minnow (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Unweighted Baitfish Streamer (fly); Game Changer (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- mo_lake_ozarks__2025-06-18__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Wake Bait (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Mouse Fly (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Bluegill Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- mn_minnetonka__2025-07-16__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Wake Bait (lure); Compact Flipping Jig (lure); Game Changer (fly); Deer Hair Slider (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- il_fox_chain__2025-10-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- il_fox_chain__2025-10-18__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- vt_champlain__2025-08-14__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Magnum Worm (lure); Suspending Jerkbait (lure); Bluegill Streamer (fly); Game Changer (fly)
- vt_champlain__2025-08-14__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- wv_new_river__2025-06-17__freshwater_river__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK, DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Squarebill Crankbait (lure); Buzzbait (lure); Clouser Minnow (fly); Popper Fly (fly)
- co_pueblo__2025-10-05__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- co_pueblo__2025-10-05__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Lipless Crankbait (lure); Medium-Diving Crankbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ca_clear_lake__2025-10-25__freshwater_lake_pond__stained__big_fish__A: TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST. Picks: Magnum Jerkbait (lure); Buzzbait (lure); Baitfish Slider Fly (fly); Articulated Baitfish Streamer (fly)
- ca_clear_lake__2025-10-25__freshwater_lake_pond__dirty__big_fish__A: TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST. Picks: Magnum Jerkbait (lure); Buzzbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ca_clear_lake__2025-10-25__freshwater_lake_pond__dirty__big_fish__B: TOPWATER_SHOULDER_SEASON_REGION. Picks: Compact Flipping Jig (lure); Walking Topwater (lure); Deer Hair Slider (fly); Articulated Dungeon Streamer (fly)
- ca_castaic__2025-02-18__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Blade Bait (lure); Tube Jig (lure); Clouser Minnow (fly); Jighead Marabou Leech (fly)
- nm_elephant_butte__2025-04-17__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Weightless Stick Worm (lure); Tube Jig (lure); Lead-Eye Leech (fly); Clouser Minnow (fly)
- nm_elephant_butte__2025-04-17__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- nm_elephant_butte__2025-04-17__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Rabbit-Strip Leech (fly); Game Changer (fly)
- nm_elephant_butte__2025-04-17__freshwater_lake_pond__dirty__all_purpose__B: DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION. Picks: Weightless Stick Worm (lure); Medium-Diving Crankbait (lure); Clouser Minnow (fly); Unweighted Baitfish Streamer (fly)
- fl_okeechobee__2025-08-18__freshwater_lake_pond__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Soft Plastic Jerkbait (lure); Magnum Worm (lure); Bluegill Streamer (fly); Articulated Baitfish Streamer (fly)
- fl_okeechobee__2025-08-18__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Spinnerbait (lure); Paddle-Tail Swimbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- fl_okeechobee__2025-08-18__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Lipless Crankbait (lure); Paddle-Tail Swimbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Lipless Crankbait (lure); Articulated Baitfish Streamer (fly); Clouser Minnow (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Deceiver (fly); Game Changer (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Blade Bait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Squarebill Crankbait (lure); Spinnerbait (lure); Bluegill Streamer (fly); Game Changer (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Squarebill Crankbait (lure); Spinnerbait (lure); Baitfish Slider Fly (fly); Bluegill Streamer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Game Changer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Drop-Shot Minnow (lure); Clouser Minnow (fly); Woolly Bugger (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Squarebill Crankbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Spinnerbait (lure); Unweighted Baitfish Streamer (fly); Clouser Minnow (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Weightless Stick Worm (lure); Soft Plastic Jerkbait (lure); Baitfish Slider Fly (fly); Popper Fly (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Hollow-Body Frog (lure); Squarebill Crankbait (lure); Deer Hair Slider (fly); Game Changer (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Buzzbait (lure); Walking Topwater (lure); Frog Fly (fly); Articulated Dungeon Streamer (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Spinnerbait (lure); Squarebill Crankbait (lure); Popper Fly (fly); Clouser Minnow (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Buzzbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Frog Fly (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 27
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 8
- ADJACENT_DAY_EXACT_REPEAT: 5

- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Soft Plastic Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Rabbit-Strip Leech (fly); Woolly Bugger (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Soft Plastic Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Lead-Eye Leech (fly); Baitfish Slider Fly (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__all_purpose__B: ADJACENT_DAY_EXACT_REPEAT. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Popper Fly (fly); Baitfish Slider Fly (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hollow-Body Frog (lure); Magnum Jerkbait (lure); Frog Fly (fly); Articulated Dungeon Streamer (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Carolina-Rigged Stick Worm (lure); Baitfish Slider Fly (fly); Unweighted Baitfish Streamer (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Carolina-Rigged Stick Worm (lure); Deep-Diving Crankbait (lure); Woolly Bugger (fly); Feather Jig Leech (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- al_guntersville__2025-03-08__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- al_guntersville__2025-03-08__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Deep-Diving Crankbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Tube Jig (lure); Baitfish Slider Fly (fly); Jighead Marabou Leech (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Spinnerbait (lure); Baitfish Slider Fly (fly); Articulated Baitfish Streamer (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Squarebill Crankbait (lure); Deceiver (fly); Unweighted Baitfish Streamer (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Spinnerbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- al_guntersville__2025-10-20__freshwater_lake_pond__clear__big_fish__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Magnum Jerkbait (lure); Football Jig (lure); Rabbit-Strip Leech (fly); Game Changer (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- nc_jordan_lake__2025-05-08__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Wake Bait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Frog Fly (fly)
- nc_jordan_lake__2025-10-04__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Walking Topwater (lure); Hollow-Body Frog (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- nc_jordan_lake__2025-10-04__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Buzzbait (lure); Hollow-Body Frog (lure); Articulated Dungeon Streamer (fly); Frog Fly (fly)
- mo_lake_ozarks__2025-02-20__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Articulated Dungeon Streamer (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- vt_champlain__2025-04-27__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain__2025-04-27__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- wv_stonewall__2025-05-19__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Baitfish Slider Fly (fly); Jighead Marabou Leech (fly)
- wv_stonewall__2025-05-19__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Swim Jig (lure); Spinnerbait (lure); Clouser Minnow (fly); Lead-Eye Leech (fly)
- wv_new_river__2025-05-06__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Ned Rig (lure); Woolly Bugger (fly); Lead-Eye Leech (fly)
- ca_clear_lake__2025-03-30__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ca_clear_lake__2025-03-30__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Rabbit-Strip Leech (fly); Game Changer (fly)
- ca_clear_lake__2025-10-25__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Walking Topwater (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- ca_castaic__2025-02-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ca_castaic__2025-04-21__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Buzzbait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- nm_elephant_butte__2025-04-17__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Compact Flipping Jig (lure); Articulated Dungeon Streamer (fly); Baitfish Slider Fly (fly)
- nm_elephant_butte__2025-04-17__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Football Jig (lure); Deceiver (fly); Rabbit-Strip Leech (fly)

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | florida | cold_slow:1 |
| Feb | midwest_interior | cold_slow:1 |
| Feb | south_central | stable:1 |
| Feb | southern_california | stable:1 |
| Mar | appalachian | cold_slow:1 |
| Mar | florida | cold_slow:2 |
| Mar | great_lakes_upper_midwest | cooling_or_shock:1 |
| Mar | northern_california | cold_slow:1 |
| Mar | south_central | stable:2, cold_slow:1 |
| Mar | southeast_atlantic | stable:1 |
| Mar | southwest_desert | heat_limited:1 |
| Apr | appalachian | warming:1 |
| Apr | great_lakes_upper_midwest | cooling_or_shock:1 |
| Apr | midwest_interior | stable:1 |
| Apr | mountain_west | stable:1 |
| Apr | northeast | cold_slow:1 |
| Apr | south_central | stable:1, cooling_or_shock:1, cold_slow:1 |
| Apr | southeast_atlantic | stable:1 |
| Apr | southern_california | stable:1 |
| Apr | southwest_high_desert | stable:1 |
| May | appalachian | cold_slow:2 |
| May | great_lakes_upper_midwest | cooling_or_shock:1 |
| May | northern_california | cold_slow:1 |
| May | south_central | cold_slow:1 |
| May | southeast_atlantic | stable:2 |
| Jun | appalachian | stable:1 |
| Jun | florida | stable:1 |
| Jun | great_lakes_upper_midwest | stable:1 |
| Jun | midwest_interior | stable:1 |
| Jun | mountain_west | stable:1 |
| Jun | northeast | cooling_or_shock:1 |
| Jun | south_central | stable:2 |
| Jun | southwest_desert | stable:1 |
| Jun | southwest_high_desert | cooling_or_shock:1 |
| Jul | appalachian | stable:1 |
| Jul | great_lakes_upper_midwest | cooling_or_shock:1 |
| Jul | south_central | stable:1 |
| Jul | southeast_atlantic | stable:1 |
| Jul | southern_california | stable:1 |
| Aug | florida | stable:1 |
| Aug | great_lakes_upper_midwest | stable:1 |
| Aug | mountain_west | stable:1 |
| Aug | northeast | stable:1 |
| Aug | northern_california | stable:1 |
| Aug | southeast_atlantic | stable:1 |
| Aug | southwest_desert | heat_limited:1 |
| Aug | southwest_high_desert | stable:1 |
| Sep | appalachian | stable:1 |
| Sep | great_lakes_upper_midwest | cooling_or_shock:1, stable:1 |
| Sep | midwest_interior | stable:1 |
| Sep | south_central | stable:1 |
| Sep | southeast_atlantic | cooling_or_shock:1 |
| Sep | southern_california | stable:1 |
| Oct | great_lakes_upper_midwest | warming:1 |
| Oct | mountain_west | cooling_or_shock:1 |
| Oct | northeast | warming:1 |
| Oct | northern_california | cold_slow:1 |
| Oct | south_central | cooling_or_shock:1, cold_slow:1 |
| Oct | southeast_atlantic | stable:1 |
| Oct | southwest_high_desert | stable:1 |
| Nov | appalachian | cooling_or_shock:1 |
| Nov | midwest_interior | cooling_or_shock:1 |
| Nov | southwest_desert | cooling_or_shock:1 |
| Dec | florida | warming:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

| Scenario | Temp | Top winners needing review |
| --- | --- | --- |
| Southwest desert bass reservoir<br>2025-03-25 clear all_purpose B | 67.7-95.9F | Clouser Minnow (medium) |
| Southwest desert bass reservoir<br>2025-03-25 clear big_fish A | 67.7-95.9F | Magnum Jerkbait (medium) |
| Southwest desert bass reservoir<br>2025-03-25 clear big_fish B | 67.7-95.9F | Unweighted Baitfish Streamer (medium) |
| Southwest desert bass reservoir<br>2025-03-25 stained all_purpose B | 67.7-95.9F | Clouser Minnow (medium) |
| Southwest desert bass reservoir<br>2025-03-25 stained big_fish A | 67.7-95.9F | Magnum Jerkbait (medium) |
| Southwest desert bass reservoir<br>2025-03-25 stained big_fish B | 67.7-95.9F | Game Changer (medium) |
| Southwest desert bass reservoir<br>2025-03-25 dirty all_purpose B | 67.7-95.9F | Deceiver (medium) |
| Southwest desert bass reservoir<br>2025-03-25 dirty big_fish B | 67.7-95.9F | Magnum Jerkbait (medium); Articulated Baitfish Streamer (medium) |
| Southwest desert bass reservoir<br>2025-08-21 clear all_purpose A | 93.2-115.6F | Foam Gurgler (medium) |
| Southwest desert bass reservoir<br>2025-08-21 clear all_purpose B | 93.2-115.6F | Clouser Minnow (medium) |
| Southwest desert bass reservoir<br>2025-08-21 clear big_fish B | 93.2-115.6F | Walking Topwater (medium); Game Changer (medium) |
| Southwest desert bass reservoir<br>2025-08-21 stained all_purpose A | 93.2-115.6F | Popper Fly (medium) |
| Southwest desert bass reservoir<br>2025-08-21 stained all_purpose B | 93.2-115.6F | Clouser Minnow (medium) |
| Southwest desert bass reservoir<br>2025-08-21 stained big_fish A | 93.2-115.6F | Walking Topwater (medium) |
| Southwest desert bass reservoir<br>2025-08-21 stained big_fish B | 93.2-115.6F | Deer Hair Slider (medium) |
| Southwest desert bass reservoir<br>2025-08-21 dirty all_purpose A | 93.2-115.6F | Soft Plastic Jerkbait (medium); Clouser Minnow (medium) |
| Southwest desert bass reservoir<br>2025-08-21 dirty all_purpose B | 93.2-115.6F | Popper Fly (medium) |
| Southwest desert bass reservoir<br>2025-08-21 dirty big_fish A | 93.2-115.6F | Articulated Baitfish Streamer (medium) |
| Southwest desert bass reservoir<br>2025-08-21 dirty big_fish B | 93.2-115.6F | Walking Topwater (medium); Deer Hair Slider (medium) |

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Apr | south_central | open | glare | all_purpose | 3 | 55.2-78.8F | 5.6 |
| Apr | south_central | open | glare | big_fish | 6 | 55.2-78.8F | 5.6 |
| Apr | south_central | open | low_light | all_purpose | 3 | 63.2-78.0F | 11.6 |
| Apr | south_central | open | low_light | big_fish | 6 | 63.2-78.0F | 11.6 |
| Apr | southeast_atlantic | open | low_light | all_purpose | 3 | 67.1-82.8F | 9.6 |
| Apr | southeast_atlantic | open | low_light | big_fish | 6 | 67.1-82.8F | 9.6 |
| Apr | southern_california | open | mixed | all_purpose | 3 | 52.9-78.6F | 5.4 |
| Apr | southern_california | open | mixed | big_fish | 5 | 52.9-78.6F | 5.4 |
| Aug | great_lakes_upper_midwest | open | mixed | all_purpose | 5 | 58.5-77.6F | 4.7 |
| Aug | great_lakes_upper_midwest | open | mixed | big_fish | 6 | 58.5-77.6F | 4.7 |
| Aug | southeast_atlantic | open | low_light | all_purpose | 4 | 72.1-80.9F | 4.6 |
| Aug | southeast_atlantic | open | low_light | big_fish | 6 | 72.1-80.9F | 4.6 |
| Aug | southwest_desert | open | bright | all_purpose | 5 | 93.2-115.6F | 3.3 |
| Aug | southwest_desert | open | bright | big_fish | 6 | 93.2-115.6F | 3.3 |
| Jul | appalachian | open | bright | all_purpose | 6 | 69.2-86.6F | 4.8 |
| Jul | appalachian | open | bright | big_fish | 6 | 69.2-86.6F | 4.8 |
| Jul | great_lakes_upper_midwest | open | low_light | all_purpose | 3 | 56.8-70.2F | 13.8 |
| Jul | great_lakes_upper_midwest | open | low_light | big_fish | 6 | 56.8-70.2F | 13.8 |
| Jul | south_central | open | low_light | all_purpose | 5 | 76.6-94.7F | 4.1 |
| Jul | south_central | open | low_light | big_fish | 6 | 76.6-94.7F | 4.1 |
| Jul | southeast_atlantic | open | mixed | all_purpose | 3 | 80.4-94.6F | 4.2 |
| Jul | southeast_atlantic | open | mixed | big_fish | 6 | 80.4-94.6F | 4.2 |
| Jul | southern_california | open | glare | all_purpose | 4 | 64.3-89.0F | 5.6 |
| Jul | southern_california | open | glare | big_fish | 6 | 64.3-89.0F | 5.6 |
| Jun | appalachian | open | low_light | all_purpose | 6 | 64.2-78.3F | 6.2 |
| Jun | appalachian | open | low_light | big_fish | 6 | 64.2-78.3F | 6.2 |
| Jun | florida | open | low_light | all_purpose | 3 | 78.3-85.4F | 5.7 |
| Jun | florida | open | low_light | big_fish | 6 | 78.3-85.4F | 5.7 |
| Jun | midwest_interior | open | low_light | all_purpose | 6 | 66.9-79.1F | 10.1 |
| Jun | midwest_interior | open | low_light | big_fish | 6 | 66.9-79.1F | 10.1 |
| Jun | northeast | open | mixed | all_purpose | 6 | 58.4-74.2F | 5.2 |
| Jun | northeast | open | mixed | big_fish | 6 | 58.4-74.2F | 5.2 |
| Jun | south_central | open | low_light | all_purpose | 2 | 71.3-84.0F | 7.2 |
| Jun | south_central | open | low_light | big_fish | 6 | 71.3-84.0F | 7.2 |
| Jun | southwest_desert | open | glare | all_purpose | 6 | 82.2-109.0F | 6 |
| Jun | southwest_desert | open | glare | big_fish | 6 | 82.2-109.0F | 6 |
| Jun | southwest_high_desert | open | mixed | all_purpose | 6 | 66.8-83.2F | 4.8 |
| Jun | southwest_high_desert | open | mixed | big_fish | 6 | 66.8-83.2F | 4.8 |
| Mar | florida | open | bright | all_purpose | 3 | 59.2-76.4F | 5.9 |
| Mar | florida | open | bright | big_fish | 6 | 59.2-76.4F | 5.9 |
| May | northern_california | open | bright | all_purpose | 5 | 44.9-75.1F | 5.4 |
| May | northern_california | open | bright | big_fish | 6 | 44.9-75.1F | 5.4 |
| May | southeast_atlantic | open | low_light | all_purpose | 7 | 60.5-85.1F | 5.6 |
| May | southeast_atlantic | open | low_light | big_fish | 12 | 60.5-85.1F | 5.3 |
| Nov | southwest_desert | open | low_light | all_purpose | 1 | 64.4-73.2F | 6.2 |
| Nov | southwest_desert | open | low_light | big_fish | 6 | 64.4-73.2F | 6.2 |
| Oct | northern_california | open | low_light | big_fish | 6 | 49.9-59.6F | 9.9 |
| Oct | southeast_atlantic | open | mixed | big_fish | 6 | 54.6-75.9F | 3 |
| Sep | appalachian | open | low_light | all_purpose | 5 | 55.8-73.2F | 5.6 |
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
| Lake Fork<br>2025-04-30 dirty all_purpose A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Buzzbait; Popper Fly |
| Lake Fork<br>2025-04-30 dirty big_fish A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Buzzbait; Frog Fly |
| Lake Fork<br>2025-04-30 dirty big_fish B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Walking Topwater; Deer Hair Slider |
| Santee Cooper<br>2025-04-05 clear all_purpose A | 67.1-82.8F, 9.6 mph, low_light | open, low_light_surface+wind_reaction | Popper Fly |
| Santee Cooper<br>2025-04-05 clear big_fish A | 67.1-82.8F, 9.6 mph, low_light | open, low_light_surface+wind_reaction | Buzzbait; Deer Hair Slider |
| Santee Cooper<br>2025-04-05 clear big_fish B | 67.1-82.8F, 9.6 mph, low_light | open, low_light_surface+wind_reaction | Walking Topwater; Frog Fly |

## Water Column Diversity Diagnostics

### Same-Side Surface/Surface Summary

| Side | Goal | Set | Region | Month | Clarity | Surface tags | Rows | Close non-surface alt | Credible non-surface alt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lure | big_fish | A | appalachian | Jun | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | appalachian | Jul | dirty | calm_surface | 1 | 0 | 0 |
| lure | big_fish | A | appalachian | Jul | stained | calm_surface | 1 | 0 | 0 |
| lure | big_fish | A | appalachian | Sep | stained | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | florida | Jun | clear | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | florida | Jun | dirty | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | florida | Jun | stained | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | great_lakes_upper_midwest | Aug | dirty | calm_surface | 1 | 1 | 0 |
| lure | big_fish | A | great_lakes_upper_midwest | Aug | stained | calm_surface | 1 | 0 | 0 |
| lure | big_fish | B | midwest_interior | Jun | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | midwest_interior | Sep | dirty | calm_surface | 1 | 0 | 0 |
| lure | big_fish | A | northeast | Jun | clear | calm_surface | 1 | 0 | 0 |
| lure | big_fish | A | northeast | Jun | stained | calm_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Apr | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Apr | dirty | calm_surface | 1 | 1 | 0 |
| lure | big_fish | A | south_central | Apr | stained | calm_surface | 1 | 0 | 0 |
| lure | big_fish | A | south_central | Jun | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Jun | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | south_central | Jun | dirty | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Jun | dirty | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | south_central | Jun | stained | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Jun | stained | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | south_central | Jul | dirty | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | south_central | Jul | stained | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | May | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | May | clear | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | May | dirty | calm_surface+low_light_surface | 1 | 1 | 0 |
| lure | big_fish | B | southeast_atlantic | Jul | clear | calm_surface | 1 | 0 | 0 |
| lure | big_fish | A | southeast_atlantic | Jul | dirty | calm_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Jul | dirty | calm_surface | 1 | 1 | 0 |
| lure | big_fish | A | southeast_atlantic | Jul | stained | calm_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Aug | clear | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | southeast_atlantic | Aug | dirty | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Aug | dirty | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | A | southeast_atlantic | Aug | stained | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Aug | stained | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Sep | dirty | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Sep | stained | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Oct | dirty | calm_surface | 1 | 1 | 0 |
| lure | big_fish | B | southeast_atlantic | Oct | stained | calm_surface | 1 | 0 | 0 |

### Remaining Same-Side Surface/Surface Examples

| Scenario | Side | Selected surface pair | Close non-surface alternatives | Why left |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-06-20 clear big_fish B | lure | Walking Topwater (172); Wake Bait (180) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Lake Okeechobee / central FL bass lake<br>2025-06-20 stained big_fish A | lure | Buzzbait (168); Walking Topwater (172) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Lake Okeechobee / central FL bass lake<br>2025-06-20 dirty big_fish B | lure | Wake Bait (172); Walking Topwater (164) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Sam Rayburn Reservoir<br>2025-04-12 stained big_fish A | lure | Hollow-Body Frog (162); Walking Topwater (172) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Sam Rayburn Reservoir<br>2025-04-12 dirty big_fish B | lure | Buzzbait (152); Hollow-Body Frog (162) | close: Squarebill Crankbait (upper, 146)<br>credible: none | Close alternatives lacked clear goal or daily-condition fit. |
| Sam Rayburn Reservoir<br>2025-07-24 stained big_fish A | lure | Wake Bait (180); Buzzbait (174) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Sam Rayburn Reservoir<br>2025-07-24 dirty big_fish A | lure | Buzzbait (174); Wake Bait (172) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Lake Fork<br>2025-04-30 clear big_fish B | lure | Buzzbait (176); Walking Topwater (172) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 clear big_fish A | lure | Buzzbait (166); Wake Bait (180) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 clear big_fish B | lure | Walking Topwater (178); Hollow-Body Frog (162) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 stained big_fish A | lure | Hollow-Body Frog (162); Wake Bait (180) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 stained big_fish B | lure | Walking Topwater (178); Buzzbait (174) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 dirty big_fish A | lure | Walking Topwater (170); Buzzbait (174) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Guntersville / Tennessee River reservoir<br>2025-06-07 dirty big_fish B | lure | Hollow-Body Frog (162); Wake Bait (172) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Santee Cooper<br>2025-05-18 clear big_fish B | lure | Walking Topwater (172); Wake Bait (180) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Santee Cooper<br>2025-07-28 clear big_fish B | lure | Walking Topwater (178); Wake Bait (180) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |
| Santee Cooper<br>2025-07-28 stained big_fish A | lure | Walking Topwater (178); Hollow-Body Frog (162) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Santee Cooper<br>2025-07-28 dirty big_fish A | lure | Buzzbait (158); Wake Bait (172) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Santee Cooper<br>2025-07-28 dirty big_fish B | lure | Walking Topwater (170); Hollow-Body Frog (162) | close: Paddle-Tail Swimbait (mid, 146); Spinnerbait (mid, 146); Swim Jig (mid, 146)<br>credible: none | Close alternatives lacked clear goal or daily-condition fit. |
| Santee Cooper<br>2025-09-27 stained big_fish B | lure | Wake Bait (180); Walking Topwater (178) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |

### Same-Side Column/Band Summary

| Side | Same exact column | Same broad band | Same broad band with close different-band alt |
| --- | --- | --- | --- |
| lure | 289 | 289 | 231 |
| fly | 284 | 284 | 268 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 384 | - |
| open-surface rows with 2+ surface picks | 161 | 161 |
| open-surface rows with 3+ surface picks | 36 | 36 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 109 | 109 |
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
| exact_id | unavoidable_due_score_band | 4 | 0 | 4 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 2 | 0 | 2 |
| same_family_same_presentation | truly_avoidable | 20 | 7 | 27 |
| same_family_same_presentation | unavoidable_due_score_band | 10 | 12 | 22 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 6 | 2 | 8 |
| same_family_same_presentation | unavoidable_due_goal_condition_fit | 48 | 12 | 60 |
| same_family_different_presentation | truly_avoidable | 0 | 8 | 8 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 18 | 18 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 10 | 10 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 21 | 21 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty all_purpose | lure honorable: same_family_same_presentation | Flat-Sided Crankbait (160); Weightless Stick Worm (158) | Blade Bait (154); Carolina-Rigged Stick Worm (152) | Suspending Jerkbait (162, alt edge 10) |
| Guntersville / Tennessee River reservoir<br>2025-03-08 dirty big_fish | lure honorable: same_family_same_presentation | Football Jig (156); Magnum Jerkbait (162) | Deep-Diving Crankbait (152); Compact Flipping Jig (156) | Medium-Diving Crankbait (162, alt edge 6) |
| Illinois / Indiana natural-lake example<br>2025-04-18 dirty big_fish | lure top: same_family_same_presentation | Spinnerbait (150); Football Jig (140) | Compact Flipping Jig (156); Magnum Jerkbait (146) | Medium-Diving Crankbait (162, alt edge 6) |
| Jordan Lake / Piedmont reservoir<br>2025-03-22 dirty big_fish | lure honorable: same_family_same_presentation | Spinnerbait (150); Compact Flipping Jig (156) | Medium-Diving Crankbait (162); Football Jig (140) | Magnum Jerkbait (146, alt edge 6) |
| Lake Fork<br>2025-03-29 dirty big_fish | lure honorable: same_family_same_presentation | Compact Flipping Jig (156); Squarebill Crankbait (140) | Medium-Diving Crankbait (162); Football Jig (140) | Magnum Jerkbait (146, alt edge 6) |
| Sam Rayburn Reservoir<br>2025-03-28 dirty big_fish | lure honorable: same_family_same_presentation | Medium-Diving Crankbait (162); Compact Flipping Jig (156) | Bladed Jig (150); Football Jig (140) | Magnum Jerkbait (146, alt edge 6) |
| WV/VA highland reservoir<br>2025-05-19 dirty all_purpose | fly honorable: same_family_same_presentation | Jighead Marabou Leech (148); Baitfish Slider Fly (158) | Clouser Minnow (146); Lead-Eye Leech (142) | Woolly Bugger (148, alt edge 6) |
| Southern California reservoir<br>2025-04-21 stained big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (164); Deer Hair Slider (160) | Rabbit-Strip Leech (134); Articulated Baitfish Streamer (144) | Popper Fly (146, alt edge 2) |
| Appalachian river LMB context<br>2025-05-06 clear all_purpose | fly honorable: same_family_same_presentation | Warmwater Crawfish Fly (176); Jighead Marabou Leech (158) | Woolly Bugger (158); Lead-Eye Leech (152) | Clouser Minnow (154, alt edge 2) |
| Guntersville / Tennessee River reservoir<br>2025-04-11 clear all_purpose | fly honorable: same_family_same_presentation | Lead-Eye Leech (168); Unweighted Baitfish Streamer (174) | Baitfish Slider Fly (174); Jighead Marabou Leech (158) | Woolly Bugger (158, alt edge 0) |
| Guntersville / Tennessee River reservoir<br>2025-04-11 stained big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (150); Articulated Dungeon Streamer (164) | Baitfish Slider Fly (162); Articulated Baitfish Streamer (144) | Game Changer (144, alt edge 0) |
| WV/VA highland reservoir<br>2025-05-19 clear all_purpose | fly honorable: same_family_same_presentation | Unweighted Baitfish Streamer (174); Lead-Eye Leech (168) | Baitfish Slider Fly (158); Jighead Marabou Leech (158) | Woolly Bugger (158, alt edge 0) |
| Northern California bass lake<br>2025-10-25 stained big_fish | fly top: same_family_different_presentation | Baitfish Slider Fly (162); Articulated Baitfish Streamer (176) | Articulated Dungeon Streamer (168); Game Changer (176) | Deer Hair Slider (166, alt edge -2) |
| Jordan Lake / Piedmont reservoir<br>2025-10-04 dirty big_fish | fly top: same_family_different_presentation | Game Changer (160); Articulated Baitfish Streamer (160) | Articulated Dungeon Streamer (168); Frog Fly (162) | Deer Hair Slider (166, alt edge -2) |
| Jordan Lake / Piedmont reservoir<br>2025-10-04 stained big_fish | fly top: same_family_different_presentation | Articulated Baitfish Streamer (160); Frog Fly (162) | Articulated Dungeon Streamer (168); Game Changer (160) | Deer Hair Slider (166, alt edge -2) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Lake of the Ozarks<br>2025-11-11 clear | B | 3/4 | Medium-Diving Crankbait; Lipless Crankbait; Baitfish Slider Fly; Deceiver | Medium-Diving Crankbait; Lipless Crankbait; Deceiver; Articulated Baitfish Streamer |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 stained B | lure | Spinnerbait; Paddle-Tail Swimbait |
| Lake Okeechobee / central FL bass lake<br>2025-08-18 dirty B | lure | Lipless Crankbait; Paddle-Tail Swimbait |
| Sam Rayburn Reservoir<br>2025-05-10 clear B | lure | Flat-Sided Crankbait; Blade Bait |
| Sam Rayburn Reservoir<br>2025-05-10 stained B | lure | Squarebill Crankbait; Spinnerbait |
| Sam Rayburn Reservoir<br>2025-05-10 dirty B | lure | Squarebill Crankbait; Spinnerbait |
| Lake Fork<br>2025-06-15 clear B | lure | Medium-Diving Crankbait; Paddle-Tail Swimbait |
| Lake Fork<br>2025-06-15 stained B | lure | Squarebill Crankbait; Paddle-Tail Swimbait |
| Lake Fork<br>2025-06-15 dirty B | lure | Bladed Jig; Paddle-Tail Swimbait |
| Guntersville / Tennessee River reservoir<br>2025-04-11 stained B | lure | Squarebill Crankbait; Spinnerbait |
| Guntersville / Tennessee River reservoir<br>2025-04-11 dirty B | lure | Squarebill Crankbait; Spinnerbait |
| Guntersville / Tennessee River reservoir<br>2025-10-20 clear B | lure | Tube Jig; Suspending Jerkbait |
| Lake of the Ozarks<br>2025-11-11 clear B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Lake of the Ozarks<br>2025-11-11 stained B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Lake of the Ozarks<br>2025-11-11 dirty B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| Illinois / Indiana natural-lake example<br>2025-10-18 clear B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Illinois / Indiana natural-lake example<br>2025-10-18 stained B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| Illinois / Indiana natural-lake example<br>2025-10-18 dirty B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Lake Champlain<br>2025-08-14 clear B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| WV/VA highland reservoir<br>2025-05-19 stained B | lure | Flat-Sided Crankbait; Tube Jig |
| WV/VA highland reservoir<br>2025-05-19 dirty B | lure | Flat-Sided Crankbait; Deep-Diving Crankbait |
| Appalachian river LMB context<br>2025-04-04 stained B | lure | Bladed Jig; Spinnerbait |
| Appalachian river LMB context<br>2025-04-04 dirty B | lure | Bladed Jig; Spinnerbait |
| Appalachian river LMB context<br>2025-05-06 clear B | lure | Flat-Sided Crankbait; Tube Jig |
| Appalachian river LMB context<br>2025-05-06 stained B | lure | Tube Jig; Flat-Sided Crankbait |
| Appalachian river LMB context<br>2025-05-06 dirty B | lure | Ned Rig; Flat-Sided Crankbait |
| Colorado mountain-west reservoir<br>2025-06-22 stained B | lure | Spinnerbait; Squarebill Crankbait |
| Colorado mountain-west reservoir<br>2025-06-22 dirty B | lure | Swim Jig; Squarebill Crankbait |
| Colorado mountain-west reservoir<br>2025-08-12 clear B | lure | Soft Plastic Jerkbait; Suspending Jerkbait |
| Colorado mountain-west reservoir<br>2025-10-05 stained B | lure | Medium-Diving Crankbait; Lipless Crankbait |
| Colorado mountain-west reservoir<br>2025-10-05 dirty B | lure | Lipless Crankbait; Medium-Diving Crankbait |
| Northern California bass lake<br>2025-08-16 clear B | lure | Lipless Crankbait; Medium-Diving Crankbait |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Lipless Crankbait [lure] | 10 | Magnum Jerkbait (8), Buzzbait (2) | 1.2 |
| Medium-Diving Crankbait [lure] | 9 | Magnum Jerkbait (8), Wake Bait (1) | -4.4 |
| Spinnerbait [lure] | 8 | Compact Flipping Jig (5), Magnum Jerkbait (2), Wake Bait (1) | 4.3 |
| Squarebill Crankbait [lure] | 8 | Compact Flipping Jig (4), Magnum Jerkbait (2), Wake Bait (2) | -2.5 |
| Paddle-Tail Swimbait [lure] | 7 | Wake Bait (4), Buzzbait (3) | -8.6 |
| Flat-Sided Crankbait [lure] | 6 | Magnum Jerkbait (6) | 10 |
| Tube Jig [lure] | 4 | Magnum Jerkbait (4) | 19 |
| Bladed Jig [lure] | 3 | Compact Flipping Jig (2), Buzzbait (1) | 2 |
| Blade Bait [lure] | 1 | Magnum Jerkbait (1) | 24 |
| Deep-Diving Crankbait [lure] | 1 | Magnum Jerkbait (1) | 12 |
| Ned Rig [lure] | 1 | Magnum Jerkbait (1) | 16 |
| Suspending Jerkbait [lure] | 1 | Magnum Jerkbait (1) | 20 |
| Swim Jig [lure] | 1 | Compact Flipping Jig (1) | 4 |

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
| Sam Rayburn Reservoir<br>2025-03-28 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Bladed Jig (150; condition_tag:dirty_vibration:+16); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 12) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (154; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Game Changer (146; goal:all_purpose:versatile_search:+12) | Deceiver (162, alt edge -2) | goal fit likely competed |
| Lake Fork<br>2025-03-29 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 8) | goal fit likely competed |
| Lake Fork<br>2025-03-29 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (146; goal:big_fish:big_fish_upside:+20); Game Changer (154; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Woolly Bugger (142; goal:all_purpose:reliable_action:+18) | Deceiver (162, alt edge -2) | goal fit likely competed |
| Lake Fork<br>2025-03-29 stained big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20); Compact Flipping Jig (156; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 6) | goal fit likely competed |
| Lake Fork<br>2025-03-29 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (154; goal:big_fish:big_fish_upside:+20); Game Changer (154; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (162; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -12) | goal fit likely competed |
| Lake Fork<br>2025-03-29 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (162; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Game Changer (154; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -12) | goal fit likely competed |
| Lake Fork<br>2025-04-30 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Unweighted Baitfish Streamer (158; goal:all_purpose:versatile_search:+12); Clouser Minnow (154; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (174, alt edge 16) | goal fit likely competed |
| Lake Fork<br>2025-04-30 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (lure) | Weightless Stick Worm (158; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Soft Plastic Jerkbait (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Suspending Jerkbait (170, alt edge 6) | goal fit likely competed |
| Lake Fork<br>2025-04-30 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Deer Hair Slider (160; condition_tag:low_light_surface:+16, goal:big_fish:big_fish_upside:+20); Game Changer (144; goal:big_fish:big_fish_upside:+20) | Baitfish Slider Fly (162, alt edge 2) | goal fit likely competed |
| Lake Fork<br>2025-04-30 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Frog Fly (162; condition_tag:low_light_surface:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Articulated Dungeon Streamer (156; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Baitfish Slider Fly (162, alt edge 0) | goal fit likely competed |
| Lake Fork<br>2025-04-30 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Popper Fly (176; condition_tag:low_light_surface:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Clouser Minnow (154; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (174, alt edge -2) | goal fit likely competed |
| Lake Fork<br>2025-04-30 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (164; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Frog Fly (162; condition_tag:low_light_surface:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Baitfish Slider Fly (162, alt edge -2) | goal fit likely competed |
| Lake Fork<br>2025-04-30 dirty all_purpose A | DIRTY_WIND_NOT_ELEVATING_VIBRATION (fly) | Popper Fly (168; condition_tag:low_light_surface:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Unweighted Baitfish Streamer (150; goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (174, alt edge 6) | goal fit likely competed |
| Lake Fork<br>2025-04-30 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Popper Fly (168; condition_tag:low_light_surface:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Unweighted Baitfish Streamer (150; goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (174, alt edge 6) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| dirty_vibration_acceptable | 54 |
| clear_subtle_wind_watch | 41 |
| current_open_water_acceptable | 13 |
| other_wind_watch | 9 |
| true_dirty_stained_wind_miss | 2 |
| surface_low_light_acceptable | 1 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Sam Rayburn Reservoir<br>2025-03-28 big_fish clear A | stable_pleasant_medium_confidence_archive<br>active | Magnum Jerkbait 154<br>Football Jig 140 |
| clear_subtle_wind_watch | Lake Fork<br>2025-03-29 all_purpose clear A | stable_pleasant_medium_confidence_archive<br>active | Medium-Diving Crankbait 174<br>Suspending Jerkbait 180 |
| clear_subtle_wind_watch | Lake Fork<br>2025-03-29 big_fish clear A | stable_pleasant_medium_confidence_archive<br>active | Magnum Jerkbait 154<br>Football Jig 140 |
| clear_subtle_wind_watch | Lake Fork<br>2025-04-30 all_purpose clear A | cold_slow_or_front<br>neutral | Suspending Jerkbait 170<br>Spinnerbait 156 |
| clear_subtle_wind_watch | Lake Fork<br>2025-04-30 all_purpose clear B | cold_slow_or_front<br>neutral | Weightless Stick Worm 158<br>Soft Plastic Jerkbait 164 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-03-28 all_purpose stained A | breezy_windy_stained_reaction<br>active | Bladed Jig 162<br>Lipless Crankbait 162 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-03-28 big_fish stained A | breezy_windy_stained_reaction<br>active | Compact Flipping Jig 156<br>Magnum Jerkbait 154 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-03-28 big_fish dirty B | dirty_vibration<br>active | Bladed Jig 150<br>Football Jig 140 |
| dirty_vibration_acceptable | Lake Fork<br>2025-03-29 big_fish stained A | breezy_windy_stained_reaction<br>active | Magnum Jerkbait 154<br>Compact Flipping Jig 156 |
| dirty_vibration_acceptable | Lake Fork<br>2025-03-29 big_fish dirty A | dirty_vibration<br>active | Compact Flipping Jig 156<br>Squarebill Crankbait 140 |
| other_wind_watch | Sam Rayburn Reservoir<br>2025-03-28 big_fish stained B | breezy_windy_stained_reaction<br>active | Medium-Diving Crankbait 162<br>Football Jig 140 |
| other_wind_watch | Lake Fork<br>2025-03-29 all_purpose stained B | breezy_windy_stained_reaction<br>active | Suspending Jerkbait 180<br>Drop-Shot Minnow 154 |
| other_wind_watch | Lake Fork<br>2025-03-29 big_fish stained B | breezy_windy_stained_reaction<br>active | Medium-Diving Crankbait 162<br>Football Jig 140 |
| other_wind_watch | Lake Fork<br>2025-03-29 big_fish dirty B | dirty_vibration<br>active | Medium-Diving Crankbait 162<br>Football Jig 140 |
| other_wind_watch | Jordan Lake / Piedmont reservoir<br>2025-03-22 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Suspending Jerkbait 180<br>Soft Plastic Jerkbait 154 |
| current_open_water_acceptable | Lake of the Ozarks<br>2025-11-11 all_purpose dirty B | dirty_vibration<br>neutral | Medium-Diving Crankbait 190<br>Paddle-Tail Swimbait 168 |
| current_open_water_acceptable | Minnesota natural bass lake<br>2025-03-20 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Football Jig 154<br>Magnum Jerkbait 162 |
| current_open_water_acceptable | Minnesota natural bass lake<br>2025-03-20 all_purpose dirty A | dirty_vibration<br>neutral | Blade Bait 174<br>Medium-Diving Crankbait 170 |
| current_open_water_acceptable | Minnesota natural bass lake<br>2025-03-20 big_fish dirty B | dirty_vibration<br>neutral | Medium-Diving Crankbait 158<br>Football Jig 154 |
| current_open_water_acceptable | Illinois / Indiana natural-lake example<br>2025-10-18 all_purpose dirty A | dirty_vibration<br>active | Suspending Jerkbait 178<br>Medium-Diving Crankbait 190 |
| true_dirty_stained_wind_miss | Minnesota natural bass lake<br>2025-05-15 big_fish stained A | breezy_windy_stained_reaction<br>active | Football Jig 140<br>Magnum Jerkbait 144 |
| true_dirty_stained_wind_miss | Southwest high-desert reservoir<br>2025-04-17 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Football Jig 140<br>Magnum Jerkbait 144 |
| surface_low_light_acceptable | Minnesota natural bass lake<br>2025-07-16 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Suspending Jerkbait 186<br>Paddle-Tail Swimbait 174 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 531 |
| acceptable_fit | 1471 |
| strong_fit | 1550 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | A | fly | medium_confidence_archive | 143 |
| watch | big_fish | B | lure | medium_confidence_archive | 86 |
| watch | big_fish | B | fly | medium_confidence_archive | 75 |
| watch | big_fish | A | lure | medium_confidence_archive | 70 |
| watch | big_fish | A | fly | cold_slow_or_front | 65 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 63 |
| watch | all_purpose | A | fly | medium_confidence_archive | 60 |
| watch | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 52 |
| watch | big_fish | B | fly | cold_slow_or_front | 43 |
| watch | all_purpose | B | fly | medium_confidence_archive | 39 |
| watch | big_fish | A | fly | dirty_vibration | 39 |
| watch | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 35 |
| watch | all_purpose | A | lure | medium_confidence_archive | 35 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 32 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 30 |
| watch | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 29 |
| watch | big_fish | B | lure | cold_slow_or_front | 27 |
| watch | big_fish | A | lure | cold_slow_or_front | 25 |
| watch | all_purpose | B | fly | cold_slow_or_front | 23 |
| watch | all_purpose | B | lure | medium_confidence_archive | 23 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 23 |
| watch | all_purpose | A | fly | cold_slow_or_front | 20 |
| watch | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 18 |
| watch | big_fish | B | fly | dirty_vibration | 18 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 14 |
| watch | all_purpose | A | lure | cold_slow_or_front | 14 |
| watch | all_purpose | A | fly | dirty_vibration | 12 |
| watch | big_fish | B | lure | dirty_vibration | 12 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 11 |
| watch | all_purpose | B | lure | cold_slow_or_front | 11 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 11 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 10 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 10 |
| watch | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 9 |
| watch | big_fish | A | lure | dirty_vibration | 9 |
| watch | all_purpose | B | fly | dirty_vibration | 8 |
| watch | big_fish | A | fly | calm_low_light_surface | 8 |
| watch | big_fish | A | fly | warming_search | 8 |
| watch | big_fish | B | fly | calm_bright_clear_subtle | 8 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 7 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 7 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 7 |
| watch | big_fish | B | lure | calm_bright_clear_subtle | 7 |
| watch | all_purpose | A | lure | breezy_windy_stained_reaction | 6 |
| watch | all_purpose | B | lure | breezy_windy_stained_reaction | 6 |
| watch | all_purpose | A | fly | calm_low_light_surface | 5 |
| watch | all_purpose | A | lure | dirty_vibration | 5 |
| watch | all_purpose | A | lure | river_elevated_runoff_current | 5 |
| watch | all_purpose | B | lure | dirty_vibration | 5 |
| watch | big_fish | A | lure | heat_limited_finesse | 5 |
| watch | big_fish | B | fly | calm_low_light_surface | 5 |
| watch | all_purpose | A | lure | calm_low_light_surface | 4 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 4 |
| watch | big_fish | A | lure | calm_bright_clear_subtle | 4 |
| watch | big_fish | A | lure | warming_search | 4 |
| watch | big_fish | B | lure | heat_limited_finesse | 4 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 3 |
| watch | all_purpose | A | fly | river_elevated_runoff_current | 3 |
| watch | all_purpose | A | lure | heat_limited_finesse | 3 |
| watch | all_purpose | B | fly | calm_low_light_surface | 3 |
| watch | all_purpose | B | fly | river_elevated_runoff_current | 3 |
| watch | big_fish | A | lure | calm_low_light_surface | 3 |
| watch | all_purpose | A | fly | warming_search | 2 |
| watch | all_purpose | B | fly | warming_search | 2 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 2 |
| watch | big_fish | B | lure | calm_low_light_surface | 2 |
| watch | all_purpose | B | lure | calm_low_light_surface | 1 |
| watch | all_purpose | B | lure | heat_limited_finesse | 1 |
| watch | all_purpose | B | lure | warming_search | 1 |
| watch | big_fish | A | fly | heat_limited_finesse | 1 |
| watch | big_fish | B | fly | warming_search | 1 |
| watch | big_fish | B | lure | warming_search | 1 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 273 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 240 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 186 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 167 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 162 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 158 |
| acceptable_fit | big_fish | A | lure | medium_confidence_archive | 144 |
| acceptable_fit | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 144 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 14 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 14 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| Northern California bass lake<br>2025-10-25 stained all_purpose B | Suspending Jerkbait (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 dirty all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 194) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 stained all_purpose B | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 dirty all_purpose B | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 clear all_purpose B | Suspending Jerkbait (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Illinois / Indiana natural-lake example<br>2025-10-18 dirty all_purpose A | Medium-Diving Crankbait (honorable_lure, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Illinois / Indiana natural-lake example<br>2025-10-18 stained all_purpose A | Medium-Diving Crankbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 dirty big_fish B | Buzzbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained big_fish A | Buzzbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 dirty big_fish A | Buzzbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>calm_surface+low_light_surface+dirty_vibration+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 clear all_purpose B | Clouser Minnow (honorable_fly, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Illinois / Indiana natural-lake example<br>2025-10-18 stained all_purpose A | Clouser Minnow (honorable_fly, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained all_purpose B | Suspending Jerkbait (lure_of_the_day, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained all_purpose B | Clouser Minnow (honorable_fly, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 clear all_purpose A | Soft Plastic Jerkbait (lure_of_the_day, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 clear all_purpose A | Suspending Jerkbait (honorable_lure, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 clear all_purpose B | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 stained all_purpose A | Clouser Minnow (honorable_fly, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+dirty_vibration+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 clear all_purpose B | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Illinois / Indiana natural-lake example<br>2025-10-18 dirty all_purpose B | Lipless Crankbait (lure_of_the_day, lure, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 1248 | 498 | 40% |
| clear_subtle | 592 | 277 | 47% |
| dirty_vibration | 928 | 181 | 20% |
| heat_finesse | 96 | 19 | 20% |
| cold_slow | 720 | 381 | 53% |
| low_light_surface | 720 | 240 | 33% |
| calm_surface | 1104 | 350 | 32% |
| Big Fish upside | 1776 | 1455 | 82% |
| All Purpose reliable/versatile | 1776 | 1761 | 99% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Game Changer [fly] (253), Articulated Baitfish Streamer [fly] (214), Clouser Minnow [fly] (175), Compact Flipping Jig [lure] (172), Suspending Jerkbait [lure] (166), Baitfish Slider Fly [fly] (154), Medium-Diving Crankbait [lure] (143), Deceiver [fly] (139), Rabbit-Strip Leech [fly] (125), Magnum Jerkbait [lure] (120), Articulated Dungeon Streamer [fly] (114), Soft Plastic Jerkbait [lure] (114) |
| All-purpose | Clouser Minnow [fly] (172), Suspending Jerkbait [lure] (148), Baitfish Slider Fly [fly] (128), Soft Plastic Jerkbait [lure] (111), Deceiver [fly] (110), Medium-Diving Crankbait [lure] (80), Popper Fly [fly] (76), Unweighted Baitfish Streamer [fly] (65) |
| Big-fish | Game Changer [fly] (189), Compact Flipping Jig [lure] (172), Articulated Baitfish Streamer [fly] (164), Magnum Jerkbait [lure] (120), Articulated Dungeon Streamer [fly] (114), Rabbit-Strip Leech [fly] (111), Walking Topwater [lure] (90), Deer Hair Slider [fly] (81) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 29 | 29 | 0 | 0 | 0 |
| fly | 19 | 19 | 0 | 0 | 1 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 253/888 | 28.5% | big_fish:189, all_purpose:64 | A:148, B:105 | honorable:141, top:112 | dirty:94, clear:80, stained:79 | freshwater_lake_pond:240, freshwater_river:13 | wind_reaction:85, dirty_vibration:64, calm_surface:63, none:54 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 214/888 | 24.1% | big_fish:164, all_purpose:50 | A:116, B:98 | honorable:113, top:101 | dirty:86, stained:85, clear:43 | freshwater_lake_pond:201, freshwater_river:13 | wind_reaction:74, dirty_vibration:64, calm_surface:55, none:46 |
| Clouser Minnow<br>clouser_minnow | fly | 175/888 | 19.7% | all_purpose:172, big_fish:3 | B:105, A:70 | top:89, honorable:86 | stained:65, clear:60, dirty:50 | freshwater_lake_pond:163, freshwater_river:12 | wind_reaction:56, calm_surface:52, dirty_vibration:42, low_light_surface:34 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 172/888 | 19.4% | big_fish:172 | A:87, B:85 | honorable:132, top:40 | dirty:68, stained:68, clear:36 | freshwater_lake_pond:161, freshwater_river:11 | wind_reaction:65, dirty_vibration:58, cold_slow:39, calm_surface:37 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 166/888 | 18.7% | all_purpose:148, big_fish:18 | B:89, A:77 | top:99, honorable:67 | clear:77, stained:51, dirty:38 | freshwater_lake_pond:161, freshwater_river:5 | wind_reaction:78, dirty_vibration:47, calm_surface:43, clear_subtle:41 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 154/840 | 18.3% | all_purpose:128, big_fish:26 | B:99, A:55 | top:79, honorable:75 | dirty:60, stained:50, clear:44 | freshwater_lake_pond:152, freshwater_river:2 | wind_reaction:83, dirty_vibration:58, low_light_surface:37, calm_surface:36 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 143/888 | 16.1% | all_purpose:80, big_fish:63 | B:91, A:52 | top:85, honorable:58 | stained:52, dirty:47, clear:44 | freshwater_lake_pond:140, freshwater_river:3 | wind_reaction:98, dirty_vibration:69, open_water_search:50, none:20 |
| Deceiver<br>deceiver | fly | 139/888 | 15.7% | all_purpose:110, big_fish:29 | B:75, A:64 | top:76, honorable:63 | dirty:53, stained:46, clear:40 | freshwater_lake_pond:138, freshwater_river:1 | wind_reaction:96, dirty_vibration:68, open_water_search:46, low_light_surface:22 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 125/888 | 14.1% | big_fish:111, all_purpose:14 | A:69, B:56 | honorable:94, top:31 | stained:48, dirty:47, clear:30 | freshwater_lake_pond:114, freshwater_river:11 | cold_slow:55, wind_reaction:38, dirty_vibration:34, none:33 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 120/552 | 21.7% | big_fish:120 | A:114, B:6 | top:64, honorable:56 | clear:43, stained:42, dirty:35 | freshwater_lake_pond:113, freshwater_river:7 | wind_reaction:43, cold_slow:39, calm_surface:32, dirty_vibration:29 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 114/840 | 13.6% | all_purpose:111, big_fish:3 | A:70, B:44 | top:78, honorable:36 | clear:55, stained:39, dirty:20 | freshwater_lake_pond:107, freshwater_river:7 | calm_surface:53, clear_subtle:37, low_light_surface:27, wind_reaction:26 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 114/504 | 22.6% | big_fish:114 | B:68, A:46 | top:75, honorable:39 | dirty:41, stained:39, clear:34 | freshwater_lake_pond:114 | wind_reaction:54, dirty_vibration:38, cold_slow:35, none:18 |
| Walking Topwater<br>walking_topwater | lure | 93/528 | 17.6% | big_fish:90, all_purpose:3 | B:50, A:43 | top:65, honorable:28 | clear:34, stained:31, dirty:28 | freshwater_lake_pond:86, freshwater_river:7 | calm_surface:71, low_light_surface:41, clear_subtle:22, wind_reaction:11 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 84/840 | 10% | all_purpose:65, big_fish:19 | A:42, B:42 | honorable:52, top:32 | clear:54, dirty:15, stained:15 | freshwater_lake_pond:83, freshwater_river:1 | clear_subtle:48, calm_surface:37, low_light_surface:21, wind_reaction:21 |
| Deer Hair Slider<br>deer_hair_slider | fly | 82/528 | 15.5% | big_fish:81, all_purpose:1 | A:46, B:36 | top:43, honorable:39 | clear:30, dirty:27, stained:25 | freshwater_lake_pond:76, freshwater_river:6 | calm_surface:55, low_light_surface:38, clear_subtle:20, wind_reaction:17 |
| Bluegill Streamer<br>bluegill_streamer | fly | 78/408 | 19.1% | big_fish:78 | A:42, B:36 | top:49, honorable:29 | stained:31, clear:29, dirty:18 | freshwater_lake_pond:78 | calm_surface:39, clear_subtle:20, low_light_surface:16, none:15 |
| Football Jig<br>football_jig | lure | 78/360 | 21.7% | big_fish:78 | A:44, B:34 | honorable:42, top:36 | clear:30, dirty:24, stained:24 | freshwater_lake_pond:78 | wind_reaction:40, dirty_vibration:24, cold_slow:22, none:18 |
| Popper Fly<br>popper_fly | fly | 77/468 | 16.5% | all_purpose:76, big_fish:1 | A:44, B:33 | top:56, honorable:21 | dirty:26, stained:26, clear:25 | freshwater_lake_pond:73, freshwater_river:4 | calm_surface:60, low_light_surface:31, clear_subtle:17, wind_reaction:11 |
| Spinnerbait<br>spinnerbait | lure | 76/888 | 8.6% | all_purpose:60, big_fish:16 | B:40, A:36 | honorable:38, top:38 | dirty:37, stained:30, clear:9 | freshwater_lake_pond:69, freshwater_river:7 | wind_reaction:38, dirty_vibration:37, low_light_surface:24, calm_surface:19 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 71/840 | 8.5% | all_purpose:42, big_fish:29 | B:40, A:31 | honorable:45, top:26 | dirty:33, stained:27, clear:11 | freshwater_lake_pond:63, freshwater_river:8 | wind_reaction:42, dirty_vibration:39, low_light_surface:32, cold_slow:13 |
| Wake Bait<br>wake_bait | lure | 71/384 | 18.5% | big_fish:66, all_purpose:5 | A:48, B:23 | top:48, honorable:23 | stained:26, clear:23, dirty:22 | freshwater_lake_pond:71 | calm_surface:58, low_light_surface:28, clear_subtle:17, wind_reaction:10 |
| Woolly Bugger<br>woolly_bugger | fly | 66/888 | 7.4% | all_purpose:62, big_fish:4 | B:35, A:31 | honorable:45, top:21 | clear:26, stained:23, dirty:17 | freshwater_lake_pond:57, freshwater_river:9 | cold_slow:35, wind_reaction:24, dirty_vibration:18, clear_subtle:10 |
| Lipless Crankbait<br>lipless_crankbait | lure | 63/888 | 7.1% | all_purpose:39, big_fish:24 | B:35, A:28 | honorable:35, top:28 | dirty:32, stained:22, clear:9 | freshwater_lake_pond:63 | wind_reaction:44, open_water_search:38, dirty_vibration:35, low_light_surface:10 |
| Tube Jig<br>tube_jig | lure | 62/888 | 7% | all_purpose:53, big_fish:9 | B:32, A:30 | honorable:36, top:26 | clear:35, stained:22, dirty:5 | freshwater_lake_pond:56, freshwater_river:6 | cold_slow:37, clear_subtle:19, wind_reaction:19, calm_surface:10 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 62/840 | 7.4% | all_purpose:60, big_fish:2 | B:37, A:25 | honorable:31, top:31 | clear:38, stained:18, dirty:6 | freshwater_lake_pond:62 | clear_subtle:30, cold_slow:30, calm_surface:25, wind_reaction:15 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 60/888 | 6.8% | all_purpose:45, big_fish:15 | B:39, A:21 | honorable:40, top:20 | dirty:27, stained:20, clear:13 | freshwater_lake_pond:57, freshwater_river:3 | none:21, calm_surface:16, warming_search:11, low_light_surface:10 |
| Buzzbait<br>buzzbait | lure | 59/528 | 11.2% | big_fish:53, all_purpose:6 | A:31, B:28 | top:42, honorable:17 | dirty:25, stained:24, clear:10 | freshwater_lake_pond:49, freshwater_river:10 | low_light_surface:43, calm_surface:30, dirty_vibration:23, wind_reaction:19 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 48/288 | 16.7% | all_purpose:47, big_fish:1 | B:33, A:15 | top:36, honorable:12 | clear:16, dirty:16, stained:16 | freshwater_lake_pond:41, freshwater_river:7 | calm_surface:39, low_light_surface:16, clear_subtle:12, dirty_vibration:8 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 45/888 | 5.1% | all_purpose:37, big_fish:8 | B:31, A:14 | honorable:29, top:16 | clear:30, stained:12, dirty:3 | freshwater_lake_pond:43, freshwater_river:2 | clear_subtle:22, calm_surface:20, none:11, heat_finesse:9 |
| Magnum Worm<br>magnum_worm | lure | 44/336 | 13.1% | big_fish:44 | B:26, A:18 | honorable:29, top:15 | clear:19, dirty:13, stained:12 | freshwater_lake_pond:44 | calm_surface:17, none:15, clear_subtle:14, open_water_search:9 |
| Bladed Jig<br>bladed_jig | lure | 43/888 | 4.8% | all_purpose:38, big_fish:5 | B:23, A:20 | honorable:25, top:18 | dirty:33, stained:10 | freshwater_lake_pond:37, freshwater_river:6 | dirty_vibration:24, wind_reaction:18, calm_surface:12, low_light_surface:8 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 43/840 | 5.1% | all_purpose:24, big_fish:19 | B:29, A:14 | top:23, honorable:20 | clear:24, stained:12, dirty:7 | freshwater_lake_pond:40, freshwater_river:3 | cold_slow:24, calm_surface:18, clear_subtle:18, wind_reaction:5 |
| Swim Jig<br>swim_jig | lure | 41/888 | 4.6% | all_purpose:38, big_fish:3 | A:21, B:20 | honorable:22, top:19 | dirty:29, stained:12 | freshwater_lake_pond:39, freshwater_river:2 | calm_surface:22, none:10, low_light_surface:9, warming_search:6 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 36/888 | 4.1% | all_purpose:35, big_fish:1 | A:25, B:11 | honorable:21, top:15 | clear:27, dirty:7, stained:2 | freshwater_lake_pond:33, freshwater_river:3 | clear_subtle:24, cold_slow:16, calm_surface:13, wind_reaction:7 |
| Mouse Fly<br>mouse_fly | fly | 35/336 | 10.4% | big_fish:35 | A:18, B:17 | top:25, honorable:10 | clear:16, stained:10, dirty:9 | freshwater_lake_pond:35 | calm_surface:30, low_light_surface:15, clear_subtle:12, wind_reaction:4 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 35/288 | 12.2% | all_purpose:34, big_fish:1 | B:20, A:15 | honorable:19, top:16 | clear:14, dirty:11, stained:10 | freshwater_lake_pond:33, freshwater_river:2 | calm_surface:18, low_light_surface:11, clear_subtle:9, wind_reaction:8 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 29/888 | 3.3% | all_purpose:29 | A:17, B:12 | honorable:18, top:11 | clear:12, stained:12, dirty:5 | freshwater_lake_pond:27, freshwater_river:2 | cold_slow:25, wind_reaction:13, dirty_vibration:6, clear_subtle:3 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 28/840 | 3.3% | all_purpose:15, big_fish:13 | B:15, A:13 | honorable:14, top:14 | dirty:18, clear:5, stained:5 | freshwater_lake_pond:28 | none:14, cold_slow:12, wind_reaction:6, dirty_vibration:5 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 28/204 | 13.7% | all_purpose:25, big_fish:3 | A:17, B:11 | top:18, honorable:10 | clear:12, dirty:8, stained:8 | freshwater_lake_pond:20, freshwater_river:8 | cold_slow:14, wind_reaction:11, dirty_vibration:8, clear_subtle:4 |
| Frog Fly<br>frog_fly | fly | 28/192 | 14.6% | big_fish:28 | A:15, B:13 | honorable:14, top:14 | clear:10, dirty:10, stained:8 | freshwater_lake_pond:28 | calm_surface:19, low_light_surface:16, wind_reaction:9, clear_subtle:7 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 24/192 | 12.5% | big_fish:24 | B:13, A:11 | top:14, honorable:10 | clear:9, dirty:8, stained:7 | freshwater_lake_pond:24 | calm_surface:18, low_light_surface:12, clear_subtle:6, cold_slow:3 |
| Blade Bait<br>blade_bait | lure | 20/888 | 2.3% | all_purpose:18, big_fish:2 | B:12, A:8 | honorable:10, top:10 | dirty:11, clear:5, stained:4 | freshwater_lake_pond:19, freshwater_river:1 | cold_slow:11, wind_reaction:8, open_water_search:7, dirty_vibration:4 |
| Ned Rig<br>ned_rig | lure | 16/396 | 4% | all_purpose:14, big_fish:2 | B:11, A:5 | honorable:8, top:8 | dirty:8, clear:6, stained:2 | freshwater_lake_pond:12, freshwater_river:4 | cold_slow:10, wind_reaction:4, heat_finesse:3, none:3 |
| Feather Jig Leech<br>feather_jig_leech | fly | 11/888 | 1.2% | all_purpose:10, big_fish:1 | A:8, B:3 | honorable:6, top:5 | clear:4, stained:4, dirty:3 | freshwater_lake_pond:7, freshwater_river:4 | warming_search:7, current_swing:4, none:4, dirty_vibration:2 |
| Finesse Jig<br>finesse_jig | lure | 11/396 | 2.8% | all_purpose:11 | B:8, A:3 | honorable:8, top:3 | clear:7, stained:4 | freshwater_lake_pond:9, freshwater_river:2 | cold_slow:9, clear_subtle:3, heat_finesse:2, wind_reaction:2 |
| Glide Bait<br>glidebait | lure | 8/36 | 22.2% | big_fish:8 | A:6, B:2 | honorable:4, top:4 | clear:3, stained:3, dirty:2 | freshwater_lake_pond:8 | cold_slow:5, none:3, calm_surface:2, clear_subtle:2 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 7/396 | 1.8% | all_purpose:7 | B:5, A:2 | honorable:5, top:2 | stained:3, clear:2, dirty:2 | freshwater_lake_pond:7 | cold_slow:5, clear_subtle:2, heat_finesse:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/48 | 2.1% | big_fish:1 | A:1 | honorable:1 | clear:1 | freshwater_lake_pond:1 | clear_subtle:1, cold_slow:1 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 253/3552 (7.1%) | 112/1776 (6.3%) | 141/1776 (7.9%) | - | 253/1776 (14.2%) |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 214/3552 (6%) | 101/1776 (5.7%) | 113/1776 (6.4%) | - | 214/1776 (12%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 175/3552 (4.9%) | 89/1776 (5%) | 86/1776 (4.8%) | - | 175/1776 (9.9%) |  |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 172/3552 (4.8%) | 40/1776 (2.3%) | 132/1776 (7.4%) | 172/1776 (9.7%) | - |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 166/3552 (4.7%) | 99/1776 (5.6%) | 67/1776 (3.8%) | 166/1776 (9.3%) | - |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 154/3552 (4.3%) | 79/1776 (4.4%) | 75/1776 (4.2%) | - | 154/1776 (8.7%) |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 143/3552 (4%) | 85/1776 (4.8%) | 58/1776 (3.3%) | 143/1776 (8.1%) | - |  |
| Deceiver<br>deceiver | fly | 139/3552 (3.9%) | 76/1776 (4.3%) | 63/1776 (3.5%) | - | 139/1776 (7.8%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 125/3552 (3.5%) | 31/1776 (1.7%) | 94/1776 (5.3%) | - | 125/1776 (7%) |  |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 120/3552 (3.4%) | 64/1776 (3.6%) | 56/1776 (3.2%) | 120/1776 (6.8%) | - |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 114/3552 (3.2%) | 75/1776 (4.2%) | 39/1776 (2.2%) | - | 114/1776 (6.4%) |  |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 114/3552 (3.2%) | 78/1776 (4.4%) | 36/1776 (2%) | 114/1776 (6.4%) | - |  |
| Walking Topwater<br>walking_topwater | lure | 93/3552 (2.6%) | 65/1776 (3.7%) | 28/1776 (1.6%) | 93/1776 (5.2%) | - |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 84/3552 (2.4%) | 32/1776 (1.8%) | 52/1776 (2.9%) | - | 84/1776 (4.7%) |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 82/3552 (2.3%) | 43/1776 (2.4%) | 39/1776 (2.2%) | - | 82/1776 (4.6%) |  |
| Bluegill Streamer<br>bluegill_streamer | fly | 78/3552 (2.2%) | 49/1776 (2.8%) | 29/1776 (1.6%) | - | 78/1776 (4.4%) |  |
| Football Jig<br>football_jig | lure | 78/3552 (2.2%) | 36/1776 (2%) | 42/1776 (2.4%) | 78/1776 (4.4%) | - |  |
| Popper Fly<br>popper_fly | fly | 77/3552 (2.2%) | 56/1776 (3.2%) | 21/1776 (1.2%) | - | 77/1776 (4.3%) |  |
| Spinnerbait<br>spinnerbait | lure | 76/3552 (2.1%) | 38/1776 (2.1%) | 38/1776 (2.1%) | 76/1776 (4.3%) | - |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 71/3552 (2%) | 26/1776 (1.5%) | 45/1776 (2.5%) | 71/1776 (4%) | - |  |
| Wake Bait<br>wake_bait | lure | 71/3552 (2%) | 48/1776 (2.7%) | 23/1776 (1.3%) | 71/1776 (4%) | - |  |
| Woolly Bugger<br>woolly_bugger | fly | 66/3552 (1.9%) | 21/1776 (1.2%) | 45/1776 (2.5%) | - | 66/1776 (3.7%) |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 63/3552 (1.8%) | 28/1776 (1.6%) | 35/1776 (2%) | 63/1776 (3.5%) | - |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 62/3552 (1.7%) | 31/1776 (1.7%) | 31/1776 (1.7%) | 62/1776 (3.5%) | - |  |
| Tube Jig<br>tube_jig | lure | 62/3552 (1.7%) | 26/1776 (1.5%) | 36/1776 (2%) | 62/1776 (3.5%) | - |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 60/3552 (1.7%) | 20/1776 (1.1%) | 40/1776 (2.3%) | 60/1776 (3.4%) | - |  |
| Buzzbait<br>buzzbait | lure | 59/3552 (1.7%) | 42/1776 (2.4%) | 17/1776 (1%) | 59/1776 (3.3%) | - |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 48/3552 (1.4%) | 36/1776 (2%) | 12/1776 (0.7%) | - | 48/1776 (2.7%) |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 45/3552 (1.3%) | 16/1776 (0.9%) | 29/1776 (1.6%) | 45/1776 (2.5%) | - |  |
| Magnum Worm<br>magnum_worm | lure | 44/3552 (1.2%) | 15/1776 (0.8%) | 29/1776 (1.6%) | 44/1776 (2.5%) | - |  |
| Bladed Jig<br>bladed_jig | lure | 43/3552 (1.2%) | 18/1776 (1%) | 25/1776 (1.4%) | 43/1776 (2.4%) | - |  |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 43/3552 (1.2%) | 23/1776 (1.3%) | 20/1776 (1.1%) | 43/1776 (2.4%) | - |  |
| Swim Jig<br>swim_jig | lure | 41/3552 (1.2%) | 19/1776 (1.1%) | 22/1776 (1.2%) | 41/1776 (2.3%) | - |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 36/3552 (1%) | 15/1776 (0.8%) | 21/1776 (1.2%) | - | 36/1776 (2%) |  |
| Mouse Fly<br>mouse_fly | fly | 35/3552 (1%) | 25/1776 (1.4%) | 10/1776 (0.6%) | - | 35/1776 (2%) |  |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 35/3552 (1%) | 16/1776 (0.9%) | 19/1776 (1.1%) | 35/1776 (2%) | - |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 29/3552 (0.8%) | 11/1776 (0.6%) | 18/1776 (1%) | - | 29/1776 (1.6%) |  |
| Frog Fly<br>frog_fly | fly | 28/3552 (0.8%) | 14/1776 (0.8%) | 14/1776 (0.8%) | - | 28/1776 (1.6%) |  |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 28/3552 (0.8%) | 18/1776 (1%) | 10/1776 (0.6%) | - | 28/1776 (1.6%) |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 28/3552 (0.8%) | 14/1776 (0.8%) | 14/1776 (0.8%) | 28/1776 (1.6%) | - |  |
| Hollow-Body Frog<br>hollow_body_frog | lure | 24/3552 (0.7%) | 14/1776 (0.8%) | 10/1776 (0.6%) | 24/1776 (1.4%) | - |  |
| Blade Bait<br>blade_bait | lure | 20/3552 (0.6%) | 10/1776 (0.6%) | 10/1776 (0.6%) | 20/1776 (1.1%) | - |  |
| Ned Rig<br>ned_rig | lure | 16/3552 (0.5%) | 8/1776 (0.5%) | 8/1776 (0.5%) | 16/1776 (0.9%) | - |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 11/3552 (0.3%) | 5/1776 (0.3%) | 6/1776 (0.3%) | - | 11/1776 (0.6%) |  |
| Finesse Jig<br>finesse_jig | lure | 11/3552 (0.3%) | 3/1776 (0.2%) | 8/1776 (0.5%) | 11/1776 (0.6%) | - |  |
| Glide Bait<br>glidebait | lure | 8/3552 (0.2%) | 4/1776 (0.2%) | 4/1776 (0.2%) | 8/1776 (0.5%) | - |  |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 7/3552 (0.2%) | 2/1776 (0.1%) | 5/1776 (0.3%) | 7/1776 (0.4%) | - |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/3552 (0%) | 0/1776 (0%) | 1/1776 (0.1%) | 1/1776 (0.1%) | - |  |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 253/888 | 28.5% | big_fish:189, all_purpose:64 | wind_reaction:85, dirty_vibration:64, calm_surface:63, none:54, open_water_search:44 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Wake Bait<br>wake_bait | lure | home-window >25% overdominant | 71/264 | 26.9% | goal_tags:127 | AP/BF 5/132, 66/132<br>clarity clear:88, dirty:88, stained:88<br>bucket stable_pleasant_medium_confidence_archive:108, calm_low_light_surface:60, cold_slow_or_front:36 |
| Football Jig<br>football_jig | lure | home-window >25% overdominant | 33/124 | 26.6% | goal_tags:58 | AP/BF 0/54, 33/70<br>clarity clear:84, stained:40<br>bucket cold_slow_or_front:80, stable_pleasant_medium_confidence_archive:18, calm_bright_clear_subtle:12 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | home-window >25% overdominant | 83/312 | 26.6% | goal_tags:113 | AP/BF 47/156, 36/156<br>clarity dirty:156, stained:156<br>bucket dirty_vibration:112, breezy_windy_stained_reaction:104, stable_pleasant_medium_confidence_archive:68 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | home-window >20% watch | 30/120 | 25% | goal_tags:44 | AP/BF 28/60, 2/60<br>clarity clear:120<br>bucket calm_bright_clear_subtle:36, stable_pleasant_medium_confidence_archive:32, calm_low_light_surface:24 |
| Walking Topwater<br>walking_topwater | lure | home-window >20% watch | 76/312 | 24.4% | goal_tags:152 | AP/BF 3/156, 73/156<br>clarity clear:104, dirty:104, stained:104<br>bucket stable_pleasant_medium_confidence_archive:128, calm_low_light_surface:72, cold_slow_or_front:40 |
| Foam Gurgler<br>foam_gurgler_fly | fly | home-window >20% watch | 48/204 | 23.5% | goal_tags:97 | AP/BF 47/102, 1/102<br>clarity clear:68, dirty:68, stained:68<br>bucket stable_pleasant_medium_confidence_archive:88, cold_slow_or_front:36, calm_bright_clear_subtle:28 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | home-window >20% watch | 20/88 | 22.7% | goal_tags:45 | AP/BF 17/44, 3/44<br>clarity clear:52, stained:20, dirty:16<br>bucket cold_slow_or_front:48, breezy_windy_stained_reaction:8, dirty_vibration:8 |
| Popper Fly<br>popper_fly | fly | home-window >20% watch | 62/276 | 22.5% | goal_tags:131 | AP/BF 61/138, 1/138<br>clarity clear:92, dirty:92, stained:92<br>bucket stable_pleasant_medium_confidence_archive:116, calm_low_light_surface:60, cold_slow_or_front:36 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | home-window >20% watch | 31/140 | 22.1% | goal_tags:69 | AP/BF 0/62, 31/78<br>clarity clear:96, stained:44<br>bucket cold_slow_or_front:88, stable_pleasant_medium_confidence_archive:18, calm_bright_clear_subtle:12 |
| Deer Hair Slider<br>deer_hair_slider | fly | home-window >20% watch | 65/312 | 20.8% | goal_tags:174 | AP/BF 0/156, 65/156<br>clarity clear:104, dirty:104, stained:104<br>bucket stable_pleasant_medium_confidence_archive:128, calm_low_light_surface:72, cold_slow_or_front:40 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Wake Bait<br>wake_bait | lure | 71/3552 (2%) | 48/1776 (2.7%) | 23/1776 (1.3%) | 71/1776 (4%) | 71/264 (26.9%) | 48/264 (18.2%) / 23/264 (8.7%) | home>20%<br>home>25% |
| Football Jig<br>football_jig | lure | 78/3552 (2.2%) | 36/1776 (2%) | 42/1776 (2.4%) | 78/1776 (4.4%) | 33/124 (26.6%) | 15/124 (12.1%) / 18/124 (14.5%) | home>20%<br>home>25% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 143/3552 (4%) | 85/1776 (4.8%) | 58/1776 (3.3%) | 143/1776 (8.1%) | 83/312 (26.6%) | 52/312 (16.7%) / 31/312 (9.9%) | home>20%<br>home>25% |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 114/3552 (3.2%) | 78/1776 (4.4%) | 36/1776 (2%) | 114/1776 (6.4%) | 30/120 (25%) | 24/120 (20%) / 6/120 (5%) | home>20% |
| Walking Topwater<br>walking_topwater | lure | 93/3552 (2.6%) | 65/1776 (3.7%) | 28/1776 (1.6%) | 93/1776 (5.2%) | 76/312 (24.4%) | 55/312 (17.6%) / 21/312 (6.7%) | home>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 48/3552 (1.4%) | 36/1776 (2%) | 12/1776 (0.7%) | 48/1776 (2.7%) | 48/204 (23.5%) | 36/204 (17.6%) / 12/204 (5.9%) | home>20% |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 28/3552 (0.8%) | 18/1776 (1%) | 10/1776 (0.6%) | 28/1776 (1.6%) | 20/88 (22.7%) | 13/88 (14.8%) / 7/88 (8%) | home>20% |
| Popper Fly<br>popper_fly | fly | 77/3552 (2.2%) | 56/1776 (3.2%) | 21/1776 (1.2%) | 77/1776 (4.3%) | 62/276 (22.5%) | 44/276 (15.9%) / 18/276 (6.5%) | home>20% |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 172/3552 (4.8%) | 40/1776 (2.3%) | 132/1776 (7.4%) | 172/1776 (9.7%) | 31/140 (22.1%) | 7/140 (5%) / 24/140 (17.1%) | home>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 82/3552 (2.3%) | 43/1776 (2.4%) | 39/1776 (2.2%) | 82/1776 (4.6%) | 65/312 (20.8%) | 32/312 (10.3%) / 33/312 (10.6%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.80.
Average expanded finalist pool size: 3.75.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 1187.
Rows/slots with expanded finalist pool size 1: 532.
Selected-tier singleton slots expanded above 1: 655.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.20 | 3.54 | 1 | 1 | 377 | 134 |
| fly/top | 2.29 | 3.31 | 1 | 1 | 320 | 141 |
| lure/honorable | 3.52 | 4.20 | 1 | 1 | 237 | 116 |
| lure/top | 3.17 | 3.96 | 1 | 1 | 253 | 141 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1900 |
| goal_or_priority_condition | 1508 |
| credible_fallback | 144 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 2569 |
| goal_and_priority_condition | 1900 |
| credible_fallback | 398 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 247 |
| family_diversity_scarcity | 210 |
| surface_safety_scarcity | 75 |

Representative expanded singleton finalist pools:
- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__all_purpose__B fly/top: unweighted_baitfish_streamer (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B lure/top: flat_sided_crankbait (goal_or_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B lure/honorable: suspending_jerkbait (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B fly/honorable: unweighted_baitfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__big_fish__B lure/honorable: glidebait (goal_or_priority_condition; family_diversity_scarcity)
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

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 4.62 |
| Different-presentation close candidates | 1.72 |
| Different-family close candidates | 2.56 |
| Final expanded Set B pool | 2.40 |
| Same-family/same-presentation reintroduced | 87/1776 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 232 |
| Coverage pool used | 69 |
| Average used coverage pool size | 4.41 |
| Singleton used coverage pools | 2 |
| Broad pool larger than narrowed pool | 33 |
| Broad pool same as narrowed pool | 36 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 6 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 163 |
| broad | 69 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| bladed_jig | 54 |
| spinnerbait | 52 |
| medium_diving_crankbait | 47 |
| lipless_crankbait | 45 |
| squarebill_crankbait | 44 |
| suspending_jerkbait | 31 |
| compact_flipping_jig | 17 |
| buzzbait | 14 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| compact_flipping_jig | 20 |
| medium_diving_crankbait | 13 |
| squarebill_crankbait | 8 |
| magnum_jerkbait | 7 |
| bladed_jig | 6 |
| lipless_crankbait | 5 |
| spinnerbait | 5 |
| buzzbait | 4 |
| suspending_jerkbait | 1 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

- sc_santee_cooper__2025-05-18__freshwater_lake_pond__stained__all_purpose__A: Spinnerbait; pool bladed_jig, buzzbait, lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- mn_minnetonka__2025-03-20__freshwater_lake_pond__stained__all_purpose__A: Lipless Crankbait; pool bladed_jig, compact_flipping_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, suspending_jerkbait
- mn_minnetonka__2025-03-20__freshwater_lake_pond__stained__all_purpose__B: Spinnerbait; pool bladed_jig, compact_flipping_jig, medium_diving_crankbait, spinnerbait, suspending_jerkbait
- mn_minnetonka__2025-03-20__freshwater_lake_pond__dirty__all_purpose__B: Spinnerbait; pool bladed_jig, compact_flipping_jig, lipless_crankbait, spinnerbait, suspending_jerkbait
- co_pueblo__2025-08-12__freshwater_lake_pond__dirty__all_purpose__B: Lipless Crankbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, squarebill_crankbait
- ca_clear_lake__2025-08-16__freshwater_lake_pond__stained__big_fish__B: Lipless Crankbait; pool bladed_jig, lipless_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 1440 | 0 | 0 |
| caution | 576 | 0 | 16 |

Caution-gate surface finalist examples:
- fl_okeechobee__2025-08-18__freshwater_lake_pond__stained__big_fish__B lure/honorable: wake_bait, walking_topwater
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__clear__big_fish__B lure/honorable: buzzbait, wake_bait
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__big_fish__B lure/honorable: buzzbait
- tx_lake_fork__2025-06-15__freshwater_lake_pond__clear__big_fish__B lure/honorable: wake_bait, walking_topwater
- tx_lake_fork__2025-06-15__freshwater_lake_pond__stained__big_fish__B lure/honorable: wake_bait, walking_topwater
- al_guntersville__2025-04-11__freshwater_lake_pond__dirty__big_fish__B lure/honorable: buzzbait
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
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | largemouth_bass, smallmouth_bass | crankbait_medium | crankbait | mid<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | largemouth_bass, smallmouth_bass | soft_plastic_craw | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 4: cover_ambush, cold_slow, clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Wake Bait<br>wake_bait | lure | largemouth_bass, smallmouth_bass | surface_wake | topwater_open | surface<br>slow/medium | 3: surface_prey, baitfish, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Deer Hair Slider<br>deer_hair_slider | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_slider | surface_fly_slider | surface<br>medium/fast | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | true | 8 |
| Popper Fly<br>popper_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_popper | surface_fly_popper_slider | surface<br>medium/slow | 2: surface_prey, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 8 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | largemouth_bass, smallmouth_bass, trout | soft_plastic_worm | worm_finesse | bottom<br>slow | 2: leech_worm, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 2: reliable_action, versatile_search | freshwater_lake_pond | false | 8 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_deep | crankbait | bottom<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 2: open_water_search, cold_slow | 1: versatile_search | freshwater_lake_pond | false | 8 |
| Finesse Jig<br>finesse_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, leech_worm | 2: clear, stained | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | largemouth_bass, smallmouth_bass, northern_pike | swimbait | swimbait | mid<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Shaky-Head Worm<br>shaky_head_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Spinnerbait<br>spinnerbait | lure | largemouth_bass, smallmouth_bass, northern_pike | safety_pin_spinner | spinner_vibration | mid<br>medium/slow | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, dirty_vibration, cover_ambush | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium/fast | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: cover_ambush, dirty_vibration, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | largemouth_bass, smallmouth_bass, trout | jerkbait | jerkbait | mid<br>medium | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, wind_reaction | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Walking Topwater<br>walking_topwater | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_walking | topwater_open | surface<br>medium | 2: surface_prey, baitfish | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 8 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | upper<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: clear_subtle, heat_finesse | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bluegill Streamer<br>bluegill_streamer | fly | largemouth_bass | bluegill_streamer | baitfish_streamer | mid<br>slow/medium | 2: bluegill_perch, baitfish | 2: clear, stained | 2: cover_ambush, warming_search | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Deceiver<br>deceiver | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_baitfish | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Feather Jig Leech<br>feather_jig_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: warming_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, clear_subtle | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Mouse Fly<br>mouse_fly | fly | largemouth_bass, trout | fly_mouse | surface_fly_frog_mouse | surface<br>slow/medium | 1: surface_prey | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_unweighted | baitfish_streamer | upper<br>medium/slow | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | largemouth_bass, smallmouth_bass | crawfish_fly | crawfish_fly | bottom<br>slow/medium | 1: crawfish | 3: clear, stained, dirty | 2: cover_ambush, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Woolly Bugger<br>woolly_bugger | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | bugger_streamer | leech_bugger | mid<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 2: cold_slow, open_water_search | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | largemouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, bluegill_perch | 2: stained, dirty | 2: cover_ambush, dirty_vibration | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | largemouth_bass, smallmouth_bass, trout | soft_plastic_minnow | drop_shot_minnow | mid<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Football Jig<br>football_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: cold_slow, cover_ambush | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | largemouth_bass, smallmouth_bass | jerkbait | jerkbait | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, open_water_search | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Magnum Worm<br>magnum_worm | lure | largemouth_bass | soft_plastic_worm | worm_power | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cover_ambush, heat_finesse | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | largemouth_bass, smallmouth_bass, northern_pike | jerkbait_soft | jerkbait | upper<br>medium/slow | 1: baitfish | 2: clear, stained | 2: clear_subtle, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Swim Jig<br>swim_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_swimming | swim_jig | mid<br>medium/fast | 2: bluegill_perch, baitfish | 2: stained, dirty | 2: cover_ambush, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Tube Jig<br>tube_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | tube_jig | ned_tube_finesse | bottom<br>slow/medium | 2: crawfish, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Bladed Jig<br>bladed_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | bladed_jig | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: dirty_vibration, cover_ambush | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium | 1: baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 6 |
| Lipless Crankbait<br>lipless_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_lipless | crankbait | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 214/888 | 19/64 | goal_tags>1<br>versatile_search+big_fish_upside |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 114/504 | 0/0 | goal_tags>1 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 154/840 | 13/56 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 175/888 | 15/64 | goal_tags>1 |
| Deceiver<br>deceiver | fly | 7 | 139/888 | 19/64 | clear+stained+dirty clarity |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 82/528 | 65/312 | clear+stained+dirty clarity<br>home-window share>20% |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 11/888 | 0/0 | clear+stained+dirty clarity |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 48/288 | 48/204 | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Frog Fly<br>frog_fly | fly | 9 | 28/192 | 16/96 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Game Changer<br>game_changer | fly | 7 | 253/888 | 23/64 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25% |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 29/888 | 0/0 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 36/888 | 0/0 | clear+stained+dirty clarity |
| Mouse Fly<br>mouse_fly | fly | 7 | 35/336 | 0/0 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Popper Fly<br>popper_fly | fly | 8 | 77/468 | 62/276 | goal_tags>1<br>home-window share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 125/888 | 62/344 | goal_tags>1<br>reliable_action+big_fish_upside |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 28/204 | 20/88 | clear+stained+dirty clarity<br>home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 66/888 | 41/300 | clear+stained+dirty clarity |
| Blade Bait<br>blade_bait | lure | 7 | 20/888 | 0/0 | clear+stained+dirty clarity |
| Buzzbait<br>buzzbait | lure | 9 | 59/528 | 44/312 | goal_tags>1<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 62/840 | 46/284 | goal_tags>1 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 7 | 172/888 | 31/140 | home-window share>20% |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 28/840 | 14/288 | clear+stained+dirty clarity |
| Football Jig<br>football_jig | lure | 7 | 78/360 | 33/124 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Glide Bait<br>glidebait | lure | 9 | 8/36 | 0/0 | goal_tags>1 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 9 | 24/192 | 16/96 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Magnum Worm<br>magnum_worm | lure | 7 | 44/336 | 0/0 | clear+stained+dirty clarity |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 9 | 143/888 | 83/312 | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20%<br>home-window share>25% overdominant |
| Ned Rig<br>ned_rig | lure | 9 | 16/396 | 7/136 | clear+stained+dirty clarity |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 60/888 | 9/64 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 1/48 | 1/16 | clear+stained+dirty clarity |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 114/840 | 30/120 | goal_tags>1<br>home-window share>20% |
| Spinnerbait<br>spinnerbait | lure | 8 | 76/888 | 42/312 | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 71/840 | 42/288 | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 166/888 | 38/204 | goal_tags>1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 7/396 | 4/124 | condition_tags>3<br>clear+stained+dirty clarity |
| Wake Bait<br>wake_bait | lure | 9 | 71/384 | 71/264 | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20%<br>home-window share>25% overdominant |
| Walking Topwater<br>walking_topwater | lure | 8 | 93/528 | 76/312 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 35/288 | 9/52 | clear+stained+dirty clarity<br>goal_tags>1 |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 7 | 253/888 (28.5%) | 23/64 (35.9%) | big_fish:189, all_purpose:64 | honorable:141, top:112 | wind_reaction:85, dirty_vibration:64, calm_surface:63, none:54, open_water_search:44 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 214/888 (24.1%) | 19/64 (29.7%) | big_fish:164, all_purpose:50 | honorable:113, top:101 | wind_reaction:74, dirty_vibration:64, calm_surface:55, none:46, open_water_search:43 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 175/888 (19.7%) | 15/64 (23.4%) | all_purpose:172, big_fish:3 | top:89, honorable:86 | wind_reaction:56, calm_surface:52, dirty_vibration:42, low_light_surface:34, none:31 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 7 | 172/888 (19.4%) | 31/140 (22.1%) | big_fish:172 | honorable:132, top:40 | wind_reaction:65, dirty_vibration:58, cold_slow:39, calm_surface:37, none:33 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 166/888 (18.7%) | 38/204 (18.6%) | all_purpose:148, big_fish:18 | top:99, honorable:67 | wind_reaction:78, dirty_vibration:47, calm_surface:43, clear_subtle:41, cold_slow:36 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 154/840 (18.3%) | 13/56 (23.2%) | all_purpose:128, big_fish:26 | top:79, honorable:75 | wind_reaction:83, dirty_vibration:58, low_light_surface:37, calm_surface:36, open_water_search:31 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 9 | 143/888 (16.1%) | 83/312 (26.6%) | all_purpose:80, big_fish:63 | top:85, honorable:58 | wind_reaction:98, dirty_vibration:69, open_water_search:50, none:20, cold_slow:19 |
| Deceiver<br>deceiver | fly | 7 | 139/888 (15.7%) | 19/64 (29.7%) | all_purpose:110, big_fish:29 | top:76, honorable:63 | wind_reaction:96, dirty_vibration:68, open_water_search:46, low_light_surface:22, none:20 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 125/888 (14.1%) | 62/344 (18%) | big_fish:111, all_purpose:14 | honorable:94, top:31 | cold_slow:55, wind_reaction:38, dirty_vibration:34, none:33, calm_surface:18 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 7 | 120/552 (21.7%) | 0/0 | big_fish:120 | top:64, honorable:56 | wind_reaction:43, cold_slow:39, calm_surface:32, dirty_vibration:29, clear_subtle:20 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 114/504 (22.6%) | 0/0 | big_fish:114 | top:75, honorable:39 | wind_reaction:54, dirty_vibration:38, cold_slow:35, none:18, calm_surface:17 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 114/840 (13.6%) | 30/120 (25%) | all_purpose:111, big_fish:3 | top:78, honorable:36 | calm_surface:53, clear_subtle:37, low_light_surface:27, wind_reaction:26, cold_slow:15 |
| Walking Topwater<br>walking_topwater | lure | 8 | 93/528 (17.6%) | 76/312 (24.4%) | big_fish:90, all_purpose:3 | top:65, honorable:28 | calm_surface:71, low_light_surface:41, clear_subtle:22, wind_reaction:11, cold_slow:9 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 84/840 (10%) | 6/56 (10.7%) | all_purpose:65, big_fish:19 | honorable:52, top:32 | clear_subtle:48, calm_surface:37, low_light_surface:21, wind_reaction:21, cold_slow:12 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 82/528 (15.5%) | 65/312 (20.8%) | big_fish:81, all_purpose:1 | top:43, honorable:39 | calm_surface:55, low_light_surface:38, clear_subtle:20, wind_reaction:17, dirty_vibration:15 |
| Bluegill Streamer<br>bluegill_streamer | fly | 7 | 78/408 (19.1%) | 3/16 (18.8%) | big_fish:78 | top:49, honorable:29 | calm_surface:39, clear_subtle:20, low_light_surface:16, none:15, wind_reaction:15 |
| Football Jig<br>football_jig | lure | 7 | 78/360 (21.7%) | 33/124 (26.6%) | big_fish:78 | honorable:42, top:36 | wind_reaction:40, dirty_vibration:24, cold_slow:22, none:18, open_water_search:10 |
| Popper Fly<br>popper_fly | fly | 8 | 77/468 (16.5%) | 62/276 (22.5%) | all_purpose:76, big_fish:1 | top:56, honorable:21 | calm_surface:60, low_light_surface:31, clear_subtle:17, wind_reaction:11, dirty_vibration:9 |
| Spinnerbait<br>spinnerbait | lure | 8 | 76/888 (8.6%) | 42/312 (13.5%) | all_purpose:60, big_fish:16 | honorable:38, top:38 | wind_reaction:38, dirty_vibration:37, low_light_surface:24, calm_surface:19, none:11 |
| Wake Bait<br>wake_bait | lure | 9 | 71/384 (18.5%) | 71/264 (26.9%) | big_fish:66, all_purpose:5 | top:48, honorable:23 | calm_surface:58, low_light_surface:28, clear_subtle:17, wind_reaction:10, dirty_vibration:6 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 71/840 (8.5%) | 42/288 (14.6%) | all_purpose:42, big_fish:29 | honorable:45, top:26 | wind_reaction:42, dirty_vibration:39, low_light_surface:32, cold_slow:13, none:12 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 66/888 (7.4%) | 41/300 (13.7%) | all_purpose:62, big_fish:4 | honorable:45, top:21 | cold_slow:35, wind_reaction:24, dirty_vibration:18, clear_subtle:10, none:10 |
| Lipless Crankbait<br>lipless_crankbait | lure | 6 | 63/888 (7.1%) | 42/312 (13.5%) | all_purpose:39, big_fish:24 | honorable:35, top:28 | wind_reaction:44, open_water_search:38, dirty_vibration:35, low_light_surface:10, calm_surface:9 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 62/840 (7.4%) | 46/284 (16.2%) | all_purpose:60, big_fish:2 | honorable:31, top:31 | clear_subtle:30, cold_slow:30, calm_surface:25, wind_reaction:15, dirty_vibration:8 |
| Tube Jig<br>tube_jig | lure | 7 | 62/888 (7%) | 0/0 | all_purpose:53, big_fish:9 | honorable:36, top:26 | cold_slow:37, clear_subtle:19, wind_reaction:19, calm_surface:10, dirty_vibration:7 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 60/888 (6.8%) | 9/64 (14.1%) | all_purpose:45, big_fish:15 | honorable:40, top:20 | none:21, calm_surface:16, warming_search:11, low_light_surface:10, wind_reaction:10 |
| Buzzbait<br>buzzbait | lure | 9 | 59/528 (11.2%) | 44/312 (14.1%) | big_fish:53, all_purpose:6 | top:42, honorable:17 | low_light_surface:43, calm_surface:30, dirty_vibration:23, wind_reaction:19, current_swing:10 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 48/288 (16.7%) | 48/204 (23.5%) | all_purpose:47, big_fish:1 | top:36, honorable:12 | calm_surface:39, low_light_surface:16, clear_subtle:12, dirty_vibration:8, current_swing:7 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 45/888 (5.1%) | 20/124 (16.1%) | all_purpose:37, big_fish:8 | honorable:29, top:16 | clear_subtle:22, calm_surface:20, none:11, heat_finesse:9, low_light_surface:9 |
| Magnum Worm<br>magnum_worm | lure | 7 | 44/336 (13.1%) | 0/0 | big_fish:44 | honorable:29, top:15 | calm_surface:17, none:15, clear_subtle:14, open_water_search:9, wind_reaction:9 |
| Bladed Jig<br>bladed_jig | lure | 6 | 43/888 (4.8%) | 24/232 (10.3%) | all_purpose:38, big_fish:5 | honorable:25, top:18 | dirty_vibration:24, wind_reaction:18, calm_surface:12, low_light_surface:8, none:7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 6 | 43/840 (5.1%) | 3/288 (1%) | all_purpose:24, big_fish:19 | top:23, honorable:20 | cold_slow:24, calm_surface:18, clear_subtle:18, wind_reaction:5, low_light_surface:4 |
| Swim Jig<br>swim_jig | lure | 7 | 41/888 (4.6%) | 15/368 (4.1%) | all_purpose:38, big_fish:3 | honorable:22, top:19 | calm_surface:22, none:10, low_light_surface:9, warming_search:6, current_swing:2 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 36/888 (4.1%) | 0/0 | all_purpose:35, big_fish:1 | honorable:21, top:15 | clear_subtle:24, cold_slow:16, calm_surface:13, wind_reaction:7, low_light_surface:5 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 35/288 (12.2%) | 9/52 (17.3%) | all_purpose:34, big_fish:1 | honorable:19, top:16 | calm_surface:18, low_light_surface:11, clear_subtle:9, wind_reaction:8, dirty_vibration:6 |
| Mouse Fly<br>mouse_fly | fly | 7 | 35/336 (10.4%) | 0/0 | big_fish:35 | top:25, honorable:10 | calm_surface:30, low_light_surface:15, clear_subtle:12, wind_reaction:4, dirty_vibration:2 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 29/888 (3.3%) | 0/0 | all_purpose:29 | honorable:18, top:11 | cold_slow:25, wind_reaction:13, dirty_vibration:6, clear_subtle:3, calm_surface:1 |
| Frog Fly<br>frog_fly | fly | 9 | 28/192 (14.6%) | 16/96 (16.7%) | big_fish:28 | honorable:14, top:14 | calm_surface:19, low_light_surface:16, wind_reaction:9, clear_subtle:7, dirty_vibration:6 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 28/840 (3.3%) | 14/288 (4.9%) | all_purpose:15, big_fish:13 | honorable:14, top:14 | none:14, cold_slow:12, wind_reaction:6, dirty_vibration:5, open_water_search:2 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 28/204 (13.7%) | 20/88 (22.7%) | all_purpose:25, big_fish:3 | top:18, honorable:10 | cold_slow:14, wind_reaction:11, dirty_vibration:8, clear_subtle:4, none:4 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 9 | 24/192 (12.5%) | 16/96 (16.7%) | big_fish:24 | top:14, honorable:10 | calm_surface:18, low_light_surface:12, clear_subtle:6, cold_slow:3, wind_reaction:3 |
| Blade Bait<br>blade_bait | lure | 7 | 20/888 (2.3%) | 0/0 | all_purpose:18, big_fish:2 | honorable:10, top:10 | cold_slow:11, wind_reaction:8, open_water_search:7, dirty_vibration:4, none:4 |
| Ned Rig<br>ned_rig | lure | 9 | 16/396 (4%) | 7/136 (5.1%) | all_purpose:14, big_fish:2 | honorable:8, top:8 | cold_slow:10, wind_reaction:4, heat_finesse:3, none:3, dirty_vibration:2 |
| Finesse Jig<br>finesse_jig | lure | 8 | 11/396 (2.8%) | 10/124 (8.1%) | all_purpose:11 | honorable:8, top:3 | cold_slow:9, clear_subtle:3, heat_finesse:2, wind_reaction:2 |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 11/888 (1.2%) | 0/0 | all_purpose:10, big_fish:1 | honorable:6, top:5 | warming_search:7, current_swing:4, none:4, dirty_vibration:2 |
| Glide Bait<br>glidebait | lure | 9 | 8/36 (22.2%) | 0/0 | big_fish:8 | honorable:4, top:4 | cold_slow:5, none:3, calm_surface:2, clear_subtle:2 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 7/396 (1.8%) | 4/124 (3.2%) | all_purpose:7 | honorable:5, top:2 | cold_slow:5, clear_subtle:2, heat_finesse:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 1/48 (2.1%) | 1/16 (6.3%) | big_fish:1 | honorable:1 | clear_subtle:1, cold_slow:1 |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 253/888 (28.5%) | 23/64 (35.9%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias<br>scenario_coverage_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 214/888 (24.1%) | 19/64 (29.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias<br>scenario_coverage_bias | goal_tags>1<br>versatile_search+big_fish_upside |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 172/888 (19.4%) | 31/140 (22.1%) | catalog_tag_stack<br>goal_tag_pressure<br>scenario_coverage_bias | home-window share>20% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 143/888 (16.1%) | 83/312 (26.6%) | catalog_tag_stack<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20%<br>home-window share>25% overdominant |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 120/552 (21.7%) | 0/0 | goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 114/504 (22.6%) | 0/0 | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 114/840 (13.6%) | 30/120 (25%) | catalog_tag_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | goal_tags>1<br>home-window share>20% |
| Walking Topwater<br>walking_topwater | lure | 93/528 (17.6%) | 76/312 (24.4%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 82/528 (15.5%) | 65/312 (20.8%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Football Jig<br>football_jig | lure | 78/360 (21.7%) | 33/124 (26.6%) | catalog_tag_stack<br>goal_tag_pressure | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Popper Fly<br>popper_fly | fly | 77/468 (16.5%) | 62/276 (22.5%) | catalog_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Wake Bait<br>wake_bait | lure | 71/384 (18.5%) | 71/264 (26.9%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20%<br>home-window share>25% overdominant |
| Foam Gurgler<br>foam_gurgler_fly | fly | 48/288 (16.7%) | 48/204 (23.5%) | catalog_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 28/204 (13.7%) | 20/88 (22.7%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 136 | 7/136 (5.1%) | Magnum Jerkbait (top), Football Jig (honorable):11, Magnum Jerkbait (top), Compact Flipping Jig (honorable):8, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):8, Suspending Jerkbait (top), Tube Jig (honorable):8 | selector/direct-score or overpowered competitors |
| Finesse Jig<br>finesse_jig | lure | forage 2: crawfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 124 | 10/124 (8.1%) | Magnum Jerkbait (top), Football Jig (honorable):11, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):8, Football Jig (top), Magnum Jerkbait (honorable):6, Suspending Jerkbait (top), Tube Jig (honorable):5 | selector/direct-score or overpowered competitors |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 4: cover_ambush, cold_slow, clear_subtle, heat_finesse<br>goal 1: reliable_action | 124 | 4/124 (3.2%) | Magnum Jerkbait (top), Football Jig (honorable):11, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):8, Football Jig (top), Magnum Jerkbait (honorable):6, Suspending Jerkbait (top), Tube Jig (honorable):5 | selector/direct-score or overpowered competitors |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | forage 2: leech_worm, baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, cold_slow<br>goal 2: reliable_action, versatile_search | 284 | 46/284 (16.2%) | Magnum Jerkbait (top), Football Jig (honorable):11, Magnum Jerkbait (top), Compact Flipping Jig (honorable):10, Suspending Jerkbait (top), Tube Jig (honorable):9, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):8 | healthy / not underused |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, heat_finesse<br>goal 1: reliable_action | 124 | 20/124 (16.1%) | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):10, Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):7, Soft Plastic Jerkbait (top), Suspending Jerkbait (honorable):5, Walking Topwater (top), Wake Bait (honorable):5 | healthy / not underused |
| Spinnerbait<br>spinnerbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, dirty_vibration, cover_ambush<br>goal 1: versatile_search | 312 | 42/312 (13.5%) | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):11, Medium-Diving Crankbait (top), Football Jig (honorable):11, Compact Flipping Jig (top), Magnum Jerkbait (honorable):10 | healthy / not underused |
| Bladed Jig<br>bladed_jig | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: dirty_vibration, cover_ambush<br>goal 1: versatile_search | 232 | 24/232 (10.3%) | Magnum Jerkbait (top), Compact Flipping Jig (honorable):12, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):11, Medium-Diving Crankbait (top), Football Jig (honorable):10, Compact Flipping Jig (top), Magnum Jerkbait (honorable):8 | selector/direct-score or overpowered competitors |
| Lipless Crankbait<br>lipless_crankbait | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 1: versatile_search | 312 | 42/312 (13.5%) | Magnum Jerkbait (top), Compact Flipping Jig (honorable):14, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):11, Medium-Diving Crankbait (top), Football Jig (honorable):11, Compact Flipping Jig (top), Magnum Jerkbait (honorable):10 | healthy / not underused |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Foam Gurgler (foam_gurgler_fly), Game Changer (game_changer), Popper Fly (popper_fly), Soft Plastic Jerkbait (soft_jerkbait), Wake Bait (wake_bait), Walking Topwater (walking_topwater)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Compact Flipping Jig (compact_flipping_jig), Deer Hair Slider (deer_hair_slider), Foam Gurgler (foam_gurgler_fly), Football Jig (football_jig), Game Changer (game_changer), Magnum Jerkbait (magnum_jerkbait), Medium-Diving Crankbait (medium_diving_crankbait), Popper Fly (popper_fly), Soft Plastic Jerkbait (soft_jerkbait), Wake Bait (wake_bait), Walking Topwater (walking_topwater), Warmwater Crawfish Fly (warmwater_crawfish_fly)

### Probably selector problem, not catalog problem
Bladed Jig (bladed_jig), Finesse Jig (finesse_jig), Ned Rig (ned_rig), Texas-Rigged Soft-Plastic Craw (texas_rigged_soft_plastic_craw)

## Utilization Notes / Coverage Gaps

- 1 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Rabbit-Strip Leech, Deer Hair Slider, Woolly Bugger, Popper Fly, Foam Gurgler, Frog Fly, Warmwater Crawfish Fly, Articulated Baitfish Streamer, Clouser Minnow, Deceiver, Baitfish Slider Fly, Unweighted Baitfish Streamer, Bluegill Streamer, Buzzbait, Lipless Crankbait, Spinnerbait, Walking Topwater, Squarebill Crankbait, Carolina-Rigged Stick Worm, Bladed Jig, Suspending Jerkbait, Compact Flipping Jig, Drop-Shot Minnow, Finesse Jig, Soft Plastic Jerkbait, Hollow-Body Frog, Paddle-Tail Swimbait, Weightless Stick Worm |
| underused_home_window | Swim Jig, Deep-Diving Crankbait, Flat-Sided Crankbait, Ned Rig, Texas-Rigged Soft-Plastic Craw, Shaky-Head Worm |
| no_home_window_coverage | None |
| over-dominant | Game Changer, Medium-Diving Crankbait, Wake Bait, Football Jig |
| probably okay niche profile | Worm Fly, Topwater Popper |

## LMB Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7% | 125/888 | 62/344 | 125 | 62 | 18% | 13/172 | 49/172 | 72 | healthy | activity neutral:236, suppressed:68, active:40<br>clarity clear:212, stained:72, dirty:60<br>water freshwater_lake_pond:324, freshwater_river:20<br>bucket cold_slow_or_front:160, calm_bright_clear_subtle:48, stable_pleasant_medium_confidence_archive:44 | Articulated Dungeon Streamer (top), Game Changer (honorable):11, Articulated Baitfish Streamer (top), Game Changer (honorable):10, Popper Fly (top), Unweighted Baitfish Streamer (honorable):9 |
| Deer Hair Slider<br>deer_hair_slider | fly | 4.6% | 82/528 | 65/312 | 82 | 65 | 20.8% | 0/156 | 65/156 | 101 | healthy | activity neutral:264, active:48<br>clarity clear:104, dirty:104, stained:104<br>water freshwater_lake_pond:288, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:128, calm_low_light_surface:72, cold_slow_or_front:40 | Foam Gurgler (top), Baitfish Slider Fly (honorable):13, Foam Gurgler (top), Clouser Minnow (honorable):10, Popper Fly (top), Unweighted Baitfish Streamer (honorable):10 |
| Woolly Bugger<br>woolly_bugger | fly | 3.7% | 66/888 | 41/300 | 66 | 41 | 13.7% | 37/150 | 4/150 | 52 | healthy | activity neutral:216, suppressed:60, active:24<br>clarity clear:180, dirty:60, stained:60<br>water freshwater_lake_pond:284, freshwater_river:16<br>bucket cold_slow_or_front:120, calm_bright_clear_subtle:48, stable_pleasant_medium_confidence_archive:44 | Articulated Dungeon Streamer (top), Game Changer (honorable):10, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):10, Articulated Baitfish Streamer (top), Game Changer (honorable):9 |
| Popper Fly<br>popper_fly | fly | 4.3% | 77/468 | 62/276 | 77 | 62 | 22.5% | 61/138 | 1/138 | 69 | healthy | activity neutral:228, active:48<br>clarity clear:92, dirty:92, stained:92<br>water freshwater_lake_pond:264, freshwater_river:12<br>bucket stable_pleasant_medium_confidence_archive:116, calm_low_light_surface:60, cold_slow_or_front:36 | Deer Hair Slider (honorable), Game Changer (top):13, Foam Gurgler (top), Baitfish Slider Fly (honorable):13, Foam Gurgler (top), Clouser Minnow (honorable):10 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 2.7% | 48/288 | 48/204 | 48 | 48 | 23.5% | 47/102 | 1/102 | 63 | healthy | activity neutral:168, active:36<br>clarity clear:68, dirty:68, stained:68<br>water freshwater_lake_pond:180, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:88, cold_slow_or_front:36, calm_bright_clear_subtle:28 | Deer Hair Slider (honorable), Game Changer (top):13, Popper Fly (top), Unweighted Baitfish Streamer (honorable):9, Deer Hair Slider (honorable), Bluegill Streamer (top):7 |
| Frog Fly<br>frog_fly | fly | 1.6% | 28/192 | 16/96 | 28 | 16 | 16.7% | 0/48 | 16/48 | 32 | healthy | activity neutral:84, active:12<br>clarity clear:32, dirty:32, stained:32<br>water freshwater_lake_pond:96<br>bucket calm_low_light_surface:48, stable_pleasant_medium_confidence_archive:40, breezy_windy_stained_reaction:4 | Baitfish Slider Fly (top), Clouser Minnow (honorable):5, Mouse Fly (top), Articulated Baitfish Streamer (honorable):5, Deer Hair Slider (top), Game Changer (honorable):4 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 1.6% | 28/204 | 20/88 | 28 | 20 | 22.7% | 17/44 | 3/44 | 18 | healthy | activity neutral:56, suppressed:20, active:12<br>clarity clear:52, stained:20, dirty:16<br>water freshwater_lake_pond:68, freshwater_river:20<br>bucket cold_slow_or_front:48, breezy_windy_stained_reaction:8, dirty_vibration:8 | Articulated Baitfish Streamer (top), Game Changer (honorable):5, Articulated Dungeon Streamer (top), Rabbit-Strip Leech (honorable):4, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):3 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 12% | 214/888 | 19/64 | 214 | 19 | 29.7% | 3/32 | 16/32 | 23 | healthy | activity active:32, neutral:32<br>clarity clear:48, dirty:8, stained:8<br>water freshwater_lake_pond:64<br>bucket warming_search:28, cold_slow_or_front:20, stable_pleasant_medium_confidence_archive:16 | Articulated Dungeon Streamer (honorable), Game Changer (top):3, Clouser Minnow (honorable), Deceiver (top):3, Deceiver (honorable), Baitfish Slider Fly (top):3 |
| Clouser Minnow<br>clouser_minnow | fly | 9.9% | 175/888 | 15/64 | 175 | 15 | 23.4% | 15/32 | 0/32 | 23 | healthy | activity active:32, neutral:32<br>clarity clear:48, dirty:8, stained:8<br>water freshwater_lake_pond:64<br>bucket warming_search:28, cold_slow_or_front:20, stable_pleasant_medium_confidence_archive:16 | Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):6, Deceiver (top), Articulated Baitfish Streamer (honorable):4, Articulated Dungeon Streamer (honorable), Game Changer (top):3 |
| Deceiver<br>deceiver | fly | 7.8% | 139/888 | 19/64 | 139 | 19 | 29.7% | 14/32 | 5/32 | 32 | healthy | activity active:32, neutral:32<br>clarity clear:48, dirty:8, stained:8<br>water freshwater_lake_pond:64<br>bucket warming_search:28, cold_slow_or_front:20, stable_pleasant_medium_confidence_archive:16 | Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):6, Articulated Dungeon Streamer (honorable), Game Changer (top):3, Game Changer (top), Articulated Dungeon Streamer (honorable):3 |
| Game Changer<br>game_changer | fly | 14.2% | 253/888 | 23/64 | 253 | 23 | 35.9% | 7/32 | 16/32 | 24 | over-dominant | activity active:32, neutral:32<br>clarity clear:48, dirty:8, stained:8<br>water freshwater_lake_pond:64<br>bucket warming_search:28, cold_slow_or_front:20, stable_pleasant_medium_confidence_archive:16 | Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):6, Deceiver (top), Articulated Baitfish Streamer (honorable):4, Clouser Minnow (honorable), Deceiver (top):3 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 8.7% | 154/840 | 13/56 | 154 | 13 | 23.2% | 12/28 | 1/28 | 29 | healthy | activity active:28, neutral:28<br>clarity clear:40, dirty:8, stained:8<br>water freshwater_lake_pond:56<br>bucket warming_search:28, cold_slow_or_front:16, stable_pleasant_medium_confidence_archive:12 | Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):5, Articulated Dungeon Streamer (honorable), Game Changer (top):3, Deceiver (top), Articulated Baitfish Streamer (honorable):3 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 4.7% | 84/840 | 6/56 | 84 | 6 | 10.7% | 4/28 | 2/28 | 10 | healthy | activity active:28, neutral:28<br>clarity clear:40, dirty:8, stained:8<br>water freshwater_lake_pond:56<br>bucket warming_search:28, cold_slow_or_front:16, stable_pleasant_medium_confidence_archive:12 | Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):5, Articulated Dungeon Streamer (honorable), Game Changer (top):3, Deceiver (honorable), Baitfish Slider Fly (top):3 |
| Bluegill Streamer<br>bluegill_streamer | fly | 4.4% | 78/408 | 3/16 | 78 | 3 | 18.8% | 0/8 | 3/8 | 3 | healthy | activity active:8, neutral:8<br>clarity clear:16<br>water freshwater_lake_pond:16<br>bucket stable_pleasant_medium_confidence_archive:12, cold_slow_or_front:4 | Deceiver (top), Articulated Baitfish Streamer (honorable):2, Articulated Baitfish Streamer (honorable), Mouse Fly (top):1, Baitfish Slider Fly (top), Foam Gurgler (honorable):1 |
| Worm Fly<br>warmwater_worm_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Swim Jig<br>swim_jig | lure | 2.3% | 41/888 | 15/368 | 41 | 15 | 4.1% | 14/184 | 1/184 | 56 | underused_home_window | activity active:192, neutral:176<br>clarity dirty:160, stained:160, clear:48<br>water freshwater_lake_pond:344, freshwater_river:24<br>bucket dirty_vibration:112, breezy_windy_stained_reaction:104, stable_pleasant_medium_confidence_archive:84 | Medium-Diving Crankbait (top), Football Jig (honorable):11, Magnum Jerkbait (top), Compact Flipping Jig (honorable):10, Medium-Diving Crankbait (top), Lipless Crankbait (honorable):10 |
| Buzzbait<br>buzzbait | lure | 3.3% | 59/528 | 44/312 | 59 | 44 | 14.1% | 4/156 | 40/156 | 65 | healthy | activity neutral:264, active:48<br>clarity clear:104, dirty:104, stained:104<br>water freshwater_lake_pond:288, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:128, calm_low_light_surface:72, cold_slow_or_front:40 | Wake Bait (top), Compact Flipping Jig (honorable):15, Wake Bait (honorable), Walking Topwater (top):12, Walking Topwater (top), Compact Flipping Jig (honorable):12 |
| Lipless Crankbait<br>lipless_crankbait | lure | 3.5% | 63/888 | 42/312 | 63 | 42 | 13.5% | 25/156 | 17/156 | 128 | healthy | activity active:168, neutral:144<br>clarity dirty:156, stained:156<br>water freshwater_lake_pond:288, freshwater_river:24<br>bucket dirty_vibration:112, breezy_windy_stained_reaction:104, stable_pleasant_medium_confidence_archive:68 | Medium-Diving Crankbait (top), Football Jig (honorable):10, Buzzbait (top), Compact Flipping Jig (honorable):9, Magnum Jerkbait (honorable), Football Jig (top):8 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8.1% | 143/888 | 83/312 | 143 | 83 | 26.6% | 47/156 | 36/156 | 140 | over-dominant | activity active:168, neutral:144<br>clarity dirty:156, stained:156<br>water freshwater_lake_pond:288, freshwater_river:24<br>bucket dirty_vibration:112, breezy_windy_stained_reaction:104, stable_pleasant_medium_confidence_archive:68 | Buzzbait (top), Compact Flipping Jig (honorable):9, Magnum Jerkbait (honorable), Football Jig (top):8, Magnum Jerkbait (top), Compact Flipping Jig (honorable):8 |
| Spinnerbait<br>spinnerbait | lure | 4.3% | 76/888 | 42/312 | 76 | 42 | 13.5% | 32/156 | 10/156 | 141 | healthy | activity active:168, neutral:144<br>clarity dirty:156, stained:156<br>water freshwater_lake_pond:288, freshwater_river:24<br>bucket dirty_vibration:112, breezy_windy_stained_reaction:104, stable_pleasant_medium_confidence_archive:68 | Medium-Diving Crankbait (top), Football Jig (honorable):10, Buzzbait (top), Compact Flipping Jig (honorable):9, Magnum Jerkbait (honorable), Football Jig (top):8 |
| Walking Topwater<br>walking_topwater | lure | 5.2% | 93/528 | 76/312 | 93 | 76 | 24.4% | 3/156 | 73/156 | 85 | healthy | activity neutral:264, active:48<br>clarity clear:104, dirty:104, stained:104<br>water freshwater_lake_pond:288, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:128, calm_low_light_surface:72, cold_slow_or_front:40 | Wake Bait (top), Compact Flipping Jig (honorable):15, Buzzbait (top), Compact Flipping Jig (honorable):10, Wake Bait (top), Magnum Jerkbait (honorable):9 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 1.6% | 28/840 | 14/288 | 28 | 14 | 4.9% | 8/144 | 6/144 | 62 | underused_home_window | activity active:160, neutral:128<br>clarity dirty:144, stained:144<br>water freshwater_lake_pond:288<br>bucket breezy_windy_stained_reaction:104, dirty_vibration:104, stable_pleasant_medium_confidence_archive:64 | Medium-Diving Crankbait (top), Football Jig (honorable):10, Magnum Jerkbait (honorable), Football Jig (top):8, Magnum Jerkbait (top), Compact Flipping Jig (honorable):8 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 2.4% | 43/840 | 3/288 | 43 | 3 | 1% | 2/144 | 1/144 | 40 | underused_home_window | activity active:152, neutral:136<br>clarity dirty:144, stained:144<br>water freshwater_lake_pond:264, freshwater_river:24<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:96, stable_pleasant_medium_confidence_archive:60 | Buzzbait (top), Compact Flipping Jig (honorable):9, Medium-Diving Crankbait (top), Football Jig (honorable):9, Magnum Jerkbait (top), Compact Flipping Jig (honorable):8 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 4% | 71/840 | 42/288 | 71 | 42 | 14.6% | 24/144 | 18/144 | 76 | healthy | activity active:152, neutral:136<br>clarity dirty:144, stained:144<br>water freshwater_lake_pond:264, freshwater_river:24<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:96, stable_pleasant_medium_confidence_archive:60 | Buzzbait (top), Compact Flipping Jig (honorable):9, Medium-Diving Crankbait (top), Football Jig (honorable):9, Magnum Jerkbait (top), Compact Flipping Jig (honorable):8 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 3.5% | 62/840 | 46/284 | 62 | 46 | 16.2% | 44/142 | 2/142 | 52 | healthy | activity neutral:236, suppressed:48<br>clarity clear:176, stained:108<br>water freshwater_lake_pond:284<br>bucket cold_slow_or_front:128, breezy_windy_stained_reaction:48, calm_bright_clear_subtle:40 | Magnum Jerkbait (top), Football Jig (honorable):11, Magnum Jerkbait (top), Compact Flipping Jig (honorable):9, Suspending Jerkbait (top), Tube Jig (honorable):9 |
| Wake Bait<br>wake_bait | lure | 4% | 71/384 | 71/264 | 71 | 71 | 26.9% | 5/132 | 66/132 | 92 | over-dominant | activity neutral:216, active:48<br>clarity clear:88, dirty:88, stained:88<br>water freshwater_lake_pond:264<br>bucket stable_pleasant_medium_confidence_archive:108, calm_low_light_surface:60, cold_slow_or_front:36 | Walking Topwater (top), Compact Flipping Jig (honorable):10, Buzzbait (top), Compact Flipping Jig (honorable):8, Walking Topwater (top), Magnum Worm (honorable):8 |
| Bladed Jig<br>bladed_jig | lure | 2.4% | 43/888 | 24/232 | 43 | 24 | 10.3% | 20/116 | 4/116 | 64 | healthy | activity neutral:144, active:88<br>clarity dirty:116, stained:116<br>water freshwater_lake_pond:208, freshwater_river:24<br>bucket dirty_vibration:112, breezy_windy_stained_reaction:104, calm_low_light_surface:8 | Medium-Diving Crankbait (top), Football Jig (honorable):9, Buzzbait (top), Compact Flipping Jig (honorable):7, Magnum Jerkbait (honorable), Football Jig (top):7 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 9.3% | 166/888 | 38/204 | 166 | 38 | 18.6% | 33/102 | 5/102 | 99 | healthy | activity neutral:132, suppressed:40, active:32<br>clarity clear:128, stained:76<br>water freshwater_lake_pond:184, freshwater_river:20<br>bucket cold_slow_or_front:80, breezy_windy_stained_reaction:32, calm_bright_clear_subtle:32 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):12, Magnum Jerkbait (top), Football Jig (honorable):8, Magnum Jerkbait (top), Compact Flipping Jig (honorable):7 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 9.7% | 172/888 | 31/140 | 172 | 31 | 22.1% | 0/62 | 31/78 | 9 | healthy | activity neutral:78, suppressed:32, active:30<br>clarity clear:96, stained:44<br>water freshwater_lake_pond:124, freshwater_river:16<br>bucket cold_slow_or_front:88, stable_pleasant_medium_confidence_archive:18, calm_bright_clear_subtle:12 | Magnum Jerkbait (top), Football Jig (honorable):12, Magnum Jerkbait (honorable), Football Jig (top):6, Suspending Jerkbait (top), Tube Jig (honorable):5 |
| Ned Rig<br>ned_rig | lure | 0.9% | 16/396 | 7/136 | 16 | 7 | 5.1% | 7/68 | 0/68 | 26 | underused_home_window | activity neutral:104, suppressed:32<br>clarity clear:76, stained:60<br>water freshwater_lake_pond:124, freshwater_river:12<br>bucket cold_slow_or_front:72, breezy_windy_stained_reaction:32, calm_bright_clear_subtle:12 | Magnum Jerkbait (top), Football Jig (honorable):11, Suspending Jerkbait (top), Tube Jig (honorable):8, Magnum Jerkbait (top), Compact Flipping Jig (honorable):7 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 2.5% | 45/888 | 20/124 | 45 | 20 | 16.1% | 16/62 | 4/62 | 31 | healthy | activity neutral:108, suppressed:16<br>clarity clear:124<br>water freshwater_lake_pond:120, freshwater_river:4<br>bucket calm_bright_clear_subtle:40, stable_pleasant_medium_confidence_archive:32, calm_low_light_surface:24 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):10, Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):7, Soft Plastic Jerkbait (top), Suspending Jerkbait (honorable):5 |
| Finesse Jig<br>finesse_jig | lure | 0.6% | 11/396 | 10/124 | 11 | 10 | 8.1% | 10/62 | 0/62 | 17 | healthy | activity neutral:72, suppressed:32, active:20<br>clarity clear:96, stained:28<br>water freshwater_lake_pond:108, freshwater_river:16<br>bucket cold_slow_or_front:88, calm_bright_clear_subtle:12, stable_pleasant_medium_confidence_archive:8 | Magnum Jerkbait (top), Football Jig (honorable):11, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):8, Magnum Jerkbait (honorable), Football Jig (top):6 |
| Football Jig<br>football_jig | lure | 4.4% | 78/360 | 33/124 | 78 | 33 | 26.6% | 0/54 | 33/70 | 16 | over-dominant | activity neutral:66, suppressed:32, active:26<br>clarity clear:84, stained:40<br>water freshwater_lake_pond:124<br>bucket cold_slow_or_front:80, stable_pleasant_medium_confidence_archive:18, calm_bright_clear_subtle:12 | Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):7, Magnum Jerkbait (top), Compact Flipping Jig (honorable):5, Suspending Jerkbait (top), Tube Jig (honorable):5 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 0.4% | 7/396 | 4/124 | 7 | 4 | 3.2% | 4/62 | 0/62 | 22 | underused_home_window | activity neutral:72, suppressed:32, active:20<br>clarity clear:96, stained:28<br>water freshwater_lake_pond:108, freshwater_river:16<br>bucket cold_slow_or_front:88, calm_bright_clear_subtle:12, stable_pleasant_medium_confidence_archive:8 | Magnum Jerkbait (top), Football Jig (honorable):11, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):8, Magnum Jerkbait (honorable), Football Jig (top):6 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 6.4% | 114/840 | 30/120 | 114 | 30 | 25% | 28/60 | 2/60 | 41 | healthy | activity neutral:108, suppressed:12<br>clarity clear:120<br>water freshwater_lake_pond:116, freshwater_river:4<br>bucket calm_bright_clear_subtle:36, stable_pleasant_medium_confidence_archive:32, calm_low_light_surface:24 | Suspending Jerkbait (top), Drop-Shot Minnow (honorable):6, Carolina-Rigged Stick Worm (top), Drop-Shot Minnow (honorable):5, Wake Bait (honorable), Walking Topwater (top):5 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 1.4% | 24/192 | 16/96 | 24 | 16 | 16.7% | 0/48 | 16/48 | 14 | healthy | activity neutral:84, active:12<br>clarity clear:32, dirty:32, stained:32<br>water freshwater_lake_pond:96<br>bucket calm_low_light_surface:48, stable_pleasant_medium_confidence_archive:40, breezy_windy_stained_reaction:4 | Wake Bait (honorable), Walking Topwater (top):6, Wake Bait (top), Compact Flipping Jig (honorable):5, Suspending Jerkbait (honorable), Soft Plastic Jerkbait (top):4 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 3.4% | 60/888 | 9/64 | 60 | 9 | 14.1% | 6/32 | 3/32 | 24 | healthy | activity active:32, neutral:32<br>clarity clear:48, dirty:8, stained:8<br>water freshwater_lake_pond:64<br>bucket warming_search:28, cold_slow_or_front:20, stable_pleasant_medium_confidence_archive:16 | Medium-Diving Crankbait (top), Lipless Crankbait (honorable):4, Magnum Jerkbait (top), Football Jig (honorable):3, Suspending Jerkbait (top), Soft Plastic Jerkbait (honorable):3 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 2% | 35/288 | 9/52 | 35 | 9 | 17.3% | 8/26 | 1/26 | 23 | healthy | activity neutral:44, suppressed:8<br>clarity clear:52<br>water freshwater_lake_pond:52<br>bucket cold_slow_or_front:20, calm_bright_clear_subtle:12, calm_low_light_surface:8 | Soft Plastic Jerkbait (top), Carolina-Rigged Stick Worm (honorable):5, Carolina-Rigged Stick Worm (top), Flat-Sided Crankbait (honorable):4, Wake Bait (honorable), Walking Topwater (top):4 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 0.1% | 1/48 | 1/16 | 1 | 1 | 6.3% | 0/8 | 1/8 | 3 | underused_home_window | activity neutral:8, suppressed:8<br>clarity clear:8, stained:8<br>water freshwater_lake_pond:16<br>bucket cold_slow_or_front:8, breezy_windy_stained_reaction:4, calm_bright_clear_subtle:4 | Carolina-Rigged Stick Worm (top), Tube Jig (honorable):2, Blade Bait (top), Spinnerbait (honorable):1, Blade Bait (top), Suspending Jerkbait (honorable):1 |
| Topwater Popper<br>popping_topwater | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |
| all_purpose_goal_fit | 20 |
| forage_clarity_stack | 4 |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |
| Sam Rayburn Reservoir<br>2025-03-28 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Sam Rayburn Reservoir<br>2025-03-28 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Sam Rayburn Reservoir<br>2025-03-28 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Fork<br>2025-03-29 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Fork<br>2025-04-30 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 152 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Guntersville / Tennessee River reservoir<br>2025-03-08 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Santee Cooper<br>2025-04-05 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 152 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Lake of the Ozarks<br>2025-11-11 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 168 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Minnesota natural bass lake<br>2025-05-15 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 152 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Minnesota natural bass lake<br>2025-05-15 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Minnesota natural bass lake<br>2025-07-16 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 168 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Illinois / Indiana natural-lake example<br>2025-04-18 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Illinois / Indiana natural-lake example<br>2025-10-18 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 168 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Illinois / Indiana natural-lake example<br>2025-10-18 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 168 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Champlain<br>2025-04-27 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-04-04 | all_purpose<br>stained<br>freshwater_river | warming_search<br>active | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-04-04 | big_fish<br>stained<br>freshwater_river | warming_search<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-04-04 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>active | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-04-04 | big_fish<br>dirty<br>freshwater_river | dirty_vibration<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-06-17 | all_purpose<br>stained<br>freshwater_river | stable_pleasant_medium_confidence_archive<br>neutral | 152 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | 44/142 | 2/142 | goal_tags:99, seasonal_baseline:52, daily_condition_tags:45, forage_clarity_stack:29, selector_filtering_variety_jitter:13 | Lake Okeechobee / central FL bass lake 2025-03-18 all_purpose clear: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-03-18 all_purpose stained: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-03-19 all_purpose stained: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter) |
| Ned Rig<br>ned_rig | 7/68 | 0/68 | goal_tags:72, forage_clarity_stack:38, daily_condition_tags:14, selector_filtering_variety_jitter:3, seasonal_baseline:2 | Guntersville / Tennessee River reservoir 2025-03-08 all_purpose stained: lost to Carolina-Rigged Stick Worm by 6 (goal_tags)<br>Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose stained: lost to Tube Jig by 12 (forage_clarity_stack) |
| Finesse Jig<br>finesse_jig | 10/62 | 0/62 | goal_tags:66, forage_clarity_stack:32, daily_condition_tags:12, seasonal_baseline:2, selector_filtering_variety_jitter:2 | Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack)<br>Guntersville / Tennessee River reservoir 2025-03-08 all_purpose clear: lost to Tube Jig by 12 (forage_clarity_stack) |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | 4/62 | 0/62 | goal_tags:69, forage_clarity_stack:33, daily_condition_tags:12, selector_filtering_variety_jitter:4, seasonal_baseline:2 | Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-01-16 big_fish clear: lost to Tube Jig by 12 (forage_clarity_stack)<br>Guntersville / Tennessee River reservoir 2025-03-08 all_purpose clear: lost to Tube Jig by 12 (forage_clarity_stack) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-18<br>all_purpose clear cold_slow_or_front | 186 | Flat-Sided Crankbait<br>184 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-18<br>all_purpose stained cold_slow_or_front | 170 | Flat-Sided Crankbait<br>168 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-19<br>all_purpose stained cold_slow_or_front | 170 | Flat-Sided Crankbait<br>168 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-19<br>all_purpose clear calm_bright_clear_subtle | 186 | Suspending Jerkbait<br>186 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Finesse Jig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Carolina-Rigged Stick Worm<br>170 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Texas-Rigged Soft-Plastic Craw<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Carolina-Rigged Stick Worm<br>170 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Ned Rig<br>Guntersville / Tennessee River reservoir 2025-03-08<br>all_purpose stained breezy_windy_stained_reaction | 164 | Carolina-Rigged Stick Worm<br>170 | 6 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Finesse Jig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Tube Jig<br>148 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Finesse Jig<br>Guntersville / Tennessee River reservoir 2025-03-08<br>all_purpose clear cold_slow_or_front | 170 | Tube Jig<br>182 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Finesse Jig<br>Guntersville / Tennessee River reservoir 2025-10-20<br>all_purpose stained cold_slow_or_front | 164 | Carolina-Rigged Stick Worm<br>176 | 12 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Tube Jig<br>148 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose stained breezy_windy_stained_reaction | 164 | Tube Jig<br>176 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Ned Rig<br>Guntersville / Tennessee River reservoir 2025-03-08<br>all_purpose clear cold_slow_or_front | 170 | Tube Jig<br>182 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Texas-Rigged Soft-Plastic Craw<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>big_fish clear cold_slow_or_front | 136 | Tube Jig<br>148 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Texas-Rigged Soft-Plastic Craw<br>Guntersville / Tennessee River reservoir 2025-03-08<br>all_purpose clear cold_slow_or_front | 170 | Tube Jig<br>182 | 12 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Texas-Rigged Soft-Plastic Craw<br>Guntersville / Tennessee River reservoir 2025-10-20<br>all_purpose clear calm_bright_clear_subtle | 180 | Carolina-Rigged Stick Worm<br>192 | 12 | goal_tags | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 16 |
| set_b_group_novelty | 3 |
| jitter_or_id_tiebreak | 3 |
| honorable_diversity_or_replacement | 2 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lake of the Ozarks<br>2025-02-20 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Finesse Jig<br>200 | Carolina-Rigged Stick Worm<br>212 | -12 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake of the Ozarks<br>2025-02-20 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>184 | Carolina-Rigged Stick Worm<br>196 | -12 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Ned Rig<br>170 | Drop-Shot Minnow<br>180 | -10 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |
| Southwest desert bass reservoir<br>2025-08-21 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>166 | Drop-Shot Minnow<br>174 | -8 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| WV/VA highland reservoir<br>2025-05-19 all_purpose stained<br>cold_slow_or_front | B<br>honorable_lure | Blade Bait<br>164 | Carolina-Rigged Stick Worm<br>170 | -6 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Ned Rig<br>192 | Drop-Shot Minnow<br>196 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Southwest desert bass reservoir<br>2025-08-21 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Soft Plastic Jerkbait<br>186 | Drop-Shot Minnow<br>190 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Flat-Sided Crankbait<br>184 | Carolina-Rigged Stick Worm<br>186 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 all_purpose stained<br>cold_slow_or_front | B<br>honorable_lure | Flat-Sided Crankbait<br>168 | Carolina-Rigged Stick Worm<br>170 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Flat-Sided Crankbait<br>168 | Carolina-Rigged Stick Worm<br>170 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| WV/VA highland reservoir<br>2025-05-19 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Flat-Sided Crankbait<br>184 | Carolina-Rigged Stick Worm<br>186 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Northern California bass lake<br>2025-05-23 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Flat-Sided Crankbait<br>184 | Carolina-Rigged Stick Worm<br>186 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Northern California bass lake<br>2025-05-23 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Flat-Sided Crankbait<br>168 | Carolina-Rigged Stick Worm<br>170 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>170 | Finesse Jig<br>170 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Lake of the Ozarks<br>2025-02-20 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Finesse Jig<br>200 | Ned Rig<br>200 | 0 | set_b_group_novelty | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake of the Ozarks<br>2025-02-20 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>184 | Ned Rig<br>184 | 0 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Suspending Jerkbait<br>186 | Carolina-Rigged Stick Worm<br>186 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Ned Rig<br>192 | Finesse Jig<br>192 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Ned Rig<br>170 | Finesse Jig<br>170 | 0 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |
| Lake Champlain<br>2025-04-27 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>170 | Ned Rig<br>170 | 0 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Lake Champlain<br>2025-04-27 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Appalachian river LMB context<br>2025-05-06 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Appalachian river LMB context<br>2025-05-06 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Swim Jig<br>swim_jig | lure | 15/368 | 4.1% | 56 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:52, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:52, big_fish / dirty / freshwater_lake_pond / dirty_vibration:52, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:52 | goal_tags:192, daily_condition_tags:120, selector_filtering_variety_jitter:22, forage_clarity_stack:19 | Medium-Diving Crankbait (top), Football Jig (honorable):11, Magnum Jerkbait (top), Compact Flipping Jig (honorable):10, Medium-Diving Crankbait (top), Lipless Crankbait (honorable):10, Buzzbait (top), Compact Flipping Jig (honorable):9 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 14/288 | 4.9% | 62 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:52, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:52, big_fish / dirty / freshwater_lake_pond / dirty_vibration:52, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:52 | goal_tags:148, daily_condition_tags:81, seasonal_baseline:23, forage_clarity_stack:17 | Medium-Diving Crankbait (top), Football Jig (honorable):10, Magnum Jerkbait (honorable), Football Jig (top):8, Magnum Jerkbait (top), Compact Flipping Jig (honorable):8, Buzzbait (top), Compact Flipping Jig (honorable):7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 3/288 | 1% | 40 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:48, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:48, big_fish / dirty / freshwater_lake_pond / dirty_vibration:48, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:48 | goal_tags:147, daily_condition_tags:95, forage_clarity_stack:40, seasonal_baseline:3 | Buzzbait (top), Compact Flipping Jig (honorable):9, Medium-Diving Crankbait (top), Football Jig (honorable):9, Magnum Jerkbait (top), Compact Flipping Jig (honorable):8, Walking Topwater (top), Compact Flipping Jig (honorable):8 |
| Ned Rig<br>ned_rig | lure | 7/136 | 5.1% | 26 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:22, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:22, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:16, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:16 | goal_tags:72, forage_clarity_stack:38, daily_condition_tags:14, selector_filtering_variety_jitter:3 | Magnum Jerkbait (top), Football Jig (honorable):11, Suspending Jerkbait (top), Tube Jig (honorable):8, Magnum Jerkbait (top), Compact Flipping Jig (honorable):7, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):7 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 4/124 | 3.2% | 22 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:12, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:12 | goal_tags:69, forage_clarity_stack:33, daily_condition_tags:12, selector_filtering_variety_jitter:4 | Magnum Jerkbait (top), Football Jig (honorable):11, Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):8, Magnum Jerkbait (honorable), Football Jig (top):6, Suspending Jerkbait (top), Tube Jig (honorable):5 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/16 | 6.3% | 3 | all_purpose / clear / freshwater_lake_pond / calm_bright_clear_subtle:2, all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:2, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:2, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:2 | goal_tags:6, daily_condition_tags:5, forage_clarity_stack:4 | Carolina-Rigged Stick Worm (top), Tube Jig (honorable):2, Blade Bait (top), Spinnerbait (honorable):1, Blade Bait (top), Suspending Jerkbait (honorable):1, Carolina-Rigged Stick Worm (honorable), Compact Flipping Jig (top):1 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 83/312 | 26.6% | 140 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:52, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:52, big_fish / dirty / freshwater_lake_pond / dirty_vibration:52, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:52 | goal_tags:113, selector_filtering_variety_jitter:88, forage_clarity_stack:23, daily_condition_tags:5 | Buzzbait (top), Compact Flipping Jig (honorable):9, Magnum Jerkbait (honorable), Football Jig (top):8, Magnum Jerkbait (top), Compact Flipping Jig (honorable):8, Walking Topwater (top), Compact Flipping Jig (honorable):8 |
| Wake Bait<br>wake_bait | lure | 71/264 | 26.9% | 92 | all_purpose / dirty / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:20, all_purpose / stained / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:20, big_fish / dirty / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:20, big_fish / stained / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:20 | goal_tags:127, selector_filtering_variety_jitter:57, daily_condition_tags:6, forage_clarity_stack:3 | Walking Topwater (top), Compact Flipping Jig (honorable):10, Buzzbait (top), Compact Flipping Jig (honorable):8, Walking Topwater (top), Magnum Worm (honorable):8, Suspending Jerkbait (honorable), Soft Plastic Jerkbait (top):7 |
| Football Jig<br>football_jig | lure | 33/124 | 26.6% | 16 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:12, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:12 | goal_tags:58, daily_condition_tags:14, forage_clarity_stack:10, selector_filtering_variety_jitter:7 | Medium-Diving Crankbait (top), Compact Flipping Jig (honorable):7, Magnum Jerkbait (top), Compact Flipping Jig (honorable):5, Suspending Jerkbait (top), Tube Jig (honorable):5, Medium-Diving Crankbait (honorable), Compact Flipping Jig (top):3 |
| Game Changer<br>game_changer | fly | 23/64 | 35.9% | 24 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:10, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:10, all_purpose / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:8, big_fish / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:8 | selector_filtering_variety_jitter:17, goal_tags:14, daily_condition_tags:10 | Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):6, Deceiver (top), Articulated Baitfish Streamer (honorable):4, Clouser Minnow (honorable), Deceiver (top):3, Deceiver (honorable), Baitfish Slider Fly (top):3 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Popper Fly [fly] (44), Soft Plastic Jerkbait [lure] (40), Foam Gurgler [fly] (32), Clouser Minnow [fly] (19), Suspending Jerkbait [lure] (16) | Popper Fly [fly] (60), Clouser Minnow [fly] (52), Soft Plastic Jerkbait [lure] (52), Foam Gurgler [fly] (38), Baitfish Slider Fly [fly] (36) |
| calm_surface | big_fish | Walking Topwater [lure] (51), Wake Bait [lure] (39), Bluegill Streamer [fly] (28), Deer Hair Slider [fly] (25), Game Changer [fly] (23) | Walking Topwater [lure] (69), Deer Hair Slider [fly] (55), Wake Bait [lure] (54), Game Changer [fly] (48), Articulated Baitfish Streamer [fly] (44) |
| low_light_surface | all_purpose | Baitfish Slider Fly [fly] (20), Popper Fly [fly] (20), Soft Plastic Jerkbait [lure] (19), Suspending Jerkbait [lure] (16), Spinnerbait [lure] (13) | Clouser Minnow [fly] (34), Popper Fly [fly] (30), Baitfish Slider Fly [fly] (28), Soft Plastic Jerkbait [lure] (27), Suspending Jerkbait [lure] (27) |
| low_light_surface | big_fish | Buzzbait [lure] (27), Walking Topwater [lure] (27), Deer Hair Slider [fly] (23), Wake Bait [lure] (17), Mouse Fly [fly] (13) | Walking Topwater [lure] (39), Buzzbait [lure] (37), Deer Hair Slider [fly] (37), Game Changer [fly] (30), Articulated Baitfish Streamer [fly] (28) |
| wind_reaction | all_purpose | Suspending Jerkbait [lure] (48), Baitfish Slider Fly [fly] (39), Deceiver [fly] (36), Medium-Diving Crankbait [lure] (28), Clouser Minnow [fly] (25) | Suspending Jerkbait [lure] (72), Deceiver [fly] (67), Baitfish Slider Fly [fly] (57), Clouser Minnow [fly] (56), Medium-Diving Crankbait [lure] (50) |
| wind_reaction | big_fish | Medium-Diving Crankbait [lure] (38), Articulated Dungeon Streamer [fly] (29), Game Changer [fly] (27), Deceiver [fly] (24), Articulated Baitfish Streamer [fly] (23) | Game Changer [fly] (66), Compact Flipping Jig [lure] (65), Articulated Dungeon Streamer [fly] (54), Articulated Baitfish Streamer [fly] (53), Medium-Diving Crankbait [lure] (48) |
| dirty_vibration | all_purpose | Suspending Jerkbait [lure] (30), Baitfish Slider Fly [fly] (26), Deceiver [fly] (25), Clouser Minnow [fly] (20), Medium-Diving Crankbait [lure] (20) | Deceiver [fly] (47), Suspending Jerkbait [lure] (45), Baitfish Slider Fly [fly] (40), Clouser Minnow [fly] (40), Medium-Diving Crankbait [lure] (38) |
| dirty_vibration | big_fish | Medium-Diving Crankbait [lure] (25), Game Changer [fly] (24), Articulated Baitfish Streamer [fly] (20), Articulated Dungeon Streamer [fly] (20), Deceiver [fly] (18) | Compact Flipping Jig [lure] (58), Game Changer [fly] (49), Articulated Baitfish Streamer [fly] (44), Articulated Dungeon Streamer [fly] (38), Medium-Diving Crankbait [lure] (31) |
| clear_subtle | all_purpose | Soft Plastic Jerkbait [lure] (25), Carolina-Rigged Stick Worm [lure] (17), Suspending Jerkbait [lure] (16), Unweighted Baitfish Streamer [fly] (14), Popper Fly [fly] (13) | Soft Plastic Jerkbait [lure] (34), Carolina-Rigged Stick Worm [lure] (29), Unweighted Baitfish Streamer [fly] (29), Clouser Minnow [fly] (25), Suspending Jerkbait [lure] (25) |
| clear_subtle | big_fish | Walking Topwater [lure] (16), Bluegill Streamer [fly] (13), Game Changer [fly] (13), Articulated Dungeon Streamer [fly] (12), Magnum Jerkbait [lure] (11) | Game Changer [fly] (29), Walking Topwater [lure] (22), Bluegill Streamer [fly] (20), Deer Hair Slider [fly] (20), Magnum Jerkbait [lure] (20) |
| cold_slow | all_purpose | Suspending Jerkbait [lure] (25), Woolly Bugger [fly] (14), Tube Jig [lure] (13), Baitfish Slider Fly [fly] (11), Carolina-Rigged Stick Worm [lure] (11) | Suspending Jerkbait [lure] (32), Woolly Bugger [fly] (31), Tube Jig [lure] (29), Carolina-Rigged Stick Worm [lure] (28), Jighead Marabou Leech [fly] (25) |
| cold_slow | big_fish | Articulated Dungeon Streamer [fly] (27), Magnum Jerkbait [lure] (23), Articulated Baitfish Streamer [fly] (17), Rabbit-Strip Leech [fly] (14), Flat-Sided Crankbait [lure] (11) | Rabbit-Strip Leech [fly] (42), Game Changer [fly] (40), Compact Flipping Jig [lure] (39), Magnum Jerkbait [lure] (39), Articulated Dungeon Streamer [fly] (35) |
| warming_search | all_purpose | Clouser Minnow [fly] (8), Baitfish Slider Fly [fly] (6), Medium-Diving Crankbait [lure] (5), Suspending Jerkbait [lure] (5), Swim Jig [lure] (4) | Clouser Minnow [fly] (12), Medium-Diving Crankbait [lure] (10), Baitfish Slider Fly [fly] (8), Deceiver [fly] (8), Paddle-Tail Swimbait [lure] (7) |
| warming_search | big_fish | Articulated Baitfish Streamer [fly] (10), Magnum Jerkbait [lure] (8), Medium-Diving Crankbait [lure] (5), Articulated Dungeon Streamer [fly] (4), Compact Flipping Jig [lure] (4) | Articulated Baitfish Streamer [fly] (12), Game Changer [fly] (12), Compact Flipping Jig [lure] (11), Magnum Jerkbait [lure] (9), Medium-Diving Crankbait [lure] (8) |
| heat_finesse | all_purpose | Drop-Shot Minnow [lure] (6), Clouser Minnow [fly] (5), Ned Rig [lure] (3), Carolina-Rigged Stick Worm [lure] (2), Popper Fly [fly] (2) | Clouser Minnow [fly] (6), Drop-Shot Minnow [lure] (6), Foam Gurgler [fly] (3), Ned Rig [lure] (3), Soft Plastic Jerkbait [lure] (3) |
| heat_finesse | big_fish | Articulated Dungeon Streamer [fly] (3), Magnum Jerkbait [lure] (3), Walking Topwater [lure] (3), Articulated Baitfish Streamer [fly] (2), Deer Hair Slider [fly] (2) | Game Changer [fly] (6), Compact Flipping Jig [lure] (5), Articulated Baitfish Streamer [fly] (4), Rabbit-Strip Leech [fly] (4), Articulated Dungeon Streamer [fly] (3) |
| current_swing | all_purpose | Clouser Minnow [fly] (6), Soft Plastic Jerkbait [lure] (4), Foam Gurgler [fly] (3), Squarebill Crankbait [lure] (3), Woolly Bugger [fly] (3) | Clouser Minnow [fly] (9), Foam Gurgler [fly] (6), Squarebill Crankbait [lure] (6), Woolly Bugger [fly] (6), Soft Plastic Jerkbait [lure] (5) |
| current_swing | big_fish | Game Changer [fly] (7), Articulated Baitfish Streamer [fly] (5), Buzzbait [lure] (5), Walking Topwater [lure] (4), Magnum Jerkbait [lure] (3) | Game Changer [fly] (9), Articulated Baitfish Streamer [fly] (8), Compact Flipping Jig [lure] (8), Buzzbait [lure] (7), Rabbit-Strip Leech [fly] (7) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Northern California bass lake<br>2025-10-25 clear big_fish A | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+cold_slow+open_water_search, medium | Buzzbait (182); Magnum Jerkbait (192); Deer Hair Slider (166); Game Changer (176) | TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST, TOPWATER_SHOULDER_SEASON_REGION |
| Colorado mountain-west reservoir<br>2025-08-12 clear big_fish A | 60.3-86.9F, 7.6 mph wind, 27.3% cloud, 0 in precip | active, caution, wind_reaction+clear_subtle+open_water_search, medium | Magnum Worm (134); Medium-Diving Crankbait (172); Bluegill Streamer (162); Game Changer (176) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Minnesota natural bass lake<br>2025-05-15 dirty big_fish B | 60.3-76.3F, 18.2 mph wind, 86.5% cloud, 0.3 in precip | active, closed, wind_reaction+dirty_vibration, medium | Bladed Jig (140); Football Jig (140); Articulated Dungeon Streamer (152); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake Fork<br>2025-04-30 dirty all_purpose A | 63.2-78F, 11.6 mph wind, 84.4% cloud, 0.4 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration, medium | Buzzbait (152); Bladed Jig (152); Popper Fly (168); Unweighted Baitfish Streamer (150) | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK, DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION |
| Sam Rayburn Reservoir<br>2025-03-28 dirty big_fish B | 63-72.2F, 9.3 mph wind, 97.7% cloud, 1.4 in precip | active, closed, wind_reaction+dirty_vibration, medium | Bladed Jig (150); Football Jig (140); Game Changer (154); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-04-11 dirty big_fish B | 48.7-60.9F, 9.6 mph wind, 25.8% cloud, 0 in precip | neutral, caution, wind_reaction+dirty_vibration+cold_slow, medium | Squarebill Crankbait (162); Spinnerbait (152); Articulated Dungeon Streamer (164); Game Changer (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-04-11 stained big_fish B | 48.7-60.9F, 9.6 mph wind, 25.8% cloud, 0 in precip | neutral, caution, wind_reaction+dirty_vibration+cold_slow, medium | Squarebill Crankbait (162); Spinnerbait (152); Baitfish Slider Fly (162); Articulated Baitfish Streamer (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Southern California reservoir<br>2025-02-18 clear all_purpose B | 47.6-72.9F, 7.9 mph wind, 68.8% cloud, 0 in precip | active, closed, wind_reaction+open_water_search, medium | Blade Bait (174); Tube Jig (164); Clouser Minnow (166); Jighead Marabou Leech (146) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Southern California reservoir<br>2025-02-18 dirty big_fish B | 47.6-72.9F, 7.9 mph wind, 68.8% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Medium-Diving Crankbait (158); Compact Flipping Jig (170); Game Changer (156); Articulated Baitfish Streamer (162) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Northern California bass lake<br>2025-10-25 dirty big_fish A | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Magnum Jerkbait (184); Buzzbait (190); Articulated Baitfish Streamer (176); Game Changer (176) | TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST |
| Northern California bass lake<br>2025-10-25 dirty big_fish B | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Compact Flipping Jig (150); Walking Topwater (170); Deer Hair Slider (166); Articulated Dungeon Streamer (168) | TOPWATER_SHOULDER_SEASON_REGION, TOPWATER_SHOULDER_SEASON_REGION |
| Northern California bass lake<br>2025-10-25 stained big_fish A | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Magnum Jerkbait (192); Buzzbait (190); Baitfish Slider Fly (162); Articulated Baitfish Streamer (176) | TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST |
| Northern California bass lake<br>2025-10-25 stained big_fish B | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Walking Topwater (178); Compact Flipping Jig (150); Articulated Dungeon Streamer (168); Game Changer (176) | TOPWATER_SHOULDER_SEASON_REGION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Colorado mountain-west reservoir<br>2025-10-05 dirty big_fish B | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Lipless Crankbait (172); Medium-Diving Crankbait (178); Game Changer (176); Articulated Dungeon Streamer (168) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Colorado mountain-west reservoir<br>2025-10-05 stained big_fish B | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Medium-Diving Crankbait (178); Lipless Crankbait (172); Articulated Dungeon Streamer (168); Game Changer (176) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained all_purpose A | 59.2-76.4F, 5.9 mph wind, 19.1% cloud, 0 in precip | neutral, open, calm_surface+cold_slow, medium | Soft Plastic Jerkbait (174); Carolina-Rigged Stick Worm (170); Rabbit-Strip Leech (158); Woolly Bugger (158) | ADJACENT_DAY_EXACT_REPEAT, ADJACENT_DAY_EXACT_REPEAT |
| Illinois / Indiana natural-lake example<br>2025-04-18 clear big_fish A | 55-77.3F, 12.3 mph wind, 81.4% cloud, 1.1 in precip | neutral, closed, wind_reaction, medium | Magnum Jerkbait (154); Football Jig (140); Game Changer (154); Articulated Dungeon Streamer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Illinois / Indiana natural-lake example<br>2025-04-18 dirty big_fish B | 55-77.3F, 12.3 mph wind, 81.4% cloud, 1.1 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Compact Flipping Jig (156); Magnum Jerkbait (146); Deceiver (150); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Illinois / Indiana natural-lake example<br>2025-04-18 stained big_fish A | 55-77.3F, 12.3 mph wind, 81.4% cloud, 1.1 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Magnum Jerkbait (154); Compact Flipping Jig (156); Game Changer (154); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Illinois / Indiana natural-lake example<br>2025-10-18 clear big_fish A | 59.6-73.2F, 8.1 mph wind, 94.1% cloud, 0.2 in precip | active, closed, wind_reaction+warming_search+open_water_search, medium | Magnum Jerkbait (176); Football Jig (134); Articulated Dungeon Streamer (160); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Illinois / Indiana natural-lake example<br>2025-10-18 dirty big_fish A | 59.6-73.2F, 8.1 mph wind, 94.1% cloud, 0.2 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Magnum Jerkbait (168); Compact Flipping Jig (150); Articulated Baitfish Streamer (176); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Minnesota natural bass lake<br>2025-03-20 clear big_fish A | 22.8-46.6F, 9.7 mph wind, 37.1% cloud, 0 in precip | neutral, closed, wind_reaction+open_water_search, medium | Magnum Jerkbait (162); Football Jig (154); Game Changer (156); Articulated Dungeon Streamer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Minnesota natural bass lake<br>2025-03-20 stained big_fish A | 22.8-46.6F, 9.7 mph wind, 37.1% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Football Jig (154); Magnum Jerkbait (162); Game Changer (156); Rabbit-Strip Leech (148) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Minnesota natural bass lake<br>2025-05-15 clear big_fish A | 60.3-76.3F, 18.2 mph wind, 86.5% cloud, 0.3 in precip | active, closed, wind_reaction, medium | Football Jig (140); Magnum Jerkbait (144); Articulated Dungeon Streamer (144); Game Changer (144) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Minnesota natural bass lake<br>2025-05-15 stained big_fish A | 60.3-76.3F, 18.2 mph wind, 86.5% cloud, 0.3 in precip | active, closed, wind_reaction+dirty_vibration, medium | Football Jig (140); Magnum Jerkbait (144); Bluegill Streamer (140); Articulated Baitfish Streamer (144) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Minnesota natural bass lake<br>2025-05-15 stained big_fish B | 60.3-76.3F, 18.2 mph wind, 86.5% cloud, 0.3 in precip | active, closed, wind_reaction+dirty_vibration, medium | Medium-Diving Crankbait (152); Compact Flipping Jig (156); Articulated Dungeon Streamer (152); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Minnesota natural bass lake<br>2025-07-16 dirty big_fish A | 56.8-70.2F, 13.8 mph wind, 93.2% cloud, 0.9 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+open_water_search, medium | Wake Bait (172); Compact Flipping Jig (150); Game Changer (176); Deer Hair Slider (166) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Lake of the Ozarks<br>2025-06-18 stained big_fish A | 66.9-79.1F, 10.1 mph wind, 70.4% cloud, 1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration, medium | Wake Bait (180); Compact Flipping Jig (156); Articulated Baitfish Streamer (144); Mouse Fly (162) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Lake of the Ozarks<br>2025-11-11 clear big_fish A | 41-68.3F, 9.5 mph wind, 53% cloud, 0 in precip | neutral, closed, wind_reaction+open_water_search, medium | Football Jig (134); Magnum Jerkbait (176); Game Changer (176); Articulated Dungeon Streamer (160) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Lake of the Ozarks<br>2025-11-11 stained big_fish A | 41-68.3F, 9.5 mph wind, 53% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Magnum Jerkbait (176); Compact Flipping Jig (150); Game Changer (176); Articulated Baitfish Streamer (176) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Jordan Lake / Piedmont reservoir<br>2025-03-22 clear all_purpose A | 44.6-71.1F, 9.8 mph wind, 0.4% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle, medium | Tube Jig (182); Soft Plastic Jerkbait (180); Deceiver (162); Clouser Minnow (164) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Jordan Lake / Piedmont reservoir<br>2025-03-22 clear big_fish A | 44.6-71.1F, 9.8 mph wind, 0.4% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle, medium | Football Jig (140); Magnum Jerkbait (170); Unweighted Baitfish Streamer (140); Game Changer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |

## Known Coverage Gaps

- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
