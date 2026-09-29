import type { Ref } from "react";

import type { OrderBookResultSnapshot } from "../_lib/order-book-types";
import { OrderBookChart } from "./OrderBookChart";
import styles from "../read-the-order-book.module.css";

interface OrderBookResultsProps {
  snapshot: OrderBookResultSnapshot;
  headingRef: Ref<HTMLHeadingElement>;
  onTryAnother: () => void;
}

export function OrderBookResults({ snapshot, headingRef, onTryAnother }: OrderBookResultsProps) {
  return (
    <section className={`${styles.workspace} ${styles.resultsWorkspace}`} aria-labelledby="order-book-results-title">
      <header className={styles.resultsHeader}>
        <p className={styles.eyebrow}>Market structure · Review complete</p>
        <h1 id="order-book-results-title" ref={headingRef} tabIndex={-1}>Review your read.</h1>
        <p>Compare your interpretation with the reference read and return to the displayed depth.</p>
      </header>
      <div className={styles.resultContext}>
        <p className={styles.panelLabel}>Market context</p>
        <p>{snapshot.marketContext}</p>
      </div>
      <div className={styles.resultComparison}>
        <article>
          <p className={styles.panelLabel}>Your read</p>
          <p>{snapshot.selectedAnswer}</p>
        </article>
        <article>
          <p className={styles.panelLabel}>Reference read</p>
          <p>{snapshot.correctInterpretation}</p>
        </article>
        <article>
          <p className={styles.panelLabel}>Result</p>
          <p>{snapshot.matched ? "Matched the Read" : "Needs Another Look"}</p>
        </article>
      </div>
      <div className={styles.explanationPanel}>
        <h2>Why</h2>
        <p>{snapshot.explanation}</p>
      </div>
      <OrderBookChart
        idPrefix="order-book-result"
        currentPrice={snapshot.currentPrice}
        sellOrders={snapshot.sellOrders}
        buyOrders={snapshot.buyOrders}
        depthDescriptionForScreenReaders={snapshot.depthDescriptionForScreenReaders}
      />
      <div className={styles.resultActions}>
        <button className={styles.primaryButton} type="button" onClick={onTryAnother}>
          Try Another
        </button>
      </div>
    </section>
  );
}
