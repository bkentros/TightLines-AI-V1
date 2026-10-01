# PierCast Standings redesign (2026-09-29)

Owner-approved redesign of the PierCast landing page (the leaderboard). Design
mockup: "PierCast Standings Redesign" canvas. Code:
`components/pier-cast/PierCastStandings.tsx`,
`lib/pierCastStandingsPresentation.ts`, wired in `app/pier-cast-review.tsx`.
The v4 server contract and ranking are unchanged.

## Product decisions

- **First visit opens on a species.** With no remembered target, the screen
  fetches the salmon/trout leaderboards (Chinook, Coho, Steelhead, Brown Trout,
  Lake Trout, Atlantic Salmon) and opens on the one whose #1 city is best today
  (seasonal band, then thermal suitability, then that fixed order). Non-salmonid
  species never win this pick. If no salmonid has a ranked city, the in-season
  species with the best band is used. The automatic pick is **not** saved; only
  an explicit choice is remembered. This replaces the earlier "no default
  target" rule.
- **Rating words** map the seasonal band onto the app's five-band palette:
  excellent → Prime, good → Good, fair → Fair, poor → Poor,
  usually_off → **Off-season**. No combined /10 number is shown.
- **Hierarchy is visible.** Rows are grouped under their seasonal band; inside
  a group the note reads "Ordered by water-temp suitability" (server
  `thermalMatch.value`).
- **Top 5 by default**, expand/collapse for the rest. Lake filter (All / Michigan
  / Huron …, only lakes with cities) re-numbers ranks inside the lake and is
  remembered.
- **Find your PierCast** is species-free: search, then state sections
  (collapsed), split by lake where a state touches more than one. A city opens
  on the current target if it has it, else its first salmon/trout, else its
  first species.
- Weak days: when the leader is Poor or Off-season the card reads
  "Best available" and suggests up to three species rated Good or better.

## Copy rules (all derived from server fields)

| Copy | Source |
| --- | --- |
| Prime / Good / Fair / Poor / Off-season | `seasonalOutlook.band` |
| Stage phrase | `seasonalOutlook.stage`; "Peak season" only when stage is `active` and band is `excellent` |
| ↑ / ↓ | `seasonalOutlook.trend` building / fading (steady shows nothing) |
| "right in range" | `thermalMatch.distanceFromOptimumC ≤ 0.05` |
| "a touch / running / too cool·warm" | outside the optimum range, by `thermalMatch.band` (excellent·good / fair / poor); direction from `temperatureC` vs `optimumRangeC` |
| Not-rated reasons | `targetingEligibility` and reason codes |
| Updated Xh ago | `leaderboard.generatedAt` |

Tests: `node --import tsx --test scripts/pier-cast-standings-redesign.test.ts`
plus the updated source-contract tests (refinement-pass2, renovation-pass1/3/6,
covered-structures, species-presentation).
