import type { CompsScenario } from "../_data/comps-scenarios";
import styles from "../the-comps-screen.module.css";

interface AnalystReferencePanelProps {
  scenario: CompsScenario;
}

export function AnalystReferencePanel({ scenario }: AnalystReferencePanelProps) {
  const target = scenario.targetCompany;

  return (
    <section className={styles.referencePanel} aria-labelledby="target-company-title">
      <div className={styles.targetDocument}>
        <div className={styles.documentHeading}>
          <div>
            <p className={styles.eyebrow}>Company you are valuing</p>
            <h1 id="target-company-title">{target.name}</h1>
          </div>
          <span className={styles.referenceTag}>Target · not draggable</span>
        </div>
        <dl className={styles.targetFacts}>
          <div>
            <dt>Industry</dt>
            <dd>{target.industry}</dd>
          </div>
          <div>
            <dt>Revenue size</dt>
            <dd>{target.revenueSize}</dd>
          </div>
          <div>
            <dt>Geography</dt>
            <dd>{target.geography}</dd>
          </div>
          <div className={styles.businessModelFact}>
            <dt>Business model</dt>
            <dd>{target.businessModelLine}</dd>
          </div>
        </dl>
      </div>

      <aside className={styles.screeningMandate} aria-labelledby="screening-mandate-title">
        <p className={styles.eyebrow}>Your senior&apos;s screening brief</p>
        <h2 id="screening-mandate-title">Use this priority order</h2>
        <p className={styles.mandateHelp}>
          This tells you which similarities matter most. Use it to judge every candidate.
        </p>
        <p className={styles.mandateText}>{scenario.screeningBrief}</p>
      </aside>
    </section>
  );
}
