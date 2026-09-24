"""Checksum-verified three-version replay comparison; exits nonzero on contract regressions."""
import gzip, hashlib, itertools, json, sys
from pathlib import Path
ROOT = Path('docs/audits')
OUT = Path(sys.argv[1]) if len(sys.argv)>1 else ROOT / 'todays-bite-pass2'
PASS1 = ROOT / 'todays-bite-pass2'
def records(directory, name):
    path = directory / (name + '.jsonl.gz')
    manifest = json.loads((directory / (name + '.manifest.json')).read_text())
    assert hashlib.sha256(path.read_bytes()).hexdigest() == manifest['sha256'], path
    with gzip.open(path, 'rt') as f:
        count = 0
        for line in f:
            count += 1
            yield json.loads(line)
        assert count == manifest['fixtures']
def selected(rec):
    return {k:v['id'] for k,v in rec['response']['picks'].items()}
def metric():
    return dict(fixtures=0, changed_scores=0, changed_bands=0, changed_timing=0,
                changed_reliability=0, score_delta_sum=0, increased=0, decreased=0,
                max_increase=0, max_decrease=0, matched_recommendations=0,
                changed_picks=0, changed_scenarios=0, added_recommendations=0,
                lost_recommendations=0, changed_lures=0, changed_flies=0, changed_activity=0, changed_surface_gate=0, changed_color_theme=0, changed_thermal_tags=0, changed_pace_or_depth=0)
def compare(a,b,m):
    m['fixtures'] += 1
    x,y=a['report'],b['report']; delta=y['score']-x['score']
    for key,field in [('changed_scores','score'),('changed_bands','band'),('changed_reliability','reliability')]:
        m[key] += x[field] != y[field]
    m['changed_timing'] += any(x[k]!=y[k] for k in ['daypart_preset','highlighted_periods','timing_strength'])
    m['score_delta_sum'] += delta
    m['increased'] += delta>0; m['decreased'] += delta<0
    m['max_increase']=max(m['max_increase'],delta);m['max_decrease']=min(m['max_decrease'],delta)
    aa={(r['species'],r['goal']):r for r in a['recommendations']}
    bb={(r['species'],r['goal']):r for r in b['recommendations']}
    m['added_recommendations'] += len(bb.keys()-aa.keys())
    m['lost_recommendations'] += len(aa.keys()-bb.keys())
    for k in aa.keys() & bb.keys():
        m['matched_recommendations']+=1
        p,q=selected(aa[k]),selected(bb[k])
        m['changed_picks']+=p!=q
        m['changed_lures']+=any(p[s]!=q[s] for s in p if 'lure' in s)
        m['changed_flies']+=any(p[s]!=q[s] for s in p if 'fly' in s)
        old_s,new_s=aa[k]['response']['scenario_summary'],bb[k]['response']['scenario_summary']
        m['changed_scenarios']+=old_s!=new_s
        for counter,field in [('changed_activity','activity_level'),('changed_surface_gate','surface_daily_gate'),('changed_color_theme','color_palette_theme')]:
            m[counter]+=old_s[field]!=new_s[field]
        thermal={'heat_finesse','cold_slow','warming_trend'}
        m['changed_thermal_tags']+=(set(old_s['scenario_tags']) & thermal)!=(set(new_s['scenario_tags']) & thermal)
        old_p,new_p=aa[k]['response']['picks'],bb[k]['response']['picks']
        m['changed_pace_or_depth']+=any((old_p[slot]['primary_pace'],old_p[slot]['column'])!=(new_p[slot]['primary_pace'],new_p[slot]['column']) for slot in old_p)
summary={}
for prefix in ['', 'boundaries-']:
    original, previous = metric(), metric()
    groups={}; examples=[]; recommendations=0
    streams=[records(ROOT/'todays-bite-pass1',prefix+'baseline'),records(PASS1,prefix+'pass1'),records(OUT,prefix+'candidate')]
    for a,b,c in itertools.zip_longest(*streams):
        assert a and b and c and a['id']==b['id']==c['id'], 'Fixture identity/coverage changed'
        assert b['input']==c['input'], c['id']
        bn,cn=b['normalized'],c['normalized']
        for key in ['location','context','available_variables','missing_variables','data_gaps']:
            assert bn[key]==cn[key],(c['id'],key)
        for key in bn['normalized'].keys() | cn['normalized'].keys():
            if key not in ['temperature','light_cloud_condition']:
                assert bn['normalized'].get(key)==cn['normalized'].get(key),(c['id'],key)
        r=c['report']; score=r['score']
        assert 0<=score<=100 and isinstance(score,int)
        band='Prime' if score>=80 else 'Good' if score>=65 else 'Fair' if score>=50 else 'Poor' if score>=35 else 'Tough'
        assert r['band']==band,(c['id'],score,r['band'])
        if cn['missing_variables'] or cn['data_gaps']: assert score<=64,c['id']
        if cn['reliability']!='high': assert score<=72,c['id']
        weights=r['condition_context']['composite_contributions']
        if weights:
            assert abs(sum(w['weight'] for w in weights)-100)<1e-6,c['id']
            assert abs(sum(w['weight_percent'] for w in weights)-100)<.04,c['id']
        assert [(x['species'],x['goal']) for x in b['recommendations']]==[(x['species'],x['goal']) for x in c['recommendations']],c['id']
        for rec in c['recommendations']:
            recommendations+=1
            rr=rec['response'];picks=list(rr['picks'].values())
            assert len(picks)==4 and len({p['id'] for p in picks})==4,c['id']
            if rr['scenario_summary']['surface_daily_gate']=='closed': assert not any(p['is_surface'] for p in picks),c['id']
            temp=cn['normalized'].get('temperature')
            if temp and temp['band_label']=='very_warm' and temp['final_score']>.5 and rec['species']!='river_trout':
                assert 'heat_finesse' not in rr['scenario_summary']['scenario_tags'],c['id']
        compare(a,c,original);compare(b,c,previous)
        region=c['input']['region_key'];month=int(c['input']['local_date'][5:7]);context=c['input']['context']
        key=f'{region}|{context}|'+('Sep-Mar' if month in [9,10,11,12,1,2,3] else 'Apr-Aug')
        compare(b,c,groups.setdefault(key,metric()))
        delta=score-b['report']['score']
        examples.append(dict(id=c['id'],original=a['report']['score'],pass1=b['report']['score'],pass2=score,delta=delta,temperature=c['input']['environment'].get('daily_mean_air_temp_f'),thermal_before=bn['normalized'].get('temperature'),thermal_after=cn['normalized'].get('temperature')))
    assert previous['lost_recommendations']==0 and previous['added_recommendations']==0
    summary[prefix or 'main']=dict(original_to_pass2=original,pass1_to_pass2=previous,recommendation_sets=recommendations,by_region_context_season=groups,largest_increases=sorted(examples,key=lambda x:x['delta'],reverse=True)[:15],largest_decreases=sorted(examples,key=lambda x:x['delta'])[:15],contract_violations=0)
(OUT/'comparison.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps({k:{kk:vv for kk,vv in v.items() if kk not in ['by_region_context_season','largest_increases','largest_decreases']} for k,v in summary.items()},indent=2))
