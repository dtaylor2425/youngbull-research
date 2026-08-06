from __future__ import annotations

import logging
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

from sqlalchemy import delete

from app.db import init_db, session_scope
from app.services.scoring import collect_raw, score_universe
from app.tables import StockScore
from app.universe import UNIVERSE

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("youngbull.refresh")

MAX_WORKERS = max(1, min(int(os.getenv("SCORE_MAX_WORKERS", "8")), 12))
MIN_COVERAGE = float(os.getenv("SCORE_MIN_COVERAGE", "0.65"))

def collect_one(ticker: str):
    try:
        item = collect_raw(ticker)
        logger.info("Collected %s", ticker)
        return item
    except Exception:
        logger.exception("Failed %s", ticker)
        return None

def main() -> None:
    init_db()
    logger.info(
        "Starting score refresh for %s tickers with %s workers",
        len(UNIVERSE),
        MAX_WORKERS,
    )

    raw = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(collect_one, ticker): ticker for ticker in UNIVERSE}
        for future in as_completed(futures):
            result = future.result()
            if result is not None:
                raw.append(result)

    coverage = len(raw) / len(UNIVERSE)
    logger.info(
        "Collected %s of %s tickers (%.1f%% coverage)",
        len(raw),
        len(UNIVERSE),
        coverage * 100,
    )

    if coverage < MIN_COVERAGE:
        raise RuntimeError(
            f"Coverage {coverage:.1%} is below required minimum {MIN_COVERAGE:.1%}. "
            "Existing scores were not replaced."
        )

    scored = score_universe(raw)
    if not scored:
        raise RuntimeError("No stocks were scored")

    as_of = scored[0]["as_of"]
    with session_scope() as session:
        session.execute(delete(StockScore).where(StockScore.as_of == as_of))
        session.add_all([StockScore(**row) for row in scored])

    logger.info("Stored %s scores for %s", len(scored), as_of)

if __name__ == "__main__":
    main()
