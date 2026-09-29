import type { NegotiationLever } from "../_lib/counteroffer-types";
import { formatCounterofferValue } from "../_lib/format-counteroffer-value";
import styles from "../counteroffer.module.css";

interface NegotiationLeverControlProps {
  lever: NegotiationLever;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

export function NegotiationLeverControl({
  lever,
  value,
  disabled,
  onChange,
}: NegotiationLeverControlProps) {
  const formattedValue = formatCounterofferValue(lever, value);
  return (
    <section className={styles.leverCard}>
      <div className={styles.leverHeader}>
        <label htmlFor={`counteroffer-${lever.id}`}>{lever.label}</label>
        <strong>{formattedValue}</strong>
      </div>
      <input
        id={`counteroffer-${lever.id}`}
        className={styles.rangeInput}
        type="range"
        min={lever.min}
        max={lever.max}
        step={lever.step}
        value={value}
        disabled={disabled}
        aria-valuetext={formattedValue}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className={styles.rangeLabels} aria-hidden="true">
        <span>{formatCounterofferValue(lever, lever.min)}</span>
        <span>{formatCounterofferValue(lever, lever.max)}</span>
      </div>
    </section>
  );
}
