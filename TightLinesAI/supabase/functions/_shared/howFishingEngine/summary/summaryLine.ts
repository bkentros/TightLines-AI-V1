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
    "This is a very strong fishing day.",
    "Conditions look excellent today.",
    "The overall setup is lining up very well.",
    "This is one of the better days on the calendar.",
    "A lot is lining up in your favor today.",
    "This looks like a high-end setup.",
    "Most of the important pieces are working together today.",
    "This is the kind of day anglers hope to see.",
    "The day sets up well from top to bottom.",
    "The overall picture is very favorable today.",
    "This is a standout setup.",
    "The conditions are giving you a real edge today.",
  ],
  Good: [
    "This looks like a solid fishing day.",
    "Overall, the setup is working for you.",
    "The main signals lean helpful today.",
    "The setup gives you a workable starting point.",
    "This is a dependable setup overall.",
    "Today's conditions give you a good shot.",
    "The overall picture leans your way today.",
    "This is a day to fish with confidence.",
    "The main conditions lean helpful today.",
    "This looks like a fishable day with upside.",
    "The main conditions give you a clear starting window.",
    "There is enough going right to feel confident today.",
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
    "A defined window matters more than the full-day average.",
    "This is a day to respect the strongest window.",
    "There is enough help to fish, but the margin still matters.",
  ],
  Poor: [
    "This is a tougher day than usual.",
    "The setup is mostly limiting today.",
    "The day looks narrow and demanding.",
    "This is more of a grind than a clean day.",
    "There is not much help in the conditions today.",
    "The overall picture is fairly limiting.",
    "This is the kind of day that asks for patience.",
    "The day does not offer much easy upside.",
    "This setup is making you earn it today.",
    "There are more problems than help here.",
    "This is a tougher read from top to bottom.",
    "The day offers few easy condition advantages.",
  ],
  Tough: [
    "This is a very difficult fishing day.",
    "The setup is heavily limiting today.",
    "Conditions look tough from the start.",
    "This is a grind-it-out day.",
    "The day offers very little easy help.",
    "This is one of the harder reads on the calendar.",
    "Most of the important signals are not helping today.",
    "This is a day for low expectations and careful choices.",
    "The setup is narrow, demanding, and unforgiving.",
    "There is not much natural edge in the conditions today.",
    "This is a tough setup from top to bottom.",
    "The day asks you to earn every bite.",
  ],
};

const MIXED_TEMPLATES_SOFT = [
  "{driver}, while {suppressor}.",
  "{driver}, and {suppressor}.",
  "{driver}, but {suppressor}.",
] as const;

const MIXED_TEMPLATES_STRONG = [
  "{driver}, but {suppressor}.",
  "{driver}, although {suppressor}.",
  "{driver}, while {suppressor}.",
] as const;

const POSITIVE_TEMPLATES_SOFT = [
  "{driver}.",
  "{driver}.",
  "{driver}.",
] as const;

const POSITIVE_TEMPLATES_STRONG = [
  "{driver}.",
  "{driver}.",
  "{driver}.",
] as const;

const SUMMARY_MAX_LEN = 220;

const NEGATIVE_TEMPLATES_SOFT = [
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
] as const;

const NEGATIVE_TEMPLATES_STRONG = [
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
  "{suppressor}.",
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
    "On still water, a simple plan usually beats forcing things.",
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
    "For inshore water, a simple plan usually holds up better than forcing it.",
    "On coastal days, timing and water movement usually matter more than extra effort.",
  ],
  coastal_flats_estuary: [
    "On the flats, small advantages usually matter more than big guesses.",
    "Flats days like this usually reward a calm, precise approach.",
    "In a flats setup, subtle water and light changes matter more than forcing the pace.",
    "For flats and estuary water, subtle adjustments usually decide more than big ones.",
  ],
};

const RELIABILITY_CLOSERS: Record<"medium" | "low", readonly string[]> = {
  medium: [
    "This is still a useful read, just a little broader than the clearest cases.",
    "The call is still useful, but lean on the main signals more than fine detail.",
    "The read is still solid, just a touch broader than the most precise cases.",
    "This is a trustworthy read, but it is better as direction than over-precision.",
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
): string {
  if (role === "driver") {
    return "temperature is helping the day";
  }
  return "temperature is not helping the day";
}

function genericFactorPhrase(
  factor: SummaryFactor,
  context: EngineContext,
  role: SummaryFactorRole,
  _strength: SummaryStrength,
): string {
  const noun = buildVariableSummaryLabel(factor.variable, context, role);

  if (role === "driver") {
    if (factor.variable === "precipitation_disruption") {
      return "rain is not getting in the way";
    }
    return `${noun} is helping the day`;
  }

  if (factor.variable === "runoff_flow_disruption") {
    return "rain and runoff are not helping the river read";
  }
  return `${noun} is not helping the day`;
}

function buildFactorPhrase(
  factor: SummaryFactor,
  context: EngineContext,
  role: SummaryFactorRole,
): string {
  const strength = contributionStrength(factor);
  if (factor.variable === "temperature_condition") {
    return temperaturePhrase(factor, role, strength);
  }
  return genericFactorPhrase(factor, context, role, strength);
}

export function buildReportSummaryLine(input: ReportSummaryInput): string {
  const { band, drivers, suppressors, seed, context, reliability } = input;
  const opener = pickDeterministic(OPENERS[band], seed, "summary:opener");
  const driver = drivers[0]
    ? buildFactorPhrase(drivers[0], context, "driver")
    : null;
  const suppressor = suppressors[0]
    ? buildFactorPhrase(suppressors[0], context, "suppressor")
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
