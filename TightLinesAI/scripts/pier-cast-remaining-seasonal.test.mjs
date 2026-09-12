import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { configurationPath, dateOf, evaluate, generate, validate } from './generate-pier-cast-remaining-seasonal.mjs';
const config=JSON.parse(fs.readFileSync(configurationPath,'utf8'));
const row={knots:[{monthDay:'02-28',rating:2},{monthDay:'03-01',rating:6}]};
test('annual interpolation wraps through December and January without gaps',()=>{
 const curve={knots:[{monthDay:'01-15',rating:4},{monthDay:'12-15',rating:2}]};
 assert.equal(evaluate(curve,new Date('2025-12-15')),2);
 assert.equal(evaluate(curve,new Date('2026-01-15')),4);
 assert.equal(evaluate(curve,new Date('2026-01-01')),2+2*17/31);
 assert.equal(evaluate(curve,new Date('2025-12-31')),2+2*16/31);
 assert.equal(evaluate({knots:[]},new Date('2025-01-01')),null);
});
test('leap-year interpolation uses actual days and validates calendar dates',()=>{
 assert.equal(evaluate(row,new Date('2024-02-29')),4);
 assert.throws(()=>dateOf('02-29',2025));
 assert.throws(()=>dateOf('04-31',2025));
 assert.throws(()=>evaluate(row,new Date('invalid')));
});
test('accepted pairings have every date; deferred pairings have none; runtime remains disabled',()=>{
 assert.equal(config.rows.filter(r=>r.knots.length).length,16);
 for(const r of config.rows){
  assert.equal(r.productionReady,false);assert.equal(r.ratingEnabled,false);
  for(const year of [2024,2025,2026]){
   for(let time=Date.UTC(year,0,1);time<Date.UTC(year+1,0,1);time+=86400000){
    const value=evaluate(r,new Date(time));
    if(r.phase1Decision==='deferred') assert.equal(value,null);
    else assert.ok(Number.isFinite(value)&&value>=1&&value<=10);
   }
  }
 }
});
test('local seasonal ordering allows overlapping peaks and distinguishes cold-season species',()=>{
 const get=(city,species)=>config.rows.find(r=>r.cityId===city&&r.speciesId===species);
 const at=(r,date)=>evaluate(r,new Date('2025-'+date));
 assert.ok(at(get('manistee_mi','yellow_perch'),'05-15')>at(get('manistee_mi','yellow_perch'),'07-15'));
 assert.ok(at(get('ludington_mi','yellow_perch'),'07-15')>at(get('ludington_mi','yellow_perch'),'08-15'));
 assert.ok(at(get('grand_haven_mi','freshwater_drum'),'08-15')>=6);
 assert.ok(at(get('grand_haven_mi','largemouth_bass'),'08-15')>=6);
 assert.ok(at(get('manistee_mi','lake_trout'),'01-15')>at(get('manistee_mi','lake_trout'),'07-15'));
 const whitefish=get('grand_haven_mi','lake_whitefish');
 assert.ok(at(whitefish,'11-15')<=4);
 assert.match(whitefish.calibrationRationale,/Historical harvest is not used/);
 const signatures=config.rows.filter(r=>r.knots.length).map(r=>JSON.stringify(r.knots.map(a=>[a.monthDay,a.rating])));
 assert.equal(new Set(signatures).size,signatures.length,'No copied entire city curve');
});
test('all deterministic research projections and source snapshot hashes are current',()=>generate(true));
test('validation accepts baseline and rejects scope, evidence, calendar, deferral and release corruption',()=>{
 const ids=new Set(config.rows.flatMap(r=>[...r.evidenceIds,...r.knots.flatMap(a=>a.evidenceIds)]));
 const roster={rows:config.rows};
 validate(config,ids,roster);
 for(const mutate of [
  c=>{c.rows[0].cityId='uncovered_city';},
  c=>{c.rows[0].ratingEnabled=true;},
  c=>{c.publicReleaseEnabled=true;},
  c=>{c.rows[0].evidenceIds.push('invented_source');},
  c=>{const r=c.rows.find(r=>r.knots.length);r.knots.push(structuredClone(r.knots[0]));},
  c=>{c.rows.find(r=>r.knots.length).knots[0].rating=0;},
  c=>{c.rows.find(r=>r.knots.length).knots[0].evidenceIds=['invented_source'];},
  c=>{c.rows.find(r=>r.knots.length).knots=[];},
  c=>{c.rows.find(r=>r.phase1Decision==='deferred').knots=structuredClone(c.rows.find(r=>r.knots.length).knots);},
 ]){
  const changed=structuredClone(config);mutate(changed);assert.throws(()=>validate(changed,ids,roster));
 }
});
