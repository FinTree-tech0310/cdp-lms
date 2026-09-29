import type { ThesisDefenseScenario } from "../_lib/thesis-defense-types";
import styles from "../thesis-defense.module.css";

interface ThesisReferenceProps {
  scenario: Pick<ThesisDefenseScenario, "stockContext" | "ratingSummary">;
  compact?: boolean;
}

export function ThesisReference({
  scenario,
  compact = false,
}: ThesisReferenceProps) {
  return (
    <aside
      className={styles.thesisReference}
      data-compact={compact}
      aria-labelledby={compact ? "result-published-view" : "published-view"}
    >
      <p className={styles.cardLabel}>Stock context</p>
      <p className={styles.referenceText}>{scenario.stockContext}</p>
      <div className={styles.referenceDivider} />
      <p
        id={compact ? "result-published-view" : "published-view"}
        className={styles.cardLabel}
      >
        Published view
      </p>
      <p className={styles.ratingSummary}>{scenario.ratingSummary}</p>
    </aside>
  );
}
