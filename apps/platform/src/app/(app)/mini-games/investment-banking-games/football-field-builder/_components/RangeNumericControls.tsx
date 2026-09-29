import type { FootballFieldScenario, LearnerRange, MethodologyId, ValuationMethodology } from "../_lib/football-field-types";
import styles from "../football-field-builder.module.css";

interface RangeNumericControlsProps {
  methodology: ValuationMethodology;
  scenario: FootballFieldScenario;
  range: LearnerRange;
  disabled: boolean;
  onChange: (methodologyId: MethodologyId, endpoint: "low" | "high", value: number) => void;
}

export function RangeNumericControls({ methodology, scenario, range, disabled, onChange }: RangeNumericControlsProps) {
  return (
    <article className={styles.methodologyCard}>
      <div className={styles.methodologyCopy}>
        <p className={styles.eyebrow}>{methodology.label}</p>
        <p>{methodology.analystEvidence}</p>
      </div>
      <div className={styles.numericControls}>
        <label>
          <span>Low</span>
          <input
            type="number"
            min={scenario.axisMin}
            max={range.high}
            step={scenario.axisStep}
            value={range.low}
            disabled={disabled}
            aria-label={`${methodology.label} low valuation`}
            onChange={(event) => onChange(methodology.id, "low", Number(event.target.value))}
          />
        </label>
        <span className={styles.rangeDash} aria-hidden="true">—</span>
        <label>
          <span>High</span>
          <input
            type="number"
            min={range.low}
            max={scenario.axisMax}
            step={scenario.axisStep}
            value={range.high}
            disabled={disabled}
            aria-label={`${methodology.label} high valuation`}
            onChange={(event) => onChange(methodology.id, "high", Number(event.target.value))}
          />
        </label>
        <small>{scenario.axisUnit}</small>
      </div>
    </article>
  );
}
