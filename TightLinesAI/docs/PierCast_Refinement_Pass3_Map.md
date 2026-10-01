# PierCast refinement — Pass 3: premium Great Lakes map

Status: implemented on the next-build branch. No live deployment, OTA update, native build, or store submission is part of this pass.

## Product contract

- **Now** selects the closest complete model hour. It does not claim that the modeled surface is a live observation.
- **Forecast** exposes the complete synchronized hourly horizon. Scrubbing or playback changes the water-temperature rasters, selected-species city frames, city marker colors, wind vectors, wind particles, and timestamps together.
- **Match** colors each eligible city by the selected species’ modeled surface-temperature fit. Unsupported, restricted, incomplete, or stale frames remain neutral rather than becoming Poor.
- **Temp** shows the continuous NOAA modeled surface with city temperatures on the same fixed scale.
- **Depth** shows static NOAA bathymetry and contours. It remains clearly labeled as context and not for navigation.
- Observed stations are optional point readings in Now only. They remain visually and computationally separate from the continuous modeled surface and never change rankings.

## Persistent target control

- A compact `MATCH TARGET` control remains near the top layer controls.
- It displays the current species in every layer and opens the existing in-place target selector.
- Opening or changing the target does not move the camera or change the selected forecast hour.
- Target choice remains shared with the leaderboard and city report through the existing preference and route contract.
- Tapping a neutral city that does not support the current target opens a city-scoped selector instead of a broken report. Only that city’s supported targets are offered.

## Wind flow

- The default presentation is animated flow: two short particles travel along each exact-hour wind vector.
- Particle direction shows where wind travels; the source direction remains available in the node readout as where wind comes from.
- Animation changes particle position only. It does not interpolate wind speed, direction, gusts, or missing meteorological frames.
- Particle updates are isolated inside the wind layer instead of rerendering the complete map screen.
- Static directional arrows remain beneath the particles as a renderer fallback.
- System Reduce Motion automatically selects static arrows. A visible `FLOW / ARROWS` control also provides a manual lower-power fallback.
- Animation pauses while the app is inactive and resumes from the currently selected exact forecast frame.

## Visual and accessibility behavior

- The map retains FinFindr’s navy, paper, gold, and freshwater-blue visual system.
- Layer, time, target, wind, state, timeline, observation, and city controls expose selected or disabled accessibility state and descriptive labels.
- Wind legends retain speed colors, average/peak/gust summaries, travel-direction language, and the angler Push/Drift/Pull lens.
- City marker color and temperature update with the forecast frame; seasonal context remains textually separate.
- Missing foundation, city-frame, station, or basemap data has an explicit isolated fallback and retry path.

## Release boundary

- This code requires the MapLibre-capable development client already planned for native review.
- Pass 4 owns device screenshots, reduced-motion confirmation, animation smoothness and thermal checks, memory/performance review, and coordinated release readiness.
- The current installed application and deployed edge functions remain unchanged.
