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
  Excellent: [
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
    "More is helping than hurting today.",
    "The day looks solid overall.",
    "This is a dependable setup overall.",
    "Today's conditions give you a good shot.",
    "The overall picture leans your way today.",
    "This is a day to fish with confidence.",
    "The setup is mostly helpful today.",
    "This looks like a fishable day with upside.",
    "Conditions are giving you something to work with.",
    "There is enough going right to feel confident today.",
  ],
  Fair: [
    "This is a workable day, but not an easy one.",
    "The setup is fishable, but mixed.",
    "There is a path today, but it is not obvious.",
    "Some things are helping, and some are getting in the way.",
    "This is a mixed day overall.",
    "The day is workable, but it will take some adjustment.",
    "You can fish this day, but you will need to stay sharp.",
    "The report is balanced enough to fish, but not easy enough to coast through.",
    "This is a fair day, not an easy one.",
    "The setup gives you a chance, but not much room for mistakes.",
    "This is a day for patience and good decisions.",
    "There is enough here to stay interested, but not enough to get careless.",
  ],
  Poor: [
    "This is a tougher day than usual.",
    "The setup is mostly working against you today.",
    "The day looks narrow and demanding.",
    "This is more of a grind than a clean day.",
    "There is not much help in the conditions today.",
    "The overall picture is fairly limiting.",
    "This is the kind of day that asks for patience.",
    "The day does not offer much easy upside.",
    "This setup is making you earn it today.",
    "The engine sees more problems than help here.",
    "This is a tougher read from top to bottom.",
    "The day does not offer many free advantages.",
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
  "Nothing is taking over the report by itself.",
  "This is a balanced day more than a dramatic one.",
  "The details matter more than one big factor today.",
  "The day is not being carried or sunk by one obvious thing.",
  "This is more about execution than one major condition edge.",
  "No single variable stands above the rest.",
  "It is a broad, balanced setup rather than a sharp one.",
] as const;

const CONTEXT_TOUCHES: Record<EngineContext, readonly string[]> = {
  freshwater_lake_pond: [
    "On a lake or pond day, steady adjustments usually beat constant change.",
    "For still water, clean decisions usually matter more than doing too much.",
    "Lake days like this usually reward a patient, organized plan.",
    "On still water, simple execution usually beats forcing things.",
  ],
  freshwater_river: [
    "On a river day, staying disciplined usually matters more than covering too much water.",
    "River setups like this usually reward precision over extra motion.",
    "In moving water, clean decisions usually beat rushed ones.",
    "For rivers, the better move is usually to stay precise and controlled.",
  ],
  coastal: [
    "On an inshore day, timing and clean execution usually matter more than extra effort.",
    "Coastal setups like this usually reward staying disciplined once the window shows up.",
    "For inshore water, a simple plan usually holds up better than forcing it.",
    "On coastal days, clean decisions usually matter more than extra effort.",
  ],
  coastal_flats_estuary: [
    "On the flats, small advantages usually matter more than big guesses.",
    "Flats days like this usually reward a calm, precise approach.",
    "In a flats setup, clean execution usually matters more than forcing the pace.",
    "For flats and estuary water, subtle adjustments usually decide more than big ones.",
  ],
};

