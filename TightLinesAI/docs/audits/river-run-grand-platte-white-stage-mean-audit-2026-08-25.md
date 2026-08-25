# Grand, Platte, and White Activity stage-mean audit

**Audit date:** 2026-08-25
**Result:** Accepted
**Metric:** Mean daily Activity score on a 0–100 scale

## Decision

All nine Grand, Platte, and White river/species combinations pass the Activity
stage audit. Every final replay has complete four-hour blocks, valid daily
rollups, complete and scoped copy, enforced lifecycle and environmental caps,
and zero invariant failures.

Stage means are diagnostics for conditional responsiveness of fish that are
present. They are not abundance, migration strength, catch probability, or
stage scores. The Fish in River and Run Stage primitives remain responsible for
presence and lifecycle timing.

## Final stage means

### Grand — observed river mode

Grand Activity uses Fulton flow, North Park measured water temperature, and
Grand Rapids hourly weather. Scores represent the downtown Grand Rapids
mainstem context. Coverage is the set of days on which all required historical
inputs were present.

| Species | Coverage | Pre-run | Beginning | Building | Peak | Tapering | Ending | Post-run |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Chinook | 584 / 588 (99.3%) | 26.42 | 29.33 | 37.39 | 54.03 | 48.11 | 45.94 | 38.43 |
| Coho | 641 / 678 (94.5%) | 22.76 | 29.21 | 33.65 | 44.02 | 40.00 | 36.90 | 26.18 |
| Steelhead | 724 / 768 (94.3%) | 26.50 | 36.51 | 73.58 | 82.90 | 66.75 | 60.95 | 57.00 |

Historically warm Grand water still suppresses early salmon responsiveness, but
an audited response-stage adjustment prevents temperature from erasing the
intended lifecycle shape. Peak is now the highest mean, Building and Tapering
form restrained shoulders, and the outside stages remain lower. The adjustment
cannot bypass warm, barrier, blown-out, missing-input, or 96-point exceptional
score ceilings.

Steelhead shows the expected warm-water suppression before the run, strong
building/peak responsiveness as the river cools, and persistent but moderated
late-season activity without salmon mortality logic.

### Platte — weather-only mode

Platte has no accepted representative live temperature or hydraulic input for
the lower migratory corridor. Activity therefore uses lower-river weather only,
is Limited confidence, and never claims measured river behavior.

| Species | Coverage | Pre-run | Beginning | Building | Peak | Tapering | Ending | Post-run |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Chinook | 1,957 / 1,957 (100%) | 74.83 | 73.87 | 78.79 | 77.59 | 72.98 | 56.90 | 45.41 |
| Coho | 1,957 / 1,957 (100%) | 73.67 | 74.85 | 72.88 | 75.46 | 70.85 | 54.46 | 40.16 |
| Steelhead | 2,736 / 2,736 (100%) | 58.77 | 59.65 | 61.42 | 64.63 | 65.49 | 68.54 | 69.43 |

Chinook and Coho retain a smooth terminal decline. Steelhead does not receive
salmon deterioration or mortality penalties; its modest late rise reflects the
historical weather distribution, while the weather-only evidence scale prevents
secondary inputs from claiming observed-river certainty.

### White — weather-only mode

White has no accepted representative live temperature or hydraulic input for
the below-Hesperia migratory corridor. Activity therefore uses Pines Point
weather only, is Limited confidence, and never claims measured river behavior.

| Species | Coverage | Pre-run | Beginning | Building | Peak | Tapering | Ending | Post-run |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Chinook | 1,862 / 1,862 (100%) | 74.96 | 74.38 | 75.28 | 77.86 | 71.97 | 54.08 | 43.52 |
| Coho | 1,824 / 1,824 (100%) | 73.12 | 73.80 | 75.10 | 78.42 | 70.31 | 57.07 | 41.98 |
| Steelhead | 1,748 / 1,748 (100%) | 62.04 | 63.92 | 64.09 | 67.66 | 67.94 | 68.57 | 68.32 |

Chinook and Coho build into peak and decline smoothly through terminal stages.
Steelhead remains broadly stable because it has neither salmon terminal logic
nor direct temperature evidence.

## Five-river reference set

The established comparison set is Pere Marquette, Betsie, Big Manistee,
Muskegon, and St. Joseph. The table reports the five-river arithmetic mean and
the minimum–maximum range of the five river-level means. It is a context band,
not an acceptance target, because Betsie is weather-only and the other four use
observed river inputs.

