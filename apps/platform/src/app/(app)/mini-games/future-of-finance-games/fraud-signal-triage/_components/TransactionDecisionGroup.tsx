import { TRIAGE_ACTIONS, TRIAGE_ACTION_LABELS } from "../_lib/triage-actions";
import type { TriageAction } from "../_lib/fraud-triage-types";
import styles from "../fraud-signal-triage.module.css";

interface TransactionDecisionGroupProps {
  transactionId: string;
  transactionNumber: string;
  assignment: TriageAction | undefined;
  onAssign: (transactionId: string, action: TriageAction) => void;
}

export function TransactionDecisionGroup({
  transactionId,
  transactionNumber,
  assignment,
  onAssign,
}: TransactionDecisionGroupProps) {
  return (
    <fieldset className={styles.decisionGroup}>
      <legend>Decision for transaction {transactionNumber}</legend>
      <div className={styles.choiceGrid}>
        {TRIAGE_ACTIONS.map((action) => (
          <label className={styles.choice} key={action}>
            <input
              type="radio"
              name={`decision-${transactionId}`}
              value={action}
              checked={assignment === action}
              onChange={() => onAssign(transactionId, action)}
            />
            <span className={styles.choiceSurface}>
              <span className={styles.radioMark} aria-hidden="true" />
              <span>{TRIAGE_ACTION_LABELS[action]}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
