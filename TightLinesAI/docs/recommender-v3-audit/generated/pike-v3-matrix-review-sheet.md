# Pike V3 Matrix Review Sheet

Generated: 2026-04-10T19:54:19.248Z
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive (7.3/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid_low, likely_column_today=mid, seasonal_location=mid_deep, posture=slightly_aggressive, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=true, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.7/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Frog Fly: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Hollow-Body Frog `hollow_body_frog` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Frog Fly `frog_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Hollow-Body Frog: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Frog Fly: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral (5.8/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Hollow-Body Frog `hollow_body_frog` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Hollow-Body Frog: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed (2/10)
- Presentation presence today: bold
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow_mid, posture=suppressed, presentation=bold
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Active rain disruption suppresses fish posture and shrinks the clean bite lane.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.7/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Casting Spoon `casting_spoon` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Casting Spoon: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive (7/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_aggressive, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=true, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=mid_low, seasonal_location=mid_deep, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (2.9/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- natural
- dark

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.1/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- natural
- dark

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Blade Bait `blade_bait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Large Jerkbait: natural -> green pumpkin, olive, smoke
- Blade Bait: natural -> green pumpkin, olive, smoke
- Large Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Large Rabbit Strip Streamer: natural -> green pumpkin, olive, smoke
- Balanced Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed (2.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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
- natural
- dark

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Zonker Streamer `zonker_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Large Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Large Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Large Rabbit Strip Streamer: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Zonker Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (2.7/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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
- natural
- dark

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=high, seasonal_location=shallow, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A sharp cooldown suppresses fish posture and lowers confidence in upward movement.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- natural
- dark

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Frog Fly: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- natural
- dark

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Frog Fly: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.7/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=high_top, seasonal_location=shallow, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- natural
- dark

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hollow-Body Frog `hollow_body_frog` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Large Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Hollow-Body Frog: natural -> green pumpkin, olive, smoke
- Large Jerkbait: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Large Rabbit Strip Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed (2.2/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow_mid, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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
- natural
- dark

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Large Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Large Jerkbait: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Large Rabbit Strip Streamer: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.6/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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
- natural
- dark

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- natural
- dark

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- natural
- dark

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- natural
- dark

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive (7.1/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=mid, seasonal_location=mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (4.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Inline Spinner `inline_spinner` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Inline Spinner: bright -> white/chartreuse, chartreuse, firetiger
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3/10)
- Presentation presence today: bold
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Walking Topwater: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Frog Fly: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Walking Topwater: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Frog Fly: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Inline Spinner `inline_spinner` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Inline Spinner: bright -> white/chartreuse, chartreuse, firetiger
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed (0/10)
- Presentation presence today: bold
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow, posture=suppressed, presentation=bold
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Blown-out flow strongly suppresses posture and collapses the clean bite lane.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Casting Spoon `casting_spoon` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Casting Spoon: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral (6.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Hollow-Body Frog `hollow_body_frog` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Frog Fly `frog_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Hollow-Body Frog: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Frog Fly: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral (6.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Casting Spoon `casting_spoon` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Casting Spoon: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral (6.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (1.8/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2.1/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Soft Plastic Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed (0.8/10)
- Presentation presence today: bold
- Resolved profile: typical_column=top, likely_column_today=high, seasonal_location=shallow, posture=suppressed, presentation=bold
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A sharp cooldown suppresses fish posture and lowers confidence in upward movement.
- Daily note: Strong wind adds instability even if it can still help visibility and presence.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Active rain disruption suppresses fish posture and shrinks the clean bite lane.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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
- dark
- bright

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Casting Spoon `casting_spoon` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Casting Spoon: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3.2/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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
- natural
- dark

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Large Jerkbait: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Spinnerbait: natural -> green pumpkin, olive, smoke
- Large Rabbit Strip Streamer: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Articulated Dungeon Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive (6.8/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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
- natural
- dark

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Large Jerkbait: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Spinnerbait: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Large Rabbit Strip Streamer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (6/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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
- natural
- dark

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
- Top 1 lure: Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Large Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Large Jerkbait: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Large Rabbit Strip Streamer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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
- natural
- dark

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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Large Jerkbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=mid_low, seasonal_location=mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Strong river wind hurts comfort without creating a true feeding advantage.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

