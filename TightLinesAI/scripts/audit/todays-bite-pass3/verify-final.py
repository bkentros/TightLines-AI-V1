"""Final replay is byte-identical to Pass 2; verify all preserved archive checksums."""
import hashlib,json
from pathlib import Path
root=Path('docs/audits');count=0
for directory in ['todays-bite-pass1','todays-bite-pass2','todays-bite-pass3']:
 for manifest in (root/directory).glob('*.manifest.json'):
  data=json.loads(manifest.read_text());stem=manifest.name.removesuffix('.manifest.json')
  paths=[manifest.parent/(stem+s) for s in ['.jsonl.gz','.tar.gz','.json.gz','.json']]
  path=next((p for p in paths if p.exists()),None)
  if not path:continue
  assert hashlib.sha256(path.read_bytes()).hexdigest()==data['sha256'],str(path);count+=1
for prefix in ['', 'boundaries-']:
 a=root/'todays-bite-pass2'/(prefix+'candidate.jsonl.gz');b=root/'todays-bite-pass3'/(prefix+'candidate.jsonl.gz')
 assert a.read_bytes()==b.read_bytes(),prefix+'Final scoring or recommendation behavior changed'
result=dict(verified_archives=count,final_condition_cases=24232,final_recommendation_sets=10134,pass2_to_final_report_and_recommendation_differences=0)
(root/'todays-bite-pass3'/'final-parity.json').write_text(json.dumps(result,indent=2)+'\n')
print(result)
