import { formatFinancialValue } from "../_lib/format-model-values";
import type { ModelOutputs } from "../_lib/model-update-types";
import styles from "../model-update-reflex.module.css";

const OUTPUT_ROWS = [
  ["projectedRevenue", "Projected Revenue"],
  ["projectedGrossProfit", "Projected Gross Profit"],
  ["projectedOpex", "Projected Operating Expenses"],
  ["projectedEBITDA", "Projected EBITDA"],
] as const;

export function ModelOutputComparison({ first, second, firstLabel, secondLabel, unit }: {
  first: ModelOutputs; second: ModelOutputs; firstLabel: string; secondLabel: string; unit: string;
}) {
  return (
    <table className={styles.outputTable}>
      <caption>Forecast outputs</caption>
      <thead><tr><th scope="col">Model output</th><th scope="col">{firstLabel}</th><th scope="col">{secondLabel}</th></tr></thead>
      <tbody>{OUTPUT_ROWS.map(([key, label]) => (
        <tr key={key}><th scope="row">{label}</th><td>{formatFinancialValue(first[key], unit)}</td><td>{formatFinancialValue(second[key], unit)}</td></tr>
      ))}</tbody>
    </table>
  );
}

export function OriginalForecast({ outputs, unit }: { outputs: ModelOutputs; unit: string }) {
  return (
    <section className={styles.baseline} aria-label="Original forecast">
      <h2 className={styles.eyebrow}>Original forecast</h2>
      <dl>{OUTPUT_ROWS.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{formatFinancialValue(outputs[key], unit)}</dd></div>)}</dl>
    </section>
  );
}
