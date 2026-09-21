export type PierCastWaterBodyName = "Lake Michigan" | "Lake Huron";

const PIER_CAST_WATER_BODY_BY_CITY_ID: Readonly<
  Record<string, PierCastWaterBodyName>
> = {
  ludington_mi: "Lake Michigan",
  grand_haven_mi: "Lake Michigan",
  manistee_mi: "Lake Michigan",
  frankfort_elberta_mi: "Lake Michigan",
  sheboygan_wi: "Lake Michigan",
  port_washington_wi: "Lake Michigan",
  milwaukee_wi: "Lake Michigan",
  racine_wi: "Lake Michigan",
  kenosha_wi: "Lake Michigan",
  harbor_beach_mi: "Lake Huron",
  oscoda_mi: "Lake Huron",
  port_sanilac_mi: "Lake Huron",
  two_rivers_wi: "Lake Michigan",
  kewaunee_wi: "Lake Michigan",
  algoma_wi: "Lake Michigan",
  manitowoc_wi: "Lake Michigan",
  waukegan_il: "Lake Michigan",
  chicago_il: "Lake Michigan",
  michigan_city_in: "Lake Michigan",
  muskegon_mi: "Lake Michigan",
  whitehall_mi: "Lake Michigan",
  alpena_mi: "Lake Huron",
  st_joseph_mi: "Lake Michigan",
  south_haven_mi: "Lake Michigan",
  holland_mi: "Lake Michigan",
  lexington_mi: "Lake Huron",
  harrisville_mi: "Lake Huron",
};

export function pierCastWaterBodyName(
  cityId: string,
): PierCastWaterBodyName | "Great Lakes" {
  return PIER_CAST_WATER_BODY_BY_CITY_ID[cityId] ?? "Great Lakes";
}
