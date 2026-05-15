import type {
  EngineContext,
  ScoreBand,
  TemperatureNormalized,
} from "../contracts/mod.ts";
import {
  chanceDeterministic,
  pickDeterministic,
} from "../copy/deterministicPick.ts";

type SummaryFactor = {
  variable: string;
  weightedContribution?: number;
  normalizedScore?: number;
  engineLabel?: string;
  temperatureBreakdown?: TemperatureNormalized | null;
};
type SummaryFactorRole = "driver" | "suppressor";
type SummaryStrength = "slight" | "moderate" | "strong";

export type ReportSummaryInput = {
  band: ScoreBand;
  score: number;
  context: EngineContext;
  reliability: "high" | "medium" | "low";
  drivers: SummaryFactor[];
  suppressors: SummaryFactor[];
  seed: string;
};

const OPENERS: Record<ScoreBand, readonly string[]> = {
  Prime: [
    "This is a strong daily read.",
    "Conditions are lining up well today.",
    "The overall setup looks very favorable.",
    "This is one of the cleaner reads on the calendar.",
    "Several important signals are working together today.",
    "The day gives you a useful conditions advantage.",
    "Most of the major signals lean favorable today.",
    "This is the kind of setup that rewards a clear plan.",
    "The day sets up well across the main inputs.",
    "The overall picture is supportive today.",
    "This is a strong setup with room to fish thoughtfully.",
    "The conditions give you a useful edge today.",
  ],
  Good: [
    "This is a solid daily read.",
    "Overall, the setup leans helpful.",
    "The main signals lean helpful today.",
    "The setup gives you a workable starting point.",
    "This is a dependable setup overall.",
    "Today's conditions give you a good starting point.",
    "The overall picture leans your way today.",
    "This is a day to fish with a clear plan.",
    "The main conditions lean helpful today.",
    "This looks like a fishable day with upside.",
    "The main conditions point toward a useful window.",
    "There is enough going right to build a steady plan.",
  ],
  Fair: [
    "This is a fishable day with a narrower best window.",
    "The setup is fishable, but mixed.",
    "The best window is narrower than a clean day.",
    "The overall read is mixed enough to stay selective.",
    "This is a mixed day overall.",
    "Mixed conditions make timing and water choice more important.",
    "You can fish this day, but timing and water choice matter.",
    "The read is mixed enough that timing matters.",
    "This is a fair day with a tighter margin.",
    "A defined window matters more than the full-day average today.",
    "This is a day to respect the strongest window.",
    "There is enough help to fish, but the margin still matters.",
  ],
  Poor: [
    "This is a tougher day than usual.",
    "The setup is mostly restrictive today.",
    "The day looks narrow and demanding.",
    "This is more of a lower-margin day than a clean one.",
    "There is not much help in the conditions today.",
    "The overall picture is fairly restrictive.",
    "This is the kind of day that asks for patience.",
    "The day does not offer many easy condition advantages.",
    "This setup asks you to be more selective today.",
    "There are more limitations than help here.",
    "This is a tougher read from top to bottom.",
    "The day offers few easy condition advantages.",
  ],
  Tough: [
    "This looks like a difficult fishing day.",
    "The setup is restrictive today.",
    "Conditions look tough from the start.",
    "This is a low-margin day.",
    "The day offers limited easy help.",
    "This is one of the more difficult reads on the calendar.",
    "Most of the important signals are not helping today.",
    "This is a day for low expectations and careful choices.",
    "The setup is narrow and demanding.",
    "There is not much natural edge in the conditions today.",
    "This is a tough setup from top to bottom.",
    "The day asks for patience and careful choices.",
  ],
};

const MIXED_TEMPLATES_SOFT = [
  "{driver}, while {suppressor}.",
  "{driver}. At the same time, {suppressor}.",
  "{driver}. The main caution is that {suppressor}.",
  "{driver}, and {suppressor}.",
  "{driver}. Keep the plan measured because {suppressor}.",
] as const;

