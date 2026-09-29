import {
  EARNINGS_OUTCOMES,
  type EarningsOutcome,
} from "../_lib/read-the-chart-types";
import styles from "../read-the-chart.module.css";

interface EarningsOutcomeOptionsProps {
  selectedOutcome: EarningsOutcome | null;
  onSelect: (outcome: EarningsOutcome) => void;
}

export function EarningsOutcomeOptions({
  selectedOutcome,
  onSelect,
}: EarningsOutcomeOptionsProps) {
  return (
    <fieldset className={styles.outcomeFieldset}>
      <legend>What most likely happened?</legend>
      <p className={styles.optionInstruction}>
        Combine the known quarter result with the market&apos;s forward-looking
        reaction.
      </p>
      <div className={styles.outcomeOptions}>
        {EARNINGS_OUTCOMES.map((outcome) => (
          <label key={outcome.id} className={styles.optionCard}>
            <input
              type="radio"
              name="earnings-outcome"
              value={outcome.id}
              checked={selectedOutcome === outcome.id}
              className={styles.optionInput}
              onChange={() => onSelect(outcome.id)}
            />
            <span className={styles.optionSurface}>
              <span className={styles.radioMark} aria-hidden="true" />
              <span>{outcome.label}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
