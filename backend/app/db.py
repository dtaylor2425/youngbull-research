from __future__ import annotations

import os
from contextlib import contextmanager

from sqlalchemy import URL, create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


def build_database_url():
    """
    Railway production:
    Build a SQLAlchemy URL from individual PG variables.

    Local development:
    Use DATABASE_URL when it contains a complete URL.

    Final fallback:
    Use a local SQLite database.
    """

    pg_host = os.getenv("PGHOST", "").strip()
    pg_port = os.getenv("PGPORT", "").strip()
    pg_user = os.getenv("PGUSER", "").strip()
    pg_password = os.getenv("PGPASSWORD", "")
    pg_database = os.getenv("PGDATABASE", "").strip()

    if all([pg_host, pg_port, pg_user, pg_password, pg_database]):
        return URL.create(
            drivername="postgresql+psycopg2",
            username=pg_user,
            password=pg_password,
            host=pg_host,
            port=int(pg_port),
            database=pg_database,
        )

    database_url = os.getenv("DATABASE_URL", "").strip()

    if database_url:
        # Railway or older providers may return postgres://.
        if database_url.startswith("postgres://"):
            database_url = database_url.replace(
                "postgres://",
                "postgresql://",
                1,
            )

        return database_url

    return "sqlite:///./youngbull.db"


DATABASE_URL = build_database_url()

connect_args = (
    {"check_same_thread": False}
    if isinstance(DATABASE_URL, str)
    and DATABASE_URL.startswith("sqlite")
    else {}
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    pass


@contextmanager
def session_scope():
    session = SessionLocal()

    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def init_db() -> None:
    from app import tables  # noqa: F401

    Base.metadata.create_all(bind=engine)