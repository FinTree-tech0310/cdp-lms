import type { Ref } from "react";
import { formatTradeReturn, formatTradingValue } from "../_lib/format-trading-values";
import type { TradingResultSnapshot } from "../_lib/trading-types";
import styles from "../build-the-trading-algorithm.module.css";

export function TradingResults({ snapshot, headingRef, onTryAnother }: {
  snapshot: TradingResultSnapshot;
  headingRef: Ref<HTMLHeadingElement>;
  onTryAnother: () => void;
}) {
  return (
    <section className={`${styles.workspace} ${styles.resultsWorkspace}`} aria-labelledby="trading-results-title">
      <header className={styles.resultsHeader}>
        <p className={styles.eyebrow}>Strategy experiment · Backtest report</p>
        <h1 id="trading-results-title" ref={headingRef} tabIndex={-1}>See what the rules did.</h1>
        <p>This report follows the chosen rules through the authored market period. It does not grade the strategy.</p>
      </header>

      <section className={styles.contextPanel} aria-labelledby="trading-result-context-title">
        <h2 id="trading-result-context-title" className={styles.panelLabel}>Market context</h2>
        <p>{snapshot.marketContext}</p>
      </section>

      <section className={styles.reportPanel} aria-labelledby="trading-strategy-title">
        <h2 id="trading-strategy-title">Your strategy</h2>
        <dl className={styles.strategySummary}>
          <div><dt>Entry</dt><dd>{snapshot.selectedEntryRuleLabel}</dd></div>
          <div><dt>Exit</dt><dd>{snapshot.selectedExitRuleLabel}</dd></div>
        </dl>
      </section>

      <section className={styles.reportPanel} aria-labelledby="trading-metrics-title">
        <h2 id="trading-metrics-title">Backtest summary</h2>
        <dl className={styles.metrics}>
          <div><dt>Number of trades</dt><dd>{snapshot.numberOfTrades}</dd></div>
          <div><dt>Total Return — Simple Sum</dt><dd>{formatTradeReturn(snapshot.totalReturnPercent)}</dd></div>
          <div><dt>Worst trade</dt><dd>{snapshot.worstTradeReturnPercent === null ? "No completed trades" : formatTradeReturn(snapshot.worstTradeReturnPercent)}</dd></div>
        </dl>
        <p className={styles.reportNote}>Teaching simplification: completed trade returns are added, not compounded.</p>
      </section>

      <section className={styles.reportPanel} aria-labelledby="trading-log-title">
        <h2 id="trading-log-title">Trade log</h2>
        {snapshot.trades.length === 0 ? (
          <div className={styles.emptyTrades}>
            <h3>No trades triggered</h3>
            <p>The selected entry condition did not occur during this market period.</p>
          </div>
        ) : (
          <ol className={styles.tradeList}>
            {snapshot.trades.map((trade, index) => (
              <li className={styles.tradeCard} key={`${trade.entryDay}-${trade.exitDay}-${index}`}>
                <div className={styles.tradeHeading}>
                  <h3>Trade {String(index + 1).padStart(2, "0")}</h3>
                  {trade.forcedExitAtEndOfPeriod ? <span className={styles.forcedBadge}>Closed at End of Period</span> : null}
                </div>
                <dl className={styles.tradeDetails}>
                  <div><dt>Entry</dt><dd>Day {trade.entryDay} at {formatTradingValue(trade.entryPrice)}</dd></div>
                  <div><dt>Exit</dt><dd>Day {trade.exitDay} at {formatTradingValue(trade.exitPrice)}</dd></div>
                  <div><dt>Exit reason</dt><dd>{trade.exitReason === "endOfPeriod" ? "Closed at End of Period" : snapshot.selectedExitRuleLabel}</dd></div>
                  <div><dt>Return</dt><dd>{formatTradeReturn(trade.tradeReturnPercent)}</dd></div>
                </dl>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className={styles.reportPanel} aria-labelledby="trading-trace-title">
        <h2 id="trading-trace-title">Backtest market trace</h2>
        <p className={styles.reportNote}>The supplied daily prices and indicators are revealed after the strategy run. Events show when the rules acted.</p>
        <div className={styles.tableScroll} role="region" aria-label="Backtest market trace" tabIndex={0}>
          <table className={styles.traceTable}>
            <thead><tr><th scope="col">Day</th><th scope="col">Price</th><th scope="col">MA20</th><th scope="col">RSI14</th><th scope="col">Strategy events</th></tr></thead>
            <tbody>
              {snapshot.trace.map((point) => (
                <tr key={point.day}>
                  <th scope="row">{point.day}</th>
                  <td>{formatTradingValue(point.price)}</td>
                  <td>{formatTradingValue(point.movingAverage20)}</td>
                  <td>{formatTradingValue(point.rsi14)}</td>
                  <td>
                    {point.events.length === 0 ? "—" : (
                      <span className={styles.eventList}>
                        {point.events.map((event, index) => (
                          <span className={styles.eventBadge} key={`${event.type}-${index}`}>
                            {event.type === "entry" ? "ENTER" : event.type === "exit" ? "EXIT" : "CLOSED AT END OF PERIOD"}
                          </span>
                        ))}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ol className={styles.mobileTrace} aria-label="Backtest market trace">
          {snapshot.trace.map((point) => (
            <li key={point.day}>
              <strong>Day {point.day}</strong>
              <dl>
                <div><dt>Price</dt><dd>{formatTradingValue(point.price)}</dd></div>
                <div><dt>MA20</dt><dd>{formatTradingValue(point.movingAverage20)}</dd></div>
                <div><dt>RSI14</dt><dd>{formatTradingValue(point.rsi14)}</dd></div>
              </dl>
              <p>Strategy events: {point.events.length === 0 ? "None" : point.events.map((event) => event.type === "entry" ? "ENTER" : event.type === "exit" ? "EXIT" : "CLOSED AT END OF PERIOD").join(" · ")}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.reflection} aria-labelledby="trading-reflection-title">
        <h2 id="trading-reflection-title">Market reflection</h2>
        <p>{snapshot.scenarioReflection}</p>
      </section>
      <button className={styles.primaryButton} type="button" onClick={onTryAnother}>Try Another</button>
    </section>
  );
}
