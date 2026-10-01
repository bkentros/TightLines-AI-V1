"""Capture approved public city reanalysis, not private coordinates or catch data."""
import concurrent.futures,gzip,hashlib,json,urllib.parse,urllib.request
from datetime import datetime,timezone
from pathlib import Path
out=Path('docs/audits/todays-bite-pass3/regional-weather.json.gz')
if out.exists():raise RuntimeError('Refusing to overwrite frozen weather capture')
cities=[('Tallahassee',30.4383,-84.2807,'America/New_York'),('Tampa',27.9506,-82.4572,'America/New_York'),('Miami',25.7617,-80.1918,'America/New_York'),('Dallas',32.7767,-96.797,'America/Chicago'),('Houston',29.7604,-95.3698,'America/Chicago'),('Brownsville',25.9017,-97.4975,'America/Chicago'),('Montgomery',32.3668,-86.3,'America/Chicago'),('Jackson',32.2988,-90.1848,'America/Chicago'),('Detroit',42.3314,-83.0458,'America/Detroit')]
periods=[('fall_boundary','2025-10-14','2025-11-03'),('winter','2026-01-01','2026-01-21'),('late_winter','2026-02-14','2026-03-06')]
def fetch(item):
 city,period=item;name,lat,lon,tz=city;season,start,end=period
 params=dict(latitude=lat,longitude=lon,start_date=start,end_date=end,hourly='temperature_2m,pressure_msl,cloud_cover,wind_speed_10m,precipitation',daily='temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset',temperature_unit='fahrenheit',wind_speed_unit='mph',timezone=tz,timeformat='unixtime')
 url='https://archive-api.open-meteo.com/v1/archive?'+urllib.parse.urlencode(params)
 with urllib.request.urlopen(url,timeout=45) as response:data=json.load(response)
 assert len(data['daily']['time'])==21,(name,season)
 print(name,season,flush=True)
 return dict(city=name,latitude=lat,longitude=lon,timezone=tz,season=season,url=url,data=data)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:rows=list(pool.map(fetch,[(c,p) for c in cities for p in periods]))
raw=json.dumps(dict(captured_at=datetime.now(timezone.utc).isoformat(),kind='Open-Meteo historical reanalysis, not archived forecasts or catch outcomes',rows=rows),separators=(',',':')).encode()
out.write_bytes(gzip.compress(raw,mtime=0))
out.with_suffix('').with_suffix('.manifest.json').write_text(json.dumps(dict(sha256=hashlib.sha256(out.read_bytes()).hexdigest(),bytes=out.stat().st_size,snapshots=len(rows)),indent=2)+'\n')
