import type { PierCastUnavailableReasonCode } from "../types.ts";

export const PIER_CAST_UNAVAILABLE_COPY: Record<
  PierCastUnavailableReasonCode,
  string
> = {
  rating_not_enabled:
    "FinFindr has not enabled this rating for the selected city and species.",
  calibration_not_approved:
    "The opportunity model has not completed calibration for this profile.",
  temperature_missing:
    "The required water-temperature forecast is unavailable.",
  temperature_stale:
    "The available water-temperature forecast is too old to rate this date.",
  temperature_partial_horizon:
    "The water-temperature forecast does not cover the complete assessment period.",
  temperature_representation_unreviewed:
    "The city water-temperature source has not been approved for PierCast ratings.",
  temperature_out_of_domain:
    "The water temperature is outside the model's reviewed range.",
  temperature_curve_invalid:
    "The configured temperature model failed validation.",
  month_biology_unsupported:
    "The seasonal temperature profile for this species and date is not sufficiently supported.",
};

export const PIER_CAST_RATING_DISCLOSURE =
  "FinFindr Opportunity Ratings estimate relative fishing opportunity from configured city-and-species seasonal timing and water-temperature suitability. They are not detected fish presence, fish counts, catch probabilities, or biological measurements.";
