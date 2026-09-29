import type { Ref } from "react";

import type { SmartContractResultSnapshot } from "../_lib/smart-contract-types";
import styles from "../smart-contract-audit.module.css";

interface SmartContractResultsProps {
  snapshot: SmartContractResultSnapshot;
  headingRef: Ref<HTMLHeadingElement>;
  onTryAnother: () => void;
}

export function SmartContractResults({ snapshot, headingRef, onTryAnother }: SmartContractResultsProps) {
  const learnerLine = snapshot.lines.find(({ id }) => id === snapshot.selectedLineId);
  const referenceLine = snapshot.lines.find(({ id }) => id === snapshot.vulnerableLineId);
  return (
    <section className={`${styles.workspace} ${styles.resultsWorkspace}`} aria-labelledby="smart-contract-results-title">
      <header className={styles.resultsHeader}>
        <p className={styles.eyebrow}>Technical review · Audit complete</p>
        <h1 id="smart-contract-results-title" ref={headingRef} tabIndex={-1}>Review the audit.</h1>
        <p>Compare the line you identified and the vulnerability type you chose as two separate judgments.</p>
      </header>
      <div className={styles.contextPanel}>
        <p className={styles.panelLabel}>Function context</p>
        <p>{snapshot.functionContext}</p>
      </div>

      <section className={styles.resultSection} aria-labelledby="line-identification-title">
        <h2 id="line-identification-title">Line identification</h2>
        <dl className={styles.resultComparison}>
          <div><dt>Your line</dt><dd>Line {learnerLine?.lineNumber}</dd></div>
          <div><dt>Reference line</dt><dd>Line {referenceLine?.lineNumber}</dd></div>
          <div><dt>Result</dt><dd>{snapshot.lineMatched ? "Matched the Review" : "Needs Another Look"}</dd></div>
        </dl>
        <ol className={styles.lineReviewList} aria-label="Review of every code line">
          {snapshot.lines.map((line) => (
            <li className={styles.lineReview} key={line.id}>
              <div className={styles.lineReviewHeader}>
                <span>Line {line.lineNumber}</span>
                <span className={styles.reviewMarkers}>
                  {line.wasLearnerSelected ? <span>Your selection</span> : null}
                  {line.isVulnerableLine ? <span>Reference vulnerability</span> : null}
                </span>
              </div>
              <pre className={styles.resultCode}><code>{line.code}</code></pre>
              <p className={styles.lineExplanation}>{line.lineExplanation}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.resultSection} aria-labelledby="vulnerability-type-title">
        <h2 id="vulnerability-type-title">Vulnerability type</h2>
        <dl className={styles.resultComparison}>
          <div><dt>Your classification</dt><dd>{snapshot.selectedTypeLabel}</dd></div>
          <div><dt>Reference classification</dt><dd>{snapshot.correctTypeLabel}</dd></div>
          <div><dt>Result</dt><dd>{snapshot.typeMatched ? "Matched the Review" : "Needs Another Look"}</dd></div>
        </dl>
        <div className={styles.explanationPanel}>
          <h3>Why</h3>
          <p>{snapshot.selectedTypeFeedback}</p>
        </div>
      </section>
      <div className={styles.resultActions}>
        <button className={styles.primaryButton} type="button" onClick={onTryAnother}>Try Another</button>
      </div>
    </section>
  );
}
