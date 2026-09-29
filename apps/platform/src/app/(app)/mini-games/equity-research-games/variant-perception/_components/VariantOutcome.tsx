import type { Ref } from "react";
import type { VariantResultSnapshot } from "../_lib/variant-perception-types";
import { variantLabel } from "../_lib/variant-options";
import { AlternativePaths } from "./AlternativePaths";
import styles from "../variant-perception.module.css";
export function VariantOutcome({ snapshot, showOtherPaths, headingRef, alternativesRef, onReveal, onTryAnother }: {
  snapshot: VariantResultSnapshot; showOtherPaths: boolean; headingRef: Ref<HTMLHeadingElement>;
  alternativesRef: Ref<HTMLHeadingElement>; onReveal: () => void; onTryAnother: () => void;
}) {
  return <section className={styles.workspace} aria-labelledby="variant-result-title">
    <header className={styles.heading}><p className={styles.eyebrow}>Variant Perception</p><h1 id="variant-result-title" ref={headingRef} tabIndex={-1}>Months Later</h1></header>
    <article className={styles.chosenPath} data-chosen-path={snapshot.selectedOptionId}>
      <p className={styles.eyebrow}>Your Path</p><h2>{variantLabel(snapshot.selectedOptionId)}</h2>
      <p className={styles.chosenNarrative}>{snapshot.selectedOutcome}</p>
    </article>
    {!showOtherPaths ? <button className={styles.secondary} type="button" aria-expanded={false} onClick={onReveal}>See the Other Paths</button> :
      <AlternativePaths outcomes={snapshot.alternativeOutcomes} headingRef={alternativesRef} />}
    <div className={styles.resultActions}><button className={styles.primary} type="button" onClick={onTryAnother}>Try Another</button></div>
  </section>;
}
