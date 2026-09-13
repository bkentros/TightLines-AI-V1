# PierCast public-release readiness — 2026-09-13

**Decision: not yet public-release ready under the current validation requirements. No app build or submission was created.**

## Completed scope

Five cities, seven covered structures, 28 city/species combinations:

| City | Core species | Additions | Total |
|---|---|---|---:|
| Ludington | Chinook, coho, steelhead, brown trout | Smallmouth, yellow perch | 6 |
| Grand Haven | Chinook, coho, steelhead, brown trout | Freshwater drum, largemouth | 6 |
| Manistee | Chinook, coho, steelhead, brown trout | Lake trout, smallmouth, drum, perch | 8 |
| Frankfort–Elberta | Chinook, coho, steelhead, brown trout | None | 4 |
| Sheboygan | Chinook, coho, steelhead, brown trout | None | 4 |

Annual seasonal curves and species thermal compatibility profiles are configured. Roster admission and numerical configuration are complete for the private provisional scope; their existence does not establish empirical predictive accuracy. The authoritative evidence limits remain in [final roster reconciliation](PierCast_Final_Roster_Reconciliation.md).

Daily score locks, conditions refresh, durable caching, access dossiers, ingestion and lifetime free-report controls are implemented. Current verification: 143 PierCast tests pass; private-roster and Phase 3 generated-artifact checks pass; TypeScript passes. The sanitized retained Sheboygan source matches its updated evidence-ledger hash and byte count.

## Release blockers and decisions

1. **Scientific release standard:** current public gates require approved temperature representation and prospective outcome validation. Production aggregate checks found zero field-temperature observations and zero shadow outcomes/validation pairs. The [field program](PierCast_Field_Temperature_Program.md) explicitly requires physical deployment and elapsed evidence. Configuration switches cannot satisfy those requirements.
2. **Provisional launch alternative:** a public research-based product would require an explicit product-policy decision, a distinct provisional release state, truthful customer-facing limitations, and public serialization/tests for that state. Do not set scientific approval flags to true merely to allow launch. The release-policy decision has been requested from the owner and remains pending.
3. **Public-path integration:** public endpoints currently return no cities by design. All five cities, species and temperature gates must be reconciled with the chosen launch policy. Owner-review endpoints must remain restricted. Test the actual released catalog, top-five leaderboard, selected-city reports, free first-use/next-day lock, and saved-report recovery together against the chosen scope.
4. **Native paywall QA:** verify RevenueCat presentation, dismissal/reopening, purchase/restore and refreshed entitlement on iOS and Android. Backend tests verify HTTP paywall decisions, not native purchase sheets. No new production build is required for repository work, but an available development client/device is needed for this interaction check.
5. **Launch presentation:** home, welcome, subscription and how-it-works screens must agree with backend availability. Pending welcome layout improvements are retained; premature NEW/available flags are not shipped while public catalog cities remain empty.

## Reconciliation

Linked database dry run reports up to date, including lifetime allowance migration `20260913160000`. Deployed functions are ACTIVE: PierCast v21, ingestion v15, Color Match v15, admin trial reset v17. No new migration is needed for this readiness audit. No app build, submission, or public-rating enablement was performed.

The existing tests and completed roster support continuing release preparation. They do not justify declaring the public release complete while the items above remain unresolved.
