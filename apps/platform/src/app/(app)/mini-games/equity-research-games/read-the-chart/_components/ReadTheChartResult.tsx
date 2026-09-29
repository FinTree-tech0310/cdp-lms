import type { Ref } from "react";

import type { ChartScenario } from "../_lib/read-the-chart-types";
import { getEarningsOutcomeLabel } from "../_lib/read-the-chart-types";
import type { ReadTheChartResultSnapshot } from "../_lib/read-the-chart-state";
import styles from "../read-the-chart.module.css";
import { PriceReactionChart } from "./PriceReactionChart";

interface ReadTheChartResultProps {
  scenario: ChartScenario;
  snapshot: ReadTheChartResultSnapshot;
  headingRef: Ref<HTMLHeadingElement>;
  onTryAnother: () => void;
}

export function ReadTheChartResult({
  scenario,
  snapshot,
  headingRef,
  onTryAnother,
}: ReadTheChartResultProps) {
  return (
    <section
      className={styles.resultWorkspace}
      aria-labelledby="read-the-chart-result-title"
    >
      <header className={styles.resultHeader} data-matched={snapshot.matched}>
        <p className={styles.eyebrow}>Analyst review</p>
        <h1
          ref={headingRef}
          id="read-the-chart-result-title"
          tabIndex={-1}
        >
          {snapshot.matched ? "Matched the Read" : "Needs Another Look"}
        </h1>
        <p>
          Compare your interpretation with the authored reference read, then
          return to the evidence.
        </p>
      </header>

      <div className={styles.readComparison}>
        <article>
          <p>Your read</p>
          <h2>{getEarningsOutcomeLabel(snapshot.selectedOutcome)}</h2>
        </article>
        <article>
          <p>Reference read</p>
          <h2>{getEarningsOutcomeLabel(snapshot.correctOutcome)}</h2>
        </article>
      </div>

      <article className={styles.explanationPanel}>
        <p className={styles.eyebrow}>Authored explanation</p>
        <p>{scenario.explanation}</p>
      </article>

      <PriceReactionChart scenario={scenario} />

      <div className={styles.resultAction}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onTryAnother}
        >
          Try Another
        </button>
      </div>
    </section>
  );
}
