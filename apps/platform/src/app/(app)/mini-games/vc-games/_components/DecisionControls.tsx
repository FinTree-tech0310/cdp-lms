"use client";

import {
  VC_DECISIONS,
  type DecisionOption,
  type DecisionTone,
  type VcDecision,
} from "../_lib/decision-controls";
import styles from "./decision-controls.module.css";

interface DecisionControlsProps<Choice extends string> {
  selectedChoice: Choice | null;
  onChoose: (choice: Choice) => void;
  ariaLabel?: string;
  decisions?: readonly DecisionOption<Choice>[];
  variant?: "default" | "rapid";
}

function getToneClass(choice: string, tone?: DecisionTone): string {
  if (tone) return styles[tone];
  return styles[choice] ?? styles.ink;
}

export function DecisionControls<Choice extends string = VcDecision>({
  selectedChoice,
  onChoose,
  ariaLabel = "Choose your decision",
  decisions = VC_DECISIONS as unknown as readonly DecisionOption<Choice>[],
  variant = "default",
}: DecisionControlsProps<Choice>) {
  return (
    <div
      className={`${styles.decisionGrid} ${decisions.length === 2 ? styles.binary : ""} ${variant === "rapid" ? styles.rapid : ""}`}
      aria-label={ariaLabel}
    >
      {decisions.map(({ choice, label, shortcuts = [], tone }) => {
        const isSelected = selectedChoice === choice;
        const visibleShortcuts = variant === "rapid" ? shortcuts.slice(1) : shortcuts;

        return (
          <button
            key={choice}
            type="button"
            className={`${styles.decisionButton} ${getToneClass(choice, tone)} ${isSelected ? styles.selected : ""}`}
            onClick={() => onChoose(choice)}
            disabled={selectedChoice !== null}
            aria-pressed={isSelected}
          >
            <span>{label}</span>
            {visibleShortcuts.length > 0 ? (
              <span
                className={styles.shortcutKeys}
                aria-label={shortcuts.join(" or ")}
              >
                {visibleShortcuts.map((shortcut) => (
                  <kbd key={shortcut}>{shortcut}</kbd>
                ))}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

interface DecisionShortcutLegendProps {
  decisions?: readonly DecisionOption[];
}

export function DecisionShortcutLegend({
  decisions = VC_DECISIONS,
}: DecisionShortcutLegendProps) {
  return (
    <div className={styles.shortcutLegend} aria-label="Keyboard shortcuts">
      {decisions.map(({ choice, label, shortcuts = [] }) => (
        <span key={choice}>
          {shortcuts.length > 0 ? (
            <>
              <span className={styles.legendKeys}>
                {shortcuts.map((shortcut) => (
                  <kbd key={shortcut}>{shortcut}</kbd>
                ))}
              </span>{" "}
            </>
          ) : null}
          {label}
        </span>
      ))}
    </div>
  );
}
