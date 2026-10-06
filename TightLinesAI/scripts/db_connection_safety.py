#!/usr/bin/env python3
"""Credential-safe PostgreSQL connection helpers for local operator tools.

Passwords are passed to clients only through process-local environment or
keyword arguments.  They are never placed in argv, and all captured client
output is redacted before it reaches a terminal or CI log.
"""
from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit


class SafeDatabaseError(RuntimeError):
    """A database failure whose text is safe to display."""


@dataclass(frozen=True)
class DatabaseConfig:
    host: str
    port: int
    dbname: str
    user: str
    password: str
    sslmode: str = "require"

    def client_environment(self, base: dict[str, str] | None = None) -> dict[str, str]:
        environment = dict(os.environ if base is None else base)
        environment.update({
            "PGHOST": self.host,
            "PGPORT": str(self.port),
            "PGDATABASE": self.dbname,
            "PGUSER": self.user,
            "PGPASSWORD": self.password,
            "PGSSLMODE": self.sslmode,
        })
        return environment

    def psycopg_kwargs(self) -> dict[str, object]:
        return {
            "host": self.host,
            "port": self.port,
            "dbname": self.dbname,
            "user": self.user,
            "password": self.password,
            "sslmode": self.sslmode,
        }


def config_from_url(value: str, password_override: str | None = None) -> DatabaseConfig:
    parsed = urlsplit(value.strip())
    if parsed.scheme not in ("postgres", "postgresql") or not parsed.hostname:
        raise SafeDatabaseError("Database configuration is invalid (credentials redacted).")
    password = password_override if password_override is not None else unquote(parsed.password or "")
    if not parsed.username or not password:
        raise SafeDatabaseError("Database credentials are incomplete (credentials redacted).")
    query = parse_qs(parsed.query)
    return DatabaseConfig(
        host=parsed.hostname,
        port=parsed.port or 5432,
        dbname=unquote(parsed.path.lstrip("/") or "postgres"),
        user=unquote(parsed.username),
        password=password,
        sslmode=query.get("sslmode", ["require"])[0],
    )


def config_from_environment(environment: dict[str, str] | None = None) -> DatabaseConfig:
    env = os.environ if environment is None else environment
    if all(env.get(key) for key in ("PGHOST", "PGDATABASE", "PGUSER", "PGPASSWORD")):
        try:
            port = int(env.get("PGPORT", "5432"))
        except ValueError as error:
            raise SafeDatabaseError("Database configuration is invalid (credentials redacted).") from None
        return DatabaseConfig(
            host=env["PGHOST"], port=port, dbname=env["PGDATABASE"],
            user=env["PGUSER"], password=env["PGPASSWORD"],
            sslmode=env.get("PGSSLMODE", "require"),
        )
    legacy = env.get("DATABASE_URL") or env.get("V1_DATABASE_URL")
    if not legacy:
        raise SafeDatabaseError(
            "PGHOST, PGDATABASE, PGUSER, and PGPASSWORD must be set."
        )
    return config_from_url(legacy)


def secret_values(environment: dict[str, str] | None = None) -> list[str]:
    env = os.environ if environment is None else environment
    values = [env.get("PGPASSWORD"), env.get("SUPABASE_DB_PASSWORD")]
    for name in ("DATABASE_URL", "V1_DATABASE_URL"):
        raw = env.get(name)
        if raw:
            try:
                values.append(unquote(urlsplit(raw).password or ""))
            except ValueError:
                pass
    return sorted({value for value in values if value}, key=len, reverse=True)


def redact_database_text(value: object, secrets: list[str] | None = None) -> str:
    text = str(value)
    for secret in secrets or secret_values():
        text = text.replace(secret, "[redacted]")
    text = re.sub(
        r"(?i)\bpostgres(?:ql)?://[^\s]+",
        "[database_url_redacted]",
        text,
    )
    text = re.sub(r"(?i)(\bpassword\s*=\s*)('[^']*'|\"[^\"]*\"|[^\s]+)", r"\1[redacted]", text)
    text = re.sub(r"(?i)([?&]password=)[^&\s]+", r"\1[redacted]", text)
    return text


def connect_psycopg_safely(connector, config: DatabaseConfig, **kwargs):
    try:
        return connector(**config.psycopg_kwargs(), **kwargs)
    except Exception:
        raise SafeDatabaseError("Database connection failed (credentials redacted).") from None


def run_psql_safely(
    psql: str,
    sql_file: Path,
    config: DatabaseConfig,
    *,
    runner=subprocess.run,
    stdout=None,
    stderr=None,
) -> int:
    """Run psql without connection material in argv and redact all output."""
    out = sys.stdout if stdout is None else stdout
    err = sys.stderr if stderr is None else stderr
    argv = [psql, "-X", "-v", "ON_ERROR_STOP=1", "-f", str(sql_file)]
    secrets = [config.password]
    try:
        result = runner(
            argv,
            env=config.client_environment(),
            text=True,
            capture_output=True,
            check=False,
        )
    except Exception as error:
        print(redact_database_text(error, secrets), file=err)
        return 1
    if result.stdout:
        print(redact_database_text(result.stdout.rstrip(), secrets), file=out)
    if result.stderr:
        print(redact_database_text(result.stderr.rstrip(), secrets), file=err)
    return int(result.returncode)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run psql with env-only credentials and redacted output.")
    parser.add_argument("--psql", required=True)
    parser.add_argument("--connection-url-file", type=Path, required=True)
    parser.add_argument("--sql-file", type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        password = os.environ.get("SUPABASE_DB_PASSWORD") or os.environ.get("PGPASSWORD")
        config = config_from_url(args.connection_url_file.read_text(), password_override=password)
        return run_psql_safely(args.psql, args.sql_file, config)
    except Exception as error:
        print(redact_database_text(error), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
