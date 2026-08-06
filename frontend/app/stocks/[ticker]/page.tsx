import "../../mobile-workbook-fixes.css";
import Link from "next/link";
import { FinancialChart } from "@/components/FinancialChart";
import { RelativePerformanceChart } from "@/components/RelativePerformanceChart";
import {
  BalanceSheetChart,
  CashFlowChart,
  MarginChart,
} from "@/components/WorkbookDepthCharts";
import { PremiumPriceChart } from "@/components/PremiumPriceChart";
import { ScoreBars } from "@/components/ScoreBars";
import { ScoreRing } from "@/components/ScoreRing";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getComparison,
  getPremiumWorkbook,
  getScore,
  getStock,
} from "@/lib/api";
import { researchPosts, universe } from "@/lib/researchData";

type Props = { params: Promise<{ ticker: string }> };

const money = (value: number | null, currency = "USD") =>
  value == null
    ? "N/A"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(value);

const compact = (value: number | null) =>
  value == null
    ? "N/A"
    : new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
      }).format(value);

const ratio = (value: number | null | undefined) =>
  value == null ? "N/A" : value.toFixed(2);

const percent = (value: number | null | undefined) =>
  value == null ? "N/A" : `${(value * 100).toFixed(1)}%`;

const parseNum = (value?: string) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const hasNumber = (value: number | null | undefined) =>
  value != null && Number.isFinite(value);

export const dynamic = "force-dynamic";