| Species | Stage | Five-river mean | Range |
| --- | --- | ---: | ---: |
| Chinook | Pre-run | 46.91 | 27.10–73.06 |
| Chinook | Beginning | 52.39 | 27.85–77.82 |
| Chinook | Building | 67.58 | 51.29–75.33 |
| Chinook | Peak | 78.90 | 75.38–82.64 |
| Chinook | Tapering | 74.08 | 69.63–78.71 |
| Chinook | Ending | 54.07 | 52.09–60.16 |
| Chinook | Post-run | 40.51 | 38.20–47.35 |
| Coho | Pre-run | 38.46 | 20.93–75.23 |
| Coho | Beginning | 52.99 | 27.38–74.12 |
| Coho | Building | 74.93 | 69.86–81.35 |
| Coho | Peak | 81.05 | 79.49–82.68 |
| Coho | Tapering | 73.29 | 70.49–74.83 |
| Coho | Ending | 51.92 | 47.19–64.10 |
| Coho | Post-run | 35.80 | 31.84–48.61 |
| Steelhead | Pre-run | 37.02 | 13.20–74.14 |
| Steelhead | Beginning | 55.99 | 34.30–75.56 |
| Steelhead | Building | 81.41 | 77.96–84.64 |
| Steelhead | Peak | 76.69 | 72.00–83.35 |
| Steelhead | Tapering | 68.27 | 59.74–85.45 |
| Steelhead | Ending | 66.18 | 56.74–86.82 |
| Steelhead | Post-run | 66.41 | 56.67–85.79 |

### Individual five-river means

| Species | River | Pre-run | Beginning | Building | Peak | Tapering | Ending | Post-run |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Chinook | Pere Marquette | 67.39 | 77.82 | 75.33 | 80.67 | 72.78 | 52.29 | 39.50 |
| Chinook | Betsie | 73.06 | 73.82 | 75.28 | 75.38 | 69.63 | 60.16 | 47.35 |
| Chinook | Big Manistee | 32.28 | 39.79 | 71.83 | 82.64 | 78.71 | 52.88 | 38.56 |
| Chinook | Muskegon | 27.10 | 27.85 | 51.29 | 78.42 | 76.67 | 52.09 | 38.92 |
| Chinook | St. Joseph | 34.74 | 42.66 | 64.16 | 77.37 | 72.63 | 52.92 | 38.20 |
| Coho | Pere Marquette | 49.15 | 70.93 | 78.07 | 81.93 | 73.89 | 47.19 | 32.60 |
| Coho | Betsie | 75.23 | 74.12 | 75.06 | 79.49 | 72.45 | 64.10 | 48.61 |
| Coho | Big Manistee | 25.93 | 54.41 | 81.35 | 82.68 | 74.83 | 49.84 | 31.84 |
| Coho | Muskegon | 20.93 | 27.38 | 69.86 | 81.41 | 74.77 | 50.08 | 33.21 |
| Coho | St. Joseph | 21.06 | 38.12 | 70.32 | 79.76 | 70.49 | 48.41 | 32.74 |
| Steelhead | Pere Marquette | 63.31 | 75.56 | 84.62 | 72.00 | 67.53 | 66.00 | 67.50 |
| Steelhead | Betsie | 74.14 | 75.16 | 79.49 | 83.35 | 85.45 | 86.82 | 85.79 |
| Steelhead | Big Manistee | 21.16 | 57.69 | 84.64 | 73.37 | 59.74 | 56.74 | 56.67 |
| Steelhead | Muskegon | 13.27 | 37.23 | 80.35 | 79.11 | 64.73 | 60.35 | 60.32 |
| Steelhead | St. Joseph | 13.20 | 34.30 | 77.96 | 75.63 | 63.88 | 61.00 | 61.77 |

## Historical-artifact repairs made during this audit

- The four previously saved St. Joseph-independent river sets were found.
- St. Joseph had configuration, tests, and review fixtures but no persisted
  historical Activity replay. All three species were replayed and persisted for
  2012–2025, the fixed interval with reliable Niles flow and temperature
  coverage. Coverage is 97.9% Chinook, 96.6% Coho, and 95.2% Steelhead.
- Pere Marquette's full artifacts contained stage counts and label shares but
  omitted numeric stage distributions. The original full replay harness now
  persists `byStage` day counts, score distributions, and labels; all three
  species were regenerated from their full 2021–2025 input set.
- All 24 final river/species artifacts in the eight-river comparison have zero
  recorded invariant failures.

## Acceptance interpretation

The new rivers should not be tuned merely to force their stage means inside the
five-river range:

- Grand is the only new river with accepted observed flow and temperature, so
  its low warm-season salmon means contain information the weather-only scores
  cannot express.
- Platte and White deliberately remain less specific. Their early salmon means
  describe weather-conditioned responsiveness only; presence remains governed
  by Fish in River.
- Weather-only Steelhead is deliberately lower and flatter than fully observed
  building/peak behavior because the dominant temperature evidence is unknown.

On those contracts, the nine distributions are coherent and accepted. Grand's
accepted v3 revision additionally requires Peak to be the highest mean,
Building and Tapering to remain within 20 points of Peak, and every outside
stage to remain below Peak.
