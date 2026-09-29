import styles from "../model-update-reflex.module.css";

export function ModelUpdateIntro({ ready, onStart }: { ready: boolean; onStart: () => void }) {
  return (
    <section className={styles.intro} aria-labelledby="model-intro-title">
      <div className={styles.introVisual} aria-hidden="true">
        <div className={styles.modelSketch}>
          <span className={styles.eyebrow}>Forecast assumptions</span>
          {[0, 1, 2].map((index) => <div className={styles.sketchTrack} key={index}><i style={{ left: `${25 + index * 20}%` }} /></div>)}
          <span className={styles.sketchArrow}>↓</span>
          <div className={styles.sketchOutputs}><span>Revenue</span><span>Gross profit</span><span>Opex</span><strong>EBITDA</strong></div>
        </div>
      </div>
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>Equity Research · Forecast review</p>
        <h1 id="model-intro-title">New information.<br />A revised forecast.</h1>
        <p>Review the evidence, revise three assumptions, and watch their effects flow through the model.</p>
        <div className={styles.introBrief}>No timer. Explore the relationships before submitting your model update.</div>
        <button className={styles.primaryButton} disabled={!ready} onClick={onStart} type="button">
          {ready ? "Start Model Update" : "Preparing model"}
        </button>
      </div>
    </section>
  );
}
