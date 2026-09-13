/** Early UI checks improve paywall reliability; the server remains authoritative. */
export function colorTrialRequiresUpgrade(free: boolean, claimed: { typeId: string; clarity: string; date: string } | null, requested: { typeId: string; clarity: string; date: string }): boolean {
  return free && claimed !== null && (claimed.typeId !== requested.typeId || claimed.clarity !== requested.clarity || claimed.date !== requested.date);
}
export function pierTrialRequiresUpgrade(free: boolean, claimed: { cityId: string; date: string } | null, cityId: string, currentCityDate: string): boolean {
  return free && claimed !== null && (claimed.cityId !== cityId || claimed.date !== currentCityDate);
}
