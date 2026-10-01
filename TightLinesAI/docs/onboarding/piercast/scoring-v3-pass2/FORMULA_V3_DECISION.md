# Formula v3 decision

## Decision

Formula v3 uses the strongest single evidence-supported opportunity mode:

`score = 1 + ((1 + (F - 1)A) - 1) × (0.30 + 0.70T)`

where `F` is absolute cross-city fishery strength, `A` is recurring seasonal availability, and `T` is nearshore thermal fit. The result is bounded by `1 ≤ score ≤ seasonalPotential ≤ F ≤ 10`.

## Why this fits the product

- A genuinely stronger pier fishery retains the higher ceiling under equal timing and temperature.
- Every supported fishery can reach its own evidence-reviewed ceiling when availability and thermal fit are ideal.
- The full product scale is real: Manistee fall steelhead can reach 10.0; a fishery calibrated at 7.2 cannot.
- Temperature stays meaningful without giving a city an unsupported bonus or lifting a score above its researched strength.
- Separate spring, summer, fall, and winter modes stop broad interpolation from creating long artificial seasons.
- Selecting `max(modeScore)` prevents overlapping modes from stacking.
- Evidence quality remains a promotion gate and label; it is not a hidden numeric discount.

## Rejected alternatives

- Adding modes: manufactures opportunity during overlaps.
- Universal monthly multipliers: erases real city and fishery differences.
- Giving every city a path to 10: changes the scale from absolute opportunity to within-city optimism.
- Keeping v2's 1.05 ideal-fit headroom: permits the environmental input to exceed researched local fishery strength.
- Multiplying directly by `T`: makes a poor thermal fit erase all opportunity above 1 and overstates the precision of a provisional surface-temperature proxy.

## Future thermal modes

Pass 1 supports only shared species thermal-response hypotheses. The v3 pipeline therefore requires all modes within a city/species pair to reference the same reviewed curve and fails closed if they differ. A future mode-specific thermal curve requires its own evidence review and a crossing-aware daily integration change before import.
