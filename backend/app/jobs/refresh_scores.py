from __future__ import annotations

import logging

from sqlalchemy import delete

from app.db import init_db, session_scope
from app.services.scoring import collect_raw, score_universe
from app.tables import StockScore
from app.universe import UNIVERSE

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("youngbull.refresh")

def main() -> None:
    init_db()
    raw = []
    for ticker in UNIVERSE:
        try:
            logger.info("Collecting %s", ticker)
            raw.append(collect_raw(ticker))
        except Exception:
            logger.exception("Failed %s", ticker)

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