const MIXED_TEMPLATES_STRONG = [
  "{driver}. Still, {suppressor}.",
  "{driver}, although {suppressor}.",
  "{driver}, while {suppressor}.",
  "{driver}. Balance that with the fact that {suppressor}.",
  "{driver}. The main caution is that {suppressor}.",
] as const;

const POSITIVE_TEMPLATES_SOFT = [
  "{driver}.",
  "One useful advantage is that {driver}.",
  "The clearest helper is that {driver}.",
  "{driver}, which gives the plan a steadier starting point.",
] as const;

const POSITIVE_TEMPLATES_STRONG = [
  "{driver}.",
  "The strongest support is that {driver}.",
  "The clearest helper is that {driver}.",
  "{driver}, which gives the plan a useful starting point.",
] as const;

const SUMMARY_MAX_LEN = 220;

const NEGATIVE_TEMPLATES_SOFT = [
  "{suppressor}.",
  "The main caution is that {suppressor}.",
  "The narrowest part of the read is that {suppressor}.",
  "The report is asking for care because {suppressor}.",
  "Plan a little more carefully because {suppressor}.",
] as const;

const NEGATIVE_TEMPLATES_STRONG = [
  "{suppressor}.",
  "The main caution is that {suppressor}.",
  "The narrowest part of the read is that {suppressor}.",
  "The report is asking for care because {suppressor}.",
  "Keep the plan conservative because {suppressor}.",
] as const;

const NEUTRAL_CLOSERS = [
  "No one factor is dominating the day.",
  "Nothing is taking over the read by itself.",
  "This is a balanced day more than a dramatic one.",
  "Wind, light, and water conditions need to be read together today.",
  "The day is not being carried by one obvious thing.",
  "The day depends more on timing than on one obvious condition edge.",
  "No single factor stands above the rest.",
  "It is a broad setup rather than a sharp one.",
] as const;

const CONTEXT_TOUCHES: Record<EngineContext, readonly string[]> = {
  freshwater_lake_pond: [
    "On a lake or pond day, steady adjustments usually beat constant change.",
    "For still water, timing and water choice matter more than doing too much.",
    "Lake days like this usually reward a patient, organized plan.",
    "On still water, a simple plan usually holds up best.",
  ],
  freshwater_river: [
    "On a river day, staying disciplined usually matters more than covering too much water.",
    "River setups like this usually reward precision over extra motion.",
    "In moving water, precise choices usually beat rushed ones.",
    "For rivers, the better move is usually to stay precise and controlled.",
  ],
  coastal: [
    "On an inshore day, timing usually matters more than extra effort.",
    "Coastal setups like this usually reward staying disciplined once the window shows up.",
    "For inshore water, a simple plan usually holds up well.",
    "On coastal days, timing and water movement usually matter more than extra effort.",
  ],
  coastal_flats_estuary: [
    "On the flats, small advantages usually matter more than big guesses.",
    "Flats days like this usually reward a calm, precise approach.",
    "In a flats setup, subtle water and light changes matter more than extra motion.",
    "For flats and estuary water, subtle adjustments usually decide more than big ones.",
  ],
};

const RELIABILITY_CLOSERS: Record<"medium" | "low", readonly string[]> = {
  medium: [
    "This is still a useful read, just a little broader than the clearest cases.",
    "The call is still useful, but lean on the main signals more than fine detail.",
    "The read is still solid, just a touch broader than the most precise cases.",
    "This is a useful read, but it is better as direction than over-precision.",
    "The main setup is still useful here, even if the read should stay a little broad.",
  ],
  low: [
    "Some inputs are limited, so treat this as a broader read.",
    "Data is thinner than usual, so leave room for local adjustment.",
    "Key inputs were limited, so treat this as a broad read rather than a precise one.",
    "The read still points you in the right direction, but the precision is looser than normal.",
    "Important inputs were thinner than usual, so this is more directional than exact today.",
    "This remains useful, but leave yourself more room to adjust than usual.",
    "The read still helps, but it should be treated as broad guidance today.",
  ],
};

