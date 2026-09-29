import type { Ref } from "react";
import { formatAssumptionValue } from "../_lib/format-model-values";
import type { ModelUpdateResultSnapshot } from "../_lib/model-update-types";
import { ModelOutputComparison, OriginalForecast } from "./ModelOutputComparison";
import styles from "../model-update-reflex.module.css";

export function ModelUpdateResult({ snapshot, headingRef, onTryAnother }: {
  snapshot: ModelUpdateResultSnapshot; headingRef: Ref<HTMLHeadingElement>; onTryAnother: () => void;
}) {
  return (
    <section className={styles.workspace} aria-labelledby="model-result-title">
      <header className={styles.resultHeader}>
        <p className={styles.eyebrow}>Forecast review</p>
        <h1 id="model-result-title" ref={headingRef} tabIndex={-1}>Review the assumptions.<br />Follow the forecast.</h1>
        <p>Compare each revision with the reference, then examine the resulting model.</p>
      </header>
      <div className={styles.reviewList}>
        {snapshot.assumptionReviews.map((review) => (
          <article key={review.id} className={styles.review}>
            <div className={styles.reviewHeading}><h2>{review.label}</h2><p>{review.status === "onTarget" ? "On Target" : "Needs Adjustment"}</p></div>
            <dl className={styles.reviewValues}>
              <div><dt>Original forecast</dt><dd>{formatAssumptionValue(review.startingValue, review)}</dd></div>
              <div><dt>Your revision</dt><dd>{formatAssumptionValue(review.submittedValue, review)}</dd></div>
              <div><dt>Reference revision</dt><dd>{formatAssumptionValue(review.referenceValue, review)}</dd></div>
            </dl>
            <div className={styles.reasoning}><h3 className={styles.eyebrow}>Why</h3><p>{review.reasoning}</p></div>
          </article>
        ))}
      </div>
      <OriginalForecast outputs={snapshot.originalOutputs} unit={snapshot.financialUnit} />
      <div className={styles.resultComparison}>
        <ModelOutputComparison first={snapshot.learnerOutputs} second={snapshot.referenceOutputs}
          firstLabel="Your Revised Model" secondLabel="Reference Revision" unit={snapshot.financialUnit} />
      </div>
      <section className={styles.summary}><h2 className={styles.eyebrow}>Model review</h2><p>{snapshot.resultSummary}</p></section>
      <div className={styles.resultAction}><button className={styles.primaryButton} type="button" onClick={onTryAnother}>Try Another</button></div>
    </section>
  );
}
