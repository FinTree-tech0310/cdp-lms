import type { Ref } from "react";

import type { FraudTriageScenarioSet, TransactionAssignments, TriageAction } from "../_lib/fraud-triage-types";
import { TransactionCard } from "./TransactionCard";
import styles from "../fraud-signal-triage.module.css";

interface TransactionQueueProps {
  scenario: FraudTriageScenarioSet;
  assignments: TransactionAssignments;
  unassignedCount: number;
  headingRef: Ref<HTMLHeadingElement>;
  onAssign: (transactionId: string, action: TriageAction) => void;
  onSubmit: () => void;
}

export function TransactionQueue({
  scenario,
  assignments,
  unassignedCount,
  headingRef,
  onAssign,
  onSubmit,
}: TransactionQueueProps) {
  const total = scenario.transactions.length;
  return (
    <section className={styles.workspace} aria-labelledby="fraud-triage-queue-title">
      <header className={styles.workspaceHeader}>
        <p className={styles.eyebrow}>Risk operations · Review queue</p>
        <h1 id="fraud-triage-queue-title" ref={headingRef} tabIndex={-1}>Review the queue.</h1>
        <p>Read the signals for each transaction, then assign one operational action.</p>
      </header>

      <div className={styles.queueContext}>
        <div>
          <p className={styles.panelLabel}>Queue context</p>
          <p>{scenario.setContext}</p>
        </div>
        <div className={styles.progressPanel} aria-label="Review progress">
          <span className={styles.panelLabel}>Review progress</span>
          <strong>{total - unassignedCount} of {total} assigned</strong>
        </div>
      </div>

      <div className={styles.transactionList}>
        {scenario.transactions.map((transaction, index) => (
          <TransactionCard
            key={transaction.id}
            transactionId={transaction.id}
            index={index}
            signals={transaction.signals}
            assignment={assignments[transaction.id]}
            onAssign={onAssign}
          />
        ))}
      </div>

      <div className={styles.submitPanel}>
        <p aria-live="polite" aria-atomic="true">
          {unassignedCount > 0
            ? `${unassignedCount} ${unassignedCount === 1 ? "transaction still needs" : "transactions still need"} a decision`
            : "Every transaction has a decision. You can review or submit your assignments."}
        </p>
        <button className={styles.primaryButton} type="button" disabled={unassignedCount > 0} onClick={onSubmit}>
          Submit Review
        </button>
      </div>
    </section>
  );
}
