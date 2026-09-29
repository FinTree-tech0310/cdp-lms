import { BriefcaseBusiness, FileText } from "lucide-react";

import type { FootballFieldScenario } from "../_lib/football-field-types";
import styles from "../football-field-builder.module.css";

export function ValuationContextPanel({ scenario }: { scenario: FootballFieldScenario }) {
  return (
    <aside className={styles.contextRail} aria-label="Valuation context">
      <section className={styles.contextCard}>
        <div className={styles.panelHeading}><BriefcaseBusiness aria-hidden="true" /><div><p>Target company</p><h2>{scenario.targetCompanyName}</h2></div></div>
      </section>
      <section className={styles.contextCard}>
        <div className={styles.panelHeading}><FileText aria-hidden="true" /><div><p>Deal context</p><h2>Valuation brief</h2></div></div>
        <p>{scenario.dealContextNote}</p>
      </section>
    </aside>
  );
}