type SummaryPhraseBank = Record<SummaryFactorRole, readonly string[]>;

const TEMPERATURE_SUMMARY_PHRASES: SummaryPhraseBank = {
  driver: [
    "air temperatures line up well for this time of year",
    "air temperatures are in a favorable seasonal range",
    "the temperature read is on the helpful side for this date",
    "temperatures are in a good seasonal range",
    "temperatures are on your side today",
    "the temperature pattern for this date is giving the read support",
    "air temperatures are matching the season well enough to help",
    "the seasonal temperature check looks supportive today",
  ],
  suppressor: [
    "air temperatures are not lining up as well for this time of year",
    "air temperatures sit outside the better seasonal range",
    "the temperature read is giving the setup less support",
    "temperatures are outside the more helpful seasonal range",
    "the temperature pattern for this date is giving the read less support",
    "temperature is one seasonal condition to respect today",
    "air temperatures are less aligned with the season than you would like",
    "the seasonal temperature check is not as supportive today",
  ],
};

const SUMMARY_PHRASES: Partial<Record<string, SummaryPhraseBank>> = {
  pressure_regime: {
    driver: [
      "pressure is helping the day",
      "pressure is giving the setup some support",
      "the pressure trend is in your favor",
      "pressure is adding a useful nudge",
      "pressure is on the helpful side today",
      "pressure is supporting the overall setup",
      "the pressure read is leaning favorable",
      "the pressure pattern is one of the better signals",
    ],
    suppressor: [
      "pressure is not helping as much today",
      "pressure is giving the setup less support",
      "the pressure pattern is one of the day's cautions",
      "pressure is narrowing the margin a bit",
      "the pressure read is leaning less favorable",
      "pressure is asking for a more conservative plan",
      "pressure is making the read a little tighter",
      "pressure is a condition to respect today",
    ],
  },
  wind_condition: {
    driver: [
      "wind is helping you today",
      "wind is giving the setup some useful cover",
      "the wind read is in your favor",
      "wind is adding support to the plan",
      "wind is on your side today",
      "wind is in your favor today",
      "wind is adding enough movement to help",
      "wind is a helpful part of the read",
    ],
    suppressor: [
      "wind is making control more important",
      "wind is not offering as much help today",
      "the wind setup is narrowing the margin",
      "wind is adding friction to the plan",
      "wind is asking for cleaner angles",
      "wind is a condition to respect today",
      "the wind read is making the plan more selective",
      "wind is making exposed water less efficient",
    ],
  },
  light_cloud_condition: {
    driver: [
      "light and cloud cover are helping the day",
      "the sky setup is in your favor",
      "cloud cover and light are adding support",
      "light conditions are on your side",
      "clouds are helping you out today",
      "cloud cover is in your favor today",
      "the light read is giving you a useful advantage",
      "the sky read is supporting the plan",
    ],
    suppressor: [
      "the sky setup is making the window narrower",
      "cloud cover and light are asking for better timing",
      "light and cloud cover are giving the read less support",
      "light conditions are making the plan more selective",
      "the sky setup is one of the day's cautions",
      "cloud cover is not giving you as much help today",
      "the light read is asking for a more careful window",
      "the sky read is narrowing the margin",
    ],
  },
  precipitation_disruption: {
    driver: [
      "rain is staying quiet today",
      "rain is staying out of the day’s way",
      "the rain signal is quiet enough to help",
      "recent rain is not adding much disruption",
      "rain is not complicating the read much today",
      "the rain signal is staying manageable",
      "recent rain is giving the setup a cleaner read",
      "rain is leaving the main plan fairly clean",
    ],
    suppressor: [
      "rain is adding disruption to the setup",
      "the rain signal is making the read less clean",
      "recent rain is one of the day’s complications",
      "rain is making water choice more important",
      "recent rain is narrowing the margin today",
      "the rain signal is asking for a more selective plan",
      "rain is one of the conditions to respect today",
      "recent rain is giving the read less clarity",
    ],
  },
  tide_current_movement: {
    driver: [
      "tidal movement is helping the day",
      "tide and current are in your favor",
      "water movement is adding a useful edge",
      "the tide/current setup is giving the read support",
      "moving water is helping shape the plan",
      "the tide/current read is on your side today",
      "water movement is giving you a useful timing cue",
      "tidal movement is one of the stronger signals",
    ],
    suppressor: [
      "tide and current are narrowing the setup",
      "water movement is not giving much help",
      "the tide/current setup is giving the window less support",
      "tidal movement is not offering much help today",
      "water movement is asking for a tighter plan",
      "the tide/current read is making timing more selective",
      "tide and current are one of the day's cautions",
      "water movement is making the better window narrower",
    ],
  },
};