export default async function StockPage({ params }: Props) {
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();

  const [stock, score, premium, comparison] = await Promise.all([
    getStock(symbol),
    getScore(symbol),
    getPremiumWorkbook(symbol),
    getComparison(symbol).catch(() => null),
  ]);

  const metadata = universe.find((item) => item.ticker === symbol);
  const positive = (stock.quote.change_percent ?? 0) >= 0;
  const relatedResearch = researchPosts.filter((post) =>
    post.tickers.includes(symbol)
  );

  const incomeRows =
    premium?.datasets.income.quarterlyReports?.slice(0, 8).reverse() ?? [];
  const balanceRows =
    premium?.datasets.balance.quarterlyReports?.slice(0, 8).reverse() ?? [];
  const cashRows =
    premium?.datasets.cashflow.quarterlyReports?.slice(0, 8).reverse() ?? [];

  const balanceByDate = new Map(
    balanceRows.map((row) => [row.fiscalDateEnding, row])
  );
  const cashByDate = new Map(
    cashRows.map((row) => [row.fiscalDateEnding, row])
  );

  const financialRows = incomeRows.map((row) => {
    const balance = balanceByDate.get(row.fiscalDateEnding) ?? {};
    const cashflow = cashByDate.get(row.fiscalDateEnding) ?? {};
    const operatingCashFlow = parseNum(cashflow.operatingCashflow);
    const capex = parseNum(cashflow.capitalExpenditures);

    return {
      period: row.fiscalDateEnding?.slice(0, 7) ?? "",
      revenue: parseNum(row.totalRevenue),
      grossProfit: parseNum(row.grossProfit),
      netIncome: parseNum(row.netIncome),
      operatingIncome: parseNum(row.operatingIncome),
      operatingCashFlow,
      capex,
      freeCashFlow:
        operatingCashFlow != null && capex != null
          ? operatingCashFlow - Math.abs(capex)
          : null,
      cash: parseNum(balance.cashAndCashEquivalentsAtCarryingValue),
      debt:
        parseNum(balance.shortLongTermDebtTotal) ??
        parseNum(balance.longTermDebt),
    };
  });

  const earnings =
    premium?.datasets.earnings.quarterlyEarnings?.slice(0, 8) ?? [];
  const overview = premium?.datasets.overview ?? {};

  const hasComparison =
    comparison != null &&
    Object.values(comparison.series).some((series) => series.length > 5);

  const hasFinancialChart = financialRows.some(
    (row) =>
      hasNumber(row.revenue) ||
      hasNumber(row.netIncome) ||
      hasNumber(row.operatingIncome)
  );

  const hasMarginChart = financialRows.some(
    (row) =>
      hasNumber(row.revenue) &&
      (hasNumber(row.grossProfit) ||
        hasNumber(row.operatingIncome) ||
        hasNumber(row.netIncome))
  );

  const hasCashFlowChart = financialRows.some(
    (row) =>
      hasNumber(row.freeCashFlow) || hasNumber(row.operatingCashFlow)
  );

  const hasBalanceChart = financialRows.some(
    (row) => hasNumber(row.cash) || hasNumber(row.debt)
  );

  const hasFundamentalMetrics = [
    overview.TrailingPE,
    overview.PriceToSalesRatioTTM,
    overview.EVToEBITDA,
    overview.BookValue,
    stock.fundamentals.trailing_pe,
    stock.fundamentals.price_to_sales,
    stock.fundamentals.enterprise_to_ebitda,
    stock.fundamentals.gross_margin,
    stock.fundamentals.profit_margin,
    stock.fundamentals.return_on_equity,
    stock.fundamentals.free_cash_flow,
  ].some((value) => value != null && value !== "" && value !== "None");

  const displayTheme =
    score?.theme || metadata?.theme || stock.company.sector || "Company";
  const displayThesis =
    metadata?.note ||
    "This company is available as a market-data workbook. Young Bull has not added a manual investment thesis for it yet.";

  return (
    <main>
      <SiteHeader />

      <section className="stock-hero container">
        <div>
          <div className="eyebrow">COMPANY WORKBOOK · {symbol}</div>
          <h1>{stock.company.name}</h1>
          <p>
            {displayTheme} · {stock.company.industry}
          </p>
        </div>

        <div className="quote-score">
          <div className="quote-block">
            <strong>{money(stock.quote.price, stock.quote.currency)}</strong>
            <span className={positive ? "positive" : "negative"}>
              {positive ? "+" : ""}
              {stock.quote.change_percent?.toFixed(2) ?? "0.00"}%
            </span>
          </div>

          {score ? (
            <ScoreRing score={Math.round(score.overall)} />
          ) : (
            <div className="unscored-badge">
              <strong>NOT SCORED</strong>
              <span>Outside current ranked universe</span>
            </div>
          )}
        </div>
      </section>

      <section className="container metric-grid six">
        <article className="metric-card">
          <span>MARKET CAP</span>
          <strong>{compact(stock.company.market_cap)}</strong>
        </article>
        <article className="metric-card">
          <span>FORWARD P/E</span>
          <strong>
            {overview.ForwardPE || ratio(stock.fundamentals.forward_pe)}
          </strong>
        </article>
        <article className="metric-card">
          <span>PEG RATIO</span>
          <strong>{overview.PEGRatio || "N/A"}</strong>
        </article>
        <article className="metric-card">
          <span>REVENUE GROWTH</span>
          <strong>{percent(stock.fundamentals.revenue_growth)}</strong>
        </article>
        <article className="metric-card">
          <span>OPERATING MARGIN</span>
          <strong>{percent(stock.fundamentals.operating_margin)}</strong>
        </article>
        <article className="metric-card">
          <span>52W RANGE</span>
          <strong>
            {money(stock.quote.year_low)} – {money(stock.quote.year_high)}
          </strong>
        </article>
      </section>

      <section className="container workbook-tabs">
        <a href="#chart">Chart</a>
        {score && <a href="#score">Score</a>}
        {hasComparison && <a href="#relative">Relative Strength</a>}
        {(hasFinancialChart || hasFundamentalMetrics) && (
          <a href="#financials">Financials</a>
        )}
        {hasMarginChart && <a href="#margins">Margins</a>}
        {hasCashFlowChart && <a href="#cashflow">Cash Flow</a>}
        {hasBalanceChart && <a href="#balance-sheet">Balance Sheet</a>}
        {earnings.length > 0 && <a href="#earnings">Earnings</a>}
        <a href="#thesis">Thesis</a>
        <a href="#files">Files</a>
      </section>

      <section id="chart" className="container page-section">
        <article className="panel premium-main-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">INTERACTIVE PRICE CHART</span>
              <h2>Trend and moving averages</h2>
            </div>
          </div>
          <PremiumPriceChart data={stock.history} />
        </article>
      </section>

      {hasComparison && comparison && (
        <section id="relative" className="container page-section">
          <article className="panel premium-main-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">RELATIVE PERFORMANCE</span>
                <h2>{symbol} versus SPY and SMH</h2>
              </div>
            </div>
            <RelativePerformanceChart data={comparison} ticker={symbol} />
          </article>
        </section>
      )}

      <section className="container two-column-section">
        {score && (
          <article id="score" className="panel">
            <span className="eyebrow">LIVE MODEL SCORE</span>
            <h2 className="panel-title">Cross-sectional ranking</h2>
            <ScoreBars
              scores={{
                Momentum: Math.round(score.momentum),
                Technicals: Math.round(score.technicals),
                Fundamentals: Math.round(score.fundamentals),
                "Thematic Fit": Math.round(score.thematic_fit),
              }}
            />
            <p className="small-note">
              Scores are percentile-ranked against the current Young Bull
              universe and stored by date in PostgreSQL.
            </p>
          </article>
        )}

        <article id="thesis" className="panel thesis-panel">
          <span className="eyebrow">YOUNG BULL THESIS</span>
          <h2 className="panel-title">{displayTheme}</h2>
          <p className="description">{displayThesis}</p>

          {score ? (
            <div className="thesis-box">
              <strong>MODEL READ</strong>
              <p>
                Overall score: {score.overall.toFixed(1)}. Last ranked{" "}
                {score.as_of}.
              </p>
            </div>
          ) : (
            <div className="thesis-box">
              <strong>SCORING STATUS</strong>
              <p>
                This ticker is searchable, but it is not included in the
                ranked universe. No placeholder score is shown.
              </p>
            </div>
          )}
        </article>
      </section>

      {(hasFinancialChart || hasFundamentalMetrics) && (
        <section id="financials" className="container page-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">QUARTERLY FUNDAMENTALS</div>
              <h2>Revenue and earnings power</h2>
            </div>
          </div>

          {hasFinancialChart && <FinancialChart data={financialRows} />}

          {hasFundamentalMetrics && (
            <div className="fundamental-grid">
              <div>
                <span>TRAILING P/E</span>
                <strong>
                  {overview.TrailingPE ||
                    ratio(stock.fundamentals.trailing_pe)}
                </strong>
              </div>
              <div>
                <span>PRICE / SALES</span>
                <strong>
                  {overview.PriceToSalesRatioTTM ||
                    ratio(stock.fundamentals.price_to_sales)}
                </strong>
              </div>
              <div>
                <span>EV / EBITDA</span>
                <strong>
                  {overview.EVToEBITDA ||
                    ratio(stock.fundamentals.enterprise_to_ebitda)}
                </strong>
              </div>
              <div>
                <span>BOOK VALUE</span>
                <strong>{overview.BookValue || "N/A"}</strong>
              </div>
              <div>
                <span>GROSS MARGIN</span>
                <strong>{percent(stock.fundamentals.gross_margin)}</strong>
              </div>
              <div>
                <span>PROFIT MARGIN</span>
                <strong>
                  {overview.ProfitMargin
                    ? `${(Number(overview.ProfitMargin) * 100).toFixed(1)}%`
                    : percent(stock.fundamentals.profit_margin)}
                </strong>
              </div>
              <div>
                <span>RETURN ON EQUITY</span>
                <strong>
                  {overview.ReturnOnEquityTTM
                    ? `${(Number(overview.ReturnOnEquityTTM) * 100).toFixed(1)}%`
                    : percent(stock.fundamentals.return_on_equity)}
                </strong>
              </div>
              <div>
                <span>FREE CASH FLOW</span>
                <strong>{compact(stock.fundamentals.free_cash_flow)}</strong>
              </div>
            </div>
          )}
        </section>
      )}

      {(hasMarginChart || hasCashFlowChart) && (
        <section className="container workbook-depth-grid">
          {hasMarginChart && (
            <article id="margins" className="panel">
              <span className="eyebrow">MARGIN STRUCTURE</span>
              <h2 className="panel-title">Profitability trend</h2>
              <MarginChart data={financialRows} />
            </article>
          )}

          {hasCashFlowChart && (
            <article id="cashflow" className="panel">
              <span className="eyebrow">CASH GENERATION</span>
              <h2 className="panel-title">Cash flow trend</h2>
              <CashFlowChart data={financialRows} />
            </article>
          )}
        </section>
      )}

      {hasBalanceChart && (
        <section id="balance-sheet" className="container page-section">
          <article className="panel premium-main-panel">
            <span className="eyebrow">BALANCE SHEET</span>
            <h2 className="panel-title">Cash versus debt</h2>
            <BalanceSheetChart data={financialRows} />
          </article>
        </section>
      )}

      {earnings.length > 0 && (
        <section id="earnings" className="container page-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">EARNINGS HISTORY</div>
              <h2>Beat, miss and estimate trend</h2>
            </div>
          </div>
          <div className="earnings-grid">
            {earnings.map((row, index) => (
              <article key={`${row.fiscalDateEnding}-${index}`}>
                <span>{row.fiscalDateEnding}</span>
                <strong>EPS {row.reportedEPS ?? "N/A"}</strong>
                <small>Estimate {row.estimatedEPS ?? "N/A"}</small>
                <b
                  className={
                    Number(row.surprisePercentage) >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {row.surprisePercentage
                    ? `${row.surprisePercentage}% surprise`
                    : "No surprise data"}
                </b>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="container two-column-section">
        <article className="panel">
          <span className="eyebrow">COMPANY SNAPSHOT</span>
          <h2 className="panel-title">What it does</h2>
          <p className="description">
            {stock.company.description ||
              overview.Description ||
              "Description unavailable."}
          </p>
        </article>

        {relatedResearch.length > 0 && (
          <article className="panel">
            <span className="eyebrow">RELATED RESEARCH</span>
            <h2 className="panel-title">Young Bull coverage</h2>
            {relatedResearch.map((post) => (
              <a
                className="related-post"
                href={post.url}
                target="_blank"
                rel="noreferrer"
                key={post.title}
              >
                <small>
                  {post.date} · {post.theme}
                </small>
                <h3>{post.title}</h3>
              </a>
            ))}
          </article>
        )}
      </section>

      <section id="files" className="container page-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">PRIMARY SOURCES</div>
            <h2>Files and filings</h2>
          </div>
        </div>
        <div className="file-grid">
          <a href={stock.files.sec_company} target="_blank" rel="noreferrer">
            <strong>SEC FILINGS</strong>
            <span>10-K, 10-Q, 8-K, proxy and ownership filings</span>
          </a>
          <a href={stock.files.yahoo_profile} target="_blank" rel="noreferrer">
            <strong>MARKET PROFILE</strong>
            <span>Yahoo Finance profile and market data</span>
          </a>
          {stock.company.website && (
            <a href={stock.company.website} target="_blank" rel="noreferrer">
              <strong>INVESTOR WEBSITE</strong>
              <span>Company investor materials and presentations</span>
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
