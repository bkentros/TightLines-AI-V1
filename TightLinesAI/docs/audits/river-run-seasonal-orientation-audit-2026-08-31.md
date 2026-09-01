# River Run seasonal orientation and Spot Finder correction audit

**Date:** 2026-08-31  
**Scope:** 18 configured/owner-review rivers, 58 independently configured runs  
**Release effect:** implementation and owner review only; no river was promoted,
deployed, or publicly enabled by this correction

## Decision

The former Seasonal Zone algorithm applied one generic downstream-to-upstream
shape to every run. It was safe but insufficiently river-specific, treated late
salmon and living fall-entry fish alike, excluded supported urban harbor reaches,
and supplied no useful nearby-water direction before dependable entry.

The replacement is configuration-led:

- every run carries a versioned `seasonalZonePlan` with exact foundation reach
  IDs for Beginning, early/established/broad Building, Peak, Tapering, and
  Ending;
- staging and Beginning may show one sourced, non-expandable early-approach
  label;
- the approach label is never an access record or section recommendation;
- recommended sections still require exact overlap with the audited Spot Finder
  inventory, selected state, species endpoint, and active phase reaches;
- missing plans, empty overlap, missing inventories, and presentation-state
  mismatch fail closed.

## Portfolio reconciliation

The table is a compact digest. Exact reach IDs, versions, and run-specific
rationales are executable in
`supabase/functions/_shared/riverRunEngine/config/seasonalZonePlans.ts`.

| River | Runs independently reconciled | Early approach | Phase behavior accepted |
| --- | --- | --- | --- |
| Pere Marquette | Chinook, coho, fall-entry Steelhead | Lake Michigan/Ludington harbor/Pere Marquette Lake/mainstem mouth | Lower entry; three-reach broadening; late salmon middle+upper; late Steelhead full corridor |
| Betsie | Chinook, coho, fall-entry Steelhead | Lake Michigan/Frankfort-Elberta harbor/Betsie Lake transition | Honest two-reach plan; late salmon upper section; late Steelhead both sections; never invents a middle reach |
| Big Manistee | Chinook, coho, fall-entry Steelhead, lake-run Brown Trout | Manistee Lake/harbor/river entrance | Lower entry; middle/tailwater establishment; full Peak; spawning runs late middle+Tippy; Steelhead full corridor |
| Muskegon | Chinook, coho, fall-entry Steelhead | Lake Michigan/channel/Muskegon Lake/river entrance | Lower entry; middle and Croton broadening; spawning runs late middle+Croton; Steelhead full corridor |
| St. Joseph | Chinook, coho, fall-entry Steelhead | Lake Michigan/St. Joseph harbor/mouth | Lower Michigan entry; ladder-corridor expansion; state clipping; late salmon Niles-to-Twin Branch; Steelhead retains verified full corridor |
| Grand | Chinook, coho, fall-entry Steelhead | Lake Michigan/Grand Haven mouth | Chinook remains on its two-reach Webber-limited endpoint; coho and Steelhead use separately accepted three-reach plans |
| Platte | Chinook, coho, fall-entry Steelhead | Platte Bay/Platte River Point/lower entrance | Concentrated two-reach plans ending at the signed weir closure; Spot Finder remains unavailable because practical fishing access is unresolved |
| White | Chinook, coho, fall-entry Steelhead | White Lake/lake-to-river transition | Lower entry; forest/upper broadening below Hesperia; late salmon upper two; Steelhead full corridor |
| Milwaukee | Chinook, coho, fall-entry Steelhead, lake-run Brown Trout | Lake Michigan/Milwaukee Harbor/mouth | Audited harbor is a real supported section; salmon later favor river reaches; living runs retain full corridor |
| Sheboygan | Chinook, coho, fall-entry Steelhead, lake-run Brown Trout | Lake Michigan/Sheboygan Harbor/lower-city mouth | Audited harbor entry; urban/Kohler broadening; salmon late urban+terminal; living runs full corridor |
| Root | Chinook, coho, fall-entry Steelhead, lake-run Brown Trout | Lake Michigan/Racine Harbor/mouth | Audited harbor entry; city/Lincoln Park broadening; salmon late river sections; living runs full corridor |
| Bois Brule | Chinook, coho, fall-entry Steelhead, lake-run Brown Trout | Lake Superior/mouth/lower entrance | Lower entry; rapids/upper-lower broadening below Highway 2; late salmon upper two; living runs full corridor |
| Green/Duwamish | Chinook, coho | Puget Sound/Duwamish estuary/lower approach | Lower entry has no forced access match; Auburn overlap begins during Building; plan stops below Tacoma watershed boundary |
| Puyallup | Chinook, coho | Commencement Bay/11th Street mouth | Lower entry deliberately has no public-access recommendation; middle/upper recommendations begin only on audited overlap; stops at Carbon confluence |
| Cowlitz | Chinook, coho | Columbia confluence/lower Cowlitz mouth | Lower-to-middle-to-Barrier progression; late established middle/Barrier reaches; never includes transported upstream destinations |
| Salmon River (NY) | Chinook, coho, fall-entry Steelhead, lake-run Brown Trout | Lake Ontario/Port Ontario/estuary/mouth | Lower entry; middle/Altmar broadening; late spawning runs middle+upper; Steelhead full corridor; stops at Lighthouse Hill tailrace |
| Oak Orchard Creek | Chinook, coho, fall-entry Steelhead, lake-run Brown Trout | Lake Ontario/Point Breeze harbor/mouth | Lower entry; middle/Waterport broadening; spawning runs late middle+upper; Steelhead full corridor; stops below Waterport Dam |
| Lower Genesee | Chinook, fall-entry Steelhead, lake-run Brown Trout | Lake Ontario/Charlotte/Port of Rochester/mouth | Harbor entry; gorge/Lower Falls broadening; spawning runs late gorge+falls; Steelhead full corridor; unsupported coho remains absent |

