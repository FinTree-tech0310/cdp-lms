import type { Ref } from "react";

import type { FraudTriageResultSnapshot } from "../_lib/fraud-triage-types";
import { TRIAGE_ACTION_LABELS } from "../_lib/triage-actions";
import { TransactionSignals } from "./TransactionSignals";
import styles from "../fraud-signal-triage.module.css";

interface FraudTriageResultsProps {
  snapshot: FraudTriageResultSnapshot;
  headingRef: Ref<HTMLHeadingElement>;
  onTryAnother: () => void;
}

export function FraudTriageResults({ snapshot, headingRef, onTryAnother }: FraudTriageResultsProps) {
  return (
    <section className={styles.workspace} aria-labelledby="fraud-triage-results-title">
      <header className={styles.resultsHeader}>
        <p className={styles.eyebrow}>Risk operations · Review complete</p>
        <h1 id="fraud-triage-results-title" ref={headingRef} tabIndex={-1}>Review each decision.</h1>
        <p>Compare your action with the reference review and read the reasoning for every transaction.</p>
      </header>

      <div className={styles.resultsContext}>
        <p className={styles.panelLabel}>Queue context</p>
        <p>{snapshot.setContext}</p>
      </div>

      <div className={styles.transactionList}>
        {snapshot.transactions.map((transaction, index) => {
          const number = String(index + 1).padStart(2, "0");
          return (
            <article className={styles.resultCard} key={transaction.transactionId}>
              <div className={styles.resultCardHeading}>
                <h2>Transaction {number}</h2>
                <span className={styles.resultPill}>
                  {transaction.matched ? "Matched the Review" : "Needs Another Look"}
                </span>
              </div>
              <TransactionSignals signals={transaction.signals} />
              <dl className={styles.reviewComparison}>
                <div><dt>Your decision</dt><dd>{TRIAGE_ACTION_LABELS[transaction.learnerAction]}</dd></div>
                <div><dt>Reference review</dt><dd>{TRIAGE_ACTION_LABELS[transaction.recommendedAction]}</dd></div>
                <div><dt>Result</dt><dd>{transaction.matched ? "Matched the Review" : "Needs Another Look"}</dd></div>
              </dl>
              <div className={styles.reasoning}>
                <h3>Why</h3>
                <p>{transaction.feedback}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.resultActions}>
        <button className={styles.primaryButton} type="button" onClick={onTryAnother}>Try Another</button>
      </div>
    </section>
  );
}
