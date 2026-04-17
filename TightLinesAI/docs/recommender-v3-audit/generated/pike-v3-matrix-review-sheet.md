# Pike V3 Matrix Review Sheet

Generated: 2026-04-17T02:13:19.110Z
Archive bundle generated: 2026-04-16T02:12:15.680Z
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. Rabbit-Strip Leech tracks well when leech_worm is a realistic meal. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- February northwoods pike is still in brutal late-winter posture, and on this archived subzero stained-water day the bottom-column blade-bait lane is more realistic than forcing the nominal jerkbait leaders.
Expected primary lanes:
- blade_bait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- pike_jerkbait
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_aggressive
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- March northwoods pike has opened into the spring pool, but this archived stained-water day still supports a large-profile moving bait, with pike_jerkbait and spinnerbait staying inside the same seasonal story.
Expected primary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- spinnerbait
Acceptable secondary lanes:
- suspending_jerkbait
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
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Large Jerkbait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Large Jerkbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Slow down and lengthen the pause.
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Slow down and lengthen the pause.
- Spinnerbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Fly reasoning:
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal. Slow down and lengthen the pause.
- Articulated Baitfish Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Large Jerkbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Large Jerkbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Keep it high in the zone.
- Spinnerbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Keep it high in the zone.
- Fly reasoning:
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Keep it high in the zone.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.
- Clouser Minnow: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Walking Topwater: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: wind_condition, precipitation_disruption
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Keep it high in the zone.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Keep it high in the zone.
- Walking Topwater: It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It gives you a different pike big profile look without leaving today's window.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Keep it high in the zone.
- Game Changer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Mid-June northwoods pike can absolutely cash in on a clean low-light surface window in the stratified summer row, so walking topwater and popper fly are legitimate lead looks instead of automatic support-only options.
Expected primary lanes:
- walking_topwater
- popper_fly
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- deceiver
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
- Top 1 lure: Walking Topwater `walking_topwater` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Walking Topwater `walking_topwater` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Popper Fly `popper_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Popper Fly `popper_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Deceiver `deceiver` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_aggressive
- Walking Topwater: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Popper Fly: bright -> white/chartreuse, chartreuse, firetiger
- Deceiver: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=surface, pace=medium, presence=moderate
- Monthly baseline: columns=surface/upper/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Walking Topwater: It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. It is one of the lead monthly looks for this exact seasonal window.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Keep it high in the zone.
- Fly reasoning:
- Popper Fly: It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. It is one of the lead monthly looks for this exact seasonal window.
- Popper Fly how: Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.
- Deceiver: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish. Keep it high in the zone.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Suppressed midsummer northwoods pike should slide back under the top, letting paddle tail, spinnerbait, and the large-profile swimbait carry the story once the true surface lane closes.
Expected primary lanes:
- paddle_tail_swimbait
- spinnerbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- pike_jerkbait
- suspending_jerkbait
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Deceiver `deceiver` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: suppressed
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Deceiver: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=surface/upper/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Daily note: Active precipitation disruption narrows the clean bite window.
- Lure reasoning:
- Spinnerbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It gives you a different pike big profile look without leaving today's window.
- Large Rabbit Strip Streamer how: Strip with long, steady pulls so the rabbit hair breathes and the profile stays big; pause after every 2-3 strips to let following pike close. Slow down and lengthen the pause.
- Deceiver: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Strip in long, smooth pulls so the saddle feathers breathe; add a pause every few strips for followers to close the gap. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Late-summer northwoods pike has largely come off the cleanest topwater read and should settle back into large-profile baitfish lanes with paddle tail or spinnerbait still supporting the feed window.
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
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: wind_condition, precipitation_disruption
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close.
- Casting Spoon: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Casting Spoon how: Work it with a lift-and-drop over suspended fish; the concave face spins as it falls — strikes are usually on the drop, so keep a semi-tight line.
- Spinnerbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.
- Deceiver: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- spinnerbait
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
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: precipitation_disruption
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. It fits today's mid column preference. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Slow-roll at a steady mid-depth pace; pike follow long before committing, so keep your nerve and don't speed up or stop until the line goes tight.
- Casting Spoon: It matches the column/pace the conditions push toward today. It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Casting Spoon how: Work it with a lift-and-drop over suspended fish; the concave face spins as it falls — strikes are usually on the drop, so keep a semi-tight line.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. It fits today's mid column preference. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.
- Articulated Baitfish Streamer: It matches the column/pace the conditions push toward today. It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Cover water at mid-depth with steady strips; add a hard single rip followed by a full pause to imitate an injured baitfish fleeing and then stopping.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- spinnerbait
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Spinnerbait: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Keep it high in the zone.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Keep it high in the zone.
- Fly reasoning:
- Articulated Baitfish Streamer: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Once the northwoods lake tips into late fall, the archived November cold push can put the lead back on blade bait while keeping the rest of the baitfish-heavy winter pool intact.
Expected primary lanes:
- blade_bait
- large_profile_pike_swimbait
- pike_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- spinnerbait
- rabbit_strip_leech
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Blade Bait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom, paces=slow/medium/fast, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Slow down and lengthen the pause.
- Fly reasoning:
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays low in the zone where this day still wants fish to hold.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.
- Clouser Minnow: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_suppressed
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom, paces=slow/medium/fast, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Slow down and lengthen the pause.
- Fly reasoning:
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.
- Clouser Minnow: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Clear Adirondack winter pike can still put the lead on blade bait when the archived cold push drives fish to the bottom, while suspending jerkbait and pike_jerkbait remain the core winter controls.
Expected primary lanes:
- blade_bait
- pike_jerkbait
- suspending_jerkbait
Acceptable secondary lanes:
- large_profile_pike_swimbait
- casting_spoon
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Blade Bait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. The month is still baitfish-forward, and this stays inside that search lane.
- Blade Bait how: Lift with the rod and let the blade flutter back down on a controlled slack line; watch for the tap on the fall and set on anything that interrupts the sink. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.
- Clouser Minnow: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- February Adirondack pike is still a hard-winter control case, and the archived cold-bottom setup makes blade bait a real lead lane instead of forcing a cleaner jerkbait answer.
Expected primary lanes:
- blade_bait
- pike_jerkbait
- suspending_jerkbait
Acceptable secondary lanes:
- large_profile_pike_swimbait
- paddle_tail_swimbait
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_suppressed
- Blade Bait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Balanced Leech: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. The month is still baitfish-forward, and this stays inside that search lane.
- Blade Bait how: Lift with the rod and let the blade flutter back down on a controlled slack line; watch for the tap on the fall and set on anything that interrupts the sink. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.
- Clouser Minnow: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- March Adirondack pike has opened into spring, but this archived clear-water day still supports paddle-tail and large-profile baitfish lanes ahead of forcing the nominal jerkbait leader.
Expected primary lanes:
- paddle_tail_swimbait
- large_profile_pike_swimbait
- pike_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- soft_jerkbait
- large_articulated_pike_streamer
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: neutral
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Large Jerkbait: natural -> green pumpkin, olive, smoke
- Large Rabbit Strip Streamer: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, precipitation_disruption
- Daily note: Heat stress moves fish to cooler, deeper water and narrows the feeding window.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Slow down and lengthen the pause.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Jerkbait how: Work it erratically with big pulls and deadstops; the key is the pause after the dash, so hold still for at least two seconds before triggering again. Slow down and lengthen the pause.
- Fly reasoning:
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It is one of the lead monthly looks for this exact seasonal window.
- Large Rabbit Strip Streamer how: Strip with long, steady pulls so the rabbit hair breathes and the profile stays big; pause after every 2-3 strips to let following pike close. Slow down and lengthen the pause.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It is one of the lead monthly looks for this exact seasonal window. It gives you a different pike big profile look without leaving today's window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Slow down and lengthen the pause.
- Game Changer: It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Cold April Adirondack pike can still stay just under the surface season, with paddle tail and other baitfish lanes outranking a stricter jerkbait-first read on this archived transition day.
Expected primary lanes:
- paddle_tail_swimbait
- large_profile_pike_swimbait
- pike_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- spinnerbait
- large_articulated_pike_streamer
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A sharp cooldown reinforces a lower daily lane.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Soft Plastic Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Slow down and lengthen the pause.
- Spinnerbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Large Rabbit Strip Streamer how: Strip with long, steady pulls so the rabbit hair breathes and the profile stays big; pause after every 2-3 strips to let following pike close. Slow down and lengthen the pause.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Strip it with long pulls and full pauses so the articulated profile kicks wide, then hangs and breathes in place. Slow down and lengthen the pause.
- Clouser Minnow: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- By mid-May the current Adirondack lake row is a real shallow surface-capable transition, so frog, mouse, and walking-topwater lanes are all biologically fair leaders when the archived day opens the top cleanly.
Expected primary lanes:
- hollow_body_frog
- mouse_fly
- walking_topwater
- paddle_tail_swimbait
Acceptable secondary lanes:
- game_changer
- large_articulated_pike_streamer
- large_profile_pike_swimbait
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
- Top 1 lure: Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Walking Topwater: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Mouse Fly: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=surface, pace=medium, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Walking Topwater: It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. The month is still baitfish-forward, and this stays inside that search lane.
- Walking Topwater how: Work it with consistent wrist flicks over open water or above grass; keep the cadence smooth and only slow down if you see fish following. Keep it on top.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Hollow-Body Frog: It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. It keeps the presentation right at the top where the monthly window still allows it. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hollow-Body Frog how: Use steady walking cadence across open surface, then slow and pause aggressively when near cover; don't set the hook until you feel the fish pulling. Keep it on top.
- Fly reasoning:
- Mouse Fly: It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. The month is still baitfish-forward, and this stays inside that search lane.
- Mouse Fly how: Work it with a slow, uninterrupted retrieve across open water; the V-wake is the trigger, so keep it moving at a steady pace and stay alert. Keep it on top.
- Game Changer: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Pike Streamer how: Run it at mid-depth on alternating long and short strips; after a follow, stop completely and let the articulated body collapse before the next strip. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- June Adirondack pike in the stratified summer row can let walking topwater or popper fly lead on a clean low-light surface window, with paddle-tail and suspending lanes staying right behind them.
Expected primary lanes:
- walking_topwater
- popper_fly
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- large_profile_pike_swimbait
- pike_jerkbait
- deceiver
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
- Top 1 lure: Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Walking Topwater: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Popper Fly: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=surface, pace=slow, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Heat stress moves fish to cooler, deeper water and narrows the feeding window.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Walking Topwater: It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. It is one of the lead monthly looks for this exact seasonal window.
- Walking Topwater how: Work it with consistent wrist flicks over open water or above grass; keep the cadence smooth and only slow down if you see fish following. Work it with longer pauses.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Slow down and lengthen the pause.
- Fly reasoning:
- Popper Fly: It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. It is one of the lead monthly looks for this exact seasonal window.
- Popper Fly how: Work it with medium strips that spit and gurgle; slow the cadence near structure and let the fly rest after each pop — target the edge of any surface shadow. Work it with longer pauses.
- Deceiver: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish. Slow down and lengthen the pause.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Pike Streamer how: Run it at mid-depth on alternating long and short strips; after a follow, stop completely and let the articulated body collapse before the next strip. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Hot midsummer Adirondack pike can lose the clean surface lane and collapse back into suspending and paddle-tail baitfish lanes, with the large-profile swimbait still hanging in the mix.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- pike_jerkbait
- large_articulated_pike_streamer
- deceiver
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
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Deceiver `deceiver` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_suppressed
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Large Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Large Rabbit Strip Streamer: natural -> green pumpkin, olive, smoke
- Deceiver: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, precipitation_disruption
- Daily note: Heat stress moves fish to cooler, deeper water and narrows the feeding window.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Paddle-Tail Swimbait how: Retrieve at a measured pace over weed tops or along the edge; the big profile does the work — don't twitch or jerk, just keep it gliding. Slow down and lengthen the pause.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It gives you a different pike big profile look without leaving today's window.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.
- Deceiver: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Work it with a steady baitfish swim at medium cadence; slow down near structure and let it breathe on a semi-tight line between strips. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_aggressive
- Large Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Articulated Dungeon Streamer: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: precipitation_disruption
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. It fits today's mid column preference. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Slow-roll at a steady mid-depth pace; pike follow long before committing, so keep your nerve and don't speed up or stop until the line goes tight.
- Casting Spoon: It matches the column/pace the conditions push toward today. It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Casting Spoon how: Work it with a lift-and-drop over suspended fish; the concave face spins as it falls — strikes are usually on the drop, so keep a semi-tight line.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. It fits today's mid column preference. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.
- Articulated Baitfish Streamer: It matches the column/pace the conditions push toward today. It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Cover water at mid-depth with steady strips; add a hard single rip followed by a full pause to imitate an injured baitfish fleeing and then stopping.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Large Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Large Jerkbait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Large Jerkbait how: Use long, hard sweeps with the rod to make the bait dart and glide; pause fully between sweeps so the bait hangs and following fish can catch up. Keep it high in the zone.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Fly reasoning:
- Deceiver: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane.
- Deceiver how: Work it with a steady baitfish swim at medium cadence; slow down near structure and let it breathe on a semi-tight line between strips. Keep it high in the zone.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Game Changer: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=bottom, pace=medium, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Slow-roll at a steady mid-depth pace; pike follow long before committing, so keep your nerve and don't speed up or stop until the line goes tight. Keep it high in the zone.
- Casting Spoon: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Casting Spoon how: Work it with a lift-and-drop over suspended fish; the concave face spins as it falls — strikes are usually on the drop, so keep a semi-tight line.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Keep it high in the zone.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat. Keep it high in the zone.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.
- Articulated Baitfish Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Cover water at mid-depth with steady strips; add a hard single rip followed by a full pause to imitate an injured baitfish fleeing and then stopping. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Late-fall Adirondack pike can swing back to blade bait on the coldest archived clear-water setups once fish slide down and the winter control story takes over.
Expected primary lanes:
- blade_bait
- large_profile_pike_swimbait
- pike_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- casting_spoon
- balanced_leech
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Blade Bait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom, paces=slow/medium/fast, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane.
- Blade Bait how: Lift with the rod and let the blade flutter back down on a controlled slack line; watch for the tap on the fall and set on anything that interrupts the sink. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.
- Clouser Minnow: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Clear Adirondack winter pike can still put the lead on blade bait when the archived cold push drives fish to the bottom, while suspending jerkbait and pike_jerkbait remain the core winter controls.
Expected primary lanes:
- blade_bait
- pike_jerkbait
- suspending_jerkbait
Acceptable secondary lanes:
- large_profile_pike_swimbait
- casting_spoon
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Blade Bait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom, paces=slow/medium/fast, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane.
- Blade Bait how: Lift with the rod and let the blade flutter back down on a controlled slack line; watch for the tap on the fall and set on anything that interrupts the sink. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.
- Clouser Minnow: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Rainy River winter pike can still pin to the bottom on the coldest archived days, making blade bait a legitimate lead while suspending jerkbait and pike_jerkbait stay inside the same winter river story.
Expected primary lanes:
- blade_bait
- pike_jerkbait
- suspending_jerkbait
Acceptable secondary lanes:
- large_profile_pike_swimbait
- casting_spoon
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. Rabbit-Strip Leech tracks well when leech_worm is a realistic meal. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Late-winter Rainy River pike on this archived subzero day is still a bottom-control case, so blade bait is more believable than forcing a cleaner jerkbait winner.
Expected primary lanes:
- blade_bait
- suspending_jerkbait
- large_profile_pike_swimbait
Acceptable secondary lanes:
- pike_jerkbait
- casting_spoon
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_aggressive
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- March Rainy River pike has opened enough current-seam life for spinnerbait to legitimately lead, while pike_jerkbait and suspending jerkbait still anchor the same spring river pool.
Expected primary lanes:
- spinnerbait
- pike_jerkbait
- suspending_jerkbait
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_suppressed
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Spinnerbait: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Slow down and lengthen the pause.
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=moderate
- Monthly baseline: columns=upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Spinnerbait: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Keep it high in the zone.
- Large Jerkbait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Keep it high in the zone.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Keep it high in the zone.
- Fly reasoning:
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Large Rabbit Strip Streamer how: Strip with long, steady pulls so the rabbit hair breathes and the profile stays big; pause after every 2-3 strips to let following pike close. Keep it high in the zone.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It gives you a different pike big profile look without leaving today's window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Zonker Streamer: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Zonker Streamer how: Cast across current and strip steadily through the swing; add a momentary deadstop near structure so the wing collapses and then puffs back out. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Walking Topwater: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Frog Fly: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: wind_condition, runoff_flow_disruption
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Spinnerbait: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Keep it high in the zone.
- Walking Topwater: It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Frog Fly: It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly surface look without leaving today's window.
- Frog Fly how: Walk it across the surface with alternating rod twitches; slow to a crawl near pad edges and let it rest fully before the next move. Keep it on top.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Walking Topwater: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Popper Fly: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=moderate
- Monthly baseline: columns=surface/upper/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Spinnerbait: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Walking Topwater: It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different surface look without leaving today's window.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Keep it high in the zone.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Popper Fly: It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly surface look without leaving today's window.
- Popper Fly how: Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Inline Spinner `inline_spinner` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: suppressed
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Inline Spinner: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=surface/upper/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Elevated runoff tightens fish and pulls the day lower and slower.
- Lure reasoning:
- Spinnerbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Inline Spinner: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Inline Spinner how: Cast and retrieve at a steady clip just fast enough to keep the blade spinning; vary depth with rod angle and speed to find the feeding zone. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It gives you a different pike big profile look without leaving today's window.
- Large Rabbit Strip Streamer how: Strip with long, steady pulls so the rabbit hair breathes and the profile stays big; pause after every 2-3 strips to let following pike close. Slow down and lengthen the pause.
- Clouser Minnow: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Keep it high in the zone.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Keep it high in the zone.
- Inline Spinner: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Inline Spinner how: Use a slow-roll retrieve near bottom or cover edges; occasionally bump into structure to trigger reaction strikes. Keep it high in the zone.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.
- Deceiver: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: wind_condition, runoff_flow_disruption
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. It fits today's mid column preference. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Slow-roll at a steady mid-depth pace; pike follow long before committing, so keep your nerve and don't speed up or stop until the line goes tight.
- Casting Spoon: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Casting Spoon how: Work it with a lift-and-drop over suspended fish; the concave face spins as it falls — strikes are usually on the drop, so keep a semi-tight line.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. It fits today's mid column preference. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.
- Articulated Baitfish Streamer: It matches the column/pace the conditions push toward today. It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Cover water at mid-depth with steady strips; add a hard single rip followed by a full pause to imitate an injured baitfish fleeing and then stopping.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_shock, light_cloud_condition, runoff_flow_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Keep it high in the zone.
- Blade Bait: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Fly reasoning:
- Articulated Baitfish Streamer: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow.
- Blade Bait: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight.
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Paddle-Tail Swimbait how: Retrieve at a measured pace over weed tops or along the edge; the big profile does the work — don't twitch or jerk, just keep it gliding.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.
- Articulated Baitfish Streamer: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Cover water at mid-depth with steady strips; add a hard single rip followed by a full pause to imitate an injured baitfish fleeing and then stopping.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Rainy River winter pike can still pin to the bottom on the coldest archived days, making blade bait a legitimate lead while suspending jerkbait and pike_jerkbait stay inside the same winter river story.
Expected primary lanes:
- blade_bait
- pike_jerkbait
- suspending_jerkbait
Acceptable secondary lanes:
- large_profile_pike_swimbait
- casting_spoon
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: neutral
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom, paces=slow/medium/fast, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Slow down and lengthen the pause.
- Fly reasoning:
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays low in the zone where this day still wants fish to hold.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.
- Clouser Minnow: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Walking Topwater: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Mouse Fly: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=alaska, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Keep it high in the zone.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Keep it high in the zone.
- Walking Topwater: It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Mouse Fly: It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly surface look without leaving today's window.
- Mouse Fly how: Swim it on a constant slow retrieve just fast enough to leave a wake; target near-shore edges and structure where big fish expect food to cross. Keep it on top.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Large Jerkbait `pike_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=alaska, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Spinnerbait: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Keep it high in the zone.
- Large Jerkbait: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Keep it high in the zone.
- Fly reasoning:
- Articulated Baitfish Streamer: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Game Changer: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=alaska, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Keep it high in the zone.
- Blade Bait: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight.
- Spinnerbait: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Fly reasoning:
- Articulated Baitfish Streamer: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Blade Bait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=alaska, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Lure reasoning:
- Blade Bait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Blade Bait how: Lift with the rod and let the blade flutter back down on a controlled slack line; watch for the tap on the fall and set on anything that interrupts the sink. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Paddle-Tail Swimbait how: Slow-roll at a steady mid-depth pace; pike follow long before committing, so keep your nerve and don't speed up or stop until the line goes tight. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. The tighter daily setup rewards a slower, cleaner presentation. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.
- Clouser Minnow: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=midwest_interior, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Blade Bait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Lift with the rod and let the blade flutter back down on a controlled slack line; watch for the tap on the fall and set on anything that interrupts the sink. Slow down and lengthen the pause.
- Large Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Jerkbait how: Use long, hard sweeps with the rod to make the bait dart and glide; pause fully between sweeps so the bait hangs and following fish can catch up. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.
- Clouser Minnow: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: suppressed
- Large Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Large Rabbit Strip Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=midwest_interior, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A sharp cooldown reinforces a lower daily lane.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Strong wind reduces clean execution.
- Daily note: Active precipitation disruption narrows the clean bite window.
- Lure reasoning:
- Large Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Large Jerkbait how: Use long, hard sweeps with the rod to make the bait dart and glide; pause fully between sweeps so the bait hangs and following fish can catch up. Slow down and lengthen the pause.
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Paddle-Tail Swimbait how: Slow-roll at a steady mid-depth pace; pike follow long before committing, so keep your nerve and don't speed up or stop until the line goes tight. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Fly reasoning:
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Large Rabbit Strip Streamer how: Strip with long, steady pulls so the rabbit hair breathes and the profile stays big; pause after every 2-3 strips to let following pike close. Slow down and lengthen the pause.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Strip it with long pulls and full pauses so the articulated profile kicks wide, then hangs and breathes in place. Slow down and lengthen the pause.
- Articulated Baitfish Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Strip with moderate pulls so the articulated body pulses; mix fast strips with full stops where the fly sinks and the sections hinge naturally. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Articulated Pike Streamer: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=midwest_interior, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Casting Spoon: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Casting Spoon how: Work it with a lift-and-drop over suspended fish; the concave face spins as it falls — strikes are usually on the drop, so keep a semi-tight line. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Deceiver `deceiver` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: neutral
- Large Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Casting Spoon: bright -> white/chartreuse, chartreuse, firetiger
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Pike Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Deceiver: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=midwest_interior, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close.
- Casting Spoon: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Casting Spoon how: Work it with a lift-and-drop over suspended fish; the concave face spins as it falls — strikes are usually on the drop, so keep a semi-tight line.
- Spinnerbait: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top.
- Fly reasoning:
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.
- Deceiver: It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Jerkbait `pike_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Zonker Streamer `zonker_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Large Jerkbait: natural -> green pumpkin, olive, smoke
- Large Rabbit Strip Streamer: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Zonker Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=inland_northwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Soft Plastic Jerkbait: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Snap the rod sideways so the bait darts left or right, then drop the rod tip so it glides and sinks on a slack line before the next snap. Keep it high in the zone.
- Large Jerkbait: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Jerkbait how: Work it erratically with big pulls and deadstops; the key is the pause after the dash, so hold still for at least two seconds before triggering again. Keep it high in the zone.
- Fly reasoning:
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Large Rabbit Strip Streamer how: Strip with long, steady pulls so the rabbit hair breathes and the profile stays big; pause after every 2-3 strips to let following pike close. Keep it high in the zone.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It gives you a different pike big profile look without leaving today's window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Zonker Streamer: It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Zonker Streamer how: Cast across current and strip steadily through the swing; add a momentary deadstop near structure so the wing collapses and then puffs back out. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Articulated Dungeon Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=inland_northwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: light_cloud_condition, runoff_flow_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Soft Plastic Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Snap the rod sideways so the bait darts left or right, then drop the rod tip so it glides and sinks on a slack line before the next snap. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Slow down and lengthen the pause.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Dungeon Streamer how: Fish it on a sweep-pause cadence near cover and transitions, giving the bulky profile time to hang between strips before moving it again. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Pike Streamer `large_articulated_pike_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: neutral
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Large Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Articulated Pike Streamer: natural -> green pumpkin, olive, smoke
- Articulated Dungeon Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=inland_northwest, fallback_used=false
- Daily preference: column=bottom, pace=medium, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat stress moves fish to cooler, deeper water and narrows the feeding window.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Keep it high in the zone.
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Fly reasoning:
- Clouser Minnow: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Keep it low in the strike zone.
- Articulated Pike Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Articulated Pike Streamer how: Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Keep it high in the zone.
- Articulated Dungeon Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Dungeon Streamer how: Fish it on a sweep-pause cadence near cover and transitions, giving the bulky profile time to hang between strips before moving it again.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Jerkbait `pike_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Large Paddle-Tail Swimbait `large_profile_pike_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Large Rabbit Strip Streamer `pike_bunny_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Large Jerkbait: dark -> black, black/blue, black/purple
- Large Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Large Rabbit Strip Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=inland_northwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Strong wind reduces clean execution.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Suspending Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Slow down and lengthen the pause.
- Large Jerkbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.
- Large Jerkbait how: Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence. Slow down and lengthen the pause.
- Large Paddle-Tail Swimbait: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Paddle-Tail Swimbait how: Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. Rabbit-Strip Leech tracks well when leech_worm is a realistic meal. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.
- Large Rabbit Strip Streamer: It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Large Rabbit Strip Streamer how: Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

