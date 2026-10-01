"""Summarize improvement criteria and expose counterexamples, not just score increases."""
import gzip,json
from pathlib import Path
root=Path('docs/audits/todays-bite-pass3')
raw=json.loads(gzip.decompress((root/'regional-evaluation-detail.json.gz').read_bytes()))
reports=raw['reports'];picks=raw['recommendations']
def subset(rows):
 return dict(cases=len(rows),score_means=[round(sum(r['versions'][i]['score'] for r in rows)/len(rows),3) for i in range(3)],changed_scores=sum(r['versions'][0]['score']!=r['versions'][2]['score'] for r in rows),changed_regions=sum(r['versions'][0]['region']!=r['versions'][2]['region'] for r in rows),changed_pressure=sum(r['versions'][0]['pressure']!=r['versions'][2]['pressure'] for r in rows))
report_by_id={r['id']:r for r in reports}
warm=[]
for p in picks:
 r=report_by_id[p['id']]
 for i in [0,2]:
  rec=p['versions'][i];t=r['versions'][i]['temperature']
  if rec and p['species']!='river_trout' and t and t['band_label']=='very_warm' and t['final_score']>.5 and 'heat_finesse' in rec['scenario']['scenario_tags']:
   warm.append(dict(version=i,id=p['id'],species=p['species'],goal=p['goal'],temperature=r['air_mean_f']))
cal=[]
for r in reports:
 if max(r['calendar_delta'])>=4:cal.append({k:r[k] for k in ['id','air_mean_f','calendar_delta']})
result=dict(freshwater=subset([r for r in reports if r['context'].startswith('freshwater')]),coastal_air_without_tides=subset([r for r in reports if r['context'].startswith('coastal')]),by_city_freshwater={city:subset([r for r in reports if r['city']==city and r['context'].startswith('freshwater')]) for city in sorted({r['city'] for r in reports})},favorable_warmth_heat_conflicts=warm,temperature_range_f=[min(r['air_mean_f'] for r in reports),max(r['air_mean_f'] for r in reports)],cooling_at_least_10f_cases=sum(r['prior_air_mean_f']-r['air_mean_f']>=10 for r in reports),calendar_examples=cal)
(root/'regional-findings.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['by_city_freshwater','calendar_examples','favorable_warmth_heat_conflicts']},indent=2))
print('Favorable-warmth heat conflicts:',{i:sum(w['version']==i for w in warm) for i in [0,2]})