const RELIABILITY_CLOSERS: Record<"medium" | "low", readonly string[]> = {
  medium: [
    "This is still a usable read, just a little broader than the cleanest version of the report.",
    "The call is still useful, but lean on the main signals more than fine detail.",
    "The read is still solid, just a touch broader than the most precise cases.",
    "This is a trustworthy read, but it is better as direction than over-precision.",
    "The main setup is still useful here, even if the report should stay a little broad.",
  ],
  low: [
    "Key inputs were limited, so treat this as a broad read rather than a precise one.",
    "The report still points you in the right direction, but the precision is looser than normal.",
    "Important inputs were thinner than usual, so this is more directional than exact today.",
    "This remains useful, but the engine is working with a wider margin than usual.",
    "The report still helps, but it should be read as broad guidance today.",
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

function contributionStrength(factor: SummaryFactor | undefined): SummaryStrength {
  const weighted = Math.abs(factor?.weightedContribution ?? 0);
  if (weighted >= 18) return "strong";
  if (weighted >= 9) return "moderate";
  return "slight";
}

function temperaturePhrase(
  factor: SummaryFactor,
  role: SummaryFactorRole,
  strength: SummaryStrength,
): string {
  const breakdown = factor.temperatureBreakdown ?? null;
  const shock = breakdown?.shock_label ?? "none";
  const band = breakdown?.band_label ?? null;

  const reason =
    shock === "sharp_warmup"
      ? "after a fast warmup"
      : shock === "sharp_cooldown"
        ? "after a fast cooldown"
        : band === "near_optimal"
          ? "with the day sitting close to the better range"
          : band === "very_warm"
            ? "with the day running warmer than the seasonal range"
            : band === "very_cold" || band === "cool"
              ? "with the day running colder than the seasonal range"
              : band === "warm"
                ? "with the day a little warmer than the seasonal sweet spot"
                : "";

  if (role === "driver") {
    if (strength === "strong") {
      return reason
        ? `temperature is lining up especially well ${reason}`
        : "temperature is one of the clearest positives";
    }
    if (strength === "moderate") {
      return reason
        ? `temperature is helping in a noticeable way ${reason}`
        : "temperature is helping in a noticeable way";
    }
    return reason
      ? `temperature is helping a bit ${reason}`
      : "temperature is helping a bit";
  }

  if (strength === "strong") {
    return reason
      ? `temperature is a real limiter ${reason}`
      : "temperature is the clearest limiter";
  }
  if (strength === "moderate") {
    return reason
      ? `temperature is a noticeable headwind ${reason}`
      : "temperature is a noticeable headwind";
  }
  return reason
    ? `temperature is only a small headwind ${reason}`
    : "temperature is only a small headwind";
}

function genericFactorPhrase(
  factor: SummaryFactor,
  context: EngineContext,
  role: SummaryFactorRole,
  strength: SummaryStrength,
): string {
  const noun = buildVariableSummaryLabel(factor.variable, context, role);

  if (role === "driver") {
    if (strength === "strong") return `${noun} is doing more than anything else to help`;
    if (strength === "moderate") return `${noun} is one of the clearer positives`;
    return `${noun} is helping a bit`;
  }

  if (strength === "strong") return `${noun} is the main thing holding the day back`;
  if (strength === "moderate") return `${noun} is a noticeable headwind`;
  return `${noun} is only a small drag on the day`;
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
  const { band, reliability, drivers, suppressors, seed, context } = input;
  const opener = pickDeterministic(OPENERS[band], seed, "summary:opener");
  const driver = drivers[0] ? buildFactorPhrase(drivers[0], context, "driver") : null;
  const suppressor = suppressors[0] ? buildFactorPhrase(suppressors[0], context, "suppressor") : null;
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
    const templates =
      driverStrength === "slight" ? POSITIVE_TEMPLATES_SOFT : POSITIVE_TEMPLATES_STRONG;
    parts.push(
      normalizeSurfaceSentence(
        pickDeterministic(templates, seed, "summary:positive")
          .replace("{driver}", driver),
      ),
    );
  } else if (suppressor) {
    const templates =
      suppressorStrength === "slight" ? NEGATIVE_TEMPLATES_SOFT : NEGATIVE_TEMPLATES_STRONG;
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

  let built = parts.join(" ");

  if (chanceDeterministic(seed, "summary:context:include", 0.38)) {
    const contextTouch = normalizeSurfaceSentence(
      pickDeterministic(CONTEXT_TOUCHES[context], seed, "summary:context"),
    );
    built = appendIfFits([built], contextTouch, SUMMARY_MAX_LEN).join(" ");
  }

  if (
    reliability !== "high" &&
    chanceDeterministic(seed, "summary:reliability:include", 0.5)
  ) {
    const reliabilityNote = normalizeSurfaceSentence(
      pickDeterministic(
        RELIABILITY_CLOSERS[reliability],
        seed,
        `summary:reliability:${reliability}`,
      ),
    );
    built = appendIfFits([built], reliabilityNote, SUMMARY_MAX_LEN).join(" ");
  }

  return trimAtWordBoundary(built, SUMMARY_MAX_LEN);
}
