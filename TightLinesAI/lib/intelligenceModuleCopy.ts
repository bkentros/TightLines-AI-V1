/**
 * Shared short descriptions for customer-facing intelligence-module lists.
 * Keep these as similarly sized noun phrases so cards align and every surface
 * describes a feature in the same voice.
 */
export const INTELLIGENCE_MODULE_DESCRIPTIONS = {
  "todays-bite": "Daily fishing conditions and best times",
  "tackle-box": "Condition-matched lure and fly picks",
  "river-run": "River run timing, activity, and conditions",
  "pier-cast": "Great Lakes pier conditions and forecasts",
  "color-match": "Lure and fly colors for clarity and light",
  "water-read": "Lake structure and likely fishing zones",
} as const;

export type IntelligenceModuleCopyId = keyof typeof INTELLIGENCE_MODULE_DESCRIPTIONS;
