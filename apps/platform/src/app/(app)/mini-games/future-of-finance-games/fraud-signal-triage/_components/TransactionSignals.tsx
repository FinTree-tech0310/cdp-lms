import type { TransactionSignal } from "../_lib/fraud-triage-types";
import styles from "../fraud-signal-triage.module.css";

export function TransactionSignals({ signals }: { signals: readonly TransactionSignal[] }) {
  return (
    <dl className={styles.signalGrid}>
      {signals.map((signal, index) => (
        <div className={styles.signal} key={`${signal.label}-${index}`}>
          <dt>{signal.label}</dt>
          <dd>{signal.value}</dd>
        </div>
      ))}
    </dl>
  );
}
