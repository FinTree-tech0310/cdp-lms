import styles from "../analyst-note-editor.module.css";

interface AnalystNoteIntroProps {
  isReady: boolean;
  onStart: () => void;
}

export function AnalystNoteIntro({ isReady, onStart }: AnalystNoteIntroProps) {
  return (
    <section className={styles.introPanel} aria-labelledby="analyst-note-title">
      <div className={styles.introVisual} aria-hidden="true">
        <div className={styles.introDocument}>
          <div className={styles.introDocumentHeader}>
            <span>Draft note</span>
            <i />
          </div>
          <p />
          <p className={styles.introMarkedLine} />
          <p />
          <p />
          <span className={styles.introEditMark}>Review</span>
        </div>
      </div>

      <div className={styles.introContent}>
        <p className={styles.eyebrow}>Equity Research · Editorial review</p>
        <h1 id="analyst-note-title">Challenge every claim before clients read it.</h1>
        <p className={styles.introCopy}>
          Review a complete draft note and flag only the lines whose evidence,
          independence, or wording needs another look.
        </p>
        <div className={styles.introBrief}>
          <p><strong>One draft.</strong> Every line is reviewable.</p>
          <p>No timer. Read carefully and submit whenever your review is complete.</p>
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          disabled={!isReady}
          onClick={onStart}
        >
          {isReady ? "Open Draft Note" : "Preparing note"}
        </button>
      </div>
    </section>
  );
}
