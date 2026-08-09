const PROTECTED_PERIOD = "\uE000";

/**
 * Splits primitive explanation copy into complete UI bullet points without
 * treating periods inside abbreviations, initials, or decimal values as
 * sentence boundaries.
 */
export function splitRiverRunDetailPoints(value: string): string[] {
  const protectedValue = value
    .replace(
      /\b(?:St|Mt|Dr|Mr|Mrs|Ms|Jr|Sr|No|vs|etc)\./gi,
      (match) => `${match.slice(0, -1)}${PROTECTED_PERIOD}`,
    )
    .replace(
      /\b(?:[A-Za-z]\.){2,}/g,
      (match) => match.replaceAll(".", PROTECTED_PERIOD),
    )
    .replace(
      /(\d)\.(?=\d)/g,
      (_, digit: string) => `${digit}${PROTECTED_PERIOD}`,
    );
  const sentences = protectedValue.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return (sentences ?? [protectedValue])
    .map((sentence) => sentence.replaceAll(PROTECTED_PERIOD, ".").trim())
    .filter(Boolean);
}
