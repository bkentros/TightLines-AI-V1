# Pike V3 Matrix Review Sheet

Generated: 2026-04-05T16:22:14.173Z
Archive bundle generated: 2026-04-05T02:38:59.295Z
Scenario count: 48
Contexts: 32 lake/pond, 16 river
Priority mix: 36 core, 12 secondary
Completed engine runs: 48/48

This sheet is the scoring surface for the freshwater V3 recommender audit batch.
It supports archive-backed engine runs, real top-3 output capture, and lightweight precheck flags before manual scoring.

Scoring rubric:
- 2 = clearly right
- 1 = acceptable but not ideal
- 0 = wrong or concerning

Required score keys:
- seasonal_fit
- daily_fit
- water_column_fit
- archetype_fit
- color_fit
- top3_variety
- boundedness

## pike_matrix_minnesota_northwoods_lake_01

- Label: Minnesota northwoods pike lake, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- Northern stained pike lake in winter: suspending_jerkbait leads on negative-mood January days; pike_jerkbait owns neutral December; blade_bait surfaces on extreme cold bottom-column pushes.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- blade_bait
Acceptable secondary lanes:
- large_profile_pike_swimbait
- casting_spoon
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 28.7 F
- Noon pressure: 1015.6 mb
- Noon cloud cover: 96%
- Daily high/low: 31.6 / 9.9 F
- Daily wind max: 27.1 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:56 / 16:58

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Zonker Streamer `zonker_streamer` | theme: `dark_contrast` | colors: black, black/purple, black/olive
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Zonker Streamer: Theme: dark contrast. Try black, black/purple, black/olive.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 67 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_minnesota_northwoods_lake_02

- Label: Minnesota northwoods pike lake, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- February still carries negative-mood winter posture favoring suspending; March opens the spring pool where pike_jerkbait leads at position zero.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- spinnerbait
- paddle_tail_swimbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: -4.5 F
- Noon pressure: 1042.9 mb
- Noon cloud cover: 100%
- Daily high/low: 11.6 / -4.3 F
- Daily wind max: 8.3 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:12 / 17:49

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Daily profile notes:
- Shared score: 41 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_minnesota_northwoods_lake_03

- Label: Minnesota northwoods pike lake, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- February still carries negative-mood winter posture favoring suspending; March opens the spring pool where pike_jerkbait leads at position zero.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- spinnerbait
- paddle_tail_swimbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 29.5 F
- Noon pressure: 1014 mb
- Noon cloud cover: 79%
- Daily high/low: 38.7 / 19.4 F
- Daily wind max: 17.6 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:17 / 19:32

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 46 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=mid, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_minnesota_northwoods_lake_04

- Label: Minnesota northwoods pike lake, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- April through May spans spring-to-summer transition: pike_jerkbait leads in the neutral spring pool; large_profile_pike_swimbait takes position zero as summer activity ramps in May.
Expected primary lanes:
- pike_jerkbait
- large_profile_pike_swimbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 40.1 F
- Noon pressure: 1016.5 mb
- Noon cloud cover: 10%
- Daily high/low: 44.9 / 26.9 F
- Daily wind max: 15.7 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:24 / 20:09

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 56 (Fair)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_minnesota_northwoods_lake_05

- Label: Minnesota northwoods pike lake, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- April through May spans spring-to-summer transition: pike_jerkbait leads in the neutral spring pool; large_profile_pike_swimbait takes position zero as summer activity ramps in May.
Expected primary lanes:
- pike_jerkbait
- large_profile_pike_swimbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 59.1 F
- Noon pressure: 991.2 mb
- Noon cloud cover: 35%
- Daily high/low: 65.3 / 51.1 F
- Daily wind max: 20.4 mph
- Daily precip: 0.5078740157480316 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:39 / 20:48

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 59 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_minnesota_northwoods_lake_06

- Label: Minnesota northwoods pike lake, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- Active summer and early-fall stained pike lake: large_profile_pike_swimbait holds position zero across the full summer-fall stretch; pike_jerkbait is the locked-in runner-up.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- walking_topwater
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 70.1 F
- Noon pressure: 1010.3 mb
- Noon cloud cover: 100%
- Daily high/low: 73.3 / 64.5 F
- Daily wind max: 5.5 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:19 / 21:18

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 66 (Good)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_minnesota_northwoods_lake_07

