import type { Ref } from "react";
import type { VariantOptionId } from "../_lib/variant-perception-types";
import { variantLabel } from "../_lib/variant-options";
import styles from "../variant-perception.module.css";
export function PublicationDecision({ setupContext, order, selected, headingRef, onSelect, onSubmit }: {
  setupContext: string; order: readonly VariantOptionId[]; selected: VariantOptionId | null;
  headingRef: Ref<HTMLHeadingElement>; onSelect: (id: VariantOptionId) => void; onSubmit: () => void;
}) {
  return <section className={styles.workspace} aria-labelledby="variant-decision-title">
    <header className={styles.heading}><p className={styles.eyebrow}>Variant Perception</p>
      <h1 id="variant-decision-title" ref={headingRef} tabIndex={-1}>Your research vs. the Street</h1>
    </header>
    <div className={styles.context}><p>{setupContext}</p></div>
    <fieldset className={styles.choices}>
      <legend>How do you publish the view?</legend>
      <div className={styles.optionGrid}>{order.map(id => <label key={id} className={styles.option}>
        <input type="radio" name="variant-publication" value={id} checked={selected === id} onChange={() => onSelect(id)} />
        <span className={styles.optionSurface}><span className={styles.radioMark} aria-hidden="true" /><span>{variantLabel(id)}</span></span>
      </label>)}</div>
    </fieldset>
    <div className={styles.decisionActions}><p>Choose a publication approach. You can change it before submitting.</p>
      <button className={styles.primary} type="button" disabled={!selected} onClick={onSubmit}>Publish Decision</button>
    </div>
  </section>;
}
