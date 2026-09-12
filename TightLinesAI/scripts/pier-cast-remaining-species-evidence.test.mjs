import test from "node:test";
import assert from "node:assert/strict";
import { decodeCreel, summarizeStrata } from "./pier-cast-remaining-species-evidence.mjs";

const effort = (year, estimate) => ({year, month: 5, estimateType: "Angler Hours", estimate});
const caught = (year, estimate, species = "Yellow Perch") => ({year, month: 5, estimateType: "Catch", species, estimate});

test("missing catch is not zero; explicit zero remains in recurrence and denominator", () => {
  const r = summarizeStrata([effort(2018,100),caught(2018,20),effort(2019,200),caught(2019,0),effort(2021,900),effort(2022,0),caught(2022,99)], ["Yellow Perch"], () => true, 5);
  assert.equal(r.matchedYears,2);
  assert.equal(r.missingCatchYears,1);
  assert.equal(r.matchedHours,300);
  assert.equal(r.positiveYearShare,0.5);
  assert.equal(r.catchPer1000AllSpeciesHours,20000/300);
});
test("ratios use pooled estimates, not an unweighted mean of yearly rates", () => {
  const r=summarizeStrata([effort(2018,10),caught(2018,10),effort(2019,990),caught(2019,0)], ["Yellow Perch"], () => true, 5);
  assert.equal(r.catchPer1000AllSpeciesHours,10);
  assert.equal(r.largestYearCatchShare,1);
});
test("unmatched lake-trout components remain incomplete and duplicates fail", () => {
  const rows=[effort(2018,100),caught(2018,10,"Lean Lake Trout")];
  assert.equal(summarizeStrata(rows,["Lean Lake Trout","Fat Lake Trout"],()=>true,5).matchedYears,0);
  assert.throws(()=>summarizeStrata([...rows,effort(2018,100)],["Lean Lake Trout"],()=>true,5),/Duplicate effort/);
  assert.throws(()=>summarizeStrata([...rows,caught(2018,10,"Lean Lake Trout")],["Lean Lake Trout"],()=>true,5),/Duplicate catch/);
});
test("Power BI decoder preserves dictionary, repeated fields and explicit nulls", () => {
  const result={descriptor:{Select:[{Name:"species"},{Name:"value"}]},dsr:{DS:[{IC:true,ValueDicts:{D0:["Perch"]},PH:[{DM0:[{S:[{DN:"D0"},{}],C:[0,3]},{R:1,C:[0]},{"Ø":1,C:[7]}]}]}]}};
  assert.deepEqual(decodeCreel(result),[{species:"Perch",value:3},{species:"Perch",value:0},{species:null,value:7}]);
  result.dsr.DS[0].IC=false;
  assert.throws(()=>decodeCreel(result),/Incomplete/);
});
