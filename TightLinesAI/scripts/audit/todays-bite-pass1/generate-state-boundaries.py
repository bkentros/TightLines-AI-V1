"""Generate bundled Census state rings without third-party Python dependencies.
Usage: python3 scripts/audit/todays-bite-pass1/generate-state-boundaries.py /path/to/cb_2024_us_state_500k.zip
Source: https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_state_500k.zip
Coordinates are rounded to five decimal degrees (~1m); no additional simplification.
"""
import hashlib,json,struct,sys,zipfile
from pathlib import Path
source=Path(sys.argv[1]); archive=zipfile.ZipFile(source)
dbf=archive.read(next(n for n in archive.namelist() if n.endswith('.dbf')))
count=struct.unpack_from('<I',dbf,4)[0]; hlen,rlen=struct.unpack_from('<HH',dbf,8)
fields=[]; off=32; column=1
while dbf[off]!=13:
 name=dbf[off:off+11].split(b'\0')[0].decode(); length=dbf[off+16]
 fields.append((name,column,length)); column+=length;off+=32
statefield=next(f for f in fields if f[0]=='STUSPS')
states=[dbf[hlen+i*rlen+statefield[1]:hlen+i*rlen+statefield[1]+statefield[2]].decode().strip() for i in range(count)]
shp=archive.read(next(n for n in archive.namelist() if n.endswith('.shp')))
def encode(ring):
 out=[];last=[0,0]
 for point in ring:
  for axis in range(2):
   value=round(point[axis]*100000); delta=value-last[axis];last[axis]=value
   n=delta*2 if delta>=0 else -delta*2-1
   while n>=32:out.append(chr((n&31|32)+63));n>>=5
   out.append(chr(n+63))
 return ''.join(out)
records=[]; pos=100; index=0
while pos<len(shp):
 _,size=struct.unpack_from('>II',shp,pos); data=shp[pos+8:pos+8+size*2];pos+=8+size*2
 state=states[index];index+=1
 if state in ['AS','GU','MP','PR','VI']:continue
 assert struct.unpack_from('<I',data,0)[0]==5
 parts,points=struct.unpack_from('<II',data,36)
 starts=list(struct.unpack_from('<'+'I'*parts,data,44))+[points]
 xy=[tuple(round(v,5) for v in struct.unpack_from('<dd',data,44+4*parts+16*i)) for i in range(points)]
 rings=[]
 for i in range(parts):
  ring=xy[starts[i]:starts[i+1]]
  rings.append([[min(p[0] for p in ring),min(p[1] for p in ring),max(p[0] for p in ring),max(p[1] for p in ring)],encode(ring)])
 records.append([state,rings])
records.sort()
path=Path('supabase/functions/_shared/howFishingEngine/context/usStatePolygons.ts')
header='''// Generated from US Census 2024 1:500,000 cartographic state boundaries (public domain).
// Source: https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_state_500k.zip
// Land-clipped cartographic boundaries; not a legal jurisdiction or offshore boundary service.
// Regenerate with scripts/audit/todays-bite-pass1/generate-state-boundaries.py.
// Source SHA-256: '''+hashlib.sha256(source.read_bytes()).hexdigest()+'''
// deno-fmt-ignore-file
export type StateRing = [bounds: [number, number, number, number], encoded: string];
export const US_STATE_POLYGONS: [state: string, rings: StateRing[]][] =
'''
path.write_text(header+json.dumps(records,separators=(',',':'))+';\n')
print(len(records),'states/DC;',sum(len(r[1]) for _,rs in records for r in rs),'encoded characters;',path.stat().st_size,'bytes')