- Label: Minnesota northwoods pike lake, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- Active summer and early-fall stained pike lake: large_profile_pike_swimbait holds position zero across the full summer-fall stretch; pike_jerkbait is the locked-in runner-up.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- walking_topwater
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 61 F
- Noon pressure: 1016.7 mb
- Noon cloud cover: 100%
- Daily high/low: 65.2 / 60 F
- Daily wind max: 17.1 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:37 / 21:10

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 37 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_minnesota_northwoods_lake_08

- Label: Minnesota northwoods pike lake, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- Active summer and early-fall stained pike lake: large_profile_pike_swimbait holds position zero across the full summer-fall stretch; pike_jerkbait is the locked-in runner-up.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- walking_topwater
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 73.1 F
- Noon pressure: 1010.4 mb
- Noon cloud cover: 100%
- Daily high/low: 77.1 / 68.1 F
- Daily wind max: 20.5 mph
- Daily precip: 0.023622047244094488 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:12 / 20:31

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Casting Spoon `casting_spoon` | theme: `bright_contrast` | colors: chartreuse chrome, firetiger spoon, orange/chartreuse
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Casting Spoon: Theme: bright contrast. Try chartreuse chrome, firetiger spoon, orange/chartreuse.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 77 (Good)
- Daily nudges: mood=neutral, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_minnesota_northwoods_lake_09

- Label: Minnesota northwoods pike lake, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- September and October bold fall posture keeps large_profile at the front; November neutral WINTER pool returns pike_jerkbait to the top slot.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 68.2 F
- Noon pressure: 1019.5 mb
- Noon cloud cover: 100%
- Daily high/low: 72.8 / 64.6 F
- Daily wind max: 11.2 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:57 / 19:26

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Casting Spoon `casting_spoon` | theme: `bright_contrast` | colors: chartreuse chrome, firetiger spoon, orange/chartreuse
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Casting Spoon: Theme: bright contrast. Try chartreuse chrome, firetiger spoon, orange/chartreuse.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 83 (Excellent)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_minnesota_northwoods_lake_10

- Label: Minnesota northwoods pike lake, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- September and October bold fall posture keeps large_profile at the front; November neutral WINTER pool returns pike_jerkbait to the top slot.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 52.9 F
- Noon pressure: 1025.6 mb
- Noon cloud cover: 85%
- Daily high/low: 53.8 / 45.7 F
- Daily wind max: 10.2 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:35 / 18:31

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Casting Spoon `casting_spoon` | theme: `bright_contrast` | colors: chartreuse chrome, firetiger spoon, orange/chartreuse
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Casting Spoon: Theme: bright contrast. Try chartreuse chrome, firetiger spoon, orange/chartreuse.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 66 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_minnesota_northwoods_lake_11

- Label: Minnesota northwoods pike lake, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- September and October bold fall posture keeps large_profile at the front; November neutral WINTER pool returns pike_jerkbait to the top slot.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 43.4 F
- Noon pressure: 1014.7 mb
- Noon cloud cover: 0%
- Daily high/low: 49 / 34.1 F
- Daily wind max: 8.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:16 / 16:47

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Zonker Streamer `zonker_streamer` | theme: `dark_contrast` | colors: black, black/purple, black/olive
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Zonker Streamer: Theme: dark contrast. Try black, black/purple, black/olive.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 61 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_minnesota_northwoods_lake_12

- Label: Minnesota northwoods pike lake, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.157, -94.392
- Engine status: complete

Expected seasonal story:
- Northern stained pike lake in winter: suspending_jerkbait leads on negative-mood January days; pike_jerkbait owns neutral December; blade_bait surfaces on extreme cold bottom-column pushes.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- blade_bait
Acceptable secondary lanes:
- large_profile_pike_swimbait
- casting_spoon
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 19 F
- Noon pressure: 1016.8 mb
- Noon cloud cover: 100%
- Daily high/low: 17.9 / 9 F
- Daily wind max: 8.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:51 / 16:29

