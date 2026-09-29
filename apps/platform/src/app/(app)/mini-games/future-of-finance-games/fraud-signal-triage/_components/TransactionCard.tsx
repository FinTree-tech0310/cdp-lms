import type { TriageAction, TransactionSignal } from "../_lib/fraud-triage-types";
import { TRIAGE_ACTION_LABELS } from "../_lib/triage-actions";
import { TransactionDecisionGroup } from "./TransactionDecisionGroup";
import { TransactionSignals } from "./TransactionSignals";
import styles from "../fraud-signal-triage.module.css";

interface TransactionCardProps {
  transactionId: string;
  index: number;
  signals: readonly TransactionSignal[];
  assignment: TriageAction | undefined;
  onAssign: (transactionId: string, action: TriageAction) => void;
}

export function TransactionCard({ transactionId, index, signals, assignment, onAssign }: TransactionCardProps) {
  const number = String(index + 1).padStart(2, "0");
  return (
    <article className={styles.transactionCard} aria-labelledby={`transaction-${number}-title`}>
      <div className={styles.transactionHeading}>
        <h2 id={`transaction-${number}-title`}>Transaction {number}</h2>
        <span className={styles.assignmentStatus}>
          {assignment ? `Assigned: ${TRIAGE_ACTION_LABELS[assignment]}` : "Unassigned"}
        </span>
      </div>
      <TransactionSignals signals={signals} />
      <TransactionDecisionGroup
        transactionId={transactionId}
        transactionNumber={number}
        assignment={assignment}
        onAssign={onAssign}
      />
    </article>
  );
}
