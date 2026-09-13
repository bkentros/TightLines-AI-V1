import { createHash } from "node:crypto";
import { evaluateTemperatureSuitability, validatePierCastTemperatureCurve } from "../supabase/functions/_shared/pierCastEngine/scoring/temperature.ts";
import { evaluatePierCastSeasonalOpportunity } from "../supabase/functions/_shared/pierCastEngine/scoring/seasonal.ts";
import { calculatePierCastInstantOpportunity, PIER_CAST_FORMULA_VERSION } from "../supabase/functions/_shared/pierCastEngine/scoring/opportunity.ts";
import type { PierCastTemperatureCurve } from "../supabase/functions/_shared/pierCastEngine/types.ts";

const root = new URL("../", import.meta.url);
const dir = "docs/onboarding/piercast/remaining-species/";
const read = async (file: string) => JSON.parse(await Deno.readTextFile(new URL(file, root)));
export const config = await read("docs/PierCast_Remaining_Species_Temperature_Curves.json");
const seasonal = await read("docs/PierCast_Remaining_Species_Seasonal_Curves.json");
export function fit(curve: PierCastTemperatureCurve, temperature: number, mode: "public" | "review" = "review") {
  return evaluateTemperatureSuitability({curve, waterTemperatureC: temperature, ratingEnabled: true, mode,
    monthEvidenceState: "proposed_regional_transfer", inputStatus: "valid"});
}