Actual output:
- Top 1 lure: Blade Bait `blade_bait` | theme: `bright_contrast` | colors: firetiger, chartreuse chrome, orange/chartreuse
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `bright_contrast` | colors: firetiger, chartreuse chrome, orange/chartreuse
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Blade Bait: Theme: bright contrast. Try firetiger, chartreuse chrome, orange/chartreuse.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 41 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_01

- Label: New York Adirondack clear pike lake, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- Clear northern pike lake in January cold posture: suspending_jerkbait earns the negative-mood edge; pike_jerkbait reclaims top slot in December neutral.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- casting_spoon
- blade_bait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 20 F
- Noon pressure: 1010.1 mb
- Noon cloud cover: 100%
- Daily high/low: 28 / 10 F
- Daily wind max: 11.8 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:26 / 16:46

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Blade Bait `blade_bait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Blade Bait: Theme: white shad. Try white, pearl, white/silver.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 40 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=mid, mood=negative, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_02

- Label: New York Adirondack clear pike lake, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- Clear Adirondack prespawn: February negative-mood winter pool favors suspending; March neutral spring pool gives pike_jerkbait the positional lead.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 9 F
- Noon pressure: 1026.8 mb
- Noon cloud cover: 36%
- Daily high/low: 18 / -5.8 F
- Daily wind max: 7.7 mph
- Daily precip: 0.011811023622047244 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:47 / 17:32

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Blade Bait `blade_bait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Blade Bait: Theme: white shad. Try white, pearl, white/silver.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 34 (Poor)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=mid, mood=negative, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_03

- Label: New York Adirondack clear pike lake, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- Clear Adirondack prespawn: February negative-mood winter pool favors suspending; March neutral spring pool gives pike_jerkbait the positional lead.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 52.1 F
- Noon pressure: 1000.8 mb
- Noon cloud cover: 100%
- Daily high/low: 58 / 35.9 F
- Daily wind max: 20.4 mph
- Daily precip: 0.1811023622047244 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:57 / 19:10

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 55 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_04

- Label: New York Adirondack clear pike lake, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- April to May clear Adirondack transition: a cold April day with negative-mood push gives suspending_jerkbait the edge; pike_jerkbait leads on neutral spring days; large_profile takes over as summer activity opens in May.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- spinnerbait
- paddle_tail_swimbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 30.1 F
- Noon pressure: 1003.8 mb
- Noon cloud cover: 100%
- Daily high/low: 33.2 / 26.6 F
- Daily wind max: 18.5 mph
- Daily precip: 0.20866141732283466 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:08 / 19:43

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 38 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=mid, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_05

- Label: New York Adirondack clear pike lake, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- April to May clear Adirondack transition: a cold April day with negative-mood push gives suspending_jerkbait the edge; pike_jerkbait leads on neutral spring days; large_profile takes over as summer activity opens in May.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- spinnerbait
- paddle_tail_swimbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 70.4 F
- Noon pressure: 1011.4 mb
- Noon cloud cover: 98%
- Daily high/low: 73 / 57.1 F
- Daily wind max: 8.2 mph
- Daily precip: 0.047244094488188976 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:27 / 20:18

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 85 (Excellent)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_06

- Label: New York Adirondack clear pike lake, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- Clear northern lake active summer: large_profile leads on active-balanced days; paddle_tail_swimbait surfaces when conditions push presentation to subtle; pike_jerkbait is always close.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- walking_topwater
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 79.2 F
- Noon pressure: 1010.6 mb
- Noon cloud cover: 100%
- Daily high/low: 83.8 / 64.2 F
- Daily wind max: 10.6 mph
- Daily precip: 0.09448818897637795 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:10 / 20:45

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 68 (Good)
- Daily nudges: mood=up_1, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_07

