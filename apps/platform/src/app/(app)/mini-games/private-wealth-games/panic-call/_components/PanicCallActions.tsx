import type { PanicCallPath } from "../_lib/panic-call-state";
import styles from "../panic-call.module.css";

const RESPONSE_OPTIONS: readonly {
  path: Exclude<PanicCallPath, "decline">;
  label: string;
  shortcut: string;
}[] = [
  { path: "hold-and-reassure", label: "Hold and Reassure", shortcut: "A" },
  { path: "partial-rebalance", label: "Partial Defensive Rebalance", shortcut: "W" },
  { path: "execute-sell", label: "Execute the Sell as Asked", shortcut: "D" },
];

interface PanicCallActionsProps {
  disabled?: boolean;
  onChoose: (path: Exclude<PanicCallPath, "decline">) => void;
}

export function PanicCallActions({
  disabled = false,
  onChoose,
}: PanicCallActionsProps) {
  return (
    <section className={styles.strategyArea} aria-labelledby="strategy-title">
      <p className={styles.sectionEyebrow}>Your response</p>
      <h2 id="strategy-title">How do you guide the call?</h2>
      <div className={styles.strategyGrid}>
        {RESPONSE_OPTIONS.map((option) => (
          <button
            key={option.path}
            type="button"
            className={styles.strategyButton}
            disabled={disabled}
            onClick={() => onChoose(option.path)}
          >
            <span>{option.label}</span>
            <kbd aria-label={`Shortcut ${option.shortcut}`}>{option.shortcut}</kbd>
          </button>
        ))}
      </div>
    </section>
  );
}
