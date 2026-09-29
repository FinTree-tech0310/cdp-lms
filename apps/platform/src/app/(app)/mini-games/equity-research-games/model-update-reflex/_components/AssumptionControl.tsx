import { formatAssumptionValue } from "../_lib/format-model-values";
import type { AssumptionDriver, AssumptionId } from "../_lib/model-update-types";
import styles from "../model-update-reflex.module.css";

// Only visible evidence and slider metadata enter the active control.
export type VisibleAssumption = Pick<AssumptionDriver,
  "id" | "label" | "unit" | "min" | "max" | "step" | "startingValue" | "revisionEvidence">;

export function AssumptionControl({ driver, value, onChange }: {
  driver: VisibleAssumption;
  value: number;
  onChange: (id: AssumptionId, value: number) => void;
}) {
  const inputId = `assumption-${driver.id}`;
  return (
    <section className={styles.assumption} aria-labelledby={`${inputId}-label`}>
      <div className={styles.assumptionTop}>
        <label id={`${inputId}-label`} htmlFor={inputId}>{driver.label}</label>
        <p>Original forecast <strong>{formatAssumptionValue(driver.startingValue, driver)}</strong></p>
      </div>
      <p id={`${inputId}-evidence`} className={styles.evidence}>{driver.revisionEvidence}</p>
      <div className={styles.revisionValue}>
        <span>Current revision</span><strong>{formatAssumptionValue(value, driver)}</strong>
      </div>
      <input
        id={inputId} className={styles.range} type="range"
        min={driver.min} max={driver.max} step={driver.step} value={value}
        aria-describedby={`${inputId}-evidence`}
        aria-valuetext={formatAssumptionValue(value, driver)}
        onChange={(event) => onChange(driver.id, Number(event.currentTarget.value))}
      />
      <div className={styles.rangeLabels} aria-hidden="true">
        <span>{formatAssumptionValue(driver.min, driver)}</span><span>{formatAssumptionValue(driver.max, driver)}</span>
      </div>
    </section>
  );
}
