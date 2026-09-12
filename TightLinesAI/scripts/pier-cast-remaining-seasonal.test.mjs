import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { configurationPath, dateOf, evaluate, generate, validate } from './generate-pier-cast-remaining-seasonal.mjs';
const config=JSON.parse(fs.readFileSync(configurationPath,'utf8'));
const row={segments:[{anchors:[{monthDay:'02-28',rating:2},{monthDay:'03-01',rating:6}]},{anchors:[{monthDay:'05-01',rating:3},{monthDay:'05-10',rating:5}]}]};
test('bounded interpolation never fills winter, between-segment gaps or year wrap',()=>{
 for(const date of ['2025-01-01','2025-03-02','2025-04-15','2025-05-11','2025-12-31']) assert.equal(evaluate(row,new Date(date)),null);
 assert.equal(evaluate(row,new Date('2025-02-28')),2);
 assert.equal(evaluate(row,new Date('2025-03-01')),6);
 assert.equal(evaluate(row,new Date('2025-05-10')),5);
});
test('leap-year interpolation uses actual days and validates calendar dates',()=>{
 assert.equal(evaluate(row,new Date('2024-02-29')),4);
 assert.throws(()=>dateOf('02-29',2025));
 assert.throws(()=>dateOf('04-31',2025));
 assert.throws(()=>evaluate(row,new Date('invalid')));
});
test('all proposed dates remain bounded with no runtime eligibility',()=>{
 for(const r of config.rows){
  assert.equal(r.productionReady,false);assert.equal(r.ratingEnabled,false);
  for(const year of [2024,2025,2026]){
   for(let time=Date.UTC(year,0,1);time<Date.UTC(year+1,0,1);time+=86400000){
    const date=new Date(time),value=evaluate(r,date);
    if(value!=null) assert.ok(Number.isFinite(value)&&value>=1&&value<=10);
    if(date.getUTCMonth()<3) assert.equal(value,null,'No manufactured winter floor');
   }
  }
 }
});
test('seasonal ordering reflects local evidence while allowing overlapping peaks',()=>{
 const get=(city,species)=>config.rows.find(r=>r.cityId===city&&r.speciesId===species);
 const at=(r,date)=>evaluate(r,new Date('2025-'+date));
 assert.ok(at(get('manistee_mi','yellow_perch'),'05-15')>at(get('manistee_mi','yellow_perch'),'07-15'));
 assert.ok(at(get('ludington_mi','yellow_perch'),'07-15')>at(get('ludington_mi','yellow_perch'),'08-15'));
 assert.ok(at(get('grand_haven_mi','freshwater_drum'),'08-15')>=6);
 assert.ok(at(get('grand_haven_mi','largemouth_bass'),'08-15')>=6);
 assert.equal(get('grand_haven_mi','lake_whitefish').segments.length,0,'No numeric conversion of historical snagging harvest');
});
test('all deterministic research projections are current',()=>generate(true));
test('validation rejects changed scope, invented evidence, overlapping windows and release bypass',()=>{
 const ids=new Set(config.rows.flatMap(r=>r.evidenceIds));
 const roster={rows:config.rows};
 for(const mutate of [
  c=>{c.rows[0].cityId='uncovered_city';},
  c=>{c.rows[0].ratingEnabled=true;},
  c=>{c.rows[0].evidenceIds.push('invented_source');},
  c=>{const r=c.rows.find(r=>r.segments.length);r.segments.push(structuredClone(r.segments[0]));},
  c=>{const r=c.rows.find(r=>r.segments.length);r.segments[0].anchors[0].rating=0;},
 ]){
  const changed=structuredClone(config);mutate(changed);assert.throws(()=>validate(changed,ids,roster));
 }
});
