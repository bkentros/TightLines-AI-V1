export class ColorServiceError extends Error {
  constructor(public code: string, message: string, public status = 400) { super(message); }
}

export const localDate = (ms: number, zone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(ms);
  return ["year", "month", "day"].map(k => parts.find(p => p.type === k)!.value).join("-");
};
