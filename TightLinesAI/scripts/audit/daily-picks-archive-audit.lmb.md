# FinFindr LMB Daily-Picks Archive Audit
Generated: 2026-05-18T14:09:18.995Z

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
| breezy_windy_stained_reaction | 80 |
| dirty_vibration | 92 |
| cold_slow_or_front | 348 |
| warming_search | 48 |
| heat_limited_finesse | 24 |
| stable_pleasant_high_confidence | 276 |
| stable_pleasant_medium_confidence_archive | 0 |
| river_elevated_runoff_current | 36 |
| medium_confidence_archive | 0 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 3 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 -> 2025-03-19 | changed | 7.8 | 3.5 | cold_slow -> calm_surface|cold_slow |
| Guntersville / Tennessee River reservoir<br>2025-10-19 -> 2025-10-20 | changed | 8.3 | 3.3 | wind_reaction|dirty_vibration|open_water_search -> cold_slow |
| Minnesota natural bass lake<br>2025-09-20 -> 2025-09-21 | changed | 1.8 | 1.5 | none -> calm_surface |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 33 | WIND_NOT_ELEVATING_REACTION (34), BIG_FISH_NOT_FAVORING_UPSIDE (4), TOPWATER_SHOULDER_SEASON_REGION (3), COLD_CLEAR_TOO_FAST (2) |
| calm_bright_clear_subtle | 4 | BIG_FISH_NOT_FAVORING_UPSIDE (4) |
| calm_low_light_surface | 11 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (11) |
| cold_slow_or_front | 92 | WIND_NOT_ELEVATING_REACTION (62), BIG_FISH_NOT_FAVORING_UPSIDE (23), TOPWATER_SHOULDER_SEASON_REGION (9), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (8), COLD_CLEAR_TOO_FAST (7) |
| dirty_vibration | 41 | WIND_NOT_ELEVATING_REACTION (34), BIG_FISH_NOT_FAVORING_UPSIDE (4), COLD_CLEAR_TOO_FAST (3), TOPWATER_SHOULDER_SEASON_REGION (3), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2) |
| heat_limited_finesse | 5 | BIG_FISH_NOT_FAVORING_UPSIDE (5) |
| river_elevated_runoff_current | 3 | BIG_FISH_NOT_FAVORING_UPSIDE (4) |
| stable_pleasant_high_confidence | 45 | WIND_NOT_ELEVATING_REACTION (33), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (16) |
| unclassified | 9 | TOPWATER_SHOULDER_SEASON_REGION (6), WIND_NOT_ELEVATING_REACTION (5) |
| warming_search | 2 | BIG_FISH_NOT_FAVORING_UPSIDE (3) |

- WIND_NOT_ELEVATING_REACTION: 108
- BIG_FISH_NOT_FAVORING_UPSIDE: 32
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 24
- TOPWATER_SHOULDER_SEASON_REGION: 15
- COLD_CLEAR_TOO_FAST: 7
- DIRTY_WIND_NOT_ELEVATING_VIBRATION: 2

