import styles from "../variant-perception.module.css";
export function VariantIntro({ ready, onStart }: { ready: boolean; onStart: () => void }) {
  return <section className={styles.intro} aria-labelledby="variant-intro-title">
    <div className={styles.introMark} aria-hidden="true"><span>Research</span><i /><i /><i /><span>Publication</span></div>
    <div><p className={styles.eyebrow}>Equity Research · Publication judgment</p>
      <h1 id="variant-intro-title">Variant Perception</h1>
      <p className={styles.introText}>Your research differs from the Street. Decide how strongly to publish your view, then see what happened months later.</p>
      <p className={styles.introNote}>No timer. Make your call, read its consequence, and optionally explore the other paths.</p>
      <button className={styles.primary} type="button" disabled={!ready} onClick={onStart}>Start</button>
    </div>
  </section>;
}
