const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
const version='bite_conditions_2026_09_v1';
function load(file,privateExports=[]){
 const entries=new Map();const storage={getItem:async k=>entries.get(k)??null,setItem:async(k,v)=>entries.set(k,v),removeItem:async k=>entries.delete(k),getAllKeys:async()=>[...entries.keys()],multiRemove:async keys=>keys.forEach(k=>entries.delete(k))};
 const source=fs.readFileSync(file,'utf8')+'\n'+privateExports.map(k=>`export { ${k} };`).join('\n');
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const exports={};const mocks={'@react-native-async-storage/async-storage':storage,'../supabase/functions/_shared/conditionModelVersion':{CONDITION_MODEL_VERSION:version},'./supabase':{},'./howFishingRebuildContracts':{},'./forecastSnapshot':{},'./recommenderContracts':{DAILY_PICKS_SESSION_ENGINE_VERSION:'recommender_daily_picks_2x2_sessionv1_goalv3'}};
 vm.runInNewContext(code,{exports,require:name=>{if(!(name in mocks))throw Error(name);return mocks[name];},process:{env:{}},Date,Map,encodeURIComponent,console,setTimeout,clearTimeout});
 return {api:exports,entries};
}
test('report caches reject the old namespace and round-trip current reports with owner isolation',async()=>{
 const {api,entries}=load('lib/howFishing.ts');const context='freshwater_lake_pond';const date='2026-11-01';
 const bundle={engine_context:context,cache_expires_at:'2099-01-01T00:00:00Z',report:{location:{timezone:'America/New_York'}}};
 entries.set(`how_fishing_forecast_v4_owner_30.000_-84.000_${date}_${context}`,JSON.stringify({lat:30,lon:-84,bundle,cache_expires_at:bundle.cache_expires_at}));
 assert.equal(await api.getCachedForecastRebuild(30,-84,date,[context],'owner'),null);
 await api.setCachedForecastRebuild(30,-84,date,{contexts:[context],reports:{[context]:bundle},cache_expires_at:bundle.cache_expires_at},'owner');
 assert.deepEqual(JSON.parse(JSON.stringify(await api.getCachedForecastRebuild(30,-84,date,[context],'owner'))),{[context]:bundle});
 assert.equal(await api.getCachedForecastRebuild(30,-84,date,[context],'other'),null);
 assert.ok([...entries.keys()].some(k=>k.includes(version)));
 await api.clearHowFishingReportCaches();assert.equal(entries.size,0);
});
test('forecast cache revision isolates old chips, subscription range and snapshot requirement',()=>{
 const {api}=load('lib/forecastScores.ts',['cacheKey']);
 const key=api.cacheKey(30,-84);assert.ok(key.startsWith('forecast_scores_v11_'+version));
 assert.notEqual(key,api.cacheKey(30,-84,{maxDayOffset:2,includeSnapshotEnv:true}));
 assert.notEqual(key,api.cacheKey(30,-84,{maxDayOffset:6,includeSnapshotEnv:false}));
});
test('recommendation cache revision isolates prior model, owner and variants without changing DB session identity',()=>{
 const {api}=load('lib/recommender.ts',['cacheKey']);
 const req={latitude:30,longitude:-84,state_code:'FL',species:'largemouth_bass',context:'freshwater_lake_pond',water_clarity:'clear',recommendation_goal:'all_purpose',target_date:'2026-11-01',env_data:{timezone:'UTC'}};
 const key=api.cacheKey(req,'A','owner');assert.ok(key.includes(version));
 assert.notEqual(key,api.cacheKey(req,'B','owner'));assert.notEqual(key,api.cacheKey(req,'A','other'));
 assert.ok(key.startsWith('recommender_daily_picks_2x2_sessionv1_goalv3'));
});