- Label: New York Adirondack clear pike lake, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- Clear northern lake active summer: large_profile leads on active-balanced days; paddle_tail_swimbait surfaces when conditions push presentation to subtle; pike_jerkbait is always close.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- walking_topwater
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 83.9 F
- Noon pressure: 1015.3 mb
- Noon cloud cover: 90%
- Daily high/low: 87.2 / 64.8 F
- Daily wind max: 8.4 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:26 / 20:39

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 46 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=mid, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_08

- Label: New York Adirondack clear pike lake, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- Clear northern lake active summer: large_profile leads on active-balanced days; paddle_tail_swimbait surfaces when conditions push presentation to subtle; pike_jerkbait is always close.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- walking_topwater
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 75.7 F
- Noon pressure: 1015.7 mb
- Noon cloud cover: 24%
- Daily high/low: 77.4 / 61.4 F
- Daily wind max: 9.4 mph
- Daily precip: 0.011811023622047244 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:57 / 20:04

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Casting Spoon `casting_spoon` | theme: `white_shad` | colors: white, pearl, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Casting Spoon: Theme: white shad. Try white, pearl, white/silver.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 71 (Good)
- Daily nudges: mood=neutral, water_column=neutral, presentation=neutral
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_09

- Label: New York Adirondack clear pike lake, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- Adirondack fall pike in clear water: September–October bold posture locks in large_profile; November neutral WINTER pool puts pike_jerkbait back on top.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 69.6 F
- Noon pressure: 1020.5 mb
- Noon cloud cover: 99%
- Daily high/low: 73.3 / 50.3 F
- Daily wind max: 4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:37 / 19:04

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 82 (Excellent)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_10

- Label: New York Adirondack clear pike lake, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- Adirondack fall pike in clear water: September–October bold posture locks in large_profile; November neutral WINTER pool puts pike_jerkbait back on top.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 46.9 F
- Noon pressure: 1019.2 mb
- Noon cloud cover: 76%
- Daily high/low: 48.8 / 37.7 F
- Daily wind max: 11.5 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:10 / 18:13

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Casting Spoon `casting_spoon` | theme: `white_shad` | colors: white, pearl, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Casting Spoon: Theme: white shad. Try white, pearl, white/silver.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 46 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_11

- Label: New York Adirondack clear pike lake, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- Adirondack fall pike in clear water: September–October bold posture locks in large_profile; November neutral WINTER pool puts pike_jerkbait back on top.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 30.6 F
- Noon pressure: 1002.9 mb
- Noon cloud cover: 100%
- Daily high/low: 33.4 / 27.3 F
- Daily wind max: 12.9 mph
- Daily precip: 0.0984251968503937 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:47 / 16:34

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Zonker Streamer `zonker_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Zonker Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 43 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_new_york_adirondack_lake_12

- Label: New York Adirondack clear pike lake, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.329, -74.132
- Engine status: complete

Expected seasonal story:
- Clear northern pike lake in January cold posture: suspending_jerkbait earns the negative-mood edge; pike_jerkbait reclaims top slot in December neutral.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- casting_spoon
- blade_bait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 27.6 F
- Noon pressure: 995.7 mb
- Noon cloud cover: 100%
- Daily high/low: 32.3 / 8.8 F
- Daily wind max: 16.4 mph
- Daily precip: 0.12992125984251968 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:20 / 16:18

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Zonker Streamer `zonker_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Zonker Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 52 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_01

- Label: Rainy River pike river system, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- Northern river pike winter posture: January negative mood gives suspending_jerkbait its clearest win; December neutral pulls pike_jerkbait back to position zero.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- casting_spoon
- blade_bait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: 25.3 F
- Noon pressure: 1013.9 mb
- Noon cloud cover: 100%
- Daily high/low: 32.5 / 9 F
- Daily wind max: 22.2 mph
- Daily precip: 0.08267716535433071 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:57 / 16:49

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 63 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_02

- Label: Rainy River pike river system, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- February river pike still in cold negative posture favoring suspending; March spring river pool opens with pike_jerkbait and spinnerbait leading current-seam lanes.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: -0.1 F
- Noon pressure: 1041.9 mb
- Noon cloud cover: 100%
- Daily high/low: 15 / -4.6 F
- Daily wind max: 7.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:11 / 17:43

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Daily profile notes:
- Shared score: 48 (Fair)
- Daily nudges: mood=up_2, water_column=neutral, presentation=neutral
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_03

