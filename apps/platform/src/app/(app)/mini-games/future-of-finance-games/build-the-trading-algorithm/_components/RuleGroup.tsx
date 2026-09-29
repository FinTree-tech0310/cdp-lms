import type { RuleDefinition } from "../_lib/trading-rules";
import styles from "../build-the-trading-algorithm.module.css";

export function RuleGroup<Id extends string>({ title, name, rules, selectedId, onSelect }: {
  title: string;
  name: string;
  rules: readonly RuleDefinition<Id>[];
  selectedId: Id | null;
  onSelect: (id: Id) => void;
}) {
  return (
    <fieldset className={styles.ruleGroup}>
      <legend>{title}</legend>
      <div className={styles.ruleList}>
        {rules.map((rule) => (
          <label className={styles.ruleChoice} key={rule.id}>
            <input type="radio" name={name} value={rule.id} checked={selectedId === rule.id} onChange={() => onSelect(rule.id)} />
            <span className={styles.ruleSurface}>
              <span className={styles.radioMark} aria-hidden="true" />
              <span><strong>{rule.label}</strong><small>{rule.condition}</small></span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
