import { ArrowRight, CheckCircle2, Scale } from "lucide-react";

import type { FootballFieldScenario, SubmittedFootballFieldSnapshot } from "../_lib/football-field-types";
import { FootballFieldChart } from "./FootballFieldChart";
import styles from "../football-field-builder.module.css";

function formatValue(value: number, unit: string) {
  return `${value} ${unit}`;
}

export function FootballFieldResults({ scenario, snapshot, onTryAnother }: { scenario: FootballFieldScenario; snapshot: SubmittedFootballFieldSnapshot; onTryAnother: () => void }) {
  return (
    <section className={styles.results} tabIndex={-1} aria-labelledby="football-field-results-title">
      <header className={styles.resultsHero}>
        <Scale aria-hidden="true" />
        <div><p className={styles.eyebrow}>Analyst review</p><h1 id="football-field-results-title">Your valuation field</h1><p>Compare your submitted ranges with the authored reference output on the same scale.</p></div>
      </header>
      <FootballFieldChart scenario={scenario} ranges={snapshot.ranges} snapshot={snapshot} />
      <div className={styles.reviewRows}>
        {scenario.methodologies.map((methodology) => {
          const range = snapshot.ranges[methodology.id];
          const onTarget = snapshot.statuses[methodology.id] === "on-target";
          return <article key={methodology.id} className={styles.reviewRow}>
            <div><p className={styles.eyebrow}>{methodology.label}</p><strong>Your range: {formatValue(range.low, scenario.axisUnit)} – {formatValue(range.high, scenario.axisUnit)}</strong></div>
            <p className={onTarget ? styles.onTarget : styles.needsAdjustment}>{onTarget ? "On Target" : "Needs Adjustment"}</p>
          </article>;
        })}
      </div>
      <div className={styles.resultGrid}>
        <section className={styles.combinedCard}><p className={styles.eyebrow}>Combined valuation field</p><strong>{formatValue(snapshot.combinedLow, scenario.axisUnit)} – {formatValue(snapshot.combinedHigh, scenario.axisUnit)}</strong></section>
        <section className={styles.dealCard}><p className={styles.eyebrow}>Actual deal price</p><strong>{formatValue(scenario.actualDealPrice, scenario.axisUnit)}</strong><p>{snapshot.dealPriceCaptured ? "Inside combined range" : "Outside combined range"}</p></section>
      </div>
      <section className={styles.summaryCard}><CheckCircle2 aria-hidden="true" /><div><p className={styles.eyebrow}>Takeaway</p><p>{scenario.resultSummary}</p></div></section>
      <div className={styles.resultsActions}><button type="button" className={styles.primaryButton} onClick={onTryAnother}><span>Try Another</span><ArrowRight aria-hidden="true" /></button></div>
    </section>
  );
}
