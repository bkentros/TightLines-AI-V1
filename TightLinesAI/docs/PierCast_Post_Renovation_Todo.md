# PierCast Post-Renovation Product Follow-Up

Status: confirmed follow-up work for the next development/production build

Implementation update: species thermal calibration (Pass 1), leaderboard and
city-report refinement (Pass 2), premium map target/wind work (Pass 3), and the
Pass 4 engineering/release audit are complete on the next-build branch. The
fresh-native-client device matrix remains an explicit external release gate;
the additive catalog v2 contract is deployed and legacy v3 has passed its
post-deployment production smoke. Nothing in this checklist authorizes an OTA,
native production build, or store submission.

The six-pass renovation and production backend rollout are complete. These
refinements must preserve the established visual language, the legacy live-app
compatibility boundary, and the separation between seasonal outlook and
temperature match.

## 1. Map target control

- Add a compact, persistent selected-species chip near the top Match control,
  such as `CHINOOK ▾`.
- Tapping it opens the existing in-place species selector without moving the
  camera or changing the selected forecast hour.
- Continue sharing the selected target across leaderboard, report, and map.

## 2. Wind-flow presentation

- Retain the current synchronized wind data, forecast frames, speed colors,
  gusts, compass direction, shoreline setup, and caution logic.
- Upgrade the visual presentation from a static directional-arrow field to a
  smooth Windy-style animated particle or streamline layer when technically
  and performance-feasible.
- Particle movement must show where wind travels and must update from the same
  exact timestamp used by the temperature surface, city Match frames, and
  Futurecast timeline.
- Retain the directional arrows as a reduced-motion, accessibility, low-power,
  and renderer-fallback mode. Never infer animation between missing frames.

## 3. Leaderboard hierarchy

- Keep Typical Seasonal Outlook as the dominant grouping and visual signal.
- Add a smaller right-side `TEMP FIT` treatment with a colored square and the
  Excellent/Good/Fair/Poor label.
- Keep the modeled temperature beneath or adjacent to that secondary signal.
- Make it visually clear that exact Temperature Match orders cities within the
  same seasonal band.

## 4. Species thermal-profile recalibration

- Revisit all 18 species profiles before the next production build.
- Audit Great Lakes-relevant optimum ranges, curve shoulders, accepted
  domains, and Excellent/Good/Fair/Poor boundaries.
- Prefer smooth, evidence-supported curves over false 1–3°F precision.
- Explicitly account for modeled nearshore surface-temperature limitations and
  life-stage differences only where the evidence supports them.
- Version every approved calibration change and rerun annual, boundary,
  leaderboard, map-frame, and city-report regression fixtures.

## Release boundary

- Do not publish an OTA update, production build, or store submission without
  explicit authorization.
- Keep the current installed app's legacy v3 endpoints compatible until the
  renovated production build is approved and released.
- Complete native visual review—including wind animation, map target control,
  and leaderboard hierarchy—in a MapLibre-capable development client.
