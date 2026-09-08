"""Exercise all Color Match migrations in an isolated temporary PostgreSQL cluster."""
from pathlib import Path
import concurrent.futures
import json
import shutil
import subprocess
import tempfile

root = Path(__file__).resolve().parents[1]
bindir = Path(shutil.which("psql")).parent

def run(args, **kwargs):
    try:
        return subprocess.run([str(a) for a in args], check=True, text=True, capture_output=True, **kwargs)
    except subprocess.CalledProcessError as error:
        if str(args[0]).endswith(("initdb", "pg_ctl")):
            print(error.stderr)
        raise

with tempfile.TemporaryDirectory(prefix="color-picker-pg-", dir="/tmp") as tmp:
    base = Path(tmp)
    data = base / "db"
    run([bindir / "initdb", "-D", data, "-A", "trust", "--no-locale"])
    run([bindir / "pg_ctl", "-D", data, "-l", base / "log", "-o", f"-k {base} -h '' -p 55439", "-w", "start"])

    def sql(query):
        return run([bindir / "psql", "-h", base, "-p", "55439", "-d", "postgres", "-X", "-qAt", "-v", "ON_ERROR_STOP=1"], input=query).stdout.strip()

    user = "00000000-0000-4000-8000-000000000001"
    other_user = "00000000-0000-4000-8000-000000000002"

    def commit(payload):
        literal = json.dumps(payload).replace("'", "''")
        return sql(f"set role service_role; select public.commit_color_picker_report('{user}', '{literal}'::jsonb);")

    def envelope(n, request_id=None, clarity="dirty"):
        request_id = request_id or f"request-{n}"
        return {
            "schemaVersion": 2,
            "request": {"requestId": request_id, "typeId": "soft_plastic_worm", "clarity": clarity, "date": "2026-09-05", "timezone": "America/Detroit"},
            "selection": {
                "sharedAcrossLight": False,
                "report": {
                    "schemaVersion": 1,
                    "userId": user,
                    "requestId": request_id,
                    "reportId": f"00000000-0000-4000-8000-{n:012d}",
                    "typeId": "soft_plastic_worm",
                    "clarity": clarity,
                    "catalogVersion": "2026-09-08.3",
                    "selectionVersion": "4.0.0",
                    "generatedAt": "2026-09-05T12:00:00.000Z",
                    "groups": [
                        {"light": "sunny", "patternIds": ["a", "b"]},
                        {"light": "cloudy", "patternIds": ["a", "c"]},
                    ],
                },
                "groups": [],
            },
        }

    try:
        sql(f"""
        create role anon; create role authenticated; create role service_role bypassrls;
        create schema auth; create table auth.users(id uuid primary key);
        create function auth.uid() returns uuid language sql as 'select nullif(current_setting(''request.jwt.claim.sub'',true),'''')::uuid';
        grant usage on schema auth to authenticated;
        insert into auth.users values ('{user}'),('{other_user}');
        """)
        sql((root / "supabase/migrations/20260905120000_create_color_picker_reports.sql").read_text())
        sql((root / "supabase/migrations/20260907170000_color_picker_daily_reports.sql").read_text())

        legacy = {
            "schemaVersion": 1,
            "request": {"requestId": "legacy-one", "typeId": "soft_plastic_worm", "clarity": "clear", "date": "2026-09-04", "timezone": "America/Detroit", "latitude": 42.3, "longitude": -83.1},
            "weather": {"meanCloudPercent": 40, "hourly": [{"cloudPercent": 40}]},
            "selection": {"report": {"schemaVersion": 1, "userId": user, "requestId": "legacy-one", "reportId": "00000000-0000-4000-8000-000000000099", "typeId": "soft_plastic_worm", "clarity": "clear", "catalogVersion": "2026-09-08.3", "selectionVersion": "3.0.0", "generatedAt": "2026-09-04T12:00:00.000Z", "groups": [{"light": "sunny", "patternIds": ["a", "b"]}, {"light": "cloudy", "patternIds": ["a", "c"]}]}},
        }
        legacy_literal = json.dumps(legacy).replace("'", "''")
        sql(f"set role service_role; select public.commit_color_picker_report('{user}', '{legacy_literal}'::jsonb);")

        sql((root / "supabase/migrations/20260908160000_color_picker_privacy_and_clarity_lock.sql").read_text())
        assert sql("select (envelope ? 'weather')::text || ',' || (envelope->'request' ? 'latitude')::text || ',' || (envelope->'request' ? 'longitude')::text from public.color_picker_reports where request_id='legacy-one'") == "false,false,false"

        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
            results = list(executor.map(lambda n: commit(envelope(n)), range(10, 18)))
        assert len(set(results)) == 1, "Concurrent daily requests returned different winners"
        assert sql("select count(*) from public.color_picker_reports") == "2"

        winner = json.loads(results[0])
        assert commit(envelope(int(winner["selection"]["report"]["reportId"][-12:]), winner["request"]["requestId"])) == results[0]
        clear = commit(envelope(30, "clear-water", "clear"))
        assert clear != results[0]
        assert sql("select count(*) from public.color_picker_reports") == "3"

        changed = envelope(40, winner["request"]["requestId"])
        changed["request"]["typeId"] = "crankbait"
        changed["selection"]["report"]["typeId"] = "crankbait"
        try:
            commit(changed)
            raise AssertionError("Conflicting request accepted")
        except subprocess.CalledProcessError as error:
            assert "color request conflict" in error.stderr

        malformed = envelope(50, "bad-groups")
        malformed["selection"]["report"]["groups"][0]["patternIds"] = ["a", "a"]
        try:
            commit(malformed)
            raise AssertionError("Malformed report accepted")
        except subprocess.CalledProcessError as error:
            assert "invalid daily color report" in error.stderr

        privacy_violation = envelope(60, "private-fields")
        privacy_violation["weather"] = {"hourly": []}
        privacy_violation["request"]["latitude"] = 42.3
        try:
            commit(privacy_violation)
            raise AssertionError("Schema 2 report accepted forbidden private context")
        except subprocess.CalledProcessError as error:
            assert "invalid color report" in error.stderr

        assert sql(f"set role authenticated; set request.jwt.claim.sub='{user}'; select count(*) from public.color_picker_reports") == "3"
        assert sql(f"set role authenticated; set request.jwt.claim.sub='{other_user}'; select count(*) from public.color_picker_reports") == "0"
        for role in ["anon", "authenticated"]:
            try:
                sql(f"set role {role}; select public.commit_color_picker_report('{user}','{{}}'::jsonb)")
                raise AssertionError("Unprivileged RPC execution permitted")
            except subprocess.CalledProcessError as error:
                assert "permission denied" in error.stderr

        print("PASS: privacy redaction/enforcement, clarity-scoped daily lock, 8 concurrent commits, validation, replay, isolation, and permissions")
    finally:
        run([bindir / "pg_ctl", "-D", data, "-m", "fast", "-w", "stop"])
