import { assert, assertEquals } from "jsr:@std/assert";
import { PIER_CAST_ADDITIONAL_THERMAL_RESEARCH as curves } from "../config/additionalThermalResearch.generated.ts";
import { evaluateTemperatureSuitability, validatePierCastTemperatureCurve } from "../scoring/temperature.ts";
import { calculatePierCastInstantOpportunity } from "../scoring/opportunity.ts";
import { PIER_CAST_SPECIES_PROFILES } from "../config/species.ts";

const fit = (species: string, waterTemperatureC: number, overrides = {}) => evaluateTemperatureSuitability({
  curve: curves.find(p=>p.speciesId===species)!.curve, waterTemperatureC,
  mode:"review", ratingEnabled:true, monthEvidenceState:"proposed_regional_transfer", inputStatus:"valid", ...overrides,
});
Deno.test("additional thermal candidates retain all input and public gates",()=>{
  assertEquals(curves.length,9);
  for(const {speciesId,curve} of curves){
    assertEquals(validatePierCastTemperatureCurve(curve),[]);
    assertEquals(PIER_CAST_SPECIES_PROFILES.find(p=>p.speciesId===speciesId)!.seasonalTemperatureCurves,null);
    for(const overrides of [{mode:"public"},{ratingEnabled:false},{inputStatus:"stale"},{inputStatus:"unreviewed_representation"},{monthEvidenceState:"absent_biology_evidence"}]){
      assertEquals(fit(speciesId,10,overrides).status,"unavailable");
    }
    for(const t of [-.1,curve.acceptedDomainC[1]+.1,NaN])assertEquals(fit(speciesId,t).status,"unavailable");
  }
});
Deno.test("thermal sensitivity candidates are continuous, bounded and nonzero in cold water",()=>{
  for(const {speciesId,curve} of curves){
    assert(fit(speciesId,0).suitability!>0);
    for(const knot of curve.knots){
      assertEquals(fit(speciesId,knot.temperatureC).suitability,knot.suitability);
      for(const delta of [-1e-7,1e-7]){
        const t=knot.temperatureC+delta;
        if(t<0 || t>curve.acceptedDomainC[1])continue;
        assert(Math.abs(fit(speciesId,t).suitability!-knot.suitability)<1e-6);
      }
    }
    for(let tenth=0;tenth<=curve.acceptedDomainC[1]*10;tenth++){
      const suitability=fit(speciesId,tenth/10).suitability!;
      assert(suitability>=0 && suitability<=1);
      for(const seasonalRating of [1,1.5,4,7,10]){
        const s=calculatePierCastInstantOpportunity({seasonalRating,temperatureSuitability:suitability}).rating.score!;
        assert(s>=1 && s<=Math.min(10,1+(seasonalRating-1)*1.05)+1e-12);
        if(seasonalRating===1)assertEquals(s,1);
      }
    }
  }
});
Deno.test("species-specific drafts preserve spring perch and distinguish cold and warm compatibility",()=>{
  assert(fit("yellow_perch",4).suitability!>=.75);
  assert(fit("lake_trout",4).suitability!>fit("lake_trout",22).suitability!);
  assert(fit("freshwater_drum",22).suitability!>fit("freshwater_drum",4).suitability!);
  assert(fit("smallmouth_bass",24).suitability!>fit("smallmouth_bass",8).suitability!);
  const signatures=curves.map(p=>JSON.stringify(p.curve.knots));
  assertEquals(new Set(signatures).size,9);
});