const CURRENT_SUMMARY_PHRASES: SummaryPhraseBank = {
  driver: [
    "current is helping the day",
    "moving water is in your favor",
    "current is adding a useful edge",
    "the current setup is giving the read support",
    "current is helping shape the plan today",
    "moving water is adding support to the read",
    "the current read is on your side today",
    "current is giving you a useful timing cue",
  ],
  suppressor: [
    "current is not offering much help today",
    "moving water is not lining up as well",
    "the current setup is narrowing the read",
    "current is giving the day less support than you would like",
    "moving water is making timing more selective",
    "the current read is one of the day's cautions",
    "current is asking for a more careful plan",
    "moving water is giving the read less support",
  ],
};

const RUNOFF_SUMMARY_PHRASES: Record<"river" | "default", SummaryPhraseBank> = {
  river: {
    driver: [
      "stable flow is helping the river read",
      "stable flow is giving the river a cleaner read",
      "stable flow has rain and runoff staying manageable",
      "stable flow has the river’s rain/runoff signal in a workable place",
      "stable flow has the river's rain/runoff signal manageable today",
      "stable flow is keeping the river read more organized",
      "stable flow has rain and runoff in a workable range for the river",
      "stable flow is giving the river setup support",
    ],
    suppressor: [
      "rain and runoff are making the river setup tougher",
      "runoff is adding uncertainty to the river read",
      "the river’s rain/runoff signal is making the read less clean",
      "rain and runoff are narrowing the river margin today",
      "the river's runoff signal is asking for cleaner water choices",
      "runoff is making river timing more selective",
      "rain and runoff are one of the river read's cautions",
      "the river flow signal is giving the setup less support",
    ],
  },
  default: {
    driver: [
      "runoff is staying quiet today",
      "runoff is staying manageable today",
      "the runoff signal is quiet enough to help",
      "rain and runoff are giving the setup a cleaner read",
      "recent runoff is not complicating the plan much today",
      "the runoff read is staying in a workable range",
      "rain and runoff are leaving the main setup fairly clean",
      "the runoff signal is giving the read some support",
    ],
    suppressor: [
      "runoff is adding uncertainty to the setup",
      "rain and runoff are making the read less clean",
      "the runoff signal is giving the day less support",
      "runoff is making water choice more important",
      "rain and runoff are one of the day's cautions",
      "the runoff read is asking for cleaner water choices",
      "recent runoff is narrowing the margin today",
      "rain and runoff are making the plan more selective",
    ],
  },
};

