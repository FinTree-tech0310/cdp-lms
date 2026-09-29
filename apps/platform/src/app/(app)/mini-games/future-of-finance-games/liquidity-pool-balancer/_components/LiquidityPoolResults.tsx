import type { Ref } from "react";
import { formatOutputAmount, formatPriceImpact, formatSwapAmount } from "../_lib/format-swap-values";
import type { LiquidityPoolResultSnapshot } from "../_lib/liquidity-pool-types";
import styles from "../liquidity-pool-balancer.module.css";

export function LiquidityPoolResults({ snapshot, headingRef, onTryAnother }: {
  snapshot: LiquidityPoolResultSnapshot;
  headingRef: Ref<HTMLHeadingElement>;
  onTryAnother: () => void;
}) {
  const adjustmentLabel = snapshot.adjustmentDirection === "increase"
    ? "INCREASE THE SWAP"
    : snapshot.adjustmentDirection === "decrease"
      ? "REDUCE THE SWAP"
      : "WITHIN THE REFERENCE RANGE";
  return (
    <section className={`${styles.workspace} ${styles.resultsWorkspace}`} aria-labelledby="liquidity-pool-results-title">
      <header className={styles.resultsHeader}>
        <p className={styles.eyebrow}>Pool execution · Review complete</p>
        <h1 id="liquidity-pool-results-title" ref={headingRef} tabIndex={-1}>Review the swap.</h1>
        <p>Compare the execution outcome with the treasury’s need and its price-impact trade-off.</p>
      </header>
      <div className={styles.contextGrid}>
        <section className={styles.contextPanel} aria-labelledby="result-treasury-title">
          <h2 id="result-treasury-title" className={styles.panelLabel}>Treasury context</h2>
          <p>{snapshot.treasuryContextNote}</p>
        </section>
        <section className={styles.contextPanel} aria-labelledby="result-requirement-title">
          <h2 id="result-requirement-title" className={styles.panelLabel}>Execution requirement</h2>
          <p>{snapshot.executionRequirement}</p>
        </section>
      </div>
      <section className={styles.resultPanel} aria-labelledby="swap-review-title">
        <h2 id="swap-review-title">Your execution</h2>
        <dl className={styles.resultMetrics}>
          <div><dt>Your swap</dt><dd>{formatSwapAmount(snapshot.submittedSwapAmount)} <span>{snapshot.tokenInLabel}</span></dd></div>
          <div><dt>Reference range</dt><dd>{formatSwapAmount(snapshot.idealSwapAmountMin)}–{formatSwapAmount(snapshot.idealSwapAmountMax)} <span>{snapshot.tokenInLabel}</span></dd></div>
          <div><dt>Expected adjustment</dt><dd>{adjustmentLabel}</dd></div>
          <div><dt>You receive</dt><dd>{formatOutputAmount(snapshot.outputs.amountOut)} <span>{snapshot.tokenOutLabel}</span></dd></div>
          <div><dt>Price impact</dt><dd>{formatPriceImpact(snapshot.outputs.priceImpactPercent)}%</dd></div>
        </dl>
        <div className={styles.resultStatus}>
          <span>Result</span>
          <strong>{snapshot.swapStatus === "onTarget" ? "On Target" : "Needs Adjustment"}</strong>
        </div>
        <div className={styles.feedbackPanel}>
          <h3>Why</h3>
          <p>{snapshot.selectedFeedback}</p>
        </div>
      </section>
      <button className={styles.primaryButton} type="button" onClick={onTryAnother}>Try Another</button>
    </section>
  );
}