export async function generate(check = false) {
  if (config.phase !== 2 || config.publicReleaseEnabled !== false || config.profiles.length !== 9) throw new Error("Invalid Phase 2 scope");
  const registers = await Promise.all(config.sourceRegisters.map((f: string) => read("docs/" + f)));
  const ids = new Set(registers.flatMap(r => Array.isArray(r) ? r : r.records).map(r => r.evidenceId));
  const expected = new Set(seasonal.rows.map((r: { speciesId: string }) => r.speciesId));
  const clean = [];
  const samples = ["speciesId,temperatureC,suitability,status,interpretation"];
  for (const p of config.profiles) {
    if (!expected.delete(p.speciesId) || p.productionReady !== false || p.empiricallyValidated !== false || p.curve.calibrationStatus !== "provisional" || p.status !== "sensitivity_candidate_only") throw new Error("Invalid profile gate");
    if (!p.calibrationRationale || !p.limitations || !p.confidence) throw new Error("Missing scientific rationale");
    if (p.privateReviewDecision !== (p.speciesId === "round_whitefish" ? "deferred_adult_response" : "provisional_sensitivity_only") || !p.reviewConclusion) throw new Error("Missing private thermal decision");
    const errors = validatePierCastTemperatureCurve(p.curve);
    if (errors.length) throw new Error(errors.join(","));
    for (const id of p.evidenceIds) if (!ids.has(id)) throw new Error("Unknown source " + id);
    for (const k of p.curve.knots) {
      if (k.basis !== "product_calibration_judgment" || !k.rationale || !k.evidenceIds.length) throw new Error("Unexplained ordinate");
      for (const id of k.evidenceIds) if (!ids.has(id)) throw new Error("Unknown knot source " + id);
    }
    clean.push({speciesId:p.speciesId,curve:{...p.curve,knots:p.curve.knots.map(({temperatureC,suitability}:{temperatureC:number;suitability:number})=>({temperatureC,suitability}))}});
    for (let t=0;t<=320;t++) {
      const result=fit(p.curve,t/10);
      samples.push([p.speciesId,(t/10).toFixed(1),result.suitability?.toFixed(6)??"",result.status,"hypothetical_research_only"].join(","));
    }
  }
  if (expected.size) throw new Error("Missing species");
  const eligibility = await read(dir + "phase2-eligibility.json");
  const annualPairs = new Set(seasonal.rows.filter((r: {knots: unknown[]}) => r.knots.length).map((r: {cityId: string; speciesId: string}) => `${r.cityId}/${r.speciesId}`));
  for (const row of eligibility.rows) {
    if (!annualPairs.delete(`${row.cityId}/${row.speciesId}`) || row.runtimeEligible !== false || row.publicEnabled !== false || !row.blockingReasons.includes("surface_to_fishing_zone_transfer_not_approved")) throw new Error("Invalid additional research eligibility");
    if (!row.regulationReview || row.regulationReview.sourceId !== "P2_REGS2026") throw new Error("Missing current regulation review");
    for (const id of row.evidenceIds) if (!ids.has(id)) throw new Error("Unknown eligibility source " + id);
  }
  if (annualPairs.size) throw new Error("Incomplete additional research eligibility");
  for (const r of await read(dir+"phase2-retrieval-ledger.json")) {
    if (r.error) continue; // Failed downloads are explicit; never hash an error page as evidence.
    const b=await Deno.readFile(new URL(dir+r.file,root));
    if (b.length!==r.bytes || createHash("sha256").update(b).digest("hex")!==r.sha256) throw new Error("Snapshot drift: "+r.evidenceId);
  }
  const combined=["cityId,speciesId,week,midpointDate,scenarioTemperatureC,seasonalRating,thermalFit,hypotheticalScore,status"];
  const sensitivities=[];
  for (const row of seasonal.rows.filter((r:{knots:unknown[]})=>r.knots.length)) {
    const curve=clean.find(p=>p.speciesId===row.speciesId)!.curve;
    let maximumTwoDegreeChange=0;
    const peak=Math.max(...row.knots.map((k:{rating:number})=>k.rating));
    for(let t=0;t<=curve.acceptedDomainC[1]-2;t+=.1){
      const low=fit(curve,t).suitability!,high=fit(curve,t+2).suitability!;
      const a=calculatePierCastInstantOpportunity({seasonalRating:peak,temperatureSuitability:low}).rating.score!;
      const b=calculatePierCastInstantOpportunity({seasonalRating:peak,temperatureSuitability:high}).rating.score!;
      maximumTwoDegreeChange=Math.max(maximumTwoDegreeChange,Math.abs(a-b));
    }
    sensitivities.push({cityId:row.cityId,speciesId:row.speciesId,seasonalPeak:peak,maximumScoreChangeForTwoC:Number(maximumTwoDegreeChange.toFixed(6)),interpretation:"Sensitivity at annual peak, not forecast error or confidence interval"});
    for(let week=0;week<52;week++){
      const date=new Date(Date.UTC(2025,0,1+week*7+3)).toISOString().slice(0,10);
      const s=evaluatePierCastSeasonalOpportunity({curve:row,localDate:date,ratingEnabled:true,mode:"review"});
      if(s.rating===null) throw new Error("Missing annual date");
      for(const temperature of [2,6,10,14,18,22,26,30]){
        const t=fit(curve,temperature);
        const score=t.suitability===null?null:calculatePierCastInstantOpportunity({seasonalRating:s.rating,temperatureSuitability:t.suitability}).rating.score;
        combined.push([row.cityId,row.speciesId,week+1,date,temperature,s.rating.toFixed(6),t.suitability?.toFixed(6)??"",score?.toFixed(6)??"",score===null?"out_of_domain":"hypothetical_research_only"].join(","));
      }
    }
  }
  const output: [string,string][]=[
    ["supabase/functions/_shared/pierCastEngine/config/additionalThermalResearch.generated.ts",'// Generated by scripts/generate-pier-cast-phase2.ts.\n// SENSITIVITY RESEARCH ONLY. Private research output; never an approved rating.\nimport type { PierCastSpeciesId, PierCastTemperatureCurve } from "../types.ts";\nexport const PIER_CAST_ADDITIONAL_THERMAL_RESEARCH: {speciesId: PierCastSpeciesId; curve: PierCastTemperatureCurve}[] = '+JSON.stringify(clean,null,2)+';\n'],
    ["supabase/functions/_shared/pierCastEngine/config/additionalEligibility.generated.ts", '// Generated by scripts/generate-pier-cast-phase2.ts. Private research gates only.\nexport const PIER_CAST_ADDITIONAL_ELIGIBILITY = '+JSON.stringify(eligibility.rows,null,2)+' as const;\n'],
    [dir+"phase2-temperature-samples.csv",samples.join("\n")+"\n"],
    [dir+"phase2-weekly-temperature-scenarios.csv",combined.join("\n")+"\n"],
    [dir+"phase2-sensitivity.json",JSON.stringify({formulaVersion:PIER_CAST_FORMULA_VERSION,observationalValidation:false,rows:sensitivities},null,2)+"\n"],
  ];
  for (const [file,text] of output) {
    const url=new URL(file,root);
    if(check){if(await Deno.readTextFile(url)!==text)throw new Error("Regenerate "+file);}else await Deno.writeTextFile(url,text);
  }
  console.log(`${check?"Verified":"Generated"} nine thermal candidates, ${samples.length-1} temperature samples and ${combined.length-1} hypothetical weekly scenarios. No runtime activation.`);
}
if(import.meta.main)await generate(Deno.args.includes("--check"));