export function buildVariableDisplayLabel(
  variable: string,
  context?: EngineContext,
): string {
  switch (variable) {
    case "temperature_condition":
      return "Temperature";
    case "pressure_regime":
      return "Pressure";
    case "wind_condition":
      return "Wind";
    case "light_cloud_condition":
      return "Cloud Cover";
    case "precipitation_disruption":
      return "Rain";
    case "runoff_flow_disruption":
      return "Rain / Runoff";
    case "tide_current_movement":
      return context === "coastal" || context === "coastal_flats_estuary"
        ? "Tide / Current"
        : "Current";
    default:
      return variable
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

function buildVariableSummaryLabel(
  variable: string,
  context?: EngineContext,
  role: SummaryFactorRole = "driver",
): string {
  switch (variable) {
    case "temperature_condition":
      return "temperature";
    case "pressure_regime":
      return "pressure";
    case "wind_condition":
      return "wind";
    case "light_cloud_condition":
      return "cloud cover";
    case "precipitation_disruption":
      return "rain";
    case "runoff_flow_disruption":
      return context === "freshwater_river" && role === "driver"
        ? "stable flow"
        : "runoff";
    case "tide_current_movement":
      return context === "coastal" || context === "coastal_flats_estuary"
        ? "tidal movement"
        : "current";
    default: {
      return buildVariableDisplayLabel(variable, context).toLowerCase();
    }
  }
}

function trimAtWordBoundary(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  const sliced = clean.slice(0, maxLen + 1);
  const cut = sliced.lastIndexOf(" ");
  return (cut > 0 ? sliced.slice(0, cut) : clean.slice(0, maxLen)).trim();
}

function appendIfFits(
  parts: string[],
  addition: string,
  maxLen: number,
): string[] {
  const next = [...parts, addition];
  if (next.join(" ").replace(/\s+/g, " ").trim().length <= maxLen) {
    return next;
  }
  return parts;
}

function normalizeSurfaceSentence(text: string): string {
  const clean = text
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
  if (!clean) return "";
  const withCapital = clean.charAt(0).toUpperCase() + clean.slice(1);
  return /[.!?]$/.test(withCapital) ? withCapital : `${withCapital}.`;
}

export function listSummaryCopyForAudit(): string[] {
  return [
    ...Object.values(OPENERS).flat(),
    ...MIXED_TEMPLATES_SOFT,
    ...MIXED_TEMPLATES_STRONG,
    ...POSITIVE_TEMPLATES_SOFT,
    ...POSITIVE_TEMPLATES_STRONG,
    ...NEGATIVE_TEMPLATES_SOFT,
    ...NEGATIVE_TEMPLATES_STRONG,
    ...NEUTRAL_CLOSERS,
    ...Object.values(CONTEXT_TOUCHES).flat(),
    ...Object.values(RELIABILITY_CLOSERS).flat(),
    ...Object.values(TEMPERATURE_SUMMARY_PHRASES).flat().map(
      normalizeSurfaceSentence,
    ),
    ...Object.values(SUMMARY_PHRASES).flatMap((bank) =>
      bank ? Object.values(bank).flat().map(normalizeSurfaceSentence) : []
    ),
    ...Object.values(CURRENT_SUMMARY_PHRASES).flat().map(
      normalizeSurfaceSentence,
    ),
    ...Object.values(RUNOFF_SUMMARY_PHRASES).flatMap((bank) =>
      Object.values(bank).flat().map(normalizeSurfaceSentence)
    ),
  ];
}

function contributionStrength(
  factor: SummaryFactor | undefined,
): SummaryStrength {
  const weighted = Math.abs(factor?.weightedContribution ?? 0);
  if (weighted >= 18) return "strong";
  if (weighted >= 9) return "moderate";
  return "slight";
}

function temperaturePhrase(
  _factor: SummaryFactor,
  role: SummaryFactorRole,
  _strength: SummaryStrength,
  seed: string,
): string {
  return pickDeterministic(
    TEMPERATURE_SUMMARY_PHRASES[role],
    seed,
    `summary:phrase:temperature:${role}`,
  );
}

function genericFactorPhrase(
  factor: SummaryFactor,
  context: EngineContext,
  role: SummaryFactorRole,
  _strength: SummaryStrength,
  seed: string,
): string {
  if (factor.variable === "runoff_flow_disruption") {
    const bank = context === "freshwater_river"
      ? RUNOFF_SUMMARY_PHRASES.river
      : RUNOFF_SUMMARY_PHRASES.default;
    return pickDeterministic(
      bank[role],
      seed,
      `summary:phrase:runoff:${context}:${role}`,
    );
  }

  if (
    factor.variable === "tide_current_movement" &&
    context !== "coastal" &&
    context !== "coastal_flats_estuary"
  ) {
    return pickDeterministic(
      CURRENT_SUMMARY_PHRASES[role],
      seed,
      `summary:phrase:current:${role}`,
    );
  }

  const bank = SUMMARY_PHRASES[factor.variable];
  if (bank) {
    return pickDeterministic(
      bank[role],
      seed,
      `summary:phrase:${factor.variable}:${role}`,
    );
  }

  const noun = buildVariableSummaryLabel(factor.variable, context, role);
  return role === "driver"
    ? `${noun} is helping today`
    : `${noun} is giving the read less support today`;
}

function buildFactorPhrase(
  factor: SummaryFactor,
  context: EngineContext,
  role: SummaryFactorRole,
  seed: string,
): string {
  const strength = contributionStrength(factor);
  if (factor.variable === "temperature_condition") {
    return temperaturePhrase(factor, role, strength, seed);
  }
  return genericFactorPhrase(factor, context, role, strength, seed);
}

export function buildReportSummaryLine(input: ReportSummaryInput): string {
  const { band, drivers, suppressors, seed, context, reliability } = input;
  const opener = pickDeterministic(OPENERS[band], seed, "summary:opener");
  const driver = drivers[0]
    ? buildFactorPhrase(drivers[0], context, "driver", seed)
    : null;
  const suppressor = suppressors[0]
    ? buildFactorPhrase(suppressors[0], context, "suppressor", seed)
    : null;
  const driverStrength = contributionStrength(drivers[0]);
  const suppressorStrength = contributionStrength(suppressors[0]);

  const parts: string[] = [normalizeSurfaceSentence(opener)];

  if (driver && suppressor) {
    const templates =
      driverStrength === "slight" || suppressorStrength === "slight"
        ? MIXED_TEMPLATES_SOFT
        : MIXED_TEMPLATES_STRONG;
    parts.push(
      normalizeSurfaceSentence(
        pickDeterministic(templates, seed, "summary:mixed")
          .replace("{driver}", driver)
          .replace("{suppressor}", suppressor),
      ),
    );
  } else if (driver) {
    const templates = driverStrength === "slight"
      ? POSITIVE_TEMPLATES_SOFT
      : POSITIVE_TEMPLATES_STRONG;
    parts.push(
      normalizeSurfaceSentence(
        pickDeterministic(templates, seed, "summary:positive")
          .replace("{driver}", driver),
      ),
    );
  } else if (suppressor) {
    const templates = suppressorStrength === "slight"
      ? NEGATIVE_TEMPLATES_SOFT
      : NEGATIVE_TEMPLATES_STRONG;
    parts.push(
      normalizeSurfaceSentence(
        pickDeterministic(templates, seed, "summary:negative")
          .replace("{suppressor}", suppressor),
      ),
    );
  } else {
    parts.push(
      normalizeSurfaceSentence(
        pickDeterministic(NEUTRAL_CLOSERS, seed, "summary:neutral"),
      ),
    );
  }

  if (reliability === "low") {
    const reliabilityCloser = normalizeSurfaceSentence(
      pickDeterministic(RELIABILITY_CLOSERS.low, seed, "summary:reliability"),
    );
    const withReliability = appendIfFits(
      parts,
      reliabilityCloser,
      SUMMARY_MAX_LEN,
    );
    parts.splice(
      0,
      parts.length,
      ...(withReliability.length > parts.length
        ? withReliability
        : appendIfFits([parts[0]], reliabilityCloser, SUMMARY_MAX_LEN)),
    );
  }

  let built = parts.join(" ");

  if (
    reliability !== "low" &&
    chanceDeterministic(seed, "summary:context:include", 0.38)
  ) {
    const contextTouch = normalizeSurfaceSentence(
      pickDeterministic(CONTEXT_TOUCHES[context], seed, "summary:context"),
    );
    built = appendIfFits([built], contextTouch, SUMMARY_MAX_LEN).join(" ");
  }

  return trimAtWordBoundary(built, SUMMARY_MAX_LEN);
}