- Label: Rainy River pike river system, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- February river pike still in cold negative posture favoring suspending; March spring river pool opens with pike_jerkbait and spinnerbait leading current-seam lanes.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: 30.3 F
- Noon pressure: 1011 mb
- Noon cloud cover: 86%
- Daily high/low: 40.6 / 8.3 F
- Daily wind max: 14.5 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:13 / 19:28

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 47 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_04

- Label: Rainy River pike river system, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- Spring river pike from April through May: pike_jerkbait holds position zero in both the neutral spring and active summer river pools; spinnerbait and paddle_tail follow in the current-seam lane.
Expected primary lanes:
- pike_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- large_profile_pike_swimbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: 42.5 F
- Noon pressure: 1017.7 mb
- Noon cloud cover: 11%
- Daily high/low: 46.8 / 23 F
- Daily wind max: 11.6 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:18 / 20:08

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 61 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_05

- Label: Rainy River pike river system, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- Spring river pike from April through May: pike_jerkbait holds position zero in both the neutral spring and active summer river pools; spinnerbait and paddle_tail follow in the current-seam lane.
Expected primary lanes:
- pike_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- large_profile_pike_swimbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: 71.6 F
- Noon pressure: 996 mb
- Noon cloud cover: 49%
- Daily high/low: 75.1 / 53.4 F
- Daily wind max: 19.4 mph
- Daily precip: 0.25984251968503935 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:29 / 20:49

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 66 (Good)
- Daily nudges: mood=neutral, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_06

- Label: Rainy River pike river system, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- River summer pool keeps pike_jerkbait at position zero through June and July; August shifts to the FALL_RIVER pool where large_profile_pike_swimbait takes the lead.
Expected primary lanes:
- pike_jerkbait
- large_profile_pike_swimbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- walking_topwater
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: 72.5 F
- Noon pressure: 1008.8 mb
- Noon cloud cover: 100%
- Daily high/low: 76.6 / 54.1 F
- Daily wind max: 9.4 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:08 / 21:21

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 71 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_07

- Label: Rainy River pike river system, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- River summer pool keeps pike_jerkbait at position zero through June and July; August shifts to the FALL_RIVER pool where large_profile_pike_swimbait takes the lead.
Expected primary lanes:
- pike_jerkbait
- large_profile_pike_swimbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- walking_topwater
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: 62.5 F
- Noon pressure: 1018 mb
- Noon cloud cover: 82%
- Daily high/low: 67.1 / 56.9 F
- Daily wind max: 13.7 mph
- Daily precip: 0.03937007874015748 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:27 / 21:12

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 30 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_08

- Label: Rainy River pike river system, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- River summer pool keeps pike_jerkbait at position zero through June and July; August shifts to the FALL_RIVER pool where large_profile_pike_swimbait takes the lead.
Expected primary lanes:
- pike_jerkbait
- large_profile_pike_swimbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- walking_topwater
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: 70.6 F
- Noon pressure: 1011.3 mb
- Noon cloud cover: 31%
- Daily high/low: 74.3 / 60.3 F
- Daily wind max: 16.5 mph
- Daily precip: 0.01968503937007874 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:04 / 20:31

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Casting Spoon `casting_spoon` | theme: `bright_contrast` | colors: chartreuse chrome, firetiger spoon, orange/chartreuse
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Casting Spoon: Theme: bright contrast. Try chartreuse chrome, firetiger spoon, orange/chartreuse.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 71 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_09

- Label: Rainy River pike river system, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- Fall river pike: September–October bold FALL_RIVER posture locks large_profile at the front; November neutral WINTER_RIVER gives pike_jerkbait the positional lead.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: 67.6 F
- Noon pressure: 1019.8 mb
- Noon cloud cover: 84%
- Daily high/low: 70.9 / 60.5 F
- Daily wind max: 11.4 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:52 / 19:23

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Casting Spoon `casting_spoon` | theme: `bright_contrast` | colors: chartreuse chrome, firetiger spoon, orange/chartreuse
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Casting Spoon: Theme: bright contrast. Try chartreuse chrome, firetiger spoon, orange/chartreuse.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 82 (Excellent)
- Daily nudges: mood=up_1, water_column=neutral, presentation=neutral
- Resolved profile: water_column=mid, mood=active, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_10

