"""Keep pre-fix real-weather evidence and assert the correction's narrow scope."""
import gzip,json
from pathlib import Path
root=Path('docs/audits/todays-bite-pass3');out=root/'corroboration-fix'
a=json.loads(gzip.decompress((root/'regional-evaluation-detail.json.gz').read_bytes()));b=json.loads(gzip.decompress((out/'regional-evaluation-detail.json.gz').read_bytes()))
changes=[];picks=0
assert len(a['reports'])==len(b['reports'])==756
for old,new in zip(a['reports'],b['reports']):
 assert old['id']==new['id'];x,y=old['versions'][2],new['versions'][2]
 assert x['score']>=y['score']
 for k in x.keys()-{'score','band'}:assert x[k]==y[k],(new['id'],k)
 if x['score']!=y['score']:
  assert new['context']=='freshwater_lake_pond' and y['score']>=79
  changes.append(dict(id=new['id'],before=x['score'],after=y['score'],calendar_before=old['calendar_delta'][2],calendar_after=new['calendar_delta'][2]))
assert len(a['recommendations'])==len(b['recommendations'])==1764
for old,new in zip(a['recommendations'],b['recommendations']):
 assert (old['id'],old['species'],old['goal'])==(new['id'],new['species'],new['goal'])
 picks+=old['versions'][2]['picks']!=new['versions'][2]['picks']
summary=json.loads((out/'regional-evaluation.json').read_text())
assert not summary['violations'];assert not summary['calendar_worse']
result=dict(report_cases=756,recommendation_sets=1764,changed_reports=changes,changed_pick_sets=picks,calendar_worse_than_original_by_more_than_3=0,calendar_final=summary['calendar_counterfactual'][2])
(out/'regional-fix-comparison.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