## Evidence and safety reconciliation

This correction reused the accepted primary-source and owner-review records that
already establish each corridor, receiving water, barrier, species endpoint,
distribution scope, regulation window, and fishing-access inventory. The six
current onboarding dossiers were amended. Earlier public rivers retain their
foundation/audit sources, including the Pere Marquette, Betsie, Big Manistee,
Muskegon, and St. Joseph copy foundations; Grand/Platte/White portfolio audits;
and Wisconsin configuration evidence. No social report, guide advertisement,
or inferred roadside access was added.

Important fail-closed outcomes:

- nearby water is direction only; it has no dropdown, pin, access badge, or
  implied legal status;
- Green and Puyallup do not redirect Beginning users to the first available
  upstream access when the active lower reach lacks audited access;
- Platte remains without Spot Finder;
- Grand Chinook cannot cross its species endpoint;
- St. Joseph state views clip the plan to that jurisdiction's configured
  reaches;
- every terminal reach remains below its accepted dam, falls, weir, watershed,
  or facility exclusion.

## Presentation corrections

- Migration Stage keeps its strong phase label and now adds one concise global
  interpretation sentence.
- Activity now carries a high-contrast `ONLY IF FISH ARE PRESENT` notice that
  explicitly separates responsiveness from presence, abundance, and catch
  probability.
- Spot Finder owns all geography. Stage remains timing-only, and the client has
  no parallel progression algorithm.

## Re-audit triggers

Reopen the affected river/run plan for a calendar change, new or removed
barrier, passage revision, species endpoint change, material distribution
evidence, regulation-window change, public-access inventory change, or a newly
accepted harbor/mouth fishing source. A plan is not copied to a new species or
river without independent reconciliation.

## Final verification and handoff

Final verification completed on 2026-09-01:

- the engine and endpoint suite passed 463 tests with zero failures;
- the generated owner-review suite is current at 1,425 scenarios across 32
  supported review runs, while the full runtime/catalog validation covers all
  58 configured and owner-review runs;
- public-river acceptance, compact-copy, visual, UI, free-trial, onboarding,
  weather-only Activity, and review-mode gates passed;
- all six pending river packets passed the `owner-review` gate;
- TypeScript validation passed;
- the live Spot Finder source audit passed 161 entries and 61 unique reputable
  URLs with zero HTTP or page-not-found failures;
- no database schema or data migration was required or created, and the linked
  Supabase migration ledger matched local migrations through
  `20260831120000`;
- no run calendar, historical run-strength ceiling, Fish in River curve, mean
  Activity score, Fishability scoring rule, entitlement, or public release flag
  changed as part of this correction.

The implementation is ready for owner review. Washington and New York remain
hidden in owner-review state, and no function deployment or public release has
been performed.