- Label: Rainy River pike river system, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- Fall river pike: September–October bold FALL_RIVER posture locks large_profile at the front; November neutral WINTER_RIVER gives pike_jerkbait the positional lead.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: 50.7 F
- Noon pressure: 1027 mb
- Noon cloud cover: 52%
- Daily high/low: 53.8 / 42.4 F
- Daily wind max: 7.3 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:32 / 18:25

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Casting Spoon `casting_spoon` | theme: `bright_contrast` | colors: chartreuse chrome, firetiger spoon, orange/chartreuse
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Casting Spoon: Theme: bright contrast. Try chartreuse chrome, firetiger spoon, orange/chartreuse.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 46 (Fair)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_11

- Label: Rainy River pike river system, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- Fall river pike: September–October bold FALL_RIVER posture locks large_profile at the front; November neutral WINTER_RIVER gives pike_jerkbait the positional lead.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: 41 F
- Noon pressure: 1011.3 mb
- Noon cloud cover: 1%
- Daily high/low: 46.8 / 28.9 F
- Daily wind max: 12.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:16 / 16:39

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 63 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_rainy_river_pike_12

- Label: Rainy River pike river system, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: MN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 48.622, -93.394
- Engine status: complete

Expected seasonal story:
- Northern river pike winter posture: January negative mood gives suspending_jerkbait its clearest win; December neutral pulls pike_jerkbait back to position zero.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- casting_spoon
- blade_bait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Winnipeg
- Noon air temp: 14.4 F
- Noon pressure: 1016.8 mb
- Noon cloud cover: 100%
- Daily high/low: 12.1 / 0 F
- Daily wind max: 7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:53 / 16:19

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Daily profile notes:
- Shared score: 47 (Fair)
- Daily nudges: mood=up_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_alaska_pike_lake_05

- Label: Alaska interior pike lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: AK
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 64.842, -147.723
- Engine status: complete

Expected seasonal story:
- Alaska May open-water pike: active summer lake pool under extreme northern photoperiod; large_profile_pike_swimbait leads at position zero.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- hollow_body_frog
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: alaska
- Archive weather timezone: America/Anchorage
- Noon air temp: 54.3 F
- Noon pressure: 1004.7 mb
- Noon cloud cover: 0%
- Daily high/low: 57.9 / 35.4 F
- Daily wind max: 13.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 04:20 / 23:13

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 59 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_alaska_pike_lake_07

- Label: Alaska interior pike lake, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: AK
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 64.842, -147.723
- Engine status: complete

Expected seasonal story:
- Alaska midsummer lake: active posture keeps large_profile_pike_swimbait at position zero through the compressed northern open-water window.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- walking_topwater
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: alaska
- Archive weather timezone: America/Anchorage
- Noon air temp: 62.6 F
- Noon pressure: 1019.4 mb
- Noon cloud cover: 17%
- Daily high/low: 70.3 / 51.3 F
- Daily wind max: 7.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 03:53 / 00:00

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 76 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_alaska_pike_lake_09

- Label: Alaska interior pike lake, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: AK
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 64.842, -147.723
- Engine status: complete

Expected seasonal story:
- Alaska fall shoulder: September active-bold FALL_LAKE gives large_profile the top slot; November can swing between pike_jerkbait and blade_bait depending on how extreme the cold push is.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- blade_bait
Acceptable secondary lanes:
- paddle_tail_swimbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: alaska
- Archive weather timezone: America/Anchorage
- Noon air temp: 53.9 F
- Noon pressure: 998.4 mb
- Noon cloud cover: 100%
- Daily high/low: 55.3 / 42.3 F
- Daily wind max: 6.6 mph
- Daily precip: 0.01968503937007874 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:18 / 20:11

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Casting Spoon `casting_spoon` | theme: `bright_contrast` | colors: chartreuse chrome, firetiger spoon, orange/chartreuse
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Casting Spoon: Theme: bright contrast. Try chartreuse chrome, firetiger spoon, orange/chartreuse.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 69 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_alaska_pike_lake_11