- ca_clear_lake__2025-10-25__freshwater_lake_pond__clear__big_fish__A: TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST. Picks: Magnum Jerkbait (lure); Buzzbait (lure); Deer Hair Slider (fly); Dungeon Streamer (fly)
- ca_clear_lake__2025-10-25__freshwater_lake_pond__stained__big_fish__A: TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST. Picks: Magnum Jerkbait (lure); Buzzbait (lure); Articulated Baitfish (fly); Deer Hair Slider (fly)
- ca_clear_lake__2025-10-25__freshwater_lake_pond__dirty__big_fish__A: TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST. Picks: Buzzbait (lure); Magnum Jerkbait (lure); Articulated Baitfish (fly); Deer Hair Slider (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Articulated Baitfish (fly); Game Changer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Dungeon Streamer (fly); Game Changer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__clear__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK, WIND_NOT_ELEVATING_REACTION. Picks: Hollow-Body Frog (lure); Suspending Jerkbait (lure); Unweighted Baitfish (fly); Clouser Minnow (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__stained__big_fish__B: COLD_CLEAR_TOO_FAST, BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Buzzbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Jigged Marabou Leech (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Dungeon Streamer (fly); Baitfish Slider (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__dirty__all_purpose__B: DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION. Picks: Spinnerbait (lure); Medium-Diving Crankbait (lure); Clouser Minnow (fly); Unweighted Baitfish (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Articulated Baitfish (fly); Unweighted Baitfish (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION, BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Baitfish Slider (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__dirty__all_purpose__B: DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION. Picks: Spinnerbait (lure); Medium-Diving Crankbait (lure); Clouser Minnow (fly); Unweighted Baitfish (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Dungeon Streamer (fly); Baitfish Slider (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Glide Bait (lure); Compact Flipping Jig (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Squarebill Crankbait (lure); Bladed Jig (lure); Bluegill Streamer (fly); Rabbit-Strip Leech (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Dungeon Streamer (fly); Game Changer (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- wv_new_river__2025-04-04__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Bladed Jig (lure); Squarebill Crankbait (lure); Clouser Minnow (fly); Marabou Jig Leech (fly)
- nm_elephant_butte__2025-04-17__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Soft Jerkbait (lure); Texas-Rigged Craw (lure); Crawfish Fly (fly); Unweighted Baitfish (fly)
- nm_elephant_butte__2025-04-17__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- nm_elephant_butte__2025-10-14__freshwater_lake_pond__clear__big_fish__A: TOPWATER_SHOULDER_SEASON_REGION. Picks: Magnum Jerkbait (lure); Walking Bait (lure); Dungeon Streamer (fly); Deer Hair Slider (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__clear__big_fish__A: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Texas-Rigged Craw (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Dungeon Streamer (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__big_fish__A: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Deep-Diving Crankbait (lure); Bladed Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__big_fish__A: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Texas-Rigged Craw (lure); Medium-Diving Crankbait (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Deep-Diving Crankbait (lure); Bladed Jig (lure); Game Changer (fly); Jigged Marabou Leech (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Hollow-Body Frog (lure); Paddle-Tail Swimbait (lure); Bass Popper (fly); Rabbit-Strip Leech (fly)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__clear__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Soft Jerkbait (lure); Hollow-Body Frog (lure); Unweighted Baitfish (fly); Bass Popper (fly)
- fl_okeechobee__2025-06-20__freshwater_lake_pond__dirty__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Wake Bait (lure); Paddle-Tail Swimbait (lure); Baitfish Slider (fly); Clouser Minnow (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Texas-Rigged Craw (lure); Clouser Minnow (fly); Baitfish Slider (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Spinnerbait (lure); Clouser Minnow (fly); Baitfish Slider (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Lipless Crankbait (lure); Bladed Jig (lure); Game Changer (fly); Jigged Marabou Leech (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Football Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-04-12__freshwater_lake_pond__dirty__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Hollow-Body Frog (lure); Soft Jerkbait (lure); Unweighted Baitfish (fly); Clouser Minnow (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__clear__big_fish__B: COLD_CLEAR_TOO_FAST. Picks: Buzzbait (lure); Glide Bait (lure); Dungeon Streamer (fly); Jigged Marabou Leech (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__big_fish__B: COLD_CLEAR_TOO_FAST. Picks: Magnum Jerkbait (lure); Buzzbait (lure); Dungeon Streamer (fly); Jigged Marabou Leech (fly)
- tx_sam_rayburn__2025-07-24__freshwater_lake_pond__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Buzzbait (lure); Bladed Jig (lure); Bass Popper (fly); Game Changer (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Game Changer (fly); Baitfish Slider (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Finesse Jig (lure); Clouser Minnow (fly); Jigged Marabou Leech (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Spinnerbait (lure); Game Changer (fly); Baitfish Slider (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Spinnerbait (lure); Clouser Minnow (fly); Baitfish Slider (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Squarebill Crankbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Frog Popper (fly); Articulated Baitfish (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__dirty__big_fish__B: COLD_CLEAR_TOO_FAST. Picks: Buzzbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Frog Popper (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Texas-Rigged Craw (lure); Game Changer (fly); Baitfish Slider (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Carolina-Rigged Stick Worm (lure); Clouser Minnow (fly); Unweighted Baitfish (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Unweighted Baitfish (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Spinnerbait (lure); Medium-Diving Crankbait (lure); Clouser Minnow (fly); Unweighted Baitfish (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Buzzbait (lure); Dungeon Streamer (fly); Baitfish Slider (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Game Changer (fly); Unweighted Baitfish (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Articulated Baitfish (fly); Baitfish Slider (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Flipping Jig (lure); Buzzbait (lure); Game Changer (fly); Baitfish Slider (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Lipless Crankbait (lure); Football Jig (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- al_guntersville__2025-10-20__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Tube Jig (lure); Articulated Baitfish (fly); Crawfish Fly (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 63
- SET_B_ID_OVERLAP_AVOIDABLE: 43
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 13
- ADJACENT_DAY_EXACT_REPEAT: 3

- nc_jordan_lake__2025-03-22__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- nm_elephant_butte__2025-04-17__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Football Jig (lure); Articulated Baitfish (fly); Jigged Marabou Leech (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Bladed Jig (lure); Football Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- al_guntersville__2025-03-08__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Football Jig (lure); Articulated Baitfish (fly); Jigged Marabou Leech (fly)
- al_guntersville__2025-03-08__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Jigged Marabou Leech (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Soft Jerkbait (lure); Shaky-Head Worm (lure); Baitfish Slider (fly); Jigged Marabou Leech (fly)
- mo_lake_ozarks__2025-04-24__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Football Jig (lure); Deep-Diving Crankbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Bladed Jig (lure); Football Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- il_fox_chain__2025-04-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Compact Flipping Jig (lure); Medium-Diving Crankbait (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- wv_stonewall__2025-03-26__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Football Jig (lure); Dungeon Streamer (fly); Jigged Marabou Leech (fly)
- wv_stonewall__2025-03-26__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Jigged Marabou Leech (fly)
- ca_clear_lake__2025-03-30__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Football Jig (lure); Dungeon Streamer (fly); Jigged Marabou Leech (fly)
- ca_clear_lake__2025-03-30__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Jigged Marabou Leech (fly)
- az_havasu__2025-03-25__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- nm_elephant_butte__2025-04-17__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Squarebill Crankbait (lure); Compact Flipping Jig (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Flat-Sided Crankbait (lure); Lead-Eye Leech (fly); Unweighted Baitfish (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Carolina-Rigged Stick Worm (lure); Clouser Minnow (fly); Rabbit-Strip Leech (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Compact Flipping Jig (lure); Suspending Jerkbait (lure); Dungeon Streamer (fly); Jigged Marabou Leech (fly)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Deep-Diving Crankbait (lure); Bladed Jig (lure); Game Changer (fly); Jigged Marabou Leech (fly)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Weightless Stick Worm (lure); Topwater Popper (lure); Rabbit-Strip Leech (fly); Woolly Bugger (fly)
- fl_okeechobee__2025-08-18__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Shaky-Head Worm (lure); Unweighted Baitfish (fly); Clouser Minnow (fly)
- fl_okeechobee__2025-12-12__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Texas-Rigged Craw (lure); Clouser Minnow (fly); Jigged Marabou Leech (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Paddle-Tail Swimbait (lure); Woolly Bugger (fly); Marabou Jig Leech (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Spinnerbait (lure); Clouser Minnow (fly); Jigged Marabou Leech (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Football Jig (lure); Drop-Shot Minnow (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Paddle-Tail Swimbait (lure); Blade Bait (lure); Articulated Baitfish (fly); Jigged Marabou Leech (fly)
- tx_sam_rayburn__2025-02-11__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Football Jig (lure); Tube Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-03-28__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-04-12__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Hollow-Body Frog (lure); Compact Flipping Jig (lure); Frog Popper (fly); Game Changer (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Shaky-Head Worm (lure); Woolly Bugger (fly); Lead-Eye Leech (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Buzzbait (lure); Glide Bait (lure); Dungeon Streamer (fly); Jigged Marabou Leech (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Spinnerbait (lure); Blade Bait (lure); Clouser Minnow (fly); Rabbit-Strip Leech (fly)
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Magnum Jerkbait (lure); Buzzbait (lure); Dungeon Streamer (fly); Jigged Marabou Leech (fly)
- tx_sam_rayburn__2025-07-24__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Walking Bait (lure); Magnum Worm (lure); Mouse Pattern (fly); Articulated Baitfish (fly)
- tx_lake_fork__2025-03-29__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tx_lake_fork__2025-04-30__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Buzzbait (lure); Hollow-Body Frog (lure); Frog Popper (fly); Articulated Baitfish (fly)
- al_guntersville__2025-03-08__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Carolina-Rigged Stick Worm (lure); Clouser Minnow (fly); Lead-Eye Leech (fly)
- al_guntersville__2025-03-08__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Compact Flipping Jig (lure); Articulated Baitfish (fly); Jigged Marabou Leech (fly)
- al_guntersville__2025-03-08__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Texas-Rigged Craw (lure); Deceiver (fly); Jigged Marabou Leech (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Frog Popper (fly); Articulated Baitfish (fly)
- al_guntersville__2025-04-11__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Spinnerbait (lure); Blade Bait (lure); Woolly Bugger (fly); Rabbit-Strip Leech (fly)
- al_guntersville__2025-10-19__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Football Jig (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- al_guntersville__2025-10-20__freshwater_lake_pond__clear__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Texas-Rigged Craw (lure); Suspending Jerkbait (lure); Crawfish Fly (fly); Unweighted Baitfish (fly)
- al_guntersville__2025-10-20__freshwater_lake_pond__clear__big_fish__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Magnum Jerkbait (lure); Football Jig (lure); Rabbit-Strip Leech (fly); Game Changer (fly)
- al_guntersville__2025-10-20__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Deep-Diving Crankbait (lure); Suspending Jerkbait (lure); Articulated Baitfish (fly); Crawfish Fly (fly)
- nc_jordan_lake__2025-03-22__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- nc_jordan_lake__2025-08-11__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Buzzbait (lure); Magnum Worm (lure); Bluegill Streamer (fly); Deer Hair Slider (fly)
- mo_lake_ozarks__2025-02-20__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Tube Jig (lure); Suspending Jerkbait (lure); Dungeon Streamer (fly); Jigged Marabou Leech (fly)
- mo_lake_ozarks__2025-02-20__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Football Jig (lure); Suspending Jerkbait (lure); Dungeon Streamer (fly); Jigged Marabou Leech (fly)
- mo_lake_ozarks__2025-04-24__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Compact Flipping Jig (lure); Magnum Jerkbait (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- mo_lake_ozarks__2025-11-11__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Lipless Crankbait (lure); Football Jig (lure); Game Changer (fly); Baitfish Slider (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Carolina-Rigged Stick Worm (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Lead-Eye Leech (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Compact Flipping Jig (lure); Deceiver (fly); Articulated Baitfish (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Spinnerbait (lure); Clouser Minnow (fly); Jigged Marabou Leech (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Deceiver (fly); Rabbit-Strip Leech (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Spinnerbait (lure); Clouser Minnow (fly); Lead-Eye Leech (fly)
- mn_minnetonka__2025-03-20__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mn_minnetonka__2025-05-15__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Squarebill Crankbait (lure); Bladed Jig (lure); Bluegill Streamer (fly); Rabbit-Strip Leech (fly)

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
| Southwest desert bass reservoir<br>2025-03-25 clear big_fish B | 67.7-95.9F | Game Changer (medium) |
| Southwest desert bass reservoir<br>2025-03-25 stained all_purpose B | 67.7-95.9F | Clouser Minnow (medium) |
| Southwest desert bass reservoir<br>2025-03-25 stained big_fish A | 67.7-95.9F | Magnum Jerkbait (medium) |
| Southwest desert bass reservoir<br>2025-03-25 stained big_fish B | 67.7-95.9F | Game Changer (medium) |
| Southwest desert bass reservoir<br>2025-03-25 dirty all_purpose B | 67.7-95.9F | Articulated Baitfish (medium) |
| Southwest desert bass reservoir<br>2025-03-25 dirty big_fish B | 67.7-95.9F | Articulated Baitfish (medium) |
| Southwest desert bass reservoir<br>2025-08-21 clear all_purpose A | 93.2-115.6F | Unweighted Baitfish (medium) |
| Southwest desert bass reservoir<br>2025-08-21 clear all_purpose B | 93.2-115.6F | Soft Jerkbait (medium) |
| Southwest desert bass reservoir<br>2025-08-21 clear big_fish A | 93.2-115.6F | Soft Jerkbait (medium); Articulated Baitfish (medium) |
| Southwest desert bass reservoir<br>2025-08-21 clear big_fish B | 93.2-115.6F | Game Changer (medium) |
| Southwest desert bass reservoir<br>2025-08-21 stained all_purpose A | 93.2-115.6F | Articulated Baitfish (medium) |
| Southwest desert bass reservoir<br>2025-08-21 stained all_purpose B | 93.2-115.6F | Soft Jerkbait (medium); Clouser Minnow (medium) |
| Southwest desert bass reservoir<br>2025-08-21 stained big_fish A | 93.2-115.6F | Game Changer (medium) |
| Southwest desert bass reservoir<br>2025-08-21 dirty all_purpose A | 93.2-115.6F | Suspending Jerkbait (medium); Baitfish Slider (medium) |
| Southwest desert bass reservoir<br>2025-08-21 dirty all_purpose B | 93.2-115.6F | Paddle-Tail Swimbait (medium); Articulated Baitfish (medium) |
| Southwest desert bass reservoir<br>2025-08-21 dirty big_fish B | 93.2-115.6F | Articulated Baitfish (medium) |

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Apr | south_central | caution | bright | big_fish | 6 | 48.7-60.9F | 9.6 |
| Apr | south_central | open | glare | all_purpose | 4 | 55.2-78.8F | 5.6 |
| Apr | south_central | open | glare | big_fish | 6 | 55.2-78.8F | 5.6 |
| Apr | south_central | open | low_light | all_purpose | 5 | 63.2-78.0F | 11.6 |
| Apr | south_central | open | low_light | big_fish | 6 | 63.2-78.0F | 11.6 |
| Apr | southeast_atlantic | open | low_light | all_purpose | 4 | 67.1-82.8F | 9.6 |
| Apr | southeast_atlantic | open | low_light | big_fish | 6 | 67.1-82.8F | 9.6 |
| Apr | southern_california | open | mixed | all_purpose | 4 | 52.9-78.6F | 5.4 |
| Apr | southern_california | open | mixed | big_fish | 6 | 52.9-78.6F | 5.4 |
| Aug | florida | caution | bright | big_fish | 6 | 83.1-89.8F | 6.9 |
| Aug | great_lakes_upper_midwest | open | mixed | all_purpose | 5 | 58.5-77.6F | 4.7 |
| Aug | great_lakes_upper_midwest | open | mixed | big_fish | 6 | 58.5-77.6F | 4.7 |
| Aug | mountain_west | caution | bright | all_purpose | 1 | 60.3-86.9F | 7.6 |
| Aug | mountain_west | caution | bright | big_fish | 6 | 60.3-86.9F | 7.6 |
| Aug | northeast | caution | bright | all_purpose | 1 | 69.7-77.0F | 8.8 |
| Aug | northeast | caution | bright | big_fish | 6 | 69.7-77.0F | 8.8 |
| Aug | northern_california | caution | mixed | all_purpose | 1 | 57.5-83.4F | 8.7 |
| Aug | northern_california | caution | mixed | big_fish | 6 | 57.5-83.4F | 8.7 |
| Aug | southeast_atlantic | open | low_light | all_purpose | 6 | 72.1-80.9F | 4.6 |
| Aug | southeast_atlantic | open | low_light | big_fish | 6 | 72.1-80.9F | 4.6 |
| Aug | southwest_high_desert | caution | bright | all_purpose | 1 | 67.7-95.6F | 6.7 |
| Aug | southwest_high_desert | caution | bright | big_fish | 6 | 67.7-95.6F | 6.7 |
| Jul | appalachian | open | bright | all_purpose | 6 | 69.2-86.6F | 4.8 |
| Jul | appalachian | open | bright | big_fish | 6 | 69.2-86.6F | 4.8 |
| Jul | great_lakes_upper_midwest | open | low_light | all_purpose | 5 | 56.8-70.2F | 13.8 |
| Jul | great_lakes_upper_midwest | open | low_light | big_fish | 6 | 56.8-70.2F | 13.8 |
| Jul | south_central | open | low_light | all_purpose | 5 | 76.6-94.7F | 4.1 |
| Jul | south_central | open | low_light | big_fish | 6 | 76.6-94.7F | 4.1 |
| Jul | southeast_atlantic | open | mixed | all_purpose | 5 | 80.4-94.6F | 4.2 |
| Jul | southeast_atlantic | open | mixed | big_fish | 6 | 80.4-94.6F | 4.2 |
| Jul | southern_california | open | glare | all_purpose | 5 | 64.3-89.0F | 5.6 |
| Jul | southern_california | open | glare | big_fish | 6 | 64.3-89.0F | 5.6 |
| Jun | appalachian | caution | low_light | all_purpose | 2 | 64.2-78.3F | 6.2 |
| Jun | appalachian | caution | low_light | big_fish | 6 | 64.2-78.3F | 6.2 |
| Jun | florida | open | low_light | all_purpose | 6 | 78.3-85.4F | 5.7 |
| Jun | florida | open | low_light | big_fish | 6 | 78.3-85.4F | 5.7 |
| Jun | great_lakes_upper_midwest | caution | mixed | big_fish | 4 | 56.6-75.0F | 7.2 |
| Jun | midwest_interior | open | low_light | all_purpose | 5 | 66.9-79.1F | 10.1 |
| Jun | midwest_interior | open | low_light | big_fish | 6 | 66.9-79.1F | 10.1 |
| Jun | mountain_west | caution | glare | all_purpose | 1 | 61.5-93.6F | 6.5 |
| Jun | mountain_west | caution | glare | big_fish | 4 | 61.5-93.6F | 6.5 |
| Jun | northeast | open | mixed | all_purpose | 6 | 58.4-74.2F | 5.2 |
| Jun | northeast | open | mixed | big_fish | 6 | 58.4-74.2F | 5.2 |
| Jun | south_central | caution | low_light | all_purpose | 2 | 71.3-84.0F | 7.2 |
| Jun | south_central | caution | low_light | big_fish | 6 | 71.3-84.0F | 7.2 |
| Jun | south_central | caution | mixed | big_fish | 6 | 74.8-84.7F | 7.3 |
| Jun | southwest_desert | open | glare | all_purpose | 6 | 82.2-109.0F | 6 |
| Jun | southwest_desert | open | glare | big_fish | 6 | 82.2-109.0F | 6 |
| Mar | florida | open | bright | all_purpose | 5 | 59.2-76.4F | 5.9 |
| Mar | florida | open | bright | big_fish | 6 | 59.2-76.4F | 5.9 |
| May | appalachian | open | mixed | all_purpose | 6 | 51.3-72.6F | 5.3 |
| May | appalachian | open | mixed | big_fish | 5 | 51.3-72.6F | 5.3 |
| May | northern_california | open | bright | all_purpose | 6 | 44.9-75.1F | 5.4 |
| May | northern_california | open | bright | big_fish | 6 | 44.9-75.1F | 5.4 |
| May | south_central | caution | mixed | big_fish | 6 | 62.6-76.0F | 10.1 |
| May | southeast_atlantic | caution | low_light | all_purpose | 2 | 70.1-85.1F | 7.9 |
| May | southeast_atlantic | caution | low_light | big_fish | 6 | 70.1-85.1F | 7.9 |
| May | southeast_atlantic | open | low_light | all_purpose | 6 | 60.5-79.6F | 2.6 |
| May | southeast_atlantic | open | low_light | big_fish | 6 | 60.5-79.6F | 2.6 |
| Nov | southwest_desert | caution | low_light | big_fish | 6 | 64.4-73.2F | 6.2 |
| Oct | northern_california | open | low_light | big_fish | 6 | 49.9-59.6F | 9.9 |
| Oct | south_central | caution | mixed | big_fish | 2 | 54.1-72.0F | 12.4 |
| Oct | southeast_atlantic | open | mixed | all_purpose | 3 | 54.6-75.9F | 3 |
| Oct | southeast_atlantic | open | mixed | big_fish | 6 | 54.6-75.9F | 3 |
| Oct | southwest_high_desert | caution | mixed | big_fish | 5 | 58.1-77.9F | 6.3 |
| Sep | appalachian | open | low_light | all_purpose | 4 | 55.8-73.2F | 5.6 |
| Sep | appalachian | open | low_light | big_fish | 6 | 55.8-73.2F | 5.6 |
| Sep | great_lakes_upper_midwest | caution | mixed | big_fish | 4 | 60.1-71.6F | 6.4 |
| Sep | great_lakes_upper_midwest | open | mixed | all_purpose | 6 | 60.7-74.0F | 4.6 |
| Sep | great_lakes_upper_midwest | open | mixed | big_fish | 6 | 60.7-74.0F | 4.6 |
| Sep | midwest_interior | open | mixed | all_purpose | 6 | 71.4-93.8F | 5.3 |
| Sep | midwest_interior | open | mixed | big_fish | 6 | 71.4-93.8F | 5.3 |
| Sep | south_central | open | bright | all_purpose | 6 | 72.8-91.2F | 3.6 |
| Sep | south_central | open | bright | big_fish | 6 | 72.8-91.2F | 3.6 |
| Sep | southeast_atlantic | open | low_light | all_purpose | 6 | 71.7-81.1F | 3.9 |
| Sep | southeast_atlantic | open | low_light | big_fish | 6 | 71.7-81.1F | 3.9 |
| Sep | southern_california | open | glare | all_purpose | 5 | 62.0-94.0F | 4.8 |
| Sep | southern_california | open | glare | big_fish | 6 | 62.0-94.0F | 4.8 |

### Shoulder-Season Topwater Selections

| Scenario | Weather | Daily | Topwater picks |
| --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear all_purpose A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Topwater Popper |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear all_purpose B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Bass Popper |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Hollow-Body Frog; Deer Hair Slider |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 clear big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+clear_subtle+cold_slow | Hollow-Body Frog; Frog Popper |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained all_purpose A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Topwater Popper |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained all_purpose B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Bass Popper |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Hollow-Body Frog; Deer Hair Slider |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 stained big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Hollow-Body Frog; Frog Popper |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty all_purpose A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Hollow-Body Frog; Bass Popper |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty big_fish A | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Hollow-Body Frog; Frog Popper |
| Lake Okeechobee / central FL bass lake<br>2025-03-19 dirty big_fish B | 59.2-76.4F, 5.9 mph, bright | open, calm_surface+cold_slow | Hollow-Body Frog |
| Sam Rayburn Reservoir<br>2025-04-12 clear all_purpose A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface+clear_subtle | Topwater Popper; Bass Popper |
| Sam Rayburn Reservoir<br>2025-04-12 clear big_fish A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface+clear_subtle | Hollow-Body Frog; Deer Hair Slider |
| Sam Rayburn Reservoir<br>2025-04-12 clear big_fish B | 55.2-78.8F, 5.6 mph, glare | open, calm_surface+clear_subtle | Hollow-Body Frog; Frog Popper |
| Sam Rayburn Reservoir<br>2025-04-12 stained all_purpose A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Topwater Popper; Bass Popper |
| Sam Rayburn Reservoir<br>2025-04-12 stained big_fish A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Hollow-Body Frog; Frog Popper |
| Sam Rayburn Reservoir<br>2025-04-12 stained big_fish B | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Hollow-Body Frog; Deer Hair Slider |
| Sam Rayburn Reservoir<br>2025-04-12 dirty all_purpose A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Topwater Popper; Bass Popper |
| Sam Rayburn Reservoir<br>2025-04-12 dirty all_purpose B | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Hollow-Body Frog |
| Sam Rayburn Reservoir<br>2025-04-12 dirty big_fish A | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Hollow-Body Frog; Deer Hair Slider |
| Sam Rayburn Reservoir<br>2025-04-12 dirty big_fish B | 55.2-78.8F, 5.6 mph, glare | open, calm_surface | Hollow-Body Frog; Frog Popper |
| Lake Fork<br>2025-04-30 clear all_purpose A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction | Hollow-Body Frog |
| Lake Fork<br>2025-04-30 clear all_purpose B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction | Bass Popper |
| Lake Fork<br>2025-04-30 clear big_fish A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction | Hollow-Body Frog; Frog Popper |
| Lake Fork<br>2025-04-30 clear big_fish B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction | Buzzbait; Hollow-Body Frog; Deer Hair Slider |
| Lake Fork<br>2025-04-30 stained all_purpose A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Topwater Popper |
| Lake Fork<br>2025-04-30 stained all_purpose B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Bass Popper |
| Lake Fork<br>2025-04-30 stained big_fish A | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Hollow-Body Frog; Frog Popper |
| Lake Fork<br>2025-04-30 stained big_fish B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Buzzbait; Hollow-Body Frog; Deer Hair Slider |
| Lake Fork<br>2025-04-30 dirty all_purpose B | 63.2-78F, 11.6 mph, low_light | open, low_light_surface+wind_reaction+dirty_vibration | Bass Popper |

## Water Column Diversity Diagnostics

### Same-Side Surface/Surface Summary

| Side | Goal | Set | Region | Month | Clarity | Surface tags | Rows | Close non-surface alt | Credible non-surface alt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lure | big_fish | B | florida | Jun | dirty | calm_surface+low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Apr | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Apr | dirty | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Apr | stained | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Apr | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Apr | dirty | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | Apr | stained | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | southeast_atlantic | May | dirty | calm_surface+low_light_surface | 1 | 0 | 0 |

### Remaining Same-Side Surface/Surface Examples

| Scenario | Side | Selected surface pair | Close non-surface alternatives | Why left |
| --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-06-20 dirty big_fish B | lure | Buzzbait (174); Hollow-Body Frog (210) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Lake Fork<br>2025-04-30 clear big_fish B | lure | Buzzbait (182); Hollow-Body Frog (210) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Lake Fork<br>2025-04-30 stained big_fish B | lure | Buzzbait (190); Hollow-Body Frog (210) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Lake Fork<br>2025-04-30 dirty big_fish B | lure | Buzzbait (190); Hollow-Body Frog (210) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Santee Cooper<br>2025-04-05 clear big_fish B | lure | Buzzbait (182); Hollow-Body Frog (210) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Santee Cooper<br>2025-04-05 stained big_fish B | lure | Buzzbait (190); Hollow-Body Frog (210) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Santee Cooper<br>2025-04-05 dirty big_fish B | lure | Buzzbait (190); Hollow-Body Frog (210) | close: none<br>credible: none | No close non-surface alternative in the audit band. |
| Jordan Lake / Piedmont reservoir<br>2025-05-08 dirty big_fish B | lure | Buzzbait (174); Hollow-Body Frog (210) | close: none<br>credible: none | No close non-surface alternative in the audit band. |

### Same-Side Column/Band Summary

| Side | Same exact column | Same broad band | Same broad band with close different-band alt |
| --- | --- | --- | --- |
| lure | 73 | 73 | 9 |
| fly | 13 | 13 | 7 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 324 | - |
| open-surface rows with 2+ surface picks | 217 | 213 |
| open-surface rows with 3+ surface picks | 8 | 6 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 73 | 70 |
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
| exact_id | truly_avoidable | 8 | 35 | 43 |
| exact_id | unavoidable_due_score_band | 42 | 0 | 42 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 12 | 0 | 12 |
| exact_id | unavoidable_due_goal_condition_fit | 4 | 0 | 4 |
| same_family_same_presentation | truly_avoidable | 22 | 41 | 63 |
| same_family_same_presentation | unavoidable_due_score_band | 23 | 3 | 26 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 6 | 1 | 7 |
| same_family_same_presentation | unavoidable_due_goal_condition_fit | 38 | 14 | 52 |
| same_family_different_presentation | truly_avoidable | 0 | 13 | 13 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 17 | 17 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 6 | 6 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 2 | 9 | 11 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Guntersville / Tennessee River reservoir<br>2025-10-19 dirty big_fish | lure honorable: same_family_same_presentation | Compact Flipping Jig (150); Buzzbait (150) | Lipless Crankbait (172); Football Jig (134) | Magnum Jerkbait (180, alt edge 46) |
| Colorado mountain-west reservoir<br>2025-10-05 dirty big_fish | fly honorable: exact_id | Articulated Baitfish (160); Rabbit-Strip Leech (134) | Game Changer (160); Rabbit-Strip Leech (134) | Dungeon Streamer (168, alt edge 34) |
| Illinois / Indiana natural-lake example<br>2025-08-02 stained big_fish | lure honorable: exact_id | Topwater Popper (166); Magnum Worm (146) | Walking Bait (178); Magnum Worm (146) | Wake Bait (180, alt edge 34) |
| Lake of the Ozarks<br>2025-02-20 stained big_fish | lure honorable: exact_id | Texas-Rigged Craw (166); Suspending Jerkbait (136) | Tube Jig (162); Suspending Jerkbait (136) | Football Jig (170, alt edge 34) |
| Jordan Lake / Piedmont reservoir<br>2025-08-11 stained big_fish | lure honorable: exact_id | Hollow-Body Frog (204); Magnum Worm (146) | Buzzbait (180); Magnum Worm (146) | Wake Bait (180, alt edge 34) |
| Sam Rayburn Reservoir<br>2025-07-24 stained big_fish | lure honorable: exact_id | Buzzbait (180); Magnum Worm (146) | Walking Bait (178); Magnum Worm (146) | Wake Bait (180, alt edge 34) |
| WV/VA highland reservoir<br>2025-11-08 dirty big_fish | fly honorable: exact_id | Articulated Baitfish (160); Rabbit-Strip Leech (134) | Game Changer (160); Rabbit-Strip Leech (134) | Dungeon Streamer (168, alt edge 34) |
| Southern California reservoir<br>2025-07-19 stained big_fish | lure honorable: exact_id | Topwater Popper (166); Magnum Worm (146) | Wake Bait (180); Magnum Worm (146) | Walking Bait (178, alt edge 32) |
| Lake of the Ozarks<br>2025-11-11 dirty big_fish | fly honorable: exact_id | Dungeon Streamer (168); Baitfish Slider (146) | Game Changer (176); Baitfish Slider (146) | Articulated Baitfish (176, alt edge 30) |
| Lake of the Ozarks<br>2025-02-20 dirty big_fish | lure honorable: exact_id | Texas-Rigged Craw (166); Suspending Jerkbait (128) | Football Jig (170); Suspending Jerkbait (128) | Blade Bait (156, alt edge 28) |
| Sam Rayburn Reservoir<br>2025-03-28 dirty big_fish | fly honorable: exact_id | Deceiver (150); Rabbit-Strip Leech (134) | Articulated Baitfish (154); Rabbit-Strip Leech (134) | Dungeon Streamer (162, alt edge 28) |
| Sam Rayburn Reservoir<br>2025-03-28 stained big_fish | fly honorable: exact_id | Deceiver (150); Rabbit-Strip Leech (134) | Game Changer (154); Rabbit-Strip Leech (134) | Dungeon Streamer (162, alt edge 28) |
| Appalachian river LMB context<br>2025-09-29 stained all_purpose | lure honorable: exact_id | Medium-Diving Crankbait (206); Topwater Popper (172) | Spinnerbait (204); Topwater Popper (172) | Bladed Jig (200, alt edge 28) |
| Guntersville / Tennessee River reservoir<br>2025-04-11 clear big_fish | fly honorable: same_family_different_presentation | Dungeon Streamer (156); Rabbit-Strip Leech (142) | Frog Popper (134); Articulated Baitfish (136) | Unweighted Baitfish (162, alt edge 26) |
| Southwest desert bass reservoir<br>2025-08-21 dirty big_fish | fly honorable: exact_id | Bluegill Streamer (154); Rabbit-Strip Leech (134) | Articulated Baitfish (160); Rabbit-Strip Leech (134) | Game Changer (160, alt edge 26) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Lake of the Ozarks<br>2025-02-20 dirty | A | 3/4 | Texas-Rigged Craw; Suspending Jerkbait; Lead-Eye Leech; Articulated Baitfish | Texas-Rigged Craw; Suspending Jerkbait; Articulated Baitfish; Rabbit-Strip Leech |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear A | lure | Texas-Rigged Craw; Suspending Jerkbait |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 stained A | lure | Deep-Diving Crankbait; Bladed Jig |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty A | lure | Texas-Rigged Craw; Medium-Diving Crankbait |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty B | lure | Deep-Diving Crankbait; Bladed Jig |
| Guntersville / Tennessee River reservoir<br>2025-04-11 clear B | lure | Suspending Jerkbait; Carolina-Rigged Stick Worm |
| Guntersville / Tennessee River reservoir<br>2025-04-11 stained B | fly | Deceiver; Jigged Marabou Leech |
| Guntersville / Tennessee River reservoir<br>2025-10-20 clear B | lure | Suspending Jerkbait; Tube Jig |
| Guntersville / Tennessee River reservoir<br>2025-10-20 stained B | lure | Deep-Diving Crankbait; Suspending Jerkbait |
| Guntersville / Tennessee River reservoir<br>2025-10-20 dirty B | lure | Deep-Diving Crankbait; Suspending Jerkbait |
| Lake of the Ozarks<br>2025-02-20 clear A | lure | Texas-Rigged Craw; Drop-Shot Minnow |
| Lake of the Ozarks<br>2025-02-20 clear B | lure | Carolina-Rigged Stick Worm; Suspending Jerkbait |
| Lake of the Ozarks<br>2025-02-20 stained A | lure | Texas-Rigged Craw; Suspending Jerkbait |
| Lake of the Ozarks<br>2025-02-20 stained B | lure | Tube Jig; Suspending Jerkbait |
| Lake of the Ozarks<br>2025-02-20 dirty A | lure | Texas-Rigged Craw; Suspending Jerkbait |
| Lake of the Ozarks<br>2025-11-11 stained A | fly | Deceiver; Baitfish Slider |
| Minnesota natural bass lake<br>2025-05-15 stained B | lure | Squarebill Crankbait; Bladed Jig |
| Lake Champlain<br>2025-04-27 clear B | lure | Deep-Diving Crankbait; Suspending Jerkbait |
| Lake Champlain<br>2025-04-27 stained B | lure | Deep-Diving Crankbait; Suspending Jerkbait |
| Lake Champlain<br>2025-04-27 dirty B | lure | Deep-Diving Crankbait; Suspending Jerkbait |
| WV/VA highland reservoir<br>2025-03-26 clear B | fly | Deceiver; Jigged Marabou Leech |
| WV/VA highland reservoir<br>2025-03-26 dirty B | fly | Deceiver; Jigged Marabou Leech |
| Appalachian river LMB context<br>2025-04-04 stained B | lure | Bladed Jig; Squarebill Crankbait |
| Appalachian river LMB context<br>2025-04-04 stained B | fly | Clouser Minnow; Marabou Jig Leech |
| Appalachian river LMB context<br>2025-04-04 dirty B | lure | Spinnerbait; Squarebill Crankbait |
| Appalachian river LMB context<br>2025-05-06 stained B | lure | Tube Jig; Flat-Sided Crankbait |
| Appalachian river LMB context<br>2025-05-06 dirty B | lure | Texas-Rigged Craw; Flat-Sided Crankbait |
| Appalachian river LMB context<br>2025-06-17 clear B | fly | Clouser Minnow; Marabou Jig Leech |
| Southwest desert bass reservoir<br>2025-03-25 clear B | lure | Texas-Rigged Craw; Drop-Shot Minnow |
| Southwest desert bass reservoir<br>2025-03-25 stained B | lure | Texas-Rigged Craw; Drop-Shot Minnow |
| Southwest desert bass reservoir<br>2025-03-25 dirty A | lure | Texas-Rigged Craw; Drop-Shot Minnow |
| Southwest desert bass reservoir<br>2025-08-21 stained B | lure | Shaky-Head Worm; Drop-Shot Minnow |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Suspending Jerkbait [lure] | 12 | Magnum Jerkbait (7), Football Jig (5) | 28 |
| Texas-Rigged Craw [lure] | 9 | Football Jig (4), Magnum Jerkbait (4), Compact Flipping Jig (1) | 5.6 |
| Deep-Diving Crankbait [lure] | 7 | Magnum Jerkbait (5), Compact Flipping Jig (2) | 22 |
| Drop-Shot Minnow [lure] | 6 | Magnum Jerkbait (3), Magnum Worm (2), Football Jig (1) | 16.7 |
| Bladed Jig [lure] | 4 | Compact Flipping Jig (3), Magnum Jerkbait (1) | 12 |
| Deceiver [fly] | 4 | Dungeon Streamer (3), Articulated Baitfish (1) | 11 |
| Jigged Marabou Leech [fly] | 3 | Dungeon Streamer (3) | 30 |
| Squarebill Crankbait [lure] | 3 | Magnum Jerkbait (2), Compact Flipping Jig (1) | 16.7 |
| Tube Jig [lure] | 3 | Magnum Jerkbait (2), Football Jig (1) | 24 |
| Carolina-Rigged Stick Worm [lure] | 2 | Football Jig (1), Magnum Jerkbait (1) | 20 |
| Clouser Minnow [fly] | 2 | Articulated Baitfish (1), Game Changer (1) | 4 |
| Flat-Sided Crankbait [lure] | 2 | Magnum Jerkbait (2) | 22 |
| Marabou Jig Leech [fly] | 2 | Articulated Baitfish (1), Game Changer (1) | 7 |
| Shaky-Head Worm [lure] | 2 | Magnum Worm (2) | 38 |
| Baitfish Slider [fly] | 1 | Articulated Baitfish (1) | 30 |

## Pike Big Fish Upside Split Diagnostics

Not applicable.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Sam Rayburn Reservoir<br>2025-03-28 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Baitfish Slider (136; goal:all_purpose:versatile_search:+12) | Deceiver (162, alt edge -2) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (166; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge -4) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (146; goal:big_fish:big_fish_upside:+20); Game Changer (154; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Baitfish Slider (136; goal:all_purpose:versatile_search:+12) | Deceiver (162, alt edge -2) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 stained big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (166; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Compact Flipping Jig (156; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge -4) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (146; goal:all_purpose:versatile_search:+12); Jigged Marabou Leech (132; goal:all_purpose:reliable_action:+18) | Deceiver (162, alt edge 16) | goal fit likely competed |
| Sam Rayburn Reservoir<br>2025-03-28 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (146; goal:all_purpose:versatile_search:+12); Baitfish Slider (136; goal:all_purpose:versatile_search:+12) | Deceiver (162, alt edge 16) | goal fit likely competed |
| Lake Fork<br>2025-03-29 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Jigged Marabou Leech (132; goal:all_purpose:reliable_action:+18) | Deceiver (162, alt edge -2) | goal fit likely competed |
| Lake Fork<br>2025-03-29 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (166; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge -4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Dungeon Streamer (154; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Game Changer (154; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (146; goal:all_purpose:versatile_search:+12); Baitfish Slider (136; goal:all_purpose:versatile_search:+12) | Deceiver (162, alt edge 16) | goal fit likely competed |
| Lake Fork<br>2025-03-29 stained big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (166; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Compact Flipping Jig (156; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge -4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Dungeon Streamer (162; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -12) | goal fit likely competed |
| Lake Fork<br>2025-03-29 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (156; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Baitfish Slider (136; goal:all_purpose:versatile_search:+12) | Deceiver (162, alt edge 6) | goal fit likely competed |
| Lake Fork<br>2025-03-29 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Lake Fork<br>2025-03-29 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Dungeon Streamer (162; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -12) | goal fit likely competed |
| Lake Fork<br>2025-04-30 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Unweighted Baitfish (158; goal:all_purpose:versatile_search:+12); Clouser Minnow (154; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Deceiver (152, alt edge -6) | goal fit likely competed |
| Guntersville / Tennessee River reservoir<br>2025-10-19 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Baitfish Slider (158; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge 16) | goal fit likely competed |
| Guntersville / Tennessee River reservoir<br>2025-10-19 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (186; condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Unweighted Baitfish (158; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge -2) | goal fit likely competed |
| Guntersville / Tennessee River reservoir<br>2025-10-19 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (188; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Football Jig (134; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (178, alt edge -10) | goal fit likely competed |
| Guntersville / Tennessee River reservoir<br>2025-10-19 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Dungeon Streamer (160; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Baitfish Slider (146; condition_tag:open_water_search:+16) | Deceiver (172, alt edge 12) | goal fit likely competed |
| Guntersville / Tennessee River reservoir<br>2025-10-19 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Unweighted Baitfish (146; condition_tag:open_water_search:+16) | Deceiver (172, alt edge -4) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| dirty_vibration_acceptable | 43 |
| clear_subtle_wind_watch | 33 |
| other_wind_watch | 9 |
| current_open_water_acceptable | 7 |
| surface_low_light_acceptable | 2 |
| true_dirty_stained_wind_miss | 1 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Sam Rayburn Reservoir<br>2025-03-28 all_purpose clear A | stable_pleasant_high_confidence<br>neutral | Medium-Diving Crankbait 174<br>Texas-Rigged Craw 152 |
| clear_subtle_wind_watch | Sam Rayburn Reservoir<br>2025-03-28 big_fish clear A | stable_pleasant_high_confidence<br>neutral | Magnum Jerkbait 166<br>Football Jig 140 |
| clear_subtle_wind_watch | Lake Fork<br>2025-03-29 all_purpose clear A | stable_pleasant_high_confidence<br>active | Suspending Jerkbait 180<br>Carolina-Rigged Stick Worm 138 |
| clear_subtle_wind_watch | Lake Fork<br>2025-03-29 all_purpose clear B | stable_pleasant_high_confidence<br>active | Medium-Diving Crankbait 174<br>Finesse Jig 138 |
| clear_subtle_wind_watch | Lake Fork<br>2025-03-29 big_fish clear A | stable_pleasant_high_confidence<br>active | Magnum Jerkbait 166<br>Football Jig 140 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-03-28 all_purpose stained A | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 222<br>Spinnerbait 198 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-03-28 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Magnum Jerkbait 166<br>Compact Flipping Jig 156 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-03-28 all_purpose dirty B | dirty_vibration<br>neutral | Lipless Crankbait 214<br>Bladed Jig 194 |
| dirty_vibration_acceptable | Sam Rayburn Reservoir<br>2025-03-28 big_fish dirty B | dirty_vibration<br>neutral | Bladed Jig 150<br>Football Jig 140 |
| dirty_vibration_acceptable | Lake Fork<br>2025-03-29 all_purpose stained A | breezy_windy_stained_reaction<br>active | Medium-Diving Crankbait 222<br>Spinnerbait 198 |
| other_wind_watch | Sam Rayburn Reservoir<br>2025-03-28 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 162<br>Football Jig 140 |
| other_wind_watch | Lake Fork<br>2025-03-29 big_fish stained B | breezy_windy_stained_reaction<br>active | Medium-Diving Crankbait 162<br>Football Jig 140 |
| other_wind_watch | Lake Fork<br>2025-03-29 big_fish dirty B | dirty_vibration<br>active | Medium-Diving Crankbait 162<br>Football Jig 140 |
| other_wind_watch | Jordan Lake / Piedmont reservoir<br>2025-03-22 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 162<br>Football Jig 140 |
| other_wind_watch | Jordan Lake / Piedmont reservoir<br>2025-03-22 big_fish dirty B | dirty_vibration<br>neutral | Medium-Diving Crankbait 162<br>Football Jig 140 |
| current_open_water_acceptable | Guntersville / Tennessee River reservoir<br>2025-10-19 all_purpose dirty A | dirty_vibration<br>neutral | Medium-Diving Crankbait 238<br>Lipless Crankbait 236 |
| current_open_water_acceptable | Guntersville / Tennessee River reservoir<br>2025-10-19 big_fish dirty B | dirty_vibration<br>neutral | Lipless Crankbait 172<br>Football Jig 134 |
| current_open_water_acceptable | Lake of the Ozarks<br>2025-11-11 all_purpose stained A | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 238<br>Lipless Crankbait 236 |
| current_open_water_acceptable | Lake of the Ozarks<br>2025-11-11 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 178<br>Football Jig 134 |
| current_open_water_acceptable | Lake of the Ozarks<br>2025-11-11 all_purpose dirty A | dirty_vibration<br>neutral | Medium-Diving Crankbait 238<br>Lipless Crankbait 236 |
| surface_low_light_acceptable | Minnesota natural bass lake<br>2025-07-16 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 232<br>Topwater Popper 152 |
| surface_low_light_acceptable | Minnesota natural bass lake<br>2025-07-16 all_purpose dirty B | dirty_vibration<br>neutral | Medium-Diving Crankbait 232<br>Topwater Popper 144 |
| true_dirty_stained_wind_miss | Southwest high-desert reservoir<br>2025-04-17 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Football Jig 140<br>Magnum Jerkbait 156 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 599 |
| acceptable_fit | 1623 |
| strong_fit | 1330 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | B | fly | cold_slow_or_front | 69 |
| watch | big_fish | A | fly | cold_slow_or_front | 65 |
| watch | big_fish | A | fly | stable_pleasant_high_confidence | 42 |
| watch | big_fish | A | lure | cold_slow_or_front | 39 |
| watch | big_fish | B | lure | cold_slow_or_front | 34 |
| watch | big_fish | B | fly | dirty_vibration | 33 |
| watch | all_purpose | A | fly | stable_pleasant_high_confidence | 31 |
| watch | big_fish | A | fly | dirty_vibration | 30 |
| watch | all_purpose | A | fly | cold_slow_or_front | 29 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 29 |
| watch | all_purpose | B | fly | cold_slow_or_front | 28 |
| watch | big_fish | B | fly | stable_pleasant_high_confidence | 26 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 25 |
| watch | big_fish | B | lure | stable_pleasant_high_confidence | 22 |
| watch | all_purpose | A | lure | cold_slow_or_front | 20 |
| watch | big_fish | B | lure | dirty_vibration | 20 |
| watch | all_purpose | B | lure | cold_slow_or_front | 19 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 18 |
| watch | big_fish | A | lure | stable_pleasant_high_confidence | 18 |
| watch | all_purpose | A | lure | stable_pleasant_high_confidence | 17 |
| watch | all_purpose | A | fly | dirty_vibration | 16 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 13 |
| watch | all_purpose | B | fly | dirty_vibration | 13 |
| watch | all_purpose | B | fly | stable_pleasant_high_confidence | 13 |
| watch | big_fish | A | fly | warming_search | 13 |
| watch | big_fish | A | fly | unclassified | 12 |
| watch | big_fish | A | lure | dirty_vibration | 12 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 11 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 11 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 10 |
| watch | big_fish | A | lure | unclassified | 10 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 10 |
| watch | all_purpose | A | lure | calm_low_light_surface | 9 |
| watch | all_purpose | B | lure | stable_pleasant_high_confidence | 9 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 9 |
| watch | big_fish | A | fly | calm_low_light_surface | 8 |
| watch | big_fish | B | fly | warming_search | 7 |
| watch | big_fish | B | lure | unclassified | 7 |
| watch | big_fish | A | lure | heat_limited_finesse | 6 |
| watch | big_fish | B | fly | calm_bright_clear_subtle | 6 |
| watch | big_fish | B | fly | calm_low_light_surface | 6 |
| watch | big_fish | B | fly | unclassified | 6 |
| watch | all_purpose | A | fly | unclassified | 5 |
| watch | big_fish | A | lure | calm_bright_clear_subtle | 5 |
| watch | big_fish | B | lure | calm_bright_clear_subtle | 5 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 4 |
| watch | all_purpose | A | fly | calm_low_light_surface | 4 |
| watch | all_purpose | A | lure | dirty_vibration | 4 |
| watch | big_fish | A | lure | warming_search | 4 |
| watch | all_purpose | B | fly | river_elevated_runoff_current | 3 |
| watch | all_purpose | B | lure | calm_low_light_surface | 3 |
| watch | big_fish | A | fly | heat_limited_finesse | 3 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 3 |
| watch | big_fish | B | lure | calm_low_light_surface | 3 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 3 |
| watch | all_purpose | A | fly | warming_search | 2 |
| watch | all_purpose | A | lure | heat_limited_finesse | 2 |
| watch | all_purpose | A | lure | river_elevated_runoff_current | 2 |
| watch | all_purpose | B | fly | calm_low_light_surface | 2 |
| watch | all_purpose | B | fly | warming_search | 2 |
| watch | all_purpose | B | lure | breezy_windy_stained_reaction | 2 |
| watch | all_purpose | B | lure | heat_limited_finesse | 2 |
| watch | big_fish | A | lure | calm_low_light_surface | 2 |
| watch | big_fish | B | fly | heat_limited_finesse | 2 |
| watch | big_fish | B | lure | warming_search | 2 |
| watch | all_purpose | A | fly | heat_limited_finesse | 1 |
| watch | all_purpose | B | fly | calm_bright_clear_subtle | 1 |
| watch | all_purpose | B | fly | unclassified | 1 |
| watch | all_purpose | B | lure | dirty_vibration | 1 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 1 |
| watch | big_fish | B | lure | heat_limited_finesse | 1 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 95 |
| acceptable_fit | all_purpose | B | fly | unclassified | 80 |
| acceptable_fit | big_fish | B | fly | unclassified | 80 |
| acceptable_fit | big_fish | B | lure | unclassified | 78 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 76 |
| acceptable_fit | all_purpose | A | fly | unclassified | 74 |
| acceptable_fit | all_purpose | A | lure | unclassified | 74 |
| acceptable_fit | all_purpose | B | lure | unclassified | 74 |
| acceptable_fit | big_fish | A | fly | unclassified | 74 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 24 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 22 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| Northern California bass lake<br>2025-10-25 dirty all_purpose A | Medium-Diving Crankbait (lure_of_the_day, lure, score 238) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 stained all_purpose A | Medium-Diving Crankbait (lure_of_the_day, lure, score 238) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 stained all_purpose A | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 dirty all_purpose B | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 dirty all_purpose A | Lipless Crankbait (lure_of_the_day, lure, score 236) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained all_purpose A | Lipless Crankbait (lure_of_the_day, lure, score 236) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 clear big_fish A | Magnum Jerkbait (lure_of_the_day, lure, score 204) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 dirty all_purpose A | Spinnerbait (honorable_lure, lure, score 204) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+dirty_vibration+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained all_purpose B | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 clear all_purpose B | Clouser Minnow (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 clear all_purpose B | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 dirty all_purpose A | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained all_purpose A | Deceiver (honorable_fly, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Minnesota natural bass lake<br>2025-07-16 stained big_fish B | Wake Bait (lure_of_the_day, lure, score 180) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 clear all_purpose A | Drop-Shot Minnow (honorable_lure, lure, score 180) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Northern California bass lake<br>2025-10-25 clear all_purpose B | Texas-Rigged Craw (honorable_lure, lure, score 178) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 clear all_purpose B | Texas-Rigged Craw (honorable_lure, lure, score 178) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 clear big_fish B | Walking Bait (lure_of_the_day, lure, score 178) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>calm_surface+low_light_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 dirty all_purpose A | Clouser Minnow (fly_of_the_day, fly, score 178) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>calm_surface+low_light_surface+dirty_vibration+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Appalachian river LMB context<br>2025-09-29 stained big_fish B | Walking Bait (lure_of_the_day, lure, score 178) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>calm_surface+low_light_surface+dirty_vibration+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 960 | 302 | 31% |
| clear_subtle | 640 | 319 | 50% |
| dirty_vibration | 736 | 154 | 21% |
| heat_finesse | 96 | 29 | 30% |
| cold_slow | 720 | 383 | 53% |
| low_light_surface | 720 | 258 | 36% |
| calm_surface | 1056 | 421 | 40% |
| Big Fish upside | 1776 | 1475 | 83% |
| All Purpose reliable/versatile | 1776 | 1735 | 98% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Game Changer [fly] (178), Rabbit-Strip Leech [fly] (176), Clouser Minnow [fly] (164), Articulated Baitfish [fly] (159), Compact Flipping Jig [lure] (150), Baitfish Slider [fly] (142), Deer Hair Slider [fly] (114), Magnum Jerkbait [lure] (106), Unweighted Baitfish [fly] (103), Dungeon Streamer [fly] (100), Jigged Marabou Leech [fly] (93), Soft Jerkbait [lure] (93) |
| All-purpose | Clouser Minnow [fly] (162), Baitfish Slider [fly] (128), Soft Jerkbait [lure] (90), Unweighted Baitfish [fly] (82), Spinnerbait [lure] (79), Bass Popper [fly] (74), Jigged Marabou Leech [fly] (74), Deceiver [fly] (67) |
| Big-fish | Rabbit-Strip Leech [fly] (159), Compact Flipping Jig [lure] (142), Game Changer [fly] (125), Articulated Baitfish [fly] (122), Deer Hair Slider [fly] (109), Magnum Jerkbait [lure] (106), Dungeon Streamer [fly] (100), Football Jig [lure] (74) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 30 | 30 | 0 | 1 | 2 |
| fly | 19 | 19 | 0 | 0 | 0 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 178/888 | 20% | big_fish:125, all_purpose:53 | A:96, B:82 | top:135, honorable:43 | clear:72, dirty:59, stained:47 | freshwater_lake_pond:168, freshwater_river:10 | calm_surface:49, none:47, wind_reaction:41, clear_subtle:35 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 176/888 | 19.8% | big_fish:159, all_purpose:17 | A:108, B:68 | honorable:145, top:31 | stained:76, dirty:75, clear:25 | freshwater_lake_pond:167, freshwater_river:9 | wind_reaction:64, cold_slow:62, dirty_vibration:61, none:54 |
| Clouser Minnow<br>clouser_minnow | fly | 164/888 | 18.5% | all_purpose:162, big_fish:2 | B:106, A:58 | top:104, honorable:60 | stained:63, clear:59, dirty:42 | freshwater_lake_pond:151, freshwater_river:13 | calm_surface:45, none:37, wind_reaction:36, low_light_surface:35 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 159/888 | 17.9% | big_fish:122, all_purpose:37 | A:87, B:72 | top:115, honorable:44 | dirty:74, stained:55, clear:30 | freshwater_lake_pond:147, freshwater_river:12 | none:48, calm_surface:35, wind_reaction:32, dirty_vibration:31 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 150/888 | 16.9% | big_fish:142, all_purpose:8 | B:85, A:65 | honorable:113, top:37 | dirty:67, stained:56, clear:27 | freshwater_lake_pond:139, freshwater_river:11 | wind_reaction:58, dirty_vibration:53, none:37, low_light_surface:25 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 142/840 | 16.9% | all_purpose:128, big_fish:14 | A:85, B:57 | honorable:109, top:33 | dirty:58, stained:55, clear:29 | freshwater_lake_pond:138, freshwater_river:4 | wind_reaction:38, none:36, calm_surface:31, dirty_vibration:31 |
| Deer Hair Slider<br>deer_hair_slider | fly | 114/540 | 21.1% | big_fish:109, all_purpose:5 | A:63, B:51 | honorable:76, top:38 | dirty:41, clear:38, stained:35 | freshwater_lake_pond:108, freshwater_river:6 | calm_surface:67, low_light_surface:48, clear_subtle:23, none:17 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 106/552 | 19.2% | big_fish:106 | A:83, B:23 | top:70, honorable:36 | clear:40, stained:40, dirty:26 | freshwater_lake_pond:100, freshwater_river:6 | cold_slow:39, wind_reaction:37, dirty_vibration:23, none:23 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 103/840 | 12.3% | all_purpose:82, big_fish:21 | B:67, A:36 | honorable:67, top:36 | clear:66, stained:22, dirty:15 | freshwater_lake_pond:102, freshwater_river:1 | clear_subtle:52, calm_surface:34, wind_reaction:25, low_light_surface:18 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 100/504 | 19.8% | big_fish:100 | B:55, A:45 | top:75, honorable:25 | stained:36, clear:33, dirty:31 | freshwater_lake_pond:100 | wind_reaction:41, cold_slow:31, dirty_vibration:26, calm_surface:19 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 93/888 | 10.5% | all_purpose:74, big_fish:19 | B:69, A:24 | honorable:82, top:11 | stained:38, dirty:29, clear:26 | freshwater_lake_pond:87, freshwater_river:6 | cold_slow:49, wind_reaction:46, dirty_vibration:34, none:17 |
| Soft Jerkbait<br>soft_jerkbait | lure | 93/840 | 11.1% | all_purpose:90, big_fish:3 | A:47, B:46 | top:55, honorable:38 | clear:54, stained:25, dirty:14 | freshwater_lake_pond:92, freshwater_river:1 | clear_subtle:40, calm_surface:37, none:26, low_light_surface:15 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 92/888 | 10.4% | all_purpose:59, big_fish:33 | B:49, A:43 | top:51, honorable:41 | clear:58, stained:19, dirty:15 | freshwater_lake_pond:87, freshwater_river:5 | cold_slow:39, clear_subtle:36, wind_reaction:28, calm_surface:24 |
| Deceiver<br>deceiver | fly | 90/888 | 10.1% | all_purpose:67, big_fish:23 | B:46, A:44 | top:63, honorable:27 | dirty:37, stained:29, clear:24 | freshwater_lake_pond:90 | wind_reaction:63, dirty_vibration:45, low_light_surface:23, cold_slow:19 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 89/888 | 10% | all_purpose:58, big_fish:31 | A:51, B:38 | top:70, honorable:19 | dirty:39, stained:34, clear:16 | freshwater_lake_pond:85, freshwater_river:4 | wind_reaction:67, dirty_vibration:57, open_water_search:26, cold_slow:18 |
| Spinnerbait<br>spinnerbait | lure | 83/888 | 9.3% | all_purpose:79, big_fish:4 | A:44, B:39 | top:50, honorable:33 | dirty:40, stained:33, clear:10 | freshwater_lake_pond:75, freshwater_river:8 | dirty_vibration:45, wind_reaction:41, low_light_surface:23, none:17 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 78/396 | 19.7% | all_purpose:61, big_fish:17 | A:58, B:20 | top:40, honorable:38 | clear:34, dirty:24, stained:20 | freshwater_lake_pond:70, freshwater_river:8 | cold_slow:32, wind_reaction:22, none:16, clear_subtle:14 |
| Topwater Popper<br>popping_topwater | lure | 77/540 | 14.3% | all_purpose:62, big_fish:15 | A:47, B:30 | honorable:56, top:21 | stained:33, clear:23, dirty:21 | freshwater_lake_pond:74, freshwater_river:3 | calm_surface:70, clear_subtle:21, low_light_surface:20, cold_slow:8 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 77/192 | 40.1% | big_fish:61, all_purpose:16 | A:60, B:17 | top:50, honorable:27 | dirty:28, clear:25, stained:24 | freshwater_lake_pond:77 | low_light_surface:46, calm_surface:45, wind_reaction:20, clear_subtle:15 |
| Bladed Jig<br>bladed_jig | lure | 76/888 | 8.6% | all_purpose:61, big_fish:15 | A:41, B:35 | honorable:42, top:34 | dirty:41, stained:25, clear:10 | freshwater_lake_pond:66, freshwater_river:10 | calm_surface:21, none:21, dirty_vibration:19, low_light_surface:15 |
| Bass Popper<br>popper_fly | fly | 75/468 | 16% | all_purpose:74, big_fish:1 | A:44, B:31 | top:48, honorable:27 | stained:27, clear:24, dirty:24 | freshwater_lake_pond:73, freshwater_river:2 | calm_surface:59, low_light_surface:30, clear_subtle:19, cold_slow:10 |
| Wake Bait<br>wake_bait | lure | 75/384 | 19.5% | big_fish:64, all_purpose:11 | B:43, A:32 | top:44, honorable:31 | clear:27, dirty:26, stained:22 | freshwater_lake_pond:75 | calm_surface:52, clear_subtle:20, low_light_surface:16, none:13 |
| Football Jig<br>football_jig | lure | 74/360 | 20.6% | big_fish:74 | B:40, A:34 | honorable:52, top:22 | clear:28, dirty:25, stained:21 | freshwater_lake_pond:74 | wind_reaction:36, dirty_vibration:22, cold_slow:18, none:18 |
| Glide Bait<br>glidebait | lure | 72/276 | 26.1% | big_fish:72 | A:43, B:29 | top:56, honorable:16 | clear:37, stained:29, dirty:6 | freshwater_lake_pond:72 | calm_surface:40, clear_subtle:27, low_light_surface:18, cold_slow:13 |
| Bluegill Streamer<br>bluegill_streamer | fly | 69/408 | 16.9% | big_fish:69 | A:40, B:29 | top:53, honorable:16 | clear:27, stained:25, dirty:17 | freshwater_lake_pond:69 | calm_surface:35, clear_subtle:18, none:16, low_light_surface:13 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 66/888 | 7.4% | all_purpose:50, big_fish:16 | A:42, B:24 | honorable:47, top:19 | clear:54, dirty:9, stained:3 | freshwater_lake_pond:64, freshwater_river:2 | clear_subtle:47, cold_slow:21, calm_surface:16, wind_reaction:15 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 66/888 | 7.4% | all_purpose:59, big_fish:7 | B:46, A:20 | top:45, honorable:21 | dirty:28, stained:22, clear:16 | freshwater_lake_pond:65, freshwater_river:1 | none:25, calm_surface:21, low_light_surface:11, warming_search:9 |
| Magnum Worm<br>magnum_worm | lure | 61/336 | 18.2% | big_fish:61 | A:49, B:12 | honorable:45, top:16 | dirty:26, stained:24, clear:11 | freshwater_lake_pond:61 | calm_surface:27, none:24, low_light_surface:10, clear_subtle:7 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 57/840 | 6.8% | all_purpose:53, big_fish:4 | A:29, B:28 | honorable:47, top:10 | clear:34, stained:16, dirty:7 | freshwater_lake_pond:57 | cold_slow:27, clear_subtle:26, calm_surface:18, wind_reaction:18 |
| Lipless Crankbait<br>lipless_crankbait | lure | 56/888 | 6.3% | all_purpose:51, big_fish:5 | B:36, A:20 | top:45, honorable:11 | dirty:29, stained:25, clear:2 | freshwater_lake_pond:53, freshwater_river:3 | dirty_vibration:47, wind_reaction:46, open_water_search:16, cold_slow:14 |
| Walking Bait<br>walking_topwater | lure | 56/540 | 10.4% | big_fish:56 | B:41, A:15 | top:34, honorable:22 | clear:22, stained:21, dirty:13 | freshwater_lake_pond:51, freshwater_river:5 | calm_surface:34, clear_subtle:16, low_light_surface:15, none:7 |
| Buzzbait<br>buzzbait | lure | 53/540 | 9.8% | big_fish:52, all_purpose:1 | A:28, B:25 | top:36, honorable:17 | dirty:30, stained:15, clear:8 | freshwater_lake_pond:47, freshwater_river:6 | low_light_surface:36, wind_reaction:21, dirty_vibration:20, calm_surface:13 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49/288 | 17% | all_purpose:47, big_fish:2 | B:31, A:18 | top:34, honorable:15 | dirty:20, stained:15, clear:14 | freshwater_lake_pond:45, freshwater_river:4 | calm_surface:38, low_light_surface:13, clear_subtle:12, cold_slow:6 |
| Mouse Pattern<br>mouse_fly | fly | 47/324 | 14.5% | big_fish:47 | B:32, A:15 | honorable:24, top:23 | stained:19, clear:16, dirty:12 | freshwater_lake_pond:47 | calm_surface:35, low_light_surface:14, clear_subtle:11, wind_reaction:6 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 46/888 | 5.2% | all_purpose:24, big_fish:22 | B:29, A:17 | honorable:39, top:7 | clear:31, stained:12, dirty:3 | freshwater_lake_pond:43, freshwater_river:3 | clear_subtle:29, calm_surface:13, heat_finesse:12, none:8 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 46/840 | 5.5% | all_purpose:33, big_fish:13 | B:35, A:11 | honorable:39, top:7 | dirty:24, stained:12, clear:10 | freshwater_lake_pond:42, freshwater_river:4 | wind_reaction:23, low_light_surface:19, dirty_vibration:17, none:13 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 45/288 | 15.6% | all_purpose:45 | A:30, B:15 | top:27, honorable:18 | clear:19, stained:15, dirty:11 | freshwater_lake_pond:43, freshwater_river:2 | calm_surface:21, clear_subtle:16, cold_slow:9, low_light_surface:9 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 45/204 | 22.1% | all_purpose:34, big_fish:11 | B:23, A:22 | honorable:25, top:20 | clear:16, dirty:15, stained:14 | freshwater_lake_pond:37, freshwater_river:8 | cold_slow:21, wind_reaction:12, none:10, dirty_vibration:9 |
| Woolly Bugger<br>woolly_bugger | fly | 44/888 | 5% | all_purpose:44 | A:30, B:14 | top:24, honorable:20 | clear:19, stained:13, dirty:12 | freshwater_lake_pond:34, freshwater_river:10 | cold_slow:29, wind_reaction:14, dirty_vibration:12, calm_surface:8 |
| Frog Popper<br>frog_fly | fly | 41/192 | 21.4% | big_fish:41 | B:21, A:20 | top:21, honorable:20 | dirty:15, clear:14, stained:12 | freshwater_lake_pond:41 | calm_surface:21, low_light_surface:20, clear_subtle:9, wind_reaction:9 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 40/840 | 4.8% | all_purpose:28, big_fish:12 | B:37, A:3 | honorable:31, top:9 | clear:17, stained:17, dirty:6 | freshwater_lake_pond:35, freshwater_river:5 | cold_slow:18, none:11, calm_surface:10, clear_subtle:6 |
| Swim Jig<br>swim_jig | lure | 36/888 | 4.1% | all_purpose:36 | B:27, A:9 | top:27, honorable:9 | dirty:19, stained:11, clear:6 | freshwater_lake_pond:35, freshwater_river:1 | none:14, calm_surface:12, low_light_surface:11, heat_finesse:2 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 23/840 | 2.7% | all_purpose:13, big_fish:10 | B:19, A:4 | honorable:15, top:8 | dirty:11, clear:6, stained:6 | freshwater_lake_pond:23 | none:11, cold_slow:9, dirty_vibration:2, wind_reaction:2 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 21/888 | 2.4% | all_purpose:14, big_fish:7 | A:11, B:10 | honorable:16, top:5 | stained:8, dirty:7, clear:6 | freshwater_lake_pond:12, freshwater_river:9 | warming_search:14, current_swing:9, dirty_vibration:6, none:4 |
| Blade Bait<br>blade_bait | lure | 19/888 | 2.1% | all_purpose:17, big_fish:2 | B:17, A:2 | honorable:16, top:3 | stained:8, dirty:7, clear:4 | freshwater_lake_pond:13, freshwater_river:6 | cold_slow:7, dirty_vibration:7, low_light_surface:7, none:7 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 13/672 | 1.9% | all_purpose:11, big_fish:2 | B:10, A:3 | honorable:8, top:5 | clear:8, stained:3, dirty:2 | freshwater_lake_pond:13 | clear_subtle:7, heat_finesse:5, cold_slow:4, wind_reaction:2 |
| Tube Jig<br>tube_jig | lure | 7/888 | 0.8% | big_fish:5, all_purpose:2 | B:7 | top:4, honorable:3 | clear:3, stained:3, dirty:1 | freshwater_lake_pond:4, freshwater_river:3 | cold_slow:5, none:2, clear_subtle:1 |
| Finesse Jig<br>finesse_jig | lure | 5/396 | 1.3% | all_purpose:5 | B:5 | top:4, honorable:1 | clear:4, stained:1 | freshwater_lake_pond:5 | cold_slow:2, heat_finesse:2, wind_reaction:2, clear_subtle:1 |
| Ned Rig<br>ned_rig | lure | 5/396 | 1.3% | all_purpose:5 | B:5 | honorable:4, top:1 | dirty:3, clear:2 | freshwater_lake_pond:4, freshwater_river:1 | none:2, clear_subtle:1, cold_slow:1, current_swing:1 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 178/3552 (5%) | 135/1776 (7.6%) | 43/1776 (2.4%) | - | 178/1776 (10%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 176/3552 (5%) | 31/1776 (1.7%) | 145/1776 (8.2%) | - | 176/1776 (9.9%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 164/3552 (4.6%) | 104/1776 (5.9%) | 60/1776 (3.4%) | - | 164/1776 (9.2%) |  |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 159/3552 (4.5%) | 115/1776 (6.5%) | 44/1776 (2.5%) | - | 159/1776 (9%) |  |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 150/3552 (4.2%) | 37/1776 (2.1%) | 113/1776 (6.4%) | 150/1776 (8.4%) | - |  |
| Baitfish Slider<br>baitfish_slider_fly | fly | 142/3552 (4%) | 33/1776 (1.9%) | 109/1776 (6.1%) | - | 142/1776 (8%) |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 114/3552 (3.2%) | 38/1776 (2.1%) | 76/1776 (4.3%) | - | 114/1776 (6.4%) |  |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 106/3552 (3%) | 70/1776 (3.9%) | 36/1776 (2%) | 106/1776 (6%) | - |  |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 103/3552 (2.9%) | 36/1776 (2%) | 67/1776 (3.8%) | - | 103/1776 (5.8%) |  |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 100/3552 (2.8%) | 75/1776 (4.2%) | 25/1776 (1.4%) | - | 100/1776 (5.6%) |  |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 93/3552 (2.6%) | 11/1776 (0.6%) | 82/1776 (4.6%) | - | 93/1776 (5.2%) |  |
| Soft Jerkbait<br>soft_jerkbait | lure | 93/3552 (2.6%) | 55/1776 (3.1%) | 38/1776 (2.1%) | 93/1776 (5.2%) | - |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 92/3552 (2.6%) | 51/1776 (2.9%) | 41/1776 (2.3%) | 92/1776 (5.2%) | - |  |
| Deceiver<br>deceiver | fly | 90/3552 (2.5%) | 63/1776 (3.5%) | 27/1776 (1.5%) | - | 90/1776 (5.1%) |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 89/3552 (2.5%) | 70/1776 (3.9%) | 19/1776 (1.1%) | 89/1776 (5%) | - |  |
| Spinnerbait<br>spinnerbait | lure | 83/3552 (2.3%) | 50/1776 (2.8%) | 33/1776 (1.9%) | 83/1776 (4.7%) | - |  |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 78/3552 (2.2%) | 40/1776 (2.3%) | 38/1776 (2.1%) | 78/1776 (4.4%) | - |  |
| Hollow-Body Frog<br>hollow_body_frog | lure | 77/3552 (2.2%) | 50/1776 (2.8%) | 27/1776 (1.5%) | 77/1776 (4.3%) | - |  |
| Topwater Popper<br>popping_topwater | lure | 77/3552 (2.2%) | 21/1776 (1.2%) | 56/1776 (3.2%) | 77/1776 (4.3%) | - |  |
| Bladed Jig<br>bladed_jig | lure | 76/3552 (2.1%) | 34/1776 (1.9%) | 42/1776 (2.4%) | 76/1776 (4.3%) | - |  |
| Bass Popper<br>popper_fly | fly | 75/3552 (2.1%) | 48/1776 (2.7%) | 27/1776 (1.5%) | - | 75/1776 (4.2%) |  |
| Wake Bait<br>wake_bait | lure | 75/3552 (2.1%) | 44/1776 (2.5%) | 31/1776 (1.7%) | 75/1776 (4.2%) | - |  |
| Football Jig<br>football_jig | lure | 74/3552 (2.1%) | 22/1776 (1.2%) | 52/1776 (2.9%) | 74/1776 (4.2%) | - |  |
| Glide Bait<br>glidebait | lure | 72/3552 (2%) | 56/1776 (3.2%) | 16/1776 (0.9%) | 72/1776 (4.1%) | - |  |
| Bluegill Streamer<br>bluegill_streamer | fly | 69/3552 (1.9%) | 53/1776 (3%) | 16/1776 (0.9%) | - | 69/1776 (3.9%) |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 66/3552 (1.9%) | 19/1776 (1.1%) | 47/1776 (2.6%) | - | 66/1776 (3.7%) |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 66/3552 (1.9%) | 45/1776 (2.5%) | 21/1776 (1.2%) | 66/1776 (3.7%) | - |  |
| Magnum Worm<br>magnum_worm | lure | 61/3552 (1.7%) | 16/1776 (0.9%) | 45/1776 (2.5%) | 61/1776 (3.4%) | - |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 57/3552 (1.6%) | 10/1776 (0.6%) | 47/1776 (2.6%) | 57/1776 (3.2%) | - |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 56/3552 (1.6%) | 45/1776 (2.5%) | 11/1776 (0.6%) | 56/1776 (3.2%) | - |  |
| Walking Bait<br>walking_topwater | lure | 56/3552 (1.6%) | 34/1776 (1.9%) | 22/1776 (1.2%) | 56/1776 (3.2%) | - |  |
| Buzzbait<br>buzzbait | lure | 53/3552 (1.5%) | 36/1776 (2%) | 17/1776 (1%) | 53/1776 (3%) | - |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49/3552 (1.4%) | 34/1776 (1.9%) | 15/1776 (0.8%) | - | 49/1776 (2.8%) |  |
| Mouse Pattern<br>mouse_fly | fly | 47/3552 (1.3%) | 23/1776 (1.3%) | 24/1776 (1.4%) | - | 47/1776 (2.6%) |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 46/3552 (1.3%) | 7/1776 (0.4%) | 39/1776 (2.2%) | 46/1776 (2.6%) | - |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 46/3552 (1.3%) | 7/1776 (0.4%) | 39/1776 (2.2%) | 46/1776 (2.6%) | - |  |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 45/3552 (1.3%) | 20/1776 (1.1%) | 25/1776 (1.4%) | - | 45/1776 (2.5%) |  |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 45/3552 (1.3%) | 27/1776 (1.5%) | 18/1776 (1%) | 45/1776 (2.5%) | - |  |
| Woolly Bugger<br>woolly_bugger | fly | 44/3552 (1.2%) | 24/1776 (1.4%) | 20/1776 (1.1%) | - | 44/1776 (2.5%) |  |
| Frog Popper<br>frog_fly | fly | 41/3552 (1.2%) | 21/1776 (1.2%) | 20/1776 (1.1%) | - | 41/1776 (2.3%) |  |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 40/3552 (1.1%) | 9/1776 (0.5%) | 31/1776 (1.7%) | 40/1776 (2.3%) | - |  |
| Swim Jig<br>swim_jig | lure | 36/3552 (1%) | 27/1776 (1.5%) | 9/1776 (0.5%) | 36/1776 (2%) | - |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 23/3552 (0.6%) | 8/1776 (0.5%) | 15/1776 (0.8%) | 23/1776 (1.3%) | - |  |
| Marabou Jig Leech<br>feather_jig_leech | fly | 21/3552 (0.6%) | 5/1776 (0.3%) | 16/1776 (0.9%) | - | 21/1776 (1.2%) |  |
| Blade Bait<br>blade_bait | lure | 19/3552 (0.5%) | 3/1776 (0.2%) | 16/1776 (0.9%) | 19/1776 (1.1%) | - |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 13/3552 (0.4%) | 5/1776 (0.3%) | 8/1776 (0.5%) | 13/1776 (0.7%) | - |  |
| Tube Jig<br>tube_jig | lure | 7/3552 (0.2%) | 4/1776 (0.2%) | 3/1776 (0.2%) | 7/1776 (0.4%) | - |  |
| Finesse Jig<br>finesse_jig | lure | 5/3552 (0.1%) | 4/1776 (0.2%) | 1/1776 (0.1%) | 5/1776 (0.3%) | - |  |
| Ned Rig<br>ned_rig | lure | 5/3552 (0.1%) | 1/1776 (0.1%) | 4/1776 (0.2%) | 5/1776 (0.3%) | - |  |

## Per-Profile Usage Audit

| Profile | Gear | Selected | All-slot share | Side-slot share | All-purpose side share | Big-fish side share | Top/HM | Available rows | Finalist/repair opp | Selected/opportunity | Goal | Surface gate | Activity | Wind | Bucket | Clarity | Month/season | Condition tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 178 | 178/3552 (5%) | 178/1776 (10%) | 53/888 (6%) | 125/888 (14.1%) | 135/43 | 888/888 (100%) | 875 | 20.3% | big_fish:125, all_purpose:53 | closed:71, open:56, caution:51 | neutral:154, active:15, suppressed:9 | calm:74, slight:61, breezy:39, windy:4 | unclassified:43, cold_slow_or_front:41, stable_pleasant_high_confidence:35, calm_low_light_surface:16, dirty_vibration:14 | clear:72, dirty:59, stained:47 | Aug:26, Apr:23, Jun:23, Sep:23<br>summer:60, spring:56, fall:53, winter:9 | calm_surface:49, none:47, wind_reaction:41, clear_subtle:35, low_light_surface:33, dirty_vibration:27 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 176 | 176/3552 (5%) | 176/1776 (9.9%) | 17/888 (1.9%) | 159/888 (17.9%) | 31/145 | 888/888 (100%) | 335 | 52.5% | big_fish:159, all_purpose:17 | closed:108, caution:41, open:27 | neutral:143, active:18, suppressed:15 | breezy:62, slight:54, calm:51, windy:9 | cold_slow_or_front:55, unclassified:34, dirty_vibration:29, breezy_windy_stained_reaction:28, heat_limited_finesse:8 | stained:76, dirty:75, clear:25 | Mar:44, Apr:28, May:23, Jun:18<br>spring:95, summer:33, fall:29, winter:19 | wind_reaction:64, cold_slow:62, dirty_vibration:61, none:54, calm_surface:22, low_light_surface:12 |
| Clouser Minnow<br>clouser_minnow | fly | 164 | 164/3552 (4.6%) | 164/1776 (9.2%) | 162/888 (18.2%) | 2/888 (0.2%) | 104/60 | 888/888 (100%) | 586 | 28% | all_purpose:162, big_fish:2 | closed:64, open:55, caution:45 | neutral:144, active:11, suppressed:9 | calm:69, slight:55, breezy:38, windy:2 | unclassified:38, stable_pleasant_high_confidence:32, cold_slow_or_front:30, calm_low_light_surface:14, breezy_windy_stained_reaction:13 | stained:63, clear:59, dirty:42 | Jun:26, Apr:24, Oct:22, Aug:21<br>summer:57, spring:50, fall:46, winter:11 | calm_surface:45, none:37, wind_reaction:36, low_light_surface:35, clear_subtle:29, dirty_vibration:29 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 159 | 159/3552 (4.5%) | 159/1776 (9%) | 37/888 (4.2%) | 122/888 (13.7%) | 115/44 | 888/888 (100%) | 740 | 21.5% | big_fish:122, all_purpose:37 | closed:74, caution:43, open:42 | neutral:138, active:11, suppressed:10 | calm:61, slight:61, breezy:33, windy:4 | unclassified:38, cold_slow_or_front:35, stable_pleasant_high_confidence:23, dirty_vibration:18, calm_low_light_surface:14 | dirty:74, stained:55, clear:30 | Aug:21, Jun:20, Apr:19, Oct:19<br>summer:52, fall:46, spring:45, winter:16 | none:48, calm_surface:35, wind_reaction:32, dirty_vibration:31, low_light_surface:31, cold_slow:25 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 142 | 142/3552 (4%) | 142/1776 (8%) | 128/888 (14.4%) | 14/888 (1.6%) | 33/109 | 840/888 (94.6%) | 451 | 31.5% | all_purpose:128, big_fish:14 | closed:57, caution:48, open:37 | neutral:122, active:15, suppressed:5 | calm:51, slight:51, breezy:37, windy:3 | cold_slow_or_front:32, unclassified:31, stable_pleasant_high_confidence:20, dirty_vibration:17, warming_search:15 | dirty:58, stained:55, clear:29 | Jun:24, Oct:24, Apr:21, Mar:16<br>spring:48, summer:45, fall:44, winter:5 | wind_reaction:38, none:36, calm_surface:31, dirty_vibration:31, low_light_surface:24, warming_search:16 |
| Deer Hair Slider<br>deer_hair_slider | fly | 114 | 114/3552 (3.2%) | 114/1776 (6.4%) | 5/888 (0.6%) | 109/888 (12.3%) | 38/76 | 540/888 (60.8%) | 267 | 42.7% | big_fish:109, all_purpose:5 | open:83, caution:31 | neutral:105, active:9 | calm:67, slight:31, breezy:16 | stable_pleasant_high_confidence:33, unclassified:21, calm_low_light_surface:19, cold_slow_or_front:19, calm_bright_clear_subtle:8 | dirty:41, clear:38, stained:35 | Sep:22, Jun:20, Aug:17, Jul:14<br>summer:51, fall:36, spring:27 | calm_surface:67, low_light_surface:48, clear_subtle:23, none:17, wind_reaction:16, dirty_vibration:15 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 103 | 103/3552 (2.9%) | 103/1776 (5.8%) | 82/888 (9.2%) | 21/888 (2.4%) | 36/67 | 840/888 (94.6%) | 488 | 21.1% | all_purpose:82, big_fish:21 | open:39, caution:32, closed:32 | neutral:86, active:10, suppressed:7 | calm:49, slight:26, breezy:23, windy:5 | unclassified:24, cold_slow_or_front:20, stable_pleasant_high_confidence:17, calm_bright_clear_subtle:15, calm_low_light_surface:10 | clear:66, stained:22, dirty:15 | Apr:20, Jun:20, Oct:14, Aug:12<br>summer:37, spring:36, fall:27, winter:3 | clear_subtle:52, calm_surface:34, wind_reaction:25, low_light_surface:18, none:17, dirty_vibration:12 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 100 | 100/3552 (2.8%) | 100/1776 (5.6%) | 0/888 (0%) | 100/888 (11.3%) | 75/25 | 504/888 (56.8%) | 300 | 33.3% | big_fish:100 | closed:57, open:26, caution:17 | neutral:76, active:17, suppressed:7 | breezy:41, calm:32, slight:22, windy:5 | cold_slow_or_front:30, stable_pleasant_high_confidence:15, unclassified:15, breezy_windy_stained_reaction:14, dirty_vibration:12 | stained:36, clear:33, dirty:31 | Apr:28, Mar:21, Oct:17, May:15<br>spring:64, fall:23, winter:13 | wind_reaction:41, cold_slow:31, dirty_vibration:26, calm_surface:19, none:17, low_light_surface:15 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 93 | 93/3552 (2.6%) | 93/1776 (5.2%) | 74/888 (8.3%) | 19/888 (2.1%) | 11/82 | 888/888 (100%) | 215 | 43.3% | all_purpose:74, big_fish:19 | closed:61, caution:23, open:9 | neutral:82, suppressed:7, active:4 | breezy:51, slight:25, calm:16, windy:1 | cold_slow_or_front:36, breezy_windy_stained_reaction:16, dirty_vibration:15, unclassified:13, heat_limited_finesse:4 | stained:38, dirty:29, clear:26 | Mar:35, Feb:11, May:10, Aug:7<br>spring:51, winter:17, fall:14, summer:11 | cold_slow:49, wind_reaction:46, dirty_vibration:34, none:17, low_light_surface:13, open_water_search:6 |
| Deceiver<br>deceiver | fly | 90 | 90/3552 (2.5%) | 90/1776 (5.1%) | 67/888 (7.5%) | 23/888 (2.6%) | 63/27 | 888/888 (100%) | 634 | 14.2% | all_purpose:67, big_fish:23 | closed:48, open:27, caution:15 | neutral:76, active:13, suppressed:1 | breezy:58, slight:17, calm:10, windy:5 | dirty_vibration:24, breezy_windy_stained_reaction:21, cold_slow_or_front:18, stable_pleasant_high_confidence:12, unclassified:10 | dirty:37, stained:29, clear:24 | Mar:27, Apr:17, Oct:11, Jul:8<br>spring:49, fall:19, summer:19, winter:3 | wind_reaction:63, dirty_vibration:45, low_light_surface:23, cold_slow:19, open_water_search:18, none:12 |
| Bass Popper<br>popper_fly | fly | 75 | 75/3552 (2.1%) | 75/1776 (4.2%) | 74/888 (8.3%) | 1/888 (0.1%) | 48/27 | 468/888 (52.7%) | 227 | 33% | all_purpose:74, big_fish:1 | open:69, caution:6 | neutral:70, active:5 | calm:59, breezy:10, slight:6 | stable_pleasant_high_confidence:28, calm_low_light_surface:14, cold_slow_or_front:11, calm_bright_clear_subtle:9, breezy_windy_stained_reaction:4 | stained:27, clear:24, dirty:24 | Jun:15, Sep:15, Jul:13, Apr:12<br>summer:33, spring:27, fall:15 | calm_surface:59, low_light_surface:30, clear_subtle:19, cold_slow:10, wind_reaction:10, dirty_vibration:8 |
| Bluegill Streamer<br>bluegill_streamer | fly | 69 | 69/3552 (1.9%) | 69/1776 (3.9%) | 0/888 (0%) | 69/888 (7.8%) | 53/16 | 408/888 (45.9%) | 228 | 30.3% | big_fish:69 | open:37, caution:29, closed:3 | neutral:65, active:3, suppressed:1 | calm:38, slight:25, breezy:4, windy:2 | unclassified:24, stable_pleasant_high_confidence:18, cold_slow_or_front:11, calm_low_light_surface:7, calm_bright_clear_subtle:5 | clear:27, stained:25, dirty:17 | Jun:20, Aug:19, Sep:11, Jul:10<br>summer:49, fall:11, spring:9 | calm_surface:35, clear_subtle:18, none:16, low_light_surface:13, wind_reaction:6, cold_slow:5 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 66 | 66/3552 (1.9%) | 66/1776 (3.7%) | 50/888 (5.6%) | 16/888 (1.8%) | 19/47 | 888/888 (100%) | 196 | 33.7% | all_purpose:50, big_fish:16 | closed:35, open:16, caution:15 | neutral:59, suppressed:7 | calm:32, breezy:16, slight:16, windy:2 | cold_slow_or_front:19, unclassified:15, calm_bright_clear_subtle:12, calm_low_light_surface:7, stable_pleasant_high_confidence:5 | clear:54, dirty:9, stained:3 | Mar:13, Aug:12, Apr:7, Feb:7<br>spring:25, summer:19, fall:11, winter:11 | clear_subtle:47, cold_slow:21, calm_surface:16, wind_reaction:15, low_light_surface:7, dirty_vibration:4 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49 | 49/3552 (1.4%) | 49/1776 (2.8%) | 47/888 (5.3%) | 2/888 (0.2%) | 34/15 | 288/888 (32.4%) | 161 | 30.4% | all_purpose:47, big_fish:2 | open:44, caution:5 | neutral:49 | calm:38, breezy:6, slight:5 | stable_pleasant_high_confidence:20, cold_slow_or_front:9, calm_low_light_surface:7, unclassified:5, calm_bright_clear_subtle:4 | dirty:20, stained:15, clear:14 | Sep:15, Jul:11, Jun:10, Aug:7<br>summer:28, fall:15, spring:6 | calm_surface:38, low_light_surface:13, clear_subtle:12, cold_slow:6, dirty_vibration:6, wind_reaction:6 |
| Mouse Pattern<br>mouse_fly | fly | 47 | 47/3552 (1.3%) | 47/1776 (2.6%) | 0/888 (0%) | 47/888 (5.3%) | 23/24 | 324/888 (36.5%) | 139 | 33.8% | big_fish:47 | open:41, caution:6 | neutral:47 | calm:35, breezy:6, slight:6 | stable_pleasant_high_confidence:21, calm_low_light_surface:7, calm_bright_clear_subtle:5, cold_slow_or_front:5, unclassified:5 | stained:19, clear:16, dirty:12 | Sep:15, Jun:14, Jul:13, Aug:5<br>summer:32, fall:15 | calm_surface:35, low_light_surface:14, clear_subtle:11, wind_reaction:6, none:5, dirty_vibration:4 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 45 | 45/3552 (1.3%) | 45/1776 (2.5%) | 34/888 (3.8%) | 11/888 (1.2%) | 20/25 | 204/888 (23%) | 88 | 51.1% | all_purpose:34, big_fish:11 | closed:40, open:4, caution:1 | neutral:26, suppressed:12, active:7 | slight:14, calm:13, breezy:12, windy:6 | cold_slow_or_front:21, unclassified:7, breezy_windy_stained_reaction:4, dirty_vibration:4, stable_pleasant_high_confidence:4 | clear:16, dirty:15, stained:14 | Apr:22, Oct:14, May:9<br>spring:31, fall:14 | cold_slow:21, wind_reaction:12, none:10, dirty_vibration:9, clear_subtle:7, low_light_surface:3 |
| Woolly Bugger<br>woolly_bugger | fly | 44 | 44/3552 (1.2%) | 44/1776 (2.5%) | 44/888 (5%) | 0/888 (0%) | 24/20 | 888/888 (100%) | 299 | 14.7% | all_purpose:44 | closed:29, open:9, caution:6 | neutral:38, suppressed:6 | breezy:19, calm:18, slight:7 | cold_slow_or_front:20, breezy_windy_stained_reaction:5, dirty_vibration:5, calm_bright_clear_subtle:3, calm_low_light_surface:2 | clear:19, stained:13, dirty:12 | Mar:13, Apr:7, May:6, Feb:5<br>spring:26, winter:8, summer:6, fall:4 | cold_slow:29, wind_reaction:14, dirty_vibration:12, calm_surface:8, clear_subtle:8, current_swing:7 |
| Frog Popper<br>frog_fly | fly | 41 | 41/3552 (1.2%) | 41/1776 (2.3%) | 0/888 (0%) | 41/888 (4.6%) | 21/20 | 192/888 (21.6%) | 99 | 41.4% | big_fish:41 | open:27, caution:14 | neutral:35, active:6 | calm:21, slight:11, breezy:9 | unclassified:11, calm_low_light_surface:9, stable_pleasant_high_confidence:9, cold_slow_or_front:4, breezy_windy_stained_reaction:3 | dirty:15, clear:14, stained:12 | Apr:11, Jun:8, May:7, Aug:5<br>spring:21, summer:16, fall:4 | calm_surface:21, low_light_surface:20, clear_subtle:9, wind_reaction:9, cold_slow:6, dirty_vibration:6 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 21 | 21/3552 (0.6%) | 21/1776 (1.2%) | 14/888 (1.6%) | 7/888 (0.8%) | 5/16 | 888/888 (100%) | 69 | 30.4% | all_purpose:14, big_fish:7 | closed:17, caution:4 | neutral:21 | slight:11, calm:10 | warming_search:12, unclassified:4, dirty_vibration:3, river_elevated_runoff_current:2 | stained:8, dirty:7, clear:6 | Apr:6, Oct:6, Jun:4, Feb:3<br>fall:6, spring:6, winter:5, summer:4 | warming_search:14, current_swing:9, dirty_vibration:6, none:4, low_light_surface:3, clear_subtle:2 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 150 | 150/3552 (4.2%) | 150/1776 (8.4%) | 8/888 (0.9%) | 142/888 (16%) | 37/113 | 888/888 (100%) | 213 | 70.4% | big_fish:142, all_purpose:8 | closed:81, caution:35, open:34 | neutral:127, active:18, suppressed:5 | breezy:51, slight:48, calm:42, windy:9 | unclassified:32, breezy_windy_stained_reaction:26, cold_slow_or_front:24, dirty_vibration:23, stable_pleasant_high_confidence:23 | dirty:67, stained:56, clear:27 | Apr:29, Mar:28, Oct:18, Jun:16<br>spring:70, summer:37, fall:33, winter:10 | wind_reaction:58, dirty_vibration:53, none:37, low_light_surface:25, calm_surface:24, cold_slow:21 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 106 | 106/3552 (3%) | 106/1776 (6%) | 0/888 (0%) | 106/888 (11.9%) | 70/36 | 552/888 (62.2%) | 221 | 48% | big_fish:106 | closed:66, open:22, caution:18 | neutral:85, active:12, suppressed:9 | breezy:40, calm:35, slight:28, windy:3 | cold_slow_or_front:44, breezy_windy_stained_reaction:14, stable_pleasant_high_confidence:14, dirty_vibration:8, unclassified:8 | clear:40, stained:40, dirty:26 | Mar:27, Apr:25, Oct:24, May:14<br>spring:66, fall:40 | cold_slow:39, wind_reaction:37, dirty_vibration:23, none:23, calm_surface:19, clear_subtle:16 |
| Soft Jerkbait<br>soft_jerkbait | lure | 93 | 93/3552 (2.6%) | 93/1776 (5.2%) | 90/888 (10.1%) | 3/888 (0.3%) | 55/38 | 840/888 (94.6%) | 271 | 34.3% | all_purpose:90, big_fish:3 | open:39, caution:37, closed:17 | neutral:83, active:7, suppressed:3 | calm:47, slight:38, breezy:7, windy:1 | unclassified:29, cold_slow_or_front:22, stable_pleasant_high_confidence:20, calm_bright_clear_subtle:11, calm_low_light_surface:7 | clear:54, stained:25, dirty:14 | Aug:21, Jun:16, Sep:11, Apr:10<br>summer:45, spring:24, fall:23, winter:1 | clear_subtle:40, calm_surface:37, none:26, low_light_surface:15, cold_slow:10, wind_reaction:6 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 92 | 92/3552 (2.6%) | 92/1776 (5.2%) | 59/888 (6.6%) | 33/888 (3.7%) | 51/41 | 888/888 (100%) | 512 | 18% | all_purpose:59, big_fish:33 | closed:48, open:27, caution:17 | neutral:77, suppressed:11, active:4 | calm:41, breezy:31, slight:17, windy:3 | cold_slow_or_front:40, unclassified:14, stable_pleasant_high_confidence:13, calm_bright_clear_subtle:11, calm_low_light_surface:6 | clear:58, stained:19, dirty:15 | Apr:14, Aug:13, Mar:13, Oct:11<br>spring:34, summer:26, fall:20, winter:12 | cold_slow:39, clear_subtle:36, wind_reaction:28, calm_surface:24, low_light_surface:11, none:6 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 89 | 89/3552 (2.5%) | 89/1776 (5%) | 58/888 (6.5%) | 31/888 (3.5%) | 70/19 | 888/888 (100%) | 458 | 19.4% | all_purpose:58, big_fish:31 | closed:69, caution:11, open:9 | neutral:78, active:11 | breezy:61, calm:11, slight:11, windy:6 | dirty_vibration:30, breezy_windy_stained_reaction:24, cold_slow_or_front:13, warming_search:9, unclassified:6 | dirty:39, stained:34, clear:16 | Mar:34, Oct:17, Apr:14, Nov:9<br>spring:51, fall:28, winter:7, summer:3 | wind_reaction:67, dirty_vibration:57, open_water_search:26, cold_slow:18, low_light_surface:11, warming_search:10 |
| Spinnerbait<br>spinnerbait | lure | 83 | 83/3552 (2.3%) | 83/1776 (4.7%) | 79/888 (8.9%) | 4/888 (0.5%) | 50/33 | 888/888 (100%) | 581 | 14.3% | all_purpose:79, big_fish:4 | closed:35, open:28, caution:20 | neutral:72, active:10, suppressed:1 | breezy:39, calm:21, slight:21, windy:2 | dirty_vibration:26, breezy_windy_stained_reaction:15, unclassified:14, stable_pleasant_high_confidence:12, cold_slow_or_front:10 | dirty:40, stained:33, clear:10 | Apr:18, Mar:15, Jun:12, Oct:7<br>spring:37, summer:23, fall:19, winter:4 | dirty_vibration:45, wind_reaction:41, low_light_surface:23, none:17, calm_surface:15, open_water_search:12 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 78 | 78/3552 (2.2%) | 78/1776 (4.4%) | 61/888 (6.9%) | 17/888 (1.9%) | 40/38 | 396/888 (44.6%) | 133 | 58.6% | all_purpose:61, big_fish:17 | closed:70, caution:4, open:4 | neutral:72, suppressed:6 | slight:27, calm:26, breezy:24, windy:1 | cold_slow_or_front:29, unclassified:16, warming_search:10, calm_bright_clear_subtle:5, dirty_vibration:5 | clear:34, dirty:24, stained:20 | Feb:18, Mar:18, Oct:13, Apr:10<br>spring:33, winter:26, fall:19 | cold_slow:32, wind_reaction:22, none:16, clear_subtle:14, warming_search:10, dirty_vibration:9 |
| Topwater Popper<br>popping_topwater | lure | 77 | 77/3552 (2.2%) | 77/1776 (4.3%) | 62/888 (7%) | 15/888 (1.7%) | 21/56 | 540/888 (60.8%) | 202 | 38.1% | all_purpose:62, big_fish:15 | open:76, caution:1 | neutral:76, active:1 | calm:70, breezy:6, slight:1 | stable_pleasant_high_confidence:37, calm_low_light_surface:13, cold_slow_or_front:13, calm_bright_clear_subtle:8, breezy_windy_stained_reaction:4 | stained:33, clear:23, dirty:21 | Sep:17, Jul:16, Jun:14, Apr:11<br>summer:35, fall:21, spring:21 | calm_surface:70, clear_subtle:21, low_light_surface:20, cold_slow:8, dirty_vibration:7, wind_reaction:6 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 77 | 77/3552 (2.2%) | 77/1776 (4.3%) | 16/888 (1.8%) | 61/888 (6.9%) | 50/27 | 192/888 (21.6%) | 108 | 71.3% | big_fish:61, all_purpose:16 | open:59, caution:18 | neutral:67, active:10 | calm:45, breezy:20, slight:12 | calm_low_light_surface:26, stable_pleasant_high_confidence:13, unclassified:12, cold_slow_or_front:10, breezy_windy_stained_reaction:6 | dirty:28, clear:25, stained:24 | Apr:24, Jun:13, May:13, Aug:9<br>spring:44, summer:25, fall:8 | low_light_surface:46, calm_surface:45, wind_reaction:20, clear_subtle:15, cold_slow:13, dirty_vibration:12 |
| Bladed Jig<br>bladed_jig | lure | 76 | 76/3552 (2.1%) | 76/1776 (4.3%) | 61/888 (6.9%) | 15/888 (1.7%) | 34/42 | 888/888 (100%) | 619 | 12.3% | all_purpose:61, big_fish:15 | closed:32, caution:22, open:22 | neutral:66, active:7, suppressed:3 | calm:35, slight:27, breezy:10, windy:4 | unclassified:17, stable_pleasant_high_confidence:12, dirty_vibration:11, warming_search:11, cold_slow_or_front:10 | dirty:41, stained:25, clear:10 | Jun:13, Aug:11, Apr:9, Sep:9<br>summer:29, spring:24, fall:17, winter:6 | calm_surface:21, none:21, dirty_vibration:19, low_light_surface:15, warming_search:13, wind_reaction:13 |
| Wake Bait<br>wake_bait | lure | 75 | 75/3552 (2.1%) | 75/1776 (4.2%) | 11/888 (1.2%) | 64/888 (7.2%) | 44/31 | 384/888 (43.2%) | 211 | 35.5% | big_fish:64, all_purpose:11 | open:56, caution:19 | neutral:74, active:1 | calm:52, slight:19, breezy:4 | stable_pleasant_high_confidence:26, unclassified:17, cold_slow_or_front:13, calm_low_light_surface:10, calm_bright_clear_subtle:6 | clear:27, dirty:26, stained:22 | Jun:18, Sep:18, Jul:15, Aug:13<br>summer:46, fall:18, spring:11 | calm_surface:52, clear_subtle:20, low_light_surface:16, none:13, cold_slow:8, wind_reaction:4 |
| Football Jig<br>football_jig | lure | 74 | 74/3552 (2.1%) | 74/1776 (4.2%) | 0/888 (0%) | 74/888 (8.3%) | 22/52 | 360/888 (40.5%) | 109 | 67.9% | big_fish:74 | closed:68, caution:4, open:2 | neutral:59, active:9, suppressed:6 | breezy:34, slight:20, calm:15, windy:5 | cold_slow_or_front:23, dirty_vibration:12, unclassified:11, breezy_windy_stained_reaction:10, warming_search:9 | clear:28, dirty:25, stained:21 | Mar:22, Oct:17, Apr:15, Feb:7<br>spring:39, fall:24, winter:11 | wind_reaction:36, dirty_vibration:22, cold_slow:18, none:18, open_water_search:9, warming_search:9 |
| Glide Bait<br>glidebait | lure | 72 | 72/3552 (2%) | 72/1776 (4.1%) | 0/888 (0%) | 72/888 (8.1%) | 56/16 | 276/888 (31.1%) | 142 | 50.7% | big_fish:72 | open:41, caution:23, closed:8 | neutral:60, active:6, suppressed:6 | calm:43, slight:21, breezy:6, windy:2 | cold_slow_or_front:19, unclassified:18, stable_pleasant_high_confidence:15, calm_bright_clear_subtle:9, calm_low_light_surface:9 | clear:37, stained:29, dirty:6 | Jun:28, Sep:22, May:17, Mar:5<br>summer:28, fall:22, spring:22 | calm_surface:40, clear_subtle:27, low_light_surface:18, cold_slow:13, none:13, wind_reaction:5 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 66 | 66/3552 (1.9%) | 66/1776 (3.7%) | 59/888 (6.6%) | 7/888 (0.8%) | 45/21 | 888/888 (100%) | 604 | 10.9% | all_purpose:59, big_fish:7 | closed:26, open:23, caution:17 | neutral:56, active:5, suppressed:5 | calm:32, slight:29, breezy:5 | unclassified:19, stable_pleasant_high_confidence:17, cold_slow_or_front:15, warming_search:9, calm_low_light_surface:5 | dirty:28, stained:22, clear:16 | Aug:11, Oct:10, Jun:9, Apr:7<br>summer:27, fall:20, spring:13, winter:6 | none:25, calm_surface:21, low_light_surface:11, warming_search:9, cold_slow:5, clear_subtle:3 |
| Magnum Worm<br>magnum_worm | lure | 61 | 61/3552 (1.7%) | 61/1776 (3.4%) | 0/888 (0%) | 61/888 (6.9%) | 16/45 | 336/888 (37.8%) | 81 | 75.3% | big_fish:61 | caution:31, open:27, closed:3 | neutral:58, suppressed:3 | calm:33, slight:28 | unclassified:25, stable_pleasant_high_confidence:16, calm_low_light_surface:9, cold_slow_or_front:8, heat_limited_finesse:2 | dirty:26, stained:24, clear:11 | Aug:24, Jun:18, Jul:11, Sep:8<br>summer:53, fall:8 | calm_surface:27, none:24, low_light_surface:10, clear_subtle:7, heat_finesse:3 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 57 | 57/3552 (1.6%) | 57/1776 (3.2%) | 53/888 (6%) | 4/888 (0.5%) | 10/47 | 840/888 (94.6%) | 200 | 28.5% | all_purpose:53, big_fish:4 | closed:21, caution:18, open:18 | neutral:49, suppressed:6, active:2 | calm:25, breezy:22, slight:10 | cold_slow_or_front:19, calm_bright_clear_subtle:10, unclassified:9, stable_pleasant_high_confidence:8, breezy_windy_stained_reaction:6 | clear:34, stained:16, dirty:7 | Mar:14, Aug:9, Sep:7, Feb:5<br>spring:23, summer:16, fall:12, winter:6 | cold_slow:27, clear_subtle:26, calm_surface:18, wind_reaction:18, dirty_vibration:8, none:5 |
| Lipless Crankbait<br>lipless_crankbait | lure | 56 | 56/3552 (1.6%) | 56/1776 (3.2%) | 51/888 (5.7%) | 5/888 (0.6%) | 45/11 | 888/888 (100%) | 318 | 17.6% | all_purpose:51, big_fish:5 | closed:35, open:14, caution:7 | neutral:50, active:6 | breezy:42, calm:7, windy:4, slight:3 | dirty_vibration:24, breezy_windy_stained_reaction:21, warming_search:7, cold_slow_or_front:3, calm_low_light_surface:1 | dirty:29, stained:25, clear:2 | Mar:14, Apr:12, Oct:10, Jul:5<br>spring:30, fall:15, summer:7, winter:4 | dirty_vibration:47, wind_reaction:46, open_water_search:16, cold_slow:14, low_light_surface:14, warming_search:8 |
| Walking Bait<br>walking_topwater | lure | 56 | 56/3552 (1.6%) | 56/1776 (3.2%) | 0/888 (0%) | 56/888 (6.3%) | 34/22 | 540/888 (60.8%) | 248 | 22.6% | big_fish:56 | open:39, caution:17 | neutral:54, active:2 | calm:34, slight:17, breezy:5 | stable_pleasant_high_confidence:24, unclassified:11, cold_slow_or_front:7, calm_bright_clear_subtle:4, calm_low_light_surface:4 | clear:22, stained:21, dirty:13 | Sep:13, Aug:12, Jun:8, Oct:8<br>summer:27, fall:24, spring:5 | calm_surface:34, clear_subtle:16, low_light_surface:15, none:7, dirty_vibration:6, cold_slow:5 |
| Buzzbait<br>buzzbait | lure | 53 | 53/3552 (1.5%) | 53/1776 (3%) | 1/888 (0.1%) | 52/888 (5.9%) | 36/17 | 540/888 (60.8%) | 147 | 36.1% | big_fish:52, all_purpose:1 | open:28, caution:25 | neutral:47, active:6 | breezy:21, slight:19, calm:13 | calm_low_light_surface:13, unclassified:13, dirty_vibration:9, cold_slow_or_front:8, breezy_windy_stained_reaction:7 | dirty:30, stained:15, clear:8 | Jun:11, Apr:8, Aug:7, Oct:7<br>summer:24, fall:16, spring:13 | low_light_surface:36, wind_reaction:21, dirty_vibration:20, calm_surface:13, none:11, open_water_search:8 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 46 | 46/3552 (1.3%) | 46/1776 (2.6%) | 33/888 (3.7%) | 13/888 (1.5%) | 7/39 | 840/888 (94.6%) | 228 | 20.2% | all_purpose:33, big_fish:13 | caution:17, open:16, closed:13 | neutral:32, active:10, suppressed:4 | breezy:19, slight:14, calm:9, windy:4 | cold_slow_or_front:11, unclassified:11, dirty_vibration:9, breezy_windy_stained_reaction:6, stable_pleasant_high_confidence:6 | dirty:24, stained:12, clear:10 | Jun:16, Apr:14, Aug:6, May:6<br>spring:23, summer:22, fall:1 | wind_reaction:23, low_light_surface:19, dirty_vibration:17, none:13, current_swing:4, cold_slow:3 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 46 | 46/3552 (1.3%) | 46/1776 (2.6%) | 24/888 (2.7%) | 22/888 (2.5%) | 7/39 | 888/888 (100%) | 201 | 22.9% | all_purpose:24, big_fish:22 | closed:25, open:13, caution:8 | neutral:42, suppressed:3, active:1 | calm:35, slight:10, breezy:1 | calm_bright_clear_subtle:10, heat_limited_finesse:8, unclassified:8, cold_slow_or_front:6, stable_pleasant_high_confidence:6 | clear:31, stained:12, dirty:3 | Aug:10, Feb:9, Mar:6, Oct:6<br>summer:17, winter:11, spring:10, fall:8 | clear_subtle:29, calm_surface:13, heat_finesse:12, none:8, cold_slow:6, low_light_surface:4 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 45 | 45/3552 (1.3%) | 45/1776 (2.5%) | 45/888 (5.1%) | 0/888 (0%) | 27/18 | 288/888 (32.4%) | 112 | 40.2% | all_purpose:45 | open:24, closed:12, caution:9 | neutral:34, active:6, suppressed:5 | calm:27, slight:10, breezy:4, windy:4 | cold_slow_or_front:15, unclassified:9, stable_pleasant_high_confidence:7, calm_bright_clear_subtle:4, calm_low_light_surface:4 | clear:19, stained:15, dirty:11 | Jun:18, Apr:13, May:11, Mar:3<br>spring:27, summer:18 | calm_surface:21, clear_subtle:16, cold_slow:9, low_light_surface:9, none:9, wind_reaction:7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 40 | 40/3552 (1.1%) | 40/1776 (2.3%) | 28/888 (3.2%) | 12/888 (1.4%) | 9/31 | 840/888 (94.6%) | 182 | 22% | all_purpose:28, big_fish:12 | closed:17, caution:13, open:10 | neutral:30, suppressed:8, active:2 | slight:19, calm:13, breezy:8 | cold_slow_or_front:22, unclassified:11, stable_pleasant_high_confidence:6, calm_bright_clear_subtle:1 | clear:17, stained:17, dirty:6 | May:9, Aug:6, Jun:6, Apr:5<br>spring:19, summer:13, fall:6, winter:2 | cold_slow:18, none:11, calm_surface:10, clear_subtle:6, low_light_surface:3, wind_reaction:2 |
| Swim Jig<br>swim_jig | lure | 36 | 36/3552 (1%) | 36/1776 (2%) | 36/888 (4.1%) | 0/888 (0%) | 27/9 | 888/888 (100%) | 466 | 7.7% | all_purpose:36 | caution:20, open:12, closed:4 | neutral:32, active:3, suppressed:1 | slight:20, calm:15, breezy:1 | unclassified:14, stable_pleasant_high_confidence:9, cold_slow_or_front:6, calm_low_light_surface:4, heat_limited_finesse:2 | dirty:19, stained:11, clear:6 | Jun:11, Sep:7, Aug:6, Oct:3<br>summer:18, fall:12, spring:6 | none:14, calm_surface:12, low_light_surface:11, heat_finesse:2, cold_slow:1, current_swing:1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 23 | 23/3552 (0.6%) | 23/1776 (1.3%) | 13/888 (1.5%) | 10/888 (1.1%) | 8/15 | 840/888 (94.6%) | 164 | 14% | all_purpose:13, big_fish:10 | closed:19, caution:3, open:1 | neutral:13, suppressed:7, active:3 | slight:12, breezy:6, calm:5 | cold_slow_or_front:13, unclassified:5, stable_pleasant_high_confidence:2, breezy_windy_stained_reaction:1, dirty_vibration:1 | dirty:11, clear:6, stained:6 | Oct:9, Apr:6, Nov:4, Jan:2<br>fall:13, spring:7, winter:3 | none:11, cold_slow:9, dirty_vibration:2, wind_reaction:2, calm_surface:1, low_light_surface:1 |
| Blade Bait<br>blade_bait | lure | 19 | 19/3552 (0.5%) | 19/1776 (1.1%) | 17/888 (1.9%) | 2/888 (0.2%) | 3/16 | 888/888 (100%) | 151 | 12.6% | all_purpose:17, big_fish:2 | closed:9, caution:7, open:3 | neutral:17, active:1, suppressed:1 | slight:12, breezy:6, calm:1 | unclassified:7, breezy_windy_stained_reaction:3, cold_slow_or_front:3, river_elevated_runoff_current:3, dirty_vibration:2 | stained:8, dirty:7, clear:4 | Feb:5, Jun:4, Apr:3, Oct:3<br>winter:6, spring:5, fall:4, summer:4 | cold_slow:7, dirty_vibration:7, low_light_surface:7, none:7, current_swing:5, wind_reaction:5 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 13 | 13/3552 (0.4%) | 13/1776 (0.7%) | 11/888 (1.2%) | 2/888 (0.2%) | 5/8 | 672/888 (75.7%) | 106 | 12.3% | all_purpose:11, big_fish:2 | caution:11, closed:1, open:1 | neutral:12, suppressed:1 | calm:6, slight:4, breezy:3 | heat_limited_finesse:4, unclassified:4, cold_slow_or_front:3, calm_bright_clear_subtle:2 | clear:8, stained:3, dirty:2 | Aug:9, Apr:2, May:2<br>summer:9, spring:4 | clear_subtle:7, heat_finesse:5, cold_slow:4, wind_reaction:2, calm_surface:1 |
| Tube Jig<br>tube_jig | lure | 7 | 7/3552 (0.2%) | 7/1776 (0.4%) | 2/888 (0.2%) | 5/888 (0.6%) | 4/3 | 888/888 (100%) | 153 | 4.6% | big_fish:5, all_purpose:2 | closed:7 | neutral:6, suppressed:1 | slight:5, calm:2 | cold_slow_or_front:4, unclassified:2, calm_bright_clear_subtle:1 | clear:3, stained:3, dirty:1 | Feb:3, May:3, Oct:1<br>spring:3, winter:3, fall:1 | cold_slow:5, none:2, clear_subtle:1 |
| Ned Rig<br>ned_rig | lure | 5 | 5/3552 (0.1%) | 5/1776 (0.3%) | 5/888 (0.6%) | 0/888 (0%) | 1/4 | 396/888 (44.6%) | 106 | 4.7% | all_purpose:5 | closed:5 | neutral:5 | calm:2, slight:2, breezy:1 | unclassified:2, cold_slow_or_front:1, heat_limited_finesse:1, warming_search:1 | dirty:3, clear:2 | Apr:2, Mar:2, Feb:1<br>spring:4, winter:1 | none:2, clear_subtle:1, cold_slow:1, current_swing:1, heat_finesse:1, warming_search:1 |
| Finesse Jig<br>finesse_jig | lure | 5 | 5/3552 (0.1%) | 5/1776 (0.3%) | 5/888 (0.6%) | 0/888 (0%) | 4/1 | 396/888 (44.6%) | 72 | 6.9% | all_purpose:5 | closed:5 | neutral:3, active:1, suppressed:1 | breezy:3, calm:2 | cold_slow_or_front:2, calm_bright_clear_subtle:1, heat_limited_finesse:1, stable_pleasant_high_confidence:1 | clear:4, stained:1 | Mar:3, Apr:1, Jan:1<br>spring:4, winter:1 | cold_slow:2, heat_finesse:2, wind_reaction:2, clear_subtle:1 |

## PB Sensibility Audit

| Profile | Gear | All side share | AP side share | BF side share | AP selected | BF selected | PB skew | Top/HM | Goal tags | Condition tags | Forage tags | Wind selected | Surface gate selected | Primary selected contexts |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 159/1776 (9%) | 37/888 (4.2%) | 122/888 (13.7%) | 37 | 122 | 3.3x | 115/44 | versatile_search, big_fish_upside | open_water_search, runoff_streamer | baitfish | calm:61, slight:61, breezy:33, windy:4 | closed:74, caution:43, open:42 | unclassified:38, cold_slow_or_front:35, stable_pleasant_high_confidence:23, dirty_vibration:18<br>dirty:74, stained:55, clear:30<br>none:48, calm_surface:35, wind_reaction:32, dirty_vibration:31, low_light_surface:31 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 142/1776 (8%) | 128/888 (14.4%) | 14/888 (1.6%) | 128 | 14 | 0.1x | 33/109 | versatile_search | open_water_search, warming_search | baitfish, bluegill_perch | calm:51, slight:51, breezy:37, windy:3 | closed:57, caution:48, open:37 | cold_slow_or_front:32, unclassified:31, stable_pleasant_high_confidence:20, dirty_vibration:17<br>dirty:58, stained:55, clear:29<br>wind_reaction:38, none:36, calm_surface:31, dirty_vibration:31, low_light_surface:24 |
| Bass Popper<br>popper_fly | fly | 75/1776 (4.2%) | 74/888 (8.3%) | 1/888 (0.1%) | 74 | 1 | 0x | 48/27 | reliable_action, versatile_search | calm_surface, low_light_surface | surface_prey, bluegill_perch | calm:59, breezy:10, slight:6 | open:69, caution:6 | stable_pleasant_high_confidence:28, calm_low_light_surface:14, cold_slow_or_front:11, calm_bright_clear_subtle:9<br>stained:27, clear:24, dirty:24<br>calm_surface:59, low_light_surface:30, clear_subtle:19, cold_slow:10, wind_reaction:10 |
| Bluegill Streamer<br>bluegill_streamer | fly | 69/1776 (3.9%) | 0/888 (0%) | 69/888 (7.8%) | 0 | 69 | PB-only | 53/16 | big_fish_upside | cover_ambush, warming_search | bluegill_perch, baitfish | calm:38, slight:25, breezy:4, windy:2 | open:37, caution:29, closed:3 | unclassified:24, stable_pleasant_high_confidence:18, cold_slow_or_front:11, calm_low_light_surface:7<br>clear:27, stained:25, dirty:17<br>calm_surface:35, clear_subtle:18, none:16, low_light_surface:13, wind_reaction:6 |
| Clouser Minnow<br>clouser_minnow | fly | 164/1776 (9.2%) | 162/888 (18.2%) | 2/888 (0.2%) | 162 | 2 | 0x | 104/60 | reliable_action, versatile_search | current_swing, open_water_search | baitfish | calm:69, slight:55, breezy:38, windy:2 | closed:64, open:55, caution:45 | unclassified:38, stable_pleasant_high_confidence:32, cold_slow_or_front:30, calm_low_light_surface:14<br>stained:63, clear:59, dirty:42<br>calm_surface:45, none:37, wind_reaction:36, low_light_surface:35, clear_subtle:29 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 45/1776 (2.5%) | 34/888 (3.8%) | 11/888 (1.2%) | 34 | 11 | 0.3x | 20/25 | reliable_action | cover_ambush, cold_slow | crawfish | slight:14, calm:13, breezy:12, windy:6 | closed:40, open:4, caution:1 | cold_slow_or_front:21, unclassified:7, breezy_windy_stained_reaction:4, dirty_vibration:4<br>clear:16, dirty:15, stained:14<br>cold_slow:21, wind_reaction:12, none:10, dirty_vibration:9, clear_subtle:7 |
| Deceiver<br>deceiver | fly | 90/1776 (5.1%) | 67/888 (7.5%) | 23/888 (2.6%) | 67 | 23 | 0.3x | 63/27 | versatile_search | wind_reaction, open_water_search | baitfish | breezy:58, slight:17, calm:10, windy:5 | closed:48, open:27, caution:15 | dirty_vibration:24, breezy_windy_stained_reaction:21, cold_slow_or_front:18, stable_pleasant_high_confidence:12<br>dirty:37, stained:29, clear:24<br>wind_reaction:63, dirty_vibration:45, low_light_surface:23, cold_slow:19, open_water_search:18 |
| Deer Hair Slider<br>deer_hair_slider | fly | 114/1776 (6.4%) | 5/888 (0.6%) | 109/888 (12.3%) | 5 | 109 | 21.8x | 38/76 | big_fish_upside | calm_surface, low_light_surface | surface_prey, baitfish | calm:67, slight:31, breezy:16 | open:83, caution:31 | stable_pleasant_high_confidence:33, unclassified:21, calm_low_light_surface:19, cold_slow_or_front:19<br>dirty:41, clear:38, stained:35<br>calm_surface:67, low_light_surface:48, clear_subtle:23, none:17, wind_reaction:16 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 100/1776 (5.6%) | 0/888 (0%) | 100/888 (11.3%) | 0 | 100 | PB-only | 75/25 | big_fish_upside, high_risk_high_reward | runoff_streamer, cover_ambush | baitfish, bluegill_perch | breezy:41, calm:32, slight:22, windy:5 | closed:57, open:26, caution:17 | cold_slow_or_front:30, stable_pleasant_high_confidence:15, unclassified:15, breezy_windy_stained_reaction:14<br>stained:36, clear:33, dirty:31<br>wind_reaction:41, cold_slow:31, dirty_vibration:26, calm_surface:19, none:17 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49/1776 (2.8%) | 47/888 (5.3%) | 2/888 (0.2%) | 47 | 2 | 0x | 34/15 | reliable_action, versatile_search | calm_surface, low_light_surface | surface_prey, baitfish | calm:38, breezy:6, slight:5 | open:44, caution:5 | stable_pleasant_high_confidence:20, cold_slow_or_front:9, calm_low_light_surface:7, unclassified:5<br>dirty:20, stained:15, clear:14<br>calm_surface:38, low_light_surface:13, clear_subtle:12, cold_slow:6, dirty_vibration:6 |
| Frog Popper<br>frog_fly | fly | 41/1776 (2.3%) | 0/888 (0%) | 41/888 (4.6%) | 0 | 41 | PB-only | 21/20 | big_fish_upside, high_risk_high_reward | calm_surface, low_light_surface, cover_ambush | surface_prey, bluegill_perch | calm:21, slight:11, breezy:9 | open:27, caution:14 | unclassified:11, calm_low_light_surface:9, stable_pleasant_high_confidence:9, cold_slow_or_front:4<br>dirty:15, clear:14, stained:12<br>calm_surface:21, low_light_surface:20, clear_subtle:9, wind_reaction:9, cold_slow:6 |
| Game Changer<br>game_changer | fly | 178/1776 (10%) | 53/888 (6%) | 125/888 (14.1%) | 53 | 125 | 2.4x | 135/43 | versatile_search, big_fish_upside | open_water_search | baitfish | calm:74, slight:61, breezy:39, windy:4 | closed:71, open:56, caution:51 | unclassified:43, cold_slow_or_front:41, stable_pleasant_high_confidence:35, calm_low_light_surface:16<br>clear:72, dirty:59, stained:47<br>calm_surface:49, none:47, wind_reaction:41, clear_subtle:35, low_light_surface:33 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 93/1776 (5.2%) | 74/888 (8.3%) | 19/888 (2.1%) | 74 | 19 | 0.3x | 11/82 | reliable_action | cold_slow, current_swing | leech_worm | breezy:51, slight:25, calm:16, windy:1 | closed:61, caution:23, open:9 | cold_slow_or_front:36, breezy_windy_stained_reaction:16, dirty_vibration:15, unclassified:13<br>stained:38, dirty:29, clear:26<br>cold_slow:49, wind_reaction:46, dirty_vibration:34, none:17, low_light_surface:13 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 66/1776 (3.7%) | 50/888 (5.6%) | 16/888 (1.8%) | 50 | 16 | 0.3x | 19/47 | reliable_action | cold_slow, clear_subtle | leech_worm | calm:32, breezy:16, slight:16, windy:2 | closed:35, open:16, caution:15 | cold_slow_or_front:19, unclassified:15, calm_bright_clear_subtle:12, calm_low_light_surface:7<br>clear:54, dirty:9, stained:3<br>clear_subtle:47, cold_slow:21, calm_surface:16, wind_reaction:15, low_light_surface:7 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 21/1776 (1.2%) | 14/888 (1.6%) | 7/888 (0.8%) | 14 | 7 | 0.5x | 5/16 | versatile_search | warming_search, current_swing | leech_worm | slight:11, calm:10 | closed:17, caution:4 | warming_search:12, unclassified:4, dirty_vibration:3, river_elevated_runoff_current:2<br>stained:8, dirty:7, clear:6<br>warming_search:14, current_swing:9, dirty_vibration:6, none:4, low_light_surface:3 |
| Mouse Pattern<br>mouse_fly | fly | 47/1776 (2.6%) | 0/888 (0%) | 47/888 (5.3%) | 0 | 47 | PB-only | 23/24 | big_fish_upside, high_risk_high_reward | calm_surface, low_light_surface | surface_prey | calm:35, breezy:6, slight:6 | open:41, caution:6 | stable_pleasant_high_confidence:21, calm_low_light_surface:7, calm_bright_clear_subtle:5, cold_slow_or_front:5<br>stained:19, clear:16, dirty:12<br>calm_surface:35, low_light_surface:14, clear_subtle:11, wind_reaction:6, none:5 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 176/1776 (9.9%) | 17/888 (1.9%) | 159/888 (17.9%) | 17 | 159 | 9.4x | 31/145 | reliable_action, big_fish_upside | cold_slow, cover_ambush | leech_worm | breezy:62, slight:54, calm:51, windy:9 | closed:108, caution:41, open:27 | cold_slow_or_front:55, unclassified:34, dirty_vibration:29, breezy_windy_stained_reaction:28<br>stained:76, dirty:75, clear:25<br>wind_reaction:64, cold_slow:62, dirty_vibration:61, none:54, calm_surface:22 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 103/1776 (5.8%) | 82/888 (9.2%) | 21/888 (2.4%) | 82 | 21 | 0.3x | 36/67 | versatile_search | clear_subtle, open_water_search | baitfish, bluegill_perch | calm:49, slight:26, breezy:23, windy:5 | open:39, caution:32, closed:32 | unclassified:24, cold_slow_or_front:20, stable_pleasant_high_confidence:17, calm_bright_clear_subtle:15<br>clear:66, stained:22, dirty:15<br>clear_subtle:52, calm_surface:34, wind_reaction:25, low_light_surface:18, none:17 |
| Woolly Bugger<br>woolly_bugger | fly | 44/1776 (2.5%) | 44/888 (5%) | 0/888 (0%) | 44 | 0 | 0x | 24/20 | reliable_action | cold_slow, current_swing | leech_worm | breezy:19, calm:18, slight:7 | closed:29, open:9, caution:6 | cold_slow_or_front:20, breezy_windy_stained_reaction:5, dirty_vibration:5, calm_bright_clear_subtle:3<br>clear:19, stained:13, dirty:12<br>cold_slow:29, wind_reaction:14, dirty_vibration:12, calm_surface:8, clear_subtle:8 |
| Blade Bait<br>blade_bait | lure | 19/1776 (1.1%) | 17/888 (1.9%) | 2/888 (0.2%) | 17 | 2 | 0.1x | 3/16 | reliable_action | cold_slow, open_water_search, current_swing | baitfish | slight:12, breezy:6, calm:1 | closed:9, caution:7, open:3 | unclassified:7, breezy_windy_stained_reaction:3, cold_slow_or_front:3, river_elevated_runoff_current:3<br>stained:8, dirty:7, clear:4<br>cold_slow:7, dirty_vibration:7, low_light_surface:7, none:7, current_swing:5 |
| Bladed Jig<br>bladed_jig | lure | 76/1776 (4.3%) | 61/888 (6.9%) | 15/888 (1.7%) | 61 | 15 | 0.2x | 34/42 | reliable_action, versatile_search | wind_reaction, dirty_vibration, cover_ambush, warming_search | baitfish, bluegill_perch | calm:35, slight:27, breezy:10, windy:4 | closed:32, caution:22, open:22 | unclassified:17, stable_pleasant_high_confidence:12, dirty_vibration:11, warming_search:11<br>dirty:41, stained:25, clear:10<br>calm_surface:21, none:21, dirty_vibration:19, low_light_surface:15, warming_search:13 |
| Buzzbait<br>buzzbait | lure | 53/1776 (3%) | 1/888 (0.1%) | 52/888 (5.9%) | 1 | 52 | 52x | 36/17 | big_fish_upside, high_risk_high_reward | low_light_surface, wind_reaction, dirty_vibration | surface_prey, baitfish | breezy:21, slight:19, calm:13 | open:28, caution:25 | calm_low_light_surface:13, unclassified:13, dirty_vibration:9, cold_slow_or_front:8<br>dirty:30, stained:15, clear:8<br>low_light_surface:36, wind_reaction:21, dirty_vibration:20, calm_surface:13, none:11 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 57/1776 (3.2%) | 53/888 (6%) | 4/888 (0.5%) | 53 | 4 | 0.1x | 10/47 | reliable_action, versatile_search | clear_subtle, cold_slow | leech_worm, baitfish | calm:25, breezy:22, slight:10 | closed:21, caution:18, open:18 | cold_slow_or_front:19, calm_bright_clear_subtle:10, unclassified:9, stable_pleasant_high_confidence:8<br>clear:34, stained:16, dirty:7<br>cold_slow:27, clear_subtle:26, calm_surface:18, wind_reaction:18, dirty_vibration:8 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 150/1776 (8.4%) | 8/888 (0.9%) | 142/888 (16%) | 8 | 142 | 17.8x | 37/113 | big_fish_upside | cover_ambush, dirty_vibration | crawfish, bluegill_perch | breezy:51, slight:48, calm:42, windy:9 | closed:81, caution:35, open:34 | unclassified:32, breezy_windy_stained_reaction:26, cold_slow_or_front:24, dirty_vibration:23<br>dirty:67, stained:56, clear:27<br>wind_reaction:58, dirty_vibration:53, none:37, low_light_surface:25, calm_surface:24 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 23/1776 (1.3%) | 13/888 (1.5%) | 10/888 (1.1%) | 13 | 10 | 0.8x | 8/15 | versatile_search | open_water_search, cold_slow | baitfish, crawfish | slight:12, breezy:6, calm:5 | closed:19, caution:3, open:1 | cold_slow_or_front:13, unclassified:5, stable_pleasant_high_confidence:2, breezy_windy_stained_reaction:1<br>dirty:11, clear:6, stained:6<br>none:11, cold_slow:9, dirty_vibration:2, wind_reaction:2, calm_surface:1 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 46/1776 (2.6%) | 24/888 (2.7%) | 22/888 (2.5%) | 24 | 22 | 0.9x | 7/39 | reliable_action | clear_subtle, heat_finesse | baitfish, crawfish | calm:35, slight:10, breezy:1 | closed:25, open:13, caution:8 | calm_bright_clear_subtle:10, heat_limited_finesse:8, unclassified:8, cold_slow_or_front:6<br>clear:31, stained:12, dirty:3<br>clear_subtle:29, calm_surface:13, heat_finesse:12, none:8, cold_slow:6 |
| Finesse Jig<br>finesse_jig | lure | 5/1776 (0.3%) | 5/888 (0.6%) | 0/888 (0%) | 5 | 0 | 0x | 4/1 | reliable_action | clear_subtle, cold_slow, heat_finesse | crawfish, leech_worm | breezy:3, calm:2 | closed:5 | cold_slow_or_front:2, calm_bright_clear_subtle:1, heat_limited_finesse:1, stable_pleasant_high_confidence:1<br>clear:4, stained:1<br>cold_slow:2, heat_finesse:2, wind_reaction:2, clear_subtle:1 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 40/1776 (2.3%) | 28/888 (3.2%) | 12/888 (1.4%) | 28 | 12 | 0.4x | 9/31 | reliable_action | clear_subtle, cold_slow | baitfish | slight:19, calm:13, breezy:8 | closed:17, caution:13, open:10 | cold_slow_or_front:22, unclassified:11, stable_pleasant_high_confidence:6, calm_bright_clear_subtle:1<br>clear:17, stained:17, dirty:6<br>cold_slow:18, none:11, calm_surface:10, clear_subtle:6, low_light_surface:3 |
| Football Jig<br>football_jig | lure | 74/1776 (4.2%) | 0/888 (0%) | 74/888 (8.3%) | 0 | 74 | PB-only | 22/52 | big_fish_upside | cold_slow, cover_ambush | crawfish | breezy:34, slight:20, calm:15, windy:5 | closed:68, caution:4, open:2 | cold_slow_or_front:23, dirty_vibration:12, unclassified:11, breezy_windy_stained_reaction:10<br>clear:28, dirty:25, stained:21<br>wind_reaction:36, dirty_vibration:22, cold_slow:18, none:18, open_water_search:9 |
| Glide Bait<br>glidebait | lure | 72/1776 (4.1%) | 0/888 (0%) | 72/888 (8.1%) | 0 | 72 | PB-only | 56/16 | big_fish_upside, high_risk_high_reward | clear_subtle, open_water_search, cover_ambush | baitfish, bluegill_perch | calm:43, slight:21, breezy:6, windy:2 | open:41, caution:23, closed:8 | cold_slow_or_front:19, unclassified:18, stable_pleasant_high_confidence:15, calm_bright_clear_subtle:9<br>clear:37, stained:29, dirty:6<br>calm_surface:40, clear_subtle:27, low_light_surface:18, cold_slow:13, none:13 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 77/1776 (4.3%) | 16/888 (1.8%) | 61/888 (6.9%) | 16 | 61 | 3.8x | 50/27 | big_fish_upside, high_risk_high_reward | calm_surface, low_light_surface, cover_ambush | surface_prey, bluegill_perch | calm:45, breezy:20, slight:12 | open:59, caution:18 | calm_low_light_surface:26, stable_pleasant_high_confidence:13, unclassified:12, cold_slow_or_front:10<br>dirty:28, clear:25, stained:24<br>low_light_surface:46, calm_surface:45, wind_reaction:20, clear_subtle:15, cold_slow:13 |
| Lipless Crankbait<br>lipless_crankbait | lure | 56/1776 (3.2%) | 51/888 (5.7%) | 5/888 (0.6%) | 51 | 5 | 0.1x | 45/11 | versatile_search | wind_reaction, open_water_search | baitfish | breezy:42, calm:7, windy:4, slight:3 | closed:35, open:14, caution:7 | dirty_vibration:24, breezy_windy_stained_reaction:21, warming_search:7, cold_slow_or_front:3<br>dirty:29, stained:25, clear:2<br>dirty_vibration:47, wind_reaction:46, open_water_search:16, cold_slow:14, low_light_surface:14 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 106/1776 (6%) | 0/888 (0%) | 106/888 (11.9%) | 0 | 106 | PB-only | 70/36 | big_fish_upside, high_risk_high_reward | clear_subtle, cold_slow, open_water_search | baitfish | breezy:40, calm:35, slight:28, windy:3 | closed:66, open:22, caution:18 | cold_slow_or_front:44, breezy_windy_stained_reaction:14, stable_pleasant_high_confidence:14, dirty_vibration:8<br>clear:40, stained:40, dirty:26<br>cold_slow:39, wind_reaction:37, dirty_vibration:23, none:23, calm_surface:19 |
| Magnum Worm<br>magnum_worm | lure | 61/1776 (3.4%) | 0/888 (0%) | 61/888 (6.9%) | 0 | 61 | PB-only | 16/45 | big_fish_upside, high_risk_high_reward | cover_ambush, heat_finesse | leech_worm | calm:33, slight:28 | caution:31, open:27, closed:3 | unclassified:25, stable_pleasant_high_confidence:16, calm_low_light_surface:9, cold_slow_or_front:8<br>dirty:26, stained:24, clear:11<br>calm_surface:27, none:24, low_light_surface:10, clear_subtle:7, heat_finesse:3 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 89/1776 (5%) | 58/888 (6.5%) | 31/888 (3.5%) | 58 | 31 | 0.5x | 70/19 | versatile_search | wind_reaction, open_water_search, warming_search | baitfish, crawfish | breezy:61, calm:11, slight:11, windy:6 | closed:69, caution:11, open:9 | dirty_vibration:30, breezy_windy_stained_reaction:24, cold_slow_or_front:13, warming_search:9<br>dirty:39, stained:34, clear:16<br>wind_reaction:67, dirty_vibration:57, open_water_search:26, cold_slow:18, low_light_surface:11 |
| Ned Rig<br>ned_rig | lure | 5/1776 (0.3%) | 5/888 (0.6%) | 0/888 (0%) | 5 | 0 | 0x | 1/4 | reliable_action | clear_subtle, cold_slow, heat_finesse | leech_worm, crawfish | calm:2, slight:2, breezy:1 | closed:5 | unclassified:2, cold_slow_or_front:1, heat_limited_finesse:1, warming_search:1<br>dirty:3, clear:2<br>none:2, clear_subtle:1, cold_slow:1, current_swing:1, heat_finesse:1 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 66/1776 (3.7%) | 59/888 (6.6%) | 7/888 (0.8%) | 59 | 7 | 0.1x | 45/21 | reliable_action, versatile_search | open_water_search, warming_search | baitfish, bluegill_perch | calm:32, slight:29, breezy:5 | closed:26, open:23, caution:17 | unclassified:19, stable_pleasant_high_confidence:17, cold_slow_or_front:15, warming_search:9<br>dirty:28, stained:22, clear:16<br>none:25, calm_surface:21, low_light_surface:11, warming_search:9, cold_slow:5 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 13/1776 (0.7%) | 11/888 (1.2%) | 2/888 (0.2%) | 11 | 2 | 0.2x | 5/8 | reliable_action | clear_subtle, cold_slow, heat_finesse, current_swing | leech_worm | calm:6, slight:4, breezy:3 | caution:11, closed:1, open:1 | heat_limited_finesse:4, unclassified:4, cold_slow_or_front:3, calm_bright_clear_subtle:2<br>clear:8, stained:3, dirty:2<br>clear_subtle:7, heat_finesse:5, cold_slow:4, wind_reaction:2, calm_surface:1 |
| Soft Jerkbait<br>soft_jerkbait | lure | 93/1776 (5.2%) | 90/888 (10.1%) | 3/888 (0.3%) | 90 | 3 | 0x | 55/38 | reliable_action, versatile_search | clear_subtle, open_water_search | baitfish | calm:47, slight:38, breezy:7, windy:1 | open:39, caution:37, closed:17 | unclassified:29, cold_slow_or_front:22, stable_pleasant_high_confidence:20, calm_bright_clear_subtle:11<br>clear:54, stained:25, dirty:14<br>clear_subtle:40, calm_surface:37, none:26, low_light_surface:15, cold_slow:10 |
| Spinnerbait<br>spinnerbait | lure | 83/1776 (4.7%) | 79/888 (8.9%) | 4/888 (0.5%) | 79 | 4 | 0.1x | 50/33 | reliable_action, versatile_search | wind_reaction, dirty_vibration, cover_ambush | baitfish, bluegill_perch | breezy:39, calm:21, slight:21, windy:2 | closed:35, open:28, caution:20 | dirty_vibration:26, breezy_windy_stained_reaction:15, unclassified:14, stable_pleasant_high_confidence:12<br>dirty:40, stained:33, clear:10<br>dirty_vibration:45, wind_reaction:41, low_light_surface:23, none:17, calm_surface:15 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 46/1776 (2.6%) | 33/888 (3.7%) | 13/888 (1.5%) | 33 | 13 | 0.4x | 7/39 | versatile_search | cover_ambush, dirty_vibration, wind_reaction | baitfish, bluegill_perch | breezy:19, slight:14, calm:9, windy:4 | caution:17, open:16, closed:13 | cold_slow_or_front:11, unclassified:11, dirty_vibration:9, breezy_windy_stained_reaction:6<br>dirty:24, stained:12, clear:10<br>wind_reaction:23, low_light_surface:19, dirty_vibration:17, none:13, current_swing:4 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 92/1776 (5.2%) | 59/888 (6.6%) | 33/888 (3.7%) | 59 | 33 | 0.6x | 51/41 | reliable_action, versatile_search | clear_subtle, cold_slow, wind_reaction | baitfish | calm:41, breezy:31, slight:17, windy:3 | closed:48, open:27, caution:17 | cold_slow_or_front:40, unclassified:14, stable_pleasant_high_confidence:13, calm_bright_clear_subtle:11<br>clear:58, stained:19, dirty:15<br>cold_slow:39, clear_subtle:36, wind_reaction:28, calm_surface:24, low_light_surface:11 |
| Swim Jig<br>swim_jig | lure | 36/1776 (2%) | 36/888 (4.1%) | 0/888 (0%) | 36 | 0 | 0x | 27/9 | reliable_action, versatile_search | cover_ambush, warming_search | bluegill_perch, baitfish | slight:20, calm:15, breezy:1 | caution:20, open:12, closed:4 | unclassified:14, stable_pleasant_high_confidence:9, cold_slow_or_front:6, calm_low_light_surface:4<br>dirty:19, stained:11, clear:6<br>none:14, calm_surface:12, low_light_surface:11, heat_finesse:2, cold_slow:1 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 78/1776 (4.4%) | 61/888 (6.9%) | 17/888 (1.9%) | 61 | 17 | 0.3x | 40/38 | reliable_action | cover_ambush, cold_slow, clear_subtle, heat_finesse | crawfish | slight:27, calm:26, breezy:24, windy:1 | closed:70, caution:4, open:4 | cold_slow_or_front:29, unclassified:16, warming_search:10, calm_bright_clear_subtle:5<br>clear:34, dirty:24, stained:20<br>cold_slow:32, wind_reaction:22, none:16, clear_subtle:14, warming_search:10 |
| Topwater Popper<br>popping_topwater | lure | 77/1776 (4.3%) | 62/888 (7%) | 15/888 (1.7%) | 62 | 15 | 0.2x | 21/56 | reliable_action, high_risk_high_reward | calm_surface, low_light_surface | surface_prey | calm:70, breezy:6, slight:1 | open:76, caution:1 | stable_pleasant_high_confidence:37, calm_low_light_surface:13, cold_slow_or_front:13, calm_bright_clear_subtle:8<br>stained:33, clear:23, dirty:21<br>calm_surface:70, clear_subtle:21, low_light_surface:20, cold_slow:8, dirty_vibration:7 |
| Tube Jig<br>tube_jig | lure | 7/1776 (0.4%) | 2/888 (0.2%) | 5/888 (0.6%) | 2 | 5 | 2.5x | 4/3 | reliable_action | clear_subtle, cold_slow | crawfish, baitfish | slight:5, calm:2 | closed:7 | cold_slow_or_front:4, unclassified:2, calm_bright_clear_subtle:1<br>clear:3, stained:3, dirty:1<br>cold_slow:5, none:2, clear_subtle:1 |
| Wake Bait<br>wake_bait | lure | 75/1776 (4.2%) | 11/888 (1.2%) | 64/888 (7.2%) | 11 | 64 | 5.8x | 44/31 | big_fish_upside, high_risk_high_reward | calm_surface, low_light_surface | surface_prey, baitfish, bluegill_perch | calm:52, slight:19, breezy:4 | open:56, caution:19 | stable_pleasant_high_confidence:26, unclassified:17, cold_slow_or_front:13, calm_low_light_surface:10<br>clear:27, dirty:26, stained:22<br>calm_surface:52, clear_subtle:20, low_light_surface:16, none:13, cold_slow:8 |
| Walking Bait<br>walking_topwater | lure | 56/1776 (3.2%) | 0/888 (0%) | 56/888 (6.3%) | 0 | 56 | PB-only | 34/22 | big_fish_upside, high_risk_high_reward | calm_surface, low_light_surface | surface_prey, baitfish | calm:34, slight:17, breezy:5 | open:39, caution:17 | stable_pleasant_high_confidence:24, unclassified:11, cold_slow_or_front:7, calm_bright_clear_subtle:4<br>clear:22, stained:21, dirty:13<br>calm_surface:34, clear_subtle:16, low_light_surface:15, none:7, dirty_vibration:6 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 45/1776 (2.5%) | 45/888 (5.1%) | 0/888 (0%) | 45 | 0 | 0x | 27/18 | reliable_action, versatile_search | clear_subtle, heat_finesse | leech_worm | calm:27, slight:10, breezy:4, windy:4 | open:24, closed:12, caution:9 | cold_slow_or_front:15, unclassified:9, stable_pleasant_high_confidence:7, calm_bright_clear_subtle:4<br>clear:19, stained:15, dirty:11<br>calm_surface:21, clear_subtle:16, cold_slow:9, low_light_surface:9, none:9 |

## PB Topwater Composition

| Group | Profile | BF selections | Share of BF topwater |
| --- | --- | --- | --- |
| Topwater lures | Walking Bait<br>walking_topwater | 56 | 56/248 (22.6%) |
| Topwater lures | Buzzbait<br>buzzbait | 52 | 52/248 (21%) |
| Topwater lures | Hollow-Body Frog<br>hollow_body_frog | 61 | 61/248 (24.6%) |
| Topwater lures | Wake Bait<br>wake_bait | 64 | 64/248 (25.8%) |
| Topwater lures | Topwater Popper<br>popping_topwater | 15 | 15/248 (6%) |
| Topwater flies | Bass Popper<br>popper_fly | 1 | 1/200 (0.5%) |
| Topwater flies | Deer Hair Slider<br>deer_hair_slider | 109 | 109/200 (54.5%) |
| Topwater flies | Foam Gurgler<br>foam_gurgler_fly | 2 | 2/200 (1%) |
| Topwater flies | Frog Popper<br>frog_fly | 41 | 41/200 (20.5%) |
| Topwater flies | Mouse Pattern<br>mouse_fly | 47 | 47/200 (23.5%) |

## Topwater Context Audit

| Species | Goal | Gear | Activity | Surface gate | Wind bucket | Rows | Topwater selections | Side-share in context | Scenario tags | Profiles |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| largemouth_bass | all_purpose | lure | active | closed | calm | 6 | 0 | 0/12 (0%) |  |  |
| largemouth_bass | all_purpose | lure | active | closed | breezy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4 |  |
| largemouth_bass | all_purpose | lure | active | closed | windy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4 |  |
| largemouth_bass | all_purpose | lure | active | open | breezy | 6 | 2 | 2/12 (16.7%) | low_light_surface:6, wind_reaction:6, dirty_vibration:4 | hollow_body_frog:1, popping_topwater:1 |
| largemouth_bass | all_purpose | lure | neutral | closed | calm | 30 | 0 | 0/60 (0%) | clear_subtle:10, cold_slow:6, heat_finesse:6, dirty_vibration:4 |  |
| largemouth_bass | all_purpose | lure | neutral | closed | slight | 42 | 0 | 0/84 (0%) | cold_slow:6, clear_subtle:2 |  |
| largemouth_bass | all_purpose | lure | neutral | closed | breezy | 54 | 0 | 0/108 (0%) | wind_reaction:54, dirty_vibration:36, cold_slow:24, clear_subtle:2 |  |
| largemouth_bass | all_purpose | lure | neutral | closed | windy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4, clear_subtle:2 |  |
| largemouth_bass | all_purpose | lure | neutral | open | calm | 132 | 82 | 82/264 (31.1%) | calm_surface:132, clear_subtle:44, low_light_surface:36, cold_slow:18, dirty_vibration:4 | popping_topwater:56, hollow_body_frog:14, wake_bait:11, buzzbait:1 |
| largemouth_bass | all_purpose | lure | neutral | open | breezy | 24 | 6 | 6/48 (12.5%) | low_light_surface:24, wind_reaction:24, dirty_vibration:16, cold_slow:6 | popping_topwater:5, hollow_body_frog:1 |
| largemouth_bass | all_purpose | lure | suppressed | closed | calm | 12 | 0 | 0/24 (0%) | cold_slow:6, clear_subtle:4 |  |
| largemouth_bass | all_purpose | lure | suppressed | closed | breezy | 12 | 0 | 0/24 (0%) | cold_slow:12, clear_subtle:2 |  |
| largemouth_bass | all_purpose | fly | active | closed | calm | 6 | 0 | 0/12 (0%) |  |  |
| largemouth_bass | all_purpose | fly | active | closed | breezy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4 |  |
| largemouth_bass | all_purpose | fly | active | closed | windy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4 |  |
| largemouth_bass | all_purpose | fly | active | caution | slight | 12 | 2 | 2/24 (8.3%) | low_light_surface:6 | popper_fly:2 |
| largemouth_bass | all_purpose | fly | active | open | breezy | 6 | 4 | 4/12 (33.3%) | low_light_surface:6, wind_reaction:6, dirty_vibration:4 | popper_fly:3, deer_hair_slider:1 |
| largemouth_bass | all_purpose | fly | neutral | closed | calm | 30 | 0 | 0/60 (0%) | clear_subtle:10, cold_slow:6, heat_finesse:6, dirty_vibration:4 |  |
| largemouth_bass | all_purpose | fly | neutral | closed | slight | 42 | 0 | 0/84 (0%) | cold_slow:6, clear_subtle:2 |  |
| largemouth_bass | all_purpose | fly | neutral | closed | breezy | 54 | 0 | 0/108 (0%) | wind_reaction:54, dirty_vibration:36, cold_slow:24, clear_subtle:2 |  |
| largemouth_bass | all_purpose | fly | neutral | closed | windy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4, clear_subtle:2 |  |
| largemouth_bass | all_purpose | fly | neutral | caution | slight | 72 | 9 | 9/144 (6.3%) | low_light_surface:18, clear_subtle:10, dirty_vibration:4 | foam_gurgler_fly:5, popper_fly:4 |
| largemouth_bass | all_purpose | fly | neutral | open | calm | 132 | 98 | 98/264 (37.1%) | calm_surface:132, clear_subtle:44, low_light_surface:36, cold_slow:18, dirty_vibration:4 | popper_fly:58, foam_gurgler_fly:36, deer_hair_slider:4 |
| largemouth_bass | all_purpose | fly | neutral | open | breezy | 24 | 13 | 13/48 (27.1%) | low_light_surface:24, wind_reaction:24, dirty_vibration:16, cold_slow:6 | popper_fly:7, foam_gurgler_fly:6 |
| largemouth_bass | all_purpose | fly | suppressed | closed | calm | 12 | 0 | 0/24 (0%) | cold_slow:6, clear_subtle:4 |  |
| largemouth_bass | all_purpose | fly | suppressed | closed | breezy | 12 | 0 | 0/24 (0%) | cold_slow:12, clear_subtle:2 |  |
| largemouth_bass | big_fish | lure | active | closed | calm | 6 | 0 | 0/12 (0%) |  |  |
| largemouth_bass | big_fish | lure | active | closed | breezy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4 |  |
| largemouth_bass | big_fish | lure | active | closed | windy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4 |  |
| largemouth_bass | big_fish | lure | active | caution | slight | 12 | 9 | 9/24 (37.5%) | low_light_surface:6 | buzzbait:3, hollow_body_frog:3, walking_topwater:2, wake_bait:1 |
| largemouth_bass | big_fish | lure | active | open | breezy | 6 | 9 | 9/12 (75%) | low_light_surface:6, wind_reaction:6, dirty_vibration:4 | hollow_body_frog:6, buzzbait:3 |
| largemouth_bass | big_fish | lure | neutral | closed | calm | 30 | 0 | 0/60 (0%) | clear_subtle:10, cold_slow:6, heat_finesse:6, dirty_vibration:4 |  |
| largemouth_bass | big_fish | lure | neutral | closed | slight | 42 | 0 | 0/84 (0%) | cold_slow:6, clear_subtle:2 |  |
| largemouth_bass | big_fish | lure | neutral | closed | breezy | 54 | 0 | 0/108 (0%) | wind_reaction:54, dirty_vibration:36, cold_slow:24, clear_subtle:2 |  |
| largemouth_bass | big_fish | lure | neutral | closed | windy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4, clear_subtle:2 |  |
| largemouth_bass | big_fish | lure | neutral | caution | slight | 72 | 59 | 59/144 (41%) | low_light_surface:18, clear_subtle:10, dirty_vibration:4 | wake_bait:18, buzzbait:16, walking_topwater:15, hollow_body_frog:9, popping_topwater:1 |
| largemouth_bass | big_fish | lure | neutral | caution | breezy | 18 | 12 | 12/36 (33.3%) | wind_reaction:18, cold_slow:12, dirty_vibration:12, clear_subtle:2 | buzzbait:6, hollow_body_frog:6 |
| largemouth_bass | big_fish | lure | neutral | open | calm | 132 | 132 | 132/264 (50%) | calm_surface:132, clear_subtle:44, low_light_surface:36, cold_slow:18, dirty_vibration:4 | wake_bait:41, walking_topwater:34, hollow_body_frog:31, popping_topwater:14, buzzbait:12 |
| largemouth_bass | big_fish | lure | neutral | open | breezy | 24 | 27 | 27/48 (56.3%) | low_light_surface:24, wind_reaction:24, dirty_vibration:16, cold_slow:6 | buzzbait:12, hollow_body_frog:6, walking_topwater:5, wake_bait:4 |
| largemouth_bass | big_fish | lure | suppressed | closed | calm | 12 | 0 | 0/24 (0%) | cold_slow:6, clear_subtle:4 |  |
| largemouth_bass | big_fish | lure | suppressed | closed | breezy | 12 | 0 | 0/24 (0%) | cold_slow:12, clear_subtle:2 |  |
| largemouth_bass | big_fish | fly | active | closed | calm | 6 | 0 | 0/12 (0%) |  |  |
| largemouth_bass | big_fish | fly | active | closed | breezy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4 |  |
| largemouth_bass | big_fish | fly | active | closed | windy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4 |  |
| largemouth_bass | big_fish | fly | active | caution | slight | 12 | 8 | 8/24 (33.3%) | low_light_surface:6 | deer_hair_slider:5, frog_fly:3 |
| largemouth_bass | big_fish | fly | active | open | breezy | 6 | 6 | 6/12 (50%) | low_light_surface:6, wind_reaction:6, dirty_vibration:4 | deer_hair_slider:3, frog_fly:3 |
| largemouth_bass | big_fish | fly | neutral | closed | calm | 30 | 0 | 0/60 (0%) | clear_subtle:10, cold_slow:6, heat_finesse:6, dirty_vibration:4 |  |
| largemouth_bass | big_fish | fly | neutral | closed | slight | 42 | 0 | 0/84 (0%) | cold_slow:6, clear_subtle:2 |  |
| largemouth_bass | big_fish | fly | neutral | closed | breezy | 54 | 0 | 0/108 (0%) | wind_reaction:54, dirty_vibration:36, cold_slow:24, clear_subtle:2 |  |
| largemouth_bass | big_fish | fly | neutral | closed | windy | 6 | 0 | 0/12 (0%) | wind_reaction:6, dirty_vibration:4, clear_subtle:2 |  |
| largemouth_bass | big_fish | fly | neutral | caution | slight | 72 | 40 | 40/144 (27.8%) | low_light_surface:18, clear_subtle:10, dirty_vibration:4 | deer_hair_slider:26, frog_fly:8, mouse_fly:6 |
| largemouth_bass | big_fish | fly | neutral | caution | breezy | 18 | 3 | 3/36 (8.3%) | wind_reaction:18, cold_slow:12, dirty_vibration:12, clear_subtle:2 | frog_fly:3 |
| largemouth_bass | big_fish | fly | neutral | open | calm | 132 | 122 | 122/264 (46.2%) | calm_surface:132, clear_subtle:44, low_light_surface:36, cold_slow:18, dirty_vibration:4 | deer_hair_slider:63, mouse_fly:35, frog_fly:21, foam_gurgler_fly:2, popper_fly:1 |
| largemouth_bass | big_fish | fly | neutral | open | breezy | 24 | 21 | 21/48 (43.8%) | low_light_surface:24, wind_reaction:24, dirty_vibration:16, cold_slow:6 | deer_hair_slider:12, mouse_fly:6, frog_fly:3 |
| largemouth_bass | big_fish | fly | suppressed | closed | calm | 12 | 0 | 0/24 (0%) | cold_slow:6, clear_subtle:4 |  |
| largemouth_bass | big_fish | fly | suppressed | closed | breezy | 12 | 0 | 0/24 (0%) | cold_slow:12, clear_subtle:2 |  |

## Topwater Eligibility Rate Audit

| Species | Goal | Slice | Rows | Eligible rows | Global topwater all-slot share | Eligible topwater all-slot share | Eligible lure-side topwater share | Eligible fly-side topwater share | Closed surface | Suppressed surface | High-wind surface | Heat/no-light surface | Slight wind-reaction score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| largemouth_bass | all_purpose | all | 444 | 264 | 216/1776 (12.2%) | 216/1056 (20.5%) | 90/528 (17%) | 126/528 (23.9%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | all_purpose | activity:active | 36 | 18 | 8/144 (5.6%) | 8/72 (11.1%) | 2/36 (5.6%) | 6/36 (16.7%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | all_purpose | activity:neutral | 384 | 246 | 208/1536 (13.5%) | 208/984 (21.1%) | 88/492 (17.9%) | 120/492 (24.4%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | all_purpose | activity:suppressed | 24 | 0 | 0/96 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | all_purpose | surface_gate:open | 162 | 162 | 205/648 (31.6%) | 205/648 (31.6%) | 90/324 (27.8%) | 115/324 (35.5%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | all_purpose | surface_gate:caution | 108 | 102 | 11/432 (2.5%) | 11/408 (2.7%) | 0/204 (0%) | 11/204 (5.4%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | all_purpose | surface_gate:closed | 174 | 0 | 0/696 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | all_purpose | wind:calm | 186 | 132 | 180/744 (24.2%) | 180/528 (34.1%) | 82/264 (31.1%) | 98/264 (37.1%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | all_purpose | wind:slight | 126 | 84 | 11/504 (2.2%) | 11/336 (3.3%) | 0/168 (0%) | 11/168 (6.5%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | all_purpose | wind:breezy | 120 | 48 | 25/480 (5.2%) | 25/192 (13%) | 8/96 (8.3%) | 17/96 (17.7%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | all_purpose | wind:windy | 12 | 0 | 0/48 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | big_fish | all | 444 | 264 | 448/1776 (25.2%) | 448/1056 (42.4%) | 248/528 (47%) | 200/528 (37.9%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | big_fish | activity:active | 36 | 18 | 32/144 (22.2%) | 32/72 (44.4%) | 18/36 (50%) | 14/36 (38.9%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | big_fish | activity:neutral | 384 | 246 | 416/1536 (27.1%) | 416/984 (42.3%) | 230/492 (46.7%) | 186/492 (37.8%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | big_fish | activity:suppressed | 24 | 0 | 0/96 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | big_fish | surface_gate:open | 162 | 162 | 317/648 (48.9%) | 317/648 (48.9%) | 168/324 (51.9%) | 149/324 (46%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | big_fish | surface_gate:caution | 108 | 102 | 131/432 (30.3%) | 131/408 (32.1%) | 80/204 (39.2%) | 51/204 (25%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | big_fish | surface_gate:closed | 174 | 0 | 0/696 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | big_fish | wind:calm | 186 | 132 | 254/744 (34.1%) | 254/528 (48.1%) | 132/264 (50%) | 122/264 (46.2%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | big_fish | wind:slight | 126 | 84 | 116/504 (23%) | 116/336 (34.5%) | 68/168 (40.5%) | 48/168 (28.6%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | big_fish | wind:breezy | 120 | 48 | 78/480 (16.3%) | 78/192 (40.6%) | 48/96 (50%) | 30/96 (31.3%) | 0 | 0 | 0 | 0 | 0 |
| largemouth_bass | big_fish | wind:windy | 12 | 0 | 0/48 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |

## Wind-Reaction Tag Audit

Selected rows with condition_tag:wind_reaction scoring in slight wind: 0.

| Profile | Gear | Selected | Calm | Slight | Breezy | Windy | Selected with wind score | Slight wind-score rows | Questionable? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 | watch: context-sensitive fly wind tag |
| Bunny Streamer<br>pike_bunny_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Conehead Streamer<br>conehead_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 | watch: context-sensitive fly wind tag |
| Deceiver<br>deceiver | fly | 90 | 10 | 17 | 58 | 5 | 63 | 0 |  |
| Flash Fly<br>pike_flash_fly | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Zonker Streamer<br>zonker_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 | watch: context-sensitive fly wind tag |
| Bladed Jig<br>bladed_jig | lure | 76 | 35 | 27 | 10 | 4 | 13 | 0 |  |
| Buzzbait<br>buzzbait | lure | 53 | 13 | 19 | 21 | 0 | 21 | 0 |  |
| Casting Spoon<br>casting_spoon | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Inline Spinner<br>inline_spinner | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Large Jerkbait<br>pike_jerkbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 56 | 7 | 3 | 42 | 4 | 46 | 0 |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 89 | 11 | 11 | 61 | 6 | 67 | 0 |  |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Spinnerbait<br>spinnerbait | lure | 83 | 21 | 21 | 39 | 2 | 41 | 0 |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 46 | 9 | 14 | 19 | 4 | 23 | 0 |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 92 | 41 | 17 | 31 | 3 | 28 | 0 |  |
| Weedless Spoon<br>weedless_spoon | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |

## Bass Staple Watch List

| Profile | Gear | Side share | All-purpose side share | Big-fish side share | Selected | Top/HM | Available | Finalist/repair opp | Selected/opportunity | Home selected/opp | Selected contexts |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hollow-Body Frog<br>hollow_body_frog | lure | 4.3% | 16/888 (1.8%) | 61/888 (6.9%) | 77 | 50/27 | 192 | 108 | 71.3% | 31/72 (43.1%) | big_fish:61, all_purpose:16<br>open:59, caution:18<br>calm_low_light_surface:26, stable_pleasant_high_confidence:13, unclassified:12<br>low_light_surface:46, calm_surface:45, wind_reaction:20, clear_subtle:15 |
| Bladed Jig<br>bladed_jig | lure | 4.3% | 61/888 (6.9%) | 15/888 (1.7%) | 76 | 34/42 | 888 | 619 | 12.3% | 19/184 (10.3%) | all_purpose:61, big_fish:15<br>closed:32, caution:22, open:22<br>unclassified:17, stable_pleasant_high_confidence:12, dirty_vibration:11<br>calm_surface:21, none:21, dirty_vibration:19, low_light_surface:15 |
| Spinnerbait<br>spinnerbait | lure | 4.7% | 79/888 (8.9%) | 4/888 (0.5%) | 83 | 50/33 | 888 | 581 | 14.3% | 47/208 (22.6%) | all_purpose:79, big_fish:4<br>closed:35, open:28, caution:20<br>dirty_vibration:26, breezy_windy_stained_reaction:15, unclassified:14<br>dirty_vibration:45, wind_reaction:41, low_light_surface:23, none:17 |
| Swim Jig<br>swim_jig | lure | 2% | 36/888 (4.1%) | 0/888 (0%) | 36 | 27/9 | 888 | 466 | 7.7% | 2/264 (0.8%) | all_purpose:36<br>caution:20, open:12, closed:4<br>unclassified:14, stable_pleasant_high_confidence:9, cold_slow_or_front:6<br>none:14, calm_surface:12, low_light_surface:11, heat_finesse:2 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 3.7% | 59/888 (6.6%) | 7/888 (0.8%) | 66 | 45/21 | 888 | 604 | 10.9% | 9/56 (16.1%) | all_purpose:59, big_fish:7<br>closed:26, open:23, caution:17<br>unclassified:19, stable_pleasant_high_confidence:17, cold_slow_or_front:15<br>none:25, calm_surface:21, low_light_surface:11, warming_search:9 |
| Lipless Crankbait<br>lipless_crankbait | lure | 3.2% | 51/888 (5.7%) | 5/888 (0.6%) | 56 | 45/11 | 888 | 318 | 17.6% | 47/208 (22.6%) | all_purpose:51, big_fish:5<br>closed:35, open:14, caution:7<br>dirty_vibration:24, breezy_windy_stained_reaction:21, warming_search:7<br>dirty_vibration:47, wind_reaction:46, open_water_search:16, cold_slow:14 |
| Walking Bait<br>walking_topwater | lure | 3.2% | 0/888 (0%) | 56/888 (6.3%) | 56 | 34/22 | 540 | 248 | 22.6% | 36/264 (13.6%) | big_fish:56<br>open:39, caution:17<br>stable_pleasant_high_confidence:24, unclassified:11, cold_slow_or_front:7<br>calm_surface:34, clear_subtle:16, low_light_surface:15, none:7 |
| Buzzbait<br>buzzbait | lure | 3% | 1/888 (0.1%) | 52/888 (5.9%) | 53 | 36/17 | 540 | 147 | 36.1% | 22/264 (8.3%) | big_fish:52, all_purpose:1<br>open:28, caution:25<br>calm_low_light_surface:13, unclassified:13, dirty_vibration:9<br>low_light_surface:36, wind_reaction:21, dirty_vibration:20, calm_surface:13 |
| Topwater Popper<br>popping_topwater | lure | 4.3% | 62/888 (7%) | 15/888 (1.7%) | 77 | 21/56 | 540 | 202 | 38.1% | 63/264 (23.9%) | all_purpose:62, big_fish:15<br>open:76, caution:1<br>stable_pleasant_high_confidence:37, calm_low_light_surface:13, cold_slow_or_front:13<br>calm_surface:70, clear_subtle:21, low_light_surface:20, cold_slow:8 |
| Wake Bait<br>wake_bait | lure | 4.2% | 11/888 (1.2%) | 64/888 (7.2%) | 75 | 44/31 | 384 | 211 | 35.5% | 56/228 (24.6%) | big_fish:64, all_purpose:11<br>open:56, caution:19<br>stable_pleasant_high_confidence:26, unclassified:17, cold_slow_or_front:13<br>calm_surface:52, clear_subtle:20, low_light_surface:16, none:13 |
| Bass Popper<br>popper_fly | fly | 4.2% | 74/888 (8.3%) | 1/888 (0.1%) | 75 | 48/27 | 468 | 227 | 33% | 54/228 (23.7%) | all_purpose:74, big_fish:1<br>open:69, caution:6<br>stable_pleasant_high_confidence:28, calm_low_light_surface:14, cold_slow_or_front:11<br>calm_surface:59, low_light_surface:30, clear_subtle:19, cold_slow:10 |
| Deer Hair Slider<br>deer_hair_slider | fly | 6.4% | 5/888 (0.6%) | 109/888 (12.3%) | 114 | 38/76 | 540 | 267 | 42.7% | 68/264 (25.8%) | big_fish:109, all_purpose:5<br>open:83, caution:31<br>stable_pleasant_high_confidence:33, unclassified:21, calm_low_light_surface:19<br>calm_surface:67, low_light_surface:48, clear_subtle:23, none:17 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 8% | 128/888 (14.4%) | 14/888 (1.6%) | 142 | 33/109 | 840 | 451 | 31.5% | 20/52 (38.5%) | all_purpose:128, big_fish:14<br>closed:57, caution:48, open:37<br>cold_slow_or_front:32, unclassified:31, stable_pleasant_high_confidence:20<br>wind_reaction:38, none:36, calm_surface:31, dirty_vibration:31 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 2.8% | 47/888 (5.3%) | 2/888 (0.2%) | 49 | 34/15 | 288 | 161 | 30.4% | 44/180 (24.4%) | all_purpose:47, big_fish:2<br>open:44, caution:5<br>stable_pleasant_high_confidence:20, cold_slow_or_front:9, calm_low_light_surface:7<br>calm_surface:38, low_light_surface:13, clear_subtle:12, cold_slow:6 |
| Frog Popper<br>frog_fly | fly | 2.3% | 0/888 (0%) | 41/888 (4.6%) | 41 | 21/20 | 192 | 99 | 41.4% | 15/72 (20.8%) | big_fish:41<br>open:27, caution:14<br>unclassified:11, calm_low_light_surface:9, stable_pleasant_high_confidence:9<br>calm_surface:21, low_light_surface:20, clear_subtle:9, wind_reaction:9 |

## Bass Macro-Family Utilization Diagnostics

| Macro family | Gear | Goal | Selected | All-slot share | Side-slot share | Top/HM | Profiles |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hard_jerk_crank_core | lure | all | 426 | 426/3552 (12%) | 426/1776 (24%) | 253/173 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait |
| hard_jerk_crank_core | lure | all_purpose | 240 | 240/1776 (13.5%) | 240/888 (27%) | 144/96 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait |
| hard_jerk_crank_core | lure | big_fish | 186 | 186/1776 (10.5%) | 186/888 (20.9%) | 109/77 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait |
| hard_jerk_crank_broad | lure | all | 545 | 545/3552 (15.3%) | 545/1776 (30.7%) | 315/230 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait, lipless_crankbait, flat_sided_crankbait, deep_diving_crankbait |
| hard_jerk_crank_broad | lure | all_purpose | 332 | 332/1776 (18.7%) | 332/888 (37.4%) | 193/139 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait, lipless_crankbait, flat_sided_crankbait, deep_diving_crankbait |
| hard_jerk_crank_broad | lure | big_fish | 213 | 213/1776 (12%) | 213/888 (24%) | 122/91 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait, lipless_crankbait, flat_sided_crankbait, deep_diving_crankbait |
| skirted_jig_family | lure | all | 341 | 341/3552 (9.6%) | 341/1776 (19.2%) | 124/217 | compact_flipping_jig, football_jig, finesse_jig, swim_jig, bladed_jig |
| skirted_jig_family | lure | all_purpose | 110 | 110/1776 (6.2%) | 110/888 (12.4%) | 60/50 | compact_flipping_jig, football_jig, finesse_jig, swim_jig, bladed_jig |
| skirted_jig_family | lure | big_fish | 231 | 231/1776 (13%) | 231/888 (26%) | 64/167 | compact_flipping_jig, football_jig, finesse_jig, swim_jig, bladed_jig |
| worm_plastic_family | lure | all | 305 | 305/3552 (8.6%) | 305/1776 (17.2%) | 106/199 | carolina_rigged_stick_worm, texas_rigged_soft_plastic_craw, weightless_stick_worm, shaky_head_worm, ned_rig, drop_shot_minnow, magnum_worm |
| worm_plastic_family | lure | all_purpose | 199 | 199/1776 (11.2%) | 199/888 (22.4%) | 74/125 | carolina_rigged_stick_worm, texas_rigged_soft_plastic_craw, weightless_stick_worm, shaky_head_worm, ned_rig, drop_shot_minnow, magnum_worm |
| worm_plastic_family | lure | big_fish | 106 | 106/1776 (6%) | 106/888 (11.9%) | 32/74 | carolina_rigged_stick_worm, texas_rigged_soft_plastic_craw, weightless_stick_worm, shaky_head_worm, ned_rig, drop_shot_minnow, magnum_worm |
| moving_single_hook_family | lure | all | 261 | 261/3552 (7.3%) | 261/1776 (14.7%) | 156/105 | spinnerbait, bladed_jig, swim_jig, paddle_tail_swimbait |
| moving_single_hook_family | lure | all_purpose | 235 | 235/1776 (13.2%) | 235/888 (26.5%) | 140/95 | spinnerbait, bladed_jig, swim_jig, paddle_tail_swimbait |
| moving_single_hook_family | lure | big_fish | 26 | 26/1776 (1.5%) | 26/888 (2.9%) | 16/10 | spinnerbait, bladed_jig, swim_jig, paddle_tail_swimbait |
| topwater_lure_family | lure | all | 338 | 338/3552 (9.5%) | 338/1776 (19%) | 185/153 | walking_topwater, buzzbait, popping_topwater, wake_bait, hollow_body_frog |
| topwater_lure_family | lure | all_purpose | 90 | 90/1776 (5.1%) | 90/888 (10.1%) | 28/62 | walking_topwater, buzzbait, popping_topwater, wake_bait, hollow_body_frog |
| topwater_lure_family | lure | big_fish | 248 | 248/1776 (14%) | 248/888 (27.9%) | 157/91 | walking_topwater, buzzbait, popping_topwater, wake_bait, hollow_body_frog |
| baitfish_streamers | fly | all | 905 | 905/3552 (25.5%) | 905/1776 (51%) | 539/366 | clouser_minnow, deceiver, game_changer, articulated_baitfish_streamer, unweighted_baitfish_streamer, baitfish_slider_fly, bluegill_streamer |
| baitfish_streamers | fly | all_purpose | 529 | 529/1776 (29.8%) | 529/888 (59.6%) | 279/250 | clouser_minnow, deceiver, game_changer, articulated_baitfish_streamer, unweighted_baitfish_streamer, baitfish_slider_fly, bluegill_streamer |
| baitfish_streamers | fly | big_fish | 376 | 376/1776 (21.2%) | 376/888 (42.3%) | 260/116 | clouser_minnow, deceiver, game_changer, articulated_baitfish_streamer, unweighted_baitfish_streamer, baitfish_slider_fly, bluegill_streamer |
| bugger_leech | fly | all | 400 | 400/3552 (11.3%) | 400/1776 (22.5%) | 90/310 | woolly_bugger, rabbit_strip_leech, jighead_marabou_leech, lead_eye_leech, feather_jig_leech |
| bugger_leech | fly | all_purpose | 199 | 199/1776 (11.2%) | 199/888 (22.4%) | 66/133 | woolly_bugger, rabbit_strip_leech, jighead_marabou_leech, lead_eye_leech, feather_jig_leech |
| bugger_leech | fly | big_fish | 201 | 201/1776 (11.3%) | 201/888 (22.6%) | 24/177 | woolly_bugger, rabbit_strip_leech, jighead_marabou_leech, lead_eye_leech, feather_jig_leech |
| topwater_flies | fly | all | 326 | 326/3552 (9.2%) | 326/1776 (18.4%) | 164/162 | popper_fly, deer_hair_slider, foam_gurgler_fly, frog_fly, mouse_fly |
| topwater_flies | fly | all_purpose | 126 | 126/1776 (7.1%) | 126/888 (14.2%) | 82/44 | popper_fly, deer_hair_slider, foam_gurgler_fly, frog_fly, mouse_fly |
| topwater_flies | fly | big_fish | 200 | 200/1776 (11.3%) | 200/888 (22.5%) | 82/118 | popper_fly, deer_hair_slider, foam_gurgler_fly, frog_fly, mouse_fly |
| crawfish_bluegill_specialty | fly | all | 114 | 114/3552 (3.2%) | 114/1776 (6.4%) | 73/41 | warmwater_crawfish_fly, crawfish_streamer, bluegill_streamer, warmwater_worm_fly, sculpin_streamer, muddler_sculpin, sculpzilla |
| crawfish_bluegill_specialty | fly | all_purpose | 34 | 34/1776 (1.9%) | 34/888 (3.8%) | 17/17 | warmwater_crawfish_fly, crawfish_streamer, bluegill_streamer, warmwater_worm_fly, sculpin_streamer, muddler_sculpin, sculpzilla |
| crawfish_bluegill_specialty | fly | big_fish | 80 | 80/1776 (4.5%) | 80/888 (9%) | 56/24 | warmwater_crawfish_fly, crawfish_streamer, bluegill_streamer, warmwater_worm_fly, sculpin_streamer, muddler_sculpin, sculpzilla |

## Wind Bucket Diagnostics

| Wind bucket | Goal | Rows | Share | Surface picks | Wind-reaction rows |
| --- | --- | --- | --- | --- | --- |
| calm | all | 372 | 41.9% | 434 | 0 |
| calm | all_purpose | 186 | 20.9% | 180 | 0 |
| calm | big_fish | 186 | 20.9% | 254 | 0 |
| slight | all | 252 | 28.4% | 127 | 0 |
| slight | all_purpose | 126 | 14.2% | 11 | 0 |
| slight | big_fish | 126 | 14.2% | 116 | 0 |
| breezy | all | 240 | 27% | 103 | 216 |
| breezy | all_purpose | 120 | 13.5% | 25 | 108 |
| breezy | big_fish | 120 | 13.5% | 78 | 108 |
| windy | all | 24 | 2.7% | 0 | 24 |
| windy | all_purpose | 12 | 1.4% | 0 | 12 |
| windy | big_fish | 12 | 1.4% | 0 | 12 |
| unknown | all | 0 | 0% | 0 | 0 |
| unknown | all_purpose | 0 | 0% | 0 | 0 |
| unknown | big_fish | 0 | 0% | 0 | 0 |

## Surface Gate by Goal and Wind Bucket

| Goal | Wind bucket | Surface gate | Rows | Selected surface picks |
| --- | --- | --- | --- | --- |
| all_purpose | calm | closed | 48 | 0 |
| all_purpose | calm | caution | 6 | 0 |
| all_purpose | calm | open | 132 | 180 |
| all_purpose | slight | closed | 42 | 0 |
| all_purpose | slight | caution | 84 | 11 |
| all_purpose | breezy | closed | 72 | 0 |
| all_purpose | breezy | caution | 18 | 0 |
| all_purpose | breezy | open | 30 | 25 |
| all_purpose | windy | closed | 12 | 0 |
| big_fish | calm | closed | 48 | 0 |
| big_fish | calm | caution | 6 | 0 |
| big_fish | calm | open | 132 | 254 |
| big_fish | slight | closed | 42 | 0 |
| big_fish | slight | caution | 84 | 116 |
| big_fish | breezy | closed | 72 | 0 |
| big_fish | breezy | caution | 18 | 15 |
| big_fish | breezy | open | 30 | 63 |
| big_fish | windy | closed | 12 | 0 |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

| Profile | Gear | Selected/Opp | Rate | Close opp | Far-behind opp | Available tags | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tube Jig<br>tube_jig | lure | 7/888 | 0.8% | 62 | 732 | calm_surface:264, wind_reaction:240, dirty_vibration:184, cold_slow:180, low_light_surface:180 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):25, Magnum Jerkbait (top), Football Jig (honorable):23, Soft Jerkbait (top), Carolina-Rigged Stick Worm (honorable):20, Buzzbait (top), Compact Flipping Jig (honorable):16 |

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Hollow-Body Frog<br>hollow_body_frog | lure | 77/192 | 40.1% | big_fish:61, all_purpose:16 | low_light_surface:46, calm_surface:45, wind_reaction:20, clear_subtle:15, cold_slow:13 |
| Glide Bait<br>glidebait | lure | 72/276 | 26.1% | big_fish:72 | calm_surface:40, clear_subtle:27, low_light_surface:18, cold_slow:13, none:13 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | home-window >30% severe | 28/88 | 31.8% | goal_tags:39 | AP/BF 19/44, 9/44<br>clarity clear:52, stained:20, dirty:16<br>bucket cold_slow_or_front:56, warming_search:8, breezy_windy_stained_reaction:4 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | home-window >25% overdominant | 59/208 | 28.4% | goal_tags:77 | AP/BF 40/104, 19/104<br>clarity dirty:104, stained:104<br>bucket dirty_vibration:88, breezy_windy_stained_reaction:80, unclassified:16 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | home-window >25% overdominant | 34/128 | 26.6% | goal_tags:56 | AP/BF 28/64, 6/64<br>clarity clear:100, stained:28<br>bucket cold_slow_or_front:88, calm_bright_clear_subtle:12, warming_search:12 |
| Deer Hair Slider<br>deer_hair_slider | fly | home-window >25% overdominant | 68/264 | 25.8% | goal_tags:148 | AP/BF 4/132, 64/132<br>clarity clear:88, dirty:88, stained:88<br>bucket stable_pleasant_high_confidence:104, calm_low_light_surface:72, cold_slow_or_front:40 |
| Soft Jerkbait<br>soft_jerkbait | lure | home-window >25% overdominant | 40/156 | 25.6% | goal_tags:58 | AP/BF 37/78, 3/78<br>clarity clear:156<br>bucket calm_bright_clear_subtle:44, stable_pleasant_high_confidence:28, calm_low_light_surface:24 |
| Wake Bait<br>wake_bait | lure | home-window >20% watch | 56/228 | 24.6% | goal_tags:95 | AP/BF 11/114, 45/114<br>clarity clear:76, dirty:76, stained:76<br>bucket stable_pleasant_high_confidence:92, calm_low_light_surface:60, cold_slow_or_front:36 |
| Foam Gurgler<br>foam_gurgler_fly | fly | home-window >20% watch | 44/180 | 24.4% | goal_tags:85 | AP/BF 42/90, 2/90<br>clarity clear:60, dirty:60, stained:60<br>bucket stable_pleasant_high_confidence:80, cold_slow_or_front:36, calm_bright_clear_subtle:24 |
| Topwater Popper<br>popping_topwater | lure | home-window >20% watch | 63/264 | 23.9% | goal_tags:181 | AP/BF 52/132, 11/132<br>clarity clear:88, dirty:88, stained:88<br>bucket stable_pleasant_high_confidence:104, calm_low_light_surface:72, cold_slow_or_front:40 |
| Bass Popper<br>popper_fly | fly | home-window >20% watch | 54/228 | 23.7% | goal_tags:111 | AP/BF 53/114, 1/114<br>clarity clear:76, dirty:76, stained:76<br>bucket stable_pleasant_high_confidence:92, calm_low_light_surface:60, cold_slow_or_front:36 |
| Football Jig<br>football_jig | lure | home-window >20% watch | 31/132 | 23.5% | goal_tags:74 | AP/BF 0/56, 31/76<br>clarity clear:88, stained:44<br>bucket cold_slow_or_front:80, warming_search:14, calm_bright_clear_subtle:12 |
| Lipless Crankbait<br>lipless_crankbait | lure | home-window >20% watch | 47/208 | 22.6% | goal_tags:80 | AP/BF 43/104, 4/104<br>clarity dirty:104, stained:104<br>bucket dirty_vibration:88, breezy_windy_stained_reaction:80, unclassified:16 |
| Spinnerbait<br>spinnerbait | lure | home-window >20% watch | 47/208 | 22.6% | goal_tags:66 | AP/BF 43/104, 4/104<br>clarity dirty:104, stained:104<br>bucket dirty_vibration:88, breezy_windy_stained_reaction:80, unclassified:16 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | home-window >20% watch | 42/208 | 20.2% | goal_tags:68 | AP/BF 22/104, 20/104<br>clarity clear:132, stained:76<br>bucket cold_slow_or_front:80, calm_bright_clear_subtle:32, warming_search:32 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | home-window >20% watch | 71/352 | 20.2% | goal_tags:101 | AP/BF 17/176, 54/176<br>clarity clear:220, stained:72, dirty:60<br>bucket cold_slow_or_front:160, calm_bright_clear_subtle:48, breezy_windy_stained_reaction:28 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 45/3552 (1.3%) | 20/1776 (1.1%) | 25/1776 (1.4%) | 45/1776 (2.5%) | 28/88 (31.8%) | 15/88 (17%) / 13/88 (14.8%) | home>20%<br>home>25%<br>home>30% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 89/3552 (2.5%) | 70/1776 (3.9%) | 19/1776 (1.1%) | 89/1776 (5%) | 59/208 (28.4%) | 50/208 (24%) / 9/208 (4.3%) | home>20%<br>home>25% |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 78/3552 (2.2%) | 40/1776 (2.3%) | 38/1776 (2.1%) | 78/1776 (4.4%) | 34/128 (26.6%) | 21/128 (16.4%) / 13/128 (10.2%) | home>20%<br>home>25% |
| Deer Hair Slider<br>deer_hair_slider | fly | 114/3552 (3.2%) | 38/1776 (2.1%) | 76/1776 (4.3%) | 114/1776 (6.4%) | 68/264 (25.8%) | 22/264 (8.3%) / 46/264 (17.4%) | home>20%<br>home>25% |
| Soft Jerkbait<br>soft_jerkbait | lure | 93/3552 (2.6%) | 55/1776 (3.1%) | 38/1776 (2.1%) | 93/1776 (5.2%) | 40/156 (25.6%) | 38/156 (24.4%) / 2/156 (1.3%) | home>20%<br>home>25% |
| Wake Bait<br>wake_bait | lure | 75/3552 (2.1%) | 44/1776 (2.5%) | 31/1776 (1.7%) | 75/1776 (4.2%) | 56/228 (24.6%) | 38/228 (16.7%) / 18/228 (7.9%) | home>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49/3552 (1.4%) | 34/1776 (1.9%) | 15/1776 (0.8%) | 49/1776 (2.8%) | 44/180 (24.4%) | 34/180 (18.9%) / 10/180 (5.6%) | home>20% |
| Topwater Popper<br>popping_topwater | lure | 77/3552 (2.2%) | 21/1776 (1.2%) | 56/1776 (3.2%) | 77/1776 (4.3%) | 63/264 (23.9%) | 17/264 (6.4%) / 46/264 (17.4%) | home>20% |
| Bass Popper<br>popper_fly | fly | 75/3552 (2.1%) | 48/1776 (2.7%) | 27/1776 (1.5%) | 75/1776 (4.2%) | 54/228 (23.7%) | 33/228 (14.5%) / 21/228 (9.2%) | home>20% |
| Football Jig<br>football_jig | lure | 74/3552 (2.1%) | 22/1776 (1.2%) | 52/1776 (2.9%) | 74/1776 (4.2%) | 31/132 (23.5%) | 10/132 (7.6%) / 21/132 (15.9%) | home>20% |
| Spinnerbait<br>spinnerbait | lure | 83/3552 (2.3%) | 50/1776 (2.8%) | 33/1776 (1.9%) | 83/1776 (4.7%) | 47/208 (22.6%) | 27/208 (13%) / 20/208 (9.6%) | home>20% |
| Lipless Crankbait<br>lipless_crankbait | lure | 56/3552 (1.6%) | 45/1776 (2.5%) | 11/1776 (0.6%) | 56/1776 (3.2%) | 47/208 (22.6%) | 37/208 (17.8%) / 10/208 (4.8%) | home>20% |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 92/3552 (2.6%) | 51/1776 (2.9%) | 41/1776 (2.3%) | 92/1776 (5.2%) | 42/208 (20.2%) | 22/208 (10.6%) / 20/208 (9.6%) | home>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 176/3552 (5%) | 31/1776 (1.7%) | 145/1776 (8.2%) | 176/1776 (9.9%) | 71/352 (20.2%) | 23/352 (6.5%) / 48/352 (13.6%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.67.
Average expanded finalist pool size: 3.66.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 1284.
Rows/slots with expanded finalist pool size 1: 609.
Selected-tier singleton slots expanded above 1: 675.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.30 | 3.58 | 1 | 1 | 360 | 145 |
| fly/top | 2.36 | 3.29 | 1 | 1 | 324 | 130 |
| lure/honorable | 3.18 | 4.12 | 1 | 1 | 243 | 121 |
| lure/top | 2.83 | 3.64 | 1 | 1 | 357 | 213 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1712 |
| goal_or_priority_condition | 1712 |
| credible_fallback | 97 |
| daily_lane_specialist | 31 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 2637 |
| goal_and_priority_condition | 1712 |
| credible_fallback | 407 |
| daily_lane_specialist | 133 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 287 |
| family_diversity_scarcity | 211 |
| surface_safety_scarcity | 111 |

Representative expanded singleton finalist pools:
- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__all_purpose__B lure/top: lipless_crankbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__all_purpose__B lure/honorable: spinnerbait (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__stained__all_purpose__B fly/honorable: deceiver (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B lure/top: lipless_crankbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B lure/honorable: spinnerbait (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__all_purpose__B lure/honorable: suspending_jerkbait (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__all_purpose__B fly/top: unweighted_baitfish_streamer (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B lure/top: magnum_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__clear__big_fish__B fly/honorable: unweighted_baitfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__stained__big_fish__B lure/top: glidebait (goal_or_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__stained__big_fish__B lure/honorable: flat_sided_crankbait (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__big_fish__B lure/honorable: glidebait (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-18__freshwater_lake_pond__dirty__big_fish__B fly/top: baitfish_slider_fly (credible_fallback; hard_gated_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__all_purpose__B fly/honorable: unweighted_baitfish_streamer (goal_and_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__big_fish__B lure/top: magnum_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__big_fish__B fly/top: frog_fly (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__clear__big_fish__B fly/honorable: unweighted_baitfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__all_purpose__B fly/top: popper_fly (goal_and_priority_condition; hard_gated_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__big_fish__A lure/honorable: glidebait (goal_or_priority_condition; family_diversity_scarcity)
- fl_okeechobee__2025-03-19__freshwater_lake_pond__stained__big_fish__B fly/honorable: articulated_dungeon_streamer (goal_or_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 4.43 |
| Different-presentation close candidates | 1.77 |
| Different-family close candidates | 2.67 |
| Final expanded Set B pool | 2.53 |
| Same-family/same-presentation reintroduced | 128/1776 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 184 |
| Coverage pool used | 41 |
| Average used coverage pool size | 4.90 |
| Singleton used coverage pools | 4 |
| Broad pool larger than narrowed pool | 17 |
| Broad pool same as narrowed pool | 24 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 2 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 143 |
| broad | 41 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| bladed_jig | 36 |
| spinnerbait | 35 |
| lipless_crankbait | 30 |
| medium_diving_crankbait | 29 |
| squarebill_crankbait | 25 |
| compact_flipping_jig | 18 |
| suspending_jerkbait | 16 |
| buzzbait | 12 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| compact_flipping_jig | 20 |
| bladed_jig | 5 |
| magnum_jerkbait | 5 |
| buzzbait | 3 |
| lipless_crankbait | 2 |
| squarebill_crankbait | 2 |
| blade_bait | 1 |
| medium_diving_crankbait | 1 |
| popping_topwater | 1 |
| spinnerbait | 1 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

- mn_minnetonka__2025-07-16__freshwater_lake_pond__stained__big_fish__B: Lipless Crankbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- mn_minnetonka__2025-07-16__freshwater_lake_pond__dirty__big_fish__B: Lipless Crankbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 1392 | 0 | 0 |
| caution | 864 | 142 | 172 |

Caution-gate selected surface examples:
- fl_okeechobee__2025-08-18__freshwater_lake_pond__clear__big_fish__A: lure_of_the_day:hollow_body_frog
- fl_okeechobee__2025-08-18__freshwater_lake_pond__clear__big_fish__B: lure_of_the_day:walking_topwater, fly_of_the_day:frog_fly
- fl_okeechobee__2025-08-18__freshwater_lake_pond__stained__big_fish__A: lure_of_the_day:hollow_body_frog
- fl_okeechobee__2025-08-18__freshwater_lake_pond__stained__big_fish__B: lure_of_the_day:wake_bait, honorable_fly:frog_fly
- fl_okeechobee__2025-08-18__freshwater_lake_pond__dirty__big_fish__A: lure_of_the_day:hollow_body_frog
- fl_okeechobee__2025-08-18__freshwater_lake_pond__dirty__big_fish__B: lure_of_the_day:buzzbait, honorable_fly:frog_fly
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__clear__big_fish__A: lure_of_the_day:hollow_body_frog
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__clear__big_fish__B: lure_of_the_day:buzzbait
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__A: lure_of_the_day:hollow_body_frog
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__B: honorable_fly:frog_fly

Caution-gate surface finalist examples:
- fl_okeechobee__2025-08-18__freshwater_lake_pond__clear__big_fish__A lure/top: hollow_body_frog
- fl_okeechobee__2025-08-18__freshwater_lake_pond__stained__big_fish__A lure/top: hollow_body_frog
- fl_okeechobee__2025-08-18__freshwater_lake_pond__stained__big_fish__A lure/honorable: wake_bait, walking_topwater
- fl_okeechobee__2025-08-18__freshwater_lake_pond__dirty__big_fish__A lure/top: hollow_body_frog
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__clear__big_fish__A lure/top: hollow_body_frog
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__clear__big_fish__A fly/honorable: frog_fly
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__A lure/top: hollow_body_frog
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__A lure/honorable: buzzbait
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__stained__big_fish__B lure/honorable: buzzbait
- tx_sam_rayburn__2025-05-10__freshwater_lake_pond__dirty__big_fish__A lure/top: hollow_body_frog

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frog Popper<br>frog_fly | fly | largemouth_bass, northern_pike | fly_frog | surface_fly_frog_mouse | surface<br>slow/medium | 2: surface_prey, bluegill_perch | 3: clear, stained, dirty | 3: calm_surface, low_light_surface, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 10 |
| Bladed Jig<br>bladed_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | bladed_jig | spinner_vibration | mid<br>medium/fast | 2: baitfish, bluegill_perch | 2: stained, dirty | 4: wind_reaction, dirty_vibration, cover_ambush, warming_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 10 |
| Hollow-Body Frog<br>hollow_body_frog | lure | largemouth_bass, northern_pike | surface_frog | topwater_frog | surface<br>slow/medium | 2: surface_prey, bluegill_perch | 3: clear, stained, dirty | 3: calm_surface, low_light_surface, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 10 |
| Foam Gurgler<br>foam_gurgler_fly | fly | largemouth_bass, smallmouth_bass, northern_pike | fly_gurgler | surface_fly_gurgler | surface<br>medium/slow | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 9 |
| Buzzbait<br>buzzbait | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_buzz | topwater_open | surface<br>fast/medium | 2: surface_prey, baitfish | 2: stained, dirty | 3: low_light_surface, wind_reaction, dirty_vibration | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 9 |
| Glide Bait<br>glidebait | lure | largemouth_bass, smallmouth_bass | hard_swimbait | glidebait | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: clear, stained | 3: clear_subtle, open_water_search, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 9 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | largemouth_bass, smallmouth_bass | crankbait_medium | crankbait | mid<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | largemouth_bass, smallmouth_bass, northern_pike | swimbait | swimbait | mid<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Shaky-Head Worm<br>shaky_head_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 4: clear_subtle, cold_slow, heat_finesse, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Spinnerbait<br>spinnerbait | lure | largemouth_bass, smallmouth_bass, northern_pike | safety_pin_spinner | spinner_vibration | mid<br>medium/slow | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, dirty_vibration, cover_ambush | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | largemouth_bass, smallmouth_bass | soft_plastic_craw | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 4: cover_ambush, cold_slow, clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Wake Bait<br>wake_bait | lure | largemouth_bass, smallmouth_bass | surface_wake | topwater_open | surface<br>slow/medium | 3: surface_prey, baitfish, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 9 |
| Baitfish Slider<br>baitfish_slider_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_slider | baitfish_slider | upper<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Bass Popper<br>popper_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_popper | surface_fly_popper_slider | surface<br>medium/slow | 2: surface_prey, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 8 |
| Deer Hair Slider<br>deer_hair_slider | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_slider | surface_fly_slider | surface<br>medium/fast | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | true | 8 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 3: cold_slow, open_water_search, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | largemouth_bass, smallmouth_bass, trout | soft_plastic_worm | worm_finesse | bottom<br>slow | 2: leech_worm, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 2: reliable_action, versatile_search | freshwater_lake_pond | false | 8 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_deep | crankbait | bottom<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 2: open_water_search, cold_slow | 1: versatile_search | freshwater_lake_pond | false | 8 |
| Finesse Jig<br>finesse_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, leech_worm | 2: clear, stained | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | largemouth_bass, smallmouth_bass | jerkbait | jerkbait | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, open_water_search | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Magnum Worm<br>magnum_worm | lure | largemouth_bass | soft_plastic_worm | worm_power | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cover_ambush, heat_finesse | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 8 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium/fast | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: cover_ambush, dirty_vibration, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | largemouth_bass, smallmouth_bass, trout | jerkbait | jerkbait | mid<br>medium | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, wind_reaction | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Swim Jig<br>swim_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_swimming | swim_jig | mid<br>medium/fast | 2: bluegill_perch, baitfish | 2: stained, dirty | 2: cover_ambush, warming_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Walking Bait<br>walking_topwater | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_walking | topwater_open | surface<br>medium | 2: surface_prey, baitfish | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 8 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | upper<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: clear_subtle, heat_finesse | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bluegill Streamer<br>bluegill_streamer | fly | largemouth_bass | bluegill_streamer | baitfish_streamer | mid<br>slow/medium | 2: bluegill_perch, baitfish | 2: clear, stained | 2: cover_ambush, warming_search | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | largemouth_bass, smallmouth_bass | crawfish_fly | crawfish_fly | bottom<br>slow/medium | 1: crawfish | 3: clear, stained, dirty | 2: cover_ambush, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Deceiver<br>deceiver | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_baitfish | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, clear_subtle | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Marabou Jig Leech<br>feather_jig_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: warming_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Mouse Pattern<br>mouse_fly | fly | largemouth_bass, smallmouth_bass, trout | fly_mouse | surface_fly_frog_mouse | surface<br>slow/medium | 1: surface_prey | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_unweighted | baitfish_streamer | upper<br>medium/slow | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Woolly Bugger<br>woolly_bugger | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | bugger_streamer | leech_bugger | mid<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | largemouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, bluegill_perch | 2: stained, dirty | 2: cover_ambush, dirty_vibration | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | largemouth_bass, smallmouth_bass, trout | soft_plastic_minnow | drop_shot_minnow | mid<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Football Jig<br>football_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: cold_slow, cover_ambush | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Soft Jerkbait<br>soft_jerkbait | lure | largemouth_bass, smallmouth_bass, northern_pike | jerkbait_soft | jerkbait | upper<br>medium/slow | 1: baitfish | 2: clear, stained | 2: clear_subtle, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Topwater Popper<br>popping_topwater | lure | largemouth_bass, smallmouth_bass | surface_popper | topwater_open | surface<br>medium/slow | 1: surface_prey | 2: clear, stained | 2: calm_surface, low_light_surface | 2: reliable_action, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 7 |
| Tube Jig<br>tube_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | tube_jig | ned_tube_finesse | bottom<br>slow/medium | 2: crawfish, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium | 1: baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 6 |
| Lipless Crankbait<br>lipless_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_lipless | crankbait | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 7 | 159/888 | 12/56 | goal_tags>1<br>versatile_search+big_fish_upside |
| Baitfish Slider<br>baitfish_slider_fly | fly | 8 | 142/840 | 20/52 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Bass Popper<br>popper_fly | fly | 8 | 75/468 | 54/228 | goal_tags>1<br>home-window share>20% |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 164/888 | 12/56 | goal_tags>1 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 45/204 | 28/88 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Deceiver<br>deceiver | fly | 7 | 90/888 | 8/56 | clear+stained+dirty clarity |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 114/540 | 68/264 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 100/504 | 0/0 | goal_tags>1 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 49/288 | 44/180 | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Frog Popper<br>frog_fly | fly | 10 | 41/192 | 15/72 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Game Changer<br>game_changer | fly | 7 | 178/888 | 14/56 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 7 | 93/888 | 0/0 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 66/888 | 0/0 | clear+stained+dirty clarity |
| Marabou Jig Leech<br>feather_jig_leech | fly | 7 | 21/888 | 0/0 | clear+stained+dirty clarity |
| Mouse Pattern<br>mouse_fly | fly | 7 | 47/324 | 0/0 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 176/888 | 71/352 | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 44/888 | 35/312 | clear+stained+dirty clarity |
| Blade Bait<br>blade_bait | lure | 8 | 19/888 | 0/0 | clear+stained+dirty clarity |
| Bladed Jig<br>bladed_jig | lure | 10 | 76/888 | 19/184 | condition_tags>3<br>goal_tags>1<br>wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Buzzbait<br>buzzbait | lure | 9 | 53/540 | 22/264 | goal_tags>1<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 57/840 | 45/328 | goal_tags>1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 23/840 | 4/184 | clear+stained+dirty clarity |
| Football Jig<br>football_jig | lure | 7 | 74/360 | 31/132 | clear+stained+dirty clarity<br>home-window share>20% |
| Glide Bait<br>glidebait | lure | 9 | 72/276 | 0/0 | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Hollow-Body Frog<br>hollow_body_frog | lure | 10 | 77/192 | 31/72 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Lipless Crankbait<br>lipless_crankbait | lure | 6 | 56/888 | 47/208 | home-window share>20% |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 8 | 106/552 | 0/0 | goal_tags>1 |
| Magnum Worm<br>magnum_worm | lure | 8 | 61/336 | 0/0 | clear+stained+dirty clarity<br>goal_tags>1 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 9 | 89/888 | 59/208 | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20%<br>home-window share>25% overdominant |
| Ned Rig<br>ned_rig | lure | 9 | 5/396 | 2/160 | clear+stained+dirty clarity |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 9 | 66/888 | 9/56 | clear+stained+dirty clarity<br>goal_tags>1<br>open_water+warming+versatile |
| Shaky-Head Worm<br>shaky_head_worm | lure | 9 | 13/672 | 11/240 | condition_tags>3<br>clear+stained+dirty clarity |
| Soft Jerkbait<br>soft_jerkbait | lure | 7 | 93/840 | 40/156 | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant |
| Spinnerbait<br>spinnerbait | lure | 9 | 83/888 | 47/208 | goal_tags>1<br>wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity<br>home-window share>20% |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 46/840 | 19/200 | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 92/888 | 42/208 | goal_tags>1<br>home-window share>20% |
| Swim Jig<br>swim_jig | lure | 8 | 36/888 | 2/264 | goal_tags>1 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 78/396 | 34/128 | condition_tags>3<br>clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Topwater Popper<br>popping_topwater | lure | 7 | 77/540 | 63/264 | goal_tags>1<br>home-window share>20% |
| Wake Bait<br>wake_bait | lure | 9 | 75/384 | 56/228 | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Walking Bait<br>walking_topwater | lure | 8 | 56/540 | 36/264 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 45/288 | 16/52 | clear+stained+dirty clarity<br>goal_tags>1 |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 7 | 178/888 (20%) | 14/56 (25%) | big_fish:125, all_purpose:53 | top:135, honorable:43 | calm_surface:49, none:47, wind_reaction:41, clear_subtle:35, low_light_surface:33 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 176/888 (19.8%) | 71/352 (20.2%) | big_fish:159, all_purpose:17 | honorable:145, top:31 | wind_reaction:64, cold_slow:62, dirty_vibration:61, none:54, calm_surface:22 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 164/888 (18.5%) | 12/56 (21.4%) | all_purpose:162, big_fish:2 | top:104, honorable:60 | calm_surface:45, none:37, wind_reaction:36, low_light_surface:35, clear_subtle:29 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 7 | 159/888 (17.9%) | 12/56 (21.4%) | big_fish:122, all_purpose:37 | top:115, honorable:44 | none:48, calm_surface:35, wind_reaction:32, dirty_vibration:31, low_light_surface:31 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 7 | 150/888 (16.9%) | 29/148 (19.6%) | big_fish:142, all_purpose:8 | honorable:113, top:37 | wind_reaction:58, dirty_vibration:53, none:37, low_light_surface:25, calm_surface:24 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 8 | 142/840 (16.9%) | 20/52 (38.5%) | all_purpose:128, big_fish:14 | honorable:109, top:33 | wind_reaction:38, none:36, calm_surface:31, dirty_vibration:31, low_light_surface:24 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 114/540 (21.1%) | 68/264 (25.8%) | big_fish:109, all_purpose:5 | honorable:76, top:38 | calm_surface:67, low_light_surface:48, clear_subtle:23, none:17, wind_reaction:16 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 8 | 106/552 (19.2%) | 0/0 | big_fish:106 | top:70, honorable:36 | cold_slow:39, wind_reaction:37, dirty_vibration:23, none:23, calm_surface:19 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 7 | 103/840 (12.3%) | 8/52 (15.4%) | all_purpose:82, big_fish:21 | honorable:67, top:36 | clear_subtle:52, calm_surface:34, wind_reaction:25, low_light_surface:18, none:17 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 100/504 (19.8%) | 0/0 | big_fish:100 | top:75, honorable:25 | wind_reaction:41, cold_slow:31, dirty_vibration:26, calm_surface:19, none:17 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 7 | 93/888 (10.5%) | 0/0 | all_purpose:74, big_fish:19 | honorable:82, top:11 | cold_slow:49, wind_reaction:46, dirty_vibration:34, none:17, low_light_surface:13 |
| Soft Jerkbait<br>soft_jerkbait | lure | 7 | 93/840 (11.1%) | 40/156 (25.6%) | all_purpose:90, big_fish:3 | top:55, honorable:38 | clear_subtle:40, calm_surface:37, none:26, low_light_surface:15, cold_slow:10 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 92/888 (10.4%) | 42/208 (20.2%) | all_purpose:59, big_fish:33 | top:51, honorable:41 | cold_slow:39, clear_subtle:36, wind_reaction:28, calm_surface:24, low_light_surface:11 |
| Deceiver<br>deceiver | fly | 7 | 90/888 (10.1%) | 8/56 (14.3%) | all_purpose:67, big_fish:23 | top:63, honorable:27 | wind_reaction:63, dirty_vibration:45, low_light_surface:23, cold_slow:19, open_water_search:18 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 9 | 89/888 (10%) | 59/208 (28.4%) | all_purpose:58, big_fish:31 | top:70, honorable:19 | wind_reaction:67, dirty_vibration:57, open_water_search:26, cold_slow:18, low_light_surface:11 |
| Spinnerbait<br>spinnerbait | lure | 9 | 83/888 (9.3%) | 47/208 (22.6%) | all_purpose:79, big_fish:4 | top:50, honorable:33 | dirty_vibration:45, wind_reaction:41, low_light_surface:23, none:17, calm_surface:15 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 78/396 (19.7%) | 34/128 (26.6%) | all_purpose:61, big_fish:17 | top:40, honorable:38 | cold_slow:32, wind_reaction:22, none:16, clear_subtle:14, warming_search:10 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 10 | 77/192 (40.1%) | 31/72 (43.1%) | big_fish:61, all_purpose:16 | top:50, honorable:27 | low_light_surface:46, calm_surface:45, wind_reaction:20, clear_subtle:15, cold_slow:13 |
| Topwater Popper<br>popping_topwater | lure | 7 | 77/540 (14.3%) | 63/264 (23.9%) | all_purpose:62, big_fish:15 | honorable:56, top:21 | calm_surface:70, clear_subtle:21, low_light_surface:20, cold_slow:8, dirty_vibration:7 |
| Bladed Jig<br>bladed_jig | lure | 10 | 76/888 (8.6%) | 19/184 (10.3%) | all_purpose:61, big_fish:15 | honorable:42, top:34 | calm_surface:21, none:21, dirty_vibration:19, low_light_surface:15, warming_search:13 |
| Wake Bait<br>wake_bait | lure | 9 | 75/384 (19.5%) | 56/228 (24.6%) | big_fish:64, all_purpose:11 | top:44, honorable:31 | calm_surface:52, clear_subtle:20, low_light_surface:16, none:13, cold_slow:8 |
| Bass Popper<br>popper_fly | fly | 8 | 75/468 (16%) | 54/228 (23.7%) | all_purpose:74, big_fish:1 | top:48, honorable:27 | calm_surface:59, low_light_surface:30, clear_subtle:19, cold_slow:10, wind_reaction:10 |
| Football Jig<br>football_jig | lure | 7 | 74/360 (20.6%) | 31/132 (23.5%) | big_fish:74 | honorable:52, top:22 | wind_reaction:36, dirty_vibration:22, cold_slow:18, none:18, open_water_search:9 |
| Glide Bait<br>glidebait | lure | 9 | 72/276 (26.1%) | 0/0 | big_fish:72 | top:56, honorable:16 | calm_surface:40, clear_subtle:27, low_light_surface:18, cold_slow:13, none:13 |
| Bluegill Streamer<br>bluegill_streamer | fly | 7 | 69/408 (16.9%) | 1/4 (25%) | big_fish:69 | top:53, honorable:16 | calm_surface:35, clear_subtle:18, none:16, low_light_surface:13, wind_reaction:6 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 9 | 66/888 (7.4%) | 9/56 (16.1%) | all_purpose:59, big_fish:7 | top:45, honorable:21 | none:25, calm_surface:21, low_light_surface:11, warming_search:9, cold_slow:5 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 66/888 (7.4%) | 0/0 | all_purpose:50, big_fish:16 | honorable:47, top:19 | clear_subtle:47, cold_slow:21, calm_surface:16, wind_reaction:15, low_light_surface:7 |
| Magnum Worm<br>magnum_worm | lure | 8 | 61/336 (18.2%) | 0/0 | big_fish:61 | honorable:45, top:16 | calm_surface:27, none:24, low_light_surface:10, clear_subtle:7, heat_finesse:3 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 57/840 (6.8%) | 45/328 (13.7%) | all_purpose:53, big_fish:4 | honorable:47, top:10 | cold_slow:27, clear_subtle:26, calm_surface:18, wind_reaction:18, dirty_vibration:8 |
| Walking Bait<br>walking_topwater | lure | 8 | 56/540 (10.4%) | 36/264 (13.6%) | big_fish:56 | top:34, honorable:22 | calm_surface:34, clear_subtle:16, low_light_surface:15, none:7, dirty_vibration:6 |
| Lipless Crankbait<br>lipless_crankbait | lure | 6 | 56/888 (6.3%) | 47/208 (22.6%) | all_purpose:51, big_fish:5 | top:45, honorable:11 | dirty_vibration:47, wind_reaction:46, open_water_search:16, cold_slow:14, low_light_surface:14 |
| Buzzbait<br>buzzbait | lure | 9 | 53/540 (9.8%) | 22/264 (8.3%) | big_fish:52, all_purpose:1 | top:36, honorable:17 | low_light_surface:36, wind_reaction:21, dirty_vibration:20, calm_surface:13, none:11 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 49/288 (17%) | 44/180 (24.4%) | all_purpose:47, big_fish:2 | top:34, honorable:15 | calm_surface:38, low_light_surface:13, clear_subtle:12, cold_slow:6, dirty_vibration:6 |
| Mouse Pattern<br>mouse_fly | fly | 7 | 47/324 (14.5%) | 0/0 | big_fish:47 | honorable:24, top:23 | calm_surface:35, low_light_surface:14, clear_subtle:11, wind_reaction:6, none:5 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 46/840 (5.5%) | 19/200 (9.5%) | all_purpose:33, big_fish:13 | honorable:39, top:7 | wind_reaction:23, low_light_surface:19, dirty_vibration:17, none:13, current_swing:4 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 46/888 (5.2%) | 29/160 (18.1%) | all_purpose:24, big_fish:22 | honorable:39, top:7 | clear_subtle:29, calm_surface:13, heat_finesse:12, none:8, cold_slow:6 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 45/288 (15.6%) | 16/52 (30.8%) | all_purpose:45 | top:27, honorable:18 | calm_surface:21, clear_subtle:16, cold_slow:9, low_light_surface:9, none:9 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 45/204 (22.1%) | 28/88 (31.8%) | all_purpose:34, big_fish:11 | honorable:25, top:20 | cold_slow:21, wind_reaction:12, none:10, dirty_vibration:9, clear_subtle:7 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 44/888 (5%) | 35/312 (11.2%) | all_purpose:44 | top:24, honorable:20 | cold_slow:29, wind_reaction:14, dirty_vibration:12, calm_surface:8, clear_subtle:8 |
| Frog Popper<br>frog_fly | fly | 10 | 41/192 (21.4%) | 15/72 (20.8%) | big_fish:41 | top:21, honorable:20 | calm_surface:21, low_light_surface:20, clear_subtle:9, wind_reaction:9, cold_slow:6 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 6 | 40/840 (4.8%) | 0/200 (0%) | all_purpose:28, big_fish:12 | honorable:31, top:9 | cold_slow:18, none:11, calm_surface:10, clear_subtle:6, low_light_surface:3 |
| Swim Jig<br>swim_jig | lure | 8 | 36/888 (4.1%) | 2/264 (0.8%) | all_purpose:36 | top:27, honorable:9 | none:14, calm_surface:12, low_light_surface:11, heat_finesse:2, cold_slow:1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 23/840 (2.7%) | 4/184 (2.2%) | all_purpose:13, big_fish:10 | honorable:15, top:8 | none:11, cold_slow:9, dirty_vibration:2, wind_reaction:2, calm_surface:1 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 7 | 21/888 (2.4%) | 0/0 | all_purpose:14, big_fish:7 | honorable:16, top:5 | warming_search:14, current_swing:9, dirty_vibration:6, none:4, low_light_surface:3 |
| Blade Bait<br>blade_bait | lure | 8 | 19/888 (2.1%) | 0/0 | all_purpose:17, big_fish:2 | honorable:16, top:3 | cold_slow:7, dirty_vibration:7, low_light_surface:7, none:7, current_swing:5 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 9 | 13/672 (1.9%) | 11/240 (4.6%) | all_purpose:11, big_fish:2 | honorable:8, top:5 | clear_subtle:7, heat_finesse:5, cold_slow:4, wind_reaction:2, calm_surface:1 |
| Tube Jig<br>tube_jig | lure | 7 | 7/888 (0.8%) | 0/0 | big_fish:5, all_purpose:2 | top:4, honorable:3 | cold_slow:5, none:2, clear_subtle:1 |
| Ned Rig<br>ned_rig | lure | 9 | 5/396 (1.3%) | 2/160 (1.3%) | all_purpose:5 | honorable:4, top:1 | none:2, clear_subtle:1, cold_slow:1, current_swing:1, heat_finesse:1 |
| Finesse Jig<br>finesse_jig | lure | 8 | 5/396 (1.3%) | 3/128 (2.3%) | all_purpose:5 | top:4, honorable:1 | cold_slow:2, heat_finesse:2, wind_reaction:2, clear_subtle:1 |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 178/888 (20%) | 14/56 (25%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias<br>scenario_coverage_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 176/888 (19.8%) | 71/352 (20.2%) | catalog_tag_stack<br>goal_tag_pressure | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 114/540 (21.1%) | 68/264 (25.8%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Soft Jerkbait<br>soft_jerkbait | lure | 93/840 (11.1%) | 40/156 (25.6%) | catalog_tag_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 92/888 (10.4%) | 42/208 (20.2%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 89/888 (10%) | 59/208 (28.4%) | catalog_tag_stack<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20%<br>home-window share>25% overdominant |
| Spinnerbait<br>spinnerbait | lure | 83/888 (9.3%) | 47/208 (22.6%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity<br>home-window share>20% |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 78/396 (19.7%) | 34/128 (26.6%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | condition_tags>3<br>clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Hollow-Body Frog<br>hollow_body_frog | lure | 77/192 (40.1%) | 31/72 (43.1%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias<br>acceptable_niche_concentration | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Topwater Popper<br>popping_topwater | lure | 77/540 (14.3%) | 63/264 (23.9%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Bass Popper<br>popper_fly | fly | 75/468 (16%) | 54/228 (23.7%) | catalog_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Wake Bait<br>wake_bait | lure | 75/384 (19.5%) | 56/228 (24.6%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Football Jig<br>football_jig | lure | 74/360 (20.6%) | 31/132 (23.5%) | catalog_tag_stack<br>goal_tag_pressure | clear+stained+dirty clarity<br>home-window share>20% |
| Glide Bait<br>glidebait | lure | 72/276 (26.1%) | 0/0 | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Lipless Crankbait<br>lipless_crankbait | lure | 56/888 (6.3%) | 47/208 (22.6%) | catalog_tag_stack<br>selector_direct_score_bias | home-window share>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49/288 (17%) | 44/180 (24.4%) | catalog_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 45/204 (22.1%) | 28/88 (31.8%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Frog Popper<br>frog_fly | fly | 41/192 (21.4%) | 15/72 (20.8%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 160 | 2/160 (1.3%) | Magnum Jerkbait (top), Football Jig (honorable):13, Texas-Rigged Craw (top), Suspending Jerkbait (honorable):13, Magnum Jerkbait (top), Compact Flipping Jig (honorable):10, Medium-Diving Crankbait (top), Texas-Rigged Craw (honorable):6 | selector/direct-score or overpowered competitors |
| Finesse Jig<br>finesse_jig | lure | forage 2: crawfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 128 | 3/128 (2.3%) | Magnum Jerkbait (top), Football Jig (honorable):15, Texas-Rigged Craw (top), Suspending Jerkbait (honorable):13, Suspending Jerkbait (top), Compact Flipping Jig (honorable):6, Soft Jerkbait (top), Drop-Shot Minnow (honorable):5 | selector/direct-score or overpowered competitors |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 4: cover_ambush, cold_slow, clear_subtle, heat_finesse<br>goal 1: reliable_action | 128 | 34/128 (26.6%) | Magnum Jerkbait (top), Football Jig (honorable):15, Suspending Jerkbait (top), Compact Flipping Jig (honorable):6, Soft Jerkbait (top), Drop-Shot Minnow (honorable):5, Football Jig (top), Magnum Jerkbait (honorable):4 | healthy / not underused |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | forage 2: leech_worm, baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, cold_slow<br>goal 2: reliable_action, versatile_search | 328 | 45/328 (13.7%) | Glide Bait (top), Wake Bait (honorable):13, Magnum Jerkbait (top), Football Jig (honorable):13, Weightless Stick Worm (top), Topwater Popper (honorable):12, Texas-Rigged Craw (top), Suspending Jerkbait (honorable):10 | healthy / not underused |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, heat_finesse<br>goal 1: reliable_action | 160 | 29/160 (18.1%) | Soft Jerkbait (top), Carolina-Rigged Stick Worm (honorable):15, Glide Bait (top), Wake Bait (honorable):12, Weightless Stick Worm (top), Topwater Popper (honorable):8, Magnum Jerkbait (top), Football Jig (honorable):6 | healthy / not underused |
| Spinnerbait<br>spinnerbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, dirty_vibration, cover_ambush<br>goal 2: reliable_action, versatile_search | 208 | 47/208 (22.6%) | Magnum Jerkbait (top), Compact Flipping Jig (honorable):12, Medium-Diving Crankbait (top), Football Jig (honorable):12, Buzzbait (top), Compact Flipping Jig (honorable):11, Lipless Crankbait (top), Carolina-Rigged Stick Worm (honorable):8 | healthy / not underused |
| Bladed Jig<br>bladed_jig | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 4: wind_reaction, dirty_vibration, cover_ambush, warming_search<br>goal 2: reliable_action, versatile_search | 184 | 19/184 (10.3%) | Medium-Diving Crankbait (top), Spinnerbait (honorable):16, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (top), Compact Flipping Jig (honorable):11, Spinnerbait (top), Squarebill Crankbait (honorable):11 | selector/direct-score or overpowered competitors |
| Lipless Crankbait<br>lipless_crankbait | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 1: versatile_search | 208 | 47/208 (22.6%) | Medium-Diving Crankbait (top), Spinnerbait (honorable):16, Magnum Jerkbait (top), Compact Flipping Jig (honorable):12, Medium-Diving Crankbait (top), Football Jig (honorable):12, Buzzbait (top), Compact Flipping Jig (honorable):11 | healthy / not underused |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Bass Popper (popper_fly), Foam Gurgler (foam_gurgler_fly), Frog Popper (frog_fly), Game Changer (game_changer), Glide Bait (glidebait), Hollow-Body Frog (hollow_body_frog), Rabbit-Strip Leech (rabbit_strip_leech), Soft Jerkbait (soft_jerkbait), Spinnerbait (spinnerbait), Suspending Jerkbait (suspending_jerkbait), Topwater Popper (popping_topwater), Wake Bait (wake_bait)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Bass Popper (popper_fly), Crawfish Fly (warmwater_crawfish_fly), Deer Hair Slider (deer_hair_slider), Foam Gurgler (foam_gurgler_fly), Football Jig (football_jig), Frog Popper (frog_fly), Game Changer (game_changer), Glide Bait (glidebait), Hollow-Body Frog (hollow_body_frog), Lipless Crankbait (lipless_crankbait), Medium-Diving Crankbait (medium_diving_crankbait), Rabbit-Strip Leech (rabbit_strip_leech), Soft Jerkbait (soft_jerkbait), Spinnerbait (spinnerbait), Suspending Jerkbait (suspending_jerkbait), Texas-Rigged Craw (texas_rigged_soft_plastic_craw), Topwater Popper (popping_topwater), Wake Bait (wake_bait)

### Probably selector problem, not catalog problem
Bladed Jig (bladed_jig), Finesse Jig (finesse_jig), Ned Rig (ned_rig)

## Utilization Notes / Coverage Gaps

- 1 low-use profile(s) were usually far behind winners; these may need better-fit scenarios or narrower catalog/seasonal expectations.
- 2 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Rabbit-Strip Leech, Woolly Bugger, Bass Popper, Foam Gurgler, Frog Popper, Articulated Baitfish, Clouser Minnow, Deceiver, Game Changer, Baitfish Slider, Unweighted Baitfish, Carolina-Rigged Stick Worm, Buzzbait, Topwater Popper, Walking Bait, Wake Bait, Lipless Crankbait, Spinnerbait, Suspending Jerkbait, Squarebill Crankbait, Bladed Jig, Drop-Shot Minnow, Compact Flipping Jig, Football Jig, Paddle-Tail Swimbait, Weightless Stick Worm |
| underused_home_window | Swim Jig, Shaky-Head Worm, Flat-Sided Crankbait, Deep-Diving Crankbait, Ned Rig, Finesse Jig |
| no_home_window_coverage | None |
| over-dominant | Deer Hair Slider, Crawfish Fly, Medium-Diving Crankbait, Soft Jerkbait, Texas-Rigged Craw, Hollow-Body Frog |
| probably okay niche profile | Bluegill Streamer, Worm Fly |

## LMB Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 9.9% | 176/888 | 71/352 | 176 | 71 | 20.2% | 17/176 | 54/176 | 67 | healthy | activity neutral:308, suppressed:40, active:4<br>clarity clear:220, stained:72, dirty:60<br>water freshwater_lake_pond:332, freshwater_river:20<br>bucket cold_slow_or_front:160, calm_bright_clear_subtle:48, breezy_windy_stained_reaction:28 | Deceiver (top), Jigged Marabou Leech (honorable):10, Bass Popper (top), Unweighted Baitfish (honorable):8, Clouser Minnow (top), Lead-Eye Leech (honorable):8 |
| Woolly Bugger<br>woolly_bugger | fly | 2.5% | 44/888 | 35/312 | 44 | 35 | 11.2% | 35/156 | 0/156 | 76 | healthy | activity neutral:272, suppressed:40<br>clarity clear:192, dirty:60, stained:60<br>water freshwater_lake_pond:292, freshwater_river:20<br>bucket cold_slow_or_front:120, calm_bright_clear_subtle:48, breezy_windy_stained_reaction:28 | Deceiver (top), Jigged Marabou Leech (honorable):9, Bass Popper (top), Unweighted Baitfish (honorable):8, Dungeon Streamer (top), Jigged Marabou Leech (honorable):8 |
| Deer Hair Slider<br>deer_hair_slider | fly | 6.4% | 114/540 | 68/264 | 114 | 68 | 25.8% | 4/132 | 64/132 | 70 | over-dominant | activity neutral:264<br>clarity clear:88, dirty:88, stained:88<br>water freshwater_lake_pond:252, freshwater_river:12<br>bucket stable_pleasant_high_confidence:104, calm_low_light_surface:72, cold_slow_or_front:40 | Foam Gurgler (top), Clouser Minnow (honorable):11, Bass Popper (top), Unweighted Baitfish (honorable):9, Foam Gurgler (top), Baitfish Slider (honorable):9 |
| Bass Popper<br>popper_fly | fly | 4.2% | 75/468 | 54/228 | 75 | 54 | 23.7% | 53/114 | 1/114 | 51 | healthy | activity neutral:228<br>clarity clear:76, dirty:76, stained:76<br>water freshwater_lake_pond:228<br>bucket stable_pleasant_high_confidence:92, calm_low_light_surface:60, cold_slow_or_front:36 | Deer Hair Slider (honorable), Game Changer (top):14, Deer Hair Slider (honorable), Bluegill Streamer (top):12, Foam Gurgler (top), Clouser Minnow (honorable):11 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 2.8% | 49/288 | 44/180 | 49 | 44 | 24.4% | 42/90 | 2/90 | 56 | healthy | activity neutral:180<br>clarity clear:60, dirty:60, stained:60<br>water freshwater_lake_pond:168, freshwater_river:12<br>bucket stable_pleasant_high_confidence:80, cold_slow_or_front:36, calm_bright_clear_subtle:24 | Deer Hair Slider (honorable), Game Changer (top):13, Deer Hair Slider (honorable), Bluegill Streamer (top):11, Bass Popper (top), Unweighted Baitfish (honorable):8 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 2.5% | 45/204 | 28/88 | 45 | 28 | 31.8% | 19/44 | 9/44 | 18 | over-dominant | activity neutral:60, suppressed:24, active:4<br>clarity clear:52, stained:20, dirty:16<br>water freshwater_lake_pond:68, freshwater_river:20<br>bucket cold_slow_or_front:56, warming_search:8, breezy_windy_stained_reaction:4 | Game Changer (top), Rabbit-Strip Leech (honorable):4, Clouser Minnow (honorable), Lead-Eye Leech (top):3, Clouser Minnow (top), Jigged Marabou Leech (honorable):3 |
| Frog Popper<br>frog_fly | fly | 2.3% | 41/192 | 15/72 | 41 | 15 | 20.8% | 0/36 | 15/36 | 21 | healthy | activity neutral:72<br>clarity clear:24, dirty:24, stained:24<br>water freshwater_lake_pond:72<br>bucket calm_low_light_surface:48, stable_pleasant_high_confidence:24 | Baitfish Slider (top), Clouser Minnow (honorable):4, Clouser Minnow (top), Unweighted Baitfish (honorable):3, Deer Hair Slider (honorable), Game Changer (top):3 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 9% | 159/888 | 12/56 | 159 | 12 | 21.4% | 1/28 | 11/28 | 27 | healthy | activity neutral:56<br>clarity clear:32, dirty:12, stained:12<br>water freshwater_lake_pond:56<br>bucket warming_search:36, cold_slow_or_front:20 | Game Changer (top), Baitfish Slider (honorable):5, Dungeon Streamer (top), Baitfish Slider (honorable):4, Clouser Minnow (top), Lead-Eye Leech (honorable):3 |
| Clouser Minnow<br>clouser_minnow | fly | 9.2% | 164/888 | 12/56 | 164 | 12 | 21.4% | 12/28 | 0/28 | 23 | healthy | activity neutral:56<br>clarity clear:32, dirty:12, stained:12<br>water freshwater_lake_pond:56<br>bucket warming_search:36, cold_slow_or_front:20 | Game Changer (top), Baitfish Slider (honorable):5, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):4, Dungeon Streamer (top), Baitfish Slider (honorable):4 |
| Deceiver<br>deceiver | fly | 5.1% | 90/888 | 8/56 | 90 | 8 | 14.3% | 7/28 | 1/28 | 27 | healthy | activity neutral:56<br>clarity clear:32, dirty:12, stained:12<br>water freshwater_lake_pond:56<br>bucket warming_search:36, cold_slow_or_front:20 | Game Changer (top), Baitfish Slider (honorable):5, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):4, Dungeon Streamer (top), Baitfish Slider (honorable):4 |
| Game Changer<br>game_changer | fly | 10% | 178/888 | 14/56 | 178 | 14 | 25% | 5/28 | 9/28 | 28 | healthy | activity neutral:56<br>clarity clear:32, dirty:12, stained:12<br>water freshwater_lake_pond:56<br>bucket warming_search:36, cold_slow_or_front:20 | Articulated Baitfish (top), Rabbit-Strip Leech (honorable):4, Dungeon Streamer (top), Baitfish Slider (honorable):4, Clouser Minnow (top), Lead-Eye Leech (honorable):3 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 8% | 142/840 | 20/52 | 142 | 20 | 38.5% | 11/26 | 9/26 | 14 | healthy | activity neutral:52<br>clarity clear:28, dirty:12, stained:12<br>water freshwater_lake_pond:52<br>bucket warming_search:36, cold_slow_or_front:16 | Articulated Baitfish (top), Rabbit-Strip Leech (honorable):4, Clouser Minnow (top), Marabou Jig Leech (honorable):3, Clouser Minnow (top), Unweighted Baitfish (honorable):3 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 5.8% | 103/840 | 8/52 | 103 | 8 | 15.4% | 4/26 | 4/26 | 7 | healthy | activity neutral:52<br>clarity clear:28, dirty:12, stained:12<br>water freshwater_lake_pond:52<br>bucket warming_search:36, cold_slow_or_front:16 | Game Changer (top), Baitfish Slider (honorable):5, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):4, Dungeon Streamer (top), Baitfish Slider (honorable):4 |
| Bluegill Streamer<br>bluegill_streamer | fly | 3.9% | 69/408 | 1/4 | 69 | 1 | 25% | 0/2 | 1/2 | 0 | probably okay niche profile | activity neutral:4<br>clarity clear:4<br>water freshwater_lake_pond:4<br>bucket cold_slow_or_front:4 | Clouser Minnow (honorable), Foam Gurgler (top):1, Deceiver (top), Baitfish Slider (honorable):1, Game Changer (top), Mouse Pattern (honorable):1 |
| Worm Fly<br>warmwater_worm_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 3.2% | 57/840 | 45/328 | 57 | 45 | 13.7% | 41/164 | 4/164 | 46 | healthy | activity neutral:296, suppressed:32<br>clarity clear:212, stained:116<br>water freshwater_lake_pond:328<br>bucket cold_slow_or_front:140, breezy_windy_stained_reaction:52, calm_bright_clear_subtle:48 | Glide Bait (top), Wake Bait (honorable):13, Magnum Jerkbait (top), Football Jig (honorable):13, Weightless Stick Worm (top), Topwater Popper (honorable):12 |
| Buzzbait<br>buzzbait | lure | 3% | 53/540 | 22/264 | 53 | 22 | 8.3% | 1/132 | 21/132 | 35 | healthy | activity neutral:264<br>clarity clear:88, dirty:88, stained:88<br>water freshwater_lake_pond:252, freshwater_river:12<br>bucket stable_pleasant_high_confidence:104, calm_low_light_surface:72, cold_slow_or_front:40 | Glide Bait (top), Wake Bait (honorable):12, Soft Jerkbait (top), Carolina-Rigged Stick Worm (honorable):10, Glide Bait (top), Walking Bait (honorable):9 |
| Swim Jig<br>swim_jig | lure | 2% | 36/888 | 2/264 | 36 | 2 | 0.8% | 2/132 | 0/132 | 28 | underused_home_window | activity neutral:216, active:48<br>clarity dirty:116, stained:116, clear:32<br>water freshwater_lake_pond:240, freshwater_river:24<br>bucket dirty_vibration:88, breezy_windy_stained_reaction:80, warming_search:40 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):16, Medium-Diving Crankbait (top), Spinnerbait (honorable):16, Medium-Diving Crankbait (top), Football Jig (honorable):13 |
| Topwater Popper<br>popping_topwater | lure | 4.3% | 77/540 | 63/264 | 77 | 63 | 23.9% | 52/132 | 11/132 | 37 | healthy | activity neutral:264<br>clarity clear:88, dirty:88, stained:88<br>water freshwater_lake_pond:252, freshwater_river:12<br>bucket stable_pleasant_high_confidence:104, calm_low_light_surface:72, cold_slow_or_front:40 | Glide Bait (top), Wake Bait (honorable):12, Soft Jerkbait (top), Carolina-Rigged Stick Worm (honorable):10, Glide Bait (top), Walking Bait (honorable):9 |
| Walking Bait<br>walking_topwater | lure | 3.2% | 56/540 | 36/264 | 56 | 36 | 13.6% | 0/132 | 36/132 | 77 | healthy | activity neutral:264<br>clarity clear:88, dirty:88, stained:88<br>water freshwater_lake_pond:252, freshwater_river:12<br>bucket stable_pleasant_high_confidence:104, calm_low_light_surface:72, cold_slow_or_front:40 | Glide Bait (top), Wake Bait (honorable):12, Soft Jerkbait (top), Carolina-Rigged Stick Worm (honorable):10, Wake Bait (top), Magnum Worm (honorable):9 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 0.7% | 13/672 | 11/240 | 13 | 11 | 4.6% | 10/120 | 1/120 | 19 | underused_home_window | activity neutral:216, suppressed:24<br>clarity clear:164, stained:76<br>water freshwater_lake_pond:240<br>bucket cold_slow_or_front:92, calm_bright_clear_subtle:40, breezy_windy_stained_reaction:32 | Soft Jerkbait (top), Carolina-Rigged Stick Worm (honorable):16, Glide Bait (top), Wake Bait (honorable):13, Weightless Stick Worm (top), Topwater Popper (honorable):10 |
| Wake Bait<br>wake_bait | lure | 4.2% | 75/384 | 56/228 | 75 | 56 | 24.6% | 11/114 | 45/114 | 67 | healthy | activity neutral:228<br>clarity clear:76, dirty:76, stained:76<br>water freshwater_lake_pond:228<br>bucket stable_pleasant_high_confidence:92, calm_low_light_surface:60, cold_slow_or_front:36 | Soft Jerkbait (top), Carolina-Rigged Stick Worm (honorable):10, Glide Bait (top), Walking Bait (honorable):9, Weightless Stick Worm (top), Topwater Popper (honorable):8 |
| Lipless Crankbait<br>lipless_crankbait | lure | 3.2% | 56/888 | 47/208 | 56 | 47 | 22.6% | 43/104 | 4/104 | 79 | healthy | activity neutral:160, active:48<br>clarity dirty:104, stained:104<br>water freshwater_lake_pond:184, freshwater_river:24<br>bucket dirty_vibration:88, breezy_windy_stained_reaction:80, unclassified:16 | Medium-Diving Crankbait (top), Spinnerbait (honorable):16, Magnum Jerkbait (top), Compact Flipping Jig (honorable):12, Medium-Diving Crankbait (top), Football Jig (honorable):12 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 5% | 89/888 | 59/208 | 89 | 59 | 28.4% | 40/104 | 19/104 | 98 | over-dominant | activity neutral:160, active:48<br>clarity dirty:104, stained:104<br>water freshwater_lake_pond:184, freshwater_river:24<br>bucket dirty_vibration:88, breezy_windy_stained_reaction:80, unclassified:16 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):12, Spinnerbait (top), Squarebill Crankbait (honorable):11, Buzzbait (top), Compact Flipping Jig (honorable):9 |
| Spinnerbait<br>spinnerbait | lure | 4.7% | 83/888 | 47/208 | 83 | 47 | 22.6% | 43/104 | 4/104 | 52 | healthy | activity neutral:160, active:48<br>clarity dirty:104, stained:104<br>water freshwater_lake_pond:184, freshwater_river:24<br>bucket dirty_vibration:88, breezy_windy_stained_reaction:80, unclassified:16 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):12, Medium-Diving Crankbait (top), Football Jig (honorable):12, Buzzbait (top), Compact Flipping Jig (honorable):9 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 5.2% | 92/888 | 42/208 | 92 | 42 | 20.2% | 22/104 | 20/104 | 58 | healthy | activity neutral:184, suppressed:24<br>clarity clear:132, stained:76<br>water freshwater_lake_pond:188, freshwater_river:20<br>bucket cold_slow_or_front:80, calm_bright_clear_subtle:32, warming_search:32 | Magnum Jerkbait (top), Football Jig (honorable):13, Soft Jerkbait (top), Carolina-Rigged Stick Worm (honorable):11, Glide Bait (top), Wake Bait (honorable):9 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 2.3% | 40/840 | 0/200 | 40 | 0 | 0% | 0/100 | 0/100 | 11 | underused_home_window | activity neutral:152, active:48<br>clarity dirty:100, stained:100<br>water freshwater_lake_pond:176, freshwater_river:24<br>bucket dirty_vibration:84, breezy_windy_stained_reaction:76, unclassified:16 | Medium-Diving Crankbait (top), Spinnerbait (honorable):14, Magnum Jerkbait (top), Compact Flipping Jig (honorable):12, Spinnerbait (top), Squarebill Crankbait (honorable):11 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 2.6% | 46/840 | 19/200 | 46 | 19 | 9.5% | 12/100 | 7/100 | 33 | healthy | activity neutral:152, active:48<br>clarity dirty:100, stained:100<br>water freshwater_lake_pond:176, freshwater_river:24<br>bucket dirty_vibration:84, breezy_windy_stained_reaction:76, unclassified:16 | Medium-Diving Crankbait (top), Spinnerbait (honorable):14, Magnum Jerkbait (top), Compact Flipping Jig (honorable):12, Medium-Diving Crankbait (top), Football Jig (honorable):10 |
| Bladed Jig<br>bladed_jig | lure | 4.3% | 76/888 | 19/184 | 76 | 19 | 10.3% | 8/92 | 11/92 | 54 | healthy | activity neutral:160, active:24<br>clarity dirty:92, stained:92<br>water freshwater_lake_pond:160, freshwater_river:24<br>bucket dirty_vibration:88, breezy_windy_stained_reaction:80, calm_low_light_surface:8 | Medium-Diving Crankbait (top), Spinnerbait (honorable):16, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (top), Compact Flipping Jig (honorable):11 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 1.3% | 23/840 | 4/184 | 23 | 4 | 2.2% | 1/92 | 3/92 | 18 | underused_home_window | activity neutral:136, active:48<br>clarity dirty:92, stained:92<br>water freshwater_lake_pond:184<br>bucket breezy_windy_stained_reaction:80, dirty_vibration:80, unclassified:16 | Medium-Diving Crankbait (top), Spinnerbait (honorable):15, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (top), Compact Flipping Jig (honorable):11 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 2.6% | 46/888 | 29/160 | 46 | 29 | 18.1% | 15/80 | 14/80 | 50 | healthy | activity neutral:148, suppressed:12<br>clarity clear:160<br>water freshwater_lake_pond:152, freshwater_river:8<br>bucket calm_bright_clear_subtle:48, stable_pleasant_high_confidence:28, calm_low_light_surface:24 | Soft Jerkbait (top), Carolina-Rigged Stick Worm (honorable):15, Glide Bait (top), Wake Bait (honorable):12, Weightless Stick Worm (top), Topwater Popper (honorable):8 |
| Ned Rig<br>ned_rig | lure | 0.3% | 5/396 | 2/160 | 5 | 2 | 1.3% | 2/80 | 0/80 | 15 | underused_home_window | activity neutral:144, suppressed:16<br>clarity clear:92, stained:68<br>water freshwater_lake_pond:144, freshwater_river:16<br>bucket cold_slow_or_front:84, breezy_windy_stained_reaction:36, calm_bright_clear_subtle:12 | Magnum Jerkbait (top), Football Jig (honorable):13, Magnum Jerkbait (top), Compact Flipping Jig (honorable):10, Texas-Rigged Craw (top), Suspending Jerkbait (honorable):8 |
| Soft Jerkbait<br>soft_jerkbait | lure | 5.2% | 93/840 | 40/156 | 93 | 40 | 25.6% | 37/78 | 3/78 | 40 | over-dominant | activity neutral:144, suppressed:12<br>clarity clear:156<br>water freshwater_lake_pond:148, freshwater_river:8<br>bucket calm_bright_clear_subtle:44, stable_pleasant_high_confidence:28, calm_low_light_surface:24 | Glide Bait (top), Wake Bait (honorable):12, Weightless Stick Worm (top), Topwater Popper (honorable):8, Magnum Jerkbait (top), Football Jig (honorable):6 |
| Compact Flipping Jig<br>compact_flipping_jig | lure | 8.4% | 150/888 | 29/148 | 150 | 29 | 19.6% | 0/64 | 29/84 | 8 | healthy | activity neutral:124, suppressed:16, active:8<br>clarity clear:100, stained:48<br>water freshwater_lake_pond:132, freshwater_river:16<br>bucket cold_slow_or_front:88, warming_search:18, calm_bright_clear_subtle:12 | Magnum Jerkbait (top), Football Jig (honorable):15, Texas-Rigged Craw (top), Suspending Jerkbait (honorable):8, Magnum Jerkbait (honorable), Football Jig (top):5 |
| Football Jig<br>football_jig | lure | 4.2% | 74/360 | 31/132 | 74 | 31 | 23.5% | 0/56 | 31/76 | 17 | healthy | activity neutral:108, suppressed:16, active:8<br>clarity clear:88, stained:44<br>water freshwater_lake_pond:132<br>bucket cold_slow_or_front:80, warming_search:14, calm_bright_clear_subtle:12 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):7, Suspending Jerkbait (top), Compact Flipping Jig (honorable):6, Suspending Jerkbait (honorable), Texas-Rigged Craw (top):5 |
| Finesse Jig<br>finesse_jig | lure | 0.3% | 5/396 | 3/128 | 5 | 3 | 2.3% | 3/64 | 0/64 | 12 | underused_home_window | activity neutral:108, suppressed:16, active:4<br>clarity clear:100, stained:28<br>water freshwater_lake_pond:112, freshwater_river:16<br>bucket cold_slow_or_front:88, calm_bright_clear_subtle:12, warming_search:12 | Magnum Jerkbait (top), Football Jig (honorable):15, Texas-Rigged Craw (top), Suspending Jerkbait (honorable):8, Suspending Jerkbait (top), Compact Flipping Jig (honorable):6 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 4.4% | 78/396 | 34/128 | 78 | 34 | 26.6% | 28/64 | 6/64 | 40 | over-dominant | activity neutral:108, suppressed:16, active:4<br>clarity clear:100, stained:28<br>water freshwater_lake_pond:112, freshwater_river:16<br>bucket cold_slow_or_front:88, calm_bright_clear_subtle:12, warming_search:12 | Magnum Jerkbait (top), Football Jig (honorable):15, Suspending Jerkbait (top), Compact Flipping Jig (honorable):6, Soft Jerkbait (top), Drop-Shot Minnow (honorable):5 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 4.3% | 77/192 | 31/72 | 77 | 31 | 43.1% | 12/36 | 19/36 | 26 | over-dominant | activity neutral:72<br>clarity clear:24, dirty:24, stained:24<br>water freshwater_lake_pond:72<br>bucket calm_low_light_surface:48, stable_pleasant_high_confidence:24 | Glide Bait (top), Wake Bait (honorable):3, Paddle-Tail Swimbait (top), Topwater Popper (honorable):3, Buzzbait (top), Compact Flipping Jig (honorable):2 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 3.7% | 66/888 | 9/56 | 66 | 9 | 16.1% | 2/28 | 7/28 | 29 | healthy | activity neutral:56<br>clarity clear:32, dirty:12, stained:12<br>water freshwater_lake_pond:56<br>bucket warming_search:36, cold_slow_or_front:20 | Lipless Crankbait (top), Texas-Rigged Craw (honorable):7, Medium-Diving Crankbait (top), Bladed Jig (honorable):6, Magnum Jerkbait (top), Compact Flipping Jig (honorable):4 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 2.5% | 45/288 | 16/52 | 45 | 16 | 30.8% | 16/26 | 0/26 | 11 | healthy | activity neutral:44, suppressed:8<br>clarity clear:52<br>water freshwater_lake_pond:52<br>bucket cold_slow_or_front:20, calm_bright_clear_subtle:12, calm_low_light_surface:8 | Glide Bait (top), Wake Bait (honorable):6, Glide Bait (top), Hollow-Body Frog (honorable):3, Glide Bait (honorable), Magnum Jerkbait (top):2 |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |
| score_condition_stack | 10 |
| forage_clarity_stack | 5 |
| all_purpose_goal_fit | 4 |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 | big_fish<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 140 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 140 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Sam Rayburn Reservoir<br>2025-03-28 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 194 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:largemouth_bladed_jig_all_purpose:+14<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Sam Rayburn Reservoir<br>2025-03-28 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 150 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Fork<br>2025-03-29 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 194 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:largemouth_bladed_jig_all_purpose:+14<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Jordan Lake / Piedmont reservoir<br>2025-03-22 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 194 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:largemouth_bladed_jig_all_purpose:+14<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Minnesota natural bass lake<br>2025-05-15 | big_fish<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 140 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Minnesota natural bass lake<br>2025-05-15 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 140 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Illinois / Indiana natural-lake example<br>2025-04-18 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 194 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:largemouth_bladed_jig_all_purpose:+14<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-04-04 | all_purpose<br>stained<br>freshwater_river | warming_search<br>neutral | 210 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>condition_tag:warming_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:largemouth_bladed_jig_all_purpose:+14<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-04-04 | big_fish<br>stained<br>freshwater_river | warming_search<br>neutral | 166 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>condition_tag:warming_search:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-04-04 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 210 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>condition_tag:warming_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:largemouth_bladed_jig_all_purpose:+14<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-04-04 | big_fish<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 166 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>condition_tag:warming_search:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-06-17 | all_purpose<br>stained<br>freshwater_river | river_elevated_runoff_current<br>neutral | 196 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:largemouth_bladed_jig_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:bluegill_perch:+12<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-06-17 | big_fish<br>stained<br>freshwater_river | river_elevated_runoff_current<br>neutral | 152 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>primary_forage:bluegill_perch:+12<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-06-17 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 196 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:largemouth_bladed_jig_all_purpose:+14<br>clarity_strength:dirty:+8<br>primary_forage:bluegill_perch:+12<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-09-29 | big_fish<br>stained<br>freshwater_river | calm_low_light_surface<br>neutral | 156 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-09-29 | big_fish<br>dirty<br>freshwater_river | calm_low_light_surface<br>neutral | 156 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Southwest high-desert reservoir<br>2025-04-17 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 140 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | 41/164 | 4/164 | goal_tags:122, seasonal_baseline:68, daily_condition_tags:55, forage_clarity_stack:25, selector_filtering_variety_jitter:7 | Lake Okeechobee / central FL bass lake 2025-03-18 all_purpose clear: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-03-18 all_purpose stained: lost to Flat-Sided Crankbait by -2 (selector_filtering_variety_jitter)<br>Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Finesse Jig by 0 (selector_filtering_variety_jitter) |
| Ned Rig<br>ned_rig | 2/80 | 0/80 | goal_tags:79, daily_condition_tags:29, forage_clarity_stack:24, raw_score:15, seasonal_baseline:6 | Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Finesse Jig by 0 (selector_filtering_variety_jitter)<br>Guntersville / Tennessee River reservoir 2025-03-08 all_purpose clear: lost to Medium-Diving Crankbait by 4 (forage_clarity_stack)<br>Lake Okeechobee / central FL bass lake 2025-12-12 all_purpose clear: lost to Bladed Jig by 14 (goal_tags) |
| Finesse Jig<br>finesse_jig | 3/64 | 0/64 | goal_tags:76, forage_clarity_stack:18, daily_condition_tags:14, raw_score:14, seasonal_baseline:2 | Guntersville / Tennessee River reservoir 2025-03-08 all_purpose clear: lost to Medium-Diving Crankbait by 4 (forage_clarity_stack)<br>Guntersville / Tennessee River reservoir 2025-10-20 all_purpose clear: lost to Carolina-Rigged Stick Worm by 12 (goal_tags)<br>Guntersville / Tennessee River reservoir 2025-10-20 all_purpose stained: lost to Carolina-Rigged Stick Worm by 12 (goal_tags) |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | 28/64 | 6/64 | goal_tags:56, selector_filtering_variety_jitter:21, daily_condition_tags:11, forage_clarity_stack:6 | Lake Okeechobee / central FL bass lake 2025-01-16 all_purpose clear: lost to Finesse Jig by -14 (selector_filtering_variety_jitter)<br>Guntersville / Tennessee River reservoir 2025-03-08 all_purpose clear: lost to Medium-Diving Crankbait by -10 (selector_filtering_variety_jitter)<br>Guntersville / Tennessee River reservoir 2025-10-20 all_purpose clear: lost to Carolina-Rigged Stick Worm by -2 (selector_filtering_variety_jitter) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Texas-Rigged Craw<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 184 | Finesse Jig<br>170 | -14 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Texas-Rigged Craw<br>Guntersville / Tennessee River reservoir 2025-03-08<br>all_purpose clear cold_slow_or_front | 184 | Medium-Diving Crankbait<br>174 | -10 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-18<br>all_purpose clear cold_slow_or_front | 186 | Flat-Sided Crankbait<br>184 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-03-18<br>all_purpose stained cold_slow_or_front | 170 | Flat-Sided Crankbait<br>168 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Texas-Rigged Craw<br>Guntersville / Tennessee River reservoir 2025-10-20<br>all_purpose clear calm_bright_clear_subtle | 194 | Carolina-Rigged Stick Worm<br>192 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12 |
| Texas-Rigged Craw<br>Guntersville / Tennessee River reservoir 2025-10-20<br>all_purpose stained cold_slow_or_front | 178 | Carolina-Rigged Stick Worm<br>176 | -2 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Finesse Jig<br>170 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Finesse Jig<br>170 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Finesse Jig<br>Guntersville / Tennessee River reservoir 2025-03-08<br>all_purpose clear cold_slow_or_front | 170 | Medium-Diving Crankbait<br>174 | 4 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ned Rig<br>Guntersville / Tennessee River reservoir 2025-03-08<br>all_purpose clear cold_slow_or_front | 170 | Medium-Diving Crankbait<br>174 | 4 | forage_clarity_stack | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Carolina-Rigged Stick Worm<br>Lake Okeechobee / central FL bass lake 2025-08-18<br>all_purpose clear unclassified | 176 | Suspending Jerkbait<br>186 | 10 | seasonal_baseline | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Finesse Jig<br>Guntersville / Tennessee River reservoir 2025-10-20<br>all_purpose clear calm_bright_clear_subtle | 180 | Carolina-Rigged Stick Worm<br>192 | 12 | goal_tags | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12 |
| Finesse Jig<br>Guntersville / Tennessee River reservoir 2025-10-20<br>all_purpose stained cold_slow_or_front | 164 | Carolina-Rigged Stick Worm<br>176 | 12 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| Finesse Jig<br>Lake Okeechobee / central FL bass lake 2025-12-12<br>all_purpose clear warming_search | 164 | Bladed Jig<br>178 | 14 | goal_tags | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6 | base:+100<br>condition_tag:warming_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-12-12<br>all_purpose clear warming_search | 164 | Bladed Jig<br>178 | 14 | goal_tags | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6 | base:+100<br>condition_tag:warming_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ned Rig<br>Lake Okeechobee / central FL bass lake 2025-01-16<br>all_purpose clear cold_slow_or_front | 170 | Suspending Jerkbait<br>186 | 16 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 39 |
| jitter_or_id_tiebreak | 9 |
| set_b_group_novelty | 4 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Texas-Rigged Craw<br>184 | -14 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Southern California reservoir<br>2025-02-18 all_purpose dirty<br>unclassified | B<br>honorable_lure | Ned Rig<br>152 | Texas-Rigged Craw<br>166 | -14 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:dirty:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:dirty:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Finesse Jig<br>192 | Texas-Rigged Craw<br>206 | -14 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Finesse Jig<br>170 | Texas-Rigged Craw<br>184 | -14 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |
| Lake Champlain<br>2025-04-27 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Texas-Rigged Craw<br>184 | -14 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Lake Champlain<br>2025-04-27 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Shaky-Head Worm<br>170 | Texas-Rigged Craw<br>184 | -14 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:largemouth_shaky_head_all_purpose:+18<br>clarity_strength:stained:+8 |
| Lake of the Ozarks<br>2025-02-20 big_fish clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>172 | Texas-Rigged Craw<br>182 | -10 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>daily_lane:largemouth_texas_craw_big_fish:+16<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake of the Ozarks<br>2025-02-20 all_purpose dirty<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>172 | Texas-Rigged Craw<br>182 | -10 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:dirty:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>largemouth_carolina_rig_off_window:-6<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Guntersville / Tennessee River reservoir<br>2025-03-08 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Medium-Diving Crankbait<br>174 | Texas-Rigged Craw<br>184 | -10 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Finesse Jig<br>170 | Drop-Shot Minnow<br>180 | -10 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |
| Northern California bass lake<br>2025-03-30 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Medium-Diving Crankbait<br>174 | Texas-Rigged Craw<br>184 | -10 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-05-06 all_purpose dirty<br>cold_slow_or_front | B<br>honorable_lure | Weightless Stick Worm<br>158 | Texas-Rigged Craw<br>168 | -10 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:dirty:+8<br>primary_forage:crawfish:+12 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Sam Rayburn Reservoir<br>2025-02-11 all_purpose clear<br>unclassified | B<br>lure_of_the_day | Blade Bait<br>158 | Texas-Rigged Craw<br>166 | -8 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Sam Rayburn Reservoir<br>2025-02-11 all_purpose stained<br>unclassified | B<br>lure_of_the_day | Blade Bait<br>158 | Texas-Rigged Craw<br>166 | -8 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Sam Rayburn Reservoir<br>2025-02-11 all_purpose dirty<br>unclassified | B<br>honorable_lure | Blade Bait<br>158 | Texas-Rigged Craw<br>166 | -8 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:dirty:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:dirty:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Southern California reservoir<br>2025-02-18 all_purpose stained<br>unclassified | B<br>honorable_lure | Blade Bait<br>158 | Texas-Rigged Craw<br>166 | -8 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake of the Ozarks<br>2025-02-20 big_fish stained<br>cold_slow_or_front | B<br>lure_of_the_day | Tube Jig<br>162 | Texas-Rigged Craw<br>166 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>daily_lane:largemouth_texas_craw_big_fish:+16<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Finesse Jig<br>192 | Drop-Shot Minnow<br>196 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose dirty<br>heat_limited_finesse | B<br>honorable_lure | Swim Jig<br>164 | Texas-Rigged Craw<br>168 | -4 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:dirty:+8<br>primary_forage:crawfish:+12 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-04-04 all_purpose clear<br>warming_search | B<br>lure_of_the_day | Paddle-Tail Swimbait<br>180 | Texas-Rigged Craw<br>184 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:warming_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Southwest desert bass reservoir<br>2025-08-21 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Soft Jerkbait<br>186 | Drop-Shot Minnow<br>190 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_primary_pace:medium:+10 |
| Southern California reservoir<br>2025-02-18 all_purpose clear<br>unclassified | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>164 | Texas-Rigged Craw<br>166 | -2 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>largemouth_carolina_rig_off_window:-6<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake of the Ozarks<br>2025-02-20 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>212 | Texas-Rigged Craw<br>214 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake of the Ozarks<br>2025-02-20 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>196 | Texas-Rigged Craw<br>198 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Flat-Sided Crankbait<br>184 | Carolina-Rigged Stick Worm<br>186 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-03-18 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Flat-Sided Crankbait<br>168 | Carolina-Rigged Stick Worm<br>170 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-05-06 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Tube Jig<br>182 | Texas-Rigged Craw<br>184 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Appalachian river LMB context<br>2025-05-06 big_fish clear<br>cold_slow_or_front | B<br>lure_of_the_day | Flat-Sided Crankbait<br>150 | Texas-Rigged Craw<br>152 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>daily_lane:largemouth_texas_craw_big_fish:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Appalachian river LMB context<br>2025-05-06 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Tube Jig<br>182 | Texas-Rigged Craw<br>184 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Appalachian river LMB context<br>2025-05-06 big_fish stained<br>cold_slow_or_front | B<br>honorable_lure | Flat-Sided Crankbait<br>150 | Texas-Rigged Craw<br>152 | -2 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>daily_lane:largemouth_texas_craw_big_fish:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Jordan Lake / Piedmont reservoir<br>2025-10-04 all_purpose clear<br>stable_pleasant_high_confidence | B<br>lure_of_the_day | Texas-Rigged Craw<br>178 | Drop-Shot Minnow<br>180 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>secondary_forage:crawfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6 |
| Colorado mountain-west reservoir<br>2025-10-05 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Texas-Rigged Craw<br>178 | Drop-Shot Minnow<br>180 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>secondary_forage:crawfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6 |
| Lake Champlain<br>2025-10-12 all_purpose clear<br>warming_search | B<br>lure_of_the_day | Bladed Jig<br>178 | Drop-Shot Minnow<br>180 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>secondary_forage:crawfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:warming_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Guntersville / Tennessee River reservoir<br>2025-10-20 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>192 | Texas-Rigged Craw<br>194 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12 |
| Guntersville / Tennessee River reservoir<br>2025-10-20 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>176 | Texas-Rigged Craw<br>178 | -2 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| Lake Okeechobee / central FL bass lake<br>2025-12-12 all_purpose clear<br>warming_search | B<br>lure_of_the_day | Bladed Jig<br>178 | Drop-Shot Minnow<br>180 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>secondary_forage:crawfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:warming_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Carolina-Rigged Stick Worm<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Ned Rig<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Minnesota natural bass lake<br>2025-03-20 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Suspending Jerkbait<br>166 | Texas-Rigged Craw<br>166 | 0 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:largemouth_texas_craw_all_purpose:+14<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:wind_reaction:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12 |
| Southwest desert bass reservoir<br>2025-03-25 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Finesse Jig<br>192 | Ned Rig<br>192 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Swim Jig<br>swim_jig | lure | 2/264 | 0.8% | 28 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:40, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40, big_fish / dirty / freshwater_lake_pond / dirty_vibration:40, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40 | daily_condition_tags:131, goal_tags:81, forage_clarity_stack:20, raw_score:15 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):16, Medium-Diving Crankbait (top), Spinnerbait (honorable):16, Medium-Diving Crankbait (top), Football Jig (honorable):13, Spinnerbait (top), Squarebill Crankbait (honorable):11 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 11/240 | 4.6% | 19 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28, all_purpose / clear / freshwater_lake_pond / calm_bright_clear_subtle:20, big_fish / clear / freshwater_lake_pond / calm_bright_clear_subtle:20 | goal_tags:178, forage_clarity_stack:25, daily_condition_tags:23, selector_filtering_variety_jitter:3 | Soft Jerkbait (top), Carolina-Rigged Stick Worm (honorable):16, Glide Bait (top), Wake Bait (honorable):13, Weightless Stick Worm (top), Topwater Popper (honorable):10, Magnum Jerkbait (top), Football Jig (honorable):7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 0/200 | 0% | 11 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:38, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:38, big_fish / dirty / freshwater_lake_pond / dirty_vibration:38, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:38 | goal_tags:94, daily_condition_tags:73, forage_clarity_stack:26, seasonal_baseline:4 | Medium-Diving Crankbait (top), Spinnerbait (honorable):14, Magnum Jerkbait (top), Compact Flipping Jig (honorable):12, Spinnerbait (top), Squarebill Crankbait (honorable):11, Medium-Diving Crankbait (top), Football Jig (honorable):10 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 4/184 | 2.2% | 18 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:40, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40, big_fish / dirty / freshwater_lake_pond / dirty_vibration:40, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40 | goal_tags:80, daily_condition_tags:69, seasonal_baseline:20, raw_score:8 | Medium-Diving Crankbait (top), Spinnerbait (honorable):15, Medium-Diving Crankbait (top), Football Jig (honorable):12, Magnum Jerkbait (top), Compact Flipping Jig (honorable):11, Lipless Crankbait (top), Carolina-Rigged Stick Worm (honorable):8 |
| Ned Rig<br>ned_rig | lure | 2/160 | 1.3% | 15 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:26, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:26, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:18, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:18 | goal_tags:79, daily_condition_tags:29, forage_clarity_stack:24, raw_score:15 | Magnum Jerkbait (top), Football Jig (honorable):13, Magnum Jerkbait (top), Compact Flipping Jig (honorable):10, Texas-Rigged Craw (top), Suspending Jerkbait (honorable):8, Medium-Diving Crankbait (top), Texas-Rigged Craw (honorable):6 |
| Finesse Jig<br>finesse_jig | lure | 3/128 | 2.3% | 12 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:12, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:12 | goal_tags:76, forage_clarity_stack:18, daily_condition_tags:14, raw_score:14 | Magnum Jerkbait (top), Football Jig (honorable):15, Texas-Rigged Craw (top), Suspending Jerkbait (honorable):8, Suspending Jerkbait (top), Compact Flipping Jig (honorable):6, Soft Jerkbait (top), Drop-Shot Minnow (honorable):5 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Deer Hair Slider<br>deer_hair_slider | fly | 68/264 | 25.8% | 70 | all_purpose / dirty / freshwater_lake_pond / stable_pleasant_high_confidence:20, all_purpose / stained / freshwater_lake_pond / stable_pleasant_high_confidence:20, big_fish / dirty / freshwater_lake_pond / stable_pleasant_high_confidence:20, big_fish / stained / freshwater_lake_pond / stable_pleasant_high_confidence:20 | goal_tags:148, selector_filtering_variety_jitter:42, daily_condition_tags:3, seasonal_baseline:3 | Foam Gurgler (top), Clouser Minnow (honorable):11, Bass Popper (top), Unweighted Baitfish (honorable):9, Foam Gurgler (top), Baitfish Slider (honorable):9, Clouser Minnow (top), Bass Popper (honorable):7 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 59/208 | 28.4% | 98 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:40, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40, big_fish / dirty / freshwater_lake_pond / dirty_vibration:40, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40 | goal_tags:77, selector_filtering_variety_jitter:53, raw_score:12, daily_condition_tags:7 | Magnum Jerkbait (top), Compact Flipping Jig (honorable):12, Spinnerbait (top), Squarebill Crankbait (honorable):11, Buzzbait (top), Compact Flipping Jig (honorable):9, Lipless Crankbait (top), Carolina-Rigged Stick Worm (honorable):8 |
| Soft Jerkbait<br>soft_jerkbait | lure | 40/156 | 25.6% | 40 | all_purpose / clear / freshwater_lake_pond / calm_bright_clear_subtle:22, big_fish / clear / freshwater_lake_pond / calm_bright_clear_subtle:22, all_purpose / clear / freshwater_lake_pond / stable_pleasant_high_confidence:14, big_fish / clear / freshwater_lake_pond / stable_pleasant_high_confidence:14 | goal_tags:58, selector_filtering_variety_jitter:28, daily_condition_tags:12, raw_score:10 | Glide Bait (top), Wake Bait (honorable):12, Weightless Stick Worm (top), Topwater Popper (honorable):8, Magnum Jerkbait (top), Football Jig (honorable):6, Suspending Jerkbait (top), Topwater Popper (honorable):6 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 34/128 | 26.6% | 40 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:12, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:12 | goal_tags:56, selector_filtering_variety_jitter:21, daily_condition_tags:11, forage_clarity_stack:6 | Magnum Jerkbait (top), Football Jig (honorable):15, Suspending Jerkbait (top), Compact Flipping Jig (honorable):6, Soft Jerkbait (top), Drop-Shot Minnow (honorable):5, Magnum Jerkbait (honorable), Football Jig (top):4 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 28/88 | 31.8% | 18 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:12, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:12, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:6, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:6 | goal_tags:39, daily_condition_tags:10, selector_filtering_variety_jitter:9, forage_clarity_stack:1 | Game Changer (top), Rabbit-Strip Leech (honorable):4, Clouser Minnow (honorable), Lead-Eye Leech (top):3, Clouser Minnow (top), Jigged Marabou Leech (honorable):3, Clouser Minnow (top), Lead-Eye Leech (honorable):3 |
| Hollow-Body Frog<br>hollow_body_frog | lure | 31/72 | 43.1% | 26 | all_purpose / clear / freshwater_lake_pond / calm_low_light_surface:8, all_purpose / dirty / freshwater_lake_pond / calm_low_light_surface:8, all_purpose / stained / freshwater_lake_pond / calm_low_light_surface:8, big_fish / clear / freshwater_lake_pond / calm_low_light_surface:8 | selector_filtering_variety_jitter:20, goal_tags:16, forage_clarity_stack:4, seasonal_baseline:1 | Glide Bait (top), Wake Bait (honorable):3, Paddle-Tail Swimbait (top), Topwater Popper (honorable):3, Buzzbait (top), Compact Flipping Jig (honorable):2, Paddle-Tail Swimbait (honorable), Wake Bait (top):2 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Bass Popper [fly] (39), Foam Gurgler [fly] (29), Soft Jerkbait [lure] (27), Weightless Stick Worm [lure] (18), Clouser Minnow [fly] (17) | Bass Popper [fly] (58), Topwater Popper [lure] (56), Clouser Minnow [fly] (45), Soft Jerkbait [lure] (37), Foam Gurgler [fly] (36) |
| calm_surface | big_fish | Glide Bait [lure] (30), Wake Bait [lure] (28), Game Changer [fly] (26), Deer Hair Slider [fly] (24), Walking Bait [lure] (24) | Deer Hair Slider [fly] (63), Wake Bait [lure] (41), Glide Bait [lure] (40), Game Changer [fly] (37), Bluegill Streamer [fly] (35) |
| low_light_surface | all_purpose | Bass Popper [fly] (18), Spinnerbait [lure] (16), Clouser Minnow [fly] (15), Baitfish Slider [fly] (12), Lipless Crankbait [lure] (10) | Clouser Minnow [fly] (34), Bass Popper [fly] (30), Baitfish Slider [fly] (24), Spinnerbait [lure] (22), Topwater Popper [lure] (19) |
| low_light_surface | big_fish | Buzzbait [lure] (30), Deer Hair Slider [fly] (22), Glide Bait [lure] (16), Hollow-Body Frog [lure] (16), Game Changer [fly] (13) | Deer Hair Slider [fly] (45), Buzzbait [lure] (35), Hollow-Body Frog [lure] (32), Compact Flipping Jig [lure] (25), Articulated Baitfish [fly] (24) |
| wind_reaction | all_purpose | Lipless Crankbait [lure] (36), Medium-Diving Crankbait [lure] (35), Deceiver [fly] (29), Clouser Minnow [fly] (25), Spinnerbait [lure] (18) | Lipless Crankbait [lure] (42), Medium-Diving Crankbait [lure] (42), Deceiver [fly] (40), Spinnerbait [lure] (39), Clouser Minnow [fly] (36) |
| wind_reaction | big_fish | Dungeon Streamer [fly] (30), Magnum Jerkbait [lure] (25), Game Changer [fly] (23), Medium-Diving Crankbait [lure] (21), Deceiver [fly] (20) | Rabbit-Strip Leech [fly] (54), Compact Flipping Jig [lure] (50), Dungeon Streamer [fly] (41), Magnum Jerkbait [lure] (37), Football Jig [lure] (36) |
| dirty_vibration | all_purpose | Lipless Crankbait [lure] (35), Medium-Diving Crankbait [lure] (34), Deceiver [fly] (21), Spinnerbait [lure] (21), Clouser Minnow [fly] (19) | Lipless Crankbait [lure] (43), Spinnerbait [lure] (41), Medium-Diving Crankbait [lure] (39), Deceiver [fly] (29), Clouser Minnow [fly] (28) |
| dirty_vibration | big_fish | Dungeon Streamer [fly] (22), Game Changer [fly] (17), Articulated Baitfish [fly] (16), Buzzbait [lure] (16), Deceiver [fly] (15) | Rabbit-Strip Leech [fly] (51), Compact Flipping Jig [lure] (45), Dungeon Streamer [fly] (26), Articulated Baitfish [fly] (24), Magnum Jerkbait [lure] (23) |
| clear_subtle | all_purpose | Soft Jerkbait [lure] (35), Suspending Jerkbait [lure] (16), Unweighted Baitfish [fly] (16), Clouser Minnow [fly] (13), Bass Popper [fly] (12) | Soft Jerkbait [lure] (37), Unweighted Baitfish [fly] (35), Lead-Eye Leech [fly] (31), Clouser Minnow [fly] (29), Carolina-Rigged Stick Worm [lure] (23) |
| clear_subtle | big_fish | Glide Bait [lure] (25), Game Changer [fly] (22), Magnum Jerkbait [lure] (14), Bluegill Streamer [fly] (13), Articulated Baitfish [fly] (9) | Game Changer [fly] (30), Glide Bait [lure] (27), Deer Hair Slider [fly] (23), Wake Bait [lure] (20), Bluegill Streamer [fly] (18) |
| cold_slow | all_purpose | Texas-Rigged Craw [lure] (15), Clouser Minnow [fly] (14), Woolly Bugger [fly] (14), Lipless Crankbait [lure] (12), Medium-Diving Crankbait [lure] (12) | Jigged Marabou Leech [fly] (30), Woolly Bugger [fly] (29), Texas-Rigged Craw [lure] (25), Carolina-Rigged Stick Worm [lure] (23), Clouser Minnow [fly] (22) |
| cold_slow | big_fish | Magnum Jerkbait [lure] (28), Dungeon Streamer [fly] (24), Articulated Baitfish [fly] (16), Rabbit-Strip Leech [fly] (16), Game Changer [fly] (10) | Rabbit-Strip Leech [fly] (45), Magnum Jerkbait [lure] (39), Dungeon Streamer [fly] (31), Articulated Baitfish [fly] (24), Compact Flipping Jig [lure] (21) |
| warming_search | all_purpose | Clouser Minnow [fly] (9), Medium-Diving Crankbait [lure] (8), Lipless Crankbait [lure] (6), Baitfish Slider [fly] (4), Bladed Jig [lure] (3) | Bladed Jig [lure] (11), Clouser Minnow [fly] (11), Baitfish Slider [fly] (9), Marabou Jig Leech [fly] (9), Texas-Rigged Craw [lure] (9) |
| warming_search | big_fish | Articulated Baitfish [fly] (11), Magnum Jerkbait [lure] (8), Paddle-Tail Swimbait [lure] (7), Dungeon Streamer [fly] (5), Game Changer [fly] (5) | Articulated Baitfish [fly] (12), Compact Flipping Jig [lure] (12), Football Jig [lure] (9), Magnum Jerkbait [lure] (8), Baitfish Slider [fly] (7) |
| heat_finesse | all_purpose | Articulated Baitfish [fly] (3), Clouser Minnow [fly] (3), Texas-Rigged Craw [lure] (3), Finesse Jig [lure] (2), Lead-Eye Leech [fly] (2) | Baitfish Slider [fly] (5), Clouser Minnow [fly] (5), Drop-Shot Minnow [lure] (4), Jigged Marabou Leech [fly] (4), Articulated Baitfish [fly] (3) |
| heat_finesse | big_fish | Game Changer [fly] (4), Articulated Baitfish [fly] (3), Dungeon Streamer [fly] (3), Texas-Rigged Craw [lure] (3), Bluegill Streamer [fly] (2) | Drop-Shot Minnow [lure] (8), Rabbit-Strip Leech [fly] (8), Game Changer [fly] (4), Articulated Baitfish [fly] (3), Compact Flipping Jig [lure] (3) |
| current_swing | all_purpose | Clouser Minnow [fly] (6), Spinnerbait [lure] (5), Woolly Bugger [fly] (5), Medium-Diving Crankbait [lure] (4), Bladed Jig [lure] (2) | Clouser Minnow [fly] (9), Woolly Bugger [fly] (7), Spinnerbait [lure] (6), Bladed Jig [lure] (5), Blade Bait [lure] (4) |
| current_swing | big_fish | Articulated Baitfish [fly] (5), Buzzbait [lure] (5), Game Changer [fly] (5), Deer Hair Slider [fly] (3), Magnum Jerkbait [lure] (3) | Articulated Baitfish [fly] (9), Compact Flipping Jig [lure] (8), Buzzbait [lure] (6), Deer Hair Slider [fly] (6), Game Changer [fly] (6) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Jordan Lake / Piedmont reservoir<br>2025-03-22 dirty big_fish B | 44.6-71.1F, 9.8 mph wind, 0.4% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration, high | Medium-Diving Crankbait (162); Football Jig (140); Articulated Baitfish (154); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Southwest high-desert reservoir<br>2025-04-17 dirty big_fish B | 63.5-82.5F, 21.8 mph wind, 6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration, high | Medium-Diving Crankbait (152); Football Jig (140); Articulated Baitfish (144); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Northern California bass lake<br>2025-10-25 clear big_fish A | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+cold_slow+open_water_search, high | Magnum Jerkbait (204); Buzzbait (188); Deer Hair Slider (166); Dungeon Streamer (160) | TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST, TOPWATER_SHOULDER_SEASON_REGION |
| Northern California bass lake<br>2025-10-25 dirty big_fish A | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search, high | Buzzbait (196); Magnum Jerkbait (196); Articulated Baitfish (176); Deer Hair Slider (166) | TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST, TOPWATER_SHOULDER_SEASON_REGION |
| Northern California bass lake<br>2025-10-25 stained big_fish A | 49.9-59.6F, 9.9 mph wind, 99.3% cloud, 0.1 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow+open_water_search, high | Magnum Jerkbait (204); Buzzbait (196); Articulated Baitfish (176); Deer Hair Slider (166) | TOPWATER_SHOULDER_SEASON_REGION, COLD_CLEAR_TOO_FAST, TOPWATER_SHOULDER_SEASON_REGION |
| Illinois / Indiana natural-lake example<br>2025-04-18 dirty big_fish B | 55-77.3F, 12.3 mph wind, 81.4% cloud, 1.1 in precip | neutral, closed, wind_reaction+dirty_vibration, high | Compact Flipping Jig (156); Medium-Diving Crankbait (162); Dungeon Streamer (162); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Minnesota natural bass lake<br>2025-05-15 dirty big_fish B | 60.3-76.3F, 18.2 mph wind, 86.5% cloud, 0.3 in precip | active, closed, wind_reaction+dirty_vibration, high | Bladed Jig (140); Football Jig (140); Articulated Baitfish (144); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Minnesota natural bass lake<br>2025-05-15 stained big_fish B | 60.3-76.3F, 18.2 mph wind, 86.5% cloud, 0.3 in precip | active, closed, wind_reaction+dirty_vibration, high | Squarebill Crankbait (150); Bladed Jig (140); Bluegill Streamer (140); Rabbit-Strip Leech (134) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Southwest high-desert reservoir<br>2025-04-17 stained big_fish B | 63.5-82.5F, 21.8 mph wind, 6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration, high | Squarebill Crankbait (150); Compact Flipping Jig (156); Dungeon Streamer (152); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Lake Fork<br>2025-03-29 dirty big_fish B | 60.8-80.6F, 9.6 mph wind, 56.9% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration, high | Medium-Diving Crankbait (162); Football Jig (140); Dungeon Streamer (162); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Sam Rayburn Reservoir<br>2025-03-28 dirty big_fish B | 63-72.2F, 9.3 mph wind, 97.7% cloud, 1.4 in precip | neutral, closed, wind_reaction+dirty_vibration, high | Bladed Jig (150); Football Jig (140); Articulated Baitfish (154); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Appalachian river LMB context<br>2025-04-04 stained big_fish B | 58.5-74.4F, 5.6 mph wind, 99.9% cloud, 0.3 in precip | neutral, closed, dirty_vibration+warming_search+current_swing, high | Bladed Jig (166); Squarebill Crankbait (140); Clouser Minnow (150); Marabou Jig Leech (150) | BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| WV/VA highland reservoir<br>2025-03-26 dirty big_fish B | 31.9-49F, 10.2 mph wind, 30.4% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, high | Medium-Diving Crankbait (162); Compact Flipping Jig (156); Deceiver (150); Jigged Marabou Leech (130) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-03-08 dirty big_fish B | 44-57.2F, 9 mph wind, 98.1% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, high | Medium-Diving Crankbait (162); Football Jig (156); Game Changer (154); Jigged Marabou Leech (130) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-03-08 stained big_fish B | 44-57.2F, 9 mph wind, 98.1% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, high | Suspending Jerkbait (166); Football Jig (156); Articulated Baitfish (154); Jigged Marabou Leech (130) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-04-11 clear all_purpose B | 48.7-60.9F, 9.6 mph wind, 25.8% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle+cold_slow, high | Soft Jerkbait (190); Shaky-Head Worm (186); Baitfish Slider (158); Jigged Marabou Leech (158) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-04-11 clear big_fish B | 48.7-60.9F, 9.6 mph wind, 25.8% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle+cold_slow, high | Suspending Jerkbait (172); Carolina-Rigged Stick Worm (146); Frog Popper (134); Articulated Baitfish (136) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-04-11 stained big_fish B | 48.7-60.9F, 9.6 mph wind, 25.8% cloud, 0 in precip | neutral, caution, wind_reaction+dirty_vibration+cold_slow, high | Buzzbait (144); Compact Flipping Jig (156); Deceiver (140); Jigged Marabou Leech (130) | COLD_CLEAR_TOO_FAST, BIG_FISH_NOT_FAVORING_UPSIDE |
| Guntersville / Tennessee River reservoir<br>2025-10-19 clear big_fish A | 54.1-72F, 12.4 mph wind, 33.6% cloud, 1.1 in precip | neutral, caution, wind_reaction+open_water_search, high | Magnum Jerkbait (188); Football Jig (134); Dungeon Streamer (160); Baitfish Slider (146) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Guntersville / Tennessee River reservoir<br>2025-10-19 dirty all_purpose B | 54.1-72F, 12.4 mph wind, 33.6% cloud, 1.1 in precip | neutral, caution, wind_reaction+dirty_vibration+open_water_search, high | Spinnerbait (204); Medium-Diving Crankbait (238); Clouser Minnow (178); Unweighted Baitfish (150) | DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION |
| Guntersville / Tennessee River reservoir<br>2025-10-19 dirty big_fish B | 54.1-72F, 12.4 mph wind, 33.6% cloud, 1.1 in precip | neutral, caution, wind_reaction+dirty_vibration+open_water_search, high | Lipless Crankbait (172); Football Jig (134); Dungeon Streamer (168); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Guntersville / Tennessee River reservoir<br>2025-10-20 dirty big_fish B | 47.1-68.9F, 4.1 mph wind, 13.7% cloud, 0 in precip | suppressed, closed, cold_slow, high | Deep-Diving Crankbait (152); Suspending Jerkbait (148); Articulated Baitfish (160); Crawfish Fly (136) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Southwest desert bass reservoir<br>2025-03-25 dirty big_fish B | 67.7-95.9F, 4.4 mph wind, 16.2% cloud, 0 in precip | neutral, closed, heat_finesse, high | Compact Flipping Jig (140); Magnum Jerkbait (158); Articulated Baitfish (154); Rabbit-Strip Leech (134) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Southwest desert bass reservoir<br>2025-03-25 stained big_fish B | 67.7-95.9F, 4.4 mph wind, 16.2% cloud, 0 in precip | neutral, closed, heat_finesse, high | Texas-Rigged Craw (152); Drop-Shot Minnow (152); Game Changer (154); Rabbit-Strip Leech (134) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_ID_OVERLAP_AVOIDABLE |
| Southwest desert bass reservoir<br>2025-08-21 dirty big_fish B | 93.2-115.6F, 3.3 mph wind, 5.4% cloud, 0 in precip | neutral, caution, heat_finesse, high | Shaky-Head Worm (124); Drop-Shot Minnow (138); Articulated Baitfish (160); Rabbit-Strip Leech (134) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_ID_OVERLAP_AVOIDABLE |
| Southwest desert bass reservoir<br>2025-08-21 stained big_fish B | 93.2-115.6F, 3.3 mph wind, 5.4% cloud, 0 in precip | neutral, caution, heat_finesse, high | Shaky-Head Worm (124); Drop-Shot Minnow (146); Bluegill Streamer (162); Rabbit-Strip Leech (134) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_ID_OVERLAP_AVOIDABLE |
| Northern California bass lake<br>2025-03-30 dirty big_fish B | 39.7-55.9F, 11.2 mph wind, 82.5% cloud, 0.4 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, high | Medium-Diving Crankbait (162); Football Jig (156); Game Changer (154); Jigged Marabou Leech (130) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Northern California bass lake<br>2025-03-30 stained big_fish B | 39.7-55.9F, 11.2 mph wind, 82.5% cloud, 0.4 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, high | Suspending Jerkbait (166); Football Jig (156); Dungeon Streamer (162); Jigged Marabou Leech (130) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 clear big_fish B | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, high | Flat-Sided Crankbait (150); Football Jig (156); Articulated Baitfish (136); Jigged Marabou Leech (130) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake Okeechobee / central FL bass lake<br>2025-01-16 dirty big_fish B | 58.1-65.4F, 12.4 mph wind, 92.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, high | Deep-Diving Crankbait (152); Bladed Jig (140); Game Changer (144); Jigged Marabou Leech (130) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Illinois / Indiana natural-lake example<br>2025-04-18 clear big_fish A | 55-77.3F, 12.3 mph wind, 81.4% cloud, 1.1 in precip | neutral, closed, wind_reaction, high | Football Jig (140); Magnum Jerkbait (166); Dungeon Streamer (154); Game Changer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Illinois / Indiana natural-lake example<br>2025-04-18 stained big_fish A | 55-77.3F, 12.3 mph wind, 81.4% cloud, 1.1 in precip | neutral, closed, wind_reaction+dirty_vibration, high | Magnum Jerkbait (166); Compact Flipping Jig (156); Game Changer (154); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |

## Known Coverage Gaps

- stable_pleasant_medium_confidence_archive: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
