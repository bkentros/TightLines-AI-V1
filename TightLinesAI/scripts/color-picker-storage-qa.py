"""Exercise the migration in an isolated temporary PostgreSQL cluster, never the app DB."""
from pathlib import Path
import concurrent.futures
import json
import os
import shutil
import subprocess
import tempfile

root = Path(__file__).resolve().parents[1]
bindir = Path(shutil.which('psql')).parent

def run(args, **kwargs):
    try:
        return subprocess.run([str(a) for a in args], check=True, text=True, capture_output=True, **kwargs)
    except subprocess.CalledProcessError as error:
        if str(args[0]).endswith(("initdb", "pg_ctl")): print(error.stderr)
        raise

with tempfile.TemporaryDirectory(prefix='color-picker-pg-', dir='/tmp') as tmp:
    base = Path(tmp)
    data = base / 'db'
    run([bindir / 'initdb', '-D', data, '-A', 'trust', '--no-locale'])
    run([bindir / 'pg_ctl', '-D', data, '-l', base / 'log', '-o', f"-k {base} -h '' -p 55439", '-w', 'start'])
    def sql(query, role=None):
        return run([bindir / 'psql', '-h', base, '-p', '55439', '-d', 'postgres', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1'], input=query).stdout.strip()
    try:
        sql("""
        create role anon; create role authenticated; create role service_role bypassrls;
        create schema auth; create table auth.users(id uuid primary key);
        create function auth.uid() returns uuid language sql as 'select nullif(current_setting(''request.jwt.claim.sub'',true),'''')::uuid';
        grant usage on schema auth to authenticated;
        insert into auth.users values ('00000000-0000-4000-8000-000000000001'),('00000000-0000-4000-8000-000000000002');
        """)
        sql((root / 'supabase/migrations/20260905120000_create_color_picker_reports.sql').read_text())
        user = '00000000-0000-4000-8000-000000000001'
        def envelope(n):
            return {'schemaVersion': 1, 'request': {'requestId':'same-request','typeId':'stick_worm'}, 'selection': {'report': {'userId':user,'requestId':'same-request','reportId':f'00000000-0000-4000-8000-{n:012d}','typeId':'stick_worm','clarity':'dirty','catalogVersion':'test','selectionVersion':'1','groups':[{'light':'cloudy','patternIds':['a','b','c']}],'generatedAt':'2026-09-05T12:00:00.000Z'}}}
        def commit(payload):
            literal=json.dumps(payload).replace("'", "''")
            return sql(f"set role service_role; select public.commit_color_picker_report('{user}', '{literal}'::jsonb);")
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
            results=list(executor.map(lambda n: commit(envelope(n)),range(10,18)))
        assert len(set(results)) == 1, 'Concurrent requests returned different winners'
        assert sql('select count(*) from public.color_picker_reports') == '1'
        assert commit(envelope(99)) == results[0]
        changed=envelope(100); changed['request']['typeId']='finesse_worm'
        try: commit(changed); raise AssertionError('Conflicting request accepted')
        except subprocess.CalledProcessError as e: assert 'color request conflict' in e.stderr
        assert sql(f"set role authenticated; set request.jwt.claim.sub='{user}'; select count(*) from public.color_picker_reports") == '1'
        assert sql("set role authenticated; set request.jwt.claim.sub='00000000-0000-4000-8000-000000000002'; select count(*) from public.color_picker_reports") == '0'
        for role in ['anon','authenticated']:
            try:
                sql(f"set role {role}; select public.commit_color_picker_report('{user}','{{}}'::jsonb)")
                raise AssertionError('Unprivileged RPC execution permitted')
            except subprocess.CalledProcessError as e: assert 'permission denied' in e.stderr
        try:
            sql('set role authenticated; delete from public.color_picker_reports')
            raise AssertionError('Client deletion permitted')
        except subprocess.CalledProcessError as e: assert 'permission denied' in e.stderr
        print('PASS: migration, 8 concurrent commits, durable replay, conflict rejection, user isolation, RPC/table permissions')
    finally:
        run([bindir / 'pg_ctl', '-D', data, '-m', 'fast', '-w', 'stop'])