- Label: Alaska interior pike lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: AK
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 64.842, -147.723
- Engine status: complete

Expected seasonal story:
- Alaska fall shoulder: September active-bold FALL_LAKE gives large_profile the top slot; November can swing between pike_jerkbait and blade_bait depending on how extreme the cold push is.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- blade_bait
Acceptable secondary lanes:
- paddle_tail_swimbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: alaska
- Archive weather timezone: America/Anchorage
- Noon air temp: -3.6 F
- Noon pressure: 1013.1 mb
- Noon cloud cover: 99%
- Daily high/low: -3.8 / -9 F
- Daily wind max: 2.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 09:14 / 15:55

Actual output:
- Top 1 lure: Blade Bait `blade_bait` | theme: `bright_contrast` | colors: firetiger, chartreuse chrome, orange/chartreuse
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `bright_contrast` | colors: firetiger, chartreuse chrome, orange/chartreuse
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Blade Bait: Theme: bright contrast. Try firetiger, chartreuse chrome, orange/chartreuse.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 33 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_north_dakota_reservoir_02

- Label: North Dakota interior reservoir, prespawn opening month 2
- Priority: secondary
- Date: 2025-02-19
- State: ND
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.512, -101.425
- Engine status: complete

Expected seasonal story:
- Interior-edge late-winter reservoir: negative-mood posture keeps pike slow and low; suspending_jerkbait earns the mood advantage with pike_jerkbait as the stable positional fallback.
Expected primary lanes:
- suspending_jerkbait
- pike_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- casting_spoon
- blade_bait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/North_Dakota/Beulah
- Noon air temp: -12.4 F
- Noon pressure: 1050.7 mb
- Noon cloud cover: 0%
- Daily high/low: 4.8 / -18 F
- Daily wind max: 13.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:41 / 18:17

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Blade Bait `blade_bait` | theme: `bright_contrast` | colors: firetiger, chartreuse chrome, orange/chartreuse
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Blade Bait: Theme: bright contrast. Try firetiger, chartreuse chrome, orange/chartreuse.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Daily profile notes:
- Shared score: 32 (Poor)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=mid, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_north_dakota_reservoir_05

- Label: North Dakota interior reservoir, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: ND
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.512, -101.425
- Engine status: complete

Expected seasonal story:
- Interior-edge spring reservoir: pike_jerkbait leads on neutral-mood spring days; a cold-front mood push sends suspending_jerkbait to the top when conditions go negative.
Expected primary lanes:
- pike_jerkbait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- spinnerbait
- paddle_tail_swimbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/North_Dakota/Beulah
- Noon air temp: 46.2 F
- Noon pressure: 992.6 mb
- Noon cloud cover: 100%
- Daily high/low: 49.9 / 44.2 F
- Daily wind max: 21.7 mph
- Daily precip: 1.830708661417323 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:05 / 21:18

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 30 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=mid, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_north_dakota_reservoir_08

- Label: North Dakota interior reservoir, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: ND
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.512, -101.425
- Engine status: complete

Expected seasonal story:
- Interior-edge summer heat compresses the season into an early fall-pool read: large_profile_pike_swimbait holds position zero in the neutral mid-column posture.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/North_Dakota/Beulah
- Noon air temp: 77.9 F
- Noon pressure: 1005.1 mb
- Noon cloud cover: 0%
- Daily high/low: 82.1 / 63.4 F
- Daily wind max: 15.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:39 / 21:00

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 64 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_north_dakota_reservoir_10

- Label: North Dakota interior reservoir, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: ND
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 47.512, -101.425
- Engine status: complete

