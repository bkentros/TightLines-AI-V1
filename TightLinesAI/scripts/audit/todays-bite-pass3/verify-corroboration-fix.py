"""Compare the preserved pre-fix model with the corrected model; enforce scope and contracts."""
import gzip,hashlib,itertools,json
from pathlib import Path
root=Path('docs/audits/todays-bite-pass3');out=root/'corroboration-fix'
def records(directory,name):
 p=directory/(name+'.jsonl.gz');m=json.loads((directory/(name+'.manifest.json')).read_text());assert hashlib.sha256(p.read_bytes()).hexdigest()==m['sha256']
 with gzip.open(p,'rt') as f:
  for line in f:yield json.loads(line)
summary={}
for prefix in ['', 'boundaries-']:
 stats=dict(cases=0,changed_scores=0,changed_bands=0,recommendation_sets=0,changed_picks=0,changed_surface_gates=0,changed_activity=0,max_reduction=0,contract_violations=0);examples=[]
 for a,b in itertools.zip_longest(records(root,prefix+'candidate'),records(out,prefix+'candidate')):
  assert a and b and a['id']==b['id'];assert a['input']==b['input'];assert a['normalized']==b['normalized'];stats['cases']+=1
  old,new=a['report'],b['report'];delta=old['score']-new['score'];assert delta>=0,(b['id'],delta)
  if b['input']['context']!='freshwater_lake_pond':assert old==new,b['id']
  assert 0<=new['score']<=100
  if delta:
   stats['changed_scores']+=1;stats['max_reduction']=max(stats['max_reduction'],delta)
   assert new['score']>=79,(b['id'],new['score'])
   if len(examples)<20:examples.append(dict(id=b['id'],before=old['score'],after=new['score']))
  stats['changed_bands']+=old['band']!=new['band']
  for field in ['location','reliability','daypart_preset','highlighted_periods','timing_strength','drivers','suppressors','condition_context']:assert old[field]==new[field],(b['id'],field)
  assert len(a['recommendations'])==len(b['recommendations'])
  for x,y in zip(a['recommendations'],b['recommendations']):
   assert (x['species'],x['goal'])==(y['species'],y['goal']);stats['recommendation_sets']+=1
   before,after=x['response'],y['response'];ss=after['scenario_summary'];picks=list(after['picks'].values());assert len(picks)==4 and len({p['id'] for p in picks})==4
   if ss['surface_daily_gate']=='closed':assert not any(p['is_surface'] for p in picks)
   stats['changed_picks']+=[p['id'] for p in before['picks'].values()]!=[p['id'] for p in picks]
   stats['changed_surface_gates']+=before['scenario_summary']['surface_daily_gate']!=ss['surface_daily_gate']
   stats['changed_activity']+=before['scenario_summary']['activity_level']!=ss['activity_level']
   if delta==0:assert before==after,b['id']
 summary[prefix or 'main']={**stats,'examples':examples}
(out/'fix-comparison.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2))
