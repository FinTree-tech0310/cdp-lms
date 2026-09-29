import type { PushBackDecision } from "../_lib/push-back-state";
import styles from "../would-you-push-back.module.css";

type ActiveDecision = Exclude<PushBackDecision, "skipped">;

const DECISIONS: readonly {
  decision: ActiveDecision;
  label: string;
  visibleShortcut: string;
  ariaKeyShortcuts: string;
}[] = [
  {
    decision: "advise-against",
    label: "Advise Against",
    visibleShortcut: "←",
    ariaKeyShortcuts: "ArrowLeft A",
  },
  {
    decision: "follow",
    label: "Follow Their Lead",
    visibleShortcut: "↑",
    ariaKeyShortcuts: "ArrowUp W",
  },
  {
    decision: "compromise",
    label: "Find a Compromise",
    visibleShortcut: "→",
    ariaKeyShortcuts: "ArrowRight D",
  },
];

interface PushBackDecisionControlsProps {
  selectedDecision: ActiveDecision | null;
  disabled: boolean;
  onChoose: (decision: ActiveDecision) => void;
}

export function PushBackDecisionControls({
  selectedDecision,
  disabled,
  onChoose,
}: PushBackDecisionControlsProps) {
  return (
    <div className={styles.decisionControlStack}>
      <div
        className={styles.decisionGrid}
        role="group"
        aria-label="Choose how to respond to the client request"
      >
        {DECISIONS.map(({
          decision,
          label,
          visibleShortcut,
          ariaKeyShortcuts,
        }) => (
          <button
            key={decision}
            type="button"
            className={[
              styles.decisionButton,
              selectedDecision === decision ? styles.decisionSelected : "",
            ].join(" ")}
            disabled={disabled}
            aria-pressed={selectedDecision === decision}
            aria-keyshortcuts={ariaKeyShortcuts}
            onClick={() => onChoose(decision)}
          >
            <span>{label}</span>
            <span className={styles.decisionShortcutKeys} aria-hidden="true">
              <kbd>{visibleShortcut}</kbd>
            </span>
          </button>
        ))}
      </div>
      <p className={styles.keyHelper}>
        Keys: ← / ↑ / → <span>or</span> A / W / D
      </p>
    </div>
  );
}
