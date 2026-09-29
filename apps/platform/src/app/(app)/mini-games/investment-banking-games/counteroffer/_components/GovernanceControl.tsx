import type { GovernanceOption } from "../_lib/counteroffer-types";
import styles from "../counteroffer.module.css";

interface GovernanceControlProps {
  label: string;
  value: number;
  disabled: boolean;
  options: readonly GovernanceOption[];
  onChange: (value: number) => void;
}

export function GovernanceControl({
  label,
  value,
  disabled,
  options,
  onChange,
}: GovernanceControlProps) {
  return (
    <fieldset className={styles.governanceCard} disabled={disabled}>
      <div className={styles.leverHeader}>
        <legend>{label}</legend>
        <strong>{options.find((option) => option.value === value)?.label}</strong>
      </div>
      <div className={styles.segmentedControl} role="group" aria-label="Governance terms">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={value === option.value ? styles.segmentActive : undefined}
            aria-pressed={value === option.value}
            disabled={disabled}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
