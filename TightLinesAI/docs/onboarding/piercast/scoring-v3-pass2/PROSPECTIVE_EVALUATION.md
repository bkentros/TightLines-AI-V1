# Formula v3 prospective evaluation

**Generated:** 2026-09-15T11:23:29.868Z
**Decision state:** insufficient prospective evidence

This report treats the FinFindr rating as an ordinal opportunity score, not a catch probability. AUC measures ranking discrimination only. It does not calibrate catch probability, erase access/weather limitations, or independently authorize promotion.

## Frozen eligible cohort

| Measure | Count |
|---|---:|
| V3 effort-aware outcomes | 0 |
| Same-outcome, same-issue v2 comparisons | 0 |
| Positive outcomes | 0 |
| Effort-backed zero catches | 0 |
| Cities represented | 0/9 |
| Species represented | 0/4 |

Only assessable lead-day-1 outcomes with positive effort, quantitative/direct evidence, and a forecast generated before the fishing date enter this primary cohort. The latest eligible forecast per outcome is selected deterministically.

## Ordinal discrimination

| Cohort | AUC | Mean positive score | Mean zero-catch score | Separation |
|---|---:|---:|---:|---:|
| V3 all eligible | n/a | n/a | n/a | n/a |
| V3 matched to v2 | n/a | n/a | n/a | n/a |
| V2 matched baseline | n/a | n/a | n/a | n/a |

## Promotion interpretation

The preregistered minimum coverage gate used by this tool is 200 eligible outcomes, at least 40 positives, at least 40 effort-backed zero catches, and representation from all 9 cities and all 4 species. Passing that sample gate only permits specialist interpretation. It does not replace source review, LMHOFS representation validation, uncertainty analysis, subgroup review, or explicit owner approval.

Raw machine summary:

```json
{
  "generatedAt": "2026-09-15T11:23:29.868Z",
  "cohort": {
    "v3EligibleOutcomes": 0,
    "matchedV2Outcomes": 0,
    "positive": 0,
    "effortBackedZeroCatch": 0,
    "cities": 0,
    "species": 0
  },
  "v3": {
    "auc": null,
    "meanPositive": null,
    "meanNegative": null,
    "meanSeparation": null
  },
  "matchedComparison": {
    "v3": {
      "auc": null,
      "meanPositive": null,
      "meanNegative": null,
      "meanSeparation": null
    },
    "v2": {
      "auc": null,
      "meanPositive": null,
      "meanNegative": null,
      "meanSeparation": null
    }
  }
}
```
