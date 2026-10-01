# PierCast city report redesign (2026-09-29)

Owner-approved redesign of the PierCast city report. It describes one city,
not one species. Design mockup: "PierCast Standings Redesign" canvas, Report
board. Code: `components/pier-cast/PierCastConditionsUI.tsx`
(`PierCastConditionsCityReport`), `components/pier-cast/PierCastVisuals.tsx`
(`PierCastCityTemperatureChart`), `lib/pierCastCityReportPresentation.ts`,
wired in `app/pier-cast-review.tsx`.

## Layout (top to bottom)

1. **Hero:** city, state, lake, piers, "Updated Xh ago", the top pick today
   (the species list's leader) and three stats: water now, species count,
   species rated Prime today.
2. **Five-day outlook:** one tile per local day showing that day's best
   species, its rating word and color (Prime / Good / Fair / Poor /
   Off-season) and the air high/low. There is no score. Tapping a day changes
   the hourly strip.
3. **Species at the city:** species ranked with the leaderboard rule, with a
   season meter, trend arrow, "#N of M in standings", and a water-fit bar with
   the ideal range. Top 4 plus "Show all". Tapping a species opens its standings.
4. Access notice.
5. **Pier conditions:** water, air and wind now, then an hourly strip every
   2 hours for the selected day with wind direction.
6. **Temperature outlook:** now / +12 / +24 hrs, then the chart. The left axis
   is °F, and the bottom axis shows each day ("TODAY", "WED 30" …) with that
   day's low–high. Shift windows are shaded; high and low are marked; press and
   drag reads any hour.
7. **Water temp shifts:** one card per shift ("Drop of 8.7°F", "61.8° →
   53.1°F over 27 hrs", "now to Wed 7 PM", and a position bar), plus a
   "What do shifts mean?" toggle.
8. Piers, nearby ports, "How ratings work", disclaimer.

Removed from reports: the species picker, the combined score, onshore/offshore
wind, and the request-a-city form (it stays on the landing page).

## Server additions (additive; `supabase functions deploy pier-cast`)

`projectPierCastConditionsCityReportV4` now also returns:

- `dailyOutlook[]` (up to 6 local days). `best` is the species that ranks first
  at the city that day under the leaderboard rule. Today uses the current
  modeled temperature, so it matches the species list; later days use the
  day's mean modeled temperature at that date. Each day also carries its
  temperature range.
- `speciesStandings[]`: the city's current rank in each species' leaderboard.
  It is empty for a one-city outlook (an adapted legacy saved report).

Both fields are optional on the client. Without them, the calendar shows today's
best species and water ranges for later days, and the standings tags are hidden.

Water-temp shifts come from the shared `detectPierCastTemperatureEvents`, run
on the client against the report's own timeline. Shift thresholds in the copy
(3°F minimum, 6°F/day notable, 10°F/day or 8°F/12 h major) match
`PIER_CAST_TEMPERATURE_EVENT_CONFIG`.

Tests: `node --import tsx --test scripts/pier-cast-city-report-redesign.test.ts`
plus the updated source-contract tests.
