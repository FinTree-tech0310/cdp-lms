import type { Ref } from "react";
import type { VariantOption } from "../_lib/variant-perception-types";
import { variantLabel } from "../_lib/variant-options";
import styles from "../variant-perception.module.css";
export function AlternativePaths({ outcomes, headingRef }: { outcomes: readonly Readonly<VariantOption>[]; headingRef: Ref<HTMLHeadingElement> }) {
  return <section id="variant-other-paths" className={styles.alternatives} aria-labelledby="variant-other-title">
    <h2 id="variant-other-title" ref={headingRef} tabIndex={-1}>Other Paths</h2>
    <p className={styles.counterfactualNote}>Counterfactual outcomes — what if you had made a different call?</p>
    <div className={styles.alternativeGrid}>{outcomes.map(option => <article key={option.optionId} data-alternative-path={option.optionId}>
      <p className={styles.eyebrow}>What if you had…</p><h3>{variantLabel(option.optionId)}</h3><p className={styles.narrative}>{option.outcome}</p>
    </article>)}</div>
  </section>;
}
