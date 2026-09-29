import { formatFinancialValue } from "../_lib/format-model-values";
import type { ModelUpdateScenario } from "../_lib/model-update-types";
import styles from "../model-update-reflex.module.css";

export function ModelContext({ scenario }: { scenario: Pick<ModelUpdateScenario, "triggerEvent" | "financialUnit" | "priorPeriodActuals"> }) {
  return (
    <div className={styles.context}>
      <section className={styles.event} aria-labelledby="trigger-heading">
        <h2 id="trigger-heading" className={styles.eyebrow}>New information</h2>
        <p>{scenario.triggerEvent}</p>
      </section>
      <section className={styles.actuals} aria-labelledby="actuals-heading">
        <h2 id="actuals-heading" className={styles.eyebrow}>Prior period actuals</h2>
        <dl>
          <div><dt>Revenue</dt><dd>{formatFinancialValue(scenario.priorPeriodActuals.revenue, scenario.financialUnit)}</dd></div>
          <div><dt>Operating expenses</dt><dd>{formatFinancialValue(scenario.priorPeriodActuals.opex, scenario.financialUnit)}</dd></div>
        </dl>
      </section>
    </div>
  );
}