Expected seasonal story:
- Interior-edge October active feedup: bold FALL_LAKE posture locks large_profile_pike_swimbait at position zero with pike_jerkbait close behind.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- bright_contrast
- white_shad

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/North_Dakota/Beulah
- Noon air temp: 48.2 F
- Noon pressure: 1022.9 mb
- Noon cloud cover: 100%
- Daily high/low: 51 / 44 F
- Daily wind max: 10.8 mph
- Daily precip: 0.1811023622047244 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 08:03 / 18:59

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Casting Spoon `casting_spoon` | theme: `bright_contrast` | colors: chartreuse chrome, firetiger spoon, orange/chartreuse
- Top 1 fly: Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Casting Spoon: Theme: bright contrast. Try chartreuse chrome, firetiger spoon, orange/chartreuse.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 53 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_idaho_mountain_river_04

- Label: Idaho mountain river pike, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: ID
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 47.406, -116.812
- Engine status: complete

Expected seasonal story:
- Mountain clear-river April: neutral spring-river pool puts pike_jerkbait at position zero; spinnerbait as the current-seam lateral alternative.
Expected primary lanes:
- pike_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- large_profile_pike_swimbait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 55.4 F
- Noon pressure: 1010.8 mb
- Noon cloud cover: 0%
- Daily high/low: 55.8 / 37.8 F
- Daily wind max: 16.3 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:53 / 19:39

Actual output:
- Top 1 lure: Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Top 3 lures:
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 69 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_idaho_mountain_river_07

- Label: Idaho mountain river pike, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: ID
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 47.406, -116.812
- Engine status: complete

Expected seasonal story:
- Mountain clear river summer: pike_jerkbait holds position zero on balanced/bold days; a subtle presentation push surfaces paddle_tail_swimbait when conditions call for a softer retrieve.
Expected primary lanes:
- pike_jerkbait
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- large_profile_pike_swimbait
- walking_topwater
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 73.7 F
- Noon pressure: 1012.9 mb
- Noon cloud cover: 0%
- Daily high/low: 79.1 / 53.2 F
- Daily wind max: 8.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:05 / 20:41

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Inline Spinner `inline_spinner` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Inline Spinner: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 65 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_idaho_mountain_river_09

- Label: Idaho mountain river pike, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: ID
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 47.406, -116.812
- Engine status: complete

Expected seasonal story:
- Mountain river September active-bold fall: FALL_RIVER pool gives large_profile_pike_swimbait the lead in clear cold high-gradient flows.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- casting_spoon
- large_articulated_pike_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 77.8 F
- Noon pressure: 1017.9 mb
- Noon cloud cover: 0%
- Daily high/low: 82.7 / 53.4 F
- Daily wind max: 3.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:26 / 18:56

Actual output:
- Top 1 lure: Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Casting Spoon `casting_spoon` | theme: `white_shad` | colors: white, pearl, white/silver
- Inline Spinner `inline_spinner` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Casting Spoon: Theme: white shad. Try white, pearl, white/silver.
- Inline Spinner: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 61 (Good)
- Daily nudges: mood=up_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## pike_matrix_idaho_mountain_river_12

- Label: Idaho mountain river pike, winter control month 12
- Priority: secondary
- Date: 2025-12-10
- State: ID
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 47.406, -116.812
- Engine status: complete

Expected seasonal story:
- Mountain river December cold: negative-mood WINTER_RIVER pool gives suspending_jerkbait the mood advantage; pike_jerkbait as the neutral-condition positional backup.
Expected primary lanes:
- suspending_jerkbait
- pike_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- casting_spoon
- blade_bait
- pike_bunny_streamer
Expected color themes:
- perch_bluegill
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 50.7 F
- Noon pressure: 1010.9 mb
- Noon cloud cover: 100%
- Daily high/low: 53.1 / 43.6 F
- Daily wind max: 23.7 mph
- Daily precip: 0.11023622047244094 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:22 / 15:58

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Pike Jerkbait `pike_jerkbait` | theme: `white_shad` | colors: silver/black, pearl, whitefish
- Large-Profile Pike Swimbait `large_profile_pike_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Pike Bunny Streamer `pike_bunny_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Large Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Pike Jerkbait: Theme: white shad. Try silver/black, pearl, whitefish.
- Large-Profile Pike Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Pike Bunny Streamer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Large Articulated Pike Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 76 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

