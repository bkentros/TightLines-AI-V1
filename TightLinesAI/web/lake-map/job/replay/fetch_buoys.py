#!/usr/bin/env python3
"""Downloads past seasons of hourly water temperature from NOAA NDBC buoys
near the piers (standard meteorological history files), for replaying the
cold-water surge rule against what the water really did.

  python3 job/replay/fetch_buoys.py            # 2021–2025 → job/replay/data/
Missing station-years (buoys that weren't out) are skipped.
"""
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parent / "data"
YEARS = range(2021, 2026)
# Great Lakes buoys (NDBC + GLOS partner buoys relayed by NDBC), mostly nearshore
STATIONS = """45002 45003 45004 45005 45006 45007 45008 45012 45013 45014 45022 45023 45024 45025 45026
45027 45028 45029 45149 45154 45161 45162 45163 45164 45165 45167 45168 45169 45170 45171 45172 45173
45174 45175 45176 45177 45186 45187 45198 45199 45200 45210 45211 45212 45213 45214 45215 45216""".split()
URL = "https://www.ndbc.noaa.gov/data/historical/stdmet/{s}h{y}.txt.gz"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    got = 0
    for s in STATIONS:
        for y in YEARS:
            path = OUT / f"{s}h{y}.txt.gz"
            if path.exists() and path.stat().st_size > 0:
                got += 1
                continue
            req = urllib.request.Request(URL.format(s=s.lower(), y=y), headers={"User-Agent": "PierCast-LakeMap/1.0 (+https://finfindr.app)"})
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    path.write_bytes(r.read())
                got += 1
                print(f"  {s} {y}: ok")
            except urllib.error.HTTPError as e:
                if e.code != 404:
                    print(f"  {s} {y}: HTTP {e.code}")
            except Exception as e:  # network hiccup: keep going
                print(f"  {s} {y}: {e}")
            time.sleep(0.4)
    print(f"done — {got} station-years in {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
